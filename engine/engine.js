/* CreaviaAI Motion Studio engine: deterministic seek(t) motion graphics.
 *
 * Every frame is a pure function of time. Nothing reads a clock, nothing uses
 * unseeded randomness, nothing depends on how long the page has been open.
 * render.py calls window.seek(t) for each frame and screenshots the stage.
 *
 * URL params: ?w=1920&h=1080   stage size (layout adapts per format)
 *             &render          no player UI, stage pinned at 0,0
 *             &t=3.2           open the preview paused at a moment
 */
(function () {
  const Q = new URLSearchParams(location.search);
  const S = (window.STUDIO = {});

  // ---------- stage + format ----------
  S.W = +Q.get('w') || 1920;
  S.H = +Q.get('h') || 1080;
  S.rendering = Q.has('render');
  S.fps = 30;
  S.duration = 10;
  S.aspect = S.W / S.H;
  S.format = S.aspect > 1.2 ? 'wide' : S.aspect < 0.85 ? 'tall' : 'square';
  S.u = Math.min(S.W, S.H) / 100; // 1u = 1% of the short side
  S.pick = (o) => (S.format in o ? o[S.format] : o.wide);

  // ---------- math + easing ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  S.clamp = clamp; S.lerp = lerp; S.prog = prog;
  S.ease = {
    linear: (p) => p,
    outCubic: (p) => 1 - Math.pow(1 - p, 3),
    inCubic: (p) => p * p * p,
    inOutCubic: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    outExpo: (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
    inExpo: (p) => (p <= 0 ? 0 : Math.pow(2, 10 * p - 10)),
    inOutExpo: (p) => p <= 0 ? 0 : p >= 1 ? 1 : p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2,
    outQuint: (p) => 1 - Math.pow(1 - p, 5),
    outBack: (p) => { const c = 1.70158, d = c + 1; return 1 + d * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
  };
  // tween(t, start, dur, from, to, ease)
  S.tween = (t, at, dur, a, b, ease = 'outCubic') => lerp(a, b, S.ease[ease](prog(t, at, at + dur)));

  // Closed-form springs: a pure function of time, so seek(t) stays deterministic.
  // z = damping ratio, w = natural frequency. One preset per class of object.
  S.SPRINGS = {
    snappy: { z: 0.72, w: 30 },  // buttons, toggles, cursors, small UI
    default: { z: 0.86, w: 17 }, // cards, containers, camera
    heavy: { z: 1.0, w: 11 },    // big type, 3D objects, logo lockups (no overshoot)
    playful: { z: 0.42, w: 19 }, // mascots, stickers, emoji (visible overshoot)
    type: { z: 1.0, w: 22 },     // headlines: fast in, no wobble
  };
  S.spring = (t, preset = 'default') => {
    if (t <= 0) return 0;
    const { z, w } = typeof preset === 'string' ? S.SPRINGS[preset] : preset;
    if (z < 1) {
      const wd = w * Math.sqrt(1 - z * z);
      return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
    }
    return 1 - Math.exp(-w * t) * (1 + w * t);
  };
  // A value that changes target several times. One spring per change, each
  // starting at its own time, so frame 812 renders without simulating 0..811.
  // track(t, from, [{at, to, spring?}], preset)
  S.track = (t, from, keys, preset = 'default') => {
    let v = from, prev = from;
    for (const k of keys) { v += (k.to - prev) * S.spring(t - k.at, k.spring || preset); prev = k.to; }
    return v;
  };
  // Seeded RNG (mulberry32). Never use Math.random in a composition.
  S.rng = (seed = 1) => () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  // Smooth deterministic wobble for idle float (sum of sines).
  S.wobble = (t, seed = 0, amp = 1, speed = 1) =>
    amp * (Math.sin(t * 1.3 * speed + seed * 1.7) * 0.6 + Math.sin(t * 0.7 * speed + seed * 3.1) * 0.4);

  // ---------- beat grid ----------
  S.bpm = 120;
  S.beat = (n) => (n * 60) / S.bpm;

  // ---------- sound cues (read by render.py -> synth_audio.py) ----------
  // types: whoosh, swoosh, click, pop, tick, type, riser, impact, ding, glitch, shimmer
  S.cues = [];
  S.cue = (t, type, gain = 1) => S.cues.push({ t: +t.toFixed(3), type, gain });
  S.music = { mood: 'tech', bpm: 120, gain: 0.55 }; // mood: tech | upbeat | calm | cinematic | playful | none

  // ---------- DOM helpers ----------
  S.el = (tag, opts = {}, parent) => {
    const e = document.createElement(tag);
    if (opts.cls) e.className = opts.cls;
    if (opts.html != null) e.innerHTML = opts.html;
    if (opts.text != null) e.textContent = opts.text;
    if (opts.style) Object.assign(e.style, opts.style);
    if (opts.attrs) for (const k in opts.attrs) e.setAttribute(k, opts.attrs[k]);
    (parent || S.stage).appendChild(e);
    return e;
  };
  // Anchor an element's centre at fractions of the stage (0..1).
  S.place = (e, fx = 0.5, fy = 0.5) => {
    e.style.position = 'absolute';
    e.style.left = fx * 100 + '%';
    e.style.top = fy * 100 + '%';
    if (!e.style.transform) e.style.transform = 'translate(-50%,-50%)';
    return e;
  };
  // Transform in u units (1u = 1% of the short side). Keeps the -50% centre anchor.
  S.set = (e, p = {}) => {
    const u = S.u;
    const s = p.s ?? 1;
    let tr = `translate(-50%,-50%) translate3d(${(p.x || 0) * u}px,${(p.y || 0) * u}px,${(p.z || 0) * u}px)`;
    if (p.persp) tr = `perspective(${p.persp * u}px) ` + tr;
    if (p.rx) tr += ` rotateX(${p.rx}deg)`;
    if (p.ry) tr += ` rotateY(${p.ry}deg)`;
    if (p.r) tr += ` rotate(${p.r}deg)`;
    tr += ` scale(${(p.sx ?? 1) * s},${(p.sy ?? 1) * s})`;
    e.style.transform = tr;
    if (p.o != null) e.style.opacity = clamp(p.o);
    if (p.blur != null) e.style.filter = p.blur > 0.01 ? `blur(${p.blur * u}px)` : 'none';
    if (p.clip != null) e.style.clipPath = p.clip;
    return e;
  };
  S.px = (n) => n * S.u + 'px';

  // Reveal masks, p 0..1
  S.wipe = (p, kind = 'left') => {
    const q = (1 - clamp(p)) * 100;
    switch (kind) {
      case 'left': return `inset(0 ${q}% 0 0)`;
      case 'right': return `inset(0 0 0 ${q}%)`;
      case 'up': return `inset(${q}% 0 0 0)`;
      case 'down': return `inset(0 0 ${q}% 0)`;
      case 'center': return `inset(0 ${q / 2}% 0 ${q / 2}%)`;
      case 'circle': return `circle(${clamp(p) * 75}% at 50% 50%)`;
      case 'diag': return `polygon(0 0, ${clamp(p) * 200}% 0, 0 ${clamp(p) * 200}%)`;
      default: return 'none';
    }
  };

  // ---------- scenes ----------
  // S.scene({ id, start, end, build(root, sc) -> refs, draw(t, refs, sc) })
  // t is local time. sc = { start, end, dur, root }. Overlap scenes for transitions.
  S.scenes = [];
  S.layers = [];
  S.scene = (def) => { S.scenes.push(def); return def; };
  // Persistent layers drawn with global time (backgrounds, camera, grain, captions).
  S.layer = (def) => { S.layers.push(def); return def; };
  // Fade/scale envelope for a scene: 0 -> 1 -> 0 using inDur/outDur.
  S.env = (t, dur, inDur = 0.4, outDur = 0.4) => Math.min(prog(t, 0, inDur), 1 - prog(t, dur - outDur, dur));

  // ---------- components ----------
  const ICONS = {
    check: '<path d="M5 12.5l4.2 4.2L19 7" />',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.8z" />',
    bolt: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />',
    chat: '<path d="M4 5h16v11H9l-5 4z" />',
    bell: '<path d="M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20a2 2 0 004 0" />',
    play: '<path d="M8 5l11 7-11 7z" />',
    spark: '<path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" />',
    user: '<circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" />',
    search: '<circle cx="11" cy="11" r="6.5" /><path d="M16 16l5 5" />',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" />',
    globe: '<circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6" />',
    film: '<rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18M3 15h18M8 5v4M16 5v4M8 15v4M16 15v4" />',
    ratio: '<rect x="3" y="6" width="18" height="12" rx="2" /><rect x="9" y="3" width="6" height="18" rx="1.5" />',
    palette: '<path d="M12 3a9 9 0 100 18c1.2 0 1.6-1 1-2-.7-1.2.1-2.5 1.5-2.5H17a4 4 0 004-4C21 7 17 3 12 3z" /><circle cx="7.5" cy="11" r="1.2" /><circle cx="10" cy="7" r="1.2" /><circle cx="15" cy="7.5" r="1.2" />',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />',
    x: '<path d="M6 6l12 12M18 6L6 18" />',
    alert: '<path d="M12 3l10 18H2zM12 10v5M12 18h.01" />',
    coin: '<circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5c0-1 1-1.8 2.5-1.8s2.5.8 2.5 1.8-1 1.6-2.5 1.9-2.5.9-2.5 1.9 1 1.9 2.5 1.9 2.5-.8 2.5-1.8" />',
  };
  S.icon = (name, { size = 4, color = 'currentColor', stroke = 2 } = {}) =>
    `<svg viewBox="0 0 24 24" width="${size * S.u}" height="${size * S.u}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.spark}</svg>`;

  // Kinetic text. Markup: "Make it *work*" -> *word* gets the accent colour.
  // split: 'word' | 'char' | 'line'. Each unit sits in a mask for rise reveals.
  S.text = (parent, markup, o = {}) => {
    const wrap = S.el('div', { cls: 'k-text', style: {
      fontFamily: o.font || 'var(--font-display)', fontWeight: o.weight || 700,
      fontSize: S.px(o.size || 8), lineHeight: o.lh || 1.05, letterSpacing: o.ls || '-0.02em',
      color: o.color || 'var(--ink)', textAlign: o.align || 'center',
      width: o.width ? S.px(o.width) : 'max-content', maxWidth: o.width ? 'none' : S.px(92),
      whiteSpace: o.width ? 'normal' : 'nowrap',
    } }, parent);
    const units = [];
    const lines = markup.split('\n');
    let inAccent = false; // *accent spans* may cover several words
    lines.forEach((line, li) => {
      const lineEl = S.el('div', { cls: 'k-line' }, wrap);
      const tokens = line.split(/(\s+)/).filter((x) => x.length);
      tokens.forEach((tok) => {
        if (/^\s+$/.test(tok)) { lineEl.appendChild(document.createTextNode(' ')); return; }
        if (tok.startsWith('*')) inAccent = true;
        const accent = inAccent;
        if (/\*[.,!?;:]*$/.test(tok)) inAccent = false;
        const word = tok.replace(/\*/g, '');
        const pieces = o.split === 'char' ? [...word] : [word];
        const wEl = S.el('span', { cls: 'k-word', style: { display: 'inline-block', whiteSpace: 'nowrap' } }, lineEl);
        pieces.forEach((pc) => {
          const mask = S.el('span', { cls: 'k-mask', style: { display: 'inline-block', overflow: o.mask === false ? 'visible' : 'hidden', verticalAlign: 'top', paddingBottom: '0.08em', marginBottom: '-0.08em' } }, wEl);
          const inner = S.el('span', { text: pc, style: { display: 'inline-block', color: accent ? (o.accent || 'var(--accent)') : null } }, mask);
          if (accent && o.accentStyle) Object.assign(inner.style, o.accentStyle);
          units.push({ el: inner, line: li, accent });
        });
      });
    });
    const k = { el: wrap, units };
    // in/out reveal. mode: rise | fade | blur | scale | drop | type
    k.draw = (t, { at = 0, stagger = 0.06, dur = 0.7, mode = 'rise', outAt = Infinity, outDur = 0.35, outMode = 'fade', preset = 'type' } = {}) => {
      units.forEach((un, i) => {
        const lt = t - at - i * stagger;
        const p = mode === 'type' ? (lt >= 0 ? 1 : 0) : S.spring(lt, preset);
        const fadeIn = clamp(lt / Math.min(dur, 0.35));
        const op = clamp(1 - (t - outAt - i * stagger * 0.5) / outDur);
        const q = 1 - p;
        let tr = '', o2 = fadeIn, f = 'none';
        if (mode === 'rise') tr = `translateY(${q * 110}%)`;
        else if (mode === 'drop') tr = `translateY(${-q * 110}%)`;
        else if (mode === 'scale') tr = `scale(${0.4 + 0.6 * p})`;
        else if (mode === 'blur') { tr = `translateY(${q * 30}%)`; f = q > 0.01 ? `blur(${q * 1.5 * S.u}px)` : 'none'; }
        if (t > outAt) {
          const oq = 1 - op;
          if (outMode === 'rise') tr += ` translateY(${-oq * 110}%)`;
          if (outMode === 'blur') f = `blur(${oq * 1.5 * S.u}px)`;
          o2 *= outMode === 'rise' ? 1 : op;
        }
        un.el.style.transform = tr;
        un.el.style.opacity = mode === 'type' ? (lt >= 0 ? 1 : 0) * (t > outAt ? op : 1) : o2;
        un.el.style.filter = f;
      });
    };
    return k;
  };

  // Typewriter into an element. Returns chars shown. Register 'type' cues yourself or via S.typeCues.
  S.typeOn = (e, str, t, at, cps = 24, caret = true) => {
    const n = clamp(Math.floor((t - at) * cps), 0, str.length);
    const blink = caret && (n < str.length || Math.floor(t * 2) % 2 === 0) && t >= at;
    e.innerHTML = str.slice(0, n).replace(/</g, '&lt;') + (blink ? '<span class="caret"></span>' : '');
    return n;
  };
  S.typeCues = (start, str, cps = 24, every = 3) => { for (let i = 0; i < str.length; i += every) S.cue(start + i / cps, 'type', 0.5); };

  // Number counter
  S.count = (t, at, dur, from, to, fmt = (v) => Math.round(v).toLocaleString()) =>
    fmt(lerp(from, to, S.ease.outExpo(prog(t, at, at + dur))));

  // Window/UI card with optional browser chrome.
  S.card = (parent, o = {}) => {
    const c = S.el('div', { cls: 'card' + (o.glass ? ' glass' : '') + (o.dark ? ' dark' : ''), style: {
      width: S.px(o.w || 40), height: o.h ? S.px(o.h) : 'auto', borderRadius: S.px(o.radius ?? 2.2),
      background: o.bg || null,
    } }, parent);
    if (o.chrome) S.el('div', { cls: 'chrome', html: '<i></i><i></i><i></i>' + (o.url ? `<span>${o.url}</span>` : '') }, c);
    const body = S.el('div', { cls: 'card-body', html: o.html || '' }, c);
    if (o.pad != null) body.style.padding = S.px(o.pad);
    c.body = body;
    return c;
  };
  // Skeleton lines for fake UI copy (widths in % of card).
  S.lines = (parent, widths = [80, 60, 70], o = {}) => {
    const box = S.el('div', { cls: 'sk-lines' }, parent);
    widths.forEach((w, i) => S.el('div', { cls: 'sk', style: { width: w + '%', height: S.px(o.h || 1.1), background: i === 0 && o.firstAccent ? 'var(--accent)' : null } }, box));
    return box;
  };

  // Flat illustrated avatar (seeded). Works as orbit node, profile chip, crowd.
  const SKIN = ['#F2C9A8', '#E0A983', '#C68863', '#9C6644', '#6F4A33', '#F6D5BE'];
  const HAIR = ['#1F1A17', '#3B2A20', '#6B4226', '#B5651D', '#D9A441', '#2B2D42', '#8C8C8C'];
  S.avatar = (parent, o = {}) => {
    const r = S.rng(o.seed || 7);
    const skin = SKIN[Math.floor(r() * SKIN.length)], hair = HAIR[Math.floor(r() * HAIR.length)];
    const shirt = o.shirt || ['var(--accent)', 'var(--c2)', 'var(--c3)', '#5B8DEF', '#F2A541'][Math.floor(r() * 5)];
    const style = Math.floor(r() * 4);
    const hairPath = [
      'M28 34c0-14 8-20 22-20s22 6 22 20c-4-6-12-9-22-9s-18 3-22 9z',
      'M26 40c-2-18 8-27 24-27s27 9 24 27c-3-9-8-13-24-13s-21 4-24 13z',
      'M27 36c0-15 9-22 23-22 15 0 24 8 23 24-7-3-12-9-14-14-6 7-18 11-32 12z',
      'M24 44c-4-22 8-31 26-31s30 10 26 31l-4 14c0-14-2-24-22-24S28 44 28 58z',
    ][style];
    const size = o.size || 10;
    const a = S.el('div', { cls: 'avatar', style: { width: S.px(size), height: S.px(size), background: o.bg || 'var(--surface-2)', boxShadow: o.ring ? `0 0 0 ${S.px(0.5)} ${o.ring}` : null } }, parent);
    a.innerHTML = `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M18 100c2-18 15-28 32-28s30 10 32 28z" fill="${shirt}"/>
      <rect x="43" y="56" width="14" height="16" rx="6" fill="${skin}"/>
      <ellipse cx="50" cy="42" rx="19" ry="21" fill="${skin}"/>
      <path d="${hairPath}" fill="${hair}"/>
      <circle cx="43" cy="44" r="1.8" fill="#1d1d1d"/><circle cx="57" cy="44" r="1.8" fill="#1d1d1d"/>
      <path d="M44 53q6 4 12 0" stroke="#1d1d1d" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    </svg>`;
    return a;
  };

  // Mouse cursor with planned moves + clicks. plan registers click cues.
  S.cursor = (parent, o = {}) => {
    const c = S.el('div', { cls: 'cursor', html: `<svg viewBox="0 0 24 24" width="${(o.size || 4) * S.u}" height="${(o.size || 4) * S.u}"><path d="M4 2l15 9.5-6.6 1.3L16 20.5l-3 1.4-3.6-7.6L4 19z" fill="${o.fill || '#fff'}" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>` }, parent);
    const ring = S.el('div', { cls: 'click-ring' }, parent);
    c.moves = []; c.clicks = []; c.from = { x: 0, y: 0 };
    // moves: [{at, x, y}] in u units relative to the cursor's placed anchor; clicks: [at]
    c.plan = (sceneStart, from, moves, clicks = []) => {
      c.from = from; c.moves = moves; c.clicks = clicks;
      clicks.forEach((at) => S.cue(sceneStart + at, 'click', 0.9));
    };
    c.draw = (t, o2 = {}) => {
      const x = S.track(t, c.from.x, c.moves.map((m) => ({ at: m.at, to: m.x })), 'default');
      const y = S.track(t, c.from.y, c.moves.map((m) => ({ at: m.at, to: m.y })), 'default');
      let press = 1, ringP = -1;
      for (const at of c.clicks) {
        const d = t - at;
        if (d >= 0 && d < 0.18) press = 1 - 0.18 * Math.sin((d / 0.18) * Math.PI);
        if (d >= 0 && d < 0.5) ringP = d / 0.5;
      }
      S.set(c, { x: x + 1.2, y: y + 1.6, s: press, o: o2.o ?? 1 });
      S.set(ring, { x, y, s: 0.3 + ringP * 1.6, o: ringP >= 0 ? (1 - ringP) * (o2.o ?? 1) : 0 });
      return { x, y };
    };
    return c;
  };

  // Soft gradient blob for ambient backgrounds.
  S.blob = (parent, o = {}) => S.el('div', { cls: 'blob', style: {
    width: S.px(o.size || 60), height: S.px(o.size || 60),
    background: `radial-gradient(circle at 50% 50%, ${o.color || 'var(--accent)'} 0%, transparent 68%)`,
    opacity: o.o ?? 0.5,
  } }, parent);

  S.pill = (parent, label, o = {}) => S.el('div', { cls: 'pill', html: (o.icon ? S.icon(o.icon, { size: o.iconSize || 2.6, color: o.iconColor || 'currentColor' }) : '') + `<span>${label}</span>`, style: {
    background: o.bg || 'var(--surface)', color: o.color || 'var(--ink)', fontSize: S.px(o.size || 2.4),
  } }, parent);

  S.toast = (parent, o = {}) => S.el('div', { cls: 'toast', html: `
    <div class="toast-ic" style="background:${o.icBg || 'var(--accent)'}">${S.icon(o.icon || 'bell', { size: 2.4, color: o.icColor || '#111' })}</div>
    <div><b>${o.title || 'Notification'}</b><span>${o.body || ''}</span></div>` }, parent);

  // Bar chart. draw(t, at) grows bars with stagger.
  S.bars = (parent, o = {}) => {
    const vals = o.values || [30, 55, 42, 70, 88];
    const box = S.el('div', { cls: 'bars', style: { width: S.px(o.w || 30), height: S.px(o.h || 18), gap: S.px(o.gap || 1.4) } }, parent);
    const bars = vals.map((v, i) => S.el('div', { cls: 'bar', style: { background: i === vals.length - 1 ? (o.hi || 'var(--accent)') : (o.color || 'var(--surface-3)') } }, box));
    box.draw = (t, at = 0, stagger = 0.08) => bars.forEach((b, i) => { b.style.height = vals[i] * S.spring(t - at - i * stagger, 'default') + '%'; });
    return box;
  };
  // SVG line chart drawn on with stroke-dashoffset.
  S.lineChart = (parent, o = {}) => {
    const pts = o.points || [10, 30, 22, 48, 40, 70, 64, 92];
    const w = 100, h = 50;
    const d = pts.map((v, i) => `${i ? 'L' : 'M'}${(i / (pts.length - 1)) * w},${h - (v / 100) * h}`).join(' ');
    const box = S.el('div', { cls: 'line-chart', style: { width: S.px(o.w || 34), height: S.px(o.h || 17) } }, parent);
    box.innerHTML = `<svg viewBox="-2 -4 104 58" width="100%" height="100%" preserveAspectRatio="none">
      <path d="${d} L100,50 L0,50Z" fill="${o.fill || 'var(--accent)'}" opacity=".14"/>
      <path class="ln" d="${d}" fill="none" stroke="${o.color || 'var(--accent)'}" stroke-width="2.2" stroke-linecap="round" vector-effect="non-scaling-stroke" pathLength="1" stroke-dasharray="1" /></svg>`;
    const ln = box.querySelector('.ln'), area = box.querySelector('path');
    box.draw = (t, at = 0, dur = 1.2) => { const p = S.ease.inOutCubic(prog(t, at, at + dur)); ln.style.strokeDashoffset = 1 - p; area.style.opacity = 0.14 * p; };
    return box;
  };

  // Orbit of nodes around a centre. draw(t) spins and pops nodes in.
  S.orbit = (parent, nodes, o = {}) => {
    const box = S.el('div', { cls: 'orbit', style: { width: 0, height: 0 } }, parent);
    const rings = (o.rings || [o.r || 22]).map((r) => S.el('div', { cls: 'ring', style: { width: S.px(r * 2), height: S.px(r * 2) } }, box));
    nodes.forEach((n) => { box.appendChild(n); n.style.position = 'absolute'; n.style.left = '0'; n.style.top = '0'; });
    box.draw = (t, at = 0) => {
      rings.forEach((rg, i) => S.set(rg, { s: S.spring(t - at - i * 0.1, 'heavy'), o: clamp((t - at) * 3) }));
      nodes.forEach((n, i) => {
        const r = (o.rings || [o.r || 22])[i % (o.rings || [1]).length];
        const ang = (i / nodes.length) * Math.PI * 2 + t * (o.speed ?? 0.25) + (o.phase || 0);
        S.set(n, { x: Math.cos(ang) * r, y: Math.sin(ang) * r, s: S.spring(t - at - 0.2 - i * 0.07, 'playful') });
      });
    };
    return box;
  };

  // Logo lockup: mark + wordmark. Replace mark html with a real logo <img> when the brand has one.
  S.logo = (parent, o = {}) => S.el('div', { cls: 'logo', html: `
    <div class="logo-mark">${o.markHtml || S.icon('play', { size: (o.size || 8) * 0.55, color: 'var(--on-accent)', stroke: 2.4 })}</div>
    <div class="logo-word">${o.text || 'Brand'}</div>`, style: { fontSize: S.px(o.size || 8) } }, parent);

  // ---------- persistent overlays ----------
  S.grain = (amount = 0.06) => S.layer({ id: 'grain', build(root) {
    root.classList.add('grain'); root.style.opacity = amount;
  }, draw(T, root) { const r = S.rng(Math.floor(T * S.fps) + 3); root.style.backgroundPosition = `${r() * 200}px ${r() * 200}px`; } });
  S.vignette = (amount = 0.35) => S.layer({ id: 'vignette', build(root) {
    root.style.background = `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,${amount}) 100%)`;
  } });
  S.letterbox = (frac = 0.1) => S.layer({ id: 'letterbox', build(root) {
    root.innerHTML = `<div style="position:absolute;left:0;right:0;top:0;height:${frac * 100}%;background:#000"></div><div style="position:absolute;left:0;right:0;bottom:0;height:${frac * 100}%;background:#000"></div>`;
  } });

  // ---------- boot + seek ----------
  S.stage = document.getElementById('stage');
  const built = [];
  S.start = async () => {
    S.stage.style.width = S.W + 'px';
    S.stage.style.height = S.H + 'px';
    // the wrapper must have real size or the browser clips the stage to nothing
    S.stage.parentElement.style.width = S.W + 'px';
    S.stage.parentElement.style.height = S.H + 'px';
    document.documentElement.style.setProperty('--u', S.u + 'px');
    document.body.dataset.format = S.format;
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    const mk = (def, z) => {
      const root = S.el('div', { cls: 'layer', style: { zIndex: z } }, S.stage);
      const sc = { start: def.start ?? 0, end: def.end ?? S.duration, root };
      sc.dur = sc.end - sc.start;
      const refs = def.build ? def.build(root, sc) : null;
      built.push({ def, root, sc, refs: refs ?? root, persistent: def.start == null });
    };
    // layers with top:true (and grain/vignette/letterbox) sit above every scene
    const isTop = (l) => l.top || ['grain', 'vignette', 'letterbox'].includes(l.id);
    S.layers.filter((l) => !isTop(l)).forEach((l) => mk(l, 0));
    S.scenes.forEach((s, i) => mk(s, 10 + i));
    S.layers.filter(isTop).forEach((l, i) => mk(l, 1000 + i));
    S.cues.sort((a, b) => a.t - b.t);
    window.DURATION = S.duration; window.FPS = S.fps; window.CUES = S.cues; window.MUSIC = S.music;
    window.seek(Q.has('t') ? +Q.get('t') : 0);
    window.__ready = true;
    if (!S.rendering) player();
  };
  window.seek = (T) => {
    S.time = T;
    for (const b of built) {
      if (b.persistent) { b.def.draw && b.def.draw(T, b.refs, b.sc); continue; }
      const on = T >= b.sc.start && T < b.sc.end;
      b.root.style.display = on ? '' : 'none';
      if (on && b.def.draw) b.def.draw(T - b.sc.start, b.refs, b.sc);
    }
    if (S.onSeek) S.onSeek(T);
  };

  // ---------- preview player (not used when rendering) ----------
  function player() {
    document.body.classList.add('preview');
    const bar = document.createElement('div');
    bar.className = 'player';
    bar.innerHTML = `<button id="pp">Play</button><input id="scrub" type="range" min="0" max="${S.duration}" step="0.001" value="0"><span id="tc">0.00s</span>
      <span class="fmt">${['1920x1080', '1080x1920', '1080x1080', '1080x1350'].map((s) => { const [w, h] = s.split('x'); return `<a href="?w=${w}&h=${h}">${{ '1920x1080': '16:9', '1080x1920': '9:16', '1080x1080': '1:1', '1080x1350': '4:5' }[s]}</a>`; }).join('')}</span>`;
    document.body.appendChild(bar);
    const fit = () => { const sc = Math.min((innerWidth - 40) / S.W, (innerHeight - 110) / S.H); S.stage.style.transform = `scale(${sc})`; S.stage.parentElement.style.height = S.H * sc + 'px'; S.stage.parentElement.style.width = S.W * sc + 'px'; };
    fit(); addEventListener('resize', fit);
    let playing = false, t0 = 0, base = 0;
    const scrub = bar.querySelector('#scrub'), tc = bar.querySelector('#tc'), pp = bar.querySelector('#pp');
    const show = (t) => { window.seek(t); scrub.value = t; tc.textContent = t.toFixed(2) + 's'; };
    const loop = (now) => { if (!playing) return; let t = base + (now - t0) / 1000; if (t >= S.duration) { t = 0; base = 0; t0 = now; } show(t); requestAnimationFrame(loop); };
    pp.onclick = () => { playing = !playing; pp.textContent = playing ? 'Pause' : 'Play'; if (playing) { base = +scrub.value; t0 = performance.now(); requestAnimationFrame(loop); } };
    scrub.oninput = () => { playing = false; pp.textContent = 'Play'; show(+scrub.value); };
    addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); pp.click(); } });
  }
})();
