import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { ArrowRight } from "lucide-react";
import { resourceDocuments } from "@/lib/resource-documents";
import ResourcesClient from "@/components/resources/ResourcesClient";

export const metadata: Metadata = {
  title: "Specification Library | HUB Surface Systems",
  description:
    "Technical data sheets, spec sheets, brochures, safety guides, and installation resources for every HUBSS decorative pavement product.",
};

const quickLinks = [
  {
    title: "Book a Lunch & Learn",
    description:
      "Free professional development sessions with CPD/PDH credits for engineers and contractors.",
    image: "/images/applications/commercial-spaces/little-italy-aerial-colourful-intersection-01.jpg",
    href: "/lunch-learn",
  },
  {
    title: "Installation & Training",
    description:
      "Step-by-step application guides and video tutorials for certified applicators.",
    image: "/images/applications/airports/runway-marking-installation-crew-01.jpg",
    href: "/resources#documents",
  },
  {
    title: "Technical Specifications",
    description:
      "Complete technical data sheets for every HUBSS product — optimized for Canadian climate conditions.",
    image: "/images/products/premark/premark-arrows-installation-intersection-01.jpg",
    href: "/resources#documents",
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-dark)]">
      <Nav />

      {/* ── Hero ──────────────────────────────────────────── */}
      <header className="relative w-full min-h-[480px] overflow-hidden">
        <Image
          src="/images/applications/bus-bike-lanes/red-bus-lane-long-perspective-01.jpg"
          alt="HUBSS specification library"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/30" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-6 pb-16">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-4 gradient-text">
              Resources
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4">
              Specification Library
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mb-8">
              Technical data sheets, brochures, safety guides, and installation
              resources for every HUBSS product.
            </p>
            <a
              href="#documents"
              className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-lg font-semibold text-sm"
            >
              Browse all documents
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* ── Quick Links Strip ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group block rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--bg-card-hover)] transition-colors duration-300 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.06)]"
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                <Image
                  src={link.image}
                  alt={link.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                />
              </div>
              <div className="p-8">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2 group-hover:text-orange-400 transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  {link.description}
                </p>
                <span className="text-sm font-medium text-orange-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Document Library ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">
            Browse Documents
          </h2>
          <p className="text-gray-300">
            Filter by product, application, or document type to find what you need.
          </p>
        </div>

        <ResourcesClient documents={resourceDocuments} />
      </section>

      <LunchLearn />
      <Footer />
    </main>
  );
}
