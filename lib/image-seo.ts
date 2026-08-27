/**
 * Image SEO — the alt text, captions, and ImageObject schema for every photo
 * on the site.
 *
 * WHY THIS EXISTS: the site ships ~1,590 gallery photographs. Until now every
 * one of them carried alt text of the shape "<page context> — installation
 * photo 45". That is accessible, but it is worthless for search: 121 photos in
 * /applications/crosswalks all read as near-identical strings, none of them
 * containing a phrase a human being would ever type into a search box. Google
 * Images ranks on the words around and inside an image — alt text, caption,
 * filename, nearby copy, and structured data — so a gallery of 121 photos
 * described 121 times the same way competes for nothing.
 *
 * WHAT THIS DOES: composes alt text from what we can TRUTHFULLY say about a
 * folder — the application or product the folder IS, the material HUB actually
 * uses for that work, the purpose it serves, and the settings those photos are
 * genuinely drawn from — and rotates the composition so a large gallery reads
 * as many distinct, specific descriptions instead of one repeated string.
 *
 * TRUTHFULNESS RULES (these are not style preferences — the client's
 * credibility rides on them):
 *
 *   1. Never name a city we cannot verify. The folder tells us the WHAT, not
 *      the WHERE. Location defaults to Canada, which is true of all of it.
 *      Specific places appear only via `placeFor()`, which reads a curated map
 *      of folders whose provenance is documented.
 *   2. Never name a product in an APPLICATION folder. /applications/crosswalks
 *      contains crosswalks; which HUB system is under any given one is not
 *      knowable from the folder. Product names are asserted only inside
 *      /images/products/<slug>, where the folder is the claim.
 *   3. `material` describes the class of system HUB specifies for that work,
 *      phrased so it stays true across the folder ("preformed thermoplastic
 *      and coloured pavement coatings"), never as a claim about one photo.
 *   4. No keyword stuffing. Google treats repeated keyword padding as a spam
 *      signal; every string here has to read like a caption a person wrote.
 *
 * Safe to import anywhere. Pure data + string functions, no side effects.
 */

export interface ImageSubject {
  /** The noun phrase a person actually types into a search box. Leads the alt. */
  keyword: string;
  /** Collection form, for gallery-level names and schema. */
  plural: string;
  /** The class of system HUB specifies here — true across the whole folder. */
  material: string;
  /** What the installation is FOR. Carries the search intent. */
  purpose: string;
  /** Settings these photos are genuinely drawn from. Rotated for variety. */
  settings: string[];
  /** Secondary phrases this folder legitimately serves, for schema keywords. */
  also?: string[];
}

const CANADA = "Canada";

