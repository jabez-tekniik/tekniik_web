import Reveal from '../components/Reveal.jsx'
import WordRise from '../motion/ink/WordRise.jsx'
import useReveal from '../hooks/useReveal.js'
import { IconClose, IconCheck } from '../components/Icon.jsx'
import { PROBLEM } from '../data/content.js'
import styles from './Problem.module.css'

/* Audit rows — label + verdict + meaningful fill level, all three derived
   from the beforeCard/afterCard copy ("4 months late", "features missing",
   "no documentation" ↔ "on time", "delivered", "full documentation"). */
const BEFORE_ROWS = [
  { label: 'Timeline', value: '4 months late', width: '34%' },
  { label: 'Scope', value: 'Incomplete', width: '55%' },
  { label: 'Documentation', value: 'Missing', width: '14%' },
]
const AFTER_ROWS = [
  { label: 'Timeline', value: 'On time', width: '96%' },
  { label: 'Scope', value: 'Delivered', width: '90%' },
  { label: 'Documentation', value: 'Complete', width: '100%' },
]

function Half({ card, tone, rows, Icon, badgeClass, lineClass, valueClass }) {
  return (
    <div className={`${styles.half} ${tone}`}>
      <div className={styles.halfMeta}>
        <span className={styles.halfTag}>{card.label}</span>
        <span className={badgeClass}>
          <Icon width="11" height="11" /> {card.badge}
        </span>
      </div>
      <p className={styles.halfBody}>{card.body}</p>
      <div className={styles.audit}>
        {rows.map((r, i) => (
          <div key={r.label} className={styles.auditRow} style={{ '--i': i }}>
            <div className={styles.auditMeta}>
              <span className={styles.auditLabel}>{r.label}</span>
              <span className={valueClass}>{r.value}</span>
            </div>
            <span className={styles.track} aria-hidden="true">
              <span className={lineClass} style={{ width: r.width }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* "The verdict" — a full-width oversized statement, paragraphs offset into
   the right editorial column, then a split comparison ledger: previous
   agency (muted, hatched) vs Tekniik (teal, lit), divided by one hairline. */
export default function Problem() {
  const [ledgerRef, ledgerIn] = useReveal({ threshold: 0.25 })
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.metaRow}>
          <span className={styles.index}>04</span>
          <span className={styles.eyebrow}>{PROBLEM.eyebrow}</span>
        </Reveal>

        <WordRise
          text={PROBLEM.heading}
          as="h2"
          staggerMs={40}
          className={styles.statement}
        />

        <div className={styles.paraRow}>
          <div className={styles.paraCol}>
            {PROBLEM.paragraphs.map((p, i) => (
              <Reveal key={i} as="p" delay={i * 90} className={styles.para}>
                {p}
              </Reveal>
            ))}
          </div>
        </div>

        <div
          ref={ledgerRef}
          className={`${styles.ledger} ${ledgerIn ? styles.play : ''}`}
        >
          <Half
            card={PROBLEM.beforeCard}
            tone={styles.before}
            rows={BEFORE_ROWS}
            Icon={IconClose}
            badgeClass={styles.badgeBad}
            lineClass={styles.lineBad}
            valueClass={styles.valueBad}
          />
          <Half
            card={PROBLEM.afterCard}
            tone={styles.after}
            rows={AFTER_ROWS}
            Icon={IconCheck}
            badgeClass={styles.badgeGood}
            lineClass={styles.lineGood}
            valueClass={styles.valueGood}
          />
        </div>
      </div>
    </section>
  )
}
