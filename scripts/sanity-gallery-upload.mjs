#!/usr/bin/env node
/**
 * scripts/sanity-gallery-upload.mjs
 *
 * Optimizes and uploads product + application gallery images to Sanity CDN,
 * then patches the `gallery` array field on each doc.
 *
 * Steps:
 *   1. Fetch galleryUrls[] from all product/application docs in Sanity
 *   2. Optimize each image with sharp: max 1600px long edge, JPEG q80, ~250KB target
 *   3. Dry-run: project total optimized size and report per-doc breakdown
 *   4. If fits under FREE_TIER_LIMIT → upload + patch
 *      If still over → cap to MAX_PER_DOC images per doc and report trims
 *   5. Set alt text: "{Doc name} installation photo {n}"
 *   6. Originals are NEVER modified — optimized copies written to os.tmpdir()
 *
 * Usage:
 *   node scripts/sanity-gallery-upload.mjs --dry-run   ← project size, no writes
 *   node scripts/sanity-gallery-upload.mjs             ← LIVE (Vernon approved)
 */

import { createClient } from "@sanity/client";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DRY = process.argv.includes("--dry-run");

// Load .env.local
try {
  const envLines = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n");
  for (const l of envLines) {
    const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
if (!TOKEN) { console.error("ERROR: SANITY_API_WRITE_TOKEN not set"); process.exit(1); }

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: "production", apiVersion: "2024-01-01", useCdn: false, token: TOKEN,
});

// ── Config ─────────────────────────────────────────────────────────────────────
// Current usage ~150 MB (heroes + PDFs + blog). Free tier = 950 MB.
// Target: upload ≤ 550 MB so total stays ≤ 700 MB (comfortable safety buffer).
const FREE_TIER_LIMIT_MB = 550;
const MAX_LONG_EDGE = 1600;
const JPEG_QUALITY = 80;
const MAX_PER_DOC = Infinity; // reduced only if needed to fit tier

// Temp dir for optimized copies (originals untouched)
const TMP = path.join(os.tmpdir(), "sanity-gallery-opt-" + Date.now());
fs.mkdirSync(TMP, { recursive: true });

// ── Helpers ────────────────────────────────────────────────────────────────────

function sep(len = 80) { return "─".repeat(len); }
function header(t) { return `\n${"═".repeat(80)}\n  ${t}\n${"═".repeat(80)}`; }

function slugKey(s) { return s.replace(/[^a-z0-9]/gi, "_").slice(0, 40); }

/** Optimize one image with sharp → writes to TMP, returns output path + size.
 *  Falls back through multiple strategies for non-standard/corrupted source files. */
async function optimize(srcPath) {
  const hash = crypto.createHash("md5").update(srcPath).digest("hex").slice(0, 8);
  const outPath = path.join(TMP, hash + ".jpg");
  if (fs.existsSync(outPath)) return { outPath, size: fs.statSync(outPath).size };

  const pipeline = sharp(srcPath, { failOn: "none" })   // tolerate corrupted headers
    .rotate()
    .resize(MAX_LONG_EDGE, MAX_LONG_EDGE, { fit: "inside", withoutEnlargement: true });

  // Strategy 1: standard JPEG (most compatible, handles sequential JPEG)
  try {
    await pipeline.clone().jpeg({ quality: JPEG_QUALITY }).toFile(outPath);
    return { outPath, size: fs.statSync(outPath).size };
  } catch {}

  // Strategy 2: force PNG intermediary then convert (handles malformed JPEGs)
  try {
    const pngPath = outPath.replace(".jpg", ".png");
    await sharp(srcPath, { failOn: "none" })
      .rotate()
      .resize(MAX_LONG_EDGE, MAX_LONG_EDGE, { fit: "inside", withoutEnlargement: true })
      .png()
      .toFile(pngPath);
    await sharp(pngPath).jpeg({ quality: JPEG_QUALITY }).toFile(outPath);
    fs.unlinkSync(pngPath);
    return { outPath, size: fs.statSync(outPath).size };
  } catch {}

  // Strategy 3: copy original (no optimization, but no failure either)
  fs.copyFileSync(srcPath, outPath);
  console.log(`    ⚠ Could not optimize ${path.basename(srcPath)} — using original`);
  return { outPath, size: fs.statSync(outPath).size };
}

let uploadCount = 0;
let patchCount = 0;
let totalOptBytes = 0;

