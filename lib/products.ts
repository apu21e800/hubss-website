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
  // ── Flagship Group ──────────────────────────────────────────────────────────
  {
    name: "TrafficPatternsXD",
    slug: "traffic-patterns-xd",
    shortDesc: "Built for the roads that never rest.",
    imageUrl: "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
    gallery: [1,2,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,129,130,133,136,139,143].map(n =>
      `/images/products/traffic-patterns-xd/traffic-patterns-xd-${String(n).padStart(2, "0")}.jpg`),
    description: "TrafficPatternsXD: 150mil aggregate-reinforced thermoplastic for BRT corridors and high-volume intersections. BPN 65+ skid resistance and 7+ year service life.",
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
    shortDesc: "Permanent pattern. Permanent impression.",
    imageUrl: "/images/products/traffic-patterns/traffic-patterns-01.jpg",
    gallery: gallery("traffic-patterns", "traffic-patterns", 86),
    description: "Crisp, permanently fused markings that survive snowplows, de-icing chemicals, and decades of freeze-thaw cycles — that's what TrafficPatterns delivers. Factory-manufactured to 90mil thickness. Delivers 5-7 years of consistent retroreflectivity where traffic paint lasts just 12-18 months.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "90mil standard" },
      { label: "Retroreflectivity", value: "ASTM D4956 Type III glass beads" },
      { label: "Temperature Range", value: "-40C to +60C in service" },
      { label: "Installation", value: "Heat application - open to traffic in hours" },
      { label: "Service Life", value: "5-7 years" },
      { label: "Specification", value: "Specified by Canadian municipalities coast to coast" },
    ],
    relatedApplications: ["crosswalks", "bike-lanes", "bus-lanes", "parking-lots"],
  },
  {
    name: "StreetBond",
    slug: "streetbond",
    shortDesc: "Colour that holds. Asphalt transformed.",
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
    description: "Transforms existing asphalt into decorative colour and patterns — cobblestone, brick, herringbone. Available in an extensive standard palette and fully custom Pantone-matched. BC Ministry of Transportation recognized product.",
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
    brandLogo: {
      src: "/images/products/streetbond/streetbond-logo-color.svg",
      alt: "StreetBond coloured pavement coating system by HUB Surface Systems",
      width: 280,
      height: 80,
    },
    relatedApplications: ["bike-lanes", "bus-lanes", "private-driveways", "parks-paths", "parking-lots"],
  },
  {
    name: "StreetPrint",
    slug: "streetprint",
    shortDesc: "Where asphalt becomes architecture.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [1,3,5,7,9,10,11,13,15,17,19,21,23,25,27,29,31,32,33,35,37,39,41,43,45,47,49,51,53,55,56,57,59,61,63,65,67,69,71,73,75,77,79,80,81,83,85,87,89,91].map(n =>
      `/images/products/streetprint/streetprint-${String(n).padStart(2, "0")}.jpg`),
    description: "StreetPrint transforms existing asphalt into rich decorative hardscape. A proprietary in-place stamping process available in 12+ standard patterns and fully custom designs. Installed coast to coast by certified HUB applicators.",
    specs: [
      { label: "System", value: "In-place asphalt stamping + StreetBond coating" },
      { label: "Patterns", value: "12+ standard patterns, custom available" },
      { label: "Colour Coat", value: "StreetBond UV-stable acrylic" },
      { label: "Base", value: "New lay or existing asphalt" },
      { label: "Snowplow Safe", value: "Yes - flush surface, no raised edges" },
      { label: "Applications", value: "Intersections, plazas, driveways, crosswalks" },
    ],
    brandLogo: {
      src: "/images/assets/logos/product-logos/StreetPrint/large_StreetPrint_Logo.png",
      alt: "StreetPrint decorative asphalt stamping system by HUB Surface Systems",
      width: 300,
      height: 80,
    },
    relatedApplications: ["crosswalks", "private-driveways", "community-branding", "parking-lots"],
  },

  // ── Specialty & Regulatory Group ────────────────────────────────────────────
  {
    name: "DecoMark",
    slug: "decomark",
    shortDesc: "From CAD file to civic landmark.",
    imageUrl: "/images/products/decomark/decomark-01.jpg",
    gallery: gallery("decomark", "decomark", 78),
    description: "DecoMark: custom-graphic thermoplastic for murals, Indigenous art, Pride crosswalks, and neighbourhood identity at street scale. Full Pantone colour matching, print-quality accuracy.",
    specs: [
      { label: "System", value: "Precision preformed thermoplastic components" },
      { label: "Colour Range", value: "Full custom Pantone matching" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Design", value: "Custom artwork - vector files accepted" },
      { label: "Installation", value: "Certified HUB applicators" },
      { label: "Service Life", value: "5+ year service life" },
      { label: "Min. Order", value: "Project-based" },
    ],
    relatedApplications: ["community-branding", "crosswalks", "playgrounds"],
  },
  {
    name: "MMAX",
    slug: "mmax",
    shortDesc: "Lanes that lead. Colour that commands.",
    imageUrl: "/images/products/mmax/mmax-01.jpg",
    gallery: gallery("mmax", "mmax", 33),
    description: "MMAX methyl methacrylate cures in 30-60 minutes. Bond strength exceeding 3 MPa. Can be applied at temperatures as low as -10C. The specified solution for red bus lanes, bike lanes, and transit corridors where painted lanes are not an option.",
    specs: [
      { label: "Material", value: "Methyl Methacrylate (MMA) resin" },
      { label: "Cure Time", value: "30-60 minutes (traffic-ready)" },
      { label: "Bond Strength", value: ">3 MPa" },
      { label: "Thickness", value: "1.5-3mm applied" },
      { label: "Min. Temp", value: "-10C application" },
      { label: "UV Stability", value: "High - colour-fast for 10+ years" },
      { label: "Service Life", value: "10+ years in transit lane use" },
    ],
    relatedApplications: ["bike-lanes", "bus-lanes", "crosswalks"],
  },
  {
    name: "StreetBondSR",
    slug: "streetbondsr",
    shortDesc: "Solar reflective. High-SRI rated. Urban heat island mitigation.",
    imageUrl: "/images/products/streetbondsr/streetbondsr-02.jpg",
    gallery: [
      "/images/products/streetbondsr/streetbondsr-01.png",
      "/images/products/streetbondsr/streetbondsr-02.jpg",
      "/images/products/streetbondsr/streetbondsr-05.jpg",
      "/images/products/streetbondsr/streetbondsr-07.jpg",
      "/images/products/streetbondsr/streetbondsr-08.jpg",
    ],
    description: "StreetBondSR combines superior colour retention with solar reflective technology. A high-SRI coating system that reduces pavement surface temperatures, mitigating urban heat island effects while delivering lasting colour and protection. Trusted by 500+ Canadian municipalities.",
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
    shortDesc: "Set into the road. There for life.",
    imageUrl: "/images/products/duratherm/duratherm-01.jpg",
    gallery: gallery("duratherm", "duratherm", 36),
    description: "DuraTherm: inlaid flush-mount thermoplastic. Zero raised edges, zero profile for plow blades. Survives winter maintenance season after season. 7+ year service life.",
    specs: [
      { label: "Installation", value: "Inlaid flush-mount - embedded in asphalt" },
      { label: "Profile", value: "Zero edge - road surface level" },
      { label: "Snowplow Safe", value: "Yes - no shear risk" },
      { label: "Bond", value: "Full-depth asphalt integration" },
      { label: "Designs", value: "Custom artwork accepted" },
      { label: "Service Life", value: "7+ year service life" },
    ],
    relatedApplications: ["crosswalks", "parking-lots", "community-branding"],
  },
  {
    name: "DuraShield",
    slug: "durashield",
    shortDesc: "Protected surface. Extended life.",
    imageUrl: "/images/products/durashield/durashield-01.jpg",
    gallery: gallery("durashield", "durashield", 10),
    description: "DuraShield penetrating asphalt rejuvenator and protective seal coat. Documented 3-5 year lifespan extension at a fraction of replacement cost.",
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
    shortDesc: "Aviation-grade clarity. Field-proven performance.",
    imageUrl: "/images/products/airmark/airmark-01.jpg",
    gallery: gallery("airmark", "airmark", 22),
    description: "AirMark: preformed thermoplastic airfield markings engineered for precision and performance. Premium retroreflectivity. Outlast painted alternatives by 4:1.",
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
    shortDesc: "Precision-formed. Snowplow-proof.",
    imageUrl: "/images/products/premark/premark-01.jpg",
    gallery: gallery("premark", "premark", 11),
    description: "PreMark: complete library of preformed thermoplastic road marking symbols — turn arrows, stop bars, yield lines, and school zone legends. Pre-cut and ready to apply. Outlasts painted symbols 5:1.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "90mil standard / 125mil heavy-use" },
      { label: "Service Life", value: "5-7 years in heavy municipal use" },
      { label: "Curing", value: "No cure time — heat-applied, drive-on immediately" },
      { label: "Retroreflectivity", value: "Premium glass bead surface" },
    ],
    relatedApplications: ["crosswalks", "regulatory-markings", "parking-lots", "bike-lanes", "bus-lanes"],
  },


  // ── Asphalt Repair ───────────────────────────────────────────────────────────
  {
    name: "Fast Patch",
    slug: "fast-patch",
    shortDesc: "Permanent pothole repair. Open to traffic in minutes.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [],
    description: "FastPatch is a two-component polyurethane hybrid repair system engineered for permanent pothole and utility cut repair. Mixed on-site and applied cold, it bonds directly to the existing asphalt substrate — no heating, no compaction equipment, no lane closures for longer than 30 minutes. Unlike cold-mix or hot-mix temporary patches, FastPatch cures to a rigid, traffic-ready surface that outlasts conventional repair methods by 5:1. Trusted by municipalities, contractors, and maintenance crews across Canada.",
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
    shortDesc: "Water-activated repair. No fumes. No heat. No mess.",
    imageUrl: "/images/products/streetprint/streetprint-40.jpg",
    gallery: [],
    description: "Aquaphalt is a water-activated, permanent asphalt repair product engineered for potholes, utility cuts, utility valve adjustments, and edge joints. Applied cold and activated with water, Aquaphalt requires no mixing, no heating, and no special equipment — just fill, compact, and drive. Its environmentally responsible formula contains no solvents, no VOCs, and no hazardous fumes, making it suitable for use in occupied spaces, underground parkades, and school zones. Aquaphalt bonds permanently to asphalt and concrete and has been installed in over 30 countries.",
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
