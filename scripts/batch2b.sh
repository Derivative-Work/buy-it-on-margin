#!/usr/bin/env bash
# M3 batch 2b: N27 v2 from the N26 pick, then the LTX clips. Frees ComfyUI's models before each model switch:
# batch 2 was stopped for low system memory with FLUX.2 still staged in RAM when LTX-2.3 began loading.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
PY=../folks-like-us/.venv/bin/python
free_models() { $PY -I -c "import sys; sys.path.insert(0, 'scripts'); import comfy_client as cc; cc.free()"; sleep 5; free -g | sed -n 2p; }
free_models
$PY -I scripts/stills.py N27
free_models
$PY -I scripts/clips.py
free_models
$PY -I scripts/contact_sheet.py
echo BATCH2B DONE
