import { useInViewOnce, createTimeline, utils, EASE_OUT } from '../motion/ink/index.js'
import styles from './HeroThread.module.css'

/* Contact hero visual — "what working with us looks like". A message thread
   that loops through two exchanges (user: keep it repeating, show the issue
   addressed and resolved): the client's note lands, a typing indicator
   breathes, the reply arrives with the "First reply · 21 minutes" stamp;
   the thread then turns over — an issue comes in, the fix ships the same
   day, the resolved stamp settles. Hold, fade, repeat. The two phases are
   stacked in one grid cell so the card never changes height.
   Decorative (aria-hidden); hidden ≤960px via Contact's .heroVisual.
   Under reduced motion nothing plays and the static render is the SECOND
   exchange, resolved (phaseA is opacity-0 by default; the typing dots are
   opacity-0 by default so they never overlap a reply). */

function Tick() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
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

export default function HeroThread() {
  const ref = useInViewOnce(
    (el) => {
      const body = el.querySelector('[data-body]')
      const phaseA = el.querySelector('[data-phase-a]')
      const phaseB = el.querySelector('[data-phase-b]')
      const stepsA = phaseA.querySelectorAll('[data-step]')
      const stepsB = phaseB.querySelectorAll('[data-step]')
      const typingA = phaseA.querySelector('[data-typing]')
      const typingB = phaseB.querySelector('[data-typing]')
      let tl
      return {
        init() {
          utils.set(phaseA, { opacity: 1, translateY: 0 })
          utils.set(phaseB, { opacity: 0 })
          utils.set([...stepsA, ...stepsB], { opacity: 0, translateY: 10 })
        },
        play() {
          tl = createTimeline({ defaults: { ease: EASE_OUT }, loop: true })
            /* reset beats at t=0 — real (explicit-from) tweens, NOT .set():
               zero-duration sets only fire on the first pass, so every loop
               must wrap through these to start from a clean, empty thread */
            .add(body, { opacity: [0, 1], duration: 200 }, 0)
            .add(phaseA, { opacity: [0, 1], translateY: [0, 0], duration: 120 }, 0)
            .add(phaseB, { opacity: [1, 0], duration: 1 }, 0)
            .add([...stepsA, ...stepsB], { opacity: [0, 0], translateY: [10, 10], duration: 1 }, 0)
            /* — exchange one: the enquiry, the 21-minute reply — */
            .add(stepsA[0], { opacity: 1, translateY: 0, duration: 550 }, 300)
            .add(typingA, { opacity: [0, 1], duration: 220 }, 1000)
            .add(typingA, { opacity: 0, duration: 180 }, 2200)
            .add(stepsA[1], { opacity: 1, translateY: 0, duration: 550 }, 2340)
            .add(stepsA[2], { opacity: 1, translateY: 0, duration: 450 }, 3050)
            /* — the thread turns over — */
            .add(phaseA, { opacity: 0, translateY: -8, duration: 420 }, 4700)
            .add(phaseB, { opacity: [0, 1], duration: 60 }, 5150)
            /* — exchange two: issue in, fix out, resolved — */
            .add(stepsB[0], { opacity: 1, translateY: 0, duration: 550 }, 5250)
            .add(typingB, { opacity: [0, 1], duration: 220 }, 5950)
            .add(typingB, { opacity: 0, duration: 180 }, 7150)
            .add(stepsB[1], { opacity: 1, translateY: 0, duration: 550 }, 7290)
            .add(stepsB[2], { opacity: 1, translateY: 0, duration: 450 }, 8000)
            /* hold the resolved thread, then hand the card back to the loop */
            .add(body, { opacity: 0, duration: 500 }, 10800)
        },
        cleanup() {
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
        <span className={styles.addr}>hello@tekniik.ai</span>
        <span className={styles.chip}>Online</span>
      </div>

      <div className={styles.body} data-body="">
        <div className={styles.phases}>
          <div className={`${styles.phase} ${styles.phaseA}`} data-phase-a="">
            <div className={styles.rowIn} data-step="">
              <p className={styles.inMsg}>
                We&rsquo;re planning a web app for our ops team. Where do we start?
              </p>
              <span className={styles.time}>09:42</span>
            </div>

            <div className={styles.rowOut}>
              <span className={styles.typing} data-typing="">
                <span />
                <span />
                <span />
              </span>
              <div data-step="">
                <p className={styles.outMsg}>
                  Morning, good timing. Send over what you have and we&rsquo;ll map the
                  build on a 30-minute call.
                </p>
                <span className={`${styles.time} ${styles.timeOut}`}>10:03</span>
              </div>
            </div>

            <p className={styles.meta} data-step="">
              <span className={styles.metaTick}>
                <Tick />
              </span>
              First reply &middot; 21 minutes
            </p>
          </div>

          <div className={`${styles.phase} ${styles.phaseB}`} data-phase-b="">
            <div className={styles.rowIn} data-step="">
              <p className={styles.inMsg}>
                Launch week and we&rsquo;ve spotted a checkout bug on iPad. Can your team
                take a look?
              </p>
              <span className={styles.time}>11:38</span>
            </div>

            <div className={styles.rowOut}>
              <span className={styles.typing} data-typing="">
                <span />
                <span />
                <span />
              </span>
              <div data-step="">
                <p className={styles.outMsg}>
                  Found it. A payment-redirect edge case. Fix is live and checked on
                  every device.
                </p>
                <span className={`${styles.time} ${styles.timeOut}`}>12:02</span>
              </div>
            </div>

            <p className={styles.meta} data-step="">
              <span className={styles.metaTick}>
                <Tick />
              </span>
              Issue resolved &middot; same day
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
