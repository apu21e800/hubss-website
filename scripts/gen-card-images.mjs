/**
 * Bakes the /products index card photographs, and writes the one manifest the
 * page reads.
 *
 * WHAT IT DOES
 * For every line in lib/product-card-images.mjs: crop the source to 4:3 at the
 * given position, write 480 / 800 / 1200px WebP to /public/images/cards/, and
 * record the widths and alt text in lib/card-images.json. A source whose 4:3
 * crop is narrower than 1200px tops out at its own width — nothing is
 * upscaled.
 *
 * WHY NOT next/image
 * Same reason as scripts/gen-catalogue-pages.mjs: in August 2026 this project
 * exhausted its Vercel image-optimisation allowance and every optimised image
 * on the site answered 402. These cards are served as plain static files
 * through a bare <img srcset>.
 *
 * WHY IT IS SAFE TO PUT IN `npm run build`
 * The outputs and the manifest are committed, and each entry carries a hash of
 * its source bytes, crop position and encoder settings. On an unchanged tree
 * the script checks the hashes, finds every file on disk and exits without
 * encoding anything. Swap a photo (edit `src`, or replace the file itself) and
 * the hash moves, so Vercel re-bakes just that card during the build. It never
 * throws for a missing source: it warns, keeps the last good files if there
 * are any, and otherwise drops the card's photo so the page renders the card
 * without one instead of pointing at a file that is not there.
 *
 * WHY THE FILES LIVE IN /images/cards AND NOT /images/products/<slug>
 * scripts/gen-gallery-manifest.mjs scans the product folders and accepts
 * .webp; a card written there would turn up as an extra gallery photograph.
 *
 * Run by hand:  npm run gen:cards            (and --force to re-bake)
 */
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import sharp from "sharp";
import { CARD_IMAGES } from "../lib/product-card-images.mjs";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "images", "cards");
const MANIFEST = path.join(ROOT, "lib", "card-images.json");
const WIDTHS = [480, 800, 1200];
const QUALITY = 72;
// Bump when the crop or encode logic changes, so every card re-bakes once.
const VERSION = 1;
const FORCE = process.argv.includes("--force");

const log = (...a) => console.log("[cards]", ...a);
const warn = (...a) => console.warn("[cards]", ...a);

/**
 * CSS object-position, the subset that makes sense for a crop: percentages and
 * the keywords left / center / right / top / bottom, x then y. One value means
 * that x and a centred y, as in CSS ("30%" is "30% 50%", "left" is "0% 50%";
 * "top" or "bottom" alone set y). Anything else is warned about and centred.
 */
function parsePosition(slug, position) {
  const KEYWORDS = { left: [0, null], right: [1, null], top: [null, 0], bottom: [null, 1], center: [null, null] };
  const parts = String(position ?? "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  let x = 0.5;
  let y = 0.5;
  let ok = parts.length > 0 && parts.length <= 2;
  parts.forEach((p, i) => {
    const pct = /^(-?\d+(?:\.\d+)?)%$/.exec(p);
    if (pct) {
      const v = Math.min(1, Math.max(0, Number(pct[1]) / 100));
      if (i === 0) x = v;
      else y = v;
    } else if (p in KEYWORDS) {
      const [kx, ky] = KEYWORDS[p];
      if (kx !== null) x = kx;
      if (ky !== null) y = ky;
    } else {
      ok = false;
    }
  });
  if (!ok) warn(`${slug}: position "${position}" not understood — centring the crop`);
  return [x, y];
}

function readManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  } catch {
    return {};
  }
}

const filesFor = (slug, widths) => widths.map((w) => path.join(OUT_DIR, `${slug}-${w}.webp`));

async function bake(slug, entry, previous) {
  const file = path.join(ROOT, "public", entry.src.replace(/^\/+/, ""));
  if (!fs.existsSync(file)) {
    const kept = previous && filesFor(slug, previous.widths).every((f) => fs.existsSync(f));
    warn(`${slug}: source ${entry.src} not found — ${kept ? "keeping the last good cards" : "card will render without a photo"}`);
    return kept ? previous : null;
  }

  const bytes = fs.readFileSync(file);
  const hash = createHash("sha256")
    .update(JSON.stringify({ VERSION, QUALITY, WIDTHS, position: entry.position }))
    .update(bytes)
    .digest("hex")
    .slice(0, 16);

  if (!FORCE && previous?.hash === hash && filesFor(slug, previous.widths).every((f) => fs.existsSync(f))) {
    return { ...previous, alt: entry.alt };
  }

  // .rotate() with no argument applies the EXIF orientation, so the crop is
  // computed on the picture as a person sees it, not as the sensor stored it.
  const upright = await sharp(bytes).rotate().toBuffer({ resolveWithObject: true });
  const { width: srcW, height: srcH } = upright.info;
  const [px, py] = parsePosition(slug, entry.position);

  let cropW = srcW;
  let cropH = Math.round((srcW * 3) / 4);
  if (cropH > srcH) {
    cropH = srcH;
    cropW = Math.round((srcH * 4) / 3);
  }
  const left = Math.round((srcW - cropW) * px);
  const top = Math.round((srcH - cropH) * py);

  // Every standard width the crop can fill, then the crop's own width as the
  // top size when it falls short of the largest — once, even if it happens to
  // equal a standard width (an 800x600 source must not list 800 twice).
  const widths = WIDTHS.filter((w) => w <= cropW);
  if (cropW < WIDTHS[WIDTHS.length - 1] && !widths.includes(cropW)) widths.push(cropW);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const w of widths) {
    await sharp(upright.data)
      .extract({ left, top, width: cropW, height: cropH })
      .resize(w, Math.round((w * 3) / 4))
      .webp({ quality: QUALITY })
      .toFile(path.join(OUT_DIR, `${slug}-${w}.webp`));
  }
  log(`${slug}: ${srcW}x${srcH} -> 4:3 crop ${cropW}x${cropH} at ${entry.position} -> ${widths.join("/")}px`);
  return { base: `/images/cards/${slug}`, widths, alt: entry.alt, hash };
}

async function main() {
  const previous = readManifest();
  const next = {};
  for (const [slug, entry] of Object.entries(CARD_IMAGES)) {
    const baked = await bake(slug, entry, previous[slug]);
    if (baked) next[slug] = baked;
  }

  const before = JSON.stringify(previous, null, 2);
  const after = JSON.stringify(next, null, 2);
  if (before !== after) {
    fs.writeFileSync(MANIFEST, after + "\n");
    log(`manifest written: ${Object.keys(next).length} cards`);
  } else {
    log(`up to date: ${Object.keys(next).length} cards`);
  }

  const orphans = fs.existsSync(OUT_DIR)
    ? fs.readdirSync(OUT_DIR).filter((f) => !Object.values(next).some((c) => filesFor(path.basename(c.base), c.widths).some((p) => path.basename(p) === f)))
    : [];
  if (orphans.length) warn(`not used by any card (safe to remove by hand): ${orphans.join(", ")}`);
}

main().catch((e) => {
  console.error("[cards] FAILED:", e.message);
  process.exit(1);
});
