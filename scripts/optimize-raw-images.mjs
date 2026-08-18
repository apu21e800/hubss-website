#!/usr/bin/env node
/**
 * scripts/optimize-raw-images.mjs
 *
 * Optimises the images that reach browsers WITHOUT passing through next/image.
 *
 * Most images on this site are fine: they render via <Image>, and Next resizes
 * and re-encodes them per request. A few never touch that path:
 *
 *   1. Images referenced from blog MDX with markdown syntax. `![alt](src)`
 *      compiles to a plain <img>, so BlogImage never sees it and no
 *      optimisation happens. Two of these were untouched phone photos —
 *      3024x4032 and 2448x3264 — shipped whole to 390px screens.
 *   2. Hero images used as a CSS backgroundImage or a raw <img> (the latter
 *      deliberately; see the comment in HeroSlideshow).
 *
 * This script finds those, and only those, and resizes them to what they
 * actually render at. It is IDEMPOTENT — an already-optimised file comes out
 * unchanged — so it is safe to run after dropping new photos in.
 *
 *   node scripts/optimize-raw-images.mjs --dry-run
 *   node scripts/optimize-raw-images.mjs
 *
 * NOT a general image optimiser. 786 files in public/images are over 1 MB and
 * the tree is 2.4 GB; that is a separate job with different trade-offs, because
 * those DO go through next/image and users mostly don't feel them.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const DRY = process.argv.includes("--dry-run");
const ROOT = process.cwd();
const PUB = path.join(ROOT, "public");

// Targets by render context, not one blanket number.
//   blog body images render at most 800 CSS px in the article column -> 1600 covers 2x
//   heroes are full-viewport -> 1920, which is indistinguishable from 2400 in a 1:1 crop
const BLOG_LONG_EDGE = 1600;
const HERO_LONG_EDGE = 1920;
const QUALITY = 82;
const HERO_QUALITY = 80;

/** Images referenced by markdown image syntax in content/blog/*.mdx. */
function mdxImages() {
  const dir = path.join(ROOT, "content", "blog");
  if (!fs.existsSync(dir)) return [];
  const out = new Set();
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith(".mdx"))) {
    const src = fs.readFileSync(path.join(dir, f), "utf8");
    for (const m of src.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
      const p = m[1].split(/[?#]/)[0];
      if (p.startsWith("/images/")) out.add(p);
    }
  }
  return [...out];
}

/** Hero images used as CSS backgrounds or raw <img>. */
function heroImages() {
  const out = new Set();
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name !== "node_modules" && !e.name.startsWith(".")) walk(p); continue; }
      if (!/\.(tsx|ts)$/.test(e.name)) continue;
      const src = fs.readFileSync(p, "utf8");
      for (const m of src.matchAll(/url\('(\/images\/[^']+)'\)/g)) out.add(m[1]);
      for (const m of src.matchAll(/src="(\/images\/hero\/[^"]+)"/g)) out.add(m[1]);
    }
  };
  for (const d of ["app", "components"]) {
    const abs = path.join(ROOT, d);
    if (fs.existsSync(abs)) walk(abs);
  }
  return [...out];
}

const targets = [
  ...mdxImages().map((p) => ({ p, edge: BLOG_LONG_EDGE, q: QUALITY, why: "blog MDX (renders as raw <img>)" })),
  ...heroImages().map((p) => ({ p, edge: HERO_LONG_EDGE, q: HERO_QUALITY, why: "hero (CSS background / raw <img>)" })),
];

console.log(`${DRY ? "DRY RUN — nothing written\n" : ""}${targets.length} raw-served image(s) found\n`);
console.log("  " + "file".padEnd(56) + "before".padStart(9) + "after".padStart(9) + "saved".padStart(8));
console.log("  " + "-".repeat(82));

let tb = 0, ta = 0, changed = 0;
for (const t of targets) {
  const abs = path.join(PUB, t.p.replace(/^\/+/, ""));
  if (!fs.existsSync(abs)) { console.log(`  MISSING ${t.p}`); continue; }
  const before = fs.statSync(abs).size;
  const meta = await sharp(abs).metadata();
  const isJpeg = /jpe?g/i.test(meta.format || "");
  // Already small enough and already a JPEG? leave it alone — that's what makes
  // this idempotent.
  if (isJpeg && Math.max(meta.width, meta.height) <= t.edge && before < 700 * 1024) {
    console.log("  " + t.p.slice(8).padEnd(56) + `${Math.round(before / 1024)}KB`.padStart(9) + "—".padStart(9) + "skip".padStart(8));
    continue;
  }
  const buf = await sharp(abs)
    .rotate()                      // bake EXIF orientation in rather than losing it
    .resize({ width: t.edge, height: t.edge, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: t.q, progressive: true, mozjpeg: true })
    .toBuffer();
  if (buf.length >= before) {       // never make a file bigger
    console.log("  " + t.p.slice(8).padEnd(56) + `${Math.round(before / 1024)}KB`.padStart(9) + "—".padStart(9) + "skip".padStart(8));
    continue;
  }
  if (!DRY) fs.writeFileSync(abs, buf);
  tb += before; ta += buf.length; changed++;
  console.log("  " + t.p.slice(8).padEnd(56) + `${Math.round(before / 1024)}KB`.padStart(9) + `${Math.round(buf.length / 1024)}KB`.padStart(9) + `-${100 - Math.round(buf.length * 100 / before)}%`.padStart(8));
}
console.log("  " + "-".repeat(82));
if (changed) console.log(`  ${changed} changed · ${Math.round(tb / 1024)}KB -> ${Math.round(ta / 1024)}KB · saved ${Math.round((tb - ta) / 1024)}KB (${100 - Math.round(ta * 100 / tb)}%)`);
else console.log("  nothing to do — every raw-served image is already optimised");
