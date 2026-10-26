/**
 * Image SEO: the alt text, captions, and ImageObject schema for every photo
 * on the site.
 *
 * WHAT A CAPTION MAY SAY (rewritten 30 Sep 2026, QA E10): only what the
 * photo record proves. A photo in a product folder is that product, so the
 * line is the product and its family word ("StreetPrint stamped asphalt");
 * a photo in an application folder is that application ("Decorative
 * crosswalk"). A place follows only when the record names one (PLACES and
 * FILE_PLACES below: the client's own captions in the 2026 Product Book file
 * and the Insights posts). Nothing else: no setting, no spec figure, no "by
 * HUB Surface Systems".
 *
 * Until tonight six sentence templates rotated settings the photos could not
 * prove ("a botanical garden path", "a grocery anchor site", "a Vision Zero
 * treatment area", "a multi-level parking deck approach") and spec figures
 * inside alts, defaulting the place to "Canada", and the photo sync wrote
 * those lines into Studio. `looksGenerated` recognises that output so the
 * pages can replace it at render (`honestPhoto`); a line a person wrote in
 * Studio is left alone.
 *
 * Since 26 Oct 2026 (Vern: "add location and product used to all the
 * images") a line also carries what the site's own records establish about
 * the photograph itself: the system, for a photo in an application folder
 * (the printed Product Portfolio Book's caption, a twin of the same photo in
 * a product folder, the map's job record), and the place, for any photo
 * (the same records). lib/image-facts.ts holds them, generated from the
 * captions sheet docs/site-audits/gallery-captions-2026-10-26.csv, where
 * Doug's own columns win over the evidence. A photo with no fact keeps its
 * folder's line.
 *
 * The function signatures are unchanged, so no caller changes. Safe to import
 * anywhere: pure data and string functions, no side effects.
 */

import { IMAGE_FACTS } from "@/lib/image-facts";

export interface ImageSubject {
  /** The line a photo in this folder may carry: the system or the application, nothing more. */
  label: string;
  /** Collection form, for gallery-level names. */
  plural: string;
}

// ── Application folders ───────────────────────────────────────────────────────
// The folder is the application. Products are deliberately NOT named here:
// /images/applications/crosswalks contains crosswalks; which HUB system is
// under any given one is not knowable from the folder.
const APPLICATION_SUBJECTS: Record<string, ImageSubject> = {
  crosswalks: { label: "Decorative crosswalk", plural: "decorative crosswalks" },
  "bike-lanes": { label: "Coloured bike lane", plural: "coloured bike lanes" },
  "bus-lanes": { label: "Bus lane marking", plural: "bus lane markings" },
  "traffic-calming": { label: "Traffic calming surface treatment", plural: "traffic calming surface treatments" },
  // Glossary: crosswalk, never "pedestrian crossing". No /public folder of
  // this name; the page's Studio gallery is photos from the other folders.
  "pedestrian-safety": { label: "Pedestrian safety crosswalk marking", plural: "pedestrian safety crosswalk markings" },
  "parking-lots": { label: "Parking lot surface", plural: "parking lot surfaces" },
  "parks-paths": { label: "Park path surface", plural: "park path surfaces" },
  playgrounds: { label: "Playground surface graphics", plural: "playground surface graphics" },
  "splash-pads": { label: "Splash pad surface", plural: "splash pad surfaces" },
  "sport-courts": { label: "Sport court surface", plural: "sport court surfaces" },
  "public-art": { label: "Pavement public art", plural: "pavement public art" },
  "community-branding": { label: "Community branding pavement graphics", plural: "community branding pavement graphics" },
  "public-spaces": { label: "Decorative plaza paving", plural: "decorative plaza paving" },
  "commercial-spaces": { label: "Commercial site paving", plural: "commercial site paving" },
  "regulatory-markings": { label: "Regulatory pavement marking", plural: "regulatory pavement markings" },
  // The folder keeps the old page's name; /applications/private-driveways merged into Residential Driveways on 30 Sep 2026.
  "private-driveways": { label: "Stamped asphalt driveway", plural: "stamped asphalt driveways" },
  "residential-driveways": { label: "Stamped asphalt driveway", plural: "stamped asphalt driveways" },
  townhomes: { label: "Townhome development paving", plural: "townhome development paving" },
  airports: { label: "Airfield pavement marking", plural: "airfield pavement markings" },
  "leed-urban-heat-island": { label: "Solar-reflective pavement coating", plural: "solar-reflective pavement coatings" },
};

