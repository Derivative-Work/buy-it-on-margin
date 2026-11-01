#!/usr/bin/env bash
# Rebuild the main video and the Shorts, the captions and the thumbnails from the production archive (scripts/archive.sh): restore the
# archived audio and takes, re-run the deterministic stages (grain plates, padded master, Remotion renders, captions,
# thumbnails) and check the results against the release.
#
# The check: captions and thumbnails must be byte-identical. Each video must be identical, or have bit-identical audio
# and every frame within 40 dB PSNR: Chrome's compositing of the panned stills varies in the last bit between renders
# (two renders of the same commit on the production machine: average 54.6 dB, worst frame 42.8 dB).
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
SHORTS=(chorus forecast hardware)   # config/shorts.json
O=out/rebuild
mkdir -p $O out/m4
npx remotion render src/index.ts Release $O/buy_it_on_margin.mp4 --crf=17 --audio-bitrate=320k
for id in "${SHORTS[@]}"; do
  npx remotion render src/index.ts Short-$id $O/buy_it_on_margin_short_$id.mp4 --crf=17 --audio-bitrate=320k
  $PY -I scripts/export_srt.py short $id
done
$PY -I scripts/export_srt.py
F=$($PY -I -c "import json; print(json.load(open('timing/shot_times.json'))['shots']['N30']['start_frame'] + 1)")
npx remotion still src/index.ts Main out/m4/n30_freeze.png --frame=$F --props='{"captions":false}'
for id in "${SHORTS[@]}"; do
  T=$($PY -I -c "import json; t = json.load(open('config/shorts.json'))['shorts']['$id']['thumb']; print(round(t * 24) if t != 'N30' else '')")
  [[ -n $T ]] && npx remotion still src/index.ts Main out/m4/thumb_$id.png --frame=$T --props='{"captions":false}'
done
$PY -I scripts/thumbnail.py

line() { printf '%-44s %s\n' "$1" "$2"; }
fail=0
same() {  # file in deliverables/ (or a path) vs its checksum in the release
  local name=$1 path=$2
  if (grep " $name\$" $A/SHA256SUMS | sed "s| $name\$| $path|" | sha256sum -c --status); then line "$name" identical; else line "$name" DIFFERS; fail=1; fi
}
video() {  # identical, or bit-identical audio and every frame >= 40 dB PSNR
  local name=$1 ref=$A/$1 new=$O/$1
  if (grep " $name\$" $A/SHA256SUMS | sed "s| $name\$| $new|" | sha256sum -c --status); then line "$name" identical; return; fi
  [[ -f $ref ]] || { line "$name" "differs; not in $A/ to compare (use --fetch)"; fail=1; return; }
  local a b min
  a=$(ffmpeg -v error -i "$ref" -map 0:a -f md5 -); b=$(ffmpeg -v error -i "$new" -map 0:a -f md5 -)
  [[ $a == "$b" ]] || { line "$name" "audio DIFFERS"; fail=1; return; }
  min=$(ffmpeg -i "$ref" -i "$new" -lavfi "[0:v][1:v]psnr" -f null - 2>&1 | grep -o 'min:[0-9.inf]*' | tail -1 | cut -d: -f2)
  if [[ $min == inf ]] || awk "BEGIN{exit !($min >= 40)}"; then line "$name" "audio identical, worst frame ${min} dB PSNR (>= 40)"
  else line "$name" "worst frame ${min} dB PSNR (< 40)"; fail=1; fi
}
same buy_it_on_margin.en.srt deliverables/buy_it_on_margin.en.srt
same buy_it_on_margin_thumbnail.jpg deliverables/buy_it_on_margin_thumbnail.jpg
video buy_it_on_margin.mp4
for id in "${SHORTS[@]}"; do
  same buy_it_on_margin_short_$id.en.srt deliverables/buy_it_on_margin_short_$id.en.srt
  same buy_it_on_margin_short_${id}_thumbnail.jpg deliverables/buy_it_on_margin_short_${id}_thumbnail.jpg
  video buy_it_on_margin_short_$id.mp4
done
exit $fail
