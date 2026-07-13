# Tekniik — "Deep Ink" homepage rebrand (branch: feature/homepage-rebrand)

Spec: `docs/superpowers/specs/2026-07-13-homepage-deep-ink-rebrand-design.md`
Copy verbatim from `src/data/content.js`. Non-home routes untouched.
Brand: navy `#202E5D` + teal `#72CCD6` from `src/images/brand/`, neutrals black/grey/white.
(Previous round's todo was fully complete and is preserved in git @ c097b9a.)

## Phase 1 — Scaffold
- [x] `npm i animejs`
- [x] `src/styles/theme-ink.css` — full ink token set (`:root[data-theme='ink']`)
- [x] `index.html` — Fontshare display face + Satoshi + JetBrains Mono
- [x] `App.jsx` — home route sets `data-theme="ink"` (replaces `light`)
- [x] `src/motion/ink/` — useInViewOnce, WordRise, useMagneticInk, useScrollProgressInk, riseIn/setRiseHidden
- [x] framer-motion + ogl fully removed; framer-free `components/Reveal.jsx` for other routes

## Phase 2 — Nav + Hero
- [x] `BrandLogo.jsx` — inline new logo-icon paths (token-recolored) + wordmark; used in Nav + Footer
- [x] Nav ink styling (transparent → glass hairline on scroll)
- [x] Hero rebuild: mask-reveal headline + teal caret, blueprint grid + drawn signal trace, magnetic CTA, mono meta bar, proof ticker kept (full-bleed marquee)

## Phase 3 — ServiceShowcase + Numbers band (REVAMPED LAYOUTS @ b77a6c1)
- [x] ServiceShowcase → "Capability index": interactive ledger rows driving a sticky crossfading image stage
- [x] LogoStrip → full-bleed instrument band: mono meta rail + hairline-divided giant count-up readouts

## Phase 4 — Problem + Why (REVAMPED LAYOUTS @ b77a6c1)
- [x] Problem → "The verdict": oversized WordRise statement, offset editorial paragraph column, split comparison ledger (before ✕ hatched / after ✓ teal-lit on one hairline)
- [x] Why → "The ledger": full-width hairline rows (num / principle / reason), no cards

## Phase 5 — Process + Portfolio (REVAMPED LAYOUTS @ b77a6c1)
- [x] Process → "Chapters": sticky head + vertical scroll-drawn teal rail, node ignition (anime/rAF)
- [x] Portfolio → giant OUTLINED ghost numerals behind rows, bigger titles, navy hover invert + cursor parallax kept

## Phase 6 — Testimonial + FinalCta + Footer (REVAMPED LAYOUTS @ b77a6c1)
- [x] Testimonial → asymmetric spread: teal glyph + attribution rail | oversized display quote
- [x] FinalCta → left-anchored navy crescendo, brand-chevron watermark, hairline action row
- [x] Footer ink pass + new logo

## Phase 7 — Imagery
- [x] svc-* prompts re-graded to INK style (navy-black, one teal signal), regenerated via Imagen 4 Ultra
- [x] Compressed webp via existing pipeline

## Type fix (user feedback @ b77a6c1)
- [x] Clash Display → Cabinet Grotesk 500/700/800; all-caps headings dropped for legibility

## Phase 8 — QA gate (mandatory before presenting)
- [x] `npm run lint` + `npm run build` (both pass; bundle 396.6 KB / 127.6 KB gz)
- [x] Breakpoint sweep 320/375/414/640/768/1024/1280 + 740×360 landscape — no h-scroll anywhere
- [x] Reduced-motion smoke test (all headings visible, rail filled), 0 console errors
- [x] Delete test screenshots
- [ ] Update CLAUDE.md + ISSUES.md (after user signs off on the design)
- [ ] User review of the revamped design — hero "more extreme" pass optional if requested

## Decisions log
- Direction: "Deep Ink" dark (user-picked). anime.js only on home (user-picked).
- Fonts: **Cabinet Grotesk** (display, 700/800, sentence case) / Satoshi / JetBrains Mono. Clash Display dropped 2026-07-13 — user: uppercase Clash was "a disaster for visibility".
- User 2026-07-13: "enhancing ≠ revamping" — every section got a structurally new composition (see phases 3–6), committed @ b77a6c1.
- framer-motion fully removed (only home used it; other routes never did).
- Old work committed to feature/homepage-motion @ c097b9a before branching.
