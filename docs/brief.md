<!-- Mirror of the Claude Doc https://claude.ai/artifact/U1ac2Uh6h1YpDqWHE5ncFF (rev 10, read 2026-10-31). The doc is the source of truth. Stripped of formatting; tables flattened to "|" rows. -->
# Buy It on Margin: Shot List and Production Brief
2026-10-31 · 
## Approach
The video is a silent-era newsreel built from three kinds of asset, with code doing all of the period look. The goal is a finished video in about a day of wall time, with renders measured in minutes. Lyrics, concept and facts live in the song doc, Buy It on Margin; this brief is the build plan.
Type
 | What it is
 | Tool
 | Share of shots
 | 
K (code)
 | Intertitles, film leader, silhouettes, dials, burns, every film effect
 | Remotion
 | About a third
 | 
S (still)
 | A black-and-white image animated with a slow push or pan
 | Local image model on the 5090, then Remotion
 | About half
 | 
C (clip)
 | A 2–4 s generated video clip, 480p, only where motion is the joke
 | LTX-2.3 on the 5090
 | 4 clips, reused
 | 
Why it's fast
No lip sync. Silent newsreels had no synced sound, so no singer ever has to mouth the words.

Softness is correct. Grain, flicker and low resolution are the look, so generation artifacts and small inconsistencies disappear.

No generated text. Every word on screen is an intertitle or overlay made in code.

One film layer for everything. Stills, clips and code shots all pass through the same Remotion effects, so they match without per-shot grading.

Fallback: if the dance clips come out mushy, switch the dance shots to jointed paper-cutout silhouettes (type K). The shot list marks each shot where this swap is possible.
## Inputs, reproducibility and logging
The agent starts only once the audio master is locked; everything else is timed to it.
From the human
The locked master: main song and coda, already joined, with the cut and the four-second silence edited in.

The generator, take IDs, style prompts and settings for both parts, plus the lyrics exactly as pasted.

The ticker sound for the silence: a CC0 recording, or one you record. Note its source.

Optional: a screen capture of the real generation, for the opening bookend.

Reproducibility
Every random process (weave, flicker, grain, dust, scratches, burn) reads its seed from one config file. Main video seed 1929.

Every still and clip records its model, prompt, seed and settings in shots/prompts.md, including rejected takes.

Record each shot's asset type and any swap (for example, a dance clip replaced by silhouettes) in shots/pipeline.md.

Logging
log/human_interventions.md: every human action, including picking takes, recording the spoken intro or break, and editing the cut.

log/ai_changes.md: anything the generator changed, such as words sung differently from the lyrics as pasted.

Captions follow the lyrics as sung, not as written. Transcribe the master in M1 and diff it against the song doc.

## The film layer
One Remotion wrapper applies every period effect to every shot, so the look is consistent and tunable in one place. Build and approve it before any generation.
Frame and cadence
Composition 1920×1080 at 24 fps. The picture sits in a 4:3 frame, pillarboxed in black.

Picture content advances at 18 fps by holding frames on a fixed pattern, which gives the hand-cranked judder. Audio stays at normal speed.

Stills move with slow eased pushes and pans, never faster than about 5% of frame width per second, except in the final chorus.

Effects, in stacking order
Effect
 | Spec
 | Notes
 | 
Tone
 | Desaturate fully; contrast curve with crushed blacks and soft highlights; optional faint warm tint
 | Applied to every source, so stills and clips match
 | 
Softness
 | Gaussian blur, about 0.6 px
 | Hides generation detail
 | 
Gate weave
 | Smoothed per-frame translate, about ±1.5 px horizontal and ±2 px vertical
 | Seeded
 | 
Flicker
 | Per-frame brightness multiplier between 0.92 and 1.05
 | Seeded
 | 
Grain
 | A loop of pre-rendered grain frames, overlay blend
 | Render once, reuse
 | 
Dust and scratches
 | Sprite set; dust specks most seconds, a vertical scratch that persists a few frames now and then
 | Seeded; never on a key word
 | 
Vignette
 | Soft oval darkening at the edges
 |  | 
Transitions and devices
Film leader: a 5-4-3-2 countdown with a sweeping hand, for the opening.

Iris: a circular open and close, as in the intro and the coda.

Film burn: white holes bloom out of the frame and spread until the picture is gone, then black. Monochrome, procedural, seeded.

Over-crank: a speed multiplier on clips and camera moves, ramping up through the final chorus.

Freeze: hold any frame for a set number of beats.

One-frame insert: show an image for exactly one picture frame (1/18 s).

Intertitle cards
White text on black with a thin Art Deco border, set in a Deco display face from Google Fonts (Limelight or Poiret One), with a plain serif for longer fact cards.

Hold each card for at least 1.5 seconds, plus about a second per three words, and cut it on a beat.

