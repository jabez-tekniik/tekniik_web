import Button from './Button.jsx'
import {
  useInViewOnce,
  useMagneticInk,
  createTimeline,
  stagger,
  utils,
  svg,
  setRiseHidden,
  riseIn,
  EASE_INOUT,
  EASE_OUT,
} from '../motion/ink/index.js'
import { HERO, TERMINAL_FRAMES } from '../data/content.js'
import styles from './Hero.module.css'

// type → human label for the proof ticker
const FRAME_LABEL = {
  website: 'Websites',
  'web-app': 'Web Apps',
  'mobile-app': 'Mobile Apps',
  'ai-automation': 'AI Automation',
}

/* Signal trace — a precise circuit-style underline that draws in beneath
   the final word, ending in a node. Engineered, not hand-drawn. */
function Trace() {
  return (
    <svg
      className={styles.trace}
      viewBox="0 0 320 30"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      data-trace=""
    >
      <path
        d="M2 10 H196 l22 14 H304"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="square"
      />
      <rect x="306" y="17" width="12" height="12" fill="currentColor" />
    </svg>
  )
}

// One proof group — duplicated in the DOM so the marquee can loop seamlessly.
function TickerGroup() {
  return (
    <div className={styles.tickerGroup}>
      {TERMINAL_FRAMES.map((frame) => (
        <div key={frame.type} className={styles.tickerItem}>
          <span className={styles.tickerLabel}>{FRAME_LABEL[frame.type]}</span>
          <span className={styles.tickerValue}>{frame.result}</span>
          <span className={styles.tickerDot} aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}

export default function Hero() {
  const magneticRef = useMagneticInk(0.3)
  const [w1, w2, w3] = HERO.headline

  const rootRef = useInViewOnce(
    (el) => {
      const lines = el.querySelectorAll('[data-line]')
      const fades = el.querySelectorAll('[data-fade]')
      const traceEl = el.querySelector('[data-trace]')
      return {
        init() {
          setRiseHidden(lines)
          utils.set(fades, { opacity: 0, translateY: 14 })
          if (traceEl) utils.set(traceEl, { opacity: 0 })
        },
        play() {
          const tl = createTimeline()
          tl.add(lines, riseIn({ duration: 950, delay: stagger(95) }), 0)
          if (traceEl) {
            const drawables = svg.createDrawable(traceEl.querySelectorAll('path, rect'))
            utils.set(traceEl, { opacity: 1 })
            tl.add(drawables, { draw: '0 1', duration: 750, ease: EASE_INOUT }, 620)
          }
          tl.add(
            fades,
            { opacity: 1, translateY: 0, duration: 700, delay: stagger(110), ease: EASE_OUT },
            380,
          )
        },
      }
    },
    { threshold: 0 },
  )

  return (
    <section className={styles.hero} ref={rootRef}>
      <div className={styles.blueprint} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        {/* Meta bar — eyebrow left, trust right, under a hairline */}
        <div className={styles.metaBar} data-fade="">
          <span className={styles.eyebrow}>
            <span className={styles.node} aria-hidden="true" />
            {HERO.eyebrow}
          </span>
          <span className={styles.trust}>{HERO.trust}</span>
        </div>

        {/* Oversized flush-left poster statement */}
        <h1 className={styles.headline}>
          <span className={styles.mask}>
            <span className={styles.line} data-line="">
              {w1}
            </span>
          </span>
          <span className={styles.mask}>
            <span className={styles.line} data-line="">
              {w2}{' '}
              <span className={styles.signal}>
                {w3}
                <Trace />
              </span>
              <span className={styles.caret} aria-hidden="true" />
            </span>
          </span>
        </h1>

        {/* Lower row — supporting line + actions */}
        <div className={styles.lower}>
          <p className={styles.sub} data-fade="">
            {HERO.sub}
          </p>

          <div className={styles.actions} data-fade="">
            <span ref={magneticRef} className={styles.magnetic}>
              <Button to={HERO.primaryCta.to} variant="primary" arrow>
                {HERO.primaryCta.label}
              </Button>
            </span>
            <Button to={HERO.ghostCta.to} variant="ghost" arrow>
              {HERO.ghostCta.label}
            </Button>
          </div>
        </div>
      </div>

      {/* Full-bleed infinite proof ticker (real outcome data) */}
      <div className={styles.ticker} aria-hidden="true" data-fade="">
        <div className={styles.tickerTrack}>
          <TickerGroup />
          <TickerGroup />
        </div>
      </div>
    </section>
  )
}
