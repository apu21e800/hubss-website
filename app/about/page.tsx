import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { getSanityPageContent } from "@/lib/sanity.queries";
import { toPhoto } from "@/lib/photos";
import PhotoImage from "@/components/ui/PhotoImage";
import { getProjectTiles, TileLink, type Pick } from "@/components/sections/InstagramStrip";
import { ABOUT_HERO, ABOUT_STORY, ABOUT_WHY_HUB, ABOUT_PARTNERS_INTRO, ABOUT_SEED } from "@/lib/about-content";

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

// The copy lives in lib/about-content.ts (trimmed 30 Sep 2026, Vern: "this
// page is loaded with text... don't overload users with text"), which is also
// what `npm run sync:pages` pushes to Sanity. Sanity overrides it field by
// field, except where a field still holds the pre-trim copy word for word
// (ABOUT_SEED): that field has not been touched in Studio, so the page serves
// the new copy. The same arrangement as /lunch-learn. The mission quote, story
// aside, values cards and partner paragraphs are no longer read.

// Four documented jobs beside the story, west to east. Each is a map pin with a
// published write-up, captioned by the rules the homepage "Follow the work"
// tiles use (components/sections/InstagramStrip.tsx): the pin's place, the
// systems its write-up declares, and a link to the write-up.
const STORY_PICKS: Pick[] = [
  { pin: "ubc-musqueam", site: "Musqueam crosswalk", systems: ["TrafficPatterns"], position: "50% 60%" },
  { pin: "sechelt-tsain-ko", site: "Tsain-Ko crosswalk", systems: ["TrafficPatterns"], position: "50% 55%" },
  { pin: "london-east-brt", site: "East London Link", systems: ["MMAX", "TrafficPatternsXD"], position: "50% 60%" },
  { pin: "montreal-guido-nincheri", site: "Parc Guido-Nincheri", systems: ["StreetBond"], position: "50% 55%" },
];
const STORY_SLOT = { cls: "", sizes: "(min-width: 1280px) 340px, (min-width: 1024px) 28vw, 50vw", lead: false } as const;

/** Sanity's text unless it is still the pre-trim seed (or blank). */
function fresh(sanity: string | undefined, seed: string): string | undefined {
  return sanity && sanity !== seed ? sanity : undefined;
}

