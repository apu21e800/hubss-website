export interface MapProject {
  id: string;
  title: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  product: string;
  application: string;
  /** Install year as a 4-digit string. Optional — when omitted, the popup
   *  card hides the year line gracefully. Vernon to populate when available. */
  year?: string;
  images: string[];
  excerpt: string;
  problem: string;
  solution: string;
}

export const mapProjects: MapProject[] = [
  // ── Ontario ────────────────────────────────────────────────────────────────
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
    title: "Collingwood Rainbow Crosswalk",
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
  {
    id: "hamilton-james-street",
    title: "Hamilton James Street North Cultural Corridor",
    city: "Hamilton",
    province: "ON",
    lat: 43.2578,
    lng: -79.8711,
    product: "StreetPrint",
    application: "Community Branding",
    images: [
      "/images/products/streetprint/streetprint-40.jpg",
      "/images/applications/community-branding/community-branding-04.jpg",
      "/images/products/streetprint/streetprint-05.jpg",
    ],
    excerpt:
      "Stamped asphalt streetscape treatment along Hamilton's arts district, creating a heritage-look pedestrian corridor at a fraction of paver cost.",
    problem:
      "The James Street North BIA wanted the feel of a European cobblestone corridor without the structural cost and maintenance challenges of actual pavers. Concrete paving was also cost-prohibitive for the multi-block stretch.",
    solution:
      "StreetPrint stamped asphalt in a classic cobblestone pattern with warm ochre pigment, installed in a single weekend closure. The result is a visually unified corridor that's been maintenance-free through four Hamilton winters.",
  },
  {
    id: "waterloo-university-ave",
    title: "Waterloo University Avenue Active Transportation",
    city: "Waterloo",
    province: "ON",
    lat: 43.4668,
    lng: -80.5199,
    product: "TrafficPatternsXD",
    application: "Bike & Bus Lanes",
    images: [
      "/images/applications/bike-lanes/bike-lanes-01.jpg",
      "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
      "/images/applications/bike-lanes/bike-lanes-04.jpg",
    ],
    excerpt:
      "Protected bike lane markings and conflict zone treatments on Waterloo's university corridor, one of Ontario's highest-volume cycling routes.",
    problem:
      "University Avenue carries thousands of student cyclists daily. Painted conflict zone markings at intersections wore out within weeks under the combination of bike traffic and winter maintenance.",
    solution:
      "TrafficPatternsXD 150mil preformed thermoplastic at all conflict zones and crossing points. The aggregate surface provides traction even on wet days, and the durability eliminates the in-semester disruptions caused by repainting.",
  },
  {
    id: "barrie-downtown",
    title: "Barrie Downtown Revitalization Crosswalks",
    city: "Barrie",
    province: "ON",
    lat: 44.3894,
    lng: -79.6903,
    product: "StreetBond",
    application: "Community Branding",
    images: [
      "/images/products/streetbond/streetbond-04.png",
      "/images/applications/crosswalks/crosswalks-05.jpg",
      "/images/products/streetbond/streetbond-10.jpg",
    ],
    excerpt:
      "StreetBond coloured crosswalk and pedestrian plaza treatments anchoring Barrie's downtown core revitalization.",
    problem:
      "Barrie's downtown improvement strategy needed a high-impact, low-maintenance surface treatment to signal the pedestrian priority zone to drivers and create a welcoming streetscape for the commercial core.",
    solution:
      "StreetBond in a warm terracotta palette applied at all crosswalk approaches and plaza zones. The coloured pavement system creates a unified identity for the downtown BIA district that performs through Barrie's snowbelt winters.",
  },
  {
    id: "kingston-heritage",
    title: "Kingston Heritage District Streetscape",
    city: "Kingston",
    province: "ON",
    lat: 44.2312,
    lng: -76.4860,
    product: "StreetPrint",
    application: "Parks & Paths",
    images: [
      "/images/products/streetprint/streetprint-04.jpg",
      "/images/applications/parks-paths/parks-paths-01.jpg",
      "/images/products/streetprint/streetprint-08.jpg",
    ],
    excerpt:
      "Stamped and coloured asphalt pedestrian zones that complement Kingston's limestone heritage architecture.",
    problem:
      "Kingston's historic core required surface treatments that matched the city's limestone and heritage aesthetic while providing a durable, accessible walking surface. Traditional paving stones were incompatible with the freeze-thaw cycle.",
    solution:
      "StreetPrint stamped asphalt in a limestone-grey palette with a random flagstone pattern — visually consistent with the surrounding heritage buildings but structurally resilient through Kingston's harsh winters.",
  },
  {
    id: "windsor-ambassador",
    title: "Windsor Ambassador Bridge Approach Corridor",
    city: "Windsor",
    province: "ON",
    lat: 42.3149,
    lng: -83.0364,
    product: "MMAX",
    application: "Bus & Bike Lanes",
    images: [
      "/images/products/mmax/mmax-01.jpg",
      "/images/applications/bus-lanes/bus-lanes-05.jpg",
      "/images/applications/bus-lanes/bus-lanes-01.jpg",
    ],
    excerpt:
      "MMAX MMA resin bus and truck priority lane demarcation on Windsor's high-volume cross-border approach corridor.",
    problem:
      "The Ambassador Bridge approach carries heavy cross-border freight traffic. Standard epoxy lane markings failed within one season under the constant heavy axle loads and de-icing salt application.",
    solution:
      "MMAX MMA resin installed on the approach lanes — chemically bonding to the existing concrete and asphalt surfaces. The material's chemical resistance to chlorides makes it ideal for this high-salt environment, with 5+ years performance expected.",
  },
  // ── British Columbia ───────────────────────────────────────────────────────
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
    id: "victoria-chinatown",
    title: "Victoria Chinatown Gateway Streetscape",
    city: "Victoria",
    province: "BC",
    lat: 48.4275,
    lng: -123.3664,
    product: "StreetPrint",
    application: "Community Branding",
    images: [
      "/images/products/streetprint/streetprint-03.jpg",
      "/images/applications/community-branding/community-branding-02.jpg",
      "/images/products/streetprint/streetprint-40.jpg",
    ],
    excerpt:
      "Stamped asphalt streetscape through North America's second-oldest Chinatown — a historic gateway enhanced with decorative pavement.",
    problem:
      "The City of Victoria wanted to enhance the pedestrian character of Fisgard Street through the Chinatown National Historic Site without disrupting its heritage status or requiring expensive reconstruction.",
    solution:
      "StreetPrint stamped asphalt in a fan pattern with warm brick-red tones, installed over the existing asphalt base. The historic overlay required no structural changes and was approved by Parks Canada as compatible with the heritage precinct guidelines.",
  },
  {
    id: "kelowna-downtown",
    title: "Kelowna Downtown Waterfront Crosswalks",
    city: "Kelowna",
    province: "BC",
    lat: 49.8879,
    lng: -119.4962,
    product: "StreetBond",
    application: "Community Branding",
    images: [
      "/images/products/streetbond/streetbond-01.png",
      "/images/applications/community-branding/community-branding-06.jpg",
      "/images/products/streetbond/streetbond-05.png",
    ],
    excerpt:
      "Vibrant StreetBond crosswalk treatments along Kelowna's Bernard Avenue and waterfront promenade, anchoring the city's active downtown core.",
    problem:
      "Kelowna's downtown BIA needed crosswalk treatments that would survive the Okanagan's extreme temperature swings — from -20°C winters to +40°C summers — without cracking, fading, or lifting.",
    solution:
      "StreetBond's flexible polymer formulation handles the thermal cycling that destroys rigid coatings. Applied in vibrant community colours, the crosswalks have maintained adhesion and colour through three full Okanagan seasons.",
  },
  {
    id: "nanaimo-waterfront",
    title: "Nanaimo Harbour City Crosswalks",
    city: "Nanaimo",
    province: "BC",
    lat: 49.1642,
    lng: -123.9373,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/applications/crosswalks/crosswalks-03.jpg",
      "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
      "/images/applications/crosswalks/crosswalks-07.jpg",
    ],
    excerpt:
      "High-visibility 150mil crosswalk markings on Nanaimo's Commercial Street, engineered for coastal conditions and ferry foot traffic.",
    problem:
      "Nanaimo's downtown sees heavy pedestrian surges from BC Ferries foot passengers. Painted crosswalks on Commercial Street degraded rapidly from the wet coastal climate and foot traffic volumes.",
    solution:
      "TrafficPatternsXD 150mil thermoplastic at all priority crossings, with high-retroreflectivity glass beads for visibility in Nanaimo's frequent rain and fog conditions. Performance expected to exceed 10 years.",
  },
  {
    id: "kamloops-active-transport",
    title: "Kamloops Active Transportation Corridors",
    city: "Kamloops",
    province: "BC",
    lat: 50.6745,
    lng: -120.3223,
    product: "StreetBond",
    application: "Bike & Bus Lanes",
    images: [
      "/images/applications/bike-lanes/bike-lanes-03.jpg",
      "/images/products/streetbond/streetbond-06.png",
      "/images/applications/bike-lanes/bike-lanes-01.jpg",
    ],
    excerpt:
      "StreetBond green bike corridor treatments across Kamloops's active transportation network, built for the city's extreme summer heat and dry climate.",
    problem:
      "Kamloops's 40°C+ summers caused rapid UV degradation of standard bike lane paint. The high heat also made traditional thermoplastics incompatible with the installation process during summer months.",
    solution:
      "StreetBond's UV-stable formulation handles Kamloops's intense solar radiation without fading or softening. The water-based system can be applied in high temperatures, unlike hot-pour alternatives, making summer installation practical.",
  },
  // ── Alberta ────────────────────────────────────────────────────────────────
  {
    id: "calgary-brt-red",
    title: "Calgary MAX BRT Red Corridor",
    city: "Calgary",
    province: "AB",
    lat: 51.0447,
    lng: -114.0719,
    product: "MMAX",
    application: "Bus & Bike Lanes",
    images: [
      "/images/products/mmax/mmax-01.jpg",
      "/images/applications/bus-lanes/bus-lanes-01.jpg",
      "/images/applications/bus-lanes/bus-lanes-03.jpg",
    ],
    excerpt:
      "MMAX MMA resin bus lane demarcation across Calgary's MAX BRT network — fast-cure chemistry designed for Alberta's freeze-thaw cycle.",
    problem:
      "Calgary Transit needed consistent high-durability bus lane markings across the MAX rapid transit network. Standard thermoplastics applied at temperature extremes had caused bonding failures and bubble delamination.",
    solution:
      "MMAX MMA resin applied in transit red during night closures. The MMA chemistry cures rapidly at sub-zero temperatures and bonds chemically to the concrete and asphalt surfaces common on Calgary's arterials — five seasons of performance recorded.",
  },
  {
    id: "calgary-reconciliation",
    title: "Calgary Reconciliation Crosswalk",
    city: "Calgary",
    province: "AB",
    lat: 51.0486,
    lng: -114.0744,
    product: "DecoMark",
    application: "Community Branding",
    images: [
      "/images/products/decomark/decomark-01.jpg",
      "/images/applications/community-branding/community-branding-03.jpg",
      "/images/products/decomark/decomark-06.jpg",
    ],
    excerpt:
      "Permanent truth and reconciliation crosswalk in Calgary's downtown core, co-designed with Treaty 7 First Nations.",
    problem:
      "The City of Calgary wanted a permanent, high-dignity crosswalk installation acknowledging the National Day for Truth and Reconciliation. Previous painted installations faded within one Calgary winter.",
    solution:
      "DecoMark custom preformed thermoplastic co-designed with Treaty 7 First Nations artists. The orange and earth-tone pattern is fused into the asphalt and engineered to withstand Calgary's -40°C winters and heavy CBD traffic loads.",
  },
  {
    id: "calgary-peace-bridge",
    title: "Calgary Peace Bridge Plaza",
    city: "Calgary",
    province: "AB",
    lat: 51.0638,
    lng: -114.1032,
    product: "StreetPrint",
    application: "Parks & Paths",
    images: [
      "/images/products/streetprint/streetprint-04.jpg",
      "/images/applications/parks-paths/parks-paths-01.jpg",
      "/images/products/streetprint/streetprint-08.jpg",
    ],
    excerpt:
      "Decorative stamped asphalt plaza at the Peace Bridge approach, creating a coherent gateway between the Bow River pathway and Kensington.",
    problem:
      "The Peace Bridge plaza needed a durable, visually striking surface that complemented the Santiago Calatrava architecture without competing with it. Standard asphalt looked incongruous with the bridge's design.",
    solution:
      "StreetPrint stamped asphalt in a random stone pattern with neutral grey pigment — sophisticated enough to complement the sculptural bridge while resilient enough for Calgary's heavy cycling traffic and extreme winters.",
  },
  {
    id: "edmonton-whyte-ave",
    title: "Edmonton Whyte Avenue Arts District",
    city: "Edmonton",
    province: "AB",
    lat: 53.5186,
    lng: -113.4975,
    product: "StreetBond",
    application: "Community Branding",
    images: [
      "/images/products/streetbond/streetbond-02.png",
      "/images/applications/community-branding/community-branding-09.jpg",
      "/images/products/streetbond/streetbond-05.png",
    ],
    excerpt:
      "StreetBond public art installations along Edmonton's Whyte Avenue — permanent colour that defines the arts district even through prairie winters.",
    problem:
      "The Old Strathcona Business Association wanted a distinctive surface identity for Whyte Avenue that would survive Edmonton's harsh winters and the freeze-thaw cycles that destroy conventional pavement coatings.",
    solution:
      "StreetBond penetrating colour system in a warm arts-district palette applied at key intersections and plaza areas. Edmonton's sub-zero winters have tested the adhesion over four seasons with no delamination or significant colour fade.",
  },
  {
    id: "edmonton-valley-line",
    title: "Edmonton Valley Line LRT Station Crosswalks",
    city: "Edmonton",
    province: "AB",
    lat: 53.5352,
    lng: -113.4987,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/applications/crosswalks/crosswalks-02.jpg",
      "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
      "/images/applications/crosswalks/crosswalks-08.jpg",
    ],
    excerpt:
      "High-visibility thermoplastic crosswalks at all Valley Line LRT station approaches — engineered for Edmonton's -40°C winters.",
    problem:
      "Edmonton Transit needed crosswalk markings at new Valley Line stations that would perform reliably through prairie winters. Standard thermoplastics had failed at other Edmonton locations due to temperature-induced brittleness.",
    solution:
      "TrafficPatternsXD 150mil thermoplastic engineered for cold-climate performance, installed at all station approach crossings. The product's cold-weather flexibility specification was specifically tested for Edmonton's temperature range.",
  },
  {
    id: "lethbridge-cultural",
    title: "Lethbridge Cultural District Crosswalk",
    city: "Lethbridge",
    province: "AB",
    lat: 49.6954,
    lng: -112.8317,
    product: "DecoMark",
    application: "Community Branding",
    images: [
      "/images/products/decomark/decomark-05.jpg",
      "/images/applications/community-branding/community-branding-12.jpg",
      "/images/products/decomark/decomark-09.jpg",
    ],
    excerpt:
      "DecoMark custom thermoplastic crosswalk celebrating Lethbridge's Blackfoot cultural heritage at the gateway to the arts district.",
    problem:
      "The City of Lethbridge wanted a signature crosswalk acknowledging Blackfoot Confederacy heritage near the Galt Museum. The location required materials capable of handling Lethbridge's infamous chinook wind cycles and temperature swings.",
    solution:
      "DecoMark custom thermoplastic with Blackfoot-inspired geometric patterns developed in community consultation. The thermoplastic's flexibility handles the thermal expansion and contraction from Lethbridge's chinook cycles without cracking.",
  },
  // ── Saskatchewan ──────────────────────────────────────────────────────────
  {
    id: "saskatoon-bridge-city",
    title: "Saskatoon Bridge City Crosswalk Network",
    city: "Saskatoon",
    province: "SK",
    lat: 52.1332,
    lng: -106.6700,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/applications/crosswalks/crosswalks-06.jpg",
      "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
      "/images/applications/crosswalks/crosswalks-09.jpg",
    ],
    excerpt:
      "High-visibility 150mil crosswalk markings across Saskatoon's downtown core, engineered for prairie winters and heavy sand/salt maintenance.",
    problem:
      "Saskatoon's City of Bridges identity demanded high-quality pedestrian infrastructure, but the downtown crosswalks were failing rapidly from abrasive sand and salt maintenance that strips painted markings within weeks.",
    solution:
      "TrafficPatternsXD 150mil thermoplastic across the downtown network. The aggregate-embedded surface withstands aggressive sand blasting during winter maintenance events and maintains retroreflectivity through Saskatoon's deep-freeze winters.",
  },
  {
    id: "regina-wascana",
    title: "Regina Wascana Pathway Wayfinding",
    city: "Regina",
    province: "SK",
    lat: 50.4452,
    lng: -104.6189,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      "/images/products/streetbond/streetbond-06.png",
      "/images/applications/parks-paths/parks-paths-03.jpg",
      "/images/applications/parks-paths/parks-paths-07.jpg",
    ],
    excerpt:
      "StreetBond coloured pathway markers and directional zones throughout Wascana Centre's 930-hectare urban park.",
    problem:
      "Wascana Centre Authority needed durable wayfinding colour zones on its extensive pathway network to guide the 2+ million annual visitors. Conventional paint systems faded and chipped within one prairie season.",
    solution:
      "StreetBond penetrating colour treatment in distinct wayfinding zones, applied on the existing pathway surfaces. The system's UV stability handles the full exposure of the open prairie environment while bonding strongly to the variety of pathway surfaces in the park.",
  },
  // ── Manitoba ───────────────────────────────────────────────────────────────
  {
    id: "winnipeg-exchange-district",
    title: "Winnipeg Exchange District Heritage Streetscape",
    city: "Winnipeg",
    province: "MB",
    lat: 49.8990,
    lng: -97.1374,
    product: "StreetPrint",
    application: "Community Branding",
    images: [
      "/images/products/streetprint/streetprint-40.jpg",
      "/images/applications/community-branding/community-branding-04.jpg",
      "/images/products/streetprint/streetprint-05.jpg",
    ],
    excerpt:
      "Stamped asphalt pedestrian zones throughout the Exchange District National Historic Site — heritage aesthetic at infrastructure-grade durability.",
    problem:
      "The Exchange District BIZ wanted cobblestone-aesthetic streetscape improvements that could survive Winnipeg's extreme winters without the heave and settling that destroys actual cobblestone installations.",
    solution:
      "StreetPrint stamped asphalt in a heritage brick pattern with warm terracotta tones, applied over the existing asphalt base. The monolithic surface doesn't heave in Winnipeg's permafrost-level winters and has required zero maintenance through three winters.",
  },
  {
    id: "winnipeg-indigenous-garden",
    title: "Winnipeg Urban Indigenous Cultural Garden",
    city: "Winnipeg",
    province: "MB",
    lat: 49.8850,
    lng: -97.1552,
    product: "DecoMark",
    application: "Community Branding",
    images: [
      "/images/products/decomark/decomark-03.jpg",
      "/images/applications/community-branding/community-branding-11.jpg",
      "/images/products/decomark/decomark-08.jpg",
    ],
    excerpt:
      "Custom thermoplastic pathway art through Winnipeg's urban Indigenous cultural garden — permanent, low-maintenance, and developed in partnership with local Nations.",
    problem:
      "The City of Winnipeg needed permanent pathway art honouring the many First Nations represented in the city. Painted designs in previous installations failed within one winter, requiring costly annual reapplication.",
    solution:
      "DecoMark custom thermoplastic with imagery developed in collaboration with Anishinaabe, Cree, and Métis community artists. Heat-fused into the pathway surface, the installation has maintained crisp design integrity through Winnipeg's -40°C winters.",
  },
  // ── Québec ─────────────────────────────────────────────────────────────────
  {
    id: "montreal-plateau-art",
    title: "Montréal Plateau Ruelle Verte",
    city: "Montréal",
    province: "QC",
    lat: 45.5246,
    lng: -73.5851,
    product: "StreetBond",
    application: "Public Art",
    images: [
      "/images/products/streetbond/streetbond-02.png",
      "/images/applications/community-branding/community-branding-09.jpg",
      "/images/products/streetbond/streetbond-03.png",
    ],
    excerpt:
      "StreetBond public art in Montréal's Plateau-Mont-Royal laneways program — permanent colour that survives Quebec freeze-thaw cycles.",
    problem:
      "Montréal's ruelles vertes (green laneways) program identified painted surface art as a key activation tool, but the extreme freeze-thaw cycling typical of Montréal winters was destroying painted installations within one season.",
    solution:
      "StreetBond penetrating colour system applied to alley surfaces, bonding chemically to the asphalt and surviving Montréal's wet spring freeze-thaw cycles. Three Plateau laneways completed, each with artwork by local commissioned artists.",
  },
  {
    id: "montreal-rosemont-crosswalks",
    title: "Montréal Rosemont Vision Zéro Crosswalks",
    city: "Montréal",
    province: "QC",
    lat: 45.5432,
    lng: -73.5788,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/applications/crosswalks/crosswalks-03.jpg",
      "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
      "/images/applications/crosswalks/crosswalks-07.jpg",
    ],
    excerpt:
      "High-visibility preformed thermoplastic crosswalks across Rosemont–La Petite-Patrie as part of Montréal's Vision Zéro pedestrian safety strategy.",
    problem:
      "Rosemont–La Petite-Patrie borough was repainting crosswalks multiple times per year due to the abrasive combination of winter sand, salt, and snowplow operations. Annual maintenance costs exceeded $180K for the borough.",
    solution:
      "TrafficPatternsXD 150mil preformed thermoplastic at priority crossings throughout the borough. Retroreflectivity maintained through multiple Quebec winters, with maintenance costs reduced by over 80% compared to the paint program.",
  },
  {
    id: "quebec-city-st-roch",
    title: "Québec City St-Roch Heritage Crosswalks",
    city: "Québec City",
    province: "QC",
    lat: 46.8156,
    lng: -71.2166,
    product: "StreetPrint",
    application: "Crosswalks",
    images: [
      "/images/products/streetprint/streetprint-04.jpg",
      "/images/applications/crosswalks/crosswalks-04.jpg",
      "/images/products/streetprint/streetprint-08.jpg",
    ],
    excerpt:
      "Stamped asphalt crosswalks in Québec City's revitalized St-Roch neighbourhood, complementing the district's industrial heritage aesthetic.",
    problem:
      "The City of Québec wanted crosswalk treatments in the St-Roch arts district that matched the neighbourhood's industrial-heritage character without requiring the structural investment of stone or concrete paving.",
    solution:
      "StreetPrint stamped asphalt in a Belgian-block pattern with grey-charcoal pigment, installed at key pedestrian crossings. The decorative surface is compatible with Québec City's aggressive winter maintenance while delivering the heritage streetscape feel.",
  },
  {
    id: "laval-crosswalk",
    title: "Laval Carrefour Laval Pedestrian Network",
    city: "Laval",
    province: "QC",
    lat: 45.5674,
    lng: -73.6914,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/applications/crosswalks/crosswalks-02.jpg",
      "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
      "/images/applications/crosswalks/crosswalks-08.jpg",
    ],
    excerpt:
      "High-visibility crosswalk markings around Laval's major commercial corridor — high-durability thermoplastic engineered for Quebec's salt-intensive winter maintenance.",
    problem:
      "The city of Laval needed long-lasting crosswalk markings in its high-traffic commercial zones that could withstand the salt-intensive winter maintenance operations used on these priority routes.",
    solution:
      "TrafficPatternsXD 150mil thermoplastic at priority crossings. The chloride-resistant formulation handles Laval's aggressive winter road treatment while maintaining visibility at night through glass-bead retroreflectivity.",
  },
  // ── Atlantic Canada ────────────────────────────────────────────────────────
  {
    id: "halifax-waterfront",
    title: "Halifax Waterfront Boardwalk Crossings",
    city: "Halifax",
    province: "NS",
    lat: 44.6488,
    lng: -63.5752,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      "/images/products/streetbond/streetbond-04.png",
      "/images/applications/parks-paths/parks-paths-04.jpg",
      "/images/products/streetbond/streetbond-07.png",
    ],
    excerpt:
      "StreetBond anti-slip pathway treatments along Halifax's historic waterfront — engineered for salt air, heavy tourism foot traffic, and Nova Scotia winters.",
    problem:
      "Halifax's waterfront boardwalk crossings were hazardous in wet and icy conditions, with smooth asphalt surfaces causing frequent pedestrian falls. The exposed marine environment accelerated the failure of conventional coatings.",
    solution:
      "StreetBond with high-grit anti-slip aggregate applied to all boardwalk crossing zones. The water-based formula is resistant to marine salt spray and UV exposure, and the anti-slip surface has measurably reduced incident reports on the waterfront.",
  },
  {
    id: "moncton-main-street",
    title: "Moncton Main Street Pedestrian Priority Zone",
    city: "Moncton",
    province: "NB",
    lat: 46.0878,
    lng: -64.7782,
    product: "DecoMark",
    application: "Community Branding",
    images: [
      "/images/products/decomark/decomark-01.jpg",
      "/images/applications/community-branding/community-branding-01.jpg",
      "/images/products/decomark/decomark-04.jpg",
    ],
    excerpt:
      "Custom DecoMark thermoplastic crosswalks anchoring Moncton's Main Street revitalization — bilingual design reflecting the city's Acadian heritage.",
    problem:
      "The City of Moncton's Main Street revitalization needed signature crosswalk treatments that reflected Moncton's bilingual Acadian identity. Previous painted installations degraded within one New Brunswick winter.",
    solution:
      "DecoMark custom thermoplastic with a design referencing Acadian colours and geometric patterns. Heat-fused into the asphalt, the installation is a permanent expression of Moncton's cultural identity that requires no maintenance.",
  },
  {
    id: "charlottetown-crosswalk",
    title: "Charlottetown Confederation Landing Crosswalks",
    city: "Charlottetown",
    province: "PE",
    lat: 46.2382,
    lng: -63.1311,
    product: "StreetPrint",
    application: "Crosswalks",
    images: [
      "/images/products/streetprint/streetprint-03.jpg",
      "/images/applications/crosswalks/crosswalks-04.jpg",
      "/images/products/streetprint/streetprint-40.jpg",
    ],
    excerpt:
      "Decorative stamped asphalt crosswalks near Charlottetown's Confederation Landing, celebrating PEI's heritage character in the birthplace of Confederation.",
    problem:
      "Charlottetown's heritage waterfront district needed crosswalk treatments that matched the historic character of the area. Standard asphalt crosswalks looked out of place against the restored heritage storefronts and cobblestone sidewalks.",
    solution:
      "StreetPrint stamped asphalt in a classic cobblestone pattern with PEI red-soil-inspired pigment, creating crosswalks that feel native to the heritage district. The surface has handled PEI's maritime freeze-thaw cycles with no delamination.",
  },
  {
    id: "st-johns-downtown",
    title: "St. John's Jellybean Row Crosswalks",
    city: "St. John's",
    province: "NL",
    lat: 47.5615,
    lng: -52.7126,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/applications/crosswalks/crosswalks-06.jpg",
      "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
      "/images/applications/crosswalks/crosswalks-09.jpg",
    ],
    excerpt:
      "High-visibility thermoplastic crosswalks in downtown St. John's — engineered for Newfoundland's extreme maritime winters and aggressive road salting.",
    problem:
      "Downtown St. John's crosswalks faced the most aggressive maintenance environment in Canada — frequent heavy snowfall, ocean salt spray, and the highest road salt application rates in Atlantic Canada. Painted crosswalks required 4–5 repaints annually.",
    solution:
      "TrafficPatternsXD 150mil thermoplastic at priority crossings in the downtown core. The cold-weather formulation handles Newfoundland's deep freeze, and the chloride-resistant aggregate maintains retroreflectivity through the intense salt exposure. Annual repaints eliminated.",
  },
];
