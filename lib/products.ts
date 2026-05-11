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
    shortDesc: "150mil aggregate-reinforced thermoplastic. BPN 65+ skid resistance.",
    imageUrl: "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
    gallery: [1,2,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,129,130,133,136,139,143].map(n =>
      `/images/products/traffic-patterns-xd/traffic-patterns-xd-${String(n).padStart(2, "0")}.jpg`),
    description: "150mil aggregate-reinforced preformed thermoplastic for BRT corridors, high-volume intersections, and concentrated turning movements. BPN 65+ certified skid resistance and ASTM D4956 Type III retroreflectivity. Heat-fused permanently to the pavement surface. Specified by Canadian transit authorities and municipalities where painted lane markings will not survive a single season of bus turning movements.",
    specs: [
      { label: "Material", value: "Aggregate-reinforced preformed thermoplastic" },
      { label: "Thickness", value: "150mil" },
      { label: "Aggregate", value: "Crushed aggregate reinforced" },
      { label: "Skid Resistance", value: "BPN 65+" },
      { label: "Retroreflectivity", value: "ASTM D4956 Type III" },
      { label: "Service Life", value: "7+ years in high-volume use" },
      { label: "Specification", value: "Specified by Canadian municipalities coast to coast" },
    ],
    relatedApplications: ["crosswalks", "bike-lanes", "bus-lanes"],
  },
  {
    name: "TrafficPatterns",
    slug: "traffic-patterns",
    shortDesc: "90mil preformed thermoplastic. Outlasts paint 5:1.",
    imageUrl: "/images/products/traffic-patterns/traffic-patterns-01.jpg",
    gallery: gallery("traffic-patterns", "traffic-patterns", 86),
    description: "Factory-manufactured 90mil preformed thermoplastic, heat-fused to asphalt or concrete. ASTM D4956 Type III retroreflective glass beads embedded through the full cross-section, holding nighttime visibility as the surface wears. Open to traffic within hours of installation. Withstands snowplow blades, de-icing chemicals, and Canadian freeze-thaw cycling. Holds retroreflectivity 5–7 years in service compared to 12–18 months for conventional traffic paint. Specified for crosswalks, bike lanes, and regulatory markings by Canadian municipalities coast to coast.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "90mil standard" },
      { label: "Retroreflectivity", value: "ASTM D4956 Type III glass beads" },
      { label: "Temperature Range", value: "-40C to +60C in service" },
      { label: "Installation", value: "Heat application — open to traffic in hours" },
      { label: "Service Life", value: "5–7 years" },
      { label: "Specification", value: "Specified by Canadian municipalities coast to coast" },
    ],
    relatedApplications: ["crosswalks", "bike-lanes", "bus-lanes", "parking-lots"],
  },
  {
    name: "StreetBond",
    slug: "streetbond",
    seoTitle: "StreetBond® — Durable Asphalt Coatings for Safer Streets",
    seoDescription: "StreetBond is a high-quality pavement coating system that transforms ordinary asphalt and concrete surfaces into vibrant, durable, and functional surfaces for streets, commercial spaces, and public facilities.",
    shortDesc: "Acrylic pavement coating. Bonds chemically. Full Pantone matching.",
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
    description: "Flexible acrylic coloured pavement coating for asphalt and acid-etched concrete. Bonds chemically to the substrate and flexes with pavement movement, resisting peeling, chipping, and delamination through freeze-thaw cycling. Used for bike lanes, bus priority zones, decorative crosswalks, civic plazas, and branded driveways. Available in a standard palette or full custom Pantone matching. Recognized by the BC Ministry of Transportation.",
    specs: [
      { label: "Type", value: "Acrylic coloured pavement coating" },
      { label: "Surfaces", value: "Asphalt and concrete (acid-etched)" },
      { label: "Flexibility", value: "Moves with pavement — will not peel or crack" },
      { label: "UV Stability", value: "Colour-fast acrylic formula" },
      { label: "Coverage", value: "30–50 sq ft per gallon" },
      { label: "Dry Time", value: "2–4 hours" },
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
    seoTitle: "StreetPrint® — Stamped Asphalt Solutions for Urban Design",
    seoDescription: "StreetPrint is a state-of-the-art decorative pavement solution that combines the durability of asphalt with the aesthetics of brick, stone, or custom designs.",
    shortDesc: "In-place stamped asphalt. 12+ standard patterns plus custom.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [1,3,5,7,9,10,11,13,15,17,19,21,23,25,27,29,31,32,33,35,37,39,41,43,45,47,49,51,53,55,56,57,59,61,63,65,67,69,71,73,75,77,79,80,81,83,85,87,89,91].map(n =>
      `/images/products/streetprint/streetprint-${String(n).padStart(2, "0")}.jpg`),
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
    seoDescription: "Elevate your brand with durable custom horizontal graphics, civic art, and pavement wayfinding solutions — full Pantone matching, print-quality accuracy.",
    shortDesc: "Custom-graphic preformed thermoplastic. Pantone-matched.",
    imageUrl: "/images/products/decomark/decomark-01.jpg",
    gallery: gallery("decomark", "decomark", 78),
    description: "Custom-graphic preformed thermoplastic for civic murals, Indigenous art, Pride crosswalks, neighbourhood identity, school zone graphics, and large-format public art. Components are fabricated to vector artwork and Pantone colour specifications, then heat-fused to asphalt or concrete. Print-quality colour accuracy and dimensional precision. Withstands snowplow cycles, de-icing chemicals, and multi-year traffic loads.",
    specs: [
      { label: "System", value: "Precision preformed thermoplastic components" },
      { label: "Colour Range", value: "Full custom Pantone matching" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Design", value: "Custom artwork — vector files accepted" },
      { label: "Installation", value: "Certified HUB applicators" },
      { label: "Service Life", value: "5+ years" },
      { label: "Min. Order", value: "Project-based" },
    ],
    relatedApplications: ["community-branding", "crosswalks", "playgrounds"],
  },
  {
    name: "MMAX",
    slug: "mmax",
    shortDesc: "MMA resin coating. 30–60 min cure. Bond strength >3 MPa.",
    imageUrl: "/images/products/mmax/mmax-01.jpg",
    gallery: gallery("mmax", "mmax", 33),
    description: "Methyl methacrylate (MMA) resin coating that cures to traffic-ready in 30–60 minutes, enabling overnight installation in active transit corridors. Bond strength exceeds 3 MPa under high-shear loading at bus stops and turning radii. Applies down to –10°C. Specified for red bus lanes, green bike lanes, and transit-priority corridors where short cure windows and bond strength above acrylic and epoxy alternatives are required.",
    specs: [
      { label: "Material", value: "Methyl Methacrylate (MMA) resin" },
      { label: "Cure Time", value: "30–60 minutes (traffic-ready)" },
      { label: "Bond Strength", value: ">3 MPa" },
      { label: "Thickness", value: "1.5–3mm applied" },
      { label: "Min. Temp", value: "-10C application" },
      { label: "UV Stability", value: "Colour-fast for 10+ years" },
      { label: "Service Life", value: "10+ years in transit lane use" },
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
    description: "Solar reflective acrylic pavement coating with a high Solar Reflectance Index (SRI). Reflects solar radiation off the pavement surface, reducing surface temperature relative to dark asphalt and mitigating urban heat island effects. Contributes to LEED v4 Sustainable Sites credit for heat island reduction. Same flexible chemistry and adhesion characteristics as StreetBond. Available in a curated palette of SRI-optimized tones with full custom Pantone matching.",
    specs: [
      { label: "Type", value: "Solar reflective acrylic pavement coating" },
      { label: "LEED Credits", value: "Contributes to Sustainable Sites credit" },
      { label: "Solar Reflectance", value: "High SRI (Solar Reflectance Index)" },
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
    seoDescription: "Maximize safety and visibility with DuraTherm — inlaid, preformed thermoplastic markings that survive winter maintenance and deliver 7+ years of service.",
    shortDesc: "Inlaid flush-mount thermoplastic. Zero plow profile.",
    imageUrl: "/images/products/duratherm/duratherm-01.jpg",
    gallery: gallery("duratherm", "duratherm", 36),
    description: "Inlaid flush-mount preformed thermoplastic, embedded into the asphalt at full depth so the marking sits level with the surrounding road surface. Zero raised edges, zero profile for plow blades, no shear risk through Canadian winter maintenance cycles. Custom artwork, logos, and wayfinding graphics fabricated to vector specifications. 7+ year service life.",
    specs: [
      { label: "Installation", value: "Inlaid flush-mount — embedded in asphalt" },
      { label: "Profile", value: "Zero edge — road surface level" },
      { label: "Snowplow Safe", value: "Yes — no shear risk" },
      { label: "Bond", value: "Full-depth asphalt integration" },
      { label: "Designs", value: "Custom artwork accepted" },
      { label: "Service Life", value: "7+ years" },
    ],
    relatedApplications: ["crosswalks", "parking-lots", "community-branding"],
  },
  {
    name: "DuraShield",
    slug: "durashield",
    shortDesc: "Penetrating asphalt rejuvenator. 3–5 year service extension.",
    imageUrl: "/images/products/durashield/durashield-01.jpg",
    gallery: gallery("durashield", "durashield", 10),
    description: "Penetrating asphalt rejuvenator and protective seal coat. Penetrates 6–12mm into the surface, replenishes the maltene fraction in oxidized asphalt, restores binder flexibility, and seals against water intrusion and UV degradation. Applied as part of a proactive maintenance program. Documented 3–5 year extension to pavement service life. 24-hour traffic open.",
    specs: [
      { label: "Type", value: "Penetrating asphalt rejuvenator + seal coat" },
      { label: "Coverage", value: "100–150 sq ft per gallon" },
      { label: "Penetration Depth", value: "6–12mm" },
      { label: "Dry Time", value: "4–8 hours" },
      { label: "Traffic Open", value: "24 hours" },
      { label: "Lifespan Extension", value: "3–5 years documented" },
    ],
    relatedApplications: ["private-driveways", "parking-lots", "parks-paths"],
  },
  {
    name: "AirMark",
    slug: "airmark",
    seoTitle: "AirMark — Advanced Airport Pavement Markings",
    seoDescription: "AirMark is an advanced, high-quality airport pavement markings system specifically designed for taxiways, aprons, and other non-runway aviation applications.",
    shortDesc: "Preformed thermoplastic for airfield markings. Outlasts paint 4:1.",
    imageUrl: "/images/products/airmark/airmark-01.jpg",
    gallery: gallery("airmark", "airmark", 22),
    description: "Preformed thermoplastic airfield marking system for runway threshold markings, designation numbers, taxiway centrelines, holding position signs, and apron designations. Glass beads embedded through the full material cross-section, not just the surface, holding retroreflectivity as the surface wears. Heat-applied by certified crews. Withstands jet blast, deicing fluid application, and rubber contamination from landing gear. Outlasts painted markings 4:1.",
    specs: [
      { label: "Standard", value: "Aviation airfield marking standards" },
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Retroreflectivity", value: "Full-depth glass bead construction" },
      { label: "Colour", value: "White and yellow" },
      { label: "Service Life", value: "4x painted alternatives" },
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
    description: "Library of preformed thermoplastic road marking symbols — turn arrows, stop bars, yield triangles, school zone legends, bike pictograms, accessible parking symbols, and crosswalk ladder lines. Pre-cut to specification, heat-applied, and drive-on immediately. No stencil prep, no curing window. 90mil standard or 125mil for high-traffic intersections. Holds retroreflectivity 5x longer than painted symbols.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "90mil standard / 125mil heavy-use" },
      { label: "Service Life", value: "5–7 years in heavy municipal use" },
      { label: "Curing", value: "No cure time — heat-applied, drive-on immediately" },
      { label: "Retroreflectivity", value: "Premium glass bead surface" },
    ],
    relatedApplications: ["crosswalks", "regulatory-markings", "parking-lots", "bike-lanes", "bus-lanes"],
  },


  // ── Asphalt Repair ────────────────────────────────────────────────────────────────────────────────────
  {
    name: "Fast Patch",
    slug: "fast-patch",
    shortDesc: "Permanent polyurethane repair. Open to traffic in 30 minutes.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [],
    description: "Two-component polyurethane hybrid for permanent pothole and utility cut repair. Mixed on-site and applied cold — no heating, no compaction equipment, no extended lane closures. Bonds chemically to the surrounding asphalt or concrete substrate and cures to a rigid, traffic-ready surface in 30 minutes. Applies from –10°C to +40°C. Service life is 5x conventional cold-mix repair. Specified by Canadian municipalities and maintenance contractors.",
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
    shortDesc: "Water-activated cold-mix repair. Zero VOC, zero heat.",
    imageUrl: "/images/products/streetprint/streetprint-40.jpg",
    gallery: [],
    description: "Water-activated permanent cold-mix asphalt repair for potholes, utility cuts, valve adjustments, and edge joints. Applied cold and activated with water — no mixing, no heating, no specialty equipment. Zero solvents, zero VOCs, zero fumes. Suitable for underground parkades, occupied spaces, hospital campuses, and school zones. Bonds permanently to asphalt and concrete on contact. Open to traffic immediately after compaction. In service in over 30 countries.",
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
