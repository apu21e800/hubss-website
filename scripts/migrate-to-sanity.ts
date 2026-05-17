/**
 * scripts/migrate-to-sanity.ts
 *
 * Migrates static data from lib/ and content/blog/ MDX frontmatter into Sanity CMS.
 *
 * Usage:
 *   npm run migrate:sanity            # run migration
 *   npm run migrate:sanity:dry        # dry run — prints what would be done, no writes
 *   npm run migrate:sanity:purge      # purge all docs of migrated types, then migrate
 *
 * Requires:
 *   SANITY_API_WRITE_TOKEN in env (Editor role from sanity.io/manage)
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// ── Resolve __dirname in ESM context ────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// ── Args ────────────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes("--dry-run");
const PURGE = process.argv.includes("--purge");
const PAGES_ONLY = process.argv.includes("--pages-only");
const DOCS_ONLY = process.argv.includes("--docs-only");

// ── Sanity client ────────────────────────────────────────────────────────────
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token && !DRY_RUN) {
  console.error("ERROR: SANITY_API_WRITE_TOKEN is not set. Export it in your environment or add it to .env.local and re-run.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: token ?? "dry-run-no-token",
});

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Wrap a plain-text string as a portable-text block array */
function toPortableText(text: string) {
  // Split on double newlines to create paragraphs
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return paragraphs.map((para, i) => ({
    _type: "block" as const,
    _key: `block${i}`,
    style: "normal",
    children: [{ _type: "span" as const, _key: `span${i}`, text: para.trim(), marks: [] }],
    markDefs: [],
  }));
}

/**
 * Validate an image path against the local /public/ directory.
 * Returns the path if valid, undefined if the file is missing.
 * Images stored as URL strings — no Sanity CDN upload per Vernon's direction.
 */
function validateImagePath(imgPath: string | undefined | null): string | undefined {
  if (!imgPath) return undefined;
  // Skip Unsplash or external URLs — pass through as-is
  if (imgPath.startsWith("http")) return imgPath;
  // Skip template literals that weren't resolved (false positives from gallery() helper)
  if (imgPath.includes("${")) return undefined;
  const fullPath = path.join(ROOT, "public", imgPath);
  if (fs.existsSync(fullPath)) return imgPath;
  console.warn(`  ⚠️  Missing image (skipped): ${imgPath}`);
  return undefined;
}

/** Create a deterministic _key for array items */
function key(s: string) {
  return s.replace(/[^a-z0-9]/gi, "_").slice(0, 40);
}

async function upsert(doc: Record<string, unknown>) {
  if (DRY_RUN) {
    console.log(`  [dry-run] createOrReplace ${doc._type} _id=${doc._id}`);
    return;
  }
  await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0]);
}

async function purgeType(typeName: string) {
  if (DRY_RUN) {
    console.log(`  [dry-run] purge all _type == "${typeName}"`);
    return;
  }
  const ids: string[] = await client.fetch(`*[_type == $t]._id`, { t: typeName });
  if (ids.length === 0) {
    console.log(`  No existing ${typeName} documents to purge.`);
    return;
  }
  const tx = client.transaction();
  for (const id of ids) tx.delete(id);
  await tx.commit();
  console.log(`  Purged ${ids.length} ${typeName} documents.`);
}

// ── 1. siteSettings ─────────────────────────────────────────────────────────

