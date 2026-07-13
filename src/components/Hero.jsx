import Button from './Button.jsx'
import HeroParticles from './HeroParticles.jsx'
import {
  useInViewOnce,
  useMagneticInk,
  createTimeline,
  stagger,
  utils,
  svg,
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

// per-character delay for the typewriter — small deterministic jitter so
// the rhythm reads human, with a longer beat at each word boundary
const TYPE_BASE = 44
const TYPE_JITTER = [0, 16, 7]
const WORD_PAUSE = 230
const START_PAUSE = 560

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

/* One word split into per-character spans the typewriter can reveal.
   inline-block + nowrap keeps line wrapping at word level. */
function TypedWord({ word, className = '' }) {
  return (
    <span className={`${styles.word} ${className}`}>
      {word.split('').map((c, i) => (
        <span key={`${c}-${i}`} data-ch="">
          {c}
        </span>
      ))}
    </span>
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
      const chars = Array.from(el.querySelectorAll('[data-ch]'))
      const fades = el.querySelectorAll('[data-fade]')
      const traceEl = el.querySelector('[data-trace]')
      const caret = el.querySelector('[data-caret]')
      const headline = el.querySelector('[data-headline]')
      // word boundaries → indexes that get the longer WORD_PAUSE beat
      const boundaries = new Set([w1.length, w1.length + w2.length])

      let cancelled = false
      let timer = 0
      let typed = -1

      // park the caret against a character's edge (right edge once typed,
      // left edge of the first character before typing starts)
      const placeCaret = (ch, side = 'right') => {
        if (!caret || !headline || !ch) return
        const base = headline.getBoundingClientRect()
        const r = ch.getBoundingClientRect()
        const x = (side === 'right' ? r.right : r.left) - base.left + r.height * 0.03
        const y = r.top - base.top + r.height * 0.12
        caret.style.height = `${r.height * 0.76}px`
        caret.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }

      const finish = () => {
        caret.classList.add(styles.caretBlink)
        const tl = createTimeline()
        if (traceEl) {
          const drawables = svg.createDrawable(traceEl.querySelectorAll('path, rect'))
          utils.set(traceEl, { opacity: 1 })
          tl.add(drawables, { draw: '0 1', duration: 700, ease: EASE_INOUT }, 0)
        }
        tl.add(
          fades,
          { opacity: 1, translateY: 0, duration: 700, delay: stagger(110), ease: EASE_OUT },
          160,
        )
      }

      const typeNext = () => {
        if (cancelled) return
        typed += 1
        if (typed >= chars.length) {
          finish()
          return
        }
        const ch = chars[typed]
        ch.style.visibility = 'visible'
        placeCaret(ch)
        const delay =
          TYPE_BASE +
          TYPE_JITTER[typed % TYPE_JITTER.length] +
          (boundaries.has(typed + 1) ? WORD_PAUSE : 0)
        timer = setTimeout(typeNext, delay)
      }

      const onResize = () => {
        if (typed < 0) placeCaret(chars[0], 'left')
        else placeCaret(chars[Math.min(typed, chars.length - 1)])
      }
      window.addEventListener('resize', onResize, { passive: true })

      return {
        init() {
          chars.forEach((c) => {
            c.style.visibility = 'hidden'
          })
          utils.set(fades, { opacity: 0, translateY: 14 })
          if (traceEl) utils.set(traceEl, { opacity: 0 })
        },
        play() {
          // wait for Satoshi so caret metrics don't shift mid-type
          const start = () => {
            if (cancelled) return
            placeCaret(chars[0], 'left')
            caret.style.opacity = '1'
            caret.classList.add(styles.caretBlink)
            timer = setTimeout(() => {
              if (cancelled) return
              caret.classList.remove(styles.caretBlink)
              typeNext()
            }, START_PAUSE)
          }
          if (document.fonts?.ready) document.fonts.ready.then(start)
          else start()
        },
        cleanup() {
          cancelled = true
          clearTimeout(timer)
          window.removeEventListener('resize', onResize)
        },
      }
    },
    { threshold: 0 },
  )

  return (
    <section className={styles.hero} ref={rootRef}>
      <div className={styles.blueprint} aria-hidden="true" />
      <Watermark />
      <HeroParticles />

      <div className={`container ${styles.inner}`}>
        {/* Meta bar — eyebrow left, trust right, under a hairline */}
        <div className={styles.metaBar} data-fade="">
          <span className={styles.eyebrow}>
            <span className={styles.node} aria-hidden="true" />
            {HERO.eyebrow}
          </span>
          <span className={styles.trust}>{HERO.trust}</span>
        </div>

        {/* Oversized flush-left poster statement — typed in on load */}
        <h1 className={styles.headline} data-headline="">
          <span className={styles.srOnly}>{`${w1} ${w2} ${w3}`}</span>
          <span aria-hidden="true">
            <span className={styles.line}>
              <TypedWord word={w1} />
            </span>
            <span className={styles.line}>
              <TypedWord word={w2} className={styles.ghostWord} />{' '}
              <span className={styles.signal}>
                <TypedWord word={w3} />
                <Trace />
              </span>
            </span>
          </span>
          <span className={styles.caret} data-caret="" aria-hidden="true" />
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
