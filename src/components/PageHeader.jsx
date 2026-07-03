import { Link } from 'react-router-dom'
import Eyebrow from './Eyebrow.jsx'
import { IconArrow } from './Icon.jsx'
import styles from './PageHeader.module.css'

export default function PageHeader({
  eyebrow,
  heading,
  sub,
  align = 'left',
  back,
  media,
  variant,
}) {
  const hasMedia = Boolean(media?.src)
  const isFullBleed = hasMedia && variant === 'full-bleed'
  const layout = isFullBleed
    ? styles.fullBleed
    : hasMedia
      ? styles.split
      : styles[align]

  return (
    <header className={`${styles.header} ${layout}`}>
      {isFullBleed ? (
        <div className={styles.bleedMedia} aria-hidden="true">
          <img
            src={media.src}
            alt=""
            width={media.width || 1920}
            height={media.height || 1080}
            loading="eager"
            decoding="async"
            className={styles.bleedImg}
          />
          <span className={styles.bleedScrim} />
        </div>
      ) : (
        <div className={styles.aurora} aria-hidden="true">
          <span className={`${styles.bloom} ${styles.bloomA}`} />
          <span className={`${styles.bloom} ${styles.bloomB}`} />
        </div>
      )}
      <div className="container">
        {back && (
          <Link to={back.to} className={styles.back}>
            <IconArrow style={{ transform: 'rotate(180deg)' }} width="14" height="14" />
            {back.label}
          </Link>
        )}
        <div className={styles.row}>
          <div className={styles.inner}>
            {eyebrow && <Eyebrow tone="muted">{eyebrow}</Eyebrow>}
            <h1 className={styles.heading}>
              {Array.isArray(heading)
                ? heading.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < heading.length - 1 && <br />}
                    </span>
                  ))
                : heading}
            </h1>
            {sub && <p className={styles.sub}>{sub}</p>}
          </div>

          {hasMedia && !isFullBleed && (
            <div className={styles.media} aria-hidden={media.alt ? undefined : 'true'}>
              <div className={styles.mediaFrame}>
                <img
                  src={media.src}
                  alt={media.alt || ''}
                  width={media.width || 1280}
                  height={media.height || 1600}
                  loading="eager"
                  decoding="async"
                  className={styles.mediaImg}
                />
                <span className={styles.mediaShine} aria-hidden="true" />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
