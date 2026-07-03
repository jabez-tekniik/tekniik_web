import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Tag from '../components/Tag.jsx'
import StatBlock from '../components/StatBlock.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import { CASE_LOOQZ } from '../data/content.js'
import styles from './CaseStudy.module.css'

export default function CaseLooqz() {
  const c = CASE_LOOQZ
  return (
    <>
      <PageHeader
        eyebrow={c.eyebrow}
        heading={c.title}
        sub={c.sub}
        back={{ label: 'Back to projects', to: '/' }}
        media={{
          src: '/img/case/looqz-hero.webp',
          alt: 'Three softly floating translucent rectangular surfaces in indigo and pink light — an abstract representation of GlowBook’s multi-surface booking product',
          width: 1600,
          height: 1600,
        }}
      />

      <section className={`section ${styles.section}`}>
        <div className="container">
          <Reveal className={styles.statsGrid}>
            {c.stats.map((s) => (
              <div key={s.label} className={styles.statCell}>
                <StatBlock value={s.value} label={s.label} />
              </div>
            ))}
          </Reveal>

          <div className={styles.body}>
            <Reveal>
              <span className={styles.headRule} />
              <h2 className={styles.h2}>The Challenge</h2>
              {c.challenge.map((p, i) => (
                <p key={i} className={styles.para}>{p}</p>
              ))}
            </Reveal>

            <Reveal>
              <span className={styles.headRule} />
              <h2 className={styles.h2}>What We Built</h2>
              <p className={styles.para}>{c.builtIntro}</p>

              <h3 className={styles.subHead}>{c.customerHeading}</h3>
              <ul className={styles.bullets}>
                {c.customer.map((b) => (
                  <li key={b}>
                    <span className={styles.bulletDot} aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>

              <h3 className={styles.subHead}>{c.proHeading}</h3>
              <ul className={styles.bullets}>
                {c.pro.map((b) => (
                  <li key={b}>
                    <span className={styles.bulletDot} aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>

              <p className={styles.para}>{c.flowIntro}</p>
              <div className={styles.flowGrid} data-cols="3">
                {c.flow.map((f) => (
                  <div key={f.n} className={styles.flowCard}>
                    <div className={styles.flowNum}>{f.n}</div>
                    <div className={styles.flowTitle}>{f.title}</div>
                    <div className={styles.flowDesc}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <span className={styles.headRule} />
              <h2 className={styles.h2}>The Result</h2>
              {c.result.map((p, i) => (
                <p key={i} className={styles.para}>{p}</p>
              ))}
              <p className={styles.para}>{c.resultIntro}</p>
              <p className={styles.quote}>
                “{c.quote.text}”<span>— {c.quote.who}</span>
              </p>

              <div className={styles.tagsRow}>
                {c.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCta heading={c.finalCta.heading} sub={c.finalCta.sub} ctaLabel={c.finalCta.cta} />
    </>
  )
}
