/**
 * scripts/sync-products-to-sanity.ts
 *
 * Phase 2, Increment 2 — Products text content sync.
 *
 * Idempotently overwrites the TEXT fields of every Sanity product doc with
 * the current values from lib/products.ts (and PRODUCT_WHAT from
 * components/sections/ProductsGrid.tsx for the homepage blurb).
 *
 * Sync targets, per product:
 *   - name, eyebrow, shortDesc
 *   - description (portable text — single block matching the lib paragraph)
 *   - specs (label/value pairs with deterministic keys)
 *   - seo.title, seo.description
 *   - homepageBlurb (from PRODUCT_WHAT — homepage Systems card copy)
 *
 * Image fields, gallery, related-applications references, and product
 * documents are untouched.
 *
 * PRODUCT_TYPE and PRODUCT_STAT in ProductsGrid.tsx are presently dead
 * code (type chip removed per Vernon's note; stat never referenced in
 * JSX), so they are intentionally NOT synced. Lib retains them as the
 * fallback if the UI ever re-uses them.
 *
 * Usage:
 *   npx tsx scripts/sync-products-to-sanity.ts            # apply
 *   npx tsx scripts/sync-products-to-sanity.ts --dry-run  # report only
 */

import { createClient } from "@sanity/client";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { config as loadDotenv } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

loadDotenv({ path: path.join(ROOT, ".env.local") });

const DRY_RUN = process.argv.includes("--dry-run");

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token && !DRY_RUN) {
  console.error("ERROR: SANITY_API_WRITE_TOKEN missing from environment.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: token ?? "dry-run-no-token",
});

interface LibProduct {
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  eyebrow?: string;
  specs: { label: string; value: string }[];
  seoTitle?: string;
  seoDescription?: string;
}

interface BlockSpan { _type: "span"; _key: string; text: string; marks: string[] }
interface Block { _type: "block"; _key: string; style: "normal"; children: BlockSpan[]; markDefs: [] }

