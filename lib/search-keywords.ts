/**
 * Curated search synonyms — the words real people type, mapped to what
 * the site calls things. Extend freely; every term is matched
 * case-insensitively as a token substring by the Nav search overlay.
 */

export const PRODUCT_KEYWORDS: Record<string, string[]> = {
  streetprint: ["stamped asphalt", "decorative asphalt", "brick pattern", "cobblestone", "herringbone", "imprinted asphalt", "stamping", "template", "pattern", "paver look", "driveway"],
  streetbond: ["coating", "coloured pavement", "colored pavement", "acrylic", "colour card", "color card", "pantone", "ema", "paint", "surface colour", "plaza"],
  streetbondsr: ["solar reflective", "sri", "leed", "heat island", "cool pavement", "reflectance"],
  "traffic-patterns": ["thermoplastic", "preformed", "crosswalk marking", "heat applied", "125 mil", "road marking"],
  "traffic-patterns-xd": ["thermoplastic", "xd", "aggregate", "anti-skid", "high traffic", "transit lane", "brt", "150 mil"],
  decomark: ["custom graphic", "logo", "mural", "wayfinding", "ground art", "school", "playground marking"],
  mmax: ["mma", "methacrylate", "bus lane", "red lane", "bike lane green", "cold weather", "fast cure"],
  durashield: ["sealer", "overcoat", "protect", "rejuvenat", "asphalt life", "grey coat"],
  duratherm: ["inlaid", "flush", "milled", "zero profile", "plow safe thermoplastic"],
  premark: ["symbols", "legends", "arrows", "bike symbol", "drop-in", "pre-cut"],
  airmark: ["airport", "airfield", "taxiway", "apron", "aviation", "non-runway"],
  chipfill: ["pothole", "cold mix", "asphalt repair", "patch"],
  aggrefill: ["pothole", "aggregate fill", "repair", "patch"],
  "fast-patch": ["pothole", "dpr", "rapid repair", "patch"],
};

export const APPLICATION_KEYWORDS: Record<string, string[]> = {
  crosswalks: ["rainbow", "pride", "zebra", "pedestrian crossing", "intersection", "school crossing", "decorative crosswalk"],
  "pedestrian-safety": ["vision zero", "school zone", "safety", "retroreflective"],
  "bike-lanes": ["cycling", "cycle track", "green lane", "bicycle"],
  "bus-lanes": ["transit", "brt", "red lane", "priority lane"],
  "traffic-calming": ["speed", "gateway", "raised intersection", "neighbourhood"],
  "parks-paths": ["trail", "pathway", "park", "promenade", "boardwalk"],
  "public-spaces": ["plaza", "square", "patio", "pedestrian mall"],
  "community-branding": ["placemaking", "identity", "banner", "gateway", "heritage"],
  "public-art": ["mural", "indigenous", "cultural", "labyrinth", "artist"],
  "private-driveways": ["driveway", "residential", "home", "curb appeal"],
  "residential-driveways": ["driveway", "residential", "home"],
  townhomes: ["strata", "development", "entry court", "condo"],
  "parking-lots": ["parking", "lot", "stalls", "commercial"],
  "commercial-spaces": ["retail", "storefront", "entrance", "business"],
  playgrounds: ["school", "games", "hopscotch", "kids"],
  "sport-courts": ["basketball", "tennis", "pickleball", "court"],
  "splash-pads": ["water park", "spray pad", "aquatic"],
  airports: ["airfield", "taxiway", "apron", "aviation"],
  "regulatory-markings": ["stop bar", "arrows", "lines", "mutcd", "compliance"],
  "leed-urban-heat-island": ["leed", "heat island", "sri", "cool surface", "sustainability"],
};

/** Words that should always lead somewhere useful even with zero matches elsewhere. */
export const FALLBACK_SUGGESTIONS = [
  { label: "StreetPrint patterns", href: "/products/streetprint", terms: ["pattern", "template", "stamp", "herringbone", "cobble", "ashlar", "brick"] },
  { label: "Colour systems", href: "/products/streetbond#colours", terms: ["colour", "color", "palette", "swatch", "pantone", "pms"] },
  { label: "Resource library", href: "/resources", terms: ["pdf", "spec", "tds", "sds", "data sheet", "download"] },
  { label: "Book a Lunch & Learn", href: "/lunch-learn", terms: ["lunch", "learn", "presentation", "ce credit", "training", "seminar"] },
];
