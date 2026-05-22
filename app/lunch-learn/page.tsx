import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import LunchLearnFunnel from "@/components/sections/LunchLearnFunnel";
import { buildMetadata } from "@/lib/seo";
import { getSanityPageContent } from "@/lib/sanity.queries";

export const metadata = buildMetadata({
  title: "Lunch & Learn — Free CPD Session for Engineers & Specifiers",
  description: "Book a free Lunch & Learn with HUB Surface Systems. We bring the food, the specs, and 30 years of decorative pavement expertise to your office. CPD-eligible for engineers.",
  slug: "lunch-learn",
});

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
