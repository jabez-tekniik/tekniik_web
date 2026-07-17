# Services Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the 4 spec'd service detail pages (`/services/custom-software|web-platforms|mobile-apps|ai-systems`) on one shared Deep Ink template, wired from the homepage and the `/services` build-sheet hub.

**Architecture:** One dynamic route `/services/:slug` → shared `ServiceDetail.jsx` template consuming a new `SERVICE_PAGES` map (spec copy verbatim). New `RailRise` hero entrance shared by the 4 sibling pages. Existing `ServiceVignettes` scenes reused per page. Hub stays the build-sheet; each discipline gains a "Full details →" link.

**Tech Stack:** Vite + React 19, react-router-dom, anime.js (`motion/ink`), vanilla CSS Modules, Deep Ink tokens.

**Spec:** `docs/superpowers/specs/2026-07-17-services-detail-pages-design.md`

## Global Constraints

- Copy **verbatim** from `/content/tekniik-services-spec.md` detail-page sections.
- Deep Ink tokens only — no hardcoded hex outside tokens/theme files.
- One CSS module per component; transform/opacity animations only; `prefers-reduced-motion` honored (useInViewOnce no-ops → static render).
- Hero entrance must be distinct from WordRise/LineWipe/MaskRise/BlurRise; subtle, no per-char effects.
- Touch targets ≥44px; no h-scroll 320–1600.
- Git: stage by explicit path only; no `git add .`; report commit hashes. Branch: `feature/content-spec-sync` (7 modified files in tree belong to a parallel session — never stage them: `CLAUDE.md`, `src/components/LogoStrip.*`, `src/data/content.js`*, `src/pages/About.*`, `tasks/todo.md`).
  - *`content.js` is BOTH parallel-modified AND needed by Task 1. Additions are additive (new export + `to` fields). Stage the whole file only after confirming with `git diff src/data/content.js` that the only hunks beyond ours are the parallel session's `NUMBERS_*` additions — if so, leave the file unstaged until final commit or stage with `git add -p`-style care; the executor must eyeball the diff before staging.

---

### Task 1: `SERVICE_PAGES` data + `CAPABILITIES[].to`

**Files:**
- Modify: `src/data/content.js` (append `SERVICE_PAGES` export after `SERVICES_PAGE`; update 4 `to` fields + comment in `CAPABILITIES`)

**Produces:** `SERVICE_PAGES` — object keyed by slug, each: `{ name, headline, problem: string[], deliver: string[], approach, cta: {text, button}, sceneKey, caseStudy: null | {kicker, title, desc, result, to} }`.

- [ ] Update `CAPABILITIES` items: `app`→`/services/custom-software`, `web`→`/services/web-platforms`, `mobile`→`/services/mobile-apps`, `ai`→`/services/ai-systems`; rewrite the stale "`/services` for now" comment.
- [ ] Append `SERVICE_PAGES` (copy verbatim from spec §Service Page sections; `sceneKey`: custom-software→`app`, web-platforms→`web`, mobile-apps→`mobile`, ai-systems→`ai`; caseStudy only on web-platforms→ScreenFix `/case/autoscreen` and mobile-apps→GlowBook `/case/looqz`, desc/result condensed from `PORTFOLIO` copy).
- [ ] Verify: `npm run build` passes. Commit `content.js` alone ONLY IF diff shows just our hunks; otherwise defer (see Global Constraints).

### Task 2: `motion/ink/RailRise.jsx`

**Files:**
- Create: `src/motion/ink/RailRise.jsx`

**Produces:** `<RailRise text as className delay />` (WordRise contract). Line rises 14px + fades (no blur), then a hairline rule below gets a teal segment drawn in (`scaleX` 0→1, origin left) + an igniting node. `data-rr-line`/`data-rr-fill`/`data-rr-node` hooks; `utils.set` in `init()`, `createTimeline` in `play()`; rail visuals inline via token vars (`--hairline`, `--accent`, `--accent-bloom`). Reduced motion: init never runs → static complete render.

- [ ] Write component (structure per spec §Motion). Verify with Task 3's page render.

### Task 3: `ServiceDetail` template + routes

**Files:**
- Create: `src/pages/ServiceDetail.jsx`, `src/pages/ServiceDetail.module.css`
- Modify: `src/App.jsx` (import; `<Route path="/services/:slug" element={<ServiceDetail />} />` before the `*` route; add the 4 paths to `INK_ROUTES`)

**Consumes:** `SERVICE_PAGES`, `RailRise`, `WebScene/AppScene/MobileScene/AiScene`, `useStageParallax`, `Reveal`, `FinalCta`, `NotFound`.

Template sections (Deep Ink idiom, per spec):
1. Hero: metaBar (node + `SERVICES / <name>` eyebrow | `← All services` Link to `/services`), split: `RailRise` h1 left / vignette stage right (IO-ignited once, `aria-hidden`, `container-type: size`, bloom `::after`; stacks under text ≤960px).
2. `01 / THE PROBLEM` — paragraph column behind hairline rail.
3. `02 / WHAT WE DELIVER` — specRow ledger (mono `0N` + text over hairlines, teal hover sweep), 2-col ≥820px.
4. `03 / OUR APPROACH` — teal-railed Satoshi statement block.
5. Case-study strip (conditional): kicker / title / desc / result + "View case study →" Link.
6. "Also explore" nav — hairline rows to the other 3 services (44px+ targets).
7. `<FinalCta heading={page.cta.text} ctaLabel={page.cta.button} />`.

Unknown slug → `return <NotFound />` (hooks declared before the early return). App.jsx keys the route div by pathname, so sibling navigation remounts cleanly.

- [ ] Write `ServiceDetail.jsx` per above.
- [ ] Write `ServiceDetail.module.css` — mirror hub patterns (metaBar/eyebrow/node/specRow/stage from `Services.module.css`; problem rail from About story). Both ink modes via tokens; RM kill block; breakpoints 960/820/560.
- [ ] Wire `App.jsx` routes + INK_ROUTES.
- [ ] Verify: dev server — all 4 routes render inked, `/services/nonsense` → NotFound; breadcrumb works. Commit new files + App.jsx.

### Task 4: Hub "Full details →" links

**Files:**
- Modify: `src/pages/Services.jsx` (add `detail` to META: websites→`/services/web-platforms`, apps→`/services/custom-software`, mobile→`/services/mobile-apps`, ai→`/services/ai-systems`; `Link` import; detail link in `ctaRow` beside the Button, `detailLinkDark` variant on the AI band)
- Modify: `src/pages/Services.module.css` (`.detailLink` mono teal link, arrow nudge on hover, ≥44px target; `.ctaRow` gets flex+gap if needed)

- [ ] Add links; verify all 4 land on the right detail page. Commit both files.

### Task 5: Gates + docs

- [ ] `npm run lint` + `npm run build` pass.
- [ ] Playwright sweep: 4 routes × 320/414/768/1024/1280/1600 × both ink modes — no h-scroll, 0 console errors; reduced-motion pass (headline + rail + scene static-complete); verify homepage Explore links, hub detail links, breadcrumb, case-study links, also-explore links.
- [ ] Delete screenshots.
- [ ] Docs: CLAUDE.md (Routing line + new "Service detail pages" section), ISSUES.md (per-page `<title>`/meta gap), tasks/todo.md (Phase-2 hub line corrected to "hub stays build-sheet" + checkboxes). NOTE: CLAUDE.md + todo.md are parallel-modified — append/edit surgically, never revert others' hunks.
- [ ] Commit docs + remaining files by explicit path; report hashes + file list.
