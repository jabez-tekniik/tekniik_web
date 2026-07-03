/**
 * Looqz — Post-generation WebP compression pipeline
 *
 * Walks `looqz_web/src/assets/generated/` recursively, converts every .jpg /
 * .png to a .webp (quality 78, metadata stripped, resized per folder rules)
 * and deletes the original on success. Prints a before/after size report.
 *
 * Runs automatically as the final step of generateImages.js after the
 * passed/failed summary. Bypass with --skip-compress on either generator.
 *
 * Usage (standalone):
 *   node scripts/compressGenerated.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, '..');
const GENERATED_ROOT = path.resolve(WEB_ROOT, 'src/assets/generated');

// Resize rules keyed by the first path segment under generated/.
// max = longest edge sharp fits inside; targetKB = informational (logged if exceeded).
const RULES = {
  fallback:   { max: { width: 1600, height: 900 },  targetKB: 160 },
  hero:       { max: { width: 1080, height: 1920 }, targetKB: 200 },
  categories: { max: { width: 800,  height: 600 },  targetKB: 80  },
  gallery:    { max: { width: 1000, height: 1000 }, targetKB: 100 },
  services:   { max: { width: 720,  height: 960 },  targetKB: 80  },
  popular:    { max: { width: 800,  height: 600 },  targetKB: 80  },
  auth:       { max: { width: 1200, height: 1600 }, targetKB: 150 },
  role:       { max: { width: 800,  height: 600 },  targetKB: 80  },
  partner:    { max: { width: 1000, height: 1000 }, targetKB: 140 },
  avatars:    { max: { width: 256,  height: 256 },  targetKB: 20  },
};

const QUALITY = 78;
const SOURCE_EXTS = new Set(['.jpg', '.jpeg', '.png']);

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function ruleFor(filePath) {
  const rel = path.relative(GENERATED_ROOT, filePath).split(path.sep);
  return RULES[rel[0]] ?? null;
}

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export async function compressGenerated() {
  if (!fs.existsSync(GENERATED_ROOT)) {
    console.log(`\nCompress: ${path.relative(WEB_ROOT, GENERATED_ROOT)} does not exist — nothing to compress.`);
    return { processed: 0, skipped: 0, failed: 0 };
  }

  const files = walk(GENERATED_ROOT).filter((f) =>
    SOURCE_EXTS.has(path.extname(f).toLowerCase())
  );

  if (files.length === 0) {
    console.log('\nCompress: no .jpg/.png files found under generated/.');
    return { processed: 0, skipped: 0, failed: 0 };
  }

  console.log(`\nCompressing ${files.length} generated image(s) to WebP...\n`);

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const srcPath of files) {
    const rel = path.relative(WEB_ROOT, srcPath);
    const rule = ruleFor(srcPath);
    if (!rule) {
      console.log(`  SKIP (no rule) ${rel}`);
      skipped++;
      continue;
    }

    const outPath = srcPath.replace(/\.(jpe?g|png)$/i, '.webp');
    try {
      const beforeBytes = fs.statSync(srcPath).size;

      await sharp(srcPath)
        .rotate()
        .resize({
          width: rule.max.width,
          height: rule.max.height,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY })
        .withMetadata({ exif: {} })
        .toFile(outPath);

      const afterBytes = fs.statSync(outPath).size;
      fs.unlinkSync(srcPath);

      const overBudget = afterBytes / 1024 > rule.targetKB ? ` (> ${rule.targetKB} KB target)` : '';
      console.log(
        `  OK ${rel} — ${formatKB(beforeBytes)} → ${formatKB(afterBytes)}${overBudget}`
      );
      processed++;
    } catch (err) {
      console.log(`  FAILED ${rel}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nCompress done: ${processed} converted, ${skipped} skipped, ${failed} failed.\n`);
  return { processed, skipped, failed };
}

// Run directly when invoked as a script (not when imported)
const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  compressGenerated().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
