"""Rebuild stems on the master timeline with the same edit as scripts/build_master.py, for analysis only.

head = v1 stem [0, head_end); gap = silence; coda = v2 stem [coda_in, end). Stems are pre-post-filter, which is
fine for timing: the post-filter keeps length and has 0-sample lag (production log, step 7).
Usage: <venv>/bin/python -I scripts/guide_stems.py  ->  timing/guide/{vocals,drums,keys}.wav (48 kHz mono)
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf

cfg = json.load(open("config/master.json"))
SR = 48000
GROUPS = {  # guide name -> (v1 stems, v2 stems)
    "vocals": (["0 Lead Vocals", "1 Backing Vocals"], ["0 Lead Vocals", "1 Backing Vocals"]),
    "lead": (["0 Lead Vocals"], ["0 Lead Vocals"]),
    "backing": (["1 Backing Vocals"], ["1 Backing Vocals"]),
    "drums": (["2 Drums", "6 Percussion"], ["2 Drums", "6 Percussion"]),
    "keys": (["5 Keyboard"], ["5 Keyboard"]),
}
out = Path("timing/guide"); out.mkdir(parents=True, exist_ok=True)
h, g, c = int(cfg["head_end"] * SR), int(cfg["gap_s"] * SR), int(cfg["coda_in"] * SR)
for name, (s1, s2) in GROUPS.items():
    a = sum(sf.read(f"audio/stems/{s}.wav", always_2d=True)[0].mean(1) for s in s1)[:h]
    b = sum(sf.read(f"audio/stems_v2/{s}.wav", always_2d=True)[0].mean(1) for s in s2)[c:]
    x = np.concatenate([a, np.zeros(g), b])
    sf.write(out / f"{name}.wav", x, SR, subtype="FLOAT")
    print(name, round(len(x) / SR, 3))
