import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearnFunnel from "@/components/sections/LunchLearnFunnel";
import JsonLd from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getSanityPageContent } from "@/lib/sanity.queries";

export const metadata = buildMetadata({
  title: "Lunch & Learn — Free CPD Session for Engineers & Specifiers",
  description: "Book a free Lunch & Learn with HUB Surface Systems. We bring the food, the specs, and 30 years of decorative pavement expertise to your office. CPD-eligible for engineers.",
  slug: "lunch-learn",
});

// FAQPage schema — Q&As pulled verbatim from the LunchLearnFunnel section
// so any copy edit there flows through here without drifting. Eligible for
// rich-result FAQ snippets in Google SERPs (4 Q&As is well above Google's
// minimum and below the practical max).
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long is the session?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "30–45 minutes of presentation, followed by open Q&A. We're respectful of your team's calendar and stick to the time we agree on.",
      },
    },
    {
      "@type": "Question",
      name: "Is this actually free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "100% free. No invoice, no minimum order attached, and we won't badger you afterward. We just want you to know what you're specifying — the rest follows naturally.",
      },
    },
    {
      "@type": "Question",
      name: "Do we get continuing education credits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. HUB Lunch & Learn sessions count toward AIBC, RAIC, and PEO continuing professional development requirements. We provide the documentation.",
      },
    },
    {
      "@type": "Question",
      name: "Is the session in-person or virtual?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both. In-person sessions are available coast to coast through our certified applicator network. Virtual sessions use Zoom or Teams — we mail sample kits before we connect.",
      },
    },
  ],
};

// Service schema — Lunch & Learn is a free CPD offering, eligible for
// SERP enrichment with offer + provider linkage to the home-page Organization.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://hubss.com/lunch-learn#service",
  name: "HUB Lunch & Learn — Decorative Pavement CPD",
  serviceType: "Continuing Professional Development",
  description:
    "Free 30–45 minute presentation for engineering, architecture, and municipal-procurement teams covering decorative pavement systems, thermoplastic markings, and coloured coatings. Counts toward AIBC, RAIC, and PEO CPD requirements.",
  provider: { "@id": "https://hubss.com/#organization" },
  areaServed: { "@type": "Country", name: "Canada" },
  audience: {
    "@type": "Audience",
    audienceType: "Engineers, landscape architects, municipal procurement, transportation planners",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CAD",
    availability: "https://schema.org/InStock",
    url: "https://hubss.com/lunch-learn",
  },
};

export default async function LunchLearnPage() {
  const sanityPage = await getSanityPageContent("lunch-learn").catch(() => null);
  // Copy migration shim (Aug 2026): the Sanity lunch-learn doc still carries
  // the launch-era "free lunch" register. Until that doc is updated in Studio,
  // treat those exact stale strings as unset so the revised copy serves.
  // Once Studio is updated, delete `fresh()` and read sanityPage directly.
  const STALE: Record<string, string> = {
    eyebrow: "Free · No Obligation · Coast to Coast",
    headingLine1: "Lunch Is On Us.",
    headingLine2: "Your Next Spec Is Free.",
    ctaLabel: "Book Your Free Session",
    formHeading: "Claim Your Free Lunch & Learn",
    formSubheading: "Tell us who you are and where you are — we handle the rest. Usually within 24 hours.",
    submitLabel: "Claim Your Free Lunch & Learn →",
  };
  const fresh = (key: keyof typeof STALE, v: string | undefined) =>
    v && v !== STALE[key] ? v : undefined;
  // Body-section shim, same contract as the hero: Sanity's lunch-learn doc was
  // seeded from the launch-era defaults. If a section is untouched since the
  // seed (every title/question still matches), serve the revised copy from the
  // component defaults; the moment the client edits anything in Studio, their
  // content wins wholesale. Delete after the Studio doc is refreshed.
  const STALE_WYG_TITLES = ["Spec Language Ready for Your RFP", "The Lifecycle Cost Math", "Lunch Included. No Catch."];
  const STALE_PERSONA_TITLES = ["Municipal Engineers & Planners", "Landscape Architects & Designers", "Engineering & Consulting Firms", "Contractors & Applicators"];
  const STALE_FAQ_QS = ["How long is the session?", "Is this actually free?", "Do we get continuing education credits?", "In-person or virtual?"];
  function freshArray<T extends Record<string, unknown>>(arr: T[] | undefined, key: string, staleVals: string[]): T[] | undefined {
    if (!arr?.length) return undefined;
    const untouched = arr.every((item) => staleVals.includes(String(item[key] ?? "")));
    return untouched ? undefined : arr;
  }
  function freshHeadings(h: { whatYouGetHeading?: string } | undefined) {
    if (!h) return undefined;
    return h.whatYouGetHeading === "Not a Sales Pitch. An Education." ? undefined : h;
  }
  const hero = {
    eyebrow:        fresh("eyebrow", sanityPage?.lunchLearnHero?.eyebrow)               ?? "Professional Development · In-Person or Virtual · Coast to Coast",
    headingLine1:   fresh("headingLine1", sanityPage?.lunchLearnHero?.headingLine1)     ?? "Specify with confidence.",
    headingLine2:   fresh("headingLine2", sanityPage?.lunchLearnHero?.headingLine2)     ?? "Lunch is on us.",
    subheading:     sanityPage?.lunchLearnHero?.subheading && sanityPage.lunchLearnHero.subheading.startsWith("A 45-minute HUB Lunch & Learn delivers") ? "A focused 45-minute session that gives your team the technical grounding to specify decorative pavement, thermoplastic crosswalks, and coloured coatings — real Canadian case studies and spec language you can drop straight into your next RFP." : (sanityPage?.lunchLearnHero?.subheading ?? "A focused 45-minute session that gives your team the technical grounding to specify decorative pavement, thermoplastic crosswalks, and coloured coatings — real Canadian case studies and spec language you can drop straight into your next RFP."),
    ctaLabel:       fresh("ctaLabel", sanityPage?.lunchLearnHero?.ctaLabel)             ?? "Book a Session",
    formHeading:    fresh("formHeading", sanityPage?.lunchLearnHero?.formHeading)       ?? "Book your Lunch & Learn",
    formSubheading: fresh("formSubheading", sanityPage?.lunchLearnHero?.formSubheading) ?? "Tell us who you are and where you are — we confirm date and details within one business day.",
    submitLabel:    fresh("submitLabel", sanityPage?.lunchLearnHero?.submitLabel)     ?? "Book the Session →",
  };

  return (
    <main style={{ background: "#0f1620", minHeight: "100vh" }}>
      <JsonLd data={faqSchema} />
      <JsonLd data={serviceSchema} />
      <Nav />
      <LunchLearnFunnel
        {...hero}
        whatYouGet={freshArray(sanityPage?.lunchLearnWhatYouGet, "title", STALE_WYG_TITLES)}
        personas={freshArray(sanityPage?.lunchLearnPersonas, "title", STALE_PERSONA_TITLES)}
        faqs={freshArray(sanityPage?.lunchLearnFaqs, "q", STALE_FAQ_QS)}
        sectionHeadings={freshHeadings(sanityPage?.lunchLearnSectionHeadings)}
      />
      <Footer />
    </main>
  );
}
