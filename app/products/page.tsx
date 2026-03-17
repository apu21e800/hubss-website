import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products | HUB Surface Systems",
  description: "Ten purpose-built surface treatment systems — thermoplastics, MMA resins, stamped asphalt, and protective coatings for Canadian municipalities and contractors.",
};

export default function ProductsPage() {
  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="mb-16 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#f97316" }}>
            Our Systems
          </p>
          <h1 className="text-6xl font-bold mb-5 leading-tight" style={{ color: "var(--text-primary)" }}>
            Built to Perform.
            <br />
            Designed to Last.
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Eight purpose-built surface treatment systems — each engineered for a specific
            performance requirement, climate condition, and application context.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group flex flex-col relative overflow-hidden rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)]"
              style={{ background: "var(--bg-card-surface)", border: "1px solid var(--border-subtle)" }}
            >
              {/* Orange top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] z-10"
                style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }}
              />
              <div className="p-7">
                <h2 className="font-bold text-xl mb-2 transition-colors group-hover:text-[#f97316]" style={{ color: "var(--text-primary)" }}>
                  {product.name}
                </h2>
                <p className="text-sm font-medium mb-3" style={{ color: "#fb923c" }}>
                  {product.shortDesc}
                </p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                  {typeof product.description === "string"
                    ? product.description.slice(0, 120) + (product.description.length > 120 ? "…" : "")
                    : ""}
                </p>
                <span className="text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5" style={{ color: "#f97316" }}>
                  Explore System
                  <span className="transition-transform duration-200 group-hover:translate-x-1 inline-block">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <LunchLearn />
      <Footer />
    </main>
  );
}
