#!/usr/bin/env node
// Generates docs/testing/vysa-knowledge-base.pdf from the matching HTML.
// Usage: node scripts/generateKnowledgeBasePdf.mjs

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';
import puppeteer from '../vysa_node/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

async function generate(htmlPath, pdfPath) {
  const url = pathToFileURL(htmlPath).href;
  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '18mm', bottom: '18mm', left: '14mm', right: '14mm' },
      preferCSSPageSize: true,
    });
    console.log('Wrote', pdfPath);
  } finally {
    await browser.close();
  }
}

const targets = [
  {
    html: path.join(repoRoot, 'docs', 'testing', 'vysa-knowledge-base.html'),
    pdf:  path.join(repoRoot, 'docs', 'testing', 'vysa-knowledge-base.pdf'),
  },
];

for (const t of targets) {
  await generate(t.html, t.pdf);
}
