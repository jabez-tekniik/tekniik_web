import { useInViewOnce, animate, utils, EASE_OUT } from './index.js'

/* Whole-line masked rise — the quiet editorial entrance (About hero).
   The full line slides up out of an overflow-hidden clip box; no per-word
   choreography, just one confident settle. Padding/negative-margin pairs
   give the clip box breathing room for ascenders/descenders without
   changing layout. Under reduced motion the text renders fully static
   (useInViewOnce no-ops). */
export default function MaskRise({
  text,
  as: Tag = 'span',
  delay = 0,
  duration = 900,
  className = '',
  ...rest
}) {
  const ref = useInViewOnce(
    (el) => {
      const inner = el.firstElementChild
      return {
        init() {
          utils.set(inner, { translateY: '112%' })
        },
        play() {
          animate(inner, { translateY: '0%', duration, delay, ease: EASE_OUT })
        },
      }
    },
    { threshold: 0.5 },
  )

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        display: 'block',
        overflow: 'hidden',
        padding: '0.08em 0.1em 0.14em',
        margin: '-0.08em -0.1em -0.14em',
      }}
      {...rest}
    >
      <span style={{ display: 'block', willChange: 'transform' }}>{text}</span>
    </Tag>
  )
}
