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
  { value: "500+", label: "Projects Completed" },
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
  { title: "Flexibility vs Concrete", desc: "Asphalt-based systems flex with Canada's freeze-thaw cycles, outlasting concrete alternatives by 2–3x in northern climates." },
  { title: "6–8x Longer Than Paint", desc: "Thermoplastic and MMA markings deliver 6–8 years of service life versus 12–18 months for standard traffic paint." },
  { title: "Vision Zero Aligned", desc: "Every HUB product is designed to support Vision Zero frameworks — from retroreflective crosswalk markings to high-contrast bike lane systems." },
  { title: "AODA Compliant", desc: "Our tactile and high-contrast marking solutions meet or exceed AODA accessibility requirements across all provinces." },
  { title: "20-Year Durability", desc: "StreetPrint and StreetBond installations carry a 20-year colour retention warranty — the best in the industry." },
  { title: "Canadian-Specific", desc: "Every system is engineered and tested for Canadian climate extremes, from Ladysmith BC to York Region ON." },
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
          <Image src="/images/hub-wheel-orange.png" alt="" width={520} height={520} unoptimized />
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
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#5a5a5a" }}>
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
                region: "East Office",
                city: "Milton, Ontario",
                contact: "Doug Bain",
                email: "doug.bain@hubss.com",
                phone: "416-540-9287",
                provinces: ["ON", "QC", "NS", "NB", "PE", "NL", "MB"],
              },
              {
                region: "West Office",
                city: "Ladysmith, British Columbia",
                contact: "Cleve Stordy",
                email: "cleve.stordy@hubss.com",
                phone: "604-309-8212",
                provinces: ["BC", "AB", "SK", "NT", "YT", "NU"],
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
          <p className="text-center text-sm mt-8" style={{ color: "#5a5a5a" }}>
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
                <div className="w-8 h-0.5 mb-5" style={{ background: "#f97316" }} />
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
            portfolio in Canada, with direct manufacturer technical support and warranty backing.
          </p>

          <div className="py-8 mb-8 border-t border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-center mb-8" style={{ color: "#3a3a3a" }}>
              Manufacturer Partners
            </p>
            <div className="flex items-center justify-center gap-20 flex-wrap">
              <div className="flex items-center justify-center w-32 h-16">
                <Image
                  src="/images/partners/ppg-logo.svg"
                  width={100}
                  height={40}
                  alt="PPG"
                  className="opacity-40 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300 object-contain"
                  style={{ maxHeight: "40px", width: "auto" }}
                  unoptimized
                />
              </div>
              <div className="flex items-center justify-center w-32 h-16">
                <Image
                  src="/images/partners/gaf-logo.png"
                  width={100}
                  height={40}
                  alt="GAF"
                  className="opacity-40 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300 object-contain"
                  style={{ maxHeight: "40px", width: "auto" }}
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "PPG Pavement Technologies",
                role: "StreetBond · StreetPrint · DuraTherm",
                desc: "PPG is the world's largest coatings manufacturer. Their Pavement Technologies division developed StreetBond coloured pavement coatings and the StreetPrint decorative stamped asphalt system — the products behind thousands of HUB installations across Canada.",
                accent: "#0057A8",
              },
              {
                name: "GAF Ennis-Flint",
                role: "TrafficPatterns · TrafficPatternsXD · PreMark · AirMark",
                desc: "Ennis-Flint is North America's largest supplier of roadway markings and traffic safety products. Their preformed thermoplastic systems — including TrafficPatterns, TrafficPatternsXD, and AirMark — are the gold standard for high-durability pavement markings across Canada.",
                accent: "#E05C1A",
              },
            ].map((partner) => (
              <div
                key={partner.name}
                className="p-8 rounded-xl relative overflow-hidden"
                style={{ background: "#1a1e28", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: partner.accent }} />
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: partner.accent }}>
                  {partner.role}
                </p>
                <h3 className="text-xl font-bold mb-4" style={{ color: "#ffffff" }}>
                  {partner.name}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8b8b8b" }}>
                  {partner.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LunchLearn />
      <Footer />
    </main>
  );
}
