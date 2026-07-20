# 2026-07-20 — Site-wide consistency pass (hero type / entrances / About vignette / ink case pages)

(Previous round — the Deep Ink homepage rebrand todo — was fully complete;
preserved in git history.)

User brief: every page must follow the Deep Ink design system (Satoshi
included); About's documentary photo replaced with a moving vignette; page-hero
titles max 3 lines via ONE shared font-size (content unchanged); home hero
keeps the typewriter, every other hero + section entrance becomes a simple,
professional fade; nothing aggressive.

## Plan

- [x] 1. `motion/ink/FadeIn.jsx` — shared entrance (opacity-only, ~650ms,
      EASE_OUT, WordRise contract: text/as/className/delay; static under RM).
      Add `--fs-page-hero: clamp(2.4rem, 4.6vw, 4rem)` to `tokens.css` and use
      it for the hero H1 on Services / About / Contact / ServiceDetail / cases.
      Services headline must flow naturally (inline spans, accent tail) so it
      wraps ≤3 lines instead of the forced 2×2 split.
- [x] 2. Swap entrances: LineWipe (Services), MaskRise (About), BlurRise
      (Contact), RailRise (ServiceDetail — keep the static teal rail, fade it
      with the line) → FadeIn. WordRise call sites (Problem statement, FinalCta
      heading, Testimonial first quote, AiAccelerated heading, Services
      discipline titles) → FadeIn. Delete LineWipe/MaskRise/BlurRise/RailRise/
      WordRise files.
- [x] 3. About vignette `components/HeroTeamBoard.jsx` (+module css): ink
      console card — header node + LIVE ping, cycling build/ship activity rows,
      Chennai↔London footer link with travelling pulse; slow float; tokens
      only; aria-hidden; RM = complete static state. Replace `figure.photo`.
      `about-hero.webp` becomes unused (note ISSUES.md, keep on disk).
- [x] 4. Case pages → Deep Ink: App.jsx inks ALL routes (remove INK_ROUTES).
      Rebuild CaseLooqz/CaseAutoScreen on an ink template: hero meta bar
      (CASE STUDY / NAME | ← All work), FadeIn H1 at --fs-page-hero, sub,
      stats signals ledger (StatBlock count-ups), discipline vignette stage
      (looqz→MobileScene, autoscreen→WebScene) instead of the cinematic webp;
      body: 01/THE CHALLENGE railed paragraphs, 02/WHAT WE BUILT specRow
      ledgers + 3-cell flow, 03/THE RESULT + teal-railed quote + ink tag
      pills; FinalCta. Rewrite CaseStudy.module.css in ink idiom. Delete
      PageHeader.jsx/.module.css (now unused).
- [x] 5. Gates: `npm run build`, `npm run lint`, browser sweep 1440/1280/768/
      414/320 (no h-scroll, heroes ≤3 lines, Satoshi on every route),
      reduced-motion sanity, update CLAUDE.md + ISSUES.md, delete scratch
      files/screenshots.

## Decisions

- Home hero keeps its poster scale + typewriter (user: "leave the hero
  section"); the shared `--fs-page-hero` applies to the interior page heroes,
  which were the 4-line offenders (Services + About measured at 4 lines @1440).
- Simple fade = opacity only. No translate, no blur, no masks, no per-word
  stagger anywhere outside the home typewriter. Scroll reveals stay on the
  existing gentle `Reveal` (fade + 16px rise, 700ms).
- Case-study visuals switch from off-palette cinematic renders to the coded
  discipline vignettes — the same premium device every other page uses.
- No git operations this round (uncommitted parallel work present: CLAUDE.md,
  ISSUES.md, index.html, tokens.css, public/fonts).

## Mid-round additions (user, 2026-07-20)

- [x] Satoshi: register EVERY shipped file (300-900 + italics) and use only
      real file weights — display 800→900, Satoshi-600→700 (Button, Footer).
      Computed-style audit across routes: zero synthesized weights.
- [x] Geography rule: no Chennai/UK/London company references outside
      /contact. About signal UK→Global, HeroBuildBoard footer →
      "One team / Always shipping", Footer location column → generic
      remote-first line + "Office details →" link (FOOTER.offices removed),
      index.html title/meta de-UK'd. Client geography (portfolio chips,
      case copy, testimonial attributions) intentionally kept as social
      proof — flag to user.
