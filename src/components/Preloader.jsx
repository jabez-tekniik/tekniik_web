import { useLayoutEffect, useRef, useState } from 'react'
import {
  createTimeline,
  utils,
  svg,
  EASE_INOUT,
  EASE_OUT,
} from '../motion/ink/index.js'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { signalPreloaderDone } from '../motion/preloader.js'
import styles from './Preloader.module.css'

// progress crawls toward 92% on its own; only real readiness (fonts +
// window load, or this ceiling) releases it to 100
const READY_TIMEOUT = 3500

// chevron mark geometry from the full brand logo (BrandLogo.jsx)
const TEAL_D = `M275.539,489.09c-4.934,0-9.433,2.824-11.58,7.269l-58.626,121.463h44.426
c4.548,0,8.695-2.603,10.672-6.699l32.19-66.686c1.239-2.566,3.837-4.197,6.687-4.197h70.92c3.971,0,7.591-2.273,9.317-5.849
l21.861-45.3H275.539z`
const INK_D = `M344.301,473.832l-56.605,117.276c-1.73,3.585-5.36,5.864-9.341,5.864h-11.105l34.683-71.853
c2.828-5.859-0.181-10.653-6.687-10.653h-88.002l21.921-45.423c1.73-3.586,5.36-5.864,9.342-5.864h99.107
C344.12,463.179,347.129,467.972,344.301,473.832z`
const VIEWBOX = '200 458 208 165'

/* Boot overlay — the chevron brand mark IS the loading indicator: it
   traces in as a ghost outline on the navy band, then a teal/white fill
   rises through the glyphs tracking real load progress (fonts + window
   load), with an electron riding the teal path. Fires
   signalPreloaderDone() once the overlay has fully faded, which is what
   releases the hero typewriter.

   `skip` (2026-08-04) turns the whole thing off for one route:
   /website-package is a PAID-ADS landing page, so a content-free brand
   wait of up to ~4.5s (trace-in + the READY_TIMEOUT ceiling + the fade)
   is spent bounce risk on traffic we paid for. The brand site still gets
   the full boot. */
