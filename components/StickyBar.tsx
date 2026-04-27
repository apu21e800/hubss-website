"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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
        }}
      >
        {/* Brand caption — desktop only */}
        <p className="hidden lg:block flex-1 text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
          Canada&#39;s Decorative Pavement Specialists · Since 1994
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <Link
            href="/contact"
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 border text-white px-5 py-2.5 text-[12px] font-bold tracking-[0.04em] transition-all whitespace-nowrap"
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              borderRadius: "6px",
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
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 text-white px-5 py-2.5 text-[12px] font-bold tracking-[0.04em] transition-colors whitespace-nowrap"
            style={{
              background: "#F97316",
              borderRadius: "6px",
              boxShadow: "0 2px 14px rgba(249,115,22,0.35)",
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
