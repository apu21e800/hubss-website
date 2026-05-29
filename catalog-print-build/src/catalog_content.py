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
        ("20yr",    "Performance",    "Colour retention on stamped asphalt"),
    ],
    "proof": [
        ("01", "Built for freeze-thaw climates",
               "Stress-tested for de-icing salts, snowplow blades, and the cycles that destroy paint."),
        ("02", "Lower lifecycle cost than paint",
               "Thermoplastic and MMA last 6 to 8 times longer than paint — with no annual repaint window."),
        ("03", "Visible in every condition",
               "Retroreflective crosswalks. High-contrast colour. Slip-resistant by design."),
        ("04", "Specified coast to coast",
               "Trusted by transportation engineers, urban designers, and municipal procurement from Vancouver to Halifax."),
    ],
}


# ===== PRODUCTS (12 — AirMark removed per Doug) =====
PRODUCTS = [
    {"name": "TrafficPatternsXD",
     "category": "Heavy-Duty Preformed Thermoplastic",
     "tagline": "When the surface has to hold.",
     # tpxd-03.jpg WRONG: showed StreetPrint herringbone brick pattern, not TPXD thermoplastic markings
     # tpxd-05.jpg: green/white decorative TPXD crosswalk — shows actual preformed thermoplastic panels ✓
     "hero": _pick(PRODUCTS_DIR / "traffic-patterns-xd" / "traffic-patterns-xd-05.jpg",
                   PRODUCTS_DIR / "traffic-patterns-xd" / "traffic-patterns-xd-03.jpg"),
     "title": "Heavy-duty thermoplastic.",
     "italic": "150-mil aggregate-reinforced. Built for BRT corridors and high-volume intersections.",
     "callout": "150 mil",
     "callout_unit": "Aggregate-reinforced preformed thermoplastic — performance aggregate through full cross-section",
     "body": "TrafficPatternsXD is HUB's heaviest thermoplastic — 150-mil preformed material with performance aggregate reinforced through the full cross-section. Delivers exceptional skid resistance under wet-surface bus traffic, turning movements, and concentrated wheel loads where painted markings and lighter thermoplastics fail. Heat-fused permanently to asphalt or concrete. Specified by Canadian transit authorities and municipalities coast to coast for BRT corridors, high-volume crosswalks, and bus stop pads.",
     "uses": ["Crosswalks", "Bike Lanes", "Bus Lanes", "BRT Corridors"],
     "spec_pairs": [("Thickness", "150 mil"), ("Aggregate", "Bound through full cross-section"),
                    ("Retroreflectivity", "Glass beads — full depth"), ("Service Life", "Multi-year — outlasts paint")]},
    {"name": "TrafficPatterns",
     "category": "Preformed Thermoplastic",
     "tagline": "Outlasts paint by seasons, not months.",
     # tp-08.jpg WRONG: showed UBC Musqueam DecoMark cultural crosswalk, not standard TP markings
     # tp-05.jpg: Indigenous recognition crosswalk — at least shows flat thermoplastic (not stamped asphalt)
     "hero": _pick(PRODUCTS_DIR / "traffic-patterns" / "traffic-patterns-05.jpg",
                   PRODUCTS_DIR / "traffic-patterns" / "traffic-patterns-08.jpg"),
     "title": "Standard thermoplastic.",
     "italic": "125-mil preformed. Heat-fused. No repaint cycle.",
     "callout": "125 mil",
     "callout_unit": "Preformed thermoplastic — glass beads embedded through full cross-section",
     "body": "Factory-manufactured preformed thermoplastic at 125mil — heat-fused to asphalt or concrete with retroreflective glass beads embedded through the full cross-section. Holds nighttime visibility through snowplow cycles and de-icing salt seasons where paint requires annual reapplication. Customizable designs and colours let planners embed community character and identity into the crosswalk itself. Open to traffic within hours of installation.",
     "uses": ["Crosswalks", "Bike Lanes", "Parks", "Regulatory"],
     "spec_pairs": [("Thickness", "125 mil"), ("Retroreflectivity", "Full-depth glass beads"),
                    ("Open to Traffic", "Hours"), ("Service Life", "Multi-year — outlasts paint")]},
    {"name": "StreetBond",
     "category": "Coloured Acrylic Coating",
     "tagline": "Coloured pavement that moves with asphalt.",
     "hero": _pick(PRODUCTS_DIR / "streetbond" / "streetbond-112.jpg"),
     "title": "The colour system.",
     "italic": "Flexible acrylic. Bonds at the molecular level. Will not peel.",
     "callout": "Pantone",
     "callout_unit": "Full custom matching plus standard palette — bike lanes, plazas, driveways",
     "body": "Flexible acrylic engineered to move with the pavement — resisting the cracking from excessive hardness, premature wear from excessive flexibility, and slipperiness from overly smooth surfaces that compromise inferior coatings. Available in a curated standard palette plus full custom Pantone matching. BC Ministry of Transportation recognized. 30–50 sq ft per gallon.",
     "uses": ["Bike Lanes", "Plazas", "Courts", "Parking"],
     "spec_pairs": [("Type", "Flexible acrylic"), ("Surfaces", "Asphalt and concrete"),
                    ("Colour", "Full Pantone matching"), ("Coverage", "30–50 sq ft / gallon")]},
    {"name": "StreetPrint",
     "category": "Stamped Asphalt System",
     "tagline": "Stamped asphalt at a fraction of stone's lifecycle cost.",
     "hero": _pick(PRODUCTS_DIR / "streetprint" / "streetprint-40.jpg"),
     "title": "Stamped asphalt.",
     "italic": "12+ patterns. Flush surface. Snowplow safe.",
     "callout": "12+",
     "callout_unit": "Standard patterns — brick, cobblestone, slate, herringbone, fan, and custom",
     "body": "In-place stamped asphalt that impresses brick, cobblestone, slate, herringbone, and fan patterns directly into new or existing asphalt — sealed with StreetBond UV-stable colour. The finished surface is flush with the road: no raised edges, no shear risk under snowplows, no joints to weed. 12+ standard patterns plus fully custom designs. The visual richness of traditional stone without the maintenance.",
     "uses": ["Crosswalks", "Driveways", "Plazas", "Heritage"],
     "spec_pairs": [("System", "In-place stamping + StreetBond coating"), ("Patterns", "12+ standard + custom"),
                    ("Snowplow Safe", "Yes — flush surface"), ("Base", "New lay or existing asphalt")]},
    {"name": "DecoMark",
     "category": "Custom Preformed Thermoplastic",
     "tagline": "A crosswalk is a canvas.",
     "hero": _pick(PRODUCTS_DIR / "decomark" / "decomark-43.jpg",
                   PRODUCTS_DIR / "decomark" / "decomark-01.jpg"),
     "title": "Custom graphics.",
     "italic": "Pride crosswalks. Indigenous art. Civic landmarks at street scale.",
     "callout": "Custom",
     "callout_unit": "Vector artwork to Pantone-accurate pavement graphics",
     "body": "A crosswalk is a canvas. DecoMark is how you paint it permanently. Precision preformed thermoplastic, fabricated to your vector artwork and Pantone colour, heat-fused to the road. Pride crosswalks. Indigenous cultural recognition art. Neighbourhood identity installations. Mural-scale public art that lets the street tell a community's story.",
     "uses": ["Identity", "Wayfinding", "Public Art", "Memorial"],
     "spec_pairs": [("System", "Preformed components"), ("Colour", "Custom Pantone"),
                    ("Design", "Vector artwork"), ("Install", "Certified crews")]},
    {"name": "MMAX",
     "category": "MMA Resin Lane Coating",
     "tagline": "Traffic-ready overnight. Engineered for transit lanes.",
     "hero": _pick(PRODUCTS_DIR / "mmax" / "mmax-05.jpg"),
     "title": "MMA resin lane coating.",
     "italic": "Methyl methacrylate. 45–60 min cure. Applies at +3°C and rising.",
     "callout": "45 min",
     "callout_unit": "Cure to traffic-ready — complete overnight installation in a single maintenance window",
     "body": "MMA resin that cures to traffic-ready in 45–60 minutes, enabling complete overnight installation in active transit corridors without disrupting weekday operations. Embedded aggregates deliver superior traction under wet conditions. UV-stable pigments resist seasonal fading. Applies at +3°C and rising. The specification for red bus lanes, protected bike lanes, and BRT station zones where cure window and durability outlast painted and acrylic alternatives.",
     "uses": ["Bus Lanes", "Bike Lanes", "Calming", "Transit"],
     "spec_pairs": [("Material", "Methyl methacrylate (MMA) resin"), ("Cure", "45–60 min — traffic-ready"),
                    ("Traction", "Embedded aggregate"), ("Min Temp", "+3°C and rising")]},
    {"name": "StreetBondSR",
     "category": "Solar-Reflective Acrylic Coating",
     "tagline": "Solar reflective. LEED-aligned.",
     "hero": _pick(PRODUCTS_DIR / "streetbondsr" / "streetbondsr-02.jpg"),
     "title": "Cool surface coating.",
     "italic": "Initial SRI ≥ 0.33. LEED v4 SS Credit: Heat Island Reduction.",
     "callout": "SRI",
     "callout_unit": "≥ 0.33 initial Solar Reflectance Index — meets LEED v4 Heat Island threshold",
     "body": "Solar reflective acrylic coating with Initial Solar Reflectance ≥ 0.33 — meeting the LEED v4 SS Credit: Heat Island Reduction threshold for non-roof hardscape. Same flexible chemistry and adhesion characteristics as StreetBond. Reduces pavement surface temperatures, mitigates urban heat island, and supports climate action plan implementation. Available in a curated palette of SRI-optimized tones plus custom Pantone matching.",
     "uses": ["Parking", "Plazas", "LEED Sites", "Schools"],
     "spec_pairs": [("Solar Reflectance", "≥ 0.33 initial"), ("LEED", "v4 SS Credit: Heat Island"),
                    ("Surfaces", "Asphalt and concrete"), ("Coverage", "30–50 sq ft / gallon")]},
    {"name": "DuraTherm",
     "category": "Inlaid Preformed Thermoplastic",
     "tagline": "Inlaid. Flush. Invisible to snowplows.",
     "hero": _pick(PRODUCTS_DIR / "duratherm" / "duratherm-01.jpg"),
     "title": "Inlaid thermoplastic.",
     "italic": "Embedded into a milled groove. Zero profile above grade.",
     "callout": "Flush",
     "callout_unit": "Inlaid into milled asphalt groove — sits at road surface level",
     "body": "Preformed thermoplastic inlaid into a milled groove in the asphalt so the finished surface sits flush with the road — zero raised edges, zero profile for plow blades, no shear risk through Canadian winter maintenance cycles. No trip hazard. Combines decorative visual richness with skid-resistant surface treatment. The specification for markings that must survive heavy snow clearing without seasonal damage.",
     "uses": ["Crosswalks", "Streetscape", "Calming", "Identity"],
     "spec_pairs": [("Install", "Inlaid into milled groove"), ("Profile", "Zero — flush with road"),
                    ("Snowplow Safe", "Yes — no shear risk"), ("Bond", "Heat-fused to asphalt substrate")]},
    {"name": "DuraShield",
     "category": "Pavement Maintenance Coating",
     "tagline": "Maintain a surface, do not replace it.",
     "hero": _pick(PRODUCTS_DIR / "durashield" / "durashield-04.jpg"),
     "title": "Pavement maintenance coating.",
     "italic": "Two-component epoxy-modified acrylic. Solar Reflectance 0.34.",
     "callout": "SR 0.34",
     "callout_unit": "Solar Reflectance — cools the surface and protects asphalt from UV and heat degradation",
     "body": "Two-component waterborne epoxy-modified acrylic coating for asphalt maintenance in pedestrian areas and residential roadways. Solar Reflectance 0.34 — cools the pavement surface and protects the substrate from UV, chemical, and heat degradation. Chemical-resistant: fuel, oil, and deicing agents. Available with anti-slip aggregate. Low VOC.",
     "uses": ["Parking", "Driveways", "Pathways", "LEED Sites"],
     "spec_pairs": [("Type", "Epoxy-modified acrylic coating"), ("Solar Reflectance", "0.34"),
                    ("Chemical Resistance", "Fuel, oil, deicing agents"), ("Anti-Slip", "Available")]},
    {"name": "PreMark",
     "category": "Preformed Regulatory Markings",
     "tagline": "Pre-cut. Heat-applied. Open immediately.",
     "hero": _pick(PRODUCTS_DIR / "premark" / "premark-01.jpg"),
     "title": "Road marking symbols.",
     "italic": "Arrows. Stop bars. Legends. Bike pictographs. No stencils.",
     "callout": "125 mil",
     "callout_unit": "Standard thickness — 90mil ViziGrip option for lighter-duty applications",
     "body": "Preformed thermoplastic symbols pre-cut to specification: turn arrows, stop bars, yield triangles, school zone legends, bicycle pictographs, accessible parking symbols, and crosswalk ladder lines. 125mil standard. Heat-applied via propane torch — open to traffic immediately, no curing window, no stencils. Intersection-grade glass bead retroreflectivity outlasts painted markings by seasons without annual reapplication.",
     "uses": ["Bike Lanes", "Crosswalks", "Regulatory", "Parking"],
     "spec_pairs": [("Thickness", "125mil standard / 90mil ViziGrip"), ("Installation", "Heat-applied — drive-on immediately"),
                    ("Retroreflectivity", "Intersection-grade glass bead"), ("Service Life", "Multi-year municipal use")]},
    # v41 — Vernon's call: ChipFill, AggreFill, Fast Patch removed from the
    # CATALOGUE publication. They remain on the WEBSITE (lib/products.ts
    # entries + /products/chipfill etc.). The print catalogue holds the
    # 11 core specified-by-engineers products only. Repair products are a
    # transactional-buyer story and don't belong in the engineer/planner
    # spec book.
    {"name": "AirMark",
     "category": "Airfield Preformed Thermoplastic",
     "tagline": "Airfield markings, certified to last.",
     "hero": _pick(PRODUCTS_DIR / "airmark" / "airmark-04.jpg",
                   PRODUCTS_DIR / "airmark" / "airmark-01.jpg"),
     "title": "Airfield thermoplastic.",
     "italic": "Preformed. Heat-applied. Engineered to airfield marking standards.",
     "callout": "4x",
     "callout_unit": "Service life vs. painted alternatives — full-depth glass bead",
     "body": "Airfield markings are safety-critical. Precision, visibility, and permanence are not negotiable. AirMark preformed thermoplastic is engineered to airfield marking standards, delivering consistent dimensional accuracy, premium retroreflectivity through full-depth glass bead construction, and a service life that outlasts paint by four to one. Heat-applied by certified crews to asphalt and concrete airfield surfaces. The choice for airports and aerodrome operators who need markings that hold their specification year-round.",
     "uses": ["Taxiways", "Aprons", "Helipads", "Ground Vehicles"],
     "spec_pairs": [("Application", "Non-runway airfield surfaces"), ("Material", "Preformed thermoplastic"),
                    ("Retroreflectivity", "Full-depth glass bead"), ("Service Life", "4× painted alternatives")]},
]


