export interface Application {
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  imageUrl: string;
  gallery?: string[];
  relatedProducts: string[];
  // SEO overrides ported from old hubss.com.
  seoTitle?: string;
  seoDescription?: string;
}

function gallery(slug: string, dir: string, count: number, ext: string = "jpg", pngOverrides: number[] = []): string[] {
  const pngSet = new Set(pngOverrides);
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const resolvedExt = pngSet.has(n) ? "png" : ext;
    return `/images/applications/${dir}/${slug}-${String(n).padStart(2, "0")}.${resolvedExt}`;
  });
}

// 17 Oct 2026 (Doug's copy round: the application paragraphs were "gobbledygook"): every "How it
// works" paragraph below was rewritten to one shape. What the surface has to do; which HUB systems do
// it and how each goes in, in the maker's words (PPG Ennis-Flint, GAF/StreetBond, docs/GLOSSARY.md);
// how the choice is made; a documented job where one helps (the map's and Insights' only). No slogans
// ("the largest untapped canvas", "live and die by their first impression"), no claim without a source
// ("ASTM-rated retroreflectivity" for a decorative crosswalk, "safe to fall on", "Halifax to Vancouver",
// "Vision Zero crosswalk standards", "bond strength exceeding 3 MPa"). The printed spread above each
// paragraph (lib/application-catalogue.ts) keeps the book's own headline, pull line and SPECIFY list,
// so the paragraph does not repeat them. The one-line descriptions stay descriptive (what the work is)
// rather than the book's headlines, because the headline is already the first thing under the hero and
// would print twice on one screen. The SEO titles are sentence case, the page's name first, then the
// plain words, short enough to keep "| HUB Surface Systems". Sanity overrides these fields:
// `npm run sync:applications:dry`, then `npm run sync:applications` on Vern's PC.
//
// relatedProducts mirrors relatedApplications in lib/products.ts, with the Product Book SPECIFY lists
// (lib/application-catalogue.ts) as the authority: see RELATIONS at the top of lib/products.ts. Where a
// system came off a page on 28 Sep 2026 (QA pa#31), the "How it works" copy stopped naming it too.
export const applications: Application[] = [
  {
    name: "Crosswalks",
    slug: "crosswalks",
    seoTitle: "Crosswalks: decorative thermoplastic",
    seoDescription: "Decorative crosswalks in preformed thermoplastic, 125 or 150 mil, with anti-skid aggregate through the material and colour that lasts through plow seasons.",
    shortDesc: "High-contrast crosswalks in preformed thermoplastic that keep their grip and their colour through plow seasons.",
    imageUrl: "/images/applications/crosswalks/crosswalks-09.jpg",
    gallery: [1,3,6,8,11,13,16,18,21,23,26,28,31,33,36,38,41,43,45,48,50,53,55,58,60,63,65,68,70,73,75,78,80,83,85,87,90,92,95,97,100,102,105,107,110,112,115,117,120,122].map(n => {
      const ext = [41, 112, 115].includes(n) ? "png" : "jpg";
      return `/images/applications/crosswalks/crosswalks-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "A crosswalk has two jobs: it tells a driver that someone may be crossing, and it keeps its grip under the people who do. HUB builds crosswalks in preformed thermoplastic. TrafficPatterns is heat-applied to asphalt or concrete and bonds to the surface; TrafficPatternsXD, the thicker, aggregate-reinforced sheet, is heated on prepared asphalt and stamped into it, for intersections with heavy, turning traffic. Both carry anti-skid aggregate through the full material, so the grip lasts as the surface wears, and both hold their colour through plow blades and de-icing seasons. DecoMark adds custom graphics for a crossing that carries a community's artwork, and DuraTherm sets the marking into stamped asphalt where a plow would strip anything that sits on top.",
    // StreetPrint added (pa#31): its own spread names crosswalks, and its page already listed this one.
    relatedProducts: ["traffic-patterns-xd", "traffic-patterns", "decomark", "streetbond", "duratherm", "premark", "streetprint"],
  },
  {
    name: "Bike Lanes",
    slug: "bike-lanes",
    seoTitle: "Bike lanes: MMA and thermoplastic",
    seoDescription: "Coloured bike lanes in MMAX MMA resin, traffic-ready in about an hour, with PreMark preformed thermoplastic symbols and bike boxes.",
    shortDesc: "Coloured lanes in MMA, symbols and bike boxes in preformed thermoplastic.",
    imageUrl: "/images/applications/bike-lanes/bike-lanes-01.jpg",
    gallery: gallery("bike-lanes", "bike-lanes", 38, "jpg", [32]),
    description: "A bike lane protects cyclists only while drivers can see it, so its colour and its symbols have to last. MMAX is an MMA area marking: a two-part resin with hard aggregate and colourfast green pigment, traffic-ready in about an hour, so a lane goes in overnight. PreMark supplies the bicycle symbols, arrows, bike boxes and conflict-zone markings in preformed thermoplastic, pre-cut to specification and heat-applied without stencils, with glass beads that return a headlight to the driver. StreetBond pavement coating colours lanes and multi-use paths with lighter traffic. The choice is made by the traffic the lane carries and the window the road can be closed for.",
    // TrafficPatterns and TrafficPatternsXD out (pa#31): the spread specifies MMAX and PreMark, and Doug
    // said in May that neither thermoplastic goes in a bike lane (components/sections/ProductsGrid.tsx).
    relatedProducts: ["mmax", "premark", "streetbond"],
  },
  {
    name: "Bus Lanes",
    slug: "bus-lanes",
    seoTitle: "Bus lanes: MMA markings and corridors",
    seoDescription: "Red bus lanes in MMAX MMA resin and TrafficPatternsXD crossings stamped into the asphalt, specified by Canadian transit authorities.",
    shortDesc: "Red bus lanes and transit corridor surfaces in MMA and aggregate-reinforced thermoplastic, built for concentrated loads.",
    imageUrl: "/images/applications/bus-lanes/bus-lanes-01.jpg",
    gallery: gallery("bus-lanes", "bus-lanes", 40, "jpg", [37, 38, 39, 40]),
    description: "Bus lanes and transit corridors concentrate wear: the same wheel paths, thousands of times a day, with braking and turning at every stop. MMAX gives the red lane: an MMA resin with hard aggregate, marked in one overnight closure. TrafficPatternsXD, the aggregate-reinforced preformed thermoplastic, is heated and stamped into the asphalt at crossings and bus stops, where it holds under concentrated loads and keeps its grip. HUB specifies both for bus rapid transit corridors and bus priority lanes.",
    // PreMark out (pa#31): not in the spread's SPECIFY, and PreMark's page never listed bus lanes.
    relatedProducts: ["traffic-patterns-xd", "mmax", "duratherm", "streetbond"],
  },
  {
    name: "Parking Lots",
    slug: "parking-lots",
    seoTitle: "Parking lots: coatings and markings",
    seoDescription: "DuraShield maintenance coating, StreetBond colour, StreetPrint stamped asphalt and thermoplastic markings for commercial parking lots.",
    shortDesc: "Maintenance coatings, stamped asphalt and thermoplastic markings for commercial parking lots.",
    imageUrl: "/images/applications/parking-lots/parking-lots-01.jpg",
    gallery: [1,2,3,4,5,7,8,9,10,11,13,14,15,16,17,19,20,21,22,23,25,26,27,28,29,31,32,33,34,35,37,38,39,40,41,43,44,45,46,47,49,50,51,52,53,55,56,57,58,59].map(n =>
      `/images/applications/parking-lots/parking-lots-${String(n).padStart(2,"0")}.jpg`),
    description: "A parking lot takes sun, oil, de-icing salt and wheel loads that turn in place, and it is judged every day by the people who use it. DuraShield is a two-component, epoxy-modified acrylic maintenance coating for asphalt: it resists fuel, oil and de-icing agents and protects the pavement underneath, so a sound surface is coated instead of replaced. StreetBond adds colour for drive aisles, wayfinding zones and fire lanes, and StreetPrint stamps a pattern into the asphalt at entrances and pedestrian routes for the look of pavers with nothing to settle or weed. For the crossings between the stalls and the doors, TrafficPatternsXD holds under turning traffic, and PreMark supplies arrows, stop bars and accessible parking symbols in preformed thermoplastic.",
    // StreetBondSR added (pa#31): its own spread names parking, and its page already listed this one.
    relatedProducts: ["durashield", "streetbond", "streetprint", "traffic-patterns-xd", "traffic-patterns", "premark", "duratherm", "streetbondsr"],
  },
  {
    name: "Parks & Paths",
    slug: "parks-paths",
    seoTitle: "Parks and paths: decorative pavement",
    seoDescription: "StreetBond colour, StreetPrint stamped asphalt and DecoMark graphics for park paths, plazas and multi-use trails, with DuraShield for older paths.",
    shortDesc: "Colour, pattern and wayfinding on park paths, plazas and multi-use trails.",
    imageUrl: "/images/applications/parks-paths/parks-paths-01.jpg",
    gallery: [1,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,130,133,136,139,142,143,144].map(n => {
      const ext = [97, 100, 103].includes(n) ? "png" : "jpg";
      return `/images/applications/parks-paths/parks-paths-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "A well-kept, colourful path invites people into a park, and a path surface has to take bikes, strollers and plow blades as well as feet. StreetBond pavement coating puts UV-stable colour on existing asphalt paths and plazas, so a route can double as wayfinding or become a destination in itself. StreetPrint stamps a pattern into the asphalt at entries, seating courts and plazas for the look of stone with no joints to weed. DecoMark adds custom graphics at ground level, wayfinding symbols, recognition markers and play markings, heat-applied to the surface, and TrafficPatterns carries the crossing where a path meets a road. DuraShield maintenance coating extends the service life of an older path that is still sound.",
    // TrafficPatterns added (pa#31): its own spread names parks, and its page already listed this one.
    relatedProducts: ["streetbond", "decomark", "durashield", "streetprint", "traffic-patterns"],
  },
  {
    name: "Playgrounds",
    slug: "playgrounds",
    seoTitle: "Playgrounds: coloured play surfaces",
    seoDescription: "StreetBond colour and DecoMark play markings on asphalt and concrete playgrounds: slip-resistant, UV-stable, recoated instead of rebuilt.",
    shortDesc: "Colour and game markings on school and park asphalt, with grip, recoated rather than rebuilt.",
    imageUrl: "/images/applications/playgrounds/playgrounds-01.jpg",
    gallery: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52].map(n =>
      `/images/applications/playgrounds/playgrounds-${String(n).padStart(2,"0")}.jpg`),
    description: "Children are hard on surfaces: knees, bikes, basketballs and a decade of running, with no budget for annual repainting. StreetBond pavement coating puts vivid, UV-stable colour on an asphalt or concrete play surface with a slip-resistant texture, and StreetBondSR colours reflect the sun so the surface stays cooler underfoot. DecoMark brings the games and the graphics: hopscotch, number grids, compass roses, four-square courts and school crests, factory-cut in preformed thermoplastic and heat-applied to the surface. TrafficPatterns carries the crossing at the school gate in the same material. A worn surface is recoated over a summer break, not rebuilt.",
    // StreetPrint out (pa#31): not in the Play Surfaces spread, and StreetPrint's page never listed it.
    relatedProducts: ["decomark", "streetbond", "streetbondsr", "traffic-patterns"],
  },
  {
    name: "Community Branding",
    slug: "community-branding",
    seoTitle: "Community branding: street graphics",
    seoDescription: "Crests, BIA wayfinding, heritage markers and First Nations artwork in DecoMark preformed thermoplastic, heat-applied to the street.",
    shortDesc: "Neighbourhood identity, cultural art and wayfinding, heat-applied to the street in preformed thermoplastic.",
    imageUrl: "/images/blog/white-rock-langley-trafficpatterns/featured.jpg",
    gallery: gallery("community-branding", "community-branding", 14),
    description: "Community branding puts a neighbourhood's name, crest and story into the surface of its streets. DecoMark is the system: custom graphics factory-cut in preformed thermoplastic to the community's artwork, in standard and premium colours, and heat-applied to asphalt or concrete, where it bonds to the surface. It carries BIA wayfinding and business district branding, heritage markers, Pride crossings and First Nations artwork made in partnership with the nation. TrafficPatterns and TrafficPatternsXD carry the same identity into the crosswalks, as at UBC, where the Musqueam crosswalk was designed by the university and the nation together in TrafficPatterns, and StreetPrint stamps a heritage streetscape into the asphalt itself. All of it is made from vector artwork and installed by HUB's certified installers.",
    // StreetBond out (pa#31): not in the spread's SPECIFY, and StreetBond's page never listed it.
    relatedProducts: ["decomark", "traffic-patterns-xd", "traffic-patterns", "streetprint", "duratherm"],
  },
  // "Private Driveways" (slug private-driveways) came out on 30 Sep 2026 (QA C2,
  // E18): it and Residential Driveways were the same printed spread (Product Book
  // page 76) with the same 44 photos. Residential Driveways below is the one
  // page; next.config.ts redirects the old address to it. The Sanity document
  // for private-driveways is now an orphan and can be deleted in Studio.
  {
    name: "Sport Courts",
    slug: "sport-courts",
    seoTitle: "Sport courts: StreetBond court colour",
    seoDescription: "StreetBond pavement coating for tennis, basketball, pickleball and multi-sport courts: 63 colours, custom matching, recoated when worn.",
    shortDesc: "Court colour for tennis, basketball, pickleball and multi-sport surfaces, in StreetBond pavement coating.",
    imageUrl: "/images/products/streetbond/streetbond-67.png",
    gallery: gallery("sport-courts", "sport-courts", 21, "jpg", [19]),
    description: "Lateral movement, constant foot traffic, sun, and lines whose geometry the game depends on: a court asks more of a coating than most pavement does. StreetBond pavement coating is a two-part, water-based, epoxy-modified acrylic that bonds to asphalt or acid-etched concrete and moves with the pavement instead of cracking, in 63 standard colours with custom matching for a school's or a club's colours. The playing surface, the border and the lines go down in the same material, with a texture that gives grip in the wet. StreetBondSR colours reflect the sun, so a court in full summer sun stays cooler underfoot. When the lines wear, the court is recoated.",
    relatedProducts: ["streetbond", "streetbondsr"],
  },
  {
    name: "Splash Pads",
    slug: "splash-pads",
    seoTitle: "Splash pads: slip-resistant coatings",
    seoDescription: "StreetBond coatings for splash pads: slip-resistant in the wet, UV-stable colour, and StreetBondSR colours that stay cooler on bare feet.",
    shortDesc: "StreetBond coatings for a surface that is wet, chemically treated and walked on barefoot all day.",
    imageUrl: "/images/applications/splash-pads/splash-pads-01.jpg",
    gallery: gallery("splash-pads", "splash-pads", 19, "jpg", [11]),
    description: "On a splash pad the first requirement is grip in the wet, with chemical treatment and bare feet all season. StreetBond pavement coating is applied to the prepared concrete in a textured, slip-resistant build, in the vivid colours that make the pad a destination, with UV-stable pigments that hold through a season of sun and chemical splash. StreetBondSR colours reflect a third of the sun's energy or more, so the surface stays cooler on bare feet. The coating moves with the concrete rather than cracking, and a worn pad is recoated between seasons.",
    // DecoMark and DuraShield out (pa#31): the spread specifies StreetBond and StreetBondSR only.
    relatedProducts: ["streetbond", "streetbondsr"],
  },
  {
    name: "Public Spaces",
    slug: "public-spaces",
    seoTitle: "Public spaces: stamped asphalt and colour",
    seoDescription: "StreetPrint stamped asphalt, StreetBond colour and DecoMark graphics for plazas, campuses, transit forecourts and civic squares.",
    shortDesc: "Stamped and coloured asphalt for plazas, transit forecourts and campuses.",
    imageUrl: "/images/applications/commercial-spaces/commercial-spaces-55.jpg",
    gallery: [1,2,3,5,6,7,9,10,11,13,14,15,17,18,19,21,22,23,25,26,27,29,30,31,33,34,35,37,38,39,41,42,43,45,46,47,49,50,51,53,54,55,57,58,59,61,62,63,65,66].map(n => {
      const ext = [9,10,11,13,14,15,17,18,19,21,22,23,25,26,27,29,30,31,33,34,35,37,38].includes(n) ? "png" : "jpg";
      return `/images/applications/public-spaces/public-spaces-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "Plazas, transit forecourts, campuses and civic squares are the most looked-at surfaces in a community. StreetPrint stamps a pattern into the asphalt itself, so a plaza gets the look of stone paving with the asphalt's own flexibility: no pavers to settle, no joints to weed, nothing for a plow to catch. StreetBond pavement coating colours the pattern and, on its own, marks zones, routes and gathering places in 63 standard colours, as in the labyrinth at BC Children's Hospital. DecoMark adds the graphics, from a campus crest to wayfinding, heat-applied to the surface, and DuraTherm inlays a decorative crossing flush with the road where the plaza meets traffic. All of it goes in over sound asphalt, with no excavation.",
    relatedProducts: ["streetprint", "streetbond", "decomark", "duratherm"],
  },
  {
    name: "Commercial Spaces",
    slug: "commercial-spaces",
    seoTitle: "Commercial spaces: stamped asphalt",
    seoDescription: "StreetPrint stamped asphalt entry courts and TrafficPatternsXD crosswalks for retail centres, mixed-use developments and hotels.",
    shortDesc: "Hardscape finishes for retail centres, mixed-use developments, and hospitality entries.",
    imageUrl: "/images/applications/crosswalks/crosswalks-110.jpg",
    gallery: [1,3,5,8,10,12,15,17,19,22,24,26,29,31,33,36,38,40,43,45,47,50,52,54,57,59,61,64,66,68,71,73,75,78,80,82,85,87,89,92,94,96,99,101,103,106,108,110,113,115].map(n => {
      const ext = [110].includes(n) ? "png" : "jpg";
      return `/images/applications/commercial-spaces/commercial-spaces-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "Customers and tenants read a retail centre, a mixed-use development or a hotel entrance before they walk in, and the surface at the door is the first thing underfoot. StreetPrint stamps cobblestone, herringbone or fan patterns into the asphalt of entry courts and walkways for the look of stone at a lower cost than natural stone, with none of the settling, weeding and re-levelling that pavers need. TrafficPatternsXD, the aggregate-reinforced preformed thermoplastic, carries the crosswalks from the parking lot to the doors: stamped into the asphalt, it holds under turning traffic and keeps its grip and its colour for a service life of ten years or more.",
    // The spread specifies TrafficPatternsXD alone; StreetPrint stays because its page lists this one too.
    // StreetBond, DuraShield and TrafficPatterns out (pa#31): none listed Commercial Spaces back.
    relatedProducts: ["traffic-patterns-xd", "streetprint"],
  },
  {
    name: "Townhomes",
    slug: "townhomes",
    seoTitle: "Townhomes and strata: stamped asphalt",
    seoDescription: "StreetPrint stamped asphalt and StreetBond colour for townhome entry courts and shared drives, with DuraShield for ageing asphalt.",
    shortDesc: "Cohesive stamped asphalt hardscape for townhome and strata developments.",
    imageUrl: "/images/applications/townhomes/townhomes-01.jpg",
    gallery: gallery("townhomes", "townhomes", 18, "jpg", [4, 5, 6, 18]),
    description: "A townhome or strata development is judged at the curb, and its shared surfaces are paid for by the owners who live there, so maintenance matters as much as looks. StreetPrint stamps clay-paver or stone-cobble patterns into the asphalt of entry courts, shared drives and visitor parking, with no pavers to settle and no joints to weed. StreetBond pavement coating colours the pattern and ties the courts and walkways into one palette; when it wears, a crew recoats it. For a strata with sound but ageing asphalt, DuraShield maintenance coating protects the surface from fuel, oil and de-icing salt and extends its service life before any decorative work is needed.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Residential Driveways",
    slug: "residential-driveways",
    seoTitle: "Residential driveways: stamped asphalt",
    seoDescription: "StreetPrint turns an existing asphalt driveway into cobblestone, brick, herringbone or slate, coloured with StreetBond. No demolition.",
    shortDesc: "Your existing asphalt, stamped and coloured to look like brick or stone. Nothing dug up.",
    imageUrl: "/images/applications/residential-driveways/residential-driveways-18.jpg",
    gallery: gallery("residential-driveways", "residential-driveways", 44),
    description: "A driveway is the most visible surface a homeowner owns, and the most used. StreetPrint works on the asphalt already there: the surface is reheated, a steel wire-rope template presses a cobblestone, brick, herringbone or slate pattern into it, and StreetBond pavement coating colours it in the owner's choice of colour. There is no demolition, no excavation and no haul-away, and the finished driveway has the look of stone pavers with the asphalt's flexibility: nothing settles, nothing heaves, nothing grows between joints. Years on, the colour is renewed with a fresh coat. Where an older driveway is sound but tired, DuraShield maintenance coating protects it and extends its service life.",
    // StreetBond out (pa#31): the driveway spread specifies StreetPrint alone. (Until 30 Sep 2026 StreetBond's
    // page listed the Private Driveways twin instead; that page is gone.) The copy above still names
    // StreetBond as StreetPrint's own coating.
    relatedProducts: ["streetprint", "durashield"],
  },
  {
    name: "Pedestrian Safety",
    slug: "pedestrian-safety",
    seoTitle: "Pedestrian safety: contrast crosswalks",
    seoDescription: "High-contrast crosswalks in preformed thermoplastic, PreMark retroreflective markings and MMAX colour for school zones and pedestrian priority.",
    shortDesc: "High-contrast crosswalks and retroreflective markings that stay visible through Canadian winters.",
    imageUrl: "/images/applications/crosswalks/crosswalks-03.jpg",
    gallery: [1,3,6,8,11,13,16,18,21,23,26,28,31,33,36,38,41,43,45,48,50,53,55,58,60,63,65,68,70,73,75,78,80,83,85,87,90,92,95,97,100,102,105,107,110,112,115,117,120,122].map(n => {
      const ext = [41, 112, 115].includes(n) ? "png" : "jpg";
      return `/images/applications/crosswalks/crosswalks-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "A crosswalk marking has to be seen at night in the rain, and a school zone treatment has to read at driving speed; both have to survive a Canadian winter. TrafficPatterns and TrafficPatternsXD give crossings and school zones high-contrast colour in preformed thermoplastic, with anti-skid aggregate through the material, so the contrast and the grip last through plow blades and de-icing seasons. PreMark adds the retroreflective part: stop bars, ladder lines, school legends and symbols in preformed thermoplastic with glass beads that return a headlight to the driver. MMAX marks pedestrian priority zones and raised intersections in colour, in an overnight closure. Together they support a Vision Zero program at the surface, where the driver's eye meets the road.",
    // Now exactly the spread's SPECIFY list (pa#31): StreetBond and DecoMark never listed this page.
    relatedProducts: ["traffic-patterns-xd", "traffic-patterns", "premark", "mmax"],
  },
  {
    name: "Traffic Calming",
    slug: "traffic-calming",
    seoTitle: "Traffic calming: colour and texture",
    seoDescription: "StreetPrint, StreetBond, TrafficPatternsXD and MMAX for gateways, speed tables, roundabouts and raised crossings that drivers read at a glance.",
    shortDesc: "Colour and texture for gateways, speed tables and roundabouts, so drivers see the street change before any sign.",
    imageUrl: "/images/applications/traffic-calming/traffic-calming-01.jpg",
    gallery: [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,51,52,53,54,55].map(n => {
      const ext = [43].includes(n) ? "png" : "jpg";
      return `/images/applications/traffic-calming/traffic-calming-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "Traffic calming works when a driver sees the street change before a sign says so, and colour and texture do that at a gateway, a speed table, a roundabout apron or a raised crossing. StreetPrint stamps a pattern into the asphalt of the calming device itself, so the texture is in the road rather than on it, and StreetBond pavement coating colours it; the same coating marks the sidewalks, pathways and plazas around it. TrafficPatternsXD, aggregate-reinforced preformed thermoplastic stamped into the asphalt, carries the raised crosswalk and the school zone treatment under heavy traffic. MMAX colours a whole calming zone in the same closure.",
    // TrafficPatterns out (pa#31): not in the spread's SPECIFY, and its page never listed traffic calming.
    relatedProducts: ["streetprint", "streetbond", "traffic-patterns-xd", "mmax"],
  },
  {
    name: "Airports",
    slug: "airports",
    seoTitle: "Airports: thermoplastic airfield markings",
    seoDescription: "AirMark preformed thermoplastic for taxiways, hold positions, aprons and airside roadways: retroreflective, applied by certified crews.",
    shortDesc: "Preformed thermoplastic airfield markings for taxiways, aprons and other non-runway surfaces, applied by certified crews.",
    imageUrl: "/images/applications/airports/airports-01.jpg",
    gallery: gallery("airports", "airports", 28, "jpg", [20]),
    description: "Airfield markings are read by pilots and ground crews at speed, in all weather, through de-icing fluid and ground-handling traffic. AirMark is preformed thermoplastic made for the airside surfaces other than the runway: taxiway markings, hold positions, apron and ramp markings, aircraft parking and tie-down positions, and airside vehicle roadways, in five standard colours. Glass beads run through the full cross-section, so retroreflectivity holds as the marking wears, and it resists aviation fuels, lubricants and de-icers. HUB's certified crews heat-apply it inside a closure window, and the marking is open to traffic once it has cooled.",
    relatedProducts: ["airmark"],
  },
  {
    name: "LEED & Urban Heat Island",
    slug: "leed-urban-heat-island",
    seoTitle: "LEED: solar reflective pavement coatings",
    seoDescription: "StreetBondSR solar reflective coatings lower the pavement's surface temperature and can count toward the LEED v5 heat island credit.",
    // "Earn LEED credits" softened to "can contribute", 28 Sep 2026 (QA pa#12), as the StreetBondSR page and
    // the Product Book say it. Only the claim changed: replacing the whole line is proposed to Doug in
    // docs/COPY-FOR-DOUG.md §3 and still waits on him.
    shortDesc: "Solar reflective pavement coatings that reduce the urban heat island effect and can contribute to LEED v5 credits.",
    imageUrl: "/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg",
    gallery: gallery("leed-urban-heat-island", "leed-urban-heat-island", 2),
    // Rewritten plainly (pa#34): no verbless closing line. Solar reflectance and the credit are worded as on
    // the StreetBondSR page, which follows the book ("SR 0.33 or higher", "can contribute").
    description: "Dark asphalt absorbs most of the sun's energy and adds to the urban heat island effect, the measurable temperature difference between a city and the rural areas around it. The extra heat raises air-conditioning demand and makes summer heat events more dangerous for vulnerable people. StreetBondSR is a solar-reflective coating that lowers pavement surface temperature. Its lighter colours reflect a third of the sun's energy or more, which can count toward the LEED v5 credit for reducing the urban heat island.",
    // StreetBond out (pa#31): no spread covers this page and StreetBond's page never listed it.
    relatedProducts: ["streetbondsr", "durashield"],
  },
  {
    name: "Public Art",
    slug: "public-art",
    seoTitle: "Public art: artwork in the street surface",
    seoDescription: "Artwork reproduced in DecoMark preformed thermoplastic and StreetBond colour: murals, labyrinths and Indigenous crossings at the scale of the street.",
    shortDesc: "Civic-scale pavement murals, Indigenous art installations, and landmark street graphics.",
    imageUrl: "/images/applications/community-branding/community-branding-02.jpg",
    gallery: gallery("community-branding", "community-branding", 14),
    description: "Street-scale art has to survive traffic, weather and winter maintenance as well as look right from the sidewalk. DecoMark reproduces an artist's work in preformed thermoplastic: the artwork is supplied as vector files, factory-cut in standard and premium colours, and heat-applied to asphalt or concrete, where it bonds to the surface with anti-skid aggregate through the material. StreetBond pavement coating lays down the large colour fields, from a plaza mural to the labyrinth at BC Children's Hospital, in 63 standard colours with custom matching. TrafficPatterns carries an artwork across a crossing as one interconnected sheet of thermoplastic. HUB works with the artist, the municipality and, for Indigenous work, the nation whose design it is, and the installed piece has the service life of the system it is made from.",
    relatedProducts: ["decomark", "streetbond", "traffic-patterns", "streetprint"],
  },
  {
    name: "Regulatory Markings",
    slug: "regulatory-markings",
    seoTitle: "Regulatory markings in thermoplastic",
    seoDescription: "PreMark preformed thermoplastic stop bars, arrows, legends and symbols, pre-cut to specification, heat-applied without stencils, retroreflective.",
    shortDesc: "Thermoplastic stop bars, arrows, legends, and lane markings that hold spec season after season.",
    imageUrl: "/images/applications/traffic-calming/traffic-calming-01.jpg",
    gallery: [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,51,52,53,54,55].map(n => {
      const ext = [43].includes(n) ? "png" : "jpg";
      return `/images/applications/traffic-calming/traffic-calming-${String(n).padStart(2,"0")}.${ext}`;
    }),
    // Rewritten plainly, 28 Sep 2026 (QA pa#34): no "not decorative elements" reversal. TrafficPatterns and
    // TrafficPatternsXD came off this page (pa#31), and with them an "ASTM-rated visibility" claim no
    // document makes for them; the PreMark facts are those on PreMark's own page.
    description: "Stop bars, turn arrows, yield lines, school zone legends, accessible parking symbols and lane designations carry legal weight on the road. Each one has to sit where it belongs, keep its dimensions and stay legible at night in the rain until the next maintenance cycle. PreMark preformed thermoplastic comes pre-cut to specification for arrows, stop bars, yield triangles, school legends, accessible parking symbols and crosswalk ladder lines, and is heat-applied without stencils. Integrated glass beads make it retroreflective, and it is open to traffic immediately, with no curing window.",
    // No spread covers this page. TrafficPatterns, TrafficPatternsXD and DuraTherm out (pa#31): none of
    // their pages listed it and their spreads don't name it. PreMark's spread names "Regulatory".
    relatedProducts: ["premark", "airmark"],
  },
];
