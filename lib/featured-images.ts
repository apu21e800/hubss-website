export interface ImageConfig {
  featured: string | null;
  fallback: string;
  alt: string;
}

export function resolveImage(config: ImageConfig): { src: string; alt: string } {
  return { src: config.featured ?? config.fallback, alt: config.alt };
}

export const heroImages = {
  homepage: { featured: '/images/hero/hero-1.jpg', fallback: '/images/hero/hero-2.jpg', alt: 'Decorative stamped asphalt crosswalk installed by HUB Surface Systems for a Canadian municipality' } as ImageConfig,
  about: { featured: '/images/hero/hero-3.jpg', fallback: '/images/hero/hero-bg.jpg', alt: 'HUB Surface Systems team — 30 years of decorative and functional pavement solutions across Canada' } as ImageConfig,
};

export const productImages: Record<string, ImageConfig> = {
  'traffic-patterns': {
    featured: null,
    fallback: '/images/products/traffic-patterns/traffic-patterns-01.jpg',
    alt: 'TrafficPatterns preformed thermoplastic crosswalk marking installed at a Canadian urban intersection — high-visibility pedestrian safety surface',
  },
  'traffic-patterns-xd': {
    featured: null,
    fallback: '/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg',
    alt: 'TrafficPatternsXD aggregate-reinforced preformed thermoplastic crosswalk — premium durability decorative pavement marking for high-traffic Canadian intersections',
  },
  'streetprint': {
    featured: null,
    fallback: '/images/products/streetprint/streetprint-01.jpg',
    alt: 'StreetPrint stamped asphalt decorative pavement — brick cobblestone pattern crosswalk installed for a Canadian municipality streetscape',
  },
  'streetbond': {
    featured: null,
    fallback: '/images/products/streetbond/streetbond-01.png',
    alt: 'StreetBond coloured acrylic pavement coating — vibrant bike lane and pedestrian crossing surface treatment on Canadian urban road',
  },
  'mmax': {
    featured: null,
    fallback: '/images/products/mmax/mmax-01.jpg',
    alt: 'MMAX MMA methyl methacrylate rapid-cure coloured bus lane and bike lane pavement system — bold red and green Complete Streets surface marking',
  },
  'decomark': {
    featured: null,
    fallback: '/images/products/decomark/decomark-01.jpg',
    alt: 'DecoMark custom preformed thermoplastic surface graphics — placemaking civic art installation on Canadian public plaza pavement',
  },
  'duratherm': {
    featured: null,
    fallback: '/images/products/duratherm/duratherm-01.jpg',
    alt: 'DuraTherm inlaid flush-mount thermoplastic crosswalk — snowplow-safe decorative pavement marking embedded in asphalt surface',
  },
  'premark': {
    featured: null,
    fallback: '/images/products/premark/premark-01.jpg',
    alt: 'PreMark preformed thermoplastic road marking symbols — TAC-compliant turn arrows, stop bars, and regulatory pavement markings',
  },
  'airmark': {
    featured: null,
    fallback: '/images/products/airmark/airmark-01.jpg',
    alt: 'AirMark FAA-compliant preformed thermoplastic airfield markings — runway threshold, taxiway guidance, and apron surface markings',
  },
  'durashield': {
    featured: null,
    fallback: '/images/products/durashield/durashield-01.jpg',
    alt: 'DuraShield penetrating asphalt rejuvenator and protective seal coat — pavement life extension treatment for Canadian municipal road surfaces',
  },
};

