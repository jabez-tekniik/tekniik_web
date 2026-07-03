import { Link } from 'react-router-dom'
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Reveal } from '../motion/index.js'
import Eyebrow from '../components/Eyebrow.jsx'
import Tag from '../components/Tag.jsx'
import { IconArrow } from '../components/Icon.jsx'
import { PORTFOLIO } from '../data/content.js'
import useReducedMotion from '../hooks/useReducedMotion.js'
import styles from './Portfolio.module.css'

function Card({ item, index }) {
  const interactive = !!item.route
  const className = `${styles.card} ${item.featured ? styles.featured : ''} ${interactive ? styles.interactive : ''}`

  const reduced = useReducedMotion()
  const pointerY = useMotionValue(0.5)
  const springY = useSpring(pointerY, { stiffness: 150, damping: 20 })
  const idxY = useTransform(springY, [0, 1], [-6, 6])

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    pointerY.set((e.clientY - rect.top) / rect.height)
  }
  const handlePointerLeave = () => {
    pointerY.set(0.5)
  }

  const inner = (
    <>
      <div className={styles.head}>
        <m.span className={styles.idx} style={reduced ? undefined : { y: idxY }}>
          {String(index + 1).padStart(2, '0')}
        </m.span>
        <div className={styles.tags}>
          {item.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.desc}>{item.desc}</p>
      </div>

      <div className={styles.foot}>
        <div className={styles.stackRow}>
          <span className={styles.stackLabel}>// stack</span>
          <span className={styles.stackList}>
            {item.stack.map((s, i) => (
              <span key={s} className={styles.stackItem}>
                {s}
                {i < item.stack.length - 1 && <span className={styles.stackSep}>·</span>}
              </span>
            ))}
          </span>
        </div>

        <div className={styles.resultRow}>
          <span className={styles.resultDot} aria-hidden="true" />
          <span className={styles.result}>{item.result}</span>
          {interactive && (
            <span className={styles.link}>
              Case study
              <IconArrow className={styles.linkIcon} />
            </span>
          )}
        </div>
      </div>
    </>
  )

  if (interactive) {
    return (
      <Link
        to={item.route}
        className={className}
        onMouseMove={reduced ? undefined : handlePointerMove}
        onMouseLeave={reduced ? undefined : handlePointerLeave}
      >
        {inner}
      </Link>
    )
  }
  return (
    <article
      className={className}
      onMouseMove={reduced ? undefined : handlePointerMove}
      onMouseLeave={reduced ? undefined : handlePointerLeave}
    >
      {inner}
    </article>
  )
}

export default function Portfolio() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.intro}>
          <Eyebrow>{PORTFOLIO.eyebrow}</Eyebrow>
          <h2 className={styles.heading}>{PORTFOLIO.heading}</h2>
          <p className={styles.sub}>{PORTFOLIO.sub}</p>
        </Reveal>

        <div className={styles.grid}>
          {PORTFOLIO.items.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.06} className={styles.cardWrap}>
              <Card item={item} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
