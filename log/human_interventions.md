# Human interventions

Append-only. Every human action: when, what, and why.

## 1. 2026-10-31T09:28:14Z (Suno's created_at; logged retroactively) — Suno take

- **What:** A human generated the song in Suno over many iterations and chose this one, the last.
- **Take:** clip `2414ddab-0ec6-4dcc-87d0-506ad1ca49bf`, shared as https://suno.com/s/pJ50iZMaIvND8bqS. Model v6 (`chirp-hawk`), 189.2 s, Max mode, sliders `style_weight 0.85, weirdness_constraint 0.4, aug_creativity 1`, not a remix, not instrumental. Rejected iterations aren't visible from the share page.
- **One generation, not two:** the brief and song doc planned the main song and the coda as separate generations; this take has the coda inside it ("a thinning piano coda" in the style).
- **Style prompt (as submitted):** "1920s hot jazz, fast Charleston dance-band pulse; bright male tenor delivered in hushed, close-mic intimacy, with whispered ad-libs between lines and group-shout choruses; banjo, clarinet and muted trumpet trading featured breaks over tuba bass, stride piano and brushed snare, with stop-time hits and a thinning piano coda; acoustic gramophone recording, shellac 78 rpm crackle, narrow mono sound." This is a rewrite of the song doc's prompt (adds "hushed, close-mic intimacy", "whispered ad-libs", "thinning piano coda"); the record doesn't say who rewrote it.
- **Lyrics:** `lyrics/as_pasted.txt`, the song doc's lyrics verbatim with the bracketed directions left in (the doc said to strip them).
- **Evidence:** `docs/suno/clip.json`; `audio/track/Buy It On Margin.wav` sha256 `ea3e76603c8be129…`; stems zip, all in `~/Downloads` 2026-10-31 12:31–12:33 local.
- **Why:** The agent has no access to Suno.

## 2. 2026-10-31T16:53–17:00Z — Coda re-generated as a Suno extend; cut point, ticker and decisions given

- **What (Suno):** The human had Suno regenerate the ending as an extend from v1 at 151.68 s and join it to the rest of the song:
  - Extend: clip `f43a9f22-3bd2-4c51-8b7a-adfd6a03734e`, https://suno.com/s/1EDojIuxxcJIfalT, created 16:53:32Z, 48.12 s, style "1920s crooner ballad, slow, solo upright piano, soft male vocal through a megaphone, acoustic gramophone recording, heavy shellac crackle, mono" (the song doc's coda prompt verbatim), sliders `aug_creativity 1`, lyrics from "ar—" through the coda (`docs/suno_v2_extend/lyrics.txt`).
  - Full track: concat clip `3cdd3864-c17b-42af-a23c-e5f3ed970aca`, https://suno.com/s/BUrE5JEUFeGm2MDK, 199.8 s, tags "hot jazz, Charleston". Downloaded with 12 stems (`audio/track_v2/`, `audio/stems_v2/`; wav sha256 in `MANIFEST.sha256` once built).
  - In the human's words: "I had Suno regenerate just that part and rejoin it with the rest of the song … (I couldn't get it to omit the instrumental part unfortunately)."
- **Cut point:** "all of these candidates end a few seconds too soon -- even C's final "buy" is cut off. The correct point is 2:31.884 (that is a few samples before the drums come back in)." On v1, the drums re-enter at 151.886–151.888 s, so this is v1's timeline. Candidates A–C rejected (archived in `archive/cut_candidates_v1/`).
- **Ticker:** downloaded by the human from Pixabay, https://pixabay.com/sound-effects/technology-daisy-wheel-word-processor-29353/ ("daisy wheel word processor", uploader freesound_community), `audio/sfx/freesound_community-daisy_wheel_word_processor-29353.mp3` (22.8 s, 24 kHz, 160 kbps). Pixabay Content License; credit in the end card's credits.
- **Post-filter:** "Let's try with the post-filter first" (the song doc had said leave it off). The human runs it, as in the earlier videos.
- **Bookend:** "no B01 bookend -- let's do it at the end instead with a zoom-out to the planning chat on "its maker just filed to sell stock"."
- **Planning chat:** made public; captured (below).
- **Why:** Suno and the take choices are the human's; the cut needs ears.

## 3. 2026-10-31 — Agent runs the post-filter

- **What:** "go ahead and run the post-filter yourself." In earlier videos the human ran it (R4); here the agent did, on the human's instruction.

## 4. 2026-10-31 — Master locked

- **What:** "lock the post-filtered master and start M1." `audio/master/buy_it_on_margin_master.wav` = `master_postfilter.wav`, 185.834 s, sha256 `d2f9028739d033bc…` (in `config/master.json` → `locked`).
