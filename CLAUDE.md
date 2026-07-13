# Tekniik — Architecture

Production Vite + React SPA. **The homepage (`/`) is a "Bold Editorial" light theme** — clean white canvas, near-black ink, restrained indigo accent, oversized Inter Tight type, sharp cards, and a few inverted near-black bands for high-contrast drama. All other routes use the base light theme. Source of truth for copy: `references/tekniik-prototype-v4.html` (content only, design discarded) → mirrored verbatim in `src/data/content.js`. The homepage revamp is documented in `tasks/todo.md` (2026-07-07 "Bold Editorial" total revamp). The earlier "Signal" aurora specs under `docs/superpowers/specs/` are SUPERSEDED.

## Stack
- Vite 8 + React 19 (with `react-compiler`)
- `react-router-dom` (BrowserRouter, in-app SPA navigation)
- Vanilla CSS Modules per component — no Tailwind, no UI kit
- **Motion layer** (`src/motion/`): `framer-motion` via `LazyMotion strict` + `m` only (never `motion`, `domAnimation` bundle), `lenis` smooth scroll. Primitives: `KineticText`, `Reveal`, `Tilt`, `useMagnetic`, `useScrollProgress`, `SmoothScroll`, `LazyMotionProvider` (sets `MotionConfig reducedMotion="user"`). Barrel: `src/motion/index.js`. `AuroraShader` (OGL WebGL) is retained in the barrel but **no longer used on the homepage** (the Bold Editorial revamp dropped the aurora wash); `ogl` is now effectively dead weight — see ISSUES.md.
- All SVG icons inline (`src/components/Icon.jsx`). Rating stars: the `★` characters in `content.js` copy (Hero trust, proof ticker, Numbers band) are NOT rendered as text — `StarredText` (Icon.jsx) splits the string and swaps each `★` for `IconStar`, a filled round-jointed (blunt-point) star sized in em. `IconStar` sets `display:inline-block` inline because `reset.css` blockifies all `svg`.
- Google Fonts: **Inter Tight** (display/headlines, heavy 800–900) + **Inter** (body) — `--f-display` / `--f-body` tokens in `tokens.css`. `--f-mono` is ALSO Inter now (the old IBM Plex Mono read as off-brand "code" per user); the token is kept as a distinct slot so the tiny uppercase-tracked labels/index numbers can be tuned independently, but it points at `'Inter'`.

## Homepage "Bold Editorial" theme (light)
The homepage `/` is a bold, left-locked editorial redesign; other routes use the base light theme. The look is driven by the design tokens + a scoped `data-theme="light"`:
- **Scoping:** `App.jsx` sets `data-theme="light"` on `<html>` via `useLayoutEffect` (pre-paint, no FOUC) when `location.pathname === '/'`, and removes it elsewhere. `theme-light.css` (`:root[data-theme='light']`) overrides the base semantic tokens for the homepage. `theme-dark.css` still exists for a possible future dark toggle but is NOT part of this design.
- **Palette (restrained indigo, high contrast):** clean white canvas (`--bg:#ffffff`), faint band `--bg-2:#f4f5f8`, solid white cards (`--surface`, no glass), near-black ink (`--ink:#0a0b10`), crisper hairlines (`rgba(10,11,16,.12)`). Single-hue indigo: `--accent:#5b5bff`; the old violet/magenta aurora stops (`--accent-2`/`--accent-3`) are aliased back to indigo and `--grad-aurora` is a mono indigo→deep-indigo gradient. There is **no page-wide dot/aurora wash** (removed from `global.css`).
- **Inverted band tokens (theme-agnostic, in `tokens.css`):** `--band:#0a0b10`, `--band-2`, `--band-raise`, `--on-band`/`--on-band-dim`/`--on-band-faint`, `--band-hairline`, `--accent-on-band:#8b8bff` (lighter indigo for legibility on near-black). Used by the featured Capabilities card, Portfolio featured/hover-invert rows, and FinalCta (Testimonial is now light).
- **Sharp radii:** `--r-sm:3 / --r-md:4 / --r-lg:6 / --r-xl:8 / --r-2xl:12`. Buttons use `--r-lg`.
- **Editorial devices (recurring):** each major section header is `NN | EYEBROW` (mono index in `--accent` + mono uppercase eyebrow behind a hairline) above an oversized Inter Tight heading. Section index numbers run 02–07 (Hero has the meta bar instead). The Hero is an oversized poster + full-bleed proof-ticker marquee (no cascade); inverted bands (featured Capabilities card, Portfolio, FinalCta) as the contrast rhythm.
- **Nav:** the base light Nav (floating pill) reads over the white hero; it also sits over the inverted Testimonial/FinalCta bands as a light glass bar when scrolled — fine.
- Never hardcode hex outside `tokens.css` / `theme-light.css` (small rgba overlays excepted).

