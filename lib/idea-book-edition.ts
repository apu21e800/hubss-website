/**
 * The HUB Product Book, Volume 5, as a digital edition (14 Oct 2026).
 *
 * Vern: "a mobile / virtual desktop version of the idea book that's not just
 * a square PDF ... same content in booklet, better display for mobile and
 * desktop experience. Doug's dream."
 *
 * The printed book is designed in two-page spreads: a photograph across one
 * page, the copy on the other. Shown one square page at a time, every spread
 * is cut in half and the type is too small to read on a phone. So this
 * edition is not the pages: it is the book's content, one "leaf" per printed
 * spread, laid out for the screen it is read on. The photographs are the
 * book's own page renders (public/catalogue/<edition>/, lib/catalogue.ts),
 * shown by the region that holds the photo; the words are the printed page's,
 * from the book's text layer (the system and application spreads in
 * lib/idea-book-print.ts, the rest here), with em dashes written out
 * (docs/STYLE.md). Nothing here is new copy: Doug signed off on the printed
 * page. (The product and application pages are built from an earlier
 * transcription of the Figma master, which went to press with edits; see
 * lib/idea-book-print.ts.)
 *
 * Every leaf names its printed pages, so the reader can open the spread as
 * printed (/product-book/<page>, the page-by-page reader) at any point.
 *
 * Pure data; the page is app/product-book/page.tsx. `npm run test:idea-book`
 * checks every reference and every page number.
 */

import { PRINT_APPLICATIONS, PRINT_SYSTEMS } from "@/lib/idea-book-print";
import { products } from "@/lib/products";
import { applications } from "@/lib/applications";
import { mapProjects } from "@/lib/map-projects";

/** A photograph on a printed page: which page, and the part of it that is the photo. */
export interface Photo {
  page: number;
  /** Where the photo starts and ends down the page, 0 to 1. A full-bleed page ends at 0.94, above its printed caption. */
  top?: number;
  bottom?: number;
  /** The point to keep when the photo is cropped to a screen, as CSS object-position. */
  focus?: string;
  alt: string;
}

