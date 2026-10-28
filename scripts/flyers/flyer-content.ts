/**
 * The words and photographs of the fourteen product flyers (28 Oct 2026).
 *
 * Vern, 27 Oct 2026: "Product flyers could be improved in the documents
 * section, they look like not much effort was put into them." The May
 * flyers were one page each, their paragraph cut off with "...", and they
 * carried words the site has since dropped: "heat-fused", "becomes part of
 * the pavement structure", "6 Mohs" (the book says 8–9), "73+ standard
 * colours" (the book says 63), "Catalogue 2026 companion", the makers'
 * names. These are two pages each, front and back.
 *
 * WHERE EVERY LINE COMES FROM, in the order they win (docs/GLOSSARY.md):
 * - The printed Product Portfolio Book · Volume 5: the system pages
 *   (lib/idea-book-print.ts, through lib/product-catalogue.ts and its
 *   WEB_EDITS), the steps, colour and template pages and the photo captions
 *   (lib/idea-book-edition.ts), and the application pages' SPECIFY notes
 *   (PRINT_APPLICATIONS). Page numbers are the printed page.
 * - lib/products.ts, which was read against the makers' sheets on 17 Oct
 *   2026; the only source for AirMark, ChipFill, AggreFill and Fast Patch
 *   DPR, which the book does not cover.
 * - The documented jobs (lib/map-projects.ts and the comment above each
 *   entry), what the site's photo records say a photo shows
 *   (lib/image-facts.ts), and quotes word for word from published posts.
 * Where the book's own words break the glossary, the flyer takes the site's
 * wording and DEPARTURES below says so ("heat-fused", "non-slip", "Best in
 * class performance", "permanent", "LEED compliant", "enhance").
 *
 * Nothing here names a supplier (the May flyers did; the site does not).
 */
import { PRODUCT_CATALOGUE } from "../../lib/product-catalogue";
import { products } from "../../lib/products";
import { PRODUCT_CATEGORIES } from "../../lib/product-categories";
import { colourFamily, type Colourant } from "../../lib/colours";
import { telHref, type Office } from "../../lib/site-settings";
import { lunchLearnHref } from "../../lib/lunch-learn";

/** Where a photograph comes from. */
export type PhotoSource =
  | { cdn: string } // a Sanity asset file, <hash>-WxH.jpg
  | { pub: string } // a file under /public
  | { book: number; bottom?: number }; // a printed page's 2000px render, the band above its caption

export interface FlyerPhoto {
  src: PhotoSource;
  /** Where to centre the crop, as fractions of the photo. */
  focus?: [number, number];
  alt: string;
}

export interface FlyerJob extends FlyerPhoto {
  title: string;
  sub: string;
}

export interface FlyerSpec {
  slug: string;
  headline: string;
  subhead?: string;
  body: string[];
  specs: { label: string; value: string }[];
  uses: string[];
  quote?: { text: string; who: string };
  /** `small`: a framed hero for a small original, at its own shape (BOX.heroFramedSmall). */
  hero: FlyerPhoto & { layout: "full" | "framed"; caption?: string; small?: boolean };
  steps?: { title: string; items: { name: string; body: string; photo?: FlyerPhoto; alt?: string }[] };
  how?: { title: string; body: string };
  jobsKick?: string;
  jobsTitle?: string;
  jobs: FlyerJob[];
  colours?: { heading: string; note: string; families?: string[]; chips?: Colourant[]; named?: boolean };
  list?: { kick: string; heading: string; items: { strong?: string; text?: string }[]; note?: string; oneColumn?: boolean };
  pairWith?: { kick: string; heading: string; body: string };
  whereTitle?: string;
  where?: { name: string; note?: string; page?: number }[];
  documents: string[];
  /** The Lunch & Learn topic, as the site's topic chips name it. */
  topic: string;
}

export interface Flyer extends FlyerSpec {
  name: string;
  family: string;
  jobsKick: string;
  jobsTitle: string;
  colours?: FlyerSpec["colours"] & { chips: Colourant[] };
  offices: (Office & { label: string; telHref: string })[];
  lunch: { title: string; body: string; href: string; label: string };
  closeTitle: string;
  qrCaption: string;
  pageLabel: string;
  pageHref: string;
  qrHref: string;
  legal: string;
  footLine: string;
}

const book = (slug: string) => {
  const c = PRODUCT_CATALOGUE[slug];
  if (!c) throw new Error(`flyer-content: no printed page for ${slug}`);
  return c;
};
const TP_COLOURS = { heading: "Thirty-seven colours", families: ["tp-standard", "tp-premium"], note: "Formulated for UV stability. Natural brick blends: Sand, Chestnut, Brick Red and Dark Red Brick. Physical samples available by request." };

/**
 * The fourteen. Each comment names the source of the line beside it; "book"
 * is the printed page, "products" is lib/products.ts, "map:<id>" is the
 * documented job, "post:<slug>" a published post.
 */
