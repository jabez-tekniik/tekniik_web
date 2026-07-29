import { lazy, Suspense, useEffect, useState } from 'react'
import useReducedMotion from '../hooks/useReducedMotion.js'
import styles from './HeroFluid.module.css'

const Scene = lazy(() => import('./HeroFluidScene.jsx'))

/* Cursor-driven fluid dye layer for the home hero (WebGL chunk). The hero
   is in view from first paint, so instead of an IntersectionObserver the
   gate waits for browser idle — shader compilation must never compete with
   the boot preloader or the typewriter entrance. Reduced motion renders
   nothing at all; the effect is pure ornament. */
export default function HeroFluid() {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced || ready) return undefined
    const arm = () => setReady(true)
    const usedIdle = 'requestIdleCallback' in window
    const id = usedIdle
      ? window.requestIdleCallback(arm, { timeout: 2500 })
      : window.setTimeout(arm, 600)
    return () => {
      if (usedIdle) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
    }
  }, [reduced, ready])

  if (reduced || !ready) return null
  return (
    <div className={styles.fluid} aria-hidden="true">
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </div>
  )
}
