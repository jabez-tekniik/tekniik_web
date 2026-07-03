import styles from './GradientHeadline.module.css'

/**
 * Renders the hero headline with a gradient ink fill on the second half.
 * Pass plainPrefix and gradientSuffix as the two halves of the sentence.
 * Animates word-by-word with a vertical-mask rise; a visually-hidden span
 * exposes the full sentence to screen readers so per-word splitting doesn't
 * fragment SR reading.
 */
export default function GradientHeadline({ plainPrefix, gradientSuffix }) {
  const plainWords = plainPrefix.trim().split(/\s+/)
  const gradientWords = gradientSuffix.trim().split(/\s+/)
  const allWords = [...plainWords, ...gradientWords]

  return (
    <h1 className={styles.headline}>
      <span className={styles.sr}>{`${plainPrefix} ${gradientSuffix}`}</span>
      <span aria-hidden="true" className={styles.visual}>
        {allWords.map((word, i) => {
          const isGradient = i >= plainWords.length
          return (
            <span
              key={i}
              className={`${styles.word} ${isGradient ? styles.ink : ''}`}
              style={{ '--i': i }}
            >
              <span className={styles.inner}>{word}</span>
            </span>
          )
        })}
      </span>
    </h1>
  )
}
