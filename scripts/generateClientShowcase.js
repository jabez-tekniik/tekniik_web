#!/usr/bin/env node
/**
 * generateClientShowcase.js
 * ─────────────────────────
 * Renders all Vysa email templates and builds a self-contained HTML showcase
 * file for client delivery.  No server required to view the output.
 *
 * Usage:  node scripts/generateClientShowcase.js
 * Output: docs/vysa-email-showcase.html
 */

import path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');

// ── Set env BEFORE importing the email module so helpers.js picks it up ────
process.env.ICON_BASE_URL   = 'https://vysa.co.za/static/icons';
process.env.NODE_ENV        = 'production';
// Stub the only env key the email module needs that might be missing
process.env.JWT_ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET  || 'stub';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'stub';

// Dynamically import AFTER env is set (use file:// URL for Windows ESM compat)
const emailIndexUrl = pathToFileURL(path.join(ROOT, 'vysa_node/src/emails/index.js')).href;
const { renderByKey, TEMPLATES } = await import(emailIndexUrl);

// ── Sample data (mirrors previewServer.js) ──────────────────────────────────
const SAMPLE = {
  preheader: 'Sam, your booking is confirmed — Johannesburg to Cape Town on 1 May 2026. Ref: VYS123456',
  firstName: 'Sam',
  bookingRef: 'VYS123456',
  trip: {
    origin: 'Johannesburg',
    destination: 'Cape Town',
    operatorName: 'Intercape',
    departureAt: new Date(2026, 4, 1, 8, 0),
    arrivalAt: new Date(2026, 4, 1, 22, 30),
    boardingStop: 'Park Station, Bay 14',
    alightingStop: 'Cape Town Station',
    duration: '14h 30m',
  },
  passengerCount: 2,
  luggageAllowance: '2 × 23 kg',
  passengers: [
    { name: 'Sam Mokoena', seat: 'A12' },
    { name: 'Lerato Mokoena', seat: 'A13' },
  ],
  paymentLineItems: [
    { label: 'Base fare',            value: 760 },
    { label: 'Service fee',          value: 60.8 },
    { label: 'Excess luggage',       value: 80 },
    { label: 'Promo (AUTUMN10)',     value: 76, isDiscount: true },
  ],
  paymentTotal:     { label: 'Total paid', value: 824.8 },
  totalZAR:          824.8,
  ticketUrl:        'https://vysa.co.za/bookings/VYS123456/ticket',
  manageUrl:        'https://vysa.co.za/bookings/VYS123456',
  shareUrl:         'https://wa.me/?text=My%20Vysa%20ticket',
  otp:               '123456',
  expiryMinutes:     10,
  operatorName:     'Intercape',
  inviteeName:      'Sam',
  inviteUrl:        'https://vysa.co.za/invite',
  role:             'OPERATIONS',
  parcelRef:        'PCL-12345',
  origin:           'Johannesburg',
  destination:      'Cape Town',
  collectionPoint:  'Cape Town Depot',
  collectionDeadline: new Date(2026, 4, 5, 17, 0),
  refundZAR:         450,
  amountZAR:         599.99,
  method:           'Visa card',
  retryUrl:         'https://vysa.co.za/pay',
  reviewUrl:        'https://vysa.co.za/review',
  submittedAt:       new Date(2026, 3, 1, 10, 0),
  subject:          'Help with my booking',
  name:             'Sam Mokoena',
  email:            'sam@test.co.za',
  message:          'Hello team, I need assistance with booking VYS123456.',
  date:             '2026-04-13',
  metrics:          { bookings: 10, revenue: 'R 10 000', new_users: 24 },
  reason:           'Missing required documents',
  period:           'April 2026',
  summary:          'Nothing to escalate.',
  changes:          'Promo management access granted',
  link:             'https://vysa.co.za/dashboard',
  userName:         'Sam Traveller',
  ticketId:         'TCK-00123',
  cancelledAt:       new Date(2026, 3, 14, 18, 42),
  cancellationReason: 'Customer requested — change of plans',
  flexibilityTier:  'Flexi',
  refundAmountZAR:   659.84,
  cancellationFeeZAR: 165.00,
  refundETADays:     5,
  refundTimeline: [
    { label: 'Cancellation received', time: '14 Apr 2026 · 18:42', done: true  },
    { label: 'Refund processing',     time: '15 Apr 2026 · est.',  done: true  },
    { label: 'Funds returned',        time: '19 Apr 2026 · est.',  done: false },
  ],
  rebookUrl: 'https://vysa.co.za/search?from=Johannesburg&to=Cape%20Town',
  suggestedTrips: [
    { operator: 'Intercape',    date: '3 May 2026', departAt: '08:00', arriveAt: '22:30', priceZAR: 780 },
    { operator: 'Greyhound',    date: '4 May 2026', departAt: '07:30', arriveAt: '21:50', priceZAR: 795 },
    { operator: 'Eldo Coaches', date: '5 May 2026', departAt: '09:15', arriveAt: '23:45', priceZAR: 740 },
  ],
};

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id:    'customer',
    label: 'Customer',
    color: '#6763DB',
    icon:  '👤',
    desc:  'Emails sent to passengers and travellers',
  },
  {
    id:    'operator',
    label: 'Operator',
    color: '#0891B2',
    icon:  '🚌',
    desc:  'Emails sent to bus operators and their team',
  },
  {
    id:    'admin',
    label: 'Admin',
    color: '#7C3AED',
    icon:  '🛡',
    desc:  'Internal notifications for Vysa platform admins',
  },
  {
    id:    'subadmin',
    label: 'Sub-Admin',
    color: '#9333EA',
    icon:  '🔑',
    desc:  'Emails for invited sub-admin accounts',
  },
];

