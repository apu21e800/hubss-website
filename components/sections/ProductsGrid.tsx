"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";

export default function ProductsGrid() {
  // First 2 products are featured — each spans 2 cols to fill the opening row
  const FEATURED = 2;

  return (
    <section className="py-24" style={{ background: "#1a1a1a" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14">
          <p className="gradient-text text-xs tracking-[0.2em] font-semibold uppercase mb-2">
            Surface Solutions
          </p>
          <h2
            className="font-bold tracking-tight mb-3"
            style={{ color: "#fff", fontSize: "clamp(1.875rem, 4vw, 3rem)" }}
          >
            Our Systems
          </h2>
          <p className="text-lg font-light max-w-xl" style={{ color: "#9ca3af" }}>
            Engineered for Canadian infrastructure. Built to outlast.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={i < FEATURED ? "lg:col-span-2" : ""}
            >
              <Link
                href={`/products/${product.slug}`}
                className="group flex flex-col h-full relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)]"
                style={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#52525b")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#27272a")}
              >
                {/* Card image */}
                <div className="relative w-full overflow-hidden flex-shrink-0" style={{ height: 160 }}>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Bottom gradient so card content reads cleanly */}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(24,24,27,0.7) 0%, transparent 60%)" }}
                  />
                </div>

                {/* Full-width gradient top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }}
                />

                <div className="flex flex-col flex-1 p-6">
                  {/* Product name */}
                  <h3
                    className="text-lg font-semibold mb-1 transition-colors duration-200 group-hover:text-orange-400"
                    style={{ color: "#fff" }}
                  >
                    {product.name}
                  </h3>

                  {/* Short desc — orange hook */}
                  <p className="text-sm font-medium mb-3" style={{ color: "#fb923c" }}>
                    {product.shortDesc}
                  </p>

                  {/* Body copy — 2-line clamp */}
                  <p
                    className="text-sm leading-relaxed mb-auto"
                    style={{
                      color: "#d1d5db",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {product.description}
                  </p>

                  {/* CTA */}
                  <div className="pt-5 mt-auto">
                    <span
                      className="flex items-center gap-1.5 text-xs tracking-widest font-semibold uppercase"
                      style={{ color: "#fb923c" }}
                    >
                      Explore System
                      <span className="transition-transform duration-200 group-hover:translate-x-1 inline-block">
                        →
                      </span>
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