// Resume checkpoint — tracks which doc slugs already have gallery patched this session
const CHECKPOINT = path.join(__dirname, ".gallery-checkpoint.json");
let doneDocSlugs = new Set();
try { doneDocSlugs = new Set(JSON.parse(fs.readFileSync(CHECKPOINT, "utf8"))); } catch {}
function markDone(slug) {
  doneDocSlugs.add(slug);
  fs.writeFileSync(CHECKPOINT, JSON.stringify([...doneDocSlugs]));
}

/** Sleep helper */
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Upload with retry + rate-limiting */
async function uploadOptimized(outPath, originalName) {
  if (DRY) {
    uploadCount++;
    return { _type: "image", asset: { _type: "reference", _ref: `dry-${Date.now()}-${uploadCount}` } };
  }
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await sleep(200); // 200ms between uploads = max 5/second, well under 25/s limit
      const stream = fs.createReadStream(outPath);
      const asset = await client.assets.upload("image", stream, { filename: originalName });
      uploadCount++;
      return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    } catch (err) {
      const status = err?.response?.statusCode ?? 0;
      if (attempt < 5 && (status === 502 || status === 503 || status === 429 || status === 0)) {
        const delay = attempt * 2000; // 2s, 4s, 6s, 8s backoff
        process.stdout.write(`\n    ⚠ attempt ${attempt} failed (${status}) — retry in ${delay/1000}s...\r`);
        await sleep(delay);
      } else { throw err; }
    }
  }
}

/** Patch a doc's gallery field with retry */
async function patchGallery(docId, galleryItems) {
  if (DRY) { patchCount++; return; }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await client.patch(docId).set({ gallery: galleryItems }).commit();
      patchCount++;
      return;
    } catch (err) {
      if (attempt < 3) { await sleep(attempt * 1000); }
      else throw err;
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

console.log(header(`Sanity Gallery Upload — ${DRY ? "DRY RUN" : "⚠ LIVE"}`));
console.log(`  Project: 9dbro2m1  |  Max per image: ${MAX_LONG_EDGE}px / JPEG ${JPEG_QUALITY}`);
if (!DRY) {
  console.log("\n  LIVE MODE. Ctrl+C to abort. Starting in 5s...");
  await new Promise(r => setTimeout(r, 5000));
}

// 1. Fetch docs
const [products, applications] = await Promise.all([
  client.fetch('*[_type=="product" && defined(galleryUrls)]{_id,name,"slug":slug.current,galleryUrls,"hasGallery":count(gallery)>0}'),
  client.fetch('*[_type=="application" && defined(galleryUrls)]{_id,name,"slug":slug.current,galleryUrls,"hasGallery":count(gallery)>0}'),
]);

// Dedup products (MMAX duplicate observed)
const seen = new Set();
const uniqueProducts = products.filter(p => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true; });

const allDocs = [
  ...uniqueProducts.map(d => ({ ...d, docType: "product" })),
  ...applications.map(d => ({ ...d, docType: "application" })),
];

console.log(`\n  Docs to process: ${uniqueProducts.length} products + ${applications.length} applications = ${allDocs.length} total`);

// 2. Project optimized size (always done, even in live mode)
console.log(header("Phase 1 — Optimizing (measuring size)"));

let projectedMB = 0;
const docPlans = [];

for (const doc of allDocs) {
  const urls = (doc.galleryUrls ?? []).filter(Boolean);
  if (urls.length === 0) continue;

  let docBytes = 0;
  const items = [];
  let missing = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const srcPath = path.join(ROOT, "public", url);
    if (!fs.existsSync(srcPath)) { missing++; continue; }
    const { outPath, size } = await optimize(srcPath);
    docBytes += size;
    items.push({ url, srcPath, outPath, size, n: i + 1 });
  }

  const docMB = (docBytes / 1024 / 1024).toFixed(1);
  if (missing) console.log(`  ⚠ ${doc.name}: ${missing} files missing (skipped)`);
  docPlans.push({ doc, items, docMB: parseFloat(docMB), missing });
  projectedMB += parseFloat(docMB);
}

docPlans.sort((a, b) => b.docMB - a.docMB);
console.log(`\n  Optimized size per doc (largest first):`);
for (const p of docPlans) {
  const flag = p.doc.hasGallery ? " [already has gallery]" : "";
  console.log(`    ${p.docMB.toFixed(1).padStart(6)} MB — ${p.items.length} imgs — ${p.doc.name}${flag}`);
}

