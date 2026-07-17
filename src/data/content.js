/* Copy originally extracted from references/tekniik-prototype-v4.html.
   Homepage copy humanized 2026-07-13 per user (no em dashes, natural voice). */

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const HERO = {
  eyebrow: 'Custom Software · Web Platforms · Mobile Apps · AI Systems',
  headline: ['Technology', 'built', 'right.'],
  sub: 'We design and engineer custom software, web platforms, mobile applications, and AI-powered systems for businesses that need technology they can actually rely on.',
  primaryCta: { label: 'Get a Quote', to: '/contact' },
  // "See our work" scrolls to the on-page Our Work section (#work); Hero
  // intercepts the click and smooth-scrolls via Lenis (see Hero.jsx).
  ghostCta: { label: 'See our work', to: '/#work' },
  trust: '4.9★ · 50+ Projects · 98% Retention',
}

/* Proof ticker (Hero) — order and results per homepage spec §02.
   `type` also keys the ServiceVignettes metric chips, so keys are unchanged. */
export const TERMINAL_FRAMES = [
  { type: 'web-app', result: '15hrs saved / week' },
  { type: 'website', result: '2.1s load · 4x leads' },
  { type: 'mobile-app', result: '4.8★ app store' },
  { type: 'ai-automation', result: '3hrs → 20min' },
]

/* "The Numbers" (§03) head — additive copy (2026-07-17 ledger revamp).
   The heading splits so the tail can carry the accent, like the Hero. */
export const NUMBERS_HEAD = {
  eyebrow: 'THE NUMBERS',
  headline: 'Track record,',
  headlineAccent: 'not talk.',
}

/* One-line human detail per §03 stat — keyed by MARQUEE label. */
export const NUMBERS_DETAILS = {
  'Projects Delivered': 'Scoped, built, and shipped end to end.',
  'Client Retention': 'Clients who come back for the next build.',
  'Average Rating': 'Averaged across every engagement to date.',
  'Industries Served': 'Fintech, healthcare, retail, and counting.',
}

export const MARQUEE = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Retention' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '8+', label: 'Industries Served' },
  { value: 'Senior', label: 'team only' },
  { value: 'AI-native', label: 'development' },
  { value: 'Long-term', label: 'partnerships' },
]

export const PROBLEM = {
  eyebrow: 'THE PROBLEM',
  heading: "You've probably been here before.",
  paragraphs: [
    "You hired a team to build your website or software. They talked about bespoke solutions, agile sprints, and scalable architecture. Then deadlines slipped. Budgets ballooned. The junior developer who actually built your project had never spoken to you. And the thing they delivered? It didn't quite work.",
    "We hear this story constantly. It's the reason Tekniik exists. Software development deserves better than this.",
  ],
  beforeCard: {
    label: 'Previous Agency',
    body: 'Project delivered 4 months late. Key features missing. No documentation.',
    badge: 'Over budget',
  },
  afterCard: {
    label: 'With Tekniik',
    body: 'Delivered on time. Weekly updates. Full documentation. Ongoing support.',
    badge: 'On budget',
  },
}

export const CAPABILITIES = {
  eyebrow: 'WHAT WE ENGINEER',
  heading: ['What we', 'engineer.'],
  sub: 'From custom software platforms to AI-powered automation, we engineer technology that runs businesses.',
  // Order per homepage spec §05: Custom Software first, Web Platforms second.
  // `key` maps each row to its ServiceVignettes scene (app = dashboard,
  // web = marketing site, mobile = phone, ai = pipeline). `to` points at the
  // dedicated service detail page (SERVICE_PAGES).
  items: [
    {
      key: 'app',
      title: 'Custom Software',
      desc: 'We architect and build business software that handles real operational complexity. Customer portals, SaaS platforms, booking systems, admin dashboards, and internal tools. Engineered around your workflows, not templates.',
      to: '/services/custom-software',
    },
    {
      key: 'web',
      title: 'Web Platforms',
      desc: 'High-performance websites and e-commerce platforms that do more than look good. Fast, accessible, SEO-optimised, and built on modern frameworks, designed to convert visitors into customers.',
      to: '/services/web-platforms',
    },
    {
      key: 'mobile',
      title: 'Mobile Apps',
      desc: 'Native and cross-platform applications for iOS and Android. From consumer-facing products to internal field tools, designed around real user behaviour, not assumptions.',
      to: '/services/mobile-apps',
    },
    {
      key: 'ai',
      title: 'AI Systems',
      desc: 'Intelligent document processing, workflow automation, predictive analytics, and machine learning integrations. We embed AI where it delivers measurable ROI, not as a buzzword.',
      to: '/services/ai-systems',
    },
  ],
}

