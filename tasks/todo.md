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

# Services page — "Deep Ink" redesign (2026-07-15)

Homepage (/) is the design-system reference. Redesign non-home pages one by
one; Services first, show user before continuing to About/Contact/cases.
Copy stays verbatim from `SERVICES_PAGE` in `src/data/content.js`.

## Plan
- [x] `scripts/generateTekniikImages.js`: replace `page-services` entry with a
      STUDIO (navy #0A0E1A / teal #72CCD6) 3:4 portrait hero — sculptural
      floating glass-layer stack, no text/faces → `public/img/page/services-hero.webp`
- [x] Generate via Imagen 4 Ultra (`node scripts/generateTekniikImages.js --id page-services`)
- [x] `App.jsx`: ink theme (ink-light/ink + Nav toggle) scoped to `/` AND `/services`
      (INK_ROUTES set — grows as pages are redesigned)
- [x] Rewrite `pages/Services.jsx` + `Services.module.css` in Deep Ink idiom:
      1. Hero "index poster": mono meta bar + WordRise Satoshi headline
         (final line accent) + sub | new studio image right (sharp frame,
         hairline ring); below: 4-col anchor index strip (01–04, teal hover
         sweep, scrolls to each discipline)
      2. 4 discipline sections (ids: websites/apps/mobile/ai): scroll-drawn
         teal top rail, ghost stroke numeral, mono `/ key` eyebrow + badge,
         oversized title, lede, bullets as hairline spec-ledger rows, stack
         chips, CTA; studio image w/ floating TERMINAL_FRAMES metric chip;
         alternate image side; 04 (AI) inverted full-bleed navy band
      3. `notSure` interlude (bg-2 band, hairline action row)
      4. Shared FinalCta (SERVICES_PAGE.finalCta)
- [x] Both ink modes via tokens only; reduced-motion kill; transform/opacity only
- [x] Gates: `npm run lint` + `npm run build`, Playwright sweep
      320/375/414/640/768/1024/1280 both modes, no h-scroll, 0 console errors
- [ ] Delete screenshots; update CLAUDE.md/ISSUES.md after user sign-off

## Result
- Lint + build pass; Playwright sweep 320–1600 both ink modes: no h-scroll, 0 console errors; reduced-motion: all content visible, rails filled.
- New Imagen 4 Ultra hero: floating glass-layer stack (STUDIO, 3:4) at public/img/page/services-hero.webp.
- Awaiting user review before redesigning About/Contact/case pages.

## Iteration 2 (user feedback, 2026-07-15)
- [x] Hero top space removed (padding-top clamp(88px,9vw,120px))
- [x] Duplicate CTAs merged: interlude deleted; FinalCta now carries the
      page-specific `notSure` content (FinalCta is props-driven — each page
      passes its own close)
- [x] Static images dropped from content flow → homepage ServiceVignettes
      (coded animated scenes) hosted per discipline on frameless blueprint
      stages (IO-ignited once, pointer parallax, reduced-motion static)
- [x] services-hero.webp moved to hero BACKGROUND plate (edge-fade scrims,
      theme-aware overlay; 0.45 opacity wash ≤960px)
- [x] Color pass: tinted 02 band (--bg-2), theme-aware section blooms
      (--hero-glow-a/b), accent badge pills, spec-row teal hover sweep;
      .discDark now RE-SCOPES semantic tokens so vignette + all children
      adapt on the navy band
- [x] Index anchors → pure-JS scroll, no location hash (Lenis scrollTo w/
      -88px offset; scrollIntoView fallback under reduced motion)
- [x] Gates re-run: lint + build pass, sweep 320–1600 both modes clean,
      reduced-motion clean, anchor scroll verified in Playwright
- NOTE: public/img/services/*.webp no longer referenced by any page (kept —
      generated brand assets, prompts live in the manifest). See ISSUES.md.

### Iteration 3 (user feedback, 2026-07-15)
- [x] Hero image rejected → removed entirely (webp deleted, manifest entry removed)
- [x] Hero now runs a COMBINED vignette reel: all 4 discipline scenes on one
      frameless stage right of the poster, rotating every 5.2s (IO-gated,
      timer re-arms on manual change, reduced-motion → static first scene)
- [x] Index strip tracks the live scene (tint fill + accent label = "now
      showing"); hover/focus a row pins its scene; click still scrolls
- [x] Removed grey blueprint gridlines behind ALL vignette stages on /services
      (hero `.blueprint` + `.stage::before`); breathing teal bloom kept.
      NOTE: homepage ServiceShowcase stage still has its grid — untouched,
      ask user if it should go there too
- [x] Button looping hover (all solid/ghost variants incl. "Discuss your
      website"): sheen band sweeps the face on a 1.6s loop + arrow nudge loop
      for as long as hovered; navy-tint sheen on inverse, accent tint on
      ghost; hover:hover gated, reduced-motion killed
- [x] Gates: lint ✓ build ✓ QA CLEAN (reel cycles verified, hover animations
      verified attached, 8 viewports no h-scroll, 0 console errors)

### Iteration 4 (user feedback, 2026-07-15)
- [x] Hero vignette rebuilt from scratch — NOT the reused homepage scenes:
      new `ServicesOrbit` (src/sections/ServicesOrbit.jsx + module.css),
      a tech CONSTELLATION: 12 tech nodes (labels from real stack copy)
      grouped by discipline around a pulsing "tekniik" core
- [x] COLORFUL: new `--svc-{websites,apps,mobile,ai}` hue tokens in
      theme-ink.css (both modes; deepened for light canvas) — teal /
      periwinkle / amber / pink. color-mix derives soft/bloom shades
- [x] Keeps changing: focus discipline rotates every 5.2s — core label +
      hue, data beams (dash-flow SVG), ignited chips, satellite dots and
      the index-strip row all recolor together; rings spin, chips bob
- [x] Interactive: hover a chip → pins its discipline; hover the stage →
      reel holds; click a chip → hashless scroll to its section; index
      strip hover/focus pins too; pointer parallax layers
- [x] Reduced motion: static rings/chips, no pulse/bob/flow, focused
      state renders complete; a11y path = index strip (stage aria-hidden)
- [x] Gates: lint ✓ build ✓ QA CLEAN (cycle verified, chip hover pin +
      hashless chip-click scroll verified, 8 viewports no h-scroll,
      0 console errors); chip overlap at bottom fixed (Document AI /
      Swift·Kotlin repositioned)

### Iteration 5 (user feedback, 2026-07-15)
User: not a mind-map chart - a moving vignette that DEMONSTRATES software,
web apps, apps and AI automation; something creative with clear direction.
- [x] ServicesOrbit constellation DELETED (jsx + module.css)
- [x] New `ServicesShowreel` (src/sections/ServicesShowreel.jsx + module.css):
      one device shell MORPHS between four live product demos, each in its
      discipline hue (--svc-* tokens kept): 01 browser auto-scrolling a
      finished marketing site (skeleton page ~2.4 viewports tall, scrollbar
      thumb synced, media sheen) -> 02 web-app board whose hot card picks
      itself up and crosses three columns -> 03 shell narrows into a phone
      playing a chat->booking story (bubbles, typing dots, amber reply,
      confirmation card pop) -> 04 automation console processing a queue
      (staggered rows, hue progress fills, check pops, "auto-reply sent"
      toast). Backdrop: crossfading hue blooms + ghost numeral 01-04;
      floating result chips reuse TERMINAL_FRAMES copy
- [x] Shell morph = width/height/border-radius transition on a CHILDLESS
      div (documented exception to transform-only; the storytelling beat)
- [x] Services.jsx: reel interval 5.2s -> 6.6s (each demo tells a story);
      stage click scrolls hashlessly to the active section (.heroStage
      cursor pointer, generic accent bloom off - showreel brings its own)
- [x] Demo loops attach only under .demoOn (idle demos cost nothing);
      reduced motion renders active demo complete + static (typing hidden)
- [x] Gates: lint OK build OK; QA: 4 states + dark mode (localStorage value
      is 'dark', NOT 'ink' - init-script gotcha) + 375px verified by
      screenshot; stage-click scroll OK; 8 viewports no h-scroll; 0 console
      errors. Chat scaled up (gap/padding/line sizes, justify center) after
      first shots left the phone half-empty

### Iteration 5b (user feedback, 2026-07-15)
- [x] Ghost numerals 01-04 removed from the hero showreel backdrop
      (JSX spans + .gNum CSS deleted)
- [x] AI discipline band vs FinalCta band merged into one navy block:
      new `--band-deep: #141d40` token (theme-ink.css, both modes) and
      .discDark now uses it - the closing CTA keeps the brighter #202e5d
      so the seam reads as two sections. Verified both modes by screenshot
- [x] Gates: lint OK build OK, 0 console errors

### Iteration 5c (bug report, 2026-07-15)
- [x] REGRESSION FIX: the Gemini-style rotating multicolor ring on the nav
      "Get a Quote" hover disappeared - iteration 3''s Button.module.css
      sheen added overflow:hidden + a competing ::before to every .btn,
      which clipped the ring (it paints outside the face at inset:-2.5px).
      Nav.module.css now opts the CTA out: a.ctaBtn { overflow: visible },
      all ring selectors bumped to a.ctaBtn (0,1,2+) so they outrank
      .btn/.primary, transform:none guards against the parked sheen, and
      the RM block display:blocks the ring back (static). LESSON: adding
      base styles to a shared component (.btn) must be checked against
      per-instance overrides layered on top of it (nav CTA ring)
- [x] Gates: lint OK build OK, ring verified by hover screenshot both modes

## Iteration 6 — Mini CTA strips + About page ink redesign (2026-07-15)
- [x] `MiniCta` component (components/MiniCta.jsx + module): slim interstitial band — hairlines, accent-tint wash, teal node + mono kicker, Satoshi statement, primary Button. Copy in content.js `MINI_CTAS`.
- [x] Home: insert MiniCta after Problem and after Portfolio.
- [x] Services: insert MiniCta between discipline 02 (apps) and 03 (mobile).
- [x] About rewrite (pages/About.jsx + About.module.css from scratch, drop PageHeader/icons):
  - Hero: metaBar + WordRise split headline left, `about-hero.webp` photo right (KEEP the image — user), ink frame + floating stat chip, teal bloom; signals as 4-cell ledger strip under the split.
  - Story (01): sticky meta/heading left, paragraphs right, 3rd para as accent pull-quote.
  - Process (02): navy `--band` re-scoped section, 6 steps 3×2, scroll-drawn rail fills (useScrollProgressInk p*6−i), ghost numerals, "YOU GET" win lines.
  - Principles (03): 2×2 cells, 2px top border, hover accent + lift.
  - FinalCta (existing, ABOUT_PAGE.finalCta).
- [x] App.jsx: add '/about' to INK_ROUTES.
- [x] Gates: lint, build, both ink modes screenshots, 8-viewport no-h-scroll, 0 console errors; delete QA artifacts.

Iteration 6 shipped 2026-07-15: lint/build green, 0 console errors, no h-scroll
at 320-1440 on / /services /about, both ink modes verified. Also: nav items
(.link/.mobileLink) forced to 'Satoshi' (user request — --f-display is only
Satoshi on inked routes). Gotcha: Playwright full_page screenshots after
programmatic scrolling can stitch the page with dark-looking artifacts —
verify theme via data-theme/localStorage before diagnosing.

## Iteration 7 — Contact page ink redesign (2026-07-15)
- [x] Contact.jsx + Contact.module.css rewritten ("The open line"): poster hero
  (metaBar + WordRise headline + sub) + 3-cell status ledger (pulsing live dot);
  working spread = ledger form (mono labels, Satoshi input text, teal underline
  scaleX draw on focus-within — reset's --focus-ring box-shadow suppressed on
  .input since the underline IS the focus signal) | direct-lines ledger
  (Email/Careers/WhatsApp rows w/ tint sweep + arrow) + teal-railed office block;
  "What happens next?" promoted to closing brand-navy band, 4 scroll-lit rails
  (p*4−i). No FinalCta — the form is the page's CTA. PageHeader + icon chips
  dropped; sent-state button kept.
- [x] '/contact' added to INK_ROUTES.
- [x] Gates: lint ✓ build ✓ 0 console errors, h-scroll clean 320–1440, both
  modes + focus state screenshot-verified; QA artifacts deleted.
- contact-hero.webp now unused by any page (About keeps about-hero.webp).

## Iteration 7b — Contact aside polish (2026-07-15, user feedback)
- [x] Direct-lines values perfectly left-aligned: .lines is now a 3-col grid
  (max-content / 1fr / 20px) and each .line uses grid-template-columns: subgrid
  (minmax fallback declared first) — all values share one edge (verified
  x=987.42 for all three at 1440). ≤560px the rows stack label-over-value.
- [x] Office block → flag tabs (Chennai/London) mirroring the Footer tablist:
  shared OFFICES const extracted in content.js (FOOTER.offices now references
  it; CONTACT_PAGE.side.officeLines removed; UK lines lost the duplicate
  'United Kingdom' — country renders via .officeCountry/footer region instead).
  IconFlagIndia/IconFlagUK in 44px-min tabs, active = accent border +
  accent-tint; address swaps with 280ms officeIn rise (keyed remount), RM inert.
- [x] Gates: lint ✓ build ✓ 0 console errors, h-scroll 0 at 320/375, light +
  dark + mobile screenshots verified; QA artifacts deleted.

## Iteration 8 — distinct hero animations + Contact hero visual (2026-07-16)
- [x] Regression fix (user report): direct-lines hover arrow vanished — the
  subgrid change let .line's inline padding inset the 20px arrow track to ~4px
  and flex-squeeze the svg. Fixed: padding 14px 0 (comment in CSS), justify-self
  end + flex-shrink 0 on the arrow svg. Values still share one edge.
- [x] Hero headlines de-duplicated (user: "peek is boring"): Home keeps its
  typewriter; Services → motion/ink/LineWipe.jsx (clip wipe + teal printhead
  bar, inset() via anime proxy onUpdate); About → motion/ink/FlipWords.jsx
  (per-word rotateX flip-up w/ perspective); Contact → motion/ink/Decode.jsx
  (teal glyph scramble locking left→right, width-stable slot+overlay markup).
  Same API as WordRise (text/as/className/delay); all static under RM.
- [x] Contact hero right side filled: components/OpenLine.jsx (+ module css) —
  dot-grid chart, LON/CHE nodes + ping rings, arc draws in (createDrawable)
  then loops a signal-pulse segment (timeline loop). aria-hidden, ≤960 hidden,
  RM = fully drawn static arc.
- [x] Gates: lint ✓ build ✓ 0 console errors on all 3 routes, h-scroll clean
  320–1440 ×3 pages, dark + mobile + reduced-motion verified; shots deleted.

# CONTENT SPEC SYNC (2026-07-16) — align live site to finalized /content specs

Source of truth: `../content/*.md` (8 locked spec docs). Apply verbatim copy
into `src/data/content.js`, add new sections/pages in the existing Deep Ink
design system. User decisions (2026-07-16):
- Portfolio countries: apply spec EXACTLY + rewrite the two case studies
  (GlowBook France→UK, ScreenFix Germany→South Africa) so cards & case pages
  stay consistent. Affected testimonials realigned too.
- Services: build hub + 4 dedicated sub-pages (/services/<slug>).
- Legal: build 4 legal pages + working cookie-consent banner (GA stubbed).
- Sequence: HOMEPAGE FIRST (P1 this session), then new pages P2–P5.

## Phase 1 — Homepage sync + new sections — ✅ SHIPPED 2026-07-16
Result: lint ✓ build ✓ (bundle 459 KB / 147 KB gz). Playwright verified at 1280
+ 375, both ink modes: section order = Hero→Stats(03)→Problem(04)→What We
Engineer(05, Custom Software first)→MiniCta→Why(06)→Process(07, 5 phases)→
Portfolio(08, id="work", UK/South Africa tags)→MiniCta→Testimonial→
AI-Accelerated(10)→FinalCta. "See our work" smooth-scrolls to #work (lands at
+88px nav offset). AiAccelerated adapts both modes via tokens; no h-scroll; 0
console errors. QA screenshots deleted. Every checkbox below done.
Deferred to later phases (noted so not silent): CAPABILITIES `to` still → /services
(sub-pages land P2); footer legal links wired but pages land P4.
content.js:
- [ ] HERO: eyebrow → "Custom Software · Web Platforms · Mobile Apps · AI Systems";
      sub → "…design and engineer custom software, web platforms, mobile
      applications, and AI-powered systems…"; ghostCta → "See our work" (scroll
      to on-page #work); trust → "4.9★ · 50+ Projects · 98% Retention"
- [ ] TERMINAL_FRAMES labels → Custom Software / Web Platforms / Mobile Apps /
      AI Systems (FRAME_LABEL map in Hero.jsx)
- [ ] MARQUEE: add "8+ Industries Served"; label casing per spec (4 stats)
- [ ] PROBLEM: new blended empathy copy (2 paras)
- [ ] CAPABILITIES → "WHAT WE ENGINEER": heading "What we / engineer.", reorder
      Custom Software(app scene) / Web Platforms(web) / Mobile(mobile) / AI(ai),
      new descriptions, per-item `to` (→ /services for now, sub-pages in P2)
- [ ] WHY_TEKNIIK: copy tweaks per spec
- [ ] PROCESS: split 4→5 phases (Listen/Plan/Build/Launch/Support & Grow);
      heading "Predictable process. Predictable outcome."
- [ ] PORTFOLIO: countries → UK/South Africa per spec (all 8); fix descriptions
      that name old countries
- [ ] CASE_LOOQZ (GlowBook) geo rewrite France→UK (cities, name/quote)
- [ ] CASE_AUTOSCREEN (ScreenFix) geo rewrite Germany→South Africa (cities, €→R)
- [ ] TESTIMONIALS: realign CareGrid/GlowBook attributions to new countries
- [ ] MINI_CTAS: add homeServices (05b) + homeWork (08b) copy; keep services key
- [ ] AI_ACCELERATED: new content block (label/heading/sub/4 points/closing)
components:
- [ ] Home.jsx: reorder to spec (Hero → Stats → Problem → ServiceShowcase →
      MiniCta(05b) → Why → Process → Portfolio → MiniCta(08b) → Testimonial →
      AiAccelerated → FinalCta); renumber indices
- [ ] Renumber: ServiceShowcase 02→05, Why 05→06, Process 06→07, Portfolio 07→08
- [ ] Hero: "See our work" smooth-scroll to #work (reuse getLenis pattern)
- [ ] Portfolio section: add id="work"
- [ ] LogoStrip.module.css: 3→4 cell grid + responsive 2×2 / 1-col
- [ ] Process.jsx/.module.css: 5-column staircase, gentler drop, "Ongoing"
      open-end treatment; ≤960 2-col, ≤600 1-col
- [ ] NEW src/sections/AiAccelerated.jsx + .module.css: light teal-tinted 4-up
      grid (keeps FinalCta the single dark crescendo), index 10, tokens only,
      reduced-motion safe
- [ ] Footer legal links: wire real routes + add GDPR (also relevant P4)
- [ ] Gates: npm run lint + npm run build; Playwright sweep 320/375/414/640/768/
      1024/1280 both ink modes, no h-scroll, 0 console errors, reduced-motion;
      delete shots; update CLAUDE.md + ISSUES.md

## Phase 2 — About / Contact / Services copy + Services sub-pages
- [ ] ABOUT_PAGE: heading "The team behind the technology.", sub, principles
      reworded (Honesty first / Engineering over shortcuts), process 6→5 phases
      with "What you get" lines
- [ ] CONTACT_PAGE: minor copy alignment to spec
- [ ] Services hub: convert /services to card hub linking to 4 sub-pages
- [ ] NEW pages /services/custom-software, /web-platforms, /mobile-apps,
      /ai-systems (shared template: hero, problem, deliverables, approach,
      related case study, CTA, "also explore" bar); routes in App.jsx
- [ ] Update homepage CAPABILITIES `to` → sub-page routes
- [ ] Gates

## Phase 3 — /work (Portfolio page) + /support
- [ ] /work: hero, CareGrid featured full-width card, 7-card grid, bottom CTA
- [ ] /support: hero, "for clients" / "inherited a mess" / options, CTA
- [ ] Footer + nav wiring; routes
- [ ] Gates

## Phase 4 — Legal pages + cookie consent
- [ ] /privacy-policy /terms-of-service /cookie-policy /gdpr (shared LegalPage
      layout, ~720px, no hero, "Last updated: July 2026")
- [ ] Cookie consent banner (Accept/Reject/Manage, opt-in, remembered) + footer
      "Cookie Settings" link; GA4 gated behind consent (measurement ID stubbed)
- [ ] Footer legal links final; base light theme (not inked)
- [ ] Gates

## Phase 5 — /website-package standalone landing
- [ ] Not linked in nav/footer; 6 sections (hero+price, what's included, who
      it's for, how it works, FAQ accordion, CTA); noindex optional
- [ ] Intake form or mailto CTA; conversion event stub
- [ ] Gates

## Iteration 9 — subtle hero entrances + HeroThread (2026-07-16)
User feedback: Decode (Contact) + FlipWords (About) hero animations "look so unprofessional";
OpenLine hero visual "looks very bad and irrelevant".
- [x] About hero → `motion/ink/MaskRise.jsx` (whole-line masked rise, 900ms EASE_OUT, line2 delay 120)
- [x] Contact hero → `motion/ink/BlurRise.jsx` (opacity + y14 + blur10→0, 950ms, line2 delay 140)
- [x] Contact hero visual → `components/HeroThread.jsx` + module.css ("first reply" chat card:
      incoming bubble → typing dots crossfade → navy reply → "First reply · 21 minutes" stamp;
      typing is CSS opacity:0 by default so RM render has no overlap; ping + float keep it alive)
- [x] Deleted Decode.jsx, FlipWords.jsx, OpenLine.jsx, OpenLine.module.css (orphaned)
- [x] CLAUDE.md hero-animations section rewritten (subtlety rule recorded) + Contact hero paragraph
- [x] Gates: lint ✓, build ✓, 0 console errors, h-scroll 0 @320–1440, RM + dark verified, QA shots deleted
Rule going forward: hero entrances stay distinct per page but RESTRAINED — no scramble/flip/per-char effects.
