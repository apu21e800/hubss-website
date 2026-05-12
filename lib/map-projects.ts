export interface MapProject {
  id: string;
  title: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  product: string;
  application: string;
  /** Install year as a 4-digit string. Optional — popup hides the year line gracefully when undefined. */
  year?: string;
  images: string[];
  excerpt: string;
  problem: string;
  solution: string;
}

// Curated 2026-05-12 per Vernon: ONLY projects where we have a verified image-to-location
// correlation (typically via a dedicated blog post + featured image in /public/images/blog/<slug>/).
// All earlier generic-stock entries removed — better to show fewer real projects than a long list
// with stand-in photography.
export const mapProjects: MapProject[] = [
  // ── Ontario ────────────────────────────────────────────────────────────────
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
      "/images/blog/imprinted-asphalt-york-transit/featured.jpg",
    ],
    excerpt:
      "VIVA rapid transit corridor receives MMAX red resin bus lane demarcation — fast-cure overnight installation across the Hwy 7 rapidway.",
    problem:
      "The VIVA BRT expansion required consistent, high-durability bus lane markings across the Hwy 7 rapidway. Short traffic closure windows demanded fast-cure materials.",
    solution:
      "MMAX MMA resin installed during night closures, fully cured before morning rush. The MMA chemistry cures in under an hour and bonds chemically to the concrete and asphalt surfaces.",
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
      "/images/blog/veterans-crosswalk-kitchener/featured.jpeg",
    ],
    excerpt:
      "Custom DecoMark thermoplastic crosswalk honouring Kitchener's veterans at the city cenotaph — poppy motifs in regimental colours.",
    problem:
      "The City of Kitchener wanted a permanent public art installation at the cenotaph crosswalk that would honour veterans without requiring annual maintenance. Painted designs had faded within one season.",
    solution:
      "DecoMark custom preformed thermoplastic with full Pantone-matched colour — poppy motifs in regimental red, fused directly to asphalt. The installation has maintained sharp colour and edge definition through four winters.",
  },
  {
    id: "collingwood-rainbow",
    title: "Collingwood Rainbow Crosswalk",
    city: "Collingwood",
    province: "ON",
    lat: 44.5001,
    lng: -80.2168,
    product: "StreetBond",
    application: "Community Branding",
    images: [
      "/images/blog/simcoe-rainbow-crosswalk/featured.jpg",
    ],
    excerpt:
      "Pride crosswalk installation delivering permanent rainbow colour that survives snowplows and de-icing chemicals.",
    problem:
      "The town needed a pride crosswalk that would survive Ontario winters — previous installations used paint and faded or chipped within one season, requiring costly annual repaints.",
    solution:
      "StreetBond multi-colour installation with each stripe applied as a separate coloured coating pass. The system bonds to asphalt and is engineered to withstand plow blades and calcium chloride.",
  },
  {
    id: "georgina-every-child-matters",
    title: "Every Child Matters Crosswalk",
    city: "Georgina",
    province: "ON",
    lat: 44.2928,
    lng: -79.4547,
    product: "TrafficPatterns",
    application: "Community Branding",
    year: "2021",
    images: [
      "/images/blog/every-child-matters-crosswalk/featured.png",
    ],
    excerpt:
      "A TrafficPatterns thermoplastic crosswalk in York Region's Town of Georgina honouring the Every Child Matters movement — permanent colour that survives Ontario winters.",
    problem:
      "The Town of Georgina sought a durable way to honour the Every Child Matters movement in a public space that would be visible year-round without requiring annual maintenance.",
    solution:
      "TrafficPatterns preformed thermoplastic in orange and white, heat-fused to the asphalt crosswalk surface. The installation maintains sharp colour and edge definition through freeze-thaw cycles and snowplow contact.",
  },
  {
    id: "toronto-humberwest-crosswalk",
    title: "Humberwest Parkway Decorative Crosswalk & Median",
    city: "Toronto",
    province: "ON",
    lat: 43.7350,
    lng: -79.5784,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/blog/decorative-crosswalk-meridian/featured.jpg",
    ],
    excerpt:
      "StreetBond 150 and TrafficPatternsXD combine to create a decorative crosswalk and median treatment on Humberwest Parkway in Toronto's west end.",
    problem:
      "The Humberwest Parkway corridor needed a decorative crosswalk and median treatment that could withstand heavy vehicle turning movements and aggressive winter maintenance without the maintenance overhead of concrete pavers.",
    solution:
      "TrafficPatternsXD for the crosswalk field — aggregate-reinforced and virtually flush with the asphalt — paired with StreetBond 150 coloured coating on the median. Both systems are snowplow-safe and require no repainting.",
  },
  {
    // TODO: Vernon to confirm exact corridor location + locate image for East London Link BRT
    id: "london-east-brt",
    title: "East London Link — Bus Rapid Transit",
    city: "London",
    province: "ON",
    lat: 42.9836,
    lng: -81.2200,
    product: "MMAX",
    application: "Bus & Bike Lanes",
    images: [
      "/images/projects/_placeholder.svg",
    ],
    excerpt:
      "MMAX MMA resin bicycle lanes and TrafficPatternsXD crosswalks on London's East London Link BRT corridor — fast-cure installation with minimal transit disruption.",
    problem:
      "London's East London Link required surface solutions capable of withstanding heavy transit wear while supporting safe cycling integration on a busy BRT corridor.",
    solution:
      "MMAX MMA resin applied to define bicycle lanes — fast cure, slip-resistant, and vibrant. TrafficPatternsXD installed at pedestrian conflict zones for high-traction, long-life crosswalk markings through Ontario freeze-thaw cycles.",
  },
  {
    // TODO: Vernon to locate project image for City of Vaughan TrafficPatternsXD crosswalks
    id: "vaughan-complete-streets",
    title: "City of Vaughan Complete Streets Crosswalks",
    city: "Vaughan",
    province: "ON",
    lat: 43.8361,
    lng: -79.4987,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/projects/_placeholder.svg",
    ],
    excerpt:
      "TrafficPatternsXD crosswalks across Vaughan's high-volume arterials — aggregate-reinforced thermoplastic engineered to withstand heavy traffic and aggressive winter clearing.",
    problem:
      "Vaughan's arterial crosswalks see some of York Region's heaviest vehicle counts. Standard paint and thermoplastic markings were failing within one to two seasons under snowplow contact.",
    solution:
      "TrafficPatternsXD's virtually-flush, aggregate-reinforced structure installs as an 8+ year solution. The material resists snowplow blades, retains retroreflectivity, and requires no annual maintenance cycle.",
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
      "/images/blog/decorative-crosswalk-commercial-drive/featured.jpg",
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
    product: "TrafficPatterns",
    application: "Community Branding",
    images: [
      "/images/blog/ubc-musqueam-crosswalk/featured.jpg",
    ],
    excerpt:
      "A ceremonial crosswalk honouring the Musqueam Nation's traditional territory, featuring Coast Salish art installed at University Boulevard and Wesbrook Mall.",
    problem:
      "UBC sought to embed cultural recognition into the physical campus landscape in a way that was permanent, respectful, and visible year-round — not a plaque or sign but part of the surface itself.",
    solution:
      "Custom preformed thermoplastic with Coast Salish pattern templates developed with Musqueam cultural advisors. The crosswalk acts as a daily reminder of the land acknowledgement, embedded in the path every student and faculty member walks.",
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
      "/images/blog/laneway-project/featured.png",
    ],
    excerpt:
      "Vancouver laneways transformed into vibrant public art corridors using StreetBond coloured pavement systems.",
    problem:
      "Vancouver's More Awesome Now program identified underused laneways as candidates for public realm activation. Traditional mural paint on asphalt failed rapidly under traffic and weather.",
    solution:
      "StreetBond's coloured coating system allowed bold graphic patterns to be rolled directly onto asphalt, surviving foot traffic and light vehicle loading.",
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
      "/images/blog/richmond-brighouse-crosswalk/featured.jpeg",
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
      "/images/blog/complete-streets-new-westminster/featured.jpg",
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
      "/images/blog/white-rock-pier-crosswalk/featured.png",
    ],
    excerpt:
      "Coastal crosswalk installation near White Rock's iconic pier — durable thermoplastic engineered for salt air and heavy summer tourist traffic.",
    problem:
      "White Rock's Marine Drive crosswalks endure intense summer pedestrian loads, salt spray, and sandy conditions that accelerate wear on painted markings.",
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
      "/images/blog/tsain-ko-crosswalk-sechelt/featured.jpg",
    ],
    excerpt:
      "Custom thermoplastic crosswalk featuring shíshálh Nation (Sechelt) cultural imagery — a permanent expression of reconciliation on the Sunshine Coast.",
    problem:
      "The District of Sechelt and shíshálh Nation wanted a crosswalk that honoured Indigenous culture at the gateway to the community. Painted designs would fade within a season in the coastal climate.",
    solution:
      "DecoMark custom thermoplastic with shíshálh-inspired design elements, developed with Nation leadership. Pantone-accurate colours fused into the surface — weather-resistant and maintenance-free for years.",
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
      "/images/blog/spirit-trail-wayfinding-vancouver/featured.jpg",
    ],
    excerpt:
      "StreetBond wayfinding colours embedded into North Vancouver's Spirit Trail, guiding cyclists and pedestrians across the waterfront network.",
    problem:
      "The Spirit Trail greenway lacked consistent visual wayfinding, causing confusion at key decision points. Painted signage faded quickly on the exposed waterfront path.",
    solution:
      "StreetBond in designated wayfinding colours at key intersections along the Spirit Trail. The coloured coating bonds to the existing path surface and resists fading under UV and wet conditions common on the North Shore.",
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
      "/images/blog/terry-fox-plaza-coquitlam/featured.jpg",
    ],
    excerpt:
      "Stamped and coloured asphalt plaza honouring Terry Fox — a civic centrepiece blending heritage aesthetic with low-maintenance pavement technology.",
    problem:
      "The City of Coquitlam was planning the Terry Fox commemorative plaza and needed a surface that could carry the weight of civic significance without requiring annual restoration budgets.",
    solution:
      "StreetPrint stamped asphalt in a cobblestone pattern with warm terracotta pigment, creating a heritage plaza feel at a fraction of the cost of concrete pavers.",
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
      "/images/blog/bowen-island-asphalt-path/featured.jpg",
    ],
    excerpt:
      "StreetBond coloured pathway linking Bowen Island's ferry terminal to the village centre — slip-resistant and environmentally sensitive.",
    problem:
      "Bowen Island's foreshore path needed a coloured surface treatment that would stand up to heavy rainfall and salt air, while meeting the community's environmental standards for waterway proximity.",
    solution:
      "StreetBond's water-based system with anti-slip aggregate, applied in a natural green-grey tone that complements the coastal landscape.",
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
      "/images/blog/bc-childrens-hospital-labyrinth/featured.jpg",
    ],
    excerpt:
      "A meditative walking labyrinth on BC Children's Hospital grounds — permanent coloured pavement designed as a healing garden feature.",
    problem:
      "BC Children's Hospital wanted a therapeutic labyrinth in their outdoor healing garden. The design needed to be durable enough for daily use, visually distinct, and zero-maintenance given hospital grounds staffing constraints.",
    solution:
      "StreetBond in two complementary colours defines the labyrinth path and surround on the existing asphalt. The application required precise template masking to achieve the geometric design.",
  },
  {
    id: "sechelt-pictograph-crosswalk",
    title: "Pictograph Crosswalk — Cowrie St & Trail Ave",
    city: "Sechelt",
    province: "BC",
    lat: 49.4745,
    lng: -123.7572,
    product: "TrafficPatterns",
    application: "Community Branding",
    year: "2022",
    images: [
      "/images/blog/pictograph-crosswalk-sechelt/featured.jpg",
    ],
    excerpt:
      "Indigenous artists Dionne Paul and Lindsey Kyoko Adams created a pictograph-themed crosswalk at Cowrie St & Trail Ave in Sechelt, telling the origin story of the shíshálh Nation.",
    problem:
      "The District of Sechelt commissioned two artists — one with Indigenous pictograph motifs, one with a bee and dogwood pollinator theme — to create crosswalks that would celebrate community identity without the maintenance burden of paint.",
    solution:
      "TrafficPatterns preformed thermoplastic capturing fine artistic detail. The panels are heat-fused to the asphalt, maintaining crisp colour and edge definition through the Sunshine Coast's wet coastal seasons.",
  },
  {
    id: "pitt-meadows-natures-walk",
    title: "Nature's Walk Roadway Accents",
    city: "Pitt Meadows",
    province: "BC",
    lat: 49.2318,
    lng: -122.6897,
    product: "StreetPrint",
    application: "Community Branding",
    year: "2021",
    images: [
      "/images/blog/roadway-accents-natures-walk/featured.jpg",
    ],
    excerpt:
      "StreetPrint stamped asphalt and StreetBond pavement coating create decorative roadway accents throughout the Nature's Walk development in Pitt Meadows, BC.",
    problem:
      "The Nature's Walk residential development in Pitt Meadows needed decorative roadway treatments that would distinguish the community from standard subdivision streetscapes without the long-term maintenance of brick or concrete pavers.",
    solution:
      "StreetPrint in-place stamped asphalt for decorative crossings and entry points, combined with StreetBond coloured coating for pedestrian zones. The flush surface is snowplow-safe and requires no annual maintenance.",
  },
  {
    id: "white-rock-seaside-stroll",
    title: "White Rock Seaside Stroll — Johnston Rd",
    city: "White Rock",
    province: "BC",
    lat: 49.0284,
    lng: -122.8040,
    product: "TrafficPatterns",
    application: "Community Branding",
    images: [
      "/images/blog/white-rock-langley-trafficpatterns/featured.jpg",
    ],
    excerpt:
      "Artist Amy Bao's wave-inspired crosswalk mural on Johnston Road — TrafficPatterns thermoplastic that brought the White Rock waterfront identity into the Uptown district.",
    problem:
      "White Rock's Uptown district lacked the visual character of the iconic waterfront. The city commissioned artist Amy Bao to design a crosswalk connecting Uptown to the coast's identity. Painted murals had previously faded within months.",
    solution:
      "TrafficPatterns preformed thermoplastic panels capturing Bao's flowing wave motifs in permanent, UV-stable colour. The installation drove a reported 40% increase in Uptown foot traffic in its first season.",
  },
  {
    // TODO: Vernon to locate project image for Langley Railroad Heritage Crosswalk at Linwood Park
    id: "langley-railroad-heritage",
    title: "Langley Railroad Heritage Crosswalk",
    city: "Langley City",
    province: "BC",
    lat: 49.1027,
    lng: -122.6600,
    product: "TrafficPatterns",
    application: "Community Branding",
    year: "2025",
    images: [
      "/images/projects/_placeholder.svg",
    ],
    excerpt:
      "Railroad tie-and-rail pattern crosswalk at the entrance to Linwood Park, Langley City — connecting modern pedestrian infrastructure to the Fraser Valley's railway heritage.",
    problem:
      "Langley City wanted to mark the gateway to Linwood Park with a design that honoured the city's railway roots. Painted surfaces would fail quickly under the foot traffic of an active park entrance.",
    solution:
      "TrafficPatterns preformed thermoplastic in a railroad tie-and-rail pattern — tan rectangular panels and white lines fused permanently to the asphalt. Installed by Square One Paving in March 2025.",
  },
  {
    id: "langley-murrayville-reunion",
    title: "Reunion Housing Complex Sidewalks",
    city: "Langley",
    province: "BC",
    lat: 49.0944,
    lng: -122.5846,
    product: "DecoMark",
    application: "Community Branding",
    year: "2020",
    images: [
      "/images/blog/murrayville-schoolhouse-sidewalk/featured.jpg",
    ],
    excerpt:
      "Decorative asphalt sidewalks at the Reunion Housing Complex in Murrayville, Langley — DecoMark thermoplastic decals adding classic design character to a new residential community.",
    problem:
      "The Reunion Housing Complex in Murrayville needed decorative sidewalk treatments that would differentiate the development from standard residential streetscapes and hold up to year-round pedestrian use.",
    solution:
      "DecoMark custom thermoplastic decals surface-applied to the existing asphalt sidewalks. The UV-stable graphics are designed to last 6–8 times longer than paint and require no special maintenance.",
  },

  // ── More Ontario ───────────────────────────────────────────────────────────
  {
    id: "toronto-leslieville-laneway",
    title: "Leslieville Laneway Revitalization",
    city: "Toronto",
    province: "ON",
    lat: 43.6590,
    lng: -79.3342,
    product: "StreetBond",
    application: "Public Art",
    year: "2023",
    images: [
      "/images/blog/municipalities-case-study/featured.jpg",
    ],
    excerpt:
      "City of Toronto and the Laneway Project non-profit used StreetBond150 to transform a Leslieville back lane into a vibrant, welcoming public space — bold colour patterns that survive foot traffic and weather.",
    problem:
      "Toronto's Leslieville laneway was an underused service corridor. The Laneway Project needed a durable surface treatment that could withstand daily foot traffic while delivering bold, welcoming aesthetics.",
    solution:
      "StreetBond150 applied in bold geometric patterns directly to the asphalt lane surface. The MMA-grade bonding survives heavy foot traffic and Toronto winters without repainting.",
  },
  {
    id: "toronto-emery-village",
    title: "Emery Village BIA Crosswalk Restoration",
    city: "Toronto",
    province: "ON",
    lat: 43.7556,
    lng: -79.5662,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    year: "2020",
    images: [
      "/images/blog/decorative-asphalt-high-traffic/featured.jpg",
    ],
    excerpt:
      "Emery Village BIA replaced failing unit pavers with TrafficPatternsXD — matching the original 'Emery Blue' design in aggregate-reinforced thermoplastic that handles heavy commercial truck loads.",
    problem:
      "Twelve-year-old coloured unit pavers at the Emery Village BIA gateway were failing under heavy truck traffic, requiring constant patching. The BIA needed a permanent solution that preserved the community's 'Emery Blue' design identity.",
    solution:
      "TrafficPatternsXD across 440 m² of crossings, Pantone-matched to Emery Blue. The monolithic thermoplastic bond to asphalt eliminated joint failure and edge displacement — the mechanisms that had destroyed the pavers.",
  },
  {
    id: "toronto-ttc-bus-corridors",
    title: "TTC Bus Priority Corridors",
    city: "Toronto",
    province: "ON",
    lat: 43.6532,
    lng: -79.3832,
    product: "MMAX",
    application: "Bus & Bike Lanes",
    images: [
      "/images/blog/extending-transit-lane-lifespan/featured.jpg",
    ],
    excerpt:
      "MMAX MMA red bus lane coatings across TTC's busiest priority corridors — overnight installs that cure before morning service, eliminating the repainting cycle.",
    problem:
      "Toronto's TTC bus priority corridors required constant repainting under high axle loads and aggressive snowplow operations. Each repainting cycle caused service disruptions and lane closures.",
    solution:
      "MMAX MMA coatings applied during overnight windows, traffic-ready before morning rush. The MMA chemistry bonds to asphalt and resists the lateral shear forces from bus turning movements that defeat standard acrylic coatings.",
  },
  {
    id: "burlington-spencer-smith",
    title: "Spencer Smith Park Lakeshore Promenade",
    city: "Burlington",
    province: "ON",
    lat: 43.3261,
    lng: -79.7984,
    product: "StreetBond",
    application: "Parks & Paths",
    year: "2017",
    images: [
      "/images/blog/pedestrian-channelization-public-spaces/featured.jpg",
    ],
    excerpt:
      "5,600 m² of StreetBond150 Cobalt Blue on Burlington's Spencer Smith Park lakeshore promenade — durable, skid-resistant surface coating replacing the original StreetPrint installation after 20 years.",
    problem:
      "Spencer Smith Park's StreetPrint lakeshore promenade had reached the end of its 20-year lifecycle under Lake Ontario's harsh winters. The city needed a replacement surface that could handle the Canada Rib Fest crowds and year-round lakefront conditions.",
    solution:
      "New asphalt base topped with 5,600 m² of StreetBond150 in Cobalt Blue — fast-install, skid-free, and accessible. No stamping this time; the colour coating alone delivers the visual identity the park requires.",
  },
  {
    id: "waterloo-grandlinq-lrt",
    title: "GrandLinq ION LRT Platform Crossings",
    city: "Waterloo",
    province: "ON",
    lat: 43.4668,
    lng: -80.5164,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/blog/safety-durability-transit-stations/featured.jpg",
    ],
    excerpt:
      "TrafficPatternsXD at LRT platform edges, pedestrian crossings, and modal transition points across the ION corridor — high-traction, fade-resistant surfacing through Waterloo Region winters.",
    problem:
      "GrandLinq's ION LRT corridor needed platform-edge and crossing treatments that could withstand year-round freeze-thaw cycling, de-icing salts, and the lateral forces from LRT and bus movements without service disruption.",
    solution:
      "TrafficPatternsXD installed phased overnight applications across the ION corridor. Aggregate-reinforced thermoplastic maintained high-contrast visibility and BPN 65+ traction through multiple consecutive winters.",
  },
  {
    id: "kitchener-cadillac-fairview",
    title: "Cadillac Fairview Parking Lot — Kitchener",
    city: "Kitchener",
    province: "ON",
    lat: 43.4337,
    lng: -80.4797,
    product: "TrafficPatternsXD",
    application: "Parking Lots",
    year: "2021",
    images: [
      "/images/blog/stamped-asphalt-parking-lot/featured.jpg",
    ],
    excerpt:
      "TrafficPatternsXD crosswalks and traffic calming devices at Cadillac Fairview Kitchener — aggregate-reinforced thermoplastic delivering brick-like aesthetics and lasting safety markings across a high-volume retail parking lot.",
    problem:
      "Cadillac Fairview's Kitchener shopping centre needed pedestrian crosswalk treatments that could withstand year-round vehicle traffic and snowplow operations without the maintenance liability of traditional paint or unit pavers.",
    solution:
      "TrafficPatternsXD brick-pattern crosswalks heat-fused to the asphalt surface — no raised edges, no repainting, and a visual quality consistent with a premium retail environment.",
  },
  {
    id: "vaughan-woodbridge-heritage",
    title: "Woodbridge Avenue Heritage Crosswalks",
    city: "Vaughan",
    province: "ON",
    lat: 43.7935,
    lng: -79.5701,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/blog/trafficpatternsxd-urban-design/featured.jpg",
    ],
    excerpt:
      "Heritage Conservation District crosswalks on Woodbridge Avenue — TrafficPatternsXD brick-pattern thermoplastic that satisfies the character requirements of a designated heritage streetscape while surviving Canadian winters.",
    problem:
      "The City of Vaughan's Woodbridge Avenue streetscape improvement required crosswalks matching the Heritage Conservation District character. Real brick pavers were ruled out — snowplow blades displace them, making them an ongoing maintenance liability.",
    solution:
      "TrafficPatternsXD in a brick-pattern flush-to-surface profile: visually indistinguishable from masonry at street level, snowplow-safe, and specified by the City's Urban Design team for all pedestrian crosswalks on the project.",
  },

  // ── More British Columbia ──────────────────────────────────────────────────
  {
    id: "coquitlam-windsor-gate",
    title: "Windsor Gate Masterplanned Community",
    city: "Coquitlam",
    province: "BC",
    lat: 49.2660,
    lng: -122.7575,
    product: "StreetPrint",
    application: "Community Branding",
    images: [
      "/images/blog/community-branding-case-study/featured.jpg",
    ],
    excerpt:
      "Polygon Realty's Windsor Gate community in Coquitlam — StreetPrint stamped asphalt roadways and driveways creating brick-street aesthetics that reinforce the community's identity throughout.",
    problem:
      "Polygon Realty needed roadways and driveways at Windsor Gate that would communicate premium residential quality and a cohesive community identity — without the long-term maintenance liability of real brick or stone.",
    solution:
      "StreetPrint genuine stamped asphalt with the community's logo mark integrated into key surfaces. The tricolour design and brick-pattern stamping create an immediate sense of entry and place throughout the development.",
  },
  {
    id: "kelowna-crosswalk-network",
    title: "City of Kelowna Crosswalk Network",
    city: "Kelowna",
    province: "BC",
    lat: 49.8880,
    lng: -119.4958,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/blog/performance-crosswalks-asphalt-concrete/featured.jpg",
    ],
    excerpt:
      "80+ TrafficPatternsXD crosswalks installed across Kelowna's city core over 13 years — one of Canada's largest single-city thermoplastic crosswalk programs.",
    problem:
      "Kelowna began investing in active transportation infrastructure and needed crosswalk treatments that could handle Okanagan summers and winters while supporting the city's aesthetic and safety goals across dozens of locations.",
    solution:
      "TrafficPatternsXD became Kelowna's standard crosswalk specification. Over 13 years, 80+ crosswalks were installed city-wide with documented performance superior to painted alternatives and zero edge-damage from snowplow operations.",
  },
  {
    id: "victoria-david-foster-pathway",
    title: "David Foster Harbour Pathway",
    city: "Victoria",
    province: "BC",
    lat: 48.4201,
    lng: -123.3656,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      "/images/blog/pedestrian-channelization-public-spaces/featured.jpg",
    ],
    excerpt:
      "StreetBond Safety Blue along Victoria's David Foster Harbour Pathway — five kilometres connecting Rock Bay to Ogden Point, celebrating Lekwungen First Nations history and the working harbour.",
    problem:
      "Victoria's Inner Harbour pathway renovation needed a surface treatment that would hold vibrant colour in a high-humidity marine environment while remaining slip-resistant for cyclists and pedestrians year-round.",
    solution:
      "StreetBond in high-visibility Safety Blue — water-based, slip-resistant coating applied along the full 5 km+ pathway. The coastal environment has not degraded the surface colour or friction performance since installation.",
  },

  // ── Québec ─────────────────────────────────────────────────────────────────
  {
    id: "montreal-guido-nincheri",
    title: "Parc Guido-Nincheri Promenade",
    city: "Montréal",
    province: "QC",
    lat: 45.5600,
    lng: -73.5490,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      "/images/blog/pedestrian-channelization-public-spaces/featured.jpg",
    ],
    excerpt:
      "StreetBond150 over concrete at Parc Guido-Nincheri's promenade Ville-de-Québec — bold flowing lines designed by Civiliti as a gateway to Space for Life and the Olympic Park.",
    problem:
      "Civiliti's landscape design for the promenade required a surface coating that could reproduce flowing organic line-work in vivid colour on concrete, adjacent to major institutional landmarks, and survive Montréal winters.",
    solution:
      "StreetBond150 applied over concrete substrate in the promenade's architectural colour palette. The coating bonds permanently to the concrete and has maintained its flow-line design through multiple freeze-thaw seasons.",
  },

  // ── Alberta ────────────────────────────────────────────────────────────────
  {
    // TODO: Vernon to locate project image for Calgary MAX BRT corridor
    id: "calgary-max-brt",
    title: "Calgary MAX BRT Corridor",
    city: "Calgary",
    province: "AB",
    lat: 51.0447,
    lng: -114.0719,
    product: "MMAX",
    application: "Bus & Bike Lanes",
    images: [
      "/images/projects/_placeholder.svg",
    ],
    excerpt:
      "MMAX MMA bus lane surfacing on Calgary Transit's MAX BRT network — fast-cure MMA coatings in red and green applied overnight to keep Calgary's rapid transit corridors visually legible through prairie winters.",
    problem:
      "Calgary Transit's MAX BRT corridors needed bus lane coatings that could withstand Alberta's temperature extremes — from -40°C winters to +35°C summers — without the adhesion failures that defeat standard acrylic coatings.",
    solution:
      "MMAX MMA two-component coating system applied during overnight closures. MMA chemistry cures in 30–60 minutes regardless of ambient temperature, making it uniquely suited to Alberta's unpredictable installation conditions.",
  },
  {
    // TODO: Vernon to locate project image for Edmonton Valley Line LRT
    id: "edmonton-valley-line-lrt",
    title: "Edmonton Valley Line LRT Crossings",
    city: "Edmonton",
    province: "AB",
    lat: 53.5355,
    lng: -113.4907,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/projects/_placeholder.svg",
    ],
    excerpt:
      "TrafficPatternsXD pedestrian crossings and platform markings along Edmonton's Valley Line LRT — high-traction thermoplastic engineered for Edmonton's severe freeze-thaw cycles.",
    problem:
      "Edmonton's Valley Line LRT at-grade crossings required high-traction, long-life surface markings at pedestrian conflict zones. The city's severe winter conditions — more than 60 freeze-thaw cycles per year — eliminate standard paint within a season.",
    solution:
      "TrafficPatternsXD heat-fused thermoplastic at key crossings and platform zones along the Valley Line. The aggregate-reinforced system maintains BPN 65+ traction and full retroreflectivity through Edmonton's winter cycle without repainting.",
  },
];
