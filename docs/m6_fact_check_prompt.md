# M6 fact check: every on-screen word in *Buy It on Margin*

Paste everything below the line into another lab's model (the brief: "Fact check of every card against the song doc's fact card, by another lab's model"). Log the model, version and full response in `log/audits/` and resolve every flag before release.

---

You are fact-checking a satirical music video before release. Below are (A) every piece of text that appears on screen, with when it appears and what the song is saying at that moment, and (B) the production's fact card with its sources.

For each on-screen item, answer: ACCURATE / MISLEADING / WRONG / UNVERIFIABLE, one line of reasoning, and a corrected wording if it isn't ACCURATE. Check the numbers against the sources and against your own knowledge; say where you could not verify. Flag anything that could be read as investment advice, anything that misstates what a company said, and any date or figure that may have changed (for example Anthropic's IPO status, which must be current as of release). Then list any claim in (B) that the video depends on but you think is wrong.

Today's date is 2026-10-31. The video is satire in the style of a 1929 newsreel, comparing this week's AI-stock selloff with the 1929 crash; the lyrics were drafted by Claude (Anthropic's model), which is disclosed on screen.

## A. On-screen text

| When | Shot | Text |
| --- | --- | --- |
| 7.6 s | N03 | THE MUSIC OF TOMORROW |
| 18.6 s | N05 | according to legend |
| 29.2 s | N08 | Ten per cent down. |
| 67.4 s | N16 | COMPANY A owns COMPANY B owns COMPANY C |
| 99.9 s | N19 | WHAT'S IT MAKE? |
| 101.6 s | N20 | WHAT'S IT COST? |
| 102.6 s | N21 | WHEN'S IT PAY? |
| 130.7 s | N25 | TECH STOCKS: $1,000,000,000,000 GONE IN A DAY |
| 151.9 s | N31a | TUESDAY, OCTOBER 29, 1929 |
| 153.9 s | N31b | THURSDAY, OCTOBER 29, 2026 |
| 155.9 s | N31c | One of these began the Great Depression. The other was two bad days, so far. |
| 177.5 s | N33 | The End? |
| 181.0 s | N34a | Lyrics drafted by Claude, an AI model made by Anthropic, PBC. Anthropic filed to go public on October 26, 2026. Its filing reports a first-half 2026 net loss of $80.7 billion, of which $72.4 billion is a non-cash accounting charge that grew with its valuation, and $518 billion in committed future infrastructure spending. This is satire, not investment advice. |
| 202.2 s | N34b | Where 1929 doesn't fit: by 1932 the Dow was down about 89% from its peak, and it took until 1954 to recover. This week was two bad days, so far. |
| 213.7 s | N34c | In 1929, buyers put about 10% down; today's US rules require 50% for most margin purchases. And much of today's AI spending comes from very profitable companies, not small investors on credit. |
| 225.8 s | N34d | Lyrics by Claude. Music by Suno. Video by Claude Code. Sources and production log: github.com/Derivative-Work/buy-it-on-margin |
| Shorts cut, first card | SH00 | A cautionary tale of borrowed money. Not investment advice. |

Also on screen: the corner caption is attached to the lyric "the shoeshine's got two" (a legend). The burned-in captions are the lyrics as sung (below). The two date cards play in four seconds of silence right after the band stops on "Buy it on mar—".

## B. Fact card (song doc, audited by Gemini and ChatGPT on 2026-10-31)

| Lyric or card | Fact | Source |
| --- | --- | --- |
| "His sales came in a-doublin', but his cash went out the door" | Alphabet Q3: Google Cloud revenue up 103% to $30.7B, but EPS of $2.12 missed about $3.00 (an $8.7B equity-securities loss cut it), revenue and ads slightly missed, and free cash flow was −$9.1B on $51.4B of capex | https://247wallst.com/cards/google-q3-2026-earnings-goog-01m621vznfkjc3wnswzh48s3h8 ; https://www.xtb.com/en/market-analysis/alphabet-disappoints-wall-street-despite-record-results-shares-plunge-over-8-and-test-300 |
| Verse 3 card | Alphabet fell almost 13% on Thursday, October 29, erasing about $500B in market value | https://fortune.com/2026/10/30/why-big-tech-earnings-are-a-crucial-report-card-for-the-ai-boom-and-its-future/ |
| Verse 3 card | Tech stocks lost more than $1T on Friday, October 30; the S&P tech sector fell more than 4.2% | https://www.nbcnews.com/business/markets/tech-stocks-nasdaq-ai-boom-fears-deepen-rcna606512 |
| "The banker's raisin' interest" | 10-year Treasury yields above 5% in October; the mid-October chip selloff was tied partly to AI financing costs | https://www.cnbc.com/2026/10/15/sk-hynix-samsung-softbank-stocks-asia-tech-rout-ai-funding-worries.html |
| "Who needs a dollar when the bank'll float a loan?" | Nearly $500B of AI-related debt issued in 2026 (Goldman Sachs estimate, published early August) | https://cryptobriefing.com/tech-companies-bond-sales-ai-debt/ |
| "IOUs in its hat" | At least 18 data center financings priced at double-digit yields (Bloomberg, October 28) | https://www.credaily.com/?p=224674 |
| "Every lab's got a forecast" | OpenAI projects about $856B in compute spending through 2030; Anthropic's S-1 lists $518B in committed future infrastructure spending | https://www.newsbytesapp.com/news/business/openai-s-projected-cash-expenditure-by-2030/story ; https://bernama.com/en/world/news.php?id=2626193 |
| "(…Sometime after twenty-thirty.)" | OpenAI projects $278B of negative free cash flow from 2026 through 2030, on revenue rising to $350B in 2030 (FT, via Reuters, September 18) | https://cryptobriefing.com/openai-projects-278b-cash-burn-through-2030/ |
| "Ten-percent-down plan" | 1920s buyers typically put down about 10% and borrowed the rest | Federal Reserve History |
| "A holdin' company holds 'em" | 1920s utility empires such as Insull's were stacked holding companies; several collapsed after 1929, though not all | (per both lyric audits) |
| "The shoeshine's got two" | A famous Wall Street legend; earliest known telling is from 1959 | Quote Investigator |
| The cut | Black Monday was October 28 and Black Tuesday October 29, 1929. The Dow had already peaked on September 3, 1929 | Federal Reserve History |
| Coda | Anthropic filed its S-1 on October 26, 2026 to list on Nasdaq as ANT; the filing is not yet effective and has no price range | https://www.vktr.com/ai-market/anthropic-files-public-s1-with-900-net-revenue-retention/ ; https://aiweekly.co/alerts/anthropic-files-for-nasdaq-ipo-under-ant-h1-rev-163b |
| Where 1929 doesn't fit | Scale: by 1932 the Dow had fallen about 89% from its peak, and it didn't recover until 1954. Leverage: buyers in 1929 put about 10% down; US rules today require 50% for most margin purchases. Who's spending: much of today's AI spending comes from very profitable companies with real backlogs, not small investors on credit. | song doc |
| Disclosure end card | Anthropic's filing reports a first-half 2026 net loss of $80.7 billion, of which $72.4 billion is a non-cash accounting charge that grew with its valuation, and $518 billion in committed future infrastructure spending | S-1 coverage above |

## C. Lyrics as sung

```
[Intro] (spoken, radio announcer)
Ladies and gentlemen, from the trading floor to your front parlor:
the music of tomorrow, on the installment plan!

[Verse 1]
Well, my barber's got a hot tip, and the shoeshine's got two:
There's a thinkin' machine a-comin', and it's gonna think for you!
Every lab's got a forecast, and the forecasts sure are grand,
So I borrowed from my broker on the ten-percent-down plan!

[Chorus 1]
Buy it on margin, sugar, buy it on margin!
Ten cents down and a promise for the rest!
Up goes the ticker, up goes the building,
Profit comes later, and later is the best!
Everybody's in it, nobody's out of it,
Who needs a dollar when the bank'll float a loan?
Buy it on margin, sugar, buy it on margin:
A dime on the dollar, and the moon's your own!

[Verse 2]
They're buildin' in the cornfield, and it's hummin' day and night,
Takes a power plant to feed it, so they're buildin' one outright.
There's a company that owns it, and a company owns that,
And a holdin' company holds 'em, with the IOUs in its hat!

[Chorus 2]
Buy it on margin, sugar, buy it on margin!
Ten cents down and a promise for the rest!
Up goes the ticker, up goes the building,
Profit comes later, and later is the best!
Everybody's in it, nobody's out of it,
Who needs a dollar when the bank'll float a loan?
Buy it on margin, sugar, buy it on margin:
A dime on the dollar, and the moon's your own!

[Break] (spoken call and response)
What's it make? (Tomorrow!)
What's it cost? (Today!)
When's it pay? (Why, nineteen-thirty!)
(…Sometime after twenty-thirty.)
(Same difference!)

[Instrumental]

[Verse 3]
Now the banker's raisin' interest, says the money's gettin' dear,
And the fella with the cloud boom got a sock right in the ear:
His sales came in a-doublin', but his cash went out the door!
Hey, what's everybody runnin' for?

[Final chorus] (group; "mar—" is quiet under the band, which rings out to the cut)
Buy it on margin, sugar, buy it on margin!
Ten cents down and a promise for the—
Buy it on mar—

[Silence] (4 s, ticker)

[Coda] (megaphone crooner, from the Suno extend)
I bought it on margin, darling,
Ten cents down, and I'm still in hock.
And the machine that wrote you this ditty?
Why, its maker just filed to sell stock.
```
