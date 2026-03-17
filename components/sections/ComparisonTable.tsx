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
      className="section-grid-bg py-24 border-t border-[var(--border-subtle)]"
      style={{ backgroundColor: "var(--color-off-white)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT: Context + metric callout ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <p className="gradient-text text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Why HUBSS
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold mb-5 leading-[1.1]"
              style={{ color: "#111827" }}
            >
              The Smarter<br />Specification
            </h2>
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: "#4b5563" }}>
              Traditional paint markings cost municipalities more every year through
              repeated reapplication, faded visibility, and plow damage. HUBSS products
              are installed once and built to last.
            </p>

            {/* Metric callout card */}
            <div
              className="rounded-lg p-6 mb-8"
              style={{
                background: "#111827",
                borderLeft: "3px solid #f97316",
              }}
            >
              <p
                className="font-black leading-none mb-2"
                style={{ fontSize: "3.5rem", color: "#f97316" }}
              >
                8x
              </p>
              <p className="text-sm font-medium" style={{ color: "#9ca3af" }}>
                longer service life than painted markings
              </p>
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

            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
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
                        background: i % 2 === 0 ? "#fff" : "#fafaf9",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: "#111827" }}>
                        {row.metric}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: "#ef4444" }}>
                        {row.trad}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold" style={{ color: "#111827" }}>
                        {row.hub}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm mt-6" style={{ color: "#6b7280" }}>
              Proven across 10 Canadian provinces since 1994
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
