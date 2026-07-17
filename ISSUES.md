# Issues

## Open

### HeroCircuit SVG traces overflow the viewport at 320px (low, pre-existing)
At a 320px viewport, `document.scrollWidth > clientWidth` — the culprits are the
decorative `HeroCircuit.jsx` SVG traces/electrons (elements ~300–500px wide
extending past the right edge), not page content. Surfaced during the star-icon
QA sweep (2026-07-14); unrelated to that change. No overflow at 414px+. Fix
candidates: `overflow-x: clip` on the hero, or size/mask the circuit layer to
the viewport at small widths.

### Footer legal links point at routes that don't exist yet (medium)
As of the 2026-07-16 content-spec sync the footer `// Legal` column
(`FOOTER.cols` in `src/data/content.js`) is wired to real routes
`/privacy-policy` `/terms-of-service` `/cookie-policy` `/gdpr` (per the legal
spec, which wants the links in place before the pages ship). Those routes don't
exist yet, so they currently hit NotFound. Building the 4 legal pages + cookie
consent banner is **Phase 4** of the content-sync plan (`tasks/todo.md`).

### No per-page `<title>`/meta description anywhere on the site (medium, SEO)
The SPA has no head management — every route shows the static `index.html`
title. The services spec ships an SEO table (unique meta title + description
per services page), and the same applies site-wide (Home/About/Contact/cases).
Deliberately NOT bolted onto the 4 new service detail pages alone (2026-07-17)
so it lands once, consistently: add a tiny `useDocumentTitle`/head hook (or
react-helmet-style module) covering ALL routes in one pass.

### `/img/services/*.webp` no longer used by ANY page (low)
The 2026-07-14 vignette revamp replaced the homepage ServiceShowcase image
stage with coded animated scenes (`src/sections/ServiceVignettes.jsx`), and the
2026-07-15 Services-page redesign hosts those same vignettes per discipline —
so the four service webp images are now completely unreferenced. Kept on disk
because they're paid Imagen 4 Ultra generations whose prompts live in
`scripts/generateTekniikImages.js` (`svc-*` entries); delete both together if
they stay unused once all pages are redesigned. (`page/services-hero.webp` was
DELETED 2026-07-15 with its manifest entry — the user rejected generated hero
imagery on /services; the hero now runs a combined animated vignette reel.)

### `page/contact-hero.webp` no longer used (low)
The 2026-07-15 Contact ink redesign dropped the full-bleed PageHeader, so
`contact-hero.webp` is unreferenced (About KEEPS `about-hero.webp` in its ink
hero frame per user). Same policy as the services images above: paid Imagen
generation, kept on disk with its manifest entry until the redesign settles.

### `ogl` + `AuroraShader` are now dead weight on the homepage
The 2026-07-07 "Bold Editorial" revamp removed the aurora wash — `AuroraShader` (OGL WebGL) is no longer imported by any route (Hero + FinalCta dropped it). It's still exported from `src/motion/index.js` and the `ogl` dependency is still installed, so it ships in the bundle graph as an unused lazy chunk. Follow-up: either delete `src/motion/AuroraShader.*` + drop `ogl` from `package.json`, or repurpose the shader for a future dark toggle. Left in place for now (self-contained, harmless) to keep the revamp scoped to layout/design.

## Resolved

### Homepage "What We Engineer" cards link to the /services hub, not sub-pages (2026-07-17)
Phase-2 service detail pages shipped (`/services/custom-software`,
`/web-platforms`, `/mobile-apps`, `/ai-systems` — shared `ServiceDetail.jsx`
template, `SERVICE_PAGES` in `content.js`). All four `CAPABILITIES[].to`
values now deep-link to their sub-page, and the `/services` hub disciplines
carry "Full details →" links.

