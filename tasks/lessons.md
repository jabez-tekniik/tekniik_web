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

## Counter input: pre-parse mixed-format strings

The case study stat values arrive as `'2,100+'`, `'4.9★'`, `'98%'`. `useCounter` only handles numbers, so `StatBlock` parses with a `(prefix)(digits/commas/decimal)(suffix)` regex once, animates the number, and reformats with the original prefix/suffix on each frame.