## Layout
```
src/
  main.jsx                     entry; mounts BrowserRouter
  App.jsx                      routes, Cursor, Nav, Footer, ScrollToTop, route fade
  styles/
    tokens.css                 design tokens (color, type, spacing, motion)
    reset.css                  reset + base type
    global.css                 body, route fade, skip link (dot wash removed)
  hooks/
    useReveal.js               IntersectionObserver fade+rise
    useCounter.js              RAF count-up with easing
    useReducedMotion.js        prefers-reduced-motion media query
    useMagnetic.js             cursor magnetism (pull primary CTAs)
    useScrolled.js             scroll-position threshold
  data/
    content.js                 verbatim copy from prototype-v4.html
  components/                  primitive + shared components
  sections/                    page-level sections (used on Home)
  pages/                       Home, Services, About, Contact, CaseLooqz, CaseAutoScreen, NotFound
```

## Conventions
- One CSS module per component file. Class names locally scoped.
- Tokens come from `styles/tokens.css`. Don't hardcode hex outside tokens (exceptions: traffic-light dots, code syntax colors).
- Single accent (`--accent: #5B5BFF`). No second accent. No gold. No warm cream.
- `prefers-reduced-motion` honored everywhere: tokens collapse animation durations to `0ms`, `Reveal`/`KineticText` fall through (MotionConfig `reducedMotion="user"`), scroll-linked values gate via `reduced ? 1 : value`, per-module `@media (prefers-reduced-motion: reduce)` kills hover transitions.
- All animations are GPU-friendly (`transform` / `opacity` only). Never animate `width/height/top/left/padding/margin`.
- Touch targets ≥ 44×44px. `min-height: 44px` on buttons, hamburger 44×44, mobile nav links min-height 56px.
- Focus rings: custom indigo ring via `--focus-ring`. Never `outline: none` without a visible alternative.
- Semantic HTML: `<header>` for nav, `<main>` for main content, `<section>` per logical section, `<article>` for portfolio cards, `<footer>`.
- Skip-link at top of `App` for keyboard users.

> The homepage sections below are the "Bold Editorial" redesign (2026-07-07). `Home.jsx` order: `Hero → ServiceShowcase → LogoStrip → Problem → Why → Process → Portfolio → Testimonial → FinalCta`. Each renders the same verbatim `content.js` copy — only form changed. Non-home routes are unaffected.

## Hero — "Poster + proof ticker"
`src/components/Hero.jsx` is a full-width editorial **poster** on the clean white canvas (no AuroraShader, no dot grid, no side cascade — the old split read as "too normal"). Top **meta bar**: `HERO.eyebrow` left + `HERO.trust` right across a hairline (stacks ≤480px). Below it, an **oversized flush-left headline** built from `HERO.headline` words — `Technology` / `built ` + `right.` (final word `--accent`) at `clamp(3.4rem,12vw,10rem)`, line-height 0.86. A **hand-drawn indigo marker** (`<Marker/>` inline SVG) draws in under "right." via a CSS `stroke-dashoffset` keyframe (instant under reduced-motion). A `.lower` flex row holds the sub copy (left) + CTA cluster (magnetic filled `Button` via `useMagnetic` + ghost, right; stacks ≤760px). At the very bottom, a **full-bleed infinite proof ticker** (`.ticker`, outside `.container`, `aria-hidden`): `TERMINAL_FRAMES` rendered twice back-to-back as a `.tickerTrack` marquee (`translateX 0→-50%`, `34s linear`, pauses on hover, edge-faded via `mask-image`), each item = mono label (`Websites`…) + big Inter Tight `result` value + indigo dot separator. Reduced-motion → marquee + marker both static. `ServiceShowcase` is its OWN section rendered by `Home.jsx`.

