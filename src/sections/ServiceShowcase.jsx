import { Link } from 'react-router-dom'
import { Reveal } from '../motion/index.js'
import { CAPABILITIES } from '../data/content.js'
import styles from './ServiceShowcase.module.css'

// key → abstract editorial visual (light, indigo-restrained; regenerated via
// scripts/generateTekniikImages.js so there is no garbled fake UI/text).
const SERVICE_IMG = {
  web: '/img/services/websites.webp',
  app: '/img/services/apps.webp',
  mobile: '/img/services/mobile.webp',
  ai: '/img/services/ai.webp',
}

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

function Card({ item, index }) {
  const wrapCls = [item.featured ? styles.featuredWrap : styles.cardWrap].join(' ')
  const cls = [styles.card, item.featured ? styles.featured : styles.standard].join(' ')

  return (
    <Reveal delay={index * 0.07} className={wrapCls}>
      <Link to="/services" className={cls} aria-label={`${item.title} — ${item.desc}`}>
        <span className={styles.media}>
          <img
            src={SERVICE_IMG[item.key]}
            alt=""
            loading="lazy"
            decoding="async"
            width="1600"
            height="1200"
            className={styles.img}
          />
        </span>
        <span className={styles.body}>
          <span className={styles.cardTop}>
            <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.arrow} aria-hidden="true">
              <ArrowGlyph />
            </span>
          </span>
          <span className={styles.text}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.desc}>{item.desc}</p>
          </span>
        </span>
      </Link>
    </Reveal>
  )
}

export default function ServiceShowcase() {
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

        <div className={styles.grid}>
          {CAPABILITIES.items.map((item, i) => (
            <Card key={item.key} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
