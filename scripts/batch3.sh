#!/usr/bin/env bash
# M4 fixes (human review of animatic v1): keyframes for the silhouette mask clips and the tape pile (2 seeds each),
# provisional keyframe picks by the agent, then the LTX mask clips. Frees ComfyUI's models between model families.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
PY=../folks-like-us/.venv/bin/python
free_models() { $PY -I -c "import sys; sys.path.insert(0, 'scripts'); import comfy_client as cc; cc.free()"; sleep 5; free -g | sed -n 2p; }
free_models
$PY -I scripts/stills.py kf_N23band kf_N23kick kf_N28run tape_pile --seeds 1929,1930
echo KEYFRAMES DONE
