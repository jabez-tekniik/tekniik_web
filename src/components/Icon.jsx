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

export function IconReply(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 15L4 10l5-5" />
      <path d="M4 10h9.5a6 6 0 0 1 6 6v3" />
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

/* Social marks — official brand glyphs, fill-based (exception to the
   outline set). */
export function IconLinkedIn(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function IconInstagram(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

export function IconXSocial(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
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

export function IconBulb(props) {
  return (
    <svg {...base} {...props}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 17.5h6M10.5 21h3" />
    </svg>
  )
}

export function IconPen(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20l1.3-4.6L16.8 3.9a2.1 2.1 0 0 1 3 3L8.3 18.4 4 20z" />
      <path d="M14.5 6.2l3 3" />
    </svg>
  )
}

export function IconFlask(props) {
  return (
    <svg {...base} {...props}>
      <path d="M10 2.8v5.6a2 2 0 0 1-.2.9l-4.8 9.4a2 2 0 0 0 1.8 2.8h10.4a2 2 0 0 0 1.8-2.8l-4.8-9.4a2 2 0 0 1-.2-.9V2.8" />
      <path d="M8.5 2.8h7M7.2 15.5h9.6" />
    </svg>
  )
}

export function IconDeploy(props) {
  // cloud-upload — the standard "deploy to cloud" glyph
  return (
    <svg {...base} {...props}>
      <path d="M4.5 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" />
      <path d="M12 21v-8M8.2 16.8L12 13l3.8 3.8" />
    </svg>
  )
}

export function IconCard(props) {
  // credit card — payments
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 10h19" />
      <path d="M6 14.5h4" />
    </svg>
  )
}

export function IconGrid(props) {
  // dashboard panels — admin
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7" height="10" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="6" rx="1.5" />
      <rect x="13.5" y="12.5" width="7" height="8" rx="1.5" />
      <rect x="3.5" y="16.5" width="7" height="4" rx="1.5" />
    </svg>
  )
}

export function IconServer(props) {
  // stacked hosting racks — domain & hosting
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3.5" width="18" height="7.5" rx="1.5" />
      <rect x="3" y="13" width="18" height="7.5" rx="1.5" />
      <path d="M6.5 7.25h.01M6.5 16.75h.01M17.5 7.25h-3M17.5 16.75h-3" />
    </svg>
  )
}

export function IconSearch(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.8 15.8l4.7 4.7" />
    </svg>
  )
}

export function IconShieldCheck(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 2.8v5.3c0 4.5-3 8.2-7 9.9-4-1.7-7-5.4-7-9.9V5.8L12 3z" />
      <path d="M9 11.8l2.2 2.2 4-4.4" />
    </svg>
  )
}

export function IconStore(props) {
  // storefront with scalloped awning — local business
  return (
    <svg {...base} {...props}>
      <path d="M2.5 7l3.2-4.4a2 2 0 0 1 1.6-.8h9.4a2 2 0 0 1 1.6.8L21.5 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M14.5 22v-4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v4" />
      <path d="M2.5 7h19M21.5 7v3a2 2 0 0 1-2 2 2.6 2.6 0 0 1-1.9-.8 2.6 2.6 0 0 1-3.8 0 2.6 2.6 0 0 1-3.6 0 2.6 2.6 0 0 1-3.8 0A2.6 2.6 0 0 1 4.5 12a2 2 0 0 1-2-2V7" />
    </svg>
  )
}

export function IconRefresh(props) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.9 1 6.7 2.7L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  )
}

export function IconBriefcase(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" />
      <path d="M3 12.5h18" />
    </svg>
  )
}

export function IconTrendUp(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 17l5.5-5.5 4 4L20.5 7" />
      <path d="M15 7h5.5v5.5" />
    </svg>
  )
}

export function IconGlobe(props) {
  // lucide globe: sphere + equator + meridian (custom-domain glyph)
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a13.6 13.6 0 0 1 0 18 13.6 13.6 0 0 1 0-18z" />
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

export function IconPing(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="9" opacity="0.4" />
    </svg>
  )
}
