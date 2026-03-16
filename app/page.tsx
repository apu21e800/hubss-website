import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import StatsBar from "@/components/sections/StatsBar";
import ProductsGrid from "@/components/sections/ProductsGrid";
import ApplicationsGrid from "@/components/sections/ApplicationsGrid";
import RecentProjects from "@/components/sections/RecentProjects";
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
      <JsonLd data={organizationSchema} />
      <Nav />
      <Hero />
      <StatsBar />
      <ProductsGrid />
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.35) 25%, rgba(234,179,8,0.35) 75%, transparent 100%)" }} />
      <ApplicationsGrid />
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.35) 25%, rgba(234,179,8,0.35) 75%, transparent 100%)" }} />
      <RecentProjects />
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.35) 25%, rgba(234,179,8,0.35) 75%, transparent 100%)" }} />
      <LunchLearn />
      <Footer />
    </main>
  );
}