Cards pass through the same film layer, so they weave and flicker too.

Card text comes from one file, cards.json, so a fact fix is a one-line change.

## Shot list
34 shots plus an optional bookend, built from about 20 stills, 4 clips (reused across several shots) and code for the rest. Shots are anchored to lyric lines; M1 turns them into frame ranges. Type: K code, S still, C clip; →K marks a clip that can swap to silhouettes.
ID
 | Section and cue
 | Type
 | Picture
 | Card or overlay
 | 
B01
 | Before the leader (optional)
 | Real
 | Screen capture of the real generation
 | none
 | 
N01
 | Intro, first beat
 | K
 | Film leader countdown
 | none
 | 
N02
 | "Ladies and gentlemen"
 | S
 | Iris opens on a cathedral radio in a parlor; a family leans in. Slow push to the radio
 | none
 | 
N03
 | "the music of tomorrow"
 | K
 | Card
 | "THE MUSIC OF TOMORROW"
 | 
N04
 | V1 "my barber's got a hot tip"
 | S
 | Barbershop: the barber, razor raised, leans to whisper. Push in
 | none
 | 
N05
 | "the shoeshine's got two"
 | S
 | Shoeshine stand, two fingers raised
 | Small corner caption: "according to legend"
 | 
N06
 | "thinkin' machine a-comin'"
 | S
 | The thinking machine (brass cabinet, one bulb) wheeled past the window on a hand truck. Pan
 | Bulb blinks (K overlay)
 | 
N07
 | "Every lab's got a forecast"
 | S
 | A wall of hand-drawn charts, every line pointing up off the paper. Pan up
 | none
 | 
N08
 | "ten-percent-down plan"
 | K + S
 | Card, then the man in the chair signing a margin slip, lather on his face
 | "Ten per cent down."
 | 
N09
 | Chorus 1, line 1
 | C1 →K
 | Dance hall: couples doing the Charleston
 | none
 | 
N10
 | "Up goes the ticker"
 | C2
 | Ticker tape streaming down from above
 | none
 | 
N11
 | "up goes the building"
 | S
 | Skyline with one building far taller than the rest. Tilt up
 | none
 | 
N12
 | "Everybody's in it"
 | C1 →K
 | Dance hall, re-cut
 | Tape at ankle height (S overlay)
 | 
N13
 | "A dime on the dollar"
 | C3
 | The crumpled dollar passed hand to hand
 | none
 | 
N14
 | V2 "buildin' in the cornfield"
 | S
 | Night cornfield; a windowless building glows. Slow pan
 | none
 | 
N15
 | "Takes a power plant"
 | S + S
 | Same frame; a dissolve adds a power plant with smokestacks beside it
 | none
 | 
N16
 | "company that owns it"
 | K + S
 | Push through three nested office doors, each smaller (zoom between three stills)
 | "COMPANY A owns COMPANY B owns COMPANY C"
 | 
N17
 | "IOUs in its hat"
 | S
 | Hatbox on a desk, overflowing with IOU slips
 | none
 | 
N18
 | Chorus 2
 | C1, C2 →K
 | Dance hall faster, cut on every bar; tape
 | Tape knee-deep (S overlay)
 | 
N19
 | Break "What's it make?"
 | K
 | Freeze frame of a C1 dancer
 | "WHAT'S IT MAKE?"
 | 
N20
 | "What's it cost?"
 | K
 | Freeze, different dancer
 | "WHAT'S IT COST?"
 | 
N21
 | "When's it pay?"
 | K
 | Freeze
 | "WHEN'S IT PAY?"
 | 
N22
 | "Sometime after twenty-thirty"
 | S
 | One-frame insert: a dancer in modern clothes
 | none
 | 
N23
 | Instrumental
 | K
 | Silhouette band: clarinet and trumpet trading, a kick line below
 | none
 | 
N24
 | V3 "banker's raisin' interest"
 | S + K
 | Banker at a big rate dial; the needle climbs (K overlay)
 | none
 | 
N25
 | "a sock right in the ear"
 | K
 | Card
 | "TECH STOCKS: $1,000,000,000,000 GONE IN A DAY"
 | 
N26
 | "His sales came in a-doublin'"
 | S
 | Man proudly holding a rising sales chart; banknotes stream from his back pocket
 | none
 | 
N27
 | "cash went out the door"
 | S
 | Same man, pie in the face. Hard cut on the beat
 | none
 | 
N28
 | "what's everybody runnin' for?"
 | K
 | Silhouette crowd running across frame
 | none
 | 
N29
 | Final chorus
 | C1, C2 + K
 | Over-cranked dance montage, speeding up
 | none
 | 
N30
 | The cut ("mar—")
 | K
 | Freeze mid-kick, then film burn to black
 | none
 | 
