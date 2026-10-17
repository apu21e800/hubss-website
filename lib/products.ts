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

// 17 Oct 2026 (Doug's copy round: "get the phraseology right, about the systems technology that's
// accurate but not over technical"): every line below was read against the maker's sheet (PPG
// Ennis-Flint TS001 to TS005 and TS007, the MMAX brochure, GAF/StreetBond, Geveko's ChipFill listing,
// WVCO's Fast Patch DPR sheet) and docs/GLOSSARY.md. How each system goes in is now the maker's
// description (surface-applied and bonds; stamped into the asphalt; inlaid), claims with no source are
// gone (PreMark "provincially approved", AirMark helipads and jet blast, Fast Patch "under 45 minutes"),
// "service life" is the one term, the hero lines are the Product Portfolio Book's own, and the SEO
// titles are the 3 Oct 2026 list (product name first, then the plain words). Sanity overrides these
// fields: `npm run sync:products:dry`, then `npm run sync:products` on Vern's PC.
//
// Product copy re-based on the HUBSS 2026 catalogue (Figma, read 7 Sep 2026) — Doug-approved text,
// so shortDesc / description / specs for the ten catalogue systems say what the printed page says and
// nothing the printed page does not (dropped: glass-bead claims on TrafficPatterns/XD, a "milled groove"
// for DuraTherm, "our production facility" for DecoMark, coverage and dry-time figures, SCAQMD, LEED v4).
// Earlier descriptions were rewritten from the authoritative old hubss.com product pages and the StreetBond
// manufacturer canonical source. Doug's specific edits are preserved verbatim where they corrected facts
// (DuraShield = coating not penetrating, AirMark non-runway, PreMark 125 mil standard, MMAX +3°C and rising,
// TrafficPatterns 125 mil, StreetBond legacy HUBSS voice). Related-applications audited against Vernon's
// authoritative mapping — Bike Lanes is MMAX + PreMark only, etc.
//
// RELATIONS (28 Sep 2026, QA pa#31): relatedApplications here and relatedProducts in lib/applications.ts
// must mirror each other, or "Where X goes" and "Systems for Y" contradict each other. The authority is
// the Product Book SPECIFY lists (lib/application-catalogue.ts): every pair the book names is listed on both
// sides. A pair the book does not name stays only where both sides already listed it, or where the
// product's own spread (`uses` in lib/product-catalogue.ts) names the application. The one exception is
// the three repair products, which point one way: repair suits any asphalt, and no application page
// lists them.

