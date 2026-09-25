/**
 * /idea-book - the reader, open at page one.
 *
 * Statically prerendered. The manifest is an import, not a filesystem read, so
 * nothing here is traced into a serverless function and nothing has to be
 * dynamic. /idea-book/[page] serves every other page off the same component.
 */
import { notFound } from "next/navigation";
import CatalogueViewer from "./CatalogueViewer";
import CatalogueEmpty from "./CatalogueEmpty";
import { catalogue, catalogueReady } from "@/lib/catalogue";
import { cataloguePages } from "@/lib/catalogue-pages";
import { showCatalogue } from "@/lib/feature-flags";
import { EXIT_HREF, LUNCH_LEARN_HREF, REQUEST_HREF } from "./links";

export default function CataloguePage() {
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
