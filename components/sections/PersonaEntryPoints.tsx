import Link from "next/link";

const PERSONAS = [
  {
    label: "Municipalities",
    desc: "Every crosswalk, transit corridor, and plaza that defines your city — Vision Zero aligned, accessibility-aware, installed by certified crews from Halifax to Victoria.",
    href: "/applications",
  },
  {
    label: "Designers & Specifiers",
    desc: "12+ StreetPrint patterns, full Pantone matching, snowplow-safe, and engineering-approved. Beautiful that actually survives the job site.",
    href: "/products",
  },
  {
    label: "Contractors",
    desc: "Hub Surface Systems certifies, trains and supports a network of contractors across Canada",
    href: "/contact",
  },
];

export default function PersonaEntryPoints() {
  return (
    <section
      style={{
        background: "#080d16",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
          {PERSONAS.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="group flex items-start gap-4 px-6 py-8 transition-colors duration-200 hover:bg-white/[0.025]"
            >
              <span
                className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: "#f97316" }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-bold mb-1 group-hover:text-orange-400 transition-colors"
                  style={{ color: "#F5F0EB" }}
                >
                  {p.label}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#868C98" }}>
                  {p.desc}
                </p>
              </div>
              <svg
                className="ml-2 flex-shrink-0 mt-0.5 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                fill="none"
                stroke="#f97316"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
