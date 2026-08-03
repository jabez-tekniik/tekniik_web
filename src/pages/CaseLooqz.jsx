import CaseStudy from './CaseStudy.jsx'
import { CASE_LOOQZ } from '../data/content.js'

/* Glow & Co — mobile-first booking marketplace, so the hero runs the
   MobileScene vignette (same discipline pairing as /services/mobile-apps,
   which cross-links here). Copy verbatim from CASE_LOOQZ. */
export default function CaseLooqz() {
  const c = CASE_LOOQZ
  return (
    <CaseStudy
      content={c}
      slug="looqz"
      sceneKey="mobile"
      flowCols={3}
      groups={[
        { heading: c.customerHeading, items: c.customer },
        { heading: c.proHeading, items: c.pro },
      ]}
      quotes={[c.quote]}
    />
  )
}