async function migrateSiteSettings() {
  console.log("\n→ siteSettings");

  // Social links from lib/social-links.ts (inlined to avoid import issues)
  const SOCIAL_LINKS = {
    linkedin:  "https://www.linkedin.com/company/hub-surface-systems",
    youtube:   "https://www.youtube.com/@hubsurfacesystems",
    facebook:  "https://www.facebook.com/hubsurfacesystems",
    instagram: "https://www.instagram.com/hubsurfacesystems",
    x:         "https://x.com/HUB_SS",
  };

  const doc = {
    _id: "siteSettings",
    _type: "siteSettings",
    offices: {
      east: {
        phone: "416-540-9287",
        email: "doug.bain@hubss.com",
        name: "Doug Bain",
      },
      west: {
        phone: "604-309-8212",
        email: "cleve.stordy@hubss.com",
        name: "Cleve Stordy",
      },
    },
    social: {
      instagram: SOCIAL_LINKS.instagram,
      linkedin:  SOCIAL_LINKS.linkedin,
      youtube:   SOCIAL_LINKS.youtube,
      facebook:  SOCIAL_LINKS.facebook,
      x:         SOCIAL_LINKS.x,
    },
    footerTagline: "Pedestrian safety. Traffic calming.\nCivic identity. Coast to coast since 1999.",
    foundedYear: 1999,
  };

  await upsert(doc);
  console.log("  ✓ Migrated siteSettings (singleton)");
}

// ── 2. Products ─────────────────────────────────────────────────────────────

interface Product {
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  imageUrl: string;
  gallery?: string[];
  specs: { label: string; value: string }[];
  relatedApplications: string[];
  eyebrow?: string;
  heroPosition?: string;
  seoTitle?: string;
  seoDescription?: string;
  comingSoon?: boolean;
}

async function migrateProducts() {
  console.log("\n→ products");

  // Dynamic import — use pathToFileURL for Windows path compatibility
  const mod = await import(pathToFileURL(path.join(ROOT, "lib", "products.ts")).href).catch(() =>
    import(pathToFileURL(path.join(ROOT, "lib", "products.js")).href)
  );
  const products: Product[] = mod.products;

  if (PURGE) await purgeType("product");

  let count = 0;
  for (const product of products) {
    const doc = {
      _id: `product-${product.slug}`,
      _type: "product",
      name: product.name,
      slug: { _type: "slug", current: product.slug },
      ...(product.eyebrow && { eyebrow: product.eyebrow }),
      shortDesc: product.shortDesc,
      description: toPortableText(product.description),
      // Images stored as URL strings — no Sanity CDN upload per Vernon's direction.
      // validateImagePath skips missing files and logs a warning.
      heroImageUrl: validateImagePath(product.imageUrl),
      ...(product.heroPosition && { heroPosition: product.heroPosition }),
      galleryUrls: (product.gallery ?? []).map(validateImagePath).filter(Boolean),
      specs: (product.specs ?? []).map((s, i) => ({ ...s, _key: key(`spec_${i}_${s.label}`) })),
      // Store related application slugs as strings — references wired in follow-up PR
      relatedApplicationSlugs: product.relatedApplications,
      seo: {
        title: product.seoTitle ?? null,
        description: product.seoDescription ?? null,
      },
    };

    await upsert(doc);
    count++;
  }

  console.log(`  ✓ Migrated ${count} products`);
}

// ── 3. Applications ─────────────────────────────────────────────────────────

interface Application {
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  imageUrl: string;
  gallery?: string[];
  relatedProducts: string[];
  seoTitle?: string;
  seoDescription?: string;
}

async function migrateApplications() {
  console.log("\n→ applications");

  const mod = await import(pathToFileURL(path.join(ROOT, "lib", "applications.ts")).href).catch(() =>
    import(pathToFileURL(path.join(ROOT, "lib", "applications.js")).href)
  );
  const applications: Application[] = mod.applications;

  if (PURGE) await purgeType("application");

  let count = 0;
  for (const app of applications) {
    const doc = {
      _id: `application-${app.slug}`,
      _type: "application",
      name: app.name,
      slug: { _type: "slug", current: app.slug },
      shortDesc: app.shortDesc,
      description: toPortableText(app.description),
      heroImageUrl: validateImagePath(app.imageUrl),
      galleryUrls: (app.gallery ?? []).map(validateImagePath).filter(Boolean),
      // Store related product slugs as strings — references wired in follow-up PR
      relatedProductSlugs: app.relatedProducts,
      seo: {
        title: app.seoTitle ?? null,
        description: app.seoDescription ?? null,
      },
    };

    await upsert(doc);
    count++;
  }

  console.log(`  ✓ Migrated ${count} applications`);
}

