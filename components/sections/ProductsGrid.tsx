"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products as libProducts, type Product } from "@/lib/products";
import { productImages, resolveImage } from "@/lib/featured-images";

// Plain-English: what it does and who uses it
// Used as the fallback when Sanity has not set `homepageBlurb` on a product.
const PRODUCT_WHAT: Record<string, string> = {
  "streetprint":
    "In-place stamped asphalt — cobblestone, brick, herringbone and a wide variety of other patterns. No demolition, no raised edges, snowplow-safe. Looks like stone, performs like asphalt.",
  "streetbond":
    "Water based, epoxy modified acrylic coatings that transform asphalt and concrete.",
  "traffic-patterns-xd":
    "Aggregate-reinforced, preformed thermoplastic that is purpose engineered for the toughest environments. High performance crosswalks, entrance features and endless other applications.",
  "traffic-patterns":
    "Preformed thermoplastic that is custom fabricated to put your design into a functional surface for use in endless environments. Used all across North America for unique messaging, branding, community expression, schools, etc.",
  "mmax":
    "MMA resin with performance aggregates for use in area markings like bus lanes, bike lanes, and other visual needs in high traffic environments. Fast installation. Full range of colours. Extended season formula for shoulder season applications.",
  "decomark":
    "Preformed thermoplastic that is custom fabricated to put your design into a functional surface for use in endless environments. Used all across North America for unique messaging, branding, community expression, schools, etc.",
};

const PRODUCT_TYPE: Record<string, string> = {
  "streetprint":         "Stamped Asphalt",
  "streetbond":          "Coloured Coating",
  "traffic-patterns-xd": "Thermoplastic XD",
  "traffic-patterns":    "Thermoplastic",
  "mmax":                "MMA Resin",
  "decomark":            "Custom Graphics",
};

const PRODUCT_STAT: Record<string, string> = {
  // Doug: focus on positives, no paint comparisons.
  "streetprint":         "Decades of proven service",
  "streetbond":          "UV-stable · won't peel",
  "traffic-patterns-xd": "Aggregate-reinforced surface",
  "traffic-patterns":    "Durable, retroreflective markings",
  "mmax":                "Traffic-ready in under an hour",
  "decomark":            "Custom Pantone graphics",
};

const PRODUCT_APPS: Record<string, string[]> = {
  "streetprint":         ["Crosswalks", "Driveways", "Plazas", "Intersections"],
  "streetbond":          ["Bike Lanes", "Bus Lanes", "Driveways", "Paths"],
  "traffic-patterns-xd": ["Crosswalks", "BRT Corridors", "Bike Lanes"],
  "traffic-patterns":    ["Crosswalks", "Bike Lanes", "Parking Lots"],
  "mmax":                ["Bus Lanes", "Bike Lanes", "Crosswalks"],
  "decomark":            ["Public Art", "Crosswalks", "Community Branding"],
};

// Per-card object-position overrides for images that need non-center focal points
const PRODUCT_POSITION: Record<string, string> = {
  "decomark": "center bottom",
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

type Props = {
  products?: (Product & { homepageBlurb?: string })[];
};

export default function ProductsGrid({ products: productsProp }: Props = {}) {
  const source = productsProp ?? libProducts;
  const featured = FEATURED_SLUGS.map((slug) =>
    source.find((p) => p.slug === slug)
  ).filter(Boolean) as (Product & { homepageBlurb?: string })[];

  return (
    <section
      id="systems"
      className="py-28 lg:py-32"
      style={{ backgroundColor: "#0f1420" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14 md:mb-16">
          <p className="gradient-text text-xs tracking-[0.15em] font-semibold uppercase mb-3">
            The Systems
          </p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2
                className="font-black mb-3"
                style={{
                  color: "var(--text-primary)",
                  fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  textWrap: "balance",
                }}
              >
                Purpose-Built.<br className="hidden sm:block" /> Performance-Proven.
              </h2>
              <p
                className="text-base font-light max-w-lg leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Six systems that are purpose built for life in Canada. Turning asphalt and
                concrete into your signature surface.
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
            const what = product.homepageBlurb ?? PRODUCT_WHAT[product.slug];

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
                    background: "#1a2235",
                    border: "1px solid rgba(255,255,255,0.11)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
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
                      style={{ objectPosition: PRODUCT_POSITION[product.slug] ?? "center" }}
                    />
                    {/* Bottom gradient — merges image into card body */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 40%, rgba(15,20,32,0.75) 100%)",
                      }}
                    />
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
                      {/* orange type chip removed per Vernon */}
                    </div>

                    {/* Description */}
                    <p
                      className="text-[12.5px] leading-relaxed flex-1 mb-4"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {what}
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
