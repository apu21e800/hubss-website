"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STATS = [
  { num: "30+",    label: "Years",          sub: "Installations across North America" },
  { num: "1,000+", label: "Projects",       sub: "Completed coast to coast" },
  { num: "500+",   label: "Municipalities", sub: "Specified coast to coast" },
  // Softened from "20yr" — Doug-style proactive QA on bold quantitative claims (Vernon's call).
  { num: "DECADES", label: "Performance",   sub: "Colour retention on stamped asphalt and coatings" },
];

const PROOF = [
  {
    num: "01",
    claim: "Built for freeze-thaw climates",
    detail: "Freeze-thaw cycles, de-icing salts, snowplow blades. Stress-tested for every climate coast to coast.",
  },
  {
    num: "02",
    claim: "Outstanding lifecycle value",
    detail: "Thermoplastic and MMA systems deliver 6–8 years of high-visibility performance — with no seasonal reapplication or lane closures.",
  },
  {
    num: "03",
    claim: "Visible in every condition",
    detail: "Retroreflective crosswalk systems, high-contrast colour combinations, and slip-resistant surfaces engineered for rain, snow, and low-light performance.",
  },
  {
    num: "04",
    claim: "Specified by engineers coast to coast",
    detail: "Trusted by transportation engineers, urban designers, and municipal procurement teams from Vancouver to Halifax.",
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
      style={{ background: "#070b12" }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-120px", left: "-80px", width: "600px", height: "500px",
          background: "radial-gradient(ellipse at 30% 20%, rgba(249,115,22,0.13) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-60px", right: "0", width: "400px", height: "300px",
          background: "radial-gradient(ellipse at 70% 0%, rgba(234,179,8,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.5) 50%, transparent 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-28 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="max-w-2xl mb-14"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
            Why HUB
          </p>
          <h2
            className="font-black mb-5"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              lineHeight: 0.97,
              letterSpacing: "-0.035em",
              background: "linear-gradient(92deg, #F97316 0%, #EAB308 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The durable decorative hardscape.
            <br />Specified by Engineers.
            <br />Loved by Communities.
          </h2>
          <p className="text-base leading-relaxed max-w-xl" style={{ color: "#9CA3AF" }}>
            Thirty years. 500+ municipalities. One standard — if it goes on the street, it stays on the street.
          </p>
        </motion.div>

        <div
          className="grid grid-cols-2 sm:grid-cols-4 mb-12 rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.025)" }}
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="flex flex-col items-center justify-center gap-1 py-7 px-4 text-center"
              style={{
                borderRight:  i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
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

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-12 mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <a
            href="/contact"
            className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-lg transition-all text-sm"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #EA8C16 100%)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(249,115,22,0.3)",
            }}
          >
            Request a Quote
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="/lunch-learn"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <span className="group-hover:text-orange-400 transition-colors">Book a Lunch &amp; Learn</span>
            <svg className="w-3.5 h-3.5 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>

        <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-10 mb-5" style={{ color: "rgba(255,255,255,0.18)" }}>
          Trusted by
        </p>
      </div>

      <div
        className="overflow-hidden pt-2 pb-10"
        style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)" }}
      >
        <div
          className="flex gap-0 whitespace-nowrap"
          style={{ animation: "hubss-marquee 36s linear infinite" }}
        >
          {TICKER.map((name, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
              <span className="text-sm font-medium px-5" style={{ color: "rgba(255,255,255,0.35)", lineHeight: 1 }}>
                {name}
              </span>
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(249,115,22,0.5)",
                  flexShrink: 0,
                }}
              />
            </span>
          ))}
        </div>
      </div>

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
