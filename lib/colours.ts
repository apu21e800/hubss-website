/**
 * Product colour systems — single source of truth for on-site colour guides.
 *
 * StreetBond / StreetBondSR / DuraShield: extracted from the official
 * "StreetBond Color Card — Pavement Color Reference, 2026 Edition" (GAF).
 * Hexes are the card's own screen values (vector fills, exact); sr = the
 * card's published Solar Reflectance.
 *
 * TrafficPatterns / TrafficPatternsXD: extracted from the HUBSS
 * "Traffic Patterns Color Palette" guide; pms = specified Pantone match.
 *
 * Screen reference only — physical samples for specification.
 * PDFs: /docs/StreetBond/StreetBond/StreetBond-Colour-Card-2026.pdf ·
 * /docs/TrafficPatternsXD/TrafficPatternsXD-Colour-Guide.pdf
 */

export interface Colourant {
  name: string;
  hex: string;
  /** Published solar reflectance (2026 StreetBond card) */
  sr?: number;
  /** Specified Pantone match (thermoplastic lines) */
  pms?: string;
  /** Near-white chips get a hairline keyline */
  keyline?: boolean;
}

export interface ColourFamily {
  key: string;
  name: string;
  blurb: string;
  colours: Colourant[];
}

const EMA_2026: ColourFamily = {
  key: "ema-2026",
  name: "EMA Colours — 2026 Colour Card",
  blurb: "All 63 epoxy-modified acrylic colours, each with its published solar reflectance. Full Pantone custom matching available.",
  colours: [
      { name: "Safety Red", hex: "#b32a22", sr: 0.46 },
      { name: "SR Paprika", hex: "#a04438", sr: 0.36 },
      { name: "Flamingo", hex: "#e8418d", sr: 0.57 },
      { name: "Rose", hex: "#c95767", sr: 0.58 },
      { name: "Sunset Blush", hex: "#a8746e", sr: 0.25 },
      { name: "Safety Orange", hex: "#e7522a", sr: 0.56 },
      { name: "Pumpkin Spice", hex: "#b85d2a", sr: 0.33 },
      { name: "Burnt Sienna", hex: "#532926", sr: 0.07 },
      { name: "Nutmeg", hex: "#9a675a", sr: 0.30 },
      { name: "Terra Cotta", hex: "#a04a3a", sr: 0.13 },
      { name: "Brick", hex: "#6a342e", sr: 0.11 },
      { name: "Chestnut Brown", hex: "#9c4a37", sr: 0.34 },
      { name: "Sierra", hex: "#3a2f2a", sr: 0.07 },
      { name: "Safety Yellow", hex: "#f0bf3a", sr: 0.62 },
      { name: "Marigold", hex: "#c0832a", sr: 0.35 },
      { name: "SR Mustard", hex: "#c87f3a", sr: 0.41 },
      { name: "Butterscotch", hex: "#b87863", sr: 0.30 },
      { name: "SR Sunbaked Clay", hex: "#cd8e6a", sr: 0.45 },
      { name: "Avocado", hex: "#7a7e3a", sr: 0.35 },
      { name: "Sage", hex: "#9b9784", sr: 0.17 },
      { name: "Cactus", hex: "#6ea264", sr: 0.34 },
      { name: "Bike Path Green", hex: "#8fb4a7", sr: 0.26 },
      { name: "Celtic Green", hex: "#3d8741", sr: 0.31 },
      { name: "Shamrock", hex: "#6aa138", sr: 0.32 },
      { name: "Emerald Green", hex: "#235638", sr: 0.22 },
      { name: "Hunter Green", hex: "#2f3d3a", sr: 0.05 },
      { name: "SR Evergreen", hex: "#3e4a30", sr: 0.33 },
      { name: "Sea Foam", hex: "#7da08c", sr: 0.21 },
      { name: "Jade", hex: "#7dc8a6", sr: 0.50 },
      { name: "Aqua", hex: "#7e8f8a", sr: 0.22 },
      { name: "Sky Blue", hex: "#5cc7e8", sr: 0.50 },
      { name: "Ocean", hex: "#23a6cf", sr: 0.45 },
      { name: "Tide", hex: "#2c7e95", sr: 0.28 },
      { name: "Safety Blue", hex: "#1e4d82", sr: 0.33 },
      { name: "Cobalt Blue", hex: "#445b6c", sr: 0.31 },
      { name: "Patriot Blue", hex: "#3b4d5c", sr: 0.06 },
      { name: "Aster", hex: "#3d2f8a", sr: 0.35 },
      { name: "Smokey Mauve", hex: "#6f5f6a", sr: 0.13 },
      { name: "Mocha", hex: "#6e3d34", sr: 0.11 },
      { name: "Down to Earth", hex: "#6a503e", sr: 0.12 },
      { name: "SR Brownstone", hex: "#7e3527", sr: 0.33 },
      { name: "Bedrock", hex: "#4f4742", sr: 0.07 },
      { name: "Brown Suede", hex: "#7a4a3c", sr: 0.11 },
      { name: "Truffle", hex: "#9b8366", sr: 0.23 },
      { name: "Taupe", hex: "#a89186", sr: 0.25 },
      { name: "Driftwood", hex: "#b59872", sr: 0.25 },
      { name: "San Diego Buff", hex: "#c8a288", sr: 0.25 },
      { name: "SR Khaki", hex: "#c2a784", sr: 0.34 },
      { name: "SR Fawn", hex: "#c98e6c", sr: 0.33 },
      { name: "Sandy Beige", hex: "#a89274", sr: 0.26 },
      { name: "SR Sandstone", hex: "#c7bba8", sr: 0.37 },
      { name: "SR Irish Cream", hex: "#dabea4", sr: 0.49 },
      { name: "SR Limestone", hex: "#b3b6a7", sr: 0.34 },
      { name: "SR White", hex: "#ece8dc", sr: 0.77, keyline: true },
      { name: "Sterling", hex: "#9bb6b3", sr: 0.21 },
      { name: "Pewter", hex: "#b5b9b2", sr: 0.24 },
      { name: "Concrete Gray", hex: "#a39d8e", sr: 0.17 },
      { name: "SR Mod Slate", hex: "#666e72", sr: 0.34 },
      { name: "Granite", hex: "#52595a", sr: 0.07 },
      { name: "Gunmetal", hex: "#8aa1a8", sr: 0.21 },
      { name: "Slate", hex: "#666e72", sr: 0.06 },
      { name: "Graphite", hex: "#5c6058", sr: 0.07 },
      { name: "Black", hex: "#262a2c", sr: 0.04 },
  ],
};

