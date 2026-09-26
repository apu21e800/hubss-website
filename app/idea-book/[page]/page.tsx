/**
 * /idea-book/12 - a real, shareable, prerendered route per page.
 *
 * All 144 are generated at build time, so a shared link opens on the right page
 * with no client round-trip and no flash of page one. Turning pages inside the
 * reader rewrites the URL with replaceState instead of navigating, so these
 * routes are entry points rather than 144 history entries.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CatalogueViewer from "../CatalogueViewer";
import { catalogue, catalogueReady, catalogueTotal, cataloguePageUrl, ideaBook, normalisePage } from "@/lib/catalogue";
import { cataloguePages } from "@/lib/catalogue-pages";
import { showCatalogue } from "@/lib/feature-flags";
import { buildIdeaBookContents, buildIdeaBookLinks } from "@/lib/idea-book-links";
import { EXIT_HREF, LUNCH_LEARN_HREF, REQUEST_HREF } from "../links";

export const dynamicParams = false;

export function generateStaticParams() {
  if (!catalogueReady) return [];
  // Page one lives at /idea-book; a duplicate route for it would split the
  // signal between two URLs for the same content.
  return cataloguePages.slice(1).map((p) => ({ page: String(p.n) }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const n = normalisePage(page);
  if (!showCatalogue() || n === null) return { robots: { index: false, follow: false } };
  const alt = cataloguePages[n - 1]?.alt ?? "";
  const big = catalogue.widths[catalogue.widths.length - 1];
  return {
    title: { absolute: `${ideaBook.title}, page ${n} | HUB Surface Systems` },
    description: alt,
    alternates: { canonical: `https://hubss.com${ideaBook.href}/${n}` },
    openGraph: {
      title: `${ideaBook.title} - page ${n}`,
      description: alt,
      url: `https://hubss.com${ideaBook.href}/${n}`,
      images: [{ url: `https://hubss.com${cataloguePageUrl(n, big)}`, width: big, height: Math.round(big / catalogue.aspect) }],
    },
  };
}

export default async function CataloguePageAt({ params }: { params: Promise<{ page: string }> }) {
  if (!showCatalogue()) notFound();
  const { page } = await params;
  const n = normalisePage(page);
  if (n === null || !catalogueReady || n > catalogueTotal) notFound();

  return (
    <CatalogueViewer
      pages={cataloguePages}
      widths={catalogue.widths}
      aspect={catalogue.aspect}
      edition={catalogue.edition ?? ""}
      start={n}
      download={catalogue.download}
      exitHref={EXIT_HREF}
      requestHref={REQUEST_HREF}
      lunchLearnHref={LUNCH_LEARN_HREF}
      links={buildIdeaBookLinks()}
      contents={buildIdeaBookContents()}
    />
  );
}
