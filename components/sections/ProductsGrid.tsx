"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { productImages, resolveImage } from "@/lib/featured-images";

const PRODUCT_GROUPS: { label: string; slugs: string[]; sectionImage: string; sectionImageAlt: string }[] = [
  {
    label: "Decorative & Surface Systems",
    slugs: ["streetprint", "streetbond", "traffic-patterns-xd", "traffic-patterns"],
    sectionImage: "/images/applications/crosswalks/crosswalks-01.jpg",
    sectionImageAlt: "StreetPrint stamped asphalt decorative crosswalk — Canadian municipality installation",
  },
  {
    label: "Mobility & Community Identity",
    slugs: ["mmax", "decomark"],
    sectionImage: "/images/applications/bus-lanes/bus-lanes-01.jpg",
    sectionImageAlt: "MMAX red bus rapid transit lane surface — Canadian municipality",
  },
];

// One-word product type tags for quick scanning
const PRODUCT_TYPE: Record<string, string> = {
  "streetprint":         "Stamped Asphalt",
  "streetbond":          "Colour Coating",
  "traffic-patterns-xd": "Thermoplastic XD",
  "traffic-patterns":    "Thermoplastic",
  "mmax":                "MMA Resin",
  "decomark":            "Custom Graphics",
};

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
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Purpose-Built. Canadian-Proven.
          </h2>
          <p
            className="text-base font-light max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            Stamped asphalt, thermoplastic markings, and coloured pavement coatings — engineered to survive snowplows, de-icing chemicals, and thirty years of freeze-thaw.
          </p>
        </div>

        {/* Grouped product categories */}
        <div className="space-y-20">
          {PRODUCT_GROUPS.map((group) => {
            const groupProducts = group.slugs
              .map((slug) => products.find((p) => p.slug === slug))
              .filter(Boolean) as typeof products;

            return (
              <div key={group.label}>

                {/* Group header: label + section photo side by side */}
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-px flex-shrink-0 w-8" style={{ background: "#f97316" }} />
                  <span
                    className="text-xs font-bold tracking-[0.18em] uppercase whitespace-nowrap"
                    style={{ color: "rgba(249,115,22,0.7)" }}
                  >
                    {group.label}
                  </span>
                  <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>

                {/* Product cards — compact, text-primary */}
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${
                    groupProducts.length === 4 ? "lg:grid-cols-4" :
                    groupProducts.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
                  }`}
                >
                  {groupProducts.map((product, i) => {
                    const imgSrc = productImages[product.slug]
                      ? resolveImage(productImages[product.slug]).src
                      : product.imageUrl;
                    const imgAlt = productImages[product.slug]
                      ? resolveImage(productImages[product.slug]).alt
                      : product.name;

                    return (
                      <motion.div
                        key={product.slug}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          className="group flex flex-col h-full relative overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.12)]"
                          style={{
                            background: "rgba(255,255,255,0.035)",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "rgba(249,115,22,0.35)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.055)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.035)";
                          }}
                        >
                          {/* Thin orange top bar — always visible */}
                          <div
                            className="absolute top-0 left-0 right-0 h-[2px]"
                            style={{ background: "linear-gradient(90deg, #f97316 0%, rgba(249,115,22,0.3) 100%)" }}
                          />

                          {/* Narrow landscape image — 3:1 ratio, stays small */}
                          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3/1" }}>
                            <Image
                              src={imgSrc}
                              alt={imgAlt}
                              fill
                              loading="eager"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                            <div
                              className="absolute inset-0"
                              style={{
                                background: "linear-gradient(to top, rgba(15,20,32,0.7) 0%, rgba(15,20,32,0.1) 60%, transparent 100%)",
                              }}
                            />
                          </div>

                          {/* Card body — text is the hero */}
                          <div className="flex flex-col flex-1 p-5 pt-4">
                            {/* Type badge */}
                            <span
                              className="inline-block self-start text-[10px] font-bold tracking-[0.12em] uppercase mb-2 px-2 py-0.5 rounded"
                              style={{ background: "rgba(249,115,22,0.1)", color: "rgba(249,115,22,0.8)" }}
                            >
                              {PRODUCT_TYPE[product.slug] ?? "System"}
                            </span>

                            {/* Product name */}
                            <h3
                              className="font-bold text-base leading-tight mb-2 transition-colors duration-200 group-hover:text-orange-400"
                              style={{ color: "#F5F0EB" }}
                            >
                              {product.name}
                            </h3>

                            {/* Short description */}
                            <p
                              className="text-[13px] leading-relaxed flex-1"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {product.shortDesc}
                            </p>

                            {/* CTA row */}
                            <div className="mt-4 flex items-center gap-1.5">
                              <span
                                className="text-xs font-semibold tracking-wide flex items-center gap-1 transition-colors duration-200 group-hover:text-orange-300"
                                style={{ color: "#f97316" }}
                              >
                                View specs
                                <svg
                                  className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </span>
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

        {/* Bottom CTA */}
        <div className="mt-16 flex justify-center">
          <div className="flex flex-col items-center gap-3">
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
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
              Including PreMark, DuraShield, DuraTherm, and AirMark
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
