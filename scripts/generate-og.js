#!/usr/bin/env node
/**
 * scripts/generate-og.js
 * Generates the default OG fallback image at public/images/og-default.jpg
 *
 * Usage:  node scripts/generate-og.js
 *
 * Requires:  npm install --save-dev canvas
 * (The `canvas` package wraps libcanvas and writes a real JPEG.)
 *
 * If `canvas` is not installed, the script falls back to writing a minimal
 * SVG that Vercel's OG pipeline can use.  Rename the output to .jpg manually
 * if your meta tags reference the .jpg extension.
 *
 * Design spec
 * ───────────
 *  • 1200 × 630 px  (standard OG size)
 *  • Background:   #0A0A0A  (near-black)
 *  • Top accent:   2 px line in #FF6B00 (HUBSS orange)
 *  • Heading:      "HUB Surface Systems"  — white, bold 72 px
 *  • Sub-heading:  "Decorative Hardscape Solutions"  — #FF6B00, 36 px
 *  • Tagline:      "Municipal · Commercial · Architectural"  — #888, 28 px
 *  • Rule:         1 px #333 horizontal divider
 *  • Domain:       "hubss.com"  — white bold 32 px  (bottom-left)
 *  • Bottom bar:   8 px solid #FF6B00
 */

"use strict";

const path  = require("path");
const fs    = require("fs");

const OUT_DIR  = path.join(__dirname, "..", "public", "images");
const OUT_JPG  = path.join(OUT_DIR, "og-default.jpg");
const OUT_SVG  = path.join(OUT_DIR, "og-default.svg");
const W = 1200, H = 630;

// ── Attempt canvas (npm install canvas) ──────────────────────────────────────
let canvasAvailable = false;
try {
  const { createCanvas } = require("canvas");
  canvasAvailable = true;

  const canvas  = createCanvas(W, H);
  const ctx     = canvas.getContext("2d");

  const BG      = "#0A0A0A";
  const ORANGE  = "#FF6B00";
  const WHITE   = "#FFFFFF";
  const GREY    = "#888888";
  const RULE    = "#333333";

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Top accent bar
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, 0, W, 6);

  // Heading
  ctx.fillStyle = WHITE;
  ctx.font = "bold 72px 'Arial'";
  ctx.textBaseline = "top";
  ctx.fillText("HUB Surface Systems", 80, 120);

  // Sub-heading
  ctx.fillStyle = ORANGE;
  ctx.font = "bold 36px 'Arial'";
  ctx.fillText("Decorative Hardscape Solutions", 80, 220);

  // Tagline
  ctx.fillStyle = GREY;
  ctx.font = "28px 'Arial'";
  ctx.fillText("Municipal · Commercial · Architectural", 80, 280);

  // Divider
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 340);
  ctx.lineTo(W - 80, 340);
  ctx.stroke();

  // Domain
  ctx.fillStyle = WHITE;
  ctx.font = "bold 32px 'Arial'";
  ctx.fillText("hubss.com", 80, 370);

  // Flag / tagline right side
  ctx.fillStyle = GREY;
  ctx.font = "28px 'Arial'";
  ctx.textAlign = "right";
  ctx.fillText("🍁 Canadian", W - 80, 370);

  // Bottom bar
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, H - 8, W, 8);

  // Write JPEG
  const buffer = canvas.toBuffer("image/jpeg", { quality: 0.92 });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JPG, buffer);
  console.log(`✅  Wrote JPEG OG image → ${OUT_JPG}`);

} catch (_) {
  canvasAvailable = false;
}

// ── SVG fallback ─────────────────────────────────────────────────────────────
if (!canvasAvailable) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#0A0A0A"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="${W}" height="6" fill="#FF6B00"/>

  <!-- Heading -->
  <text x="80" y="170" font-family="Arial, sans-serif" font-weight="bold" font-size="72"
        fill="#FFFFFF">HUB Surface Systems</text>

  <!-- Sub-heading -->
  <text x="80" y="230" font-family="Arial, sans-serif" font-weight="bold" font-size="36"
        fill="#FF6B00">Decorative Hardscape Solutions</text>

  <!-- Tagline -->
  <text x="80" y="280" font-family="Arial, sans-serif" font-size="28"
        fill="#888888">Municipal · Commercial · Architectural</text>

  <!-- Divider -->
  <line x1="80" y1="330" x2="${W - 80}" y2="330" stroke="#333333" stroke-width="1"/>

  <!-- Domain -->
  <text x="80" y="375" font-family="Arial, sans-serif" font-weight="bold" font-size="32"
        fill="#FFFFFF">hubss.com</text>

  <!-- Right label -->
  <text x="${W - 80}" y="375" font-family="Arial, sans-serif" font-size="28"
        fill="#888888" text-anchor="end">🍁 Canadian</text>

  <!-- Bottom bar -->
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="#FF6B00"/>
</svg>`;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_SVG, svg);
  console.log(`⚠️  canvas not installed — wrote SVG fallback → ${OUT_SVG}`);
  console.log("   Install canvas with:  npm install --save-dev canvas");
  console.log("   Then re-run this script to generate a proper JPEG.");
  process.exit(0);
}
