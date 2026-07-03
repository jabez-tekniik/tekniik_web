#!/usr/bin/env node
/**
 * Compress oversized static assets in looqz_web/public/ to WebP.
 *
 * - looqz_mockup.png (6.3 MB) -> looqz-mockup.webp (<300 KB, max 1200px wide)
 * - testimonials/*.png -> testimonials/*.webp (quality 80, max 256px)
 * - auth_bg.webp -> re-encode if > 200 KB
 * - eye_lashes.webp -> re-encode if > 200 KB
 *
 * Originals are deleted on successful conversion.
 * Run: node scripts/compressExistingAssets.js
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

const fmtKB = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const fmtMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
const fmt = (bytes) => (bytes >= 1024 * 1024 ? fmtMB(bytes) : fmtKB(bytes));

async function statOrNull(p) {
  try {
    return await fs.stat(p);
  } catch {
    return null;
  }
}

async function convertMockup() {
  const src = path.join(PUBLIC_DIR, 'looqz_mockup.png');
  const dst = path.join(PUBLIC_DIR, 'looqz-mockup.webp');
  const before = await statOrNull(src);
  if (!before) {
    console.log('[mockup] skip — source missing');
    return;
  }
  await sharp(src)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dst);
  const after = await fs.stat(dst);
  console.log(`[mockup] ${fmt(before.size)} -> ${fmt(after.size)}  (${path.basename(dst)})`);
  await fs.unlink(src);
}

async function convertTestimonials() {
  const dir = path.join(PUBLIC_DIR, 'testimonials');
  const entries = await fs.readdir(dir);
  for (const name of entries) {
    if (!name.toLowerCase().endsWith('.png')) continue;
    const src = path.join(dir, name);
    const kebab = name.replace(/\.png$/i, '').replace(/_/g, '-') + '.webp';
    const dst = path.join(dir, kebab);
    const before = await fs.stat(src);
    await sharp(src)
      .resize({ width: 256, height: 256, fit: 'cover', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(dst);
    const after = await fs.stat(dst);
    console.log(`[testimonials] ${name} ${fmt(before.size)} -> ${kebab} ${fmt(after.size)}`);
    await fs.unlink(src);
  }
}

async function reencodeIfLarge(filename, { maxBytes, width, quality }) {
  const src = path.join(PUBLIC_DIR, filename);
  const before = await statOrNull(src);
  if (!before) {
    console.log(`[${filename}] skip — missing`);
    return;
  }
  if (before.size <= maxBytes) {
    console.log(`[${filename}] ok (${fmt(before.size)} <= ${fmt(maxBytes)})`);
    return;
  }
  const tmp = src + '.tmp.webp';
  await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(tmp);
  const after = await fs.stat(tmp);
  // Windows: unlink original first to avoid EPERM on rename.
  await fs.unlink(src);
  await fs.rename(tmp, src);
  console.log(`[${filename}] re-encoded ${fmt(before.size)} -> ${fmt(after.size)}`);
}

async function main() {
  console.log(`Compressing assets in ${PUBLIC_DIR}\n`);
  await convertMockup();
  await convertTestimonials();
  // Threshold 240KB: auth_bg.webp (~223KB) is already well-optimized; no benefit re-encoding.
  await reencodeIfLarge('auth_bg.webp', { maxBytes: 240 * 1024, width: 1600, quality: 78 });
  await reencodeIfLarge('eye_lashes.webp', { maxBytes: 200 * 1024, width: 1200, quality: 80 });
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
