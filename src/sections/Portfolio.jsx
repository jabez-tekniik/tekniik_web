import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Tag from '../components/Tag.jsx'
import { IconArrow } from '../components/Icon.jsx'
import { PORTFOLIO } from '../data/content.js'
import { attachIndexParallax } from './portfolioParallax.js'
import styles from './Portfolio.module.css'

/* One editorial row. The big index parallaxes toward the cursor via an anime
   Animatable (runs entirely off the React render cycle); hover glow +
   underline draw are pure CSS. Pointer-fine devices only; nothing moves
   under prefers-reduced-motion. */
function Row({ item, index }) {
  const interactive = !!item.route
  const rowRef = useRef(null)
  const idxRef = useRef(null)

  useEffect(() => attachIndexParallax(rowRef.current, idxRef.current), [])

  const className = `${styles.row} ${item.featured ? styles.featured : ''} ${
    interactive ? styles.interactive : ''
  }`
  const num = String(index + 1).padStart(2, '0')

  const inner = (
    <>
      <span className={styles.glow} aria-hidden="true" />

      <div className={styles.index} aria-hidden="true">
        <span ref={idxRef} className={styles.indexNum}>
          {num}
        </span>
      </div>

      <div className={styles.main}>
        <h3 className={styles.title}>
          <span className={styles.titleInk}>{item.title}</span>
        </h3>
        {item.featured && <p className={styles.desc}>{item.desc}</p>}
        <div className={styles.tags}>
          {item.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>

      <div className={styles.aside}>
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
      <Link ref={rowRef} to={item.route} className={className}>
        {inner}
      </Link>
    )
  }
  return (
    <article ref={rowRef} className={className}>
      {inner}
    </article>
  )
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

        <div className={styles.list}>
          {PORTFOLIO.items.map((item, i) => (
            <Reveal
              key={item.slug}
              delay={Math.min(i, 5) * 50}
              className={`${styles.rowWrap} ${item.featured ? styles.featuredWrap : ''}`}
            >
              <Row item={item} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