**Ghost-word gradient fill:** the middle word `built` is `.ghostWord` — **no stroke** (user removed it), filled with a **drifting brand gradient** clipped to the glyphs via `background-clip: text`: 90deg periodic `--accent-deep → --accent → color-mix(60% --accent, white) → --accent → --accent-deep` at `background-size: 200%`; the light-teal highlight band exists because accent↔accent-deep alone are too close in value for the motion to read. `ghostFlow` animates `background-position` by exactly one tile per 4s → seamless endless drift. Reveal gate: the clipped background paints from glyph geometry regardless of the per-char `opacity: 0` (it showed "built" as a gradient while other words were still typing — user bug), so **no `background-image` exists on the base `.ghostWord`** — the gradient lives in a `--ghost-grad` custom property, chars type in as solid `--accent`, and only `styles.headlineDone` (added by `finish()`) attaches `background-image: var(--ghost-grad)` + the `ghostFlow` animation while `color` transitions to transparent (700ms crossfade). Known exception to the transform/opacity rule (background-position repaints); scoped to one short word. **Caret:** `.caretBlink` runs `caretBlink` 5 iterations + `forwards` (keyframes end at opacity 0), so after typing the caret blinks 5× then stays gone (user request — was infinite); the pre-type pause reuses the class but removes it after ~650ms. Also: `HeroCircuit.jsx` traces deliberately stay clear of the proof-ticker band — the old horizontal `hc-p2` trace (y=720) ran through the marquee and read as a glitch (user), so it was removed entirely, and `hc-p1` terminates in a pad node at y=636 instead of running off-canvas through the ticker. `.tickerValue svg` gets `display:inline` + em sizing in `Hero.module.css` because reset.css makes all svg `display:block`, which snapped `StarredText`'s inline star onto its own line. Reduced-motion: media query sets `.ghostWord` color transparent + `background-image: var(--ghost-grad)` + `animation: none` (static filled gradient) since `useInViewOnce` no-ops and never adds the class.

## ServiceShowcase — "Capability index" (`02`) + animated vignettes
`src/sections/ServiceShowcase.jsx` renders `CAPABILITIES` as an interactive ledger (hairline rows, no cards) driving a sticky **vignette stage** on the right. Hover/focus a row and its **coded animated scene** crossfades in (opacity + scale + blur bridge, staggered internal entry choreography). Scenes live in `src/sections/ServiceVignettes.jsx` + `ServiceVignettes.module.css` — one per capability key: `web` (self-assembling marketing site, cursor clicks the CTA on a 7s loop), `app` (live dashboard: breathing bars, self-drawing SVG trend line, wandering sidebar signal), `mobile` (phone scrolling 3 screens in sync with its tab bar, notification drop with overshoot, 12s loop), `ai` (SVG pipeline: doc node → conic-ring "thinking" core → SMIL packets flowing to three outcome chips). Each scene floats its capability's `TERMINAL_FRAMES.result` as a metric chip. Rules the vignettes obey: **all color from theme tokens** (both ink modes adapt automatically), pure CSS motion (keyframe loops gate on the active class so idle scenes cost nothing; entry choreography is transitions so rapid hovers interrupt smoothly), transform/opacity only, reduced-motion blanket-kill at the bottom of the module (active scene renders complete + static; SMIL packets are hidden via `display:none`). The stage (`ServiceShowcase.module.css`) is **frameless** (no border/bg/radius — user request; scenes float directly on the page canvas and fill the column) and a **size container** — scene metrics use `cqw`/`cqh` so compositions scale proportionally at every viewport — with an edge-faded blueprint-grid `::before`, a drifting accent-bloom `::after`, and pointer parallax: `src/hooks/useStageParallax.js` lerps `--px`/`--py` onto the stage via rAF (pointer-fine only) and the `.back`/`.mid`/`.front` depth layers translate from them. Touch devices (no hover) auto-cycle the scenes on a 4.8s IO-gated interval. Gotcha discovered here: **percentage padding on absolutely-positioned scene nodes resolves against the stage, not the node** — use px/cq clamps. `/img/services/*.webp` are no longer used on the homepage (Services page still uses them).