const SR_SERIES: ColourFamily = {
  key: "sr-series",
  name: "SR Series",
  blurb: "The solar-reflective colourants from the 2026 card — engineered to reject heat and qualify surfaces for LEED Heat Island Reduction credits.",
  colours: [
      { name: "SR Paprika", hex: "#a04438", sr: 0.36 },
      { name: "SR Mustard", hex: "#c87f3a", sr: 0.41 },
      { name: "SR Sunbaked Clay", hex: "#cd8e6a", sr: 0.45 },
      { name: "SR Evergreen", hex: "#3e4a30", sr: 0.33 },
      { name: "SR Brownstone", hex: "#7e3527", sr: 0.33 },
      { name: "SR Khaki", hex: "#c2a784", sr: 0.34 },
      { name: "SR Fawn", hex: "#c98e6c", sr: 0.33 },
      { name: "SR Sandstone", hex: "#c7bba8", sr: 0.37 },
      { name: "SR Irish Cream", hex: "#dabea4", sr: 0.49 },
      { name: "SR Limestone", hex: "#b3b6a7", sr: 0.34 },
      { name: "SR White", hex: "#ece8dc", sr: 0.77, keyline: true },
      { name: "SR Mod Slate", hex: "#666e72", sr: 0.34 },
  ],
};

const DURASHIELD: ColourFamily = {
  key: "durashield",
  name: "DuraShield",
  blurb: "Protective overcoat greys from the 2026 colour card.",
  colours: [
      { name: "SR Gray", hex: "#7d858b", sr: 0.35 },
      { name: "Asphalt Gray", hex: "#3b4044", sr: 0.07 },
  ],
};

const TP_STANDARD: ColourFamily = {
  key: "tp-standard",
  name: "Standard",
  blurb: "The core preformed-thermoplastic range — earth and masonry tones matched to the closest PMS reference.",
  colours: [
      { name: "Black", hex: "#000000" },
      { name: "Salmon", hex: "#ff8766", pms: "PMS 486C" },
      { name: "Khaki", hex: "#d4a574", pms: "PMS 7529C" },
      { name: "Field Grey", hex: "#414029", pms: "PMS 418C" },
      { name: "Sonoma Sand", hex: "#e1916b", pms: "PMS 479C" },
      { name: "Tan", hex: "#e5b879", pms: "PMS 727C" },
      { name: "Grey", hex: "#646464", pms: "PMS 423C" },
      { name: "Cinnamon", hex: "#f2a172", pms: "PMS 7591C" },
      { name: "Sand", hex: "#e9d49b", pms: "PMS 7501C", keyline: true },
      { name: "White", hex: "#ffffff", keyline: true },
      { name: "Sienna", hex: "#b0531a", pms: "PMS 7587C" },
      { name: "Santa Fe Clay", hex: "#a84925", pms: "PMS 174C" },
      { name: "Cocoa", hex: "#704e36", pms: "PMS 7596C" },
      { name: "Heritage Red", hex: "#b24721", pms: "PMS 7593C" },
      { name: "Chestnut", hex: "#883e01", pms: "PMS 7601C" },
      { name: "Colonial Brick", hex: "#783829", pms: "PMS 483C" },
      { name: "Dark Red Brick", hex: "#480102", pms: "PMS 7610C" },
      { name: "Brick Red", hex: "#780000", pms: "PMS 7624C" },
      { name: "Burnt Orange", hex: "#ea5329", pms: "PMS 173C" },
      { name: "Terracotta", hex: "#713b20", pms: "PMS 7595C" },
  ],
};

