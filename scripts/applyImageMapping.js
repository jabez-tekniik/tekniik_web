#!/usr/bin/env node
/**
 * Applies scripts/optimize-map.json to source code:
 * For each {oldPath,newPath}, replaces occurrences of the old BASENAME with
 * the new basename across source files in busline_web, vysa_admin, vysa_mobile,
 * vysa_node/src/emails.
 *
 * Matches both the full basename and any reference ending in the old filename,
 * keeping surrounding path intact. Skips node_modules, tmp, dist, build, .expo.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const map = JSON.parse(await fs.readFile(path.join(ROOT, 'scripts/optimize-map.json'), 'utf8'));

const SEARCH_ROOTS = [
  'busline_web/src',
  'busline_web/index.html',
  'busline_web/public', // manifest.json etc
  'vysa_admin/src',
  'vysa_admin/index.html',
  'vysa_mobile/src',
  'vysa_mobile/app.json',
  'vysa_mobile/App.tsx',
  'vysa_node/src/emails',
];

const EXTS = new Set(['.js','.jsx','.ts','.tsx','.vue','.html','.css','.scss','.sass','.less','.json','.hbs','.mjs','.cjs','.md']);
const SKIP_DIRS = new Set(['node_modules','.next','dist','build','.expo','.git','coverage','tmp']);

async function walk(dir) {
  const out = [];
  try {
    const st = await fs.stat(dir);
    if (st.isFile()) return [dir];
  } catch { return []; }
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (EXTS.has(path.extname(e.name).toLowerCase())) out.push(full);
  }
  return out;
}

// Build an array of {oldBase, newBase} for basename-level replace
const pairs = map.map(({oldPath, newPath}) => ({
  oldBase: oldPath.split('/').pop(),
  newBase: newPath.split('/').pop(),
}));

const touched = new Map();

for (const root of SEARCH_ROOTS) {
  const files = await walk(path.join(ROOT, root));
  for (const file of files) {
    let src = await fs.readFile(file, 'utf8');
    let changed = false;
    const hits = [];
    for (const { oldBase, newBase } of pairs) {
      if (oldBase === newBase) continue;
      // Word-ish boundary on left (start or non-alnum/underscore/dot/slash-preserving),
      // exact extension match via escaping.
      const esc = oldBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(?<![A-Za-z0-9_-])${esc}(?![A-Za-z0-9_])`, 'g');
      const before = src;
      src = src.replace(re, newBase);
      if (src !== before) {
        changed = true;
        hits.push(oldBase);
      }
    }
    if (changed) {
      await fs.writeFile(file, src);
      touched.set(path.relative(ROOT, file), hits);
    }
  }
}

console.log(`Updated ${touched.size} file(s):`);
for (const [f, hits] of touched) {
  console.log(`  ${f}  [${hits.join(', ')}]`);
}
