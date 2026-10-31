#!/usr/bin/env bash
# M4 fixes, part 2: N17 v2 (RAM and GPUs, conditioned on the v1 pick), the shadow-play clips, then their mattes.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
PY=../folks-like-us/.venv/bin/python
free_models() { $PY -I -c "import sys; sys.path.insert(0, 'scripts'); import comfy_client as cc; cc.free()"; sleep 5; free -g | sed -n 2p; }
free_models
$PY -I scripts/stills.py N17
free_models
$PY -I scripts/clips.py S23band S23kick S28run
free_models
echo BATCH4 GPU DONE
