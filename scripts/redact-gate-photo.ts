/**
 * The gate photo without its house number (28 Oct 2026).
 *
 * streetprint-86.jpg (the StreetPrint estate driveway between brick gate
 * pillars) showed the house's number on the wall plaque: on the homepage's
 * StreetPrint card, in the StreetPrint gallery, and as the cover of "How
 * stamped asphalt is installed in three steps". Since this commit the repo's
 * file is the retouched one (the plaque is plain). This script makes Studio
 * match: it uploads that file as a new asset and points the two documents
 * that use the old one at it. Their alt, hotspot and crop stay as they are,
 * and `originAsset` moves with the asset so the site keeps serving the
 * repo's copy where it did before (lib/sanity.queries.ts PHOTO_PROJECTION).
 *
 *   npx tsx scripts/redact-gate-photo.ts --dry-run   # reads only; no token needed
 *   npx tsx scripts/redact-gate-photo.ts             # needs SANITY_API_WRITE_TOKEN in .env.local
 *
 * Safe to run twice: a document already on the new photo is left alone, and
 * an open Studio draft of either document is moved too, so publishing it
 * later can't bring the number back. The old asset stays in Studio, unused:
 * nothing is deleted.
 */
import { createClient } from "@sanity/client";
import { createHash } from "crypto";
import { createReadStream, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotenv } from "dotenv";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(ROOT, ".env.local"), quiet: true });

const DRY = process.argv.includes("--dry-run");
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const FILE = path.join(ROOT, "public/images/products/streetprint/streetprint-86.jpg");
/** The asset the photo was first uploaded as, number and all. */
const OLD = "image-58d95130447a89746727a9fedf0bc90f1ed82a77-1920x818-jpg";
/**
 * The SHA-1 of the retouched file this commit puts in the repo. Checked
 * positively: Studio's old asset is a re-encode of the original, so its hash
 * differs from the original file's, and a "not the old asset" check would let
 * an un-pulled copy (the one with the number) through (review, PR #114).
 */
const RETOUCHED_SHA1 = "85c8126f709e90a434f5c3bc59b17171e54df3f7";
const USES = [
  { id: "product-streetprint", field: "heroImage" },
  { id: "blogpost-how-stamped-asphalt-is-installed", field: "featuredImage" },
] as const;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: TOKEN || undefined,
});

type Doc = { _id: string; _rev: string; [k: string]: unknown };
const assetOf = (doc: Doc, field: string) => ((doc[field] as { asset?: { _ref?: string } } | undefined)?.asset?._ref ?? "");

async function main() {
  // Only the retouched file goes up: anything else (the original, before
  // `git pull`, or a later edit) stops here.
  const sha = createHash("sha1").update(readFileSync(FILE)).digest("hex");
  if (sha !== RETOUCHED_SHA1) {
    console.error("The repo's streetprint-86.jpg isn't the retouched one (run `git pull` first). Nothing written.");
    process.exit(1);
  }
  if (!DRY && !TOKEN) {
    console.error("SANITY_API_WRITE_TOKEN missing from .env.local: nothing written.");
    process.exit(1);
  }

  // The published documents, and (with a token) any open drafts of them.
  const ids = USES.flatMap((u) => (TOKEN ? [u.id, `drafts.${u.id}`] : [u.id]));
  const docs = await client.fetch<Doc[]>(`*[_id in $ids]`, { ids });
  const todo: { doc: Doc; field: string }[] = [];
  for (const u of USES) {
    for (const doc of docs.filter((d) => d._id === u.id || d._id === `drafts.${u.id}`)) {
      const now = assetOf(doc, u.field);
      if (now === OLD) todo.push({ doc, field: u.field });
      else console.log(`${doc._id}.${u.field}: already another photo (${now || "none"}), left alone`);
    }
  }
  if (!TOKEN) console.log("(no token: open drafts can't be read, so only published documents are listed)");
  for (const t of todo) console.log(`${t.doc._id}.${t.field}: ${OLD} -> the retouched photo`);
  if (!todo.length) { console.log("Nothing to do."); return; }
  if (DRY) { console.log("\n(dry run: nothing written)"); return; }

  const asset = await client.assets.upload("image", createReadStream(FILE), { filename: "streetprint-86.jpg" });
  console.log(`Uploaded: ${asset._id}`);
  for (const t of todo) {
    await client
      .patch(t.doc._id)
      .ifRevisionId(t.doc._rev)
      .set({ [`${t.field}.asset`]: { _type: "reference", _ref: asset._id }, [`${t.field}.originAsset`]: asset._id })
      .commit();
    console.log(`Done: ${t.doc._id}.${t.field}`);
  }
  console.log("The site picks the change up within the hour (or at the next deploy).");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
