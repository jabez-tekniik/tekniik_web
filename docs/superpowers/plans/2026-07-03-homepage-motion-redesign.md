# Tekniik Homepage "Amplified Light" Motion Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the Tekniik homepage to reference-site interactivity (aura.build / motionsites.ai class) while keeping the light + indigo + mono brand and all existing copy verbatim.

**Architecture:** Add a `src/motion/` layer of small, single-purpose primitives (smooth scroll, Framer reveal/kinetic/tilt/magnetic, scroll-progress, lazy WebGL aurora). Wire two app-level providers. Then integrate primitives into the 8 existing homepage sections without changing their markup structure or copy. Non-homepage routes keep the legacy `useReveal`/`components/Reveal.jsx` untouched (phased rollout).

**Tech Stack:** React 19 + Vite 8, CSS Modules, `framer-motion` (via `LazyMotion` + `m`), `lenis`, `ogl` (lazy WebGL).

## Global Constraints

- **Copy is frozen.** All text comes from `src/data/content.js` verbatim. No wording changes.
- **Light identity only.** No dark mode/sections. Single accent `--accent: #5b5bff`; use existing tokens, no new hardcoded hex outside `tokens.css`.
- **Animate `transform`/`opacity` only.** Never animate width/height/top/left/margin/padding/filter for motion. GPU-only.
- **Framer: `LazyMotion` + `m` components only.** Never import `motion` directly. Provider uses `strict` so `motion` throws. Feature bundle: `domAnimation`.
- **Reduced motion is global.** `<MotionConfig reducedMotion="user">` disables transform animations; Lenis and WebGL are additionally gated by the existing `useReducedMotion()` hook.
- **WebGL never blocks LCP.** `ogl` is dynamically imported after LCP on idle, over a static CSS-gradient fallback; paused when offscreen or tab hidden; `devicePixelRatio` capped at 2.
- **Touch targets ≥ 44×44px; focus rings preserved** (never `outline:none` without the `--focus-ring` alternative). Semantic HTML unchanged.
- **Quality gates (every task):** `npm run build` succeeds, `npm run lint` passes (`react-hooks/set-state-in-effect` is an error — keep motion values out of effects/state), no new console errors.
- **Git:** repo is NOT initialized. Either run `git init` once before starting, or treat each **Commit** step as a manual checkpoint. Commit by explicit path — never `git add .`.
- **Scope:** homepage (`/`) only. `/services`, `/about`, `/contact`, case studies are a later phase.

---

## File Structure

**Create (`src/motion/`):**
- `LazyMotionProvider.jsx` — Framer `LazyMotion strict` + `MotionConfig reducedMotion="user"`.
- `SmoothScroll.jsx` — Lenis provider; route-change reset; reduced-motion no-op.
- `Reveal.jsx` — Framer `whileInView` spring fade+rise (homepage replacement for legacy Reveal).
- `KineticText.jsx` — per-word/char masked spring reveal.
- `Tilt.jsx` — pointer 3D tilt wrapper (transform-only).
- `useMagnetic.js` — cursor-pull props bag for CTAs.
- `useScrollProgress.js` — section-scoped `0..1` scroll driver.
- `AuroraShader.jsx` — lazy OGL fragment-shader canvas + static fallback.
- `AuroraShader.module.css` — canvas/fallback positioning.
- `index.js` — barrel export.

**Modify:**
- `package.json` — add `framer-motion`, `lenis`, `ogl`.
- `src/main.jsx` — wrap app in providers.
- `src/components/Hero.jsx` (+ `.module.css`) — aurora shader, kinetic headline, magnetic CTA.
- `src/sections/ServiceShowcase.jsx` (+ `.module.css`) — Tilt + image parallax + stagger.
- `src/components/LogoStrip.jsx` (+ `.module.css`) — count-up + shimmer + magnetic chips.
- `src/sections/Problem.jsx` — line-by-line reveal.
- `src/sections/Why.jsx` (+ `.module.css`) — spring hover + scroll-progress hairline.
- `src/sections/Process.jsx` (+ `.module.css`) — scroll-linked rail fill.
- `src/sections/Portfolio.jsx` (+ `.module.css`) — row reveal + underline draw + index parallax.
- `src/sections/Testimonial.jsx` — word-by-word quote reveal.
- `src/sections/FinalCta.jsx` (+ `.module.css`) — gradient mesh + kinetic headline + magnetic CTA.
- `CLAUDE.md`, `ISSUES.md` — document the relaxed rule, primitives, budget.

---

## Task 1: Dependencies + App Providers (LazyMotion + SmoothScroll)

**Files:**
- Modify: `package.json`
- Create: `src/motion/LazyMotionProvider.jsx`
- Create: `src/motion/SmoothScroll.jsx`
- Modify: `src/main.jsx:9-15`

**Interfaces:**
- Produces: `<LazyMotionProvider>{children}</LazyMotionProvider>`; `<SmoothScroll>{children}</SmoothScroll>` (must render inside a Router — uses `useLocation`).

- [ ] **Step 1: Add dependencies**

