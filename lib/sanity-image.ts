/**
 * lib/sanity-image.ts
 *
 * Sanity image URL builder helpers with backward-compat string fallback.
 *
 * Usage:
 *   import { resolveImageUrl, imagePresets } from "@/lib/sanity-image";
 *
 *   // Sanity asset ref → CDN URL
 *   resolveImageUrl(doc.heroImage, { width: 1200, quality: 80 })
 *
 *   // Preset helpers — auto-sized, auto-formatted
 *   imagePresets.hero(doc.heroImage)   // 1920px, q85, crop
 *   imagePresets.card(doc.heroImage)   // 800px, q85, crop
 *   imagePresets.thumb(doc.heroImage)  // 240px, q80, crop
 *   imagePresets.og(doc.heroImage)     // 1200×630, q90 (social sharing)
 *
 *   // Legacy string path → passes straight through
 *   resolveImageUrl("/images/hero/hero-1.jpg")
 */

import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
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
 * Defaults to auto("format") and quality(85) when no opts are provided.
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
    let b = builder.image(source).auto("format").quality(opts?.quality ?? 85);
    if (opts?.width)  b = b.width(opts.width);
    if (opts?.height) b = b.height(opts.height);
    return b.url();
  } catch {
    return null;
  }
}

/**
 * Pre-configured image presets for common use cases.
 *
 * Each preset produces an optimised, auto-formatted URL for its intended context.
 * Use these instead of raw `resolveImageUrl()` where the context is known.
 *
 * @example
 *   // Hero image — full-width, high resolution
 *   <img src={imagePresets.hero(doc.heroImage) ?? fallback} />
 *
 *   // Card thumbnail — medium resolution
 *   <img src={imagePresets.card(doc.image) ?? fallback} />
 *
 *   // Open Graph / social sharing
 *   <meta property="og:image" content={imagePresets.og(doc.featuredImage) ?? ogDefault} />
 */
export const imagePresets = {
  /** Full-width hero — 1920 px wide, q85, crop to fill */
  hero: (source: SanityImageSource | string | null | undefined): string | null => {
    if (!source || typeof source === "string") return source ?? null;
    try {
      return builder.image(source).width(1920).auto("format").quality(85).fit("crop").url();
    } catch { return null; }
  },

  /** Product / application card — 800 px wide, q85, crop to fill */
  card: (source: SanityImageSource | string | null | undefined): string | null => {
    if (!source || typeof source === "string") return source ?? null;
    try {
      return builder.image(source).width(800).auto("format").quality(85).fit("crop").url();
    } catch { return null; }
  },

  /** Thumbnail — 240 px wide, q80, crop to fill */
  thumb: (source: SanityImageSource | string | null | undefined): string | null => {
    if (!source || typeof source === "string") return source ?? null;
    try {
      return builder.image(source).width(240).auto("format").quality(80).fit("crop").url();
    } catch { return null; }
  },

  /** Open Graph / social sharing — 1200×630, q90 */
  og: (source: SanityImageSource | string | null | undefined): string | null => {
    if (!source || typeof source === "string") return source ?? null;
    try {
      return builder.image(source).width(1200).height(630).auto("format").quality(90).fit("crop").url();
    } catch { return null; }
  },
};

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
