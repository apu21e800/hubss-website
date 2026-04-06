"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Hard-number proof points — not copy, evidence
const STATS = [
  { num: "30+", label: "Years", sub: "Engineering Canadian surfaces" },
  { num: "500+", label: "Municipalities", sub: "Across Canada" },
  { num: "20yr", label: "Warranty", sub: "Colour retention, in writing" },
  { num: "2", label: "Regions", sub: "East & West offices" },
];

// What makes HUBSS the spec — horizontal evidence rows
const PROOF = [
  {
    claim: "Built for Canadian winters",
    detail:
      "Freeze-thaw cycles, de-icing salts, and snowplow blades. Every system is stress-tested for Canadian climate extremes — from Ladysmith, BC to York Region, ON. Our surfaces don't just survive winter. They outlast it.",
  },
  {
    claim: "The strongest warranty in Canadian pavement",
    detail:
      "20-year colour retention on StreetPrint and StreetBond — backed in writing on every project. No other Canadian surface system offers the same guarantee. When we say it lasts, we mean it.",
  },
  {
    claim: "Specified coast to coast",
    detail:
      "York Region, City of Toronto, City of Vancouver, UBC, and 500+ municipalities have specified our systems for pedestrian safety, transit corridors, and civic identity projects. The standard cities rely on.",
  },
];

// Scrolling trust strip
const TRUSTED = [
  "City of Toronto",
  "York Region",
  "City of Vancouver",
  "University of British Columbia",
  "City of Ottawa",
  "City of Calgary",
  "City of Brampton",
  "City of Mississauga",
  "TransLink",
  "City of Surrey",
  "City of Edmonton",
  "City of Winnipeg",
  "City of Burnaby",
  "City of Richmond Hill",
];

// Duplicate for seamless loop
const TICKER = [...TRUSTED, ...TRUSTED];

export default function WhyHubss() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "#1C1F23",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)
        `,
        backgroundSize: "44px 44px",
      }}
    >
      {/* Top edge glow */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.45) 50%, transparent 100%)" }}
      />
      <div
        className="absolute top-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(249,115,22,0.04) 0%, transparent 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-28 pb-6">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ y: 16 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="max-w-2xl mb-16"
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
            Specified by Engineers.
            <br />Approved by Cities.
            <br />Loved by Communities.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#9CA3AF" }}>
            Thirty years of Canadian winters. Five hundred municipalities. One standard: if it goes on
            the street, it stays on the street. We don&apos;t sell coatings — we engineer the surfaces
            that tell a city it&apos;s worth caring about.
          </p>
        </motion.div>

        {/* ── Stats row ──────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 mb-16 rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ y: 10 }}
              animate={inView ? { y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="flex flex-col items-center justify-center gap-1 py-8 px-4 text-center"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              <span
                className="text-3xl sm:text-4xl font-black tracking-tight leading-none"
                style={{ color: "#f97316" }}
              >
                {s.num}
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: "#F5F0EB" }}>
                {s.label}
              </span>
              <span className="text-[10px] leading-snug" style={{ color: "#9CA3AF" }}>
                {s.sub}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ── Proof points — horizontal rows ─────────────────────────── */}
        <div className="space-y-0 mb-16" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {PROOF.map((p, i) => (
            <motion.div
              key={p.claim}
              initial={{ y: 8 }}
              animate={inView ? { y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
              className="group grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 lg:gap-12 py-8 px-2 transition-colors duration-200"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Claim */}
              <div className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 mt-0.5 text-[10px] font-bold tabular-nums tracking-[0.15em]"
                  style={{ color: "rgba(249,115,22,0.45)" }}
                >
                  0{i + 1}
                </span>
                <h3 className="font-bold text-[15px] leading-snug" style={{ color: "#F5F0EB" }}>
                  {p.claim}
                </h3>
              </div>
              {/* Detail */}
              <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                {p.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Trusted-by label ───────────────────────────────────────── */}
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.2)" }}>
          Trusted by
        </p>
      </div>

      {/* ── Full-bleed scrolling marquee ───────────────────────────── */}
      <div
        className="overflow-hidden pb-14"
        style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)" }}
      >
        <div
          className="flex gap-0 whitespace-nowrap"
          style={{
            animation: "hubss-marquee 36s linear infinite",
          }}
        >
          {TICKER.map((name, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6 flex-shrink-0">
              <span
                className="text-sm font-medium"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {name}
              </span>
              <span
                className="inline-block w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: "rgba(249,115,22,0.4)" }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Inline keyframe — avoids needing a CSS module */}
      <style>{`
        @keyframes hubss-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </section>
  );
}
