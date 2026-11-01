# Buy It on Margin

**AI-generated satire. Not investment advice.** A five-minute music video in the style of a 1929 newsreel. A hot-jazz Charleston sells the thinking machine on the ten-percent-down plan. The band stops dead on "Buy it on mar—", and two date cards play in the silence: Tuesday, October 29, 1929, and Thursday, October 29, 2026. The coda's last line, "Why, its maker just filed to sell stock", zooms out from the newsreel to the chat where the song was written.

That line is literal: the lyrics were drafted by Claude, made by Anthropic, which filed to go public on October 26, 2026. The end cards disclose it and say where the comparison with 1929 doesn't hold. Their sources are under [Sources](#sources).

This repository is the production log the video's credits point to. Claude Code produced the video. A human approved each milestone, picked the takes, made the Suno generations and judged everything that needed ears or moving pictures. Every human action is logged.

## How it was made

| Stage | What | Tools |
| --- | --- | --- |
| Song | Lyrics drafted with Claude and audited by two other labs' models. One Suno take, plus a regenerated coda joined on, edited into one master with four seconds of silence and a ticker; then a cleanup ("deslop") post-filter so the words stay clear | Suno v6, music-deslop M6f |
| Credits music | A Suno cover of the song: instrumental, style "1920s player piano", deliberately not post-filtered | Suno v6 |
| Timing | Lyrics aligned to the vocal stem, beats from the band stems; every shot cued to a word or a beat | WhisperX, librosa |
| Stills | 1920s photographs of invented people and places, kept consistent with reference images | FLUX.2 [dev] in ComfyUI |
| Clips | Four moving shots from picked stills; shadow-play dancers and runners, thresholded into mattes | LTX-2.3 image-to-video in ComfyUI, ffmpeg |
| Film layer | 18 fps picture cadence, tone curve and warm tint, gate weave, flicker, grain, dust, scratches, vignette, 4:3 pillarbox; every random choice seeded (1929) | Remotion 4 |
| Code shots | Intertitles, film leader, iris, burn, the rate dial's needle, the ticker-tape piles, the planning-chat zoom-out, captions | Remotion 4, Puppeteer |
| Checks | Two fact-check audits of every on-screen word (M6), then each flag checked against the primary source | ChatGPT, Gemini, the SEC's EDGAR |
| Human | Milestone approvals, takes, the Suno generations, the cut point, the audits | a human |

Three things come straight from the process rather than being staged:
- **The coda line.** "Its maker just filed to sell stock" is about the model that drafted it, and the video ends on the chat where it did.
- **The planning chat.** The zoom-out shows the real chat, captured from its public share.
- **The disclosure figures.** They come from Anthropic's S-1 on EDGAR; one figure the press attributed to the S-1 turned out to be from a draft, and the card says so.

## Sources

The on-screen claims, card by card, as they appear in the video:

1. **"according to legend"** (over "the shoeshine's got two"). The shoeshine-boy stock tip is a Wall Street legend; its earliest known telling is from 1959.
   - [Quote Investigator: "When a Shoeshine Boy Knows as Much as I Do About the Stock Market…"](https://quoteinvestigator.com/2026/08/16/shoeshine-stock/), which traces it to Joseph F. Dinneen's *The Kennedy Family* (1959).
2. **"Ten per cent down."** 1920s stock buyers typically put down 10% and borrowed the rest.
   - [Federal Reserve History: Stock Market Crash of 1929](https://www.federalreservehistory.org/essays/stock-market-crash-of-1929).
3. **"TECH STOCKS: $1,000,000,000,000 GONE IN A DAY."** On Friday, October 30, 2026, tech stocks lost more than $1 trillion in market value, and the S&P 500 tech sector fell more than 4.2%.
   - [NBC News, October 30, 2026](https://www.nbcnews.com/business/markets/tech-stocks-nasdaq-ai-boom-fears-deepen-rcna606512).
4. **"TUESDAY, OCTOBER 29, 1929" / "THURSDAY, OCTOBER 29, 2026."** Black Tuesday; and the day Alphabet fell almost 13% after its third-quarter results, erasing about $500 billion in market value.
   - [Federal Reserve History](https://www.federalreservehistory.org/essays/stock-market-crash-of-1929); [Fortune, October 30, 2026](https://fortune.com/2026/10/30/why-big-tech-earnings-are-a-crucial-report-card-for-the-ai-boom-and-its-future/).
5. **"One of these helped start the Great Depression. The other was two bad days, so far."** and **"by 1932 the Dow was down about 89% from its peak, and it took until 1954 to regain that peak."** The Dow peaked at 381.17 on September 3, 1929, bottomed at 41.22 on July 8, 1932, and regained its 1929 high on November 23, 1954.
   - [Federal Reserve History](https://www.federalreservehistory.org/essays/stock-market-crash-of-1929).
6. **The disclosure card.** "Anthropic filed to go public on October 26, 2026. Its filing reports a first-half 2026 net loss of $80.7 billion, of which $72.4 billion is a non-cash charge on its convertible notes and SAFEs that grew with its valuation. Reuters, citing a draft of the filing, reported $518 billion in committed future infrastructure spending."
   - [Anthropic, PBC, Form S-1, filed October 26, 2026 (SEC EDGAR)](https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm): net loss of $80,748 million for the six months ended June 30, 2026, including a $72,388 million "change in fair value of convertible notes, derivative liabilities, and SAFEs", "primarily driven by … an increase in our enterprise valuation".
   - The public S-1 leaves the aggregate commitment total blank. The $518 billion is from Reuters' review of a draft prospectus: [Let's Data Science, citing Reuters, October 21, 2026](https://letsdatascience.com/news/anthropic-draft-ipo-prospectus-reveals-450-billion-cloud-com-5cc98fc2).
7. **What the lyrics refer to**, three cards after the disclosure:
   - **"Who needs a dollar when the bank'll float a loan?"** Today the borrowing is mostly bonds, not margin: about $500 billion of AI-related debt was issued in 2026 by October, some $200 billion of it by Amazon, Alphabet, Meta, Microsoft and Oracle ([Crypto Briefing, citing Bloomberg, October 10, 2026](https://cryptobriefing.com/tech-companies-bond-sales-ai-debt/)), and at least 18 data center deals in high-yield bonds and leveraged loans priced at double-digit yields ([CRE Daily, citing Bloomberg, October 28, 2026](https://www.credaily.com/?p=224674)).
   - **"A holdin' company holds 'em."** Samuel Insull's utility empire was "a series of highly leveraged companies owning shares in one another", and it fell apart in 1932 ([EBSCO Research Starters](https://www.ebsco.com/research-starters/history/insull-utilities-trusts-collapse)). Nvidia has invested $30 billion in OpenAI and up to $10 billion in Anthropic ([The Conversation, via Phys.org, October 18, 2026](https://phys.org/news/2026-10-paying-circular-money-machine-ai.html)), and guaranteed up to $105 billion of lease obligations for OpenAI's Ohio data center ([Data Center Knowledge, August 19, 2026](https://www.datacenterknowledge.com/data-center-construction/nvidia-backs-openai-s-ohio-data-center-buildout-with-105b-guarantee)). Anthropic's S-1 lists NVIDIA GPUs among the chips it runs on.
   - **"The fella with the cloud boom"** is Alphabet: Google Cloud revenue up 103% to $30.7 billion, free cash flow of −$9,065 million after $51,355 million of capital expenditures ([Alphabet's Q3 2026 earnings release, 8-K, October 28, 2026](https://www.sec.gov/Archives/edgar/data/1652044/000165204426000080/googexhibit991q32026.htm)); shares down almost 13% the next day ([Fortune](https://fortune.com/2026/10/30/why-big-tech-earnings-are-a-crucial-report-card-for-the-ai-boom-and-its-future/)).
8. **"today's US rules (Regulation T) require 50% up front for most stock bought on margin. And much of today's AI spending comes from large, profitable companies, not small investors on credit."**
   - [12 CFR 220.12](https://www.law.cornell.edu/cfr/text/12/220.12): the required margin for a margin equity security is 50% of its current market value.
   - Amazon, Microsoft and Alphabet plan to spend as much as $600 billion in 2026 ([Tech Insider, citing Reuters, October 27, 2026](https://tech-insider.org/big-tech-earnings-ai-boom-test-1-7-trillion-backlog-600-billion-spend-2026/)), and are profitable (Alphabet's third quarter: $2.12 a share, [24/7 Wall St.](https://247wallst.com/cards/google-q3-2026-earnings-goog-01m621vznfkjc3wnswzh48s3h8)). The card says who is spending, not how it is financed: the same reporting notes the buildout leans increasingly on debt.

Each link was opened and checked on October 31 or November 1, 2026. The lyrics' own fact card, with a source for every line, is in the song doc; the two fact-check audits and how each flag was resolved are in [`log/audits/`](log/audits/) and [`log/decisions.md`](log/decisions.md) (entry 6).

Anthropic's S-1 was not yet effective on November 1, 2026. If it becomes effective, or is amended or withdrawn, the disclosure card will be out of date.

## Where things are

- [`log/production_log.md`](log/production_log.md): every generation, analysis and render, with model, prompt, seed, inputs, output and whether it was kept.
- [`log/human_interventions.md`](log/human_interventions.md): every human action, in the human's words.
- [`log/decisions.md`](log/decisions.md): every deviation from the brief, and why. [`log/ai_changes.md`](log/ai_changes.md): what the generators changed.
- [`log/audits/`](log/audits/): the M6 fact-check audits, verbatim.
- [`docs/brief.md`](docs/brief.md): the brief (shot list, film layer, milestones).
- [`shots/`](shots/): every still and clip prompt with its seed.
- [`config/`](config/): the master edit, shot cues, cards, picks and every edit setting. [`timing/`](timing/): the timing map and shot times.
- [`src/`](src/): the Remotion project: the film layer, the devices, the edit, the Short.
- [`scripts/`](scripts/): one script per step. Each one documents itself at the top.
- [`docs/planning_chat/`](docs/planning_chat/): the planning chat, as Markdown and as the raw share snapshot. [`docs/suno*/`](docs/): the Suno take records and the lyrics as submitted.
- [`METADATA.md`](METADATA.md): the YouTube title, description, tags and settings for both uploads.
- [`deliverables/`](deliverables/): the upload's captions (the lyrics as sung) and the thumbnails for the video and the Short.

## Reproducing it

Large files (audio, takes, the videos) are not in git; [`MANIFEST.sha256`](MANIFEST.sha256) lists them with checksums. The release [`archive-2026-11-01`](https://github.com/Derivative-Work/buy-it-on-margin/releases/tag/archive-2026-11-01) has:
- the two upload files, with English captions and the thumbnails, all also in [`deliverables/`](deliverables/);
- the audio that can't be regenerated: the Suno takes and stems, the post-filtered takes and the master;
- every still and clip the production made, and the picks and mattes as the edit uses them.

```sh
scripts/setup_env.sh --no-comfy   # Node, Remotion, the Python venv (idempotent; drop --no-comfy for ComfyUI and the weights)
scripts/rebuild.sh --fetch        # download the archive, re-render both videos, captions and thumbnails, check against the release
```

On the production machine, the rebuild gives byte-identical captions, thumbnails and Short. The main video's audio is bit-identical, and its picture differs only in the last bit of a few panned stills (Chrome's compositing; worst frame 42.8 dB PSNR), so `rebuild.sh` checks it to 40 dB.

Regenerating the takes themselves from the models is a per-stage job. The commands are in the production log, and the picks in `config/` make the same choices again.
- Every random process reads its seed from `config/`. Stills and clips with the same seed, weights and ComfyUI version should match on the same GPU; expect small differences elsewhere.
- The songs can't be regenerated: Suno doesn't give the same song twice. The post-filter model is private for now.
- The ticker sound isn't redistributed (see [`LICENSE-media.md`](LICENSE-media.md)). It is already in the master; to rebuild the master itself, download it from Pixabay into `audio/sfx/`.
- The planning chat's share page is live and may change. The archive keeps the capture the video used.

## Licences

- **Video and assets:** [CC BY-NC-SA 4.0](LICENSE-media.md). That file lists exactly what it covers, and what it doesn't (fonts, the ComfyUI template, the ticker sound, the claude.ai interface).
- **Code:** [MIT](LICENSE). Rendering it needs [Remotion](https://www.remotion.dev), which has its own licence: free for individuals, small companies and non-profits.

## Credits

- **Lyrics:** Claude, drafted in the [planning chat](docs/planning_chat/planning_chat.md) and audited by Gemini and ChatGPT.
- **Music:** Suno v6: one take, a regenerated coda joined to it, and a player-piano cover for the credits.
- **Post-filter:** music-deslop (M6f, 10k steps), a cleanup model for AI-generated music that Claude Code built and trained from a human-written spec, on Creative Commons audio only (training data listed in the [Folks Like Us README](https://github.com/Derivative-Work/folks-like-us#mastering-model-training-data)). The model is private for now. The credits cover is not post-filtered: it should sound like an old record.
- **Video:** Claude Code with Claude Opus 5.5, with the models and tools under [How it was made](#how-it-was-made), each used under its own licence.
- **Ticker sound:** "Daisy Wheel Word Processor" by freesound_community, from [Pixabay](https://pixabay.com/sound-effects/technology-daisy-wheel-word-processor-29353/).
- **Fonts:** [Limelight](https://fonts.google.com/specimen/Limelight) and [Old Standard TT](https://fonts.google.com/specimen/Old+Standard+TT), SIL Open Font License 1.1 (`public/fonts/`).
