/**
 * scripts/sync-products-to-sanity.ts
 *
 * Phase 2, Increment 2 — Products text content sync.
 *
 * Idempotently overwrites the TEXT fields of every Sanity product doc with
 * the current values from lib/products.ts.
 *
 * Sync targets, per product:
 *   - name, eyebrow, shortDesc
 *   - description (portable text — single block matching the lib paragraph)
 *   - specs (label/value pairs with deterministic keys)
 *   - seo.title, seo.description
 *   - homepageBlurb (the shortDesc again: the homepage Systems card line)
 *
 * Image fields, gallery, related-applications references, and product
 * documents are untouched.
 *
 * Usage:
 *   npx tsx scripts/sync-products-to-sanity.ts            # apply
 *   npx tsx scripts/sync-products-to-sanity.ts --dry-run  # report only
 *   npx tsx scripts/sync-products-to-sanity.ts --dry-run --emit=plan.json
 *     writes the patches it would send as a plan file (id, _rev, set, and the
 *     current values as expect) for .sanity-work/sanity_apply.py on Vern's
 *     machine, which checks each revision, backs up and applies. Needs no token.
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
const EMIT = process.argv.find((a) => a.startsWith("--emit="))?.slice(7);

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
  // Published documents only, so the diff and the patch target what the site
  // shows. With a token the default perspective would mix in Studio drafts.
  perspective: "published",
  // A dry run reads the public dataset with no token at all; a placeholder token
  // is sent as a real one and Sanity answers 401, so the dry run never ran.
  token: token || undefined,
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
  _rev?: string;
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

  const HOMEPAGE_CARDS = new Set(["streetprint", "streetbond", "traffic-patterns-xd", "traffic-patterns", "mmax", "decomark"]);
  // The homepage card line is the product's own line, the Product Portfolio
  // Book's positioning line and subhead (shortDesc), since 17 Oct 2026. The
  // cards fall back to the same field when Studio's blurb is empty
  // (components/sections/ProductsGrid.tsx). Until then the sync carried a
  // verbatim copy of the component's PRODUCT_WHAT table, a third wording of
  // each system kept nowhere else.
  const remoteList: (RemoteProduct & { slug: string })[] = await client.fetch(
    `*[_type == "product"]{ _id, _rev, name, eyebrow, shortDesc, description, homepageBlurb, specs, seo, "slug": slug.current }`
  );
  const remoteBySlug = new Map(remoteList.map(r => [r.slug, r]));

  let changedCount = 0;
  let skippedCount = 0;
  let missingCount = 0;
  const planDocs: { id: string; rev: string; set: Record<string, unknown>; expect: Record<string, unknown> }[] = [];

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
    // Only the six systems the homepage shows carry a blurb; the others keep none.
    const desiredHomepageBlurb = HOMEPAGE_CARDS.has(p.slug) ? p.shortDesc : null;
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

    const set = {
      name: p.name,
      eyebrow: desiredEyebrow,
      shortDesc: p.shortDesc,
      description: desiredDescription,
      homepageBlurb: desiredHomepageBlurb,
      specs: desiredSpecs,
      seo: desiredSeo,
    };
    if (EMIT) {
      // The same set this script would send, plus the values it replaces, so
      // the applier refuses a document someone edited since.
      const expect: Record<string, unknown> = {};
      for (const k of Object.keys(set)) {
        const now = (remote as unknown as Record<string, unknown>)[k];
        if (now !== undefined && now !== null) expect[k] = now;
      }
      planDocs.push({ id: remote._id, rev: remote._rev ?? "", set, expect });
    }
    if (!DRY_RUN) {
      await client
        .patch(remote._id)
        .set(set)
        .commit({ autoGenerateArrayKeys: false });
    }
    changedCount++;
  }

  console.log(`\nDone. ${changedCount} updated, ${skippedCount} already in sync, ${missingCount} missing in Sanity.`);
  if (DRY_RUN) console.log("(dry run — no writes made)");
  if (EMIT) {
    const fs = await import("fs");
    fs.writeFileSync(EMIT, JSON.stringify({ label: "sync-products", docs: planDocs }, null, 1) + "\n");
    console.log(`Plan for sanity_apply.py: ${EMIT} (${planDocs.length} documents)`);
  }
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
