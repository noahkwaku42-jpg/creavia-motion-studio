# Images and video clips via Google Flow

Code draws the motion graphics. **Whenever a film needs imagery that code cannot draw well**
(characters, illustrated environments, painterly plates, photoreal or 3D shots, organic motion),
generate it with the Google Flow MCP tools (`mcp__flow__*`). If they are only listed as deferred,
load them with ToolSearch first (query `flow`).

## When to use Flow
| need | Flow tool | cost |
|---|---|---|
| illustrated scene plates, backgrounds, props, flat characters | `flow_generate` with `type: "image"` (Nano Banana) or `flow_agent_images` for a batch | images: 0 credits |
| the same character across many scenes | `flow_character` once, then `reference_images: ["asset:<name>"]` | free |
| a character or camera move that must really move (S05, S13) | `flow_generate` video (Omni 1.1 Flash ~7–12, Veo 3.1 Fast ~20, Quality ~100) | **credits: ask first** |
| a continuous take across a cut | `flow_continue` | credits, no quote: **ask first** |
| narration | `flow_narrate` | free |
| word timings / captions | `flow_transcribe`, `flow_captions` | free, local |

Never use Flow for UI, charts, type, logos or anything the brand already owns. Code does those
crisply and they stay editable.

## Workflow
1. `mcp__flow__flow_status` first. It reports sign-in, the open project and credits, and returns
   the prompt playbook. If it says something must be fixed, tell the user and stop that branch.
2. Characters: `flow_character({ name, describe, personality })`. Lock the look in words and
   reuse the same description in every scene prompt.
3. Stills: one prompt per beat, in the style card's language, for example:
   *"flat vector illustration, lavender monochrome palette #D9DBFB #5B5BE6 with accent #E8336E,
   bearded professional at a desk with laptop, clean shapes, no text, no logos, soft long
   shadows, 16:9, centered subject with empty space on the right for UI overlay"*.
   Always add **"no text, no logos, no watermark"**, and leave negative space where code will
   place UI or type. Use `reference_previous: true` to keep a sequence on-model.
4. Video clips: write one continuous shot per clip (action, camera move, light, sound). Before
   queueing, tell the user the model, the number of clips and the estimated credits, and get a
   yes. Set `max_credits` per scene.
5. `flow_wait` until finished. Copy or download results into the film's `assets/` folder
   (`flow_download` for existing assets).
6. In the composition: plates as `<img>` with `object-fit: cover` inside a wrapper you animate
   (push, pan, parallax). Clips: render the code layer over them by putting the clip in a
   `<video>` element **only for preview**. For the final, render the graphics on a transparent
   or chroma background, or composite with ffmpeg (see below).

## Compositing Flow video under code graphics
The engine screenshots the DOM, and a `<video>` element does not seek frame-accurately during
capture. For clip-based films:
1. Build the overlay composition without a background layer, then render it transparent:
   `python scripts/render.py film/overlay.html --alpha --out film/overlay.mov` (ProRes 4444 with alpha).
2. Join the Flow clips with `flow_assemble` (or ffmpeg concat), then overlay:
   `ffmpeg -i base.mp4 -i overlay.mov -filter_complex "[0][1]overlay" -c:a copy out.mp4`.
3. Mix audio last (`render.py` audio options or `flow_assemble` with `music`/`voiceover`).

## Generate-then-trace (advanced)
For a fully ownable look, generate base shots in Flow for composition and physics reference,
then redraw the key shapes in code on top (silhouettes, ribbons, light trails), so the viewer
sees mostly the code-drawn layer. Use it when the Flow output's style drifts between shots.

## Rules
- Credits are the user's money: images are free, video always needs an explicit OK first.
- Never put a real person's likeness, a real brand's logo or copyrighted characters in prompts.
- If a required brand asset (logo, product screen) is missing, ask the user. Do not let Flow
  invent one.
