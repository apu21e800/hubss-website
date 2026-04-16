"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { productImages, resolveImage } from "@/lib/featured-images";

const PRODUCT_TYPE: Record<string, string> = {
  "streetprint":         "Stamped Asphalt",
  "streetbond":          "Acrylic Colour Coat",
  "traffic-patterns-xd": "Thermoplastic XD",
  "traffic-patterns":    "Thermoplastic",
  "mmax":                "MMA Resin",
  "decomark":            "Custom Graphics",
};

const PRODUCT_STAT: Record<string, string> = {
  "streetprint":         "20-yr warranty",
  "streetbond":          "20-yr warranty",
  "traffic-patterns-xd": "7+ yr service life",
  "traffic-patterns":    "5–7 yr service life",
  "mmax":                "60-min cure",
  "decomark":            "Full Pantone match",
};

const PRODUCT_APPS: Record<string, string[]> = {
  "streetprint":         ["Crosswalks", "Driveways", "Plazas", "Intersections"],
  "streetbond":          ["Bike Lanes", "Bus Lanes", "Driveways", "Paths"],
  "traffic-patterns-xd": ["Crosswalks", "BRT Corridors", "Bike Lanes"],
  "traffic-patterns":    ["Crosswalks", "Bike Lanes", "Parking Lots"],
  "mmax":                ["Bus Lanes", "Bike Lanes", "Crosswalks"],
  "decomark":            ["Public Art", "Crosswalks", "Community Branding"],
};

// Core products shown on homepage — one unified showcase
const FEATURED_SLUGS = [
  "streetprint",
  "streetbond",
  "traffic-patterns-xd",
  "traffic-patterns",
  "mmax",
  "decomark",
];

export default function ProductsGrid() {
  const featured = FEATURED_SLUGS.map((slug) =>
    products.find((p) => p.slug === slug)
  ).filter(Boolean) as typeof products;

  return (
    <section
      className="py-28 lg:py-32"
      style={{
        backgroundColor: "#0f1420",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "44px 44px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14 md:mb-16">
          <p className="gradient-text text-xs tracking-[0.15em] font-semibold uppercase mb-3">
            Surface Systems
          </p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Purpose-Built. Canadian-Proven.
              </h2>
              <p
                className="text-base font-light max-w-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Six systems engineered for Canadian winters, municipalities, and
                the projects that define a city.
              </p>
            </div>
            <Link
              href="/products"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 hover:text-white hover:border-orange-500/50"
              style={{ color: "var(--text-secondary)", borderColor: "rgba(255,255,255,0.12)" }}
            >
              All systems
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Product grid — 1 col → 2 col → 3 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((product, i) => {
            const imgSrc = productImages[product.slug]
              ? resolveImage(productImages[product.slug]).src
              : product.imageUrl;
            const imgAlt = productImages[product.slug]
              ? resolveImage(productImages[product.slug]).alt
              : product.name;
            const apps = PRODUCT_APPS[product.slug] ?? [];
            const type = PRODUCT_TYPE[product.slug];
            const stat = PRODUCT_STAT[product.slug];

            return (
              <motion.div
                key={product.slug}
                initial={{ y: 16 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="h-full"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="group relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-250"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(249,115,22,0.2) inset";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Image — aspect 3:2, top of card */}
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3/2" }}>
                    <Image
                      src={imgSrc}
                      alt={imgAlt}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Bottom gradient — merges image into card body */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 40%, rgba(15,20,32,0.75) 100%)",
                      }}
                    />
                    {/* Type badge — floats over image bottom-left */}
                    <div className="absolute bottom-3 left-3">
                      <span
                        className="inline-block text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-md"
                        style={{
                          background: "rgba(249,115,22,0.18)",
                          color: "rgba(249,115,22,0.95)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid rgba(249,115,22,0.25)",
                        }}
                      >
                        {type}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-5">

                    {/* Product name + stat */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3
                        className="font-bold text-[16px] leading-snug transition-colors duration-200 group-hover:text-orange-400"
                        style={{ color: "#F5F0EB" }}
                      >
                        {product.name}
                      </h3>
                      {stat && (
                        <span
                          className="flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-lg mt-0.5"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.4)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {stat}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p
                      className="text-[12.5px] leading-relaxed flex-1 mb-4"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {product.shortDesc}
                    </p>

                    {/* Application chips + arrow */}
                    <div className="flex items-end justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {apps.slice(0, 3).map((app) => (
                          <span
                            key={app}
                            className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full tracking-wide"
                            style={{
                              background: "rgba(255,255,255,0.07)",
                              color: "rgba(255,255,255,0.35)",
                            }}
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                      <span
                        className="flex-shrink-0 text-[11px] font-semibold transition-all duration-200 group-hover:translate-x-1"
                        style={{ color: "rgba(249,115,22,0.6)" }}
                      >
                        Specs →
                      </span>
                    </div>

                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                      background:
                        "linear-gradient(90deg, #f97316 0%, rgba(249,115,22,0.4) 60%, transparent 100%)",
                    }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer row */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] order-2 sm:order-1" style={{ color: "rgba(255,255,255,0.22)" }}>
            Also available: PreMark · DuraShield · DuraTherm · AirMark
          </p>
          <Link
            href="/products"
            className="order-1 sm:order-2 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border transition-all duration-200 hover:text-white hover:border-orange-500/50"
            style={{ color: "var(--text-secondary)", borderColor: "rgba(255,255,255,0.12)" }}
          >
            View all systems
          </Link>
        </div>
      </div>
    </section>
  );
}
