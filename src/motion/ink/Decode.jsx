import { Fragment } from 'react'
import { useInViewOnce } from './index.js'

/* Decode reveal — characters flicker through teal glyphs and lock in
   left→right, a transmission resolving into copy. Layout never shifts:
   the real glyph reserves its slot at opacity 0 while an absolutely
   positioned overlay does the scrambling. Static under reduced motion
   (init/play never run, so the plain text just renders). */

const GLYPHS = '#/+<>*=0123456789ABCDEFGHKLNPRSTUVXYZ'

export default function Decode({
  text,
  as: Tag = 'span',
  charMs = 34,
  holdMs = 240,
  delay = 0,
  className = '',
  ...rest
}) {
  const ref = useInViewOnce(
    (el) => {
      const slots = Array.from(el.querySelectorAll('[data-slot]'))
      let raf = 0
      let cancelled = false
      return {
        init() {
          slots.forEach((s) => {
            s.firstElementChild.style.opacity = '0'
          })
        },
        play() {
          const t0 = performance.now() + delay
          let frame = 0
          const tick = (now) => {
            if (cancelled) return
            const t = now - t0
            frame += 1
            let pending = false
            slots.forEach((slot, i) => {
              const fin = slot.firstElementChild
              if (fin.style.opacity === '1') return
              const scr = slot.lastElementChild
              if (t >= holdMs + i * charMs) {
                fin.style.opacity = '1'
                scr.textContent = ''
              } else {
                pending = true
                /* reroll every 3rd frame — full-rate flicker reads as noise */
                if (t > 0 && frame % 3 === 0) {
                  scr.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                }
              }
            })
            if (pending) raf = requestAnimationFrame(tick)
          }
          raf = requestAnimationFrame(tick)
        },
        cleanup() {
          cancelled = true
          cancelAnimationFrame(raf)
        },
      }
    },
    { threshold: 0.5 },
  )

  const words = text.split(' ')
  return (
    <Tag ref={ref} className={className} aria-label={text} {...rest}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {/* inline-block word units keep line wrapping at word level */}
          <span aria-hidden="true" style={{ display: 'inline-block' }}>
            {word.split('').map((c, ci) => (
              <span
                key={ci}
                data-slot=""
                style={{ position: 'relative', display: 'inline-block' }}
              >
                <span>{c}</span>
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    textAlign: 'center',
                    color: 'var(--accent)',
                    opacity: 0.7,
                  }}
                />
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  )
}
