#!/usr/bin/env node
/**
 * scripts/sanity-strip-legacy-fields.mjs
 *
 * Two cleanups in one script — run after galleries + references are wired:
 *
 * A. Strip unknown-field warnings: unset galleryUrls, relatedApplicationSlugs,
 *    relatedProductSlugs (migration artifacts not in schema → "Unknown fields found").
 *
 * B. Null redundant legacy URL strings (heroImageUrl, featuredImageUrl, imageUrl)
 *    ONLY on docs where the Sanity asset field is already populated.
 *    Never touches the 28 placeholder projects (imageUrl = _placeholder.svg).
 *
 * Usage:
 *   node scripts/sanity-strip-legacy-fields.mjs           ← dry-run
 *   node scripts/sanity-strip-legacy-fields.mjs --apply   ← live
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APPLY = process.argv.includes("--apply");

try {
  const envLines = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n");
  for (const l of envLines) {
    const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const client = createClient({
  projectId: "9dbro2m1", dataset: "production", apiVersion: "2024-01-01",
  useCdn: false, token: process.env.SANITY_API_WRITE_TOKEN,
});

const sep = "─".repeat(80);
const mode = APPLY ? "⚠ LIVE APPLY" : "DRY RUN";

async function unsetFields(docId, fields) {
  if (!APPLY) return;
  await client.patch(docId).unset(fields).commit();
}
async function nullFields(docId, fieldMap) {
  if (!APPLY) return;
  await client.patch(docId).set(fieldMap).commit();
}

// ── A. Strip unknown fields ───────────────────────────────────────────────────

console.log(`\n${"═".repeat(80)}\n  A. Strip unknown-field warnings  [${mode}]\n${sep}`);

const [prods, apps] = await Promise.all([
  client.fetch('*[_type=="product"]{_id,name,"hasGalleryUrls":defined(galleryUrls),"hasRelSlugs":defined(relatedApplicationSlugs)}'),
  client.fetch('*[_type=="application"]{_id,name,"hasGalleryUrls":defined(galleryUrls),"hasRelSlugs":defined(relatedProductSlugs)}'),
]);

let stripCount = 0;
for (const p of prods) {
  const toUnset = [];
  if (p.hasGalleryUrls) toUnset.push("galleryUrls");
  if (p.hasRelSlugs) toUnset.push("relatedApplicationSlugs");
  if (toUnset.length) {
    console.log(`  → product  ${p.name}: unset [${toUnset.join(", ")}]`);
    await unsetFields(p._id, toUnset);
    stripCount++;
  }
}
for (const a of apps) {
  const toUnset = [];
  if (a.hasGalleryUrls) toUnset.push("galleryUrls");
  if (a.hasRelSlugs) toUnset.push("relatedProductSlugs");
  if (toUnset.length) {
    console.log(`  → app      ${a.name}: unset [${toUnset.join(", ")}]`);
    await unsetFields(a._id, toUnset);
    stripCount++;
  }
}
console.log(`  ${stripCount} documents cleaned (${APPLY ? "done" : "dry-run — no writes"})`);

// ── B. Null redundant legacy URL strings ──────────────────────────────────────

console.log(`\n${"═".repeat(80)}\n  B. Null redundant legacy URL strings  [${mode}]\n${sep}`);

let nullCount = 0;

// Products: null heroImageUrl where heroImage.asset is set
const prodsWithHero = await client.fetch(
  '*[_type=="product" && defined(heroImage.asset) && defined(heroImageUrl) && heroImageUrl!=""]{_id,name,heroImageUrl}'
);
for (const p of prodsWithHero) {
  console.log(`  → product  ${p.name}: null heroImageUrl (was "${p.heroImageUrl}")`);
  await nullFields(p._id, { heroImageUrl: null });
  nullCount++;
}

// Applications: null heroImageUrl where heroImage.asset is set
const appsWithHero = await client.fetch(
  '*[_type=="application" && defined(heroImage.asset) && defined(heroImageUrl) && heroImageUrl!=""]{_id,name,heroImageUrl}'
);
for (const a of appsWithHero) {
  console.log(`  → app      ${a.name}: null heroImageUrl (was "${a.heroImageUrl}")`);
  await nullFields(a._id, { heroImageUrl: null });
  nullCount++;
}

// Blog posts: null featuredImageUrl where featuredImage.asset is set
const blogsWithFeatured = await client.fetch(
  '*[_type=="blogPost" && defined(featuredImage.asset) && defined(featuredImageUrl) && featuredImageUrl!=""]{_id,"slug":slug.current,featuredImageUrl}'
);
for (const b of blogsWithFeatured) {
  console.log(`  → blog     ${b.slug}: null featuredImageUrl`);
  await nullFields(b._id, { featuredImageUrl: null });
  nullCount++;
}

// Projects: null imageUrl ONLY where image.asset is set AND imageUrl is NOT a placeholder
const projectsWithImage = await client.fetch(
  '*[_type=="project" && defined(image.asset) && defined(imageUrl) && imageUrl!="" && !defined(imageUrl) == false && !(imageUrl match "*placeholder*")]{_id,title,imageUrl}'
);
for (const p of projectsWithImage) {
  console.log(`  → project  ${p.title}: null imageUrl (was "${p.imageUrl}")`);
  await nullFields(p._id, { imageUrl: null });
  nullCount++;
}

console.log(`\n  ${nullCount} legacy URL strings nulled (${APPLY ? "done" : "dry-run — no writes"})`);
console.log(`\n  Note: 28 placeholder projects left untouched (still need real photos)`);

if (!APPLY) console.log(`\n  Run with --apply to write to production.`);
else {
  console.log(`\n  ✓ Legacy field cleanup complete.`);
  console.log(`    "Unknown fields found" warning should now be gone in Studio.`);
  console.log(`    "Leave blank once set" advisory fields are cleared.`);
}
