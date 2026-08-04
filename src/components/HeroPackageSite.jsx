import { useRef, useState } from 'react'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { useInViewOnce } from '../motion/ink/index.js'
import {
  IconWeb,
  IconGlobe,
  IconServer,
  IconMail,
  IconSearch,
  IconShieldCheck,
} from './Icon.jsx'
import styles from './HeroPackageSite.module.css'

/* Website Package hero visual — a browser previewing FOUR real-looking
   small-business sites, switchable from the tab strip.

   REBUILT 2026-08-04 (user, with a screenshot). The previous version
   built one site up from an empty frame on a loop, and the complaints
   were exact: "it shows blank screen for some time and the content
   loads, I don't want that... what if the user thinks it is just a blank
   screen and scrolls down or closes the tab", plus "this vignette can be
   better, it just repeats the same content". Three things changed:

     1. IT IS NEVER EMPTY. The card paints a complete site on the first
        frame; the entrance is a ~350ms stagger of layers that are
        already there, not a build from nothing. There is no phase 0.
     2. IT IS INTERACTIVE. Four businesses sit in the browser's tab
        strip and the visitor can click between them; the address bar,
        nav, headline, media caption and service tiles all re-skin. It
        answers the one question the copy can't: "what would MY site
        look like?" A trade sees a trade, a café sees a café.
     3. IT STOPS REPEATING THE PAGE. The old loop restated the hero's
        price and the chart's inclusions. Four complete micro-sites are
        content the page does not have anywhere else.

   The "going live" story is kept, because it is the product promise: on
   arrival and on every switch the status chip runs Building → Going live
   → Live and the padlock ignites with it. The difference is that the
   site is on screen the whole time.

   Auto-advances through the four while in view and stops permanently on
   the first manual pick (same contract as the page's explorer tabs).
   Reduced motion: no rotation, no entrance, first site rendered live.

   Vignette rules still apply: theme tokens only (both ink modes), real
   micro-copy never skeleton bars, transform/opacity motion, and
   highlight-only interaction states (this page's no-movement rule). The
   mock site is decorative (aria-hidden); the tab buttons are real
   controls and carry their own labels. NO money appears inside the mock
   content — the visitor's currency is detected, so a hardcoded price in
   a service tile would contradict the rest of the page. */

/* the four sample sites. Sector spread is deliberate and matches "Who
   this is for": a workshop trade, a food business, an emergency trade
   and an appointment business. `short` is what the TAB shows — four full
   business names truncate to "OAKFIELD JO / HARBOUR LAN" at every real
   card width, and the sector is the more useful label anyway (the name
   is right below it in the sample site's own nav). */
const SITES = [
  {
    key: 'joinery',
    name: 'Oakfield Joinery',
    short: 'Joinery',
    sector: 'a joinery workshop',
    domain: 'oakfieldjoinery',
    links: ['Home', 'Work', 'Contact'],
    navCta: 'Get a quote',
    head: ['Bespoke joinery,', 'built to last.'],
    cta: 'Request a quote',
    mediaTag: 'Oak wardrobe',
    tiles: [
      ['Kitchens', 'Design & fit'],
      ['Wardrobes', 'Made to measure'],
      ['Staircases', 'Oak & ash'],
    ],
  },
  {
    key: 'cafe',
    name: 'Harbour Lane Café',
    short: 'Café',
    sector: 'a coffee house',
    domain: 'harbourlanecafe',
    links: ['Menu', 'Visit', 'Contact'],
    navCta: 'Book a table',
    head: ['Roasted in house,', 'baked every morning.'],
    cta: 'See the menu',
    mediaTag: 'Flat white',
    tiles: [
      ['Breakfast', 'Served till noon'],
      ['Lunch', 'Made to order'],
      ['Coffee', 'Roasted in house'],
    ],
  },
  {
    key: 'plumbing',
    name: 'Ridgeway Plumbing',
    short: 'Plumbing',
    sector: 'an emergency plumber',
    domain: 'ridgewayplumbing',
    links: ['Services', 'Areas', 'Contact'],
    navCta: 'Call now',
    head: ['Emergency plumbing,', 'day or night.'],
    cta: 'Book a callout',
    mediaTag: 'Boiler service',
    tiles: [
      ['Boilers', 'Repair & install'],
      ['Leaks', 'Same day fix'],
      ['Bathrooms', 'Full fit out'],
    ],
  },
  {
    key: 'salon',
    name: 'Ivy Lane Hair Studio',
    short: 'Salon',
    sector: 'a hair studio',
    domain: 'ivylanehair',
    links: ['Services', 'Team', 'Book'],
    navCta: 'Book online',
    head: ['Colour and cut,', 'by appointment.'],
    cta: 'Book online',
    mediaTag: 'Colour bar',
    tiles: [
      ['Cut & finish', 'Seven days'],
      ['Colour', 'Consultation free'],
      ['Bridal', 'Trial included'],
    ],
  },
]

