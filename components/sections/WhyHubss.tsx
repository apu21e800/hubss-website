import { motion } from "framer-motion";

export default function WhyHubss() {
  return (
    <section className="py-24" style={{ background: "var(--bg-slate)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
          WHY HUB SURFACE SYSTEMS
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
          style={{
            background: "var(--gradient-brand)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Specified by Engineers. Approved by Cities. Loved by Communities.
        </h2>
        <p className="text-lg leading-relaxed max-w-3xl" style={{ color: "var(--text-body)" }}>
          For over 30 years, HUB Surface Systems has been the trusted Canadian partner for pavement
          systems that perform at the intersection of safety, durability, and design. We don&apos;t sell
          coatings — we enable the infrastructure that defines how Canadians experience their cities.
        </p>
      </div>
    </section>
  );
}
