import Reveal from '../components/Reveal.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import MaskRise from '../motion/ink/MaskRise.jsx'
import { useScrollProgressInk } from '../motion/ink/index.js'
import { ABOUT_PAGE } from '../data/content.js'
import styles from './About.module.css'

/* About — "The team sheet" (Deep Ink).
   Hero: poster headline left, the documentary team photo right (kept per
   user) in an ink frame; a 4-cell signals ledger closes the hero. Then:
   01 story (editorial split, final paragraph as the pull statement),
   02 process (brand-navy band, six steps with scroll-drawn teal rails),
   03 principles (2×2 statement cells), FinalCta. Tokens only. */

const SIGNALS = [
  { num: '1-on-1', label: 'Direct senior contact' },
  { num: '0', label: 'Account managers' },
  { num: '10+', label: 'Years senior experience' },
  { num: 'UK', label: 'Based · Available globally' },
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
                <MaskRise text={line1} as="span" className={styles.hLine} />
                <MaskRise
                  text={line2}
                  as="span"
                  delay={120}
                  className={`${styles.hLine} ${styles.hAccent}`}
                />
              </h1>
              <Reveal delay={280}>
                <p className={styles.sub}>{ABOUT_PAGE.sub}</p>
              </Reveal>
            </div>

            <Reveal className={styles.heroVisual} delay={160}>
              <figure className={styles.photo}>
                <img
                  src="/img/page/about-hero.webp"
                  alt="The Tekniik team working together around a laptop"
                  width="1920"
                  height="1080"
                  loading="eager"
                  decoding="async"
                  className={styles.photoImg}
                />
                <figcaption className={styles.photoChip}>
                  <span className={styles.chipNode} aria-hidden="true" />
                  Chennai · London
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* signals ledger — the numbers behind "small and senior" */}
          <Reveal className={styles.signals}>
            {SIGNALS.map((s) => (
              <div key={s.label} className={styles.signal}>
                <span className={styles.signalNum}>{s.num}</span>
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

      {/* —— 02 · Process — navy band, six scroll-lit steps ——— */}
      <section className={styles.process}>
        <div className="container">
          <Reveal className={styles.processHead}>
            <div>
              <div className={styles.meta}>
                <span className={styles.index}>02</span>
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

      {/* —— 03 · Principles ————————————————————————————— */}
      <section className={styles.principles}>
        <div className="container">
          <Reveal className={styles.prHead}>
            <div className={styles.meta}>
              <span className={styles.index}>03</span>
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

      <FinalCta
        heading={ABOUT_PAGE.finalCta.heading}
        sub={ABOUT_PAGE.finalCta.sub}
        ctaLabel={ABOUT_PAGE.finalCta.cta}
      />
    </>
  )
}