// Human-readable template names
const TEMPLATE_LABELS = {
  'customer.otp':                   'OTP Verification',
  'customer.welcome':               'Welcome',
  'customer.password-reset':        'Password Reset',
  'customer.password-reset-success':'Password Reset Success',
  'customer.booking.confirmed':     'Booking Confirmed',
  'customer.booking.cancelled':     'Booking Cancelled',
  'customer.payment.success':       'Payment Success',
  'customer.payment.failed':        'Payment Failed',
  'customer.refund.issued':         'Refund Issued',
  'customer.review.request':        'Review Request',
  'customer.parcel.booked':         'Parcel Booked',
  'customer.parcel.arrived':        'Parcel Arrived',
  'customer.trip.cancelled':        'Trip Cancelled',
  'operator.new-booking':           'New Booking',
  'operator.payout-ready':          'Payout Ready',
  'operator.settlement-report':     'Settlement Report',
  'operator.team-invite':           'Team Invite',
  'operator.suspension-notice':     'Suspension Notice',
  'operator.verification.approved': 'Verification Approved',
  'operator.verification.rejected': 'Verification Rejected',
  'operator.otp':                   'OTP Verification',
  'admin.new-operator-application': 'New Operator Application',
  'admin.support-ticket-new':       'New Support Ticket',
  'admin.contact-enquiry':          'Contact Enquiry',
  'admin.daily-report':             'Daily Report',
  'admin.refund-request':           'Refund Request',
  'subadmin.role-invite':           'Role Invite',
  'subadmin.permission-change':     'Permission Change',
  'subadmin.escalation':            'Escalation Alert',
};

// ── Render all templates ─────────────────────────────────────────────────────
console.log('Rendering templates…');
const rendered = {};
for (const [key, def] of Object.entries(TEMPLATES)) {
  try {
    const { html, subject } = await renderByKey(key, SAMPLE);
    rendered[key] = { html, subject, audience: def.audience, trigger: def.trigger };
    process.stdout.write(`  ✓  ${key}\n`);
  } catch (err) {
    process.stderr.write(`  ✗  ${key}: ${err.message}\n`);
    rendered[key] = {
      html: `<html><body style="font-family:sans-serif;padding:40px;color:#555;">
        <p>Preview unavailable: ${err.message}</p></body></html>`,
      subject: key,
      audience: def.audience,
      trigger: def.trigger,
    };
  }
}

