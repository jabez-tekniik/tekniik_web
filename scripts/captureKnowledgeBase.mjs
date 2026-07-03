#!/usr/bin/env node
// Capture annotated-knowledge-base screenshots + bounding-box manifests via Playwright.
// Usage:  node scripts/captureKnowledgeBase.mjs
// Requires: dev servers up (vysa_node:5000, busline_web:5173, vysa_admin:5175)
//           and Playwright installed in busline_web/node_modules.

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const OUT = path.resolve(repoRoot, 'docs/testing/screenshots');

const playwrightEntry = path.resolve(repoRoot, 'busline_web/node_modules/@playwright/test/index.mjs');
const { chromium } = await import(pathToFileURL(playwrightEntry).href);

const WEB   = process.env.WEB_URL   || 'http://localhost:5173';
const ADMIN = process.env.ADMIN_URL || 'http://localhost:5175/admin';

const VIEWPORT = { width: 1440, height: 900 };

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
});
const page = await context.newPage();

// ─── annotation manifest ───────────────────────────────────────────────────
// Each screenshot has an entry: { width, height, devicePixelRatio, anchors: { name: { x,y,w,h } } }
// Coordinates are in CSS pixels relative to the viewport (or full page if fullPage:true).
const manifest = {};

// ─── locator helpers ───────────────────────────────────────────────────────
// The biggest source of bad anchors is `.first()` against ambiguous selectors —
// e.g. `button[type="submit"]` matches a submit button on the homepage behind an
// open modal. These helpers always scope to the visible dialog when one is open.

/** Returns the open `[role="dialog"]` if any, else `page` itself. */
function activeRoot() {
  const dialog = page.locator('[role="dialog"]:visible, .auth-modal-card:visible').first();
  return dialog;
}

/**
 * Resolve an anchor descriptor to a Playwright Locator.
 * Accepts: a Locator, a string CSS selector, or an object:
 *   { role, name, scope?, exact? }   → role-based via getByRole
 *   { selector, scope? }             → scoped CSS selector
 *   { text, scope?, tag? }           → getByText / hasText filter
 *   { id }                           → '#id' on page
 */
function resolveLocator(descriptor) {
  if (descriptor == null) return null;
  if (typeof descriptor === 'string') return page.locator(descriptor);
  if (typeof descriptor.locator === 'function') return descriptor; // already a Locator

  if (descriptor.id) return page.locator(`#${descriptor.id}`);

  const root = descriptor.scope === 'page'
    ? page
    : descriptor.scope === 'dialog'
      ? activeRoot()
      : (descriptor.scope || page);

  if (descriptor.role) {
    return root.getByRole(descriptor.role, {
      name: descriptor.name,
      exact: !!descriptor.exact,
    });
  }
  if (descriptor.selector) {
    let l = root.locator(descriptor.selector);
    if (descriptor.text) l = l.filter({ hasText: descriptor.text });
    return l;
  }
  if (descriptor.text) {
    return root.getByText(descriptor.text, { exact: !!descriptor.exact });
  }
  return null;
}

/**
 * Validate a captured bounding box against the viewport / page geometry and
 * the anchor's plain-English label. Returns true if the box looks usable;
 * false (with a warning logged) if it's obviously wrong.
 */
function isPlausibleBox(label, box, opts) {
  if (!box) return false;
  if (box.width < 1 || box.height < 1) {
    console.warn(`    ⚠ ${label} → zero-area box (w=${box.width.toFixed(1)} h=${box.height.toFixed(1)}); skipped.`);
    return false;
  }

  const W = VIEWPORT.width;
  const H = opts.fullPage ? opts.pageHeight : VIEWPORT.height;

  // Off-page (outside captured area). Allow tiny overflows.
  if (box.x + box.width < -2 || box.x > W + 2 || box.y + box.height < -2 || box.y > H + 2) {
    console.warn(`    ⚠ ${label} → outside captured area (x=${box.x.toFixed(0)} y=${box.y.toFixed(0)}); skipped.`);
    return false;
  }

  // Hard floor only — reject anchors that are obviously wrong (collapsed
  // boxes, near-zero area). Anything larger is kept; the build script's
  // 4px outset will still produce a visible highlight.
  if (box.width < 8 || box.height < 8) {
    console.warn(`    ⚠ ${label} → tiny box (w=${box.width.toFixed(0)} h=${box.height.toFixed(0)}); skipped.`);
    return false;
  }
  return true;
}

/**
 * Capture a screenshot + bounding boxes. `anchors` is { label: descriptor }.
 * Each descriptor is validated; bad ones are dropped with a warning so the
 * resulting manifest only contains anchors that will render correctly.
 */
/**
 * Wait until every <img> on the page has finished loading (or errored).
 * Without this, list pages that lazy-load thumbnails (Routes / Cities / Bus
 * companies / parcel covers) get screenshotted with empty image slots, which
 * makes the annotated highlight pointless.
 */
