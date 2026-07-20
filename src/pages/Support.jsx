import Reveal from '../components/Reveal.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import FadeIn from '../motion/ink/FadeIn.jsx'
import styles from './Support.module.css'

/* Support — "Ongoing maintenance and rescue" (Deep Ink).
   Copy VERBATIM from content/tekniik-portfolio-support-spec.md ("Page 2:
   Support" — locked). Poster hero (meta bar + FadeIn headline + sub), then
   the site's spec-sheet idiom: 01 Tekniik clients as a numbered hairline
   ledger on the canvas, 02 everyone else as the same ledger on the tint
   band so the two audiences read separately, 03 the three arrangements as
   2px top-border cells with a teal-railed closing statement, FinalCta. */

const SUPPORT = {
  eyebrow: 'Support',
  metaRight: 'Maintenance · Improvement · Rescue',
  headline: "We don't disappear after launch.",
  sub: "Ongoing support, maintenance, and improvement for software we've built — and software we haven't.",

  clients: {
    eyebrow: '/ For Tekniik clients',
    heading: 'Built by us. Supported by us.',
    copy: "Every project we deliver comes with the option of ongoing support. We don't hand over the code and wish you luck — we stay on as your technology partner, keeping your software secure, up-to-date, and evolving as your business grows.",
    listLabel: "What's included",
    items: [
      'Bug fixes and issue resolution',
      'Security updates and vulnerability patching',
      'Performance monitoring and optimisation',
      'Feature enhancements and iterative improvements',
      'Regular check-ins and health reports',
      'Priority response times',
    ],
  },

  rescue: {
    eyebrow: '/ For everyone else',
    heading: 'Inherited a mess? We can help.',
    copy: [
      'Maybe your previous agency disappeared. Maybe the developer who built your system moved on and nobody understands the code anymore. Maybe the software works — just not the way it should.',
      "We take on rescue projects. We'll audit what you have, identify what's broken, and either fix it or rebuild it properly — whichever makes more sense for your business.",
    ],
    listLabel: 'What we can do',
    items: [
      'Code audit and technical health assessment',
      'Bug fixing and stability improvements',
      'Performance optimisation for slow or unreliable systems',
      'Security hardening and vulnerability remediation',
      'Feature completion for half-finished projects',
      "Full rebuild when repair isn't worth the cost",
      'Migration from legacy platforms to modern frameworks',
    ],
  },

  how: {
    eyebrow: '/ How it works',
    heading: 'Flexible support, no lock-in.',
    copy: "We don't force you into rigid contracts or tiers. Every business has different needs — some want a monthly retainer with guaranteed hours, others want on-call support they use as needed. We'll find an arrangement that works for you.",
    options: [
      {
        title: 'Monthly retainer',
        desc: 'Guaranteed hours each month for ongoing work and priority support.',
      },
      {
        title: 'On-demand',
        desc: 'Call on us when you need us, pay for what you use.',
      },
      {
        title: 'Project-based',
        desc: 'Defined scope for audits, rescues, or specific improvements.',
      },
    ],
    closing: 'All arrangements start with a conversation — no commitment required.',
  },

  finalCta: {
    heading: 'Need support for your software?',
    sub: "Whether we built it or not — let's talk about keeping it running properly.",
    cta: 'Get in Touch',
  },
}

export default function Support() {
  const { clients, rescue, how } = SUPPORT

  return (
    <>
      {/* —— Hero: meta bar + poster headline —————————————— */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Reveal className={styles.metaBar}>
            <span className={styles.eyebrow}>
              <span className={styles.node} aria-hidden="true" />
              {SUPPORT.eyebrow}
            </span>
            <span className={styles.metaRight}>{SUPPORT.metaRight}</span>
          </Reveal>

          <FadeIn as="h1" className={styles.headline} text={SUPPORT.headline} />
          <Reveal delay={200}>
            <p className={styles.sub}>{SUPPORT.sub}</p>
          </Reveal>
        </div>
      </section>

      {/* —— 01 / For Tekniik clients — included-support ledger —— */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>01</span>
            <span className={styles.secEyebrow}>{clients.eyebrow}</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className={styles.secHeading}>{clients.heading}</h2>
          </Reveal>
          <Reveal as="p" delay={140} className={styles.lede}>
            {clients.copy}
          </Reveal>

          <Reveal as="p" delay={180} className={styles.groupHead}>
            {clients.listLabel}
          </Reveal>
          <ul className={styles.specs}>
            {clients.items.map((item, i) => (
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

      {/* —— 02 / For everyone else — rescue ledger on the tint band —— */}
      <section className={`${styles.section} ${styles.sectionTint}`}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>02</span>
            <span className={styles.secEyebrow}>{rescue.eyebrow}</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className={styles.secHeading}>{rescue.heading}</h2>
          </Reveal>
          <div className={styles.ledeCol}>
            {rescue.copy.map((para, i) => (
              <Reveal as="p" key={i} delay={140 + i * 80} className={styles.ledePara}>
                {para}
              </Reveal>
            ))}
          </div>

          <Reveal as="p" delay={180} className={styles.groupHead}>
            {rescue.listLabel}
          </Reveal>
          <ul className={styles.specs}>
            {rescue.items.map((item, i) => (
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

      {/* —— 03 / How it works — three arrangements, no pricing —— */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>03</span>
            <span className={styles.secEyebrow}>{how.eyebrow}</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className={styles.secHeading}>{how.heading}</h2>
          </Reveal>
          <Reveal as="p" delay={140} className={styles.lede}>
            {how.copy}
          </Reveal>

          <div className={styles.options}>
            {how.options.map((opt, i) => (
              <Reveal key={opt.title} delay={i * 90} className={styles.optionCell}>
                <span className={styles.optionNum} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.optionTitle}>{opt.title}</h3>
                <p className={styles.optionDesc}>{opt.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className={styles.closing}>{how.closing}</p>
          </Reveal>
        </div>
      </section>

      <FinalCta
        heading={SUPPORT.finalCta.heading}
        sub={SUPPORT.finalCta.sub}
        ctaLabel={SUPPORT.finalCta.cta}
      />
    </>
  )
}
