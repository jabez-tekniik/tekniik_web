// Render the pilot HTML in print mode at A4-landscape CSS dimensions and
// snapshot a few pages so we can visually verify annotations render.
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const playwrightEntry = path.resolve(repoRoot, 'busline_web/node_modules/@playwright/test/index.mjs');
const { chromium } = await import(pathToFileURL(playwrightEntry).href);

const html = path.join(repoRoot, 'docs/testing/vysa-knowledge-base-pilot.html');
const out = path.join(repoRoot, 'docs/testing/screenshots/_verify-print.png');

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1092, height: 4000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.emulateMedia({ media: 'print' });
await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
// Snap shots 1 (homepage), 2 (modal email), 4 (password step)
const figs = await page.locator('figure.shot').all();
for (let i = 0; i < Math.min(4, figs.length); i++) {
  await figs[i].scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const out2 = out.replace('.png', `-${i + 1}.png`);
  await figs[i].screenshot({ path: out2 });
  console.log('Wrote', out2);
}
console.log('Wrote', out);
await browser.close();
