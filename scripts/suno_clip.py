"""Extract a Suno clip record and its lyrics from a share page saved by scripts/fetch_suno.mjs.

The clips API needs auth, but the page's Next.js RSC payload carries the record. Lyrics are an RSC text chunk
referenced as "$<id>" from metadata.prompt.
Usage: python3 -I scripts/suno_clip.py <out_dir_of_fetch_suno> <clip_id>  ->  <dir>/clip.json, <dir>/lyrics.txt
"""
import json
import re
import sys
from pathlib import Path

d, clip_id = Path(sys.argv[1]), sys.argv[2]
h = (d / "page.html").read_text()
chunks = re.findall(r'self\.__next_f\.push\(\[1,"(.*?)"\]\)</script>', h, re.S)
s = "".join(json.loads('"' + c + '"') for c in chunks)
dec = json.JSONDecoder()
clip = None
for m in re.finditer(r'\{"id":"' + clip_id + '"', s):
    try:
        o, _ = dec.raw_decode(s[m.start():])
    except json.JSONDecodeError:
        continue
    if "metadata" in o:
        clip = o
        break
if clip is None:  # record may start with another key: brace-match backwards from model version
    i = s.find('"model_name"', s.find(clip_id))
    for k in range(i, 0, -1):
        if s[k] == "{":
            try:
                o, _ = dec.raw_decode(s[k:])
            except json.JSONDecodeError:
                continue
            if o.get("id") == clip_id and "metadata" in o:
                clip = o
                break
assert clip, "clip record not found"
(d / "clip.json").write_text(json.dumps(clip, indent=1))
p = clip["metadata"].get("prompt", "")
if isinstance(p, str) and p.startswith("$"):
    ref = p[1:]
    m = re.search(r"(?:^|\n)" + re.escape(ref) + r":T([0-9a-f]+),", s)
    b = s.encode()
    start = len(s[:m.end()].encode())
    p = b[start:start + int(m.group(1), 16)].decode()
(d / "lyrics.txt").write_text(p)
md = clip["metadata"]
print(json.dumps({k: clip.get(k) for k in ("id", "title", "created_at", "model_name", "major_model_version")}))
print(json.dumps({k: v for k, v in md.items() if k not in ("prompt", "model_badges", "image_config")}, indent=1))
