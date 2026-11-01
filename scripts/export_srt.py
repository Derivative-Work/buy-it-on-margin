"""M5: captions as an SRT, from the lyrics as sung and the timing map, by the rule in config/captions.json.

src/Captions.tsx applies the same rule to the burned-in captions, so the two match frame for frame.
Usage: python3 -I scripts/export_srt.py [out=deliverables/buy_it_on_margin.en.srt] [offset_s=opening card length] [from_s] [to_s]
       (the Shorts cut passes its offset and range)
"""
import json
import sys

tm = json.load(open("timing/timing_map.json"))
rule = json.load(open("config/captions.json"))
out = sys.argv[1] if len(sys.argv) > 1 else "deliverables/buy_it_on_margin.en.srt"
offset = float(sys.argv[2]) if len(sys.argv) > 2 else json.load(open("timing/shot_times.json"))["intro"]["duration_s"]
lo = float(sys.argv[3]) if len(sys.argv) > 3 else -1e9
hi = float(sys.argv[4]) if len(sys.argv) > 4 else 1e9


def cues():
    lines = [l for s in tm["sections"] for l in s["lines"]]
    for i, l in enumerate(lines):
        nxt = lines[i + 1]["start"] if i + 1 < len(lines) else 1e9
        end = max(l["start"] + rule["min_s"], min(nxt, l["end"] + rule["tail_s"]))
        yield l["start"], end, l["text"]


def ts(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


n = 0
with open(out, "w", encoding="utf-8") as f:
    for a, b, text in cues():
        if a < lo or a >= hi:          # a cue must start inside the range (no clipped tails)
            continue
        a, b = max(a, lo), min(b, hi)
        n += 1
        f.write(f"{n}\n{ts(a + offset)} --> {ts(b + offset)}\n{text}\n\n")
print(out, n, "cues")
