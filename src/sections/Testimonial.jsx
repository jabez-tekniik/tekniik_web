import { useEffect, useRef, useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import FadeIn from '../motion/ink/FadeIn.jsx'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { TESTIMONIALS } from '../data/content.js'
import styles from './Testimonial.module.css'

const ROTATE_MS = 5000
const EXIT_MS = 300

/* "The word" — asymmetric editorial spread: a left rail carrying an
   oversized teal quote glyph + attribution, the quote itself set huge
   on the right. One vertical hairline divides them; nothing is boxed.
   Quotes rotate: auto-advance every 5s (paused on focus-within + offscreen,
   never under reduced motion — NO hover pause: the cursor parks on the
   section after scrolling and froze it); the outgoing quote fades up while the
   incoming one fades in (the FadeIn entrance runs only on the very
   first scroll-in — replaying it per swap read as a glitch). Hidden sizer
   copies of every quote lock the section height to the tallest. */
export default function Testimonial() {
  const [index, setIndex] = useState(0)
  const [rotated, setRotated] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const reduced = useReducedMotion()
  const sectionRef = useRef(null)
  const swapRef = useRef(null)

  const goTo = (next) => {
    if (leaving || next === index) return
    if (reduced) {
      setIndex(next)
      setRotated(true)
      return
    }
    setLeaving(true)
    swapRef.current = setTimeout(() => {
      setIndex(next)
      setRotated(true)
      setLeaving(false)
    }, EXIT_MS)
  }

  useEffect(() => () => clearTimeout(swapRef.current), [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduced || paused || !inView) return undefined
    const timer = setTimeout(() => {
      setLeaving(true)
      swapRef.current = setTimeout(() => {
        setIndex((i) => (i + 1) % TESTIMONIALS.length)
        setRotated(true)
        setLeaving(false)
      }, EXIT_MS)
    }, ROTATE_MS)
    return () => clearTimeout(timer)
  }, [index, paused, inView, reduced])

  const active = TESTIMONIALS[index]
  const leavingCls = leaving ? ` ${styles.leaving}` : ''

  return (
    <section
      ref={sectionRef}
      className={`section ${styles.section}`}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
      }}
    >
      <div className="container">
        <div className={styles.spread}>
          <Reveal className={styles.rail}>
            <span className={styles.glyph} aria-hidden="true">
              &ldquo;
            </span>
            <div className={styles.railFoot}>
              <div key={index} className={styles.attr + leavingCls}>
                <strong className={styles.name}>{active.name}</strong>
                <span className={styles.role}>{active.role}</span>
              </div>
              <div className={styles.nav} aria-label="Testimonials">
                {TESTIMONIALS.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    className={i === index ? `${styles.navBtn} ${styles.navActive}` : styles.navBtn}
                    aria-label={`Testimonial ${i + 1} of ${TESTIMONIALS.length}: ${t.name}`}
                    aria-current={i === index}
                    onClick={() => goTo(i)}
                  >
                    <span className={styles.navBar} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className={styles.quoteStack}>
            {TESTIMONIALS.map((t) => (
              <blockquote
                key={t.name}
                className={`${styles.quote} ${styles.sizer}`}
                aria-hidden="true"
              >
                {t.text}
              </blockquote>
            ))}
            <div key={`live-${index}`} className={styles.live + leavingCls}>
              {rotated ? (
                <blockquote className={`${styles.quote} ${styles.quoteIn}`}>
                  {active.text}
                </blockquote>
              ) : (
                <FadeIn
                  text={active.text}
                  as="blockquote"
                  className={styles.quote}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
