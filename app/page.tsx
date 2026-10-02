import type { Metadata } from "next";
import Nav from "@/components/sections/Nav";
import HeroSlideshow from "@/components/sections/HeroSlideshow";
// WhyHubss stats/claims block removed per Doug; TrustedByMarquee restored as standalone social proof.
import TrustedByMarquee from "@/components/sections/TrustedByMarquee";
import PersonaEntryPoints from "@/components/sections/PersonaEntryPoints";
import ProductsGrid, { type ProductCard } from "@/components/sections/ProductsGrid";
import ApplicationsGrid, { type ApplicationCard } from "@/components/sections/ApplicationsGrid";
import IdeaBookBand from "@/components/sections/IdeaBookBand";
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

// 30 Sep 2026 (QA A1, E2, E4): "Systems", not the banned "Solutions", in the
// title; one factual description with no "leader" (the same line as the site
// default in app/layout.tsx); and the share image is the real 1200 x 630 crop
// (QA F12), not the 1632 x 1020 hero file declared as 1200 x 630.
const HOME_DESCRIPTION =
  "Stamped asphalt, preformed thermoplastic markings and pavement coatings for Canadian municipalities, specifiers and contractors. Canadian-owned since 1999.";

export const metadata: Metadata = buildMetadata({
  title: "Decorative Pavement & Road Marking Systems",
  description: HOME_DESCRIPTION,
  slug: "",
  image: "/images/og/default.jpg",
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://hubss.com/#organization",
  name: "HUB Surface Systems",
  url: "https://hubss.com",
  logo: "https://hubss.com/images/hub-official-logo.svg",
  foundingDate: "1999",
  description: HOME_DESCRIPTION,
  // One source with the footer and the Follow the Work strip. This list used
  // to be typed by hand and pointed Google at an Instagram account HUB does
  // not own, and it left out X.
  sameAs: Object.values(SOCIAL_LINKS),
  subOrganization: [
    {
      "@type": "LocalBusiness",
      "@id": "https://hubss.com/#west-office",
      name: "HUB Surface Systems · West Office",
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
      name: "HUB Surface Systems · East Office",
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

/**
 * The hero, art-directed. The Studio photograph is the default; a wide
 * screen and a phone get their own framing, cut from the same master by
 * scripts/hero-cuts.mjs (docs/IMAGE-WORKFLOW.md, "The hero at every size"),
 * each with the HUB sign in the middle. The files are committed in
 * /public/images/hero and listed here by hand: a <source> that 404s shows a
 * broken picture, so remove the entry when removing the file.
 *
 * Never check for them with fs at runtime. The first version did, and
 * Vercel's file tracing then packed the whole /public folder (2.84 GB of
 * rasters) into the page's function, which failed the deploy of `ddff97b`.
 */
const HERO_SOURCES = [
  // A wide, short window (a laptop, a 21:9 monitor): a 2:1 frame.
  { file: "/images/hero/hero-1-wide.jpg", media: "(min-aspect-ratio: 16/9) and (min-width: 768px)" },
  // A phone: the whole scene as a 4:3 picture above the headline
  // (HeroSlideshow.tsx lays the hero out that way below the sm breakpoint).
  { file: "/images/hero/hero-1-mobile.jpg", media: "(max-width: 639px)" },
];

export default async function Home() {
  const sanityPage = await getSanityPageContent("homepage");
  const [mergedApplications, mergedProducts] = await Promise.all([
    getMergedApplications(),
    getMergedProducts(),
  ]);
  // Only what the two grids render (QA F3, 30 Sep 2026). Passed whole, the
  // merged records carried every gallery photo, the Portable Text and the
  // SEO fields of 17 products and 20 applications into the client
  // components' props, and so into the HTML: 1.05 MB for the homepage.
  const productCards: ProductCard[] = mergedProducts.map(({ slug, name, imageUrl, homepageBlurb }) => ({
    slug, name, imageUrl, homepageBlurb,
  }));
  const applicationCards: ApplicationCard[] = mergedApplications.map(({ slug, name, shortDesc, imageUrl }) => ({
    slug, name, shortDesc, imageUrl,
  }));
  const heroPhoto = toPhoto(sanityPage?.homepageHeroImage, "");
  const hero = {
    eyebrow:    sanityPage?.homepageHero?.eyebrow    ?? "Redefining Hardscapes · Since 1999",
    heading:    sanityPage?.homepageHero?.heading    ?? "The World Is",
    subheading: sanityPage?.homepageHero?.subheading ?? "Your Canvas.",
    tagline:    sanityPage?.homepageHero?.tagline    ?? "Let’s build your signature space.",
    // 30 Sep 2026 (QA A2, E34): "See the work" goes to the map of documented
    // projects (#map), not to the Insights section (#field-notes); both
    // labels in sentence case. Sanity holds these four fields too
    // (scripts/sync-pages-to-sanity.ts, HOME_HERO_TEXT), so the live site
    // changes when that sync runs.
    cta1Label:  sanityPage?.homepageHero?.cta1Label  ?? "See the work",
    cta1Href:   sanityPage?.homepageHero?.cta1Href   ?? "#map",
    cta2Label:  sanityPage?.homepageHero?.cta2Label  ?? "See the systems",
    cta2Href:   sanityPage?.homepageHero?.cta2Href   ?? "#systems",
    // Hero slide 1 in Studio; /images/hero/hero-1.jpg when it's empty.
    heroImageSrc: heroPhoto?.src,
    heroImageAlt: heroPhoto?.alt,
    heroSources: HERO_SOURCES,
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
      <ProductsGrid products={productCards} />
      {/* dark → slate */}
      <ApplicationsGrid applications={applicationCards} />
      {/* The Idea Book's one homepage call to action (Doug, 25 Sep 2026):
          after the applications, before the reading. */}
      <IdeaBookBand />
      {/* Featured article — Insights */}
      <FeaturedBlogPost />
      {/* off-white → slate (lunch learn) */}
      <InstagramStrip />
      {/* Canada map — controlled by SITE_FLAGS.showMap in lib/site-flags.ts.
          #map is a real anchor: a search for one of the mapped places sends
          the visitor here. Since 28 Sep 2026 every pin has a published write-up
          and its own photos (lib/map-projects.ts). Wrapped here
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
