import styles from './HeroBadge.module.css'

export default function HeroBadge({ children, className = '' }) {
  return (
    <div className={`${styles.badge} ${className}`}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </div>
  )
}
