"""M2: pre-render the film-grain loop once (brief: 'render once, reuse').

24 grayscale PNGs at 960x720 (shown at 1440x1080, so each grain is ~1.5 px), mid-gray 128 +- noise, blurred slightly
so it reads as clumped silver rather than digital noise. Seed from config/seeds.json.
Usage: <venv>/bin/python -I scripts/grain_plates.py  ->  public/grain/grain_00.png ... grain_23.png
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

seed = json.load(open("config/seeds.json"))["seed"]
rng = np.random.default_rng(seed)
out = Path("public/grain"); out.mkdir(parents=True, exist_ok=True)
for i in range(24):
    n = rng.normal(0, 1, (720, 960))
    im = Image.fromarray(np.clip(128 + n * 60, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    a = np.asarray(im).astype(float); a = 128 + (a - 128) * (40 / (a.std() + 1e-9))   # fixed contrast after blur
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(out / f"grain_{i:02d}.png", optimize=True)
print("24 plates")
