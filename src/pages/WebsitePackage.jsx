import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import FadeIn from '../motion/ink/FadeIn.jsx'
import { useScrollProgressInk } from '../motion/ink/index.js'
import { getLenis } from '../motion/SmoothScroll.jsx'
import { StarredText } from '../components/Icon.jsx'
import styles from './WebsitePackage.module.css'

/* Website Package — standalone conversion landing page (/website-package).
   NOT linked from the main site's nav/footer — promoted through paid ads and
   social only; simpler register for small-business buyers, same Deep Ink
   system. Copy verbatim from content/tekniik-website-package-spec.md (locked).
   Devices reused: node + mono meta bar, NN / EYEBROW section heads, numbered
   specRow ledgers (ServiceDetail/CaseStudy), statement cells (About
   principles), brand-navy process band with scroll-lit rails (About process),
   hairline <details> FAQ rows, FinalCta crescendo. */

const PAGE = {
  hero: {
    eyebrow: 'Website Package',
    headline: 'A professional website for your business.',
    headlineAccent: 'From £599.',
    sub: 'A professionally designed, mobile-ready website with hosting, domain, email, and everything you need to get found online. One fixed price. No surprises.',
    cta: 'Get Started',
    trust: 'Designed and built by Tekniik · 50+ projects delivered · 4.9★ rating',
    priceLabel: 'Fixed price',
    price: '£599',
    vat: '+ VAT',
  },
  included: {
    eyebrow: "/ What's included",
    heading: 'Everything you need. One price.',
    price: '£599',
    vat: '+ VAT',
    groups: [
      {
        heading: 'Your website',
        items: [
          'Professionally designed, mobile-responsive website',
          'Up to 5 pages (Home, About, Services, Gallery/Testimonials, Contact)',
          'Contact form',
          'Google Maps and social media links',
          'Two revision rounds',
        ],
      },
      {
        heading: 'Your domain & hosting',
        items: [
          'One .co.uk or .uk domain for 1 year',
          'Managed website hosting for 1 year',
          'Free SSL certificate (the padlock in the browser)',
          'Daily or scheduled backups',
        ],
      },
      {
        heading: 'Your email',
        items: [
          'Up to 5 business email inboxes (you@yourbusiness.co.uk)',
          '10GB storage per mailbox',
        ],
      },
      {
        heading: 'Your visibility',
        items: ['Basic on-page SEO', 'Google Analytics and Search Console setup'],
      },
      {
        heading: 'Your peace of mind',
        items: ['30 days of post-launch technical support'],
      },
    ],
  },
  audience: {
    eyebrow: '/ Who this is for',
    heading: 'Perfect for businesses that need to get online — fast.',
    items: [
      'Local businesses launching their first website',
      'Businesses replacing an outdated or broken site',
      'Freelancers and sole traders who need a professional presence',
      'Anyone who wants to stop losing customers to competitors who have a website',
    ],
  },
  steps: {
    eyebrow: '/ How it works',
    heading: "Three steps. That's it.",
    items: [
      {
        title: 'Tell us about your business',
        body: 'Fill in a short brief. What you do, who your customers are, and what you want your website to say.',
      },
      {
        title: 'We design and build it',
        body: 'We create your website, set up your domain, hosting, and email. You review it and request up to two rounds of changes.',
      },
      {
        title: 'You go live',
        body: "We launch your site, connect your analytics, and hand everything over. You're online.",
      },
    ],
  },
  faq: {
    eyebrow: '/ Common questions',
    heading: "Questions? We've got answers.",
    items: [
      {
        q: 'Do I need to provide content?',
        a: "We'll guide you on what's needed. If you have text and photos ready, great. If not, we can help you put it together.",
      },
      {
        q: 'Can I add more pages later?',
        a: 'Absolutely. The package covers 5 pages, but we can add more at any time for an additional cost.',
      },
      {
        q: 'What happens after the first year?',
        a: "Domain renewal and hosting continue at standard rates (typically £80-120/year). We'll remind you before anything renews.",
      },
      {
        q: 'Can I update the website myself?',
        a: 'Yes. We build on platforms that let you make simple text and image updates yourself.',
      },
      {
        q: 'What if I need something more complex?',
        a: "If you need custom functionality, a booking system, e-commerce, or a web application — we do that too. We'll recommend the right solution for your needs.",
      },
      {
        q: 'How long does it take?',
        a: 'Typically 2-3 weeks from receiving your brief to going live.',
      },
    ],
  },
  cta: {
    heading: 'Ready to get your business online?',
    sub: '£599 + VAT. No hidden costs. No ongoing commitments.',
    cta: 'Get Started',
    emailNote: 'Have questions? Email us at',
    email: 'hello@tekniik.ai',
  },
}

/* "Get Started" jumps to the conversion block lower on the page (per spec).
   Lenis owns the scroll when active, so route through it — mirrors the
   homepage Hero's scrollToWork; reduced motion jumps instantly. */
