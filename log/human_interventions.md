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

## 5. 2026-10-31 — M1 review: break out of sync

- **What:** "N20/N21: the spoken 1930/2030/"same difference" fall out of sync." (from `timing/check/m1_review.mp4`)

## 6. 2026-10-31 — M1 gate answers (M1 approved)

- **What:** "1. I hear "buy it on mar--" 2. these are correct 3. you correctly found 1 4. let the credits run past the music over crackle"
- **Effect:** the final chorus is sung as written (the agent's "Buy—" reading was wrong); "float a loan", "forecasts", "sell stock" are sung as written; bar phase 3 is beat 1; credits run past the music over crackle. The break-card and N31 proposals got no objection and stand as defaults until the M4 animatic.

## 7. 2026-10-31 — M2 gate: look approved

- **What:** "the look is approved, keep the warm tint. M2 is good." (`out/m2/m2_filmtest.mp4`, `config/film.json` as of commit cc0aafa.)

## 8. 2026-10-31 — M3 batch-1 picks

- **What:** "go with these": the agent's suggested picks for all 19 items (`config/stills.json` → `kept`): ref_customer 1930, ref_machine 1929, N02 1930, N04 1929, N05 1930, N07 1930, N11 1931 (the Empire-State-like tower stays), N14 v2 1929, N16a 1929, N16b 1929, N16c 1930, N17 1930, N22 1930, N24 v2 1931, N32 1932, kf_C1a 1930, kf_C1b 1931, kf_C2 1929, kf_C3 1930. The man beside the machine in ref_machine stands.

## 9. 2026-10-31 — Batch-2 picks, N27 v2, clip rerun

- **What:** "go ahead with all three": picks N06 1929, N08 1932, N15 1929, N26 1930 (the agent's suggestions); regenerate N27 with a v2 prompt (the pie didn't show); free ComfyUI's memory and rerun the clips.

## 10. 2026-10-31 — Animatic v1 review

- **What:** "N18: can visually confirm that the ticker tape piles need to be redone · the one-frame modern dancer timing is correct, but let's keep it on screen longer so the joke is more visible · N23: this whole part is not reading right -- can you try to make a video mask from generated dancing instead so the dancing looks better · N24: the clock hands need to be redone -- the simple stick-and-dot reads too modern for this era · N28: same as N23, see about making a video mask from generated running"
- Mid-turn: "N17: I think the joke can be enhanced if the hat box or the desk also has visible RAM sticks and GPUs"
