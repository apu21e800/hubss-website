/**
 * Application editorial, lifted from the HUB 2027 print catalogue.
 *
 * WHY THIS EXISTS: the same reason lib/product-catalogue.ts exists, one level
 * up. Every application spread in the catalogue carries three things the web
 * page did not have — a headline, a one-line statement, and a SPECIFY list
 * naming which systems go in that application and why. That list is the most
 * useful sentence on the page for a specifier, and it is the client's own
 * product selection: Doug has signed off on the printed page.
 *
 * So this is not new copy. It is the catalogue's own words, extracted from the
 * Figma file (HUBSS-Catalogue-2026, page "Catalogue 2027") on 7 Sep 2026,
 * frame by frame.
 *
 * THE CATALOGUE'S GRAMMAR, which the web page now mirrors:
 *
 *     APPLICATION 01                eyebrow, orange, letterspaced
 *     CROSSWALKS                    application name
 *
 *     Crosswalks that hold their    title — the headline
 *       colour and their grip.
 *     The intersection is where     statement — the pull line
 *       a street proves itself.
 *     Preformed thermoplastic       body — the paragraph that earns it
 *       holds ASTM-rated skid…
 *
 *     SPECIFY                       the systems, and why each one
 *       TrafficPatternsXD  150 mil, aggregate-reinforced…
 *
 * TRANSCRIPTION NOTES. Print typos are corrected here and flagged for the
 * print file: "can reproduces" (p56), "a non slip surfaces" (p58),
 * "complimenting" for complementing (p72), "keeps us cooler" (p60). Casing in
 * the SPECIFY notes is normalised to sentence case. Everything else is
 * verbatim, including the Canadian spellings.
 *
 * WHERE A SPREAD SERVES TWO PAGES: the catalogue runs one Private Driveways
 * spread and the site has both /private-driveways and /residential-driveways,
 * so both carry it. The site's Bus Lanes page carries the catalogue's
 * High-Traffic Corridors spread (p52) — the spread that covers transit
 * corridors — and says so in its own note below.
 */

export interface ApplicationSpecify {
  /** Product slug on this site, so the strip can link. */
  slug: string;
  /** The catalogue's own reason for specifying it here. */
  note: string;
}

export interface ApplicationCatalogueEntry {
  /** The headline from the printed spread. */
  title: string;
  /** The pull line under it. */
  statement: string;
  /** The paragraph that earns the claim. */
  body: string;
  /** The SPECIFY strip — which systems, and why, in the catalogue's order. */
  specify: ApplicationSpecify[];
  /** Catalogue page number, so a reader can find the same spread in print. */
  page: number;
  /** Set when the spread's printed title differs from this page's name. */
  spreadName?: string;
}

