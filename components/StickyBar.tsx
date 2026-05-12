"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Smart scroll-direction hide:
//   • Always visible near top of page (≤ ALWAYS_SHOW_PX)
//   • Past that: HIDE on scroll-down (reader committed to content),
//     SHOW on scroll-up (reader looking for action)
//   • MIN_DELTA filters iOS rubber-band / trackpad jitter
//   • rAF-throttled to avoid layout thrash
const ALWAYS_SHOW_PX = 220;
const MIN_DELTA = 6;

export default function StickyBar() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastScrollY.current;
        if (y <= ALWAYS_SHOW_PX) {
          setVisible(true);
        } else if (Math.abs(dy) >= MIN_DELTA) {
          // dy > 0 → scrolling down → hide
          // dy < 0 → scrolling up → show
          setVisible(dy < 0);
        }
        lastScrollY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            Request Spec Sheet
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
