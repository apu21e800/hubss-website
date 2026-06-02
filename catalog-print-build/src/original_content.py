"""
Pillar product content — architect & specifier facing.

Vernon's brief: "These flyers should be so well built and thought out that
they should even inform the entire website, print catalogue etc. In other
words let's make these product info flyers a kind of pillar content that
even the product owner and operator would love to reference, like us! But
built for the audience at tradeshows."

Audience: ARCHITECTS and SPECIFIERS at tradeshows. They write specs against
these products. They need:
  - The technical substance that backs a written specification
    (ASTM cites, exact thicknesses + tolerances, friction values, install
     conditions, certifications, sustainability credits)
  - Plain-English framing of WHY each spec matters
  - Honest caveats — substrate limits, temperature floors, what the product
    is NOT for. Builds trust more than overclaiming would.
  - No marketing fluff. Architects can smell it across a booth.

This is the canonical Python source-of-truth for the flyer pipeline. The
companion long-form pillar files live at ./product_pillar_content/<slug>.md
and carry the FULL spec depth + all applications + corrections-from-current-
site notes. The dicts here are the flyer-fit extract — 4-6 spec rows max,
2-4 sentence body, ~6-word tagline.

If Doug flags any value as wrong, swap it in this file ONLY — the flyer
pipeline reads from here and regenerates instantly.
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
        "tagline": "150-mil preformed thermoplastic. Heat-fused — won't peel under bus traffic.",
        "body": (
            "The heavy-duty member of the TrafficPatterns family. Two-foot-square sheets "
            "of 150-mil preformed thermoplastic are heated and stamped into prepared "
            "asphalt with a wire-rope template, producing a brick-pattern decorative "
            "surface that becomes part of the pavement structure — not a coating that "
            "can peel. Anti-skid aggregate (6 Mohs minimum, 30% intermix) is reinforced "
            "through the full cross-section, so the friction surface refreshes as the "
            "marking wears. Specify XD when a standard 125-mil thermoplastic won't "
            "survive the wheel loading: BRT corridors, high-volume intersections, "
            "turning lanes. Asphalt substrate only — explicitly not specified for "
            "Portland cement concrete."
        ),
        "spec_pairs": [
            ("Thickness", "150 mil (3.8 mm) min — heaviest in line"),
            ("Anti-skid", "≥ 6 Mohs aggregate, ≥ 30% intermix"),
            ("Skid resistance", "≥ 60 BPN (ASTM E303)"),
            ("Static friction", "≥ 0.6 wet & dry (ASTM C1028 / D2047)"),
            ("Install temp", "≥ 45°F (7°C) ambient & road"),
            ("Substrate", "Asphalt only — not PCC"),
        ],
        "chips": ["Crosswalks", "BRT Corridors", "Bus Lanes", "Intersections"],
        "eyebrow": "Decorative Pavement Marking",
    },

    "traffic-patterns": {
        "tagline": "125-mil interconnected thermoplastic. Asphalt and concrete.",
        "body": (
            "The standard-duty member of the TrafficPatterns family. Pre-cut "
            "interconnected sheets simulate pavers — no stamping templates or grids "
            "required, just surface-applied with infrared heat. Unlike XD, "
            "TrafficPatterns specifies on both asphalt AND Portland cement concrete "
            "(including green concrete that has set but not fully hardened) — a "
            "meaningful expansion of substrate options. Anti-skid aggregate at 8 Mohs "
            "minimum (harder than XD's 6 Mohs) is embedded through the full 125-mil "
            "cross-section. Specify TrafficPatterns for decorative crosswalks, parks, "
            "schools, and public spaces where XD's heavier cross-section isn't required."
        ),
        "spec_pairs": [
            ("Thickness", "125 mil (3.18 mm) minimum"),
            ("Anti-skid", "≥ 8 Mohs aggregate, ≥ 30% intermix"),
            ("Skid resistance", "≥ 60 BPN (ASTM E303)"),
            ("Static friction", "≥ 0.6 wet & dry (ASTM C1028 / D2047)"),
            ("Install temp", "≥ 45°F (7°C) ambient & road"),
            ("Substrate", "Asphalt + PCC (incl. green concrete)"),
        ],
        "chips": ["Crosswalks", "Parks", "Schools", "Plazas"],
        "eyebrow": "Decorative Pavement Marking",
    },

    "streetbond": {
        "tagline": "Waterborne epoxy-modified acrylic. Flexes with the pavement.",
        "body": (
            "A high-performance two-component waterborne epoxy-modified acrylic coating "
            "engineered to turn asphalt or concrete into coloured, durable, slip-"
            "resistant surfaces. Spec the full system: water-based SB120 / SB150 / "
            "SB150 AL for the body of work; MMA-based Pro 220 / Pro 250 for cold-"
            "climate installation; concrete primers (solvent-based QS, waterborne WB) "
            "for substrate prep. 73+ standard colours plus custom matching. "
            "Documented long-life field performance: 10+ years on Beale Street "
            "(Memphis), 12+ years in Padua (Italy). Best results at 50°F (10°C) and "
            "rising, with no precipitation within 24 hours of install."
        ),
        "spec_pairs": [
            ("Chemistry", "Waterborne epoxy-modified acrylic"),
            ("VOC", "< 50 g/L — well below SCAQMD Rule 1113"),
            ("Friction (SB150 wet)", "35–70 BPN (ASTM E303)"),
            ("Adhesion", "300–1,400 psi (ASTM D4541)"),
            ("Cure to traffic", "6–24 hr, climate dependent"),
            ("Coverage", "36–49 ft²/gal at 3–4 layer build"),
        ],
        "chips": ["Bike Lanes", "Bus Lanes", "Plazas", "Sport Courts"],
        "eyebrow": "Coloured Pavement Coating",
    },

    "streetbondsr": {
        "tagline": "Solar-reflective StreetBond. LEED v4 SSc7.1 — SRI ≥ 29.",
        "body": (
            "The solar-reflective variant of StreetBond150 — same waterborne epoxy-"
            "modified acrylic chemistry paired with high-SRI pigment colourants that "
            "reduce surface temperature and mitigate urban heat island. Engineered "
            "specifically for LEED v4 Sustainable Sites Credit 7.1 (Heat Island "
            "Effect — Non-Roof). Limestone Grey delivers SRI 65 — far above the "
            "29-point LEED threshold — and the 'Invisible Shade' colourant system "
            "pushes Solar Reflectance above 0.334 on darker tones too, so designs "
            "aren't restricted to white or light grey. ASTM E303 friction values "
            "(81 BPN dry / 77 BPN wet) and the third-party Friction Certificate of "
            "Analysis support LEED submissions and accessibility review."
        ),
        "spec_pairs": [
            ("LEED metric", "SRI ≥ 29 (LEED v4 SSc7.1)"),
            ("SRI (Limestone Grey)", "65 — well above threshold"),
            ("Solar Reflectance", "≥ 0.334 with Invisible Shade"),
            ("Friction (dry / wet)", "81 / 77 BPN (ASTM E303)"),
            ("VOC", "~19 g/L (ASTM D3960-05)"),
            ("Flexibility", "Passes 101.6 mm mandrel @ -18°C"),
        ],
        "chips": ["LEED Sites", "Parking", "Schools", "Climate-Action"],
        "eyebrow": "Solar-Reflective Coating",
    },

    "streetprint": {
        "tagline": "Genuine stamped asphalt. The surface IS the asphalt — flush, no joints.",
        "body": (
            "A true stamped-asphalt system. The asphalt itself is reheated in place "
            "with StreetHeat® infrared equipment, imprinted with a wire-rope template "
            "and a vibratory plate compactor, then coated with StreetBond150 for "
            "colour and protection. There is no paver, no thermoplastic inlay, no "
            "joints — the finished surface is the pavement, flush with the surround. "
            "More than 50 million square feet installed since 1992. Spec from 100+ "
            "template SKUs across 15 pattern families (Offset Brick, Herringbone, "
            "Ashlar Slate, British Cobble, Eurofan, custom). Must be installed by an "
            "IPC-certified StreetPrint applicator — HUBSS maintains the Canadian "
            "certification."
        ),
        "spec_pairs": [
            ("System", "Imprinted asphalt + StreetBond150 colour coat"),
            ("Imprint depth", "≥ 3/8 in — re-stamped if shallower"),
            ("Heating ceiling", "≤ 325°F (162°C) infrared"),
            ("HMA thickness", "1.5–2 in compacted (recommended)"),
            ("Pattern library", "100+ SKUs across 15 families"),
            ("Open to traffic", "Immediate (uncoated) / 6–24 hr (coated)"),
        ],
        "chips": ["Crosswalks", "Driveways", "Plazas", "Heritage"],
        "eyebrow": "Stamped Asphalt System",
    },

    "decomark": {
        "tagline": "Custom thermoplastic graphics. Factory-fabricated from vector artwork.",
        "body": (
            "Custom preformed thermoplastic for horizontal surface graphics — logos, "
            "wayfinding, civic art, school spirit, community-pride installations. "
            "Factory-fabricated to vector artwork in 24×36-inch multi-colour segments, "
            "then heat-fused to asphalt or concrete (including green concrete). "
            "Anti-skid aggregate at 9 Mohs — the hardest in the line — is embedded "
            "through the 125-mil cross-section. Independently documented to last 6 to "
            "8 times longer than painted alternatives. ADA-compliant pedestrian and "
            "wheelchair-friendly surface. Spec from a 35+ standard colour palette or "
            "submit a custom colour for matching."
        ),
        "spec_pairs": [
            ("Thickness", "125 mil (3.18 mm) minimum"),
            ("Anti-skid", "≥ 9 Mohs — hardest in line"),
            ("Skid resistance", "≥ 60 BPN (ASTM E303)"),
            ("Standard sheet", "24 × 36 in factory-assembled"),
            ("Substrate", "Asphalt + PCC (incl. green concrete)"),
            ("Service life", "6–8× painted alternatives"),
        ],
        "chips": ["Identity", "Wayfinding", "Public Art", "Branding"],
        "eyebrow": "Custom Surface Signage",
    },

    "mmax": {
        "tagline": "Two-component MMA + corundum. Traffic-ready in 45 minutes.",
        "body": (
            "A two-component methyl methacrylate resin coating with corundum aggregate "
            "(9 Mohs — the hardest anti-skid in the line). Squeegee-, roller-, or "
            "spray-applied; cures via BPO catalyst added at install. Traffic-ready in "
            "30–60 minutes — typically 45 — enabling complete overnight installation "
            "in active corridors without disrupting weekday transit. EF Green meets "
            "FHWA chromaticity coordinates for bike-lane green; Transit Lane Red meets "
            "coordinates for bus-lane red. Extended Season variant specifies down to "
            "35°F (2°C) substrate temperature — wider than most coloured-lane "
            "treatments for Canadian shoulder-season work."
        ),
        "spec_pairs": [
            ("Chemistry", "Two-component MMA + corundum (9 Mohs)"),
            ("Cure to traffic", "30–60 min (≈ 45 typical)"),
            ("Install temp (Ext. Season)", "35°F to 150°F (2°C to 66°C)"),
            ("Build thickness", "~90 mil (2.3 mm) typical"),
            ("Skid resistance", "> 60 BPN (ASTM E303)"),
            ("VOC", "< 100 g/L (Extended Season)"),
        ],
        "chips": ["Bus Lanes", "Bike Lanes", "BRT", "Transit"],
        "eyebrow": "MMA Coloured Lane Treatment",
    },

    "duratherm": {
        "tagline": "Sub-flush inlaid thermoplastic. Built for the snowplow.",
        "body": (
            "Inlaid preformed thermoplastic for crosswalks and streetscape elements "
            "where winter maintenance is the deciding factor. A specialized infrared "
            "heater softens the asphalt, a template imprints depressions with a "
            "700–900 lb vibratory plate compactor, and precut DuraTherm sheets are "
            "placed into the depressions and thermally bonded. The finished marking "
            "sits SLIGHTLY BELOW the surrounding asphalt — sub-flush — which is what "
            "makes DuraTherm uniquely tolerant of snowplow blades and aggressive "
            "winter operations. ADA-compliant, ISO 9001 certified. Must be installed "
            "by an Ennis-Flint TrafficScapes Certified Applicator — HUBSS is the "
            "Canadian certifying body. Asphalt substrate only."
        ),
        "spec_pairs": [
            ("Thickness", "90 mil (2.3 mm) minimum"),
            ("Profile", "Sub-flush — below surrounding surface"),
            ("Install method", "Template imprint + vibratory plate"),
            ("Anti-skid (intermix / surface)", "≥ 6 Mohs / ≥ 8 Mohs"),
            ("Install temp", "≥ 40°F (5°C) — no exceptions"),
            ("Substrate", "Asphalt only — not PCC"),
        ],
        "chips": ["Crosswalks", "Streetscape", "Heritage", "Calming"],
        "eyebrow": "Inlaid Pavement Marking",
    },

    "durashield": {
        "tagline": "Two-component asphalt maintenance coating. Solar Gray = SR 0.33.",
        "body": (
            "A two-component waterborne epoxy-modified acrylic pavement maintenance "
            "coating for asphalt — spray + back-roll applied. Same flexible "
            "epoxy-acrylic chemistry as StreetBond, scaled for parking-lot and "
            "residential-driveway economics. Specify in Asphalt (black) for "
            "restoration and protection, or Solar Gray for heat-mitigation projects "
            "(Solar Reflectance 0.33 initial). VOC < 50 g/L. Coverage approximately "
            "65 ft²/gallon at 14-mil dry thickness in two layers. Install at 50°F "
            "(10°C) and rising — temperature must not drop below 50°F within 24 "
            "hours of application. Colour cannot be altered using supplemental "
            "pigments — spec one of the two documented colours."
        ),
        "spec_pairs": [
            ("Chemistry", "Two-component waterborne epoxy-acrylic"),
            ("Volume solids", "57 ± 2% (ASTM D2697)"),
            ("Solar Reflectance (Solar Gray)", "0.33 initial"),
            ("Coverage", "65 ft²/gal at 14 mil dry, 2 layers"),
            ("Friction (dry / wet)", "> 65 / > 35 BPN (ASTM E303)"),
            ("Install temp", "≥ 50°F (10°C) and rising"),
        ],
        "chips": ["Parking", "Driveways", "Pathways", "LEED Sites"],
        "eyebrow": "Pavement Maintenance Coating",
    },

    "airmark": {
        "tagline": "Airfield-grade preformed thermoplastic. Non-runway airside.",
        "body": (
            "Preformed thermoplastic engineered for airfield use — taxiways, ramps, "
            "aprons, gates, and vehicular airside roads. Retroreflective glass beads "
            "are embedded throughout the cross-section so visibility holds through "
            "the wear cycle. Designed to meet FAA Advisory Circular guidelines "
            "(AC 150/5340-1 series) and ICAO airfield-marking standards. "
            "Heat-applied by certified crews. Five standard colours: Red, White, "
            "Yellow, Black, Pink. Installation efficiency reduces taxiway-closure "
            "time vs. hand-painted multi-colour markings. NOT FOR RUNWAYS — runway "
            "markings use WB Airfield Paint (a separate liquid waterborne acrylic, "
            "applied via airless spray)."
        ),
        "spec_pairs": [
            ("Use envelope", "Taxiways / ramps / aprons (non-runway)"),
            ("Material", "Preformed thermoplastic + glass beads"),
            ("Retroreflectivity", "Beads through full cross-section"),
            ("Compliance", "FAA AC 150/5340-1 series + ICAO"),
            ("Manufacturing", "ISO 9001:2015 certified"),
            ("Colours", "5 std: Red / White / Yellow / Black / Pink"),
        ],
        "chips": ["Taxiways", "Aprons", "Gates", "Airside Roads"],
        "eyebrow": "Airport Pavement Marking",
    },

    "premark": {
        "tagline": "Pre-cut regulatory thermoplastic. Lasts 6–8× longer than paint.",
        "body": (
            "Pre-cut preformed thermoplastic regulatory pavement markings — arrows, "
            "stop bars, yield triangles, school-zone legends, bike pictograms, "
            "accessible-parking symbols (ISA), crosswalk lines, rumble strips. "
            "Heat-applied with an industrial propane torch with no surface "
            "preheating, drive-on immediately. Specify by manufacturing finish: BD "
            "(Beaded — full retroreflectivity for vehicular markings); VG (ViziGrip "
            "— beads + anti-skid for crosswalks and bike lanes); NB (Non-Beaded — "
            "for reversible arrows); SK (Skid-Only — for coloured preferential "
            "lanes). PreMarkXF is the cold-weather variant with no minimum road or "
            "ambient temperature requirement — the right call for Canadian "
            "shoulder-season and winter installs. Up to 60% recycled content. "
            "ADA-compliant."
        ),
        "spec_pairs": [
            ("Finishes", "BD (Beaded) / VG (ViziGrip) / NB / SK"),
            ("Cold-weather variant", "PreMarkXF — no minimum temp"),
            ("Install", "Industrial propane torch, drive-on"),
            ("Recycled content", "Up to 60%"),
            ("Substrate", "Asphalt + PCC (sealer on concrete)"),
            ("Shelf life", "24 mo (PreMark) / 2 yr (XF)"),
        ],
        "chips": ["Arrows", "Stop Bars", "School Zones", "Accessibility"],
        "eyebrow": "Regulatory Pavement Marking",
    },

    # ── Repair line ─────────────────────────────────────────────────────
    "chipfill": {
        "tagline": "Hot-applied permanent pothole repair. Year-round, all weather.",
        "body": (
            "A hot-applied surface defect repair material — manufactured by Geveko "
            "Markings (Denmark / Sweden) and distributed in Canada by HUBSS. "
            "Pre-formed in chip form, laid into the prepared defect, and activated "
            "with a propane heat torch — no specialized equipment, no hot-mix plant. "
            "Conforms to the defect contour and bonds chemically to the surrounding "
            "asphalt or concrete, sealing against the water ingress that drives "
            "freeze-thaw failure. Sets in minutes; lane re-opens to traffic same "
            "shift. Specify ChipFill standalone for small defects (cracks, joints, "
            "small potholes); pair with AggreFill for larger potholes up to ~1 m². "
            "Year-round deployment — works through Canadian winters when hot-mix "
            "plants are seasonally closed."
        ),
        "spec_pairs": [
            ("Type", "Hot-applied preformed repair material"),
            ("Install", "Lay in, activate with propane torch"),
            ("Substrate", "Asphalt + concrete"),
            ("Weather window", "Year-round, all conditions"),
            ("Cure / re-open", "Minutes after install"),
            ("Pair with AggreFill", "Repairs up to ~1 m²"),
        ],
        "chips": ["Potholes", "Cracks", "Joints", "Utility Cuts"],
        "eyebrow": "Concrete & Asphalt Repair",
    },

    "aggrefill": {
        "tagline": "Pre-coated aggregate. Pairs with ChipFill for potholes up to 1 m².",
        "body": (
            "A pre-coated aggregate filler — manufactured by Geveko Markings, "
            "distributed in Canada by HUBSS — used in combination with ChipFill to "
            "repair larger potholes up to approximately 1 m² in diameter. AggreFill "
            "provides the structural mass to fill the void; ChipFill bonds the "
            "aggregate matrix and seals the repaired surface. Cold-applied aggregate "
            "+ heat-torch ChipFill matrix above — no hot-mix plant required. The "
            "combined AggreFill + ChipFill system is positioned by the manufacturer "
            "as a permanent repair, not a seasonal patch. Year-round, all-conditions "
            "deployment. Sets in minutes; lane re-opens same shift."
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
            "A polymer-blend pourable repair material — manufactured by The "
            "Willamette Valley Company (FastPatch Systems) and distributed in Canada "
            "by HUBSS. Engineered for high-strength, fast-return-to-service repair "
            "of potholes, spalls, joints, wheel paths, and utility cuts. Mixed with "
            "a cordless drill, poured into the defect, finished, and back in service "
            "in under 45 minutes. Up to 80% recycled and renewable polymer content, "
            "100% solids. Completely odourless — suitable for indoor environments "
            "where ventilation rules out hot-mix or solvent-based materials "
            "(warehouse floors, loading docks, underground parkades). Specify the "
            "asphalt-repair or concrete-repair formulation per substrate; pre-"
            "measured kits in 5-gallon, 3-gallon, or 1-gallon sizes."
        ),
        "spec_pairs": [
            ("Type", "Polymer-blend distressed pavement repair"),
            ("Composition", "Up to 80% recycled, 100% solids"),
            ("Cure at 75°F (24°C)", "1 hour"),
            ("Return to service", "< 45 min (with accelerator)"),
            ("Cold-weather option", "FastPatch Kicker accelerator"),
            ("Odour", "Odourless — indoor-suitable"),
        ],
        "chips": ["Potholes", "Spalls", "Warehouses", "Utility Cuts"],
        "eyebrow": "Concrete & Asphalt Repair",
    },
}