async function waitForImagesLoaded(timeoutMs = 8000) {
  // 1) Scroll the page to trigger lazy-load observers.
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight;
    const step = Math.max(window.innerHeight * 0.8, 600);
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  }).catch(() => {});

  // 2) Wait for every <img> to be loaded (or errored) and `decode()` to settle.
  await page.evaluate(async (deadline) => {
    const start = performance.now();
    while (performance.now() - start < deadline) {
      const imgs = Array.from(document.images);
      const pending = imgs.filter((i) => i.src && !i.complete);
      if (!pending.length) {
        await Promise.all(imgs.map((i) => i.decode().catch(() => null)));
        return;
      }
      await new Promise((r) => setTimeout(r, 120));
    }
  }, timeoutMs).catch(() => {});

  // 3) Settle layout after scroll.
  await page.waitForTimeout(200);
}

async function annotateAndShoot(name, anchors = {}, opts = {}) {
  const file = path.join(OUT, `${name}.png`);

  // Make sure images are decoded BEFORE we measure anchors or shoot the
  // screenshot — otherwise we end up annotating empty image slots.
  await waitForImagesLoaded(opts.imageWaitMs ?? 8000);

  const pageHeight = opts.fullPage
    ? await page.evaluate(() => document.documentElement.scrollHeight)
    : VIEWPORT.height;
  const validateOpts = { fullPage: !!opts.fullPage, pageHeight };

  const boxes = {};
  for (const [label, descriptor] of Object.entries(anchors)) {
    try {
      const locator = resolveLocator(descriptor);
      if (!locator) {
        console.warn(`    ⚠ ${label} → unresolvable descriptor; skipped.`);
        continue;
      }
      const target = locator.first();
      const isVisible = await target.isVisible({ timeout: 1200 }).catch(() => false);
      if (!isVisible) {
        console.warn(`    ⚠ ${label} → no visible match; skipped.`);
        continue;
      }
      // Try to bring it into view for full-page captures.
      if (opts.fullPage) await target.scrollIntoViewIfNeeded({ timeout: 600 }).catch(() => {});

      const box = await target.boundingBox();
      if (!isPlausibleBox(label, box, validateOpts)) continue;
      boxes[label] = box;
    } catch (err) {
      console.warn(`    ⚠ ${label} → error resolving (${err.message}); skipped.`);
    }
  }

  await page.screenshot({ path: file, fullPage: !!opts.fullPage });
  manifest[name] = {
    file: `${name}.png`,
    viewport: VIEWPORT,
    fullPage: !!opts.fullPage,
    devicePixelRatio: 2,
    pageHeight,
    anchors: boxes,
    section: opts.section || null,
    caption: opts.caption || null,
  };
  console.log('  ✓', name, '·', Object.keys(boxes).length, 'anchors');
}

async function dismissCookieBanner() {
  try {
    const accept = await page.locator('button', { hasText: /accept|got it|ok/i }).first();
    if (await accept.isVisible({ timeout: 500 })) await accept.click();
  } catch {}
}

async function step(label, fn) {
  console.log('\n→', label);
  try { await fn(); }
  catch (err) { console.warn(`  ✗ step "${label}" failed: ${err.message}`); }
}

async function openTravellerAuthModal() {
  const get = page.getByRole('button', { name: /get started/i }).first();
  if (await get.count()) {
    await get.scrollIntoViewIfNeeded();
    await get.click();
    await page.waitForSelector('[role="dialog"]:visible, .auth-modal-card', { timeout: 4000 }).catch(() => {});
    return;
  }
  await page.getByRole('button', { name: /^sign in$/i }).first().click();
  await page.waitForSelector('[role="dialog"]:visible, .auth-modal-card', { timeout: 4000 }).catch(() => {});
}

// ───── 1. Traveller — sign-in modal ────────────────────────────────────────
await step('01 traveller sign-in modal', async () => {
  await page.goto(WEB, { waitUntil: 'networkidle' });
  await dismissCookieBanner();

  await annotateAndShoot('01a-home-before-signin', {
    'Sign-in entry — top-right "Get Started" button': { role: 'button', name: /get started/i, scope: 'page' },
    'Vysa logo — click to return home': page.locator('header a').first(),
  });

  await openTravellerAuthModal();
  await page.waitForTimeout(500);

  await annotateAndShoot('01b-traveller-modal-email-step', {
    'Email field — type your address here': { id: 'auth-email' },
    'Continue button — confirms the email': { role: 'button', name: /continue/i, scope: 'dialog' },
    'Continue with Google — one-click sign-in if email matches':
      activeRoot().locator('button, [role="button"]').filter({ hasText: /google/i }).first(),
  });

  await page.locator('#auth-email').fill('lerato.motaung@gmail.com');
  await page.waitForTimeout(150);
  await annotateAndShoot('01c-traveller-modal-email-filled', {
    'Email entered — Vysa checks if this account exists': { id: 'auth-email' },
  });

  await activeRoot().getByRole('button', { name: /continue/i }).first().click();
  await page.waitForTimeout(800);
  await annotateAndShoot('01d-traveller-modal-password-step', {
    'Password field — existing accounts arrive here': { id: 'auth-password' },
    '"Forgot password" link — opens reset flow':
      activeRoot().locator('button, a').filter({ hasText: /forgot password/i }).first(),
    'Sign in button — completes login': { role: 'button', name: /^sign in$/i, scope: 'dialog' },
  });
});

