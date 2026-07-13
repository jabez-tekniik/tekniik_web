import { KineticText, Reveal } from '../motion/index.js'
import { TESTIMONIAL } from '../data/content.js'
import styles from './Testimonial.module.css'

const initials = TESTIMONIAL.name
  .split(' ')
  .map((n) => n[0])
  .join('')
  .slice(0, 2)

export default function Testimonial() {
  return (
    <section className={`section ${styles.section}`}>
      <div className={styles.spotlight} aria-hidden="true" />
      <div className="container">
        <div className={styles.wrap}>
          <span className={styles.quoteMark} aria-hidden="true">
            &ldquo;
          </span>
          <KineticText
            text={TESTIMONIAL.text}
            as="blockquote"
            by="word"
            stagger={0.045}
            className={styles.quote}
          />
          <Reveal delay={0.5} className={styles.attrWrap}>
            <span className={styles.attribution}>
              <span className={styles.avatar} aria-hidden="true">
                {initials}
              </span>
              <span className={styles.attrText}>
                <strong>{TESTIMONIAL.name}</strong>
                <span>{TESTIMONIAL.role}</span>
              </span>
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
