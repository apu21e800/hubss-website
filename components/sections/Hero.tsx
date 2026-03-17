"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images";

const clients = [
  "York Region", "City of Toronto", "Vancouver", "UBC",
  "London ON", "Kitchener", "Richmond BC", "City of Ottawa",
  "Mississauga", "Brampton", "Surrey BC", "Calgary",
];

const credentialStats = [
  { value: "500+",      label: "Projects Completed" },
  { value: "10",        label: "Provinces Served" },
  { value: "Since 1994", label: "Canadian-Founded" },
  { value: "TAC + FAA", label: "Compliant" },
];

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

  // Subtle parallax — text block floats slightly upward on scroll
  useEffect(() => {
    const onScroll = () => {
      if (textRef.current) {
        textRef.current.style.transform = `translateY(${window.scrollY * 0.1}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="hero-section relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Full-bleed hero image */}
      <Image
        src={placeholderImages.hero.main}
        alt="Aerial view of coloured crosswalk markings"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* Dark overlay — keeps text fully readable regardless of theme */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Animated grain overlay */}
      <div
        className="grain-overlay absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.045,
          mixBlendMode: "overlay",
        }}
      />

      {/* Gradient left-edge accent */}
      <div
        className="absolute left-0 top-1/4 w-0.5 h-48"
        style={{ background: "linear-gradient(180deg, #F97316 0%, #EAB308 100%)" }}
      />

      {/* Main content */}
      <div className="flex-1 flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-10">
        <div ref={textRef} className="max-w-5xl w-full" style={{ willChange: "transform" }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-6"
              style={{ color: "#f97316" }}
            >
              HUB Surface Systems — Canadian Infrastructure Specialists
            </p>

            <h1
              className="font-black leading-none mb-5"
              style={{
                color: "#F5F0EB",
                fontSize: "clamp(3rem, 9vw, 7rem)",
                letterSpacing: "-0.03em",
              }}
            >
              The Street Is Your
              <br />
              <span className="relative inline-block">
                Canvas.
                {/* Gradient underline — draws left-to-right */}
                <motion.span
                  className="absolute left-0 right-0 bottom-1"
                  style={{
                    height: "5px",
                    background: "linear-gradient(90deg, #f97316 0%, #eab308 100%)",
                    originX: 0,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </h1>

            <p
              className="text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed"
              style={{ color: "#E5E7EB" }}
            >
              The infrastructure beneath great cities.
            </p>

            {/* CTAs */}
            <div className="flex flex-row gap-4 mb-12">
              <Link
                href="/lunch-learn"
                className="cta-btn cta-pulse font-semibold px-8 py-4 rounded-full text-center text-sm"
              >
                Book a Lunch &amp; Learn
              </Link>
              <Link
                href="/blog"
                className="font-semibold px-8 py-4 rounded-full text-center transition-all text-sm hover:border-gray-500"
                style={{
                  background: "transparent",
                  color: "#F5F0EB",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                View Projects
              </Link>
            </div>

            {/* Credential stats bar */}
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {credentialStats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-3">
                  {i > 0 && (
                    <span
                      className="hidden sm:block w-px h-6 self-center"
                      style={{ background: "#2a2a2a" }}
                    />
                  )}
                  <div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#f97316" }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-sm ml-1.5"
                      style={{ color: "#d1d5db" }}
                    >
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Client ticker */}
      <div
        className="overflow-hidden py-4"
        style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="ticker-track">
          {[...clients, ...clients].map((client, i) => (
            <span
              key={i}
              className="mx-8 text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#505050", whiteSpace: "nowrap" }}
            >
              {client}
              <span className="ml-8" style={{ color: "#f97316" }}>&#10022;</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
