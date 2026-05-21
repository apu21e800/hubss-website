#!/usr/bin/env node
/**
 * scripts/sanity-wire-references.mjs
 *
 * Resolves relatedApplicationSlugs / relatedProductSlugs (string arrays set by
 * migration) to proper Sanity document _ref arrays and patches the schema-defined
 * relatedApplications / relatedProducts reference fields.
 *
 * DRY-RUN by default. Pass --apply to write.
 *
 * Usage:
 *   node scripts/sanity-wire-references.mjs           ← dry-run
 *   node scripts/sanity-wire-references.mjs --apply   ← live
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

const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const client = createClient({
  projectId: "9dbro2m1", dataset: "production", apiVersion: "2024-01-01",
  useCdn: false, token: TOKEN,
});

const sep = () => "─".repeat(80);

// Build slug→_id lookup tables
const [appDocs, prodDocs] = await Promise.all([
  client.fetch('*[_type=="application"]{"slug":slug.current,"_id":_id}'),
  client.fetch('*[_type=="product"]{"slug":slug.current,"_id":_id}'),
]);
const appById = Object.fromEntries(appDocs.map(d => [d.slug, d._id]));
const prodById = Object.fromEntries(prodDocs.map(d => [d.slug, d._id]));

console.log(`\n  Lookup tables: ${Object.keys(appById).length} applications, ${Object.keys(prodById).length} products`);
console.log(`  Mode: ${APPLY ? "⚠ LIVE APPLY" : "DRY RUN"}`);
console.log(sep());

// Products: wire relatedApplicationSlugs → relatedApplications references
const products = await client.fetch(
  '*[_type=="product" && defined(relatedApplicationSlugs)]{_id,name,"slug":slug.current,relatedApplicationSlugs}'
);
let prodPatched = 0, prodSkipped = 0, prodMissing = 0;

for (const p of products) {
  const slugs = p.relatedApplicationSlugs ?? [];
  const refs = [];
  const missing = [];
  for (const slug of slugs) {
    const id = appById[slug];
    if (id) refs.push({ _type: "reference", _ref: id, _key: slug });
    else missing.push(slug);
  }
  if (missing.length) {
    console.log(`  ⚠ ${p.name}: unknown app slugs: ${missing.join(", ")}`);
    prodMissing++;
  }
  if (refs.length === 0) { prodSkipped++; continue; }
  console.log(`  → ${p.name}: ${refs.length} related applications`);
  if (APPLY) await client.patch(p._id).set({ relatedApplications: refs }).commit();
  prodPatched++;
}
console.log(`  Products: ${prodPatched} patched, ${prodSkipped} no refs, ${prodMissing} with missing slugs`);

// Applications: wire relatedProductSlugs → relatedProducts references
const apps = await client.fetch(
  '*[_type=="application" && defined(relatedProductSlugs)]{_id,name,"slug":slug.current,relatedProductSlugs}'
);
let appPatched = 0, appSkipped = 0, appMissing = 0;

for (const a of apps) {
  const slugs = a.relatedProductSlugs ?? [];
  const refs = [];
  const missing = [];
  for (const slug of slugs) {
    const id = prodById[slug];
    if (id) refs.push({ _type: "reference", _ref: id, _key: slug });
    else missing.push(slug);
  }
  if (missing.length) {
    console.log(`  ⚠ ${a.name}: unknown product slugs: ${missing.join(", ")}`);
    appMissing++;
  }
  if (refs.length === 0) { appSkipped++; continue; }
  console.log(`  → ${a.name}: ${refs.length} related products`);
  if (APPLY) await client.patch(a._id).set({ relatedProducts: refs }).commit();
  appPatched++;
}
console.log(`  Applications: ${appPatched} patched, ${appSkipped} no refs, ${appMissing} with missing slugs`);

if (!APPLY) console.log(`\n  Run with --apply to write to production.`);
else console.log(`\n  ✓ Reference wiring complete.`);