export const applicationImages: Record<string, ImageConfig> = {
  'crosswalks': {
    featured: null,
    fallback: '/images/applications/crosswalks/crosswalks-01.jpg',
    alt: 'High-visibility decorative crosswalk with TrafficPatternsXD preformed thermoplastic — pedestrian safety surface for Vision Zero Canadian streetscape',
  },
  'bike-lanes': {
    featured: null,
    fallback: '/images/applications/bike-lanes/bike-lanes-01.jpg',
    alt: 'Protected coloured bike lane surface treatment — StreetBond Complete Streets cycling infrastructure for Canadian municipality',
  },
  'bus-lanes': {
    featured: null,
    fallback: '/images/applications/bus-lanes/bus-lanes-01.jpg',
    alt: 'Red bus rapid transit lane with MMAX MMA coloured pavement — high-durability BRT surface marking for Canadian transit corridor',
  },
  'commercial-spaces': {
    featured: null,
    fallback: '/images/applications/commercial-spaces/commercial-spaces-01.jpg',
    alt: 'Commercial plaza decorative pavement — StreetPrint stamped asphalt retail entry and pedestrian streetscape surface',
  },
  'community-branding': {
    featured: null,
    fallback: '/images/applications/community-branding/community-branding-01.jpg',
    alt: 'Community identity pavement branding — custom civic graphics and DecoMark placemaking thermoplastic art on Canadian public street',
  },
  'parking-lots': {
    featured: null,
    fallback: '/images/applications/parking-lots/parking-lots-01.jpg',
    alt: 'Parking lot decorative surface system — PreMark thermoplastic stall markings and DuraShield asphalt protective coating',
  },
  'parks-paths': {
    featured: null,
    fallback: '/images/applications/parks-paths/parks-paths-01.jpg',
    alt: 'Park pathway coloured surface treatment — StreetBond slip-resistant recreational trail marking for Canadian municipal greenway',
  },
  'playgrounds': {
    featured: null,
    fallback: '/images/applications/playgrounds/playgrounds-01.jpg',
    alt: 'School playground surface markings — DecoMark custom preformed thermoplastic graphics and activity zones for children',
  },
  'private-driveways': {
    featured: null,
    fallback: '/images/applications/private-driveways/private-driveways-01.jpg',
    alt: 'Private driveway stamped asphalt — StreetPrint decorative brick pattern residential surface for Canadian home',
  },
  'residential-driveways': {
    featured: '/images/applications/residential-driveways/residential-driveways-03.jpg',
    fallback: '/images/applications/residential-driveways/residential-driveways-03.jpg',
    alt: 'Residential stamped asphalt driveway — aerial view of StreetPrint circular cobblestone pattern installed at Canadian home with attached garage',
  },
  'regulatory-markings': {
    featured: null,
    fallback: '/images/applications/regulatory-markings/regulatory-markings-01.jpg',
    alt: 'Regulatory road markings — PreMark TAC-compliant preformed thermoplastic directional arrows, stop bars, and yield markings',
  },
  'splash-pads': {
    featured: null,
    fallback: '/images/applications/splash-pads/splash-pads-01.jpg',
    alt: 'Splash pad coloured surface system — StreetBond slip-resistant acrylic coating for water play area and recreational splash zone',
  },
  'sport-courts': {
    featured: null,
    fallback: '/images/applications/sport-courts/sport-courts-01.jpg',
    alt: 'Sport court coloured surface system — StreetBond acrylic court markings for basketball, tennis, and multi-sport facility',
  },
  'townhomes': {
    featured: null,
    fallback: '/images/applications/townhomes/townhomes-01.jpg',
    alt: 'Townhome shared driveway and courtyard — StreetPrint decorative stamped asphalt common area surface for residential development',
  },
  'traffic-calming': {
    featured: null,
    fallback: '/images/applications/traffic-calming/traffic-calming-01.jpg',
    alt: 'Traffic calming decorative pavement — coloured surface treatment for shared street, roundabout, and pedestrian priority zone',
  },
  'airports': {
    featured: null,
    fallback: '/images/applications/airports/airports-01.jpg',
    alt: 'Airport airfield surface markings — AirMark FAA Advisory Circular compliant thermoplastic runway, taxiway, and apron markings',
  },
  'leed-urban-heat-island': {
    featured: null,
    fallback: '/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg',
    alt: 'LEED-compliant solar reflective pavement coating — StreetBond SR urban heat island reduction surface treatment for Canadian urban environment',
  },
  'pedestrian-safety': {
    featured: null,
    fallback: '/images/applications/pedestrian-safety/pedestrian-safety-01.jpg',
    alt: 'Pedestrian safety decorative crosswalk — high-visibility thermoplastic pavement markings for Vision Zero Complete Streets design',
  },
  'public-art': {
    featured: null,
    fallback: '/images/applications/public-art/public-art-01.jpg',
    alt: 'Public art pavement installation — DecoMark custom preformed thermoplastic civic mural and placemaking street graphic',
  },
  'public-spaces': {
    featured: null,
    fallback: '/images/applications/public-spaces/public-spaces-01.jpg',
    alt: 'Public plaza decorative surface — StreetPrint stamped asphalt waterfront promenade and civic gathering space pavement',
  },
};
