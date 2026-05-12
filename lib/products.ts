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
  // Hide a product from footer nav while keeping the /products/[slug] page reachable directly.
  hideFromFooter?: boolean;
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

// Product descriptions rewritten from the authoritative old hubss.com product pages and the StreetBond
// manufacturer canonical source. Doug's specific edits are preserved verbatim where they corrected facts
// (DuraShield = coating not penetrating, AirMark non-runway, PreMark 125mil standard, MMAX +3°C and rising,
// TrafficPatterns 125mil, StreetBond legacy HUBSS voice). Related-applications audited against Vernon's
// authoritative mapping — Bike Lanes is MMAX + PreMark only, etc.

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
    description: "TrafficPatternsXD — the XD stands for Extremely Durable — is a decorative pavement marking system engineered for the harshest pedestrian and vehicular conditions. The heavy-duty thermoplastic is reinforced with performance aggregate bound through the full material cross-section, delivering enhanced skid resistance under wet-surface bus traffic, turning movements, and concentrated wheel loads where painted lanes will not survive a single season. Heat-fused permanently to asphalt or concrete, the system pairs the visual richness of stamped patterns with the longevity expected of preformed thermoplastic. Specified by Canadian municipalities and transit authorities coast to coast for crosswalks, BRT corridors, plazas, and high-volume intersections.",
    specs: [
      { label: "Material", value: "Aggregate-reinforced preformed thermoplastic" },
      { label: "Thickness", value: "150mil" },
      { label: "Aggregate", value: "Performance aggregate bound through cross-section" },
      { label: "Skid Resistance", value: "High — aggregate-reinforced surface" },
      { label: "Retroreflectivity", value: "Glass beads embedded through full cross-section" },
      { label: "Service Life", value: "Engineered for high-volume traffic — multi-year service" },
      { label: "Specification", value: "Specified by Canadian municipalities coast to coast" },
    ],
    // Expanded per Vernon's final audit: BRT corridors, high-volume crosswalks, bus priority, intersections, civic plazas.
    relatedApplications: ["crosswalks", "bus-lanes", "pedestrian-safety", "public-spaces", "traffic-calming"],
  },
  {
    name: "TrafficPatterns",
    slug: "traffic-patterns",
    shortDesc: "Specified for crosswalks, parks, schools, public spaces and multiple other applications used across Canadian municipalities coast to coast.",
    imageUrl: "/images/products/traffic-patterns/traffic-patterns-01.jpg",
    gallery: gallery("traffic-patterns", "traffic-patterns", 86),
    description: "TrafficPatterns is a fully customizable preformed thermoplastic pavement marking system — a fusion of performance, aesthetics, and functionality. Factory-manufactured to 125mil and heat-fused to asphalt or concrete, the material is engineered to withstand vehicular and pedestrian traffic, harsh weather, and daily wear with a skid- and slip-resistant surface treatment. Retroreflective glass beads are embedded through the full cross-section, holding nighttime visibility as the surface wears. Open to traffic within hours of installation. Withstands snowplow blades, de-icing chemicals, and Canadian freeze-thaw cycling. Holds retroreflectivity for years where conventional traffic paint typically requires repainting in a year or less. A vast array of customizable designs and colours allows planners, architects, and designers to reflect community character and identity. Specified by Canadian municipalities coast to coast for crosswalks, parks, schools, public spaces, and regulatory markings.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "125mil standard" },
      { label: "Retroreflectivity", value: "Glass beads embedded through full cross-section" },
      { label: "Surface", value: "Skid- and slip-resistant treatment" },
      { label: "Temperature Range", value: "Performs in Canadian climate extremes" },
      { label: "Installation", value: "Heat application — open to traffic in hours" },
      { label: "Service Life", value: "Multi-year — outlasts traffic paint by orders of magnitude" },
      { label: "Specification", value: "Specified by Canadian municipalities coast to coast" },
    ],
    // Expanded per Vernon: crosswalks, parks, schools (→playgrounds), public spaces, parking lots.
    relatedApplications: ["crosswalks", "parks-paths", "playgrounds", "public-spaces", "parking-lots", "pedestrian-safety"],
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
    description: "StreetBond is a high-quality, innovative pavement coating system designed to transform ordinary asphalt and concrete surfaces into vibrant, visually stunning, and functional masterpieces in commercial spaces, public facilities, residential neighbourhoods, and urban streetscapes. The system is engineered to balance flexibility — moving with the pavement as it expands and contracts — with hardness sufficient to resist wear, avoiding three classic failure modes: cracking from excessive hardness, premature wear from excessive flexibility, and slipperiness from overly smooth surfaces. Available in a curated standard palette plus full custom Pantone matching for branded environments. Used for bike lanes, bus priority zones, decorative crosswalks, civic plazas, parks and pathways, and branded driveways. Specified by Canadian municipalities and transportation authorities coast to coast.",
    specs: [
      { label: "Type", value: "Acrylic coloured pavement coating" },
      { label: "Surfaces", value: "Asphalt and acid-etched concrete" },
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
    // Expanded per Vernon: bike lanes, bus lanes, crosswalks, parking lots, pedestrian plazas (public-spaces),
    // driveways, sports surfaces, playgrounds.
    relatedApplications: ["bike-lanes", "bus-lanes", "crosswalks", "parking-lots", "public-spaces", "private-driveways", "sport-courts", "playgrounds", "parks-paths"],
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
    description: "StreetPrint is a state-of-the-art decorative pavement solution combining the durability of asphalt with the aesthetic of brick, stone, slate, herringbone, fan, and fully custom designs. Using a genuine stamped-asphalt technology, patterns are imprinted directly into new or existing asphalt after final compaction, then sealed with StreetBond UV-stable acrylic colour. The finished surface is flush with the surrounding road — no raised edges, no shear risk under plows, no joints to weed — making it structurally compatible with municipal winter maintenance where traditional pavers fail. Available in 12+ standard patterns plus fully custom designs, installed by certified HUB applicators across Canada for driveways, parks and pathways, town home developments, and community-branding streetscapes.",
    specs: [
      { label: "System", value: "In-place asphalt stamping + StreetBond coating" },
      { label: "Patterns", value: "12+ standard patterns, custom available" },
      { label: "Colour Coat", value: "StreetBond UV-stable acrylic" },
      { label: "Base", value: "New lay or existing asphalt" },
      { label: "Snowplow Safe", value: "Yes — flush surface, no raised edges" },
      { label: "Applications", value: "Driveways, parks/paths, plazas, intersections" },
    ],
    // Expanded per Vernon: crosswalks, driveways, plazas (public-spaces), parks/paths, townhomes,
    // heritage districts (community-branding), public art settings.
    relatedApplications: ["crosswalks", "private-driveways", "residential-driveways", "public-spaces", "parks-paths", "townhomes", "community-branding", "public-art", "commercial-spaces"],
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
    description: "DecoMark is a high-performance preformed thermoplastic pavement marking system designed for creating durable and vibrant horizontal markings — surface graphics, logos, wayfinding messages, civic art, and large-format public installations. Components are fabricated in our state-of-the-art production facility to your design specifications, then heat-fused to asphalt or concrete with dimensional precision and print-grade colour accuracy. Weather-resistant and engineered for high-traffic outdoor environments, the system delivers branding and wayfinding messages that remain vibrant and effective for years where painted alternatives fade within a season. Specified for community identity programs, school zones, neighbourhood placemaking, Indigenous public art partnerships, and civic mural installations.",
    specs: [
      { label: "System", value: "Precision preformed thermoplastic components" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Design", value: "Custom artwork — vector files accepted" },
      { label: "Installation", value: "Certified HUB applicators" },
      { label: "Service Life", value: "Multi-year service in municipal use" },
      { label: "Min. Order", value: "Project-based" },
    ],
    // Expanded per Vernon: public art, community branding, wayfinding (public-spaces),
    // schools (playgrounds), parks/paths, crosswalks.
    relatedApplications: ["public-art", "community-branding", "public-spaces", "playgrounds", "parks-paths", "crosswalks"],
  },
  {
    name: "MMAX",
    slug: "mmax",
    shortDesc: "MMA resin coating. 45–60 min cure. Engineered for transit lanes and bike priority corridors.",
    imageUrl: "/images/products/mmax/mmax-01.jpg",
    gallery: gallery("mmax", "mmax", 33),
    description: "MMAX is a Methyl Methacrylate (MMA)-based coloured lane treatment for durable, high-visibility transit and bicycle corridors. Engineered for long-term performance under heavy traffic and extreme weather, the resin cures to traffic-ready in 45–60 minutes — enabling complete overnight installation in active transit corridors without disrupting weekday operations. Embedded aggregates deliver enhanced traction and slip resistance; UV-stable pigments resist fading season after season. Applies in cool weather when ambient is +3°C and rising. Specified for red bus lanes, green bike lanes, transit-priority corridors, and BRT station zones where short cure windows and bond strength above acrylic and epoxy alternatives are required.",
    specs: [
      { label: "Material", value: "Methyl Methacrylate (MMA) resin" },
      { label: "Cure Time", value: "45–60 minutes (traffic-ready)" },
      { label: "Traction", value: "Embedded aggregate — slip-resistant" },
      { label: "Thickness", value: "1.5–3mm applied for coloured lane treatment" },
      { label: "Min. Temp", value: "+3°C and rising" },
      { label: "UV Stability", value: "Colour-fast acrylic-MMA chemistry" },
      { label: "Service Life", value: "Multi-year service in transit lane use" },
    ],
    // Expanded per Vernon: bike lanes, bus lanes, BRT corridors (→bus-lanes also), crosswalks, traffic-calming.
    relatedApplications: ["bike-lanes", "bus-lanes", "crosswalks", "traffic-calming", "pedestrian-safety"],
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
    description: "StreetBondSR is a solar reflective acrylic pavement coating engineered for surface temperature reduction. Reflects solar radiation off the pavement, lowering surface temperature relative to dark asphalt and mitigating urban heat island effects. Initial Solar Reflectance ≥ 0.33, meeting the LEED v4 SS Credit: Heat Island Reduction threshold for non-roof hardscape. Same flexible chemistry and adhesion characteristics as StreetBond. Available in a curated palette of SRI-optimized tones with full custom Pantone matching for projects targeting LEED certification, climate action plan implementation, or sustainability-focused hardscape design.",
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
    // Expanded per Vernon: parking lots, schools (playgrounds), urban heat-island reduction, parks/paths.
    relatedApplications: ["leed-urban-heat-island", "parking-lots", "playgrounds", "parks-paths", "commercial-spaces"],
  },
  {
    name: "DuraTherm",
    slug: "duratherm",
    seoTitle: "DuraTherm — Inlaid Pavement Markings for Snowplow-Safe Crosswalks",
    seoDescription: "Maximize safety and visibility with DuraTherm — inlaid, preformed thermoplastic markings that survive winter maintenance with no raised edge for plow blades.",
    shortDesc: "Inlaid flush-mount thermoplastic. Zero plow profile.",
    imageUrl: "/images/products/duratherm/duratherm-01.jpg",
    gallery: gallery("duratherm", "duratherm", 36),
    description: "DuraTherm is a premium decorative pavement marking system that seamlessly integrates high-performance preformed thermoplastic inlays with asphalt to create durable, attractive, long-lasting surface designs. The marking is embedded into a milled groove in the asphalt so the finished surface sits flush with the surrounding road — zero raised edges, zero profile for plow blades, no shear risk through Canadian winter maintenance cycles. Combines aesthetic appeal with the safety benefits of skid-resistant surface treatment. Used in commercial spaces and public facilities, urban streetscapes, residential neighbourhoods, and parking lots — anywhere the design intent calls for decorative marking that survives heavy snow clearing.",
    specs: [
      { label: "Installation", value: "Inlaid into milled groove — flush with surface" },
      { label: "Profile", value: "Zero edge — road surface level" },
      { label: "Snowplow Safe", value: "Yes — no shear risk" },
      { label: "Bond", value: "Heat-fused to milled asphalt substrate" },
      { label: "Designs", value: "Custom artwork accepted" },
      { label: "Service Life", value: "Multi-year — outlasts painted markings" },
    ],
    // Expanded per Vernon: streetscape inlays (community-branding), heritage districts, pedestrian plazas (public-spaces).
    relatedApplications: ["crosswalks", "community-branding", "public-spaces", "parking-lots", "pedestrian-safety"],
  },
  {
    name: "DuraShield",
    slug: "durashield",
    shortDesc: "Two-component asphalt pavement maintenance coating. Solar-reflective grey for pedestrian areas and local residential roadways.",
    imageUrl: "/images/products/durashield/durashield-01.jpg",
    gallery: gallery("durashield", "durashield", 10),
    description: "Formulated for use as an asphalt pavement maintenance coating, DuraShield is a two-component waterborne epoxy-modified acrylic grey color that provides durable aesthetics in pedestrian areas and local residential roadways. DuraShield SR Grey provides a solar reflectance of 0.34, which helps cool pavement surfaces and protect the substrate by reducing the damaging effects of heat and UV exposure. Cooler pavement surface temperatures can also help mitigate urban heat island effects. With low volatile organic content (VOC), DuraShield meets Southern California Air Quality Management District (SCAQMD) regulations. The coating also helps protect the substrate from the damaging effects of exposure to chemicals like fuel, oil, and deicing agents — making it well-suited for high-traffic parking lots and residential driveways. Available with anti-slip aggregate for pedestrian areas.",
    specs: [
      { label: "Type", value: "Two-component waterborne epoxy-modified acrylic coating" },
      { label: "Surface", value: "Asphalt pavement maintenance coating" },
      { label: "Colour", value: "Grey (SR 0.34 solar reflectance)" },
      { label: "VOC", value: "Low — meets SCAQMD regulations" },
      { label: "Chemical Resistance", value: "Fuel, oil, deicing agents" },
      { label: "Anti-Slip", value: "Available with aggregate texture" },
      { label: "Use Case", value: "Parking lots, residential driveways, pedestrian areas" },
    ],
    // Expanded per Vernon: pedestrian areas, residential roadways, heat-island mitigation surfaces.
    relatedApplications: ["parking-lots", "private-driveways", "residential-driveways", "parks-paths", "leed-urban-heat-island", "pedestrian-safety"],
  },
  {
    name: "AirMark",
    slug: "airmark",
    seoTitle: "AirMark — Advanced Airport Pavement Markings",
    seoDescription: "AirMark is an advanced, high-quality airport pavement markings system specifically designed for taxiways, aprons, and other non-runway aviation applications.",
    shortDesc: "Preformed thermoplastic for non-runway airfield markings. Used in Canada's busiest airports.",
    imageUrl: "/images/products/airmark/airmark-01.jpg",
    gallery: gallery("airmark", "airmark", 22),
    description: "AirMark is an advanced pavement markings system designed specifically for airports — engineered for taxiways, aprons, helipads, and other non-runway aviation surfaces. Glass beads embedded through the full material cross-section deliver high visibility for aviation personnel under all lighting conditions, holding retroreflectivity as the surface wears. Heat-applied by certified crews. Withstands jet blast, snow clearing operations, rubber removal treatments, and the daily operational demands of an active airfield while maintaining visibility year after year — significantly outlasting painted alternatives with no annual repainting cycle. Used in Canada's busiest airports for taxiway centrelines, apron designations, holding position signs, and ground-vehicle markings.",
    specs: [
      { label: "Application", value: "Taxiways, aprons, helipads, non-runway airfield surfaces" },
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Retroreflectivity", value: "Full-depth glass bead construction" },
      { label: "Colour", value: "White and yellow" },
      { label: "Service Life", value: "Multi-year — significantly outlasts paint" },
      { label: "Installation", value: "Heat application — certified crews" },
    ],
    // Vernon: taxiways, aprons, helipads, holding-position signs — airfield surfaces.
    relatedApplications: ["airports", "regulatory-markings"],
  },
  {
    name: "PreMark",
    slug: "premark",
    seoTitle: "PreMark — Long-Lasting, High-Visibility Pavement Markings",
    seoDescription: "Long-lasting, high-visibility preformed thermoplastic pavement markings for enhanced safety — arrows, stop bars, school zones, bike lanes, and regulatory symbols.",
    shortDesc: "Preformed thermoplastic symbols and legends. Drive-on installation.",
    imageUrl: "/images/products/premark/premark-01.jpg",
    gallery: gallery("premark", "premark", 11),
    description: "PreMark is a highly durable preformed thermoplastic pavement marking material, specifically engineered for high-traffic regulatory applications. Heat-applied with a propane torch, the system delivers crisp, vibrant lines and symbols — turn arrows, stop bars, yield triangles, school zone legends, bike pictograms and bike lane markings, accessible parking symbols, crosswalk ladder lines, and rumble strips — with permanent adhesion to asphalt and concrete. 125mil standard thickness, with a 90mil ViziGrip option for lighter-duty applications. The retroreflective, intersection-grade material is built to withstand heavy traffic and harsh weather, retaining vibrant colour and reflective performance day and night where painted alternatives require annual repainting. Lower total cost of ownership than traditional marking methods; quick installation without lane closures.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "125mil standard / 90mil ViziGrip option" },
      { label: "Service Life", value: "Multi-year service in heavy municipal use" },
      { label: "Installation", value: "Heat-applied via propane torch — drive-on immediately" },
      { label: "Retroreflectivity", value: "Intersection-grade glass bead surface" },
      { label: "Symbols", value: "Arrows, stop bars, legends, bike lane markings, accessible parking" },
    ],
    // Expanded per Vernon: bike lanes, regulatory markings, symbols/arrows, school zones (playgrounds), crosswalks.
    relatedApplications: ["bike-lanes", "regulatory-markings", "crosswalks", "parking-lots", "playgrounds", "pedestrian-safety", "traffic-calming"],
  },


  // ── Asphalt Repair ────────────────────────────────────────────────────────────────────────────────────
  {
    name: "ChipFill",
    slug: "chipfill",
    eyebrow: "Concrete and Asphalt Repair",
    shortDesc: "Heat-activated preformed material for permanent pothole repair. Year-round, all-weather.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [],
    description: "ChipFill is a heat-activated preformed pothole repair material engineered for permanent restoration of road surface damage. The material is laid into the prepared pothole and activated with a heat torch — no specialized equipment, no mixing, no aggregate prep. Once heated, ChipFill conforms to the contours of the damage and bonds chemically to the surrounding asphalt or concrete, preventing the water intrusion that turns minor damage into deeper structural failure. Deployable year-round regardless of weather. Sets rapidly so traffic can reopen within minutes of installation. Used by Canadian municipalities and maintenance crews for routine and emergency repair programs across roads, parking lots, sidewalks, and pedestrian surfaces.",
    specs: [
      { label: "Type", value: "Heat-activated preformed pothole repair material" },
      { label: "Application", value: "Heat torch — no specialized equipment required" },
      { label: "Substrate", value: "Asphalt and concrete" },
      { label: "Weather", value: "Year-round, all-conditions deployment" },
      { label: "Cure", value: "Rapid set — minutes to reopen to traffic" },
      { label: "Use Case", value: "Smaller potholes, cracks, joints, surface defects" },
    ],
    // ChipFill/AggreFill/Fast Patch DPR — pothole + crack repair across all paved surfaces.
    relatedApplications: ["parking-lots", "private-driveways", "residential-driveways", "parks-paths", "commercial-spaces", "townhomes"],
  },
  {
    name: "AggreFill",
    slug: "aggrefill",
    eyebrow: "Concrete and Asphalt Repair",
    shortDesc: "Pre-coated aggregate filler for larger potholes up to 1 m². Combined with ChipFill for permanent repair.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [],
    description: "AggreFill is a pre-coated aggregate filler used in combination with ChipFill to permanently repair larger potholes — up to approximately 1 m² in diameter. Where the damage is too deep or too wide for a stand-alone material, AggreFill provides the structural mass; ChipFill bonds the matrix and seals the surface. The combined system applies cold with a heat torch finish, bonds chemically to the surrounding asphalt or concrete substrate, and is traffic-ready within minutes. Year-round deployment regardless of weather. Specified for the deeper road, parking lot, and industrial-site damages where conventional cold mix migrates under wheel loading or fails to bond at the substrate edges.",
    specs: [
      { label: "Type", value: "Pre-coated aggregate filler — paired with ChipFill" },
      { label: "Application", value: "Cold-applied aggregate + heat-torch ChipFill matrix" },
      { label: "Substrate", value: "Asphalt and concrete" },
      { label: "Repair Size", value: "Larger damages — up to ~1 m² in diameter" },
      { label: "Cure", value: "Rapid set — minutes to reopen to traffic" },
      { label: "Weather", value: "Year-round, all-conditions deployment" },
    ],
    relatedApplications: ["parking-lots", "private-driveways", "residential-driveways", "parks-paths", "commercial-spaces", "townhomes"],
  },
  {
    name: "Fast Patch DPR",
    slug: "fast-patch",
    eyebrow: "Concrete and Asphalt Repair",
    shortDesc: "Distressed pavement repair. Return to service in under 45 minutes. Polymer blend with recycled content.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [],
    description: "Fast Patch DPR is an easy-to-apply distressed pavement repair material for asphalt and concrete — a unique polymer blend of recycled and renewable materials engineered for high-strength, fast-return-to-service repair of potholes, spalls, joints, wheel paths, and utility cuts. Minimal site preparation. Return to service in less than 45 minutes; optional Fast Patch Kicker accelerator delivers faster cure in cooler conditions. Bonds chemically to the surrounding substrate with excellent freeze-thaw resistance and impact absorption. Completely odourless, making it suitable for indoor warehouse floors, loading docks, and underground parkades. Used on roadways and bridges, parking lots, sidewalks and curbs (trip hazards), and any environment where extended downtime is not an option.",
    specs: [
      { label: "Type", value: "Polymer-blend distressed pavement repair" },
      { label: "Composition", value: "Recycled and renewable polymer matrix" },
      { label: "Cure Time", value: "Return to service in <45 minutes" },
      { label: "Cold Weather", value: "Compatible with Fast Patch Kicker accelerator" },
      { label: "Substrate", value: "Asphalt and concrete — roads, bridges, lots, warehouses" },
      { label: "Odour", value: "Odourless — suitable for indoor applications" },
      { label: "Resilience", value: "Excellent freeze-thaw resistance + impact absorption" },
    ],
    relatedApplications: ["parking-lots", "private-driveways", "residential-driveways", "parks-paths", "commercial-spaces", "townhomes"],
  },
  {
    name: "Aquaphalt",
    slug: "aquaphalt",
    // Per Doug review — keep the page reachable, omit from footer nav.
    hideFromFooter: true,
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
