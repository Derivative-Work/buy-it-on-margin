"""M1: resolve every shot cue (config/shot_cues.json) to master time and frames: timing/shot_times.json.

Cues as in Folks Like Us ("Section|line|word", "end:…", "mid:…", "t:<s>", "section:<name>"), plus:
- snap: move the start onto a band beat: the beat at or just before the word if within 200 ms (sung onsets lag
  the beat by ~80-130 ms), else the nearest within half a beat (cards and cuts land on a beat);
- insert_picture_frames: a one-frame insert (1/18 s per picture frame) that returns to the previous shot;
- end: "hold": end at the card's hold time, even past the music (credits over crackle);
- card: checks the brief's hold rule (>= 1.5 s + 1 s per 3 words) and reports shots that are too short.
Frames at 24 fps; frame = round(t * 24). Usage: python3 -I scripts/shot_times.py
"""
import json
from pathlib import Path

CUES, CARDS, TIMING = Path("config/shot_cues.json"), Path("config/cards.json"), Path("timing/timing_map.json")
OUT, FPS, PICTURE_FPS = Path("timing/shot_times.json"), 24, 18


def resolve(cue, tm):
    if cue.startswith("t:"):
        return float(cue[2:]), cue
    if cue.startswith("section:"):
        return next(s for s in tm["sections"] if s["name"] == cue[8:])["start"], cue
    kind, _, ref = cue.partition(":") if cue[:4] in ("end:", "mid:") else ("start", "", cue)
    section, line, word = ref.split("|")
    w = next(s for s in tm["sections"] if s["name"] == section)["lines"][int(line)]["words"][int(word)]
    t = {"start": w["start"], "end": w["end"], "mid": (w["start"] + w["end"]) / 2}[kind]
    return t, f"{ {'start': '', 'end': 'end of ', 'mid': 'middle of '}[kind]}{w['w']!r} ({section} {line}.{word})"


def main():
    tm = json.load(open(TIMING))
    cards = json.load(open(CARDS))["cards"]
    beats = tm["beats"]["band"]["beats"]
    half = (beats[-1] - beats[0]) / (len(beats) - 1) / 2
    end_music = tm["audio"]["duration_s"]
    rows = []
    for s in json.load(open(CUES))["shots"]:
        t, label = resolve(s["cue"], tm)
        raw = t
        if s.get("snap"):
            # Sung onsets land ~80-130 ms after their beat, so take the beat at (or just after) the word's onset
            # if it is within 200 ms before it; otherwise the nearest beat within half a beat.
            before = [b for b in beats if b <= t + 0.03]
            if before and t - before[-1] <= 0.2:
                t = before[-1]
            else:
                b = min(beats, key=lambda x: abs(x - t))
                if abs(b - t) <= half:
                    t = b
        rows.append({**s, "t": t, "raw": raw, "label": label})
    main_rows = [r for r in rows if "insert_picture_frames" not in r]
    if [r["t"] for r in main_rows] != sorted(r["t"] for r in main_rows):
        raise SystemExit("shot cues are out of order")
    out, problems = {}, []
    for i, r in enumerate(main_rows):
        end = main_rows[i + 1]["t"] if i + 1 < len(main_rows) else end_music
        if r.get("end") == "hold":                    # e.g. credits that run past the music
            end = r["t"] + 1.5 + len(cards[r["card"]]["text"].split()) / 3
        out[r["id"]] = {"start": round(r["t"], 3), "end": round(end, 3), "duration": round(end - r["t"], 3),
                        "start_frame": round(r["t"] * FPS), "end_frame": round(end * FPS), "cue": r["label"],
                        "snapped_ms": round((r["t"] - r["raw"]) * 1000)}
        if r.get("card"):
            words = len(cards[r["card"]]["text"].split())
            need = 1.5 + words / 3
            out[r["id"]]["card_hold_needed_s"] = round(need, 2)
            if end - r["t"] < need - 1e-6:
                problems.append(f"{r['id']}: {end - r['t']:.2f} s < hold {need:.2f} s ({words} words)")
        if r.get("note"):
            out[r["id"]]["note"] = r["note"]
    for r in rows:
        if "insert_picture_frames" in r:
            d = r["insert_picture_frames"] / PICTURE_FPS
            out[r["id"]] = {"start": round(r["t"], 3), "end": round(r["t"] + d, 3), "duration": round(d, 3),
                            "start_frame": round(r["t"] * FPS), "end_frame": round((r["t"] + d) * FPS),
                            "cue": r["label"], "insert_over": "previous shot", "note": r.get("note")}
    order = sorted(out, key=lambda k: out[k]["start"])
    video_end = max(s["end"] for s in out.values())
    json.dump({"generated_by": "scripts/shot_times.py", "fps": FPS, "picture_fps": PICTURE_FPS,
               "music_end": end_music, "video_end": round(video_end, 3), "video_end_frame": round(video_end * FPS),
               "master_sha256": tm["audio"]["sha256"], "shots": {k: out[k] for k in order},
               "hold_problems": problems}, open(OUT, "w"), indent=1, ensure_ascii=False)
    for k in order:
        s = out[k]
        print(f"{k:5s} {s['start']:7.2f}-{s['end']:7.2f} ({s['duration']:5.2f} s, f{s['start_frame']}-{s['end_frame']})"
              f" snap {s.get('snapped_ms', 0):+4d}ms  {s['cue']}")
    print(f"music ends {end_music:.2f} s; video ends {video_end:.2f} s")
    print("HOLD PROBLEMS:", *problems, sep="\n  ")


if __name__ == "__main__":
    main()
