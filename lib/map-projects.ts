// lib/map-projects.ts — the homepage project map's dataset.
//
// Two sources, merged at the bottom of this file: the curated entries below,
// and pins generated from blog posts by scripts/gen-map-blog.mjs.
import blogMap from "./map-blog-projects.json";
import blogIndex from "./blog-index.json";

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
  /**
   * May be empty. A pin whose job is real but has no honest photo shows none
   * (Sep 2026): the map draws a plain card instead of a stand-in.
   */
  images: string[];
  /**
   * True when images[] shows representative HUB work in the same product +
   * application — NOT this exact installation. Set while Vernon locates the
   * real project photo (see the TODO on each entry). The popup and modal
   * render a "Representative" tag whenever this is set, honouring the
   * May 2026 rule that stand-in photography must never pass as the project.
   * Since Sep 2026 a stand-in comes from the gallery of the pin's own system
   * (see `gallery` below) and shows no street sign, landmark or other pin.
   * Unused since 28 Sep 2026: every photo on the map is now of its own job,
   * and a pin with no such photo shows none. Kept so the tag still works if
   * a stand-in is ever reintroduced with Doug's say-so.
   */
  imageIsRepresentative?: boolean;
  excerpt: string;
  problem: string;
  solution: string;
  /**
   * The blog post this project is written up in, if there is one. Set
   * automatically — never by hand. For curated entries it is inferred from the
   * image path (a pin whose photo lives in /images/blog/<slug>/ IS that post's
   * pin, which is how the link was expressed long before anything could read
   * it); for blog-derived entries it is the post itself.
   */
  slug?: string;
  /**
   * Curated entries only, and only when the photo cannot come from the post's
   * folder: the slug of the post the pin is written up in. It becomes `slug`
   * when that post is published, like the inferred link.
   */
  post?: string;
}

/**
 * A photo from a product or application gallery, by its Sanity asset file
 * name. Used where a gallery holds a copy of the job's own photo (the same
 * one-off design, or the landmark the post names), and loaded from Sanity's
 * CDN like the galleries are, so none of them adds work for /_next/image.
 * The comment beside each call names the /public original.
 */
const gallery = (file: string) => `https://cdn.sanity.io/images/9dbro2m1/production/${file}`;

