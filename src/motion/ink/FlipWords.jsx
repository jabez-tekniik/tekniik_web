import { Fragment } from 'react'
import { useInViewOnce, createTimeline, stagger, utils, EASE_OUT } from './index.js'

/* Word flip-up — each word pivots up from flat (rotateX −90° at its own
   baseline) like nameplates snapping into a roster. Perspective sits on
   the line so words share one vanishing point. Static under reduced
   motion (init/play never run). */
export default function FlipWords({
  text,
  as: Tag = 'span',
  staggerMs = 80,
  duration = 700,
  delay = 0,
  className = '',
  ...rest
}) {
  const ref = useInViewOnce(
    (el) => {
      const words = el.querySelectorAll('[data-w]')
      return {
        init() {
          utils.set(words, {
            rotateX: -90,
            translateY: '0.18em',
            opacity: 0,
            transformOrigin: '50% 100%',
          })
        },
        play() {
          createTimeline().add(
            words,
            {
              rotateX: 0,
              translateY: '0em',
              opacity: 1,
              duration,
              ease: EASE_OUT,
              delay: stagger(staggerMs, { start: delay }),
            },
            0,
          )
        },
      }
    },
    { threshold: 0.5 },
  )

  const units = text.split(' ')
  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text}
      style={{ perspective: '640px' }}
      {...rest}
    >
      {units.map((unit, i) => (
        <Fragment key={i}>
          <span
            data-w=""
            aria-hidden="true"
            style={{
              display: 'inline-block',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          >
            {unit}
          </span>
          {i < units.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  )
}
