# Tekniik Homepage — "Signal" Dark Aurora Revamp (Design Spec)

> Full ground-up visual redesign of the homepage (`/`) only. New design
> language from scratch — NOT edits to the existing light/indigo/mono site.
> Copy and facts stay verbatim from `src/data/content.js`. Non-home routes
> are untouched (phased rollout — the home revamp must not regress them).

**Status:** Implemented (2026-07-06). Built phase-by-phase per `tasks/todo.md`; architecture + per-section notes in `CLAUDE.md`. §9 open decisions resolved as: `data-theme="dark"` on `<html>` (Home-only) + token-override file; Nav transparent glass-dark over hero, Footer flips via tokens; Problem crossfade is scroll-driven with reduced-motion static fallback.

---

## 1. Concept

**"Signal."** A software+AI agency that sells *reliability and senior craft*.
The redesign expresses that as a calm, premium, spatial dark interface where
brand-indigo light is the only color and everything glows against deep space.
Confidence through restraint and precision — not noise. Reference bar:
aura.build / Linear-dark / motionsites class, but quieter and more editorial.

**One-line design promise:** *deep dark canvas, indigo aurora light, frosted
glass, precise kinetic type — fast.*

## 2. Why dark aurora (vs. the current light site)

- It is the largest credible departure from today's light+mono editorial look,
  so it reads as a genuine revamp, not a reskin.
- It matches the user's cited reference bar and "ultra modern interactive."
- The brand accent (`--accent:#5B5BFF`) survives — indigo *glows* on dark,
  which strengthens brand recognition rather than discarding it.
- The `src/motion/` engine (smooth scroll, kinetic text, tilt, magnetic,
  scroll-progress, **WebGL aurora shader**) already exists and is reviewed;
  a dark-aurora composition reuses all of it, keeping build fast and the
  performance budget already-proven.

## 3. Design tokens (new dark theme)

A new `styles/theme-dark.css` (or extended `tokens.css` block) scoped to the
homepage via a `data-theme="dark"` wrapper on the Home root, so other routes
keep the light theme. Never hardcode hex outside the token file.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#08080C` | page canvas (near-black, cool) |
| `--bg-raise` | `#101018` | raised panels |
| `--surface` | `rgba(255,255,255,0.04)` | glass fill |
| `--surface-2` | `rgba(255,255,255,0.06)` | glass fill (hover) |
| `--hairline` | `rgba(255,255,255,0.10)` | 1px panel edges |
| `--hairline-lit` | gradient indigo→violet @ 0.5α | lit edges / focus |
| `--text` | `#EDEDF2` | primary text |
| `--text-dim` | `#9A9AA8` | body/secondary |
| `--text-faint` | `#5E5E70` | mono micro-labels |
| `--accent` | `#5B5BFF` | brand indigo (unchanged) |
| `--accent-2` | `#8B5CF6` | violet (aurora mid) |
| `--accent-3` | `#D6409F` | soft magenta (aurora tail) |
| `--glow` | `0 0 40px rgba(91,91,255,0.35)` | element glow |

Type stack unchanged (already loaded, already good): **Sora** display,
**DM Sans** body, **JetBrains Mono** micro-labels. Display type goes larger
and tighter (`clamp` up to ~5–6rem on hero).

## 4. Signature interactions (reuse existing `src/motion/` primitives)

- **Hero aurora** — `AuroraShader` (OGL) live indigo→violet→magenta field,
  lazy-loaded after LCP over a static CSS-gradient fallback; paused offscreen;
  DPR capped at 2; fully bypassed under reduced motion.
- **Smooth scroll** — Lenis (existing `SmoothScroll`), reduced-motion no-op.
- **Kinetic headlines** — `KineticText` per-word masked rise on hero + Final CTA.
- **Scroll-reveals** — `Reveal` staggered per section.
- **Scroll-linked rail** — existing Process rail, redesigned to *ignite*
  glowing nodes as the fill passes them.
- **Magnetic CTAs** — `useMagnetic` on primary buttons.
- **Tilt + glow** — `Tilt` on glass capability/portfolio cards (transform-only).
- All imperative motion (pointer/scroll MotionValues) keeps the documented
  `useReducedMotion()` value-gating guard.

## 5. Section-by-section design (same content, new form)

Section order is preserved; each is redesigned.

### 5.1 Hero — "Spatial statement"
Full-viewport (`min-height:100svh`) dark stage. Back→front: aurora shader →
faint dot/grid vignette → foreground. Foreground centered: mono eyebrow chip
(`WEB · APPS · AI · PARTNERSHIP`), kinetic headline **"Technology built
right."** (Sora 800, "right." filled with an indigo→violet→magenta gradient),
sub copy in `--text-dim`, CTA row (magnetic filled `Get a Quote` + ghost `See
how we work`), and the trust line `4.9★ · 50+ PROJECTS · UK` as glowing mono
chips. Scroll cue hairline at bottom.

### 5.2 Capabilities — "Constellation" (replaces bento)
The four `CAPABILITIES` items as frosted-glass cards in an asymmetric grid
(Websites = tall flagship, others arranged around it), each with a lit hairline
edge, a soft indigo glow on hover, `Tilt` on pointer, and a mono key label.
Section eyebrow `WHAT WE BUILD` + heading "Four capabilities. One team."
No stock imagery — light, type, and glass do the work.

