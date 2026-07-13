import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

/* Faithful 2D-canvas port of antigravity.google's hero particle field
   (their version is a THREE.js GPGPU sim; the math below mirrors their
   sim shader):
   - every speck is ANCHORED to a home position and wobbles around it on
     layered noise — specks never free-drift across the canvas
   - an invisible ring (radius ~0.175u, pulsing) lerps lazily toward the
     cursor while hovering (0.02/frame) and wanders on noise when idle
     (0.01/frame); the cursor pulls the ring only 17.5% of the way
   - specks under the ring band GROW (band factors t/t2/t3) and get pushed
     radially away from the ring centre with springy decay (pos *= 0.8)
   - speck size everywhere twinkles on an ambient noise term
   Canvas cannot read CSS custom properties → palettes mirror theme-ink.css. */

const PALETTES = {
  ink: ['#72ccd6', '#9be3ea', '#94a3c7'],
  'ink-light': ['#0e7c8c', '#72ccd6', '#202e5d'],
}

/* their camera shows ~2.26 world units of height → 1 unit = H/2.26 px */
const UNITS_VISIBLE_H = 2.26
const RING_RADIUS = 0.175
const RING_WIDTH = 0.15
const RING_WIDTH2 = 0.05
const RING_DISPLACEMENT = 0.15
const CURSOR_PULL = 0.175
const DENSITY_PX2 = 2400 // ≈1 speck per 2400 css-px² (their density=200 field)

/* GLSL smoothstep incl. the reversed-edge form their shader relies on */
function sstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/* smooth 1-D noise stand-in: two detuned sines. Their shader samples
   simplex noise at the (constant) home position, so per speck every
   channel is just a smooth function of time — this is equivalent. */
function makeChannel(speed = 1) {
  const p1 = Math.random() * Math.PI * 2
  const p2 = Math.random() * Math.PI * 2
  const w1 = (0.3 + Math.random() * 0.35) * speed
  const w2 = w1 * 1.73
  return (t) => Math.sin(p1 + t * w1) * 0.62 + Math.sin(p2 + t * w2) * 0.38
}

