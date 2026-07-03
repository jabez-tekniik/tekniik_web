#!/usr/bin/env node
// Reads docs/testing/screenshots/manifest.json and emits
// docs/testing/vysa-knowledge-base-pilot.html — a self-contained doc
// where each screenshot is rendered with text-label annotations and leader lines.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const SHOTS = path.resolve(repoRoot, 'docs/testing/screenshots');
const OUT = path.resolve(repoRoot, 'docs/testing/vysa-knowledge-base-pilot.html');

const manifest = JSON.parse(await readFile(path.join(SHOTS, 'manifest.json'), 'utf8'));

// ─── annotation layout ────────────────────────────────────────────────────
// Container: image rendered at full row width. Anchor coords are in CSS px
// relative to the captured viewport (or full-page height). We render absolute
// markers + leader lines at percentages so the SVG scales with the image.
//
// Labels: vertical "rails" left + right of the image. Each anchor is assigned
// to a side based on whether its centre is closer to the left or right edge
// of the captured viewport. Within a side, labels stack vertically (top-down)
// with a min vertical spacing of LABEL_MIN_GAP.

const LABEL_RAIL_W = 210;     // px, width of side rail (sized to fit A4 landscape print)
const LABEL_GAP = 12;         // px between image edge and rail content
const LABEL_MIN_GAP = 56;     // px between consecutive labels on the same side

function layoutAnchors(shotDef) {
  const W = shotDef.viewport.width;
  const H = shotDef.fullPage ? shotDef.pageHeight : shotDef.viewport.height;

  const anchors = Object.entries(shotDef.anchors).map(([label, b]) => ({
    label,
    cx: b.x + b.width / 2,
    cy: b.y + b.height / 2,
    box: b,
  }));

  // Assign side
  for (const a of anchors) a.side = a.cx < W / 2 ? 'left' : 'right';

  // Sort each side by cy ascending and space them
  for (const side of ['left', 'right']) {
    const list = anchors.filter((a) => a.side === side).sort((a, b) => a.cy - b.cy);
    let lastY = -Infinity;
    for (const a of list) {
      a.labelY = Math.max(a.cy, lastY + LABEL_MIN_GAP);
      lastY = a.labelY;
    }
    // Clamp so labels don't run off the bottom: re-distribute upward if needed
    if (list.length) {
      const last = list[list.length - 1];
      const overflow = last.labelY - (H - 32);
      if (overflow > 0) {
        for (let i = list.length - 1; i >= 0; i--) {
          list[i].labelY -= overflow;
          if (i > 0 && list[i].labelY - list[i - 1].labelY < LABEL_MIN_GAP) {
            // continue propagating
          } else break;
        }
      }
    }
  }

  return { W, H, anchors };
}

