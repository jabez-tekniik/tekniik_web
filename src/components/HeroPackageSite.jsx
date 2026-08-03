import { useState } from 'react'
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

/* Website Package hero visual — "your site going live". Sibling of
   HeroBuildBoard/HeroThread: a browser console card in which a small
   business's website assembles itself in a loop — nav lands, copy and
   media fill in, the padlock ignites (https), the status chip flips to
   Live — holds, resets, repeats. The card foot runs a labelled marquee of
   the six deliverables (website / custom domain / hosting / business
   email / SEO & analytics / launch support), and a navy "£599 Starter pack" stamp
   floats over the frame corner. All dummy content is a plausible UK small business
   (vignette rule: real micro-copy, never bare skeleton bars). Decorative
   (aria-hidden) — the price and trust facts live in the hero's real text.
   Reduced motion: the cycle never starts and the card renders finished:
   site complete, padlock lit, status Live, pipeline fully lit. */

/* deliverables ticker in the card foot — the user wants the deliverables
   NAMED in moving text, not implied by bare icons (2026-08-03). Rendered
   twice for a seamless -50% marquee loop. */
const TICKER = [
  ['Website', IconWeb],
  ['Custom domain', IconGlobe],
  ['Hosting', IconServer],
  ['Business email', IconMail],
  ['SEO & Analytics', IconSearch],
  /* generic since the page went to three packages (support runs 30, 60
     or 90 days by tier) */
  ['Launch support', IconShieldCheck],
]

/* build clock: one beat per STEP; the finished (Live) site holds for HOLD,
   everything fades back, rebuild. */
const STEP = 1500
const HOLD = 4400
const START_DELAY = 900
const REBUILD_PAUSE = 700
const MAX = 5

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

export default function HeroPackageSite() {
  const reduced = useReducedMotion()
  /* 0 = empty frame, 1 = nav, 2 = copy + media, 3 = feature tiles,
     4 = https secured, 5 = live (hold beat). Under reduced motion the
     cycle never runs — derived `shown` renders the finished site. */
  const [phase, setPhase] = useState(0)
  const shown = reduced ? MAX : phase

  const ref = useInViewOnce(
    () => {
      let timer
      return {
        play() {
          const tick = (p) => {
            setPhase(p)
            const done = p === MAX
            timer = setTimeout(
              () => tick(done ? 0 : p + 1),
              done ? HOLD : p === 0 ? REBUILD_PAUSE : STEP,
            )
          }
          timer = setTimeout(() => tick(1), START_DELAY)
        },
        cleanup() {
          clearTimeout(timer)
        },
      }
    },
    { threshold: 0.3 },
  )

  const on = (k) => (shown >= k ? ` ${styles.on}` : '')
  const live = shown >= MAX
  const statusLabel = live ? 'Live' : shown >= 4 ? 'Going live' : shown >= 1 ? 'Building' : 'Queued'

  return (
    <div ref={ref} className={styles.wrap} aria-hidden="true">
      <div className={styles.frame}>
        {/* —— browser chrome ———————————————————— */}
        <div className={styles.head}>
          <span className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.addr}>
            <Padlock className={styles.lock + on(4)} />
            <span className={styles.https + on(4)}>https://</span>
            yourbusiness.co.uk
          </span>
          {/* fresh mount per label so the swap fade replays */}
          <span key={statusLabel} className={live ? styles.statusLive : styles.status}>
            {live && <i className={styles.statusDot} />}
            {statusLabel}
          </span>
        </div>

        {/* —— the site assembling ————————————————— */}
        <div className={styles.canvas}>
          <div className={styles.sNav + on(1)}>
            <span className={styles.sBrand}>
              <i className={styles.sBrandDot} />
              Oakfield Joinery
            </span>
            <span className={styles.sLinks}>
              <span>Home</span>
              <span>Work</span>
              <span>Contact</span>
            </span>
            <span className={styles.sCta}>Get a quote</span>
          </div>

          <div className={styles.sHero}>
            <div className={styles.sCopy + on(2)}>
              <span className={styles.sH}>
                Bespoke joinery,
                <br />
                <em>built to last.</em>
              </span>
              <span className={styles.sSub} />
              <span className={styles.sBtn}>Request a quote</span>
            </div>
            <div className={styles.sMedia + on(2)}>
              <i className={styles.sOrb} />
              <span className={styles.sMediaTag}>Oak wardrobe</span>
            </div>
          </div>

          <div className={styles.sTiles + on(3)}>
            {[
              ['Kitchens', 'Design & fit'],
              ['Wardrobes', 'Made to measure'],
              ['Staircases', 'Oak & ash'],
            ].map(([t, sub]) => (
              <span key={t} className={styles.sTile}>
                <span className={styles.sTileName}>{t}</span>
                <span className={styles.sTileSub}>{sub}</span>
              </span>
            ))}
          </div>
        </div>

        {/* —— deliverables ticker (labelled marquee) ——————— */}
        <div className={styles.foot}>
          <span className={styles.footTag}>
            <i className={styles.footDot} />
            Every package
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
          ONE package £599 buys — "All-inclusive from £599 / Three
          packages" read as though £599 covered all three (user
          2026-08-04). £599 is exactly the Starter price, so no "from". */}
      <div className={live ? `${styles.stamp} ${styles.stampLive}` : styles.stamp}>
        <span className={styles.stampLabel}>All-inclusive</span>
        <span className={styles.stampValue}>£599</span>
        <span className={styles.stampFoot}>Starter pack</span>
      </div>
    </div>
  )
}
