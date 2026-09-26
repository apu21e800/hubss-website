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
import { catalogue, catalogueReady, cataloguePageUrl, ideaBook } from "@/lib/catalogue";
import { showCatalogue } from "@/lib/feature-flags";

export function generateMetadata(): Metadata {
  // Nothing to advertise when the route 404s.
  if (!showCatalogue() || !catalogueReady) {
    return { robots: { index: false, follow: false } };
  }
  const big = catalogue.widths[catalogue.widths.length - 1];
  const cover = cataloguePageUrl(1, big);
  const edition = catalogue.edition ?? "";
  // No page count here, by Doug's ask (25 Sep 2026): the book is named, not
  // measured. (The old copy said "116 pages" for a 144-page book anyway.)
  const description = `Read ${ideaBook.title} in your browser: HUB Surface Systems' decorative pavement systems, applications and specifications for Canadian municipalities, developers and contractors. ${edition} edition.`;
  return {
    // `absolute`, not a bare string: the root layout defines a
    // "%s | HUB Surface Systems" template, and a layout title goes through it.
    title: { absolute: `${ideaBook.title} | HUB Surface Systems` },
    description,
    alternates: { canonical: `https://hubss.com${ideaBook.href}` },
    // The reader is installable (public/idea-book.webmanifest, registered by
    // the viewer with /idea-book-sw.js). Linked here, on these routes only,
    // so a phone offers to install the book and not the whole site.
    manifest: "/idea-book.webmanifest",
    appleWebApp: { capable: true, title: ideaBook.short, statusBarStyle: "black-translucent" },
    icons: { apple: "/idea-book/apple-touch-icon.png" },
    openGraph: {
      title: ideaBook.title,
      description,
      url: `https://hubss.com${ideaBook.href}`,
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
