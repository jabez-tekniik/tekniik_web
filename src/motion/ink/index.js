/* "Deep Ink" motion layer — anime.js v4 only (no framer-motion).
   Every hook here is reduced-motion aware: when the user prefers reduced
   motion nothing is ever hidden or transformed — content renders static. */
import { useLayoutEffect, useEffect, useRef } from 'react'
import {
  animate,
  createTimeline,
  createAnimatable,
  utils,
  stagger,
  svg,
  onScroll,
} from 'animejs'
import useReducedMotion from '../../hooks/useReducedMotion.js'

export { animate, createTimeline, utils, stagger, svg, onScroll }

/* Shared easing language: fast start, long settle (ease-out family). */
export const EASE_OUT = 'cubicBezier(0.16, 1, 0.3, 1)'
export const EASE_INOUT = 'cubicBezier(0.65, 0, 0.35, 1)'

/**
 * Run an anime setup once when the element scrolls into view.
 * `setup(el)` returns { init, play, cleanup }:
 *   init()    — set hidden initial states (runs pre-paint, so no flash)
 *   play()    — build/start the timeline (runs on first intersection)
 *   cleanup() — optional teardown for loops/observers
 * Under reduced motion nothing runs — the section stays fully static.
 */
export function useInViewOnce(setup, { threshold = 0.2, margin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return undefined
    const { init, play, cleanup } = setup(el) || {}
    if (init) init()
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          if (play) play()
        }
      },
      { threshold, rootMargin: margin },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (cleanup) cleanup()
      utils.remove(el.querySelectorAll('*'))
    }
    // setup is intentionally captured once — sections pass stable closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return ref
}

/**
 * Magnetic pull for primary CTAs — pointer-fine devices only.
 * anime `createAnimatable` keeps the spring off the React render cycle.
 */
export function useMagneticInk(strength = 0.22) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const target = createAnimatable(el, { x: 400, y: 400, ease: 'out(3)' })
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      target.x((e.clientX - (r.left + r.width / 2)) * strength)
      target.y((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const onLeave = () => {
      target.x(0)
      target.y(0)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      utils.remove(el)
    }
  }, [strength])

  return ref
}

/** Initial hidden state for a masked line/word rise (pairs with riseIn). */
export function setRiseHidden(targets) {
  utils.set(targets, { translateY: '110%' })
}

/** Masked rise-in params: translateY 110% → 0. Use as animate/tl.add params. */
export function riseIn({ duration = 800, delay = stagger(80) } = {}) {
  return { translateY: '0%', duration, delay, ease: EASE_OUT }
}
