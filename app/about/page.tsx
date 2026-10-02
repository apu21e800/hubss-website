import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import { getSanityPageContent } from "@/lib/sanity.queries";
import { toPhoto } from "@/lib/photos";
import PhotoImage from "@/components/ui/PhotoImage";

// Sanity is the CMS for this page's copy, so the page has to be allowed to go
// and re-read it. Without a revalidate the route is prerendered once at build
// and never asks Sanity again — an editor's change sits invisible until the
// next deploy. One hour, matching the product pages.
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "About HUB Surface Systems",
  description: "27 years making Canadian streets better. Two regional offices serving every province. We're the people who made your city look like your city.",
  slug: "about",
});

const stats = [
  // The catalogue prints "27 years"; the site prints "Since 1999" in six
  // other places. Both cannot be true of a company that says 30+.
  { value: "27", label: "Years in business" },
  { value: "1,000+", label: "Projects completed" },
  { value: "10", label: "Provinces served" },
  { value: "2", label: "Regional offices" },
];

// Fallbacks used if the Sanity page doc has no matching field. These are also
// the canonical copies for the sync script (scripts/sync-pages-to-sanity.ts).
//
// HEADS UP: the Sanity doc `page-about` currently HAS these fields, so Sanity
// wins on the live page and editing this file alone changes nothing there.
// Corrections made here (Sep 2026: "over thirty years" → since 1999, and an
// "Indigenous art installations on BC ferries" line that no HUB document
// supports) reach hubss.com only when someone runs the sync script with a
// SANITY_API_WRITE_TOKEN, or edits the doc in Sanity Studio.
const STORY_FALLBACK: string[] = [
  "HUB Surface Systems was founded on a simple belief: streets don't have to be grey. For decades, Canadian cities treated pavement as pure utility, functional and forgettable. We saw an opportunity to change that, and built the company around StreetPrint decorative stamped asphalt: the original stamped asphalt system, a Canadian invention installed here since 1992.",
  "Since 1999 we have grown the portfolio to address every surface challenge a Canadian municipality might face: high-traffic transit corridors in York Region and London, decorative community crosswalks at UBC, Indigenous recognition artwork in Sechelt, Vancouver and Burnaby.",
  "Today, HUB operates from two regional offices (East in Milton, Ontario, and West in Ladysmith, British Columbia), backed by a network of certified applicators trained and authorized by HUB to install each system to spec. That credentialed installer program is what turns a quality product into a quality outcome.",
];

const STORY_ASIDE_FALLBACK =
  "York Region, the City of Toronto, the City of Vancouver, UBC, the City of Sechelt. When you walk through a Canadian city and feel something, when a crosswalk catches your eye, when a plaza feels like it belongs, there's a chance we were there. That's what a thousand projects look like on the ground.";

const VALUES_FALLBACK = [
  { heading: "What we build",     body: "Decorative crosswalks, civic plazas, community murals, transit lanes, private driveways, and parks. Surfaces that carry meaning, from high-visibility school zones in Milton to Indigenous art installations in Sechelt." },
  { heading: "Who we build for",  body: "Municipalities, landscape architects, urban planners, developers, and certified contractors across every Canadian province. If it's a surface that people walk, drive, or gather on, we have a system for it." },
  { heading: "Why it matters",    body: "Beautiful streets make walkable cities. Legible surfaces slow cars. Identity-rich public spaces build community. This is the civic layer that tells a city it's worth caring about." },
];

// "Why HUB", QA of 27 Sep 2026. The two service-life cards are one card: the
// per-system figures from the Idea Book, as CLAUDE.md lists them, PreMark
// included. The other card offered PreMark's 6–8 years as a reason on its own
// and ended on a note to ourselves ("Both figures are the Idea Book's").
// Claims no HUB document supports were cut back to what the book says: no
// "2–3x" over concrete, no "every HUB product" for Vision Zero, no
// "stress-tested". The winter card is the book's own lines (StreetPrint,
// DuraTherm, the crosswalk spread). docs/COPY-FOR-DOUG.md §4 proposed the
// merge and the concrete cut to Doug; Sanity (aboutWhyHub) still shows the
// old six until it is synced.
const DIFFERENTIATORS_FALLBACK = [
  { title: "Flexibility vs concrete",          desc: "Asphalt-based systems flex with Canada's freeze-thaw cycles." },
  { title: "Vision Zero aligned",              desc: "HUB's marking systems support Vision Zero frameworks, from retroreflective crosswalk markings to high-contrast bike lane systems." },
  { title: "High-visibility by design",        desc: "Tactile and high-contrast marking systems engineered for pedestrian safety and legibility in every lighting condition and season." },
  { title: "Service life, by system",          desc: "StreetPrint 10–20 years, TrafficPatternsXD 10+, TrafficPatterns 8+, StreetBond 8+, PreMark 6–8. Quoted per system, because they do not wear the same." },
  { title: "Built for winter maintenance",     desc: "StreetPrint and DuraTherm sit flush with the road, with nothing for a plow blade to catch, and preformed thermoplastic holds its skid resistance and colour through snowplow cycles and de-icing seasons." },
];

