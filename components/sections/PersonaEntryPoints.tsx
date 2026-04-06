export default function PersonaEntryPoints() {
  const categories = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3.75h.75m-.75 3.75h.75m3-7.5h.75m-.75 3.75h.75m-.75 3.75h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
        </svg>
      ),
      title: "Municipalities",
      stat: "30+ years specifying Canadian public infrastructure",
      clients: "York Region · City of Toronto · City of Vancouver · UBC",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
      ),
      title: "Landscape Architects",
      stat: "Specified on award-winning Complete Streets projects coast to coast",
      clients: "Decorative + functional pavement since 1994",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
        </svg>
      ),
      title: "Contractors",
      stat: "Full installation support, training, and technical specs included",
      clients: "Coast-to-coast applicator network across Canada",
    },
  ];

  return (
    <section className="py-16" style={{ background: "#0f1117", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-10" style={{ color: "#f97316" }}>
          Trusted By
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 cursor-default hover:shadow-[0_4px_32px_rgba(249,115,22,0.12)] hover:-translate-y-0.5"
              style={{
                background: "#1C1F23",
                borderTop: "2px solid #f97316",
                border: "1px solid rgba(249,115,22,0.15)",
                borderTopWidth: "2px",
                borderTopColor: "#f97316",
              }}
            >
              <div style={{ color: "#f97316" }}>{cat.icon}</div>
              <div>
                <p className="font-bold text-lg mb-1" style={{ color: "#F5F0EB" }}>{cat.title}</p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#D1D5DB" }}>{cat.stat}</p>
                <p className="text-xs" style={{ color: "#6B7280" }}>{cat.clients}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
