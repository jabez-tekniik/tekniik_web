/**
 * Tekniik — image generation runner (Imagen 4 Ultra)
 *
 * Generates portfolio + case-study + page-hero imagery via Google's
 * Imagen 4 Ultra model (`imagen-4.0-ultra-generate-001`), then resizes
 * and encodes to webp under public/img/.
 *
 * Two style boilerplates:
 *   - CINEMATIC: full-bleed editorial photography, designed for object-fit:cover
 *     with a dark scrim overlay (used by bento cards + case-study hero frames).
 *   - ISOLATED:  subject on a near-white near-transparent canvas with soft
 *     contact shadow only (used by PageHeader.media — frameless float).
 *
 * Self-contained: reads .env from project root, uses sharp for webp.
 *
 * Usage:
 *   node scripts/generateTekniikImages.js              # generate all
 *   node scripts/generateTekniikImages.js --id svc-ai  # one entry
 *   node scripts/generateTekniikImages.js --dry-run    # preview prompts
 *   node scripts/generateTekniikImages.js --model std  # use standard (faster/cheaper)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Load GEMINI_API_KEY from .env (Imagen uses the same Generative Language key)
if (!process.env.GEMINI_API_KEY) {
  try {
    const env = fs.readFileSync(path.resolve(ROOT, '.env'), 'utf8')
    const m = env.match(/^GEMINI_API_KEY\s*=\s*(.+)$/m)
    if (m) process.env.GEMINI_API_KEY = m[1].trim().replace(/^["']|["']$/g, '')
  } catch { /* ignore */ }
}

const API_KEY = process.env.GEMINI_API_KEY

// Imagen 4 model variants — Ultra is the premium quality tier (1 sample/call).
const MODELS = {
  ultra: 'imagen-4.0-ultra-generate-001',
  std: 'imagen-4.0-generate-001',
  fast: 'imagen-4.0-fast-generate-001',
}

// ── Brand voice ───────────────────────────────────────────────────────────
// CINEMATIC: full-bleed editorial product photography. Dark, atmospheric,
// indigo/violet/pink ambient lighting. Subject fills the frame and bleeds
// into the edges so a dark scrim gradient + body copy can sit on top.
const CINEMATIC = [
  'cinematic editorial product photograph in the style of a premium tech-brand keynote slide',
  'shallow depth of field with creamy bokeh, dramatic rim lighting, deep indigo + violet + warm pink atmospheric ambient',
  'subject fills the entire 1:1 frame edge-to-edge with intentional bleed — composition designed to be cropped and overlaid with a dark scrim and body copy',
  'rich blacks, glowing highlights, refined contrast, color-graded like a Sony or Apple keynote render',
  'beautifully designed UI shown on devices — pixel-perfect editorial sans-serif type, generous whitespace, indigo CTAs, hairline borders',
  'no people, no faces, no hands, no real-world brand logos, no readable brand names, no watermark, no signature, no caption, no on-image text outside device screens',
  'placeholder labels rendered as elegant editorial sans-serif typography (no monospace, no Lorem ipsum)',
  'ultra-sharp 8K product detail, photographed on a tilt-shift lens, premium studio quality',
].join(', ')

