import Hero from '../components/Hero.jsx'
import LogoStrip from '../components/LogoStrip.jsx'
import Problem from '../sections/Problem.jsx'
import Why from '../sections/Why.jsx'
import Process from '../sections/Process.jsx'
import Portfolio from '../sections/Portfolio.jsx'
import Testimonial from '../sections/Testimonial.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import { MARQUEE, FINAL_CTA } from '../data/content.js'

export default function Home() {
  return (
    <>
      <Hero />
      <LogoStrip items={MARQUEE} />
      <Problem />
      <Why />
      <Process />
      <Portfolio />
      <Testimonial />
      <FinalCta
        heading={FINAL_CTA.heading}
        sub={FINAL_CTA.sub}
        ctaLabel={FINAL_CTA.cta.label}
        ctaTo={FINAL_CTA.cta.to}
        emailNote={FINAL_CTA.emailNote}
        email={FINAL_CTA.email}
      />
    </>
  )
}