/* deliverables ticker in the card foot — the user wants the deliverables
   NAMED in moving text, not implied by bare icons (2026-08-03). Rendered
   twice for a seamless -50% marquee loop. */
const TICKER = [
  ['Website', IconWeb],
  ['Custom domain', IconGlobe],
  ['Hosting', IconServer],
  ['Business email', IconMail],
  ['SEO & Analytics', IconSearch],
  /* generic since the page went to three packages (support runs 60, 90
     or 120 days by tier) */
  ['Launch support', IconShieldCheck],
]

/* going-live clock: the chip and padlock run this on mount and on every
   switch, over content that is already on screen */
const SECURED_AT = 620
const LIVE_AT = 1320
/* how long each sample site holds before the next one slides in */
const ROTATE = 6200

/* the price stamp is as wide as the currency makes it. The size class
   shrinks the figure and widens the space reserved for it in the chrome,
   so the stamp never lands on the status chip (user 2026-08-04,
   screenshot: a long price covered the "Live" pill). Today's two prices
   ("£599", "$799") are both short, so this always resolves to szSm — it
   is kept as the guard that lets a new market's price list arrive
   without breaking the chrome. */
function stampSize(price) {
  const n = price.length
  if (n <= 6) return styles.szSm
  if (n <= 8) return styles.szMd
  return styles.szLg
}

