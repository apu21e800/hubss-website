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
  /**
   * DELIBERATELY NOT RENDERED. Five products carry a brandLogo and nothing on
   * the site reads this field — that is the intended state, not an unfinished
   * feature, and it has now been re-reported as a "live production bug" three
   * times by people who found the data with no consumer and inferred the
   * rendering had never shipped. It did ship, in April 2026, and was removed
   * on purpose on 14 May 2026 (5d3def1):
   *
   *     "Logo display removed from both main content column and sidebar.
   *      Hero H1 + photography does the job better. brandLogo data preserved
   *      in products.ts so we can revisit placement later without re-adding
   *      data."
   *
   * So the data is a parked asset, kept so a future placement does not have to
   * be researched again. The five files exist under /public/images/products/.
   *
   * DO NOT "fix" this by applying an April-era patch or worktree — 0001-design-
   * final-pass.patch and the tender-chandrasekhar worktree (240x96 → 320x120)
   * both predate the removal and target a product page that has since been
   * rebuilt around the catalogue spread. Restoring logos is a design decision
   * for Vernon and Doug, and if it is taken, it should be written fresh against
   * the current page rather than reverted into it.
   */
  brandLogo?: { src: string; alt: string; width: number; height: number; blendMode?: string; };
  comingSoon?: boolean;
  // Overrides the hero eyebrow on /products/[slug] (which otherwise falls back to taxonomy).
  eyebrow?: string;
  // Hide a product from footer nav while keeping the /products/[slug] page reachable directly.
  hideFromFooter?: boolean;
  // Per-product hero crop override (CSS object-position). Defaults to "center 62%" in the product page.
  heroPosition?: string;
  // SEO overrides ported from old hubss.com — preserves keyword targeting + rankings on launch.
  // When present, these win over auto-generated title/description in buildMetadata.
  seoTitle?: string;
  seoDescription?: string;
}

function gallery(slug: string, dir: string, count: number, ext: string = "jpg", pngOverrides: number[] = []): string[] {
  const pngSet = new Set(pngOverrides);
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const resolvedExt = pngSet.has(n) ? "png" : ext;
    return `/images/products/${dir}/${slug}-${String(n).padStart(2, "0")}.${resolvedExt}`;
  });
}

