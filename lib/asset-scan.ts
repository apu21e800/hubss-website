/**
 * Folder-driven galleries — the asset-management layer.
 *
 * A product's or application's gallery is the CONTENTS of its image folder:
 * drop a file in and it appears, delete it and it's gone, prefix "_" to hide,
 * number the files to order them. See docs/IMAGE-WORKFLOW.md.
 *
 * The folder listing is built at BUILD TIME into lib/gallery-manifest.json by
 * scripts/gen-gallery-manifest.mjs (wired into the "build" npm script), and
 * this module only reads that JSON.
 *
 * DO NOT reintroduce `fs` here. Reading the filesystem from a page makes the
 * Next.js tracer bundle all of /public into the serverless function (2.4 GB
 * against Vercel's 250 MB ceiling — it fails the deploy outright). The
 * manifest keeps the behaviour and keeps the function tiny.
 *
 * Safe to import from server components. No Node built-ins, no side effects.
 */
import manifest from "./gallery-manifest.json";
import { seoAlt } from "./image-seo";

const GALLERIES = manifest as Record<string, string[]>;

/** "/images/products/streetbond/hero.jpg" -> "images/products/streetbond" */
export function publicDirOf(imageUrl: string): string {
  const clean = imageUrl.split("?")[0].replace(/^\/+/, "");
  const i = clean.lastIndexOf("/");
  return i === -1 ? clean : clean.slice(0, i);
}

function basename(p: string): string {
  const clean = p.split("?")[0];
  return clean.slice(clean.lastIndexOf("/") + 1);
}

/** Every gallery-eligible image in a public folder, naturally sorted. */
export function scanGallery(
  publicDir: string,
  opts?: { excludeBasenames?: string[] }
): string[] {
  const key = publicDir.replace(/^\/+/, "");
  const files = GALLERIES[key];
  if (!files?.length) return [];
  if (!opts?.excludeBasenames?.length) return files;
  const excluded = new Set(opts.excludeBasenames.map((b) => b.toLowerCase()));
  return files.filter((f) => !excluded.has(basename(f).toLowerCase()));
}

/**
 * Gallery for an entity, in strict priority order:
 *
 *   1. its OWN gallery key ("images/applications/private-driveways") — the
 *      folder of that name plus anything cross-posted into it;
 *   2. the folder its hero image happens to live in;
 *   3. the curated array in lib/products.ts / lib/applications.ts.
 *
 * Step 1 exists because four applications have no folder of their own and used
 * to fall through to step 2, which quietly served a NEIGHBOUR'S gallery —
 * /applications/private-driveways rendered the identical 44 photos as
 * /applications/residential-driveways, and pedestrian-safety was a clone of
 * crosswalks. Keying on the entity first makes each page show its own
 * curation; the hero's folder is now only a fallback.
 *
 * The hero is removed either way so it never renders twice.
 */
export function galleryFor(
  imageUrl: string,
  fallback: string[] | undefined,
  ownKey?: string
): string[] {
  const exclude = { excludeBasenames: [basename(imageUrl)] };
  if (ownKey) {
    const own = scanGallery(ownKey, exclude);
    if (own.length > 0) return own;
  }
  const scanned = scanGallery(publicDirOf(imageUrl), exclude);
  return scanned.length > 0 ? scanned : fallback ?? [];
}

/**
 * Alt text for a gallery image.
 *
 * The first stop is lib/image-seo.ts, which composes a descriptive, keyword-led
 * sentence from what the folder lets us truthfully say — the application or
 * product, the class of system HUB specifies for it, the setting, and the
 * place. That matters because this function is the single source of alt text
 * for roughly 1,500 photographs: it used to return "<page context> —
 * installation photo 45", so all 121 photos in /applications/crosswalks
 * carried near-identical strings containing no phrase anyone would ever type
 * into a search box. Google Images ranks on the words in and around a picture;
 * a gallery described 121 times the same way competes for nothing.
 *
 * Folders the SEO layer has no documented subject for — blog featured images,
 * hero art, one-offs — fall back to the original behaviour below: numbered
 * series files ("crosswalks-45.jpg") become "<context> — installation photo
 * 45", named files ("vaughan-woodbridge-crosswalk.jpg") are humanized. A
 * generic true sentence beats a specific invented one.
 */
export function altFor(src: string, context: string): string {
  const base = basename(src).replace(/\.(jpe?g|png|webp)$/i, "");
  const numbered = base.match(/^(.*?)[-_](\d+)$/);
  const fallback = numbered
    ? `${context} — installation photo ${parseInt(numbered[2], 10)}`
    : `${context} — ${base
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (ch) => ch.toUpperCase())
        .trim()}`;
  return seoAlt(src, fallback);
}
