/**
 * StreetBond colour system — single source of truth for the site.
 *
 * Sourced from COLOUR-MANIFEST.csv (catalogue §4 colour spread, v58).
 * 51 colourants: 17 Traditional + 20 Signature + 11 Solar-Reflective + 3 Cycle-Lane.
 *
 * Hexes are sRGB screen references sampled from the supplier chart — print/spec
 * work must use supplier CMYK formulas, never these values (see catalogue notes).
 * SR data: sri = Solar Reflectance Index, r = reflectance, e = emittance.
 */

export interface Colourant {
  name: string;
  hex: string;
  /** Solar Reflectance Index — SR family only */
  sri?: number;
  /** Reflectance — SR family only */
  r?: number;
  /** Emittance — SR family only */
  e?: number;
  /** Near-white chips get a hairline keyline so they don't vanish on light UI */
  keyline?: boolean;
}

export interface ColourFamily {
  key: "traditional" | "signature" | "solar-reflective" | "cycle-lane";
  name: string;
  blurb: string;
  colours: Colourant[];
}

export const COLOUR_FAMILIES: ColourFamily[] = [
  {
    key: "traditional",
    name: "Traditional",
    blurb: "Earth-anchored standards — the palette municipalities have specified for two decades.",
    colours: [
      { name: "San Diego Buff", hex: "#8d7b69" },
      { name: "Taupe", hex: "#b18d73" },
      { name: "Burnt Sienna", hex: "#392d29" },
      { name: "Nutmeg", hex: "#d87941" },
      { name: "Terra Cotta", hex: "#89401d" },
      { name: "Bedrock", hex: "#6d4c3a" },
      { name: "Brick", hex: "#6a381f" },
      { name: "Brown Suede", hex: "#976445" },
      { name: "Sunset Blush", hex: "#ac6d5b" },
      { name: "Concrete Gray", hex: "#9e8e6a" },
      { name: "Marigold", hex: "#f1ac0e" },
      { name: "Pewter", hex: "#c0bdb8" },
      { name: "Sierra", hex: "#564332" },
      { name: "Hunter Green", hex: "#213430" },
      { name: "Black", hex: "#312b27" },
      { name: "Slate", hex: "#3e322c" },
      { name: "Granite", hex: "#39312e" },
    ],
  },
  {
    key: "signature",
    name: "Signature",
    blurb: "The expressive range — accent and identity colours for placemaking work.",
    colours: [
      { name: "Sandy Beige", hex: "#b9966b" },
      { name: "Driftwood", hex: "#c2b7a5" },
      { name: "Butterscotch", hex: "#da8453" },
      { name: "Pumpkin Spice", hex: "#df743d" },
      { name: "Chestnut Brown", hex: "#bd5e37" },
      { name: "Mocha", hex: "#9a6a41" },
      { name: "Mustard", hex: "#d0822b" },
      { name: "Down To Earth", hex: "#987650" },
      { name: "Paprika", hex: "#c5442a" },
      { name: "Avocado", hex: "#90893e" },
      { name: "Sea Foam", hex: "#8ea79a" },
      { name: "Aqua", hex: "#8e9284" },
      { name: "Sage", hex: "#c2b7a5" },
      { name: "Truffle", hex: "#ab926a" },
      { name: "Patriot Blue", hex: "#3f4a5c" },
      { name: "Cobalt Blue", hex: "#4b4b51" },
      { name: "Gun Metal", hex: "#9fa1a1" },
      { name: "Merlot", hex: "#563538" },
      { name: "Smokey Mauve", hex: "#88757d" },
      { name: "Graphite", hex: "#6e685c" },
    ],
  },
  {
    key: "solar-reflective",
    name: "Solar-Reflective",
    blurb: "Engineered to reject solar heat — SRI-rated colourants that qualify for LEED Heat Island Reduction credits.",
    colours: [
      { name: "SR Sandstone", hex: "#cdc4b4", sri: 36, r: 0.32, e: 0.94 },
      { name: "SR Khaki", hex: "#d8c1a1", sri: 37, r: 0.33, e: 0.94 },
      { name: "SR Irish Cream", hex: "#ebd3b9", sri: 50, r: 0.43, e: 0.94 },
      { name: "SR White", hex: "#f9f6ec", sri: 73, r: 0.6, e: 0.94, keyline: true },
      { name: "SR Fawn", hex: "#d9a77f", sri: 35, r: 0.31, e: 0.93 },
      { name: "SR Sun Baked Clay", hex: "#fcab6d", sri: 52, r: 0.44, e: 0.95 },
      { name: "SR Brownstone", hex: "#894a31", sri: 31, r: 0.3, e: 0.9 },
      { name: "SR Terra Cotta", hex: "#964b28", sri: 33, r: 0.31, e: 0.92 },
      { name: "SR Evergreen", hex: "#5a5a38", sri: 33, r: 0.32, e: 0.88 },
      { name: "SR Safety Blue", hex: "#2673d3", sri: 33, r: 0.3, e: 0.93 },
      { name: "SR Slate", hex: "#3d312b", sri: 34, r: 0.31, e: 0.91 },
    ],
  },
  {
    key: "cycle-lane",
    name: "Cycle Lane",
    blurb: "High-visibility greens for dedicated cycling infrastructure.",
    colours: [
      { name: "CL Shamrock Green", hex: "#78c83c" },
      { name: "CL Celtic Green", hex: "#329c3d" },
      { name: "CL Emerald Green", hex: "#067c50" },
    ],
  },
];

export const COLOUR_COUNTS = {
  standard: 37, // 17 Traditional + 20 Signature
  solarReflective: 11,
  cycleLane: 3,
  total: 51,
};

export function familiesFor(slug: string): ColourFamily[] {
  if (slug === "streetbondsr")
    return COLOUR_FAMILIES.filter((f) => f.key === "solar-reflective" || f.key === "cycle-lane");
  if (slug === "streetbond")
    return COLOUR_FAMILIES.filter((f) => f.key === "traditional" || f.key === "signature");
  return [];
}