// Audited 28 Sep 2026 (Vern: "map only real projects with geographical locations, lots of
// accurate images ... no fake locations"). A pin stays only when a published Insights post
// documents that job at that place, and every photo on a pin is of that installation: the
// post's own photos, or a gallery copy that shows the same one-off design or the landmark the
// post names. The 25 pins that rested on "representative" stand-ins (Alberta, Saskatchewan,
// Manitoba, Atlantic Canada, Ottawa, Mississauga, Hamilton, Windsor, Burnaby, Nanaimo,
// Kamloops, Victoria Chinatown, four in Québec) had no post and no photo behind them, and
// went, with Vaughan's city-wide pin (one line in a guide, no site). Each pin sits at the
// site the post names; where the post names only a town or a corridor, the comment says so.
// No pin carries a stand-in photo any more, so `imageIsRepresentative` is unused.
const curatedProjects: MapProject[] = [
  // ── Ontario ─────────────────────────────────────────────────────────────────
  {
    // Post: multimodal-connectivity-york-region (30+ intersections on the Highway 7
    // Rapidway). The photo is the VIVA rapidway (station canopy, VIVA banner), from
    // imprinted-asphalt-york-transit, the archived profile of the same job. Place: on
    // Highway 7 in Markham, approximate; the post names the corridor, not one crossing.
    id: "york-region-viva",
    title: "York Region Hwy 7 VIVA BRT Corridor",
    city: "York Region",
    province: "ON",
    lat: 43.8547,
    lng: -79.3376,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/blog/imprinted-asphalt-york-transit/featured.jpg",
    ],
    post: "multimodal-connectivity-york-region",
    excerpt:
      "TrafficPatternsXD at more than 30 intersections on the Highway 7 Rapidway, York Region's VIVA bus rapid transit corridor: bus stop platforms, crosswalks and the points where buses, cyclists and pedestrians meet.",
    problem:
      "Markings at the corridor's stations and intersections were inconsistent, lane demarcations in bus zones had faded, crossings and curbside platforms were slippery in wet and winter weather, and repainting costs kept rising.",
    solution:
      "TrafficPatternsXD, a preformed thermoplastic with embedded aggregate for traction, at bus stop platforms and crosswalks, at modal transition points, and as lane definition in bus priority zones.",
  },
  {
    // Post table: "East Ave entrance to the Kitchener Memorial Auditorium". Pin at the
    // Aud. Second photo: traffic-patterns-87, the same "Lest We Forget" crossing.
    id: "kitchener-veterans",
    title: "Kitchener Veterans Memorial Crosswalk",
    city: "Kitchener",
    province: "ON",
    lat: 43.4472,
    lng: -80.4670,
    product: "TrafficPatterns",
    application: "Community Branding",
    images: [
      "/images/blog/veterans-crosswalk-kitchener/featured.jpeg",
      gallery("f087d863ecf32b94df3db6baab1e4922e0f45fc4-2400x1800.jpg"), // products/traffic-patterns/traffic-patterns-87.jpg
    ],
    excerpt:
      "Kitchener's Veterans Crosswalk at the East Avenue entrance to the Kitchener Memorial Auditorium, a living memorial: a permanent Remembrance Day tribute in TrafficPatterns thermoplastic.",
    problem:
      "The City of Kitchener and its partners, two Legion branches and the Royal Highland Fusiliers, wanted a permanent Remembrance Day tribute on a route people use every day, in a material that would outlast paint.",
    solution:
      "TrafficPatterns preformed thermoplastic in a high-contrast commemorative pattern, heat-bonded to the asphalt by MultiSeal during off-peak work and back in service ahead of Remembrance Day.",
  },
  {
    // The post places it "in the heart of Simcoe" and names no street, so the pin
    // sits at the town centre. No year: the post gives none (2023 had no source).
    id: "simcoe-rainbow",
    title: "Simcoe Pride Rainbow Crosswalk",
    city: "Simcoe",
    province: "ON",
    lat: 42.8372,
    lng: -80.3039,
    product: "TrafficPatternsXD",
    application: "Community Branding",
    images: [
      "/images/blog/simcoe-rainbow-crosswalk/featured.jpg",
    ],
    excerpt:
      "A young resident's two-year fundraising campaign became a Pride rainbow crosswalk in the heart of Simcoe, in high-traction TrafficPatternsXD installed by Multiseal.",
    problem:
      "Ryder, a young Simcoe resident, wanted a rainbow crosswalk like the ones she had seen in neighbouring communities, and spent two years raising the money with local people and businesses.",
    solution:
      "TrafficPatternsXD preformed thermoplastic, installed by Multiseal: a durable, high-traction rainbow crossing that stands for the town's support of inclusion and the LGBTQ+ community.",
  },
  {
    // The post names the Town of Georgina and no street: pin at the town. No year
    // (2021 had no source), and the text is cut back to what the post says.
    id: "georgina-every-child-matters",
    title: "Every Child Matters Crosswalk",
    city: "Georgina",
    province: "ON",
    lat: 44.2280,
    lng: -79.4644,
    product: "TrafficPatterns",
    application: "Community Branding",
    images: [
      "/images/blog/every-child-matters-crosswalk/featured.png",
    ],
    excerpt:
      "A TrafficPatterns thermoplastic crosswalk in York Region's Town of Georgina honouring the Every Child Matters movement.",
    problem:
      "The Town of Georgina wanted a crosswalk that honours the Every Child Matters movement.",
    solution:
      "TrafficPatterns preformed thermoplastic in a custom design: surface applied, virtually maintenance-free, and a cost-effective alternative to brick pavers.",
  },
  {
    // The post names Humberwest Parkway (Brampton) and no crossing, so the pin sits
    // on the parkway. Which product went on the crossing and which on the median is
    // not stated.
    id: "toronto-humberwest-crosswalk",
    title: "Humberwest Parkway Decorative Crosswalk & Median",
    city: "Brampton",
    province: "ON",
    lat: 43.7664,
    lng: -79.7181,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/blog/decorative-crosswalk-meridian/featured.jpg",
    ],
    excerpt:
      "StreetBond 150 and TrafficPatternsXD combine to create a decorative crosswalk and median treatment on Humberwest Parkway in Brampton.",
    problem:
      "The Humberwest Parkway crossing and median needed the look of brick or paving stone without the upkeep of pavers.",
    solution:
      "TrafficPatternsXD, an aggregate-reinforced preformed thermoplastic, with StreetBond 150 coloured coating, which bonds permanently to asphalt and concrete and resists fuel, engine oil and de-icing agents.",
  },
  {
    // The post's own hero (bus-lanes-08). It names the East London Link corridor and
    // no street, so the pin sits in east London, approximate.
    id: "london-east-brt",
    title: "East London Link · Bus Rapid Transit",
    city: "London",
    province: "ON",
    lat: 42.9836,
    lng: -81.2200,
    product: "MMAX",
    application: "Bus & Bike Lanes",
    images: [
      gallery("217e5873e43b99d6b4689bdf8ddc53c0da4c7d8b-2400x1800.jpg"), // applications/bus-lanes/bus-lanes-08.jpg
    ],
    post: "london-east-link-brt",
    excerpt:
      "The City of London's East London Link: red MMAX on the transit lanes and TrafficPatternsXD at the crossings, two materials in one bus rapid transit corridor.",
    problem:
      "A bus rapid transit corridor asks the road surface for two things: crossings that stay high-contrast and grippy where buses brake and turn, and transit lanes that go in without shutting the corridor down.",
    solution:
      "TrafficPatternsXD, 150 mil aggregate-reinforced thermoplastic, at the crossings. Red MMAX methyl methacrylate on the lanes, traffic-ready in 45 to 60 minutes, so a lane carries buses again the same shift.",
  },
  {
    // The post names the Leslieville laneway but not the lane: pin in Leslieville
    // (Queen St E and Leslie St). Second photo: the same lane, from laneway-project.
    id: "toronto-leslieville-laneway",
    title: "Leslieville Laneway Revitalization",
    city: "Toronto",
    province: "ON",
    lat: 43.6627,
    lng: -79.3337,
    product: "StreetBond",
    application: "Public Art",
    images: [
      "/images/blog/municipalities-case-study/featured.jpg",
      "https://cdn.sanity.io/images/9dbro2m1/production/c20487f0c16acaabb6acd37b7cf404ba7a3370f3-1188x1198.jpg", // laneway-project's hero, the same lane
    ],
    excerpt:
      "The City of Toronto and the Laneway Project non-profit used StreetBond150 to turn a Leslieville back lane into a welcoming public space.",
    problem:
      "Toronto set out to widen access to public space by transforming laneways. The lane had to become inviting, stay open for occasional service access, and take constant foot traffic and the city's weather with little upkeep.",
    solution:
      "StreetBond150 coatings in colourful designs applied to the lane's asphalt: a durable, highly visible surface that bonds permanently and needs little maintenance.",
  },
  {
    // Emery Village is a neighbourhood; the post names no intersection, so the pin
    // sits at Emery. 2020 is the year the post gives for the project.
    id: "toronto-emery-village",
    title: "Emery Village BIA Crosswalk Restoration",
    city: "Toronto",
    province: "ON",
    lat: 43.7441,
    lng: -79.5342,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    year: "2020",
    images: [
      "/images/blog/decorative-asphalt-high-traffic/featured.jpg",
    ],
    excerpt:
      "Emery Village BIA replaced failing unit pavers with TrafficPatternsXD, keeping the original 'Emery Blue' colour and paver grid in aggregate-reinforced thermoplastic that stands up to heavy truck traffic.",
    problem:
      "Twelve-year-old coloured unit pavers at the Emery Village BIA gateway were breaking down under heavy commercial and truck traffic, and patching them was only ever a temporary fix. The BIA wanted a permanent replacement that kept the community's 'Emery Blue' design.",
    solution:
      "TrafficPatternsXD across 440 m² of crossings, installed by Multiseal, replicating the Emery Blue colour and the paver grid with less traffic disruption than relaying pavers or demolishing the concrete base.",
  },
  {
    // extending-transit-lane-lifespan names "key TTC bus-priority corridors" and no
    // street, so the pin sits at the city centre. Its photo is a TTC bus on a red lane.
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
      "MMAX red lane surfacing on key TTC bus priority corridors in Toronto, installed overnight, with fewer repainting cycles over five-plus years.",
    problem:
      "Toronto wanted its busiest bus-priority routes to stay clearly visible and need less maintenance, without long lane closures.",
    solution:
      "MMAX MMA surfacing in red, fast-curing so it went down in overnight installations, with a high-friction surface for operators in all conditions.",
  },
  {
    // Post: pedestrian-channelization-public-spaces. The photo shows the blue
    // promenade with the Brant Street Pier and its beacon, so it is this job (it was
    // tagged "Representative" until 28 Sep 2026). Pin at Spencer Smith Park.
    id: "burlington-spencer-smith",
    title: "Spencer Smith Park Lakeshore Promenade",
    city: "Burlington",
    province: "ON",
    lat: 43.3203,
    lng: -79.7999,
    product: "StreetBond",
    application: "Parks & Paths",
    year: "2017",
    images: [
      gallery("6187288d000303a7d49e083d8fcb222f8c26567a-1497x1123.jpg"), // products/streetbond/streetbond-59.png
    ],
    post: "pedestrian-channelization-public-spaces",
    excerpt:
      "5,600 m² of StreetBond150 in Cobalt Blue on the lakeshore promenade at Burlington's Spencer Smith Park, replacing the original StreetPrint surface after more than twenty years.",
    problem:
      "The promenade's StreetPrint surface had reached the end of its life after more than twenty years of Lake Ontario winters, and the park is home to Canada's largest Rib Fest.",
    solution:
      "New asphalt, smooth and accessible for walking, cycling and wheelchairs, coated with 5,600 m² of StreetBond150 in Cobalt Blue, this time without the StreetPrint imprint.",
  },
  {
    // The post's photo covers two jobs (GrandLinq in Waterloo and VIVA in York
    // Region) and shows neither an ION train nor a named street, so it came off
    // this pin on 28 Sep 2026. The post places the job in Waterloo.
    id: "waterloo-grandlinq-lrt",
    title: "GrandLinq ION LRT Platform Crossings",
    city: "Waterloo",
    province: "ON",
    lat: 43.4668,
    lng: -80.5164,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [],
    post: "safety-durability-transit-stations",
    excerpt:
      "TrafficPatternsXD at LRT platform edges, pedestrian crossings and modal transition points across the ION corridor: high-traction, fade-resistant surfacing through Waterloo Region winters.",
    problem:
      "GrandLinq's ION LRT corridor needed platform-edge and crossing treatments that could take constant traffic, stay grippy through freeze-thaw and winter conditions, and go in without disrupting service.",
    solution:
      "TrafficPatternsXD in phased night-time applications across the ION corridor, with no service disruption. The crossings kept their contrast through freeze-thaw cycles and gave better traction in winter.",
  },
  {
    // "Cadillac Fairview, Kitchener" is CF Fairview Park (commercial-applications
    // names it), so the pin moved there from downtown. Second photo: that post's
    // hero, the same lot with the Fairview Park sign. No year: 2021 had no source.
    id: "kitchener-cadillac-fairview",
    title: "Fairview Park Parking Lot, Kitchener",
    city: "Kitchener",
    province: "ON",
    lat: 43.4247,
    lng: -80.4390,
    product: "TrafficPatternsXD",
    application: "Parking Lots",
    images: [
      "/images/blog/stamped-asphalt-parking-lot/featured.jpg",
      "https://cdn.sanity.io/images/9dbro2m1/production/e14c5e05b4ed3d9c1a8a1132763674305e992311-1200x751.jpg", // commercial-applications' hero, Fairview Park
    ],
    excerpt:
      "TrafficPatternsXD crosswalks and traffic calming devices in the parking lot at Cadillac Fairview's Fairview Park in Kitchener: a brick or paving-stone look for a high-traffic retail lot.",
    problem:
      "Fairview Park's parking lot needed pedestrian crossings and traffic calming that would stand up to heavy traffic and year-round weather while keeping the lot inviting.",
    solution:
      "TrafficPatternsXD, an aggregate-reinforced preformed thermoplastic, for durable crosswalks and traffic calming devices with a brick or paving-stone look and none of the upkeep of pavers.",
  },
  {
    // Pin on Woodbridge Avenue, in the Woodbridge heritage district the post names.
    id: "vaughan-woodbridge-heritage",
    title: "Woodbridge Avenue Heritage Crosswalks",
    city: "Vaughan",
    province: "ON",
    lat: 43.7845,
    lng: -79.5945,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/blog/trafficpatternsxd-urban-design/featured.jpg",
    ],
    excerpt:
      "Heritage Conservation District crosswalks on Woodbridge Avenue: TrafficPatternsXD brick-pattern thermoplastic that meets the character of a designated heritage streetscape and survives Canadian winters.",
    problem:
      "The City of Vaughan's Woodbridge Avenue streetscape improvement called for crosswalks in keeping with the Heritage Conservation District. Real brick pavers were ruled out: snowplow blades catch and displace them.",
    solution:
      "TrafficPatternsXD in a brick pattern, flush with the road surface, chosen by the City for all pedestrian crosswalks at intersections on the project. Installed by Thermo Design.",
  },
  {
    // New 28 Sep 2026. Post: toronto-premium-outlets-14-years. Its photo shows the
    // Toronto Premium Outlets sign over the crossing. Pin at the centre, Halton Hills.
    id: "halton-hills-toronto-premium-outlets",
    title: "Toronto Premium Outlets Pedestrian Crossings",
    city: "Halton Hills",
    province: "ON",
    lat: 43.5757,
    lng: -79.8301,
    product: "TrafficPatternsXD",
    application: "Parking Lots",
    images: [
      gallery("071d81ad81371de61a084911100748616f057ad3-2400x1800.jpg"), // applications/parking-lots/parking-lots-60.jpg
    ],
    post: "toronto-premium-outlets-14-years",
    excerpt:
      "TrafficPatternsXD pedestrian crossings at Toronto Premium Outlets in Halton Hills, in service for fourteen years through shoppers, delivery trucks and Ontario winters.",
    problem:
      "A retail parking lot combines everything that wears out markings (turning traffic, delivery vehicles, salt and plows) with an owner whose customers judge the property on how it looks.",
    solution:
      "TrafficPatternsXD, 150 mil aggregate-reinforced thermoplastic heat-fused into the asphalt, in a pattern that reads as laid masonry and keeps its grip where the wheel paths cross it.",
  },

  // ── British Columbia ────────────────────────────────────────────────────────
  {
    // The post names three crossings (East 1st Avenue, East 4th Avenue and Charles
    // Street on Commercial Drive); the pin sits at East 1st, the middle one.
    id: "vancouver-commercial-drive",
    title: "Commercial Drive Decorative Crosswalk",
    city: "Vancouver",
    province: "BC",
    lat: 49.2695,
    lng: -123.0696,
    product: "TrafficPatterns",
    application: "Crosswalks",
    year: "2019",
    images: [
      "/images/blog/decorative-crosswalk-commercial-drive/featured.jpg",
    ],
    excerpt:
      "Three crosswalks in the green, white and red of the Italian flag, marking Vancouver's Little Italy on Commercial Drive: TrafficPatterns thermoplastic with DecoMark graphics.",
    problem:
      "The City of Vancouver had recognized eight blocks of Commercial Drive as the city's historic Little Italy, and the crossings were a chance to give the area definition.",
    solution:
      "TrafficPatterns preformed thermoplastic crosswalks at East 1st Avenue, East 4th Avenue and Charles Street, with DecoMark graphics, installed by Square One in time for Italian Day on The Drive.",
  },
  {
    // Pin at University Boulevard and Wesbrook Mall, as the post says. Photos: the
    // post's own, educational-facilities' (the same crossing, Musqueam wordmark),
    // and traffic-patterns-88 to -90, the install of this design (gallery captions:
    // UBC; the crest fields and colours match).
    id: "ubc-musqueam",
    title: "UBC Musqueam Campus Crosswalk",
    city: "Vancouver",
    province: "BC",
    lat: 49.2664,
    lng: -123.2455,
    product: "TrafficPatterns",
    application: "Community Branding",
    images: [
      "/images/blog/ubc-musqueam-crosswalk/featured.jpg",
      "https://cdn.sanity.io/images/9dbro2m1/production/8bc781dae7108dbc17c8a6bed5804f497340c9ab-1200x675.jpg", // educational-facilities' hero
      gallery("934b7f0da9484daca3fe416404ea9f69549bc02a-2400x1800.jpg"), // products/traffic-patterns/traffic-patterns-89.jpg
      gallery("129d0194739cf016f2f041136c82ac42d04b0387-2400x1800.jpg"), // products/traffic-patterns/traffic-patterns-90.jpg
      gallery("d9ee32e490cf1880569cdf6fbd654041227dc76e-2400x1800.jpg"), // products/traffic-patterns/traffic-patterns-88.jpg
    ],
    excerpt:
      "A feature crosswalk at University Boulevard and Wesbrook Mall, with the UBC and Musqueam crests woven together to acknowledge that UBC stands on unceded Musqueam territory.",
    problem:
      "The University Boulevard intersection is the main gateway to campus, and its upgrade was meant to give arrivals a sense of place.",
    solution:
      "TrafficPatterns preformed thermoplastic carrying a design created by UBC and Musqueam together, installed by Square One.",
  },
  {
    // Post: laneway-project (More Awesome Now, "Alley Oops", downtown Vancouver). Its
    // hero is Toronto's Leslieville lane, and the stand-in that was here could not be
    // tied to the lane, so the pin shows no photo. Downtown Vancouver, approximate.
    id: "vancouver-laneways",
    title: "More Awesome Now Laneway Revitalization",
    city: "Vancouver",
    province: "BC",
    lat: 49.2845,
    lng: -123.1098,
    product: "StreetBond",
    application: "Public Art",
    images: [],
    post: "laneway-project",
    excerpt:
      "More Awesome Now turned downtown Vancouver laneways into bright, playful public spaces with StreetBond 150 decorative coatings.",
    problem:
      "HCMA, the City of Vancouver and the Downtown Vancouver Business Improvement Association set out to turn downtown alleys from service corridors into bright, playful public spaces, while service vehicles kept using them.",
    solution:
      "StreetBond 150 decorative coatings in bold colour across the lane surface, shared by people on foot and service vehicles alike.",
  },
  {
    // Pin at Richmond-Brighouse Station on No. 3 Road.
    id: "richmond-brighouse",
    title: "Richmond Brighouse Station Crosswalk",
    city: "Richmond",
    province: "BC",
    lat: 49.1681,
    lng: -123.1363,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/blog/richmond-brighouse-crosswalk/featured.jpeg",
    ],
    excerpt:
      "TrafficPatternsXD crosswalks at TransLink's Brighouse Station in Richmond, within the development area and across No. 3 Road.",
    problem:
      "The Brighouse Station improvements needed crosswalks, across No. 3 Road and within the development area, that would hold up under high-traffic road conditions and stay skid-resistant.",
    solution:
      "TrafficPatternsXD, aggregate-reinforced preformed thermoplastic set into the asphalt: colour-stable and skid-resistant, with the look of brick or paving stone and none of the upkeep of loose pavers.",
  },
  {
    // Pin on Front Street, where the Mews is. A shared street, so Public Spaces.
    id: "new-westminster-complete-streets",
    title: "New Westminster Complete Streets",
    city: "New Westminster",
    province: "BC",
    lat: 49.2020,
    lng: -122.9085,
    product: "StreetBond",
    application: "Public Spaces",
    year: "2017",
    images: [
      "/images/blog/complete-streets-new-westminster/featured.jpg",
    ],
    excerpt:
      "Front Street Mews, a Complete Streets redevelopment: contrasting grey bands run through street and sidewalk alike, in TrafficPatterns on the roadway and StreetBond150 on the concrete sidewalks.",
    problem:
      "New Westminster redesigned the old Frontage Road as a mews: a shared, pedestrian-friendly street that called for one continuous pavement treatment across roadway and sidewalk.",
    solution:
      "Contrasting grey bands in TrafficPatterns preformed thermoplastic on the roadway and StreetBond150 coating on the concrete sidewalks, installed by Square One Paving.",
  },
  {
    // Pin at the foot of the pier on Marine Drive (it was 500 m inland).
    id: "white-rock-pier",
    title: "White Rock Pier Crosswalk",
    city: "White Rock",
    province: "BC",
    lat: 49.0195,
    lng: -122.8057,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      "/images/blog/white-rock-pier-crosswalk/featured.png",
    ],
    excerpt:
      "A TrafficPatternsXD decorative crosswalk at the White Rock Pier, installed by Square One among the upgrades for the pier's reopening after its storm repairs.",
    problem:
      "White Rock was reopening its pier after repairing the storm-damaged section, and the upgrades included a decorative crosswalk that had to take heavy traffic without the upkeep of pavers.",
    solution:
      "TrafficPatternsXD, aggregate-reinforced preformed thermoplastic set into the asphalt: a brick or paving-stone look, skid-resistant as it wears, and smooth underfoot for pedestrians and wheelchairs.",
  },
  {
    // The post gives 5500 Sunshine Coast Hwy, "at the southern entrance to the Town
    // of Sechelt". That address could not be placed with confidence, so the pin sits
    // in downtown Sechelt (Cowrie St and Wharf Ave), approximate.
    id: "sechelt-tsain-ko",
    title: "Tsain-Ko Cultural Crosswalk, Sechelt",
    city: "Sechelt",
    province: "BC",
    lat: 49.4721,
    lng: -123.7545,
    product: "TrafficPatterns",
    application: "Community Branding",
    images: [
      "/images/blog/tsain-ko-crosswalk-sechelt/featured.jpg",
    ],
    excerpt:
      "A TrafficPatterns crosswalk with an Indigenous motif at Tsain-Ko Centre, at the southern entrance to Sechelt on shíshálh Nation territory.",
    problem:
      "The crosswalk at Tsain-Ko Centre, 5500 Sunshine Coast Highway, needed to draw attention for safety and look good in its own right.",
    solution:
      "TrafficPatterns preformed thermoplastic carrying an Indigenous motif, designed to draw attention to the crossing. Installed by Square One Paving.",
  },
  {
    // The trail runs from Horseshoe Bay to Deep Cove and the post names no single
    // crossing: pin on the City of North Vancouver waterfront, approximate.
    id: "north-van-spirit-trail",
    title: "Spirit Trail Crosswalks and Wayfinding",
    city: "North Vancouver",
    province: "BC",
    lat: 49.3125,
    lng: -123.0839,
    product: "DuraTherm",
    application: "Crosswalks",
    images: [
      "/images/blog/spirit-trail-wayfinding-vancouver/featured.jpg",
    ],
    excerpt:
      "DuraTherm 'Spirit' crosswalks wherever the Spirit Trail crosses a principal road, with DecoMark wayfinding markings along the North Shore greenway.",
    problem:
      "The Spirit Trail, a 35 km greenway planned from Horseshoe Bay to Deep Cove, joins up the North Shore's isolated public spaces, and needed a consistent identity where it meets the road network.",
    solution:
      "DuraTherm, a customizable decorative paving system inlaid into the asphalt, for the 'Spirit' crosswalks, added year by year as the trail grows, and DecoMark markings as horizontal signage that guides people to the trail.",
  },
  {
    // The post names Port Coquitlam and no address: pin at city hall, approximate.
    id: "coquitlam-terry-fox",
    title: "Terry Fox Plaza, Port Coquitlam",
    city: "Port Coquitlam",
    province: "BC",
    lat: 49.2622,
    lng: -122.7806,
    product: "StreetBond",
    application: "Community Branding",
    images: [
      "/images/blog/terry-fox-plaza-coquitlam/featured.jpg",
    ],
    excerpt:
      "A decorative asphalt plaza map honouring Terry Fox in Port Coquitlam: StreetBond150 coatings, with DecoMark wayfinding markings.",
    problem:
      "The Terry Fox plaza in Port Coquitlam needed its map in a finish that was both decorative and durable, without adding upkeep.",
    solution:
      "StreetBond150 coatings for the plaza map, bonded permanently to the asphalt, with DecoMark thermoplastic for the wayfinding and surface markings.",
  },
  {
    // Pin at Snug Cove (it was 700 m away in the woods).
    id: "bowen-island-path",
    title: "Snug Cove Path, Bowen Island",
    city: "Bowen Island",
    province: "BC",
    lat: 49.3795,
    lng: -123.3314,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      "/images/blog/bowen-island-asphalt-path/featured.jpg",
    ],
    excerpt:
      "A decorative path at Snug Cove on Bowen Island in StreetBond150, its custom colours named Forest, Sunset, Water and Earth, with caricatures of local fauna.",
    problem:
      "The Snug Cove path was to carry a public art feature, which meant a surface that would resist peeling, cracking and fading.",
    solution:
      "StreetBond150 coatings in four custom colours, bonded permanently to the asphalt and flexible enough to move with it, so they will not peel, delaminate or shrink-crack.",
  },
  {
    // Pin at the hospital, 4480 Oak Street (it was 1 km west of it).
    id: "bc-childrens-hospital",
    title: "BC Children's Hospital Labyrinth",
    city: "Vancouver",
    province: "BC",
    lat: 49.2445,
    lng: -123.1254,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      "/images/blog/bc-childrens-hospital-labyrinth/featured.jpg",
    ],
    excerpt:
      "Decorative paving and a labyrinth at BC Women and Children's Hospital in Vancouver: StreetBond coatings, with DecoMark icons of animals native to BC and their young.",
    problem:
      "Connect Landscape Architecture's hardscape design for the hospital called for playful and meditative spaces on the ground-level plaza and on the outdoor areas off the wards.",
    solution:
      "StreetBond on new acid-etched concrete, including a labyrinth on the deck of one level, and DecoMark icons applied to concrete and to precast tiles fitted off-site before they were lifted into place. Installed by Square One Paving.",
  },
  {
    // Pin at Cowrie Street and Trail Avenue, as the post says.
    id: "sechelt-pictograph-crosswalk",
    title: "Pictograph Crosswalk, Cowrie St & Trail Ave",
    city: "Sechelt",
    province: "BC",
    lat: 49.4721,
    lng: -123.7591,
    product: "TrafficPatterns",
    application: "Community Branding",
    year: "2022",
    images: [
      "/images/blog/pictograph-crosswalk-sechelt/featured.jpg",
    ],
    excerpt:
      "A pictograph-themed crosswalk at Cowrie Street and Trail Avenue in Sechelt that tells the origin story of the shíshálh Nation, unveiled by local Indigenous artist Dionne Paul and artist Lindsey Kyoko Adams.",
    problem:
      "Crosswalk art for the District of Sechelt: a pictograph design telling the shíshálh Nation's origin story, and Lindsey Kyoko Adams' bee and dogwood crossings about the importance of pollinators.",
    solution:
      "TrafficPatterns preformed thermoplastic inlaid into imprinted asphalt with StreetHeat reheating, which protects it from wear so it keeps its bold look. Installed in spring 2022; materials supplied by Square One Paving.",
  },
  {
    // The post names Pitt Meadows and no street: pin at city hall, approximate. No
    // year (2021 had no source) and no "residential" (the post does not say).
    id: "pitt-meadows-natures-walk",
    title: "Nature's Walk Roadway Accents",
    city: "Pitt Meadows",
    province: "BC",
    lat: 49.2207,
    lng: -122.6901,
    product: "StreetPrint",
    application: "Community Branding",
    images: [
      "/images/blog/roadway-accents-natures-walk/featured.jpg",
    ],
    excerpt:
      "StreetPrint stamped asphalt and StreetBond pavement coating combine to create decorative roadway accents at Nature's Walk in Pitt Meadows, BC.",
    problem:
      "Nature's Walk called for decorative roadway accents on an asphalt base.",
    solution:
      "StreetPrint genuine stamped asphalt for the design, with StreetBond coating bonded permanently to the asphalt for a lasting, low-maintenance finish that protects the pavement.",
  },
  {
    // The post places Seaside Stroll on Johnston Road in Uptown and names no cross
    // street: pin on Johnston Road, Uptown.
    id: "white-rock-seaside-stroll",
    title: "White Rock Seaside Stroll, Johnston Rd",
    city: "White Rock",
    province: "BC",
    lat: 49.0266,
    lng: -122.8012,
    product: "TrafficPatterns",
    application: "Community Branding",
    images: [
      "/images/blog/white-rock-langley-trafficpatterns/featured.jpg",
    ],
    excerpt:
      "Artist Amy Bao's wave-inspired crosswalk mural on Johnston Road: TrafficPatterns thermoplastic that brought the White Rock waterfront identity into the Uptown district.",
    problem:
      "White Rock's Uptown district had long been overshadowed by the waterfront. The city commissioned artist Amy Bao to design a crosswalk that would carry the waterfront inland, in a material that would not fade within months the way painted murals do.",
    solution:
      "TrafficPatterns preformed thermoplastic panels, heat-applied and bonded into the asphalt, capturing the fine detail of Bao's flowing wave lines in slip-resistant, UV-stable colour.",
  },
  {
    // Pin at Linwood Park, whose entrance the crossing marks. Photos: the crossing's
    // own (Square One Paving, March 2025; /public/images/blog/langley-railroad-heritage/),
    // loaded from their gallery copies, crosswalks-128 and traffic-patterns-44.
    id: "langley-railroad-heritage",
    title: "Langley Railroad Heritage Crosswalk",
    city: "Langley City",
    province: "BC",
    lat: 49.1021,
    lng: -122.6654,
    product: "TrafficPatterns",
    application: "Community Branding",
    year: "2025",
    images: [
      gallery("a51a3d2394ca7ef64d9d72f4b2bcbee877bf906c-1800x1350.jpg"), // applications/crosswalks/crosswalks-128.jpg
      gallery("586dece4ca2d10b8ec1774ae71a88e4a21e65783-2400x1560.jpg"), // products/traffic-patterns/traffic-patterns-44.jpg
    ],
    post: "white-rock-langley-trafficpatterns",
    excerpt:
      "Railroad tie-and-rail pattern crosswalk at the entrance to Linwood Park, Langley City, connecting modern pedestrian infrastructure to the city's railway heritage.",
    problem:
      "Langley City wanted to mark the gateway to Linwood Park with a design that honoured the city's railway roots, on a crossing that also had to handle vehicle wear and seasonal weather.",
    solution:
      "TrafficPatterns preformed thermoplastic in a railroad tie-and-rail pattern: tan rectangular panels and white lines fused permanently to the asphalt. Installed by Square One Paving and unveiled in March 2025.",
  },
  {
    // The post names the Reunion Housing Complex in Murrayville and no address: pin
    // at Murrayville, approximate (it was 2 km east). No year (2020 had no source).
    id: "langley-murrayville-reunion",
    title: "Reunion Housing Complex Sidewalks",
    city: "Langley",
    province: "BC",
    lat: 49.0885,
    lng: -122.6133,
    product: "DecoMark",
    application: "Community Branding",
    images: [
      "/images/blog/murrayville-schoolhouse-sidewalk/featured.jpg",
    ],
    excerpt:
      "Decorative asphalt sidewalks at the new Reunion Housing Complex in Murrayville, Langley, created with DecoMark thermoplastic decals.",
    problem:
      "The new Reunion Housing Complex in Murrayville wanted a classic decorative finish on its asphalt sidewalks.",
    solution:
      "DecoMark decals applied to the asphalt sidewalks: surface applied, skid and slip resistant, UV-stable, and engineered to last 6 to 8 times longer than paint.",
  },
  {
    // Pin at Windsor Gate (named as such on the map), River Springs, Coquitlam.
    id: "coquitlam-windsor-gate",
    title: "Windsor Gate Masterplanned Community",
    city: "Coquitlam",
    province: "BC",
    lat: 49.2797,
    lng: -122.7849,
    product: "StreetPrint",
    application: "Community Branding",
    images: [
      "/images/blog/community-branding-case-study/featured.jpg",
    ],
    excerpt:
      "Polygon Realty's Windsor Gate community in Coquitlam: StreetPrint stamped asphalt roadways with a brick-street look and the community's logo mark built into the surface.",
    problem:
      "Polygon Realty wanted branding on the roadways around Windsor Gate, so that a series of properties around a central club would read as one integrated neighbourhood.",
    solution:
      "StreetPrint genuine stamped asphalt in a brick pattern, with the tricolour logo mark of the community worked into the road surfaces, walkways and dividers near the properties.",
  },
  {
    // "Throughout the city core": pin at downtown Kelowna.
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
      "More than 80 TrafficPatternsXD crosswalks through Kelowna's city core, installed over 13 years.",
    problem:
      "The City of Kelowna set out to make walking, cycling and transit more attractive, accessible and safe, which meant crosswalks that look good and stand up to high traffic and weather.",
    solution:
      "TrafficPatternsXD, aggregate-reinforced thermoplastic imprinted into the asphalt, from the city's first crosswalk to more than 80 across the core, with more planned.",
  },
  {
    // Post: pedestrian-channelization-public-spaces. The photo is Safety Blue on the
    // Inner Harbour walkway with the Legislature behind, so it is this job (tagged
    // "Representative" until 28 Sep 2026). Pin on the Inner Harbour.
    id: "victoria-david-foster-pathway",
    title: "David Foster Harbour Pathway",
    city: "Victoria",
    province: "BC",
    lat: 48.4201,
    lng: -123.3656,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      gallery("203c5601a2be53448f6fdb484f2a7a1fb483f3a2-1200x778.jpg"), // products/streetbond/streetbond-97.jpg
    ],
    post: "pedestrian-channelization-public-spaces",
    excerpt:
      "StreetBond Safety Blue on Victoria's David Foster Harbour Pathway, which runs over five kilometres from Rock Bay to Ogden Point and recognizes Lekwungen First Nations history and the working harbour.",
    problem:
      "The renovation of Victoria's harbour pathway, a route shared by residents and visitors, called for high-visibility colour.",
    solution:
      "StreetBond coating in high-visibility Safety Blue on the renovated pathway: water-based and slip-resistant.",
  },

  // ── Québec ──────────────────────────────────────────────────────────────────
  {
    // Post: pedestrian-channelization-public-spaces. The photo is the red flowing
    // lines below the Olympic Stadium tower, so it is this job (tagged
    // "Representative" until 28 Sep 2026). Pin at Parc Guido-Nincheri (it was 800 m off).
    id: "montreal-guido-nincheri",
    title: "Parc Guido-Nincheri Promenade",
    city: "Montréal",
    province: "QC",
    lat: 45.5544,
    lng: -73.5554,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      gallery("5716ebf4509410e168d52d683971e967f52ae72a-2400x1800.jpg"), // products/streetbond/streetbond-58.jpg
    ],
    post: "pedestrian-channelization-public-spaces",
    excerpt:
      "StreetBond150 over concrete at Parc Guido-Nincheri's promenade Ville-de-Québec: bold flowing lines designed by Civiliti as a gateway to Space for Life and the Olympic Park.",
    problem:
      "Civiliti's design for the promenade carries a motif of bark, knots and movement through its walls, furniture and paving, and the paving needed its flowing lines in colour on concrete.",
    solution:
      "StreetBond150 applied over the concrete to draw the bold flowing lines at the centre of the promenade's landscape design. The coating bonds permanently to concrete.",
  },
];

