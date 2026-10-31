"""Pad the locked master with the seeded crackle bed to the video's end (credits run past the music; human 2026-10-31).

The locked master is unchanged; this writes public/audio/master_padded.wav = master + crackle tail (same generator
and settings as the 4 s gap in scripts/build_master.py, seed + 1 so it isn't a copy), 300 ms crossfade-in.
Usage: <venv>/bin/python -I scripts/pad_master.py
"""
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

sys.argv = sys.argv[:1]
cfg = json.load(open("config/master.json"))
end_s = json.load(open("timing/shot_times.json"))["video_end"]
x, sr = sf.read(cfg["locked"]["file"], always_2d=True)
n = int(round(end_s * sr)) - len(x)
c = dict(cfg["crackle"]); c["seed"] += 1
rng = np.random.default_rng(c["seed"])
hiss = np.convolve(rng.normal(0, 1, n), np.ones(8) / 8, mode="same")
hiss *= 10 ** (c["hiss_dbfs"] / 20) / hiss.std()
pops = np.zeros(n)
for t in rng.choice(n - 200, size=int(n / sr * c["pops_per_s"]), replace=False):
    pops[t:t + 200] += 10 ** (rng.uniform(-38, -22) / 20) * rng.choice([-1, 1]) * np.exp(-np.arange(200) / rng.uniform(8, 40))
tail = np.stack([hiss + pops] * 2, 1)
k = int(0.3 * sr); tail[:k] *= np.linspace(0, 1, k)[:, None]
out = Path("public/audio"); out.mkdir(parents=True, exist_ok=True)
sf.write(out / "master_padded.wav", np.concatenate([x, tail]), sr, subtype="PCM_16")
print(f"master {len(x) / sr:.3f} s + crackle {n / sr:.3f} s = {end_s:.3f} s")
