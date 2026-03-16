export interface Application {
  name: string;
  slug: string;
  imageUrl: string;       // hero fallback + card image (swap for /images/applications/[slug]/hero.jpg when ready)
  desc: string;           // one-liner for cards and meta
  description: string[];  // 2–3 paragraphs for overview section
  relatedProducts: string[]; // product slugs
  benefits: string[];     // key capability bullets for benefits section
  col?: string;           // grid span classes for homepage mosaic
}

export const applications: Application[] = [
  {
    name: "Crosswalks",
    slug: "crosswalks",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    desc: "High-visibility pedestrian crossings that save lives and support Vision Zero frameworks across Canadian municipalities.",
    description: [
      "Crosswalks are the most visible expression of pedestrian safety in any Canadian municipality. HUB Surface Systems provides the full spectrum of crosswalk marking solutions — from standard preformed thermoplastic for high-traffic intersections to decorative stamped asphalt treatments that define neighbourhood character and slow traffic through visual cues.",
      "Our thermoplastic systems (TrafficPatterns and TrafficPatternsXD) deliver retroreflective performance that exceeds TAC and MUTCD requirements, with durability that outlasts traditional paint by 5–10x. For municipalities with Vision Zero commitments, high-contrast ladder crosswalks and coloured intersection treatments measurably improve pedestrian detection at critical points — particularly during low-light and wet conditions.",
      "Decorative crosswalk programs have transformed corridors in Vancouver, York Region, Toronto, and across the country — turning utilitarian infrastructure into community identity markers that celebrate local culture while reinforcing pedestrian priority.",
    ],
    relatedProducts: ["traffic-patterns", "traffic-patterns-xd", "streetprint", "decomark"],
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
    name: "Bus & Bike Lanes",
    slug: "bus-bike-lanes",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1200&q=80",
    desc: "Dedicated transit and cycling infrastructure markings that define Complete Streets corridors — durable, high-visibility, long-lasting.",
    description: [
      "Bus and bike lanes are the backbone of Complete Streets design — visible, durable, and unambiguous. HUB's MMAX methyl methacrylate resin is the standard of care for high-stress transit corridors, delivering fast cure times (traffic-open in 60 minutes), exceptional bond strength, and a service life that endures daily bus wheel loads without delamination or colour fade.",
      "For bike lane coatings, StreetBond provides the vivid colour and UV stability that keeps cycling infrastructure visible and compelling — for decades. Where standard acrylic treatments fade within 2–3 years, StreetBond's 20-year colour retention keeps bike lanes legible and respected by drivers and cyclists alike.",
      "HUB has delivered bus lane and cycling infrastructure on major corridors including York Region's Highway 7 VIVA BRT and numerous Complete Streets retrofits across Ontario and BC. Our certified application crews minimize lane disruption while meeting aggressive re-open timelines demanded by municipal operations teams.",
    ],
    relatedProducts: ["mmax", "streetbond", "traffic-patterns"],
    benefits: [
      "MMAX traffic-open in 60 minutes — minimal disruption",
      "StreetBond 20-year UV-stable colour retention",
      "TAC and MUTCD compliant corridor markings",
      "Exceptional bond strength — withstands bus wheel loads",
      "Fast-cure MMA application near freezing temperatures",
      "Complete Streets design support available",
    ],
    col: "",
  },
  {
    name: "Driveways",
    slug: "driveways",
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80",
    desc: "Decorative stamped asphalt and colour coatings for residential and commercial entrance treatments — the look of premium pavers at a fraction of the cost.",
    description: [
      "Decorative stamped asphalt and premium colour coatings have changed the economics of residential and commercial driveway enhancements. StreetPrint's in-place stamping system delivers the aesthetic of natural stone, brick, or slate — without the cost or maintenance complexity of traditional pavers. Applications range from private residential entry courts to commercial plaza approaches and estate driveways.",
      "For colour and protection, StreetBond coatings restore and revitalize aging asphalt while delivering a vivid, professional finish. Whether coordinating with architectural materials on a luxury development or restoring a municipal entry plaza, StreetBond's custom colour-match capability ensures precise results that maintain their appearance for 20 years.",
      "DuraShield sealant completes the system — protecting the asphalt substrate and dramatically extending pavement lifespan. Together, these systems give developers and property managers a compelling alternative to concrete or stone pavers at a fraction of the installed cost.",
    ],
    relatedProducts: ["streetprint", "streetbond", "durashield"],
    benefits: [
      "Decorative patterns at fraction of paver installed cost",
      "12+ stamp patterns — brick, stone, slate, cobble, more",
      "20-year colour retention guarantee on StreetPrint",
      "Compatible with new and existing asphalt",
      "DuraShield sealant extends pavement life 3–5 years",
      "Custom colour matching for architectural coordination",
    ],
    col: "",
  },
  {
    name: "Public Art",
    slug: "public-art",
    imageUrl: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=1200&q=80",
    desc: "Street-scale murals and artistic pavement installations celebrating community identity — from Pride crosswalks to Indigenous land acknowledgements.",
    description: [
      "Pavement has become one of the most compelling canvases for public art — visible from ground level and overhead, accessible to every pedestrian and driver, and enduring in the urban landscape. HUB's DecoMark system enables municipalities, artists, and community groups to realize complex designs, murals, and symbolic markings at street scale with precision colour and permanent bonding.",
      "From Indigenous land acknowledgement installations to Pride crosswalks to BIA corridor identity treatments, DecoMark's full Pantone colour matching and precision-cut thermoplastic allows virtually any design to be faithfully reproduced on asphalt. Our production team works directly with artists and design agencies to develop installation-ready templates from submitted artwork.",
      "StreetBond liquid coatings complement DecoMark for large-area colour fields and gradient treatments, delivering vivid results that maintain their vibrancy for 20+ years under full UV exposure — long after latex murals have faded and peeled.",
    ],
    relatedProducts: ["decomark", "streetbond", "streetprint"],
    benefits: [
      "Full Pantone custom colour matching — any design",
      "Complex artwork reproduced with precision thermoplastic",
      "Works directly with artists and design agencies",
      "20-year colour vibrancy under UV exposure",
      "Large-format designs — effectively no size limits",
      "Heat-bonded — no adhesives, no lifting edges over time",
    ],
    col: "sm:row-span-2",
  },
  {
    name: "Regulatory Markings",
    slug: "regulatory-markings",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
    desc: "AODA-compliant safety markings, symbols, and wayfinding for accessible public infrastructure — manufactured to MUTCD and TAC standards.",
    description: [
      "Regulatory markings — stop bars, directional arrows, speed legends, turn restrictions, accessible parking symbols — must meet exacting standards for retroreflectivity, colour, geometry, and durability. HUB's PreMark preformed thermoplastic is manufactured to MUTCD and TAC standards, ensuring every installation meets code requirements without compromise, from first day of service through the full performance lifecycle.",
      "Preformed thermoplastic delivers consistent results that hand-applied paint cannot match — precise geometry, uniform thickness, and factory-applied glass beads for superior retroreflectivity from installation day. Crews install faster, road closures are shorter, and service life dramatically exceeds painted alternatives.",
      "For AODA compliance, HUB provides accessible parking symbols, wayfinding integration, and high-contrast colour combinations that meet Ontario and BC accessibility standards. Our team supports infrastructure managers with product selection, quantity estimation, and installation sequencing to minimize impact on adjacent operations.",
    ],
    relatedProducts: ["premark", "traffic-patterns", "traffic-patterns-xd"],
    benefits: [
      "MUTCD and TAC compliant — every symbol and legend",
      "Factory-manufactured geometry — zero painter variation",
      "Type III retroreflectivity from day one",
      "5–10x longer service life than painted markings",
      "AODA accessible parking and wayfinding symbols",
      "Full library — 200+ standard symbols plus custom",
    ],
    col: "",
  },
  {
    name: "Parks & Paths",
    slug: "parks-paths",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
    desc: "Trail markings, plaza treatments, and recreational surface coatings for parks and greenways — extending life while improving aesthetics.",
    description: [
      "Parks and recreational trails are environments where surface aesthetics matter as much as durability. StreetBond colour coatings bring vibrancy to asphalt paths, plazas, and recreational courts while significantly extending surface life. UV-stable formulations ensure colour remains consistent and inviting year after year, even under full Canadian summer sun exposure.",
      "DuraShield protective coatings act as a rejuvenating sealant for aging park infrastructure — penetrating the asphalt matrix to restore flexibility and slow oxidation, dramatically extending the service window between costly resurfacing projects. For parks capital planners, DuraShield consistently delivers the highest return-on-investment among surface maintenance options.",
      "For wayfinding, lane delineation, and decorative treatments in parks, DecoMark enables custom surface markings that enhance the recreational experience and reinforce park identity. From running track markings to map graphics inlaid at plaza entries, the design possibilities are effectively unlimited.",
    ],
    relatedProducts: ["streetbond", "durashield", "decomark"],
    benefits: [
      "StreetBond colour extends path life while improving aesthetics",
      "20-year UV-stable colour retention on treated surfaces",
      "DuraShield pavement rejuvenation defers resurfacing 3–5 years",
      "Custom wayfinding and trail marking graphics",
      "Low-VOC formulations suitable for park environments",
      "Compatible with existing asphalt and concrete substrates",
    ],
    col: "sm:col-span-2",
  },
  {
    name: "Community Branding",
    slug: "community-branding",
    imageUrl: "https://images.unsplash.com/photo-1486325212980-2af6a2b98b1f?w=1200&q=80",
    desc: "Municipal identity and placemaking surfaces that give neighbourhoods a distinctive visual character — BIA corridors, gateway intersections, and civic plazas.",
    description: [
      "A municipality's visual identity extends to its streets. Gateway intersections, BIA corridors, neighbourhood boundary markers, and civic plazas are all opportunities to reinforce place character and civic pride. HUB Surface Systems has worked with municipalities across Canada to translate brand guidelines and local identity into durable street-level design that signals investment and intention.",
      "StreetPrint stamped asphalt patterns create a tactile and visual distinction that signals entry into a special place — whether a heritage commercial district, a new transit village, or a waterfront promenade. Combined with StreetBond colour coatings, the result is a branded environment that communicates care and commands respect from visitors and residents alike.",
      "DuraTherm inlaid thermoplastic is particularly effective for gateway corridor treatments where snowplow durability is non-negotiable — logos, directional patterns, and branded symbols installed flush with the road surface for zero-maintenance performance through full Canadian winters.",
    ],
    relatedProducts: ["streetprint", "decomark", "streetbond", "duratherm"],
    benefits: [
      "Custom patterns coordinated with municipal brand standards",
      "Gateway and BIA corridor identity treatments",
      "DuraTherm snowplow-safe inlaid thermoplastic",
      "20-year colour retention — long-term civic investment",
      "Works with design agencies and civic art programs",
      "Placemaking program support and design consultation",
    ],
    col: "",
  },
  {
    name: "Parking Lots",
    slug: "parking-lots",
    imageUrl: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200&q=80",
    desc: "Durable markings, stall delineation, and protective coatings for commercial and municipal parking facilities — professional results that last.",
    description: [
      "Commercial and municipal parking facilities experience intense, repetitive loading that degrades both the asphalt substrate and surface markings quickly. DuraShield asphalt rejuvenation coating is the foundation of HUB's parking lot program — restoring oxidized pavement, sealing hairline cracks, and providing a uniform professional finish that dramatically extends asset life and defers costly resurfacing capital.",
      "PreMark preformed thermoplastic stall markings, directional arrows, and regulatory symbols deliver crisp, long-lasting delineation that resists the wear that painted markings cannot sustain. For accessible stall designations and fire lane markings, PreMark's factory-manufactured precision ensures AODA and fire code compliance across the facility.",
      "For retail and commercial properties where curb appeal matters, StreetBond colour treatments for fire lanes, accessible zones, and featured stalls create a polished, intentional look that reflects positively on the property and reduces repainting frequency.",
    ],
    relatedProducts: ["durashield", "premark", "streetbond"],
    benefits: [
      "DuraShield extends pavement life 3–5 years between resurfacing",
      "PreMark stall markings last 5–10x longer than paint",
      "AODA accessible stall symbols — code compliant",
      "Fire lane and safety zone colour treatments",
      "Professional uniform finish improves property appearance",
      "Minimal disruption — fast installation and same-day reopen",
    ],
    col: "",
  },
  {
    name: "Airports",
    slug: "airports",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    desc: "FAA and TC Canada compliant airfield markings for runways, taxiways, aprons, and helipads — precision and durability where it matters most.",
    description: [
      "Airfield markings are safety-critical infrastructure with zero tolerance for ambiguity. Runway thresholds, holding position markings, taxiway centrelines, and apron designations must meet FAA Advisory Circular and Transport Canada standards precisely, every time. AirMark preformed thermoplastic is engineered specifically for this environment: permanent bond to asphalt and concrete, exceptional Type IV retroreflectivity for low-visibility operations, and a construction that withstands jet blast, fuel spill, and repeated aircraft wheel loads.",
      "HUB's certified airfield marking crews bring the experience and precision equipment necessary to execute complex airfield marking projects with the dimensional accuracy aviation safety demands. From commercial airports to regional facilities and private airstrips across Canada, AirMark delivers the consistency and reliability that keeps pilots informed and regulators satisfied.",
      "When runways are repaved or airfield expansion occurs, AirMark's compatibility with fresh asphalt surfaces allows same-day application after paving — minimizing airport disruptions that affect operations, schedules, and revenue.",
    ],
    relatedProducts: ["airmark"],
    benefits: [
      "FAA AC 150/5370-10 and TC Canada compliant",
      "ASTM D4956 Type IV retroreflectivity",
      "Permanent bond — resists jet blast and fuel exposure",
      "Withstands aircraft wheel loads and deicing chemicals",
      "Same-day application on fresh asphalt paving",
      "Certified installation crews — precise dimensional accuracy",
    ],
    col: "",
  },
];