export default function HeroParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let w = 0
    let h = 0
    let U = 1 // px per world unit
    let parts = []
    let raf = 0
    let inView = true
    let pageVisible = !document.hidden
    let running = false
    const t0 = performance.now()

    let palette = PALETTES['ink-light']
    const readPalette = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      palette = PALETTES[theme] || PALETTES['ink-light']
      parts.forEach((p) => {
        p.color = palette[p.colorIndex % palette.length]
      })
    }

    const mouse = { x: 0, y: 0, over: false }
    const ring = { x: 0, y: 0 }
    const wanderX = makeChannel(0.66)
    const wanderY = makeChannel(0.75)

    const spawn = () => {
      const count = Math.min(560, Math.max(90, Math.round((w * h) / DENSITY_PX2)))
      parts = Array.from({ length: count }, () => {
        const colorIndex = Math.floor(Math.random() * palette.length)
        return {
          hx: Math.random() * w,
          hy: Math.random() * h,
          rot: Math.random() * Math.PI,
          n1: makeChannel(0.35),
          n2: makeChannel(0.35),
          n3: makeChannel(0.5),
          n4: makeChannel(0.5),
          nS: makeChannel(0.5),
          nHF: makeChannel(1),
          px: 0,
          py: 0,
          scale: 0.4,
          colorIndex,
          color: palette[colorIndex % palette.length],
        }
      })
    }

    /* one sim step, straight port of their fragment shader */
    const simulate = (elapsed) => {
      const T = elapsed * 0.5
      const R = RING_RADIUS + Math.sin(elapsed) * 0.03 + Math.cos(elapsed * 3) * 0.02

      // ring target: cursor-biased while hovering, noise wander otherwise
      const cx = w / 2
      const cy = h / 2
      let tx
      let ty
      let lerp
      if (mouse.over) {
        tx = cx + (mouse.x - cx) * CURSOR_PULL + wanderX(elapsed) * 0.1 * U
        ty = cy + (mouse.y - cy) * CURSOR_PULL + wanderY(elapsed) * 0.1 * U
        lerp = 0.02
      } else {
        tx = cx + wanderX(elapsed) * 0.2 * U
        ty = cy + wanderY(elapsed) * 0.1 * U
        lerp = 0.01
      }
      ring.x += (tx - ring.x) * lerp
      ring.y += (ty - ring.y) * lerp

      for (const p of parts) {
        const hxU = p.hx / U
        const hyU = p.hy / U
        const dist = Math.hypot(p.hx - ring.x, p.hy - ring.y) / U

        // ring band factors (t drives scale, t2 drives the radial push)
        let tA = sstep(R - RING_WIDTH * 2, R, dist) - sstep(R, R + RING_WIDTH, dist)
        let t2 = sstep(R - RING_WIDTH2 * 2, R, dist) - sstep(R, R + RING_WIDTH2, dist)
        const t3 = sstep(R + RING_WIDTH2, R, dist)
        tA *= tA
        t2 = t2 * t2 * t2

        let tScale = tA + t2 * 3 + t3 * 0.4 + p.nHF(T) * t3 * 0.5
        const nS = p.nS(T)
        tScale += ((nS + 1.5) * 0.5) ** 2 * 0.6

        // ambient wobble around home (world units)
        const clampDist = Math.min(dist, 1)
        const dispX =
          p.n1(T) * 0.03 + p.n3(T) * 0.005 + Math.sin(hxU * 20 + T * 4) * 0.02 * clampDist
        const dispY =
          p.n2(T) * 0.03 + p.n4(T) * 0.005 + Math.cos(hyU * 20 + T * 3) * 0.02 * clampDist

        // springy radial push away from the ring centre
        p.px *= 0.8
        p.py *= 0.8
        const push = t2 ** 0.75 * RING_DISPLACEMENT
        p.px -= (ring.x / U - (hxU + dispX)) * push
        p.py -= (ring.y / U - (hyU + dispY)) * push

        p.scale += (tScale - p.scale) * 0.2

        p.x = (hxU + dispX + p.px * 0.25) * U
        p.y = (hyU + dispY + p.py * 0.25) * U
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = 'round'
      for (const p of parts) {
        const s = p.scale
        if (s <= 0.05) continue
        const len = 1.5 + s * 2.6
        const dx = Math.cos(p.rot) * len * 0.5
        const dy = Math.sin(p.rot) * len * 0.5
        ctx.globalAlpha = Math.min(0.85, 0.18 + s * 0.38)
        ctx.strokeStyle = p.color
        ctx.lineWidth = Math.max(0.9, 0.6 + s * 0.55)
        ctx.beginPath()
        ctx.moveTo(p.x - dx, p.y - dy)
        ctx.lineTo(p.x + dx, p.y + dy)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    const step = () => {
      simulate((performance.now() - t0) / 1000)
      draw()
      raf = requestAnimationFrame(step)
    }

    const syncLoop = () => {
      const shouldRun = !reduced && inView && pageVisible
      if (shouldRun && !running) {
        running = true
        raf = requestAnimationFrame(step)
      } else if (!shouldRun && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = Math.round(rect.width)
      h = Math.round(rect.height)
      U = h / UNITS_VISIBLE_H
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ring.x = w / 2
      ring.y = h / 2
      spawn()
      if (reduced) {
        simulate(0)
        draw()
      }
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const io = new IntersectionObserver((entries) => {
      inView = entries.some((e) => e.isIntersecting)
      syncLoop()
    })
    io.observe(canvas)

    const onVisibility = () => {
      pageVisible = !document.hidden
      syncLoop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    const themeObserver = new MutationObserver(readPalette)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    readPalette()

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      mouse.over = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
      mouse.x = x
      mouse.y = y
    }
    const onPointerLeave = () => {
      mouse.over = false
    }
    if (finePointer && !reduced) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.addEventListener('pointerleave', onPointerLeave)
    }

    syncLoop()

    return () => {
      cancelAnimationFrame(raf)
      running = false
      ro.disconnect()
      io.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      if (finePointer && !reduced) {
        window.removeEventListener('pointermove', onPointerMove)
        document.removeEventListener('pointerleave', onPointerLeave)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.particles} aria-hidden="true" />
}
