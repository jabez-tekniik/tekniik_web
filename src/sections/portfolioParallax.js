import { createAnimatable, utils } from 'animejs'

/* Cursor parallax for the big portfolio index numeral. The anime Animatable
   damps toward the pointer offset without touching React state. Skipped on
   coarse pointers and under prefers-reduced-motion. Returns a cleanup fn. */
export function attachIndexParallax(row, idxEl, range = 9) {
  if (!row || !idxEl) return undefined
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return undefined
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

  const target = createAnimatable(idxEl, { x: 380, y: 380, ease: 'out(3)' })
  const onMove = (e) => {
    const r = row.getBoundingClientRect()
    target.x(((e.clientX - r.left) / r.width - 0.5) * range * 2)
    target.y(((e.clientY - r.top) / r.height - 0.5) * range * 1.6)
  }
  const onLeave = () => {
    target.x(0)
    target.y(0)
  }
  row.addEventListener('pointermove', onMove)
  row.addEventListener('pointerleave', onLeave)
  return () => {
    row.removeEventListener('pointermove', onMove)
    row.removeEventListener('pointerleave', onLeave)
    utils.remove(idxEl)
  }
}
