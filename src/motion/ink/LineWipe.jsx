import { useInViewOnce, createTimeline, EASE_INOUT } from './index.js'

/* Clip-wipe reveal — the line is uncovered left→right behind a thin teal
   printhead bar, like a plotter drawing a build sheet. One component per
   line; cascade lines with `delay`. Static under reduced motion (init/play
   never run, so the text renders plain and the bar stays at opacity 0). */
export default function LineWipe({
  text,
  as: Tag = 'span',
  delay = 0,
  duration = 820,
  className = '',
  ...rest
}) {
  const ref = useInViewOnce(
    (el) => {
      const clip = el.querySelector('[data-clip]')
      const edge = el.querySelector('[data-edge]')
      /* anime drives this proxy; inset() itself isn't interpolable as a
         single CSS value, so the wipe is applied in onUpdate */
      const state = { p: 100 }
      const apply = () => {
        /* negative block insets keep ascenders/descenders out of the clip */
        clip.style.clipPath = `inset(-0.25em ${state.p}% -0.25em -0.05em)`
      }
      return {
        init() {
          apply()
        },
        play() {
          const w = clip.getBoundingClientRect().width
          createTimeline({ defaults: { ease: EASE_INOUT } })
            .add(state, { p: 0, duration, onUpdate: apply }, delay)
            .add(edge, { opacity: 1, duration: 60 }, delay)
            .add(edge, { translateX: w, duration }, delay)
            .add(edge, { opacity: 0, duration: 180 }, delay + duration - 80)
        },
      }
    },
    { threshold: 0.5 },
  )

  return (
    <Tag ref={ref} className={className} style={{ position: 'relative' }} {...rest}>
      {/* inline-block so the clip box (and the bar's travel) hugs the text */}
      <span data-clip="" style={{ display: 'inline-block', maxWidth: '100%' }}>
        {text}
      </span>
      <span
        data-edge=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '0.08em',
          bottom: '0.08em',
          left: 0,
          width: '0.06em',
          background: 'var(--accent)',
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
    </Tag>
  )
}
