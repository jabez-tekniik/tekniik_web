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
          /* 125% (not 110%): the clip boxes carry 0.15em of descender padding,
             so a shallower offset would leave a sliver of the word visible */
          utils.set(words, { translateY: '125%' })
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
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'bottom',
              /* clip-box breathing room, pulled back with negative margins so
                 spacing is visually unchanged:
                 - below: at tight line-heights the 1em box cuts y/p/g tails
                 - sides: negative letter-spacing makes the advance width
                   narrower than the last glyph's ink, shaving its edge */
              padding: '0 0.1em 0.15em',
              margin: '0 -0.1em -0.15em',
            }}
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
