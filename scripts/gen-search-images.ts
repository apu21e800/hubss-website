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
 * THE PALETTE'S THUMBNAILS (2 Oct 2026)
 * Vern: "search function is a bit dull too, could add image thumbnails or
 * something?!" The 1200px copies above are for Google Images and far too
 * heavy for a 56px row (about 160 KB each), and the palette never used them.
 * So a second pass bakes a square 128px and 256px WebP for every search entry
 * that has a picture, into /public/images/search/thumbs/<kind>/<id>-<size>.webp:
 * the product card photo, the application hero, each post's featured image
 * and each map pin's first photo (both from Sanity, fetched here, once, so the
 * palette never asks Sanity for anything while someone types), a spec sheet's
 * rendered first page, a stamping template. Which entries those are, and the
 * file names, come from lib/search.ts, so the palette and this script cannot
 * disagree. Hash-skipped like the sitemap copies (a ledger in .next/cache), so
 * a warm build re-bakes only what changed; a cold one takes under a minute.
 * A thumbnail that cannot be made is left out and its row shows the HUB wheel.
 *
 * Run by hand:  npm run gen:search-images
 *   --force        re-bake everything
 *   --limit N      first N photos only (a quick check; the manifest lists only those)
 *   --jobs N       parallel encodes (default: one per core)
 *   --thumbs-only  just the palette's thumbnails (seconds, not minutes)
 */
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { createClient } from "@sanity/client";
import { config as loadDotenv } from "dotenv";
import sharp from "sharp";
import {
  SEARCH_IMAGE_MANIFEST,
  SEARCH_IMAGE_QUALITY,
  SEARCH_IMAGE_WIDTH,
  readSearchImageManifest,
  searchImagePath,
} from "../lib/search-images";
import { PAGE_THUMBS, THUMB_SIZES, documentHasThumb, thumbBase, withColours } from "../lib/search";
import { products } from "../lib/products";
import { applications } from "../lib/applications";
import { applicationImages, resolveImage } from "../lib/featured-images";
import { HERO_POSITION } from "../lib/hero-framing";
import { mapProjects } from "../lib/map-projects";
import { resourceDocuments } from "../lib/resource-documents";
import { previewFor } from "../lib/pdf-previews";
import { PATTERN_TEMPLATES, patternSrc } from "../lib/pattern-templates";
import { isArchivedPost } from "../lib/field-notes-taxonomy";
import { CARD_IMAGES } from "../lib/product-card-images.mjs";
import blogIndex from "../lib/blog-index.json";

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
const THUMBS_ONLY = process.argv.includes("--thumbs-only");

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

