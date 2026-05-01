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
    shortDesc: "High-visibility crosswalks for intersections, school zones, and traffic-calmed corridors",
    imageUrl: "/images/applications/crosswalks/crosswalks-01.jpg",
    gallery: [1,3,6,8,11,13,16,18,21,23,26,28,31,33,36,38,41,43,45,48,50,53,55,58,60,63,65,68,70,73,75,78,80,83,85,87,90,92,95,97,100,102,105,107,110,112,115,117,120,122].map(n =>
      `/images/applications/crosswalks/crosswalks-${String(n).padStart(2,"0")}.jpg`),
    description: "Crosswalks carry the highest visibility demands of any municipal pavement marking. TrafficPatterns 90mil and TrafficPatternsXD 150mil preformed thermoplastic heat-fuse permanently to the road surface and hold ASTM-rated retroreflectivity through snowplow cycles, de-icing chemicals, and freeze-thaw stress. DuraTherm provides flush-mount inlay where plow profile is critical. DecoMark and StreetBond cover custom-graphic crosswalks for Indigenous art, Pride installations, and neighbourhood identity. Specified by Canadian municipalities coast to coast.",
    relatedProducts: ["traffic-patterns", "traffic-patterns-xd", "streetbond", "decomark", "duratherm", "premark"],
  },
  {
    name: "Bike Lanes",
    slug: "bike-lanes",
    shortDesc: "Coloured lane coatings and retroreflective markings for cycling corridors",
    imageUrl: "/images/applications/bike-lanes/bike-lanes-01.jpg",
    gallery: gallery("bike-lanes", "bike-lanes", 38),
    description: "Coloured bike lanes require coatings that hold pigment under repeated tire wear, UV exposure, and winter maintenance. StreetBond is a UV-stable acrylic coating for asphalt and concrete with full Pantone custom matching. MMAX MMA is specified for high-volume corridors and transit-adjacent installations where overnight cure and bond strength above 3 MPa are required. PreMark covers retroreflective lane symbols, edge lines, and bike pictograms. Used for protected bike lanes, intersection treatments, and multi-use path markings.",
    relatedProducts: ["premark", "mmax"],
  },
  {
    name: "Bus Lanes",
    slug: "bus-lanes",
    shortDesc: "Coloured surface treatments for BRT corridors and transit-priority lanes",
    imageUrl: "/images/applications/bus-lanes/bus-lanes-01.jpg",
    gallery: gallery("bus-lanes", "bus-lanes", 40),
    description: "BRT corridors and bus priority lanes carry concentrated axle loads, hard braking events, and aggressive turning movements. MMAX MMA cures to traffic-ready in 30–60 minutes for single overnight shift installation. TrafficPatternsXD 150mil aggregate-reinforced thermoplastic provides BPN 65+ skid resistance and 7+ year service life through high-volume bus turning movements. PreMark covers stop bars, queue jump symbols, and lane-keep markings. Specified for red bus lanes, transit signal priority corridors, and BRT station zones across Canada.",
    relatedProducts: ["mmax", "traffic-patterns-xd", "streetbond", "premark"],
  },
  {
    name: "Parking Lots",
    slug: "parking-lots",
    shortDesc: "Stall markings, wayfinding colour zones, and asphalt rejuvenation for commercial parking",
    imageUrl: "/images/applications/parking-lots/parking-lots-01.jpg",
    gallery: [1,2,3,4,5,7,8,9,10,11,13,14,15,16,17,19,20,21,22,23,25,26,27,28,29,31,32,33,34,35,37,38,39,40,41,43,44,45,46,47,49,50,51,52,53,55,56,57,58,59].map(n =>
      `/images/applications/parking-lots/parking-lots-${String(n).padStart(2,"0")}.jpg`),
    description: "Parking lot surfaces face concentrated tire scrub, oil contamination, and continuous UV exposure that degrade conventional paint markings within a single season. DuraShield rejuvenates oxidized asphalt and adds 3–5 years of service life. TrafficPatterns 90mil and PreMark hold retroreflective stall lines and accessible parking symbols for 5–7 years. StreetBond and DuraTherm cover wayfinding colour zones, fire lane designations, and decorative drive aisles. StreetPrint stamps decorative entries and drop-off corridors.",
    relatedProducts: ["durashield", "traffic-patterns", "traffic-patterns-xd", "premark", "streetbond", "streetprint", "duratherm"],
  },
  {
    name: "Parks & Paths",
    slug: "parks-paths",
    shortDesc: "Coloured coatings, decorative stamping, and mural graphics for pathways and plazas",
    imageUrl: "/images/applications/parks-paths/parks-paths-01.jpg",
    gallery: [1,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,130,133,136,139,142,143,144].map(n =>
      `/images/applications/parks-paths/parks-paths-${String(n).padStart(2,"0")}.jpg`),
    description: "Multi-use paths, plazas, and recreational asphalt face foot traffic, cyclist loads, and continuous UV exposure. StreetBond is a UV-stable acrylic coating for asphalt and concrete with full Pantone matching, used to define wayfinding routes and amenity zones. DecoMark covers cultural recognition art, mural graphics, and wayfinding symbols at full pedestrian scale. StreetPrint stamps existing asphalt to replicate stone or brick at a fraction of full paver installation cost. DuraShield extends the service life of aging path surfaces by 3–5 years.",
    relatedProducts: ["streetbond", "decomark", "durashield", "streetprint"],
  },
  {
    name: "Playgrounds",
    slug: "playgrounds",
    shortDesc: "Flush-mount graphics and coloured coatings for paved play surfaces",
    imageUrl: "/images/applications/playgrounds/playgrounds-01.jpg",
    gallery: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52].map(n =>
      `/images/applications/playgrounds/playgrounds-${String(n).padStart(2,"0")}.jpg`),
    description: "Paved playground surfaces require flush-mount markings that meet safety standards for fall zones and accessible paths. DecoMark custom-graphic thermoplastic covers hopscotch grids, number lines, compass roses, and large-format play graphics with full Pantone matching and flush-surface edges that eliminate trip hazards. StreetBond adds UV-stable colour to existing asphalt play courts and four-square grids. Both systems hold colour and geometry season after season without repainting.",
    relatedProducts: ["decomark", "streetbond", "streetprint", "traffic-patterns"],
  },
  {
    name: "Community Branding",
    slug: "community-branding",
    shortDesc: "Custom logos, crests, and wayfinding embedded in pavement",
    imageUrl: "/images/applications/community-branding/community-branding-01.jpg",
    gallery: gallery("community-branding", "community-branding", 14),
    description: "DecoMark embeds Pantone-accurate custom graphics directly into asphalt and concrete: First Nations cultural artwork, BIA wayfinding and business district branding, neighbourhood crests, Pride declarations, and heritage commemorations. StreetBond colour treatments define branded corridors and cultural district colour schemes. Bowen Island's community art path, Vancouver's Little Italy installation, and the UBC Musqueam cultural crosswalk are representative of the work. Serviceable for the full life of the asphalt substrate.",
    relatedProducts: ["decomark", "streetbond", "streetprint", "duratherm"],
  },
  {
    name: "Private Driveways",
    slug: "private-driveways",
    shortDesc: "Stamped asphalt and decorative coatings for residential and multi-family properties",
    imageUrl: "/images/applications/residential-driveways/residential-driveways-01.jpg",
    gallery: gallery("residential-driveways", "residential-driveways", 44),
    description: "StreetPrint stamps decorative patterns directly into new or existing asphalt — cobblestone, brick, herringbone, slate — without removing the base course. The result is a flush, snowplow-safe surface with no joints to weed and no settlement risk over time. StreetBond UV-stable acrylic seals the surface in standard or custom Pantone colours. DuraShield rejuvenates oxidized driveways and adds 3–5 years of service life before resurfacing.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Sport Courts",
    slug: "sport-courts",
    shortDesc: "Acrylic colour coatings for tennis, basketball, pickleball, and multi-sport courts",
    imageUrl: "/images/applications/sport-courts/sport-courts-01.jpg",
    gallery: gallery("sport-courts", "sport-courts", 21),
    description: "Tennis, basketball, pickleball, and multi-sport courts face repeated lateral movement, foot abrasion, and continuous outdoor UV exposure. StreetBond bonds permanently to asphalt and acid-etched concrete, holding UV-stable colour and crisp line geometry to tournament line-marking standards. Available in standard court palettes and full Pantone matching for branded facilities. DecoMark covers boundary lines, service boxes, three-point arcs, and centre-court logos.",
    relatedProducts: ["streetbond", "decomark", "streetprint", "premark"],
  },
  {
    name: "Splash Pads",
    slug: "splash-pads",
    shortDesc: "Slip-resistant coloured coatings for splash pads and wet play areas",
    imageUrl: "/images/applications/splash-pads/splash-pads-01.jpg",
    gallery: gallery("splash-pads", "splash-pads", 19),
    description: "Splash pad surfaces face continuous water exposure, chlorinated treatments, and slip-resistance requirements specific to wet play environments. StreetBond is applied to acid-etched concrete substrates and finished with slip-resistant texture meeting wet-surface safety standards. UV-stable, chlorine-tolerant pigments hold colour fidelity through seasons of sun exposure and chemical splash. Full Pantone matching for graphics and colour zones.",
    relatedProducts: ["streetbond", "decomark", "durashield"],
  },
  {
    name: "Public Spaces",
    slug: "public-spaces",
    shortDesc: "Decorative paving for civic plazas, transit forecourts, and campus surfaces",
    imageUrl: "/images/applications/public-spaces/public-spaces-01.jpg",
    gallery: [1,2,3,5,6,7,9,10,11,13,14,15,17,18,19,21,22,23,25,26,27,29,30,31,33,34,35,37,38,39,41,42,43,45,46,47,49,50,51,53,54,55,57,58,59,61,62,63,65,66].map(n =>
      `/images/applications/public-spaces/public-spaces-${String(n).padStart(2,"0")}.jpg`),
    description: "Town squares, transit plazas, university campuses, and civic forecourts carry the most public-facing pavement in any municipality. StreetPrint stamps decorative patterns into asphalt at scale — brick, slate, cobblestone, fan, or fully custom — at a fraction of stone paver installation cost. StreetBond defines wayfinding zones, gathering areas, and identity colour blocks. DecoMark covers landmark-quality custom graphics at entry plazas and transit hubs. Installed at UBC, BC Children's Hospital, and civic plazas across Canada.",
    relatedProducts: ["streetprint", "streetbond", "decomark", "duratherm"],
  },
  {
    name: "Commercial Spaces",
    slug: "commercial-spaces",
    shortDesc: "Decorative hardscape and durable coatings for retail, hospitality, and mixed-use sites",
    imageUrl: "/images/applications/commercial-spaces/commercial-spaces-01.jpg",
    gallery: [1,3,5,8,10,12,15,17,19,22,24,26,29,31,33,36,38,40,43,45,47,50,52,54,57,59,61,64,66,68,71,73,75,78,80,82,85,87,89,92,94,96,99,101,103,106,108,110,113,115].map(n =>
      `/images/applications/commercial-spaces/commercial-spaces-${String(n).padStart(2,"0")}.jpg`),
    description: "Retail centres, mixed-use developments, hotel porte-cochères, and commercial campus entries use surface treatments to define tenant zones, mark drop-off corridors, and reinforce brand identity at the ground plane. StreetPrint stamps decorative patterns onto new or existing asphalt at a fraction of stone paver cost — without the settlement, weeding, and re-leveling that real pavers require. StreetBond defines colour zones, fire lane markings, and wayfinding paths. DuraShield extends the life of existing parking and drive surfaces by 3–5 years.",
    relatedProducts: ["streetprint", "streetbond", "durashield", "traffic-patterns"],
  },
  {
    name: "Townhomes",
    slug: "townhomes",
    shortDesc: "Stamped asphalt and coloured coatings for strata and multi-family developments",
    imageUrl: "/images/applications/townhomes/townhomes-01.jpg",
    gallery: gallery("townhomes", "townhomes", 18),
    description: "Townhome and strata developments use surface treatments to differentiate entries, common drives, and amenity spaces without the cost or maintenance overhead of full paver installation. StreetPrint stamped asphalt covers driveways and entry courts in traditional paver patterns at half the installed cost — no settling, no weeding between joints, no freeze-thaw displacement. StreetBond defines guest parking, fire lanes, and amenity court surfaces. DuraShield rejuvenates aging strata asphalt and adds 3–5 years of service life.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Residential Driveways",
    slug: "residential-driveways",
    shortDesc: "Stamped asphalt and decorative coatings for residential driveways",
    imageUrl: "/images/applications/residential-driveways/residential-driveways-01.jpg",
    gallery: gallery("residential-driveways", "residential-driveways", 44),
    description: "StreetPrint stamps decorative patterns directly into a new or existing asphalt driveway — brick, cobblestone, slate, herringbone, or fully custom — without removing the base course. StreetBond UV-stable acrylic colour seals the surface in standard or custom Pantone colours and holds its finish through repeated freeze-thaw cycles without chalking, fading, or cracking. DuraShield rejuvenates oxidized driveways and adds 3–5 years of service life before resurfacing.",
    relatedProducts: ["streetprint", "streetbond", "durashield"],
  },
  {
    name: "Pedestrian Safety",
    slug: "pedestrian-safety",
    shortDesc: "High-visibility crosswalks, school zones, and tactile guidance treatments",
    imageUrl: "/images/applications/crosswalks/crosswalks-03.jpg",
    gallery: [1,3,6,8,11,13,16,18,21,23,26,28,31,33,36,38,41,43,45,48,50,53,55,58,60,63,65,68,70,73,75,78,80,83,85,87,90,92,95,97,100,102,105,107,110,112,115,117,120,122].map(n =>
      `/images/applications/crosswalks/crosswalks-${String(n).padStart(2,"0")}.jpg`),
    description: "High-visibility crosswalks, raised intersection treatments, school zone markings, and tactile guidance surfaces depend on durable, retroreflective pavement systems. TrafficPatterns 90mil and TrafficPatternsXD 150mil preformed thermoplastic provide ASTM D4956-rated retroreflectivity at crosswalks and school zones, holding nighttime visibility through Canadian winter maintenance cycles. StreetBond and MMAX coloured coatings mark pedestrian priority zones and raised intersection treatments. Specified for Vision Zero and Complete Streets programs.",
    relatedProducts: ["traffic-patterns", "traffic-patterns-xd", "streetbond", "mmax", "decomark", "premark"],
  },
  {
    name: "Traffic Calming",
    slug: "traffic-calming",
    shortDesc: "Coloured pavement and decorative treatments for speed control and gateway entries",
    imageUrl: "/images/applications/traffic-calming/traffic-calming-01.jpg",
    gallery: [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,51,52,53,54,55].map(n =>
      `/images/applications/traffic-calming/traffic-calming-${String(n).padStart(2,"0")}.jpg`),
    description: "Speed tables, raised intersections, curb extensions, and gateway treatments use pavement colour and texture to reduce vehicle entry speeds and delineate pedestrian priority zones. StreetBond and MMAX coloured coatings hold high-contrast colour through winter maintenance cycles. StreetPrint gateway stamped asphalt signals neighbourhood boundaries through material texture. TrafficPatterns and TrafficPatternsXD provide durable thermoplastic markings at raised crosswalks and school zone treatments.",
    relatedProducts: ["streetbond", "mmax", "traffic-patterns", "traffic-patterns-xd", "streetprint"],
  },
  {
    name: "Airports",
    slug: "airports",
    shortDesc: "Preformed thermoplastic airfield markings for runways, taxiways, and aprons",
    imageUrl: "/images/applications/airports/airports-01.jpg",
    gallery: gallery("airports", "airports", 28),
    description: "Airfield surface markings are governed by strict aviation standards for colour, retroreflectivity, and dimensional accuracy. AirMark preformed thermoplastic covers runway threshold markings, designation numbers, taxiway centrelines, holding position signs, and apron designations. ASTM D4956 Type IV retroreflectivity built through the full material cross-section, not just a surface bead application. Heat-applied by certified crews. Withstands jet blast and deicing fluid application. Outlasts painted markings 4:1, with no extended runway closures.",
    relatedProducts: ["airmark"],
  },
  {
    name: "LEED & Urban Heat Island",
    slug: "leed-urban-heat-island",
    shortDesc: "High-SRI pavement coatings for heat island mitigation and LEED credit",
    imageUrl: "/images/applications/leed-urban-heat-island/leed-urban-heat-island-01.jpg",
    gallery: gallery("leed-urban-heat-island", "leed-urban-heat-island", 2),
    description: "Dark asphalt absorbs solar radiation and raises ambient urban temperatures, increasing air conditioning demand and accelerating pavement degradation. StreetBondSR is a high-SRI (Solar Reflectance Index) coating that reflects solar energy off the pavement surface, reducing surface temperatures relative to standard asphalt and contributing to LEED v4 Sustainable Sites credit for heat island reduction. Available in light-colour SRI-optimized formulations and full custom Pantone matching.",
    relatedProducts: ["streetbond", "mmax", "durashield"],
  },
  {
    name: "Public Art",
    slug: "public-art",
    shortDesc: "Custom pavement murals and Indigenous art installations at civic scale",
    imageUrl: "/images/applications/community-branding/community-branding-01.jpg",
    gallery: gallery("community-branding", "community-branding", 14),
    description: "Indigenous art installations, labyrinth designs, Pride crosswalks, and transit station murals — pavement carries civic art at full street scale. DecoMark provides print-quality custom graphics with full Pantone matching. StreetBond covers large-format colour fields and mural backgrounds. Both systems are designed to remain in service for the full life of the asphalt substrate. Installed in partnership with artists, Indigenous nations, planners, and community organizations across Canada.",
    relatedProducts: ["decomark", "streetbond", "streetprint"],
  },
  {
    name: "Regulatory Markings",
    slug: "regulatory-markings",
    shortDesc: "Stop bars, turn arrows, yield triangles, and pavement legends",
    imageUrl: "/images/applications/traffic-calming/traffic-calming-01.jpg",
    gallery: [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,51,52,53,54,55].map(n =>
      `/images/applications/traffic-calming/traffic-calming-${String(n).padStart(2,"0")}.jpg`),
    description: "Stop bars, turn arrows, yield triangles, school zone legends, accessible parking symbols, and crosswalk ladder lines require dimensional precision and multi-year retroreflectivity. TrafficPatterns 90mil and TrafficPatternsXD 150mil preformed thermoplastic outlast paint 5:1, holding ASTM-rated visibility through Canadian winter maintenance cycles. PreMark covers pre-cut symbols and legends, heat-applied with no curing downtime and no stencil prep.",
    relatedProducts: ["traffic-patterns", "traffic-patterns-xd", "premark", "duratherm", "airmark"],
  },
];
