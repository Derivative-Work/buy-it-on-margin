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

## 16. 2026-10-31 — M3 batch 2 prep (clips)

- `comfy/templates/video_ltx2_3_i2v.json` (ComfyUI workflow templates package) → `comfy/api/video_ltx2_3_i2v.api.json` via `node scripts/comfy_ui_to_api.mjs` (from Folks Like Us; 51 nodes).
- `config/clips.json` + `scripts/clips.py`: C1a, C1b, C2, C3 from the picked keyframes, two seeds each, prompt = motion + the brief's clip style, prompt enhancer off. 4 s at 24 fps, 960×720. Deviation: the brief says 480p; the template renders at half size and upscales ×2, so 960×720 costs the same first pass as 480×360 and gives a cleaner 4:3 frame. Logged in decisions.

## 17. 2026-10-31 — M3 batch 1 done; N24 and N14 regenerated as v2

- 76 takes (19 items × 4, seeds 1929–1932), ~55–75 s each, rows in `shots/prompts.md`. `scripts/contact_sheet.py` → `takes/stills/contact_sheet.jpg`.
- Agent review: usable takes for every item except two prompt misses. N24: FLUX drew a clock with hands (A gold clock; B–D hands), which would fight the code needle. N14: a glass pavilion with lit windows, against the brief's "windowless". Notes for the human: N16a C/D have a white photo border; ref_machine has a man beside the cabinet in every take (usable as scale); N11's tower resembles the Empire State Building.
- `scripts/stills.py` now versions revised prompts (`"v": 2` → `<item>_v2_s<seed>.png`; v1 takes stay); "kept" accepts a seed or a file stem. `stills.py N24 N14` with v2 subjects (blank gauge face, no hands; blank concrete walls, no windows, glow from the roof edge).
- v2 done (N24 50 s, N14 70 s per take): N24 blank gauge face in all four; N14 windowless concrete block with roof glow in all four. Contact sheet rebuilt with both versions.
- Batch 2 first try failed: ComfyUI 0.42 rejects ImageScaleToTotalPixels without `resolution_steps` (HTTP 400, required_input_missing). Added `resolution_steps: 1` and `area` scaling, as in Folks Like Us' keyframes.py; nothing had been generated.

## 18. 2026-10-31 — Animatic with the picked stills

- `scripts/publish_picks.py` → 19 picks in `public/media/picks/`, manifest with image sizes.
- Fixed in `Still`: images were forced to 4:3 with object-fit cover, cropping the wide (N06, N14, N15) and tall (N07, N11) stills so pans and tilts had nothing to travel over. Images now keep their aspect, filling the frame's short side. Overlays (N24 needle, N06 bulb) are drawn inside the still's moving frame, so they track pushes.
- N24 needle placed on the gauge found in the pick (largest bright disc: centre 0.646, 0.451; radius 0.169 of width). Tilts and pans held to the 5%/s limit: N11 ±0.07, N07 ±0.08, N06 ±0.07.
- Spot-checked 12 frames at half size (N02, N03, N05, N07, N11, N14, N16, N17, N22, N24, N31c, N32): all placed as intended.

## 19. 2026-10-31 — K silhouettes (N23, N28)

- `src/film/Silhouettes.tsx`: jointed paper-cutout figures (hinged shoulder, elbow, hip, knee; hats, skirts, horns), poses locked to the band's beat grid. N23: clarinet and trumpet trade the break every two bars on a riser over a six-figure Charleston kick line. N28: 16 seeded figures run left to right at mixed speeds. v1 had arms hinged upward and merged legs; fixed and checked on 5 frames. Also the brief's fallback for any dance clip that comes out mushy.

## 20. 2026-10-31 — M3 batch 2: stills done, clips stopped