// DOCUMENTARY: real-world editorial photography for the non-home page heroes.
// Shot like a magazine spread — natural light, shallow DoF, indigo/violet/pink
// graded ambient. People-allowed compositions are framed off-axis (3/4 back,
// over-shoulder, profile in soft focus) so faces aren't the focal point —
// this avoids the AI-face-artifact problem.
const DOCUMENTARY = [
  'documentary editorial photograph in the style of a premium magazine spread',
  'real-world cinematic photography, shot on a 50mm prime lens at f/2.0 with shallow depth of field and creamy bokeh',
  'soft natural daylight as primary light, with subtle indigo + violet + warm pink ambient color grading',
  'modern minimal interior — clean walls, wooden desks, neutral textiles, no kitsch, no clutter',
  'COMPOSITION RULE — STRICT: every physical object in the scene (devices, props, furniture, people) sits comfortably framed inside the RIGHT 40% of the frame, with the LEFT EDGE of any subject starting around the 55% vertical line, AND the RIGHT EDGE of every subject ending at most around the 92% vertical line so there is at least 8% breathing room between the subjects and the right edge of the frame (no person, no object, no body part is allowed to touch the right edge). Subjects must be FULLY contained — no body parts cropped at any edge of the frame. The LEFT 55% of the frame contains ABSOLUTELY NOTHING — no objects, no parts of objects, no people, no hands, no shadows of objects — only clean empty studio space (a soft pale wall fading into gentle bokeh). The left 55% reads as a near-white empty field that will be overlaid with text in production',
  'NO UI text on any screen, NO readable typography, NO brand logos, NO labels, NO Lorem ipsum',
  'where people appear: faces angled away, in 3/4 back, side profile, or in soft focus — never centered or staring at the lens',
  'pixel-perfect anti-aliased detail where in focus, refined edges, color-graded like a high-end editorial cover',
  'no watermark, no signature, no caption, no border, no frame',
].join(', ')

// ABSTRACT: pure editorial form compositions for page-hero frames.
// No devices, no UI, no text, no faces — just elegant abstract shapes,
// gradients, and light. Pixel-perfect because there's no UI/typography
// for the model to mangle.
const ABSTRACT = [
  'abstract editorial sculpture render in the style of a high-end gallery still life',
  'pure form composition — no devices, no screens, no UI, no typography, no readable text, no avatars, no people, no human figures',
  'soft layered shapes in cream #F8F7F4, deep indigo #5B5BFF, violet #8B6BFF, warm pink #FF8AB6, with a museum near-white surface',
  'volumetric studio lighting from upper-left, gentle rim light, refined contact shadow, subtle subsurface scatter on translucent forms',
  'physically based render, matte and glossy material balance, micro-detail on surfaces, subtle dust motes in the air for atmosphere',
  'editorial composition with intentional negative space — feels like a museum-quality still life photograph',
  'ultra-sharp 8K detail, perfect anti-aliased edges, no banding, no JPEG artifacts, no halftone',
  'no watermark, no signature, no caption, no border, no frame, no logo',
].join(', ')

const NEGATIVE = [
  'low quality, blurry, soft focus, jpeg artifacts, banding, oversaturated, neon, gaudy',
  'cartoon, illustration, 3d render game art, plastic, stock photo, clipart',
  'people, faces, hands, fingers, eyes, body parts',
  'real brand logos, real brand names, watermarks, signatures, lorem ipsum, monospace text',
  'cluttered, messy, busy background, dirty surfaces',
].join(', ')

