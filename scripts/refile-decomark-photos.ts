/**
 * Two DecoMark photos out of Studio's TrafficPatterns gallery (28 Oct 2026).
 *
 * The TrafficPatterns product's gallery in Studio holds two DecoMark photos,
 * captioned as TrafficPatterns:
 * - the Fort Langley land recognition (the printed book, p.114, and the map's
 *   DecoMark pin, fort-langley-land-recognition);
 * - a DecoMark medallion whose photo is already in the DecoMark gallery
 *   (decomark-69).
 * This takes both out of TrafficPatterns and adds the Fort Langley photo to
 * the end of DecoMark's gallery, captioned from those records. Its `origin` is
 * the repo's copy, /images/products/decomark/decomark-79.jpg (PR #112), so the
 * site's caption rules (lib/image-seo.ts) read it as DecoMark's.
 *
 *   npx tsx scripts/refile-decomark-photos.ts --dry-run   # reads only; no token needed
 *   npx tsx scripts/refile-decomark-photos.ts             # needs SANITY_API_WRITE_TOKEN in .env.local
 *
 * Doug curates these galleries, so this moves two photos he may have placed.
 * The photos themselves stay in Studio; only the gallery entries change. An
 * open Studio draft of either product is changed the same way. Safe to run
 * twice: an entry already gone or already added is left alone.
 */
import { createClient } from "@sanity/client";
import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotenv } from "dotenv";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(ROOT, ".env.local"), quiet: true });

const DRY = process.argv.includes("--dry-run");
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;

const FORT_LANGLEY = "image-1b2cb6050840a10057e1585cf83bf07013c07e0f-1800x2400-jpg";
const MEDALLION = "image-dd80d2b6ea4941ede1fa60c01615b76aba4b27e7-2400x1800-jpg";
/** The TrafficPatterns gallery entries to take out, by key, with the photo each must hold. */
const OUT = [
  { key: "p461d2fae9d626bd", asset: FORT_LANGLEY },
  { key: "pf3de0b49d4d37ec", asset: MEDALLION },
];
const LINE = "DecoMark First Nations land recognition, Fort Langley, British Columbia";
const ADD = {
  _key: "decomark79fortlangley",
  _type: "image",
  alt: LINE,
  caption: LINE,
  asset: { _type: "reference", _ref: FORT_LANGLEY },
  origin: "/images/products/decomark/decomark-79.jpg",
  originAsset: FORT_LANGLEY,
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: TOKEN || undefined,
});

type Entry = { _key: string; asset?: { _ref?: string } };
type Doc = { _id: string; _rev: string; gallery?: Entry[] };

async function main() {
  if (!DRY && !TOKEN) {
    console.error("SANITY_API_WRITE_TOKEN missing from .env.local: nothing written.");
    process.exit(1);
  }
  const base = ["product-traffic-patterns", "product-decomark"];
  const ids = TOKEN ? base.flatMap((id) => [id, `drafts.${id}`]) : base;
  const docs = await client.fetch<Doc[]>(`*[_id in $ids]{_id, _rev, gallery[]{_key, asset}}`, { ids });
  if (!TOKEN) console.log("(no token: open drafts can't be read, so only the published products are listed)");

  const plans: { doc: Doc; remove: string[]; add: boolean }[] = [];
  for (const doc of docs) {
    const gallery = doc.gallery ?? [];
    if (doc._id.endsWith("product-traffic-patterns")) {
      const remove = OUT.filter((o) => gallery.some((e) => e._key === o.key && e.asset?._ref === o.asset)).map((o) => o.key);
      const strays = OUT.filter((o) => gallery.some((e) => e._key === o.key && e.asset?._ref !== o.asset));
      for (const s of strays) console.log(`${doc._id}: entry ${s.key} now holds another photo, left alone`);
      if (remove.length) plans.push({ doc, remove, add: false });
      else console.log(`${doc._id}: neither DecoMark photo is in its gallery any more`);
    } else {
      const has = gallery.some((e) => e.asset?._ref === FORT_LANGLEY);
      if (!has) plans.push({ doc, remove: [], add: true });
      else console.log(`${doc._id}: already has the Fort Langley photo`);
    }
  }
  for (const p of plans) {
    if (p.remove.length) console.log(`${p.doc._id}: take out ${p.remove.join(", ")} (${p.doc.gallery?.length ?? 0} photos now)`);
    if (p.add) console.log(`${p.doc._id}: add the Fort Langley photo at the end, "${LINE}" (${p.doc.gallery?.length ?? 0} photos now)`);
  }
  if (!plans.length) { console.log("Nothing to do."); return; }
  if (DRY) { console.log("\n(dry run: nothing written)"); return; }

  for (const p of plans) {
    let patch = client.patch(p.doc._id).ifRevisionId(p.doc._rev);
    if (p.remove.length) patch = patch.unset(p.remove.map((k) => `gallery[_key=="${k}"]`));
    if (p.add) patch = patch.setIfMissing({ gallery: [] }).append("gallery", [ADD]);
    await patch.commit();
    console.log(`Done: ${p.doc._id}`);
  }
  console.log("The product pages pick the change up within the hour (or at the next deploy).");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