// ── Product folders ───────────────────────────────────────────────────────────
// Here the folder IS the product, so naming it is a documented claim. The
// family word after the name is the Product Book's own (lib/product-catalogue.ts
// titles: "Stamped asphalt.", "Inlaid thermoplastic.", "Road marking symbols.").
const PRODUCT_SUBJECTS: Record<string, ImageSubject> = {
  "traffic-patterns-xd": { label: "TrafficPatternsXD preformed thermoplastic", plural: "TrafficPatternsXD installations" },
  "traffic-patterns": { label: "TrafficPatterns preformed thermoplastic", plural: "TrafficPatterns installations" },
  streetbond: { label: "StreetBond coating", plural: "StreetBond installations" },
  streetbondsr: { label: "StreetBondSR solar reflective coating", plural: "StreetBondSR installations" },
  streetprint: { label: "StreetPrint stamped asphalt", plural: "StreetPrint installations" },
  decomark: { label: "DecoMark custom graphics", plural: "DecoMark installations" },
  mmax: { label: "MMAX MMA area markings", plural: "MMAX installations" },
  duratherm: { label: "DuraTherm inlaid thermoplastic", plural: "DuraTherm installations" },
  durashield: { label: "DuraShield pavement maintenance coating", plural: "DuraShield installations" },
  premark: { label: "PreMark road marking symbols", plural: "PreMark installations" },
  airmark: { label: "AirMark airfield markings", plural: "AirMark installations" },
  chipfill: { label: "ChipFill pothole repair", plural: "ChipFill photographs" },
  aggrefill: { label: "AggreFill pothole repair", plural: "AggreFill photographs" },
  "fast-patch": { label: "Fast Patch DPR pavement repair", plural: "Fast Patch DPR photographs" },
};

/**
 * Folders whose provenance is documented well enough to name a place. Anything
 * absent gets no place at all (until 30 Sep 2026 it got "Canada").
 * Add to this map ONLY when the project record or blog post confirms the site.
 */
const PLACES: Record<string, string> = {
  "images/blog/complete-streets-new-westminster": "New Westminster, BC",
  "images/blog/bc-childrens-hospital-labyrinth": "Vancouver, BC",
  // The post covers both cities, but its photo is Vancouver's Little Italy
  // crosswalk (the same file as Commercial Drive's). Sep 2026.
  "images/blog/branded-crosswalks-vancouver-richmond": "Vancouver, BC",
  "images/blog/bowen-island-asphalt-path": "Bowen Island, BC",
  "images/blog/murrayville-schoolhouse-sidewalk": "Murrayville, BC",
  "images/blog/decorative-crosswalk-commercial-drive": "Vancouver, BC",
  "images/blog/white-rock-langley-trafficpatterns": "White Rock and Langley, BC",
  "images/blog/ubc-musqueam-crosswalk": "Vancouver, BC",
  "images/blog/simcoe-rainbow-crosswalk": "Simcoe, ON",
  // There is no Meridian, ON: "Meridian" was the post's slip for "median".
  // The post places it on Humberwest Parkway, which is in Brampton. Sep 2026.
  "images/blog/decorative-crosswalk-meridian": "Humberwest Parkway, Brampton, ON",
};

/**
 * Per-file places: photographs whose location the client captioned in the
 * 2026 catalogue (Figma frame titles, Sep 2026). A file entry wins over its
 * folder; everything else stays on the folder rule above.
 */
const FILE_PLACES: Record<string, string> = {
  "/images/products/traffic-patterns/traffic-patterns-87.jpg": "Kitchener, ON",
  "/images/products/traffic-patterns/traffic-patterns-88.jpg": "UBC, Vancouver, BC",
  "/images/products/traffic-patterns/traffic-patterns-89.jpg": "UBC, Vancouver, BC",
  "/images/products/traffic-patterns/traffic-patterns-90.jpg": "UBC, Vancouver, BC",
  "/images/products/traffic-patterns/traffic-patterns-91.jpg": "UBC, Vancouver, BC",
  "/images/products/mmax/mmax-04.jpg": "London, ON",
  "/images/applications/bus-lanes/bus-lanes-37.png": "London, ON",
  "/images/applications/parking-lots/parking-lots-60.jpg": "Toronto Premium Outlets, Halton Hills, ON",
  "/images/applications/crosswalks/crosswalks-110.jpg": "Oakville, ON",
  "/images/applications/crosswalks/crosswalks-128.jpg": "Langley, BC",
  "/images/applications/crosswalks/crosswalks-23.jpg": "Grimsby, ON",
  "/images/applications/commercial-spaces/commercial-spaces-99.jpg": "Kitchener, ON",
  "/images/applications/commercial-spaces/commercial-spaces-75.jpg": "Toronto Premium Outlets, Halton Hills, ON",
  "/images/applications/public-art/public-art-05.jpg": "Sechelt, BC",
  "/images/applications/traffic-calming/traffic-calming-58.jpg": "Maple Ridge, BC",
  "/images/applications/bike-lanes/bike-lanes-40.jpg": "Dovercourt Village, Toronto, ON",
  "/images/applications/parks-paths/parks-paths-145.jpg": "Okanagan, BC",
};

