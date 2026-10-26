# Craft rules: motion, layout, sound, critique

## The default to avoid
Centered text on a gradient, everything fading in, logo at the end. That is what a model produces
when decisions are missing. Every rule below removes a missing decision.

## Motion with weight
- One motion rule per class of object, never one curve for everything:
  - small controls (buttons, toggles, cursor) **snap**: `snappy`, 0.15–0.3 s
  - cards and panels **settle**: `default`, 0.4–0.7 s
  - big type, logos, 3D objects are **heavy**: `heavy`, no overshoot
  - mascots, stickers, emoji are **playful**: visible overshoot
  - headlines arrive fast and then **hold long enough to read**: 0.3 s in, then ≥ 1 s hold for every 3 words
- If everything overshoots, nothing feels precise. Overshoot is for small or playful things only.
- Stagger groups by 0.05–0.12 s (words), 0.1–0.2 s (cards). Lead with the most important item.
- Camera moves slowly enough to keep orientation: drift ≤ 1.5% scale per second, pans ≤ 4u/s,
  except deliberate whip-pans (≤ 0.3 s, with motion blur via `blur`).
- Nothing is ever perfectly still: idle `wobble` (0.3–1u) on floating objects, slow background drift.
- After every move, the viewer must know where to look. One focal point per moment; dim or blur the rest.

## Transitions (in order of preference)
1. **Morph/continuity:** one element changes size, radius, colour, content (button → progress bar → video frame). Use `S.track` on width/height/radius.
2. **Zoom-through:** scale into an element until it fills the frame and becomes the next scene.
3. **Match cut by shape:** circle → circle, rectangle → screen (S12).
4. **Mask wipe:** shape or colour panel sweeps across (S03, S11, S24).
5. **Camera push/pull-back:** reveal the UI was inside a device (S14).
6. **Blur-through:** defocus everything, refocus on the new subject (S02, S07).
7. Hard cut **only on a beat**, and only in showreel/social styles.

## Layout per format (never crop one render into another)
- **16:9:** side-by-side compositions, rows of 3 cards, text left + visual right is allowed.
- **9:16:** stack vertically, 1 column, type 15–25% larger than in 16:9 relative to `u`, keep key
  content inside the centre 80% (UI overlays on social apps cover the top 12% and bottom 18%).
- **1:1 / 4:5:** 2-up grids, centred hero objects, fewer simultaneous elements.
- Minimum readable type: 2.2u for labels, 3u for body, 6u+ for headlines.
- Safe margins: 6u on every side.

## Typography
- Max two families (display + body). Max ~7 words on screen at once outside UI.
- Accent one word per line with the brand colour (`*word*`).
- Kinetic modes: `rise` (default, premium), `blur` (soft/editorial), `drop`/`scale` + `char` split
  (playful/bold), `type` (product/tech). Exit faster than entry.

## Colour
- Build the palette from the user's colours: `--bg`, `--surface`, `--surface-2/3`, `--ink`,
  `--ink-2`, `--accent`, `--on-accent`. Check text contrast ≥ 4.5:1 for small copy.
- 60/30/10: background family / surfaces / accent. Accent only on what matters.

## Pacing
- Hook in the first 2 s. A visual payoff every 3–5 s. Logo + CTA held 1.5–2.5 s at the end.
- Scene boundaries on the beat grid (`S.beat(n)`; at 120 BPM a beat is 0.5 s, a bar 2 s).
- Voiceover budget: 2.3–2.6 words per second; leave 0.3 s air before key reveals.
- Typical explainer split: hook 8%, problem 22%, solution 40%, proof 15%, CTA 15%.

## Sound on the same timeline
- Every visible event gets a cue: pop (things appear), whoosh/swoosh (things move fast or scenes
  change), click (cursor), type (typing), ding (success), impact (logo, big reveal), shimmer
  (sparkle, magic), riser (build into a reveal; place it 1.4 s before).
- Music mood per style: tech (SaaS, dashboards), upbeat (consumer, fintech doodle), calm
  (community, editorial), cinematic (illustrated story, title sequences), playful (cartoons).
- The final logo lands when the music resolves: put the logo `impact` on a bar line.
- Test: listen with eyes closed. If it has no shape without the picture, the sound is not done.
- A user-supplied licensed track: pass `--music`; place scene changes on its beats.

## Critique loop (run on every contact sheet)
Render `--stills 12` (and `--at` around the fastest transitions). Score each frame 1–10 on:
1. **Focus:** one clear place to look
2. **Readability:** type size, contrast, nothing clipped or overlapping
3. **Composition:** balance, margins, safe areas for the format
4. **Brand:** palette, fonts, real assets, nothing invented for a real product
5. **Motion promise:** the still implies motion (depth, stagger, direction), not a static slide
6. **Story:** the frame says what this beat is for

Write the **3 worst problems**, fix them, re-render the stills, repeat until every frame scores
8+. Then render the MP4 and check one more strip around the busiest transition
(`ffmpeg -ss T -t 0.8 -i film.mp4 -vf fps=10,scale=480:-2,tile=4x2 strip.jpg`).

Common defects: text centred off-axis (missing `set`/`place`), clipped copy in cards, empty frame
during a transition overlap, cursor resting off its target, overlapping toasts, counter not
finished before the scene exits, logo arriving before the music resolves.
