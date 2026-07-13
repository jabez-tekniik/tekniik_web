import { m } from 'framer-motion'
import Button from './Button.jsx'
import { Reveal, useMagnetic } from '../motion/index.js'
import { HERO, TERMINAL_FRAMES } from '../data/content.js'
import styles from './Hero.module.css'

// type → human label for the proof ticker
const FRAME_LABEL = {
  website: 'Websites',
  'web-app': 'Web Apps',
  'mobile-app': 'Mobile Apps',
  'ai-automation': 'AI Automation',
}

// Hand-drawn marker underline that draws in beneath the accent word (CSS
// stroke animation; drawn instantly under prefers-reduced-motion).
function Marker() {
  return (
    <svg
      className={styles.marker}
      viewBox="0 0 320 26"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M6 17c48-9 118-11 172-6 40 4 82 3 136-4"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
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
  const { ref: magneticRef, style: magneticStyle, onMouseMove: magneticMove, onMouseLeave: magneticLeave } =
    useMagnetic({ strength: 0.35 })

  const [w1, w2, w3] = HERO.headline

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        {/* Meta bar — eyebrow left, trust right, under a hairline */}
        <Reveal className={styles.metaBar} y={0}>
          <span className={styles.eyebrow}>
            <span className={styles.node} aria-hidden="true" />
            {HERO.eyebrow}
          </span>
          <span className={styles.trust}>{HERO.trust}</span>
        </Reveal>

        {/* Oversized flush-left poster statement */}
        <Reveal as="h1" className={styles.headline}>
          <span className={styles.line}>{w1}</span>
          <span className={styles.line}>
            {w2}{' '}
            <span className={styles.accent}>
              {w3}
              <Marker />
            </span>
          </span>
        </Reveal>

        {/* Lower row — supporting line + actions */}
        <div className={styles.lower}>
          <Reveal as="p" delay={0.1} className={styles.sub}>
            {HERO.sub}
          </Reveal>

          <Reveal delay={0.2} className={styles.actions}>
            <m.span
              ref={magneticRef}
              style={magneticStyle}
              onMouseMove={magneticMove}
              onMouseLeave={magneticLeave}
              className={styles.magnetic}
            >
              <Button to={HERO.primaryCta.to} variant="primary" arrow>
                {HERO.primaryCta.label}
              </Button>
            </m.span>
            <Button to={HERO.ghostCta.to} variant="ghost" arrow>
              {HERO.ghostCta.label}
            </Button>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed infinite proof ticker (real outcome data) */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          <TickerGroup />
          <TickerGroup />
        </div>
      </div>
    </section>
  )
}
