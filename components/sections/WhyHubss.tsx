import { motion } from "framer-motion";

export default function WhyHubss() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/textures/stamped-asphalt-texture.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay — barely visible texture, adds depth */}
      <div className="absolute inset-0 bg-zinc-950/90" />

      <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
          WHY HUB SURFACE SYSTEMS
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: "var(--text-primary)" }}>
          Specified by Engineers. Approved by Cities. Loved by Communities.
        </h2>
        <p className="text-lg leading-relaxed max-w-3xl" style={{ color: "var(--text-body)" }}>
          For over 30 years, HUB Surface Systems has been the trusted Canadian partner for pavement
          systems that perform at the intersection of safety, durability, and design. We don&apos;t sell
          coatings — we enable the infrastructure that defines how Canadians experience their cities.
        </p>
      </div>
      </div>
    </section>
  );
}
