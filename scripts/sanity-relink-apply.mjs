#!/usr/bin/env node
/**
 * scripts/sanity-relink-apply.mjs
 *
 * APPLY PASS — uploads missing images to Sanity CDN and patches documents.
 * Run dry-run audit first: node scripts/sanity-relink-dryrun.mjs
 *
 * REQUIRES VERNON'S GO-AHEAD before running live.
 *
 * Usage:
 *   node scripts/sanity-relink-apply.mjs --dry-run    ← safe, no writes
 *   node scripts/sanity-relink-apply.mjs              ← LIVE, writes to production
 *
 * What this script does:
 *   1. Uploads product hero images  → patches product.heroImage
 *   2. Uploads application hero images → patches application.heroImage
 *   3. Uploads blog images (15 unlinked) → patches blogPost.featuredImage
 *      (deduplicates: if a blog uses the same URL as a product/app hero, reuses the asset)
 *   4. Uploads project images (skips _placeholder.svg) → patches project.image
 *
 * Safety features:
 *   - Idempotent: skips docs that already have asset refs set
 *   - Deduplication: one upload per unique file path, regardless of how many docs reference it
 *   - Dry-run mode: logs what WOULD happen without any writes
 *   - Budget check: halts if total upload size exceeds configured limit
 *   - Placeholder guard: refuses to upload _placeholder.svg files
 *
 * SANITY_API_WRITE_TOKEN must be set (Editor role or higher).
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DRY = process.argv.includes("--dry-run");

// Load .env.local if available
try {
  const envPath = path.join(ROOT, ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {}

const TOKEN = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
if (!TOKEN) {
  console.error("ERROR: SANITY_API_WRITE_TOKEN not found. Cannot apply without a write token.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: TOKEN,
});

// Budget: 950MB free tier — current usage ~97.5MB, leave headroom
const BUDGET_BYTES = 800 * 1024 * 1024; // 800MB remaining cap
let runningTotal = 0;
let uploadCount = 0;
let patchCount = 0;
let skipCount = 0;

// Deduplication: track uploaded assets by local file path
const uploadedAssets = new Map(); // localPath → { _type, asset: { _ref, _type } }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sep(char = "─", len = 80) { return char.repeat(len); }
function header(t) { return `\n${"═".repeat(80)}\n  ${t}\n${"═".repeat(80)}`; }

/** Abort-safe size check */
function checkBudget(size) {
  if (runningTotal + size > BUDGET_BYTES) {
    console.error(`\n⛔ BUDGET LIMIT: ${Math.round(runningTotal / 1024 / 1024)}MB used of ${Math.round(BUDGET_BYTES / 1024 / 1024)}MB cap`);
    process.exit(1);
  }
}

/** Upload a single file to Sanity CDN. Returns an image or file ref object.
 *  Uses deduplication cache — same local path is only uploaded once. */
async function uploadFile(urlPath, type = "image") {
  const absPath = path.join(ROOT, "public", urlPath);

  // Guard: never upload placeholder SVGs
  if (absPath.includes("_placeholder")) {
    console.log(`  ⚠ SKIP placeholder: ${urlPath}`);
    return null;
  }

  if (!fs.existsSync(absPath)) {
    console.log(`  ⚠ MISSING local file: ${urlPath}`);
    return null;
  }

  // Return cached asset if already uploaded this session
  if (uploadedAssets.has(absPath)) {
    console.log(`  ↩ reuse: ${path.basename(absPath)}`);
    return uploadedAssets.get(absPath);
  }

  const size = fs.statSync(absPath).size;
  checkBudget(size);

  if (DRY) {
    const fakeRef = { _type: type === "image" ? "image" : "file", asset: { _type: "reference", _ref: `${type}-dry-${Date.now()}-${uploadCount}` } };
    uploadedAssets.set(absPath, fakeRef);
    runningTotal += size;
    uploadCount++;
    console.log(`  [dry] upload ${path.basename(absPath)} (${Math.round(size / 1024)}KB)`);
    return fakeRef;
  }

  const stream = fs.createReadStream(absPath);
  const asset = await client.assets.upload(type, stream, { filename: path.basename(absPath) });
  const ref = { _type: type === "image" ? "image" : "file", asset: { _type: "reference", _ref: asset._id } };
  uploadedAssets.set(absPath, ref);
  runningTotal += size;
  uploadCount++;
  console.log(`  ✓ upload ${path.basename(absPath)} (${Math.round(size / 1024)}KB) → ${asset._id}`);
  return ref;
}

/** Patch a Sanity document. Skips if dry-run. */
async function patch(id, patchObj) {
  if (DRY) {
    console.log(`  [dry] patch ${id}:`, JSON.stringify(patchObj).slice(0, 100));
    patchCount++;
    return;
  }
  await client.patch(id).set(patchObj).commit();
  patchCount++;
  console.log(`  ✓ patched ${id}`);
}

// ─── 1. Product hero images ────────────────────────────────────────────────────