console.log(`\n  ─────────────────────────────────────────`);
console.log(`  Projected optimized total: ${projectedMB.toFixed(0)} MB`);
console.log(`  Free-tier upload limit:    ${FREE_TIER_LIMIT_MB} MB`);

// 3. Decide: trim or proceed?
let trimmed = false;
if (projectedMB > FREE_TIER_LIMIT_MB) {
  console.log(`\n  ⚠ Over limit — trimming to fit.`);
  // Sort by docMB desc (already done). Drop images from largest docs until under limit.
  // We trim the tail of each doc's image list (keep first N images).
  let current = projectedMB;
  for (const plan of docPlans) {
    if (current <= FREE_TIER_LIMIT_MB) break;
    // Binary search: how many images can we keep?
    const items = plan.items;
    let keep = items.length;
    while (keep > 1 && current > FREE_TIER_LIMIT_MB) {
      const removedSize = items[keep - 1].size / 1024 / 1024;
      current -= removedSize;
      keep--;
    }
    if (keep < items.length) {
      const trimCount = items.length - keep;
      console.log(`    Trim ${trimCount} of ${items.length} from ${plan.doc.name} (keep first ${keep})`);
      plan.items = items.slice(0, keep);
      plan.trimCount = trimCount;
      trimmed = true;
    }
  }
  projectedMB = current;
  console.log(`  Final projected total after trim: ${projectedMB.toFixed(0)} MB`);
} else {
  console.log(`  ✓ Under limit — proceeding with all ${allDocs.length} docs, all images`);
}

if (DRY) {
  console.log(header("DRY RUN SUMMARY"));
  console.log(`  Projected upload: ${projectedMB.toFixed(0)} MB`);
  const total = docPlans.reduce((s, p) => s + p.items.length, 0);
  console.log(`  Total images: ${total}`);
  for (const p of docPlans.filter(p => p.trimCount)) {
    console.log(`  ⚠ Trim: ${p.doc.name} — keep ${p.items.length}, drop ${p.trimCount}`);
  }
  console.log(`\n  Run without --dry-run to proceed.`);
  fs.rmSync(TMP, { recursive: true, force: true });
  process.exit(0);
}

// 4. Upload + patch
console.log(header("Phase 2 — Upload + Patch"));

for (const plan of docPlans) {
  if (plan.items.length === 0) continue;
  if (plan.doc.hasGallery || doneDocSlugs.has(plan.doc.slug)) {
    console.log(`\n  skip ${plan.doc.name} — gallery already populated`);
    continue;
  }

  console.log(`\n  → ${plan.doc.name} (${plan.doc.docType}, ${plan.items.length} images, ${plan.docMB} MB)`);
  const galleryItems = [];

  for (const item of plan.items) {
    const baseName = path.basename(item.url);
    const ref = await uploadOptimized(item.outPath, baseName);
    const altText = `${plan.doc.name} installation photo ${item.n}`;
    galleryItems.push({
      _type: "image",
      _key: `${slugKey(plan.doc.slug)}_${String(item.n).padStart(3, "0")}`,
      ...ref,
      alt: altText,
      caption: "",
    });
    totalOptBytes += item.size;
    process.stdout.write(`    [${item.n}/${plan.items.length}] ${baseName} (${Math.round(item.size / 1024)}KB) ✓\r`);
  }
  process.stdout.write("\n");
  await patchGallery(plan.doc._id, galleryItems);
  markDone(plan.doc.slug); // save to checkpoint so re-run skips this doc
  console.log(`    ✓ gallery patched — ${galleryItems.length} images`);
}

// 5. Cleanup temp
fs.rmSync(TMP, { recursive: true, force: true });

// 6. Final report
console.log(header("GALLERY UPLOAD COMPLETE"));
console.log(`  Files uploaded:    ${uploadCount}`);
console.log(`  Docs patched:      ${patchCount}`);
console.log(`  Total uploaded:    ${(totalOptBytes / 1024 / 1024).toFixed(0)} MB (optimized)`);
if (trimmed) {
  const trimDocs = docPlans.filter(p => p.trimCount);
  console.log(`  Docs trimmed:      ${trimDocs.length}`);
  for (const p of trimDocs) {
    console.log(`    ${p.doc.name}: kept ${p.items.length}, dropped ${p.trimCount}`);
  }
}
console.log(`\n  Verify: node scripts/sanity-relink-dryrun.mjs`);
