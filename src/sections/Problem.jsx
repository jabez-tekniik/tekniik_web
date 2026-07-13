import { useRef } from 'react'
import { m, useTransform } from 'framer-motion'
import { Reveal, useScrollProgress } from '../motion/index.js'
import { IconClose, IconCheck } from '../components/Icon.jsx'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { PROBLEM } from '../data/content.js'
import styles from './Problem.module.css'

export default function Problem() {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()

  // Scroll-driven emphasis crossfade — the "After" panel comes alive while the
  // "Before" panel settles back. Hooks always run; only the style binding is
  // gated for reduced motion (transform/opacity only, GPU-friendly).
  const progress = useScrollProgress(sectionRef)
  const beforeOpacity = useTransform(progress, [0.15, 0.55], [1, 0.66])
  const afterOpacity = useTransform(progress, [0.15, 0.55], [0.78, 1])
  const afterY = useTransform(progress, [0.15, 0.55], [8, 0])

  const beforeStyle = reducedMotion ? undefined : { opacity: beforeOpacity }
  const afterStyle = reducedMotion ? undefined : { opacity: afterOpacity, y: afterY }

  return (
    <section ref={sectionRef} className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.head}>
            <Reveal className={styles.meta} y={0}>
              <span className={styles.index}>04</span>
              <span className={styles.eyebrow}>{PROBLEM.eyebrow}</span>
            </Reveal>
            <Reveal as="h2" delay={0.06} className={styles.heading}>
              {PROBLEM.heading}
            </Reveal>
            {PROBLEM.paragraphs.map((p, i) => (
              <Reveal key={i} as="p" delay={(i + 2) * 0.07} className={styles.para}>
                {p}
              </Reveal>
            ))}
          </div>

          <Reveal className={styles.panels} y={28} delay={0.1}>
            <m.div className={`${styles.panel} ${styles.before}`} style={beforeStyle}>
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
            </m.div>

            <m.div className={`${styles.panel} ${styles.after}`} style={afterStyle}>
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
            </m.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
