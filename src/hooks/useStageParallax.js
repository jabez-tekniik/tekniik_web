import { useEffect, useRef } from 'react'

/* Pointer parallax for the ServiceShowcase stage: lerped rAF loop writes
   --px/--py (−1…1) onto the element; the vignette depth layers read them.
   Pointer-fine only, silent under reduced motion, off the React render cycle. */
export default function useStageParallax() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let raf = 0
    let running = false

    const tick = () => {
      cx += (tx - cx) * 0.09
      cy += (ty - cy) * 0.09
      el.style.setProperty('--px', cx.toFixed(4))
      el.style.setProperty('--py', cy.toFixed(4))
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) {
        raf = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }
    const kick = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width) * 2 - 1
      ty = ((e.clientY - r.top) / r.height) * 2 - 1
      kick()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      kick()
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return ref
}