export const products: Product[] = [
  // ── Flagship Group ─────────────────────────────────────────────────────────────────────────────────────
  {
    name: "TrafficPatternsXD",
    slug: "traffic-patterns-xd",
    seoTitle: "TrafficPatternsXD heavy-duty thermoplastic",
    seoDescription: "Aggregate-reinforced preformed thermoplastic, 150 mil, stamped into the asphalt for the toughest crosswalks, entrances and transit corridors. 10+ years.",
    shortDesc: "Aggregate-reinforced preformed thermoplastic. Traffic tough, proven coast to coast.",
    imageUrl: "/images/products/traffic-patterns-xd/traffic-patterns-xd-03.jpg",
    gallery: [1,2,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127,129,130,133,136,139,143].map(n =>
      `/images/products/traffic-patterns-xd/traffic-patterns-xd-${String(n).padStart(2, "0")}.jpg`),
    description: "TrafficPatternsXD is the toughest material in the product range, built for performance in Canada. Aggregate-reinforced preformed thermoplastic, 150 mil thick, with anti-skid aggregate rated 8–9 on the Mohs scale running through the full cross-section, so the grip lasts as long as the colour. It is heated on prepared asphalt and stamped through into the top of the asphalt, which is what makes it hold under plow blades, road salt and the freeze-thaw that follows. Proven in high traffic and under concentrated wheel loads, with high colour contrast for increased safety, and specified by Canadian transit authorities, municipalities and commercial stakeholders across Canada for crosswalks, entrances, transit corridors and streetscapes.",
    specs: [
      { label: "Material", value: "Aggregate-reinforced preformed thermoplastic" },
      { label: "Thickness", value: "150 mil" },
      { label: "Aggregate", value: "8–9 Mohs, through the full cross-section" },
      { label: "Skid resistance", value: "60 BPN · ASTM E303" },
      { label: "Installation", value: "Heated and stamped into the asphalt" },
      { label: "Surfaces", value: "Asphalt" },
      { label: "Service life", value: "10+ years" },
    ],
    // Expanded per Vernon's final audit: BRT corridors, high-volume crosswalks, bus priority, intersections, civic plazas.
    // 28 Sep 2026 (pa#31): public-spaces out (the book's Public Spaces spread does not specify XD); the
    // Community Branding, Parking Lots and Commercial Spaces spreads, which do, added.
    relatedApplications: ["crosswalks", "bus-lanes", "pedestrian-safety", "traffic-calming", "community-branding", "parking-lots", "commercial-spaces"],
  },
  {
    name: "TrafficPatterns",
    slug: "traffic-patterns",
    seoTitle: "TrafficPatterns thermoplastic crosswalks",
    seoDescription: "Preformed thermoplastic crosswalks and entrance features made to your design at 125 mil, with anti-skid aggregate through the material. 8+ years.",
    shortDesc: "Preformed thermoplastic. You design it, we build it, our certified installers make it last.",
    imageUrl: "/images/products/traffic-patterns/traffic-patterns-01.jpg",
    gallery: gallery("traffic-patterns", "traffic-patterns", 86, "jpg", [65, 69]),
    description: "TrafficPatterns is preformed thermoplastic, factory-made to your design at 125 mil and heat-applied to asphalt or concrete, where it bonds to the surface. Anti-skid aggregate is intermixed through the full cross-section, so the grip lasts as long as the colour. Open to traffic within hours of installation, and engineered for snowplow blades, de-icing salts and Canadian freeze-thaw cycling. Custom designs to fit with the community: the same material carries a standard crossing, an entrance feature and an Indigenous-designed crosswalk. Specified by Canadian municipalities coast to coast for crosswalks, entrance features, parks and parking lots.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "125 mil" },
      { label: "Aggregate", value: "Anti-skid, intermixed through the full cross-section" },
      { label: "Skid resistance", value: "60 BPN · ASTM E303" },
      { label: "Installation", value: "Heat-applied, bonds to the surface" },
      { label: "Open to traffic", value: "Hours" },
      { label: "Service life", value: "8+ years" },
    ],
    // Expanded per Vernon: crosswalks, parks, schools (→playgrounds), public spaces, parking lots.
    // 28 Sep 2026 (pa#31): public-spaces out (not in that spread's SPECIFY); Community Branding and
    // Public Art, whose spreads specify TrafficPatterns, added.
    relatedApplications: ["crosswalks", "parks-paths", "playgrounds", "parking-lots", "pedestrian-safety", "community-branding", "public-art"],
  },
  {
    name: "StreetBond",
    slug: "streetbond",
    seoTitle: "StreetBond pavement coating",
    seoDescription: "StreetBond: a water-based, epoxy-modified acrylic pavement coating for asphalt and concrete. 63 standard colours, custom matching, moves with the pavement.",
    shortDesc: "The colour. Engineered for life in Canada.",
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
    description: "StreetBond is the colour: a water-based, epoxy-modified acrylic pavement coating for asphalt and concrete, designed to move with the pavement and so avoid the three failures of rigid coatings: cracking, premature wear and being slippery in wet conditions. Sixty-three standard colours plus full custom colour matching, UV-stable and skid-resistant, engineered for plows and de-icing seasons. It is the coating that colours every StreetPrint pattern, and on its own it turns parks, playgrounds, courts and area markings into surface colour. A service life of 8+ years, and easily refreshed: a worn surface is recoated, not rebuilt.",
    specs: [
      { label: "Type", value: "Water-based, epoxy-modified acrylic" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Colours", value: "63 standard + custom matching" },
      { label: "Flexibility", value: "Moves with the pavement: no cracking, no peeling" },
      { label: "Service life", value: "8+ years / easily refreshed" },
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
    // 28 Sep 2026 (pa#31): the four spreads that specify StreetBond and were missing here added.
    // 30 Sep 2026 (QA C2, E18): private-driveways out with its page; the driveway spread specifies
    // StreetPrint alone and Residential Driveways does not list StreetBond back (RELATIONS above).
    relatedApplications: ["bike-lanes", "bus-lanes", "crosswalks", "parking-lots", "public-spaces", "sport-courts", "playgrounds", "parks-paths", "splash-pads", "townhomes", "traffic-calming", "public-art"],
  },
  {
    name: "StreetPrint",
    slug: "streetprint",
    seoTitle: "StreetPrint stamped asphalt",
    seoDescription: "StreetPrint is stamped asphalt: a Canadian invention installed since 1992, with the durability of asphalt and the look of brick, stone or a custom pattern.",
    shortDesc: "Stamped asphalt. The original. Since 1992, a Canadian invention.",
    imageUrl: "/images/products/streetprint/streetprint-01.jpg",
    gallery: [1,3,5,7,9,10,11,13,15,17,19,21,23,25,27,29,31,32,33,35,37,39,41,43,45,47,49,51,53,55,56,57,59,61,63,65,67,69,71,73,75,77,79,80,81,83,85,87,89,91].map(n => {
      const ext = [57, 63].includes(n) ? "png" : "jpg";
      return `/images/products/streetprint/streetprint-${String(n).padStart(2, "0")}.${ext}`;
    }),
    description: "StreetPrint is the original stamped asphalt, a Canadian invention, installed since 1992. Patterns are stamped into new or existing asphalt, then coloured with StreetBond coatings. The surface stays flush: nothing for a plow blade to catch, no joints to weed, no pavers to settle, and the asphalt stays flexible. Brick, cobble, herringbone or a custom pattern goes in with the pavement already there (reheat, stamp, coat), with no removal, no repaving and no haul-away. In Canadian service that is a 10–20 year surface, specified for crosswalks, driveways, plazas and heritage streetscapes.",
    specs: [
      { label: "System", value: "Stamping + StreetBond coating" },
      { label: "Process", value: "Reheat · Stamp · Coat" },
      { label: "Patterns", value: "Standard and custom options" },
      { label: "Base", value: "New or existing asphalt" },
      { label: "Service life", value: "10–20 years" },
      // "Yes: flush surface" printed a double colon after the label (QA B23, 30 Sep 2026). Sanity
      // overrides specs: sync after changing them.
      { label: "Snowplow safe", value: "Yes, flush surface, nothing to catch" },
    ],
    // Expanded per Vernon: crosswalks, driveways, plazas (public-spaces), parks/paths, townhomes,
    // heritage districts (community-branding), public art settings.
    // 28 Sep 2026 (pa#31): Parking Lots and Traffic Calming, whose spreads specify StreetPrint, added.
    // 30 Sep 2026 (QA C2, E18): "private-driveways" gone from this list and the four repair and
    // DuraShield lists below that carried it beside "residential-driveways"; the two pages were one
    // spread and are one page now.
    relatedApplications: ["crosswalks", "residential-driveways", "public-spaces", "parks-paths", "townhomes", "community-branding", "public-art", "commercial-spaces", "parking-lots", "traffic-calming"],
  },

  // ── Specialty & Regulatory Group ───────────────────────────────────────────────────────────────────────────────────────────────────────────
  {
    name: "DecoMark",
    slug: "decomark",
    // The catalogue hero is a portrait photograph with the medallion in its
    // lower half; a centred crop shows concrete. Aim the banner at the artwork.
    heroPosition: "center 74%",
    seoTitle: "DecoMark preformed thermoplastic graphics",
    seoDescription: "DecoMark is preformed thermoplastic cut to your artwork: wayfinding, community branding and public art, heat-applied to asphalt or concrete.",
    shortDesc: "Custom graphics. Community identity. Public art.",
    imageUrl: "/images/products/decomark/decomark-01.jpg",
    gallery: gallery("decomark", "decomark", 78),
    description: "DecoMark is preformed thermoplastic custom graphics: factory-fabricated to your vector artwork in standard and premium colours, then heat-applied to asphalt or concrete, where it bonds to the surface. Community identity, commemorative art, wayfinding and civic landmarks at street scale: crests, BIA marks, recognition markers and rail-safety reminders that hold their contrast through freeze-thaw and plow seasons. Anti-skid aggregate runs through the material, so the grip lasts as the surface wears, and it does not alter the pavement underneath.",
    specs: [
      { label: "System", value: "Preformed thermoplastic" },
      { label: "Design", value: "Vector artwork" },
      { label: "Colour", value: "Standard and premium options" },
      { label: "Installation", value: "Heat-applied, bonds to the surface" },
      { label: "Surfaces", value: "Asphalt and concrete" },
    ],
    // Expanded per Vernon: public art, community branding, wayfinding (public-spaces),
    // schools (playgrounds), parks/paths, crosswalks.
    relatedApplications: ["public-art", "community-branding", "public-spaces", "playgrounds", "parks-paths", "crosswalks"],
  },
  {
    name: "MMAX",
    slug: "mmax",
    seoTitle: "MMAX MMA bike lane and bus lane markings",
    seoDescription: "MMAX methyl methacrylate (MMA) area markings for bus lanes, bike lanes and transit priority lanes: traffic-ready in about an hour, 23 colours.",
    shortDesc: "MMA area markings. Fast installation. Built for tough environments.",
    imageUrl: "/images/products/mmax/mmax-01.jpg",
    gallery: gallery("mmax", "mmax", 33),
    description: "MMAX is a methyl methacrylate (MMA) area marking: a two-part resin with hard aggregate and colourfast pigment, for red bus lanes, green bike lanes, transit priority lanes and traffic calming. It is traffic-ready in about an hour, so an active corridor is marked in one overnight closure. The aggregate gives it grip, and it goes down from 3°C and rising, which matters in a Canadian season. Eight standard and fifteen premium colours.",
    specs: [
      { label: "Material", value: "Methyl methacrylate (MMA) resin" },
      { label: "Cure", value: "45–60 min · traffic-ready" },
      { label: "Traction", value: "Embedded aggregate, skid-resistant" },
    ],
    // Expanded per Vernon: bike lanes, bus lanes, BRT corridors (→bus-lanes also), crosswalks, traffic-calming.
    // 28 Sep 2026 (pa#31): crosswalks out. The Crosswalks spread does not specify MMAX, its page never
    // listed it, and MMAX's own spread names bus lanes, bike lanes, calming and transit.
    relatedApplications: ["bike-lanes", "bus-lanes", "traffic-calming", "pedestrian-safety"],
  },
  {
    name: "StreetBondSR",
    slug: "streetbondsr",
    seoTitle: "StreetBondSR solar reflective coating",
    seoDescription: "StreetBondSR is StreetBond formulated to reflect: twelve colours with a solar reflectance of 0.33 or higher, for the LEED v5 heat island credit.",
    shortDesc: "Solar reflective coating. Mitigating the urban heat island effect.",
    imageUrl: "/images/products/streetbondsr/streetbondsr-02.jpg",
    gallery: [
      "/images/products/streetbondsr/streetbondsr-01.png",
      "/images/products/streetbondsr/streetbondsr-02.jpg",
      "/images/products/streetbondsr/streetbondsr-05.jpg",
      "/images/products/streetbondsr/streetbondsr-07.jpg",
      "/images/products/streetbondsr/streetbondsr-08.jpg",
    ],
    description: "StreetBondSR is StreetBond formulated to reflect rather than absorb: the same flexible chemistry, engineered for cooler surfaces. Twelve colours carry an initial solar reflectance of 0.33 or higher and can contribute to the LEED v5 Sustainable Sites credit for urban heat island reduction (non-roof). Applied to asphalt for parking, plazas, schools and LEED projects, it lowers surface temperature relative to dark pavement while carrying the durability and slip resistance of the StreetBond system, with a service life of 8+ years.",
    specs: [
      { label: "Type", value: "Solar reflective epoxy-modified acrylic" },
      { label: "Solar reflectance", value: "≥ 0.33 initial · 12 colours" },
      { label: "LEED", value: "v5 SS credit: urban heat island (non-roof)" },
      { label: "Surfaces", value: "Asphalt" },
      { label: "Service life", value: "8+ years" },
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
    // 28 Sep 2026 (pa#31): parks-paths and commercial-spaces out (no spread specifies SR there, and neither
    // page listed it); Splash Pads and Sport Courts, whose spreads do, added. Parking stays: SR's own
    // spread names it.
    relatedApplications: ["leed-urban-heat-island", "parking-lots", "playgrounds", "splash-pads", "sport-courts"],
  },
  {
    name: "DuraTherm",
    slug: "duratherm",
    seoTitle: "DuraTherm inlaid thermoplastic crosswalks",
    seoDescription: "DuraTherm is preformed thermoplastic inlaid in stamped asphalt: a decorative crosswalk that sits flush with the road, nothing for a plow blade to catch.",
    shortDesc: "Inlaid thermoplastic. Zero profile above grade.",
    imageUrl: "/images/products/duratherm/duratherm-01.jpg",
    gallery: gallery("duratherm", "duratherm", 36),
    description: "DuraTherm is thermoplastic inlaid in a stamped surface. The asphalt is heated and stamped first; precut 90 mil thermoplastic is set into the impressions and bonded with an infrared heater, so the finished surface sits flush with the road: nothing for a plow blade to catch, nothing to trip on, no shear damage through winter maintenance. The look of a decorative crosswalk with zero profile above grade. Specified for crosswalks, speed tables, traffic calming and identity work where winter maintenance would strip anything that sits on top.",
    specs: [
      { label: "Install", value: "Inlaid into a stamped surface" },
      { label: "Profile", value: "Zero: flush with the road" },
      { label: "Snowplow safe", value: "Yes, no shear risk" }, // as the spread prints it; the colon went 30 Sep 2026 (QA B23)
      { label: "Bond", value: "Heat-fused to asphalt substrate" },
    ],
    // Expanded per Vernon: streetscape inlays (community-branding), heritage districts, pedestrian plazas (public-spaces).
    // 28 Sep 2026 (pa#31): pedestrian-safety out (not in that spread's SPECIFY); Bus Lanes, whose
    // High-Traffic Corridors spread specifies DuraTherm, added.
    relatedApplications: ["crosswalks", "community-branding", "public-spaces", "parking-lots", "bus-lanes"],
  },
  {
    name: "DuraShield",
    slug: "durashield",
    seoTitle: "DuraShield asphalt maintenance coating",
    seoDescription: "DuraShield is a two-component, epoxy-modified acrylic maintenance coating for asphalt. It resists fuel, oil and de-icing agents and protects the pavement.",
    shortDesc: "Pavement maintenance coating. Maintain a surface instead of replacing it.",
    imageUrl: "/images/products/durashield/durashield-01.jpg",
    gallery: gallery("durashield", "durashield", 10),
    description: "DuraShield is a two-component, epoxy-modified acrylic maintenance coating for asphalt. It resists fuel, oil and de-icing agents, cools the surface with solar-reflective options, and protects the substrate underneath, extending the service life of the pavement instead of replacing it. Specified for parking lots, driveways, pathways and LEED sites where the asphalt is sound and the surface needs protecting.",
    specs: [
      { label: "Type", value: "Two-component epoxy-modified acrylic" },
      { label: "Surfaces", value: "Asphalt" },
      { label: "Chemical resistance", value: "Fuel, oil, de-icing agents" },
      { label: "Solar reflectance", value: "Optional (SR Gray 0.35 on the 2026 colour card)" },
    ],
    // Expanded per Vernon: pedestrian areas, residential roadways, heat-island mitigation surfaces.
    // 28 Sep 2026 (pa#31): pedestrian-safety out (not in that spread's SPECIFY); Townhomes, whose spread
    // specifies DuraShield, added.
    relatedApplications: ["parking-lots", "residential-driveways", "parks-paths", "leed-urban-heat-island", "townhomes"],
  },
  {
    name: "AirMark",
    slug: "airmark",
    seoTitle: "AirMark airfield marking thermoplastic",
    seoDescription: "AirMark is preformed thermoplastic for airfield markings on taxiways, aprons and other non-runway surfaces. Retroreflective, applied by certified crews.",
    // 28 Sep 2026 (QA pa#12, pa#36): "Used in Canada's busiest airports" is in no HUB document (the
    // AirMark brochure in /public/docs names no airport or country), so it is gone from the line and the
    // body. The body is cut to four sentences of facts it already stated. Sanity overrides shortDesc,
    // description and specs: sync after changing them.
    shortDesc: "Preformed thermoplastic for non-runway airfield markings.",
    imageUrl: "/images/products/airmark/airmark-01.jpg",
    gallery: gallery("airmark", "airmark", 22),
    // 17 Oct 2026: "helipads", "jet blast" and "rubber removal" are on no AirMark sheet (TS007 names
    // taxiways, hold positions, aprons, ramps, parking and tie-down, vehicle roadways; fuels, lubricants
    // and de-icers), so they are gone; the colours are the sheet's five.
    description: "AirMark is preformed thermoplastic for airfield markings on taxiways, aprons, hold positions and other non-runway surfaces. Glass beads are embedded through the full cross-section of the material, so retroreflectivity holds as the surface wears. Certified crews heat-apply it, and it resists aviation fuels, lubricants and de-icers. It is specified for taxiway markings, hold positions, apron and ramp markings, aircraft parking and tie-down positions, and airside vehicle roadways.",
    // Only what the paragraph does not say (copy review, 17 Oct 2026): the
    // uses, the beads and the crews are in the text twenty pixels above.
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Colours", value: "Five standard: white, yellow, red, black, pink" },
      { label: "Resists", value: "Aviation fuels, lubricants, de-icers" },
      // No HUB or PPG document gives AirMark a service life in years, so the sheet shows none
      // (until 17 Oct 2026 it said "Multi-year, no annual repainting").
      { label: "Installation", value: "Heat-applied, bonds to the surface" },
    ],
    // Vernon: taxiways, aprons, helipads, holding-position signs — airfield surfaces.
    relatedApplications: ["airports", "regulatory-markings"],
  },
  {
    name: "PreMark",
    slug: "premark",
    seoTitle: "PreMark thermoplastic road symbols",
    seoDescription: "PreMark is preformed thermoplastic for arrows, stop bars, legends and bike symbols, pre-cut to specification and heat-applied without stencils.",
    shortDesc: "Road marking symbols. Arrows. Stop bars. Legends. Bike symbols. Custom.",
    imageUrl: "/images/products/premark/premark-01.jpg",
    gallery: gallery("premark", "premark", 11),
    description: "PreMark is preformed thermoplastic for regulatory road markings: arrows, stop bars, yield triangles, school legends, bike symbols and ladder lines, pre-cut to specification. Heat-applied by torch: no stencils, no curing window, drive on immediately. Integrated glass beads for retroreflectivity, 125 mil standard with a 90 mil ViziGrip option, and a service life of 6–8 years.",
    specs: [
      { label: "Material", value: "Preformed thermoplastic" },
      { label: "Thickness", value: "125 mil standard / 90 mil ViziGrip" },
      { label: "Installation", value: "Heat-applied: drive on immediately" },
      { label: "Retroreflectivity", value: "Integrated glass beads" },
      { label: "Service life", value: "6–8 years" },
      // "Provincially approved across Canada" (a row here and a sentence above until 17 Oct 2026) names
      // no province's approved-products list; it returns when one is cited.
    ],
    // Expanded per Vernon: bike lanes, regulatory markings, symbols/arrows, school zones (playgrounds), crosswalks.
    // 28 Sep 2026 (pa#31): playgrounds and traffic-calming out. Neither spread specifies PreMark, neither
    // page listed it, and PreMark's own spread names bike lanes, crosswalks, regulatory and parking.
    relatedApplications: ["bike-lanes", "regulatory-markings", "crosswalks", "parking-lots", "pedestrian-safety"],
  },


  // ── Asphalt & Concrete Repair ─────────────────────────────────────────────────────────────────────────
  // The eyebrow is the family's name from lib/product-categories.ts. Sanity
  // overrides it: after changing it here, run `npm run sync:products:dry`,
  // then `npm run sync:products` (docs/SANITY-COPY-SYNC.md).
  {
    name: "ChipFill",
    slug: "chipfill",
    eyebrow: "Asphalt & Concrete Repair",
    seoTitle: "ChipFill pothole repair",
    seoDescription: "ChipFill is thermoplastic pothole repair in a bag: poured into the hole and heated with a torch, it bonds to asphalt or concrete and reopens in minutes.",
    // 17 Oct 2026: not "preformed" (that is a factory-cut sheet); ChipFill is thermoplastic in small
    // chips, poured and heated in place (Geveko's listing with Alberta Transportation).
    shortDesc: "Thermoplastic chips for permanent pothole repair, heated in place. Year-round, all-weather.",
    // De-brand swap (companion to fix/aggrefill-hero): the prior hero
    // (`chipfill-aggrefill-bags.jpg`) showed two GEVEKO-branded supplier
    // bags. Swapped to `chipfill-road-repair.webp` — cinematic clean
    // pothole hero (the problem ChipFill solves), zero branding in frame.
    // Gallery rebuilt to clean-only shots. Bank still thin — proper
    // finished-repair photography would be the right long-term fix.
    // 17 Oct 2026: chipfill-application.jpg (1200px, the chips poured into
    // the hole, the bag at the edge) replaces the 640px pothole render that
    // could not fill a banner; the product page shows it over Studio's
    // small hero (CODE_HERO_WIDTHS in app/products/[slug]/page.tsx).
    imageUrl: "/images/products/chipfill/chipfill-application.jpg",
    heroPosition: "center 62%",
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
    // Cut to four sentences, 28 Sep 2026 (QA pa#36): the same facts, without the 180-word paragraph.
    description: "ChipFill is thermoplastic in small chips: poured into the prepared hole, levelled and heated with a propane torch, so it needs no specialized equipment and no hot-mix plant. Once heated, it conforms to the shape of the damage and bonds to the surrounding asphalt or concrete, sealing out the water that drives freeze-thaw damage. It can be installed year-round in any weather, and the lane reopens to traffic within minutes. It is used for patrol patching, emergency repairs, utility cuts and edge joints on roads, parking lots, sidewalks and pathways.",
    specs: [
      { label: "Type", value: "Thermoplastic repair chips, heated in place" },
      { label: "Equipment", value: "A propane torch" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Weather", value: "Any, year-round" },
      { label: "Back in service", value: "Minutes" },
      { label: "Best for", value: "Smaller potholes, cracks, joints" },
    ],
    // ChipFill/AggreFill/Fast Patch DPR — pothole + crack repair across all paved surfaces.
    // One-way on purpose (pa#31, 28 Sep 2026): no Product Book spread specifies a repair product, so the
    // application pages do not list them back. See RELATIONS at the top of this file.
    relatedApplications: ["parking-lots", "residential-driveways", "parks-paths", "commercial-spaces", "townhomes"],
  },
  {
    name: "AggreFill",
    slug: "aggrefill",
    eyebrow: "Asphalt & Concrete Repair",
    // "Up to 1 m²" dropped from the line, body and spec, 28 Sep 2026 (QA pa#12): no document in
    // /public/docs states it, and "1 m² in diameter" mixed an area with a length.
    seoTitle: "AggreFill pothole repair aggregate",
    seoDescription: "AggreFill is pre-coated aggregate for larger potholes, used with ChipFill: the aggregate fills the hole, the heated ChipFill binds it and seals the repair.",
    shortDesc: "Pre-coated aggregate filler for larger potholes. Combined with ChipFill for permanent repair.",
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
    // Cut to four sentences, 28 Sep 2026 (QA pa#36).
    description: "AggreFill is a pre-coated aggregate filler used with ChipFill to permanently repair larger potholes: deep road failures, parking lot craters, industrial-site damage and utility cuts. Where the damage is too deep or wide for ChipFill alone, AggreFill fills the void and ChipFill bonds the aggregate and seals the repair flush. The system goes in cold and is finished with a heat torch, bonding to the surrounding asphalt or concrete. Like ChipFill on its own, it can be installed year-round in any weather, and the lane reopens to traffic within minutes.",
    specs: [
      { label: "Type", value: "Pre-coated aggregate, used with ChipFill" },
      { label: "How it goes in", value: "Poured cold, finished with a torch and ChipFill" },
      { label: "Surfaces", value: "Asphalt and concrete" },
      { label: "Best for", value: "Potholes too deep or wide for ChipFill alone" },
      { label: "Back in service", value: "Minutes" },
      { label: "Weather", value: "Any, year-round" },
    ],
    relatedApplications: ["parking-lots", "residential-driveways", "parks-paths", "commercial-spaces", "townhomes"],
  },
  {
    name: "Fast Patch DPR",
    slug: "fast-patch",
    eyebrow: "Asphalt & Concrete Repair",
    // Not "cold-mix" (28 Sep 2026, QA pa#36): the hero called it cold-mix while the body sold it against
    // cold-mix products. Its own flyer (/resources/flyers/HUBSS-Flyer-fast-patch-v01.pdf) calls it a
    // polymer-blend pourable repair material, and the spec below already says polymer-blend.
    seoTitle: "Fast Patch DPR asphalt and concrete repair",
    seoDescription: "Fast Patch DPR is a pourable polymer repair for potholes, spalls and utility cuts in asphalt and concrete. Mix, pour, finish: in service in about an hour.",
    // 17 Oct 2026: WVCO's sheet gives return to service as 1 hour at 21°C (1.5 for the other pack), not
    // "under 45 minutes"; its uses are roadways, parking lots, micro-trenches, warehouses and
    // sidewalks ("bridges", "curbs" and "impact absorption" were on no sheet).
    shortDesc: "Polymer-blend repair for potholes, spalls, and utility cuts. Back in service in about an hour.",
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
    // Cut to four sentences (pa#36). "Compact" went with "cold-mix": the flyer's method is mix, pour,
    // finish. "Permanent" and "year-round" stay: the family intro in lib/product-categories.ts relies on
    // all three repair products stating both.
    description: "Fast Patch DPR is a distressed pavement repair material for asphalt and concrete: a pourable polymer blend of recycled and renewable materials for high-strength repairs to potholes, spalls, joints, wheel paths and utility cuts. With minimal site preparation, a repair is back in service in about an hour at 21°C, and the optional Fast Patch Kicker accelerator shortens the cure in cooler conditions so the work can go on year-round. The repair is permanent, bonding to the surrounding pavement, and freeze-thaw resistant for colder climates. Because it is odourless and 100% solids, it can be used indoors, on warehouse floors, as well as on roads, parking lots, sidewalks and utility cuts.",
    specs: [
      { label: "Type", value: "Pourable polymer-blend pavement repair" },
      { label: "Made from", value: "Recycled and renewable polymers" },
      { label: "Return to service", value: "About 1 hour at 21°C" },
      { label: "Cold weather", value: "Fast Patch Kicker accelerator shortens the cure" },
      { label: "Surfaces", value: "Asphalt and concrete, indoors too" },
    ],
    relatedApplications: ["parking-lots", "residential-driveways", "parks-paths", "commercial-spaces", "townhomes"],
  },
];

// Aquaphalt removed as a product line (2026-05-12, Vernon). Page and all references dropped.
