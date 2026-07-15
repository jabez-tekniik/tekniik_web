import Button from './Button.jsx'
import Reveal from './Reveal.jsx'
import styles from './MiniCta.module.css'

/* Slim interstitial CTA strip between sections — a single ledger row:
   teal node + mono kicker, one Satoshi statement, primary button right.
   Deliberately quiet (hairlines + accent tint) so it breaks the scroll
   without competing with the FinalCta crescendo. Copy: MINI_CTAS. */
export default function MiniCta({ kicker, line, cta, to = '/contact' }) {
  return (
    <aside className={styles.strip}>
      <Reveal className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <span className={styles.kicker}>
            <span className={styles.node} aria-hidden="true" />
            {kicker}
          </span>
          <p className={styles.line}>{line}</p>
        </div>
        <Button to={to} variant="primary" arrow>
          {cta}
        </Button>
      </Reveal>
    </aside>
  )
}