function toPortableText(text: string): Block[] {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  return paragraphs.map((p, i) => ({
    _type: "block",
    _key: `block${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `span${i}`, text: p.trim(), marks: [] }],
  }));
}

function specKey(label: string, i: number): string {
  return `spec_${i}_${label.replace(/[^a-z0-9]/gi, "_").slice(0, 30)}`;
}

interface SpecItem { _key?: string; label: string; value: string }
interface RemoteProduct {
  _id: string;
  name?: string;
  eyebrow?: string;
  shortDesc?: string;
  description?: Block[];
  homepageBlurb?: string;
  specs?: SpecItem[];
  seo?: { title?: string | null; description?: string | null };
}

function blocksEqual(a: Block[] | undefined, b: Block[]): boolean {
  if (!a || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const ac = a[i].children?.map(c => c.text).join("") ?? "";
    const bc = b[i].children?.map(c => c.text).join("") ?? "";
    if (ac !== bc) return false;
  }
  return true;
}

function specsEqual(a: SpecItem[] | undefined, b: SpecItem[]): boolean {
  if (!a || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].label !== b[i].label || a[i].value !== b[i].value) return false;
  }
  return true;
}

async function main() {
  console.log(`Sync products → Sanity${DRY_RUN ? " (DRY RUN)" : ""}`);

  const productsMod = await import(
    pathToFileURL(path.join(ROOT, "lib", "products.ts")).href
  );
  const libProducts: LibProduct[] = productsMod.products;
  console.log(`  Loaded ${libProducts.length} products from lib/products.ts`);

  // PRODUCT_WHAT lives inside the ProductsGrid component file — re-declare here
  // rather than parsing the component module (which carries JSX deps). The
  // values below are a verbatim copy from components/sections/ProductsGrid.tsx
  // and must be kept in sync if that file changes.
  const PRODUCT_WHAT: Record<string, string> = {
    "streetprint":
      "In-place stamped asphalt — cobblestone, brick, herringbone and a wide variety of other patterns. No demolition, no raised edges, snowplow-safe. Looks like stone, performs like asphalt.",
    "streetbond":
      "Water based, epoxy modified acrylic coatings that transform asphalt and concrete.",
    "traffic-patterns-xd":
      "Aggregate-reinforced, preformed thermoplastic that is purpose engineered for the toughest environments. High performance crosswalks, entrance features and endless other applications.",
    "traffic-patterns":
      "Preformed thermoplastic that is custom fabricated to put your design into a functional surface for use in endless environments. Used all across North America for unique messaging, branding, community expression, schools, etc.",
    "mmax":
      "MMA resin with performance aggregates for use in area markings like bus lanes, bike lanes, and other visual needs in high traffic environments. Fast installation. Full range of colours. Extended season formula for shoulder season applications.",
    "decomark":
      "Preformed thermoplastic that is custom fabricated to put your design into a functional surface for use in endless environments. Used all across North America for unique messaging, branding, community expression, schools, etc.",
  };

  const remoteList: (RemoteProduct & { slug: string })[] = await client.fetch(
    `*[_type == "product"]{ _id, name, eyebrow, shortDesc, description, homepageBlurb, specs, seo, "slug": slug.current }`
  );
  const remoteBySlug = new Map(remoteList.map(r => [r.slug, r]));

  let changedCount = 0;
  let skippedCount = 0;
  let missingCount = 0;

  for (const p of libProducts) {
    const remote = remoteBySlug.get(p.slug);
    if (!remote) {
      console.log(`  ? no Sanity doc for slug=${p.slug} — skipping`);
      missingCount++;
      continue;
    }

    const desiredDescription = toPortableText(p.description);
    const desiredSpecs: SpecItem[] = (p.specs ?? []).map((s, i) => ({
      _key: specKey(s.label, i),
      label: s.label,
      value: s.value,
    }));
    const desiredSeo = {
      title: p.seoTitle ?? null,
      description: p.seoDescription ?? null,
    };
    const desiredHomepageBlurb = PRODUCT_WHAT[p.slug] ?? null;
    const desiredEyebrow = p.eyebrow ?? null;

    const diffs: string[] = [];
    if (remote.name !== p.name)
      diffs.push(`name: "${remote.name}" → "${p.name}"`);
    if ((remote.eyebrow ?? null) !== desiredEyebrow)
      diffs.push(`eyebrow: "${remote.eyebrow}" → "${desiredEyebrow}"`);
    if (remote.shortDesc !== p.shortDesc)
      diffs.push(`shortDesc: <changed>`);
    if (!blocksEqual(remote.description, desiredDescription))
      diffs.push(`description: <changed>`);
    if ((remote.homepageBlurb ?? null) !== desiredHomepageBlurb)
      diffs.push(`homepageBlurb: ${remote.homepageBlurb ? "<changed>" : "<set>"}`);
    if (!specsEqual(remote.specs, desiredSpecs))
      diffs.push(`specs: <changed> (${remote.specs?.length ?? 0} → ${desiredSpecs.length})`);
    if ((remote.seo?.title ?? null) !== desiredSeo.title)
      diffs.push(`seo.title: <changed>`);
    if ((remote.seo?.description ?? null) !== desiredSeo.description)
      diffs.push(`seo.description: <changed>`);

    if (diffs.length === 0) {
      skippedCount++;
      continue;
    }

    console.log(`  ✏  ${p.slug}`);
    for (const d of diffs) console.log(`      ${d}`);

    if (!DRY_RUN) {
      await client
        .patch(remote._id)
        .set({
          name: p.name,
          eyebrow: desiredEyebrow,
          shortDesc: p.shortDesc,
          description: desiredDescription,
          homepageBlurb: desiredHomepageBlurb,
          specs: desiredSpecs,
          seo: desiredSeo,
        })
        .commit({ autoGenerateArrayKeys: false });
    }
    changedCount++;
  }

  console.log(`\nDone. ${changedCount} updated, ${skippedCount} already in sync, ${missingCount} missing in Sanity.`);
  if (DRY_RUN) console.log("(dry run — no writes made)");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
