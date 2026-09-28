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
  about: { featured: '/images/hero/hero-3.jpg', fallback: '/images/hero/hero-bg.jpg', alt: 'HUB Surface Systems team: 27 years of decorative and functional pavement systems across Canada' } as ImageConfig,
};

// Hero photos, one per page (photo editor's pass, 28 Sep 2026, QA pa#3/9/15/16/17).
// Rules for a pick: that product or application, finished work, bright, sharp,
// landscape, at least 1600px wide, not another page's hero, no US scene, no
// identifiable child, no third-party copyright in the file. Each alt says what is
// in the frame, and names a product or a place only where the photo folders or
// lib/image-seo.ts establish it. How each hero is cropped: lib/hero-framing.ts.
export const productImages: Record<string, ImageConfig> = {
  // Was traffic-patterns-08 (UBC, 1192px, soft, heads cut off at 1440).
  'traffic-patterns':    { featured: '/images/products/traffic-patterns/traffic-patterns-87.jpg',       fallback: '/images/products/traffic-patterns/traffic-patterns-01.jpg',       alt: 'Veterans walk across a TrafficPatterns crosswalk of red bars, a maple leaf and a soldier silhouette above the words Lest We Forget, Kitchener, Ontario' },
  // Same photo as traffic-patterns-xd-03 (lib/products.ts imageUrl). Alt corrected: it is a walkway in snow, not a pier.
  'traffic-patterns-xd': { featured: '/images/applications/crosswalks/crosswalks-114.png', fallback: '/images/products/traffic-patterns-xd/traffic-patterns-xd-10.jpg', alt: 'TrafficPatternsXD red brick-pattern walkway after a light snowfall, with a steel shade shelter and new houses behind' },
  'streetprint':         { featured: '/images/products/streetprint/streetprint-86.jpg',                 fallback: '/images/products/streetprint/streetprint-01.jpg',                 alt: 'StreetPrint stamped asphalt estate driveway: dark cobblestone-pattern entry between brick gate pillars under autumn trees' },
  'streetbond':          { featured: '/images/products/streetbond/streetbond-19.jpg',                  fallback: '/images/products/streetbond/streetbond-20.jpg',                   alt: 'Red StreetBond coating on a harbourfront walkway with a cable railing and lamp posts, port cranes across the water' },
  'mmax':                { featured: '/images/products/mmax/mmax-04.jpg',                               fallback: '/images/products/mmax/mmax-01.jpg',                               alt: 'MMAX red bus-only lane: BUS ONLY legend on MMA methyl methacrylate coloured transit lane in London, Ontario' },
  // Kept (QA: good). decomark-56 is another shot of this medallion; the same file is also
  // traffic-patterns-22 and -62, so Doug should confirm which system it is.
  'decomark':            { featured: '/images/applications/parks-paths/parks-paths-70.jpg',                      fallback: '/images/products/decomark/decomark-01.jpg',                       alt: 'DecoMark preformed thermoplastic public art: circular Indigenous medallion artwork fused into a concrete plaza at a building entrance' },
  // The Idea Book photo (duratherm-01, a 1280px crop) at its full 3264px: traffic-calming-03 is the same frame.
  'duratherm':           { featured: '/images/applications/traffic-calming/traffic-calming-03.jpg',     fallback: '/images/products/duratherm/duratherm-01.jpg',                     alt: 'DuraTherm crosswalk inlaid flush in the asphalt, its yellow lines forming a random brick pattern, in front of a glass-fronted building' },
  // Was premark-01 (a worksite with cones and a dumpster). Nothing in the PreMark folder reaches
  // 1600px (the largest is 1334), so this is a same-subject photo from parks-paths; the alt does
  // not name the product because that folder doesn't establish it.
  'premark':             { featured: '/images/applications/parks-paths/parks-paths-17.jpg',            fallback: '/images/products/premark/premark-04.jpg',                         alt: 'White bicycle symbol on a shared path beside a blue walking lane marked with a white pedestrian symbol' },
  // Was airmark-01, which is also the Airports hero's photo (airports-08).
  'airmark':             { featured: '/images/products/airmark/airmark-04.jpg',                         fallback: '/images/products/airmark/airmark-01.jpg',                         alt: 'AirMark yellow holding-position lines and a red runway designation marking on an airfield, the control tower and a hangar behind' },
  // Was parking-lots-04 (a grey lot under a grey building). durashield-11 is the Idea Book photo.
  'durashield':          { featured: '/images/products/durashield/durashield-11.jpg',                   fallback: '/images/products/durashield/durashield-01.jpg',                   alt: 'Fresh DuraShield maintenance coating on a residential driveway running from the street to a carport, evergreen shrubs along one side' },
  // Was streetbond-03 (an empty grey field at 1440). streetbondsr-02 is the Idea Book photo.
  'streetbondsr':        { featured: '/images/products/streetbondsr/streetbondsr-02.jpg',               fallback: '/images/products/streetbondsr/streetbondsr-01.png',               alt: 'Peach-coloured StreetBondSR solar-reflective coating on a park path branching across a lawn, picnic shelters and a spray park behind' },
  // The repair family keeps its photos: nothing on disk qualifies. ChipFill and AggreFill have
  // nothing over 1400px and their larger shots carry supplier bags; Fast Patch's only other
  // photos are a supplier kit and a pack shot. fastpatch-repaired.jpg carries a third-party
  // copyright in its EXIF (lib/product-card-images.mjs refuses it) and needs replacing or a
  // photo-free hero. Listed here so each hero has an alt that describes the picture.
  'chipfill':            { featured: '/images/products/chipfill/chipfill-road-repair.webp',            fallback: '/images/products/chipfill/chipfill-road-repair.webp',            alt: 'A pothole in an asphalt street, parked cars blurred behind: the damage ChipFill repairs' },
  'aggrefill':           { featured: '/images/products/aggrefill/aggrefill-02.jpg',                     fallback: '/images/products/aggrefill/aggrefill-02.jpg',                     alt: 'AggreFill aggregate and white ChipFill granules in a pothole, a repair in progress' },
  'fast-patch':          { featured: '/images/products/fast-patch/fastpatch-repaired.jpg',              fallback: '/images/products/fast-patch/fastpatch-repaired.jpg',              alt: 'A finished Fast Patch DPR repair, a patch of fine grey aggregate set flush in the surrounding pavement' },
};

