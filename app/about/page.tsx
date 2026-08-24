import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import { getSanityPageContent } from "@/lib/sanity.queries";

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

// Fallbacks used if the Sanity page doc has no matching field. These are also
// the canonical copies for the sync script (scripts/sync-pages-to-sanity.ts).
const STORY_FALLBACK: string[] = [
  "HUB Surface Systems was founded on a simple belief: streets don't have to be grey. For decades, Canadian cities treated pavement as pure utility — functional, forgettable, interchangeable. We saw an opportunity to change that, starting with StreetPrint decorative stamped asphalt in the mid-1990s.",
  "Over thirty years, we grew our portfolio to address every surface challenge a Canadian municipality might face — from high-traffic arterial markings in York Region to decorative community crosswalks at UBC to Indigenous art installations on BC ferries. Every city, every application, every climate.",
  "Today, HUB operates from two regional offices — East in Milton, Ontario, and West in Ladysmith, British Columbia — backed by a network of certified applicators trained and authorized by HUB to install each system to spec. That credentialed installer program is what turns a quality product into a quality outcome.",
];

const STORY_ASIDE_FALLBACK =
  "York Region. City of Toronto. City of Vancouver. UBC. The City of Sechelt. When you walk through a Canadian city and feel something — when a crosswalk catches your eye, when a plaza feels like it belongs — there's a chance we were there. That's what thirty years looks like on the ground.";

const VALUES_FALLBACK = [
  { heading: "What We Build",     body: "Decorative crosswalks, civic plazas, community murals, transit lanes, private driveways, and parks. Surface solutions that carry meaning — from high-visibility school zones in Milton to Indigenous art installations in Sechelt." },
  { heading: "Who We Build For",  body: "Municipalities, landscape architects, urban planners, developers, and certified contractors across every Canadian province. If it's a surface that people walk, drive, or gather on — we have a system for it." },
  { heading: "Why It Matters",    body: "Beautiful streets make walkable cities. Legible surfaces slow cars. Identity-rich public spaces build community. This isn't just infrastructure — it's the civic layer that tells a city it's worth caring about." },
];

const DIFFERENTIATORS_FALLBACK = [
  { title: "Flexibility vs Concrete",          desc: "Asphalt-based systems flex with Canada's freeze-thaw cycles, outlasting concrete alternatives by 2–3x in northern climates." },
  { title: "6–8 Years of Proven Performance",  desc: "Thermoplastic and MMA markings deliver 6–8 years of high-visibility service life — documented across hundreds of Canadian municipalities in every climate." },
  { title: "Vision Zero Aligned",              desc: "Every HUB product is designed to support Vision Zero frameworks — from retroreflective crosswalk markings to high-contrast bike lane systems." },
  { title: "High-Visibility by Design",        desc: "Tactile and high-contrast marking solutions engineered for pedestrian safety and legibility in every lighting condition and season." },
  { title: "20-Year Performance",              desc: "StreetPrint and StreetBond installations are engineered for 20-year colour retention — documented across hundreds of Canadian municipalities." },
  { title: "Climate-Tested",                   desc: "Every system is stress-tested for freeze-thaw extremes, de-icing salts, and snowplow blades — from coastal BC to the Great Lakes." },
];

const PARTNERS_INTRO_FALLBACK =
  "HUB is an authorized distributor and applicator partner for the manufacturers behind our core product systems — giving clients access to the broadest decorative pavement portfolio in Canada, with direct manufacturer technical support and specification backup.";

const PARTNER_DESC_FALLBACK: Record<string, string> = {
  "gaf":          "GAF is the manufacturer behind HUB's coloured pavement coating systems — StreetBond, StreetBondSR (solar reflective), DuraShield, and MMAX. Their coatings technology has been the foundation of thousands of decorative surface installations across Canada.",
  "ennis-flint":  "Ennis-Flint (a PPG company) is the manufacturer behind HUB's full thermoplastics range — including TrafficPatterns, TrafficPatternsXD, PreMark, AirMark, DuraTherm, and DecoMark. Their preformed thermoplastic systems are the gold standard for high-durability pavement markings across Canada.",
};

