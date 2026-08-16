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
 * Gallery for an entity: the contents of the folder its hero lives in, with
 * the hero itself removed so it doesn't render twice. Falls back to the
 * curated array when the folder is missing or empty.
 */
export function galleryFor(imageUrl: string, fallback: string[] | undefined): string[] {
  const scanned = scanGallery(publicDirOf(imageUrl), {
    excludeBasenames: [basename(imageUrl)],
  });
  return scanned.length > 0 ? scanned : fallback ?? [];
}

/**
 * Human alt text from a filename + page context. Numbered series files
 * ("crosswalks-45.jpg") become "<context> — installation photo 45"; named
 * files ("vaughan-woodbridge-crosswalk.jpg") are humanized into title case.
 */
export function altFor(src: string, context: string): string {
  const base = basename(src).replace(/\.(jpe?g|png|webp)$/i, "");
  const numbered = base.match(/^(.*?)[-_](\d+)$/);
  if (numbered) {
    return `${context} — installation photo ${parseInt(numbered[2], 10)}`;
  }
  const human = base
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
    .trim();
  return `${context} — ${human}`;
}