- `scripts/batch2.sh`: N06 (ref_machine), N08 and N26 (ref_customer), N15 (N14 v2) ×4 seeds at ~100 s each (reference conditioning roughly doubles FLUX.2's time), then N27 from each N26 take with the matching seed (~78 s each). All 20 takes in `takes/stills/`, rows in `shots/prompts.md`.
- The clip stage (`scripts/clips.py`) never produced a take: Claude Code stopped the batch for low system memory as the LTX-2.3 stage began. ComfyUI was holding ~33 GB of RAM (FLUX.2 staged for dynamic VRAM loading) with 4 GB free of 38 GB. Not restarted by the agent; waits for the human. Suggested before rerunning: free ComfyUI's models (`POST /free`, as `comfy_client.free()`), or restart ComfyUI, so LTX-2.3 and Gemma load into empty RAM.
- `config/stills.json` "kept" came back clean (the temporary N26 pick was removed before the stop).

## 21. 2026-10-31 — Batch 2b started; N06 bulb placed

- `scripts/batch2b.sh`: frees ComfyUI's models before each stage (`comfy_client.free()`): RAM went from 33 GB used / 4 GB free to 5 GB used / 30 GB free. Then N27 v2 (4 seeds, conditioned on N26 1930), free, clips (C1a, C1b, C2, C3 ×2 seeds), contact sheet.
- N06 bulb overlay at (0.507, 0.243) of the image, located on a gridded view of the pick. The bulb and needle overlays now position by image percentage, so they work on wide images. Checked on one frame.

## 22. 2026-10-31 — Batch 2b done; M4 animatic v1

- N27 v2: 4 takes at ~78 s; the pie now reads in all four (C has two tins). Clips: 8 takes (C1a, C1b, C2, C3 × seeds 1929/1930), 11–33 s each, 97 frames at 24 fps, 960×704 (the template rounds height to a multiple of 32). RAM stayed under 5 GB used at each stage boundary.
- Provisional picks (agent's suggestion, for the human to confirm in the animatic): N27 v2 1932; C1a 1930, C1b 1929, C2 1929, C3 1929 (`config/clips.json` → `kept`).
- `Clip` loops a 4 s clip for longer shots (N09 9.0 s, N12 8.2 s), mirrored on every other pass (brief: loop or re-cut rather than generate more). Draft mode (`--props='{"draft":true}'`) prints shot ID, timecode and frame in the left pillarbox.
- `npx remotion render src/index.ts Main out/m4/animatic_v1.mp4 --scale=0.5 --crf=22 --props='{"draft":true}'`: 202.18 s at 960×540, rendered in 50 s. Checked 17 frames across the edit. Known weak spot: the code tape piles (N12, N18) read as stiff sticks over a flat band, not paper tape; to redo.

## 23. 2026-10-31 — Animatic v1 fixes → animatic v2

- **Tape (N12, N18):** FLUX.2 `tape_pile` (style "isolated", seeds 1929/1930; kept 1929), a heap of curled tape on black. Three tries in the edit: squashed to height (flat white slab, rejected); one sunk copy at full width (curls at close-up scale, giant next to the dancers, rejected); final: six copies at ~42% of frame width, mirrored alternately, each sunk so its peak (measured 25% from the image top) stands at the target level (0.08 of the frame in N12, 0.2 in N18), lighten blend, image's dark floor crushed to black.
- **N22:** the modern dancer now holds 14 picture frames (0.78 s, 105.49–106.27 s) instead of 1.
- **N23, N28:** shadow-play keyframes (style "shadowplay": black silhouettes on a backlit white screen; kept kf_N23band 1929, kf_N23kick 1929, kf_N28run 1929), then LTX-2.3 clips (S23band 8 s, S23kick 8 s, S28run 5 s; kept S23band 1930, S23kick 1929, S28run 1929). `scripts/mattes.py`: Otsu threshold per clip (113/112/118), border painted white (5% sides and top, 12% bottom: the screen frame and stage edge), 0.8 px blur → `public/media/picks/<clip>_matte.mp4`. Main multiplies the mattes onto the pale stage; band on a drawn riser in the upper frame, kick line below; runners full frame, not mirrored (a mirrored loop would reverse them). The code cut-outs stay as the fallback.
- **N24:** needle redrawn as a period gauge hand: blackened spade-tipped pointer with counterweight tail, drop shadow, domed brass cap with a rivet; eased climb.
- **N17 v2:** conditioned on the v1 pick (`kept_v1`), RAM sticks and graphics cards with fans in the hatbox and on the desk, unbranded. Kept D 1932 (B had no hardware).
- `npx remotion render … out/m4/animatic_v2.mp4 --scale=0.5 --props='{"draft":true}'` (53 s). Checked frames at the N22 edges, N17, N23, N24, N28.

## 24. 2026-10-31 — M5: finals

- **Credits:** N34 split into four cards chained by the hold rule (`cue: "chain"`): disclosure (song doc), two "Where 1929 doesn't fit" cards (Scale; Leverage + Who's spending, song doc), and the series credit line with the repo URL. Credits 181.00–232.33 s (51 s, 46.5 s past the music); `scripts/pad_master.py` re-run (crackle to 232.333 s).
- **Captions:** one rule (`config/captions.json`: line start to the next line's start, capped at 1 s after its last word, at least 1 s) used by `src/Captions.tsx` (burned in) and `scripts/export_srt.py` → `deliverables/buy_it_on_margin.en.srt` (42 cues). Same data, so the burned-in captions sit within one frame of the timing map.
- **Short:** `src/Shorts.tsx`, 1080×1920: title "BUY IT ON MARGIN / 1929, again" above, the film-layered picture (the main edit scaled 0.75, cropped to 4:3) in the middle, captions below. "A cautionary tale of borrowed money. Not investment advice." card (4.5 s), then N08–N13 (29.18–58.87 s) with 0.25 s/0.5 s audio fades. Fixed: the offset edit covered the intro card (now nested after it).
- **Thumbnails:** `scripts/thumbnail.py` from the N30 freeze (1080p, captions off): `deliverables/buy_it_on_margin_thumbnail.jpg` (1280×720, title over a top fade) and `…_short_thumbnail.jpg` (1080×1920, with the cautionary line).
- **Renders:** `npx remotion render src/index.ts Main deliverables/buy_it_on_margin.mp4 --crf=17 --audio-bitrate=320k` (232.34 s, 1920×1080, 24 fps, 1 min 30 s); `… Shorts deliverables/buy_it_on_margin_short.mp4` (34.22 s, 1080×1920, 12 s).
- **Checks:** audio offset vs the padded master 0.0 ms at 10, 100, 151 and 170 s (Short: 0.4 ms). Loudness −16.8 LUFS integrated, −1.7 dBFS peak (master −16.7 / −1.6); Short −16.0 / −3.4.
- **M6 prep:** `docs/m6_fact_check_prompt.md`, a self-contained prompt for another lab's model: every on-screen text with its time, the song doc's fact card with links, the lyrics as sung.

## 25. 2026-10-31 — M6 fixes; finals re-rendered

- Audits in `log/audits/`; resolutions in `log/decisions.md` 6. Primary check: the S-1 HTML from EDGAR (`https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm`), text-searched for the disclosure figures.
- `config/cards.json`: N31c, N34a, N34b, N34c revised (N34c with a non-breaking space in "Regulation T" after it wrapped as "Regulation / T").
- `scripts/shot_times.py` → credits 181.00–239.00 s (N34a 25.2 s, N34b 12.2 s, N34c 14.2 s, N34d 6.5 s); same pre-approved hold shortfalls (N05, N19, N20, N31a/b, N31c now 5.6 s for 16 words). `scripts/pad_master.py` (crackle to 239.0 s); `scripts/export_srt.py` (42 cues, unchanged).
- `npx remotion render src/index.ts Main deliverables/buy_it_on_margin.mp4 --crf=17 --audio-bitrate=320k` (239.02 s). Checked frames of all four revised cards. The Short has no revised text and was not re-rendered.

## 26. 2026-10-31 — Song doc fact card brought in line with the M6 cards

Edits to the song doc (https://claude.ai/artifact/2ss6PBcptViGh1xRQGYW1F, rev 24 → 37), one docs-tool update:
- **Disclosure end card:** same wording as `config/cards.json` N34a ($518B credited to Reuters' report on a draft; the charge named as convertible notes and SAFEs).
- **Where 1929 doesn't fit:** Scale "took until 1954 to regain that peak"; Leverage names Regulation T and "50% up front"; Who's spending "large, profitable companies".
- **Video sketch, N31:** "helped start the Great Depression".
- **Fact card rows:**
  - Alphabet: total revenue +~25% to $127.6B vs the $127.8B consensus, and EPS missed "the analyst consensus" (both checked on the 24/7 Wall St. page). The unsourced "ads slightly missed" was dropped.
  - AI debt: credited to Bloomberg, as the linked page does; Goldman's note is still to be linked.
  - "Every lab's got a forecast": the $518B is from a draft (Reuters); the public S-1 leaves that total blank. Sources are now Newsbytes, Let's Data Science citing Reuters, and the S-1 on EDGAR; the Bernama link was replaced because it credited the figure to the filing.
- **Intro line:** notes the M6 audit and the EDGAR check.

## 27. 2026-10-31 — Credits music: the player-piano cover

- Source: `audio/credits_cover/buy-it-on-margin-instrumental.wav` (sha c478427a…, 48 kHz, 143.6 s, −17.3 LUFS); copied from ~/Downloads. Clip record: `node scripts/fetch_suno.mjs https://suno.com/s/DbAiN1YpFiQ1whef <dir>` + `scripts/suno_clip.py <dir> 7cc9fb84-8d74-46f7-8a2e-eaaeba70dcb4` → `docs/suno_credits_cover/`. Not post-filtered (human).
- Excerpt: librosa beats (107.7 BPM) and segmentation put a section boundary at ~89.7 s. That 8-bar block repeats the section at 53.9 s, and the next boundary is 18.5 s later at 108.2 s. Downbeat onset 89.672 s; `src_in` 89.64 with a 30 ms fade-in. It runs to the cover's own ending (the final chord decays out by 143.55 s), 53.96 s.
- `config/master.json` "credits_cover": 1.0 s of crackle after the coda, then the piano at −3 dB over the crackle bed, then 1.5 s of crackle after the last chord. `scripts/pad_master.py` mixes it; `scripts/shot_times.py` holds N34d until it ends. Credits music −20.2 LUFS (song −16.7); whole track peak −1.6 dBFS.
- Video end 239.00 → 242.29 s (N34d 9.8 s). Re-rendered `deliverables/buy_it_on_margin.mp4` (242.30 s). A/V offset vs `public/audio/master_padded.wav`: 0.0 ms at 100, 170, 200, 235 and 240 s.
