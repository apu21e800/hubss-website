"""
Original product content — hand-extracted from Doug Bain's verified PDF
source-of-truth Google Docs (saved to ./original_pdf_content/<slug>.txt).

This is the HIGHEST-priority content source for the flyer pipeline.
build_flyers.py prefers entries here over catalog_content.py (catalogue
voice) and over lib/products.ts (legacy website copy).

Editorial discipline:
- tagline: ≤ 10 words. Sets positioning. Becomes the italic subhead.
- body: 2-3 sentences. Plain English. Pulls the strongest 1-2 facts
  the original PDF documents. No marketing fluff, no "[VERIFY]" claims
  from Doug's review-needed list.
- spec_pairs: 4-6 (label, value) tuples. Heavy on ASTM-cited values
  and the buying-decision data (thickness, friction, install temp,
  substrate, cure). Skip storage / packaging detail — that's TDS land.
- chips: 4-6 short application tags. Tracked-caps eyebrow style.

If Doug's review flags ANY value here as wrong, swap it in this file
ONLY — the flyer pipeline reads from here and regenerates instantly.
"""

from typing import TypedDict


class ProductContent(TypedDict, total=False):
    tagline: str
    body: str
    spec_pairs: list[tuple[str, str]]
    chips: list[str]
    eyebrow: str


