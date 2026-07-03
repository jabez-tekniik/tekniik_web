# Tekniik Homepage — "Amplified Light" Motion Redesign

**Date:** 2026-07-03
**Status:** Approved design, pending spec review
**Scope:** Homepage (`/`) only. Other routes are a later phase.

## 1. Goal

Recreate the Tekniik homepage at the interactivity/polish level of the reference
sites (aura.build, motionsites.ai, 21st.dev, uiverse.io) **without changing any
copy** and **without leaving the light + indigo + mono brand identity**. The
existing content in `src/data/content.js` is the source of truth and stays
verbatim. This is a design + motion layer over the current information
architecture — not an IA or copy rewrite.

Direction chosen (from brainstorm): **Amplified Light Identity** — keep the light
canvas, inject next-level motion. (Dark-cinematic and hybrid directions were
considered and rejected in favor of brand continuity on the conversion-critical
homepage.)

## 2. Non-goals

- No dark mode / dark sections. The page stays light throughout.
- No copy, IA, or routing changes. Same 8-section order.
- No redesign of `/services`, `/about`, `/contact`, or case studies (later phase;
  primitives built here are designed to be reused there).
- No CSS framework, no UI kit. CSS Modules per component stays.

## 3. Tech decisions

Relax the current "no animation library" rule — scoped and documented.

| Dependency | Purpose | Approx weight | Loading |
|---|---|---|---|
| `lenis` | Smooth scroll (the primary "premium" signal) | ~3kb | eager, tiny |
| `framer-motion` | Spring physics, `whileInView`, scroll-linked transforms | ~18kb via `LazyMotion`+`m` | feature bundle |
| `ogl` | Tiny WebGL for the cursor-reactive aurora shader hero | ~10kb | **lazy**, post-LCP |

Rationale: vanilla CSS cannot reach the reference sites' feel. These three are the
minimum to get there. All are gated behind `prefers-reduced-motion` and disciplined
per the performance budget (§6).

## 4. Architecture

Motion is a **layer on top** of the existing component tree, not a rewrite. Section
components keep their markup and CSS Modules; they gain motion via shared primitives
and a few new wrapper components.

### 4.1 New shared primitives (`src/motion/`)

Each has one clear job, a documented prop interface, and is independently testable.

| Primitive | File | Interface (props) | Depends on |
|---|---|---|---|
| `SmoothScroll` | `SmoothScroll.jsx` | `{ children }` — app-level provider; no-op under reduced-motion | lenis |
| `LazyMotionProvider` | `LazyMotionProvider.jsx` | `{ children }` — wraps app in Framer `LazyMotion` w/ `domAnimation` features | framer-motion |
| `Reveal` | `Reveal.jsx` | `{ children, as, delay, y, once=true, className }` — `whileInView` spring fade+rise; **replaces existing `components/Reveal.jsx`** | framer-motion (`m`) |
| `KineticText` | `KineticText.jsx` | `{ text, as, by='word', stagger, className }` — per-word/char spring reveal | framer-motion (`m`) |
| `Tilt` | `Tilt.jsx` | `{ children, max=8, scale=1.02, className }` — pointer-driven 3D tilt, transform-only | framer-motion (`useMotionValue`/`useSpring`) |
| `useMagnetic` | `useMagnetic.js` | `(ref, { strength=0.3 })` — cursor-pull for CTAs; reintroduced | framer-motion values |
| `AuroraShader` | `AuroraShader.jsx` | `{ className }` — lazy OGL fragment-shader canvas, cursor-reactive; static gradient fallback | ogl (dynamic import) |
| `useScrollProgress` | `useScrollProgress.js` | `(ref) => MotionValue<0..1>` — section-scoped scroll driver | framer-motion (`useScroll`) |
| `useReducedMotion` | *(existing hook, reused)* | — | — |

### 4.2 App wiring (`src/App.jsx` / `src/main.jsx`)

```
<LazyMotionProvider>
  <SmoothScroll>
    <BrowserRouter> … existing app … </BrowserRouter>
  </SmoothScroll>
</LazyMotionProvider>
```

- `SmoothScroll` mounts Lenis, drives it via Framer's rAF where practical, and
  syncs Lenis scroll to `window` so `useScroll` reads correct values. Under
  reduced-motion it renders `children` with native scrolling only.
- Route fade (existing) stays; verify it composes with Lenis (reset Lenis scroll
  on route change alongside `ScrollToTop`).

### 4.3 Reduced-motion strategy

`useReducedMotion()` (existing) is the single switch:
- `SmoothScroll` → native scroll, Lenis not instantiated.
- `AuroraShader` → never mounts WebGL; static CSS gradient only.
- `Reveal` / `KineticText` / `Tilt` / `useMagnetic` → render final state, no transforms.
- Tokens already collapse durations to 0ms.

## 5. Section-by-section treatment

Order is unchanged: Hero → LogoStrip → Problem → Why → Process → Portfolio →
Testimonial → FinalCta.

1. **Hero** (`components/Hero.jsx`, `sections/ServiceShowcase.jsx`)
   - `AuroraShader` replaces the static radial blooms: flowing indigo→violet→pink
     fluid over the light canvas, drifting and reacting to cursor position.
   - Headline "…built right." uses `KineticText` (per-word spring draw-on) plus the
     existing liquid gradient sweep on the accent words.
   - Primary CTA wrapped in `useMagnetic`. TrustStrip springs up via `Reveal`.
   - Shader lazy-mounts **after LCP** over the gradient fallback so it never blocks
     first paint.
