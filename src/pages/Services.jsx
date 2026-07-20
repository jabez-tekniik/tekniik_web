import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import MiniCta from '../components/MiniCta.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import FadeIn from '../motion/ink/FadeIn.jsx'
import { useScrollProgressInk } from '../motion/ink/index.js'
import { getLenis } from '../motion/SmoothScroll.jsx'
import { WebScene, AppScene, MobileScene, AiScene } from '../sections/ServiceVignettes.jsx'
import ServicesShowreel from '../sections/ServicesShowreel.jsx'
import useStageParallax from '../hooks/useStageParallax.js'
import { SERVICES_PAGE, MINI_CTAS } from '../data/content.js'
import styles from './Services.module.css'

/* Short discipline labels for the hero index + section eyebrows —
   the long content.js titles stay on the sections themselves.
   Each discipline reuses its homepage coded vignette (ServiceVignettes):
   animated, theme-token-driven scenes instead of static imagery. */
const META = {
  websites: {
    label: 'Websites',
    badge: 'Marketing site',
    Scene: WebScene,
    detail: '/services/web-platforms',
  },
  apps: {
    label: 'Web Applications',
    badge: 'Web platform',
    Scene: AppScene,
    detail: '/services/custom-software',
  },
  mobile: {
    label: 'Mobile Apps',
    badge: 'iOS · Android',
    Scene: MobileScene,
    detail: '/services/mobile-apps',
  },
  ai: {
    label: 'AI & Automation',
    badge: 'AI · Automation',
    Scene: AiScene,
    detail: '/services/ai-systems',
  },
}

/* Pure-JS anchor scroll — no location hash (user request). Lenis owns the
   scroll when active (native scrollIntoView gets cancelled by its rAF loop),
   so route through it; the -88px offset mirrors the sections'
   scroll-margin-top, which Lenis ignores. Reduced motion jumps instantly. */
