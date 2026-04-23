/**
 * Placeholder Image Library — HUBSS Website
 *
 * Local image paths mapped to every image slot on the site.
 * To swap images: replace the file in /public/images/ — no code change needed.
 * All paths resolve to /public/images/ at build time.
 */

// ─── Shared thematic aliases ─────────────────────────────────────────────────

const CROSS   = "/images/applications/crosswalks/crosswalks-01.jpg";
const CITY    = "/images/products/streetbond/streetbond-01.png";
const URBAN   = "/images/products/streetprint/streetprint-01.jpg";
const STREET  = "/images/applications/community-branding/community-branding-01.jpg";
const TRANSIT = "/images/applications/bus-lanes/bus-lanes-01.jpg";
const ROAD    = "/images/products/durashield/durashield-01.jpg";
const ART     = "/images/applications/public-spaces/public-spaces-01.jpg";
const PATH    = "/images/applications/parks-paths/parks-paths-01.jpg";
const PARK    = "/images/applications/parking-lots/parking-lots-01.jpg";
const RUNWAY  = "/images/applications/airports/airports-01.jpg";

// gallery-size versions (same local file — Next.js Image handles resizing)
const CROSS_G   = CROSS;
const CITY_G    = CITY;
const URBAN_G   = URBAN;
const STREET_G  = STREET;
const TRANSIT_G = TRANSIT;
const ROAD_G    = ROAD;
const ART_G     = ART;
const PATH_G    = PATH;
const PARK_G    = PARK;
const RUNWAY_G  = RUNWAY;

// ─── Export ──────────────────────────────────────────────────────────────────

