import { Fragment } from 'react'
import { m } from 'framer-motion'

const unitVariants = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { type: 'spring', stiffness: 140, damping: 20 } },
}

export default function KineticText({
  text,
  as = 'span',
  by = 'word',
  stagger = 0.06,
  className = '',
  ...rest
}) {
  const MTag = m[as]
  const units = by === 'char' ? Array.from(text) : text.split(' ')
  return (
    <MTag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: stagger }}
      {...rest}
    >
      {units.map((unit, i) => {
        // In char mode, render literal spaces as normal (non-clipped) whitespace —
        // a space inside the overflow:hidden clip box gets trimmed to zero width.
        if (by === 'char' && unit === ' ') {
          return (
            <span key={i} aria-hidden="true">
              {' '}
            </span>
          )
        }
        return (
          <Fragment key={i}>
            <span
              aria-hidden="true"
              style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
            >
              <m.span style={{ display: 'inline-block', willChange: 'transform' }} variants={unitVariants}>
                {unit}
              </m.span>
            </span>
            {/* Inter-word space lives OUTSIDE the clip box so it isn't trimmed. */}
            {by === 'word' && i < units.length - 1 ? ' ' : ''}
          </Fragment>
        )
      })}
    </MTag>
  )
}
