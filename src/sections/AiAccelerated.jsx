import Reveal from '../components/Reveal.jsx'
import WordRise from '../motion/ink/WordRise.jsx'
import { AI_ACCELERATED } from '../data/content.js'
import styles from './AiAccelerated.module.css'

/* Small outline glyphs — one per point. Stroke = currentColor so both ink
   modes recolor them automatically (reset.css blockifies svg; these sit in a
   flex badge so that's fine). Decorative, aria-hidden on the wrapper. */
const ICONS = {
  engineering: <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />,
  qa: (
    <>
      <path d="M12 3l7 3v5c0 4-3 6.5-7 8-4-1.5-7-4-7-8V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  delivery: <path d="M3 12h4l2-6 4 12 2-6h4" />,
  prototyping: <path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4z" />,
}

/* Neural net visual — a 3-4-2 network beside the heading. Faint curved edges
   carry glowing teal "signal" pips that glide input → output on a continuous
   stroke-dashoffset flow (staggered per edge, so it reads as inference moving
   through the layers); node rings breathe on their own rhythm and output
   nodes sit brighter. Edge-masked, decorative. Flow + pulse stop under
   reduced motion, leaving a clean static diagram. */
const IN = [
  [46, 68],
  [46, 120],
  [46, 172],
]
const HID = [
  [180, 60],
  [180, 108],
  [180, 156],
  [180, 204],
]
const OUT = [
  [314, 96],
  [314, 148],
]

const edgePath = ([x1, y1], [x2, y2]) => {
  const dx = (x2 - x1) * 0.5
  return `M${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
}

const NET_EDGES = [
  [IN[0], HID[0]],
  [IN[0], HID[1]],
  [IN[1], HID[1]],
  [IN[1], HID[2]],
  [IN[1], HID[0]],
  [IN[2], HID[2]],
  [IN[2], HID[3]],
  [IN[2], HID[1]],
  [HID[0], OUT[0]],
  [HID[1], OUT[0]],
  [HID[1], OUT[1]],
  [HID[2], OUT[0]],
  [HID[2], OUT[1]],
  [HID[3], OUT[1]],
].map(([a, b]) => edgePath(a, b))

const NET_NODES = [
  ...IN.map((p) => ({ p, out: false })),
  ...HID.map((p) => ({ p, out: false })),
  ...OUT.map((p) => ({ p, out: true })),
]

function NeuralNet() {
  return (
    <svg className={styles.net} viewBox="0 0 360 232" fill="none" aria-hidden="true">
      {/* faint static connections */}
      {NET_EDGES.map((d, i) => (
        <path key={`b${i}`} className={styles.edge} d={d} />
      ))}
      {/* gliding signal pips (one lit dash travelling each edge) */}
      {NET_EDGES.map((d, i) => (
        <path
          key={`f${i}`}
          className={styles.flow}
          d={d}
          style={{ animationDelay: `${-((i * 0.47) % 3.1).toFixed(2)}s` }}
        />
      ))}
      {/* nodes: breathing ring + solid core */}
      {NET_NODES.map(({ p: [x, y], out }, i) => (
        <g key={`n${i}`}>
          <circle
            className={styles.nodeRing}
            cx={x}
            cy={y}
            r={out ? 9 : 7}
            style={{ animationDelay: `${((i % 5) * 0.5).toFixed(2)}s` }}
          />
          <circle className={out ? styles.nodeCoreOut : styles.nodeCore} cx={x} cy={y} r={out ? 3.6 : 2.6} />
        </g>
      ))}
    </svg>
  )
}

/* "AI-Accelerated" (§10) — a navy pre-crescendo band between the Testimonial
   and the dark FinalCta. A neural-net signal-flow visual + teal bloom sit
   behind the content; four points on a 4-up grid; a teal-railed pull statement closes it.
   Reveal wraps each card so its stagger delay never leaks onto the hover
   (the card box is a child with its own snappy transition). */
export default function AiAccelerated() {
  return (
    <section className={`section ${styles.section}`}>
      <span className={styles.bloom} aria-hidden="true" />
      <NeuralNet />
      <div className="container">
        <Reveal className={styles.head}>
          <div className={styles.meta}>
            <span className={styles.index}>10</span>
            <span className={styles.eyebrow}>{AI_ACCELERATED.eyebrow}</span>
          </div>
          <WordRise
            text={AI_ACCELERATED.heading}
            as="h2"
            staggerMs={40}
            className={styles.heading}
          />
          <p className={styles.sub}>{AI_ACCELERATED.sub}</p>
        </Reveal>

        <div className={styles.grid}>
          {AI_ACCELERATED.points.map((p, i) => (
            <Reveal key={p.key} delay={i * 80} className={styles.cardWrap}>
              <div className={styles.card}>
                <span className={styles.cardIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[p.key]}
                  </svg>
                </span>
                <span className={styles.num} aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.desc}>{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className={styles.closingWrap} delay={120}>
          <p className={styles.closing}>{AI_ACCELERATED.closing}</p>
        </Reveal>
      </div>
    </section>
  )
}