export default async function AboutPage() {
  const sanityPage = await getSanityPageContent("about").catch(() => null);
  const hero = {
    eyebrow:    sanityPage?.aboutHero?.eyebrow    ?? "Canadian-Operated Since 1999 · All 10 Provinces",
    heading:    sanityPage?.aboutHero?.heading    ?? "The people who made your city look like your city.",
    subheading: sanityPage?.aboutHero?.subheading ?? "For over thirty years, HUB Surface Systems — a proudly Canadian company, coast to coast — has been connecting communities with pavement technologies that do more than carry traffic. They carry identity.",
  };
  const missionQuote = sanityPage?.aboutMission ?? "Every surface tells a story. We give communities the language to write it.";

  const storyParagraphs = sanityPage?.aboutStory?.length ? sanityPage.aboutStory : STORY_FALLBACK;
  const storyAside      = sanityPage?.aboutStoryAside ?? STORY_ASIDE_FALLBACK;
  const values          = sanityPage?.aboutValues?.length ? sanityPage.aboutValues : VALUES_FALLBACK;
  const differentiators = sanityPage?.aboutWhyHub?.length ? sanityPage.aboutWhyHub : DIFFERENTIATORS_FALLBACK;
  const partnersIntro   = sanityPage?.aboutPartnersIntro ?? PARTNERS_INTRO_FALLBACK;
  const sanityPartnerDescs = new Map<string, string>(
    (sanityPage?.aboutPartners ?? []).map((p) => [p.key, p.desc])
  );
  const partnerDesc = (key: string): string =>
    sanityPartnerDescs.get(key) ?? PARTNER_DESC_FALLBACK[key] ?? "";

  return (
    <main style={{ background: "#0f1620", minHeight: "100vh" }}>
      <Nav />

      {/* ── Hero ──────────────────────────────── */}
      <div className="relative overflow-hidden min-h-[500px]" style={{ background: "#0d1117" }}>
        <Image
          src="/images/hero/hero-3.jpg"
          alt="HUB Surface Systems — Canadian decorative pavement specialists"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/72 pointer-events-none" />
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none z-10"
          style={{ background: "linear-gradient(90deg, #F97316 0%, transparent 60%)" }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-36 pb-16 sm:pb-24 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 9600 4800"
              width={28}
              height={14}
              aria-label="Flag of Canada"
              style={{ display: "block", flexShrink: 0, borderRadius: 2, boxShadow: "0 1px 4px rgba(0,0,0,0.45)" }}
            >
              <path fill="#f00" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z" />
              <path fill="#fff" d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z" />
            </svg>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "#f97316" }}>
              {hero.eyebrow}
            </p>
          </div>
          <h1
            className="font-black mb-6 max-w-4xl"
            style={{
              color: "#ffffff",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            {hero.heading}
          </h1>
          <p className="text-xl leading-relaxed max-w-2xl" style={{ color: "#8b8b8b" }}>
            {hero.subheading}
          </p>
        </div>
      </div>

      {/* ── Stats Bar ───────────────────────── */}
      <div style={{ background: "#141b2d", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
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

      {/* ── Story ──────────────────────────────── */}
      <div className="py-28" style={{ background: "#0f1620" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: "#ffffff" }}>Our Story</h2>
              <div className="space-y-4 text-base leading-relaxed" style={{ color: "#e0e0e0" }}>
                {storyParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <div>
              <div className="rounded-xl overflow-hidden mb-8 relative" style={{ height: 260 }}>
                <Image
                  src="/images/applications/community-branding/community-branding-08.jpg"
                  alt="HUB Surface Systems — UBC community identity crosswalk installation"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(13,17,23,0.7) 100%)" }} />
              </div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: "#ffffff" }}>Our Mission</h2>
              <p
                className="text-xl leading-relaxed mb-4"
                style={{ color: "#ffffff", borderLeft: "3px solid #f97316", paddingLeft: "24px" }}
              >
                &ldquo;{missionQuote}&rdquo;
              </p>
              <p className="text-sm mb-8" style={{ color: "#5a5a5a", paddingLeft: "24px" }}>
                — HUB Surface Systems
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#e0e0e0" }}>
                {storyAside}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Values ────────────────────────────── */}
      <div style={{ background: "#141b2d", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-12" style={{ color: "#f97316" }}>
            What We Stand For
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y divide-white/[0.06] md:divide-y-0 md:divide-x md:divide-white/[0.06]" style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
            {values.map((v) => (
              <div key={v.heading} className="p-8 md:p-10" style={{ background: "var(--bg-card)" }}>
                <div className="w-8 h-[2px] mb-6" style={{ background: "#f97316" }} />
                <h3 className="text-lg font-bold mb-4" style={{ color: "#ffffff" }}>{v.heading}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#8b8b8b" }} dangerouslySetInnerHTML={{ __html: v.body }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Offices ───────────────────────────── */}
      <div className="py-20" style={{ background: "#0f1620" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10" style={{ color: "#ffffff" }}>Regional Offices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { region: "West Office", city: "Ladysmith, British Columbia", contact: "Cleve Stordy", email: "cleve.stordy@hubss.com", phone: "604-309-8212", provinces: ["BC", "AB", "SK", "NT", "YT", "NU"] },
              { region: "East Office", city: "Milton, Ontario", contact: "Doug Bain", email: "doug.bain@hubss.com", phone: "416-540-9287", provinces: ["ON", "QC", "NS", "NB", "PE", "NL", "MB"] },
            ].map((office) => (
              <div key={office.region} className="p-8 rounded-xl relative overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "#f97316" }} />
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#f97316" }}>{office.region}</p>
                <h3 className="text-xl font-bold mb-1" style={{ color: "#ffffff" }}>{office.city}</h3>
                <p className="text-sm mb-5" style={{ color: "#8b8b8b" }}>{office.contact}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {office.provinces.map((prov) => (
                    <span key={prov} className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "rgba(249,115,22,0.10)", color: "#f97316", border: "1px solid rgba(249,115,22,0.20)" }}>{prov}</span>
                  ))}
                </div>
                <a href={`mailto:${office.email}`} className="text-sm flex items-center transition-colors hover:text-[#f97316]" style={{ color: "#e0e0e0", minHeight: 40 }}>{office.email}</a>
                <a href={`tel:${office.phone.replace(/-/g, "")}`} className="text-sm flex items-center transition-colors hover:text-[#f97316]" style={{ color: "#e0e0e0", minHeight: 40 }}>{office.phone}</a>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-8" style={{ color: "#9CA3AF" }}>Serving all 10 provinces and 3 territories</p>
        </div>
      </div>

      {/* ── Why HUB ───────────────────────────── */}
      <div className="py-28" style={{ background: "#0d1117" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12" style={{ color: "#ffffff" }}>Why HUB</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((d) => (
              <div key={d.title} className="p-8 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-8 h-0.5 mb-5" style={{ background: "#f97316" }} />
                <h3 className="font-bold text-lg mb-3" style={{ color: "#ffffff" }}>{d.title}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: "#8b8b8b" }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Manufacturer Partners ────────────────────── */}
      <div className="py-20" style={{ background: "#0f1620" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>Manufacturer Partners</p>
          <h2 className="text-3xl font-bold mb-6" style={{ color: "#ffffff" }}>Backed by Industry Leaders</h2>
          <p className="text-base leading-relaxed max-w-2xl mb-8" style={{ color: "#8b8b8b" }}>
            {partnersIntro}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "GAF",         key: "gaf",         sub: "",                logo: "/images/partners/gaf-logo.png", logoW: 80, logoH: 40, products: ["StreetBond", "StreetBondSR", "DuraShield", "MMAX"],                                                  desc: partnerDesc("gaf"),         accent: "#E05C1A" },
              { name: "Ennis-Flint", key: "ennis-flint", sub: "A PPG Company",   logo: "/images/partners/ppg-logo.svg", logoW: 80, logoH: 40, products: ["TrafficPatterns", "TrafficPatternsXD", "PreMark", "AirMark", "DuraTherm", "DecoMark"],          desc: partnerDesc("ennis-flint"), accent: "#0057A8" },
            ].map((partner) => (
              <div key={partner.name} className="rounded-xl relative overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: partner.accent }} />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-8 py-5 sm:py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: "#ffffff", width: 100, height: 52, padding: "8px 14px" }}>
                    <Image src={partner.logo} width={partner.logoW} height={partner.logoH} alt={partner.name} style={{ maxHeight: 32, width: "auto", objectFit: "contain" }} unoptimized />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.products.map((p) => (
                      <span key={p} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${partner.accent}18`, color: partner.accent, border: `1px solid ${partner.accent}30` }}>{p}</span>
                    ))}
                  </div>
                </div>
                <div className="px-5 sm:px-8 py-5 sm:py-6">
                  <h3 className="text-2xl font-bold mb-1" style={{ color: "#ffffff" }}>{partner.name}</h3>
                  {partner.sub && <p className="text-xs font-semibold tracking-wide uppercase mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>{partner.sub}</p>}
                  {!partner.sub && <div className="mb-3" />}
                  <p className="text-sm leading-relaxed" style={{ color: "#8b8b8b" }}>{partner.desc}</p>
                </div>
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
