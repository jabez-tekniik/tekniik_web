import useReveal from '../hooks/useReveal.js'
import styles from './Reveal.module.css'

export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  stagger = false,
  className = '',
  children,
  ...rest
}) {
  const [ref, visible] = useReveal()
  const cls = [
    styles.reveal,
    stagger ? styles.stagger : '',
    visible ? styles.visible : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <Tag
      ref={ref}
      className={cls}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
