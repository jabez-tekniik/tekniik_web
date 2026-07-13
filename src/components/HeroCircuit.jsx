import styles from './Hero.module.css'

/* Circuit layer — faint blueprint traces with teal "electrons" (SMIL
   animateMotion pulses) flowing along them. Same 45°-step language as the
   signal trace under the headline. Runs in the quiet zones of the hero
   (edges + right column) so it never fights the copy. Electrons are hidden
   under prefers-reduced-motion (module CSS); the static traces remain. */

const PATHS = [
  { id: 'hc-p1', d: 'M 1216 -40 V 250 l -36 36 V 470 l 36 36 V 840' },
  { id: 'hc-p2', d: 'M -40 720 H 480 l 28 -28 H 940 l 28 28 H 1480' },
  { id: 'hc-p3', d: 'M 56 -40 V 180 l -20 20 V 400' },
  { id: 'hc-p4', d: 'M 1480 380 H 1120 l -30 30 H 980' },
]

const ELECTRONS = [
  { path: 'hc-p1', dur: '9s', begin: '0s' },
  { path: 'hc-p1', dur: '9s', begin: '-4.5s' },
  { path: 'hc-p2', dur: '11s', begin: '-2s' },
  { path: 'hc-p2', dur: '11s', begin: '-7.5s' },
  { path: 'hc-p3', dur: '7s', begin: '-1s' },
  { path: 'hc-p4', dur: '6s', begin: '-3s' },
]

/* terminal pads where a trace ends on-canvas */
const NODES = [
  { x: 32, y: 396 },
  { x: 976, y: 406 },
]

export default function HeroCircuit() {
  return (
    <svg
      className={styles.circuit}
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS.map((p) => (
        <path
          key={p.id}
          id={p.id}
          d={p.d}
          className={styles.circuitPath}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {NODES.map((n) => (
        <rect
          key={`${n.x}-${n.y}`}
          x={n.x}
          y={n.y}
          width="8"
          height="8"
          className={styles.circuitNode}
        />
      ))}
      {ELECTRONS.map((e, i) => (
        <g key={`${e.path}-${i}`} className={styles.electron}>
          <circle r="5" className={styles.electronHalo} />
          <circle r="1.9" className={styles.electronCore} />
          <animateMotion dur={e.dur} begin={e.begin} repeatCount="indefinite">
            <mpath href={`#${e.path}`} />
          </animateMotion>
        </g>
      ))}
    </svg>
  )
}
