/**
 * The catalogue's identity: edition, page count, download, page URLs.
 *
 * Deliberately does NOT carry the 144-entry page array. The nav's promoted
 * panel, the Resources document list and the search index all need the edition
 * name and the page count, and all three end up inside a client bundle -
 * importing the full manifest here would ship 144 alt strings to anyone who
 * opens the search overlay. The pages live in lib/catalogue-pages.ts, which
 * only the reader imports.
 *
 * Both files are written by scripts/gen-catalogue-pages.mjs and imported, not
 * read from disk at request time: a runtime `fs` read of a path under public/
 * made Next's tracer pull the whole image tree into the serverless function
 * once already, and an import lets /catalogue/[page] prerender all 144 routes.
 */
import edition from "./catalogue-edition.json";

export interface CatalogueDownload {
  href: string;
  bytes: number;
  label: string;
}

interface Edition {
  edition: string | null;
  dir: string;
  widths: number[];
  aspect: number;
  total: number;
  download: CatalogueDownload | null;
  coverThumb: string | null;
}

const raw = edition as Partial<Edition>;

export const catalogue = {
  /** "2026-27" - taken from the master PDF's filename, so it cannot drift. */
  edition: raw.edition ?? null,
  /** Public path holding the rendered pages, e.g. "/catalogue/2026-27". */
  dir: raw.dir ?? "",
  /** Rendered widths, ascending. */
  widths: Array.isArray(raw.widths) && raw.widths.length > 0 ? [...raw.widths].sort((a, b) => a - b) : [800, 1400, 2000],
  /** Page width / height. 1 for this edition's 6x6in square book. */
  aspect: typeof raw.aspect === "number" && raw.aspect > 0 ? raw.aspect : 1,
  download: raw.download ?? null,
  /** ~10 KB cover for menu callouts and document thumbnails. */
  coverThumb: raw.coverThumb ?? null,
} as const;

export const catalogueTotal = typeof raw.total === "number" ? raw.total : 0;

/** Has anything been rendered? Gates the reader's empty state. */
export const catalogueReady = catalogueTotal > 0 && catalogue.dir !== "";

/**
 * How the edition is written for people: "2026-27" becomes "2026-27" with an
 * en dash. The nav used to hardcode "The 2027 Catalogue" while the book on disk
 * was a different edition entirely; deriving the label means the two cannot
 * disagree again.
 */
export const catalogueLabel = (catalogue.edition ?? "").replace(/-/g, "–");

/**
 * Static file URL for one page at one width. Deliberately a plain public path:
 * page images never go through /_next/image. This project exhausted its Vercel
 * image-optimization allowance in August 2026 and answered 402 Payment Required
 * sitewide; 432 rasters that are already the exact sizes they are displayed at
 * have no business being re-optimised.
 */
export function cataloguePageUrl(n: number, width: number): string {
  return `${catalogue.dir}/p${String(n).padStart(3, "0")}-${width}.webp`;
}

/** srcset covering every rendered width for one page. */
export function cataloguePageSrcSet(n: number): string {
  return catalogue.widths.map((w) => `${cataloguePageUrl(n, w)} ${w}w`).join(", ");
}

/** The widest raster, for zoomed reading and OG images. */
export const catalogueMaxWidth = catalogue.widths[catalogue.widths.length - 1];

/**
 * The cover at its smallest rendered width. Every consumer of this is a
 * thumbnail - the document list's postage stamp, the Resources card's 200px
 * sidebar - and handing them the 2000px raster meant 233 KB for a 60px cell.
 * Social cards build their own URL from catalogueMaxWidth.
 */
export const catalogueCover = catalogueReady ? cataloguePageUrl(1, catalogue.widths[0]) : null;

/** Clamp a user-supplied page number into range. Null when unusable. */
export function normalisePage(value: string | number | undefined): number | null {
  if (value === undefined) return 1;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n) || n < 1 || n > catalogueTotal) return null;
  return n;
}
