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
  /**
   * The focal point Doug set in Studio (the crosshair on the image), 0 to 1
   * from the left and the top. Absent until someone sets one. It frames the
   * heroes (lib/hero-framing.ts, heroObjectPosition) and the homepage hero's
   * wide and phone cuts.
   */
  hotspot?: Hotspot;
  /** The photo's _key in a Studio gallery, for "Edit on the page". */
  key?: string;
}

export interface Hotspot {
  x: number;
  y: number;
}

/** One image field, as the GROQ projections in lib/sanity.queries.ts return it. */
export interface SanityPhotoProjected {
  _key?: string | null;
  alt?: string | null;
  caption?: string | null;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  origin?: string | null;
  hotspot?: { x?: number | null; y?: number | null; width?: number | null; height?: number | null } | null;
}

/**
 * The hotspot, when an editor has actually moved it. Sanity can store the
 * untouched default (the middle of the photo), and treating that as a choice
 * would override the framing chosen for each hero by hand.
 */
function hotspotOf(img: SanityPhotoProjected | null | undefined): Hotspot | undefined {
  const x = img?.hotspot?.x;
  const y = img?.hotspot?.y;
  if (typeof x !== "number" || typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y)) return undefined;
  if (Math.abs(x - 0.5) < 0.005 && Math.abs(y - 0.5) < 0.005) return undefined;
  return { x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) };
}

/** A CSS object-position for a photo's hotspot, or undefined without one. */
export function hotspotPosition(photo: { hotspot?: Hotspot } | null | undefined): string | undefined {
  const h = photo?.hotspot;
  if (!h) return undefined;
  const pct = (n: number) => `${Math.round(n * 1000) / 10}%`;
  return `${pct(h.x)} ${pct(h.y)}`;
}

/**
 * A Sanity photo cut to an exact size around its focal point (the hotspot, or
 * the middle), as a JPEG-or-better URL. The homepage hero uses it to make its
 * wide-screen and phone cuts from whatever photo Studio holds.
 */
export function sanityCrop(src: string, width: number, height: number, hotspot?: Hotspot, quality = 80): string {
  if (sanityTurn(src)) return sanityLoader({ src, width, quality });
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("h", String(height));
  url.searchParams.set("fit", "crop");
  if (hotspot) {
    url.searchParams.set("crop", "focalpoint");
    url.searchParams.set("fp-x", hotspot.x.toFixed(3));
    url.searchParams.set("fp-y", hotspot.y.toFixed(3));
  }
  url.searchParams.set("q", String(quality));
  url.searchParams.set("auto", "format");
  return url.toString();
}

/** Where Sanity serves image assets from. */
export const SANITY_CDN = "https://cdn.sanity.io/images/";

export const isSanityImage = (src: string | undefined | null): boolean =>
  typeof src === "string" && src.startsWith(SANITY_CDN);

/**
 * Photos Studio holds on their side, turned upright at the CDN.
 *
 * Vern, 17 Oct 2026, on /applications/splash-pads: "fix sideways images ...
 * site wide. this is not acceptable." Seven photographs were saved with their
 * pixels turned and no orientation tag (the camera's was stripped somewhere
 * before the files reached /public), so every copy was sideways: the folder,
 * the Sanity asset the photo sync uploaded from it, every size the CDN cut.
 * The files in /public are turned upright in the repo; the Sanity copies are
 * turned here, by asset, with the CDN's `or` (90 is clockwise, as the
 * `rotated-sheet` check showed), because re-uploading would mean the photo
 * sync, and Studio's galleries have moved on since it last ran (Doug has
 * added photos and the alt text differs): a run would put the folders back
 * over his edits. If one of these is replaced in Studio, its new asset has a
 * new name and the entry here simply stops matching.
 *
 * The CDN applies `w`/`h` to the photo BEFORE turning it, so a turned
 * photo's width is asked for as `h` (checked 17 Oct 2026: or=90&h=600 on a
 * 2400x1800 gives 600x800; or=90&w=600 gives 450x600).
 */
const TURNED: Record<string, 90 | 270> = {
  "20a1b10d182d393b96800eb4b44743690bdf39f8-2400x1800.jpg": 90, // splash-pads-09
  "1daaf19879724eb05f525bfc9d04351b6af5f06f-2400x1800.jpg": 90, // parks-paths-99 ("Where does rainwater go?")
  "34108e645a4d31169a5f6bb3ea06d1152a3746d3-2400x1800.jpg": 90, // parks-paths-127
  "8a3ba33c81bcdc3b2b97446a1a290af3c74c524d-2400x1800.jpg": 90, // parks-paths-130
  "d6f51082dd91fe7271248abd12b6101771e7fe1d-2400x1800.jpg": 90, // parks-paths-92
  "564e4ecd6759387d6282e539085ba26a4ac39b1e-2400x1350.jpg": 90, // traffic-patterns-xd-19
  "f615365455ea7ca976f9433a2f98f65ee0112feb-1280x720.jpg": 270, // Waterloo Park from the air (decomark-17, traffic-patterns-03, crosswalks-31)
};

/** How far a Sanity photo is turned at the CDN: 0 for almost every photo. */
export function sanityTurn(src: string | undefined | null): 0 | 90 | 270 {
  if (!isSanityImage(src)) return 0;
  const name = (src as string).split("?")[0].split("/").pop() ?? "";
  return TURNED[name] ?? 0;
}

/**
 * Sets the width a Sanity photo is served at. A turned photo's width is asked
 * for as `h`, because the CDN scales before it turns. Only `fit=max` sizing
 * is predictable with a turn (a `fit=crop` with `or` came back in odd sizes),
 * so the crops below serve a turned photo whole instead of cut.
 */
function sized(url: URL, width: number): void {
  const turn = sanityTurn(url.toString());
  if (turn) {
    url.searchParams.set("or", String(turn));
    url.searchParams.set("h", String(width));
  } else {
    url.searchParams.set("w", String(width));
  }
}

/**
 * next/image loader for Sanity's CDN. Pass it (through components/ui/PhotoImage)
 * for any src that isSanityImage: next/image then builds its srcset from these
 * URLs and never calls /_next/image.
 */
export function sanityLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  const url = new URL(src);
  sized(url, width);
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
  if (sanityTurn(src)) return sanityLoader({ src, width: 1200, quality: 80 }).replace("auto=format", "fm=jpg");
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
  sized(url, 1200);
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
  // A turned photo is as tall as Studio says it is wide.
  const turned = sanityTurn(src) !== 0;
  return {
    src,
    alt: img?.alt?.trim() || fallbackAlt,
    caption: img?.caption?.trim() || undefined,
    width: (turned ? img?.height : img?.width) ?? undefined,
    height: (turned ? img?.width : img?.height) ?? undefined,
    origin: img?.origin?.trim() || undefined,
    hotspot: hotspotOf(img),
    key: img?._key?.trim() || undefined,
  };
}

/** A projected Sanity gallery as Photos, dropping empty entries. */
export function toPhotos(imgs: SanityPhotoProjected[] | null | undefined, fallbackAlt: string): Photo[] {
  return (imgs ?? []).map((img) => toPhoto(img, fallbackAlt)).filter((p): p is Photo => p !== null);
}
