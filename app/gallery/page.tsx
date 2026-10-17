import JsonLd from "@/components/ui/JsonLd";
import { imageObject } from "@/lib/image-seo";
import { mapProjects } from "@/lib/map-projects";
import GalleryArchive, { type GalleryImage } from "./GalleryArchive";
import Footer from "@/components/sections/Footer";
import LunchLearn from "@/components/sections/LunchLearn";

/**
 * The photo archive. A server page since 30 Sep 2026: it builds the list,
 * takes each tile's label from the map's project record where the same
 * photograph is on a pin (QA D20: labels like "High-Vis Crosswalk" were file
 * names in disguise), and hands the list to the client grid in
 * GalleryArchive.tsx. The map data stays on the server.
 */

// Sep 2026 QA pass. Seven entries were the same photograph as another under a
// new caption (the Little Italy crosswalk three times; the UBC crosswalk,
// Windsor Gate, the Leslieville laneway and two more twice each), so the
// repeats are gone. Places come from each post; a folder photo whose place is
// not recorded says "Canada" rather than a guessed province, as lib/image-seo.ts
// does. Some projects keep two different photographs.
//
// Order, 30 Sep 2026 (QA D20: the first row opened on a Walmart storefront
// and a Rosedale Group trailer): HUB's own documented surfaces lead, each on
// a map pin with a write-up behind it; the retail and truck frames sit at the
// end of their category. The labels of pinned photos are resolved below.
const IMAGES: GalleryImage[] = [
  // ── The lead: documented installations, pin titles as labels ──────────────
  { src: "/images/blog/ubc-musqueam-crosswalk/featured.jpg", alt: "UBC Musqueam crosswalk", category: "community", location: "Vancouver, BC", tall: true },
  { src: "/images/blog/decorative-crosswalk-commercial-drive/featured.jpg", alt: "Commercial Drive crosswalk", category: "crosswalks", location: "Vancouver, BC", tall: true },
  // The Crosswalks gallery's Grimsby photo, from Sanity's CDN (its caption
  // in Studio names the place; lib/image-seo.ts FILE_PLACES agrees). A CDN
  // source, so it adds nothing to /_next/image.
  { src: "https://cdn.sanity.io/images/9dbro2m1/production/9df8b4975c31a639f983e286ba2b850ac9a4f49b-2016x1512.jpg", alt: "Decorative crosswalk at a municipal intersection", category: "crosswalks", location: "Grimsby, ON" },
  { src: "/images/blog/simcoe-rainbow-crosswalk/featured.jpg", alt: "Rainbow crosswalk", category: "community", location: "Simcoe, ON" },
  { src: "/images/blog/tsain-ko-crosswalk-sechelt/featured.jpg", alt: "Tsain-Ko crosswalk", category: "community", location: "Sechelt, BC" },
  { src: "/images/blog/every-child-matters-crosswalk/featured.png", alt: "Every Child Matters crosswalk", category: "community", location: "Georgina, ON" },
  { src: "/images/blog/trafficpatternsxd-urban-design/featured.jpg", alt: "Woodbridge heritage crosswalk", category: "crosswalks", location: "Vaughan, ON", tall: true },
  { src: "/images/blog/white-rock-langley-trafficpatterns/featured.jpg", alt: "TrafficPatterns installation", category: "crosswalks", location: "White Rock, BC", tall: true },
  { src: "/images/blog/terry-fox-plaza-coquitlam/featured.jpg", alt: "Terry Fox Plaza", category: "community", location: "Port Coquitlam, BC", tall: true },
  { src: "/images/blog/spirit-trail-wayfinding-vancouver/featured.jpg", alt: "Spirit Trail crosswalk", category: "parks", location: "North Vancouver, BC", tall: true },
  { src: "/images/blog/pictograph-crosswalk-sechelt/featured.jpg", alt: "Pictograph crosswalk", category: "community", location: "Sechelt, BC" },
  { src: "/images/blog/imprinted-asphalt-york-transit/featured.jpg", alt: "York Region VIVA BRT", category: "transit", location: "York Region, ON", tall: true },

  // ── Crosswalks ────────────────────────────────────────────────────────────────
  { src: "/images/blog/decorative-crosswalk-meridian/featured.jpg", alt: "Humberwest Parkway crosswalk and median", category: "crosswalks", location: "Brampton, ON" },
  { src: "/images/blog/complete-streets-new-westminster/featured.jpg", alt: "Complete Streets crossing", category: "crosswalks", location: "New Westminster, BC", tall: true },
  { src: "/images/blog/performance-crosswalks-asphalt-concrete/featured.jpg", alt: "Crosswalks on asphalt and concrete", category: "crosswalks", location: "Kelowna, BC" },
  { src: "/images/blog/municipalities-case-study/featured.jpg", alt: "Leslieville laneway", category: "crosswalks", location: "Toronto, ON" },
  { src: "/images/blog/educational-facilities/featured.jpg", alt: "UBC campus entrance crosswalk", category: "crosswalks", location: "Vancouver, BC" },
  { src: "/images/blog/murrayville-schoolhouse-sidewalk/featured.jpg", alt: "Murrayville schoolhouse sidewalk", category: "crosswalks", location: "Murrayville, BC" },
  { src: "/images/blog/pedestrian-channelization-public-spaces/featured.jpg", alt: "Pedestrian channelization", category: "crosswalks", location: "" },
  { src: "/images/blog/stamped-asphalt-vs-concrete/featured.jpg", alt: "Stamped asphalt crosswalk", category: "crosswalks", location: "" },
  // The photograph is a crossing with a green bike lane beside a church; the
  // post is a guide and names no place.
  { src: "/images/blog/decorative-hardscape-grey-is-new-black/featured.jpg", alt: "Crosswalk and bike lane crossing", category: "crosswalks", location: "" },
  { src: "/images/blog/keeping-pedestrians-safe/featured.png", alt: "Pedestrian safety crosswalk", category: "crosswalks", location: "" },
  { src: "/images/blog/transportation-infrastructure-guide/featured.jpg", alt: "Transit corridor markings", category: "crosswalks", location: "", tall: true },
  // Application images (live after git push). Labels describe what is in the
  // frame; none of these photographs has a recorded place.
  { src: "/images/applications/crosswalks/crosswalks-01.jpg", alt: "Yellow stamped crosswalk", category: "crosswalks", location: "" },
  { src: "/images/applications/crosswalks/crosswalks-03.jpg", alt: "Thermoplastic crosswalk", category: "crosswalks", location: "" },
  { src: "/images/applications/crosswalks/crosswalks-05.jpg", alt: "Crosswalk and bike lane crossing", category: "crosswalks", location: "" },
  { src: "/images/applications/crosswalks/crosswalks-07.jpg", alt: "Decorative crosswalk", category: "crosswalks", location: "", tall: true },
  { src: "/images/applications/crosswalks/crosswalks-10.jpg", alt: "Urban crosswalk", category: "crosswalks", location: "" },
  { src: "/images/applications/crosswalks/crosswalks-14.jpg", alt: "Stamped crosswalk", category: "crosswalks", location: "" },
  { src: "/images/applications/crosswalks/crosswalks-18.jpg", alt: "Coloured crosswalk", category: "crosswalks", location: "" },
  { src: "/images/applications/crosswalks/crosswalks-43.jpg", alt: "Community art crosswalk", category: "crosswalks", location: "", tall: true },
  { src: "/images/applications/crosswalks/crosswalks-50.jpg", alt: "Decorative crosswalk at an intersection", category: "crosswalks", location: "" },
  { src: "/images/applications/crosswalks/crosswalks-65.jpg", alt: "Crosswalk detail", category: "crosswalks", location: "" },
  { src: "/images/applications/crosswalks/crosswalks-84.jpg", alt: "Municipal crosswalk", category: "crosswalks", location: "" },
  { src: "/images/applications/crosswalks/crosswalks-100.jpg", alt: "TrafficPatternsXD crosswalk", category: "crosswalks", location: "" },
  // The storefront and the trailer frames close the category (QA D20).
  { src: "/images/blog/best-crosswalks-canada/featured.jpg", alt: "High-visibility crosswalk", category: "crosswalks", location: "", tall: true },
  { src: "/images/blog/decorative-asphalt-high-traffic/featured.jpg", alt: "Emery Village crosswalk", category: "crosswalks", location: "Toronto, ON" },

  // ── Bike & Bus Lanes ────────────────────────────────────────────────────────
  { src: "/images/blog/durable-transit-lanes-crossings/featured.jpg", alt: "Transit lanes", category: "transit", location: "Ontario" },
  { src: "/images/blog/extending-transit-lane-lifespan/featured.jpg", alt: "Bus lane, after years of service", category: "transit", location: "Ontario" },
  // The same file as the York case study's hero, but the signs in it are
  // Kitchener's: this is the ION corridor, as on the map's GrandLinq pin.
  { src: "/images/blog/safety-durability-transit-stations/featured.jpg", alt: "ION corridor crossing", category: "transit", location: "Waterloo Region, ON" },
  { src: "/images/applications/bike-lanes/bike-lanes-01.jpg", alt: "Protected bike lane", category: "transit", location: "", tall: true },
  { src: "/images/applications/bike-lanes/bike-lanes-03.jpg", alt: "Coloured bike lane", category: "transit", location: "" },
  { src: "/images/applications/bike-lanes/bike-lanes-07.jpg", alt: "Bike lane marking", category: "transit", location: "" },
  { src: "/images/applications/bike-lanes/bike-lanes-14.jpg", alt: "Urban bike lane", category: "transit", location: "" },
  { src: "/images/applications/bus-lanes/bus-lanes-39.png", alt: "Red resin bus lane", category: "transit", location: "", tall: true },
  { src: "/images/applications/bus-lanes/bus-lanes-40.png", alt: "MMA bus lane", category: "transit", location: "" },

  // ── Community Branding ──────────────────────────────────────────────────
  { src: "/images/blog/community-branding-case-study/featured.jpg", alt: "Windsor Gate community", category: "community", location: "Coquitlam, BC" },
  { src: "/images/blog/community-spaces/featured.jpg", alt: "Little Italy roundel", category: "community", location: "Vancouver, BC" },
  { src: "/images/blog/decorative-paving-solutions/featured.jpg", alt: "Decorative paving", category: "community", location: "" },
  { src: "/images/applications/community-branding/community-branding-08.jpg", alt: "Public art crosswalk", category: "community", location: "" },
  { src: "/images/applications/community-branding/community-branding-12.jpg", alt: "Cultural crosswalk", category: "community", location: "" },

  // ── Parks & Paths ─────────────────────────────────────────────────────────────
  { src: "/images/blog/bowen-island-asphalt-path/featured.jpg", alt: "Bowen Island path", category: "parks", location: "Bowen Island, BC" },
  { src: "/images/blog/parc-riviera-streetbond-walkway/featured.jpg", alt: "Parc Riviera walkway", category: "parks", location: "" },
  { src: "/images/blog/roadway-accents-natures-walk/featured.jpg", alt: "Nature's Walk roadway accent", category: "parks", location: "Pitt Meadows, BC", tall: true },
  // Was "StreetBondSR Bike Lane" under Bike & Bus Lanes: the post shows a
  // park pathway in Osoyoos.
  { src: "/images/blog/streetbondsr-solar-reflective-coatings/featured.jpg", alt: "StreetBondSR pathway", category: "parks", location: "Osoyoos, BC" },
  { src: "/images/applications/parks-paths/parks-paths-96.png", alt: "Parks path", category: "parks", location: "" },
  { src: "/images/applications/parks-paths/parks-paths-99.png", alt: "Decorated path", category: "parks", location: "" },
  { src: "/images/applications/parks-paths/parks-paths-103.png", alt: "Community path", category: "parks", location: "", tall: true },

  // ── Recreation ──────────────────────────────────────────────────────────────────
  { src: "/images/blog/bc-childrens-hospital-labyrinth/featured.jpg", alt: "BC Children's Hospital labyrinth", category: "recreation", location: "Vancouver, BC", tall: true },
  { src: "/images/blog/durable-coatings-waterparks/featured.jpg", alt: "Waterpark surface coating", category: "recreation", location: "" },
  { src: "/images/blog/playgrounds-recreation/featured.jpg", alt: "Playground surface", category: "recreation", location: "" },
  { src: "/images/applications/splash-pads/splash-pads-01.jpg", alt: "Splash pad surface", category: "recreation", location: "", tall: true },
  { src: "/images/applications/splash-pads/splash-pads-04.jpg", alt: "Splash pad design", category: "recreation", location: "" },
  { src: "/images/applications/splash-pads/splash-pads-08.jpg", alt: "Splash pad installation", category: "recreation", location: "" },
  { src: "/images/applications/sport-courts/sport-courts-01.jpg", alt: "Sport court surface", category: "recreation", location: "" },
  { src: "/images/applications/sport-courts/sport-courts-05.jpg", alt: "Coloured sport court", category: "recreation", location: "", tall: true },
  { src: "/images/applications/sport-courts/sport-courts-10.jpg", alt: "Multi-sport court", category: "recreation", location: "" },

  // ── Parking ─────────────────────────────────────────────────────────────────────
  { src: "/images/blog/stamped-asphalt-parking-lot/featured.jpg", alt: "Stamped asphalt parking lot", category: "parking", location: "Kitchener, ON", tall: true },
  { src: "/images/blog/commercial-applications/featured.jpg", alt: "Commercial pavement", category: "parking", location: "Kitchener, ON" },
  { src: "/images/applications/townhomes/townhomes-01.jpg", alt: "Townhome driveway", category: "parking", location: "" },
  { src: "/images/applications/townhomes/townhomes-05.png", alt: "Residential driveway", category: "parking", location: "", tall: true },
];