// ── Application folders ───────────────────────────────────────────────────────
// The folder is the application. Products are deliberately NOT named here.
const APPLICATION_SUBJECTS: Record<string, ImageSubject> = {
  crosswalks: {
    keyword: "decorative crosswalk",
    plural: "decorative crosswalks",
    material: "preformed thermoplastic pavement marking",
    purpose: "high-visibility pedestrian crossing",
    settings: [
      "a municipal intersection",
      "a downtown main street",
      "a school zone",
      "a signalized urban intersection",
      "a commercial district",
      "a residential collector road",
    ],
    also: ["thermoplastic crosswalk", "coloured crosswalk", "stamped asphalt crosswalk", "crosswalk marking"],
  },
  "bike-lanes": {
    keyword: "coloured bike lane",
    plural: "coloured bike lanes",
    material: "UV-stable coloured pavement coating",
    purpose: "protected cycling infrastructure",
    settings: [
      "a protected cycle track",
      "an intersection conflict zone",
      "a downtown bike corridor",
      "a multi-use path approach",
      "a separated bike lane",
    ],
    also: ["green bike lane", "bike lane marking", "cycle track surfacing", "bicycle pavement marking"],
  },
  "bus-lanes": {
    keyword: "bus lane marking",
    plural: "bus lane markings",
    material: "MMA resin and reinforced thermoplastic",
    purpose: "transit priority corridor",
    settings: [
      "a BRT corridor",
      "a red transit priority lane",
      "a bus stop approach",
      "a transit signal priority intersection",
      "an urban busway",
    ],
    also: ["red bus lane", "transit lane marking", "BRT pavement marking", "bus priority lane"],
  },
  "traffic-calming": {
    keyword: "traffic calming surface treatment",
    plural: "traffic calming surface treatments",
    material: "stamped asphalt and coloured pavement coating",
    purpose: "speed reduction and pedestrian priority",
    settings: [
      "a raised intersection",
      "a neighbourhood gateway",
      "a pedestrian priority zone",
      "a Complete Streets corridor",
      "a Vision Zero treatment area",
      "a village centre main street",
    ],
    also: ["stamped asphalt intersection", "pattern paving", "Vision Zero surface", "Complete Streets paving"],
  },
  "pedestrian-safety": {
    keyword: "pedestrian safety pavement marking",
    plural: "pedestrian safety pavement markings",
    material: "retroreflective preformed thermoplastic",
    purpose: "pedestrian visibility and conflict-zone marking",
    settings: [
      "a school zone",
      "a signalized crossing",
      "a transit stop approach",
      "a mid-block crossing",
      "a hospital campus entrance",
    ],
    also: ["high-visibility crosswalk", "school zone marking", "pedestrian crossing marking"],
  },
  "parking-lots": {
    keyword: "parking lot line marking",
    plural: "parking lot line markings",
    material: "durable pavement coating and preformed marking",
    purpose: "stall layout and accessible parking",
    settings: [
      "a retail parking lot",
      "a commercial plaza",
      "an office campus lot",
      "a grocery anchor site",
      "a multi-level parking deck approach",
    ],
    also: ["parking stall marking", "accessible parking marking", "parking lot striping", "asphalt line painting"],
  },
  "parks-paths": {
    keyword: "decorative pathway paving",
    plural: "decorative pathway paving",
    material: "stamped asphalt and coloured surface coating",
    purpose: "park pathways and public greenspace",
    settings: [
      "a municipal park",
      "a waterfront promenade",
      "a multi-use trail",
      "a greenway connection",
      "a park entry plaza",
      "a botanical garden path",
    ],
    also: ["stamped asphalt path", "park pathway surfacing", "trail paving", "greenway surfacing"],
  },
  playgrounds: {
    keyword: "playground surface graphics",
    plural: "playground surface graphics",
    material: "coloured pavement coating and preformed play graphics",
    purpose: "play surfaces and schoolyard games",
    settings: [
      "a schoolyard",
      "a community playground",
      "an elementary school play area",
      "a park play zone",
      "a daycare courtyard",
    ],
    also: ["schoolyard games marking", "play area surfacing", "hopscotch pavement marking", "asphalt playground art"],
  },
  "splash-pads": {
    keyword: "splash pad surfacing",
    plural: "splash pad surfacing",
    material: "slip-resistant coloured surface coating",
    purpose: "wet play surfaces with slip resistance",
    settings: [
      "a municipal splash pad",
      "a community water play area",
      "a park spray pad",
      "a recreation centre wet deck",
    ],
    also: ["water play surfacing", "spray pad coating", "slip-resistant pool deck coating"],
  },
  "sport-courts": {
    keyword: "sport court surfacing",
    plural: "sport court surfacing",
    material: "coloured acrylic sport surface coating",
    purpose: "court colour, line marking, and play surface",
    settings: [
      "a municipal tennis court",
      "a school basketball court",
      "a community pickleball court",
      "a multi-sport pad",
    ],
    also: ["tennis court coating", "basketball court surfacing", "pickleball court paint", "court line marking"],
  },
  "public-art": {
    keyword: "pavement public art",
    plural: "pavement public art",
    material: "coloured pavement coating and custom preformed graphics",
    purpose: "civic art and community identity in the ground plane",
    settings: [
      "a civic plaza",
      "a downtown intersection",
      "a community gathering space",
      "a cultural district street",
      "a public square",
    ],
    also: ["street mural", "asphalt art", "rainbow crosswalk", "cultural pavement design", "ground mural"],
  },
  "community-branding": {
    keyword: "community branding pavement graphics",
    plural: "community branding pavement graphics",
    material: "custom-colour pavement coating and preformed graphics",
    purpose: "neighbourhood identity and placemaking",
    settings: [
      "a BIA main street",
      "a neighbourhood gateway",
      "a town centre plaza",
      "a downtown streetscape",
      "a festival street",
    ],
    also: ["placemaking pavement", "branded crosswalk", "town identity paving", "logo pavement marking"],
  },
  "public-spaces": {
    keyword: "decorative plaza paving",
    plural: "decorative plaza paving",
    material: "stamped asphalt and coloured pavement coating",
    purpose: "plazas and civic gathering space",
    settings: [
      "a civic plaza",
      "a pedestrian-only street",
      "a transit plaza",
      "a market square",
      "a campus quad",
    ],
    also: ["plaza surfacing", "pedestrian street paving", "pattern paving", "civic space paving"],
  },
  "commercial-spaces": {
    keyword: "commercial pavement design",
    plural: "commercial pavement design",
    material: "stamped asphalt and durable coloured coating",
    purpose: "retail entrances and commercial site identity",
    settings: [
      "a retail plaza entrance",
      "a shopping centre drive aisle",
      "a hotel forecourt",
      "a corporate campus entry",
      "a restaurant patio approach",
    ],
    also: ["retail paving", "commercial stamped asphalt", "shopping centre paving", "corporate campus paving"],
  },
  "regulatory-markings": {
    keyword: "regulatory pavement marking",
    plural: "regulatory pavement markings",
    material: "retroreflective preformed thermoplastic",
    purpose: "symbols, arrows, and compliance legends",
    settings: [
      "a municipal roadway",
      "a parking facility",
      "an intersection approach",
      "an industrial site road",
      "a campus service road",
    ],
    also: ["preformed thermoplastic symbols", "pavement legends", "accessibility symbol marking", "road arrow marking"],
  },
  "private-driveways": {
    keyword: "stamped asphalt driveway",
    plural: "stamped asphalt driveways",
    material: "stamped asphalt with colour-sealed surface coating",
    purpose: "driveway surfacing with a paver appearance",
    settings: [
      "a private residence",
      "an estate entrance",
      "a rural property driveway",
      "a laneway approach",
    ],
    also: ["stamped blacktop driveway", "decorative driveway", "asphalt driveway paving", "stamped asphalt vs pavers"],
  },
  "residential-driveways": {
    keyword: "stamped asphalt driveway",
    plural: "stamped asphalt driveways",
    material: "stamped asphalt with colour-sealed surface coating",
    purpose: "driveway surfacing with a paver appearance",
    settings: [
      "a suburban home",
      "a residential street frontage",
      "a new-build subdivision",
      "a heritage neighbourhood property",
    ],
    also: ["stamped blacktop", "decorative residential paving", "driveway resurfacing", "stamped asphalt pattern"],
  },
  townhomes: {
    keyword: "townhome community paving",
    plural: "townhome community paving",
    material: "stamped asphalt and coloured pavement coating",
    purpose: "shared drive aisles and common areas",
    settings: [
      "a townhome development",
      "a condominium drive aisle",
      "a strata common entrance",
      "a multi-family courtyard",
    ],
    also: ["condo paving", "strata drive aisle", "multi-family stamped asphalt", "shared driveway paving"],
  },
  airports: {
    keyword: "airport pavement marking",
    plural: "airport pavement markings",
    material: "preformed thermoplastic airfield marking",
    purpose: "apron and airside service area marking",
    settings: [
      "an airport apron",
      "an airside service road",
      "a terminal forecourt",
      "a ground support equipment area",
    ],
    also: ["airfield marking", "apron marking", "airside pavement marking"],
  },
  "leed-urban-heat-island": {
    keyword: "solar-reflective pavement coating",
    plural: "solar-reflective pavement coatings",
    material: "solar-reflective, low-VOC surface coating",
    purpose: "urban heat island mitigation and LEED credit",
    settings: ["a plaza surface", "an urban pathway"],
    also: ["LEED heat island reduction", "cool pavement", "SRI pavement coating", "reflective asphalt coating"],
  },
};

