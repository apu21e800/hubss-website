/*
 * PHOTO DROP INSTRUCTIONS
 * =======================
 * Drop photos into public/images/applications/[slug]/
 *
 * Folder mapping from client photo library:
 * Crosswalks/           → crosswalks/
 * Commercial Spaces/    → commercial-spaces/
 * Splash Pads/          → splash-pads/
 * Playgrounds/          → playgrounds/
 * Parking Lots/         → parking-lots/
 * Parks & Paths/        → parks-paths/
 * Bike Lanes/           → bike-lanes/
 * Bus Lanes/            → bus-lanes/
 * Community Branding/   → community-branding/
 * Regulatory Markings/  → regulatory-markings/
 * Traffic Calming/      → traffic-calming/
 * Airports/             → airports/
 * Private Driveways/    → private-driveways/
 * Townhomes/            → townhomes/
 * LEED - Urban Heat Island/ → leed-urban-heat-island/
 *
 * Hero image:  hero.jpg (landscape, min 1920px wide)
 * Gallery:     01.jpg, 02.jpg, 03.jpg etc.
 * All images:  JPG, under 2MB each
 */

export interface Application {
  name: string;
  slug: string;
  shortDesc: string;
  imageUrl: string;
  gallery?: string[];
  description?: string[];
  relatedProducts?: string[];
  benefits?: string[];
  col?: string;
}

