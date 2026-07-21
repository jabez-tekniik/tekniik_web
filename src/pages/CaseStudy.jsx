import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import FadeIn from '../motion/ink/FadeIn.jsx'
import StatBlock from '../components/StatBlock.jsx'
import Tag from '../components/Tag.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import { MobileScene, AppScene } from '../sections/ServiceVignettes.jsx'
import { PORTFOLIO } from '../data/content.js'
import styles from './CaseStudy.module.css'

/* Shared Deep Ink case-study template (CaseLooqz / CaseAutoScreen are thin
   wrappers that normalise their content shapes). Mirrors the ServiceDetail
   spec-sheet idiom: node + mono meta bar, FadeIn hero at the shared
   --fs-page-hero size, the discipline's coded vignette instead of the old
   cinematic render, stats signals ledger, NN / EYEBROW sections, hairline
   spec ledgers, teal-railed pull quotes. Copy verbatim from content.js. */

const SCENES = { mobile: MobileScene, app: AppScene }

export default function CaseStudy({ content: c, slug, sceneKey, groups, quotes, flowCols = 3 }) {
  const Scene = SCENES[sceneKey]

  // the other written-up projects — only PORTFOLIO items that own a case
  // study route qualify, so the rail never links to a page that doesn't exist
  const related = PORTFOLIO.items.filter((p) => p.route && p.slug !== slug)

  // vignette ignites once its stage scrolls into view (one-shot, like the
  // services pages)
  const stageRef = useRef(null)
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
  }, [])

  return (
    <>
      {/* —— Hero: meta bar, FadeIn title | vignette stage, stats ledger —— */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Reveal className={styles.metaBar}>
            <span className={styles.eyebrow}>
              {/* accent rail, not a dot (user, 2026-07-22) — same rail
                  language as the pull quotes and spec ledgers */}
              <span className={styles.rail} aria-hidden="true" />
              {c.eyebrow} / {c.title}
            </span>
            <Link className={styles.crumb} to="/work">
              <span aria-hidden="true">←</span> All work
            </Link>
          </Reveal>

          <div className={styles.heroSplit}>
            <FadeIn as="div">
              <h1 className={styles.headline}>{c.title}</h1>
              <p className={styles.sub}>{c.sub}</p>
            </FadeIn>
            <Reveal className={styles.heroVisual} delay={160}>
              <div ref={stageRef} className={styles.stage} aria-hidden="true">
                <Scene active={live} />
              </div>
            </Reveal>
          </div>

          {/* signals ledger — the launch numbers, counted up in view */}
          <Reveal className={styles.signals}>
            {c.stats.map((s) => (
              <div key={s.label} className={styles.signal}>
                <StatBlock value={s.value} label={s.label} />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* —— 01 / The challenge ——————————————————————— */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>01</span>
            <span className={styles.secEyebrow}>/ The challenge</span>
          </Reveal>
          <div className={styles.proseCol}>
            {c.challenge.map((p, i) => (
              <Reveal as="p" key={i} delay={80 + i * 80} className={styles.para}>
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* —— 02 / What we built — spec ledgers + the flow ——— */}
      <section className={`${styles.section} ${styles.sectionTint}`}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>02</span>
            <span className={styles.secEyebrow}>/ What we built</span>
          </Reveal>

          <Reveal delay={80}>
            <p className={styles.lede}>{c.builtIntro}</p>
          </Reveal>

          {groups.map((group) => (
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

          <Reveal delay={80}>
            <p className={styles.flowIntro}>{c.flowIntro}</p>
          </Reveal>
          <div className={styles.flow} style={{ '--cols': flowCols }}>
            {c.flow.map((f, i) => (
              <Reveal key={f.n} delay={i * 90} className={styles.flowCell}>
                <span className={styles.flowNum}>{f.n}</span>
                <h4 className={styles.flowTitle}>{f.title}</h4>
                <p className={styles.flowDesc}>{f.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* —— 03 / The result — numbers, the word, the stack ——— */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>03</span>
            <span className={styles.secEyebrow}>/ The result</span>
          </Reveal>

          <div className={styles.proseCol}>
            {c.result.map((p, i) => (
              <Reveal as="p" key={i} delay={80 + i * 80} className={styles.para}>
                {p}
              </Reveal>
            ))}
            <Reveal as="p" delay={200} className={styles.quoteIntro}>
              {c.resultIntro}
            </Reveal>
          </div>

          <div className={styles.quotes}>
            {quotes.map((q) => (
              <Reveal as="blockquote" key={q.who} delay={120} className={styles.quote}>
                <p className={styles.quoteText}>&ldquo;{q.text}&rdquo;</p>
                <footer className={styles.quoteWho}>{q.who}</footer>
              </Reveal>
            ))}
          </div>

          <Reveal className={styles.tagsRow} delay={140}>
            {c.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </Reveal>
        </div>
      </section>

      {/* —— 04 / More work — the other case studies —————————— */}
      {related.length > 0 && (
        <section className={`${styles.section} ${styles.sectionTint}`}>
          <div className="container">
            <Reveal className={styles.secHead}>
              <span className={styles.secIndex}>04</span>
              <span className={styles.secEyebrow}>/ More work</span>
            </Reveal>

            <div className={styles.related}>
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 90}>
                  <Link className={styles.relCard} to={p.route}>
                    {/* two tags only — the third (country) wrapped the meta
                        line and knocked the card titles off one baseline */}
                    <span className={styles.relMeta}>{p.tags.slice(0, 2).join(' · ')}</span>
                    <h3 className={styles.relTitle}>{p.title}</h3>
                    <p className={styles.relDesc}>{p.result}</p>
                    <span className={styles.relCta}>
                      Read case study
                      <span className={styles.relArrow} aria-hidden="true">
                        →
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
              <Reveal delay={related.length * 90}>
                <Link className={`${styles.relCard} ${styles.relAll}`} to="/work">
                  <span className={styles.relMeta}>Full portfolio</span>
                  <h3 className={styles.relTitle}>See all work</h3>
                  <p className={styles.relDesc}>
                    Every project we&rsquo;ve designed, engineered, and still support.
                  </p>
                  <span className={styles.relCta}>
                    Browse work
                    <span className={styles.relArrow} aria-hidden="true">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <FinalCta
        heading={c.finalCta.heading}
        accent={c.finalCta.headingAccent}
        sub={c.finalCta.sub}
        ctaLabel={c.finalCta.cta}
      />
    </>
  )
}
