import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import HeroCityTicker from "@/components/sections/HeroCityTicker";
import StatsBar from "@/components/sections/StatsBar";
import WhyHubss from "@/components/sections/WhyHubss";
import PersonaEntryPoints from "@/components/sections/PersonaEntryPoints";
import ProductsGrid from "@/components/sections/ProductsGrid";
import ApplicationsGrid from "@/components/sections/ApplicationsGrid";
import ComparisonTable from "@/components/sections/ComparisonTable";
import RecentProjects from "@/components/sections/RecentProjects";
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
      {/* dark → slate */}
      <StatsBar />
      <WhyHubss />
      <PersonaEntryPoints />
      {/* slate → dark */}
      <ProductsGrid />
      {/* dark → slate */}
      <ApplicationsGrid />
      {/* slate → off-white */}
      <ComparisonTable />
      {/* off-white → off-white */}
      <RecentProjects />
      {/* off-white → slate (lunch learn) */}
      <InstagramStrip />
      {/* Moose — anchored to the L&L section on homepage, bottom-left */}
      <div className="relative">
        <LunchLearn />
        <div
          className="absolute bottom-0 left-8 lg:left-16 hidden lg:block pointer-events-none"
          style={{ zIndex: 10, width: 200, height: 200 }}
        >
          <Image
            src="/images/lunch-learn/moose.png"
            alt="HUB Surface Systems Moose"
            width={200}
            height={200}
            style={{ filter: "drop-shadow(0 0 28px rgba(249,115,22,0.22))", display: "block" }}
            unoptimized
          />
        </div>
      </div>
      {/* slate → dark footer */}
      <Footer />
    </main>
  );
}
