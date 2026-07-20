import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FOOTER } from '../data/content.js'
import {
  IconMail,
  IconLinkedIn,
  IconInstagram,
  IconXSocial,
  IconFlagIndia,
  IconFlagUK,
} from './Icon.jsx'
import BrandLogo from './BrandLogo.jsx'
import styles from './Footer.module.css'

const FLAGS = { chennai: IconFlagIndia, uk: IconFlagUK }

const SOCIAL_ICONS = { linkedin: IconLinkedIn, instagram: IconInstagram, x: IconXSocial }

export default function Footer() {
  const [officeKey, setOfficeKey] = useState(FOOTER.offices[0].key)
  const office = FOOTER.offices.find((o) => o.key === officeKey) ?? FOOTER.offices[0]
  const Flag = FLAGS[office.key]

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <BrandLogo size={30} />
          </div>
          <p className={styles.tag}>{FOOTER.tag}</p>
          <ul className={styles.contacts}>
            <li>
              <a href={`mailto:${FOOTER.email}`} className={styles.contactRow}>
                <IconMail width="16" height="16" aria-hidden="true" />
                <span>{FOOTER.email}</span>
              </a>
            </li>
          </ul>
          {/* social profile URLs pending — dead '#' links until content lands */}
          <div className={styles.socials}>
            {FOOTER.socials.map((s) => {
              const SocialIcon = SOCIAL_ICONS[s.key]
              return (
                <a
                  key={s.key}
                  href={s.href || '#'}
                  className={styles.socialLink}
                  aria-label={s.label}
                >
                  <SocialIcon width="16" height="16" />
                </a>
              )
            })}
          </div>
        </div>

        {FOOTER.cols.map((col) => (
          <div key={col.label}>
            <div className={styles.colHead}>{col.label}</div>
            <ul className={styles.colLinks}>
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.to.startsWith('/') ? (
                    <Link to={l.to}>{l.label}</Link>
                  ) : (
                    <a href={l.to}>{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* office addresses stay (user: revert); only narrative copy about
            where development happens is banned outside /contact */}
        <div>
          <div className={styles.colHead}>Location</div>
          <div className={styles.officeTabs} role="tablist" aria-label="Office locations">
            {FOOTER.offices.map((o) => (
              <button
                key={o.key}
                type="button"
                role="tab"
                aria-selected={o.key === office.key}
                className={`${styles.officeTab} ${o.key === office.key ? styles.officeTabActive : ''}`}
                onClick={() => setOfficeKey(o.key)}
              >
                {o.label}
              </button>
            ))}
          </div>
          <address className={styles.address} key={`addr-${office.key}`}>
            {office.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <p className={styles.region} key={`region-${office.key}`}>
            {Flag && (
              <span className={styles.flag} aria-hidden="true">
                <Flag />
              </span>
            )}
            <span className={styles.country}>{office.country}</span>
          </p>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>{FOOTER.copyright}</span>
        <span className={styles.made}>{FOOTER.madeWith}</span>
      </div>
    </footer>
  )
}
