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
    <main className="min-h-screen" style={{ background: "var(--bg-dark)" }}>
      <Nav />

      {/* ── Page Header ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-10">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 gradient-text">
          Resources
        </p>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Specification Library
        </h1>
        <p className="text-base max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          Technical data sheets, brochures, safety guides, and installation resources for every HUBSS product.
        </p>
      </div>

      {/* ── Document Library ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <ResourcesClient documents={resourceDocuments} />
      </section>

      <LunchLearn />
      <Footer />
    </main>
  );
}
