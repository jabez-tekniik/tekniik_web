import Reveal from '../components/Reveal.jsx'
import WordRise from '../motion/ink/WordRise.jsx'
import { AI_ACCELERATED } from '../data/content.js'
import styles from './AiAccelerated.module.css'

/* Small outline glyphs — one per point. Stroke = currentColor so both ink
   modes recolor them automatically (reset.css blockifies svg; these sit in a
   flex badge so that's fine). Decorative, aria-hidden on the wrapper. */
const ICONS = {
  engineering: <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />,
  qa: (
    <>
      <path d="M12 3l7 3v5c0 4-3 6.5-7 8-4-1.5-7-4-7-8V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  delivery: <path d="M3 12h4l2-6 4 12 2-6h4" />,
  prototyping: <path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4z" />,
}

/* "AI-Accelerated" (§10) — a compact, light teal-tinted band between the
   Testimonial and the dark FinalCta crescendo (kept light on purpose so the
   page keeps a single dark closing beat). Four points on a 4-up grid, each
   with a small glyph, mono index, title and reason; a teal-railed pull
   statement closes it. Transform/opacity/color only; Reveal handles motion. */
export default function AiAccelerated() {
  return (
    <section className={`section ${styles.section}`}>
      <span className={styles.bloom} aria-hidden="true" />
      <div className="container">
        <Reveal className={styles.head}>
          <div className={styles.meta}>
            <span className={styles.index}>10</span>
            <span className={styles.eyebrow}>{AI_ACCELERATED.eyebrow}</span>
          </div>
          <WordRise
            text={AI_ACCELERATED.heading}
            as="h2"
            staggerMs={40}
            className={styles.heading}
          />
          <p className={styles.sub}>{AI_ACCELERATED.sub}</p>
        </Reveal>

        <div className={styles.grid}>
          {AI_ACCELERATED.points.map((p, i) => (
            <Reveal key={p.key} delay={i * 80} className={styles.card}>
              <span className={styles.cardIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {ICONS[p.key]}
                </svg>
              </span>
              <span className={styles.num} aria-hidden="true">
                0{i + 1}
              </span>
              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.desc}>{p.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className={styles.closingWrap} delay={120}>
          <p className={styles.closing}>{AI_ACCELERATED.closing}</p>
        </Reveal>
      </div>
    </section>
  )
}