export const applications: Application[] = [
  {
    name: "Crosswalks",
    slug: "crosswalks",
    shortDesc: "High-visibility pedestrian crossings built with thermoplastic, stamped asphalt, and custom civic identity.",
    imageUrl: "/images/applications/crosswalks/crosswalk-1.jpg",
    gallery: [
      "/images/applications/crosswalks/crosswalk-1.jpg",
      "/images/applications/crosswalks/crosswalk-2.jpg",
      "/images/applications/crosswalks/crosswalk-3.jpg",
      "/images/applications/crosswalks/crosswalk-4.jpg",
      "/images/applications/crosswalks/crosswalk-6.jpg",
      "/images/applications/crosswalks/crosswalk-7.png",
      "/images/applications/crosswalks/crosswalk-10.jpg",
      "/images/applications/crosswalks/crosswalk-11.jpg",
      "/images/applications/crosswalks/crosswalk-12.jpg",
      "/images/applications/crosswalks/crosswalk-13.jpg",
      "/images/applications/crosswalks/crosswalk-14.jpg",
      "/images/applications/crosswalks/crosswalk-15.jpg",
    ],
    description: [
      "Crosswalks are the most visible expression of pedestrian safety in any Canadian municipality. HUB Surface Systems provides the full spectrum of crosswalk marking solutions — from standard preformed thermoplastic for high-traffic intersections to decorative stamped asphalt treatments that define neighbourhood character and slow traffic through visual cues.",
      "Our thermoplastic systems (TrafficPatterns and TrafficPatternsXD) deliver retroreflective performance that exceeds TAC and MUTCD requirements, with durability that outlasts traditional paint by 5–10x. For municipalities with Vision Zero commitments, high-contrast ladder crosswalks and coloured intersection treatments measurably improve pedestrian detection at critical points — particularly during low-light and wet conditions.",
      "Decorative crosswalk programs have transformed corridors in Vancouver, York Region, Toronto, and across the country — turning utilitarian infrastructure into community identity markers that celebrate local culture while reinforcing pedestrian priority.",
    ],
    relatedProducts: ["traffic-patterns", "traffic-patterns-xd", "decomark", "premark", "duratherm"],
    benefits: [
      "5–10x longer service life than painted markings",
      "ASTM Type III and IV retroreflectivity standards",
      "Vision Zero compatible — high-contrast ladder designs",
      "Custom decorative patterns for community identity",
      "20-year colour retention on StreetPrint treatments",
      "AODA compliant colour contrast and tactile integration",
    ],
    col: "sm:col-span-2 sm:row-span-2",
  },
  {
    name: "Commercial Spaces",
    slug: "commercial-spaces",
    shortDesc: "Decorative pavement for retail entries, plazas, and commercial properties.",
    imageUrl: "/images/applications/commercial-spaces/commercial-spaces-1.jpg",
    gallery: [
      "/images/applications/commercial-spaces/commercial-spaces-1.jpg",
      "/images/applications/commercial-spaces/commercial-spaces-2.jpg",
      "/images/applications/commercial-spaces/commercial-spaces-3.jpg",
    ],
    description: [
      "Commercial properties compete on first impressions. Stamped asphalt, coloured coatings, and precision thermoplastic markings communicate quality, care, and brand alignment from the moment a customer arrives. HUB's StreetPrint and StreetBond systems give developers and property managers a premium aesthetic at a fraction of the cost of concrete or stone pavers — with none of the joint maintenance.",
      "TrafficPatternsXD durable preformed markings delineate driveways, fire lanes, accessible routes, and pedestrian crossings within commercial developments with crisp, long-lasting precision.",
    ],
    relatedProducts: ["streetprint", "streetbond", "traffic-patterns-xd"],
    benefits: [
      "Premium aesthetic at fraction of paver installed cost",
      "20-year colour retention on StreetBond treatments",
      "Complete fire lane, accessible route, and safety markings",
      "Minimal installation disruption — phased execution available",
    ],
    col: "",
  },
  {
    name: "Splash Pads",
    slug: "splash-pads",
    shortDesc: "Safe, colourful surface systems for water play areas and aquatic facility surrounds.",
    imageUrl: "/images/applications/splash-pads/splash-pads-1.jpg",
    gallery: ["/images/applications/splash-pads/splash-pads-1.jpg"],
    description: [
      "Splash pads and spray parks require surface systems with specialized performance properties: slip resistance to prevent falls on wet surfaces, chemical resistance to withstand constant water and disinfectant exposure, UV stability to maintain colour intensity through summer seasons, and the durability to sustain heavy barefoot traffic from children and families.",
      "StreetBond's slip-resistant formulation meets all of these requirements while delivering the vivid, playful colours that define great splash pad environments.",
    ],
    relatedProducts: ["streetbond", "mmax"],
    benefits: [
      "Slip-resistant formulation — wet surface safety certified",
      "Chemical resistant — withstands water treatment chemicals",
      "20-year UV-stable colour — vibrant through every season",
      "Custom colour to match themed design concepts",
    ],
    col: "",
  },
  {
    name: "Playgrounds",
    slug: "playgrounds",
    shortDesc: "Bright, durable surface markings and decorative treatments for school and park playgrounds.",
    imageUrl: "/images/applications/playgrounds/playgrounds-1.jpg",
    gallery: [
      "/images/applications/playgrounds/playgrounds-1.jpg",
      "/images/applications/playgrounds/playgrounds-2.jpg",
      "/images/applications/playgrounds/playgrounds-3.jpg",
    ],
    description: [
      "School and park playgrounds demand surface systems that can handle constant foot traffic, weather exposure, and years of active play while maintaining the bright, engaging colours that make outdoor spaces inviting for children.",
      "DecoMark preformed thermoplastic enables custom playground markings — hopscotch courts, four-square grids, compass roses, and educational graphics — with factory-manufactured precision that ensures consistent results and long service life.",
    ],
    relatedProducts: ["streetbond", "decomark", "premark"],
    benefits: [
      "Slip-resistant formulation for safety",
      "20-year UV-stable colour retention",
      "Custom graphics — hopscotch, four-square, educational",
      "AODA compliant accessible surface markings",
    ],
    col: "",
  },
  {
    name: "Parking Lots",
    slug: "parking-lots",
    shortDesc: "Durable line markings, wayfinding graphics, and decorative coatings for parking facilities.",
    imageUrl: "/images/applications/parking-lots/parking-lots-1.jpg",
    gallery: [
      "/images/applications/parking-lots/parking-lots-1.jpg",
      "/images/applications/parking-lots/parking-lots-2.jpg",
    ],
    description: [
      "Commercial and municipal parking facilities experience intense, repetitive loading that degrades both the asphalt substrate and surface markings quickly. DuraShield asphalt rejuvenation coating is the foundation of HUB's parking lot program — restoring oxidized pavement, sealing hairline cracks, and providing a uniform professional finish.",
      "PreMark preformed thermoplastic stall markings, directional arrows, and regulatory symbols deliver crisp, long-lasting delineation that resists the wear that painted markings cannot sustain.",
    ],
    relatedProducts: ["durashield", "premark", "streetbond"],
    benefits: [
      "DuraShield extends pavement life 3–5 years between resurfacing",
      "PreMark stall markings last 5–10x longer than paint",
      "AODA accessible stall symbols — code compliant",
      "Minimal disruption — fast installation and same-day reopen",
    ],
    col: "",
  },
  {
    name: "Parks & Paths",
    slug: "parks-paths",
    shortDesc: "Surface treatments for pathways, greenways, and park infrastructure.",
    imageUrl: "/images/applications/parks-paths/parks-paths-1.jpg",
    gallery: [
      "/images/applications/parks-paths/parks-paths-1.jpg",
      "/images/applications/parks-paths/parks-paths-2.jpg",
      "/images/applications/parks-paths/parks-paths-3.jpg",
    ],
    description: [
      "Parks and recreational trails are environments where surface aesthetics matter as much as durability. StreetBond colour coatings bring vibrancy to asphalt paths, plazas, and recreational courts while significantly extending surface life.",
      "DuraShield protective coatings act as a rejuvenating sealant for aging park infrastructure — penetrating the asphalt matrix to restore flexibility and slow oxidation.",
    ],
    relatedProducts: ["streetbond", "streetprint", "durashield"],
    benefits: [
      "StreetBond colour extends path life while improving aesthetics",
      "20-year UV-stable colour retention on treated surfaces",
      "DuraShield pavement rejuvenation defers resurfacing 3–5 years",
      "Custom wayfinding and trail marking graphics",
    ],
    col: "sm:col-span-2",
  },
  {
    name: "Bike Lanes",
    slug: "bike-lanes",
    shortDesc: "Protected bike lane surfaces and markings that improve cyclist safety and visibility.",
    imageUrl: "/images/applications/bike-lanes/bike-lanes-1.jpg",
    gallery: [
      "/images/applications/bike-lanes/bike-lanes-1.jpg",
      "/images/applications/bike-lanes/bike-lanes-2.jpg",
    ],
    description: [
      "Bike lane coatings are essential infrastructure for Complete Streets design. StreetBond provides the vivid green colour and UV stability that keeps cycling infrastructure visible and compelling for decades.",
      "MMAX methyl methacrylate resin delivers fast cure times for high-traffic cycling corridors — traffic-open in 60 minutes with exceptional bond strength and colour durability.",
    ],
    relatedProducts: ["mmax", "streetbond", "traffic-patterns", "premark"],
    benefits: [
      "StreetBond 20-year UV-stable colour retention",
      "MMAX traffic-open in 60 minutes — minimal disruption",
      "High-visibility green for conflict zone safety",
      "TAC and MUTCD compliant corridor markings",
    ],
    col: "",
  },
  {
    name: "Bus Lanes",
    slug: "bus-lanes",
    shortDesc: "High-durability coloured surface systems for bus rapid transit and dedicated bus lanes.",
    imageUrl: "/images/applications/bus-lanes/bus-lanes-1.jpg",
    gallery: [
      "/images/applications/bus-lanes/bus-lanes-1.jpg",
      "/images/applications/bus-lanes/bus-lanes-2.jpg",
    ],
    description: [
      "Bus lanes are high-stress transit corridors requiring surface systems that can endure daily bus wheel loads without delamination or colour fade. HUB's MMAX methyl methacrylate resin is the standard of care for BRT corridors.",
      "Red bus lane coatings provide unambiguous visual priority for transit vehicles while deterring unauthorized traffic.",
    ],
    relatedProducts: ["mmax", "traffic-patterns-xd", "streetbond"],
    benefits: [
      "MMAX traffic-open in 60 minutes — minimal disruption",
      "Exceptional bond strength — withstands bus wheel loads",
      "Fast-cure MMA application near freezing temperatures",
      "High-visibility red for transit priority",
    ],
    col: "",
  },
  {
    name: "Community Branding",
    slug: "community-branding",
    shortDesc: "Custom civic identity and placemaking graphics on roads, plazas, and public spaces.",
    imageUrl: "/images/applications/community-branding/community-branding-1.jpg",
    gallery: [
      "/images/applications/community-branding/community-branding-1.jpg",
      "/images/applications/community-branding/community-branding-2.jpg",
      "/images/applications/community-branding/community-branding-3.jpg",
      "/images/applications/community-branding/community-branding-4.jpg",
    ],
    description: [
      "A municipality's visual identity extends to its streets. Gateway intersections, BIA corridors, neighbourhood boundary markers, and civic plazas are all opportunities to reinforce place character and civic pride.",
      "StreetPrint stamped asphalt patterns create a tactile and visual distinction that signals entry into a special place — whether a heritage commercial district, a new transit village, or a waterfront promenade.",
    ],
    relatedProducts: ["decomark", "streetbond", "traffic-patterns", "streetprint"],
    benefits: [
      "Custom patterns coordinated with municipal brand standards",
      "Gateway and BIA corridor identity treatments",
      "DuraTherm snowplow-safe inlaid thermoplastic",
      "20-year colour retention — long-term civic investment",
    ],
    col: "",
  },
  {
    name: "Regulatory Markings",
    slug: "regulatory-markings",
    shortDesc: "MUTCD-compliant stop bars, arrows, legends, and regulatory road markings.",
    imageUrl: "/images/applications/regulatory-markings/regulatory-markings-1.jpg",
    gallery: [
      "/images/applications/regulatory-markings/regulatory-markings-1.jpg",
      "/images/applications/regulatory-markings/regulatory-markings-2.jpg",
      "/images/applications/regulatory-markings/regulatory-markings-3.jpg",
    ],
    description: [
      "Regulatory road markings are safety-critical infrastructure that must meet TAC and MUTCD dimensional and reflectivity standards precisely. HUB's PreMark and TrafficPatterns preformed thermoplastic systems deliver factory-manufactured precision that ensures compliance while dramatically outlasting traditional painted markings.",
      "Stop bars, turn arrows, lane legends, and directional symbols are produced to exact specifications with integrated glass beads for ASTM Type III and IV retroreflectivity.",
    ],
    relatedProducts: ["premark", "traffic-patterns", "duratherm"],
    benefits: [
      "TAC and MUTCD dimensional compliance",
      "ASTM Type III and IV retroreflectivity",
      "5–10x longer service life than paint",
      "Factory precision — no spray drift or overspray",
    ],
    col: "",
  },
  {
    name: "Traffic Calming",
    slug: "traffic-calming",
    shortDesc: "Surface treatments that reduce vehicle speeds through visual contrast, pattern complexity, and the psychology of place — without physical infrastructure.",
    imageUrl: "/images/applications/traffic-calming/traffic-calming-1.jpg",
    gallery: [
      "/images/applications/traffic-calming/traffic-calming-1.jpg",
      "/images/applications/traffic-calming/traffic-calming-2.jpg",
      "/images/applications/traffic-calming/traffic-calming-3.png",
    ],
    description: [
      "Traffic calming through surface design is one of the most cost-effective tools available to municipalities pursuing Vision Zero and Complete Streets. Unlike speed cushions or raised tables, surface treatments achieve speed reduction through visual psychology — no civil works, no drainage modifications, no snowplow conflicts.",
      "StreetPrint stamped asphalt intersections replicate the visual character of a brick or cobblestone plaza, communicating shared-space priority to drivers before they reach the crossing. TrafficPatternsXD pattern overlays extend this effect along full corridors with the added benefit of proven retroreflective performance.",
      "All HUB traffic calming systems maintain full AODA compliance and snowplow compatibility — non-negotiable requirements for Canadian municipal approval. Lane closure is minimal; traffic is typically restored within hours of installation.",
    ],
    relatedProducts: ["traffic-patterns-xd", "traffic-patterns", "streetprint", "streetbond"],
    benefits: [
      "Visual speed cues that reduce vehicle speeds without humps",
      "Flush-surface installation — snowplow and maintenance safe",
      "AODA compliant — zero elevation change",
      "School zone and gateway treatment specialists",
      "Supports active transportation and Vision Zero goals",
      "Traffic-open within hours of installation",
    ],
    col: "",
  },
  {
    name: "Airports",
    slug: "airports",
    shortDesc: "FAA and Transport Canada compliant airfield surface markings and runway coatings.",
    imageUrl: "/images/applications/airports/airports-1.jpg",
    gallery: [
      "/images/applications/airports/airports-1.jpg",
      "/images/applications/airports/airports-2.jpg",
    ],
    description: [
      "Airfield markings are safety-critical infrastructure with zero tolerance for ambiguity. Runway thresholds, holding position markings, taxiway centrelines, and apron designations must meet FAA Advisory Circular and Transport Canada standards precisely, every time.",
      "AirMark preformed thermoplastic is engineered specifically for this environment: permanent bond to asphalt and concrete, exceptional Type IV retroreflectivity for low-visibility operations.",
    ],
    relatedProducts: ["airmark", "premark", "mmax"],
    benefits: [
      "FAA AC 150/5370-10 and TC Canada compliant",
      "ASTM D4956 Type IV retroreflectivity",
      "Permanent bond — resists jet blast and fuel exposure",
      "Same-day application on fresh asphalt paving",
    ],
    col: "",
  },
  {
    name: "Private Driveways",
    slug: "private-driveways",
    shortDesc: "Stamped and coloured decorative surfaces for residential and commercial driveways.",
    imageUrl: "/images/applications/private-driveways/private-driveways-1.png",
    gallery: ["/images/applications/private-driveways/private-driveways-1.png"],
    description: [
      "Decorative stamped asphalt and premium colour coatings have changed the economics of residential and townhome driveway enhancements. StreetPrint's in-place stamping system delivers the aesthetic of natural stone, brick, or slate — without the cost or maintenance complexity of traditional pavers.",
      "For colour and protection, StreetBond coatings restore and revitalize aging asphalt while delivering a vivid, professional finish.",
    ],
    relatedProducts: ["streetprint", "streetbond", "durashield"],
    benefits: [
      "Decorative patterns at fraction of paver installed cost",
      "12+ stamp patterns — brick, stone, slate, cobble, and more",
      "20-year colour retention guarantee on StreetPrint",
      "DuraShield sealant extends pavement life 3–5 years",
    ],
    col: "",
  },
  {
    name: "Townhomes",
    slug: "townhomes",
    shortDesc: "Decorative shared driveways, pathways, and common areas for townhome developments.",
    imageUrl: "/images/applications/townhomes/townhomes-1.jpg",
    gallery: ["/images/applications/townhomes/townhomes-1.jpg"],
    description: [
      "Townhome developments demand surface treatments that balance aesthetic appeal with lifecycle durability across shared driveways, pathways, and common areas. StreetPrint stamped asphalt delivers the look of premium unit pavers — brick, cobblestone, or slate patterns — without the maintenance complexity.",
      "StreetBond colour coatings provide vivid, UV-stable finishes for wayfinding, zone delineation, and decorative accents throughout the development.",
    ],
    relatedProducts: ["streetprint", "streetbond", "traffic-patterns-xd", "durashield"],
    benefits: [
      "Premium paver aesthetic without joint maintenance",
      "20-year colour retention on StreetPrint treatments",
      "Shared driveway and common area specialists",
      "Enhances property value and curb appeal",
    ],
    col: "",
  },
  {
    name: "Pedestrian Safety",
    slug: "pedestrian-safety",
    shortDesc: "High-visibility surfaces and markings engineered to protect pedestrians at intersections, school zones, and mid-block crossings.",
    imageUrl: "/images/applications/crosswalks/crosswalk-1.jpg",
    description: [
      "Pedestrian fatalities at intersections remain one of the most preventable infrastructure failures in Canadian cities. HUB Surface Systems provides the full spectrum of surface-based pedestrian safety interventions — from high-contrast ladder crosswalks and school zone markings to accessible pedestrian pathways that meet AODA and provincial accessibility standards.",
      "Vision Zero municipalities specify TrafficPatternsXD for their highest-priority corridors. The 150mil aggregate-reinforced formula delivers BPN 65+ skid resistance and retroreflectivity that exceeds TAC requirements for 7+ years — performing in wet conditions, at night, and under snowplow operations without edge loss.",
      "Coloured StreetBond intersection treatments create a visual contract between motorists and pedestrians. Studies from York Region and the City of Vancouver document measurable reductions in operating speeds at decorated intersections versus standard crosswalk markings.",
    ],
    relatedProducts: ["traffic-patterns-xd", "traffic-patterns", "streetbond", "decomark", "premark"],
    benefits: [
      "BPN 65+ skid resistance — wet surface performance",
      "TAC-compliant retroreflectivity for 7+ years",
      "AODA compliant accessible pedestrian markings",
      "Snowplow-safe — no edge loss under mechanical operations",
      "Measurable speed reductions at coloured intersection treatments",
      "Vision Zero and Complete Streets specification support",
    ],
    col: "",
  },
  {
    name: "LEED - Urban Heat Island",
    slug: "leed-urban-heat-island",
    shortDesc: "Light-reflective surface systems that reduce urban heat island effect for LEED certification.",
    imageUrl: "/images/applications/leed-urban-heat-island/leed-1.jpg",
    gallery: ["/images/applications/leed-urban-heat-island/leed-1.jpg"],
    description: [
      "Urban heat islands form where dark asphalt and concrete absorb and re-radiate solar energy — raising ambient temperatures by 3–5°C above surrounding areas. StreetBond SR (Solar Reflective) is HUB's answer: a surface coating engineered to reflect solar radiation rather than absorb it, reducing pavement surface temperatures by up to 20°C.",
      "StreetBond SR contributes directly to LEED v4 Site Credit: Heat Island Reduction — providing the Solar Reflectance Index (SRI) documentation required for project certification.",
    ],
    relatedProducts: ["streetbond", "durashield"],
    benefits: [
      "StreetBond SR reduces pavement surface temp by up to 20°C",
      "Contributes to LEED v4 Heat Island Reduction credit",
      "SRI documentation provided for LEED submissions",
      "Applicable to new and existing asphalt surfaces",
    ],
    col: "sm:col-span-2",
  },
];
