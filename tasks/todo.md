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

## Animated ServiceShowcase vignettes (2026-07-13, user request)
Replace the 4 static webp images in the ServiceShowcase stage with coded,
theme-token-driven animated vignettes ("awwwards-worthy" bar, all 4 animated,
flawless hover crossfades). Context for a fresh session:
- Stage is `aria-hidden`, driven by `active` index from ledger hover/focus.
- Both ink modes must work → color ONLY from tokens (`--accent`, `--text*`,
  `--hairline`, `--bg-raise`, `--grid-line`, `--surface*`). Traffic dots exempt.
- Pure CSS animation (keyframes gated on active class + transitions for entry
  stagger; transform/opacity only) + one rAF-lerp pointer-parallax hook.
  NO framer-motion (removed) — anime.js exists but CSS is the right tool here.
- Reduced motion: blanket animation/transition kill inside the module.
- `/img/services/*.webp` STILL used by `pages/Services.jsx` — keep files.
- [x] Survey code (ServiceShowcase, theme-ink, motion layer, lessons)
- [x] `src/sections/ServiceVignettes.jsx` — 4 scenes (web/app/mobile/ai),
      metric chips from `TERMINAL_FRAMES` (parallax hook moved to
      `src/hooks/useStageParallax.js` for the react-refresh lint rule)
- [x] `src/sections/ServiceVignettes.module.css` — scenes, loops, entry
      choreography, depth layers, reduced-motion kill
- [x] Rewire `ServiceShowcase.jsx` — scenes replace `<img>` stack, parallax
      ref, touch auto-cycle (IO-gated interval, hover:none only)
- [x] `ServiceShowcase.module.css` — stage blueprint grid + bloom, size
      container (cqw/cqh), token stage-index badge, dropped stageImg rules
- [x] Verify: lint + build clean, Playwright sweep — all 4 scenes, hover
      crossfade, parallax var check, BOTH themes, 320/375/768/1280 (no
      h-scroll), reduced motion static render, 0 console errors
- [x] Update CLAUDE.md + ISSUES.md + lessons.md (%-padding-on-absolute trap)
- [x] Round 2 (user feedback): frameless stage — stage border/bg/radius
      removed, scenes float on the page canvas and fill the column (window
      insets 4–6%, phone 42% wide, bigger AI core); spark endpoint dot moved
      from the stretched `preserveAspectRatio="none"` svg (rendered as an
      ellipse) to an HTML span — always a perfect circle. Re-verified:
      lint/build, 4 scenes both themes, 375/768, no h-scroll, 0 errors.

## Decisions log
- Direction: "Deep Ink" dark (user-picked) → 2026-07-13: user asked for LIGHT as default with dark-mode toggle in Nav. anime.js only on home (user-picked).
- Fonts: **Satoshi** (display 900 + body) / JetBrains Mono. Clash Display and Cabinet Grotesk both dropped — user font feedback.
- 2026-07-13 (round @ 65fb2ff): hover text-shift effects BANNED site-wide (user: "looks horrible"); no em dashes in copy ("AI slop"); full logo (chevron + wordmark) in Nav+Footer via --logo-ink; footer got Chennai/London office tabs (London = 71-75 Shelton St temp address); portfolio pills 3 distinct recipes; services imagery regenerated with STUDIO (photoreal cinematic) style.
- 2026-07-13 (antigravity round): hero headline TYPES in char-by-char (antigravity.google-style) with teal caret riding the text edge; interactive canvas speck field w/ mouse repulsion + trailing teal glow follower (HeroParticles.jsx); 2nd headline line offset REMOVED (user: "disoriented"); body/labels font → **Inter**, headings stay Satoshi (user request).
- User 2026-07-13: "enhancing ≠ revamping" — every section got a structurally new composition (see phases 3–6), committed @ b77a6c1.
- framer-motion fully removed (only home used it; other routes never did).
- Old work committed to feature/homepage-motion @ c097b9a before branching.