function Padlock({ className }) {
  return (
    <svg
      className={className}
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <rect x="2" y="5.2" width="8" height="5.4" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3.8 5V3.9a2.2 2.2 0 0 1 4.4 0V5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

/* `price` is the Starter price in the visitor's currency and `tld` the
   domain ending that suits it (.co.uk in the UK, .com elsewhere) — the
   page owns currency detection and passes both down, so this component
   never hardcodes money or assumes a country. Defaults keep it
   standalone-safe. */
export default function HeroPackageSite({ price = '$799', tld = '.com' }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  /* 0 = building, 1 = certificate landed, 2 = live. Reduced motion skips
     straight to live and never moves again. */
  const [stage, setStage] = useState(reduced ? 2 : 0)
  const clock = useRef({ secured: 0, live: 0, rotate: 0, locked: false })

  const runGoLive = () => {
    const c = clock.current
    clearTimeout(c.secured)
    clearTimeout(c.live)
    setStage(0)
    c.secured = setTimeout(() => setStage(1), SECURED_AT)
    c.live = setTimeout(() => setStage(2), LIVE_AT)
  }

  const ref = useInViewOnce(
    () => ({
      play() {
        if (reduced) return
        runGoLive()
        clock.current.rotate = setInterval(() => {
          if (clock.current.locked) return
          setActive((i) => (i + 1) % SITES.length)
          runGoLive()
        }, ROTATE)
      },
      cleanup() {
        const c = clock.current
        clearTimeout(c.secured)
        clearTimeout(c.live)
        clearInterval(c.rotate)
      },
    }),
    { threshold: 0.3 },
  )

  /* first pick hands control over for good: nothing should move under a
     visitor who is reading the sample they chose */
  const pick = (i) => {
    const c = clock.current
    c.locked = true
    clearInterval(c.rotate)
    if (i === active) return
    setActive(i)
    if (!reduced) runGoLive()
  }

  const site = SITES[active]
  const secured = stage >= 1
  const live = stage >= 2
  const statusLabel = live ? 'Live' : secured ? 'Going live' : 'Building'

  return (
    <div ref={ref} className={`${styles.wrap} ${stampSize(price)}`}>
      <div className={styles.frame}>
        {/* —— tab strip: the sample switcher, as browser tabs ——— */}
        <div className={styles.tabs} role="group" aria-label="Preview a sample website">
          {SITES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              className={i === active ? `${styles.tab} ${styles.tabOn}` : styles.tab}
              aria-pressed={i === active}
              aria-label={`Preview ${s.name}, ${s.sector}`}
              onClick={() => pick(i)}
            >
              <i className={styles.tabDot} aria-hidden="true" />
              <span className={styles.tabLabel} aria-hidden="true">
                {s.short}
              </span>
            </button>
          ))}
        </div>

        {/* —— browser chrome ———————————————————— */}
        <div className={styles.head} aria-hidden="true">
          <span className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
          {/* fresh mount per site so the address swap reads as a load */}
          <span key={site.key} className={styles.addr}>
            <Padlock className={secured ? `${styles.lock} ${styles.on}` : styles.lock} />
            <span className={secured ? `${styles.https} ${styles.on}` : styles.https}>https://</span>
            {site.domain}
            {tld}
          </span>
          {/* fresh mount per label so the swap fade replays */}
          <span key={statusLabel} className={live ? styles.statusLive : styles.status}>
            {live && <i className={styles.statusDot} />}
            {statusLabel}
          </span>
        </div>

        {/* —— the sample site ————————————————————
            keyed by site: every layer replays its entrance on a switch.
            The layers animate from *almost* there (opacity + 6px), fast
            and staggered, so the canvas is never a blank rectangle. */}
        <div key={site.key} className={styles.canvas} aria-hidden="true">
          <div className={styles.sNav}>
            <span className={styles.sBrand}>
              <i className={styles.sBrandDot} />
              {site.name}
            </span>
            <span className={styles.sLinks}>
              {site.links.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
            <span className={styles.sCta}>{site.navCta}</span>
          </div>

          <div className={styles.sHero}>
            <div className={styles.sCopy}>
              <span className={styles.sH}>
                {site.head[0]}
                <br />
                <em>{site.head[1]}</em>
              </span>
              <span className={styles.sSub} />
              <span className={styles.sBtn}>{site.cta}</span>
            </div>
            <div className={`${styles.sMedia} ${styles[`tone${active}`]}`}>
              <i className={styles.sOrb} />
              <span className={styles.sMediaTag}>{site.mediaTag}</span>
            </div>
          </div>

          <div className={styles.sTiles}>
            {site.tiles.map(([t, sub]) => (
              <span key={t} className={styles.sTile}>
                <span className={styles.sTileName}>{t}</span>
                <span className={styles.sTileSub}>{sub}</span>
              </span>
            ))}
          </div>
        </div>

        {/* —— deliverables ticker (labelled marquee) ——————— */}
        <div className={styles.foot} aria-hidden="true">
          <span className={styles.footTag}>
            <i className={styles.footDot} />
            Every plan
          </span>
          <div className={styles.ticker}>
            <div className={styles.tickerTrack}>
              {[0, 1].map((dup) => (
                <span key={dup} className={styles.tickerSeq}>
                  {TICKER.map(([label, Icon]) => (
                    <span key={label} className={styles.tickerChip}>
                      <Icon className={styles.tickerIcon} />
                      {label}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* —— floating price stamp ————————————————— */}
      {/* label reads "All-inclusive", not "Fixed price" (user 2026-08-03:
          keep the stamp premium); the 2-3 week turnaround pill lives in
          the hero's value strip now, not on the card. The foot names the
          ONE package the figure buys — "All-inclusive from / three
          packages" read as though it covered all three (user
          2026-08-04). It is exactly the Starter price, so no "from". */}
      <div
        className={live ? `${styles.stamp} ${styles.stampLive}` : styles.stamp}
        aria-hidden="true"
      >
        <span className={styles.stampLabel}>All-inclusive</span>
        <span className={styles.stampValue}>{price}</span>
        <span className={styles.stampFoot}>Starter plan</span>
      </div>
    </div>
  )
}
