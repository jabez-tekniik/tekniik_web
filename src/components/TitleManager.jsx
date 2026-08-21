import { useEffect, useSyncExternalStore } from 'react'
import { useLocation } from 'react-router-dom'
import { getCurrency, subscribeCurrency } from '../config/currency.js'
import moneyFor from '../config/pricing.js'
import seoFor from '../config/seo.js'

/* The site's <head> manager (titles since 2026-08-03, full SEO metadata
   since 2026-08-13). On every route change it writes:
     - document.title
     - meta[name=description]
     - link[rel=canonical]
     - og:title / og:description / og:url
     - twitter:title / twitter:description
     - meta[name=robots], which goes noindex ONLY on NotFound
   Every string comes from `config/seo.js` — this file owns the DOM
   plumbing, that file owns the copy. Add a new route there, not here.

   index.html carries the HOME values statically, so the first paint and
   any crawler that does not run JS still gets valid metadata (Firebase
   rewrites every path to that one file). Googlebot renders JS and picks
   these up; a non-rendering unfurler (some chat apps) sees the home
   values on every route. Prerendering is the fix if that ever matters,
   and it is logged in ISSUES.md.

   /website-plans carries a PRICE, so its title AND description are built
   from the detected currency. This subscribes to the currency store but
   never calls `refineCurrencyFromIp` — only the package page itself may
   trigger a lookup, so visitors to every other route send nothing
   anywhere. */

/* find-or-create, so index.html only has to declare the tags it wants
   visible to non-rendering crawlers and we can still own the rest */
function setMeta(selector, attr, value, content) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function TitleManager() {
  const { pathname } = useLocation()
  const currency = useSyncExternalStore(subscribeCurrency, getCurrency, getCurrency)

  useEffect(() => {
    const { title, description, canonical, noindex } = seoFor(pathname, moneyFor(currency))

    document.title = title
    setMeta('meta[name="description"]', 'name', 'description', description)
    setLink('canonical', canonical)

    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical)

    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)

    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    )
  }, [pathname, currency])

  return null
}
