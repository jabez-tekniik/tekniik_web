import { m } from 'framer-motion'
import { Reveal, useMagnetic } from '../motion/index.js'
import useCounter from '../hooks/useCounter.js'
import useReveal from '../hooks/useReveal.js'
import styles from './LogoStrip.module.css'

const NUMERIC_VALUE = /^(\d+(?:\.\d+)?)(.*)$/

function ChipValue({ value }) {
  const match = NUMERIC_VALUE.exec(value)
  const numStr = match ? match[1] : null
  const suffix = match ? match[2] : ''
  const target = numStr ? parseFloat(numStr) : 0
  const decimals = numStr && numStr.includes('.') ? numStr.split('.')[1].length : 0
  const [counterRef, count] = useCounter(target)

  if (!match) {
    return <span className={styles.value}>{value}</span>
  }

  return (
    <span ref={counterRef} className={styles.value}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  )
}

function Chip({ item, revealed }) {
  const { ref, style, onMouseMove, onMouseLeave } = useMagnetic({ strength: 0.15 })

  return (
    <m.li
      ref={ref}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`${styles.chip} ${revealed ? styles.revealed : ''}`}
    >
      <ChipValue value={item.value} />
      <span className={styles.label}>{item.label}</span>
    </m.li>
  )
}

export default function LogoStrip({ items = [], eyebrow = 'Trusted by teams who pick craft over hype' }) {
  const [rowRef, revealed] = useReveal({ threshold: 0.3 })

  return (
    <section className={styles.strip} aria-label="Selected proof points">
      <div className="container">
        <Reveal as="p" className={styles.eyebrow}>
          {eyebrow}
        </Reveal>
        <ul ref={rowRef} className={styles.row}>
          {items.map((item, i) => (
            <Chip key={i} item={item} revealed={revealed} />
          ))}
        </ul>
      </div>
    </section>
  )
}