export const WHY_TEKNIIK = {
  eyebrow: 'WHY TEKNIIK',
  heading: 'We do things',
  headingAccent: 'differently.',
  sub: 'Not for the sake of it. Our clients demand better.',
  items: [
    {
      key: 'team',
      title: 'Senior team, direct access.',
      desc: 'You work with the people building your project. No account managers relaying messages. No junior developers working unsupervised. The person you meet is the person who delivers.',
    },
    {
      key: 'clarity',
      title: 'Radical clarity.',
      desc: "Plain English. No jargon. You'll always know what's happening, what's coming next, and what it costs. No black boxes. No surprises.",
    },
    {
      key: 'ai',
      title: 'AI built in, not bolted on.',
      desc: 'Smarter systems come as standard, woven into every solution rather than sold as an upsell.',
    },
    {
      key: 'partner',
      title: 'Partnership, not projects.',
      desc: "We don't build something and disappear. We stay on as your technology partner, maintaining, improving, and evolving your systems as your business grows.",
    },
  ],
}

export const PROCESS = {
  eyebrow: 'HOW WE WORK',
  heading: 'Predictable process. Predictable outcome.',
  sub: 'Every step structured so you always know what’s next.',
  steps: [
    { n: '01', title: 'Listen', duration: '~1 week', desc: "We understand your business first. What you're trying to achieve." },
    { n: '02', title: 'Plan', duration: '~1 week', desc: 'Clear proposal with scope, timeline, and investment.' },
    { n: '03', title: 'Build', duration: '4–12 weeks', desc: 'Short cycles. Real progress every week.' },
    { n: '04', title: 'Launch', duration: '~1 week', desc: 'Testing, deployment, training, and go-live support. We launch with you.' },
    { n: '05', title: 'Support & Grow', duration: 'Ongoing', desc: 'Maintenance, improvements, and evolution as your business grows.' },
  ],
}

