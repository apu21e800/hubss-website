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
 * name. Stand-ins come from the gallery of the pin's own system, the folder
 * being the proof of the system (as in lib/image-seo.ts), and load from
 * Sanity's CDN like the galleries do, so none of them adds work for
 * /_next/image. The comment beside each call names the /public original.
 */
const gallery = (file: string) => `https://cdn.sanity.io/images/9dbro2m1/production/${file}`;

// Curated 2026-05-12 per Vernon: ONLY projects where we have a verified image-to-location
// correlation (typically via a dedicated blog post + featured image in /public/images/blog/<slug>/).
// All earlier generic-stock entries removed — better to show fewer real projects than a long list
// with stand-in photography.
//
// Sep 2026: the pins tagged "Representative" are real jobs still waiting for their own photos,
// so they stay. Their stand-ins were checked one by one: several showed another city's street
// sign or another pin's photograph. Each now shows its own system's gallery photo with no
// identifiable place, or no photo where nothing fits (a culturally specific design, say).
// Every pin with a write-up had its product, place and text checked against the post.
const curatedProjects: MapProject[] = [
  // ── Ontario ─────────────────────────────────────────────────────────────────
  {
    // Corrected Sep 2026 from the York Region case study
    // (multimodal-connectivity-york-region): the pin said MMAX bus lanes and
    // linked the archived York stub. The photo stays: it is the VIVA rapidway
    // (station canopy, VIVA banner) and a TrafficPatternsXD crossing. The case
    // study's own photo is the Kitchener one the Waterloo pin uses, so the
    // link is set with `post` instead of by moving the photo.
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
    // Corrected Sep 2026 from the post: the crosswalk is TrafficPatterns
    // (DecoMark is named only for crests and wordmarks), and it is at the
    // Memorial Auditorium, not a cenotaph. The poppy motifs and "four winters"
    // had no source.
    id: "kitchener-veterans",
    title: "Kitchener Veterans Memorial Crosswalk",
    city: "Kitchener",
    province: "ON",
    lat: 43.4516,
    lng: -80.4925,
    product: "TrafficPatterns",
    application: "Community Branding",
    images: [
      "/images/blog/veterans-crosswalk-kitchener/featured.jpeg",
    ],
    excerpt:
      "Kitchener's Veterans Crosswalk at the East Avenue entrance to the Kitchener Memorial Auditorium, a living memorial: a permanent Remembrance Day tribute in TrafficPatterns thermoplastic.",
    problem:
      "The City of Kitchener and its partners, two Legion branches and the Royal Highland Fusiliers, wanted a permanent Remembrance Day tribute on a route people use every day, in a material that would outlast paint.",
    solution:
      "TrafficPatterns preformed thermoplastic in a high-contrast commemorative pattern, heat-bonded to the asphalt by MultiSeal during off-peak work and back in service ahead of Remembrance Day.",
  },
  {
    // Corrected Aug 2026: this entry was "Collingwood Rainbow Crosswalk" but
    // wore SIMCOE's photo (and the wrong product) — the documented HUB project
    // behind that photo is Simcoe, ON: TrafficPatternsXD, installed by
    // certified applicator Multiseal, 2023 (see blog: simcoe-rainbow-crosswalk).
    id: "simcoe-rainbow",
    title: "Simcoe Pride Rainbow Crosswalk",
    city: "Simcoe",
    province: "ON",
    lat: 42.8368,
    lng: -80.306,
    product: "TrafficPatternsXD",
    application: "Community Branding",
    year: "2023",
    images: [
      "/images/blog/simcoe-rainbow-crosswalk/featured.jpg",
    ],
    excerpt:
      "A young resident's two-year fundraising campaign became a permanent Pride rainbow crosswalk: TrafficPatternsXD colour that survives snowplows and de-icing chemicals.",
    problem:
      "Simcoe wanted a Pride crosswalk that would survive Ontario winters. Painted rainbow crossings fade and chip within a season, turning a symbol of inclusion into a maintenance liability.",
    solution:
      "TrafficPatternsXD preformed thermoplastic installed by certified applicator Multiseal, each colour heat-fused into the asphalt for a high-traction, plow-safe surface that keeps its vibrancy year after year.",
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
      "A TrafficPatterns thermoplastic crosswalk in York Region's Town of Georgina honouring the Every Child Matters movement: permanent colour that survives Ontario winters.",
    problem:
      "The Town of Georgina sought a durable way to honour the Every Child Matters movement in a public space that would be visible year-round without requiring annual maintenance.",
    solution:
      "TrafficPatterns preformed thermoplastic in orange and white, heat-fused to the asphalt crosswalk surface. The installation maintains sharp colour and edge definition through freeze-thaw cycles and snowplow contact.",
  },
  {
    // Humberwest Parkway is in Brampton, not Toronto (Sep 2026). The post
    // gives only the street, so the pin sits at Brampton's centre. Which
    // product went on the crossing and which on the median is not stated.
    id: "toronto-humberwest-crosswalk",
    title: "Humberwest Parkway Decorative Crosswalk & Median",
    city: "Brampton",
    province: "ON",
    lat: 43.7315,
    lng: -79.7624,
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
    // Sep 2026: the corridor's own photo and write-up (london-east-link-brt).
    // The photo is that post's hero (bus-lanes-08, also mmax-25 in the MMAX
    // gallery), so the stand-in and its tag are gone. The post has no folder
    // in /public/images/blog, hence `post`. TODO: Vernon to confirm the exact
    // corridor location; the pin is approximate.
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
    // TODO: Vernon to locate project image for City of Vaughan TrafficPatternsXD crosswalks
    // Stand-in was the Simcoe rainbow crosswalk, another pin's own photo (Sep 2026).
    id: "vaughan-complete-streets",
    title: "City of Vaughan Complete Streets Crosswalks",
    city: "Vaughan",
    province: "ON",
    lat: 43.8361,
    lng: -79.4987,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      gallery("b54a619739ed0a92318a1038db43d2730c4007ba-2400x1800.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-73.jpg
    ],
    imageIsRepresentative: true,
    excerpt:
      "TrafficPatternsXD crosswalks across Vaughan's high-volume arterials: aggregate-reinforced thermoplastic engineered to withstand heavy traffic and aggressive winter clearing.",
    problem:
      "Vaughan's arterial crosswalks see some of York Region's heaviest vehicle counts. Standard paint and thermoplastic markings were failing within one to two seasons under snowplow contact.",
    solution:
      "TrafficPatternsXD's virtually-flush, aggregate-reinforced structure installs as a 10+ year surface. The material resists snowplow blades, retains retroreflectivity, and requires no annual maintenance cycle.",
  },

  // ── British Columbia ────────────────────────────────────────────────────────
  {
    // Corrected Sep 2026 from the post: TrafficPatterns crosswalks with DecoMark
    // in Italian-flag colours, not StreetPrint brick in terracotta.
    id: "vancouver-commercial-drive",
    title: "Commercial Drive Decorative Crosswalk",
    city: "Vancouver",
    province: "BC",
    lat: 49.2751,
    lng: -123.0698,
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
      "A feature crosswalk at University Boulevard and Wesbrook Mall, with the UBC and Musqueam crests woven together to acknowledge that UBC stands on unceded Musqueam territory.",
    problem:
      "The University Boulevard intersection is the main gateway to campus, and its upgrade was meant to give arrivals a sense of place.",
    solution:
      "TrafficPatterns preformed thermoplastic carrying a design created by UBC and Musqueam together, installed by Square One.",
  },
  {
    // Sep 2026: the photo was the post's hero, which is Toronto's Leslieville
    // laneway (the Leslieville pin's place). This one is Vancouver's Alley Oop,
    // the More Awesome Now laneway the post names; it looks like the project
    // itself, but that is Doug's call, so it carries the tag. Already a map
    // photo, so nothing new for /_next/image.
    id: "vancouver-laneways",
    title: "More Awesome Now Laneway Revitalization",
    city: "Vancouver",
    province: "BC",
    lat: 49.2845,
    lng: -123.1098,
    product: "StreetBond",
    application: "Public Art",
    images: [
      "/images/applications/community-branding/community-branding-10.jpg",
    ],
    imageIsRepresentative: true,
    post: "laneway-project",
    excerpt:
      "Vancouver laneways transformed into vibrant public art corridors using StreetBond coloured pavement systems.",
    problem:
      "HCMA, the City of Vancouver and the Downtown Vancouver Business Improvement Association set out to turn downtown alleys from service corridors into bright, playful public spaces, while service vehicles kept using them.",
    solution:
      "StreetBond 150 decorative coatings in bold colour across the lane surface, shared by people on foot and service vehicles alike.",
  },
  {
    // Corrected Sep 2026 from the post: TrafficPatternsXD, not DecoMark.
    id: "richmond-brighouse",
    title: "Richmond Brighouse Station Crosswalk",
    city: "Richmond",
    province: "BC",
    lat: 49.1669,
    lng: -123.1377,
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
    // Text corrected Sep 2026 from the post: grey bands in TrafficPatterns and
    // StreetBond150 on Front Street Mews. The three colour palettes had no source.
    id: "new-westminster-complete-streets",
    title: "New Westminster Complete Streets",
    city: "New Westminster",
    province: "BC",
    lat: 49.2057,
    lng: -122.911,
    product: "StreetBond",
    application: "Crosswalks",
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
    // Corrected Sep 2026 from the post: TrafficPatternsXD, installed for the
    // pier's reopening. The salt-air and glass-bead claims had no source.
    id: "white-rock-pier",
    title: "White Rock Pier Crosswalk",
    city: "White Rock",
    province: "BC",
    lat: 49.0233,
    lng: -122.802,
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
    // Corrected Sep 2026 from the post: TrafficPatterns, not DecoMark. The
    // reconciliation framing and the Nation's role in the design had no source.
    id: "sechelt-tsain-ko",
    title: "Tsain-Ko Cultural Crosswalk, Sechelt",
    city: "Sechelt",
    province: "BC",
    lat: 49.4731,
    lng: -123.7577,
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
    // Corrected Sep 2026 from the post: the photo is a DuraTherm 'Spirit'
    // crosswalk, where the trail crosses a principal road; DecoMark does the
    // wayfinding. StreetBond is not named in the post.
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
    // Corrected Sep 2026 from the post: Port Coquitlam, not Coquitlam, and
    // StreetBond150 with DecoMark, not StreetPrint. The post gives no street
    // address, so the pin sits at Port Coquitlam's centre.
    id: "coquitlam-terry-fox",
    title: "Terry Fox Plaza, Port Coquitlam",
    city: "Port Coquitlam",
    province: "BC",
    lat: 49.2625,
    lng: -122.7810,
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
    // Text corrected Sep 2026 from the post: Snug Cove, four custom colours.
    // The ferry-to-village route and the green-grey tone had no source.
    id: "bowen-island-path",
    title: "Snug Cove Path, Bowen Island",
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
      "A decorative path at Snug Cove on Bowen Island in StreetBond150, its custom colours named Forest, Sunset, Water and Earth, with caricatures of local fauna.",
    problem:
      "The Snug Cove path was to carry a public art feature, which meant a surface that would resist peeling, cracking and fading.",
    solution:
      "StreetBond150 coatings in four custom colours, bonded permanently to the asphalt and flexible enough to move with it, so they will not peel, delaminate or shrink-crack.",
  },
  {
    // Text corrected Sep 2026 from the post: StreetBond on acid-etched
    // concrete and DecoMark icons. The healing garden, the two colours and the
    // asphalt had no source.
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
      "Decorative paving and a labyrinth at BC Women and Children's Hospital in Vancouver: StreetBond coatings, with DecoMark icons of animals native to BC and their young.",
    problem:
      "Connect Landscape Architecture's hardscape design for the hospital called for playful and meditative spaces on the ground-level plaza and on the outdoor areas off the wards.",
    solution:
      "StreetBond on new acid-etched concrete, including a labyrinth on the deck of one level, and DecoMark icons applied to concrete and to precast tiles fitted off-site before they were lifted into place. Installed by Square One Paving.",
  },
  {
    id: "sechelt-pictograph-crosswalk",
    title: "Pictograph Crosswalk, Cowrie St & Trail Ave",
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
      "The District of Sechelt commissioned two artists (one with Indigenous pictograph motifs, one with a bee and dogwood pollinator theme) to create crosswalks that would celebrate community identity without the maintenance burden of paint.",
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
    title: "White Rock Seaside Stroll, Johnston Rd",
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
      "Artist Amy Bao's wave-inspired crosswalk mural on Johnston Road: TrafficPatterns thermoplastic that brought the White Rock waterfront identity into the Uptown district.",
    problem:
      "White Rock's Uptown district lacked the visual character of the iconic waterfront. The city commissioned artist Amy Bao to design a crosswalk that would carry the waterfront's identity inland, in a material that would not fade within months the way painted murals do.",
    // The "40% more foot traffic" line went in Sep 2026: QA found no source
    // for it, and the post is being corrected too.
    solution:
      "TrafficPatterns preformed thermoplastic panels, heat-applied and bonded into the asphalt, capturing the fine detail of Bao's flowing wave lines in slip-resistant, UV-stable colour.",
  },
  {
    // Sep 2026: the crossing's own photos came in with the Idea Book (from
    // Square One Paving, March 2025; /public/images/blog/langley-railroad-heritage/),
    // so the stand-in (a shop street elsewhere) and its tag are gone. The
    // close-up is also traffic-patterns-44 in the TrafficPatterns gallery,
    // which is the copy used here. Written up in the White Rock and Langley post.
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
      gallery("586dece4ca2d10b8ec1774ae71a88e4a21e65783-2400x1560.jpg"), // products/traffic-patterns/traffic-patterns-44.jpg
    ],
    post: "white-rock-langley-trafficpatterns",
    excerpt:
      "Railroad tie-and-rail pattern crosswalk at the entrance to Linwood Park, Langley City, connecting modern pedestrian infrastructure to the Fraser Valley's railway heritage.",
    problem:
      "Langley City wanted to mark the gateway to Linwood Park with a design that honoured the city's railway roots, on a crossing that also had to handle vehicle wear and seasonal weather.",
    solution:
      "TrafficPatterns preformed thermoplastic in a railroad tie-and-rail pattern: tan rectangular panels and white lines fused permanently to the asphalt. Installed by Square One Paving and unveiled in March 2025.",
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
      "Decorative asphalt sidewalks at the Reunion Housing Complex in Murrayville, Langley: DecoMark thermoplastic decals adding classic design character to a new residential community.",
    problem:
      "The Reunion Housing Complex in Murrayville needed decorative sidewalk treatments that would differentiate the development from standard residential streetscapes and hold up to year-round pedestrian use.",
    solution:
      "DecoMark custom thermoplastic decals surface-applied to the existing asphalt sidewalks. The UV-stable graphics are designed to last 6–8 times longer than paint and require no special maintenance.",
  },

  // ── More Ontario ──────────────────────────────────────────────────────────────
  {
    id: "toronto-leslieville-laneway",
    title: "Leslieville Laneway Revitalization",
    city: "Toronto",
    province: "ON",
    lat: 43.6590,
    lng: -79.3342,
    product: "StreetBond",
    application: "Public Art",
    // No year: 2023 was the case study's date, and the post gives no install
    // year. "MMA-grade" went too (Sep 2026): StreetBond is not an MMA.
    images: [
      "/images/blog/municipalities-case-study/featured.jpg",
    ],
    excerpt:
      "City of Toronto and the Laneway Project non-profit used StreetBond150 to transform a Leslieville back lane into a vibrant, welcoming public space: bold colour patterns that survive foot traffic and weather.",
    problem:
      "Toronto's Leslieville laneway was an underused service corridor. The Laneway Project needed a durable surface treatment that could withstand daily foot traffic while delivering bold, welcoming aesthetics.",
    solution:
      "StreetBond150 in engaging shapes and deep colours applied directly to the lane's asphalt: hard enough for heavy foot traffic, flexible enough not to crack, and needing little upkeep.",
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
      "Emery Village BIA replaced failing unit pavers with TrafficPatternsXD, matching the original 'Emery Blue' design in aggregate-reinforced thermoplastic that handles heavy commercial truck loads.",
    problem:
      "Twelve-year-old coloured unit pavers at the Emery Village BIA gateway were failing under heavy truck traffic, requiring constant patching. The BIA needed a permanent replacement that preserved the community's 'Emery Blue' design identity.",
    solution:
      "TrafficPatternsXD across 440 m² of crossings, Pantone-matched to Emery Blue. The monolithic thermoplastic bond to asphalt eliminated joint failure and edge displacement, the mechanisms that had destroyed the pavers.",
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
      "MMAX red lane surfacing on key TTC bus priority corridors in Toronto, installed overnight, with fewer repainting cycles over five-plus years.",
    problem:
      "Toronto's TTC bus priority corridors required constant repainting under high axle loads and aggressive snowplow operations. Each repainting cycle caused service disruptions and lane closures.",
    solution:
      "MMAX MMA surfacing applied in overnight installations, fast-curing so no long closures were needed, with a long-lasting red lane colour and a high-friction surface for bus operators.",
  },
  {
    // One photo, three projects. content/blog/pedestrian-channelization-public-spaces
    // covers Spencer Smith Park (Burlington), the David Foster Harbour Pathway
    // (Victoria) and Parc Guido-Nincheri (Montréal), and carries a single
    // featured image. All three pins pointed at it and none was tagged, so the
    // site showed one photograph as the verified record of three installations
    // 4,500 km apart — at most one of which it can be. Which one is a question
    // only Doug can answer; until he does, all three say "Representative".
    // Untag whichever he names.
    //
    // Sep 2026: that photo turned out to be none of them (an overhead of a
    // courtyard). Each pin now shows a StreetBond gallery photo that matches its
    // post: a blue lakeshore promenade with a pier (Burlington), Safety Blue on
    // the Inner Harbour below the legislature (Victoria), red flowing lines
    // below the Olympic Stadium tower (Montréal). They look like the projects
    // themselves, but that is Doug's call, so the tags stay.
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
      gallery("6187288d000303a7d49e083d8fcb222f8c26567a-1497x1123.jpg"), // products/streetbond/streetbond-59.png
    ],
    imageIsRepresentative: true,
    excerpt:
      "5,600 m² of StreetBond150 Cobalt Blue on Burlington's Spencer Smith Park lakeshore promenade: durable, skid-resistant surface coating replacing the original StreetPrint installation after 20 years.",
    problem:
      "Spencer Smith Park's StreetPrint lakeshore promenade had reached the end of its 20-year lifecycle under Lake Ontario's harsh winters. The city needed a replacement surface that could handle the Canada Rib Fest crowds and year-round lakefront conditions.",
    solution:
      "New asphalt base topped with 5,600 m² of StreetBond150 in Cobalt Blue: fast-install, skid-free, and accessible. No stamping this time; the colour coating alone delivers the visual identity the park requires.",
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
      "TrafficPatternsXD at LRT platform edges, pedestrian crossings, and modal transition points across the ION corridor: high-traction, fade-resistant surfacing through Waterloo Region winters.",
    problem:
      "GrandLinq's ION LRT corridor needed platform-edge and crossing treatments that could take constant traffic, stay grippy through freeze-thaw and winter conditions, and go in without disrupting service.",
    solution:
      "TrafficPatternsXD in phased night-time applications across the ION corridor, with no service disruption. The crossings kept their contrast through freeze-thaw cycles and gave better traction in winter.",
  },
  {
    id: "kitchener-cadillac-fairview",
    title: "Cadillac Fairview Parking Lot, Kitchener",
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
      "TrafficPatternsXD crosswalks and traffic calming devices at Cadillac Fairview Kitchener: aggregate-reinforced thermoplastic delivering brick-like aesthetics and lasting safety markings across a high-volume retail parking lot.",
    problem:
      "Cadillac Fairview's Kitchener shopping centre needed pedestrian crosswalk treatments that could withstand year-round vehicle traffic and snowplow operations without the maintenance liability of traditional paint or unit pavers.",
    solution:
      "TrafficPatternsXD brick-pattern crosswalks heat-fused to the asphalt surface: no raised edges, no repainting, and a visual quality consistent with a premium retail environment.",
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
      "Heritage Conservation District crosswalks on Woodbridge Avenue: TrafficPatternsXD brick-pattern thermoplastic that satisfies the character requirements of a designated heritage streetscape while surviving Canadian winters.",
    problem:
      "The City of Vaughan's Woodbridge Avenue streetscape improvement required crosswalks matching the Heritage Conservation District character. Real brick pavers were ruled out: snowplow blades displace them, making them an ongoing maintenance liability.",
    solution:
      "TrafficPatternsXD in a brick-pattern flush-to-surface profile: visually indistinguishable from masonry at street level, snowplow-safe, and specified by the City's Urban Design team for all pedestrian crosswalks on the project.",
  },

  // ── More British Columbia ────────────────────────────────────────────────
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
      "Polygon Realty's Windsor Gate community in Coquitlam: StreetPrint stamped asphalt roadways and driveways creating brick-street aesthetics that reinforce the community's identity throughout.",
    problem:
      "Polygon Realty needed roadways and driveways at Windsor Gate that would communicate premium residential quality and a cohesive community identity, without the long-term maintenance liability of real brick or stone.",
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
    // Softened Sep 2026 to what the post states: the "largest program",
    // "standard specification" and snowplow claims had no source.
    excerpt:
      "More than 80 TrafficPatternsXD crosswalks through Kelowna's city core, installed over 13 years.",
    problem:
      "The City of Kelowna set out to make walking, cycling and transit more attractive, accessible and safe, which meant crosswalks that look good and stand up to high traffic and weather.",
    solution:
      "TrafficPatternsXD, aggregate-reinforced thermoplastic imprinted into the asphalt, from the city's first crosswalk to more than 80 across the core, with more planned.",
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
      gallery("203c5601a2be53448f6fdb484f2a7a1fb483f3a2-1200x778.jpg"), // products/streetbond/streetbond-97.jpg
    ],
    imageIsRepresentative: true,
    // Softened Sep 2026: the post names Safety Blue on the renovated pathway,
    // not the full 5 km, and says nothing about how it has worn.
    excerpt:
      "StreetBond Safety Blue on Victoria's David Foster Harbour Pathway, which runs over five kilometres from Rock Bay to Ogden Point and recognizes Lekwungen First Nations history and the working harbour.",
    problem:
      "The renovation of Victoria's harbour pathway, a route shared by residents and visitors, called for high-visibility colour.",
    solution:
      "StreetBond coating in high-visibility Safety Blue on the renovated pathway: water-based and slip-resistant.",
  },

  // ── Québec ──────────────────────────────────────────────────────────────────
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
      gallery("5716ebf4509410e168d52d683971e967f52ae72a-2400x1800.jpg"), // products/streetbond/streetbond-58.jpg
    ],
    imageIsRepresentative: true,
    // Softened Sep 2026: the post says nothing about how the coating has worn.
    excerpt:
      "StreetBond150 over concrete at Parc Guido-Nincheri's promenade Ville-de-Québec: bold flowing lines designed by Civiliti as a gateway to Space for Life and the Olympic Park.",
    problem:
      "Civiliti's design for the promenade carries a motif of bark, knots and movement through its walls, furniture and paving, and the paving needed its flowing lines in colour on concrete.",
    solution:
      "StreetBond150 applied over the concrete to draw the bold flowing lines at the centre of the promenade's landscape design. The coating bonds permanently to concrete.",
  },

  // ── Alberta ─────────────────────────────────────────────────────────────────
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
    // Stand-in was a London Transit bus on a red lane, and the homepage's
    // bus lanes card photo (Sep 2026).
    images: [
      gallery("f17c4aa634cc6a3a2703c1faa146b2f7db070672-1200x1600.jpg"), // products/mmax/mmax-03.jpg
    ],
    imageIsRepresentative: true,
    excerpt:
      "MMAX MMA bus lane surfacing on Calgary Transit's MAX BRT network: fast-cure MMA coatings in red and green applied overnight to keep Calgary's rapid transit corridors visually legible through prairie winters.",
    problem:
      "Calgary Transit's MAX BRT corridors needed bus lane coatings that could withstand Alberta's temperature extremes (from -40°C winters to +35°C summers) without the adhesion failures that defeat standard acrylic coatings.",
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
    // Stand-in showed a red rapidway bus lane like York's (Sep 2026).
    images: [
      gallery("26443ca48feff637be09d7ea9db0af70d42479a1-2400x1800.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-87.jpg
    ],
    imageIsRepresentative: true,
    excerpt:
      "TrafficPatternsXD pedestrian crossings and platform markings along Edmonton's Valley Line LRT: high-traction thermoplastic engineered for Edmonton's severe freeze-thaw cycles.",
    problem:
      "Edmonton's Valley Line LRT at-grade crossings required high-traction, long-life surface markings at pedestrian conflict zones. The city's severe winter conditions (more than 60 freeze-thaw cycles per year) eliminate standard paint within a season.",
    solution:
      "TrafficPatternsXD heat-fused thermoplastic at key crossings and platform zones along the Valley Line. The aggregate-reinforced system maintains BPN 65+ traction and full retroreflectivity through Edmonton's winter cycle without repainting.",
  },
  {
    // TODO: image Calgary Reconciliation Crosswalk
    id: "calgary-reconciliation",
    title: "Calgary Reconciliation Crosswalk",
    city: "Calgary",
    province: "AB",
    lat: 51.0520,
    lng: -114.0700,
    product: "TrafficPatterns",
    application: "Community Branding",
    // No photo (Sep 2026). The stand-in was an abstract pattern in another
    // city, and a reconciliation design cannot be stood in for by another
    // Nation's artwork.
    images: [],
    excerpt: "Custom TrafficPatterns thermoplastic crosswalk honouring reconciliation: permanent Indigenous-inspired design in Calgary's city core.",
    problem: "The City of Calgary sought a durable public art installation that would honour reconciliation commitments at a high-visibility intersection.",
    solution: "TrafficPatterns custom preformed thermoplastic with Indigenous-inspired motifs, heat-fused permanently to the asphalt surface.",
  },
  {
    // TODO: image Edmonton Whyte Ave Streetscape
    id: "edmonton-whyte-ave",
    title: "Whyte Avenue Streetscape",
    city: "Edmonton",
    province: "AB",
    lat: 53.5188,
    lng: -113.5048,
    product: "StreetBond",
    application: "Community Branding",
    // Stand-in was a Vancouver laneway (Sep 2026).
    images: [
      gallery("6261e157b8bbb248edf88e1340d01313243dec7e-1512x2016.jpg"), // products/streetbond/streetbond-29.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "StreetBond coloured pavement treatments along Edmonton's Whyte Avenue. Canada's most walkable main street gets a durable surface identity.",
    problem: "Edmonton's Whyte Avenue BIA needed pavement treatments that could communicate the street's creative, community-driven identity while surviving prairie winters.",
    solution: "StreetBond coloured coating applied at key intersections and pedestrian zones along the corridor, maintaining vivid colour through Edmonton's extreme temperature cycles.",
  },
  {
    // TODO: image Lethbridge Cultural District
    id: "lethbridge-cultural-district",
    title: "Lethbridge Cultural District",
    city: "Lethbridge",
    province: "AB",
    lat: 49.6956,
    lng: -112.8451,
    product: "DecoMark",
    application: "Community Branding",
    // Stand-in was the Windsor Gate photo from Coquitlam (Sep 2026).
    images: [
      gallery("4c717dbec699a1a050dfb8ea92514e7f27d13d74-1216x912.jpg"), // products/decomark/decomark-49.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "DecoMark custom pavement graphics anchoring Lethbridge's cultural district: wayfinding and community identity embedded in the street surface.",
    problem: "Lethbridge's cultural district needed surface treatments that could tie together civic buildings, arts venues, and pedestrian connections into a coherent identity.",
    solution: "DecoMark custom thermoplastic graphics at key nodes and crossings throughout the district, providing durable wayfinding and visual identity across the cultural corridor.",
  },

  // ── More Ontario ──────────────────────────────────────────────────────────────
  {
    // TODO: image Ottawa Every Child Matters Crosswalk
    id: "ottawa-every-child-matters",
    title: "Ottawa Every Child Matters Crosswalk",
    city: "Ottawa",
    province: "ON",
    lat: 45.4215,
    lng: -75.6972,
    product: "TrafficPatterns",
    application: "Community Branding",
    // No photo (Sep 2026). The stand-in was Georgina's crosswalk, the
    // Georgina pin's own photo, and every other Every Child Matters photo in
    // the library is that same crosswalk.
    images: [],
    excerpt: "TrafficPatterns thermoplastic crosswalk in Ottawa honouring the Every Child Matters movement: permanent orange design embedded in the nation's capital.",
    problem: "The City of Ottawa needed a permanent, visible tribute to the Every Child Matters movement at a prominent public crossing.",
    solution: "TrafficPatterns preformed thermoplastic in orange, heat-fused to the crosswalk surface, enduring through Ottawa's severe freeze-thaw winters without repainting.",
  },
  {
    // TODO: image Mississauga Civic Centre Plaza
    id: "mississauga-civic-centre",
    title: "Mississauga Civic Centre Plaza",
    city: "Mississauga",
    province: "ON",
    lat: 43.5890,
    lng: -79.6441,
    product: "StreetPrint",
    application: "Community Branding",
    // Stand-in was Vancouver's Little Italy, street sign and all (Sep 2026).
    images: [
      gallery("ad168f5619288de2309c8bb62b93faf8afce7057-2400x1800.jpg"), // products/streetprint/streetprint-56.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "StreetPrint stamped asphalt plaza treatments at Mississauga's Civic Centre: a heritage aesthetic surrounding one of Canada's most recognized civic buildings.",
    problem: "The Mississauga Civic Centre plaza required decorative surface treatments matching the landmark building's heritage aesthetic, without the maintenance liability of interlocking stone.",
    solution: "StreetPrint cobblestone-pattern stamped asphalt with warm pigment: flush, snowplow-safe, and visually consistent with the building's architectural character.",
  },
  {
    // TODO: image Hamilton James Street Crosswalk
    id: "hamilton-james-street",
    title: "Hamilton James Street North Crosswalk",
    city: "Hamilton",
    province: "ON",
    lat: 43.2557,
    lng: -79.8711,
    product: "StreetBond",
    application: "Community Branding",
    // No photo (Sep 2026). The stand-in was the Spirit Trail's thermoplastic
    // crosswalk (another pin's photo, and not StreetBond), and the library has
    // no StreetBond crosswalk without a legible sign or logo.
    images: [],
    excerpt: "StreetBond coloured crosswalk treatments on Hamilton's James Street North arts corridor: permanent colour marking one of Canada's most celebrated art-walk destinations.",
    problem: "Hamilton's James Street North BIA needed crosswalk treatments that would reflect the street's creative character and survive the city's heavy winter maintenance cycle.",
    solution: "StreetBond multi-colour installation at key crossings along the arts corridor: UV-stable, snowplow-safe, and low-maintenance for the BIA's operations team.",
  },
  {
    // TODO: image Windsor Ambassador Bridge Approach
    id: "windsor-ambassador-bridge",
    title: "Windsor Ambassador Bridge Approach",
    city: "Windsor",
    province: "ON",
    lat: 42.3149,
    lng: -83.0364,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    // Stand-in showed a Hudson's Bay store (Sep 2026).
    images: [
      gallery("30a0b0f1d380554decccd791f49ef97316a20c20-2400x1167.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-24.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "TrafficPatternsXD high-performance crosswalks at Canada's busiest commercial border crossing: durable markings engineered for extreme vehicle loads.",
    problem: "The Ambassador Bridge approach handles some of Canada's highest commercial vehicle counts. Standard painted crosswalk markings failed within weeks under the concentrated axle loads.",
    solution: "TrafficPatternsXD aggregate-reinforced thermoplastic at pedestrian crossings near the approach, engineered for the lateral forces generated by commercial truck turning movements.",
  },

  // ── More British Columbia ────────────────────────────────────────────────
  {
    // TODO: image Burnaby Active Transportation Corridor
    id: "burnaby-active-transport",
    title: "Burnaby Active Transportation Corridor",
    city: "Burnaby",
    province: "BC",
    lat: 49.2488,
    lng: -122.9805,
    product: "StreetBond",
    application: "Bike Lanes",
    // No photo (Sep 2026). The stand-in was the homepage's bike lanes card
    // photo, of no known system, and the StreetBond gallery has no bike lane.
    images: [],
    excerpt: "StreetBond green bike lane coatings across Burnaby's active transportation network: durable colour demarcation connecting SkyTrain stations to cycling routes.",
    problem: "Burnaby needed bike lane treatments that could survive the city's wet Pacific climate and frequent intersection turning movements without the constant repainting cycle of standard paint.",
    solution: "StreetBond coloured coating in green along the active transportation corridor, chemically bonded to asphalt with UV-stable pigments that hold colour through repeated wet seasons.",
  },
  {
    // TODO: image Victoria Chinatown Cultural Crosswalk
    id: "victoria-chinatown",
    title: "Victoria Chinatown Cultural Crosswalk",
    city: "Victoria",
    province: "BC",
    lat: 48.4284,
    lng: -123.3677,
    product: "DecoMark",
    application: "Community Branding",
    // No photo (Sep 2026). The stand-in was a "Yates St." street marker, a
    // different installation, and a culturally specific design cannot be
    // stood in for.
    images: [],
    excerpt: "DecoMark custom thermoplastic crosswalk celebrating Victoria's Chinatown. Canada's oldest Chinatown gets a permanent cultural marker at the Gate of Harmonious Interest.",
    problem: "The City of Victoria wanted a durable, culturally respectful crosswalk installation near the Gate of Harmonious Interest that would honour the district's heritage without requiring annual maintenance.",
    solution: "DecoMark custom preformed thermoplastic with Chinese-inspired design elements: Pantone-accurate colour fused into the asphalt surface for season-after-season visibility.",
  },
  {
    // TODO: image Nanaimo Harbour Pathway
    id: "nanaimo-harbour",
    title: "Nanaimo Harbour Pathway",
    city: "Nanaimo",
    province: "BC",
    lat: 49.1659,
    lng: -123.9401,
    product: "StreetBond",
    application: "Parks & Paths",
    // Stand-in was a painted street, of no known system (Sep 2026).
    images: [
      gallery("4f0f402b4e4f7a56f1a7ca1a25572580155bd793-2400x1800.jpg"), // products/streetbond/streetbond-92.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "StreetBond coloured pathway along Nanaimo's harbour waterfront: slip-resistant surface treatment connecting the downtown ferry terminal to the seawall.",
    problem: "Nanaimo's harbour pathway needed a coloured surface treatment that would hold up to salt air, wet conditions, and high pedestrian volume from ferry traffic.",
    solution: "StreetBond water-based coating with anti-slip aggregate in a coastal-appropriate colour, applied to the existing pathway asphalt.",
  },
  {
    // TODO: image Kamloops Active Transportation Network
    id: "kamloops-active-transport",
    title: "Kamloops Active Transportation Network",
    city: "Kamloops",
    province: "BC",
    lat: 50.6745,
    lng: -120.3273,
    product: "TrafficPatternsXD",
    application: "Bike Lanes",
    // Stand-in was a painted green lane, not TrafficPatternsXD (Sep 2026).
    images: [
      gallery("64f963ae7603150c6e38c44193e5313146a685e3-2400x1800.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-115.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "TrafficPatternsXD crosswalk treatments at key active transportation intersections across Kamloops: high-traction thermoplastic built for the Interior's temperature extremes.",
    problem: "Kamloops experiences some of BC's most extreme temperature swings, from -25°C winters to +40°C summers. Standard painted bike lane crossings failed within one season.",
    solution: "TrafficPatternsXD aggregate-reinforced thermoplastic at conflict zones along the active transportation network, engineered for the Interior's full temperature range.",
  },

  // ── Saskatchewan ───────────────────────────────────────────────────────────
  {
    // TODO: image Saskatoon Bridge City Crosswalk
    id: "saskatoon-bridge-city",
    title: "Saskatoon Bridge City Crosswalk",
    city: "Saskatoon",
    province: "SK",
    lat: 52.1332,
    lng: -106.6700,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    // Stand-in was a crosswalk of no known system (Sep 2026).
    images: [
      gallery("4168744905f577b9f08e5874b68654e85bd27207-1600x1015.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-132.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "TrafficPatternsXD crosswalks in Saskatoon's downtown core: durable thermoplastic engineered for Saskatchewan's extreme temperature range.",
    problem: "Saskatoon's downtown crosswalks experience extreme temperature cycling: -40°C winters and +35°C summers destroy standard painted markings within a season.",
    solution: "TrafficPatternsXD monolithically bonded to the asphalt surface, expanding and contracting with the pavement through Saskatchewan's full annual temperature range.",
  },
  {
    // TODO: image Regina Wascana Park Pathway
    id: "regina-wascana",
    title: "Regina Wascana Park Pathway",
    city: "Regina",
    province: "SK",
    lat: 50.4275,
    lng: -104.6183,
    product: "StreetBond",
    application: "Parks & Paths",
    // Stand-in was a street mural, not a park path (Sep 2026).
    images: [
      gallery("fddc0b74e57329e4d00fef55347aa8ca69b7e5ae-1216x912.jpg"), // products/streetbond/streetbond-43.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "StreetBond coloured pathway treatments at Wascana Centre. One of Canada's largest urban parks gets a durable, low-maintenance surface identity.",
    problem: "Wascana Centre's pathway network needed a surface treatment that could withstand Regina's harsh winters and provide year-round wayfinding clarity across the extensive park system.",
    solution: "StreetBond coloured coating on key pathway segments and crossings, providing durable colour that maintains visibility through prairie freeze-thaw cycles.",
  },

  // ── Manitoba ──────────────────────────────────────────────────────────────
  {
    // TODO: image Winnipeg Exchange District Streetscape
    id: "winnipeg-exchange-district",
    title: "Winnipeg Exchange District Streetscape",
    city: "Winnipeg",
    province: "MB",
    lat: 49.8981,
    lng: -97.1489,
    product: "StreetPrint",
    application: "Community Branding",
    // Stand-in was a coated plaza, not StreetPrint (Sep 2026).
    images: [
      gallery("9fc6ffa7cbdbe8d56b1dc6afff2a1ef2b00fe677-1800x2400.jpg"), // products/streetprint/streetprint-20.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "StreetPrint stamped asphalt in Winnipeg's Exchange District: heritage brick aesthetics for Canada's largest collection of turn-of-the-century commercial architecture.",
    problem: "Winnipeg's Exchange District National Historic Site needed pedestrian zone treatments that respected the neighbourhood's heritage character while withstanding Manitoba's severe winters.",
    solution: "StreetPrint cobblestone and brick patterns heat-stamped into asphalt, flush with the road surface and fully snowplow-compatible: no raised edges for Manitoba's plow fleet to catch.",
  },
  {
    // TODO: image Winnipeg Indigenous Cultural Garden
    id: "winnipeg-indigenous-garden",
    title: "Winnipeg Indigenous Cultural Garden",
    city: "Winnipeg",
    province: "MB",
    lat: 49.9148,
    lng: -97.1444,
    product: "DecoMark",
    application: "Community Branding",
    // No photo (Sep 2026). The stand-in was a coated plaza, not DecoMark, and
    // Indigenous cultural motifs cannot be stood in for.
    images: [],
    excerpt: "DecoMark custom thermoplastic pathway markings at Winnipeg's Indigenous Cultural Garden: permanent cultural graphics embedded in the surface of a landmark public space.",
    problem: "The Indigenous Cultural Garden required pathway and gathering area surface treatments that could carry cultural imagery through Winnipeg's extreme winter conditions without fading or cracking.",
    solution: "DecoMark custom preformed thermoplastic with Indigenous cultural motifs, applied at key pathway nodes and gathering areas throughout the garden.",
  },

  // ── Québec (additional) ───────────────────────────────────────────────────
  {
    // TODO: image Montréal Plateau Ruelle Verte
    id: "montreal-plateau-ruelle",
    title: "Montréal Plateau Ruelle Verte",
    city: "Montréal",
    province: "QC",
    lat: 45.5256,
    lng: -73.5784,
    product: "StreetBond",
    application: "Public Art",
    // Stand-in was DecoMark leaves, not StreetBond (Sep 2026).
    images: [
      gallery("a652b206012fbd1d0c2e4d2d4b2e8a3bd42e9891-2400x1800.jpg"), // products/streetbond/streetbond-84.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "StreetBond bold colours transform a Plateau-Mont-Royal back laneway into a vibrant public green corridor. Montréal's ruelle verte program meets permanent pavement art.",
    problem: "Montréal's ruelle verte program needed surface coatings that could withstand Québec winters while delivering the vivid colours central to the laneway revitalization vision.",
    solution: "StreetBond applied in the project's signature colour palette, chemically bonded to the laneway asphalt with UV-stable pigments that survive repeated freeze-thaw cycles.",
  },
  {
    // TODO: image Montréal Rosemont Vision Zéro Crosswalks
    id: "montreal-rosemont-vision-zero",
    title: "Rosemont Vision Zéro Crosswalks",
    city: "Montréal",
    province: "QC",
    lat: 45.5456,
    lng: -73.5867,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    // Stand-in was a crosswalk of no known system (Sep 2026).
    images: [
      gallery("d9f7628720a356de450523f049efd411fd477381-2400x1800.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-66.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "TrafficPatternsXD high-visibility crosswalks in Rosemont–La Petite-Patrie as part of Montréal's Vision Zéro pedestrian safety program.",
    problem: "Montréal's Rosemont borough needed high-visibility crosswalk upgrades at its most dangerous pedestrian intersections. Painted markings failed within two seasons under Québec's extreme freeze-thaw cycling.",
    solution: "TrafficPatternsXD thermoplastic crosswalks heat-fused to the asphalt surface, maintaining retroreflective performance through Montréal winters without repainting.",
  },
  {
    // TODO: image Québec City St-Roch Quartier Crosswalk
    id: "quebec-city-st-roch",
    title: "Quartier St-Roch Crosswalk",
    city: "Québec City",
    province: "QC",
    lat: 46.8156,
    lng: -71.2240,
    product: "StreetBond",
    application: "Community Branding",
    // No photo (Sep 2026). The stand-in was stamped asphalt, not StreetBond,
    // and the library has no StreetBond crosswalk without a legible sign or logo.
    images: [],
    excerpt: "StreetBond coloured crosswalks in Québec City's St-Roch quartier: durable surface identity for one of the province's most dynamic urban renewal corridors.",
    problem: "Quartier St-Roch's urban renewal required crosswalk treatments that could express the neighbourhood's creative identity while surviving Québec City's heavy winter maintenance program.",
    solution: "StreetBond coloured coating at key intersections through the quartier, UV-stable through multiple seasons of salt, plowing, and Québec's characteristically heavy snowfall.",
  },
  {
    // TODO: image Laval Carrefour Crosswalk
    id: "laval-carrefour",
    title: "Laval Carrefour Transit Crosswalk",
    city: "Laval",
    province: "QC",
    lat: 45.5581,
    lng: -73.7476,
    product: "TrafficPatternsXD",
    application: "Bus & Bike Lanes",
    // Stand-in was a red resin bus lane, not TrafficPatternsXD (Sep 2026).
    images: [
      gallery("36e464258260863cdc0bd82d08c00e4cd8b73d66-1800x2400.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-64.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "TrafficPatternsXD crosswalk and bus lane treatments at Laval's Carrefour transit hub: high-durability surface markings at one of Québec's busiest transit interchanges.",
    problem: "The Carrefour transit hub handles high bus volumes and thousands of daily pedestrian movements. Painted markings at the modal interchange failed rapidly under turning bus loads.",
    solution: "TrafficPatternsXD at pedestrian conflict zones and bus lane delineations: aggregate-reinforced thermoplastic with zero documented edge damage through multiple Québec winters.",
  },

  // ── Atlantic Canada ──────────────────────────────────────────────────────
  {
    // TODO: image Halifax Waterfront Boardwalk
    id: "halifax-waterfront",
    title: "Halifax Waterfront Boardwalk",
    city: "Halifax",
    province: "NS",
    lat: 44.6488,
    lng: -63.5752,
    product: "StreetBond",
    application: "Parks & Paths",
    // No photo (Sep 2026). The stand-in was a coloured path of no known
    // system, and the StreetBond gallery's other waterfront paths are
    // recognisable places (Osoyoos, Victoria's cruise terminal).
    images: [],
    excerpt: "StreetBond coloured pathway treatments along Halifax's waterfront: slip-resistant surface coating for one of Canada's most visited harbour promenades.",
    problem: "Halifax's waterfront boardwalk area needed durable, slip-resistant surface treatments that could handle salt air, heavy summer tourist traffic, and Nova Scotia's winter maintenance.",
    solution: "StreetBond anti-slip coating applied along the waterfront pathway, providing year-round traction and colour definition in an exposed salt-air marine environment.",
  },
  {
    // TODO: image Moncton Main Street Crosswalk
    id: "moncton-main-street",
    title: "Moncton Main Street Crosswalk",
    city: "Moncton",
    province: "NB",
    lat: 46.0878,
    lng: -64.7782,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    // Stand-in was a retail parking lot of no known system (Sep 2026).
    images: [
      gallery("e60b2bcab1aca9fd011add6defa58f854f9a2e29-2400x1800.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-82.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "TrafficPatternsXD decorative crosswalks on Moncton's Main Street: durable thermoplastic marking the heart of New Brunswick's largest city.",
    problem: "Moncton's Main Street commercial corridor needed crosswalk treatments that could hold up under the city's substantial winter maintenance program and high vehicle volumes.",
    solution: "TrafficPatternsXD installed at key Main Street crossings: aggregate-reinforced, snowplow-safe, and maintenance-free through Atlantic Canada's wet winters.",
  },
  {
    // TODO: image Charlottetown Confederation Landing
    id: "charlottetown-confederation-landing",
    title: "Charlottetown Confederation Landing",
    city: "Charlottetown",
    province: "PE",
    lat: 46.2381,
    lng: -63.1311,
    product: "StreetPrint",
    application: "Community Branding",
    // Stand-in was a coated path, not StreetPrint (Sep 2026).
    images: [
      gallery("d57fb0cd6b7bb0a61c1863c60c046dcadcd38e77-2400x1800.jpg"), // products/streetprint/streetprint-16.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "StreetPrint stamped asphalt at Charlottetown's Confederation Landing: heritage cobblestone aesthetics honouring the birthplace of Confederation.",
    problem: "Charlottetown's Confederation Landing historic area needed surface treatments consistent with its heritage character. Traditional stone pavers required ongoing maintenance under PEI's frost-heave conditions.",
    solution: "StreetPrint cobblestone-pattern stamped asphalt: the historic aesthetic without the maintenance. Flush surface handles frost-heave and snowplow operations without structural disruption.",
  },
  {
    // TODO: image St. John's Jellybean Row
    id: "st-johns-jellybean-row",
    title: "St. John's Jellybean Row Streetscape",
    city: "St. John's",
    province: "NL",
    lat: 47.5648,
    lng: -52.7085,
    product: "StreetBond",
    application: "Community Branding",
    // Stand-in was a crosswalk at Stan Clarke Park, its sign legible (Sep 2026).
    images: [
      gallery("32d21a901168a38ea0cccaea52f920ac65775187-2049x1537.jpg"), // products/streetbond/streetbond-86.jpg
    ],
    imageIsRepresentative: true,
    excerpt: "StreetBond coloured pavement treatments complementing St. John's iconic Jellybean Row, a surface palette as vivid as the Victorian rowhouses above.",
    problem: "St. John's vibrant Jellybean Row neighbourhood needed street surface treatments that could echo the area's famous colour palette and survive Newfoundland's extreme freeze-thaw climate.",
    solution: "StreetBond in bold complementary colours at key pedestrian crossings and gathering areas: UV-stable coating engineered to survive the Atlantic freeze-thaw cycle.",
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
