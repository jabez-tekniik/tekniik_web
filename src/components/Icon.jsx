/* Inline SVG icon set — outlines only, 1.6px stroke for cohesion. */

import { Fragment } from 'react'

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconWeb(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M3 8h18" />
      <circle cx="6" cy="6" r="0.6" fill="currentColor" />
      <circle cx="8.4" cy="6" r="0.6" fill="currentColor" />
      <path d="M9 21h6M12 17v4" />
    </svg>
  )
}

export function IconApp(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="14" rx="2" />
      <path d="M8 13l2-2-2-2M11.5 13H15" />
    </svg>
  )
}

export function IconMobile(props) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10 19h4" />
    </svg>
  )
}

export function IconAi(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4.5l1.4 4 4.1 1.5-4.1 1.5L12 15.5l-1.4-4-4.1-1.5 4.1-1.5L12 4.5z" />
      <path d="M19 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7L19 14.5z" />
    </svg>
  )
}

export function IconTeam(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M3 20c.5-3.4 2.9-5.6 6-5.6S14.5 16.6 15 20" />
      <path d="M16 5.2a3.4 3.4 0 0 1 0 6.6M21 20c-.3-2.1-1.5-3.7-3.2-4.6" />
    </svg>
  )
}

export function IconClarity(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16h.01" />
    </svg>
  )
}

export function IconChip(props) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
      <path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" />
    </svg>
  )
}

export function IconHeart(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </svg>
  )
}

export function IconArrow(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}

export function IconClose(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IconMenu(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function IconExternal(props) {
  return (
    <svg {...base} {...props}>
      <path d="M14 4h6v6M20 4l-9 9M5 7v12h12" />
    </svg>
  )
}

export function IconMail(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </svg>
  )
}

export function IconPhone(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 4h3.2l1.6 4-2 1.4a12 12 0 0 0 6.8 6.8l1.4-2 4 1.6V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  )
}

export function IconWhatsApp(props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.465 3.488" />
    </svg>
  )
}

export function IconCompass(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </svg>
  )
}

export function IconScroll(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 5h11a3 3 0 0 1 3 3v9a2 2 0 0 1-2 2H8a3 3 0 0 1-3-3V5z" />
      <path d="M19 17a2 2 0 0 0 0 4 2 2 0 0 0 0-4zM8 9h8M8 12h8M8 15h5" />
    </svg>
  )
}

export function IconPalette(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-.6-1-.6-2c0-1 .9-2 2.1-2H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9z" />
      <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="11" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconCode(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 8l-4 4 4 4M15 8l4 4-4 4M13 6l-2 12" />
    </svg>
  )
}

export function IconRocket(props) {
  return (
    <svg {...base} {...props}>
      <path d="M14 4c4 0 6 2 6 6 0 3-2 6-6 8l-3-3c2-4 5-6 8-6M9 14l-3 3M5 19c1-2 3-2 4 0M5 14a3 3 0 0 0-3 3v3h3a3 3 0 0 0 3-3" />
      <circle cx="15" cy="9" r="1.4" />
    </svg>
  )
}

export function IconHandshake(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 13l3-3 3 1 3-1 3 3 3-3 3 3-3 3-3-1-3 1-3-1-3 1-3-3z" />
      <path d="M9 11l3 3M15 11l-3 3" />
    </svg>
  )
}

export function IconQuote(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 7h4v6c0 2-1.5 3.5-4 4M14 7h4v6c0 2-1.5 3.5-4 4" />
    </svg>
  )
}

export function IconClock(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function IconBolt(props) {
  return (
    <svg {...base} {...props}>
      <path d="M13 3l-7 11h5l-1 7 7-11h-5l1-7z" />
    </svg>
  )
}

export function IconSparkle(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4z" />
    </svg>
  )
}

export function IconStar(props) {
  // Filled rating star; heavy round-joined stroke blunts the points.
  return (
    <svg
      width="0.9em"
      height="0.9em"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 3.8l2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8L12 3.8z" />
    </svg>
  )
}

/* Renders copy containing the ★ character with each ★ swapped for IconStar,
   sized/aligned to the surrounding text via em units. */
export function StarredText({ text }) {
  const parts = String(text).split('★')
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <IconStar
          // display overrides the global `svg { display: block }` reset so the
          // star sits inline with the surrounding text
          style={{
            display: 'inline-block',
            verticalAlign: '-0.08em',
            marginInline: '0.1em 0.14em',
          }}
        />
      )}
    </Fragment>
  ))
}

/* Flag marks — fill-based (exception to the outline set), 3:2 ratio.
   National colors are fixed by the flags themselves, so hex here is exempt
   from the no-hardcoded-hex rule (same class as the WhatsApp green). */
const flagBase = { width: 21, height: 14, viewBox: '0 0 30 20', fill: 'none' }

export function IconFlagIndia(props) {
  return (
    <svg {...flagBase} {...props}>
      <rect width="30" height="20" fill="#ffffff" />
      <rect width="30" height="6.7" fill="#ff9933" />
      <rect y="13.3" width="30" height="6.7" fill="#138808" />
      <circle cx="15" cy="10" r="2.4" stroke="#000080" strokeWidth="0.9" />
      <circle cx="15" cy="10" r="0.7" fill="#000080" />
    </svg>
  )
}

export function IconFlagUK(props) {
  return (
    <svg {...flagBase} {...props}>
      <rect width="30" height="20" fill="#012169" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#ffffff" strokeWidth="4" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" strokeWidth="1.8" />
      <path d="M15 0v20M0 10h30" stroke="#ffffff" strokeWidth="6.6" />
      <path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="4" />
    </svg>
  )
}

export function IconPing(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="9" opacity="0.4" />
    </svg>
  )
}
