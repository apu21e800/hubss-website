export interface Product {
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  imageUrl: string;
  gallery?: string[];
  specs: { label: string; value: string }[];
  relatedApplications: string[];
  colourCollections?: { name: string; colours: string[] }[];
  brandLogo?: { src: string; alt: string; width: number; height: number; };
}

function gallery(slug: string, dir: string, count: number, ext: string = "jpg"): string[] {
  return Array.from({ length: count }, (_, i) =>
    `/images/products/${dir}/${slug}-${String(i + 1).padStart(2, "0")}.${ext}`
  );
}

export const products: Product[] = [
  // ── Flagship Group ──────────────────────────────────────────────────────────
  {
    name: "TrafficPatternsXD",
    slug: "traffic-patterns-xd",
    shortDesc: "150 mil three-dimensional thermoplastic for extreme conditions",
    imageUrl: "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
    gallery: gallery("traffic-patterns-xd", "traffic-patterns-xd", 99),
    description: "TrafficPatternsXD\u2122 is the heavy-duty evolution of TrafficPatterns \u2014 a 150 mil thick aggregate-reinforced thermoplastic engineered for the most demanding road and parking lot conditions Canada can throw at it. Heat applied and permanently bonded, XD creates a three-dimensional surface solution that withstands daily transit loads, winter maintenance operations, and decades of freeze-thaw cycling. Where standard markings fail, XD performs.",
    specs: [
      { label: "Material", value: "Aggregate-reinforced preformed thermoplastic" },
      { label: "Thickness", value: "150 mil (3.81 mm) \u2014 traffic-tough even in Canadian winters" },
      { label: "Installation", value: "Heat application \u2014 permanently bonded" },
      { label: "Structural Impact", value: "Does not affect pavement structural integrity" },
      { label: "Applications", value: "Streetscape beautification, traffic calming, community branding, parking lot hardscapes" },
      { label: "Maintenance", value: "Virtually maintenance free" },
    ],
    relatedApplications: ["crosswalks", "bike-lanes", "bus-lanes"],
  },
  {
    name: "TrafficPatterns",
    slug: "traffic-patterns",
    shortDesc: "125 mil preformed thermoplastic \u2014 built for Canadian roads",
    imageUrl: "/images/products/traffic-patterns/traffic-patterns-01.jpg",
    gallery: gallery("traffic-patterns", "traffic-patterns", 86),
    description: "TrafficPatterns\u2122 is a 125 mil thick aggregate-reinforced thermoplastic heat-applied directly to asphalt or concrete, bonding permanently without affecting pavement structural integrity. Virtually maintenance free and designed for freeze-thaw resilience, TrafficPatterns\u2122 is the go-to two-dimensional surface solution for municipalities balancing design ambition with regulatory requirements. Mix and match standard patterns and colours, or design your own \u2014 the system is built for creative flexibility without sacrificing compliance.",
    specs: [
      { label: "Material", value: "Aggregate-reinforced preformed thermoplastic" },
      { label: "Thickness", value: "125 mil (3.175 mm)" },
      { label: "Installation", value: "Heat application \u2014 bonds permanently" },
      { label: "Applications", value: "Streetscape beautification, community branding, traffic calming, parking lot hardscapes" },
      { label: "Design", value: "Standard patterns + custom design capability" },
      { label: "Maintenance", value: "Virtually maintenance free" },
    ],
    relatedApplications: ["crosswalks", "bike-lanes", "bus-lanes", "parking-lots"],
  },
  {
    name: "StreetBond",
    slug: "streetbond",
    shortDesc: "Permanent pavement coating \u2014 bonds to asphalt and concrete",
    imageUrl: "/images/products/streetbond/streetbond-01.png",
    gallery: gallery("streetbond", "streetbond", 112, "png"),
    description: "StreetBond\u00ae SB150 Pavement Coating bonds permanently to asphalt or concrete to deliver an enduring aesthetic finish and a low-maintenance surface. Skid and slip resistant, it beautifies, protects, and extends the life of exterior hardscapes. StreetBond\u00ae works with the normal expansion and contraction of both surfaces \u2014 it will not peel, delaminate, or shrink-crack when installed per manufacturer specifications. Very durable and highly resistant to water and chemical damage, StreetBond\u00ae SB150 has superior adhesion characteristics that outperform other pavement coatings. Colour-stable with excellent friction properties meeting government regulatory requirements. Available in Traditional, Signature, Solar Reflective, and Bike Lane colour collections. Solar Reflective colours reduce Urban Heat Island Effect (LEED\u00ae 7.1 non-roof) while resisting UV damage.",
    specs: [
      { label: "Adhesion", value: "Bonds permanently to asphalt and concrete" },
      { label: "Performance", value: "Will not peel, delaminate, or shrink-crack" },
      { label: "Chemical Resistance", value: "Highly resistant to water and chemical damage" },
      { label: "Friction", value: "Excellent skid/slip resistance \u2014 meets government regulatory requirements" },
      { label: "Colour Stability", value: "Colour stable \u2014 outperforms competing pavement coatings" },
      { label: "Colour Collections", value: "Traditional \u00b7 Signature \u00b7 Solar Reflective (LEED\u00ae 7.1) \u00b7 Bike Lanes" },
      { label: "LEED", value: "Solar Reflective colours contribute to LEED\u00ae 7.1 non-roof credits" },
      { label: "Applications", value: "Streetscape beautification, community branding, revitalization, raised traffic calming, driveways, multi-family hardscapes, parks, plazas and pathways, parking lot hardscapes" },
    ],
    colourCollections: [
      { name: "Traditional", colours: ["San Diego Blue", "Burnt Sienna", "Terra Cotta", "Brick", "Sunset Blush", "Marigold", "Sierra", "Black", "Granite", "Taupe", "Nutmeg", "Bedrock", "Brown Suede", "Concrete Gray", "Pewter", "Hunter Green", "Slate"] },
      { name: "Signature", colours: ["Sandy Beige", "Driftwood", "Butterscotch", "Pumpkin Spice", "Chestnut Brown", "Mocha", "Mustard", "Paprika", "Down To Earth", "Avocado", "Sea Foam", "Aqua", "Sage", "Patriot Blue", "Truffle", "Cobalt Blue", "Gun Metal", "Merlot", "Smokey Mauve", "Graphite"] },
      { name: "Solar Reflective", colours: ["SR Sandstone (SRI 36)", "SR Irish Cream (SRI 50)", "SR Fawn (SRI 35)", "SR Brownstone (SRI 31)", "SR Evergreen (SRI 33)", "SR Slate (SRI 34)"] },
      { name: "Bike Lanes", colours: ["CL Shamrock Green", "CL Emerald Green", "CL Celtic Green"] },
    ],
    brandLogo: {
      src: "/images/products/streetbond/streetbond-logo.png",
      alt: "StreetBond coloured pavement coating system by HUB Surface Systems",
      width: 280,
      height: 80,
    },
    relatedApplications: ["bike-lanes", "bus-lanes", "private-driveways", "parks-paths", "parking-lots"],
  },
  {
    name: "StreetPrint",
    slug: "streetprint",
    shortDesc: "Genuine stamped asphalt \u2014 decorative hardscape since 1993",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: gallery("streetprint", "streetprint", 91),
    description: "StreetPrint\u00ae Genuine Stamped Asphalt has been the superior decorative surface solution since 1993. Using specialized heaters and flexible wire grids to reheat existing asphalt, then stamping with custom pattern templates and finishing with StreetBond\u00ae SB150 coatings, StreetPrint\u00ae gives engineers and architects extraordinary three-dimensional decorative hardscape flexibility \u2014 in both pattern and colour \u2014 with all the structural advantages of an asphalt substrate. Fast to install, minimally disruptive, and safe \u2014 level without trip points, meeting or exceeding TAC skid/slip resistance requirements. Deicing chemical, chlorine, and salt resistant. UV-stable colours maintain vibrancy for years.",
    specs: [
      { label: "System", value: "In-place stamped asphalt (reheat \u2192 stamp \u2192 coat)" },
      { label: "Process", value: "Specialized heaters + flexible wire grids + StreetBond\u00ae SB150 finish" },
      { label: "Safety", value: "Level surface \u2014 no trip points. Meets/exceeds TAC skid/slip resistance" },
      { label: "Chemical Resistance", value: "Deicing chemicals, chlorine, salt resistant" },
      { label: "Colours", value: "Wide range of UV-stable colours \u2014 maintains colour for years" },
      { label: "Patterns", value: "Wide variety including custom designs" },
      { label: "Repair", value: "Easily repairable" },
      { label: "Applications", value: "Streetscape beautification, community branding, revitalization, raised traffic calming, parking lot hardscapes, driveways, multi-family hardscapes, parks, plazas, and pathways" },
    ],
    relatedApplications: ["crosswalks", "private-driveways", "community-branding", "parking-lots"],
  },

  // ── Specialty & Regulatory Group ────────────────────────────────────────────
  {
    name: "DecoMark",
    slug: "decomark",
    shortDesc: "High-resolution custom graphics on any exterior pavement surface",
    imageUrl: "/images/products/decomark/decomark-01.jpg",
    gallery: gallery("decomark", "decomark", 78),
    description: "DecoMark\u00ae is a durable preformed thermoplastic ideal for high-resolution custom graphics on exterior pavement surfaces. Whether a basic two-colour directional message or a multi-coloured custom logo, each design begins with a CAD drawing linked to a stringent manufacturing process. DecoMark\u00ae design and colour combinations are extensive \u2014 the system handles everything from Indigenous art installations to Pride crosswalks to wayfinding systems with equal precision and longevity.",
    specs: [
      { label: "Material", value: "Durable preformed thermoplastic" },
      { label: "Resolution", value: "High-resolution custom graphics capability" },
      { label: "Process", value: "CAD drawing \u2192 stringent manufacturing \u2192 precision installation" },
      { label: "Colour", value: "Extensive design and colour combinations" },
      { label: "Applications", value: "Streetscape beautification, community branding, wayfinding/informational devices, public art" },
    ],
    relatedApplications: ["community-branding", "crosswalks", "playgrounds"],
  },
  {
    name: "MMAX",
    slug: "mmax",
    shortDesc: "MMA resin \u2014 advanced colour retention for bike and bus lanes",
    imageUrl: "/images/products/mmax/mmax-01.jpg",
    gallery: gallery("mmax", "mmax", 33),
    description: "MMAX\u00ae Methyl Methacrylate (MMA) coloured lane treatment is engineered for bike lanes, bus lanes, and parklets \u2014 ideal for long lane areas under low to high vehicle traffic. Advanced MMA technology provides long-lasting colour retention with exceptional UV resistance. MMAX promotes balanced multimodal transportation networks, meets non-slip requirements for cyclists, and delivers remarkable traction. EF bike lane green meets FHWA chromaticity coordinates for use in bike lanes. Traffic-open in 60 minutes.",
    specs: [
      { label: "Material", value: "Methyl Methacrylate (MMA) resin with hardwearing aggregate and premium pigments" },
      { label: "Colour Retention", value: "Advanced tech \u2014 exceptional UV resistance and long-lasting colour" },
      { label: "Non-Slip", value: "Meets non-slip requirements for cyclists \u2014 remarkable traction" },
      { label: "Compliance", value: "EF bike lane green meets FHWA chromaticity coordinates" },
      { label: "Traffic Open", value: "60 minutes post-application" },
      { label: "Applications", value: "Bike lanes, bus lanes, parklets, long lane delineation" },
    ],
    relatedApplications: ["bike-lanes", "bus-lanes", "crosswalks"],
  },
  {
    name: "DuraTherm",
    slug: "duratherm",
    shortDesc: "Inset preformed thermoplastic \u2014 no high-point wear, ever",
    imageUrl: "/images/products/duratherm/duratherm-01.jpg",
    gallery: gallery("duratherm", "duratherm", 36),
    description: "DuraTherm\u00ae is a specially formulated preformed thermoplastic set into asphalt pavement using specialized asphalt reheating and printing technology. The inset material means there is no high-point wear and no risk of snowplow shear \u2014 DuraTherm\u00ae retains its attractive appearance for the full life of the asphalt surface. Engineered for Canadian winter operations where snowplow contact is a constant reality, DuraTherm\u00ae solves the failure mode that plagues surface-applied markings.",
    specs: [
      { label: "Material", value: "Specially formulated preformed thermoplastic \u2014 inset application" },
      { label: "Installation", value: "Specialized asphalt reheating and printing technology" },
      { label: "Winter Performance", value: "No high-point wear, no snowplow shear risk" },
      { label: "Durability", value: "Retains appearance for the full life of the asphalt surface" },
      { label: "Applications", value: "Streetscape beautification, community branding, level traffic calming devices, parking lot hardscapes" },
    ],
    relatedApplications: ["crosswalks", "parking-lots", "community-branding"],
  },
  {
    name: "DuraShield",
    slug: "durashield",
    shortDesc: "Protective two-part pavement coating \u2014 asphalt and colour in one",
    imageUrl: "/images/products/durashield/durashield-01.jpg",
    gallery: gallery("durashield", "durashield", 10),
    description: "DuraShield penetrating asphalt rejuvenator and protective seal coat. Documented 3-5 year lifespan extension at a fraction of replacement cost. Two-part system available in standard and Solar Gray formulations, DuraShield delivers both protective and aesthetic benefits in a single application.",
    specs: [
      { label: "Type", value: "Penetrating asphalt rejuvenator + seal coat" },
      { label: "Coverage", value: "100-150 sq ft per gallon" },
      { label: "Penetration Depth", value: "6-12mm" },
      { label: "Dry Time", value: "4-8 hours" },
      { label: "Traffic Open", value: "24 hours" },
      { label: "Lifespan Extension", value: "3-5 years documented" },
    ],
    relatedApplications: ["private-driveways", "parking-lots", "parks-paths"],
  },
  {
    name: "AirMark",
    slug: "airmark",
    shortDesc: "FAA-grade clarity. Field-proven performance.",
    imageUrl: "/images/products/airmark/airmark-01.jpg",
    gallery: gallery("airmark", "airmark", 22),
    description: "AirMark: preformed thermoplastic airfield markings meeting aviation marking standards. Premium retroreflectivity. Outlast painted alternatives by 4:1.",
    specs: [
      { label: "Standard", value: "Meets aviation airfield marking standards" },
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Retroreflectivity", value: "Premium glass bead surface" },
      { label: "Colour", value: "White and yellow" },
      { label: "Service Life", value: "4x painted alternatives" },
      { label: "Installation", value: "Heat application - certified crews" },
    ],
    relatedApplications: ["regulatory-markings"],
  },
  {
    name: "PreMark",
    slug: "premark",
    shortDesc: "Aggregate-reinforced 90 mil \u2014 built for vehicular traffic zones",
    imageUrl: "/images/products/premark/premark-01.jpg",
    gallery: gallery("premark", "premark", 11),
    description: "PreMark\u00ae is a durable preformed thermoplastic marking material engineered for roadway areas subjected to vehicular traffic. Aggregate reinforced at 90 mil thick with fast installation, PreMark\u00ae can incorporate integrated retroreflective icons including bike symbols and chevrons. Colour stable with >60 BPN slip resistance, it adheres to both asphalt and concrete surfaces. The gold standard for conflict point treatments, intersections, bike boxes, and bike panels under demanding vehicle traffic. PreMark\u00ae installations have proven 11+ year field performance \u2014 including Dunsmuir Street in Downtown Vancouver.",
    specs: [
      { label: "Material", value: "Aggregate-reinforced preformed thermoplastic" },
      { label: "Thickness", value: "90 mil" },
      { label: "Slip Resistance", value: ">60 BPN" },
      { label: "Retroreflective Icons", value: "Integrated bike symbols, chevrons available" },
      { label: "Adhesion", value: "Asphalt and concrete surfaces" },
      { label: "Applications", value: "Spot conflict point treatments, intersections, bike boxes, bike panels under vehicle traffic" },
      { label: "Field Proof", value: "11-year-old installation, Dunsmuir Street, Downtown Vancouver" },
    ],
    relatedApplications: ["crosswalks", "regulatory-markings", "parking-lots", "bike-lanes", "bus-lanes"],
  },
];
