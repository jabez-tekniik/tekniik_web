import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import FadeIn from '../motion/ink/FadeIn.jsx'
import { WebScene, AppScene, MobileScene, AiScene } from '../sections/ServiceVignettes.jsx'
import useStageParallax from '../hooks/useStageParallax.js'
import NotFound from './NotFound.jsx'
import { SERVICE_PAGES } from '../data/content.js'
import styles from './ServiceDetail.module.css'

const SCENES = { web: WebScene, app: AppScene, mobile: MobileScene, ai: AiScene }

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8h9M9 4.5 12.5 8 9 11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* Shared detail-page template for the four /services/<slug> routes —
   spec: docs/superpowers/specs/2026-07-17-services-detail-pages-design.md.
   Copy comes verbatim from SERVICE_PAGES; the page's visual identity is its
   discipline's homepage vignette scene on a frameless stage. App.jsx keys
   the route wrapper by pathname, so sibling navigation remounts cleanly. */
export default function ServiceDetail() {
  const { slug } = useParams()
  const page = SERVICE_PAGES[slug]

  // vignette ignites once its stage scrolls into view (one-shot, like the hub)
  const stageRef = useStageParallax()
  const [live, setLive] = useState(false)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLive(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [stageRef])

  if (!page) return <NotFound />

  const Scene = SCENES[page.sceneKey]
  const others = Object.entries(SERVICE_PAGES).filter(([key]) => key !== slug)

  return (
    <>
      {/* —— Hero: breadcrumb meta bar, FadeIn headline | vignette stage —— */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Reveal className={styles.metaBar}>
            <span className={styles.eyebrow}>
              <span className={styles.node} aria-hidden="true" />
              Services / {page.name}
            </span>
            <Link className={styles.crumb} to="/services">
              <span aria-hidden="true">←</span> All services
            </Link>
          </Reveal>

          <div className={styles.heroSplit}>
            {/* headline + the page's rail device fade in together as one
                quiet block — the rail no longer draws itself (user: simple
                fade only), it's just part of the composition */}
            <FadeIn as="div">
              <h1 className={styles.headline}>{page.headline}</h1>
              <span className={styles.heroRail} aria-hidden="true">
                <span className={styles.heroRailFill} />
                <span className={styles.heroRailNode} />
              </span>
            </FadeIn>
            <Reveal className={styles.heroVisual} delay={160}>
              <div ref={stageRef} className={styles.stage} aria-hidden="true">
                <Scene active={live} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* —— 01 / The problem ——— */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>01</span>
            <span className={styles.secEyebrow}>/ The problem</span>
          </Reveal>
          <div className={styles.problemCol}>
            {page.problem.map((para, i) => (
              <Reveal as="p" key={i} delay={80 + i * 80} className={styles.problemPara}>
                {para}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* —— 02 / What we deliver — spec-sheet ledger, never a paragraph —— */}
      <section className={`${styles.section} ${styles.sectionTint}`}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>02</span>
            <span className={styles.secEyebrow}>/ What we deliver</span>
          </Reveal>
          <ul className={styles.specs}>
            {page.deliver.map((item, i) => (
              <Reveal as="li" key={item} delay={80 + i * 50} className={styles.specRow}>
                <span className={styles.specNum} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={styles.specText}>{item}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* —— 03 / Our approach — teal-railed statement ——— */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>03</span>
            <span className={styles.secEyebrow}>/ Our approach</span>
          </Reveal>
          <Reveal delay={100}>
            <p className={styles.approach}>{page.approach}</p>
          </Reveal>
        </div>
      </section>

      {/* —— Related case study (only where a routed case page exists) ——— */}
      {page.caseStudy && (
        <section className={`${styles.section} ${styles.sectionTint}`}>
          <div className="container">
            <Reveal className={styles.caseCard}>
              <div className={styles.caseBody}>
                <span className={styles.caseKicker}>
                  <span className={styles.node} aria-hidden="true" />
                  {page.caseStudy.kicker}
                </span>
                <h2 className={styles.caseTitle}>{page.caseStudy.title}</h2>
                <p className={styles.caseDesc}>{page.caseStudy.desc}</p>
              </div>
              <div className={styles.caseFoot}>
                <span className={styles.caseResult}>{page.caseStudy.result}</span>
                <Link className={styles.caseLink} to={page.caseStudy.to}>
                  View case study <ArrowRight />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* —— Also explore — cross-links between the sibling services ——— */}
      <section className={styles.section}>
        <div className="container">
          <Reveal as="nav" className={styles.explore} aria-label="Explore other services">
            <span className={styles.exploreLabel}>Also explore</span>
            <div className={styles.exploreRows}>
              {others.map(([key, other], i) => (
                <Link key={key} className={styles.exploreRow} to={`/services/${key}`}>
                  <span className={styles.exploreNum} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.exploreName}>{other.name}</span>
                  <span className={styles.exploreArrow} aria-hidden="true">
                    <ArrowRight />
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCta heading={page.cta.text} ctaLabel={page.cta.button} />
    </>
  )
}
