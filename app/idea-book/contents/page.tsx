/**
 * /idea-book/contents - the book as text, on one page.
 *
 * The reader shows pictures of pages; a search engine and a screen reader
 * need the words. This page lists every system and application spread with
 * the line the printed page leads with, the page it is on, and where the full
 * copy lives on the site. It is the reader's Contents panel as a real page,
 * and the text alternative Doug's round asked for.
 *
 * A static route, so it takes precedence over /idea-book/[page].
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ideaBook, catalogueReady, catalogue } from "@/lib/catalogue";
import { showCatalogue } from "@/lib/feature-flags";
import { buildIdeaBookContents } from "@/lib/idea-book-links";
import { PRODUCT_CATALOGUE } from "@/lib/product-catalogue";
import { APPLICATION_CATALOGUE } from "@/lib/application-catalogue";

export const metadata: Metadata = {
  title: { absolute: `${ideaBook.title} · contents | HUB Surface Systems` },
  description: `Every system and application in ${ideaBook.title}, with the page each one is on and a link to its full page on hubss.com.`,
  alternates: { canonical: `https://hubss.com${ideaBook.href}/contents` },
};

function lineFor(href: string): string | null {
  const slug = href.split("/").pop() ?? "";
  if (href.startsWith("/products/")) {
    const e = PRODUCT_CATALOGUE[slug];
    return e ? `${e.title} ${e.subhead}` : null;
  }
  const e = APPLICATION_CATALOGUE[slug];
  return e ? `${e.title} ${e.statement}` : null;
}

export default function IdeaBookContentsPage() {
  if (!showCatalogue() || !catalogueReady) notFound();
  const sections = buildIdeaBookContents();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16" style={{ color: "rgba(255,255,255,0.88)" }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "#fb923c" }}>
        {ideaBook.short} · {ideaBook.volume} · {catalogue.edition}
      </p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl" style={{ color: "#fff" }}>
        Contents
      </h1>
      <p className="mt-3 text-base" style={{ color: "rgba(255,255,255,0.62)" }}>
        Every system and application in the book, the page it opens on, and where its full copy lives on the site.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={ideaBook.href}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: "#F97316" }}
        >
          Open the {ideaBook.short}
        </Link>
        {catalogue.download && (
          <a
            href={catalogue.download.href}
            download={ideaBook.fileName}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-semibold"
            style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            Download the PDF ({catalogue.download.label})
          </a>
        )}
      </div>

      {sections.map((section) => (
        <section key={section.title} className="mt-12" aria-labelledby={`contents-${section.title.toLowerCase()}`}>
          <h2 id={`contents-${section.title.toLowerCase()}`} className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.45)" }}>
            {section.title}
          </h2>
          <ol className="mt-4 divide-y" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            {section.items.map((item) => {
              const line = lineFor(item.href);
              return (
                <li key={item.href} className="flex items-baseline gap-4 py-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <span className="w-8 flex-shrink-0 text-[12px] tabular-nums" style={{ color: "rgba(255,255,255,0.42)" }}>
                    {item.page}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={`${ideaBook.href}/${item.page}`} className="text-[16px] font-semibold text-white underline-offset-4 hover:underline">
                      {item.label}
                    </Link>
                    {line && (
                      <p className="mt-0.5 text-[14px]" style={{ color: "rgba(255,255,255,0.62)" }}>
                        {line}
                      </p>
                    )}
                  </div>
                  <Link href={item.href} className="flex-shrink-0 text-[12px] font-semibold" style={{ color: "#fb923c" }}>
                    Full page →
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <p className="mt-12 text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
        Pages not listed are the book&apos;s introduction, colour charts and photography; the reader shows them all.
      </p>
    </main>
  );
}
