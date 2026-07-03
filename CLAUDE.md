# Tekniik — Architecture

Production Vite + React SPA. Light-themed, indigo-accent, mono-heavy. Source of truth for copy: `references/tekniik-prototype-v4.html` (content only, design discarded). Source of truth for design: `references/tekniik-redesign-claude-code-prompt.md`.

## Stack
- Vite 8 + React 19 (with `react-compiler`)
- `react-router-dom` (BrowserRouter, in-app SPA navigation)
- Vanilla CSS Modules per component — no Tailwind, no animation library, no UI kit
- All SVG icons inline (`src/components/Icon.jsx`)
- Google Fonts: Sora (display), DM Sans (body), JetBrains Mono (mono/code labels)

## Layout
```
src/
  main.jsx                     entry; mounts BrowserRouter
  App.jsx                      routes, Cursor, Nav, Footer, ScrollToTop, route fade
  styles/
    tokens.css                 design tokens (color, type, spacing, motion)
    reset.css                  reset + base type
    global.css                 body, dot grid, route fade, skip link
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
- `prefers-reduced-motion` honored everywhere: tokens collapse animation durations to `0ms`, `Reveal` falls through, `Cursor` does not mount, hero animations bypass.
- All animations are GPU-friendly (`transform` / `opacity` only). Never animate `width/height/top/left/padding/margin`.
- Touch targets ≥ 44×44px. `min-height: 44px` on buttons, hamburger 44×44, mobile nav links min-height 56px.
- Focus rings: custom indigo ring via `--focus-ring`. Never `outline: none` without a visible alternative.
- Semantic HTML: `<header>` for nav, `<main>` for main content, `<section>` per logical section, `<article>` for portfolio cards, `<footer>`.
- Skip-link at top of `App` for keyboard users.

## Hero — "Aurora Bento Showcase"
`src/components/Hero.jsx` composes a centered, gradient-driven hero followed inline by `ServiceShowcase`. No split layout, no terminal mockup. Layers (back→front): aurora atmosphere (3 soft radial blooms — indigo/violet/pink), a slow conic-gradient ribbon behind the bento, then foreground content. Foreground: `HeroBadge` (gradient pill) → `GradientHeadline` (Sora 800, "built right." filled with deep indigo→violet→pink ink, word-by-word vertical-mask reveal) → sub copy → CTA row → `TrustStrip` (3 gradient avatars + 5 indigo-gradient stars + rating + region pin) → `ServiceShowcase` bento. Conic ribbon hidden ≤720px.

## ServiceShowcase bento
`src/sections/ServiceShowcase.jsx` is the visual centerpiece beneath the headline. Asymmetric 2-col / 3-row grid on desktop: Websites spans col1 rows 1–2 (tall flagship), Web Apps and Mobile Apps stack on col2, AI & Automation spans the full bottom row. Row heights: `minmax(220px, 1fr) minmax(220px, 1fr) minmax(360px, 1.3fr)` — the AI row is intentionally taller than the upper two so the wide card reads as a co-equal flagship rather than a footer. Each card is a `<Link>` to `/services` with a **full-bleed cinematic webp** (`object-fit: cover`, no padding) from `public/img/services/`, a two-stop scrim (radial vignette + bottom dark gradient) for body legibility, indigo glow shadow + 1px gradient hairline highlight, and a different top-right chip per card (Flagship pill on Websites, sparkle glyph on AI, arrow chip otherwise). Both `.tall` and `.wide` get the larger title size (`clamp(1.5rem, 2.2vw, 1.875rem)`). Reveals via `useReveal` with stagger; hover lifts 6px and scales the image to 1.05 (transform only). On `<960px` the grid collapses to a clean 2×2; on `<600px` it stacks to a single column with `aspect-ratio: 4/3` per card. Reduced motion disables all hover transforms.

## LogoStrip
`src/components/LogoStrip.jsx` replaces the old `Marquee`. A static thin section beneath the hero rendering the `MARQUEE` data items as soft pill chips with gradient-filled values (`50+`, `98%`, `4.9★`, etc.) and body-grey labels. Hairline border, subtle hover lift. No animation, no scrolling — replaces the print-style ticker with a calm trust strip that reads as a designed section rather than a stat scroller.

## Portfolio
Typography-only directory of 8 projects in `src/sections/Portfolio.jsx`. Each card renders project number, tags, title, description, tech stack row (`// stack`), and result line. The first item (`featured: true`) gets a subtle indigo gradient surface to differentiate. No images on cards — premium feel comes from typography, hairlines, and whitespace. Stack values per project live alongside the rest of the content in `src/data/content.js`.

## Process — "Phase Track"
`src/sections/Process.jsx` is the HOW WE WORK section, rebuilt as a horizontal **process track** (replacing the editorial-chapters stack the client rejected). Heading area unchanged ("Four chapters. One outcome.", left-aligned, max-width 640px). Below it: a 4-column grid where each column contains a small node (14px circle, white surface with indigo border + 6px indigo inner dot) sitting on a 1px hairline rail that spans the full width of the row at the node's mid-line. Beneath each node is a compact card with a mono `PHASE 0X` label + faint `0X / 04` index in its header, Sora-700 title (clamp 1.25–1.5rem), an indigo-soft duration pill, and the body copy. The rail is two layered children: `.trackLine` (static `var(--border)` hairline) and `.trackFill` (indigo→violet→pink gradient) that animates `transform: scaleX(0→1)` over 1400ms when the steps wrapper enters the viewport. Nodes scale-in their inner dot and gain an indigo box-shadow halo with `--i`-staggered delays; cards fade+rise with their own stagger. Activation is a single `useReveal()` on the `.steps` wrapper that toggles `.steps.active`. Tablet (≤960px) collapses to a 2×2 grid and hides the rail (the connector would visually break across rows); mobile (≤640px) flips the rail to a vertical 1px line on the left at `--rail-x: 7px`, switches each item to a 2-col `[rail | card]` layout, and `.trackFill` animates `scaleY(0→1)` instead. `prefers-reduced-motion` short-circuits all transforms and shows the active state immediately. Durations and copy live on each step in `PROCESS.steps` in `src/data/content.js`.

## No custom cursor
The site uses the system default cursor everywhere. There is no `Cursor` component, no `useMagnetic` hook, and no `cursor: none` rule. (Previously bundled — removed because the user preferred the native cursor.)

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
- No animation library, no CSS framework — vanilla as required.
