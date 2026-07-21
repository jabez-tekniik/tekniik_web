/* BackToTop — floating scroll-to-top control (Deep Ink).
   A glass disc with a live scroll-progress ring; fades in once the reader is
   past the first viewport. Scrolls through Lenis when smooth scroll owns the
   page, otherwise falls back to the native API. */

import { useCallback, useEffect, useState } from 'react'
import { getLenis } from '../motion/SmoothScroll.jsx'
import useReducedMotion from '../hooks/useReducedMotion.js'
import s from './BackToTop.module.css'

const R = 21
const C = 2 * Math.PI * R

export default function BackToTop() {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false
    const measure = () => {
      ticking = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
      setVisible(window.scrollY > window.innerHeight * 0.9)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const toTop = useCallback(() => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { duration: reduced ? 0 : 1.1 })
      return
    }
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }, [reduced])

  return (
    <button
      type="button"
      className={`${s.btn} ${visible ? s.visible : ''}`}
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg className={s.ring} viewBox="0 0 48 48" aria-hidden="true">
        <circle className={s.track} cx="24" cy="24" r={R} />
        <circle
          className={s.progress}
          cx="24"
          cy="24"
          r={R}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
        />
      </svg>
      <span className={s.glyph} aria-hidden="true">
        <Arrow />
        <Arrow />
      </span>
    </button>
  )
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V6M6 12l6-6 6 6" />
    </svg>
  )
}
