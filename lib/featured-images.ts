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
  'traffic-patterns': { featured: null, fallback: '/images/products/trafficpatterns/trafficpatterns-1.jpg', alt: 'TrafficPatterns thermoplastic crosswalk marking' },
  'traffic-patterns-xd': { featured: null, fallback: '/images/products/trafficpatterns-xd/trafficpatterns-xd-1.jpg', alt: 'TrafficPatternsXD high-durability intersection marking' },
  streetprint: { featured: null, fallback: '/images/products/streetprint/streetprint-1.jpg', alt: 'StreetPrint stamped asphalt roundabout' },
  streetbond: { featured: null, fallback: '/images/products/streetbond/streetbond-1.jpg', alt: 'StreetBond coloured surface coating' },
  mmax: { featured: null, fallback: '/images/products/mmax/mmax-1.jpg', alt: 'MMAX MMA bike lane surface system' },
  decomark: { featured: null, fallback: '/images/products/decomark/decomark-1.jpg', alt: 'DecoMark custom surface graphics' },
  duratherm: { featured: null, fallback: '/images/products/duratherm/duratherm-1.jpg', alt: 'DuraTherm inset thermoplastic surface' },
  premark: { featured: null, fallback: '/images/products/premark/premark-2.jpg', alt: 'PreMark preformed thermoplastic marking' },
  airmark: { featured: null, fallback: '/images/products/airmark/airmark-1.jpg', alt: 'AirMark FAA-approved airfield marking' },
  durashield: { featured: null, fallback: '/images/products/durashield/durashield-1.jpg', alt: 'DuraShield protective surface coating' },
};

export const applicationImages: Record<string, ImageConfig> = {
  crosswalks: { featured: null, fallback: '/images/applications/crosswalks/crosswalk-1.jpg', alt: 'High-visibility crosswalk — pedestrian safety' },
  'bike-lanes': { featured: null, fallback: '/images/applications/bike-lanes/bike-lanes-1.jpg', alt: 'Protected bike lane — Complete Streets design' },
  'bus-lanes': { featured: null, fallback: '/images/applications/bus-lanes/bus-lanes-1.jpg', alt: 'Bus rapid transit lane surface' },
  'commercial-spaces': { featured: null, fallback: '/images/applications/commercial-spaces/commercial-spaces-1.jpg', alt: 'Commercial space surface system' },
  'community-branding': { featured: null, fallback: '/images/applications/community-branding/community-branding-1.jpg', alt: 'Community identity surface — custom logo and graphics' },
  'parking-lots': { featured: null, fallback: '/images/applications/parking-lots/parking-lots-1.jpg', alt: 'Parking lot surface system' },
  'parks-paths': { featured: null, fallback: '/images/applications/parks-paths/parks-paths-1.jpg', alt: 'Parks and pathways surface system' },
  'playgrounds': { featured: null, fallback: '/images/applications/playgrounds/playgrounds-1.jpg', alt: 'Playground surface markings' },
  'private-driveways': { featured: null, fallback: '/images/applications/private-driveways/private-driveways-1.png', alt: 'Private driveway surface design' },
  'regulatory-markings': { featured: null, fallback: '/images/applications/regulatory-markings/regulatory-markings-1.jpg', alt: 'Regulatory road markings' },
  'splash-pads': { featured: null, fallback: '/images/applications/splash-pads/splash-pads-1.jpg', alt: 'Splash pad surface system' },
  'townhomes': { featured: null, fallback: '/images/applications/townhomes/townhomes-1.jpg', alt: 'Townhome surface design' },
  'traffic-calming': { featured: null, fallback: '/images/applications/traffic-calming/traffic-calming-1.jpg', alt: 'Traffic calming surface treatment' },
  airports: { featured: null, fallback: '/images/applications/airports/airports-1.jpg', alt: 'Airfield surface marking — FAA approved' },
  'leed-urban-heat-island': { featured: null, fallback: '/images/applications/leed-urban-heat-island/leed-1.jpg', alt: 'LEED solar reflective surface coating' },
};

export const projectImages: Record<string, ImageConfig> = {
  default: { featured: null, fallback: '/images/hero/hero-3.jpg', alt: 'HUBSS project installation' },
};
