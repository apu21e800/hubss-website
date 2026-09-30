// lib/map-projects.ts — the homepage project map's dataset.
//
// One list, curated by hand below. scripts/gen-map-blog.mjs reads it at build
// time to count the pins (lib/map-count.json) and to warn about any pin whose
// write-up is not published.
import blogIndex from "./blog-index.json";

export interface MapProject {
  id: string;
  /** The site's own name, sentence case. The card prints the place under it. */
  title: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  /** The system the job is known for. Links to its product page and drives the filter. */
  product: string;
  /** Other HUB systems on the same job, as its source names them. */
  systems?: string[];
  application: string;
  /** Install year as a 4-digit string, only where a source gives one. */
  year?: string;
  /**
   * True when the source names the town or the corridor but not the site, or
   * when the site was matched from the photograph rather than from a source.
   * The card says so, and the camera stops at city scale for it.
   */
  approximate?: boolean;
  /**
   * Every photo is of this installation (28 Sep 2026 rule, Vern: "no fake
   * locations"). A Sanity CDN URL (cdn), or a file in /public/images/map
   * (local) with a 640px "-sm" twin. Neither ever goes through /_next/image.
   * May be empty: a pin whose job is real but has no photo shows none.
   */
  images: string[];
  /**
   * Kept so the "Representative" tag still works if a stand-in photo is ever
   * brought back with Doug's say-so. Unused since 28 Sep 2026.
   */
  imageIsRepresentative?: boolean;
  /** The Insights post that documents the job. Becomes `slug` when that post is published. */
  post?: string;
  /** The Idea Book (Volume 5) page that shows the job: /idea-book/<page>. */
  ideaBookPage?: number;
  excerpt: string;
  problem?: string;
  solution?: string;
  /** Set from `post` when the post is published. Never set by hand. */
  slug?: string;
}

/** A photo on Sanity's CDN, by its asset file name (the comment names the original). */
const cdn = (file: string) => `https://cdn.sanity.io/images/9dbro2m1/production/${file}`;
/** A photo in /public/images/map, which has a 640px twin named <name>-sm.jpg. */
const local = (name: string) => `/images/map/${name}.jpg`;

