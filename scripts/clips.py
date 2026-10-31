"""M3 batch 2: LTX-2.3 image-to-video clips from the picked keyframes (config/clips.json).

Graph: ComfyUI's video_ltx2_3_i2v template in API form (comfy/api/video_ltx2_3_i2v.api.json, from
scripts/comfy_ui_to_api.mjs). Sets the keyframe (node 269), prompt (320:319; the prompt enhancer switch 320:328 stays
off so the prompt is used as written), size (320:312 width, 320:299 height), fps (320:300), seconds (320:301) and both
noise seeds (320:276, 320:277). The template's audio branch runs but its audio is discarded (the film is silent).
Outputs takes/clips/<clip>/<clip>_s<seed>.mp4; one row per take in shots/prompts.md.
Usage: <venv>/bin/python -I scripts/clips.py [clip ...]   (ComfyUI running; keyframes picked in config/stills.json)
"""
import copy
import datetime
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import comfy_client as cc  # noqa: E402

CFG = json.load(open("config/clips.json"))
KEPT = json.load(open("config/stills.json"))["kept"]
BASE = json.load(open("comfy/api/video_ltx2_3_i2v.api.json"))
OUT, LOG = Path("takes/clips"), Path("shots/prompts.md")


def main():
    clips = sys.argv[1:] or list(CFG["clips"])
    if "## Clips: LTX-2.3" not in LOG.read_text():
        with open(LOG, "a") as f:
            f.write("\n## Clips: LTX-2.3\n\nComfyUI template `video_ltx2_3_i2v` (`ltx-2.3-22b-dev-fp8` + distilled LoRA 0.5, "
                    "Gemma 3 12B fp4 encoder, x2 spatial upscaler), via `scripts/clips.py`. Prompt = motion + the shared clip style.\n\n"
                    "| Clip | Keyframe | Seed | Output | Seconds | When | Status |\n| --- | --- | --- | --- | --- | --- | --- |\n")
    for clip in clips:
        spec = CFG["clips"][clip]
        kf = spec["keyframe"]
        if kf not in KEPT:
            print(f"{clip}: keyframe {kf} not picked yet, skipping")
            continue
        src = Path(f"takes/stills/{kf}/{kf}_s{KEPT[kf]}.png")
        name = cc.upload_image(src)
        prompt = spec["motion"] + ". " + CFG["style"]
        for seed in CFG["seeds"]:
            dest = OUT / clip / f"{clip}_s{seed}.mp4"
            if dest.exists():
                continue
            g = copy.deepcopy(BASE)
            g["269"]["inputs"]["image"] = name
            g["320:319"]["inputs"]["value"] = prompt
            g["320:328"]["inputs"]["value"] = False
            g["320:312"]["inputs"]["value"], g["320:299"]["inputs"]["value"] = CFG["size"]
            g["320:300"]["inputs"]["value"] = CFG["fps"]
            g["320:301"]["inputs"]["value"] = CFG["seconds"]
            g["320:276"]["inputs"]["noise_seed"] = seed
            g["320:277"]["inputs"]["noise_seed"] = seed + 1
            g["75"]["inputs"]["filename_prefix"] = f"bim/{clip}_s{seed}"
            outputs, secs = cc.run(g)
            vid = next(v for k, vs in outputs["75"].items() if k in ("images", "videos", "gifs") for v in vs)
            cc.download(vid, dest)
            when = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
            with open(LOG, "a") as f:
                f.write(f"| {clip} | `{src}` | {seed} | `{dest}` | {secs:.1f} | {when} | pending pick |\n")
            print(f"{clip} seed {seed}: {dest} ({secs:.1f} s)", flush=True)


if __name__ == "__main__":
    main()
