/**
 * Folder-driven galleries — the asset-management enabler.
 *
 * scanGallery() reads a /public image folder at BUILD TIME and returns every
 * gallery-eligible file, naturally sorted. This makes the folder itself the
 * curation surface: drop a photo in → it appears on the next deploy; delete
 * it → it's gone. No arrays to edit.
 *
 * Rules (documented in docs/ASSETS.md):
 *   - included: .jpg .jpeg .png .webp
 *   - excluded: filenames containing "logo", files starting with "_"
 *     (the keep-but-hide escape hatch), and .svg
 *   - sorted naturally: name-2 before name-10
 *
 * SERVER ONLY — import from server components / *.server.ts, never from
 * client components ("use client" files).
 */
import * as fs from "fs";
import * as path from "path";

export function scanGallery(
  publicDir: string,
  opts?: { excludeBasenames?: string[] }
): string[] {
  const clean = publicDir.replace(/^\/+/, "");
  const abs = path.join(process.cwd(), "public", clean);
  let files: string[];
  try {
    files = fs.readdirSync(abs);
  } catch {
    return [];
  }
  const excluded = new Set((opts?.excludeBasenames ?? []).map((b) => b.toLowerCase()));
  const out = files
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .filter((f) => !/logo/i.test(f))
    .filter((f) => !f.startsWith("_"))
    .filter((f) => !excluded.has(f.toLowerCase()));
  out.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  return out.map((f) => `/${clean}/${f}`);
}

/** Derive the containing public dir of an image URL: /images/x/y.jpg -> images/x */
export function publicDirOf(imageUrl: string): string {
  return path.posix.dirname(imageUrl).replace(/^\/+/, "");
}

/**
 * Gallery for an entity: scan the folder its hero lives in; fall back to the
 * curated array when the folder is missing/empty. The hero file itself is
 * excluded so it doesn't render twice on the page.
 */
export function galleryFor(imageUrl: string, fallback: string[] | undefined): string[] {
  const dir = publicDirOf(imageUrl);
  const hero = path.posix.basename(imageUrl);
  const scanned = scanGallery(dir, { excludeBasenames: [hero] });
  return scanned.length > 0 ? scanned : fallback ?? [];
}
