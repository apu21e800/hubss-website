export default function WhyHubss() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "#1C1F23" }}
    >
      {/* Subtle orange top-edge line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)" }}
      />
      {/* Warm top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(249,115,22,0.05) 0%, transparent 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
          WHY HUB SURFACE SYSTEMS
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
          style={{
            background: "linear-gradient(90deg, #F97316, #EAB308)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Specified by Engineers. Approved by Cities. Loved by Communities.
        </h2>
        <p className="text-lg leading-relaxed max-w-3xl" style={{ color: "#E5E7EB" }}>
          For over 30 years, HUB Surface Systems has been the trusted Canadian partner for pavement
          systems that perform at the intersection of safety, durability, and design. We don&apos;t sell
          coatings — we enable the infrastructure that defines how Canadians experience their cities.
        </p>
      </div>
    </section>
  );
}
