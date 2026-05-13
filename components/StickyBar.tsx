"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Two-condition reveal:
//   1. Hero-aware: when [data-hero] element is intersecting the viewport,
//      the bar stays hidden — the hero's own CTAs are visible.
//   2. Scroll-direction: once past the hero, show on scroll-up, hide on scroll-down.
//   • MIN_DELTA filters iOS rubber-band / trackpad jitter
//   • rAF-throttled to avoid layout thrash
const MIN_DELTA = 6;

export default function StickyBar() {
  const [scrolledUp, setScrolledUp] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true); // assume hero visible until IO fires
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // IntersectionObserver — watch [data-hero] element on current page
  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) {
      setHeroVisible(false); // no hero on this page — use scroll-only logic
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Scroll-direction tracker
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastScrollY.current;
        if (Math.abs(dy) >= MIN_DELTA) {
          setScrolledUp(dy < 0);
        }
        lastScrollY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Show only when: scroll-up AND hero is not in view
  const visible = scrolledUp && !heroVisible;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-hidden={!visible}
    >
      <div
        className="flex items-center gap-3 px-4 lg:px-8 py-3"
        style={{
          background: "#0d1117",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.35)",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        }}
      >
        {/* Brand caption — desktop only */}
        <p className="hidden lg:block flex-1 text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
          Canada&#39;s Decorative Pavement Specialists · Since 1999
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <Link
            href="/contact"
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 border text-white px-5 text-[12px] font-bold tracking-[0.04em] transition-all whitespace-nowrap"
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              borderRadius: "6px",
              minHeight: "44px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            See the Systems
          </Link>
          <Link
            href="/lunch-learn"
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 text-white px-5 text-[12px] font-bold tracking-[0.04em] transition-colors whitespace-nowrap"
            style={{
              background: "#F97316",
              borderRadius: "6px",
              boxShadow: "0 2px 14px rgba(249,115,22,0.35)",
              minHeight: "44px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#EA6C05";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#F97316";
            }}
          >
            Book a Lunch &amp; Learn
          </Link>
        </div>
      </div>
    </div>
  );
}
