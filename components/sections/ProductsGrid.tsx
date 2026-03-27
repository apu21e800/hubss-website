"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { productImages, resolveImage } from "@/lib/featured-images";

export default function ProductsGrid() {
  return (
    <section className="py-24" style={{ background: "#1C1F23" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-12">
          <p className="gradient-text text-xs tracking-[0.15em] font-semibold uppercase mb-2">
            Our Systems
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            The Systems Behind Canada&apos;s Most Recognised Surfaces
          </h2>
          <p className="text-base font-light max-w-xl" style={{ color: "var(--text-secondary)" }}>
            From thermoplastic crosswalks to stamped asphalt roundabouts — every product engineered for Canadian conditions.
          </p>
        </div>

        {/* Grid — 2 col mobile → 3 col md → 4 col xl */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={`/products/${product.slug}`}
                className="group flex flex-col h-full relative overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.12)]"
                style={{
                  background: "var(--color-blue-mid)",
                  border: "1px solid var(--border-color)",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-color)")}
              >
                {/* Gradient top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] z-10"
                  style={{ background: "var(--gradient-brand)" }}
                />

                {/* Card image */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={productImages[product.slug] ? resolveImage(productImages[product.slug]).src : product.imageUrl}
                    alt={productImages[product.slug] ? resolveImage(productImages[product.slug]).alt : product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(12,21,32,0.75) 0%, transparent 60%)" }}
                  />
                </div>

                <div className="flex flex-col flex-1 p-4">
                  <h3
                    className="text-sm font-bold mb-1 transition-colors duration-200 group-hover:text-orange-400 leading-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {product.shortDesc}
                  </p>
                  <div className="mt-3">
                    <span
                      className="text-[10px] tracking-widest font-semibold uppercase flex items-center gap-1"
                      style={{ color: "#f97316" }}
                    >
                      Explore
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5 inline-block">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
