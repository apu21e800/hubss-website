import Link from "next/link";

const personas = [
  {
    role: "Landscape Architects",
    icon: "🏛",
    desc: "Colour systems, pattern libraries, LEED documentation, and custom design templates.",
    cta: "Design Resources",
    href: "/resources",
  },
  {
    role: "Traffic Engineers",
    icon: "🛣",
    desc: "Technical data sheets, skid resistance specs, MOT compliance, and lifecycle cost analysis.",
    cta: "Technical Specs",
    href: "/resources",
  },
  {
    role: "Public Works Directors",
    icon: "🏙",
    desc: "Vision Zero crosswalks, traffic calming systems, snowplow-proof thermoplastic, and AODA-compliant pedestrian surfaces.",
    cta: "Safety Solutions",
    href: "/applications/pedestrian-safety",
  },
  {
    role: "Commercial Developers",
    icon: "🏗",
    desc: "Cost-effective paver alternatives, LEED credits, and decorative treatments for high-impact properties.",
    cta: "Commercial Projects",
    href: "/applications/commercial-spaces",
  },
];

export default function PersonaEntryPoints() {
  return (
    <section className="py-20 bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-zinc-500 text-xs uppercase tracking-widest text-center mb-4">Designed For</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16 tracking-tight">
          Built for the Professionals Who Specify, Approve, and Build
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {personas.map((p) => (
            <Link
              key={p.role}
              href={p.href}
              className="group bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-xl p-6 transition-all duration-300 cursor-pointer"
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{p.role}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">{p.desc}</p>
              <span className="text-orange-500 text-sm font-medium group-hover:text-orange-400">
                {p.cta} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
