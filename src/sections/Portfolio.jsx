import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Eyebrow from '../components/Eyebrow.jsx'
import Tag from '../components/Tag.jsx'
import { IconArrow } from '../components/Icon.jsx'
import { PORTFOLIO } from '../data/content.js'
import styles from './Portfolio.module.css'

function Card({ item, index }) {
  const interactive = !!item.route
  const className = `${styles.card} ${item.featured ? styles.featured : ''} ${interactive ? styles.interactive : ''}`

  const inner = (
    <>
      <div className={styles.head}>
        <span className={styles.idx}>{String(index + 1).padStart(2, '0')}</span>
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
      <Link to={item.route} className={className}>
        {inner}
      </Link>
    )
  }
  return <article className={className}>{inner}</article>
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

        <Reveal stagger className={styles.grid}>
          {PORTFOLIO.items.map((item, i) => (
            <Card key={item.slug} item={item} index={i} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
