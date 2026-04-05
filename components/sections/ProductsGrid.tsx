"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { productImages, resolveImage } from "@/lib/featured-images";

const PRODUCT_GROUPS: { label: string; slugs: string[] }[] = [
  {
    label: "Decorative & Surface Systems",
    slugs: ["streetprint", "streetbond", "traffic-patterns-xd", "traffic-patterns"],
  },
  {
    label: "Mobility & Community Identity",
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
        <div className="space-y-16">
          {PRODUCT_GROUPS.map((group) => {
            const groupProducts = group.slugs
              .map((slug) => products.find((p) => p.slug === slug))
              .filter(Boolean) as typeof products;

            return (
              <div key={group.label}>
                {/* Group label row */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-shrink-0 w-8" style={{ background: "#f97316" }} />
                  <span
                    className="text-xs font-bold tracking-[0.18em] uppercase whitespace-nowrap"
                    style={{ color: "rgba(249,115,22,0.7)" }}
                  >
                    {group.label}
                  </span>
                  <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>

                {/* Cards — 1 col mobile, 2 col sm, up to 5 col lg for large groups */}
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${
                    groupProducts.length >= 5
                      ? "lg:grid-cols-5"
                      : groupProducts.length === 4
                      ? "lg:grid-cols-4"
                      : groupProducts.length === 3
                      ? "lg:grid-cols-3"
                      : "lg:grid-cols-2"
                  }`}
                >
                  {groupProducts.map((product, i) => (
                    <motion.div
                      key={product.slug}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        className="group flex flex-col h-full relative overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(249,115,22,0.14)]"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.09)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                      >
                        {/* Gradient top accent */}
                        <div
                          className="absolute top-0 left-0 right-0 h-[2px] z-10"
                          style={{ background: "var(--gradient-brand)" }}
                        />

                        {/* Card image — 4:3 aspect, impactful */}
                        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
                          <Image
                            src={
                              productImages[product.slug]
                                ? resolveImage(productImages[product.slug]).src
                                : product.imageUrl
                            }
                            alt={
                              productImages[product.slug]
                                ? resolveImage(productImages[product.slug]).alt
                                : product.name
                            }
                            fill
                            loading="eager"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(to top, rgba(12,21,32,0.82) 0%, rgba(12,21,32,0.2) 50%, transparent 100%)",
                            }}
                          />
                          {/* Product name overlaid on image */}
                          <div className="absolute bottom-0 inset-x-0 p-4 z-10">
                            <h3
                              className="text-base font-bold leading-tight transition-colors duration-200 group-hover:text-orange-400"
                              style={{ color: "#F5F0EB" }}
                            >
                              {product.name}
                            </h3>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="flex flex-col flex-1 p-5">
                          <p
                            className="text-sm leading-relaxed flex-1"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {product.shortDesc}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <span
                              className="text-xs tracking-widest font-bold uppercase flex items-center gap-1.5 transition-colors duration-200 group-hover:text-orange-300"
                              style={{ color: "#f97316" }}
                            >
                              Explore
                              <svg
                                className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1"
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
                  ))}
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