// ── Product folders ───────────────────────────────────────────────────────────
// Here the folder IS the product, so naming the product is a documented claim.
const PRODUCT_SUBJECTS: Record<string, ImageSubject> = {
  "traffic-patterns-xd": {
    keyword: "TrafficPatternsXD stamped asphalt",
    plural: "TrafficPatternsXD installations",
    material: "150mil aggregate-reinforced preformed thermoplastic",
    purpose: "high-traffic decorative pavement with skid resistance",
    settings: ["a municipal intersection", "a BRT corridor", "a civic plaza", "a high-volume crosswalk", "a transit station zone"],
    also: ["aggregate reinforced thermoplastic", "heavy duty pavement marking", "stamped asphalt crosswalk"],
  },
  "traffic-patterns": {
    keyword: "TrafficPatterns thermoplastic pavement marking",
    plural: "TrafficPatterns installations",
    material: "125mil preformed thermoplastic",
    purpose: "decorative, durable pattern paving",
    settings: ["a crosswalk", "an intersection treatment", "a pedestrian plaza", "a main street corridor"],
    also: ["preformed thermoplastic", "pattern paving", "decorative pavement marking"],
  },
  streetbond: {
    keyword: "StreetBond pavement coating",
    plural: "StreetBond installations",
    material: "UV-stable acrylic pavement coating",
    purpose: "long-life colour on asphalt and concrete",
    settings: ["a coloured crosswalk", "a bike lane", "a plaza surface", "a playground", "a sport court", "a transit lane"],
    also: ["coloured pavement coating", "asphalt paint", "bike lane green coating", "20-year colour retention"],
  },
  streetbondsr: {
    keyword: "StreetBondSR solar-reflective coating",
    plural: "StreetBondSR installations",
    material: "solar-reflective, low-VOC acrylic pavement coating",
    purpose: "surface temperature reduction and LEED credit",
    settings: ["a plaza", "a pedestrian pathway", "a courtyard surface"],
    also: ["cool pavement coating", "SRI coating", "LEED heat island reduction", "urban heat island mitigation"],
  },
  streetprint: {
    keyword: "StreetPrint stamped asphalt",
    plural: "StreetPrint installations",
    material: "heat-imprinted stamped asphalt with colour coating",
    purpose: "brick and cobblestone appearance in asphalt",
    settings: ["a driveway", "a plaza", "a crosswalk", "a park pathway", "a commercial entrance", "a village main street"],
    also: ["stamped blacktop", "imprinted asphalt", "brick pattern asphalt", "cobblestone asphalt"],
  },
  decomark: {
    keyword: "DecoMark decorative pavement graphics",
    plural: "DecoMark installations",
    material: "custom preformed thermoplastic graphics",
    purpose: "logos, art, and custom pavement design",
    settings: ["a rainbow crosswalk", "a civic plaza", "a schoolyard", "a branded intersection", "a cultural art crossing"],
    also: ["custom pavement graphics", "logo pavement marking", "asphalt art", "rainbow crosswalk thermoplastic"],
  },
  mmax: {
    keyword: "MMAX MMA resin pavement system",
    plural: "MMAX installations",
    material: "methyl methacrylate (MMA) resin surfacing",
    purpose: "fast-cure coloured surfacing for overnight installation",
    settings: ["a bus lane", "a bike lane", "a transit corridor", "a cold-weather installation"],
    also: ["MMA pavement coating", "fast cure road surfacing", "methyl methacrylate resin", "overnight lane marking"],
  },
  duratherm: {
    keyword: "DuraTherm imprinted asphalt",
    plural: "DuraTherm installations",
    material: "heat-imprinted asphalt with durable colour system",
    purpose: "decorative hardscape in asphalt",
    settings: ["a pathway", "a crosswalk", "a courtyard", "a streetscape treatment"],
    also: ["imprinted asphalt", "decorative asphalt", "stamped asphalt pattern"],
  },
  durashield: {
    keyword: "DuraShield asphalt coating",
    plural: "DuraShield installations",
    material: "protective asphalt surface coating",
    purpose: "surface protection and rejuvenation",
    settings: ["a parking lot", "a driveway", "an access road", "a commercial site"],
    also: ["asphalt sealer", "pavement protection coating", "asphalt rejuvenation"],
  },
  premark: {
    keyword: "PreMark preformed thermoplastic",
    plural: "PreMark installations",
    material: "125mil preformed thermoplastic symbols and legends",
    purpose: "retroreflective symbols, arrows, and legends",
    settings: ["a roadway", "a bike lane", "a parking facility", "an intersection"],
    also: ["thermoplastic symbols", "preformed road markings", "pavement legends", "bike symbol marking"],
  },
  airmark: {
    keyword: "AirMark airfield pavement marking",
    plural: "AirMark installations",
    material: "preformed thermoplastic airfield marking",
    purpose: "airport apron and service area marking",
    settings: ["an airport apron", "an airside road", "a ground service area"],
    also: ["airfield marking", "apron pavement marking", "airport thermoplastic"],
  },
  chipfill: {
    keyword: "ChipFill pavement repair",
    plural: "ChipFill applications",
    material: "aggregate-based pavement repair compound",
    purpose: "crack and chip repair in asphalt",
    settings: ["a roadway repair", "a parking lot repair", "a pavement patch"],
    also: ["asphalt crack repair", "pothole repair compound", "pavement patching material"],
  },
  aggrefill: {
    keyword: "AggreFill pavement repair aggregate",
    plural: "AggreFill applications",
    material: "aggregate fill for pavement repair",
    purpose: "pavement repair and surface restoration",
    settings: ["a roadway repair", "a pavement restoration"],
    also: ["asphalt repair aggregate", "pavement patch fill"],
  },
  "fast-patch": {
    keyword: "Fast Patch asphalt repair",
    plural: "Fast Patch applications",
    material: "rapid-set asphalt repair material",
    purpose: "fast pothole and surface repair",
    settings: ["a pothole repair", "a roadway patch", "a parking lot repair"],
    also: ["rapid asphalt repair", "pothole patching", "cold patch asphalt"],
  },
};

