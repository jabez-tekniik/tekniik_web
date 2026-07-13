# Tekniik — lessons

## Whitespace and `display: flex`

`display: flex` collapses whitespace text nodes between flex children, including JSX `{' '}` separators. When rendering inline syntax-highlighted code where the spaces between tokens are part of the content (e.g. `const project = {`), use `display: block` with `white-space: pre` and rely on inline-block for rigid columns (line numbers).

Caught by visual screenshot review — lint and build did not flag it.

## React 19 lint: `react-hooks/set-state-in-effect`

Calling `setState()` synchronously inside `useEffect` is an error in this project's lint config. Patterns that triggered it:
- "if reduced motion, jump value to target" inside an effect.
- "if no IO support, set visible=true" inside an effect.

Fix: derive at render time instead of mutating state inside the effect:

```js
const reduced = useReducedMotion()
const [raw, setRaw] = useState(0)
const value = reduced ? target : raw
useEffect(() => { if (reduced) return; ... }, [reduced])
```

Or initialize state lazily based on a constant (e.g. `const HAS_IO = typeof IntersectionObserver !== 'undefined'`).

## Lazy-load heavy WebGL deps to keep initial bundle small

`@shadergradient/react` pulls in `three`, `@react-three/fiber`, `valtio` — together ~1.1 MB minified. Moved the canvas + gradient into `ShaderBackgroundInner.jsx` and `lazy(() => import(...))` it from a wrapper. Vite splits it into its own chunk; main bundle stays at ~325 KB / 102 KB gzip. Wrapper also gates mount behind `requestIdleCallback` and skips entirely on touch + small viewport. Suspense fallback is a static CSS radial gradient so users see something premium during the lazy load.

## Smooth scroll vs. test scripts

`html { scroll-behavior: smooth }` (in `reset.css`) makes Playwright's `window.scrollTo(0, 0)` async. A 200ms wait is not enough — the screenshot captures the page mid-scroll. In test scripts, always pass `behavior: 'instant'` to `scrollTo` and budget enough wait for layout/animation to settle (600–900ms after a big jump).

## Word-mask reveals clip glyph ink at tight metrics (both axes)

`WordRise`-style reveals put each word in an `overflow: hidden` inline-block.
The clip box hugs the type metrics, and glyph INK routinely exceeds them:
- vertically: at `line-height: 1` the ~1em box cuts y/p/g/j descenders
- horizontally: negative `letter-spacing` (-0.03em on display headings) makes
  the advance width narrower than the last glyph's painted width — the
  trailing "y" in "probably" lost its right edge
Fix in the mask, not per-heading: `padding: 0 0.1em 0.15em` +
`margin: 0 -0.1em -0.15em` on the clip box (visual spacing unchanged), and
deepen the hidden offset from 110% → 125% so no sliver of the word shows
through the bottom padding pre-reveal. Screenshot-zoom the actual glyph edges
when reviewing display type — build/lint never catch ink clipping.

## Percentage padding on absolutely-positioned elements

`padding: 10%` on a `position: absolute` element resolves against the
**containing block's** width (the positioned ancestor), not the element's own
width. In the vignette stage this crushed a 110px-wide node's content to 0
(padding computed from the 522px stage). Same trap applies to %-margins.
Use px/`clamp()`/container-query units for padding on absolute nodes. Symptom
to watch for: children report `width: 0` in getBoundingClientRect while the
box itself looks fine.

## CSS-module class hashes change on every file edit

Playwright scripts that select by the dev-server's scoped class names
(`_stage_l5tk9_158`) break as soon as the module file is edited (new hash).
Select with a hash-agnostic substring instead: `[class*="_stage_"]` — the
trailing underscore keeps it from matching `_stageWrap_`.

## Counter input: pre-parse mixed-format strings

The case study stat values arrive as `'2,100+'`, `'4.9★'`, `'98%'`. `useCounter` only handles numbers, so `StatBlock` parses with a `(prefix)(digits/commas/decimal)(suffix)` regex once, animates the number, and reformats with the original prefix/suffix on each frame.

## Auto-rotating carousels: no hover-pause on full-bleed sections

The testimonial rotator paused on `pointerenter` (mouse). After scrolling, the
user's cursor naturally parks somewhere on the section — Chrome fires
pointerenter for content scrolled under a stationary cursor — so the rotation
"never" advanced and read as broken (>10s bug report). Hover-pause is only
appropriate for small hover-targeted widgets (the Hero ticker); for tall
sections, gate autoplay on in-view + focus-within instead. Related: replaying
a word-mask reveal on every rotation read as a glitch — entrance-choreography
effects should run once per scroll-in, rotations get a plain fade.

## Animated stroke-dash background fans read as a "glitch"

The 21st.dev BackgroundPaths effect (dozens of thin SVG strokes with
traveling dash segments) was recreated faithfully on the FinalCta band and
the user read it as a rendering glitch, not intentional motion. On a dark
brand band, many thin moving lines look like tearing/artifacts. Prefer one
quiet CSS radial bloom (transform/opacity breathe) for ambient background
motion; reserve line-draw effects for single deliberate strokes (hero
Marker), never fields of them.
