# Engine API (`engine/engine.js`)

A composition is one HTML file. It loads `engine.css` + `engine.js`, defines layers and scenes,
then calls `S.start()`. Everything is DOM + CSS transforms driven by `window.seek(t)`.

```js
const S = STUDIO, { pick, set, place, el, spring, tween, prog, clamp, wobble } = S;
S.duration = 30; S.bpm = 120;
S.music = { mood: 'tech', bpm: 120, gain: 0.5 };   // tech|upbeat|calm|cinematic|playful|none
S.layer({ id: 'bg', build(root) {...}, draw(T, refs) {...} });           // persistent, global time
S.scene({ id: 'hook', start: 0, end: 2.7, build(root, sc) { return refs }, draw(t, refs, sc) {...} });
S.grain(.05); S.vignette(.4);
S.start();
```

## Rules of the engine
- `build` runs once: create elements, register sound cues. `draw` runs every frame and must set
  **every animated property from `t` alone**. No state carried between frames.
- Never use `Math.random`, `Date`, `setTimeout`, CSS animations or transitions. Use `S.rng(seed)`
  and `S.wobble(t, seed, amp, speed)`.
- Units: `u` = 1% of the short side. `S.px(n)` → px string. CSS can use `calc(var(--u) * n)`.
- Layout per format: `pick({ wide, tall, square })` (4:5 counts as square).
- Scenes may overlap by 0.2–0.4 s for transitions; later scenes stack above earlier ones.
- Layers with `top: true` (and grain/vignette/letterbox) sit above all scenes.

## Placement and transforms
| call | what it does |
|---|---|
| `place(e, fx, fy)` | anchor element centre at stage fractions (0..1) |
| `set(e, {x, y, z, s, sx, sy, r, rx, ry, persp, o, blur, clip})` | transform in u units, opacity, blur(u), clip-path |
| `S.wipe(p, kind)` | clip-path string: left, right, up, down, center, circle, diag |
| `el(tag, {cls, html, text, style, attrs}, parent)` | create element |

## Motion
| call | use |
|---|---|
| `spring(t, preset)` | 0→1 closed-form spring. presets: `snappy` (UI), `default` (cards, camera), `heavy` (big type, logos, no overshoot), `playful` (stickers, mascots), `type` (headlines) |
| `S.track(t, from, [{at, to, spring?}], preset)` | value with several targets, continuous (cursor paths, widths that morph) |
| `tween(t, at, dur, from, to, ease)` | eased tween. eases: linear, outCubic, inCubic, inOutCubic, outExpo, inExpo, inOutExpo, outQuint, outBack |
| `prog(t, a, b)` | 0..1 progress between a and b |
| `S.env(t, dur, in, out)` | fade-in/hold/fade-out envelope |
| `wobble(t, seed, amp, speed)` | smooth idle float |
| `S.beat(n)` | seconds of n beats at `S.bpm` |

## Components
| call | returns |
|---|---|
| `S.text(parent, 'Line one\nLine *two*', {size, weight, font, color, accent, split:'word'|'char', width, align, mask})` | `k` with `k.draw(t, {at, stagger, mode:'rise'|'drop'|'fade'|'blur'|'scale'|'type', outAt, outMode, preset})`; `*word*` = accent |
| `S.typeOn(el, str, t, at, cps)` + `S.typeCues(start, str, cps)` | typewriter with caret + key sounds |
| `S.count(t, at, dur, from, to, fmt)` | counter string |
| `S.card(parent, {w, h, radius, pad, chrome, url, glass, dark, bg, html})` | card; `card.body` for content |
| `S.lines(parent, [80,60,70], {h, firstAccent})` | skeleton text lines |
| `S.avatar(parent, {seed, size, ring, bg, shirt})` | flat illustrated bust (seeded variety) |
| `S.cursor(parent)` → `cur.plan(sceneStart, {x,y}, [{at,x,y}], [clickAt])`, `cur.draw(t, {o})` | cursor with spring path, press squash, click ring + click cue |
| `S.toast(parent, {icon, title, body, icBg, icColor})` | notification |
| `S.pill(parent, label, {icon, bg, color, size})` | pill / chip / CTA |
| `S.bars(parent, {values, w, h, color, hi})` → `bars.draw(t, at, stagger)` | bar chart |
| `S.lineChart(parent, {points, w, h, color})` → `lc.draw(t, at, dur)` | line chart drawing on |
| `S.orbit(parent, nodes, {r, rings, speed, phase})` → `o.draw(t, at)` | orbit ring(s) |
| `S.blob(parent, {size, color, o})` | soft ambient gradient blob |
| `S.logo(parent, {text, markHtml, size})` | logo lockup (swap `markHtml` for the brand's real `<img>`) |
| `S.icon(name, {size, color, stroke})` | inline SVG: check star bolt chart chat bell play spark heart user search lock globe arrow film ratio palette mail x alert coin |
| `S.grain(a)`, `S.vignette(a)`, `S.letterbox(frac)` | overlays |

## Sound cues
`S.cue(t, type, gain)` with absolute time (use `sc.start + local`). Types: whoosh, swoosh, click,
pop, tick, type, riser, impact, ding, glitch, shimmer. Cursor clicks and `typeCues` register
themselves. Place a cue on **every** visible event; the render mixes them with the music bed.

## Images and Flow assets
Put files in `assets/` and reference them relatively (`<img src="assets/hero.png">`). For
full-frame plates use `object-fit: cover` and animate the wrapper (`set` with `s` and `x` for a
camera push or pan). Split a plate into layers (bg / mid / character) for parallax when Flow can
render them separately on flat backgrounds.

## Preview
Open `composition.html` in a browser: play, scrub, space bar, and links that reload at 16:9, 9:16,
1:1 and 4:5. `?t=3.2` opens paused at a moment.
