/**
 * What each page of the Idea Book is about, for the reader's hotspots and
 * its contents list (Doug's round, phase 3: "hotspots to product and
 * application pages", "a contents list and a text alternative").
 *
 * Derived from the page numbers the two catalogue transcriptions already
 * carry (lib/product-catalogue.ts, lib/application-catalogue.ts): a product
 * spread opens on its `page` and runs across the gutter to page + 1, and an
 * application spread does the same. No coordinates are mapped — a chip for
 * the spread is exact, a rectangle drawn by hand over a photograph would not
 * be, and the chip is what a screen reader can use.
 *
 * Server-side only: it imports both transcriptions, which the reader (a
 * client component) must not carry. The page components build the map here
 * and pass it down as a prop.
 */
import { PRODUCT_CATALOGUE } from "./product-catalogue";
import { APPLICATION_CATALOGUE } from "./application-catalogue";
import { products } from "./products";
import { applications } from "./applications";

export type IdeaBookLink = {
  /** What the chip says: the product or application's name on the site. */
  label: string;
  /** Where it goes. */
  href: string;
  kind: "product" | "application";
  /** First page of the spread, for the contents list. */
  page: number;
};

/** Page number → the things that page (or its spread) shows. */
export type IdeaBookLinks = Record<number, IdeaBookLink[]>;

export type IdeaBookContentsSection = {
  title: string;
  items: IdeaBookLink[];
};

function add(map: IdeaBookLinks, page: number, link: IdeaBookLink) {
  for (const n of [page, page + 1]) {
    (map[n] ??= []).push(link);
  }
}

export function buildIdeaBookLinks(): IdeaBookLinks {
  const map: IdeaBookLinks = {};
  for (const [slug, entry] of Object.entries(PRODUCT_CATALOGUE)) {
    const p = products.find((x) => x.slug === slug);
    if (!p || !entry.page) continue;
    add(map, entry.page, { label: p.name, href: `/products/${slug}`, kind: "product", page: entry.page });
  }
  for (const [slug, entry] of Object.entries(APPLICATION_CATALOGUE)) {
    const a = applications.find((x) => x.slug === slug);
    if (!a || !entry.page) continue;
    add(map, entry.page, { label: a.name, href: `/applications/${slug}`, kind: "application", page: entry.page });
  }
  return map;
}

/** The contents list: products in book order, then applications in book order. */
export function buildIdeaBookContents(): IdeaBookContentsSection[] {
  const byPage = (a: IdeaBookLink, b: IdeaBookLink) => a.page - b.page || a.label.localeCompare(b.label);
  const seen = new Set<string>();
  const all: IdeaBookLink[] = [];
  for (const links of Object.values(buildIdeaBookLinks())) {
    for (const l of links) {
      if (seen.has(l.href)) continue;
      seen.add(l.href);
      all.push(l);
    }
  }
  return [
    { title: "Systems", items: all.filter((l) => l.kind === "product").sort(byPage) },
    { title: "Applications", items: all.filter((l) => l.kind === "application").sort(byPage) },
  ];
}
