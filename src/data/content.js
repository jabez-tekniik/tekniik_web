/* Copy originally extracted from references/tekniik-prototype-v4.html.
   Homepage copy humanized 2026-07-13 per user (no em dashes, natural voice). */

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const HERO = {
  eyebrow: 'WEB · APPS · AI · PARTNERSHIP',
  headline: ['Technology', 'built', 'right.'],
  sub: 'We design and build websites, web apps, mobile apps, and AI-powered systems for businesses that need technology they can actually rely on.',
  primaryCta: { label: 'Get a Quote', to: '/contact' },
  ghostCta: { label: 'See how we work', to: '/about' },
  trust: '4.9★ · 50+ PROJECTS · UK · INDIA',
}

export const TERMINAL_FRAMES = [
  { type: 'website', result: '2.1s load · 4x leads' },
  { type: 'web-app', result: '15hrs saved / week' },
  { type: 'mobile-app', result: '4.8★ app store' },
  { type: 'ai-automation', result: '3hrs → 20min' },
]

export const MARQUEE = [
  { value: '50+', label: 'projects delivered' },
  { value: '98%', label: 'client retention' },
  { value: '4.9★', label: 'average rating' },
  { value: 'Senior', label: 'team only' },
  { value: 'AI-native', label: 'development' },
  { value: 'Long-term', label: 'partnerships' },
]

