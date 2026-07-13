import Reveal from '../components/Reveal.jsx'
import WordRise from '../motion/ink/WordRise.jsx'
import { TESTIMONIAL } from '../data/content.js'
import styles from './Testimonial.module.css'

/* "The word" — asymmetric editorial spread: a left rail carrying an
   oversized teal quote glyph + attribution, the quote itself set huge
   on the right. One vertical hairline divides them; nothing is boxed. */
export default function Testimonial() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.spread}>
          <Reveal className={styles.rail}>
            <span className={styles.glyph} aria-hidden="true">
              &ldquo;
            </span>
            <div className={styles.attr}>
              <strong className={styles.name}>{TESTIMONIAL.name}</strong>
              <span className={styles.role}>{TESTIMONIAL.role}</span>
            </div>
          </Reveal>

          <WordRise
            text={TESTIMONIAL.text}
            as="blockquote"
            staggerMs={30}
            className={styles.quote}
          />
        </div>
      </div>
    </section>
  )
}
