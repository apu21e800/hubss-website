/**
 * /product-book/edition - the long-scroll digital edition of 14 Oct 2026,
 * parked unlisted.
 *
 * It served at /product-book from 14 to 17 Oct 2026 (Vern: "a mobile /
 * virtual desktop version ... Doug's dream"). Doug, 17 Oct: "not happy with
 * the virtual long scroll version ... he likes the virtual print version
 * better, so let's revert to that". The reader is the book's home again
 * (app/product-book/page.tsx); this address keeps the edition reachable for
 * a comparison or a change of mind, with nothing linking to it, no sitemap
 * entry and a noindex, so search engines never hold two copies of the book's
 * words. Delete the folder when it is no longer wanted.
 *
 * One leaf per printed spread (lib/idea-book-edition.ts), laid out for the
 * screen (components/idea-book/Leaves.tsx), with the book's chrome around it
 * (components/idea-book/EditionShell.tsx). Every leaf links to its pages as
 * printed, in the reader at /product-book and /product-book/<n>.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../edition.css";
import EditionShell, { type ContentsEntry } from "@/components/idea-book/EditionShell";
import { LeafView } from "@/components/idea-book/Leaves";
import CatalogueEmpty from "../CatalogueEmpty";
import { catalogueReady, ideaBook } from "@/lib/catalogue";
import { showCatalogue } from "@/lib/feature-flags";
import { LEAVES, SECTIONS, leafTitle, pageLabel } from "@/lib/idea-book-edition";
import { getSiteSettings } from "@/lib/sanity.queries";

export function generateMetadata(): Metadata {
  return {
    title: { absolute: `${ideaBook.title}, screen edition | HUB Surface Systems` },
    // Unlisted: the reader at /product-book is the book's one indexed home.
    robots: { index: false, follow: true },
    alternates: { canonical: `https://hubss.com${ideaBook.editionHref}` },
  };
}

export default async function IdeaBookEdition() {
  if (!showCatalogue()) notFound();
  if (!catalogueReady) return <CatalogueEmpty />;
  const settings = await getSiteSettings();
  const contents: ContentsEntry[] = LEAVES.map((leaf) => ({ id: leaf.id, title: leafTitle(leaf), pages: pageLabel(leaf), section: leaf.section }));

  return (
    <EditionShell title={ideaBook.title} volume={ideaBook.volume} contents={contents} sections={SECTIONS} printedHref={ideaBook.href} total={LEAVES.length}>
      {LEAVES.map((leaf, i) => (
        <LeafView key={leaf.id} leaf={leaf} index={i} settings={settings} priority={i === 0} />
      ))}
    </EditionShell>
  );
}
