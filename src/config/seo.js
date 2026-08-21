/* Per-route SEO metadata (2026-08-13).

   ONE source of truth for every <title>, meta description and canonical
   URL on the site. `components/TitleManager.jsx` reads this on every
   route change and writes the tags into <head>; `index.html` carries the
   HOME entry verbatim as the static fallback that non-rendering crawlers
   and social unfurlers see (Firebase rewrites every path to that file).

   Naming: the brand is "Tekniik", the studio is "Tekniik AI Studio", and
   the site has to rank for BOTH (user 2026-08-13). So every title ends in
   the full studio name and every description names it once in a sentence
   that reads normally. Do not stuff it in twice.

   Market: the UK is primary, Europe second, the US third (user
   2026-08-13). That shows up here as the MARKET SERVED ("businesses
   across the UK, Europe and the US"), never as a claim about where the
   studio itself sits — the footer geography rule still bans "UK team",
   "based in", "Agency UK" and any address. The same targeting also rides
   `lang="en-GB"`, `og:locale`, and `areaServed` in index.html's JSON-LD.

   Rules that apply here like anywhere else:
   - NO em dashes in shipped copy (user rule) — these strings ship.
   - Descriptions stay under ~158 characters so Google shows them whole.
   - British spelling, to match en-GB.

   /website-plans carries a PRICE, so its strings are built from the
   detected currency (`config/pricing.js`) rather than sitting in the map. */

export const ORIGIN = 'https://tekniik.ai'

export const SITE_NAME = 'Tekniik AI Studio'

export const HOME = {
  title: 'Tekniik AI Studio | Web, Mobile App & AI Development Agency',
  /* must stay byte-identical to the description in index.html */
  description:
    'Tekniik AI Studio builds websites, web apps, mobile apps and AI systems for businesses across the UK, Europe and the US. 50+ projects delivered.',
}

/* Each entry: `title` is the page half (the studio name is appended),
   `description` is the full sentence. Every valid dynamic route
   (/services/:slug, /case/:slug) is enumerated, so an unmapped path is
   exactly the NotFound case and gets noindex. */
const PAGES = {
  '/services': {
    title: 'Services',
    description:
      'Custom software, web platforms, mobile apps and AI systems for businesses across the UK and Europe, engineered around the way your business works.',
  },
  '/services/custom-software': {
    title: 'Custom Software Development',
    description:
      'Customer portals, SaaS platforms, dashboards and internal business tools, engineered around your workflows by the senior team at Tekniik AI Studio.',
  },
  '/services/web-platforms': {
    title: 'Web Platform & Website Development',
    description:
      'High performance websites and e-commerce platforms for UK and European businesses. Custom designed, SEO optimised, mobile first, and built to convert.',
  },
  '/services/mobile-apps': {
    title: 'Mobile App Development',
    description:
      'iOS and Android app development from Tekniik AI Studio, designed around real user behaviour. From consumer products to internal business tools.',
  },
  '/services/ai-systems': {
    title: 'AI Development & Integration',
    description:
      'AI development and integration from Tekniik AI Studio: intelligent automation, predictive analytics and machine learning where it delivers measurable ROI.',
  },
  '/about': {
    title: 'About Us',
    description:
      'Tekniik AI Studio is a small, senior team of engineers and designers who work directly with every client. How we work, and why that makes the difference.',
  },
  '/contact': {
    title: 'Contact',
    description:
      'Get in touch with Tekniik AI Studio. Tell us about your project and we will reply within one working day with a real, personal response.',
  },
  '/work': {
    title: 'Our Work',
    description:
      'Selected projects from Tekniik AI Studio: custom software, web platforms, mobile apps and AI systems for clients in the UK, Europe and further afield.',
  },
  '/support': {
    title: 'Software Support & Maintenance',
    description:
      'Ongoing support, maintenance and improvement for your software from Tekniik AI Studio. Whether we built it or not, we will keep it running properly.',
  },
  '/case/looqz': {
    title: 'Glow & Co Case Study',
    description:
      'How Tekniik AI Studio designed and built Glow & Co, a booking marketplace connecting customers with verified beauty and wellness professionals.',
  },
  '/case/autoscreen': {
    title: 'SafeGlass SA Case Study',
    description:
      'How Tekniik AI Studio built SafeGlass SA, an on demand auto glass platform that dispatches verified fitters to vehicle owners across South Africa.',
  },
  '/case/famili': {
    title: 'Heritage Tree Case Study',
    description:
      'How Tekniik AI Studio built Heritage Tree, a living family archive for preserving lineage, heritage and the stories that connect generations.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy',
    description:
      'How Tekniik AI Studio handles your personal data, and your privacy rights under UK and EU GDPR.',
  },
  '/terms-of-service': {
    title: 'Terms of Service',
    description: 'The terms governing the use of the Tekniik AI Studio website and its services.',
  },
  '/cookie-policy': {
    title: 'Cookie Policy',
    description:
      'How Tekniik AI Studio uses cookies and similar technologies, and how to manage your preferences.',
  },
  '/gdpr': {
    title: 'GDPR Compliance',
    description:
      'Our commitment to data protection under UK GDPR, EU GDPR and India’s DPDP Act at Tekniik AI Studio.',
  },
}

/* Every indexable URL, in the order a crawler should meet them.
   `scripts/generateSitemap.js` builds public/sitemap.xml from this list,
   so adding a route here is the only step a new page needs. */
export const ROUTES = ['/', ...Object.keys(PAGES), '/website-plans']

export function canonicalFor(pathname) {
  return pathname === '/' ? `${ORIGIN}/` : ORIGIN + pathname
}

/* `money` is the `moneyFor(currency)` object; only /website-plans uses it.
   Returns everything <head> needs for a route. */
export default function seoFor(pathname, money) {
  const key = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  if (key === '/') {
    return { ...HOME, canonical: canonicalFor('/'), noindex: false }
  }

  if (key === '/website-plans') {
    return {
      title: `${money.title} | ${SITE_NAME}`,
      description: money.description,
      canonical: canonicalFor(key),
      noindex: false,
    }
  }

  const page = PAGES[key]
  if (!page) {
    return {
      title: `Page Not Found | ${SITE_NAME}`,
      description: HOME.description,
      canonical: canonicalFor(key),
      noindex: true,
    }
  }

  return {
    title: `${page.title} | ${SITE_NAME}`,
    description: page.description,
    canonical: canonicalFor(key),
    noindex: false,
  }
}
