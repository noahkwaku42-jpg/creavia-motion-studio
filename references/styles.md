# Style library: 43 pro motion styles

S01–S29 are distilled frame by frame from 30 agency reference films (SaaS launches, fintech, insurance,
media analytics, construction tech, lifestyle and brand spots). S30–S43 come from 25 vertical social
motion pieces found on Pinterest (product ads, event promos, kinetic type, creator reels), studied from 8
sampled frames each, so their pacing figures are estimates. Each card is a visual grammar to
**learn from, not copy**: never reuse a reference's characters, logos, copy or exact layouts.

**Measured pacing across the set:** hard cuts are rare. 16 of the 30 films average more than 7 s
per shot; the median film has 2 to 5 cuts in 30 to 60 s. Pros move by **continuous transitions**:
morphs, zoom-throughs, match cuts, camera pushes, mask wipes. Only showreels (2.3 s shots),
talking-head social cuts (1.35 s) and 3D character shorts (1.9 s) cut fast.

## Picker

| id | style | family | best for | Flow? |
|----|-------|--------|----------|-------|
| S01 | Glass icon reveal | Kinetic & social | app launch teaser, 6–15 s | no |
| S02 | Soft-blur workspace | SaaS UI | collaboration tools, chaos→calm | no |
| S03 | Lavender flat corporate | Flat explainer | agency/service explainers | optional stills |
| S04 | Night cartoon narrative | Illustrated story | gaming, consumer apps, rewards | yes, stills |
| S05 | Luxe editorial illustration | Illustrated story | beauty, fashion, premium brands | yes, stills/clips |
| S06 | Bubble network SaaS | SaaS UI | sales/CRM/AI assistant products | no |
| S07 | Glass UI float | SaaS UI | B2B platforms, feature tours, pricing | no (real screenshots) |
| S08 | Dark agency showreel | Kinetic & social | studio reels, portfolio, hype | optional |
| S09 | Isometric blueprint | Illustrated story | construction, industrial, IoT, enterprise | yes, stills |
| S10 | Top-down overwhelm loop | Flat explainer | problem hook, 6–10 s loop | optional |
| S11 | Bold fintech doodle | Flat explainer | fintech, banking, budgeting apps | no |
| S12 | Warm painterly story | Illustrated story | food, origin stories, brand heritage | yes, stills |
| S13 | 3D character short | 3D & clay | consumer story ads, retail, emotion | yes, video |
| S14 | Clean avatar network | Flat explainer | marketplaces, hiring, community | no |
| S15 | Talking head + kinetic B-roll | Kinetic & social | founders, creators, podcasts | footage or Flow |
| S16 | Neon dashboard | SaaS UI | AI agents, no-code, analytics | no |
| S17 | Grain gradient editorial | Illustrated story | finance, legal, insurance, consulting | yes, stills |
| S18 | Bright flat lifestyle | Flat explainer | SMB services, video/marketing offers | optional stills |
| S19 | Anime title sequence | Illustrated story | drama, film, music, emotional brand | yes, stills |
| S20 | Hand & device flat | Flat explainer | app flows, e-commerce, dating, booking | no |
| S21 | Light iso + pills | Flat explainer | telecom, analytics, call tracking | no |
| S22 | Warm community flat | Flat explainer | nonprofits, churches, education | no |
| S23 | Pastel minimal character | Flat explainer | giving, wellness, lifestyle apps | no |
| S24 | Duotone urban flat | Illustrated story | ads platforms, audio, media | optional stills |
| S25 | Cosmic glow data | Illustrated story | data/analytics, media intelligence | yes, stills |
| S26 | Magenta mono narrative | Illustrated story | insurance, health, fintech | optional stills |
| S27 | Soft clay 3D UI | 3D & clay | creator tools, marketplaces, apps | optional stills |
| S28 | Story-driven flat commerce | Flat explainer | print-on-demand, e-commerce, makers | yes, stills |
| S29 | Browser + avatars proof loop | SaaS UI | social proof, reviews, 5–8 s loop | no |
| S30 | Paper collage kinetic | Editorial & doc | creators, coaches, hooks, opinion reels | optional stills |
| S31 | Event promo flyer | Ads & promos | conferences, church services, launches, concerts | optional stills |
| S32 | Sports cut-out poster | Ads & promos | athletes, matchday, fitness, tournaments | optional stills |
| S33 | Neon icon morph | Kinetic & social | story hooks, brand values, 6–15 s loops | no |
| S34 | Dark HUD cinematic type | Kinetic & social | B2B hooks, outreach, tech creators | no |
| S35 | Product flavour swap | Ads & promos | drinks, snacks, cosmetics with variants | yes, stills |
| S36 | Food sizzle hero | Ads & promos | restaurants, food delivery, FMCG | yes, stills |
| S37 | Phone colour-flash launch | SaaS UI | consumer app launches, fintech apps | no |
| S38 | Archive documentary | Editorial & doc | history, biographies, brand heritage | yes, stills |
| S39 | Before/after showcase | Kinetic & social | editors, agencies, portfolio and service promos | footage |
| S40 | Light-trail storyline | Kinetic & social | ideas, process, creativity stories | no |
| S41 | Surreal 3D editorial | Editorial & doc | branding, identity, psychology hooks | yes, stills |
| S42 | Mid-century poster | Ads & promos | automotive, retro brands, events | optional stills |
| S43 | Giant type reveal | Ads & promos | QSR, product drops, menu specials | optional stills |

