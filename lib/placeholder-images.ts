/**
 * Placeholder Image Library — HUBSS Website
 *
 * Curated Unsplash photos mapped to every image slot on the site.
 * To replace with real photos: swap the URL at the matching key.
 * All URLs use w=1200 for heroes, w=800 for galleries/cards.
 */

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

// ─── Shared pool (thematic clusters) ────────────────────────────────────────

const CROSS  = U("1558618666-fcd25c85cd64");        // aerial crosswalk markings
const CITY   = U("1449824913935-59a10b8d2000");      // city street / intersection
const URBAN  = U("1477959858617-67f85cf4f1df");      // modern city / skyline
const STREET = U("1573348722427-f1d6819fdf98");      // street-level urban
const TRANSIT = U("1515162816999-a0c47dc192f7");     // transit / bus infrastructure
const ROAD   = U("1486325212980-2af6a2b98b1f");      // asphalt / road surface
const ART    = U("1541961017774-22349e4a1262");      // colorful street / public art
const PATH   = U("1441974231531-c6227db76b6e");      // park path / greenway
const PARK   = U("1590674899484-d5640e854abe");      // parking / open pavement
const RUNWAY = U("1436491865332-7a61a109cc05");      // airfield / runway

// gallery-size versions (800px)
const g = (id: string) => U(id, 800);
const CROSS_G  = g("1558618666-fcd25c85cd64");
const CITY_G   = g("1449824913935-59a10b8d2000");
const URBAN_G  = g("1477959858617-67f85cf4f1df");
const STREET_G = g("1573348722427-f1d6819fdf98");
const TRANSIT_G = g("1515162816999-a0c47dc192f7");
const ROAD_G   = g("1486325212980-2af6a2b98b1f");
const ART_G    = g("1541961017774-22349e4a1262");
const PATH_G   = g("1441974231531-c6227db76b6e");
const PARK_G   = g("1590674899484-d5640e854abe");
const RUNWAY_G = g("1436491865332-7a61a109cc05");

// ─── Export ──────────────────────────────────────────────────────────────────

export const placeholderImages = {

  // ── Homepage hero ──────────────────────────────────────────────────────────
  hero: {
    main: U("1558618666-fcd25c85cd64", 1920),   // aerial coloured crosswalk
  },

  // ── Products ───────────────────────────────────────────────────────────────
  products: {
    "traffic-patterns": {
      hero: CROSS,
      gallery: [CROSS_G, CITY_G, ROAD_G, URBAN_G, STREET_G, TRANSIT_G],
    },
    "traffic-patterns-xd": {
      hero: CITY,
      gallery: [CITY_G, CROSS_G, ROAD_G, URBAN_G, STREET_G, TRANSIT_G],
    },
    "streetprint": {
      hero: URBAN,
      gallery: [URBAN_G, ART_G, STREET_G, CROSS_G, CITY_G, ROAD_G],
    },
    "streetbond": {
      hero: STREET,
      gallery: [STREET_G, ART_G, TRANSIT_G, URBAN_G, CROSS_G, ROAD_G],
    },
    "mmax": {
      hero: TRANSIT,
      gallery: [TRANSIT_G, CITY_G, ROAD_G, STREET_G, CROSS_G, URBAN_G],
    },
    "decomark": {
      hero: ART,
      gallery: [ART_G, STREET_G, URBAN_G, CROSS_G, CITY_G, ROAD_G],
    },
    "durashield": {
      hero: ROAD,
      gallery: [ROAD_G, PARK_G, CITY_G, URBAN_G, STREET_G, CROSS_G],
    },
    "premark": {
      hero: CITY,
      gallery: [CITY_G, CROSS_G, ROAD_G, TRANSIT_G, STREET_G, URBAN_G],
    },
    "duratherm": {
      hero: CROSS,
      gallery: [CROSS_G, ROAD_G, CITY_G, URBAN_G, TRANSIT_G, STREET_G],
    },
    "airmark": {
      hero: RUNWAY,
      gallery: [RUNWAY_G, ROAD_G, CITY_G, URBAN_G, CROSS_G, STREET_G],
    },
  },

  // ── Applications ───────────────────────────────────────────────────────────
  applications: {
    "crosswalks": {
      hero: CROSS,
      gallery: [CROSS_G, CITY_G, ROAD_G, URBAN_G],
    },
    "bus-bike-lanes": {
      hero: TRANSIT,
      gallery: [TRANSIT_G, CITY_G, STREET_G, ROAD_G],
    },
    "driveways": {
      hero: URBAN,
      gallery: [URBAN_G, STREET_G, ART_G, ROAD_G],
    },
    "public-art": {
      hero: ART,
      gallery: [ART_G, STREET_G, URBAN_G, CROSS_G],
    },
    "regulatory-markings": {
      hero: CITY,
      gallery: [CITY_G, CROSS_G, ROAD_G, TRANSIT_G],
    },
    "parks-paths": {
      hero: PATH,
      gallery: [PATH_G, URBAN_G, STREET_G, ROAD_G],
    },
    "community-branding": {
      hero: STREET,
      gallery: [STREET_G, ART_G, URBAN_G, CROSS_G],
    },
    "parking-lots": {
      hero: PARK,
      gallery: [PARK_G, ROAD_G, CITY_G, URBAN_G],
    },
    "airports": {
      hero: RUNWAY,
      gallery: [RUNWAY_G, ROAD_G, CITY_G, URBAN_G],
    },
  },

  // ── Projects ───────────────────────────────────────────────────────────────
  projects: {
    "keeping-pedestrians-safe":          CROSS,
    "pedestrian-safety-high-visibility": CITY,
    "vancouver-crosswalk-design-2025":   URBAN,
    "york-region-hwy7-viva":             TRANSIT,
    "toronto-priority-bus-lanes":        ROAD,
    "london-east-link-brt":              STREET,
    "kitchener-veterans-memorial":       ART,
    "ubc-musqueam-crosswalk":            PATH,
    "vancouver-more-awesome-laneway":    ART,
  },

  // ── About page ─────────────────────────────────────────────────────────────
  about: {
    hero:   URBAN,
    team:   STREET,
    office: CITY,
  },

  // ── Blog ───────────────────────────────────────────────────────────────────
  blog: {
    default:                            CROSS,
    "stamped-asphalt-vs-concrete":      URBAN,
    "vision-zero-surface-markings":     CITY,
    "decorative-crosswalks-community-identity": ART,
  },

  // ── Lunch & Learn ──────────────────────────────────────────────────────────
  lunchLearn: {
    hero:    STREET,
    session: URBAN,
  },
} as const;

export type PlaceholderImages = typeof placeholderImages;
