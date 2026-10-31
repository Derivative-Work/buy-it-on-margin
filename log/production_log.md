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

## 5. 2026-10-31 — v2 inputs, planning chat

- `node scripts/fetch_share.mjs https://claude.ai/share/6c3c88fb-d879-4878-a42b-e9bf95a87456 docs/planning_chat/planning_chat` (now public) → `planning_chat.json`; `python3 -I scripts/chat_snapshot_to_md.py … > planning_chat.md`. Snapshot "Song: Buy It On Margin (AI market downturn)", 2026-10-31T16:32:35Z, 18 messages. Message 13 holds the Gemini and ChatGPT audits.
- `node scripts/fetch_suno.mjs <url> docs/suno_v2_{full,extend}`; `python3 -I scripts/suno_clip.py <dir> <clip id>` (new: generalises step 1's extraction) → `clip.json`, `lyrics.txt` in each.
- v2 vs v1: sample-identical on [0, 151.0) s; Suno's join is within 151.0–151.68 s. The extend: band 152–169.8 s, coda vocal from 169.85 s ("I" at 170.45 s), "sell stock" ends ~191.5 s, then a short band tag 191–197 s to the end.
- v2 stems don't sum to the v2 mix (−7 dB residual over 165–195 s), so the coda is cut from the mix, not rebuilt from stems.

## 6. 2026-10-31 — Master (raw), for the human's ear

- `../folks-like-us/.venv/bin/python -I scripts/build_master.py raw` → `audio/master/master_raw.wav` (185.834 s, peak −1.69 dBFS), `listen_raw.wav` (master 143.9–165.9 s: 8 s before the cut, the gap, 10 s of coda), `master_raw.json`.
- Ticker: source 1.0 s on, mono, normalised to −26 dBFS RMS, enters 0.6 s into the gap, 150 ms fade-out into the coda. Crackle as in step 4.
- Superseded: `scripts/master_candidates.py` and its outputs moved to `archive/`.

## 7. 2026-10-31 — Post-filter (music-deslop M6f 10k) and post-filtered master

- On the human's instruction, the agent ran it. music-deslop at commit `68441e2` (clean tree; the same chain as the 2026-10-18 batch, per the human it hasn't changed), default release chain with fallback:
  `cd ~/Code/music-deslop && uv run python -m postfilter.infer --in <src> --out audio/postfilter/{v1,v2}_postfilter.wav --ckpt ~/Code/music-deslop-data/release/m6f_10k.safetensors --source suno` (strength 1.0, null latent). About 20 s and 5.7 GB RAM per track on the 5090 box.
- Checks: same length, 0-sample lag against the source; change −35.1 dB (v1) and −35.8 dB (v2) below the music, −31 to −40 dB in every 2 s window. No passage falls back to the input, so `--no-fallback` would give the same result.
- `../folks-like-us/.venv/bin/python -I scripts/build_master.py postfilter` → `audio/master/master_postfilter.wav` (+ `listen_postfilter.wav`, `.json`), same edit list as `master_raw`.

## 8. 2026-10-31 — M1: guide stems and master-timeline transcript

- `scripts/guide_stems.py` → `timing/guide/{vocals,lead,backing,drums,keys}.wav`: v1/v2 stems re-edited exactly like the master (unfiltered; the filter keeps timing).
- `scripts/transcribe_vocals.py timing/guide/{lead,backing}.wav timing/whisper_master_{lead,backing}.json` (script now takes stem/out args). Every section transcribed in order except the final chorus.

## 9. 2026-10-31 — M1: lyrics as sung

- `lyrics/as_sung.txt`: the lyrics as pasted, directions removed, Chorus 2 written out, with one change. The final chorus is sung "Buy it on margin, sugar, buy it on margin! / Ten cents down and a promise for the— / Buy—": group vocals 143.5–150.6 s, one last "Buy—" hit at ~150.75 s, then the voice drops to −60 dB and the band rings out to the cut. The written "it on mar—" is not found (vocals-guide level in 100 ms frames; WhisperX forced alignment places it in near-silence at 151.0–151.3 s). To confirm by ear; it matches the human's "C's final 'buy' is cut off".
- Whisper variants kept as written (likely mishearings, to confirm): "float alone", "the forecast sure", "sell stuff". Logged in `log/ai_changes.md`.

