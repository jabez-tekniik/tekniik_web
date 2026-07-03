import { Link } from 'react-router-dom'
import { FOOTER } from '../data/content.js'
import { IconMail, IconWhatsApp } from './Icon.jsx'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <svg viewBox="0 0 28 28" className={styles.logoMark} aria-hidden="true">
              <rect x="0" y="0" width="28" height="28" rx="6" fill="var(--accent)" />
              <path
                d="M7 9.6h14M14 9.6V20"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
            <span className={styles.logoText}>tekniik</span>
          </div>
          <p className={styles.tag}>{FOOTER.tag}</p>
          <ul className={styles.contacts}>
            <li>
              <a href={`mailto:${FOOTER.email}`} className={styles.contactRow}>
                <IconMail width="16" height="16" aria-hidden="true" />
                <span>{FOOTER.email}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${FOOTER.careersEmail}`} className={styles.contactRow}>
                <IconMail width="16" height="16" aria-hidden="true" />
                <span>{FOOTER.careersEmail}</span>
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${FOOTER.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.contactRow} ${styles.whatsapp}`}
              >
                <IconWhatsApp width="16" height="16" aria-hidden="true" />
                <span>{FOOTER.whatsappLabel}</span>
              </a>
            </li>
          </ul>
        </div>

        {FOOTER.cols.map((col) => (
          <div key={col.label}>
            <div className={styles.colHead}>// {col.label}</div>
            <ul className={styles.colLinks}>
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <div className={styles.colHead}>// {FOOTER.officeHeading}</div>
          <address className={styles.address}>
            {FOOTER.officeLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <p className={styles.region}>
            <span className={styles.dot}>●</span> {FOOTER.region}
          </p>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>{FOOTER.copyright}</span>
        <div className={styles.legal}>
          {FOOTER.legal.map((l) => (
            <a key={l.label} href={l.to}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