export const FLYERS: FlyerSpec[] = [
  {
    slug: "traffic-patterns-xd",
    headline: book("traffic-patterns-xd").title, // book p.13
    subhead: book("traffic-patterns-xd").subhead, // book p.13
    body: [
      book("traffic-patterns-xd").description, // book p.13
      // products: the build and how it goes in (PPG TS002 via docs/GLOSSARY.md)
      "Each sheet is 150 mil of aggregate-reinforced preformed thermoplastic, with anti-skid aggregate rated 8–9 on the Mohs scale running through the full cross-section, so the grip lasts as long as the colour. It is heated on prepared asphalt and stamped through into the top of the asphalt, which is what makes it hold under plow blades, road salt and the freeze-thaw that follows.",
    ],
    specs: [
      { label: "Thickness", value: "150 mil (3.8 mm)" }, // book; mm from docs/GLOSSARY.md
      { label: "Aggregate", value: "8–9 Mohs, through the full cross-section" }, // book, products
      { label: "Skid resistance", value: "60 BPN, ASTM E303" }, // book
      { label: "Installation", value: "Heated and stamped into the asphalt" }, // products
      { label: "Surfaces", value: "Asphalt" }, // products; glossary: asphalt only
      { label: "Service life", value: "10+ years" }, // book
    ],
    uses: book("traffic-patterns-xd").uses, // book p.13
    // post:decorative-asphalt-high-traffic, word for word, attributed as the post attributes it
    quote: {
      text: "The material provided us with continuity of design and less traffic disruption in construction than with replacing the pavers or demolishing the concrete base.",
      who: "Al Ruggero, Project Manager with Emery Business BIA, on the Emery Village crosswalks in Toronto",
    },
    // book p.12, map:kleinburg-crosswalk (the same photo)
    hero: { layout: "full", src: { cdn: "45923d5f5766871a7d252b0415f656d9850642c6-2400x1800.jpg" }, focus: [0.5, 0.62], caption: "Kleinburg, Ontario", alt: "A brick-pattern TrafficPatternsXD crosswalk in Kleinburg, Ontario" },
    steps: {
      title: "Place. Heat. Stamp.", // book p.16
      items: [
        { name: "Place", body: "Aggregate-reinforced, preformed thermoplastic panels are positioned precisely on the prepared surface." }, // book p.16
        // book p.16, "fuses ... creating a permanent, skid-resistant surface": "bonds" and no "permanent" (DEPARTURES)
        { name: "Heat", body: "Specialty heating equipment bonds the panels to the pavement, creating a skid-resistant surface." },
        { name: "Stamp", body: "Place the desired template on the surface and vibrate the template into the melted surface, while keying into the asphalt below." }, // book p.16
      ],
    },
    jobsTitle: "Plowed, salted and under heavy traffic",
    jobs: [
      // map:vaughan-woodbridge-heritage, the book's p.40 photo ("Woodbridge, Ontario")
      { src: { cdn: "c48c9a5d9252afef9e5dde62e2ed4c135ea994a6-2400x1800.jpg" }, focus: [0.5, 0.55], title: "Woodbridge Avenue heritage crosswalks", sub: "Vaughan, Ontario · Product Portfolio Book, page 40", alt: "A snowplow blade on the TrafficPatternsXD crosswalks on Woodbridge Avenue, Vaughan, Ontario" },
      // map:brampton-bramalea-terminal, book p.47
      { src: { cdn: "36497374754a6f6c1668e66b8f8c143c0411fd67-2400x1800.jpg" }, focus: [0.5, 0.62], title: "Bramalea Terminal crosswalk", sub: "Brampton, Ontario · Product Portfolio Book, page 47", alt: "A red and white TrafficPatternsXD crosswalk at Bramalea Terminal, Brampton, Ontario" },
      // map:york-region-viva, book p.53 (the record places the crossing on the Highway 7 rapidway, approximate)
      { src: { cdn: "4fd7f6cd4287218afc39d6529b4a3de805e432eb-2400x1800.jpg" }, focus: [0.5, 0.55], title: "Highway 7 VIVA rapidway", sub: "York Region, Ontario · Product Portfolio Book, page 53", alt: "A VIVA bus at a TrafficPatternsXD crosswalk on the Highway 7 rapidway, York Region, Ontario" },
    ],
    colours: TP_COLOURS, // book pp.14–15
    whereTitle: "In the Product Portfolio Book",
    where: [
      { name: "Crosswalks", note: "150 mil, aggregate-reinforced", page: 46 },
      { name: "Transit corridors", note: "150 mil, aggregate-reinforced", page: 52 },
      { name: "Traffic calming", note: "Durable road surface treatments", page: 54 },
      { name: "Pedestrian safety", note: "Aggregate-reinforced, stamped surface", page: 62 },
      { name: "Commercial spaces", note: "The look of pavers, stones and cobbles", page: 72 },
      { name: "Parking lots", note: "High-traffic bays and crosswalks", page: 78 }, // book: "crossings" (DEPARTURES)
    ],
    documents: ["Technical specification (TS002)", "Specification: generic, branded and French", "Two-component sealer specification", "Colour guide", "Cross-section detail", "Design manual"],
    topic: "TrafficPatternsXD",
  },
  {
    slug: "traffic-patterns",
    headline: book("traffic-patterns").subhead, // book p.11 ("You design it, we build it ...")
    body: [
      book("traffic-patterns").description, // book p.11
      // products ("engineered for" is a word the site does not use: "made for")
      "On site it is heat-applied, where it bonds to the surface, and it opens to traffic within hours. It is made for snowplow blades, de-icing salts and Canadian freeze-thaw cycling, and the same material carries a standard crosswalk, an entrance feature and an Indigenous-designed crosswalk.",
    ],
    specs: [
      { label: "Thickness", value: "125 mil (3.2 mm)" }, // book; mm from docs/GLOSSARY.md
      { label: "Aggregate", value: "Anti-skid, through the full cross-section" }, // book, products
      { label: "Skid resistance", value: "60 BPN, ASTM E303" }, // book
      { label: "Installation", value: "Heat-applied, bonds to the surface" }, // products
      { label: "Surfaces", value: "Asphalt and concrete" }, // products
      { label: "Service life", value: "8+ years" }, // book
    ],
    uses: book("traffic-patterns").uses, // book p.11
    // post:pictograph-crosswalk-sechelt, word for word
    quote: {
      text: "I love how colour can enliven a space, and I hope this design reminds people of the beauty and importance of pollinators to our lives and ecosystem.",
      who: "Lindsey Kyoko Adams, artist, on her Bees and Flower crosswalks for the District of Sechelt, British Columbia",
    },
    // book p.10 ("Kitchener, Ontario"), map:kitchener-veterans (the same photo)
    hero: { layout: "full", src: { cdn: "f087d863ecf32b94df3db6baab1e4922e0f45fc4-2400x1800.jpg" }, focus: [0.5, 0.3], caption: "Kitchener, Ontario", alt: "Veterans crossing the TrafficPatterns veterans memorial crosswalk in Kitchener, Ontario" },
    how: {
      title: "Made to your design, heat-applied on site",
      // products; docs/GLOSSARY.md (heat-applied: a propane torch or an infrared heater)
      body: "Your artwork is made in the factory as preformed thermoplastic, 125 mil thick, in the colours you choose. On site the sheets are heated with a propane torch or an infrared heater until they bond to the asphalt or concrete, and the crosswalk opens to traffic within hours.",
    },
    jobsTitle: "Seen from the sidewalk as well as the driver's seat", // book p.56's headline
    jobs: [
      // map:ubc-musqueam, book p.106
      { src: { cdn: "d2c1e165208423a75255e72eea43312489359002-1200x900.jpg" }, focus: [0.5, 0.62], title: "UBC Musqueam crosswalk", sub: "Vancouver, British Columbia · Product Portfolio Book, page 106", alt: "The UBC and Musqueam crests in a TrafficPatterns crosswalk, Vancouver, British Columbia" },
      // map:whitehorse-kwanlin-dun, book p.113
      { src: { cdn: "f07ab2a9d2f944b128d54084fa1623b78736a0c6-1184x864.jpg" }, focus: [0.5, 0.62], title: "Kwanlin Dün Cultural Centre crosswalks", sub: "Whitehorse, Yukon · Product Portfolio Book, page 113", alt: "A TrafficPatterns crosswalk in front of the Kwanlin Dün Cultural Centre, Whitehorse, Yukon" },
      // map:white-rock-seaside-stroll, book p.69
      { src: { cdn: "52e14368c9d3256f5fa5623f2f5d9cd22f6c4e15-1200x848.jpg" }, focus: [0.5, 0.62], title: "Seaside Stroll crosswalk", sub: "White Rock, British Columbia · Product Portfolio Book, page 69", alt: "Amy Bao's Seaside Stroll crosswalk in TrafficPatterns, White Rock, British Columbia" },
    ],
    colours: TP_COLOURS, // book pp.14–15 names TrafficPatterns
    whereTitle: "In the Product Portfolio Book",
    where: [
      { name: "Crosswalks", note: "125 mil, aggregate-reinforced", page: 46 },
      { name: "Creative design", note: "125 mil preformed: custom designs", page: 56 },
      { name: "Pedestrian safety", note: "125 mil, aggregate-reinforced", page: 62 },
      { name: "Public art", note: "Large-scale interconnected thermoplastic", page: 66 },
      { name: "Community branding", note: "Streetscape enhancement and beautification", page: 68 },
    ],
    documents: ["Technical specification (TS001)", "Solid Sheets 125 specification", "125 with self-adhesive specification", "Two-component sealer specification", "Colour guidelines", "Custom design guidelines", "Design manual"],
    topic: "TrafficPatterns",
  },
  {
    slug: "streetprint",
    headline: book("streetprint").subhead, // book p.19 ("The original. Since 1992. A Canadian invention, eh?")
    subhead: "Patterns are stamped into new or existing asphalt, then coloured with StreetBond coatings.", // book p.19, products
    body: [
      // products (the book's "no slip, no trip" is a promise the site does not make: DEPARTURES)
      "The surface stays flush: nothing for a plow blade to catch, no joints to weed, no pavers to settle, and the asphalt stays flexible.",
      "Brick, cobble, herringbone or a custom pattern goes in with the pavement already there, with no removal, no repaving and no haul-away. In Canadian service that is a 10–20 year surface, specified for crosswalks, driveways, plazas and heritage streetscapes.", // products
    ],
    specs: [
      { label: "System", value: "Stamping + StreetBond coating" }, // book
      { label: "Process", value: "Reheat · Stamp · Coat" }, // products, book p.20
      { label: "Patterns", value: "Standard and custom options" }, // book
      { label: "Surface", value: "New or existing asphalt" }, // book ("Base": the glossary keeps "base" for the gravel)
      { label: "Snowplow safe", value: "Yes, flush, nothing to catch" }, // products
      { label: "Service life", value: "10–20 years" }, // book
    ],
    uses: book("streetprint").uses, // book p.19
    // book p.18 (captioned "Residential driveway")
    // Cut below the gate: the house's number is on its pillar.
    hero: { layout: "full", src: { book: 18 }, focus: [0.5, 0.64], caption: "Residential driveway", alt: "A StreetPrint cobble driveway with fallen leaves" },
    steps: {
      title: "Reheat. Stamp. Coat.", // book p.20
      items: [
        { name: "Reheat", body: "Infrared heaters bring the existing asphalt back to a workable temperature: no removal, no repaving, no excavation." }, // book p.20
        { name: "Stamp", body: "Flexible templates stamp the selected pattern of brick, cobble, herringbone or other standard or custom templates into the heated surface." }, // book p.20
        // book p.20 ("using the industry's most advanced asphalt coating", "safe for the environment": DEPARTURES)
        { name: "Coat", body: "StreetBond creates the colour and seals the asphalt: UV-stable, skid-resistant and flexible." },
      ],
    },
    jobsTitle: "Roundabouts, retail and a main street",
    jobs: [
      // map:maple-ridge-kanaka-springs, book p.132
      { src: { cdn: "0b5c599579465f38fde5f75adbbc74fd343af683-2400x1800.jpg" }, focus: [0.5, 0.6], title: "Kanaka Springs roundabout", sub: "Maple Ridge, British Columbia · Product Portfolio Book, page 132", alt: "A red herringbone StreetPrint apron on the Kanaka Springs roundabout, Maple Ridge, British Columbia" },
      // map:halton-hills-toronto-premium-outlets, the book's p.79 photo, captioned StreetPrint
      { src: { cdn: "071d81ad81371de61a084911100748616f057ad3-2400x1800.jpg" }, focus: [0.5, 0.62], title: "Toronto Premium Outlets", sub: "Halton Hills, Ontario · Product Portfolio Book, page 79", alt: "StreetPrint at the entrance to Toronto Premium Outlets, Halton Hills, Ontario" },
      // map:woodstock-dundas-street, book p.96
      { src: { cdn: "cce74ceb9fe8b2ffbc6a127275eb666599525db1-2400x1800.jpg" }, focus: [0.5, 0.62], title: "Downtown Dundas Street", sub: "Woodstock, Ontario · Product Portfolio Book, page 96", alt: "A custom StreetPrint pattern on the parking lanes of Dundas Street, Woodstock, Ontario" },
    ],
    // book pp.22–23
    list: {
      kick: "Patterns",
      heading: "Stamping templates",
      items: [
        { strong: "Field:", text: "Ashlar Slate, British Cobble, Offset Brick, Random Slate, Herringbone, Diagonal Herringbone, Thompson Stone, Random Cobble, Texas Cobble, Tile Sets 6\", 8\", 12\", Eurofan, Scallop" },
        { strong: "Border:", text: "Stacked Brick, Texas Cobble, Soldier Course, Tile options" },
        { strong: "Custom:", text: "Custom templates available on request" },
      ],
      note: "Coloured with StreetBond: 63 standard colours and custom colour matching.", // book p.25
      oneColumn: true,
    },
    whereTitle: "In the Product Portfolio Book",
    where: [
      { name: "Traffic calming", note: "Traffic calming device treatments", page: 54 },
      { name: "Public spaces", note: "A wide range of imprinted patterns", page: 64 },
      { name: "Townhomes", note: "Stamped entry courts and driveways", page: 74 },
      { name: "Homes", note: "Stamped and coloured asphalt", page: 76 },
      { name: "Parking lots", note: "Stamped asphalt treated with StreetBond coating", page: 78 },
    ],
    documents: ["Asphalt texturing specification", "Colour guide", "Template guide", "Frequently asked questions"],
    topic: "StreetPrint",
  },
  {
    slug: "streetbond",
    headline: book("streetbond").title, // book p.25 ("The colour.")
    // book p.25 (the spec grid and description); its subhead "Engineered for life in Canada" uses words the site does not (DEPARTURES)
    subhead: "A water-based, epoxy-modified acrylic pavement coating for asphalt and concrete, in 63 standard colours and full custom colour matching.",
    body: [
      book("streetbond").description, // book p.25
      "It is the coating that colours every StreetPrint pattern, and on its own it turns parks, playgrounds, courts and area markings into surface colour. Easily refreshed: a worn surface is recoated, not rebuilt.", // products
    ],
    specs: [
      { label: "Type", value: "Water-based, epoxy-modified acrylic" }, // book
      { label: "Surfaces", value: "Asphalt and concrete" }, // book
      { label: "Colours", value: "63 standard + custom matching" }, // book
      { label: "Flexibility", value: "Moves with the pavement" }, // book, products
      { label: "Skid resistance", value: "Meets ASTM E303" }, // docs/GLOSSARY.md (GAF SB 150)
      { label: "Service life", value: "8+ years, easily refreshed" }, // book (WEB_EDITS: service life)
    ],
    uses: book("streetbond").uses, // book p.25
    // post:bc-childrens-hospital-labyrinth, word for word (the quote's opening names the company; the flyer starts after it)
    quote: {
      text: "…the net result was a successful implementation and translation of our design ideas to the ground plane.",
      who: "Oren Mizrahi, Connect Landscape Architecture, on the StreetBond and DecoMark at BC Children's Hospital, Vancouver",
    },
    // book p.24 ("Saint John, New Brunswick | Harbour Passage"), map:saint-john-harbour-passage
    hero: { layout: "full", src: { book: 24 }, focus: [0.5, 0.56], caption: "Harbour Passage, Saint John, New Brunswick", alt: "The red StreetBond walkway of Harbour Passage, Saint John, New Brunswick" },
    jobsTitle: "Coast to coast, in colour",
    jobs: [
      // map:bc-childrens-hospital, book p.95
      { src: { cdn: "44401860b10a412b05dd329a1e1ae60ff120e597-2400x1800.jpg" }, focus: [0.5, 0.58], title: "BC Children's Hospital labyrinth", sub: "Vancouver, British Columbia · Product Portfolio Book, page 95", alt: "A StreetBond labyrinth on a terrace at BC Children's Hospital, Vancouver, British Columbia" },
      // map:surrey-bear-creek-spray-park, book p.129
      { src: { cdn: "adc864c3b43a4cb05e0397f1406ca14610d74d22-2400x1800.jpg" }, focus: [0.5, 0.55], title: "Bear Creek Park spray park", sub: "Surrey, British Columbia · Product Portfolio Book, page 129", alt: "StreetBond colour on the Bear Creek Park spray park, Surrey, British Columbia" },
      // map:montreal-guido-nincheri, post:pedestrian-channelization-public-spaces
      { src: { cdn: "5716ebf4509410e168d52d683971e967f52ae72a-2400x1800.jpg" }, focus: [0.5, 0.58], title: "Parc Guido-Nincheri promenade", sub: "Montréal, Québec", alt: "Red and white StreetBond bands on the promenade of Parc Guido-Nincheri, Montréal, Québec" },
    ],
    // book pp.26–27
    colours: {
      heading: "Sixty-three colours",
      families: ["ema-2026"],
      note: "The complete StreetBond colour range. Custom Pantone matching available. Swatches are indicative: specify by name and request a physical sample for colour approval.",
    },
    whereTitle: "In the Product Portfolio Book",
    where: [
      { name: "Sport courts", note: "Court colour on asphalt or concrete", page: 48 },
      { name: "Play surfaces", note: "Any colour, UV stable", page: 58 },
      { name: "Splash pads", note: "Skid resistant, UV stable", page: 60 },
      { name: "Public art", note: "Large-scale colour fields", page: 66 },
      { name: "Townhomes", note: "Colour and sealing", page: 74 },
      { name: "Parking lots", note: "Colour and preservation", page: 78 }, // book: "to enhance and preserve" (DEPARTURES)
    ],
    documents: ["Brochure", "Colour card, 2026 edition", "Substrate guide", "Colourant technical data sheet", "SB120 and SB150 specifications and data sheets", "Over-concrete specifications", "Concrete primer data sheets"],
    topic: "StreetBond",
  },
  {
    slug: "streetbondsr",
    headline: book("streetbondsr").title, // book p.29
    subhead: book("streetbondsr").subhead, // book p.29
    body: [
      // products (lightly cut; "engineered for" becomes "made for")
      "StreetBondSR is StreetBond formulated to reflect rather than absorb: the same flexible chemistry, made for cooler surfaces. Twelve colours carry an initial solar reflectance of 0.33 or higher and can contribute to the LEED v5 Sustainable Sites credit for heat island reduction (non-roof).",
      // docs/GLOSSARY.md (urban heat island), products
      "Dark pavement is one cause of the urban heat island, the measurable temperature difference between a city and the country around it. Applied to asphalt for parking, plazas, schools and LEED projects, StreetBondSR lowers surface temperature relative to dark pavement, with the durability and slip resistance of the StreetBond system.",
    ],
    specs: [
      { label: "Type", value: "Solar reflective epoxy-modified acrylic" }, // products
      { label: "Solar reflectance", value: "0.33 or higher, initial, 12 colours" }, // book, products
      { label: "LEED", value: "v5 SS credit: heat island reduction (non-roof)" }, // book, docs/GLOSSARY.md
      { label: "Surfaces", value: "Asphalt" }, // book
      { label: "Service life", value: "8+ years" }, // book (WEB_EDITS)
    ],
    uses: book("streetbondsr").uses, // book p.29
    // map:osoyoos-jack-shaw-gardens, book p.100, post:streetbondsr-solar-reflective-coatings
    hero: { layout: "full", src: { cdn: "8e7fa9ea6509baecccf61813714ec97f77ceaf3b-2400x1800.jpg" }, focus: [0.5, 0.56], caption: "Jack Shaw Gardens, Osoyoos, British Columbia", alt: "A StreetBondSR path through Jack Shaw Gardens, Osoyoos, British Columbia" },
    jobsTitle: "From a fleet lot to an observatory",
    jobs: [
      // map:toronto-fleet-lot, book p.28 (no record names the owner)
      { src: { book: 28 }, focus: [0.5, 0.5], title: "A fleet lot in Toronto", sub: "Toronto, Ontario · Product Portfolio Book, page 28", alt: "A fleet lot in a solar reflective StreetBondSR coating, Toronto, Ontario" },
      // map:mont-megantic-observatory, book p.102
      { src: { pub: "/images/map/mont-megantic-observatory.jpg" }, focus: [0.5, 0.5], title: "Mont-Mégantic summit terrace", sub: "Mont-Mégantic, Québec · Product Portfolio Book, page 102", alt: "The white StreetBondSR terrace by the observatory domes on Mont-Mégantic, Québec" },
    ],
    // the 2026 colour card (lib/colours.ts, SR series)
    colours: {
      heading: "Twelve colours at SR 0.33 or higher",
      families: ["sr-series"],
      named: true,
      note: "Solar reflectance from the 2026 StreetBond colour card. Swatches are indicative: request a physical sample for colour approval.",
    },
    whereTitle: "In the Product Portfolio Book",
    where: [
      { name: "Sport courts", note: "Solar reflective: cooler underfoot", page: 48 },
      { name: "Play surfaces", note: "Cooler underfoot in full sun", page: 58 },
      { name: "Splash pads", note: "SR 0.33 or higher, keeps surfaces cooler", page: 60 }, // book: "LEED compliant" (DEPARTURES)
    ],
    documents: ["Brochure", "Flat surface specification", "Certificate of analysis: friction", "Colour guide, 2026"],
    topic: "StreetBondSR",
  },
  {
    slug: "decomark",
    headline: book("decomark").title, // book p.31 ("Custom graphics.")
    subhead: "Preformed thermoplastic made to your vector artwork, for community identity, commemorative art, wayfinding and civic landmarks at street scale.", // book p.31
    body: [
      // book p.31 with the site's verb ("then heat-fused to the substrate": DEPARTURES), products
      "Factory fabricated to your vector artwork using HUB's colour palette, in standard and premium colours, then heat-applied to asphalt or concrete, where it bonds to the surface.",
      "Crests, BIA marks, recognition markers and rail-safety reminders hold their contrast through freeze-thaw and plow seasons. Anti-skid aggregate runs through the material, so the grip lasts as the surface wears, and it does not alter the pavement underneath.", // products
    ],
    specs: [
      { label: "System", value: "Preformed thermoplastic" }, // book
      { label: "Thickness", value: "125 mil (3.2 mm)" }, // book p.56 SPECIFY; mm from docs/GLOSSARY.md
      { label: "Design", value: "Vector artwork" }, // book
      { label: "Colour", value: "Standard and premium options" }, // book
      { label: "Installation", value: "Heat-applied, bonds to the surface" }, // products
      { label: "Surfaces", value: "Asphalt and concrete" }, // products
    ],
    uses: book("decomark").uses, // book p.31
    // book p.30 ("Victoria, British Columbia"), map:victoria-high-school
    hero: { layout: "full", src: { cdn: "572a2f47001ab35bc0808df525f7dd49c81ec195-1800x2400.jpg" }, focus: [0.5, 0.66], caption: "Victoria High School, Victoria, British Columbia", alt: "A DecoMark Indigenous design at Victoria High School, Victoria, British Columbia" },
    how: {
      title: "Your artwork, made to last on the street",
      body: "DecoMark is cut in the factory from your vector artwork. On site it is heat-applied to asphalt or concrete with a propane torch or an infrared heater, and it bonds to the surface without altering the pavement underneath.", // products, docs/GLOSSARY.md
    },
    jobsTitle: "Identity, memory and a safety message",
    jobs: [
      // map:brantford-safety-village-look-listen-live, post:look-listen-live-rail-safety-marking-brantford
      { src: { cdn: "ee15b49c5e06f7fbbf09aa2b131138d16bc64c63-1280x960.jpg" }, focus: [0.5, 0.62], title: "Look Listen Live rail safety marking", sub: "Brantford, Ontario", alt: "A yellow Look Listen Live DecoMark marking on a sidewalk at a rail crossing, Brantford, Ontario" },
      // map:toronto-geary-avenue-park, book p.97, post:geary-works-toronto-park-walkway
      { src: { cdn: "06cd4e8b7cfd065a0f3248fe06e3b0c3f9ae87f8-2400x1800.jpg" }, focus: [0.5, 0.55], title: "Geary Avenue Park path", sub: "Toronto, Ontario · Product Portfolio Book, page 97", alt: "Green DecoMark gears and the words Geary Works on a park path, Toronto, Ontario" },
      // map:fort-langley-land-recognition, book p.114 (approximate: the town only)
      { src: { cdn: "1b2cb6050840a10057e1585cf83bf07013c07e0f-1800x2400.jpg" }, focus: [0.5, 0.62], title: "First Nations land recognition", sub: "Fort Langley, British Columbia · Product Portfolio Book, page 114", alt: "A DecoMark First Nations land recognition medallion, Fort Langley, British Columbia" },
    ],
    colours: TP_COLOURS, // book pp.14–15 names DecoMark
    whereTitle: "In the Product Portfolio Book",
    where: [
      { name: "Crosswalks", note: "Custom graphics: community identity", page: 46 },
      { name: "Creative design", note: "125 mil preformed custom graphics", page: 56 },
      { name: "Play surfaces", note: "Custom graphics and play markings", page: 58 },
      { name: "Public art", note: "Artwork and graphics", page: 66 },
      { name: "Community branding", note: "Horizontal wayfinding and community or BIA branding", page: 68 },
    ],
    documents: ["Technical specification (TS004)", "Specification", "Application instructions", "Custom design guidelines", "Colour guide"],
    topic: "DecoMark",
  },
  {
    slug: "mmax",
    headline: book("mmax").title, // book p.33 ("MMA area markings.")
    subhead: "Red bus lanes, green bike lanes and transit priority lanes, traffic-ready in 45–60 minutes.", // products, book
    body: [
      // book p.33 ("Best in class performance." left out: DEPARTURES)
      "Methyl methacrylate allows for fast return to service, so an active corridor is installed with minimal community disruption. Available in 8 standard colours along with 15 premium colours.",
      "MMAX is a methyl methacrylate (MMA) area marking: a two-part resin with hard aggregate and colourfast pigment. The aggregate gives it grip, and it goes down from +3°C and rising, which matters in a Canadian season.", // products
    ],
    specs: [
      { label: "Material", value: "Methyl methacrylate (MMA) resin" }, // book
      { label: "Cure", value: "45–60 min, traffic-ready" }, // book
      { label: "Traction", value: "Embedded aggregate, skid-resistant" }, // products (the book's "non-slip": DEPARTURES)
      { label: "Min. installation temp.", value: "+3°C" }, // book
      { label: "Colours", value: "8 standard, 15 premium" }, // book
    ],
    uses: book("mmax").uses, // book p.33
    // book p.32 ("London, Ontario"), map:london-east-brt
    hero: { layout: "full", src: { cdn: "80861000deca287ab75d646d2ea1635c7faa61e4-2400x1800.jpg" }, focus: [0.5, 0.6], caption: "London, Ontario", alt: "A red MMAX bus lane marked BUS ONLY in London, Ontario" },
    how: {
      title: "Marked in one overnight closure",
      body: "A two-part resin with hard aggregate and colourfast pigment, applied cold. It is traffic-ready in 45–60 minutes, so an active corridor can be marked in one overnight closure, from +3°C and rising.", // products, book
    },
    jobsTitle: "Transit corridors in Ontario",
    jobs: [
      // map:london-east-brt, book p.90, post:london-east-link-brt
      { src: { cdn: "7d39f59f4471eb792ed12454463c26e9ce469c8a-2400x1800.jpg" }, focus: [0.5, 0.55], title: "East London Link rapid transit", sub: "London, Ontario · Product Portfolio Book, page 90", alt: "A bus in a red MMAX lane on the East London Link, London, Ontario" },
      // map:toronto-ttc-bus-corridors, post:extending-transit-lane-lifespan
      { src: { cdn: "fc2138d3fdc5fdbff12c355b0c7266259b8e509d-1200x866.jpg" }, focus: [0.5, 0.55], title: "TTC bus priority corridors", sub: "Toronto, Ontario", alt: "A TTC bus in a red MMAX bus lane, Toronto, Ontario" },
    ],
    colours: {
      heading: "Standard and premium colours",
      families: ["mmax-standard", "mmax-premium"],
      note: "Eight standard and fifteen premium colours, each matched to its closest PMS reference. Premium colours carry a minimum order of 20 kits (40 gallons).", // lib/colours.ts, from the maker's palette
    },
    whereTitle: "In the Product Portfolio Book",
    where: [
      { name: "Bike lanes", note: "Methyl methacrylate with corundum or sand", page: 50 },
      { name: "Transit corridors", note: "MMA resin: lane and area markings", page: 52 },
      { name: "Pedestrian safety", note: "MMA resin: 45–60 minute cure", page: 62 },
    ],
    documents: ["Colour palette", "Next-Gen brochure", "Corundum area marking application instructions", "Product data sheet", "Extended-season data sheets"],
    topic: "MMAX",
  },
  {
    slug: "duratherm",
    headline: book("duratherm").title, // book p.35 ("Inlaid thermoplastic.")
    subhead: "Thermoplastic set into a stamped surface. Zero profile above grade.", // book p.35 ("Heat-fused" left out: DEPARTURES)
    body: [
      // products (the book's "Reflective options" left out: docs/GLOSSARY.md says DuraTherm carries no glass beads)
      "The asphalt is heated and stamped first; precut 90 mil thermoplastic is set into the impressions and bonded with an infrared heater, so the finished surface sits flush with the road: nothing for a plow blade to catch, nothing to trip on, no shear damage through winter maintenance.",
      "The look of a decorative crosswalk with zero profile above grade, specified for crosswalks, speed tables, traffic calming and identity work where winter maintenance would strip anything that sits on top.", // products
    ],
    specs: [
      { label: "Install", value: "Inlaid into a stamped surface" }, // book
      { label: "Thermoplastic", value: "90 mil, precut" }, // products (PPG TS003 via docs/GLOSSARY.md)
      { label: "Profile", value: "Zero, flush with the road" }, // book
      { label: "Snowplow safe", value: "Yes, no shear risk" }, // book
      { label: "Bond", value: "Bonded to the asphalt with an infrared heater" }, // products (the book's "Heat-fused": DEPARTURES)
    ],
    uses: book("duratherm").uses, // book p.35 (WEB_EDITS: speed tables)
    // book p.34 ("Toronto, Ontario"), map:toronto-traffic-calming-markings
    hero: { layout: "full", src: { cdn: "8a3bc196f60cb2d0acd42d9a389654c709f5aa0a-2400x1800.jpg" }, focus: [0.5, 0.6], caption: "Toronto, Ontario", alt: "A DuraTherm inlaid marking on a traffic-calmed street in Toronto, Ontario" },
    steps: {
      title: "Inlaid into a stamped surface", // book p.35
      items: [
        { name: "Stamp", body: "The asphalt is heated and stamped first." }, // products
        { name: "Inlay", body: "Precut 90 mil thermoplastic is set into the impressions." }, // products
        { name: "Bond", body: "An infrared heater bonds it, and the finished surface sits flush with the road." }, // products
      ],
    },
    jobsTitle: "Out of a plow's way",
    jobs: [
      // map:vancouver-immaculate-conception, book p.121
      { src: { pub: "/images/map/vancouver-immaculate-conception.jpg" }, focus: [0.5, 0.6], title: "Immaculate Conception School", sub: "Vancouver, British Columbia · Product Portfolio Book, page 121", alt: "A blue DuraTherm hexagon pattern at Immaculate Conception School, Vancouver, British Columbia" },
      // map:north-van-spirit-trail, post:spirit-trail-wayfinding-vancouver (approximate: the town only)
      { src: { cdn: "83d82900e46ce407544ebe3ac466d3b6a1188cac-1600x1200.jpg" }, focus: [0.5, 0.55], title: "Spirit Trail crosswalks", sub: "North Vancouver, British Columbia", alt: "A DuraTherm crosswalk on the Spirit Trail, North Vancouver, British Columbia" },
    ],
    list: {
      kick: "On the product page",
      heading: "Specifications and guides",
      items: [{ text: "Technical specification (TS003)" }, { text: "Specification, branded" }, { text: "Design manual" }, { text: "Custom design guidelines" }, { text: "Colour guide" }],
      oneColumn: true,
    },
    whereTitle: "The jobs it is specified for",
    where: [{ name: "Crosswalks" }, { name: "Speed tables" }, { name: "Traffic calming" }, { name: "Community identity" }], // book p.35 uses strip, products
    documents: [],
    topic: "DuraTherm",
  },
  {
    slug: "durashield",
    headline: book("durashield").title, // book p.37
    subhead: book("durashield").subhead, // book p.37
    body: [
      book("durashield").description, // book p.37
      "For parking lots, driveways, pathways and LEED sites, it maintains a surface instead of replacing it.", // products
    ],
    specs: [
      { label: "Type", value: "Two-component epoxy-modified acrylic" }, // book, products
      { label: "Surfaces", value: "Asphalt" }, // products
      { label: "Chemical resistance", value: "Fuel, oil, de-icing agents" }, // book
      { label: "Solar reflectance", value: "Optional: SR Gray" }, // book, products (the card's figure is on the back)
      { label: "Skid resistance", value: "Meets ASTM E303" }, // docs/GLOSSARY.md (GAF DuraShield page)
    ],
    uses: book("durashield").uses, // book p.37
    // the product folder (lib/image-facts.ts: DuraShield); no record places it, so no caption
    hero: { layout: "full", src: { pub: "/images/products/durashield/durashield-11.jpg" }, focus: [0.5, 0.62], alt: "A residential driveway in a DuraShield maintenance coating" },
    how: {
      title: "Maintain the surface instead of replacing it",
      body: "A maintenance coating for asphalt, old and new: it resists fuel, oil and de-icing agents, cools the surface with its solar-reflective option, and protects the pavement underneath.", // book p.37, products
    },
    jobsTitle: "Lots and drives",
    jobs: [
      // book p.36 ("Etobicoke, Ontario")
      { src: { book: 36 }, focus: [0.5, 0.6], title: "A commercial lot in Etobicoke", sub: "Etobicoke, Ontario · Product Portfolio Book, page 36", alt: "A DuraShield-coated commercial lot in Etobicoke, Ontario" },
      // the product folder; no record places it
      { src: { pub: "/images/products/durashield/durashield-10.jpg" }, focus: [0.5, 0.55], title: "A coated parking lot", sub: "From HUB's DuraShield photographs", alt: "A parking lot in DuraShield coating, seen from above" },
    ],
    // the 2026 colour card (lib/colours.ts, DuraShield)
    colours: {
      heading: "Two greys on the 2026 colour card",
      families: ["durashield"],
      named: true,
      note: "Solar reflectance from the 2026 StreetBond colour card. Request a physical sample for colour approval.",
    },
    whereTitle: "In the Product Portfolio Book",
    where: [
      { name: "Townhomes", note: "Shared-drive maintenance", page: 74 },
      { name: "Parking lots", note: "Maintenance coating", page: 78 },
      { name: "Driveways" },
      { name: "Pathways" },
      { name: "LEED sites" },
    ],
    documents: ["Part A+B Asphalt: technical data sheet", "Part A+B Solar Gray: technical data sheet"],
    topic: "DuraShield",
  },
  {
    slug: "premark",
    headline: book("premark").title, // book p.39 ("Road marking symbols.")
    subhead: "Arrows, stop bars, yield triangles, school legends, bike symbols and ladder lines, pre-cut to specification.", // book p.39
    body: [
      "Heat-applied by torch: no stencils, no curing window, drive on immediately.", // book p.39 (WEB_EDITS: "Provincially approved" cut)
      "Integrated glass beads give the markings retroreflectivity, so they return a driver's headlights at night. PreMark is 125 mil as standard, with a 90 mil ViziGrip option, and its service life is 6–8 years.", // products, docs/GLOSSARY.md
    ],
    specs: [
      { label: "Material", value: "Preformed thermoplastic" }, // products
      { label: "Thickness", value: "125 mil standard / 90 mil ViziGrip" }, // book
      { label: "Installation", value: "Heat-applied, drive on immediately" }, // book, products
      { label: "Retroreflectivity", value: "Integrated glass beads" }, // book
      { label: "Service life", value: "6–8 years" }, // book
    ],
    uses: book("premark").uses, // book p.39
    // book p.38 ("City of Delta, British Columbia"), map:delta-cascades-casino
    hero: { layout: "full", src: { book: 38 }, focus: [0.5, 0.6], caption: "City of Delta, British Columbia", alt: "PreMark crosswalk markings at Cascades Casino, City of Delta, British Columbia" },
    how: {
      title: "Pre-cut, then heat-applied",
      body: "Each symbol or legend arrives pre-cut to specification. On site it is heat-applied with a torch and bonds to the surface, and traffic drives on it immediately: no stencils and no curing window.", // book p.39, products, docs/GLOSSARY.md
    },
    jobsTitle: "Symbols, legends and lines",
    jobs: [
      // the product folder (lib/image-facts.ts: PreMark)
      { src: { pub: "/images/products/premark/premark-07.jpg" }, focus: [0.5, 0.5], title: "A bike lane symbol going down", sub: "From HUB's PreMark photographs", alt: "A PreMark bike symbol being heat-applied in a green bike lane" },
      // lib/image-facts.ts: Granville Island, Vancouver (by eye: the Kids Market building)
      { src: { pub: "/images/products/premark/premark-11.jpg" }, focus: [0.5, 0.6], title: "Speed legends", sub: "Granville Island, Vancouver, British Columbia", alt: "PreMark 30 km/h speed legends on Granville Island, Vancouver, British Columbia" },
      // the product folder
      { src: { pub: "/images/products/premark/premark-04.jpg" }, focus: [0.5, 0.5], title: "Shared lane markings", sub: "From HUB's PreMark photographs", alt: "PreMark shared lane symbols and legend on asphalt" },
    ],
    whereTitle: "In the Product Portfolio Book",
    where: [
      { name: "Bike lanes", note: "Bike lane markings, optional integrated symbols", page: 50 },
      { name: "Pedestrian safety", note: "Retroreflective symbols and legends", page: 62 },
      { name: "Regulatory markings" },
      { name: "Crosswalks" },
      { name: "Parking lots" },
    ],
    documents: ["Technical specification (TS005)", "PreMarkXF brochure"],
    topic: "PreMark",
  },
  {
    slug: "airmark",
    headline: "Preformed thermoplastic for airfield markings.", // products shortDesc
    subhead: "Taxiways, aprons, hold positions and other non-runway surfaces.", // products
    body: [
      "Glass beads are embedded through the full cross-section of the material, so retroreflectivity holds as the surface wears. HUB's certified installers heat-apply it, and it resists aviation fuels, lubricants and de-icers.", // products ("certified crews": certified installers)
      "It is specified for taxiway markings, hold positions, apron and ramp markings, aircraft parking and tie-down positions, and airside vehicle roadways.", // products
    ],
    specs: [
      { label: "Material", value: "Preformed thermoplastic" }, // products
      { label: "Retroreflectivity", value: "Glass beads through the full cross-section" }, // products
      { label: "Installation", value: "Heat-applied, bonds to the surface" }, // products
      { label: "Resists", value: "Aviation fuels, lubricants, de-icers" }, // products
      { label: "Colours", value: "Five standard: white, yellow, red, black, pink" }, // products
      { label: "Surfaces", value: "Non-runway airside pavement" }, // products
    ],
    uses: ["Taxiways", "Aprons", "Hold positions", "Airside roads"], // products
    // the product folder (lib/image-facts.ts: AirMark); no record places it, so no caption
    hero: { layout: "full", src: { pub: "/images/products/airmark/airmark-04.jpg" }, focus: [0.5, 0.62], alt: "Yellow AirMark taxiway markings on an airfield, with a control tower behind" },
    how: {
      title: "Heat-applied by certified installers",
      body: "AirMark is preformed thermoplastic with glass beads through its full thickness. A certified installer heat-applies it to the pavement, where it bonds, and as the surface wears new beads keep the marking retroreflective.", // products, docs/GLOSSARY.md
    },
    jobsTitle: "Airside, from the taxiway to the roadway",
    jobs: [
      // the product folder
      { src: { pub: "/images/products/airmark/airmark-11.jpg" }, focus: [0.5, 0.55], title: "Hold position marking", sub: "From HUB's AirMark photographs", alt: "A red and white AirMark hold position marking on an airfield" },
      // the product folder
      { src: { pub: "/images/products/airmark/airmark-09.jpg" }, focus: [0.5, 0.6], title: "Aircraft stand marking", sub: "From HUB's AirMark photographs", alt: "A yellow AirMark aircraft stand marking, numbered 124, on an apron" },
      // lib/image-facts.ts: Toronto Pearson International Airport (by eye)
      { src: { pub: "/images/products/airmark/airmark-07.jpg" }, focus: [0.5, 0.6], title: "Airside vehicle roadway", sub: "Toronto Pearson International Airport, Mississauga, Ontario", alt: "A 40 km/h AirMark speed marking on an airside roadway at Toronto Pearson International Airport" },
    ],
    list: {
      kick: "Where it goes",
      heading: "Non-runway airside surfaces",
      items: [{ text: "Taxiway markings" }, { text: "Hold positions" }, { text: "Apron and ramp markings" }, { text: "Aircraft parking and tie-down positions" }, { text: "Airside vehicle roadways" }],
      oneColumn: true,
    },
    documents: ["AirMark brochure, English and French", "TrafficPaint for Airfields brochure, English and French", "WB airfield product data sheet", "PreMark for groundside airports brochure"],
    topic: "AirMark",
  },
  {
    slug: "chipfill",
    headline: "Thermoplastic chips for pothole repair, heated in place.", // products shortDesc ("permanent" kept off the headline: DEPARTURES)
    subhead: "Year-round, in any weather, with a propane torch and no hot-mix plant.", // products
    body: [
      "ChipFill is thermoplastic in small chips: poured into the prepared hole, levelled and heated with a propane torch, so it needs no specialized equipment and no hot-mix plant.", // products
      "Once heated, it conforms to the shape of the damage and bonds to the surrounding asphalt or concrete, sealing out the water that drives freeze-thaw damage. The lane reopens to traffic within minutes.", // products
    ],
    specs: [
      { label: "Type", value: "Thermoplastic repair chips, heated in place" }, // products
      { label: "Equipment", value: "A propane torch" }, // products
      { label: "Surfaces", value: "Asphalt and concrete" }, // products
      { label: "Weather", value: "Any, year-round" }, // products
      { label: "Back in service", value: "Minutes" }, // products
      { label: "Best for", value: "Smaller potholes, cracks, joints" }, // products
    ],
    uses: ["Patrol patching", "Emergency repairs", "Utility cuts", "Edge joints"], // products
    // the product folder: the site's own ChipFill hero
    hero: { layout: "framed", src: { pub: "/images/products/chipfill/chipfill-application.jpg" }, focus: [0.5, 0.5], alt: "ChipFill chips being poured into a pothole" },
    steps: {
      title: "Pour, heat, reopen",
      items: [
        { name: "Pour", body: "The chips are poured into the prepared hole and levelled.", photo: { src: { pub: "/images/products/chipfill/chipfill-02.jpg" }, focus: [0.5, 0.62], alt: "ChipFill chips levelled in a pothole" } }, // products
        { name: "Heat", body: "A propane torch heats them in place, and the repair conforms to the shape of the damage.", photo: { src: { pub: "/images/products/chipfill/chipfill-03.jpg" }, focus: [0.5, 0.5], alt: "A propane torch heating ChipFill" } }, // products
        { name: "Reopen", body: "It bonds to the surrounding asphalt or concrete and seals out water. The lane reopens within minutes." }, // products
      ],
    },
    jobs: [],
    pairWith: {
      kick: "For larger potholes",
      heading: "With AggreFill",
      body: "Where the damage is too deep or wide for ChipFill alone, AggreFill, a pre-coated aggregate, fills the void and ChipFill bonds the aggregate and seals the repair flush.", // products (AggreFill)
    },
    whereTitle: "Roads, lots and paths",
    where: [{ name: "Roads", note: "Patrol patching and emergency repairs" }, { name: "Parking lots", note: "Potholes and edge joints" }, { name: "Sidewalks and pathways", note: "Smaller potholes and cracks" }, { name: "Utility cuts" }], // products
    documents: [],
    topic: "ChipFill",
  },
  {
    slug: "aggrefill",
    headline: "Pre-coated aggregate for larger potholes.", // products shortDesc
    subhead: "Used with ChipFill, for potholes too deep or wide for ChipFill alone.", // products
    body: [
      "AggreFill is a pre-coated aggregate filler used with ChipFill to repair larger potholes: deep road failures, parking lot craters, industrial-site damage and utility cuts.", // products ("permanently" left out: DEPARTURES)
      "AggreFill fills the void and ChipFill bonds the aggregate and seals the repair flush. The system goes in cold and is finished with a heat torch, bonding to the surrounding asphalt or concrete. It can be installed year-round in any weather, and the lane reopens to traffic within minutes.", // products
    ],
    specs: [
      { label: "Type", value: "Pre-coated aggregate, used with ChipFill" }, // products
      { label: "How it goes in", value: "Poured cold, finished with a torch and ChipFill" }, // products
      { label: "Surfaces", value: "Asphalt and concrete" }, // products
      { label: "Best for", value: "Potholes too deep or wide for ChipFill alone" }, // products
      { label: "Back in service", value: "Minutes" }, // products
      { label: "Weather", value: "Any, year-round" }, // products
    ],
    uses: ["Deep road failures", "Parking lot craters", "Industrial sites", "Utility cuts"], // products
    // the product folder (lib/products.ts gallery): the aggregate beside ChipFill's chips
    hero: { layout: "framed", small: true, src: { pub: "/images/products/aggrefill/aggrefill-03.jpg" }, focus: [0.5, 0.5], caption: "AggreFill aggregate beside ChipFill chips", alt: "Black AggreFill aggregate beside white ChipFill chips" },
    steps: {
      title: "Fill, seal, heat",
      items: [
        { name: "Fill", body: "AggreFill fills the void in a pothole too deep or wide for ChipFill alone.", photo: { src: { pub: "/images/products/aggrefill/aggrefill-02.jpg" }, focus: [0.5, 0.55], alt: "AggreFill and ChipFill in a repair" } }, // products
        { name: "Seal", body: "ChipFill goes on top, to bond the aggregate and seal the repair flush." }, // products
        { name: "Heat", body: "A heat torch finishes the repair, bonding it to the surrounding asphalt or concrete. The lane reopens within minutes." }, // products
      ],
    },
    jobs: [],
    pairWith: {
      kick: "For smaller repairs",
      heading: "ChipFill on its own",
      body: "ChipFill is thermoplastic in small chips, heated in place with a propane torch. On its own it repairs smaller potholes, cracks and joints.", // products (ChipFill)
    },
    whereTitle: "Larger repairs",
    where: [{ name: "Roads", note: "Deep road failures" }, { name: "Parking lots", note: "Craters" }, { name: "Industrial sites", note: "Site damage" }, { name: "Utility cuts" }], // products
    documents: [],
    topic: "AggreFill",
  },
  {
    slug: "fast-patch",
    headline: "Pourable polymer repair for potholes, spalls and utility cuts.", // products shortDesc
    subhead: "Back in service in about an hour at 21°C.", // products
    body: [
      "Fast Patch DPR is a distressed pavement repair material for asphalt and concrete: a pourable polymer blend of recycled and renewable materials for high-strength repairs to potholes, spalls, joints, wheel paths and utility cuts.", // products
      "With minimal site preparation, a repair is back in service in about an hour at 21°C, and the optional Fast Patch Kicker accelerator shortens the cure in cooler conditions. It bonds to the surrounding pavement and resists freeze-thaw, and because it is odourless and 100% solids it can be used indoors, on warehouse floors.", // products
    ],
    specs: [
      { label: "Type", value: "Pourable polymer-blend pavement repair" }, // products
      { label: "Made from", value: "Recycled and renewable polymers" }, // products
      { label: "Return to service", value: "About 1 hour at 21°C" }, // products
      { label: "Cold weather", value: "Fast Patch Kicker accelerator shortens the cure" }, // products
      { label: "Surfaces", value: "Asphalt and concrete, indoors too" }, // products
    ],
    uses: ["Potholes", "Spalls", "Joints", "Utility cuts"], // products
    // the product folder: the site's own Fast Patch DPR hero
    hero: { layout: "framed", src: { pub: "/images/products/fast-patch/fastpatch-repaired.jpg" }, focus: [0.5, 0.5], caption: "A finished Fast Patch DPR repair", alt: "A finished Fast Patch DPR repair in asphalt" },
    steps: {
      title: "Mix, pour, finish", // products (the method on its page)
      items: [
        { name: "Mix", body: "A pourable polymer blend, made from recycled and renewable materials.", photo: { src: { pub: "/images/products/fast-patch/fastpatch-bucket.jpg" }, focus: [0.5, 0.5], alt: "A Fast Patch DPR kit laid out" } }, // products
        { name: "Pour", body: "Poured into the pothole, spall, joint or cut, with minimal site preparation." }, // products
        { name: "Finish", body: "Back in service in about an hour at 21°C; the optional Fast Patch Kicker shortens the cure when it is cool." }, // products
      ],
    },
    jobs: [],
    pairWith: {
      kick: "Indoors too",
      heading: "Odourless, 100% solids",
      body: "Fast Patch DPR can be used indoors, on warehouse floors, as well as on roads, parking lots, sidewalks and utility cuts.", // products
    },
    whereTitle: "Roads, lots, sidewalks and floors",
    where: [{ name: "Roadways", note: "Potholes, wheel paths, joints" }, { name: "Parking lots" }, { name: "Sidewalks" }, { name: "Warehouse floors", note: "Indoors" }, { name: "Utility cuts" }], // products
    documents: [],
    topic: "Fast Patch DPR",
  },
];

