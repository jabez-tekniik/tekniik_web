import { useEffect, useRef } from 'react'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import useReducedMotion from '../hooks/useReducedMotion.js'
import styles from './FinalCta.module.css'

export default function FinalCta({
  heading,
  sub,
  ctaLabel = 'Get a Quote',
  ctaTo = '/contact',
  emailNote,
  email,
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    let raf = 0
    let pending = null
    const onMove = (e) => {
      pending = e
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = el.getBoundingClientRect()
        const x = ((pending.clientX - r.left) / r.width) * 100
        const y = ((pending.clientY - r.top) / r.height) * 100
        el.style.setProperty('--mx', `${x}%`)
        el.style.setProperty('--my', `${y}%`)
      })
    }
    const onLeave = () => {
      el.style.setProperty('--mx', '50%')
      el.style.setProperty('--my', '50%')
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [reduced])

  return (
    <section ref={ref} className={styles.section}>
      <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />
      <div className={styles.spotlight} aria-hidden="true" />

      <div className="container">
        <Reveal className={styles.wrap}>
          <h2 className={styles.heading}>
            {Array.isArray(heading)
              ? heading.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < heading.length - 1 && <br />}
                  </span>
                ))
              : heading}
          </h2>
          {sub && <p className={styles.sub}>{sub}</p>}
          <div className={styles.actions}>
            <Button to={ctaTo} variant="primary" arrow>
              {ctaLabel}
            </Button>
          </div>
          {email && (
            <p className={styles.email}>
              {emailNote && <span>{emailNote} </span>}
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
