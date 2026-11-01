#!/usr/bin/env bash
# Set up the Buy It on Margin production environment on an RTX 5090 box (Ubuntu 26.04). Adapted from Folks Like Us,
# whose environment this production ran on (same ComfyUI, custom nodes, weights, Node and Python pins).
# Idempotent: rerun it after any failure, and it picks up where it stopped. Downloads resume.
#
# Usage: scripts/setup_env.sh [--no-comfy] [--no-models] [--check-only]
#   --no-comfy   skip ComfyUI and the weights: enough to rebuild the videos from the archive (scripts/rebuild.sh)
#   COMFYUI_DIR  where ComfyUI and its weights live, outside the repo (default ~/ComfyUI)
#
# What it installs:
#   Remotion 4.0.534 (React 18.3.1) on Node 24, with its Chrome headless shell: the film layer, cards and edit
#   Puppeteer: the planning-chat capture and the Suno/share page fetches
#   Python 3.12 venv (uv): NumPy, SciPy, librosa, soundfile, Pillow, WhisperX (timing map, audio, thumbnails)
#   ComfyUI v0.42.1 with FLUX.2 [dev] fp8 (stills) and LTX-2.3 fp8 image-to-video (clips), weights in config/models.tsv
#   ffmpeg 8 with libx264
set -euo pipefail

REPO=$(cd "$(dirname "$0")/.." && pwd)
COMFYUI_DIR=${COMFYUI_DIR:-$HOME/ComfyUI}
NODE_VERSION=24.22.0
SWAP_GB=32
COMFYUI_TAG=v0.42.1
TORCH_INDEX_COMFY=https://download.pytorch.org/whl/cu130
CUSTOM_NODES=(
  "https://github.com/Lightricks/ComfyUI-LTXVideo 44c8a36b7c31"
  "https://github.com/kijai/ComfyUI-KJNodes f20bdd5337ac"
  "https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite 4d907bee61e9"
)

COMFY=1
MODELS=1
CHECK_ONLY=0
for a in "$@"; do
  case $a in
    --no-comfy) COMFY=0; MODELS=0 ;;
    --no-models) MODELS=0 ;;
    --check-only) CHECK_ONLY=1 ;;
    *) echo "unknown option: $a" >&2; exit 2 ;;
  esac
done

step() { printf '\n== %s\n' "$*"; }
die() { echo "ERROR: $*" >&2; exit 1; }

# nvm only loads in interactive shells.
export NVM_DIR=${NVM_DIR:-$HOME/.nvm}
export PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$HOME/.local/bin:$PATH

