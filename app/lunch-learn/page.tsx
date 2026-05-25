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
  const hero = {
    eyebrow:        sanityPage?.lunchLearnHero?.eyebrow        ?? "Free · No Obligation · Coast to Coast",
    headingLine1:   sanityPage?.lunchLearnHero?.headingLine1   ?? "Lunch Is On Us.",
    headingLine2:   sanityPage?.lunchLearnHero?.headingLine2   ?? "Your Next Spec Is Free.",
    subheading:     sanityPage?.lunchLearnHero?.subheading     ?? "A 45-minute HUB Lunch & Learn delivers everything your team needs to confidently specify decorative pavement, thermoplastic crosswalks, and coloured coatings — real Canadian case studies and spec language you can drop straight into your next RFP.",
    ctaLabel:       sanityPage?.lunchLearnHero?.ctaLabel       ?? "Book Your Free Session",
    formHeading:    sanityPage?.lunchLearnHero?.formHeading    ?? "Claim Your Free Lunch & Learn",
    formSubheading: sanityPage?.lunchLearnHero?.formSubheading ?? "Tell us who you are and where you are — we handle the rest. Usually within 24 hours.",
    submitLabel:    sanityPage?.lunchLearnHero?.submitLabel    ?? "Claim Your Free Lunch & Learn →",
  };

  return (
    <main style={{ background: "#0f1620", minHeight: "100vh" }}>
      <JsonLd data={faqSchema} />
      <JsonLd data={serviceSchema} />
      <Nav />
      <LunchLearnFunnel
        {...hero}
        whatYouGet={sanityPage?.lunchLearnWhatYouGet}
        personas={sanityPage?.lunchLearnPersonas}
        faqs={sanityPage?.lunchLearnFaqs}
        sectionHeadings={sanityPage?.lunchLearnSectionHeadings}
      />
      <Footer />
    </main>
  );
}
