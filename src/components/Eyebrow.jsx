import styles from './Eyebrow.module.css'

export default function Eyebrow({ children, glyph = '//', tone = 'default', className = '' }) {
  return (
    <span className={`${styles.eyebrow} ${styles[tone] || ''} ${className}`}>
      <span className={styles.glyph} aria-hidden="true">{glyph}</span>
      {children}
    </span>
  )
}