export default function Preloader({ skip = false }) {
  const reduced = useReducedMotion()
  const [gone, setGone] = useState(false)
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    /* `skip` takes the same path as reduced motion: no overlay, and the
       done-signal fires at once so anything gated on it (the home hero
       typewriter) never waits on a preloader that isn't coming */
    if (skip || reduced) {
      signalPreloaderDone()
      return undefined
    }
    const el = rootRef.current
    if (!el) return undefined

    const ghosts = el.querySelectorAll('[data-ghost]')
    const fillLayer = el.querySelector('[data-fill-layer]')
    const markStack = el.querySelector('[data-mark]')
    const electron = el.querySelector('[data-electron]')
    const core = el.querySelector('[data-core]')

    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    let cancelled = false
    let raf = 0
    let entranceTimer = 0
    let readyTimer = 0
    let exitTimer = 0
    let entranceDone = false
    let exiting = false

    // hidden initial states pre-paint: ghost outlines undrawn, fill layer
    // fully clipped, no electron. The mark IS the whole indicator — the
    // "Tekniik / Loading" + NNN% readout was removed 2026-07-22 (user).
    utils.set(ghosts, { fillOpacity: 0, strokeOpacity: 0.55 })
    utils.set(electron, { opacity: 0 })
    fillLayer.style.clipPath = 'inset(100% 0 0 0)'
    const drawables = svg.createDrawable(ghosts)
    utils.set(drawables, { draw: '0 0' })

    // real readiness: fonts + window load, capped at READY_TIMEOUT
    let ready = false
    let readyAt = 0
    let readyFrom = 0
    const markReady = () => {
      ready = true
    }
    const loadDone =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((res) => window.addEventListener('load', res, { once: true }))
    Promise.all([document.fonts?.ready ?? Promise.resolve(), loadDone]).then(markReady)

    const startExit = () => {
      if (exiting || cancelled) return
      exiting = true
      // full mark lit — one glow pulse, then the whole overlay lets go
      markStack.classList.add(styles.markLit)
      const out = createTimeline()
      out.add(core, { opacity: 0, scale: 0.96, duration: 360, ease: EASE_OUT }, 320)
      out.add(el, { opacity: 0, duration: 480, ease: EASE_INOUT }, 460)
      exitTimer = setTimeout(() => {
        if (cancelled) return
        document.documentElement.style.overflow = prevOverflow
        signalPreloaderDone()
        setGone(true)
      }, 1000)
    }

    // the show starts on the first VISIBLE frame — a page loaded in a
    // background tab holds at 0 (rAF is suspended there anyway) so the
    // user never lands on a half-finished or snap-completed preloader
    let began = false
    const begin = () => {
      if (began || cancelled) return
      began = true

      // entrance: both chevrons trace in as ghost outlines, then the
      // outline settles dim and a faint ghost fill appears — the rising
      // teal/white fill on top is what reads as the actual load
      const tl = createTimeline()
      tl.add(drawables[0], { draw: '0 1', duration: 1050, ease: EASE_INOUT }, 0)
      tl.add(drawables[1], { draw: '0 1', duration: 1050, ease: EASE_INOUT }, 140)
      tl.add(
        ghosts,
        { fillOpacity: 0.1, strokeOpacity: 0.3, duration: 600, ease: EASE_OUT },
        1000,
      )
      tl.add(electron, { opacity: 1, duration: 500, ease: EASE_OUT }, 1300)
      // timer, not anime onComplete — the v4 timeline callback has failed
      // to fire in this codebase before (see Hero circuitLive)
      entranceTimer = setTimeout(() => {
        entranceDone = true
      }, tl.duration + 60)
      readyTimer = setTimeout(markReady, READY_TIMEOUT)

      // displayed progress is a pure function of elapsed time (NOT a
      // per-frame lerp — throttled tabs drop rAF and a frame-count crawl
      // stalls): asymptotic crawl to 92%, then an exponential release to
      // 100 once ready — never before 1.2s, so the fill can't sprint past
      // the outline still drawing. Direct DOM writes only: the fill layer
      // un-clips bottom-up as p rises (the site's liquid-rise idiom).
      const t0 = performance.now()
      let p = 0
      const tick = (now) => {
        if (cancelled) return
        const t = (now - t0) / 1000
        if (ready && !readyAt && t > 1.2) {
          readyAt = t
          readyFrom = p
        }
        p = readyAt
          ? readyFrom + (1 - readyFrom) * (1 - Math.exp(-(t - readyAt) / 0.35))
          : 0.92 * (1 - Math.exp(-t / 1.1))
        if (readyAt && p > 0.995) p = 1
        fillLayer.style.clipPath = `inset(${((1 - p) * 100).toFixed(2)}% 0 0 0)`
        if (p >= 1 && entranceDone) {
          startExit()
          return
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible') begin()
    }
    if (document.visibilityState === 'visible') begin()
    else document.addEventListener('visibilitychange', onVisible)

    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      cancelled = true
      cancelAnimationFrame(raf)
      clearTimeout(entranceTimer)
      clearTimeout(readyTimer)
      clearTimeout(exitTimer)
      document.documentElement.style.overflow = prevOverflow
      utils.remove(el.querySelectorAll('*'))
      utils.remove(el)
    }
  }, [skip, reduced])

  if (skip || reduced || gone) return null

  return (
    <div
      className={styles.overlay}
      ref={rootRef}
      role="status"
      aria-label="Loading Tekniik"
    >
      {/* faceted mosaic frame (reference-driven): a triangle/diamond facet
         lattice in the two primaries covers the whole viewport, deepening
         toward every screen edge, with the centre masked fully clear for
         the mark; white lattice hairlines, big ghost diamonds, soft
         sparkle glints. No viewBox — children use viewport px /
         percentages so the pattern tiles never distort at any aspect. */}
      <svg className={styles.mosaic} aria-hidden="true" focusable="false">
        <defs>
          {/* scaled 1.5× → effective 180px tile; the drift loop distance
             must stay a multiple of it */}
          <pattern
            id="pl-facets"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1.5)"
          >
            <path d="M0 0 120 0 60 60Z" fill="#72ccd6" fillOpacity="0.14" />
            <path d="M0 0 60 60 0 120Z" fill="#72ccd6" fillOpacity="0.3" />
            <path d="M120 0 60 60 120 120Z" fill="#202e5d" fillOpacity="0.14" />
            <path d="M0 120 60 60 120 120Z" fill="#72ccd6" fillOpacity="0.42" />
            <path d="M60 0 120 0 90 30Z" fill="#ffffff" fillOpacity="0.4" />
            <path d="M0 60 30 90 0 120Z" fill="#202e5d" fillOpacity="0.2" />
            <path d="M30 30 60 0 60 60Z" fill="#72ccd6" fillOpacity="0.22" />
            <path d="M60 60 120 120 60 120Z" fill="#202e5d" fillOpacity="0.12" />
          </pattern>
          {/* corner diamonds sit centered on all four tile corners so the
             pattern wrap reassembles them seamlessly */}
          <pattern
            id="pl-facets-big"
            width="240"
            height="240"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1.5)"
          >
            <path d="M120 16 224 120 120 224 16 120Z" fill="#72ccd6" fillOpacity="0.12" />
            <path d="M0 -44 44 0 0 44 -44 0Z" fill="#ffffff" fillOpacity="0.26" />
            <path d="M240 -44 284 0 240 44 196 0Z" fill="#ffffff" fillOpacity="0.26" />
            <path d="M0 196 44 240 0 284 -44 240Z" fill="#ffffff" fillOpacity="0.26" />
            <path d="M240 196 284 240 240 284 196 240Z" fill="#ffffff" fillOpacity="0.26" />
          </pattern>
          <pattern
            id="pl-lattice"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1.5)"
          >
            <path d="M0 0 60 60M60 0 0 60" stroke="#ffffff" strokeWidth="1.4" fill="none" />
          </pattern>
          {/* edge tints — the mosaic deepens toward the screen walls */}
          <radialGradient id="pl-edge-teal" cx="0.5" cy="0.5" r="0.72">
            <stop offset="0" stopColor="#72ccd6" stopOpacity="0" />
            <stop offset="0.55" stopColor="#72ccd6" stopOpacity="0" />
            <stop offset="1" stopColor="#72ccd6" stopOpacity="0.5" />
          </radialGradient>
          <radialGradient id="pl-edge-navy" cx="0.5" cy="0.5" r="0.72">
            <stop offset="0" stopColor="#202e5d" stopOpacity="0" />
            <stop offset="0.62" stopColor="#202e5d" stopOpacity="0" />
            <stop offset="1" stopColor="#202e5d" stopOpacity="0.22" />
          </radialGradient>
          {/* inverted radial mask: centre fully clear (white canvas for the
             mark), pattern strengthens toward every edge */}
          <radialGradient id="pl-fade" cx="0.5" cy="0.5" r="0.72">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.68" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
          </radialGradient>
          <mask id="pl-mosaic-mask">
            <rect width="100%" height="100%" fill="url(#pl-fade)" />
          </mask>
          <path
            id="pl-spark"
            d="M0 -12 2.4 -2.4 12 0 2.4 2.4 0 12 -2.4 2.4 -12 0 -2.4 -2.4Z"
            fill="#ffffff"
          />
        </defs>

        <g mask="url(#pl-mosaic-mask)">
          <rect width="100%" height="100%" fill="url(#pl-edge-teal)" />
          <rect width="100%" height="100%" fill="url(#pl-edge-navy)" />
          <g className={styles.facetDrift}>
            {/* extra width so the one-tile drift loop never uncovers an edge */}
            <rect x="-180" width="200%" height="100%" fill="url(#pl-facets)" />
          </g>
          <rect width="100%" height="100%" fill="url(#pl-facets-big)" />
          <rect width="100%" height="100%" fill="url(#pl-lattice)" opacity="0.55" />
        </g>

        <use href="#pl-spark" x="12%" y="20%" className={styles.spark} />
        <use
          href="#pl-spark"
          x="86%"
          y="16%"
          className={styles.spark}
          style={{ animationDelay: '1.3s' }}
        />
        <use
          href="#pl-spark"
          x="18%"
          y="82%"
          className={styles.spark}
          style={{ animationDelay: '2.1s' }}
        />
        <use
          href="#pl-spark"
          x="88%"
          y="76%"
          className={styles.spark}
          style={{ animationDelay: '3s' }}
        />
      </svg>
      <div className={styles.core} data-core="" aria-hidden="true">
        {/* ghost outline below, progress-clipped full-color mark above */}
        <div className={styles.markStack} data-mark="">
          <svg className={styles.mark} viewBox={VIEWBOX} focusable="false">
            <path
              data-ghost=""
              id="pl-orbit"
              className={styles.ghostTeal}
              d={TEAL_D}
            />
            <path data-ghost="" className={styles.ghostInk} d={INK_D} />
            <circle data-electron="" className={styles.electron} r="4">
              <animateMotion dur="3.2s" repeatCount="indefinite">
                <mpath href="#pl-orbit" />
              </animateMotion>
            </circle>
          </svg>
          <svg
            className={`${styles.mark} ${styles.markFill}`}
            data-fill-layer=""
            viewBox={VIEWBOX}
            focusable="false"
          >
            <path className={styles.fillTeal} d={TEAL_D} />
            <path className={styles.fillInk} d={INK_D} />
          </svg>
        </div>

      </div>
    </div>
  )
}
