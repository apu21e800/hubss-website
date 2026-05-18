/**
 * lib/sanity-image.ts
 *
 * Sanity image URL builder helpers with backward-compat string fallback.
 *
 * Usage:
 *   import { resolveImageUrl } from "@/lib/sanity-image";
 *
 *   // Sanity asset ref → CDN URL
 *   resolveImageUrl(doc.heroImage, { width: 1200, quality: 80 })
 *
 *   // Legacy string path → passes straight through
 *   resolveImageUrl("/images/hero/hero-1.jpg")
 */

import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./sanity.client";

const builder = createImageUrlBuilder(client);

/**
 * Return the raw Sanity image URL builder for a given source.
 * Chain `.width()`, `.quality()`, `.url()` etc. on the result.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Resolve either a Sanity image object or a legacy string path to a URL.
 *
 * - Sanity asset ref  → builds a CDN URL with auto-format + optional resize
 * - String path       → returned as-is (Vercel CDN / public folder fallback)
 * - null / undefined  → returns null
 *
 * @example
 *   <img src={resolveImageUrl(product.heroImage, { width: 800 }) ?? "/images/placeholder.jpg"} />
 */
export function resolveImageUrl(
  source: SanityImageSource | string | null | undefined,
  opts?: { width?: number; height?: number; quality?: number }
): string | null {
  if (!source) return null;

  // Legacy path string — pass through unchanged
  if (typeof source === "string") return source;

  try {
    let b = builder.image(source).auto("format");
    if (opts?.width)   b = b.width(opts.width);
    if (opts?.height)  b = b.height(opts.height);
    if (opts?.quality) b = b.quality(opts.quality);
    return b.url();
  } catch {
    return null;
  }
}

/**
 * Type-guard: returns true if the value is a Sanity image object (has asset._ref).
 * Useful for branching between legacy URL strings and proper Sanity refs.
 */
export function isSanityImageRef(
  value: unknown
): value is { asset: { _ref: string } } {
  return (
    typeof value === "object" &&
    value !== null &&
    "asset" in value &&
    typeof (value as Record<string, unknown>).asset === "object" &&
    (value as Record<string, { _ref?: string }>).asset !== null &&
    typeof (value as Record<string, { _ref: string }>).asset._ref === "string"
  );
}
