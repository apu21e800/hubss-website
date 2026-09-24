/**
 * Bakes the 1200px WebP copies of every photograph the sitemap offers Google
 * Images, and writes the manifest the sitemap swaps them in from.
 *
 * WHAT IT DOES
 * Calls the real sitemap (lib/sitemap.ts) — so the list it bakes is, by construction, the
 * list the sitemap prints — and for each /images/… photo writes a
 * SEARCH_IMAGE_WIDTH WebP to /public/images/search/<same path>.webp. Then it
 * records every file it wrote in lib/search-images.json. Sizes, paths and the
 * swap itself live in lib/search-images.ts.
 *
 * SAME SHAPE AS THE CATALOGUE, ONE DIFFERENCE
 * Like scripts/gen-catalogue-pages.mjs it runs in `npm run build`, hash-checks
 * its inputs, verifies what it names is on disk, never fails a build over an
 * asset, and serves plain static files — nothing through /_next/image. Unlike
 * the catalogue, the output is NOT committed. The catalogue is 144 pages
 * rasterised on Vern's machine from a PDF that is not in the repo; this is
 * 1,368 photos (~190 MB of WebP) derived from files that are. Committing them
 * would add 190 MB to every clone, and baking them on a laptop is the
 * sustained render loop the P15 cannot take. So Vercel bakes them, and keeps
 * them in .next/cache — which Next leaves alone between builds and Vercel
 * restores into the next one. A warm build re-bakes only photos whose bytes
 * changed; a cold one (first deploy, or "redeploy without cache") bakes all of
 * them, about a minute on Vercel's 4 cores.
 *
 * FAILS SAFE
 * A photo that is missing or will not decode is left out of the manifest and
 * keeps its original URL in the sitemap. If this script does not run at all,
 * the manifest is absent and the sitemap is exactly what it was before.
 *
 * Run by hand:  npm run gen:search-images
 *   --force      re-bake everything
 *   --limit N    first N photos only (a quick check; the manifest lists only those)
 *   --jobs N     parallel encodes (default: one per core)
 */
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import sharp from "sharp";
import {
  SEARCH_IMAGE_MANIFEST,
  SEARCH_IMAGE_QUALITY,
  SEARCH_IMAGE_WIDTH,
  readSearchImageManifest,
  searchImagePath,
} from "../lib/search-images";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const CACHE = path.join(ROOT, ".next", "cache", "search-images");
const LEDGER = path.join(CACHE, "ledger.json");
const SITE = "https://hubss.com";
// Bump when the encode logic changes, so every photo re-bakes once.
const VERSION = 1;

const arg = (name: string) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const FORCE = process.argv.includes("--force");
const LIMIT = Number(arg("--limit")) || Infinity;
const JOBS = Math.max(1, Number(arg("--jobs")) || os.availableParallelism());

const log = (...a: unknown[]) => console.log("[search-images]", ...a);
const warn = (...a: unknown[]) => console.warn("[search-images]", ...a);

/** Every /images/… photo the sitemap names, as source paths. */
async function sitemapSources(): Promise<string[]> {
  // buildSitemap, not the default export: that one reads Sanity through Next's
  // cache, which doesn't exist here. With no photo data the list is every
  // /public photo, a superset of what the live sitemap names.
  const { buildSitemap } = await import("../lib/sitemap");
  // sitemap() already swaps in copies a previous run baked (when this runs
  // locally, the manifest may still be on disk); map those back to sources.
  const previous = readSearchImageManifest();
  const sourceOf = new Map(Object.entries(previous).map(([src, baked]) => [baked, src]));
  const found = new Set<string>();
  for (const entry of buildSitemap()) {
    for (const url of entry.images ?? []) {
      const p = url.startsWith(SITE) ? url.slice(SITE.length) : url;
      const src = sourceOf.get(p) ?? p;
      if (src.startsWith("/images/") && !src.startsWith("/images/search/")) found.add(src);
    }
  }
  return [...found].sort();
}

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function pool<T>(items: T[], n: number, work: (item: T) => Promise<void>) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (next < items.length) await work(items[next++]);
    }),
  );
}

