import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import useReducedMotion from '../hooks/useReducedMotion.js'
import styles from './DottedSurface.module.css'

const Scene = lazy(() => import('./DottedSurfaceScene.jsx'))

/* Animated dot-wave background for band sections. The three.js scene
   (heavy chunk) loads only when the host scrolls within 600px of the
   viewport AND the browser goes idle; until then — and permanently
   under reduced motion — a static CSS dot texture stands in, so the
   band never reads as empty. Decorative: hidden from AT, no pointer. */
export default function DottedSurface({ className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced || ready) return undefined
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined

    let idleId = 0
    let usedIdle = false
    const arm = () => setReady(true)
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        usedIdle = 'requestIdleCallback' in window
        idleId = usedIdle
          ? window.requestIdleCallback(arm, { timeout: 1200 })
          : window.setTimeout(arm, 200)
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      if (idleId) {
        if (usedIdle) window.cancelIdleCallback(idleId)
        else window.clearTimeout(idleId)
      }
    }
  }, [reduced, ready])

  return (
    <div ref={ref} className={`${styles.surface} ${className}`} aria-hidden="true">
      {ready && !reduced ? (
        <Suspense fallback={<div className={styles.staticDots} />}>
          <Scene className={styles.scene} />
        </Suspense>
      ) : (
        <div className={styles.staticDots} />
      )}
    </div>
  )
}
