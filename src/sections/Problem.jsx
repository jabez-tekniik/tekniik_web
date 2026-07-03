import { Reveal } from '../motion/index.js'
import Eyebrow from '../components/Eyebrow.jsx'
import { IconClose, IconCheck } from '../components/Icon.jsx'
import { PROBLEM } from '../data/content.js'
import styles from './Problem.module.css'

export default function Problem() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.body}>
            <Reveal as="div" delay={0 * 0.08}>
              <Eyebrow tone="muted">{PROBLEM.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal as="h2" delay={1 * 0.08} className={styles.heading}>
              {PROBLEM.heading}
            </Reveal>
            {PROBLEM.paragraphs.map((p, i) => (
              <Reveal key={i} as="p" delay={(i + 2) * 0.08} className={styles.para}>
                {p}
              </Reveal>
            ))}
          </div>

          <div className={styles.visual}>
            <Reveal delay={0.12}>
              <div className={`${styles.card} ${styles.before}`}>
                <div className={styles.cardHead}>
                  <span className={styles.cardLabel}>// {PROBLEM.beforeCard.label}</span>
                  <span className={styles.badgeBad}>
                    <IconClose width="11" height="11" /> {PROBLEM.beforeCard.badge}
                  </span>
                </div>
                <p className={styles.cardBody}>{PROBLEM.beforeCard.body}</p>
                <div className={styles.cardLines}>
                  <span className={styles.lineBad} style={{ width: '92%' }} />
                  <span className={styles.lineBad} style={{ width: '78%' }} />
                  <span className={styles.lineBad} style={{ width: '55%' }} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <div className={`${styles.card} ${styles.after}`}>
                <div className={styles.cardHead}>
                  <span className={styles.cardLabel}>// {PROBLEM.afterCard.label}</span>
                  <span className={styles.badgeGood}>
                    <IconCheck width="11" height="11" /> {PROBLEM.afterCard.badge}
                  </span>
                </div>
                <p className={styles.cardBody}>{PROBLEM.afterCard.body}</p>
                <div className={styles.cardLines}>
                  <span className={styles.lineGood} style={{ width: '88%' }} />
                  <span className={styles.lineGood} style={{ width: '94%' }} />
                  <span className={styles.lineGood} style={{ width: '82%' }} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