### "What We Engineer" — full-bleed immersive one-service stage (2026-07-16)
Four iterative requests reshaped the pinned What-We-Engineer section. (1) The
first pin build showed **all four services at once** (a ledger with the active
row highlighted); user wanted **only one at a time** — page stops, scrolls
through them one-by-one, then behaves normally. Rebuilt as a **deck of full
panels**; pinned, panels overlay + cross-fade, scroll-mapped `floor(p·4)` picks
the sole visible one, release after the fourth. (2) "Looks like a slider with nav
lines — I want immersive." Removed the `.progress` rail and bound the active
panel to continuous scroll via `--p` (0→1) written to the deck each frame. (3)
"Make it more immersive — full-width vignette with the text coming out of it,
something creative." Reworked each panel into a **full-bleed `.stage`** (blueprint
+ bloom + a **giant faint ghost word** of the service name + the floating
vignette) with the copy **overlaid**; the **headline rises word-by-word out of
the stage** (`overflow:hidden` `.titleMask`, each word `translateY 116%→0` on
activate, staggered). `.sceneHolder`/`.ghost`/`.overlay` parallax off `--p` (rise
+ zoom / faster drift / settle), no transition → tracks the wheel. (4) "Don't
need numbering like 1/4." Removed the `NN/04` counter; the ghost word is the only
cue. Non-pinned fallback: panels **stack** (ghost hidden, title un-masked,
overlay below the vignette), IO lights the centred one's scene. Dropped
`useStageParallax` here (still used by Services). (5) Three more tweaks: header
**heading forced to one line** (`What we engineer.`, inline spans) with the
**description on the next line**, both full-width (killed the right-side
whitespace); the pinned deck made **truly full-bleed** (edge-to-edge grid/bloom/
ghost via `width:100%`, copy+vignette re-aligned to the container edge with an
`--edge` calc); and the ghost word given a continuous **left↔right drift**
(`ghostDrift`, wrapper keeps the parallax) for life. (6) "We agreed on full-width
text **then** the vignette full-width — not 2-column — and the moving background
text should show the **full name** (`Custom Software`, not `Custom`); also tighten
the whitespace under the heading." Re-composed each pinned panel as a **vertical
stack** (flex column, centred): full-width `.overlay` copy on top, then the
`.stage` as a **full-bleed band** below (fixed height, grid/bloom/ghost bleed
edge-to-edge, `.sceneHolder` centred to container width) — dropped the old
copy-left / vignette-right split. Ghost word now the **whole title** uppercased
(`item.title.toUpperCase()`). Header `.headRow` gap cut (`clamp(8px,.9vw,14px)`)
+ `.header` margin trimmed to close the gap under the one-line heading. Verified:
lint + build clean, Playwright desktop pinned (stacked full-width copy over a
full-bleed vignette band, drifting full-name ghost `CUSTOM SOFTWARE`, one-line
header + tight description, masked-rise headline, `--p` parallax) in **both ink
modes**, base/non-pinned CSS path overflow-safe (widest element = viewport, ghost
`display:none`), 0 console errors. (Note: the browser tooling couldn't shrink the
CSS viewport below 1536 this session, so the 390px re-screenshot was deferred; the
mobile path is unchanged in width behaviour — full-bleed/ghost are `[data-pinned]`-
scoped, base deck keeps `max-width`+gutter.) (7) "The grey text should run **behind
the actual heading**; the vignette should be **taller / look like a screen**; the
experience is immersive but **jittery**." Root cause of the jitter: the pinned
composition (copy + fixed-height band) was **taller than short viewports**, so it
clipped top/bottom and shifted as you scrolled. Fixes: (a) ghost moved out of the
band into a `.titleWrap` **behind the heading** (`z-index` under `.title`, sized
`clamp(3.4rem,8vw,9rem)` to stay in-container); (b) the `.sceneHolder` is now a
framed **"screen"** (border + `--r-xl` radius + shadow + `--surface` bg) and the
band **flex-grows** to fill leftover height, so the vignette is much taller and
reads as a screen; (c) **fit made height-driven** — `.pinInner` top-padded to
clear the nav, pinned `.deck` `flex:1`/`max-height:860px`, `.stage` `flex:1` — so
the whole composition always fits the viewport (no overflow-clip = no jitter);
(d) parallax cut to a few px and `.desc` given a fixed `min-height` (tallest copy)
so the band/screen stays the same size across services (no cross-fade size-jump).
Verified in Playwright (1536×695, a deliberately short window): all four bands
align (`stageTop` identical, `screenH` 264 each), title clears the nav
(`top:81`), band bottom `660 < 695` (fits), ghost `CUSTOM SOFTWARE` behind the
heading + drifting, `hOverflow` 0, in **both ink modes**; build + lint clean.

