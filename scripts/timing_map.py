"""M1: build timing/timing_map.json on the locked master's timeline.

Adapted from Folks Like Us. Inputs are the guide stems (scripts/guide_stems.py: stems re-edited like the master).
- Words: WhisperX forced alignment (wav2vec2, English) of lyrics/as_sung.txt against timing/guide/vocals.wav, one
  segment per lyric line. Line windows come from the master-timeline transcript (timing/whisper_master_lead.json)
  as anchors; lines with no anchor take a window from config/timing.json.
- Refine: word starts in silence and ends before pauses are moved to the vocals guide's level (as in Folks).
- Beats: librosa on the drums guide over the band span (quarter notes, ~224 bpm); bars = 4 beats, phase = the offset
  with the strongest low-band onsets. The coda (piano, no drums) is tracked separately on the keys guide, approximate.
- Sections: sung sections span their lines; Instrumental = end of Break to start of Verse 3; Silence = the gap.
- Writes timing/as_sung_lines.srt and timing/as_sung_words.srt for checking sync against the master by ear.
Usage: <venv>/bin/python -I scripts/timing_map.py
"""
import difflib
import hashlib
import json
import re
from pathlib import Path

import librosa
import numpy as np
import soundfile as sf
import whisperx

MASTER_CFG = json.load(open("config/master.json"))
CFG = json.load(open("config/timing.json"))
MASTER = Path(MASTER_CFG["locked"]["file"])
GUIDE = Path("timing/guide")
LYRICS = Path("lyrics/as_sung.txt")
TRANSCRIPT = Path("timing/whisper_master_lead.json")
OUT = Path("timing/timing_map.json")
SR_BEAT, HOP = 22050, 256


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def norm(word):
    return re.sub(r"[^a-z']", "", word.lower().replace("’", "'"))


def parse_lyrics():
    sections = []
    for raw in LYRICS.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line:
            continue
        m = re.match(r"\[(.+?)\]\s*(?:\((.+)\))?$", line)
        if m:
            sections.append({"name": m.group(1), "note": m.group(2), "lines": []})
        else:
            sections[-1]["lines"].append(line)
    return sections


def line_windows(keys, lines, transcript_words, duration):
    overrides = {k: v for k, v in CFG["line_window_overrides"].items() if not k.startswith("_")}
    lyric_tokens = [(i, norm(w)) for i, text in enumerate(lines) for w in text.split() if keys[i] not in overrides]
    trans = [w for w in transcript_words if w["start"] >= 0]
    sm = difflib.SequenceMatcher(a=[t for _, t in lyric_tokens], b=[norm(w["w"]) for w in trans], autojunk=False)
    first, last = {}, {}
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            li, w = lyric_tokens[a + k][0], trans[b + k]
            first.setdefault(li, w["start"])
            last[li] = w["end"]
    for i, key in enumerate(keys):
        if key in overrides:
            first[i], last[i] = overrides[key]
    missing = [lines[i] for i in range(len(lines)) if i not in first]
    if missing:
        raise SystemExit(f"no transcript anchor for lines {missing}")
    windows = []
    for i, key in enumerate(keys):
        if key in overrides:
            windows.append(tuple(overrides[key]))
            continue
        start = last[i - 1] + 0.02 if i > 0 else max(0.0, first[i] - 2.0)
        end = first[i + 1] - 0.02 if i + 1 < len(lines) else min(duration, last[i] + 1.0)
        windows.append((start, end))
    return windows


def align_words(sections, duration):
    keys = [f"{s['name']}|{j}" for s in sections for j in range(len(s["lines"]))]
    lines = [text for s in sections for text in s["lines"]]
    twords = [w for seg in json.load(open(TRANSCRIPT))["segments"] for w in seg["words"]]
    windows = line_windows(keys, lines, twords, duration)
    audio = whisperx.load_audio(str(GUIDE / "vocals.wav"))
    model, meta = whisperx.load_align_model(language_code="en", device="cuda")
    segments = [{"start": a, "end": b, "text": text} for text, (a, b) in zip(lines, windows)]
    aligned = whisperx.align(segments, model, meta, audio, "cuda", return_char_alignments=False)["segments"]
    flat = [w for seg in aligned for w in seg["words"]]
    if [w["word"] for w in flat] != [w for text in lines for w in text.split()]:
        raise SystemExit("aligned words differ from the lyrics")
    pos, k = 0, 0
    for s in sections:
        out = []
        for text in s["lines"]:
            n = len(text.split())
            words = [{"w": w["word"], "start": round(w["start"], 3), "end": round(w["end"], 3),
                      "score": round(w.get("score", 0.0), 3)} for w in flat[pos:pos + n]]
            pos += n
            out.append({"text": text, "start": words[0]["start"], "end": words[-1]["end"],
                        "window": [round(windows[k][0], 3), round(windows[k][1], 3)], "words": words})
            k += 1
        s["lines"] = out


def vocal_db(frame_s=0.02):
    x, sr = sf.read(GUIDE / "vocals.wav")
    hop = int(sr * frame_s)
    n = len(x) // hop
    return 20 * np.log10(np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(axis=1)) + 1e-12)


