import { useEffect, useLayoutEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import CaseLooqz from './pages/CaseLooqz.jsx'
import CaseAutoScreen from './pages/CaseAutoScreen.jsx'
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
  const onHome = location.pathname === '/'

  // "Deep Ink" brand themes (theme-ink.css) are scoped to the homepage:
  // ink-light (default) or ink (dark), toggled from the Nav and persisted.
  // Other routes keep the base light theme. Set pre-paint — no theme flash.
  const [mode, setMode] = useState(readStoredMode)

  useLayoutEffect(() => {
    const root = document.documentElement
    if (onHome) root.setAttribute('data-theme', mode === 'dark' ? 'ink' : 'ink-light')
    else root.removeAttribute('data-theme')
  }, [onHome, mode])

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
        themeMode={onHome ? mode : null}
        onToggleTheme={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
      />
      <ScrollToTop />
      <main id="main">
        <div key={location.pathname} className="route">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/case/looqz" element={<CaseLooqz />} />
            <Route path="/case/autoscreen" element={<CaseAutoScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  )
}
