import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { promises as fs } from "node:fs";
import path from "node:path";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { resourceDocuments, applyDocOverrides } from "@/lib/resource-documents";
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
  const docs = applyDocOverrides(sanityDocs ?? resourceDocuments);
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

      {/* ── Catalogue 2026 feature — compact flipbook CTA ──────
            Tidy horizontal card: cover thumb + label + arrow. Sits
            modestly above the document library so it's findable
            without dominating the hero. */}
      {catalogue && (
        <div className="relative max-w-3xl mx-auto px-6 pb-10 sm:pb-12">
          <Link
            href="/catalogue?utm_source=resources&utm_medium=feature_card&utm_campaign=catalogue"
            className="group flex items-stretch gap-4 sm:gap-5 overflow-hidden rounded-xl pr-4 sm:pr-5 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(249,115,22,0.15)]"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Cover thumb — newest rendered v{NN} page-001 (UBC + Musqueam) */}
            <div
              className="relative flex-shrink-0 overflow-hidden bg-black"
              style={{ width: 88, height: 88 }}
            >
              <Image
                src={catalogue.src}
                alt="HUB Surface Systems Catalogue 2026 — cover thumbnail"
                fill
                sizes="88px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0 py-3">
              <p
                className="text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5"
                style={{ color: "#FB923C" }}
              >
                Catalogue 2026
              </p>
              <p
                className="text-sm sm:text-base font-semibold leading-snug"
                style={{ color: "#F5F0EB" }}
              >
                Browse the catalogue in your browser
              </p>
              <p
                className="text-[11px] mt-0.5"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {catalogue.pageCount} pages · free to read
              </p>
            </div>

            {/* Arrow */}
            <span
              className="flex-shrink-0 self-center inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.18em] uppercase transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: "#FB923C" }}
            >
              Open <span aria-hidden="true">→</span>
            </span>
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