## 10. 2026-10-31 — M1: timing map, shot times, review video

- `scripts/timing_map.py` (from Folks Like Us) → `timing/timing_map.json`, `timing/as_sung_{lines,words}.srt`. 356 words aligned (6 with score < 0.3, all short words under the band). Final chorus windows from `config/timing.json` (no transcript anchors).
- Beats (drums guide, 0–151.884 s): 224.7 bpm quarter notes, IBI 255–279 ms, no drift; the stop-time hits at 149.70/150.25/150.75 s land within 10–30 ms of grid beats. Bars of 4, phase 3 (low-band onset strength by phase 119/248/134/285: phases 1 and 3 both strong, tuba on 1 and 3; to confirm by ear). Coda beats (keys guide) unreliable: 107.7 bpm against the ~70 planned; not used for cuts.
- Sections (master s): Intro 0–12.58, Verse 1 16.57–33.15, Chorus 1 33.25–57.72, Verse 2 58.98–75.34, Chorus 2 75.69–100.02, Break 100.10–106.90, Instrumental 106.90–126.53, Verse 3 126.53–141.82, Final chorus 143.58–151.884, Silence 151.884–155.884, Coda 156.49–185.834 (last word ends 177.46; band tag after).
- `scripts/shot_times.py` → `timing/shot_times.json` from `config/shot_cues.json`: 37 entries (N01–N34, N31 split a/b/c, N22 as a one-picture-frame insert, B01 in the coda). Starts snap to the beat at or before the word (sung onsets trail the beat by 80–130 ms). Card texts in `config/cards.json`; the hold rule flags N05, N19, N20, N31a–c and N34.
- `scripts/m1_review.py` → `timing/check/m1_review.mp4` (shot ID, picture and card on top, as-sung lyric with the current word lit, bar.beat counter; master + beat click, high on downbeats) and `master_click.wav`. Frames checked at 19.0, 104.2 and 152.5 s.

## 11. 2026-10-31 — M1 fix: the break's spoken tail

- Cause: Whisper's word times for "Why, 1930 / Sometime after 2030 / Same difference" (lead transcript, the line-window anchors) were compressed into 103.6–106.3 s. The lead and backing guides show the bursts later, and the backing transcript had "same difference" at 108.65 s.
- Forced alignment of the break text over one window (102.6–110.5 s, lead and full vocals guides agree): "nineteen thirty" 104.18–105.35, "Sometime after twenty thirty" 105.51–107.35, "Same difference" 108.69–109.52 (scores 0.62–0.95). Windows for Break lines 2–4 added to `config/timing.json`; timing map, shot times and review video rebuilt.
- Result: Break 100.10–109.60 s, Instrumental 109.60–126.53 s (was 106.90). N21 now runs 102.63–109.63 s; N22's insert on "Sometime" moves to 105.49 s; N23 starts 109.63 s.

## 12. 2026-10-31 — M1 closed

