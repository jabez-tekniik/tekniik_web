import Reveal from '../components/Reveal.jsx'
import { WHY_TEKNIIK } from '../data/content.js'
import styles from './Why.module.css'

/* "The ledger" — four full-width editorial rows under hairlines:
   number · principle · reason. No cards, no grid boxes. */
export default function Why() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.head}>
          <div>
            <div className={styles.meta}>
              <span className={styles.index}>05</span>
              <span className={styles.eyebrow}>{WHY_TEKNIIK.eyebrow}</span>
            </div>
            <h2 className={styles.heading}>{WHY_TEKNIIK.heading}</h2>
          </div>
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
