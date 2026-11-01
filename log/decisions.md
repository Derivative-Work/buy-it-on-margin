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

## 5. 2026-10-31 — Clips at 960×720, not 480p

The LTX-2.3 i2v template samples at half size, then upscales ×2. Asking for 960×720 runs the main pass at 480×360, so it stays fast. The film layer softens it to match the stills anyway.

## 6. 2026-10-31 — M6: resolving the audit flags

Verdicts: ChatGPT "HOLD FOR CORRECTIONS" (MISLEADING: N31c, N34a, N34c); Gemini all ACCURATE except N34d UNVERIFIABLE (repo not public yet). Each flag was checked against primary sources before changing a card.

- **N34a: the $518B was misattributed.** The public S-1 (EDGAR, accession 0001628280-26-067168, filed 2026-10-26) confirms the six-month net loss of $80,748M and the $72,388M "change in fair value of convertible notes, derivative liabilities, and SAFEs", "primarily driven by … an increase in our enterprise valuation". But it leaves the aggregate commitment total blank ("aggregate committed spend of more than $ ,"); "518" appears nowhere in it. The figure is Reuters' report on a draft prospectus (~Oct 20). The card now attributes it to Reuters and the draft, and names the charge (convertible notes and SAFEs). Gemini's "ACCURATE, every figure matches the S-1" was wrong on this point.
- **N31c:** "began" → "helped start" the Great Depression (the crash was one cause among several).
- **N34b:** "to recover" → "to regain that peak" (the nominal Dow peak, not the economy or real returns).
- **N34c:** names Regulation T and "50% up front" (initial margin), and "very profitable" → "large, profitable".
- **Not changed:** N25 "$1,000,000,000,000 GONE IN A DAY" (both rated ACCURATE; "TECH STOCKS" already frames it as market value, and the headline is the joke). ChatGPT's persistent "SATIRE — NOT INVESTMENT ADVICE" caption over the choruses (out of period; SH00 and N34a carry the disclaimer; suggested for the video description instead).
- **Gemini's fact-card claims checked and rejected:** "the S&P tech sector fell 4.2%, not more than 4.2%" — the cited NBC article says "more than 4.2%". "Goldman's figure was $489B" — unverified; but the cited CryptoBriefing page attributes "nearly $500 billion" to Bloomberg, not Goldman, so the fact card's attribution needs fixing either way.
- **Open before release:** make `github.com/Derivative-Work/buy-it-on-margin` public (N34d); re-check the S-1's status (an S-1/A with a price range or effectiveness changes N34a); the song doc's fact card needs the matching edits (disclosure row, $518B attribution, the AI-debt source, Cloud vs total revenue).
