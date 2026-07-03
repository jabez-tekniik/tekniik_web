import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const playwrightEntry = path.resolve(repoRoot, 'busline_web/node_modules/@playwright/test/index.mjs');
const { chromium } = await import(pathToFileURL(playwrightEntry).href);

const html = path.join(repoRoot, 'docs/testing/vysa-knowledge-base-pilot.html');
const out = path.join(repoRoot, 'docs/testing/screenshots/_verify-pilot-page.png');

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });

// Scroll to the first annotated shot (section 02)
await page.evaluate(() => {
  const el = document.querySelector('figure.shot');
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(500);
await page.screenshot({ path: out, fullPage: false });
console.log('Verified screenshot to', out);
await browser.close();
