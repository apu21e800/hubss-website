/**
 * lib/image-filename.ts
 *
 * The descriptive filename every Sanity photo URL carries (20 Oct 2026; the
 * reasons are in lib/sanity-image.ts). Pure string functions with no imports,
 * in a file of their own (28 Oct 2026): while they shared lib/sanity-image.ts
 * with the @sanity/image-url builders, every page that showed a photo through
 * lib/photos.ts or components/ui/PhotoImage.tsx carried the builder library
 * in its JavaScript too. lib/sanity-image.ts re-exports them, so either
 * import works; client components import from here.
 */

/** The longest name a photo gets, before its extension. */
export const FILENAME_MAX = 60;

/**
 * "UBC Musqueam crosswalk, Vancouver" -> "ubc-musqueam-crosswalk-vancouver":
 * lowercase ASCII words joined by hyphens, accents dropped ("Montréal" ->
 * "montreal"), "&" as "and", an apostrophe closing up ("Children's" ->
 * "childrens"), no hyphen at either end, at most FILENAME_MAX characters, cut
 * at the end of a word. "" when the text has no letters or digits.
 */
export function slugForFilename(text: string | null | undefined): string {
  if (!text) return "";
  const s = text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['‘’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (s.length <= FILENAME_MAX) return s;
  // A cut that lands on a hyphen is already a word boundary; otherwise back up
  // to the last one (one word longer than the limit is cut where it stands).
  if (s[FILENAME_MAX] === "-") return s.slice(0, FILENAME_MAX);
  const head = s.slice(0, FILENAME_MAX);
  const end = head.lastIndexOf("-");
  return (end > 0 ? head.slice(0, end) : head).replace(/-+$/, "");
}

/** The name for a photo: the first of the texts given that has words in it ("" when none has). */
export function imageFilename(...texts: (string | null | undefined)[]): string {
  for (const t of texts) {
    const name = slugForFilename(t);
    if (name) return name;
  }
  return "";
}

// https://cdn.sanity.io/images/<project>/<dataset>/<hash>-<w>x<h>.<ext>[/<name>][?query]
const SANITY_IMAGE = /^(https:\/\/cdn\.sanity\.io\/images\/[^/?#]+\/[^/?#]+\/)([^/?#]+)(?:\/[^?#]*)?/;

/**
 * The asset's own file in a Sanity image URL ("<hash>-2400x1800.jpg"), named
 * or not; "" for any other URL. Read this, never the last path segment: on a
 * named address the last segment is the name.
 */
export function sanityAssetFile(url: string | null | undefined): string {
  if (!url) return "";
  return SANITY_IMAGE.exec(url)?.[2] ?? "";
}

/**
 * A Sanity image URL with its descriptive filename: the first text with
 * words in it (the photo's alt, then the document's title or slug), as
 * slugForFilename spells it, with the asset's own extension. The query and
 * everything else are left exactly as they were, so a srcset keeps its
 * widths and parameters and only the path changes. A name already on the URL
 * is replaced. With no usable text, or for any URL not on Sanity's image CDN
 * (a /public path, another host), the URL comes back unchanged.
 */
export function withFilename(url: string, ...texts: (string | null | undefined)[]): string {
  const m = SANITY_IMAGE.exec(url);
  if (!m) return url;
  const name = imageFilename(...texts);
  if (!name) return url;
  const ext = /\.([a-z0-9]+)$/i.exec(m[2])?.[1]?.toLowerCase();
  return `${m[1]}${m[2]}/${name}${ext ? `.${ext}` : ""}${url.slice(m[0].length)}`;
}
