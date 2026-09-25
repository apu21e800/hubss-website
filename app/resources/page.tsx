import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { resourceDocuments, applyDocOverrides } from "@/lib/resource-documents";
import ResourcesClient from "@/components/resources/ResourcesClient";
import { getResourceDocuments } from "@/lib/sanity.queries";
import { showCatalogue } from "@/lib/feature-flags";
import {
  catalogue,
  catalogueCover,
  catalogueLabel,
  cataloguePageUrl,
  catalogueTotal,
} from "@/lib/catalogue";

import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Specification Library & Technical Resources",
  description:
    "Technical data sheets, spec sheets, brochures, safety guides, and installation resources for every HUB Surface Systems decorative pavement product. Download free for any project.",
  slug: "resources",
});

export default async function ResourcesPage() {
  const sanityDocs = await getResourceDocuments();
  // Sanity-curated entries take precedence (Vernon's siteSettings array
  // wins when an id exists in both). Then append any hardcoded entries
  // whose id is NOT present in Sanity — that's how the Catalogue + the
  // 14 product flyers reach the page even though they haven't been
  // imported into Sanity yet. Previous logic (`sanityDocs ?? hardcoded`)
  // replaced wholesale, so any Sanity response — even just the 89 legacy
  // spec sheets — silently dropped the catalogue and flyers from view.
  const merged = applyDocOverrides(
    sanityDocs
      ? [
          ...sanityDocs,
          ...resourceDocuments.filter(
            (d) => !sanityDocs.some((s) => s.id === d.id),
          ),
        ]
      : resourceDocuments,
  );

  // Catalogue card is gated on the same flag as the /catalogue route it
  // links to: visible on staging/preview for review, hidden on production
  // until NEXT_PUBLIC_SHOW_CATALOGUE is set — so it never dead-links.
  const docs = showCatalogue()
    ? merged
    : merged.filter((d) => d.id !== "catalogue-2026");

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      data-surface="paper"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* The orange glow that sat here was tuned for a black page; on paper it
          reads as a stain, so it is gone rather than dimmed. */}

      <Nav />

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-16">
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          style={{ color: "var(--accent-text-lg)" }}
        >
          Resources
        </p>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Specification Library
        </h1>
        <p className="text-base max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          Technical data sheets, brochures, safety guides, and installation
          resources for every HUBSS product.
        </p>
      </div>

      {/* The catalogue, present but not shouting.
          It was a full-width panel with a 150px cover and its own h2 — louder
          than the Specification Library it sits above, which is what people
          actually come here for. Now it is one quiet row: the book, its name,
          and the two ways in. */}
      {showCatalogue() && catalogueCover && (
        <div className="relative max-w-7xl mx-auto px-6 -mt-4 mb-12">
          {/* On a phone the buttons take their own row, full width, so the
              text keeps the whole line. They used to share one row with it,
              which squeezed the text to three words a line and broke
              "2026–27" in two. */}
          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl px-4 py-3"
            style={{ background: "var(--bg-card-neutral)", border: "1px solid var(--border-color)" }}
          >
            <div className="flex min-w-0 flex-1 basis-64 items-center gap-4">
              <img
                src={catalogue.coverThumb ?? cataloguePageUrl(1, catalogue.widths[0])}
                alt={`HUB Surface Systems Catalogue ${catalogueLabel} cover`}
                width={240}
                height={240}
                className="h-11 w-11 flex-shrink-0 rounded-md object-cover"
                style={{ border: "1px solid var(--ink-12)" }}
              />
              <div className="min-w-0">
                <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                  Catalogue {catalogueLabel}
                </p>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {catalogueTotal} pages — every system and application
                </p>
              </div>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <a
                href="/catalogue?utm_source=resources&utm_medium=library_row&utm_campaign=catalogue"
                className="flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-center text-xs font-semibold transition-colors sm:flex-none"
                style={{ color: "var(--accent-text)", border: "1px solid rgba(249,115,22,0.32)", background: "rgba(249,115,22,0.08)" }}
              >
                Read it
              </a>
              <a
                href="/request-catalogue?utm_source=resources&utm_medium=library_row&utm_campaign=printed_copy"
                className="flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-center text-xs font-semibold transition-colors sm:flex-none"
                style={{ color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}
              >
                Request a copy
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Document Library — L&L card style ──────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--ink-08)",
          borderBottom: "1px solid var(--ink-08)",
        }}
      >
        {/* Orange top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, #f97316 0%, rgba(249,115,22,0.3) 60%, transparent 100%)" }}
          aria-hidden="true"
        />

        {/* Orange radial glow — bottom right */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-80px",
            right: "-80px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(ellipse at center, rgba(249,115,22,0.07) 0%, rgba(249,115,22,0.02) 45%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-6 py-16 pb-28 relative">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-10">
            <h2
              className="text-sm font-bold tracking-widest uppercase"
              style={{ color: "var(--accent-text-lg)" }}
            >
              All Documents
            </h2>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--fill-subtle)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {docs.length} total
            </span>
          </div>
          <ResourcesClient documents={docs} />
        </div>
      </section>

            <LunchLearn />
      <Footer />
    </main>
  );
}