async function main() {
  const started = Date.now();
  let sources: string[];
  try {
    sources = (await sitemapSources()).slice(0, LIMIT);
  } catch (e) {
    warn(`could not read the sitemap (${(e as Error).message}) — the sitemap keeps its original image URLs`);
    fs.writeFileSync(path.join(ROOT, SEARCH_IMAGE_MANIFEST), "{}\n");
    return;
  }

  // One libvips thread per job; the jobs are the parallelism.
  sharp.concurrency(1);
  const ledger = readJson<Record<string, string>>(LEDGER, {});
  const nextLedger: Record<string, string> = {};
  const manifest: Record<string, string> = {};
  const tally = { baked: 0, reused: 0, missing: 0, failed: 0, bytes: 0 };

  await pool(sources, JOBS, async (src) => {
    const file = path.join(PUBLIC, src);
    let bytes: Buffer;
    try {
      bytes = await fs.promises.readFile(file);
    } catch {
      tally.missing++;
      warn(`${src}: not found — the sitemap keeps this URL as it was`);
      return;
    }
    const hash = createHash("sha256")
      .update(JSON.stringify({ VERSION, SEARCH_IMAGE_WIDTH, SEARCH_IMAGE_QUALITY }))
      .update(bytes)
      .digest("hex")
      .slice(0, 16);
    const rel = searchImagePath(src);
    const cached = path.join(CACHE, rel);
    const out = path.join(PUBLIC, rel);
    try {
      if (FORCE || ledger[src] !== hash || !fs.existsSync(cached)) {
        await fs.promises.mkdir(path.dirname(cached), { recursive: true });
        // .rotate() applies the EXIF orientation, as next/image does.
        // failOn "error", not sharp's default "warning": sport-courts-04.jpg
        // carries a libjpeg warning ("Invalid SOS parameters for sequential
        // JPEG") that browsers ignore and that failed the whole file here. It
        // decodes to a correct picture; a genuinely broken file still fails.
        await sharp(bytes, { failOn: "error" })
          .rotate()
          .resize({ width: SEARCH_IMAGE_WIDTH, withoutEnlargement: true })
          .webp({ quality: SEARCH_IMAGE_QUALITY })
          .toFile(cached);
        tally.baked++;
      } else {
        tally.reused++;
      }
      await fs.promises.mkdir(path.dirname(out), { recursive: true });
      await fs.promises.copyFile(cached, out);
      // Await first, then add: `tally.bytes += await …` reads the total before
      // the await, so parallel jobs overwrote each other and the log undercounted.
      const { size } = await fs.promises.stat(out);
      tally.bytes += size;
      nextLedger[src] = hash;
      manifest[src] = rel;
    } catch (e) {
      tally.failed++;
      warn(`${src}: ${(e as Error).message} — the sitemap keeps this URL as it was`);
    }
  });

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(path.join(ROOT, SEARCH_IMAGE_MANIFEST), JSON.stringify(sorted, null, 2) + "\n");
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(LEDGER, JSON.stringify({ ...ledger, ...nextLedger }, null, 2) + "\n");

  const secs = ((Date.now() - started) / 1000).toFixed(1);
  const mb = (tally.bytes / 1024 / 1024).toFixed(0);
  log(
    `${Object.keys(manifest).length} of ${sources.length} photos ready (${tally.baked} baked, ${tally.reused} from cache` +
      `${tally.missing ? `, ${tally.missing} missing` : ""}${tally.failed ? `, ${tally.failed} failed` : ""}) — ${mb} MB, ${secs}s, ${JOBS} jobs`,
  );
}

main().catch((e) => {
  // Never fail the build over this: without a manifest the sitemap is unchanged.
  console.warn("[search-images] FAILED:", (e as Error).message);
});
