"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STATS = [
  { num: "30+", label: "Years", sub: "Engineering Canadian surfaces" },
  { num: "Hundreds", label: "Municipalities", sub: "Specified coast to coast" },
  { num: "20yr", label: "Warranty", sub: "Colour retention, in writing" },
  { num: "AODA", label: "Compliant", sub: "Every system, every install" },
];

// Condensed to scannable one-liners — no paragraphs
const PROOF = [
  {
    num: "01",
    claim: "Built for Canadian winters",
    detail: "Freeze-thaw, de-icing salts, snowplow blades. Stress-tested for every climate Coast to Coast.",
  },
  {
    num: "02",
    claim: "Strongest warranty in Canadian pavement",
    detail: "20-year colour retention on StreetPrint and StreetBond. Backed in writing. No one else offers it.",
  },
  {
    num: "03",
    claim: "Safe",
    detail: "Products designed for pedestrian safety and traffic-compliant installations.",
  },
  {
    num: "04",
    claim: "Regulatory Compliance",
    detail: "TAC, MUTCD, BCMOT, and FAA-compliant across the full product range.",
  },
];

const TRUSTED = [
  "City of Toronto", "York Region", "City of Vancouver", "University of British Columbia",
  "City of Ottawa", "City of Calgary", "City of Brampton", "City of Mississauga",
  "TransLink", "City of Surrey", "City of Edmonton", "City of Winnipeg",
  "City of Burnaby", "City of Richmond Hill",
];
const TICKER = [...TRUSTED, ...TRUSTED];

export default function WhyHubss() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#070b12",
      }}
    >
      {/* Strong orange bloom from top-left — gives the section energy */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-120px",
          left: "-80px",
          width: "600px",
          height: "500px",
          background: "radial-gradient(ellipse at 30% 20%, rgba(249,115,22,0.13) 0%, transparent 65%)",
        }}
      />
      {/* Subtle secondary bloom top-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-60px",
          right: "0",
          width: "400px",
          height: "300px",
          background: "radial-gradient(ellipse at 70% 0%, rgba(234,179,8,0.06) 0%, transparent 70%)",
        }}
      />
      {/* Top edge line */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.5) 50%, transparent 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-28 pb-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="max-w-2xl mb-14"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
            Why HUB Surface Systems
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-5"
            style={{
              background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Canada's durable decorative hardscape.
            <br />Specified by Engineers.
            <br />Loved by Communities.
          </h2>
          <p className="text-base leading-relaxed max-w-xl" style={{ color: "#9CA3AF" }}>
            Thirty years. Hundreds of municipalities. One standard — if it goes on the street, it stays on the street.
          </p>
        </motion.div>

        {/* ── Stats ── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 mb-12 rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="flex flex-col items-center justify-center gap-1 py-7 px-4 text-center"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              <span className="text-3xl sm:text-4xl font-black tracking-tight leading-none" style={{ color: "#f97316" }}>
                {s.num}
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase mt-1" style={{ color: "#F5F0EB" }}>
                {s.label}
              </span>
              <span className="text-[10px] leading-snug" style={{ color: "#9CA3AF" }}>
                {s.sub}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ── Proof points — tight rows, no paragraph walls ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {PROOF.map((p, i) => (
            <motion.div
              key={p.claim}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-2 lg:gap-10 py-5 px-1"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold tabular-nums" style={{ color: "rgba(249,115,22,0.4)" }}>
                  {p.num}
                </span>
                <h3 className="font-semibold text-sm" style={{ color: "#F5F0EB" }}>
                  {p.claim}
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                {p.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Trusted-by label ── */}
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-10 mb-5" style={{ color: "rgba(255,255,255,0.18)" }}>
          Trusted by
        </p>
      </div>

      {/* ── Full-bleed scrolling marquee ── */}
      <div
        className="overflow-hidden pt-2 pb-10"
        style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)" }}
      >
        <div
          className="flex gap-0 whitespace-nowrap"
          style={{ animation: "hubss-marquee 36s linear infinite" }}
        >
          {TICKER.map((name, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6 flex-shrink-0">
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                {name}
              </span>
              <span className="inline-block w-1 h-1 rounded-full flex-shrink-0" style={{ background: "rgba(249,115,22,0.4)" }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── Gradient frame line — grounds the marquee, bridges into persona strip ── */}
      <div
        className="w-full"
        style={{
          height: "1.5px",
          background: "linear-gradient(90deg, transparent 0%, #F97316 30%, #EAB308 70%, transparent 100%)",
          opacity: 0.6,
        }}
      />

      <style>{`
        @keyframes hubss-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
