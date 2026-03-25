"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { heroImages, resolveImage } from "@/lib/featured-images";
import { TypewriterHeading } from "@/components/ui/TypewriterHeading";

export type HeroVariant = 'default' | 'split' | 'cinematic';

interface HeroProps {
  variant?: HeroVariant;
}

const credentialStats = [
  { value: "500+", label: "Projects Completed" },
  { value: "10", label: "Provinces Served" },
  { value: "Since 1994", label: "Canadian-Founded" },
  { value: "20 Year", label: "Durability" },
];

export default function Hero({ variant = "default" }: HeroProps) {
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

  // All variants use the same left-aligned layout for consistency
  return (
    <section
      className="hero-section relative z-10 min-h-screen flex flex-col pb-20"
      style={{ background: "#1A1A1A" }}
    >
      {/* Full-bleed hero image */}
      <Image
        src={resolveImage(heroImages.homepage).src}
        alt={resolveImage(heroImages.homepage).alt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* Dark overlay — keeps text fully readable */}
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />

      {/* Gradient left-edge accent */}
      <div
        className="absolute left-0 top-1/4 w-1 h-48 z-10"
        style={{ background: "linear-gradient(180deg, #F97316 0%, #EAB308 100%)" }}
      />

      {/* Main content — left-aligned */}
      <div className="flex-1 flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-10 relative z-10">
        <div ref={textRef} className="max-w-4xl w-full text-left" style={{ willChange: "transform" }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-left items-start"
          >
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-6"
              style={{ color: "#f97316" }}
            >
              30 Years · 500+ Projects · Coast to Coast
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6 min-h-[2.5em] md:min-h-[2em]">
              <TypewriterHeading />
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
              Trusted by municipalities, landscape architects, and engineers from coast to coast. Surface systems that protect, define, and endure.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/products"
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-lg transition-colors text-center sm:text-left w-full sm:w-auto min-h-[44px]"
              >
                Explore Systems
              </Link>
              <Link
                href="/lunch-learn"
                className="border border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-lg transition-colors text-center sm:text-left w-full sm:w-auto min-h-[44px]"
              >
                Book a Lunch &amp; Learn
              </Link>
            </div>

            {/* Stats bar — inline with content, no overlap */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {credentialStats.map((stat) => (
                <div key={stat.label}>
                  <span className="text-sm font-bold" style={{ color: "#f97316" }}>
                    {stat.value}
                  </span>
                  <span className="text-sm ml-1.5" style={{ color: "#d1d5db" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
