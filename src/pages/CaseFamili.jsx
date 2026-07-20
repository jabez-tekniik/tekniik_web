import CaseStudy from './CaseStudy.jsx'
import { CASE_FAMILI } from '../data/content.js'

/* StoryNest — family-archive platform whose headline features live on
   devices (voice-to-text story capture, photo scanning, pinch-to-zoom tree
   navigation), so the hero runs the MobileScene tablet + phone vignette;
   the AppScene metrics dashboard misreads a heritage archive. Copy
   verbatim from CASE_FAMILI. */
export default function CaseFamili() {
  const c = CASE_FAMILI
  return (
    <CaseStudy
      content={c}
      sceneKey="mobile"
      flowCols={3}
      groups={[
        { heading: c.archiveHeading, items: c.archive },
        { heading: c.bridgesHeading, items: c.bridges },
        { heading: c.appHeading, items: c.app },
      ]}
      quotes={c.quotes}
    />
  )
}
