/**
 * Vysa — Gemini Imagen 4 Image Generation Script
 *
 * Generates hero/section images for the design overhaul and saves them
 * as static assets. Run this once per batch; generated files are committed.
 *
 * Usage:
 *   node scripts/generateImages.js                  # generate all pending
 *   node scripts/generateImages.js --page howitworks
 *   node scripts/generateImages.js --dry-run        # preview prompts only
 *
 * Requirements:
 *   GEMINI_API_KEY in .env or environment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Auto-load GEMINI_API_KEY from common .env locations if not already set
if (!process.env.GEMINI_API_KEY) {
  for (const p of [
    path.resolve(ROOT, '.env'),
    path.resolve(ROOT, 'vysa_node/.env'),
    path.resolve(ROOT, 'busline_web/.env'),
  ]) {
    try {
      const m = fs.readFileSync(p, 'utf8').match(/^GEMINI_API_KEY\s*=\s*(.+)$/m);
      if (m) { process.env.GEMINI_API_KEY = m[1].trim().replace(/^["']|["']$/g, ''); break; }
    } catch { /* ignore */ }
  }
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const API_KEY = process.env.GEMINI_API_KEY;
// --model=<id> CLI override (e.g. imagen-4.0-ultra-generate-001 for premium tier)
const MODEL = process.argv.find((a) => a.startsWith('--model='))?.split('=')[1]
  || 'imagen-4.0-generate-001';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;
