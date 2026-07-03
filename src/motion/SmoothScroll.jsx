import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import useReducedMotion from '../hooks/useReducedMotion.js'

// Module-scoped so ScrollToTop and section hooks can reach the instance.
let lenisInstance = null
// eslint-disable-next-line react-refresh/only-export-components -- intentional utility accessor alongside the provider, per task brief
export const getLenis = () => lenisInstance

export default function SmoothScroll({ children }) {
  const reduced = useReducedMotion()
  const { pathname } = useLocation()

  useEffect(() => {
    if (reduced) return undefined
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1 })
    lenisInstance = lenis
    let raf = 0
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [reduced])

  // Reset scroll on route change (Lenis owns scroll when active).
  useEffect(() => {
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true })
  }, [pathname])

  return children
}
