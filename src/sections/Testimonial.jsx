import { KineticText, Reveal } from '../motion/index.js'
import { TESTIMONIAL } from '../data/content.js'
import styles from './Testimonial.module.css'

export default function Testimonial() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.wrap}>
          <svg
            className={styles.quoteMark}
            viewBox="0 0 80 60"
            aria-hidden="true"
          >
            <path
              d="M22 56c-10 0-18-8-18-19 0-22 16-32 32-37l4 8c-12 5-20 14-20 22 0-1 1-1 2-1 9 0 16 7 16 16s-7 11-16 11zm44 0c-10 0-18-8-18-19 0-22 16-32 32-37l4 8c-12 5-20 14-20 22 0-1 1-1 2-1 9 0 16 7 16 16s-7 11-16 11z"
              fill="var(--accent)"
              opacity="0.1"
            />
          </svg>
          <KineticText
            text={TESTIMONIAL.text}
            as="blockquote"
            by="word"
            stagger={0.04}
            className={styles.quote}
          />
          <Reveal delay={0.3}>
            <div className={styles.attribution}>
              <span className={styles.avatar} aria-hidden="true">
                {TESTIMONIAL.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              <div className={styles.attrText}>
                <strong>{TESTIMONIAL.name}</strong>
                <span>{TESTIMONIAL.role}</span>
              </div>
            </div>
          </Reveal>
        </Reveal>
      </div>
    </section>
  )
}
