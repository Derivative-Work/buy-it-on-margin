"""M5: thumbnails from the N30 freeze (brief: "the N30 freeze mid-kick"), with the title in the card face.

Input: out/m4/n30_freeze.png, a 1080p frame of the main edit at N30's first frame, captions off:
  npx remotion still src/index.ts Main out/m4/n30_freeze.png --frame=<N30 start + 1> --props='{"captions":false}'
and, per Short in config/shorts.json whose "thumb" is a time, out/m4/thumb_<id>.png, the frame at that time (same flags).
Outputs: deliverables/buy_it_on_margin_thumbnail.jpg (1280x720) and deliverables/buy_it_on_margin_short_<id>_thumbnail.jpg
(1080x1920) per Short, with its tagline.
Usage: <venv>/bin/python -I scripts/thumbnail.py
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont

src = Image.open("out/m4/n30_freeze.png").convert("RGB")
pic = src.crop((240, 0, 1680, 1080))                     # the 4:3 picture
TITLE = ImageFont.truetype("public/fonts/Limelight-Regular.ttf", 150)
SUB = ImageFont.truetype("public/fonts/OldStandard-Italic.ttf", 64)
INK, PAPER = (8, 8, 8), (239, 235, 225)


def banner(d, w, y, title_font, sub_font, sub=True):
    tw = d.textlength("BUY IT ON MARGIN", font=title_font)
    d.text(((w - tw) / 2 + 5, y + 5), "BUY IT ON MARGIN", font=title_font, fill=INK)   # drop shadow
    d.text(((w - tw) / 2, y), "BUY IT ON MARGIN", font=title_font, fill=PAPER)
    if sub:
        s = "1929, again"
        sw = d.textlength(s, font=sub_font)
        d.text(((w - sw) / 2, y + title_font.size * 1.12), s, font=sub_font, fill=(214, 208, 196))


# 16:9: the picture fills the frame (cropped to 16:9), darkened band for the title at the top
im = pic.resize((1280, 960)).crop((0, 120, 1280, 840))
band = Image.new("RGB", im.size, INK)
fade = Image.new("L", im.size)                           # dark at the top, clear by 42% down
fade.putdata([int(225 * max(0.0, 1 - (y / (0.42 * 720)))) for y in range(720) for _ in range(1280)])
im = Image.composite(band, im, fade)
d = ImageDraw.Draw(im)
banner(d, 1280, 34, ImageFont.truetype("public/fonts/Limelight-Regular.ttf", 112), ImageFont.truetype("public/fonts/OldStandard-Italic.ttf", 48))
im.save("deliverables/buy_it_on_margin_thumbnail.jpg", quality=92)

# 9:16, per Short: title above, the 4:3 picture in the middle (as in the Short), its tagline below
import json
tag = ImageFont.truetype("public/fonts/OldStandard-Italic.ttf", 52)
for sid, c in json.load(open("config/shorts.json"))["shorts"].items():
    frame = src if c["thumb"] == "N30" else Image.open(f"out/m4/thumb_{sid}.png").convert("RGB")
    v = Image.new("RGB", (1080, 1920), (5, 5, 5))
    v.paste(frame.crop((240, 0, 1680, 1080)).resize((1080, 810)), (0, 560))
    d = ImageDraw.Draw(v)
    banner(d, 1080, 250, ImageFont.truetype("public/fonts/Limelight-Regular.ttf", 100), ImageFont.truetype("public/fonts/OldStandard-Italic.ttf", 50))
    for i, line in enumerate(c["tagline"]):
        lw = d.textlength(line, font=tag)
        d.text(((1080 - lw) / 2, 1460 + i * 72), line, font=tag, fill=(214, 208, 196))
    v.save(f"deliverables/buy_it_on_margin_short_{sid}_thumbnail.jpg", quality=92)
print("thumbnails written")
