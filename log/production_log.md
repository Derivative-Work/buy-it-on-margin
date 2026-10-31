# Production log

Append-only. One entry per generation, render or analysis step.

## 1. 2026-10-31 — Project setup and inputs

- Read the brief (rev 10) and the song doc (rev 24) with the docs tools; brief mirrored to `docs/brief.md`.
- Planning chat https://claude.ai/share/6c3c88fb-d879-4878-a42b-e9bf95a87456: **not captured.** `node scripts/fetch_share.mjs <url> docs/planning_chat/planning_chat` gets the sign-in page and `permission_error: Authentication required` from `/api/chat_snapshots/`, so the share is not public. Needs the human (see open items).
- Suno take: `node scripts/fetch_suno.mjs https://suno.com/s/pJ50iZMaIvND8bqS docs/suno`. The clip record is behind auth, but the share page's RSC payload carries it; extracted to `docs/suno/clip.json` and the lyrics as pasted to `lyrics/as_pasted.txt` (identical to the song doc's lyrics, directions included).
- Audio: `audio/track/Buy It On Margin.wav` (48 kHz stereo, 189.2 s, sha256 `ea3e7660…`) and `.mp3`; stems unzipped from `~/Downloads/Buy It On Margin Stems.zip` to `audio/stems/` (11 stems, all 189.2 s).

## 2. 2026-10-31 — Transcription (evidence for M1)

- `../folks-like-us/.venv/bin/python scripts/transcribe_vocals.py` (WhisperX large-v3 on `0 Lead Vocals.wav`) → `timing/whisper_words.json`.
- Every section is sung in order. The final chorus (141.7–150.8 s) is missing from the full pass; a focused pass on 141–170 s finds it on the backing-vocals stem ("…margin, ten cents down and a promise for the …margin") and "Buy it on Mars" on the lead stem.

## 3. 2026-10-31 — Structure of the take around the cut

Per-stem RMS in 50 ms windows (ffmpeg to mono f32, Python RMS; summarised in the `scripts/master_candidates.py` docstring):
- Stop-time hits at 149.70, 150.25 and 150.75 s; 150.75 s is "mar—". Brass is silent from 150.70 s; vocals and drums ring out to 151.80 s.
- **The band re-enters at 151.85 s** and plays ~17.5 s of instrumental (drums, brass, keys; no vocals) until the coda's first word at 169.61 s.
- So the take has a stop on "mar—", but only ~1 s of near-silence, then more band. The brief's four-second silence and ticker are still edits.

## 4. 2026-10-31 — Candidate masters for the cut (for the human, not locked)

- `../folks-like-us/.venv/bin/python -I scripts/master_candidates.py` → `timing/cut_candidates/` (`master_{A,B,C}.wav`, 12–16 s `listen_{A,B,C}.wav`, `candidates.json`).
- Each = take[0:cut] with a 3 ms fade + 4.0 s seeded synthetic crackle (seed 1929, hiss −42 dBFS, ~9 pops/s) + take[169.20 s:] with a 10 ms fade-in. Drops the 17.5 s instrumental tail.
- Cuts: A 150.80 s, B 150.88 s, C 150.96 s (50/130/210 ms into "mar—"). Masters run 174.8–175.0 s.
- No ticker yet (human supplies it). Crackle is synthetic because the take has no clean room-tone passage; swap for real room tone if preferred.
