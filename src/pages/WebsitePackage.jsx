import { useEffect, useMemo, useRef, useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import FinalCta from '../sections/FinalCta.jsx'
import FadeIn from '../motion/ink/FadeIn.jsx'
import HeroPackageSite from '../components/HeroPackageSite.jsx'
import useReducedMotion from '../hooks/useReducedMotion.js'
import useMediaQuery from '../hooks/useMediaQuery.js'
import useCurrency from '../hooks/useCurrency.js'
import moneyFor from '../config/pricing.js'
import { useScrollProgressInk } from '../motion/ink/index.js'
import {
  IconWeb,
  IconServer,
  IconMail,
  IconSearch,
  IconShieldCheck,
  IconStore,
  IconRefresh,
  IconBriefcase,
  IconTrendUp,
  IconPen,
  IconCode,
  IconDeploy,
  IconCheck,
  IconArrow,
  IconClock,
} from '../components/Icon.jsx'
import styles from './WebsitePackage.module.css'

/* Website Package — conversion landing page (/website-package).
   Built to work as a STANDALONE page (sent directly to prospects) as well
   as linked from the footer Quick Links (user request 2026-08-03 —
   overrides the spec's "standalone only" note). Copy from
   content/tekniik-website-package-spec.md, except the annotated
   deviations (hero price comparison, "all-inclusive" rephrase, the
   outcome-hook sub).

   THREE PACKAGES (user 2026-08-04): the page sells Starter / Growth /
   Professional from the spec's Pricing Tiers section, rendered as a
   COMPARISON CHART. Every other section is written GENERICALLY about the
   service (no single-tier numbers) — the chart is the only place
   tier-specific figures live. "+ VAT" is gone from every surface on this
   page (user 2026-08-04).

   PRICES ARE PER-VISITOR (user 2026-08-04, spec §"Currency &
   Geo-Detection"): the visitor's own currency where we price in one,
   GBP everywhere else. `config/currency.js` decides which currency,
   `config/pricing.js` decides the numbers, and every figure on the page
   comes from that one money object via `buildPage(m)` — never hardcode a
   price in the copy or in a child component, or one surface will
   disagree with the rest. The browser tab title follows the same money
   object through `TitleManager`.

   Signature devices: hero = HeroPackageSite (the site-going-live
   vignette) + the price-comparison value strip with the turnaround
   pill; Packages = the TIER CHART (real <table> on desktop, stacked
   tier cards ≤900px); Why it matters = the PACKAGE EXPLORER, a tabbed
   navy dossier whose animated mini-scene swaps per group (auto-advances
   while in view until the user picks a tab); Who this is
   for = full-width ledger rows with ghost numerals + hover ignition;
   the navy process band with a hint of teal, glass step cards +
   igniting step chips; full-width two-column FAQ cards with smooth
   grid-rows open/close; FinalCta crescendo with the lighter-navy tint
   variant. */

/* —— the copy, resolved against one currency's money object ————
   `m` comes from `config/pricing.js` (moneyFor) and holds every
   currency-dependent string the page can show: the three tier prices,
   the hero's "From X", the agency anchor, the renewal range, the
   "Prices shown in X" note and the browser tab title. Nothing here
   composes a figure of its own — if a new price is needed, it goes in
   pricing.js and arrives on `m`.

   "+ VAT" stays OFF in every currency — the spec asks for it on GBP,
   but the user stripped VAT from every surface of this page on
   2026-08-04 and that call outranks the spec here. */
function buildPage(m) {
  return {
    hero: {
      /* product name (2026-08-04): the page now sells THREE packages, so
         the umbrella brand can't be "Business Starter Pack" any more —
         Starter is one of the three tiers. The eyebrow carries the tier
         names as meta after the separator dot; the route is unchanged. */
      eyebrow: 'Business Website Packages',
      eyebrowMeta: 'Starter · Growth · Professional',
      /* one sentence with a verb in front and the price inside it (user
         2026-08-04 framing, then tightened by the user to this wording) —
         it states what we do instead of describing the product. Highlights:
         the PRICE takes the light primary (teal), "websites" the dark
         primary (navy) — swapped round from the original pairing so the
         loudest treatment lands on the figure. Keep it SHORT: the shared
         hero type size holds three lines in this column, no more. */
      headline: {
        pre: 'We build business ',
        navy: 'websites',
        mid: ' from ',
        price: m.starter,
        post: '.',
      },
      /* spec deviation (user 2026-08-03, rewritten same day): leads with the
         outcome hooks ("online presence", "drive more sales") instead of the
         feature list; "fixed price" is banned wording on this page */
      sub: 'Your entire online presence, built to drive more sales. A professionally designed website with domain, hosting and email, all handled for you. Three packages, one all-inclusive price each. No surprises.',
      cta: 'Get Started',
      price: m.from,
      /* competitive anchor — what a comparable 5-page build typically costs
         from an agency (2026 market guides: £2,500-£5,000+, $3,000-$10,000+);
         the figure itself is per-currency and comes from pricing.js.
         The label names the 5-page site explicitly so the anchor stays
         like-for-like against Starter, not against our own top tier. */
      compare: {
        /* labels stay SHORT — longer ones wrap the turnaround pill onto a
           second row and the strip loses its single-line rhythm */
        wasLabel: 'Agency quote, 5 pages',
        was: m.agencyWas,
        nowLabel: 'We start at',
        now: m.starter,
        turnaround: 'Live in 2-3 weeks',
      },
    },
    /* —— the three packages (spec §02 Pricing Tiers) ——————
       Rendered as a chart: rows are compared line by line, so every value
       is either true (included), false (not in this tier) or a string.
       The row order inside each group runs shared items first. This is
       the ONLY inventory of what you get — the explorer below argues the
       case instead of repeating it. */
    packages: {
      eyebrow: '/ Packages',
      /* the tier tags are a ladder of ambition (getting online → standing
         out → competing seriously), so the heading names that ladder
         instead of counting the packages (user 2026-08-04: the earlier
         "Three packages. One clear price each." was flat) */
      heading: 'Choose your ambition. We handle the rest.',
      headingAccent: 'We handle the rest.',
      note: 'Every package includes the website, domain, hosting, business email and post-launch support. Nothing hidden, nothing billed later.',
      /* the chart's top-left corner cell */
      chartLabel: "What's included",
      chartMeta: 'Compare line by line',
      footNote: 'Not sure which one? Tell us your goal and we will recommend one honestly.',
      tiers: [
        {
          name: 'Starter',
          tag: 'For getting online',
          price: m.starter,
          desc: 'A clean, professional website with everything you need to establish your online presence.',
          cta: 'Get Started',
        },
        {
          name: 'Growth',
          tag: 'For standing out',
          price: m.growth,
          badge: 'Most Popular',
          desc: 'A custom-designed website built to generate leads and grow your business.',
          cta: 'Get Started',
        },
        {
          name: 'Professional',
          tag: 'For competing seriously',
          price: m.professional,
          desc: 'A fully bespoke website with advanced functionality and hands-on support.',
          cta: 'Get Started',
        },
      ],
      matrix: [
        {
          group: 'Your website',
          rows: [
            { label: 'Professionally designed, mobile-responsive website', v: [true, true, true] },
            { label: 'Pages included', v: ['Up to 5', 'Up to 10', 'Up to 15'] },
            {
              label: 'Design approach',
              v: ['Proven layout', 'Custom design', 'Fully bespoke'],
            },
            { label: 'Contact form', v: [true, true, true] },
            /* the spec's "Google Maps and social media links" row was cut
               from the chart (user 2026-08-04) — too small a line to earn
               a row; the explorer still mentions it */
            { label: 'Blog or news section', v: [false, true, true] },
            { label: 'WhatsApp or live chat integration', v: [false, true, true] },
            {
              label: 'Booking system or simple e-commerce (up to 20 products)',
              v: [false, false, true],
            },
            { label: 'Revision rounds', v: ['2 rounds', '3 rounds', 'Unlimited'] },
          ],
        },
        {
          group: 'Your domain & hosting',
          rows: [
            {
              /* the spec's .co.uk wording is a UK promise. Sterling is
                 shown to the UK only, so it keeps that line; the dollar
                 list goes to the whole rest of the world (not just the
                 US), which is why the alternative is TLD-neutral rather
                 than ".com" (2026-08-04) */
              label: m.code === 'GBP' ? 'One .co.uk or .uk domain for 1 year' : 'One domain name for 1 year',
              v: [true, true, true],
            },
            { label: 'Managed website hosting for 1 year', v: [true, true, true] },
            { label: 'Free SSL certificate', v: [true, true, true] },
            { label: 'Daily or scheduled backups', v: [true, true, true] },
            { label: 'Speed optimisation', v: [false, true, true] },
          ],
        },
        {
          group: 'Your email',
          rows: [
            { label: 'Business email inboxes', v: ['5 inboxes', '10 inboxes', '10 inboxes'] },
            { label: 'Storage per mailbox', v: ['10GB', '10GB', '10GB'] },
          ],
        },
        {
          group: 'Your visibility',
          rows: [
            { label: 'On-page SEO', v: ['Basic', 'Advanced', 'Advanced'] },
            { label: 'Keyword research and meta optimisation', v: [false, true, true] },
            { label: 'Google Analytics and Search Console setup', v: [true, true, true] },
            { label: 'Social media integration', v: [false, true, true] },
            { label: 'Google Business Profile setup', v: [false, false, true] },
            { label: 'Performance reporting', v: [false, false, 'First 3 months'] },
          ],
        },
        {
          group: 'Your peace of mind',
          rows: [
            {
              label: 'Post-launch technical support',
              /* 60 / 90 / 120 (user 2026-08-04) — a deliberate deviation from
                 the spec's 30 / 60 / 90; every support window moved up one
                 step, so Starter now starts where Growth used to */
              v: ['60 days', '90 days', '120 days'],
            },
            { label: 'Content guidance (we help structure your copy)', v: [false, true, true] },
            { label: 'Content writing for key pages', v: [false, false, 'Up to 5 pages'] },
            { label: 'CMS training session (30 minutes)', v: [false, false, true] },
            { label: 'Priority support', v: [false, false, true] },
          ],
        },
      ],
    },
    /* The explorer shares NOTHING with the chart (user 2026-08-04, twice:
       first the inclusions were re-listed, then the same five group
       headings were reused with new lines — "the list also should change,
       same content should not be there"). It is now the argument, not the
       inventory: THREE groups on why a website earns its keep at all, then
       TWO on why we are the ones to build it. Nothing here names a
       deliverable the chart already lists, and no line quotes a tier
       figure. Tab order drives WHY_ICONS / SCENES, so those two arrays
       must be reordered with these groups, never GROUP_ICONS (that one
       belongs to the chart). */
    included: {
      eyebrow: '/ Why it matters',
      /* the accent tail is forced onto its own line by
         .inclHead .hlDeep { display: block }: line 1 is the case for a
         website, line 2 the case for us, which is exactly the two halves
         the tabs below split into */
      heading: 'Why a website pays for itself. And why we are the ones to build it.',
      /* heading accents (all sections): the last phrase highlights in the
         primary-navy family per canvas — see --primary-heading-* tokens */
      headingAccent: 'And why we are the ones to build it.',
      /* section CTAs (user 2026-08-03): every section except the FAQ has a
         button routing to /contact, sitting IN LINE with the section title
         (not below the content); label fitted to the section. */
      cta: 'Get Started',
      groups: [
        /* THREE items per group, each kept to roughly one panel line: the
           panel holds a constant height across tabs by letting the scene
           flex, and that only works while every group's check list is about
           the same height. Four long lines in one group and three in the
           next reintroduced a ~79px jump on auto-advance at 1280 (measured);
           keep new lines short and the counts even. */
        {
          heading: "You're open when they're looking",
          note: 'Nights, weekends, always',
          items: [
            'Most people look up a business outside its working hours',
            'Your site answers them while you are on a job or asleep',
            'It works on the phone in their hand, wherever they are',
          ],
        },
        {
          heading: 'Customers find you on Google',
          note: 'The searches you miss today',
          items: [
            'People search for what you do, near them, every day',
            'With no site, those searches go to a competitor instead',
            'We build the pages to be found, not just to look good',
          ],
        },
        {
          heading: 'Interest turns into enquiries',
          note: 'Where the money is',
          items: [
            'A visitor who cannot reach you easily is a lost customer',
            'Every page gives them one obvious way to get in touch',
            'Enquiries arrive in an inbox on your own business domain',
          ],
        },
        {
          heading: 'The technical side stays ours',
          note: 'You run the business',
          items: [
            'Domain, hosting, email and security are set up and run by us',
            'Nothing to renew, update or configure at your end',
            'One supplier for all of it, instead of four',
          ],
        },
        {
          heading: 'We are still here after launch',
          note: 'Not a build and vanish',
          items: [
            'Technical support runs on for months after you go live',
            'You speak to the people who built it, not a ticket queue',
            'Changes later are a conversation, not a fresh project',
          ],
        },
      ],
    },
    audience: {
      eyebrow: '/ Who this is for',
      /* explicit two-line break (user 2026-08-03: "that need to get" opens
         line two) — greedy wrapping can't yield a shorter first line, so
         the heading ships as lines, not one string */
      heading: {
        line1: 'Perfect for businesses',
        line2: 'that need to get ',
        accent: 'online, fast.',
      },
      cta: "Let's Talk",
      items: [
        'Local businesses launching their first website',
        'Businesses replacing an outdated or broken site',
        'Freelancers and sole traders who need a professional presence',
        'Anyone who wants to stop losing customers to competitors who have a website',
      ],
    },
    steps: {
      eyebrow: '/ How it works',
      heading: "Three steps. That's it.",
      headingAccent: "That's it.",
      cta: 'Start Now',
      items: [
        {
          title: 'Tell us about your business',
          body: 'Fill in a short brief. What you do, who your customers are, and what you want your website to say.',
        },
        {
          title: 'We design and build it',
          /* generic (2026-08-04): revision rounds differ per package, so the
             step doesn't quote a number */
          body: 'We create your website, set up your domain, hosting and email. You review it, and we refine it through the revision rounds in your package.',
        },
        {
          title: 'You go live',
          body: "We launch your site, connect your analytics, and hand everything over. You're online.",
        },
      ],
    },
    faq: {
      eyebrow: '/ Common questions',
      heading: "Questions? We've got answers.",
      headingAccent: 'answers.',
      items: [
        /* tier-aware answers (2026-08-04) — the chart carries the numbers,
           these answer the questions three packages create */
        {
          q: 'Which package is right for me?',
          a: "Starter gets you a professional presence quickly. Growth is the one most businesses choose: a custom design built to bring in enquiries. Professional is for booking systems, e-commerce and written content. Tell us your goal and we'll recommend one honestly.",
        },
        {
          q: 'Do I need to provide content?',
          a: "We'll guide you on what's needed. If you have text and photos ready, great. If not, we can help you put it together, and the Professional package includes written content for your key pages.",
        },
        {
          q: 'Can I add more pages later?',
          a: 'Absolutely. Packages cover five to fifteen pages, and we can add more at any time for an additional cost.',
        },
        {
          q: 'What happens after the first year?',
          a: `Domain renewal and hosting continue at standard rates (typically ${m.renewal}). We'll remind you before anything renews.`,
        },
        {
          q: 'Can I update the website myself?',
          a: 'Yes. We build on platforms that let you make simple text and image updates yourself.',
        },
        {
          q: 'What if I need something more complex?',
          a: "If you need custom functionality, a booking system, e-commerce, or a web application, we do that too. We'll recommend the right solution for your needs.",
        },
        {
          q: 'How long does it take?',
          a: 'Typically 2-3 weeks from receiving your brief to going live. Larger packages take a little longer, and we agree the dates with you up front.',
        },
      ],
    },
    cta: {
      heading: 'Ready to get your business online?',
      headingAccent: 'online?',
      sub: `${m.packagesFrom} No hidden costs. No ongoing commitments.`,
      cta: 'Get Started',
      emailNote: 'Have questions? Email us at',
      email: 'hello@tekniik.ai',
    },
  }
}

/* CHART groups, data order (website / domain & hosting / email /
   visibility / peace of mind) — used by both chart renders */
const GROUP_ICONS = [IconWeb, IconServer, IconMail, IconSearch, IconShieldCheck]
/* EXPLORER tabs, data order — a different argument in a different order,
   so it gets its own glyph list. Keep it in step with SCENES below. */
const WHY_ICONS = [IconWeb, IconSearch, IconMail, IconServer, IconShieldCheck]
const AUDIENCE_ICONS = [IconStore, IconRefresh, IconBriefcase, IconTrendUp]
/* mono situation tags on the audience ledger rows, data order */
const AUDIENCE_TAGS = ['First website', 'Rebuild', 'Going solo', 'Catching up']
const STEP_ICONS = [IconPen, IconCode, IconDeploy]

/* the explorer auto-advances on this clock while ≥35% in view, until the
   user picks a tab themselves (then it's theirs); off under reduced motion */
const EXPLORE_INTERVAL = 4800

/* FAQ card — controlled accordion (replaces native <details>, whose
   open/close snaps). The answer wrapper animates grid-template-rows
   0fr → 1fr both ways for a genuinely smooth height tween; the inner copy
   fades/rises a beat behind. Multiple cards can stay open at once. */
function FaqCard({ item, index }) {
  const [open, setOpen] = useState(false)
  const btnId = `wp-faq-q-${index}`
  const panelId = `wp-faq-a-${index}`
  return (
    <div className={open ? `${styles.faqItem} ${styles.faqOpen}` : styles.faqItem}>
      <button
        type="button"
        id={btnId}
        className={styles.faqQ}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.faqNum} aria-hidden="true">
          0{index + 1}
        </span>
        <span className={styles.faqQText}>{item.q}</span>
        <span className={styles.faqToggle} aria-hidden="true">
          <IconPlus />
        </span>
      </button>
      <div id={panelId} role="region" aria-labelledby={btnId} className={styles.faqAWrap}>
        <div className={styles.faqA}>
          <p>{item.a}</p>
        </div>
      </div>
    </div>
  )
}