"Flow?" means whether Google Flow (via the `mcp__flow__*` tools) should make imagery or clips.
"no" styles are built entirely in code with the engine. See `flow-assets.md`.

---

## SaaS UI family

### S02 Soft-blur workspace
- **Look:** white stage, huge out-of-focus magenta/orchid blobs drifting at the edges, floating app windows and notification toasts with real-looking UI, brand logo cameo with cursor.
- **Palette:** bg `#FFFFFF`, blobs `#C86BC9` `#E3A6E6`, ink `#1A1A1A`, accent `#B8389B`.
- **Type:** geometric sans (Inter Tight / Plus Jakarta), light weight 300–400, very large; one word in a gradient accent; typewriter with blinking bar caret ("Need|", "Move fast.|").
- **Motion:** windows scatter with depth blur (far = blurred), toasts pop with "Messages lost" chaos, modal fills in with cursor typing, orbit rings with avatar dots, search bar results slide in.
- **Transitions:** blur-through (everything defocuses then refocuses on next object), type-on word swaps, cursor-led zoom into modal.
- **Pacing:** 7–8 s per section, never a hard cut. Problem 30%, product 60%, logo 10%.
- **Build:** `S.blob` ×3, `S.card({chrome:true})`, `S.toast`, `S.typeOn`, `S.cursor`, `S.orbit`; animate `blur` on far cards.

### S06 Bubble network SaaS
- **Look:** saturated periwinkle stage with faint outlined circles; characters cropped inside circles; chaos of bubbles (mail, phone, chat, "!" "?") that fill the frame; then clean product UI cards with lime highlights; side-by-side stat cards (solo vs with product).
- **Palette:** bg `#8C83F0`, primary `#6C5CE7`, card `#FFFFFF`, lime `#C6F432`, ink `#1E1B4B`.
- **Type:** rounded geometric sans, bold numbers ("117 days" vs "95 days"), small caps captions.
- **Motion:** circles grow from points with playful spring, bubble swarm multiplies to overwhelm, AI sparkle orb with lime glow ring, UI cards assemble in layers, cursor-free.
- **Transitions:** white-flash logo card interrupt; circle masks expanding into next scene; camera slides along a connected flow line.
- **Pacing:** continuous; 30 s for 6 beats.
- **Build:** `S.avatar` inside circles, `S.orbit`, `S.card`, `S.bars`, `S.count`; lime `box-shadow` glow rings.

### S07 Glass UI float
- **Look:** near-white lavender, real product screens on tilted 3D planes (rotateX/rotateY 15–30°), heavy depth of field, floating avatars and testimonial chips, pricing tiers fanned in perspective, crown icon for premium.
- **Palette:** bg `#FAF8FF`, haze `#E9E3FF`, accent `#7C5CFF`, ink `#1F1B2E`.
- **Type:** clean grotesk, light headings ("Professional"), small labels.
- **Motion:** slow camera dolly across tilted screens, rack-focus (blur pulls), cards stack and fan, cursor clicks CTA "Schedule a demo".
- **Transitions:** focus pulls and lateral camera slides; vignette punch to dark for one beat of contrast.
- **Pacing:** long takes (40 s+), camera always moving at ≤ 4u/s.
- **Build:** real screenshots in `assets/`, `S.card` with `<img>`, `persp`+`rx`/`ry` in `S.set`, animate `blur` per depth layer.
- **Rule:** use the brand's real screens. If missing, stop and ask; never fake a dashboard for a real product.

