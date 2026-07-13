import Reveal from '../components/Reveal.jsx'
import WordRise from '../motion/ink/WordRise.jsx'
import { IconClose, IconCheck } from '../components/Icon.jsx'
import { PROBLEM } from '../data/content.js'
import styles from './Problem.module.css'

function Half({ card, tone, lineWidths, Icon, badgeClass, lineClass }) {
  return (
    <div className={`${styles.half} ${tone}`}>
      <div className={styles.halfMeta}>
        <span className={styles.halfTag}>{card.label}</span>
        <span className={badgeClass}>
          <Icon width="11" height="11" /> {card.badge}
        </span>
      </div>
      <p className={styles.halfBody}>{card.body}</p>
      <div className={styles.lines} aria-hidden="true">
        {lineWidths.map((w) => (
          <span key={w} className={lineClass} style={{ width: w }} />
        ))}
      </div>
    </div>
  )
}

/* "The verdict" — a full-width oversized statement, paragraphs offset into
   the right editorial column, then a split comparison ledger: previous
   agency (muted, hatched) vs Tekniik (teal, lit), divided by one hairline. */
export default function Problem() {
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

        <Reveal className={styles.ledger} delay={80}>
          <Half
            card={PROBLEM.beforeCard}
            tone={styles.before}
            lineWidths={['92%', '74%', '52%']}
            Icon={IconClose}
            badgeClass={styles.badgeBad}
            lineClass={styles.lineBad}
          />
          <Half
            card={PROBLEM.afterCard}
            tone={styles.after}
            lineWidths={['88%', '94%', '82%']}
            Icon={IconCheck}
            badgeClass={styles.badgeGood}
            lineClass={styles.lineGood}
          />
        </Reveal>
      </div>
    </section>
  )
}
