import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import WordRise from '../motion/ink/WordRise.jsx'
import { useMagneticInk } from '../motion/ink/index.js'
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
  const magneticRef = useMagneticInk(0.3)

  return (
    <section className={styles.section}>
      <div className={styles.bloom} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.wrap}>
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

          {sub && (
            <Reveal as="p" delay={150} className={styles.sub}>
              {sub}
            </Reveal>
          )}

          <Reveal delay={250} className={styles.actions}>
            <span ref={magneticRef} className={styles.magnetic}>
              <Button to={ctaTo} variant="primary" arrow>
                {ctaLabel}
              </Button>
            </span>
          </Reveal>

          {email && (
            <Reveal as="p" delay={350} className={styles.email}>
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
