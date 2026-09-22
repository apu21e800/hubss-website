/**
 * The reader's stage: black, full-bleed, no site chrome.
 *
 * Deliberately not the root layout's job. Analytics and chat still mount from
 * the root; this only removes the page furniture that would otherwise sit on
 * top of the artwork. `data-surface="dark"` re-scopes the theme tokens so the
 * chrome stays legible when the site is in light or mixed mode - the previous
 * viewer used --text-primary unscoped, which on a light theme would have put
 * near-black text on a black stage.
 */
import type { Metadata } from "next";
import { catalogue, catalogueReady, catalogueTotal, cataloguePageUrl } from "@/lib/catalogue";
import { showCatalogue } from "@/lib/feature-flags";

export function generateMetadata(): Metadata {
  // Nothing to advertise when the route 404s.
  if (!showCatalogue() || !catalogueReady) {
    return { robots: { index: false, follow: false } };
  }
  const big = catalogue.widths[catalogue.widths.length - 1];
  const cover = cataloguePageUrl(1, big);
  const edition = catalogue.edition ?? "";
  // Page count comes from the manifest. The old copy here said "116 pages"
  // while the folder it pointed at held 140 and the book has 144.
  const description = `Read the HUB Surface Systems catalogue in your browser - ${catalogueTotal} pages of decorative pavement systems, applications and specifications for Canadian municipalities, developers and contractors.`;
  return {
    // `absolute`, not a bare string: the root layout defines a
    // "%s | HUB Surface Systems" template, and a layout title goes through it.
    title: { absolute: `Catalogue ${edition} | HUB Surface Systems` },
    description,
    alternates: { canonical: "https://hubss.com/catalogue" },
    openGraph: {
      title: `HUB Surface Systems Catalogue ${edition}`,
      description,
      url: "https://hubss.com/catalogue",
      images: [{ url: `https://hubss.com${cover}`, width: big, height: Math.round(big / catalogue.aspect) }],
    },
  };
}

export default function CatalogueLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-black" data-surface="dark" data-catalogue-route>
      {children}
    </div>
  );
}
