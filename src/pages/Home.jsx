import Hero from '../components/Hero.jsx'
import LogoStrip from '../components/LogoStrip.jsx'
import Problem from '../sections/Problem.jsx'
import ServiceShowcase from '../sections/ServiceShowcase.jsx'
import Why from '../sections/Why.jsx'
import Process from '../sections/Process.jsx'
import Portfolio from '../sections/Portfolio.jsx'
import Testimonial from '../sections/Testimonial.jsx'
import AiAccelerated from '../sections/AiAccelerated.jsx'
import MiniCta from '../components/MiniCta.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import { MARQUEE, FINAL_CTA, MINI_CTAS } from '../data/content.js'

/* Section order mirrors the homepage spec: Hero → Stats → Empathy →
   What We Engineer → mini-CTA → Why → Process → Our Work → mini-CTA →
   Testimonial → AI-Accelerated → Final CTA. */
export default function Home() {
  return (
    <>
      <Hero />
      <LogoStrip items={MARQUEE} />
      <Problem />
      <ServiceShowcase />
      <MiniCta {...MINI_CTAS.homeServices} />
      <Why />
      <Process />
      <Portfolio />
      <MiniCta {...MINI_CTAS.homeWork} />
      <Testimonial />
      <AiAccelerated />
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
