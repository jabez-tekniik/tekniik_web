# Hero redesign v2 — Tekniik

## Goal
Replace the Home hero with a **modern gradient-driven, illustrated, image-filled** composition. Zero structural or visual overlap with `references/tekniik-prototype-v4.html`. Content reused verbatim from `src/data/content.js`. No monospace font in the hero. No editorial / print cues (no hairline rails, no "ISSUE 04" indices, no `// labels`, no dot grid).

## What we are explicitly NOT doing
- No two-column split with text + terminal mockup (that's the HTML).
- No JetBrains Mono in any hero element.
- No editorial / magazine cues. No `//` slashes, no hairline divider rails, no issue numbers.
- No solo dark terminal device.
- No big stat-pill marquee underneath.

## New direction — "Aurora Bento Showcase"
A modern SaaS-style hero in the language of Linear / Vercel / Resend / Magic UI Pro: a soft aurora gradient atmosphere, a large gradient-filled headline, and a glassy bento grid of illustrated capability cards using the four already-generated service illustrations. Premium, vivid, illustrated — and clearly NOT a port of the HTML.

### Visual layers (back to front)
1. **Page background** — `var(--bg)` near-white.
2. **Aurora atmosphere** — large soft radial blooms in indigo `#5B5BFF`, violet `#8B6BFF`, and warm pink `#FF8AB6` placed top-left, top-right, and bottom-center; very low opacity (0.32–0.42), heavy blur (~140px). Adds depth without competing.
3. **Existing ShaderBackground** — kept (waterPlane), but its mask is loosened from the current "horizontal split" to a soft full-bleed atmospheric cap with a centered radial dim so the headline stays readable. Continues to skip on `<960px` and on reduced-motion.
4. **Conic ribbon** — a single slow-rotating conic-gradient ring sitting behind the bento grid; very subtle, ~6% opacity, 60s rotation, paused on reduced-motion. Acts as a signature aurora moment.
5. **Foreground content** — eyebrow pill, headline, sub, CTAs, trust strip, bento.

### Above-the-fold composition (top → bottom, all centered)

1. **Eyebrow gradient pill**
   - Soft gradient surface `linear-gradient(135deg, rgba(91,91,255,0.10), rgba(190,140,255,0.10))`, hairline border `rgba(91,91,255,0.20)`, 4px indigo dot on the left, label `Build with Tekniik — Web · Apps · AI`.
   - Sora, weight 500, 13px, no uppercase, no letter-spacing eyebrow treatment.

2. **Display headline** — full string "Technology built right." (the existing `HERO.headline` array joined with spaces).
   - Sora, weight 800, `clamp(3.25rem, 7vw, 6.75rem)`, line-height 1.02, letter-spacing -0.045em.
   - Phrase "built right." rendered with a multi-stop **gradient ink fill** (`linear-gradient(120deg, #5B5BFF 0%, #8B6BFF 50%, #FF8AB6 100%)`), `-webkit-background-clip: text`, slight `text-shadow: 0 1px 0 rgba(255,255,255,0.4)` to keep edges crisp on the gradient atmosphere.
   - Word-by-word entrance: each word rises with a vertical-mask reveal on a 70ms stagger.
   - On reduced-motion: full text static, no entrance.
   - Visually-hidden full-sentence span for screen readers (so the per-word split doesn't fragment SR reading).

3. **Sub copy** — the existing `HERO.sub` string. DM Sans, 17px, line-height 1.7, max-width 580px, centered, body grey.

4. **CTA row** — `Get a Quote →` (primary, indigo gradient fill button) + `See how we work →` (ghost, hairline border, indigo on hover). Reuses `Button` component. On mobile they stack and span 100%.

5. **Trust strip** (replaces the current ONLINE pill)
   - Three small overlapping circular avatars on the left (gradient indigo→violet→pink to match the language; no real photos so we don't need a privacy story).
   - Inline 5-star row (filled SVG stars in indigo gradient) + the string "**4.9** from 50+ projects".
   - Region tag "UK · Remote" with a tiny indigo location glyph.
   - All text Sora 13px, body colour. No mono. No `//` glyphs.

### The visual centerpiece — `ServiceShowcase` bento (replaces Terminal entirely)

Below the trust strip on desktop, an **asymmetric 4-card glass bento grid** using the four already-generated webp service illustrations from `public/img/services/`:

```
┌───────────────────┬──────────┐
│                   │   apps   │
│     websites      │          │
│                   ├──────────┤
│                   │  mobile  │
├───────────────────┴──────────┤
│            ai                 │
└───────────────────────────────┘
```

- Desktop grid: `grid-template-columns: 1.4fr 1fr; grid-template-rows: 1fr 1fr;`. Websites spans 2 rows (left), apps + mobile stack on the right, ai spans the full bottom row. Gap 16px.
- Tablet: 2×2 even grid.
- Mobile: 1-column stack, smaller heights.
- Each card:
  - Rounded `var(--r-2xl)` (24px).
  - Full-bleed `<img>` from `/img/services/{websites|apps|mobile|ai}.webp` (`object-fit: cover; transform: scale(1.0)` baseline).
  - Bottom-up gradient scrim `linear-gradient(to top, rgba(10,15,28,0.65), transparent 55%)` so the label reads.
  - Label group at bottom-left: capability name (Sora 600, 18–22px, white) + 1-line description (DM Sans, 13px, white 80%) — descriptions sourced from the existing `CAPABILITIES.items` content (`websites/apps/mobile/ai`).
  - Top-right: small gradient chip with an arrow glyph `→`.
  - Layered shadow: `0 32px 60px -28px rgba(91,91,255,0.34), 0 14px 36px -18px rgba(10,15,28,0.10)`, plus a 1px gradient hairline highlight on the top edge (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.55)`).
  - Hover: `transform: translateY(-6px)`, image scale to 1.04, shadow intensifies. 280ms `var(--ease)`. Reduced-motion: no hover transform, only colour change.
  - Each card is a `<Link>` to `/services` (or to the future per-service section once we build it).
- Bento entrance: 80ms staggered scale+fade reveal driven by `useReveal` (already in the codebase).

The bento becomes the dominant visual moment — illustrated, image-filled, gradient-edged. It replaces the Terminal mockup entirely.

### Below the hero (replaces `Marquee`)

Replace `Marquee` (which currently apes the HTML stat-pill scroller) with a clean **`LogoStrip`** row:
- Eyebrow text "Trusted by teams shipping at" (Sora 13px, body grey, centered).
- Below it: 6 placeholder "logo" tokens rendered as muted indigo wordmarks on a hairline-bordered row (since we don't have real client logos). Each token is a soft pill: rounded, very low-contrast border, body-grey label. Static, not animated. If real logos arrive later, we swap them in with one prop change.
- Sits in its own thin section, below the hero, above `Problem`.

If the user prefers we keep the stat numbers (50+ / 98% / 4.9 / Senior team / AI-native / Long-term) instead of placeholder logos, the `LogoStrip` can render them as simple text-pill chips — same component, different prop. Will confirm at execution time if the placeholder direction feels off.

## Components

### New
- `src/components/HeroBadge.jsx` (+ CSS) — gradient pill eyebrow with indigo dot + label. Sans only.
- `src/components/GradientHeadline.jsx` (+ CSS) — composes the headline string with a per-word reveal and an explicit gradient-fill range (`<span class="ink">built right.</span>`). Reduced-motion safe.
- `src/components/TrustStrip.jsx` (+ CSS) — avatars + stars + rating + region.
- `src/sections/ServiceShowcase.jsx` (+ CSS) — the 4-card bento using the existing webps and `CAPABILITIES.items` copy.
- `src/components/LogoStrip.jsx` (+ CSS) — the trust band (logos or stat chips).

### Modified
- `src/components/Hero.jsx` — full rewrite. Drops `Terminal`, drops the split, composes the new centered showcase and renders `<ServiceShowcase />` inline as part of the hero block.
- `src/components/Hero.module.css` — full rewrite. Centered editorial-free composition, fluid type, aurora layer, conic ribbon, no dot grid.
- `src/components/ShaderBackground.module.css` — replace the horizontal split mask on `.hero` with a soft full-bleed mask (centered radial dim of ~30% in the headline band so type stays legible). Keep the `<960px` skip.
- `src/pages/Home.jsx` — swap `<Marquee />` for `<LogoStrip />`.
- `src/styles/global.css` — keep the dot grid CSS variable but remove its application from the hero (Hero will not render the `.grid` div).

### Deleted
- `src/components/Terminal.jsx`, `Terminal.module.css` — capability cycling moves into the bento (each card is one capability).
- `src/components/Marquee.jsx`, `Marquee.module.css` — replaced by `LogoStrip`.
- `MARQUEE` export in `src/data/content.js` — unused after the swap.

### Untouched
- `HERO` content in `data/content.js` — every word reused (eyebrow, headline, sub, primaryCta, ghostCta, trust string).
- `CAPABILITIES.items` — its `desc` lines feed the bento card subtitles.
- All other Home sections (Problem, Capabilities, Process, Portfolio, Testimonial, FinalCta) — left as-is.
- `Button`, `Reveal`, `Icon`, `Eyebrow` — reused.

## Imagery
- **Reuse** the four existing 1280×960 webps in `public/img/services/{websites,apps,mobile,ai}.webp`. They were generated for the Services page and fit the bento aspect ratios well; no new generation required for v2.
- If after first render we decide the bento needs hero-specific imagery (e.g. wider 16:9 frames or a single hero collage), we'll add a manifest entry to `scripts/generateTekniikImages.js` and regenerate — but only if the reused set looks weak in context. Default plan: reuse, don't regenerate.

## Motion budget (≤ 1s total entrance)
- Aurora layer: static (no animation).
- Conic ribbon: 60s rotation, low opacity. Disabled on reduced-motion.
- Headline words: vertical-mask rise, 520ms each, 70ms stagger, ease `var(--ease)`.
- Eyebrow → 240ms fade-rise, 0ms delay.
- Sub copy → 280ms rise, 320ms delay.
- CTAs → 280ms rise, 420ms delay.
- Trust → 280ms rise, 520ms delay.
- Bento → 80ms staggered scale+fade per card via `useReveal`, fires when scrolled into view.
- All on `transform`/`opacity` only. All collapsed under `prefers-reduced-motion: reduce`.

## Responsive
- 1281+ : full bento layout (1.4fr / 1fr asymmetric grid), aurora full strength, headline ~6.75rem.
- 1024–1280 : same bento, headline ~5.5rem, gaps tighten.
- 768–1023 : bento becomes a 2×2 even grid; aurora keeps; headline ~4.25rem; trust strip wraps gracefully.
- 481–767 : single-column bento stack with each card at ~aspect-ratio 4/3; headline ~3.5rem; CTAs stack 100%.
- 360–480 : same single column, headline ~3rem; trust strip 2 lines.
- ≤360 (Fold folded) : same single column, headline ~2.5rem, no horizontal scroll, paddings collapse.
- All breakpoints: hero respects `min-height: 100vh` only on ≥1024 (else flows naturally so bento doesn't get crushed).

## Accessibility
- One `<h1>` for the headline; visually-hidden span re-states the full sentence so per-word splitting doesn't fragment SR reading.
- Bento cards: each is a real `<a>` with descriptive accessible name like "Websites — high-converting marketing sites"; `<img>` carries an existing alt from the IMAGES map already in `Services.jsx` (we'll reuse those alt strings).
- Star row: `aria-label="Rated 4.9 out of 5 from 50+ projects"`; visual stars are `aria-hidden`.
- Avatars: `aria-hidden`. They're decorative.
- Gradient text contrast: the gradient fill peaks at indigo `#5B5BFF` (4.7:1 on `#FAFBFD`) and dips to pink `#FF8AB6` (≈3.9:1, below AA at small sizes — only used at display size ≥48px so it qualifies as large text and meets the 3:1 large-text bar).
- Focus rings: existing `--focus-ring` on every CTA + bento card.

## Quality gates
- `npm run build` succeeds.
- `npm run lint` passes.
- `python tasks/qa-test.py` — 0 console errors, 0 horizontal scroll regressions across 320/414/768/1280/1600.
- Manual sweep: 320 / 414 / 768 / 1024 / 1280 / 1600. Reduced-motion toggle on/off. Tab through hero — focus order matches visual order.
- Update `CLAUDE.md` (Hero section + remove Terminal/Marquee references) and `ISSUES.md`.

## Steps (execute order)
1. Get user approval on this plan.
2. Build `HeroBadge` (gradient pill).
3. Build `GradientHeadline` (gradient ink range + word stagger + reduced-motion path + SR-only full sentence).
4. Build `TrustStrip` (avatars + stars + rating + region).
5. Build `ServiceShowcase` bento (4-card glass grid using existing service webps + CAPABILITIES copy + asymmetric desktop layout / 2×2 tablet / 1-col mobile).
6. Build `LogoStrip` (placeholder logo or stat-chip mode via prop).
7. Update `ShaderBackground.module.css` `.hero` mask → soft full-bleed atmospheric cap with centered radial dim.
8. Add aurora-layer + conic-ribbon CSS to `Hero.module.css`. Remove dot-grid usage from hero.
9. Rewrite `Hero.jsx` + `Hero.module.css` to compose: aurora → ribbon → eyebrow badge → gradient headline → sub → CTAs → trust strip → bento.
10. Wire `LogoStrip` into `Home.jsx`; remove `Marquee` import.
11. Delete `Terminal.jsx`, `Terminal.module.css`, `Marquee.jsx`, `Marquee.module.css`, and the unused `MARQUEE` export.
12. `npm run build` + `npm run lint` — fix anything that surfaces.
13. Run QA harness. Capture pass/fail across 5 viewports.
14. Update `CLAUDE.md` + `ISSUES.md` (architecture: ServiceShowcase, LogoStrip, removed Terminal/Marquee, mono no longer used in hero).
15. Reduced-motion check. Tab-order check. Contrast check.
16. Cleanup: delete screenshots, prune dead CSS, remove unused imports.

## One open question for the user
- LogoStrip mode: do you have real client logos you'd like to drop in, or do you want me to render the existing stat numbers (50+ / 98% / 4.9 / Senior team / AI-native / Long-term) as soft pills instead? Default if no answer: stat-chip mode, since we have real numbers and no real logo assets yet.

## Lessons captured
- v1 plan committed to an editorial/mono direction — user rejected. The constraint is **modern + gradient + illustrated + image-filled**, NOT print/editorial.
- Mono usage is reserved for code-adjacent contexts (Terminal-style chrome, the `// stack` rows on the Services page). The hero is a *marketing surface* and reads better in pure Sora + DM Sans with a single gradient ink moment.
- Existing service webps are reusable assets — favour reuse over regeneration unless visually weak in new context.