function renderShot(name, def, opts = {}) {
  const { W, H, anchors } = layoutAnchors(def);
  const aspect = (H / W) * 100;        // for padding-bottom hack

  // Render markers + lines + labels relative to the captured viewport (W × H).
  // We use percentages so the whole composition scales with the image width.
  const pct = (n, total) => `${(n / total * 100).toFixed(4)}%`;

  const markers = anchors.map((a) => {
    const left = pct(a.box.x, W);
    const top = pct(a.box.y, H);
    const w = pct(a.box.width, W);
    const h = pct(a.box.height, H);
    return `<div class="anno-marker" style="left:${left};top:${top};width:${w};height:${h};"></div>`;
  }).join('\n');

  // Leader lines (drawn from anchor edge to label). The label sits in the
  // rail outside the image; we draw a CSS line from the rail edge to the
  // anchor box edge.
  const lines = anchors.map((a) => {
    const yPct = pct(a.labelY, H);
    if (a.side === 'left') {
      const ax = pct(a.box.x, W);
      // Line spans from x=0 to anchor's left edge at y=labelY → ax at y=cy
      // Use SVG-like with two-segment polyline via a single inline svg.
      return `<svg class="anno-line" preserveAspectRatio="none" viewBox="0 0 ${W} ${H}" style="left:0;top:0;width:100%;height:100%;">
        <polyline points="0,${a.labelY} ${a.box.x - 8},${a.labelY} ${a.box.x},${a.cy}" fill="none" stroke="#6763db" stroke-width="2" stroke-linejoin="round" />
      </svg>`;
    } else {
      const axRight = a.box.x + a.box.width;
      return `<svg class="anno-line" preserveAspectRatio="none" viewBox="0 0 ${W} ${H}" style="left:0;top:0;width:100%;height:100%;">
        <polyline points="${W},${a.labelY} ${axRight + 8},${a.labelY} ${axRight},${a.cy}" fill="none" stroke="#6763db" stroke-width="2" stroke-linejoin="round" />
      </svg>`;
    }
  }).join('\n');

  const labels = anchors.map((a) => {
    const yPct = pct(a.labelY - 14, H);   // shift up so label baseline aligns
    if (a.side === 'left') {
      return `<div class="anno-label left" style="top:${yPct};">${escapeHtml(a.label)}</div>`;
    }
    return `<div class="anno-label right" style="top:${yPct};">${escapeHtml(a.label)}</div>`;
  }).join('\n');

  const caption = opts.caption ? `<div class="shot-caption">${opts.caption}</div>` : '';
  return `
<figure class="shot">
  <div class="shot-frame" style="--shot-aspect:${aspect.toFixed(4)}%;">
    <img src="screenshots/${def.file}" alt="${escapeHtml(name)}" />
    ${markers}
    ${lines}
    ${labels}
  </div>
  ${caption}
</figure>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// ─── content ──────────────────────────────────────────────────────────────
const css = `
:root {
  --brand: #6763db;
  --brand-tint: #ece9fb;
  --brand-deep: #4b47a3;
  --amber: #f59e0b;
  --amber-tint: #fff4db;
  --ink: #1a1a2e;
  --ink-soft: #4a4a63;
  --ink-mute: #7a7a8c;
  --rule: #e5e3db;
  --rule-soft: #f0eee7;
  --paper: #fafaf7;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; }
body {
  font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--ink);
  background: var(--paper);
  line-height: 1.65;
  font-size: 15px;
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3 {
  font-family: 'Cormorant Garamond', 'Times New Roman', Georgia, serif;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink);
}
h1 { font-size: 56px; line-height: 1.05; }
h2 { font-size: 32px; line-height: 1.2; margin-bottom: 14px; }
h3 { font-size: 22px; line-height: 1.3; margin: 30px 0 10px; color: var(--brand-deep); }
h4 { font-size: 16px; margin: 20px 0 8px; font-weight: 700; color: var(--ink); }
p { margin: 10px 0; color: var(--ink-soft); }
strong { color: var(--ink); font-weight: 600; }

/* Cover */
.cover {
  min-height: 100vh;
  background: linear-gradient(160deg, #fafaf7 0%, #fafaf7 55%, #f3f1ea 100%);
  padding: 72px 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  page-break-after: always;
  position: relative;
}
.cover::before {
  content: '';
  position: absolute; top: 0; left: 0;
  width: 100%; height: 12px;
  background: var(--brand);
}
.brand-lockup { display: flex; align-items: center; gap: 14px; margin-top: 20px; }
.brand-mark {
  width: 48px; height: 48px; border-radius: 12px;
  background: var(--brand);
  color: #fff; font-weight: 700; font-size: 22px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
}
.cover h1 em { font-style: italic; color: var(--brand); }
.cover .subtitle {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 20px;
  color: var(--ink-soft);
  max-width: 620px;
  margin-top: 18px;
}
.cover .meta {
  margin-top: 64px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--rule);
}
.cover .meta .label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-mute); margin-bottom: 6px; }
.cover .meta .value { font-size: 16px; color: var(--ink); font-weight: 500; }
.amber-eyebrow {
  display: inline-block; background: var(--amber-tint); color: #8a5a08;
  font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  padding: 3px 10px; border-radius: 999px; margin-bottom: 10px;
}

section {
  padding: 52px 28px 64px;
  page-break-before: always;
  max-width: 1280px;
  margin: 0 auto;
}
section:first-of-type { page-break-before: auto; }
.section-label {
  font-size: 12px; font-weight: 600; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--brand);
  margin-bottom: 8px;
  display: flex; align-items: center; gap: 10px;
}
.section-label::before { content: ''; width: 24px; height: 2px; background: var(--brand); }
section .lead { font-size: 17px; line-height: 1.55; color: var(--ink-soft); margin-bottom: 22px; max-width: 720px; }

