import Reveal from '../components/Reveal.jsx'
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
      {match[2]}
    </span>
  )
}

function Stat({ item, index }) {
  return (
    <Reveal as="li" className={styles.cell} delay={index * 60}>
      <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
      <StatValue match={item.match} />
      <span className={styles.label}>{item.label}</span>
    </Reveal>
  )
}

export default function LogoStrip({ items = [], eyebrow = 'THE NUMBERS' }) {
  // Numeric-only: attach the parsed match so the render stays declarative.
  const numeric = items
    .map((item) => ({ ...item, match: NUMERIC_VALUE.exec(item.value) }))
    .filter((item) => item.match)

  return (
    <section className={styles.section} aria-label="Selected proof points">
      <div className="container">
        <Reveal className={styles.head}>
          <span className={styles.index}>03</span>
          <span className={styles.eyebrow}>{eyebrow}</span>
        </Reveal>

        <ul className={styles.grid}>
          {numeric.map((item, i) => (
            <Stat key={item.value} item={item} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