/**
 * Every departure from the printed page, one line each (docs/GLOSSARY.md is
 * the reason unless another is given), for the next print run's review.
 */
export const DEPARTURES = [
  "TrafficPatternsXD, p.16: \"fuses the panels ... creating a permanent, skid-resistant surface\" printed as \"bonds the panels ... creating a skid-resistant surface\" (heat-applied, not fused; every system has a service life).",
  "TrafficPatternsXD, p.78 SPECIFY: \"high-traffic bays and crossings\" printed as \"High-traffic bays and crosswalks\".",
  "StreetPrint, p.19: \"no slip, no trip\" left out (no non-slip promise); \"Base\" printed as \"Surface\" (the glossary keeps base for the gravel).",
  "StreetPrint, p.20: \"using the industry's most advanced asphalt coating\" and \"safe for the environment\" left out (claims with no source on file).",
  "StreetBond, p.25: the subhead \"Engineered for life in Canada\" not used (\"engineered for\" is on the site's list of words it does not use); p.78 SPECIFY \"to enhance and preserve\" printed as \"Colour and preservation\".",
  "StreetBondSR, p.60 SPECIFY: \"LEED compliant\" left out (a coating can contribute to a credit; it is not compliant on its own).",
  "DecoMark, p.31: \"then heat-fused to the substrate\" printed as \"then heat-applied to asphalt or concrete, where it bonds to the surface\" (lib/products.ts).",
  "MMAX, p.33: \"Best in class performance.\" left out; the spec \"Embedded aggregate / non-slip\" printed as lib/products.ts's \"Embedded aggregate, skid-resistant\".",
  "DuraTherm, p.35: \"Heat-fused\" left out of the subhead; the spec \"Heat-fused to asphalt substrate\" printed as \"Bonded to the asphalt with an infrared heater\" (lib/products.ts); \"Reflective options\" left out (no glass beads in DuraTherm, docs/GLOSSARY.md).",
  "ChipFill and AggreFill: \"permanent\" kept off the headlines and the first paragraph (every repair has a life; the makers' word stays on the product pages).",
];

