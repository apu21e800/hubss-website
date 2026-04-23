import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { products } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Decorative Pavement & Marking Systems",
  description: "Ten purpose-built surface systems — thermoplastics, MMA resins, stamped asphalt, and protective coatings engineered for Canadian climate. Spec sheets, technical data, and installation support.",
  slug: "products",
});

export default function ProductsPage() {
  return (
    <main style={{ background: "#0f1620", minHeight: "100vh" }}>
      <Nav />

      <div className="relative">
        {/* Stamped asphalt texture — atmospheric depth */}
        <Image
          src="/images/textures/stamped-asphalt-texture.webp"
          alt=""
          fill
          className="object-cover pointer-events-none"
          style={{ opacity: 0.10, mixBlendMode: "overlay" }}
          aria-hidden="true"
          sizes="100vw"
        />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="mb-16 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#f97316" }}>
            Our Systems
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight" style={{ color: "var(--text-primary)" }}>
            Surface Systems for the Built Environment
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Ten product systems, one mission: give every Canadian surface the capacity to carry meaning.
          </p>
        </div>

        {/* ── Product groups ──────────────────────────────── */}
        {(() => {
          // Application slug → readable label
          const APP_LABELS: Record<string, string> = {
            "crosswalks":          "Crosswalks",
            "bike-lanes":          "Bike Lanes",
            "bus-lanes":           "Bus Lanes",
            "parking-lots":        "Parking Lots",
            "private-driveways":   "Driveways",
            "parks-paths":         "Parks & Paths",
            "community-branding":  "Community Branding",
            "regulatory-markings": "Regulatory",
            "playgrounds":         "Playgrounds",
            "traffic-calming":     "Traffic Calming",
          };

          // Groups organised by TECHNOLOGY — not use-case.
          // This prevents false pigeonholing (TP/TPXD aren't "only functional",
          // StreetBond isn't "only decorative"). Application tags on each card
          // communicate the full range per product.
          const groups: { label: string; desc: string; slugs: string[] }[] = [
            {
              label: "Preformed Thermoplastic Systems",
              desc: "Factory-manufactured and heat-fused directly to the surface. One technology — regulatory symbols, patterned crosswalks, custom civic art, airfield markings, and everything in between.",
              slugs: ["traffic-patterns-xd", "traffic-patterns", "premark", "duratherm", "decomark", "airmark"],
            },
            {
              label: "Coloured Pavement Coatings",
              desc: "Liquid-applied colour systems that bond chemically to asphalt and concrete. Safety lane demarcation, civic plazas, stamped driveways, and LEED-compliant solar-reflective surfaces — wherever colour is doing structural work.",
              slugs: ["streetbond", "streetbondsr", "mmax"],
            },
            {
              label: "Surface Transformation Systems",
              desc: "Process-based systems that change the surface itself — stamped pattern and texture into existing asphalt, or penetrating treatments that extend pavement life by years.",
              slugs: ["streetprint", "durashield"],
            },
            {
              label: "Pavement Repair",
              desc: "Cold-patch and repair compounds for fast, permanent pothole and surface repair. No special equipment, no minimum temperature — ready to carry traffic immediately.",
              slugs: ["fast-patch", "aquaphalt"],
            },
          ];

          return (
            <div className="space-y-16">
              {groups.map((group) => {
                const groupProducts = group.slugs
                  .map((slug) => products.find((p) => p.slug === slug))
                  .filter(Boolean) as typeof products;
                return (
                  <div key={group.label}>
                    {/* Group header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase whitespace-nowrap" style={{ color: "#F97316" }}>
                          {group.label}
                        </h2>
                        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                      </div>
                      <p className="text-sm max-w-2xl" style={{ color: "#9CA3AF" }}>{group.desc}</p>
                    </div>

                    {/* Product cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {groupProducts.map((product) => {
                        const appTags = (product.relatedApplications ?? []).slice(0, 3);
                        const overflow = (product.relatedApplications ?? []).length - appTags.length;
                        return (
                          <Link
                            key={product.slug}
                            href={`/products/${product.slug}`}
                            className="group h-full flex flex-col relative overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)]"
                            style={{ background: "#1a1e28", border: "1px solid rgba(255,255,255,0.07)", opacity: product.comingSoon ? 0.75 : 1 }}
                          >
                            <div
                              className="absolute top-0 left-0 right-0 h-[2px] z-10"
                              style={{ background: product.comingSoon ? "rgba(255,255,255,0.15)" : "linear-gradient(90deg, #F97316, #EAB308)" }}
                            />
                            {product.comingSoon && (
                              <div className="absolute top-4 right-4 z-10">
                                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded" style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)" }}>
                                  Coming Soon
                                </span>
                              </div>
                            )}
                            <div className="p-7 flex flex-col flex-grow">
                              <h3 className="font-bold text-xl mb-1.5 transition-colors group-hover:text-[#f97316]" style={{ color: product.comingSoon ? "var(--text-secondary)" : "var(--text-primary)" }}>
                                {product.name}
                              </h3>
                              <p className="text-sm font-medium mb-3" style={{ color: product.comingSoon ? "var(--text-muted)" : "#fb923c" }}>
                                {product.shortDesc}
                              </p>
                              <p className="text-sm leading-relaxed mb-5 flex-grow" style={{ color: "var(--text-secondary)" }}>
                                {typeof product.description === "string"
                                  ? product.description.slice(0, 120) + (product.description.length > 120 ? "…" : "")
                                  : ""}
                              </p>

                              {/* Application tags — shows where this product actually goes */}
                              {appTags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-5">
                                  {appTags.map((slug) => (
                                    <span
                                      key={slug}
                                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                      style={{
                                        background: "rgba(255,255,255,0.06)",
                                        color: "#9CA3AF",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                      }}
                                    >
                                      {APP_LABELS[slug] ?? slug}
                                    </span>
                                  ))}
                                  {overflow > 0 && (
                                    <span
                                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                                      style={{
                                        background: "rgba(249,115,22,0.08)",
                                        color: "rgba(249,115,22,0.7)",
                                        border: "1px solid rgba(249,115,22,0.15)",
                                      }}
                                    >
                                      +{overflow} more
                                    </span>
                                  )}
                                </div>
                              )}

                              <span className="text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5" style={{ color: product.comingSoon ? "var(--text-muted)" : "#f97316" }}>
                                {product.comingSoon ? "Learn More" : "Explore System"}
                                <span className="transition-transform duration-200 group-hover:translate-x-1 inline-block">→</span>
                              </span