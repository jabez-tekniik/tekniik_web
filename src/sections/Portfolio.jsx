import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Tag from '../components/Tag.jsx'
import { IconArrow } from '../components/Icon.jsx'
import { PORTFOLIO } from '../data/content.js'
import styles from './Portfolio.module.css'

/* Bento cell spans by data, not position (user: cards with no case study
   run smaller): CareGrid is the 2x2 navy anchor, routed case studies get
   wide tiles, everything else tucks in as a compact square. Items render
   featured → routed → rest so the numbering follows the visual order the
   dense grid produces. */
const cellFor = (item) =>
  item.featured ? 'cellBig' : item.route ? 'cellWide' : 'cellSmall'

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

      <h3 className={styles.title}>{item.title}</h3>

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
          <h2 className={styles.heading}>
            {PORTFOLIO.heading}{' '}
            <span className={styles.headingAccent}>{PORTFOLIO.headingAccent}</span>
          </h2>
          <p className={styles.sub}>{PORTFOLIO.sub}</p>
        </Reveal>

        <div className={styles.grid}>
          {[
            ...PORTFOLIO.items.filter((p) => p.featured),
            ...PORTFOLIO.items.filter((p) => !p.featured && p.route),
            ...PORTFOLIO.items.filter((p) => !p.featured && !p.route),
          ].map((item, i) => (
            <Reveal
              key={item.slug}
              delay={Math.min(i, 5) * 50}
              className={`${styles.cardWrap} ${styles[cellFor(item)]}`}
            >
              <Card item={item} index={i} compact={!item.featured && !item.route} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
