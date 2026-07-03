import { useEffect, useRef, useState } from 'react'

const HAS_IO = typeof IntersectionObserver !== 'undefined'

export default function useReveal({ threshold = 0.12, rootMargin = '0px 0px -40px 0px', once = true } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(!HAS_IO)

  useEffect(() => {
    if (!HAS_IO) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) obs.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold, rootMargin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, visible]
}