install_system() {
  step "System tools"
  local apt_pkgs=()
  command -v git >/dev/null || apt_pkgs+=(git)
  command -v curl >/dev/null || apt_pkgs+=(curl)
  command -v ffmpeg >/dev/null || apt_pkgs+=(ffmpeg)
  command -v gh >/dev/null || apt_pkgs+=(gh)
  if (( ${#apt_pkgs[@]} )); then sudo apt-get update && sudo apt-get install -y "${apt_pkgs[@]}"; fi
  ffmpeg -hide_banner -encoders 2>/dev/null | grep libx264 >/dev/null || die "ffmpeg lacks libx264"
  command -v uv >/dev/null || curl -LsSf https://astral.sh/uv/install.sh | sh
  if ! command -v node >/dev/null || [[ $(node --version) != v$NODE_VERSION ]]; then
    [[ -s $NVM_DIR/nvm.sh ]] || curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    # shellcheck disable=SC1091
    . "$NVM_DIR/nvm.sh" && nvm install $NODE_VERSION
  fi
}

ensure_swap() {
  # FLUX.2 and LTX-2.3 offload weights to system RAM; the production box has 38 GB.
  step "Swap (/swap.img, $SWAP_GB GB)"
  local have; have=$(swapon --show=NAME,SIZE --bytes --noheadings | awk '$1=="/swap.img"{print $2}')
  if (( ${have:-0} >= SWAP_GB * 1024**3 * 95 / 100 )); then echo "already ${have} bytes"; return; fi
  sudo swapoff /swap.img 2>/dev/null || true
  sudo fallocate -l ${SWAP_GB}G /swap.img
  sudo chmod 600 /swap.img
  sudo mkswap /swap.img >/dev/null
  sudo swapon /swap.img
  grep -q '^/swap.img' /etc/fstab || echo '/swap.img	none	swap	sw	0	0' | sudo tee -a /etc/fstab >/dev/null
}

install_project() {
  step "Project Python env (.venv, Python 3.12, torch 2.8 cu128, WhisperX)"
  cd "$REPO"
  uv sync

  step "Remotion and Puppeteer (npm ci), Chrome headless shell"
  npm ci
  npx remotion browser ensure
  npx puppeteer browsers install chrome-headless-shell

  # Pre-commit hook: rejects staged files over 50 MiB.
  git config core.hooksPath scripts/hooks
}

install_comfyui() {
  step "ComfyUI $COMFYUI_TAG in $COMFYUI_DIR"
  command -v nvidia-smi >/dev/null || die "no NVIDIA driver; install driver >= 570 (Blackwell) first"
  [[ -d $COMFYUI_DIR/.git ]] || git clone https://github.com/comfyanonymous/ComfyUI "$COMFYUI_DIR"
  git -C "$COMFYUI_DIR" fetch --tags --quiet
  git -C "$COMFYUI_DIR" -c advice.detachedHead=false checkout --quiet $COMFYUI_TAG
  cd "$COMFYUI_DIR"
  # Its own venv: ComfyUI wants a current torch (cu130), while WhisperX pins torch 2.8.
  [[ -x $COMFYUI_DIR/.venv/bin/python ]] || uv venv --python 3.13 "$COMFYUI_DIR/.venv"
  local pip=(uv pip install --python "$COMFYUI_DIR/.venv/bin/python")
  "${pip[@]}" torch==2.14.1 torchvision==0.29.1 torchaudio==2.11.0 --index-url $TORCH_INDEX_COMFY
  "${pip[@]}" -r "$COMFYUI_DIR/requirements.txt" -r "$COMFYUI_DIR/manager_requirements.txt"
  local entry url commit dir
  for entry in "${CUSTOM_NODES[@]}"; do
    read -r url commit <<<"$entry"
    dir=$COMFYUI_DIR/custom_nodes/$(basename "$url")
    [[ -d $dir/.git ]] || git clone --quiet "$url" "$dir"
    git -C "$dir" fetch --quiet origin
    git -C "$dir" -c advice.detachedHead=false checkout --quiet "$commit"
    [[ -f $dir/requirements.txt ]] && "${pip[@]}" -r "$dir/requirements.txt"
  done
}

download_models() {
  step "Model weights (config/models.tsv, ~60 GB)"
  local hf=(uvx --from "huggingface_hub[hf_xet]" hf download)
  local stage repo rev path dest local_dir
  while IFS=$'\t' read -r stage repo rev path dest; do
    [[ -z $stage || $stage == \#* ]] && continue
    local_dir=$COMFYUI_DIR/models/_hf/$repo
    echo "[$stage] $repo/$path"
    "${hf[@]}" "$repo" "$path" --revision "$rev" --local-dir "$local_dir" >/dev/null
    mkdir -p "$COMFYUI_DIR/models/$dest"
    ln -sfn "$local_dir/$path" "$COMFYUI_DIR/models/$dest/$(basename "$path")"
  done <"$REPO/config/models.tsv"
}

check() {
  step "Checks"
  local fail=0
  ok() { printf '  ok    %s\n' "$*"; }
  bad() { printf '  FAIL  %s\n' "$*"; fail=1; }
  ffmpeg -hide_banner -encoders 2>/dev/null | grep libx264 >/dev/null && ok "$(ffmpeg -version | head -1 | cut -d' ' -f1-3), libx264" || bad "ffmpeg with libx264"
  [[ $(node --version 2>/dev/null) == v$NODE_VERSION ]] && ok "node $NODE_VERSION" || bad "node $NODE_VERSION"
  (cd "$REPO" && npx remotion versions 2>/dev/null | grep -q 4.0.534) && ok "remotion 4.0.534" || bad "remotion 4.0.534 (npm ci)"
  "$REPO/.venv/bin/python" -c 'import numpy,scipy,librosa,soundfile,PIL,whisperx; print("numpy", numpy.__version__, "librosa", librosa.__version__)' 2>/dev/null \
    | sed 's/^/  ok    project venv: /' | grep . || bad "project venv (uv sync)"
  if (( COMFY )); then
    nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv,noheader | sed 's/^/  gpu   /'
    local swap; swap=$(swapon --show=SIZE --bytes --noheadings | awk '{s+=$1} END{print s+0}')
    (( swap >= SWAP_GB * 1024**3 * 95 / 100 )) && ok "swap $((swap / 1024**3)) GiB" || bad "swap below $SWAP_GB GB"
    "$COMFYUI_DIR/.venv/bin/python" -c 'import torch; assert torch.cuda.is_available(); x=torch.ones(1,device="cuda")*2; print(f"torch {torch.__version__}, CUDA {torch.version.cuda}")' 2>/dev/null \
      | sed 's/^/  ok    ComfyUI venv: /' | grep . || bad "ComfyUI venv (torch CUDA)"
  fi
  if (( MODELS )); then
    local stage repo rev path dest f
    while IFS=$'\t' read -r stage repo rev path dest; do
      [[ -z $stage || $stage == \#* ]] && continue
      f=$COMFYUI_DIR/models/$dest/$(basename "$path")
      [[ -s $f ]] && ok "model $dest/$(basename "$path")" || bad "model $dest/$(basename "$path") missing"
    done <"$REPO/config/models.tsv"
  fi
  return $fail
}

if (( ! CHECK_ONLY )); then
  install_system
  install_project
  if (( COMFY )); then
    ensure_swap
    install_comfyui
    (( MODELS )) && download_models
  fi
fi
check