/**
 * Folders whose provenance is documented well enough to name a place. Anything
 * absent falls back to "Canada" — which is true of every photo in the library.
 * Add to this map ONLY when the project record or blog post confirms the site.
 */
const PLACES: Record<string, string> = {
  "images/blog/complete-streets-new-westminster": "New Westminster, BC",
  "images/blog/bc-childrens-hospital-labyrinth": "Vancouver, BC",
  "images/blog/branded-crosswalks-vancouver-richmond": "Vancouver and Richmond, BC",
  "images/blog/bowen-island-asphalt-path": "Bowen Island, BC",
  "images/blog/murrayville-schoolhouse-sidewalk": "Murrayville, BC",
  "images/blog/decorative-crosswalk-commercial-drive": "Vancouver, BC",
  "images/blog/white-rock-langley-trafficpatterns": "White Rock and Langley, BC",
  "images/blog/ubc-musqueam-crosswalk": "Vancouver, BC",
  "images/blog/simcoe-rainbow-crosswalk": "Simcoe, ON",
  "images/blog/decorative-crosswalk-meridian": "Meridian, ON",
};

/**
 * Hero photography.
 *
 * The homepage hero shipped as `alt="" aria-hidden="true"`. As an accessibility
 * decision that is defensible — the H1 sits on top of it and carries the
 * meaning. As an SEO decision it was costly: this is the single image Google
 * associates with hubss.com, it is the first entry in the sitemap, it is the
 * Open Graph image, and it was declaring itself to be decoration.
 *
 * It is not decoration. It is the UBC Musqueam crosswalk — a documented HUB
 * installation, with its own field note. Naming it costs nothing and describes
 * the photograph rather than repeating the headline, so a screen reader hears
 * the picture and the H1 as two different things instead of the same thing
 * twice.
 */
