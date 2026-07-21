import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import FadeIn from '../motion/ink/FadeIn.jsx'
import HeroBuildBoard from '../components/HeroBuildBoard.jsx'
import { useScrollProgressInk } from '../motion/ink/index.js'
import { StarredText } from '../components/Icon.jsx'
import { ABOUT_PAGE } from '../data/content.js'
import styles from './About.module.css'

/* About — "The team sheet" (Deep Ink).
   Hero: poster headline left, the animated HeroBuildBoard vignette right
   (replaced the documentary photo — user: off-style; every page hero now
   carries a coded moving vignette); a 4-cell signals ledger closes the
   hero. Then:
   01 story (editorial split, final paragraph as the pull statement),
   02 principles (2×2 statement cells),
   03 process (brand-navy --band-deep band, five steps with scroll-drawn teal
   rails — last dark section before FinalCta, per spec order). Tokens only. */

/* real delivery numbers (consistent with MARQUEE / the homepage Numbers
   section) — user: signals must "actually mean something" */
const SIGNALS = [
  { num: '50+', label: 'Projects delivered' },
  { num: '5+', label: 'Years in the tech industry' },
  { num: '98%', label: 'Client retention' },
  { num: '4.9★', label: 'Average client rating' },
]

export default function About() {
  const [line1, line2] = ABOUT_PAGE.heading
  const { story, process, principles } = ABOUT_PAGE
  const total = process.steps.length

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
      {/* —— Hero: poster left, team photo right ——————————— */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Reveal className={styles.metaBar}>
            <span className={styles.eyebrow}>
              <span className={styles.node} aria-hidden="true" />
              {ABOUT_PAGE.eyebrow}
            </span>
            <span className={styles.metaRight}>Small · Senior · Direct</span>
          </Reveal>

          <div className={styles.heroSplit}>
            <div>
              <h1 className={styles.headline}>
                <FadeIn text={line1} as="span" className={styles.hLine} />
                <FadeIn
                  text={line2}
                  as="span"
                  delay={120}
                  className={`${styles.hLine} ${styles.hAccent}`}
                />
              </h1>
              <Reveal delay={280}>
                <p className={styles.sub}>{ABOUT_PAGE.sub}</p>
              </Reveal>
              <Reveal delay={360} className={styles.heroCta}>
                <Button to="/work" variant="primary" arrow>
                  See our work
                </Button>
              </Reveal>
            </div>

            <Reveal className={styles.heroVisual} delay={160}>
              <HeroBuildBoard />
            </Reveal>
          </div>

          {/* signals ledger — the numbers behind "small and senior" */}
          <Reveal className={styles.signals}>
            {SIGNALS.map((s) => (
              <div key={s.label} className={styles.signal}>
                <span className={styles.signalNum}>
                  <StarredText text={s.num} />
                </span>
                <span className={styles.signalLabel}>{s.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* —— 01 · Story ————————————————————————————————— */}
      <section className={styles.story}>
        <div className="container">
          <div className={styles.storyGrid}>
            <Reveal className={styles.storyHead}>
              <div className={styles.meta}>
                <span className={styles.index}>01</span>
                <span className={styles.metaEyebrow}>{story.eyebrow}</span>
              </div>
              <h2 className={styles.storyHeading}>{story.heading}</h2>
              {/* the proof: heading asks why we exist, CTA points at the
                  work that answers it (user: below the left-side heading) */}
              <div className={styles.storyCta}>
                <Button to="/work" variant="primary" arrow>
                  See our work
                </Button>
                <span className={styles.storyCtaNote}>
                  50+ projects delivered
                </span>
              </div>
            </Reveal>

            <div className={styles.storyBody}>
              {story.paragraphs.map((p, i) => {
                const isLede = i === 0
                const isPull = i === story.paragraphs.length - 1
                return (
                  <Reveal
                    as="p"
                    key={i}
                    delay={100 + i * 80}
                    className={
                      isPull ? styles.pull : isLede ? styles.lede : styles.para
                    }
                  >
                    {p}
                  </Reveal>
                )
              })}

            </div>
          </div>
        </div>
      </section>

      {/* —— 02 · Principles ————————————————————————————— */}
      <section className={styles.principles}>
        <div className="container">
          <Reveal className={styles.prHead}>
            <div className={styles.meta}>
              <span className={styles.index}>02</span>
              <span className={styles.metaEyebrow}>{principles.eyebrow}</span>
            </div>
            <h2 className={styles.prHeading}>{principles.heading}</h2>
          </Reveal>

          <div className={styles.prGrid}>
            {principles.items.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} className={styles.principle}>
                <span className={styles.prNum}>
                  0{i + 1} / 0{principles.items.length}
                </span>
                <h3 className={styles.prTitle}>{p.title}</h3>
                <p className={styles.prDesc}>{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* —— 03 · Process — navy band, five scroll-lit steps ——— */}
      <section className={styles.process}>
        <div className="container">
          <Reveal className={styles.processHead}>
            <div>
              <div className={styles.meta}>
                <span className={styles.index}>03</span>
                <span className={styles.metaEyebrow}>{process.eyebrow}</span>
              </div>
              <h2 className={styles.processHeading}>{process.heading}</h2>
            </div>
            <p className={styles.processSub}>{process.sub}</p>
          </Reveal>

          <ol ref={stepsRef} className={styles.steps}>
            {process.steps.map((s, i) => (
              <li key={s.n} className={styles.step}>
                <span className={styles.rail} data-rail="" aria-hidden="true">
                  <span className={styles.railFill} />
                  <span className={styles.railNode} />
                </span>

                <Reveal delay={(i % 3) * 90} className={styles.stepBody}>
                  <span className={styles.stepLabel}>Step 0{s.n}</span>
                  <span className={styles.ghost} aria-hidden="true">
                    0{s.n}
                  </span>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepDesc}>{s.body}</p>
                  <p className={styles.win}>
                    <span className={styles.winLabel}>You get</span>
                    {s.win.replace(/^You get:\s*/, '')}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FinalCta
        heading={ABOUT_PAGE.finalCta.heading}
        accent={ABOUT_PAGE.finalCta.headingAccent}
        sub={ABOUT_PAGE.finalCta.sub}
        ctaLabel={ABOUT_PAGE.finalCta.cta}
      />
    </>
  )
}