// ── 4. Blog posts (from MDX frontmatter) ────────────────────────────────────

interface BlogFrontmatter {
  title: string;
  date?: string;
  publishedAt?: string;
  excerpt?: string;
  readTime?: string;
  featuredImage?: string;
}

function parseFrontmatter(content: string): { data: BlogFrontmatter; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {} as BlogFrontmatter, body: content };

  const yamlStr = match[1];
  const body = match[2];
  const data: Record<string, string> = {};

  for (const line of yamlStr.split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const k = line.slice(0, colonIdx).trim();
    const v = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    data[k] = v;
  }

  return { data: data as unknown as BlogFrontmatter, body };
}

async function migrateBlogPosts() {
  console.log("\n→ blogPosts (from MDX frontmatter)");

  const blogDir = path.join(ROOT, "content", "blog");
  if (!fs.existsSync(blogDir)) {
    console.log("  ⚠ content/blog/ not found — skipping blog migration.");
    return;
  }

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));

  if (PURGE) await purgeType("blogPost");

  let count = 0;
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
    const { data, body } = parseFrontmatter(raw);

    if (!data.title) {
      console.log(`  ⚠ Skipping ${file} — no title in frontmatter`);
      continue;
    }

    // Convert date string to ISO datetime
    const rawDate = data.date ?? data.publishedAt ?? "2024-01-01";
    const publishedAt = rawDate.includes("T") ? rawDate : `${rawDate}T00:00:00Z`;

    // Strip MDX JSX comments and components for plain text body
    const plainBody = body
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // MDX comments
      .replace(/<[A-Z][^>]*\/>/g, "")        // self-closing components
      .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, "") // component blocks
      .trim();

    const doc = {
      _id: `blogpost-${slug}`,
      _type: "blogPost",
      title: data.title,
      slug: { _type: "slug", current: slug },
      publishedAt,
      ...(data.excerpt && { excerpt: data.excerpt }),
      ...(data.readTime && { readTime: data.readTime }),
      // Validate image path exists before migrating
      ...(validateImagePath(data.featuredImage) && { featuredImageUrl: validateImagePath(data.featuredImage) }),
      // Store body as a single plain-text block — rich text migration is follow-up
      body: toPortableText(plainBody.slice(0, 8000)), // cap at 8k chars for now
    };

    await upsert(doc);
    count++;
  }

  console.log(`  ✓ Migrated ${count} blog posts`);
}

// ── 5. Projects (map pins) ───────────────────────────────────────────────────

interface MapProject {
  id: string;
  title: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  product: string;
  application: string;
  year?: string;
  images: string[];
  excerpt: string;
  problem: string;
  solution: string;
}

async function migrateProjects() {
  console.log("\n→ projects (map pins)");

  const mod = await import(pathToFileURL(path.join(ROOT, "lib", "map-projects.ts")).href).catch(() =>
    import(pathToFileURL(path.join(ROOT, "lib", "map-projects.js")).href)
  );
  const mapProjects: MapProject[] = mod.mapProjects;

  if (PURGE) await purgeType("project");

  let count = 0;
  for (const project of mapProjects) {
    const doc = {
      _id: `project-${project.id}`,
      _type: "project",
      title: project.title,
      city: project.city,
      province: project.province,
      lat: project.lat,
      lng: project.lng,
      ...(project.year && { year: project.year }),
      // Store product as a slug string — reference wired in follow-up PR
      productSlug: project.product,
      application: project.application,
      // Store first image URL as string — CDN upload is follow-up PR
      imageUrl: validateImagePath(project.images[0]) ?? null,
      excerpt: project.excerpt,
      problem: project.problem,
      solution: project.solution,
    };

    await upsert(doc);
    count++;
  }

  console.log(`  ✓ Migrated ${count} projects`);
}

