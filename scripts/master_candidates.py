"""M0 (pre-M1): build candidate masters for the cut, the four-second silence and the coda join, for the human to pick by ear.

The Suno take (clip 2414ddab) is one generation with the coda inside it. It stops near "mar—" (hits at 149.70,
150.25, 150.75 s; brass gone by 150.70 s), rings out to 151.80 s, then the band re-enters at 151.85 s for ~18 s of
instrumental before the coda's first word at 169.61 s. The brief wants: cut on the first syllable of "mar—",
four seconds of silence (room tone + crackle), ticker sound, then the coda. The ticker is not in these candidates;
the human supplies it (brief, "Inputs").

Each candidate = take[0:cut] (3 ms fade-out, so the cut is abrupt but not a click) + 4.0 s of seeded synthetic
shellac crackle + take[CODA_IN:] (10 ms fade-in). Writes full masters and short listening clips.
Usage: <venv>/bin/python scripts/master_candidates.py  ->  timing/cut_candidates/
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf

SRC = "audio/track/Buy It On Margin.wav"
OUT = Path("timing/cut_candidates")
SEED = 1929                       # brief: main video seed
SILENCE_S = 4.0
CODA_IN = 169.20                  # coda onset at ~169.35 s; start just before so the piano pickup isn't clipped
CUTS = {"A": 150.80, "B": 150.88, "C": 150.96}   # 50/130/210 ms into the "mar—" hit at 150.75 s
CRACKLE_DBFS = -42.0              # hiss level, near the take's own noise floor in its quiet passages

audio, sr = sf.read(SRC, always_2d=True)
rng = np.random.default_rng(SEED)

def crackle(seconds):
    n = int(seconds * sr)
    hiss = rng.normal(0, 1, n)
    hiss = np.convolve(hiss, np.ones(8) / 8, mode="same")          # soften to a band-limited hiss
    hiss *= 10 ** (CRACKLE_DBFS / 20) / (hiss.std() + 1e-12)
    pops = np.zeros(n)
    for t in rng.choice(n - 200, size=int(seconds * 9), replace=False):  # ~9 pops/s
        amp = 10 ** (rng.uniform(-38, -22) / 20) * rng.choice([-1, 1])
        pops[t:t + 200] += amp * np.exp(-np.arange(200) / rng.uniform(8, 40))
    mono = hiss + pops
    return np.stack([mono, mono], axis=1)                              # the take is narrow mono-ish; keep it mono

def fade(x, ms, out=True):
    k = int(sr * ms / 1000); r = np.linspace(1, 0, k) if out else np.linspace(0, 1, k)
    x = x.copy(); (x[-k:] if out else x[:k])[:] *= r[:, None]; return x

OUT.mkdir(parents=True, exist_ok=True)
gap = crackle(SILENCE_S)
coda = fade(audio[int(CODA_IN * sr):], 10, out=False)
report = {"source": SRC, "seed": SEED, "silence_s": SILENCE_S, "coda_in_s": CODA_IN, "candidates": {}}
for name, cut in CUTS.items():
    head = fade(audio[:int(cut * sr)], 3)
    full = np.concatenate([head, gap, coda])
    sf.write(OUT / f"master_{name}.wav", full, sr, subtype="PCM_24")
    a, b = int((cut - 6) * sr), int((cut + SILENCE_S + 6) * sr)
    sf.write(OUT / f"listen_{name}.wav", full[a:b], sr, subtype="PCM_24")
    report["candidates"][name] = {"cut_s": cut, "coda_starts_at_s": round(cut + SILENCE_S, 3),
                                  "duration_s": round(len(full) / sr, 3), "listen_clip": f"listen_{name}.wav",
                                  "listen_clip_covers_s": [round(cut - 6, 2), "→ cut → 4 s → coda + 6 s"]}
json.dump(report, open(OUT / "candidates.json", "w"), indent=1)
print(json.dumps(report, indent=1))
