/**
 * Product editorial, lifted from the HUBSS 2026/27 print catalogue.
 *
 * WHY THIS EXISTS: the web product pages had no positioning line at all. The
 * H1 read "StreetBond" and the next thing a specifier met was a heading that
 * said "About StreetBond" — a CMS label, not a sentence. Meanwhile Vernon had
 * already written, and the client had already approved, a precise one-line
 * positioning statement for every product in the catalogue Vernon designed.
 *
 * So this is not new copy. It is the catalogue's own words, transcribed from
 * the Figma file (HUBSS-Catalogue-2026, page "Catalogue 2027"), so that print
 * and web tell an identical story in identical language. That is what makes it
 * safe to ship the night before a client review: there is nothing here Doug
 * has not already seen on a page.
 *
 * THE CATALOGUE'S GRAMMAR, which the web page now mirrors:
 *
 *     HUB SURFACE SYSTEMS          eyebrow, orange, letterspaced
 *     StreetBond                   product name
 *     ───                          orange signature dash
 *
 *     The colour system.           title — the positioning line
 *     Epoxy modified acrylic…      subhead
 *     Designed to move with…       description
 *
 *     TYPE         SURFACES        four-cell spec grid
 *     COLOURS      LIFE CYCLE
 *
 *     PARKS · PLAYGROUNDS · …      uses strip
 *
 * TWO TRANSCRIPTION NOTES. The catalogue has "acylic" in the StreetBond spec
 * grid and "stake holders" in the TrafficPatternsXD description; both are
 * corrected here and flagged to Vernon for the print file. Everything else is
 * verbatim, including the Canadian spellings and Vernon's "eh?".
 */

export interface CatalogueSpec {
  label: string;
  value: string;
}

export interface CatalogueEntry {
  /** The positioning line. Sits under the product name, where nothing was. */
  title: string;
  /** One line of qualification under the title. */
  subhead: string;
  /** The paragraph that earns the claim. */
  description: string;
  /** Four label/value pairs. The catalogue never runs more; neither do we. */
  specs: [CatalogueSpec, CatalogueSpec, CatalogueSpec, CatalogueSpec];
  /** The footer strip — where this system goes, in the catalogue's own caps. */
  uses: string[];
  /** Catalogue cross-sell strip, where the printed page carries one. */
  alsoNeed?: { heading: string; items: string[] };
  /** Catalogue page number, so a reader can find the same page in print. */
  page: number;
}

