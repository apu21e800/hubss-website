import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";

export const metadata = buildMetadata({
  title: "About HUB Surface Systems",
  description: "30+ years making Canadian streets better. Two regional offices serving every province — we're the people who made your city look like your city.",
  slug: "about",
});

const stats = [
  { value: "30+", label: "Years in Business" },
  { value: "1,000+", label: "Projects Completed" },
  { value: "10", label: "Provinces Served" },
  { value: "2", label: "Regional Offices" },
];

const values = [
  {
    heading: "What We Build",
    body:
      "Decorative crosswalks, civic plazas, community murals, transit lanes, private driveways, and parks. Surface solutions that carry meaning — from high-visibility school zones in Milton to Indigenous art installations in Sechelt.",
  },
  {
    heading: "Who We Build For",
    body:
      "Municipalities, landscape architects, urban planners, developers, and certified contractors across every Canadian province. If it&apos;s a surface that people walk, drive, or gather on — we have a system for it.",
  },
  {
    heading: "Why It Matters",
    body:
      "Beautiful streets make walkable cities. Legible surfaces slow cars. Identity-rich public spaces build community. This isn&apos;t just infrastructure — it&apos;s the civic layer that tells a city it&apos;s worth caring about.",
  },
];

const differentiators = [
  {
    title: "Flexibility vs Concrete",
    desc: "Asphalt-based systems flex with Canada's freeze-thaw cycles, outlasting concrete alternatives by 2–3x in northern climates.",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  },
  {
    title: "6–8x Longer Than Paint",
    desc: "Thermoplastic and MMA markings deliver 6–8 years of service life versus 12–18 months for standard traffic paint.",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Vision Zero Aligned",
    desc: "Every HUB product is designed to support Vision Zero frameworks — from retroreflective crosswalk markings to high-contrast bike lane systems.",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286z",
  },
  {
    title: "Pedestrian-First Design",
    desc: "High-contrast, retroreflective, and textured surface systems engineered for maximum pedestrian visibility and safety in every Canadian climate condition.",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
  {
    title: "Documented Longevity",
    desc: "StreetPrint and StreetBond installations deliver proven 20-year colour retention across hundreds of Canadian municipalities — from BC coastal rain to Ontario freeze-thaw cycles.",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  },
  {
    title: "Canadian-Specific",
    desc: "Every system is engineered and tested for Canadian climate extremes, from Ladysmith BC to York Region ON.",
    icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
  },
];

export default function AboutPage() {
  return (
    <main style={{ background: "#0f1620", minHeight: "100vh" }}>
      <Nav />

      {/* ── Hero ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "#0d1117" }}>
        {/* Orange accent underline */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{ background: "linear-gradient(90deg, #F97316 0%, transparent 60%)" }}
          aria-hidden="true"
        />
        {/* HUB Wheel watermark */}
        <div
          className="absolute bottom-0 right-0 pointer-events-none"
          style={{ width: 520, height: 520, opacity: 0.05 }}
          aria-hidden="true"
        >
          <Image src="/images/assets/logos/hubss-logos/HUB-wheel_official-orange-transparent.svg" alt="" width={520} height={520} unoptimized />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 relative">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
            Canadian-Operated Since 1994 · All 10 Provinces
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight max-w-4xl" style={{ color: "#ffffff" }}>
            The people who made your city look like your city.
          </h1>
          <p className="text-xl leading-relaxed max-w-2xl" style={{ color: "#8b8b8b" }}>
            For over thirty years, HUB Surface Systems — a proudly Canadian company, coast to coast
            — has been connecting communities with pavement technologies that do more than carry
            traffic. They carry identity.
          </p>
        </div>
      </div>

      {/* ── Stats Bar ───────────────────────────────────────── */}
      <div style={{ background: "#141b2d", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {stats.map((s) => (
              <div
                key={s.label}
                className="py-8 md:py-10 px-4 sm:px-6 flex flex-col items-center text-center"
              >
                <span className="text-4xl md:text-5xl font-bold mb-2" style={{ color: "#f97316" }}>
                  {s.value}
                </span>
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#9CA3AF" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Story ───────────────────────────────────────────── */}
      <div className="py-28" style={{ background: "#0f1620" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: "#ffffff" }}>Our Story</h2>
              <div className="space-y-4 text-base leading-relaxed" style={{ color: "#e0e0e0" }}>
                <p>
                  HUB Surface Systems was founded on a simple belief: streets don&apos;t have to be grey.
                  For decades, Canadian cities treated pavement as pure utility — functional, forgettable,
                  interchangeable. We saw an opportunity to change that, starting with StreetPrint
                  decorative stamped asphalt in the mid-1990s.
                </p>
                <p>
                  Over thirty years, we grew our portfolio to address every surface challenge a Canadian
                  municipality might face — from high-traffic arterial markings in York Region to
                  decorative community crosswalks at UBC to Indigenous art installations on BC ferries.
                  Every city, every application, every climate.
                </p>
                <p>
                  Today, HUB operates from two regional offices — East in Milton, Ontario, and West in
                  Ladysmith, British Columbia — backed by a network of certified applicators trained and
                  authorized by HUB to install each system to spec. That credentialed installer program
                  is what turns a quality product into a quality outcome.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: "#ffffff" }}>Our Mission</h2>
              <p
                className="text-xl leading-relaxed mb-4"
                style={{ color: "#ffffff", borderLeft: "3px solid #f97316", paddingLeft: "24px" }}
              >
                &ldquo;Every surface tells a story. We give communities the language to write it.&rdquo;
              </p>
              <p className="text-sm mb-8" style={{ color: "#5a5a5a", paddingLeft: "24px" }}>
                — HUB Surface Systems
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#e0e0e0" }}>
                York Region. City of Toronto. City of Vancouver. UBC. The City of Sechelt.
                When you walk through a Canadian city and feel something — when a crosswalk
                catches your eye, when a plaza feels like it belongs — there&apos;s a chance we were
                there. That&apos;s what thirty years looks like on the ground.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Values — 3 columns ─────────────────────────────── */}
      <div style={{ background: "#141b2d", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-12" style={{ color: "#f97316" }}>
            What We Stand For
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
            {values.map((v, i) => (
              <div
                key={v.heading}
                className="p-8 md:p-10"
                style={{
                  background: "#1a1e28",
                  borderRight: i < values.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <div className="w-8 h-[2px] mb-6" style={{ background: "#f97316" }} />
                <h3 className="text-lg font-bold mb-4" style={{ color: "#ffffff" }}>{v.heading}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#8b8b8b" }}
                  dangerouslySetInnerHTML={{ __html: v.body }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Offices ─────────────────────────────────────────── */}
      <div className="py-20" style={{ background: "#0f1620" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10" style={{ color: "#ffffff" }}>Regional Offices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                region: "West Office",
                city: "Ladysmith, British Columbia",
                contact: "Cleve Stordy",
                email: "cleve.stordy@hubss.com",
                phone: "604-309-8212",
                provinces: ["BC", "AB", "SK", "NT", "YT", "NU"],
              },
              {
                region: "East Office",
                city: "Milton, Ontario",
                contact: "Doug Bain",
                email: "doug.bain@hubss.com",
                phone: "416-540-9287",
                provinces: ["ON", "QC", "NS", "NB", "PE", "NL", "MB"],
              },
            ].map((office) => (
              <div
                key={office.region}
                className="p-8 rounded-xl relative overflow-hidden"
                style={{ background: "#1a1e28", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "#f97316" }} />
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#f97316" }}>
                  {office.region}
                </p>
                <h3 className="text-xl font-bold mb-1" style={{ color: "#ffffff" }}>{office.city}</h3>
                <p className="text-sm mb-5" style={{ color: "#8b8b8b" }}>{office.contact}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {office.provinces.map((prov) => (
                    <span
                      key={prov}
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: "rgba(249,115,22,0.10)", color: "#f97316", border: "1px solid rgba(249,115,22,0.20)" }}
                    >
                      {prov}
                    </span>
                  ))}
                </div>
                <a
                  href={`mailto:${office.email}`}
                  className="text-sm block mb-1.5 transition-colors hover:text-[#f97316]"
                  style={{ color: "#e0e0e0" }}
                >
                  {office.email}
                </a>
                <a
                  href={`tel:${office.phone.replace(/-/g, "")}`}
                  className="text-sm transition-colors hover:text-[#f97316]"
                  style={{ color: "#e0e0e0" }}
                >
                  {office.phone}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-8" style={{ color: "#9CA3AF" }}>
            Serving all 10 provinces and 3 territories
          </p>
        </div>
      </div>

      {/* ── Why HUB ─────────────────────────────────────────── */}
      <div className="py-28" style={{ background: "#0d1117" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12" style={{ color: "#ffffff" }}>Why HUB</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((d) => (
              <div
                key={d.title}
                className="p-8 rounded-xl"
                style={{ background: "#1a1e28", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="flex items-center justify-center rounded-lg mb-5 flex-shrink-0"
                  style={{ width: 44, height: 44, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: "#ffffff" }}>{d.title}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: "#8b8b8b" }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Manufacturer Partners ────────────────────────────── */}
      <div className="py-20" style={{ background: "#0f1620" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
            Manufacturer Partners
          </p>
          <h2 className="text-3xl font-bold mb-6" style={{ color: "#ffffff" }}>
            Backed by Industry Leaders
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mb-8" style={{ color: "#8b8b8b" }}>
            HUB is an authorized distributor and applicator partner for the manufacturers behind
            our core product systems — giving clients access to the broadest decorative pavement
            portfolio in Canada, with direct manufacturer technical support.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "GAF",
                sub: "",
                logo: "/images/partners/gaf-logo.png",
                logoW: 80,
                logoH: 40,
                products: ["StreetBond", "StreetBond Pro", "StreetBondSR", "DuraShield", "MMAX"],
                desc: "GAF supplies the coloured pavement coating systems behind thousands of HUB decorative surface installations across Canada — including StreetBond, StreetBondSR solar-reflective coatings, DuraShield protective sealers, and MMAX MMA rapid-cure systems. Documented colour retention across hundreds of Canadian municipalities.",
                accent: "#E05C1A",
              },
              {
                name: "Ennis-Flint",
                sub: "A PPG Company",
                logo: "/images/partners/ppg-logo.svg",
                logoW: 80,
                logoH: 40,
                products: ["TrafficPatterns", "TrafficPatternsXD", "PreMark", "AirMark", "DuraTherm"],
                desc: "Ennis-Flint (a PPG company) is the manufacturer behind HUB's full thermoplastics range — including TrafficPatterns, TrafficPatternsXD, PreMark, AirMark, and DuraTherm. Their preformed thermoplastic systems are the gold standard for high-durability pavement markings across Canada.",
                accent: "#0057A8",
              },
            ].map((partner) => (
              <div
                key={partner.name}
                className="rounded-xl relative overflow-hidden"
                style={{ background: "#1a1e28", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Accent top line */}
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: partner.accent }} />

                {/* Logo header */}
                <div
                  className="flex items-center justify-between gap-6 px-8 py-6"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ background: "#ffffff", width: 120, height: 60, padding: "10px 16px" }}
                  >
                    <Image
                      src={partner.logo}
                      width={partner.logoW}
                      height={partner.logoH}
                      alt={partner.name}
                      style={{ maxHeight: 36, width: "auto", objectFit: "co