Add to `package.json` `dependencies` (keep existing entries):

```json
"framer-motion": "^11.15.0",
"lenis": "^1.1.18",
"ogl": "^1.0.11",
```

- [ ] **Step 2: Install**

Run: `npm install`
Expected: installs cleanly, `node_modules/framer-motion`, `node_modules/lenis`, `node_modules/ogl` exist.

- [ ] **Step 3: Create `src/motion/LazyMotionProvider.jsx`**

```jsx
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'

// LazyMotion(strict) forbids the `motion` component — only `m` works, keeping
// the runtime small. MotionConfig reducedMotion="user" auto-disables transform
// animations when the OS requests reduced motion.
export default function LazyMotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
```

- [ ] **Step 4: Create `src/motion/SmoothScroll.jsx`**

```jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import useReducedMotion from '../hooks/useReducedMotion.js'

// Module-scoped so ScrollToTop and section hooks can reach the instance.
let lenisInstance = null
export const getLenis = () => lenisInstance

export default function SmoothScroll({ children }) {
  const reduced = useReducedMotion()
  const { pathname } = useLocation()

  useEffect(() => {
    if (reduced) return undefined
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1 })
    lenisInstance = lenis
    let raf = 0
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [reduced])

  // Reset scroll on route change (Lenis owns scroll when active).
  useEffect(() => {
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true })
  }, [pathname])

  return children
}
```

- [ ] **Step 5: Wire providers in `src/main.jsx`**

Replace the render block (lines 9-15) with:

```jsx
import LazyMotionProvider from './motion/LazyMotionProvider.jsx'
import SmoothScroll from './motion/SmoothScroll.jsx'
// ...existing imports above...

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LazyMotionProvider>
      <BrowserRouter>
        <SmoothScroll>
          <App />
        </SmoothScroll>
      </BrowserRouter>
    </LazyMotionProvider>
  </StrictMode>,
)
```

Note: `ScrollToTop` (in `App.jsx`) stays — it covers the reduced-motion / no-Lenis path. Its `window.scrollTo(0)` and Lenis's `scrollTo(0,{immediate})` both target the top, no conflict.

- [ ] **Step 6: Build + lint gate**

Run: `npm run build`
Expected: succeeds, no errors.
Run: `npm run lint`
Expected: passes.

- [ ] **Step 7: Browser verify**

Run: `npm run dev`, open `/`. Expected: page scrolls with smooth easing (Lenis). Navigate `/` → `/services` → `/`: each route starts at top, no console errors. Toggle `prefers-reduced-motion: reduce` in DevTools rendering panel and reload: scrolling is native/instant, no console errors.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json src/motion/LazyMotionProvider.jsx src/motion/SmoothScroll.jsx src/main.jsx
git commit -m "feat(motion): add framer-motion/lenis/ogl deps and app providers"
```

---

## Task 2: `Reveal` primitive (Framer, homepage)

**Files:**
- Create: `src/motion/Reveal.jsx`
- Create: `src/motion/index.js`

**Interfaces:**
- Produces: `<Reveal as="div" delay={0} y={24} once className="">…</Reveal>`. `as` is any intrinsic tag name; `delay` in seconds; `y` initial offset px.

- [ ] **Step 1: Create `src/motion/Reveal.jsx`**

```jsx
import { m } from 'framer-motion'

export default function Reveal({
  as = 'div',
  delay = 0,
  y = 24,
  once = true,
  className = '',
  children,
  ...rest
}) {
  const MTag = m[as]
  return (
    <MTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2, margin: '0px 0px -40px 0px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 20, delay }}
      {...rest}
    >
      {children}
    </MTag>
  )
}
```

- [ ] **Step 2: Create `src/motion/index.js`**

```js
export { default as Reveal } from './Reveal.jsx'
```

(Extend this barrel as later primitives land.)

- [ ] **Step 3: Smoke-integrate in Hero to verify**

In `src/components/Hero.jsx`, import `Reveal` from `../motion/index.js` and wrap the hero sub-copy paragraph in `<Reveal as="p" delay={0.1} className={…existing class…}>`. (Read the file first; reuse the existing className so styling is unchanged.)

- [ ] **Step 4: Build + lint gate**

Run: `npm run build` → succeeds. Run: `npm run lint` → passes.

- [ ] **Step 5: Browser verify**

`/` on load: the wrapped paragraph springs up into place once when scrolled into view. Reduced-motion: appears immediately (opacity handled, no transform). No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/motion/Reveal.jsx src/motion/index.js src/components/Hero.jsx
git commit -m "feat(motion): Framer whileInView Reveal primitive"
```

---

## Task 3: `KineticText` primitive

**Files:**
- Create: `src/motion/KineticText.jsx`
- Modify: `src/motion/index.js`

**Interfaces:**
- Produces: `<KineticText text="…" as="span" by="word" stagger={0.06} className="" />`. `by` is `'word'|'char'`. Renders an accessible label plus `aria-hidden` animated units.

- [ ] **Step 1: Create `src/motion/KineticText.jsx`**

