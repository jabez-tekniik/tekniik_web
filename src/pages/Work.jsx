import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Tag from '../components/Tag.jsx'
import FadeIn from '../motion/ink/FadeIn.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import { IconArrow } from '../components/Icon.jsx'
import { PORTFOLIO } from '../data/content.js'
import styles from './Work.module.css'

/* Portfolio — /work (Deep Ink). Hero meta bar + "Our work." poster, the
   CareGrid featured navy card (the "hero of the portfolio"), then the
   remaining seven projects on a 2-col grid mirroring the homepage work-card
   idiom (numbered, region pin chip, tag pills, result foot, hover draw).
   Copy comes verbatim from PORTFOLIO in content.js (locked spec). */

function LocationGlyph({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.6c-2.5 0-4.5 2-4.5 4.5 0 3.1 4.5 8.3 4.5 8.3s4.5-5.2 4.5-8.3c0-2.5-2-4.5-4.5-4.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.1" r="1.7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

/* CareGrid — full-width navy anchor card. Non-interactive on purpose: its
   case study has no routed page yet ("when available" per spec), so the
   card carries no CTA rather than a dead link. */
function FeaturedCard({ item }) {
  const region = item.tags[item.tags.length - 1]
  const pills = item.tags.slice(0, -1)

  return (
    <article className={styles.featured}>
      <span className={styles.fGhost} aria-hidden="true">
        01
      </span>

      <div className={styles.fInner}>
        <div className={styles.fTop}>
          <span className={styles.fNum}>01</span>
          <span className={styles.fKicker}>Featured</span>
          <span className={styles.fRegion}>
            <LocationGlyph className={styles.fRegionIcon} />
            {region}
          </span>
        </div>

        <h2 className={styles.fTitle}>{item.title}</h2>
        <p className={styles.fDesc}>{item.desc}</p>

        <div className={styles.fTags}>
          {pills.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <div className={styles.fFoot}>
          <span className={styles.fResult}>{item.result}</span>
        </div>
      </div>
    </article>
  )
}

/* One grid card — the homepage Portfolio card idiom. Routed items are whole-
   card links with "View case study →"; the rest render as plain articles
   whose foot carries a quiet, non-interactive "View project →" label (spec
   copy, kept honest — no dead # links). */
function ProjectCard({ item, num }) {
  const route = item.route ?? null
  const region = item.tags[item.tags.length - 1]
  const pills = item.tags.slice(0, -1)

  const inner = (
    <>
      <span className={styles.accentLine} aria-hidden="true" />

      <div className={styles.cardTop}>
        <span className={styles.num}>{num}</span>
        <span className={styles.region}>
          <LocationGlyph className={styles.regionIcon} />
          {region}
        </span>
      </div>

      <h3 className={styles.title}>{item.title}</h3>

      <div className={styles.tags}>
        {pills.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <div className={styles.foot}>
        <span className={styles.result}>{item.result}</span>
        {route ? (
          <span className={styles.cta}>
            View case study
            <IconArrow className={styles.ctaIcon} />
          </span>
        ) : (
          <span className={styles.ctaStatic}>
            View project
            <IconArrow className={styles.ctaIcon} />
          </span>
        )}
      </div>
    </>
  )

  if (route) {
    return (
      <Link to={route} className={`${styles.card} ${styles.interactive}`}>
        {inner}
      </Link>
    )
  }
  return <article className={styles.card}>{inner}</article>
}

export default function Work() {
  const featured = PORTFOLIO.items.find((i) => i.featured)
  const rest = PORTFOLIO.items.filter((i) => !i.featured)

  return (
    <>
      {/* —— Hero ————————————————————————————————————— */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Reveal className={styles.metaBar}>
            <span className={styles.eyebrow}>
              <span className={styles.node} aria-hidden="true" />
              Portfolio
            </span>
            <span className={styles.metaRight}>
              Designed · Engineered · Supported
            </span>
          </Reveal>

          <h1 className={styles.headline}>
            <FadeIn as="span" className={styles.hLine}>
              Our <span className={styles.hAccent}>work.</span>
            </FadeIn>
          </h1>

          <Reveal delay={200}>
            <p className={styles.sub}>{PORTFOLIO.sub}</p>
          </Reveal>
        </div>
      </section>

      {/* —— Featured + grid ————————————————————————— */}
      <section className={styles.work}>
        <div className="container">
          <Reveal className={styles.featuredWrap}>
            <FeaturedCard item={featured} />
          </Reveal>

          <div className={styles.grid}>
            {rest.map((item, i) => (
              <Reveal
                key={item.slug}
                delay={(i % 2) * 80}
                className={styles.cardWrap}
              >
                <ProjectCard item={item} num={String(i + 2).padStart(2, '0')} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        heading={['Have a project in mind?', "Let's talk."]}
        ctaLabel="Get a Quote"
      />
    </>
  )
}