### S16 Neon dashboard
- **Look:** deep blue→violet gradient, an iMac-style monitor holding a glassy chart, floating keywords with sparkle glyphs ("✦ Design", "✦ Deploy", "✦ Scale"), then a pale glassmorphism section with "Create Agent" cards, file upload chip, 3D hand cursor.
- **Palette:** `#0A1A5C` → `#5B21B6`, glass `rgba(255,255,255,.12)`, line `#60A5FA`, pale `#EEF0FF`.
- **Type:** medium grotesk, words flank the monitor left/right ("Smart  ▢  Agents").
- **Motion:** chart line draws and its tooltip rides the curve; monitor zooms out into a rounded frame then into light mode; upload card drops and docks.
- **Transitions:** frame-in-frame zoom (screen becomes a card becomes the new background); dark→light inversion.
- **Pacing:** 8 s, hero-loop friendly.
- **Build:** `S.lineChart`, `S.card({glass:true})`, `S.text` flanking words, `S.cursor`.

### S29 Browser + avatars proof loop
- **Look:** soft grey stage, a browser window builds (blank → green header → content), circular avatars pop around its edges with star-rating chips and like badges.
- **Palette:** bg `#F2F4F7`, green `#93C83E`, ink `#2B2B2B`, white cards.
- **Motion:** window springs up, header wipes in, avatars pop in a clockwise stagger (playful spring), stars fill one by one; then holds and idles so the last frame equals the first.
- **Pacing:** 5–8 s seamless loop.
- **Build:** `S.card({chrome:true})`, `S.avatar` ×6, `S.pill` with `star` icons.

---

## Flat explainer family

### S03 Lavender flat corporate
- **Look:** monochrome lavender world, flat vector bearded professional at desk, laptop/browser screens with funnels, gauges, rockets, coins, 100% badge; big soft gradient shards swipe across.
- **Palette:** bg `#D9DBFB`, primary `#5B5BE6`, accent `#E8336E`, green `#1FA67A`, ink `#2B2A6B`.
- **Type:** friendly geometric sans (Poppins/Jost), centered two-line statements with one bold phrase ("Conversion Analyzer™ process").
- **Motion:** icons pop from the screen, funnel catches falling coins, rocket launches out of a laptop, gauge needles sweep.
- **Transitions:** big rounded shape wipes from the side (shape covers frame then reveals next).
- **Pacing:** single continuous 60 s take with shape wipes every 4–6 s.
- **Build:** shape wipe = large rotated rounded rect animated across with `heavy` spring; icons via `S.icon`; characters as Flow stills (flat vector prompt) or simple SVG.

### S10 Top-down overwhelm loop
- **Look:** overhead desk shot, character from above clutching head, papers piling and shuffling, phone buzzing, alert triangles on laptop; scene dims and logo resolves.
- **Palette:** `#123B4A` bg, `#4FD1C5` paper tint, `#E6FFFA`, `#2F6FE4` shirt, alert `#F24E4E`.
- **Motion:** papers jitter and multiply, notifications blink, then everything fades to 30% and the logo mark draws itself, wordmark slides from behind.
- **Pacing:** 8 s; stress loop 6 s then logo 2 s.
- **Build:** papers = many small rotated cards with `wobble`; logo stroke draw via SVG `stroke-dashoffset`.

### S11 Bold fintech doodle
- **Look:** loud flat color fields (acid lime, lilac, cream), chunky cartoon hands with personality, piggy bank with bouncing coins, phone with paper-plane app, hand-drawn squiggle arrows; logo ends surrounded by hands holding money, card, coin.
- **Palette:** lime `#C7EC0E`, lilac `#B98CF0`, forest `#0F5C3A`, cream `#F3F0E2`, rust `#B43E12`, coin `#F7D23E`.
- **Type:** chunky rounded sans (Fredoka/Recoleta-like), lowercase wordmark.
- **Motion:** squash-and-stretch, coins arc with gravity, color-field slide transitions (whole background color slides in as a card).
- **Transitions:** solid color panel slides across; logo letters type in.
- **Pacing:** 9–10 s; 3 beats.
- **Build:** color panels = full-stage divs with `S.wipe`; hands/piggy as SVG or Flow flat stills; squiggles as SVG paths with dash draw. **Fits CreaviaAI's apple green natively.**