### Homepage polish follow-ups — uniform card hover + AI-section neural net (2026-07-16)
Three follow-up requests after the band/pin/bento work. (1) **Portfolio hover
was inconsistent** — only the two routed cards drew the accent top-line +
underline (they alone were `.interactive`); moved those triggers to `.card`
so **every** card gets the same hover (lift + accent line + underline + region-pin
brighten), routed cards keep their CTA-arrow motion. (2) **AiAccelerated card
hover felt sluggish/stuck** — root cause: `.card` sat directly on its `Reveal`,
so the reveal's per-card stagger `transition-delay` (up to 240ms) leaked onto
the hover transform. Fixed by making the card a **child** of the Reveal wrapper
(matches Portfolio) with its own snappy easing. (3) **Added a neural-net
signal-flow visual** to the AI section (`NeuralNet`, top-right) — curved edges
with gliding teal pips + breathing nodes, both ink modes. Verified: lint + build
clean, both modes at desktop, 0 console errors.

### Homepage band rhythm + pinned What We Engineer + bento Our Work (2026-07-16)
Three homepage polish requests. (1) **Band differentiation** — the run into
FinalCta was three near-identical greys (faint `--accent-tint` MiniCta →
`--bg-2` Testimonial → `--bg-2` AiAccelerated). Fixed to a graded rhythm:
MiniCta strengthened to an `--accent-soft` teal strip, AiAccelerated moved to a
navy pre-crescendo wash via a new `--prelude` token (both ink modes), Testimonial
kept as the single grey. FinalCta stays the only dark band. (2) **What We
Engineer pins** on desktop and scroll-steps through all four services (`440vh`
sticky wrapper, Lenis-driven active index, progress rail; progressive-enhanced,
off for touch/narrow/reduced-motion). (3) **Our Work** rebuilt as a **bento
grid** (navy 2×2 CareGrid anchor + varied tiles, location-pin region chips,
small single-line pills). Verified: lint + build clean, Playwright both ink
modes at 375/768/1024/1280, pin engage/release, 0 console errors, no h-scroll.
Removed orphaned `portfolioParallax.js`.

### Homepage aligned to finalized /content specs — Phase 1 of content-spec sync (2026-07-16)
Applied the locked `/content/*.md` copy to the homepage + added new sections:
hero "engineer" positioning + "See our work" scroll-to-`#work`, proof-ticker
relabel, 4th stat (8+ Industries Served), blended empathy copy, "What We
Engineer" rename + reorder (Custom Software first), Why copy, Process split
4→5 phases, portfolio real countries (UK/South Africa) with the two routed case
studies geo-rewritten to match + testimonials realigned, and a new
**AiAccelerated** (§10) section (light teal-tinted 4-up, both ink modes). Home
sections reordered/renumbered to the spec table (03–08, 10). lint ✓ build ✓,
Playwright-verified 1280 + 375 both modes, no h-scroll, 0 console errors. See
`tasks/todo.md` "CONTENT SPEC SYNC" for Phases 2–5 (About/Contact/Services
sub-pages, /work, /support, legal pages + cookie banner, /website-package).