export const PRODUCT_CATALOGUE: Record<string, CatalogueEntry> = {
  "traffic-patterns": {
    title: "Preformed thermoplastic.",
    subhead: "You design it, we build it. Think jigsaw puzzle…",
    description:
      "Anti-skid aggregate is intermixed through the full cross-section, not broadcast across the top — so the grip lasts as long as the colour. Customisable to community artwork.",
    specs: [
      { label: "Thickness", value: "125 mil" },
      { label: "Skid resistance", value: "60 BPN — ASTM E303" },
      { label: "Open to traffic", value: "Hours" },
      { label: "Service life", value: "8+ years" },
    ],
    uses: ["Crosswalks", "Entrance features", "Parks", "Retail"],
    page: 10,
  },

  "traffic-patterns-xd": {
    title: "For the toughest environments.",
    subhead: "Aggregate-reinforced, preformed thermoplastic. Traffic tough, proven coast to coast.",
    description:
      "The toughest material in the range, built for performance. Performance proven with bus traffic and concentrated wheel loads. High colour contrast for safety. Specified by Canadian transit authorities, municipalities and stakeholders across Canada.",
    specs: [
      { label: "Thickness", value: "150 mil" },
      { label: "Aggregate", value: "8–9 Mohs rating" },
      { label: "Skid resistance", value: "60 BPN — ASTM E303" },
      { label: "Service life", value: "10+ years" },
    ],
    uses: ["Crosswalks", "Entrances", "Transit", "Streetscapes"],
    page: 12,
  },

  streetprint: {
    title: "Stamped asphalt.",
    subhead: "The original. A Canadian invention, eh?",
    description:
      "Patterns are stamped into existing asphalt, then coloured and sealed with our StreetBond coatings. The surface stays flush — nothing for a plow blade to catch, no joints to weed, no pavers to settle, asphalt stays flexible.",
    specs: [
      { label: "System", value: "In-place stamping + StreetBond coating" },
      { label: "Patterns", value: "Standard and custom options" },
      { label: "Service life", value: "10–20 years" },
      { label: "Base", value: "New or existing asphalt" },
    ],
    uses: ["Crosswalks", "Driveways", "Plazas", "Heritage"],
    page: 18,
  },

  streetbond: {
    title: "The colour system.",
    subhead: "Epoxy modified acrylic, engineered to perform.",
    description:
      "Designed to move with the pavement, avoiding the three failures of rigid coatings: cracking, premature wear, and slipperiness. Sixty-three standard colours plus full custom colour matching.",
    specs: [
      // Catalogue prints "acylic" here. Corrected on the web; flagged for print.
      { label: "Type", value: "Water based, epoxy modified, acrylic" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Colours", value: "63 standard + custom colours" },
      { label: "Life cycle", value: "8+ years / easily refreshed" },
    ],
    uses: ["Parks", "Playgrounds", "Courts", "Surface colour"],
    page: 24,
  },

  streetbondsr: {
    title: "Solar reflective coating.",
    subhead: "LEED V5 Credit: Urban heat island reduction.",
    description:
      "The same flexible chemistry as StreetBond, formulated to reflect rather than absorb. Twelve colours carry SR 0.33 or higher and can contribute to LEED V5 heat-island credits.",
    specs: [
      { label: "Solar reflectance", value: "≥ 0.33 initial" },
      { label: "LEED", value: "V5 SS Credit: Heat Island" },
      { label: "Surfaces", value: "Asphalt" },
      { label: "Life cycle", value: "8+ years" },
    ],
    uses: ["Parking", "Plazas", "LEED projects", "Schools"],
    page: 26,
  },

  decomark: {
    title: "Custom graphics.",
    subhead: "Custom graphics. Community identity. Civic landmarks at street scale.",
    description:
      "Factory fabricated to your vector artwork using our colour palette, then heat-fused permanently to the substrate. Community identity, commemorative art, wayfinding and civic landmarks at street scale.",
    specs: [
      { label: "System", value: "Preformed thermoplastic" },
      { label: "Colour", value: "Standard and premium options" },
      { label: "Design", value: "Vector artwork" },
      { label: "Installation", value: "Heat fused" },
    ],
    uses: ["Identity", "Wayfinding", "Public art", "Memorial"],
    page: 30,
  },

  mmax: {
    title: "MMA area markings.",
    subhead: "Methyl methacrylate. 45–60 min cure. Built for Canadian climates.",
    description:
      "Fast return to service, so an active corridor goes in overnight without touching weekday service. Best in class performance.",
    specs: [
      { label: "Material", value: "Methyl methacrylate (MMA) resin" },
      { label: "Cure", value: "45–60 min — traffic-ready" },
      { label: "Traction", value: "Embedded aggregate / non-slip" },
      { label: "Min temp", value: "+3°C" },
    ],
    uses: ["Bus lanes", "Bike lanes", "Calming", "Transit"],
    page: 32,
  },

  duratherm: {
    title: "Inlaid thermoplastic.",
    subhead: "Heat fused thermoplastic into a stamped surface. Zero profile above grade.",
    description:
      "Inlaid into a stamped impression so the finished surface sits flush with the road — nothing for a plow blade to catch, nothing to trip on, no shear damage through winter maintenance.",
    specs: [
      { label: "Install", value: "Inlaid into a stamped surface" },
      { label: "Profile", value: "Zero — flush with road" },
      { label: "Snowplow safe", value: "Yes — no shear risk" },
      { label: "Bond", value: "Heat-fused to asphalt substrate" },
    ],
    uses: ["Crosswalks", "Streetscape", "Calming", "Identity"],
    page: 34,
  },

  durashield: {
    title: "Pavement maintenance coating.",
    subhead: "Two-component epoxy-modified acrylic. Solar reflective options.",
    description:
      "A maintenance coating for asphalt. Resists fuel, oil and de-icing agents, cools the surface, and protects the substrate underneath, extending the life cycle of the pavement.",
    specs: [
      { label: "Type", value: "Epoxy-modified acrylic coating" },
      { label: "Solar reflectance", value: "Optional" },
      { label: "Chemical resistance", value: "Fuel, oil, de-icing agents" },
      { label: "Applications", value: "Preserves and protects asphalt" },
    ],
    uses: ["Parking", "Driveways", "Pathways", "LEED sites"],
    page: 36,
  },

  premark: {
    title: "Road marking symbols.",
    subhead: "Arrows. Stop bars. Legends. Bike symbols. No stencils.",
    description:
      "Arrows, stop bars, yield triangles, school legends, bike symbols and ladder lines, pre-cut to specification. Heat-applied by torch — no stencils, no curing window, drive on immediately. Provincially approved across Canada.",
    specs: [
      { label: "Thickness", value: "125 mil standard / 90 mil ViziGrip" },
      { label: "Installation", value: "Heat-applied — drive on immediately" },
      { label: "Retroreflectivity", value: "Intersection-grade glass bead" },
      { label: "Service life", value: "6–8 years" },
    ],
    uses: ["Bike lanes", "Crosswalks", "Regulatory", "Parking"],
    alsoNeed: {
      heading: "Surface repair and maintenance",
      items: ["AirMark", "ChipFill", "AggreFill", "Fast Patch DPR"],
    },
    page: 38,
  },
};

export function catalogueFor(slug: string): CatalogueEntry | undefined {
  return PRODUCT_CATALOGUE[slug];
}
