/**
 * Bakes every image the shared chrome draws — mega menus, mobile drawer,
 * footer, Lunch & Learn card — into /public/images/chrome/.
 *
 * WHAT IT DOES
 * Collects the sources from the same data the chrome renders:
 *   row    every `imageUrl: "…"` in lib/products.ts and lib/applications.ts
 *   post   every FEATURED_POSTS image (lib/nav-featured-posts.mjs)
 *   cover  FEATURED_POSTS[0].image
 *   panel  CHROME_PANELS (lib/chrome-images.mjs), the menu column photos
 *   moose / wheel / logo   CHROME_MARKS (lib/chrome-images.mjs)
 * and writes each family's widths as WebP q75 — the optimiser's own quality —
 * to /public/images/chrome/<family>/<stem>-<width>.webp. Square families are
 * cropped 1:1 at their object-position first. Sizes, crops and the URL scheme
 * all live in lib/chrome-images.mjs; this script only executes them.
 *
 * WHY NOT next/image
 * In August 2026 this project exhausted its Vercel image-optimisation allowance
 * and every optimised image on the site answered 402. Chrome that is on every
 * page and fires dozens of transforms per visit was the largest consumer left.
 *
 * WHY IT IS SAFE TO PUT IN `npm run build`
 * The outputs and lib/chrome-images.json (a ledger, read only by this script)
 * are committed, and each entry carries a hash of its source bytes and its
 * family's settings. On an unchanged tree the script checks the hashes, finds
 * every file on disk and encodes nothing. Swap a picture and just that one
 * re-bakes during the Vercel build. A missing source is a warning, never a
 * failed build: the last good files are kept if there are any.
 *
 * The one thing it does fail on: two different sources that flatten to the
 * same file stem. That would quietly show one picture in the other's place.
 *
 * WHY /images/chrome AND NOT NEXT TO THE SOURCES
 * scripts/gen-gallery-manifest.mjs scans images/products, applications,
 * projects and blog and accepts .webp; a thumbnail written there would turn up
 * as an extra gallery photograph.
 *
 * Run by hand:  npm run gen:chrome            (--force to re-bake everything)
 */
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import sharp from "sharp";
import { CHROME_FAMILIES, CHROME_MARKS, CHROME_PANELS, chromeStem, chromeUrl } from "../lib/chrome-images.mjs";
import { FEATURED_POSTS } from "../lib/nav-featured-posts.mjs";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const OUT_DIR = path.join(PUBLIC, "images", "chrome");
const LEDGER = path.join(ROOT, "lib", "chrome-images.json");
// The optimiser served every call site at q75 (next.config.ts `qualities`).
const QUALITY = 75;
// Bump when the crop or encode logic changes, so everything re-bakes once.
const VERSION = 1;
const FORCE = process.argv.includes("--force");

const log = (...a) => console.log("[chrome]", ...a);
const warn = (...a) => console.warn("[chrome]", ...a);

/**
 * Every `imageUrl` string literal in a lib data file. The files are TypeScript
 * with no imports, so reading them as text is enough; a value that is not a
 * plain literal is reported rather than skipped silently, because its drawer
 * row would point at a file nobody baked.
 */
