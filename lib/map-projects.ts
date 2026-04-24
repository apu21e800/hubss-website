export interface MapProject {
  id: string;
  title: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  product: string;
  application: string;
  images: string[];
  excerpt: string;
  problem: string;
  solution: string;
}

export const mapProjects: MapProject[] = [
  {
    id: "york-region-tpxd",
    title: "York Region High-Visibility Crosswalks",
    city: "York Region",
    province: "ON",
    lat: 44.0503,
    lng: -79.4662,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
      "/images/applications/crosswalks/crosswalks-03.jpg",
      "/images/applications/crosswalks/crosswalks-07.jpg",
    ],
    excerpt:
      "150mil aggregate-reinforced crosswalk markings across York Region's busiest pedestrian corridors.",
    problem:
      "York Region was repainting crosswalks every 12–18 months due to rapid wear from heavy traffic and aggressive winter maintenance. Annual repainting costs were unsustainable and visibility gaps were creating safety risks.",
    solution:
      "TrafficPatternsXD 150mil preformed thermoplastic crosswalks, heat-fused directly to the asphalt. The aggregate-reinforced surface delivers retroreflectivity that's visible wet or dry, and the material outlasted paint by 8x — reducing maintenance cycles from annual to once every 10+ years.",
  },
  {
    id: "toronto-bus-lanes",
    title: "Toronto Priority Bus Lane Network",
    city: "Toronto",
    province: "ON",
    lat: 43.6548,
    lng: -79.3883,
    product: "MMAX",
    application: "Bus & Bike Lanes",
    images: [
      "/images/products/mmax/mmax-01.jpg",
      "/images/applications/bus-lanes/bus-lanes-01.jpg",
      "/images/applications/bus-lanes/bus-lanes-03.jpg",
    ],
    excerpt:
      "Red MMA resin bus priority lanes across 12 major Toronto arterials, fast-cured and open to traffic within 90 minutes.",
    problem:
      "Toronto Transit Commission needed high-durability coloured lane treatments on heavily-loaded arterials. Traditional epoxy failed within 2 seasons under bus wheel loads and road salt.",
    solution:
      "MMAX methyl methacrylate (MMA) resin applied in red on 12 major corridors. MMA cures in under 60 minutes regardless of temperature, bonds chemically to both asphalt and concrete, and has survived 7+ winters without delamination.",
  },
  {
    id: "york-region-viva",
    title: "York Region Hwy 7 VIVA BRT Corridor",
    city: "Markham",
    province: "ON",
    lat: 43.8547,
    lng: -79.3376,
    product: "MMAX",
    application: "Bus & Bike Lanes",
    images: [
      "/images/applications/bus-lanes/bus-lanes-01.jpg",
      "/images/products/mmax/mmax-01.jpg",
      "/images/applications/bus-lanes/bus-lanes-02.jpg",
    ],
    excerpt:
      "VIVA rapid transit corridor receives MMAX red resin bus lane demarcation — open to traffic within 90 minutes of installation.",
    problem:
      "The VIVA BRT expansion required consistent, high-durability bus lane markings across the Hwy 7 rapidway. Short traffic closure windows demanded fast-cure materials.",
    solution:
      "MMAX red resin installed in night closures, fully cured before morning rush. The MMA chemistry means no temperature minimum — installed in October conditions with no curing failures.",
  },
  {
    id: "kitchener-veterans",
    title: "Kitchener Veterans Memorial Crosswalk",
    city: "Kitchener",
    province: "ON",
    lat: 43.4516,
    lng: -80.4925,
    product: "DecoMark",
    application: "Community Branding",
    images: [
      "/images/applications/community-branding/community-branding-01.jpg",
      "/images/products/decomark/decomark-04.jpg",
      "/images/applications/community-branding/community-branding-05.jpg",
    ],
    excerpt:
      "Custom DecoMark thermoplastic crosswalk honouring Kitchener's veterans at the city cenotaph — poppy motifs in Pantone-accurate regimental colours.",
    problem:
      "The City of Kitchener wanted a permanent public art installation at the cenotaph crosswalk that would honour veterans without requiring annual maintenance. Painted designs had faded within one season.",
    solution:
      "DecoMark custom preformed thermoplastic with full Pantone colour matching — poppy motifs in regimental red, fused directly to asphalt. The installation has maintained sharp colour and edge definition through four winters.",
  },
  {
    id: "london-brt",
    title: "London East Link BRT",
    city: "London",
    province: "ON",
    lat: 42.9849,
    lng: -81.2453,
    product: "StreetBond",
    application: "Bus & Bike Lanes",
    images: [
      "/images/applications/bus-lanes/bus-lanes-03.jpg",
      "/images/products/streetbond/streetbond-09.jpg",
      "/images/applications/bus-lanes/bus-lanes-05.jpg",
    ],
    excerpt:
      "StreetBond coloured pavement defines the East London Link BRT corridor with a cohesive branded transit experience.",
    problem:
      "London Transit Commission needed a cost-effective way to visually differentiate the BRT corridor from mixed traffic, creating legible wayfinding for riders and drivers alike.",
    solution:
      "StreetBond coloured pavement coating in transit red applied along the full BRT corridor. The water-based system bonded to the existing asphalt and delivers 5+ year colour retention without lane-line restriping.",
  },
  {
    id: "simcoe-rainbow",
    title: "Simcoe Rainbow Crosswalk",
    city: "Collingwood",
    province: "ON",
    lat: 44.5001,
    lng: -80.2168,
    product: "StreetBond",
    application: "Community Branding",
    images: [
      "/images/applications/community-branding/community-branding-06.jpg",
      "/images/products/streetbond/streetbond-01.png",
      "/images/applications/community-branding/community-branding-08.jpg",
    ],
    excerpt:
      "Pride crosswalk installation delivering permanent rainbow colour that survives snowplows and de-icing chemicals.",
    problem:
      "The town needed a pride crosswalk that would survive Ontario winters — previous installations used paint and faded or chipped within one season, requiring costly annual repaints.",
    solution:
      "StreetBond multi-colour installation with each stripe applied as a separate coloured coating pass. The system chemically bonds to asphalt and is engineered to withstand plow blades and calcium chloride — now in its third winter with vibrant colour.",
  },
  {
    id: "ottawa-every-child",
    title: "Every Child Matters Crosswalk",
    city: "Ottawa",
    province: "ON",
    lat: 45.4215,
    lng: -75.6972,
    product: "DecoMark",
    application: "Community Branding",
    images: [
      "/images/products/decomark/decomark-01.jpg",
      "/images/applications/community-branding/community-branding-03.jpg",
      "/images/products/decomark/decomark-06.jpg",
    ],
    excerpt:
      "Permanent Every Child Matters crosswalk featuring Indigenous-inspired design, installed in partnership with local First Nations communities.",
    problem:
      "The City of Ottawa wanted a memorial crosswalk acknowledging the National Day for Truth and Reconciliation with permanent, dignified imagery that would not require yearly maintenance.",
    solution:
      "DecoMark custom thermoplastic with orange motif design developed in consultation with Indigenous community partners. Pantone-matched colours fused into the asphalt — a permanent, zero-maintenance installation.",
  },
  {
    id: "vancouver-commercial-drive",
    title: "Commercial Drive Decorative Crosswalk",
    city: "Vancouver",
    province: "BC",
    lat: 49.2751,
    lng: -123.0698,
    product: "StreetPrint",
    application: "Crosswalks",
    images: [
      "/images/products/streetprint/streetprint-40.jpg",
      "/images/applications/crosswalks/crosswalks-04.jpg",
      "/images/products/streetprint/streetprint-05.jpg",
    ],
    excerpt:
      "Stamped asphalt crosswalk celebrating the Commercial Drive BIA's multicultural identity — brick pattern in warm terracotta.",
    problem:
      "The Commercial Drive BIA wanted raised crosswalk aesthetics without the maintenance costs of brick or concrete pavers. The area sees extremely high pedestrian traffic.",
    solution:
      "StreetPrint stamped and coloured asphalt delivering the visual warmth of brick at a fraction of the lifecycle cost. The surface mimics a heritage cobblestone pattern while maintaining smooth drainage and snow clearance.",
  },
  {
    id: "ubc-musqueam",
    title: "UBC Musqueam Campus Crosswalk",
    city: "Vancouver",
    province: "BC",
    lat: 49.2606,
    lng: -123.246,
    product: "StreetPrint",
    application: "Parks & Paths",
    images: [
      "/images/applications/parks-paths/parks-paths-01.jpg",
      "/images/products/streetprint/streetprint-03.jpg",
      "/images/applications/community-branding/community-branding-02.jpg",
    ],
    excerpt:
      "A ceremonial crosswalk honouring the Musqueam Nation's traditional territory, featuring Coast Salish art in stamped asphalt.",
    problem:
      "UBC sought to embed cultural recognition into the physical campus landscape in a way that was permanent, respectful, and visible year-round — not a plaque or sign but part of the surface itself.",
    solution:
      "StreetPrint stamped asphalt with custom Coast Salish pattern templates developed with Musqueam cultural advisors. The crosswalk acts as a daily reminder of the land acknowledgement, embedded in the path every student and faculty member walks.",
  },
  {
    id: "vancouver-laneways",
    title: "More Awesome Now Laneway Revitalization",
    city: "Vancouver",
    province: "BC",
    lat: 49.2845,
    lng: -123.1098,
    product: "StreetBond",
    application: "Public Art",
    images: [
      "/images/products/streetbond/streetbond-02.png",
      "/images/applications/community-branding/community-branding-09.jpg",
      "/images/products/streetbond/streetbond-05.png",
    ],
    excerpt:
      "Six Vancouver laneways transformed into vibrant public art corridors using StreetBond coloured pavement systems.",
    problem:
      "Vancouver's More Awesome Now program identified underused laneways as candidates for public realm activation. Traditional mural paint on asphalt failed rapidly under traffic and weather.",
    solution:
      "StreetBond's penetrating coloured coating system allowed bold graphic patterns to be rolled directly onto asphalt, surviving foot traffic and light vehicle loading. Six laneways completed over two summers, each with a unique commissioned design.",
  },
  {
    id: "richmond-brighouse",
    title: "Richmond Brighouse Station Crosswalk",
    city: "Richmond",
    province: "BC",
    lat: 49.1669,
    lng: -123.1377,
    product: "DecoMark",
    application: "Community Branding",
    images: [
      "/images/products/decomark/decomark-03.jpg",
      "/images/applications/community-branding/community-branding-11.jpg",
      "/images/products/decomark/decomark-08.jpg",
    ],
    excerpt:
      "High-design thermoplastic crosswalk at Richmond's busiest SkyTrain station, integrating wayfinding and civic identity.",
    problem:
      "The Brighouse interchange sees some of BC's highest pedestrian counts. Standard white crosswalk stripes were insufficient for wayfinding at the complex multi-modal junction.",
    solution:
      "DecoMark custom thermoplastic with directional design elements and brand colours embedded into all crosswalk approaches. The high-contrast pattern significantly improved pedestrian routing at peak hours.",
  },
  {
    id: "new-westminster-complete-streets",
    title: "New Westminster Complete Streets",
    city: "New Westminster",
    province: "BC",
    lat: 49.2057,
    lng: -122.911,
    product: "StreetBond",
    application: "Crosswalks",
    images: [
      "/images/products/streetbond/streetbond-04.png",
      "/images/applications/crosswalks/crosswalks-05.jpg",
      "/images/products/streetbond/streetbond-10.jpg",
    ],
    excerpt:
      "Complete Streets implementation using StreetBond to create differentiated pedestrian zones, bike corridors, and transit priority areas.",
    problem:
      "New Westminster's downtown core needed a unified Complete Streets approach — differentiating pedestrian, cycling, and transit zones without expensive reconstruction.",
    solution:
      "StreetBond in three distinct colour palettes: burnt orange for pedestrian priority zones, green for cycling infrastructure, and red for transit boarding areas. The system created legible street hierarchy without a single lane being rebuilt.",
  },
  {
    id: "white-rock-pier",
    title: "White Rock Pier Crosswalk",
    city: "White Rock",
    province: "BC",
    lat: 49.0233,
    lng: -122.802,
    product: "TrafficPatterns",
    application: "Crosswalks",
    images: [
      "/images/applications/crosswalks/crosswalks-06.jpg",
      "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
      "/images/applications/crosswalks/crosswalks-09.jpg",
    ],
    excerpt:
      "Coastal crosswalk installation near White Rock's iconic pier — durable thermoplastic engineered for salt air and heavy summer tourist traffic.",
    problem:
      "White Rock's Marine Drive crosswalks endure intense summer pedestrian loads, salt spray, and sandy conditions that accelerate wear on painted markings. The promenade required 2x annual repainting.",
    solution:
      "TrafficPatterns preformed thermoplastic crosswalks designed to withstand coastal conditions. The glass-bead retroreflective surface performs day and night, keeping the waterfront safe for the summer influx of visitors.",
  },
  {
    id: "sechelt-tsain-ko",
    title: "Tsain-Ko Cultural Crosswalk, Sechelt",
    city: "Sechelt",
    province: "BC",
    lat: 49.4731,
    lng: -123.7577,
    product: "DecoMark",
    application: "Community Branding",
    images: [
      "/images/products/decomark/decomark-05.jpg",
      "/images/applications/community-branding/community-branding-12.jpg",
      "/images/products/decomark/decomark-09.jpg",
    ],
    excerpt:
      "Custom thermoplastic crosswalk featuring shíshálh Nation (Sechelt) cultural imagery — a permanent expression of reconciliation on the Sunshine Coast.",
    problem:
      "The District of Sechelt and shíshálh Nation wanted a crosswalk that honoured Indigenous culture at the gateway to the community. Painted designs would fade within a season in the coastal climate.",
    solution:
      "DecoMark custom thermoplastic with shíshálh-inspired design elements, developed with Nation leadership. Pantone-accurate colours fused into the surface — weather-resistant and maintenance-free for 10+ years.",
  },
  {
    id: "north-van-spirit-trail",
    title: "Spirit Trail Waterfront Wayfinding",
    city: "North Vancouver",
    province: "BC",
    lat: 49.3125,
    lng: -123.0839,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      "/images/products/streetbond/streetbond-06.png",
      "/images/applications/parks-paths/parks-paths-03.jpg",
      "/images/applications/bike-lanes/bike-lanes-03.jpg",
    ],
    excerpt:
      "StreetBond wayfinding colours embedded into North Vancouver's Spirit Trail, guiding cyclists and pedestrians across the waterfront network.",
    problem:
      "The Spirit Trail greenway lacked consistent visual wayfinding, causing confusion at key decision points. Painted signage faded quickly on the exposed waterfront path.",
    solution:
      "StreetBond in designated wayfinding colours at 14 key intersections along the Spirit Trail. The penetrating coating bonds to the existing path surface and resists fading under UV and wet conditions common on the North Shore.",
  },
  {
    id: "coquitlam-terry-fox",
    title: "Terry Fox Plaza, Coquitlam",
    city: "Coquitlam",
    province: "BC",
    lat: 49.2843,
    lng: -122.7932,
    product: "StreetPrint",
    application: "Community Branding",
    images: [
      "/images/products/streetprint/streetprint-04.jpg",
      "/images/applications/community-branding/community-branding-04.jpg",
      "/images/products/streetprint/streetprint-08.jpg",
    ],
    excerpt:
      "Stamped and coloured asphalt plaza honouring Terry Fox — a civic centrepiece blending heritage aesthetic with low-maintenance pavement technology.",
    problem:
      "The City of Coquitlam was planning the Terry Fox commemorative plaza and needed a surface that could carry the weight of civic significance without requiring annual restoration budgets.",
    solution:
      "StreetPrint stamped asphalt in a cobblestone pattern with warm terracotta pigment, creating a heritage plaza feel at 60% of the cost of concrete pavers. The surface has required zero reactive maintenance in four years.",
  },
  {
    id: "bowen-island-path",
    title: "Bowen Island Foreshore Path",
    city: "Bowen Island",
    province: "BC",
    lat: 49.3846,
    lng: -123.3374,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      "/images/applications/parks-paths/parks-paths-04.jpg",
      "/images/products/streetbond/streetbond-07.png",
      "/images/applications/parks-paths/parks-paths-07.jpg",
    ],
    excerpt:
      "StreetBond coloured pathway linking Bowen Island's ferry terminal to the village centre — slip-resistant and environmentally sensitive.",
    problem:
      "Bowen Island's foreshore path needed a coloured surface treatment that would stand up to heavy rainfall and salt air, while meeting the community's environmental standards for waterway proximity.",
    solution:
      "StreetBond's water-based system with anti-slip aggregate, applied in a natural green-grey tone that complements the coastal landscape. The coating meets Environment Canada waterway buffer standards and requires no solvents.",
  },
  {
    id: "bc-childrens-hospital",
    title: "BC Children's Hospital Labyrinth",
    city: "Vancouver",
    province: "BC",
    lat: 49.2406,
    lng: -123.1393,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      "/images/products/streetbond/streetbond-03.png",
      "/images/applications/parks-paths/parks-paths-02.jpg",
      "/images/applications/community-branding/community-branding-07.jpg",
    ],
    excerpt:
      "A meditative walking labyrinth on BC Children's Hospital grounds — permanent coloured pavement designed as a healing garden feature.",
    problem:
      "BC Children's Hospital wanted a therapeutic labyrinth in their outdoor healing garden. The design needed to be durable enough for daily use, visually distinct, and zero-maintenance given hospital grounds staffing constraints.",
    solution:
      "StreetBond in two complementary colours defines the labyrinth path and surround on the existing asphalt. The application required precise template masking to achieve the geometric design, and has required no maintenance since installation.",
  },
  {
    id: "burnaby-bike-lanes",
    title: "Burnaby Active Transportation Network",
    city: "Burnaby",
    province: "BC",
    lat: 49.2488,
    lng: -122.9805,
    product: "StreetBond",
    application: "Bike & Bus Lanes",
    images: [
      "/images/applications/bike-lanes/bike-lanes-01.jpg",
      "/images/products/streetbond/streetbond-08.png",
      "/images/applications/bike-lanes/bike-lanes-04.jpg",
    ],
    excerpt:
      "StreetBond green bike lane treatments across Burnaby's active transportation network — connecting SkyTrain stations to residential neighbourhoods.",
    problem:
      "Burnaby was expanding its cycling network but needed a cost-effective way to clearly differentiate protected bike lanes from vehicle traffic, particularly at conflict zones.",
    solution:
      "StreetBond green pavement coating in conflict zones and intersection crossings, with high-friction aggregate added at stop lines. The visual differentiation has measurably reduced vehicle incursions into the protected lanes.",
  },
  {
    id: "mississauga-crosswalks",
    title: "Mississauga Civic Centre Crosswalks",
    city: "Mississauga",
    province: "ON",
    lat: 43.589,
    lng: -79.6441,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/applications/crosswalks/crosswalks-02.jpg",
      "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
      "/images/applications/crosswalks/crosswalks-08.jpg",
    ],
    excerpt:
      "High-visibility crosswalk network around Mississauga's Civic Centre, engineered for one of Ontario's busiest pedestrian plazas.",
    problem:
      "Mississauga's Civic Centre sees year-round heavy pedestrian traffic and aggressive snow clearing operations. Painted crosswalks required three repaints per year to maintain vision-zero level visibility.",
    solution:
      "TrafficPatternsXD 150mil preformed thermoplastic at all Civic Centre crossings. The thick aggregate surface withstands plow blades and remains retroreflective through Ontario winters without repainting.",
  },
];