// Since 28 Sep 2026 an application's hero is `featured` here (the page and the Sanity plan read
// it; lib/applications.ts imageUrl is the fallback). Every application has an entry.
export const applicationImages: Record<string, ImageConfig> = {
  // Kept (QA: good). TrafficPatternsXD: the same file sits in that product's folder (traffic-patterns-xd-70).
  'crosswalks':            { featured: '/images/applications/crosswalks/crosswalks-09.jpg',                       fallback: '/images/applications/crosswalks/crosswalks-01.jpg',                       alt: 'TrafficPatternsXD crosswalk in alternating red and pale brick-pattern bands at a bus terminal, buses at the platforms behind' },
  // bike-lanes-01 kept over bike-lanes-14 (a 1536px portrait); the cyclist is framed in lib/hero-framing.ts.
  'bike-lanes':            { featured: '/images/applications/bike-lanes/bike-lanes-01.jpg',                       fallback: '/images/applications/bike-lanes/bike-lanes-11.jpg',                     alt: 'Green bike box with a white bicycle symbol and turn arrows at an intersection, a cyclist riding past' },
  // Was bus-lanes-01, an entrance drive with no bus, photographed in the US (EXIF GPS: Delaware).
  'bus-lanes':             { featured: '/images/applications/bus-lanes/bus-lanes-41.jpg',                         fallback: '/images/applications/bus-lanes/bus-lanes-15.jpg',                         alt: 'Blue articulated rapid-transit bus on a red bus-only lane at an intersection, beside a station platform' },
  // Was crosswalks-110 (parked cars, the crossing hidden under the headline).
  'commercial-spaces':     { featured: '/images/applications/commercial-spaces/commercial-spaces-75.jpg',         fallback: '/images/applications/commercial-spaces/commercial-spaces-01.jpg',         alt: 'Red brick-pattern crosswalk at the entrance to Toronto Premium Outlets, Halton Hills, Ontario' },
  // Was the White Rock and Langley blog photo (1200px, a cluttered storefront).
  'community-branding':    { featured: '/images/applications/community-branding/community-branding-17.jpg',       fallback: '/images/applications/community-branding/community-branding-05.jpg',       alt: 'Geary Works lettering and green gear graphics set into an asphalt path' },
  // Was parking-lots-01 (a dark EV stall).
  'parking-lots':          { featured: '/images/products/streetprint/streetprint-25.jpg',                         fallback: '/images/applications/parking-lots/parking-lots-01.jpg',                   alt: 'Red StreetPrint brick-pattern walkway edging a freshly lined parking lot' },
  // Was parks-paths-01 (1024px, soft).
  'parks-paths':           { featured: '/images/applications/parks-paths/parks-paths-09.jpg',                     fallback: '/images/applications/parks-paths/parks-paths-01.jpg',                     alt: 'Waterside multi-use path with white direction arrows and a curving centre line, bike racks and a paver edge in the foreground' },
  'playgrounds':           { featured: '/images/applications/playgrounds/playgrounds-01.jpg',                     fallback: '/images/applications/playgrounds/playgrounds-01.jpg',                     alt: 'Schoolyard coated with turquoise, orange and yellow play markings around a blue picnic table' },
  // Was residential-driveways-18, which stays the Residential Driveways hero.
  'private-driveways':     { featured: '/images/applications/residential-driveways/residential-driveways-21.jpg', fallback: '/images/applications/residential-driveways/residential-driveways-01.jpg', alt: 'Red brick-pattern stamped asphalt driveway curving to a double garage beside a white house' },
  'residential-driveways': { featured: '/images/applications/residential-driveways/residential-driveways-18.jpg', fallback: '/images/applications/residential-driveways/residential-driveways-03.jpg', alt: 'Residential stamped asphalt driveway: StreetPrint circular medallion entry between brick pillars at dusk, lit home behind' },
  // Was traffic-calming-01 (934px, coloured lanes with no regulatory marking, shared with Traffic Calming).
  'regulatory-markings':   { featured: '/images/applications/bike-lanes/bike-lanes-12.jpg',                       fallback: '/images/applications/crosswalks/crosswalks-01.jpg',                       alt: 'Red bus-only lane with ONLY BUS and diamond legends beside a green bike lane marked with a bicycle symbol and arrow' },
  'splash-pads':           { featured: '/images/applications/splash-pads/splash-pads-01.jpg',                     fallback: '/images/applications/splash-pads/splash-pads-01.jpg',                     alt: 'Splash pad surfaced in two shades of blue, with spray arches, boulders and yellow shade umbrellas' },
  'sport-courts':          { featured: '/images/products/streetbond/streetbond-67.png',                   fallback: '/images/applications/sport-courts/sport-courts-01.jpg',                   alt: 'Basketball court coated in pink, orange and yellow StreetBond with white game lines, trees and a street behind' },
  // Was townhomes-01 (960px). Same photo as streetprint-02.
  'townhomes':             { featured: '/images/applications/townhomes/townhomes-16.jpg',                         fallback: '/images/applications/townhomes/townhomes-01.jpg',                         alt: 'Grey StreetPrint herringbone roadway lined with black bollards in front of new brick townhomes' },
  // Was traffic-calming-01 (934px, shared with Regulatory Markings).
  'traffic-calming':       { featured: '/images/applications/traffic-calming/traffic-calming-58.jpg',             fallback: '/images/applications/traffic-calming/traffic-calming-01.jpg',             alt: 'Roundabout with a red brick-pattern stamped apron and chevron signs, forest behind, Maple Ridge, British Columbia' },
  // Was airports-01 (1200px, also AirMark's hero). airports-08 is the same frame at 2016px.
  'airports':              { featured: '/images/applications/airports/airports-08.jpg',                           fallback: '/images/applications/airports/airports-01.jpg',                           alt: 'Red octagon marking with white aircraft symbols on an airport apron, orange airside trucks and an Air Canada jet behind' },
  'leed-urban-heat-island':{ featured: '/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg', fallback: '/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg', alt: 'Red and white StreetBond stripes sweeping through a landscaped plaza, the Olympic Stadium tower behind' },
  // Was community-branding-02 here and community-branding-01 on the old hand-built page (a plain brick street).
  'public-art':            { featured: '/images/applications/public-art/public-art-01.jpg',                       fallback: '/images/applications/community-branding/community-branding-11.jpg',      alt: 'Pavement artwork of green roots and a blue water drop spreading across a street-corner plaza' },
  'pedestrian-safety':     { featured: '/images/applications/crosswalks/crosswalks-03.jpg',                       fallback: '/images/applications/crosswalks/crosswalks-01.jpg',                       alt: 'Red and white brick-pattern crosswalk and a green bike crossing at a signalized intersection, office towers behind' },
  // Had no entry. Kept (QA: good). The same file is in both the StreetPrint and StreetBond
  // folders (streetprint-51, streetbond-74), so the alt names neither.
  'public-spaces':         { featured: '/images/applications/commercial-spaces/commercial-spaces-55.jpg',         fallback: '/images/applications/commercial-spaces/commercial-spaces-55.jpg',         alt: 'Pale brick-pattern stamped asphalt promenade along a rocky shoreline, with planters, benches and a bird sculpture' },
};
