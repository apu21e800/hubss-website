#!/usr/bin/env node
/**
 * scripts/sanity-relink-dryrun.mjs
 *
 * DRY-RUN ONLY — reads Sanity + local filesystem, never writes.
 *
 * Diagnosis: run-upload.mjs only uploaded blog featured images and PDFs.
 * Product heroImage, application heroImage, and project image fields were
 * never uploaded to Sanity CDN — they still hold legacy URL strings.
 *
 * This script audits:
 *   1. What Sanity assets actually exist (imageAsset + fileAsset)
 *   2. Which documents are already linked vs still holding URL strings
 *   3. For unlinked docs: whether the source file exists locally + match confidence
 *   4. The GROQ field-name bug: run-upload verified against heroImage.asset
 *      (wrong for blogPost — correct field is featuredImage.asset)
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=<token> node scripts/sanity-relink-dryrun.mjs
 *   # or
 *   node scripts/sanity-relink-dryrun.mjs   # uses token from .env.local if dotenv available
 *
 * Read-only: uses the write token in read mode (no writes performed).
 * Output: stdout summary + JSON report written to scripts/relink-report.json
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Load .env.local if available (for local runs)
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
  console.error("ERROR: SANITY_API_WRITE_TOKEN not found in env or .env.local");
  console.error("Export it or add it to .env.local before running.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: TOKEN,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function localExists(urlPath) {
  if (!urlPath) return false;
  if (urlPath.startsWith("http")) return null; // external, can't check
  const abs = path.join(ROOT, "public", urlPath);
  return fs.existsSync(abs);
}

function fileSize(urlPath) {
  try {
    const abs = path.join(ROOT, "public", urlPath);
    return Math.round(fs.statSync(abs).size / 1024) + "KB";
  } catch { return "?"; }
}

// Confidence rating for a potential upload+link
function confidence(urlPath, exists) {
  if (!urlPath) return "NONE";
  if (urlPath.startsWith("http")) return "EXTERNAL"; // hosted elsewhere, skip
  if (!exists) return "LOW-missing-local"; // file doesn't exist locally
  return "HIGH"; // file exists, clean 1:1 URL→doc mapping
}

function sep(char = "─", len = 80) { return char.repeat(len); }
function header(title) { return `\n${sep("═")}\n  ${title}\n${sep("═")}`; }
function subheader(title) { return `\n${sep()}\n  ${title}\n${sep()}`; }

// ─── Phase 1: Inventory Sanity assets ─────────────────────────────────────────

async function auditAssets() {
  const [images, files] = await Promise.all([
    client.fetch(`*[_type == "sanity.imageAsset"]{_id, originalFilename, size, url}`),
    client.fetch(`*[_type == "sanity.fileAsset"]{_id, originalFilename, size, url}`),
  ]);

  return { images, files };
}

// ─── Phase 2: Audit each doc type ─────────────────────────────────────────────

async function auditBlogPosts() {
  // CRITICAL BUG NOTE: run-upload.mjs used defined(heroImage.asset) for blog posts.
  // Correct field is featuredImage (not heroImage). Separate counts below clarify.
  const posts = await client.fetch(`
    *[_type == "blogPost"]{
      _id,
      "slug": slug.current,
      featuredImageUrl,
      "hasFeaturedImageRef": defined(featuredImage.asset),
      "hasFeaturedImageUrl": defined(featuredImageUrl) && featuredImageUrl != "",
      "incorrectField": defined(heroImage.asset)
    }
  `);
  return posts;
}

async function auditProducts() {
  const products = await client.fetch(`
    *[_type == "product"]{
      _id,
      name,
      "slug": slug.current,
      heroImageUrl,
      "hasHeroRef": defined(heroImage.asset),
      "hasHeroUrl": defined(heroImageUrl) && heroImageUrl != "",
      "galleryCount": count(gallery),
      "galleryUrlsCount": count(galleryUrls),
      "docCount": count(documents),
      "docWithAsset": count(documents[defined(fileAsset.asset)]),
      "docWithPath": count(documents[defined(filePath) && filePath != ""])
    }
  `);
  return products;
}

async function auditApplications() {
  const apps = await client.fetch(`
    *[_type == "application"]{
      _id,
      name,
      "slug": slug.current,
      heroImageUrl,
      "hasHeroRef": defined(heroImage.asset),
      "hasHeroUrl": defined(heroImageUrl) && heroImageUrl != "",
      "galleryCount": count(gallery),
      "galleryUrlsCount": count(galleryUrls)
    }
  `);
  return apps;
}

async function auditProjects() {
  const projects = await client.fetch(`
    *[_type == "project"]{
      _id,
      title,
      city,
      province,
      imageUrl,
      "hasImageRef": defined(image.asset),
      "hasImageUrl": defined(imageUrl) && imageUrl != ""
    }
  `);
  return projects;
}

async function auditPages() {
  const pages = await client.fetch(`
    *[_type == "page"]{
      _id,
      title,
      "slug": slug.current,
      "heroImageRefs": [
        defined(homepageHero.heroImage1.asset),
        defined(homepageHero.heroImage2.asset),
        defined(homepageHero.heroImage3.asset)
      ]
    }
  `);
  return pages;
}

// ─── Phase 3: Local file verification for unlinked docs ───────────────────────

function planProductUploads(products) {
  return products.map(p => {
    const exists = localExists(p.heroImageUrl);
    return {
      docId: p._id,
      name: p.name,
      slug: p.slug,
      field: "heroImage",
      urlString: p.heroImageUrl,
      localExists: exists,
      size: exists ? fileSize(p.heroImageUrl) : null,
      confidence: confidence(p.heroImageUrl, exists),
      action: p.hasHeroRef ? "SKIP (already linked)" : "NEEDS_UPLOAD_AND_LINK",
    };
  });
}

function planApplicationUploads(apps) {
  return apps.map(a => {
    const exists = localExists(a.heroImageUrl);
    return {
      docId: a._id,
      name: a.name,
      slug: a.slug,
      field: "heroImage",
      urlString: a.heroImageUrl,
      localExists: exists,
      size: exists ? fileSize(a.heroImageUrl) : null,
      confidence: confidence(a.heroImageUrl, exists),
      action: a.hasHeroRef ? "SKIP (already linked)" : "NEEDS_UPLOAD_AND_LINK",
    };
  });
}

function planProjectUploads(projects) {
  return projects.map(p => {
    const exists = localExists(p.imageUrl);
    return {
      docId: p._id,
      title: p.title,
      city: p.city,
      province: p.province,
      field: "image",
      urlString: p.imageUrl,
      localExists: exists,
      size: exists ? fileSize(p.imageUrl) : null,
      confidence: confidence(p.imageUrl, exists),
      action: p.hasImageRef ? "SKIP (already linked)" :
              !p.imageUrl ? "NO_IMAGE_URL (nothing to link)" :
              "NEEDS_UPLOAD_AND_LINK",
    };
  });
}

function planBlogRecheck(posts) {
  // Blog images may already be linked (run-upload.mjs ran uploadBlogImages)
  // but the verification used wrong field name (heroImage vs featuredImage)
  return posts.map(p => ({
    docId: p._id,
    slug: p.slug,
    hasFeaturedImageRef: p.hasFeaturedImageRef,
    hasFeaturedImageUrl: p.hasFeaturedImageUrl,
    urlString: p.featuredImageUrl,
    localExists: localExists(p.featuredImageUrl),
    action: p.hasFeaturedImageRef ? "ALREADY_LINKED ✓" :
            p.hasFeaturedImageUrl ? "URL_SET_NO_REF — needs upload+link" :
            "NO_IMAGE_DATA",
    note: p.incorrectField ? "WARNING: heroImage.asset is set (wrong field?)" : null,
  }));
}

// ─── Main ──────────────────────────────────────────────────────────────────────

console.log(header("SANITY ASSET RELINK — DRY RUN AUDIT"));
console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1"}`);
console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"}`);
console.log(`  Mode: READ-ONLY (no writes will be performed)`);
console.log(`  Timestamp: ${new Date().toISOString()}`);

const { images: imageAssets, files: fileAssets } = await auditAssets();
const [blogPosts, products, applications, projects, pages] = await Promise.all([
  auditBlogPosts(),
  auditProducts(),
  auditApplications(),
  auditProjects(),
  auditPages(),
]);

// ─── SECTION 1: Asset inventory ──────────────────────────────────────────────
console.log(header("1. SANITY ASSET STORE"));
console.log(`  imageAssets in Sanity CDN: ${imageAssets.length}`);
console.log(`  fileAssets  in Sanity CDN: ${fileAssets.length}`);

// Show image asset filenames (grouped)
const imageNames = imageAssets.map(a => a.originalFilename);
const imageNameCounts = {};
for (const n of imageNames) imageNameCounts[n] = (imageNameCounts[n] || 0) + 1;
const topImageNames = Object.entries(imageNameCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);
console.log("\n  Image asset filenames (top 10 by count):");
for (const [name, count] of topImageNames) {
  console.log(`    ${String(count).padStart(3)}× ${name}`);
}

const fileNames = fileAssets.map(a => a.originalFilename);
const pdfCount = fileNames.filter(n => n?.endsWith(".pdf")).length;
console.log(`\n  File assets: ${fileAssets.length} total, ${pdfCount} PDFs`);
const samplePdfs = fileAssets.slice(0, 5).map(a => `    - ${a.originalFilename} (${Math.round((a.size||0)/1024)}KB)`);
console.log("  Sample PDFs:");
for (const p of samplePdfs) console.log(p);

// ─── SECTION 2: Document type summary ────────────────────────────────────────
console.log(header("2. DOCUMENT STATE SUMMARY"));

// Blog posts
const blogLinked = blogPosts.filter(p => p.hasFeaturedImageRef).length;
const blogUrlOnly = blogPosts.filter(p => !p.hasFeaturedImageRef && p.hasFeaturedImageUrl).length;
const blogEmpty = blogPosts.filter(p => !p.hasFeaturedImageRef && !p.hasFeaturedImageUrl).length;
const blogIncorrect = blogPosts.filter(p => p.incorrectField).length;

console.log(`\n  blogPost (total: ${blogPosts.length})`);
console.log(`    ✓ featuredImage.asset set (linked):         ${blogLinked}`);
console.log(`    ⚠ featuredImageUrl string but no ref:       ${blogUrlOnly}`);
console.log(`    ✗ no image data at all:                     ${blogEmpty}`);
if (blogIncorrect > 0) {
  console.log(`    !! heroImage.asset set (WRONG field name): ${blogIncorrect}  ← check these`);
}
console.log(`\n    NOTE: run-upload.mjs GROQ used wrong verification field.`);
console.log(`    Correct check: defined(featuredImage.asset) — counts above are correct.`);
console.log(`    Incorrect check (was used): defined(heroImage.asset) → always 0 (wrong field)`);

// Products
const prodLinked = products.filter(p => p.hasHeroRef).length;
const prodUrlOnly = products.filter(p => !p.hasHeroRef && p.hasHeroUrl).length;
const prodEmpty = products.filter(p => !p.hasHeroRef && !p.hasHeroUrl).length;
const prodDocWithAsset = products.reduce((sum, p) => sum + (p.docWithAsset || 0), 0);
const prodDocWithPath = products.reduce((sum, p) => sum + (p.docWithPath || 0), 0);

console.log(`\n  product (total: ${products.length})`);
console.log(`    ✓ heroImage.asset set (linked):     ${prodLinked}`);
console.log(`    ⚠ heroImageUrl string but no ref:   ${prodUrlOnly}`);
console.log(`    ✗ no image data at all:             ${prodEmpty}`);
console.log(`    PDF docs with fileAsset ref:         ${prodDocWithAsset}`);
console.log(`    PDF docs with filePath (string):     ${prodDocWithPath}`);

// Applications
const appLinked = applications.filter(a => a.hasHeroRef).length;
const appUrlOnly = applications.filter(a => !a.hasHeroRef && a.hasHeroUrl).length;
const appEmpty = applications.filter(a => !a.hasHeroRef && !a.hasHeroUrl).length;

console.log(`\n  application (total: ${applications.length})`);
console.log(`    ✓ heroImage.asset set (linked):     ${appLinked}`);
console.log(`    ⚠ heroImageUrl string but no ref:   ${appUrlOnly}`);
console.log(`    ✗ no image data at all:             ${appEmpty}`);

// Projects
const projLinked = projects.filter(p => p.hasImageRef).length;
const projUrlOnly = projects.filter(p => !p.hasImageRef && p.hasImageUrl).length;
const projEmpty = projects.filter(p => !p.hasImageRef && !p.hasImageUrl).length;

console.log(`\n  project (total: ${projects.length})`);
console.log(`    ✓ image.asset set (linked):         ${projLinked}`);
console.log(`    ⚠ imageUrl string but no ref:       ${projUrlOnly}`);
console.log(`    ✗ no image data at all:             ${projEmpty}`);

// ─── SECTION 3: Root cause analysis ──────────────────────────────────────────
console.log(header("3. ROOT CAUSE ANALYSIS"));
console.log(`
  run-upload.mjs handled ONLY:
  ✓ Blog featured images  → uploadBlogImages()  — scans public/images/blog/[slug]/featured.*
  ✓ PDFs                  → uploadPDFs()         — scans public/docs/**/*.pdf
  ✓ Homepage hero (1 img) → uploadHeroes()       — patches page.homepageHero.backgroundImage
  ✓ Mascot image          → uploadLunchLearnImages()

  run-upload.mjs NEVER handled:
  ✗ Product heroImage     — documents store heroImageUrl (URL string), no CDN upload
  ✗ Application heroImage — documents store heroImageUrl (URL string), no CDN upload
  ✗ Project image         — documents store imageUrl (URL string), no CDN upload
  ✗ Product/app gallery   — documents store galleryUrls[] (URL string array), no CDN upload

  GROQ field-name bug in run-upload.mjs skip guard (line 98):
    Query fetches: featuredImageUrl
    Skip check uses: post.featuredImage  ← undefined in projection → guard never fires
    BUT: patch sets: { featuredImage: ref }  ← correct schema field
    RESULT: every blog post always re-uploaded regardless. Not harmful, just wasteful.

  Verification GROQ used wrong field:
    Checked: defined(heroImage.asset) for blogPost  ← WRONG (heroImage does not exist on blogPost)
    Correct: defined(featuredImage.asset)            ← this is the actual schema field
