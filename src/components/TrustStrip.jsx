import styles from './TrustStrip.module.css'

// DiceBear v9 — `notionists` style: clean illustrated portrait avatars,
// SVG, no auth required, CDN-cached. Each seed produces a deterministic
// portrait so the same three faces render every load. Background tints
// echo the brand palette (lavender / cream / pink-tint) without being loud.
const AVATARS = [
  { seed: 'tekniik-alex', bg: 'ede9fe' },
  { seed: 'tekniik-maya', bg: 'fbcfe8' },
  { seed: 'tekniik-sam', bg: 'ddd6fe' },
]

function avatarUrl({ seed, bg }) {
  const params = new URLSearchParams({
    seed,
    backgroundColor: bg,
    radius: '50',
  })
  return `https://api.dicebear.com/9.x/notionists/svg?${params}`
}

// Single SVG with 5 star paths so the gradient definition lives in one
// place (avoids duplicate id collisions when multiple Star components
// render on the same page).
function Stars() {
  return (
    <svg
      className={styles.stars}
      width="104"
      height="20"
      viewBox="0 0 104 20"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ts-gold" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFE38A" />
          <stop offset="0.55" stopColor="#F5B83D" />
          <stop offset="1" stopColor="#C8890C" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          transform={`translate(${i * 21} 0)`}
          d="M10 1.7l2.43 5.06 5.57.62-4.15 3.81 1.16 5.51L10 13.8 5 16.7l1.16-5.51L2 7.38l5.57-.62L10 1.7z"
          fill="url(#ts-gold)"
        />
      ))}
    </svg>
  )
}

function PinIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={styles.pinIcon}
    >
      <path
        d="M8 14.5s-5-4.4-5-8.5a5 5 0 1110 0c0 4.1-5 8.5-5 8.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6" r="1.6" fill="currentColor" />
    </svg>
  )
}

export default function TrustStrip({ rating = '4.9', count = '50+ projects', region = 'UK · Remote' }) {
  return (
    <div
      className={styles.trust}
      role="group"
      aria-label={`Rated ${rating} out of 5 from ${count}`}
    >
      <div className={styles.avatars} aria-hidden="true">
        {AVATARS.map((a) => (
          <img
            key={a.seed}
            className={styles.avatar}
            src={avatarUrl(a)}
            alt=""
            width="32"
            height="32"
            loading="eager"
            decoding="async"
            style={{ backgroundColor: `#${a.bg}` }}
          />
        ))}
      </div>

      <div className={styles.rating}>
        <Stars />
        <span className={styles.ratingText}>
          <strong>{rating}</strong>
          <span className={styles.ratingMeta}>from {count}</span>
        </span>
      </div>

      <span className={styles.divider} aria-hidden="true" />

      <span className={styles.region}>
        <PinIcon />
        {region}
      </span>
    </div>
  )
}
