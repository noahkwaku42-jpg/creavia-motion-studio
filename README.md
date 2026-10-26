# CreaviaAI Motion Studio

A Claude skill that turns an idea, an aspect ratio and your colours into a pro-level motion graphic or
explainer video, rendered to MP4 with code. Claude works like a studio: brief, style card, beat sheet,
deterministic animation, a contact-sheet critique loop, synthesized music and sound effects, and a
separate layout for every format.

- **43 styles**: 29 distilled frame by frame from agency explainers, 14 vertical social and ad styles
- **4 formats**: 16:9, 9:16, 1:1 and 4:5, each composed separately (never cropped)
- **Real MP4 output**: a `seek(t)` HTML engine captured frame by frame with Playwright and encoded with ffmpeg
- **Sound on the same timeline**: 5 music moods and 11 sound effects synthesized to match the picture
- **Google Flow support**: illustrated characters, painted plates, 3D shots and narration when the Flow tools are connected

## Install

### Claude Code

```bash
git clone https://github.com/noahkwaku42-jpg/creavia-motion-studio.git ~/.claude/skills/creavia-motion-studio
```

Or download `creavia-motion-studio.zip` from the [latest release](https://github.com/noahkwaku42-jpg/creavia-motion-studio/releases/latest)
and unzip it into `~/.claude/skills/`.

### claude.ai

Download `creavia-motion-studio.zip` from the [latest release](https://github.com/noahkwaku42-jpg/creavia-motion-studio/releases/latest),
then upload it under **Settings → Capabilities → Skills**. Use it in a chat with code execution turned on.

### Renderer requirements (once)

```bash
pip install playwright numpy pillow
```

You also need ffmpeg on your PATH and Chrome or Edge installed (or run `python -m playwright install chromium`).

## Use

Ask Claude for a motion graphic or explainer and the skill loads on its own, for example:

> Make a 30-second 9:16 explainer for my coffee pre-order app Brewly. Colours: #8DB600, #B5E61D on #16181B. Style: Bold fintech doodle.

For the best results paste the full brief template from [`prompts/master-prompt.md`](prompts/master-prompt.md)
and fill in the `[[ … ]]` fields. Use Claude Opus 5.5 on xhigh or max effort for new films.

## What's inside

| Path | What it is |
|---|---|
| `SKILL.md` | The workflow and review gates Claude follows |
| `references/styles.md` | 43 style cards: palette, type, motion, transitions, pacing, build recipe |
| `references/explainer-playbook.md` | Film types, beat templates, scripts and voiceover |
| `references/craft.md` | Motion, layout, sound and the critique rubric |
| `references/engine-api.md` | Every engine function |
| `references/flow-assets.md` | Images, characters, clips and narration via Google Flow |
| `engine/` | The deterministic `seek(t)` engine and a 15-second starter film |
| `scripts/render.py` | MP4 per format, contact sheets, transparent overlays, voiceover mixing |
| `scripts/synth_audio.py` | Music beds and sound effects |
| `scripts/analyze_ref.py` | Frame grids and shot lengths for reference videos |
| `scripts/new_film.py` | Starts a new film folder |
| `prompts/master-prompt.md` | The copy-paste prompt template |

## Style sources

The style cards describe visual grammar (palettes, type, motion, transitions, pacing) learned from studying
published motion work. They never reuse another studio's characters, logos, copy or layouts, and the skill
tells Claude not to either.

## Licence

[MIT](LICENSE) © 2026 Noah N. Demuyakor
