import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearnPage from "@/components/sections/LunchLearnPage";
import JsonLd from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getSanityPageContent } from "@/lib/sanity.queries";
import { LL_WHAT_YOU_GET, LL_PERSONAS, LL_FAQS } from "@/lib/lunch-learn-content";

export const metadata = buildMetadata({
  title: "Lunch & Learn · Free Spec Session for Engineers & Planners",
  description: "Book a free Lunch & Learn with HUB Surface Systems. We bring lunch, material samples, and 27 years of decorative pavement expertise to your office, in person or virtual, coast to coast.",
  slug: "lunch-learn",
});

// Service schema: Lunch & Learn is a free technical session, linked to the
// home page's Organization. The facts match the page (45 minutes, lunch on
// HUB, in person or virtual).
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://hubss.com/lunch-learn#service",
  name: "HUB Lunch & Learn · Decorative Pavement Spec Session",
  serviceType: "Technical Lunch & Learn Presentation",
  description:
    "Free 45-minute working session for engineering, architecture, and municipal teams covering decorative pavement systems, thermoplastic markings, and coloured coatings. Includes material samples, spec language, and the certified installer map for your region.",
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

export default async function LunchLearnRoute() {
  const sanityPage = await getSanityPageContent("lunch-learn");

  // Copy migration shim (Aug 2026, kept 30 Sep). The Sanity lunch-learn doc
  // still holds the launch-era seed, which claims CE credits HUB does not
  // offer. A section still exactly as seeded (every title or question matches
  // the seed) serves the code copy in lib/lunch-learn-content.ts; the moment
  // someone edits that section in Studio, their version wins wholesale.
  // The page's top (headline, pitch, form) is code: the Studio hero fields
  // are not read here.
  const STALE_WYG_TITLES = ["Spec Language Ready for Your RFP", "The Lifecycle Cost Math", "Lunch Included. No Catch."];
  const STALE_PERSONA_TITLES = ["Municipal Engineers & Planners", "Landscape Architects & Designers", "Engineering & Consulting Firms", "Contractors & Applicators"];
  const STALE_FAQ_QS = ["How long is the session?", "Is this actually free?", "Do we get continuing education credits?", "In-person or virtual?"];
  function freshArray<T extends Record<string, unknown>>(arr: T[] | undefined, key: string, staleVals: string[]): T[] | undefined {
    if (!arr?.length) return undefined;
    const untouched = arr.every((item) => staleVals.includes(String(item[key] ?? "")));
    return untouched ? undefined : arr;
  }
  const h = sanityPage?.lunchLearnSectionHeadings;
  const headingsFresh = h && h.whatYouGetHeading !== "Not a Sales Pitch. An Education." ? h : undefined;

  const whatYouGet = freshArray(sanityPage?.lunchLearnWhatYouGet, "title", STALE_WYG_TITLES) ?? LL_WHAT_YOU_GET;
  const personas = freshArray(sanityPage?.lunchLearnPersonas, "title", STALE_PERSONA_TITLES) ?? LL_PERSONAS;
  const faqs = freshArray(sanityPage?.lunchLearnFaqs, "q", STALE_FAQ_QS) ?? LL_FAQS;
  const headings = {
    whatYouGetEyebrow: headingsFresh?.whatYouGetEyebrow ?? "What you walk away with",
    whatYouGetHeading: headingsFresh?.whatYouGetHeading ?? "A working session for your team.",
    personasEyebrow: headingsFresh?.personasEyebrow ?? "Who it's built for",
    personasHeading: headingsFresh?.personasHeading ?? "Your whole team, one session.",
    faqEyebrow: headingsFresh?.faqEyebrow ?? "Common questions",
    faqHeading: headingsFresh?.faqHeading ?? "Everything you need to know",
  };

  // FAQPage schema from the same list the page prints, so the two can't drift.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <JsonLd data={faqSchema} />
      <JsonLd data={serviceSchema} />
      <Nav />
      <LunchLearnPage whatYouGet={whatYouGet} personas={personas} faqs={faqs} headings={headings} />
      <Footer />
    </main>
  );
}