### S14 Clean avatar network
- **Look:** off-white with corner geometry (yellow triangle, blue diagonal band, ring, dots), four colorful circular avatar busts orbit, swap places, then each one docks into a profile card; zoom out to a laptop on a desk with a character typing.
- **Palette:** bg `#F4F4F2`, blue `#1E9BD7`, purple `#8E2C8E`, green `#12A150`, yellow `#F2B705`.
- **Motion:** avatars orbit with partial ring strokes, shrink and slide into cards, cards fill with skeleton lines and "View profile" buttons; push-out reveals the cards were on a screen.
- **Transitions:** pull-back reveal (UI turns out to be inside a device).
- **Build:** `S.avatar` with `ring`, `S.orbit`, `S.card` + `S.lines`; camera pull-back = scale the whole group from 1 → 0.35 with `heavy`.

### S18 Bright flat lifestyle
- **Look:** lavender rooms, flat character with patterned sweater and glasses, circular vignette bubbles of other scenes, magnifier, clapperboard, globe with avatar ring, music notes, HD badge, thumbs-up "100%", "Order Now" button.
- **Palette:** `#EDE6FF`, purple `#7B2FBE`, red `#FF3D5A`, green `#3DDC84`, yellow `#FFC93C`.
- **Motion:** circles pop with overshoot, clapper snaps, icons bounce around a central object, depth-of-field background blur for CTA.
- **Transitions:** circle iris in/out on objects.
- **Build:** `S.wipe(p,'circle')`, `S.icon` bursts with `playful` spring; characters via Flow flat stills.

### S20 Hand & device flat
- **Look:** neutral grey, oversized flat hands holding phones (swipe, like/dislike), laptops with product cards, a continuous thin white line looping behind objects.
- **Palette:** bg `#EDEDED`, teal `#49C6C2`, coral `#C9524B`, yellow `#F2B33D`, blue `#2D8BCB`, green `#3DBE8B`.
- **Motion:** hand enters, thumb taps, phone rotates and morphs into a tablet then a laptop (object morph), cursor hovers chips ("Good fit", "Ready to buy").
- **Transitions:** object morph (phone → screen) and line-follow.
- **Build:** device frames as rounded divs whose width/height/radius animate with `S.track`; line as SVG path.

### S21 Light iso + pills
- **Look:** pale blue-white, glossy isometric buildings and maps, pill-shaped cutouts holding people on phones, giant bold caps titles ("REAL TIME REPORTS"), crowd of flat people at the end.
- **Palette:** `#F2F6FB`, blue `#2F7BEA`, red `#E9343A`, green `#22B573`, yellow `#FFC72C`.
- **Type:** heavy rounded caps (Nunito Black / Montserrat ExtraBold), letters bounce in individually.
- **Motion:** pills slide in rows like a conveyor; iso map tilts; title letters stagger with `playful`.
- **Build:** `S.text(...,{split:'char'})` with `mode:'drop'`, pill rows = rounded rects with avatar inside.

### S22 Warm community flat
- **Look:** beige paper world, yellow/teal palette, people in circular portraits linked by chat bubbles, a quote card on paper with a pencil, warm group scene on a sofa, hands reaching.
- **Palette:** beige `#EEDDB8`, yellow `#F5C518`, teal `#1BA9A9`, red `#C8102E`, ink `#3A3A3A`.
- **Type:** serif for quotes (Lora/Libre Baskerville), sans for UI.
- **Motion:** gentle, slow; leaves sway, circles float; quote card drops and settles with `heavy`.
- **Pacing:** 6–9 s per beat, calm music.

### S23 Pastel minimal character
- **Look:** each shot a single pastel solid (cream, pink, mint, lilac), one simple character or one object (flower in hand, piggy to globe with dashed path), word-only title cards with a colored word that morphs ("Giving" → "Givting").
- **Palette:** cream `#FBF4DC`, pink `#FBD5DA`, mint `#DDF6EE`, lilac `#EEEAFB`, coral `#E8505B`, green `#1F9D55`, yellow `#F7C548`, violet `#5B4BC4`.
- **Motion:** one action per shot, cut on action, dashed-line travel paths, letter swap morphs.
- **Pacing:** 2–3 s shots; this is the one flat style that cuts often.

### S28 Story-driven flat commerce
- **Look:** warm cinematic flat illustration (window shutters, painted desk, a cat with personality), the story moves into a clean product UI walkthrough with cursor, then a celebratory stage with confetti.
- **Palette:** yellow `#F2C14E`, terracotta `#D9734E`, teal `#2A9D8F`, stage purple `#3D1F6B`, UI grey `#E9EDF0`.
- **Motion:** character acting beats, then UI: product picker grid, mockup preview, social profile; spotlight stage ending.
- **Build:** Flow stills for story scenes (lock the character with `flow_character`), code-built UI section.

