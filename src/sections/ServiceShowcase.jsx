import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { CAPABILITIES } from '../data/content.js'
import styles from './ServiceShowcase.module.css'

// key → ink abstract visual (dark navy/teal, regenerated via
// scripts/generateTekniikImages.js so there is no garbled fake UI/text).
const SERVICE_IMG = {
  web: '/img/services/websites.webp',
  app: '/img/services/apps.webp',
  mobile: '/img/services/mobile.webp',
  ai: '/img/services/ai.webp',
}

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
   sticky image stage on the right: hover/focus a capability and its ink
   visual crossfades in. No card grid — structure comes from hairlines. */
export default function ServiceShowcase() {
  const [active, setActive] = useState(0)
  const items = CAPABILITIES.items

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

          {/* image stage — sticky on desktop, leading on mobile */}
          <Reveal className={styles.stageWrap} delay={120}>
            <div className={styles.stage} aria-hidden="true">
              {items.map((item, i) => (
                <img
                  key={item.key}
                  src={SERVICE_IMG[item.key]}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  width="1600"
                  height="1200"
                  className={`${styles.stageImg} ${i === active ? styles.stageImgActive : ''}`}
                />
              ))}
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
