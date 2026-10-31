"""M3: stills with FLUX.2 [dev] via ComfyUI (adapted from Folks Like Us).

For each item in config/stills.json and each seed: prompt = subject + ", " + style (brief: one shared style phrase),
render with the FLUX.2 text-to-image graph (the image_flux2_fp8 template's nodes), save
takes/stills/<item>/<item>_s<seed>.png, and append one row per take to shots/prompts.md (prompt files in
shots/prompts/<item>.txt). A 2x2 pick grid per item goes to takes/stills/review_<item>.png, and
scripts/contact_sheet.py lays all items out on one sheet.
Usage: <venv>/bin/python -I scripts/stills.py [item ...] [--seeds 1929,1930]   (ComfyUI must be running)
"""
import argparse
import datetime
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).parent))
import comfy_client as cc  # noqa: E402

CFG = json.load(open("config/stills.json"))
OUT = Path("takes/stills")
PROMPTS = Path("shots/prompts")
LOG = Path("shots/prompts.md")


def graph(prompt, seed, w, h, prefix):
    m = CFG["model"]
    return {
        "12": {"class_type": "UNETLoader", "inputs": {"unet_name": m["unet"], "weight_dtype": "default"}},
        "38": {"class_type": "CLIPLoader", "inputs": {"clip_name": m["clip"], "type": "flux2", "device": "default"}},
        "10": {"class_type": "VAELoader", "inputs": {"vae_name": m["vae"]}},
        "6": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["38", 0]}},
        "26": {"class_type": "FluxGuidance", "inputs": {"conditioning": ["6", 0], "guidance": m["guidance"]}},
        "22": {"class_type": "BasicGuider", "inputs": {"model": ["12", 0], "conditioning": ["26", 0]}},
        "25": {"class_type": "RandomNoise", "inputs": {"noise_seed": seed}},
        "16": {"class_type": "KSamplerSelect", "inputs": {"sampler_name": m["sampler"]}},
        "48": {"class_type": "Flux2Scheduler", "inputs": {"steps": m["steps"], "width": w, "height": h}},
        "47": {"class_type": "EmptyFlux2LatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
        "13": {"class_type": "SamplerCustomAdvanced",
               "inputs": {"noise": ["25", 0], "guider": ["22", 0], "sampler": ["16", 0], "sigmas": ["48", 0],
                          "latent_image": ["47", 0]}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["13", 0], "vae": ["10", 0]}},
        "9": {"class_type": "SaveImage", "inputs": {"images": ["8", 0], "filename_prefix": prefix}},
    }


def review_grid(item, paths):
    ims = [Image.open(p).convert("RGB") for p in paths]
    w = 960; h = round(w * ims[0].height / ims[0].width)
    grid = Image.new("RGB", (2 * w + 30, 2 * h + 90), (16, 16, 18))
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    d = ImageDraw.Draw(grid)
    d.text((12, 12), f"{item}: pick one", fill=(255, 255, 255), font=font)
    for k, (p, im) in enumerate(zip(paths, ims)):
        x, y = 10 + (k % 2) * (w + 10), 60 + (k // 2) * (h + 10)
        grid.paste(im.resize((w, h)), (x, y))
        d.rectangle((x, y, x + 260, y + 40), fill=(0, 0, 0))
        d.text((x + 8, y + 6), f"{chr(65 + k)}  seed {p.stem.split('_s')[-1]}", fill=(255, 210, 0), font=font)
    out = OUT / f"review_{item}.png"
    grid.save(out)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("items", nargs="*")
    ap.add_argument("--seeds")
    args = ap.parse_args()
    items = args.items or list(CFG["items"])
    seeds = [int(s) for s in args.seeds.split(",")] if args.seeds else CFG["seeds"]
    m = CFG["model"]
    PROMPTS.mkdir(parents=True, exist_ok=True)
    if not LOG.read_text().count("| Item | Seed |"):
        with open(LOG, "a") as f:
            f.write(f"\n## Stills: FLUX.2 [dev]\n\nModel `{m['unet']}`, text encoder `{m['clip']}`, VAE `{m['vae']}`; "
                    f"{m['steps']} steps, {m['sampler']}, guidance {m['guidance']}; ComfyUI, text-to-image "
                    f"(`scripts/stills.py`). Prompt = `shots/prompts/<item>.txt` (subject + the shared style).\n\n"
                    f"| Item | Seed | Size | Output | Seconds | When | Status |\n| --- | --- | --- | --- | --- | --- | --- |\n")
    for item in items:
        spec = CFG["items"][item]
        prompt = spec["subject"] + ", " + CFG["style"]
        (PROMPTS / f"{item}.txt").write_text(prompt + "\n")
        w, h = spec["size"]
        paths = []
        for seed in seeds:
            dest = OUT / item / f"{item}_s{seed}.png"
            if dest.exists():
                paths.append(dest)
                continue
            outputs, secs = cc.run(graph(prompt, seed, w, h, f"bim/{item}_s{seed}"))
            cc.download(outputs["9"]["images"][0], dest)
            paths.append(dest)
            when = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
            with open(LOG, "a") as f:
                f.write(f"| {item} | {seed} | {w}×{h} | `{dest}` | {secs:.1f} | {when} | pending pick |\n")
            print(f"{item} seed {seed}: {dest} ({secs:.1f} s)", flush=True)
        if len(paths) >= 2:
            print("review:", review_grid(item, paths[:4]), flush=True)


if __name__ == "__main__":
    main()