/* split the accent tail off a heading (FinalCta's split idiom) —
   accent must be the heading's ending phrase */
function headingParts(heading, accent) {
  if (!accent || !heading.endsWith(accent)) return [heading, null]
  return [heading.slice(0, heading.length - accent.length), accent]
}

function IconPlus() {
  return (
    <svg
      className={styles.faqIcon}
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 3.5v9M3.5 8h9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* —— Package explorer mini-scenes ————————————————————
   One coded vignette per inclusion group, on the navy dossier panel.
   Pure-CSS choreography that replays on every panel remount (the panel is
   keyed by the active tab); real micro-copy, never bare skeleton bars.
   All decorative (aria-hidden) — the facts are the check rows beside them. */

function SiteScene() {
  return (
    <div className={styles.vg} aria-hidden="true">
      <div className={styles.vgDevices}>
        <div className={styles.vgBrowser}>
          <div className={styles.vgBrowserHead}>
            <i />
            <i />
            <i />
            <span>yourbusiness.co.uk</span>
          </div>
          <div className={styles.vgBrowserBody}>
            <span className={styles.vgSiteH}>
              Quality you can <em>trust.</em>
            </span>
            <span className={styles.vgSiteLine} />
            <span className={styles.vgSiteBtn}>Get in touch</span>
          </div>
        </div>
        <div className={styles.vgPhone}>
          <i className={styles.vgPhoneNotch} />
          <span className={styles.vgPhoneH}>Quality you can trust.</span>
          <i className={styles.vgPhoneBlock} />
          <i className={styles.vgPhoneBar} />
          <i className={styles.vgPhoneBar} />
        </div>
      </div>
      <div className={styles.vgPages}>
        {['Home', 'About', 'Services', 'Gallery', 'Contact'].map((p, i) => (
          <span key={p} className={styles.vgPage} style={{ '--i': i }}>
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}

function HostScene() {
  return (
    <div className={styles.vg} aria-hidden="true">
      <div className={styles.vgAddr}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <rect x="2" y="5.2" width="8" height="5.4" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M3.8 5V3.9a2.2 2.2 0 0 1 4.4 0V5" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        <span>
          <em>https://</em>yourbusiness.co.uk
        </span>
        <span className={styles.vgTag}>SSL secure</span>
      </div>
      <div className={styles.vgHostRow}>
        <div className={styles.vgRack}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.vgRackRow} style={{ '--i': i }}>
              <i className={styles.vgLed} />
              <i className={styles.vgRackBar} />
              <span className={styles.vgRackLabel}>
                {['web-01', 'mail-01', 'backup'][i]}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.vgRing}>
          <svg viewBox="0 0 44 44" className={styles.vgRingSvg}>
            <circle cx="22" cy="22" r="17" className={styles.vgRingTrack} />
            <circle cx="22" cy="22" r="17" className={styles.vgRingFill} />
          </svg>
          <span className={styles.vgRingLabel}>Nightly backup</span>
        </div>
      </div>
    </div>
  )
}

function MailScene() {
  const rows = [
    ['New enquiry', '2 min ago', true],
    ['Quote accepted', '1 hr ago', false],
    ['Invoice paid', 'Yesterday', false],
  ]
  return (
    <div className={styles.vg} aria-hidden="true">
      <div className={styles.vgInbox}>
        <div className={styles.vgInboxHead}>
          <IconMail className={styles.vgInboxIcon} />
          <span>you@yourbusiness.co.uk</span>
          <span className={styles.vgTag}>Your inboxes</span>
        </div>
        {rows.map(([subject, when, unread], i) => (
          <div key={subject} className={styles.vgMsg} style={{ '--i': i }}>
            <i className={unread ? styles.vgMsgDotNew : styles.vgMsgDot} />
            <span className={styles.vgMsgSubject}>{subject}</span>
            <span className={styles.vgMsgWhen}>{when}</span>
          </div>
        ))}
        <div className={styles.vgInboxFoot}>10GB storage per mailbox</div>
      </div>
    </div>
  )
}

function SeoScene() {
  return (
    <div className={styles.vg} aria-hidden="true">
      <div className={styles.vgSearchBar}>
        <IconSearch className={styles.vgSearchIcon} />
        <span>joiners near me</span>
      </div>
      <div className={styles.vgSeoRow}>
        <div className={styles.vgResult}>
          <span className={styles.vgResultTitle}>Your Business · Trusted local joiners</span>
          <span className={styles.vgResultUrl}>yourbusiness.co.uk</span>
          <i className={styles.vgResultLine} />
          <i className={`${styles.vgResultLine} ${styles.vgResultLineShort}`} />
        </div>
        <div className={styles.vgBars}>
          {[0.45, 0.6, 0.5, 0.78, 1].map((h, i) => (
            <i key={i} style={{ '--h': h, '--i': i }} />
          ))}
        </div>
      </div>
      <span className={styles.vgLive}>
        <i />
        Google Analytics connected
      </span>
    </div>
  )
}

function CareScene() {
  return (
    <div className={styles.vg} aria-hidden="true">
      <div className={styles.vgCare}>
        <span className={styles.vgShield}>
          <IconShieldCheck className={styles.vgShieldIcon} />
        </span>
        <div className={styles.vgDays}>
          <div className={styles.vgDaysHead}>
            <span>Day 1</span>
            {/* the longest support window we offer — generic across the
                three packages (60 / 90 / 120 days) */}
            <span>Day 120</span>
          </div>
          <div className={styles.vgDaysRail}>
            <i />
          </div>
          <span className={styles.vgDaysNote}>Technical support · we stay on call</span>
        </div>
      </div>
    </div>
  )
}

/* one mini-scene per EXPLORER tab, same order as WHY_ICONS: open all
   hours (the site itself) · found on Google (search) · enquiries (inbox)
   · the technical side (servers, padlock, backups) · after launch (the
   support shield) */
const SCENES = [SiteScene, SeoScene, MailScene, HostScene, CareScene]

/* —— Package chart ————————————————————————————
   The three tiers compared line by line. Desktop renders a REAL <table>
   (row/col headers, so a screen reader announces "Growth · Blog or news
   section · included"); ≤900px it becomes stacked tier cards listing only
   what that package actually includes, Growth first (spec). The two are
   mutually exclusive renders driven by useMediaQuery — never both in the
   DOM, or every line would be read out twice. */

const HOT = 1 /* Growth — the highlighted column/card */
const CHART_COMPACT = '(max-width: 900px)'

function hotClass(i, base) {
  return i === HOT ? `${base} ${styles.hot}` : base
}

/* every tier cell is part of a card column (.tierCol paints the surface,
   the head/foot cells close the ends). The three cards sit FLUSH — no gap
   between them (user 2026-08-04) — so each vertical rule must be drawn by
   exactly one cell or it doubles: the outer two come from colFirst /
   colLast, both inner ones from Growth's accent sides. */
function colClass(i, n, base) {
  const cls = [base, styles.tierCol]
  if (i === 0) cls.push(styles.colFirst)
  if (i === n - 1) cls.push(styles.colLast)
  if (i === HOT) cls.push(styles.colHot)
  return cls.join(' ')
}

/* the tier buttons. NO idle animation — a glint on all six plus a wash
   under Professional was tried and rejected (user 2026-08-04: "looks
   horrible"). Professional gets a static lift instead (accent border and
   label) so it reads as the serious pack beside Growth's filled button. */
function ctaClass(i, n) {
  return i === n - 1 ? `${styles.tierCta} ${styles.ctaPro}` : styles.tierCta
}

function Cell({ value }) {
  if (value === true) {
    return (
      <>
        <IconCheck className={styles.cellCheck} width="16" height="16" aria-hidden="true" />
        <span className={styles.srOnly}>Included</span>
      </>
    )
  }
  if (!value) {
    return (
      <>
        <span className={styles.cellNo} aria-hidden="true">
          –
        </span>
        <span className={styles.srOnly}>Not included</span>
      </>
    )
  }
  return <span className={styles.cellValue}>{value}</span>
}

function TierChart({ tiers, matrix, label, meta, footNote }) {
  const n = tiers.length
  return (
    <div className={styles.chartWrap}>
      <table className={styles.chart}>
        <caption className={styles.srOnly}>What each package includes</caption>
        <colgroup>
          <col className={styles.colFeature} />
          {tiers.map((t) => (
            <col key={t.name} className={styles.colTier} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={styles.chartCorner}>
              <span className={styles.cornerLabel}>{label}</span>
              <span className={styles.cornerMeta}>{meta}</span>
            </th>
            {tiers.map((tier, i) => (
              <th key={tier.name} scope="col" className={colClass(i, n, styles.tierTop)}>
                {/* absolutely positioned against the cell — it rides the
                    card's top edge instead of reserving a row above the
                    tier names (user 2026-08-04) */}
                {tier.badge ? <span className={styles.tierBadge}>{tier.badge}</span> : null}
                <span className={styles.tierName}>{tier.name}</span>
                <span className={styles.tierTag}>{tier.tag}</span>
                <span className={styles.tierPrice}>{tier.price}</span>
                <span className={styles.tierDesc}>{tier.desc}</span>
              </th>
            ))}
          </tr>
          {/* the CTAs get their OWN row so all three buttons land on the
              same line whatever the descriptions above them do */}
          <tr>
            <td />
            {tiers.map((tier, i) => (
              <td key={tier.name} className={colClass(i, n, styles.ctaCell)}>
                <Button
                  to="/contact"
                  variant={i === HOT ? 'primary' : 'ghost'}
                  className={ctaClass(i, n)}
                  arrow
                >
                  {tier.cta}
                </Button>
              </td>
            ))}
          </tr>
        </thead>

        {matrix.map((group, g) => {
          const GIcon = GROUP_ICONS[g]
          return (
            <tbody key={group.group}>
              {/* the group label spans ONLY the feature column — the tier
                  cells stay in place so the highlighted column's border
                  and tint run unbroken down the whole chart */}
              <tr>
                <th scope="colgroup" className={styles.groupCell}>
                  <span className={styles.groupChip} aria-hidden="true">
                    <GIcon width="16" height="16" />
                  </span>
                  {group.group}
                </th>
                {tiers.map((tier, i) => (
                  <td key={tier.name} className={colClass(i, n, styles.groupPad)} />
                ))}
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label} className={styles.featRow}>
                  <th scope="row" className={styles.featLabel}>
                    {row.label}
                  </th>
                  {row.v.map((value, i) => (
                    <td key={tiers[i].name} className={colClass(i, n, styles.cell)}>
                      <Cell value={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )
        })}

        <tfoot>
          <tr>
            {/* repeat CTA row — the chart is taller than a viewport, so the
                header buttons are long gone by the time you reach here */}
            <td className={styles.footNote}>{footNote}</td>
            {tiers.map((tier, i) => (
              <td key={tier.name} className={colClass(i, n, styles.footCell)}>
                <span className={styles.footTier}>{tier.name}</span>
                <Button
                  to="/contact"
                  variant={i === HOT ? 'primary' : 'ghost'}
                  className={ctaClass(i, n)}
                  arrow
                >
                  {tier.cta}
                </Button>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function TierCards({ tiers, matrix }) {
  const n = tiers.length
  return (
    <div className={styles.tierCards}>
      {tiers.map((tier, i) => (
        <article key={tier.name} className={hotClass(i, styles.tierCard)}>
          <div className={styles.tierCardHead}>
            {tier.badge ? <span className={styles.tierBadge}>{tier.badge}</span> : null}
            <span className={styles.tierName}>{tier.name}</span>
            <span className={styles.tierTag}>{tier.tag}</span>
            <span className={styles.tierPrice}>{tier.price}</span>
            <span className={styles.tierDesc}>{tier.desc}</span>
            <Button
              to="/contact"
              variant={i === HOT ? 'primary' : 'ghost'}
              className={ctaClass(i, n)}
              arrow
            >
              {tier.cta}
            </Button>
          </div>

          {matrix.map((group, g) => {
            /* only what THIS package includes — a card of dashes sells
               nothing */
            const rows = group.rows.filter((r) => r.v[i])
            if (!rows.length) return null
            const GIcon = GROUP_ICONS[g]
            return (
              <div key={group.group} className={styles.cardGroup}>
                <span className={styles.cardGroupName}>
                  <span className={styles.groupChip} aria-hidden="true">
                    <GIcon width="15" height="15" />
                  </span>
                  {group.group}
                </span>
                <ul className={styles.cardList}>
                  {rows.map((row) => (
                    <li key={row.label} className={styles.cardItem}>
                      <IconCheck
                        className={styles.cellCheck}
                        width="15"
                        height="15"
                        aria-hidden="true"
                      />
                      <span>
                        {row.label}
                        {typeof row.v[i] === 'string' ? (
                          <span className={styles.cardValue}>{row.v[i]}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </article>
      ))}
    </div>
  )
}

export default function WebsitePackage() {
  /* the visitor's own currency where we price in one, GBP otherwise.
     Resolved from the device time zone before first paint, then
     confirmed by one IP lookup — so the copy is rebuilt at most once,
     and only if the two disagree. */
  const currency = useCurrency()
  const money = moneyFor(currency)
  const page = useMemo(() => buildPage(money), [money])

  const { hero, packages, included, audience, steps, faq, cta } = page
  const total = steps.items.length
  const reduced = useReducedMotion()
  const compactChart = useMediaQuery(CHART_COMPACT)

  /* —— package explorer state ————————————————— */
  const [active, setActive] = useState(0)
  const [locked, setLocked] = useState(false)
  const exploreRef = useRef(null)
  const inViewRef = useRef(false)

  const pick = (i) => {
    setActive(i)
    setLocked(true)
  }

  /* auto-advance while the explorer is in view, until the user takes over */
  useEffect(() => {
    if (reduced || locked) return undefined
    const el = exploreRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries.some((e) => e.isIntersecting)
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    const id = setInterval(() => {
      if (inViewRef.current) setActive((a) => (a + 1) % included.groups.length)
    }, EXPLORE_INTERVAL)
    return () => {
      io.disconnect()
      clearInterval(id)
    }
  }, [reduced, locked, included.groups.length])

  const onTabKey = (e) => {
    const n = included.groups.length
    let next = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % n
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active + n - 1) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    if (next === null) return
    e.preventDefault()
    pick(next)
    e.currentTarget.querySelectorAll('[role="tab"]')[next]?.focus()
  }

  /* —— process band chip ignition ——————————————— */
  // steps ignite in sequence as the band scrolls in — chips flood teal
  // one after another (the rails were removed 2026-08-03, user: the
  // filling icons alone are enough; hook fires once with p=1 under RM)
  const stepsRef = useScrollProgressInk((p, grid) => {
    grid.querySelectorAll('[data-step]').forEach((step, i) => {
      const local = Math.min(1, Math.max(0, p * total - i))
      step.classList.toggle(styles.lit, local > 0.02)
    })
  })

  const activeGroup = included.groups[active]
  const ActiveIcon = WHY_ICONS[active]
  const ActiveScene = SCENES[active]

  /* heading accent splits — deep primary on light canvases, light
     periwinkle on the navy band */
  const [pkgLead, pkgAccent] = headingParts(packages.heading, packages.headingAccent)
  const [inclLead, inclAccent] = headingParts(included.heading, included.headingAccent)
  const [stepsLead, stepsAccent] = headingParts(steps.heading, steps.headingAccent)
  const [faqLead, faqAccent] = headingParts(faq.heading, faq.headingAccent)

  return (
    <>
      {/* —— 01 · Hero: value prop left, the site-going-live vignette right — */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Reveal className={styles.metaBar}>
            <span className={styles.eyebrow}>
              <span className={styles.node} aria-hidden="true" />
              {hero.eyebrow}
              <span className={styles.eyebrowDot} aria-hidden="true">
                ·
              </span>
              <span className={styles.eyebrowMeta}>{hero.eyebrowMeta}</span>
            </span>
            <span className={styles.metaRight}>{hero.price}</span>
          </Reveal>

          <div className={styles.heroSplit}>
            <div>
              <FadeIn as="h1" className={styles.headline}>
                {hero.headline.pre}
                <span className={styles.hlDeep}>{hero.headline.navy}</span>
                {hero.headline.mid}
                <span className={styles.hlPrice}>{hero.headline.price}</span>
                {hero.headline.post}
              </FadeIn>
              <Reveal delay={240}>
                <p className={styles.sub}>{hero.sub}</p>
              </Reveal>
              {/* every CTA on this page routes to /contact (user
                  2026-08-03) — the contact form is the conversion path */}
              <Reveal className={styles.actions} delay={340}>
                <Button to="/contact" variant="primary" arrow>
                  {hero.cta}
                </Button>
              </Reveal>

              {/* price comparison strip — struck agency anchor vs the
                  package price, plus the turnaround pill (moved here from
                  the hero card, user request 2026-08-03) */}
              <Reveal className={styles.valueStrip} delay={430}>
                <span className={styles.compare}>
                  <span className={styles.compareLabel}>{hero.compare.wasLabel}</span>
                  <s className={styles.compareWas}>{hero.compare.was}</s>
                </span>
                <IconArrow className={styles.compareArrow} width="17" height="17" aria-hidden="true" />
                <span className={styles.compare}>
                  <span className={styles.compareLabel}>{hero.compare.nowLabel}</span>
                  <span className={styles.compareNow}>{hero.compare.now}</span>
                </span>
                <span className={styles.turnPill}>
                  <IconClock className={styles.turnPillIcon} aria-hidden="true" />
                  {hero.compare.turnaround}
                </span>
              </Reveal>
            </div>

            <Reveal className={styles.heroVisual} delay={160}>
              <HeroPackageSite price={money.starter} tld={money.tld} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* —— 02 · Packages — the tier comparison chart ——————— */}
      {/* the only section without a heading-row CTA on purpose: the chart
          carries three of them (plus three more in its foot) */}
      <section className={styles.packages}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>01</span>
            <span className={styles.secEyebrow}>{packages.eyebrow}</span>
            {/* the spec asks that a localised price says so; this sits on
                the section that holds all three of them, and there is
                deliberately NO currency switch (user 2026-08-04, spec:
                "keep it automatic") */}
            <span className={styles.curNote}>{money.note}</span>
          </Reveal>

          <Reveal className={styles.headRow} delay={80}>
            <h2 className={styles.sectionHeading}>
              {pkgLead}
              <span className={styles.hlDeep}>{pkgAccent}</span>
            </h2>
            <p className={styles.pkgNote}>{packages.note}</p>
          </Reveal>

          <Reveal delay={140}>
            {compactChart ? (
              <TierCards tiers={packages.tiers} matrix={packages.matrix} />
            ) : (
              <TierChart
                tiers={packages.tiers}
                matrix={packages.matrix}
                label={packages.chartLabel}
                meta={packages.chartMeta}
                footNote={packages.footNote}
              />
            )}
          </Reveal>
        </div>
      </section>

      {/* —— 03 · Why it matters — the package explorer ————————— */}
      <section className={`${styles.section} ${styles.sectionTint}`}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>02</span>
            <span className={styles.secEyebrow}>{included.eyebrow}</span>
          </Reveal>

          <Reveal className={styles.inclHead} delay={80}>
            <h2 className={styles.sectionHeading}>
              {inclLead}
              <span className={styles.hlDeep}>{inclAccent}</span>
            </h2>
            <div className={styles.inclHeadRight}>
              <Button to="/contact" variant="primary" arrow>
                {included.cta}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div ref={exploreRef} className={styles.explorer}>
              <div
                role="tablist"
                aria-label="Why a website matters, and why us"
                className={styles.selRows}
                onKeyDown={onTabKey}
              >
                {included.groups.map((group, i) => {
                  const GIcon = WHY_ICONS[i]
                  const isActive = active === i
                  return (
                    <button
                      key={group.heading}
                      type="button"
                      role="tab"
                      id={`wp-tab-${i}`}
                      aria-selected={isActive}
                      aria-controls="wp-included-panel"
                      tabIndex={isActive ? 0 : -1}
                      className={isActive ? `${styles.selRow} ${styles.selActive}` : styles.selRow}
                      onClick={() => pick(i)}
                    >
                      <span className={styles.selChip} aria-hidden="true">
                        <GIcon width="19" height="19" />
                      </span>
                      <span className={styles.selText}>
                        <span className={styles.selHeading}>{group.heading}</span>
                        <span className={styles.selMeta}>{group.note}</span>
                      </span>
                      <IconArrow className={styles.selArrow} width="15" height="15" aria-hidden="true" />
                    </button>
                  )
                })}
              </div>

              {/* keyed remount replays the panel entrance + scene choreography */}
              <div
                key={active}
                id="wp-included-panel"
                role="tabpanel"
                aria-labelledby={`wp-tab-${active}`}
                className={styles.panel}
              >
                <span className={styles.panelRail} aria-hidden="true" />
                <div className={styles.panelHead}>
                  <span className={styles.panelChip} aria-hidden="true">
                    <ActiveIcon width="19" height="19" />
                  </span>
                  <h3 className={styles.panelHeading}>{activeGroup.heading}</h3>
                  <span className={styles.panelIndex} aria-hidden="true">
                    {String(active + 1).padStart(2, '0')} / {String(included.groups.length).padStart(2, '0')}
                  </span>
                </div>

                <ActiveScene />

                <ul className={styles.panelChecks}>
                  {activeGroup.items.map((item, i) => (
                    <li key={item} className={styles.panelRow} style={{ '--i': i }}>
                      <IconCheck className={styles.panelCheck} width="15" height="15" aria-hidden="true" />
                      <span className={styles.panelItem}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* —— 04 · Who this is for — full-width ledger rows ————— */}
      {/* editorial ledger: ghost numeral, icon chip, oversized statement,
          mono situation tag. Hover ignites the row (accent bar draws down
          the left edge, chip floods, numeral strokes teal). */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.secHead}>
            <span className={styles.secIndex}>03</span>
            <span className={styles.secEyebrow}>{audience.eyebrow}</span>
          </Reveal>

          <Reveal className={styles.headRow} delay={80}>
            <h2 className={`${styles.sectionHeading} ${styles.audHeading}`}>
              {audience.heading.line1}
              <br />
              {audience.heading.line2}
              <span className={styles.hlDeep}>{audience.heading.accent}</span>
            </h2>
            <Button to="/contact" variant="primary" arrow>
              {audience.cta}
            </Button>
          </Reveal>

          <div className={styles.audList}>
            {audience.items.map((item, i) => {
              const AudIcon = AUDIENCE_ICONS[i]
              return (
                <Reveal key={item} delay={i * 70} className={styles.audRowWrap}>
                  <div className={styles.audRow}>
                    <span className={styles.audGhost} aria-hidden="true">
                      0{i + 1}
                    </span>
                    <span className={styles.audChip} aria-hidden="true">
                      <AudIcon width="20" height="20" />
                    </span>
                    <p className={styles.audText}>{item}</p>
                    <span className={styles.audTag}>{AUDIENCE_TAGS[i]}</span>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* —— 05 · How it works — navy band with a hint of teal, glass step
          cards + igniting chips —— */}
      <section className={styles.process}>
        <div className="container">
          <Reveal className={styles.processHead}>
            <div className={styles.secHead}>
              <span className={styles.secIndex}>04</span>
              <span className={styles.secEyebrow}>{steps.eyebrow}</span>
            </div>
            <div className={styles.headRow}>
              <h2 className={styles.sectionHeading}>
                {stepsLead}
                <span className={styles.hlBand}>{stepsAccent}</span>
              </h2>
              {/* inverse variant — primary buttons vanish on the navy band */}
              <Button to="/contact" variant="inverse" arrow>
                {steps.cta}
              </Button>
            </div>
          </Reveal>

          <ol ref={stepsRef} className={styles.steps}>
            {steps.items.map((s, i) => {
              const StepIcon = STEP_ICONS[i]
              return (
                <li key={s.title} data-step="" className={styles.step}>
                  <Reveal delay={i * 90} className={styles.stepBody}>
                    {/* chip ignites when its step lights (.step.lit) —
                        the Contact next-steps idiom, minus the rails */}
                    <span className={styles.stepChip} aria-hidden="true">
                      <StepIcon width="19" height="19" />
                    </span>
                    <span className={styles.stepLabel}>Step 0{i + 1}</span>
                    <span className={styles.ghost} aria-hidden="true">
                      0{i + 1}
                    </span>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                    <p className={styles.stepDesc}>{s.body}</p>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* —— 06 · Common questions — full-width two-column FAQ cards —— */}
      <section className={styles.section}>
        <div className="container">
          <Reveal className={styles.faqHead}>
            <div className={styles.secHead}>
              <span className={styles.secIndex}>05</span>
              <span className={styles.secEyebrow}>{faq.eyebrow}</span>
            </div>
            <span className={styles.faqMeta} aria-hidden="true">
              {String(faq.items.length).padStart(2, '0')} answers
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className={styles.sectionHeading}>
              {faqLead}
              <span className={styles.hlDeep}>{faqAccent}</span>
            </h2>
          </Reveal>

          {/* two independent column stacks (not one grid) so opening a
              card only reflows its own column */}
          <div className={styles.faq}>
            {[
              faq.items.slice(0, Math.ceil(faq.items.length / 2)),
              faq.items.slice(Math.ceil(faq.items.length / 2)),
            ].map((col, c) => (
              <div key={c} className={styles.faqCol}>
                {col.map((item, i) => {
                  const index = c * Math.ceil(faq.items.length / 2) + i
                  return (
                    <Reveal key={item.q} delay={index * 60}>
                      <FaqCard item={item} index={index} />
                    </Reveal>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* —— 07 · CTA — the conversion block the hero CTA jumps to —— */}
      <div id="get-started">
        <FinalCta
          tintPrimary
          heading={cta.heading}
          accent={cta.headingAccent}
          sub={cta.sub}
          ctaLabel={cta.cta}
          emailNote={cta.emailNote}
          email={cta.email}
        />
      </div>
    </>
  )
}