ORIGINAL_PRODUCTS: dict[str, ProductContent] = {
    # ── Flagships ─────────────────────────────────────────────────────
    "traffic-patterns-xd": {
        "tagline": "Heavy-duty preformed thermoplastic. Built for the routes that destroy paint.",
        "body": (
            "TrafficPatternsXD is the heavy-duty variant of the TrafficPatterns family — "
            "150-mil preformed thermoplastic with anti-skid elements aggregate-reinforced "
            "through the full cross-section. New anti-skid is exposed as the surface wears. "
            "Stamped into heated asphalt with a wire-rope template and heat-fused for a "
            "permanent chemical bond — not a coating that can peel. Specified by Canadian "
            "transit authorities and municipalities for BRT corridors, high-volume "
            "intersections, and heavy turning movements."
        ),
        "spec_pairs": [
            ("Thickness", "150 mil (3.8 mm) minimum"),
            ("Anti-skid", "≥ 30% intermix, ≥ 6 Mohs"),
            ("Skid resistance", "≥ 60 BPN per ASTM E303"),
            ("Static friction", "≥ 0.6 wet/dry per ASTM C1028"),
            ("Install temp", "Down to 45°F (7°C)"),
            ("Substrate", "Asphalt only"),
        ],
        "chips": ["Crosswalks", "BRT Corridors", "Bus Lanes", "Intersections"],
        "eyebrow": "Decorative Pavement Marking",
    },

    "traffic-patterns": {
        "tagline": "Standard-duty interconnected thermoplastic. Asphalt or concrete.",
        "body": (
            "The standard-duty TrafficPatterns. Pre-cut interconnected sheets simulate "
            "pavers — no stamping templates or grids required. Installs on both asphalt "
            "and Portland cement concrete (including green concrete) — a key differentiator "
            "from TPXD. Anti-skid elements at 8 Mohs hardness, embedded through the full "
            "125-mil cross-section. Surface-applied with infrared heat; open to traffic "
            "within minutes."
        ),
        "spec_pairs": [
            ("Thickness", "125 mil (3.18 mm) minimum"),
            ("Anti-skid", "≥ 30% intermix, ≥ 8 Mohs"),
            ("Skid resistance", "≥ 60 BPN per ASTM E303"),
            ("Static friction", "≥ 0.6 wet/dry per ASTM C1028"),
            ("Install temp", "Down to 45°F (7°C)"),
            ("Substrate", "Asphalt + concrete"),
        ],
        "chips": ["Crosswalks", "Parks", "Schools", "Plazas"],
        "eyebrow": "Decorative Pavement Marking",
    },

    "streetbond": {
        "tagline": "Waterborne epoxy-acrylic. Flexes with the pavement. Will not peel.",
        "body": (
            "A high-performance two-component waterborne epoxy-modified acrylic coating "
            "that turns ordinary asphalt or concrete into coloured, durable, slip-"
            "resistant surfaces. The full system spans water-based variants (SB120 / "
            "SB150 / SB150 AL), MMA variants for cold-climate work (Pro 220 / Pro 250), "
            "and concrete primers. 73+ standard colours plus custom matching. ADA-"
            "compliant. Documented field performance of 10+ years (Beale Street, "
            "Memphis) and 12+ years (Padua, Italy)."
        ),
        "spec_pairs": [
            ("Chemistry", "Waterborne epoxy-modified acrylic"),
            ("VOC", "< 50 g/L (water-based)"),
            ("Friction (SB150 wet)", "35–70 BPN per ASTM E303"),
            ("Adhesion", "300–1,400 psi per ASTM D4541"),
            ("Cure to traffic", "6–24 hours, climate dependent"),
            ("Coverage", "36–49 ft²/gal at 3–4 layers"),
        ],
        "chips": ["Bike Lanes", "Bus Lanes", "Plazas", "Parking"],
        "eyebrow": "Coloured Pavement Coating",
    },

    "streetbondsr": {
        "tagline": "LEED-qualifying solar-reflective coating. SRI ≥ 29.",
        "body": (
            "The solar-reflective version of StreetBond150 — same waterborne epoxy-"
            "modified acrylic chemistry, paired with high-SRI pigment colourants that "
            "reduce surface temperature and mitigate urban heat island. Engineered for "
            "LEED v4 SSc7.1 Heat Island Effect credit. 'Invisible Shade' colourant "
            "technology pushes Solar Reflectance above 0.334 without restricting "
            "designs to white or light grey."
        ),
        "spec_pairs": [
            ("SRI (Limestone Grey)", "65 — far above LEED 29 threshold"),
            ("Solar Reflectance", "≥ 0.334 with Invisible Shade"),
            ("LEED credit", "v4 SSc7.1 Heat Island (Non-Roof)"),
            ("VOC", "~19 g/L per ASTM D3960-05"),
            ("Friction (dry/wet)", "81 / 77 BPN per ASTM E303"),
            ("Flexibility", "Passes 101.6 mm mandrel @ -18°C"),
        ],
        "chips": ["LEED Sites", "Parking", "Schools", "Plazas"],
        "eyebrow": "Solar-Reflective Coating",
    },

    "streetprint": {
        "tagline": "Genuine stamped asphalt. The surface IS the asphalt — flush, no joints.",
        "body": (
            "A true stamped-asphalt system. The asphalt itself is reheated in place with "
            "StreetHeat® infrared equipment, imprinted with a wire-rope template using a "
            "vibratory plate compactor, then coated with StreetBond150 for colour and "
            "protection. No separate paver, no thermoplastic inlay, no joints — the "
            "finished surface is flush with the surrounding road. More than 50 million "
            "square feet installed since 1992. 100+ template SKUs across 15 pattern "
            "families."
        ),
        "spec_pairs": [
            ("System", "Imprinted asphalt + StreetBond150 colour"),
            ("Imprint depth", "≥ 3/8 in"),
            ("Heating temp limit", "≤ 325°F (162°C) by infrared"),
            ("Pattern library", "100+ SKUs across 15 families"),
            ("Open to traffic — uncoated", "Immediately"),
            ("Open to traffic — coated", "6–24 hr per StreetBond150"),
        ],
        "chips": ["Crosswalks", "Driveways", "Plazas", "Heritage"],
        "eyebrow": "Stamped Asphalt System",
    },

    "decomark": {
        "tagline": "Custom thermoplastic graphics. Made-to-order from vector artwork.",
        "body": (
            "Custom preformed thermoplastic for horizontal surface graphics — logos, "
            "wayfinding, civic art, school spirit, community-pride installations. "
            "Factory-fabricated to vector artwork in 24×36 in multi-colour segments, "
            "then heat-fused to asphalt or concrete. The hardest anti-skid in the line "
            "(9 Mohs intermix). Lasts 6 to 8 times longer than painted alternatives. "
            "ADA-compliant pedestrian and wheelchair-friendly surface."
        ),
        "spec_pairs": [
            ("Thickness", "125 mil (3.18 mm) minimum"),
            ("Anti-skid", "≥ 30% intermix, ≥ 9 Mohs"),
            ("Skid resistance", "≥ 60 BPN per ASTM E303"),
            ("Standard sheet", "24 × 36 in factory-assembled"),
            ("Substrate", "Asphalt + concrete (incl. green)"),
            ("Palette", "35+ standard + custom matching"),
        ],
        "chips": ["Identity", "Wayfinding", "Public Art", "Branding"],
        "eyebrow": "Custom Surface Signage",
    },

    "mmax": {
        "tagline": "Two-component MMA + corundum. Traffic-ready in 45 minutes.",
        "body": (
            "A two-component methyl methacrylate resin coating with corundum aggregate "
            "(9 Mohs — hardest in the anti-skid lineup). Squeegee-, roller-, or spray-"
            "applied; cures via BPO catalyst added at installation. Traffic-ready in "
            "30–60 minutes — typically 45 — enabling complete overnight installation "
            "in active corridors. Extended Season variant applies down to 35°F (2°C). "
            "EF Green meets FHWA chromaticity coordinates for bike-lane green."
        ),
        "spec_pairs": [
            ("Chemistry", "Two-component MMA + corundum"),
            ("Aggregate", "Corundum, 9 Mohs hardness"),
            ("Cure to traffic", "30–60 min (≈ 45 typical)"),
            ("Install temp (Ext. Season)", "35°F to 150°F (2°C to 66°C)"),
            ("Build thickness", "~90 mil (2.3 mm) typical"),
            ("Skid resistance", "> 60 BPN per ASTM E303"),
        ],
        "chips": ["Bus Lanes", "Bike Lanes", "BRT", "Transit"],
        "eyebrow": "MMA Coloured Lane Treatment",
    },

    "duratherm": {
        "tagline": "Inlaid thermoplastic. Sub-flush profile — built for the snowplow.",
        "body": (
            "Inlaid preformed thermoplastic. A specialized infrared heater softens the "
            "asphalt, a template imprints depressions into the heated surface, and precut "
            "DuraTherm sheets are placed into the depressions and thermally bonded. The "
            "thermoplastic sits SLIGHTLY BELOW the surrounding asphalt — sub-flush — "
            "which is what makes DuraTherm uniquely tolerant of snowplow blades and "
            "aggressive winter maintenance. ADA-compliant, ISO 9001 certified."
        ),
        "spec_pairs": [
            ("Thickness", "90 mil (2.3 mm) minimum"),
            ("Install method", "Template imprint + vibratory plate"),
            ("Anti-skid (intermix/surface)", "≥ 6 Mohs / ≥ 8 Mohs"),
            ("Skid resistance", "≥ 60 BPN per ASTM E303"),
            ("Install temp", "Down to 40°F (5°C)"),
            ("Substrate", "Asphalt only"),
        ],
        "chips": ["Crosswalks", "Streetscape", "Heritage", "Calming"],
        "eyebrow": "Inlaid Pavement Marking",
    },

    "durashield": {
        "tagline": "Two-component asphalt maintenance coating. Solar Gray option = SR 0.33.",
        "body": (
            "A two-component waterborne epoxy-modified acrylic pavement maintenance "
            "coating, spray + back-roll applied to asphalt. Same flexible chemistry as "
            "StreetBond — moves with the pavement, will not peel. Used for parking lots, "
            "residential driveways, and pedestrian areas where colour, slip resistance, "
            "and chemical protection are required but heavy decorative finish isn't. "
            "Solar Gray variant carries Solar Reflectance of 0.33 for heat-mitigation "
            "projects."
        ),
        "spec_pairs": [
            ("Chemistry", "Two-component waterborne epoxy-acrylic"),
            ("Volume solids", "57 ± 2% per ASTM D2697"),
            ("Solar Reflectance (Solar Gray)", "0.33 initial"),
            ("Coverage", "65 ft²/gal at 14 mil dry, 2 layers"),
            ("Friction (dry/wet)", "> 65 / > 35 BPN per ASTM E303"),
            ("VOC", "< 50 g/L (calculated)"),
        ],
        "chips": ["Parking", "Driveways", "Pathways", "LEED Sites"],
        "eyebrow": "Pavement Maintenance Coating",
    },

    "airmark": {
        "tagline": "Airfield-grade preformed thermoplastic. Non-runway airside.",
        "body": (
            "Preformed thermoplastic pavement markings engineered for airfield use — "
            "taxiways, ramps, aprons, gates, and vehicular airside roads. Retroreflective "
            "glass beads embedded throughout the cross-section. Designed to meet FAA "
            "Advisory Circular guidelines (AC 150/5340-1 series) and ICAO standards. "
            "Withstands jet blast, snow clearing, rubber-removal treatments, and the "
            "daily operational demands of an active airfield. Five standard colours."
        ),
        "spec_pairs": [
            ("Use", "Taxiways / ramps / aprons (NON-RUNWAY)"),
            ("Material", "Preformed thermoplastic + glass beads"),
            ("Compliance", "FAA AC 150/5340-1 + ICAO"),
            ("Manufacturing", "ISO 9001:2015 certified"),
            ("Colours", "5 standard (R / W / Y / Black / Pink)"),
            ("Install", "Heat-applied by certified crews"),
        ],
        "chips": ["Taxiways", "Aprons", "Gates", "Airside Roads"],
        "eyebrow": "Airport Pavement Marking",
    },

    "premark": {
        "tagline": "Pre-cut regulatory thermoplastic. Lasts 6–8× longer than paint.",
        "body": (
            "Pre-cut preformed thermoplastic regulatory pavement markings — arrows, stop "
            "bars, yield triangles, school-zone legends, bike pictograms, accessible "
            "parking symbols, crosswalk lines. Heat-applied with an industrial propane "
            "torch, no surface preheating, drive-on immediately. Four manufacturing "
            "finishes: BD (Beaded — full retroreflectivity), VG (ViziGrip — beads + "
            "anti-skid), NB (Non-Beaded), SK (Skid-Only). PreMarkXF cold-weather "
            "variant has no minimum temperature requirement. Made with up to 60% "
            "recycled material."
        ),
        "spec_pairs": [
            ("Finishes", "BD / VG / NB / SK"),
            ("Cold-weather variant", "PreMarkXF — no minimum temp"),
            ("Install", "Industrial propane torch, drive-on"),
            ("Recycled content", "Up to 60%"),
            ("Shelf life", "24 months (PreMark) / 2 yr (XF)"),
            ("Substrate", "Asphalt + concrete (sealer on conc.)"),
        ],
        "chips": ["Arrows", "Stop Bars", "School Zones", "Accessibility"],
        "eyebrow": "Regulatory Pavement Marking",
    },

    # ── Repair line ─────────────────────────────────────────────────────
    "chipfill": {
        "tagline": "Hot-applied permanent pothole repair. Year-round, all weather.",
        "body": (
            "A hot-applied surface defect repair material — manufactured by Geveko "
            "Markings (Denmark / Sweden) and distributed by HUBSS in Canada. Pre-formed "
            "in chip form, laid into the prepared defect, and activated with a propane "
            "heat torch. Conforms to the defect contour and bonds chemically to the "
            "surrounding asphalt or concrete, sealing against the water ingress that "
            "drives freeze-thaw failures. Sets in minutes — lane re-opens to traffic "
            "same shift. Pair with AggreFill for larger potholes up to ~1 m²."
        ),
        "spec_pairs": [
            ("Type", "Hot-applied preformed repair material"),
            ("Install", "Lay in, activate with propane torch"),
            ("Substrate", "Asphalt + concrete"),
            ("Weather window", "Year-round, all conditions"),
            ("Cure / re-open", "Minutes after install"),
            ("Packaging", "26 lb bag (Black)"),
        ],
        "chips": ["Potholes", "Cracks", "Joints", "Utility Cuts"],
        "eyebrow": "Concrete & Asphalt Repair",
    },

    "aggrefill": {
        "tagline": "Pre-coated aggregate. Pairs with ChipFill for potholes up to 1 m².",
        "body": (
            "A pre-coated aggregate filler — manufactured by Geveko Markings, "
            "distributed by HUBSS in Canada — used in combination with ChipFill to "
            "permanently repair larger potholes up to approximately 1 m² in diameter. "
            "AggreFill provides the structural mass to fill the void; ChipFill bonds "
            "the aggregate matrix and seals the repaired surface. The combined system "
            "is positioned as a permanent repair, not a seasonal patch. Year-round "
            "deployment, traffic-ready within minutes."
        ),
        "spec_pairs": [
            ("Type", "Pre-coated aggregate filler"),
            ("Pairing", "Used with Geveko ChipFill matrix"),
            ("Repair size", "Up to ~1 m² in diameter"),
            ("Install", "Cold aggregate + heat-torch ChipFill"),
            ("Substrate", "Asphalt + concrete"),
            ("Cure / re-open", "Minutes after install"),
        ],
        "chips": ["Potholes", "Parking", "Driveways", "Utility Cuts"],
        "eyebrow": "Concrete & Asphalt Repair",
    },

    "fast-patch": {
        "tagline": "Polymer-blend pavement repair. Back in service in under 45 minutes.",
        "body": (
            "A polymer-blend pourable repair material — manufactured by The Willamette "
            "Valley Company (FastPatch Systems) and distributed by HUBSS in Canada — "
            "engineered for high-strength, fast-return-to-service repair of potholes, "
            "spalls, joints, wheel paths, and utility cuts. Mixed with a cordless drill, "
            "poured into the defect, and back in service in under 45 minutes. Made from "
            "a unique polymer blend with up to 80% recycled and renewable materials. "
            "Completely odourless — suitable for indoor environments where ventilation "
            "rules out hot-mix or solvent-based materials."
        ),
        "spec_pairs": [
            ("Type", "Polymer-blend distressed pavement repair"),
            ("Composition", "Up to 80% recycled / renewable; 100% solids"),
            ("Cure at 75°F (24°C)", "1 hour"),
            ("Return to service", "< 45 min with accelerator"),
            ("Cold-weather option", "FastPatch Kicker accelerator"),
            ("Odour", "Odourless — indoor-suitable"),
        ],
        "chips": ["Potholes", "Spalls", "Warehouses", "Utility Cuts"],
        "eyebrow": "Concrete & Asphalt Repair",
    },
}
