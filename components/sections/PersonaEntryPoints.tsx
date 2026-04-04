"use client";

export default function PersonaEntryPoints() {
  const categories = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3.75h.75m-.75 3.75h.75m3-7.5h.75m-.75 3.75h.75m-.75 3.75h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
        </svg>
      ),
      title: "Municipalities",
      stat: "30+ years",
      statLabel: "specifying Canadian public infrastructure",
      proof: "York Region · City of Toronto · City of Vancouver · UBC",
      href: "/applications",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
      ),
      title: "Landscape Architects",
      stat: "500+",
      statLabel: "award-winning Complete Streets projects coast to coast",
      proof: "Decorative + functional pavement systems since 1994",
      href: "/projects",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
        </svg>
      ),
      title: "Contractors",
      stat: "Coast-to-coast",
      statLabel: "certified applicator network across Canada",
      proof: "Full installation support, training, and technical specs",
      href: "/contact",
    },
  ];

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background: "#0a0f1a",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Subtle radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "rgba(249,115,22,0.4)" }} />
          <p
            className="text-xs font-bold tracking-[0.25em] uppercase"
            style={{ color: "rgba(249,115,22,0.8)" }}
          >
            Trusted By
          </p>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <a
              key={cat.title}
              href={cat.href}
              className="group block rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 0 0 0 rgba(249,115,22,0)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.25)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(249,115,22,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(249,115,22,0)";
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(249,115,22,0.1)", color: "#f97316" }}
              >
                {cat.icon}
              </div>

              {/* Title */}
              <h3
                className="text-lg font-bold mb-3 group-hover:text-orange-400 transition-colors"
                style={{ color: "#F5F0EB" }}
              >
                {cat.title}
              </h3>

              {/* Stat */}
              <div className="mb-4">
                <span
                  className="text-2xl font-black mr-2"
                  style={{ color: "#f97316" }}
                >
                  {cat.stat}
                </span>
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(209,213,219,0.7)" }}
                >
                  {cat.statLabel}
                </span>
              </div>

              {/* Proof line */}
              <p className="text-xs leading-relaxed" style={{ color: "rgba(156,163,175,0.6)" }}>
                {cat.proof}
              </p>

              {/* CTA hint */}
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more
                <svg className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