N31
 | Silence, ticker sound
 | K
 | Three cards in turn
 | "TUESDAY, OCTOBER 29, 1929" · "THURSDAY, OCTOBER 29, 2026" · "One of these began the Great Depression. The other was two bad days, so far."
 | 
N32
 | Coda
 | S
 | Iris opens on a crooner with a megaphone at a piano, one spotlight, empty hall knee-deep in tape. Slow pull back
 | none
 | 
N33
 | Coda end
 | K
 | Iris closes; card
 | "The End?"
 | 
N34
 | Credits
 | K
 | Disclosure card, fact cards, "Derived from" credits
 | From the song doc's fact card
 | 
C-clip budget: C1 dance hall (two takes for variety), C2 ticker tape and C3 dollar hand-off: four clips in all. Generate each at 480p, 3–4 seconds, and loop or re-cut rather than generating more.
Pull-backs (N32) need a wide still. Generate at twice the target width and animate by cropping out from the center, so the move never runs out of image.
Vertical cut for Shorts: N08 through N13 (verse 1 into the first chorus), with the intertitle stacked above the 4:3 picture and a "Not investment advice" card first.
## Generation prompts
Every prompt is the shot's subject plus one shared style phrase, unchanged across the video. Generate clean images: the film layer adds grain, scratches and flicker, so generated damage would double up and differ from shot to shot.
Stills (append to every still prompt)
Clips (append to every LTX prompt)
Example subjects
N04: a 1920s barbershop, a barber with a straight razor leaning down to whisper to a man in the chair, mirrors and bottles behind

N06: a tall brass cabinet with dials and one round bulb on top, strapped to a hand truck, wheeled along a city sidewalk past a shop window

N14: a windowless modern building glowing at night in the middle of a cornfield, viewed from a dirt road

N32: an empty 1920s dance hall, floor buried knee-deep in paper ticker tape, one spotlight on a man in a tuxedo at an upright piano holding a megaphone, wide shot

C1: couples dancing the Charleston in a crowded 1920s dance hall, flappers and men in suits, full-body wide shot

Consistency
Generate one reference image each for the barber's customer (N08, N26, N27) and the thinking machine, and condition later shots on them.

The same man appears in N26 and N27: generate N26 first, then N27 from it with only the pie added.

Keep faces small or turned away where possible; the grain does the rest.

Batch every still in one run, four takes each, and pick from a contact sheet.

## Milestones and review gates
Claude Code stops at each gate until the human approves. M2 and M3 can run in parallel once M1 is done.
#
 | Milestone
 | Gate (human)
 | 
M1
 | Transcribe the master and diff against the song doc; build the timing map (beats, sections, lyric lines) and attach frame ranges to every shot ID
 | Check the map by ear; confirm lyrics as sung
 | 
M2
 | Film layer and intertitle cards in Remotion, tested on three placeholder stills and one placeholder clip
 | Approve the look: weave, flicker, grain, burn, card design
 | 
M3
 | Generate all stills and the four clips, with every prompt and seed logged; contact sheets of every take
 | Pick takes; flag any clip to swap to silhouettes
 | 
M4
 | Animatic of every shot at 540p with the film layer, cut to the track
 | Approve timing, especially the break freezes, the one-frame insert and the cut
 | 
M5
 | Final render at 1080p, burned-in captions plus an SRT, the vertical Shorts cut and a thumbnail
 | Approve the finals
 | 
M6
 | Fact check of every card against the song doc's fact card, by another lab's model
 | Resolve every flag before release
 | 
Done when
Every shot ID from N01 to N34 is in the edit in order, or its omission is logged and approved.

Captions sit within two frames of the timing map.

The cut lands on the first syllable of "mar—", and the silence runs four seconds.

Every card matches the fact card, including the disclosure end card.

Every human action is in log/human_interventions.md.

Deliverables: main video (16:9, 1080p, 24 fps), vertical cut, captions, thumbnail (the N30 freeze mid-kick, or the N31 date cards), and the Remotion project with all logs.
## Guardrails and open items
Never on screen
Real people, including lookalikes of 1929 financiers or 2026 executives.

Real company names or logos anywhere except the credits' fact cards.

Breadlines, ruined families or other real Depression suffering.

A robot resembling any famous film's design; the thinking machine stays a plain cabinet.

Archival footage, unless the human approves a specific clip, checks its rights and logs it.

Open items
Is the audio generated yet, and on which generator? This decides when M1 can start.

Is the post-filter off for this video, as the song doc suggests? Record the choice either way.

Is the opening bookend (B01) wanted, as in the other videos?

Source of the ticker sound.

Target release date. The news peg fades within about two weeks, and Anthropic's IPO status on the end card must be re-checked the day before.