### Sharp ★ text glyph replaced with rounded IconStar everywhere on the homepage (2026-07-14)
User: the ★ star (Hero trust line, `4.9★` Numbers stat, `4.8★ app store` proof
ticker) had sharp points. The `★` characters in `content.js` copy are now
rendered via `StarredText` (Icon.jsx), which splits the string and swaps each
`★` for `IconStar` — a filled star with a heavy round-joined stroke that blunts
the points, sized in em so it tracks the surrounding font. Copy in `content.js`
untouched. Two gotchas: `reset.css` blockifies all `svg` (star dropped onto its
own line) — fixed with `display:inline-block` on the icon; and the Numbers-band
glyph now sizes at `0.58em` of the digits (plus `white-space: nowrap` on
`.value`) so it reads as a rating badge and can't wrap. Verified: build + lint
clean, screenshots at 320/414/768/1280, 0 console errors.

### Process section revamp: "Chapters" timeline → "Phase horizon" band + dot wave (2026-07-14)
User: the "How we work" section "looks bad" — entirely revamped. Now a
full-bleed brand-navy band with a three.js animated dot-wave background
(`DottedSurface.jsx` + lazy `DottedSurfaceScene.jsx`, adapted from 21st.dev
"dotted-surface"; recreated in Tekniik idiom instead of its TSX/Tailwind/
next-themes original). Phases sit on a descending staircase; a teal fill races
across each phase's top hairline in sequence with scroll. `three` added as a
dependency but ships as an IO+idle-gated lazy chunk, so the main bundle is
unchanged; scene pauses offscreen and disposes on unmount; reduced motion gets
a static CSS dot texture. Verified: build+lint clean, 0 console errors, no
h-scroll at 320/375/768/1024/1280/1600, both ink modes, reduced-motion pass.


### ServiceShowcase stage: static images → coded animated vignettes (2026-07-14)
The sticky stage crossfaded 4 static webp renders; user asked for animated,
highly interactive scenes instead. Built `ServiceVignettes.jsx` + module CSS:
one coded scene per capability (Websites = self-assembling site + cursor that
clicks the CTA; Web Apps = live dashboard with breathing bars + self-drawing
trend line; Mobile = phone scrolling screens synced to its tab bar + dropping
notification; AI = pipeline with flowing packets into a thinking core and three
outcome chips). All color from theme tokens so BOTH ink modes adapt (images
couldn't); pure CSS keyframes/transitions gated on the active class (idle
scenes cost nothing); pointer parallax via `useStageParallax` (rAF lerp writing
`--px/--py`, depth layers); stage is a size container so scenes scale via
cqw/cqh at every viewport; touch devices auto-cycle scenes (IO-gated interval);
reduced motion renders complete static compositions. Two bugs caught in the
Playwright sweep: percentage padding on absolutely-positioned nodes resolves
against the containing block (stage), not the element — crushed the AI doc
node's content to 0 width (fixed with cqw clamps); and the stage index badge
had a hardcoded dark scrim unreadable on the light theme (now tokens).
Verified: lint + build clean, 0 console errors, no h-scroll at 320/375/768/1280,
both themes, reduced-motion pass.

### Round-2 homepage refinements (2026-07-07) — font, hero, images, stats, band rhythm
Five user-requested fixes on the Bold Editorial homepage: (1) **Font** — `--f-mono` swapped from IBM Plex Mono to `'Inter'` (the mono read as off-brand "code"); dropped the IBM Plex Mono `<link>` from `index.html`. (2) **Hero redesign** — the old text-left / cards-right split ("too normal") replaced with a full-width **oversized poster headline** (`clamp(3.4rem,12vw,10rem)`) + a hand-drawn indigo **marker** SVG that draws under "right." + a **full-bleed infinite proof-ticker** marquee of the `TERMINAL_FRAMES` outcomes (pauses on hover, edge-masked, reduced-motion static). Cascade removed. (3) **ServiceShowcase images** — the 4 service images were dark cinematic renders full of garbled fake UI text and clashed with the light theme; regenerated as light indigo-restrained ABSTRACT forms (rewrote the `ABSTRACT` style + the 4 `svc-*` prompts in `scripts/generateTekniikImages.js`, 4:3) and wired into the cards (featured = full-width horizontal split, others = image-topped 3-up). (4) **Numbers** — `LogoStrip` now filters to numeric-leading values only (`50+`, `98%`, `4.9★`); the 3 non-numeric brand words dropped; bold 3-up. (5) **Band rhythm** — Testimonial was a near-black band directly above the near-black FinalCta; Testimonial re-themed **light** so FinalCta is the single dark crescendo. Verified: build + lint clean, 0 console errors (only the pre-existing benign `useScroll` warning), no horizontal scroll at 320/375/1440. `content.js` copy untouched.

