"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { productImages, resolveImage } from "@/lib/featured-images";

export default function ProductsGrid() {
  return (
    <section className="py-28 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-16">
          <p className="gradient-text text-xs tracking-[0.15em] font-semibold uppercase mb-2">
            Our Systems
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 text-zinc-900"
          >
            The Systems Behind Canada&apos;s Most Recognised Surfaces
          </h2>
          <p className="text-lg font-light max-w-xl text-zinc-600">
            From thermoplastic crosswalks to stamped asphalt roundabouts — every product engineered for Canadian conditions.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                className="group flex flex-col h-full relative overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
              >
                {/* Card image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={productImages[product.slug] ? resolveImage(productImages[product.slug]).src : product.imageUrl}
                    alt={productImages[product.slug] ? resolveImage(productImages[product.slug]).alt : product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(17,17,17,0.7) 0%, transparent 60%)" }}
                  />
                </div>

                {/* Full-width gradient top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: "linear-gradient(90deg, #F97316, #EAB308)" }}
                />

                <div className="flex flex-col flex-1 p-4 sm:p-6">
                  <h3
                    className="text-lg font-semibold mb-1 transition-colors duration-200 group-hover:text-orange-500 text-zinc-900"
                  >
                    {product.name}
                  </h3>

                  {/* Short desc — product tagline */}
                  <p className="text-sm font-medium mb-3" style={{ color: "#f97316" }}>
                    {product.shortDesc}
                  </p>

                  {/* Body copy */}
                  <p
                    className="text-sm leading-relaxed mb-auto text-zinc-600"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {product.description}
                  </p>

                  <div className="pt-5 mt-auto">
                    <span
                      className="flex items-center gap-1.5 text-xs tracking-widest font-semibold uppercase"
                      style={{ color: "#f97316" }}
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
