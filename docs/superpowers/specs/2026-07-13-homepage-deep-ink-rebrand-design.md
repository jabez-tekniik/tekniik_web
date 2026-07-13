# Tekniik Homepage — "Deep Ink" Rebrand (Design Spec)

> Ground-up homepage (`/`) redesign on branch `feature/homepage-rebrand`,
> driven by the NEW brand logo (`src/images/brand/`). Replaces the indigo
> "Signal" aurora language entirely. Copy stays verbatim from
> `src/data/content.js`. Non-home routes untouched.

**Status:** Approved direction (user picked "Deep Ink" dark + anime.js-only, 2026-07-13).

---

## 1. Concept — "Deep Ink"

Tekniik's promise is *technology built right* — engineering precision, senior
craft, zero slop. The design language expresses that as a **blueprint at
night**: a deep navy-black canvas, structural hairlines, sharp bold type, and
one electric signal color — the logo's teal — used with extreme restraint.
Navy `#202E5D` (the logo's primary) provides depth panels; teal `#72CCD6` is
the *signal*: cursors, live data, drawn lines, hover states. Everything else
is black, grey, white.

**One-line promise:** *navy-black blueprint canvas, one teal signal, sharp
bold type, engineered motion — fast.*

Reference bar: Linear/Vercel-dark tier but more editorial and structural;
awwwards/mobbin-worthy through typography + choreography, not decoration.

## 2. Brand tokens (from the logo)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0E1A` | canvas (navy-black, never pure black) |
| `--bg-2` | `#0D1322` | deeper band |
| `--bg-raise` | `#111931` | raised panels |
| `--navy` | `#202E5D` | brand primary — feature panels, final CTA block |
| `--navy-soft` | `rgba(32,46,93,0.55)` | tinted panel fills |
| `--surface` | `rgba(255,255,255,0.03)` | hairline card fill |
| `--surface-2` | `rgba(255,255,255,0.06)` | hover fill |
| `--hairline` | `rgba(148,163,199,0.16)` | 1px structure lines |
| `--accent` | `#72CCD6` | teal signal (logo secondary) — ONLY color |
| `--accent-deep` | `#4FA9B5` | teal pressed/deep |
| `--accent-soft` | `rgba(114,204,214,0.10)` | teal tint fills |
| `--text` | `#F4F6FB` | display/primary |
| `--text-dim` | `#A9B1C3` | body |
| `--text-faint` | `#6A7389` | mono micro-labels |

Scoped as `:root[data-theme='ink']` in a new `styles/theme-ink.css`; App.jsx
sets `data-theme="ink"` on `/` (replacing `light`). Same token names as the
existing themes so shared components (Nav/Footer/Button) flip automatically.
No hex outside token files.

## 3. Typography — sharp & bold

- **Display: Clash Display** (600/700, Fontshare) — sharp, high-impact
  grotesk with real edge; hero up to `clamp(3rem, 9vw, 7.5rem)`,
  `letter-spacing -0.03em`, `line-height 0.95`.
- **Body: Satoshi** (400/500/700, Fontshare) — crisp neutral grotesk.
- **Micro: JetBrains Mono** (400/500) — restores true mono for eyebrows,
  indexes, stats, terminal. Uppercase, `tracking 0.18em`, 11–12px.
- Loaded via Fontshare/Google `<link>` in `index.html`. Ink theme overrides
  `--f-display/--f-body/--f-mono`; other routes keep Inter (their tokens are
  untouched).

Radius scale stays sharp (3–12px panels); CTAs are pills (`--r-full`).
No gradient text, no glows, no pure black, max one accent.

## 4. Motion — anime.js v4 only (home)

- `npm i animejs`. New `src/motion/ink/` utilities:
  - `useInViewAnime(ref, buildTimeline)` — IntersectionObserver-gated anime
    timeline, fires once, respects `prefers-reduced-motion` (jump to final
    state, keep opacity-only where comprehension needs it).
  - `splitLines/splitChars` — mask-reveal text (translateY 110% → 0, 700ms,
    `easeOutExpo` equivalent `cubicBezier(0.16,1,0.3,1)`, 60–90ms stagger).
  - `useCountUp` — mono stat counter (pre-parses `2,100+`, `4.9★`, `98%`).
  - `useMagnetic` — pointer-pull CTA (fine pointers only).
  - `drawPath` — SVG stroke-dashoffset line drawing (hero signal, process rail).
  - `typewriter` — terminal frame cycling.
- Lenis smooth scroll stays. framer-motion is removed from home; since no
  other route imports it, `LazyMotionProvider` + the dependency are deleted.
- Emil rules enforced: transforms/opacity only, ease-out entrances, UI
  feedback < 300ms, `scale(0.97)` button press, hover gated by
  `@media (hover:hover) and (pointer:fine)`, scroll work via IO/rAF only.

## 5. Page composition (copy verbatim from content.js)

1. **Nav** (shared) — real brand logo replaces the placeholder "T" mark:
   new `BrandLogo.jsx` inlines `logo-icon.svg` paths with the navy path
   token-recolored (white on ink) + teal path kept; wordmark in display font.
   Transparent over hero → glass + hairline on scroll.
2. **Hero** — asymmetric, left-aligned. Mono eyebrow types in; the three
   headline lines (`Technology / built / right.`) mask-reveal, styled
   uppercase, with a blinking teal caret after "right."; sub + CTAs
   (magnetic pill, button-in-button arrow) + mono trust line. Background:
   faint blueprint grid + one teal SVG signal path drawing itself, then
   idle-drifting. Scroll cue hairline at the bottom.
3. **ServiceShowcase** — restyled terminal panel on `--bg-raise` with mono
   typewriter cycling `TERMINAL_FRAMES`; capability list beside it with
   hairline dividers (no card grid).
4. **LogoStrip → Signal band** — full-bleed marquee of `MARQUEE` stats
   between hairlines; mono numerals count up on first view.
5. **Problem** — editorial split: heading + paragraphs reveal line-by-line;
   before/after as double-bezel panels — "Previous Agency" grey/muted,
   "With Tekniik" teal-lit hairline edge.
6. **Why** — no cards: numbered (mono `01–0n`) hairline-divided rows,
   staggered reveal, hover shifts index to teal.
7. **Process** — vertical rail; teal line draws with scroll progress,
   chapter nodes ignite sequentially.
8. **Portfolio** — full-width rows: huge mono index, project meta, image
   panel revealed by `clip-path: inset()` on scroll; hover scale 1.04.
9. **Testimonial** — massive display quote, word-stagger reveal, teal
   oversized quote mark.
10. **FinalCta** — the one big **navy `#202E5D` panel** (brand moment):
    giant display heading, teal pill CTA, mono email note.
11. **Footer** (shared) — flips via tokens; new logo.

## 6. Imagery — Imagen 4 / Nano Banana

`scripts/generateTekniikImages.js` CINEMATIC boilerplate re-graded: replace
"indigo + violet + warm pink" with **deep navy + cyan-teal ambient, cool
graphite shadows**; UI-on-device prompts get teal CTAs. Regenerate the four
`svc-*` images (used on home) at minimum; portfolio/case imagery only if the
home Portfolio section consumes it. Compress to webp via existing sharp
pipeline. Nano Banana (`generateImagesNano.js` pattern) is the fallback for
refused prompts.

## 7. Accessibility & performance

- WCAG AA: body `#A9B1C3` on `#0A0E1A` ≈ 8.6:1; teal reserved for large
  type/graphics/focus rings (4.5:1+ against canvas as accents).
- `prefers-reduced-motion`: timelines resolve to final state; only opacity
  crossfades remain. Focus-visible teal rings throughout.
- Budget: home JS smaller than before (framer-motion −~40KB gz, aurora WebGL
  dropped from home; anime.js +~11KB gz). No `backdrop-filter` on scrolling
  content; grid/noise on fixed pseudo-elements only.
- Responsive gate (mandatory): 320/375/414/640/768/1024/1280 + mobile
  landscape; touch targets ≥44px ≤1024px; no horizontal scroll.

## 8. Verification

`npm run lint`, `npm run build`, Playwright screenshot sweep at all
breakpoints (instant scroll, 600–900ms settle per lessons.md), visual review
against this spec, reduced-motion smoke test. Present to user only when the
result would credibly sit on awwwards/mobbin.
