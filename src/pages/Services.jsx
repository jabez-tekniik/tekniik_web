import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Eyebrow from '../components/Eyebrow.jsx'
import {
  IconCheck,
  IconWeb,
  IconApp,
  IconMobile,
  IconAi,
} from '../components/Icon.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import { SERVICES_PAGE } from '../data/content.js'
import styles from './Services.module.css'

const META = {
  websites: {
    img: { src: '/img/services/websites.webp', alt: 'Marketing website rendered on a laptop with hero, feature cards, and testimonials' },
    Icon: IconWeb,
    hue: 'indigo',
    badge: 'Marketing site',
  },
  apps: {
    img: { src: '/img/services/apps.webp', alt: 'SaaS dashboard with analytics chart, data table, and floating activity feed' },
    Icon: IconApp,
    hue: 'violet',
    badge: 'Web platform',
  },
  mobile: {
    img: { src: '/img/services/mobile.webp', alt: 'Two iOS-style mobile screens showing a dashboard and a detail view' },
    Icon: IconMobile,
    hue: 'pink',
    badge: 'iOS · Android',
  },
  ai: {
    img: { src: '/img/services/ai.webp', alt: 'AI-assisted editor showing inline suggestions and a confidence widget' },
    Icon: IconAi,
    hue: 'amber',
    badge: 'AI · Automation',
  },
}

function StackChips({ stack }) {
  const items = stack.replace(/\.$/, '').split(/[,·]|\s+or\s+/i).map((s) => s.trim()).filter(Boolean)
  return (
    <div className={styles.stackChips}>
      {items.map((item) => (
        <span key={item} className={styles.stackChip}>{item}</span>
      ))}
    </div>
  )
}

export default function Services() {
  return (
    <>
      <PageHeader
        eyebrow={SERVICES_PAGE.eyebrow}
        heading={SERVICES_PAGE.heading}
        sub={SERVICES_PAGE.sub}
        variant="full-bleed"
        media={{
          src: '/img/page/services-hero.webp',
          alt: '',
          width: 1920,
          height: 1080,
        }}
      />

      <div className={styles.list}>
        {SERVICES_PAGE.items.map((svc, i) => {
          const reverse = i % 2 === 1
          const meta = META[svc.key]
          const Icon = meta.Icon
          return (
            <section
              key={svc.key}
              className={`${styles.section} ${styles[`hue_${meta.hue}`]}`}
              data-index={i + 1}
            >
              <div className={styles.atmosphere} aria-hidden="true">
                <span className={styles.bloomA} />
                <span className={styles.bloomB} />
                <span className={styles.gridLine} />
              </div>
              <span className={styles.bgNumeral} aria-hidden="true">{`0${i + 1}`}</span>

              <div className="container">
                <Reveal className={`${styles.row} ${reverse ? styles.reverse : ''}`}>
                  <div className={styles.body}>
                    <Eyebrow tone="muted" glyph={`0${i + 1}`}>
                      / {svc.key} <span className={styles.eyebrowDivider} aria-hidden="true">·</span> <span className={styles.eyebrowBadge}>{meta.badge}</span>
                    </Eyebrow>

                    <h3 className={styles.heading}>{svc.title}</h3>
                    <p className={styles.lede}>{svc.lede}</p>

                    <ul className={styles.bullets}>
                      {svc.bullets.map((b) => (
                        <li key={b}>
                          <span className={styles.tick} aria-hidden="true">
                            <IconCheck width="13" height="13" />
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={styles.stackBlock}>
                      <span className={styles.stackLabel}>// stack</span>
                      <StackChips stack={svc.stack} />
                    </div>

                    <div className={styles.cta}>
                      <Button to="/contact" variant="primary" arrow>
                        {svc.cta}
                      </Button>
                      <span className={styles.ctaMeta}>
                        <span className={styles.dot} aria-hidden="true" />
                        Booking projects this quarter
                      </span>
                    </div>
                  </div>

                  <div className={styles.visual}>
                    <div className={styles.visualHalo} aria-hidden="true" />
                    <div className={styles.visualCard}>
                      <img
                        src={meta.img.src}
                        alt={meta.img.alt}
                        loading="lazy"
                        width="1280"
                        height="960"
                        className={styles.visualImg}
                      />
                      <div className={styles.visualScrim} aria-hidden="true" />
                      <div className={styles.visualChip} aria-hidden="true">
                        <Icon width="14" height="14" />
                        <span>{meta.badge}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </section>
          )
        })}
      </div>

      <FinalCta
        heading={SERVICES_PAGE.finalCta.heading}
        sub={SERVICES_PAGE.finalCta.sub}
        ctaLabel={SERVICES_PAGE.finalCta.cta}
      />
    </>
  )
}
