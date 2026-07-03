/**
 * One-off: fetch a clean Unsplash flat-lay and write it to
 * public/img/page/contact-hero.webp at 1920x1080 with the subject
 * weighted to the right (left ~55% reserved for text overlay).
 *
 * Throwaway demo helper — keep around so we can swap to a different
 * Unsplash photo by editing CANDIDATES below.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Unsplash direct image URLs — using fixed photo IDs (stable, attribution
// optional via Unsplash terms). All chosen for a uniform top-down surface
// with no hard horizontal seams, subject naturally biased toward right.
const CANDIDATES = {
  // Top-down minimal flat-lay on warm light wooden surface — uniform tone,
  // no wall/desk seam. Subject (notebook, phone, plant) sits comfortably
  // off-center and the surface reads as one continuous plane.
  'flatlay-light-wood':
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=2400&q=85',
  // Soft pastel desk with phone + notebook + coffee — clean uniform field.
  'flatlay-soft-pastel':
    'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=2400&q=85',
  // White desk with laptop, coffee, plant — very airy, uniform white tone.
  'desk-white-airy':
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=2400&q=85',
  // Customer-support agent wearing a headset — friendly, approachable,
  // clean background. Contact-page appropriate.
  // Smiling woman at computer wearing a headset (verified from Unsplash search).
  'support-headset':
    'https://images.unsplash.com/photo-1766066014237-00645c74e9c6?auto=format&fit=crop&w=2400&q=85',
  // Woman working on laptop in modern bright office — Western workspace,
  // professional vibe (Vitaly Gariev on Unsplash).
  'office-modern-a':
    'https://images.unsplash.com/photo-1758876017801-f5a892ee460a?auto=format&fit=crop&w=2400&q=85',
  'office-modern-b':
    'https://images.unsplash.com/photo-1758873271831-c048f79b2283?auto=format&fit=crop&w=2400&q=85',
  // Customer support rep wearing headset, smiling/waving, corporate office —
  // verified free Unsplash photo (slug LSOIjuBiIuQ).
  'support-rep-corporate':
    'https://images.unsplash.com/photo-1714079761488-e0c9b9ac4138?auto=format&fit=crop&w=2400&q=85',
  // Additional candidates from Unsplash customer-service-representative search
  // (slugs nFLmPAf9dVc and GFrBMipOd_E) — quick previews.
  'support-candidate-d':
    'https://images.unsplash.com/photo-1560264357-8d9202250f21?auto=format&fit=crop&w=2400&q=85',
  'support-candidate-e':
    'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=2400&q=85',
  // User-supplied image — crucial customer service stock photo.
  'crucial-customer-service':
    'https://cdn.prod.website-files.com/5e8bd2ab8e48e69429cb4fd8/60712106aa48855fb2a9b972_crucial-customer-service.jpg',
  // User-supplied image (local Downloads) — Gemini-generated tech support woman.
  'gemini-zenith-support':
    'file://C:/Users/user/Downloads/Gemini_Generated_Image_4u2btz4u2btz4u2b.png',
  // User-supplied image (local Downloads) — ChatGPT-generated services collage
  // (laptop + phones + service cards + icon row). Output → services-hero.webp.
  'gpt-services-collage':
    'file://C:/Users/user/Downloads/ChatGPT Image May 9, 2026, 12_47_53 AM.png',
}

// Per-candidate output overrides — each entry above writes to contact-hero
// by default. Add an entry here to redirect.
const OUT_OVERRIDES = {
  'gpt-services-collage': 'public/img/page/services-hero.webp',
}

const PICK = process.argv[2] || 'flatlay-light-wood'
const MODE = process.argv[3] || 'cover' // 'cover' = old behaviour; 'right-panel' = bake right-half composition
const url = CANDIDATES[PICK]
if (!url) {
  console.error(`Unknown candidate "${PICK}". Options: ${Object.keys(CANDIDATES).join(', ')}`)
  process.exit(1)
}

const OUT = path.resolve(ROOT, OUT_OVERRIDES[PICK] || 'public/img/page/contact-hero.webp')

async function loadSource(srcUrl) {
  if (srcUrl.startsWith('file://')) {
    const localPath = fileURLToPath(srcUrl)
    return fs.readFileSync(localPath)
  }
  const res = await fetch(srcUrl)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  console.log(`Fetching ${PICK} (mode: ${MODE})…`)
  const buf = await loadSource(url)

  if (MODE === 'right-panel') {
    // Bake a 1920x1080 composition: right ~58% holds a crop of the source
    // photo (sourcing from the right side so we anchor on the subject), the
    // left ~42% is the page background colour so it blends seamlessly with
    // the page bg. Avoids needing aggressive masks in PageHeader.
    const PANEL_W = 1115 // ~58% of 1920
    const PANEL_H = 1080
    const CANVAS_W = 1920
    const CANVAS_H = 1080
    const BG = '#F7F8FA' // matches --bg in tokens.css

    // Source meta to compute a right-anchored crop window
    const meta = await sharp(buf).rotate().metadata()
    const srcW = meta.width
    const srcH = meta.height
    // Take the right portion of the source whose aspect matches the panel
    const targetAspect = PANEL_W / PANEL_H // ~1.032
    let cropW, cropH
    if (srcW / srcH > targetAspect) {
      cropH = srcH
      cropW = Math.round(cropH * targetAspect)
    } else {
      cropW = srcW
      cropH = Math.round(cropW / targetAspect)
    }
    const left = srcW - cropW // anchor right
    const top = Math.round((srcH - cropH) / 2)

    // Feather width — the leftmost FEATHER_W pixels of the panel fade from
    // 0% to 100% alpha so the panel blends into the page bg with no seam.
    const FEATHER_W = 280

    const panelOpaque = await sharp(buf)
      .rotate()
      .extract({ left, top, width: cropW, height: cropH })
      .resize(PANEL_W, PANEL_H)
      .ensureAlpha()
      .toBuffer()

    // Build an alpha mask: left edge transparent, fading to opaque over
    // FEATHER_W pixels. SVG -> grayscale where black = transparent.
    const maskSvg = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${PANEL_W}" height="${PANEL_H}">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="${FEATHER_W}" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="white" stop-opacity="0"/>
            <stop offset="1" stop-color="white" stop-opacity="1"/>
          </linearGradient>
        </defs>
        <!-- Right portion: fully opaque -->
        <rect x="${FEATHER_W}" y="0" width="${PANEL_W - FEATHER_W}" height="${PANEL_H}" fill="white"/>
        <!-- Left feather: gradient transparent → opaque -->
        <rect x="0" y="0" width="${FEATHER_W}" height="${PANEL_H}" fill="url(#g)"/>
      </svg>`
    )

    // Apply alpha mask to the panel using dest-in blend.
    const panel = await sharp(panelOpaque)
      .composite([{ input: maskSvg, blend: 'dest-in' }])
      .png()
      .toBuffer()

    await sharp({
      create: { width: CANVAS_W, height: CANVAS_H, channels: 3, background: BG },
    })
      .composite([{ input: panel, left: CANVAS_W - PANEL_W, top: 0 }])
      .webp({ quality: 90, effort: 6, smartSubsample: true })
      .toFile(OUT)
  } else {
    // Default: cover-fit 1920x1080 with right-anchored gravity.
    await sharp(buf)
      .rotate()
      .resize({ width: 1920, height: 1080, fit: 'cover', position: 'right' })
      .webp({ quality: 90, effort: 6, smartSubsample: true })
      .toFile(OUT)
  }

  const kb = (fs.statSync(OUT).size / 1024).toFixed(1)
  console.log(`OK ${path.relative(ROOT, OUT)} (${kb} KB)`)
}

main().catch((e) => {
  console.error(`FAILED — ${e.message}`)
  process.exit(1)
})
