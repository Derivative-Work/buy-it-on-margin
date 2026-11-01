#!/usr/bin/env bash
# Rebuild both videos, the captions and the thumbnails from the production archive (scripts/archive.sh): restore the
# archived audio and takes, re-run the deterministic stages (grain plates, padded master, Remotion renders, captions,
# thumbnails) and check the results against the release.
#
# The check: captions, thumbnails and the Short must be byte-identical. The main video's audio must be bit-identical,
# and its picture within 40 dB PSNR on every frame: Chrome's compositing of the panned stills varies in the last bit
# between renders (two renders of the same commit on the production machine: average 54.6 dB, worst frame 42.8 dB).
# Regenerating the takes themselves from the models is per stage: see README.md and log/production_log.md.
#
# Usage: scripts/rebuild.sh [--fetch]   (--fetch downloads the release with gh; otherwise archive/ must hold the parts)
# Needs the environment from scripts/setup_env.sh (--no-comfy is enough).
set -euo pipefail
cd "$(dirname "$0")/.."
TAG=archive-2026-11-01
REPO=Derivative-Work/buy-it-on-margin
A=archive
PY=${PY:-.venv/bin/python}   # override to use another venv with the same packages
if [[ ${1:-} == --fetch ]]; then
  mkdir -p $A
  gh release download $TAG -R $REPO -D $A --clobber
fi
(cd $A && sha256sum -c --ignore-missing SHA256SUMS)
for t in $A/*.tar; do tar -xf "$t"; done

$PY -I scripts/grain_plates.py
$PY -I scripts/pad_master.py
O=out/rebuild
mkdir -p $O
npx remotion render src/index.ts Release $O/buy_it_on_margin.mp4 --crf=17 --audio-bitrate=320k
npx remotion render src/index.ts Shorts $O/buy_it_on_margin_short.mp4 --crf=17 --audio-bitrate=320k
$PY -I scripts/export_srt.py
$PY -I scripts/export_srt.py short
F=$($PY -I -c "import json; print(json.load(open('timing/shot_times.json'))['shots']['N30']['start_frame'] + 1)")
npx remotion still src/index.ts Main out/m4/n30_freeze.png --frame=$F --props='{"captions":false}'
$PY -I scripts/thumbnail.py

step() { printf '%-36s %s\n' "$1" "$2"; }
fail=0
for f in buy_it_on_margin.en.srt buy_it_on_margin_short.en.srt buy_it_on_margin_thumbnail.jpg buy_it_on_margin_short_thumbnail.jpg; do
  if (grep " $f\$" $A/SHA256SUMS | sed "s| $f\$| deliverables/$f|" | sha256sum -c --status); then step "$f" "identical"; else step "$f" "DIFFERS"; fail=1; fi
done
if (grep ' buy_it_on_margin_short.mp4$' $A/SHA256SUMS | sed "s| buy_it_on_margin_short.mp4\$| $O/buy_it_on_margin_short.mp4|" | sha256sum -c --status); then
  step buy_it_on_margin_short.mp4 identical; else step buy_it_on_margin_short.mp4 DIFFERS; fail=1; fi
M=$A/buy_it_on_margin.mp4
if [[ -f $M ]]; then
  a=$(ffmpeg -v error -i $M -map 0:a -f md5 -); b=$(ffmpeg -v error -i $O/buy_it_on_margin.mp4 -map 0:a -f md5 -)
  [[ $a == "$b" ]] && step "buy_it_on_margin.mp4 audio" identical || { step "buy_it_on_margin.mp4 audio" DIFFERS; fail=1; }
  min=$(ffmpeg -i $M -i $O/buy_it_on_margin.mp4 -lavfi "[0:v][1:v]psnr" -f null - 2>&1 | grep -o 'min:[0-9.inf]*' | tail -1 | cut -d: -f2)
  if [[ $min == inf ]] || awk "BEGIN{exit !($min >= 40)}"; then step "buy_it_on_margin.mp4 picture" "worst frame ${min} dB PSNR (>= 40)"
  else step "buy_it_on_margin.mp4 picture" "worst frame ${min} dB PSNR (< 40)"; fail=1; fi
else
  step buy_it_on_margin.mp4 "not in $A/ (use --fetch to compare)"
fi
exit $fail
