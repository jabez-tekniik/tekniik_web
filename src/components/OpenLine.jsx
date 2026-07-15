import { useInViewOnce, createTimeline, stagger, utils, svg, EASE_INOUT, EASE_OUT } from '../motion/ink/index.js'
import styles from './OpenLine.module.css'

/* The open line, literally — London and Chennai as two live nodes on a
   plotted chart, joined by an arc that draws itself in, then carries a
   looping signal pulse between the offices. Decorative (aria-hidden);
   under reduced motion the arc renders fully drawn and the pulse, pings
   and blips never start. Tokens only — both ink modes adapt. */

const ARC = 'M64 74 C 176 108, 224 196, 336 230'

export default function OpenLine() {
  const ref = useInViewOnce(
    (el) => {
      const base = svg.createDrawable(el.querySelector('[data-arc]'))
      const pulse = svg.createDrawable(el.querySelector('[data-pulse]'))
      const marks = el.querySelectorAll('[data-mark]')
      let loop = null
      return {
        init() {
          utils.set(base, { draw: '0 0' })
          utils.set(pulse, { draw: '0 0' })
          utils.set(marks, { opacity: 0, translateY: 6 })
        },
        play() {
          createTimeline()
            .add(base, { draw: '0 1', duration: 1100, ease: EASE_INOUT }, 200)
            .add(
              marks,
              { opacity: 1, translateY: 0, duration: 600, ease: EASE_OUT, delay: stagger(90) },
              500,
            )
          /* signal pulse — a short lit segment sweeps LON→CHE, rests, repeats */
          loop = createTimeline({ loop: true, defaults: { ease: EASE_INOUT } })
            .add(pulse, { draw: '0 0.22', duration: 480 }, 1500)
            .add(pulse, { draw: '0.78 1', duration: 900 })
            .add(pulse, { draw: '1 1', duration: 380 })
            .add(pulse, { draw: '0 0', duration: 0 }, '+=1400')
        },
        cleanup() {
          if (loop) loop.cancel()
        },
      }
    },
    { threshold: 0.3 },
  )

  return (
    <div ref={ref} className={styles.wrap} aria-hidden="true">
      <svg className={styles.chart} viewBox="0 0 400 300" fill="none" preserveAspectRatio="xMidYMid meet">
        {/* route — hairline chart line the pulse travels on */}
        <path data-arc="" className={styles.arc} d={ARC} strokeWidth="1.5" />
        <path data-pulse="" className={styles.pulse} d={ARC} strokeWidth="2.5" strokeLinecap="round" />

        {/* node: London */}
        <g className={styles.nodeGroup}>
          <circle className={styles.ring} cx="64" cy="74" r="7" />
          <rect className={styles.nodeBox} x="59" y="69" width="10" height="10" />
        </g>
        {/* node: Chennai */}
        <g className={styles.nodeGroup}>
          <circle className={`${styles.ring} ${styles.ringLate}`} cx="336" cy="230" r="7" />
          <rect className={styles.nodeBox} x="331" y="225" width="10" height="10" />
        </g>
      </svg>

      {/* plotted mono labels */}
      <span data-mark="" className={`${styles.lab} ${styles.labLon}`}>
        LON <em className={styles.labSub}>51.5072° N</em>
      </span>
      <span data-mark="" className={`${styles.lab} ${styles.labChe}`}>
        CHE <em className={styles.labSub}>13.0827° N</em>
      </span>
      <span data-mark="" className={`${styles.meta} ${styles.metaTop}`}>Open line</span>
      <span data-mark="" className={`${styles.meta} ${styles.metaBottom}`}>
        8,214 km · replies in 24h
      </span>
    </div>
  )
}
