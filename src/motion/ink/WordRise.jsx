import { Fragment } from 'react'
import { useInViewOnce, createTimeline, stagger, utils, EASE_OUT } from './index.js'

/* anime.js word-mask reveal — the ink replacement for the old framer
   KineticText. Each word rises out of its own overflow-hidden clip box.
   Inter-word spaces live OUTSIDE the clip boxes so they aren't trimmed.
   Under reduced motion the text renders fully static (useInViewOnce no-ops). */
export default function WordRise({
  text,
  as: Tag = 'span',
  staggerMs = 45,
  duration = 750,
  className = '',
  ...rest
}) {
  const ref = useInViewOnce(
    (el) => {
      const words = el.querySelectorAll('[data-w]')
      return {
        init() {
          utils.set(words, { translateY: '110%' })
        },
        play() {
          createTimeline().add(
            words,
            { translateY: '0%', duration, ease: EASE_OUT, delay: stagger(staggerMs) },
            0,
          )
        },
      }
    },
    { threshold: 0.5 },
  )

  const units = text.split(' ')
  return (
    <Tag ref={ref} className={className} aria-label={text} {...rest}>
      {units.map((unit, i) => (
        <Fragment key={i}>
          <span
            aria-hidden="true"
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
          >
            <span data-w="" style={{ display: 'inline-block', willChange: 'transform' }}>
              {unit}
            </span>
          </span>
          {i < units.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  )
}
