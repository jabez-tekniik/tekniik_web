# Tekniik — Website Redesign Brief for Claude Code

> **How to use:** Drop this file + `tekniik-prototype-v4.html` into Claude Code. Run with Opus for the planning pass, then Sonnet for execution. Read the skill files at `/mnt/skills/public/frontend-design/SKILL.md` before writing any code.

---

## 1. Role & Goal

You are building a brand-new visual treatment for **Tekniik**, a UK agency that builds websites, web apps, mobile apps, and AI systems.

The **content, copy, information architecture, and pages are LOCKED** — they live in `tekniik-prototype-v4.html`. Treat that file as a content wireframe, **not** a visual reference. Read it end-to-end before you do anything else, then throw away its visual language entirely and build a fresh one.

The goal is a single self-contained `tekniik-v5.html` that feels like a 2026 top-tier developer-tools landing page — premium, technical, light-themed, deeply animated.

---

## 2. The brief in one line

**Light-themed, tech-aesthetic, premium, animated.** Reference territory: Linear, Vercel, Resend, Cursor, Arc, Modal, PostHog, Stripe. **Avoid** territory: warm-craft agency, generic Webflow template, dark-mode SaaS, neumorphism, illustration-heavy.

---

## 3. Inputs (canonical, do not deviate)

`tekniik-prototype-v4.html` is the source of truth for:

- All copy, headlines, microcopy — **verbatim, no paraphrasing**
- Page structure: Home, Services, About, Contact, and the two case studies (Looqz, AutoScreen)
- Stats: 50+ projects, 98% retention, 4.9★, 15,000+ jobs, 2,100+ professionals, etc.
- Portfolio entries: Trafford Care Consultancy, Looqz, Escape Debt Review, Famili Cloud, AutoScreen, Cape Granite Works, Refurnish, Southern Packaging
- Service descriptions and tech stacks (React/Next.js, Node.js, Python, React Native, etc.)
- Four-step process (Listen / Plan / Build / Launch & Grow) and six-step detailed process
- Four principles (Honesty, Clarity, Quality, Partnership)
- The James Crawford testimonial
- Contact: `hello@tekniik.co.uk`, UK

Extract content exactly. If something feels too long for your new layout, redesign the layout — don't shorten the copy.

---

## 4. What to discard from the source