function scrollToCta(e) {
  const el = document.getElementById('get-started')
  if (!el) return
  e.preventDefault()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = getLenis()
  if (lenis && !reduced) lenis.scrollTo(el, { offset: -88 })
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

function IconPlus() {
  return (
    <svg
      className={styles.faqIcon}
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 3.5v9M3.5 8h9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function WebsitePackage() {
  const { hero, included, audience, steps, faq, cta } = PAGE
  const total = steps.items.length

  // the site's rail mechanic: each step's top hairline fills teal in
  // sequence as the band scrolls in (hook fires once with p=1 under RM)
  const stepsRef = useScrollProgressInk((p, grid) => {
    grid.querySelectorAll('[data-rail]').forEach((rail, i) => {
      const local = Math.min(1, Math.max(0, p * total - i))
      rail.firstElementChild.style.transform = `scaleX(${local})`
      rail.classList.toggle(styles.lit, local > 0.02)
    })
  })

  return (
    <>
      {/* —— 01 · Hero: value prop left, fixed-price stat card right ——— */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Reveal className={styles.metaBar}>
            <span className={styles.eyebrow}>
              <span className={styles.node} aria-hidden="true" />
              {hero.eyebrow}
            </span>
            <span className={styles.metaRight}>
              {hero.price} {hero.vat}
            </span>
          </Reveal>

          <div className={styles.heroSplit}>
            <div>
              <FadeIn as="h1" className={styles.headline}>
                {hero.headline}{' '}
                <span className={styles.headlineAccent}>{hero.headlineAccent}</span>
              </FadeIn>
              <Reveal delay={240}>
                <p className={styles.sub}>{hero.sub}</p>
              </Reveal>
              <Reveal className={styles.actions} delay={340}>
                <Button href="#get-started" onClick={scrollToCta} variant="primary" arrow>
                  {hero.cta}
                </Button>
              </Reveal>
            </div>

            {/* mono-labelled price stat — the ink ledger treatment, not a badge */}
            <Reveal className={styles.heroVisual} delay={160}>
              <div className={styles.priceCard}>
                <span className={styles.priceKicker}>
                  <span className={styles.node} aria-hidden="true" />
                  {hero.priceLabel}
                </span>
                <p className={styles.priceFigure}>
                  <span className={styles.priceValue}>{hero.price}</span>
                  <span className={styles.priceVat}>{hero.vat}</span>
                </p>
                <p className={styles.priceFoot}>
                  <StarredText text={hero.trust} />
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* —— 02 · What's included — grouped spec ledgers ——————— */}
      <section className={`${styles.section} ${styles.sectionTint}`}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>01</span>
            <span className={styles.secEyebrow}>{included.eyebrow}</span>
          </Reveal>

          <Reveal className={styles.inclHead} delay={80}>
            <h2 className={styles.sectionHeading}>{included.heading}</h2>
            <p className={styles.inclPrice}>
              <span className={styles.inclPriceNum}>{included.price}</span>
              <span className={styles.inclPriceVat}>{included.vat}</span>
            </p>
          </Reveal>

          {included.groups.map((group) => (
            <div key={group.heading} className={styles.group}>
              <Reveal as="h3" className={styles.groupHead}>
                {group.heading}
              </Reveal>
              <ul className={styles.specs}>
                {group.items.map((item, i) => (
                  <Reveal as="li" key={item} delay={60 + i * 50} className={styles.specRow}>
                    <span className={styles.specNum} aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.specText}>{item}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* —— 03 · Who this is for — statement cells ————————— */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>02</span>
            <span className={styles.secEyebrow}>{audience.eyebrow}</span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className={`${styles.sectionHeading} ${styles.audHeading}`}>
              {audience.heading}
            </h2>
          </Reveal>

          <div className={styles.audGrid}>
            {audience.items.map((item, i) => (
              <Reveal key={item} delay={i * 80} className={styles.audCell}>
                <span className={styles.audNum}>0{i + 1}</span>
                <p className={styles.audText}>{item}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* —— 04 · How it works — navy band, three scroll-lit steps —— */}
      <section className={styles.process}>
        <div className="container">
          <Reveal className={styles.processHead}>
            <div className={styles.secHead}>
              <span className={styles.secIndex}>03</span>
              <span className={styles.secEyebrow}>{steps.eyebrow}</span>
            </div>
            <h2 className={styles.sectionHeading}>{steps.heading}</h2>
          </Reveal>

          <ol ref={stepsRef} className={styles.steps}>
            {steps.items.map((s, i) => (
              <li key={s.title} className={styles.step}>
                <span className={styles.rail} data-rail="" aria-hidden="true">
                  <span className={styles.railFill} />
                  <span className={styles.railNode} />
                </span>

                <Reveal delay={i * 90} className={styles.stepBody}>
                  <span className={styles.stepLabel}>Step 0{i + 1}</span>
                  <span className={styles.ghost} aria-hidden="true">
                    0{i + 1}
                  </span>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepDesc}>{s.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* —— 05 · Common questions — hairline FAQ rows ——————— */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>04</span>
            <span className={styles.secEyebrow}>{faq.eyebrow}</span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className={styles.sectionHeading}>{faq.heading}</h2>
          </Reveal>

          <div className={styles.faq}>
            {faq.items.map((item, i) => (
              <Reveal as="details" key={item.q} delay={i * 60} className={styles.faqItem}>
                <summary className={styles.faqQ}>
                  <span className={styles.faqQText}>{item.q}</span>
                  <IconPlus />
                </summary>
                <div className={styles.faqA}>
                  <p>{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* —— 06 · CTA — the conversion block the hero CTA jumps to —— */}
      <div id="get-started">
        <FinalCta
          heading={cta.heading}
          sub={cta.sub}
          ctaLabel={cta.cta}
          emailNote={cta.emailNote}
          email={cta.email}
        />
      </div>
    </>
  )
}
