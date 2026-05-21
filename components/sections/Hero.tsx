"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { heroImages, resolveImage } from "@/lib/featured-images";

const tickerItems = [
  "City of Toronto", "York Region", "City of Vancouver", "UBC",
  "City of Ottawa", "City of Calgary", "City of Brampton", "City of Mississauga",
  "TransLink", "City of Surrey", "City of Edmonton", "City of Winnipeg",
  "City of Burnaby", "Richmond Hill", "Halifax Regional Municipality",
  "City of Kelowna", "Region of Peel", "City of Saskatoon",
];

export default function Hero() {
  const heroImg = resolveImage(heroImages.homepage);

  return (
    <section className="relative flex flex-col overflow-hidden min-h-screen">

      {/* ── Full-bleed background image ──────────────────────── */}
      <div className="absolute inset-0">
        <Image
          src={heroImg.src}
          alt={heroImg.alt}
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "50% 60%" }}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,13,22,0.72) 0%, rgba(8,13,22,0.68) 30%, rgba(8,13,22,0.82) 65%, rgba(8,13,22,0.97) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(95deg, rgba(8,13,22,0.55) 0%, rgba(8,13,22,0.22) 44%, transparent 64%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 0% 0%, rgba(249,115,22,0.14) 0%, transparent 55%)",
          }}
        />
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 w-full pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-3xl"
        >
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color: "#f97316" }}
          >
            Decorative Hardscapes
          </p>

          <h1
            className="font-black mb-6"
            style={{
              fontSize: "clamp(3.4rem, 9.5vw, 7.5rem)",
              lineHeight: 0.93,
              textWrap: "balance",
              letterSpacing: "-0.04em",
            }}
          >
            <span style={{ color: "#fff", textShadow: "0 2px 28px rgba(0,0,0,0.45)" }}>
              The World Is{" "}
            </span>
            <span
              style={{
                background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Your Canvas.
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl leading-relaxed max-w-2xl mb-10 sm:mb-12"
            style={{ color: "rgba(255,255,255,0.78)", textShadow: "0 1px 16px rgba(0,0,0,0.55)", fontWeight: 400 }}
          >
            HUB Surface Systems redefines hardscapes for freeze-thaw climates.
            Stamped asphalt, thermoplastics, and specialty coatings built for
            performance and lasting visual impact — for 30+ years.
          </p>

          {/* ── CTAs ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.55 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm transition-all"
              style={{
                background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                color: "#fff",
                boxShadow: "0 8px 28px rgba(249,115,22,0.42)",
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
              style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.78)" }}
            >
              Book Lunch &amp; Learn
            </a>
          </motion.div>

          {/* ── Trust signals ────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.55 }}
            style={{ marginTop: "2.75rem" }}
          >
            <div
              style={{
                height: 1,
                background: "linear-gradient(90deg, rgba(249,115,22,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)",
                marginBottom: "1.25rem",
                maxWidth: "28rem",
              }}
            />
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {[
                { stat: "30+", label: "Years in Canada" },
                { stat: "1,000+", label: "Projects coast to coast" },
                { stat: "20yr", label: "Proven service life" },
              ].map(({ stat, label }) => (
                <div key={stat} className="flex items-center gap-3">
                  <span
                    style={{
                      fontSize: "1.55rem",
                      fontWeight: 800,
                      color: "#F97316",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {stat}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.52)",
                      fontWeight: 500,
                      lineHeight: 1.25,
                      maxWidth: "6.5rem",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        </div>
      </div>

      {/* ── Client ticker ──────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 border-t"
        style={{ borderColor: "rgba(255,255,255,0.10)" }}
      >
        <div
          className="overflow-hidden py-4"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
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
                style={{ color: "rgba(255,255,255,0.40)", lineHeight: 1 }}
              >
                {item}
                <span
                  aria-hidden="true"
                  style={{
                    display: "block",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "rgba(249,115,22,0.6)",
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
