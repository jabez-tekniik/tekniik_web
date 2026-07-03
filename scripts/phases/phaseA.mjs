// Phase A — Customer journey capture targets.
// Run by scripts/captureKnowledgeBase.mjs as a phase module.

export async function run({ page, step, annotateAndShoot, activeRoot, WEB }) {

  async function dismissCookieBanner() {
    try {
      const accept = page.locator('button', { hasText: /accept|got it|ok/i }).first();
      if (await accept.isVisible({ timeout: 500 })) await accept.click();
    } catch {}
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

  async function loginTraveller() {
    await page.goto(WEB, { waitUntil: 'networkidle' });
    await dismissCookieBanner();
    await openTravellerAuthModal();
    await page.waitForTimeout(400);
    await page.locator('#auth-email').fill('lerato.mokoena@gmail.com');
    await page.getByRole('button', { name: /continue/i }).first().click();
    await page.waitForTimeout(800);
    await page.locator('#auth-password').fill('Demo1234!');
    await activeRoot().getByRole('button', { name: /^sign in$/i }).first().click().catch(async () => {
      await page.locator('button[type="submit"]').first().click();
    });
    await page.waitForTimeout(1500);
    await page.keyboard.press('Escape').catch(() => {});
  }

  // ───── A23 homepage hero (public) ─────────────────────────────────────
  await step('A23 homepage hero + search', async () => {
    await page.goto(WEB, { waitUntil: 'networkidle' });
    await dismissCookieBanner();
    await page.waitForTimeout(600);
    await annotateAndShoot('A23-home-hero', {
      'Hero tagline — top-of-funnel value statement': page.locator('.home-search-tagline').first(),
      'Trust strip — operator count, ratings, refund line': page.locator('.home-hero-trustbar').first(),
      'Search card — origin, destination, date, passengers': page.locator('.home-search-card, form').filter({ has: page.locator('input') }).first(),
      'Marquee strip — live offers + popular routes': page.locator('.hero-marquee-strip').first(),
    });
  });

  await step('A24 home footer + secondary nav', async () => {
    await page.goto(WEB, { waitUntil: 'networkidle' });
    await dismissCookieBanner();
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await annotateAndShoot('A24-home-footer', {
      'Trust strip — refund / support / secure-pay reassurance': page.locator('.footer-trust-strip').first(),
      'Footer nav — sitemap & legal links': page.locator('footer.footer').first(),
    });
  });

  await step('A01 search results', async () => {
    const date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    await page.goto(`${WEB}/app/results?date=${date}&passengers=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    await annotateAndShoot('A01-search-results', {
      'Top search bar — edit origin, destination, date inline': page.locator('header, .home-search-card, form').first(),
      'Sort + filter row — Cheapest / Fastest / Earliest / Best rated': page.getByRole('button', { name: /cheapest|fastest|earliest|best rated|filter/i }).first(),
      'Results list — one card per trip with price + duration': page.locator('main').first(),
    }, { fullPage: true });
  });

  await step('A02 trip detail with seat map', async () => {
    const date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    await page.goto(`${WEB}/app/results?date=${date}&passengers=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const firstTripLink = page.locator('a[href*="/trip/"], a[href*="/app/trip/"]').first();
    if (!(await firstTripLink.count())) {
      console.log('  ⚠ A02 SKIP — no trips returned for seeded route/date');
      return;
    }
    await firstTripLink.click();
    await page.waitForTimeout(1500);
    await annotateAndShoot('A02-trip-detail-seatmap', {
      'Wizard progress — Seats / Details / Pay / Confirm': page.locator('.wiz-progress-bar').first(),
      'Seat legend — available, selected, booked colour key': page.locator('.seat-legend').first(),
      'Seat map grid — click a seat to hold for 15 minutes': page.locator('.seat-map-grid').first(),
      'Boarding & alighting selector — pick on/off stops': page.locator('.stop-selector-section').first(),
      'Route timeline — every stop with departure time': page.locator('.route-timeline').first(),
    }, { fullPage: true });
  });

  await step('A03 wizard step 2 passenger details', async () => {
    const seat = page.locator('.seat-btn').filter({ hasNotText: /booked/i }).first();
    if (await seat.count()) {
      await seat.click().catch(() => {});
      await page.waitForTimeout(300);
    }
    const next = page.getByRole('button', { name: /continue|next|details/i }).first();
    if (await next.count()) {
      await next.click().catch(() => {});
      await page.waitForTimeout(900);
    }
    await annotateAndShoot('A03-checkout-passenger-details', {
      'Wizard progress — now on step 2 of 4': page.locator('.wiz-progress-bar').first(),
      'Saved travellers row — one-tap fill from address book': page.locator('.saved-travellers-row').first(),
      'Passenger card — name, ID, phone per seat': page.locator('.passenger-inline-card').first(),
      'Continue to payment — locks details and goes to step 3': page.getByRole('button', { name: /continue|payment|next/i }).first(),
    }, { fullPage: true });
  });

  await step('A05 payment success', async () => {
    await page.goto(`${WEB}/pay/success?ref=VYS-DEMO-0001&amount=45000&bookingId=demo`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await annotateAndShoot('A05-payment-success', {
      'Success heading — Payment confirmed': page.getByRole('heading', { level: 1 }).first(),
      'Booking reference card — VYS code shown to passenger': page.locator('dt', { hasText: /booking reference/i }).locator('..').first(),
      'Amount paid card — final total in ZAR': page.locator('dt', { hasText: /amount paid/i }).locator('..').first(),
      'View ticket button — primary CTA to e-ticket': page.getByRole('link', { name: /view ticket|my ticket|ticket/i }).first(),
    }, { fullPage: true });
  });

  await step('A06 payment failure', async () => {
    await page.goto(`${WEB}/pay/failed?ref=VYS-DEMO-0001&reason=card_declined`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await annotateAndShoot('A06-payment-failed', {
      'Failure heading — payment did not complete': page.getByRole('heading', { level: 1 }).first(),
      'Seats-still-held pill — 15-min retry window': page.locator('.bg-amber-50, [class*="amber"]').first(),
      'Try again — returns to checkout with draft intact': page.getByRole('button', { name: /try again|retry/i }).first(),
    }, { fullPage: true });
  });

  await step('A07 public ticket lookup', async () => {
    await page.goto(`${WEB}/ticket/VYS-DEMO-LOOKUP`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await annotateAndShoot('A07-public-ticket-lookup', {
      'Ticket lookup heading': page.getByRole('heading').first(),
      'Email field — verifies the requester owns this ticket': page.locator('input[type="email"]').first(),
      'View ticket button — pulls boarding pass + QR': page.getByRole('button', { name: /view|find|lookup/i }).first(),
    }, { fullPage: true });
  });

  // Login required for the rest
  await step('LOGIN traveller for protected captures', async () => {
    await loginTraveller();
  });

  await step('A08 my trips list', async () => {
    await page.goto(`${WEB}/account/bookings`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    await annotateAndShoot('A08-my-trips-list', {
      'Page title — My Bookings': page.locator('.account-page-title').first(),
      'Status tabs — upcoming, past, cancelled': page.locator('.account-tabs').first(),
      'Booking card — route, date, status pill, price': page.locator('.account-booking-card').first(),
      'Sidebar nav — jump to other account areas': page.locator('aside.account-sidebar nav').first(),
    }, { fullPage: true });
  });

  await step('A09 booking detail signed-in', async () => {
    const firstBooking = page.locator('.account-booking-card a, .account-booking-link').first();
    if (!(await firstBooking.count())) {
      console.log('  ⚠ A09 SKIP — no bookings on lerato.mokoena seed');
      return;
    }
    await firstBooking.click();
    await page.waitForTimeout(1100);
    await annotateAndShoot('A09-booking-detail', {
      'Booking summary — route, time, status': page.locator('h1, .account-page-title').first(),
      'Boarding pass / ticket card — QR + seat numbers': page.locator('.account-detail-card').first(),
      'Actions card — cancel, rebook, contact support': page.locator('.account-detail-card', { hasText: /actions/i }).first(),
      'Cancel booking button — opens confirmation modal': page.getByRole('button', { name: /cancel booking/i }).first(),
    }, { fullPage: true });
  });

  await step('A10 cancel booking modal', async () => {
    const cancelBtn = page.getByRole('button', { name: /cancel booking/i }).first();
    if (!(await cancelBtn.count())) {
      console.log('  ⚠ A10 SKIP — no cancellable booking visible');
      return;
    }
    await cancelBtn.click();
    await page.waitForTimeout(500);
    await annotateAndShoot('A10-cancel-booking-modal', {
      'Confirmation dialog — explains refund amount + tier': page.locator('[role="dialog"], .account-cancel-modal').first(),
      'Refund preview — % refunded based on flexibility tier': page.locator('.account-cancel-modal').first(),
      'Confirm cancel button — irreversible action': page.locator('[role="dialog"]').getByRole('button', { name: /confirm|cancel booking|yes/i }).first(),
      'Keep booking — closes the modal without action': page.locator('[role="dialog"]').getByRole('button', { name: /keep|nevermind|close/i }).first(),
    });
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(300);
  });

  await step('A11 my travellers list', async () => {
    await page.goto(`${WEB}/account/travellers`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await annotateAndShoot('A11-travellers-list', {
      'Page title — Saved Travellers': page.locator('.account-page-title').first(),
      'Add traveller button — opens add/edit form modal': page.getByRole('button', { name: /add traveller|add new|^add$/i }).first(),
      'Traveller card — name, ID, default flag': page.locator('.account-traveller-card').first(),
      'Edit / delete actions — per-card controls': page.locator('.traveller-icon-actions').first(),
    }, { fullPage: true });
  });

  await step('A12 traveller add modal', async () => {
    const addBtn = page.getByRole('button', { name: /add traveller|add new|^add$/i }).first();
    if (!(await addBtn.count())) {
      console.log('  ⚠ A12 SKIP — Add button not found');
      return;
    }
    await addBtn.click();
    await page.waitForTimeout(500);
    await annotateAndShoot('A12-traveller-add-edit', {
      'Add traveller dialog': page.locator('[role="dialog"]').first(),
      'Vault auto-fill picker — pull from Travel Vault': page.locator('.vault-picker').first(),
      'Save button — adds to address book': page.locator('[role="dialog"]').getByRole('button', { name: /save|add/i }).first(),
    });
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(300);
  });

  await step('A13 payment methods list', async () => {
    await page.goto(`${WEB}/account/payment-methods`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await annotateAndShoot('A13-payment-methods', {
      'Page title — Payment Methods': page.locator('.pm-page-title').first(),
      'Add card button — opens add-card modal': page.getByRole('button', { name: /^add card$|add your first card|^add$/i }).first(),
      'Saved card visual — gradient + masked PAN + expiry': page.locator('.pm-card-item, .pm-empty-state').first(),
      'Security notice — encryption disclosure': page.locator('.pm-security-notice').first(),
    }, { fullPage: true });
  });

  await step('A14 payment methods add card', async () => {
    const addBtn = page.getByRole('button', { name: /^add card$|add your first card/i }).first();
    if (!(await addBtn.count())) {
      console.log('  ⚠ A14 SKIP — Add card button not found');
      return;
    }
    await addBtn.click();
    await page.waitForTimeout(500);
    await annotateAndShoot('A14-payment-methods-add', {
      'Add card dialog title': page.locator('[role="dialog"]').first(),
      'Live card preview — updates as you type': page.locator('.pm-preview-card').first(),
      'Save card button — tokenises via Paystack': page.locator('[role="dialog"]').getByRole('button', { name: /save card/i }).first(),
    });
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(300);
  });

  await step('A15 notification preferences', async () => {
    await page.goto(`${WEB}/account/notification-settings`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await annotateAndShoot('A15-notification-preferences', {
      'Page title — Email notifications': page.locator('.account-page-title').first(),
      'Optional emails card — per-channel toggles': page.locator('.account-preferences-card').first(),
      'Toggle row — booking reminders / reviews / marketing': page.locator('.account-toggle-item').first(),
      'Always-sent card — locked transactional emails': page.locator('.account-preferences-card').nth(1),
    }, { fullPage: true });
  });

  await step('A16 account profile', async () => {
    await page.goto(`${WEB}/account/profile`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await annotateAndShoot('A16-account-profile', {
      'Page title — My Profile': page.locator('.account-page-title').first(),
      'Profile-completeness banner — fill these to unlock features': page.locator('.account-completeness-banner').first(),
      'Profile card — avatar, name, email, member since': page.locator('.account-profile-card').first(),
      'Edit button — switches the form to editable mode': page.getByRole('button', { name: /^edit$/i }).first(),
    }, { fullPage: true });
  });

  await step('A17 help faq index', async () => {
    await page.goto(`${WEB}/help`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await annotateAndShoot('A17-help-index', {
      'Hero title — How can we help you?': page.locator('.help-hero-title').first(),
      'FAQ search — type to filter questions': page.locator('.help-faq-search input').first(),
      'Category chips — narrow by topic': page.locator('.help-cat-chip').first(),
      'FAQ item — click to expand the answer': page.locator('.help-faq-item').first(),
    }, { fullPage: true });
  });

  await step('A18 help faq expanded', async () => {
    const firstFaq = page.locator('.help-faq-question').first();
    if (await firstFaq.count()) {
      await firstFaq.click().catch(() => {});
      await page.waitForTimeout(400);
    }
    await annotateAndShoot('A18-help-article', {
      'Expanded FAQ — answer body inline under the question': page.locator('.help-faq-item.faq-open .help-faq-answer').first(),
      'Question header — click to collapse': page.locator('.help-faq-item.faq-open .help-faq-question').first(),
    }, { fullPage: true });
  });

  await step('A19 parcel landing', async () => {
    await page.goto(`${WEB}/parcel`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await annotateAndShoot('A19-parcel-landing', {
      'Parcel hero title — Bus parcels move where people ride': page.locator('.pl-h1').first(),
      'Primary CTA — get an estimate': page.locator('.pl-cta-primary').first(),
      'Secondary CTA — track an existing parcel': page.locator('.pl-cta-secondary').first(),
      'Trust strip — coverage, ETA, support stats': page.locator('.pl-trust-list').first(),
    }, { fullPage: true });
  });

  await step('A20 parcel estimate form', async () => {
    await page.goto(`${WEB}/parcel/estimate`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await annotateAndShoot('A20-parcel-estimate-form', {
      'Form title — Estimate parcel price': page.locator('.estimate-card-title').first(),
      'Goods type select — what is in the parcel': page.locator('.estimate-form .estimate-row-2').first(),
      'Dimensions fieldset — length / width / height in cm': page.locator('.estimate-dims').first(),
      'Estimate button — calculates billed weight + price band': page.getByRole('button', { name: /estimate|calculate/i }).first(),
    }, { fullPage: true });
  });

  await step('A21 parcel tracking lookup', async () => {
    await page.goto(`${WEB}/parcel/track`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await annotateAndShoot('A21-parcel-tracking-lookup', {
      'Lookup card title — Track your parcel': page.locator('.lookup-card-title').first(),
      'Tracking ID input — starts with PCL-': page.locator('.lookup-input').first(),
      'Track button — opens the live timeline': page.locator('.lookup-submit').first(),
      'How it works — step-by-step explainer': page.locator('.lookup-steps').first(),
    }, { fullPage: true });
  });

  await step('A22 parcel tracking detail', async () => {
    const seededTrackingId = process.env.PHASE_A_TRACKING_ID || 'PCL-DEMO-0001';
    await page.goto(`${WEB}/parcel/track/${seededTrackingId}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    const journey = page.locator('.tracking-journey');
    if (await journey.count()) {
      await annotateAndShoot('A22-parcel-tracking-timeline', {
        'Journey timeline — Booked → Shipped → In transit → Arrived → Picked up': page.locator('.tracking-journey').first(),
        'Status banner — pickup ready / overdue / issue': page.locator('.tracking-banner').first(),
        'Copy + share row — sender shares status with recipient': page.locator('.tracking-footer-actions').first(),
      }, { fullPage: true });
    } else {
      await annotateAndShoot('A22-parcel-tracking-not-found', {
        'Not-found heading — invalid or unknown tracking id': page.locator('.tracking-notfound-title, h1').first(),
      }, { fullPage: true });
    }
  });

  await step('A25 travel document vault', async () => {
    await page.goto(`${WEB}/account/vault`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await annotateAndShoot('A25-travel-vault', {
      'Vault page title — passport, visa, ID storage': page.locator('.account-page-title, h1').first(),
      'Add document button — opens VaultDocModal': page.getByRole('button', { name: /add.*document|add.*vault|^add$/i }).first(),
    }, { fullPage: true });
  });
}
