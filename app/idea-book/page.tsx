/**
 * /idea-book - the Idea Book, Volume 5, as a digital edition (14 Oct 2026).
 *
 * Vern: "a mobile / virtual desktop version of the idea book that's not just
 * a square PDF ... same content in booklet, better display for mobile and
 * desktop". One leaf per printed spread (lib/idea-book-edition.ts), laid out
 * for the screen it is read on (components/idea-book/Leaves.tsx), with the
 * book's chrome around it (components/idea-book/EditionShell.tsx). Every leaf
 * links to its pages as printed, in the page-by-page reader at
 * /idea-book/pages and /idea-book/<n>.
 *
 * Statically prerendered: every word of the book is in the HTML. The offices
 * on the last leaf come from Studio's Site Settings, like everywhere else.
 */
import { notFound } from "next/navigation";
import "./edition.css";
import EditionShell, { type ContentsEntry } from "@/components/idea-book/EditionShell";
import { LeafView } from "@/components/idea-book/Leaves";
import CatalogueEmpty from "./CatalogueEmpty";
import { catalogueReady, ideaBook } from "@/lib/catalogue";
import { showCatalogue } from "@/lib/feature-flags";
import { LEAVES, SECTIONS, leafTitle, pageLabel } from "@/lib/idea-book-edition";
import { getSiteSettings } from "@/lib/sanity.queries";

export default async function IdeaBookEdition() {
  if (!showCatalogue()) notFound();
  if (!catalogueReady) return <CatalogueEmpty />;
  const settings = await getSiteSettings();
  const contents: ContentsEntry[] = LEAVES.map((leaf) => ({ id: leaf.id, title: leafTitle(leaf), pages: pageLabel(leaf), section: leaf.section }));

  return (
    <EditionShell title={ideaBook.title} volume={ideaBook.volume} contents={contents} sections={SECTIONS} printedHref={ideaBook.href} pagesHref={ideaBook.pagesHref} total={LEAVES.length}>
      {LEAVES.map((leaf, i) => (
        <LeafView key={leaf.id} leaf={leaf} index={i} settings={settings} priority={i === 0} />
      ))}
    </EditionShell>
  );
}
