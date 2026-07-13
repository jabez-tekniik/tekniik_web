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
      {/* low segment runs under the "g" descender, then steps UP to the
          node under "ht." — so the line never crosses the g's stroke */}
      <path
        d="M2 24 H196 l22 -14 H304"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="square"
      />
      <rect x="306" y="4" width="12" height="12" fill="currentColor" />
    </svg>
  )
}

/* Faint brand-mark watermark behind the poster — theme-aware fills
   (--wm-ink / --wm-teal). Bookends the page with FinalCta's chevron. */
function Watermark() {
  return (
    <svg
      className={styles.watermark}
      viewBox="236 288 612 504"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={styles.wmInk}
        d="M666.773,333.508l-175.323,363.24c-5.36,11.105-16.603,18.162-28.933,18.162H428.12L535.545,492.36
        c8.76-18.148-0.56-32.996-20.712-32.996H242.266l67.897-140.689c5.36-11.106,16.603-18.164,28.934-18.164h306.964
        C666.211,300.512,675.532,315.36,666.773,333.508z"
      />
      <path
        className={styles.wmTeal}
        d="M453.798,380.768c-15.283,0-29.218,8.748-35.866,22.513L236.35,779.488h137.602
        c14.087,0,26.931-8.062,33.055-20.749l99.702-206.547c3.837-7.949,11.885-13.001,20.712-13.001h219.66
        c12.298,0,23.511-7.039,28.857-18.115l67.712-140.308H453.798z"
      />
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
      <Watermark />

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
          <span className={`${styles.mask} ${styles.maskOffset}`}>
            <span className={styles.line} data-line="">
              <span className={styles.ghostWord}>{w2}</span>{' '}
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
