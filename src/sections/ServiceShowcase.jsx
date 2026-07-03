import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
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

export default function ServiceShowcase() {
  return (
    <Reveal className={styles.bento} stagger>
      {CARDS.map((card, i) => (
        <Link
          key={card.key}
          to={card.href}
          className={`${styles.card} ${styles[card.span]}`}
          style={{ '--i': i }}
          aria-label={`${card.title} — ${card.tagline}`}
        >
          <span className={styles.imgWrap} aria-hidden="true">
            <img
              src={card.img}
              alt=""
              loading="lazy"
              width="1280"
              height="960"
              className={styles.img}
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
        </Link>
      ))}
    </Reveal>
  )
}
