#!/usr/bin/env node
/**
 * Vysa — Image optimization pipeline
 *
 * Three groups with different strategies:
 *   A) WebP-convert: browser/bundled jpg+png → .webp, delete original
 *      (busline_web/public heroes, busline_web/src/assets/generated,
 *       vysa_admin/src/assets/generated, vysa_mobile/assets/generated)
 *
 *   B) PNG re-encode in place: keep format (email clients, Expo, favicons, logos)
 *      (vysa_node email icons, vysa_mobile app icons, favicons, *logo.png)
 *
 *   C) JPG re-encode in place: keep format (email hero images)
 *      (vysa_node/src/emails/assets/images)
 *
 * Writes scripts/optimize-map.json — list of {oldPath,newPath} for code-reference
 * updates (only for group A).
 *
 * Run from repo root:  node scripts/optimizeVysaAssets.js
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// sharp lives in vysa_node/node_modules
const sharpPath = path.join(ROOT, 'vysa_node', 'node_modules', 'sharp', 'lib', 'index.js');
const sharp = (await import(pathToFileURL(sharpPath).href)).default;

const fmt = (b) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${(b / 1024).toFixed(1)} KB`);

async function walkDir(dir) {
  const out = [];
  try {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out.push(...(await walkDir(full)));
      else out.push(full);
    }
  } catch {}
  return out;
}

async function listImages(dir, exts) {
  const all = await walkDir(dir);
  return all.filter((f) => exts.includes(path.extname(f).toLowerCase()));
}

async function statOrNull(p) {
  try { return await fs.stat(p); } catch { return null; }
}

// ---------------------------------------------------------------------------
// Group A: WebP conversion (delete originals)
// ---------------------------------------------------------------------------

const WEBP_GROUPS = [
  { dir: 'busline_web/public',                 exts: ['.jpg', '.jpeg'], quality: 80, maxWidth: 1920 },
  { dir: 'busline_web/src/assets/generated',   exts: ['.jpg', '.jpeg'], quality: 78, maxWidth: 1600 },
  { dir: 'vysa_admin/src/assets/generated',    exts: ['.jpg', '.jpeg'], quality: 78, maxWidth: 1600 },
  { dir: 'vysa_mobile/assets/generated',       exts: ['.jpg', '.jpeg'], quality: 78, maxWidth: 1400 },
];

// Files inside the WEBP dirs that must be preserved as-is (do NOT convert)
const WEBP_EXCLUDES = new Set([
  'busline_web/public/favicon.png',   // favicons → PNG only
  'busline_web/public/logo.png',      // brand logo referenced as absolute URL
  'busline_web/public/home_hero_bg1.png',
  'busline_web/public/operators_hero_bg.png',
  'busline_web/public/routes_hero_bg.png',
].map((p) => path.normalize(p)));

async function convertToWebp(srcAbs, relDir, { quality, maxWidth }) {
  const dstAbs = srcAbs.replace(/\.(jpe?g|png)$/i, '.webp');
  const before = await fs.stat(srcAbs);
  await sharp(srcAbs)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(dstAbs);
  const after = await fs.stat(dstAbs);
  await fs.unlink(srcAbs);
  return { before: before.size, after: after.size, dstAbs };
}

async function runWebpGroup(group, mapping, stats) {
  const absDir = path.join(ROOT, group.dir);
  // Include PNGs in public too (heroes occasionally come as PNG)
  const exts = [...group.exts];
  if (group.dir === 'busline_web/public') exts.push('.png', '.jpeg');
  const files = await listImages(absDir, exts);
  for (const src of files) {
    const rel = path.relative(ROOT, src).split(path.sep).join('/');
    const relNorm = path.normalize(rel);
    if (WEBP_EXCLUDES.has(relNorm)) {
      console.log(`  SKIP (excluded) ${rel}`);
      continue;
    }
    try {
      const { before, after, dstAbs } = await convertToWebp(src, group.dir, group);
      const newRel = path.relative(ROOT, dstAbs).split(path.sep).join('/');
      mapping.push({ oldPath: rel, newPath: newRel });
      stats.before += before;
      stats.after += after;
      stats.count++;
      console.log(`  WEBP  ${rel}  ${fmt(before)} → ${fmt(after)}`);
    } catch (err) {
      console.log(`  FAIL  ${rel}: ${err.message}`);
      stats.failed++;
    }
  }
}

// ---------------------------------------------------------------------------
// Group B: PNG re-encode in place (preserve transparency)
// ---------------------------------------------------------------------------

const PNG_GROUPS = [
  { dir: 'vysa_node/src/emails/assets/icons',  maxWidth: 128,  compressionLevel: 9, palette: true, quality: 90 },
  { dir: 'vysa_mobile/assets',                  maxWidth: 2048, compressionLevel: 9, palette: false, quality: 95, filesOnly: ['icon.png', 'adaptive-icon.png', 'splash-icon.png', 'favicon.png'] },
  { files: [
      'busline_web/public/favicon.png',
      'busline_web/public/logo.png',
      'busline_web/public/home_hero_bg1.png',
      'busline_web/public/operators_hero_bg.png',
      'busline_web/public/routes_hero_bg.png',
      'busline_web/src/assets/logo.png',
      'vysa_admin/public/logo.png',
      'vysa_admin/src/assets/logo.png',
    ],
    maxWidth: 1920, compressionLevel: 9, palette: false, quality: 90 },
];

async function reencodePng(absPath, opts) {
  const before = await statOrNull(absPath);
  if (!before) return null;
  const tmp = absPath + '.tmp.png';
  let pipeline = sharp(absPath).rotate();
  if (opts.maxWidth) pipeline = pipeline.resize({ width: opts.maxWidth, withoutEnlargement: true });
  pipeline = pipeline.png({
    compressionLevel: opts.compressionLevel ?? 9,
    palette: !!opts.palette,
    quality: opts.quality ?? 90,
    effort: 10,
  });
  await pipeline.toFile(tmp);
  const after = await fs.stat(tmp);
  if (after.size >= before.size) {
    // No gain — keep original.
    await fs.unlink(tmp);
    return { before: before.size, after: before.size, kept: true };
  }
  await fs.unlink(absPath);
  await fs.rename(tmp, absPath);
  return { before: before.size, after: after.size, kept: false };
}

async function runPngGroup(group, stats) {
  const targets = [];
  if (group.dir) {
    const absDir = path.join(ROOT, group.dir);
    const found = await listImages(absDir, ['.png']);
    for (const f of found) {
      if (group.filesOnly && !group.filesOnly.includes(path.basename(f))) continue;
      targets.push(f);
    }
  }
  if (group.files) {
    for (const rel of group.files) targets.push(path.join(ROOT, rel));
  }
  for (const abs of targets) {
    const rel = path.relative(ROOT, abs).split(path.sep).join('/');
    try {
      const res = await reencodePng(abs, group);
      if (!res) { console.log(`  MISS  ${rel}`); continue; }
      stats.before += res.before;
      stats.after += res.after;
      stats.count++;
      const tag = res.kept ? 'KEEP' : 'PNG ';
      console.log(`  ${tag}  ${rel}  ${fmt(res.before)} → ${fmt(res.after)}`);
    } catch (err) {
      console.log(`  FAIL  ${rel}: ${err.message}`);
      stats.failed++;
    }
  }
}

// ---------------------------------------------------------------------------
// Group C: JPG re-encode in place (email hero images, sample)
// ---------------------------------------------------------------------------

const JPG_GROUPS = [
  { dir: 'vysa_node/src/emails/assets/images', maxWidth: 1200, quality: 78 },
];

async function reencodeJpg(absPath, opts) {
  const before = await statOrNull(absPath);
  if (!before) return null;
  const tmp = absPath + '.tmp.jpg';
  await sharp(absPath)
    .rotate()
    .resize({ width: opts.maxWidth, withoutEnlargement: true })
    .jpeg({ quality: opts.quality, mozjpeg: true })
    .toFile(tmp);
  const after = await fs.stat(tmp);
  if (after.size >= before.size) {
    await fs.unlink(tmp);
    return { before: before.size, after: before.size, kept: true };
  }
  await fs.unlink(absPath);
  await fs.rename(tmp, absPath);
  return { before: before.size, after: after.size, kept: false };
}

async function runJpgGroup(group, stats) {
  const absDir = path.join(ROOT, group.dir);
  const files = await listImages(absDir, ['.jpg', '.jpeg']);
  for (const abs of files) {
    const rel = path.relative(ROOT, abs).split(path.sep).join('/');
    try {
      const res = await reencodeJpg(abs, group);
      if (!res) continue;
      stats.before += res.before;
      stats.after += res.after;
      stats.count++;
      const tag = res.kept ? 'KEEP' : 'JPG ';
      console.log(`  ${tag}  ${rel}  ${fmt(res.before)} → ${fmt(res.after)}`);
    } catch (err) {
      console.log(`  FAIL  ${rel}: ${err.message}`);
      stats.failed++;
    }
  }
}

// Also handle email hero PNGs in vysa_node/src/emails/assets/images (rare)
async function runEmailImagePngs(stats) {
  const absDir = path.join(ROOT, 'vysa_node/src/emails/assets/images');
  const pngs = await listImages(absDir, ['.png']);
  for (const abs of pngs) {
    const rel = path.relative(ROOT, abs).split(path.sep).join('/');
    try {
      const res = await reencodePng(abs, { maxWidth: 1200, compressionLevel: 9, palette: false, quality: 88 });
      if (!res) continue;
      stats.before += res.before;
      stats.after += res.after;
      stats.count++;
      console.log(`  ${res.kept ? 'KEEP' : 'PNG '}  ${rel}  ${fmt(res.before)} → ${fmt(res.after)}`);
    } catch (err) {
      console.log(`  FAIL  ${rel}: ${err.message}`);
      stats.failed++;
    }
  }
}

// ---------------------------------------------------------------------------

async function main() {
  console.log(`Optimizing assets in ${ROOT}\n`);

  const mapping = [];
  const aStats = { count: 0, before: 0, after: 0, failed: 0 };
  const bStats = { count: 0, before: 0, after: 0, failed: 0 };
  const cStats = { count: 0, before: 0, after: 0, failed: 0 };

  console.log('-- Group A: convert to WebP --');
  for (const g of WEBP_GROUPS) await runWebpGroup(g, mapping, aStats);

  console.log('\n-- Group B: re-encode PNG in place --');
  for (const g of PNG_GROUPS) await runPngGroup(g, bStats);

  console.log('\n-- Group C: re-encode JPG / PNG email images in place --');
  for (const g of JPG_GROUPS) await runJpgGroup(g, cStats);
  await runEmailImagePngs(cStats);

  const mapPath = path.join(ROOT, 'scripts', 'optimize-map.json');
  await fs.writeFile(mapPath, JSON.stringify(mapping, null, 2));
  console.log(`\nWrote ${mapping.length} mappings to ${path.relative(ROOT, mapPath)}`);

  const total = {
    count: aStats.count + bStats.count + cStats.count,
    before: aStats.before + bStats.before + cStats.before,
    after: aStats.after + bStats.after + cStats.after,
    failed: aStats.failed + bStats.failed + cStats.failed,
  };
  const saved = total.before - total.after;
  const pct = total.before ? ((saved / total.before) * 100).toFixed(1) : '0.0';
  console.log(`\nSummary:`);
  console.log(`  WebP converted: ${aStats.count}  (${fmt(aStats.before)} → ${fmt(aStats.after)})`);
  console.log(`  PNG re-encoded: ${bStats.count}  (${fmt(bStats.before)} → ${fmt(bStats.after)})`);
  console.log(`  JPG re-encoded: ${cStats.count}  (${fmt(cStats.before)} → ${fmt(cStats.after)})`);
  console.log(`  Total: ${total.count} files, ${fmt(total.before)} → ${fmt(total.after)}  (saved ${fmt(saved)}, ${pct}%)`);
  if (total.failed) console.log(`  FAILED: ${total.failed}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
