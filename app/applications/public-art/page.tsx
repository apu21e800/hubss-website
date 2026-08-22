import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import JsonLd from "@/components/ui/JsonLd";
import { products } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Public Art — Pavement as Community Expression",
  description:
    "Indigenous art installations, Pride crosswalks, transit station murals, and labyrinth designs — permanent civic art at full street scale, executed in DecoMark preformed thermoplastic and StreetBond coloured coatings.",
  slug: "applications/public-art",
});

const FEATURED_PROJECTS = [
  {
    name: "Joyce-Collingwood SkyTrain Station",
    desc: "Large-scale DecoMark thermoplastic installation at the transit plaza surface, reflecting the cultural composition of East Vancouver. Permanent, full-colour, integrated flush with the pavement.",
  },
  {
    name: "UBC Campus Pathways",
    desc: "Musqueam-designed cultural wayfinding graphics embedded into campus pedestrian routes using DecoMark custom thermoplastic, on the traditional territory of the Musqueam people.",
  },
  {
    name: "Indigenous Art Crosswalks",
    desc: "Custom crosswalk installations featuring Indigenous artwork and cultural motifs. DecoMark preformed thermoplastic provides Pantone-accurate colour and multi-year service life.",
  },
  {
    name: "Pride Crosswalks",
    desc: "Rainbow and progressive Pride crosswalks installed at intersections across Canada. StreetBond and DecoMark hold colour through snowplow cycles and de-icing chemicals.",
  },
  {
    name: "Community Labyrinth Designs",
    desc: "Labyrinth patterns installed in public parks and community spaces using StreetBond coloured coatings on asphalt. Permanent, zero-maintenance, full life of the pavement substrate.",
  },
];

const RELATED_SLUGS = ["decomark", "streetbond", "streetprint"];

const applicationSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Public Art — Pavement Installations",
  description:
    "Permanent pavement art installations including Indigenous art, pride crosswalks, transit murals, and community labyrinth designs using DecoMark and StreetBond systems.",
  provider: { "@type": "Organization", name: "HUB Surface Systems" },
  url: "https://hubss.com/applications/public-art",
};

export default function PublicArtPage() {
  const relatedProducts = RELATED_SLUGS.map((s) =>
    products.find((p) => p.slug === s)
  ).filter(Boolean) as typeof products;

  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <JsonLd data={applicationSchema} />
      <Nav />

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src="/images/applications/community-branding/community-branding-01.jpg"
          alt="Public art pavement installation — DecoMark custom thermoplastic civic mural by HUB Surface Systems"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(26,26,26,0.7)" }}
        />
        <div className="absolute inset-0 flex items-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div>
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
              style={{ color: "#f97316" }}
            >
              HUB Application
            </p>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              The Street as Canvas
            </h1>
            <p
              className="text-lg mt-2 max-w-2xl"
              style={{ color: "var(--text-body)" }}
            >
              Civic art and community identity embedded directly into the pavement surface. Permanent, weather-resistant, and serviceable for the full life of the asphalt substrate.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative" style={{ background: "var(--bg-dark)" }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          {/* CTA bar */}
          <div
            className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
            style={{
              background: "var(--bg-card-neutral)",
              border: "1px solid rgba(249,115,22,0.2)",
            }}
          >
            <div>
              <p
                className="font-semibold text-base"
                style={{ color: "#F5F0EB" }}
              >
                Commission a Custom Design
              </p>
              <p
                className="text-sm mt-0.5"
                style={{ color: "#9CA3AF" }}
              >
                End-to-end project management — design files, fabrication, and certified installation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/resources"
                className="px-4 py-2 rounded-lg text-sm transition-all hover:text-white border border-white/15 hover:border-orange-500/50"
                style={{ color: "#D1D5DB" }}
              >
                Technical Specs
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: "#F97316", color: "#fff" }}
              >
                Start a Project
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left: description + gallery + projects */}
            <div className="lg:col-span-2">
              <h2
                className="text-2xl font-bold mb-5"
                style={{ color: "var(--text-primary)" }}
              >
                Pavement as Public Art
              </h2>
              <p
                className="text-[16px] leading-relaxed mb-12"
                style={{ color: "var(--text-body)" }}
              >
                Indigenous art installations, labyrinth designs, Pride crosswalks, and transit station murals — pavement carries civic art at full street scale. DecoMark custom-graphic preformed thermoplastic provides print-quality images with full Pantone matching. StreetBond covers large-format colour fields and mural backgrounds. Both systems are designed to remain in service for the full life of the asphalt substrate.
              </p>

              {/* Gallery grid */}
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-16">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-lg"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <Image
                      src={`/images/applications/community-branding/community-branding-${String(
                        Math.min(i, 14)
                      ).padStart(2, "0")}.jpg`}
                      alt={`Public art pavement installation — HUB Surface Systems civic mural project ${i}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>

              {/* Featured Projects */}
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                Featured Projects
              </h2>
              <div className="space-y-4">
                {FEATURED_PROJECTS.map((project) => (
                  <div
                    key={project.name}
                    className="p-6 rounded-xl"
                    style={{
                      background: "var(--bg-card-neutral)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <h3
                      className="font-bold text-base mb-2"
                      style={{ color: "#F5F0EB" }}
                    >
                      {project.name}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#9CA3AF" }}
                    >
                      {project.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: related products */}
            <div>
              <div
                className="rounded-xl p-8 mb-8 sticky top-24 relative overflow-hidden"
                style={{
                  background: "var(--bg-card-neutral)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{
                    background:
                      "linear-gradient(90deg, #F97316, #EAB308)",
                  }}
                />
                <h3
                  className="font-bold text-lg mb-6"
                  style={{ color: "#F5F0EB" }}
                >
                  Products Used
                </h3>
                <div className="space-y-3">
                  {relatedProducts.map((product) => (
                    <Link
                      key={product.slug}
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg transition-all group hover:bg-white/5"
                      style={{
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        className="relative overflow-hidden rounded-md flex-shrink-0"
                        style={{ width: 48, height: 48 }}
                      >
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold text-sm truncate"
                          style={{ color: "#F5F0EB" }}
                        >
                          {product.name}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: "#868C98" }}
                        >
                          {product.shortDesc}
                        </p>
                      </div>
                      <svg
                        className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "#f97316" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="block w-full text-center font-semibold py-4 rounded-lg mt-8 transition-all text-sm hover:brightness-110"
                  style={{ background: "#f97316", color: "#fff" }}
                >
                  Commission a Custom Design
                </Link>
                <Link
                  href="/lunch-learn"
                  className="block w-full text-center font-semibold py-4 rounded-lg mt-3 transition-all text-sm hover:border-[#F97316]/50 hover:text-white"
                  style={{
                    background: "transparent",
                    color: "#9CA3AF",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  Book Lunch &amp; Learn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LunchLearn />
      <Footer />
    </main>
  );
}
