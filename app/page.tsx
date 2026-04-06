import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import HeroCityTicker from "@/components/sections/HeroCityTicker";
import WhyHubss from "@/components/sections/WhyHubss";
import PersonaEntryPoints from "@/components/sections/PersonaEntryPoints";
import ProductsGrid from "@/components/sections/ProductsGrid";
import ApplicationsGrid from "@/components/sections/ApplicationsGrid";
import ResidentialDriveways from "@/components/sections/ResidentialDriveways";
import ComparisonTable from "@/components/sections/ComparisonTable";
import FeaturedBlogPost from "@/components/sections/FeaturedBlogPost";
import InstagramStrip from "@/components/sections/InstagramStrip";
import LunchLearn from "@/components/sections/LunchLearn";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Decorative Pavement & Road Marking Solutions",
  description: "Canada's leader in decorative stamped asphalt, thermoplastic road markings, and coloured pavement systems. Serving municipalities, developers, and contractors coast to coast since 1994.",
  slug: "",
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HUB Surface Systems",
  url: "https://hubss.com",
  logo: "https://hubss.com/images/logo.svg",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+1-416-540-9287",
      contactType: "sales",
      areaServed: "CA",
      availableLanguage: "English",
    },
    {
      "@type": "ContactPoint",
      telephone: "+1-604-309-8212",
      contactType: "sales",
      areaServed: "CA",
      availableLanguage: "English",
    },
  ],
  address: [
    { "@type": "PostalAddress", addressLocality: "Milton", addressRegion: "ON", addressCountry: "CA" },
    { "@type": "PostalAddress", addressLocality: "Ladysmith", addressRegion: "BC", addressCountry: "CA" },
  ],
  sameAs: [],
};

export default function Home() {
  return (
    <main>
      {/* Page-load sweep */}
      <div className="page-sweep" />

      <JsonLd data={organizationSchema} />
      <Nav />
      <Hero />
      <HeroCityTicker />
      <WhyHubss />
      <PersonaEntryPoints />
      {/* slate → dark */}
      <ProductsGrid />
      {/* dark → slate */}
      <ApplicationsGrid />
      {/* Residential Driveways feature — grid bg */}
      <ResidentialDriveways />
      {/* slate → off-white */}
      <ComparisonTable />
      {/* Featured blog post — Field Notes */}
      <FeaturedBlogPost />
      {/* off-white → slate (lunch learn) */}
      <InstagramStrip />
      {/* LunchLearn — Moose mascot rendered internally by the component */}
      <LunchLearn />
      {/* slate → dark footer */}
      <Footer />
    </main>
  );
}