// ──────────────────────────────────────────────────────────────────────────
// Blog-derived pins
//
// scripts/gen-map-blog.mjs emits lib/map-blog-projects.json at build time:
// which curated pins have a published post to link to ("Read the write-up").
// That file is generated and gitignored, same arrangement as the gallery
// manifest and the document sizes, for the same reason — globbing content/
// from inside a page defeats Next's dependency tracer.
//
// Until Sep 2026 it also made a pin for every post whose .mdx frontmatter
// stated where it was. No post did, and the blog has since moved into Sanity,
// so `projects` is empty now; it is kept so this file reads the same shape.
//
// See the header of scripts/gen-map-blog.mjs for the six frontmatter keys.
// ──────────────────────────────────────────────────────────────────────────

const linkedSlugs = blogMap.linkedSlugs as Record<string, true>;

/**
 * Every published post, for a pin that names its post with `post`. The
 * generator only sees image paths, so these are checked against the same list
 * it reads (lib/blog-index.json, written first in every build).
 */
const publishedSlugs = new Set((blogIndex as { slug: string }[]).map((b) => b.slug));

/** Curated entries, each linked to its post where the image path names one. */
const curatedWithSlugs: MapProject[] = curatedProjects.map((p) => {
  if (p.post) return publishedSlugs.has(p.post) ? { ...p, slug: p.post } : p;
  // Split rather than a regex, deliberately: a pattern for this path needs
  // escaped slashes, and a backslash anywhere in this file has to survive a
  // JSON-escaping round trip to reach the repo. One already came back
  // double-escaped. There is nothing here a regex does better.
  const parts = (p.images[0] ?? "").split("/");
  const candidate =
    parts[1] === "images" && parts[2] === "blog" ? parts[3] : undefined;
  const slug = candidate && linkedSlugs[candidate] ? candidate : undefined;
  return slug ? { ...p, slug } : p;
});

export const mapProjects: MapProject[] = [
  ...curatedWithSlugs,
  ...(blogMap.projects as MapProject[]),
];

/**
 * The number the page is allowed to say out loud. Measured, not typed — the
 * phone card used to advertise "84 projects" while the header forty pixels
 * below it said 59.
 */
export const mapProjectCount = mapProjects.length;
