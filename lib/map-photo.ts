/**
 * The loader for every photo on the project map (next/image `loader`).
 *
 * Map photos live in two places, and neither may reach /_next/image (the
 * optimiser allowance ran out on 27 Aug 2026; see next.config.ts):
 *   - Sanity's CDN, which resizes on request: the usual Sanity loader.
 *   - /public/images/map, for the Idea Book photos Sanity does not hold. Each
 *     has a 640px twin named <name>-sm.jpg, served for small slots.
 * Anything else is returned as it is.
 */
import { isSanityImage, sanityLoader } from "@/lib/photos";

export function mapLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  if (isSanityImage(src)) return sanityLoader({ src, width, quality });
  if (src.startsWith("/images/map/")) {
    // The width rides along as a query string the file server ignores, so
    // next/image sees a loader that honours the width it asked for.
    const file = width <= 640 ? src.replace(/\.jpg$/, "-sm.jpg") : src;
    return `${file}?w=${width}`;
  }
  return src;
}
