import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import {
  IconCheck,
  IconMail,
  IconWhatsApp,
  IconClock,
  IconBolt,
  IconPing,
} from '../components/Icon.jsx'
import { CONTACT_PAGE } from '../data/content.js'
import styles from './Contact.module.css'

function FloatingField({ id, label, type = 'text', textarea, placeholder, value, onChange, required }) {
  const filled = value && value.length > 0
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
    <div className={`${styles.field} ${filled ? styles.filled : ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {textarea ? (
        <textarea {...inputProps} rows={5} />
      ) : (
        <input type={type} {...inputProps} />
      )}
      <span className={styles.underline} aria-hidden="true" />
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const update = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }))
  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <>
      <PageHeader
        eyebrow={CONTACT_PAGE.eyebrow}
        heading={CONTACT_PAGE.heading}
        sub={CONTACT_PAGE.sub}
        variant="full-bleed"
        media={{
          src: '/img/page/contact-hero.webp',
          alt: '',
          width: 1920,
          height: 1080,
        }}
      />

      <section className={`section ${styles.section}`} style={{ paddingTop: 24 }}>
        <div className={styles.sectionAura} aria-hidden="true" />

        <div className="container">
          <Reveal className={styles.statusBar}>
            <span className={styles.status}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span className={styles.statusText}>
                Available now <span className={styles.statusMeta}>· UK / Chennai</span>
              </span>
            </span>
            <span className={styles.statusChip}>
              <IconBolt width="12" height="12" aria-hidden="true" />
              Replies within 24 hours
            </span>
            <span className={styles.statusChip}>
              <IconClock width="12" height="12" aria-hidden="true" />
              Discovery call · 30 min
            </span>
          </Reveal>

          <div className={styles.grid}>
            <Reveal>
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <span className={styles.formGlow} aria-hidden="true" />

                <FloatingField
                  id="name"
                  label={CONTACT_PAGE.form.nameLabel}
                  placeholder={CONTACT_PAGE.form.namePlaceholder}
                  value={form.name}
                  onChange={update('name')}
                  required
                />
                <FloatingField
                  id="email"
                  type="email"
                  label={CONTACT_PAGE.form.emailLabel}
                  placeholder={CONTACT_PAGE.form.emailPlaceholder}
                  value={form.email}
                  onChange={update('email')}
                  required
                />
                <FloatingField
                  id="message"
                  textarea
                  label={CONTACT_PAGE.form.messageLabel}
                  placeholder={CONTACT_PAGE.form.messagePlaceholder}
                  value={form.message}
                  onChange={update('message')}
                  required
                />

                <div className={styles.submitRow}>
                  <Button type="submit" variant="primary" arrow={!sent} className={sent ? styles.btnSent : ''}>
                    {sent ? (
                      <span className={styles.sentInner}>
                        <IconCheck width="14" height="14" /> Sent — we’ll be in touch
                      </span>
                    ) : (
                      CONTACT_PAGE.form.submitLabel
                    )}
                  </Button>
                  <p className={styles.note}>{CONTACT_PAGE.form.note}</p>
                </div>
              </form>
            </Reveal>

            <Reveal delay={120} className={styles.aside}>
              <h3 className={styles.asideHead}>{CONTACT_PAGE.side.heading}</h3>

              <a href={`mailto:${CONTACT_PAGE.side.email}`} className={styles.email}>
                <span className={styles.emailIcon} aria-hidden="true">
                  <IconMail width="16" height="16" />
                </span>
                <span className={styles.emailContent}>
                  <span className={styles.emailLabel}>email</span>
                  <span className={styles.emailValue}>{CONTACT_PAGE.side.email}</span>
                </span>
              </a>

              <a href={`mailto:${CONTACT_PAGE.side.careersEmail}`} className={styles.email}>
                <span className={styles.emailIcon} aria-hidden="true">
                  <IconMail width="16" height="16" />
                </span>
                <span className={styles.emailContent}>
                  <span className={styles.emailLabel}>{CONTACT_PAGE.side.careersLabel}</span>
                  <span className={styles.emailValue}>{CONTACT_PAGE.side.careersEmail}</span>
                </span>
              </a>

              <a
                href={`https://wa.me/${CONTACT_PAGE.side.phoneRaw.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.email} ${styles.whatsappCard}`}
              >
                <span className={`${styles.emailIcon} ${styles.whatsappIcon}`} aria-hidden="true">
                  <IconWhatsApp width="16" height="16" />
                </span>
                <span className={styles.emailContent}>
                  <span className={styles.emailLabel}>{CONTACT_PAGE.side.whatsappLabel}</span>
                  <span className={styles.emailValue}>{CONTACT_PAGE.side.phone}</span>
                </span>
              </a>

              <p className={styles.availability}>{CONTACT_PAGE.side.availability}</p>

              <div className={styles.office}>
                <span className={styles.officePin} aria-hidden="true">
                  <IconPing width="14" height="14" />
                </span>
                <h4 className={styles.officeHead}>{CONTACT_PAGE.side.officeHeading}</h4>
                <address className={styles.officeAddress}>
                  {CONTACT_PAGE.side.officeLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
              </div>

              <div className={styles.next}>
                <h4 className={styles.nextHead}>{CONTACT_PAGE.side.nextHeading}</h4>
                <ol className={styles.nextList}>
                  {CONTACT_PAGE.side.next.map((step, i) => (
                    <li key={i} className={styles.nextItem}>
                      <span className={styles.nextNode} aria-hidden="true">
                        <span className={styles.nextNodeInner}>{`0${i + 1}`}</span>
                      </span>
                      <span className={styles.nextText}>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
