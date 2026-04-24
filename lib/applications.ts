export interface Application {
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  imageUrl: string;
  gallery?: string[];
  relatedProducts: string[];
}

function gallery(slug: string, dir: string, count: number, ext: string = "jpg"): string[] {
  return Array.from({ length: count }, (_, i) =>
    `/images/applications/${dir}/${slug}-${String(i + 1).padStart(2, "0")}.${ext}`
  );
}

export const applications: Application[] = [
  {
    name: "Crosswalks",
    slug: "crosswalks",
    shortDesc: "High-visibility decorative crosswalks that define intersections and calm traffic",
    imageUrl: "/images/applications/crosswalks/crosswalks-01.jpg",
    gallery: [1,3,6,8,11,13,16,18,21,23,26,28,31,33,36,38,41,43,45,48,50,53,55,58,60,63,65,68,70,73,75,78,80,83,85,87,90,92,95,97,100,102,105,107,110,112,115,117,120,122].map(n =>
      `/images/applications/crosswalks/crosswalks-${String(n).padStart(2,"0")}.jpg`),
    description: "Crosswalks are the most visible safety infrastructure in any municipality. HUB systems deliver durability, retroreflectivity, and design flexibility that paint cannot match. TrafficPatterns and TrafficPatternsXD survive snowplow cycles and de-icing chemicals. DecoMark and StreetBond unlock full artistic expression for Pride crosswalks, Indigenous art, and neighbourhood identity. Specified by municipalities coast to coast.",
    relatedProducts: ["traffic-patterns", "traffic-patterns-xd", "streetbond", "decomark", "duratherm", "premark"],
  },
  {
    name: "Bike Lanes",
    slug: "bike-lanes",
    shortDesc: "Durable coloured lane treatments for safe multimodal corridors",
    imageUrl: "/images/applications/bike-lanes/bike-lanes-01.jpg",
    gallery: gallery("bike-lanes", "bike-lanes", 38),
    description: "Bike lanes demand pavement systems that hold colour season after season. StreetBond delivers vivid, UV-stable colour on asphalt and concrete with full Pantone custom matching. MMAX MMA is specified for high-volume transit-adjacent corridors requiring overnight curing and bond strength above 3 MPa. PreMark delivers retroreflective symbols and edge lines that outlast paint 5:1.",
    relatedProducts: ["premark", "mmax"],
  },
  {
    name: "Bus Lanes",
    slug: "bus-lanes",
    shortDesc: "Durable coloured lane treatments for safe multimodal corridors",
    imageUrl: "/images/applications/bus-lanes/bus-lanes-01.jpg",
    gallery: gallery("bus-lanes", "bus-lanes", 40),
    description: "BRT corridors and bus priority lanes face the harshest combination of loads in urban infrastructure. MMAX MMA cures in 30-60 minutes for single overnight shift installation. TrafficPatternsXD 150mil aggregate-reinforced thermoplastic delivers BPN 65+ skid resistance and 7+ years of service in high-volume turn movements.",
    relatedProducts: ["mmax", "traffic-patterns-xd", "streetbond", "premark"],
  },
  {
    name: "Parking Lots",
    slug: "parking-lots",
    shortDesc: "Branded, durable coatings for commercial and institutional parking",
    imageUrl: "/images/applications/parking-lots/parking-lots-01.jpg",
    gallery: [1,2,3,4,5,7,8,9,10,11,13,14,15,16,17,19,20,21,22,23,25,26,27,28,29,31,32,33,34,35,37,38,39,40,41,43,44,45,46,47,49,50,51,52,53,55,56,57,58,59].map(n =>
      `/images/applications/parking-lots/parking-lots-${String(n).padStart(2,"0")}.jpg`),
    description: "Parking lot markings degrade faster than almost any other paved surface. DuraShield rejuvenates and seals oxidized asphalt, extending pavement life 3-5 years. TrafficPatterns and PreMark deliver crisp stall markings and accessible parking symbols that hold retroreflectivity for 5-7 years. StreetBond and DuraTherm unlock wayfinding colour zones and decorative treatments.",
    relatedProducts: ["durashield", "traffic-patterns", "traffic-patterns-xd", "premark", "streetbond", "streetprint", "duratherm"],
  },
  {
    name: "Parks & Paths",
    slug: "parks-paths",
    shortDesc: "Decorative coatings for pathways, plazas, and recreational surfaces",
    imageUrl: "/images/applications/parks-paths/parks-paths-01.jpg",
    gallery: [1,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,130,133,136,139,142,143,144].map(n =>
      `/images/applications/parks-paths/parks-paths-${String(n).padStart(2,"0")}.jpg`),
    description: "Urban parks and multi-use paths are where communities live. StreetBond transforms utilitarian asphalt paths into vibrant, long-lasting surfaces. DecoMark brings mural-quality artwork to the ground plane for wayfinding art and cultural expression. StreetPrint gives park plazas a traditional stone aesthetic at a fraction of real paver cost.",
    relatedProducts: ["streetbond", "decomark", "durashield", "streetprint"],
  },
  {
    name: "Playgrounds",
    slug: "playgrounds",
    shortDesc: "Safe surfaces. Bold expression.",
    imageUrl: "/images/applications/playgrounds/playgrounds-01.jpg",
    gallery: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52].map(n =>
      `/images/applications/playgrounds/playgrounds-${String(n).padStart(2,"0")}.jpg`),
    description: "Playground surfaces demand safety, durability, and delight. DecoMark custom thermoplastic graphics bring hopscotch courts, number grids, and mural-scale artwork to paved play surfaces with Pantone-accurate colour. StreetBond adds vivid colour to existing asphalt play courts without raised edges that create trip hazards.",
    relatedProducts: ["decomark", "streetbond", "streetprint", "traffic-patterns"],
  },
  {
    name: "Community Branding",
    slug: "community-branding",
    shortDesc: "Custom logos, crests, and wayfinding embedded in pavement",
    imageUrl: "/images/applications/community-branding/community-branding-01.jpg",
    gallery: gallery("community-branding", "community-branding", 14),
    description: "From Bowen Island's community art path to Vancouver's Little Italy installation to the UBC Musqueam cultural crosswalk — pavement is an underutilized canvas for community identity. HUB's DecoMark and StreetBond systems embed neighbourhood names, cultural motifs, First Nations artwork, BIA wayfinding, and Pride declarations directly into the street surface.",
    relatedProducts: ["decomark", "streetbond", "streetprint", "duratherm"],
  },
  {
    name: "Private Driveways",
    slug: "private-driveways",
    shortDesc: "Premium stamped asphalt for residential and multi-family properties",
    imageUrl: "/images/applications/residential-driveways/residential-driveways-01.jpg",
    gallery: gallery("residential-driveways", "residential-driveways", 44),
    description: "A decorative driveway is one of the highest-return investments a homeowner can make. StreetPrint delivers the look of brick, cobblestone, or slate on existing asphalt without demolition. StreetBond colour coating adds vivid, long-lasting colour. DuraShield rejuvenates and extends the life of oxidized driveways.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Sport Courts",
    slug: "sport-courts",
    shortDesc: "Court-ready surfaces. Competition-grade colour.",
    imageUrl: "/images/applications/sport-courts/sport-courts-01.jpg",
    gallery: gallery("sport-courts", "sport-courts", 21),
    description: "Tennis, basketball, pickleball, and multi-sport courts require surface colour systems that perform under repeated lateral movement and outdoor exposure. StreetBond bonds permanently to asphalt and acid-etched concrete, delivering vivid UV-stable court colours that meet tournament line-marking standards.",
    relatedProducts: ["streetbond", "decomark", "streetprint", "premark"],
  },
  {
    name: "Splash Pads",
    slug: "splash-pads",
    shortDesc: "Wet-safe. Colourful. Enduring.",
    imageUrl: "/images/applications/splash-pads/splash-pads-01.jpg",
    gallery: gallery("splash-pads", "splash-pads", 19),
    description: "Splash pad surfaces face constant water exposure, chemical treatments, and the highest safety standards for slip resistance. StreetBond's advanced acrylic formulation is applied to acid-etched concrete splash pad surfaces, delivering vivid colour with slip-resistant texture required for wet play areas.",
    relatedProducts: ["streetbond", "decomark", "durashield"],
  },
  {
    name: "Public Spaces",
    slug: "public-spaces",
    shortDesc: "Plazas, squares, and civic surfaces worth noticing.",
    imageUrl: "/images/applications/public-spaces/public-spaces-01.jpg",
    gallery: [1,2,3,5,6,7,9,10,11,13,14,15,17,18,19,21,22,23,25,26,27,29,30,31,33,34,35,37,38,39,41,42,43,45,46,47,49,50,51,53,54,55,57,58,59,61,62,63,65,66].map(n =>
      `/images/applications/public-spaces/public-spaces-${String(n).padStart(2,"0")}.jpg`),
    description: "Town squares, transit plazas, university campuses, and civic forecourts are the most visible public surfaces in any community. StreetPrint transforms utilitarian paved plazas into rich hardscape environments. StreetBond colour systems define zones and reinforce campus or municipal identity. Used at UBC, BC Children's Hospital, and civic plazas across Canada.",
    relatedProducts: ["streetprint", "streetbond", "decomark", "duratherm"],
  },
  {
    name: "Commercial Spaces",
    slug: "commercial-spaces",
    shortDesc: "First impressions start at the pavement.",
    imageUrl: "/images/applications/commercial-spaces/commercial-spaces-01.jpg",
    gallery: [1,3,5,8,10,12,15,17,19,22,24,26,29,31,33,36,38,40,43,45,47,50,52,54,57,59,61,64,66,68,71,73,75,78,80,82,85,87,89,92,94,96,99,101,103,106,108,110,113,115].map(n =>
      `/images/applications/commercial-spaces/commercial-spaces-${String(n).padStart(2,"0")}.jpg`),
    description: "Retail centres, mixed-use developments, hotel entries, and commercial campuses compete on every surface detail. StreetPrint creates the aesthetic of premium hardscape at a fraction of full stone installation cost. StreetBond colour treatments define tenant zones and wayfinding paths. DuraShield extends the life of existing commercial lot surfaces.",
    relatedProducts: ["streetprint", "streetbond", "durashield", "traffic-patterns"],
  },
  {
    name: "Townhomes",
    slug: "townhomes",
    shortDesc: "Cohesive hardscape systems for strata and residential developments",
    imageUrl: "/images/applications/townhomes/townhomes-01.jpg",
    gallery: gallery("townhomes", "townhomes", 18),
    description: "Townhome and strata developments have one chance to make a lasting impression. StreetPrint stamped asphalt driveways and entry courts deliver the look of traditional pavers at half the installation cost. StreetBond elevates guest parking areas and amenity court surfaces. DuraShield rejuvenates aging strata asphalt, extending pavement life 3-5 years.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Residential Driveways",
    slug: "residential-driveways",
    shortDesc: "Premium stamped asphalt for residential and multi-family properties",
    imageUrl: "/images/applications/residential-driveways/residential-driveways-01.jpg",
    gallery: gallery("residential-driveways", "residential-driveways", 44),
    description: "A beautifully finished residential driveway adds immediate curb appeal and lasting value. StreetPrint's in-place stamped asphalt process transforms an existing driveway into a rich decorative surface without tearing out and replacing the base. StreetBond UV-stable colour coating gives driveways a fresh, professional finish in any colour.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Pedestrian Safety",
    slug: "pedestrian-safety",
    shortDesc: "Protecting people where they walk.",
    imageUrl: "/images/applications/crosswalks/crosswalks-03.jpg",
    gallery: [1,3,6,8,11,13,16,18,21,23,26,28,31,33,36,38,41,43,45,48,50,53,55,58,60,63,65,68,70,73,75,78,80,83,85,87,90,92,95,97,100,102,105,107,110,112,115,117,120,122].map(n =>
      `/images/applications/crosswalks/crosswalks-${String(n).padStart(2,"0")}.jpg`),
    description: "Pedestrian safety is the single most important function of urban pavement marking. High-visibility crosswalks, raised intersection treatments, school zone markings, and tactile guidance surfaces all rely on durable, retroreflective pavement systems. TrafficPatterns and TrafficPatternsXD thermoplastic deliver Vision Zero crosswalks that outlast paint 5:1. StreetBond and MMAX colour coatings mark pedestrian priority zones with high-contrast colour that persists through Canadian winters.",
    relatedProducts: ["traffic-patterns", "traffic-patterns-xd", "streetbond", "mmax", "decomark", "premark"],
  },
  {
    name: "Traffic Calming",
    slug: "traffic-calming",
    shortDesc: "Infrastructure that slows, guides, and signals.",
    imageUrl: "/images/applications/traffic-calming/traffic-calming-01.jpg",
    gallery: [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,51,52,53,54,55].map(n =>
      `/images/applications/traffic-calming/traffic-calming-${String(n).padStart(2,"0")}.jpg`),
    description: "Speed tables, raised intersections, curb extensions, and gateway treatments use pavement colour and texture to reduce vehicle speeds. StreetBond and MMAX coloured coatings give traffic calming installations high-visibility colour that persists through winter maintenance cycles. TrafficPatterns and TrafficPatternsXD deliver durable markings at raised crosswalks and school zones.",
    relatedProducts: ["streetbond", "mmax", "traffic-patterns", "traffic-patterns-xd", "streetprint"],
  },
  {
    name: "Airports",
    slug: "airports",
    shortDesc: "Precision airfield markings for runways, taxiways, and aprons",
    imageUrl: "/images/applications/airports/airports-01.jpg",
    gallery: gallery("airports", "airports", 28),
    description: "Airfield surface marking is one of the most technically demanding applications in the pavement marking industry. AirMark preformed thermoplastic delivers precision threshold markings, runway designation numbers, taxiway edge lines, and holding position signs with ASTM D4956 Type IV premium retroreflectivity. Outlasts paint 4:1 with no lane-closure downtime.",
    relatedProducts: ["airmark"],
  },
  {
    name: "LEED & Urban Heat Island",
    slug: "leed-urban-heat-island",
    shortDesc: "Cool surfaces. Green credentials.",
    imageUrl: "/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg",
    gallery: gallery("leed-urban-heat-island", "leed-urban-heat-island", 2),
    description: "Dark asphalt surfaces absorb solar heat, raising urban ambient temperatures and contributing to the urban heat island effect. StreetBond light-coloured pavement coatings reflect solar radiation, reducing surface temperatures and contributing to LEED site credits for heat island reduction. Available in high-SRI formulations.",
    relatedProducts: ["streetbond", "mmax", "durashield"],
  },
  {
    name: "Public Art",
    slug: "public-art",
    shortDesc: "Custom pavement murals and Indigenous art installations at civic scale",
    imageUrl: "/images/applications/community-branding/community-branding-01.jpg",
    gallery: gallery("community-branding", "community-branding", 14),
    description: "From Indigenous art installations and labyrinth designs to pride crosswalks and transit station murals, HUBSS transforms pavement into community expression. Permanent, weather-resistant, and designed to last the full life of the asphalt surface.",
    relatedProducts: ["decomark", "streetbond", "streetprint"],
  },
  {
    name: "Regulatory Markings",
    slug: "regulatory-markings",
    shortDesc: "Precision stop bars, arrows, legends, and lane markings",
    imageUrl: "/images/applications/traffic-calming/traffic-calming-01.jpg",
    gallery: [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,51,52,53,54,55].map(n =>
      `/images/applications/traffic-calming/traffic-calming-${String(n).padStart(2,"0")}.jpg`),
    description: "Stop bars, turn arrows, yield symbols, school zone markings, and pavement legends demand precision and longevity. TrafficPatterns and TrafficPatternsXD thermoplastic deliver retroreflective symbols and lines that outlast paint 5:1. PreMark preformed thermoplastic provides fast installation for school zones, accessible parking, and crosswalk ladder lines with no curing downtime.",
    relatedProducts: ["traffic-patterns", "traffic-patterns-xd", "premark", "duratherm", "airmark"],
  },
];
