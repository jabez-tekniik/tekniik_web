#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const playwrightEntry = path.resolve(repoRoot, 'busline_web/node_modules/@playwright/test/index.mjs');
const { chromium } = await import(pathToFileURL(playwrightEntry).href);

const html = path.join(repoRoot, 'docs/testing/vysa-knowledge-base-pilot.html');
const pdf  = path.join(repoRoot, 'docs/testing/vysa-knowledge-base-pilot.pdf');

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: pdf,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '14mm', bottom: '14mm', left: '10mm', right: '10mm' },
    preferCSSPageSize: true,
  });
  console.log('Wrote', pdf);
} finally {
  await browser.close();
}