```jsx
import { m } from 'framer-motion'

const unitVariants = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { type: 'spring', stiffness: 140, damping: 20 } },
}

export default function KineticText({
  text,
  as = 'span',
  by = 'word',
  stagger = 0.06,
  className = '',
  ...rest
}) {
  const MTag = m[as]
  const units = by === 'char' ? Array.from(text) : text.split(' ')
  return (
    <MTag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: stagger }}
      {...rest}
    >
      {units.map((unit, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
        >
          <m.span style={{ display: 'inline-block', willChange: 'transform' }} variants={unitVariants}>
            {unit}
            {by === 'word' && i < units.length - 1 ? ' ' : ''}
          </m.span>
        </span>
      ))}
    </MTag>
  )
}
```

- [ ] **Step 2: Export from barrel**

Add to `src/motion/index.js`:

```js
export { default as KineticText } from './KineticText.jsx'
```

- [ ] **Step 3: Build + lint gate**

Run: `npm run build` → succeeds. Run: `npm run lint` → passes.

- [ ] **Step 4: Browser verify (temporary mount)**

Temporarily render `<KineticText text="built right." />` inside Hero, load `/`: words rise into place with stagger; screen-reader label reads "built right." (check the `aria-label` in DOM). Reduced-motion: text visible, no transform. Remove the temporary mount after verifying (the real headline integration is Task 8).

- [ ] **Step 5: Commit**

```bash
git add src/motion/KineticText.jsx src/motion/index.js
git commit -m "feat(motion): KineticText masked per-word reveal"
```

---

## Task 4: `Tilt` primitive

**Files:**
- Create: `src/motion/Tilt.jsx`
- Modify: `src/motion/index.js`

**Interfaces:**
- Produces: `<Tilt max={8} scale={1.02} className="">…</Tilt>` — renders an `m.div` with `transformPerspective`; children get 3D tilt toward the pointer.

- [ ] **Step 1: Create `src/motion/Tilt.jsx`**

```jsx
import { useRef } from 'react'
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function Tilt({ children, max = 8, scale = 1.02, className = '', ...rest }) {
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 150, damping: 18 })
  const sy = useSpring(py, { stiffness: 150, damping: 18 })
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const rotateY = useTransform(sx, [0, 1], [-max, max])

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <m.div
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileHover={{ scale }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      {...rest}
    >
      {children}
    </m.div>
  )
}
```

- [ ] **Step 2: Export from barrel**

Add: `export { default as Tilt } from './Tilt.jsx'`

- [ ] **Step 3: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 4: Browser verify** — temporarily wrap one ServiceShowcase card in `<Tilt>`; hover tilts smoothly toward cursor, returns to flat on leave, 60fps (no layout thrash). Reduced-motion: no tilt. Remove temp mount (real use is Task 9).

- [ ] **Step 5: Commit**

```bash
git add src/motion/Tilt.jsx src/motion/index.js
git commit -m "feat(motion): Tilt 3D hover primitive"
```

---

## Task 5: `useMagnetic` hook

**Files:**
- Create: `src/motion/useMagnetic.js`
- Modify: `src/motion/index.js`

**Interfaces:**
- Produces: `const magnetic = useMagnetic({ strength })` → `{ ref, style, onMouseMove, onMouseLeave }`. Spread onto an `m.a` / `m.button`.

- [ ] **Step 1: Create `src/motion/useMagnetic.js`**

```jsx
import { useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

export default function useMagnetic({ strength = 0.3 } = {}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })

  const onMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return { ref, style: { x: sx, y: sy }, onMouseMove, onMouseLeave }
}
```

- [ ] **Step 2: Export from barrel**

Add: `export { default as useMagnetic } from './useMagnetic.js'`

- [ ] **Step 3: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 4: Commit**

```bash
git add src/motion/useMagnetic.js src/motion/index.js
git commit -m "feat(motion): useMagnetic cursor-pull hook"
```

---

## Task 6: `useScrollProgress` hook

**Files:**
- Create: `src/motion/useScrollProgress.js`
- Modify: `src/motion/index.js`

**Interfaces:**
- Produces: `const progress = useScrollProgress(ref, offset?)` → Framer `MotionValue` in `[0,1]` as `ref` travels through the viewport. Default offset `['start end','end start']`.

- [ ] **Step 1: Create `src/motion/useScrollProgress.js`**

```jsx
import { useScroll } from 'framer-motion'

export default function useScrollProgress(ref, offset = ['start end', 'end start']) {
  const { scrollYProgress } = useScroll({ target: ref, offset })
  return scrollYProgress
}
```

- [ ] **Step 2: Export from barrel**

Add: `export { default as useScrollProgress } from './useScrollProgress.js'`

- [ ] **Step 3: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 4: Commit**

```bash
git add src/motion/useScrollProgress.js src/motion/index.js
git commit -m "feat(motion): useScrollProgress section driver"
```

---

## Task 7: `AuroraShader` (lazy WebGL) + fallback

**Files:**
- Create: `src/motion/AuroraShader.jsx`
- Create: `src/motion/AuroraShader.module.css`
- Modify: `src/motion/index.js`

