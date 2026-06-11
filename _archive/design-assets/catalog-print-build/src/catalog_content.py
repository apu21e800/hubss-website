"""Catalog content — pulled from live HUBSS website data."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets" / "booklet"
PUBLIC_IMG = ROOT.parent / "public" / "images"
PRODUCTS_DIR = PUBLIC_IMG / "products"
APPS_DIR = PUBLIC_IMG / "applications"
BLOG_DIR = PUBLIC_IMG / "blog"


def _pick(*paths):
    for p in paths:
        if p and Path(p).exists():
            return Path(p)
    return Path(paths[0])


def _app_img(slug, n):
    """Resolve image regardless of extension (jpg, png, jpeg)."""
    base = APPS_DIR / slug
    for ext in ("jpg", "jpeg", "png"):
        p = base / f"{slug}-{n:02d}.{ext}"
        if p.exists():
            return p
    return base / f"{slug}-{n:02d}.jpg"


def _prod_img(slug, n):
    """Resolve product image regardless of extension."""
    base = PRODUCTS_DIR / slug
    for ext in ("jpg", "jpeg", "png"):
        p = base / f"{slug}-{n:02d}.{ext}"
        if p.exists():
            return p
    return base / f"{slug}-{n:02d}.jpg"


# UBC Crosswalk 1.png = 7.4 MB booklet scan — the highest-res UBC image available.
# Blog featured.jpg (~182 KB) is too low-res for a 300 DPI cover; booklet PNG is correct.
# White Rock pier blog PNG was only 63 KB — blurry at print size.
COVER_PHOTO = _pick(ASSETS / "UBC Crosswalk 1.png")

SECTION_OPENERS = {
    # Section divider backgrounds — use website JPEGs (not raw booklet PNGs) to keep
    # code.js under Figma's ~74 MB plugin sandbox limit.
    # products: York Transit stamped asphalt installation — strong infrastructure shot
    "products":            _pick(BLOG_DIR / "imprinted-asphalt-york-transit" / "featured.jpg",
                                 APPS_DIR / "bus-lanes" / "bus-lanes-01.jpg"),
    # applications: wide crosswalk shot — vivid, distinct from Simcoe Rainbow project hero
    "applications":        _pick(APPS_DIR / "crosswalks" / "crosswalks-06.jpg",
                                 APPS_DIR / "crosswalks" / "crosswalks-03.jpg"),
    # projects: VIVA BRT aerial corridor — strong infrastructure shot, distinct from TPXD product imagery
    "projects":            _pick(BLOG_DIR / "multimodal-connectivity-york-region" / "featured.jpg",
                                 APPS_DIR / "bus-lanes" / "bus-lanes-20.jpg"),
    # network: London East Link red BRT lane at Ontario city intersection — correct bus lane imagery
    # (bus-lanes-01.jpg was WRONG: StreetPrint commercial entrance, not a bus corridor)
    "network":             _pick(APPS_DIR / "bus-lanes" / "bus-lanes-03.jpg",
                                 APPS_DIR / "bus-lanes" / "bus-lanes-20.jpg"),
    "reference":           _pick(APPS_DIR / "bike-lanes" / "bike-lanes-09.jpg"),
    # DPS right-side images — distinct from left, avoids mirrored spreads
    "editorial_products":  _pick(BLOG_DIR / "decorative-crosswalk-commercial-drive" / "featured.jpg",
                                 APPS_DIR / "community-branding" / "community-branding-02.jpg"),
    # editorial_products_r: DPS1 right-side — community branding (distinct from crosswalks-06 apps opener)
    "editorial_products_r": _pick(APPS_DIR / "community-branding" / "community-branding-03.jpg",
                                  APPS_DIR / "crosswalks" / "crosswalks-03.jpg"),
    "editorial_projects":  _pick(APPS_DIR / "community-branding" / "community-branding-10.jpg",
                                 APPS_DIR / "community-branding" / "community-branding-04.jpg"),
    "editorial_closing":   _pick(BLOG_DIR / "spirit-trail-wayfinding-vancouver" / "featured.jpg",
                                 APPS_DIR / "bike-lanes" / "bike-lanes-09.jpg"),
    # Three new full-bleed DPS — Vernon swaps images manually in Figma for final
    "dps_a_left":   _pick(BLOG_DIR / "richmond-brighouse-crosswalk" / "featured.jpeg"),
    "dps_a_right":  _pick(BLOG_DIR / "branded-crosswalks-vancouver-richmond" / "featured.jpg",
                          APPS_DIR / "crosswalks" / "crosswalks-06.jpg"),
    "dps_b_left":   _pick(APPS_DIR / "community-branding" / "community-branding-05.jpg"),
    "dps_b_right":  _pick(APPS_DIR / "community-branding" / "community-branding-12.jpg"),
    "dps_c_left":   _pick(BLOG_DIR / "parc-riviera-streetbond-walkway" / "featured.jpg"),
    "dps_c_right":  _pick(APPS_DIR / "community-branding" / "community-branding-13.jpg"),
}

MANIFESTO = {
    "eyebrow": "Established 1994   ·   Coast to Coast",
    "h1_lines": ["The people who made", "your city look", "like your city."],
    "h1_orange_line": 2,
    "body": "For thirty years, HUB Surface Systems has connected Canadian communities with pavement technologies that do more than carry traffic. Decorative crosswalks. Civic plazas. Indigenous recognition art. Transit lanes. Parks. Driveways. Surfaces that carry meaning.",
    "signature": "HUB Surface Systems   /   Established 1994",
}

WHY_HUB = {
    "eyebrow": "Why HUB",
    "title_lines": ["The durable", "decorative hardscape."],
    "subtitle": "Specified by engineers. Loved by communities.",
    "stats": [
        ("30+",     "Years",          "Installations across North America"),
        ("1,000+",  "Projects",       "Completed coast to coast"),
        ("500+",    "Municipalities", "Specified by name"),
        ("10yr+",   "Performance",    "Documented colour retention on StreetBond installations"),
    ],
    "proof": [
        ("01", "Built for freeze-thaw climates",
               "Stress-tested for de-icing salts, snowplow blades, and the cycles that destroy paint."),
        ("02", "Lower lifecycle cost than paint",
               "Thermoplastic and MMA last 6 to 8 times longer than paint — with no annual repaint window."),
        ("03", "Visible in every condition",
               "Retroreflective regulatory markings (PreMark / AirMark). High-contrast decorative thermoplastic. Slip-resistant by design."),
        ("04", "Specified coast to coast",
               "Trusted by transportation engineers, urban designers, and municipal procurement from Vancouver to Halifax."),
    ],
}


# ===== PRODUCTS (12 — AirMark removed per Doug) =====
PRODUCTS = [
    # === SOURCE-OF-TRUTH CORRECTIONS (May 22) ===
    # Per Ennis-Flint by PPG PDFs (TS001/TS002, Specifications): TrafficPatterns and
    # TrafficPatternsXD are NON-REFLECTIVE products. They contain anti-skid elements
    # (Mohs 8 / Mohs 6 respectively) through the cross-section, NOT glass beads.
    # Glass beads belong to PreMark BD/VG variants and to the companion white
    # transverse stripe — not to TPXD/TP themselves. Copy reworded accordingly.
    {"name": "TrafficPatternsXD",
     "manufacturer": "Heavy-Duty Preformed Thermoplastic",
     "tagline": "When the surface has to hold.",
     "hero": _pick(PRODUCTS_DIR / "traffic-patterns-xd" / "traffic-patterns-xd-05.jpg",
                   PRODUCTS_DIR / "traffic-patterns-xd" / "traffic-patterns-xd-03.jpg"),
     "title": "Heavy-duty thermoplastic.",
     "italic": "150-mil aggregate-reinforced. Built for BRT corridors and high-volume intersections.",
     "callout": "150 mil",
     "callout_unit": "Aggregate-reinforced preformed thermoplastic — performance aggregate through full cross-section",
     "body": "TrafficPatternsXD is HUB's heaviest preformed thermoplastic — 150-mil sheets reinforced with performance anti-skid aggregate through the full cross-section. Delivers exceptional skid resistance under wet-surface bus traffic, turning movements, and concentrated wheel loads where painted markings and lighter thermoplastics fail. Heat-fused permanently to asphalt; not for Portland cement concrete. Specified by Canadian transit authorities and municipalities coast to coast for BRT corridors, high-volume crosswalks, and bus stop pads.",
     "uses": ["Crosswalks", "Bike Lanes", "Bus Lanes", "BRT Corridors"],
     "spec_pairs": [("Thickness", "150 mil"), ("Anti-skid", "Performance aggregate, full cross-section"),
                    ("Substrate", "Asphalt only"), ("Service Life", "Multi-year — outlasts paint")]},
    {"name": "TrafficPatterns",
     "manufacturer": "Preformed Thermoplastic",
     "tagline": "Outlasts paint by seasons, not months.",
     # Vision-verified (v29.1): tp-05 was an Indigenous-art crosswalk that read
     # as DecoMark, not standard TP. tp-10 is a clean red-brick TP crosswalk —
     # the canonical "standard preformed thermoplastic" install.
     "hero": _pick(PRODUCTS_DIR / "traffic-patterns" / "traffic-patterns-10.jpg",
                   PRODUCTS_DIR / "traffic-patterns" / "traffic-patterns-05.jpg"),
     "title": "Standard thermoplastic.",
     "italic": "125-mil preformed. Heat-fused. No repaint cycle.",
     "callout": "125 mil",
     "callout_unit": "Preformed thermoplastic — anti-skid elements through full cross-section",
     "body": "Factory-manufactured preformed thermoplastic at 125 mil — heat-fused to asphalt or Portland cement concrete with anti-skid elements distributed through the full cross-section. Outlasts painted markings by seasons through snowplow cycles and de-icing salt seasons. Customizable designs and colours let planners embed community character and identity into the crosswalk itself. Open to traffic within minutes of installation. Where retroreflective performance is required, pair with PreMark beaded or ViziGrip variants.",
     "uses": ["Crosswalks", "Bike Lanes", "Parks", "Regulatory"],
     "spec_pairs": [("Thickness", "125 mil"), ("Anti-skid", "Full cross-section, Mohs 8"),
                    ("Substrate", "Asphalt and concrete"), ("Open to Traffic", "Minutes")]},
    # StreetBond family is a GAF/StreetBond product line (Parsippany NJ), NOT
    # Ennis-Flint/PPG. Per StreetBond TDS: water-based variants (SB120/150/150 AL)
    # are 2-component waterborne epoxy-modified acrylic; touch-dry 1–4 hr;
    # cure-to-traffic 6–24 hr. The "Pantone matching" claim is not in the StreetBond
    # PDFs (Pantone codes ARE published for the TrafficPatterns line); we soften to
    # "full custom colour matching" pending Doug's confirmation. [VERIFY Pantone]
    {"name": "StreetBond",
     "manufacturer": "Coloured Acrylic Coating",
     "tagline": "Coloured pavement that moves with asphalt.",
     "hero": _pick(PRODUCTS_DIR / "streetbond" / "streetbond-112.jpg"),
     "title": "The colour system.",
     "italic": "Flexible acrylic. Bonds at the molecular level. Will not peel.",
     "callout": "73+",
     "callout_unit": "Standard colours plus full custom matching — bike lanes, plazas, driveways",
     "body": "A two-component waterborne epoxy-modified acrylic coating engineered to move with the pavement — resisting the cracking from excessive hardness, premature wear from excessive flexibility, and slipperiness from overly smooth surfaces. 73+ standard colours plus full custom matching. Touch-dry in 1–4 hours; cure-to-traffic in 6–24 hours depending on climate. VOC under 50 g/L.",
     "uses": ["Bike Lanes", "Plazas", "Courts", "Parking"],
     "spec_pairs": [("Type", "Waterborne epoxy-modified acrylic"), ("Surfaces", "Asphalt and concrete (primed)"),
                    ("Cure to traffic", "6–24 hours"), ("Colours", "73+ standard plus custom")]},
    # StreetPrint: 100+ patterns across 15 families (Template Catalog). Manufacturer
    # is Integrated Paving Concepts; coating layer is StreetBond150 (GAF). The
    # previously stated "12+" understated the library.
    {"name": "StreetPrint",
     "manufacturer": "Stamped Asphalt System",
     "tagline": "Stamped asphalt at a fraction of stone's lifecycle cost.",
     "hero": _pick(PRODUCTS_DIR / "streetprint" / "streetprint-40.jpg"),
     "title": "Stamped asphalt.",
     "italic": "100+ patterns. Flush surface. Snowplow safe.",
     "callout": "100+",
     "callout_unit": "Standard patterns across 15 families — brick, cobblestone, slate, herringbone, fan, and custom",
     "body": "Genuine stamped asphalt — patterns imprinted directly into new or existing asphalt with proprietary infrared heating equipment and a wire-rope template, then sealed with StreetBond150 UV-stable colour. The finished surface is flush with the road: no raised edges, no shear risk under snowplows, no joints to weed. 100+ standard patterns across 15 families plus fully custom designs. The visual richness of traditional stone without the maintenance.",
     "uses": ["Crosswalks", "Driveways", "Plazas", "Heritage"],
     "spec_pairs": [("System", "In-place stamping + StreetBond150 coating"), ("Patterns", "100+ standard + custom"),
                    ("Snowplow Safe", "Yes — flush surface"), ("Base", "New lay or existing asphalt")]},
    {"name": "DecoMark",
     "manufacturer": "Custom Preformed Thermoplastic",
     "tagline": "A crosswalk is a canvas.",
     "hero": _pick(PRODUCTS_DIR / "decomark" / "decomark-43.jpg",
                   PRODUCTS_DIR / "decomark" / "decomark-01.jpg"),
     "title": "Custom graphics.",
     "italic": "Pride crosswalks. Indigenous art. Civic landmarks at street scale.",
     "callout": "35+",
     "callout_unit": "Standard colours plus custom — vector artwork to pavement graphics",
     "body": "A crosswalk is a canvas. DecoMark is how you paint it permanently. Preformed thermoplastic at 125 mil minimum, fabricated to your vector artwork in 35+ standard colours plus custom matching, heat-fused to asphalt or concrete. Pride crosswalks. Indigenous cultural recognition art. Neighbourhood identity installations. Mural-scale public art that lets the street tell a community's story. Applies at 45°F (7°C) and rising.",
     "uses": ["Identity", "Wayfinding", "Public Art", "Memorial"],
     "spec_pairs": [("System", "Preformed components, 125 mil min"), ("Colour", "35+ standard plus custom"),
                    ("Design", "Vector / CAD artwork"), ("Install", "Certified crews")]},
    # MMAX: Extended Season variant applies at 35°F (≈2°C) per Ennis-Flint PDS —
    # not 3°C as previously stated. Standard cure: 30–60 min; 45 min is the
    # typical mid-point we keep as marketing claim.
    {"name": "MMAX",
     "manufacturer": "MMA Resin Lane Coating",
     "tagline": "Traffic-ready overnight. Engineered for transit lanes.",
     "hero": _pick(PRODUCTS_DIR / "mmax" / "mmax-05.jpg"),
     "title": "MMA resin lane coating.",
     "italic": "Methyl methacrylate. 45-minute cure. Extended Season applies down to 2°C.",
     "callout": "45 min",
     "callout_unit": "Cure to traffic-ready — complete overnight installation in a single maintenance window",
     "body": "MMA resin that cures to traffic-ready in 30–60 minutes, enabling complete overnight installation in active transit corridors without disrupting weekday operations. Embedded corundum aggregate (9 Mohs) delivers superior traction under wet conditions. UV-stable pigments resist seasonal fading. The Extended Season formulation applies down to 2°C substrate temperature, extending the installation window deep into Canadian shoulder seasons. The specification for red bus lanes, protected bike lanes, and BRT station zones where cure window and durability outlast painted and acrylic alternatives.",
     "uses": ["Bus Lanes", "Bike Lanes", "Calming", "Transit"],
     "spec_pairs": [("Material", "Methyl methacrylate (MMA) resin"), ("Cure", "30–60 min — traffic-ready"),
                    ("Aggregate", "Corundum, 9 Mohs"), ("Min Temp", "2°C (Extended Season)")]},
    # StreetBondSR: the LEED metric is SRI (Solar Reflectance Index) ≥ 29, NOT
    # SR ≥ 0.33. SR is a different scale. Invisible Shade colourants push SR
    # above 0.334 even on darker tones. Both numbers stated explicitly.
    {"name": "StreetBondSR",
     "manufacturer": "Solar-Reflective Acrylic Coating",
     "tagline": "Solar reflective. LEED-aligned.",
     "hero": _pick(PRODUCTS_DIR / "streetbondsr" / "streetbondsr-08.jpg",
                   PRODUCTS_DIR / "streetbondsr" / "streetbondsr-02.jpg"),
     "title": "Cool surface coating.",
     "italic": "A cool-surface coating that lowers pavement temperature and contributes to LEED heat-island credits.",
     "callout": "SRI ≥ 29",
     "callout_unit": "Solar Reflectance Index — meets LEED v4 Heat Island threshold for non-roof hardscape",
     "body": "Solar reflective StreetBond150 paired with high-SRI colourants — Solar Reflectance Index ≥ 29 qualifying for the LEED v4 SS Credit: Heat Island Reduction. Same flexible epoxy-modified acrylic chemistry as standard StreetBond, with Invisible Shade colourants that push Solar Reflectance above 0.334 even on darker tones. Reduces pavement surface temperatures, mitigates urban heat island, and supports climate action plan implementation. Multiple SR-qualifying colours, including Limestone Grey (SRI 65) and Slate (SRI 33).",
     "uses": ["Parking", "Plazas", "LEED Sites", "Schools"],
     "spec_pairs": [("SRI", "≥ 29 (LEED qualifying)"), ("Solar Reflectance", "> 0.334 with Invisible Shade"),
                    ("LEED", "v4 SS Credit: Heat Island"), ("Base coating", "StreetBond150")]},
    # Vision-verified (v29.1): sbsr-02/-05 showed warm orange paths — wrong
    # tone for a Solar Reflective product. sbsr-08 is a cool light-grey parking
    # lot — the canonical SR aesthetic (cool surface for heat mitigation).
    # DuraTherm: per the Ennis-Flint TS003 + Specification, the depression is
    # IMPRINTED into heated asphalt with a template + vibratory plate compactor —
    # NOT cold-milled. The finished thermoplastic sits SLIGHTLY BELOW road level
    # (sub-flush), which is what makes it snowplow-friendly. ASPHALT ONLY —
    # specification explicitly forbids Portland cement concrete.
    {"name": "DuraTherm",
     "manufacturer": "Inlaid Preformed Thermoplastic",
     "tagline": "Inlaid. Flush. Invisible to snowplows.",
     "hero": _pick(PRODUCTS_DIR / "duratherm" / "duratherm-01.jpg"),
     "title": "Inlaid thermoplastic.",
     "italic": "Imprinted into heated asphalt. Sub-flush profile. Snowplow safe.",
     "callout": "Sub-flush",
     "callout_unit": "Sits slightly below road surface level — zero shear risk under snowplow blades",
     "body": "Preformed thermoplastic at 90 mil minimum, inlaid into a depression imprinted into heated asphalt by template and vibratory plate compactor. The finished thermoplastic sits sub-flush with the surrounding road — slightly below grade — eliminating shear risk under snowplow blades and trip hazards underfoot. Combines decorative visual richness with skid-resistant surface treatment (Mohs 8 surface anti-skid). Asphalt only — not approved for Portland cement concrete. The specification for crosswalks and streetscape inlays that must survive Canadian winter maintenance without seasonal damage.",
     "uses": ["Crosswalks", "Streetscape", "Calming", "Identity"],
     "spec_pairs": [("Install", "Template-imprinted into heated asphalt"), ("Profile", "Sub-flush — below road surface"),
                    ("Snowplow Safe", "Yes — no shear risk"), ("Substrate", "Asphalt only")]},
    # DuraShield: GAF/StreetBond product (NOT Ennis-Flint/PPG). Per the TDSs:
    # SR = 0.33 (not 0.34); two-component waterborne epoxy-modified acrylic
    # COATING (Doug confirmed — not penetrating). The fuel/oil/deicing-resistance
    # claim is softer in the TDS ("excellent chemical resistance") — restated
    # conservatively. Anti-slip aggregate is a field-broadcast practice, not
    # documented in the two TDSs reviewed. [VERIFY anti-slip product definition]
    {"name": "DuraShield",
     "manufacturer": "Pavement Maintenance Coating",
     "tagline": "Maintain a surface, do not replace it.",
     "hero": _pick(PRODUCTS_DIR / "durashield" / "durashield-04.jpg"),
     "title": "Pavement maintenance coating.",
     "italic": "Two-component epoxy-modified acrylic. Solar Reflectance 0.33.",
     "callout": "SR 0.33",
     "callout_unit": "Solar Reflectance (Solar Gray variant) — cools the surface and slows UV degradation",
     "body": "Two-component waterborne epoxy-modified acrylic coating — not a penetrating sealer — for asphalt maintenance in parking lots, residential roadways, and pedestrian areas. The Solar Gray variant carries Solar Reflectance of 0.33, helping cool the pavement surface and slow UV-driven asphalt degradation. Excellent chemical resistance against fuel, oil, and de-icing exposure. Flexible enough to move with the pavement through freeze-thaw cycles without cracking. Low VOC under 50 g/L. Spray-and-back-roll application by certified crews; cure-to-traffic depends on climate.",
     "uses": ["Parking", "Driveways", "Pathways", "LEED Sites"],
     "spec_pairs": [("Type", "Two-component waterborne epoxy-acrylic coating"), ("Solar Reflectance", "0.33 (Solar Gray)"),
                    ("VOC", "< 50 g/L"), ("Variants", "Asphalt (black) and Solar Gray")]},
    # PreMark: thickness numbers 125 mil / 90 mil ViziGrip are NOT confirmed in
    # the PDFs in /public/docs/ (TS005 + PreMarkXF Brochure don't state them).
    # Softened the spec until Doug confirms with a PPG sheet. ViziGrip is a
    # MANUFACTURING FINISH (surface beads + anti-skid), not a thickness option.
    {"name": "PreMark",
     "manufacturer": "Preformed Regulatory Markings",
     "tagline": "Pre-cut. Heat-applied. Open immediately.",
     "hero": _pick(PRODUCTS_DIR / "premark" / "premark-01.jpg"),
     "title": "Road marking symbols.",
     "italic": "Arrows. Stop bars. Legends. Bike pictographs. No stencils.",
     "callout": "Retro-reflective",
     "callout_unit": "Glass-bead surface (Beaded and ViziGrip variants) — intersection-grade visibility",
     "body": "Preformed thermoplastic symbols pre-cut to specification: turn arrows, stop bars, yield triangles, school zone legends, bicycle pictographs, accessible parking symbols, and crosswalk ladder lines. Heat-applied via propane torch — open to traffic immediately, no curing window, no stencils. Four manufacturing finishes — Beaded (full retroreflectivity), ViziGrip (beads + anti-skid for crosswalks and accessibility), Non-Beaded (reversible arrows), Skid-Only (coloured preferential lanes). PreMarkXF cold-weather variant: no minimum ambient or road temperature.",
     "uses": ["Bike Lanes", "Crosswalks", "Regulatory", "Parking"],
     "spec_pairs": [("Variants", "Beaded / ViziGrip / Non-Beaded / Skid-Only"), ("Installation", "Heat-applied — drive-on immediately"),
                    ("Recycled content", "Up to 60%"), ("Service Life", "6–8× painted alternatives")]},
    # AirMark: 5 standard colours (Red, White, Yellow, Black, Pink) per the
    # AirMark brochure — not just white and yellow. Non-runway only (Doug
    # confirmed). "4×" service-life claim isn't in the brochure; manufacturer
    # says "significantly outlasts paint" — softened to that wording.
    {"name": "AirMark",
     "manufacturer": "Airfield Preformed Thermoplastic",
     "tagline": "Airfield markings, certified to last.",
     "hero": _pick(PRODUCTS_DIR / "airmark" / "airmark-04.jpg",
                   PRODUCTS_DIR / "airmark" / "airmark-01.jpg"),
     "title": "Airfield thermoplastic.",
     "italic": "Preformed. Heat-applied. Non-runway airfield surfaces. Five standard colours.",
     "callout": "5",
     "callout_unit": "Standard colours — Red, White, Yellow, Black, Pink",
     "body": "Airfield markings are safety-critical. Precision, visibility, and permanence are not negotiable. AirMark preformed thermoplastic is engineered for non-runway airfield surfaces — taxiways, aprons, helipads, and ground-vehicle roads — with retroreflective glass beads embedded through the cross-section so visibility holds as the surface wears. Withstands jet blast, snow clearing, rubber removal treatments, and the daily operational demands of an active airfield. A service life that significantly outlasts painted alternatives — no annual repaint cycle, no recurring closure windows. Heat-applied by certified crews. Five standard colours: Red, White, Yellow, Black, Pink. ISO 9001:2015 certified manufacturing.",
     "uses": ["Taxiways", "Aprons", "Helipads", "Ground Vehicles"],
     "spec_pairs": [("Application", "Non-runway airfield surfaces"), ("Material", "Preformed thermoplastic, glass beads"),
                    ("Colours", "Red, White, Yellow, Black, Pink"), ("Certification", "ISO 9001:2015")]},
]


# ===== APPLICATIONS (17 — Airports removed) =====
APPLICATIONS = [
    {"name": "Crosswalks", "tagline": "Pedestrian safety, designed in.",
     "image": _pick(_app_img("crosswalks", 3)),
     "body": "TrafficPatterns and TrafficPatternsXD preformed thermoplastic hold anti-skid performance through snowplow cycles and de-icing seasons where paint fails within a year. Pair with PreMark beaded variants where retroreflectivity is required. DecoMark and StreetBond open the intersection as a canvas — Pride crossings, Indigenous cultural art, neighbourhood identity. Specified by municipalities from Halifax to Vancouver."},
    {"name": "Bike Lanes", "tagline": "Visibility that holds, season after season.",
     "image": _pick(_app_img("bike-lanes", 14)),
     "body": "A faded bike lane is a dangerous bike lane. StreetBond UV-stable acrylic and MMAX MMA resin maintain vivid colour through years of traffic and weather without chalking or fading. MMAX corundum aggregate (9 Mohs) holds slip resistance in the wet."},
    {"name": "Bus Lanes", "tagline": "Engineered for the harshest urban loads.",
     "image": _pick(_app_img("bus-lanes", 20)),
     "body": "BRT corridors are among the most demanding surfaces in any city's network. MMAX MMA resin cures to traffic-ready in 45–60 minutes, enabling complete overnight installation without disrupting weekday service. TrafficPatternsXD aggregate-reinforced thermoplastic delivers high skid resistance at bus stops and turning movements. Both outlast painted markings season after season."},
    {"name": "Parking Lots", "tagline": "Looks maintained, performs safely, costs less.",
     # v30 vision-fix: pl-01 was a tiny green EV stall — wrong scale + context.
     # pl-13 is a Lowe's-scale lot with stamped-asphalt + clear stall striping.
     "image": _pick(_app_img("parking-lots", 13), _app_img("parking-lots", 1)),
     "body": "Parking lots take a disproportionate beating. DuraShield asphalt maintenance coating (SR 0.33, VOC under 50 g/L) protects oxidized surfaces from UV, heat, and chemical exposure. PreMark beaded thermoplastic stall markings hold retroreflectivity without annual repainting. StreetBond creates branded wayfinding zones and fire-lane designations."},
    {"name": "Parks & Paths", "tagline": "Surfaces worth spending time on.",
     # parks-paths-01.jpg WRONG: showed playground/daycare with play equipment, not a path
     # parks-paths-04.jpg: StreetPrint crosswalk in pedestrian park area (heritage building, pedestrian bollard) ✓
     "image": _pick(_app_img("parks-paths", 4),
                    _app_img("parks-paths", 1)),
     "body": "The path through a park sets the tone for the whole space. StreetBond applies vivid UV-stable colour to existing surfaces. DecoMark brings mural-quality custom graphics. StreetPrint gives plazas the visual richness of stone."},
    {"name": "Playgrounds", "tagline": "Vibrant, slip-resistant, built for hard use.",
     "image": _pick(_app_img("playgrounds", 1)),
     "body": "Children are hard on surfaces. DecoMark preformed thermoplastic brings hopscotch courts, number grids, compass roses, and mural-scale artwork to play surfaces with custom-matched colour and flush-surface edges that eliminate trip hazards."},
    {"name": "Community Branding", "tagline": "Neighbourhood identity, embedded in the street.",
     # v30 vision-fix: cb-07 was a tiny dim "3 Yates St." marker — wrong scale.
     # cb-04 is the iconic "Little Italy / The Drive" Vancouver intersection.
     "image": _pick(_app_img("community-branding", 4),
                    _app_img("community-branding", 7)),
     "body": "Every neighbourhood has a story. Most go untold on the street. DecoMark embeds custom-matched graphics directly into asphalt: First Nations cultural artwork, BIA wayfinding, neighbourhood crests, Pride declarations, heritage commemorations."},
    {"name": "Private Driveways", "tagline": "Stone-paver looks. No demolition required.",
     "image": _pick(_app_img("residential-driveways", 1)),
     "body": "StreetPrint offers in-place stamped asphalt that works with the driveway already there, impressing cobblestone, brick, herringbone, or slate patterns directly into the surface, then sealing it with StreetBond colour."},
    {"name": "Sport Courts", "tagline": "Court colour and lines that hold their geometry.",
     "image": _pick(_app_img("sport-courts", 1)),
     "body": "Sport courts are one of the most demanding colour environments in outdoor pavement. StreetBond bonds permanently to asphalt and acid-etched concrete, delivering vivid colours and crisp line markings that hold through hard play."},
    {"name": "Splash Pads", "tagline": "Slip-resistant. Cool to touch. Vivid colour.",
     "image": _pick(_app_img("splash-pads", 1)),
     "body": "Splash pad surfaces are uniquely demanding: constant water exposure, chemical treatments, bare feet. StreetBond builds a slip-resistant texture meeting wet-surface safety standards while delivering vivid, engaging colour."},
    {"name": "Public Spaces", "tagline": "Civic plazas, transit forecourts, university campuses.",
     "image": _pick(_app_img("public-spaces", 8), _app_img("public-spaces", 1)),
     "body": "Public plazas and civic squares are the most visible surfaces in any community. StreetPrint stamped asphalt transforms grey paved plazas into rich hardscape environments. StreetBond defines civic zones. Installed at UBC, BC Children's Hospital, and civic plazas coast to coast."},
    {"name": "Commercial Spaces", "tagline": "Premium hardscape. Mixed-use developments and hospitality.",
     # v30 vision-fix: cs-01 was a residential EV-stall — wrong context.
     # cs-05 is a UBC commercial entrance with stamped-pavement strip.
     "image": _pick(_app_img("commercial-spaces", 5),
                    _app_img("commercial-spaces", 1)),
     "body": "Retail centres, mixed-use developments, hotel porte-cocheres. The surface underfoot signals the quality of everything inside. StreetPrint delivers the visual weight of premium stone paving at a fraction of full installation cost."},
    {"name": "Townhomes", "tagline": "Cohesive hardscape for strata developments.",
     "image": _pick(_app_img("townhomes", 1)),
     "body": "Townhome and strata developments live and die by their first impression. StreetPrint stamped asphalt driveways and entry courts deliver the look of clay pavers or stone cobble at a fraction of the cost — no settling, no weeding."},
    {"name": "Pedestrian Safety", "tagline": "Vision Zero, on the surface.",
     "image": _pick(_app_img("crosswalks", 18)),
     "body": "Pedestrian safety isn't aesthetic aspiration — it's a measurable outcome. PreMark beaded thermoplastic for retroreflective regulatory markings; TrafficPatterns and DecoMark for high-contrast decorative crosswalks that persist through de-icing salt cycles. The complete specification for engineers taking Vision Zero seriously."},
    {"name": "Traffic Calming", "tagline": "Drivers slow without barriers.",
     "image": _pick(_app_img("traffic-calming", 1)),
     "body": "Colour changes driver behaviour. Gateway treatments, speed table surface markings, and intersection colour reduce vehicle entry speeds without requiring physical barriers that impede emergency response."},
    {"name": "LEED & Heat Island", "tagline": "Solar reflective. Climate-aligned.",
     # v30 vision-fix: leed-01 was warm orange/red — opposite of cool/SR.
     # sbsr-07 is a cool-toned Montreal parking lot — true SR aesthetic.
     "image": _pick(PRODUCTS_DIR / "streetbondsr" / "streetbondsr-07.jpg",
                    _app_img("leed-urban-heat-island", 1)),
     "body": "Standard dark asphalt absorbs most solar radiation. StreetBondSR — Solar Reflectance Index ≥ 29 — qualifies for the LEED v4 SS Credit: Heat Island Reduction on non-roof hardscape. Reduces surface temperatures and mitigates urban heat island. The specification for LEED-certified developments and climate action plan commitments."},
    {"name": "Public Art", "tagline": "The street as canvas.",
     "image": _pick(_app_img("community-branding", 11), _app_img("community-branding", 4)),
     "body": "The street is one of the largest untapped canvases in any city. HUB public art installations turn that canvas into permanent, weather-resistant community expression. From BC Children's Hospital labyrinth to UBC Indigenous cultural crosswalks."},
]


# ===== PROJECTS (18 — capital/transit projects first, community art second) =====
# Order: major infrastructure + institutional → municipal safety → cultural/community
PROJECTS = [
    {"name": "York Region VIVA BRT", "location": "York Region, Ontario", "product": "MMAX",
     # bus-lanes-01.jpg WRONG: showed StreetPrint brick commercial entrance, no red MMAX bus lane
     # mmax-16.jpg: vivid WET red MMAX bus lane on Ontario highway — correct product + context
     "hero": _pick(PRODUCTS_DIR / "mmax" / "mmax-16.jpg",
                   _app_img("bus-lanes", 1)),
     "detail": _pick(PRODUCTS_DIR / "mmax" / "mmax-15.jpg"),
     "title": "BRT corridor, open in 90 minutes.",
     "story": "MMAX red MMA resin bus lane markings for York Region's VIVA Rapid Transit corridor — one of Canada's highest-ridership BRT networks. Applied overnight in a single maintenance window. Traffic-ready in 30–60 minutes. No daytime closure. No paint cycle."},
    {"name": "Toronto Priority Bus Lanes", "location": "Toronto, Ontario", "product": "MMAX",
     # mmax-01.jpg WRONG: showed decorative floral art crosswalk + green bike lane (BC art, not Toronto red bus lanes)
     # mmax-04.jpg: "BUS ONLY" red MMAX lane, wide urban boulevard — correct product + context ✓
     "hero": _pick(PRODUCTS_DIR / "mmax" / "mmax-04.jpg",
                   _app_img("bus-lanes", 20)),
     "detail": _pick(PRODUCTS_DIR / "mmax" / "mmax-07.jpg",
                     PRODUCTS_DIR / "mmax" / "mmax-08.jpg"),
     "title": "Twelve corridors. One transit network.",
     "story": "MMAX red resin treatments across 12 priority bus corridors in Toronto — one of the largest single-contract MMA deployments in Canada. One overnight cure window per corridor. No daytime closures. No repaint cycle. The specification TTC engineers reach for when painted alternatives have already failed."},
    {"name": "London East Link BRT", "location": "London, Ontario", "product": "StreetBond",
     # De-dup (v29): bus-lanes-3 was duplicated as the network section opener.
     # Swapped to bus-lanes-4 (unused, also a red BRT lane corridor shot).
     "hero": _pick(_app_img("bus-lanes", 4)),
     "detail": _pick(_app_img("bus-lanes", 38)),
     "title": "A transit corridor with a clear identity.",
     "story": "StreetBond coloured pavement across London Transit's East Link BRT priority corridor — vivid red lanes that communicate bus priority immediately to every driver on the road. Colour-stable through Ontario freeze-thaw cycles. No annual repaint window. A branded transit corridor built for the long term."},
    {"name": "BC Children's Hospital", "location": "Vancouver, British Columbia", "product": "StreetBond + DecoMark",
     "hero": _pick(BLOG_DIR / "bc-childrens-hospital-labyrinth" / "featured.jpg",
                   PRODUCTS_DIR / "streetbond" / "streetbond-95.jpg"),
     # De-dup (v29): decomark-43 is the DecoMark product hero — needed a
     # distinct healthcare-context image. streetbond-95 is the playful coloured
     # surface that pairs with the labyrinth — BCH uses StreetBond + DecoMark.
     "detail": _pick(PRODUCTS_DIR / "streetbond" / "streetbond-95.jpg",
                     PRODUCTS_DIR / "decomark" / "decomark-22.jpg"),
     "title": "Playful surfaces. Healing spaces.",
     "story": "StreetBond coatings and DecoMark surface graphics — including a meditation labyrinth — installed across active wards and ground-level plazas at BC Children's Hospital. Designed with Connect Landscape Architecture. The surfaces are slip-resistant, chemical-resistant, and built to perform in a healthcare environment."},
    {"name": "New Westminster Complete Streets", "location": "New Westminster, British Columbia", "product": "StreetBond + TrafficPatterns",
     "hero": _pick(BLOG_DIR / "complete-streets-new-westminster" / "featured.jpg",
                   _app_img("bike-lanes", 22)),
     "detail": _pick(_app_img("bike-lanes", 32)),
     "title": "Modal clarity, written in colour.",
     "story": "Complete Streets across New Westminster: StreetBond green for protected bike lanes, TrafficPatterns high-contrast crosswalks, PreMark beaded regulatory markings at every conflict point. Modal priority made legible. Cyclists protected. Pedestrians seen. The Complete Streets specification that transportation engineers and urban planners return to."},
    {"name": "York Region Pedestrian Safety", "location": "York Region, Ontario", "product": "TrafficPatternsXD",
     # Blog: trafficpatternsxd-urban-design — "Heritage Crosswalks in Woodbridge: How TPXD Delivered the Look"
     # Shows dark charcoal TPXD crosswalk in a York Region (Woodbridge/Vaughan) suburb — winter, GTA homes ✓
     "hero": _pick(BLOG_DIR / "trafficpatternsxd-urban-design" / "featured.jpg",
                   _app_img("crosswalks", 3)),
     "detail": _pick(_app_img("crosswalks", 26),
                     PRODUCTS_DIR / "traffic-patterns-xd" / "traffic-patterns-xd-94.jpg"),
     "title": "Outlasts paint by eight times.",
     "story": "TrafficPatternsXD 150-mil aggregate-reinforced crosswalk markings specified across York Region intersections. Eight times the service life of paint. A measurable reduction in annual maintenance spend. The kind of lifecycle arithmetic that procurement teams and transportation engineers notice — and specify again."},
    {"name": "Vision Zero Crosswalks", "location": "Canada-Wide", "product": "TrafficPatterns",
     # Blog: pedestrian-safety-solutions — "Keeping Pedestrians Safe and Operation Budgets Low"
     # Shows "W 1ST STREET" high-visibility branded crosswalk — bold blue, high contrast, perfect for Vision Zero ✓
     # (crosswalks-11 was WRONG: suburban StreetPrint stamped intersection, not thermoplastic)
     "hero": _pick(BLOG_DIR / "pedestrian-safety-solutions" / "featured.jpeg",
                   _app_img("crosswalks", 11)),
     "detail": _pick(_app_img("crosswalks", 31)),
     "title": "High-visibility holds lives.",
     "story": "Where painted crosswalks fade by spring, high-contrast preformed thermoplastic holds colour and slip-resistance through every season — paired with PreMark beaded markings where retroreflective regulatory performance is required. Specified by municipalities from Halifax to Victoria pursuing Vision Zero — the standard for engineers who need pedestrian safety outcomes, not just intentions."},
    {"name": "Vancouver BIA Crosswalks", "location": "Vancouver, British Columbia", "product": "StreetPrint",
     # Blog: vancouver-decorative-crosswalk-design — BC TransLink bus + colourful leaf/wave crosswalk design ✓
     # (streetprint-23.jpg was WRONG: showed indoor covered commercial walkway, not an outdoor BIA street)
     "hero": _pick(BLOG_DIR / "vancouver-decorative-crosswalk-design" / "featured.jpeg",
                   PRODUCTS_DIR / "streetprint" / "streetprint-23.jpg"),
     "detail": _pick(PRODUCTS_DIR / "streetprint" / "streetprint-69.jpg"),
     "title": "District identity, cast in pavement.",
     "story": "StreetPrint stamped-asphalt crosswalks across five Vancouver Business Improvement Districts. District identity embedded permanently in the street — walked over every day, maintaining visual coherence through snowplow seasons and years of traffic load."},
    {"name": "UBC Musqueam Crosswalk", "location": "Vancouver, British Columbia", "product": "StreetPrint and DecoMark",
     # Blog: ubc-musqueam-crosswalk — actual UBC campus + Coast Salish salmon design, UBC letters in background ✓
     # (aboriginal crosswalk 1.png was WRONG: showed an aerial B&W/blue eagle design, different project)
     "hero": _pick(BLOG_DIR / "ubc-musqueam-crosswalk" / "featured.jpg",
                   ASSETS / "aboriginal crosswalk 1.png"),
     "detail": _pick(PRODUCTS_DIR / "streetprint" / "streetprint-77.jpg"),
     "title": "A surface is also a statement.",
     "story": "A collaboration with UBC and the Musqueam Nation. Coast Salish art patterns stamped into asphalt at the centre of campus — an institutional acknowledgement made permanent, at street scale, in a material that will outlast the generation that commissioned it."},
    {"name": "More Awesome Now", "location": "Vancouver, British Columbia", "product": "StreetBond",
     # Blog: laneway-project — "The Laneway Project" — shows a Toronto laneway with colourful StreetBond ✓
     # (StreetBond Circle Design 1.png was WRONG: showed a large stadium/arena circular plaza, not Vancouver laneways)
     "hero": _pick(BLOG_DIR / "laneway-project" / "featured.png",
                   ASSETS / "StreetBond Circle Design 1.png"),
     # v30 de-dup: cb-04 now used by Community Branding app. cb-09 is a
     # Metro-Vancouver indigenous-art medallion at Moody Centre Station —
     # different art, still community-art in Metro Vancouver context.
     "detail": _pick(_app_img("community-branding", 9),
                     _app_img("community-branding", 4)),
     "title": "Six laneways. Six artists.",
     "story": "Six Vancouver laneways. Six artists. StreetBond coloured pavement turned utility corridors into civic gallery space — public art at street scale, permanent and weather-resistant."},
    {"name": "White Rock Pier", "location": "White Rock, British Columbia", "product": "TrafficPatternsXD",
     # tpxd-95.jpg WRONG: showed Toronto high-rise intersection, not White Rock pier or coastal setting
     # Using actual White Rock pier blog photo — coastal bollards + thermoplastic crosswalk, correct location ✓
     "hero": _pick(BLOG_DIR / "white-rock-pier-crosswalk" / "featured.png",
                   PRODUCTS_DIR / "traffic-patterns-xd" / "traffic-patterns-xd-95.jpg"),
     "detail": _pick(PRODUCTS_DIR / "traffic-patterns-xd" / "traffic-patterns-xd-140.jpg"),
     "title": "Salt air. Holiday traffic. Held.",
     "story": "Salt spray. Summer surge. Winter rain. The pier crosswalk at White Rock faces the full force of the BC coast — and holds season after season. TrafficPatternsXD installed where paint would be gone by July."},
    {"name": "Indigenous Recognition", "location": "Multiple municipalities, Canada", "product": "DecoMark",
     "hero": _pick(ASSETS / "native crosswalk 1.png"),
     "detail": _pick(PRODUCTS_DIR / "decomark" / "decomark-77.jpg"),
     "title": "Recognition, cast in pavement.",
     "story": "Indigenous Recognition crosswalks honouring First Nations communities across Canada. Every design co-developed with community elders and knowledge keepers. Permanent. Visible at every crossing. Walked by the whole city."},
    {"name": "Kitchener Veterans Memorial", "location": "Kitchener, Ontario", "product": "DecoMark",
     # Blog: veterans-crosswalk-kitchener — actual "Lest We Forget" ceremony with Canadian flag,
     # soldier silhouette on crosswalk, Kitchener cenotaph, veterans in uniform. Stunning. ✓
     # (community-branding-01.jpg was WRONG: showed StreetPrint brick road, wrong product + wrong project)
     # (decomark-74.jpg detail was WRONG: showed "Little Italy - The Drive" Vancouver, wrong project)
     "hero": _pick(BLOG_DIR / "veterans-crosswalk-kitchener" / "featured.jpeg",
                   _app_img("community-branding", 1)),
     # De-dup (v29): blog folder only carries featured.jpeg; using a memorial-
     # context decomark photo (poppy/red-pattern installation) so the spread
     # doesn't repeat the same image twice.
     "detail": _pick(_app_img("community-branding", 14),
                     _app_img("community-branding", 8)),
     "title": "Paint fades. Memory shouldn't.",
     "story": "Kitchener's Veterans Crosswalk: a permanent civic tribute walked over every day. DecoMark thermoplastic graphic embedded into the street — durable enough to outlast the paint that failed before it, respectful enough to honour what it commemorates."},
    {"name": "Every Child Matters", "location": "Town of Georgina, Ontario", "product": "TrafficPatterns",
     "hero": _pick(BLOG_DIR / "every-child-matters-crosswalk" / "featured.png",
                   PRODUCTS_DIR / "traffic-patterns" / "traffic-patterns-37.jpg"),
     "detail": _pick(PRODUCTS_DIR / "traffic-patterns" / "traffic-patterns-36.jpg"),
     "title": "Honouring residential schools survivors.",
     "story": "Town of Georgina honours the Every Child Matters movement with a permanent TrafficPatterns thermoplastic crosswalk. A civic acknowledgement cast in durable material — walked over every day, visible every season."},
    {"name": "Sechelt Pictograph Crosswalk", "location": "Sunshine Coast, British Columbia", "product": "TrafficPatterns",
     # tsain-ko-crosswalk-sechelt/featured.jpg = ACTUAL aboriginal motif crosswalk at 5500 Sunshine
     # Coast Hwy, Tsain-Ko Centre — the correct image for this story (confirmed via blog post).
     # pictograph-crosswalk-sechelt/featured.jpg is mislabeled (depicts Kitchener) — still skip.
     "hero": _pick(BLOG_DIR / "tsain-ko-crosswalk-sechelt" / "featured.jpg",
                   APPS_DIR / "community-branding" / "community-branding-07.jpg"),
     "detail": _pick(PRODUCTS_DIR / "decomark" / "decomark-69.jpg"),
     "title": "The origin story of the shishalh Nation.",
     "story": "Indigenous artists Dionne Paul and Lindsey Kyoko Adams told the origin story of the shishalh Nation in TrafficPatterns thermoplastic at Cowrie and Trail in Sechelt. Unveiled during National Aboriginal History Month — cultural memory made permanent at street level."},
    {"name": "Simcoe Rainbow Crosswalk", "location": "Simcoe, Ontario", "product": "TrafficPatternsXD",
     "hero": _pick(BLOG_DIR / "simcoe-rainbow-crosswalk" / "featured.jpg",
                   PRODUCTS_DIR / "traffic-patterns-xd" / "traffic-patterns-xd-127.jpg"),
     # v30 vision-fix: tpxd-129 was a generic cream/red TPXD close-up — no
     # rainbow. parks-paths-08 is an actual rainbow-tile crosswalk install
     # in-progress (crew on-site, multi-colour tiles laid out).
     "detail": _pick(_app_img("parks-paths", 8),
                     PRODUCTS_DIR / "traffic-patterns-xd" / "traffic-patterns-xd-129.jpg"),
     "title": "Two years of fundraising. One street.",
     "story": "A young Simcoe resident's two-year fundraising campaign, realized in TrafficPatternsXD. A rainbow crosswalk that holds colour and anti-skid performance season after season — long after painted alternatives would have faded from memory."},
    {"name": "Bowen Island Path", "location": "Snug Cove, British Columbia", "product": "StreetBond",
     # Authentic Bowen Island shot from the blog post — actual project >
     # higher-res generic StreetBond stock.
     "hero": _pick(BLOG_DIR / "bowen-island-asphalt-path" / "featured.jpg",
                   PRODUCTS_DIR / "streetbond" / "streetbond-88.jpg"),
     # v30 vision-fix: sb-92 was a red urban pier — wrong context for a forest
     # path. decomark-22 is a green oak-leaf on asphalt — nature/forest theme.
     "detail": _pick(PRODUCTS_DIR / "decomark" / "decomark-22.jpg",
                     PRODUCTS_DIR / "streetbond" / "streetbond-92.jpg"),
     "title": "Forest. Sunset. Water. Earth.",
     "story": "A community art path at Snug Cove, Bowen Island. Custom StreetBond in four colours — forest, sunset, water, and earth — community identity built permanently into the surface of the path that connects the village to the waterfront."},
    {"name": "Murrayville Schoolhouse", "location": "Langley, British Columbia", "product": "StreetPrint",
     # murrayville/featured.jpg WRONG: showed green oak-leaf DecoMark design, not StreetPrint stamped sidewalk
     # streetprint-04.jpg: dark charcoal herringbone StreetPrint plaza with heritage brick buildings — right product ✓
     "hero": _pick(PRODUCTS_DIR / "streetprint" / "streetprint-04.jpg",
                   BLOG_DIR / "murrayville-schoolhouse-sidewalk" / "featured.jpg"),
     "detail": _pick(PRODUCTS_DIR / "streetprint" / "streetprint-83.jpg"),
     "title": "A schoolhouse, a sidewalk, a memory.",
     "story": "StreetPrint stamped-asphalt sidewalk linking the historic Murrayville Schoolhouse to the community around it. Heritage-look surface for a heritage building — brick-pattern asphalt that reads as stone and performs as pavement."},
    # ---- (v30 vision-fix anchor — Bowen Island + Simcoe Rainbow detail swaps occur below) ----
    # ── Two newest projects (2025) — White Rock Seaside Stroll + Langley Railroad Heritage ──
    {"name": "White Rock Seaside Stroll", "location": "White Rock, British Columbia",
     "product": "TrafficPatterns",
     # Coastal wave-inspired mural by artist Amy (Yun Ru) Bao on Johnston Road, Uptown.
     "hero": _pick(BLOG_DIR / "white-rock-langley-trafficpatterns" / "featured.jpg"),
     # De-dup (v29): only one image in the blog folder. Detail uses a
     # coastal-feeling community-branding crosswalk so the spread doesn't
     # repeat the same shot twice.
     "detail": _pick(_app_img("community-branding", 6),
                     _app_img("community-branding", 11)),
     "title": "The waterfront, brought inland.",
     "story": "White Rock commissioned Vancouver artist Amy Bao to carry the coastal identity of the waterfront into the Uptown district on Johnston Road. Her 'Seaside Stroll' — flowing wave lines in the tones of White Rock's sandy beaches — was realized in TrafficPatterns preformed thermoplastic. Permanent. UV-stable. Slip-resistant. In its first season, Uptown reported 40% more foot traffic to the district."},
    {"name": "Langley Railroad Heritage", "location": "Langley City, British Columbia",
     "product": "TrafficPatterns",
     # Actual railroad crosswalk photos sourced from squareonepaving.com (March 2025 install).
     # featured.jpg: overhead shot showing tie-and-rail pattern.
     # detail.jpg: close-up of the installation showing thermoplastic tile geometry.
     "hero": _pick(BLOG_DIR / "langley-railroad-heritage" / "featured.jpg"),
     "detail": _pick(BLOG_DIR / "langley-railroad-heritage" / "detail.jpg"),
     "title": "Heritage cast in thermoplastic.",
     "story": "Langley City's crosswalk at the entrance to Linwood Park connects modern pedestrian infrastructure to the city's railway history. Railroad tie-and-rail pattern in preformed TrafficPatterns thermoplastic — tan panels mimicking wooden rail ties, white lines suggesting steel rails, fused permanently to the asphalt. Installed by Square One Paving, March 2025. A social media landmark before the crew had packed up."},
]


# Installer entries — `logo` is the path to a brand logo file. Drop a PNG
# (transparent background preferred) into catalog-print-build/assets/installer-logos/
# named after the URL stem (e.g. squareonepaving.png) and it will be picked up
# automatically. Until then the renderer draws a tidy [LOGO] placeholder and
# generate_plugin prints a flag-list at the end of the build so Vernon knows
# which logos still need to be supplied.
_LOGO_DIR = ROOT / "assets" / "installer-logos"

INSTALLERS = [
    {"name": "Square One Paving", "region": "British Columbia",
     "image": _pick(ASSETS / "DecoMark community park 1.png"),
     "logo": _pick(_LOGO_DIR / "squareonepaving.png"),
     "body": "BC's certified StreetPrint and decorative thermoplastic installer. From stamped-asphalt driveways in Langley strata developments to municipal streetscapes — outstanding outcomes for municipalities, developers, and contractors across British Columbia.",
     "url": "squareonepaving.com", "phone": "604-446-9902"},
    {"name": "Thermo Design", "region": "Quebec",
     "image": _pick(ASSETS / "Intergrated Rumble Bars (TrafficPatterns) 1.png"),
     "logo": _pick(_LOGO_DIR / "thermo-design.png"),
     "body": "Spécialiste québécois en marquage de longue durée. Crosswalk programs, bus lane markings, and decorative surface systems for Quebec municipalities and commercial sites — built to survive Quebec winters.",
     "url": "thermo-design.ca", "phone": "450.698.0000"},
    {"name": "Virtue Construction", "region": "Saskatchewan",
     "image": _pick(ASSETS / "Intersection installation TPXD 1.png"),
     "logo": _pick(_LOGO_DIR / "virtueconstruction.png"),
     "body": "Quality Saskatchewan outcomes since 2009. TrafficPatterns crosswalks, StreetBond colour systems, and full HUB portfolio installation for Saskatchewan municipalities and communities — from Saskatoon to rural intersections that specify by name.",
     "url": "virtueconstruction.ca", "phone": "306-251-0177"},
    {"name": "ULS Landscaping", "region": "Alberta and Saskatchewan",
     "image": _pick(ASSETS / "StreetPrint walkway 1.png"),
     "logo": _pick(_LOGO_DIR / "ulslandscaping.png"),
     "body": "10+ years of professional landscape management with certified HUB decorative paving installation across Alberta and Saskatchewan. Parks, pathways, residential driveways, and commercial sites — precision installation, backed by experience.",
     "url": "ulslandscaping.com", "phone": "403-235-5353"},
]


CITIES = [
    "City of Toronto",         "City of Vancouver",
    "York Region",             "TransLink",
    "City of Ottawa",          "UBC",
    "City of Calgary",         "City of Surrey",
    "City of Brampton",        "City of Edmonton",
    "City of Mississauga",     "City of Winnipeg",
    "Region of Peel",          "City of Burnaby",
    "Halifax Regional",        "City of Kelowna",
    "Richmond Hill",           "City of Saskatoon",
    "BC Ministry of Transport","BC Children's Hospital",
]
