#!/usr/bin/env bash
# M3 batch 2: reference-conditioned stills, N27 from each N26 take (paired by seed), then the LTX clips.
# Usage: scripts/batch2.sh   (ComfyUI running; batch-1 picks in config/stills.json)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
PY=../folks-like-us/.venv/bin/python
$PY -I scripts/stills.py N06 N08 N15 N26
# N27 is conditioned on N26: make one per N26 take with the same seed, so the human picks a matched pair.
for s in 1929 1930 1931 1932; do
  $PY -I - "$s" <<'PYEOF'
import json, sys
p = "config/stills.json"; c = json.load(open(p)); c["kept"]["N26"] = int(sys.argv[1]); json.dump(c, open(p, "w"), indent=1)
PYEOF
  $PY -I scripts/stills.py N27 --seeds "$s"
done
$PY -I - <<'PYEOF'
import json
p = "config/stills.json"; c = json.load(open(p)); c["kept"].pop("N26", None); json.dump(c, open(p, "w"), indent=1)
PYEOF
$PY -I scripts/clips.py
$PY -I scripts/contact_sheet.py
echo BATCH2 DONE
