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
import { getSanityPageContent, getSiteSettings } from "@/lib/sanity.queries";
import { hotspotPosition, isSanityImage, sanityCrop, toPhoto } from "@/lib/photos";
import { editAttr, isPreview } from "@/lib/sanity.preview";
import { getMergedApplications } from "@/lib/applications.server";
import { getMergedProducts } from "@/lib/products.server";
import { city, provinceCode, schemaPhone, type SiteSettings } from "@/lib/site-settings";
import { mergeHomepageCopy } from "@/lib/homepage-copy";

// 30 Sep 2026 (QA A1, E2, E4): "Systems", not the banned "Solutions", in the
// title; one factual description with no "leader" (the same line as the site
// default in app/layout.tsx); and the share image is the real 1200 x 630 crop
// (QA F12), not the 1920 x 1200 hero file declared as 1200 x 630.
const HOME_DESCRIPTION =
  "Stamped asphalt, preformed thermoplastic markings and pavement coatings for Canadian municipalities, specifiers and contractors. Canadian-owned since 1999.";

export const metadata: Metadata = buildMetadata({
  title: "Decorative Pavement & Road Marking Systems",
  description: HOME_DESCRIPTION,
  slug: "",
  image: "/images/og/default.jpg",
});

// The offices and the social accounts come from Studio's Site Settings
// (lib/site-settings.ts), the same values the footer prints.
const organizationSchema = ({ offices, social }: SiteSettings) => ({
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
  sameAs: Object.values(social),
  subOrganization: [
    {
      "@type": "LocalBusiness",
      "@id": "https://hubss.com/#west-office",
      name: "HUB Surface Systems · West Office",
      image: "https://hubss.com/images/hero/hero-1.jpg",
      url: "https://hubss.com/contact",
      telephone: schemaPhone(offices.west.phone),
      email: offices.west.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: city(offices.west),
        addressRegion: provinceCode(offices.west, "BC"),
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
      telephone: schemaPhone(offices.east.phone),
      email: offices.east.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: city(offices.east),
        addressRegion: provinceCode(offices.east, "ON"),
        addressCountry: "CA",
      },
      areaServed: ["ON", "QC", "NS", "NB", "PE", "NL", "MB"],
      priceRange: "$$",
    },
  ],
});

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
const WIDE_MEDIA = "(min-aspect-ratio: 16/9) and (min-width: 768px)";
const PHONE_MEDIA = "(max-width: 639px)";
const HERO_SOURCES: { file: string; media: string; kind: "wide" | "phone" }[] = [
  // A wide, short window (a laptop, a 21:9 monitor): a 1.8:1 frame (2 Oct 2026 re-cut).
  { file: "/images/hero/hero-1-wide.jpg", media: WIDE_MEDIA, kind: "wide" },
  // A phone: the whole scene as a 4:3 picture above the headline
  // (HeroSlideshow.tsx lays the hero out that way below the sm breakpoint).
  { file: "/images/hero/hero-1-mobile.jpg", media: PHONE_MEDIA, kind: "phone" },
];

/**
 * The photo those hand-made cuts were made from, as Studio records it
 * (asset->source.url). While Studio holds it, the cuts above are used. When
 * Doug puts another photo in Studio, the wide-screen and phone cuts are made
 * from HIS photo by Sanity's image CDN, around the focal point he sets on it
 * (lib/photos.ts, sanityCrop). Until 7 Oct 2026 the hand-made cuts were used
 * whatever Studio held, so a new hero showed only on 16:10 screens and
 * tablets, and every phone and laptop kept the old photo.
 */
const DEFAULT_HERO_ORIGIN = "/images/hero/hero-1.jpg";

export default async function Home() {
  const [sanityPage, settings] = await Promise.all([getSanityPageContent("homepage"), getSiteSettings()]);
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
  // The words of every section below the hero, Studio over the code
  // (lib/homepage-copy.ts).
  const copy = mergeHomepageCopy(sanityPage?.homepageSections);
  const heroPhoto = toPhoto(sanityPage?.homepageHeroImage, "");
  const studioHero = heroPhoto && heroPhoto.origin !== DEFAULT_HERO_ORIGIN && isSanityImage(heroPhoto.src) ? heroPhoto : null;
  const heroSources = studioHero
    ? [
        { file: sanityCrop(studioHero.src, 2400, 1333, studioHero.hotspot), media: WIDE_MEDIA, kind: "wide" as const },
        { file: sanityCrop(studioHero.src, 1200, 960, studioHero.hotspot), media: PHONE_MEDIA, kind: "phone" as const },
      ]
    : HERO_SOURCES;
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
    heroSources,
    // A Studio photo frames around its focal point; its wide cut is already
    // centred on it. The default photo keeps HOME_HERO's hand-picked framing.
    position: studioHero ? hotspotPosition(studioHero) ?? "50% 50%" : undefined,
    widePosition: studioHero ? "50% 50%" : undefined,
    // While previewing in Studio, clicking the photo opens its field.
    editAttribute: (await isPreview()) ? editAttr({ id: sanityPage?._id ?? "page-homepage", type: "page" }, "homepageHero.heroImage1") : undefined,
  };

  return (
    <main>
      {/* Page-load sweep */}
      <div className="page-sweep" />

      <JsonLd data={organizationSchema(settings)} />
      <Nav />
      <HeroSlideshow {...hero} />
      <TrustedByMarquee />
      <PersonaEntryPoints cards={copy.audiences} />
      {/* slate → dark */}
      <ProductsGrid products={productCards} copy={copy.systems} />
      {/* dark → slate */}
      <ApplicationsGrid applications={applicationCards} copy={copy.applications} />
      {/* The Idea Book's one homepage call to action (Doug, 25 Sep 2026):
          after the applications, before the reading. */}
      <IdeaBookBand copy={copy.ideaBook} />
      {/* Featured article — Insights */}
      <FeaturedBlogPost copy={copy.insights} />
      {/* off-white → slate (lunch learn) */}
      <InstagramStrip copy={copy.onTheGround} />
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
