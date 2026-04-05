const PILLARS = [
  {
    heading: "Built for Canada",
    body:
      "Engineered for freeze-thaw cycles, de-icing salts, and snowplow blades. Every system is tested against Canadian climate extremes — from Ladysmith BC to York Region ON. Our surfaces don't just survive winter. They outlast it.",
  },
  {
    heading: "Backed by Warranty",
    body:
      "20-year colour retention on StreetPrint and StreetBond — the strongest guarantee in the Canadian pavement industry. We stand behind every square metre. When we say it lasts, we put it in writing.",
  },
  {
    heading: "Proven Everywhere",
    body:
      "York Region, City of Toronto, UBC, the City of Vancouver, and 500+ Canadian municipalities have specified our systems for pedestrian safety, transit corridors, and civic identity projects.",
  },
];

export default function WhyHubss() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background: "#1C1F23",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: "44px 44px",
      }}
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

        {/* Header */}
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
            Why HUB Surface Systems
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-5 leading-tight"
            style={{
              background: "linear-gradient(90deg, #F97316, #EAB308)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Specified by Engineers. Approved by Cities. Loved by Communities.
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#9CA3AF" }}>
            Thirty years of Canadian winters. Five hundred municipalities. One standard: if it goes on
            the street, it stays on the street. We don&apos;t sell coatings — we engineer the surfaces
            that tell a city it&apos;s worth caring about.
          </p>
        </div>

        {/* Proof pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px"
          style={{ background: "rgba(255,255,255,0.06)", borderRadius: "14px", overflow: "hidden" }}>
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.heading}
              className="p-8 flex flex-col gap-3"
              style={{ background: "#1C1F23" }}
            >
              {/* Number */}
              <span
                className="text-xs font-bold tracking-[0.2em] tabular-nums"
                style={{ color: "rgba(249,115,22,0.4)" }}
              >
                0{i + 1}
              </span>
              {/* Heading */}
              <h3
                className="text-lg font-bold leading-snug"
                style={{ color: "#F5F0EB" }}
              >
                {pillar.heading}
              </h3>
              {/* Body */}
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
