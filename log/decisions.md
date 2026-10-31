# Decisions

Deviations from the brief, and why.

## 1. 2026-10-31 — The master is two Suno clips and an edit

The brief expected one locked master from the human. The human gave a cut point and two takes instead, so the agent builds the master (`scripts/build_master.py`, edit list in `config/master.json`): v1 [0, 151.884 s] (3 ms fade) + 4.0 s gap (seeded crackle + the ticker from 0.6 s) + v2 [169.85 s, end] (20 ms fade-in). It drops the extend's ~18 s of band before the coda. The master runs 185.83 s, and the coda sits 13.966 s earlier than on v2. The human approves it by ear before M1.

## 2. 2026-10-31 — Post-filter on (song doc said off)

The human's call. It goes on both sources before the join, so the ticker and crackle are never filtered and the model sees each take in context. Both raw and post-filtered masters are built from the same edit list for comparison.

## 3. 2026-10-31 — B01 moves from the opening to the coda

No opening screen capture. The coda's last line, "Why, its maker just filed to sell stock" (master ≈172.1–177.6 s), zooms out from the newsreel to the planning chat. This changes N32/N33: the iris-close and "The End?" card follow the zoom-out or fold into it; settled in M4. The chat can be rendered from the public share with Puppeteer at any size, so it needs no screen recording from the human.

## 4. 2026-10-31 — M1 shot timing choices (pending the gate)

- N25's card starts at "And the fella…" (Verse 3, line 2), not at "a sock right in the ear": from the brief's cue it would hold 2.3 s, under the 3.8 s rule for 7 words.
- N27 (pie) starts on "cash"; N17 (hatbox) on "with the IOUs"; N30 freezes on the last "Buy—" hit and burns through the ring-out to black at the cut.
- N31: the 4 s silence can't hold three cards under the hold rule (2.8 + 2.8 + 6.5 s). Proposed: the two dates at 2.0 s each in the silence; the third card over the coda's first line (155.9–161.5 s); N32's iris opens at "Ten cents down". The Done-when keeps the silence at 4 s, so the master isn't changed.
- N34 credits: the disclosure card alone needs ~21 s; the music ends 4.8 s after the credits start. Proposed: the credits run past the music on the crackle bed.
