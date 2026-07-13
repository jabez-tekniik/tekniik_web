import { useLayoutEffect } from 'react'
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

export default function App() {
  const location = useLocation()

  // "Signal" aurora theme is scoped to the homepage only. Currently the
  // LIGHT aurora variant; the dark theme is retained in code (theme-dark.css)
  // for a future toggle — switch 'light' → 'dark' here to flip it back.
  // Set pre-paint so there is no theme flash on route change.
  useLayoutEffect(() => {
    const root = document.documentElement
    if (location.pathname === '/') root.setAttribute('data-theme', 'light')
    else root.removeAttribute('data-theme')
  }, [location.pathname])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />
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
