"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    id: "municipal",
    label: "Crosswalks & Civic",
    bgImage: "/images/hero/hero-1.jpg",
    thumbImage: "/images/applications/crosswalks/crosswalks-03.jpg",
    eyebrow: "Municipal & Civic",
    h1a: "The World Is",
    h1b: "Your Canvas.",
    body: "Decorative crosswalks, roundabouts, and plazas that define community identity — and outlast paint by 20 years in Canada's harshest climates.",
    cta1: { label: "See Projects", href: "/projects" },
    cta2: { label: "Request Spec Sheet", href: "/contact" },
  },
  {
    id: "driveways",
    label: "Driveways & Residential",
    bgImage: "/images/products/streetprint/streetprint-40.jpg",
    thumbImage: "/images/applications/residential-driveways/residential-driveways-03.jpg",
    eyebrow: "Driveways & Residential",
    h1a: "Curb Appeal That",
    h1b: "Outlasts Trends.",
    body: "Stamped asphalt and decorative coatings for private driveways, strata entries, and townhome communities from coast to coast.",
    cta1: { label: "StreetPrint System", href: "/products/streetprint" },
    cta2: { label: "Get a Quote", href: "/contact" },
  },
  {
    id: "lanes",
    label: "Bike & Bus Lanes",
    bgImage: "/images/applications/bike-lanes/bike-lanes-14.jpg",
    thumbImage: "/images/applications/bus-lanes/bus-lanes-20.jpg",
    eyebrow: "Roads & Transit",
    h1a: "Infrastructure That",
    h1b: "Moves Communities.",
    body: "Bus rapid transit lanes, protected bike corridors, and Vision Zero–ready markings. Traffic-ready in 60 minutes. Engineered for Canadian winters.",
    cta1: { label: "View Transit Solutions", href: "/applications/bus-lanes" },
    cta2: { label: "Contact Us", href: "/contact" },
  },
];

export default function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    setActive(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const prev = useCallback(() => goTo(active - 1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [paused]);

  const s = SLIDES[active];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "90vh", maxHeight: "1000px", background: "#0d1117" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero image slideshow"
    >
      {/* ── Background images — cross-fade ───────────────────── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0"
          style={{
            opacity: i === active ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
            zIndex: 1,
          }}
        >
          <Image
            src={slide.bgImage}
            alt={slide.label}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "50% 55%" }}
          />
        </div>
      ))}

      {/* ── Gradients ─────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,17,23,0.65) 0%, rgba(13,17,23,0.58) 30%, rgba(13,17,23,0.78) 65%, rgba(13,17,23,0.97) 100%)",
          zIndex: 2,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(95deg, rgba(13,17,23,0.55) 0%, rgba(13,17,23,0.22) 44%, transparent 64%)",
          zIndex: 2,
        }}
      />
      {/* Orange atmospheric bloom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(249,115,22,0.14) 0%, transparent 55%)",
          zIndex: 2,
        }}
      />

      {/* ── Chevron arrows ──────────────────────────────────── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full border transition-all hover:border-white/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        style={{ zIndex: 30, borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full border transition-all hover:border-white/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        style={{ zIndex: 30, borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── Bottom content zone ───────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col"
        style={{ zIndex: 10 }}
      >
        {/* Text block */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color: "#F97316" }}
            >
              {s.eyebrow}
            </p>

            {/* H1 */}
            <h1
              className="font-black mb-5"
              style={{
                fontSize: "clamp(3rem, 8.5vw, 7rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                color: "white",
                textShadow: "0 2px 28px rgba(0,0,0,0.45)",
              }}
            >
              {s.h1a}{" "}
              <span
                style={{
                  background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.h1b}
              </span>
            </h1>

            {/* Body */}
            <p
              className="text-base sm:text-lg leading-relaxed mb-7 max-w-xl"
              style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}
            >
              {s.body}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href={s.cta1.href}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
                  color: "#fff",
                  boxShadow: "0 6px 24px rgba(249,115,22,0.38)",
                }}
              >
                {s.cta1.label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href={s.cta2.href}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm border transition-all hover:bg-white/[0.06]"
                style={{
                  borderColor: "rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                {s.cta2.label}
              </Link>
            </div>

            {/* Pill dots */}
            <div className="flex items-center gap-2 mb-4">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === active ? "22px" : "6px",
                    height: "6px",
                    background: i === active ? "#F97316" : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Thumbnail strip ───────────────────────────────────── */}
        <div
          className="border-t"
          style={{ borderColor: "rgba(255,255,255,0.10)", background: "rgba(13,17,23,0.85)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3">
              {SLIDES.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => goTo(i)}
                  className="relative group overflow-hidden transition-all"
                  style={{
                    height: "80px",
                    borderRight: i < SLIDES.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    outline: "none",
                  }}
                  aria-label={`View ${slide.label}`}
                  aria-current={i === active ? "true" : undefined}
                >
                  {/* Thumb image */}
                  <Image
                    src={slide.thumbImage}
                    alt={slide.label}
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ opacity: i === active ? 0.75 : 0.38 }}
                  />
                  {/* Dark scrim */}
                  <div className="absolute inset-0" style={{ background: "rgba(13,17,23,0.45)" }} />
                  {/* Label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-[10px] font-bold tracking-[0.08em] text-center uppercase px-2"
                      style={{
                        color: i === active ? "#F5F0EB" : "rgba(255,255,255,0.45)",
                        transition: "color 0.3s",
                      }}
                    >
                      {slide.label}
                    </span>
                  </div>
                  {/* Active indicator — orange top bar */}
                  <div
                    className="absolute top-0 inset-x-0 transition-all duration-300"
                    style={{
                      height: "2px",
                      background: "#F97316",
                      transformOrigin: "left",
                      transform: i === active ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