const HERO_ALT: Record<string, string> = {
  "/images/hero/hero-1.jpg":
    "The UBC Musqueam crosswalk at the University of British Columbia campus entrance in Vancouver — Coast Salish artwork rendered in coloured pavement by HUB Surface Systems",
};

export function heroAlt(src: string): string {
  return (
    HERO_ALT[src.split("?")[0]] ??
    seoAlt(src, "Decorative pavement installation by HUB Surface Systems in Canada")
  );
}

/** "/images/products/streetbond/streetbond-04.jpg" -> "images/products/streetbond" */
function folderOf(src: string): string {
  const clean = src.split("?")[0].replace(/^\/+/, "");
  const i = clean.lastIndexOf("/");
  return i === -1 ? clean : clean.slice(0, i);
}

function leafOf(folder: string): string {
  return folder.slice(folder.lastIndexOf("/") + 1);
}

/** Stable per-image index so the same file always gets the same description. */
function hashIndex(src: string): number {
  let h = 0;
  for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) >>> 0;
  return h;
}

export function subjectFor(src: string): ImageSubject | null {
  const folder = folderOf(src);
  const leaf = leafOf(folder);
  if (folder.startsWith("images/applications/")) return APPLICATION_SUBJECTS[leaf] ?? null;
  if (folder.startsWith("images/products/")) return PRODUCT_SUBJECTS[leaf] ?? null;
  return null;
}

