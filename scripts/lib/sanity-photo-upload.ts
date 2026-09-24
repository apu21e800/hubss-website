/**
 * Putting photos from /public into Sanity, each one once.
 *
 * Shared by scripts/sync-photos-to-sanity.ts (product, application and page
 * photos) and scripts/import-blog-to-sanity.ts (blog photos), so a photo used
 * in a gallery and in a post is one asset.
 *
 * Each upload is at most 2400px on the long edge, JPEG q82 (mozjpeg), with
 * camera metadata stripped. The asset records where it came from:
 *   source.name  "hubss-public"
 *   source.id    sha1 of the ORIGINAL file, so a re-run finds it and skips it
 *   source.url   its /public path, which lib/photos.ts exposes as `origin`
 *                (lib/image-seo.ts reads SEO keywords from a photo's folder)
 */

import type { SanityClient } from "@sanity/client";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const PHOTO_SOURCE = "hubss-public";
const MAX_EDGE = 2400;
const QUALITY = 82;

const ROOT = process.cwd();

/** A /images/... path → the file on disk. */
export const absPath = (src: string) => path.join(ROOT, "public", src.replace(/^\/+/, ""));

const sha1Cache = new Map<string, string>();
/** sha1 of the original file: the photo's identity in Sanity. */
export function sha1Of(src: string): string {
  let h = sha1Cache.get(src);
  if (!h) {
    h = createHash("sha1").update(fs.readFileSync(absPath(src))).digest("hex");
    sha1Cache.set(src, h);
  }
  return h;
}

async function resized(src: string): Promise<Buffer> {
  // failOn "none": decode what a browser would. sport-courts-04.jpg (a Samsung
  // phone photo) trips libjpeg's "Invalid SOS parameters for sequential JPEG"
  // warning, which sharp treats as fatal by default; the whole image decodes
  // fine when it's allowed to. It was the only one of 1,618 photos, and it
  // stopped the first full sync on 24 Sep 2026.
  return sharp(absPath(src), { failOn: "none" })
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
}

/** Runs `work` over `items`, `n` at a time. */
export async function pool<T>(items: T[], n: number, work: (item: T, i: number) => Promise<void>) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (next < items.length) { const i = next++; await work(items[i], i); }
  }));
}

/** Photos already in Sanity from earlier runs: sha1 of the original → asset _id. */
export async function uploadedPhotos(client: SanityClient): Promise<Map<string, string>> {
  const existing: { _id: string; id: string }[] = await client.fetch(
    `*[_type == "sanity.imageAsset" && source.name == $source]{ _id, "id": source.id }`,
    { source: PHOTO_SOURCE }
  );
  return new Map(existing.map((a) => [a.id, a._id]));
}

/**
 * Uploads every photo in `srcs` that `bySha` doesn't have yet, four at a time,
 * and adds each new asset to `bySha`.
 *
 * One bad file or a dropped connection doesn't stop the batch: each upload is
 * tried three times (waiting 2 s, then 8 s), the rest carry on, and the photos
 * that still failed are listed at the end and thrown, so no document is ever
 * pointed at a missing asset. Everything uploaded is kept; a re-run skips it.
 */
export async function uploadMissing(client: SanityClient, srcs: string[], bySha: Map<string, string>): Promise<{ uploaded: number; bytes: number }> {
  const todo = [...new Set(srcs)].filter((s) => !bySha.has(sha1Of(s)));
  // Two paths can hold the same file; upload it once.
  const bySrcSha = new Map<string, string>();
  for (const s of todo) if (![...bySrcSha.values()].includes(sha1Of(s))) bySrcSha.set(s, sha1Of(s));
  const unique = [...bySrcSha.keys()];
  const failed: { src: string; reason: string }[] = [];
  let done = 0, bytes = 0;
  await pool(unique, 4, async (src) => {
    for (let attempt = 1; ; attempt++) {
      try {
        const body = await resized(src);
        const asset = await client.assets.upload("image", body, {
          filename: path.basename(src).replace(/\.(png|webp|jpe?g)$/i, ".jpg"),
          source: { name: PHOTO_SOURCE, id: sha1Of(src), url: src },
          creditLine: "HUB Surface Systems",
        });
        bySha.set(sha1Of(src), asset._id);
        done++; bytes += body.length;
        process.stdout.write(`\r  uploaded ${done}/${unique.length} (${(bytes / 1048576).toFixed(0)} MB)   `);
        return;
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        if (attempt >= 3) { failed.push({ src, reason }); return; }
        await new Promise((r) => setTimeout(r, attempt === 1 ? 2000 : 8000));
      }
    }
  });
  if (unique.length) process.stdout.write("\n");
  if (failed.length) {
    console.error(`\n  ${failed.length} photo(s) could not be uploaded (the other ${done} were, and a re-run skips them):`);
    for (const f of failed) console.error(`   - ${f.src}: ${f.reason}`);
    throw new Error(`${failed.length} photo(s) failed to upload; nothing was pointed at them. Re-run to retry.`);
  }
  return { uploaded: unique.length, bytes };
}
