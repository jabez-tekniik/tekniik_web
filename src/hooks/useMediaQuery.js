import { useEffect, useState } from 'react'

/* Reactive media query (sibling of useReducedMotion). Used where a layout
   can't be expressed by CSS alone — e.g. /website-package renders the
   package comparison as a real <table> on desktop and as stacked tier
   cards on small screens, and duplicating both in the DOM would double
   the content for screen readers. */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  /* subscribe only — the initial state already read the query, and
     callers pass a constant string (a changing query would need a
     `key`, not a setState in the effect body) */
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