// ── PDF documents config ─────────────────────────────────────────────────────
const DOCS = [
  {
    id:    'booking-invoice',
    title: 'Booking Invoice',
    desc:  'Passenger-facing PDF invoice issued for every confirmed booking. Includes trip details, fare breakdown, and booking reference.',
    path:  'reference_docs/Vysa-Booking-Invoice-v2.pdf',
    tag:   'Customer · Finance',
  },
  {
    id:    'settlement-invoice',
    title: 'Settlement Invoice',
    desc:  'Operator settlement invoice detailing platform payouts, fee deductions, and net amounts per settlement cycle.',
    path:  'reference_docs/Vysa-Settlement-Invoice-v2.pdf',
    tag:   'Operator · Finance',
  },
  {
    id:    'passenger-manifest',
    title: 'Passenger Manifest',
    desc:  'Trip-level manifest listing all confirmed passengers, seat numbers, contact details, and boarding status for operators.',
    path:  'reference_docs/Vysa-Passenger-Manifest-v2.pdf',
    tag:   'Operator · Operations',
  },
];

// ── Build template sidebar items + stored HTML ───────────────────────────────
function categoryTemplates(catId) {
  return Object.entries(rendered)
    .filter(([, v]) => v.audience === catId)
    .map(([key, v]) => ({
      key,
      label: TEMPLATE_LABELS[key] || key,
      subject: v.subject,
      trigger: v.trigger,
      html: v.html,
    }));
}

// Escape for embedding in JS string (used in srcdoc)
function jsStr(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');
}

// Build JS map: templateKey → rendered HTML
const tplDataLines = Object.entries(rendered)
  .map(([k, v]) => `  ${JSON.stringify(k)}: \`${jsStr(v.html)}\``)
  .join(',\n');

// Build sidebar HTML for each category
function buildSidebarItems(catId) {
  return categoryTemplates(catId)
    .map(({ key, label, subject }) => `
        <div class="tpl-item" data-key="${key}" onclick="selectTemplate(this,'${key}')">
          <div class="tpl-label">${label}</div>
          <div class="tpl-subject">${subject}</div>
        </div>`)
    .join('');
}

// Build tab buttons
function buildTabs() {
  const catTabs = CATEGORIES.map((c, i) => {
    const count = categoryTemplates(c.id).length;
    return `<button class="tab${i === 0 ? ' active' : ''}" data-cat="${c.id}" onclick="selectCategory(this,'${c.id}')">
      ${c.label} <span class="count">${count}</span>
    </button>`;
  }).join('\n    ');

  return `${catTabs}
    <button class="tab" data-cat="docs" onclick="selectCategory(this,'docs')">
      Documents <span class="count">${DOCS.length}</span>
    </button>`;
}

// Build sidebar sections HTML
function buildAllSidebarSections() {
  const catSections = CATEGORIES.map((c, i) => `
    <div class="sidebar-section${i === 0 ? ' active' : ''}" data-cat="${c.id}">
      <div class="cat-header">
        <span class="cat-label">${c.label}</span>
        <span class="cat-count">${categoryTemplates(c.id).length} templates</span>
      </div>
      <div class="cat-desc">${c.desc}</div>
      ${buildSidebarItems(c.id)}
    </div>`).join('');

  const docSection = `
    <div class="sidebar-section" data-cat="docs">
      <div class="cat-header">
        <span class="cat-label">Documents</span>
        <span class="cat-count">${DOCS.length} PDFs</span>
      </div>
      <div class="cat-desc">Generated PDF documents for customers and operators</div>
      ${DOCS.map(d => `
        <div class="tpl-item" data-doc="${d.id}" onclick="selectDoc(this,'${d.id}')">
          <div class="tpl-label">${d.title}</div>
          <div class="tpl-subject">${d.tag}</div>
        </div>`).join('')}
    </div>`;

  return catSections + docSection;
}

// Initial template to show on load
const firstKey = Object.keys(rendered)[0];

