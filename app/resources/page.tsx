import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { resourceDocuments } from "@/lib/resource-documents";
import ResourcesClient from "@/components/resources/ResourcesClient";

export const metadata: Metadata = {
  title: "Specification Library | HUB Surface Systems",
  description:
    "Technical data sheets, spec sheets, brochures, safety guides, and installation resources for every HUBSS decorative pavement product.",
};

export default function ResourcesPage() {
  return (
    <main className="min-h-screen" style={{ background: "#0A0A0A" }}>
      <Nav />

      {/* ── Dark Page Header ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-14">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#F97316" }}>
          Resources
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight" style={{ color: "#F5F0EB" }}>
          Specification Library
        </h1>
        <p className="text-base max-w-2xl" style={{ color: "#9CA3AF" }}>
          Technical data sheets, brochures, safety guides, and installation resources for every HUBSS product.
        </p>
      </div>

      {/* ── Document Library — dark grid background ──────── */}
      <section className="bg-grid-dark relative overflow-hidden">
        {/* Orange radial glow — soft, offset to bottom-left */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-100px",
            left: "-80px",
            width: "600px",
            height: "600px",
            background: "radial-gradient(ellipse at center, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.04) 40%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-6 py-16 pb-28 relative">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: "#F97316" }}>
              All Documents
            </h2>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="text-xs" style={{ color: "#9CA3AF" }}>{resourceDocuments.length} total</span>
          </div>
          <ResourcesClient documents={resourceDocuments} />
        </div>
      </section>

      <LunchLearn />
      <Footer />
    </main>
  );
}
