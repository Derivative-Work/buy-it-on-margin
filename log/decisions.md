# Decisions

Deviations from the brief, and why.

## 1. 2026-10-31 — The master is two Suno clips and an edit

The brief expected one locked master from the human. The human gave a cut point and two takes instead, so the agent builds the master (`scripts/build_master.py`, edit list in `config/master.json`): v1 [0, 151.884 s] (3 ms fade) + 4.0 s gap (seeded crackle + the ticker from 0.6 s) + v2 [169.85 s, end] (20 ms fade-in). It drops the extend's ~18 s of band before the coda. The master runs 185.83 s, and the coda sits 13.966 s earlier than on v2. The human approves it by ear before M1.

## 2. 2026-10-31 — Post-filter on (song doc said off)

The human's call. It goes on both sources before the join, so the ticker and crackle are never filtered and the model sees each take in context. Both raw and post-filtered masters are built from the same edit list for comparison.

## 3. 2026-10-31 — B01 moves from the opening to the coda

No opening screen capture. The coda's last line, "Why, its maker just filed to sell stock" (master ≈172.1–177.6 s), zooms out from the newsreel to the planning chat. This changes N32/N33: the iris-close and "The End?" card follow the zoom-out or fold into it; settled in M4. The chat can be rendered from the public share with Puppeteer at any size, so it needs no screen recording from the human.