export const APPLICATION_CATALOGUE: Record<string, ApplicationCatalogueEntry> = {
  crosswalks: {
    title: "Crosswalks that hold their colour and their grip.",
    statement: "The intersection is where a street proves itself.",
    body: "Preformed thermoplastic holds ASTM-rated skid resistance and high-contrast colour through snowplow cycles and de-icing seasons.",
    specify: [
      { slug: "traffic-patterns-xd", note: "150 mil, aggregate-reinforced — high-volume intersections" },
      { slug: "traffic-patterns", note: "125 mil preformed — standard crossings" },
      { slug: "decomark", note: "Custom graphics — community identity" },
    ],
    page: 46,
  },

  "sport-courts": {
    title: "Court colours expanded.",
    statement: "A court is one of the hardest colour environments in outdoor pavement.",
    body: "Using StreetBond to transform an asphalt playground into a vibrant, coloured surface. Non-slip, UV stable and tough enough for years of play.",
    specify: [
      { slug: "streetbond", note: "Court colour on asphalt or concrete" },
      { slug: "streetbondsr", note: "Solar reflective — cooler underfoot" },
    ],
    page: 48,
  },

  "bike-lanes": {
    title: "Visibility that holds, season after season.",
    statement: "Durability. Performance. Visibility. Safety.",
    body: "With proven performance coast to coast our materials offer cyclists the added safety of non-slip, high contrast, durable cycling surfaces.",
    specify: [
      { slug: "mmax", note: "MMA resin — fast to return to service" },
      { slug: "premark", note: "Pre-cut bike symbols" },
    ],
    page: 50,
  },

  // The catalogue prints this spread as "High-Traffic Corridors" — transit
  // corridors, campus arteries and shopping-centre entrances. Bus lanes are
  // the first duty it names, and this is the client's own product selection
  // for that duty, so the Bus Lanes page carries it under its own name.
  "bus-lanes": {
    title: "Thousands pass through the same space every day.",
    statement: "In high-traffic corridors, every detail counts.",
    body: "Transit corridors, campus arteries and shopping-centre entrances concentrate wear into a few square metres. Aggregate-reinforced thermoplastic and MMA resin carry the load where paint and thin coatings wear through in a season.",
    specify: [
      { slug: "traffic-patterns-xd", note: "150 mil, aggregate-reinforced — crossings, thresholds, loading aprons" },
      { slug: "mmax", note: "MMA resin — lane and area markings, traffic-ready in about an hour" },
      { slug: "duratherm", note: "Inlaid and flush — plow-safe crossings in the corridor" },
    ],
    page: 52,
    spreadName: "High-Traffic Corridors",
  },

  "traffic-calming": {
    title: "Drivers slow for what they can see.",
    statement: "A change in surface is a change in speed.",
    body: "Traffic calming devices such as roundabout medians, truck aprons, gateway treatments and speed tables: a change in colour and texture tells a driver the rules have changed before any sign does. Stamped asphalt carries heavy loads and holds its pattern for years to come.",
    specify: [
      { slug: "streetprint", note: "Traffic calming device treatments" },
      { slug: "streetbond", note: "Sidewalks, pathways and plazas" },
      { slug: "traffic-patterns-xd", note: "Durable road surface treatments" },
    ],
    page: 54,
  },

  playgrounds: {
    title: "Vibrant, slip-resistant, built for heavy use.",
    statement: "Make concrete and asphalt your canvas.",
    body: "With unlimited design potential, vibrant colour options and non-slip surfaces. Children will get years of enjoyment and stimulation.",
    specify: [
      { slug: "decomark", note: "Custom graphics and play markings" },
      { slug: "streetbond", note: "Slip-resistant colour field" },
      { slug: "streetbondsr", note: "Cooler underfoot in full sun" },
    ],
    page: 58,
    spreadName: "Play Surfaces",
  },

  "splash-pads": {
    title: "Slip-resistant. Cool to touch. Vivid colour.",
    statement: "Splash pad surfaces are uniquely demanding: constant water exposure, chemical treatments, bare feet.",
    body: "A slip-resistant texture built for constant water, chemical treatment and bare feet — with solar-reflective options that stay cooler underfoot.",
    specify: [
      { slug: "streetbond", note: "Excellent skid and slip resistance" },
      { slug: "streetbondsr", note: "SR ≥ 0.33 — coatings that keep the surface cooler" },
    ],
    page: 60,
  },

  "pedestrian-safety": {
    title: "Vision Zero, starting at the surface.",
    statement: "Pedestrian safety isn't just aesthetic aspiration — it's a measurable outcome.",
    body: "High-contrast material combined with retro-reflective markings that stay visible year round. Proven performance in the harshest environments.",
    specify: [
      { slug: "traffic-patterns-xd", note: "150 mil, aggregate-reinforced — high-volume crossings" },
      { slug: "traffic-patterns", note: "125 mil preformed — high-contrast markings" },
      { slug: "premark", note: "Retroreflective symbols and legends" },
      { slug: "mmax", note: "MMA resin — 45–60 minute cure" },
    ],
    page: 62,
  },

  "public-spaces": {
    title: "Nobody wants boring.",
    statement: "Dynamic surface treatments for high-visibility community hardscapes.",
    body: "Stamped asphalt gives parks, plazas and streetscapes visual weight with minimal maintenance.",
    specify: [
      { slug: "streetprint", note: "A wide range of imprinted patterns with less maintenance fuss" },
      { slug: "streetbond", note: "Vibrant and durable, colourful hardscapes" },
      { slug: "decomark", note: "Community brands and orientation graphics" },
    ],
    page: 64,
  },

  "public-art": {
    title: "Public art, at the scale of the street.",
    statement: "The street is one of the largest untapped canvases in any city.",
    body: "Artist artwork can be reproduced and installed into the roadway — durable, slip-resistant, vibrant additions to any community.",
    specify: [
      { slug: "decomark", note: "Artwork and graphics" },
      { slug: "streetbond", note: "Large-scale colour fields" },
      { slug: "traffic-patterns", note: "Large-scale interconnected thermoplastic" },
    ],
    page: 66,
  },

  "community-branding": {
    title: "Neighbourhood identity, becoming part of the street.",
    statement: "Every neighbourhood has a story.",
    body: "Crests, way-finding, heritage markers along with BIA identities fused to the surface. The street can tell the story.",
    specify: [
      { slug: "decomark", note: "Horizontal wayfinding and community/BIA branding" },
      { slug: "traffic-patterns-xd", note: "High performance decorative crosswalks" },
      { slug: "traffic-patterns", note: "Streetscape enhancement and beautification" },
    ],
    page: 68,
  },

  "commercial-spaces": {
    title: "Premium materials for commercial parking lots.",
    statement: "Complementing urban design elements with performance-based solutions.",
    body: "After 10 years of constant use, these crossings have provided a safe and durable path for pedestrians. TrafficPatternsXD performs year after year.",
    specify: [
      { slug: "traffic-patterns-xd", note: "Pedestrian channelization; the look of pavers, stones and cobbles" },
    ],
    page: 72,
  },

  townhomes: {
    title: "Cohesive hardscape for strata developments.",
    statement: "Townhome and strata developments live and die by their first impression.",
    body: "Entry courts and shared drives with the look of clay pavers or stone cobble. Nothing settles, nothing weeds, and nobody is repointing in year five.",
    specify: [
      { slug: "streetprint", note: "Stamped entry courts and driveways" },
      { slug: "streetbond", note: "Colour and sealing" },
      { slug: "durashield", note: "Shared-drive maintenance" },
    ],
    page: 74,
  },

  "private-driveways": {
    title: "Stone-paver looks, without demolition.",
    statement: "Most driveways fail on appearance long before they fail on structure.",
    body: "Stamped asphalt can transform new or existing asphalt into the look of cobble, brick, herringbone or slate. Pick a pattern, pick a colour and enjoy years of maintenance-free performance.",
    specify: [{ slug: "streetprint", note: "Stamped and coloured asphalt" }],
    page: 76,
  },

  // One printed spread, two pages on the site.
  "residential-driveways": {
    title: "Stone-paver looks, without demolition.",
    statement: "Most driveways fail on appearance long before they fail on structure.",
    body: "Stamped asphalt can transform new or existing asphalt into the look of cobble, brick, herringbone or slate. Pick a pattern, pick a colour and enjoy years of maintenance-free performance.",
    specify: [{ slug: "streetprint", note: "Stamped and coloured asphalt" }],
    page: 76,
    spreadName: "Private Driveways",
  },

  "parking-lots": {
    title: "Looks maintained, performs safely, costs less.",
    statement: "Parking lots take a disproportionate beating.",
    body: "Asphalt breaks down when it's exposed to the elements. By using StreetPrint, StreetBond, DuraShield or TrafficPatternsXD you are adding aesthetic value all while preserving the underlying asphalt.",
    specify: [
      { slug: "durashield", note: "Maintenance coating" },
      { slug: "streetbond", note: "Coloured coating to enhance and preserve" },
      { slug: "streetprint", note: "Stamped asphalt treated with StreetBond coating" },
      { slug: "traffic-patterns-xd", note: "150 mil, aggregate-reinforced — high-traffic bays and crossings" },
    ],
    page: 78,
  },
};

export function applicationCatalogueFor(slug: string): ApplicationCatalogueEntry | undefined {
  return APPLICATION_CATALOGUE[slug];
}
