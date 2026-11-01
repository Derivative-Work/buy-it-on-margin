# Buy It on Margin

A 1920s Charleston about buying the thinking machine on margin, as a silent-era newsreel music video. The agent does the production; the human approves at each milestone gate (M1–M6), picks takes, and supplies what the agent can't reach (Suno, the ticker recording, screen captures).

**Start here:** the brief is the Claude Doc https://claude.ai/artifact/U1ac2Uh6h1YpDqWHE5ncFF (shot list, film layer, milestones). Lyrics, concept and the fact card are in the song doc https://claude.ai/artifact/2ss6PBcptViGh1xRQGYW1F. Read both with the docs tools, not a web fetch; `docs/brief.md` is a plain-text mirror. Then read the latest entries of `log/production_log.md` and `log/human_interventions.md`.

- **Logs:** `log/production_log.md` gets one entry per generation, render or analysis step. Every human action goes in `log/human_interventions.md`. Anything the generator changed (words sung differently, structure) goes in `log/ai_changes.md`. Still/clip prompts and seeds go in `shots/prompts.md`; each shot's asset type and swaps in `shots/pipeline.md`.
- **Seeds:** every random process reads its seed from `config/`; main video seed 1929.
- **Large files** (audio, renders, takes, weights) stay out of git. Log the command that regenerates them.
- **Audio:** v1 = `audio/track/` (clip `2414ddab`, 189.2 s) + `audio/stems/`; v2 = `audio/track_v2/` (v1 + coda extend, concat clip `3cdd3864`, 199.8 s) + `audio/stems_v2/`. The master is an edit of both, built by `scripts/build_master.py` from `config/master.json` into `audio/master/`. Post-filter (music-deslop M6f) is on; the human runs it (`audio/postfilter/`). Credits music: a Suno player-piano cover (`audio/credits_cover/`, clip `7cc9fb84`), deliberately not post-filtered, laid over the crackle tail by `scripts/pad_master.py`.
- **Tools:** ComfyUI in `~/ComfyUI` (FLUX.2 [dev] stills, LTX-2.3 clips), as in `~/Projects/folks-like-us` (the last project to use video generation; reuse `scripts/comfy_client.py`, `stills.py`, `contact_sheet.py`). Python steps run on `../folks-like-us/.venv` (WhisperX, numpy, soundfile) until this repo gets its own. The film layer is Remotion (brief).
