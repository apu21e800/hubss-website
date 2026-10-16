/**
 * /product-book/pages - the printed book, page by page, open at page one.
 *
 * The book's own home, /product-book, is the digital edition since 14 Oct 2026
 * (app/product-book/page.tsx). This is the reader of the page renders, the book
 * as printed, for anyone who wants it that way and for the edition's "Printed
 * pages" links; /product-book/[page] serves every other page off the same
 * component. Statically prerendered; the manifest is an import, not a
 * filesystem read.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CatalogueViewer from "../CatalogueViewer";
import CatalogueEmpty from "../CatalogueEmpty";
import { catalogue, catalogueReady, cataloguePageUrl, ideaBook } from "@/lib/catalogue";
import { cataloguePages } from "@/lib/catalogue-pages";
import { showCatalogue } from "@/lib/feature-flags";
import { EXIT_HREF, LUNCH_LEARN_HREF, REQUEST_HREF } from "../links";

export function generateMetadata(): Metadata {
  if (!showCatalogue() || !catalogueReady) return { robots: { index: false, follow: false } };
  const big = catalogue.widths[catalogue.widths.length - 1];
  const description = `${ideaBook.title} page by page, as printed: every spread of HUB Surface Systems' systems and applications, with the PDF to download.`;
  return {
    title: { absolute: `${ideaBook.title}, as printed | HUB Surface Systems` },
    description,
    alternates: { canonical: `https://hubss.com${ideaBook.pagesHref}` },
    openGraph: {
      title: `${ideaBook.title}, as printed`,
      description,
      url: `https://hubss.com${ideaBook.pagesHref}`,
      images: [{ url: `https://hubss.com${cataloguePageUrl(1, big)}`, width: big, height: Math.round(big / catalogue.aspect) }],
    },
  };
}

export default function CataloguePagesReader() {
  if (!showCatalogue()) notFound();
  if (!catalogueReady) return <CatalogueEmpty />;

  return (
    <CatalogueViewer
      pages={cataloguePages}
      widths={catalogue.widths}
      aspect={catalogue.aspect}
      edition={catalogue.edition ?? ""}
      start={1}
      download={catalogue.download}
      exitHref={EXIT_HREF}
      requestHref={REQUEST_HREF}
      lunchLearnHref={LUNCH_LEARN_HREF}
    />
  );
}