export default async function AboutPage() {
  const sanityPage = await getSanityPageContent("about");
  const hero = {
    eyebrow:    sanityPage?.aboutHero?.eyebrow ?? ABOUT_HERO.eyebrow,
    heading:    sanityPage?.aboutHero?.heading ?? ABOUT_HERO.heading,
    subheading: fresh(sanityPage?.aboutHero?.subheading, ABOUT_SEED.subheading) ?? ABOUT_HERO.subheading,
  };
  // The hero photo from Studio; /images/hero/hero-3.jpg when it's empty.
  const aboutHeroPhoto = toPhoto(sanityPage?.aboutHeroImage, "HUB Surface Systems, decorative pavement across Canada") ?? {
    src: "/images/hero/hero-3.jpg",
    alt: "HUB Surface Systems, decorative pavement across Canada",
  };

  const sanityStory = sanityPage?.aboutStory;
  const storyIsSeed = sanityStory?.length === ABOUT_SEED.story.length && sanityStory.every((p, i) => p === ABOUT_SEED.story[i]);
  const storyParagraphs = sanityStory?.length && !storyIsSeed ? sanityStory : ABOUT_STORY;

  const sanityWhy = sanityPage?.aboutWhyHub;
  const whyIsSeed = sanityWhy?.length === ABOUT_SEED.whyHubTitles.length && sanityWhy.every((d, i) => d.title === ABOUT_SEED.whyHubTitles[i]);
  const differentiators = sanityWhy?.length && !whyIsSeed ? sanityWhy : ABOUT_WHY_HUB;

  const partnersIntro = fresh(sanityPage?.aboutPartnersIntro, ABOUT_SEED.partnersIntro) ?? ABOUT_PARTNERS_INTRO;

  const tiles = await getProjectTiles(STORY_PICKS);

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
          <h1
            className="font-black mb-6 max-w-4xl"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
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

      {/* ── Story ──────────────────────────────────
          30 Sep 2026: two short paragraphs beside four documented jobs. The
          mission quote, the aside and the three values cards that followed
          (about 300 words between them) went; the photographs say it. */}
      <div className="py-20 md:py-24" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>How we got here</h2>
              <div className="space-y-4 text-lg leading-relaxed" style={{ color: "var(--text-body)" }}>
                {storyParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <Link
                href="/#map"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[var(--text-primary)]"
                style={{ color: "var(--accent-text-lg)", minHeight: 40 }}
              >
                See the projects on the map
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
            {tiles.length > 0 && (
              <ul className="lg:col-span-7 grid grid-cols-2 gap-2 sm:gap-3" aria-label="Documented HUB projects">
                {tiles.map((tile) => (
                  <li key={tile.key} data-tile={tile.key} className="relative aspect-[4/3]">
                    <TileLink tile={tile} slot={STORY_SLOT} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Why HUB ─────────────────────────────────
          Three cards, one line each (was five). */}
      <div className="py-20 md:py-24" style={{ background: "var(--bg-dark)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Why HUB</h2>
          {/* Flex, not grid: a short last row widens to fill it if Studio holds
              more or fewer than three. */}
          <div className="flex flex-wrap gap-6">
            {differentiators.map((d) => (
              <div key={d.title} className="grow min-w-0 basis-full md:basis-[calc((100%_-_48px)/3)] p-7 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                <div className="w-8 h-0.5 mb-5" style={{ background: "#f97316" }} />
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{d.title}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-faint)" }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Offices ─────────────────────────────── */}
      <div className="py-20" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Talk to the office nearest you.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { region: "West office", city: "Ladysmith, British Columbia", contact: "Cleve Stordy", email: "cleve.stordy@hubss.com", phone: "604-309-8212", provinces: ["BC", "AB", "SK", "NT", "YT", "NU"] },
              { region: "East office", city: "Milton, Ontario", contact: "Doug Bain", email: "doug.bain@hubss.com", phone: "416-540-9287", provinces: ["ON", "QC", "NS", "NB", "PE", "NL", "MB"] },
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
        </div>
      </div>

      {/* ── Manufacturer partners ───────────────────
          Logos and the systems each one makes. The two partner paragraphs
          (Sanity aboutPartners) are no longer shown. */}
      <div className="pb-20" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-16" style={{ borderTop: "1px solid var(--border-color)" }}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--accent-text-lg)" }}>Manufacturer partners</p>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Who stands behind the systems</h2>
            <p className="text-base leading-relaxed max-w-2xl mb-8" style={{ color: "var(--text-faint)" }}>
              {partnersIntro}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "GAF",         sub: "",              logo: "/images/partners/gaf-logo.png", products: ["StreetBond", "StreetBondSR", "DuraShield", "MMAX"],                                         accent: "#E05C1A" },
                { name: "Ennis-Flint", sub: "A PPG company", logo: "/images/partners/ppg-logo.svg", products: ["TrafficPatterns", "TrafficPatternsXD", "PreMark", "AirMark", "DuraTherm", "DecoMark"], accent: "#0057A8" },
              ].map((partner) => (
                <div key={partner.name} className="rounded-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center gap-5 px-5 sm:px-7 py-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: partner.accent }} />
                  <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: "#ffffff", border: "1px solid var(--ink-10)", width: 100, height: 52, padding: "8px 14px" }}>
                    <Image src={partner.logo} width={80} height={40} alt={partner.name} style={{ maxHeight: 32, width: "auto", objectFit: "contain" }} unoptimized />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                      {partner.name}
                      {partner.sub && <span className="ml-2 text-xs font-semibold tracking-wide uppercase align-middle" style={{ color: "var(--ink-30)" }}>{partner.sub}</span>}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {partner.products.map((p) => (
                        <span key={p} className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${partner.accent}18`, color: partner.accent, border: `1px solid ${partner.accent}30` }}>{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <LunchLearn compact />
      <Footer />
    </main>
  );
}
