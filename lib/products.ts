export interface Product {
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  imageUrl: string;
  gallery?: string[];
  specs: { label: string; value: string }[];
  relatedApplications: string[];
  colourCollections?: { name: string; hex: string }[];
  brandLogo?: { src: string; alt: string; width: number; height: number; };
  comingSoon?: boolean;
}

function gallery(slug: string, dir: string, count: number, ext: string = "jpg"): string[] {
  return Array.from({ length: count }, (_, i) =>
    `/images/products/${dir}/${slug}-${String(i + 1).padStart(2, "0")}.${ext}`
  );
}

export const products: Product[] = [
  // ── Flagship Group ────────────────────────────────────────────────────────────────────────
  {
    name: "TrafficPatternsXD",
    slug: "traffic-patterns-xd",
    shortDesc: "Heavy-duty thermoplastic for BRT corridors and high-volume intersections.",
    imageUrl: "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
    gallery: [1,2,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,129,130,133,136,139,143].map(n =>
      `/images/products/traffic-patterns-xd/traffic-patterns-xd-${String(n).padStart(2, "0")}.jpg`),
    description: "When bus wheels turn 30,000 times a day through the same intersection, the pavement marking has one job: hold. TrafficPatternsXD is HUB's most durable thermoplastic — 150mil of aggregate-reinforced preformed material engineered specifically for BRT corridors, high-frequency transit stops, and intersection conflict zones. BPN 65+ certified skid resistance provides measurable safety performance where wet-weather traction is non-negotiable. Unlike painted markings that chalk and fade under seasonal stress, TrafficPatternsXD fuses to the road surface and outlasts paint season after season with no repainting required. Specified by Canadian transit authorities and municipalities who need infrastructure that performs as hard as the routes it serves.",
    specs: [
      { label: "Material", value: "Aggregate-reinforced preformed thermoplastic" },
      { label: "Thickness", value: "150mil" },
      { label: "Aggregate", value: "Crushed aggregate reinforced" },
      { label: "Skid Resistance", value: "BPN 65+" },
      { label: "Retroreflectivity", value: "ASTM D4956 Type III" },
      { label: "Service Life", value: "Outlasts paint season after season in high-volume use" },
      { label: "Specification", value: "Specified by Canadian municipalities coast to coast" },
    ],
    relatedApplications: ["crosswalks", "bike-lanes", "bus-lanes"],
  },
  {
    name: "TrafficPatterns",
    slug: "traffic-patterns",
    shortDesc: "Preformed thermoplastic road markings that outlast paint by seasons, not months.",
    imageUrl: "/images/products/traffic-patterns/traffic-patterns-01.jpg",
    gallery: gallery("traffic-patterns", "traffic-patterns", 86),
    description: "Paint crews come back every spring. TrafficPatterns doesn't ask them to. Factory-manufactured preformed thermoplastic road markings — crosswalk bars, stop lines, bicycle symbols, stencils — that heat-fuse permanently to asphalt and concrete, eliminating the repainting cycle that drains municipal maintenance budgets year after year. Manufactured to 90mil thickness with ASTM D4956 Type III retroreflective glass beads embedded through the full cross-section, not just the surface, TrafficPatterns stays visible after the top layer wears. It opens to traffic within hours of installation, survives snowplow blades, de-icing salts, and Canadian freeze-thaw cycles that fracture surface paint. Specified by municipalities from Halifax to Vancouver for crosswalks, bike lanes, and regulatory markings where long-term performance matters more than lowest initial bid.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "90mil standard" },
      { label: "Retroreflectivity", value: "ASTM D4956 Type III glass beads" },
      { label: "Temperature Range", value: "-40C to +60C in service" },
      { label: "Installation", value: "Heat application - open to traffic in hours" },
      { label: "Service Life", value: "Multi-season — eliminates annual repainting cycles" },
      { label: "Specification", value: "Specified by Canadian municipalities coast to coast" },
    ],
    relatedApplications: ["crosswalks", "bike-lanes", "bus-lanes", "parking-lots"],
  },
  {
    name: "StreetBond",
    slug: "streetbond",
    shortDesc: "Coloured pavement coating that moves with asphalt and never peels.",
    imageUrl: "/images/products/streetbond/streetbond-01.png",
    gallery: [
      // Product renders
      "/images/products/streetbond/streetbond-01.png",
      "/images/products/streetbond/streetbond-02.png",
      "/images/products/streetbond/streetbond-04.png",
      "/images/products/streetbond/streetbond-06.png",
      // Installation photos — early range (every 3rd)
      ...[9,12,15,18,21,24,27,30,33,36,40,45,50,55].map(n =>
        `/images/products/streetbond/streetbond-${String(n).padStart(2, "0")}.jpg`),
      // Installation photos — latest batch
      ...[80,81,82,83,84,85,86,87,88,89,90,91,92,93,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112].map(n =>
        `/images/products/streetbond/streetbond-${n}.jpg`),
    ],
    description: "Most coloured pavement coatings look vivid in the sales brochure and embarrassing by the third winter. StreetBond is different — a flexible acrylic formulation engineered to move with the asphalt beneath it, bonding at the molecular level rather than sitting on top. It will not peel, chip, or delaminate through the freeze-thaw cycles that destroy rigid coatings. Available in an extensive standard palette and fully custom Pantone-matched colours, StreetBond transforms existing asphalt into bike lanes, bus priority zones, crosswalks, decorative plazas, and branded driveways. Used by the BC Ministry of Transportation and municipalities across Canada. If the colour needs to last and the surface is asphalt, StreetBond is the specification.",
    specs: [
      { label: "Type", value: "Acrylic coloured pavement coating" },
      { label: "Surfaces", value: "Asphalt and concrete (acid-etched)" },
      { label: "Flexibility", value: "Moves with pavement - will not peel or crack" },
      { label: "UV Stability", value: "Colour-fast acrylic formula" },
      { label: "Coverage", value: "30-50 sq ft per gallon" },
      { label: "Dry Time", value: "2-4 hours" },
      { label: "Colour Matching", value: "Full Pantone custom matching available" },
      { label: "Specification", value: "BC Ministry of Transportation recognized product" },
    ],
    colourCollections: [
      { name: "Traffic Red", hex: "#C0392B" },
      { name: "Bike Lane Green", hex: "#27AE60" },
      { name: "Sunflower", hex: "#F1C40F" },
      { name: "Pacific Blue", hex: "#2980B9" },
      { name: "Civic Orange", hex: "#E67E22" },
      { name: "Night White", hex: "#F2F2F2" },
    ],
    // brandLogo: logo file not yet uploaded — omit to avoid broken image
    relatedApplications: ["bike-lanes", "bus-lanes", "private-driveways", "parks-paths", "parking-lots"],
  },
  {
    name: "StreetPrint",
    slug: "streetprint",
    shortDesc: "Stamped asphalt that looks like stone — at a fraction of the cost and maintenance.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [1,3,5,7,9,10,11,13,15,17,19,21,23,25,27,29,31,32,33,35,37,39,41,43,45,47,49,51,53,55,56,57,59,61,63,65,67,69,71,73,75,77,79,80,81,83,85,87,89,91].map(n =>
      `/images/products/streetprint/streetprint-${String(n).padStart(2, "0")}.jpg`),
    description: "Cobblestone entry courts. Brick-pattern pedestrian plazas. Heritage-look intersections that make drivers slow down without a speed bump in sight. StreetPrint is HUB's proprietary in-place asphalt stamping system — it works with the asphalt surface already there, impressing stone and tile patterns directly into the material before it sets, then sealing the result with StreetBond UV-stable acrylic colour. No demolition. No concrete pour. No raised edges for snowplows to catch. The same flush surface that lets cyclists and wheelchair users move freely. Available in 12+ standard patterns — fan, cobblestone, herringbone, slate, random stone — and fully custom for landmark projects. Certified HUB applicators install coast to coast. StreetPrint is how architects and planners get the civic richness of natural stone paving without the lifecycle cost of maintaining it.",
    specs: [
      { label: "System", value: "In-place asphalt stamping + StreetBond coating" },
      { label: "Patterns", value: "12+ standard patterns, custom available" },
      { label: "Colour Coat", value: "StreetBond UV-stable acrylic" },
      { label: "Base", value: "New lay or existing asphalt" },
      { label: "Snowplow Safe", value: "Yes - flush surface, no raised edges" },
      { label: "Applications", value: "Intersections, plazas, driveways, crosswalks" },
    ],
    // brandLogo: logo file not yet uploaded — omit to avoid broken image
    relatedApplications: ["crosswalks", "private-driveways", "community-branding", "parking-lots"],
  },

  // ── Specialty & Regulatory Group ───────────────────────────────────────────────────────────────────────────
  {
    name: "DecoMark",
    slug: "decomark",
    shortDesc: "Custom thermoplastic graphics — murals, cultural art, and civic landmarks at street scale.",
    imageUrl: "/images/products/decomark/decomark-01.jpg",
    gallery: gallery("decomark", "decomark", 78),
    description: "A crosswalk is a canvas. DecoMark is how you paint it permanently. Precision preformed thermoplastic components, fabricated to vector artwork and Pantone colour specifications, heat-fused to the road surface to create graphics that survive snowplow cycles, winter salt, and years of traffic without fading or peeling. Used for Pride crosswalks in downtown corridors, Indigenous cultural recognition art in partnership with First Nations, neighbourhood identity installations, school zone graphics, and mural-scale public art that asks the street itself to tell a community's story. If you can design it in a vector file, DecoMark can put it on the road — accurately, durably, and at the scale a city deserves.",
    specs: [
      { label: "System", value: "Precision preformed thermoplastic components" },
      { label: "Colour Range", value: "Full custom Pantone matching" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Design", value: "Custom artwork - vector files accepted" },
      { label: "Installation", value: "Certified HUB applicators" },
      { label: "Service Life", value: "Long-lasting — significantly outlasts paint" },
      { label: "Min. Order", value: "Project-based" },
    ],
    relatedApplications: ["community-branding", "crosswalks", "playgrounds"],
  },
  {
    name: "MMAX",
    slug: "mmax",
    shortDesc: "MMA resin lane coating — traffic-ready in under an hour, even in cold weather.",
    imageUrl: "/images/products/mmax/mmax-01.jpg",
    gallery: gallery("mmax", "mmax", 33),
    description: "Transit agencies can't shut down a bus lane for a full day while a coating cures. MMAX is built around that reality. A methyl methacrylate (MMA) resin system that achieves full cure in 30-60 minutes and reaches traffic-ready hardness before the overnight window closes. Bond strength exceeds 3 MPa — outlasting epoxy and acrylic alternatives in high-shear zones at bus stops and turning radii. Application temperature down to -10°C means installation crews aren't waiting for a weather window that never comes. The go-to specification for coloured bus lanes, protected bike lanes, and transit priority zones where a painted alternative has already failed and the operations team won't accept another temporary fix.",
    specs: [
      { label: "Material", value: "Methyl Methacrylate (MMA) resin" },
      { label: "Cure Time", value: "30-60 minutes (traffic-ready)" },
      { label: "Bond Strength", value: ">3 MPa" },
      { label: "Thickness", value: "1.5-3mm applied" },
      { label: "Min. Temp", value: "-10C application" },
      { label: "UV Stability", value: "High - colour-fast MMA formula resists fading" },
      { label: "Service Life", value: "Long-term service life in transit lane use" },
    ],
    relatedApplications: ["bike-lanes", "bus-lanes", "crosswalks"],
  },
  {
    name: "StreetBondSR",
    slug: "streetbondsr",
    shortDesc: "High-SRI solar reflective coating — urban heat island mitigation that earns LEED credits.",
    imageUrl: "/images/products/streetbondsr/streetbondsr-02.jpg",
    gallery: [
      "/images/products/streetbondsr/streetbondsr-01.png",
      "/images/products/streetbondsr/streetbondsr-02.jpg",
      "/images/products/streetbondsr/streetbondsr-05.jpg",
      "/images/products/streetbondsr/streetbondsr-07.jpg",
      "/images/products/streetbondsr/streetbondsr-08.jpg",
    ],
    description: "Dark pavement absorbs up to 95% of solar radiation, contributing measurably to the urban heat island effect that raises city temperatures, strains cooling infrastructure, and disproportionately impacts vulnerable populations. StreetBondSR is HUB's solar reflective pavement coating — a high Solar Reflectance Index (SRI) formulation that reflects significantly more solar energy than conventional coatings, reducing surface temperatures and contributing to healthier urban microclimates. Qualifies for LEED v4 Sustainable Sites credit for heat island reduction — one of the few paving materials that actively supports green building certification. Available in a curated palette of lighter, SRI-optimized tones and custom Pantone matching. The specification for sustainability-conscious developers, municipalities pursuing climate action plans, and any project team where LEED credits matter to the client.",
    specs: [
      { label: "Type", value: "Solar reflective acrylic pavement coating" },
      { label: "LEED Credits", value: "Contributes to sustainable site credits" },
      { label: "Solar Reflectance", value: "High SRI (Solar Reflectance Index)" },
      { label: "Heat Mitigation", value: "Reduces surface temperature vs. standard coatings" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Coverage", value: "30-50 sq ft per gallon" },
      { label: "Dry Time", value: "2-4 hours" },
      { label: "Colour Options", value: "Standard palette + Pantone matching" },
    ],
    colourCollections: [
      { name: "Cool White", hex: "#F5F5F5" },
      { name: "Light Gray", hex: "#D3D3D3" },
      { name: "Tan", hex: "#D2B48C" },
      { name: "Sage", hex: "#9CAF88" },
    ],
    brandLogo: {
      src: "/images/products/streetbondsr/streetbondsr-logo-white.png",
      alt: "StreetBondSR solar reflective coating system by HUB Surface Systems",
      width: 280,
      height: 80,
    },
    relatedApplications: ["parking-lots", "private-driveways", "parks-paths", "community-branding"],
  },
  {
    name: "DuraTherm",
    slug: "duratherm",
    shortDesc: "Inlaid thermoplastic — flush to the road surface, invisible to snowplows.",
    imageUrl: "/images/products/duratherm/duratherm-01.jpg",
    gallery: gallery("duratherm", "duratherm", 36),
    description: "Every raised pavement marking is a liability when the snowplow comes through. DuraTherm eliminates the problem entirely — an inlaid flush-mount thermoplastic system embedded into the asphalt surface at road level, with zero profile above grade. No shear edge. No trip hazard. No seasonal damage from winter maintenance equipment. Custom artwork, logos, and wayfinding graphics are precision-fabricated and set directly into the asphalt matrix, fusing below the road surface plane rather than sitting on top of it. The result is permanent graphic inlay that survives plowing, sanding, and de-icing indefinitely. The preferred specification wherever surface graphics must coexist with heavy winter maintenance or high pedestrian traffic.",
    specs: [
      { label: "Installation", value: "Inlaid flush-mount - embedded in asphalt" },
      { label: "Profile", value: "Zero edge - road surface level" },
      { label: "Snowplow Safe", value: "Yes - no shear risk" },
      { label: "Bond", value: "Full-depth asphalt integration" },
      { label: "Designs", value: "Custom artwork accepted" },
      { label: "Service Life", value: "Long-term — outlasts surface paint significantly" },
    ],
    relatedApplications: ["crosswalks", "parking-lots", "community-branding"],
  },
  {
    name: "DuraShield",
    slug: "durashield",
    shortDesc: "Penetrating asphalt rejuvenator — extend pavement life for a fraction of replacement cost.",
    imageUrl: "/images/products/durashield/durashield-01.jpg",
    gallery: gallery("durashield", "durashield", 10),
    description: "Asphalt oxidizes. The oils that give it flexibility migrate over time, leaving a brittle, grey surface that cracks under load and lets water in. Once water gets in, freeze-thaw takes over — and what was a maintenance problem becomes a replacement project. DuraShield is a penetrating asphalt rejuvenator that reverses this process: penetrating 6-12mm into the surface, replenishing the maltene fraction, restoring flexibility, and sealing the top against water infiltration. Applied as part of a proactive maintenance program, DuraShield meaningfully extends pavement service life at a fraction of the cost of mill-and-overlay. The rational choice for municipalities, property managers, and facility teams that would rather maintain a surface than replace it.",
    specs: [
      { label: "Type", value: "Penetrating asphalt rejuvenator + seal coat" },
      { label: "Coverage", value: "100-150 sq ft per gallon" },
      { label: "Penetration Depth", value: "6-12mm" },
      { label: "Dry Time", value: "4-8 hours" },
      { label: "Traffic Open", value: "24 hours" },
      { label: "Lifespan Extension", value: "Significant documented extension vs. untreated" },
    ],
    relatedApplications: ["private-driveways", "parking-lots", "parks-paths"],
  },
  {
    name: "AirMark",
    slug: "airmark",
    shortDesc: "Preformed thermoplastic airfield markings — precision-formed, certified, and built to outlast paint.",
    imageUrl: "/images/products/airmark/airmark-01.jpg",
    gallery: gallery("airmark", "airmark", 22),
    description: "Airfield markings are safety-critical — precision, visibility, and permanence are not negotiable. AirMark preformed thermoplastic airfield markings are engineered to airfield marking standards, delivering consistent dimensional accuracy, premium retroreflectivity through full-depth glass bead construction, and a service life that significantly outlasts painted alternatives. Heat-applied by certified crews, AirMark fuses directly to asphalt and concrete airfield surfaces without curing delay. The choice for airports and aerodrome operators who need markings that hold their specification year-round, not just in the season they were installed.",
    specs: [
      { label: "Standard", value: "Aviation airfield marking standards" },
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
    shortDesc: "Preformed thermoplastic road marking symbols — pre-cut, ready to apply, no stencils required.",
    imageUrl: "/images/products/premark/premark-01.jpg",
    gallery: gallery("premark", "premark", 11),
    description: "Painted road symbols need stencils, dry time, and a crew back on site every season. PreMark needs none of that. A complete library of preformed thermoplastic road marking symbols — turn arrows, stop bars, yield lines, school zone legends, bike pictographs, accessible parking symbols, and more — pre-cut to specification and ready to apply with heat. Open to traffic immediately after application. No stencil prep, no overnight curing window, no messy overspray. Standard 90mil thickness for typical applications; 125mil heavy-use variant for high-traffic intersections and commercial zones. Premium glass bead retroreflectivity built into the surface holds nighttime visibility season after season without the fade that makes painted symbols invisible in rain.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "90mil standard / 125mil heavy-use" },
      { label: "Service Life", value: "Multi-season service life in heavy municipal use" },
      { label: "Curing", value: "No cure time — heat-applied, drive-on immediately" },
      { label: "Retroreflectivity", value: "Premium glass bead surface" },
    ],
    relatedApplications: ["crosswalks", "regulatory-markings", "parking-lots", "bike-lanes", "bus-lanes"],
  },


  // ── Asphalt Repair ────────────────────────────────────────────────────────────────────────────
  {
    name: "Fast Patch",
    slug: "fast-patch",
    shortDesc: "Two-component polyurethane pothole repair — permanent bond, open to traffic in 30 minutes.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [],
    description: "Temporary cold-patch is a placeholder, not a repair — you're back filling the same pothole next season. FastPatch is different: a two-component polyurethane hybrid that chemically bonds to the existing asphalt substrate, curing to a rigid, traffic-bearing surface in 30 minutes without heat, compaction equipment, or specialty crew. Applied cold and mixed on-site, it works at temperatures from -10°C to +40°C, fits into a single-lane closure window, and outlasts conventional patching methods by a measurable margin. For municipalities and contractors who are done treating the same failures repeatedly, FastPatch closes the pothole — and keeps it closed.",
    specs: [
      { label: "Type", value: "Two-component polyurethane hybrid" },
      { label: "Application", value: "Cold mix — no heating required" },
      { label: "Cure Time", value: "Open to traffic in 30 minutes" },
      { label: "Bond", value: "Direct chemical bond to existing asphalt and concrete" },
      { label: "Service Life", value: "5x conventional cold-mix repair" },
      { label: "Temperature Range", value: "Applies from -10°C to +40°C" },
      { label: "Coverage", value: "1 unit covers approx. 0.1 m³ of repair volume" },
    ],
    relatedApplications: ["private-driveways", "parking-lots", "parks-paths", "commercial-spaces"],
  },
  {
    name: "Aquaphalt",
    slug: "aquaphalt",
    shortDesc: "Water-activated permanent patch — zero VOCs, no equipment, open to traffic immediately.",
    imageUrl: "/images/products/streetprint/streetprint-40.jpg",
    gallery: [],
    description: "Some repair sites don't allow hot work. Underground parkades, occupied school zones, and hospital campuses can't manage solvent fumes or propane equipment. Aquaphalt was engineered for exactly these environments. A water-activated permanent patching material — zero solvents, zero VOCs, zero hazardous fumes — that fills potholes, utility cuts, and edge joints with a single step: pour, compact, drive. No mixing. No heating. No special equipment beyond what's already on the truck. Bonds permanently to asphalt and concrete on contact and opens to traffic immediately after compaction. Deployed in over 30 countries by maintenance teams who need a repair that works in the conditions they actually work in.",
    specs: [
      { label: "Type", value: "Water-activated permanent cold-mix" },
      { label: "Application", value: "No heat, no mixing, no special equipment" },
      { label: "Activation", value: "Water — potable or grey water" },
      { label: "VOCs", value: "Zero — no solvents, no fumes" },
      { label: "Open to Traffic", value: "Immediately after compaction" },
      { label: "Shelf Life", value: "3 years in sealed packaging" },
      { label: "Bond", value: "Permanent adhesion to asphalt and concrete" },
    ],
    relatedApplications: ["private-driveways", "parking-lots", "parks-paths", "commercial-spaces"],
  },
];
