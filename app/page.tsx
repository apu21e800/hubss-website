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
import { getSanityPageContent } from "@/lib/sanity.queries";
import { toPhoto } from "@/lib/photos";
import { getMergedApplications } from "@/lib/applications.server";
import { getMergedProducts } from "@/lib/products.server";
import { SOCIAL_LINKS } from "@/lib/social-links";

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
  // One source with the footer and the Follow the Work strip. This list used
  // to be typed by hand and pointed Google at an Instagram account HUB does
  // not own, and it left out X.
  sameAs: Object.values(SOCIAL_LINKS),
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

export default async function Home() {
  const sanityPage = await getSanityPageContent("homepage");
  const [mergedApplications, mergedProducts] = await Promise.all([
    getMergedApplications(),
    getMergedProducts(),
  ]);
  const heroPhoto = toPhoto(sanityPage?.homepageHeroImage, "");
  const hero = {
    eyebrow:    sanityPage?.homepageHero?.eyebrow    ?? "Redefining Hardscapes · Since 1999",
    heading:    sanityPage?.homepageHero?.heading    ?? "The World Is",
    subheading: sanityPage?.homepageHero?.subheading ?? "Your Canvas.",
    tagline:    sanityPage?.homepageHero?.tagline    ?? "Let’s build your signature space.",
    cta1Label:  sanityPage?.homepageHero?.cta1Label  ?? "See the Work",
    cta1Href:   sanityPage?.homepageHero?.cta1Href   ?? "#field-notes",
    cta2Label:  sanityPage?.homepageHero?.cta2Label  ?? "See the Systems",
    cta2Href:   sanityPage?.homepageHero?.cta2Href   ?? "#systems",
    // Hero slide 1 in Studio; /images/hero/hero-1.jpg when it's empty.
    heroImageSrc: heroPhoto?.src,
    heroImageAlt: heroPhoto?.alt,
  };

  return (
    <main>
      {/* Page-load sweep */}
      <div className="page-sweep" />

      <JsonLd data={organizationSchema} />
      <Nav />
      <HeroSlideshow {...hero} />
      <TrustedByMarquee />
      <PersonaEntryPoints />
      {/* slate → dark */}
      <ProductsGrid products={mergedProducts} />
      {/* dark → slate */}
      <ApplicationsGrid applications={mergedApplications} />
      {/* Featured blog post — Field Notes */}
      <FeaturedBlogPost />
      {/* off-white → slate (lunch learn) */}
      <InstagramStrip />
      {/* Canada map — controlled by SITE_FLAGS.showMap in lib/site-flags.ts.
          #map is a real anchor: thirty of the fifty-nine installations have no
          write-up of their own, and a search for one of those places sends the
          visitor here, to the map where it is actually documented. Wrapped here
          rather than set on the section inside CanadaMap so the anchor survives
          whatever that component does to its own markup. */}
      {SITE_FLAGS.showMap && (
        <div id="map" style={{ scrollMarginTop: 80 }}>
          <CanadaMapWrapper />
        </div>
      )}
      {/* LunchLearn — Moose mascot rendered internally by the component */}
      <LunchLearn />
      <Footer />
    </main>
  );
}
