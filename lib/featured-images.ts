export interface ImageConfig {
  featured: string | null;
  fallback: string;
  alt: string;
}

export function resolveImage(config: ImageConfig): { src: string; alt: string } {
  return { src: config.featured ?? config.fallback, alt: config.alt };
}

export const heroImages = {
  homepage: { featured: '/images/hero/hero-1.jpg', fallback: '/images/hero/hero-2.jpg', alt: 'Decorative crosswalk — HUB Surface Systems' } as ImageConfig,
  about: { featured: '/images/hero/hero-3.jpg', fallback: '/images/hero/hero-bg.jpg', alt: 'HUBSS team — 30 years of civic surface design' } as ImageConfig,
};

export const productImages: Record<string, ImageConfig> = {
  'traffic-patterns':    { featured: '/images/products/traffic-patterns/traffic-patterns-01.jpg',       fallback: '/images/products/traffic-patterns/traffic-patterns-01.jpg',       alt: 'TrafficPatterns preformed thermoplastic crosswalk marking, Canadian municipality installation' },
  'traffic-patterns-xd': { featured: '/images/products/traffic-patterns-xd/traffic-patterns-xd-01.jpg', fallback: '/images/products/traffic-patterns-xd/traffic-patterns-xd-01.jpg', alt: 'TrafficPatternsXD high-durability aggregate-reinforced thermoplastic intersection marking' },
  'streetprint':         { featured: '/images/products/streetprint/streetprint-01.jpg',                 fallback: '/images/products/streetprint/streetprint-01.jpg',                 alt: 'StreetPrint stamped asphalt decorative pavement — brick pattern crosswalk' },
  'streetbond':          { featured: '/images/products/streetbond/streetbond-01.jpg',                   fallback: '/images/products/streetbond/streetbond-01.jpg',                   alt: 'StreetBond coloured acrylic pavement coating — bike lane and crosswalk application' },
  'mmax':                { featured: '/images/products/mmax/mmax-01.jpg',                               fallback: '/images/products/mmax/mmax-01.jpg',                               alt: 'MMAX MMA methyl methacrylate fast-cure coloured bike and bus lane surface system' },
  'decomark':            { featured: '/images/products/decomark/decomark-01.jpg',                       fallback: '/images/products/decomark/decomark-01.jpg',                       alt: 'DecoMark custom preformed thermoplastic surface graphics — community art installation' },
  'duratherm':           { featured: '/images/products/duratherm/duratherm-01.jpg',                     fallback: '/images/products/duratherm/duratherm-01.jpg',                     alt: 'DuraTherm inlaid flush-mount thermoplastic — snowplow-safe decorative crosswalk' },
  'premark':             { featured: '/images/products/premark/premark-01.jpg',                         fallback: '/images/products/premark/premark-01.jpg',                         alt: 'PreMark preformed thermoplastic road marking symbols — turn arrows and regulatory markings' },
  'airmark':             { featured: '/images/products/airmark/airmark-01.jpg',                         fallback: '/images/products/airmark/airmark-01.jpg',                         alt: 'AirMark FAA-compliant airfield thermoplastic markings — runway threshold and taxiway' },
  'durashield':          { featured: '/images/products/durashield/durashield-01.jpg',                   fallback: '/images/products/durashield/durashield-01.jpg',                   alt: 'DuraShield penetrating asphalt rejuvenator and protective seal coat application' },
};

