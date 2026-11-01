#!/usr/bin/env bash
# Regenerate MANIFEST.sha256 for every large file (git-ignored): the inputs and takes in the release archive, the
# ticker sound (not redistributed) and the two videos.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
dirs=(audio takes public/media/picks public/media/chat deliverables)
existing=()
for d in "${dirs[@]}"; do [ -d "$d" ] && existing+=("$d"); done
# Frame sequences are never archived (brief): they regenerate from the logged commands, so they stay out of the
# manifest. Any directory named plates*/overlay*/frames*.
find "${existing[@]}" -type f -not -regex '.*/\(plates[^/]*\|overlay[^/]*\|frames[^/]*\)/.*' -print0 \
  | while IFS= read -r -d '' f; do if git check-ignore -q "$f"; then printf '%s\0' "$f"; fi; done \
  | sort -z | xargs -0 -r sha256sum > MANIFEST.sha256
echo "$(wc -l < MANIFEST.sha256) files in MANIFEST.sha256"
