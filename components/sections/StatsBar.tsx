"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "1,000+", label: "Projects Completed" },
  { value: "10",     label: "Provinces Served" },
  { value: "30+",    label: "Years Experience" },
  { value: "20 Year", label: "Warranty" },
];

export default function StatsBar() {
  return (
    <section className="bg-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center text-center py-6 px-4 relative"
            >
              {/* Vertical divider — desktop only */}
              {i < stats.length - 1 && (
                <span className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-px bg-zinc-700" />
              )}

              <p className="text-3xl font-black text-orange-500 leading-none mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-zinc-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
