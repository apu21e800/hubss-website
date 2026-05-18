/**
 * scripts/upload-to-sanity.ts
 *
 * Uploads images and PDFs to Sanity CDN and patches the corresponding documents.
 *
 * Upload budget: 950 MB max (free tier limit). Only "safe" categories are uploaded:
 *   - public/images/hero/          ~2 MB   → pages/homepage homepageHero.heroImage1-3
 *   - public/images/blog/*/featured.*  ~10 MB  → blogPost.featuredImage (by slug)
 *   - public/images/lunch-learn/   ~24 MB  → siteSettings lunchLearn* component assets
 *   - public/docs/**\/*.pdf         ~84 MB  → product.documents[].fileAsset
 *
 * Skipped (exceed budget — stay on Vercel CDN):
 *   - public/images/products/      ~881 MB
 *   - public/images/applications/  ~1,300 MB
 *   - public/images/assets/        logos/icons, not content-editable
 *
 * Usage:
 *   npx tsx scripts/upload-to-sanity.ts --dry-run
 *   npx tsx scripts/upload-to-sanity.ts
 *   npx tsx scripts/upload-to-sanity.ts --heroes-only
 *   npx tsx scripts/upload-to-sanity.ts --blog-only
 *   npx tsx scripts/upload-to-sanity.ts --lunch-learn-only
 *   npx tsx scripts/upload-to-sanity.ts --docs-only
 *
 * Requires:
 *   SANITY_API_WRITE_TOKEN  (Editor role from sanity.io/manage → API → Tokens)
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 */

import { createClient, type SanityClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ── Resolve __dirname in ESM context ────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// ── Args ────────────────────────────────────────────────────────────────────
const DRY_RUN        = process.argv.includes("--dry-run");
const HEROES_ONLY    = process.argv.includes("--heroes-only");
const BLOG_ONLY      = process.argv.includes("--blog-only");
const LUNCH_ONLY     = process.argv.includes("--lunch-learn-only");
const DOCS_ONLY      = process.argv.includes("--docs-only");

// ── Budget guard ─────────────────────────────────────────────────────────────
const BUDGET_MB  = 950;
let runningMB    = 0;

function checkBudget(fileSizeBytes: number, label: string): boolean {
  const mb = fileSizeBytes / 1_048_576;
  if (runningMB + mb > BUDGET_MB) {
    console.error(`\n❌ BUDGET EXCEEDED: adding ${mb.toFixed(2)} MB (${label}) would push total to ${(runningMB + mb).toFixed(2)} MB — halting.`);
    return false;
  }
  return true;
}

function trackSize(fileSizeBytes: number) {
  runningMB += fileSizeBytes / 1_048_576;
}

// ── Sanity client ────────────────────────────────────────────────────────────
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token && !DRY_RUN) {
  console.error("ERROR: SANITY_API_WRITE_TOKEN is not set.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: token ?? "dry-run-no-token",
});

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Upload a file to Sanity and return its asset _id. */
async function uploadAsset(
  filePath: string,
  type: "image" | "file",
  label: string
): Promise<string | null> {
  const stat = fs.statSync(filePath);

  if (!checkBudget(stat.size, label)) return null;

  if (DRY_RUN) {
    const mb = stat.size / 1_048_576;
    trackSize(stat.size);
    console.log(`  [dry-run] upload ${type} ${label} (${mb.toFixed(2)} MB) → would get asset _id`);
    return `dry-run-asset-id-${path.basename(filePath)}`;
  }

  try {
    const stream = fs.createReadStream(filePath);
    const filename = path.basename(filePath);
    const asset = await (client.assets as SanityClient["assets"]).upload(type, stream, { filename });
    trackSize(stat.size);
    console.log(`  ✓ Uploaded ${label} → ${asset._id} (${(stat.size / 1_048_576).toFixed(2)} MB)`);
    return asset._id;
  } catch (err) {
    console.error(`  ✗ Failed to upload ${label}:`, err);
    return null;
  }
}