- Cream/warm background palette (`#FFFBF5`, etc.)
- The purple-gold dual-accent system
- Current hero composition and orb stack
- Current terminal styling (you'll build a better one)
- All current decorative SVGs in portfolio cards and service blocks
- Current bento card and folio card chrome
- The grain noise overlay

**Keep:** the typeface trio — `Sora` (heads), `DM Sans` (body), `JetBrains Mono` (mono). These are already tech-coded and on-brand. Lean into the mono harder than the source does.

---

## 5. Design system

### 5.1 Color tokens

Single confident accent. No double-accent dance.

```
--bg:           #F7F8FA        /* near-white, slightly cool */
--surface:      #FFFFFF        /* elevated card surface */
--ink:          #0A0F1C        /* near-black, depth */
--ink-2:        #1F2937        /* secondary heading */
--body:         #3B4252        /* body text */
--muted:        #6B7280        /* meta, captions */
--border:       rgba(10,15,28,0.08)
--border-soft:  rgba(10,15,28,0.04)
--accent:       #5B5BFF        /* electric indigo — Tekniik's primary signal */
--accent-deep:  #4338CA
--accent-soft:  rgba(91,91,255,0.08)
--success:      #10B981        /* used only for done states, sparingly */
```

No gold. No warm cream. No second accent.

### 5.2 Typography

- H1 display: `Sora` 800, `clamp(3.5rem, 7vw, 6.5rem)`, letter-spacing `-0.045em`, line-height `1.02`
- H2: `Sora` 700, `clamp(2rem, 4vw, 3.25rem)`, letter-spacing `-0.03em`
- Body: `DM Sans` 400/500, `16px`, line-height `1.65`
- Mono: `JetBrains Mono` 400, used aggressively for:
  - Section eyebrows (`// THE PROBLEM`, `// 01 LISTEN`)
  - Stat captions
  - Tag chips
  - Metadata (year, location, status)
  - Code blocks
  - Tiny UI labels
- Mono eyebrows always ALL-CAPS, 11–12px, with leading `//` or `›` glyph

### 5.3 Texture & surface

- **Global background:** subtle dot grid, 24px spacing, `rgba(10,15,28,0.05)` opacity, fixed position so it doesn't scroll-jitter
- **Hero ambient:** one soft indigo mesh gradient blob, ~8% opacity, slow drift animation (40s+)
- **Borders:** hairlines only, never heavier than 1px
- **Cards:** 1px hairline border + 1px inset highlight on top edge to fake glass depth + 16–20px radius
- **Shadows:** no default shadows on cards. Reveal on hover only (`0 12px 40px rgba(10,15,28,0.06)`)
- **Glass panels:** for floating elements use `backdrop-filter: blur(20px)` + 80% white + hairline border

### 5.4 Layout

- 12-column mental grid, generous gutters
- Section padding: `clamp(80px, 10vw, 140px)` vertical
- Max content width: `1320px`
- Whitespace is the premium signal — err generous
- Section dividers: 1px hairline, full-bleed or 80% width centered

---

## 6. Hero (the most important screen)

This is what sells the rest of the site. Replace the current hero entirely.

- Full viewport on desktop, comfortable on mobile
- **Left column (60%):**
  - Mono eyebrow: `// WEB · APPS · AI · PARTNERSHIP`
  - H1: `Technology built right.` with a word-by-word fade + 12px y-rise on load, 80ms stagger
  - Subhead from source HTML
  - Primary CTA `Get a Quote` (solid indigo) + ghost CTA `See how we work →`
  - Below CTAs: a tiny mono row showing live "trust" mono — e.g., `● ONLINE` `// 4.9★ · 50+ PROJECTS · UK`
- **Right column (40%):** pick ONE of these and execute it well:
  - **A — Refined terminal.** Mac-style traffic-light dots, glass surface, soft outer shadow. Type-on code that cycles four states (one per Tekniik capability), realistic syntax highlighting in a *light* palette (purple keywords, teal strings, slate punctuation — NOT VS Code dark). Blinking cursor. Pauses on hover.
  - **B — Animated architecture graph.** Inline SVG of 8–12 nodes connecting; edges draw in on load, then gentle perpetual sway. Nodes labeled with mono micro-text (`api`, `db`, `auth`, `cdn`, etc.).
  - **C — Frosted dashboard mock.** Glass card showing fake-plausible metrics: deploy uptime, lighthouse scores, response time sparkline. Numbers count up on enter. Sparkline animates.
- **Ambient:** one slow-drifting indigo mesh blob behind the right column. No multi-orb stacks.

Choose A unless you have a strong reason — it's the most on-brand for Tekniik's voice.

---

## 7. Required animations & interactions

All motion must be GPU-friendly (`transform`/`opacity` only) and respect `prefers-reduced-motion` (disable all non-essential motion when set).

1. **Scroll reveals** — every major block fades + 16px y-rise on enter, easing `cubic-bezier(0.22, 1, 0.36, 1)`, IntersectionObserver threshold 0.1, children stagger 80ms
2. **Magnetic primary CTA** — button gently translates toward cursor within 40px radius, springs back on leave
3. **Animated counters** — every stat number (50+, 98%, 4.9★, 15,000+, 2,100+, etc.) counts up over ~1.4s when scrolled into view, easing out
4. **Marquee strip** — slower than the source, mono font, pipe-separated, pauses on hover, hairline divider above and below
5. **Capability bento cards** — on hover: 4px lift, border tint shifts to indigo, icon scales 1.08 + rotates 6°, label arrow nudges right
6. **Portfolio cards** — image area zoom 1.04 on hover with smooth ease, tag chips fade-in stagger, "View project →" arrow translates 4px right
7. **Process steps** — horizontal timeline that *draws* a connecting line as you scroll through, with each step's number badge filling in indigo as it crosses the viewport center
8. **Custom cursor accent** — desktop only: a 6px indigo dot trails the system cursor with 80ms lag, scales 2× on hoverable elements (links, buttons, cards). Hide on touch devices.
9. **Page transitions** — fade-out 120ms / fade-in 240ms with 8px y-offset on the SPA route swap. No scroll-jacking. No page-flash.
10. **Hero visual** — auto-cycles every 4–5s; pauses on user hover; resumes after 3s idle
11. **Form** — labels float on focus, inputs get an animated indigo underline that draws left-to-right on focus, submit shows inline success state with a checkmark draw
12. **Nav scroll state** — translucent + no border at top of page, white + hairline bottom border with subtle backdrop-blur once scrolled past 30px

**Performance budget:** Lighthouse Performance ≥ 90 on mobile. No animation library imports.

---

## 8. Component direction

- **Navbar** — translucent → solid white on scroll; mono nav links; primary pill CTA on the right
- **Buttons** — primary: solid indigo, white text, 12px radius, slight 0.98 scale on active; secondary: ghost with hairline border that fills indigo on hover
- **Tag chips** — `JetBrains Mono`, ALL-CAPS, 10–11px, pill, soft indigo-tinted bg, hairline border
- **Stat blocks** — big `Sora` 800 number on top, mono caption below, hairline divider above. Optional tiny sparkline in indigo for select stats.
- **Code blocks** — `JetBrains Mono`, light-on-light syntax (slate punctuation, indigo keywords, teal strings, muted comments), line numbers in gutter, soft border
- **Section eyebrows** — mono ALL-CAPS prefixed with `//` or `›`
- **Portfolio cards** — replace ALL existing decorative SVGs with new ones. Style direction: minimalist line-art mock UIs in indigo on tinted backgrounds, OR abstract geometric compositions. Pick one approach and apply consistently across all 8 portfolio entries.
- **Process timeline** — horizontal on desktop, vertical on mobile, with a drawn connecting line that animates on scroll

---

## 9. Pages to build

All five from the source HTML, no omissions:

1. **Home** — hero, problem section, capabilities bento, why-Tekniik grid, process strip, portfolio grid, testimonial, final CTA
2. **Services** — four detailed service blocks (Websites, Web Apps, Mobile Apps, AI), each with its own visual + tech stack mono line
3. **About** — story, six-step detailed process, four principles, final CTA
4. **Contact** — form + side panel
5. **Case studies** — Looqz and AutoScreen, with stats grids, challenge/built/result narrative

Use the same in-page SPA routing pattern as the source (`go(page)` swap), but make the transition smooth (see §7.9).

---

## 10. Technical requirements

- **Output:** single self-contained `tekniik-v5.html` with embedded `<style>` and `<script>`
- **No build step, no framework, no npm**
- **No CSS framework** — write hand-crafted CSS using custom properties, `clamp()`, `:has()`, container queries where useful
- **No animation library** — vanilla CSS transitions/animations + small custom JS using IntersectionObserver and `requestAnimationFrame`
- **All SVGs inline** — no external image assets
- **Fonts:** preconnect + Google Fonts as the source already does
- **Accessibility:**
  - WCAG AA contrast on every text element
  - Keyboard navigable, visible focus rings (custom indigo ring, not browser default)
  - Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
  - `prefers-reduced-motion` honored everywhere
  - Form labels properly associated
- **Responsive:** breakpoints at 640 / 1024 / 1280. Mobile is first-class, not an afterthought. Touch targets ≥ 44px.
- **Browser target:** modern evergreen only

---

## 11. Workflow

1. Read `tekniik-prototype-v4.html` in full and extract all copy into a content map
2. Read `/mnt/skills/public/frontend-design/SKILL.md`
3. **Plan first** — output a short design system spec (tokens, type scale, component inventory) and a hero direction choice (A/B/C with reasoning) before writing any markup
4. Build the home page end-to-end first, get it polished, then template the rest
5. Test reduced-motion mode and mobile before declaring done
6. Final file goes to `/mnt/user-data/outputs/tekniik-v5.html`

---

## 12. Acceptance criteria

The finished site must:

- Look indistinguishable from a 2026 top-tier dev-tools company landing page on first scroll
- Use **zero** decorative styling carried over from the source file
- Carry **every word** of copy from the source unchanged
- Run smoothly with no jank — animations are GPU-only
- Degrade gracefully under `prefers-reduced-motion`
- Feel premium on a 375px iPhone screen, not just on a 27" monitor
- Score ≥ 90 on Lighthouse Performance and ≥ 95 on Accessibility
- Pass keyboard-only navigation across every interactive element

---

## 13. Anti-patterns to avoid

- Generic gradient backgrounds (purple-to-pink hero washes)
- Glass-morphism on everything (use it sparingly, on floating elements only)
- Aurora blobs covering 30%+ of screen
- Drop shadows on every card by default
- Animated emoji or 3D Spline embeds
- Sentence-case mono labels (mono should be ALL-CAPS or lowercase code)
- Two competing accent colors
- Scroll-jacking, locked scroll, or horizontal-scroll-on-vertical-input
- "Hero text written by an LLM" feel — copy is locked, do not rewrite
- Lorem ipsum anywhere

---

Begin with the plan. Ship the file.