// ───── 2. Traveller — forgot-password flow ─────────────────────────────────
await step('02 traveller forgot password', async () => {
  await page.waitForTimeout(800);
  const forgot = activeRoot().locator('button, a').filter({ hasText: /forgot password/i }).first();
  await forgot.click({ force: true });
  await page.waitForTimeout(700);

  await annotateAndShoot('02a-traveller-forgot-email', {
    'Email is pre-filled from the previous step':
      activeRoot().locator('input[type="email"]').first(),
    'Send code — emails a 6-digit OTP':
      activeRoot().getByRole('button', { name: /send|continue/i }).first(),
  });

  const send = activeRoot().getByRole('button', { name: /send|continue/i }).first();
  await send.click({ force: true });
  await page.waitForTimeout(1200);

  await annotateAndShoot('02b-traveller-forgot-otp', {
    'OTP input — six digits delivered by email':
      activeRoot().locator('input[inputmode="numeric"], input[autocomplete="one-time-code"], input[maxlength="1"]').first(),
    'Resend code — 30-second cooldown':
      activeRoot().locator('button, a').filter({ hasText: /resend/i }).first(),
  });

  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
});

// ───── 3. Traveller — sign-up flow ─────────────────────────────────────────
await step('03 traveller sign-up', async () => {
  await page.goto(WEB, { waitUntil: 'networkidle' });
  await dismissCookieBanner();
  await openTravellerAuthModal();
  await page.waitForTimeout(400);

  const fresh = `tester+${Date.now()}@example.test`;
  await page.locator('#auth-email').fill(fresh);
  await annotateAndShoot('03a-signup-email-filled', {
    'New email — Vysa replies "exists: false" and switches to sign-up': { id: 'auth-email' },
  });

  await activeRoot().getByRole('button', { name: /continue/i }).first().click();
  await page.waitForTimeout(900);

  await annotateAndShoot('03b-signup-form', {
    'First name': { id: 'auth-first-name' },
    'Last name': { id: 'auth-last-name' },
    'Phone with country code': { id: 'auth-phone' },
    'Password — at least 8 characters': { id: 'auth-signup-password' },
    'Create account — sends an OTP to verify the email':
      { role: 'button', name: /create account|sign up|continue/i, scope: 'dialog' },
  });

  await page.locator('#auth-first-name').fill('Test');
  await page.locator('#auth-last-name').fill('User');
  await page.locator('#auth-phone').fill('+27 82 123 4567');
  await page.locator('#auth-signup-password').fill('Test1234!');
  await page.waitForTimeout(200);

  await annotateAndShoot('03c-signup-form-filled', {
    'All fields filled — ready to create the account': { id: 'auth-signup-password' },
    'Create account submits the form and triggers the OTP step':
      { role: 'button', name: /create account|sign up|continue/i, scope: 'dialog' },
  });

  await page.keyboard.press('Escape');
});

