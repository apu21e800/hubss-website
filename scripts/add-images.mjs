#!/usr/bin/env node
/**
 * scripts/add-images.mjs — drop a folder of raw photos into a gallery.
 *
 * The folder IS the gallery (docs/IMAGE-WORKFLOW.md), so adding photos is
 * "put files in the right folder". This does the tedious part: the renaming,
 * the rotation, the resizing, and the checks you'd forget at 11pm.
 *
 *   node scripts/add-images.mjs --gallery=streetbond --from="C:/Users/cleve/Downloads/sb-new"
 *   node scripts/add-images.mjs --gallery=crosswalks --from=~/Drive/crosswalks --dry-run
 *
 * WHAT IT DOES, AND WHY EACH STEP EARNED ITS PLACE
 *
 *   EXIF rotation is BAKED IN. Phone photos carry an orientation flag rather
 *   than actually being rotated. Browsers mostly honour it, sharp's resize
 *   silently does not, and the result is sideways photos on the live site.
 *   This has already happened on this project once.
 *
 *   EXIF IS THEN STRIPPED — including GPS. Client site photos taken on a phone
 *   carry the coordinates of the installation. Publishing those to a public
 *   website is a privacy problem nobody thinks about until it's shipped.
 *
 *   DUPLICATES ARE SKIPPED BY CONTENT HASH, not filename. Google Drive
 *   downloads love to produce "photo.jpg" and "photo (1).jpg" of the same
 *   image, and a gallery with the same shot twice looks careless.
 *
 *   NAMES CONTINUE THE EXISTING SERIES. Galleries sort naturally, so a folder
 *   holding streetbond-01..112 gets streetbond-113 next, and the new photos
 *   land at the END rather than shuffled through the middle.
 *
 * Originals are never touched — this only ever writes into public/images/.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const args = process.argv.slice(2);
const val = (k) => (args.find((a) => a.startsWith(`--${k}=`)) || "").split("=").slice(1).join("=");
const GALLERY = val("gallery");
const FROM = val("from");
const DRY = args.includes("--dry-run");
const MAX_EDGE = Number(val("max") || 2400);
const QUALITY = Number(val("quality") || 82);

const ROOT = process.cwd();
const expand = (p) => p.replace(/^~/, process.env.HOME || process.env.USERPROFILE || "~");

if (!GALLERY || !FROM) {
  console.error(`
  Drop a folder of photos into a gallery.

    node scripts/add-images.mjs --gallery=<slug> --from=<folder>

  Options
    --dry-run          show what would happen, write nothing
    --max=2400         longest edge in pixels
    --quality=82       JPEG quality

  Galleries:`);
  for (const kind of ["products", "applications"]) {
    const dir = path.join(ROOT, "public", "images", kind);
    if (!fs.existsSync(dir)) continue;
    const names = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    console.error(`    ${kind}: ${names.join(", ")}`);
  }
  process.exit(1);
}

// Which family does this gallery belong to? Ask the filesystem rather than
// making the caller remember whether "crosswalks" is a product or application.
let destDir = null, kind = null;
for (const k of ["products", "applications"]) {
  const candidate = path.join(ROOT, "public", "images", k, GALLERY);
  if (fs.existsSync(candidate)) { destDir = candidate; kind = k; break; }
}
if (!destDir) {
  // New gallery — allowed, but say so out loud rather than silently creating it.
  console.error(`\n  No existing folder for "${GALLERY}".`);
  console.error(`  If this is a NEW gallery, create it first so the choice is deliberate:`);
  console.error(`    mkdir public/images/applications/${GALLERY}`);
  console.error(`    mkdir public/images/products/${GALLERY}\n`);
  process.exit(1);
}

const srcDir = expand(FROM);
if (!fs.existsSync(srcDir)) {
  console.error(`\n  Source folder not found: ${srcDir}\n`);
  process.exit(1);
}

const IMG = /\.(jpe?g|png|webp|tiff?|heic|heif|avif)$/i;
// Sort so that when Drive gives us "photo.jpg" AND "photo (1).jpg" of the same
// image, the CLEAN name is processed first and the "(1)" copy is the one
// reported as the duplicate. Same bytes either way, but the log reads sanely.
const incoming = fs.readdirSync(srcDir).filter((f) => IMG.test(f)).sort((a, b) => {
  const dupe = (n) => (/\(\d+\)\.[^.]+$/.test(n) ? 1 : 0);
  return dupe(a) - dupe(b) || a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
});
if (!incoming.length) {
  console.error(`\n  No images in ${srcDir}\n`);
  process.exit(1);
}

// Hash what's already in the gallery so re-running is safe and Drive's
// "photo (1).jpg" duplicates don't land twice.
const hashOf = (buf) => crypto.createHash("sha1").update(buf).digest("hex");
const existing = fs.readdirSync(destDir).filter((f) => IMG.test(f));
const existingHashes = new Set(existing.map((f) => hashOf(fs.readFileSync(path.join(destDir, f)))));

// Continue the numeric series rather than restarting it.
let nextN = 0;
for (const f of existing) {
  const m = f.match(new RegExp(`^${GALLERY}-(\\d+)\\.`, "i"));
  if (m) nextN = Math.max(nextN, parseInt(m[1], 10));
}

console.log(`\n  gallery : ${kind}/${GALLERY}  (${existing.length} existing)`);
console.log(`  source  : ${srcDir}  (${incoming.length} candidates)`);
console.log(`  output  : ${MAX_EDGE}px long edge, JPEG q${QUALITY}, EXIF stripped${DRY ? "   [DRY RUN]" : ""}\n`);

let added = 0, skipped = 0, failed = 0, bytesIn = 0, bytesOut = 0;
const srcHashes = new Set();

for (const file of incoming) {
  const abs = path.join(srcDir, file);
  const raw = fs.readFileSync(abs);
  const h = hashOf(raw);

  if (existingHashes.has(h)) { console.log(`  skip  ${file}  (already in the gallery)`); skipped++; continue; }
  if (srcHashes.has(h))      { console.log(`  skip  ${file}  (duplicate within this batch)`); skipped++; continue; }
  srcHashes.add(h);

  // Claim the next number that is free across ALL extensions. Folders here mix
  // .png and .jpg (fast-patch-01.png sits beside jpgs), so checking only for a
  // .jpg collision would happily create fast-patch-02.jpg next to an existing
  // fast-patch-02.png — two files, one number, both rendered in the gallery.
  let n, outName, outPath;
  do {
    n = String(++nextN).padStart(2, "0");
    outName = `${GALLERY}-${n}.jpg`;
    outPath = path.join(destDir, outName);
  } while (fs.readdirSync(destDir).some((f) => new RegExp(`^${GALLERY}-${n}\\.`, "i").test(f)));

  if (DRY) { console.log(`  add   ${file}  ->  ${outName}`); added++; bytesIn += raw.length; continue; }

  try {
    const buf = await sharp(raw)
      .rotate()                       // bake EXIF orientation — do not remove
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toBuffer();                    // sharp drops EXIF (incl. GPS) by default
    fs.writeFileSync(outPath, buf);
    bytesIn += raw.length; bytesOut += buf.length;
    const meta = await sharp(buf).metadata();
    console.log(`  add   ${file.padEnd(34)} -> ${outName.padEnd(26)} ${meta.width}x${meta.height}  ${(raw.length/1048576).toFixed(1)}MB -> ${(buf.length/1024).toFixed(0)}KB`);
    added++;
  } catch (e) {
    // HEIC needs libheif in the sharp build; say so plainly rather than dying.
    const hint = /heif|heic/i.test(file) ? "  (HEIC needs libheif — export as JPEG from Drive/Photos first)" : "";
    console.log(`  FAIL  ${file}: ${e.message.slice(0, 70)}${hint}`);
    failed++; nextN--;
  }
}

console.log(`\n  added ${added}   skipped ${skipped}   failed ${failed}`);
if (!DRY && added) {
  console.log(`  ${(bytesIn/1048576).toFixed(1)} MB in  ->  ${(bytesOut/1048576).toFixed(1)} MB on disk  (${Math.round((1-bytesOut/bytesIn)*100)}% smaller)`);
  console.log(`\n  next:  npm run build   (regenerates the gallery index)`);
  console.log(`         then commit public/images/${kind}/${GALLERY}/ and push\n`);
} else if (DRY) {
  console.log(`\n  nothing written. Re-run without --dry-run to apply.\n`);
}