/** Build a Sanity asset reference object */
function assetRef(id: string) {
  return { _type: "reference", _ref: id };
}

/** Check if a Sanity image field already has an asset ref (skip re-upload) */
async function hasAssetRef(docId: string, fieldPath: string): Promise<boolean> {
  if (DRY_RUN) return false;
  try {
    const result = await client.fetch<{ ref: string | null }>(
      `*[_id == $id][0]{ "ref": ${fieldPath}.asset._ref }`,
      { id: docId }
    );
    return !!result?.ref;
  } catch {
    return false;
  }
}

// ── 1. Hero images ───────────────────────────────────────────────────────────

async function uploadHeroes() {
  console.log("\n── Hero images (public/images/hero/) ──────────────────────────");

  const heroDir = path.join(ROOT, "public", "images", "hero");
  // Map of filename → page field name
  const heroMap: Record<string, string> = {
    "hero-1.jpg": "homepageHero.heroImage1",
    "hero-2.jpg": "homepageHero.heroImage2",
    "hero-3.jpg": "homepageHero.heroImage3",
  };

  const docId = "page-homepage";

  for (const [filename, fieldPath] of Object.entries(heroMap)) {
    const filePath = path.join(heroDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠ Missing: ${filename} — skipping`);
      continue;
    }

    // Skip if already uploaded
    if (await hasAssetRef(docId, fieldPath)) {
      console.log(`  ↳ ${filename} already uploaded — skipping`);
      continue;
    }

    const assetId = await uploadAsset(filePath, "image", filename);
    if (!assetId) continue;

    if (!DRY_RUN) {
      await client.patch(docId).set({
        [`homepageHero.${fieldPath.split(".").pop()}`]: {
          _type: "image",
          asset: assetRef(assetId),
        },
      }).commit();
      console.log(`  ✓ Patched ${docId}.${fieldPath}`);
    } else {
      console.log(`  [dry-run] would patch ${docId}.${fieldPath}`);
    }
  }
}

// ── 2. Blog featured images ──────────────────────────────────────────────────

async function uploadBlogImages() {
  console.log("\n── Blog featured images (public/images/blog/) ─────────────────");

  const blogDir = path.join(ROOT, "public", "images", "blog");
  if (!fs.existsSync(blogDir)) {
    console.log("  ⚠ blog image directory not found — skipping");
    return;
  }

  const slugDirs = fs.readdirSync(blogDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const slug of slugDirs) {
    const dir = path.join(blogDir, slug);
    // Look for featured.jpg, featured.png, featured.webp
    const candidates = ["featured.jpg", "featured.jpeg", "featured.png", "featured.webp"];
    const featuredFile = candidates.find(f => fs.existsSync(path.join(dir, f)));

    if (!featuredFile) {
      // Not every blog folder has a featured image
      continue;
    }

    const filePath = path.join(dir, featuredFile);
    const docId = `blogpost-${slug}`;

    // Skip if already uploaded
    if (await hasAssetRef(docId, "featuredImage")) {
      console.log(`  ↳ ${slug} already has featuredImage asset — skipping`);
      continue;
    }

    const assetId = await uploadAsset(filePath, "image", `blog/${slug}/${featuredFile}`);
    if (!assetId) return; // budget exceeded — stop entirely

    if (!DRY_RUN) {
      await client.patch(docId).set({
        featuredImage: {
          _type: "image",
          asset: assetRef(assetId),
          alt: "",
        },
      }).commit();
      console.log(`  ✓ Patched ${docId}.featuredImage`);
    } else {
      console.log(`  [dry-run] would patch ${docId}.featuredImage`);
    }
  }
}

// ── 3. Lunch & Learn images ──────────────────────────────────────────────────

/**
 * Lunch-learn images are mascot/component assets, not tied to a specific
 * Sanity document field. We store them in siteSettings under a dedicated
 * lunchLearnImages array for Studio-managed access.
 */
async function uploadLunchLearnImages() {
  console.log("\n── Lunch & Learn images (public/images/lunch-learn/) ──────────");

  const llDir = path.join(ROOT, "public", "images", "lunch-learn");
  if (!fs.existsSync(llDir)) {
    console.log("  ⚠ lunch-learn directory not found — skipping");
    return;
  }

  const imageFiles = fs.readdirSync(llDir)
    .filter(f => /\.(jpe?g|png|webp|gif|svg)$/i.test(f));

  const uploadedRefs: Array<{ _key: string; _type: string; asset: { _type: string; _ref: string }; filename: string }> = [];

  for (const filename of imageFiles) {
    const filePath = path.join(llDir, filename);
    const label = `lunch-learn/${filename}`;
    const assetId = await uploadAsset(filePath, "image", label);
    if (!assetId) return; // budget exceeded

    uploadedRefs.push({
      _key: filename.replace(/[^a-z0-9]/gi, "_").slice(0, 40),
      _type: "image",
      asset: { _type: "reference", _ref: assetId },
      filename,
    });
  }

  if (uploadedRefs.length === 0) {
    console.log("  ⚠ No images uploaded");
    return;
  }

  if (!DRY_RUN) {
    // Patch siteSettings with the lunch-learn image refs
    await client.patch("siteSettings").set({
      lunchLearnImages: uploadedRefs,
    }).commit();
    console.log(`  ✓ Stored ${uploadedRefs.length} lunch-learn image refs in siteSettings.lunchLearnImages`);
  } else {
    console.log(`  [dry-run] would store ${uploadedRefs.length} lunch-learn image refs in siteSettings.lunchLearnImages`);
  }
}

// ── 4. PDFs ──────────────────────────────────────────────────────────────────

/**
 * Walk public/docs/ recursively to find all PDFs.
 * Returns list of { filePath, relativePath, productSlug }.
 */
function findPdfs(dir: string, base: string): Array<{ filePath: string; relativePath: string; productSlug: string }> {
  const results: Array<{ filePath: string; relativePath: string; productSlug: string }> = [];

  const walk = (current: string) => {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
        const relPath = path.relative(base, fullPath).replace(/\\/g, "/");
        // First path segment after docs/ is the product folder name
        const productFolder = relPath.split("/")[0];
        const productSlug = productFolder
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        results.push({ filePath: fullPath, relativePath: relPath, productSlug });
      }
    }
  };

  walk(dir);
  return results;
}

async function uploadPdfs() {
  console.log("\n── PDFs (public/docs/) ─────────────────────────────────────────");

  const docsDir = path.join(ROOT, "public", "docs");
  if (!fs.existsSync(docsDir)) {
    console.log("  ⚠ docs directory not found — skipping");
    return;
  }

  const pdfs = findPdfs(docsDir, docsDir);
  console.log(`  Found ${pdfs.length} PDF files`);

  // Fetch all product docs from Sanity to match filePaths
  let productDocs: Array<{ _id: string; slug: string; documents: Array<{ _key: string; filePath: string; fileAsset?: { asset: { _ref: string } } }> }> = [];
  if (!DRY_RUN) {
    productDocs = await client.fetch(
      `*[_type == "product" && defined(documents)]{ _id, "slug": slug.current, documents }`
    );
  }

  // Build a lookup: normalized filePath → { docId, _key }
  const filePathIndex = new Map<string, { docId: string; key: string }>();
  for (const prod of productDocs) {
    for (const doc of prod.documents ?? []) {
      if (doc.filePath && !doc.fileAsset) {
        // Normalize: strip leading /docs/ or /
        const normalized = doc.filePath.replace(/^\/(?:docs\/)?/, "");
        filePathIndex.set(normalized, { docId: prod._id, key: doc._key });
      }
    }
  }

  let uploaded = 0;
  let skipped  = 0;
  let unmatched = 0;

  for (const { filePath, relativePath, productSlug } of pdfs) {
    const label = `docs/${relativePath}`;

    // Try to find matching Sanity doc entry
    const match = filePathIndex.get(relativePath);

    if (DRY_RUN) {
      const stat = fs.statSync(filePath);
      if (!checkBudget(stat.size, label)) return;
      trackSize(stat.size);
      console.log(`  [dry-run] ${match ? "would patch" : "unmatched (upload only)"} ${relativePath} (${(stat.size / 1_048_576).toFixed(2)} MB)`);
      if (!match) unmatched++;
      else uploaded++;
      continue;
    }

    const assetId = await uploadAsset(filePath, "file", label);
    if (!assetId) return; // budget exceeded

    if (match) {
      // Patch the specific document array entry
      await client.patch(match.docId)
        .setIfMissing({ documents: [] })
        .set({
          [`documents[_key=="${match.key}"].fileAsset`]: {
            _type: "file",
            asset: { _type: "reference", _ref: assetId },
          },
        })
        .commit();
      console.log(`  ✓ Patched ${match.docId} doc[${match.key}].fileAsset`);
      uploaded++;
    } else {
      // No matching product doc found — asset is still in Sanity CDN, just not wired
      console.log(`  ↳ No Sanity doc match for ${relativePath} (product: ${productSlug}) — asset uploaded, not wired`);
      unmatched++;
    }
  }

  console.log(`\n  Summary: ${uploaded} patched, ${skipped} skipped (already set), ${unmatched} unmatched`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  HUBSS → Sanity Image & PDF Upload");
  console.log(`  Project: ${client.config().projectId} / ${client.config().dataset}`);
  console.log(`  Budget:  ${BUDGET_MB} MB`);
  if (DRY_RUN) console.log("  MODE: DRY RUN — no writes, no uploads");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("  Storage breakdown (upload targets):");
  console.log("    heroes         ~2 MB   → page-homepage.homepageHero.heroImage1-3");
  console.log("    blog featured  ~10 MB  → blogPost.featuredImage");
  console.log("    lunch-learn    ~24 MB  → siteSettings.lunchLearnImages");
  console.log("    PDFs           ~84 MB  → product.documents[].fileAsset");
  console.log("    ─────────────────────────────────────────────────────────");
  console.log("    Total          ~120 MB (well under 950 MB free tier)");
  console.log("\n  Skipped (exceed budget — stay on Vercel CDN):");
  console.log("    products/       ~881 MB  → needs Growth plan ($99/mo)");
  console.log("    applications/   ~1,300 MB → needs Growth plan");
  console.log("    assets/         logos/icons — not content-editable\n");

  try {
    const runAll = !HEROES_ONLY && !BLOG_ONLY && !LUNCH_ONLY && !DOCS_ONLY;

    if (runAll || HEROES_ONLY)  await uploadHeroes();
    if (runAll || BLOG_ONLY)    await uploadBlogImages();
    if (runAll || LUNCH_ONLY)   await uploadLunchLearnImages();
    if (runAll || DOCS_ONLY)    await uploadPdfs();

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`  Upload complete. Running total: ${runningMB.toFixed(2)} MB / ${BUDGET_MB} MB used`);
    console.log(`  Remaining budget: ${(BUDGET_MB - runningMB).toFixed(2)} MB`);
    if (DRY_RUN) {
      console.log("\n  DRY RUN complete — run without --dry-run to execute uploads.");
    } else {
      console.log("\n  Next steps:");
      console.log("  1. Verify uploads at https://9dbro2m1.sanity.studio/");
      console.log("  2. Check usage at https://sanity.io/manage → project → Usage");
      console.log("  3. For products/applications galleries → upgrade to Growth plan ($99/mo, 50 GB)");
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (err) {
    console.error("\nUpload failed:", err);
    process.exit(1);
  }
}

main();
