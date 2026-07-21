import { useState } from 'react'
import emailjs from '@emailjs/browser'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import FadeIn from '../motion/ink/FadeIn.jsx'
import HeroThread from '../components/HeroThread.jsx'
import { getLenis } from '../motion/SmoothScroll.jsx'
import { useScrollProgressInk } from '../motion/ink/index.js'
import { IconCheck, IconMail, IconPhone, IconReply } from '../components/Icon.jsx'
import { CONTACT_PAGE } from '../data/content.js'
import { EMAILJS } from '../config/emailjs.js'
import styles from './Contact.module.css'

/* "What happens next" step glyphs — read / reply / call / no strings.
   IconHandshake was tried for step 4 and is mush at 20px — keep the
   simple check. */
const STEP_ICONS = [IconMail, IconReply, IconPhone, IconCheck]

/* Contact — "The open line" (Deep Ink).
   Lean poster hero with a live status strip, then the working spread:
   ledger form left (teal underline draws on focus), direct-lines ledger
   right. "What happens next?" closes as a compact brand-navy
   band: four hairline-split columns (icon chip / mono stamp / Satoshi
   statement) — chips fill teal bottom-up in sequence on scroll. */

/* One rule per field. Messages stay in the site's voice — a nudge, not a
   scolding — and are announced politely so screen readers pick them up
   without hijacking focus. */
const RULES = {
  name: (v) => (v.trim().length < 2 ? 'Please tell us your name.' : ''),
  email: (v) =>
    !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) ? 'Enter a valid email address.' : '',
  message: (v) => (v.trim().length < 10 ? 'A sentence or two about your project.' : ''),
}

const validate = (form) =>
  Object.entries(RULES).reduce((acc, [key, rule]) => {
    const message = rule(form[key])
    if (message) acc[key] = message
    return acc
  }, {})

