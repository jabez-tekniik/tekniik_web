import Reveal from '../components/Reveal.jsx'
import { IconClose, IconCheck } from '../components/Icon.jsx'
import { PROBLEM } from '../data/content.js'
import styles from './Problem.module.css'

export default function Problem() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.head}>
            <Reveal className={styles.meta}>
              <span className={styles.index}>04</span>
              <span className={styles.eyebrow}>{PROBLEM.eyebrow}</span>
            </Reveal>
            <Reveal as="h2" delay={60} className={styles.heading}>
              {PROBLEM.heading}
            </Reveal>
            {PROBLEM.paragraphs.map((p, i) => (
              <Reveal key={i} as="p" delay={(i + 2) * 70} className={styles.para}>
                {p}
              </Reveal>
            ))}
          </div>

          <Reveal className={styles.panels} delay={100}>
            <div className={`${styles.panel} ${styles.before}`}>
              <div className={styles.panelHead}>
                <span className={styles.panelLabel}>{PROBLEM.beforeCard.label}</span>
                <span className={styles.badgeBad}>
                  <IconClose width="11" height="11" /> {PROBLEM.beforeCard.badge}
                </span>
              </div>
              <p className={styles.panelBody}>{PROBLEM.beforeCard.body}</p>
              <div className={styles.lines} aria-hidden="true">
                <span className={styles.lineBad} style={{ width: '92%' }} />
                <span className={styles.lineBad} style={{ width: '74%' }} />
                <span className={styles.lineBad} style={{ width: '52%' }} />
              </div>
            </div>

            <div className={`${styles.panel} ${styles.after}`}>
              <div className={styles.panelHead}>
                <span className={styles.panelLabel}>{PROBLEM.afterCard.label}</span>
                <span className={styles.badgeGood}>
                  <IconCheck width="11" height="11" /> {PROBLEM.afterCard.badge}
                </span>
              </div>
              <p className={styles.panelBody}>{PROBLEM.afterCard.body}</p>
              <div className={styles.lines} aria-hidden="true">
                <span className={styles.lineGood} style={{ width: '88%' }} />
                <span className={styles.lineGood} style={{ width: '94%' }} />
                <span className={styles.lineGood} style={{ width: '82%' }} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