const REFINE_MODEL = 'gemini-2.5-flash-image';
const REFINE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${REFINE_MODEL}:generateContent?key=${API_KEY}`;

const REFINE_INSTRUCTION =
  'Refine this image: unify editorial neutral tone grading with balanced natural light, muted and slightly desaturated palette (no overly warm orange/terracotta push), remove any identifiable faces, remove any visible text, logos, brands or signage, deepen vignette slightly, maintain the original composition and framing. Return a single refined image only.';

/**
 * Supported aspect ratios and their intended use cases.
 * Imagen 3 automatically selects the highest available resolution per ratio.
 *
 * | Ratio | Pixels (approx) | Use case                         |
 * |-------|-----------------|----------------------------------|
 * | 16:9  | 1408 × 768      | Hero banners, wide feature panels |
 * | 4:3   | 1280 × 960      | Feature cards, USP sections       |
 * | 3:4   | 960 × 1280      | Auth split panels, tall cards     |
 * | 1:1   | 1024 × 1024     | Avatars, square thumbnails        |
 * | 9:16  | 768 × 1408      | Mobile hero, story-style panels   |
 */
const ASPECT_RATIOS = {
  WIDE: '16:9',
  LANDSCAPE: '4:3',
  PORTRAIT: '3:4',
  SQUARE: '1:1',
  TALL: '9:16',
};

// ---------------------------------------------------------------------------
// Image manifest — one entry per image asset needed across both frontends
// ---------------------------------------------------------------------------
// Each entry:
//   id        — unique file slug (saved as <id>.jpg)
//   prompt    — Gemini Imagen generation prompt
//   ratio     — one of ASPECT_RATIOS values
//   dest      — output directory relative to project root
//   page      — logical grouping for --page filter

const IMAGES = [
  // ── busline_web · Homepage ───────────────────────────────────────────────

  {
    id: 'hero-illustration',
    prompt:
      'Ultra-premium editorial marketing illustration designed to be the FULL-BLEED BACKGROUND of a hero section on a high-end bus booking platform website, rendered in the refined soft-gradient flat-vector style of Stripe, Linear, Revolut and Airbnb brand graphics. 16:9 horizontal cinematic aspect ratio.\n\n' +
      'CRITICAL COMPOSITION RULE: The image must be split into two deliberate vertical zones. The ENTIRE UPPER 60% OF THE FRAME IS EMPTY ATMOSPHERIC SKY — a smooth clean soft-gradient negative space reserved for overlaid website text and a search bar component. This upper region must contain NOTHING but a gentle smooth gradient from warm cream at the horizon fading upward into pale lavender-purple at the very top, no clouds, no birds, no decorations, no illustration elements whatsoever — keep it generous, airy and completely empty so a large headline and search bar can sit cleanly on top. The LOWER 40% OF THE FRAME contains all the illustration subject matter grounded at the bottom edge.\n\n' +
      'Lower 40% content: ONE sleek premium modern long-distance intercity coach bus viewed in precise clean side profile, centred horizontally in the lower band with balanced negative space to the left and right. Accurate realistic modern touring-coach proportions (NOT toy-like, NOT stretched, NOT cartoonish). Body painted smooth deep violet-purple (#6763db) with ONE subtle warm amber-gold (#f59e0b) horizontal pinstripe running along the mid-body. Large continuous smooth ribbon of tinted panoramic side windows rendered as a single uniform dark indigo gradient — zero silhouettes, zero passengers, zero icons, zero text, zero graphics inside the windows, the windows are a completely clean dark glass band. Windshield completely clear and empty of any content. Subtle soft highlight along the top edge of the body suggesting chrome trim. Refined simple dark circular wheels with small amber-gold hub dots. Soft diffused cast shadow directly beneath the bus.\n\n' +
      'Behind the bus in the same lower band: multiple softly layered mountain silhouettes receding into atmospheric haze, smooth buttery colour gradients transitioning from deep teal near to pale cool lavender far. Gentle warm amber horizon glow at the base of the mountains where they meet the sky. Framing the far-left and far-right edges of the lower band: stylised silhouette acacia tree and small protea shrub clusters in rich navy and deep teal with subtle amber-gold leaf highlights. Ground plane at the very bottom: smooth continuous gradient from warm cream near the horizon to soft pale lavender-grey at the very bottom edge.\n\n' +
      'ABSOLUTELY NO road of any kind. NO asphalt. NO lane markings. NO dashed lines. NO stripes. NO kerb. NO tarmac. NO visible ground texture. The bus rests on an abstract smooth gradient ground plane with only a soft diffused shadow beneath it.\n\n' +
      'Style discipline: premium flat-vector editorial illustration with refined soft-edged gradient shading, elegant simple shapes, NO heavy outlines, NO thick strokes, NO cartoon stylisation, NO childish details, NO stippling, NO pixelated texture. Sophisticated atmospheric depth achieved purely through smooth colour gradients and gentle blur on far background elements. Serene, calm, confident premium mood. Colour palette strictly limited to: violet-purple #6763db, amber-gold #f59e0b, deep navy #0f172a, muted teal, pale lavender, warm cream, soft off-white.\n\n' +
      'Hard constraints (critical): NO people anywhere visible or silhouetted, NO text of any kind anywhere including destination signs windshields license plates or route numbers, NO logos, NO brand names, NO watermarks, NO stars, NO sparkles, NO clouds, NO route lines, NO map pins, NO location markers, NO street lamps, NO street signs, NO buildings, NO houses, NO other vehicles, NO birds. Ultra-high-resolution marketing-grade hero background illustration. 16:9 cinematic horizontal aspect ratio with upper 60% empty sky and lower 40% bus + landscape.',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/public',
    page: 'hero-illustration',
  },

  {
    id: 'partner-hero-bus',
    prompt:
      'Ultra-premium cinematic wide shot of a sleek modern luxury intercity coach bus on an open highway at golden hour, dramatic sweeping sky, warm sunset light reflecting off the polished bodywork, subtle motion blur on the road, shallow depth of field, editorial travel photography, rich warm amber and indigo tones, photorealistic, atmospheric, no text, no logos',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/public',
    page: 'partner-bus',
  },

  {
    id: 'home-hero-bus',
    prompt:
      'Cinematic editorial travel photograph of a premium modern intercity coach bus parked on a gravel plateau at blue hour twilight, the bus is positioned in the LEFT HALF of the frame at a precise 45 degree three-quarter front-right angle so both the windshield and the full driver-side profile with the long row of side windows are clearly visible, front of the bus facing toward the center-right of the frame, bright dual white LED headlights switched on glowing through dusk haze, driver silhouette visible through the windshield, warm amber cabin glow spilling through every side window illuminating silhouetted passengers inside, polished white and silver bodywork with chrome trim catching cool twilight rim light and warm amber reflections from the horizon, a majestic distant snow-capped mountain range silhouette stretching across the RIGHT HALF of the frame in the background, the TOP HALF of the frame is a dramatic moody twilight sky with deep indigo fading to soft amber and dusty pink near the horizon, wispy atmospheric clouds, the BOTTOM HALF of the frame is empty rugged gravel and dirt plateau ground with subtle patches of snow and the warm amber glow from the bus headlights pooling on the ground in front of the bus, deserted empty remote location, sense of adventure and journey, composition matches classic editorial travel photography, Sony A7R cinematic lens, soft atmospheric haze, photorealistic, National Geographic quality, no text, no logos, no branding, no people outside the bus',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/src/assets/generated',
    page: 'home',
  },

  // ── busline_web · Public Pages ───────────────────────────────────────────

  // HowItWorks
  {
    id: 'howitworks-hero',
    prompt:
      'Premium travel lifestyle hero: diverse travellers boarding a modern luxury coach bus at a clean urban terminal, golden hour lighting, cinematic depth of field, no text',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/src/assets/generated',
    page: 'howitworks',
  },
  {
    id: 'howitworks-step-search',
    prompt:
      'Person using a sleek smartphone app to search bus routes, warm bokeh background, clean minimal aesthetic, no text overlay',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'busline_web/src/assets/generated',
    page: 'howitworks',
  },
  {
    id: 'howitworks-step-book',
    prompt:
      'Hands holding a phone showing a digital bus ticket with QR code, warm light, premium travel feel, no text',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'busline_web/src/assets/generated',
    page: 'howitworks',
  },
  {
    id: 'howitworks-step-travel',
    prompt:
      'Happy traveller looking out of a modern coach window at a scenic Southern African landscape, warm golden light, cinematic',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'busline_web/src/assets/generated',
    page: 'howitworks',
  },

  // Companies
  {
    id: 'companies-hero',
    prompt:
      'Modern corporate travellers in business attire at a premium bus terminal, clean architecture, professional lighting, no text',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/src/assets/generated',
    page: 'companies',
  },
  {
    id: 'companies-feature-team',
    prompt:
      'Diverse business team looking at a dashboard on a laptop in a bright open office, travel management theme, no text',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'busline_web/src/assets/generated',
    page: 'companies',
  },
  {
    id: 'companies-feature-analytics',
    prompt:
      'Clean analytics dashboard floating holographically above a desk, travel spend data visualisation, premium blue tones, no text',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'busline_web/src/assets/generated',
    page: 'companies',
  },

  // Operators
  {
    id: 'operators-hero',
    prompt:
      'Premium editorial travel photograph: a sleek modern luxury white and silver intercity coach bus shown in clean side profile travelling RIGHT TO LEFT across the frame with the front of the bus pointing toward the left edge of the composition, polished chrome trim catching warm late-afternoon natural sunlight, large tinted panoramic side windows, the bus occupies the lower-right third of the frame in soft motion, driving along a gently curving empty scenic open country highway that sweeps from the right foreground toward the distant left horizon, dramatic rolling green hills and layered distant mountain silhouettes fading into atmospheric haze in the background, vast expansive cinematic sky filling the upper two thirds with soft golden-hour sunlight breaking through scattered cumulus clouds, subtle warm amber horizon glow meeting cooler lavender sky above, delicate motion blur on the road surface suggesting forward travel, shallow depth of field, muted neutral editorial tone grading with balanced natural light, slightly desaturated warm and cool palette, shot on 85mm lens, National Geographic travel magazine quality, aspirational premium journey mood, serene confident atmosphere, no text, no logos, no route numbers, no destination signs, no branding, no watermarks, no identifiable faces, no other vehicles, no people outside the bus',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/public',
    page: 'operators',
  },
  {
    id: 'operators-feature-dashboard',
    prompt:
      'Bus operator using a modern fleet management dashboard on a large screen, professional setting, no text',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'busline_web/src/assets/generated',
    page: 'operators',
  },
  {
    id: 'operators-feature-revenue',
    prompt:
      'Clean earnings and payout chart on a tablet, transport business growth, premium minimal design, no text',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'busline_web/src/assets/generated',
    page: 'operators',
  },

  // Routes
  {
    id: 'routes-hero',
    prompt:
      'Aerial view of a scenic Southern African highway through lush green hills and dramatic skies, golden hour, cinematic, no text',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/src/assets/generated',
    page: 'routes',
  },

  // Help / Support
  {
    id: 'help-hero',
    prompt:
      'Premium editorial brand photograph shot on 85mm cinema lens, 16:9 cinematic wide composition, hyper-realistic photorealism: a warm confident Black South African woman in her late twenties, natural hair styled in neat short box braids pulled back, soft natural makeup with glowing skin, a slim black over-ear professional headset with a mic arm on her face, genuine warm half-smile toward the camera. She wears a CRISP CHARCOAL-GREY fitted PIQUE POLO with a clean white collar trim, and on the right chest of the polo sits a clearly legible stacked brand mark: a chunky deep-violet PURPLE lowercase letter "v" logo with a soft amber-gold accent dot, directly underneath it the uppercase wordmark "VYSA" in clean sans-serif letters in the same deep violet — the logo and wordmark must be in razor-sharp focus, correctly spelled V-Y-S-A with no extra or duplicated letters, well-proportioned and unmistakable at first glance, the only text visible anywhere in the entire frame. No other writing, signage, screens or wall text is allowed anywhere else — no company logos on walls, no screens with UI text, no lanyards, no posters, no name tags, no printed paper. She is seated at a clean minimal light-oak support desk, hands resting gently near a closed slim matte-black laptop (with the lid DOWN — no screen visible) and a small warm ceramic mug. Behind her a softly-blurred modern support studio bathed in warm natural window light from the left, faint silhouettes of a small team working out of focus deep in the background, subtle hints of pale lavender and warm cream wall tones, generous atmospheric negative space on the LEFT TWO THIRDS of the frame reserved for a headline overlay, subject naturally framed in the RIGHT THIRD, shallow depth of field f/2.2, soft creamy bokeh, muted editorial tone grading with balanced natural light, slightly desaturated warm-cool palette, National Geographic travel-magazine quality, calm reassuring helpful mood. Hard constraints: subject MUST be Black South African, skin tone natural and unretouched, exactly ONE person in the frame, the VYSA wordmark on the polo is the ONLY text present — absolutely no additional words, numbers, symbols, captions, watermarks, URLs, or signage anywhere else in the image, no identifiable famous landmarks, no other branded objects.',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/public',
    page: 'help',
  },

  // Partner
  {
    id: 'partner-hero',
    prompt:
      'Ultra-premium cinematic editorial photograph shot on 85mm cinema lens at f/2.2, 16:9 wide composition, hyper-realistic photorealism, National Geographic travel-magazine grade, dramatic golden-hour backlight: a sleek modern flagship luxury intercity coach bus in pristine polished charcoal and bright white livery with a single subtle deep-violet accent pinstripe runs along the mid body, large tinted panoramic side windows, polished chrome trim catching a blazing low golden sun behind it, parked at a precise three-quarter angle so the driver-side profile and front grille are both visible, bus occupies the RIGHT TWO THIRDS of the frame. In the LEFT THIRD of the frame, framed by the corner of the bus and the warm horizon, stand exactly TWO confident Black South African operator partners — ONE Black South African woman in her mid thirties with flawless natural skin and natural hair styled in elegant sleek twists swept to one side, wearing a tailored charcoal operator polo under a crisp lightweight cream jacket, dark fitted trousers, holding a dark professional tablet turned slightly toward her colleague — AND ONE Black South African man in her late thirties with a clean short fade and a neatly trimmed beard, wearing a matching charcoal operator polo under a soft dark shell jacket, leaning in with a quiet proud professional half-smile to point at something on the tablet. Both subjects are lit from behind by the low golden sun, warm rim light wrapping around their shoulders and her hair, faces softly filled by a gentle warm bounce from the bus bodywork, strong heroic stance, genuine calm partnership energy. Foreground: smooth polished tarmac catching long warm highlight pools and subtle reflections of the low sun. Background across the full frame: a beautifully clean modern South African bus depot apron at golden hour, a second coach softly out of focus far behind, clean service-bay roofline in silhouette, a distant line of low hills under a dramatic cinematic sky that graduates from deep indigo at the top through burnt amber toward warm cream near the horizon, delicate lens flare blooming from the sun behind the bus, soft atmospheric haze, shallow depth of field with creamy buttery bokeh, muted editorial tone grading with balanced natural light, slightly desaturated warm-cool palette, confident aspirational premium partnership mood. Hard constraints: exactly TWO people total — ONE Black South African woman on the left holding the tablet AND ONE Black South African man to her right looking at the tablet (50/50 gender representation, both with natural skin tones and natural hair, no retouched plastic look, no whitening); absolutely NO text anywhere in the frame, NO logos, NO brand names, NO route numbers, NO destination boards, NO visible writing on clothing, lanyards, tablets, license plates, or depot signage, NO watermarks, NO other branded vehicles, NO identifiable famous landmarks, NO crowd, NO other people besides the two principals.',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/public',
    page: 'partner',
  },
  {
    id: 'partner-benefit-growth',
    prompt:
      'Upward trending growth chart on a tablet with blurred cityscape background, business success theme, no text',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'busline_web/src/assets/generated',
    page: 'partner',
  },

  // ── busline_web · Auth Modal (split-panel left imagery) ──────────────────

  {
    id: 'auth-modal-welcome',
    prompt:
      'Premium editorial travel portrait: a radiant young Black South African woman in her late twenties with natural hair styled in soft twists, wearing a warm terracotta knit top under a light cream overshirt, seated by a large softly-lit coach window, her head turned slightly toward the window with a calm confident half-smile, eyes catching warm golden-hour light pouring in from the side, tasteful natural makeup with glowing skin, delicate gold hoop earring catching a highlight, small leather backpack strap just visible on one shoulder, soft creamy bokeh of the coach interior behind her, shallow depth of field f/2.2, shot on 85mm lens, cinematic 3:4 portrait composition with the subject placed on the upper right third and generous atmospheric space to the lower left for text overlay, muted editorial warm tone grading with gentle natural contrast, hyper-realistic photorealism, National Geographic travel magazine quality, aspirational premium hopeful mood, no text, no logos, no branding, no visible signage, no visible text on clothing',
    ratio: ASPECT_RATIOS.PORTRAIT,
    dest: 'busline_web/src/assets/generated',
    page: 'auth-modal',
  },
  {
    id: 'auth-modal-calm',
    prompt:
      'Premium editorial travel portrait: a composed Black South African man in his early thirties with a neat short fade haircut and a trimmed beard, wearing a deep indigo crewneck under a soft charcoal jacket, seated quietly at a sunlit modern bus terminal bench, holding a phone loosely in one hand but looking up and slightly away toward soft window light, thoughtful reassuring expression, warm natural morning light spilling across his face from the side, soft creamy bokeh of the terminal behind him, shallow depth of field f/2.2, shot on 85mm lens, cinematic 3:4 portrait composition with the subject on the upper right third and generous atmospheric space to the lower left for text overlay, muted editorial tone grading with balanced cool-warm palette, hyper-realistic photorealism, National Geographic travel magazine quality, quiet confident reassuring mood, no text, no logos, no branding, no visible signage, no visible text on clothing',
    ratio: ASPECT_RATIOS.PORTRAIT,
    dest: 'busline_web/src/assets/generated',
    page: 'auth-modal',
  },

  {
    id: 'auth-signin-panel',
    prompt:
      'Scenic Southern African landscape at dusk — mountains, warm amber sky, a lone road — travel inspiration, cinematic, no text',
    ratio: ASPECT_RATIOS.PORTRAIT,
    dest: 'busline_web/src/assets/generated',
    page: 'auth',
  },
  {
    id: 'auth-signup-panel',
    prompt:
      'Vibrant cityscape of Cape Town at golden hour from above, modern travel destination, warm cinematic tones, no text',
    ratio: ASPECT_RATIOS.PORTRAIT,
    dest: 'busline_web/src/assets/generated',
    page: 'auth',
  },
  {
    id: 'auth-verify-panel',
    prompt:
      'Abstract soft bokeh of bus station lights at night, travel atmosphere, warm indigo and amber tones, no text',
    ratio: ASPECT_RATIOS.PORTRAIT,
    dest: 'busline_web/src/assets/generated',
    page: 'auth',
  },
  {
    id: 'auth-reset-panel',
    prompt:
      'Peaceful sunrise over rolling savanna hills, Southern Africa, warm golden tones, hope and new beginnings, no text',
    ratio: ASPECT_RATIOS.PORTRAIT,
    dest: 'busline_web/src/assets/generated',
    page: 'auth',
  },

  // ── busline_web · Booking / App Pages ────────────────────────────────────

  {
    id: 'search-destination-bg',
    prompt:
      'Soft blurred panoramic view of Johannesburg skyline at golden hour, premium travel background, minimal, no text',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/src/assets/generated',
    page: 'search',
  },
  {
    id: 'parcel-hero',
    prompt:
      'Courier handing over a neatly wrapped parcel to a traveller at a bus terminal, warm friendly atmosphere, no text',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/src/assets/generated',
    page: 'parcel',
  },
  {
    id: 'booking-confirmation-bg',
    prompt:
      'Celebratory travel moment — traveller with luggage at a bus terminal, sunny day, warm and happy, no text',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/src/assets/generated',
    page: 'booking',
  },

  // ── busline_web · Account Pages ──────────────────────────────────────────

  {
    id: 'account-overview-banner',
    prompt:
      'Abstract warm gradient travel-themed banner — subtle bus silhouette, Southern African colours, premium, no text',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'busline_web/src/assets/generated',
    page: 'account',
  },

  // ── busline_web · Operator Portal ────────────────────────────────────────

  {
    id: 'operator-auth-panel',
    prompt:
      'Modern luxury coach bus on an open road at golden hour, professional transport operator aesthetic, cinematic, no text',
    ratio: ASPECT_RATIOS.PORTRAIT,
    dest: 'busline_web/src/assets/generated',
    page: 'operator',
  },
  {
    id: 'operator-empty-vehicles',
    prompt:
      'Clean illustration style: row of modern bus silhouettes in a depot, minimal flat design, soft colours, no text',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'busline_web/src/assets/generated',
    page: 'operator',
  },

  // ── vysa_admin ────────────────────────────────────────────────────────────

  {
    id: 'admin-login-panel',
    prompt:
      'Abstract dark tech background — flowing data lines, map grid overlay, deep navy and indigo tones, professional, no text',
    ratio: ASPECT_RATIOS.PORTRAIT,
    dest: 'vysa_admin/src/assets/generated',
    page: 'admin',
  },
  {
    id: 'admin-dashboard-banner',
    prompt:
      'Abstract analytics visualization — clean floating charts and graphs on dark blue, premium SaaS dashboard feel, no text',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'vysa_admin/src/assets/generated',
    page: 'admin',
  },

  // ── vysa_mobile · Editorial real photography (Phase 8) ──────────────────
  // Tone: neutral editorial — balanced natural light, muted, slightly
  // desaturated. Not a warm / ivory / terracotta push (palette revision
  // 2026-04-11). Every prompt asks for "no text, no logos, no identifiable
  // faces" and will be run through Nano Banana refinement via --refine.

  {
    id: 'mobile-splash-bg',
    prompt:
      'Premium editorial travel photograph: a soft diffused sunrise breaking over rolling savanna horizon, distant hills silhouetted, atmospheric haze, cinematic depth of field, muted neutral tone grading with subtle natural light, slightly desaturated, National Geographic quality, intentional balanced composition, no text, no logos, no identifiable faces, no branding',
    ratio: ASPECT_RATIOS.TALL,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },
  {
    id: 'mobile-onboard-open-road',
    prompt:
      'Premium editorial travel photograph: an empty open country highway curving gracefully into the distance, vast landscape either side, late afternoon natural light, muted neutral palette, cinematic depth of field, slightly desaturated, atmospheric haze, National Geographic quality, no text, no logos, no vehicles, no people, no branding',
    ratio: ASPECT_RATIOS.TALL,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },
  {
    id: 'mobile-onboard-ticket-hands',
    prompt:
      'Premium editorial close-up photograph: anonymous hands from the wrists down holding a plain folded paper ticket at a quiet modern bus terminal, soft natural bokeh background, shallow depth of field, neutral muted tone grading, cinematic, slightly desaturated, no faces visible, no visible text or numbers on the ticket, no logos, no branding',
    ratio: ASPECT_RATIOS.TALL,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },
  {
    id: 'mobile-onboard-landscape',
    prompt:
      'Premium editorial travel photograph: scenic rolling green hills with a faint distant road trail winding through, overcast-to-clearing natural light, muted neutral editorial tone, cinematic wide landscape, slightly desaturated, atmospheric haze, National Geographic quality, no text, no logos, no people, no branding',
    ratio: ASPECT_RATIOS.TALL,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },
  {
    id: 'mobile-confirm-band',
    prompt:
      'Premium editorial travel photograph: view from inside a modern coach looking out through a clean window at a passing landscape, subtle motion blur on the scenery, soft natural light filling the frame, empty window seat in the foreground, muted neutral tone grading, cinematic depth, slightly desaturated, no people, no text, no logos, no branding',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },
  {
    id: 'mobile-explore-lagos',
    prompt:
      'Premium editorial cityscape photograph of a dense modern West African metropolis skyline at early evening, soft atmospheric haze, distant low-rise and mid-rise buildings, balanced natural light, muted neutral tone grading, cinematic depth of field, slightly desaturated, no text, no logos, no billboards, no branding, no identifiable faces',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },
  {
    id: 'mobile-explore-ibadan',
    prompt:
      'Premium editorial aerial photograph of a sprawling low-rise city with rust-tone metal rooftops stretching to the horizon, gentle hills in the distance, late afternoon natural light, muted neutral editorial tone, slightly desaturated, cinematic depth, National Geographic quality, no text, no logos, no branding, no identifiable faces',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },
  {
    id: 'mobile-explore-abuja',
    prompt:
      'Premium editorial landscape photograph of a sweeping open capital-city plain with a dramatic distant rocky monolith and low modern architecture on the horizon, balanced overcast-to-clear natural light, muted neutral tone grading, cinematic depth, slightly desaturated, atmospheric haze, no text, no logos, no branding, no identifiable faces',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },
  {
    id: 'mobile-explore-kano',
    prompt:
      'Premium editorial architectural photograph of an old-city quarter with weathered earth-wall textures and layered rooftops at dusk, atmospheric haze, soft natural light, muted neutral editorial tone grading, slightly desaturated, cinematic, National Geographic quality, no people, no text, no logos, no branding',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },
  {
    id: 'mobile-explore-calabar',
    prompt:
      'Premium editorial landscape photograph of a wide slow tropical river estuary at soft early morning, low mist over the water, distant dark tree line, balanced natural light, muted neutral tone grading, cinematic depth of field, slightly desaturated, no boats with visible logos, no text, no branding, no identifiable faces',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },
  {
    id: 'mobile-explore-enugu',
    prompt:
      'Premium editorial landscape photograph of lush green rolling hills at calm early sunrise, gentle mist sitting in the valleys, soft diffused natural light, muted neutral editorial tone grading, slightly desaturated, cinematic wide landscape, National Geographic quality, no text, no logos, no people, no branding',
    ratio: ASPECT_RATIOS.LANDSCAPE,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },
  {
    id: 'mobile-ticket-texture',
    prompt:
      'Top-down macro photograph of a single blank sheet of premium off-white cotton cardstock resting on a neutral surface, fine natural paper fiber texture clearly visible, very soft directional studio light, shallow depth of field, muted neutral tone grading, slightly desaturated, editorial product photography, no text, no print, no logos, no numbers, no watermark, clean and minimal',
    ratio: ASPECT_RATIOS.SQUARE,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },
  // ── vysa_node · Email Hero Images ────────────────────────────────────────

  {
    id: 'email-hero-booking-cancelled',
    prompt:
      'Premium editorial travel photograph: a thoughtful Black South African man in his mid thirties with a close-cropped haircut, wearing a relaxed dark henley and a light jacket, sitting calmly on a bench at a quiet modern South African bus terminal holding a phone in both hands, looking down at the screen with a composed measured expression, soft diffused morning natural light pouring through a large station window behind him, long gentle shadows across the terminal floor, blurred architectural lines of the terminal in the background, muted neutral editorial tone grading, slightly desaturated, cinematic wide composition with the subject on the right third and empty atmospheric space on the left, shallow depth of field, National Geographic quality, quiet reflective respectful mood, no text, no logos, no branding, no signage, no visible text on clothing, no crowd',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'vysa_node/src/emails/assets/images',
    page: 'emails',
  },

  {
    id: 'email-hero-booking-confirmed',
    prompt:
      'Premium editorial travel photograph: a joyful young Black South African woman in her late twenties with natural hair, wearing a stylish casual earth-tone jacket and jeans, a small leather weekend bag slung over one shoulder, smiling softly as she steps up onto the open doorway of a sleek modern luxury intercity coach bus, bright warm morning natural daylight, soft golden sunlight catching the polished white coach bodywork and chrome trim, soft bokeh of a clean modern South African bus terminal platform in the background, shallow depth of field, cinematic composition with the traveller on the left third and the coach door framing the right two thirds, muted neutral editorial tone grading, slightly desaturated, National Geographic quality, joyful optimistic hopeful mood, genuine warm human expression, no text, no logos, no branding, no signage, no visible text on clothing',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'vysa_node/src/emails/assets/images',
    page: 'emails',
  },

  {
    id: 'mobile-me-header',
    prompt:
      'Abstract premium editorial background: a soft horizontal gradient suggesting a faint sun arc rising over a very distant horizon line, muted neutral tone grading with the barest hint of warm and cool balance, minimal composition, slightly desaturated, atmospheric, cinematic, no text, no logos, no objects, no people, no branding',
    ratio: ASPECT_RATIOS.WIDE,
    dest: 'vysa_mobile/assets/generated',
    page: 'mobile',
  },

  // ── vysa_node · Admin-managed city cover images ─────────────────────────
  // Dropped into `uploads/cities/` so the seed modules can reference them as
  // `/uploads/cities/<slug>.jpg`. Uploads folder is served by Express static
  // middleware. Filenames here must match the coverImage paths in cities seed.

  ...((() => {
    const cityPrompt = (name, landmarkLine) =>
      `Premium editorial travel photograph of ${name} at soft late-afternoon natural light: ${landmarkLine}, balanced composition, slightly desaturated neutral muted tone grading, cinematic wide landscape, atmospheric haze, shallow depth of field, National Geographic quality, no text, no logos, no branding, no signage, no identifiable faces, no people in foreground, no vehicles with visible branding`;

    return [
      { id: 'city-jnb', name: 'Johannesburg', landmark: 'a sweeping skyline of modern mid-rise buildings against distant highveld plains with dramatic storm-edge clouds above' },
      { id: 'city-cpt', name: 'Cape Town', landmark: 'Table Mountain rising behind a neat foreground of low architecture and a hint of the Atlantic on the horizon' },
      { id: 'city-dur', name: 'Durban', landmark: 'a gentle curve of the Indian Ocean promenade with a calm turquoise sea and distant coastal high-rises wrapped in warm haze' },
      { id: 'city-pta', name: 'Pretoria', landmark: 'leafy jacaranda-lined avenues leading to a solemn classical administrative building on a distant ridge' },
      { id: 'city-bfn', name: 'Bloemfontein', landmark: 'wide open Free State plains meeting a small low skyline with a sandstone church spire catching soft side light' },
      { id: 'city-plz', name: 'Port Elizabeth', landmark: 'a long windy bay with gentle Indian Ocean waves and a quiet working harbour softly blurred in the distance' },
      { id: 'city-els', name: 'East London', landmark: 'the mouth of a slow coastal river meeting the sea with gentle dunes and a distant headland' },
      { id: 'city-ptg', name: 'Polokwane', landmark: 'a calm baobab-dotted Limpopo savanna skyline with a small low-rise town softly visible on the horizon' },
      { id: 'city-wdh', name: 'Windhoek, Namibia', landmark: 'dry ochre hills cradling a compact modern capital with whitewashed buildings catching soft desert light' },
      { id: 'city-mpm', name: 'Maputo, Mozambique', landmark: 'wide palm-lined coastal boulevards with warm colonial-era pastel architecture and the Indian Ocean glinting in the distance' },
      { id: 'city-hre', name: 'Harare, Zimbabwe', landmark: 'a neat modern low-rise skyline above flowering jacaranda trees under a soft high-altitude sky' },
      { id: 'city-gbe', name: 'Gaborone, Botswana', landmark: 'a calm Kgale Hill rising above a modest orderly modern skyline with wide open Kalahari-edge plains' },
      { id: 'city-btb', name: 'Beitbridge', landmark: 'a long dusty Limpopo border-town road lined with sparse mopane scrub under a vast blue-grey sky' },
      { id: 'city-nlp', name: 'Mbombela (Nelspruit)', landmark: 'lush green lowveld hills surrounding a compact modern town with distant escarpment mountains beyond' },
      { id: 'city-kmp', name: 'Komatipoort', landmark: 'a quiet bushveld border-town plain with tall fever trees and a gentle river bend catching late-afternoon light' },
      { id: 'city-mvg', name: 'Masvingo, Zimbabwe', landmark: 'rolling dry-grass highveld hills with ancient stone ruin textures softly suggested in the distance' },
      { id: 'city-bfw', name: 'Beaufort West', landmark: 'a lonely Karoo plain with a single straight highway vanishing into distant flat-topped koppies under a huge sky' },
    ].map(({ id, name, landmark }) => ({
      id,
      prompt: cityPrompt(name, landmark),
      ratio: ASPECT_RATIOS.LANDSCAPE,
      dest: 'vysa_node/uploads/cities',
      page: 'cities',
    }));
  })()),
];

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

async function generateImage({ id, prompt, ratio, dest }) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: ratio,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Imagen API error for "${id}": ${response.status} — ${err}`);
  }

  const data = await response.json();
  const base64 = data?.predictions?.[0]?.bytesBase64Encoded;
  if (!base64) throw new Error(`No image data returned for "${id}"`);

  const outDir = path.resolve(ROOT, dest);
  fs.mkdirSync(outDir, { recursive: true });

  const filePath = path.join(outDir, `${id}.jpg`);
  fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));

  return filePath;
}