async function sitemapCopies() {
  const started = Date.now();
  let sources: string[];
  try {
    sources = (await sitemapSources()).slice(0, LIMIT);
  } catch (e) {
    warn(`could not read the sitemap (${(e as Error).message}) — the sitemap keeps its original image URLs`);
    fs.writeFileSync(path.join(ROOT, SEARCH_IMAGE_MANIFEST), "{}\n");
    return;
  }

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

// ── The palette's thumbnails ────────────────────────────────────────────────
// See "THE PALETTE'S THUMBNAILS" at the top. Sizes and file names live in
// lib/search.ts (THUMB_SIZES, thumbBase); this decides what each one is cut from.

/** Bump when the crop or encode logic changes, so every thumbnail re-bakes once. */
const THUMB_VERSION = 1;
const THUMB_QUALITY = 72;
/** Every picture is brought down to this before the square is cut: plenty for 256px, cheap to decode. */
const THUMB_WORK = 512;
/**
 * A stamping template's square: this fraction of the sheet's width, centred
 * here. Low enough that the border sheets' dimension line above the field
 * stays out of frame.
 */
const PATTERN_SQUARE = 0.28;
const PATTERN_CENTRE: [number, number] = [0.48, 0.53];
/** What transparent pixels become: the dark card colour, so a template's white linework shows in both themes. */
const THUMB_BACKGROUND = "#20201F";
const THUMB_LEDGER = path.join(CACHE, "thumbs-ledger.json");

const sanityProject = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1";
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

interface ThumbJob {
  /** thumbBase(): /images/search/thumbs/<kind>/<id>. */
  base: string;
  /** A /public path. */
  file?: string;
  /** A Sanity CDN address, fetched here at build. */
  url?: string;
  /** Sanity was unreachable: keep the last good copy if there is one. */
  keepOnly?: boolean;
  treat: "photo" | "pattern";
  /** CSS object-position for the square, as the cards and heroes use it. */
  position?: string;
}

/** CSS object-position, the subset a crop needs (as scripts/gen-card-images.mjs reads it). */
function cropPosition(position = "50% 50%"): [number, number] {
  const KEYWORDS: Record<string, [number | null, number | null]> = {
    left: [0, null], right: [1, null], top: [null, 0], bottom: [null, 1], center: [null, null],
  };
  let x = 0.5;
  let y = 0.5;
  position.trim().toLowerCase().split(/\s+/).filter(Boolean).slice(0, 2).forEach((p, i) => {
    const pct = /^(-?\d+(?:\.\d+)?)%$/.exec(p);
    if (pct) {
      const v = Math.min(1, Math.max(0, Number(pct[1]) / 100));
      if (i === 0) x = v;
      else y = v;
    } else if (p in KEYWORDS) {
      const [kx, ky] = KEYWORDS[p];
      if (kx !== null) x = kx;
      if (ky !== null) y = ky;
    }
  });
  return [x, y];
}

/** "image-<id>-<w>x<h>-<ext>" -> its CDN file, as scripts/gen-nav-insights.ts reads a ref. */
function sanityFile(ref: string): { file: string; width: number; height: number } | null {
  const m = /^image-([a-zA-Z0-9]+)-(\d+)x(\d+)-([a-z0-9]+)$/.exec(ref);
  return m ? { file: `${m[1]}-${m[2]}x${m[3]}.${m[4]}`, width: Number(m[2]), height: Number(m[3]) } : null;
}

interface SanityImage {
  ref?: string | null;
  hotspot?: { x?: number | null; y?: number | null } | null;
  crop?: { top?: number | null; bottom?: number | null; left?: number | null; right?: number | null } | null;
}

/**
 * A square from a post's featured image, honouring the editor's crop and
 * hotspot the way the Insights menu does (scripts/gen-nav-insights.ts). JPEG at
 * high quality: this is an intermediate, re-encoded below.
 */
function postSquareUrl(image: SanityImage): string | null {
  const asset = sanityFile(image.ref ?? "");
  if (!asset) return null;
  const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
  const c = image.crop ?? {};
  const [l, r, t, b] = [c.left ?? 0, c.right ?? 0, c.top ?? 0, c.bottom ?? 0].map(clamp01);
  const q: string[] = [];
  if (l || r || t || b) {
    q.push(
      `rect=${Math.round(asset.width * l)},${Math.round(asset.height * t)},` +
        `${Math.max(1, Math.round(asset.width * (1 - l - r)))},${Math.max(1, Math.round(asset.height * (1 - t - b)))}`,
    );
  }
  q.push(`w=${THUMB_WORK}`, `h=${THUMB_WORK}`, "fit=crop");
  const h = image.hotspot;
  if (h && typeof h.x === "number" && typeof h.y === "number") {
    const fx = clamp01((h.x - l) / Math.max(1e-6, 1 - l - r));
    const fy = clamp01((h.y - t) / Math.max(1e-6, 1 - t - b));
    q.push("crop=focalpoint", `fp-x=${fx.toFixed(3)}`, `fp-y=${fy.toFixed(3)}`);
  }
  q.push("fm=jpg", "q=90");
  return `https://cdn.sanity.io/images/${sanityProject}/${sanityDataset}/${asset.file}?${q.join("&")}`;
}

/** slug -> featured image square, for every post Sanity has; null when Sanity cannot be reached. */
async function postImages(): Promise<Map<string, string> | null> {
  loadDotenv({ path: path.join(ROOT, ".env.local"), quiet: true });
  const client = createClient({
    projectId: sanityProject,
    dataset: sanityDataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    perspective: "published",
    token: process.env.SANITY_API_READ_TOKEN || undefined,
  });
  try {
    const rows = await client.fetch<{ slug: string; image: SanityImage | null }[]>(
      `*[_type == "blogPost" && defined(slug.current)]{ "slug": slug.current, "image": featuredImage{ "ref": asset._ref, hotspot, crop } }`,
    );
    const out = new Map<string, string>();
    for (const r of rows) {
      const url = r.image ? postSquareUrl(r.image) : null;
      if (url) out.set(r.slug, url);
    }
    return out;
  } catch (e) {
    warn(`thumbs: Sanity did not answer (${(e as Error).message}); posts keep their last good thumbnails`);
    return null;
  }
}

/** A map pin's /images/map photo has a 640px "-sm" twin: plenty for a 256px square, and quick to read. */
function mapPhotoFile(src: string): string {
  const sm = src.replace(/\.jpg$/, "-sm.jpg");
  return sm !== src && fs.existsSync(path.join(PUBLIC, sm)) ? sm : src;
}

const decoded = (href: string) => {
  try {
    return decodeURIComponent(href);
  } catch {
    return href;
  }
};

/** What every thumbnail is cut from. The list mirrors buildIndex() in lib/search.ts. */
async function thumbJobs(): Promise<ThumbJob[]> {
  const jobs: ThumbJob[] = [];
  const cards = CARD_IMAGES as Record<string, { src: string; position: string }>;
  for (const p of products) {
    if (p.comingSoon) continue;
    const card = cards[p.slug];
    if (card) jobs.push({ base: thumbBase("product", p.slug), file: card.src, treat: "photo", position: card.position });
  }
  for (const a of applications) {
    const src = applicationImages[a.slug] ? resolveImage(applicationImages[a.slug]).src : a.imageUrl;
    // The hero framing keeps the subject in a near-square phone crop, which is
    // what a square thumbnail needs too.
    jobs.push({ base: thumbBase("application", a.slug), file: src, treat: "photo", position: HERO_POSITION[src] });
  }
  const posts = await postImages();
  for (const b of blogIndex as { slug: string }[]) {
    if (isArchivedPost(b.slug)) continue;
    const base = thumbBase("post", b.slug);
    if (!posts) jobs.push({ base, keepOnly: true, treat: "photo" });
    else if (posts.has(b.slug)) jobs.push({ base, url: posts.get(b.slug), treat: "photo" });
  }
  for (const p of mapProjects) {
    const src = p.images[0];
    if (!src) continue;
    const base = thumbBase("project", p.id);
    if (src.startsWith("https://cdn.sanity.io/")) {
      jobs.push({ base, url: `${src}?w=${THUMB_WORK}&h=${THUMB_WORK}&fit=crop&fm=jpg&q=90`, treat: "photo" });
    } else {
      jobs.push({ base, file: mapPhotoFile(src), treat: "photo" });
    }
  }
  for (const d of resourceDocuments) {
    if (d.documentType === "catalogue" || !documentHasThumb(d.fileUrl)) continue;
    // The preview manifest is keyed by the path on disk; some records spell it
    // URL-encoded ("StreetBond%20120").
    const page = (previewFor(decoded(d.fileUrl)) ?? previewFor(d.fileUrl))?.pages[0];
    if (page) jobs.push({ base: thumbBase("document", d.fileUrl), file: page.src, treat: "photo", position: "50% 0%" });
  }
  for (const t of PATTERN_TEMPLATES) jobs.push({ base: thumbBase("pattern", t.slug), file: patternSrc(t), treat: "pattern" });
  for (const [id, page] of Object.entries(PAGE_THUMBS)) jobs.push({ base: thumbBase("page", id), file: page.src, treat: page.treat });
  return jobs;
}

const thumbFiles = (root: string, base: string) => THUMB_SIZES.map((w) => path.join(root, `${base}-${w}.webp`));

async function fetchImage(url: string): Promise<Buffer> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

/** Square crop at the job's position, then 128 and 256px WebP into `dir`. */
async function cutThumb(input: Buffer, job: ThumbJob, dir: string) {
  let square: sharp.Sharp;
  if (job.treat === "pattern") {
    // A CAD sheet: border, title block and dimension lines around the drawn
    // field. Zoom into the middle of the field so the bricks read at 56px.
    const meta = await sharp(input).metadata();
    const W = meta.width ?? 0;
    const H = meta.height ?? 0;
    const side = Math.min(W, H, Math.round(W * PATTERN_SQUARE));
    const left = Math.max(0, Math.min(W - side, Math.round(W * PATTERN_CENTRE[0] - side / 2)));
    const top = Math.max(0, Math.min(H - side, Math.round(H * PATTERN_CENTRE[1] - side / 2)));
    square = sharp(input).extract({ left, top, width: side, height: side }).flatten({ background: THUMB_BACKGROUND });
  } else {
    // Upright first (EXIF orientation), then small, then the square: the crop
    // is computed on the picture as a person sees it.
    const { data, info } = await sharp(input, { failOn: "error" })
      .rotate()
      .flatten({ background: THUMB_BACKGROUND })
      .resize({ width: THUMB_WORK, height: THUMB_WORK, fit: "outside", withoutEnlargement: true })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const side = Math.min(info.width, info.height);
    const [px, py] = cropPosition(job.position);
    square = sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }).extract({
      left: Math.round((info.width - side) * px),
      top: Math.round((info.height - side) * py),
      width: side,
      height: side,
    });
  }
  const files = thumbFiles(dir, job.base);
  await fs.promises.mkdir(path.dirname(files[0]), { recursive: true });
  for (const [i, w] of THUMB_SIZES.entries()) {
    await square.clone().resize(w, w).webp({ quality: THUMB_QUALITY }).toFile(files[i]);
  }
}