### 5.3 Stats — "Signal readout"
The six `MARQUEE` stats on a thin lit horizontal rail; values count up
(`useCounter`) in large Sora with gradient fill, mono labels beneath in
`--text-faint`. Reads like an instrument panel, not a ticker.

### 5.4 Problem — "Before / After"
Two contrasting glass panels. **Before** (previous agency): cold, desaturated,
hairline-only, a red-shifted "Over budget" badge. **After** (Tekniik): indigo-
lit surface, glow, "On budget" badge. The two paragraphs above set it up with
line-by-line `Reveal`. Optional scroll-driven emphasis crossfade between panels.

### 5.5 Why — "Principles"
`WHY_TEKNIIK` four items as glass cards in a 2×2, each igniting a soft indigo
glow as it reveals on scroll; mono index, Sora title, dim body. A scroll-
progress lit hairline down the section spine.

### 5.6 Process — "Phase Track" (redesigned, existing rail logic)
Keep the scroll-linked rail mechanic (already built). On dark: the rail is a
faint hairline; `.trackFill` is the indigo→violet→magenta gradient; each node
is an unlit ring that **ignites** (fills + gains `--glow` halo) as the fill
passes its scroll offset. Cards are glass with mono `PHASE 0X`, duration pill,
title, body. Desktop horizontal, tablet 2×2 (rail hidden), mobile vertical rail.

### 5.7 Portfolio — "Work index"
The 8 `PORTFOLIO` projects as an interactive editorial list (not cards-in-grid):
large mono index `01–08`, title in Sora, tags as mono chips, result line.
On row hover: the row lifts, a spatial indigo glow blooms behind it, an
animated underline draws under the title, and the large index parallaxes.
Featured (CareGrid) row sits on a lit indigo-tinted glass surface. Rows that
have a `route` remain links; others are static `<article>`s. Typography +
whitespace + light carry the premium feel — still no card imagery.

### 5.8 Testimonial — "Spotlight"
Full-bleed dark band, a single indigo spotlight glow, the `TESTIMONIAL` quote
revealed word-by-word (`KineticText`), attribution (name + role) rising after.

### 5.9 Final CTA — "Crescendo"
Aurora mesh intensifies (denser gradient bloom), kinetic headline "Ready to
build something / that actually works?", magnetic `Get a Quote`, and the
`hello@tekniik.ai` email as a glowing mono link.

## 6. Global integration

- **Nav / Footer:** the shared `Nav` and `Footer` render on every route. The
  dark theme is scoped to the Home `<main>` wrapper (`data-theme="dark"`); Nav
  must read correctly over the dark hero (transparent-over-dark at top of Home,
  its normal state elsewhere). Footer either adopts the dark treatment on Home
  or keeps its current look — decided in the plan; must not regress other pages.
- **Route transition:** the existing 240ms route fade is preserved.

## 7. Constraints (carried into the plan verbatim)

- Copy frozen — verbatim from `src/data/content.js`. No wording changes.
- Animate `transform`/`opacity` only (GPU). Never width/height/top/left/
  margin/padding/filter for motion.
- Framer: `LazyMotion strict` + `m` only. Never import `motion`. `domAnimation`.
- Reduced motion: `MotionConfig reducedMotion="user"` + the imperative-value
  `useReducedMotion()` guard for pointer/scroll MotionValues.
- WebGL never blocks LCP: OGL lazy after LCP over static fallback; paused
  offscreen/hidden; DPR ≤ 2.
- No new hardcoded hex outside the token file. Single accent family (indigo→
  violet→magenta aurora) — no unrelated colors.
- Touch targets ≥ 44×44px; visible focus rings (dark-theme `--focus-ring`);
  semantic HTML unchanged.
- Fully responsive: 320 / 375 / 414 / 640 / 768 / 1024 / 1280 / 1600, no
  horizontal scroll, landscape tested, ≥44px touch targets ≤1024px.
- Quality gates each task: `npm run build` succeeds, `npm run lint` passes
  (`react-hooks/set-state-in-effect` and `rules-of-hooks` are errors), no new
  console errors, no reduced-motion console errors.
- Scope: homepage `/` only. Other routes stay light and must not regress.

## 8. Success criteria

1. Homepage reads as a genuinely new, premium, dark, spatial design — not the
   old site recolored.
2. Every existing fact/word from `content.js` is present, verbatim.
3. 60fps scroll; LCP not blocked by WebGL; Lighthouse perf stays healthy.
4. Full reduced-motion + keyboard-accessible path.
5. Clean at all breakpoints, no horizontal scroll.
6. Other routes (`/services`, `/about`, `/contact`, case studies) unchanged.

## 9. Open decisions for the plan

- Dark theme scoping mechanism: `data-theme="dark"` wrapper vs. a Home-only
  CSS module theme layer (recommend the wrapper + token override block).
- Nav-over-dark treatment and Footer-on-Home treatment.
- Whether Problem panel crossfade is scroll-driven or hover/tap (perf/a11y).