function scrollToSection(key) {
  const el = document.getElementById(key)
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = getLenis()
  if (lenis && !reduced) lenis.scrollTo(el, { offset: -88 })
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

/* Diagonal arrow for the hero index rows — points down-page. */
function ArrowDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5 5l6 6M11 11V6.5M11 11H6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* One discipline — full editorial section: scroll-drawn teal rail, ghost
   numeral head, spec-sheet bullets, and the discipline's animated vignette
   on a frameless blueprint stage. The 4th (AI) inverts onto the brand-navy
   band (tokens re-scoped in the module so the whole tree adapts). */
function Discipline({ svc, i }) {
  const meta = META[svc.key]
  const dark = svc.key === 'ai'
  const reverse = i % 2 === 1
  const SceneComp = meta.Scene

  // the vignette ignites once its stage scrolls into view (one-shot — the
  // scene keeps its state when you scroll past, like every other reveal)
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

  // the site's rail mechanic, horizontal: the top hairline fills teal as
  // the section scrolls in; the node ignites as the fill starts
  const railRef = useScrollProgressInk(
    (p, el) => {
      const local = Math.min(1, p * 1.6)
      el.firstElementChild.style.transform = `scaleX(${local})`
      el.classList.toggle(styles.lit, local > 0.02)
    },
    { startVh: 0.9, endVh: 0.45 },
  )

  return (
    <section
      id={svc.key}
      className={[
        styles.disc,
        dark ? styles.discDark : '',
        !dark && reverse ? styles.discTint : '',
        reverse ? styles.reverse : '',
      ].join(' ')}
    >
      <div className="container">
        <span ref={railRef} className={styles.rail} aria-hidden="true">
          <span className={styles.railFill} />
          <span className={styles.railNode} />
        </span>

        <Reveal className={styles.discHead}>
          <div className={styles.discMeta}>
            <span className={styles.discIndex}>0{i + 1}</span>
            <span className={styles.discEyebrow}>/ {meta.label}</span>
          </div>
          <span className={styles.badge}>{meta.badge}</span>
        </Reveal>

        <div className={styles.discGrid}>
          <div className={styles.discBody}>
            <span className={styles.ghost} aria-hidden="true">
              0{i + 1}
            </span>
            <FadeIn text={svc.title} as="h2" className={styles.discTitle} />
            <Reveal delay={100}>
              <p className={styles.lede}>{svc.lede}</p>
            </Reveal>

            <ul className={styles.specs}>
              {svc.bullets.map((b, j) => (
                <Reveal as="li" key={b} delay={120 + j * 60} className={styles.specRow}>
                  <span className={styles.specNum} aria-hidden="true">
                    {String(j + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.specText}>{b}</span>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={180} className={styles.stackRow}>
              <span className={styles.stackLabel}>Stack</span>
              <p className={styles.stackText}>{svc.stack}</p>
            </Reveal>

            <Reveal delay={240} className={styles.ctaRow}>
              <Button to="/contact" variant={dark ? 'inverse' : 'primary'} arrow>
                {svc.cta}
              </Button>
              <Link className={styles.detailLink} to={meta.detail}>
                Full details
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3.5 8h9M9 4.5 12.5 8 9 11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </Reveal>
          </div>

          <Reveal className={styles.discVisual} delay={80}>
            <div ref={stageRef} className={styles.stage} aria-hidden="true">
              <SceneComp active={live} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default function Services() {
  const [line1, line2] = SERVICES_PAGE.heading
  const items = SERVICES_PAGE.items

  /* —— hero showreel: one device shell morphs between four live product
     demos while the stage is in view; hovering the stage or an index row
     holds/pins the reel (the timer re-arms on every change so a manual pick
     gets its full beat); clicking the stage jumps to the active section. —— */
  const [heroActive, setHeroActive] = useState(0)
  const [heroInView, setHeroInView] = useState(false)
  const [heroHeld, setHeroHeld] = useState(false)
  const heroStageRef = useStageParallax()

  useEffect(() => {
    const el = heroStageRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      (entries) => setHeroInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [heroStageRef])

  useEffect(() => {
    if (!heroInView || heroHeld) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => setHeroActive((a) => (a + 1) % items.length), 6600)
    return () => clearInterval(id)
  }, [heroInView, heroHeld, heroActive, items.length])

  return (
    <>
      {/* —— Hero: poster left, combined discipline reel right ——— */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Reveal className={styles.metaBar}>
            <span className={styles.eyebrow}>
              <span className={styles.node} aria-hidden="true" />
              {SERVICES_PAGE.eyebrow}
            </span>
            <span className={styles.metaRight}>04 disciplines / one team</span>
          </Reveal>

          <div className={styles.heroSplit}>
            <div className={styles.heroText}>
              {/* segments flow inline (accent tail) so the headline wraps
                  naturally to ≤3 lines at the shared hero size; the {' '}
                  keeps the word gap, the nbsp binds the last two words so
                  no single-word orphan — copy is unchanged */}
              <h1 className={styles.headline}>
                <FadeIn text={line1} as="span" className={styles.hLine} />
              {' '}
              <FadeIn
                text={line2.replace(/ (\S+)$/, ' $1')}
                as="span"
                delay={150}
                className={`${styles.hLine} ${styles.hAccent}`}
              />
              </h1>
              <Reveal delay={280}>
                <p className={styles.sub}>{SERVICES_PAGE.sub}</p>
              </Reveal>
            </div>

            <Reveal className={styles.heroVisual} delay={160}>
              {/* decorative + pointer-only shortcut; the index strip below is
                  the accessible path to the same sections */}
              <div
                ref={heroStageRef}
                className={`${styles.stage} ${styles.heroStage}`}
                aria-hidden="true"
                onMouseEnter={() => setHeroHeld(true)}
                onMouseLeave={() => setHeroHeld(false)}
                onClick={() => scrollToSection(items[heroActive].key)}
              >
                <ServicesShowreel active={items[heroActive].key} />
              </div>
            </Reveal>
          </div>

          {/* discipline index — anchors down the build sheet; the tinted row
              tracks whichever scene is on the hero stage */}
          <Reveal as="nav" className={styles.indexStrip} aria-label="Services on this page" delay={200}>
            {items.map((svc, i) => (
              <button
                key={svc.key}
                type="button"
                className={`${styles.indexRow} ${i === heroActive ? styles.indexActive : ''}`}
                style={{ '--row-hue': `var(--svc-${svc.key})` }}
                onClick={() => scrollToSection(svc.key)}
                onMouseEnter={() => setHeroActive(i)}
                onFocus={() => setHeroActive(i)}
              >
                <span className={styles.indexNum} aria-hidden="true">
                  0{i + 1}
                </span>
                <span className={styles.indexLabel}>{META[svc.key].label}</span>
                <span className={styles.indexArrow} aria-hidden="true">
                  <ArrowDown />
                </span>
              </button>
            ))}
          </Reveal>
        </div>
      </section>

      {/* —— The build sheet: 4 disciplines — a CTA strip breaks the sheet
          halfway so decided visitors don't have to scroll two more pitches */}
      {SERVICES_PAGE.items.map((svc, i) => (
        <Fragment key={svc.key}>
          <Discipline svc={svc} i={i} />
          {i === 1 && <MiniCta {...MINI_CTAS.services} />}
        </Fragment>
      ))}

      {/* Closing CTA — page-specific content: after reading four service
         pitches the honest close is "not sure what you need?", not another
         generic sales line (two back-to-back CTAs read as duplicates). */}
      <FinalCta
        heading={SERVICES_PAGE.notSure.heading}
        sub={SERVICES_PAGE.notSure.sub}
        ctaLabel={SERVICES_PAGE.notSure.cta}
      />
    </>
  )
}