// ---------------------------------------------------------------------------
// Nano Banana full generation — fallback when Imagen 4 quota is exhausted.
// Uses :generateContent and expresses aspect ratio in the prompt text.
// ---------------------------------------------------------------------------

async function generateWithNano({ id, prompt, ratio, dest }) {
  const fullPrompt = ratio ? `${prompt}\n\nAspect ratio: ${ratio} (wide panoramic).` : prompt;

  const response = await fetch(REFINE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Nano Banana API error for "${id}": ${response.status} — ${err}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p?.inlineData?.data);
  if (!imagePart) {
    throw new Error(`No image data returned for "${id}"`);
  }

  const outDir = path.resolve(ROOT, dest);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${id}.jpg`);
  fs.writeFileSync(outPath, Buffer.from(imagePart.inlineData.data, 'base64'));
  return outPath;
}

// ---------------------------------------------------------------------------
// Refiner — Nano Banana (gemini-2.5-flash-image) pass
// ---------------------------------------------------------------------------

async function refineImage({ id, filePath, instruction = REFINE_INSTRUCTION }) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Source image missing for refine: ${filePath}`);
  }

  const base64 = fs.readFileSync(filePath).toString('base64');

  const response = await fetch(REFINE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: instruction },
            { inlineData: { mimeType: 'image/jpeg', data: base64 } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Nano Banana API error for "${id}": ${response.status} — ${err}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p?.inlineData?.data);
  if (!imagePart) {
    throw new Error(`No refined image data returned for "${id}"`);
  }

  fs.writeFileSync(filePath, Buffer.from(imagePart.inlineData.data, 'base64'));
  return filePath;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
  if (!API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is not set. Add it to your .env or environment.');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const refine = args.includes('--refine');
  const nano = args.includes('--nano');
  const pageFilter = args.find((a) => a.startsWith('--page='))?.split('=')[1]
    || (args.indexOf('--page') !== -1 ? args[args.indexOf('--page') + 1] : null);
  const idFilter = args.find((a) => a.startsWith('--id='))?.split('=')[1] || null;

  let queue = pageFilter ? IMAGES.filter((img) => img.page === pageFilter) : IMAGES;
  if (idFilter) queue = queue.filter((img) => img.id === idFilter);

  if (queue.length === 0) {
    console.log(`No images match filter: ${pageFilter}`);
    return;
  }

  const mode = refine ? 'REFINE (Nano Banana)'
    : nano ? 'GENERATE (Nano Banana)'
    : 'GENERATE (Imagen 4)';
  console.log(`\nVysa Image Generator — ${mode} — ${queue.length} image(s) queued\n`);
  if (dryRun) {
    console.log('DRY RUN — no API calls will be made\n');
    queue.forEach(({ id, ratio, prompt }) =>
      console.log(`  [${ratio}] ${id}\n    → ${prompt}\n`)
    );
    return;
  }

  let passed = 0;
  let failed = 0;

  for (const img of queue) {
    const filePath = path.resolve(ROOT, img.dest, `${img.id}.jpg`);

    if (refine) {
      process.stdout.write(`  Refining ${img.id}... `);
      try {
        await refineImage({ id: img.id, filePath });
        console.log(`✓ overwrote → ${path.relative(ROOT, filePath)}`);
        passed++;
      } catch (err) {
        console.log(`✗ FAILED: ${err.message}`);
        failed++;
      }
      continue;
    }

    process.stdout.write(`  Generating ${img.id} (${img.ratio})${nano ? ' [nano]' : ''}... `);
    try {
      const outPath = nano ? await generateWithNano(img) : await generateImage(img);
      console.log(`✓ saved → ${path.relative(ROOT, outPath)}`);
      passed++;
    } catch (err) {
      console.log(`✗ FAILED: ${err.message}`);
      failed++;
    }
  }

  const verb = refine ? 'refined' : 'generated';
  console.log(`\nDone: ${passed} ${verb}, ${failed} failed.\n`);
}

main();
