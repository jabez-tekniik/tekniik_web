/**
 * Looqz — Gemini 2.5 Flash Image ("Nano Banana") Generation Script
 *
 * Fallback generator for entries that Imagen 4 refuses. Reads the same
 * shared manifest as generateImages.js. Nano Banana uses :generateContent
 * and expresses aspect ratio in the prompt text rather than a parameter.
 *
 * Usage:
 *   node scripts/generateImagesNano.js                          # all
 *   node scripts/generateImagesNano.js --section hero
 *   node scripts/generateImagesNano.js --region za
 *   node scripts/generateImagesNano.js --id hero-uk-marquee-1
 *   node scripts/generateImagesNano.js --dry-run
 *   node scripts/generateImagesNano.js --test
 *
 * Requirements:
 *   GEMINI_API_KEY in looqz_web/.env or environment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IMAGES, SECTIONS, REGIONS } from './imageManifest.js';
import { compressGenerated } from './compressGenerated.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

if (!process.env.GEMINI_API_KEY) {
  try {
    const envPath = path.resolve(ROOT, 'looqz_web/.env');
    const envText = fs.readFileSync(envPath, 'utf8');
    const match = envText.match(/^GEMINI_API_KEY=(.+)$/m);
    if (match) process.env.GEMINI_API_KEY = match[1].trim();
  } catch { /* ignore */ }
}

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash-image';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function generateImage({ id, prompt, ratio, dest, filename }) {
  // Nano Banana expresses aspect ratio in the prompt text
  const fullPrompt = ratio ? `${prompt}, ${ratio} aspect ratio` : prompt;

  const response = await fetch(API_URL, {
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
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart) {
    throw new Error(`No image data returned for "${id}" — response: ${JSON.stringify(data).slice(0, 300)}`);
  }

  const outDir = path.resolve(ROOT, dest);
  fs.mkdirSync(outDir, { recursive: true });

  const mime = imagePart.inlineData.mimeType || 'image/png';
  const ext = mime.includes('jpeg') ? 'jpg' : mime.includes('png') ? 'png' : 'bin';
  const outName = filename ?? id;
  const filePath = path.join(outDir, `${outName}.${ext}`);
  fs.writeFileSync(filePath, Buffer.from(imagePart.inlineData.data, 'base64'));

  return filePath;
}

function getFlag(args, name) {
  const eq = args.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.split('=')[1];
  const idx = args.indexOf(`--${name}`);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) return args[idx + 1];
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const skipCompress = args.includes('--skip-compress');
  const isTest = args.includes('--test');
  const section = getFlag(args, 'section');
  const region = getFlag(args, 'region');
  const idFilter = getFlag(args, 'id');

  if (!dryRun && !API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is not set. Add it to looqz_web/.env or environment.');
    process.exit(1);
  }

  if (section && !SECTIONS.includes(section)) {
    console.error(`ERROR: unknown --section "${section}". Valid: ${SECTIONS.join(', ')}`);
    process.exit(1);
  }
  if (region && !REGIONS.includes(region)) {
    console.error(`ERROR: unknown --region "${region}". Valid: ${REGIONS.join(', ')}`);
    process.exit(1);
  }

  let queue;
  if (isTest) {
    queue = [{
      id: 'nano-test-sample',
      prompt: 'A sleek modern beauty salon interior at golden hour, cinematic photography, warm light, ultra high resolution, no text, no logos',
      ratio: '16:9',
      dest: 'scripts/test-output',
      filename: 'nano-test-sample',
    }];
  } else {
    queue = IMAGES;
    if (section) queue = queue.filter((img) => img.page === section);
    if (region) queue = queue.filter((img) => img.region === region);
    if (idFilter) queue = queue.filter((img) => img.id === idFilter);
  }

  if (queue.length === 0) {
    console.log('No images match filters.');
    return;
  }

  console.log(`\nLooqz Nano Banana Generator — ${queue.length} image(s) queued\n`);
  if (dryRun) {
    console.log('DRY RUN — no API calls will be made\n');
    queue.forEach(({ id, ratio, region: r, prompt }) =>
      console.log(`  [${ratio}] [${r}] ${id}\n    -> ${prompt}\n`)
    );
    return;
  }

  let passed = 0;
  let failed = 0;

  for (const img of queue) {
    process.stdout.write(`  Generating ${img.id}... `);
    try {
      const filePath = await generateImage(img);
      console.log(`OK saved -> ${path.relative(ROOT, filePath)}`);
      passed++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${passed} generated, ${failed} failed.\n`);

  if (passed > 0 && !skipCompress) {
    await compressGenerated();
  } else if (skipCompress) {
    console.log('Compression skipped (--skip-compress).');
  }
}

main();
