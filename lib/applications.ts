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

// relatedProducts mirrors relatedApplications in lib/products.ts, with the Idea Book SPECIFY lists
// (lib/application-catalogue.ts) as the authority: see RELATIONS at the top of lib/products.ts. Where a
// system came off a page on 28 Sep 2026 (QA pa#31), the "How it works" copy stopped naming it too.
export const applications: Application[] = [
  {
    name: "Crosswalks",
    slug: "crosswalks",
    seoTitle: "Decorative Crosswalks · Thermoplastic Pedestrian Markings",
    seoDescription: "Aggregate-reinforced preformed thermoplastic crosswalk markings for high-visibility pedestrian safety, traffic calming, and community identity, specified across Canada.",
    shortDesc: "Durable, high-contrast crosswalk systems that make the intersection a landmark.",
    imageUrl: "/images/applications/crosswalks/crosswalks-09.jpg",
    gallery: [1,3,6,8,11,13,16,18,21,23,26,28,31,33,36,38,41,43,45,48,50,53,55,58,60,63,65,68,70,73,75,78,80,83,85,87,90,92,95,97,100,102,105,107,110,112,115,117,120,122].map(n => {
      const ext = [41, 112, 115].includes(n) ? "png" : "jpg";
      return `/images/applications/crosswalks/crosswalks-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "A crosswalk does two jobs: it protects pedestrians, and it tells a driver that someone is about to cross. HUB crosswalk systems are specified where both those jobs need to stay done, season after season. TrafficPatterns and TrafficPatternsXD thermoplastic fuse permanently to the road surface, maintaining ASTM-rated retroreflectivity through snowplow cycles, de-icing chemical seasons, and freeze-thaw cycles that challenge any surface. DecoMark and StreetBond open the crosswalk up as a creative surface: Pride rainbow crossings, Indigenous cultural art, neighbourhood identity installations, and commemorative designs that make the intersection a landmark. Specified by municipalities from Halifax to Vancouver.",
    // StreetPrint added (pa#31): its own spread names crosswalks, and its page already listed this one.
    relatedProducts: ["traffic-patterns-xd", "traffic-patterns", "decomark", "streetbond", "duratherm", "premark", "streetprint"],
  },
  {
    name: "Bike Lanes",
    slug: "bike-lanes",
    shortDesc: "Coloured bike lane systems that hold visibility and protect cyclists season after season.",
    imageUrl: "/images/applications/bike-lanes/bike-lanes-01.jpg",
    gallery: gallery("bike-lanes", "bike-lanes", 38, "jpg", [32]),
    // 28 Sep 2026: "bond strength exceeding 3 MPa" is in no MMAX document (QA pa#12; CLAIMS-VERIFICATION.csv
    // had already softened it); the slogan opener and the verbless last line rewritten plainly (pa#34).
    description: "A bike lane protects cyclists only while drivers can see it, so its colour and markings have to last. StreetBond UV-stable acrylic holds green, red and custom Pantone colour through years of traffic and weather without chalking or fading. MMAX methyl methacrylate cures fully in 45–60 minutes, so it is specified for overnight work in transit-adjacent corridors. PreMark preformed thermoplastic provides the retroreflective bicycle symbols, arrows and conflict-zone markings for lanes, intersections and multi-use paths, and they hold their shape and visibility through seasons of heavy use.",
    // TrafficPatterns and TrafficPatternsXD out (pa#31): the spread specifies MMAX and PreMark, and Doug
    // said in May that neither thermoplastic goes in a bike lane (components/sections/ProductsGrid.tsx).
    relatedProducts: ["mmax", "premark", "streetbond"],
  },
  {
    name: "Bus Lanes",
    slug: "bus-lanes",
    shortDesc: "BRT corridor and bus priority lane treatments engineered for the harshest urban loads.",
    imageUrl: "/images/applications/bus-lanes/bus-lanes-01.jpg",
    gallery: gallery("bus-lanes", "bus-lanes", 40, "jpg", [37, 38, 39, 40]),
    // TODO: doug-review — Doug's note ended mid-sentence ("...survive this. Our MMAX line of MMA resin cures in...."). Polished here per Vernon; revisit when Doug clarifies the intended completion.
    description: "Bus priority lanes and BRT corridors are among the most demanding surfaces in any city's network: concentrated axle loads, tight turning radii, and the expectation that markings stay legible through thousands of bus movements a day. HUB's MMAX line of MMA resin cures in 45–60 minutes, traffic-ready in under an hour, enabling complete overnight installation in a single maintenance window without disrupting weekday transit operations. TrafficPatternsXD 150mil aggregate-reinforced thermoplastic delivers high skid resistance at bus stops and turning movements where wet-surface traction directly affects passenger safety. Both systems are engineered for season after season of performance in these demanding environments, ready when transit needs them. Specified for red bus lanes, transit signal priority corridors, and BRT station zones across Canada.",
    // PreMark out (pa#31): not in the spread's SPECIFY, and PreMark's page never listed bus lanes.
    relatedProducts: ["traffic-patterns-xd", "mmax", "duratherm", "streetbond"],
  },
  {
    name: "Parking Lots",
    slug: "parking-lots",
    shortDesc: "Durable stall markings, wayfinding colour, and surface rejuvenation for commercial parking.",
    imageUrl: "/images/applications/parking-lots/parking-lots-01.jpg",
    gallery: [1,2,3,4,5,7,8,9,10,11,13,14,15,16,17,19,20,21,22,23,25,26,27,28,29,31,32,33,34,35,37,38,39,40,41,43,44,45,46,47,49,50,51,52,53,55,56,57,58,59].map(n =>
      `/images/applications/parking-lots/parking-lots-${String(n).padStart(2,"0")}.jpg`),
    description: "Parking lots take a disproportionate beating: sun exposure, oil contamination, and high wheel-load cycles degrade asphalt and surface markings faster than almost any other paved environment. HUB parking lot systems treat the whole surface, stripes included. DuraShield maintenance coating seals oxidized asphalt against fuel, oil and de-icing agents, protecting the substrate underneath and extending pavement life at a fraction of replacement cost. TrafficPatterns and PreMark thermoplastic stall markings and accessible parking symbols hold retroreflectivity season after season without annual repainting. StreetBond colour treatments create branded wayfinding zones, coloured drive aisles, and fire lane designations that read clearly and last. For REITs, property managers, and facility teams: the result is a parking surface that looks maintained, performs safely, and costs less to operate.",
    // StreetBondSR added (pa#31): its own spread names parking, and its page already listed this one.
    relatedProducts: ["durashield", "streetbond", "streetprint", "traffic-patterns-xd", "traffic-patterns", "premark", "duratherm", "streetbondsr"],
  },
  {
    name: "Parks & Paths",
    slug: "parks-paths",
    seoTitle: "Decorative Paving for Parks and Paths",
    seoDescription: "Discover decorative paving products that redefine outdoor spaces. Engineered for durability and designed for beauty: surfaces that transform parks and paths into inviting, accessible spaces.",
    shortDesc: "Decorative surface systems for urban paths, park plazas, and multi-use trails.",
    imageUrl: "/images/applications/parks-paths/parks-paths-01.jpg",
    gallery: [1,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,130,133,136,139,142,143,144].map(n => {
      const ext = [97, 100, 103].includes(n) ? "png" : "jpg";
      return `/images/applications/parks-paths/parks-paths-${String(n).padStart(2,"0")}.${ext}`;
    }),
    // Rewritten plainly, 28 Sep 2026 (QA pa#34): the paired "neglect / care" slogans are gone. DuraShield
    // is a coating, not a rejuvenator (CLAIMS-VERIFICATION.csv), so "rejuvenation" went too.
    description: "A well-kept, colourful path invites people into a park. StreetBond puts UV-stable colour on existing asphalt trails and plazas, so a route can double as wayfinding or become a destination in itself. DecoMark adds custom thermoplastic graphics at ground level for cultural recognition art, wayfinding symbols and community identity. StreetPrint stamped asphalt gives plazas, seating courts and entries the look of stone paving with less maintenance. DuraShield maintenance coating extends the life of aging path surfaces that are still sound.",
    // TrafficPatterns added (pa#31): its own spread names parks, and its page already listed this one.
    relatedProducts: ["streetbond", "decomark", "durashield", "streetprint", "traffic-patterns"],
  },
  {
    name: "Playgrounds",
    slug: "playgrounds",
    seoTitle: "Playgrounds & Recreation · Schoolyard Paving",
    seoDescription: "Transform schoolyards with StreetBond: cost-effective, vibrant playground surfacing that increases physical activity and student engagement.",
    shortDesc: "Vibrant, slip-resistant playground surface graphics that stand up to hard use.",
    imageUrl: "/images/applications/playgrounds/playgrounds-01.jpg",
    gallery: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52].map(n =>
      `/images/applications/playgrounds/playgrounds-${String(n).padStart(2,"0")}.jpg`),
    description: "Children are hard on surfaces. Playground treatments get knees, bikes, basketballs, and a decade of foot traffic, and they need to look vibrant, be safe, and require no annual repainting to do their job. DecoMark custom thermoplastic graphics bring hopscotch courts, number grids, compass roses, wayfinding games, and mural-scale artwork to paved play surfaces with Pantone-accurate colour and flush-surface edges that eliminate trip hazards. StreetBond acrylic adds vivid, UV-stable colour to existing asphalt play courts, four-square grids, and multi-use activity areas. Both systems deliver surfaces that are safe to fall on, easy to clean, and designed to remain bright and engaging season after season without repainting.",
    // StreetPrint out (pa#31): not in the Play Surfaces spread, and StreetPrint's page never listed it.
    relatedProducts: ["decomark", "streetbond", "streetbondsr", "traffic-patterns"],
  },
  {
    name: "Community Branding",
    slug: "community-branding",
    shortDesc: "Neighbourhood identity, cultural art, and civic pride, embedded permanently in the street.",
    imageUrl: "/images/blog/white-rock-langley-trafficpatterns/featured.jpg",
    gallery: gallery("community-branding", "community-branding", 14),
    // Rewritten plainly, 28 Sep 2026 (QA pa#34): the opener repeated the Idea Book's pull line above it,
    // and the close was a slogan. DecoMark is heat-fused to the surface (its own page), not embedded.
    description: "Community branding puts a neighbourhood's culture, history and identity into the surface of its streets. DecoMark heat-fuses custom graphics to asphalt and concrete: First Nations cultural artwork made in reconciliation partnerships, BIA wayfinding and business district branding, neighbourhood crests and names, Pride crossings and heritage commemorations. Bowen Island's community art path and the UBC Musqueam cultural crosswalk are examples of HUB's work.",
    // StreetBond out (pa#31): not in the spread's SPECIFY, and StreetBond's page never listed it.
    relatedProducts: ["decomark", "traffic-patterns-xd", "traffic-patterns", "streetprint", "duratherm"],
  },
  {
    name: "Private Driveways",
    slug: "private-driveways",
    shortDesc: "Stamped asphalt driveways: the look of stone pavers without the demolition or maintenance.",
    imageUrl: "/images/applications/residential-driveways/residential-driveways-18.jpg",
    gallery: gallery("residential-driveways", "residential-driveways", 44),
    description: "Tearing out an existing driveway to install natural stone or concrete pavers is expensive, disruptive, and creates a raised edge profile that chips, shifts, and weeds. StreetPrint offers a better path: in-place stamped asphalt that works with the driveway already there, impressing cobblestone, brick, herringbone, or slate patterns directly into the surface, then sealing it with StreetBond UV-stable acrylic colour. The result is a rich decorative hardscape finish at a fraction of full paver installation cost, with a flush, snowplow-safe, weed-free surface that requires none of the maintenance that natural stone demands. For existing driveways showing their age, DuraShield maintenance coating protects the asphalt and extends surface life before cosmetic treatment.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Sport Courts",
    slug: "sport-courts",
    shortDesc: "Permanent court coatings for tennis, basketball, pickleball, and multi-sport surfaces.",
    imageUrl: "/images/products/streetbond/streetbond-67.png",
    gallery: gallery("sport-courts", "sport-courts", 21, "jpg", [19]),
    // 28 Sep 2026 (pa#31): the court spread specifies StreetBond and StreetBondSR only, and none of DecoMark,
    // StreetPrint or PreMark listed Sport Courts, so they are off the list and the DecoMark sentence is
    // gone. The verbless "Available in…" line it left at the end now has a verb.
    description: "Sport courts are one of the most demanding colour environments in outdoor pavement: lateral movement, constant foot traffic, UV exposure, and the precise line geometry that competition depends on. StreetBond acrylic bonds permanently to asphalt and acid-etched concrete, delivering vivid, UV-stable court surface colours and crisp line markings that hold their geometry and contrast season after season without repainting. It comes in standard court colour palettes, with custom Pantone matching for branded facilities.",
    relatedProducts: ["streetbond", "streetbondsr"],
  },
  {
    name: "Splash Pads",
    slug: "splash-pads",
    shortDesc: "Vivid, slip-resistant splash pad coatings designed for constant water exposure.",
    imageUrl: "/images/applications/splash-pads/splash-pads-01.jpg",
    gallery: gallery("splash-pads", "splash-pads", 19, "jpg", [11]),
    // "Meets wet-surface safety standards" removed, 28 Sep 2026 (QA pa#12): the StreetBond data sheets
    // give wet friction values but name no standard met. The slip-resistant texture is the book's claim.
    description: "Splash pad surfaces are a uniquely demanding environment: constant water exposure, chemical treatments, bare feet, and an absolute requirement for slip resistance under wet conditions. StreetBond's acrylic formulation is applied to acid-etched concrete splash pad surfaces, building a slip-resistant texture in the vivid, engaging colours that make a splash pad worth coming back to. UV-stable pigments maintain colour fidelity through seasons of sun exposure and chemical splash, without the chalking or delamination that afflicts lesser coatings on wet surfaces.",
    // DecoMark and DuraShield out (pa#31): the spread specifies StreetBond and StreetBondSR only.
    relatedProducts: ["streetbond", "streetbondsr"],
  },
  {
    name: "Public Spaces",
    slug: "public-spaces",
    shortDesc: "Decorative hardscape for civic plazas, transit forecourts, and university campuses.",
    imageUrl: "/images/applications/commercial-spaces/commercial-spaces-55.jpg",
    gallery: [1,2,3,5,6,7,9,10,11,13,14,15,17,18,19,21,22,23,25,26,27,29,30,31,33,34,35,37,38,39,41,42,43,45,46,47,49,50,51,53,54,55,57,58,59,61,62,63,65,66].map(n => {
      const ext = [9,10,11,13,14,15,17,18,19,21,22,23,25,26,27,29,30,31,33,34,35,37,38].includes(n) ? "png" : "jpg";
      return `/images/applications/public-spaces/public-spaces-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "Public plazas, transit forecourts, university campuses, and civic squares are the most visible, and most judged, surfaces in any community. They tell people whether a place cares about the experience of being there. StreetPrint in-place stamped asphalt transforms utilitarian grey paved plazas into rich hardscape environments with the visual warmth of traditional stone without the weight, cost, or maintenance burden. StreetBond colour systems define civic zones, reinforce campus identity, and create wayfinding systems that people navigate by feel as much as by signage. DecoMark brings landmark-quality custom graphics to entry plazas, gathering spaces, and transit hubs. Installed at UBC, BC Children's Hospital, and civic plazas from coast to coast.",
    relatedProducts: ["streetprint", "streetbond", "decomark", "duratherm"],
  },
  {
    name: "Commercial Spaces",
    slug: "commercial-spaces",
    shortDesc: "Hardscape finishes for retail centres, mixed-use developments, and hospitality entries.",
    imageUrl: "/images/applications/crosswalks/crosswalks-110.jpg",
    gallery: [1,3,5,8,10,12,15,17,19,22,24,26,29,31,33,36,38,40,43,45,47,50,52,54,57,59,61,64,66,68,71,73,75,78,80,82,85,87,89,92,94,96,99,101,103,106,108,110,113,115].map(n => {
      const ext = [110].includes(n) ? "png" : "jpg";
      return `/images/applications/commercial-spaces/commercial-spaces-${String(n).padStart(2,"0")}.${ext}`;
    }),
    // Rewritten plainly, 28 Sep 2026 (QA pa#34): no verbless closing line, no "premium" as praise. The
    // cost line is the StreetPrint FAQ's ("a significant cost advantage over brick and paver
    // alternatives"). StreetBond and DuraShield came off this page (pa#31), so their sentences went too.
    description: "Tenants and customers judge retail centres, mixed-use developments, hotel porte-cochères and commercial campus entries before they walk through the door. StreetPrint stamped asphalt gives these surfaces the look of stone paving (cobblestone entry courts, herringbone walkways, fan-pattern plazas) at a lower cost than natural stone. It also avoids the settling, weeding and re-levelling that real pavers need.",
    // The spread specifies TrafficPatternsXD alone; StreetPrint stays because its page lists this one too.
    // StreetBond, DuraShield and TrafficPatterns out (pa#31): none listed Commercial Spaces back.
    relatedProducts: ["traffic-patterns-xd", "streetprint"],
  },
  {
    name: "Townhomes",
    slug: "townhomes",
    shortDesc: "Cohesive stamped asphalt hardscape for townhome and strata developments.",
    imageUrl: "/images/applications/townhomes/townhomes-01.jpg",
    gallery: gallery("townhomes", "townhomes", 18, "jpg", [4, 5, 6, 18]),
    description: "Townhome and strata developments live and die by their first impression: the moment a prospective buyer pulls up to the curb and reads the quality of the project through what's underfoot. StreetPrint stamped asphalt driveways and entry courts deliver the look of traditional clay pavers or stone cobble at a fraction of the installation cost, with none of the ongoing maintenance: no settling, no weeding between joints, no freeze-thaw displacement. StreetBond colour treatments unify guest parking areas, amenity courts, and pedestrian corridors into a cohesive hardscape system that reads as intentional design. For existing strata boards managing aging asphalt surfaces, DuraShield maintenance coating protects the surface and extends its useful life before cosmetic treatment is considered.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Residential Driveways",
    slug: "residential-driveways",
    shortDesc: "Transform an existing driveway into decorative stamped asphalt, no demolition required.",
    imageUrl: "/images/applications/residential-driveways/residential-driveways-18.jpg",
    gallery: gallery("residential-driveways", "residential-driveways", 44),
    description: "A beautifully finished driveway is one of the most visible improvements a homeowner can make, and one of the most cost-effective when done right. StreetPrint's in-place stamped asphalt process works directly on the existing driveway surface, impressing cobblestone, brick, herringbone, or slate patterns without tearing out and replacing the base. StreetBond UV-stable acrylic colour then seals the surface in the homeowner's choice of colour (warm buff tones, bold reds, classic charcoal) that holds its finish season after season without the chalking, fading, or cracking that standard driveway sealers deliver. No demolition, no concrete forms, no landscape damage from excavation. The finished result: a decorative hardscape that adds lasting curb appeal at a fraction of the cost of natural stone or interlocking paver installation.",
    // StreetBond out (pa#31): the driveway spread specifies StreetPrint alone and StreetBond's page lists
    // Private Driveways only. The copy above still names StreetBond as StreetPrint's own coating.
    relatedProducts: ["streetprint", "durashield"],
  },
  {
    name: "Pedestrian Safety",
    slug: "pedestrian-safety",
    shortDesc: "Retroreflective thermoplastic markings that support Vision Zero crosswalk standards.",
    imageUrl: "/images/applications/crosswalks/crosswalks-03.jpg",
    gallery: [1,3,6,8,11,13,16,18,21,23,26,28,31,33,36,38,41,43,45,48,50,53,55,58,60,63,65,68,70,73,75,78,80,83,85,87,90,92,95,97,100,102,105,107,110,112,115,117,120,122].map(n => {
      const ext = [41, 112, 115].includes(n) ? "png" : "jpg";
      return `/images/applications/crosswalks/crosswalks-${String(n).padStart(2,"0")}.${ext}`;
    }),
    // Rewritten plainly, 28 Sep 2026 (QA pa#34): the opener repeated the Idea Book's pull line above it and
    // the close had no verb. TrafficPatterns and TrafficPatternsXD are "high-contrast", the spread's own
    // word for them; the product pages dropped their glass-bead claims in Sep. StreetBond came off this
    // page (pa#31), so its mention went too.
    description: "A crosswalk marking has to be visible at night in the rain, and a school zone treatment has to read at speed. Both depend on markings that hold up through Canadian winters, long after the season they were installed. TrafficPatterns and TrafficPatternsXD give crosswalks and school zones high-contrast markings that last season after season without repainting. MMAX marks pedestrian priority zones, raised intersections and school zone warning areas in colour that holds through de-icing salt and freeze-thaw.",
    // Now exactly the spread's SPECIFY list (pa#31): StreetBond and DecoMark never listed this page.
    relatedProducts: ["traffic-patterns-xd", "traffic-patterns", "premark", "mmax"],
  },
  {
    name: "Traffic Calming",
    slug: "traffic-calming",
    shortDesc: "Coloured pavement treatments that reduce vehicle speeds without physical barriers.",
    imageUrl: "/images/applications/traffic-calming/traffic-calming-01.jpg",
    gallery: [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,51,52,53,54,55].map(n => {
      const ext = [43].includes(n) ? "png" : "jpg";
      return `/images/applications/traffic-calming/traffic-calming-${String(n).padStart(2,"0")}.${ext}`;
    }),
    // 28 Sep 2026 (QA pa#12): "Research consistently shows…" cited no research, and "that drivers respond to
    // instinctively" made the same claim again; both gone. The spread above says what the book says about
    // drivers. TrafficPatterns came off this page (pa#31), and XD's retroreflectivity clause went with it.
    description: "Colour changes driver behaviour. HUB coloured pavement systems give gateway treatments, speed tables and intersection treatments the visual weight they need to do their job. StreetBond and MMAX deliver high-visibility colour that persists through winter maintenance cycles. StreetPrint gateway stamped asphalt signals a neighbourhood boundary through material texture and visual contrast. TrafficPatternsXD provides durable thermoplastic markings at raised crosswalks and school zone warning treatments.",
    // TrafficPatterns out (pa#31): not in the spread's SPECIFY, and its page never listed traffic calming.
    relatedProducts: ["streetprint", "streetbond", "traffic-patterns-xd", "mmax"],
  },
  {
    name: "Airports",
    slug: "airports",
    shortDesc: "Precision preformed thermoplastic airfield markings: certified performance, engineered for airfield demands.",
    imageUrl: "/images/applications/airports/airports-01.jpg",
    gallery: gallery("airports", "airports", 28, "jpg", [20]),
    description: "Airfield surface markings exist at the intersection of safety-critical precision and extreme operational demand. Taxiway centrelines, apron designations, holding position signs, helipad markings, and other non-runway airside surfaces must maintain dimensional accuracy and high retroreflectivity through seasons of deicing fluid application, rubber contamination, and ground-handling traffic. AirMark preformed thermoplastic airfield markings are engineered to this standard: glass-bead retroreflectivity built through the full material cross-section rather than a surface bead application that wears away. Installed by certified crews with heat application equipment, AirMark fuses to the airfield surface permanently, delivering extended service life and maintained retroreflectivity with no extended closure window required.",
    relatedProducts: ["airmark"],
  },
  {
    name: "LEED & Urban Heat Island",
    slug: "leed-urban-heat-island",
    seoTitle: "LEED & Urban Heat Island · Cool Pavement Coatings",
    seoDescription: "Creating cooler, more sustainable urban spaces: high-SRI StreetBond coatings reduce pavement surface temperature and support LEED Heat Island Reduction credits.",
    // "Earn LEED credits" softened to "can contribute", 28 Sep 2026 (QA pa#12), as the StreetBondSR page and
    // the Idea Book say it. Only the claim changed: replacing the whole line is proposed to Doug in
    // docs/COPY-FOR-DOUG.md §3 and still waits on him.
    shortDesc: "Solar reflective pavement coatings that reduce the urban heat island effect and can contribute to LEED v5 credits.",
    imageUrl: "/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg",
    gallery: gallery("leed-urban-heat-island", "leed-urban-heat-island", 2),
    // Rewritten plainly (pa#34): no verbless closing line. Solar reflectance and the credit are worded as on
    // the StreetBondSR page, which follows the book ("SR 0.33 or higher", "can contribute").
    description: "Dark asphalt absorbs most of the sun's energy and adds to the urban heat island effect, the measurable temperature difference between a city and the rural areas around it. The extra heat raises air-conditioning demand and makes summer heat events more dangerous for vulnerable people. StreetBondSR is a solar-reflective coating that lowers pavement surface temperature. Its colours with an initial solar reflectance of 0.33 or higher can contribute to the LEED v5 Sustainable Sites credit for urban heat island reduction (non-roof).",
    // StreetBond out (pa#31): no spread covers this page and StreetBond's page never listed it.
    relatedProducts: ["streetbondsr", "durashield"],
  },
  {
    name: "Public Art",
    slug: "public-art",
    shortDesc: "Civic-scale pavement murals, Indigenous art installations, and landmark street graphics.",
    imageUrl: "/images/applications/community-branding/community-branding-02.jpg",
    gallery: gallery("community-branding", "community-branding", 14),
    description: "The street is one of the largest untapped canvases in any city. HUB public art installations turn that canvas into permanent, weather-resistant community expression, working with artists, Indigenous nations, planners, and community organizations to translate creative vision into durable ground-plane art at a scale that commands attention. Labyrinth walk installations at BC Children's Hospital, Indigenous cultural crosswalks at UBC and Pride commemorations in downtown corridors are permanent features of the places they inhabit, designed to last the full service life of the asphalt surface itself.",
    relatedProducts: ["decomark", "streetbond", "traffic-patterns", "streetprint"],
  },
  {
    name: "Regulatory Markings",
    slug: "regulatory-markings",
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
