"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { heroImages, resolveImage } from "@/lib/featured-images";

const credentialStats = [
  { value: "30+", label: "Years", sub: "of proven performance" },
  { value: "500+", label: "Municipalities", sub: "coast to coast" },
  { value: "1,000+", label: "Projects", sub: "transformed" },
  { value: "20yr", label: "Durability", sub: "colour retention documented" },
];

const tickerItems = [
  "City of Toronto", "York Region", "Vancouver", "UBC",
  "City of Ottawa", "City of Calgary", "Brampton", "Mississauga",
  "TransLink", "City of Surrey", "City of Edmonton", "Winnipeg",
  "City of Burnaby", "Richmond Hill", "Vision Zero", "Complete Streets",
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const yTransform = useTransform(scrollY, [0, 300], [0, 100]);

  const heroImg = resolveImage(heroImages.homepage);

  return (
    <section ref={containerRef} className="relative overflow-hidden">
      {/* Background gradient decorations */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, transparent 50%)",
        }}
      />

      {/* Hero content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28">
        {/* Main heading section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-8 sm:mb-12"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
            Decorative Hardscapes
          </p>
          <h1
            className="font-black leading-tight mb-6"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 3.75rem)",
              background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textWrap: "balance",
            }}
          >
            Colour that lasts. Streets that stand out.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: "#9CA3AF" }}>
            HUB Surface Systems redefines hardscapes for freeze-thaw climates. Stamped asphalt, thermoplastics, and specialty coatings built to outlast paint and outperform expectations.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mb-16 sm:mb-20"
        >
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm transition-all"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
              color: "#fff",
              boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
            }}
          >
            Request Spec Sheet
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="/lunch-learn"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm border transition-all hover:border-orange-500/50 hover:text-orange-400"
            style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
          >
            Book Lunch &amp; Learn
          </a>
        </motion.div>
      </div>

      {/* Hero image section */}
      <motion.div
        style={{ y: yTransform }}
        className="relative z-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
      >
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            aspectRatio: "16/9",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <Image
            src={heroImg.src}
            alt={heroImg.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </motion.div>

      {/* Credential stats grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {credentialStats.map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="rounded-xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <p className="text-2xl sm:text-3xl font-black mb-1" style={{ color: "#f97316" }}>
                {stat.value}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#F5F0EB" }}>
                {stat.label}
              </p>
              <p className="text-[11px]" style={{ color: "#9CA3AF" }}>
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ticker section */}
      <div className="relative z-0 border-y" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div
          className="overflow-hidden py-4"
          style={{
            maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: [0, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span
                key={i}
                className="text-sm font-medium flex items-center gap-3"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {item}
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "rgba(249,115,22,0.5)",
                    flexShrink: 0,
                  }}
                />
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