// ── Build PDF viewers section HTML ──────────────────────────────────────────
const docViewers = DOCS.map(d => `
  <div class="doc-panel" data-doc="${d.id}">
    <div class="doc-info">
      <h2 class="doc-title">${d.title}</h2>
      <p class="doc-desc">${d.desc}</p>
      <span class="doc-tag">${d.tag}</span>
      <div class="doc-actions">
        <a class="doc-btn" href="${d.path}" target="_blank" download>Download PDF</a>
        <a class="doc-btn doc-btn-outline" href="${d.path}" target="_blank">Open in new tab</a>
      </div>
    </div>
    <div class="pdf-embed-wrap">
      <embed class="pdf-embed" src="${d.path}" type="application/pdf" />
      <div class="pdf-fallback">
        <p>Your browser cannot embed this PDF.</p>
        <a href="${d.path}" target="_blank">Open PDF →</a>
      </div>
    </div>
  </div>`).join('');

// ── Assemble the showcase HTML ───────────────────────────────────────────────
const totalCount = Object.keys(rendered).length;
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vysa — Email Templates &amp; Documents</title>
<style>
/* ── Reset ─────────────────────────────────────── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;overflow:hidden;}

/* ── Tokens ─────────────────────────────────────── */
:root{
  --purple:#6763DB;
  --purple-dark:#3A2D8F;
  --purple-deeper:#1E1C50;
  --bg:#F4F3FB;
  --sidebar-bg:#FFFFFF;
  --sidebar-w:280px;
  --header-h:56px;
  --text:#0F0E2E;
  --muted:#6B6B85;
  --border:#E5E4F0;
  --radius:10px;
  --shadow:0 1px 4px rgba(15,14,46,.08);
}

/* ── Layout ─────────────────────────────────────── */
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
     background:var(--bg);color:var(--text);}

.app{display:grid;
     grid-template-rows:var(--header-h) 1fr;
     grid-template-columns:var(--sidebar-w) 1fr;
     height:100vh;}

/* ── Header ─────────────────────────────────────── */
.header{
  grid-column:1/-1;
  background:linear-gradient(135deg,var(--purple-deeper) 0%,var(--purple-dark) 50%,var(--purple) 100%);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 20px;
  box-shadow:0 1px 0 rgba(0,0,0,.18);
}
.header-left{display:flex;align-items:center;gap:12px;}
.logo{
  font-size:18px;font-weight:800;color:#fff;letter-spacing:-.03em;
  line-height:1;
}
.logo-dot{color:rgba(255,255,255,.5);}
.header-title{
  font-size:12px;font-weight:500;color:rgba(255,255,255,.65);
  letter-spacing:.06em;text-transform:uppercase;
}
.header-right{display:flex;align-items:center;gap:8px;}

/* view toggle */
.view-toggle{
  display:flex;align-items:center;background:rgba(255,255,255,.12);
  border-radius:8px;padding:3px;gap:2px;
}
.view-btn{
  display:flex;align-items:center;gap:5px;
  padding:5px 10px;border-radius:6px;
  border:none;background:transparent;
  color:rgba(255,255,255,.7);font-size:11px;font-weight:500;
  cursor:pointer;transition:all .15s;letter-spacing:.03em;
}
.view-btn.active{background:rgba(255,255,255,.22);color:#fff;}
.view-btn svg{width:13px;height:13px;flex-shrink:0;}

.header-badge{
  font-size:11px;color:rgba(255,255,255,.55);
  background:rgba(255,255,255,.1);
  padding:4px 10px;border-radius:20px;
  letter-spacing:.04em;
}

/* ── Sidebar ─────────────────────────────────────── */
.sidebar{
  background:var(--sidebar-bg);
  border-right:1px solid var(--border);
  display:flex;flex-direction:column;
  overflow:hidden;
}

.tabs{
  display:flex;flex-wrap:wrap;
  border-bottom:1px solid var(--border);
  padding:10px 12px 0;
  gap:4px;
}
.tab{
  padding:5px 10px;border-radius:6px;
  border:1px solid transparent;
  background:transparent;color:var(--muted);
  font-size:11.5px;font-weight:500;cursor:pointer;
  transition:all .15s;white-space:nowrap;
  display:flex;align-items:center;gap:5px;
}
.tab:hover{background:var(--bg);color:var(--text);}
.tab.active{
  background:var(--purple);color:#fff;
  border-color:var(--purple);
}
.tab .count{
  background:rgba(255,255,255,.25);
  border-radius:10px;padding:1px 6px;
  font-size:10px;font-weight:600;
}
.tab:not(.active) .count{
  background:rgba(103,99,219,.12);color:var(--purple);
}

.sidebar-body{flex:1;overflow-y:auto;padding:12px 10px;}
.sidebar-body::-webkit-scrollbar{width:4px;}
.sidebar-body::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}

