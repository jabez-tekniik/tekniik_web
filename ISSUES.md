# Issues

## Resolved

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
None.
