# Homepage revamp — round 2 refinements (2026-07-07)

User feedback on the "Bold Editorial" homepage:
1. IBM Plex Mono looks "code-like / not nice" → replace the mono label font with **Inter itself**.
2. Testimonial + FinalCta are both near-black bands sitting next to each other → differentiate. Make **Testimonial light**, leave FinalCta as the single dark crescendo.
3. Numbers section (LogoStrip) → show **only numeric stats**; remove the 3 non-numeric values (Senior, AI-native, Long-term).
4. "What we build" (ServiceShowcase) cards → **add images**. Old service images are dark/pink with garbled fake UI text; regenerate as light indigo-restrained ABSTRACT forms via `scripts/generateTekniikImages.js`, wire into cards.
5. Hero is "too normal" (standard split) → **unusual, awwwards/mobbin-worthy layout**: oversized poster headline + full-bleed infinite proof-ticker of the real outcome metrics; drop the right-side cascade.

## Steps — ALL COMPLETE (2026-07-07)
- [x] 1. Fonts: index.html drop IBM Plex Mono; tokens.css `--f-mono` → Inter.
- [x] 2. Numbers: LogoStrip filters to numeric-only (50+, 98%, 4.9★); CSS grid → bold 3-up.
- [x] 3. Regen service images: rewrote ABSTRACT style + 4 svc prompts (light indigo, 4:3), ran generator (4 ok), wired into image-forward ServiceShowcase cards + CSS.
- [x] 4. Testimonial → light section (light → dark FinalCta rhythm).
- [x] 5. Hero → oversized poster headline + drawn marker + full-bleed proof ticker; cascade removed.
- [x] 6. Verified: build + lint clean; no h-scroll at 320/375/1440; reduced-motion honored; 0 console errors (only pre-existing benign useScroll warning). CLAUDE.md + ISSUES.md updated. QA screenshots deleted.

## Constraints
- Copy verbatim from content.js (filtering displayed stats is OK; no wording changes).
- Motion primitives reused; reduced-motion honored everywhere.
- No horizontal scroll at any breakpoint. LINT: no setState-in-effect.
