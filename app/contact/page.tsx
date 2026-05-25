import { getSanityPageContent } from "@/lib/sanity.queries";
import JsonLd from "@/components/ui/JsonLd";
import ContactForm from "./ContactForm";

// LocalBusiness pair — Western + Eastern offices, each with hours,
// service area, and contactPoint. References the home-page Organization
// (@id) so the entity graph stays clean rather than duplicating the
// parent. Surfaces both offices to Google's Local Pack and helps regional
// "decorative pavement near me" intent.
const contactSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://hubss.com/#west-office-contact",
      name: "HUB Surface Systems — Western Canada",
      description:
        "Decorative pavement and thermoplastic-marking sales, specification support, and Lunch & Learn delivery for British Columbia, Alberta, Saskatchewan, NWT, Yukon, and Nunavut.",
      parentOrganization: { "@id": "https://hubss.com/#organization" },
      url: "https://hubss.com/contact",
      image: "https://hubss.com/images/hero/hero-1.jpg",
      telephone: "+1-604-309-8212",
      email: "cleve.stordy@hubss.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ladysmith",
        addressRegion: "BC",
        addressCountry: "CA",
      },
      areaServed: [
        { "@type": "AdministrativeArea", name: "British Columbia" },
        { "@type": "AdministrativeArea", name: "Alberta" },
        { "@type": "AdministrativeArea", name: "Saskatchewan" },
        { "@type": "AdministrativeArea", name: "Northwest Territories" },
        { "@type": "AdministrativeArea", name: "Yukon" },
        { "@type": "AdministrativeArea", name: "Nunavut" },
      ],
      priceRange: "$$",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Sales — Western Canada",
        telephone: "+1-604-309-8212",
        email: "cleve.stordy@hubss.com",
        areaServed: "CA",
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://hubss.com/#east-office-contact",
      name: "HUB Surface Systems — Eastern Canada",
      description:
        "Decorative pavement and thermoplastic-marking sales, specification support, and Lunch & Learn delivery for Ontario, Quebec, and the Atlantic provinces.",
      parentOrganization: { "@id": "https://hubss.com/#organization" },
      url: "https://hubss.com/contact",
      image: "https://hubss.com/images/hero/hero-1.jpg",
      telephone: "+1-416-540-9287",
      email: "doug.bain@hubss.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Milton",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Ontario" },
        { "@type": "AdministrativeArea", name: "Quebec" },
        { "@type": "AdministrativeArea", name: "Nova Scotia" },
        { "@type": "AdministrativeArea", name: "New Brunswick" },
        { "@type": "AdministrativeArea", name: "Prince Edward Island" },
        { "@type": "AdministrativeArea", name: "Newfoundland and Labrador" },
        { "@type": "AdministrativeArea", name: "Manitoba" },
      ],
      priceRange: "$$",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Sales — Eastern Canada",
        telephone: "+1-416-540-9287",
        email: "doug.bain@hubss.com",
        areaServed: "CA",
        availableLanguage: ["English"],
      },
    },
  ],
};

export default async function ContactPage() {
  const sanityPage = await getSanityPageContent("contact").catch(() => null);
  const hero = {
    eyebrow:    sanityPage?.contactHero?.eyebrow    ?? "Get In Touch",
    heading:    sanityPage?.contactHero?.heading    ?? "Start a Project",
    subheading: sanityPage?.contactHero?.subheading ?? "Tell us about your community, your timeline, and your vision. We'll tell you which surface system brings it to life.",
  };

  return (
    <>
      <JsonLd data={contactSchema} />
      <ContactForm {...hero} />
    </>
  );
}