/**
 * The map's record for a photograph, when the same file is on a pin: its
 * title is the job's name and its city and province are documented, so they
 * replace the hand-typed label and place (QA D20, 30 Sep 2026). A title that
 * ends in its own city ("Terry Fox Plaza, Port Coquitlam") drops it, since
 * the place prints beside the label.
 */
function withPinLabels(images: GalleryImage[]): GalleryImage[] {
  const byPhoto = new Map<string, { title: string; city: string; province: string }>();
  for (const p of mapProjects) {
    for (const src of p.images) {
      if (!byPhoto.has(src)) byPhoto.set(src, { title: p.title, city: p.city, province: p.province });
    }
  }
  return images.map((img) => {
    const pin = byPhoto.get(img.src);
    if (!pin) return img;
    const title = pin.title.endsWith(`, ${pin.city}`) ? pin.title.slice(0, -(pin.city.length + 2)) : pin.title;
    return { ...img, alt: title, location: `${pin.city}, ${pin.province}` };
  });
}

export default function GalleryPage() {
  const images = withPinLabels(IMAGES);

  /**
   * The archive as an addressable collection.
   *
   * This page is the densest photography on the site and it carried no
   * structured data whatsoever: dozens of photographs of Canadian work that a
   * crawler could see only as anonymous <img> tags. As an ImageGallery of
   * ImageObjects, each photograph arrives with its location, its subject, the
   * credit, and the licence terms that make it eligible for the Licensable
   * badge in Google Images; and the set as a whole becomes something an AI
   * crawler can cite by name rather than merely scrape.
   */
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": "https://hubss.com/gallery#gallery",
    name: "HUB Surface Systems gallery",
    // Photographs, not installations: some projects appear in two.
    description:
      `${images.length} photographs of decorative pavement across Canada: crosswalks, transit lanes, ` +
      "parks and paths, playgrounds, and community branding by HUB Surface Systems.",
    url: "https://hubss.com/gallery",
    inLanguage: "en-CA",
    numberOfItems: images.length,
    author: { "@id": "https://hubss.com/#organization" },
    associatedMedia: images.map((img) =>
      imageObject(img.src, {
        alt: `${img.alt}${img.location ? `, ${img.location}` : ""}, decorative pavement by HUB Surface Systems`,
        caption: `${img.alt}${img.location ? `, ${img.location}` : ""}. Installed by HUB Surface Systems.`,
      })
    ),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hubss.com" },
      { "@type": "ListItem", position: 2, name: "Gallery", item: "https://hubss.com/gallery" },
    ],
  };

  return (
    <>
      <JsonLd data={gallerySchema} />
      <JsonLd data={breadcrumbSchema} />
      {/* The band closes this page as it closes every other (uniformity pass,
          17 Oct 2026: the gallery was the one page without it). */}
      <GalleryArchive images={images} footer={<><LunchLearn compact /><Footer /></>} />
    </>
  );
}