- [x] Bonus fix: 320px h-scroll on / (Testimonial nav → flex-wrap);
      full 7-route × 7-width sweep clean.

## Round 3 (user feedback, 2026-07-20 evening)

- [x] Footer: geography rule REFINED — addresses are fine, only narrative
      "development is UK/Chennai" copy is banned. Reverted the Location
      column to office tabs + address + flag (FOOTER.offices restored;
      .country at Satoshi 700). No explicit "Global/Remote-first" copy
      either — implied, not stated. CLAUDE.md section rewritten.
- [x] About signals → real numbers: 50+ Projects delivered / 10+ Years
      senior experience / 98% Client retention / 4.9★ Average client
      rating (★ via StarredText; consistent with MARQUEE).
- [x] ServiceShowcase wide-screen bug: pinned copy column was
      `flex-basis: clamp(340,34vw,540px)` with padding-left --edge INSIDE
      the border-box → ~190px text at 1904px. Now
      `calc(var(--edge) + clamp(360px,26vw,520px))`; desc reserve drops
      6→5 lines ≥1880px. Verified 499px content @1920, 5-line desc.
- [x] "Explore ai systems" → "Explore AI systems" (acronym survives
      toLowerCase; saved as global memory acronyms-stay-uppercase).
- [x] Spec review (new content/TK Website): missing pages reported to
      user — legal ×4 (footer already links → 404!), /work, /support,
      StoryNest case, /website-package landing. Assessment only, no build.

## Round 4 — missing pages via 5 parallel subagents (user-approved, 2026-07-20)

- [x] Legal ×4 (`Legal.jsx` + `legal.js` + module css; verbatim locked spec,
      no CIN, 720px column) → routes /privacy-policy /terms-of-service
      /cookie-policy /gdpr. Footer 404s RESOLVED.
- [x] /work (`Work.jsx`): navy featured CareGrid + 7-card grid off
      PORTFOLIO.items; route-carrying items link case pages, others show a
      non-interactive "View project →" (no dead links).
- [x] /support (`Support.jsx`): clients ledger / rescue tint band /
      3 arrangement cells / FinalCta "Get in Touch".
- [x] /case/famili StoryNest (`CaseFamili.jsx` + CASE_FAMILI appended to
      content.js from references/tekniik-prototype-v4.html, FamiliCloud→
      StoryNest; sceneKey mobile). PORTFOLIO famili item got `route`.
- [x] /website-package (`WebsitePackage.jsx`): £599 landing, specRow
      inclusions, navy rail steps, native details FAQ. Off-nav by design.
- [x] Integration (orchestrator): App.jsx 8 routes, Footer Pages col +
      Our Work + Support, Work.jsx CASE_ROUTES redundancy removed.
- [x] Bonus fixes: StatBlock "0Free" bug (raw passthrough for non-numeric
      stats); Services ghost numeral → behind-title watermark + section
      rhythm tightened (user: "01/02 placed properly", "much white space").
- [x] Gates: build ✓ lint ✓; 8 new routes + / /services /work swept at
      320–1280 (zero h-scroll, zero synthesized Satoshi weights); StoryNest
      counters verified (12,400+/340+/18/Free); dark AI section verified.
