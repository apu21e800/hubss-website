/**
 * The Product Book's identity: edition, page count, download, page URLs.
 * (Known in the code as the catalogue; see `ideaBook` below for the name the
 * site prints.)
 *
 * Deliberately does NOT carry the 144-entry page array. The Resources document
 * list and the search index need the edition name, and both end up inside a
 * client bundle -
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

/**
 * What the book is called on the site, in one place.
 *
 * Doug's word: "Idea Book" from 25 Sep 2026, "Product Book" from 14 Oct 2026
 * ("change the name of the Idea Book to Product Book"), and "Product
 * Portfolio Book · Volume 5" since 17 Oct 2026 ("Call the virtual print
 * booklet 'Product Portfolio Book · Volume 5'"). Never "catalogue": the
 * book's cover reads "HUB Surface Systems · Decorative Pavement Solutions ·
 * Volume 5". Every user-facing surface - the reader, the request page, the
 * Resources row, the homepage band and hero callout, search, metadata, the AI
 * writers' prompts - takes its name from here so the word cannot drift again.
 * Code identifiers and routes keep the old names on purpose; renaming files,
 * flags and addresses buys nothing a visitor sees (labels change, URLs stay).
 *
 * The volume number is printed on the cover (page 2's text layer reads
 * "Volume 5") and is not derivable from the PDF's filename, so it is typed here
 * and bumped with the edition. No page count travels with the name: Doug asked
 * for none anywhere.
 */
export const ideaBook = {
  /** Short form, for buttons, links and running text: "Product Portfolio Book". */
  short: "Product Portfolio Book",
  /** Full title, for headings and metadata: "Product Portfolio Book · Volume 5", Doug's words exactly. */
  title: "Product Portfolio Book · Volume 5",
  /** The printed volume, as the cover says it. */
  volume: "Volume 5",
  /**
   * The book's home: the printed book, page by page, open at page one, with
   * a page turn (app/product-book/page.tsx, CatalogueViewer). Doug, 17 Oct
   * 2026: "he likes the virtual print version better, so let's revert to
   * that". /product-book/<n> opens any other page.
   */
  href: "/product-book",
  /**
   * The long-scroll digital edition of 14 Oct 2026, parked unlisted: not
   * linked, not in the sitemap, noindex (app/product-book/edition/page.tsx).
   * Kept so it can come back on a word; nothing was deleted.
   */
  editionHref: "/product-book/edition",
  /** The printed-copy form's route. */
  requestHref: "/request-product-book",
  /**
   * The name the PDF saves under. The file on disk keeps its old name (moving
   * 15 MB through the bundle pipeline buys nothing), so the download link
   * renames it on the way out.
   */
  fileName: `HUB-Product-Portfolio-Book-${raw.edition ?? "edition"}.pdf`,
} as const;

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
