import { Link } from 'react-router-dom'
import styles from './Button.module.css'

const variants = {
  primary: styles.primary,
  ghost: styles.ghost,
  text: styles.text,
}

export default function Button({
  variant = 'primary',
  to,
  href,
  onClick,
  type = 'button',
  arrow = false,
  className = '',
  children,
  ...rest
}) {
  const cls = `${styles.btn} ${variants[variant] || ''} ${className}`
  const inner = (
    <span className={styles.inner}>
      {children}
      {arrow && (
        <svg
          className={styles.arrow}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3.33 8h9.34M9.33 4l3.34 4-3.34 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  )

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} {...rest}>
        {inner}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {inner}
    </button>
  )
}
