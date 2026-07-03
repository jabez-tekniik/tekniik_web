import { m } from 'framer-motion'
import Button from './Button.jsx'
import HeroBadge from './HeroBadge.jsx'
import GradientHeadline from './GradientHeadline.jsx'
import TrustStrip from './TrustStrip.jsx'
import ServiceShowcase from '../sections/ServiceShowcase.jsx'
import { AuroraShader, Reveal, useMagnetic } from '../motion/index.js'
import { HERO } from '../data/content.js'
import styles from './Hero.module.css'

export default function Hero() {
  const headlineFull = HERO.headline.join(' ')
  const splitAt = HERO.headline[0].length + 1
  const plainPrefix = headlineFull.slice(0, splitAt)
  const gradientSuffix = headlineFull.slice(splitAt)
  const { ref: magneticRef, style: magneticStyle, onMouseMove: magneticMove, onMouseLeave: magneticLeave } =
    useMagnetic({ strength: 0.35 })

  return (
    <section className={styles.hero}>
      <AuroraShader className={styles.aurora} />

      <div className={styles.ribbon} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div className={styles.badgeWrap}>
          <HeroBadge>Build with Tekniik · Web · Apps · AI</HeroBadge>
        </div>

        <GradientHeadline plainPrefix={plainPrefix} gradientSuffix={gradientSuffix} />

        <Reveal as="p" delay={0.1} className={styles.sub}>{HERO.sub}</Reveal>

        <div className={styles.actions}>
          <m.span
            ref={magneticRef}
            style={magneticStyle}
            onMouseMove={magneticMove}
            onMouseLeave={magneticLeave}
            className={styles.magnetic}
          >
            <Button to={HERO.primaryCta.to} variant="primary" arrow>
              {HERO.primaryCta.label}
            </Button>
          </m.span>
          <Button to={HERO.ghostCta.to} variant="ghost" arrow>
            {HERO.ghostCta.label}
          </Button>
        </div>

        <Reveal delay={0.2} className={styles.trustWrap}>
          <TrustStrip rating="4.9" count="50+ projects" region="UK · Remote" />
        </Reveal>

        <ServiceShowcase />
      </div>
    </section>
  )
}
