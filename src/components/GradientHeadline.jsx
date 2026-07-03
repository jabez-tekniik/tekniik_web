import { m } from 'framer-motion'
import styles from './GradientHeadline.module.css'

// Same vertical-mask clip-reveal shape as ../motion/KineticText.jsx's
// unitVariants — reimplemented locally (rather than delegating to
// KineticText) so the gradient-ink class can stay on individual words.
const unitVariants = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { type: 'spring', stiffness: 140, damping: 20 } },
}

/**
 * Renders the hero headline with a gradient ink fill on the second half.
 * Pass plainPrefix and gradientSuffix as the two halves of the sentence.
 * Animates word-by-word with a vertical-mask rise (framer-motion, staggered
 * via whileInView); a visually-hidden span exposes the full sentence to
 * screen readers so per-word splitting doesn't fragment SR reading.
 */
export default function GradientHeadline({ plainPrefix, gradientSuffix }) {
  const plainWords = plainPrefix.trim().split(/\s+/)
  const gradientWords = gradientSuffix.trim().split(/\s+/)
  const allWords = [...plainWords, ...gradientWords]

  return (
    <h1 className={styles.headline}>
      <span className={styles.sr}>{`${plainPrefix} ${gradientSuffix}`}</span>
      <m.span
        aria-hidden="true"
        className={styles.visual}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ staggerChildren: 0.07, delayChildren: 0.14 }}
      >
        {allWords.map((word, i) => {
          const isGradient = i >= plainWords.length
          return (
            <span
              key={i}
              className={`${styles.word} ${isGradient ? styles.ink : ''}`}
            >
              <m.span className={styles.inner} variants={unitVariants}>
                {word}
              </m.span>
            </span>
          )
        })}
      </m.span>
    </h1>
  )
}