export const applicationImages: Record<string, ImageConfig> = {
  'crosswalks':            { featured: '/images/applications/crosswalks/crosswalks-03.jpg',                       fallback: '/images/applications/crosswalks/crosswalks-01.jpg',                       alt: 'High-visibility decorative crosswalk — HUBSS TrafficPatternsXD pedestrian safety installation' },
  'bike-lanes':            { featured: '/images/applications/bike-lanes/bike-lanes-01.jpg',                       fallback: '/images/applications/bike-lanes/bike-lanes-01.jpg',                       alt: 'Protected green bike lane surface — Complete Streets coloured pavement system' },
  'bus-lanes':             { featured: '/images/applications/bus-lanes/bus-lanes-01.jpg',                         fallback: '/images/applications/bus-lanes/bus-lanes-01.jpg',                         alt: 'Red bus rapid transit lane surface — MMAX MMA coloured pavement, Canadian municipality' },
  'commercial-spaces':     { featured: '/images/applications/commercial-spaces/commercial-spaces-01.jpg',         fallback: '/images/applications/commercial-spaces/commercial-spaces-01.jpg',         alt: 'Commercial space decorative pavement — stamped asphalt retail entry and plaza' },
  'community-branding':    { featured: '/images/applications/community-branding/community-branding-01.jpg',       fallback: '/images/applications/community-branding/community-branding-01.jpg',       alt: 'Community identity surface branding — custom civic graphics and placemaking pavement art' },
  'parking-lots':          { featured: '/images/applications/parking-lots/parking-lots-01.jpg',                   fallback: '/images/applications/parking-lots/parking-lots-01.jpg',                   alt: 'Parking lot decorative surface system — PreMark stall markings and DuraShield coating' },
  'parks-paths':           { featured: '/images/applications/parks-paths/parks-paths-01.jpg',                     fallback: '/images/applications/parks-paths/parks-paths-01.jpg',                     alt: 'Park pathway StreetBond coloured surface treatment — recreational trail marking' },
  'playgrounds':           { featured: '/images/applications/playgrounds/playgrounds-01.jpg',                     fallback: '/images/applications/playgrounds/playgrounds-01.jpg',                     alt: 'Playground surface markings — DecoMark custom thermoplastic graphics for school play area' },
  'private-driveways':     { featured: '/images/applications/residential-driveways/residential-driveways-01.jpg', fallback: '/images/applications/residential-driveways/residential-driveways-01.jpg', alt: 'Private driveway stamped asphalt — StreetPrint decorative brick pattern residential installation' },
  'residential-driveways': { featured: '/images/applications/residential-driveways/residential-driveways-01.jpg', fallback: '/images/applications/residential-driveways/residential-driveways-01.jpg', alt: 'Residential driveway stamped asphalt — StreetPrint decorative brick pattern installation' },
  'regulatory-markings':   { featured: '/images/applications/crosswalks/crosswalks-01.jpg',                       fallback: '/images/applications/crosswalks/crosswalks-01.jpg',                       alt: 'Regulatory road markings — PreMark TAC-compliant thermoplastic arrows and stop bars' },
  'splash-pads':           { featured: '/images/applications/splash-pads/splash-pads-01.jpg',                     fallback: '/images/applications/splash-pads/splash-pads-01.jpg',                     alt: 'Splash pad coloured surface system — StreetBond slip-resistant water play area coating' },
  'sport-courts':          { featured: '/images/applications/sport-courts/sport-courts-01.jpg',                   fallback: '/images/applications/sport-courts/sport-courts-01.jpg',                   alt: 'Sport court surface system — StreetBond coloured acrylic court markings and branding' },
  'townhomes':             { featured: '/images/applications/townhomes/townhomes-01.jpg',                         fallback: '/images/applications/townhomes/townhomes-01.jpg',                         alt: 'Townhome shared driveway — StreetPrint decorative stamped asphalt common area surface' },
  'traffic-calming':       { featured: '/images/applications/traffic-calming/traffic-calming-03.jpg',             fallback: '/images/applications/traffic-calming/traffic-calming-01.jpg',             alt: 'Traffic calming surface treatment — decorative asphalt shared street and roundabout' },
  'airports':              { featured: '/images/applications/airports/airports-01.jpg',                           fallback: '/images/applications/airports/airports-01.jpg',                           alt: 'Airport airfield surface marking — AirMark FAA-compliant runway and taxiway thermoplastic' },
  'leed-urban-heat-island':{ featured: '/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg', fallback: '/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg', alt: 'LEED solar reflective surface coating — StreetBond SR urban heat island reduction' },
  'pedestrian-safety':     { featured: '/images/applications/crosswalks/crosswalks-01.jpg',                       fallback: '/images/applications/crosswalks/crosswalks-01.jpg',                       alt: 'Pedestrian safety surface markings — decorative crosswalk and high-visibility pavement treatments' },
  'public-art':            { featured: '/images/applications/community-branding/community-branding-01.jpg',       fallback: '/images/applications/community-branding/community-branding-01.jpg',       alt: 'Public art pavement installation — DecoMark custom thermoplastic civic mural' },
  'public-spaces':         { featured: '/images/applications/public-spaces/public-spaces-01.jpg',                 fallback: '/images/applications/public-spaces/public-spaces-01.jpg',                 alt: 'Public plaza decorative surface — StreetPrint stamped asphalt waterfront promenade' },
};
