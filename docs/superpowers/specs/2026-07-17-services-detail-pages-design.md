# Services Detail Pages — Design

**Date:** 2026-07-17
**Status:** Approved (hub-vs-detail, case links, hero motion locked with user)
**Source of truth for copy:** `/content/tekniik-services-spec.md` (§Service Page: Custom Software / Web Platforms / Mobile Apps / AI Systems)

## Decision summary

1. **Hub stays.** `/services` keeps the immersive build-sheet. Each discipline
   section gains a quiet "Full details →" link to its detail page. No card-hub
   conversion.
2. **Case-study links: routed pages only.** Web Platforms → ScreenFix
   (`/case/autoscreen`), Mobile Apps → GlowBook (`/case/looqz`). Custom
   Software and AI Systems get no case-study block (spec marks it optional;
   CareGrid has no case page).
3. **One shared hero entrance** for all four sibling pages: new
   `motion/ink/RailRise.jsx` — distinct from WordRise/LineWipe/MaskRise/BlurRise,
   which are taken by existing pages.

## Routes

- `App.jsx`: one dynamic route `/services/:slug` → `pages/ServiceDetail.jsx`.
  Unknown slug renders `<NotFound />`.
- `INK_ROUTES` gains the four explicit paths
  (`/services/custom-software`, `/services/web-platforms`,
  `/services/mobile-apps`, `/services/ai-systems`) so they inherit Deep Ink.

## Data — `SERVICE_PAGES` in `src/data/content.js`

Object keyed by slug. Copy **verbatim** from the services spec. Shape:

```js
export const SERVICE_PAGES = {
  'custom-software': {
    eyebrow: 'CUSTOM SOFTWARE',          // meta-bar label
    headline: 'Custom software that runs your business.',
    problem: ['…'],                      // 1–2 paragraphs
    deliver: ['…', …],                   // bulleted list (7–8 items)
    approach: '…',                       // one paragraph
    cta: { text: "Let's discuss your software project.", button: 'Get a Quote' },
    sceneKey: 'app',                     // ServiceVignettes scene
    caseStudy: null,                     // or { kicker, title, desc, to }
  },
  …
}
```

Scene mapping (reuses existing `ServiceVignettes` scenes — no new imagery):
`custom-software`→`AppScene` · `web-platforms`→`WebScene` ·
`mobile-apps`→`MobileScene` · `ai-systems`→`AiScene`.

Case-study entries: `web-platforms` → `{ title: 'ScreenFix', to: '/case/autoscreen' }`,
`mobile-apps` → `{ title: 'GlowBook', to: '/case/looqz' }`; desc lines pulled
from the matching `PORTFOLIO` items' copy.

## Shared template — `pages/ServiceDetail.jsx` + `ServiceDetail.module.css`

Deep Ink idiom throughout (tokens only, node-dot meta bars, `NN / EYEBROW`
heads, hairline ledgers, ghost numerals).

1. **Hero** — meta bar: node + `SERVICES / <NAME>` eyebrow left,
   "← All services" breadcrumb link right (→ `/services`). Split below:
   headline left (RailRise entrance), the discipline's vignette scene right on
   a frameless blueprint stage (hub's stage treatment; ignites once via
   IntersectionObserver; stacks below the text ≤960px). **No subtitle** — the
   problem statement serves that role (spec).
2. **`01 / THE PROBLEM`** — editorial paragraph column behind a hairline rail
   (About-story pattern).
3. **`02 / WHAT WE DELIVER`** — ledger rows: mono `01…0N` index + text over
   hairlines (hub `specRow` pattern). Never a paragraph.
4. **`03 / OUR APPROACH`** — one paragraph closing on a teal-railed Satoshi
   pull-statement.
5. **Case study strip** (only where `caseStudy` exists) — slim card: mono
   `CASE STUDY` kicker, title + one-liner, "View case study →" `<Link>`.
6. **"Also explore"** — hairline row linking the other three services
   (spec's cross-navigation note).
7. **`FinalCta`** with the page's CTA copy (heading = `cta.text`,
   button = `cta.button`).

## Motion — `motion/ink/RailRise.jsx`

Whole-line rise (translateY ~14px) + fade — **no blur** (BlurRise/Contact owns
that) — then a 2px teal rail draws in (`scaleX` from left) under the headline
with an igniting node: the site's rail device promoted into the hero. Follows
the WordRise contract (`text`, `as`, `className`, `delay`); goes fully static
under reduced motion because `useInViewOnce` no-ops. transform/opacity only.

## Wire-up

- `CAPABILITIES[].to` in `content.js`: `app`→`/services/custom-software`,
  `web`→`/services/web-platforms`, `mobile`→`/services/mobile-apps`,
  `ai`→`/services/ai-systems` (homepage ServiceShowcase "Explore" links follow
  automatically).
- Hub `Services.jsx` `Discipline`: add "Full details →" text link beside the
  existing `/contact` CTA button. Mapping: `websites`→`web-platforms`,
  `apps`→`custom-software`, `mobile`→`mobile-apps`, `ai`→`ai-systems`.

## Out of scope

- Per-page `<title>`/meta description (spec SEO table): no head management
  exists site-wide; logged in ISSUES.md as a site-wide gap rather than bolted
  onto 4 pages inconsistently.
- Sticky sidebar variant of cross-navigation (spec offers it as an
  alternative; the "Also explore" row covers the need).

## Quality gates

- `npm run build` + `npm run lint` pass.
- Visual sweep 320/414/768/1024/1280/1600 — no horizontal scroll; touch
  targets ≥44px.
- 0 console errors with reduced motion on; each route renders; breadcrumb,
  case-study, hub and homepage links land on the right pages.
- Update `CLAUDE.md` (Routing + new Services-detail section) and `ISSUES.md`.
