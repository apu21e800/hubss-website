import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import HeroSlideshow from "@/components/sections/HeroSlideshow";
// WhyHubss stats/claims block removed per Doug; TrustedByMarquee restored as standalone social proof.
import TrustedByMarquee from "@/components/sections/TrustedByMarquee";
import PersonaEntryPoints from "@/components/sections/PersonaEntryPoints";
import ProductsGrid from "@/components/sections/ProductsGrid";
import ApplicationsGrid from "@/components/sections/ApplicationsGrid";
import FeaturedBlogPost from "@/components/sections/FeaturedBlogPost";
import InstagramStrip from "@/components/sections/InstagramStrip";
import LunchLearn from "@/components/sections/LunchLearn";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";
import CanadaMapWrapper from "@/components/sections/CanadaMapWrapper";
import { SITE_FLAGS } from "@/lib/site-flags";

export const metadata: Metadata = buildMetadata({
  title: "Decorative Pavement & Road Marking Solutions",
  description: "Canada's leader in decorative stamped asphalt, thermoplastic road markings, and coloured pavement systems. Serving municipalities, developers, and contractors coast to coast since 1999.",
  slug: "",
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://hubss.com/#organization",
  name: "HUB Surface Systems",
  url: "https://hubss.com",
  logo: "https://hubss.com/images/hub-official-logo.svg",
  foundingDate: "1999",
  description:
    "Canadian leader in decorative pavement and traffic safety solutions. Stamped asphalt, thermoplastic markings, and specialty coatings for municipalities and developers across Canada.",
  sameAs: [
    "https://www.linkedin.com/company/hub-surface-systems",
    "https://www.instagram.com/hubsurfacesystems",
    "https://www.facebook.com/hubsurfacesystems",
    "https://www.youtube.com/@hubsurfacesystems",
  ],
  subOrganization: [
    {
      "@type": "LocalBusiness",
      "@id": "https://hubss.com/#west-office",
      name: "HUB Surface Systems — West Office",
      image: "https://hubss.com/images/hero/hero-1.jpg",
      url: "https://hubss.com/contact",
      telephone: "+1-604-309-8212",
      email: "cleve.stordy@hubss.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ladysmith",
        addressRegion: "BC",
        addressCountry: "CA",
      },
      areaServed: ["BC", "AB", "SK", "NT", "YT", "NU"],
      priceRange: "$$",
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://hubss.com/#east-office",
      name: "HUB Surface Systems — East Office",
      image: "https://hubss.com/images/hero/hero-1.jpg",
      url: "https://hubss.com/contact",
      telephone: "+1-416-540-9287",
      email: "doug.bain@hubss.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Milton",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      areaServed: ["ON", "QC", "NS", "NB", "PE", "NL", "MB"],
      priceRange: "$$",
    },
  ],
};

export default function Home() {
  return (
    <main>
      {/* Page-load sweep */}
      <div className="page-sweep" />

      <JsonLd data={organizationSchema} />
      <Nav />
      <HeroSlideshow />
      <TrustedByMarquee />
      <PersonaEntryPoints />
      {/* slate → dark */}
      <ProductsGrid />
      {/* dark → slate */}
      <ApplicationsGrid />
      {/* Featured blog post — Field Notes */}
      <FeaturedBlogPost />
      {/* off-white → slate (lunch learn) */}
      <InstagramStrip />
      {/* Canada map — controlled by SITE_FLAGS.showMap in lib/site-flags.ts */}
      {SITE_FLAGS.showMap && <CanadaMapWrapper />}
      {/* LunchLearn — Moose mascot rendered internally by the component */}
      <LunchLearn />
      <Footer />
    </main>
  );
}