---

## Illustrated story family

### S04 Night cartoon narrative
- **Look:** purple night bedroom, big-eyed rubber-hose-ish gamer character, glowing monitor; game world inserts (castle, dragon); coin avalanche; storefront button grid with cursor; logo with two characters.
- **Palette:** `#1B0F45`, `#5B2CC9`, skin `#F49C8A`, coin `#F6C453`, magenta `#FF4FB8`, UI orange `#F5A524`.
- **Motion:** comic timing (holds, then sudden), coins pile up and engulf, screen push-in to game, UI grid hover/click.
- **Build:** Flow stills for character plates (`flow_character` for the hero), code for coins (many seeded circles with gravity), UI grid, logo.

### S05 Luxe editorial illustration
- **Look:** fashion-illustration interiors (arched windows, pink salon), elegant character at a mirror, close-up product moment (perfume spray), gold jewelry details.
- **Palette:** rose `#F2A7A7`, raspberry `#C4486A`, wine `#7A1F3D`, gold `#E0B04F`, ink `#1A0F14`.
- **Motion:** slow dolly-in, subtle character motion, mirror reflection, particle mist on spray.
- **Pacing:** 3 shots in 8 s: wide → medium → product close-up.
- **Flow:** Nano Banana stills for plates, Veo/Omni clip for the character action if motion is needed (ask before spending credits). Code adds camera push, mist particles, title.

### S09 Isometric blueprint
- **Look:** cobalt blue tech world, editorial characters in hard hats with tablets, device mockups showing 360° scans, split-screen panels, glowing isometric city with sky bridges, data screens.
- **Palette:** `#0B2A8C`, `#1E5BFF`, `#E9F1FF`, safety orange `#FF4D2E`, green `#3BD16F`.
- **Motion:** camera glides across iso city, panels split and slide, scan beams sweep, laptop rotates in.
- **Transitions:** split-screen wipes; match zoom from device screen into the world.

### S12 Warm painterly story
- **Look:** textured painterly illustration (brush grain), farm → harvest → hand holding a coffee cherry → beans → top-down cup → people on a balcony at sunrise; script title ("Coffee Day").
- **Palette:** sky `#8FD3F4`, leaf `#4CAF50`, warm `#F6C98E`, cherry `#E2553F`, sunrise `#F7B267`.
- **Motion:** parallax layers, slow pans, macro push-ins.
- **Transitions:** **match cuts by shape** (cherry → bean → cup circle), cross-dissolve on light.
- **Flow:** stills per beat with `reference_previous: true` for consistency; code adds parallax (split plate into 2–3 layers if possible), grain, title.

### S17 Grain gradient editorial
- **Look:** grainy gradient-shaded illustration (warm peach light, blue shadows), office scenes, desk close-ups, metaphors (leaking pipes = losing money), community/home ending with the brand on a building.
- **Palette:** peach `#E8A07A`, butter `#F4D39B`, blue `#6F8FC9`, ink `#2A2F45`, green UI `#2FA36B`.
- **Motion:** gentle character loops, camera drift, glow on screens.
- **Build:** Flow stills + `S.grain(0.08)` + slow `S.set` drift; UI inserts in code.

### S19 Anime title sequence
- **Look:** letterboxed 2.39:1 inside 16:9, lush hand-painted backgrounds (bus by fields, city café, river at night, train windows), lone characters, day→night shifts, calligraphic title card on paper.
- **Palette:** sky `#7EC8E3`, field `#6DBE45`, sunset `#F7A072`, dusk `#6B5CA5`, night `#2E294E`.
- **Motion:** long horizontal tracking pans, parallax foreground grass, light changes over a single plate.
- **Pacing:** 3–4 s per shot, slow music.
- **Build:** `S.letterbox(0.12)`, Flow stills, pan via `S.set({x})`, hold the title on paper texture.

### S24 Duotone urban flat
- **Look:** plum/magenta world with lime accents, people commuting, cafés, buses, phones with audio-ad players, flowing lime ribbons, big "LAUNCH AD" button click.
- **Palette:** plum `#5A1E5C`, magenta `#C2187A`, lavender `#B9A7E8`, lime `#C8F560`, blue `#2C46D8`, pink `#F7B6D2`.
- **Motion:** camera pans through scenes connected by ribbons, phones float up in hands, chart reports draw in.
- **Transitions:** ribbon wipes (a thick curved stroke sweeps across and the scene changes behind it).

