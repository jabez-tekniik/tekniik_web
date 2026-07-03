import Button from './Button.jsx'
import HeroBadge from './HeroBadge.jsx'
import GradientHeadline from './GradientHeadline.jsx'
import TrustStrip from './TrustStrip.jsx'
import ServiceShowcase from '../sections/ServiceShowcase.jsx'
import { HERO } from '../data/content.js'
import styles from './Hero.module.css'

export default function Hero() {
  const headlineFull = HERO.headline.join(' ')
  const splitAt = HERO.headline[0].length + 1
  const plainPrefix = headlineFull.slice(0, splitAt)
  const gradientSuffix = headlineFull.slice(splitAt)

  return (
    <section className={styles.hero}>
      <div className={styles.aurora} aria-hidden="true">
        <span className={`${styles.bloom} ${styles.bloomA}`} />
        <span className={`${styles.bloom} ${styles.bloomB}`} />
        <span className={`${styles.bloom} ${styles.bloomC}`} />
      </div>

      <div className={styles.ribbon} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.badgeWrap}>
          <HeroBadge>Build with Tekniik · Web · Apps · AI</HeroBadge>
        </div>

        <GradientHeadline plainPrefix={plainPrefix} gradientSuffix={gradientSuffix} />

        <p className={styles.sub}>{HERO.sub}</p>

        <div className={styles.actions}>
          <Button to={HERO.primaryCta.to} variant="primary" arrow>
            {HERO.primaryCta.label}
          </Button>
          <Button to={HERO.ghostCta.to} variant="ghost" arrow>
            {HERO.ghostCta.label}
          </Button>
        </div>

        <div className={styles.trustWrap}>
          <TrustStrip rating="4.9" count="50+ projects" region="UK · Remote" />
        </div>

        <ServiceShowcase />
      </div>
    </section>
  )
}