- [x] HeroBuildBoard footer (3 user iterations): ping-pong dot →
      one-way arrow → icon wave → FINAL: five 24px chips
      (Bulb/Pen/Code/Flask/Deploy — new Icon.jsx glyphs; rocket was
      mush at size, plane read as "send", tray-arrow not deploy-y →
      IconDeploy = canonical cloud-upload, per user) + a 2px teal line drawing start→end that ignites
      each chip as it passes (stays lit, holds complete, resets,
      repeats; 7.2s clock, bbStage1..5 explicit keyframes via
      nth-child). ≤480 chips 18px, ≤380 hidden; RM = finished run
      (line drawn, all lit). Verified live both modes + 280–640
      iframe sweep (no overflow, breakpoints confirmed).
- [ ] OPEN (needs user/later): cookie consent banner ships with analytics;
      per-page titles/meta still a site-wide gap; nav does not link /work
      or /support (footer only) — promote to nav if wanted.

## Round 5 — looping narrative vignettes (user, 2026-07-20 night)

User brief: (1) About board list needs MORE items (not 4), each shown
loading → shipped in sequence, repeating; (2) ALL hero vignettes must loop
with ≥3 narrative beats depicting what clients can expect — Contact thread
explicitly: 2 bubbles + "first reply 21 minutes", then another message, then
addressed, then resolved, repeat; (3) home AI-accelerated section must use
the WHOLE band, not just the right side — microchip + electron flow
depicting AI development.

Inventory: Services hero showreel already cycles 4 scenes; discipline
scenes (Web/App/Mobile/Ai) already loop perpetually — no change. Work/
Support/WebsitePackage heroes have no vignette. Home hero keeps typewriter
(user rule). Targets = About board, Contact thread, AI band.

- [x] 1. HeroBuildBoard: 6 ROWS, React `phase` cycle (-1 queued → 0..5
      in-build w/ bbLoad progress drawing over the 1.5s beat → 6 hold
      2.6s → reset, repeat); bbStateIn verdict swaps; RM = finished
      sprint (`shown = reduced ? ROWS.length : phase`). **Dropped
      `aspect-ratio: 4/3`** — content sizes the card (fixed box clipped
      rows+foot at ≤414 and ~1024, found via iframe sweep). Verified
      live: full cycle + reset both modes; 320–1280 sweep clean.
