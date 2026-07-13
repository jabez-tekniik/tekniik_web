import { useRef } from 'react'
import Reveal from '../components/Reveal.jsx'
import { useScrollProgressInk } from '../motion/ink/index.js'
import { PROCESS } from '../data/content.js'
import styles from './Process.module.css'

export default function Process() {
  const fillRef = useRef(null)
  const fillVRef = useRef(null)
  const total = PROCESS.steps.length

  /* Scroll-linked rail: the teal fill draws with scroll and each node
     ignites (CSS class transition) as the fill passes it. DOM writes only —
     no React state on the scroll path. Reduced motion → filled + lit. */
  const stepsRef = useScrollProgressInk((p, steps) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`
    if (fillVRef.current) fillVRef.current.style.transform = `scaleY(${p})`
    steps.querySelectorAll('[data-dot]').forEach((dot, i) => {
      dot.classList.toggle(styles.lit, p >= i / total + 0.06)
    })
  })

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
            <span ref={fillRef} className={styles.trackFill} />
            {/* Mobile vertical fill (scaleY); shown only ≤640px via CSS. */}
            <span ref={fillVRef} className={styles.trackFillV} />
          </div>

          <ol className={styles.list}>
            {PROCESS.steps.map((step, i) => (
              <li key={step.n} className={styles.item}>
                <span className={styles.dot} data-dot="" aria-hidden="true">
                  <span className={styles.dotHalo} />
                  <span className={styles.dotInner} />
                </span>

                <Reveal as="article" delay={i * 80} className={styles.card}>
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
