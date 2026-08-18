import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { resourceDocuments, applyDocOverrides } from "@/lib/resource-documents";
import ResourcesClient from "@/components/resources/ResourcesClient";
import { getResourceDocuments } from "@/lib/sanity.queries";
import { showCatalogue } from "@/lib/feature-flags";
import Image from "next/image";

import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Specification Library & Technical Resources",
  description:
    "Technical data sheets, spec sheets, brochures, safety guides, and installation resources for every HUB Surface Systems decorative pavement product. Download free for any project.",
  slug: "resources",
});

export default async function ResourcesPage() {
  const sanityDocs = await getResourceDocuments().catch(() => null);
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
      style={{ background: "linear-gradient(160deg, #0d1117 0%, #141b2d 60%, #0d1117 100%)" }}
    >
      {/* Orange glow — top left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -120,
          left: -80,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <Nav />

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-16">
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
          style={{ color: "#F97316" }}
        >
          Resources
        </p>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ color: "#F5F0EB" }}
        >
          Specification Library
        </h1>
        <p className="text-base max-w-2xl" style={{ color: "#868C98" }}>
          Technical data sheets, brochures, safety guides, and installation
          resources for every HUBSS product.
        </p>
      </div>

      {/* ── Catalogue 2026 feature card ──────────────────────
          Prominent, flag-gated entry to the flipbook (mirrors the
          mega-menu banner). The catalogue also stays in the filterable
          library below; this card guarantees it's accessible without
          paging. Hidden on production until NEXT_PUBLIC_SHOW_CATALOGUE. */}
      {showCatalogue() && (
        <div className="relative max-w-7xl mx-auto px-6 -mt-6 mb-14">
          <a
            href="/catalogue?utm_source=resources&utm_medium=feature_card&utm_campaign=catalogue"
            className="group flex flex-col sm:flex-row items-stretch overflow-hidden rounded-2xl transition-all hover:-translate-y-[2px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.05) 50%, rgba(255,255,255,0.03) 100%)",
              border: "1px solid rgba(249,115,22,0.30)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            }}
          >
            <div className="relative flex-shrink-0 overflow-hidden bg-black sm:w-[200px] h-[150px] sm:h-auto">
              {/* Card is full-width (minus the px-6 page padding) below the
                  `sm` breakpoint (640px), then a fixed 200px sidebar above it.
                  Empirically the LCP element on this route (measured via
                  PerformanceObserver), so it's the one priority image here. */}
              <Image
                src="/catalogue/cover.webp"
                alt="HUB Surface Systems 2026 Catalogue cover"
                fill
                sizes="(max-width: 639px) calc(100vw - 48px), 200px"
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex-1 min-w-0 p-6 sm:p-7 flex flex-col justify-center">
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-2 flex items-center gap-2" style={{ color: "#FB923C" }}>
                Catalogue 2026
                <span className="text-[9px] font-bold tracking-[0.18em] uppercase px-1.5 py-0.5 rounded" style={{ background: "rgba(249,115,22,0.20)" }}>New</span>
              </p>
              <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-1.5" style={{ color: "#F5F0EB" }}>
                Browse the 2026 catalogue in your browser
              </h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                140 pages · every product &amp; application · free to read, no download
              </p>
            </div>
            <div className="flex-shrink-0 self-center pr-7 pb-6 sm:pb-0">
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase transition-transform duration-200 group-hover:translate-x-1" style={{ color: "#FB923C" }}>
                Open <span aria-hidden="true">→</span>
              </span>
            </div>
          </a>
        </div>
      )}

      {/* ── Document Library — L&L card style ──────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "var(--bg-card)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
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
              style={{ color: "#F97316" }}
            >
              All Documents
            </h2>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.07)" }}
            />
            <span className="text-xs" style={{ color: "#868C98" }}>
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