- `lyrics/as_sung.txt`: final chorus line 3 back to "Buy it on mar—" (human's ear). Window `Final chorus|2` = 150.65–151.884 s. Aligned: Buy 150.75, it 150.99, on 151.12, mar— 151.32–151.70 s (score 0.88).
- N30 now starts on "mar—" (151.32 s, the brief's cue): freeze, burn, black at the cut, 0.56 s.
- N34 ends on its hold rule (`"end": "hold"`): credits 181.00–202.17 s, 16.3 s past the music. The final mux pads the master with the seeded crackle bed for that tail (M5); the locked master is unchanged.
- Timing map, shot times and review video rebuilt. Card-hold exceptions kept as defaults: N05 (corner caption), N19/N20 (break cards, 1.1–1.6 s), N31a/b (dates 2.0 s each in the silence), N31c (5.6 s, over the coda's first line).

## 13. 2026-10-31 — M3 batch 1 started (stills)

- ComfyUI 0.42.1 started (`~/ComfyUI/.venv/bin/python ~/ComfyUI/main.py --listen 127.0.0.1 --port 8188`).
- `config/stills.json`: 19 items (references for the customer and the thinking machine, every independent S still, keyframes for clips C1a, C1b, C2, C3), prompt = subject + the brief's shared still style, seeds 1929–1932. Sizes: 1664×1248 (4:3, room for pushes), 2208×1248 for pans, portrait for N07/N11 tilts, 2304×1728 for the N32 pull-back.
- `scripts/stills.py` (from Folks Like Us; FLUX.2 [dev] fp8, Mistral fp4 encoder, 28 steps, euler, guidance 4). Rows per take in `shots/prompts.md`, prompts in `shots/prompts/`. Test take N04 s1929: 72 s, look approved by the agent (period, clean, no text). Batch running in the background (~1 min per take).
- Deferred to batch 2 (needs picks): N06, N08, N26 (conditioned on the references), N15 (from N14), N27 (from N26), and the LTX-2.3 clips from the picked keyframes. Tape overlays (N12, N18) will be code (K), not generated.

## 14. 2026-10-31 — M2: film layer and cards in Remotion

- Remotion 4.0.534 (pinned; released 2026-10-07), React 18.3.1. `src/film/FilmLayer.tsx` is the one wrapper: 18 fps picture cadence via `<Freeze>` on a 2,1,1 hold pattern (measured: one repeated frame in four), tone (full desaturation, contrast curve, faint warm tint), 0.6 px blur, seeded gate weave (±1.5/±2 px, smoothed), flicker 0.92–1.05, grain loop (`scripts/grain_plates.py`, 24 plates, seed 1929, overlay blend), seeded dust, hairs and persisting vertical scratches (skipped inside `clean_ranges_s`), vignette, 4:3 picture pillarboxed. All parameters in `config/film.json`.
- `src/film/devices.tsx`: `Still` (eased push/pan; warns past 5%/s of width), `Clip` (OffthreadVideo, playback rate for over-crank), `Card` (Deco stepped double border; Limelight for short lines, Old Standard TT for fact text; fonts SIL OFL from google/fonts in `public/fonts/`), `Leader` (5-4-3-2 with sweep), `Iris` (open/close), `Burn` (seeded holes bloom from pinpricks with scorched rims, merge, white flare, black tail). Freeze and one-frame inserts use Remotion's `<Freeze>`/sequences.
- Burn v1 merged into a white blob by 40% of its length; v2 grows each hole as rmax·u^p and draws rims under cores so merged holes read as one burn.
- `src/M2Test.tsx`: leader → iris open on a pushed still → N03 card → pan → placeholder clip → freeze + burn → N31a date card → N31c fact card → iris close; master audio 0–25 s. Placeholders: N04 s1929, ref_customer s1929, and a 640×480 zoompan clip made from N04 by ffmpeg.
- `npx remotion render src/index.ts M2Test out/m2/m2_filmtest.mp4 --codec=h264 --crf=18`: 600 frames at 1080p in 15 s.

## 15. 2026-10-31 — M4 groundwork while batch 1 runs

- `config/edit.json`: every shot's content (kind, media, moves, overlays, cards), from the brief's shot list. Kinds: leader, still (iris, caption, bulb/needle overlays), card, card_then_still, clip (keyframe-still fallback), clip_montage (cut per bar or accelerating on beats, over-crank), dissolve (N15), zoom_through (N16), freeze_card (N19–N21), insert (N22), silhouettes (N23, N28: placeholders for the cut-outs), freeze_burn (N30), chat_zoom (B01), credits.
- `src/Main.tsx`: the whole video from `timing/shot_times.json` + `config/edit.json`; one FilmLayer for everything before B01 and one after. Media not in `config/picks_manifest.json` renders as a labelled placeholder. Tape piles (N12 ankle, N18 knee) are code.
- `scripts/capture_chat.mjs` → `public/media/chat/planning_chat.png` (2560×1920, light mode) with the coda line "its maker just filed to sell stock" centred; its box in `config/chat_capture.json`. B01 shrinks the filmed coda still away while the chat scales from 2.6× to 1× about that line.
- `scripts/pad_master.py` → `public/audio/master_padded.wav`: locked master + 16.33 s seeded crackle (seed 1930) to the video end, 202.167 s. `scripts/publish_picks.py` copies kept takes into `public/media/picks/` and writes the manifest.
- Draft render (`--scale=0.5`): 202.18 s in 55 s. Fixed: card text now sizes to fit the box (the disclosure card overflowed).
