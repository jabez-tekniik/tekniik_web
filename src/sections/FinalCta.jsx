import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import WordRise from '../motion/ink/WordRise.jsx'
import { useMagneticInk } from '../motion/ink/index.js'
import styles from './FinalCta.module.css'

/* Giant brand-mark watermark — the two logo chevrons, faint on the navy
   band. Same paths as BrandLogo, scaled up as pure texture. */
function ChevronWatermark() {
  return (
    <svg
      className={styles.watermark}
      viewBox="236 288 612 504"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={styles.wmInk}
        d="M666.773,333.508l-175.323,363.24c-5.36,11.105-16.603,18.162-28.933,18.162H428.12L535.545,492.36
        c8.76-18.148-0.56-32.996-20.712-32.996H242.266l67.897-140.689c5.36-11.106,16.603-18.164,28.934-18.164h306.964
        C666.211,300.512,675.532,315.36,666.773,333.508z"
      />
      <path
        className={styles.wmTeal}
        d="M453.798,380.768c-15.283,0-29.218,8.748-35.866,22.513L236.35,779.488h137.602
        c14.087,0,26.931-8.062,33.055-20.749l99.702-206.547c3.837-7.949,11.885-13.001,20.712-13.001h219.66
        c12.298,0,23.511-7.039,28.857-18.115l67.712-140.308H453.798z"
      />
    </svg>
  )
}

/* "Crescendo" — full-bleed brand-navy closing stage. Left-anchored
   oversized heading over the chevron watermark; the action row sits
   under a hairline: sub left, CTA + email right. */
export default function FinalCta({
  heading,
  sub,
  ctaLabel = 'Get a Quote',
  ctaTo = '/contact',
  emailNote,
  email,
}) {
  const lines = Array.isArray(heading) ? heading : [heading]
  const magneticRef = useMagneticInk(0.3)

  return (
    <section className={styles.section}>
      <ChevronWatermark />

      <div className={`container ${styles.inner}`}>
        <h2 className={styles.heading}>
          {lines.map((line, i) => (
            <WordRise
              key={i}
              text={line}
              as="span"
              staggerMs={60}
              className={
                i === lines.length - 1
                  ? `${styles.line} ${styles.lineAccent}`
                  : styles.line
              }
            />
          ))}
        </h2>

        <Reveal className={styles.footerRow} delay={200}>
          {sub && <p className={styles.sub}>{sub}</p>}

          <div className={styles.actions}>
            <span ref={magneticRef} className={styles.magnetic}>
              <Button to={ctaTo} variant="inverse" arrow>
                {ctaLabel}
              </Button>
            </span>
            {email && (
              <p className={styles.email}>
                {emailNote && <span className={styles.emailNote}>{emailNote} </span>}
                <a className={styles.emailLink} href={`mailto:${email}`}>
                  <span className={styles.emailText}>{email}</span>
                </a>
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
