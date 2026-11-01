# Licence for the video and its assets

Copyright 2026 Albert Armea.

"Buy It on Margin" (the video) and its assets are licensed under the
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International licence](https://creativecommons.org/licenses/by-nc-sa/4.0/)
(CC BY-NC-SA 4.0). The full legal code is in [LICENSES/CC-BY-NC-SA-4.0.txt](LICENSES/CC-BY-NC-SA-4.0.txt).

The code is under the MIT licence instead: see [LICENSE](LICENSE).

## What this covers

- The video in both cuts: the main video and the vertical Short, with their captions and thumbnails.
- The music: the Suno v6 takes (the song, the coda extend and the player-piano cover), their stems, the
  post-filtered takes and the master.
- The stills, clips, mattes and grain plates, in the repository and in the production archive (the
  `archive-2026-11-01` release).
- The on-screen text: every card in `config/cards.json` and the frames the code renders from it.
- The production record, written by the agent: the logs, audits and prompts under `log/` and `shots/`, the timing
  maps, the lyrics files and the documents under `docs/`.
- The planning chat in `docs/planning_chat/`.

## What this doesn't cover

- **Code** (`scripts/`, `src/`, `config/`, `comfy/api/` and the build files): MIT, see [LICENSE](LICENSE). Where a
  source file holds both code and on-screen text or design, the code is MIT, and the frames it renders are
  CC BY-NC-SA.
- **Remotion**, which renders the video from `src/`, is not part of this repository. It is used under its own
  [Remotion License](https://www.remotion.dev/license): free for individuals, small companies and non-profits; larger
  companies need a company licence to render this project.
- **The ComfyUI workflow template** (`comfy/templates/`, and its API conversion in `comfy/api/`): from Comfy Org's
  `comfyui-workflow-templates` package, MIT, copyright 2023-present Comfy Org.
- **Fonts** (`public/fonts/`): Limelight and Old Standard TT, each under the SIL Open Font License 1.1 by its authors
  (the `OFL-*.txt` file beside each font).
- **The ticker sound** mixed into the four seconds of silence: "Daisy Wheel Word Processor" by freesound_community, from
  [Pixabay](https://pixabay.com/sound-effects/technology-daisy-wheel-word-processor-29353/), under the Pixabay Content
  License. It is in the master and the video, but not in this repository or the archive.
- **The claude.ai interface** in the planning-chat capture (`public/media/chat/`, the B01 zoom-out) belongs to
  Anthropic; the chat's text is covered as above.
- **The Suno page records** in `docs/suno*/` are Suno's metadata for the takes, kept as a record.
- **The S-1 and the news reports** behind the cards: the cards state facts from them, with links under
  [Sources](README.md#sources). They aren't reproduced here.

## Attribution

Credit "Buy It on Margin" by Albert Armea, made with Claude Code (Opus 5.5) and Suno v6, licensed CC BY-NC-SA 4.0,
with a link to https://github.com/Derivative-Work/buy-it-on-margin.
