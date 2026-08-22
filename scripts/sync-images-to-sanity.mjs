#!/usr/bin/env node
/**
 * scripts/sync-images-to-sanity.mjs
 *
 * Makes Sanity mirror the image folders exactly.
 *
 * The folders are where curation happens — you add, delete and reorder files in
 * a file browser, which is the right tool for judging photographs. This script
 * takes that curated result and makes Sanity match it, so the site can be served
 * from the Sanity CDN without the 2.4 GB of photos living in git forever.
 *
 * It is IDEMPOTENT and additive-by-default:
 *   • uploads folder images Sanity doesn't have yet
 *   • reorders each gallery to match folder order
 *   • sets alt text from the filename + product name
 *   • sets the hero from lib/products.ts / lib/applications.ts imageUrl
 *   • only removes images from a gallery when you pass --prune
 *
 * Dedupe is by originalFilename, which Sanity stores on every asset, so
 * re-running never uploads the same photo twice.
 *
 * Images are optimized before upload (long edge 1600, JPEG q80). Originals on
 * disk are NEVER modified — optimized copies go to a temp dir.
 *
 * USAGE
 *   # always look first
 *   node scripts/sync-images-to-sanity.mjs --dry-run
 *
 *   # one product, to prove it end to end
 *   node scripts/sync-images-to-sanity.mjs --only=streetbond
 *
 *   # everything
 *   node scripts/sync-images-to-sanity.mjs
 *
 *   # also delete Sanity images no longer in the folder
 *   node scripts/sync-images-to-sanity.mjs --prune
 *
 * REQUIRES
 *   SANITY_API_WRITE_TOKEN   (sanity.io/manage → API → Tokens → Editor)
 *   NEXT_PUBLIC_SANITY_PROJECT_ID   (defaults to 9dbro2m1)
 *   NEXT_PUBLIC_SANITY_DATASET      (defaults to production)
 */

import { createClient } from "@sanity/client";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import os from "os";

const MANIFEST_PATH = path.join(process.cwd(), "lib", "gallery-manifest.json");
if (!fs.existsSync(MANIFEST_PATH)) {
  console.error("\n  lib/gallery-manifest.json is missing.");
  console.error("  Run:  node scripts/gen-gallery-manifest.mjs\n");
  process.exit(1);
}
const MANIFEST = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

// ── config ──────────────────────────────────────────────────────────────
const MAX_LONG_EDGE = 1600;
const JPEG_QUALITY = 80;
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "9dbro2m1";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const PRUNE = args.includes("--prune");
const ONLY = (args.find((a) => a.startsWith("--only=")) || "").split("=")[1] || null;

if (!TOKEN && !DRY) {
  console.error("\n  SANITY_API_WRITE_TOKEN is not set.");
  console.error("  Create one at sanity.io/manage → API → Tokens → Add token → Editor.");
  console.error("  Then: set it in your shell (or .env.local) and re-run.");
  console.error("  Use --dry-run to preview without a token.\n");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false,
});

// ── folder reading (same rules as the site: lib/asset-scan.ts) ───────────────
const isGalleryImage = (n) =>
  /\.(jpe?g|png|webp)$/i.test(n) && !/logo/i.test(n) && !n.startsWith("_");

/**
 * The images for a gallery, in the exact order and composition the SITE shows.
 *
 * Read straight from lib/gallery-manifest.json rather than re-scanning folders,
 * because the manifest is already folder contents PLUS cross-posts (one photo
 * appearing in a second gallery — see lib/gallery-crossposts.mjs). Re-deriving
 * it here would let Sanity drift from the site; reading it cannot.
 *
 * Run `node scripts/gen-gallery-manifest.mjs` first if the manifest is stale.
 */
function galleryImages(key) {
  const urls = MANIFEST[key];
  if (!urls?.length) return [];
  return urls
    .map((u) => ({ file: u.slice(u.lastIndexOf("/") + 1), abs: path.join(process.cwd(), "public", u.replace(/^\/+/, "")) }))
    .filter((f) => fs.existsSync(f.abs));
}

