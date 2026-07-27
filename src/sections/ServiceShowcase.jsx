import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import useReveal from '../hooks/useReveal.js'
import { CAPABILITIES } from '../data/content.js'
import { WebScene, AppScene, MobileScene, AiScene } from './ServiceVignettes.jsx'
import styles from './ServiceShowcase.module.css'

const VIGNETTES = { web: WebScene, app: AppScene, mobile: MobileScene, ai: AiScene }

function ArrowGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

/* One service card: blueprint stage with the animated vignette on top, copy
   below. The whole card is the link. The scene ignites via its own in-view
   observer and stays lit (re-running the entry choreography on every
   scroll-past reads as a glitch). */
function ServiceCard({ item, index }) {
  const Scene = VIGNETTES[item.key]
  const [stageRef, on] = useReveal({ threshold: 0.3, rootMargin: '0px' })
  return (
    <Reveal className={styles.cardWrap} delay={(index % 2) * 110}>
      <Link to={item.to || '/services'} className={styles.card}>
        <span className={styles.accentLine} aria-hidden="true" />
        <div className={styles.body}>
          <div className={styles.meta}>
            <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.metaRule} aria-hidden="true" />
          </div>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.desc}>{item.desc}</p>
          <span className={styles.cta}>
            {/* acronyms survive the lowercasing — "AI" never "ai" */}
            <span>Explore {item.title.toLowerCase().replace(/\bai\b/g, 'AI')}</span>
            <span className={styles.ctaIcon}>
              <ArrowGlyph />
            </span>
          </span>
        </div>
        <div ref={stageRef} className={styles.stage} aria-hidden="true">
          <div className={styles.sceneHolder}>
            <Scene active={on} />
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

/* "What we engineer" — all four services visible at once (client request):
   a 2×2 grid of linked cards, each carrying its animated coded vignette on a
   blueprint stage. Collapses to one column on narrow viewports. */
export default function ServiceShowcase() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.header}>
          <div className={styles.headMeta}>
            <span className={styles.index}>05</span>
            <span className={styles.eyebrow}>{CAPABILITIES.eyebrow}</span>
          </div>
          <div className={styles.headRow}>
            <h2 className={styles.heading}>
              {CAPABILITIES.heading.map((line, i, arr) => (
                <span key={line} className={i === 1 ? styles.headingAccent : styles.headingLine}>
                  {line}
                  {i < arr.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h2>
            <p className={styles.sub}>{CAPABILITIES.sub}</p>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {CAPABILITIES.items.map((item, i) => (
            <ServiceCard key={item.key} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