const PARTNERS_INTRO_FALLBACK =
  "HUB is an authorized distributor and applicator partner for the manufacturers behind our core product systems, giving clients access to the broadest decorative pavement portfolio in Canada, with direct manufacturer technical support and specification backup.";

const PARTNER_DESC_FALLBACK: Record<string, string> = {
  "gaf":          "GAF is the manufacturer behind HUB's coloured pavement coating systems: StreetBond, StreetBondSR (solar reflective), DuraShield, and MMAX. Their coatings technology has been the foundation of thousands of decorative surface installations across Canada.",
  "ennis-flint":  "Ennis-Flint (a PPG company) is the manufacturer behind HUB's full thermoplastics range, including TrafficPatterns, TrafficPatternsXD, PreMark, AirMark, DuraTherm, and DecoMark. Their preformed thermoplastic systems are the gold standard for high-durability pavement markings across Canada.",
};

export default async function AboutPage() {
  const sanityPage = await getSanityPageContent("about");
  const hero = {
    eyebrow:    sanityPage?.aboutHero?.eyebrow    ?? "Canadian-operated since 1999 · All 10 provinces",
    heading:    sanityPage?.aboutHero?.heading    ?? "The people who made your city look like your city.",
    subheading: sanityPage?.aboutHero?.subheading ?? "Since 1999, HUB Surface Systems, a proudly Canadian company, has been connecting communities coast to coast with pavement technologies that carry identity as well as traffic.",
  };
  const missionQuote = sanityPage?.aboutMission ?? "Every surface tells a story. We give communities the language to write it.";
  // The hero photo from Studio; /images/hero/hero-3.jpg when it's empty.
  const aboutHeroPhoto = toPhoto(sanityPage?.aboutHeroImage, "HUB Surface Systems, decorative pavement across Canada") ?? {
    src: "/images/hero/hero-3.jpg",
    alt: "HUB Surface Systems, decorative pavement across Canada",
  };

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
    /* Paper, like /resources. The lesson from the product pages is that a
       page commits or it does not — three light bands inside a dark page read
       as a mistake, while a page that goes light keeps its own rhythm because
       the paper surface redefines every background token (--bg-dark becomes
       #EFEDE7, --bg-section-asphalt #F3F1EB). The alternating sections still
       alternate; they just do it in cream instead of charcoal.

       The photo hero below keeps data-hero, which forces the dark token set —
       white type over a photograph needs it. */
    <main data-surface="paper" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Nav />

      {/* ── Hero ──────────────────────────────── */}
      <div data-hero className="relative overflow-hidden min-h-[500px]" style={{ background: "var(--bg-dark)" }}>
        <PhotoImage
          src={aboutHeroPhoto.src}
          alt={aboutHeroPhoto.alt}
          fill
          className="object-cover object-center hero-pop"
          priority
          sizes="100vw"
        />
        {/* Optics (Vern, 26 Sep 2026): a flat 72% black over the photograph
            read as mud. A scrim that is light at the top, dark at the foot
            and on the left where the type sits, so the picture shows.
            QA, 27 Sep 2026: the subtext fell under 4.5:1 over the paler
            pavers, so the lower half now darkens sooner; the top is as it was. */}
        {/* 28 Sep 2026: the top third lighter again, so the photograph's
            colour shows above the type; the foot keeps the QA's darkness. */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(8,13,22,0.16) 0%, rgba(8,13,22,0.40) 42%, rgba(8,13,22,0.90) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(92deg, rgba(8,13,22,0.52) 0%, rgba(8,13,22,0.22) 45%, transparent 70%)" }} />
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none z-10"
          style={{ background: "linear-gradient(90deg, #F97316 0%, transparent 60%)" }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-36 pb-16 sm:pb-24 relative z-10">
          {/* The eyebrow sits on its own dark backing. On a phone it lands on
              the pale sky at the top of the photograph, where orange measured
              well under 4.5:1 (QA, 27 Sep 2026); a scrim dark enough to fix
              that would darken the whole sky. The backing holds whatever
              photo Studio supplies. */}
          <div
            className="flex w-fit max-w-full items-center gap-3 mb-4 rounded-md px-3 py-2"
            style={{ background: "rgba(8,13,22,0.72)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 9600 4800"
              width={28}
              height={14}
              aria-label="Flag of Canada"
              style={{ display: "block", flexShrink: 0, borderRadius: 2, boxShadow: "0 1px 4px rgba(0,0,0,0.45)" }}
            >
              <path fill="#f00" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z" />
              <path fill="var(--text-primary)" d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z" />
            </svg>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "var(--accent-text-lg)" }}>
              {hero.eyebrow}
            </p>
          </div>
          {/* The standard landing H1, 48px at 1440, as Insights, Resources
              and the rest (QA D11, 30 Sep 2026); this one was 56px. */}
          <h1
            className="font-black mb-6 max-w-4xl"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 3.4vw, 3rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            {hero.heading}
          </h1>
          {/* --ink-85 with the product hero's shadow; --text-faint (#8B8B8B)
              was grey on grey paving. */}
          <p className="text-xl leading-relaxed max-w-2xl" style={{ color: "var(--ink-85)", textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}>
            {hero.subheading}
          </p>
        </div>
      </div>

      {/* ── Stats Bar ───────────────────────── */}
      <div style={{ background: "var(--bg-section-asphalt)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Four across from md, divided; two by two on phones, where the
              divider runs only between the two columns (a divide-x there also
              drew one after "1,000+" at the end of the first row: QA, 28 Sep
              2026). */}
          <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-[var(--ink-06)]">
            {stats.map((s) => (
              <div
                key={s.label}
                className="py-8 md:py-10 px-4 sm:px-6 flex flex-col items-center text-center border-[var(--ink-06)] max-md:odd:border-r"
              >
                <span className="text-4xl md:text-5xl font-bold mb-2" style={{ color: "var(--accent-text-lg)" }}>
                  {s.value}
                </span>
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Story ──────────────────────────────── */}
      <div className="py-28" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              {/* "Our Story" and "Our Mission" are what a company calls these sections
                  when it has not decided what they say. The copy underneath is
                  specific — a founding belief, a date, two offices, a named
                  installer programme — so the headings can be specific too. */}
              <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>How we got here</h2>
              <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--text-body)" }}>
                {storyParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <div>
              <div className="rounded-xl overflow-hidden mb-8 relative" style={{ height: 260 }}>
                <Image
                  src="/images/applications/community-branding/community-branding-08.jpg"
                  alt="HUB Surface Systems, UBC community identity crosswalk installation"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(13,17,23,0.7) 100%)" }} />
              </div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>What the work is for</h2>
              {/* A statement, not a quotation (QA D18, 30 Sep 2026): it was
                  set in quotation marks and attributed to "HUB Surface
                  Systems", the company quoting itself on its own page. The
                  text is Sanity's (aboutMission); only the framing is here. */}
              <p
                className="text-xl leading-relaxed mb-8"
                style={{ color: "var(--text-primary)", borderLeft: "3px solid #f97316", paddingLeft: "24px", fontWeight: 500 }}
              >
                {missionQuote}
              </p>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-body)" }}>
                {storyAside}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Values ────────────────────────────── */}
      <div style={{ background: "var(--bg-section-asphalt)", borderTop: "1px solid var(--ink-05)", borderBottom: "1px solid var(--ink-05)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-12" style={{ color: "var(--accent-text-lg)" }}>
            What we stand for
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y divide-[var(--ink-06)] md:divide-y-0 md:divide-x md:divide-[var(--ink-06)]" style={{ border: "1px solid var(--border-color)", borderRadius: "16px", overflow: "hidden" }}>
            {values.map((v) => (
              <div key={v.heading} className="p-8 md:p-10" style={{ background: "var(--bg-card)" }}>
                <div className="w-8 h-[2px] mb-6" style={{ background: "#f97316" }} />
                <h3 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>{v.heading}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-faint)" }} dangerouslySetInnerHTML={{ __html: v.body }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Offices ───────────────────────────── */}
      <div className="py-20" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Two coasts, two offices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { region: "West Office", city: "Ladysmith, British Columbia", contact: "Cleve Stordy", email: "cleve.stordy@hubss.com", phone: "604-309-8212", provinces: ["BC", "AB", "SK", "NT", "YT", "NU"] },
              { region: "East Office", city: "Milton, Ontario", contact: "Doug Bain", email: "doug.bain@hubss.com", phone: "416-540-9287", provinces: ["ON", "QC", "NS", "NB", "PE", "NL", "MB"] },
            ].map((office) => (
              <div key={office.region} className="p-8 rounded-xl relative overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "#f97316" }} />
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent-text-lg)" }}>{office.region}</p>
                <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>{office.city}</h3>
                <p className="text-sm mb-5" style={{ color: "var(--text-faint)" }}>{office.contact}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {office.provinces.map((prov) => (
                    <span key={prov} className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "rgba(249,115,22,0.10)", color: "var(--accent-text-lg)", border: "1px solid rgba(249,115,22,0.20)" }}>{prov}</span>
                  ))}
                </div>
                <a href={`mailto:${office.email}`} className="text-sm flex items-center transition-colors hover:text-[var(--accent-text-lg)]" style={{ color: "var(--text-body)", minHeight: 40 }}>{office.email}</a>
                <a href={`tel:${office.phone.replace(/-/g, "")}`} className="text-sm flex items-center transition-colors hover:text-[var(--accent-text-lg)]" style={{ color: "var(--text-body)", minHeight: 40 }}>{office.phone}</a>
              </div>
            ))}
          </div>
          {/* A centred "Serving all 10 provinces and 3 territories" sat here.
              The book's figure is 10 provinces, which the stats band and the
              hero eyebrow already print, so the line went (QA, 27 Sep 2026).
              The province chips above say which office covers where. */}
        </div>
      </div>

      {/* ── Why HUB ───────────────────────────── */}
      <div className="py-28" style={{ background: "var(--bg-dark)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12" style={{ color: "var(--text-primary)" }}>Why HUB</h2>
          {/* Flex, not grid: the cards on a short last row widen to fill it, so
              five cards read as three and two rather than three and a gap. */}
          <div className="flex flex-wrap gap-6">
            {differentiators.map((d) => (
              <div key={d.title} className="grow min-w-0 basis-full md:basis-[calc(50%_-_12px)] lg:basis-[calc((100%_-_48px)/3)] p-8 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                <div className="w-8 h-0.5 mb-5" style={{ background: "#f97316" }} />
                <h3 className="font-bold text-lg mb-3" style={{ color: "var(--text-primary)" }}>{d.title}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-faint)" }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Manufacturer Partners ────────────────────── */}
      <div className="py-20" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--accent-text-lg)" }}>Manufacturer partners</p>
          <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Who stands behind the systems</h2>
          <p className="text-base leading-relaxed max-w-2xl mb-8" style={{ color: "var(--text-faint)" }}>
            {partnersIntro}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "GAF",         key: "gaf",         sub: "",                logo: "/images/partners/gaf-logo.png", logoW: 80, logoH: 40, products: ["StreetBond", "StreetBondSR", "DuraShield", "MMAX"],                                                  desc: partnerDesc("gaf"),         accent: "#E05C1A" },
              { name: "Ennis-Flint", key: "ennis-flint", sub: "A PPG company",   logo: "/images/partners/ppg-logo.svg", logoW: 80, logoH: 40, products: ["TrafficPatterns", "TrafficPatternsXD", "PreMark", "AirMark", "DuraTherm", "DecoMark"],          desc: partnerDesc("ennis-flint"), accent: "#0057A8" },
            ].map((partner) => (
              <div key={partner.name} className="rounded-xl relative overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: partner.accent }} />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-8 py-5 sm:py-6" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: "#ffffff", border: "1px solid var(--ink-10)", width: 100, height: 52, padding: "8px 14px" }}>
                    <Image src={partner.logo} width={partner.logoW} height={partner.logoH} alt={partner.name} style={{ maxHeight: 32, width: "auto", objectFit: "contain" }} unoptimized />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.products.map((p) => (
                      <span key={p} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${partner.accent}18`, color: partner.accent, border: `1px solid ${partner.accent}30` }}>{p}</span>
                    ))}
                  </div>
                </div>
                <div className="px-5 sm:px-8 py-5 sm:py-6">
                  <h3 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>{partner.name}</h3>
                  {partner.sub && <p className="text-xs font-semibold tracking-wide uppercase mb-3" style={{ color: "var(--ink-30)" }}>{partner.sub}</p>}
                  {!partner.sub && <div className="mb-3" />}
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-faint)" }}>{partner.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LunchLearn compact />
      <Footer />
    </main>
  );
}
