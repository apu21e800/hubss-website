/**
 * lib/sanity-image.ts
 *
 * Sanity image URLs: the descriptive filename every photo carries (20 Oct
 * 2026), and the @sanity/image-url builders with a string fallback.
 *
 * FILENAMES (the client's SEO brief, 20 Oct 2026, "Image search, my
 * priority"). Sanity's CDN serves an asset under any name added after its
 * own: .../<hash>-1920x1200.jpg/ubc-musqueam-crosswalk-vancouver.jpg?w=1600
 * is the same file, byte for byte, as the address without the name (checked
 * with curl on 20 Oct 2026: same status, type, length and hash, with and
 * without `w`, `rect`, `fp-x` and `or`). Google Images reads the filename,
 * and "eefd503782b8...-2400x1800.jpg" says nothing, so every builder on the
 * site (lib/photos.ts, the menu's scripts/gen-nav-insights.ts, the ones
 * below) names a photo with `withFilename`: its alt text, else the
 * document's title or slug, else nothing at all (the bare address, which
 * still works). The name is built from text the photo already carries;
 * nothing is invented for it.
 *
 * The filename functions are in lib/image-filename.ts, a file with no
 * imports, so lib/photos.ts (client components import it) can use them
 * without pulling the builder library into the browser.
 *
 * Usage:
 *   withFilename(photo.src, photo.alt, doc.title)   // a cdn.sanity.io URL, named
 *   imagePresets.hero(doc.heroImage, doc.heroImage?.alt)
 *   resolveImageUrl(doc.heroImage, { width: 1200, name: doc.title })
 *   resolveImageUrl("/images/hero/hero-1.jpg")      // a /public path passes through
 */

import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

// The filename functions live in lib/image-filename.ts (no imports, so client
// components can use them without the builder library); re-exported here.
export { FILENAME_MAX, slugForFilename, imageFilename, sanityAssetFile, withFilename } from "./image-filename";
import { withFilename } from "./image-filename";

// ── @sanity/image-url builders ────────────────────────────────────────────────
// Nothing on the site calls these today (docs/SANITY-FINDINGS.md): the pages
// get each photo's URL from GROQ (asset->url) and size it with lib/photos.ts.
// They are kept for code that starts from an image object, and they name what
// they build like everything else. The builder is made on first use, from the
// project's id and dataset, so importing the functions above costs nothing.

let imageBuilder: ReturnType<typeof createImageUrlBuilder> | null = null;
function builder() {
  imageBuilder ??= createImageUrlBuilder({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  });
  return imageBuilder;
}

/**
 * The raw Sanity image URL builder for a given source. Chain `.width()`,
 * `.quality()`, `.url()` etc. on the result, then name the URL:
 * `withFilename(urlFor(img).width(800).url(), img.alt)`. (The builder's
 * methods each return a new builder, so a name cannot ride along the chain.)
 */
export function urlFor(source: SanityImageSource) {
  return builder().image(source);
}

/**
 * Resolve either a Sanity image object or a legacy string path to a URL.
 *
 * - Sanity asset ref  → builds a CDN URL with auto-format + optional resize,
 *                       named by `opts.name` (withFilename)
 * - String path       → returned as-is (Vercel CDN / public folder fallback)
 * - null / undefined  → returns null
 *
 * Defaults to auto("format") and quality(85) when no opts are provided.
 *
 * @example
 *   <img src={resolveImageUrl(product.heroImage, { width: 800, name: product.name }) ?? "/images/placeholder.jpg"} />
 */
export function resolveImageUrl(
  source: SanityImageSource | string | null | undefined,
  opts?: { width?: number; height?: number; quality?: number; name?: string | null }
): string | null {
  if (!source) return null;

  // Legacy path string — pass through unchanged
  if (typeof source === "string") return source;

  try {
    let b = builder().image(source).auto("format").quality(opts?.quality ?? 85);
    if (opts?.width)  b = b.width(opts.width);
    if (opts?.height) b = b.height(opts.height);
    return withFilename(b.url(), opts?.name);
  } catch {
    return null;
  }
}

type Source = SanityImageSource | string | null | undefined;

/** One preset: a builder chain for an image object, named; a string passes through. */
function preset(make: (source: SanityImageSource) => string) {
  return (source: Source, name?: string | null): string | null => {
    if (!source || typeof source === "string") return source ?? null;
    try {
      return withFilename(make(source), name);
    } catch {
      return null;
    }
  };
}

/**
 * Pre-configured image presets for common use cases. The second argument is
 * the photo's name text (its alt, else the document's title).
 *
 * @example
 *   <img src={imagePresets.hero(doc.heroImage, doc.heroImage?.alt) ?? fallback} />
 *   <img src={imagePresets.card(doc.image, doc.title) ?? fallback} />
 *   <meta property="og:image" content={imagePresets.og(doc.featuredImage, doc.title) ?? ogDefault} />
 */
export const imagePresets = {
  /** Full-width hero: 1920 px wide, q85, crop to fill */
  hero: preset((s) => urlFor(s).width(1920).auto("format").quality(85).fit("crop").url()),
  /** Product / application card: 800 px wide, q85, crop to fill */
  card: preset((s) => urlFor(s).width(800).auto("format").quality(85).fit("crop").url()),
  /** Thumbnail: 240 px wide, q80, crop to fill */
  thumb: preset((s) => urlFor(s).width(240).auto("format").quality(80).fit("crop").url()),
  /** Open Graph / social sharing: 1200×630, q90 */
  og: preset((s) => urlFor(s).width(1200).height(630).auto("format").quality(90).fit("crop").url()),
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
