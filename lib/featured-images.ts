export interface ImageConfig {
  featured: string | null;
  fallback: string;
  alt: string;
}

export function resolveImage(config: ImageConfig): { src: string; alt: string } {
  return { src: config.featured ?? config.fallback, alt: config.alt };
}

export const heroImages = {
  homepage: { featured: null, fallback: '/images/hero/hero-1.jpg', alt: 'Decorative crosswalk — HUB Surface Systems' } as ImageConfig,
  about: { featured: null, fallback: '/images/hero/hero-2.jpg', alt: 'HUBSS team — 30 years of civic surface design' } as ImageConfig,
};

export const productImages: Record<string, ImageConfig> = {
  'traffic-patterns': { featured: '/images/products/trafficpatterns/hero.jpg', fallback: '/images/products/trafficpatterns/trafficpatterns-1.jpg', alt: 'TrafficPatterns preformed thermoplastic crosswalk marking, Canadian municipality installation' },
  'traffic-patterns-xd': { featured: '/images/products/trafficpatterns-xd/hero.jpg', fallback: '/images/products/trafficpatterns-xd/trafficpatterns-xd-1.jpg', alt: 'TrafficPatternsXD high-durability aggregate-reinforced thermoplastic intersection marking' },
  streetprint: { featured: '/images/products/streetprint/hero.jpg', fallback: '/images/products/streetprint/streetprint-1.jpg', alt: 'StreetPrint stamped asphalt decorative pavement — brick pattern crosswalk' },
  streetbond: { featured: '/images/products/streetbond/hero.jpg', fallback: '/images/products/streetbond/streetbond-1.jpg', alt: 'StreetBond coloured acrylic pavement coating — bike lane and crosswalk application' },
  mmax: { featured: '/images/products/mmax/hero.jpg', fallback: '/images/products/mmax/mmax-1.jpg', alt: 'MMAX MMA methyl methacrylate fast-cure coloured bike and bus lane surface system' },
  decomark: { featured: '/images/products/decomark/hero.jpg', fallback: '/images/products/decomark/decomark-1.jpg', alt: 'DecoMark custom preformed thermoplastic surface graphics — community art installation' },
  duratherm: { featured: '/images/products/duratherm/hero.jpg', fallback: '/images/products/duratherm/duratherm-1.jpg', alt: 'DuraTherm inlaid flush-mount thermoplastic — snowplow-safe decorative crosswalk' },
  premark: { featured: '/images/products/premark/hero.jpg', fallback: '/images/products/premark/premark-2.jpg', alt: 'PreMark preformed thermoplastic road marking symbols — turn arrows and regulatory markings' },
  airmark: { featured: '/images/products/airmark/hero.jpg', fallback: '/images/products/airmark/airmark-1.jpg', alt: 'AirMark FAA-compliant airfield thermoplastic markings — runway threshold and taxiway' },
  durashield: { featured: '/images/products/durashield/hero.jpg', fallback: '/images/products/durashield/durashield-1.jpg', alt: 'DuraShield penetrating asphalt rejuvenator and protective seal coat application' },
};

export const applicationImages: Record<string, ImageConfig> = {
  crosswalks: { featured: null, fallback: '/images/applications/crosswalks/crosswalk-1.jpg', alt: 'High-visibility decorative crosswalk — HUBSS TrafficPatternsXD pedestrian safety installation' },
  'bike-lanes': { featured: null, fallback: '/images/applications/bike-lanes/bike-lanes-1.jpg', alt: 'Protected green bike lane surface — Complete Streets coloured pavement system' },
  'bus-lanes': { featured: null, fallback: '/images/applications/bus-lanes/bus-lanes-1.jpg', alt: 'Red bus rapid transit lane surface — MMAX MMA coloured pavement, Canadian municipality' },
  'commercial-spaces': { featured: null, fallback: '/images/applications/commercial-spaces/commercial-spaces-1.jpg', alt: 'Commercial space decorative pavement — stamped asphalt retail entry and plaza' },
  'community-branding': { featured: null, fallback: '/images/applications/community-branding/community-branding-1.jpg', alt: 'Community identity surface branding — custom civic graphics and placemaking pavement art' },
  'parking-lots': { featured: null, fallback: '/images/applications/parking-lots/apartment-complex-yellow-streetprint-aerial-01.jpg', alt: 'Parking lot decorative surface system — PreMark stall markings and DuraShield coating' },
  'parks-paths': { featured: '/images/applications/parks-paths/hero.jpg', fallback: '/images/applications/parks-paths/eagle-mural-courtyard-aerial-01.jpg', alt: 'Park pathway StreetBond coloured surface treatment — recreational trail marking' },
  'playgrounds': { featured: '/images/applications/playgrounds/hero.jpg', fallback: '/images/applications/playgrounds/playgrounds-1.jpg', alt: 'Playground surface markings — DecoMark custom thermoplastic graphics for school play area' },
  'private-driveways': { featured: null, fallback: '/images/applications/private-driveways/chilliwack-townhomes-brick-driveway-01.jpg', alt: 'Private driveway stamped asphalt — StreetPrint decorative brick pattern residential installation' },
  'residential-driveways': { featured: null, fallback: '/images/applications/private-driveways/estate-herringbone-gated-driveway-01.jpg', alt: 'Residential driveway stamped asphalt — StreetPrint decorative brick pattern installation' },
  'regulatory-markings': { featured: '/images/applications/regulatory-markings/hero.jpg', fallback: '/images/applications/regulatory-markings/premark-arrows-intersection-01.jpg', alt: 'Regulatory road markings — PreMark TAC-compliant thermoplastic arrows and stop bars' },
  'splash-pads': { featured: '/images/applications/splash-pads/hero.jpg', fallback: '/images/applications/splash-pads/splash-pads-1.jpg', alt: 'Splash pad coloured surface system — StreetBond slip-resistant water play area coating' },
  'townhomes': { featured: '/images/applications/townhomes/hero.jpg', fallback: '/images/applications/townhomes/townhomes-1.jpg', alt: 'Townhome shared driveway — StreetPrint decorative stamped asphalt common area surface' },
  'traffic-calming': { featured: '/images/applications/traffic-calming/hero.jpg', fallback: '/images/applications/traffic-calming/curved-red-brick-shared-path-01.jpg', alt: 'Traffic calming surface treatment — decorative asphalt shared street and roundabout' },
  airports: { featured: null, fallback: '/images/applications/airports/aircraft-stop-symbol-apron-01.jpg', alt: 'Airport airfield surface marking — AirMark FAA-compliant runway and taxiway thermoplastic' },
  'leed-urban-heat-island': { featured: '/images/applications/leed-urban-heat-island/hero.jpg', fallback: '/images/applications/leed-urban-heat-island/leed-1.jpg', alt: 'LEED solar reflective surface coating — StreetBond SR urban heat island reduction' },
  'pedestrian-safety': { featured: '/images/applications/pedestrian-safety/hero.jpg', fallback: '/images/applications/crosswalks/crosswalk-1.jpg', alt: 'Pedestrian safety surface markings — decorative crosswalk and high-visibility pavement treatments' },
  'public-art': { featured: null, fallback: '/images/applications/public-art/public-art-1.jpg', alt: 'Public art pavement installation — DecoMark custom thermoplastic civic mural' },
  'public-spaces': { featured: null, fallback: '/images/applications/public-spaces/red-brick-waterfront-promenade-01.jpg', alt: 'Public plaza decorative surface — StreetPrint stamped asphalt waterfront promenade' },
};