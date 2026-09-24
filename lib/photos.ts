/**
 * Photos: one shape for every photograph the site shows, wherever it lives.
 *
 * Since Sep 2026 the product and application galleries and heroes, the homepage
 * hero and the About hero come from Sanity, where Doug can reorder, add, remove
 * and caption them. Their pixels are served by Sanity's image CDN, resized and
 * converted to WebP/AVIF there. None of it goes through Vercel's optimizer
 * (/_next/image), which ran out on 27 Aug 2026 and answered 402 site-wide.
 *
 * The /public/images folders stay as the fallback. A page whose Sanity document
 * has no photos shows the folder, exactly as before; that's the site-wide rule
 * in lib/cms-merge.ts, applied to pictures.
 *
 * Pure data and string functions: safe in server and client components.
 */

export interface Photo {
  /** https://cdn.sanity.io/images/... or a /images/... path in /public. */
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  /**
   * The /public path the photo was migrated from (stored on the Sanity asset as
   * source.url). lib/image-seo.ts reads SEO keywords from a photo's folder, and
   * a CDN URL has no folder, so this is what it reads instead.
   */
  origin?: string;
}

/** One image field, as the GROQ projections in lib/sanity.queries.ts return it. */
export interface SanityPhotoProjected {
  alt?: string | null;
  caption?: string | null;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  origin?: string | null;
}

/** Where Sanity serves image assets from. */
export const SANITY_CDN = "https://cdn.sanity.io/images/";

export const isSanityImage = (src: string | undefined | null): boolean =>
  typeof src === "string" && src.startsWith(SANITY_CDN);

/**
 * next/image loader for Sanity's CDN. Pass it (through components/ui/PhotoImage)
 * for any src that isSanityImage: next/image then builds its srcset from these
 * URLs and never calls /_next/image.
 */
export function sanityLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}

/** A sized Sanity URL, for the few places that use a plain <img>. */
export function sanitySized(src: string, width: number, quality = 80): string {
  return sanityLoader({ src, width, quality });
}

/**
 * A 1200×630 JPEG for Open Graph cards, cropped by Sanity. JPEG rather than
 * auto-format because some social crawlers still mishandle WebP.
 */
export function sanityOgImage(src: string): string {
  const url = new URL(src);
  url.searchParams.set("w", "1200");
  url.searchParams.set("h", "630");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("fm", "jpg");
  url.searchParams.set("q", "80");
  return url.toString();
}

/**
 * The copy of a Sanity photo the image sitemap offers Google Images: 1200px
 * WebP, the same size and format as the /public copies scripts/gen-search-images.ts
 * bakes (lib/search-images.ts). Sanity resizes on request, so nothing is baked.
 */
export function sanitySearchImage(src: string): string {
  const url = new URL(src);
  url.searchParams.set("w", "1200");
  url.searchParams.set("q", "80");
  url.searchParams.set("fm", "webp");
  url.searchParams.set("fit", "max");
  return url.toString();
}

/** srcSet for a plain <img> showing a Sanity photo full-bleed. */
export function sanitySrcSet(src: string, widths = [828, 1200, 1920, 2400], quality = 80): string {
  return widths.map((w) => `${sanitySized(src, w, quality)} ${w}w`).join(", ");
}

/** A projected Sanity image as a Photo, or null when the field is empty. */
export function toPhoto(img: SanityPhotoProjected | null | undefined, fallbackAlt: string): Photo | null {
  const src = img?.url?.trim();
  if (!src) return null;
  return {
    src,
    alt: img?.alt?.trim() || fallbackAlt,
    caption: img?.caption?.trim() || undefined,
    width: img?.width ?? undefined,
    height: img?.height ?? undefined,
    origin: img?.origin?.trim() || undefined,
  };
}

/** A projected Sanity gallery as Photos, dropping empty entries. */
export function toPhotos(imgs: SanityPhotoProjected[] | null | undefined, fallbackAlt: string): Photo[] {
  return (imgs ?? []).map((img) => toPhoto(img, fallbackAlt)).filter((p): p is Photo => p !== null);
}
