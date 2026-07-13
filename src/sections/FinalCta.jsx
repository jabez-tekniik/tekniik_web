import { m } from 'framer-motion'
import Button from '../components/Button.jsx'
import { KineticText, Reveal, useMagnetic } from '../motion/index.js'
import styles from './FinalCta.module.css'

export default function FinalCta({
  heading,
  sub,
  ctaLabel = 'Get a Quote',
  ctaTo = '/contact',
  emailNote,
  email,
}) {
  const lines = Array.isArray(heading) ? heading : [heading]
  const { ref: magneticRef, style: magneticStyle, onMouseMove: magneticMove, onMouseLeave: magneticLeave } =
    useMagnetic({ strength: 0.35 })

  return (
    <section className={styles.section}>
      <div className={styles.bloom} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.wrap}>
          <h2 className={styles.heading}>
            {lines.map((line, i) => (
              <KineticText
                key={i}
                text={line}
                as="span"
                by="word"
                stagger={0.06}
                className={
                  i === lines.length - 1
                    ? `${styles.line} ${styles.lineAccent}`
                    : styles.line
                }
              />
            ))}
          </h2>

          {sub && (
            <Reveal as="p" delay={0.15} className={styles.sub}>
              {sub}
            </Reveal>
          )}

          <Reveal delay={0.25} className={styles.actions}>
            <m.span
              ref={magneticRef}
              style={magneticStyle}
              onMouseMove={magneticMove}
              onMouseLeave={magneticLeave}
              className={styles.magnetic}
            >
              <Button to={ctaTo} variant="primary" arrow>
                {ctaLabel}
              </Button>
            </m.span>
          </Reveal>

          {email && (
            <Reveal as="p" delay={0.35} className={styles.email}>
              {emailNote && <span className={styles.emailNote}>{emailNote} </span>}
              <a className={styles.emailLink} href={`mailto:${email}`}>
                <span className={styles.emailText}>{email}</span>
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
