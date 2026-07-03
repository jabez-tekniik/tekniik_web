// Phase C — Vysa platform admin portal capture targets.
// Run by scripts/captureKnowledgeBase.mjs as a phase module.

export async function run({ page, context, step, annotateAndShoot, activeRoot, WEB, ADMIN }) {

  async function loginAdmin(email, password) {
    await context.clearCookies().catch(() => {});
    await page.evaluate(() => {
      try { localStorage.clear(); sessionStorage.clear(); } catch {}
    }).catch(() => {});
    await page.goto(`${ADMIN}/login`, { waitUntil: 'networkidle' });
    await page.locator('#admin-email').fill(email);
    await page.locator('#admin-password').fill(password);
    await page.locator('main, form').getByRole('button', { name: /^sign in$/i }).first().click();
    await page.waitForURL(/\/admin\/?($|\?|#|dashboard)/, { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(800);
  }

  async function logoutAdmin() {
    await page.evaluate(() => {
      try {
        localStorage.removeItem('vysa_admin_token');
        localStorage.removeItem('vysa_admin_user');
        localStorage.clear();
        sessionStorage.clear();
      } catch {}
    }).catch(() => {});
    await context.clearCookies().catch(() => {});
  }

  await step('C01 admin login + dashboard', async () => {
    await loginAdmin('admin@vysa.co.za', 'Admin1234!');
    await page.goto(`${ADMIN}/`, { waitUntil: 'networkidle' });
    await annotateAndShoot('C01-admin-dashboard', {
      'Sidebar — Vysa Admin sees every section': 'aside nav',
      'Page header — Dashboard / Platform overview': page.getByRole('heading', { name: /^dashboard$/i }).first(),
      'KPI band — platform-wide stats (revenue, bookings, operators, users)': 'main .grid',
    }, { fullPage: true });
  });

  await step('C02 users list', async () => {
    await page.goto(`${ADMIN}/users`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C02-users-list', {
      'Page heading — Users': page.getByRole('heading', { name: /^users$/i }).first(),
      'Filter bar — search + status filters': page.locator('main input[placeholder]').first(),
      'Users table — every traveller + corporate account': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C03 user detail', async () => {
    await page.goto(`${ADMIN}/users`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.locator('main table tbody tr').first().click().catch(() => {});
    await page.waitForURL(/\/admin\/users\/[a-f0-9]{6,}/i, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(600);
    await annotateAndShoot('C03-user-detail', {
      'Hero — name + verification + account type': page.locator('main h1, main h2').first(),
      'Action rail — Act-as / Suspend (Vysa-Admin only)': page.locator('main button, main a').filter({ hasText: /act as|suspend|reactivate/i }).first(),
    }, { fullPage: true });
  });

  await step('C04 operators list', async () => {
    await page.goto(`${ADMIN}/operators`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C04-operators-list', {
      'Page heading — Operators': page.getByRole('heading', { name: /^operators$/i }).first(),
      'Operators table — all bus companies + verification badges': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C05 operator detail', async () => {
    await page.goto(`${ADMIN}/operators`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.locator('main table tbody tr').first().click().catch(() => {});
    await page.waitForURL(/\/admin\/operators\/[a-f0-9]{6,}/i, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(600);
    await annotateAndShoot('C05-operator-detail', {
      'Hero — operator name + verification status': page.locator('main h1, main h2').first(),
      'Tabs — Overview / Routes / Trips / Team / Finance': page.locator('main button, main a').filter({ hasText: /overview|routes|trips|team|finance/i }).first(),
    }, { fullPage: true });
  });

  await step('C06 trips list', async () => {
    await page.goto(`${ADMIN}/trips`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C06-trips-list', {
      'Page heading — Trips': page.getByRole('heading', { name: /^trips$/i }).first(),
      'Trips table — cross-operator schedule view': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C07 routes list', async () => {
    await page.goto(`${ADMIN}/routes`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C07-routes-list', {
      'Page heading — Routes': page.getByRole('heading', { name: /^routes$/i }).first(),
      'Routes table — origin → destination + paired return links': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C08 cities', async () => {
    await page.goto(`${ADMIN}/cities`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C08-cities-list', {
      'Page heading — Cities': page.getByRole('heading', { name: /^cities$/i }).first(),
      'Cities grid — country / cover image / status': page.locator('main table, main .grid').first(),
    }, { fullPage: true });
  });

  await step('C09 finance · payouts', async () => {
    await page.goto(`${ADMIN}/payouts`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C09-finance-payouts', {
      'Page heading — Payouts': page.getByRole('heading', { name: /^payouts$/i }).first(),
      'Payouts table — operator settlements ready to disburse': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C10 finance · settlements', async () => {
    await page.goto(`${ADMIN}/settlements`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C10-finance-settlements', {
      'Page heading — Settlements': page.getByRole('heading', { name: /settlements/i }).first(),
      'Settlements table — weekly cycles per operator': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C11 finance · refunds queue', async () => {
    await page.goto(`${ADMIN}/refunds`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C11-finance-refunds', {
      'Page heading — Refunds': page.getByRole('heading', { name: /^refunds$/i }).first(),
      'Refunds queue — pending / approved / rejected': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C12 finance · currency rates', async () => {
    await page.goto(`${ADMIN}/currency-rates`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C12-finance-currency-rates', {
      'Page heading — Currency Rates': page.getByRole('heading', { name: /currency/i }).first(),
      'Rates table — ZAR vs neighbour currencies': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C13 finance · reports', async () => {
    await page.goto(`${ADMIN}/financial-reports`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C13-finance-reports', {
      'Page heading — Financial Reports': page.getByRole('heading', { name: /financial reports/i }).first(),
      'Date-range + report-type selectors': page.locator('main input').first(),
    }, { fullPage: true });
  });

  await step('C14 promo codes', async () => {
    await page.goto(`${ADMIN}/promo-codes`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C14-promo-codes', {
      'Page heading — Promo Codes': page.getByRole('heading', { name: /promo codes/i }).first(),
      'Promo codes table — code / discount / window / usage': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C15 reviews moderation', async () => {
    await page.goto(`${ADMIN}/reviews`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C15-reviews-list', {
      'Page heading — Reviews': page.getByRole('heading', { name: /^reviews$/i }).first(),
      'Reviews table — rating / operator / approve-reject actions': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C16 content · pages', async () => {
    await page.goto(`${ADMIN}/content`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C16-content-pages', {
      'Page heading — Content Management': page.getByRole('heading', { name: /content management/i }).first(),
      'Page list / blocks editor': page.locator('main section, main .space-y-6').first(),
    }, { fullPage: true });
  });

  await step('C17 content · FAQs', async () => {
    await page.goto(`${ADMIN}/faqs`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C17-content-faqs', {
      'Page heading — FAQs': page.getByRole('heading', { name: /^faqs$/i }).first(),
      'FAQs table — question / category / status': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C18 content · border requirements', async () => {
    await page.goto(`${ADMIN}/border-info`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C18-content-border-info', {
      'Page heading — Border Info': page.getByRole('heading', { name: /border info/i }).first(),
      'Border requirements table — country / docs / fees': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C19 communications · broadcast composer', async () => {
    await page.goto(`${ADMIN}/broadcast`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C19-communications-broadcast', {
      'Page heading — Broadcast Message': page.getByRole('heading', { name: /broadcast/i }).first(),
      'Audience picker + message body': page.locator('main form, main .space-y-6').first(),
    }, { fullPage: true });
  });

  await step('C20 communications · log', async () => {
    await page.goto(`${ADMIN}/communications-log`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C20-communications-log', {
      'Page heading — Communications Log': page.getByRole('heading', { name: /communications log/i }).first(),
      'Log table — channel / template / status / sent-at': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C21 email templates list', async () => {
    await page.goto(`${ADMIN}/email-templates`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C21-email-templates-list', {
      'Page heading — Email Templates': page.getByRole('heading', { name: /email templates/i }).first(),
      'Templates table — bucket / id / subject / overridden flag': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C22 email template editor', async () => {
    await page.goto(`${ADMIN}/email-templates`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.locator('main table tbody tr').first().click().catch(() => {});
    await page.waitForURL(/\/admin\/email-templates\/[a-z0-9-]+/i, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(700);
    await annotateAndShoot('C22-email-template-editor', {
      'Template subject + variables panel': page.locator('main h1, main h2').first(),
      'Quill visual editor + Code tab': page.locator('main .ql-editor, main [contenteditable]').first(),
    }, { fullPage: true });
  });

  await step('C23 sms logs', async () => {
    await page.goto(`${ADMIN}/sms-logs`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C23-sms-logs', {
      'Page heading — SMS Logs': page.locator('main h1').first(),
      'Logs table — to / template / status (mocked in Phase 7)': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C24 support · tickets list', async () => {
    await page.goto(`${ADMIN}/service-desk`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C24-support-tickets-list', {
      'Page heading — Service Desk': page.locator('main h1').first(),
      'Tickets table — subject / requester / priority / status': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C25 support · ticket detail', async () => {
    await page.goto(`${ADMIN}/service-desk`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.locator('main table tbody tr').first().click().catch(() => {});
    await page.waitForURL(/\/admin\/service-desk\/[a-f0-9]{6,}/i, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(600);
    await annotateAndShoot('C25-support-ticket-detail', {
      'Ticket subject + status badge': page.locator('main h1, main h2').first(),
      'Conversation thread + reply box': page.locator('main section').first(),
    }, { fullPage: true });
  });

  await step('C26 support · contact enquiries', async () => {
    await page.goto(`${ADMIN}/contact-enquiries`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C26-contact-enquiries', {
      'Page heading — Contact Enquiries': page.getByRole('heading', { name: /contact enquiries/i }).first(),
      'Enquiries table — name / topic / received / status': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C27 settings · sub-admins', async () => {
    await page.goto(`${ADMIN}/settings`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: /sub[-\s]?admins/i }).first().click().catch(() => {});
    await page.waitForTimeout(500);
    await annotateAndShoot('C27-settings-sub-admins', {
      'Page heading — Settings': page.getByRole('heading', { name: /^settings$/i }).first(),
      'Sub-admins table — invite + role + status': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C28 settings · roles & permissions', async () => {
    await page.goto(`${ADMIN}/settings/roles`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C28-settings-roles', {
      'Page heading — Roles': page.locator('main h1').first(),
      'Roles table — system + custom roles, permission counts': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C29 settings · activity log', async () => {
    await page.goto(`${ADMIN}/activity`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C29-settings-activity-log', {
      'Page heading — Activity Log': page.locator('main h1').first(),
      'Activity table — admin / action / target / timestamp': page.locator('main table').first(),
    }, { fullPage: true });
  });

  await step('C30 settings · system', async () => {
    await page.goto(`${ADMIN}/settings/system`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await annotateAndShoot('C30-settings-system', {
      'Page heading — System': page.getByRole('heading', { name: /^system$/i }).first(),
      'System summary — versions, env, DB counts, seeded flag': page.locator('main .space-y-6, main section').first(),
    }, { fullPage: true });
  });

  // Sub-admin sidebar variations (each has a permission-filtered sidebar)
  const subAdmins = [
    { id: 'C31', email: 'finance.sub@vysa.co.za',   pw: 'Finance1234!',   key: 'finance',   label: 'Finance role: payouts / settlements / refunds / rates / reports' },
    { id: 'C32', email: 'passenger.sub@vysa.co.za', pw: 'Passenger1234!', key: 'support',   label: 'Customer Support role: users / bookings / service desk / enquiries' },
    { id: 'C33', email: 'reports.sub@vysa.co.za',   pw: 'Reports1234!',   key: 'reports',   label: 'Reports role: reports hub + analytics views' },
    { id: 'C34', email: 'ops.sub@vysa.co.za',       pw: 'Ops1234!',       key: 'operations',label: 'Operations role: operators / routes / trips / cities / parcels' },
  ];
  for (const sa of subAdmins) {
    await step(`${sa.id} sub-admin · ${sa.key} sidebar`, async () => {
      await logoutAdmin();
      await loginAdmin(sa.email, sa.pw);
      await page.goto(`${ADMIN}/`, { waitUntil: 'networkidle' });
      await annotateAndShoot(`${sa.id}-subadmin-${sa.key}-sidebar`, {
        [`Sidebar — ${sa.label}`]: 'aside nav',
        'Header — signed in as sub-admin': 'header',
      }, { fullPage: true });
    });
  }

  await logoutAdmin();
}
