import useCounter from '../hooks/useCounter.js'
import { StarredText } from './Icon.jsx'
import styles from './StatBlock.module.css'

function parse(input) {
  if (typeof input === 'number') return { num: input, suffix: '', prefix: '', decimals: 0 }
  const str = String(input)
  // capture optional currency-style prefix, then digits/commas/decimal, then anything trailing
  const match = str.match(/^(\D*)([\d,.]+)(.*)$/)
  // fully non-numeric values ('Free', 'Senior') render as-is — no counter
  if (!match) return { raw: str }
  const [, prefix, numericPart, suffix] = match
  const cleaned = numericPart.replace(/,/g, '')
  const num = parseFloat(cleaned)
  if (Number.isNaN(num)) return { raw: str }
  const decimals = cleaned.includes('.') ? cleaned.split('.')[1].length : 0
  return { num, prefix, suffix, decimals }
}

function format(n, { decimals = 0, suffix = '', prefix = '' } = {}) {
  const fixed = n.toFixed(decimals)
  const [whole, dec] = fixed.split('.')
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${prefix}${withCommas}${dec ? '.' + dec : ''}${suffix}`
}

export default function StatBlock({
  value,
  label,
  align = 'left',
}) {
  const parsed = parse(value)
  const [ref, n] = useCounter(parsed.raw != null ? 0 : parsed.num, { duration: 1400 })
  const display =
    parsed.raw != null
      ? parsed.raw
      : format(n, {
          decimals: parsed.decimals,
          prefix: parsed.prefix,
          suffix: parsed.suffix,
        })

  return (
    <div ref={ref} className={`${styles.stat} ${styles[align] || ''}`}>
      <div className={styles.divider} aria-hidden="true" />
      {/* site rule: ★ never renders as a text glyph — StarredText swaps it
          for the IconStar SVG (suffix strings like '4.9★') */}
      <div className={styles.value}>
        <StarredText text={display} />
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  )
}
