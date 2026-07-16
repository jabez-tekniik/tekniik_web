import { useInViewOnce, animate, utils, EASE_OUT } from './index.js'

/* Blur-fade rise — the softest entrance in the set (Contact hero).
   The line starts a touch low, transparent and defocused, then settles
   into sharpness — one movement, no per-word/per-char choreography.
   Under reduced motion the text renders fully static (useInViewOnce
   no-ops, so nothing is ever hidden). */
export default function BlurRise({
  text,
  as: Tag = 'span',
  delay = 0,
  duration = 950,
  className = '',
  ...rest
}) {
  const ref = useInViewOnce(
    (el) => ({
      init() {
        utils.set(el, { opacity: 0, translateY: 14, filter: 'blur(10px)' })
      },
      play() {
        animate(el, {
          opacity: 1,
          translateY: 0,
          filter: 'blur(0px)',
          duration,
          delay,
          ease: EASE_OUT,
        })
      },
    }),
    { threshold: 0.5 },
  )

  return (
    <Tag ref={ref} className={className} style={{ display: 'block', willChange: 'transform, filter' }} {...rest}>
      {text}
    </Tag>
  )
}
