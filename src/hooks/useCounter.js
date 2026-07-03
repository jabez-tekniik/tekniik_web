import { useEffect, useRef, useState } from 'react'
import useReducedMotion from './useReducedMotion.js'

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

export default function useCounter(target, { duration = 1400, start = 0 } = {}) {
  const ref = useRef(null)
  const [value, setValue] = useState(start)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    let raf
    let started = false

    const run = () => {
      const t0 = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration)
        setValue(start + (target - start) * easeOutQuart(p))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true
            run()
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [target, duration, start, reduced])

  return [ref, reduced ? target : value]
}
