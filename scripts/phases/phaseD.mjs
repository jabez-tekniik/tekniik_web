// Phase D — Cross-cutting flows.
// Run by scripts/captureKnowledgeBase.mjs.

export async function run({ page, context, step, annotateAndShoot, activeRoot, WEB, ADMIN }) {

  const dialog = () => page.locator('[role="dialog"]:visible').first();

  async function clearState() {
    await context.clearCookies().catch(() => {});
    await page.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch {} }).catch(() => {});
  }

  async function loginTraveller(email, password) {
    await clearState();
    await page.goto(WEB, { waitUntil: 'networkidle' });
    const get = page.getByRole('button', { name: /get started/i }).first();
    if (await get.count()) await get.click();
    else await page.getByRole('button', { name: /^sign in$/i }).first().click();
    await page.waitForSelector('[role="dialog"]:visible, .auth-modal-card', { timeout: 4000 }).catch(() => {});
    await page.locator('#auth-email').fill(email);
    await page.getByRole('button', { name: /continue/i }).first().click();
    await page.locator('#auth-password').waitFor({ timeout: 5000 }).catch(() => {});
    await page.locator('#auth-password').fill(password);
    await activeRoot().getByRole('button', { name: /^sign in$/i }).first().click().catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(800);
  }

  async function loginOperator(email, password) {
    await clearState();
    await page.goto(`${WEB}/operator/auth`, { waitUntil: 'networkidle' });
    await page.getByLabel('Work email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: /^Sign in$/ }).first().click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(800);
  }

  async function loginStaff(email, password) {
    await clearState();
    await page.goto(`${WEB}/operator/staff/auth`, { waitUntil: 'networkidle' });
    await page.getByLabel('Work email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: /^Sign in$/ }).first().click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(800);
  }

  async function loginAdmin(email, password) {
    await clearState();
    await page.goto(`${ADMIN}/login`, { waitUntil: 'networkidle' });
    await page.locator('#admin-email').fill(email);
    await page.locator('#admin-password').fill(password);
    await page.getByRole('button', { name: /^sign in$/i }).first().click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(800);
  }

  await step('D02 traveller cancel modal', async () => {
    await loginTraveller('lerato.mokoena@gmail.com', 'Demo1234!');
    await page.goto(`${WEB}/account/bookings`, { waitUntil: 'networkidle' });
    const firstBooking = page.locator('a[href*="/account/booking"], .account-booking-card a').first();
    if (!(await firstBooking.count())) return;
    await firstBooking.click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(700);
    const cancelBtn = page.getByRole('button', { name: /cancel booking/i }).first();
    if (!(await cancelBtn.count())) return;
    await cancelBtn.click();
    await page.waitForTimeout(500);
    await annotateAndShoot('D02-cancel-confirm-modal', {
      'Cancel confirmation modal — explains refund + asks for reason': dialog(),
      'Confirm CTA — runs the cancel + refund': dialog().getByRole('button', { name: /yes,? cancel|confirm cancel|cancel booking/i }).first(),
      'Keep booking — dismisses the modal': dialog().getByRole('button', { name: /keep booking|nevermind|close/i }).first(),
    });
    await page.keyboard.press('Escape').catch(() => {});
  });

  await step('D03 operator cancel modal', async () => {
    await loginOperator('sandra@greyhound.co.za', 'Operator1234!');
    await page.goto(`${WEB}/operator/bookings`, { waitUntil: 'networkidle' });
    const firstRow = page.locator('main.op-content table tbody tr').first();
    if (!(await firstRow.count())) return;
    await firstRow.click().catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(700);
    const cancelBtn = page.getByRole('button', { name: /^cancel$/i }).first();
    if (!(await cancelBtn.count())) return;
    await cancelBtn.click();
    await page.waitForTimeout(500);
    await annotateAndShoot('D03-operator-cancel-refund-modal', {
      'Cancel-and-refund confirmation dialog': dialog(),
      'Reason field — required for audit trail': dialog().locator('textarea, input[type="text"]').first(),
      'Cancel & refund CTA — issues refund': dialog().getByRole('button', { name: /cancel.*refund|refund/i }).first(),
    });
    await page.keyboard.press('Escape').catch(() => {});
  });

  await step('D04 admin refunds queue', async () => {
    await loginAdmin('admin@vysa.co.za', 'Admin1234!');
    await page.goto(`${ADMIN}/refunds`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await annotateAndShoot('D04-admin-refunds-list', {
      'Refunds list — every refund across operators': page.locator('main table').first(),
      'Pending refunds heading': page.locator('main h1, main h2').first(),
    }, { fullPage: true });
  });

  await step('D05 no-show modal', async () => {
    await loginOperator('sandra@greyhound.co.za', 'Operator1234!');
    await page.goto(`${WEB}/operator/bookings`, { waitUntil: 'networkidle' });
    const firstRow = page.locator('main.op-content table tbody tr').first();
    if (!(await firstRow.count())) return;
    await firstRow.click().catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(700);
    const noShowBtn = page.getByRole('button', { name: /mark no.?show/i }).first();
    if (!(await noShowBtn.count())) return;
    await noShowBtn.click();
    await page.waitForTimeout(400);
    await annotateAndShoot('D05-no-show-modal', {
      'No-show confirmation dialog — irreversible, no refund': dialog(),
      'Yes, mark no-show — destructive CTA': dialog().getByRole('button', { name: /yes,? mark no.?show/i }).first(),
    });
    await page.keyboard.press('Escape').catch(() => {});
  });

  await step('D06 suspend operator dialog', async () => {
    await loginAdmin('admin@vysa.co.za', 'Admin1234!');
    await page.goto(`${ADMIN}/operators`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const firstOp = page.locator('main table tbody tr').first();
    if (!(await firstOp.count())) return;
    await firstOp.click().catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(700);
    const suspendBtn = page.getByRole('button', { name: /^suspend$/i }).first();
    if (!(await suspendBtn.count())) return;
    await suspendBtn.click();
    await page.waitForTimeout(400);
    await annotateAndShoot('D06-suspend-operator-dialog', {
      'Suspend Operator confirm dialog': dialog(),
      'Description — explains operating block + reactivation path': dialog().locator('p').first(),
      'Suspend CTA — destructive': dialog().getByRole('button', { name: /^suspend$/i }).first(),
    });
    await page.keyboard.press('Escape').catch(() => {});
  });

  await step('D08 act-as button on user detail', async () => {
    await loginAdmin('admin@vysa.co.za', 'Admin1234!');
    await page.goto(`${ADMIN}/users`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const firstUserRow = page.locator('main table tbody tr').first();
    if (!(await firstUserRow.count())) return;
    await firstUserRow.click().catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(700);
    await annotateAndShoot('D08-admin-user-controls', {
      'Suspend user — destructive admin action': page.getByRole('button', { name: /^suspend$/i }).first(),
      'Act as this user — issues impersonation token': page.locator('button[aria-label="Act as this user"]').first(),
      'User profile card — identity + verification status': page.locator('main h1, main h2').first(),
    }, { fullPage: true });
  });

  await step('D09 parcel handover modal', async () => {
    await loginStaff('parcel-clerk@greyhound.co.za', 'ParcelClerk1234!');
    await page.goto(`${WEB}/operator/parcels`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const firstParcel = page.locator('a[href*="/operator/parcels/"]').filter({ hasText: /[A-Z0-9]/ }).first();
    if (!(await firstParcel.count())) return;
    await firstParcel.click().catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(700);
    const handBtn = page.getByRole('button', { name: /hand over/i }).first();
    if (!(await handBtn.count())) return;
    await handBtn.click();
    await page.waitForTimeout(500);
    await annotateAndShoot('D09-parcel-handover-modal', {
      'Handover modal — recipient identity capture': dialog(),
      'ID number input — recipient ID/passport': dialog().locator('#handover-id-number, input').first(),
      'Continue button — moves to verification step': dialog().getByRole('button', { name: /continue/i }).first(),
    });
    await page.keyboard.press('Escape').catch(() => {});
  });

  await step('D13 travel vault add modal', async () => {
    await loginTraveller('lerato.mokoena@gmail.com', 'Demo1234!');
    await page.goto(`${WEB}/account/vault`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await annotateAndShoot('D13a-vault-page', {
      'Travel Vault page — stored docs grouped by type': page.locator('h1').first(),
      'Add document CTA — opens the upload modal': page.getByRole('button', { name: /add document|add your first document/i }).first(),
    }, { fullPage: true });
    const addBtn = page.getByRole('button', { name: /add document|add your first document/i }).first();
    if (!(await addBtn.count())) return;
    await addBtn.click();
    await page.waitForTimeout(500);
    await annotateAndShoot('D13b-vault-add-modal', {
      'Add document modal — type / number / expiry / images': dialog(),
      'Save document CTA': dialog().getByRole('button', { name: /save|add|upload/i }).first(),
    });
    await page.keyboard.press('Escape').catch(() => {});
  });

  await step('D14 operator finance balance', async () => {
    await loginOperator('sandra@greyhound.co.za', 'Operator1234!');
    await page.goto(`${WEB}/operator/finance`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await annotateAndShoot('D14-operator-finance-balance', {
      'Available balance — what the operator can request as payout': page.locator('main.op-content section, main.op-content .grid').first(),
      'Request payout CTA': page.getByRole('button', { name: /request payout|withdraw/i }).first(),
      'Recent payouts table — historical settlements': page.locator('main.op-content table').first(),
    }, { fullPage: true });
  });
}
