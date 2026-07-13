import { useRef } from 'react'
import Reveal from '../components/Reveal.jsx'
import { useScrollProgressInk } from '../motion/ink/index.js'
import { PROCESS } from '../data/content.js'
import styles from './Process.module.css'

/* "Chapters" — a vertical timeline beside a sticky head. The teal rail
   draws downward with scroll and each chapter node ignites as the fill
   passes it. DOM writes only on the scroll path — no React state. */
export default function Process() {
  const fillRef = useRef(null)
  const total = PROCESS.steps.length

  const listRef = useScrollProgressInk((p, list) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`
    list.querySelectorAll('[data-dot]').forEach((dot, i) => {
      dot.classList.toggle(styles.lit, p >= i / total + 0.06)
    })
  })

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.split}>
          <div className={styles.headCol}>
            <Reveal className={styles.head}>
              <div className={styles.meta}>
                <span className={styles.index}>06</span>
                <span className={styles.eyebrow}>{PROCESS.eyebrow}</span>
              </div>
              <h2 className={styles.heading}>{PROCESS.heading}</h2>
              <p className={styles.sub}>{PROCESS.sub}</p>
            </Reveal>
          </div>

          <ol ref={listRef} className={styles.timeline}>
            <span className={styles.rail} aria-hidden="true">
              <span ref={fillRef} className={styles.railFill} />
            </span>

            {PROCESS.steps.map((step, i) => (
              <li key={step.n} className={styles.item}>
                <span className={styles.dot} data-dot="" aria-hidden="true">
                  <span className={styles.dotInner} />
                </span>

                <Reveal delay={i * 80} className={styles.chapter}>
                  <span className={styles.chapterNum} aria-hidden="true">
                    {step.n}
                  </span>
                  <div className={styles.chapterBody}>
                    <div className={styles.chapterHead}>
                      <h3 className={styles.title}>{step.title}</h3>
                      <span className={styles.duration}>{step.duration}</span>
                    </div>
                    <p className={styles.desc}>{step.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
