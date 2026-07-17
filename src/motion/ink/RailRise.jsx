import { useInViewOnce, createTimeline, utils, EASE_OUT } from './index.js'

/* Whole-line rise + drawn hero rail — the service-detail hero entrance,
   shared by the four sibling sub-pages (one template; the no-repeat rule
   applies between top-level pages). Distinct from the taken set: no
   per-word stagger (WordRise), no clip wipe (LineWipe), no mask (MaskRise),
   no blur (BlurRise). The line rises 14px and fades in, then the site's
   rail device is promoted into the hero: a hairline rule under the headline
   gets a teal segment drawn in (scaleX) while its node ignites.
   Follows the WordRise contract (text/as/className/delay). Under reduced
   motion useInViewOnce no-ops — everything renders static and complete. */
export default function RailRise({
  text,
  as: Tag = 'span',
  delay = 0,
  className = '',
  ...rest
}) {
  const ref = useInViewOnce(
    (el) => {
      const line = el.querySelector('[data-rr-line]')
      const fill = el.querySelector('[data-rr-fill]')
      const node = el.querySelector('[data-rr-node]')
      return {
        init() {
          utils.set(line, { translateY: 14, opacity: 0 })
          utils.set(fill, { scaleX: 0 })
          utils.set(node, { scale: 0.4, opacity: 0 })
        },
        play() {
          const tl = createTimeline({ defaults: { ease: EASE_OUT } })
          tl.add(line, { translateY: 0, opacity: 1, duration: 760 }, delay)
          tl.add(node, { scale: 1, opacity: 1, duration: 320 }, delay + 300)
          tl.add(fill, { scaleX: 1, duration: 620 }, delay + 320)
        },
      }
    },
    { threshold: 0.35 },
  )

  return (
    <Tag ref={ref} className={className} {...rest}>
      <span data-rr-line style={{ display: 'block', willChange: 'transform' }}>
        {text}
      </span>
      <span
        aria-hidden="true"
        style={{
          position: 'relative',
          display: 'block',
          height: 2,
          marginTop: 'clamp(18px, 2.4vw, 28px)',
          background: 'var(--hairline)',
        }}
      >
        <span
          data-rr-fill
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 'clamp(72px, 14%, 140px)',
            background: 'var(--accent)',
            transformOrigin: 'left center',
            willChange: 'transform',
          }}
        />
        <span
          data-rr-node
          style={{
            position: 'absolute',
            left: -1,
            top: '50%',
            width: 8,
            height: 8,
            marginTop: -4,
            borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 12px var(--accent-bloom)',
          }}
        />
      </span>
    </Tag>
  )
}
