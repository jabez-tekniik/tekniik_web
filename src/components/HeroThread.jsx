import { useInViewOnce, createTimeline, utils, EASE_OUT } from '../motion/ink/index.js'
import styles from './HeroThread.module.css'

/* Contact hero visual — "the first reply". A quiet message thread plays
   once when it scrolls into view: the client's note lands, a typing
   indicator breathes where the reply will sit, then Tekniik's answer
   crossfades in over it and the reply-time stamp settles below. Sells
   the page's promise (fast, direct, senior) instead of decorating it.
   Decorative (aria-hidden); hidden ≤960px via Contact's .heroVisual.
   Under reduced motion the thread renders complete and static — the
   typing dots are opacity:0 by default so they never overlap the reply. */
export default function HeroThread() {
  const ref = useInViewOnce(
    (el) => {
      const steps = el.querySelectorAll('[data-step]')
      const typing = el.querySelector('[data-typing]')
      let tl
      return {
        init() {
          utils.set(steps, { opacity: 0, translateY: 10 })
        },
        play() {
          tl = createTimeline({ defaults: { ease: EASE_OUT } })
            .add(steps[0], { opacity: 1, translateY: 0, duration: 550 }, 300)
            .add(typing, { opacity: 1, duration: 220 }, 1000)
            .add(typing, { opacity: 0, duration: 180 }, 2300)
            .add(steps[1], { opacity: 1, translateY: 0, duration: 550 }, 2440)
            .add(steps[2], { opacity: 1, translateY: 0, duration: 450 }, 3150)
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

      <div className={styles.body}>
        <div className={styles.rowIn} data-step="">
          <p className={styles.inMsg}>
            We&rsquo;re planning a web app for our ops team &mdash; where do we start?
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
              Morning &mdash; good timing. Send over what you have and we&rsquo;ll map the build
              on a 30-minute call.
            </p>
            <span className={`${styles.time} ${styles.timeOut}`}>10:03</span>
          </div>
        </div>

        <p className={styles.meta} data-step="">
          <span className={styles.metaTick}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M1.5 5.2 4 7.5l4.5-5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          First reply &middot; 21 minutes
        </p>
      </div>
    </div>
  )
}
