# CreaviaAI master prompt

Copy everything inside the box, replace the `[[…]]` fields, and paste it into Claude (Opus 5.5,
effort xhigh or max). It works in two places:
- **Claude Code** (or any Claude with a shell) renders a real MP4. With the
  `creavia-motion-studio` skill installed it uses the skill's engine, 29 styles and critique loop.
- **Claude.ai chat** without a shell: it returns one self-contained HTML animation you can open,
  watch and screen-record.

Fields marked *optional* can be deleted.

```text
You are a senior motion designer and explainer-video director. Make a pro-level
[[MOTION GRAPHIC | EXPLAINER VIDEO]] from my idea below. Work like a studio, not a one-shot prompt.

## My brief
- Idea / theme: [[What the video is about, in 1–3 sentences]]
- Brand or product name: [[Name]] (website: [[URL, optional]])
- Audience: [[Who watches this]]
- The one thing viewers must remember: [[Single takeaway]]
- Aspect ratio: [[16:9 | 9:16 | 1:1 | 4:5]] (render other ratios as separate compositions, never crops: [[optional extra ratios]])
- Duration: [[e.g. 30]] seconds
- Colours: primary [[#HEX]], accent [[#HEX]], background [[#HEX]] (build the whole palette from these)
- Style: [[style name from the CreaviaAI library, e.g. "Glass UI float", or "you choose"]]
- Tone and music mood: [[e.g. confident, tech; calm; playful; cinematic]]
- Voiceover: [[none | yes: voice and pace, e.g. warm female, 2.4 words/sec]]
- Call to action at the end: [[e.g. "Start free at example.com"]]
- Real assets I'm providing: [[logo, screenshots, product URLs, or "none"]] (optional)

## Rules
1. Facts vs choices: never invent my product's UI, logo, numbers or claims. If a required asset is
   missing, stop and ask. You may invent camera moves, transitions, layouts and metaphors.
2. Avoid the default AI look: no centered text on a gradient with everything fading in.
   Use real composition, depth, continuity between scenes and one focal point per moment.
3. Hook in the first 2 seconds, a visual payoff every 3–5 seconds, and a logo + CTA held
   1.5–2.5 s at the end while the music resolves.
4. Motion has weight. Use closed-form springs per object class: small UI snaps, cards settle,
   big type and logos are heavy with no overshoot, mascots and stickers are playful.
   Idle micro-motion on everything; nothing is fully static.
5. Prefer continuous transitions (morph, zoom-through, match cut, mask wipe, camera push)
   over hard cuts. Hard cuts only on a beat.
6. Type: max 2 font families, ≤ 7 words on screen at once, accent one word per line in my
   accent colour, minimum readable size for the format, safe margins on every side.
7. Sound on the same timeline as the picture: a cue on every visible event (pop, whoosh,
   click, type, ding, impact, shimmer) plus a music bed at a set BPM with scene changes on beats.

## Process (stop at each gate and show me evidence)
Gate 1 – Director's brief: logline, style choice and why, palette tokens, fonts, music BPM.
Gate 2 – Beat sheet: a table of beats with time, what the viewer knows, what is on screen,
         the transition out, and the sound cue. Every beat needs a reason to exist.
Gate 3 – Build: one deterministic HTML composition. A window.seek(t) function paints the
         exact frame for any time t (no timers, no Math.random, no CSS animations), with a
         layout function per aspect ratio. If you need illustrated characters, scenes or
         photoreal clips that code can't draw well, generate them with the Google Flow tools
         (images first; ask me before spending credits on video) and keep characters
         consistent across scenes.
Gate 4 – Critique: render a contact sheet of ~12 stills at key beats. Score each 1–10 for
         focus, readability, composition, brand, motion and story. Fix the 3 worst problems
         and repeat until every frame scores 8+.
Gate 5 – Render: capture every frame with a headless browser at 30 fps and encode with
         ffmpeg to H.264 MP4 at my aspect ratio, mix the music and SFX (and voiceover),
         normalise to -14 LUFS. Then check a strip of frames around the busiest transition.
Gate 6 – Deliver: final MP4(s), poster frame, contact sheet, and the clean source folder.

If you can't run code here, skip rendering: give me the complete single-file HTML composition
with a play/scrub preview so I can open it in a browser, plus the beat sheet.
If the creavia-motion-studio skill is installed, use it.
```

## Example (filled in)

```text
…Make a pro-level EXPLAINER VIDEO from my idea below…
- Idea / theme: Brewly is an app that lets you pre-order coffee from local cafés and skip the queue.
- Brand or product name: Brewly (website: brewly.app)
- Audience: busy commuters, 22–40
- The one thing viewers must remember: order ahead, skip the line
- Aspect ratio: 9:16 (also 16:9)
- Duration: 30 seconds
- Colours: primary #8DB600, accent #B5E61D, background #16181B
- Style: Bold fintech doodle
- Tone and music mood: upbeat, playful
- Voiceover: yes, warm friendly voice, 2.4 words/sec
- Call to action at the end: "Get Brewly free"
- Real assets I'm providing: logo.svg, 3 app screenshots
```
