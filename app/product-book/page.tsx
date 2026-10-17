/**
 * /product-book - the Product Portfolio Book, Volume 5: the printed book, page
 * by page, open at page one, with a page turn.
 *
 * The book's home. From 14 to 17 Oct 2026 this address served a long-scroll
 * digital edition and the printed reader sat at /product-book/pages; Doug
 * (17 Oct) "likes the virtual print version better, so let's revert to
 * that", so the reader is back here, the edition is parked unlisted at
 * /product-book/edition, and /product-book/pages redirects here
 * (next.config.ts). /product-book/[page] serves every other page off the same
 * component. Statically prerendered; the manifest is an import, not a
 * filesystem read. Metadata is the segment layout's (app/product-book/layout.tsx).
 */
import { notFound } from "next/navigation";
import CatalogueViewer from "./CatalogueViewer";
import CatalogueEmpty from "./CatalogueEmpty";
import { catalogue, catalogueReady } from "@/lib/catalogue";
import { cataloguePages } from "@/lib/catalogue-pages";
import { showCatalogue } from "@/lib/feature-flags";
import { EXIT_HREF, LUNCH_LEARN_HREF, REQUEST_HREF } from "./links";

export default function CatalogueReader() {
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
