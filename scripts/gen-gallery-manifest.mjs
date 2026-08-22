/**
 * Generates lib/gallery-manifest.json — the build-time index of every
 * gallery-eligible image in /public/images.
 *
 * WHY THIS EXISTS: reading the filesystem inside a page (fs.readdirSync on a
 * runtime-computed path) makes Next.js's dependency tracer give up narrowing
 * and pull the whole /public tree into the serverless function — 2.4 GB, far
 * past Vercel's 250 MB function limit. Building the index up front keeps the
 * pages pure data consumers: no `fs` in the bundle, nothing traced, and the
 * folder-is-the-gallery behaviour is identical because this regenerates on
 * every build (see the "build" script in package.json).
 *
 * Run manually: npm run gen:gallery-manifest
 */
import * as fs from "fs";
import * as path from "path";
import { CROSSPOSTS } from "../lib/gallery-crossposts.mjs";

const ROOT = process.cwd();
const PUB = path.join(ROOT, "public");
const OUT = path.join(ROOT, "lib", "gallery-manifest.json");

/** Directories whose contents are gallery candidates. */
const SCAN_ROOTS = ["images/products", "images/applications", "images/projects", "images/blog"];

const isGalleryImage = (name) =>
  /\.(jpe?g|png|webp)$/i.test(name) && !/logo/i.test(name) && !name.startsWith("_");

const manifest = {};

for (const root of SCAN_ROOTS) {
  const absRoot = path.join(PUB, root);
  if (!fs.existsSync(absRoot)) continue;
  for (const entry of fs.readdirSync(absRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const rel = `${root}/${entry.name}`;
    const files = fs
      .readdirSync(path.join(absRoot, entry.name))
      .filter(isGalleryImage)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
      .map((f) => `/${rel}/${f}`);
    if (files.length) manifest[rel] = files;
  }
}

// Fold in cross-posts: one photo appearing in a second gallery (lib/gallery-crossposts.mjs).
// They render AFTER the folder's own images, are de-duplicated against them, and
// any path pointing at a file that no longer exists is dropped loudly rather than
// shipped as a broken <img>.
let crossAdded = 0;
const crossMissing = [];
for (const [key, paths] of Object.entries(CROSSPOSTS)) {
  const own = manifest[key] ?? [];
  const have = new Set(own);
  const add = [];
  for (const rel of paths) {
    if (have.has(rel)) continue;
    if (!fs.existsSync(path.join(PUB, rel.replace(/^\/+/, "")))) { crossMissing.push(`${key} <- ${rel}`); continue; }
    have.add(rel);
    add.push(rel);
  }
  if (add.length) { manifest[key] = own.concat(add); crossAdded += add.length; }
}
if (crossMissing.length) {
  console.warn(`gallery-manifest: ${crossMissing.length} cross-post(s) point at missing files:`);
  for (const m of crossMissing.slice(0, 10)) console.warn(`  ${m}`);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 0));
const total = Object.values(manifest).reduce((n, a) => n + a.length, 0);
console.log(
  `gallery-manifest: ${Object.keys(manifest).length} galleries, ${total} images ` +
  `(${total - crossAdded} from folders + ${crossAdded} cross-posted)`
);
