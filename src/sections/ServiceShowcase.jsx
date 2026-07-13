import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { CAPABILITIES } from '../data/content.js'
import { WebScene, AppScene, MobileScene, AiScene } from './ServiceVignettes.jsx'
import useStageParallax from '../hooks/useStageParallax.js'
import styles from './ServiceShowcase.module.css'

const VIGNETTES = { web: WebScene, app: AppScene, mobile: MobileScene, ai: AiScene }

function ArrowGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5 11l6-6M11 5H6.5M11 5v4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* "Capability index" — an interactive ledger. The rows on the left drive a
   sticky vignette stage on the right: hover/focus a capability and its coded,
   animated scene crossfades in (see ServiceVignettes.jsx). The stage also
   parallaxes toward the pointer; on touch devices it auto-cycles instead. */
export default function ServiceShowcase() {
  const [active, setActive] = useState(0)
  const items = CAPABILITIES.items
  const stageRef = useStageParallax()

  /* touch devices have no hover to drive the ledger — cycle the scenes
     while the stage is on screen (skipped under reduced motion) */
  useEffect(() => {
    if (!window.matchMedia('(hover: none), (pointer: coarse)').matches) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const el = stageRef.current
    if (!el) return undefined
    let id
    const io = new IntersectionObserver(
      (entries) => {
        clearInterval(id)
        if (entries.some((e) => e.isIntersecting)) {
          id = setInterval(() => setActive((a) => (a + 1) % CAPABILITIES.items.length), 4800)
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => {
      clearInterval(id)
      io.disconnect()
    }
  }, [stageRef])

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.header}>
          <div className={styles.headMeta}>
            <span className={styles.index}>02</span>
            <span className={styles.eyebrow}>{CAPABILITIES.eyebrow}</span>
          </div>
          <h2 className={styles.heading}>
            {CAPABILITIES.heading.map((line, i) => (
              <span key={line} className={i === 1 ? styles.headingAccent : styles.headingLine}>
                {line}
              </span>
            ))}
          </h2>
          <p className={styles.sub}>{CAPABILITIES.sub}</p>
        </Reveal>

        <div className={styles.split}>
          {/* capability ledger */}
          <div className={styles.ledger}>
            {items.map((item, i) => (
              <Reveal key={item.key} delay={i * 70}>
                <Link
                  to="/services"
                  className={`${styles.row} ${i === active ? styles.rowActive : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-label={`${item.title} — ${item.desc}`}
                >
                  <span className={styles.rowNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.rowBody}>
                    <span className={styles.rowTitle}>{item.title}</span>
                    <span className={styles.rowDesc}>{item.desc}</span>
                  </span>
                  <span className={styles.rowArrow} aria-hidden="true">
                    <ArrowGlyph />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* vignette stage — sticky on desktop, leading on mobile */}
          <Reveal className={styles.stageWrap} delay={120}>
            <div ref={stageRef} className={styles.stage} aria-hidden="true">
              {items.map((item, i) => {
                const Scene = VIGNETTES[item.key]
                return <Scene key={item.key} active={i === active} />
              })}
              <span className={styles.stageIndex}>
                {String(active + 1).padStart(2, '0')}
                <span className={styles.stageIndexTotal}> / {String(items.length).padStart(2, '0')}</span>
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