const ITEMS = [
  // ── Bento card visuals — FULL-BLEED CINEMATIC (designed for cover-fit + scrim) ──
  {
    id: 'svc-websites',
    style: 'cinematic',
    out: 'public/img/services/websites.webp',
    width: 1600,
    height: 1600,
    subject:
      'Cinematic close-up of a sleek thin laptop floating in dramatic indigo-violet atmospheric haze, screen filling most of the composition. The screen shows a beautifully designed marketing website hero: bold display headline in elegant editorial sans-serif (placeholder words, no real text), an indigo gradient call-to-action button glowing softly, a row of three crisp feature cards beneath with hairline borders, subtle warm pink accent on a testimonial pill. Camera angle: gentle three-quarter from slightly above, lens flare grazing the top-left corner. Reflection of indigo and pink ambient light on the glossy keyboard deck. Background dissolves into deep indigo bokeh with violet and pink particles. Frame fully filled — no empty corners.',
  },
  {
    id: 'svc-apps',
    style: 'cinematic',
    out: 'public/img/services/apps.webp',
    width: 1600,
    height: 1600,
    subject:
      'Cinematic three-quarter render of a sophisticated SaaS analytics dashboard inside a glassy floating browser frame, filling the full 1:1 frame edge-to-edge. The dashboard shows: a slim sidebar with abstract geometric section icons, a hero panel with a real-time line chart in vivid indigo with a soft glow trail, a tidy data table beneath with subtle row hovers, a small floating activity-feed card overlapping the corner with an indigo notification dot. Behind the browser frame, a second translucent panel shows a settings/permissions grid in violet tones. Atmospheric ambient: deep indigo and violet light wash, faint pink rim on the right edge, soft volumetric glow behind the line chart. Composition feels like a moody product keynote slide.',
  },
  {
    id: 'svc-mobile',
    style: 'cinematic',
    out: 'public/img/services/mobile.webp',
    width: 1600,
    height: 1600,
    subject:
      'Cinematic close-up of two iOS-style mobile phones standing upright in dramatic warm-pink-into-indigo atmospheric light, filling the full 1:1 frame. Left phone in sharp focus shows a clean app home: a warm greeting placeholder line, a balance/summary card with a tiny gradient sparkline, three quick-action chips with indigo glyphs, and a recent-activity list with subtle dividers. Right phone slightly behind in soft focus shows a detail screen: a bold stat number, a small indigo line chart, and a glowing indigo primary action button at the bottom. Subtle reflections on the phone glass, deep shadow gradient beneath. Background dissolves into warm pink + violet bokeh.',
  },
  {
    id: 'svc-ai',
    style: 'cinematic',
    out: 'public/img/services/ai.webp',
    width: 1600,
    height: 1600,
    subject:
      'Cinematic editorial composition of an AI-assisted workspace product, filling the full 1:1 frame with dramatic indigo-violet atmospheric light. Centre: a glassy translucent editor panel with a highlighted block of placeholder body text and three glowing AI suggestion bubbles fanning out from it, plus a softly pulsing indigo "Generating…" chip mid-stream. Beside the editor floats a secondary glass card showing a pipeline graph: 5–7 connected nodes labelled in elegant micro-typography, with luminous indigo + warm pink particles drifting along the connection lines like signal flow. Subtle volumetric god rays from above. Soft pink rim light grazes the right edge of the editor. Composition has clear top-third negative space (atmospheric sky of bokeh) so a scrim overlay reads cleanly.',
  },

  // ── Page hero frames — direct documentary subjects, 16:9 full-bleed
  //    cinematic widescreen. Right-weighted so the left half is reserved
  //    for the text overlay used by the PageHeader full-bleed variant. ──
  {
    // Services — "We build the technology your business runs on"
    // Direct: a modern developer's workstation, no people.
    id: 'page-services',
    style: 'documentary',
    aspectRatio: '16:9',
    out: 'public/img/page/services-hero.webp',
    width: 1920,
    height: 1080,
    subject:
      'A premium modern developer\'s workstation positioned ENTIRELY in the right 45% of the 16:9 frame: a slim open laptop with abstract dark code panels (soft indigo line numbers + violet keyword accents, NO readable text), a low-profile mechanical keyboard, a small notebook with a brass pen, a ceramic mug of black coffee, a tiny sculptural plant in a matte indigo pot. CRITICAL COMPOSITION RULE: the laptop, keyboard, mug, notebook and plant must ALL sit between the 55% vertical line and the right edge of the frame — none of these objects, NOR any portion of them, NOR their shadows, may extend into the left 55% of the frame. The LEFT 55% of the frame is empty pale-cream studio space with the merest hint of soft window light bokeh — a clean field that will hold text in production. Soft natural daylight from upper-right grazes the laptop edge with a clean rim highlight. Real photographic detail, shallow depth of field, premium editorial. NO people, NO hands, NO readable text, NO brand logos. 16:9 cinematic widescreen.',
  },
  {
    // About — "A small team that builds big things"
    // Direct: a small modern team working together at a studio desk.
    id: 'page-about',
    style: 'documentary',
    aspectRatio: '16:9',
    allowPeople: true,
    out: 'public/img/page/about-hero.webp',
    width: 1920,
    height: 1080,
    subject:
      'A small modern design + engineering team — three adults — working together around a clean wooden desk. COMPOSITION CRITICAL RULES (both must hold): (1) the three people, the desk, the laptop, and the notebook are all positioned in the RIGHT 40% of the 16:9 frame — start around the 55% vertical line; (2) the FURTHEST-RIGHT person and the rightmost edge of any object must NOT touch the right edge of the frame — leave at least 8% empty padding between them and the right edge so every body part is fully contained, no faces or shoulders or laptops cropped at the right border. The LEFT 55% of the frame is empty pale-cream studio space (a clean white wall with subtle indigo+pink ambient wash from a tall window beyond the LEFT edge, gentle out-of-focus bokeh, a couple of drifting dust motes of light) — a clean field that will hold text in production. The three people are leaning forward toward the laptop. Faces are angled obliquely — three-quarter back, side profile in soft focus, slightly turned away — never centered or staring at the camera. Hands rest on the laptop, hold a pencil over the notebook, gesture at the screen. Subjects wear neutral modern workwear (soft indigo shirt, cream sweater, charcoal tee). Real photographic detail, shallow depth of field, premium magazine spread quality. The laptop screen shows abstract dark design panels (NO readable UI, NO text, NO logos). 16:9 cinematic widescreen.',
  },
  {
    // Contact — "Let's talk about your project"
    // Direct: a clean modern desk ready for a new conversation.
    id: 'page-contact',
    style: 'documentary',
    aspectRatio: '16:9',
    out: 'public/img/page/contact-hero.webp',
    width: 1920,
    height: 1080,
    subject:
      'A clean modern desk ready for a new conversation. Composition CRITICAL RULE: every object — the smartphone, the notebook, the brass fountain pen, the two swatch cards, the ceramic mug, AND THE EDGE OF THE DESK — must ALL be positioned ENTIRELY in the right 45% of the 16:9 frame, beginning at the 55% vertical line and extending to the right edge. NO object, NO part of an object, NO shadow, may extend into the left 55% of the frame. The LEFT 55% of the frame is empty pale-cream studio space (a clean wall fading into soft bokeh with subtle indigo+pink ambient grading and a hint of soft daylight) — a clean field that will hold text in production. The right-side composition contains: a sleek smartphone (face-up, screen showing only a soft indigo gradient lock screen with NO icons, NO readable text); a small open notebook with a brass fountain pen lying across the blank page (a single soft indigo curve drawn at one corner, NO words); two small swatch cards (one deep indigo, one warm pink); a ceramic mug of tea. Top-down editorial photography with a slight three-quarter tilt. Real photographic detail, shallow depth of field, premium magazine quality. NO people, NO hands, NO readable text anywhere, NO brand logos. 16:9 cinematic widescreen.',
  },

  // ── Case-study heroes — FULL-BLEED CINEMATIC (cover-fit in heroFrame) ───
  {
    id: 'case-looqz-hero',
    style: 'cinematic',
    out: 'public/img/case/looqz-hero.webp',
    width: 1600,
    height: 1600,
    subject:
      'Cinematic editorial composition for a beauty & wellness booking platform, filling the full 1:1 frame with warm pink + indigo atmospheric light. Foreground: a sleek mobile phone in sharp focus shows a beautifully designed booking flow — three service cards (manicure, facial, hair styling) with abstract artistic micro-thumbnails in soft pink tones, a horizontal date selector strip, and a glowing indigo confirmation chip at the bottom. Behind it in soft focus: a translucent floating laptop frame shows the matching web view: a service grid, a search bar with subtle focus glow, soft category filters, and a small "Booked" toast card. Background dissolves into deep pink-into-indigo bokeh with delicate floating particles.',
  },
  {
    id: 'case-autoscreen-hero',
    style: 'cinematic',
    out: 'public/img/case/autoscreen-hero.webp',
    width: 1600,
    height: 1600,
    subject:
      'Cinematic editorial composition for an automotive glass-repair platform, filling the full 1:1 frame with deep indigo + violet atmospheric light. Foreground: a sleek mobile phone in sharp focus shows a clean quote-request flow — a vehicle make/model selector, a postal-code input field with a soft indigo focus ring, an instant-quote slider with a bright indigo handle, and a glowing indigo primary CTA button. Behind it in soft focus: a translucent floating laptop frame shows the matching web platform: a service-network map with technician pins glowing softly indigo, an instant-quote panel, a small customer-rating chip with a star and an indigo dot. Subtle volumetric light grazes the top edge. Background dissolves into deep indigo-into-violet bokeh.',
  },
]

