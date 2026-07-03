// Phase B — Operator portal capture targets.
// Run by scripts/captureKnowledgeBase.mjs as a phase module.

export async function run({ page, context, step, annotateAndShoot, activeRoot, WEB }) {

  const SIDEBAR    = 'aside.op-sidebar';
  const TOPBAR     = 'header.op-topbar';
  const PAGE       = 'main.op-content';
  const PARCEL_BAR = '.parcel-sidebar';

  async function fillOperatorSignIn(email, password) {
    await page.getByLabel('Work email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: /^Sign in$/ }).first().click();
    await page.waitForSelector(TOPBAR, { state: 'visible', timeout: 15000 }).catch(() => {});
    await page.waitForLoadState('networkidle').catch(() => {});
  }

  async function loginCorporateAdmin() {
    await context.clearCookies().catch(() => {});
    await page.goto(`${WEB}/operator/auth`, { waitUntil: 'networkidle' });
    const signinTab = page.getByRole('tab', { name: /^Sign in$/ });
    if (await signinTab.count()) {
      const sel = await signinTab.getAttribute('aria-selected').catch(() => null);
      if (sel !== 'true') await signinTab.click();
    }
    await fillOperatorSignIn('sandra@greyhound.co.za', 'Operator1234!');
  }

  async function loginStaff(email, password) {
    await context.clearCookies().catch(() => {});
    await page.goto(`${WEB}/operator/staff/auth`, { waitUntil: 'networkidle' });
    await fillOperatorSignIn(email, password);
  }

  async function gotoOperator(path) {
    await page.goto(`${WEB}${path}`, { waitUntil: 'networkidle' });
    await page.waitForSelector(PAGE, { state: 'visible' }).catch(() => {});
    await page.waitForTimeout(400);
  }

  // ── Corporate Admin ────────────────────────────────────────────────────
  await step('B01 corp dashboard', async () => {
    await loginCorporateAdmin();
    await gotoOperator('/operator/overview');
    await annotateAndShoot('B01-corp-dashboard', {
      'Sidebar — full Corporate Admin menu': `${SIDEBAR} nav`,
      'Active nav row — Dashboard is highlighted': `${SIDEBAR} a.op-nav-item.active`,
      'Welcome heading — greets the signed-in admin': page.getByRole('heading', { level: 1, name: /welcome back/i }).first(),
      'Primary KPI strip — bookings, revenue, parcels': `${PAGE} .grid`,
      'Recent bookings table': `${PAGE} .op-table`,
    }, { fullPage: true });
  });

  await step('B02 corp sidebar groups', async () => {
    await annotateAndShoot('B02-corp-sidebar', {
      'Logo — links back to /operator/overview': `${SIDEBAR} .op-sidebar-logo`,
      'Operations group — Routes, Schedules, Bookings, Agent Booking': page.locator(`${SIDEBAR} .op-sidebar-section`).filter({ hasText: 'Operations' }).first(),
      'Parcels group — Counter, Queue, Activity, Manifest, Scan': page.locator(`${SIDEBAR} .op-sidebar-section`).filter({ hasText: 'Parcels' }).first(),
      'Business group — Reviews, Pricing, Payouts, Promotions, Finance, Team': page.locator(`${SIDEBAR} .op-sidebar-section`).filter({ hasText: 'Business' }).first(),
    });
  });

  await step('B03 routes list', async () => {
    await gotoOperator('/operator/routes');
    await annotateAndShoot('B03-corp-routes-list', {
      'Page header — Routes title + create CTA': `${PAGE} .op-page-header`,
      'KPI cards — total / active / cross-border / parcel-enabled': `${PAGE} .grid`,
      'Filter bar — search by city, status filter pills': `${PAGE} .op-filter-bar`,
      'Routes table — origin → destination, distance, duration': `${PAGE} .op-table`,
    }, { fullPage: true });
  });

  await step('B04 route detail', async () => {
    await gotoOperator('/operator/routes');
    const firstRow = page.locator(`${PAGE} .op-table tbody tr`).first();
    if (await firstRow.count()) {
      await firstRow.click().catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(600);
    }
    await annotateAndShoot('B04-corp-route-detail', {
      'Breadcrumb — Dashboard › Routes › Detail': `${TOPBAR} .op-breadcrumbs`,
      'Hero card — origin, destination, distance, duration': `${PAGE} h1`,
      'Add schedule CTA': page.getByRole('link', { name: /add schedule/i }).first(),
    }, { fullPage: true });
  });

  await step('B05 schedules list', async () => {
    await gotoOperator('/operator/schedules');
    await annotateAndShoot('B05-corp-schedules', {
      'Page header — Schedules + Add CTA': `${PAGE} .op-page-header`,
      'KPI strip — total / active / paused / weekly': `${PAGE} .grid`,
      'Schedules table — route, days, depart/arrive': `${PAGE} .op-table`,
    }, { fullPage: true });
  });

  await step('B06 bookings list', async () => {
    await gotoOperator('/operator/bookings');
    await annotateAndShoot('B06-corp-bookings', {
      'Page header — Bookings + Export CTA': `${PAGE} .op-page-header`,
      'KPI cards — Total, New, Confirmed, Cancelled': `${PAGE} .grid`,
      'Status tabs — New / Confirmed / Completed / Cancelled / Walk-in': `${PAGE} .op-tabs`,
      'Filter bar — search ref/customer + route + date': `${PAGE} .op-filter-bar`,
      'Bookings table': `${PAGE} .op-table`,
    }, { fullPage: true });
  });

  await step('B07 walk-in panel', async () => {
    await gotoOperator('/operator/bookings');
    const walkInTab = page.locator(`${PAGE} .op-tabs button.op-tab`, { hasText: 'Walk-in' });
    if (await walkInTab.count()) {
      await walkInTab.click().catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(500);
    }
    await annotateAndShoot('B07-corp-walkin', {
      'Walk-in tab active': `${PAGE} .op-tabs button.op-tab.active`,
      'Trip selector — upcoming trips': page.getByText(/trip/i).first(),
      'Passenger details form': page.getByLabel(/passenger name|full name/i).first(),
    }, { fullPage: true });
  });

  await step('B08 agent booking', async () => {
    await gotoOperator('/operator/agent-booking');
    await annotateAndShoot('B08-corp-agent-booking', {
      'Page header — Agent Booking': page.getByRole('heading', { level: 1, name: /agent booking/i }).first(),
      'Mini KPI strip — today\'s bookings, revenue': `${PAGE} .grid`,
      'Booking form — Trip ID, passenger, phone, seats': page.getByLabel(/trip id/i).first(),
    }, { fullPage: true });
  });

  await step('B09 reviews', async () => {
    await gotoOperator('/operator/reviews');
    await annotateAndShoot('B09-corp-reviews', {
      'Page header — Reviews': page.getByRole('heading', { level: 1, name: /reviews/i }).first(),
      'Review list — passenger ratings + comments': PAGE,
    }, { fullPage: true });
  });

  await step('B10 pricing', async () => {
    await gotoOperator('/operator/pricing');
    await annotateAndShoot('B10-corp-pricing', {
      'Page header — Pricing': page.getByRole('heading', { level: 1, name: /pricing/i }).first(),
      'Pricing controls — base fares + flexibility multipliers': PAGE,
    }, { fullPage: true });
  });

  await step('B11 payouts', async () => {
    await gotoOperator('/operator/payouts');
    await annotateAndShoot('B11-corp-payouts', {
      'Page header — Payouts': page.getByRole('heading', { level: 1, name: /payouts/i }).first(),
      'Payouts table — cycles, amounts, bank status': PAGE,
    }, { fullPage: true });
  });

  await step('B12 promotions', async () => {
    await gotoOperator('/operator/promotions');
    await annotateAndShoot('B12-corp-promotions', {
      'Page header — Promotions': page.getByRole('heading', { level: 1, name: /promotions/i }).first(),
      'Promotions list — discount codes + campaigns': PAGE,
    }, { fullPage: true });
  });

  await step('B13 finance', async () => {
    await gotoOperator('/operator/finance');
    await annotateAndShoot('B13-corp-finance', {
      'Page header — Finance': page.getByRole('heading', { level: 1, name: /finance/i }).first(),
      'Finance summary — gross / fees / net': PAGE,
    }, { fullPage: true });
  });

  await step('B14 team list', async () => {
    await gotoOperator('/operator/team');
    await annotateAndShoot('B14-corp-team', {
      'Page header — Team + Invite CTA': `${PAGE} .op-page-header`,
      'Team table — name, role, functions, branches, status': PAGE,
      'Invite button — opens StaffInviteModal': page.getByRole('button', { name: /invite|add member/i }).first(),
    }, { fullPage: true });
  });

  await step('B15 team invite modal', async () => {
    await gotoOperator('/operator/team');
    const inviteBtn = page.getByRole('button', { name: /invite|add member/i }).first();
    if (await inviteBtn.count()) {
      await inviteBtn.click().catch(() => {});
      await page.waitForSelector('[role="dialog"]', { state: 'visible' }).catch(() => {});
      await page.waitForTimeout(400);
    }
    await annotateAndShoot('B15-corp-team-invite', {
      'Invite dialog': page.locator('[role="dialog"]').first(),
      'Email field — invitee work email': page.locator('[role="dialog"]').getByLabel(/email/i).first(),
      'Functions checklist — BUS_OPERATIONS / PARCEL_OPERATIONS / BRANCH_ADMIN': page.locator('[role="dialog"]').getByText(/operations|admin|dispatch/i).first(),
      'Branches picker': page.locator('[role="dialog"]').getByText(/branch/i).first(),
    });
    await page.keyboard.press('Escape').catch(() => {});
  });

  await step('B16 buses', async () => {
    await gotoOperator('/operator/vehicles');
    await annotateAndShoot('B16-corp-buses', {
      'Page header — Buses + Add CTA': `${PAGE} .op-page-header`,
      'Buses table — registration, model, capacity, status': PAGE,
    }, { fullPage: true });
  });

  await step('B17 drivers', async () => {
    await gotoOperator('/operator/drivers');
    await annotateAndShoot('B17-corp-drivers', {
      'Page header — Drivers + Add CTA': `${PAGE} .op-page-header`,
      'Drivers table — name, licence, routes, status': PAGE,
    }, { fullPage: true });
  });

  await step('B18 notifications', async () => {
    await gotoOperator('/operator/notifications');
    await annotateAndShoot('B18-corp-notifications', {
      'Page header — Notifications': page.getByRole('heading', { level: 1, name: /notifications/i }).first(),
      'Notification list — unread + read mixed': PAGE,
    }, { fullPage: true });
  });

  // ── Parcel module (corp admin sees everything) ─────────────────────────
  await step('B19 parcel dashboard', async () => {
    await gotoOperator('/operator/parcels');
    await annotateAndShoot('B19-parcel-dashboard', {
      'Page header — Parcels overview': page.getByRole('heading', { level: 1, name: /parcel/i }).first(),
      'KPI strip — pending / in transit / ready / exceptions': `${PAGE} .grid`,
      'Active parcels list — manifest links per trip': PAGE,
    }, { fullPage: true });
  });

  await step('B20 parcel counter step 1', async () => {
    await gotoOperator('/operator/parcels/counter');
    await annotateAndShoot('B20-parcel-counter-step1', {
      'Stepper — 9-step ladder, Route & trip highlighted': `${PAGE} [role="tablist"], ${PAGE} .stepper`,
      'Destination city selector — typeahead': page.getByLabel(/destination|to/i).first(),
      'Live summary sidebar — empty until route picked': PARCEL_BAR,
    }, { fullPage: true });
  });

  await step('B29 parcel mobile scan', async () => {
    await gotoOperator('/operator/scan');
    await annotateAndShoot('B29-parcel-mobile-scan', {
      'Camera viewport — live video feed': page.locator('video, canvas').first(),
      'Manual entry fallback': page.getByRole('button', { name: /keyboard|manual/i }).first(),
    });
  });

  // ── Branch Manager ─────────────────────────────────────────────────────
  await step('B32 branch manager dashboard', async () => {
    await loginStaff('branch-mgr-1@greyhound.co.za', 'BranchMgr1234!');
    await gotoOperator('/operator/overview');
    await annotateAndShoot('B32-bm-dashboard', {
      'Branch manager sidebar — Operations + Parcels + Management': `${SIDEBAR} nav`,
      'Welcome heading': page.getByRole('heading', { level: 1, name: /welcome back/i }).first(),
      'KPI strip — branch-scoped': `${PAGE} .grid`,
    }, { fullPage: true });
  });

  await step('B34 branch manager bookings', async () => {
    await gotoOperator('/operator/bookings');
    await annotateAndShoot('B34-bm-bookings', {
      'Bookings list — branch-scoped': `${PAGE} .op-table`,
      'Walk-in tab — branch managers can create walk-ins': page.locator(`${PAGE} .op-tabs button.op-tab`, { hasText: 'Walk-in' }).first(),
    }, { fullPage: true });
  });

  // ── Booking Clerk ──────────────────────────────────────────────────────
  await step('B36 booking clerk dashboard', async () => {
    await loginStaff('booking-clerk@greyhound.co.za', 'BookingClerk1234!');
    await gotoOperator('/operator/overview');
    await annotateAndShoot('B36-bc-dashboard', {
      'Limited sidebar — Dashboard + Work + Account only': `${SIDEBAR} nav`,
      'Welcome heading': page.getByRole('heading', { level: 1, name: /welcome back/i }).first(),
      'Scan ticket shortcut — BUS_OPERATIONS gate': page.getByRole('link', { name: /scan ticket|open scanner/i }).first(),
    }, { fullPage: true });
  });

  await step('B37 booking clerk walk-in', async () => {
    await gotoOperator('/operator/bookings');
    const walkInTab = page.locator(`${PAGE} .op-tabs button.op-tab`, { hasText: 'Walk-in' });
    if (await walkInTab.count()) {
      await walkInTab.click().catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(500);
    }
    await annotateAndShoot('B37-bc-walkin', {
      'Walk-in tab active': `${PAGE} .op-tabs button.op-tab.active`,
      'Trip picker': page.getByLabel(/trip|departure/i).first(),
      'Passenger details form': page.getByLabel(/passenger name|full name/i).first(),
    }, { fullPage: true });
  });

  // ── Parcel Clerk ───────────────────────────────────────────────────────
  await step('B38 parcel clerk dashboard', async () => {
    await loginStaff('parcel-clerk@greyhound.co.za', 'ParcelClerk1234!');
    await gotoOperator('/operator/overview');
    await annotateAndShoot('B38-pc-dashboard', {
      'Parcel clerk sidebar — Dashboard + Parcels + Account only': `${SIDEBAR} nav`,
      'Field Ops top section — Scan waybill pinned': page.locator(`${SIDEBAR} .op-sidebar-section`).filter({ hasText: /Field Ops/i }).first(),
      'Welcome heading': page.getByRole('heading', { level: 1, name: /welcome back/i }).first(),
    }, { fullPage: true });
  });

  await step('B39 parcel clerk counter', async () => {
    await gotoOperator('/operator/parcels/counter');
    await annotateAndShoot('B39-pc-counter', {
      'Counter wizard — 9-step flow scoped to clerk\'s branch': PAGE,
      'Live summary sidebar': PARCEL_BAR,
      'Stepper': `${PAGE} [role="tablist"], ${PAGE} .stepper`,
    }, { fullPage: true });
  });

  await step('B40 parcel clerk mobile scan', async () => {
    await gotoOperator('/operator/scan');
    await annotateAndShoot('B40-pc-mobile-scan', {
      'Minimal layout — phone-first scan view': 'body',
      'Camera scanner — Quagga primary, jsQR fallback': page.locator('video, canvas').first(),
    });
  });
}
