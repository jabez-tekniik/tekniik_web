import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

/* Interactive speck field — tiny brand-colored dashes drifting gently
   upward across the hero. The pointer carries a soft teal glow that
   trails it with easing, and nearby specks are pushed aside as it moves.
   Canvas cannot read CSS custom properties, so the palettes below mirror
   theme-ink.css (teal #72ccd6 / teal-ink #0e7c8c / navy #202e5d). */

const PALETTES = {
  ink: {
    specks: [
      'rgba(114, 204, 214, 0.75)',
      'rgba(155, 227, 234, 0.5)',
      'rgba(148, 163, 199, 0.45)',
      'rgba(244, 246, 251, 0.3)',
    ],
    glow: '114, 204, 214',
  },
  'ink-light': {
    specks: [
      'rgba(14, 124, 140, 0.55)',
      'rgba(114, 204, 214, 0.9)',
      'rgba(32, 46, 93, 0.4)',
      'rgba(32, 46, 93, 0.22)',
    ],
    glow: '14, 124, 140',
  },
}

const REPEL_RADIUS = 130
const GLOW_RADIUS = 150

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
    let parts = []
    let raf = 0
    let inView = true
    let pageVisible = !document.hidden
    let running = false

    let palette = PALETTES['ink-light']
    const readPalette = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      palette = PALETTES[theme] || PALETTES['ink-light']
      parts.forEach((p) => {
        p.color = palette.specks[p.colorIndex % palette.specks.length]
      })
    }

    // pointer: (tx, ty) is the live position, (x, y) trails it with lerp
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false }

    const spawn = () => {
      const count = Math.min(110, Math.round((w * h) / 15000))
      parts = Array.from({ length: count }, () => {
        const colorIndex = Math.floor(Math.random() * palette.specks.length)
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          len: 4 + Math.random() * 5,
          thick: 1.4 + Math.random() * 1.1,
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.012,
          vy: -(0.1 + Math.random() * 0.28),
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.004 + Math.random() * 0.009,
          swayAmp: 0.15 + Math.random() * 0.3,
          pushX: 0,
          pushY: 0,
          colorIndex,
          color: palette.specks[colorIndex],
        }
      })
    }

    const drawSpecks = () => {
      for (const p of parts) {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.roundRect(-p.len / 2, -p.thick / 2, p.len, p.thick, p.thick / 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const step = () => {
      ctx.clearRect(0, 0, w, h)

      // trailing glow follows the pointer with easing
      mouse.x += (mouse.tx - mouse.x) * 0.09
      mouse.y += (mouse.ty - mouse.y) * 0.09
      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, GLOW_RADIUS)
        g.addColorStop(0, `rgba(${palette.glow}, 0.1)`)
        g.addColorStop(1, `rgba(${palette.glow}, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(mouse.x - GLOW_RADIUS, mouse.y - GLOW_RADIUS, GLOW_RADIUS * 2, GLOW_RADIUS * 2)
        ctx.fillStyle = `rgba(${palette.glow}, 0.85)`
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const p of parts) {
        p.sway += p.swaySpeed
        p.rot += p.spin
        p.y += p.vy
        p.x += Math.sin(p.sway) * p.swayAmp

        // specks near the live pointer get pushed away
        if (mouse.active) {
          const dx = p.x - mouse.tx
          const dy = p.y - mouse.ty
          const d2 = dx * dx + dy * dy
          if (d2 < REPEL_RADIUS * REPEL_RADIUS && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const f = (1 - d / REPEL_RADIUS) * 0.85
            p.pushX += (dx / d) * f
            p.pushY += (dy / d) * f
          }
        }
        p.pushX *= 0.9
        p.pushY *= 0.9
        p.x += p.pushX
        p.y += p.pushY

        // wrap around the edges (upward drift respawns at the bottom)
        if (p.y < -12) {
          p.y = h + 12
          p.x = Math.random() * w
        }
        if (p.x < -12) p.x = w + 12
        if (p.x > w + 12) p.x = -12
      }

      drawSpecks()
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
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      spawn()
      if (reduced) {
        ctx.clearRect(0, 0, w, h)
        drawSpecks()
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
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
      if (inside && !mouse.active) {
        // snap the trail to the entry point so the glow doesn't fly across
        mouse.x = x
        mouse.y = y
      }
      mouse.active = inside
      mouse.tx = x
      mouse.ty = y
    }
    const onPointerLeave = () => {
      mouse.active = false
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
