#!/usr/bin/env bash
# The production archive: what git doesn't hold and can't regenerate, plus every take the production made, as tar
# parts under GitHub's 2 GiB per-asset limit, published as a release of this repo.
#
#   inputs.tar  audio/: the Suno takes (v1, the v2 coda extend, the player-piano cover) with their stems, the
#               post-filtered (music-deslop M6f) takes, and the locked master
#   takes.tar   takes/ (every FLUX.2 still and LTX-2.3 clip, picked or not), public/media/picks (the picks as the
#               edit uses them, with the shadow-play mattes) and public/media/chat (the planning-chat capture)
#   the two upload files, their captions and thumbnails (also in deliverables/), and SHA256SUMS
# Left out: regenerable files (public/grain, public/audio, out/, review renders), and the ticker sound
# (audio/sfx/), a Pixabay download that its licence doesn't allow redistributing on its own. It is mixed into the
# master, so nothing downstream needs it; to rebuild the master itself, download it again (log/production_log.md).
#
# Usage: scripts/archive.sh [--upload]   (builds archive/, git-ignored; --upload publishes the release with gh)
set -euo pipefail
cd "$(dirname "$0")/.."
TAG=archive-2026-11-01
REPO=Derivative-Work/buy-it-on-margin
A=archive
UPLOADS=(buy_it_on_margin.mp4 buy_it_on_margin_short.mp4 buy_it_on_margin.en.srt buy_it_on_margin_short.en.srt
         buy_it_on_margin_thumbnail.jpg buy_it_on_margin_short_thumbnail.jpg)
mkdir -p $A
tar -cf $A/inputs.tar audio/track audio/track_v2 audio/stems audio/stems_v2 audio/postfilter audio/master audio/credits_cover
tar -cf $A/takes.tar takes public/media/picks public/media/chat
for f in "${UPLOADS[@]}"; do ln -f deliverables/$f $A/$f; done
(cd $A && sha256sum inputs.tar takes.tar "${UPLOADS[@]}" > SHA256SUMS)
ls -l $A
for f in $A/*.tar $A/*.mp4; do
  (( $(stat -c %s "$f") < 2147483648 )) || { echo "$f is over 2 GiB" >&2; exit 1; }
done
if [[ ${1:-} == --upload ]]; then
  gh release create $TAG -R $REPO --title "Production archive (2026-11-01)" \
    --notes "The production archive for Buy It on Margin: the two upload files with captions and thumbnails, the audio git doesn't hold, and every take. See README.md (Reproducing it) and scripts/archive.sh for what each part contains." \
    $A/SHA256SUMS "${UPLOADS[@]/#/$A/}" $A/*.tar
fi