/** "Brampton, Ontario | TrafficPatternsXD", as the book captions a photo. */
export interface Caption {
  place: string;
  system?: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface SpecifyLine {
  /** The system's slug on this site (products/<slug>), or a name the site has no page for. */
  slug?: string;
  name: string;
  note: string;
}

interface Base {
  /** The hash the leaf answers to: /product-book#streetbond. */
  id: string;
  /** The printed pages the leaf comes from, in order. */
  pages: number[];
  section: "front" | "systems" | "applications" | "projects" | "back";
}

export type Leaf =
  | (Base & { kind: "cover"; photo: Photo })
  | (Base & { kind: "welcome"; heading: string; accent: string; body: string; pointsTitle: string; pointsAccent: string; points: { title: string; body: string }[]; photos: (Photo & { line?: string; caption?: Caption })[] })
  | (Base & { kind: "divider"; title: string; subtitle?: string; photo: Photo; caption?: Caption; contents?: { name: string; slug: string; page: number; line: string }[] })
  | (Base & { kind: "system"; slug: string; photo: Photo; caption: Caption })
  | (Base & { kind: "colours"; eyebrow: string; title: string; subtitle: string; families: string[]; extra?: string })
  | (Base & { kind: "steps"; system: string; slug: string; title: string; subtitle?: string; steps: { name: string; body: string }[]; photo: Photo; result: string })
  | (Base & { kind: "templates"; title: string; subtitle: string; photo: Photo; groups: { title: string; items: string[] }[]; uses: string[] })
  | (Base & { kind: "application"; slug?: string; eyebrow: string; title: string; subhead: string; body: string; specify: SpecifyLine[]; number: number; photo: Photo; caption?: Caption; mapId?: string })
  | (Base & { kind: "statement"; eyebrow?: string; title: string; body?: string; photo: Photo; caption?: Caption; mapId?: string; post?: string })
  | (Base & { kind: "projects"; items: ProjectCard[] })
  | (Base & { kind: "then-now"; eyebrow: string; title: string; subhead: string; body: string; before: Photo; after: Photo; labels: [string, string]; caption?: Caption; specify: SpecifyLine[]; number: number; mapId?: string })
  | (Base & { kind: "installer"; region: string; title: string; body: string; phone: string; web: string; photo: Photo; caption?: Caption })
  | (Base & { kind: "partner"; photos: (Photo & { caption: Caption })[]; title: string; subtitle: string; body: string })
  | (Base & { kind: "closing"; title: string; accent: string; stats: string; line: string; communitiesTitle: string; communitiesLine: string; communities: string[] })
  | (Base & { kind: "lunch"; title: string; accent: string; body: string; points: string[]; contactsTitle: string; contactsEyebrow: string; contactsLine: string })
  | (Base & { kind: "back"; photo: Photo });

export interface ProjectCard {
  page: number;
  eyebrow?: string;
  title?: string;
  body?: string;
  caption: Caption;
  photo: Photo;
  /** The homepage map's entry for this job, when it has one. */
  mapId?: string;
  /** The article about this job, when there is one. */
  post?: string;
  /** A label printed on the photo, like "7 YEARS OLD". */
  badge?: string;
}

/** The site pages carry a baked caption from about 93% down; the band stops above it. */
const SITE_PAGE_CAPTION = 0.92;
const PROJECT_PHOTO = 0.631;
const INSTALLER_PHOTO = 0.556;

const full = (page: number, alt: string, focus = "50% 50%"): Photo => ({ page, bottom: SITE_PAGE_CAPTION, focus, alt });
const half = (page: number, alt: string, bottom = PROJECT_PHOTO): Photo => ({ page, bottom, focus: "50% 50%", alt });

const productName = (slug: string) => products.find((p) => p.slug === slug)?.name ?? slug;
const sys = (slug: string, note: string): SpecifyLine => ({ slug, name: productName(slug), note });

function project(card: Omit<ProjectCard, "photo" | "mapId" | "post"> & { photo?: Photo; mapId?: string; post?: string; fullBleed?: boolean }): ProjectCard {
  const map = card.mapId ? mapProjects.find((p) => p.id === card.mapId) : undefined;
  const alt = `${card.title ?? card.caption.place}${card.caption.system ? `, ${card.caption.system}` : ""}`;
  return {
    ...card,
    photo: card.photo ?? (card.fullBleed ? full(card.page, alt) : half(card.page, alt)),
    post: card.post ?? map?.post,
  };
}

const CONTENTS = [
  { slug: "traffic-patterns", page: 11, line: "Using colour, your design, heat-fused onto asphalt or concrete." },
  { slug: "traffic-patterns-xd", page: 13, line: "Using patterns, colour and aggregate, heat fused and stamped on asphalt." },
  { slug: "streetprint", page: 19, line: "The original stamped asphalt system." },
  { slug: "streetbond", page: 25, line: "Performance coatings that add colour and preservation to your projects." },
  { slug: "streetbondsr", page: 29, line: "Solar reflective coatings." },
  { slug: "decomark", page: 31, line: "Wayfinding, messaging, graphics, public art, heat-fused to asphalt or concrete." },
  { slug: "mmax", page: 33, line: "Industry leading MMA, transit lanes and area markings." },
  { slug: "duratherm", page: 35, line: "Inlaid, flush mounted thermoplastic markings." },
  { slug: "durashield", page: 37, line: "Maintenance coating for asphalt." },
  { slug: "premark", page: 39, line: "Pre-cut, heat-applied thermoplastic markings." },
].map((c) => ({ ...c, name: productName(c.slug) }));

export const LEAVES: Leaf[] = [
  { kind: "cover", id: "cover", section: "front", pages: [1], photo: { page: 1, alt: "The HUB Product Book cover: a Musqueam crosswalk in front of the HUB sign at UBC", focus: "50% 45%" } },
  {
    kind: "welcome", id: "welcome", section: "front", pages: [2, 3, 4, 5, 6, 7],
    heading: "Asphalt and concrete are the canvas.",
    accent: "Your city is the gallery.",
    body: "Each installation is a unique endeavour, designed to provide streetscapes and community areas with a powerful sense of civic identity. Every project we deliver serves as a reminder that our public spaces are vital, meaningful threads within the community.",
    pointsTitle: "Understanding what works.",
    pointsAccent: "Solutions for Canada.",
    points: [
      { title: "Built for freeze-thaw climates", body: "Stress-tested for temperature swings, snowplow blades, and constant use." },
      { title: "Year after year of proven performance", body: "Our materials outperform traditional systems using innovative technologies invented in Canada." },
      { title: "Visibility and safety in every condition", body: "High-contrast, UV stable colours and patterns. Retroreflective options and skid-resistant by design." },
      { title: "Specified coast to coast", body: "Trusted by transportation engineers, urban designers, landscape architects and municipalities Canada-wide." },
    ],
    photos: [
      { ...full(3, "A TrafficPatternsXD crosswalk in Grimsby, Ontario"), caption: { place: "Grimsby, Ontario" } },
      { ...full(6, "A TrafficPatternsXD crosswalk underfoot in Kitchener, Ontario", "50% 60%"), caption: { place: "Kitchener, Ontario" } },
      { page: 7, bottom: 0.66, focus: "50% 40%", alt: "A crosswalk at Brighouse Station in Richmond, BC", line: "Every crosswalk is a blank canvas.", caption: { place: "Richmond, BC" } },
    ],
  },
  {
    kind: "divider", id: "systems", section: "systems", pages: [8, 9],
    title: "Ten systems", subtitle: "Our systems, how they work, and where to find them.",
    photo: { page: 9, bottom: 0.74, focus: "50% 85%", alt: "A transit crosswalk in TrafficPatternsXD beside a bus lane" },
    contents: CONTENTS,
  },
  { kind: "system", id: "traffic-patterns", section: "systems", pages: [10, 11], slug: "traffic-patterns", photo: full(10, "A veterans memorial crosswalk in TrafficPatterns, Kitchener, Ontario", "50% 0%"), caption: { place: "Kitchener, Ontario" } },
  { kind: "system", id: "traffic-patterns-xd", section: "systems", pages: [12, 13], slug: "traffic-patterns-xd", photo: full(12, "A brick-pattern TrafficPatternsXD crosswalk in Kleinburg, Ontario", "50% 60%"), caption: { place: "Kleinburg, Ontario" } },
  {
    kind: "colours", id: "thermoplastic-colours", section: "systems", pages: [14, 15],
    eyebrow: "TrafficPatternsXD, TrafficPatterns and DecoMark", title: "Thirty-seven colours", subtitle: "Formulated for UV stability.",
    families: ["tp-standard", "tp-premium"], extra: "Natural brick blends: Sand, Chestnut, Brick Red and Dark Red Brick. Physical samples available by request.",
  },
  {
    kind: "steps", id: "place-heat-stamp", section: "systems", pages: [16, 17], system: "TrafficPatternsXD", slug: "traffic-patterns-xd",
    title: "Place. Heat. Stamp.",
    steps: [
      { name: "Place", body: "Aggregate-reinforced, preformed thermoplastic panels are positioned precisely on the prepared surface." },
      { name: "Heat", body: "Specialty heating equipment fuses the panels to the pavement, creating a permanent, skid-resistant surface." },
      { name: "Stamp", body: "Place the desired template on the surface and vibrate the template into the melted surface, while keying into the asphalt below." },
    ],
    photo: { page: 17, top: 0.084, bottom: SITE_PAGE_CAPTION, focus: "50% 50%", alt: "Stamped TrafficPatternsXD, the pattern and colour part of the surface" },
    result: "The result: pattern and colour become part of the surface.",
  },
  { kind: "system", id: "streetprint", section: "systems", pages: [18, 19], slug: "streetprint", photo: full(18, "A StreetPrint cobble driveway at a gated entrance", "50% 30%"), caption: { place: "Residential driveway" } },
  {
    kind: "steps", id: "reheat-stamp-coat", section: "systems", pages: [20, 21], system: "StreetPrint", slug: "streetprint",
    title: "Reheat. Stamp. Coat.", subtitle: "How genuine stamped asphalt is installed.",
    steps: [
      { name: "Reheat", body: "Infrared heaters bring the existing asphalt back to a workable temperature: no removal, no repaving, no excavation." },
      { name: "Stamp", body: "Flexible templates stamp the selected pattern of brick, cobble, herringbone or other standard or custom templates into the heated surface." },
      { name: "Coat", body: "StreetBond creates the colour, and seals the asphalt using the industry's most advanced asphalt coating. UV-stable, skid-resistant, flexible, and safe for the environment." },
    ],
    photo: full(21, "A StreetPrint brick-pattern path under autumn leaves", "50% 55%"),
    result: "The result: pattern and colour simulating brick and stone.",
  },
  {
    kind: "templates", id: "stamping-templates", section: "systems", pages: [22, 23],
    title: "Stamping templates.", subtitle: "Precision made templates for stamping decorative patterns into hot asphalt. Custom designs available.",
    photo: { page: 22, top: 0.4, bottom: 0.92, focus: "50% 50%", alt: "A herringbone stamping template drawn with its dimensions" },
    groups: [
      { title: "Field templates", items: ["Ashlar Slate", "British Cobble", "Offset Brick", "Random Slate", "Herringbone", "Diagonal Herringbone", "Thompson Stone", "Random Cobble", "Texas Cobble", "Tile Sets 6\", 8\", 12\"", "Eurofan", "Scallop"] },
      { title: "Border templates", items: ["Stacked Brick", "Texas Cobble", "Soldier Course", "Tile options"] },
      { title: "Custom", items: ["Custom templates available on request"] },
    ],
    uses: ["Crosswalks", "Entrances", "Driveways", "Plazas", "Streetscapes"],
  },
  { kind: "system", id: "streetbond", section: "systems", pages: [24, 25], slug: "streetbond", photo: full(24, "The red StreetBond walkway of Harbour Passage, Saint John, New Brunswick", "50% 55%"), caption: { place: "Saint John, New Brunswick", system: "Harbour Passage" } },
  {
    kind: "colours", id: "streetbond-colours", section: "systems", pages: [26, 27],
    eyebrow: "StreetBond colour", title: "Sixty-three colours", subtitle: "The complete StreetBond colour range. Custom Pantone matching available.",
    families: ["ema-2026", "durashield"],
    extra: "Twelve SR colours carry a solar reflectance of 0.33 or higher and can contribute to LEED heat-island reduction credits. Reflectance ASTM C1549, emittance ASTM C1371, SRI ASTM E1980. Swatches are indicative: specify by name and request a physical sample for colour approval.",
  },
  { kind: "system", id: "streetbondsr", section: "systems", pages: [28, 29], slug: "streetbondsr", photo: full(28, "A fleet lot in a solar-reflective StreetBondSR coating, Toronto, Ontario", "50% 0%"), caption: { place: "Toronto, Ontario" } },
  { kind: "system", id: "decomark", section: "systems", pages: [30, 31], slug: "decomark", photo: full(30, "A DecoMark Indigenous design at Victoria High School, Victoria, British Columbia", "50% 60%"), caption: { place: "Victoria, British Columbia" } },
  { kind: "system", id: "mmax", section: "systems", pages: [32, 33], slug: "mmax", photo: full(32, "A red MMAX bus lane in London, Ontario", "50% 55%"), caption: { place: "London, Ontario" } },
  { kind: "system", id: "duratherm", section: "systems", pages: [34, 35], slug: "duratherm", photo: full(34, "DuraTherm inlaid markings on a traffic-calmed street in Toronto, Ontario", "50% 55%"), caption: { place: "Toronto, Ontario" } },
  { kind: "system", id: "durashield", section: "systems", pages: [36, 37], slug: "durashield", photo: full(36, "A DuraShield-coated commercial lot in Etobicoke, Ontario", "50% 55%"), caption: { place: "Etobicoke, Ontario" } },
  { kind: "system", id: "premark", section: "systems", pages: [38, 39], slug: "premark", photo: full(38, "PreMark crosswalk markings at Cascades Casino, City of Delta, British Columbia", "50% 55%"), caption: { place: "City of Delta, British Columbia" } },
  {
    kind: "installer", id: "virtue-construction", section: "systems", pages: [40, 41],
    region: "HUB certified installer · Saskatchewan", title: "Saskatchewan winters. Saskatchewan crews.", body: "COR certified. Installing since 2009.",
    phone: "306.251.0177", web: "www.virtueconstruction.ca",
    photo: half(41, "A red TrafficPatternsXD crosswalk being installed on a small-town main street", INSTALLER_PHOTO),
  },
  {
    kind: "statement", id: "designed-for-the-city", section: "systems", pages: [42, 43],
    eyebrow: "In the field", title: "Designed for the city. Built to perform.",
    photo: { page: 42, bottom: 0.72, focus: "50% 60%", alt: "A TrafficPatternsXD plaza crossing in Kitchener-Waterloo, Ontario" }, caption: { place: "Kitchener-Waterloo, Ontario" },
  },
  {
    kind: "divider", id: "applications", section: "applications", pages: [44, 45],
    title: "Applications",
    photo: full(44, "A HUB crew installing a blue and green StreetBond design", "50% 28%"),
  },
  ...([
    ["crosswalks", 46, "Crosswalks", 1, "brampton-bramalea-terminal", "A TrafficPatternsXD crosswalk at Bramalea Terminal, Brampton, Ontario"],
    ["sport-courts", 48, "Sport courts", 2, "montreal-basketball-court", "A blue and yellow StreetBond basketball court in Montréal, Québec"],
    ["bike-lanes", 50, "Bike lanes", 3, undefined, "A cyclist on a green MMAX bike lane"],
    ["bus-lanes", 52, "Transit corridors", 4, "york-region-viva", "A VIVA bus at a TrafficPatternsXD crossing on Highway 7, Vaughan, Ontario"],
    ["traffic-calming", 54, "Traffic calming", 5, "cowichan-roundabout", "A StreetPrint roundabout apron in the Cowichan Valley, British Columbia"],
  ] as const).map(([slug, page, eyebrow, number, mapId, alt]) => applicationLeaf(slug, page, eyebrow, number, alt, mapId)),
  {
    kind: "application", id: "creative-design", section: "applications", pages: [56, 57],
    eyebrow: "Creative design", ...printedApplication("creative-design"),
    number: 6, photo: full(57, "The Every Child Matters crosswalk in TrafficPatterns", "50% 60%"), mapId: "kitchener-every-child-matters",
  },
  ...([
    ["playgrounds", 58, "Play surfaces", 7, "hamilton-play-pad", "A blue StreetBond compass play pad in Hamilton, Ontario"],
    ["splash-pads", 60, "Splash pads", 8, "saint-antoine-splash-pad", "A blue StreetBond splash pad in Saint-Antoine-sur-Richelieu, Québec"],
    ["pedestrian-safety", 62, "Pedestrian safety", 9, "waterloo-grandlinq-lrt", "A pedestrian with a white cane on a TrafficPatternsXD crossing, Kitchener, Ontario"],
    ["public-spaces", 64, "Public spaces", 10, undefined, "A StreetBond waterfront plaza in Montréal, Québec"],
    ["public-art", 66, "Public art", 11, undefined, "Street art by Fauxreel in DecoMark, Toronto, Ontario"],
    ["community-branding", 68, "Community branding", 12, "white-rock-seaside-stroll", "The Seaside Stroll crosswalk in White Rock, British Columbia"],
  ] as const).map(([slug, page, eyebrow, number, mapId, alt]) => applicationLeaf(slug, page, eyebrow, number, alt, mapId)),
  {
    kind: "application", id: "durability", section: "applications", pages: [70, 71],
    eyebrow: "Durability", ...printedApplication("durability"),
    number: 13, photo: full(71, "TrafficPatternsXD pavers up close, Markham, Ontario", "50% 55%"),
  },
  {
    kind: "then-now", id: "commercial-spaces", section: "applications", pages: [72, 73],
    eyebrow: "Commercial spaces", ...printedApplication("commercial-spaces"),
    before: { page: 73, top: 0, bottom: 0.355, focus: "50% 50%", alt: "The Oakville crossing in its first year" },
    after: { page: 73, top: 0.405, bottom: 0.81, focus: "50% 50%", alt: "The same crossing ten years on, in winter" },
    labels: ["Year 1", "Year 10"],
    number: 14, mapId: "oakville-ten-years",
  },
  ...([
    ["townhomes", 74, "Townhomes", 15, "richmond-parc-riviera", "A red and black StreetBond checkerboard walkway at Parc Riviera, Richmond, British Columbia"],
    ["residential-driveways", 76, "Homes", 16, undefined, "A StreetPrint circle driveway at a residence in British Columbia"],
    ["parking-lots", 78, "Parking lots", 17, "halton-hills-toronto-premium-outlets", "The StreetPrint entrance at Toronto Premium Outlets, Halton Hills, Ontario"],
  ] as const).map(([slug, page, eyebrow, number, mapId, alt]) => applicationLeaf(slug, page, eyebrow, number, alt, mapId)),
  {
    kind: "divider", id: "projects", section: "projects", pages: [80, 81],
    title: "Projects",
    photo: full(80, "StreetPrint laneways at the Oxford Townhomes, New Westminster, British Columbia", "50% 50%"), caption: { place: "New Westminster, British Columbia" },
  },
  {
    kind: "statement", id: "coast-to-coast", section: "projects", pages: [82, 83],
    eyebrow: "Across Canada", title: "Coast to coast. Setting design standards.",
    photo: full(83, "Sheffield Park's skate plaza and StreetBond paths from above, Coquitlam, British Columbia", "50% 50%"), caption: { place: "Sheffield Park, Coquitlam, British Columbia" }, mapId: "coquitlam-sheffield-park",
  },
  {
    kind: "partner", id: "streetbond-by-gaf", section: "projects", pages: [84, 85],
    photos: [
      { page: 84, top: 0, bottom: 0.52, focus: "50% 50%", alt: "Children on a green and blue StreetBond splash pad in Collingwood, Ontario", caption: { place: "Collingwood, Ontario" } },
      { page: 85, top: 0, bottom: 0.54, focus: "50% 50%", alt: "A colourful StreetBond courtyard path at Green Square, Kelowna, British Columbia", caption: { place: "Kelowna, British Columbia" } },
    ],
    title: "Preserving and protecting surfaces. Built for feet.",
    subtitle: "The chemistry under the colour.",
    body: "StreetBond by GAF. The coating chemistry under every StreetBond and StreetPrint surface in this book.",
  },
  {
    kind: "projects", id: "toronto-premium-outlets", section: "projects", pages: [86, 87], items: [
      project({ page: 86, eyebrow: "Toronto Premium Outlet Mall", title: "14-year-old entrance feature. Still performing every day.", caption: { place: "Halton Hills, Ontario", system: "TrafficPatternsXD" }, mapId: "halton-hills-toronto-premium-outlets" }),
      project({ page: 87, eyebrow: "Bus lanes", title: "Defining transit lanes.", body: "Bus lanes are the hardest duty a road surface sees: fully loaded buses braking, turning and pulling in at the same spot, all day, every day. Across Canada, transit teams are looking to MMAX area markings to define their transit projects.", caption: { place: "London, Ontario", system: "MMAX" }, mapId: "london-east-brt" }),
    ],
  },
  {
    kind: "projects", id: "toronto-lot-crossing", section: "projects", pages: [88], items: [
      project({ page: 88, caption: { place: "Toronto, Ontario", system: "TrafficPatternsXD" }, mapId: "toronto-lot-crossing", fullBleed: true }),
    ],
  },
  {
    kind: "installer", id: "multiseal", section: "projects", pages: [89],
    region: "HUB master installer · Ontario", title: "Proudly installing since 2001", body: "Crosswalks, transit projects, parks, schools, commercial properties and traffic calming across southern Ontario.",
    phone: "416.743.6017", web: "www.multiseal.net",
    photo: half(89, "A TrafficPatternsXD paver pattern up close", INSTALLER_PHOTO),
  },
  {
    kind: "projects", id: "london-two-products", section: "projects", pages: [90, 91], items: [
      project({ page: 90, eyebrow: "Transit corridors", title: "Two products, one solution.", body: "Combining TrafficPatternsXD for pedestrian safety with red MMAX for the dedicated transit lanes gave the City of London the solution it needed: one corridor, two materials, each doing the job it is built for.", caption: { place: "London, Ontario", system: "TrafficPatternsXD and MMAX" }, mapId: "london-east-brt" }),
      project({ page: 91, eyebrow: "Crosswalks", title: "Toronto's city streets.", body: "TrafficPatternsXD crosswalks used where maintenance-free surfaces are needed. With non-stop use in the toughest urban environments, this durable surface continues to perform 11 years later!", caption: { place: "Toronto, Ontario", system: "TrafficPatternsXD" }, mapId: "toronto-railway-lands" }),
    ],
  },
  {
    kind: "projects", id: "station-surfaces", section: "projects", pages: [92, 93], items: [
      project({ page: 92, eyebrow: "Station surfaces", title: "Where every passenger stands.", body: "Dual purpose: StreetBond coatings used to protect the snow-melt system while also preserving the asphalt for years to come.", caption: { place: "Metrolinx, Ontario", system: "StreetBond" }, post: "safety-durability-transit-stations" }),
      project({ page: 93, eyebrow: "Bus lanes", title: "Transit lanes should be visible.", body: "Bus lanes fail where the loads concentrate: stop pads, turning movements, stations. MMAX cures traffic-ready in 45 to 60 minutes and holds colour where painted treatments are gone within a season.", caption: { place: "London, Ontario", system: "MMAX" }, mapId: "london-east-brt" }),
    ],
  },
  {
    kind: "statement", id: "bc-childrens-hospital", section: "projects", pages: [94, 95],
    eyebrow: "StreetBond | DecoMark", title: "Playful surfaces. Healing spaces.",
    body: "StreetBond coatings and DecoMark surface graphics, including a meditation labyrinth, installed across active wards and ground-level plazas at BC Children's Hospital. Designed with Connect Landscape Architecture. The surfaces are slip-resistant, chemical-resistant, and built to perform in a healthcare environment.",
    photo: { page: 94, bottom: 0.72, focus: "50% 50%", alt: "The meditation labyrinth in StreetBond at BC Children's Hospital, Vancouver" },
    caption: { place: "BC Women and Children's Hospital, Vancouver, British Columbia" }, mapId: "bc-childrens-hospital",
  },
  {
    kind: "projects", id: "woodstock-geary", section: "projects", pages: [96, 97], items: [
      project({ page: 96, eyebrow: "Streetscapes", title: "Parking lanes with a subtle accent.", body: "A custom pattern was used to complete this StreetPrint project in the Woodstock downtown revitalization.", caption: { place: "Woodstock, Ontario", system: "StreetPrint" }, mapId: "woodstock-dundas-street" }),
      project({ page: 97, eyebrow: "Parks & paths", title: "Community branding.", body: "A park walkway with the surface doing the placemaking: colour and pattern set into the path itself for years to come.", caption: { place: "Toronto, Ontario", system: "DecoMark" }, mapId: "toronto-geary-avenue-park" }),
    ],
  },
  {
    kind: "projects", id: "york-region-richmond", section: "projects", pages: [98, 99], items: [
      project({ page: 98, eyebrow: "Crosswalk treatments", title: "Service life in years, not seasons.", caption: { place: "York Region, Ontario", system: "TrafficPatternsXD" }, mapId: "york-region-viva" }),
      project({ page: 99, eyebrow: "Pedestrian safety", title: "Pedestrian channelization.", body: "Keeping pedestrians in a clear, defined space while adding to the aesthetics of the surrounding environment.", caption: { place: "Richmond, British Columbia", system: "TrafficPatternsXD" }, mapId: "richmond-brighouse" }),
    ],
  },
  {
    kind: "then-now", id: "osoyoos", section: "projects", pages: [100, 101],
    eyebrow: "Parks & paths", title: "The path was already there. Now it reflects the sun.",
    subhead: "Three years on, this Osoyoos park path still reads as new, and runs cooler underfoot.",
    body: "StreetBondSR colours reflect sunlight rather than absorb it: solar reflectance of 0.33 or higher, so the surface stays cooler and can count toward LEED heat-island credits. Same path, same route through the park: three Okanagan seasons later, colour and grip are holding.",
    before: { page: 100, top: 0.36, bottom: 0.8, focus: "50% 50%", alt: "The terracotta StreetBondSR path at Jack Shaw Gardens, Osoyoos, when it was installed" },
    after: { page: 101, top: 0, bottom: 0.71, focus: "50% 60%", alt: "The same path three years later" },
    labels: ["Installed", "After 3 years"],
    caption: { place: "Osoyoos, British Columbia", system: "StreetBondSR" },
    specify: [sys("streetbondsr", "solar reflective coating, SR 0.33 or higher, cooler underfoot, LEED credit")],
    number: 0, mapId: "osoyoos-jack-shaw-gardens",
  },
  {
    kind: "projects", id: "mont-megantic", section: "projects", pages: [102], items: [
      project({ page: 102, photo: half(102, "The white StreetBondSR plaza between the domes of the Mont-Mégantic observatory", 0.558), eyebrow: "Observatory", title: "Lit by starlight.", body: "Inside the world's first International Dark Sky Reserve, outdoor lighting is kept to a bare minimum. A white StreetBondSR surface reflects what little light there is, so the summit's paths and plazas can be seen by starlight.", caption: { place: "Mont-Mégantic, Québec", system: "StreetBondSR" }, mapId: "mont-megantic-observatory" }),
    ],
  },
  {
    kind: "installer", id: "thermo-design", section: "projects", pages: [103],
    region: "HUB master installer · Québec", title: "20 ans d'innovation au Québec", body: "institutionnel | transport | commercial | municipal | passages pour piétons",
    phone: "450.698.0000", web: "www.thermo-design.ca",
    photo: half(103, "A peach and blue StreetBond court with a bus passing, Québec", INSTALLER_PHOTO),
  },
  {
    kind: "projects", id: "vancouver-neighbourhoods", section: "projects", pages: [104, 105], items: [
      project({ page: 104, eyebrow: "Neighbourhood colour", title: "Where the neighbourhood starts.", caption: { place: "Vancouver, British Columbia", system: "StreetBond" }, mapId: "vancouver-cambie-18th" }),
      project({ page: 105, eyebrow: "Community branding", title: "Highlighting communities.", body: "Little Italy's own logo, set into the corner in custom DecoMark: fabricated to the BIA's artwork and Pantone colour, then heat-fused into the road. Behind it, a TrafficPatterns crosswalk carries the same palette across The Drive: one identity, from the logo underfoot to the far curb.", caption: { place: "Vancouver, British Columbia", system: "TrafficPatternsXD and DecoMark" }, mapId: "vancouver-commercial-drive" }),
    ],
  },
  {
    kind: "projects", id: "ubc-kitchener", section: "projects", pages: [106, 107], items: [
      project({ page: 106, eyebrow: "Community branding", title: "Musqueam Nation land acknowledgement, UBC.", caption: { place: "UBC, British Columbia", system: "TrafficPatterns" }, mapId: "ubc-musqueam" }),
      project({ page: 107, eyebrow: "Intersection art", title: "Kings and Queens.", body: "Public art transforming a historic downtown intersection for a pedestrian-friendly space.", caption: { place: "Kitchener, Ontario", system: "TrafficPatterns" }, mapId: "kitchener-kings-queens" }),
    ],
  },
  {
    kind: "projects", id: "maple-ridge-vaughan", section: "projects", pages: [108, 109], items: [
      project({ page: 108, eyebrow: "Public art", title: "The playground is the canvas. We do fun.", caption: { place: "Maple Ridge, British Columbia", system: "StreetBond" }, mapId: "maple-ridge-spray-park" }),
      project({ page: 109, eyebrow: "Retail", title: "First impressions.", body: "Like the Audi brand, crisp, clean lines provide the perfect solution as you arrive at the dealership. Accenting the building in a unique way.", caption: { place: "Vaughan, Ontario", system: "TrafficPatternsXD" }, mapId: "vaughan-audi" }),
    ],
  },
  {
    kind: "statement", id: "the-plow-came-through", section: "projects", pages: [110, 111],
    title: "The plow came through. The pattern stayed.",
    body: "The most durable treatment in the toughest environments. TrafficPatternsXD lasts year after year. Through snow plows and traffic, the system continues to perform.",
    photo: full(111, "A red brick-pattern TrafficPatternsXD surface after a snowplow has passed", "50% 55%"), post: "snowplow-safe-decorative-pavement",
  },
  {
    kind: "projects", id: "look-listen-live-whitehorse", section: "projects", pages: [112, 113], items: [
      project({ page: 112, eyebrow: "Pedestrian safety", title: "Look Listen Live.", body: "The Look Listen Live rail-safety campaign puts a visual reminder for pedestrians at the crossing approach. Bold, preformed thermoplastic, heat-fused into the asphalt, holds its contrast through freeze-thaw and plow seasons.", caption: { place: "National program", system: "DecoMark" }, mapId: "brantford-safety-village-look-listen-live" }),
      project({ page: 113, eyebrow: "First Nations land acknowledgement", title: "Acknowledgement, cast in pavement.", caption: { place: "Whitehorse, Yukon", system: "TrafficPatterns" }, mapId: "whitehorse-kwanlin-dun" }),
    ],
  },
  {
    kind: "projects", id: "fort-langley-kitchener", section: "projects", pages: [114, 115], items: [
      project({ page: 114, eyebrow: "Community branding", title: "First Nations Land Recognition.", body: "\"We acknowledge those lands that are the traditional, ancestral, and unceded territories of Canada's First Nations, Inuit, and Métis peoples. We recognize and honour their enduring stewardship of these lands, waters, and communities, and we commit to walking forward together in the spirit of truth and reconciliation.\"", caption: { place: "Fort Langley, British Columbia", system: "DecoMark" }, mapId: "fort-langley-land-recognition" }),
      project({ page: 115, eyebrow: "Veterans memorial", title: "Community. Respect. In honour of those who served and sacrificed.", caption: { place: "Kitchener, Ontario", system: "TrafficPatterns" }, mapId: "kitchener-veterans" }),
    ],
  },
  {
    kind: "projects", id: "verdun-woodbridge", section: "projects", pages: [116, 117], items: [
      project({ page: 116, eyebrow: "Traffic control", title: "Flush medians become part of the road.", body: "Utilizing TrafficPatternsXD to create visual and tactile traffic control methods. Slowing down cars, protecting pedestrians all while using the existing road surface with this snowplow-proof, road-narrowing installation.", caption: { place: "Verdun, Québec", system: "TrafficPatternsXD" }, mapId: "verdun-flush-medians" }),
      project({ page: 117, eyebrow: "Crosswalks", title: "Plowed, salted, and heavy traffic.", body: "The look of laid masonry, in a material engineered for plow blades, road salt and the freeze-thaw that follows.", caption: { place: "Woodbridge, Ontario", system: "TrafficPatternsXD" }, mapId: "vaughan-woodbridge-heritage" }),
    ],
  },
  {
    kind: "projects", id: "burnaby-court", section: "projects", pages: [118], items: [
      project({ page: 118, caption: { place: "Burnaby, British Columbia", system: "StreetBond" }, mapId: "burnaby-basketball-court", fullBleed: true }),
    ],
  },
  {
    kind: "installer", id: "urban-life-solutions", section: "projects", pages: [119],
    region: "HUB certified installer · Alberta", title: "Safety, Value, Innovation.", body: "Looking to make a lasting impression? We are certified applicators of StreetPrint and TrafficPatterns, and can transform your asphalt or concrete surface into an architectural streetscape feature or branding piece that is truly unique.",
    phone: "403.235.5353", web: "www.uls.com",
    photo: half(119, "A hopscotch grid being installed in StreetBond at a playground in Lethbridge, Alberta", INSTALLER_PHOTO), caption: { place: "Lethbridge, Alberta" },
  },
  {
    kind: "projects", id: "saint-lin-vancouver", section: "projects", pages: [120, 121], items: [
      project({ page: 120, caption: { place: "Saint-Lin-Laurentides, Québec", system: "StreetBond" }, mapId: "saint-lin-school-walkway", fullBleed: true }),
      project({ page: 121, caption: { place: "Catholic Diocese of Vancouver", system: "DuraTherm" }, mapId: "vancouver-immaculate-conception", fullBleed: true }),
    ],
  },
  {
    kind: "statement", id: "colour-that-knows", section: "projects", pages: [122, 123],
    title: "Colour that knows when to be quiet.",
    body: "Inside a heritage industrial hall, the lot is coated in a slate coloured coating that complements the brick and steel. StreetBond transforms older pavement to give it new life.",
    // The whole page: its foot is the StreetBond logo, not a caption (bottom 0.92 cut it in half).
    photo: { page: 123, focus: "50% 50%", alt: "A slate-grey StreetBond parking lot inside a heritage industrial hall" }, caption: { place: "StreetBond" },
  },
  {
    kind: "projects", id: "sechelt-east-gwillimbury", section: "projects", pages: [124, 125], items: [
      project({ page: 124, eyebrow: "Sechelt crosswalk", title: "The origin story of the shíshálh Nation.", caption: { place: "Sunshine Coast, British Columbia", system: "TrafficPatterns" }, mapId: "sechelt-tsain-ko" }),
      project({ page: 125, eyebrow: "Parks & paths", title: "Community centres.", body: "Using TrafficPatternsXD in a bold colour scheme highlights the location of the new community centre, using materials that will hold up to the wear and tear of a busy community location.", caption: { place: "East Gwillimbury, Ontario", system: "TrafficPatternsXD" }, mapId: "east-gwillimbury-halp" }),
    ],
  },
  {
    kind: "projects", id: "nanaimo-montreal", section: "projects", pages: [126, 127], items: [
      project({ page: 126, eyebrow: "Pride", title: "Community colours.", caption: { place: "Nanaimo, British Columbia", system: "TrafficPatterns" }, mapId: "nanaimo-pride-intersection" }),
      project({ page: 127, eyebrow: "Traffic calming", title: "School crosswalks should be seen.", body: "Using colour to enhance visibility and create awareness in the community brings a playful, vibrant community crosswalk together. Using a combination of TrafficPatterns and StreetBond to achieve a long-lasting surface.", caption: { place: "Montréal, Québec", system: "TrafficPatterns" }, mapId: "montreal-school-crosswalk" }),
    ],
  },
  {
    kind: "projects", id: "victoria-surrey", section: "projects", pages: [128, 129], items: [
      project({ page: 128, eyebrow: "Three products · one solution", title: "First Nations Reconciliation.", caption: { place: "Victoria, British Columbia", system: "StreetPrint, DecoMark & StreetBond" } }),
      project({ page: 129, eyebrow: "Splash pads", title: "Waterpark surface coating.", body: "Constant water, chemical treatments, and bare feet make waterparks one of the harshest environments in outdoor pavement. StreetBond builds a slip-resistant texture that meets wet-surface safety expectations while holding vivid colour season after season.", caption: { place: "Bear Creek Park, Surrey, British Columbia", system: "StreetBond" }, mapId: "surrey-bear-creek-spray-park" }),
    ],
  },
  {
    kind: "projects", id: "granville-verdun", section: "projects", pages: [130, 131], items: [
      project({ page: 130, eyebrow: "Commercial spaces", title: "The first thing a customer walks on.", caption: { place: "Granville Island, Vancouver", system: "TrafficPatternsXD" }, mapId: "vancouver-granville-island", badge: "7 years old" }),
      project({ page: 131, eyebrow: "Parking", title: "Long lasting parking lanes.", body: "A paver-pattern parking lane in TrafficPatternsXD, heat-fused onto the asphalt so it takes turning tires, delivery trucks and plow blades without the shifting and shoving of real pavers. The pattern also defines the lane visually, narrowing the roadway and calming roadway traffic.", caption: { place: "Verdun, Québec", system: "TrafficPatternsXD" }, mapId: "verdun-parking-lanes" }),
    ],
  },
  {
    kind: "projects", id: "kanaka-springs", section: "projects", pages: [132], items: [
      project({ page: 132, caption: { place: "Maple Ridge, British Columbia", system: "StreetPrint" }, mapId: "maple-ridge-kanaka-springs", fullBleed: true }),
    ],
  },
  {
    kind: "installer", id: "square-one", section: "projects", pages: [133],
    region: "HUB master installer · British Columbia", title: "From city streets to community landmarks.", body: "Turning ordinary asphalt and concrete surfaces into vibrant, enduring public spaces throughout British Columbia.",
    phone: "604.612.6209", web: "www.squareonepaving.com",
    photo: half(133, "A circular Indigenous design in colour on a plaza, with a running track behind", 0.555),
  },
  {
    kind: "statement", id: "charlottetown", section: "projects", pages: [134, 135],
    eyebrow: "Waterfront", title: "Where the ships come in.",
    body: "Charlottetown, PEI: the cruise ship terminal walkway, stamped in a herringbone basket-weave and sealed with StreetBond. Pedestrians, rolling luggage, salt air. Built for all of it.",
    photo: full(135, "The StreetPrint herringbone walkway along the Charlottetown waterfront, Prince Edward Island", "50% 50%"), caption: { place: "Charlottetown, Prince Edward Island", system: "Cruise Ship Terminal & Marina Walkway" }, mapId: "charlottetown-cruise-terminal",
  },
  {
    kind: "projects", id: "langley-mission", section: "projects", pages: [136, 137], items: [
      project({ page: 136, eyebrow: "Heritage", title: "The railway is gone. The line isn't.", caption: { place: "Langley City, British Columbia", system: "TrafficPatterns" }, mapId: "langley-railroad-heritage" }),
      project({ page: 137, eyebrow: "Commercial space", title: "Commercial hardscapes.", body: "Retail entries, hotel forecourts, and mixed-use frontages where the surface underfoot signals the quality of everything inside. StreetPrint delivers the visual weight of premium stone paving in place, on the existing asphalt, without closing the site for reconstruction.", caption: { place: "Mission, British Columbia", system: "StreetPrint" }, mapId: "mission-herringbone-bays" }),
    ],
  },
  {
    kind: "statement", id: "school-grounds", section: "projects", pages: [138, 139],
    eyebrow: "StreetBond · School grounds", title: "A schoolyard, coloured in StreetBond.",
    photo: { page: 138, top: 0.05, bottom: SITE_PAGE_CAPTION, focus: "50% 50%", alt: "A school ground with StreetBond courts and a red running track" },
  },
  {
    kind: "closing", id: "built-to-perform", section: "back", pages: [140, 141],
    title: "Built to", accent: "Perform.", stats: "27 years · 1,000+ projects · coast to coast", line: "Let us help transform your project.",
    communitiesTitle: "Canada wide.", communitiesLine: "Here are a few of the communities we work with.",
    communities: [
      "City of Toronto", "City of Vancouver", "York Region", "City of Saint John", "City of Ottawa", "City of Waterloo", "District of Saanich", "City of Surrey",
      "City of Brampton", "City of Edmonton", "City of Mississauga", "City of Montréal", "Region of Peel", "City of Burnaby", "Halifax Regional Municipality", "City of Kelowna",
      "City of Richmond Hill", "University of Saskatchewan", "City of New Westminster", "University of British Columbia", "City of Coquitlam", "University of Alberta", "City of Port Moody", "District of Sechelt",
      "City of White Rock", "City of Vaughan", "City of Kitchener", "Town of Milton", "City of London", "Town of Simcoe", "Town of Georgina", "Bowen Island Municipality",
      "City of Sherbrooke", "North Cowichan Valley RD", "City of Victoria", "City of Richmond", "Township of Langley", "City of North Vancouver", "City of Langley", "District of Squamish",
      "City of Nanaimo", "Simon Fraser University", "Whitehorse",
    ],
  },
  {
    kind: "lunch", id: "lunch-and-learn", section: "back", pages: [142, 143],
    title: "Lunch is on us.", accent: "Got an hour?",
    body: "An hour of technical, in-depth, product solutions, covering the innovative options available for your upcoming projects.",
    points: ["Tailored to your team's interests", "Continuing-education content", "In person across Canada, or virtual."],
    contactsEyebrow: "Two offices. One network. One country.", contactsTitle: "Speak with HUB.", contactsLine: "Every project starts with a conversation",
  },
  { kind: "back", id: "back-cover", section: "back", pages: [144], photo: { page: 144, bottom: 1, focus: "50% 40%", alt: "A family on a blue TrafficPatternsXD crosswalk, the back cover of the Product Book" } },
];

/** The printed spread's words, for a leaf written out by hand (a photograph the table cannot describe). */
function printedApplication(slug: string) {
  const entry = PRINT_APPLICATIONS[slug];
  if (!entry) throw new Error(`Product Book edition: no printed spread for ${slug}`);
  return { title: entry.title, subhead: entry.statement, body: entry.body, specify: entry.specify.map((s) => sys(s.slug, s.note)), caption: entry.caption };
}

function applicationLeaf(slug: string, page: number, eyebrow: string, number: number, alt: string, mapId?: string): Leaf {
  const entry = PRINT_APPLICATIONS[slug];
  const app = applications.find((a) => a.slug === slug);
  if (!entry || !app) throw new Error(`Product Book edition: no printed spread for ${slug}`);
  if (entry.page !== page) throw new Error(`Product Book edition: ${slug} is printed on page ${entry.page}, not ${page}`);
  // The caption is the book's own, printed on the photograph; the map pin only
  // supplies the link (its city can differ from the caption: York Region for
  // Vaughan, North Cowichan for the Cowichan Valley).
  return {
    kind: "application", id: slug, section: "applications", pages: [page, page + 1],
    slug, eyebrow, title: entry.title, subhead: entry.statement, body: entry.body,
    specify: entry.specify.map((s) => sys(s.slug, s.note)),
    number, photo: full(page + 1, alt, "50% 55%"), caption: entry.caption, mapId,
  };
}

export const SECTIONS: { key: Leaf["section"]; title: string }[] = [
  { key: "front", title: "Welcome" },
  { key: "systems", title: "Ten systems" },
  { key: "applications", title: "Applications" },
  { key: "projects", title: "Projects" },
  { key: "back", title: "Speak with HUB" },
];

/** What a leaf is called in the contents and the progress line. */
export function leafTitle(leaf: Leaf): string {
  switch (leaf.kind) {
    case "cover": return "Cover";
    case "welcome": return leaf.heading;
    case "divider": return leaf.title;
    case "system": return productName(leaf.slug);
    case "colours": return leaf.title;
    case "steps": return `${leaf.system}: ${leaf.title}`;
    case "templates": return leaf.title;
    case "application": return leaf.eyebrow;
    case "then-now": return leaf.eyebrow;
    case "statement": return leaf.title;
    case "projects": return leaf.items.map((i) => i.title ?? i.caption.place).join(" · ");
    case "installer": return leaf.title;
    case "partner": return leaf.subtitle;
    case "closing": return `${leaf.title} ${leaf.accent}`;
    case "lunch": return leaf.contactsTitle;
    case "back": return "Back cover";
  }
}

/** "24–25" or "88": the printed pages, for the progress line and the link to the printed spread. */
export function pageLabel(leaf: Leaf): string {
  const first = leaf.pages[0];
  const last = leaf.pages[leaf.pages.length - 1];
  return first === last ? String(first) : `${first}–${last}`;
}

/** The product entry a system leaf shows. */
export function systemEntry(slug: string) {
  const entry = PRINT_SYSTEMS[slug];
  const product = products.find((p) => p.slug === slug);
  if (!entry || !product) throw new Error(`Product Book edition: no printed page for ${slug}`);
  return { entry, product };
}
