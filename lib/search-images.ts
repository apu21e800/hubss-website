/**
 * The copies of our photographs that Google Images is sent to.
 *
 * WHY
 * The sitemap's image:loc entries used to name the originals in /public/images:
 * 1,368 files, median 1.0 MB, 31% over 2 MB, the largest 5 MB — 1.97 GB in
 * all. Visitors never download those (next/image serves them a WebP), but
 * Google Images crawls, thumbnails and ranks exactly the file the sitemap
 * names, so it was fetching the heaviest version of every picture on the site.
 *
 * WHAT
 * scripts/gen-search-images.ts (in `npm run build`) reads this sitemap's image
 * list, writes each photo as a 1200px WebP to
 * /public/images/search/<same path>.webp, and records what it wrote in
 * lib/search-images.json. The sitemap then swaps every original for its copy.
 * About 12x smaller on a sample of twelve: 2.0 MB → 160 KB.
 *
 * NOT /_next/image, deliberately: this project exhausted its Vercel image
 * optimisation allowance in August 2026 and every optimised image answered
 * 402. Crawlers must not become a new source of transformations.
 *
 * FAILS SAFE
 * Only paths the generator actually wrote are in the manifest. A photo it
 * could not bake — or a build where it did not run at all, like `next dev` —
 * keeps its original URL, which is exactly the old behaviour. The sitemap can
 * never point at a file that is not there.
 */
import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";

const SITE = "https://hubss.com";

/** Fixed output width. Google Images' large previews and Discover both ask for ≥1200px. */
export const SEARCH_IMAGE_WIDTH = 1200;
/** A notch above the site's q75: this is the copy a searcher enlarges. */
export const SEARCH_IMAGE_QUALITY = 80;
/** Generated at build time, gitignored — like gallery-manifest.json. */
export const SEARCH_IMAGE_MANIFEST = path.join("lib", "search-images.json");

/** Source path → the path of its baked copy. Pure: says nothing about whether it exists. */
export function searchImagePath(src: string): string {
  return `/images/search/${src.replace(/^\/images\//, "").replace(/\.[a-z0-9]+$/i, "")}.webp`;
}

/** { "/images/…/x.jpg": "/images/search/…/x.webp" } for every file the generator wrote. */
export function readSearchImageManifest(): Record<string, string> {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), SEARCH_IMAGE_MANIFEST), "utf8"));
  } catch {
    return {};
  }
}

/** Swap each sitemap image for its baked copy where one exists. */
export function withSearchImages(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const baked = readSearchImageManifest();
  const swap = (url: string) => {
    const src = url.startsWith(SITE) ? url.slice(SITE.length) : url;
    return baked[src] ? `${SITE}${baked[src]}` : url;
  };
  return entries.map((entry) =>
    entry.images ? { ...entry, images: [...new Set(entry.images.map(swap))] } : entry,
  );
}