# ===== APPLICATIONS (17 — Airports removed) =====
APPLICATIONS = [
    {"name": "Crosswalks", "tagline": "Pedestrian safety, designed in.",
     "image": _pick(_app_img("crosswalks", 3)),
     "body": "TrafficPatterns and TrafficPatternsXD thermoplastic hold ASTM-rated retroreflectivity through snowplow cycles and de-icing seasons where paint fails within a year. DecoMark and StreetBond open the intersection as a canvas — Pride crossings, Indigenous cultural art, neighbourhood identity. Specified by municipalities from Halifax to Vancouver."},
    {"name": "Bike Lanes", "tagline": "Visibility that holds, season after season.",
     "image": _pick(_app_img("bike-lanes", 14)),
     "body": "A faded bike lane is a dangerous bike lane. StreetBond UV-stable acrylic and MMAX MMA resin maintain vivid colour through years of traffic and weather without chalking or fading. Bond strength above 3 MPa for cured MMAX zones."},
    {"name": "Bus Lanes", "tagline": "Engineered for the harshest urban loads.",
     "image": _pick(_app_img("bus-lanes", 20)),
     "body": "BRT corridors are among the most demanding surfaces in any city's network. MMAX MMA resin cures to traffic-ready in 45–60 minutes, enabling complete overnight installation without disrupting weekday service. TrafficPatternsXD aggregate-reinforced thermoplastic delivers high skid resistance at bus stops and turning movements. Both outlast painted markings season after season."},
    {"name": "Parking Lots", "tagline": "Looks maintained, performs safely, costs less.",
     "image": _pick(_app_img("parking-lots", 1)),
     "body": "Parking lots take a disproportionate beating. DuraShield asphalt maintenance coating (SR 0.34) protects oxidized surfaces from UV, heat, and chemical degradation. TrafficPatterns and PreMark thermoplastic stall markings hold retroreflectivity without annual repainting. StreetBond creates branded wayfinding zones and fire lane designations."},
    {"name": "Parks & Paths", "tagline": "Surfaces worth spending time on.",
     # parks-paths-01.jpg WRONG: showed playground/daycare with play equipment, not a path
     # parks-paths-04.jpg: StreetPrint crosswalk in pedestrian park area (heritage building, pedestrian bollard) ✓
     "image": _pick(_app_img("parks-paths", 4),
                    _app_img("parks-paths", 1)),
     "body": "The path through a park sets the tone for the whole space. StreetBond applies vivid UV-stable colour to existing surfaces. DecoMark brings mural-quality custom graphics. StreetPrint gives plazas the visual richness of stone."},
    {"name": "Playgrounds", "tagline": "Vibrant, slip-resistant, built for hard use.",
     "image": _pick(_app_img("playgrounds", 1)),
     "body": "Children are hard on surfaces. DecoMark thermoplastic brings hopscotch courts, number grids, compass roses, and mural-scale artwork to play surfaces with Pantone-accurate colour and flush-surface edges that eliminate trip hazards."},
    {"name": "Community Branding", "tagline": "Neighbourhood identity, embedded in the street.",
     # community-branding-08.jpg WRONG: tiny dim "4 Yates St." marker, not representative of community branding
     # community-branding-03.jpg: strong community branding crosswalk installation ✓
     "image": _pick(_app_img("community-branding", 3),
                    _app_img("community-branding", 8)),
     "body": "Every neighbourhood has a story. Most go untold on the street. DecoMark embeds Pantone-accurate custom graphics directly into asphalt: First Nations cultural artwork, BIA wayfinding, neighbourhood crests, Pride declarations, heritage commemorations."},
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
     "image": _pick(_app_img("commercial-spaces", 1)),
     "body": "Retail centres, mixed-use developments, hotel porte-cocheres. The surface underfoot signals the quality of everything inside. StreetPrint delivers the visual weight of premium stone paving at a fraction of full installation cost."},
    {"name": "Townhomes", "tagline": "Cohesive hardscape for strata developments.",
     "image": _pick(_app_img("townhomes", 1)),
     "body": "Townhome and strata developments live and die by their first impression. StreetPrint stamped asphalt driveways and entry courts deliver the look of clay pavers or stone cobble at a fraction of the cost — no settling, no weeding."},
    {"name": "Pedestrian Safety", "tagline": "Vision Zero, on the surface.",
     "image": _pick(_app_img("crosswalks", 18)),
     "body": "Pedestrian safety isn't aesthetic aspiration — it's a measurable outcome. Retroreflective thermoplastic. High-contrast colour that persists through de-icing salt cycles. The complete specification for engineers taking Vision Zero seriously."},
    {"name": "Traffic Calming", "tagline": "Drivers slow without barriers.",
     "image": _pick(_app_img("traffic-calming", 1)),
     "body": "Colour changes driver behaviour. Gateway treatments, speed table surface markings, and intersection colour reduce vehicle entry speeds without requiring physical barriers that impede emergency response."},
    {"name": "LEED & Heat Island", "tagline": "Solar reflective. Climate-aligned.",
     "image": _pick(_app_img("leed-urban-heat-island", 1)),
     "body": "Standard dark asphalt absorbs most solar radiation. StreetBondSR — Initial Solar Reflectance ≥ 0.33 — meets the LEED v4 SS Credit: Heat Island Reduction threshold for non-roof hardscape. Reduces surface temperatures and mitigates urban heat island. The specification for LEED-certified developments and climate action plan commitments."},
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
     "story": "MMAX red MMA resin bus lane markings for York Region's VIVA Rapid Transit corridor — one of Canada's highest-ridership BRT networks. Bond strength above 3 MPa. Applied overnight. Open to full bus traffic in 90 minutes. No daytime closure. No paint cycle."},
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
     "hero": _pick(_app_img("bus-lanes", 3)),
     "detail": _pick(_app_img("bus-lanes", 38)),
     "title": "A transit corridor with a clear identity.",
     "story": "StreetBond coloured pavement across London Transit's East Link BRT priority corridor — vivid red lanes that communicate bus priority immediately to every driver on the road. Colour-stable through Ontario freeze-thaw cycles. No annual repaint window. A branded transit corridor built for the long term."},
    {"name": "BC Children's Hospital", "location": "Vancouver, British Columbia", "product": "StreetBond + DecoMark",
     "hero": _pick(BLOG_DIR / "bc-childrens-hospital-labyrinth" / "featured.jpg",
                   PRODUCTS_DIR / "streetbond" / "streetbond-95.jpg"),
     "detail": _pick(PRODUCTS_DIR / "decomark" / "decomark-43.jpg"),
     "title": "Playful surfaces. Healing spaces.",
     "story": "StreetBond coatings and DecoMark surface graphics — including a meditation labyrinth — installed across active wards and ground-level plazas at BC Children's Hospital. Designed with Connect Landscape Architecture. The surfaces are slip-resistant, chemical-resistant, and built to perform in a healthcare environment."},
    {"name": "New Westminster Complete Streets", "location": "New Westminster, British Columbia", "product": "StreetBond + TrafficPatterns",
     "hero": _pick(BLOG_DIR / "complete-streets-new-westminster" / "featured.jpg",
                   _app_img("bike-lanes", 22)),
     "detail": _pick(_app_img("bike-lanes", 32)),
     "title": "Modal clarity, written in colour.",
     "story": "Complete Streets across New Westminster: StreetBond green for protected bike lanes, TrafficPatterns retroreflective crosswalks, high-contrast colour at every conflict point. Modal priority made legible. Cyclists protected. Pedestrians seen. The Complete Streets specification that transportation engineers and urban planners return to."},
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
     "story": "Where painted crosswalks fade by spring, retroreflective thermoplastic holds visibility through every season. Specified by municipalities from Halifax to Victoria pursuing Vision Zero — the standard for engineers who need pedestrian safety outcomes, not just pedestrian safety intentions."},
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
     "detail": _pick(_app_img("community-branding", 4)),
     "title": "Six laneways. Six artists.",
     "story": "Six Vancouver laneways. Six artists. StreetBond coloured pavement turned utility corridors into civic gallery space — public art at street scale, permanent and weather-resistant."},
    {"name": "White Rock Pier", "location": "White Rock, British Columbia", "product": "TrafficPatternsXD",
     # v45 FIX: blog featured.png was 206×134 = 62 KB — pixelated when upscaled
     # to a 5x5" print page. Swapped to the 2480×1860 (7.4 MB) booklet PNG
     # of the same shot, which is print-grade. Vernon flagged p79 as blurry.
     "hero": _pick(ASSETS / "Whiterock-Pier-Crosswalk-TrafficPatternsXD-1 1.png",
                   BLOG_DIR / "white-rock-pier-crosswalk" / "featured.png"),
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
     "detail": _pick(BLOG_DIR / "veterans-crosswalk-kitchener" / "featured.jpeg",
                     PRODUCTS_DIR / "decomark" / "decomark-74.jpg"),
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
     "detail": _pick(PRODUCTS_DIR / "traffic-patterns-xd" / "traffic-patterns-xd-129.jpg"),
     "title": "Two years of fundraising. One street.",
     "story": "A young Simcoe resident's two-year fundraising campaign, realized in TrafficPatternsXD by Multiseal. A rainbow crosswalk that holds colour and retroreflectivity season after season — long after painted alternatives would have faded from memory."},
    {"name": "Bowen Island Path", "location": "Snug Cove, British Columbia", "product": "StreetBond",
     # Authentic Bowen Island shot from the blog post — actual project >
     # higher-res generic StreetBond stock.
     "hero": _pick(BLOG_DIR / "bowen-island-asphalt-path" / "featured.jpg",
                   PRODUCTS_DIR / "streetbond" / "streetbond-88.jpg"),
     "detail": _pick(PRODUCTS_DIR / "streetbond" / "streetbond-92.jpg",
                     PRODUCTS_DIR / "streetbond" / "streetbond-86.jpg"),
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
    # ── Two newest projects (2025) — White Rock Seaside Stroll + Langley Railroad Heritage ──
    {"name": "White Rock Seaside Stroll", "location": "White Rock, British Columbia",
     "product": "TrafficPatterns",
     # Coastal wave-inspired mural by artist Amy (Yun Ru) Bao on Johnston Road, Uptown.
     "hero": _pick(BLOG_DIR / "white-rock-langley-trafficpatterns" / "featured.jpg"),
     "detail": _pick(BLOG_DIR / "white-rock-langley-trafficpatterns" / "featured.jpg"),
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


INSTALLERS = [
    {"name": "Square One Paving", "region": "British Columbia",
     "image": _pick(ASSETS / "DecoMark community park 1.png"),
     # Signature project: StreetPrint stamped-asphalt work across BC municipalities and strata
     "body": "BC's certified StreetPrint and decorative thermoplastic installer. From stamped-asphalt driveways in Langley strata developments to municipal streetscapes — outstanding outcomes for municipalities, developers, and contractors across British Columbia.",
     "url": "squareonepaving.com", "phone": "604-446-9902"},
    {"name": "Thermo Design", "region": "Quebec",
     "image": _pick(ASSETS / "Intergrated Rumble Bars (TrafficPatterns) 1.png"),
     # Quebec specialist — marquage de longue durée for municipalities
     "body": "Spécialiste québécois en marquage de longue durée. Crosswalk programs, bus lane markings, and decorative surface systems for Quebec municipalities and commercial sites — built to survive Quebec winters.",
     "url": "thermo-design.ca", "phone": "450.698.0000"},
    {"name": "Virtue Construction", "region": "Saskatchewan",
     "image": _pick(ASSETS / "Intersection installation TPXD 1.png"),
     # Delivering TrafficPatterns, StreetBond, and full HUB portfolio across SK communities
     "body": "Quality Saskatchewan outcomes since 2009. TrafficPatterns crosswalks, StreetBond colour systems, and full HUB portfolio installation for Saskatchewan municipalities and communities — from Saskatoon to rural intersections that specify by name.",
     "url": "virtueconstruction.ca", "phone": "306-251-0177"},
    {"name": "ULS Landscaping", "region": "Alberta and Saskatchewan",
     "image": _pick(ASSETS / "StreetPrint walkway 1.png"),
     # 10+ years certified HUB installation paired with professional landscape management
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
