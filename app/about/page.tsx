import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";

export const metadata = buildMetadata({
  title: "About HUB Surface Systems",
  description: "30 years enabling Canadian streets, crosswalks, and public spaces. Two regional offices — Milton, Ontario and Ladysmith, BC — serving all 10 provinces.",
  slug: "about",
});

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
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* HUB Wheel watermark — bottom-right of hero, very subtle */}
        <div
          className="absolute bottom-0 right-0 pointer-events-none"
          style={{ width: 460, height: 460, opacity: 0.07 }}
          aria-hidden="true"
        >
          <Image
            src="/images/hub-wheel-orange.png"
            alt=""
            width={460}
            height={460}
            unoptimized
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 relative">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
            About HUB Surface Systems
          </p>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight max-w-3xl" style={{ color: "var(--text-primary)" }}>
            Thirty Years of Making Canadian Streets Better
          </h1>
          <p className="text-xl leading-relaxed max-w-2xl" style={{ color: "var(--text-body)" }}>
            HUB Surface Systems connects Canadian design professionals with the world&apos;s leading pavement technologies — and provides the local expertise to specify and install them right.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="py-28 bg-asphalt-subtle" style={{ background: "var(--bg-slate)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Our Story</h2>
              <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--text-body)" }}>
                <p>
                  HUB Surface Systems was founded with a simple belief: streets don&apos;t have to be grey.
                  Canadian cities had spent decades treating pavement as pure utility — functional,
                  forgettable, interchangeable. We saw an opportunity to change that.
                </p>
                <p>
                  Starting with StreetPrint decorative stamped asphalt in the mid-1990s, we grew
                  our product portfolio to address every surface application challenge a Canadian
                  municipality might face — from high-traffic arterial markings to decorative
                  community crosswalks to Indigenous art installations.
                </p>
                <p>
                  Today, HUB operates from two regional offices — East in Milton, Ontario, and West
                  in Ladysmith, British Columbia — serving municipalities, developers, and contractors
                  in every province. Our products have enabled thousands of intersections, plazas,
                  driveways, and public spaces across the country.
                </p>
                <p>
                  Behind every HUB installation is a network of certified applicators — trained, assessed,
                  and authorized by HUB to install each product system to spec. This credentialed installer
                  program is what turns a quality product into a quality outcome, and what backs every
                  warranty we issue.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Our Mission</h2>
              <p className="text-xl leading-relaxed mb-4" style={{ color: "var(--text-primary)", borderLeft: "3px solid #f97316", paddingLeft: "24px" }}>
                &ldquo;Every surface tells a story. We give communities the language to write it.&rdquo;
              </p>
              <p className="text-sm mb-8" style={{ color: "var(--text-muted)", paddingLeft: "24px" }}>
                — HUB Surface Systems
              </p>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-body)" }}>
                We believe that the quality of a community&apos;s public spaces reflects its values.
                When streets are beautiful, accessible, and legible, people use them differently —
                they walk more, drive slower, and feel more connected to where they live.
                Every HUB installation is a contribution to a more livable Canada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Offices */}
      <div className="py-20" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10" style={{ color: "var(--text-primary)" }}>Regional Offices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                region: "East Office",
                territory: "Eastern Canada",
                city: "Milton, Ontario",
                contact: "Doug Bain",
                email: "doug.bain@hubss.com",
                phone: "416-540-9287",
                provinces: ["ON", "QC", "NS", "NB", "PE", "NL", "MB"],
              },
              {
                region: "West Office",
                territory: "Western Canada",
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
                style={{ background: "var(--bg-card-surface)", border: "1px solid var(--border-subtle)" }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: "#f97316" }}
                />
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#f97316" }}>
                  {office.region}
                </p>
                <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>{office.city}</h3>
                <p className="text-sm mb-5" style={{ color: "#d1d5db" /* keep as-is */ }}>{office.contact}</p>

                {/* Province tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {office.provinces.map((prov) => (
                    <span
                      key={prov}
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" }}
                    >
                      {prov}
                    </span>
                  ))}
                </div>

                <a
                  href={`mailto:${office.email}`}
                  className="text-sm block mb-1.5 transition-colors hover:text-[#f97316]"
                  style={{ color: "#d1d5db" /* keep as-is */ }}
                >
                  {office.email}
                </a>
                <a
                  href={`tel:${office.phone.replace(/-/g, "")}`}
                  className="text-sm transition-colors hover:text-[#f97316]"
                  style={{ color: "#d1d5db" /* keep as-is */ }}
                >
                  {office.phone}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-8" style={{ color: "#d1d5db" /* keep as-is */ }}>
            Serving all 10 provinces and 3 territories
          </p>
        </div>
      </div>

      {/* Why HUB */}
      <div className="py-28" style={{ background: "var(--bg-slate)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12" style={{ color: "var(--text-primary)" }}>Why HUB</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((d) => (
              <div key={d.title} className="p-8 rounded-xl" style={{ background: "var(--bg-card-surface)", border: "1px solid var(--border-subtle)" }}>
                <div className="w-8 h-0.5 mb-5" style={{ background: "#f97316" }} />
                <h3 className="font-bold text-lg mb-3" style={{ color: "var(--text-primary)" }}>{d.title}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-body)" }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manufacturer Partners */}
      <div className="py-20" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
            Manufacturer Partners
          </p>
          <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
            Backed by Industry Leaders
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mb-8" style={{ color: "var(--text-body)" }}>
            HUB Surface Systems is an authorized distributor and applicator partner for the manufacturers
            behind our core product systems. These partnerships give our clients access to the broadest
            product portfolio in the Canadian decorative pavement market — with direct manufacturer
            technical support and warranty backing.
          </p>

          {/* Trusted Partners logo strip */}
          <div className="py-8 mb-8 border-t border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-center mb-6" style={{ color: "var(--text-faint)" }}>
              Trusted Partners
            </p>
            <div className="flex items-center justify-center gap-12 flex-wrap">
              <Image
                src="/images/partners/ppg-logo.svg"
                alt="PPG Pavement Technologies"
                width={120}
                height={48}
                className="opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 object-contain"
                unoptimized
              />
              <Image
                src="/images/partners/gaf-logo.png"
                alt="GAF Ennis-Flint"
                width={120}
                height={48}
                className="opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 object-contain"
                unoptimized
              />
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
                style={{ background: "var(--bg-card-surface)", border: "1px solid var(--border-subtle)" }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: partner.accent }}
                />
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: partner.accent }}>
                  {partner.role}
                </p>
                <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                  {partner.name}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-body)" }}>
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
