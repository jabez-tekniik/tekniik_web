/**
 * One-off: generate the /operators page hero background via Nano Banana
 * (gemini-2.5-flash-image), resize + compress to webp, and write to
 * busline_web/public/operators-hero.webp (overwriting the existing file).
 *
 * Run:
 *   node scripts/generateOperatorsHero.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VYSA_ROOT = path.resolve(__dirname, '..');
const OUT_PATH = path.resolve(VYSA_ROOT, 'busline_web/public/operators-hero.webp');

// Pull GEMINI_API_KEY from the Looqz env (shared scripts folder convention)
if (!process.env.GEMINI_API_KEY) {
  const candidates = [
    'D:/Projects/Looqz/code/looqz_web/.env',
    path.resolve(VYSA_ROOT, '../../Looqz/code/looqz_web/.env'),
  ];
  for (const p of candidates) {
    try {
      const text = fs.readFileSync(p, 'utf8');
      const m = text.match(/^GEMINI_API_KEY=(.+)$/m);
      if (m) { process.env.GEMINI_API_KEY = m[1].trim(); break; }
    } catch { /* ignore */ }
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY not found.');
  process.exit(1);
}

// sharp lives under vysa_node/node_modules — resolve from there
const require = createRequire(path.resolve(VYSA_ROOT, 'vysa_node/package.json'));
const sharp = require('sharp');

const MODEL = 'gemini-2.5-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const PROMPT = [
  'A cinematic wide editorial photograph of a fleet of modern luxury intercity coaches parked in a clean row at a contemporary South African bus terminal.',
  'Soft golden-hour sunlight rakes across sleek metallic bodywork, warm rim light, subtle lens flare, shallow depth of field.',
  'In the foreground, a pair of Black South African coach drivers in smart tailored uniforms stand confidently beside the lead bus, one woman and one man, mid-conversation, aspirational and professional, supermodel-level attractiveness, magazine editorial look.',
  'Background softly blurred with additional coaches, terminal architecture, and a warm dusk sky gradient (deep violet fading to amber).',
  'Hyper-realistic photorealism shot on 85mm lens, soft diffused light, warm editorial tones, ultra high resolution, premium travel brand feel.',
  'Absolutely no visible text, no logos, no brand names, no signage, no number plates, no watermarks.',
  '16:9 aspect ratio.',
].join(' ');

async function generate() {
  console.log('Calling Nano Banana...');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: PROMPT }] }] }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Nano Banana ${res.status}: ${t.slice(0, 400)}`);
  }
  const data = await res.json();
  const part = data?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part) {
    throw new Error(`No image in response: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return Buffer.from(part.inlineData.data, 'base64');
}

async function main() {
  const raw = await generate();
  console.log(`Received ${(raw.length / 1024).toFixed(0)} KB raw. Converting to webp...`);

  const webp = await sharp(raw)
    .resize({ width: 1920, height: 1080, fit: 'cover', position: 'center' })
    .webp({ quality: 80 })
    .toBuffer();

  fs.writeFileSync(OUT_PATH, webp);
  const kb = (webp.length / 1024).toFixed(0);
  console.log(`Wrote ${OUT_PATH} (${kb} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
