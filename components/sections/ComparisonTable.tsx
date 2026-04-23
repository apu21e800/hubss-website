"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const rows = [
  { metric: "Snow plow resistance", trad: "Poor",                hub: "Excellent" },
  { metric: "Service life",         trad: "1–2 Years",           hub: "8+ Years" },
  { metric: "Installation",         trad: "Yearly maintenance",  hub: "One-time application" },
  { metric: "Skid resistance",      trad: "Low",                 hub: "High" },
  { metric: "Visibility",           trad: "Fades quickly",       hub: "Colour stable" },
];

export default function ComparisonTable() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background: "#0d1117",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Subtle orange glow top-left */}
      <div className="absolute pointer-events-none" style={{ top: -100, left: -80, width: 480, height: 400, background: "radial-gradient(ellipse at 30% 20%, rgba(249,115,22,0.10) 0%, transparent 65%)" }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT: Context + metric callout ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
              Why HUBSS
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-[1.1]"
              style={{ color: "#ffffff" }}
            >
              Paint Fades.<br />We Don&apos;t.
            </h2>
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: "#9ca3af" }}>
              Traditional paint markings cost municipalities more every year through
              repeated reapplication, faded visibility, and plow damage. HUB surface
              systems are installed once and built to outlast the budget cycle.
            </p>

            {/* Metric callout card */}
            <div
              className="rounded-xl p-6 mb-8 flex items-center gap-5"
              style={{
                background: "#111827",
                borderLeft: "3px solid #f97316",
              }}
            >
              {/* Stat */}
              <div className="flex-shrink-0">
                <p
                  className="text-4xl sm:text-5xl font-black leading-none"
                  style={{ color: "#f97316" }}
                >
                  8x
                </p>
              </div>
              {/* Divider */}
              <div className="w-px self-stretch" style={{ background: "rgba(249,115,22,0.2)" }} />
              {/* Label */}
              <div>
                <p className="text-sm font-semibold leading-snug" style={{ color: "#ffffff" }}>
                  Longer service life
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                  vs. painted markings — proven in the field since 1994
                </p>
              </div>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 hover:text-orange-300"
              style={{ color: "#f97316" }}
            >
              See our projects
              <span className="text-base leading-none">→</span>
            </Link>
          </motion.div>

          {/* ── RIGHT: Comparison table ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {/* Scroll hint (mobile only) */}
            <p
              className="text-xs font-medium mb-2 text-right sm:hidden"
              style={{ color: "#9ca3af" }}
            >
              scroll &rarr;
            </p>

            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <table
                className="w-full min-w-[520px] rounded-lg overflow-hidden shadow-sm"
                style={{ borderCollapse: "separate", borderSpacing: 0 }}
              >
                <thead>
                  <tr>
                    <th
                      className="text-left text-sm font-bold px-6 py-4"
                      style={{ background: "#111827", color: "#fff" }}
                    >
                      Performance Metric
                    </th>
                    <th
                      className="text-left text-sm font-bold px-6 py-4"
                      style={{ background: "#111827", color: "#9ca3af" }}
                    >
                      Traditional Markings
                    </th>
                    <th
                      className="text-left text-sm font-bold px-6 py-4"
                      style={{ background: "#f97316", color: "#fff" }}
                    >
                      HUB Surface Systems
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.metric}
                      style={{
                        background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <td className="px-3 py-2 text-sm font-medium" style={{ color: "#e5e7eb" }}>
                        {row.metric}
                      </td>
                      <td className="px-3 py-2 text-sm font-medium" style={{ color: "#ef4444" }}>
                        {row.trad}
                      </td>
                      <td className="px-3 py-2 text-sm font-bold" style={{ color: "#f97316" }}>
                        {row.hub}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm mt-6" style={{ color: "#6b7280" }}>
              Proven in 10 provinces, coast to coast, since 1994
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );