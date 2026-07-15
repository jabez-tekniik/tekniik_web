import { useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Decode from '../motion/ink/Decode.jsx'
import OpenLine from '../components/OpenLine.jsx'
import { useScrollProgressInk } from '../motion/ink/index.js'
import { IconCheck, IconFlagIndia, IconFlagUK } from '../components/Icon.jsx'
import { CONTACT_PAGE, OFFICES } from '../data/content.js'
import styles from './Contact.module.css'

const FLAGS = { chennai: IconFlagIndia, uk: IconFlagUK }

/* Contact — "The open line" (Deep Ink).
   Lean poster hero with a live status strip, then the working spread:
   ledger form left (teal underline draws on focus), direct-lines ledger +
   office right. "What happens next?" closes as a brand-navy band with
   four scroll-lit rail steps — the page's dark beat. Tokens only. */

function Field({ id, label, type = 'text', textarea, placeholder, value, onChange, required }) {
  const inputProps = {
    id,
    name: id,
    placeholder,
    value,
    onChange,
    required,
    className: styles.input,
  }
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {textarea ? <textarea {...inputProps} rows={5} /> : <input type={type} {...inputProps} />}
      <span className={styles.underline} aria-hidden="true" />
    </div>
  )
}

/* Direct line — one hairline ledger row: mono label, Satoshi value */
function Line({ href, label, value, external }) {
  return (
    <a
      href={href}
      className={styles.line}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className={styles.lineLabel}>{label}</span>
      <span className={styles.lineValue}>{value}</span>
      <span className={styles.lineArrow} aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M5 11l6-6M11 5H6.5M11 5v4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  )
}

export default function Contact() {
  const [line1, line2] = CONTACT_PAGE.heading
  const { side, form: formCopy } = CONTACT_PAGE
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [officeKey, setOfficeKey] = useState(OFFICES[0].key)
  const office = OFFICES.find((o) => o.key === officeKey) ?? OFFICES[0]

  const update = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }))
  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  const total = side.next.length
  const nextRef = useScrollProgressInk((p, grid) => {
    grid.querySelectorAll('[data-rail]').forEach((rail, i) => {
      const local = Math.min(1, Math.max(0, p * total - i))
      rail.firstElementChild.style.transform = `scaleX(${local})`
      rail.classList.toggle(styles.lit, local > 0.02)
    })
  })

  return (
    <>
      {/* —— Hero: poster + status strip —————————————————— */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Reveal className={styles.metaBar}>
            <span className={styles.eyebrow}>
              <span className={styles.node} aria-hidden="true" />
              {CONTACT_PAGE.eyebrow}
            </span>
            <span className={styles.metaRight}>UK · Chennai / one working day</span>
          </Reveal>

          <div className={styles.heroSplit}>
            <div>
              <h1 className={styles.headline}>
                <Decode text={line1} as="span" className={styles.hLine} />
                <Decode
                  text={line2}
                  as="span"
                  delay={420}
                  className={`${styles.hLine} ${styles.hAccent}`}
                />
              </h1>
              <Reveal delay={280}>
                <p className={styles.sub}>{CONTACT_PAGE.sub}</p>
              </Reveal>
            </div>

            <Reveal delay={200} className={styles.heroVisual}>
              <OpenLine />
            </Reveal>
          </div>

          {/* status strip — availability facts as a hairline ledger */}
          <Reveal className={styles.status} delay={200}>
            <span className={styles.statusCell}>
              <span className={styles.liveDot} aria-hidden="true" />
              Available now
            </span>
            <span className={styles.statusCell}>Replies within 24 hours</span>
            <span className={styles.statusCell}>Discovery call · 30 min</span>
          </Reveal>
        </div>
      </section>

      {/* —— The working spread: form | direct lines ————————— */}
      <section className={styles.spread}>
        <div className="container">
          <div className={styles.grid}>
            <Reveal>
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <Field
                  id="name"
                  label={formCopy.nameLabel}
                  placeholder={formCopy.namePlaceholder}
                  value={form.name}
                  onChange={update('name')}
                  required
                />
                <Field
                  id="email"
                  type="email"
                  label={formCopy.emailLabel}
                  placeholder={formCopy.emailPlaceholder}
                  value={form.email}
                  onChange={update('email')}
                  required
                />
                <Field
                  id="message"
                  textarea
                  label={formCopy.messageLabel}
                  placeholder={formCopy.messagePlaceholder}
                  value={form.message}
                  onChange={update('message')}
                  required
                />

                <div className={styles.submitRow}>
                  <Button type="submit" variant="primary" arrow={!sent}>
                    {sent ? (
                      <span className={styles.sentInner}>
                        <IconCheck width="14" height="14" /> Sent — we’ll be in touch
                      </span>
                    ) : (
                      formCopy.submitLabel
                    )}
                  </Button>
                  <p className={styles.note}>{formCopy.note}</p>
                </div>
              </form>
            </Reveal>

            <Reveal delay={120} className={styles.aside}>
              <h2 className={styles.asideHead}>{side.heading}</h2>

              <div className={styles.lines}>
                <Line href={`mailto:${side.email}`} label="Email" value={side.email} />
                <Line
                  href={`mailto:${side.careersEmail}`}
                  label={side.careersLabel}
                  value={side.careersEmail}
                />
                <Line
                  href={`https://wa.me/${side.phoneRaw.replace(/[^0-9]/g, '')}`}
                  label={side.whatsappLabel}
                  value={side.phone}
                  external
                />
              </div>

              <p className={styles.availability}>{side.availability}</p>

              <div className={styles.office}>
                <span className={styles.officeEyebrow}>{side.officeHeading}</span>
                <div className={styles.officeTabs} role="tablist" aria-label="Office locations">
                  {OFFICES.map((o) => {
                    const Flag = FLAGS[o.key]
                    return (
                      <button
                        key={o.key}
                        type="button"
                        role="tab"
                        aria-selected={o.key === office.key}
                        className={`${styles.officeTab} ${o.key === office.key ? styles.officeTabActive : ''}`}
                        onClick={() => setOfficeKey(o.key)}
                      >
                        {Flag && (
                          <span className={styles.flag} aria-hidden="true">
                            <Flag />
                          </span>
                        )}
                        {o.label}
                      </button>
                    )
                  })}
                </div>
                <address className={styles.officeAddress} key={office.key}>
                  {office.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                  <span className={styles.officeCountry}>{office.country}</span>
                </address>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* —— What happens next — navy band, four scroll-lit steps ——— */}
      <section className={styles.next}>
        <div className="container">
          <Reveal className={styles.nextHead}>
            <div className={styles.meta}>
              <span className={styles.index}>01</span>
              <span className={styles.metaEyebrow}>After you hit send</span>
            </div>
            <h2 className={styles.nextHeading}>{side.nextHeading}</h2>
          </Reveal>

          <ol ref={nextRef} className={styles.nextSteps}>
            {side.next.map((step, i) => (
              <li key={step} className={styles.nextStep}>
                <span className={styles.rail} data-rail="" aria-hidden="true">
                  <span className={styles.railFill} />
                  <span className={styles.railNode} />
                </span>
                <Reveal delay={i * 90} className={styles.nextBody}>
                  <span className={styles.nextNum}>0{i + 1}</span>
                  <p className={styles.nextText}>{step}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
