import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Tag from '../components/Tag.jsx'
import { IconArrow } from '../components/Icon.jsx'
import { PORTFOLIO } from '../data/content.js'
import styles from './Portfolio.module.css'

/* Bento cell spans by position (4-col grid). CareGrid (0) is the 2x2 navy
   anchor; the two routed case studies (1 GlowBook, 4 ScreenFix) get wide
   tiles; 2 and 3 tuck in as small squares beside the anchor. The pattern
   tiles the eight items cleanly; any extra items fall back to wide. */
const CELLS = ['cellBig', 'cellWide', 'cellSmall', 'cellSmall', 'cellWide', 'cellWide', 'cellWide', 'cellWide']

function LocationGlyph({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.6c-2.5 0-4.5 2-4.5 4.5 0 3.1 4.5 8.3 4.5 8.3s4.5-5.2 4.5-8.3c0-2.5-2-4.5-4.5-4.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.1" r="1.7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

/* One work card. Tags are ordered [industry, type, country]; the country
   reads as a region chip up top, the first two as pills below. Featured
   (CareGrid) is a permanent navy card spanning two columns with its
   description; routed items (GlowBook, ScreenFix) carry a case-study CTA.
   Hover lift + accent draw are pure CSS, pointer-fine only. */
function Card({ item, index, compact }) {
  const interactive = !!item.route
  const num = String(index + 1).padStart(2, '0')
  const region = item.tags[item.tags.length - 1]
  // small tiles carry a single pill (the project type) so tags never wrap
  const pills = compact ? item.tags.slice(1, -1) : item.tags.slice(0, -1)

  const className = `${styles.card} ${item.featured ? styles.featured : ''} ${
    interactive ? styles.interactive : ''
  }`

  const inner = (
    <>
      <span className={styles.accentLine} aria-hidden="true" />

      <div className={styles.cardTop}>
        <span className={styles.num}>{num}</span>
        <span className={styles.region}>
          <LocationGlyph className={styles.regionIcon} />
          {region}
        </span>
      </div>

      <h3 className={styles.title}>
        <span className={styles.titleInk}>{item.title}</span>
      </h3>

      {item.featured && <p className={styles.desc}>{item.desc}</p>}

      <div className={styles.tags}>
        {pills.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <div className={styles.foot}>
        <span className={styles.result}>{item.result}</span>
        {interactive && (
          <span className={styles.cta}>
            View case study
            <IconArrow className={styles.ctaIcon} />
          </span>
        )}
      </div>
    </>
  )

  if (interactive) {
    return (
      <Link to={item.route} className={className}>
        {inner}
      </Link>
    )
  }
  return <article className={className}>{inner}</article>
}

export default function Portfolio() {
  return (
    <section id="work" className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.intro}>
          <div className={styles.meta}>
            <span className={styles.metaIndex}>08</span>
            <span className={styles.metaEyebrow}>{PORTFOLIO.eyebrow}</span>
          </div>
          <h2 className={styles.heading}>{PORTFOLIO.heading}</h2>
          <p className={styles.sub}>{PORTFOLIO.sub}</p>
        </Reveal>

        <div className={styles.grid}>
          {PORTFOLIO.items.map((item, i) => (
            <Reveal
              key={item.slug}
              delay={Math.min(i, 5) * 50}
              className={`${styles.cardWrap} ${styles[CELLS[i] || 'cellWide']}`}
            >
              <Card item={item} index={i} compact={CELLS[i] === 'cellSmall'} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