async function thumbnails() {
  const started = Date.now();
  const jobs = await thumbJobs();
  const ledger = readJson<Record<string, string>>(THUMB_LEDGER, {});
  const nextLedger: Record<string, string> = {};
  const tally = { baked: 0, reused: 0, kept: 0, missing: 0, failed: 0, bytes: 0 };
  const ready = new Set<string>();
  const photoSettings = JSON.stringify({ THUMB_VERSION, THUMB_SIZES, THUMB_QUALITY, THUMB_WORK, THUMB_BACKGROUND });
  // The template crop's own numbers go only into the templates' hashes, so
  // tuning them never re-fetches two hundred photos from Sanity.
  const patternSettings = JSON.stringify({ photoSettings, PATTERN_SQUARE, PATTERN_CENTRE });

  await pool(jobs, Math.max(JOBS, 4), async (job) => {
    const cached = thumbFiles(CACHE, job.base);
    const haveCached = () => cached.every((f) => fs.existsSync(f));
    const settings = job.treat === "pattern" ? patternSettings : photoSettings;
    try {
      let bytes: Buffer | null = null;
      let hash: string;
      if (job.file) {
        try {
          bytes = await fs.promises.readFile(path.join(PUBLIC, job.file));
        } catch {
          tally.missing++;
          warn(`thumbs: ${job.base}: ${job.file} not found; the row shows the wheel`);
          return;
        }
        hash = createHash("sha256").update(settings).update(job.treat).update(job.position ?? "").update(bytes).digest("hex").slice(0, 16);
      } else if (job.url) {
        // The address names the asset and the crop, so it stands in for the bytes.
        hash = createHash("sha256").update(settings).update(job.treat).update(job.url).digest("hex").slice(0, 16);
      } else {
        // keepOnly: Sanity was down. The last good copy is better than none.
        if (!ledger[job.base] || !haveCached()) {
          tally.missing++;
          return;
        }
        hash = ledger[job.base];
        tally.kept++;
      }

      if (job.keepOnly) {
        // counted above
      } else if (FORCE || ledger[job.base] !== hash || !haveCached()) {
        if (!bytes && job.url) {
          try {
            bytes = await fetchImage(job.url);
          } catch (e) {
            if (ledger[job.base] && haveCached()) {
              warn(`thumbs: ${job.base}: ${(e as Error).message}; keeping the last good copy`);
              hash = ledger[job.base];
              tally.kept++;
            } else {
              throw e;
            }
          }
        }
        if (bytes) {
          await cutThumb(bytes, job, CACHE);
          tally.baked++;
        }
      } else {
        tally.reused++;
      }

      const out = thumbFiles(PUBLIC, job.base);
      await fs.promises.mkdir(path.dirname(out[0]), { recursive: true });
      for (const [i, f] of cached.entries()) {
        await fs.promises.copyFile(f, out[i]);
        const { size } = await fs.promises.stat(out[i]);
        tally.bytes += size;
      }
      nextLedger[job.base] = hash;
      ready.add(job.base);
    } catch (e) {
      tally.failed++;
      warn(`thumbs: ${job.base}: ${(e as Error).message}; the row shows the wheel`);
    }
  });

  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(THUMB_LEDGER, JSON.stringify({ ...ledger, ...nextLedger }, null, 2) + "\n");

  // The palette asks for a thumbnail wherever lib/search.ts says there is a
  // picture. Name any it will not find, so a gap is a line in the build log
  // rather than a silent wheel.
  const expected = withColours([]).map((e) => e.thumb).filter((t): t is string => !!t);
  const absent = expected.filter((t) => !ready.has(t));
  if (absent.length) warn(`thumbs: ${absent.length} rows will show the wheel instead: ${absent.slice(0, 12).join(", ")}${absent.length > 12 ? ", …" : ""}`);

  const secs = ((Date.now() - started) / 1000).toFixed(1);
  log(
    `thumbs: ${ready.size} of ${expected.length} ready (${tally.baked} baked, ${tally.reused} from cache` +
      `${tally.kept ? `, ${tally.kept} kept from a past build` : ""}${tally.missing ? `, ${tally.missing} missing` : ""}` +
      `${tally.failed ? `, ${tally.failed} failed` : ""}): ${(tally.bytes / 1024 / 1024).toFixed(1)} MB, ${secs}s`,
  );
}

async function main() {
  // One libvips thread per job; the jobs are the parallelism.
  sharp.concurrency(1);
  if (!THUMBS_ONLY) {
    try {
      await sitemapCopies();
    } catch (e) {
      // Never fail the build over this: without a manifest the sitemap is unchanged.
      warn(`FAILED: ${(e as Error).message}`);
    }
  }
  try {
    await thumbnails();
  } catch (e) {
    // Nor over this: without its thumbnails every row shows the wheel.
    warn(`thumbs FAILED: ${(e as Error).message}`);
  }
}

main().catch((e) => {
  console.warn("[search-images] FAILED:", (e as Error).message);
});
