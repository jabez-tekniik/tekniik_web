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
      {/* ghost wordmark — the studio name in plain grey Satoshi, edge to edge
          along the bottom edge (user, 2026-07-22: no outline, no accent).
          SVG rather than a text node because `textLength` makes it span the
          full width EXACTLY at every viewport, with no gap at either end; a
          font-size in vw can only ever approximate it. `lengthAdjust` is
          "spacing", NOT "spacingAndGlyphs" — the latter stretches the
          letterforms themselves and stops reading as Satoshi. Sits before the
          content so every relative block paints over it, and the viewBox
          min-y is negative for headroom because round caps (the O) overshoot
          the cap line and would clip against a min-y of 0. */}
      <svg
        className={styles.wordmark}
        viewBox="0 -5 1000 81"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
        focusable="false"
      >
        <text
          className={styles.wordmarkText}
          x="0"
          y="74"
          textLength="1000"
          lengthAdjust="spacing"
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
              {col.links.map((l) => {
                // links flagged newTab open in a fresh tab (the Business
                // Starter Pack page is a standalone pitch page)
                const ext = l.newTab
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {}
                return (
                  <li key={l.label}>
                    {l.to.startsWith('/') ? (
                      <Link to={l.to} {...ext}>
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.to} {...ext}>
                        {l.label}
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {/* Connect — the contact card and social row live in their own column
            beside Legal (user, 2026-07-22), not under the company blurb */}
        <div className={styles.connect}>
          <div className={styles.colHead}>Connect</div>
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
        </div>
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