function Field({ id, label, type = 'text', textarea, placeholder, value, onChange, onBlur, error, required }) {
  const inputProps = {
    id,
    name: id,
    placeholder,
    value,
    onChange,
    onBlur,
    required,
    className: styles.input,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  }
  return (
    <div className={`${styles.field} ${error ? styles.fieldError : ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {/* the rail is positioned against the CONTROL, not the field — an
          error message below would otherwise push it off the input's edge */}
      <span className={styles.control}>
        {textarea ? <textarea {...inputProps} rows={5} /> : <input type={type} {...inputProps} />}
        <span className={styles.underline} aria-hidden="true" />
      </span>
      <span id={`${id}-error`} className={styles.error} role="alert">
        {error}
      </span>
    </div>
  )
}

/* Sent panel — the form's reward. Circle draws, check draws inside it, then
   the copy lifts in. Pure CSS keyframes; the reduced-motion block at the
   bottom of the module renders the finished state instantly. */
function SentPanel({ onReset }) {
  return (
    <div className={styles.sent} role="status" aria-live="polite">
      <span className={styles.sentBloom} aria-hidden="true" />
      <span className={styles.sentMark} aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <circle className={styles.markRing} cx="32" cy="32" r="29" strokeWidth="2" />
          <path
            className={styles.markCheck}
            d="M20 33.5l8.5 8.5L44 24"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p className={styles.sentStamp}>Message sent</p>
      <h2 className={styles.sentHeading}>It’s with us.</h2>
      <p className={styles.sentCopy}>
        A real person reads every message. You’ll hear back within one working day, usually
        sooner.
      </p>
      <button type="button" className={styles.sentAgain} onClick={onReset}>
        Send another message
      </button>
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
  const [errors, setErrors] = useState({})
  /* 'idle' | 'sending' | 'sent' | 'error' — one state, no boolean soup */
  const [status, setStatus] = useState('idle')

  /* A field only re-validates once it has already failed — errors clear as
     you fix them, but typing a fresh field never scolds you mid-word. */
  const update = (key) => (e) => {
    const value = e.target.value
    setForm((s) => ({ ...s, [key]: value }))
    if (errors[key]) setErrors((s) => ({ ...s, [key]: RULES[key](value) || undefined }))
  }

  const blur = (key) => (e) => {
    const message = RULES[key](e.target.value)
    if (message) setErrors((s) => ({ ...s, [key]: message }))
  }

  /* hero CTA → the form spread. Lenis owns the scroll when active, so route
     through it (native scrollIntoView gets cancelled by its rAF loop);
     mirrors the homepage Hero / Services index. */
  const scrollToForm = (e) => {
    const el = document.getElementById('contact-form')
    if (!el) return
    e.preventDefault()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = getLenis()
    if (lenis && !reduced) lenis.scrollTo(el, { offset: -84 })
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    const found = validate(form)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
      return
    }

    setStatus('sending')
    try {
      /* Template variables are sent under both the plain and the `from_*`
         naming so either EmailJS template convention resolves. */
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          name: form.name,
          email: form.email,
          message: form.message,
          from_name: form.name,
          from_email: form.email,
          reply_to: form.email,
        },
        { publicKey: EMAILJS.publicKey },
      )
      setForm({ name: '', email: '', message: '' })
      setStatus('sent')
    } catch (err) {
      console.error('EmailJS send failed', err)
      setStatus('error')
    }
  }

  const resetForm = () => {
    setErrors({})
    setStatus('idle')
  }

  /* columns ignite left→right as the band scrolls through: each icon
     chip fills bottom-up with teal (scaleY tracks local progress), then
     the glyph flips dark and stamp/statement brighten. Reduced motion →
     the hook fires once with p=1, everything renders filled + lit. */
  const total = side.next.length
  const nextRef = useScrollProgressInk((p, grid) => {
    grid.querySelectorAll('[data-step]').forEach((li, i) => {
      const local = Math.min(1, Math.max(0, p * total - i))
      const fill = li.querySelector('[data-fill]')
      if (fill) fill.style.transform = `scaleY(${local})`
      li.classList.toggle(styles.stepLit, local > 0.55)
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
            <span className={styles.metaRight}>Real replies / one working day</span>
          </Reveal>

          <div className={styles.heroSplit}>
            <div>
              <h1 className={styles.headline}>
                <FadeIn text={line1} as="span" className={styles.hLine} />
                <FadeIn
                  text={line2}
                  as="span"
                  delay={140}
                  className={`${styles.hLine} ${styles.hAccent}`}
                />
              </h1>
              <Reveal delay={280}>
                <p className={styles.sub}>{CONTACT_PAGE.sub}</p>
              </Reveal>
              <Reveal delay={360} className={styles.heroCta}>
                <Button href="#contact-form" variant="primary" arrow onClick={scrollToForm}>
                  Send us a message
                </Button>
              </Reveal>
            </div>

            <Reveal delay={200} className={styles.heroVisual}>
              <HeroThread />
            </Reveal>
          </div>

          {/* status strip — availability ledger: mono label over a confident
             Satoshi value (the About-signals hierarchy), staggered in */}
          <div className={styles.status}>
            <Reveal className={styles.statusCell} delay={200}>
              <span className={styles.statusLabel}>Availability</span>
              <span className={styles.statusValue}>
                <span className={styles.liveDot} aria-hidden="true" />
                Open for new projects
              </span>
            </Reveal>
            <Reveal className={styles.statusCell} delay={280}>
              <span className={styles.statusLabel}>First response</span>
              <span className={styles.statusValue}>Within one working day</span>
            </Reveal>
            <Reveal className={styles.statusCell} delay={360}>
              <span className={styles.statusLabel}>Discovery call</span>
              <span className={styles.statusValue}>30 minutes, no obligation</span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* —— The working spread: form | direct lines ————————— */}
      <section id="contact-form" className={styles.spread}>
        <div className="container">
          <div className={styles.grid}>
            <Reveal className={styles.formCell}>
              {status === 'sent' ? (
                <SentPanel onReset={resetForm} />
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <Field
                    id="name"
                    label={formCopy.nameLabel}
                    placeholder={formCopy.namePlaceholder}
                    value={form.name}
                    onChange={update('name')}
                    onBlur={blur('name')}
                    error={errors.name}
                    required
                  />
                  <Field
                    id="email"
                    type="email"
                    label={formCopy.emailLabel}
                    placeholder={formCopy.emailPlaceholder}
                    value={form.email}
                    onChange={update('email')}
                    onBlur={blur('email')}
                    error={errors.email}
                    required
                  />
                  <Field
                    id="message"
                    textarea
                    label={formCopy.messageLabel}
                    placeholder={formCopy.messagePlaceholder}
                    value={form.message}
                    onChange={update('message')}
                    onBlur={blur('message')}
                    error={errors.message}
                    required
                  />

                  <div className={styles.submitRow}>
                    <Button
                      type="submit"
                      variant="primary"
                      arrow={status !== 'sending'}
                      disabled={status === 'sending'}
                      aria-busy={status === 'sending'}
                    >
                      {status === 'sending' ? (
                        <span className={styles.sendingInner}>
                          <span className={styles.spinner} aria-hidden="true" />
                          Sending
                        </span>
                      ) : (
                        formCopy.submitLabel
                      )}
                    </Button>
                    <p className={styles.note}>{formCopy.note}</p>
                  </div>

                  {status === 'error' && (
                    <p className={styles.sendError} role="alert">
                      That didn’t go through. Try again, or email us directly at{' '}
                      <a href={`mailto:${side.email}`}>{side.email}</a>.
                    </p>
                  )}
                </form>
              )}
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
            </Reveal>
          </div>
        </div>
      </section>

      {/* —— What happens next — navy band, four igniting columns ——— */}
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
            {side.next.map((step, i) => {
              const Glyph = STEP_ICONS[i % STEP_ICONS.length]
              return (
                <li key={step.text} className={styles.nextStep} data-step="">
                  <Reveal delay={i * 90} className={styles.stepCell}>
                    <span className={styles.stepChip} aria-hidden="true">
                      <span className={styles.chipFill} data-fill="" />
                      <Glyph className={styles.chipIcon} />
                    </span>
                    <span className={styles.stepStamp}>{step.stamp}</span>
                    <p className={styles.stepText}>{step.text}</p>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </div>
      </section>
    </>
  )
}