## LogoStrip — "The Numbers" (`03`)
`src/components/LogoStrip.jsx` renders the `MARQUEE` stats as a light band (`--bg-2`, top/bottom hairlines) under an `03 | THE NUMBERS` editorial head. It **filters to numeric-leading values only** (`50+`, `98%`, `4.9★`) — the three non-numeric brand words (`Senior`, `AI-native`, `Long-term`) are intentionally excluded (user: "add only numbers"). Three readouts in a 3-col grid, each a cell with a **2px near-black top border**, a mono `NN` index (`--accent`), an oversized Inter Tight `value` (`clamp(2.8rem,6vw,5rem)`), and a mono `--text-faint` `label`. Values count up on scroll via `src/hooks/useCounter.js` (IO+rAF, reduced-motion → target immediately). Grid 3→1-col (≤560px, cells separated by hairlines). Copy in `content.js` is untouched; only the displayed subset changed.

## Problem — "The verdict" ledger (`04`)
`src/sections/Problem.jsx`: `04 | THE PROBLEM` meta row, full-width oversized `WordRise` statement, editorial paragraph column, then a **split comparison ledger** — `PROBLEM.beforeCard` (muted, hatched `.lineBad`, danger badge) vs `afterCard` (`--accent-tint` bg, solid `.lineGood`, success badge) divided by one hairline. Each half ends in three **audit rows** (`BEFORE_ROWS`/`AFTER_ROWS`, local to `Problem.jsx` — mono label + verdict + meaningful fill width, all derived from the beforeCard/afterCard copy: Timeline "4 months late"/34% vs "On time"/96%, Scope, Documentation; the earlier unlabeled tight bars read as a skeleton loader per user). **The bar choreography is the storytelling** (fires once via `useReveal` → `.play` on the ledger, which also owns the entrance fade — no `<Reveal>` wrapper): the agency side fills in a stuttering crawl (`barStall`, clip-path inset so the hatch doesn't stretch — deliberate exception to transform/opacity, composited + one-shot) that stalls twice and settles dim (opacity .72); the Tekniik side sweeps in fast (`barSweep` scaleX, `--ease-out`, 120ms stagger — glow scales with the fill) and a single light sheen (`barSheen` on `::after`) passes over after landing — done while the other side is still limping. Each verdict (`--danger` vs `--accent` mono caps) stamps in via `valueIn` as its own bar lands/dies. Per-row delays via inline `--i` on `.auditRow` (inherited by fill + value). Reduced motion → ledger, bars, and verdicts render complete/static, sheen hidden. Ledger stacks 1-col ≤820px.

## Why — bold four-up (`05`)
`src/sections/Why.jsx` — `05 | WHY TEKNIIK` head + oversized heading + sub, then `WHY_TEKNIIK.items` as a 4-col row. Each cell has a **2px near-black top border**, a large ghosted Inter Tight index (`01`–`04`, → `--accent` on hover), title, desc; the cell lifts on hover (CSS transform, reduced-motion gated). 4→2 col (≤900px) → 1-col (≤560px). No scroll hooks (simplified from the old aurora spine).

## Process — "Phase horizon" (`06`, inverted band + WebGL dot wave)
`src/sections/Process.jsx` (2026-07-14 revamp) is a full-bleed **brand-navy band** (`--band`, identical in both ink modes) with an animated **three.js dot-wave field** rolling behind the content: `src/components/DottedSurface.jsx` (adapted from 21st.dev "dotted-surface" — recreated in Tekniik idiom: JSX + CSS module + theme tokens, no Tailwind/next-themes). The wrapper IO+`requestIdleCallback`-gates a `lazy()` import of `DottedSurfaceScene.jsx` so `three` ships as its own chunk (~130 KB gz) that only loads near the section; the scene is container-sized (ResizeObserver), DPR-capped at 2, resolves dot/fog colors from `--on-band-dim`/`--band` at mount, pauses its rAF loop when offscreen (IO), and fully disposes on unmount. Reduced motion (or pre-load) renders a static CSS dot texture instead — the band never reads as empty. The layer is edge-faded via CSS mask, `aria-hidden`, `pointer-events: none`.
Content: head row = `06 | HOW WE WORK` meta + oversized Satoshi heading (left) with the sub right-anchored on the same baseline (stacks ≤720px). The 4 `PROCESS.steps` sit on a **descending staircase** 4-col grid (`margin-top: calc(var(--i) * clamp(...))`); each phase = a 2px top hairline whose **teal fill races across in sequence** with scroll (`useScrollProgressInk`: per-rail `scaleX(clamp(p*4 - i, 0, 1))`, node ignites as its fill starts — the horizontal take on the site's rail mechanic), mono `PHASE 0X` (accent-on-band) + duration pill, ghost stroke number, Satoshi title, dim desc. Hover lifts the phase −6px + teal ghost stroke (pointer-fine only, no text-shift). ≤960px 2-col zig-zag (even items +36px), ≤600px 1-col. Reduced motion → rails filled, nodes lit, no canvas.

## Portfolio — "Work index" (`07`)
`src/sections/Portfolio.jsx` renders the 8 `PORTFOLIO` projects as an editorial LIST under a `07 | OUR WORK` head. Each row (`Row` subcomponent so pointer hooks stay out of `.map`): huge Inter Tight index `01`–`08`, title, mono tag chips, `result` line. **Hover inverts the whole row to a near-black card** (`--band` bg, `--on-band` text, `--accent-on-band` index, indigo underline draws under the title); the index also parallaxes toward the cursor (reduced-motion gated). CareGrid (`tcc`, `featured`) is a **permanent inverted block** with its `desc` shown. Tag chips get a `.tags span` override so they stay legible on the inverted bg. Routed rows (`looqz`, `autoscreen`) are `<Link>`s with "View case study →"; others are `<article>`. Reflows 3→index-span+aside (≤900px)→1-col (≤560px).

## Testimonial — "The word" (LIGHT, rotating)
`src/sections/Testimonial.jsx` is a **light** section (`--bg-2`, top hairline) — kept light ON PURPOSE so it does not merge with the near-black `FinalCta` band directly below it. Asymmetric editorial spread: left rail = oversized `--accent` quote glyph + attribution behind a vertical hairline; right = the quote set huge in display type. **Rotates through the 5 `TESTIMONIALS`** (`content.js` array, one per flagship client): auto-advance every 5s, gated by an IntersectionObserver (only while ≥35% in view), paused on focus-within, and **disabled entirely under reduced motion** (manual nav still swaps instantly). There is deliberately **NO hover pause** — the cursor parks on the section after scrolling and froze the rotation (user bug report); do not re-add one. Transition = outgoing quote+attribution fade up (`.leaving`, 300ms) → keyed remount fades the incoming quote in (`quoteIn` keyframe) and re-enters the attribution via `attrIn` (both `backwards` fill, NOT `both` — forward fill would out-prioritise the `.leaving` styles). The `WordRise` mask reveal runs ONLY on the very first scroll-in (`rotated` state flips after the first swap) — replaying it per rotation read as a glitch per user. Section height never jumps: all 5 quotes render as `visibility:hidden` sizers stacked in the same grid cell as the live quote. Nav = thin editorial hairline bars in the rail foot (active = `--accent`), each inside a 44×44 button hit area; global `:focus-visible` ring from reset.css covers them. FinalCta remains the single dark crescendo, so the page rhythm is …light → light Testimonial → dark FinalCta.

## FinalCta — "Crescendo" (inverted)
`src/sections/FinalCta.jsx` (props from `Home.jsx`) is a full-bleed **inverted** closing stage (`--band`) with two background layers: (1) a `.section::before` **teal bloom** — one soft multi-stop radial (small-rgba teal, smooth 5-stop falloff to avoid banding on the dark band) top-right, slowly breathing via `bloomBreathe` (translate3d + scale + opacity, 14s alternate; killed under reduced motion). A 21st.dev "BackgroundPaths" animated-SVG recreation lived here briefly (2026-07-14) but read as a glitch per user — replaced with this pure-CSS bloom; do NOT reintroduce stroke-dash background effects here, and do NOT install Tailwind/framer-motion for pasted 21st.dev/shadcn components — recreate in-idiom. (2) the giant `ChevronWatermark` brand mark (logo chevron paths, faint white + teal fills, bleeding off the bottom-right). Both `heading` lines render as `WordRise` (per-word rise; final line `--accent-on-band`); a magnetic primary `Button` (`useMagneticInk`) and a mono `mailto:` link with a `scaleX` underline-draw close it.

## Footer — location tabs + dynamic country badge
`src/components/Footer.jsx` Location column: office tabs (Chennai/London) swap the `<address>` AND the country badge below it. Each `FOOTER.offices` entry carries `country`; the badge = inline SVG flag (`IconFlagIndia`/`IconFlagUK` in `Icon.jsx` — fill-based exception to the outline icon set, national-flag hex exempt from the token rule) + country name. A live local-time chip existed briefly but was removed per user — flag + country only. Address + badge remount on tab switch via prefixed keys (`addr-`/`region-` — keys must differ between the two siblings) to replay `regionIn`/`flagIn`; animations killed under reduced motion. The old static `FOOTER.region` string was removed.

## Cursor / magnetism
The site uses the system default cursor (no `Cursor` component, no `cursor: none`). `useMagnetic` (`src/motion/`) IS used — it applies subtle pointer pull to the primary CTAs on Hero and FinalCta (reduced-motion gated inside the hook).

## Generated imagery
All under `public/img/`, generated via **Imagen 4 Ultra** (`imagen-4.0-ultra-generate-001`) on the Google Generative Language API, using the `GEMINI_API_KEY` env var. All sources are **square 1:1** so they crop cleanly into both the bento and the page-hero square frames.

`scripts/generateTekniikImages.js` ships **three style boilerplates** because the consumers want different treatments:
- **CINEMATIC** — full-bleed editorial product photography with deep indigo/violet/pink atmospheric haze, glowing rim light, and bokeh particles. Designed for `object-fit: cover` + a dark scrim overlay (used by bento cards + case-study `heroFrame`). The composition fills the 1:1 frame edge-to-edge so cropping any aspect works.
- **DOCUMENTARY** — real-world editorial photography for the page-hero full-bleed images. Magazine-spread aesthetic, 50mm at f/2.0, soft natural daylight with subtle indigo+violet+pink color grading, modern minimal interior. Compositions are **strictly right-weighted** (subject occupies the right 55%, left 45% reserved for text overlay). When `allowPeople: true`, the script switches Imagen's `personGeneration` to `allow_adult` and drops the people exclusions from the negative prompt; faces are still framed off-axis (3/4 back, side profile, soft focus) to avoid AI-face-artifact risk.
- **ABSTRACT** — pure form compositions on a clean near-white surface: translucent geometric volumes, layered curved planes, luminous orbs. **No devices, no UI, no text, no faces** — kept available for the case where a page wants a sculptural still life. Currently unused by page heroes (replaced by DOCUMENTARY) but available for future product-shot work.

Inventory:
- `services/{websites,apps,mobile,ai}.webp` (1600×1600, **cinematic**) — bento + Services-page row visuals. Websites = laptop with a designed marketing site; Web Apps = glassy browser frame with an analytics dashboard; Mobile = two iOS phones with home + detail screens; AI = AI-assisted editor with suggestion bubbles + pipeline graph.
- `page/{services,about,contact}-hero.webp` (1920×1080, **documentary**, 16:9) — `PageHeader` media used with the **full-bleed variant** on every non-home page. Direct, literal subjects — no metaphors:
  - **About** ("A small team that builds big things") → three adults working together at a wooden desk in a bright modern studio, focused on a laptop and notebook. Faces angled obliquely (`allowPeople: true` set on this item).
  - **Services** ("We build the technology your business runs on") → a modern developer workstation on a clean wooden desk: open laptop with abstract code panels, mechanical keyboard, notebook + brass pen, ceramic mug, plant.
  - **Contact** ("Let's talk about your project") → a clean modern desk ready for a conversation: smartphone with abstract gradient lock screen, open notebook with brass fountain pen, indigo + warm-pink swatch cards, ceramic mug.
- `case/{looqz,autoscreen}-hero.webp` (1600×1600, **cinematic**) — case-study `heroFrame` media. Looqz = phone with booking flow in front of laptop with web-view marketplace; AutoScreen = phone with quote form in front of laptop with technician map.

Imagen 4 dropped the `negativePrompt` parameter, so exclusions ("no people, no faces, no real brand logos, no Lorem ipsum, no monospace") are folded inline into each prompt body. Both style boilerplates additionally repeat these constraints. Sharp resize is `fit: 'cover'` since both treatments compose centred and bleed naturally; webp encoded at quality 92 with effort 6 + smartSubsample. Re-run with:

```
node scripts/generateTekniikImages.js                # all 9 (Ultra)
node scripts/generateTekniikImages.js --id svc-ai    # one entry
node scripts/generateTekniikImages.js --model std    # standard tier (faster/cheaper)
node scripts/generateTekniikImages.js --dry-run      # preview prompts
```

## PageHeader (split-with-media)
`src/components/PageHeader.jsx` is the shared hero block used on every non-home route. Default left-aligned text composition; when a `media={{ src, alt, width, height }}` prop is passed, the layout switches to a 2-column split (text left, image right). The split grid is `1.15fr / 0.85fr`, with `align-items: end` so the media column sits flush with the bottom of the text column. Each variant ships with two soft aurora blooms (indigo + violet) and a glassmorphic backdrop for the back-link pill.

The image is presented as a **modern editorial card with animated atmosphere**. Layered composition (back→front):
1. `.media::before` — large slow-drifting indigo blob (radial gradient, 56px blur). Animates `transform: translate(...) scale(...)` over 18s with `blobDriftA` keyframes; amplitude ±12% drift, ±0.12 scale.
2. `.media::after` — smaller counter-drifting warm-pink blob (48px blur), 22s cycle (`blobDriftB`). The two blobs cross paths slowly so the section feels quietly alive.
3. `.mediaFrame::before` — slow-rotating conic-gradient halo (indigo → violet → pink → indigo, 40px blur), 32s linear loop (`haloRotate`). Sits behind the frame as ambient aurora.
4. `.mediaFrame` — square (`aspect-ratio: 1/1`, `max-width: clamp(360px, 36vw, 460px)`).
5. `.mediaImg` — `object-fit: cover` with `border-radius: var(--r-2xl)`, hairline gradient ring via inset box-shadow, layered drop shadow.
6. `.mediaShine` — subtle inner top-edge highlight gradient (no accent dots, no captions — earlier ornaments were removed as "fussy").

All three animations are GPU-friendly (transform/opacity only) and bypass under `prefers-reduced-motion`. The grid uses `align-items: center` so the image is vertically centered with the text column. On `≤960px` the split collapses to a single column with the image stacked beneath the text. Padding-block trimmed to `clamp(100px, 13vw, 144px)` top, `clamp(56px, 7vw, 88px)` bottom to remove dead vertical space.

## Routing
`/` Home · `/services` · `/about` · `/contact` · `/case/looqz` · `/case/autoscreen` · `*` NotFound. `ScrollToTop` resets scroll on route change. Route fade (240ms) keyed by pathname on the wrapper div.

## Adding a new portfolio entry
1. Add an item to `PORTFOLIO.items` in `src/data/content.js` with `slug`, `title`, `tags`, `desc`, `stack` (array of tech), `result`, optional `route`, optional `featured: true`.
2. If interactive (case study), add a route in `src/App.jsx` and a page in `src/pages/`. To add a hero image, drop a webp at `public/img/case/<slug>-hero.webp` (manifest entry in `scripts/generateTekniikImages.js`) and reference it from the case study page using the existing `.heroFrame` style in `pages/CaseStudy.module.css`.

## Quality gates
- `npm run build` must succeed
- `npm run lint` must pass (`react-hooks/set-state-in-effect` is an error)
- Visual sweep at 320 / 414 / 768 / 1280 / 1600 viewports — no horizontal scroll
- No console errors with `prefers-reduced-motion: reduce` enabled

## QA harness
`tasks/qa-test.py` is a Playwright script that visits every route at 5 viewports, captures screenshots, and reports console errors + horizontal-scroll regressions. Run with the dev server up:

```
npm run dev               # in another shell
python tasks/qa-test.py
```

Screenshots land in `tasks/shots/` and should be deleted after review.

## Things deliberately omitted (vs. brief)
- No Famili Cloud case study route — brief lists only Looqz and AutoScreen as case studies.
- No CSS framework — vanilla CSS Modules. (An earlier note here said "no animation library"; that is no longer true — the `src/motion/` layer uses framer-motion + Lenis + OGL, see Stack.)