// ── 6. Document library ──────────────────────────────────────────────────────

interface ProductDoc {
  label: string;
  href: string;
  type: string;
  lang?: string;
}

async function migrateDocs() {
  console.log("\n→ document library (per-product + resource list)");

  // 6a. Per-product docs → patch each product document in Sanity
  const docsMod = await import(pathToFileURL(path.join(ROOT, "lib", "documents.ts")).href).catch(() =>
    import(pathToFileURL(path.join(ROOT, "lib", "documents.js")).href)
  );
  // The module exports a const ALL_DOCS but it's not exported — access via named export instead
  // lib/documents.ts exports: DocType, ProductDocument, docTypeLabel
  // ALL_DOCS is a private const — we need to re-read it via getProductDocs() if exported,
  // otherwise import the whole module and look for the map.
  // Fallback: iterate the module keys to find the Record.
  const docsExports = docsMod as Record<string, unknown>;

  // lib/documents.ts exports getDocsForProduct(slug)
  const getDocsForProduct = docsExports["getDocsForProduct"] as ((slug: string) => ProductDoc[]) | undefined;

  if (!getDocsForProduct) {
    console.log("  ⚠ getDocsForProduct not found in lib/documents.ts — skipping per-product doc patch");
  } else {
    // Fetch all product slugs from Sanity
    const productIds: Array<{ _id: string; slug: string }> = DRY_RUN
      ? []
      : await client.fetch(`*[_type == "product"]{ _id, "slug": slug.current }`);

    let count = 0;
    for (const { _id, slug } of productIds) {
      const rawDocs = getDocsForProduct(slug);
      if (!rawDocs?.length) continue;

      const documents = rawDocs.map((d, i) => ({
        _key: key(`doc_${i}_${d.label}`),
        label: d.label,
        docType: d.type,
        filePath: d.href,
        ...(d.lang ? { lang: d.lang } : {}),
      }));

      if (DRY_RUN) {
        console.log(`  [dry-run] patch product ${_id} (${slug}) with ${documents.length} docs`);
        count++;
        continue;
      }

      await client.patch(_id).set({ documents }).commit();
      count++;
    }
    console.log(`  ✓ Patched ${count} products with document arrays`);
  }

  // 6b. Resource documents → patch siteSettings singleton
  const resMod = await import(pathToFileURL(path.join(ROOT, "lib", "resource-documents.ts")).href).catch(() =>
    import(pathToFileURL(path.join(ROOT, "lib", "resource-documents.js")).href)
  );
  const resourceDocuments = (resMod as Record<string, unknown>)["resourceDocuments"] as Array<Record<string, unknown>>;

  if (!resourceDocuments?.length) {
    console.log("  ⚠ resourceDocuments not found in lib/resource-documents.ts — skipping");
    return;
  }

  const resourceDocsForSanity = resourceDocuments.map((d, i) => ({
    _key: key(`rdoc_${i}_${String(d["id"] ?? i)}`),
    id: d["id"],
    title: d["title"],
    docType: d["type"],
    product: d["product"],
    productName: d["productName"],
    fileUrl: d["fileUrl"],
    fileSize: d["fileSize"],
    updatedDate: d["updatedDate"],
  }));

  if (DRY_RUN) {
    console.log(`  [dry-run] patch siteSettings with ${resourceDocsForSanity.length} resource documents`);
  } else {
    await client.patch("siteSettings").set({ resourceDocuments: resourceDocsForSanity }).commit();
    console.log(`  ✓ Patched siteSettings with ${resourceDocsForSanity.length} resource documents`);
  }
}

// ── 7. Pages ─────────────────────────────────────────────────────────────────

