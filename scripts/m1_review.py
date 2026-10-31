"""M1 gate: a review video to check the timing map by ear and eye.

Black 960x540 frame; top: shot ID, type and picture (from config/shot_descriptions.json) for each range in
timing/shot_times.json; bottom: the as-sung lyric line, with the current word highlighted; corner: bar.beat.
Audio: the locked master plus a quiet click on every band beat (higher on the downbeats of the chosen bar phase).
Usage: <venv>/bin/python -I scripts/m1_review.py  ->  timing/check/m1_review.mp4, timing/check/master_click.wav
"""
import json
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

tm = json.load(open("timing/timing_map.json"))
shots = json.load(open("timing/shot_times.json"))["shots"]
desc = {k: v for k, v in json.load(open("config/shot_descriptions.json")).items() if not k.startswith("_")}
cards = json.load(open("config/cards.json"))["cards"]
out = Path("timing/check"); out.mkdir(parents=True, exist_ok=True)
master, sr = sf.read(tm["audio"]["master"], always_2d=True)

# click track
band = tm["beats"]["band"]
down = set(band["downbeats"])
click = np.zeros(len(master))
for t in band["beats"]:
    f = 1760 if t in down else 1100
    n = int(0.025 * sr); env = np.exp(-np.arange(n) / (0.006 * sr))
    i = int(t * sr); click[i:i + n] += 0.12 * env * np.sin(2 * np.pi * f * np.arange(n) / sr)
mix = master + click[:, None]
mix *= min(1.0, 0.999 / np.abs(mix).max())
sf.write(out / "master_click.wav", mix, sr, subtype="PCM_24")

def ts(t):
    cs = int(round(t * 100)); return f"{cs // 360000}:{cs // 6000 % 60:02d}:{cs // 100 % 60:02d}.{cs % 100:02d}"

def esc(s):
    return s.replace("{", "(").replace("}", ")").replace("\n", " ")

ev = []
for sid, s in shots.items():
    d = desc.get(sid, {})
    card = cards.get(sid, {}).get("text") or next((cards[k]["text"] for k in cards if k.startswith(sid) and k != sid), "")
    top = f"{{\\b1}}{sid}{{\\b0}}  [{d.get('type', '')}]  {esc(d.get('picture', s.get('note', '')))}"
    if card:
        top += f"\\N{{\\c&H66CCFF&}}CARD: {esc(card)}"
    style = "Insert" if s.get("insert_over") else "Shot"
    end = max(s["end"], s["start"] + 0.6) if s.get("insert_over") else s["end"]
    ev.append(f"Dialogue: 1,{ts(s['start'])},{ts(end)},{style},,0,0,0,,{top}")
for sec in tm["sections"]:
    for line in sec["lines"]:
        ws = line["words"]
        for i, w in enumerate(ws):
            a = w["start"]; b = ws[i + 1]["start"] if i + 1 < len(ws) else max(w["end"], a + 0.3)
            text = " ".join((f"{{\\c&H00FFFF&}}{esc(x['w'])}{{\\c&HFFFFFF&}}" if j == i else esc(x["w"])) for j, x in enumerate(ws))
            ev.append(f"Dialogue: 0,{ts(a)},{ts(b)},Lyric,,0,0,0,,{{\\fs20}}{sec['name']}\\N{{\\fs30}}{text}")
    if not sec["lines"]:
        ev.append(f"Dialogue: 0,{ts(sec['start'])},{ts(sec['end'])},Lyric,,0,0,0,,{{\\fs20}}{sec['name']}")
beats = band["beats"]; ph = band["bar_phase"]
for i, t in enumerate(beats):
    e = beats[i + 1] if i + 1 < len(beats) else t + 0.27
    bar, beat = (i - ph) // 4 + 1, (i - ph) % 4 + 1
    ev.append(f"Dialogue: 0,{ts(t)},{ts(e)},Beat,,0,0,0,,bar {bar}.{beat}")
ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 960
PlayResY: 540

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Shot,DejaVu Sans,24,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,7,30,30,30,1
Style: Insert,DejaVu Sans,26,&H0000FF00,&H00FFFFFF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,1,0,5,30,30,30,1
Style: Lyric,DejaVu Sans,30,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,30,30,40,1
Style: Beat,DejaVu Sans Mono,20,&H00999999,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,9,20,20,250,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""" + "\n".join(ev) + "\n"
(out / "m1_review.ass").write_text(ass, encoding="utf-8")
dur = tm["audio"]["duration_s"]
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", f"color=c=black:s=960x540:r=24:d={dur}",
                "-i", str(out / "master_click.wav"), "-vf", f"ass={out / 'm1_review.ass'}", "-c:v", "libx264",
                "-preset", "veryfast", "-crf", "28", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
                "-shortest", str(out / "m1_review.mp4")], check=True)
print(out / "m1_review.mp4")