### S25 Cosmic glow data
- **Look:** violet-to-orange glowing gradients, hills and houses with light trails, glowing glass globe with continents, data walls with charts, search-pill keywords orbiting, five portrait panels, ribbons in hands, sparkle stars.
- **Palette:** night `#10082E`, violet `#6D28D9`, orange `#FF8A3D`, gold `#FFD36E`, magenta `#E040FB`.
- **Motion:** light trails travel between objects, globe rotates with rim glow, pills orbit, sparkles twinkle, opening "Why does it matter?" on black with a gold squiggle.
- **Build:** Flow stills for hero scenes; code: glow `box-shadow`, `S.orbit` of `S.pill` search chips, sparkles.

### S26 Magenta mono narrative
- **Look:** magenta/purple near-monochrome, subway commute, problem stickers flying around a stressed character ("SURCHARGES", "$$$", "LEVIES"), product phone with a jar of coins, cost bar chart falling, ribbon wrapping the phone, roller-skating freedom shot.
- **Palette:** `#8E1B6B`, `#D63384`, `#F3C4E4`, coral `#FF6B4A`, white.
- **Motion:** stickers slap on with rotation + scale overshoot, chart bars fall, ribbon spins around object.
- **Transitions:** whip-pan blur and spiral swirl.

---

## Kinetic & social family

### S01 Glass icon reveal
- **Look:** soft blue-violet gradient with blurred floating emoji tiles, glossy 3D app icon center, profile cards fan out behind it like a hand of cards; cut to deep indigo with kinetic tagline "Make it **personal** / Make it **work**" (accent word swaps), logo builds letter by letter, "Try it free today".
- **Palette:** light `#BFD4FF`→`#C9B8F5`, deep `#120E3A`→`#3B2BB8`, accent `#5B8CFF`.
- **Motion:** icon bobs, cards fan with stagger (`default`), word swap with vertical slot-machine roll.
- **Build:** icon = rounded square with gradient + inner shadow; `S.text` with word swap via two stacked texts; logo `split:'char'`.

### S08 Dark agency showreel
- **Look:** black stage with teal underglow, crisp white type ("Studio by …", "take shape"), walls of colorful work cards in 3D perspective, glowing pill toggles, giant type passing the camera ("vision"), avatars orbiting a globe, closing contact pill.
- **Palette:** `#070809`, glow `#2DD4BF`/`#0F766E`, white, plus whatever the work cards bring.
- **Motion:** fastest style: 2.3 s average shot, every shot a new technique. Card walls fly toward camera, type scales through the lens, light streaks.
- **Transitions:** zoom-through-type, light sweep, hard cuts on beat.
- **Build:** card walls = grid of `S.card` with `persp`/`rx` and staggered `z`; giant type with `S.set({s})` growing past 6.

### S15 Talking head + kinetic B-roll
- **Look:** podcast presenter in warm practical light, bold caps captions with one highlighted word on a violet block, every 1–2 s a full-screen insert: collage title cards ("It's the FIRST THING"), newspaper serif headlines, website mockups, "CONSISTENCY READS AS RISK", Follow button with hand cursor.
- **Palette:** warm footage, violet `#7B2FF7`, lavender `#E9D8FF`, white captions, red/orange warmth.
- **Motion:** 1.35 s average shot; captions pop word by word; inserts slam in with scale 1.08 → 1.
- **Footage:** the user's own video, or a Flow presenter clip. Captions: `flow_captions` (style `highlight`) or code captions synced to `flow_transcribe` word times.
- **Note:** for presenter-led reels the user's `flow-video-studio` skill may fit better; use this card when the graphics carry the film.

---

## 3D & clay family

### S13 3D character short
- **Look:** Pixar-like 3D: stylish character shopping, shelf close-ups, basket POV, shocked reaction, wallet and card macro, checkout payoff with a knowing smile.
- **Motion:** cinematic coverage, 1.9 s average shot: wide, insert, reaction, macro, payoff.
- **Flow:** this one is video-first. Create the character once with `flow_character`, generate 6–10 clips (Omni Flash or Veo Fast), keep continuity with `chain_previous`/`flow_continue`. **Ask the user before spending credits** and quote the estimate. Code adds titles, end card, captions.

