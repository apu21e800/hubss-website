"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { heroImages, resolveImage } from "@/lib/featured-images";

export type HeroVariant = 'default' | 'split' | 'cinematic';

interface HeroProps {
  variant?: HeroVariant;
}

const credentialStats = [
  { value: "1,000+", label: "Streets transformed" },
  { value: "10", label: "Provinces, coast to coast" },
  { value: "Since 1994", label: "Trusted across Canada" },
  { value: "20yr", label: "Colour warranty" },
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
      style={{ background: "#080d16" }}
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
      {/* Stamped asphalt texture — material depth, barely visible */}
      <Image
        src="/images/textures/stamped-asphalt-texture.webp"
        alt=""
        fill
        className="object-cover pointer-events-none"
        style={{ opacity: 0.06, mixBlendMode: "overlay" }}
        aria-hidden="true"
        sizes="100vw"
      />
      {/* Dark overlay — keeps text fully readable */}
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />

      {/* Main content — mobile: column with top text + bottom CTAs | desktop: centered */}
      <div
        ref={textRef}
        className="flex-1 flex flex-col justify-between sm:justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 sm:pt-32 pb-10 relative z-10"
        style={{ willChange: "transform" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl w-full text-left relative"
        >
          {/* Gradient left-edge accent — tracks the headline block */}
          <div
            className="absolute -left-4 sm:-left-6 lg:-left-8 top-2 w-[3px] h-36 sm:h-48"
            style={{ background: "linear-gradient(180deg, #F97316 0%, #EAB308 100%)" }}
          />
          {/* Eyebrow */}
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-5 sm:mb-6"
            style={{ color: "#f97316" }}
          >
            30+ Years · 500+ Projects · York Region, Vancouver &amp; UBC
          </p>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white leading-none mb-5 sm:mb-6">
            The Street Is Your Canvas.
          </h1>

          {/* Body — hidden on smallest screens to give headline room, shows sm+ */}
          <p className="hidden sm:block text-base md:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
            Trusted by municipalities in all 10 provinces since 1994. We make streets that feel like they belong there — surfaces that endure Canadian winters and define communities.
          </p>
          {/* Mobile-only shortened body */}
          <p className="sm:hidden text-sm text-gray-300 mb-8 leading-relaxed">
            Trusted in all 10 provinces since 1994.
          </p>
        </motion.div>

        {/* CTAs + Stats — bottom of flex on mobile for thumb reach, inline on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl w-full"
        >
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
            <Link
              href="/products"
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-lg transition-colors text-center w-full sm:w-auto min-h-[52px] flex items-center justify-center text-base"
            >
              Explore Systems
            </Link>
            <Link
              href="/lunch-learn"
              className="border border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-lg transition-colors text-center w-full sm:w-auto min-h-[52px] flex items-center justify-center text-base"
            >
              Book a Lunch &amp; Learn
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {credentialStats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">{stat.value}</span>
                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}