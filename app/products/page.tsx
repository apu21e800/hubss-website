import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { products } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Decorative Pavement & Marking Systems",
  description: "Thirteen surface systems for Canadian municipal, commercial, and private use — preformed thermoplastics, MMA resins, stamped asphalt, decorative coatings, and asphalt repair. Technical data, spec sheets, and certified installation.",
  slug: "products",
});

export default function ProductsPage() {
  return (
    <main style={{ background: "#0f1620", minHeight: "100vh" }}>
      <Nav />

      <div
        className="relative"
        style={{ backgroundSize: "cover", backgroundPosition: "center" }}
      >
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div className="mb-16 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#f97316" }}>
            The Full Lineup
          </p>
          <h1
            className="font-black mb-5"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            Surface Systems for the Built Environment.
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Thirteen systems for municipal, commercial, and private use — preformed thermoplastics, MMA resins, stamped asphalt, decorative coatings, and asphalt repair.
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

          const groups: { label: string; desc: string; slugs: string[] }[] = [
            {
              label: "Preformed Thermoplastics",
              desc: "Factory-manufactured and heat-fused directly to asphalt or concrete. Used for regulatory symbols, patterned crosswalks, custom civic graphics, and airfield markings. No stencil prep, no curing window, no annual repainting.",
              slugs: ["traffic-patterns-xd", "traffic-patterns", "premark", "duratherm", "decomark", "airmark"],
            },
            {
              label: "Coatings",
              desc: "Liquid-applied colour systems that bond chemically to asphalt and concrete. Used for lane demarcation, decorative plazas, solar-reflective heat island mitigation, and pavement protection.",
              slugs: ["streetbond", "streetbondsr", "mmax", "durashield"],
            },
            {
              label: "Stamped Asphalt & Concrete",
              desc: "In-place asphalt stamping. Stamps brick, cobblestone, slate, herringbone, fan, or fully custom patterns directly into new or existing asphalt. Flush surface, no raised edges, snowplow-safe.",
              slugs: ["streetprint"],
            },
            {
              label: "Asphalt Repair",
              desc: "Permanent, traffic-ready repair systems for potholes, utility cuts, and edge joints. No heating, no compaction equipment, open to traffic in 30 minutes.",
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
                            style={{ background: "#1a1e28", border: "1px solid rgba(255,255,255,0.07)" }}
                          >
                            <div
                              className="absolute top-0 left-0 right-0 h-[2px] z-10"
                              style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }}
                            />
                            <div className="p-7 flex flex-col flex-grow">
                              <h3 className="font-bold text-xl mb-1.5 transition-colors group-hover:text-[#f97316]" style={{ color: "var(--text-primary)" }}>
                                {product.name}
                              </h3>
                              <p className="text-sm font-medium mb-3" style={{ color: "#fb923c" }}>
                                {product.shortDesc}
                              </p>
                              <p className="text-sm leading-relaxed mb-5 flex-grow" style={{ color: "var(--text-secondary)" }}>
                                {typeof product.description === "string"
                                  ? product.description.slice(0, 120) + (product.description.length > 120 ? "…" : "")
                                  : ""}
                              </p>

                              {/* Application tags */}
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

                              <span className="text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5" style={{ color: "#f97316" }}>
                                Explore System
                                <span className="transition-transform duration-200 group-hover:translate-x-1 inline-block">&rarr;</span>
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
      </div>{/* end asphalt texture wrapper */}
      <LunchLearn />
      <Footer />
    </main>
  );
}