/* Tables */
table { width: 100%; border-collapse: collapse; margin: 14px 0 22px; font-size: 13.5px; background: #fff; border: 1px solid var(--rule); border-radius: 8px; overflow: hidden; }
th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--rule-soft); vertical-align: top; }
th { background: var(--brand-tint); color: var(--brand-deep); font-weight: 600; font-size: 11.5px; letter-spacing: 0.05em; text-transform: uppercase; }
tr:last-child td { border-bottom: 0; }
tr:nth-child(even) td { background: #fcfbf8; }
.mono, td .mono { font-family: 'JetBrains Mono', Consolas, monospace; font-size: 12.5px; color: var(--brand-deep); }

/* Note */
.note { background: #fff; border-left: 4px solid var(--brand); border-top: 1px solid var(--rule-soft); border-right: 1px solid var(--rule-soft); border-bottom: 1px solid var(--rule-soft); border-radius: 0 8px 8px 0; padding: 12px 18px; margin: 16px 0; font-size: 14px; color: var(--ink-soft); }
.note .title { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--brand); margin-bottom: 4px; }
.note.amber { border-left-color: var(--amber); }
.note.amber .title { color: #b4780a; }

/* URL block */
.urlbox { background: #fff; border: 1px solid var(--rule); border-left: 4px solid var(--brand); border-radius: 8px; padding: 14px 18px; margin: 14px 0 20px; font-size: 14px; color: var(--ink-soft); display: grid; grid-template-columns: 130px 1fr; gap: 6px 14px; }
.urlbox .k { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-mute); align-self: center; }
.urlbox .v { color: var(--brand-deep); font-family: 'JetBrains Mono', 'Consolas', monospace; font-size: 13px; word-break: break-all; }

/* Step flow */
.flow { counter-reset: step; margin: 18px 0 24px; }
.flow .step { display: grid; grid-template-columns: 44px 1fr; gap: 18px; padding: 12px 0; border-bottom: 1px solid var(--rule-soft); }
.flow .step:last-child { border-bottom: 0; }
.flow .step::before { counter-increment: step; content: counter(step); width: 30px; height: 30px; border-radius: 50%; background: var(--brand-tint); color: var(--brand-deep); display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 600; }
.flow .step .action { font-weight: 600; color: var(--ink); margin-bottom: 2px; }
.flow .step .expect { color: var(--ink-soft); font-size: 14px; }

/* Annotated screenshot */
.shot {
  margin: 22px 0 32px;
  background: #fff;
  border: 1px solid var(--rule);
  border-radius: 14px;
  padding: 22px 22px 18px;
  page-break-inside: avoid;
}
.shot-frame {
  position: relative;
  width: 100%;
  /* Image fills the inner area; rails sit outside at the edges */
  padding: 0 ${LABEL_RAIL_W}px;
}
.shot-frame > img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(26,26,46,0.08);
  border: 1px solid var(--rule);
}
/* The marker / line / label coordinates are %-based relative to the IMAGE area
   which equals the .shot-frame minus the rail padding. Wrap markers in their
   own positioning context via .shot-frame::after... actually simpler: we put
   markers + lines in a separate overlay div sized to the image. */
.shot-overlay {
  position: absolute;
  top: 0;
  left: ${LABEL_RAIL_W}px;
  right: ${LABEL_RAIL_W}px;
  bottom: 0;
  pointer-events: none;
}
.anno-marker {
  position: absolute;
  border: 2px solid var(--brand);
  border-radius: 4px;
  box-shadow: 0 0 0 2px rgba(103,99,219,0.18);
  pointer-events: none;
}
.anno-line {
  position: absolute;
  pointer-events: none;
  overflow: visible;
}
.anno-label {
  position: absolute;
  width: ${LABEL_RAIL_W - LABEL_GAP - 4}px;
  font-size: 12px;
  line-height: 1.35;
  color: var(--ink);
  background: #fff;
  border: 1px solid var(--rule);
  border-left: 3px solid var(--brand);
  border-radius: 4px;
  padding: 6px 9px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(26,26,46,0.04);
}
.anno-label.left  { left: 0; text-align: right; border-left: 1px solid var(--rule); border-right: 3px solid var(--brand); }
.anno-label.right { right: 0; text-align: left; }
.shot-caption { font-size: 12.5px; color: var(--ink-mute); margin-top: 14px; text-align: center; font-style: italic; }

@media print {
  body { background: #fff; font-size: 11pt; }
  section { padding: 22px 14px 28px; max-width: none; }
  .shot { padding: 14px; margin: 14px 0 18px; }
  .shot, .urlbox, .note, .flow .step, table { page-break-inside: avoid; }
  h2, h3 { page-break-after: avoid; }
  @page { margin: 12mm 10mm; size: A4 landscape; }
  /* Force annotation visibility in print regardless of viewport width */
  .anno-marker, .anno-line, .anno-label, .rail { display: block !important; }
}
/* Screen-only breakpoint — print mode keeps rails */
@media screen and (max-width: 1100px) {
  .shot-grid { grid-template-columns: 1fr !important; }
  .rail { display: none; }
  .anno-marker, .anno-line { display: none; }
}
`;

// Restructure: the markers/lines/labels currently sit inside .shot-frame,
// but we need them inside a child overlay positioned over the image area only
// (excluding rails). Re-render to wrap markers in .shot-overlay.
function renderShotV2(name, def, opts = {}) {
  const { W, H, anchors } = layoutAnchors(def);
  const aspect = (H / W) * 100;
  const pct = (n, total) => `${(n / total * 100).toFixed(4)}%`;

  const markersAndLines = anchors.map((a) => {
    const left = pct(a.box.x, W);
    const top = pct(a.box.y, H);
    const w = pct(a.box.width, W);
    const h = pct(a.box.height, H);
    const marker = `<div class="anno-marker" style="left:${left};top:${top};width:${w};height:${h};"></div>`;
    let line;
    if (a.side === 'left') {
      line = `<svg class="anno-line" preserveAspectRatio="none" viewBox="0 0 ${W} ${H}" style="left:0;top:0;width:100%;height:100%;">
        <polyline points="0,${a.labelY} ${a.box.x - 8},${a.labelY} ${a.box.x},${a.cy}" fill="none" stroke="#6763db" stroke-width="2" stroke-linejoin="round" />
      </svg>`;
    } else {
      const axRight = a.box.x + a.box.width;
      line = `<svg class="anno-line" preserveAspectRatio="none" viewBox="0 0 ${W} ${H}" style="left:0;top:0;width:100%;height:100%;">
        <polyline points="${W},${a.labelY} ${axRight + 8},${a.labelY} ${axRight},${a.cy}" fill="none" stroke="#6763db" stroke-width="2" stroke-linejoin="round" />
      </svg>`;
    }
    return marker + '\n' + line;
  }).join('\n');

  // Labels live OUTSIDE the overlay, in the .shot-frame rails. Use absolute %
  // top relative to the frame (which has the same height as the image since the
  // overlay sits on top of the image). To keep maths simple, use the inner-image
  // height which == frame height. The label `top` is already in image-px → %.
  const labels = anchors.map((a) => {
    const yPct = pct(Math.max(0, a.labelY - 14), H);
    const cls = a.side === 'left' ? 'left' : 'right';
    return `<div class="anno-label ${cls}" style="top:${yPct};">${escapeHtml(a.label)}</div>`;
  }).join('\n');

  const caption = opts.caption ? `<div class="shot-caption">${escapeHtml(opts.caption)}</div>` : '';
  return `
<figure class="shot">
  <div class="shot-frame" style="position:relative;">
    <div class="shot-image-wrap" style="position:relative;">
      <img src="screenshots/${def.file}" alt="${escapeHtml(name)}" style="display:block;width:100%;height:auto;border-radius:10px;border:1px solid var(--rule);box-shadow:0 6px 24px rgba(26,26,46,0.08);" />
      <div class="shot-overlay" style="position:absolute;inset:0;pointer-events:none;">
        ${markersAndLines}
      </div>
    </div>
    ${labels}
  </div>
  ${caption}
</figure>`;
}

// We need labels to live in side rails; restructure container to grid.
function renderShotV3(name, def, opts = {}) {
  if (!def) return `<div class="note amber"><div class="title">Missing capture</div>Screenshot <span class="mono">${escapeHtml(name)}</span> was not captured. Re-run the pipeline once the underlying flow is reachable in seed data.</div>`;
  const { W, H, anchors } = layoutAnchors(def);
  const aspect = (H / W) * 100;
  const pct = (n, total) => `${(n / total * 100).toFixed(4)}%`;

  // Outset the marker by MARKER_PAD pixels so the highlight visually
  // surrounds the element rather than sitting on its edge. Anchor coords
  // unchanged — leader lines still target the true element edge.
  const MARKER_PAD = 4;

  const markersAndLines = anchors.map((a) => {
    const padX0 = Math.max(0, a.box.x - MARKER_PAD);
    const padY0 = Math.max(0, a.box.y - MARKER_PAD);
    const padX1 = Math.min(W, a.box.x + a.box.width + MARKER_PAD);
    const padY1 = Math.min(H, a.box.y + a.box.height + MARKER_PAD);
    const left = pct(padX0, W);
    const top = pct(padY0, H);
    const w = pct(padX1 - padX0, W);
    const h = pct(padY1 - padY0, H);
    const marker = `<div class="anno-marker" style="left:${left};top:${top};width:${w};height:${h};"></div>`;
    let line;
    if (a.side === 'left') {
      line = `<svg class="anno-line" preserveAspectRatio="none" viewBox="0 0 ${W} ${H}">
        <polyline points="0,${a.labelY} ${Math.max(0, padX0 - 4)},${a.labelY} ${padX0},${a.cy}" fill="none" stroke="#6763db" stroke-width="2" stroke-linejoin="round" />
      </svg>`;
    } else {
      line = `<svg class="anno-line" preserveAspectRatio="none" viewBox="0 0 ${W} ${H}">
        <polyline points="${W},${a.labelY} ${Math.min(W, padX1 + 4)},${a.labelY} ${padX1},${a.cy}" fill="none" stroke="#6763db" stroke-width="2" stroke-linejoin="round" />
      </svg>`;
    }
    return marker + '\n' + line;
  }).join('\n');

  const leftLabels = anchors.filter((a) => a.side === 'left').map((a) => {
    const yPct = pct(Math.max(0, a.labelY - 14), H);
    return `<div class="anno-label left" style="top:${yPct};">${escapeHtml(a.label)}</div>`;
  }).join('\n');

  const rightLabels = anchors.filter((a) => a.side === 'right').map((a) => {
    const yPct = pct(Math.max(0, a.labelY - 14), H);
    return `<div class="anno-label right" style="top:${yPct};">${escapeHtml(a.label)}</div>`;
  }).join('\n');

  const caption = opts.caption ? `<div class="shot-caption">${escapeHtml(opts.caption)}</div>` : '';
  return `
<figure class="shot">
  <div class="shot-grid">
    <div class="rail rail-left">${leftLabels}</div>
    <div class="shot-image-wrap">
      <img src="screenshots/${def.file}" alt="${escapeHtml(name)}" />
      <div class="shot-overlay">
        ${markersAndLines}
      </div>
    </div>
    <div class="rail rail-right">${rightLabels}</div>
  </div>
  ${caption}
</figure>`;
}

const cssV3 = `
.shot { margin: 18px 0 26px; background: #fff; border: 1px solid var(--rule); border-radius: 12px; padding: 16px; page-break-inside: avoid; }
.shot-grid { display: grid; grid-template-columns: ${LABEL_RAIL_W}px 1fr ${LABEL_RAIL_W}px; gap: 0; align-items: stretch; }
.rail { position: relative; }
.rail-left  { padding-right: ${LABEL_GAP}px; }
.rail-right { padding-left: ${LABEL_GAP}px; }
.shot-image-wrap { position: relative; }
.shot-image-wrap img { display: block; width: 100%; height: auto; border-radius: 10px; border: 1px solid var(--rule); box-shadow: 0 6px 24px rgba(26,26,46,0.08); }
.shot-overlay { position: absolute; inset: 0; pointer-events: none; }
.anno-marker { position: absolute; border: 2.5px solid var(--brand); border-radius: 8px; box-shadow: 0 0 0 3px rgba(245,158,11,0.32), 0 0 0 1.5px rgba(255,255,255,0.85) inset; pointer-events: none; }
.anno-line { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.anno-label { position: absolute; width: 100%; font-size: 11.5px; line-height: 1.35; color: var(--ink); background: #fff; border: 1px solid var(--rule); border-radius: 4px; padding: 6px 9px; font-weight: 500; box-shadow: 0 2px 6px rgba(26,26,46,0.04); }
.anno-label.left  { right: ${LABEL_GAP}px; text-align: right; border-right: 3px solid var(--brand); width: calc(100% - ${LABEL_GAP}px); }
.anno-label.right { left: ${LABEL_GAP}px; text-align: left; border-left: 3px solid var(--brand); width: calc(100% - ${LABEL_GAP}px); }
.shot-caption { font-size: 12.5px; color: var(--ink-mute); margin-top: 14px; text-align: center; font-style: italic; }
`;

// ─── auto sections (Phase A/B/C/D) ────────────────────────────────────────
// Anything in the manifest not matched by the hardcoded auth sections gets
// rendered into a section by phase prefix.
function renderAutoSections(manifest) {
  const PILOT_KEYS = new Set([
    '01a-home-before-signin','01b-traveller-modal-email-step','01c-traveller-modal-email-filled','01d-traveller-modal-password-step',
    '02a-traveller-forgot-email','02b-traveller-forgot-otp',
    '03a-signup-email-filled','03b-signup-form','03c-signup-form-filled',
    '04a-operator-auth-landing','04b-operator-auth-filled',
    '05a-staff-auth-landing','05b-staff-auth-filled',
    '06a-operator-forgot',
    '07a-admin-login-landing','07b-admin-login-filled',
  ]);

  const buckets = {
    A: { number: '10', label: 'Customer journey', lead: 'Every screen a passenger sees — from homepage search through trip detail, checkout, payment, ticket, and account.', shots: [] },
    B: { number: '11', label: 'Operator portal', lead: 'The Corporate Admin dashboard, role-specific sidebars, walk-in booking, parcel counter intake, mobile scan and the rest of the bus-operator workspace.', shots: [] },
    C: { number: '12', label: 'Platform admin (Vysa team)', lead: 'Super-admin and sub-admin surfaces — users, bus companies, finance, content, communications, support, and settings.', shots: [] },
    D: { number: '13', label: 'Cross-cutting flows', lead: 'Refunds, no-show flagging, suspend / reactivate, act-as impersonation, parcel hand-over verification, and the travel-document vault.', shots: [] },
  };

  for (const [key, def] of Object.entries(manifest)) {
    if (PILOT_KEYS.has(key)) continue;
    const m = key.match(/^([A-D])\d+/i);
    if (!m) continue;
    const bucket = buckets[m[1].toUpperCase()];
    if (bucket) bucket.shots.push({ key, def });
  }

  // Sort each bucket alphabetically (which is also numeric order: A01, A02 ... A23).
  for (const b of Object.values(buckets)) b.shots.sort((a, b) => a.key.localeCompare(b.key));

  return Object.values(buckets)
    .filter((b) => b.shots.length)
    .map((b) => `
<section>
  <div class="section-label">${b.number} · ${b.label}</div>
  <h2>${escapeHtml(b.label)} — ${b.shots.length} annotated screen${b.shots.length === 1 ? '' : 's'}.</h2>
  <p class="lead">${escapeHtml(b.lead)}</p>
  ${b.shots.map(({ key, def }) => renderShotV3(key, def, { caption: def.caption || prettifyKey(key) })).join('\n')}
</section>`)
    .join('\n');
}

function prettifyKey(key) {
  // "B07-corp-walkin" → "Corp walkin"
  return key.replace(/^[A-D]\d+[a-z]?-?/i, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── document body ─────────────────────────────────────────────────────────
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Vysa Knowledge Base · Pilot</title>
<style>
${css}
${cssV3}
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="brand-lockup">
    <div class="brand-mark">V</div>
    <div style="font-family:'Cormorant Garamond',serif; font-size: 24px; font-weight: 600; color: var(--ink);">Vysa</div>
  </div>
  <div>
    <span class="amber-eyebrow">Knowledge Base · Pilot · April 2026</span>
    <h1>Knowledge Base for <em>Vysa</em>.</h1>
    <p class="subtitle">Annotated, screenshot-driven walkthrough. This pilot covers the four sign-in doors plus the sign-up and forgot-password flows. Approve the look and feel, and the rest of the application will be built to match.</p>
  </div>
  <div class="meta">
    <div><div class="label">Site</div><div class="value">vysa.devsdock.com</div></div>
    <div><div class="label">Scope</div><div class="value">Auth flows only · pilot</div></div>
    <div><div class="label">Audience</div><div class="value">Client &amp; team review</div></div>
  </div>
</div>

<!-- 01 · CREDENTIALS (1 page) -->
<section>
  <div class="section-label">01 · Test credentials</div>
  <h2>Sign-in doors &amp; seeded accounts.</h2>
  <p class="lead">Four doors, one table. Use the email + password listed against each role; everything below is already loaded in the demo and works on first sign-in.</p>

  <div class="urlbox">
    <div class="k">Travellers</div>      <div class="v">https://vysa.devsdock.com/  <span class="mono" style="color:var(--ink-mute)">— click "Get Started" top-right</span></div>
    <div class="k">Bus owner</div>       <div class="v">https://vysa.devsdock.com/operator/auth</div>
    <div class="k">Bus staff</div>       <div class="v">https://vysa.devsdock.com/operator/staff/auth  <span class="mono" style="color:var(--ink-mute)">— invite-only</span></div>
    <div class="k">Vysa team</div>       <div class="v">https://vysa.devsdock.com/admin/login</div>
  </div>

  <table>
    <thead><tr><th>Role</th><th>Door</th><th>Email</th><th>Password</th></tr></thead>
    <tbody>
      <tr><td><strong>Traveller</strong> · Lerato Motaung</td><td>Traveller modal</td><td class="mono">lerato.motaung@gmail.com</td><td class="mono">Demo1234!</td></tr>
      <tr><td><strong>Traveller</strong> · Lerato Mokoena (has trips/cards)</td><td>Traveller modal</td><td class="mono">lerato.mokoena@gmail.com</td><td class="mono">Demo1234!</td></tr>
      <tr><td><strong>Corporate Admin</strong> · Greyhound</td><td>/operator/auth</td><td class="mono">sandra@greyhound.co.za</td><td class="mono">Operator1234!</td></tr>
      <tr><td><strong>Corporate Admin</strong> · Intercape</td><td>/operator/auth</td><td class="mono">david.mokoena@intercape.co.za</td><td class="mono">Operator1234!</td></tr>
      <tr><td><strong>Branch Manager</strong> · Greyhound JHB</td><td>/operator/staff/auth</td><td class="mono">branch-mgr-1@greyhound.co.za</td><td class="mono">BranchMgr1234!</td></tr>
      <tr><td><strong>Booking Clerk</strong> · Greyhound</td><td>/operator/staff/auth</td><td class="mono">booking-clerk@greyhound.co.za</td><td class="mono">BookingClerk1234!</td></tr>
      <tr><td><strong>Parcel Clerk</strong> · Greyhound</td><td>/operator/staff/auth</td><td class="mono">parcel-clerk@greyhound.co.za</td><td class="mono">ParcelClerk1234!</td></tr>
      <tr><td><strong>Vysa Master Admin</strong></td><td>/admin/login</td><td class="mono">admin@vysa.co.za</td><td class="mono">Admin1234!</td></tr>
    </tbody>
  </table>

  <div class="note">
    <div class="title">Same passwords across operators</div>
    Every Corporate Admin uses <span class="mono">Operator1234!</span>; every Branch Manager uses <span class="mono">BranchMgr1234!</span>; every clerk uses <span class="mono">BookingClerk1234!</span> or <span class="mono">ParcelClerk1234!</span>. So <span class="mono">parcel-clerk@intercape.co.za</span>, <span class="mono">parcel-clerk@apexcoach.co.za</span>, etc. all sign in with <span class="mono">ParcelClerk1234!</span>.
  </div>
</section>

<!-- 02 · TRAVELLER SIGN-IN -->
<section>
  <div class="section-label">02 · Traveller sign-in</div>
  <h2>From homepage to signed-in, in three taps.</h2>
  <p class="lead">The traveller sign-in lives in a modal — there is no separate page. Click <strong>Get Started</strong> at the top-right of the homepage; type your email; if your account exists you're shown a password field, otherwise the modal switches to sign-up.</p>

  ${renderShotV3('01a-home-before-signin', manifest['01a-home-before-signin'], {
    caption: 'The Vysa homepage. The "Get Started" button at the top-right opens the auth modal.'
  })}

  ${renderShotV3('01b-traveller-modal-email-step', manifest['01b-traveller-modal-email-step'], {
    caption: 'Step 1 — the email form. Continue on email-only is intentional: the system decides next step server-side.'
  })}

  ${renderShotV3('01c-traveller-modal-email-filled', manifest['01c-traveller-modal-email-filled'], {
    caption: 'Email entered. Pressing Continue calls /api/auth/check-email — exists ? password step : sign-up form.'
  })}

  ${renderShotV3('01d-traveller-modal-password-step', manifest['01d-traveller-modal-password-step'], {
    caption: 'For an existing account, the password field appears. Three actions: enter password, click Forgot, or back-arrow to change email.'
  })}
</section>

<!-- 03 · TRAVELLER FORGOT PASSWORD -->
<section>
  <div class="section-label">03 · Traveller forgot password</div>
  <h2>OTP-driven reset, in the same modal.</h2>
  <p class="lead">Forgot-password lives inside the same auth modal — no separate page. Email is pre-filled from the previous step. Press <strong>Send code</strong>, type the 6 digits, set a new password.</p>

  ${renderShotV3('02a-traveller-forgot-email', manifest['02a-traveller-forgot-email'], {
    caption: 'Reset step 1 — Vysa pre-fills the email from the password screen so you do not retype.'
  })}

  ${renderShotV3('02b-traveller-forgot-otp', manifest['02b-traveller-forgot-otp'], {
    caption: 'Reset step 2 — OTP. 6-digit code, valid for 10 minutes, resend allowed after a 30-second cooldown.'
  })}
</section>

<!-- 04 · TRAVELLER SIGN-UP -->
<section>
  <div class="section-label">04 · Traveller sign-up</div>
  <h2>Brand-new email — sign-up takes over.</h2>
  <p class="lead">Type an email Vysa has never seen and the modal switches from sign-in to sign-up automatically. Same window, same context — no jarring redirect.</p>

  ${renderShotV3('03a-signup-email-filled', manifest['03a-signup-email-filled'], {
    caption: 'Sign-up step 1 — fresh email. /api/auth/check-email returns exists:false, sign-up form opens next.'
  })}

  ${renderShotV3('03b-signup-form', manifest['03b-signup-form'], {
    caption: 'Sign-up step 2 — first name, last name, phone (with country code), password ≥ 8 characters.'
  })}

  ${renderShotV3('03c-signup-form-filled', manifest['03c-signup-form-filled'], {
    caption: 'Form filled. Submitting fires /api/auth/register; OTP is emailed; user verifies; account is live.'
  })}
</section>

<!-- 05 · OPERATOR SIGN-IN -->
<section>
  <div class="section-label">05 · Bus owner (Corporate Admin) sign-in</div>
  <h2>The dedicated operator portal door.</h2>
  <p class="lead">Bus owners use a separate page with two tabs — sign-in for existing companies, register for new ones. The link to the staff door is below the form for branch managers and clerks who arrived at the wrong page.</p>

  ${renderShotV3('04a-operator-auth-landing', manifest['04a-operator-auth-landing'], {
    caption: 'Operator door (/operator/auth). Sign-in tab is open by default; the Register tab opens the new-company wizard.'
  })}

  ${renderShotV3('04b-operator-auth-filled', manifest['04b-operator-auth-filled'], {
    caption: 'Credentials filled — Sandra at Greyhound. Pressing Sign in lands on the Corporate Admin dashboard.'
  })}
</section>

<!-- 06 · STAFF SIGN-IN -->
<section>
  <div class="section-label">06 · Bus staff (Branch Manager / Clerks) sign-in</div>
  <h2>Invite-only door — no public registration.</h2>
  <p class="lead">Branch Managers, Booking Clerks and Parcel Clerks come in through this separate door. There is no Register tab on purpose — staff are always invited by their company's Corporate Admin.</p>

  ${renderShotV3('05a-staff-auth-landing', manifest['05a-staff-auth-landing'], {
    caption: 'Staff door (/operator/staff/auth). One tab, one button — no wizard.'
  })}

  ${renderShotV3('05b-staff-auth-filled', manifest['05b-staff-auth-filled'], {
    caption: 'Greyhound parcel clerk credentials. The role-specific dashboard is decided server-side based on TeamMember.functions[].'
  })}
</section>

<!-- 07 · OPERATOR FORGOT PASSWORD -->
<section>
  <div class="section-label">07 · Operator forgot password</div>
  <h2>Same OTP flow, separate page.</h2>
  <p class="lead">Both operator doors share a forgot-password page. Email field, send-code button — identical to the traveller flow but on a dedicated route instead of a modal.</p>

  ${renderShotV3('06a-operator-forgot', manifest['06a-operator-forgot'], {
    caption: 'Operator forgot-password page. Identical OTP flow to the traveller modal — email → code → new password.'
  })}
</section>

<!-- 08 · ADMIN SIGN-IN -->
<section>
  <div class="section-label">08 · Vysa team (admin) sign-in</div>
  <h2>The platform admin door.</h2>
  <p class="lead">A separate, minimal sign-in for the Vysa team. There is no public register option — the Super Admin invites sub-admins from inside the platform.</p>

  ${renderShotV3('07a-admin-login-landing', manifest['07a-admin-login-landing'], {
    caption: 'Admin door (/admin/login). Branding-rich landing for the Vysa team.'
  })}

  ${renderShotV3('07b-admin-login-filled', manifest['07b-admin-login-filled'], {
    caption: 'Master admin credentials filled. Pressing Sign in lands on the platform-wide admin dashboard.'
  })}
</section>

${renderAutoSections(manifest)}

<!-- 09 · NEXT STEPS -->
<section>
  <div class="section-label">09 · What you're reviewing</div>
  <h2>Pilot scope &amp; the road ahead.</h2>
  <p class="lead">This pilot covers <strong>only sign-in / sign-up / forgot-password</strong>. If the look and feel is approved, the rest of the application is built to match.</p>

  <h3>Pilot scope (this document)</h3>
  <ul style="padding-left:22px;color:var(--ink-soft);">
    <li>1-page credentials reference</li>
    <li>Traveller sign-in modal (4 screens)</li>
    <li>Traveller forgot-password (2 screens)</li>
    <li>Traveller sign-up (3 screens)</li>
    <li>Bus owner sign-in (2 screens)</li>
    <li>Bus staff sign-in (2 screens)</li>
    <li>Operator forgot-password (1 screen)</li>
    <li>Vysa admin sign-in (2 screens)</li>
  </ul>

  <h3>If approved, the rest of the knowledge base will cover</h3>
  <ul style="padding-left:22px;color:var(--ink-soft);">
    <li>Customer journey — search, trip detail, seat selection, checkout, payment, ticket, my trips, account.</li>
    <li>Operator portal — dashboard, routes, schedules, bookings, walk-in, finance, payouts, promotions, team, fleet.</li>
    <li>Parcels — counter intake (5 steps), queue, manifest, mobile scan, hand-over verification (OTP/QR/ID), exception lanes.</li>
    <li>Platform admin — dashboard, users, bus companies, bookings, finance, content, communications, support, settings, sub-admins.</li>
    <li>Cross-cutting flows — refunds, no-shows, cross-border, suspend/reactivate, act-as.</li>
  </ul>

  <div class="note amber">
    <div class="title">Annotation style — please confirm</div>
    Each callout sits in a side rail, connected to its UI element by a thin purple line. Box outlines mark the element; text reads naturally. Same look will carry across every chapter once you approve.
  </div>

  <p class="muted" style="text-align:center;margin-top:32px;color:var(--ink-mute);font-size:13px;">Vysa · Knowledge Base · Pilot · April 2026 · Confidential</p>
</section>

</body>
</html>`;

await writeFile(OUT, html, 'utf8');
console.log('Wrote', OUT);
