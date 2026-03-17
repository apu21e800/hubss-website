"use client";

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
    <section className="py-24" style={{ background: "var(--color-off-white)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="gradient-text text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Why HUBSS
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: "#111827" }}>
            The Smarter Specification
          </h2>
        </motion.div>

        {/* Table — horizontally scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative"
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
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-sm mt-8"
          style={{ color: "#6b7280" }}
        >
          Proven across 10 Canadian provinces since 1994
        </motion.p>
      </div>
    </section>
  );
}
