import { useRef } from 'react'
import { m, useTransform } from 'framer-motion'
import { Reveal, useScrollProgress } from '../motion/index.js'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { PROCESS } from '../data/content.js'
import styles from './Process.module.css'

/* One node on the rail. Its inner dot scales in and its halo fades in as the
   scroll-linked fill passes this node's offset. useTransform is called ONCE
   here (never inside the parent .map) so hooks stay out of loops. */
function Node({ progress, index, total, reduced }) {
  const dotScale = useTransform(
    progress,
    [index / total, index / total + 0.15],
    [0, 1],
  )

  return (
    <span className={styles.dot} aria-hidden="true">
      <m.span
        className={styles.dotHalo}
        style={{ opacity: reduced ? 1 : dotScale }}
      />
      <m.span
        className={styles.dotInner}
        style={{ scale: reduced ? 1 : dotScale }}
      />
    </span>
  )
}

export default function Process() {
  const stepsRef = useRef(null)
  const reduced = useReducedMotion()
  // Hooks run unconditionally; only the style VALUES below are gated for reduced motion.
  const progress = useScrollProgress(stepsRef, ['start 80%', 'end 60%'])
  const total = PROCESS.steps.length

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.head}>
          <div className={styles.meta}>
            <span className={styles.index}>06</span>
            <span className={styles.eyebrow}>{PROCESS.eyebrow}</span>
          </div>
          <h2 className={styles.heading}>{PROCESS.heading}</h2>
          <p className={styles.sub}>{PROCESS.sub}</p>
        </Reveal>

        <div ref={stepsRef} className={styles.steps}>
          <div className={styles.track} aria-hidden="true">
            <span className={styles.trackLine} />
            {/* Desktop horizontal fill (scaleX); hidden ≤640px via CSS. */}
            <m.span
              className={styles.trackFill}
              style={{ scaleX: reduced ? 1 : progress }}
            />
            {/* Mobile vertical fill (scaleY); shown only ≤640px via CSS. */}
            <m.span
              className={styles.trackFillV}
              style={{ scaleY: reduced ? 1 : progress }}
            />
          </div>

          <ol className={styles.list}>
            {PROCESS.steps.map((step, i) => (
              <li key={step.n} className={styles.item}>
                <Node
                  progress={progress}
                  index={i}
                  total={total}
                  reduced={reduced}
                />

                <Reveal as="article" delay={i * 0.08} className={styles.card}>
                  <header className={styles.cardHead}>
                    <span className={styles.phase}>PHASE {step.n}</span>
                    <span className={styles.index} aria-hidden="true">
                      {step.n}<span className={styles.indexSlash}>/</span>{String(PROCESS.steps.length).padStart(2, '0')}
                    </span>
                  </header>

                  <h3 className={styles.title}>{step.title}</h3>
                  <span className={styles.duration}>{step.duration}</span>
                  <p className={styles.desc}>{step.desc}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