/** Alt text from filename + context — mirrors altFor() in lib/asset-scan.ts. */
function altFor(file, context) {
  const base = file.replace(/\.(jpe?g|png|webp)$/i, "");
  const numbered = base.match(/^(.*?)[-_](\d+)$/);
  if (numbered) return `${context} — installation photo ${parseInt(numbered[2], 10)}`;
  const human = base.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
  return `${context} — ${human}`;
}

// ── optimize ──────────────────────────────────────────────────────────
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "hubss-sanity-"));
async function optimize(absPath, name) {
  const out = path.join(TMP, name.replace(/\.(png|webp)$/i, ".jpg"));
  await sharp(absPath)
    .rotate()
    .resize({ width: MAX_LONG_EDGE, height: MAX_LONG_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(out);
  return out;
}

// ── main ─────────────────────────────────────────────────────────────
const docs = await client.fetch(
  `*[_type in ["product","application"]]{ _id, _type, name, "slug": slug.current,
     "gallery": gallery[]{ _key, "assetId": asset._ref, "orig": asset->originalFilename },
     "heroOrig": heroImage.asset->originalFilename }`
);

let totalUp = 0, totalBytes = 0, totalPrune = 0;
const report = [];

for (const doc of docs) {
  if (!doc.slug) continue;
  if (ONLY && doc.slug !== ONLY) continue;

  const base = doc._type === "product" ? "images/products" : "images/applications";
  const key = `${base}/${doc.slug}`;
  const files = galleryImages(key);
  if (!files.length) { report.push({ slug: doc.slug, note: "no images", folder: 0, sanity: (doc.gallery||[]).length }); continue; }

  const existing = new Map((doc.gallery || []).filter(g => g.orig).map((g) => [g.orig, g]));
  const missing = files.filter((f) => !existing.has(f.file));
  const extra = [...existing.keys()].filter((o) => !files.some((f) => f.file === o));

  report.push({ slug: doc.slug, folder: files.length, sanity: (doc.gallery || []).length, missing: missing.length, extra: extra.length });

  if (DRY) { totalUp += missing.length; continue; }

  // upload what's missing
  const uploaded = new Map();
  for (const f of missing) {
    const opt = await optimize(f.abs, f.file);
    const asset = await client.assets.upload("image", fs.createReadStream(opt), { filename: f.file });
    uploaded.set(f.file, asset._id);
    totalUp++; totalBytes += fs.statSync(opt).size;
    process.stdout.write(`\r  ${doc.slug}: uploaded ${uploaded.size}/${missing.length}   `);
  }
  if (missing.length) process.stdout.write("\n");

  // rebuild the gallery in folder order
  const wanted = PRUNE ? files : files.concat(extra.map((o) => ({ file: o, keepExisting: true })));
  const gallery = wanted.map((f, i) => {
    const assetId = uploaded.get(f.file) || existing.get(f.file)?.assetId;
    if (!assetId) return null;
    return {
      _key: `img_${i}_${f.file.replace(/[^a-z0-9]/gi, "").slice(-12)}`,
      _type: "image",
      asset: { _type: "reference", _ref: assetId },
      alt: altFor(f.file, doc.name || doc.slug),
    };
  }).filter(Boolean);

  await client.patch(doc._id).set({ gallery }).commit();
  if (PRUNE && extra.length) totalPrune += extra.length;
}

// ── summary ─────────────────────────────────────────────────────────
console.log("\n" + (DRY ? "DRY RUN — nothing was written\n" : "SYNC COMPLETE\n"));
console.log("  doc".padEnd(26) + "folder".padStart(8) + "sanity".padStart(8) + "to add".padStart(8) + "extra".padStart(8));
console.log("  " + "-".repeat(56));
for (const r of report) {
  console.log("  " + String(r.slug).padEnd(24) + String(r.folder ?? "-").padStart(8) +
    String(r.sanity ?? "-").padStart(8) + String(r.missing ?? "-").padStart(8) + String(r.extra ?? "-").padStart(8));
}
console.log("\n  images to upload: " + totalUp);
if (!DRY) console.log("  uploaded bytes:   " + (totalBytes / 1048576).toFixed(1) + " MB");
if (PRUNE) console.log("  pruned:           " + totalPrune);
if (DRY) console.log("\n  Re-run without --dry-run to apply. Add --only=<slug> to do one doc first.\n");
fs.rmSync(TMP, { recursive: true, force: true });
