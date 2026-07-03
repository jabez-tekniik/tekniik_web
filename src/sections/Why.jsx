import Reveal from '../components/Reveal.jsx'
import Eyebrow from '../components/Eyebrow.jsx'
import {
  IconTeam,
  IconClarity,
  IconChip,
  IconHeart,
} from '../components/Icon.jsx'
import { WHY_TEKNIIK } from '../data/content.js'
import styles from './Why.module.css'

const ICONS = {
  team: IconTeam,
  clarity: IconClarity,
  ai: IconChip,
  partner: IconHeart,
}

export default function Why() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.layout}>
          <Reveal className={styles.head}>
            <Eyebrow tone="muted">{WHY_TEKNIIK.eyebrow}</Eyebrow>
            <h2 className={styles.heading}>{WHY_TEKNIIK.heading}</h2>
            <p className={styles.sub}>{WHY_TEKNIIK.sub}</p>
            <div className={styles.headDecor} aria-hidden="true">
              <span className={styles.headDecorLine} />
              <span className={styles.headDecorDot} />
            </div>
          </Reveal>

          <Reveal stagger className={styles.grid}>
            {WHY_TEKNIIK.items.map((item, i) => {
              const Icon = ICONS[item.key]
              return (
                <div key={item.key} className={styles.cell}>
                  <div className={styles.cellTop}>
                    <span className={styles.cellNum}>0{i + 1}</span>
                    <Icon className={styles.cellIcon} />
                  </div>
                  <h3 className={styles.cellTitle}>{item.title}</h3>
                  <p className={styles.cellDesc}>{item.desc}</p>
                </div>
              )
            })}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