def refine(sections, frame_s=0.02, below_median_db=10.0, gap_s=0.25):
    """As in Folks Like Us: move starts in silence to the first onset, and ends before a pause to where the voice drops."""
    db = vocal_db(frame_s)
    thr = np.median(db[db > -50]) - below_median_db
    loud = db >= thr
    words = [w for s in sections for line in s["lines"] for w in line["words"]]
    f = lambda t: int(round(t / frame_s))
    for i, w in enumerate(words):
        a, b = f(w["start"]), f(w["end"])
        if not loud[a:a + 3].all():
            onset = next((k for k in range(a, b) if loud[k:k + 3].all()), None)
            if onset is not None:
                w["start_aligner"], w["start"] = w["start"], round(onset * frame_s, 3)
        nxt = words[i + 1]["start"] if i + 1 < len(words) else len(db) * frame_s
        if nxt - w["end"] >= gap_s or (w["end"] - w["start"] > 1.5 and nxt - w["end"] < 0.05):
            k = f(w["start"] + 0.1)
            while k < f(nxt) and loud[k:k + 5].any():
                k += 1
            w["end_aligner"], w["end"] = w["end"], round(min(k * frame_s, nxt), 3)
    for s in sections:
        for line in s["lines"]:
            line["start"], line["end"] = line["words"][0]["start"], line["words"][-1]["end"]
    return round(float(thr), 1)


def track(path, span, start_bpm):
    y, _ = librosa.load(path, sr=SR_BEAT, mono=True)
    a, b = int(span[0] * SR_BEAT), int(span[1] * SR_BEAT)
    seg = y[a:b]
    tempo, frames = librosa.beat.beat_track(y=seg, sr=SR_BEAT, hop_length=HOP, start_bpm=start_bpm, tightness=400)
    times = librosa.frames_to_time(frames, sr=SR_BEAT, hop_length=HOP) + span[0]
    return seg, frames, float(np.atleast_1d(tempo)[0]), times


def beats():
    c = CFG["beats"]
    seg, frames, tempo, times = track(GUIDE / "drums.wav", c["band_span"], c["start_bpm"])
    low = librosa.onset.onset_strength(y=seg, sr=SR_BEAT, hop_length=HOP, fmax=200)
    strength = [low[frames[p::4]].sum() for p in range(4)]
    phase = int(np.argmax(strength))
    _, _, coda_tempo, coda_times = track(GUIDE / "keys.wav", c["coda_span"], c["coda_start_bpm"])
    r = lambda ts: [round(float(t), 3) for t in ts]
    return {"band": {"tempo_bpm": round(tempo, 2), "beats": r(times), "bar_phase": phase,
                     "bar_strength_by_phase": [round(float(s), 1) for s in strength], "downbeats": r(times[phase::4])},
            "coda": {"tempo_bpm": round(coda_tempo, 2), "beats": r(coda_times),
                     "note": "piano only; approximate, check by ear before cutting to it"}}


def srt_time(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def write_srt(path, items):
    with open(path, "w", encoding="utf-8") as f:
        for n, (a, b, text) in enumerate(items, 1):
            f.write(f"{n}\n{srt_time(a)} --> {srt_time(b)}\n{text}\n\n")


def main():
    info = sf.info(MASTER)
    duration = round(info.frames / info.samplerate, 3)
    sections = parse_lyrics()
    align_words(sections, duration)
    thr = refine(sections)
    for s in sections:
        if s["lines"]:
            s["start"], s["end"] = s["lines"][0]["start"], s["lines"][-1]["end"]
    by = {s["name"]: s for s in sections}
    by["Intro"]["start"] = 0.0                                    # banjo vamp before the announcer
    by["Instrumental"]["start"], by["Instrumental"]["end"] = by["Break"]["end"], by["Verse 3"]["start"]
    gap0 = MASTER_CFG["head_end"]
    by["Silence"]["start"], by["Silence"]["end"] = gap0, round(gap0 + MASTER_CFG["gap_s"], 3)
    by["Final chorus"]["end"] = gap0                              # the band rings out to the cut
    by["Coda"]["end"] = duration                                  # includes the extend's band tag
    tm = {
        "generated_by": "scripts/timing_map.py",
        "fps": 24,
        "audio": {"master": str(MASTER), "sha256": sha256(MASTER), "duration_s": duration},
        "alignment": {"method": "whisperx.align (wav2vec2 en), one segment per lyric line",
                      "audio": str(GUIDE / "vocals.wav"), "lyrics": str(LYRICS), "anchors": str(TRANSCRIPT),
                      "refined": f"vocals-guide level threshold {thr} dB; originals kept as start_aligner/end_aligner"},
        "beats": beats(),
        "sections": sections,
        "events": {"first_vocal": by["Intro"]["lines"][0]["start"], "cut": gap0,
                   "coda_first_vocal": by["Coda"]["lines"][0]["start"], "coda_last_vocal": by["Coda"]["end_vocal"]
                   if "end_vocal" in by["Coda"] else by["Coda"]["lines"][-1]["end"], "music_end": duration},
    }
    OUT.parent.mkdir(exist_ok=True)
    json.dump(tm, open(OUT, "w"), indent=1, ensure_ascii=False)
    lines = [l for s in sections for l in s["lines"]]
    write_srt(OUT.parent / "as_sung_lines.srt", [(l["start"], l["end"], l["text"]) for l in lines])
    words = [w for l in lines for w in l["words"]]
    write_srt(OUT.parent / "as_sung_words.srt", [(w["start"], max(w["end"], w["start"] + 0.15), w["w"]) for w in words])
    b = tm["beats"]["band"]
    print(f"band {b['tempo_bpm']} bpm, {len(b['beats'])} beats, bar phase {b['bar_phase']} {b['bar_strength_by_phase']}; "
          f"coda {tm['beats']['coda']['tempo_bpm']} bpm")
    for s in sections:
        print(f"{s['name']:13s} {s['start']:7.2f}-{s['end']:7.2f}  {len(s['lines'])} lines")
    print(f"{len(words)} words; low score (<0.3): {[(w['w'], w['start'], w['score']) for w in words if w['score'] < 0.3]}")


if __name__ == "__main__":
    main()