/**
 * Hero photography.
 *
 * The homepage hero shipped as `alt="" aria-hidden="true"`. As an accessibility
 * decision that is defensible, the H1 sits on top of it and carries the
 * meaning. As an SEO decision it was costly: this is the single image Google
 * associates with hubss.com, it is the first entry in the sitemap, it is the
 * Open Graph image, and it was declaring itself to be decoration.
 *
 * It is not decoration. It is the UBC Musqueam crosswalk, a documented HUB
 * installation, with its own field note. Naming it costs nothing and describes
 * the photograph rather than repeating the headline, so a screen reader hears
 * the picture and the H1 as two different things instead of the same thing
 * twice.
 */
const HERO_ALT: Record<string, string> = {
  "/images/hero/hero-1.jpg":
    "The UBC Musqueam crosswalk at the University of British Columbia campus entrance in Vancouver: Coast Salish artwork rendered in coloured pavement by HUB Surface Systems",
};

export function heroAlt(src: string): string {
  return HERO_ALT[src.split("?")[0]] ?? seoAlt(src, "Decorative pavement");
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

export function subjectFor(src: string): ImageSubject | null {
  const folder = folderOf(src);
  const leaf = leafOf(folder);
  if (folder.startsWith("images/applications/")) return APPLICATION_SUBJECTS[leaf] ?? null;
  if (folder.startsWith("images/products/")) return PRODUCT_SUBJECTS[leaf] ?? null;
  return null;
}

/**
 * The documented place for a photo, or "" when there is none: the captions
 * sheet's (lib/image-facts.ts, province spelled out) first, then the file
 * and folder lists above.
 */
export function placeFor(src: string): string {
  const clean = src.split("?")[0];
  return spellProvince(IMAGE_FACTS[clean]?.place ?? FILE_PLACES[clean] ?? PLACES[folderOf(src)] ?? "");
}

const PROVINCES: Record<string, string> = { BC: "British Columbia", ON: "Ontario", QC: "Quebec", AB: "Alberta", MB: "Manitoba", SK: "Saskatchewan", NS: "Nova Scotia", NB: "New Brunswick", YT: "Yukon" };
/** "Kitchener, ON" -> "Kitchener, Ontario": the site spells provinces out, as the Product Book edition does. */
function spellProvince(place: string): string {
  return place.replace(/,\s*([A-Z]{2})$/, (m, code: string) => (PROVINCES[code] ? `, ${PROVINCES[code]}` : m));
}

/**
 * The system a photo in an APPLICATION folder is documented as showing, or
 * "" (lib/image-facts.ts). A product folder's photo is its product by the
 * folder rule; where a record names a sibling system for one (the book
 * captions a StreetPrint photo "StreetBond", the coating on it) the folder's
 * word stands and the sheet shows the record, so nothing here overrides it.
 */
export function systemFor(src: string): string {
  const clean = src.split("?")[0];
  return folderOf(clean).startsWith("images/applications/") ? (IMAGE_FACTS[clean]?.system ?? "") : "";
}

/**
 * Line and system pairs where putting the system in front of the line would
 * claim something the record does not, or read wrong: the LEED line says
 * solar-reflective, which only StreetBondSR is; the driveway line says
 * stamped asphalt, which is StreetPrint (StreetBond is the coating on it);
 * DecoMark and PreMark are graphics and markings laid on a surface, never the
 * surface itself ("DecoMark park path surface" said the path was DecoMark,
 * live for an hour on 26 Oct 2026), so their lines say what sits on what;
 * TrafficPatternsXD in the bus lane gallery is the paving at a rapidway or a
 * bus terminal, not a lane marking. `npm run test:images` fails a new pair
 * that reads the old way.
 */
const SYSTEM_LINES: Record<string, string> = {
  "Solar-reflective pavement coating|StreetBond": "StreetBond coating",
  "Stamped asphalt driveway|StreetBond": "StreetBond coating on a stamped asphalt driveway",
  "Parking lot surface|PreMark": "PreMark parking lot markings",
  "Parking lot surface|DecoMark": "DecoMark parking lot graphics",
  "Decorative crosswalk|PreMark": "PreMark crosswalk markings",
  "Crosswalk marking|PreMark": "PreMark crosswalk markings",
  "Park path surface|DecoMark": "DecoMark graphics on a park path",
  "Park path surface|PreMark": "PreMark markings on a park path",
  "Decorative plaza paving|DecoMark": "DecoMark graphics on a plaza",
  "Commercial site paving|DecoMark": "DecoMark graphics on a commercial site",
  "Coloured bike lane|DecoMark": "DecoMark graphics on a bike lane",
  "Coloured bike lane|PreMark": "PreMark bike lane markings",
  "Splash pad surface|DecoMark": "DecoMark graphics at a splash pad",
  "Sport court surface|DecoMark": "DecoMark graphics on a sport court",
  "Traffic calming surface treatment|DecoMark": "DecoMark traffic calming graphics",
  "Bus lane marking|TrafficPatternsXD": "TrafficPatternsXD decorative paving on a bus route",
};

/**
 * The gallery's word for an application photo, refined where the records
 * say what the picture shows ("Splash pad surface" for a splash pad in the
 * Parks & Paths gallery); a product folder's photo keeps the product's line.
 */
function labelFor(src: string, subject: ImageSubject): string {
  const clean = src.split("?")[0];
  if (!folderOf(clean).startsWith("images/applications/")) return subject.label;
  return IMAGE_FACTS[clean]?.label ?? subject.label;
}

/** "TrafficPatternsXD decorative crosswalk": the system in front of the folder's line. */
function subjectWithSystem(src: string, subject: ImageSubject): string {
  const label = labelFor(src, subject);
  const system = systemFor(src);
  if (!system) return label;
  const special = SYSTEM_LINES[`${label}|${system}`];
  if (special) return special;
  if (label.toLowerCase().startsWith(system.toLowerCase())) return label;
  return `${system} ${label[0].toLowerCase()}${label.slice(1)}`;
}

/**
 * "StreetPrint stamped asphalt", "TrafficPatternsXD decorative crosswalk,
 * Oakville, Ontario": the folder's subject, the documented system in front of
 * an application photo's, and the documented place after.
 */
function honestLine(src: string): string | undefined {
  const subject = subjectFor(src);
  if (!subject) return undefined;
  const line = subjectWithSystem(src, subject);
  const place = placeFor(src);
  return place ? `${line}, ${place}` : line;
}

/**
 * Alt text for a gallery image: the folder's subject and, where documented,
 * the place. Falls back to `fallbackContext` (the page-context string)
 * whenever the folder is not one with a subject: blog featured images, hero
 * art, one-off assets. A generic true line beats a specific invented one.
 */
export function seoAlt(src: string, fallbackContext: string): string {
  return honestLine(src) ?? fallbackContext;
}

/**
 * The visible caption under a photo in the lightbox: the same line as the
 * alt, because nothing more is known about the photo than its folder and,
 * sometimes, its place. Undefined when the folder has no subject, so the
 * caller's own fallback applies.
 */
export function seoCaption(src: string): string | undefined {
  return honestLine(src);
}

/** The phrases a photo can honestly carry, for schema `keywords`: its folder's subject and, where documented, its system. */
export function seoKeywords(src: string): string[] {
  const subject = subjectFor(src);
  if (!subject) return [];
  const system = systemFor(src);
  return system && !subject.label.toLowerCase().startsWith(system.toLowerCase()) ? [subject.label, system] : [subject.label];
}

// ── Recognising the old templates ─────────────────────────────────────────────
// Every line the six retired templates wrote, alt or caption, opened on one of
// these keywords and placed it "at" one of the settings below. Both together
// are the fingerprint: a hand-written hero alt can say "at an intersection",
// and the bike lanes and bus lanes heroes do, but not with "coloured bike
// lane" or "bus lane marking" in the same breath. Kept only for
// `looksGenerated`; nothing composes from these lists any more.
const RETIRED_KEYWORDS = [
  "decorative crosswalk", "coloured bike lane", "bus lane marking", "traffic calming surface treatment", "pedestrian safety pavement marking",
  "parking lot line marking", "decorative pathway paving", "playground surface graphics", "splash pad surfacing", "sport court surfacing",
  "pavement public art", "community branding pavement graphics", "decorative plaza paving", "commercial pavement design", "regulatory pavement marking",
  "stamped asphalt driveway", "townhome community paving", "airport pavement marking", "solar-reflective pavement coating",
  "TrafficPatternsXD preformed thermoplastic", "TrafficPatterns thermoplastic pavement marking", "StreetBond pavement coating", "StreetBondSR solar-reflective coating",
  "StreetPrint stamped asphalt", "DecoMark decorative pavement graphics", "MMAX MMA resin pavement system", "DuraTherm inlaid thermoplastic",
  "DuraShield asphalt coating", "PreMark preformed thermoplastic", "AirMark airfield pavement marking", "ChipFill pavement repair",
  "AggreFill pavement repair aggregate", "Fast Patch asphalt repair",
].map((k) => k.toLowerCase());
const RETIRED_SETTINGS = [
  "a municipal intersection", "a downtown main street", "a school zone", "a signalized urban intersection", "a commercial district", "a residential collector road",
  "a protected cycle track", "an intersection conflict zone", "a downtown bike corridor", "a multi-use path approach", "a separated bike lane",
  "a BRT corridor", "a red transit priority lane", "a bus stop approach", "a transit signal priority intersection", "an urban busway",
  "a raised intersection", "a neighbourhood gateway", "a pedestrian priority zone", "a Complete Streets corridor", "a Vision Zero treatment area", "a village centre main street",
  "a signalized crossing", "a transit stop approach", "a mid-block crossing", "a hospital campus entrance",
  "a retail parking lot", "a commercial plaza", "an office campus lot", "a grocery anchor site", "a multi-level parking deck approach",
  "a municipal park", "a waterfront promenade", "a multi-use trail", "a greenway connection", "a park entry plaza", "a botanical garden path",
  "a schoolyard", "a community playground", "an elementary school play area", "a park play zone", "a daycare courtyard",
  "a municipal splash pad", "a community water play area", "a park spray pad", "a recreation centre wet deck",
  "a municipal tennis court", "a school basketball court", "a community pickleball court", "a multi-sport pad",
  "a civic plaza", "a downtown intersection", "a community gathering space", "a cultural district street", "a public square",
  "a BIA main street", "a town centre plaza", "a downtown streetscape", "a festival street",
  "a pedestrian-only street", "a transit plaza", "a market square", "a campus quad",
  "a retail plaza entrance", "a shopping centre drive aisle", "a hotel forecourt", "a corporate campus entry", "a restaurant patio approach",
  "a municipal roadway", "a parking facility", "an intersection approach", "an industrial site road", "a campus service road",
  "a private residence", "an estate entrance", "a rural property driveway", "a laneway approach",
  "a suburban home", "a residential street frontage", "a new-build subdivision", "a heritage neighbourhood property",
  "a townhome development", "a condominium drive aisle", "a strata common entrance", "a multi-family courtyard",
  "an airport apron", "an airside service road", "a terminal forecourt", "a ground support equipment area",
  "a plaza surface", "an urban pathway",
  "a high-volume crosswalk", "a transit station zone",
  "a crosswalk", "an intersection treatment", "a pedestrian plaza", "a main street corridor",
  "a coloured crosswalk", "a bike lane", "a playground", "a sport court", "a transit lane",
  "a plaza", "a pedestrian pathway", "a courtyard surface",
  "a driveway", "a park pathway", "a commercial entrance", "a village main street",
  "a rainbow crosswalk", "a branded intersection", "a cultural art crossing",
  "a bus lane", "a transit corridor", "a cold-weather installation",
  "a pathway", "a courtyard", "a streetscape treatment",
  "a parking lot", "an access road", "a commercial site",
  "a roadway", "an intersection",
  "an airside road", "a ground service area",
  "a roadway repair", "a parking lot repair", "a pavement patch",
  "a pavement restoration",
  "a pothole repair", "a roadway patch",
];

/**
 * True when a line was written by the retired templates (see the file note),
 * so a page can replace it; false for anything a person wrote in Studio.
 */
export function looksGenerated(text: string | undefined | null): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return RETIRED_KEYWORDS.some((k) => lower.includes(k)) && RETIRED_SETTINGS.some((setting) => text.includes(` at ${setting}`));
}