.sidebar-section{display:none;}
.sidebar-section.active{display:block;}

.cat-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:0 6px 4px;
}
.cat-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;}
.cat-count{font-size:10px;color:var(--muted);}
.cat-desc{font-size:11.5px;color:var(--muted);padding:0 6px 10px;line-height:1.5;}

.tpl-item{
  padding:9px 10px;border-radius:8px;cursor:pointer;
  transition:background .12s;margin-bottom:2px;
  border:1px solid transparent;
}
.tpl-item:hover{background:var(--bg);}
.tpl-item.active{
  background:rgba(103,99,219,.06);
  border-color:rgba(103,99,219,.18);
}
.tpl-label{font-size:12.5px;font-weight:600;color:var(--text);line-height:1.3;}
.tpl-subject{font-size:11px;color:var(--muted);margin-top:2px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

/* ── Main panel ─────────────────────────────────────── */
.main{
  display:flex;flex-direction:column;
  background:var(--bg);overflow:hidden;
}

/* preview bar */
.preview-bar{
  height:44px;flex-shrink:0;
  background:#fff;border-bottom:1px solid var(--border);
  display:flex;align-items:center;padding:0 16px;gap:10px;
}
.preview-key{font-size:11px;font-weight:600;color:var(--purple);
  background:rgba(103,99,219,.08);padding:3px 9px;border-radius:5px;
  font-family:monospace;letter-spacing:.02em;}
.preview-subject{font-size:12px;color:var(--muted);}
.preview-trigger{font-size:11px;color:var(--muted);margin-left:auto;
  background:var(--bg);padding:2px 8px;border-radius:4px;}

/* iframe wrapper */
.frame-wrap{
  flex:1;overflow:hidden;
  display:flex;align-items:flex-start;justify-content:center;
  padding:20px;
  transition:background .2s;
}
.frame-wrap.desktop-mode{background:var(--bg);}
.frame-wrap.mobile-mode{background:#1a1a2e;}

.email-frame{
  border:none;border-radius:12px;
  box-shadow:0 4px 24px rgba(0,0,0,.14);
  transition:width .25s cubic-bezier(.4,0,.2,1);
  height:100%;background:#fff;
}
.email-frame.desktop{width:660px;}
.email-frame.mobile{width:375px;}

/* ── Documents view ─────────────────────────────────────── */
.docs-view{
  flex:1;overflow-y:auto;padding:20px;
  display:none;
  flex-direction:column;gap:16px;
}
.docs-view.visible{display:flex;}

.doc-panel{
  background:#fff;border-radius:12px;
  border:1px solid var(--border);
  box-shadow:var(--shadow);
  overflow:hidden;display:none;
}
.doc-panel.active{display:block;}

.doc-info{padding:20px 24px 16px;}
.doc-title{font-size:18px;font-weight:700;color:var(--text);margin-bottom:6px;}
.doc-desc{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:12px;}
.doc-tag{
  display:inline-block;font-size:11px;font-weight:600;
  color:var(--purple);background:rgba(103,99,219,.08);
  padding:3px 10px;border-radius:20px;letter-spacing:.04em;
  margin-bottom:14px;
}
.doc-actions{display:flex;gap:8px;}
.doc-btn{
  display:inline-flex;align-items:center;
  padding:8px 16px;border-radius:8px;font-size:12.5px;font-weight:600;
  text-decoration:none;background:var(--purple);color:#fff;
  transition:opacity .15s;
}
.doc-btn:hover{opacity:.88;}
.doc-btn-outline{background:transparent;color:var(--purple);border:1.5px solid var(--purple);}
.doc-btn-outline:hover{background:rgba(103,99,219,.06);}

.pdf-embed-wrap{
  position:relative;width:100%;
  height:calc(100vh - 300px);min-height:400px;
  border-top:1px solid var(--border);background:#f0f0f0;
}
.pdf-embed{width:100%;height:100%;border:none;}
.pdf-fallback{
  position:absolute;inset:0;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:12px;font-size:13px;color:var(--muted);
  pointer-events:none;
}
.pdf-fallback a{pointer-events:all;color:var(--purple);}

/* docs empty state */
.docs-placeholder{
  flex:1;display:flex;align-items:center;justify-content:center;
  flex-direction:column;gap:10px;
  color:var(--muted);font-size:13px;
}
.docs-placeholder p{opacity:.6;}

/* ── Empty/placeholder states ─────────────────────────────── */
.empty-state{
  flex:1;display:flex;align-items:center;justify-content:center;
  flex-direction:column;gap:8px;color:var(--muted);
}
.empty-state p{font-size:13px;opacity:.7;}

/* ── Responsive — narrow screens ─────────────────────────── */
@media(max-width:900px){
  :root{--sidebar-w:220px;}
  .email-frame.desktop{width:100%;}
  .preview-trigger{display:none;}
}
@media(max-width:640px){
  .app{grid-template-columns:1fr;grid-template-rows:var(--header-h) auto 1fr;}
  .sidebar{grid-row:2;max-height:180px;}
  .main,.docs-view{grid-column:1;}
}
</style>
</head>
<body>
<div class="app">

  <!-- ── Header ─────────────────────────────── -->
  <header class="header">
    <div class="header-left">
      <div class="logo">Vysa<span class="logo-dot">.</span></div>
      <div class="header-title">Email Templates &amp; Documents</div>
    </div>
    <div class="header-right">
      <div class="view-toggle" id="viewToggle">
        <button class="view-btn active" onclick="setView('desktop')" id="btnDesktop">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          </svg>
          Desktop
        </button>
        <button class="view-btn" onclick="setView('mobile')" id="btnMobile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
          </svg>
          Mobile
        </button>
      </div>
      <div class="header-badge">${totalCount} templates · ${DOCS.length} documents</div>
    </div>
  </header>

  <!-- ── Sidebar ─────────────────────────────── -->
  <aside class="sidebar">
    <div class="tabs" id="tabs">
      ${buildTabs()}
    </div>
    <div class="sidebar-body">
      ${buildAllSidebarSections()}
    </div>
  </aside>

  <!-- ── Main ─────────────────────────────────── -->
  <main class="main" id="mainPanel">
    <div class="preview-bar" id="previewBar">
      <span class="preview-key" id="previewKey">${firstKey}</span>
      <span class="preview-subject" id="previewSubject"></span>
      <span class="preview-trigger" id="previewTrigger"></span>
    </div>
    <div class="frame-wrap desktop-mode" id="frameWrap">
      <iframe class="email-frame desktop" id="emailFrame" title="Email preview"></iframe>
    </div>
    <div class="docs-view" id="docsView">
      ${docViewers}
      <div class="docs-placeholder" id="docsPlaceholder">
        <p>Select a document from the sidebar to preview it.</p>
      </div>
    </div>
  </main>

</div>

<script>
// ── Template data ──────────────────────────────
const TEMPLATES = {
${tplDataLines}
};

const TEMPLATE_META = ${JSON.stringify(
  Object.fromEntries(
    Object.entries(rendered).map(([k, v]) => [k, { subject: v.subject, trigger: v.trigger }])
  )
)};

// ── State ─────────────────────────────────────
let currentView = 'desktop';
let currentCat  = '${CATEGORIES[0].id}';
let currentKey  = null;
let currentDoc  = null;

// ── Init ──────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Select first template of first category
  const firstItem = document.querySelector('.sidebar-section.active .tpl-item');
  if (firstItem) {
    const key = firstItem.dataset.key;
    if (key) selectTemplate(firstItem, key);
  }
});

