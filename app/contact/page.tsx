import { getSanityPageContent, getSiteSettings } from "@/lib/sanity.queries";
import { city, schemaPhone, type SiteSettings } from "@/lib/site-settings";
import JsonLd from "@/components/ui/JsonLd";
import ContactForm from "./ContactForm";
import Footer from "@/components/sections/Footer";

// LocalBusiness pair — Western + Eastern offices, each with hours,
// service area, and contactPoint. References the home-page Organization
// (@id) so the entity graph stays clean rather than duplicating the
// parent. Surfaces both offices to Google's Local Pack and helps regional
// "decorative pavement near me" intent.
// The phones, emails and towns come from Studio's Site Settings
// (lib/site-settings.ts), the same values the page prints.
const contactSchema = ({ offices }: SiteSettings) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://hubss.com/#west-office-contact",
      name: "HUB Surface Systems · Western Canada",
      description:
        "Decorative pavement and thermoplastic-marking sales, specification support, and Lunch & Learn delivery for British Columbia, Alberta, Saskatchewan, NWT, Yukon, and Nunavut.",
      parentOrganization: { "@id": "https://hubss.com/#organization" },
      url: "https://hubss.com/contact",
      image: "https://hubss.com/images/hero/hero-1.jpg",
      telephone: schemaPhone(offices.west.phone),
      email: offices.west.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: city(offices.west),
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
        contactType: "Sales · Western Canada",
        telephone: schemaPhone(offices.west.phone),
        email: offices.west.email,
        areaServed: "CA",
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://hubss.com/#east-office-contact",
      name: "HUB Surface Systems · Eastern Canada",
      description:
        "Decorative pavement and thermoplastic-marking sales, specification support, and Lunch & Learn delivery for Ontario, Quebec, and the Atlantic provinces.",
      parentOrganization: { "@id": "https://hubss.com/#organization" },
      url: "https://hubss.com/contact",
      image: "https://hubss.com/images/hero/hero-1.jpg",
      telephone: schemaPhone(offices.east.phone),
      email: offices.east.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: city(offices.east),
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
        contactType: "Sales · Eastern Canada",
        telephone: schemaPhone(offices.east.phone),
        email: offices.east.email,
        areaServed: "CA",
        availableLanguage: ["English"],
      },
    },
  ],
});

export default async function ContactPage() {
  const [sanityPage, settings] = await Promise.all([getSanityPageContent("contact"), getSiteSettings()]);
  const hero = {
    eyebrow:    sanityPage?.contactHero?.eyebrow    ?? "Get in touch",
    heading:    sanityPage?.contactHero?.heading    ?? "Start a project",
    subheading: sanityPage?.contactHero?.subheading ?? "Tell us about your community, your timeline, and your vision. We'll tell you which surface system brings it to life.",
  };

  return (
    <>
      <JsonLd data={contactSchema(settings)} />
      <ContactForm {...hero} footer={<Footer />} />
    </>
  );
}
