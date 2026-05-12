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
  // Overrides the hero eyebrow on /products/[slug] (which otherwise falls back to taxonomy).
  eyebrow?: string;
  // SEO overrides ported from old hubss.com — preserves keyword targeting + rankings on launch.
  // When present, these win over auto-generated title/description in buildMetadata.
  seoTitle?: string;
  seoDescription?: string;
}

function gallery(slug: string, dir: string, count: number, ext: string = "jpg"): string[] {
  return Array.from({ length: count }, (_, i) =>
    `/images/products/${dir}/${slug}-${String(i + 1).padStart(2, "0")}.${ext}`
  );
}

export const products: Product[] = [
  // ── Flagship Group ─────────────────────────────────────────────────────────────────────────────────────
  {
    name: "TrafficPatternsXD",
    slug: "traffic-patterns-xd",
    seoTitle: "TrafficPatternsXD — Heavy-Duty Decorative Pavement Markings",
    seoDescription: "Get extra durability and a bold look with TrafficPatternsXD — a heavy-duty, decorative pavement marking system for high-traffic areas, BRT corridors, and intersections.",
    shortDesc: "Stamped asphalt with aggregate-reinforced preformed thermoplastic.",
    imageUrl: "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
    gallery: [1,2,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,129,130,133,136,139,143].map(n =>
      `/images/products/traffic-patterns-xd/traffic-patterns-xd-${String(n).padStart(2, "0")}.jpg`),
    description: "TrafficPatternsXD is a thermoplastic surface system designed for high-traffic decorative pavement applications. Aggregate is integrally bound within the thermoplastic, delivering enhanced skid resistance and surface durability under the heaviest pedestrian and vehicular use. Heat-fused permanently to asphalt or concrete, the system pairs the aesthetic of stamped patterns with the longevity expected of preformed thermoplastic — specified by Canadian municipalities and transit authorities coast to coast for crosswalks, BRT corridors, plazas, and high-volume intersections.",
    specs: [
      { label: "Material", value: "Aggregate-reinforced preformed thermoplastic" },
      { label: "Thickness", value: "150mil" },
      { label: "Aggregate", value: "Crushed aggregate reinforced" },
      { label: "Skid Resistance", value: "High — aggregate-reinforced surface" },
      { label: "Retroreflectivity", value: "Glass beads embedded through full cross-section" },
      { label: "Service Life", value: "Engineered for high-volume traffic — multi-year service" },
      { label: "Specification", value: "Specified by Canadian municipalities coast to coast" },
    ],
    relatedApplications: ["crosswalks", "bike-lanes", "bus-lanes"],
  },
  {
    name: "TrafficPatterns",
    slug: "traffic-patterns",
    shortDesc: "Specified for crosswalks, parks, schools, public spaces and multiple other applications used across Canadian municipalities coast to coast.",
    imageUrl: "/images/products/traffic-patterns/traffic-patterns-01.jpg",
    gallery: gallery("traffic-patterns", "traffic-patterns", 86),
    description: "Factory-manufactured 125mil preformed thermoplastic, heat-fused to asphalt or concrete. Retroreflective glass beads embedded through the full cross-section, holding nighttime visibility as the surface wears. Open to traffic within hours of installation. Withstands snowplow blades, de-icing chemicals, and Canadian freeze-thaw cycling. Holds retroreflectivity for years where conventional traffic paint typically requires repainting in a year or less. Specified for crosswalks, parks, schools, public spaces, and regulatory markings by Canadian municipalities coast to coast.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "125mil standard" },
      { label: "Retroreflectivity", value: "Glass beads embedded through full cross-section" },
      { label: "Temperature Range", value: "Performs in Canadian climate extremes" },
      { label: "Installation", value: "Heat application — open to traffic in hours" },
      { label: "Service Life", value: "Multi-year — outlasts traffic paint by orders of magnitude" },
      { label: "Specification", value: "Specified by Canadian municipalities coast to coast" },
    ],
    // bike-lanes removed per Doug's review — TrafficPatterns is not used in bike-lane installations.
    relatedApplications: ["crosswalks", "bus-lanes", "parking-lots"],
  },
  {
    name: "StreetBond",
    slug: "streetbond",
    seoTitle: "StreetBond® — Durable Asphalt Coatings for Safer Streets",
    seoDescription: "StreetBond is a high-quality pavement coating system that transforms ordinary asphalt and concrete surfaces into vibrant, durable, and functional surfaces for streets, commercial spaces, and public facilities.",
    shortDesc: "Coloured coatings for Canadian applications. Bold. Tough. Engineered for Canada.",
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
    description: "StreetBond is a high-quality, innovative pavement coating system designed to transform ordinary asphalt and concrete surfaces into vibrant, visually stunning, and functional surfaces in commercial spaces, public facilities, residential neighbourhoods, and urban streetscapes. With StreetBond, you can unleash your creativity to design truly unique and captivating surfaces that leave a lasting impression on both asphalt and concrete. Specified by Canadian municipalities and transportation authorities coast to coast.",
    specs: [
      { label: "Type", value: "Acrylic coloured pavement coating" },
      { label: "Surfaces", value: "Asphalt and concrete (acid-etched)" },
      { label: "Flexibility", value: "Moves with pavement — will not peel or crack" },
      { label: "UV Stability", value: "Colour-fast acrylic formula" },
      { label: "Coverage", value: "30–50 sq ft per gallon" },
      { label: "Dry Time", value: "2–4 hours" },
      { label: "Colour Matching", value: "Full Pantone custom matching available" },
      { label: "Specification", value: "Specified by Canadian municipalities and DOT authorities" },
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
    seoTitle: "StreetPrint® — Stamped Asphalt Solutions for Urban Design",
    seoDescription: "StreetPrint is a state-of-the-art decorative pavement solution that combines the durability of asphalt with the aesthetics of brick, stone, or custom designs.",
    shortDesc: "Genuine Stamped Asphalt.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [1,3,5,7,9,10,11,13,15,17,19,21,23,25,27,29,31,32,33,35,37,39,41,43,45,47,49,51,53,55,56,57,59,61,63,65,67,69,71,73,75,77,79,80,81,83,85,87,89,91].map(n =>
      `/images/products/streetprint/streetprint-${String(n).padStart(2, "0")}.jpg`),
    // TODO: doug-review — Doug's reviewer note ended mid-sentence ("after final....").
    // Leaving current description in place until Vernon completes Doug's thought.
    description: "In-place asphalt stamping system, sealed with StreetBond UV-stable acrylic colour. Stamps brick, cobblestone, slate, herringbone, fan, and custom patterns directly into new or existing asphalt before final compaction. Flush surface with no raised edges, no shear risk under plows, and no joints to weed. 12+ standard patterns plus fully custom designs. Installed by certified HUB applicators across Canada for crosswalks, plazas, intersections, and driveways.",
    specs: [
      { label: "System", value: "In-place asphalt stamping + StreetBond coating" },
      { label: "Patterns", value: "12+ standard patterns, custom available" },
      { label: "Colour Coat", value: "StreetBond UV-stable acrylic" },
      { label: "Base", value: "New lay or existing asphalt" },
      { label: "Snowplow Safe", value: "Yes — flush surface, no raised edges" },
      { label: "Applications", value: "Intersections, plazas, driveways, crosswalks" },
    ],
    // brandLogo: logo file not yet uploaded — omit to avoid broken image
    relatedApplications: ["crosswalks", "private-driveways", "community-branding", "parking-lots"],
  },

  // ── Specialty & Regulatory Group ───────────────────────────────────────────────────────────────────────────────────────────────────────────
  {
    name: "DecoMark",
    slug: "decomark",
    seoTitle: "DecoMark — Custom Horizontal Graphics and Wayfinding",
    seoDescription: "Elevate your brand with durable custom horizontal graphics, civic art, and pavement wayfinding solutions.",
    shortDesc: "Custom-graphic preformed thermoplastic for wayfinding, public art, schools, and parks.",
    imageUrl: "/images/products/decomark/decomark-01.jpg",
    gallery: gallery("decomark", "decomark", 78),
    description: "Custom-graphic preformed thermoplastic for civic murals, Indigenous art, neighbourhood identity, school zone graphics, and large-format public art. Components are fabricated in our state-of-the-art production facility to your design, then heat-fused to asphalt or concrete. Dimensional precision and print-grade colour accuracy. Withstands snowplow cycles, de-icing chemicals, and multi-year traffic loads.",
    specs: [
      { label: "System", value: "Precision preformed thermoplastic components" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Design", value: "Custom artwork — vector files accepted" },
      { label: "Installation", value: "Certified HUB applicators" },
      { label: "Service Life", value: "Multi-year service in municipal use" },
      { label: "Min. Order", value: "Project-based" },
    ],
    // Updated per Doug: DecoMark used for wayfinding/public art/schools/parks, not crosswalks.
    relatedApplications: ["community-branding", "public-art", "playgrounds", "parks-paths"],
  },
  {
    name: "MMAX",
    slug: "mmax",
    shortDesc: "MMA resin coating. 30–60 min cure. Engineered for transit lanes and bike priority corridors.",
    imageUrl: "/images/products/mmax/mmax-01.jpg",
    gallery: gallery("mmax", "mmax", 33),
    // TODO: doug-review — Doug noted "+3°C at best. need to check spec's" on temperature.
    // Current copy says "2°C and rising" which is the conservative industry-typical MMA min.
    // Vernon to confirm the specific MMAX TDS value (likely +3°C, +5°C, or similar).
    description: "Methyl methacrylate (MMA) resin coating that cures to traffic-ready in 30–60 minutes, enabling overnight installation in active transit corridors. High bond strength under shear loading at bus stops and turning radii. Applies in cool conditions per manufacturer TDS. Specified for red bus lanes, green bike lanes, and transit-priority corridors where short cure windows and bond strength above acrylic and epoxy alternatives are required.",
    specs: [
      { label: "Material", value: "Methyl Methacrylate (MMA) resin" },
      { label: "Cure Time", value: "30–60 minutes (traffic-ready)" },
      { label: "Bond Strength", value: "High — exceeds typical acrylic/epoxy systems" },
      { label: "Thickness", value: "1.5–3mm applied for coloured lane treatment" },
      { label: "Min. Temp", value: "Cool-weather application — per manufacturer TDS" },
      { label: "UV Stability", value: "Colour-fast acrylic-MMA chemistry" },
      { label: "Service Life", value: "Multi-year service in transit lane use" },
    ],
    relatedApplications: ["bike-lanes", "bus-lanes", "crosswalks"],
  },
  {
    name: "StreetBondSR",
    slug: "streetbondsr",
    seoTitle: "StreetBondSR™ — Solar Reflective Asphalt Coatings",
    seoDescription: "Solar reflective, LEED-aligned coatings for asphalt and concrete that reduce urban heat island effect and support sustainable hardscape design across Canada.",
    shortDesc: "Solar reflective acrylic coating. High SRI. LEED-eligible.",
    imageUrl: "/images/products/streetbondsr/streetbondsr-02.jpg",
    gallery: [
      "/images/products/streetbondsr/streetbondsr-01.png",
      "/images/products/streetbondsr/streetbondsr-02.jpg",
      "/images/products/streetbondsr/streetbondsr-05.jpg",
      "/images/products/streetbondsr/streetbondsr-07.jpg",
      "/images/products/streetbondsr/streetbondsr-08.jpg",
    ],
    description: "Solar reflective acrylic pavement coating engineered for surface temperature reduction. Reflects solar radiation off the pavement, lowering surface temperature relative to dark asphalt and mitigating urban heat island effects. Initial Solar Reflectance ≥ 0.33, meeting the LEED v4 SS Credit: Heat Island Reduction threshold for non-roof hardscape. Same flexible chemistry and adhesion characteristics as StreetBond. Available in a curated palette of SRI-optimized tones with full custom Pantone matching.",
    specs: [
      { label: "Type", value: "Solar reflective acrylic pavement coating" },
      { label: "LEED Credit", value: "Contributes to SS Credit: Heat Island Reduction (v4)" },
      { label: "Initial Solar Reflectance", value: "≥ 0.33 (meets LEED threshold)" },
      { label: "Heat Mitigation", value: "Reduces surface temperature vs. standard coatings" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Coverage", value: "30–50 sq ft per gallon" },
      { label: "Dry Time", value: "2–4 hours" },
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
    seoTitle: "DuraTherm — Inlaid Pavement Markings for Snowplow-Safe Crosswalks",
    seoDescription: "Maximize safety and visibility with DuraTherm — inlaid, preformed thermoplastic markings that survive winter maintenance with no raised edge for plow blades.",
    shortDesc: "Inlaid flush-mount thermoplastic. Zero plow profile.",
    imageUrl: "/images/products/duratherm/duratherm-01.jpg",
    gallery: gallery("duratherm", "duratherm", 36),
    description: "Inlaid flush-mount preformed thermoplastic, embedded into a milled groove in the asphalt surface so the marking sits level with the surrounding road. Zero raised edges, zero profile for plow blades, no shear risk through Canadian winter maintenance cycles. Custom artwork, logos, and wayfinding graphics fabricated to vector specifications.",
    specs: [
      { label: "Installation", value: "Inlaid into milled groove — flush with surface" },
      { label: "Profile", value: "Zero edge — road surface level" },
      { label: "Snowplow Safe", value: "Yes — no shear risk" },
      { label: "Bond", value: "Heat-fused to milled asphalt substrate" },
      { label: "Designs", value: "Custom artwork accepted" },
      { label: "Service Life", value: "Multi-year — outlasts painted markings" },
    ],
    relatedApplications: ["crosswalks", "parking-lots", "community-branding"],
  },
  {
    name: "DuraShield",
    slug: "durashield",
    shortDesc: "Two-component asphalt pavement maintenance coating. Solar-reflective grey for pedestrian areas and local residential roadways.",
    imageUrl: "/images/products/durashield/durashield-01.jpg",
    gallery: gallery("durashield", "durashield", 10),
    description: "Formulated for use as an asphalt pavement maintenance coating, DuraShield is a two-component waterborne epoxy-modified acrylic grey color that provides durable aesthetics in pedestrian areas and local residential roadways. DuraShield SR Grey provides a solar reflectance of 0.34, which helps cool pavement surfaces and protect the substrate by reducing the damaging effects of heat and UV exposure. Cooler pavement surface temperatures can also help mitigate urban heat island effects. With low volatile organic content (VOC), DuraShield meets Southern California Air Quality Management District (SCAQMD) regulations. DuraShield also helps protect the substrate from the damaging effects of exposure to chemicals like fuel, oil and deicing agents.",
    specs: [
      { label: "Type", value: "Two-component waterborne epoxy-modified acrylic coating" },
      { label: "Surface", value: "Asphalt pavement maintenance coating" },
      { label: "Colour", value: "Grey (SR 0.34 solar reflectance)" },
      { label: "VOC", value: "Low — meets SCAQMD regulations" },
      { label: "Chemical Resistance", value: "Fuel, oil, deicing agents" },
      { label: "Use Case", value: "Pedestrian areas, local residential roadways, urban heat island mitigation" },
    ],
    relatedApplications: ["private-driveways", "parking-lots", "parks-paths"],
  },
  {
    name: "AirMark",
    slug: "airmark",
    seoTitle: "AirMark — Advanced Airport Pavement Markings",
    seoDescription: "AirMark is an advanced, high-quality airport pavement markings system specifically designed for taxiways, aprons, and other non-runway aviation applications.",
    shortDesc: "Preformed thermoplastic for non-runway airfield markings. Used in Canada's busiest airports.",
    imageUrl: "/images/products/airmark/airmark-01.jpg",
    gallery: gallery("airmark", "airmark", 22),
    description: "Withstands jet blast, snow clearing operations, rubber removal treatments, and maintains visibility year after year.",
    specs: [
      { label: "Application", value: "Taxiways, aprons, helipads, non-runway airfield surfaces" },
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Retroreflectivity", value: "Full-depth glass bead construction" },
      { label: "Colour", value: "White and yellow" },
      { label: "Service Life", value: "Multi-year — significantly outlasts paint" },
      { label: "Installation", value: "Heat application — certified crews" },
    ],
    relatedApplications: ["regulatory-markings"],
  },
  {
    name: "PreMark",
    slug: "premark",
    seoTitle: "PreMark — Long-Lasting, High-Visibility Pavement Markings",
    seoDescription: "Long-lasting, high-visibility preformed thermoplastic pavement markings for enhanced safety — arrows, stop bars, school zones, and regulatory symbols.",
    shortDesc: "Preformed thermoplastic symbols and legends. Drive-on installation.",
    imageUrl: "/images/products/premark/premark-01.jpg",
    gallery: gallery("premark", "premark", 11),
    description: "Library of preformed thermoplastic road marking symbols — turn arrows, stop bars, yield triangles, school zone legends, bike pictograms and bike lane markings, accessible parking symbols, and crosswalk ladder lines. Pre-cut to specification, heat-applied, and drive-on immediately. No stencil prep, no curing window. 125mil standard thickness, with a 90mil ViziGrip option for lighter-duty applications. Holds retroreflectivity for years where painted symbols typically require annual repainting.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "125mil standard / 90mil ViziGrip option" },
      { label: "Service Life", value: "Multi-year service in heavy municipal use" },
      { label: "Curing", value: "No cure time — heat-applied, drive-on immediately" },
      { label: "Retroreflectivity", value: "Premium glass bead surface" },
    ],
    relatedApplications: ["crosswalks", "regulatory-markings", "parking-lots", "bike-lanes", "bus-lanes"],
  },


  // ── Asphalt Repair ────────────────────────────────────────────────────────────────────────────────────
  {
    name: "Fast Patch",
    slug: "fast-patch",
    eyebrow: "Concrete and Asphalt Repair",
    shortDesc: "Permanent concrete and asphalt repair. Traffic-ready in less than an hour.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [],
    description: "FastPatch DPR is a permanent concrete and asphalt repair system engineered for high-strength, fast-return-to-service repair of potholes, spalls, joints, and utility cuts. Two-component polyurethane chemistry mixes on-site and applies cold — no heating, no compaction equipment, no extended lane closures. Bonds chemically to the surrounding asphalt or concrete substrate and is traffic-ready in less than an hour. Used by Canadian municipalities, maintenance contractors, and industrial facilities where downtime is not an option. Manufacturer source: fastpatchsystems.com/fastpatch-dpr/",
    specs: [
      { label: "Type", value: "Two-component polyurethane hybrid" },
      { label: "Application", value: "Cold mix — no heating required" },
      { label: "Cure Time", value: "Traffic-ready in less than an hour" },
      { label: "Bond", value: "Direct chemical bond to existing asphalt and concrete" },
      { label: "Substrate", value: "Concrete and asphalt — potholes, spalls, joints, utility cuts" },
      { label: "Service Life", value: "Significantly outlasts conventional cold-mix repair" },
      { label: "Coverage", value: "1 unit covers approximately 0.1 m³ of repair volume" },
    ],
    relatedApplications: ["private-driveways", "parking-lots", "parks-paths", "commercial-spaces"],
  },
  {
    name: "Aquaphalt",
    slug: "aquaphalt",
    shortDesc: "Water-activated cold-mix repair. Solvent-free, no heat required.",
    imageUrl: "/images/products/streetprint/streetprint-40.jpg",
    gallery: [],
    description: "Water-activated permanent cold-mix asphalt repair for potholes, utility cuts, valve adjustments, and edge joints. Applied cold and activated with water — no mixing, no heating, no specialty equipment. Solvent-free formulation with low odour profile, making it suitable for underground parkades, occupied spaces, hospital campuses, and school zones. Bonds permanently to asphalt and concrete on contact. Open to traffic immediately after compaction. In service in municipalities and facility programs around the world.",
    specs: [
      { label: "Type", value: "Water-activated permanent cold-mix" },
      { label: "Application", value: "No heat, no mixing, no special equipment" },
      { label: "Activation", value: "Water — potable or grey water" },
      { label: "VOC Profile", value: "Solvent-free formulation, low odour" },
      { label: "Open to Traffic", value: "Immediately after compaction" },
      { label: "Shelf Life", value: "1 year in sealed packaging" },
      { label: "Bond", value: "Permanent adhesion to asphalt and concrete" },
    ],
    relatedApplications: ["private-driveways", "parking-lots", "parks-paths", "commercial-spaces"],
  },
];
