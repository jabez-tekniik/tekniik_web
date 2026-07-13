# Issues

## Open

### HeroCircuit SVG traces overflow the viewport at 320px (low, pre-existing)
At a 320px viewport, `document.scrollWidth > clientWidth` — the culprits are the
decorative `HeroCircuit.jsx` SVG traces/electrons (elements ~300–500px wide
extending past the right edge), not page content. Surfaced during the star-icon
QA sweep (2026-07-14); unrelated to that change. No overflow at 414px+. Fix
candidates: `overflow-x: clip` on the hero, or size/mask the circuit layer to
the viewport at small widths.

### Footer legal links are placeholders (medium)
The footer `// Legal` column (Privacy Policy, Terms of Service, GDPR Cookie
Policy — `FOOTER.cols` in `src/data/content.js`) points at `#` because the
actual legal pages don't exist yet. Needs real `/privacy`, `/terms`,
`/cookie-policy` routes with reviewed legal copy, then update the `to` values.
`Footer.jsx` already renders route links (`/...`) as `<Link>` and anything else
as a plain `<a>`, so swapping in real routes is a data-only change.

### `/img/services/*.webp` no longer used on the homepage (low)
The 2026-07-14 vignette revamp replaced the ServiceShowcase image stage with
coded animated scenes (`src/sections/ServiceVignettes.jsx`), so the homepage no
longer loads the four service webp images. They ARE still used by
`pages/Services.jsx` rows — keep the files. If the Services page ever gets its
own vignettes, the images and their `svc-*` entries in
`scripts/generateTekniikImages.js` can be deleted.

### `ogl` + `AuroraShader` are now dead weight on the homepage
The 2026-07-07 "Bold Editorial" revamp removed the aurora wash — `AuroraShader` (OGL WebGL) is no longer imported by any route (Hero + FinalCta dropped it). It's still exported from `src/motion/index.js` and the `ogl` dependency is still installed, so it ships in the bundle graph as an unused lazy chunk. Follow-up: either delete `src/motion/AuroraShader.*` + drop `ogl` from `package.json`, or repurpose the shader for a future dark toggle. Left in place for now (self-contained, harmless) to keep the revamp scoped to layout/design.

## Resolved

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
