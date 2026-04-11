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
    shortDesc: "Bold markings. Lasting safety.",
    imageUrl: "/images/applications/crosswalks/crosswalks-01.jpg",
    gallery: gallery("crosswalks", "crosswalks", 122),
    description: "Crosswalks are the most visible safety infrastructure in any municipality. HUB systems deliver durability, retroreflectivity, and design flexibility that paint cannot match. TrafficPatterns and TrafficPatternsXD survive snowplow cycles and de-icing chemicals. DecoMark and StreetBond unlock full artistic expression for Pride crosswalks, Indigenous art, and neighbourhood identity. Specified by York Region, City of Toronto, Vancouver, and over 500 municipalities coast to coast.",
    relatedProducts: ["traffic-patterns", "traffic-patterns-xd", "streetbond", "decomark", "duratherm", "premark"],
  },
  {
    name: "Bike Lanes",
    slug: "bike-lanes",
    shortDesc: "Lanes that protect. Colours that last.",
    imageUrl: "/images/applications/bike-lanes/bike-lanes-01.jpg",
    gallery: gallery("bike-lanes", "bike-lanes", 38),
    description: "Bike lanes demand pavement systems that hold colour season after season. StreetBond delivers 20-year colour retention on asphalt and concrete with full Pantone custom matching. MMAX MMA is specified for high-volume transit-adjacent corridors requiring overnight curing and bond strength above 3 MPa. PreMark and TrafficPatterns deliver retroreflective symbols and edge lines that outlast paint 5:1.",
    relatedProducts: ["streetbond", "mmax", "premark", "traffic-patterns"],
  },
  {
    name: "Bus Lanes",
    slug: "bus-lanes",
    shortDesc: "Transit-grade durability. Zero downtime.",
    imageUrl: "/images/applications/bus-lanes/bus-lanes-01.jpg",
    gallery: gallery("bus-lanes", "bus-lanes", 40),
    description: "BRT corridors and bus priority lanes face the harshest combination of loads in urban infrastructure. MMAX MMA cures in 30-60 minutes for single overnight shift installation. TrafficPatternsXD 150mil aggregate-reinforced thermoplastic delivers BPN 65+ skid resistance and 7+ years of service in high-volume turn movements.",
    relatedProducts: ["mmax", "traffic-patterns-xd", "streetbond", "premark"],
  },
  {
    name: "Parking Lots",
    slug: "parking-lots",
    shortDesc: "Stalls that stay sharp. Surfaces that last.",
    imageUrl: "/images/applications/parking-lots/parking-lots-01.jpg",
    gallery: gallery("parking-lots", "parking-lots", 59),
    description: "Parking lot markings degrade faster than almost any other paved surface. DuraShield rejuvenates and seals oxidized asphalt, extending pavement life 3-5 years. TrafficPatterns and PreMark deliver crisp stall markings and accessible parking symbols that hold retroreflectivity for 5-7 years. StreetBond and DuraTherm unlock wayfinding colour zones and decorative treatments.",
    relatedProducts: ["durashield", "traffic-patterns", "traffic-patterns-xd", "premark", "streetbond", "streetprint", "duratherm"],
  },
  {
    name: "Parks & Paths",
    slug: "parks-paths",
    shortDesc: "Colour and character for every pathway.",
    imageUrl: "/images/applications/parks-paths/parks-paths-01.jpg",
    gallery: gallery("parks-paths", "parks-paths", 144),
    description: "Urban parks and multi-use paths are where communities live. StreetBond 20-year colour retention transforms utilitarian asphalt paths into vibrant spaces. DecoMark brings mural-quality artwork to the ground plane for wayfinding art and cultural expression. StreetPrint gives park plazas a traditional stone aesthetic at a fraction of real paver cost.",
    relatedProducts: ["streetbond", "decomark", "durashield", "streetprint"],
  },
  {
    name: "Playgrounds",
    slug: "playgrounds",
    shortDesc: "Safe surfaces. Bold expression.",
    imageUrl: "/images/applications/playgrounds/playgrounds-01.jpg",
    gallery: gallery("playgrounds", "playgrounds", 53),
    description: "Playground surfaces demand safety, durability, and delight. DecoMark custom thermoplastic graphics bring hopscotch courts, number grids, and mural-scale artwork to paved play surfaces with Pantone-accurate colour. StreetBond adds vivid colour to existing asphalt play courts without raised edges that create trip hazards.",
    relatedProducts: ["decomark", "streetbond", "streetprint", "traffic-patterns"],
  },
  {
    name: "Community Branding",
    slug: "community-branding",
    shortDesc: "Neighbourhoods with identity underfoot.",
    imageUrl: "/images/applications/community-branding/community-branding-01.jpg",
    gallery: gallery("community-branding", "community-branding", 14),
    description: "From Bowen Island's community art path to Vancouver's Little Italy installation to the UBC Musqueam cultural crosswalk — pavement is an underutilized canvas for community identity. HUB's DecoMark and StreetBond systems embed neighbourhood names, cultural motifs, First Nations artwork, BIA wayfinding, and Pride declarations directly into the street surface.",
    relatedProducts: ["decomark", "streetbond", "streetprint", "duratherm"],
  },
  {
    name: "Private Driveways",
    slug: "private-driveways",
    shortDesc: "Curb appeal that compounds.",
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
    description: "Tennis, basketball, pickleball, and multi-sport courts require surface colour systems that perform under repeated lateral movement and outdoor exposure. StreetBond bonds permanently to asphalt and acid-etched concrete, delivering vivid UV-stable court colours that meet tournament line-marking standards with a 20-year colour retention warranty.",
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
    gallery: gallery("public-spaces", "public-spaces", 67),
    description: "Town squares, transit plazas, university campuses, and civic forecourts are the most visible public surfaces in any community. StreetPrint transforms utilitarian paved plazas into rich hardscape environments. StreetBond colour systems define zones and reinforce campus or municipal identity. Used at UBC, BC Children's Hospital, and civic plazas across Canada.",
    relatedProducts: ["streetprint", "streetbond", "decomark", "duratherm"],
  },
  {
    name: "Commercial Spaces",
    slug: "commercial-spaces",
    shortDesc: "First impressions start at the pavement.",
    imageUrl: "/images/applications/commercial-spaces/commercial-spaces-01.jpg",
    gallery: gallery("commercial-spaces", "commercial-spaces", 115),
    description: "Retail centres, mixed-use developments, hotel entries, and commercial campuses compete on every surface detail. StreetPrint creates the aesthetic of premium hardscape at a fraction of full stone installation cost. StreetBond colour treatments define tenant zones and wayfinding paths. DuraShield extends the life of existing commercial lot surfaces.",
    relatedProducts: ["streetprint", "streetbond", "durashield", "traffic-patterns"],
  },
  {
    name: "Townhomes",
    slug: "townhomes",
    shortDesc: "Strata surfaces that set the standard.",
    imageUrl: "/images/applications/townhomes/townhomes-01.jpg",
    gallery: gallery("townhomes", "townhomes", 18),
    description: "Townhome and strata developments have one chance to make a lasting impression. StreetPrint stamped asphalt driveways and entry courts deliver the look of traditional pavers at half the installation cost. StreetBond elevates guest parking areas and amenity court surfaces. DuraShield rejuvenates aging strata asphalt, extending pavement life 3-5 years.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Residential Driveways",
    slug: "residential-driveways",
    shortDesc: "Driveways worth coming home to.",
    imageUrl: "/images/applications/residential-driveways/residential-driveways-01.jpg",
    gallery: gallery("residential-driveways", "residential-driveways", 44),
    description: "A beautifully finished residential driveway adds immediate curb appeal and lasting value. StreetPrint's in-place stamped asphalt process transforms an existing driveway into a rich decorative surface without tearing out and replacing the base. StreetBond UV-stable colour coating gives driveways a fresh, professional finish in any colour.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Traffic Calming",
    slug: "traffic-calming",
    shortDesc: "Infrastructure that slows, guides, and signals.",
    imageUrl: "/images/applications/traffic-calming/traffic-calming-01.jpg",
    gallery: gallery("traffic-calming", "traffic-calming", 56),
    description: "Speed tables, raised intersections, curb extensions, and gateway treatments use pavement colour and texture to reduce vehicle speeds. StreetBond and MMAX coloured coatings give traffic calming installations high-visibility colour that persists through winter maintenance cycles. TrafficPatterns and TrafficPatternsXD deliver durable markings at raised crosswalks and school zones.",
    relatedProducts: ["streetbond", "mmax", "traffic-patterns", "traffic-patterns-xd", "streetprint"],
  },
  {
    name: "Airports",
    slug: "airports",
    shortDesc: "Precision markings. Aviation-grade performance.",
    imageUrl: "/images/applications/airports/airports-01.jpg",
    gallery: gallery("airports", "airports", 28),
    description: "Airfield surface marking is one of the most regulated and technically demanding applications in the road marking industry. AirMark preformed thermoplastic delivers FAA Advisory Circular 150/5370-10 compliant threshold markings, runway designation numbers, taxiway edge lines, and holding position signs with ASTM D4956 Type IV premium retroreflectivity. Outlast paint 4:1.",
    relatedProducts: ["airmark"],
  },
  {
    name: "LEED & Urban Heat Island",
    slug: "leed-urban-heat-island",
    shortDesc: "Cool surfaces. Green credentials.",
    imageUrl: "/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg",
    gallery: gallery("leed-urban-heat-island", "leed-urban-heat-island", 2),
    description: "Dark asphalt surfaces absorb solar heat, raising urban ambient temperatures and contributing to the urban heat island effect. StreetBond light-coloured pavement coatings reflect solar radiation, reducing surface temperatures and contributing to LEED site credit compliance for heat island reduction. Available in high-SRI formulations.",
    relatedProducts: ["streetbond", "mmax", "durashield"],
  },
  {
    name: "Regulatory Markings",
    slug: "regulatory-markings",
    shortDesc: "Compliant symbols. Consistent performance.",
    imageUrl: "/images/applications/airports/airports-01.jpg",
    gallery: gallery("airports", "airports", 28),
    description: "Stop bars, yield lines, turn arrows, speed legends, accessible parking symbols, and the full library of TAC and MUTCD-compliant regulatory pavement markings are available through HUB's PreMark and AirMark systems. Pre-cut thermoplastic components eliminate stencil setup and deliver consistent markings that outlast painted equivalents 5:1.",
    relatedProducts: ["premark", "airmark", "traffic-patterns", "traffic-patterns-xd", "duratherm"],
  },
];
