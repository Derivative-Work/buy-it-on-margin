"""M3 gate: one contact sheet of every still item, one row per item, its takes labelled A-D with their seeds.

Usage: <venv>/bin/python -I scripts/contact_sheet.py [out=takes/stills/contact_sheet.jpg] [thumb_h=240]
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

CFG = json.load(open("config/stills.json"))
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "takes/stills/contact_sheet.jpg")
TH = int(sys.argv[2]) if len(sys.argv) > 2 else 240
F = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", max(14, TH // 10))
rows = []
for item, spec in CFG["items"].items():
    paths = sorted(Path(f"takes/stills/{item}").glob(f"{item}_*s*.png"))
    if paths:
        rows.append((item, spec, paths))
LABEL_W = int(TH * 1.1)
widths = [LABEL_W + sum(round(TH * Image.open(p).width / Image.open(p).height) + 8 for p in ps) for _, _, ps in rows]
sheet = Image.new("RGB", (max(widths) + 8, len(rows) * (TH + 8) + 8), (18, 18, 20))
d = ImageDraw.Draw(sheet)
for r, (item, spec, paths) in enumerate(rows):
    y = 8 + r * (TH + 8)
    d.text((8, y + 4), item, fill=(255, 255, 255), font=F)
    kept = CFG.get("kept", {}).get(item)
    if kept:
        d.text((8, y + 8 + TH // 8), f"kept {kept}", fill=(120, 255, 120), font=F)
    x = LABEL_W
    for k, p in enumerate(paths):
        im = Image.open(p).convert("RGB")
        w = round(TH * im.width / im.height)
        sheet.paste(im.resize((w, TH)), (x, y))
        seed = p.stem[len(item) + 1:].replace("_s", " ").lstrip("s")
        d.rectangle((x, y, x + TH * 0.62, y + TH // 8 + 4), fill=(0, 0, 0))
        d.text((x + 4, y + 2), f"{chr(65 + k)} {seed}", fill=(255, 210, 0), font=F)
        x += w + 8
sheet.save(OUT, quality=88)
print(OUT, sheet.size, len(rows), "items")