// ── What every flyer shares ────────────────────────────────────────────────

const familyOf = (slug: string) => PRODUCT_CATEGORIES.find((c) => c.slugs.includes(slug))?.label ?? "";
const nameOf = (slug: string) => {
  const p = products.find((x) => x.slug === slug);
  if (!p) throw new Error(`flyer-content: no product ${slug}`);
  return p.name;
};

/** The tags a flyer's links carry, so a visit from one shows in GA4: "pdf" a link clicked in the file, "qr" the code scanned off a printed copy. */
export const utm = (slug: string, medium: "qr" | "pdf") =>
  `utm_source=hubss-flyer&utm_medium=${medium}&utm_campaign=product-flyers-2026&utm_content=${slug}`;

export function completeFlyer(spec: FlyerSpec, offices: { west: Office; east: Office }): Flyer {
  const name = nameOf(spec.slug);
  const pageLabel = `hubss.com/products/${spec.slug}`;
  let colours: Flyer["colours"];
  if (spec.colours) {
    const chips = spec.colours.chips ?? (spec.colours.families ?? []).flatMap((k) => colourFamily(k)?.colours ?? []);
    if (!chips.length) throw new Error(`flyer-content: no colours for ${spec.slug}`);
    colours = { ...spec.colours, chips };
  }
  return {
    ...spec,
    name,
    family: familyOf(spec.slug),
    jobsKick: spec.jobsKick ?? "On the job",
    jobsTitle: spec.jobsTitle ?? "",
    colours,
    offices: [
      { ...offices.west, label: "West office", telHref: telHref(offices.west.phone) },
      { ...offices.east, label: "East office", telHref: telHref(offices.east.phone) },
    ],
    lunch: {
      title: `A Lunch & Learn on ${name}`,
      // lib/lunch-learn-content.ts and LunchLearnV2.tsx: 60 minutes, lunch on HUB, a $25 voucher when virtual, no invoice
      body: "Sixty minutes with your engineering, landscape architecture or planning team, in your office or online: the specification, the samples and your questions. Lunch is on us (a $25 voucher when the session is virtual), and nothing is invoiced.",
      href: `https://hubss.com${lunchLearnHref(spec.topic, "flyer").replace("#book", `&${utm(spec.slug, "pdf")}#book`)}`,
      label: "Book at hubss.com/lunch-learn",
    },
    closeTitle: "Ask for the certified installer in your region",
    qrCaption: "Spec sheets and jobs",
    pageLabel,
    pageHref: `https://${pageLabel}?${utm(spec.slug, "pdf")}`,
    qrHref: `https://${pageLabel}?${utm(spec.slug, "qr")}`,
    legal: spec.colours ? "© 2026 HUB Surface Systems. Colour chips are a print reference: approve colour from a physical sample." : "© 2026 HUB Surface Systems.",
    footLine: PRODUCT_CATALOGUE[spec.slug] ? `Product Portfolio Book · Volume 5, page ${PRODUCT_CATALOGUE[spec.slug].page}` : "hubss.com",
  };
}