// ───── 4. Bus owner (Corporate Admin) sign-in ──────────────────────────────
await step('04 operator (corporate admin) sign-in', async () => {
  await page.goto(`${WEB}/operator/auth`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Operator auth page has tabs (Sign in / Register). Scope locators to the
  // visible auth card to avoid matching duplicates from a router-level layout.
  const card = page.locator('main, form').first();

  await annotateAndShoot('04a-operator-auth-landing', {
    'Sign in tab — for existing bus companies':
      card.getByRole('button', { name: /^sign in$/i }).first(),
    'Register tab — onboard a brand-new bus company':
      card.getByRole('button', { name: /^register$/i }).first(),
    'Email — Corporate Admin email on file':
      card.locator('input[type="email"]').first(),
    'Password': card.locator('input[type="password"]').first(),
  }, { fullPage: true });

  await card.locator('input[type="email"]').first().fill('sandra@greyhound.co.za');
  await card.locator('input[type="password"]').first().fill('Operator1234!');
  await page.waitForTimeout(200);

  await annotateAndShoot('04b-operator-auth-filled', {
    'Credentials filled — press Sign in':
      card.locator('button[type="submit"]:visible, button[type="submit"]').filter({ hasText: /sign in/i }).first(),
    'Forgot password link — opens reset flow':
      card.locator('button, a').filter({ hasText: /forgot/i }).first(),
  }, { fullPage: true });
});

// ───── 5. Bus staff sign-in ────────────────────────────────────────────────
await step('05 operator staff sign-in', async () => {
  await page.goto(`${WEB}/operator/staff/auth`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const card = page.locator('main, form').first();

  await annotateAndShoot('05a-staff-auth-landing', {
    'Sign-in only — staff are invite-only, no register tab':
      card.locator('input[type="email"]').first(),
    'Cross-link to Corporate Admin door':
      card.locator('a').filter({ hasText: /corporate|admin/i }).first(),
  }, { fullPage: true });

  await card.locator('input[type="email"]').first().fill('parcel-clerk@greyhound.co.za');
  await card.locator('input[type="password"]').first().fill('ParcelClerk1234!');
  await page.waitForTimeout(200);

  await annotateAndShoot('05b-staff-auth-filled', {
    'Sign in — lands on the role-specific dashboard':
      card.locator('button[type="submit"]').filter({ hasText: /sign in/i }).first(),
  }, { fullPage: true });
});

// ───── 6. Operator forgot-password page ────────────────────────────────────
await step('06 operator forgot password', async () => {
  await page.goto(`${WEB}/operator/auth`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const forgot = page.locator('button, a').filter({ hasText: /forgot/i }).first();
  await forgot.click().catch(() => {});
  await page.waitForTimeout(700);
  const card = page.locator('main, form').first();
  await annotateAndShoot('06a-operator-forgot', {
    'Email field — your operator account email':
      card.locator('input[type="email"]').first(),
    'Send reset code':
      card.locator('button[type="submit"]').filter({ hasText: /send|reset/i }).first(),
  });
});

// ───── 7. Vysa team admin sign-in ──────────────────────────────────────────
await step('07 admin sign-in', async () => {
  await page.goto(`${ADMIN}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  const card = page.locator('main, form').first();

  await annotateAndShoot('07a-admin-login-landing', {
    'Email or username': { id: 'admin-email' },
    'Password': { id: 'admin-password' },
    'Sign in':
      card.locator('button[type="submit"]').filter({ hasText: /sign in/i }).first(),
  }, { fullPage: true });

  await page.locator('#admin-email').fill('admin@vysa.co.za');
  await page.locator('#admin-password').fill('Admin1234!');
  await page.waitForTimeout(200);

  await annotateAndShoot('07b-admin-login-filled', {
    'Credentials filled — press Sign in to enter the platform admin':
      card.locator('button[type="submit"]').filter({ hasText: /sign in/i }).first(),
  }, { fullPage: true });
});

// ─── PHASE A · CUSTOMER JOURNEY ──────────────────────────────────────────
// Filled in by the Phase A drafter agent — see scripts/phaseA.mjs (imported below).
try {
  const phaseA = await import(pathToFileURL(path.resolve(__dirname, 'phases/phaseA.mjs')).href);
  if (typeof phaseA.run === 'function') await phaseA.run({ page, step, annotateAndShoot, activeRoot, resolveLocator, WEB, ADMIN });
} catch (err) {
  console.warn('Phase A skipped:', err.message);
}

// ─── PHASE B · OPERATOR PORTAL ───────────────────────────────────────────
try {
  const phaseB = await import(pathToFileURL(path.resolve(__dirname, 'phases/phaseB.mjs')).href);
  if (typeof phaseB.run === 'function') await phaseB.run({ page, context, step, annotateAndShoot, activeRoot, resolveLocator, WEB, ADMIN });
} catch (err) {
  console.warn('Phase B skipped:', err.message);
}

// ─── PHASE C · ADMIN PORTAL ──────────────────────────────────────────────
try {
  const phaseC = await import(pathToFileURL(path.resolve(__dirname, 'phases/phaseC.mjs')).href);
  if (typeof phaseC.run === 'function') await phaseC.run({ page, context, step, annotateAndShoot, activeRoot, resolveLocator, WEB, ADMIN });
} catch (err) {
  console.warn('Phase C skipped:', err.message);
}

// ─── PHASE D · CROSS-CUTTING FLOWS ───────────────────────────────────────
try {
  const phaseD = await import(pathToFileURL(path.resolve(__dirname, 'phases/phaseD.mjs')).href);
  if (typeof phaseD.run === 'function') await phaseD.run({ page, context, step, annotateAndShoot, activeRoot, resolveLocator, WEB, ADMIN });
} catch (err) {
  console.warn('Phase D skipped:', err.message);
}

await writeFile(
  path.join(OUT, 'manifest.json'),
  JSON.stringify(manifest, null, 2),
  'utf8'
);

await browser.close();
console.log('\n✓ Done. Screenshots + manifest in', OUT);
