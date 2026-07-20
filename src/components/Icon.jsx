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

/* Flag marks — fill-based (exception to the outline set). Rounded-rect
   badge art supplied by the user (2026-07-20); each carries its own corner
   radius + inset border, so wrappers need no ring/clip of their own.
   National colors are fixed by the flags themselves, so hex here is exempt
   from the no-hardcoded-hex rule. */
const flagBase = { width: 20, height: 20, viewBox: '0 0 32 32' }

export function IconFlagIndia(props) {
  return (
    <svg {...flagBase} {...props}>
      <path fill="#fff" d="M1 11H31V21H1z" />
      <path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" fill="#e06535" />
      <path
        d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z"
        transform="rotate(180 16 24)"
        fill="#2c6837"
      />
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      />
      <path
        d="M16,12.292c-2.048,0-3.708,1.66-3.708,3.708s1.66,3.708,3.708,3.708,3.708-1.66,3.708-3.708-1.66-3.708-3.708-3.708Zm3.041,4.109c-.01,.076,.042,.145,.117,.157-.033,.186-.08,.367-.143,.54-.071-.028-.152,.006-.181,.077-.029,.071,.004,.151,.073,.182-.04,.085-.083,.167-.13,.248l-1.611-1.069-.592-.249c.013-.026,.024-.053,.034-.081l.595,.242,1.895,.383-1.833-.616-.636-.087c.006-.028,.009-.057,.011-.087l.638,.08,1.93-.12-1.93-.12-.638,.08c-.002-.03-.005-.059-.011-.087l.636-.087,1.833-.616-1.895,.383-.595,.242c-.009-.028-.021-.055-.034-.081l.592-.249,1.611-1.069c.047,.081,.09,.163,.13,.248-.07,.031-.103,.111-.073,.182,.029,.071,.11,.105,.181,.077,.063,.173,.111,.354,.143,.54-.075,.012-.127,.081-.117,.157,.01,.076,.078,.129,.154,.121,.008,.092,.013,.185,.013,.279s-.005,.187-.013,.279c-.075-.008-.144,.045-.154,.121Zm-.584-2.462c-.059,.048-.07,.134-.023,.194,.046,.06,.132,.072,.194,.028,.053,.076,.104,.155,.15,.236l-1.731,.861-.512,.388c-.016-.024-.034-.047-.054-.069l.508-.394,1.28-1.45-1.45,1.28-.394,.508c-.022-.019-.045-.038-.069-.054l.388-.512,.861-1.731c.081,.047,.16,.097,.236,.15-.045,.061-.033,.147,.028,.194,.061,.046,.147,.036,.194-.023,.071,.06,.141,.123,.207,.189,.066,.066,.129,.135,.189,.207Zm-2.177-1.133c-.008,.075,.045,.144,.121,.154,.076,.01,.145-.042,.157-.117,.186,.033,.367,.08,.54,.143-.028,.071,.006,.152,.077,.181,.071,.029,.151-.004,.182-.073,.085,.04,.167,.083,.248,.13l-1.069,1.611-.249,.592c-.026-.013-.053-.024-.081-.034l.242-.595,.383-1.895-.616,1.833-.087,.636c-.028-.006-.057-.009-.087-.011l.08-.638-.12-1.93-.12,1.93,.08,.638c-.03,.002-.059,.005-.087,.011l-.087-.636-.616-1.833,.383,1.895,.242,.595c-.028,.009-.055,.021-.081,.034l-.249-.592-1.069-1.611c.081-.047,.163-.09,.248-.13,.031,.07,.111,.103,.182,.073,.071-.029,.105-.11,.077-.181,.173-.063,.354-.111,.54-.143,.012,.075,.081,.127,.157,.117,.076-.01,.129-.078,.121-.154,.092-.008,.185-.013,.279-.013s.187,.005,.279,.013Zm-3.113,4.368c-.029-.071-.11-.105-.181-.077-.063-.173-.111-.354-.143-.54,.075-.012,.127-.081,.117-.157-.01-.076-.078-.129-.154-.121-.008-.092-.013-.185-.013-.279s.005-.187,.013-.279c.075,.008,.144-.045,.154-.121,.01-.076-.042-.145-.117-.157,.033-.186,.08-.367,.143-.54,.071,.028,.152-.006,.181-.077,.029-.071-.004-.151-.073-.182,.04-.085,.083-.167,.13-.248l1.611,1.069,.592,.249c-.013,.026-.024,.053-.034,.081l-.595-.242-1.895-.383,1.833,.616,.636,.087c-.006,.028-.009,.057-.011,.087l-.638-.08-1.93,.12,1.93,.12,.638-.08c.002,.03,.005,.059,.011,.087l-.636,.087-1.833,.616,1.895-.383,.595-.242c.009,.028,.021,.055,.034,.081l-.592,.249-1.611,1.069c-.047-.081-.09-.163-.13-.248,.07-.031,.103-.111,.073-.182Zm.772-3.63c.048,.059,.134,.07,.194,.023,.06-.046,.072-.132,.028-.194,.076-.053,.155-.104,.236-.15l.861,1.731,.388,.512c-.024,.016-.047,.034-.069,.054l-.394-.508-1.45-1.28,1.28,1.45,.508,.394c-.019,.022-.038,.045-.054,.069l-.512-.388-1.731-.861c.047-.081,.097-.16,.15-.236,.061,.045,.147,.033,.194-.028,.046-.061,.036-.147-.023-.194,.06-.071,.123-.141,.189-.207s.135-.129,.207-.189Zm-.395,4.518c.059-.048,.07-.134,.023-.194-.046-.06-.132-.072-.194-.028-.053-.076-.104-.155-.15-.236l1.731-.861,.512-.388c.016,.024,.034,.047,.054,.069l-.508,.394-1.28,1.45,1.45-1.28,.394-.508c.022,.019,.045,.038,.069,.054l-.388,.512-.861,1.731c-.081-.047-.16-.097-.236-.15,.045-.061,.033-.147-.028-.194-.061-.046-.147-.036-.194,.023-.071-.06-.141-.123-.207-.189-.066-.066-.129-.135-.189-.207Zm2.177,1.133c.008-.075-.045-.144-.121-.154-.076-.01-.145,.042-.157,.117-.186-.033-.367-.08-.54-.143,.028-.071-.006-.152-.077-.181-.071-.029-.151,.004-.182,.073-.085-.04-.167-.083-.248-.13l1.069-1.611,.249-.592c.026,.013,.053,.024,.081,.034l-.242,.595-.383,1.895,.616-1.833,.087-.636c.028,.006,.057,.009,.087,.011l-.08,.638,.12,1.93,.12-1.93-.08-.638c.03-.002,.059-.005,.087-.011l.087,.636,.616,1.833-.383-1.895-.242-.595c.028-.009,.055-.021,.081-.034l.249,.592,1.069,1.611c-.081,.047-.163,.09-.248,.13-.031-.07-.111-.103-.182-.073-.071,.029-.105,.11-.077,.181-.173,.063-.354,.111-.54,.143-.012-.075-.081-.127-.157-.117-.076,.01-.129,.078-.121,.154-.092,.008-.185,.013-.279,.013s-.187-.005-.279-.013Zm2.341-.738c-.048-.059-.134-.07-.194-.023-.06,.046-.072,.132-.028,.194-.076,.053-.155,.104-.236,.15l-.861-1.731-.388-.512c.024-.016,.047-.034,.069-.054l.394,.508,1.45,1.28-1.28-1.45-.508-.394c.019-.022,.038-.045,.054-.069l.512,.388,1.731,.861c-.047,.081-.097,.16-.15,.236-.061-.045-.147-.033-.194,.028-.046,.061-.036,.147,.023,.194-.06,.071-.123,.141-.189,.207s-.135,.129-.207,.189Z"
        fill="#2c2c6b"
      />
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      />
    </svg>
  )
}

export function IconFlagUK(props) {
  return (
    <svg {...flagBase} {...props}>
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65" />
      <path
        d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z"
        fill="#fff"
      />
      <path
        d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z"
        fill="#b92932"
      />
      <path
        d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z"
        fill="#b92932"
      />
      <path
        d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z"
        fill="#fff"
      />
      <rect x="13" y="4" width="6" height="24" fill="#fff" />
      <rect x="1" y="13" width="30" height="6" fill="#fff" />
      <rect x="14" y="4" width="4" height="24" fill="#b92932" />
      <rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932" />
      <path
        d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z"
        fill="#b92932"
      />
      <path
        d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z"
        fill="#b92932"
      />
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
        opacity=".15"
      />
      <path
        d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
        fill="#fff"
        opacity=".2"
      />
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
