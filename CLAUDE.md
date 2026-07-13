# Tekniik — Architecture

Production Vite + React SPA. **The homepage (`/`) is a "Bold Editorial" light theme** — clean white canvas, near-black ink, restrained indigo accent, oversized Inter Tight type, sharp cards, and a few inverted near-black bands for high-contrast drama. All other routes use the base light theme. Source of truth for copy: `references/tekniik-prototype-v4.html` (content only, design discarded) → mirrored verbatim in `src/data/content.js`. The homepage revamp is documented in `tasks/todo.md` (2026-07-07 "Bold Editorial" total revamp). The earlier "Signal" aurora specs under `docs/superpowers/specs/` are SUPERSEDED.

## Stack
- Vite 8 + React 19 (with `react-compiler`)
- `react-router-dom` (BrowserRouter, in-app SPA navigation)
- Vanilla CSS Modules per component — no Tailwind, no UI kit
- **Motion layer** (`src/motion/`): `framer-motion` via `LazyMotion strict` + `m` only (never `motion`, `domAnimation` bundle), `lenis` smooth scroll. Primitives: `KineticText`, `Reveal`, `Tilt`, `useMagnetic`, `useScrollProgress`, `SmoothScroll`, `LazyMotionProvider` (sets `MotionConfig reducedMotion="user"`). Barrel: `src/motion/index.js`. `AuroraShader` (OGL WebGL) is retained in the barrel but **no longer used on the homepage** (the Bold Editorial revamp dropped the aurora wash); `ogl` is now effectively dead weight — see ISSUES.md.
- All SVG icons inline (`src/components/Icon.jsx`)
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

## ServiceShowcase — "Capabilities" (`02`)
`src/sections/ServiceShowcase.jsx` renders `CAPABILITIES` as **image-forward** cards in a 3-col `grid`. The featured "Websites" card spans the full width (`grid-column: 1/-1`) as a horizontal split — text left, image right — **inverted** (`--band` near-black, `--on-band` text, `--accent-on-band` number). The other three (`app`/`mobile`/`ai`) form the 3-up below, each a vertical card: 4:3 image on top, then a mono `NN` index + `↗` (translates on hover) + Inter Tight title + desc. Images are `SERVICE_IMG[key]` → `/img/services/{websites,apps,mobile,ai}.webp`, regenerated as **light indigo-restrained ABSTRACT** forms (no devices/UI/text — the old cinematic dark-pink renders had garbled fake UI and clashed with the light theme). Image `object-fit:cover`, scales 1.04 on hover. Each card is a `<Link to="/services">`. Featured collapses to a stacked card (text, then 16:10 image) ≤900px; the 3-up → 1-col ≤640px. To regen: `node scripts/generateTekniikImages.js --id svc-<key>` (Imagen 4 Ultra, needs `GEMINI_API_KEY`).

## LogoStrip — "The Numbers" (`03`)
`src/components/LogoStrip.jsx` renders the `MARQUEE` stats as a light band (`--bg-2`, top/bottom hairlines) under an `03 | THE NUMBERS` editorial head. It **filters to numeric-leading values only** (`50+`, `98%`, `4.9★`) — the three non-numeric brand words (`Senior`, `AI-native`, `Long-term`) are intentionally excluded (user: "add only numbers"). Three readouts in a 3-col grid, each a cell with a **2px near-black top border**, a mono `NN` index (`--accent`), an oversized Inter Tight `value` (`clamp(2.8rem,6vw,5rem)`), and a mono `--text-faint` `label`. Values count up on scroll via `src/hooks/useCounter.js` (IO+rAF, reduced-motion → target immediately). Grid 3→1-col (≤560px, cells separated by hairlines). Copy in `content.js` is untouched; only the displayed subset changed.