async function migratePages() {
  console.log("\n→ pages (homepage, about, contact, lunch-learn)");

  if (PURGE) await purgeType("page");

  const pages = [
    {
      _id: "page-homepage",
      _type: "page",
      title: "Homepage",
      slug: { _type: "slug", current: "homepage" },
      homepageHero: {
        eyebrow:    "Redefining Hardscapes · Since 1999",
        heading:    "The World Is",
        subheading: "Your Canvas.",
        tagline:    "Let's build your signature space.",
        cta1Label:  "See the Work",
        cta1Href:   "#field-notes",
        cta2Label:  "See the Systems",
        cta2Href:   "#systems",
      },
    },
    {
      _id: "page-about",
      _type: "page",
      title: "About",
      slug: { _type: "slug", current: "about" },
      aboutHero: {
        eyebrow:    "Canadian-Operated Since 1999 · All 10 Provinces",
        heading:    "The people who made your city look like your city.",
        subheading: "For over thirty years, HUB Surface Systems — a proudly Canadian company, coast to coast — has been connecting communities with pavement technologies that do more than carry traffic. They carry identity.",
      },
      aboutMission: "Every surface tells a story. We give communities the language to write it.",
    },
    {
      _id: "page-contact",
      _type: "page",
      title: "Contact",
      slug: { _type: "slug", current: "contact" },
      contactHero: {
        eyebrow:    "Get In Touch",
        heading:    "Start a Project",
        subheading: "Tell us about your community, your timeline, and your vision. We'll tell you which surface system brings it to life.",
      },
    },
    {
      _id: "page-lunch-learn",
      _type: "page",
      title: "Lunch & Learn",
      slug: { _type: "slug", current: "lunch-learn" },
      lunchLearnHero: {
        eyebrow:        "Free · No Obligation · Coast to Coast",
        headingLine1:   "Lunch Is On Us.",
        headingLine2:   "Your Next Spec Is Free.",
        subheading:     "A 45-minute HUB Lunch & Learn delivers everything your team needs to confidently specify decorative pavement, thermoplastic crosswalks, and coloured coatings — real Canadian case studies and spec language you can drop straight into your next RFP.",
        ctaLabel:       "Book Your Free Session",
        formHeading:    "Claim Your Free Lunch & Learn",
        formSubheading: "Tell us who you are and where you are — we handle the rest. Usually within 24 hours.",
        submitLabel:    "Claim Your Free Lunch & Learn →",
      },
    },
  ];

  for (const doc of pages) {
    await upsert(doc);
    console.log(`  ✓ ${doc.title} (slug: ${(doc.slug as { current: string }).current})`);
  }

  console.log(`  ✓ Migrated ${pages.length} page documents`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  HUBSS → Sanity CMS Migration");
  console.log(`  Project: ${client.config().projectId} / ${client.config().dataset}`);
  if (DRY_RUN) console.log("  MODE: DRY RUN — no writes will happen");
  if (PURGE) console.log("  MODE: PURGE — existing documents will be deleted first");
  if (PAGES_ONLY) console.log("  MODE: PAGES ONLY — skipping products/apps/blogs/projects");
  if (DOCS_ONLY) console.log("  MODE: DOCS ONLY — patching product docs + siteSettings resourceDocuments");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  try {
    if (DOCS_ONLY) {
      await migrateDocs();
    } else if (PAGES_ONLY) {
      await migratePages();
    } else {
      await migrateSiteSettings();
      await migrateProducts();
      await migrateApplications();
      await migrateBlogPosts();
      await migrateProjects();
      await migrateDocs();
      await migratePages();
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    if (DRY_RUN) {
      console.log("  DRY RUN complete — no writes were made.");
    } else {
      console.log("  Migration complete.");
      console.log("  Next steps:");
      console.log("  1. Open https://9dbro2m1.sanity.studio/ to verify documents");
      console.log("  2. Set up Sanity webhook → POST /api/revalidate with SANITY_WEBHOOK_SECRET");
      console.log("  3. Follow-up PR: upload images to Sanity CDN");
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (err) {
    console.error("\nMigration failed:", err);
    process.exit(1);
  }
}

main();
