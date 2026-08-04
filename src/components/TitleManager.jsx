import { useEffect, useSyncExternalStore } from 'react'
import { useLocation } from 'react-router-dom'
import { getCurrency, subscribeCurrency } from '../config/currency.js'
import moneyFor from '../config/pricing.js'

/* Browser-tab titles per route (user 2026-08-03). Home keeps the
   index.html default; every other route renders "Page | Tekniik".
   All valid dynamic routes (/services/:slug, /case/:slug) are enumerated
   here, so an unmapped path is exactly the NotFound case.

   /website-plans carries a PRICE, so its title is built from the
   detected currency instead of sitting in the map (user 2026-08-04:
   the title follows the visitor's location like the rest of the page).
   This subscribes to the currency store but never calls
   `refineCurrencyFromIp` — only the package page itself may trigger a
   lookup, so visitors to every other route send nothing anywhere. */

const HOME_TITLE = 'Tekniik | Web, Mobile App & AI Development Agency'

const TITLES = {
  '/services': 'Services',
  '/services/custom-software': 'Custom Software Development',
  '/services/web-platforms': 'Web Platforms',
  '/services/mobile-apps': 'Mobile Apps',
  '/services/ai-systems': 'AI Systems',
  '/about': 'About Us',
  '/contact': 'Contact',
  '/case/looqz': 'Looqz Case Study',
  '/case/autoscreen': 'AutoScreen Case Study',
  '/case/famili': 'StoryNest Case Study',
  '/work': 'Our Work',
  '/support': 'Support & Maintenance',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
  '/cookie-policy': 'Cookie Policy',
  '/gdpr': 'GDPR',
}

export default function TitleManager() {
  const { pathname } = useLocation()
  const currency = useSyncExternalStore(subscribeCurrency, getCurrency, getCurrency)

  useEffect(() => {
    const key = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
    if (key === '/') {
      document.title = HOME_TITLE
      return
    }
    const page = key === '/website-plans' ? moneyFor(currency).title : TITLES[key]
    document.title = page ? `${page} | Tekniik` : 'Page Not Found | Tekniik'
  }, [pathname, currency])

  return null
}
