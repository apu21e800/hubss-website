/**
 * run-upload.mjs — Upload images + PDFs to Sanity CDN and patch documents.
 * Replaces upload-to-sanity.ts which had a comment syntax error.
 *
 * Usage:
 *   node scripts/run-upload.mjs --dry-run
 *   node scripts/run-upload.mjs
 */
import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DRY = process.argv.includes("--dry-run");
const BUDGET_BYTES = 950 * 1024 * 1024; // 950 MB
let runningTotal = 0;
let uploadCount = 0;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// ── Helpers ──────────────────────────────────────────────────────────────────

async function uploadFile(absPath, type = "image") {
  const size = fs.statSync(absPath).size;
  if (runningTotal + size > BUDGET_BYTES) {
    console.error("⛔ BUDGET EXCEEDED — halting at", Math.round(runningTotal/1024/1024) + "MB");
    process.exit(1);
  }
  if (DRY) {
    console.log("  [dry] upload", path.basename(absPath), Math.round(size/1024) + "KB");
    runningTotal += size;
    uploadCount++;
    return { _type: type === "image" ? "image" : "file", asset: { _ref: `${type}-dry-${Date.now()}` } };
  }
  const stream = fs.createReadStream(absPath);
  const asset = await client.assets.upload(type, stream, { filename: path.basename(absPath) });
  runningTotal += size;
  uploadCount++;
  console.log("  ✓ uploaded", path.basename(absPath), Math.round(size/1024) + "KB", "→", asset._id);
  return { _type: type === "image" ? "image" : "file", asset: { _type: "reference", _ref: asset._id } };
}

async function patch(id, patch) {
  if (DRY) { console.log("  [dry] patch", id, JSON.stringify(patch).slice(0, 80)); return; }
  await client.patch(id).set(patch).commit();
  console.log("  ✓ patched", id);
}

// ── Category 1: Hero images ──────────────────────────────────────────────────
async function uploadHeroes() {
  console.log("\n→ Hero images");
  const heroDir = path.join(ROOT, "public/images/hero");
  if (!fs.existsSync(heroDir)) { console.log("  (dir missing)"); return; }
  // Find the homepage page doc
  const page = await client.fetch('*[_type == "page" && slug.current == "homepage"][0]{_id}');
  if (!page) { console.log("  (no homepage page doc)"); return; }

  const heroFiles = fs.readdirSync(heroDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  for (const file of heroFiles) {
    const ref = await uploadFile(path.join(heroDir, file), "image");
    // Patch homepageHero.backgroundImage (first hero image as main bg)
    if (file === "hero-1.jpg") {
      await patch(page._id, { "homepageHero.backgroundImage": ref });
    }
  }
  console.log(`  ✓ ${heroFiles.length} hero images`);
}

// ── Category 2: Blog featured images ─────────────────────────────────────────
async function uploadBlogImages() {
  console.log("\n→ Blog featured images");
  const blogDir = path.join(ROOT, "public/images/blog");
  if (!fs.existsSync(blogDir)) { console.log("  (dir missing)"); return; }

  // Get all blog posts with their slugs
  const posts = await client.fetch('*[_type == "blogPost"]{ _id, slug, featuredImageUrl }');
  const postBySlug = new Map(posts.map(p => [p.slug?.current, p]));

  const dirs = fs.readdirSync(blogDir, { withFileTypes: true }).filter(d => d.isDirectory());
  let count = 0;
  for (const dir of dirs) {
    const slug = dir.name;
    const featured = ["featured.jpg","featured.jpeg","featured.png","featured.webp"]
      .map(f => path.join(blogDir, slug, f))
      .find(p => fs.existsSync(p));
    if (!featured) continue;

    const post = postBySlug.get(slug);
    if (!post) { console.log("  skip (no doc):", slug); continue; }
    if (post.featuredImage) { console.log("  skip (already ref):", slug); continue; }

    const ref = await uploadFile(featured, "image");
    await patch(post._id, { featuredImage: ref });
    count++;
  }
  console.log(`  ✓ ${count} blog images patched`);
}

// ── Category 3: PDFs ──────────────────────────────────────────────────────────
async function uploadPDFs() {
  console.log("\n→ PDFs");
  const docsDir = path.join(ROOT, "public/docs");
  if (!fs.existsSync(docsDir)) { console.log("  (dir missing)"); return; }

  // Collect all PDFs
  const pdfs = [];
  function walkDocs(dir) {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, f.name);
      if (f.isDirectory()) walkDocs(fp);
      else if (f.name.endsWith(".pdf")) pdfs.push(fp);
    }
  }
  walkDocs(docsDir);

  // Get all product docs with their documents arrays
  const products = await client.fetch('*[_type == "product"]{ _id, slug, documents }');

  let pdfCount = 0;
  for (const pdf of pdfs) {
    const filename = path.basename(pdf, ".pdf");
    const relPath = "/" + path.relative(path.join(ROOT, "public"), pdf).replace(/\\/g, "/");

    // Upload the file
    const ref = await uploadFile(pdf, "file");
    if (DRY) { pdfCount++; continue; }

    // Find which product document uses this PDF (match by filePath)
    for (const product of products) {
      const docs = product.documents ?? [];
      const idx = docs.findIndex(d => d.filePath === relPath);
      if (idx === -1) continue;
      // Patch the fileAsset field on that document entry
      const key = `documents[${idx}].fileAsset`;
      await patch(product._id, { [key]: ref });
      pdfCount++;
    }
  }
  console.log(`  ✓ ${pdfCount} PDFs processed`);
}

// ── Category 4: Lunch-learn mascot ───────────────────────────────────────────
async function uploadLunchLearnImages() {
  console.log("\n→ Lunch-Learn images");
  const llDir = path.join(ROOT, "public/images/lunch-learn");
  if (!fs.existsSync(llDir)) { console.log("  (dir missing)"); return; }

  const settings = await client.fetch('*[_type == "siteSettings"][0]{_id}');
  if (!settings) { console.log("  (no siteSettings doc)"); return; }

  const mascot = path.join(llDir, "moose-updated.png");
  if (fs.existsSync(mascot)) {
    const ref = await uploadFile(mascot, "image");
    await patch(settings._id, { mascotImage: ref });
    console.log("  ✓ mascot uploaded");
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log(`\n${"═".repeat(60)}`);
console.log(`  Sanity Asset Upload — ${DRY ? "DRY RUN" : "LIVE"}`);
console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1"}`);
console.log(`  Budget: 950 MB`);
console.log(`${"═".repeat(60)}`);

await uploadHeroes();
await uploadBlogImages();
await uploadPDFs();
await uploadLunchLearnImages();

const totalMB = (runningTotal / 1024 / 1024).toFixed(1);
const pct = ((runningTotal / BUDGET_BYTES) * 100).toFixed(1);
console.log(`\n${"═".repeat(60)}`);
console.log(`  ${DRY ? "DRY RUN" : "UPLOAD"} COMPLETE`);
console.log(`  Assets processed: ${uploadCount}`);
console.log(`  Total size: ${totalMB} MB (${pct}% of 950 MB free tier)`);
console.log(`${"═".repeat(60)}\n`);