/**
 * True when a Studio line is nothing a person wrote: the retired templates'
 * output, or the photo's bare folder line (what the pages printed from 30 Sep
 * to 26 Oct 2026, and what a sync may have copied into Studio), which the
 * documented system and place now extend.
 */
function replaceable(text: string | undefined | null, key: string): boolean {
  if (!text) return false;
  if (looksGenerated(text)) return true;
  const subject = subjectFor(key);
  return !!subject && text.trim() === subject.label;
}

/**
 * A photo with honest alt and caption: a line the retired templates wrote
 * into Studio, or the bare folder line, is replaced by what the photo's
 * records prove (through `origin`, the /public path the photo came from); a
 * line a person wrote stays. Width, height, src and origin pass through
 * untouched.
 */
export function honestPhoto<P extends { src: string; alt: string; caption?: string; origin?: string }>(p: P): P {
  const key = p.origin ?? p.src;
  const alt = replaceable(p.alt, key) ? seoAlt(key, p.alt) : p.alt;
  const caption = replaceable(p.caption, key) ? seoCaption(key) : p.caption;
  return { ...p, alt, caption };
}

// ── Structured data ───────────────────────────────────────────────────────────

const SITE = "https://hubss.com";
const YEAR = 2026;

/** The Organization node's @id, the one app/page.tsx and the product pages use. */
export const HUB_ORGANIZATION_ID = `${SITE}/#organization`;

