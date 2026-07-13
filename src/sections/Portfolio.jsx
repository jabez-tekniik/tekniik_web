import { Link } from 'react-router-dom'
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Reveal } from '../motion/index.js'
import Tag from '../components/Tag.jsx'
import { IconArrow } from '../components/Icon.jsx'
import { PORTFOLIO } from '../data/content.js'
import useReducedMotion from '../hooks/useReducedMotion.js'
import styles from './Portfolio.module.css'

/* One editorial row. Pointer hooks are called ONCE per Row instance (never
   inside the parent .map) so hooks stay out of loops — mirrors the Node
   pattern in Process.jsx. The big index parallaxes toward the cursor; all
   motion values are gated behind `reduced` so nothing moves under
   prefers-reduced-motion. Hover glow + underline draw are pure CSS. */
function Row({ item, index }) {
  const interactive = !!item.route
  const reduced = useReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 150, damping: 22 })
  const sy = useSpring(py, { stiffness: 150, damping: 22 })
  const idxX = useTransform(sx, [0, 1], [-9, 9])
  const idxY = useTransform(sy, [0, 1], [-7, 7])

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const handleLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  const className = `${styles.row} ${item.featured ? styles.featured : ''} ${
    interactive ? styles.interactive : ''
  }`
  const num = String(index + 1).padStart(2, '0')

  const inner = (
    <>
      <span className={styles.glow} aria-hidden="true" />

      <div className={styles.index} aria-hidden="true">
        <m.span
          className={styles.indexNum}
          style={reduced ? undefined : { x: idxX, y: idxY }}
        >
          {num}
        </m.span>
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

  const handlers = reduced
    ? {}
    : { onPointerMove: handleMove, onPointerLeave: handleLeave }

  if (interactive) {
    return (
      <Link to={item.route} className={className} {...handlers}>
        {inner}
      </Link>
    )
  }
  return (
    <article className={className} {...handlers}>
      {inner}
    </article>
  )
}

export default function Portfolio() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.intro}>
          <div className={styles.meta}>
            <span className={styles.metaIndex}>07</span>
            <span className={styles.metaEyebrow}>{PORTFOLIO.eyebrow}</span>
          </div>
          <h2 className={styles.heading}>{PORTFOLIO.heading}</h2>
          <p className={styles.sub}>{PORTFOLIO.sub}</p>
        </Reveal>

        <div className={styles.list}>
          {PORTFOLIO.items.map((item, i) => (
            <Reveal
              key={item.slug}
              delay={Math.min(i, 5) * 0.05}
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
