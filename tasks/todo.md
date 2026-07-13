# Tekniik — "Deep Ink" homepage rebrand (branch: feature/homepage-rebrand)

Spec: `docs/superpowers/specs/2026-07-13-homepage-deep-ink-rebrand-design.md`
Copy verbatim from `src/data/content.js`. Non-home routes untouched.
Brand: navy `#202E5D` + teal `#72CCD6` from `src/images/brand/`, neutrals black/grey/white.
(Previous round's todo was fully complete and is preserved in git @ c097b9a.)

## Phase 1 — Scaffold
- [ ] `npm i animejs`
- [ ] `src/styles/theme-ink.css` — full ink token set (`:root[data-theme='ink']`)
- [ ] `index.html` — Fontshare Clash Display + Satoshi + JetBrains Mono
- [ ] `App.jsx` — home route sets `data-theme="ink"` (replaces `light`)
- [ ] `src/motion/ink/` — useInViewAnime, splitText, useCountUp, useMagnetic (anime), drawPath, typewriter
- [ ] Remove framer-motion after sections rewritten: LazyMotionProvider out of main.jsx, dep uninstalled

## Phase 2 — Nav + Hero
- [ ] `BrandLogo.jsx` — inline new logo-icon paths (token-recolored) + wordmark; use in Nav + Footer
- [ ] Nav ink styling (transparent → glass hairline on scroll)
- [ ] Hero rebuild: mask-reveal headline + teal caret, blueprint grid + drawn signal path, magnetic CTAs, mono trust, proof ticker decision (keep/kill)

## Phase 3 — ServiceShowcase + Signal band
- [ ] ServiceShowcase: terminal typewriter panel (TERMINAL_FRAMES) + hairline capability list, no framer
- [ ] LogoStrip → stat band with count-up (numeric-only filter stays)

## Phase 4 — Problem + Why
- [ ] Problem: editorial split, line reveals, double-bezel before/after (grey vs teal-lit)
- [ ] Why: mono-numbered hairline rows, stagger reveal

## Phase 5 — Process + Portfolio
- [ ] Process: scroll-drawn teal rail, sequential node ignition (anime/rAF, no framer)
- [ ] Portfolio: full-width rows, clip-path image reveal or row invert, hover physics

## Phase 6 — Testimonial + FinalCta + Footer
- [ ] Testimonial: word-stagger display quote (anime)
- [ ] FinalCta: navy #202E5D panel, teal pill CTA (button-in-button)
- [ ] Footer ink pass + new logo

## Phase 7 — Imagery
- [ ] Re-grade svc-* prompts (deep navy + cyan-teal, dark), regenerate via Imagen 4 Ultra (Nano fallback)
- [ ] Compress webp via existing pipeline

## Phase 8 — QA gate (mandatory before presenting)
- [ ] `npm run lint` + `npm run build`
- [ ] Playwright sweep (tasks/qa-test.py pattern): 320/375/414/640/768/1024/1280 + landscape; no h-scroll; touch ≥44px
- [ ] Reduced-motion smoke test, 0 console errors
- [ ] Delete test screenshots, dead code (framer-motion, home aurora leftovers)
- [ ] Update CLAUDE.md + ISSUES.md
- [ ] Self-review vs awwwards bar — present only if 95% satisfied

## Decisions log
- Direction: "Deep Ink" dark (user-picked). anime.js only on home (user-picked).
- Fonts: Clash Display / Satoshi / JetBrains Mono (replaces Inter Tight/Inter on home only).
- framer-motion fully removed (only home used it; other routes never did).
- Old work committed to feature/homepage-motion @ c097b9a before branching.
