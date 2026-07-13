import Reveal from './Reveal.jsx'
import useCounter from '../hooks/useCounter.js'
import styles from './LogoStrip.module.css'

// Only genuine numeric proof points belong here — values that begin with a
// digit. The numeric part gets an on-scroll count-up; any trailing glyph
// (+, %, ★) is preserved verbatim. Non-numeric brand words (Senior, AI-native,
// Long-term) are intentionally excluded from this section.
const NUMERIC_VALUE = /^(\d+(?:\.\d+)?)(.*)$/

function StatValue({ match }) {
  const numStr = match[1]
  const target = parseFloat(numStr)
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
  // Internally disabled under prefers-reduced-motion (renders the target).
  const [counterRef, count] = useCounter(target)

  return (
    <span ref={counterRef} className={styles.value}>
      {count.toFixed(decimals)}
      <span className={styles.valueGlyph}>{match[2]}</span>
    </span>
  )
}

/* "The Numbers" — one full-bleed data band. Giant instrument-panel readouts
   divided by vertical hairlines, mono meta rail on the left. */
export default function LogoStrip({ items = [], eyebrow = 'THE NUMBERS' }) {
  // Numeric-only: attach the parsed match so the render stays declarative.
  const numeric = items
    .map((item) => ({ ...item, match: NUMERIC_VALUE.exec(item.value) }))
    .filter((item) => item.match)

  return (
    <section className={styles.band} aria-label="Selected proof points">
      <Reveal className={styles.inner}>
        <div className={styles.rail}>
          <span className={styles.railIndex}>03</span>
          <span className={styles.railEyebrow}>{eyebrow}</span>
        </div>
        {numeric.map((item, i) => (
          <div key={item.value} className={styles.cell}>
            <StatValue match={item.match} />
            <span className={styles.label}>{item.label}</span>
            <span className={styles.cellNum} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