**Interfaces:**
- Produces: `<AuroraShader className="" />` — absolutely-positioned layer. Paints a static CSS gradient immediately; upgrades to a cursor-reactive OGL fragment shader after LCP unless reduced-motion.

- [ ] **Step 1: Create `src/motion/AuroraShader.module.css`**

```css
.wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
/* Static fallback — paints instantly, is the reduced-motion state. */
.fallback {
  position: absolute;
  inset: -10%;
  background:
    radial-gradient(40% 45% at 22% 30%, rgba(91, 91, 255, 0.20), transparent 70%),
    radial-gradient(38% 42% at 78% 28%, rgba(139, 92, 246, 0.16), transparent 70%),
    radial-gradient(46% 50% at 60% 78%, rgba(236, 72, 153, 0.12), transparent 72%);
  filter: blur(8px);
}
.canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 800ms ease;
}
.canvas.ready { opacity: 1; }
```

- [ ] **Step 2: Create `src/motion/AuroraShader.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import useReducedMotion from '../hooks/useReducedMotion.js'
import styles from './AuroraShader.module.css'

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
// three brand inks
const vec3 INDIGO = vec3(0.357, 0.357, 1.0);
const vec3 VIOLET = vec3(0.545, 0.361, 0.965);
const vec3 PINK   = vec3(0.925, 0.282, 0.600);

float blob(vec2 uv, vec2 c, float r) {
  return smoothstep(r, 0.0, distance(uv, c));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  float t = uTime * 0.06;
  vec2 m = (uMouse - 0.5) * 0.15;
  vec2 a = vec2(0.25 + 0.05 * sin(t * 1.3), 0.32 + 0.04 * cos(t)) + m;
  vec2 b = vec2(0.78 + 0.05 * cos(t * 1.1), 0.30 + 0.05 * sin(t * 0.9)) - m;
  vec2 c = vec2(0.58 + 0.06 * sin(t * 0.7), 0.76 + 0.04 * cos(t * 1.4));
  vec3 col = vec3(0.0);
  col += INDIGO * blob(uv, a, 0.42);
  col += VIOLET * blob(uv, b, 0.40);
  col += PINK   * blob(uv, c, 0.46);
  float alpha = clamp(col.r + col.g + col.b, 0.0, 1.0) * 0.55;
  gl_FragColor = vec4(col, alpha);
}
`

export default function AuroraShader({ className = '' }) {
  const reduced = useReducedMotion()
  const hostRef = useRef(null)
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced) return undefined
    let renderer, program, mesh, gl, raf = 0, disposed = false
    const mouse = [0.5, 0.5]
    const host = hostRef.current
    let visible = true

    const start = async () => {
      const { Renderer, Program, Mesh, Triangle } = await import('ogl')
      if (disposed || !host) return
      renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) })
      gl = renderer.gl
      canvasRef.current = gl.canvas
      gl.canvas.className = `${styles.canvas}`
      host.appendChild(gl.canvas)
      const geometry = new Triangle(gl)
      program = new Program(gl, {
        vertex: `attribute vec2 position; void main(){ gl_Position = vec4(position,0.0,1.0); }`,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: [1, 1] },
          uMouse: { value: mouse },
        },
      })
      mesh = new Mesh(gl, { geometry, program })

      const resize = () => {
        const r = host.getBoundingClientRect()
        renderer.setSize(r.width, r.height)
        program.uniforms.uRes.value = [gl.drawingBufferWidth, gl.drawingBufferHeight]
      }
      resize()
      window.addEventListener('resize', resize)

      const onMouse = (e) => {
        const r = host.getBoundingClientRect()
        mouse[0] = (e.clientX - r.left) / r.width
        mouse[1] = 1 - (e.clientY - r.top) / r.height
      }
      window.addEventListener('pointermove', onMouse)

      const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting }, { threshold: 0 })
      io.observe(host)
      const onVis = () => { visible = document.visibilityState === 'visible' && visible }
      document.addEventListener('visibilitychange', onVis)

      let last = 0
      const loop = (time) => {
        raf = requestAnimationFrame(loop)
        if (!visible || document.hidden) return
        if (time - last < 16) return
        last = time
        program.uniforms.uTime.value = time * 0.001
        renderer.render({ scene: mesh })
      }
      raf = requestAnimationFrame(loop)
      requestAnimationFrame(() => setReady(true))

      AuroraShader._cleanup = () => {
        window.removeEventListener('resize', resize)
        window.removeEventListener('pointermove', onMouse)
        document.removeEventListener('visibilitychange', onVis)
        io.disconnect()
      }
    }

    // Defer to idle after LCP.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 2000 })
      : setTimeout(start, 1200)

    return () => {
      disposed = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else clearTimeout(idle)
      cancelAnimationFrame(raf)
      if (AuroraShader._cleanup) AuroraShader._cleanup()
      const c = canvasRef.current
      if (c && c.parentNode) c.parentNode.removeChild(c)
    }
  }, [reduced])

  useEffect(() => {
    if (ready && canvasRef.current) canvasRef.current.classList.add(styles.ready)
  }, [ready])

  return (
    <div className={`${styles.wrap} ${className}`} ref={hostRef} aria-hidden="true">
      <div className={styles.fallback} />
    </div>
  )
}
```

- [ ] **Step 3: Export from barrel**

Add: `export { default as AuroraShader } from './AuroraShader.jsx'`

- [ ] **Step 4: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 5: Browser verify**

Temporarily mount `<AuroraShader />` in Hero behind content. On load: gradient fallback shows instantly; ~1s later the shader fades in and drifts, reacting to cursor. Move mouse → blooms shift. Check DevTools Performance: main-thread idle during scroll, no long tasks from the shader; switch tabs → animation pauses (no rAF work). Reduced-motion: only the static fallback, no WebGL context created (check no `canvas` element added). Remove temp mount (real use is Task 8).

- [ ] **Step 6: Commit**

```bash
git add src/motion/AuroraShader.jsx src/motion/AuroraShader.module.css src/motion/index.js
git commit -m "feat(motion): lazy OGL AuroraShader with static fallback"
```

---

## Task 8: Hero integration

**Files:**
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Hero.module.css`

