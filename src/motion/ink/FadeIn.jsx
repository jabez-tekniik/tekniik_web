import { useInViewOnce, animate, utils, EASE_OUT } from './index.js'

/* The ONE entrance for everything except the home typewriter (user call,
   2026-07-20: the per-page effects — clip wipes, mask rises, blur rises,
   per-word staggers — read as unprofessional; heroes and section headings
   get a single quiet opacity fade instead). Follows the old WordRise
   contract (text/as/className/delay) so call sites swap 1:1. Under reduced
   motion useInViewOnce no-ops and the text renders fully static. */
export default function FadeIn({
  text,
  as: Tag = 'span',
  delay = 0,
  duration = 650,
  className = '',
  children,
  ...rest
}) {
  const ref = useInViewOnce(
    (el) => ({
      init() {
        utils.set(el, { opacity: 0 })
      },
      play() {
        animate(el, { opacity: 1, duration, delay, ease: EASE_OUT })
      },
    }),
    { threshold: 0.3 },
  )

  return (
    <Tag ref={ref} className={className} {...rest}>
      {text ?? children}
    </Tag>
  )
}
