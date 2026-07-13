import { Reveal } from '../motion/index.js'
import { WHY_TEKNIIK } from '../data/content.js'
import styles from './Why.module.css'

export default function Why() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.head}>
          <div className={styles.meta}>
            <span className={styles.index}>05</span>
            <span className={styles.eyebrow}>{WHY_TEKNIIK.eyebrow}</span>
          </div>
          <h2 className={styles.heading}>{WHY_TEKNIIK.heading}</h2>
          <p className={styles.sub}>{WHY_TEKNIIK.sub}</p>
        </Reveal>

        <div className={styles.grid}>
          {WHY_TEKNIIK.items.map((item, i) => (
            <Reveal key={item.key} delay={i * 0.07} className={styles.cell}>
              <span className={styles.cellNum}>0{i + 1}</span>
              <div className={styles.cellBody}>
                <h3 className={styles.cellTitle}>{item.title}</h3>
                <p className={styles.cellDesc}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