**Interfaces:**
- Consumes: `AuroraShader`, `KineticText`, `Reveal`, `useMagnetic` from `../motion/index.js`.

- [ ] **Step 1: Read `src/components/Hero.jsx` and `Hero.module.css`** to learn the current layer stack (aurora blooms, `GradientHeadline`, sub copy, CTA row, `TrustStrip`) and class names.

- [ ] **Step 2: Replace static blooms with `AuroraShader`**

Remove the existing static radial-bloom background element(s). Add `<AuroraShader className={styles.aurora} />` as the backmost layer inside the hero container. In `Hero.module.css`, ensure `.aurora` sits at `z-index: 0` and hero content is `position: relative; z-index: 1`. Keep the conic ribbon behavior as-is.

- [ ] **Step 3: Kinetic headline**

Keep `GradientHeadline` for the gradient-ink words, but drive the reveal with `KineticText` by word (`by="word"`). If `GradientHeadline` already does a vertical-mask reveal, replace its internal reveal with `KineticText` OR wrap its words — choose the path that keeps the gradient fill intact. Verify the gradient ink still renders on "built right.".

- [ ] **Step 4: Sub copy + TrustStrip reveals**

Wrap sub-copy paragraph in `<Reveal as="p" delay={0.1}>` (reuse existing class). Wrap `TrustStrip` mount in `<Reveal delay={0.2}>`.

- [ ] **Step 5: Magnetic primary CTA**

