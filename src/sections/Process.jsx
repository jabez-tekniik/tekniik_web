import Reveal from '../components/Reveal.jsx'
import Eyebrow from '../components/Eyebrow.jsx'
import useReveal from '../hooks/useReveal.js'
import { PROCESS } from '../data/content.js'
import styles from './Process.module.css'

export default function Process() {
  const [trackRef, active] = useReveal({ threshold: 0.18, rootMargin: '0px 0px -15% 0px' })

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.head}>
          <Eyebrow>{PROCESS.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{PROCESS.heading}</h2>
          <p className={styles.sub}>{PROCESS.sub}</p>
        </Reveal>

        <div
          ref={trackRef}
          className={`${styles.steps} ${active ? styles.active : ''}`}
        >
          <div className={styles.track} aria-hidden="true">
            <span className={styles.trackLine} />
            <span className={styles.trackFill} />
          </div>

          <ol className={styles.list}>
            {PROCESS.steps.map((step, i) => (
              <li
                key={step.n}
                className={styles.item}
                style={{ '--i': i }}
              >
                <span className={styles.dot} aria-hidden="true">
                  <span className={styles.dotInner} />
                </span>

                <article className={styles.card}>
                  <header className={styles.cardHead}>
                    <span className={styles.phase}>PHASE {step.n}</span>
                    <span className={styles.index} aria-hidden="true">
                      {step.n}<span className={styles.indexSlash}>/</span>{String(PROCESS.steps.length).padStart(2, '0')}
                    </span>
                  </header>

                  <h3 className={styles.title}>{step.title}</h3>
                  <span className={styles.duration}>{step.duration}</span>
                  <p className={styles.desc}>{step.desc}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
