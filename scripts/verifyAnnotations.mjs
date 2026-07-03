#!/usr/bin/env node
// Lint the screenshot manifest and flag suspicious anchors.
// Helps spot wrong locators before regenerating the PDF.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.resolve(__dirname, '..', 'docs/testing/screenshots/manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

const issues = [];
let totalShots = 0;
let totalAnchors = 0;

for (const [key, def] of Object.entries(manifest)) {
  totalShots++;
  const W = def.viewport?.width ?? 1440;
  const H = def.fullPage ? def.pageHeight : (def.viewport?.height ?? 900);
  const anchors = Object.entries(def.anchors || {});
  totalAnchors += anchors.length;

  if (anchors.length === 0) {
    issues.push({ key, level: 'warn', msg: '0 anchors captured' });
    continue;
  }

  for (const [label, b] of anchors) {
    const lc = label.toLowerCase();
    const looksLikeButton = /\b(button|cta|submit|continue|sign in|send|create|reset|pay|book|register|verify|confirm|next|back|cancel|delete|save|update|approve|reject|finish|start|open|close|tab)\b/.test(lc);
    const looksLikeField  = /\b(field|input|email|password|name|phone|otp|code|search bar|date picker|select|dropdown)\b/.test(lc);
    const isIconHint = /\b(icon|arrow|chevron|close|menu|burger|kebab|hamburger)\b/.test(lc);

    if (b.width < 1 || b.height < 1) {
      issues.push({ key, level: 'fail', msg: `[${label}] zero-area box`, box: b });
      continue;
    }
    if (b.x + b.width < 0 || b.x > W || b.y + b.height < 0 || b.y > H) {
      issues.push({ key, level: 'fail', msg: `[${label}] outside captured area (W=${W} H=${H})`, box: b });
      continue;
    }
    const minSide = isIconHint ? 24 : (looksLikeButton ? 60 : looksLikeField ? 80 : 8);
    const minHeight = isIconHint ? 24 : (looksLikeButton ? 24 : looksLikeField ? 24 : 6);
    if (b.width < minSide || b.height < minHeight) {
      issues.push({ key, level: 'warn', msg: `[${label}] suspiciously small (w=${Math.round(b.width)} h=${Math.round(b.height)}); locator likely matched the wrong element`, box: b });
    }
    if (looksLikeButton && b.width > W * 0.95) {
      issues.push({ key, level: 'info', msg: `[${label}] very wide for a button (w=${Math.round(b.width)}); likely a section wrapper`, box: b });
    }
  }
}

console.log(`\n📋 Manifest: ${totalShots} shots, ${totalAnchors} anchors\n`);

const fails = issues.filter((i) => i.level === 'fail');
const warns = issues.filter((i) => i.level === 'warn');
const infos = issues.filter((i) => i.level === 'info');

if (fails.length) {
  console.log(`❌ ${fails.length} hard failures:`);
  for (const f of fails) console.log(`   ${f.key}: ${f.msg}`);
  console.log('');
}
if (warns.length) {
  console.log(`⚠ ${warns.length} warnings:`);
  for (const w of warns) console.log(`   ${w.key}: ${w.msg}`);
  console.log('');
}
if (infos.length) {
  console.log(`ℹ ${infos.length} info notes:`);
  for (const i of infos) console.log(`   ${i.key}: ${i.msg}`);
  console.log('');
}

if (!fails.length && !warns.length) {
  console.log('✓ No suspicious anchors. Open docs/testing/vysa-knowledge-base-pilot.html to visually review.');
}

process.exit(fails.length ? 1 : 0);
