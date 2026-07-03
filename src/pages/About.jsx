import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Eyebrow from '../components/Eyebrow.jsx'
import {
  IconTeam,
  IconCheck,
  IconSparkle,
  IconPing,
  IconCompass,
  IconScroll,
  IconPalette,
  IconCode,
  IconRocket,
  IconHandshake,
} from '../components/Icon.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import { ABOUT_PAGE } from '../data/content.js'
import styles from './About.module.css'

const SIGNAL_ICONS = [IconTeam, IconCheck, IconSparkle, IconPing]
const PROCESS_ICONS = [
  IconCompass,
  IconScroll,
  IconPalette,
  IconCode,
  IconRocket,
  IconHandshake,
]

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow={ABOUT_PAGE.eyebrow}
        heading={ABOUT_PAGE.heading}
        sub={ABOUT_PAGE.sub}
        variant="full-bleed"
        media={{
          src: '/img/page/about-hero.webp',
          alt: '',
          width: 1920,
          height: 1080,
        }}
      />

      <section className={`section ${styles.story}`}>
        <div className={styles.storyAura} aria-hidden="true">
          <span className={styles.bloomA} />
          <span className={styles.bloomB} />
        </div>

        <div className="container">
          <Reveal className={styles.storyWrap}>
            <Eyebrow tone="muted">{ABOUT_PAGE.story.eyebrow}</Eyebrow>
            <h2 className={styles.storyHeading}>{ABOUT_PAGE.story.heading}</h2>
            <div className={styles.storyBody}>
              {ABOUT_PAGE.story.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal stagger className={styles.signals}>
            {[
              { num: '1-on-1', label: 'Direct senior contact' },
              { num: '0', label: 'Account managers' },
              { num: '10+', label: 'Years senior experience' },
              { num: 'UK', label: 'Based · Available globally' },
            ].map((s, i) => {
              const Icon = SIGNAL_ICONS[i]
              return (
                <div key={s.label} className={styles.signal}>
                  <span className={styles.signalIcon} aria-hidden="true">
                    <Icon width="16" height="16" />
                  </span>
                  <span className={styles.signalNum}>{s.num}</span>
                  <span className={styles.signalLabel}>{s.label}</span>
                  <span className={styles.signalRing} aria-hidden="true" />
                </div>
              )
            })}
          </Reveal>
        </div>
      </section>

      <section className={`section ${styles.process}`}>
        <div className={styles.processAura} aria-hidden="true" />
        <div className="container">
          <Reveal className={styles.processHead}>
            <Eyebrow>{ABOUT_PAGE.process.eyebrow}</Eyebrow>
            <h2 className={styles.processHeading}>{ABOUT_PAGE.process.heading}</h2>
            <p className={styles.processSub}>{ABOUT_PAGE.process.sub}</p>
          </Reveal>

          <Reveal stagger className={styles.processGrid}>
            {ABOUT_PAGE.process.steps.map((s, i) => {
              const Icon = PROCESS_ICONS[i] || IconSparkle
              return (
                <article key={s.n} className={styles.processCard}>
                  <span className={styles.processCardGlow} aria-hidden="true" />
                  <div className={styles.processCardTop}>
                    <span className={styles.processIcon} aria-hidden="true">
                      <Icon width="18" height="18" />
                    </span>
                    <span className={styles.processNum}>{`0${s.n}`}</span>
                    <span className={styles.processSeparator} aria-hidden="true" />
                  </div>
                  <h4 className={styles.processCardTitle}>{s.title}</h4>
                  <p className={styles.processCardBody}>{s.body}</p>
                  <p className={styles.processWin}>
                    <span className={styles.winLabel}>// outcome</span> {s.win}
                  </p>
                </article>
              )
            })}
          </Reveal>
        </div>
      </section>

      <section className={`section ${styles.principles}`}>
        <div className="container">
          <Reveal className={styles.principlesHead}>
            <Eyebrow tone="muted">{ABOUT_PAGE.principles.eyebrow}</Eyebrow>
            <h2 className={styles.principlesHeading}>{ABOUT_PAGE.principles.heading}</h2>
          </Reveal>

          <Reveal stagger className={styles.principlesGrid}>
            {ABOUT_PAGE.principles.items.map((p, i) => (
              <div key={p.title} className={styles.principle}>
                <span className={styles.principleBar} aria-hidden="true" />
                <span className={styles.principleNum}>{`0${i + 1} / 0${ABOUT_PAGE.principles.items.length}`}</span>
                <h4 className={styles.principleTitle}>{p.title}</h4>
                <p className={styles.principleDesc}>{p.desc}</p>
              </div>
            ))}
          </Reveal>
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
