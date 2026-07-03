import { m } from 'framer-motion'

export default function Reveal({
  as = 'div',
  delay = 0,
  y = 24,
  once = true,
  className = '',
  children,
  ...rest
}) {
  const MTag = m[as]
  return (
    <MTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2, margin: '0px 0px -40px 0px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 20, delay }}
      {...rest}
    >
      {children}
    </MTag>
  )
}
