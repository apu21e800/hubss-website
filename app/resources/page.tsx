import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { promises as fs } from "node:fs";
import path from "node:path";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { resourceDocuments } from "@/lib/resource-documents";
import ResourcesClient from "@/components/resources/ResourcesClient";
import { getResourceDocuments } from "@/lib/sanity.queries";
import { showCatalogue } from "@/lib/feature-flags";

import { buildMetadata } from "@/lib/seo";

// Mirror /catalogue's auto-detect so the Resources feature card always
// shows the cover from the newest rendered catalogue version.
async function getCatalogueCover(): Promise<{ src: string; pageCount: number } | null> {
  try {
    const root = path.join(process.cwd(), "public", "catalogue");
    const dirs = await fs.readdir(root, { withFileTypes: true });
    const versions = dirs
      .filter((d) => d.isDirectory() && /^v\d+$/.test(d.name))
      .map((d) => ({ name: d.name, n: parseInt(d.name.slice(1), 10) }))
      .sort((a, b) => b.n - a.n);
    for (const v of versions) {
      const versionDir = path.join(root, v.name);
      const files = (await fs.readdir(versionDir)).filter((f) => /^page-\d{3}\.webp$/.test(f));
      if (files.length > 0) {
        return { src: `/catalogue/${v.name}/page-001.webp`, pageCount: files.length };
      }
    }
  } catch { /* fall through */ }
  return null;
}

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Specification Library & Technical Resources",
  description:
    "Technical data sheets, spec sheets, brochures, safety guides, and installation resources for every HUB Surface Systems decorative pavement product. Download free for any project.",
  slug: "resources",
});

export default async function ResourcesPage() {
  const sanityDocs = await getResourceDocuments().catch(() => null);
  const docs = sanityDocs ?? resourceDocuments;
  // Skip cover lookup entirely when the catalogue is hidden — keeps the
  // gated section from leaking even an image path.
  const catalogue = showCatalogue() ? await getCatalogueCover() : null;

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
        <p className="text-base max-w-2xl" style={{ color: "#6B7280" }}>
          Technical data sheets, brochures, safety guides, and installation
          resources for every HUBSS product.
        </p>
      </div>

      {/* ── Document Library — L&L card style ──────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "#1a1e28",
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
            <span className="text-xs" style={{ color: "#6B7280" }}>
              {docs.length} total
            </span>
          </div>
          <ResourcesClient documents={docs} />
        </div>
      </section>

      {/* ── Catalogue 2026 — dedicated section ───────────────────
            Lives in its own titled section under the document
            library so the catalogue reads as a first-class
            resource, not a banner glued to the docs list. */}
      {catalogue && (
        <section className="relative">
          <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
            {/* Section label — matches "All Documents" treatment */}
            <div className="flex items-center gap-4 mb-10">
              <h2
                className="text-sm font-bold tracking-widest uppercase"
                style={{ color: "#F97316" }}
              >
                Catalogue 2026
              </h2>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(255,255,255,0.07)" }}
              />
              <span className="text-xs" style={{ color: "#6B7280" }}>
                {catalogue.pageCount} pages
              </span>
            </div>

            <Link
              href="/catalogue?utm_source=resources&utm_medium=feature_section&utm_campaign=catalogue"
              className="group block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_44px_rgba(249,115,22,0.20)]"
              style={{
                background: "linear-gradient(135deg, #141b2d 0%, #0d1117 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="h-[2px] w-full"
                style={{ background: "linear-gradient(90deg, #F97316 0%, #EAB308 100%)" }}
                aria-hidden="true"
              />
              {/* Square cover thumb — the catalogue cover renders at 1:1
                  (1800×1800 webp), so any non-square crop chops artwork.
                  aspect-square + object-cover keeps the full cover visible
                  on both desktop and mobile. */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] items-stretch">
                <div className="relative overflow-hidden bg-black aspect-square md:aspect-square">
                  <Image
                    src={catalogue.src}
                    alt="HUB Surface Systems Catalogue 2026 — cover"
                    fill
                    sizes="(min-width: 768px) 200px, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6 sm:p-7 md:py-8 md:px-8 flex flex-col justify-center">
                  <p
                    className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2"
                    style={{ color: "#FB923C" }}
                  >
                    Featured · Virtual Catalogue
                  </p>
                  <p
                    className="text-lg sm:text-xl md:text-2xl font-semibold leading-snug mb-2"
                    style={{ color: "#F5F0EB" }}
                  >
                    Browse the complete {catalogue.pageCount}-page catalogue in your browser.
                  </p>
                  <p
                    className="text-[13px] sm:text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Every product, application, and recent project — searchable,
                    shareable, and downloadable as a PDF. No download required to read.
                  </p>
                </div>
                {/* Desktop CTA */}
                <div className="hidden md:flex items-center pr-8 pl-2">
                  <span
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-[12px] font-bold tracking-[0.18em] uppercase transition-transform duration-200 group-hover:translate-x-1"
                    style={{
                      background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                      color: "#fff",
                      boxShadow: "0 6px 18px rgba(249,115,22,0.32)",
                    }}
                  >
                    Open <span aria-hidden="true">→</span>
                  </span>
                </div>
                {/* Mobile CTA */}
                <div className="md:hidden px-6 pb-6">
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold tracking-[0.18em] uppercase"
                    style={{
                      background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                      color: "#fff",
                    }}
                  >
                    Open <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <LunchLearn />
      <Footer />
    </main>
  );
}