## 2026-07-14 — Process ("How we work") total revamp + DottedSurface WebGL background
User: section "looks bad" — entirely revamp it, and integrate the 21st.dev
`dotted-surface` component (three.js animated dot wave) as its background.
Adaptation notes: project is Vite+React JS (no Next/Tailwind/TS/shadcn), so the
TSX/Tailwind/next-themes component is RECREATED in Tekniik idiom: JSX + CSS
module, tokens from theme-ink.css, no next-themes (section lives on the navy
`--band`, which is identical in both ink modes). `three` installed; scene is
lazy-loaded (IO + idle gate) so the main bundle stays lean (lesson: lazy-load
heavy WebGL deps). Skipped `next-themes` (Next-only, no consumer).

Design: "Phase horizon" — full-bleed brand-navy band (matches Portfolio/
FinalCta navy moments). Dot wave rolls behind, edge-faded via CSS mask,
periwinkle dots + navy fog. Content: 06 | HOW WE WORK head, then 4 phases as
an asymmetric descending staircase (desktop), each with a top hairline whose
teal fill draws in sequentially from scroll progress (horizontal take on the
signature rail), mono PHASE NN + duration, ghost stroke number, Satoshi title,
dim desc. Reduced motion: no canvas (static CSS dot texture), rails filled.

- [x] npm install three
- [x] src/components/DottedSurface.jsx (gate wrapper: IO + requestIdleCallback
      + reduced-motion skip, static dot fallback) + DottedSurfaceScene.jsx
      (lazy three.js scene: container-sized, ResizeObserver, DPR cap 2,
      pause offscreen, full dispose cleanup) + DottedSurface.module.css
- [x] Rewrite src/sections/Process.jsx + Process.module.css (band section,
      staircase grid, sequential rail fill via useScrollProgressInk,
      hover lift pointer-fine only, ≤960 2-col / ≤640 1-col, copy verbatim)
- [x] npm run build + npm run lint clean
- [x] Playwright sweep: 320/375/768/1024/1280/1600, both ink modes, reduced
      motion, console errors, no h-scroll; delete screenshots after
- [x] Update CLAUDE.md (Process section, stack: three) + ISSUES.md + todo

## FinalCta — 21st.dev "BackgroundPaths" integration (2026-07-14)

User pasted 21st.dev BackgroundPaths (Tailwind + framer-motion + shadcn) and
asked to use it as the last CTA section of the homepage. Project has NO
Tailwind/TS/shadcn/framer-motion (removed) — recreate in-idiom instead:
keep existing FinalCta content/heading/CTA, add the flowing-paths animated
SVG background as a new layer (two mirrored path fans, white + teal),
pure CSS stroke-dash animation, IO-gated (paused offscreen), reduced-motion
static fallback. No new npm deps.

- [x] FlowingPaths subcomponent in src/sections/FinalCta.jsx (path geometry
      from the 21st.dev formula, deterministic durations/delays, pathLength=1)
- [x] FinalCta.module.css: .flow layers, flowDash/flowFade keyframes,
      play-state gating via useReveal(once:false), reduced-motion static
- [x] npm run build + npm run lint clean
- [x] Playwright visual check 375/768/1280 + reduced-motion, delete shots
- [x] CLAUDE.md FinalCta section updated

### Follow-up (2026-07-14): BackgroundPaths removed
User: animated paths read as a glitch. Removed FlowingPaths entirely from
FinalCta.jsx/.module.css; replaced with a pure-CSS `.section::before` teal
bloom (multi-stop radial, bloomBreathe transform/opacity 14s, reduced-motion
static). Build + lint + 375/1280 visual check clean.
- [x] Remove FlowingPaths + flow CSS + useReveal wiring
- [x] Add ::before bloom, smooth falloff (no banding)
- [x] Build/lint/screenshots verified, shots deleted, CLAUDE.md updated