`);

// ─── SECTION 4: Per-document upload+link plan ─────────────────────────────────
console.log(header("4. UPLOAD + LINK PLAN (DRY RUN)"));

// Blog posts — recheck with correct field
const blogPlan = planBlogRecheck(blogPosts);
const blogNeedAction = blogPlan.filter(p => p.action.includes("needs upload"));
const blogAlreadyLinked = blogPlan.filter(p => p.action.includes("ALREADY_LINKED"));

console.log(subheader("4a. Blog Posts"));
console.log(`  Already linked (featuredImage.asset set):  ${blogAlreadyLinked.length}`);
console.log(`  Need upload+link:                          ${blogNeedAction.length}`);
if (blogNeedAction.length > 0) {
  console.log("\n  Blog posts needing action:");
  for (const p of blogNeedAction) {
    const exists = p.localExists;
    const conf = confidence(p.urlString, exists);
    console.log(`    [${conf.padEnd(8)}] ${p.slug}`);
    console.log(`              URL: ${p.urlString}`);
    console.log(`              Local: ${exists ? "✓ exists" : "✗ MISSING"}`);
  }
}

// Products
const productPlan = planProductUploads(products.filter(p => !p.hasHeroRef && p.hasHeroUrl));
console.log(subheader("4b. Products — heroImage"));

const prodHigh = productPlan.filter(p => p.confidence === "HIGH");
const prodLow = productPlan.filter(p => p.confidence !== "HIGH");

console.log(`  Products needing upload+link: ${productPlan.length}`);
if (productPlan.length > 0) {
  console.log("\n  Product hero images:");
  for (const p of productPlan) {
    console.log(`    [${p.confidence.padEnd(12)}] ${p.name} (${p.slug})`);
    console.log(`                  URL: ${p.urlString ?? "(none)"}`);
    console.log(`                  Local: ${p.localExists === true ? `✓ exists (${p.size})` : p.localExists === null ? "external URL" : "✗ MISSING"}`);
  }
}

// Applications
const appPlan = planApplicationUploads(applications.filter(a => !a.hasHeroRef && a.hasHeroUrl));
console.log(subheader("4c. Applications — heroImage"));
console.log(`  Applications needing upload+link: ${appPlan.length}`);
if (appPlan.length > 0) {
  for (const a of appPlan) {
    console.log(`    [${a.confidence.padEnd(12)}] ${a.name} (${a.slug})`);
    console.log(`                  URL: ${a.urlString ?? "(none)"}`);
    console.log(`                  Local: ${a.localExists === true ? `✓ exists (${a.size})` : a.localExists === null ? "external URL" : "✗ MISSING"}`);
  }
}

// Projects
const projPlan = planProjectUploads(projects);
const projNeedAction = projPlan.filter(p => p.action === "NEEDS_UPLOAD_AND_LINK");
const projNoImage = projPlan.filter(p => p.action === "NO_IMAGE_URL (nothing to link)");
const projExternalUrl = projPlan.filter(p => p.confidence === "EXTERNAL");

console.log(subheader("4d. Projects — image"));
console.log(`  Projects needing upload+link:  ${projNeedAction.length}`);
console.log(`  Projects with no imageUrl:     ${projNoImage.length}`);
console.log(`  Projects with external URL:    ${projExternalUrl.length}`);
if (projNeedAction.length > 0) {
  console.log("\n  Projects needing action (showing first 20):");
  for (const p of projNeedAction.slice(0, 20)) {
    console.log(`    [${p.confidence.padEnd(18)}] ${p.title} — ${p.city}, ${p.province}`);
    console.log(`                  URL: ${p.urlString ?? "(none)"}`);
    console.log(`                  Local: ${p.localExists === true ? `✓ exists (${p.size})` : p.localExists === null ? "external URL" : "✗ MISSING"}`);
  }
  if (projNeedAction.length > 20) console.log(`    ... and ${projNeedAction.length - 20} more (see relink-report.json)`);
}

// ─── SECTION 5: Orphan assets ─────────────────────────────────────────────────
console.log(header("5. ORPHAN ASSET CHECK"));

// Try to identify which blog slugs the 52 imageAssets correspond to
// by checking which uploaded assets could be matched to blog posts
// (assets have originalFilename, posts have slugs — we can only infer from blog linked count)
console.log(`  imageAssets in CDN:     ${imageAssets.length}`);
console.log(`  blogPosts linked:       ${blogLinked}`);
console.log(`  Difference (orphans?):  ${imageAssets.length - blogLinked}`);
console.log(`\n  Note: If ${blogLinked} blog posts are linked and ${imageAssets.length} assets exist,`);
console.log(`  ${imageAssets.length - blogLinked} image assets may be orphaned (uploaded but not linked)`);
console.log(`  or linked to other doc types (homepage heroes, etc.)`);
console.log(`\n  fileAssets in CDN:     ${fileAssets.length}`);
console.log(`  PDFs with filePath:    ${prodDocWithPath}`);

// ─── SECTION 6: Summary + recommendations ─────────────────────────────────────
console.log(header("6. SUMMARY + RECOMMENDED ACTIONS"));

const totalNeedUploadAndLink = (blogNeedAction.length) + (productPlan.length) + (appPlan.length) + (projNeedAction.length);
const totalHighConfidence = blogNeedAction.filter(p => p.localExists).length + prodHigh.length + appPlan.filter(a => a.confidence === "HIGH").length + projNeedAction.filter(p => p.confidence === "HIGH").length;

console.log(`
  Documents already correctly linked:
    Blog posts (featuredImage.asset):    ${blogLinked}
    Products (heroImage.asset):          ${prodLinked}
    Applications (heroImage.asset):      ${appLinked}
    Projects (image.asset):              ${projLinked}

  Documents needing upload + link:
    Blog posts:                          ${blogNeedAction.length}
    Products:                            ${productPlan.length}
    Applications:                        ${appPlan.length}
    Projects:                            ${projNeedAction.length}
    ─────────────────────────────────────────
    TOTAL:                               ${totalNeedUploadAndLink}
    High-confidence (local file found):  ${totalHighConfidence}
    Ambiguous / missing local files:     ${totalNeedUploadAndLink - totalHighConfidence}

  Recommended next steps (pending Vernon's go-ahead):
  1. Fix blog verification: change GROQ from heroImage.asset to featuredImage.asset
  2. Extend run-upload.mjs with uploadProductHeroes(), uploadApplicationHeroes(), uploadProjectImages()
  3. Run the extended upload script (live, not dry-run) — REQUIRES SANITY_API_WRITE_TOKEN
  4. Orphaned assets (if any) can be cleaned up via Sanity Dashboard → Media Library
`);

// ─── Write JSON report ────────────────────────────────────────────────────────
const report = {
  timestamp: new Date().toISOString(),
  assetInventory: {
    imageAssets: imageAssets.length,
    fileAssets: fileAssets.length,
    imageFilenames: imageNameCounts,
  },
  documentState: {
    blogPost: { total: blogPosts.length, linked: blogLinked, urlOnly: blogUrlOnly, empty: blogEmpty },
    product: { total: products.length, linked: prodLinked, urlOnly: prodUrlOnly, empty: prodEmpty },
    application: { total: applications.length, linked: appLinked, urlOnly: appUrlOnly, empty: appEmpty },
    project: { total: projects.length, linked: projLinked, urlOnly: projUrlOnly, empty: projEmpty },
  },
  uploadPlan: {
    blogPosts: blogPlan,
    products: productPlan,
    applications: appPlan,
    projects: projPlan,
  },
  orphanAssets: {
    imageAssets: imageAssets.map(a => ({ _id: a._id, originalFilename: a.originalFilename, url: a.url })),
    fileAssets: fileAssets.map(a => ({ _id: a._id, originalFilename: a.originalFilename, url: a.url })),
  },
};

const reportPath = path.join(__dirname, "relink-report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n  Full report written to: scripts/relink-report.json`);
console.log(`  Share this with Claude before authorizing the apply step.\n`);