export const PORTFOLIO = {
  eyebrow: 'OUR WORK',
  heading: 'Real results. Real businesses.',
  sub: "A selection of projects we've designed, engineered, and continue to support.",
  items: [
    {
      slug: 'tcc',
      title: 'CareGrid',
      tags: ['Healthcare', 'Web Platform', 'UK'],
      desc: 'We developed a comprehensive all-in-one management platform for CareGrid, a leader in the healthcare industry. The application streamlines operations for both clients and staff, supporting efficient management and seamless service delivery across the organisation.',
      result: 'Serving 1,000+ clients with streamlined operations',
      featured: true,
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'looqz',
      title: 'GlowBook',
      tags: ['Beauty & Wellness', 'Booking Platform', 'UK'],
      desc: 'A full-featured beauty and salon booking platform enabling customers across the UK to discover services, book appointments, and manage bookings seamlessly online.',
      result: 'End-to-end booking with real-time availability',
      route: '/case/looqz',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'escape',
      title: 'ClearPath',
      tags: ['Financial Services', 'Web Application', 'South Africa'],
      desc: 'An end-to-end platform linking users with experienced South African attorneys for debt review removal, helping hundreds achieve financial freedom through a seamless online process.',
      result: 'Hundreds of customers helped to financial freedom',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'famili',
      title: 'StoryNest',
      tags: ['Family & Lifestyle', 'Cloud Platform', 'South Africa'],
      desc: "A cloud-based family story preservation platform where South African families can capture, organise, and share their most precious memories and stories for future generations.",
      result: 'Every family has a story worth preserving',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'autoscreen',
      title: 'ScreenFix',
      tags: ['Automotive', 'Service Website', 'South Africa'],
      desc: "A professional service website for ScreenFix, South Africa's auto glass repair and replacement specialists. Built for fast quote requests and seamless customer booking.",
      result: 'Streamlined customer booking and quote requests',
      route: '/case/autoscreen',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'cape',
      title: 'StoneCraft',
      tags: ['Manufacturing', 'E-commerce Website', 'South Africa'],
      desc: 'A customer-centric website for premium granite worktops in Cape Town, featuring seamless product browsing, viewing, and quote requests that have driven numerous customer enquiries.',
      result: 'Significant increase in online customer enquiries',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'refurnish',
      title: 'ReNest',
      tags: ['Retail & Warehouse', 'Web + POS App', 'UK'],
      desc: 'A new website and POS application for ReNest in Manchester to digitise warehouse operations, facilitate online sale of refurbished products, and enhance in-store sales management.',
      result: 'Digitised warehouse operations and online sales',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'southern',
      title: 'BoxWorks',
      tags: ['Packaging Industry', 'Product Website', 'UK'],
      desc: "A product catalogue website presenting BoxWorks's diverse range of packaging clearly, with categorised products to enhance browsing and easy enquiry forms for efficient customer communication.",
      result: 'Enhanced product discovery and customer enquiries',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
  ],
}

export const TESTIMONIALS = [
  {
    text: 'Tekniik was completely different. They actually listened, kept us in the loop the whole way, and delivered exactly what they promised. For the first time we have a system that just works.',
    name: 'James Crawford',
    role: 'Managing Director, Crawford Property Group',
  },
  {
    text: 'They took the time to understand how care actually works before writing a single line of code. The platform now runs our entire operation, and the team is still with us today.',
    name: 'Sarah Whitmore',
    role: 'Operations Director, CareGrid',
  },
  {
    text: 'From the first call it felt like they were part of our team. Bookings that used to take phone calls now happen in seconds, and our salons noticed the difference immediately.',
    name: 'Hannah Whitfield',
    role: 'Founder, GlowBook',
  },
  {
    text: 'Fast, precise, and no surprises. They shipped exactly what was scoped, in the week they said they would. Quote requests have more than doubled since the site went live.',
    name: 'Johan van der Merwe',
    role: 'Managing Director, ScreenFix',
  },
  {
    text: 'We are craftsmen, not technologists, and they respected that. They translated what we do into a website that finally sells it properly. Enquiries have never been stronger.',
    name: 'Pieter Botha',
    role: 'Owner, StoneCraft',
  },
]

export const OFFICE = {
  label: 'Chennai Office',
  lines: [
    'WeWork Block 10, DLF Cybercity',
    '124, Mount Poonamallee Rd',
    'Manapakkam, Chennai',
    'Tamil Nadu 600089, India',
  ],
  emails: [
    { label: 'General', address: 'hello@tekniik.ai' },
    { label: 'Careers', address: 'hr@tekniik.ai' },
  ],
}

export const FINAL_CTA = {
  heading: ['Ready to build something', 'that actually works?'],
  sub: 'No sales pitch. No commitment. Just an honest conversation.',
  cta: { label: 'Get a Quote', to: '/contact' },
  emailNote: 'Prefer email?',
  email: 'hello@tekniik.ai',
}

/* Interstitial CTA strips between sections (homepage + services) */
export const MINI_CTAS = {
  // Homepage §05b — after "What We Engineer"
  homeServices: {
    kicker: 'The right fit',
    line: "Not sure which service fits? Let's figure it out together.",
    cta: 'Get a Quote',
  },
  // Homepage §08b — after "Our Work"
  homeWork: {
    kicker: 'Your project',
    line: "Want to see how we'd approach your project?",
    cta: 'Get a Quote',
  },
  // Services page — between disciplines 02 and 03
  services: {
    kicker: 'Skip ahead',
    line: 'Already know what you need?',
    cta: 'Get a Quote',
  },
}

/* Homepage §10 — "AI-Accelerated Development" (new section) */
export const AI_ACCELERATED = {
  eyebrow: 'AI-ACCELERATED',
  heading: 'AI-accelerated development.',
  sub: "We don't just build AI for clients, we use it to engineer better software, faster.",
  points: [
    {
      key: 'engineering',
      title: 'AI-assisted engineering',
      desc: "Cleaner code, fewer bugs, faster delivery. AI tools help us write, review, and optimise code at a level that manual processes can't match.",
    },
    {
      key: 'qa',
      title: 'Automated quality assurance',
      desc: 'Issues caught before they reach production. Automated testing across devices, browsers, and edge cases, continuously.',
    },
    {
      key: 'delivery',
      title: 'Intelligent project delivery',
      desc: 'Smarter sprint planning, risk detection, and progress tracking. Problems flagged before they become blockers.',
    },
    {
      key: 'prototyping',
      title: 'Rapid prototyping',
      desc: 'More design concepts explored in less time. AI-powered prototyping means we validate ideas faster, so you get the right solution sooner.',
    },
  ],
  closing: 'The result? Higher-quality software, delivered faster, not because we cut corners, but because our tools are smarter.',
}

/* SERVICES */
export const SERVICES_PAGE = {
  eyebrow: 'SERVICES',
  heading: ['We build the technology', 'your business runs on.'],
  sub: 'Websites, web applications, mobile apps, and AI-powered systems — designed for reliability, built for growth.',
  items: [
    {
      key: 'websites',
      title: 'Websites that earn their keep.',
      lede: 'Your website is your most important salesperson. We build sites that look exceptional and perform even better.',
      bullets: [
        'Custom design — no templates',
        'Mobile-first, responsive on every device',
        'SEO foundations from day one',
        'CMS so you can update independently',
        'Under 2-second load times',
      ],
      stack: 'React, Next.js, WordPress, or Webflow.',
      cta: 'Discuss your website',
    },
    {
      key: 'apps',
      title: 'Software that replaces chaos with clarity.',
      lede: "If your team runs on spreadsheets and email chains — there's a better way.",
      bullets: [
        'Portals, dashboards, internal tools',
        'Real-time data and reporting',
        'Integrations with CRMs, APIs, payments',
        'Scalable architecture',
        'Ongoing support',
      ],
      stack: 'React, Node.js, Python, PostgreSQL.',
      cta: 'Discuss your application',
    },
    {
      key: 'mobile',
      title: 'Mobile apps people actually keep.',
      lede: 'Designed around real user behaviour — intuitive, fast, genuinely useful.',
      bullets: [
        'iOS, Android, or cross-platform',
        'UX research and prototyping first',
        'Clean interfaces',
        'Push notifications, offline capability',
        'App Store and Google Play launch support',
      ],
      stack: 'React Native, Flutter, or native Swift/Kotlin.',
      cta: 'Discuss your app',
    },
    {
      key: 'ai',
      title: 'AI that actually solves problems.',
      lede: 'We focus on practical AI that saves real time and money. No buzzwords.',
      bullets: [
        'Document processing and data extraction',
        'Customer support automation',
        'Workflow automation',
        'Predictive analytics',
        'Integration with existing systems',
      ],
      stack: 'Every implementation starts with a clear business case.',
      cta: 'Discuss your AI project',
    },
  ],
  notSure: {
    heading: 'Not sure what you need?',
    sub: 'Most clients come with a problem, not a spec.',
    cta: 'Get a Quote',
  },
  finalCta: {
    heading: "Let's build something great.",
    sub: 'No sales pitch. Just an honest conversation.',
    cta: 'Get a Quote',
  },
}

/* SERVICE DETAIL PAGES — copy verbatim from content/tekniik-services-spec.md
   (§Service Page sections). Keyed by URL slug (/services/<slug>). `sceneKey`
   maps each page to its ServiceVignettes scene; `caseStudy` links only where
   a routed case-study page exists (desc/result condensed from PORTFOLIO). */
export const SERVICE_PAGES = {
  'custom-software': {
    name: 'Custom Software',
    headline: 'Custom software that runs your business.',
    problem: [
      "Off-the-shelf tools force your team into someone else's workflow. Spreadsheets, disconnected apps, and manual processes fill the gaps — until the gaps become the system. You need software built around how your business actually works.",
    ],
    deliver: [
      'Customer portals and client-facing platforms',
      'SaaS products and multi-tenant applications',
      'Admin dashboards and management systems',
      'Booking and scheduling platforms',
      'Internal tools and workflow automation',
      'Data-driven reporting and analytics dashboards',
      'API integrations with existing tools (CRMs, payments, ERPs)',
    ],
    approach:
      'We start with your business logic, not a tech stack. Every system is architected for your specific workflows, built in iterative sprints with weekly visibility, and engineered to scale as your business grows. No templates. No shortcuts.',
    cta: { text: "Let's discuss your software project.", button: 'Get a Quote' },
    sceneKey: 'app',
    caseStudy: null,
  },
  'web-platforms': {
    name: 'Web Platforms',
    headline: 'Web platforms that earn their keep.',
    problem: [
      "Your website is often the first conversation a customer has with your business. If it's slow, outdated, or built on a template that looks like everyone else's — you're losing credibility and customers before they even speak to you.",
    ],
    deliver: [
      'Corporate and brand websites',
      'E-commerce platforms and online stores',
      'Marketing websites with conversion optimisation',
      'Landing pages and campaign microsites',
      'Content management systems (update your own site without calling us)',
      'SEO foundations built in from day one',
      'Performance optimisation (under 2-second load times)',
    ],
    approach:
      "We don't use off-the-shelf themes. Every web platform is custom-designed for your brand and audience, built on modern frameworks like React and Next.js, and optimised for speed, accessibility, and search visibility. Mobile-first as standard.",
    cta: { text: "Let's discuss your web platform.", button: 'Get a Quote' },
    sceneKey: 'web',
    caseStudy: {
      kicker: 'Case study',
      title: 'ScreenFix',
      desc: "A professional service website for South Africa's auto glass repair specialists — built for fast quote requests and seamless customer booking.",
      result: 'Streamlined customer booking and quote requests',
      to: '/case/autoscreen',
    },
  },
  'mobile-apps': {
    name: 'Mobile Apps',
    headline: 'Mobile apps people actually keep.',
    problem: [
      "Most apps get downloaded once and forgotten. The problem is rarely the idea — it's the execution. Clunky interfaces, slow performance, and features nobody asked for. Your app needs to solve a real problem so well that users can't imagine going back to life without it.",
    ],
    deliver: [
      'iOS and Android applications',
      'Cross-platform apps (React Native, Flutter)',
      'Consumer-facing products and marketplace apps',
      'Internal business tools and field service apps',
      'UX research and interactive prototyping before development begins',
      'Push notifications, offline capability, and device-native features',
      'App Store and Google Play submission and launch support',
      'Post-launch monitoring, updates, and iteration',
    ],
    approach:
      'Every app starts with user research and prototyping — we validate the experience before writing a line of code. We build in short cycles with real device testing throughout, so what launches is what users actually need, not what a spec document assumed three months ago.',
    cta: { text: "Let's discuss your mobile app.", button: 'Get a Quote' },
    sceneKey: 'mobile',
    caseStudy: {
      kicker: 'Case study',
      title: 'GlowBook',
      desc: 'A full-featured beauty and salon booking platform enabling customers across the UK to discover services, book appointments, and manage bookings online.',
      result: 'End-to-end booking with real-time availability',
      to: '/case/looqz',
    },
  },
  'ai-systems': {
    name: 'AI Systems',
    headline: 'AI that solves problems, not just talks about them.',
    problem: [
      "AI is everywhere right now — and most of it is noise. Agencies slap \"AI-powered\" on everything without explaining what it actually does for your business. You don't need a chatbot for the sake of having one. You need to know: what time does it save, what cost does it reduce, what decision does it improve? If the answer isn't clear, it's not worth building.",
    ],
    deliver: [
      'Intelligent document processing and data extraction',
      'Workflow automation that eliminates repetitive manual tasks',
      'AI-powered chatbots and customer support systems',
      'Predictive analytics and forecasting dashboards',
      'Machine learning integrations with existing business systems',
      'Natural language processing for search, classification, and summarisation',
      'Computer vision for image recognition and quality inspection',
      "AI strategy consulting — honest assessment of where AI fits and where it doesn't",
    ],
    approach:
      "Every AI implementation starts with a business case, not a technology demo. We identify the specific process that's costing you time or money, prove the AI solution works with a focused pilot, then scale it into production. If AI isn't the right answer, we'll tell you — and recommend a simpler solution instead.",
    cta: { text: "Let's discuss your AI project.", button: 'Get a Quote' },
    sceneKey: 'ai',
    caseStudy: null,
  },
}

/* ABOUT */
export const ABOUT_PAGE = {
  eyebrow: 'ABOUT',
  heading: ['A small team that', 'builds big things.'],
  sub: 'Senior developers and designers who work directly with every client. No layers. No hand-offs.',
  story: {
    eyebrow: 'OUR STORY',
    heading: 'Why Tekniik exists.',
    paragraphs: [
      "We've spent years inside agencies — and we've seen the same problems. Talented people stuck in bloated processes. Clients treated like tickets. Projects sold by people who'd never build them.",
      "Tekniik exists because we believe it can be better. We keep our team small and senior on purpose. There's no gap between promise and delivery — because the same people do both.",
      "We're not trying to become a 50-person agency. We're trying to be the best small team you've ever worked with.",
    ],
  },
  process: {
    eyebrow: 'PROCESS',
    heading: 'Designed around clarity.',
    sub: "Here's exactly what happens. No mysteries.",
    steps: [
      { n: '1', title: 'Listen', body: 'A 30-minute conversation about your business — what works, what doesn’t, what you’re trying to achieve.', win: 'You get: an honest assessment of whether we can help.' },
      { n: '2', title: 'Plan', body: 'A clear proposal in plain English — what we’ll build, how long, and what it costs.', win: 'You get: a proposal you can actually read, with no hidden costs.' },
      { n: '3', title: 'Build', body: '1–2 week cycles. At the end of each, real working software you can test — not a status report.', win: 'You get: working software you can see and test every week.' },
      { n: '4', title: 'Launch', body: 'Final testing, deployment, and launch-day support. We launch with you, not over the fence.', win: 'You get: a smooth, stress-free launch with our team beside you.' },
      { n: '5', title: 'Support & Grow', body: 'Ongoing support, proactive maintenance, and regular check-ins as your business evolves.', win: 'You get: a long-term partner, not a one-off vendor.' },
    ],
  },
  principles: {
    eyebrow: 'PRINCIPLES',
    heading: 'What we believe.',
    items: [
      { title: 'Honesty first.', desc: "If your idea needs rethinking, we'll say so. Even if it means a smaller project." },
      { title: 'Clarity over cleverness.', desc: 'Every decision communicated in language you understand.' },
      { title: 'Engineering over shortcuts.', desc: 'No templates or copy-paste. Every system architected from the ground up for your needs.' },
      { title: 'Partnership over transactions.', desc: 'We want the right clients — where we can make a real difference.' },
    ],
  },
  finalCta: {
    heading: 'Like what you see?',
    sub: "If we're not the right fit, we'll say so. No hard feelings.",
    cta: 'Get a Quote',
  },
}

/* OFFICES — shared by the Footer location tabs and the Contact office card */
export const OFFICES = [
  {
    key: 'chennai',
    label: 'Chennai',
    country: 'India',
    lines: [
      'WeWork Block 10, DLF Cybercity',
      '124, Mount Poonamallee Rd',
      'Manapakkam, Chennai',
      'Tamil Nadu 600089',
    ],
  },
  {
    key: 'uk',
    label: 'London',
    country: 'United Kingdom',
    lines: ['71-75 Shelton Street', 'Covent Garden', 'London WC2H 9JQ'],
  },
]

/* CONTACT */
export const CONTACT_PAGE = {
  eyebrow: 'CONTACT',
  heading: ["Let's talk about", 'your project.'],
  sub: "We'll respond within one working day — a real reply from a real person.",
  form: {
    nameLabel: 'Your name',
    namePlaceholder: 'Jane Smith',
    emailLabel: 'Your email',
    emailPlaceholder: 'jane@company.co.uk',
    messageLabel: 'Tell us about your project',
    messagePlaceholder: 'What are you building? What problem are you solving?',
    submitLabel: 'Send Message',
    note: 'We reply within one working day. No automated emails.',
  },
  side: {
    heading: 'Prefer to talk directly?',
    email: 'hello@tekniik.ai',
    careersEmail: 'hr@tekniik.ai',
    careersLabel: 'Careers & hiring',
    phone: '+91 81489 84627',
    phoneRaw: '+918148984627',
    whatsappLabel: 'WhatsApp',
    availability: 'Available for meetings across the UK and at our Chennai office.',
    officeHeading: 'Visit our offices',
    nextHeading: 'What happens next?',
    next: [
      'We read your message (same day).',
      'We reply within one working day.',
      "If there's a fit, we suggest a free 30-minute call.",
      'No pressure. No obligation.',
    ],
  },
  finalCta: {
    heading: "Let's build something great.",
    sub: 'No commitment. Just a conversation.',
    emailNote: 'Email:',
    email: 'hello@tekniik.ai',
  },
}

/* CASE: LOOQZ */
export const CASE_LOOQZ = {
  eyebrow: 'CASE STUDY',
  title: 'GlowBook',
  sub: 'The modern marketplace for beauty and self-care — find and book verified beauty & wellness professionals near you.',
  stats: [
    { value: '2,100+', label: 'Verified professionals' },
    { value: '10,000+', label: 'Happy clients' },
    { value: '4.9★', label: 'Average rating' },
    { value: '8', label: 'Service categories' },
  ],
  challenge: [
    "The UK beauty and wellness industry is fragmented. Customers searching for hair salons, nail salons, barbers, or spa treatments rely on word of mouth, social media scrolling, and phone calls to book appointments. There's no easy way to compare services, check live availability, read verified reviews, or book instantly — especially outside business hours.",
    'For salon owners and independent beauty professionals, the problem is equally frustrating. Missed calls mean missed bookings. Manual scheduling leads to double-bookings and no-shows. And without a discoverable online presence, talented professionals struggle to attract new clients beyond their immediate circle.',
  ],
  builtIntro:
    'We designed and built GlowBook as a two-sided marketplace connecting beauty consumers with verified professionals across the UK. The platform covers eight service categories — Hair, Nails, Massage, Lashes, Brows, Facials, Barbering, and Spa — with city-level curation across London, Manchester, Birmingham, Leeds, and Glasgow.',
  customerHeading: 'For customers:',
  customer: [
    'Location-aware search with filters for service type, price, availability, and ratings',
    'Verified professional profiles with real client reviews, star ratings, and transparent "from" pricing',
    '"Open now" live availability filter — see salons ready for walk-ins or same-day bookings',
    'Instant booking with no phone calls — pick a stylist, choose a time, confirm in seconds',
    'Inspiration gallery with style browsing across Hair, Nails, Lashes, Barber, Makeup, and Spa categories',
    'Mobile app (iOS + Android) for booking on the go — free, no subscription',
  ],
  proHeading: 'For beauty professionals:',
  pro: [
    '"Partner with us" onboarding and Pro dashboard for managing listings, services, and pricing',
    'Appointment management with automated reminders to reduce no-shows',
    'Review collection system that builds trust and drives new bookings',
    'Business listing visibility across city pages and category searches',
  ],
  flowIntro: 'The three-step user flow is deliberately simple:',
  flow: [
    { n: '01', title: 'Search', desc: 'Browse salons near you by service, price, or availability. Read verified reviews.' },
    { n: '02', title: 'Book instantly', desc: 'Pick your stylist, choose a time, confirm in seconds. No phone calls.' },
    { n: '03', title: 'Show up and glow', desc: 'Arrive, relax, enjoy. Share your experience to help the community.' },
  ],
  result: [
    'GlowBook launched as a fully operational beauty marketplace with over 2,100 verified professionals and 10,000+ happy clients. The platform maintains a 4.9 average rating across 2,500+ reviews — a strong signal that the product genuinely works for both sides of the marketplace.',
    'Category coverage spans Hairdressers (2,400+), Barbers (1,800+), Beauty (1,500+), Nails (1,200+), Massage (960+), Makeup (780+), Lashes (640+), and Spa (520+) — with verified salons across major UK cities maintaining consistently high ratings.',
  ],
  resultIntro: 'As one verified client put it:',
  quote: {
    text: 'Lovely gel manicure by Amelia. Lasted a full two weeks with no chipping. Will be back for acrylics next time.',
    who: 'Sophie Bennett, London',
  },
  tags: ['Marketplace', 'Real-time Booking', 'Verified Profiles', 'Mobile App', 'City Pages', 'Pro Dashboard'],
  finalCta: {
    heading: 'Building a marketplace or booking platform?',
    sub: "We've done it before. Let's talk about yours.",
    cta: 'Get a Quote',
  },
}

/* CASE: AUTOSCREEN */
export const CASE_AUTOSCREEN = {
  eyebrow: 'CASE STUDY',
  title: 'ScreenFix',
  sub: 'Auto glass repair & replacement — dispatched to you on demand. A platform connecting vehicle owners with verified fitters across South Africa.',
  stats: [
    { value: '15,000+', label: 'Jobs completed' },
    { value: '500+', label: 'Verified fitters' },
    { value: '4.8★', label: 'Average rating' },
    { value: '98%', label: 'Customer satisfaction' },
  ],
  challenge: [
    'When your windscreen cracks, you need it fixed fast. But the traditional auto glass experience in South Africa is fragmented — customers call around for quotes, struggle to verify quality, and have no visibility into when a fitter will actually arrive. Pricing is opaque, and there’s no guarantee the glass meets safety standards.',
    'ScreenFix needed more than a website. They needed a service platform — an on-demand dispatch system that works like Uber for auto glass, connecting vehicle owners with nearby verified fitters in real time.',
  ],
  builtIntro:
    'We designed and built ScreenFix as a full-service marketplace platform with on-demand dispatch, live job tracking, and an instant quoting engine:',
  coreHeading: 'Core platform:',
  core: [
    'Instant quote tool — select vehicle make, model, and year to get pricing in minutes',
    "On-demand fitter dispatch — requests broadcast to verified fitters in the customer's area",
    'Live status tracking — Requested → Accepted → On the way → Completed',
    'Transparent pricing from R500 (chip repair) to R2,600+ (full windscreen replacement)',
    'Secure payment — pay only after accepting a quote, no upfront cost',
    'Insurance claim documentation and assistance',
  ],
  coverageHeading: 'Service coverage:',
  coverage: [
    'Windscreen Replacement (from R2,600) — OE-quality glass, mobile or workshop',
    'Side Window Replacement (from R1,300) — driver, passenger, or rear side',
    'Rear Glass Replacement (from R2,000) — including defogger reconnection',
    'Chip & Crack Repair (from R500) — prevent full replacement',
  ],
  flowIntro:
    "The four-step flow is designed for urgency — because a cracked windscreen isn't something you schedule for next month:",
  flow: [
    { n: '01', title: 'Request service', desc: 'Select your vehicle, describe the issue, confirm location.' },
    { n: '02', title: 'Fitters notified', desc: 'Request broadcast to verified fitters nearby.' },
    { n: '03', title: 'Fitter accepts', desc: 'First available fitter confirms with ETA.' },
    { n: '04', title: 'Get it done', desc: 'Service at your location. Pay when satisfied.' },
  ],
  result: [
    'ScreenFix has completed over 15,000 jobs through its platform with a 4.8-star average rating and 98% customer satisfaction. The network now includes 500+ verified fitters covering 100+ suburbs across Johannesburg, Cape Town, Durban, Pretoria, and Gqeberha — with same-day service available in high-demand areas.',
    'The on-demand dispatch model transformed ScreenFix from a traditional service business into a technology-driven marketplace — giving them a structural advantage over competitors still operating on phone calls and manual coordination.',
  ],
  resultIntro: 'What customers say:',
  quotes: [
    {
      text: 'Got quotes in minutes, and the fitter was at my Sandton office the same day. Couldn’t be easier.',
      who: 'Sipho Ndlovu, Johannesburg',
    },
    {
      text: 'Compared three providers through the platform. Great price for my Golf rear window and the fitter was professional.',
      who: 'Megan Pretorius, Cape Town',
    },
  ],
  tags: ['On-demand Dispatch', 'Live Tracking', 'Instant Quoting', 'Marketplace', 'WhatsApp Integration'],
  finalCta: {
    heading: 'Building a service marketplace?',
    sub: "We've built dispatch platforms that scale. Let's talk.",
    cta: 'Get a Quote',
  },
}

export const FOOTER = {
  tag: 'Technology built right.',
  email: 'hello@tekniik.ai',
  careersEmail: 'hr@tekniik.ai',
  whatsapp: '+918148984627',
  whatsappLabel: 'WhatsApp · +91 81489 84627',
  offices: OFFICES,
  cols: [
    {
      label: 'Pages',
      links: [
        { label: 'Home', to: '/' },
        { label: 'Services', to: '/services' },
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
      ],
    },
    {
      label: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms of Service', to: '/terms-of-service' },
        { label: 'Cookie Policy', to: '/cookie-policy' },
        { label: 'GDPR Compliance', to: '/gdpr' },
      ],
    },
  ],
  copyright: '© 2026 Tekniik. All rights reserved.',
  madeWith: 'Made with love and code by Tekniik Team',
}
