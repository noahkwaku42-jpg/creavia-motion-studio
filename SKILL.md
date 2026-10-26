---
name: creavia-motion-studio
description: Pro-level motion design and explainer video studio. Turns an idea or theme, an aspect ratio, colours and a length into a finished code-built MP4 (kinetic typography, floating UI cards, cursor flows, morph transitions, charts, avatar networks, illustrated story scenes, logo lockups) in one of 43 agency and social styles, with synthesized music and SFX on the same timeline, a contact-sheet critique loop, and separate layouts for 16:9, 9:16, 1:1 and 4:5. Uses Google Flow (mcp__flow__* tools) for images and clips that code cannot draw well (characters, illustrated plates, 3D or photoreal shots) and for voiceover. Use this skill whenever the user asks for a motion graphic, explainer video, animated explainer, product or SaaS launch video, app promo, animated ad, logo animation, kinetic type video, or pastes the CreaviaAI master prompt, even if they never say "skill" or "code". For presenter or avatar-led talking reels built mainly from Flow footage, the flow-video-studio skill fits better.
---

# CreaviaAI Motion Studio

You are the director, motion designer and sound designer. The model writes a program; the
program draws the frames; the renderer turns frames into a film; the critique loop decides
whether anyone should see it. Never collapse those into one uninspected step.

```
intake ─► brief.md ─► style card ─► beat sheet / state list ─► assets (real brand + Flow)
  ─► composition.html (seek(t)) ─► stills + critique (repeat to 8+) ─► sound ─► MP4 per format ─► QA strip ─► deliver
```

`SKILL_DIR` is this skill's base directory (shown when the skill loads).

## Files
| path | what it is |
|---|---|
| `references/styles.md` | **43 styles** with palettes, type, motion grammar, transitions, pacing, build recipe. Read the picker, then only the chosen card(s) |
| `references/explainer-playbook.md` | film types, beat templates, state lists, script and VO budget, variants |
| `references/craft.md` | motion weight, transitions, layout per format, type, colour, pacing, sound, **critique rubric** |
| `references/engine-api.md` | every engine function (springs, track, text, cards, cursor, orbit, charts, cues) |
| `references/flow-assets.md` | when and how to use Google Flow for images, characters, clips, narration; compositing |
| `prompts/master-prompt.md` | the copy-paste prompt template users fill in |
| `engine/engine.js`, `engine/engine.css` | the deterministic seek(t) engine |
| `engine/composition.html` | working 15 s explainer (hook, problem, solution, features, logo). Best starting skeleton |
| `scripts/new_film.py DIR` | new film folder with engine, starter composition, `brief.md`, `assets/` |
| `scripts/render.py COMP --size WxH` | MP4 with music + SFX (`--voice`, `--music`, `--alpha`), or `--stills N` / `--at t,t` contact sheet |
| `scripts/synth_audio.py` | music beds (tech, upbeat, calm, cinematic, playful) + 11 SFX, used by render.py |
| `scripts/analyze_ref.py OUT VIDEO…` | frame grid + cut count + average shot length for reference videos |

Requirements: Python 3.10+, `pip install playwright numpy pillow`, Chrome or Edge installed (or
`python -m playwright install chromium`), ffmpeg on PATH. Check once with
`python -c "import playwright, numpy, PIL"` and `ffmpeg -version`.

## Workflow (gates; show evidence at each)

### 0. Intake
Collect: idea/theme, film type (motion graphic or explainer), aspect ratio(s), duration, colours
(primary, accent, background), style (or "you choose"), audience, takeaway, CTA, voiceover,
real assets. The CreaviaAI master prompt carries all of these. Ask **one** short question only for
missing essentials (idea, ratio, duration). Default: 16:9, 30 s, palette charcoal `#16181B` +
apple green `#8DB600`, music `tech`.

### 1. Brief
`python SKILL_DIR/scripts/new_film.py films/<slug>` and fill `brief.md`: logline, **facts** (real
product, assets, claims: cannot be invented) vs **choices** (camera, layout, metaphors: you may
propose), and what would be unacceptable.

### 2. Reference and style
- Pick from `references/styles.md` by film type and brand; read only that card. Name the style
  in the brief and say why. Map the user's colours onto the card's palette roles.
- If the user gives reference videos or frames: `python SKILL_DIR/scripts/analyze_ref.py
  films/<slug>/refs <videos…>`, read every sheet, then write `style_guide.md` (palette, type,
  motion grammar, transitions, pacing, what to take and what not to take). A style guide, never
  a collage of borrowed shots.

### 3. Beats and states
Write the beat sheet in `brief.md` (`references/explainer-playbook.md` has templates): time, what
the viewer knows, what is on screen, transition out, sound. For UI films write the **state list**.
If you can't say why a beat exists, cut it. Put boundaries on the beat grid.

### 4. Assets
- Real brand assets into `assets/`. If the brief says "use the real interface" and a screen is
  missing, that is a blocker: ask, don't draw a convincing fake.
- Imagery code can't draw well → **Google Flow** (`references/flow-assets.md`):
  `flow_status` first; images are free; **video costs credits, so quote and get a yes first**;
  lock characters with `flow_character`; always "no text, no logos"; leave negative space for UI.

### 5. Build
Edit `films/<slug>/composition.html` using `references/engine-api.md` and `references/craft.md`.
Start from the starter's structure. Use `pick({wide, tall, square})` for every position and size.
Register a sound cue for every visible event. Preview by opening the HTML (scrub + format links).

### 6. Critique loop (never skip)
`python SKILL_DIR/scripts/render.py films/<slug>/composition.html --size WxH --stills 12`
(plus `--at` around fast transitions). **Look at the sheet**, score every frame with the rubric in
`references/craft.md`, write the 3 worst problems, fix, re-render. Repeat until all frames score
8+. Do the same for each aspect ratio.

### 7. Sound
Set `S.music = { mood, bpm, gain }` to match the style card. Voiceover: `mcp__flow__flow_narrate`
(free), then `--voice vo.m4a --voice-at T`. A licensed track from the user: `--music track.mp3`.

### 8. Render and QA
`python SKILL_DIR/scripts/render.py films/<slug>/composition.html --size 1920x1080 --out films/<slug>/<slug>_16x9.mp4`
(4 workers in parallel by default; about 1 minute per 15 s at 1080p). Repeat per ratio:
`1080x1920`, `1080x1080`, `1080x1350`. Then extract a strip around the busiest transition with
ffmpeg and look at it. A film is done when the evidence says it works, not when the encoder exits.

### 9. Deliver
MP4 per ratio, poster frame (`--at <best moment>`), contact sheets, and the source folder.
Report the style used, the duration, ratios, and anything not verified.

## Effort
New films: xhigh or max effort. Small fixes and re-renders: medium.

## Non-negotiables
- Deterministic frames: no timers, `Math.random`, CSS animations or transitions.
- No invented product UI, logos or numbers for a real brand.
- Never crop one ratio into another; compose each.
- Never claim it's done without having looked at a contact sheet of the final composition.