export const placeholderImages = {

  // ── Homepage hero ──────────────────────────────────────────────────────────
  hero: {
    main: "/images/hero/hero-bg.jpg",
  },

  // ── Products ───────────────────────────────────────────────────────────────
  products: {
    "traffic-patterns": {
      hero: "/images/products/traffic-patterns/traffic-patterns-01.jpg",
      gallery: [CROSS_G, CITY_G, ROAD_G, URBAN_G, STREET_G, TRANSIT_G],
    },
    "traffic-patterns-xd": {
      hero: "/images/products/traffic-patterns-xd/traffic-patterns-xd-01.jpg",
      gallery: [CITY_G, CROSS_G, ROAD_G, URBAN_G, STREET_G, TRANSIT_G],
    },
    "streetprint": {
      hero: "/images/products/streetprint/streetprint-01.jpg",
      gallery: [URBAN_G, ART_G, STREET_G, CROSS_G, CITY_G, ROAD_G],
    },
    "streetbond": {
      hero: "/images/products/streetbond/streetbond-01.png",
      gallery: [STREET_G, ART_G, TRANSIT_G, URBAN_G, CROSS_G, ROAD_G],
    },
    "mmax": {
      hero: "/images/products/mmax/mmax-01.jpg",
      gallery: [TRANSIT_G, CITY_G, ROAD_G, STREET_G, CROSS_G, URBAN_G],
    },
    "decomark": {
      hero: "/images/products/decomark/decomark-01.jpg",
      gallery: [ART_G, STREET_G, URBAN_G, CROSS_G, CITY_G, ROAD_G],
    },
    "durashield": {
      hero: "/images/products/durashield/durashield-01.jpg",
      gallery: [ROAD_G, PARK_G, CITY_G, URBAN_G, STREET_G, CROSS_G],
    },
    "premark": {
      hero: "/images/products/premark/premark-01.jpg",
      gallery: [CITY_G, CROSS_G, ROAD_G, TRANSIT_G, STREET_G, URBAN_G],
    },
    "duratherm": {
      hero: "/images/products/duratherm/duratherm-01.jpg",
      gallery: [CROSS_G, ROAD_G, CITY_G, URBAN_G, TRANSIT_G, STREET_G],
    },
    "airmark": {
      hero: "/images/products/airmark/airmark-01.jpg",
      gallery: [RUNWAY_G, ROAD_G, CITY_G, URBAN_G, CROSS_G, STREET_G],
    },
  },

  // ── Applications ───────────────────────────────────────────────────────────
  applications: {
    "crosswalks": {
      hero: "/images/applications/crosswalks/crosswalks-03.jpg",
      gallery: [CROSS_G, CITY_G, ROAD_G, URBAN_G],
    },
    "bike-lanes": {
      hero: "/images/applications/bike-lanes/bike-lanes-01.jpg",
      gallery: [TRANSIT_G, CITY_G, STREET_G, ROAD_G],
    },
    "bus-lanes": {
      hero: "/images/applications/bus-lanes/bus-lanes-01.jpg",
      gallery: [TRANSIT_G, CITY_G, STREET_G, ROAD_G],
    },
    "private-driveways": {
      hero: "/images/applications/residential-driveways/residential-driveways-01.jpg",
      gallery: [URBAN_G, STREET_G, ART_G, ROAD_G],
    },
    "residential-driveways": {
      hero: "/images/applications/residential-driveways/residential-driveways-01.jpg",
      gallery: [URBAN_G, STREET_G, ART_G, ROAD_G],
    },
    "public-spaces": {
      hero: "/images/applications/public-spaces/public-spaces-01.jpg",
      gallery: [ART_G, STREET_G, URBAN_G, CROSS_G],
    },
    "regulatory-markings": {
      hero: "/images/applications/crosswalks/crosswalks-01.jpg",
      gallery: [CITY_G, CROSS_G, ROAD_G, TRANSIT_G],
    },
    "parks-paths": {
      hero: "/images/applications/parks-paths/parks-paths-01.jpg",
      gallery: [PATH_G, URBAN_G, STREET_G, ROAD_G],
    },
    "community-branding": {
      hero: "/images/applications/community-branding/community-branding-01.jpg",
      gallery: [STREET_G, ART_G, URBAN_G, CROSS_G],
    },
    "parking-lots": {
      hero: "/images/applications/parking-lots/parking-lots-01.jpg",
      gallery: [PARK_G, ROAD_G, CITY_G, URBAN_G],
    },
    "airports": {
      hero: "/images/applications/airports/airports-01.jpg",
      gallery: [RUNWAY_G, ROAD_G, CITY_G, URBAN_G],
    },
    "traffic-calming": {
      hero: "/images/applications/traffic-calming/traffic-calming-03.jpg",
      gallery: [ROAD_G, CROSS_G, CITY_G, STREET_G],
    },
    "commercial-spaces": {
      hero: "/images/applications/commercial-spaces/commercial-spaces-01.jpg",
      gallery: [STREET_G, URBAN_G, PARK_G, CITY_G],
    },
    "splash-pads": {
      hero: "/images/applications/splash-pads/splash-pads-01.jpg",
      gallery: [PATH_G, ART_G, URBAN_G, STREET_G],
    },
    "leed-urban-heat-island": {
      hero: "/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg",
      gallery: [PATH_G, STREET_G, URBAN_G, ROAD_G],
    },
    "playgrounds": {
      hero: "/images/applications/playgrounds/playgrounds-01.jpg",
      gallery: [ART_G, STREET_G, URBAN_G, CROSS_G],
    },
    "townhomes": {
      hero: "/images/applications/townhomes/townhomes-01.jpg",
      gallery: [URBAN_G, STREET_G, ART_G, ROAD_G],
    },
    "sport-courts": {
      hero: "/images/applications/sport-courts/sport-courts-01.jpg",
      gallery: [ART_G, STREET_G, URBAN_G, CROSS_G],
    },
  },

  // ── Projects ───────────────────────────────────────────────────────────────
  projects: {
    "keeping-pedestrians-safe":          "/images/applications/traffic-calming/traffic-calming-01.jpg",
    "pedestrian-safety-high-visibility": "/images/applications/public-spaces/public-spaces-01.jpg",
    "vancouver-crosswalk-design-2025":   "/images/applications/commercial-spaces/commercial-spaces-01.jpg",
  },
};