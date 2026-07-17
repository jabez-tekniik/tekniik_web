import Reveal from '../components/Reveal.jsx'
import { WHY_TEKNIIK } from '../data/content.js'
import styles from './Why.module.css'

function ArrowGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

/* "The ledger" — four full-width statement rows under hairlines: ghost
   outlined number · oversized principle · reason. Hovering a row sweeps
   a teal signal across it (scaleX fill + left bar), ignites the numeral,
   and reveals an arrow. */
export default function Why() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.head}>
          <div className={styles.meta}>
            <span className={styles.index}>06</span>
            <span className={styles.eyebrow}>{WHY_TEKNIIK.eyebrow}</span>
          </div>
          <h2 className={styles.heading}>
            {WHY_TEKNIIK.heading}{' '}
            <span className={styles.headingAccent}>{WHY_TEKNIIK.headingAccent}</span>
          </h2>
          <p className={styles.sub}>{WHY_TEKNIIK.sub}</p>
        </Reveal>

        <div className={styles.ledger}>
          {WHY_TEKNIIK.items.map((item, i) => (
            <Reveal key={item.key} delay={i * 80} className={styles.row}>
              <span className={styles.num} aria-hidden="true">
                0{i + 1}
              </span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.desc}</p>
              <span className={styles.arrow} aria-hidden="true">
                <ArrowGlyph />
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