async function relinkProductHeroes() {
  console.log(header("1. Product hero images → heroImage field"));

  const products = await client.fetch(`
    *[_type == "product"]{
      _id, name, "slug": slug.current,
      heroImageUrl,
      "hasRef": defined(heroImage.asset)
    }
  `);

  for (const p of products) {
    if (p.hasRef) {
      console.log(`  skip (already linked): ${p.name}`);
      skipCount++;
      continue;
    }
    if (!p.heroImageUrl) {
      console.log(`  ⚠ no heroImageUrl: ${p.name}`);
      continue;
    }

    console.log(`\n  → ${p.name} (${p.slug})`);
    const ref = await uploadFile(p.heroImageUrl, "image");
    if (ref) await patch(p._id, { heroImage: ref });
  }
}

// ─── 2. Application hero images ───────────────────────────────────────────────

async function relinkApplicationHeroes() {
  console.log(header("2. Application hero images → heroImage field"));

  const apps = await client.fetch(`
    *[_type == "application"]{
      _id, name, "slug": slug.current,
      heroImageUrl,
      "hasRef": defined(heroImage.asset)
    }
  `);

  for (const a of apps) {
    if (a.hasRef) {
      console.log(`  skip (already linked): ${a.name}`);
      skipCount++;
      continue;
    }
    if (!a.heroImageUrl) {
      console.log(`  ⚠ no heroImageUrl: ${a.name}`);
      continue;
    }

    console.log(`\n  → ${a.name} (${a.slug})`);
    const ref = await uploadFile(a.heroImageUrl, "image");
    if (ref) await patch(a._id, { heroImage: ref });
  }
}

// ─── 3. Blog post featured images (15 unlinked) ──────────────────────────────

async function relinkBlogImages() {
  console.log(header("3. Blog post featured images → featuredImage field"));

  const posts = await client.fetch(`
    *[_type == "blogPost"]{
      _id, "slug": slug.current,
      featuredImageUrl,
      "hasRef": defined(featuredImage.asset)
    }
  `);

  for (const p of posts) {
    if (p.hasRef) {
      skipCount++;
      continue; // already linked — skip silently
    }
    if (!p.featuredImageUrl) {
      console.log(`  ⚠ no featuredImageUrl: ${p.slug}`);
      continue;
    }

    console.log(`\n  → ${p.slug}`);
    // Note: may reuse asset already uploaded for a product/application hero
    const ref = await uploadFile(p.featuredImageUrl, "image");
    if (ref) await patch(p._id, { featuredImage: ref });
  }
}

// ─── 4. Project images ────────────────────────────────────────────────────────

async function relinkProjectImages() {
  console.log(header("4. Project images → image field"));

  const projects = await client.fetch(`
    *[_type == "project"]{
      _id, title, city, province,
      imageUrl,
      "hasRef": defined(image.asset)
    }
  `);

  let placeholderCount = 0;
  for (const p of projects) {
    if (p.hasRef) {
      skipCount++;
      continue;
    }
    if (!p.imageUrl) {
      console.log(`  ⚠ no imageUrl: ${p.title}`);
      continue;
    }
    if (p.imageUrl.includes("_placeholder")) {
      placeholderCount++;
      console.log(`  ⚠ placeholder (needs real photo): ${p.title} — ${p.city}, ${p.province}`);
      continue;
    }

    console.log(`\n  → ${p.title} — ${p.city}, ${p.province}`);
    const ref = await uploadFile(p.imageUrl, "image");
    if (ref) await patch(p._id, { image: ref });
  }

  if (placeholderCount > 0) {
    console.log(`\n  ⚠ ${placeholderCount} projects have _placeholder.svg — these need real photos.`);
    console.log(`    Vernon to source and upload via the Studio Media Library.`);
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────

console.log(`\n${"═".repeat(80)}`);
console.log(`  Sanity Asset Relink — ${DRY ? "DRY RUN (no writes)" : "⚠ LIVE — WRITES TO PRODUCTION"}`);
console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1"}`);
console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"}`);
if (!DRY) {
  console.log(`\n  RUNNING LIVE. Ctrl+C now to abort.`);
  console.log(`  Waiting 5 seconds...`);
  await new Promise(r => setTimeout(r, 5000));
}
console.log(`${"═".repeat(80)}`);

await relinkProductHeroes();
await relinkApplicationHeroes();
await relinkBlogImages();
await relinkProjectImages();

const totalMB = (runningTotal / 1024 / 1024).toFixed(1);
console.log(`\n${"═".repeat(80)}`);
console.log(`  ${DRY ? "DRY RUN" : "APPLY"} COMPLETE`);
console.log(`  Files uploaded:   ${uploadCount}`);
console.log(`  Documents patched: ${patchCount}`);
console.log(`  Documents skipped: ${skipCount} (already linked)`);
console.log(`  Total upload size: ${totalMB} MB`);
console.log(`  Unique asset uploads: ${uploadedAssets.size} (deduplication saved ${uploadCount - uploadedAssets.size} re-uploads)`);
console.log(`${"═".repeat(80)}\n`);

if (!DRY) {
  console.log("  Run the dry-run audit to verify:");
  console.log("  node scripts/sanity-relink-dryrun.mjs\n");
}