export const PROBLEM = {
  eyebrow: 'THE PROBLEM',
  heading: "You've probably been here before.",
  paragraphs: [
    "You hired an agency. They promised bespoke solutions, agile methodology, cutting-edge technology. Then deadlines slipped. Budgets ballooned. The junior developer who built your project had never spoken to you.",
    "We hear this constantly. It's the reason Tekniik exists. Agency work can be better than this.",
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
  eyebrow: 'WHAT WE BUILD',
  heading: ['Four capabilities.', 'One team.'],
  sub: 'We focus where we deliver real, measurable impact.',
  items: [
    {
      key: 'web',
      title: 'Websites',
      desc: 'Your website is your most important salesperson. We build sites that are fast, clear, and convert visitors into customers. Custom design, no templates.',
      featured: true,
    },
    {
      key: 'app',
      title: 'Web Apps',
      desc: 'Dashboards, portals, and tools that replace spreadsheets.',
    },
    {
      key: 'mobile',
      title: 'Mobile Apps',
      desc: 'iOS, Android, or both. Designed around real behaviour.',
    },
    {
      key: 'ai',
      title: 'AI & Automation',
      desc: 'Practical AI that saves time. No hype, just results.',
    },
  ],
}

export const WHY_TEKNIIK = {
  eyebrow: 'WHY TEKNIIK',
  heading: 'We do things differently.',
  sub: 'Not for the sake of it. Our clients demand better.',
  items: [
    {
      key: 'team',
      title: 'Senior team, direct access.',
      desc: 'You work with the people building your project. No account managers. No juniors.',
    },
    {
      key: 'clarity',
      title: 'Radical clarity.',
      desc: "Plain English. No jargon. You always know what's happening and what it costs.",
    },
    {
      key: 'ai',
      title: 'AI built in, not bolted on.',
      desc: 'Smarter systems come as standard, woven into every solution rather than sold as an upsell.',
    },
    {
      key: 'partner',
      title: 'Partnership, not projects.',
      desc: "We don't disappear after launch. We stay, maintaining and evolving your systems.",
    },
  ],
}

export const PROCESS = {
  eyebrow: 'HOW WE WORK',
  heading: 'Four chapters. One outcome.',
  sub: 'Every step structured so you always know what’s next.',
  steps: [
    { n: '01', title: 'Listen', duration: '~1 week', desc: "We understand your business first. What you're trying to achieve." },
    { n: '02', title: 'Plan', duration: '~1 week', desc: 'Clear proposal with scope, timeline, and investment.' },
    { n: '03', title: 'Build', duration: '4–12 weeks', desc: 'Short cycles. Real progress every week.' },
    { n: '04', title: 'Launch & Grow', duration: 'Ongoing', desc: 'We launch together, then stay on as your partner.' },
  ],
}

export const PORTFOLIO = {
  eyebrow: 'OUR WORK',
  heading: 'Real results. Real businesses.',
  sub: "A selection of projects we've designed, built, and continue to support.",
  items: [
    {
      slug: 'tcc',
      title: 'CareGrid',
      tags: ['Healthcare', 'Web Platform', 'Netherlands'],
      desc: 'We developed a comprehensive all-in-one management platform for CareGrid, a leader in the Dutch healthcare industry. The application streamlines operations for both clients and staff, supporting efficient management and seamless service delivery across the organisation.',
      result: 'Serving 1,000+ clients with streamlined operations',
      featured: true,
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'looqz',
      title: 'GlowBook',
      tags: ['Beauty & Wellness', 'Booking Platform', 'France'],
      desc: 'A full-featured beauty and salon booking platform enabling customers across France to discover services, book appointments, and manage bookings seamlessly online.',
      result: 'End-to-end booking with real-time availability',
      route: '/case/looqz',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'escape',
      title: 'ClearPath',
      tags: ['Financial Services', 'Web Application', 'Italy'],
      desc: 'An end-to-end platform linking users with experienced Italian attorneys for debt review flag removal, helping hundreds achieve financial freedom through a seamless online process.',
      result: 'Hundreds of customers helped to financial freedom',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'famili',
      title: 'StoryNest',
      tags: ['Family & Lifestyle', 'Cloud Platform', 'Sweden'],
      desc: "A cloud-based family story preservation platform where Swedish families can capture, organise, and share their most precious memories and stories for future generations.",
      result: 'Every family has a story worth preserving',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'autoscreen',
      title: 'ScreenFix',
      tags: ['Automotive', 'Service Website', 'Germany'],
      desc: "A professional service website for ScreenFix, Germany's auto glass repair and replacement specialists. Built for fast quote requests and seamless customer booking.",
      result: 'Streamlined customer booking and quote requests',
      route: '/case/autoscreen',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'cape',
      title: 'StoneCraft',
      tags: ['Manufacturing', 'E-commerce Website', 'Portugal'],
      desc: 'A customer-centric website for premium granite worktops in Porto, featuring seamless product browsing, viewing, and quote requests that have driven numerous customer enquiries.',
      result: 'Significant increase in online customer enquiries',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'refurnish',
      title: 'ReNest',
      tags: ['Retail & Warehouse', 'Web + POS App', 'Belgium'],
      desc: 'A new website and POS application for ReNest in Antwerp to digitise warehouse operations, facilitate online sale of refurbished products, and enhance in-store sales management.',
      result: 'Digitised warehouse operations and online sales',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'React Native', 'AWS', 'Firebase'],
    },
    {
      slug: 'southern',
      title: 'BoxWorks',
      tags: ['Packaging Industry', 'Product Website', 'Poland'],
      desc: "A product catalogue website presenting BoxWorks's diverse range of Polish packaging clearly, with categorised products to enhance browsing and easy enquiry forms for efficient customer communication.",
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
    name: 'Marieke van Dijk',
    role: 'Operations Director, CareGrid',
  },
  {
    text: 'From the first call it felt like they were part of our team. Bookings that used to take phone calls now happen in seconds, and our salons noticed the difference immediately.',
    name: 'Camille Laurent',
    role: 'Founder, GlowBook',
  },
  {
    text: 'Fast, precise, and no surprises. They shipped exactly what was scoped, in the week they said they would. Quote requests have more than doubled since the site went live.',
    name: 'Stefan Bauer',
    role: 'Managing Director, ScreenFix',
  },
  {
    text: 'We are craftsmen, not technologists, and they respected that. They translated what we do into a website that finally sells it properly. Enquiries have never been stronger.',
    name: 'Rui Almeida',
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
      { n: '1', title: 'Discovery Call', body: '30 minutes. Your business, not your tech stack.', win: 'You get: an honest assessment.' },
      { n: '2', title: 'Proposal & Scope', body: "What we'll build, how long, what it costs.", win: 'You get: no hidden costs.' },
      { n: '3', title: 'Design & Prototype', body: 'See it before we build it.', win: 'You get: confidence before code.' },
      { n: '4', title: 'Development', body: '1-2 week cycles. Working software.', win: 'You get: progress every week.' },
      { n: '5', title: 'Launch', body: 'Testing, deployment, support. Together.', win: 'You get: a smooth launch.' },
      { n: '6', title: 'Grow', body: 'Ongoing support, maintenance, evolution.', win: 'You get: a long-term partner.' },
    ],
  },
  principles: {
    eyebrow: 'PRINCIPLES',
    heading: 'What we believe.',
    items: [
      { title: 'Honesty over comfort.', desc: "If your idea needs rethinking, we'll say so. Even if it means a smaller project." },
      { title: 'Clarity over cleverness.', desc: 'Every decision communicated in language you understand.' },
      { title: 'Quality over speed.', desc: "We'd rather take an extra week than ship something we're not proud of." },
      { title: 'Partnership over transactions.', desc: 'We want the right clients — where we can make a real difference.' },
    ],
  },
  finalCta: {
    heading: 'Like what you see?',
    sub: "If we're not the right fit, we'll say so. No hard feelings.",
    cta: 'Get a Quote',
  },
}

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
    officeHeading: 'Visit our office',
    officeLines: [
      'WeWork Block 10, DLF Cybercity',
      '124, Mount Poonamallee Rd',
      'Manapakkam, Chennai',
      'Tamil Nadu 600089, India',
    ],
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
    "The French beauty and wellness industry is fragmented. Customers searching for coiffeurs, nail salons, barbers, or spa treatments rely on word of mouth, social media scrolling, and phone calls to book appointments. There's no easy way to compare services, check live availability, read verified reviews, or book instantly — especially outside business hours.",
    'For salon owners and independent beauty professionals, the problem is equally frustrating. Missed calls mean missed bookings. Manual scheduling leads to double-bookings and no-shows. And without a discoverable online presence, talented professionals struggle to attract new clients beyond their immediate circle.',
  ],
  builtIntro:
    'We designed and built GlowBook as a two-sided marketplace connecting beauty consumers with verified professionals across France. The platform covers eight service categories — Hair, Nails, Massage, Lashes, Brows, Facials, Barbering, and Spa — with city-level curation across Paris, Lyon, Marseille, Toulouse, and Nice.',
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
    'Category coverage spans Hairdressers (2,400+), Barbers (1,800+), Beauty (1,500+), Nails (1,200+), Massage (960+), Makeup (780+), Lashes (640+), and Spa (520+) — with verified salons across major French cities maintaining consistently high ratings.',
  ],
  resultIntro: 'As one verified client put it:',
  quote: {
    text: 'Lovely gel manicure by Amélie. Lasted a full two weeks with no chipping. Will be back for acrylics next time.',
    who: 'Camille Laurent, Paris',
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
  sub: 'Auto glass repair & replacement — dispatched to you on demand. A platform connecting vehicle owners with verified fitters across Germany.',
  stats: [
    { value: '15,000+', label: 'Jobs completed' },
    { value: '500+', label: 'Verified fitters' },
    { value: '4.8★', label: 'Average rating' },
    { value: '98%', label: 'Customer satisfaction' },
  ],
  challenge: [
    'When your windscreen cracks, you need it fixed fast. But the traditional auto glass experience in Germany is fragmented — customers call around for quotes, struggle to verify quality, and have no visibility into when a fitter will actually arrive. Pricing is opaque, and there’s no guarantee the glass meets safety standards.',
    'ScreenFix needed more than a website. They needed a service platform — an on-demand dispatch system that works like Uber for auto glass, connecting vehicle owners with nearby verified fitters in real time.',
  ],
  builtIntro:
    'We designed and built ScreenFix as a full-service marketplace platform with on-demand dispatch, live job tracking, and an instant quoting engine:',
  coreHeading: 'Core platform:',
  core: [
    'Instant quote tool — select vehicle make, model, and year to get pricing in minutes',
    "On-demand fitter dispatch — requests broadcast to verified fitters in the customer's area",
    'Live status tracking — Requested → Accepted → On the way → Completed',
    'Transparent pricing from €35 (chip repair) to €140+ (full windscreen replacement)',
    'Secure payment — pay only after accepting a quote, no upfront cost',
    'Insurance claim documentation and assistance',
  ],
  coverageHeading: 'Service coverage:',
  coverage: [
    'Windscreen Replacement (from €140) — OE-quality glass, mobile or workshop',
    'Side Window Replacement (from €75) — driver, passenger, or rear side',
    'Rear Glass Replacement (from €110) — including defogger reconnection',
    'Chip & Crack Repair (from €35) — prevent full replacement',
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
    'ScreenFix has completed over 15,000 jobs through its platform with a 4.8-star average rating and 98% customer satisfaction. The network now includes 500+ verified fitters covering 100+ districts across Berlin, Munich, Hamburg, Cologne, and Frankfurt — with same-day service available in high-demand areas.',
    'The on-demand dispatch model transformed ScreenFix from a traditional service business into a technology-driven marketplace — giving them a structural advantage over competitors still operating on phone calls and manual coordination.',
  ],
  resultIntro: 'What customers say:',
  quotes: [
    {
      text: 'Got quotes in minutes, and the fitter was at my Mitte office the same day. Couldn’t be easier.',
      who: 'Lukas Müller, Berlin',
    },
    {
      text: 'Compared three providers through the platform. Great price for my Golf rear window and the fitter was professional.',
      who: 'Anna Fischer, Munich',
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
  offices: [
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
      lines: [
        '71-75 Shelton Street',
        'Covent Garden',
        'London WC2H 9JQ',
        'United Kingdom',
      ],
    },
  ],
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
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms of Service', to: '#' },
        { label: 'GDPR Cookie Policy', to: '#' },
      ],
    },
  ],
  copyright: '© 2026 Tekniik. All rights reserved.',
  madeWith: 'Made with love and code by Tekniik Team',
}
