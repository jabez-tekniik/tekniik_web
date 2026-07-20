import Reveal from '../components/Reveal.jsx'
import FadeIn from '../motion/ink/FadeIn.jsx'
import { AI_ACCELERATED } from '../data/content.js'
import styles from './AiAccelerated.module.css'

/* Small outline glyphs — one per point, lucide-language (2026-07-20, user:
   the old chevrons/shield/pulse/star read old-fashioned): braces (code),
   scan-check (automated QA), route (delivery tracking), shapes (concept
   exploration). Stroke = currentColor so both ink modes recolor them
   automatically. Decorative, aria-hidden on the wrapper. */
const ICONS = {
  engineering: (
    <>
      <path d="M8 3.5h-.8A2.2 2.2 0 0 0 5 5.7v4.1a2.2 2.2 0 0 1-2.2 2.2A2.2 2.2 0 0 1 5 14.2v4.1a2.2 2.2 0 0 0 2.2 2.2H8" />
      <path d="M16 3.5h.8A2.2 2.2 0 0 1 19 5.7v4.1a2.2 2.2 0 0 0 2.2 2.2A2.2 2.2 0 0 0 19 14.2v4.1a2.2 2.2 0 0 1-2.2 2.2H16" />
    </>
  ),
  qa: (
    <>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M8.5 12.3l2.4 2.4 4.6-5.2" />
    </>
  ),
  delivery: (
    <>
      <circle cx="6" cy="18" r="2.2" />
      <rect x="15.8" y="3.8" width="4.4" height="4.4" rx="1.1" />
      <path d="M8.2 18h5.3a4.5 4.5 0 0 0 4.5-4.5V8.2" />
    </>
  ),
  prototyping: (
    <>
      <path d="M8.6 9.7a.7.7 0 0 1-.6-1.05l3.4-5.6a.7.7 0 0 1 1.2 0l3.4 5.6a.7.7 0 0 1-.6 1.05z" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <circle cx="17.3" cy="17" r="3.6" />
    </>
  ),
}

/* AI circuit — the full-band visual (user: use the whole section, not just
   the right side). Faint 45°-step blueprint traces — the home hero's trace
   language — span the entire band and converge on a microchip die (the AI
   core) sitting right of the heading. Slow, dim electrons drift IN from
   the left (the raw work), the core breathes, and faster, brighter
   electrons stream OUT the right (shipped work): AI as the accelerator in
   the middle of the delivery line. Decorative; under reduced motion the
   electrons and core pulse stop, the static circuit remains. Path ids are
   aib-* so they never collide with the hero's hc-* on the same page. */
const CHIP = { x: 996, y: 118, s: 104 }

const AI_TRACES = [
  { id: 'aib-in1', d: 'M -40 96 H 470 l 34 34 H 900 l 10 10 h 86' },
  { id: 'aib-in2', d: 'M -40 236 H 560 l 32 -32 H 920 l 20 -20 h 56' },
  { id: 'aib-in3', d: 'M 1048 -40 V 118' },
  { id: 'aib-out1', d: 'M 1100 140 H 1240 l 26 -26 H 1480' },
  { id: 'aib-out2', d: 'M 1100 184 H 1480' },
  { id: 'aib-out3', d: 'M 1074 222 V 330 l 26 26 H 1480' },
  { id: 'aib-amb', d: 'M 72 -40 V 210 l -20 20 V 560' },
]

/* inputs arrive slowly; outputs leave faster and doubled-up — the
   acceleration is the story */
const AI_FLOW = [
  { path: 'aib-in1', dur: '9s', begin: '0s', out: false },
  { path: 'aib-in2', dur: '10s', begin: '-4s', out: false },
  { path: 'aib-in3', dur: '6.5s', begin: '-2s', out: false },
  { path: 'aib-amb', dur: '12s', begin: '-6s', out: false },
  { path: 'aib-out1', dur: '3.4s', begin: '0s', out: true },
  { path: 'aib-out1', dur: '3.4s', begin: '-1.7s', out: true },
  { path: 'aib-out2', dur: '3s', begin: '-0.8s', out: true },
  { path: 'aib-out2', dur: '3s', begin: '-2.3s', out: true },
  { path: 'aib-out3', dur: '3.8s', begin: '-1.4s', out: true },
  { path: 'aib-out3', dur: '3.8s', begin: '-3s', out: true },
]

/* unconnected pin stubs completing the microchip silhouette */
const AI_PINS = [
  'M 976 162 h 20',
  'M 976 206 h 20',
  'M 1022 98 v 20',
  'M 1074 98 v 20',
  'M 1100 162 h 20',
  'M 1100 206 h 20',
  'M 1022 222 v 20',
  'M 1048 222 v 20',
]

function AiCircuit() {
  return (
    <svg
      className={styles.circuit}
      viewBox="0 0 1440 520"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {AI_TRACES.map((t) => (
        <path key={t.id} id={t.id} className={styles.trace} d={t.d} />
      ))}
      {AI_PINS.map((d) => (
        <path key={d} className={styles.pin} d={d} />
      ))}

      {/* the chip: body, breathing glow, inner die, label */}
      <rect className={styles.chipBody} x={CHIP.x} y={CHIP.y} width={CHIP.s} height={CHIP.s} rx="10" />
      <rect className={styles.chipPulse} x={CHIP.x + 26} y={CHIP.y + 26} width={CHIP.s - 52} height={CHIP.s - 52} rx="6" />
      <rect className={styles.chipDie} x={CHIP.x + 26} y={CHIP.y + 26} width={CHIP.s - 52} height={CHIP.s - 52} rx="6" />
      <text className={styles.chipLabel} x={CHIP.x + CHIP.s / 2 + 2} y={CHIP.y + CHIP.s / 2 + 1} textAnchor="middle" dominantBaseline="central">
        AI
      </text>

      {AI_FLOW.map((e, i) => (
        <g key={`${e.path}-${i}`} className={styles.electron}>
          <circle r="5" className={e.out ? styles.haloOut : styles.haloIn} />
          <circle r="1.9" className={e.out ? styles.coreOut : styles.coreIn} />
          <animateMotion dur={e.dur} begin={e.begin} repeatCount="indefinite">
            <mpath href={`#${e.path}`} />
          </animateMotion>
        </g>
      ))}
    </svg>
  )
}

/* "AI-Accelerated" (§10) — a pre-crescendo band between the Testimonial
   and the dark FinalCta. The full-band AI circuit + teal bloom sit behind
   the content; four points on a 4-up grid; a teal-railed pull statement closes it.
   Reveal wraps each card so its stagger delay never leaks onto the hover
   (the card box is a child with its own snappy transition). */
export default function AiAccelerated() {
  return (
    <section className={`section ${styles.section}`}>
      <span className={styles.bloom} aria-hidden="true" />
      <AiCircuit />
      <div className="container">
        <Reveal className={styles.head}>
          <div className={styles.meta}>
            <span className={styles.index}>10</span>
            <span className={styles.eyebrow}>{AI_ACCELERATED.eyebrow}</span>
          </div>
          <FadeIn
            text={AI_ACCELERATED.heading}
            as="h2"
            className={styles.heading}
          />
          <p className={styles.sub}>{AI_ACCELERATED.sub}</p>
        </Reveal>

        <div className={styles.grid}>
          {AI_ACCELERATED.points.map((p, i) => (
            <Reveal key={p.key} delay={i * 80} className={styles.cardWrap}>
              <div className={styles.card}>
                <span className={styles.cardIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