- [x] 2. HeroThread: two exchanges stacked in one grid cell, loop:true
      timeline — A (enquiry → typing → reply → "First reply · 21 min")
      fades up, B (bug report → typing → same-day fix → "Issue resolved ·
      same day"), hold, body fade, repeat. **Fix:** t=0 resets must be
      real explicit-from tweens, NOT .set() (sets fire once → phase A
      invisible on loop 2+). Static/RM = phase B resolved (.phaseA
      opacity 0 in CSS). Verified both exchanges across two loops, dark ✓.
- [x] 3. AiAccelerated: NeuralNet → full-band `AiCircuit` (1440×520,
      45°-step traces edge-to-edge, microchip w/ "AI" die + pin stubs +
      breathing core; slow dim electrons IN left, fast bright doubled
      electrons OUT right; `aib-*` ids vs hero `hc-*`). Hidden ≤900;
      RM static. Verified light+dark, electrons moving.
- [x] 3b. (user, same night) Card glyphs → lucide-language braces /
      scan-check / route / shapes (old chevrons/shield/pulse/star "old
      fashioned"); hover rebuilt: teal rail draws across top
      (.card::before scaleX 320ms), icon chip fills accent w/ bg-raise
      glyph + lift/scale/rotate(-4deg) pop. Verified via forced-hover
      style (Lenis fought synthetic scroll/hover), then cleaned up.
- [x] 4. Gates: build ✓ (3.15s) + eslint ✓; live loops watched on /,
      /about, /contact in both themes; iframe sweep 320–1280 on all
      three routes (no h-scroll); CLAUDE.md About/Contact/AiAccelerated
      sections rewritten; no scratch files left (screenshots in-memory
      only). Note: home page ignores scroll for ~8s during hero intro
      (Lenis + entrance) — pre-existing, not a regression.

## Round 6 — de-slop project-card hover + Contact status ledger (user, 2026-07-21)

- [x] 1. Project-card hover "AI slop" (user: homepage + /work). Homepage
      Portfolio was already reworked by a parallel session (12:07 AM —
      rail draw + teal wash, "ONE confident move" comment quotes the
      complaint); /work still ran the old pile-up (lift + border +
      shadow + rail + title underline + icon recolor). Ported the
      approved idiom to Work.module.css: `.card::after` accent-tint
      wash bleeds down after the rail draws, CTA nudge, `:active`
      scale(0.99) press; removed lift/shadow/border hover, dead
      `.titleInk` span+rules (Work.jsx too), and the no-op regionIcon
      recolor. Also deleted leftover `.featured .titleInk::after` from
      Portfolio.module.css. Verified via forced-hover computed styles
      (rail scaleX(1), wash opacity 1, gap 11px) — occluded-tab rAF
      stall blocked a visual screenshot; idiom is pixel-identical to
      the visually-verified homepage version.
- [x] 2. Contact hero status strip (user: "Available now… looks
      amateur, all three points put in a professional way + enhance
      design"). Flat mono-caps cells → signals-ledger hierarchy: mono
      label over Satoshi-700 value — Availability / "Open for new
      projects" (+ live dot) · First response / "Within one working
      day" (matches metaBar promise) · Discovery call / "30 minutes,
      no obligation"; hairline splits, first cell flush left, per-cell
      staggered Reveals; ≤640 stacks 1-col. Verified live light+dark;
      iframe sweep 320–1280 (1-col ≤640, 3-col ≥768, no overflow).
- [x] 3. Gates: build ✓ (3.14s) + eslint ✓ on Work.jsx/Contact.jsx;
      CLAUDE.md /work + Contact sections updated; no scratch files.
- [x] 4. (user) StoryNest "View case study" missing arrow: flex crushed
      the 13px icon to 0 in the tight small tile → `.ctaIcon
      { flex-shrink: 0 }` (Portfolio + Work css) and `.foot
      { flex-wrap: wrap }` so the CTA drops to its own line and the
      card grows instead of squeezing.
- [x] 5. (user) "Card with no case study smaller": bento spans now
      derived from data — `cellFor(item)`: featured→big 2×2,
      route→wide 2×1, rest→small 1×1; render order featured → routed
      → rest so 01–08 numbering matches the dense grid's visual order.
      Last row = two smalls + whitespace (intentional asymmetry).
      Verified via iframe geometry 1280/1024/640/375: all routed cards
      wide w/ 13px arrows, non-routed small, numbering sequential, no
      h-scroll. Build ✓ (4.23s) + eslint ✓.
- [x] 6. (user) About hero: "See our work" primary arrow Button → /work
      under the sub (`.heroCta`, Reveal delay 360 — mirrors Contact's
      hero CTA device; the story-section CTA stays too).
- [x] 7. (user, 4 iterations) Build board pacing + copy: STEP 1500→2600
      / HOLD 2600→3400 ("moves too fast"); "In build"→"Building";
      bbLoad 2.4s→1.9s so the full bar settles ~700ms before the row
      flips ("going to the next line is too quick"); verdicts stay
      "Shipped" EXCEPT the last row Launch review → "Deployed" (user
      corrected the all-Deployed first pass). Build ✓ (3.17s) +
      eslint ✓; user verifying in browser themselves (asked for no
      more claude-in-chrome calls).
- [x] 8. (user) Board row chips: fake team initials (SM/AR/KV/TS/NP/DK)
      "meaningless" → task-type glyphs: IconPen design / IconCode API /
      IconCard payments / IconGrid admin / IconFlask QA / IconDeploy
      launch. IconCard (credit card) + IconGrid (dashboard panels)
      added to Icon.jsx; `.who` chip keeps the 24px circle, 13px
      `.whoIcon` inside. Build ✓ (3.18s) + eslint ✓.