## Problem — bold split (`04`)
`src/sections/Problem.jsx` is a 2-col grid: LEFT = a **sticky** head (`04 | THE PROBLEM` + oversized heading + `PROBLEM.paragraphs`). RIGHT = two offset cards from `PROBLEM.beforeCard`/`afterCard` — "before" is muted (`--bg-2`, hatched `.lineBad`, danger badge, offset right) and "after" is indigo-accented (`--accent` border + soft shadow, solid `.lineGood` bars, success badge, offset left). A `useScrollProgress` crossfade fades the before panel back / brings the after panel forward (opacity + y; reduced-motion gated). Collapses to 1-col ≤900px (head un-sticks, offsets reset).

## Why — bold four-up (`05`)
`src/sections/Why.jsx` — `05 | WHY TEKNIIK` head + oversized heading + sub, then `WHY_TEKNIIK.items` as a 4-col row. Each cell has a **2px near-black top border**, a large ghosted Inter Tight index (`01`–`04`, → `--accent` on hover), title, desc; the cell lifts on hover (CSS transform, reduced-motion gated). 4→2 col (≤900px) → 1-col (≤560px). No scroll hooks (simplified from the old aurora spine).

## Process — "Phase Track" (`06`)
`src/sections/Process.jsx` keeps the scroll-linked rail mechanic (`useScrollProgress` on `.steps`; `.trackFill` scaleX / mobile `.trackFillV` scaleY; per-`Node` `useTransform` ignition; `reduced ? 1 : value` gating). Re-themed sharp/light: the head is `06 | HOW WE WORK` + oversized heading; the rail track is a 2px `--hairline`, the fill is solid `--accent` (indigo, no rainbow), each node is an unlit `--border-strong` ring that ignites to accent as the fill passes. Cards are sharp solid (`--surface`, `--r-lg`) with mono `PHASE 0X` (accent) + `0X/04` index, an accent duration pill, big Inter Tight title, dim body; hover lifts. Desktop 4-col, tablet 2×2 rail-hidden (≤960px), mobile vertical rail (≤640px). Reduced motion → rail filled + nodes lit.

## Portfolio — "Work index" (`07`)
`src/sections/Portfolio.jsx` renders the 8 `PORTFOLIO` projects as an editorial LIST under a `07 | OUR WORK` head. Each row (`Row` subcomponent so pointer hooks stay out of `.map`): huge Inter Tight index `01`–`08`, title, mono tag chips, `result` line. **Hover inverts the whole row to a near-black card** (`--band` bg, `--on-band` text, `--accent-on-band` index, indigo underline draws under the title); the index also parallaxes toward the cursor (reduced-motion gated). CareGrid (`tcc`, `featured`) is a **permanent inverted block** with its `desc` shown. Tag chips get a `.tags span` override so they stay legible on the inverted bg. Routed rows (`looqz`, `autoscreen`) are `<Link>`s with "View case study →"; others are `<article>`. Reflows 3→index-span+aside (≤900px)→1-col (≤560px).

## Testimonial — "Quiet moment" (LIGHT)
`src/sections/Testimonial.jsx` is a **light** section (`--bg-2`, top hairline, faint indigo radial) — kept light ON PURPOSE so it does not merge with the near-black `FinalCta` band directly below it (they were two adjacent dark bands before). `TESTIMONIAL.text` reveals word-by-word via `KineticText` (oversized near-black Inter Tight, `--ink`) under an `--accent` quote glyph; the name/role attribution chip (indigo avatar, `--surface` fill, soft shadow, hairline) rises in after via `Reveal delay`. FinalCta remains the single dark crescendo, so the page rhythm is …light → light Testimonial → dark FinalCta.

## FinalCta — "Crescendo" (inverted)
`src/sections/FinalCta.jsx` (props from `Home.jsx`) is a full-bleed **inverted** closing stage (`--band`) with one breathing indigo `.bloom` radial (transform/opacity `bloomBreathe`; no AuroraShader). Both `heading` lines render as `KineticText` (per-word rise; final line `--accent-on-band`); a magnetic primary `Button` (`useMagnetic`) and a mono `mailto:` link with a `scaleX` underline-draw close it.

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
