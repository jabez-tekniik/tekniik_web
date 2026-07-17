import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal.jsx'
import useReveal from '../hooks/useReveal.js'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { StarredText } from './Icon.jsx'
import { NUMBERS_HEAD, NUMBERS_DETAILS } from '../data/content.js'
import styles from './LogoStrip.module.css'

// Only genuine numeric proof points belong here — values that begin with a
// digit. Non-numeric brand words (Senior, AI-native, Long-term) are
// intentionally excluded from this section.
const NUMERIC_VALUE = /^(\d+(?:\.\d+)?)(.*)$/

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

/* One shared ignition drives the whole board: reveal flips `on`, a single
   rAF loop eases progress 0→1 and every count-up derives from it, so the
   base layer and its cursor-lit clone can never drift apart. */
function useIgnition({ duration = 1600 } = {}) {
  const [boardRef, on] = useReveal({ threshold: 0.25 })
  const reduced = useReducedMotion()
  const [p, setP] = useState(0)

  useEffect(() => {
    if (!on || reduced) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration)
      setP(easeOutQuart(t))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, reduced, duration])

  return [boardRef, on, reduced ? 1 : p]
}

/* The same stat markup renders twice: the readable base layer, and an
   aria-hidden "hot" clone above it that only shows through the cursor's
   light mask. Identical DOM + identical grid = pixel-identical layout. */
function StatsLayer({ stats, hot = false }) {
  return (
    <div
      className={`${styles.layer} ${hot ? styles.layerHot : ''}`}
      aria-hidden={hot || undefined}
    >
      {stats.map((s, i) => (
        <div key={s.label} className={styles.stat} style={{ '--row': i }}>
          <span className={styles.statValue}>
            {s.display}
            <span className={styles.statGlyph}>
              <StarredText text={s.glyph} />
            </span>
          </span>
          <span className={styles.statRule} />
          <span className={styles.statLabel}>{s.label}</span>
          {s.detail && <span className={styles.statDetail}>{s.detail}</span>}
        </div>
      ))}
    </div>
  )
}

/* "The Numbers" — signal field. A full-bleed deep-navy stage: statement head,
   then four oversized readouts on an asymmetric grid that ink-fill and count
   up on scroll. A breathing ambient glow keeps the band alive; on fine
   pointers a teal light follows the cursor — brightening the dot grid and
   turning whatever readout it touches to signal-teal. All pointer work is
   direct DOM (rAF-throttled CSS vars), never React state. */
export default function LogoStrip({ items = [] }) {
  const sectionRef = useRef(null)
  const [boardRef, on, progress] = useIgnition()

  const stats = items
    .map((item) => ({ ...item, match: NUMERIC_VALUE.exec(item.value) }))
    .filter((item) => item.match)
    .map((item) => {
      const numStr = item.match[1]
      const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
      return {
        label: item.label,
        display: (parseFloat(numStr) * progress).toFixed(decimals),
        glyph: item.match[2],
        detail: NUMBERS_DETAILS[item.label],
      }
    })

  useEffect(() => {
    const section = sectionRef.current
    const board = boardRef.current
    if (!section || !board) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let raf = 0
    let last = null
    const frame = () => {
      raf = 0
      const sr = section.getBoundingClientRect()
      const br = board.getBoundingClientRect()
      section.style.setProperty('--sx', `${last.clientX - sr.left}px`)
      section.style.setProperty('--sy', `${last.clientY - sr.top}px`)
      section.style.setProperty('--bx', `${last.clientX - br.left}px`)
      section.style.setProperty('--by', `${last.clientY - br.top}px`)
    }
    const move = (e) => {
      last = e
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const enter = () => section.classList.add(styles.hasLight)
    const leave = () => section.classList.remove(styles.hasLight)

    section.addEventListener('pointermove', move)
    section.addEventListener('pointerenter', enter)
    section.addEventListener('pointerleave', leave)
    return () => {
      section.removeEventListener('pointermove', move)
      section.removeEventListener('pointerenter', enter)
      section.removeEventListener('pointerleave', leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [boardRef])

  return (
    <section
      ref={sectionRef}
      className={styles.band}
      aria-label="Selected proof points"
    >
      <div className={styles.dots} aria-hidden="true" />
      <div className={styles.pulse} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.dotsHot} aria-hidden="true" />
      <div className={styles.aura} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.metaRow}>
          <span className={styles.metaNode} aria-hidden="true" />
          <span className={styles.index}>03</span>
          <span className={styles.eyebrow}>{NUMBERS_HEAD.eyebrow}</span>
        </Reveal>

        <Reveal as="h2" delay={90} className={styles.statement}>
          {NUMBERS_HEAD.headline}{' '}
          <span className={styles.statementAccent}>{NUMBERS_HEAD.headlineAccent}</span>
        </Reveal>

        <div
          ref={boardRef}
          className={`${styles.board} ${on ? styles.on : ''}`}
        >
          <StatsLayer stats={stats} />
          <StatsLayer stats={stats} hot />
        </div>
      </div>
    </section>
  )
}