### S27 Soft clay 3D UI
- **Look:** pastel lilac clay world, rounded laptop and tablet on a grid of floating blank cards, wavy pink/blue ribbons, floating search/X/hourglass glyphs, 3D windows with charts; brand lockup by a laptop in a pastel room.
- **Palette:** `#F1EEFF`, lilac `#CFC6FF`, pink `#E6457A`, blue `#4F8EF7`, white.
- **Motion:** slow orbiting camera, cards ripple, glyphs float with soft shadows.
- **Build:** CSS 3D (`persp`, `rx`) on rounded white cards with large soft shadows; glyphs via `S.icon` in thick strokes; optional Flow clay stills for the room.

---

## Vertical social & ads (S30–S43, from Pinterest "motion graphics", Oct 2026)

These are **9:16-first**: compose for vertical, then build 16:9/1:1 layouts separately. Text sits in
the centre 80% and clear of the top 12% / bottom 18% (app UI). Most open with a 1-second hook and
change something every 0.8–2 s (estimated from sampled frames).

### S30 Paper collage kinetic
- **Look:** warm off-white paper with grain and halftone; cut-out B&W photo objects (bulb, brain, mask), emoji stickers, barcodes, torn edges; occasional full-black inversion cards.
- **Palette:** paper `#F4F1EA`, ink `#111111`, red `#E0262E`, accent from the subject.
- **Type:** italic serif (Instrument Serif) mixed with a heavy grotesk; one red keyword; giant ghosted words behind.
- **Motion:** cut-outs slide in with paper wobble, stickers slap in with overshoot, words pop one at a time, hard flips to black.
- **Build:** objects as Flow stills (isolated on white) or real photos; mixed fonts in `S.text`; stickers on `playful` springs; `S.grain(.08)`.

### S31 Event promo flyer
- **Look:** cinematic black and gold; antique clock, rays, bokeh, speaker cut-outs with rim light, photo stacks of attendees, script + heavy sans titles, date/time chips.
- **Palette:** black `#0B0906`, gold `#D4A64A` to `#F6D58B`, cream `#FFF4DC`; alternate lime/black variant.
- **Motion:** title letters slam in with a gold sheen sweep, camera pushes through bokeh, photos fan into a stack, ticker band of details along the bottom.
- **Build:** Flow stills for the clock/rays plate; speaker photos from the client; gold text with a gradient plus a glint.

### S32 Sports cut-out poster
- **Look:** athlete cut-out over giant stacked numbers and name, torn paper, repeating text strips, gritty halftone; two-colour team duotone.
- **Palette:** team colours on charcoal `#1A1A1A`, plus white.
- **Motion:** number and name slam (scale 1.3 to 1, impact), strips scroll in opposite directions, cut-out pops with shake, badge spins in.
- **Build:** client action photos, cut out; strips as repeated text rows translating; `impact` cue on each slam.

### S33 Neon icon morph
- **Look:** near-black gradient; one glowing symbol per beat (house, eye, sword, crown), horizon glow, fog, a single star.
- **Palette:** navy `#05101F` to black, one neon per beat (teal `#2EF2C7`, red `#FF3B5C`, amber `#FFB547`).
- **Motion:** each icon draws on, glows, then morphs into the next; the world colour shifts with the icon.
- **Build:** SVG icons with `stroke-dashoffset`; morph by crossfade + scale through a flash; glow blobs behind.

### S34 Dark HUD cinematic type
- **Look:** black frame, small translucent chat bubbles and UI chips drifting, thin hairlines, light leaks, glowing eyes, film grain; ends on a creator to camera.
- **Palette:** black, white, electric blue `#3B82F6`, amber flare.
- **Type:** small lowercase phrases near the UI, then one huge word with a light sweep.
- **Motion:** slow camera drift through floating UI, light leak passes, the big word emerges from the dark with blur.

### S35 Product flavour swap
- **Look:** 3D product on a pedestal in a pastel studio; each flavour swaps product, background colour and floating ingredients; phone-frame edge; heavy condensed headline in the brand colour.
- **Palette:** per flavour (pink `#F9C9CF`, mango `#FFC93C`, lime `#C8E86B`); headline colour from the product.
- **Motion:** product slides out, the next slides in on the beat, ingredients burst, background colour wipes.
- **Build:** product renders from the client or Flow stills per flavour; colour wipes with `S.wipe`; `pop` cue per swap.