### Homepage TOTAL revamp → "Bold Editorial" (light · Inter · restrained indigo)
Prior "revamps" only recolored a fixed centered-stack skeleton, so nothing read as fresh. This pass rebuilt the homepage structure wholesale (user-approved direction: **Expressive/bold**, font **Inter**, palette **light + restrained indigo, no aurora wash**). Foundations: fonts → `Inter Tight` (display) + `Inter` (body) + retained `IBM Plex Mono`; `tokens.css` sharpened radii + added inverted `--band*`/`--on-band*`/`--accent-on-band` tokens; `theme-light.css` → clean white canvas, single-hue indigo (violet/magenta stops aliased to indigo, `--grad-aurora` now indigo→deep-indigo), crisper hairlines, solid cards (no glass); `global.css` dropped the page-wide dot wash; `reset.css` type scale heavier/tighter. Every homepage section was restructured: left-locked editorial hero with an overlapping `TERMINAL_FRAMES` proof-card cascade (no AuroraShader); `ServiceShowcase` moved to its own section with an inverted featured "Websites" card; `LogoStrip` → light band of oversized numbers; `Problem` → sticky-left split with offset before/after cards; `Why` → bold four-up with ghost index numbers; `Process` → sharp indigo rail (mechanic preserved); `Portfolio` → hover-invert rows + permanent inverted featured block; `Testimonial` + `FinalCta` → inverted near-black bands. Copy unchanged (verbatim `content.js`). Deleted orphaned hero-only components (`HeroBadge`, `GradientHeadline`, `TrustStrip`). Verified: build + lint clean, no horizontal scroll at 320/375/768/1280/1600, reduced-motion honored, 0 console errors. Superseded the "Signal" aurora specs.

### LogoStrip textual stats overlapped at desktop widths — fixed
The "Signal readout" stats row (`repeat(6, 1fr)` grid) rendered all six `MARQUEE` values in the same large `nowrap` gradient Sora (`clamp(1.35rem, 4.6vw, 2.9rem)`). The three TEXTUAL values ("Senior", "AI-native", "Long-term") are whole words, not short glyphs, so at ~1280px they overflowed their columns and collided. Fixed by giving textual values their own `.valueText` class (applied in the existing `!match` branch of `StatValue`): smaller `clamp(1rem, 2.2vw, 1.55rem)`, `white-space: normal` + `overflow-wrap: anywhere` as a safety, no `tabular-nums`. Also pinned `.value` to a shared `min-height` band with flex centering so the smaller text values sit on the same baseline as the big numbers and every label stays aligned across the row. Verified no cell overflow and no horizontal scroll at 1280 / 768. (Was a pre-existing, theme-independent layout issue surfaced during the light-theme QA.)

### Homepage switched to LIGHT aurora variant + mono font → IBM Plex Mono
The homepage `/` now renders the LIGHT aurora variant instead of dark (user request; no toggle yet). Added `src/styles/theme-light.css` (mirror of `theme-dark.css`, same token names, light-aurora values — cool near-white canvas, translucent-white glass, dark-tinted hairlines/dots, DEEPENED aurora gradient stops `#4338ca → #7c3aed → #c026a3` for legibility on white, softer glow) scoped to `:root[data-theme='light']`. `App.jsx` sets `data-theme="light"` on `/` (was `dark`); dark theme retained in code for a future toggle. Dark-only atmosphere effects got `:global(html[data-theme='light'])` overrides: `AuroraShader` → `mix-blend-mode:multiply` at reduced opacity (soft pastel wash instead of blowing out on white); FinalCta `.bloom` → normal-blend pastel radials (its `screen` blend is invisible on white); Hero/FinalCta dot grids → new `--dot` token; Problem `.before`/`.lineBad` + LogoStrip `.signal` → light-tinted. Also swapped the global mono font from Geist Mono → **IBM Plex Mono** (Google Fonts link + single `--f-mono` token). Verified: build+lint clean, no horizontal scroll at 320/375/1280, `/services` still uses the untouched base light theme (`data-theme` null), 0 console errors.

