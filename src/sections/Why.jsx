import { useRef } from 'react'
import { m, useTransform } from 'framer-motion'
import { Reveal, useScrollProgress } from '../motion/index.js'
import Eyebrow from '../components/Eyebrow.jsx'
import {
  IconTeam,
  IconClarity,
  IconChip,
  IconHeart,
} from '../components/Icon.jsx'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { WHY_TEKNIIK } from '../data/content.js'
import styles from './Why.module.css'

const ICONS = {
  team: IconTeam,
  clarity: IconClarity,
  ai: IconChip,
  partner: IconHeart,
}

export default function Why() {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()
  // Hook is always called; only the style binding below is gated for reduced motion.
  const progress = useScrollProgress(sectionRef)
  const scaleY = useTransform(progress, [0, 1], [0, 1])

  return (
    <section ref={sectionRef} className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.layout}>
          <span className={styles.hairlineTrack} aria-hidden="true">
            <m.span
              className={styles.hairlineFill}
              style={{ scaleY: reducedMotion ? 1 : scaleY }}
            />
          </span>

          <Reveal className={styles.head}>
            <Eyebrow tone="muted">{WHY_TEKNIIK.eyebrow}</Eyebrow>
            <h2 className={styles.heading}>{WHY_TEKNIIK.heading}</h2>
            <p className={styles.sub}>{WHY_TEKNIIK.sub}</p>
            <div className={styles.headDecor} aria-hidden="true">
              <span className={styles.headDecorLine} />
              <span className={styles.headDecorDot} />
            </div>
          </Reveal>

          <div className={styles.grid}>
            {WHY_TEKNIIK.items.map((item, i) => {
              const Icon = ICONS[item.key]
              return (
                <Reveal key={item.key} delay={i * 0.08} className={styles.cellWrap}>
                  <m.div
                    className={styles.cell}
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <div className={styles.cellTop}>
                      <span className={styles.cellNum}>0{i + 1}</span>
                      <Icon className={styles.cellIcon} />
                    </div>
                    <h3 className={styles.cellTitle}>{item.title}</h3>
                    <p className={styles.cellDesc}>{item.desc}</p>
                  </m.div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