2. **ServiceShowcase bento** (inline under Hero)
   - Each card wrapped in `Tilt` (3D hover, transform-only). Full-bleed image
     parallaxes ~4–6% inside its frame on pointer move. Staggered `Reveal` entrance;
     top-right chips animate in. Existing hover lift/scale preserved but routed
     through Framer springs.
3. **LogoStrip** (`components/LogoStrip.jsx`)
   - Stat chip values count up (reuse `useCounter`) when scrolled into view; gradient
     values shimmer once on reveal; subtle magnetic hover on each chip.
4. **Problem** (`sections/Problem.jsx`)
   - Copy reveals line-by-line as the block enters (staggered `Reveal` / `KineticText`
     by line) so the argument "assembles" rather than fading as one block.
5. **Why** (`sections/Why.jsx`)
   - Cards spring-lift on hover, staggered entrance; a scroll-progress accent hairline
     (driven by `useScrollProgress`) tracks reading position down the section.
6. **Process — Phase Track** (`sections/Process.jsx`)
   - **Key upgrade.** Replace the one-shot IntersectionObserver `.active` toggle with
     a **scroll-linked** rail: `trackFill` `scaleX` (desktop) / `scaleY` (mobile) is
     bound to `useScrollProgress` of the steps wrapper, so the rail fills *as the user
     scrolls through* the section. Nodes pop with spring at their scroll offsets; cards
     `Reveal` with stagger. Reduced-motion shows the filled/active state immediately.
7. **Portfolio** (`sections/Portfolio.jsx`)
   - Preserve the typography-only restraint. Add per-row `Reveal`; on hover, an
     animated underline-draw on the title and a subtle parallax on the large index
     number. No images added. Featured row keeps its indigo surface.
8. **Testimonial** (`sections/Testimonial.jsx`)
   - Oversized quote reveals word-by-word on scroll via `KineticText`.
9. **FinalCta** (`sections/FinalCta.jsx`)
   - Animated CSS gradient-mesh backdrop (transform/opacity only), oversized kinetic
     headline (`KineticText`), magnetic primary CTA. The send-off.

## 6. Performance budget (enforced, not aspirational)

- **Framer:** `LazyMotion` + `m` components only — never import `motion`. Feature
  bundle `domAnimation` (not `domMax`) unless a section proves it needs more.
- **Animate transform/opacity exclusively.** No layout-affecting properties animated
  on scroll or hover. `will-change` applied narrowly and removed after.
- **Scroll-linked motion via `useScroll`/`useTransform`/`useSpring`** — no React state
  in the scroll path; no per-frame re-renders.
- **WebGL (`AuroraShader`):** one fullscreen fragment-shader quad; `dpr` capped at 2;
  `IntersectionObserver` pauses rAF when hero is offscreen; `visibilitychange` pauses
  when tab hidden; dynamic `import('ogl')` fired on `requestIdleCallback` after LCP;
  static CSS-gradient fallback paints first and is the reduced-motion state.
- **Gate before "done":** Lighthouse (mobile throttle) LCP < 2.5s, CLS = 0, low TBT;
  60fps hold on scroll/hover on mid-tier hardware. Any interaction that can't hold
  60fps is cut or simplified.

## 7. Testing & verification

- `npm run build` succeeds; `npm run lint` passes (`react-hooks/set-state-in-effect`
  stays an error — motion values must stay out of effects/state).
- `tasks/qa-test.py` Playwright sweep: every route at 5 viewports, 0 console errors,
  no horizontal scroll at 320/414/768/1280/1600.
- Manual reduced-motion pass: `prefers-reduced-motion: reduce` → no WebGL, no
  transforms, no console errors, page fully usable.
- Lighthouse run per §6 budget.
- Delete QA screenshots after review.

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Framer bloats bundle / slows TBT | `LazyMotion`+`m`, `domAnimation` bundle, transform-only |
| WebGL hurts LCP or drains battery | lazy post-LCP, gradient fallback, pause offscreen/hidden, dpr cap |
| Lenis fights route fade / `useScroll` | reset Lenis on route change; sync scroll to window; verify in QA |
| Scroll-linked Process janky on mobile | `scaleY` variant + reduced-motion immediate state; test at 320/414 |
| Over-animation → busy, off-brand | restraint on Portfolio; per-section reveal budget; polish pass |
| React-compiler + Framer interplay | keep motion values outside render state; lint gate catches misuse |

## 9. Deliverables

- `src/motion/` — the 8 primitives in §4.1.
- Updated section components (§5), each keeping its CSS Module.
- `src/App.jsx` / `src/main.jsx` wiring (§4.2).
- New deps in `package.json`: `lenis`, `framer-motion`, `ogl`.
- `CLAUDE.md` updated: relaxed animation-library rule, `src/motion/` primitives,
  per-section motion notes, performance budget.
- `ISSUES.md` updated with any tracked follow-ups.

## 10. Out of scope / follow-up phase

- Rolling the motion system onto `/services`, `/about`, `/contact`, and case studies.
- Any dark or hybrid theming (explicitly rejected for this phase).