### KineticText dropped inter-word spaces on dark revamp — fixed
After the "Signal" dark revamp, the Testimonial and Final CTA headlines rendered with no spaces between words ("Readytobuildsomething"). Cause (same class as the old Terminal whitespace bug): `KineticText` placed each word's trailing space INSIDE the per-word `overflow:hidden; display:inline-block` clip box, where the browser trims trailing whitespace to zero width. Fixed in `src/motion/KineticText.jsx` by emitting the inter-word space as a sibling text node OUTSIDE the clip box (each word wrapped in a `Fragment` + a `' '`), and rendering literal spaces in `by="char"` mode as non-clipped whitespace. Caught in the Phase 10 browser QA sweep.

### Terminal code whitespace collapse — fixed
Hero terminal rendered `constproject={` (no spaces between syntax tokens). Cause: `display: flex` on `.line` was collapsing whitespace text nodes between flex children. Fixed by switching `.line` to `display: block; white-space: pre;` with `.lineNo` as `inline-block`.

### React 19 `setState-in-effect` lint errors — fixed
`useReveal`, `useCounter`, `Process`, and `Terminal` all called `setState` synchronously inside `useEffect` to handle the reduced-motion / no-IntersectionObserver fallback. Fixed by deriving the final value at render time (e.g. `const value = reduced ? target : raw`) and short-circuiting the effect when the fallback applies.

### QA harness scrolled with smooth-behavior CSS — fixed
`reset.css` sets `scroll-behavior: smooth`, so `window.scrollTo(0, 0)` in the Playwright script took longer than the 200ms wait — top-of-page screenshots captured the page mid-scroll (looked blank or showed an arbitrary section). Fixed in `tasks/qa-test.py` by passing `behavior: 'instant'` and bumping post-scroll waits to 600/800ms.

### Hero looked like a port of the prototype HTML — redesigned
Original Hero replicated the prototype's split layout (text left, dark terminal mockup right, three blurred orbs, stat-pill marquee underneath). Replaced wholesale with the "Aurora Bento Showcase": centered editorial-free composition, soft aurora atmosphere (3 radial blooms) plus the existing ShaderBackground reframed as an ambient atmospheric cap, gradient-filled headline ("built right." in deep indigo→violet→pink ink), gradient pill eyebrow, gradient-avatar trust strip, and a 4-card glass bento (Websites flagship-tall, Web Apps + Mobile Apps stacked, AI wide-bottom) using new abstract editorial illustrations from Nano Banana — no devices, no UI screenshots, no people. `Terminal.jsx` and `Marquee.jsx` deleted; `LogoStrip.jsx` replaced the marquee row.

### First gradient ink palette washed out against aurora — fixed
The first gradient for "built right." (indigo→violet→pink at full saturation) blended into the desktop+ aurora and shader and became hard to read. Tightened to a deeper start (`#3d2bb5 → #5b5bff → #8b4bd6 → #d44a8a`), dropped aurora bloom opacities to 0.18–0.20 (and to 0.10–0.14 above 1280px), and lowered the hero shader opacity from 0.85 to 0.45. Headline reads cleanly on every breakpoint.

