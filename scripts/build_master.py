"""Build the master from config/master.json: v1 head + 4 s gap (crackle + ticker) + v2 coda to the end.

Why two sources: the human cut on v1 (2:31.884, before its drums re-enter) and took the coda from the Suno extend
(clip f43a9f22, continued from v1 at 151.68 s; joined full track = clip 3cdd3864, "v2"). v1 and v2 are sample-identical
to 151.0 s. The extend still has ~18 s of band before the coda, which the edit drops.
Usage: <venv>/bin/python -I scripts/build_master.py [raw|postfilter]  ->  audio/master/master_<variant>.wav (+ listen clip, json)
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

cfg = json.load(open("config/master.json"))
variant = sys.argv[1] if len(sys.argv) > 1 else "raw"
src = cfg["variants"][variant]
SR = 48000
out = Path("audio/master"); out.mkdir(parents=True, exist_ok=True)

def load(p):
    x, sr = sf.read(p, always_2d=True)
    assert sr == SR, (p, sr)
    return x

def fade(x, ms, end):
    k = int(SR * ms / 1000); x = x.copy()
    if end: x[-k:] *= np.linspace(1, 0, k)[:, None]
    else: x[:k] *= np.linspace(0, 1, k)[:, None]
    return x

def crackle(n, c):
    rng = np.random.default_rng(c["seed"])
    hiss = np.convolve(rng.normal(0, 1, n), np.ones(8) / 8, mode="same")
    hiss *= 10 ** (c["hiss_dbfs"] / 20) / hiss.std()
    pops = np.zeros(n)
    for t in rng.choice(n - 200, size=int(n / SR * c["pops_per_s"]), replace=False):
        pops[t:t + 200] += 10 ** (rng.uniform(-38, -22) / 20) * rng.choice([-1, 1]) * np.exp(-np.arange(200) / rng.uniform(8, 40))
    m = hiss + pops
    return np.stack([m, m], 1)

def ticker(n_total, t):
    dur = n_total / SR - t["starts_at_gap_s"]
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t["src_in"]), "-t", f"{dur:.4f}", "-i", t["src"],
                          "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    m = np.frombuffer(raw, np.float32).astype(np.float64)
    m *= 10 ** (t["rms_dbfs"] / 20) / np.sqrt((m ** 2).mean())
    x = fade(fade(np.stack([m, m], 1), t["fade_in_ms"], False), t["fade_out_ms"], True)
    buf = np.zeros((n_total, 2)); s = int(t["starts_at_gap_s"] * SR)
    buf[s:s + len(x)] = x[:n_total - s]
    return buf

head = fade(load(src["head"])[:int(cfg["head_end"] * SR)], cfg["head_fade_ms"], True)
n_gap = int(cfg["gap_s"] * SR)
gap = crackle(n_gap, cfg["crackle"]) + ticker(n_gap, cfg["ticker"])
coda = fade(load(src["coda"])[int(cfg["coda_in"] * SR):], cfg["coda_fade_in_ms"], False)
full = np.concatenate([head, gap, coda])
peak = np.abs(full).max()
if peak > 0.999: full *= 0.999 / peak
sf.write(out / f"master_{variant}.wav", full, SR, subtype="PCM_24")
a, b = len(head) - 8 * SR, len(head) + n_gap + 10 * SR
sf.write(out / f"listen_{variant}.wav", full[a:b], SR, subtype="PCM_24")
info = {"variant": variant, "sources": src, "duration_s": round(len(full) / SR, 4),
        "map": {"head": [0, cfg["head_end"]], "gap": [cfg["head_end"], round(cfg["head_end"] + cfg["gap_s"], 4)],
                "coda_starts_at": round(cfg["head_end"] + cfg["gap_s"], 4),
                "coda_offset_master_minus_v2_s": round(cfg["head_end"] + cfg["gap_s"] - cfg["coda_in"], 4)},
        "listen_clip_covers_master_s": [round(a / SR, 3), round(b / SR, 3)], "peak_dbfs": round(20 * np.log10(np.abs(full).max()), 2)}
json.dump(info, open(out / f"master_{variant}.json", "w"), indent=1)
print(json.dumps(info, indent=1))