// Product copy re-based on the HUBSS 2026 catalogue (Figma, read 7 Sep 2026) — Doug-approved text,
// so shortDesc / description / specs for the ten catalogue systems say what the printed page says and
// nothing the printed page does not (dropped: glass-bead claims on TrafficPatterns/XD, a "milled groove"
// for DuraTherm, "our production facility" for DecoMark, coverage and dry-time figures, SCAQMD, LEED v4).
// Earlier descriptions were rewritten from the authoritative old hubss.com product pages and the StreetBond
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
    shortDesc: "Aggregate-reinforced preformed thermoplastic. Traffic tough, proven coast to coast.",
    imageUrl: "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
    gallery: [1,2,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,129,130,133,136,139,143].map(n =>
      `/images/products/traffic-patterns-xd/traffic-patterns-xd-${String(n).padStart(2, "0")}.jpg`),
    description: "TrafficPatternsXD is the toughest material in the range, built for performance in Canada. Aggregate-reinforced preformed thermoplastic, 150 mil thick, with anti-skid aggregate rated 8–9 on the Mohs scale running through the full cross-section — so the grip lasts as long as the colour. It is heat-fused into asphalt or concrete, not laid on it, which is what makes it hold under plow blades, road salt and the freeze-thaw that follows. Proven in high traffic and under concentrated wheel loads, with high colour contrast for increased safety, and specified by Canadian transit authorities, municipalities and stakeholders across Canada for crosswalks, entrances, transit corridors and streetscapes.",
    specs: [
      { label: "Material", value: "Aggregate-reinforced preformed thermoplastic" },
      { label: "Thickness", value: "150 mil" },
      { label: "Aggregate", value: "8–9 Mohs — through the full cross-section" },
      { label: "Skid Resistance", value: "60 BPN — ASTM E303" },
      { label: "Bond", value: "Heat-fused to asphalt or concrete" },
      { label: "Service Life", value: "10+ years" },
    ],
    // Expanded per Vernon's final audit: BRT corridors, high-volume crosswalks, bus priority, intersections, civic plazas.
    relatedApplications: ["crosswalks", "bus-lanes", "pedestrian-safety", "public-spaces", "traffic-calming"],
  },
  {
    name: "TrafficPatterns",
    slug: "traffic-patterns",
    shortDesc: "Preformed thermoplastic. You design it, we build it, we make it part of the road.",
    imageUrl: "/images/products/traffic-patterns/traffic-patterns-01.jpg",
    gallery: gallery("traffic-patterns", "traffic-patterns", 86, "jpg", [65, 69]),
    description: "TrafficPatterns is preformed thermoplastic, factory-made to your design at 125 mil and heat-fused into asphalt or concrete so it becomes part of the road. Anti-skid aggregate is intermixed through the full cross-section, not broadcast across the top — so the grip lasts as long as the colour. Open to traffic within hours of installation, and engineered for snowplow blades, de-icing salts and Canadian freeze-thaw cycling. Customisable to community artwork: the same material carries a standard crossing, an entrance feature and an Indigenous-designed crosswalk. Specified by Canadian municipalities coast to coast for crosswalks, entrance features, parks and retail.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "125 mil" },
      { label: "Aggregate", value: "Anti-skid — intermixed through the full cross-section" },
      { label: "Skid Resistance", value: "60 BPN — ASTM E303" },
      { label: "Open to Traffic", value: "Hours" },
      { label: "Service Life", value: "8+ years" },
    ],
    // Expanded per Vernon: crosswalks, parks, schools (→playgrounds), public spaces, parking lots.
    relatedApplications: ["crosswalks", "parks-paths", "playgrounds", "public-spaces", "parking-lots", "pedestrian-safety"],
  },
  {
    name: "StreetBond",
    slug: "streetbond",
    seoTitle: "StreetBond® — Durable Asphalt Coatings for Safer Streets",
    seoDescription: "StreetBond is a high-quality pavement coating system that transforms ordinary asphalt and concrete surfaces into vibrant, durable, and functional surfaces for streets, commercial spaces, and public facilities.",
    shortDesc: "The colour system. Engineered to perform in Canada.",
    imageUrl: "/images/products/streetbond/streetbond-01.png",
    brandLogo: {
      src: "/images/products/streetbond/streetbond-logo-color.svg",
      alt: "StreetBond® by PPG",
      width: 220,
      height: 60,
      blendMode: "multiply", // SVG has white bg — multiply makes it transparent on dark
    },
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
    description: "StreetBond is the colour system: a water-based, epoxy-modified acrylic coating for asphalt and concrete, designed to move with the pavement and so avoid the three failures of rigid coatings — cracking, premature wear and slipperiness. Sixty-three standard colours plus full custom colour matching, UV-stable and skid-resistant, engineered for plows and de-icing seasons. It is the coating that locks in every StreetPrint pattern, and on its own it turns parks, playgrounds, courts and plazas into surface colour. A life cycle of 8+ years, and easily refreshed — a worn surface is recoated, not rebuilt.",
    specs: [
      { label: "Type", value: "Water-based, epoxy-modified acrylic" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Colours", value: "63 standard + custom matching" },
      { label: "Flexibility", value: "Moves with the pavement — no cracking, no peeling" },
      { label: "Life Cycle", value: "8+ years / easily refreshed" },
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
    shortDesc: "Stamped asphalt. The original — since 1992, a Canadian invention.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [1,3,5,7,9,10,11,13,15,17,19,21,23,25,27,29,31,32,33,35,37,39,41,43,45,47,49,51,53,55,56,57,59,61,63,65,67,69,71,73,75,77,79,80,81,83,85,87,89,91].map(n => {
      const ext = [57, 63].includes(n) ? "png" : "jpg";
      return `/images/products/streetprint/streetprint-${String(n).padStart(2, "0")}.${ext}`;
    }),
    description: "StreetPrint is the original stamped asphalt — a Canadian invention, installed since 1992. Patterns are stamped into new or existing asphalt, then coloured and sealed with StreetBond coatings. The surface stays flush: nothing for a plow blade to catch, no joints to weed, no pavers to settle, and the asphalt stays flexible. Brick, cobble, herringbone or a custom pattern goes in with the pavement already there — reheat, stamp, coat — with no removal, no repaving and no haul-away. In Canadian service that is a 10–20 year surface, specified for crosswalks, driveways, plazas and heritage streetscapes.",
    specs: [
      { label: "System", value: "In-place stamping + StreetBond coating" },
      { label: "Process", value: "Reheat · Stamp · Coat" },
      { label: "Patterns", value: "Standard and custom options" },
      { label: "Base", value: "New or existing asphalt" },
      { label: "Service Life", value: "10–20 years" },
      { label: "Snowplow Safe", value: "Yes — flush surface, nothing to catch" },
    ],
    // Expanded per Vernon: crosswalks, driveways, plazas (public-spaces), parks/paths, townhomes,
    // heritage districts (community-branding), public art settings.
    relatedApplications: ["crosswalks", "private-driveways", "residential-driveways", "public-spaces", "parks-paths", "townhomes", "community-branding", "public-art", "commercial-spaces"],
  },

  // ── Specialty & Regulatory Group ───────────────────────────────────────────────────────────────────────────────────────────────────────────
  {
    name: "DecoMark",
    slug: "decomark",
    // The catalogue hero is a portrait photograph with the medallion in its
    // lower half; a centred crop shows concrete. Aim the banner at the artwork.
    heroPosition: "center 74%",
    seoTitle: "DecoMark — Custom Horizontal Graphics and Wayfinding",
    seoDescription: "Elevate your brand with durable custom horizontal graphics, civic art, and pavement wayfinding solutions.",
    shortDesc: "Custom graphics. Community identity. Public art.",
    imageUrl: "/images/products/decomark/decomark-01.jpg",
    gallery: gallery("decomark", "decomark", 78),
    description: "DecoMark is preformed thermoplastic custom graphics: factory-fabricated to your vector artwork in the TrafficPatterns colour palette — standard and premium options — then heat-fused to asphalt or concrete. Community identity, commemorative art, wayfinding and civic landmarks at street scale: crests, BIA marks, recognition markers and rail-safety reminders that hold their contrast through freeze-thaw and plow seasons. It sits flush to grade, slip-resistant, and stays bright in every season.",
    specs: [
      { label: "System", value: "Preformed thermoplastic" },
      { label: "Design", value: "Vector artwork" },
      { label: "Colour", value: "Standard and premium options" },
      { label: "Installation", value: "Heat-fused to the substrate" },
      { label: "Surfaces", value: "Asphalt and concrete" },
    ],
    // Expanded per Vernon: public art, community branding, wayfinding (public-spaces),
    // schools (playgrounds), parks/paths, crosswalks.
    relatedApplications: ["public-art", "community-branding", "public-spaces", "playgrounds", "parks-paths", "crosswalks"],
  },
  {
    name: "MMAX",
    slug: "mmax",
    shortDesc: "MMA area markings. Methyl methacrylate. Fast installation. Built for Canada.",
    imageUrl: "/images/products/mmax/mmax-01.jpg",
    gallery: gallery("mmax", "mmax", 33),
    description: "MMAX is a methyl methacrylate (MMA) resin system for lane and area markings — red bus lanes, green bike lanes, transit-priority corridors and traffic-calming zones. It cures traffic-ready in 45–60 minutes, so an active corridor goes in fast without community disruption, and it holds colour where painted treatments are gone within a season. Embedded aggregate gives a non-slip surface, and it applies at +3°C and rising, which matters in a Canadian season. Available in 8 standard and 15 premium colours, with best-in-class performance where the loads concentrate: stop pads, turning movements and queue jumps.",
    specs: [
      { label: "Material", value: "Methyl methacrylate (MMA) resin" },
      { label: "Cure", value: "45–60 min — traffic-ready" },
      { label: "Traction", value: "Embedded aggregate / non-slip" },
      { label: "Min. Temp", value: "+3°C and rising" },
      { label: "Colours", value: "8 standard + 15 premium" },
    ],
    // Expanded per Vernon: bike lanes, bus lanes, BRT corridors (→bus-lanes also), crosswalks, traffic-calming.
    relatedApplications: ["bike-lanes", "bus-lanes", "crosswalks", "traffic-calming", "pedestrian-safety"],
  },
  {
    name: "StreetBondSR",
    slug: "streetbondsr",
    seoTitle: "StreetBondSR™ — Solar Reflective Asphalt Coatings",
    seoDescription: "Solar reflective, LEED-aligned coatings for asphalt and concrete that reduce urban heat island effect and support sustainable hardscape design across Canada.",
    shortDesc: "Solar reflective coating. Mitigating the urban heat island effect.",
    imageUrl: "/images/products/streetbondsr/streetbondsr-02.jpg",
    gallery: [
      "/images/products/streetbondsr/streetbondsr-01.png",
      "/images/products/streetbondsr/streetbondsr-02.jpg",
      "/images/products/streetbondsr/streetbondsr-05.jpg",
      "/images/products/streetbondsr/streetbondsr-07.jpg",
      "/images/products/streetbondsr/streetbondsr-08.jpg",
    ],
    description: "StreetBondSR is StreetBond formulated to reflect rather than absorb — the same flexible chemistry, engineered for cooler surfaces. Twelve colours carry an initial solar reflectance of 0.33 or higher and can contribute to the LEED v5 Sustainable Sites credit for urban heat island reduction (non-roof). Applied to asphalt for parking, plazas, schools and LEED projects, it lowers surface temperature relative to dark pavement while carrying the durability and slip resistance of the StreetBond system, with a life cycle of 8+ years.",
    specs: [
      { label: "Type", value: "Solar reflective epoxy-modified acrylic" },
      { label: "Solar Reflectance", value: "≥ 0.33 initial — 12 colours" },
      { label: "LEED", value: "v5 SS credit: urban heat island (non-roof)" },
      { label: "Surfaces", value: "Asphalt" },
      { label: "Life Cycle", value: "8+ years" },
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
    shortDesc: "Inlaid thermoplastic. Zero profile above grade.",
    imageUrl: "/images/products/duratherm/duratherm-01.jpg",
    gallery: gallery("duratherm", "duratherm", 36),
    description: "DuraTherm is thermoplastic heat-fused into a stamped surface. The marking is inlaid into a stamped impression so the finished surface sits flush with the road — nothing for a plow blade to catch, nothing to trip on, no shear damage through winter maintenance. The look of a decorative crosswalk with zero profile above grade, bonded to the asphalt substrate. Specified for crosswalks, speed bumps, traffic calming and identity work where winter maintenance would strip anything that sits on top.",
    specs: [
      { label: "Install", value: "Inlaid into a stamped surface" },
      { label: "Profile", value: "Zero — flush with the road" },
      { label: "Snowplow Safe", value: "Yes — no shear risk" },
      { label: "Bond", value: "Heat-fused to asphalt substrate" },
    ],
    // Expanded per Vernon: streetscape inlays (community-branding), heritage districts, pedestrian plazas (public-spaces).
    relatedApplications: ["crosswalks", "community-branding", "public-spaces", "parking-lots", "pedestrian-safety"],
  },
  {
    name: "DuraShield",
    slug: "durashield",
    shortDesc: "Pavement maintenance coating. Maintain a surface — do not replace it.",
    imageUrl: "/images/products/durashield/durashield-01.jpg",
    gallery: gallery("durashield", "durashield", 10),
    description: "DuraShield is a two-component, epoxy-modified acrylic maintenance coating for asphalt. It resists fuel, oil and de-icing agents, cools the surface with solar-reflective options, and protects the substrate underneath — extending the life cycle of the pavement instead of replacing it. Specified for parking lots, driveways, pathways and LEED sites where the asphalt is sound and the surface needs protecting.",
    specs: [
      { label: "Type", value: "Two-component epoxy-modified acrylic" },
      { label: "Surfaces", value: "Asphalt" },
      { label: "Chemical Resistance", value: "Fuel, oil, de-icing agents" },
      { label: "Solar Reflectance", value: "Optional — SR Gray 0.35 on the 2026 colour card" },
      { label: "Purpose", value: "Preserves and protects asphalt" },
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
    shortDesc: "Road marking symbols. Arrows. Stop bars. Legends. Bike symbols. Custom.",
    imageUrl: "/images/products/premark/premark-01.jpg",
    gallery: gallery("premark", "premark", 11),
    description: "PreMark is preformed thermoplastic for regulatory road markings: arrows, stop bars, yield triangles, school legends, bike symbols and ladder lines, pre-cut to specification. Heat-applied by torch — no stencils, no curing window, drive on immediately. Integrated glass beads for retroreflectivity, 125 mil standard with a 90 mil ViziGrip option, and a service life of 6–8 years. Provincially approved across Canada.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "125 mil standard / 90 mil ViziGrip" },
      { label: "Installation", value: "Heat-applied — drive on immediately" },
      { label: "Retroreflectivity", value: "Integrated glass beads" },
      { label: "Service Life", value: "6–8 years" },
      { label: "Approval", value: "Provincially approved across Canada" },
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
    // De-brand swap (companion to fix/aggrefill-hero): the prior hero
    // (`chipfill-aggrefill-bags.jpg`) showed two GEVEKO-branded supplier
    // bags. Swapped to `chipfill-road-repair.webp` — cinematic clean
    // pothole hero (the problem ChipFill solves), zero branding in frame.
    // Gallery rebuilt to clean-only shots. Bank still thin — proper
    // finished-repair photography would be the right long-term fix.
    imageUrl: "/images/products/chipfill/chipfill-road-repair.webp",
    heroPosition: "center 60%",
    brandLogo: {
      src: "/images/products/chipfill/chipfill-logo.svg",
      alt: "ChipFill by HUB Surface Systems",
      width: 180,
      height: 44,
    },
    gallery: [
      "/images/products/chipfill/chipfill-road-repair.webp",
      "/images/products/chipfill/chipfill-02.jpg",
      "/images/products/chipfill/chipfill-03.jpg",
    ],
    description: "ChipFill is a heat-activated preformed pothole repair material engineered for permanent restoration of road surface damage. The material is laid into the prepared excavation and activated with a propane heat torch — no specialized equipment, no hot-mix plant, no aggregate batching. Once heated, ChipFill conforms to the contours of the damage and bonds chemically to the surrounding asphalt or concrete, sealing the substrate from the water intrusion that accelerates freeze-thaw damage and turns minor surface defects into deep structural failures. Deployable year-round regardless of temperature or weather conditions — a critical advantage in Canadian climates where hot-mix asphalt plants close seasonally and potholes peak in early spring. Sets rapidly so the lane can reopen to traffic within minutes of application. Specified by Canadian municipalities and road maintenance contractors for routine patrol patching, emergency response programs, utility cut restoration, edge joint repair, and pedestrian infrastructure maintenance across roads, parking lots, sidewalks, and pathways.",
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
    // De-brand swap: the prior hero (`aggrefill-application.webp` /
    // `aggrefill-01.jpg`) showed a GEVEKO-branded supplier bag, violating
    // the no-supplier-names standing rule. Switched to `aggrefill-02.jpg`
    // — the only AggreFill-specific shot in the bank with zero visible
    // branding (asphalt patch being smoothed, in-progress, no bags).
    // Gallery rebuilt from the same bank, supplier-branded shots removed.
    // NOTE for Vernon: the AggreFill image bank is thin — a proper
    // finished-pothole-repair hero (clean cured patch, no supplier
    // packaging in frame) is the right long-term fix.
    imageUrl: "/images/products/aggrefill/aggrefill-02.jpg",
    heroPosition: "center center",
    brandLogo: {
      src: "/images/products/aggrefill/aggrefill-logo.svg",
      alt: "AggreFill by HUB Surface Systems",
      width: 200,
      height: 44,
    },
    gallery: [
      "/images/products/aggrefill/aggrefill-02.jpg",
      "/images/products/chipfill/chipfill-road-repair.webp",
      "/images/products/aggrefill/aggrefill-03.jpg",
    ],
    description: "AggreFill is a pre-coated aggregate filler used in combination with ChipFill to permanently repair larger potholes — up to approximately 1 m² in diameter. Where the damage is too deep or wide for a stand-alone material, AggreFill provides the structural mass to fill the void; ChipFill bonds the aggregate matrix and seals the repaired surface flush. The combined system applies cold then receives a heat torch finish, bonding chemically to the surrounding asphalt or concrete substrate and returning the lane to traffic within minutes. Year-round deployment regardless of weather or season — eliminating the dependency on hot-mix plant availability that leaves deep damage unrepaired through Canadian winters. Specified for the deeper road surface failures, parking lot craters, industrial-site damage, and utility cut restoration where conventional cold-mix patching migrates under heavy wheel loading or fails to achieve durable bond at substrate edges. The AggreFill + ChipFill system is a permanent repair solution, not a seasonal temporary patch.",
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
    shortDesc: "Cold-mix polymer repair for potholes, spalls, and utility cuts. Back in service in under an hour.",
    imageUrl: "/images/products/fast-patch/fastpatch-repaired.jpg",
    heroPosition: "center 50%",
    brandLogo: {
      src: "/images/products/fast-patch/fast-patch-logo.webp",
      alt: "Fast Patch DPR",
      width: 200,
      height: 44,
    },
    gallery: [
      "/images/products/fast-patch/fastpatch-repaired.jpg",
      "/images/products/fast-patch/fastpatch-bucket.jpg",
      "/images/products/fast-patch/fast-patch-01.png",
    ],
    description: "Fast Patch DPR is an easy-to-apply distressed pavement repair material for asphalt and concrete — a unique polymer blend of recycled and renewable materials engineered for high-strength, fast-return-to-service repair of potholes, spalls, joints, wheel paths, and utility cuts. Minimal site preparation required: clean the area, apply the material, compact, and the repaired surface is back in service in less than 45 minutes. The optional Fast Patch Kicker accelerator shortens cure time further in cooler conditions, making Fast Patch DPR deployable year-round across Canadian temperature ranges where traditional cold-mix products lose performance. Bonds chemically to the surrounding asphalt or concrete substrate with excellent freeze-thaw resistance and impact absorption — this is a permanent repair, not a seasonal patch. Completely odourless, making it suitable for indoor environments including warehouse floors, loading docks, and underground parkades where ventilation constraints rule out petroleum-based materials. Used by Canadian municipalities, property managers, and contractors on roadways and bridges, parking lots, sidewalks and curbs (trip-hazard remediation), and any public or commercial environment where extended downtime is not an option.",
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
];

// Aquaphalt removed as a product line (2026-05-12, Vernon). Page and all references dropped.