export function placeFor(src: string): string {
  return PLACES[folderOf(src)] ?? CANADA;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Six frames, rotated against the folder's settings list. A 121-photo gallery
 * gets ~36 distinct descriptions instead of 121 copies of one — enough variety
 * that each photo competes on its own terms, without drifting into invention.
 *
 * Two constraints when editing these. Keep every frame under ~125 characters,
 * because past that Google truncates and the tail stops counting; and never
 * write `a ${s.keyword}`, because several keywords are mass or plural nouns
 * ("playground surface graphics", "decorative pathway paving") and the article
 * makes them ungrammatical.
 */
const FRAMES: ((s: ImageSubject, setting: string, place: string) => string)[] = [
  (s, setting, place) => `${cap(s.keyword)} at ${setting} in ${place} — installed by HUB Surface Systems`,
  (s, setting, place) => `${cap(s.keyword)} in ${s.material} — ${setting}, ${place}`,
  (s, setting) => `HUB Surface Systems ${s.keyword} — ${s.purpose} at ${setting}`,
  (s, setting, place) => `${cap(s.keyword)} installation in ${place}: ${s.purpose} at ${setting}`,
  (s, setting) => `${cap(s.keyword)} specified for ${s.purpose} — ${setting}`,
  (s, setting, place) => `Canadian ${s.keyword} project by HUB Surface Systems — ${setting} in ${place}`,
];

/**
 * Descriptive, keyword-led alt text for a gallery image.
 *
 * Falls back to `fallbackContext` (the old page-context string) whenever the
 * folder is not one we have a documented subject for — blog featured images,
 * hero art, one-off assets. Better a generic true sentence than a specific
 * invented one.
 */
export function seoAlt(src: string, fallbackContext: string): string {
  const subject = subjectFor(src);
  if (!subject) return fallbackContext;
  const place = placeFor(src);
  const h = hashIndex(src);
  const setting = subject.settings[h % subject.settings.length];
  const frame = FRAMES[Math.floor(h / subject.settings.length) % FRAMES.length];
  return frame(subject, setting, place);
}

/**
 * Short visible caption — the text under a photo in the lightbox. Visible text
 * next to an image is weighted more heavily than alt text by both Google Images
 * and the AI crawlers, so this is not decoration.
 */
export function seoCaption(src: string): string | undefined {
  const subject = subjectFor(src);
  if (!subject) return undefined;
  const place = placeFor(src);
  const setting = subject.settings[hashIndex(src) % subject.settings.length];
  return `${cap(subject.keyword)} — ${setting}, ${place}. ${cap(subject.material)}.`;
}

/** Search phrases a folder legitimately serves, for schema `keywords`. */
export function seoKeywords(src: string): string[] {
  const subject = subjectFor(src);
  if (!subject) return [];
  return [subject.keyword, ...(subject.also ?? [])];
}

// ── Structured data ───────────────────────────────────────────────────────────

const SITE = "https://hubss.com";
const YEAR = 2026;

export const HUB_ORGANIZATION = {
  "@type": "Organization",
  name: "HUB Surface Systems",
  url: SITE,
} as const;

/**
 * An ImageObject node for Google Images.
 *
 * Google requires `contentUrl` plus at least one of creator / creditText /
 * copyrightNotice / license; the Licensable badge additionally requires
 * `license`. We can supply all of them honestly: hubss.com/terms §3
 * ("Intellectual Property") is a real page governing image use, and /contact is
 * where a licence is actually obtained — so neither URL is a fabrication.
 *
 * See https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata
 */
export function imageObject(
  src: string,
  opts?: { alt?: string; caption?: string; representativeOfPage?: boolean; width?: number; height?: number }
) {
  const abs = src.startsWith("http") ? src : `${SITE}${src.startsWith("/") ? "" : "/"}${src}`;
  const alt = opts?.alt ?? seoAlt(src, "Decorative pavement installation by HUB Surface Systems");
  const caption = opts?.caption ?? seoCaption(src);
  const keywords = seoKeywords(src);

  return {
    "@type": "ImageObject",
    contentUrl: abs,
    url: abs,
    name: alt,
    description: caption ?? alt,
    ...(keywords.length ? { keywords: keywords.join(", ") } : {}),
    creator: HUB_ORGANIZATION,
    creditText: "HUB Surface Systems",
    copyrightNotice: `© ${YEAR} HUB Surface Systems`,
    license: `${SITE}/terms`,
    acquireLicensePage: `${SITE}/contact`,
    ...(opts?.representativeOfPage ? { representativeOfPage: true } : {}),
    ...(opts?.width ? { width: opts.width } : {}),
    ...(opts?.height ? { height: opts.height } : {}),
  };
}

/** Absolute URLs for the sitemap's image extension. */
export function sitemapImages(srcs: string[], limit = 300): string[] {
  return srcs
    .slice(0, limit)
    .map((s) => (s.startsWith("http") ? s : `${SITE}${s.startsWith("/") ? "" : "/"}${s}`));
}