### S36 Food sizzle hero
- **Look:** dark warm food photography, smoke, steam, embers, sparks; condensed all-caps headlines, price/offer badges.
- **Palette:** charcoal `#1A0F0A`, flame `#C0391B`, orange `#FF7A1A`, cream text.
- **Motion:** slow push on the hero dish, smoke drift, sparks rise, headline stamps in, offer badge spins.
- **Build:** Flow still or real photo plate; sparks as rising particles; smoke as blurred blobs drifting.

### S37 Phone colour-flash launch
- **Look:** 3D phone with real app screens; solid background colours switch every beat (pink, blue, green, black); mascot; huge white headline.
- **Palette:** hot pink `#FF5DA2`, blue `#2D5BFF`, green `#1DB954`, black, white.
- **Motion:** phone tilts and rotates, screens slide, background colour flashes on the beat, mascot pops.
- **Build:** real screenshots inside a CSS phone; colour flashes as full-stage panels; `S.track` for the phone rotation.

### S38 Archive documentary
- **Look:** sepia and B&W archival photos and film, old documents, books, dates as typed captions, maps, period portraits; strong grain and vignette.
- **Palette:** sepia `#7A5A3A`, paper `#E8DCC4`, black, one muted red.
- **Motion:** Ken Burns on stills, parallax cut-outs from photos, typewriter dates, paper slides in, film flicker.
- **Build:** Flow stills or licensed archive; `S.grain(.12)`; flicker via opacity wobble; `S.typeOn` for dates.

### S39 Before/after showcase
- **Look:** white or light-grey grid stage; rounded phone cards with a flat "before" and a graded, captioned "after"; accent corner shapes; client audio waveform; DM-for-work CTA.
- **Palette:** white, grey `#EDEDED`, accent orange `#FF9F1C` or the creator's brand.
- **Motion:** cards slide in, a wipe divider reveals the after, captions pop word by word, a timeline scrubber moves.
- **Build:** real before/after footage; `S.wipe` reveal; caption pills.

### S40 Light-trail storyline
- **Look:** deep emerald gradient, a glowing lime line drawing curves, an orb travelling the path, halo rings; small words rotating along the line.
- **Palette:** emerald `#04351F` to `#0B5D3B`, lime `#C6F432`, white.
- **Motion:** the line draws on, the orb follows, the camera turns with the path, words rotate in along the curve.
- **Build:** SVG path with `stroke-dashoffset`; orb positions precomputed at build with `getPointAtLength`.

### S41 Surreal 3D editorial
- **Look:** grey studio gradient, porcelain masks or heads shattering, textured 3D faces, maroon accent; serif + condensed sans headlines.
- **Palette:** greys `#D9D9D9` to `#7A7A7A`, maroon `#6B1E2E`, black.
- **Motion:** fragments fly apart then reassemble, slow head turns, headline words drop on heavy springs.
- **Build:** Flow stills (intact and shattered) crossfaded; fragments as particle shards in code.

### S42 Mid-century poster
- **Look:** retro automotive or product poster: vintage object cut-out, big mustard circle, grey paper, a spec line, bold geometric wordmark.
- **Palette:** mustard `#E3A72F`, racing green `#1F5E3B`, paper grey `#E6E3DC`, charcoal.
- **Motion:** the circle wipes the colour in, the object drives/slides into place, letters stack in, the spec line types.

### S43 Giant type reveal
- **Look:** giant cropped letterforms fill a solid brand colour; the product appears between/over the letters; tiny logo at the bottom.
- **Palette:** brand solid (yellow `#FFC20E`), white letters, product colours.
- **Motion:** huge letters slide past the camera and settle into the word, the product drops in with squash, letters breathe.
- **Build:** `S.text` at 30–60u with `split:'char'`, letters from off-frame; product photo on a `playful` drop.

---

## Universal pro moves (seen across all 30)
1. **Hook in the first 2 s:** a problem image, a bold claim, or motion that starts immediately. Never fade in from black for more than 0.3 s.
2. **One idea per beat**, and a visual payoff every 3–5 s.
3. **Continuity over cuts:** one object carries the eye from beat to beat (an icon becomes a card becomes a screen).
4. **Problem → product → proof → logo.** Most films spend 20–35% on the problem.
5. **Real UI, drawn clean:** product screens are simplified, not invented.
6. **Characters act:** head scratch, smile, point, type. Never a static mannequin.
7. **End on a lockup** with URL or CTA, held 1.5–2.5 s with the music resolving.
