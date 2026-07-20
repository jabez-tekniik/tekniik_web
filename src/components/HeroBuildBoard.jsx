import { useState } from 'react'
import { useInViewOnce, createTimeline, utils, EASE_OUT } from '../motion/ink/index.js'
import useReducedMotion from '../hooks/useReducedMotion.js'
import {
  IconBulb,
  IconPen,
  IconCode,
  IconFlask,
  IconDeploy,
  IconCard,
  IconGrid,
} from './Icon.jsx'
import styles from './HeroBuildBoard.module.css'

/* About hero visual — "the build board". A quiet studio console that sells
   the page's claim (small senior team, always shipping): the sprint rows
   land once on scroll-in, then the ledger runs forever — each task in turn
   flips Queued → Building (its progress bar draws) → Shipped (the final
   Launch-review row reads Deployed instead), the finished
   sprint holds, everything resets, repeat (user: show each item loading
   and shipped, and repeat). Perpetual life beyond the ledger: live-dot
   ping, the footer's five-stage pipeline igniting in sequence, slow
   ambient float — no office names here: geography lives on the contact
   page only (user rule 2026-07-20). Decorative (aria-hidden).
   Under reduced motion the cycle never starts and the board renders the
   finished sprint: every row Shipped, statics only. */

/* the delivery pipeline (user: show the actual process, not an abstract
   glyph) — ideation → design → development → testing → ship. Glyphs chosen
   to stay crisp inside a 24px chip (the rocket was mush at this size). */
const STAGES = [
  { key: 'idea', Icon: IconBulb },
  { key: 'design', Icon: IconPen },
  { key: 'build', Icon: IconCode },
  { key: 'test', Icon: IconFlask },
  { key: 'ship', Icon: IconDeploy },
]

/* each row's chip carries a task-type glyph (2026-07-21 — the previous
   fake team-member initials read as meaningless letters, per user) */
const ROWS = [
  { key: 'design', Icon: IconPen, task: 'Design system' },
  { key: 'api', Icon: IconCode, task: 'API build' },
  { key: 'payments', Icon: IconCard, task: 'Payments flow' },
  { key: 'admin', Icon: IconGrid, task: 'Admin dashboard' },
  { key: 'qa', Icon: IconFlask, task: 'QA pass' },
  { key: 'launch', Icon: IconDeploy, task: 'Launch review' },
]

/* ledger clock: one row builds per STEP, the all-deployed sprint holds for
   HOLD, then the cycle resets. Slowed 1500→2600 (2026-07-21, user: moves
   too fast). The bar's bbLoad (1.9s) completes BEFORE the beat ends so the
   full bar settles for ~700ms before the row flips and the next one starts
   (user: going to the next line is too quick). */
const STEP = 2600
const HOLD = 3400
const START_DELAY = 1100

function Check() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path
        d="M1.5 5.2 4 7.5l4.5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function HeroBuildBoard() {
  const reduced = useReducedMotion()
  /* -1 = all queued (cycle start), 0..5 = that row in build (earlier rows
     shipped), 6 = whole sprint shipped (the hold beat). Under reduced
     motion the cycle never runs, so the board holds the finished sprint. */
  const [phase, setPhase] = useState(-1)
  /* whatever the cycle clock says, reduced motion always renders the
     finished sprint — derived, not synced, so no effect needed */
  const shown = reduced ? ROWS.length : phase

  const ref = useInViewOnce(
    (el) => {
      const rows = el.querySelectorAll('[data-row]')
      const foot = el.querySelector('[data-foot]')
      let tl
      let timer
      return {
        init() {
          utils.set([...rows, foot], { opacity: 0, translateY: 10 })
        },
        play() {
          tl = createTimeline({ defaults: { ease: EASE_OUT } })
          rows.forEach((row, i) => {
            tl.add(row, { opacity: 1, translateY: 0, duration: 500 }, 250 + i * 90)
          })
          tl.add(foot, { opacity: 1, translateY: 0, duration: 500 }, 900)
          const tick = (p) => {
            setPhase(p)
            const done = p === ROWS.length
            timer = setTimeout(() => tick(done ? 0 : p + 1), done ? HOLD : STEP)
          }
          timer = setTimeout(() => tick(0), START_DELAY)
        },
        cleanup() {
          clearTimeout(timer)
          if (tl) tl.pause()
        },
      }
    },
    { threshold: 0.35 },
  )

  return (
    <div ref={ref} className={styles.wrap} aria-hidden="true">
      <div className={styles.head}>
        <span className={styles.live} />
        <span className={styles.addr}>tekniik / build-board</span>
        <span className={styles.chip}>This week</span>
      </div>

      <div className={styles.body}>
        {ROWS.map((row, i) => {
          const status = i < shown ? 'shipped' : i === shown ? 'building' : 'queued'
          return (
            <div key={row.key} className={styles.row} data-row="">
              <span className={styles.who}>
                <row.Icon className={styles.whoIcon} />
              </span>
              <span className={styles.task}>{row.task}</span>

              {status === 'shipped' && (
                <span className={styles.stateShipped}>
                  {/* the sprint's last row (Launch review) deploys; the
                      rest ship (user) */}
                  <Check /> {i === ROWS.length - 1 ? 'Deployed' : 'Shipped'}
                </span>
              )}

              {status === 'building' && (
                <span className={styles.stateBuilding}>
                  Building
                  <span className={styles.progress}>
                    <span className={styles.progressFill} />
                  </span>
                </span>
              )}

              {status === 'queued' && <span className={styles.stateQueued}>Queued</span>}
            </div>
          )
        })}
      </div>

      <div className={styles.foot} data-foot="">
        <span className={styles.footTag}>
          <span className={styles.footDot} />
          One team
        </span>
        <span className={styles.link}>
          {/* teal line draws start→end; each station ignites as it's reached
              and stays lit; full pipeline holds, resets, repeats. Station
              keyframes are matched to nth-child order in the module css. */}
          <span className={styles.linkFill} />
          {STAGES.map(({ key, Icon }) => (
            <span key={key} className={styles.stage}>
              <Icon className={styles.stageIcon} />
            </span>
          ))}
        </span>
        <span className={styles.footTag}>
          Always shipping
          <span className={styles.footDot} />
        </span>
      </div>
    </div>
  )
}
