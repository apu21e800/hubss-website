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
  const catalogue = await getCatalogueCover();

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

      {/* ── Catalogue 2026 feature — flipbook CTA ──────────── */}
      {catalogue && (
        <div className="relative max-w-7xl mx-auto px-6 pb-10 sm:pb-14">
          <Link
            href="/catalogue?utm_source=resources&utm_medium=feature_card&utm_campaign=catalogue"
            className="group block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(249,115,22,0.22)]"
            style={{
              background: "linear-gradient(135deg, #141b2d 0%, #0d1117 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Top accent line */}
            <div
              className="h-[2px] w-full"
              style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }}
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,360px)_1fr] gap-0">
              {/* Cover — newest rendered v{NN} page-001 */}
              <div className="relative aspect-square md:aspect-auto md:min-h-[300px] overflow-hidden bg-black">
                <Image
                  src={catalogue.src}
                  alt="HUB Surface Systems Catalogue 2026 — cover page"
                  fill
                  sizes="(min-width: 768px) 360px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority
                />
                {/* Right-edge fade into the copy zone on desktop */}
                <div
                  className="hidden md:block absolute inset-y-0 right-0 w-24 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to right, transparent 0%, rgba(13,17,23,0.55) 100%)",
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Copy + CTA */}
              <div className="p-7 sm:p-10 md:py-12 md:pr-10 flex flex-col justify-center">
                <p
                  className="text-[11px] font-bold tracking-[0.22em] uppercase mb-3"
                  style={{ color: "#FB923C" }}
                >
                  Catalogue 2026 · New
                </p>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3"
                  style={{ color: "#F5F0EB", letterSpacing: "-0.02em" }}
                >
                  Browse the full 116-page catalogue in your browser.
                </h2>
                <p
                  className="text-sm sm:text-base leading-relaxed mb-6 max-w-xl"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  Every system, every application, every project — swipe through HUB Surface Systems'
                  complete 2026 catalogue. Mobile-first. No download required.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-colors"
                    style={{
                      background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                      color: "#fff",
                      boxShadow: "0 6px 20px rgba(249,115,22,0.35)",
                    }}
                  >
                    Open the catalogue
                    <span className="transition-transform duration-200 group-hover:translate-x-1 inline-block">→</span>
                  </span>
                  <span
                    className="text-xs font-semibold tracking-[0.18em] uppercase"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {catalogue.pageCount} pages · Free to read
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

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

      <LunchLearn />
      <Footer />
    </main>
  );
}