function buildPrompt(item) {
  const style =
    item.style === 'cinematic' ? CINEMATIC
    : item.style === 'documentary' ? DOCUMENTARY
    : ABSTRACT
  // Items that need real people drop the people exclusions; Imagen 4 dropped
  // the dedicated negativePrompt param, so we fold what's left into the body.
  const negativeBits = NEGATIVE
    .split(',')
    .map((s) => s.trim())
    .filter((s) => !item.allowPeople || !/people|faces|hands|fingers|eyes|body parts/i.test(s))
    .join(', ')
  return `${item.subject} ${style}. Do not include: ${negativeBits}.`
}

async function generateOne(item, modelId) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:predict?key=${API_KEY}`
  const prompt = buildPrompt(item)

  const body = {
    instances: [{ prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: item.aspectRatio || '1:1',
      personGeneration: item.allowPeople ? 'allow_adult' : 'dont_allow',
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 280)}`)
  }

  const data = await res.json()
  const pred = data?.predictions?.[0]
  const b64 = pred?.bytesBase64Encoded
  if (!b64) {
    throw new Error(`no image in response: ${JSON.stringify(data).slice(0, 280)}`)
  }

  const buf = Buffer.from(b64, 'base64')
  const outPath = path.resolve(ROOT, item.out)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })

  // Cinematic images have content edge-to-edge so we cover-fit and crop.
  // Isolated images keep the soft surface intact, also cover-fit (subject is
  // composed near centre so we don't lose the contact shadow).
  await sharp(buf)
    .rotate()
    .resize({
      width: item.width,
      height: item.height,
      fit: 'cover',
      position: 'centre',
    })
    .webp({ quality: 92, alphaQuality: 100, effort: 6, smartSubsample: true })
    .toFile(outPath)

  const kb = (fs.statSync(outPath).size / 1024).toFixed(1)
  return { outPath, kb }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const idArg = (() => {
    const i = args.indexOf('--id')
    return i !== -1 ? args[i + 1] : null
  })()
  const modelArg = (() => {
    const i = args.indexOf('--model')
    return i !== -1 ? args[i + 1] : 'ultra'
  })()
  const modelId = MODELS[modelArg] || MODELS.ultra

  if (!dryRun && !API_KEY) {
    console.error('GEMINI_API_KEY not set. Add it to .env')
    process.exit(1)
  }

  const queue = idArg ? ITEMS.filter((i) => i.id === idArg) : ITEMS
  if (queue.length === 0) {
    console.log('No items match.')
    return
  }

  console.log(`\nTekniik image generator — ${queue.length} item(s) via ${modelId}\n`)
  if (dryRun) {
    queue.forEach((q) =>
      console.log(`  [${q.style}] ${q.id}\n    ${buildPrompt(q).slice(0, 240)}…\n`)
    )
    return
  }

  let ok = 0
  let fail = 0
  for (const it of queue) {
    process.stdout.write(`  ${it.id}... `)
    try {
      const { outPath, kb } = await generateOne(it, modelId)
      console.log(`OK ${path.relative(ROOT, outPath)} (${kb} KB)`)
      ok++
    } catch (e) {
      console.log(`FAILED — ${e.message}`)
      fail++
    }
  }
  console.log(`\nDone: ${ok} ok, ${fail} failed.\n`)
  if (fail > 0) process.exit(1)
}

main()