### Page heroes had no imagery and felt empty — fixed
Services / About / Contact / case-study pages all rendered a centered text-only `PageHeader` with no visual anchor, leaving large dead zones above the fold. Refactored `PageHeader` to support a `media` prop that switches the layout to a 2-column split with a right-side hero image (4/5 portrait on desktop, 16/11 stacked on tablet, 4/5 stacked on mobile). Generated 5 new abstract editorial illustrations (`page/{services,about,contact}-hero.webp` at 1280×1600, plus regenerated `case/{looqz,autoscreen}-hero.webp` at 1920×1080 with abstract glass-form prompts replacing the previous device-mockup prompts). Bumped webp quality from 80 → 92 (with effort 6 + smartSubsample) and increased service-bento source resolution from 1280×960 → 1600×1200 — file sizes roughly tripled (e.g. websites 22 KB → 54 KB) and the visuals now hold detail under scrutiny.

### Capabilities section duplicated the hero bento on Home — removed
The home page rendered both the new `ServiceShowcase` bento (in Hero) and the old `Capabilities` section beneath it, listing the same four offerings twice. Removed the `Capabilities` import + render from `Home.jsx` and deleted `src/sections/Capabilities.jsx` + its CSS module.

### Page hero frames were tall portrait rectangles — squared
`PageHeader.media` was rendering at `aspect-ratio: 4/5` on desktop (and 16/11 on tablet) which read as elongated. Switched all variants to a clean `1/1` square frame so the hero feels balanced beside the text column. Updated all `media.width/height` props from `1280×1600` (page heroes) and `1920×1080` (case studies) to `1600×1600`.

### PageHeader image sat in a heavy pink container — switched to frameless float
The square hero frame had a soft pink/indigo gradient backdrop, a 1px gradient hairline, an indigo glow drop shadow, and a `mix-blend-mode` glass-shine overlay. The container fought the image. Removed all of it: `.mediaFrame` is now transparent with no border/shadow/shine, `max-width` bumped from 520 → 720px, grid ratio rebalanced from `1.05fr / 0.95fr` → `0.9fr / 1.1fr` so the image gets the dominant column and bleeds further past the container's right edge. Added a soft radial mask on `.mediaImg` (`#000 60% → transparent 100%`) so the rectangle's corners fade flawlessly into the near-white page bg.

### Abstract metaphor imagery felt meaningless — switched to editorial product imagery
The previous abstract illustrations (translucent shells, orbital spheres, arcs of light, glassy planes) didn't communicate what the studio builds. Replaced the entire image set with **editorial product photography** in the language of Apple keynote slides:
- Service bento now shows actual designed UI (websites/dashboards/mobile/AI) on devices with cinematic indigo+pink lighting.
- Page heroes tell stories: Services = curated multi-surface showcase ("we build all of this"); About = top-down designer's workspace at a moment of focused craft; Contact = paper + fountain pen + glowing phone notification ("the start of a project").
- Case-study heroes show actual product UI mockups (booking flow for Looqz, quote/map for AutoScreen).
The `STYLE` boilerplate in `scripts/generateTekniikImages.js` was rewritten from "abstract metaphor, no devices/UI" to "premium magazine-quality editorial product render in the style of Apple keynote marketing imagery". Sources are now uniformly 1600×1600 to fit the new square frames.

## Open

### Benign framer-motion `useScroll` container warning (low)
On `/`, the console shows one warning: *"Please ensure that the container has a non-static position…"* from framer-motion's `useScroll`, surfaced via `@vite/client`. All three scroll targets (`Why`/`Problem` `.section`, `Process` `.steps`) ARE `position: relative`, and every scroll effect works visually (rail fill, node ignition, Problem crossfade, Why spine). It appears to be a framer-motion + Lenis integration artifact from the motion layer, not a functional bug — 0 console errors. Left as-is; revisit if it ever correlates with a real miscalculation.

### LogoStrip section eyebrow is an authored UI string, not from content.js (low)
`src/components/LogoStrip.jsx` uses a default `eyebrow` of `THE NUMBERS` (the `03 |` section label) — an authored UI string, not a `content.js` value. All displayed stat `value`/`label` pairs are verbatim from `MARQUEE` (now filtered to numeric-only). Only this section label is authored; move it into `content.js` if strict single-source is wanted.
