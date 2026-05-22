/**
 * scripts/sync-applications-to-sanity.ts
 *
 * Phase 2 — Applications text content sync.
 *
 * Idempotently overwrites the TEXT fields of every Sanity application
 * document with the current values from lib/applications.ts. Image fields
 * (heroImageUrl, galleryUrls) and reference fields (relatedProducts) are
 * left alone — this script is text-only.
 *
 * The fields synced are: name, shortDesc, description (portable text),
 * seo.title, seo.description.
 *
 * Usage:
 *   npx tsx scripts/sync-applications-to-sanity.ts            # apply
 *   npx tsx scripts/sync-applications-to-sanity.ts --dry-run  # report only
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local (already present).
 */

import { createClient } from "@sanity/client";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { config as loadDotenv } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// Load .env.local so SANITY_API_WRITE_TOKEN is available.
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

interface LibApplication {
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface BlockSpan { _type: "span"; _key: string; text: string; marks: string[] }
interface Block { _type: "block"; _key: string; style: "normal"; children: BlockSpan[]; markDefs: [] }

function toPortableText(text: string): Block[] {
  // Lib descriptions are single paragraphs. Split on blank lines defensively.
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  return paragraphs.map((p, i) => ({
    _type: "block",
    _key: `block${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `span${i}`, text: p.trim(), marks: [] }],
  }));
}

interface RemoteApp {
  _id: string;
  name?: string;
  shortDesc?: string;
  description?: Block[];
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

async function main() {
  console.log(`Sync applications → Sanity${DRY_RUN ? " (DRY RUN)" : ""}`);

  const mod = await import(
    pathToFileURL(path.join(ROOT, "lib", "applications.ts")).href
  );
  const libApps: LibApplication[] = mod.applications;
  console.log(`  Loaded ${libApps.length} applications from lib/applications.ts`);

  const remoteList: RemoteApp[] = await client.fetch(
    `*[_type == "application"]{ _id, name, shortDesc, description, seo, "slug": slug.current }`
  );
  const remoteBySlug = new Map<string, RemoteApp & { slug: string }>(
    remoteList.map(r => [(r as RemoteApp & { slug: string }).slug, r as RemoteApp & { slug: string }])
  );

  let changedCount = 0;
  let skippedCount = 0;
  let missingCount = 0;

  for (const app of libApps) {
    const remote = remoteBySlug.get(app.slug);
    if (!remote) {
      console.log(`  ? no Sanity doc for slug=${app.slug} — skipping (Sanity must be seeded first)`);
      missingCount++;
      continue;
    }

    const desiredDescription = toPortableText(app.description);
    const desiredSeo = {
      title: app.seoTitle ?? null,
      description: app.seoDescription ?? null,
    };

    const diffs: string[] = [];
    if (remote.name !== app.name)
      diffs.push(`name: "${remote.name}" → "${app.name}"`);
    if (remote.shortDesc !== app.shortDesc)
      diffs.push(`shortDesc: "${remote.shortDesc}" → "${app.shortDesc}"`);
    if (!blocksEqual(remote.description, desiredDescription))
      diffs.push(`description: <changed>`);
    if ((remote.seo?.title ?? null) !== desiredSeo.title)
      diffs.push(`seo.title: "${remote.seo?.title}" → "${desiredSeo.title}"`);
    if ((remote.seo?.description ?? null) !== desiredSeo.description)
      diffs.push(`seo.description: <changed>`);

    if (diffs.length === 0) {
      skippedCount++;
      continue;
    }

    console.log(`  ✏  ${app.slug}`);
    for (const d of diffs) console.log(`      ${d}`);

    if (!DRY_RUN) {
      await client
        .patch(remote._id)
        .set({
          name: app.name,
          shortDesc: app.shortDesc,
          description: desiredDescription,
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
