import CaseStudy from './CaseStudy.jsx'
import { CASE_AUTOSCREEN } from '../data/content.js'

/* ScreenFix — live dispatch platform, so the hero runs the AppScene
   dashboard vignette (the closest visual metaphor for on-demand job
   tracking). Copy verbatim from CASE_AUTOSCREEN. */
export default function CaseAutoScreen() {
  const c = CASE_AUTOSCREEN
  return (
    <CaseStudy
      content={c}
      sceneKey="app"
      flowCols={4}
      groups={[
        { heading: c.coreHeading, items: c.core },
        { heading: c.coverageHeading, items: c.coverage },
      ]}
      quotes={c.quotes}
    />
  )
}
