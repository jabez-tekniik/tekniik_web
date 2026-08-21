import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Tag from '../components/Tag.jsx'
import { IconArrow } from '../components/Icon.jsx'
import { PORTFOLIO } from '../data/content.js'
import useReveal from '../hooks/useReveal.js'
import styles from './Portfolio.module.css'

/* Case-study links hidden for now (user, 2026-08-03) — flip to true to
   restore the "View case study" CTAs and the row/panel routing. */
const SHOW_CASE_LINKS = false

function LocationGlyph({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.6c-2.5 0-4.5 2-4.5 4.5 0 3.1 4.5 8.3 4.5 8.3s4.5-5.2 4.5-8.3c0-2.5-2-4.5-4.5-4.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.1" r="1.7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

/* One ledger row. On the desktop split it is just the oversized name line
   (num / node dot / title) and hovering or focusing it previews
   the project in the dossier panel; on touch and narrow viewports the
   .rowBody (desc, tags, result, CTA) is always shown inline instead.
   Routed projects render as Links to their case study. */
function Row({ item, index, active, onActivate }) {
  const interactive = SHOW_CASE_LINKS && !!item.route
  const num = String(index + 1).padStart(2, '0')
  /* Country label removed from the ledger rows (user, 2026-08-21) — the
     dossier panel on the right still shows it, as does /work. Restore by
     reinstating a .rowRegion span in .rowHead (its CSS is still in place).
     The country is item.tags[item.tags.length - 1]. */
  const pills = item.tags.slice(0, -1)

  const className = [
    styles.row,
    active ? styles.rowActive : '',
    interactive ? styles.rowLink : '',
  ]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <>
      <div className={styles.rowHead}>
        <span className={styles.rowNum}>{num}</span>
        <span className={styles.rowDot} aria-hidden="true" />
        <h3 className={styles.rowTitle}>{item.title}</h3>
        {interactive && <IconArrow className={styles.rowArrow} />}
      </div>

      <div className={styles.rowBody}>
        <p className={styles.rowDesc}>{item.desc}</p>
        <div className={styles.rowTags}>
          {pills.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <div className={styles.rowFoot}>
          <span className={styles.rowResult}>{item.result}</span>
          {interactive && (
            <span className={styles.rowCta}>
              View case study
              <IconArrow className={styles.ctaIcon} />
            </span>
          )}
        </div>
      </div>
    </>
  )

  if (interactive) {
    return (
      <Link
        to={item.route}
        className={className}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        aria-current={active ? 'true' : undefined}
      >
        {inner}
      </Link>
    )
  }
  return (
    <article
      className={className}
      tabIndex={0}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      aria-current={active ? 'true' : undefined}
    >
      {inner}
    </article>
  )
}

/* Portfolio — "The work ledger". The homepage OUR WORK section is an
   editorial project index: hairline ledger of oversized project names on
   the left, a sticky navy dossier panel on the right previewing whichever
   row is hovered/focused (keyed remount replays its entrance). The panel
   column deliberately uses useReveal directly (opacity-only fade) —
   wrapping it in <Reveal> would leave a translateY(0) transform on an
   ancestor and break position: sticky. */
export default function Portfolio() {
  const items = PORTFOLIO.items
  const [active, setActive] = useState(0)
  const [panelRef, panelSeen] = useReveal()

  const current = items[active]
  const num = String(active + 1).padStart(2, '0')
  const total = String(items.length).padStart(2, '0')

  return (
    <section id="work" className={`section ${styles.section}`}>
      <div className="container">
        <Reveal className={styles.intro}>
          <div className={styles.meta}>
            <span className={styles.metaIndex}>08</span>
            <span className={styles.metaEyebrow}>{PORTFOLIO.eyebrow}</span>
          </div>
          <h2 className={styles.heading}>
            {PORTFOLIO.heading}{' '}
            <span className={styles.headingAccent}>{PORTFOLIO.headingAccent}</span>
          </h2>
          <p className={styles.sub}>{PORTFOLIO.sub}</p>
        </Reveal>

        <div className={styles.ledger}>
          <div className={styles.index}>
            {items.map((item, i) => (
              <Reveal key={item.slug} delay={Math.min(i, 6) * 60} className={styles.rowWrap}>
                <Row
                  item={item}
                  index={i}
                  active={i === active}
                  onActivate={() => setActive(i)}
                />
              </Reveal>
            ))}
          </div>

          <div
            ref={panelRef}
            className={`${styles.panelCol} ${panelSeen ? styles.panelColIn : ''}`}
          >
            <div className={styles.panel} key={current.slug}>
              <span className={styles.panelRail} aria-hidden="true" />
              <span className={styles.panelGhost} aria-hidden="true">
                {num}
              </span>

              <div className={styles.panelTop}>
                <span className={styles.panelIndex}>
                  {num} / {total}
                </span>
                <span className={styles.panelRegion}>
                  <LocationGlyph className={styles.panelRegionIcon} />
                  {current.tags[current.tags.length - 1]}
                </span>
              </div>

              <h3 className={styles.panelTitle}>{current.title}</h3>
              <p className={styles.panelDesc}>{current.desc}</p>

              <div className={styles.panelTags}>
                {current.tags.slice(0, -1).map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>

              <div className={styles.panelFoot}>
                <span className={styles.panelResult}>{current.result}</span>
                {SHOW_CASE_LINKS && current.route && (
                  <Link to={current.route} className={styles.panelCta}>
                    View case study
                    <IconArrow className={styles.ctaIcon} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