export const HUB_ORGANIZATION = {
  "@type": "Organization",
  "@id": HUB_ORGANIZATION_ID,
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
 * where a licence is actually obtained, so neither URL is a fabrication.
 *
 * `creatorRef`: reference the Organization by @id instead of embedding it,
 * for a page that emits the node once (the product pages, 30 Sep 2026: the
 * StreetPrint gallery script carried 52 copies of it).
 *
 * See https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata
 */
export function imageObject(
  src: string,
  opts?: {
    alt?: string;
    caption?: string;
    representativeOfPage?: boolean;
    width?: number;
    height?: number;
    /**
     * The path whose folder describes the photo. A Sanity CDN URL has no
     * folder, so a photo migrated from /public passes its original path here
     * and keeps exactly the alt, caption and keywords it had before.
     */
    seoSrc?: string;
    creatorRef?: boolean;
  }
) {
  const abs = src.startsWith("http") ? src : `${SITE}${src.startsWith("/") ? "" : "/"}${src}`;
  const seo = opts?.seoSrc ?? src;
  const alt = opts?.alt ?? seoAlt(seo, "Decorative pavement");
  const caption = opts?.caption ?? seoCaption(seo);
  const keywords = seoKeywords(seo);

  return {
    "@type": "ImageObject",
    contentUrl: abs,
    url: abs,
    name: alt,
    description: caption ?? alt,
    ...(keywords.length ? { keywords: keywords.join(", ") } : {}),
    creator: opts?.creatorRef ? { "@id": HUB_ORGANIZATION_ID } : HUB_ORGANIZATION,
    creditText: "HUB Surface Systems",
    copyrightNotice: `© ${YEAR} HUB Surface Systems`,
    license: `${SITE}/terms`,
    acquireLicensePage: `${SITE}/contact`,
    ...(opts?.representativeOfPage ? { representativeOfPage: true } : {}),
    ...(opts?.width ? { width: opts.width } : {}),
    ...(opts?.height ? { height: opts.height } : {}),
  };
}

/**
 * imageObject for a Photo (lib/photos.ts). A photo migrated from /public keeps
 * the SEO text of its original path; a photo added in Studio uses its own alt
 * and caption. `ownText` forces the photo's own alt and caption, as the gallery
 * schema always did. `creatorRef` as in imageObject.
 */
export function photoObject(
  p: { src: string; alt: string; caption?: string; origin?: string; width?: number; height?: number },
  opts?: { representativeOfPage?: boolean; ownText?: boolean; creatorRef?: boolean }
) {
  const own = opts?.ownText || (!p.origin && /^https?:\/\//.test(p.src));
  return imageObject(p.src, {
    seoSrc: p.origin,
    ...(own ? { alt: p.alt, caption: p.caption } : {}),
    ...(p.width ? { width: p.width } : {}),
    ...(p.height ? { height: p.height } : {}),
    ...(opts?.representativeOfPage ? { representativeOfPage: true } : {}),
    ...(opts?.creatorRef ? { creatorRef: true } : {}),
  });
}

/** Absolute URLs for the sitemap's image extension. */
export function sitemapImages(srcs: string[], limit = 300): string[] {
  return srcs
    .slice(0, limit)
    .map((s) => (s.startsWith("http") ? s : `${SITE}${s.startsWith("/") ? "" : "/"}${s}`));
}