Convert the primary CTA to an `m.a` (or wrap `Button`'s anchor) and spread `useMagnetic({ strength: 0.35 })`:

```jsx
import { m } from 'framer-motion'
import { useMagnetic } from '../motion/index.js'
// inside component:
const magnetic = useMagnetic({ strength: 0.35 })
// render:
<m.a ref={magnetic.ref} style={magnetic.style} onMouseMove={magnetic.onMouseMove}
     onMouseLeave={magnetic.onMouseLeave} href={/* existing */} className={/* existing */}>
  {/* existing label */}
</m.a>
```

Keep `min-height: 44px` on the CTA.

- [ ] **Step 6: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 7: Browser + responsive verify**

`/` load: fallback→shader hero, headline words rise in, sub copy + trust strip spring up, primary CTA pulls toward cursor and returns. Sweep 320 / 414 / 768 / 1280 / 1600 — no horizontal scroll, CTA tap target ≥44px, conic ribbon hidden ≤720px. Reduced-motion: static hero, no console errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/Hero.jsx src/components/Hero.module.css
git commit -m "feat(hero): aurora shader + kinetic headline + magnetic CTA"
```

---

## Task 9: ServiceShowcase bento integration

**Files:**
- Modify: `src/sections/ServiceShowcase.jsx`
- Modify: `src/sections/ServiceShowcase.module.css`

**Interfaces:**
- Consumes: `Tilt`, `Reveal` from `../motion/index.js`; `m`, `useMotionValue`, `useSpring`, `useTransform` from `framer-motion` for image parallax.

- [ ] **Step 1: Read `ServiceShowcase.jsx`** — note the existing `useReveal` usage, the card `<Link>` structure, image element, and chip variants.

- [ ] **Step 2: Wrap each card in `Tilt`**

Wrap each card `<Link>` content in `<Tilt max={6} scale={1.03} className={styles.card}>`. Move the existing hover lift/scale from CSS `:hover` to the Tilt (avoid double-transform conflicts) — keep the CSS transition for shadow/glow only (transform is now owned by Framer). Preserve the grid placement classes (`.tall`, `.wide`).

- [ ] **Step 3: Image parallax inside frame**

Add a small pointer-driven parallax to the `<img>` (±5%) using a shared motion value from the Tilt pointer position, or a local one:

```jsx
// inside a Card component: reuse Tilt's onPointerMove to also set imgX/imgY,
// then <m.img style={{ x: imgX, y: imgY, scale: 1.05 }} .../>
```

Keep `object-fit: cover`; image already scales 1.05 on hover — route that scale through the motion style so it composes with parallax.

- [ ] **Step 4: Stagger reveal**

Replace the section's `useReveal` gating with `<Reveal delay={i * 0.08}>` per card (or a parent with `staggerChildren`). Chips fade/scale in with the card.

- [ ] **Step 5: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 6: Browser + responsive verify**

Cards tilt + image parallaxes on hover, stagger-reveal on scroll-in, 60fps. Collapse to 2×2 at ≤960px and single column (`aspect-ratio: 4/3`) at ≤600px unchanged. Reduced-motion: no tilt/parallax, cards appear. No horizontal scroll at all breakpoints.

- [ ] **Step 7: Commit**

```bash
git add src/sections/ServiceShowcase.jsx src/sections/ServiceShowcase.module.css
git commit -m "feat(bento): 3D tilt, image parallax, stagger reveal"
```

---

## Task 10: LogoStrip integration

**Files:**
- Modify: `src/components/LogoStrip.jsx`
- Modify: `src/components/LogoStrip.module.css`

**Interfaces:**
- Consumes: `Reveal`, `useMagnetic` from `../motion/index.js`; existing `useCounter` hook; `useReveal` (existing) to trigger counting.

- [ ] **Step 1: Read `LogoStrip.jsx` and `useCounter.js`** — note chip data shape (`MARQUEE` values like `50+`, `98%`, `4.9★`) and how values render.

- [ ] **Step 2: Count-up on view**

For numeric chip values, parse the leading number and animate with `useCounter` triggered when the strip enters view (`useReveal`). Preserve the suffix (`+`, `%`, `★`) and gradient fill. Non-numeric values render as-is.

- [ ] **Step 3: Shimmer + magnetic**

Add a one-shot gradient shimmer sweep on reveal (CSS keyframes on the gradient value, transform/opacity only). Give each chip a light `useMagnetic({ strength: 0.15 })` on hover.

- [ ] **Step 4: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 5: Browser + responsive verify**

Scroll strip into view: numbers count up once, values shimmer once, chips nudge to cursor on hover. Reduced-motion: final numbers shown immediately, no shimmer/magnetic. No horizontal scroll 320→1600.

- [ ] **Step 6: Commit**

```bash
git add src/components/LogoStrip.jsx src/components/LogoStrip.module.css
git commit -m "feat(logostrip): count-up, shimmer, magnetic chips"
```

---

## Task 11: Problem section integration

**Files:**
- Modify: `src/sections/Problem.jsx`

**Interfaces:**
- Consumes: `Reveal` (and optionally `KineticText`) from `../motion/index.js`.

- [ ] **Step 1: Read `Problem.jsx`** — identify the copy blocks/lines from `content.js`.

- [ ] **Step 2: Line-by-line reveal**

Wrap each line/paragraph in `<Reveal as="p" delay={i * 0.08}>` so the argument assembles top-to-bottom as the block enters. Keep existing classes/markup.

- [ ] **Step 3: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 4: Browser + responsive verify** — lines stagger in on scroll; reduced-motion shows all immediately; no horizontal scroll.

- [ ] **Step 5: Commit**

```bash
git add src/sections/Problem.jsx
git commit -m "feat(problem): line-by-line staggered reveal"
```

---

## Task 12: Why section integration

**Files:**
- Modify: `src/sections/Why.jsx`
- Modify: `src/sections/Why.module.css`

**Interfaces:**
- Consumes: `Reveal`, `useScrollProgress` from `../motion/index.js`; `m`, `useTransform` for the hairline.

- [ ] **Step 1: Read `Why.jsx` and `Why.module.css`** — note the card grid.

- [ ] **Step 2: Staggered reveal + spring hover**

Wrap cards in `<Reveal delay={i * 0.08}>`. Convert card hover-lift to an `m.div` `whileHover={{ y: -6 }}` spring (transform-only); keep shadow/border in CSS.

- [ ] **Step 3: Scroll-progress hairline**

Add a vertical/horizontal hairline element bound to `useScrollProgress(sectionRef)` → `scaleY`/`scaleX` via `useTransform`, indicating reading position. Indigo gradient, transform-only.

- [ ] **Step 4: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 5: Browser + responsive verify** — cards reveal + spring on hover; hairline tracks scroll; reduced-motion static; no horizontal scroll 320→1600.

- [ ] **Step 6: Commit**

```bash
git add src/sections/Why.jsx src/sections/Why.module.css
git commit -m "feat(why): staggered reveal, spring hover, scroll hairline"
```

---

## Task 13: Process "Phase Track" — scroll-linked rail (key upgrade)

**Files:**
- Modify: `src/sections/Process.jsx`
- Modify: `src/sections/Process.module.css`

**Interfaces:**
- Consumes: `useScrollProgress`, `Reveal` from `../motion/index.js`; `m`, `useTransform` from `framer-motion`.

- [ ] **Step 1: Read `Process.jsx` and `Process.module.css`** — locate the `.steps` wrapper, `.trackLine`/`.trackFill`, nodes, cards, and the current `useReveal()` `.active` toggle + rail keyframe animation.

- [ ] **Step 2: Replace one-shot toggle with scroll-linked fill**

Add a ref to the `.steps` wrapper. `const progress = useScrollProgress(stepsRef, ['start 80%', 'end 60%'])`. Convert `.trackFill` to an `m.div` with `style={{ scaleX: progress }}` (desktop) — remove the CSS keyframe animation and the `.active` class dependency for the fill. Keep `transform-origin: left`.

```jsx
import { m, useTransform } from 'framer-motion'
import { useScrollProgress } from '../motion/index.js'
// ...
const progress = useScrollProgress(stepsRef, ['start 80%', 'end 60%'])
// desktop fill:
<m.div className={styles.trackFill} style={{ scaleX: progress }} />
```

- [ ] **Step 3: Nodes pop at scroll offsets**

Drive each node's inner-dot scale/halo from `progress` via `useTransform(progress, [i/steps, i/steps + 0.15], [0, 1])`, so nodes light up as the fill passes them. Cards keep `<Reveal delay={i * 0.08}>`.

- [ ] **Step 4: Mobile vertical variant**

Under `≤640px`, bind the rail to `scaleY` instead of `scaleX` (match the existing `--rail-x` vertical layout). Use a matchMedia check or render both and let CSS pick — simplest: apply `scaleY` via a second `m.div` shown only in the mobile media query, or switch the transform key with a `useMediaQuery`-style read. Keep tablet (≤960px) 2×2 grid with the rail hidden (existing behavior).

- [ ] **Step 5: Reduced motion**

When `useReducedMotion()` is true, render `.trackFill` fully filled (`scaleX/Y: 1`) and nodes active immediately — no scroll binding.

- [ ] **Step 6: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 7: Browser + responsive verify**

Desktop: rail fills as you scroll through the section; nodes light in sequence; cards reveal. Scrolling up reverses the fill smoothly. Tablet ≤960px: 2×2, no rail. Mobile ≤640px: vertical rail fills on scroll, `[rail|card]` layout intact. Reduced-motion: filled + active immediately. No horizontal scroll 320→1600, 60fps.

- [ ] **Step 8: Commit**

```bash
git add src/sections/Process.jsx src/sections/Process.module.css
git commit -m "feat(process): scroll-linked rail fill and sequential nodes"
```

---

## Task 14: Portfolio integration

**Files:**
- Modify: `src/sections/Portfolio.jsx`
- Modify: `src/sections/Portfolio.module.css`

**Interfaces:**
- Consumes: `Reveal` from `../motion/index.js`; `m`, `useMotionValue`, `useTransform` for index parallax.

- [ ] **Step 1: Read `Portfolio.jsx` and `Portfolio.module.css`** — note the row/card structure, project number, title, `// stack` row, featured surface.

- [ ] **Step 2: Per-row reveal** — wrap each project `<article>` in `<Reveal delay={i * 0.06}>`. Keep typography-only restraint (no images).

- [ ] **Step 3: Underline draw + index parallax on hover**

Add an animated underline on the title: a pseudo-element or `m.span` scaling `scaleX 0→1` from left on row hover (transform-only). Give the large index number a subtle parallax (`±6px` translate) tied to pointer Y within the row. Featured row keeps its indigo surface.

- [ ] **Step 4: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 5: Browser + responsive verify** — rows reveal; title underline draws on hover; index number parallaxes; reduced-motion static; no horizontal scroll 320→1600.

- [ ] **Step 6: Commit**

```bash
git add src/sections/Portfolio.jsx src/sections/Portfolio.module.css
git commit -m "feat(portfolio): row reveal, underline draw, index parallax"
```

---

## Task 15: Testimonial integration

**Files:**
- Modify: `src/sections/Testimonial.jsx`

**Interfaces:**
- Consumes: `KineticText`, `Reveal` from `../motion/index.js`.

- [ ] **Step 1: Read `Testimonial.jsx`** — locate the quote text and attribution.

- [ ] **Step 2: Word-by-word quote reveal** — render the quote via `<KineticText text={quote} as="blockquote" by="word" stagger={0.04} className={…existing…} />`. Wrap attribution in `<Reveal delay={0.3}>`. Confirm `aria-label` carries the full quote for screen readers.

- [ ] **Step 3: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 4: Browser + responsive verify** — quote words rise in on scroll; attribution follows; reduced-motion shows full quote immediately; no horizontal scroll; long quote wraps cleanly at 320px.

- [ ] **Step 5: Commit**

```bash
git add src/sections/Testimonial.jsx
git commit -m "feat(testimonial): word-by-word kinetic quote reveal"
```

---

## Task 16: FinalCta integration

**Files:**
- Modify: `src/sections/FinalCta.jsx`
- Modify: `src/sections/FinalCta.module.css`

**Interfaces:**
- Consumes: `KineticText`, `useMagnetic` from `../motion/index.js`; `m`.

- [ ] **Step 1: Read `FinalCta.jsx` and `FinalCta.module.css`** — note heading, sub, CTA, email note.

- [ ] **Step 2: Animated gradient mesh** — add a backdrop layer of 2–3 slow-drifting radial blooms (indigo/violet/pink) animating `transform`/`opacity` via CSS keyframes (mirror the `PageHeader` blob-drift pattern already in the codebase). No WebGL here.

- [ ] **Step 3: Kinetic headline + magnetic CTA** — render heading via `<KineticText as="h2" by="word">`; convert primary CTA to `m.a` + `useMagnetic({ strength: 0.35 })` (keep `min-height: 44px`).

- [ ] **Step 4: Build + lint gate** — `npm run build` → succeeds; `npm run lint` → passes.

- [ ] **Step 5: Browser + responsive verify** — mesh drifts, headline reveals, CTA is magnetic; reduced-motion static + no drift; no horizontal scroll 320→1600.

- [ ] **Step 6: Commit**

```bash
git add src/sections/FinalCta.jsx src/sections/FinalCta.module.css
git commit -m "feat(finalcta): gradient mesh, kinetic headline, magnetic CTA"
```

---

## Task 17: Docs + full-site gates

**Files:**
- Modify: `CLAUDE.md`
- Modify: `ISSUES.md`

- [ ] **Step 1: Update `CLAUDE.md`**

Under Stack/Conventions: document that the "no animation library" rule is relaxed for the homepage — add `framer-motion` (via `LazyMotion`+`m`, `strict`), `lenis`, `ogl`. Add a "Motion system (`src/motion/`)" section listing the 8 primitives + one-line each, the performance budget (transform/opacity only, WebGL lazy/paused/dpr-capped, reduced-motion global), and per-section motion notes for the homepage. Note non-homepage routes still use legacy `useReveal`/`components/Reveal.jsx` pending a later phase.

- [ ] **Step 2: Update `ISSUES.md`**

Record: (a) two `Reveal` implementations coexist during phased rollout (`motion/Reveal.jsx` for homepage, `components/Reveal.jsx` legacy) — consolidate when other routes are migrated; (b) any interaction cut for perf; (c) Lighthouse numbers achieved.

- [ ] **Step 3: Full build + lint**

Run: `npm run build` → succeeds.
Run: `npm run lint` → passes.

- [ ] **Step 4: Playwright QA sweep**

Run: `npm run dev` (separate shell), then `python tasks/qa-test.py`.
Expected: every route, 5 viewports, **0 console errors**, **no horizontal-scroll regressions**. Delete `tasks/shots/` screenshots after review.

- [ ] **Step 5: Reduced-motion pass**

DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, reload `/`: no WebGL canvas created, no transform animations, Lenis inactive (native scroll), page fully usable, 0 console errors.

- [ ] **Step 6: Lighthouse gate**

Run Lighthouse (mobile, throttled) on `/`. Expected: **LCP < 2.5s, CLS = 0, low TBT**. If LCP regresses vs. baseline or TBT spikes, confirm the shader is deferring correctly (Task 7) and reduce animation on the offending section. Record numbers in `ISSUES.md`.

- [ ] **Step 7: Commit**

```bash
git add CLAUDE.md ISSUES.md
git commit -m "docs: motion system, budget, and rollout notes"
```

---

## Self-Review

**Spec coverage:**
- §3 deps (lenis/framer/ogl) → Task 1. ✓
- §4.1 primitives (8) → Tasks 1–7 (LazyMotionProvider+SmoothScroll T1; Reveal T2; KineticText T3; Tilt T4; useMagnetic T5; useScrollProgress T6; AuroraShader T7). ✓
- §4.2 wiring → Task 1. ✓  §4.3 reduced motion → global `MotionConfig` (T1) + per-primitive gates + Task 17 Step 5. ✓
- §5 sections 1–9 → Tasks 8–16 (Hero, ServiceShowcase, LogoStrip, Problem, Why, Process, Portfolio, Testimonial, FinalCta). ✓
- §6 perf budget → Global Constraints + Task 7 + Task 17 Step 6. ✓
- §7 testing → per-task gates + Task 17 Steps 3–6. ✓
- §9 deliverables → Tasks 1–17. ✓
- **Deviation from spec §4.1:** new `Reveal` does NOT delete legacy `components/Reveal.jsx`; both coexist during the homepage-only phase (logged in ISSUES.md, Task 17). Reason: deleting it forces edits to out-of-scope routes. Acceptable and documented.

**Placeholder scan:** primitives carry complete code; section tasks carry exact primitive props + snippets and instruct reading the existing file first (markup varies and must be preserved verbatim). No "TBD/TODO/handle edge cases" left.

**Type consistency:** barrel `src/motion/index.js` names — `Reveal`, `KineticText`, `Tilt`, `useMagnetic`, `useScrollProgress`, `AuroraShader` — used consistently across Tasks 8–16. `useMagnetic` returns `{ ref, style, onMouseMove, onMouseLeave }` (spread in Tasks 8, 10, 16). `useScrollProgress(ref, offset)` → MotionValue (Tasks 12, 13). `getLenis()` exported from SmoothScroll (T1) — currently unused by tasks; kept for the later-phase route work.