const TP_PREMIUM: ColourFamily = {
  key: "tp-premium",
  name: "Premium",
  blurb: "High-chroma premium colours for identity, wayfinding, and safety work.",
  colours: [
      { name: "LT Grey", hex: "#afafaf", pms: "PMS 420C" },
      { name: "LT Blue", hex: "#5f85af", pms: "PMS 7688C" },
      { name: "Blue", hex: "#0402b2", pms: "PMS 654C" },
      { name: "Olive Green", hex: "#495d00", pms: "PMS 5757C" },
      { name: "Sky Blue", hex: "#a1ccea", pms: "PMS 278C" },
      { name: "Teal", hex: "#035a40", pms: "PMS 7474C" },
      { name: "Green", hex: "#008750", pms: "PMS 334C" },
      { name: "SYG", hex: "#d1dc00", pms: "PMS 389C" },
      { name: "Kelly Green", hex: "#00aa00", pms: "PMS 347C" },
      { name: "Pink", hex: "#fe787b", pms: "PMS 190C" },
      { name: "Lemon Yellow", hex: "#feff1a", pms: "PMS 102C", keyline: true },
      { name: "LT Green", hex: "#9bcd0f", pms: "PMS 361C" },
      { name: "Purple", hex: "#5d006c", pms: "PMS 259C" },
      { name: "Orange", hex: "#f66103", pms: "PMS 7579C" },
      { name: "Yellow", hex: "#febd07", pms: "PMS 7408C" },
      { name: "Lilac", hex: "#5e006d", pms: "PMS 7440C" },
      { name: "Red", hex: "#cd153e", pms: "PMS 200C" },
  ],
};

const PRODUCT_COLOURS: Record<string, ColourFamily[]> = {
  streetbond: [EMA_2026],
  streetbondsr: [SR_SERIES],
  durashield: [DURASHIELD],
  "traffic-patterns-xd": [TP_STANDARD, TP_PREMIUM],
  "traffic-patterns": [TP_STANDARD, TP_PREMIUM],
};

export interface ColourSectionMeta {
  heading: string;
  intro: string;
  downloadHref?: string;
  downloadLabel?: string;
}

const SECTION_META: Record<string, ColourSectionMeta> = {
  streetbond: {
    heading: "The colour system.",
    intro: "Sixty-three EMA colours from the 2026 colour card, each with published solar reflectance. Full Pantone custom matching for branded environments.",
    downloadHref: "/docs/StreetBond/StreetBond/StreetBond-Colour-Card-2026.pdf",
    downloadLabel: "Download the 2026 colour card (PDF)",
  },
  streetbondsr: {
    heading: "Solar-reflective colours.",
    intro: "The SR series from the 2026 colour card — high-reflectance colourants for cooler surfaces and LEED Heat Island Reduction credits.",
    downloadHref: "/docs/StreetBond/StreetBond/StreetBond-Colour-Card-2026.pdf",
    downloadLabel: "Download the 2026 colour card (PDF)",
  },
  durashield: {
    heading: "DuraShield colours.",
    intro: "Two engineered greys for protective overcoat work, from the 2026 colour card.",
    downloadHref: "/docs/StreetBond/StreetBond/StreetBond-Colour-Card-2026.pdf",
    downloadLabel: "Download the 2026 colour card (PDF)",
  },
  "traffic-patterns-xd": {
    heading: "The colour palette.",
    intro: "Twenty standard and seventeen premium preformed-thermoplastic colours, PMS-matched. Physical samples available on request.",
    downloadHref: "/docs/TrafficPatternsXD/TrafficPatternsXD-Colour-Guide.pdf",
    downloadLabel: "Download the colour guide (PDF)",
  },
  "traffic-patterns": {
    heading: "The colour palette.",
    intro: "Twenty standard and seventeen premium preformed-thermoplastic colours, PMS-matched. Physical samples available on request.",
    downloadHref: "/docs/TrafficPatternsXD/TrafficPatternsXD-Colour-Guide.pdf",
    downloadLabel: "Download the colour guide (PDF)",
  },
};

export function familiesFor(slug: string): ColourFamily[] {
  return PRODUCT_COLOURS[slug] ?? [];
}

export function colourSectionFor(slug: string): ColourSectionMeta | null {
  return SECTION_META[slug] ?? null;
}
