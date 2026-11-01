# Upload metadata

YouTube metadata for the main video and the three vertical Shorts, ready to paste at upload. Written by the agent; the human uploads.

**Before uploading:**
- **Make the repository public.** The end credits and both descriptions link to https://github.com/Derivative-Work/buy-it-on-margin, which is private until then.
- **Re-check Anthropic's IPO status** the day before (EDGAR: https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0002130357). On 2026-11-01 the latest filing was the S-1 of October 26, not yet effective. An S-1/A with a price range, or effectiveness, dates the disclosure card (3:06) and the "filed to go public" line below.
- **"Two bad days, so far"** (2:37 and 4:27) refers to October 29–30. If the selloff runs on or reverses before upload, the cards still read as dated satire, but the description should say "as of November 1, 2026" (it does).
- **Intervention count.** Update the number in the main description (`grep -c '^## ' log/human_interventions.md`; 20 on 2026-11-01).
- **The main video's link** is in the Shorts' footer (https://www.youtube.com/watch?v=2bp3_BMylKY, uploaded by the human, 2026-11-01). In YouTube Studio, also set each Short's **Related video** to the main video.

---

## Main video (16:9, 1920×1080, 24 fps)

**File:** `deliverables/buy_it_on_margin.mp4` (5:01.2; also in the release `archive-2026-11-01`). Captions: `deliverables/buy_it_on_margin.en.srt`. Thumbnail: `deliverables/buy_it_on_margin_thumbnail.jpg`.

### Title

Recommended (63 characters):

```
Buy It on Margin — a 1929 newsreel about this week's AI selloff
```

Alternatives:
- `Buy It on Margin (1929, again) — AI-made Charleston about the AI boom`
- `Buy It on Margin: an AI wrote a Charleston about buying AI on credit`

### Description

4,649 of YouTube's 5,000 characters.

```
AI-generated satire. Not investment advice.

A hot-jazz Charleston, in the style of a 1929 newsreel, sells the thinking machine on the ten-percent-down plan. The band stops dead on "Buy it on mar—", and two date cards play in the silence: Tuesday, October 29, 1929, and Thursday, October 29, 2026.

The song's last line is literal. The lyrics were drafted by Claude, made by Anthropic, which filed to go public on October 26, 2026. The end cards disclose it, say what the lyrics refer to, and say where the comparison with 1929 doesn't hold.

Every frame, note and word was made by AI: the song by Suno, the words by Claude, the pictures by FLUX.2 and LTX-2.3, the film look and edit by Claude Code. A human approved each milestone, picked the takes and ran the fact checks. Each of those 20 interventions is logged, along with every prompt and production step:
https://github.com/Derivative-Work/buy-it-on-margin

CHAPTERS
0:00 Intro: the music of tomorrow
0:21 Verse 1: the ten-percent-down plan
0:38 Chorus: buy it on margin
1:04 Verse 2: the holdin' company
1:20 Chorus
1:45 The break: what's it make?
2:11 Verse 3: the fella with the cloud boom
2:28 Final chorus
2:37 October 29, twice
3:06 The disclosure
3:31 What the lyrics refer to
4:27 Where 1929 doesn't fit

WHAT ACTUALLY HAPPENED
(The end cards, as of November 1, 2026, each checked against its source.)
• Anthropic filed to go public on October 26, 2026. Its S-1 reports a first-half 2026 net loss of $80.7 billion, of which $72.4 billion is a non-cash charge on its convertible notes and SAFEs that grew with its valuation. (Anthropic S-1, SEC EDGAR)
• Reuters, citing a draft of the filing, reported $518 billion in committed infrastructure spending; the public S-1 leaves that total blank.
• "Who needs a dollar when the bank'll float a loan?" Today it's mostly bonds, not margin: about $500 billion of AI-related debt was issued in 2026 by October, and at least 18 data center deals priced at double-digit yields. (Bloomberg)
• "A holdin' company holds 'em": Insull's leveraged utility pyramid collapsed in 1932. Today the money circles: Nvidia has invested $30 billion in OpenAI and up to $10 billion in Anthropic, which both run on its chips, and guaranteed up to $105 billion for an OpenAI data center.
• "The fella with the cloud boom" is Alphabet: cloud revenue up 103%, free cash flow −$9.1 billion after $51.4 billion of capital spending, shares down almost 13% on October 29.
• On October 30, tech stocks lost more than $1 trillion in market value.
• By 1932 the Dow was down about 89% from its 1929 peak, and it took until 1954 to regain it. Buyers in 1929 typically put 10% down; today's Regulation T requires 50% for most stock bought on margin.

SOURCES
Anthropic S-1: https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm
Reuters, via Let's Data Science: https://letsdatascience.com/news/anthropic-draft-ipo-prospectus-reveals-450-billion-cloud-com-5cc98fc2
Crypto Briefing: https://cryptobriefing.com/tech-companies-bond-sales-ai-debt/
CRE Daily: https://www.credaily.com/?p=224674
EBSCO (Insull): https://www.ebsco.com/research-starters/history/insull-utilities-trusts-collapse
The Conversation, via Phys.org: https://phys.org/news/2026-10-paying-circular-money-machine-ai.html
Data Center Knowledge: https://www.datacenterknowledge.com/data-center-construction/nvidia-backs-openai-s-ohio-data-center-buildout-with-105b-guarantee
Alphabet Q3 2026 earnings release: https://www.sec.gov/Archives/edgar/data/1652044/000165204426000080/googexhibit991q32026.htm
Fortune: https://fortune.com/2026/10/30/why-big-tech-earnings-are-a-crucial-report-card-for-the-ai-boom-and-its-future/
NBC News: https://www.nbcnews.com/business/markets/tech-stocks-nasdaq-ai-boom-fears-deepen-rcna606512
Federal Reserve History: https://www.federalreservehistory.org/essays/stock-market-crash-of-1929
12 CFR 220.12: https://www.law.cornell.edu/cfr/text/12/220.12

CREDITS
Words: Claude, in conversation, audited by Gemini and ChatGPT
Music: Suno V6 (take 2414ddab, coda extend 3cdd3864), post-filtered with music-deslop (checkpoint M6f 10k)
Credits music: Suno V6 cover, "1920s player piano" (take 7cc9fb84), not post-filtered
Stills and moving shots: FLUX.2 [dev] and LTX-2.3 in ComfyUI
Film look and edit: Claude Code with Opus 5.5 (Remotion)
Ticker: "Daisy Wheel Word Processor" by freesound_community (Pixabay), Pixabay Content License
Type: Limelight and Old Standard TT (SIL OFL)

Video and assets: CC BY-NC-SA 4.0 · Code: MIT
Satire. Not investment advice. Not affiliated with or endorsed by any company named here.

#AIgenerated #musicvideo #satire
```

### Tags

Paste as one comma-separated line (374 of 500 characters):

```
Buy It on Margin, AI music video, AI generated, AI satire, 1929 stock market crash, Black Tuesday, newsreel, silent film, Charleston, hot jazz, 1920s music, AI bubble, AI stocks, buying on margin, Anthropic IPO, circular financing, tech selloff, Great Depression, Suno, Claude, Claude Code, FLUX.2, LTX-2.3, Remotion, player piano, stock market satire, not investment advice
```

### Settings

| Setting | Value |
|---|---|
| Category | Music |
| Audience | Not made for kids |
| Altered or synthetic content | **Yes.** The singing voices are AI-generated, and the stills look like real 1920s photographs of people who never existed. The opening card says the video is made with AI. |
| Language / caption language | English / English |
| Captions | Upload `deliverables/buy_it_on_margin.en.srt` as English subtitles (42 cues, the lyrics as sung, timed to the burned-in captions). |
| License | Standard YouTube License. YouTube's only Creative Commons option is CC BY, which would drop the NC-SA terms; the description states the licence instead. |
| Thumbnail | `deliverables/buy_it_on_margin_thumbnail.jpg` (1280×720, `scripts/thumbnail.py`): the N30 freeze mid-kick (brief) with "BUY IT ON MARGIN / 1929, again". |
| Chapters | From the description (first chapter at 0:00; each over 10 s). |
| End screen | Over the last card, from 4:54 to the end (7.0 s): the credit line and repo link, centred in the 4:3 frame. Put elements in the bottom corners (a video and Subscribe); they overlap only the card's border and the black pillarbox. Starting earlier would cover "Where 1929 doesn't fit". |
| Comments | Open. |
| Visibility | Unlisted for a check pass, then public. |

---

## Vertical Shorts (9:16, 1080×1920)

Three Shorts, each built from a stretch of the main edit (`config/shorts.json`, `src/Shorts.tsx`). Upload them in song order: the forecast, the chorus, the hardware.

**What they have in common:**
- Title above the picture, captions below. The music and picture start on the first frame. The card "AI-generated satire. Not investment advice." covers the picture for the first 2.5 s (2.6 s in the chorus Short, exactly over its "Ten per cent down." card).
- Each has its own SRT, timed from its first frame, and a thumbnail (1080×1920). YouTube takes a custom thumbnail for a Short only through the mobile app's upload flow, where the account offers it.
- Settings as the main video: Music; not made for kids; altered/synthetic content: yes; English captions from the Short's SRT; Standard YouTube License. No chapters or end screen. Related video: the main video.

**Shared tags** (paste for every Short):

```
Buy It on Margin, AI music video, AI generated, AI satire, 1929, Charleston, hot jazz, newsreel, AI bubble, buying on margin, stock market crash, Suno, Claude, shorts
```

**Shared footer** (end of every description):

```
Full video, facts and sources: https://www.youtube.com/watch?v=2bp3_BMylKY
Production log, with every prompt and every human intervention: https://github.com/Derivative-Work/buy-it-on-margin
Music: Suno · Words: Claude · Video: Claude Code
Video and assets CC BY-NC-SA 4.0. Satire; not affiliated with any company named.

#AIgenerated #satire #Shorts
```

### 1. Every lab's got a forecast (verse 1)

16.45–37.60 s of the master, **21.1 s**. File `deliverables/buy_it_on_margin_short_forecast.mp4`, captions `…_short_forecast.en.srt`, thumbnail `…_short_forecast_thumbnail.jpg` (the wall of rising charts). The barber's hot tip, the shoeshine legend, the thinking machine wheeled down the street, the wall of charts on "Every lab's got a forecast", the margin slip, into the first "Buy it on margin, sugar, buy it on margin!"

**Title:**
```
"Every lab's got a forecast, and the forecasts sure are grand" #Shorts
```

**Description** (then the footer):
```
AI-generated satire. Not investment advice. OpenAI projects about $856 billion in computing and infrastructure spending from 2026 through 2030, and negative free cash flow of $278 billion over the same years (Financial Times, via Crypto Briefing, September 2026). In 1929, buyers typically put 10% down and borrowed the rest (Federal Reserve History). Verse 1 of Buy It on Margin, an AI-made newsreel music video.
```

### 2. Buy it on margin (the first chorus)

29.18–58.87 s, **29.7 s**. File `deliverables/buy_it_on_margin_short_chorus.mp4`, captions `…_short_chorus.en.srt`, thumbnail `…_short_chorus_thumbnail.jpg` (the N30 freeze mid-kick, as the main thumbnail). Verse 1's last line into the first chorus (N08–N13): "So I borrowed from my broker on the ten-percent-down plan!" through "A dime on the dollar, and the moon's your own!"

**Title:**
```
"Buy it on margin, sugar!" A 1929 Charleston about the AI boom #Shorts
```

**Description** (then the footer):
```
AI-generated satire. Not investment advice. In 1929, buyers typically put 10% down and borrowed the rest; today's US rules require 50% for most stock bought on margin (Federal Reserve History; 12 CFR 220.12). On October 30, 2026, tech stocks lost more than $1 trillion in market value (NBC News). The first chorus of Buy It on Margin, an AI-made newsreel music video.
```

### 3. With the IOUs in its hat (verse 2)

58.87–79.60 s, **20.7 s**. File `deliverables/buy_it_on_margin_short_hardware.mp4`, captions `…_short_hardware.en.srt`, thumbnail `…_short_hardware_thumbnail.jpg` (the hatbox). The data center in the cornfield, the power plant built beside it, the companies nested inside each other, then the hatbox of IOUs, RAM sticks and graphics cards on "with the IOUs in its hat", which holds through "Buy it on margin, sugar, buy it on margin!"

**Title:**
```
"A holdin' company holds 'em, with the IOUs in its hat" #Shorts
```

**Description** (then the footer):
```
AI-generated satire. Not investment advice. In the 1920s, Samuel Insull's utility empire was a pyramid of leveraged holding companies; it collapsed in 1932 (EBSCO). Today the money circles: Nvidia has invested $30 billion in OpenAI and up to $10 billion in Anthropic, which both run on its chips (The Conversation, October 2026), and about $500 billion of AI-related debt was issued in 2026 by October (Bloomberg). Verse 2 of Buy It on Margin, an AI-made newsreel music video.
```
