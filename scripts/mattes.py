"""M4: turn the shadow-play clips (backlit silhouettes, config/clips.json S23band, S23kick, S28run) into clean mattes.

Per clip: Otsu threshold on the luma of 8 sampled frames (black figures vs the white screen), then ffmpeg maps
luma below the threshold to black and above to white, with a 0.8 px blur so edges stay soft after the film
layer's own softening. Output: public/media/picks/<clip>_matte.mp4 (gray, 24 fps), for src/Main.tsx to multiply
onto the pale stage.
Usage: <venv>/bin/python -I scripts/mattes.py [clip ...]
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

kept = json.load(open("config/clips.json"))["kept"]
clips = sys.argv[1:] or [k for k in kept if k.startswith("S")]
out = Path("public/media/picks"); out.mkdir(parents=True, exist_ok=True)


def otsu(x):
    h, _ = np.histogram(x, bins=256, range=(0, 256))
    p = h / h.sum(); w = np.cumsum(p); mu = np.cumsum(p * np.arange(256)); mt = mu[-1]
    sb = (mt * w - mu) ** 2 / (w * (1 - w) + 1e-12)
    return int(np.argmax(sb))


for clip in clips:
    src = kept[clip]
    w, h = 480, 352
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vf", f"select='not(mod(n\\,12))',scale={w}:{h},format=gray",
                          "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    t = otsu(np.frombuffer(raw, np.uint8))
    dest = out / f"{clip}_matte.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf",
                    f"format=gray,lutyuv=y='if(lt(val\\,{t})\\,0\\,255)',"
                    # the backlit screen's frame and the stage edge read as black: paint the outer border white
                    "drawbox=x=0:y=ih*0.88:w=iw:h=ih*0.12:color=white:t=fill,drawbox=x=0:y=0:w=iw:h=ih*0.05:color=white:t=fill,"
                    "drawbox=x=0:y=0:w=iw*0.05:h=ih:color=white:t=fill,drawbox=x=iw*0.95:y=0:w=iw*0.05:h=ih:color=white:t=fill,"
                    "gblur=sigma=0.8,format=yuv420p",
                    "-c:v", "libx264", "-crf", "16", "-an", str(dest)], check=True)
    print(f"{clip}: threshold {t} -> {dest}")
