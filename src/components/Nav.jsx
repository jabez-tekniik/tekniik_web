import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import useScrolled from '../hooks/useScrolled.js'
import Button from './Button.jsx'
import { IconMenu, IconClose } from './Icon.jsx'
import BrandLogo from './BrandLogo.jsx'
import { NAV_LINKS } from '../data/content.js'
import styles from './Nav.module.css'

function Logo() {
  return (
    <Link to="/" className={styles.logo} aria-label="Tekniik — home">
      <BrandLogo size={24} />
    </Link>
  )
}

export default function Nav() {
  const scrolled = useScrolled(24)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Logo />
        <nav className={styles.links} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.cta}>
          <Button to="/contact" variant="primary" className={styles.ctaBtn}>
            Get a Quote
          </Button>
        </div>
        <button
          type="button"
          className={styles.hamburger}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`${styles.mobile} ${open ? styles.mobileOpen : ''}`}
        aria-hidden={!open}
      >
        <nav className={styles.mobileLinks} aria-label="Mobile">
          {NAV_LINKS.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.mobileActive : ''}`
              }
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <span className={styles.mobileNum}>0{i + 1}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className={styles.mobileFooter}>
          <Button to="/contact" variant="primary" onClick={() => setOpen(false)}>
            Get a Quote
          </Button>
          <a href="mailto:hello@tekniik.ai" className={styles.mobileEmail}>
            hello@tekniik.ai
          </a>
        </div>
      </div>
    </header>
  )
}