// What earns a pin (28 Sep 2026, widened 30 Sep 2026). Vern: "map only real projects with
// geographical locations, lots of accurate images ... no fake locations", then "more locations
// on the map the better" and "add real images and locations ... you should have enough metadata
// and images". A pin needs a real job at a real place, documented by a published Insights post
// or by the Idea Book (Volume 5, Doug-approved; its caption names the place and the system), and
// every photo on it is of that job. The Idea Book pins came from its captions and page text,
// placed by research on 30 Sep 2026 (municipal pages, news, installers' project pages, imagery);
// each comment says what places the pin and how sure it is. Where only the town is known, or the
// site was matched from the photograph, the pin is `approximate`. Where the book's caption and
// the evidence disagree, the evidence places the pin and the comment says so (flagged for Doug).
// The 26 stand-in pins removed on 28 Sep 2026 stay removed. Photos come from Sanity's CDN (the
// Idea Book photos all have gallery copies there, matched by perceptual hash) or, for the twelve
// that do not, from /public/images/map.
const curatedProjects: MapProject[] = [
  // ── Yukon ───────────────────────────────────────────────────────────────────────
  {
    // Idea Book p.113: "Acknowledgement, cast in pavement. Whitehorse, Yukon |
    // TrafficPatterns". The Cultural Centre is in the photo; CBC places the crosswalks at
    // Front and Black Streets.
    id: "whitehorse-kwanlin-dun",
    title: "Kwanlin Dün Cultural Centre crosswalks",
    city: "Whitehorse",
    province: "YT",
    lat: 60.7246,
    lng: -135.0538,
    product: "TrafficPatterns",
    application: "Community Branding",
    images: [
      cdn("f07ab2a9d2f944b128d54084fa1623b78736a0c6-1184x864.jpg"), // applications/public-art/public-art-04 (Idea Book p.113)
    ],
    ideaBookPage: 113,
    excerpt:
      "Truth and reconciliation crosswalks in TrafficPatterns in front of the Kwanlin Dün Cultural Centre on the Whitehorse waterfront.",
  },
  // ── British Columbia ────────────────────────────────────────────────────────────
  {
    // Idea Book p.126: "Community colours. Nanaimo, British Columbia | TrafficPatterns".
    // The Nanaimo Bulletin places it at Commercial and Bastion (June 2025). Square One
    // lists it as TrafficPatternsXD: the book is followed, and the difference is flagged
    // for Doug.
    id: "nanaimo-pride-intersection",
    title: "Pride intersection, Commercial and Bastion",
    city: "Nanaimo",
    province: "BC",
    lat: 49.1666,
    lng: -123.9370,
    product: "TrafficPatterns",
    application: "Community Branding",
    year: "2025",
    images: [
      local("nanaimo-pride-intersection"), // Idea Book p.126
    ],
    ideaBookPage: 126,
    excerpt:
      "A Progress Pride intersection at Commercial and Bastion Streets in downtown Nanaimo, finished in June 2025.",
  },
  {
    // Pin at Cowrie Street and Trail Avenue, as the post says.
    id: "sechelt-pictograph-crosswalk",
    title: "Pictograph crosswalk",
    city: "Sechelt",
    province: "BC",
    lat: 49.4721,
    lng: -123.7591,
    product: "TrafficPatterns",
    application: "Community Branding",
    year: "2022",
    images: [
      cdn("28162f3825d4d5730ad199f1a04024c81d4e6a99-1200x900.jpg"), // blog/pictograph-crosswalk-sechelt/featured.jpg
    ],
    post: "pictograph-crosswalk-sechelt",
    excerpt:
      "A pictograph-themed crosswalk at Cowrie Street and Trail Avenue in Sechelt that tells the origin story of the shíshálh Nation, unveiled by local Indigenous artist Dionne Paul and artist Lindsey Kyoko Adams.",
    problem:
      "Crosswalk art for the District of Sechelt: a pictograph design telling the shíshálh Nation's origin story, and Lindsey Kyoko Adams' bee and dogwood crossings about the importance of pollinators.",
    solution:
      "TrafficPatterns preformed thermoplastic inlaid into imprinted asphalt with StreetHeat reheating, which protects it from wear so it keeps its bold look. Installed in spring 2022; materials supplied by Square One Paving.",
  },
  {
    // The post gives 5500 Sunshine Coast Hwy, "at the southern entrance to the Town
    // of Sechelt". That address could not be placed with confidence, so the pin sits
    // in downtown Sechelt (Cowrie St and Wharf Ave), approximate.
    // 30 Sep 2026: second photo, Idea Book p.124 ("Sunshine Coast, British Columbia |
    // TrafficPatterns"), the same crossing. The book's text on that page describes the
    // pictograph crosswalk; flagged for Doug.
    id: "sechelt-tsain-ko",
    title: "Tsain-Ko Centre crosswalk",
    city: "Sechelt",
    province: "BC",
    lat: 49.4721,
    lng: -123.7545,
    product: "TrafficPatterns",
    application: "Community Branding",
    approximate: true,
    images: [
      cdn("2ced76be80c010052d202d5ae9954ce26df3ba60-1200x900.jpg"), // blog/tsain-ko-crosswalk-sechelt/featured.jpg
      cdn("2989afe3691e1fa7e7959fd44f3766b5148cab85-1184x864.jpg"), // applications/public-art/public-art-05 (Idea Book p.124)
    ],
    post: "tsain-ko-crosswalk-sechelt",
    ideaBookPage: 124,
    excerpt:
      "A TrafficPatterns crosswalk with an Indigenous motif at Tsain-Ko Centre, at the southern entrance to Sechelt on shíshálh Nation territory.",
    problem:
      "The crosswalk at Tsain-Ko Centre, 5500 Sunshine Coast Highway, needed to draw attention for safety and look good in its own right.",
    solution:
      "TrafficPatterns preformed thermoplastic carrying an Indigenous motif, designed to draw attention to the crossing. Installed by Square One Paving.",
  },
  {
    // Idea Book p.55: "Cowichan Valley, British Columbia" (file: roundabout median,
    // StreetPrint). Matched from imagery, not a source, to the Bell McKinnon Rd and Herd Rd
    // roundabout: approximate.
    id: "cowichan-roundabout",
    title: "Roundabout apron",
    city: "North Cowichan",
    province: "BC",
    lat: 48.8183,
    lng: -123.7131,
    product: "StreetPrint",
    application: "Traffic Calming",
    approximate: true,
    images: [
      cdn("e3f43c69a926c36fafd00a8045e7e3796d55acce-1184x864.jpg"), // applications/traffic-calming/traffic-calming-57 (Idea Book p.55)
    ],
    ideaBookPage: 55,
    excerpt:
      "A StreetPrint brick apron on a new roundabout in the Cowichan Valley.",
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
      cdn("203c5601a2be53448f6fdb484f2a7a1fb483f3a2-1200x778.jpg"), // products/streetbond/streetbond-97.jpg
    ],
    post: "pedestrian-channelization-public-spaces",
    excerpt:
      "StreetBond Safety Blue on Victoria's David Foster Harbour Pathway, which runs over five kilometres from Rock Bay to Ogden Point and recognizes Lekwungen First Nations history and the working harbour.",
    problem:
      "The renovation of Victoria's harbour pathway, a route shared by residents and visitors, called for high-visibility colour.",
    solution:
      "StreetBond coating in high-visibility Safety Blue on the renovated pathway: water-based and slip-resistant.",
  },
  {
    // Post: decorative-paving-solutions ("Vic High, Victoria, BC... DecoMark +
    // StreetBond... May 2024"). Idea Book p.30 (DecoMark) and p.128 ("First Nations
    // Reconciliation. Victoria... StreetPrint, DecoMark & StreetBond"), both at Vic High,
    // 1260 Grant St.
    id: "victoria-high-school",
    title: "Victoria High School",
    city: "Victoria",
    province: "BC",
    lat: 48.4298,
    lng: -123.3459,
    product: "DecoMark",
    systems: ["StreetBond", "StreetPrint"],
    application: "Community Branding",
    year: "2024",
    images: [
      cdn("572a2f47001ab35bc0808df525f7dd49c81ec195-1800x2400.jpg"), // the whorl (Idea Book p.30)
      cdn("5d7c9961b8ca1deed12a0ec015bdac916b5aed3e-2400x1800.jpg"), // the canoe run (Idea Book p.128)
    ],
    post: "decorative-paving-solutions",
    ideaBookPage: 30,
    excerpt:
      "A First Nations whorl at the foot of the school steps and a canoe run across the plaza, in DecoMark, StreetBond and StreetPrint, finished in May 2024.",
  },
  {
    // Pin at Snug Cove (it was 700 m away in the woods).
    id: "bowen-island-path",
    title: "Snug Cove path",
    city: "Bowen Island",
    province: "BC",
    lat: 49.3795,
    lng: -123.3314,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      cdn("b50031427717c4d11b5b8f4a97579fbfa82ca52e-1200x900.jpg"), // blog/bowen-island-asphalt-path/featured.jpg
    ],
    post: "bowen-island-asphalt-path",
    excerpt:
      "A decorative path at Snug Cove on Bowen Island in StreetBond150, its custom colours named Forest, Sunset, Water and Earth, with caricatures of local fauna.",
    problem:
      "The Snug Cove path was to carry a public art feature, which meant a surface that would resist peeling, cracking and fading.",
    solution:
      "StreetBond150 coatings in four custom colours, bonded permanently to the asphalt and flexible enough to move with it, so they will not peel, delaminate or shrink-crack.",
  },
  {
    // Pin at University Boulevard and Wesbrook Mall, as the post says. Photos: the
    // post's own, educational-facilities' (the same crossing, Musqueam wordmark),
    // and traffic-patterns-88 to -90, the install of this design (gallery captions:
    // UBC; the crest fields and colours match).
    id: "ubc-musqueam",
    title: "UBC Musqueam crosswalk",
    city: "Vancouver",
    province: "BC",
    lat: 49.2664,
    lng: -123.2455,
    product: "TrafficPatterns",
    application: "Community Branding",
    images: [
      cdn("d2c1e165208423a75255e72eea43312489359002-1200x900.jpg"), // blog/ubc-musqueam-crosswalk/featured.jpg
      cdn("8bc781dae7108dbc17c8a6bed5804f497340c9ab-1200x675.jpg"), // cdn.sanity.io/images/9dbro2m1/production/8bc781dae7108dbc17c8a6bed5804f497340c9ab-1200x675.jpg", // educational-facilities' hero
      cdn("934b7f0da9484daca3fe416404ea9f69549bc02a-2400x1800.jpg"), // products/traffic-patterns/traffic-patterns-89.jpg
      cdn("129d0194739cf016f2f041136c82ac42d04b0387-2400x1800.jpg"), // products/traffic-patterns/traffic-patterns-90.jpg
      cdn("d9ee32e490cf1880569cdf6fbd654041227dc76e-2400x1800.jpg"), // products/traffic-patterns/traffic-patterns-88.jpg
    ],
    post: "ubc-musqueam-crosswalk",
    ideaBookPage: 106,
    excerpt:
      "A feature crosswalk at University Boulevard and Wesbrook Mall, with the UBC and Musqueam crests woven together to acknowledge that UBC stands on unceded Musqueam territory.",
    problem:
      "The University Boulevard intersection is the main gateway to campus, and its upgrade was meant to give arrivals a sense of place.",
    solution:
      "TrafficPatterns preformed thermoplastic carrying a design created by UBC and Musqueam together, installed by Square One.",
  },
  {
    // Idea Book p.121: "Catholic Diocese of Vancouver | DuraTherm". The school sign is in
    // the photo: 3745 W 28th Ave, Dunbar.
    id: "vancouver-immaculate-conception",
    title: "Immaculate Conception School",
    city: "Vancouver",
    province: "BC",
    lat: 49.2476,
    lng: -123.1877,
    product: "DuraTherm",
    application: "Public Spaces",
    images: [
      local("vancouver-immaculate-conception"), // Idea Book p.121
    ],
    ideaBookPage: 121,
    excerpt:
      "A blue DuraTherm honeycomb leading to the doors of Immaculate Conception School, for the Catholic Diocese of Vancouver.",
  },
  {
    // Pin at Richmond-Brighouse Station on No. 3 Road.
    // 30 Sep 2026: photos from Idea Book p.7 and p.99 ("Pedestrian channelization.
    // Richmond, British Columbia | TrafficPatternsXD", at No. 3 Rd and Cook Rd, beside the
    // station).
    id: "richmond-brighouse",
    title: "Brighouse Station crosswalks",
    city: "Richmond",
    province: "BC",
    lat: 49.1681,
    lng: -123.1363,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      cdn("62261a74578960854593507a0ec08d02cf1e81b5-1200x900.jpg"), // blog/richmond-brighouse-crosswalk/featured.jpeg
      local("richmond-brighouse-station"), // Idea Book p.7 (file: Richmond Brighouse crosswalk)
      cdn("a92aa594f8e41dd9951c0567f349d413e24ac260-2200x1238.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-136 (Idea Book p.99)
    ],
    post: "richmond-brighouse-crosswalk",
    ideaBookPage: 7,
    excerpt:
      "TrafficPatternsXD crosswalks at TransLink's Brighouse Station in Richmond, within the development area and across No. 3 Road.",
    problem:
      "The Brighouse Station improvements needed crosswalks, across No. 3 Road and within the development area, that would hold up under high-traffic road conditions and stay skid-resistant.",
    solution:
      "TrafficPatternsXD, aggregate-reinforced preformed thermoplastic set into the asphalt: colour-stable and skid-resistant, with the look of brick or paving stone and none of the upkeep of loose pavers.",
  },
  {
    // Idea Book p.130: "The first thing a customer walks on. Granville Island, Vancouver |
    // TrafficPatternsXD". Square One published the same photo of its crossing at Granville
    // Island Brewing, 1441 Cartwright St.
    id: "vancouver-granville-island",
    title: "Granville Island Brewing crosswalk",
    city: "Vancouver",
    province: "BC",
    lat: 49.2705,
    lng: -123.1358,
    product: "TrafficPatternsXD",
    application: "Commercial Spaces",
    images: [
      cdn("fd5b0461832d32634e8ee7ca5d7bfa9c7779b10c-2400x1800.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-45 (Idea Book p.130)
    ],
    ideaBookPage: 130,
    excerpt:
      "A TrafficPatternsXD crosswalk outside Granville Island Brewing: the first thing its customers walk on.",
  },
  {
    // Pin at the hospital, 4480 Oak Street (it was 1 km west of it).
    // 30 Sep 2026: second photo, Idea Book pp.94–95 ("StreetBond | DecoMark").
    id: "bc-childrens-hospital",
    title: "BC Children's Hospital labyrinth",
    city: "Vancouver",
    province: "BC",
    lat: 49.2445,
    lng: -123.1254,
    product: "StreetBond",
    systems: ["DecoMark"],
    application: "Parks & Paths",
    images: [
      cdn("c5ca6ae81e7e8da1698a9c6e2fe5bfe2f25046c6-1600x1200.jpg"), // blog/bc-childrens-hospital-labyrinth/featured.jpg
      cdn("44401860b10a412b05dd329a1e1ae60ff120e597-2400x1800.jpg"), // applications/parks-paths/parks-paths-144 (Idea Book p.94)
    ],
    post: "bc-childrens-hospital-labyrinth",
    ideaBookPage: 95,
    excerpt:
      "Decorative paving and a labyrinth at BC Women and Children's Hospital in Vancouver: StreetBond coatings, with DecoMark icons of animals native to BC and their young.",
    problem:
      "Connect Landscape Architecture's hardscape design for the hospital called for playful and meditative spaces on the ground-level plaza and on the outdoor areas off the wards.",
    solution:
      "StreetBond on new acid-etched concrete, including a labyrinth on the deck of one level, and DecoMark icons applied to concrete and to precast tiles fitted off-site before they were lifted into place. Installed by Square One Paving.",
  },
  {
    // Idea Book p.104: "Neighbourhood colour. Vancouver, British Columbia | StreetBond"
    // (file: 18th and Cambie). The City's Cambie-18th plaza, W 18th Ave just west of
    // Cambie.
    id: "vancouver-cambie-18th",
    title: "Cambie and 18th plaza",
    city: "Vancouver",
    province: "BC",
    lat: 49.2550,
    lng: -123.1155,
    product: "StreetBond",
    application: "Public Spaces",
    images: [
      cdn("676b984d77cbadce24a6768cf9a44a57e8c259c7-2400x1800.jpg"), // applications/parks-paths (Idea Book p.104)
    ],
    ideaBookPage: 104,
    excerpt:
      "Pastel StreetBond rings and bands on the City of Vancouver's plaza at Cambie Street and West 18th Avenue.",
  },
  {
    // Post: laneway-project (More Awesome Now, "Alley Oops", downtown Vancouver). Its
    // hero is Toronto's Leslieville lane, and the stand-in that was here could not be
    // tied to the lane, so the pin shows no photo. Downtown Vancouver, approximate.
    id: "vancouver-laneways",
    title: "More Awesome Now laneways",
    city: "Vancouver",
    province: "BC",
    lat: 49.2845,
    lng: -123.1098,
    product: "StreetBond",
    application: "Public Art",
    approximate: true,
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
    // Post: parc-riviera-streetbond-walkway. Idea Book p.75: "Richmond, British Columbia"
    // (Townhomes spread). Parc Riviera Mews, 10199 River Dr.
    id: "richmond-parc-riviera",
    title: "Parc Riviera Mews walkway",
    city: "Richmond",
    province: "BC",
    lat: 49.1991,
    lng: -123.1096,
    product: "StreetBond",
    application: "Townhomes",
    images: [
      cdn("6fea36490f1b5d527929469cdb3e02718f8a1966-1800x2400.jpg"), // applications/townhomes/townhomes-20 (Idea Book p.75)
      cdn("d5fec79770aac9339f16507dcaf2489cb285bb60-1200x900.jpg"), // the write-up's hero
    ],
    post: "parc-riviera-streetbond-walkway",
    ideaBookPage: 75,
    excerpt:
      "A red and black StreetBond checkerboard on the walkway between rows of townhomes at Parc Riviera Mews.",
  },
  {
    // The trail runs from Horseshoe Bay to Deep Cove and the post names no single
    // crossing: pin on the City of North Vancouver waterfront, approximate.
    id: "north-van-spirit-trail",
    title: "Spirit Trail crossings",
    city: "North Vancouver",
    province: "BC",
    lat: 49.3125,
    lng: -123.0839,
    product: "DuraTherm",
    systems: ["DecoMark"],
    application: "Crosswalks",
    approximate: true,
    images: [
      cdn("83d82900e46ce407544ebe3ac466d3b6a1188cac-1600x1200.jpg"), // blog/spirit-trail-wayfinding-vancouver/featured.jpg
    ],
    post: "spirit-trail-wayfinding-vancouver",
    excerpt:
      "DuraTherm 'Spirit' crosswalks wherever the Spirit Trail crosses a principal road, with DecoMark wayfinding markings along the North Shore greenway.",
    problem:
      "The Spirit Trail, a 35 km greenway planned from Horseshoe Bay to Deep Cove, joins up the North Shore's isolated public spaces, and needed a consistent identity where it meets the road network.",
    solution:
      "DuraTherm, a customizable decorative paving system inlaid into the asphalt, for the 'Spirit' crosswalks, added year by year as the trail grows, and DecoMark markings as horizontal signage that guides people to the trail.",
  },
  {
    // The post names three crossings (East 1st Avenue, East 4th Avenue and Charles
    // Street on Commercial Drive); the pin sits at East 1st, the middle one.
    id: "vancouver-commercial-drive",
    title: "Little Italy crosswalks, Commercial Drive",
    city: "Vancouver",
    province: "BC",
    lat: 49.2695,
    lng: -123.0696,
    product: "TrafficPatterns",
    systems: ["DecoMark"],
    application: "Crosswalks",
    year: "2019",
    images: [
      cdn("38f5bf1991fcc205701cc41c716356e202be0acc-1072x804.jpg"), // blog/decorative-crosswalk-commercial-drive/featured.jpg
    ],
    post: "decorative-crosswalk-commercial-drive",
    ideaBookPage: 105,
    excerpt:
      "Three crosswalks in the green, white and red of the Italian flag, marking Vancouver's Little Italy on Commercial Drive: TrafficPatterns thermoplastic with DecoMark graphics.",
    problem:
      "The City of Vancouver had recognized eight blocks of Commercial Drive as the city's historic Little Italy, and the crossings were a chance to give the area definition.",
    solution:
      "TrafficPatterns preformed thermoplastic crosswalks at East 1st Avenue, East 4th Avenue and Charles Street, with DecoMark graphics, installed by Square One in time for Italian Day on The Drive.",
  },
  {
    // Idea Book p.38, the PreMark page: "City of Delta, British Columbia". The building is
    // the Delta Hotels by Marriott at Cascades Casino Delta, 6005 Highway 17A, under
    // construction.
    id: "delta-cascades-casino",
    title: "Cascades Casino Delta",
    city: "Delta",
    province: "BC",
    lat: 49.1100,
    lng: -123.0553,
    product: "PreMark",
    application: "Crosswalks",
    images: [
      cdn("45eeb1538a81716f5dd63fc3c92fe5c3a01ef77f-1200x900.jpg"), // products/premark/premark-01 (Idea Book p.38)
    ],
    ideaBookPage: 38,
    excerpt:
      "PreMark crosswalk markings on the access road to the new hotel at Cascades Casino Delta.",
  },
  {
    // Idea Book p.118: "Burnaby, British Columbia | StreetBond". The park is not
    // identified: pin at city hall, approximate.
    id: "burnaby-basketball-court",
    title: "Basketball court",
    city: "Burnaby",
    province: "BC",
    lat: 49.2430,
    lng: -122.9727,
    product: "StreetBond",
    application: "Sport Courts",
    approximate: true,
    images: [
      local("burnaby-basketball-court"), // Idea Book p.118
    ],
    ideaBookPage: 118,
    excerpt:
      "A basketball court in StreetBond with a flower at centre court, in Burnaby.",
  },
  {
    // Idea Book p.80: "New Westminster, British Columbia" (file: Oxford townhomes). Oxford
    // Townhomes, 728 Ewen Ave, Queensborough; Square One records StreetPrint and StreetBond
    // on its laneways.
    id: "new-westminster-oxford",
    title: "Oxford Townhomes laneways",
    city: "New Westminster",
    province: "BC",
    lat: 49.1879,
    lng: -122.9405,
    product: "StreetPrint",
    systems: ["StreetBond"],
    application: "Townhomes",
    images: [
      cdn("9cb38dd6928271deee36b97e05901703b5e1dfdb-1800x2400.jpg"), // applications/townhomes/townhomes-21 (Idea Book p.80)
    ],
    ideaBookPage: 80,
    excerpt:
      "Charcoal StreetPrint on the strata laneways of Oxford Townhomes in Queensborough.",
  },
  {
    // Pin on Front Street, where the Mews is. A shared street, so Public Spaces.
    id: "new-westminster-complete-streets",
    title: "Front Street Mews",
    city: "New Westminster",
    province: "BC",
    lat: 49.2020,
    lng: -122.9085,
    product: "StreetBond",
    systems: ["TrafficPatterns"],
    application: "Public Spaces",
    year: "2017",
    images: [
      cdn("64ac2863fdfc84a26959e4b2fdf2f56ed41448aa-1080x720.jpg"), // blog/complete-streets-new-westminster/featured.jpg
    ],
    post: "complete-streets-new-westminster",
    excerpt:
      "Front Street Mews, a Complete Streets redevelopment: contrasting grey bands run through street and sidewalk alike, in TrafficPatterns on the roadway and StreetBond150 on the concrete sidewalks.",
    problem:
      "New Westminster redesigned the old Frontage Road as a mews: a shared, pedestrian-friendly street that called for one continuous pavement treatment across roadway and sidewalk.",
    solution:
      "Contrasting grey bands in TrafficPatterns preformed thermoplastic on the roadway and StreetBond150 coating on the concrete sidewalks, installed by Square One Paving.",
  },
  {
    // Idea Book p.129: "Waterpark surface coating... Bear Creek Park, Surrey, British
    // Columbia | StreetBond". OpenStreetMap maps the splash pad here.
    id: "surrey-bear-creek-spray-park",
    title: "Bear Creek Park spray park",
    city: "Surrey",
    province: "BC",
    lat: 49.1603,
    lng: -122.8403,
    product: "StreetBond",
    application: "Splash Pads",
    images: [
      cdn("adc864c3b43a4cb05e0397f1406ca14610d74d22-2400x1800.jpg"), // applications/splash-pads/splash-pads-26 (Idea Book p.129)
    ],
    ideaBookPage: 129,
    excerpt:
      "StreetBond on the Bear Creek Park spray park, holding vivid colour and a slip-resistant texture under constant water and bare feet.",
  },
  {
    // Pin at the foot of the pier on Marine Drive (it was 500 m inland).
    id: "white-rock-pier",
    title: "White Rock Pier crosswalk",
    city: "White Rock",
    province: "BC",
    lat: 49.0195,
    lng: -122.8057,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      cdn("ed2f3c3d1553b0fbe1eabd7598ebc5bd392d169c-206x134.jpg"), // blog/white-rock-pier-crosswalk/featured.png
    ],
    post: "white-rock-pier-crosswalk",
    excerpt:
      "A TrafficPatternsXD decorative crosswalk at the White Rock Pier, installed by Square One among the upgrades for the pier's reopening after its storm repairs.",
    problem:
      "White Rock was reopening its pier after repairing the storm-damaged section, and the upgrades included a decorative crosswalk that had to take heavy traffic without the upkeep of pavers.",
    solution:
      "TrafficPatternsXD, aggregate-reinforced preformed thermoplastic set into the asphalt: a brick or paving-stone look, skid-resistant as it wears, and smooth underfoot for pedestrians and wheelchairs.",
  },
  {
    // The post places Seaside Stroll on Johnston Road in Uptown and names no cross
    // street: pin on Johnston Road, Uptown.
    id: "white-rock-seaside-stroll",
    title: "Seaside Stroll crosswalk",
    city: "White Rock",
    province: "BC",
    lat: 49.0266,
    lng: -122.8012,
    product: "TrafficPatterns",
    application: "Community Branding",
    images: [
      cdn("52e14368c9d3256f5fa5623f2f5d9cd22f6c4e15-1200x848.jpg"), // blog/white-rock-langley-trafficpatterns/featured.jpg
    ],
    post: "white-rock-langley-trafficpatterns",
    ideaBookPage: 69,
    excerpt:
      "Artist Amy Bao's wave-inspired crosswalk mural on Johnston Road: TrafficPatterns thermoplastic that brought the White Rock waterfront identity into the Uptown district.",
    problem:
      "White Rock's Uptown district had long been overshadowed by the waterfront. The city commissioned artist Amy Bao to design a crosswalk that would carry the waterfront inland, in a material that would not fade within months the way painted murals do.",
    solution:
      "TrafficPatterns preformed thermoplastic panels, heat-applied and bonded into the asphalt, capturing the fine detail of Bao's flowing wave lines in slip-resistant, UV-stable colour.",
  },
  {
    // Pin at Windsor Gate (named as such on the map), River Springs, Coquitlam.
    id: "coquitlam-windsor-gate",
    title: "Windsor Gate",
    city: "Coquitlam",
    province: "BC",
    lat: 49.2797,
    lng: -122.7849,
    product: "StreetPrint",
    application: "Community Branding",
    images: [
      cdn("619ee048f825375acd4abcde8dc08bf0022738fc-1200x837.jpg"), // blog/community-branding-case-study/featured.jpg
    ],
    post: "community-branding-case-study",
    excerpt:
      "Polygon Realty's Windsor Gate community in Coquitlam: StreetPrint stamped asphalt roadways with a brick-street look and the community's logo mark built into the surface.",
    problem:
      "Polygon Realty wanted branding on the roadways around Windsor Gate, so that a series of properties around a central club would read as one integrated neighbourhood.",
    solution:
      "StreetPrint genuine stamped asphalt in a brick pattern, with the tricolour logo mark of the community worked into the road surfaces, walkways and dividers near the properties.",
  },
  {
    // The post names Port Coquitlam and no address: pin at city hall, approximate.
    id: "coquitlam-terry-fox",
    title: "Terry Fox plaza",
    city: "Port Coquitlam",
    province: "BC",
    lat: 49.2622,
    lng: -122.7806,
    product: "StreetBond",
    systems: ["DecoMark"],
    application: "Community Branding",
    approximate: true,
    images: [
      cdn("8d19d5d278e9e6e9e2f7d2ca07a85d2e4c9c8c11-1200x900.jpg"), // blog/terry-fox-plaza-coquitlam/featured.jpg
    ],
    post: "terry-fox-plaza-coquitlam",
    excerpt:
      "A decorative asphalt plaza map honouring Terry Fox in Port Coquitlam: StreetBond150 coatings, with DecoMark wayfinding markings.",
    problem:
      "The Terry Fox plaza in Port Coquitlam needed its map in a finish that was both decorative and durable, without adding upkeep.",
    solution:
      "StreetBond150 coatings for the plaza map, bonded permanently to the asphalt, with DecoMark thermoplastic for the wayfinding and surface markings.",
  },
  {
    // Idea Book pp.82–83: "Sheffield Park · Coquitlam, British Columbia". 3510 Sheffield
    // Ave.
    id: "coquitlam-sheffield-park",
    title: "Sheffield Park",
    city: "Coquitlam",
    province: "BC",
    lat: 49.2976,
    lng: -122.7428,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      local("coquitlam-sheffield-park"), // Idea Book p.83
    ],
    ideaBookPage: 83,
    excerpt:
      "StreetBond polka dots and colour waves curving around the spray pad at Sheffield Park on Burke Mountain.",
  },
  {
    // The post names Pitt Meadows and no street: pin at city hall, approximate. No
    // year (2021 had no source) and no "residential" (the post does not say).
    id: "pitt-meadows-natures-walk",
    title: "Nature's Walk roadway accents",
    city: "Pitt Meadows",
    province: "BC",
    lat: 49.2207,
    lng: -122.6901,
    product: "StreetPrint",
    systems: ["StreetBond"],
    application: "Community Branding",
    approximate: true,
    images: [
      cdn("d955ac668d10dbb73c175c75792e64a3fe670359-1200x900.jpg"), // blog/roadway-accents-natures-walk/featured.jpg
    ],
    post: "roadway-accents-natures-walk",
    excerpt:
      "StreetPrint stamped asphalt and StreetBond pavement coating combine to create decorative roadway accents at Nature's Walk in Pitt Meadows, BC.",
    problem:
      "Nature's Walk called for decorative roadway accents on an asphalt base.",
    solution:
      "StreetPrint genuine stamped asphalt for the design, with StreetBond coating bonded permanently to the asphalt for a lasting, low-maintenance finish that protects the pavement.",
  },
  {
    // Idea Book p.133 (Square One Paving, HUB Master Installer, British Columbia). Square
    // One's project page: "Circle of Life" in StreetBond, custom-mixed colours, on the
    // plaza by the stadium, 7888 200 St.
    id: "langley-events-centre",
    title: "Circle of Life, Langley Events Centre",
    city: "Langley",
    province: "BC",
    lat: 49.1448,
    lng: -122.6664,
    product: "StreetBond",
    application: "Public Art",
    images: [
      local("langley-events-centre"), // Idea Book p.133
    ],
    ideaBookPage: 133,
    excerpt:
      "Circle of Life by Drew and Elinor Atkins of Spring Salmon Studio, a StreetBond medallion on the plaza at the Langley Events Centre.",
  },
  {
    // Pin at Linwood Park, whose entrance the crossing marks. Photos: the crossing's
    // own (Square One Paving, March 2025; /public/images/blog/langley-railroad-heritage/),
    // loaded from their gallery copies, crosswalks-128 and traffic-patterns-44.
    id: "langley-railroad-heritage",
    title: "Railroad heritage crosswalk",
    city: "Langley City",
    province: "BC",
    lat: 49.1021,
    lng: -122.6654,
    product: "TrafficPatterns",
    application: "Community Branding",
    year: "2025",
    images: [
      cdn("a51a3d2394ca7ef64d9d72f4b2bcbee877bf906c-1800x1350.jpg"), // applications/crosswalks/crosswalks-128.jpg
      cdn("586dece4ca2d10b8ec1774ae71a88e4a21e65783-2400x1560.jpg"), // products/traffic-patterns/traffic-patterns-44.jpg
    ],
    post: "white-rock-langley-trafficpatterns",
    ideaBookPage: 136,
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
    title: "Reunion sidewalks, Murrayville",
    city: "Langley",
    province: "BC",
    lat: 49.0885,
    lng: -122.6133,
    product: "DecoMark",
    application: "Community Branding",
    approximate: true,
    images: [
      cdn("2bd5f726889c589f520e2597da4565e160615a0b-1200x900.jpg"), // blog/murrayville-schoolhouse-sidewalk/featured.jpg
    ],
    post: "murrayville-schoolhouse-sidewalk",
    excerpt:
      "Decorative asphalt sidewalks at the new Reunion Housing Complex in Murrayville, Langley, created with DecoMark thermoplastic decals.",
    problem:
      "The new Reunion Housing Complex in Murrayville wanted a classic decorative finish on its asphalt sidewalks.",
    solution:
      "DecoMark decals applied to the asphalt sidewalks: surface applied, skid and slip resistant, UV-stable, and engineered to last 6 to 8 times longer than paint.",
  },
  {
    // Idea Book p.108: "The playground is the canvas. Maple Ridge, British Columbia |
    // StreetBond". The City's new spray park at Maple Ridge Park (232 St and 132 Ave), July
    // 2025.
    id: "maple-ridge-spray-park",
    title: "Maple Ridge Park spray park",
    city: "Maple Ridge",
    province: "BC",
    lat: 49.2414,
    lng: -122.5789,
    product: "StreetBond",
    application: "Splash Pads",
    year: "2025",
    images: [
      cdn("9a5a84c2eb4f12a3b52e11ffb909c167e300ea91-1966x1299.jpg"), // applications/splash-pads/splash-pads-10 (Idea Book p.108)
    ],
    ideaBookPage: 108,
    excerpt:
      "Blue and orange StreetBond fields and a salmon graphic on the Maple Ridge Park spray park, opened in July 2025.",
  },
  {
    // Idea Book p.114: "First Nations Land Recognition... Fort Langley, British Columbia |
    // DecoMark". Matched from the photo, not a source, to the steps by salishan Place:
    // approximate.
    id: "fort-langley-land-recognition",
    title: "First Nations land recognition",
    city: "Fort Langley",
    province: "BC",
    lat: 49.1680,
    lng: -122.5741,
    product: "DecoMark",
    application: "Community Branding",
    approximate: true,
    images: [
      cdn("1b2cb6050840a10057e1585cf83bf07013c07e0f-1800x2400.jpg"), // products/traffic-patterns/traffic-patterns-42 (Idea Book p.114)
    ],
    ideaBookPage: 114,
    excerpt:
      "A First Nations land recognition, cast in DecoMark and set into the ground in Fort Langley.",
  },
  {
    // Idea Book p.132: "Maple Ridge, British Columbia". The Kanaka Springs community sign
    // is behind the roundabout, on 112 Ave at Bosonworth Ave. The traffic calming page
    // shows the same photo as a stamped apron.
    id: "maple-ridge-kanaka-springs",
    title: "Kanaka Springs roundabout",
    city: "Maple Ridge",
    province: "BC",
    lat: 49.2058,
    lng: -122.5239,
    product: "StreetPrint",
    application: "Traffic Calming",
    images: [
      cdn("0b5c599579465f38fde5f75adbbc74fd343af683-2400x1800.jpg"), // applications/traffic-calming/traffic-calming-58 (Idea Book p.132)
    ],
    ideaBookPage: 132,
    excerpt:
      "A red herringbone StreetPrint apron on the roundabout at Kanaka Springs in Maple Ridge.",
  },
  {
    // Idea Book p.137: "Commercial hardscapes... Mission, British Columbia | StreetPrint".
    // Square One's April 2025 job; the building is not named: pin at city hall,
    // approximate.
    id: "mission-herringbone-bays",
    title: "Herringbone parking bays",
    city: "Mission",
    province: "BC",
    lat: 49.1591,
    lng: -122.2838,
    product: "StreetPrint",
    systems: ["StreetBond"],
    application: "Commercial Spaces",
    year: "2025",
    approximate: true,
    images: [
      cdn("69d1d4f3f739adab42e181181b1fd6f21124c143-2400x1800.jpg"), // applications/commercial-spaces/commercial-spaces-68 (Idea Book p.137)
    ],
    ideaBookPage: 137,
    excerpt:
      "Herringbone StreetPrint in StreetBond Pewter on the parking bays in front of a new commercial building in Mission.",
  },
  {
    // "Throughout the city core": pin at downtown Kelowna.
    id: "kelowna-crosswalk-network",
    title: "Kelowna crosswalk network",
    city: "Kelowna",
    province: "BC",
    lat: 49.8880,
    lng: -119.4958,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    approximate: true,
    images: [
      cdn("95ed7426550cb8a32a76590d34af3b46b5ac3c22-1334x804.jpg"), // blog/performance-crosswalks-asphalt-concrete/featured.jpg
    ],
    post: "performance-crosswalks-asphalt-concrete",
    excerpt:
      "More than 80 TrafficPatternsXD crosswalks through Kelowna's city core, installed over 13 years.",
    problem:
      "The City of Kelowna set out to make walking, cycling and transit more attractive, accessible and safe, which meant crosswalks that look good and stand up to high traffic and weather.",
    solution:
      "TrafficPatternsXD, aggregate-reinforced thermoplastic imprinted into the asphalt, from the city's first crosswalk to more than 80 across the core, with more planned.",
  },
  {
    // Idea Book p.85: "Kelowna, BC" (StreetBond by GAF page). Square One lists a StreetBond
    // job at Green Square Vert, Troika's development at 3626 Mission Springs Dr;
    // decorative-paving-solutions calls Green Square a public plaza, which it is not, so
    // that post is not linked.
    id: "kelowna-green-square",
    title: "Green Square courtyard",
    city: "Kelowna",
    province: "BC",
    lat: 49.8532,
    lng: -119.4785,
    product: "StreetBond",
    application: "Townhomes",
    images: [
      cdn("22dcbb9a51dd08aed93625aef34b713118034c98-2000x1500.jpg"), // applications/parks-paths (Idea Book p.85)
    ],
    ideaBookPage: 85,
    excerpt:
      "A winding StreetBond path in bright bands through the courtyard at Green Square in Kelowna's Lower Mission.",
  },
  {
    // Post: streetbondsr-solar-reflective-coatings. Idea Book pp.100–101. Square One's
    // StreetBondSR path (May 2023) at Jack Shaw Gardens, 89th St and Kingfisher Dr.
    id: "osoyoos-jack-shaw-gardens",
    title: "Jack Shaw Gardens path",
    city: "Osoyoos",
    province: "BC",
    lat: 49.0272,
    lng: -119.4682,
    product: "StreetBondSR",
    application: "Parks & Paths",
    year: "2023",
    images: [
      cdn("8e7fa9ea6509baecccf61813714ec97f77ceaf3b-2400x1800.jpg"), // products/streetbondsr (Idea Book p.100)
      cdn("27dd4e6d74358a282fa2aee66a2cfa105b53ccc3-2400x1800.jpg"), // after three years (Idea Book p.101)
    ],
    post: "streetbondsr-solar-reflective-coatings",
    ideaBookPage: 100,
    excerpt:
      "A StreetBondSR path by the Osoyoos splash park that still reads as new three summers on, and runs cooler underfoot.",
  },

  // ── Ontario ─────────────────────────────────────────────────────────────────────
  {
    // The post's own hero (bus-lanes-08). It names the East London Link corridor and
    // no street, so the pin sits in east London, approximate.
    // 30 Sep 2026: photos from Idea Book pp.32, 87 and 93, each captioned "London, Ontario
    // | MMAX"; p.90 is the corridor photo already here.
    id: "london-east-brt",
    title: "East London Link rapid transit",
    city: "London",
    province: "ON",
    lat: 42.9836,
    lng: -81.2200,
    product: "MMAX",
    systems: ["TrafficPatternsXD"],
    application: "Bus Lanes",
    approximate: true,
    images: [
      cdn("217e5873e43b99d6b4689bdf8ddc53c0da4c7d8b-2400x1800.jpg"), // applications/bus-lanes/bus-lanes-08.jpg
      cdn("80861000deca287ab75d646d2ea1635c7faa61e4-2400x1800.jpg"), // applications/bus-lanes/bus-lanes-37 (Idea Book p.32)
      cdn("7d39f59f4471eb792ed12454463c26e9ce469c8a-2400x1800.jpg"), // applications/bus-lanes/bus-lanes-22 (Idea Book p.87)
      cdn("4ab6237532fc8dd0ba1e2a37a765de7932b3ef86-2400x1800.jpg"), // products/mmax/mmax-32 (Idea Book p.93)
    ],
    post: "london-east-link-brt",
    ideaBookPage: 90,
    excerpt:
      "The City of London's East London Link: red MMAX on the transit lanes and TrafficPatternsXD at the crossings, two materials in one bus rapid transit corridor.",
    problem:
      "A bus rapid transit corridor asks the road surface for two things: crossings that stay high-contrast and grippy where buses brake and turn, and transit lanes that go in without shutting the corridor down.",
    solution:
      "TrafficPatternsXD, 150 mil aggregate-reinforced thermoplastic, at the crossings. Red MMAX methyl methacrylate on the lanes, traffic-ready in 45 to 60 minutes, so a lane carries buses again the same shift.",
  },
  {
    // Idea Book p.96: "Streetscapes... StreetPrint project in the Woodstock downtown
    // revitalization. Woodstock, Ontario | StreetPrint". City Hall is across the street in
    // the photo: pin on Dundas St at City Hall.
    id: "woodstock-dundas-street",
    title: "Downtown Dundas Street",
    city: "Woodstock",
    province: "ON",
    lat: 43.1303,
    lng: -80.7564,
    product: "StreetPrint",
    application: "Public Spaces",
    images: [
      cdn("cce74ceb9fe8b2ffbc6a127275eb666599525db1-2400x1800.jpg"), // products/streetprint/streetprint-63 (Idea Book p.96)
    ],
    ideaBookPage: 96,
    excerpt:
      "A custom StreetPrint pattern on the parking lanes of Dundas Street, part of Woodstock's downtown revitalization.",
  },
  {
    // The post's photo covers two jobs (GrandLinq in Waterloo and VIVA in York
    // Region) and shows neither an ION train nor a named street, so it came off
    // this pin on 28 Sep 2026. The post places the job in Waterloo.
    // 30 Sep 2026: a photo again, Idea Book p.63 ("Kitchener, Ontario", the Pedestrian
    // Safety spread): a crossing on Charles St with the ION wires overhead, on the corridor
    // this post covers.
    id: "waterloo-grandlinq-lrt",
    title: "ION light rail crossings",
    city: "Waterloo",
    province: "ON",
    lat: 43.4668,
    lng: -80.5164,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    approximate: true,
    images: [
      cdn("b9f29ffae182c208e483d6fd0ad71fd5d5e855a8-2400x1800.jpg"), // applications/crosswalks/crosswalks-123 (Idea Book p.63)
    ],
    post: "safety-durability-transit-stations",
    ideaBookPage: 63,
    excerpt:
      "TrafficPatternsXD at LRT platform edges, pedestrian crossings and modal transition points across the ION corridor: high-traction, fade-resistant surfacing through Waterloo Region winters.",
    problem:
      "GrandLinq's ION LRT corridor needed platform-edge and crossing treatments that could take constant traffic, stay grippy through freeze-thaw and winter conditions, and go in without disrupting service.",
    solution:
      "TrafficPatternsXD in phased night-time applications across the ION corridor, with no service disruption. The crossings kept their contrast through freeze-thaw cycles and gave better traction in winter.",
  },
  {
    // Idea Book p.57 captions this photo "London, Ontario". CBC's photos of Kitchener's
    // Victoria Park crossing (unveiled 16 Sep 2022) show the same design, speed sign and
    // overhead sign, so the pin is in Kitchener. Flagged for Doug. Product from the facing
    // Creative Design spread (p.56: TrafficPatterns, custom designs).
    id: "kitchener-every-child-matters",
    title: "Every Child Matters crosswalk, Victoria Park",
    city: "Kitchener",
    province: "ON",
    lat: 43.4475,
    lng: -80.4971,
    product: "TrafficPatterns",
    application: "Community Branding",
    year: "2022",
    images: [
      cdn("7eb436ffcc1df43c83a445ce82f62b5d3767b4f9-1184x864.jpg"), // applications/parks-paths (Idea Book p.57)
    ],
    ideaBookPage: 57,
    excerpt:
      "An Every Child Matters crosswalk at Water Street and Jubilee Drive by Victoria Park, unveiled in September 2022.",
  },
  {
    // Idea Book p.107: "Intersection art. Kings and Queens... Kitchener, Ontario |
    // TrafficPatterns". CTV (2019) describes crowns for King and Queen Streets at this
    // intersection.
    id: "kitchener-kings-queens",
    title: "Kings and Queens intersection",
    city: "Kitchener",
    province: "ON",
    lat: 43.4498,
    lng: -80.4891,
    product: "TrafficPatterns",
    application: "Public Art",
    images: [
      local("kitchener-kings-queens"), // Idea Book p.107
    ],
    ideaBookPage: 107,
    excerpt:
      "Public art in TrafficPatterns at King and Queen Streets, making a historic downtown intersection a place for people on foot.",
  },
  {
    // Post table: "East Ave entrance to the Kitchener Memorial Auditorium". Pin at the
    // Aud. Second photo: traffic-patterns-87, the same "Lest We Forget" crossing.
    // 30 Sep 2026: third photo, Idea Book p.115 ("Kitchener, Ontario | TrafficPatterns").
    id: "kitchener-veterans",
    title: "Veterans memorial crosswalk",
    city: "Kitchener",
    province: "ON",
    lat: 43.4472,
    lng: -80.4670,
    product: "TrafficPatterns",
    application: "Community Branding",
    images: [
      cdn("193d70465f16da220961b5aaebb28fb5d287c9b2-640x480.jpg"), // blog/veterans-crosswalk-kitchener/featured.jpeg
      cdn("f087d863ecf32b94df3db6baab1e4922e0f45fc4-2400x1800.jpg"), // products/traffic-patterns/traffic-patterns-87.jpg
      cdn("a256098ee9641fa08337f019db181b5d9c391cc9-2400x1800.jpg"), // applications/crosswalks/crosswalks-115 (Idea Book p.115)
    ],
    post: "veterans-crosswalk-kitchener",
    ideaBookPage: 115,
    excerpt:
      "Kitchener's Veterans Crosswalk at the East Avenue entrance to the Kitchener Memorial Auditorium, a living memorial: a permanent Remembrance Day tribute in TrafficPatterns thermoplastic.",
    problem:
      "The City of Kitchener and its partners, two Legion branches and the Royal Highland Fusiliers, wanted a permanent Remembrance Day tribute on a route people use every day, in a material that would outlast paint.",
    solution:
      "TrafficPatterns preformed thermoplastic in a high-contrast commemorative pattern, heat-bonded to the asphalt by MultiSeal during off-peak work and back in service ahead of Remembrance Day.",
  },
  {
    // "Cadillac Fairview, Kitchener" is CF Fairview Park (commercial-applications
    // names it), so the pin moved there from downtown. Second photo: that post's
    // hero, the same lot with the Fairview Park sign. No year: 2021 had no source.
    id: "kitchener-cadillac-fairview",
    title: "Fairview Park parking lot",
    city: "Kitchener",
    province: "ON",
    lat: 43.4247,
    lng: -80.4390,
    product: "TrafficPatternsXD",
    application: "Parking Lots",
    images: [
      cdn("bc7b3b9680acca7d096c734224ebd47b3e53881d-1200x900.jpg"), // blog/stamped-asphalt-parking-lot/featured.jpg
      cdn("e14c5e05b4ed3d9c1a8a1132763674305e992311-1200x751.jpg"), // cdn.sanity.io/images/9dbro2m1/production/e14c5e05b4ed3d9c1a8a1132763674305e992311-1200x751.jpg", // commercial-applications' hero, Fairview Park
    ],
    post: "stamped-asphalt-parking-lot",
    excerpt:
      "TrafficPatternsXD crosswalks and traffic calming devices in the parking lot at Cadillac Fairview's Fairview Park in Kitchener: a brick or paving-stone look for a high-traffic retail lot.",
    problem:
      "Fairview Park's parking lot needed pedestrian crossings and traffic calming that would stand up to heavy traffic and year-round weather while keeping the lot inviting.",
    solution:
      "TrafficPatternsXD, an aggregate-reinforced preformed thermoplastic, for durable crosswalks and traffic calming devices with a brick or paving-stone look and none of the upkeep of pavers.",
  },
  {
    // The post places it "in the heart of Simcoe" and names no street, so the pin
    // sits at the town centre. No year: the post gives none (2023 had no source).
    id: "simcoe-rainbow",
    title: "Pride rainbow crosswalk",
    city: "Simcoe",
    province: "ON",
    lat: 42.8372,
    lng: -80.3039,
    product: "TrafficPatternsXD",
    application: "Community Branding",
    approximate: true,
    images: [
      cdn("89faa77f16dbe60cb104f191079e2e297ca4c1f4-1200x633.jpg"), // blog/simcoe-rainbow-crosswalk/featured.jpg
    ],
    post: "simcoe-rainbow-crosswalk",
    excerpt:
      "A young resident's two-year fundraising campaign became a Pride rainbow crosswalk in the heart of Simcoe, in high-traction TrafficPatternsXD installed by Multiseal.",
    problem:
      "Ryder, a young Simcoe resident, wanted a rainbow crosswalk like the ones she had seen in neighbouring communities, and spent two years raising the money with local people and businesses.",
    solution:
      "TrafficPatternsXD preformed thermoplastic, installed by Multiseal: a durable, high-traction rainbow crossing that stands for the town's support of inclusion and the LGBTQ+ community.",
  },
  {
    // Idea Book p.84 ("Collingwood, ON", on the StreetBond by GAF page). The Town lists
    // Awen' Waterplay at Harbourview Park, 1 Cedar St, opened August 2023.
    id: "collingwood-awen-waterplay",
    title: "Awen' Waterplay Area",
    city: "Collingwood",
    province: "ON",
    lat: 44.5031,
    lng: -80.2266,
    product: "StreetBond",
    application: "Splash Pads",
    year: "2023",
    images: [
      cdn("431881e193da37224dcdcb86ef09ed674922389e-2400x1800.jpg"), // applications/splash-pads/splash-pads-25 (Idea Book p.84)
    ],
    ideaBookPage: 84,
    excerpt:
      "StreetBond circles in blue and green on the Awen' Waterplay Area at Harbourview Park, which opened in 2023.",
  },
  {
    // Idea Book p.59: "Hamilton, Ontario", on the Play Surfaces spread (StreetBond,
    // DecoMark, StreetBondSR). The park is not identified: pin at city hall.
    id: "hamilton-play-pad",
    title: "Compass play pad",
    city: "Hamilton",
    province: "ON",
    lat: 43.2560,
    lng: -79.8710,
    product: "StreetBond",
    application: "Playgrounds",
    approximate: true,
    images: [
      cdn("149b51528ec8f529600246cae5f6c13683231cf6-2016x1512.jpg"), // applications/playgrounds (Idea Book p.59)
    ],
    ideaBookPage: 59,
    excerpt:
      "A compass laid out in StreetBond blue on a concrete play pad beside an outdoor pool in Hamilton.",
  },
  {
    // New 28 Sep 2026. Post: toronto-premium-outlets-14-years. Its photo shows the
    // Toronto Premium Outlets sign over the crossing. Pin at the centre, Halton Hills.
    // 30 Sep 2026: Idea Book p.86 ("14-year-old entrance feature... Halton Hills, Ontario |
    // TrafficPatternsXD") leads; the photo that was here is the book's p.79, captioned
    // StreetPrint, so StreetPrint is listed too.
    id: "halton-hills-toronto-premium-outlets",
    title: "Toronto Premium Outlets",
    city: "Halton Hills",
    province: "ON",
    lat: 43.5757,
    lng: -79.8301,
    product: "TrafficPatternsXD",
    systems: ["StreetPrint"],
    application: "Parking Lots",
    images: [
      cdn("9758e5594656e1b185ef5c1bb15c0bef25a3eebb-1600x1200.jpg"), // the 14-year-old entrance crossing (Idea Book p.86)
      cdn("071d81ad81371de61a084911100748616f057ad3-2400x1800.jpg"), // applications/parking-lots/parking-lots-60 (Idea Book p.79, StreetPrint)
    ],
    post: "toronto-premium-outlets-14-years",
    ideaBookPage: 86,
    excerpt:
      "TrafficPatternsXD crossings at Toronto Premium Outlets in Halton Hills, fourteen years in service through shoppers, delivery trucks and Ontario winters, with StreetPrint on the lot.",
    problem:
      "A retail parking lot combines everything that wears out markings (turning traffic, delivery vehicles, salt and plows) with an owner whose customers judge the property on how it looks.",
    solution:
      "TrafficPatternsXD, 150 mil aggregate-reinforced thermoplastic heat-fused into the asphalt, in a pattern that reads as laid masonry and keeps its grip where the wheel paths cross it.",
  },
  {
    // Post: pedestrian-channelization-public-spaces. The photo shows the blue
    // promenade with the Brant Street Pier and its beacon, so it is this job (it was
    // tagged "Representative" until 28 Sep 2026). Pin at Spencer Smith Park.
    id: "burlington-spencer-smith",
    title: "Spencer Smith Park promenade",
    city: "Burlington",
    province: "ON",
    lat: 43.3203,
    lng: -79.7999,
    product: "StreetBond",
    application: "Parks & Paths",
    year: "2017",
    images: [
      cdn("6187288d000303a7d49e083d8fcb222f8c26567a-1497x1123.jpg"), // products/streetbond/streetbond-59.png
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
    // Idea Book p.73: "Year 1 / Year 10. Oakville, Ontario | TrafficPatternsXD". Both
    // photos show a grocery store; Oakville has two of that chain and the suburban one at
    // Dundas St W fits the Year 1 photo best, so the pin is approximate.
    id: "oakville-ten-years",
    title: "Ten years of one crosswalk",
    city: "Oakville",
    province: "ON",
    lat: 43.4671,
    lng: -79.7455,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    approximate: true,
    images: [
      cdn("3bd039ce6399936fd57b8aca745a765f12ca0445-1280x960.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-120, year 1 (Idea Book p.73)
      cdn("b7e86508809e258c0cd9a59ce7ae568989571d59-1280x960.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-119, year 10
    ],
    ideaBookPage: 73,
    excerpt:
      "The same TrafficPatternsXD crosswalk in its first year and its tenth, at a grocery store in Oakville.",
  },
  {
    // Idea Book p.47: "Brampton, Ontario". The canopy sign behind reads Brampton Transit,
    // Bramalea T[erminal]. Pin at Peel Centre Dr and Central Park Dr.
    id: "brampton-bramalea-terminal",
    title: "Bramalea Terminal crosswalk",
    city: "Brampton",
    province: "ON",
    lat: 43.7197,
    lng: -79.7206,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      cdn("36497374754a6f6c1668e66b8f8c143c0411fd67-2400x1800.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-70 (Idea Book p.47)
    ],
    ideaBookPage: 47,
    excerpt:
      "A red and white TrafficPatternsXD crosswalk in front of Brampton Transit's Bramalea Terminal.",
  },
  {
    // The post names Humberwest Parkway (Brampton) and no crossing, so the pin sits
    // on the parkway. Which product went on the crossing and which on the median is
    // not stated.
    id: "toronto-humberwest-crosswalk",
    title: "Humberwest Parkway crosswalk and median",
    city: "Brampton",
    province: "ON",
    lat: 43.7664,
    lng: -79.7181,
    product: "TrafficPatternsXD",
    systems: ["StreetBond"],
    application: "Crosswalks",
    approximate: true,
    images: [
      cdn("66a6075c971cfe6aab87e87955db3b9045c2445e-934x700.jpg"), // blog/decorative-crosswalk-meridian/featured.jpg
    ],
    post: "decorative-crosswalk-meridian",
    excerpt:
      "StreetBond 150 and TrafficPatternsXD combine to create a decorative crosswalk and median treatment on Humberwest Parkway in Brampton.",
    problem:
      "The Humberwest Parkway crossing and median needed the look of brick or paving stone without the upkeep of pavers.",
    solution:
      "TrafficPatternsXD, an aggregate-reinforced preformed thermoplastic, with StreetBond 150 coloured coating, which bonds permanently to asphalt and concrete and resists fuel, engine oil and de-icing agents.",
  },
  {
    // Idea Book p.12, the TrafficPatternsXD page: "Kleinburg, Ontario". The street is a new
    // subdivision, not identified: pin at the village.
    id: "kleinburg-crosswalk",
    title: "Kleinburg crosswalk",
    city: "Kleinburg",
    province: "ON",
    lat: 43.8442,
    lng: -79.6289,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    approximate: true,
    images: [
      cdn("45923d5f5766871a7d252b0415f656d9850642c6-2400x1800.jpg"), // applications/crosswalks (Idea Book p.12)
    ],
    ideaBookPage: 12,
    excerpt:
      "Red brick-pattern TrafficPatternsXD holding its pattern through the first snow in a new Kleinburg neighbourhood.",
  },
  {
    // Pin on Woodbridge Avenue, in the Woodbridge heritage district the post names.
    // 30 Sep 2026: photos from Idea Book p.40 ("Woodbridge, Ontario") and p.117. The first
    // photo is also the book's p.98 ("York Region").
    id: "vaughan-woodbridge-heritage",
    title: "Woodbridge Avenue heritage crosswalks",
    city: "Vaughan",
    province: "ON",
    lat: 43.7845,
    lng: -79.5945,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    images: [
      cdn("e22ca56a2e410271739753278bd4957635e31321-1200x900.jpg"), // blog/trafficpatternsxd-urban-design/featured.jpg
      cdn("c48c9a5d9252afef9e5dde62e2ed4c135ea994a6-2400x1800.jpg"), // applications/crosswalks/crosswalks-118 (Idea Book p.40)
      cdn("5f2e91e7833e468e0d8720bda9e3a67bcc30f11e-1200x750.jpg"), // Idea Book p.117, "Woodbridge, Ontario | TrafficPatternsXD"
    ],
    post: "trafficpatternsxd-urban-design",
    ideaBookPage: 117,
    excerpt:
      "Heritage Conservation District crosswalks on Woodbridge Avenue: TrafficPatternsXD brick-pattern thermoplastic that meets the character of a designated heritage streetscape and survives Canadian winters.",
    problem:
      "The City of Vaughan's Woodbridge Avenue streetscape improvement called for crosswalks in keeping with the Heritage Conservation District. Real brick pavers were ruled out: snowplow blades catch and displace them.",
    solution:
      "TrafficPatternsXD in a brick pattern, flush with the road surface, chosen by the City for all pedestrian crosswalks at intersections on the project. Installed by Thermo Design.",
  },
  {
    // Idea Book p.109: "Retail. First impressions. Like the Audi brand, crisp, clean
    // lines... as you arrive at the dealership. Vaughan, Ontario | TrafficPatternsXD". Audi
    // Vaughan's new store is at 131 Four Valley Dr (the photo shows a new building; not
    // matched against imagery).
    id: "vaughan-audi",
    title: "Audi Vaughan entrance",
    city: "Vaughan",
    province: "ON",
    lat: 43.8188,
    lng: -79.5421,
    product: "TrafficPatternsXD",
    application: "Commercial Spaces",
    images: [
      local("vaughan-audi"), // Idea Book p.109
    ],
    ideaBookPage: 109,
    excerpt:
      "Crisp TrafficPatternsXD lines at the entrance to the Audi dealership in Vaughan, accenting the building as customers arrive.",
  },
  {
    // Emery Village is a neighbourhood; the post names no intersection, so the pin
    // sits at Emery. 2020 is the year the post gives for the project.
    id: "toronto-emery-village",
    title: "Emery Village crosswalks",
    city: "Toronto",
    province: "ON",
    lat: 43.7441,
    lng: -79.5342,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    year: "2020",
    approximate: true,
    images: [
      cdn("e57aef10de8411b5d3e2023d4480ba9badd73b8f-800x600.jpg"), // blog/decorative-asphalt-high-traffic/featured.jpg
    ],
    post: "decorative-asphalt-high-traffic",
    excerpt:
      "Emery Village BIA replaced failing unit pavers with TrafficPatternsXD, keeping the original 'Emery Blue' colour and paver grid in aggregate-reinforced thermoplastic that stands up to heavy truck traffic.",
    problem:
      "Twelve-year-old coloured unit pavers at the Emery Village BIA gateway were breaking down under heavy commercial and truck traffic, and patching them was only ever a temporary fix. The BIA wanted a permanent replacement that kept the community's 'Emery Blue' design.",
    solution:
      "TrafficPatternsXD across 440 m² of crossings, installed by Multiseal, replicating the Emery Blue colour and the paver grid with less traffic disruption than relaying pavers or demolishing the concrete base.",
  },
  {
    // The post names the Town of Georgina and no street: pin at the town. No year
    // (2021 had no source), and the text is cut back to what the post says.
    id: "georgina-every-child-matters",
    title: "Every Child Matters crosswalk",
    city: "Georgina",
    province: "ON",
    lat: 44.2280,
    lng: -79.4644,
    product: "TrafficPatterns",
    application: "Community Branding",
    approximate: true,
    images: [
      cdn("7c3010ae926cf9a936510231ddfc12b297a7861c-562x315.jpg"), // blog/every-child-matters-crosswalk/featured.png
    ],
    post: "every-child-matters-crosswalk",
    excerpt:
      "A TrafficPatterns thermoplastic crosswalk in York Region's Town of Georgina honouring the Every Child Matters movement.",
    problem:
      "The Town of Georgina wanted a crosswalk that honours the Every Child Matters movement.",
    solution:
      "TrafficPatterns preformed thermoplastic in a custom design: surface applied, virtually maintenance-free, and a cost-effective alternative to brick pavers.",
  },
  {
    // Idea Book p.125: "Community centres. Using TrafficPatternsXD in a bold colour scheme
    // highlights the location of the new community centre... East Gwillimbury". The pylon
    // beside the crossing reads Health and Active Living Plaza (160 Jim Mortson Dr).
    id: "east-gwillimbury-halp",
    title: "Health and Active Living Plaza",
    city: "East Gwillimbury",
    province: "ON",
    lat: 44.1278,
    lng: -79.4519,
    product: "TrafficPatternsXD",
    application: "Parks & Paths",
    images: [
      cdn("23a48c76133f301222e96691dde208a70880f5b5-1800x2400.jpg"), // applications/parks-paths/parks-paths-146 (Idea Book p.125)
    ],
    ideaBookPage: 125,
    excerpt:
      "TrafficPatternsXD in a bold colour scheme marks the way into East Gwillimbury's new community centre.",
  },
  {
    // Post: geary-works-toronto-park-walkway. Idea Book p.97: "Toronto, Ontario |
    // DecoMark". The City's Geary Avenue Park expansion (hydro corridor between Delaware
    // and Westmoreland) has the Green Line path with these markings.
    id: "toronto-geary-avenue-park",
    title: "Geary Avenue Park path",
    city: "Toronto",
    province: "ON",
    lat: 43.6704,
    lng: -79.4334,
    product: "DecoMark",
    application: "Parks & Paths",
    images: [
      cdn("06cd4e8b7cfd065a0f3248fe06e3b0c3f9ae87f8-2400x1800.jpg"), // applications/community-branding/community-branding-17 (Idea Book p.97)
    ],
    post: "geary-works-toronto-park-walkway",
    ideaBookPage: 97,
    excerpt:
      "DecoMark graphics in the path at Geary Avenue Park, with the Geary Works name and its gear motif reading straight off the pavement.",
  },
  {
    // Idea Book p.91: "Toronto's city streets... continues to perform 11 years later.
    // Toronto, Ontario | TrafficPatternsXD". The Rogers Centre is ahead in the photo
    // (Railway Lands, likely Bremner Blvd): approximate.
    id: "toronto-railway-lands",
    title: "Downtown crosswalks, Railway Lands",
    city: "Toronto",
    province: "ON",
    lat: 43.6415,
    lng: -79.3870,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    approximate: true,
    images: [
      cdn("b5687a89f85ef25f85cb9b063d1b1d94efbf7d06-1200x778.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-133 (Idea Book p.91)
    ],
    ideaBookPage: 91,
    excerpt:
      "TrafficPatternsXD crosswalks on downtown Toronto streets, still performing 11 years after they went in.",
  },
  {
    // Idea Book p.28, the StreetBondSR page: "Toronto, Ontario". The site is not
    // identified: pin near city hall, approximate.
    id: "toronto-fleet-lot",
    title: "Solar-reflective fleet lot",
    city: "Toronto",
    province: "ON",
    lat: 43.6560,
    lng: -79.3870,
    product: "StreetBondSR",
    application: "Parking Lots",
    approximate: true,
    images: [
      cdn("8730cab06de5688b6e6828e45f433ccbabb6b3c7-1280x960.jpg"), // applications/commercial-spaces (Idea Book p.28)
    ],
    ideaBookPage: 28,
    excerpt:
      "StreetBondSR across a fleet parking lot in Toronto, reflecting sunlight so the surface stays cooler.",
  },
  {
    // extending-transit-lane-lifespan names "key TTC bus-priority corridors" and no
    // street, so the pin sits at the city centre. Its photo is a TTC bus on a red lane.
    id: "toronto-ttc-bus-corridors",
    title: "TTC bus priority corridors",
    city: "Toronto",
    province: "ON",
    lat: 43.6532,
    lng: -79.3832,
    product: "MMAX",
    application: "Bus Lanes",
    approximate: true,
    images: [
      cdn("fc2138d3fdc5fdbff12c355b0c7266259b8e509d-1200x866.jpg"), // blog/extending-transit-lane-lifespan/featured.jpg
    ],
    post: "extending-transit-lane-lifespan",
    excerpt:
      "MMAX red lane surfacing on key TTC bus priority corridors in Toronto, installed overnight, with fewer repainting cycles over five-plus years.",
    problem:
      "Toronto wanted its busiest bus-priority routes to stay clearly visible and need less maintenance, without long lane closures.",
    solution:
      "MMAX MMA surfacing in red, fast-curing so it went down in overnight installations, with a high-friction surface for operators in all conditions.",
  },
  {
    // Idea Book p.34, the DuraTherm page: "Toronto, Ontario". The street is not identified:
    // approximate.
    id: "toronto-traffic-calming-markings",
    title: "Traffic calming markings",
    city: "Toronto",
    province: "ON",
    lat: 43.6505,
    lng: -79.3795,
    product: "DuraTherm",
    application: "Traffic Calming",
    approximate: true,
    images: [
      cdn("8a3bc196f60cb2d0acd42d9a389654c709f5aa0a-2400x1800.jpg"), // products/duratherm/duratherm-37 (Idea Book p.34)
    ],
    ideaBookPage: 34,
    excerpt:
      "DuraTherm traffic calming markings on a residential street in Toronto, inlaid flush with the asphalt.",
  },
  {
    // Idea Book p.88: "Toronto, Ontario | TrafficPatternsXD". The site is not identified:
    // approximate.
    id: "toronto-lot-crossing",
    title: "Parking lot crossing",
    city: "Toronto",
    province: "ON",
    lat: 43.6568,
    lng: -79.3792,
    product: "TrafficPatternsXD",
    application: "Parking Lots",
    approximate: true,
    images: [
      cdn("0e688868164667090ff2ef5a09ccb57bf0770b12-2400x1800.jpg"), // applications/crosswalks (Idea Book p.88)
    ],
    ideaBookPage: 88,
    excerpt:
      "A brick-pattern TrafficPatternsXD crossing at a busy parking lot entrance in Toronto.",
  },
  {
    // Post: multimodal-connectivity-york-region (30+ intersections on the Highway 7
    // Rapidway). The photo is the VIVA rapidway (station canopy, VIVA banner), from
    // imprinted-asphalt-york-transit, the archived profile of the same job. Place: on
    // Highway 7 in Markham, approximate; the post names the corridor, not one crossing.
    // 30 Sep 2026: second photo, Idea Book p.53, captioned Vaughan: the crossing at
    // Valleymede Dr on the Highway 7 rapidway (the street signs and the Shell station place
    // it in Richmond Hill).
    id: "york-region-viva",
    title: "Highway 7 VIVA rapidway",
    city: "York Region",
    province: "ON",
    lat: 43.8547,
    lng: -79.3376,
    product: "TrafficPatternsXD",
    application: "Crosswalks",
    approximate: true,
    images: [
      cdn("b08c6ee60dd0e60393f73078aa9fd47e7fcda392-1200x900.jpg"), // blog/imprinted-asphalt-york-transit/featured.jpg
      cdn("4fd7f6cd4287218afc39d6529b4a3de805e432eb-2400x1800.jpg"), // applications/bus-lanes/bus-lanes-41 (Idea Book p.53)
    ],
    post: "multimodal-connectivity-york-region",
    ideaBookPage: 53,
    excerpt:
      "TrafficPatternsXD at more than 30 intersections on the Highway 7 Rapidway, York Region's VIVA bus rapid transit corridor: bus stop platforms, crosswalks and the points where buses, cyclists and pedestrians meet.",
    problem:
      "Markings at the corridor's stations and intersections were inconsistent, lane demarcations in bus zones had faded, crossings and curbside platforms were slippery in wet and winter weather, and repainting costs kept rising.",
    solution:
      "TrafficPatternsXD, a preformed thermoplastic with embedded aggregate for traction, at bus stop platforms and crosswalks, at modal transition points, and as lane definition in bus priority zones.",
  },
  {
    // The post names the Leslieville laneway but not the lane: pin in Leslieville
    // (Queen St E and Leslie St). Second photo: the same lane, from laneway-project.
    id: "toronto-leslieville-laneway",
    title: "Leslieville laneway",
    city: "Toronto",
    province: "ON",
    lat: 43.6627,
    lng: -79.3337,
    product: "StreetBond",
    application: "Public Art",
    approximate: true,
    images: [
      cdn("661945c1afb8419c50a2da3093bb216da97e47a3-1200x795.jpg"), // blog/municipalities-case-study/featured.jpg
      cdn("c20487f0c16acaabb6acd37b7cf404ba7a3370f3-1188x1198.jpg"), // cdn.sanity.io/images/9dbro2m1/production/c20487f0c16acaabb6acd37b7cf404ba7a3370f3-1188x1198.jpg", // laneway-project's hero, the same lane
    ],
    post: "municipalities-case-study",
    excerpt:
      "The City of Toronto and the Laneway Project non-profit used StreetBond150 to turn a Leslieville back lane into a welcoming public space.",
    problem:
      "Toronto set out to widen access to public space by transforming laneways. The lane had to become inviting, stay open for occasional service access, and take constant foot traffic and the city's weather with little upkeep.",
    solution:
      "StreetBond150 coatings in colourful designs applied to the lane's asphalt: a durable, highly visible surface that bonds permanently and needs little maintenance.",
  },

  // ── Québec ──────────────────────────────────────────────────────────────────────
  {
    // Idea Book p.120: "Saint-Lin-Laurentides, Québec | StreetBond". The building matches
    // the new primary school on Rue Saint-Isidore (401); the address is not mapped, so the
    // pin is approximate.
    id: "saint-lin-school-walkway",
    title: "Primary school walkway",
    city: "Saint-Lin–Laurentides",
    province: "QC",
    lat: 45.8396,
    lng: -73.7571,
    product: "StreetBond",
    application: "Parks & Paths",
    approximate: true,
    images: [
      local("saint-lin-school-walkway"), // Idea Book p.120
    ],
    ideaBookPage: 120,
    excerpt:
      "An orange and sand StreetBond walkway leading to a new primary school in Saint-Lin–Laurentides.",
  },
  {
    // Idea Book p.131: "Long lasting parking lanes... Verdun, Québec | TrafficPatternsXD".
    // The street is not identified: pin at the borough hall, approximate.
    id: "verdun-parking-lanes",
    title: "Paver-pattern parking lane",
    city: "Verdun",
    province: "QC",
    lat: 45.4585,
    lng: -73.5693,
    product: "TrafficPatternsXD",
    application: "Traffic Calming",
    approximate: true,
    images: [
      cdn("02ae81c199eb25441a4f4786353255f2c47cb1d5-1184x864.jpg"), // products/traffic-patterns-xd/traffic-patterns-xd-144 (Idea Book p.131)
    ],
    ideaBookPage: 131,
    excerpt:
      "A paver-pattern parking lane in TrafficPatternsXD that takes turning tires, delivery trucks and plow blades without shifting like real pavers.",
  },
  {
    // Idea Book p.116: "Flush medians become part of the road... Verdun, Québec |
    // TrafficPatternsXD". The corner signs in the photo read Rue Gilberte-Dubé and Rue
    // Jacques-Lauzon (Île-des-Sœurs).
    id: "verdun-flush-medians",
    title: "Flush medians, Rue Gilberte-Dubé",
    city: "Verdun",
    province: "QC",
    lat: 45.4719,
    lng: -73.5657,
    product: "TrafficPatternsXD",
    application: "Traffic Calming",
    images: [
      cdn("6d342d0b6a69e5d5c9b215cd3319a6bdc54170ab-2400x1800.jpg"), // applications/traffic-calming/traffic-calming-07 (Idea Book p.116)
    ],
    ideaBookPage: 116,
    excerpt:
      "Flush medians in TrafficPatternsXD that narrow the road and slow cars on the existing asphalt, with nothing for a plow to catch.",
  },
  {
    // Idea Book p.127: "School crosswalks should be seen... TrafficPatterns and
    // StreetBond... Montréal, Québec | TrafficPatterns". The school is not identified (a
    // street sign reads Glen, which may put it in Rosemère): approximate.
    id: "montreal-school-crosswalk",
    title: "School crosswalk",
    city: "Montréal",
    province: "QC",
    lat: 45.5060,
    lng: -73.5580,
    product: "TrafficPatterns",
    systems: ["StreetBond"],
    application: "Traffic Calming",
    approximate: true,
    images: [
      cdn("3e56133bab2d5fc879e93432fa32f61f2060aabf-768x1024.jpg"), // applications/public-spaces (Idea Book p.127)
    ],
    ideaBookPage: 127,
    excerpt:
      "A playful school crosswalk in TrafficPatterns and StreetBond, coloured to be seen.",
  },
  {
    // Post: pedestrian-channelization-public-spaces. The photo is the red flowing
    // lines below the Olympic Stadium tower, so it is this job (tagged
    // "Representative" until 28 Sep 2026). Pin at Parc Guido-Nincheri (it was 800 m off).
    id: "montreal-guido-nincheri",
    title: "Parc Guido-Nincheri promenade",
    city: "Montréal",
    province: "QC",
    lat: 45.5544,
    lng: -73.5554,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      cdn("5716ebf4509410e168d52d683971e967f52ae72a-2400x1800.jpg"), // products/streetbond/streetbond-58.jpg
    ],
    post: "pedestrian-channelization-public-spaces",
    excerpt:
      "StreetBond150 over concrete at Parc Guido-Nincheri's promenade Ville-de-Québec: bold flowing lines designed by Civiliti as a gateway to Space for Life and the Olympic Park.",
    problem:
      "Civiliti's design for the promenade carries a motif of bark, knots and movement through its walls, furniture and paving, and the paving needed its flowing lines in colour on concrete.",
    solution:
      "StreetBond150 applied over the concrete to draw the bold flowing lines at the centre of the promenade's landscape design. The coating bonds permanently to concrete.",
  },
  {
    // Idea Book p.49, the Sport Courts spread: "Montréal, Québec". The site is not
    // identified: approximate.
    id: "montreal-basketball-court",
    title: "Basketball court",
    city: "Montréal",
    province: "QC",
    lat: 45.5112,
    lng: -73.5505,
    product: "StreetBond",
    application: "Sport Courts",
    approximate: true,
    images: [
      local("montreal-basketball-court"), // Idea Book p.49
    ],
    ideaBookPage: 49,
    excerpt:
      "A basketball court in StreetBond blue and yellow in Montréal.",
  },
  {
    // Idea Book p.61: "Saint-Antoine-sur-Richelieu, Québec", on the Splash Pads spread
    // (StreetBond, StreetBondSR). The municipality's only jeux d'eau are at the Centre
    // communautaire, 1060 rue du Moulin-Payet.
    id: "saint-antoine-splash-pad",
    title: "Community centre splash pad",
    city: "Saint-Antoine-sur-Richelieu",
    province: "QC",
    lat: 45.7835,
    lng: -73.1754,
    product: "StreetBond",
    application: "Splash Pads",
    images: [
      local("saint-antoine-splash-pad"), // Idea Book p.61
    ],
    ideaBookPage: 61,
    excerpt:
      "StreetBond colour on the splash pad at the community centre in Saint-Antoine-sur-Richelieu.",
  },
  {
    // Idea Book p.102: "Observatory. Lit by starlight... A white StreetBondSR surface
    // reflects what little light there is. Mont-Mégantic, Québec | StreetBondSR". Pin at
    // the public observatory terrace on the summit.
    id: "mont-megantic-observatory",
    title: "Mont-Mégantic summit terrace",
    city: "Mont-Mégantic",
    province: "QC",
    lat: 45.4557,
    lng: -71.1493,
    product: "StreetBondSR",
    application: "Public Spaces",
    images: [
      local("mont-megantic-observatory"), // Idea Book p.102
    ],
    ideaBookPage: 102,
    excerpt:
      "White StreetBondSR on the summit terrace at Mont-Mégantic, inside the world's first International Dark Sky Reserve, reflecting what little light there is.",
  },

  // ── New Brunswick ───────────────────────────────────────────────────────────────
  {
    // Idea Book p.24, the StreetBond page: "Saint John, New Brunswick | Harbour Passage".
    // The poles across the water are the new Fundy Quay extension; the building is the
    // Hilton at Market Square.
    id: "saint-john-harbour-passage",
    title: "Harbour Passage",
    city: "Saint John",
    province: "NB",
    lat: 45.2729,
    lng: -66.0657,
    product: "StreetBond",
    application: "Parks & Paths",
    images: [
      cdn("a5ab22bbcc6abda065bd71f2f3052193847353d9-1215x911.jpg"), // applications/commercial-spaces (Idea Book p.24)
    ],
    ideaBookPage: 24,
    excerpt:
      "Red StreetBond on Harbour Passage, Saint John's waterfront walkway, at Market Slip beside Market Square.",
  },

  // ── Prince Edward Island ────────────────────────────────────────────────────────
  {
    // Idea Book pp.134–135: "Charlottetown, PEI: the cruise ship terminal walkway, stamped
    // in a herringbone basket-weave and sealed with StreetBond". Pin on the boardwalk
    // between the cruise berth and the marina.
    id: "charlottetown-cruise-terminal",
    title: "Cruise terminal and marina walkway",
    city: "Charlottetown",
    province: "PE",
    lat: 46.2324,
    lng: -63.1205,
    product: "StreetPrint",
    systems: ["StreetBond"],
    application: "Public Spaces",
    images: [
      cdn("ad11a0a01590f3d3c37ace7e2c30bc4bc1b66b30-1280x349.jpg"), // applications/public-spaces (Idea Book p.134)
    ],
    ideaBookPage: 134,
    excerpt:
      "The cruise ship terminal walkway on the Charlottetown waterfront, stamped in a herringbone basket-weave and sealed with StreetBond for pedestrians, rolling luggage and salt air.",
  },
];

/**
 * Every published post, so a pin links to its write-up only when there is one
 * to read. lib/blog-index.json is written first in every build.
 */
const publishedSlugs = new Set((blogIndex as { slug: string }[]).map((b) => b.slug));

export const mapProjects: MapProject[] = curatedProjects.map((p) =>
  p.post && publishedSlugs.has(p.post) ? { ...p, slug: p.post } : p
);

/**
 * The number the page is allowed to say out loud. Measured, not typed — the
 * phone card used to advertise "84 projects" while the header forty pixels
 * below it said 59.
 */
export const mapProjectCount = mapProjects.length;

/** A smaller copy of a map photo, for thumbnails: Sanity sizes on request, /public files have a -sm twin. */
export function mapThumb(src: string, width = 320): string {
  if (src.startsWith("https://cdn.sanity.io/")) {
    return `${src}?w=${width}&q=70&auto=format&fit=max`;
  }
  return src.startsWith("/images/map/") ? src.replace(/\.jpg$/, "-sm.jpg") : src;
}