// ── View toggle ───────────────────────────────
function setView(v) {
  currentView = v;
  const frame = document.getElementById('emailFrame');
  const wrap  = document.getElementById('frameWrap');
  const btnD  = document.getElementById('btnDesktop');
  const btnM  = document.getElementById('btnMobile');
  if (v === 'desktop') {
    frame.className = 'email-frame desktop';
    wrap.className  = 'frame-wrap desktop-mode';
    btnD.className  = 'view-btn active';
    btnM.className  = 'view-btn';
  } else {
    frame.className = 'email-frame mobile';
    wrap.className  = 'frame-wrap mobile-mode';
    btnD.className  = 'view-btn';
    btnM.className  = 'view-btn active';
  }
}

// ── Category / tab selection ──────────────────
function selectCategory(btn, catId) {
  currentCat = catId;
  // Tabs
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Sidebar sections
  document.querySelectorAll('.sidebar-section').forEach(s => s.classList.remove('active'));
  const section = document.querySelector(\`.sidebar-section[data-cat="\${catId}"]\`);
  if (section) section.classList.add('active');

  // Show/hide docs panel vs email panel
  const main    = document.getElementById('mainPanel');
  const docsView = document.getElementById('docsView');
  const previewBar = document.getElementById('previewBar');
  const frameWrap  = document.getElementById('frameWrap');

  if (catId === 'docs') {
    previewBar.style.display = 'none';
    frameWrap.style.display  = 'none';
    docsView.classList.add('visible');
    // If no doc selected, auto-select first
    if (!currentDoc) {
      const firstDocItem = section && section.querySelector('.tpl-item[data-doc]');
      if (firstDocItem) selectDoc(firstDocItem, firstDocItem.dataset.doc);
    }
  } else {
    previewBar.style.display = '';
    frameWrap.style.display  = '';
    docsView.classList.remove('visible');
    // Auto-select first template in this category
    const firstItem = section && section.querySelector('.tpl-item[data-key]');
    if (firstItem) selectTemplate(firstItem, firstItem.dataset.key);
  }
}

// ── Template selection ────────────────────────
function selectTemplate(el, key) {
  currentKey = key;
  // Highlight in sidebar
  document.querySelectorAll('.tpl-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');

  // Update preview bar
  const meta = TEMPLATE_META[key] || {};
  document.getElementById('previewKey').textContent     = key;
  document.getElementById('previewSubject').textContent = meta.subject || '';
  document.getElementById('previewTrigger').textContent = meta.trigger ? '⚡ ' + meta.trigger : '';

  // Load into iframe via srcdoc
  const frame = document.getElementById('emailFrame');
  const html  = TEMPLATES[key];
  if (html) {
    frame.srcdoc = html;
  }
}

// ── Document selection ────────────────────────
function selectDoc(el, docId) {
  currentDoc = docId;
  document.querySelectorAll('.tpl-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');

  document.querySelectorAll('.doc-panel').forEach(p => p.classList.remove('active'));
  const panel = document.querySelector(\`.doc-panel[data-doc="\${docId}"]\`);
  if (panel) panel.classList.add('active');
  const placeholder = document.getElementById('docsPlaceholder');
  if (placeholder) placeholder.style.display = 'none';
}
</script>
</body>
</html>`;

// ── Write output ─────────────────────────────────────────────────────────────
const outPath = path.join(ROOT, 'docs', 'vysa-email-showcase.html');
await fs.writeFile(outPath, html, 'utf8');
const stat = await fs.stat(outPath);
const kb   = Math.round(stat.size / 1024);
console.log(`\n✅  Written: ${outPath}  (${kb} KB)\n`);
