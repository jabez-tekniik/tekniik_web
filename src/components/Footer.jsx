import { Link } from 'react-router-dom'
import { FOOTER } from '../data/content.js'
import { IconMail, IconArrow, IconLinkedIn, IconInstagram, IconXSocial } from './Icon.jsx'
import BrandLogo from './BrandLogo.jsx'
import styles from './Footer.module.css'

const SOCIAL_ICONS = { linkedin: IconLinkedIn, instagram: IconInstagram, x: IconXSocial }

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.glowFloor} aria-hidden="true" />
      {/* ghost wordmark — the studio name edge to edge along the bottom, half
          submerged. SVG rather than a text node because `textLength` makes it
          span the full width EXACTLY at every viewport, with no gap at either
          end (user, 2026-07-22); a font-size in vw can only ever approximate
          it. Sits before the content so every relative block paints over it. */}
      <svg
        className={styles.wordmark}
        viewBox="0 0 1000 74"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
        focusable="false"
      >
        <text
          className={styles.wordmarkText}
          x="0"
          y="95"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
        >
          TEKNIIK AI STUDIO
        </text>
      </svg>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <BrandLogo size={30} />
          </div>
          <p className={styles.tagLead}>{FOOTER.tag}</p>
          {FOOTER.tagLines.map((line) => (
            <p key={line} className={styles.tag}>{line}</p>
          ))}
          {/* the mail line reads as a contact CARD, not another blurb line
              (2026-07-22, user: it blended into the company copy) */}
          <a href={`mailto:${FOOTER.email}`} className={styles.mailCard}>
            <span className={styles.mailIcon} aria-hidden="true">
              <IconMail width="16" height="16" />
            </span>
            <span className={styles.mailText}>
              <span className={styles.mailLabel}>Start a conversation</span>
              <span className={styles.mailValue}>{FOOTER.email}</span>
            </span>
            <IconArrow className={styles.mailArrow} width="16" height="16" aria-hidden="true" />
          </a>
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
      </div>
      {/* the divider sits on the inner row so it spans exactly the content
          width, never the gutters (2026-07-22, user) */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <span>{FOOTER.copyright}</span>
          <span className={styles.made}>
            {FOOTER.madeWith.pre}
            {/* emoji here on purpose (user, 2026-07-22) — the SVG glyph read
                as too flat for this line */}
            <span className={styles.heart} role="img" aria-label="love">
              ❤️
            </span>
            {FOOTER.madeWith.post}
          </span>
        </div>
      </div>
    </footer>
  )
}
