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
    <Link to="/" className={styles.logo} aria-label="Tekniik home">
      <BrandLogo size={34} />
    </Link>
  )
}

function IconSun(props) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.6v2.4M12 19v2.4M2.6 12H5M19 12h2.4M5.1 5.1l1.7 1.7M17.2 17.2l1.7 1.7M18.9 5.1l-1.7 1.7M6.8 17.2l-1.7 1.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconMoon(props) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20.2 13.6A8.4 8.4 0 0 1 10.4 3.8 8.4 8.4 0 1 0 20.2 13.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Nav({ themeMode = null, onToggleTheme }) {
  const scrolled = useScrolled(24)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${
          open ? styles.menuOpen : ''
        }`}
      >
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
                {/* text roll: label slides up, ink duplicate slides in */}
                <span className={styles.roll}>
                  <span className={styles.rollTop}>{link.label}</span>
                  <span className={styles.rollBottom} aria-hidden="true">
                    {link.label}
                  </span>
                </span>
                {/* active marker: dash with curved top corners */}
                <span className={styles.marker} aria-hidden="true" />
              </NavLink>
            ))}
          </nav>

          <div className={styles.right}>
            {themeMode && (
              <button
                type="button"
                className={`${styles.themeToggle} ${
                  themeMode === 'dark' ? styles.toggleDark : ''
                }`}
                onClick={onToggleTheme}
                aria-label={
                  themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
                }
              >
                {/* both icons stay mounted so the swap can rotate/crossfade */}
                <span className={styles.toggleIcons} aria-hidden="true">
                  <IconSun className={styles.iconSun} />
                  <IconMoon className={styles.iconMoon} />
                </span>
              </button>
            )}
            <Button to="/contact" variant="primary" className={styles.ctaBtn}>
              Get a Quote
            </Button>
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
        </div>
      </header>

      {/* The drawer is a SIBLING of <header>, never a child: the scrolled nav
          can carry a backdrop-filter, and a filtered ancestor becomes the
          containing block for position:fixed descendants (Safari/iOS honours
          this, Chrome does not) — inside the 68px header the drawer collapsed
          to zero height on iPhone and its links spilled over the page. */}
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
    </>
  )
}
