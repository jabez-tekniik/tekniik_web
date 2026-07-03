import { Link } from 'react-router-dom'
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Tilt, Reveal } from '../motion/index.js'
import useReducedMotion from '../hooks/useReducedMotion.js'
import styles from './ServiceShowcase.module.css'

const CARDS = [
  {
    key: 'websites',
    href: '/services',
    title: 'Websites',
    tagline: 'Sites that convert visitors into customers.',
    img: '/img/services/websites.webp',
    alt: 'Abstract sculpture of layered translucent planes representing the craft of building beautiful websites',
    span: 'tall',
    chip: { kind: 'flagship', label: 'Flagship' },
  },
  {
    key: 'apps',
    href: '/services',
    title: 'Web Apps',
    tagline: 'Dashboards and tools that scale.',
    img: '/img/services/apps.webp',
    alt: 'Abstract constellation of glowing geometric modules connected by light threads, representing modular software systems',
    span: 'square',
  },
  {
    key: 'mobile',
    href: '/services',
    title: 'Mobile Apps',
    tagline: 'iOS and Android, designed for real behaviour.',
    img: '/img/services/mobile.webp',
    alt: 'Abstract luminous capsule-like form with orbital rings of indigo light, representing portable personal technology',
    span: 'square',
  },
  {
    key: 'ai',
    href: '/services',
    title: 'AI & Automation',
    tagline: 'Practical AI that saves real time.',
    img: '/img/services/ai.webp',
    alt: 'Abstract luminous mesh of indigo light threads forming a glowing field with sparks of insight breaking outward',
    span: 'wide',
    chip: { kind: 'sparkle' },
  },
]

function ChipFlagship() {
  return (
    <span className={styles.chipFlagship}>
      <span className={styles.chipDot} />
      Flagship
    </span>
  )
}

function ChipSparkle() {
  return (
    <span className={styles.chipSparkle} aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1.5l1.4 4.1L13.5 7l-4.1 1.4L8 12.5l-1.4-4.1L2.5 7l4.1-1.4L8 1.5z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}

function ArrowChip() {
  return (
    <span className={styles.chipArrow} aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M5 11l6-6M11 5H6.5M11 5v4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function Card({ card, index }) {
  const reduced = useReducedMotion()

  // Local pointer-driven parallax for the image (±5%), independent of Tilt's
  // own internal pointer tracking. Guarded explicitly: MotionConfig's global
  // reducedMotion="user" only suppresses declarative animations, not these
  // imperative motion values, so the handlers are simply never attached when
  // reduced motion is requested and the image stays put.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 150, damping: 20 })
  const sy = useSpring(py, { stiffness: 150, damping: 20 })
  const imgX = useTransform(sx, [-0.5, 0.5], ['-5%', '5%'])
  const imgY = useTransform(sy, [-0.5, 0.5], ['-5%', '5%'])

  function handlePointerMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handlePointerLeave() {
    px.set(0)
    py.set(0)
  }

  return (
    <Link
      to={card.href}
      className={`${styles.card} ${styles[card.span]}`}
      aria-label={`${card.title} — ${card.tagline}`}
    >
      <Reveal
        delay={index * 0.08}
        className={styles.revealInner}
        onPointerMove={reduced ? undefined : handlePointerMove}
        onPointerLeave={reduced ? undefined : handlePointerLeave}
      >
        <Tilt max={6} scale={1.03} className={styles.tilt}>
          <span className={styles.imgWrap} aria-hidden="true">
            <m.img
              src={card.img}
              alt=""
              loading="lazy"
              width="1280"
              height="960"
              className={styles.img}
              style={reduced ? undefined : { x: imgX, y: imgY }}
              whileHover={{ scale: 1.05 }}
            />
            <span className={styles.scrim} />
          </span>

          <span className={styles.chipSlot}>
            {card.chip?.kind === 'flagship' ? (
              <ChipFlagship />
            ) : card.chip?.kind === 'sparkle' ? (
              <ChipSparkle />
            ) : (
              <ArrowChip />
            )}
          </span>

          <span className={styles.body}>
            <span className={styles.title}>{card.title}</span>
            <span className={styles.tagline}>{card.tagline}</span>
          </span>
        </Tilt>
      </Reveal>
    </Link>
  )
}

export default function ServiceShowcase() {
  return (
    <div className={styles.bento}>
      {CARDS.map((card, i) => (
        <Card key={card.key} card={card} index={i} />
      ))}
    </div>
  )
}
