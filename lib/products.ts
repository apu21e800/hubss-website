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
}

function gallery(slug: string, dir: string, count: number, ext: string = "jpg"): string[] {
  return Array.from({ length: count }, (_, i) =>
    `/images/products/${dir}/${slug}-${String(i + 1).padStart(2, "0")}.${ext}`
  );
}

export const products: Product[] = [
  {
    name: "TrafficPatterns",
    slug: "traffic-patterns",
    shortDesc: "Permanent pattern. Permanent impression.",
    imageUrl: "/images/products/traffic-patterns/traffic-patterns-01.jpg",
    gallery: gallery("traffic-patterns", "traffic-patterns", 86),
    description: "Crisp, permanently fused markings that survive snowplows, de-icing chemicals, and decades of freeze-thaw cycles — that's what TrafficPatterns delivers. Factory-manufactured to 90mil thickness, trusted by York Region, the City of Toronto, Vancouver, and UBC. Delivers 5-7 years of consistent retroreflectivity where traffic paint lasts just 12-18 months.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "90mil standard" },
      { label: "Retroreflectivity", value: "ASTM D4956 Type III glass beads" },
      { label: "Temperature Range", value: "-40C to +60C in service" },
      { label: "Installation", value: "Heat application - open to traffic in hours" },
      { label: "Service Life", value: "5-7 years" },
      { label: "Standards", value: "TAC + MUTCD compliant" },
    ],
    relatedApplications: ["crosswalks", "bike-lanes", "bus-lanes", "parking-lots"],
  },
  {
    name: "StreetPrint",
    slug: "streetprint",
    shortDesc: "Where asphalt becomes architecture.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: gallery("streetprint", "streetprint", 91),
    description: "StreetPrint transforms existing asphalt into rich decorative hardscape. A proprietary in-place stamping process backed by a 20-year colour retention warranty. Used by more than 500 Canadian municipalities.",
    specs: [
      { label: "System", value: "In-place asphalt stamping + StreetBond coating" },
      { label: "Patterns", value: "12+ standard patterns, custom available" },
      { label: "Colour Coat", value: "StreetBond UV-stable acrylic" },
      { label: "Durability", value: "20-year colour retention warranty" },
      { label: "Base", value: "New lay or existing asphalt" },
      { label: "Snowplow Safe", value: "Yes - flush surface, no raised edges" },
      { label: "Applications", value: "Intersections, plazas, driveways, crosswalks" },
    ],
    relatedApplications: ["crosswalks", "private-driveways", "community-branding", "parking-lots"],
  },
  {
    name: "TrafficPatternsXD",
    slug: "traffic-patterns-xd",
    shortDesc: "Built for the roads that never rest.",
    imageUrl: "/images/products/traffic-patterns-xd/traffic-patterns-xd-01.jpg",
    gallery: gallery("traffic-patterns-xd", "traffic-patterns-xd", 99),
    description: "TrafficPatternsXD: 150mil aggregate-reinforced thermoplastic for BRT corridors and high-volume intersections. BPN 65+ skid resistance and 7+ year service life.",
    specs: [
      { label: "Material", value: "Aggregate-reinforced preformed thermoplastic" },
      { label: "Thickness", value: "150mil" },
      { label: "Aggregate", value: "Crushed aggregate + glass bead surface" },
      { label: "Skid Resistance", value: "BPN 65+" },
      { label: "Retroreflectivity", value: "ASTM D4956 Type III" },
      { label: "Service Life", value: "7+ years in high-volume use" },
      { label: "Standards", value: "TAC + MUTCD compliant" },
    ],
    relatedApplications: ["crosswalks", "bike-lanes", "bus-lanes"],
  },
  {
    name: "StreetBond",
    slug: "streetbond",
    shortDesc: "Colour that bonds. Beauty that endures.",
    imageUrl: "/images/products/streetbond/streetbond-01.png",
    gallery: gallery("streetbond", "streetbond", 112, "png"),
    description: "StreetBond is the industry-leading coloured pavement coating for asphalt and concrete. 20-year colour retention warranty. Available in extensive standard palette and fully custom Pantone-matched. BC Ministry of Transportation recognized product.",
    specs: [
      { label: "Type", value: "Acrylic coloured pavement coating" },
      { label: "Surfaces", value: "Asphalt and concrete (acid-etched)" },
      { label: "Flexibility", value: "Moves with pavement - will not peel or crack" },
      { label: "Durability", value: "20-year colour retention warranty" },
      { label: "Coverage", value: "30-50 sq ft per gallon" },
      { label: "Dry Time", value: "2-4 hours" },
      { label: "Colour Matching", value: "Full Pantone custom matching available" },
      { label: "Standards", value: "MUTCD compliant, BCMOT recognized" },
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
      src: "/images/products/streetbond/streetbond-logo.png",
      alt: "StreetBond - industry-leading coloured pavement coating",
      width: 280,
      height: 80,
    },
    relatedApplications: ["bike-lanes", "bus-lanes", "private-driveways", "parks-paths", "parking-lots"],
  },
  {
    name: "MMAX",
    slug: "mmax",
    shortDesc: "Lanes that lead. Colour that commands.",
    imageUrl: "/images/products/mmax/mmax-01.jpg",
    gallery: gallery("mmax", "mmax", 33),
    description: "MMAX methyl methacrylate cures in 30-60 minutes. Bond strength exceeding 3 MPa. Can be applied at temperatures as low as -10C. The specified solution for transit corridors where painted lanes are not an option.",
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
      { label: "Service Life", value: "5-year colour warranty" },
      { label: "Min. Order", value: "Project-based" },
    ],
    relatedApplications: ["community-branding", "crosswalks", "playgrounds"],
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
    name: "PreMark",
    slug: "premark",
    shortDesc: "Precision-formed. Snowplow-proof.",
    imageUrl: "/images/products/premark/premark-01.jpg",
    gallery: gallery("premark", "premark", 11),
    description: "PreMark: complete library of TAC and MUTCD-compliant preformed thermoplastic road marking symbols. Pre-cut and ready to apply. Outlasts painted symbols by 5:1.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "90mil standard / 125mil heavy-use" },
      { label: "Retroreflectivity", value: "ASTM D4956 Type III glass beads" },
      { label: "Standards", value: "TAC + MUTCD compliant" },
      { label: "Library", value: "200+ standard symbols + custom" },
      { label: "Installation", value: "Heat application - no stencil required" },
      { label: "Service Life", value: "5-year warranty" },
    ],
    relatedApplications: ["crosswalks", "bike-lanes", "bus-lanes", "regulatory-markings"],
  },
  {
    name: "DuraTherm",
    slug: "duratherm",
    shortDesc: "Set into the road. There for life.",
    imageUrl: "/images/products/duratherm/duratherm-01.jpg",
    gallery: gallery("duratherm", "duratherm", 36),
    description: "DuraTherm: inlaid flush-mount thermoplastic. Zero raised edges, zero profile for plow blades. Survives winter maintenance season after season. 7-year performance warranty.",
    specs: [
      { label: "Installation", value: "Inlaid flush-mount - embedded in asphalt" },
      { label: "Profile", value: "Zero edge - road surface level" },
      { label: "Snowplow Safe", value: "Yes - no shear risk" },
      { label: "Bond", value: "Full-depth asphalt integration" },
      { label: "Designs", value: "Custom artwork accepted" },
      { label: "Service Life", value: "7-year performance warranty" },
    ],
    relatedApplications: ["crosswalks", "parking-lots", "community-branding"],
  },
  {
    name: "AirMark",
    slug: "airmark",
    shortDesc: "FAA-grade clarity. Field-proven performance.",
    imageUrl: "/images/products/airmark/airmark-01.jpg",
    gallery: gallery("airmark", "airmark", 22),
    description: "AirMark: FAA Advisory Circular 150/5370-10 compliant preformed thermoplastic airfield markings. ASTM D4956 Type IV premium retroreflectivity. Outlast painted alternatives by 4:1.",
    specs: [
      { label: "Standard", value: "FAA Advisory Circular 150/5370-10" },
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Retroreflectivity", value: "ASTM D4956 Type IV premium" },
      { label: "Colour", value: "FAA white and yellow" },
      { label: "Service Life", value: "4x painted alternatives" },
      { label: "Installation", value: "Heat application - certified crews" },
    ],
    relatedApplications: ["regulatory-markings"],
  },
];
