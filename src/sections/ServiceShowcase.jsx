import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import { CAPABILITIES } from '../data/content.js'
import { WebScene, AppScene, MobileScene, AiScene } from './ServiceVignettes.jsx'
import { getLenis } from '../motion/SmoothScroll.jsx'
import styles from './ServiceShowcase.module.css'

const VIGNETTES = { web: WebScene, app: AppScene, mobile: MobileScene, ai: AiScene }

function ArrowGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5 11l6-6M11 5H6.5M11 5v4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* "Capability index" — a full-bleed, one-service-at-a-time immersive stage.
   Each service is a wide stage (blueprint + bloom + a giant ghost index +
   the floating vignette) with the copy overlaid; the headline rises up "out
   of" the scene on a masked reveal. On desktop the deck PINS: the page holds
   while it scrolls, the stages cross-fade one to the next, and the active
   panel's scene/copy parallax continuously with the scroll (no slider UI).
   On touch / narrow / reduced-motion the panels stack and scroll naturally,
   an IntersectionObserver lighting whichever is centred so its scene runs. */
export default function ServiceShowcase() {
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)
  const items = CAPABILITIES.items
  const pinRef = useRef(null)
  const deckRef = useRef(null)
  const panelRefs = useRef([])

  /* decide pin mode: real pointer + room + motion allowed */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 961px) and (pointer: fine)')
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const decide = () => setPinned(mq.matches && !rm.matches)
    decide()
    mq.addEventListener('change', decide)
    rm.addEventListener('change', decide)
    return () => {
      mq.removeEventListener('change', decide)
      rm.removeEventListener('change', decide)
    }
  }, [])

  /* pinned: map scroll progress through the tall wrapper to the active
     service + write per-service local progress (--p) for the parallax.
     rAF-throttled; rides the Lenis scroll event when present. */
  useEffect(() => {
    if (!pinned) return undefined
    const el = pinRef.current
    if (!el) return undefined
    const n = items.length
    let raf = 0
    const update = () => {
      raf = 0
      const travel = el.offsetHeight - window.innerHeight
      if (travel <= 0) return
      const p = Math.min(Math.max(-el.getBoundingClientRect().top / travel, 0), 1)
      const prog = p * n
      const idx = Math.min(n - 1, Math.floor(prog))
      const local = Math.min(1, Math.max(0, prog - idx))
      setActive(idx)
      // continuous scroll-linked motion (drives per-panel parallax); no
      // visible slider UI — the scroll itself carries the reveal
      if (deckRef.current) deckRef.current.style.setProperty('--p', local.toFixed(4))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const lenis = getLenis()
    if (lenis) lenis.on('scroll', onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (lenis) lenis.off('scroll', onScroll)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pinned, items.length])

  /* not pinned: light up whichever stacked panel is most in view, so its
     vignette animates while the rest sit quiet */
  useEffect(() => {
    if (pinned) return undefined
    const nodes = panelRefs.current.filter(Boolean)
    if (!nodes.length) return undefined
    const ratios = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0))
        let best = 0
        let bestI = 0
        nodes.forEach((node, i) => {
          const r = ratios.get(node) || 0
          if (r > best) {
            best = r
            bestI = i
          }
        })
        if (best > 0) setActive(bestI)
      },
      { threshold: [0.2, 0.5, 0.8], rootMargin: '-18% 0px -18% 0px' },
    )
    nodes.forEach((node) => io.observe(node))
    return () => io.disconnect()
  }, [pinned, items.length])

  return (
    <section className={`section ${styles.section}`} data-pinned={pinned || undefined}>
      <div className="container">
        <Reveal className={styles.header}>
          <div className={styles.headMeta}>
            <span className={styles.index}>05</span>
            <span className={styles.eyebrow}>{CAPABILITIES.eyebrow}</span>
          </div>
          <div className={styles.headRow}>
            <h2 className={styles.heading}>
              {CAPABILITIES.heading.map((line, i, arr) => (
                <span key={line} className={i === 1 ? styles.headingAccent : styles.headingLine}>
                  {line}
                  {i < arr.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h2>
            <p className={styles.sub}>{CAPABILITIES.sub}</p>
          </div>
        </Reveal>
      </div>

      {/* pin region — tall wrapper on desktop, collapses to auto elsewhere */}
      <div ref={pinRef} className={styles.pin}>
        <div className={styles.pinInner}>
          {/* deck — one full-bleed service stage shown at a time */}
          <div ref={deckRef} className={styles.deck}>
            {items.map((item, i) => {
              const Scene = VIGNETTES[item.key]
              const on = i === active
              const ghostWord = item.title.toUpperCase()
              return (
                <article
                  key={item.key}
                  ref={(node) => {
                    panelRefs.current[i] = node
                  }}
                  className={`${styles.panel} ${on ? styles.panelOn : ''}`}
                  aria-hidden={pinned && !on ? true : undefined}
                >
                  {/* the giant service name — a faint watermark drifting
                      left↔right across the whole panel, BEHIND the screen */}
                  <span className={styles.ghost} aria-hidden="true">
                    <span className={styles.ghostInner}>{ghostWord}</span>
                  </span>

                  <div className={styles.overlay}>
                    <div className={styles.titleWrap}>
                      <h3 className={styles.title}>
                        {item.title.split(' ').map((word, wi) => (
                          <span key={`${word}-${wi}`} className={styles.titleMask}>
                            <span
                              className={styles.titleWord}
                              style={{ transitionDelay: on ? `${140 + wi * 80}ms` : '0ms' }}
                            >
                              {word}
                            </span>
                          </span>
                        ))}
                      </h3>
                    </div>
                    <p className={styles.desc}>{item.desc}</p>
                    <Link to={item.to || '/services'} className={styles.link}>
                      <span>Explore {item.title.toLowerCase()}</span>
                      <span className={styles.linkIcon}>
                        <ArrowGlyph />
                      </span>
                    </Link>
                  </div>

                  {/* vignette stage: grid + bloom + the device-framed screen */}
                  <div className={styles.stage} aria-hidden="true">
                    <div className={styles.screen}>
                      <div className={styles.screenBar}>
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className={styles.sceneHolder}>
                        <Scene active={on} />
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
