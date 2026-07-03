import { useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import useReducedMotion from '../hooks/useReducedMotion.js'

export default function useMagnetic({ strength = 0.3 } = {}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
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

  if (reduced) return { ref, style: {}, onMouseMove: undefined, onMouseLeave: undefined }
  return { ref, style: { x: sx, y: sy }, onMouseMove, onMouseLeave }
}
