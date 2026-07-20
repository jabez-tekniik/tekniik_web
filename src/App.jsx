import { useEffect, useLayoutEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import ServiceDetail from './pages/ServiceDetail.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import CaseLooqz from './pages/CaseLooqz.jsx'
import CaseAutoScreen from './pages/CaseAutoScreen.jsx'
import CaseFamili from './pages/CaseFamili.jsx'
import Work from './pages/Work.jsx'
import Support from './pages/Support.jsx'
import WebsitePackage from './pages/WebsitePackage.jsx'
import LegalPage from './pages/Legal.jsx'
import NotFound from './pages/NotFound.jsx'

const MODE_KEY = 'tekniik-ink-mode'

function readStoredMode() {
  try {
    const v = localStorage.getItem(MODE_KEY)
    return v === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export default function App() {
  const location = useLocation()

  // Every route runs the "Deep Ink" brand themes (theme-ink.css):
  // ink-light (default) or ink (dark), toggled from the Nav and persisted.
  // The old per-route INK_ROUTES gate is gone — the case-study redesign
  // (2026-07-20) inked the last base-theme pages. Set pre-paint, no flash.
  const [mode, setMode] = useState(readStoredMode)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', mode === 'dark' ? 'ink' : 'ink-light')
  }, [mode])

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, mode)
    } catch {
      /* private mode — theme simply won't persist */
    }
  }, [mode])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav
        themeMode={mode}
        onToggleTheme={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
      />
      <ScrollToTop />
      <main id="main">
        <div key={location.pathname} className="route">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/case/looqz" element={<CaseLooqz />} />
            <Route path="/case/autoscreen" element={<CaseAutoScreen />} />
            <Route path="/case/famili" element={<CaseFamili />} />
            <Route path="/work" element={<Work />} />
            <Route path="/support" element={<Support />} />
            <Route path="/website-package" element={<WebsitePackage />} />
            <Route path="/privacy-policy" element={<LegalPage page="privacy-policy" />} />
            <Route path="/terms-of-service" element={<LegalPage page="terms-of-service" />} />
            <Route path="/cookie-policy" element={<LegalPage page="cookie-policy" />} />
            <Route path="/gdpr" element={<LegalPage page="gdpr" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  )
}
