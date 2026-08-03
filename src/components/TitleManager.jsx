import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* Browser-tab titles per route (user 2026-08-03). Home keeps the
   index.html default; every other route renders "Page | Tekniik".
   All valid dynamic routes (/services/:slug, /case/:slug) are enumerated
   here, so an unmapped path is exactly the NotFound case. */

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
  '/website-package': 'Business Website Packages · From £599',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
  '/cookie-policy': 'Cookie Policy',
  '/gdpr': 'GDPR',
}

export default function TitleManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    const key = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
    if (key === '/') {
      document.title = HOME_TITLE
      return
    }
    const page = TITLES[key]
    document.title = page ? `${page} | Tekniik` : 'Page Not Found | Tekniik'
  }, [pathname])

  return null
}
