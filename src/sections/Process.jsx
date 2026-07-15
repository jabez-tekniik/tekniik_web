import Reveal from '../components/Reveal.jsx'
import DottedSurface from '../components/DottedSurface.jsx'
import { useScrollProgressInk } from '../motion/ink/index.js'
import { PROCESS } from '../data/content.js'
import styles from './Process.module.css'

/* "Phase horizon" — full-bleed brand-navy band with the three.js
   dot wave rolling behind. The four phases descend as a staircase;
   a teal fill races across each phase's top hairline in sequence as
   the section scrolls (horizontal take on the site's rail mechanic).
   DOM writes only on the scroll path — no React state. */
export default function Process() {
  const total = PROCESS.steps.length

  const stepsRef = useScrollProgressInk((p, grid) => {
    grid.querySelectorAll('[data-rail]').forEach((rail, i) => {
      const local = Math.min(1, Math.max(0, p * total - i))
      rail.firstElementChild.style.transform = `scaleX(${local})`
      rail.classList.toggle(styles.lit, local > 0.02)
    })
  })

  return (
    <section className={styles.section}>
      <DottedSurface />
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.head}>
          <div className={styles.headText}>
            <div className={styles.meta}>
              <span className={styles.index}>07</span>
              <span className={styles.eyebrow}>{PROCESS.eyebrow}</span>
            </div>
            <h2 className={styles.heading}>{PROCESS.heading}</h2>
          </div>
          <p className={styles.sub}>{PROCESS.sub}</p>
        </Reveal>

        <ol ref={stepsRef} className={styles.steps}>
          {PROCESS.steps.map((step, i) => (
            <li key={step.n} className={styles.step} style={{ '--i': i }}>
              <span className={styles.rail} data-rail="" aria-hidden="true">
                <span className={styles.railFill} />
                <span className={styles.node} />
              </span>

              <Reveal delay={i * 90} className={styles.phase}>
                <div className={styles.phaseMeta}>
                  <span className={styles.phaseLabel}>PHASE {step.n}</span>
                  <span className={styles.duration}>{step.duration}</span>
                </div>
                <span className={styles.ghost} aria-hidden="true">
                  {step.n}
                </span>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.desc}>{step.desc}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
