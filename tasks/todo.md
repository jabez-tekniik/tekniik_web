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

## Theme toggle + light default (user request @ 7728702)
- [x] `ink-light` theme (DEFAULT): paper canvas #f7f8fb, teal-ink accent #0e7c8c, same navy band moments
- [x] Dark `ink` theme kept; moon/sun toggle left of Get a Quote (Nav), persisted `localStorage['tekniik-ink-mode']`, visible on mobile
- [x] Display font → **Satoshi Black (900)**; Cabinet Grotesk dropped
- [x] Hero pushed harder: outlined ghost "built", offset 2nd line, brand-mark watermark, theme-aware glows
- [x] Verified: lint + build pass, both modes screenshot-checked, toggle + persistence tested, no h-scroll at 7 breakpoints

## Decisions log
- Direction: "Deep Ink" dark (user-picked) → 2026-07-13: user asked for LIGHT as default with dark-mode toggle in Nav. anime.js only on home (user-picked).
- Fonts: **Satoshi** (display 900 + body) / JetBrains Mono. Clash Display and Cabinet Grotesk both dropped — user font feedback.
- 2026-07-13 (round @ 65fb2ff): hover text-shift effects BANNED site-wide (user: "looks horrible"); no em dashes in copy ("AI slop"); full logo (chevron + wordmark) in Nav+Footer via --logo-ink; footer got Chennai/London office tabs (London = 71-75 Shelton St temp address); portfolio pills 3 distinct recipes; services imagery regenerated with STUDIO (photoreal cinematic) style.
- 2026-07-13 (antigravity round): hero headline TYPES in char-by-char (antigravity.google-style) with teal caret riding the text edge; interactive canvas speck field w/ mouse repulsion + trailing teal glow follower (HeroParticles.jsx); 2nd headline line offset REMOVED (user: "disoriented"); body/labels font → **Inter**, headings stay Satoshi (user request).
- User 2026-07-13: "enhancing ≠ revamping" — every section got a structurally new composition (see phases 3–6), committed @ b77a6c1.
- framer-motion fully removed (only home used it; other routes never did).
- Old work committed to feature/homepage-motion @ c097b9a before branching.
