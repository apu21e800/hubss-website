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

export const applications: Application[] = [
  {
    name: "Crosswalks",
    slug: "crosswalks",
    seoTitle: "Decorative Crosswalks — Thermoplastic Pedestrian Markings",
    seoDescription: "Aggregate-reinforced preformed thermoplastic crosswalk markings for high-visibility pedestrian safety, traffic calming, and community identity — specified across Canada.",
    shortDesc: "Durable, high-visibility, high-contrast crosswalk systems that elevate the intersection.",
    imageUrl: "/images/applications/crosswalks/crosswalks-01.jpg",
    gallery: [1,3,6,8,11,13,16,18,21,23,26,28,31,33,36,38,42,43,45,48,50,53,55,58,60,63,65,68,70,73,75,78,80,83,85,87,90,92,95,97,100,102,105,107,110,116,115,117,120,122].map(n => {
      const ext = [115].includes(n) ? "png" : "jpg";
      return `/images/applications/crosswalks/crosswalks-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "A crosswalk does two jobs: it protects pedestrians, and it tells a driver that someone is about to cross. HUB crosswalk systems are specified where both those jobs need to stay done — season after season. TrafficPatterns and TrafficPatternsXD thermoplastic fuse permanently to the road surface, maintaining ASTM-rated retroreflectivity through snowplow cycles, de-icing chemical seasons, and freeze-thaw cycles that challenge any surface. DecoMark and StreetBond open the crosswalk up as a creative surface — Pride rainbow crossings, Indigenous cultural art, neighbourhood identity installations, and commemorative designs that make the intersection a landmark, not just a safety device. Specified by municipalities from Halifax to Vancouver.",
    relatedProducts: ["traffic-patterns", "traffic-patterns-xd", "streetbond", "decomark", "duratherm", "premark"],
  },
  {
    name: "Bike Lanes",
    slug: "bike-lanes",
    shortDesc: "Coloured bike lane systems that hold visibility and protect cyclists season after season.",
    imageUrl: "/images/applications/bike-lanes/bike-lanes-01.jpg",
    gallery: gallery("bike-lanes", "bike-lanes", 38, "jpg", [32]),
    description: "A faded bike lane is a dangerous bike lane. When the green disappears, so does the driver's understanding that this space belongs to someone else. HUB bike lane systems are engineered to stay visible — StreetBond UV-stable acrylic maintains vivid green, red, and custom Pantone colour through years of traffic and weather without chalking or fading. MMAX methyl methacrylate is specified where overnight curing is required in transit-adjacent corridors — full cure in 30-60 minutes, bond strength exceeding 3 MPa. PreMark preformed thermoplastic symbols and edge lines provide retroreflective bicycle pictographs, arrows, and conflict zone markings that hold their geometry and visibility through seasons of heavy use. The complete specification for protected bike lanes, intersection treatments, and multi-use path markings that need to perform as long as the infrastructure itself.",
    relatedProducts: ["streetbond", "mmax", "premark", "traffic-patterns", "traffic-patterns-xd"],
  },
  {
    name: "Bus Lanes",
    slug: "bus-lanes",
    shortDesc: "BRT corridor and bus priority lane treatments engineered for the harshest urban loads.",
    imageUrl: "/images/applications/bus-lanes/bus-lanes-01.jpg",
    gallery: gallery("bus-lanes", "bus-lanes", 40, "jpg", [37, 38, 39, 40]),
    // TODO: doug-review — Doug's note ended mid-sentence ("...survive this. Our MMAX line of MMA resin cures in...."). Polished here per Vernon; revisit when Doug clarifies the intended completion.
    description: "Bus priority lanes and BRT corridors are among the most demanding surfaces in any city's network — concentrated axle loads, tight turning radii, and the expectation that markings stay legible through thousands of bus movements a day. HUB's MMAX line of MMA resin cures in 45–60 minutes, traffic-ready in under an hour, enabling complete overnight installation in a single maintenance window without disrupting weekday transit operations. TrafficPatternsXD 150mil aggregate-reinforced thermoplastic delivers high skid resistance at bus stops and turning movements where wet-surface traction directly affects passenger safety. Both systems are engineered for season after season of performance in these demanding environments — ready when transit needs them. The specified solution for red bus lanes, transit signal priority corridors, and BRT station zones across Canada.",
    relatedProducts: ["mmax", "traffic-patterns-xd", "streetbond", "premark"],
  },
  {
    name: "Parking Lots",
    slug: "parking-lots",
    shortDesc: "Durable stall markings, wayfinding colour, and surface rejuvenation for commercial parking.",
    imageUrl: "/images/applications/parking-lots/parking-lots-01.jpg",
    gallery: [1,2,3,4,5,7,8,9,10,11,13,14,15,16,17,19,20,21,22,23,25,26,27,28,29,31,32,33,34,35,37,38,39,40,41,43,44,45,46,47,49,50,51,52,53,55,56,57,58,59].map(n =>
      `/images/applications/parking-lots/parking-lots-${String(n).padStart(2,"0")}.jpg`),
    description: "Parking lots take a disproportionate beating — sun exposure, oil contamination, and high wheel-load cycles degrade asphalt and surface markings faster than almost any other paved environment. HUB parking lot solutions address the whole surface, not just the stripes. DuraShield penetrating rejuvenator restores oxidized asphalt and seals the surface against further deterioration, extending pavement life at a fraction of replacement cost. TrafficPatterns and PreMark thermoplastic stall markings and accessible parking symbols hold retroreflectivity season after season without annual repainting. StreetBond colour treatments create branded wayfinding zones, coloured drive aisles, and fire lane designations that read clearly and last. For REITs, property managers, and facility teams: the result is a parking surface that looks maintained, performs safely, and costs less to operate.",
    relatedProducts: ["durashield", "traffic-patterns", "traffic-patterns-xd", "premark", "streetbond", "streetprint", "duratherm"],
  },
  {
    name: "Parks & Paths",
    slug: "parks-paths",
    seoTitle: "Decorative Paving for Parks and Paths",
    seoDescription: "Discover decorative paving products that redefine outdoor spaces. Engineered for durability and designed for beauty — surfaces that transform parks and paths into inviting, accessible spaces.",
    shortDesc: "Decorative surface systems for urban paths, park plazas, and multi-use trails.",
    imageUrl: "/images/applications/parks-paths/parks-paths-01.jpg",
    gallery: [1,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,95,100,103,106,109,112,115,118,121,124,127,130,133,136,139,142,143,144].map(n => {
      const ext = [100, 103].includes(n) ? "png" : "jpg";
      return `/images/applications/parks-paths/parks-paths-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "The path through a park sets the tone for the whole space. A grey, cracked asphalt trail communicates neglect. A vibrant, well-designed surface communicates care — and invites people to use it. HUB surface systems transform utilitarian park infrastructure into environments worth spending time in. StreetBond applies vivid, UV-stable colour to existing asphalt trail and plaza surfaces, turning functional routes into wayfinding systems and amenity destinations. DecoMark brings mural-quality custom graphic thermoplastic to the ground plane for cultural recognition art, wayfinding symbols, and community identity installations. StreetPrint in-place stamped asphalt gives plazas, seating courts, and entry areas the visual richness of traditional stone paving without the maintenance complexity. DuraShield extends the life of aging path surfaces where rejuvenation is more cost-effective than replacement.",
    relatedProducts: ["streetbond", "decomark", "durashield", "streetprint"],
  },
  {
    name: "Playgrounds",
    slug: "playgrounds",
    seoTitle: "Playgrounds & Recreation — Schoolyard Paving",
    seoDescription: "Transform schoolyards with StreetBond — cost-effective, vibrant playground surfacing that increases physical activity and student engagement.",
    shortDesc: "Vibrant, slip-resistant playground surface graphics that stand up to hard use.",
    imageUrl: "/images/applications/playgrounds/playgrounds-01.jpg",
    gallery: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52].map(n =>
      `/images/applications/playgrounds/playgrounds-${String(n).padStart(2,"0")}.jpg`),
    description: "Children are hard on surfaces. Playground treatments get knees, bikes, basketballs, and a decade of foot traffic — and they need to look vibrant, be safe, and require no annual repainting to do their job. DecoMark custom thermoplastic graphics bring hopscotch courts, number grids, compass roses, wayfinding games, and mural-scale artwork to paved play surfaces with Pantone-accurate colour and flush-surface edges that eliminate trip hazards. StreetBond acrylic adds vivid, UV-stable colour to existing asphalt play courts, four-square grids, and multi-use activity areas. Both systems deliver surfaces that are safe to fall on, easy to clean, and designed to remain bright and engaging season after season without repainting.",
    relatedProducts: ["decomark", "streetbond", "streetprint", "traffic-patterns"],
  },
  {
    name: "Community Branding",
    slug: "community-branding",
    shortDesc: "Neighbourhood identity, cultural art, and civic pride — embedded permanently in the street.",
    imageUrl: "/images/applications/community-branding/community-branding-01.jpg",
    gallery: gallery("community-branding", "community-branding", 14),
    description: "Every neighbourhood has a story. Most of them go untold on the street. HUB community branding installations change that — transforming the surface beneath people's feet into a canvas for the neighbourhood's culture, history, and identity. DecoMark thermoplastic embeds Pantone-accurate custom graphics directly into asphalt and concrete: First Nations cultural artwork in reconciliation partnerships, BIA wayfinding and business district branding, neighbourhood crest and name installations, Pride declarations, and heritage commemorations. StreetBond colour treatments create branded corridors, cultural district colour schemes, and civic identity systems that people can feel underfoot and see from a block away. From Bowen Island's community art path to the UBC Musqueam cultural crosswalk — this is what it looks like when a community decides the street deserves to tell its story.",
    relatedProducts: ["decomark", "streetbond", "streetprint", "duratherm"],
  },
  {
    name: "Private Driveways",
    slug: "private-driveways",
    shortDesc: "Stamped asphalt driveways — the look of stone pavers without the demolition or maintenance.",
    imageUrl: "/images/applications/residential-driveways/residential-driveways-01.jpg",
    gallery: gallery("residential-driveways", "residential-driveways", 44),
    description: "Tearing out an existing driveway to install natural stone or concrete pavers is expensive, disruptive, and creates a raised edge profile that chips, shifts, and weeds. StreetPrint offers a better path: in-place stamped asphalt that works with the driveway already there, impressing cobblestone, brick, herringbone, or slate patterns directly into the surface, then sealing it with StreetBond UV-stable acrylic colour. The result is a rich decorative hardscape finish at a fraction of full paver installation cost — with a flush, snowplow-safe, weed-free surface that requires none of the maintenance that natural stone demands. For existing driveways showing their age, DuraShield penetrating rejuvenator restores the asphalt base and extends surface life before cosmetic treatment.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Sport Courts",
    slug: "sport-courts",
    shortDesc: "Permanent court coatings for tennis, basketball, pickleball, and multi-sport surfaces.",
    imageUrl: "/images/applications/sport-courts/sport-courts-01.jpg",
    gallery: gallery("sport-courts", "sport-courts", 21, "jpg", [19]),
    description: "Sport courts are one of the most demanding colour environments in outdoor pavement — lateral movement, constant foot traffic, UV exposure, and the precise line geometry that competition depends on. StreetBond acrylic bonds permanently to asphalt and acid-etched concrete, delivering vivid, UV-stable court surface colours and crisp line markings that hold their geometry and contrast season after season without repainting. Available in standard court colour palettes and custom Pantone matching for branded facilities. DecoMark thermoplastic line markings provide precise boundary lines, service boxes, and three-point arcs that won't shift or peel under the lateral forces of hard court play.",
    relatedProducts: ["streetbond", "decomark", "streetprint", "premark"],
  },
  {
    name: "Splash Pads",
    slug: "splash-pads",
    shortDesc: "Vivid, slip-resistant splash pad coatings designed for constant water exposure.",
    imageUrl: "/images/applications/splash-pads/splash-pads-01.jpg",
    gallery: gallery("splash-pads", "splash-pads", 19, "jpg", [11]),
    description: "Splash pad surfaces are a uniquely demanding environment: constant water exposure, chemical treatments, bare feet, and an absolute requirement for slip resistance under wet conditions. StreetBond's acrylic formulation is applied to acid-etched concrete splash pad surfaces, building a slip-resistant texture that meets wet-surface safety standards while delivering the vivid, engaging colours that make a splash pad worth coming back to. UV-stable pigments maintain colour fidelity through seasons of sun exposure and chemical splash, without the chalking or delamination that afflicts lesser coatings on wet surfaces.",
    relatedProducts: ["streetbond", "decomark", "durashield"],
  },
  {
    name: "Public Spaces",
    slug: "public-spaces",
    shortDesc: "Decorative hardscape for civic plazas, transit forecourts, and university campuses.",
    imageUrl: "/images/applications/public-spaces/public-spaces-01.jpg",
    gallery: [1,2,3,5,6,7,9,10,11,13,14,15,17,18,19,21,22,23,25,26,27,29,30,31,33,34,35,37,38,39,41,42,43,45,46,47,49,50,51,53,54,55,57,58,59,61,62,63,65,66].map(n => {
      const ext = [9,10,11,13,14,15,17,18,19,21,22,23,25,26,27,29,30,31,33,34,35,37,38].includes(n) ? "png" : "jpg";
      return `/images/applications/public-spaces/public-spaces-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "Public plazas, transit forecourts, university campuses, and civic squares are the most visible — and most judged — surfaces in any community. They tell people whether a place cares about the experience of being there. StreetPrint in-place stamped asphalt transforms utilitarian grey paved plazas into rich hardscape environments with the visual warmth of traditional stone without the weight, cost, or maintenance burden. StreetBond colour systems define civic zones, reinforce campus identity, and create wayfinding systems that people navigate by feel as much as by signage. DecoMark brings landmark-quality custom graphics to entry plazas, gathering spaces, and transit hubs. Installed at UBC, BC Children's Hospital, and civic plazas from coast to coast.",
    relatedProducts: ["streetprint", "streetbond", "decomark", "duratherm"],
  },
  {
    name: "Commercial Spaces",
    slug: "commercial-spaces",
    shortDesc: "Premium hardscape finishes for retail centres, mixed-use developments, and hospitality entries.",
    imageUrl: "/images/applications/commercial-spaces/commercial-spaces-01.jpg",
    gallery: [1,3,5,8,10,12,15,17,19,22,24,26,29,31,33,36,38,40,43,45,47,50,52,54,57,59,61,64,66,68,71,73,75,78,80,82,85,87,89,92,94,96,99,101,103,106,108,110,113,115].map(n => {
      const ext = [110].includes(n) ? "png" : "jpg";
      return `/images/applications/commercial-spaces/commercial-spaces-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "Retail centres, mixed-use developments, hotel porte-cochères, and commercial campus entries are evaluated by tenants and customers before they walk through the door. The surface underfoot signals the quality of everything inside. StreetPrint stamped asphalt delivers the visual weight and material richness of premium stone paving — cobblestone entry courts, herringbone pedestrian corridors, fan-pattern plaza surfaces — at a fraction of full natural stone installation cost and without the settlement, weeding, and re-leveling that real pavers require. StreetBond colour treatments define branded wayfinding, tenant zone distinctions, and fire lane markings. DuraShield extends the life of existing commercial asphalt surfaces that have oxidized but don't need full replacement. The complete hardscape system for developers and property managers who want the premium look without the premium maintenance overhead.",
    relatedProducts: ["streetprint", "streetbond", "durashield", "traffic-patterns"],
  },
  {
    name: "Townhomes",
    slug: "townhomes",
    shortDesc: "Cohesive stamped asphalt hardscape for townhome and strata developments.",
    imageUrl: "/images/applications/townhomes/townhomes-01.jpg",
    gallery: gallery("townhomes", "townhomes", 18, "jpg", [4, 5, 6, 18]),
    description: "Townhome and strata developments live and die by their first impression — the moment a prospective buyer pulls up to the curb and reads the quality of the project through what's underfoot. StreetPrint stamped asphalt driveways and entry courts deliver the look of traditional clay pavers or stone cobble at a fraction of the installation cost, with none of the ongoing maintenance: no settling, no weeding between joints, no freeze-thaw displacement. StreetBond colour treatments unify guest parking areas, amenity courts, and pedestrian corridors into a cohesive hardscape system that reads as intentional design. For existing strata boards managing aging asphalt surfaces, DuraShield penetrating rejuvenator restores the surface and extends its useful life before cosmetic treatment is considered.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Residential Driveways",
    slug: "residential-driveways",
    shortDesc: "Transform an existing driveway into decorative stamped asphalt — no demolition required.",
    imageUrl: "/images/applications/residential-driveways/residential-driveways-01.jpg",
    gallery: gallery("residential-driveways", "residential-driveways", 44),
    description: "A beautifully finished driveway is one of the most visible improvements a homeowner can make — and one of the most cost-effective when done right. StreetPrint's in-place stamped asphalt process works directly on the existing driveway surface, impressing cobblestone, brick, herringbone, or slate patterns without tearing out and replacing the base. StreetBond UV-stable acrylic colour then seals the surface in the homeowner's choice of colour — warm buff tones, bold reds, classic charcoal — that holds its finish season after season without the chalking, fading, or cracking that standard driveway sealers deliver. No demolition. No concrete forms. No landscape damage from excavation. The finished result: a premium decorative hardscape that adds lasting curb appeal at a fraction of the cost of natural stone or interlocking paver installation.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Pedestrian Safety",
    slug: "pedestrian-safety",
    shortDesc: "Retroreflective thermoplastic markings that support Vision Zero crosswalk standards.",
    imageUrl: "/images/applications/crosswalks/crosswalks-03.jpg",
    gallery: [1,3,6,8,11,13,16,18,21,23,26,28,31,33,36,38,42,43,45,48,50,53,55,58,60,63,65,68,70,73,75,78,80,83,85,87,90,92,95,97,100,102,105,107,110,116,115,117,120,122].map(n => {
      const ext = [115].includes(n) ? "png" : "jpg";
      return `/images/applications/crosswalks/crosswalks-${String(n).padStart(2,"0")}.${ext}`;
    }),
    description: "Pedestrian safety isn't an aesthetic aspiration — it's a measurable outcome. Crosswalk markings that are visible at night in the rain, school zone treatments that read at speed, and pedestrian priority zones that communicate unambiguously to a driver are all functions of durable, retroreflective pavement systems that hold their performance specification through Canadian winters, not just in the season they were installed. TrafficPatterns and TrafficPatternsXD thermoplastic deliver retroreflective performance at crosswalks and school zones season after season without repainting. StreetBond and MMAX high-contrast colour coatings mark pedestrian priority zones, raised intersection treatments, and school zone warning areas with colours that persist through de-icing salt cycles and freeze-thaw conditions. The complete specification for municipalities and engineers taking Vision Zero and Complete Streets commitments seriously.",
    relatedProducts: ["traffic-patterns", "traffic-patterns-xd", "streetbond", "mmax", "decomark", "premark"],
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
    description: "Colour changes driver behaviour. Research consistently shows that gateway treatments, speed table surface markings, and intersection colour treatments reduce vehicle entry speeds — without requiring physical barriers or speed humps that impede emergency response. HUB coloured pavement systems give traffic calming installations the visual weight they need to do their job. StreetBond and MMAX deliver high-visibility colour that persists through winter maintenance cycles — colour and contrast that hold season after season. StreetPrint gateway stamped asphalt signals a neighbourhood boundary through material texture and visual contrast that drivers respond to instinctively. TrafficPatterns and TrafficPatternsXD provide durable thermoplastic markings at raised crosswalks and school zone warning treatments where retroreflectivity is required year-round.",
    relatedProducts: ["streetbond", "mmax", "traffic-patterns", "traffic-patterns-xd", "streetprint"],
  },
  {
    name: "Airports",
    slug: "airports",
    shortDesc: "Precision preformed thermoplastic airfield markings — certified performance, engineered for airfield demands.",
    imageUrl: "/images/applications/airports/airports-01.jpg",
    gallery: gallery("airports", "airports", 28, "jpg", [20]),
    description: "Airfield surface markings exist at the intersection of safety-critical precision and extreme operational demand. Taxiway centrelines, apron designations, holding position signs, helipad markings, and other non-runway airside surfaces must maintain dimensional accuracy and high retroreflectivity through seasons of deicing fluid application, rubber contamination, and ground-handling traffic. AirMark preformed thermoplastic airfield markings are engineered to this standard — glass-bead retroreflectivity built through the full material cross-section rather than a surface bead application that wears away. Installed by certified crews with heat application equipment, AirMark fuses to the airfield surface permanently — delivering extended service life and maintained retroreflectivity with no extended closure window required.",
    relatedProducts: ["airmark"],
  },
  {
    name: "LEED & Urban Heat Island",
    slug: "leed-urban-heat-island",
    seoTitle: "LEED & Urban Heat Island — Cool Pavement Coatings",
    seoDescription: "Creating cooler, more sustainable urban spaces — high-SRI StreetBond coatings reduce pavement surface temperature and support LEED Heat Island Reduction credits.",
    shortDesc: "Solar reflective paving solutions that reduce urban heat island effect and earn LEED credits.",
    imageUrl: "/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg",
    gallery: gallery("leed-urban-heat-island", "leed-urban-heat-island", 2),
    description: "Standard dark asphalt absorbs the vast majority of solar radiation, contributing directly to the urban heat island effect — the measurable temperature premium that cities carry over surrounding rural areas. This isn't just a comfort issue: it drives air conditioning energy demand, accelerates pavement degradation, and creates dangerous heat conditions for vulnerable populations during summer weather events. StreetBondSR is HUB's high-Solar Reflectance Index coating system — a reflective paving surface treatment that reduces pavement surface temperatures and contributes to LEED v4 Sustainable Sites credit for heat island reduction. The specification for sustainable development projects, climate action plan implementations, and any site team where green building certification and energy performance outcomes matter.",
    relatedProducts: ["streetbondsr", "streetbond", "durashield"],
  },
  {
    name: "Public Art",
    slug: "public-art",
    shortDesc: "Civic-scale pavement murals, Indigenous art installations, and landmark street graphics.",
    imageUrl: "/images/applications/community-branding/community-branding-01.jpg",
    gallery: gallery("community-branding", "community-branding", 14),
    description: "The street is one of the largest untapped canvases in any city. HUB public art installations turn that canvas into permanent, weather-resistant community expression — working with artists, Indigenous nations, planners, and community organizations to translate creative vision into durable ground-plane art at a scale that commands attention. From labyrinth walk installations at BC Children's Hospital to Indigenous cultural crosswalks at UBC to Pride commemorations in downtown corridors: these are not temporary installations. They are permanent features of the places they inhabit, designed to last the full service life of the asphalt surface itself.",
    relatedProducts: ["decomark", "streetbond", "streetprint"],
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
    description: "Regulatory pavement markings carry legal weight — stop bars, turn arrows, yield lines, school zone legends, accessible parking symbols, and lane designations are part of the road's legal operating standard, not decorative elements. They need to be where they're supposed to be, dimensionally accurate, and legible at night in the rain, through the entire maintenance cycle between installations. TrafficPatterns and TrafficPatternsXD thermoplastic deliver retroreflective stop bars, lane lines, and intersection markings that hold ASTM-rated visibility season after season without seasonal reapplication. PreMark preformed thermoplastic provides fast, stencil-free installation for school zone legends, accessible parking symbols, crosswalk ladder lines, and standard symbol inventory — open to traffic immediately, no curing window required.",
    relatedProducts: ["traffic-patterns", "traffic-patterns-xd", "premark", "duratherm", "airmark"],
  },
];
