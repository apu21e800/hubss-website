"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { productImages, resolveImage } from "@/lib/featured-images";

// Plain-English description of what each product actually does
const PRODUCT_WHAT: Record<string, string> = {
  "streetprint":          "Stamps existing asphalt into decorative patterns — cobblestone, brick, herringbone, and more. Used on 500+ Canadian streets.",
  "streetbond":           "Bonds vivid colour directly to asphalt or concrete. 20-year colour retention warranty. Full Pantone custom matching.",
  "traffic-patterns-xd":  "Aggregate-reinforced thermoplastic built for high-volume intersections and BRT corridors. BPN 65+ skid resistance.",
  "traffic-patterns":     "Crisp preformed thermoplastic markings trusted by York Region, City of Toronto, Vancouver, and UBC.",
  "mmax":                 "MMA resin for coloured bus and bike lanes. Cures in under 60 minutes — applied down to −10°C.",
  "decomark":             "Custom civic murals, Pride crosswalks, and Indigenous art rendered in durable preformed thermoplastic.",
};

const PRODUCT_TYPE: Record<string, string> = {
  "streetprint":          "Stamped Asphalt",
  "streetbond":           "Colour Coating",
  "traffic-patterns-xd":  "Thermoplastic XD",
  "traffic-patterns":     "Thermoplastic",
  "mmax":                 "MMA Resin",
  "decomark":             "Custom Graphics",
};

const PRODUCT_STAT: Record<string, string> = {
  "streetprint":          "20-yr warranty",
  "streetbond":           "20-yr warranty",
  "traffic-patterns-xd":  "7+ yr service life",
  "traffic-patterns":     "5–7 yr service life",
  "mmax":                 "Cures in 60 min",
  "decomark":             "Full Pantone match",
};

// Where each product is typically installed
const PRODUCT_APPS: Record<string, string[]> = {
  "streetprint":          ["Crosswalks", "Driveways", "Plazas", "Intersections"],
  "streetbond":           ["Bike Lanes", "Bus Lanes", "Driveways", "Paths"],
  "traffic-patterns-xd":  ["Crosswalks", "BRT Corridors", "Bike Lanes"],
  "traffic-patterns":     ["Crosswalks", "Bike Lanes", "Parking Lots"],
  "mmax":                 ["Bus Lanes", "Bike Lanes", "Crosswalks"],
  "decomark":             ["Public Art", "Crosswalks", "Community Branding"],
};

const PRODUCT_GROUPS: { label: string; slugs: string[] }[] = [
  {
    label: "Decorative Asphalt Systems",
    slugs: ["streetprint", "streetbond", "traffic-patterns-xd", "traffic-patterns"],
  },
  {
    label: "Transit Safety & Community Graphics",
    slugs: ["mmax", "decomark"],
  },
];

export default function ProductsGrid() {
  return (
    <section
      className="py-28 lg:py-32"
      style={{
        backgroundColor: "#0f1420",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
        `,
        backgroundSize: "44px 44px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <p className="gradient-text text-xs tracking-[0.15em] font-semibold uppercase mb-2">
            Surface Systems
          </p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Purpose-Built. Canadian-Proven.
              </h2>
              <p className="text-base font-light max-w-xl" style={{ color: "var(--text-secondary)" }}>
                Six surface systems engineered for Canadian infrastructure — decorative crosswalks,
                bus rapid transit corridors, and everything in between.
              </p>
            </div>
            <Link
              href="/products"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-150 hover:border-orange-500/50 hover:text-white"
              style={{ color: "var(--text-secondary)", borderColor: "rgba(255,255,255,0.12)" }}
            >
              All systems
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Product groups */}
        <div className="space-y-16">
          {PRODUCT_GROUPS.map((group) => {
            const groupProducts = group.slugs
              .map((slug) => products.find((p) => p.slug === slug))
              .filter(Boolean) as typeof products;

            return (
              <div key={group.label}>

                {/* Group label */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-6 flex-shrink-0" style={{ background: "#f97316" }} />
                  <span
                    className="text-[11px] font-bold tracking-[0.18em] uppercase whitespace-nowrap"
                    style={{ color: "rgba(249,115,22,0.65)" }}
                  >
                    {group.label}
                  </span>
                  <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>

                {/* Cards — 2-col on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groupProducts.map((product, i) => {
                    const imgSrc = productImages[product.slug]
                      ? resolveImage(productImages[product.slug]).src
                      : product.imageUrl;
                    const imgAlt = productImages[product.slug]
                      ? resolveImage(productImages[product.slug]).alt
                      : product.name;
                    const apps = PRODUCT_APPS[product.slug] ?? [];
                    const stat = PRODUCT_STAT[product.slug];
                    const what = PRODUCT_WHAT[product.slug];
                    const type = PRODUCT_TYPE[product.slug];

                    return (
                      <motion.div
                        key={product.slug}
                        initial={{ y: 12 }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          className="group flex h-full overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.12)]"
                          style={{
                            background: "rgba(255,255,255,0.035)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            minHeight: "130px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.035)";
                          }}
                        >
                          {/* Thin orange top bar */}
                          <div
                            className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
                            style={{ background: "linear-gradient(90deg, #f97316 0%, rgba(249,115,22,0.2) 100%)" }}
                          />

                          {/* Image column — fixed width, full card height */}
                          <div className="relative flex-shrink-0 self-stretch overflow-hidden" style={{ width: "160px" }}>
                            <Image
                              src={imgSrc}
                              alt={imgAlt}
                              fill
                              loading="eager"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                              sizes="160px"
                            />
                            {/* Right-edge fade into card */}
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background: "linear-gradient(to right, transparent 50%, rgba(15,20,32,0.5) 100%)",
                              }}
                            />
                          </div>

                          {/* Content column */}
                          <div className="flex flex-col flex-1 p-5 min-w-0">

                            {/* Type badge + stat */}
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <span
                                className="text-[10px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded"
                                style={{ background: "rgba(249,115,22,0.1)", color: "rgba(249,115,22,0.85)" }}
                              >
                                {type}
                              </span>
                              {stat && (
                                <span
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded"
                                  style={{
                                    background: "rgba(255,255,255,0.05)",
                                    color: "rgba(255,255,255,0.38)",
                                  }}
                                >
                                  {stat}
                                </span>
                              )}
                            </div>

                            {/* Product name */}
                            <h3
                              className="font-bold text-[15px] leading-tight mb-2 transition-colors duration-200 group-hover:text-orange-400"
                              style={{ color: "#F5F0EB" }}
                            >
                              {product.name}
                            </h3>

                            {/* Plain-English what */}
                            <p
                              className="text-[12px] leading-relaxed flex-1 mb-3"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {what ?? product.shortDesc}
                            </p>

                            {/* Application chips */}
                            <div className="flex flex-wrap gap-1.5">
                              {apps.map((app) => (
                                <span
                                  key={app}
                                  className="text-[9px] font-semibold px-2 py-0.5 rounded-full tracking-wide"
                                  style={{
                                    background: "rgba(255,255,255,0.06)",
                                    color: "rgba(255,255,255,0.32)",
                                  }}
                                >
                                  {app}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note + CTA */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-150 border hover:border-orange-500/50 hover:text-white"
            style={{ color: "var(--text-secondary)", borderColor: "rgba(255,255,255,0.12)" }}
          >
            View all systems
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Including PreMark, DuraShield, DuraTherm, and AirMark
          </p>
        </div>

      </div>
    </section>
  );
}