function imageUrlsIn(rel) {
  const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const found = [];
  for (const m of text.matchAll(/\bimageUrl\??\s*:\s*([^,\n]+)/g)) {
    const value = m[1].trim();
    const literal = /^(["'`])([^"'`$]+)\1$/.exec(value);
    if (literal) found.push(literal[2]);
    else if (!/^string\b/.test(value)) warn(`${rel}: imageUrl ${value} is not a plain string — its menu thumbnail cannot be baked`);
  }
  return found;
}

function collectJobs() {
  const jobs = [];
  for (const rel of ["lib/products.ts", "lib/applications.ts"]) {
    for (const src of imageUrlsIn(rel)) jobs.push({ family: "row", src });
  }
  for (const post of FEATURED_POSTS) jobs.push({ family: "post", src: post.image });
  if (FEATURED_POSTS[0]) jobs.push({ family: "cover", src: FEATURED_POSTS[0].image });
  for (const src of Object.values(CHROME_PANELS)) jobs.push({ family: "panel", src });
  for (const [family, src] of Object.entries(CHROME_MARKS)) jobs.push({ family, src });

  // One job per output; two sources that flatten to one stem would overwrite
  // each other, so that stops the build.
  const byKey = new Map();
  for (const job of jobs) {
    const key = `${job.family}/${chromeStem(job.src)}`;
    const seen = byKey.get(key);
    if (seen && seen.src !== job.src) {
      throw new Error(`${seen.src} and ${job.src} both bake to ${key} — rename one of them`);
    }
    byKey.set(key, job);
  }
  return byKey;
}

function readLedger() {
  try {
    return JSON.parse(fs.readFileSync(LEDGER, "utf8"));
  } catch {
    return {};
  }
}

const filesFor = (family, src) =>
  CHROME_FAMILIES[family].widths.map((w) => path.join(PUBLIC, chromeUrl(family, src, w)));

async function bake(key, { family, src }, previous) {
  const spec = CHROME_FAMILIES[family];
  const file = path.join(PUBLIC, src.replace(/^\/+/, ""));
  const outputs = filesFor(family, src);
  if (!fs.existsSync(file)) {
    const kept = previous && outputs.every((f) => fs.existsSync(f));
    warn(`${key}: source ${src} not found — ${kept ? "keeping the last good files" : "nothing to serve"}`);
    return kept ? { skipped: true, entry: previous } : null;
  }

  const bytes = fs.readFileSync(file);
  const hash = createHash("sha256")
    .update(JSON.stringify({ VERSION, QUALITY, spec }))
    .update(bytes)
    .digest("hex")
    .slice(0, 16);

  if (!FORCE && previous?.hash === hash && outputs.every((f) => fs.existsSync(f))) {
    return { skipped: true, entry: previous };
  }

  // .rotate() with no argument applies the EXIF orientation, as the optimiser
  // did, so the crop is taken from the picture as a person sees it.
  const upright = await sharp(bytes).rotate().toBuffer({ resolveWithObject: true });
  const { width: srcW, height: srcH } = upright.info;

  let region = { left: 0, top: 0, width: srcW, height: srcH };
  const aspect = spec.square ? 1 : spec.aspect;
  if (aspect) {
    // The largest box of that shape that fits, placed at `position`.
    const w = Math.min(srcW, Math.round(srcH * aspect));
    const h = Math.min(srcH, Math.round(w / aspect));
    const [px, py] = spec.position;
    region = {
      left: Math.round((srcW - w) * px),
      top: Math.round((srcH - h) * py),
      width: w,
      height: h,
    };
  }

  fs.mkdirSync(path.dirname(outputs[0]), { recursive: true });
  const actual = [];
  for (const [i, w] of spec.widths.entries()) {
    const outW = Math.min(w, region.width);
    const outH = Math.round((region.height * outW) / region.width);
    await sharp(upright.data)
      .extract(region)
      .resize(outW, outH)
      .webp({ quality: QUALITY })
      .toFile(outputs[i]);
    actual.push(outW === w ? `${w}` : `${w}(=${outW})`);
  }
  log(`${key}: ${srcW}x${srcH}${aspect ? ` -> ${region.width}x${region.height} crop` : ""} -> ${actual.join("/")}`);
  return { skipped: false, entry: { src, hash } };
}

async function main() {
  const jobs = collectJobs();
  const previous = readLedger();
  const next = {};
  let baked = 0;
  for (const [key, job] of jobs) {
    const result = await bake(key, job, previous[key]);
    if (!result) continue;
    if (!result.skipped) baked++;
    next[key] = result.entry;
  }

  const sorted = Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)));
  const before = JSON.stringify(previous, null, 2);
  const after = JSON.stringify(sorted, null, 2);
  if (before !== after) fs.writeFileSync(LEDGER, after + "\n");
  log(baked ? `baked ${baked} of ${jobs.size} sources` : `up to date: ${jobs.size} sources`);

  // Report, never delete: a file no job produces is left for a person to remove.
  const wanted = new Set(
    [...jobs.values()].flatMap(({ family, src }) => filesFor(family, src).map((f) => path.relative(OUT_DIR, f))),
  );
  const orphans = fs.existsSync(OUT_DIR)
    ? fs
        .readdirSync(OUT_DIR, { recursive: true, withFileTypes: true })
        .filter((d) => d.isFile())
        .map((d) => path.relative(OUT_DIR, path.join(d.parentPath ?? d.path, d.name)))
        .filter((f) => !wanted.has(f))
    : [];
  if (orphans.length) warn(`not used by anything (safe to remove by hand): ${orphans.join(", ")}`);
}

main().catch((e) => {
  console.error("[chrome] FAILED:", e.message);
  process.exit(1);
});
