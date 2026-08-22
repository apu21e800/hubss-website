"""Stage B claims fixes — conservative, verified, assert-guarded.
Each replacement fails loudly if the target string isn't found exactly once.
Vernon: 'conservative now, flag for Doug.' Every change is listed below.
Run from catalog-print-build/. Sources of truth cited per change.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "catalog-print-build" / "src"
CC = ROOT / "catalog_content.py"
FC = ROOT / "final_catalog.py"

# (file, label, old, new)
EDITS = [
    # ---- Geography / stats (verified vs hubss.com/about: 10 provinces; 500+ municipalities unverifiable) ----
    (CC, "p5/p7 stat: North America -> Canada",
     '("30+",     "Years",          "Installations across North America"),',
     '("30+",     "Years",          "Installations across Canada, coast to coast"),'),
    (CC, "p5 stat: 500+ municipalities -> 10 provinces (verifiable)",
     '("500+",    "Municipalities", "Specified by name"),',
     '("10",      "Provinces",      "Specified coast to coast"),'),

    # ---- StreetBond liability + unsourced claims (hubss.com has no 'molecular' / no BC MoTI) ----
    (CC, "p17 StreetBond: drop 'molecular' + soften 'will not peel'",
     '"italic": "Flexible acrylic. Bonds at the molecular level. Will not peel.",',
     '"italic": "Flexible acrylic engineered to resist peeling, cracking, and fading.",'),
    (CC, "p17 StreetBond: remove unverified 'BC Ministry of Transportation recognized'",
     "Available in a curated standard palette plus full custom Pantone matching. BC Ministry of Transportation recognized. 30–50 sq ft per gallon.",
     "Available in a curated standard palette plus full custom Pantone matching. 30–50 sq ft per gallon."),

    # ---- TrafficPatterns / TPXD: NON-REFLECTIVE per TrafficPatterns-125 spec sheet (anti-skid aggregate, no beads) ----
    (CC, "p13 TPXD spec: glass-bead retro -> verified skid resistance",
     '("Retroreflectivity", "Glass beads — full depth"), ("Service Life", "Multi-year — outlasts paint")]},',
     '("Skid Resistance", "60 BPN — ASTM E303"), ("Service Life", "Multi-year — outlasts paint")]},'),
    (CC, "p15 TP callout: glass beads -> anti-skid aggregate",
     '"callout_unit": "Preformed thermoplastic — glass beads embedded through full cross-section",',
     '"callout_unit": "Preformed thermoplastic — anti-skid aggregate intermixed through full cross-section",'),
    (CC, "p15 TP body: retroreflective glass beads -> anti-skid aggregate (Mohs 8 / 60 BPN); high-contrast not nighttime",
     "heat-fused to asphalt or concrete with retroreflective glass beads embedded through the full cross-section. Holds nighttime visibility through snowplow cycles",
     "heat-fused to asphalt or concrete with anti-skid aggregate (Mohs 8, 60 BPN) intermixed through the full cross-section. Holds high-contrast colour through snowplow cycles"),
    (CC, "p15 TP spec: glass beads -> skid resistance",
     '("Retroreflectivity", "Full-depth glass beads"),',
     '("Skid Resistance", "60 BPN — ASTM E303"),'),
    (CC, "p6 proof: scope retroreflectivity to regulatory markings, not decorative TP",
     '"Retroreflective crosswalks. High-contrast colour. Slip-resistant by design."),',
     '"High-contrast decorative thermoplastic. Retroreflective regulatory markings where required. Slip-resistant by design."),'),
    (CC, "Crosswalks app: TP/TPXD hold skid resistance + colour, not retroreflectivity",
     "TrafficPatterns and TrafficPatternsXD thermoplastic hold ASTM-rated retroreflectivity through snowplow cycles and de-icing seasons where paint fails within a year.",
     "TrafficPatterns and TrafficPatternsXD thermoplastic hold ASTM-rated skid resistance and high-contrast colour through snowplow cycles and de-icing seasons where paint fails within a year."),
    (CC, "Parking Lots app: scope retroreflectivity to PreMark",
     "TrafficPatterns and PreMark thermoplastic stall markings hold retroreflectivity without annual repainting.",
     "PreMark retroreflective and TrafficPatterns high-contrast thermoplastic stall markings hold up without annual repainting."),
    (CC, "Pedestrian Safety app: separate regulatory retro from decorative TP",
     "Pedestrian safety isn't aesthetic aspiration — it's a measurable outcome. Retroreflective thermoplastic. High-contrast colour that persists through de-icing salt cycles.",
     "Pedestrian safety isn't aesthetic aspiration — it's a measurable outcome. Retroreflective regulatory markings. High-contrast decorative thermoplastic that persists through de-icing salt cycles."),
    (CC, "New Westminster project: TP retroreflective -> high-contrast",
     "StreetBond green for protected bike lanes, TrafficPatterns retroreflective crosswalks, high-contrast colour at every conflict point.",
     "StreetBond green for protected bike lanes, TrafficPatterns high-contrast crosswalks, high-contrast colour at every conflict point."),
    (CC, "Vision Zero project: retroreflective thermoplastic -> high-contrast",
     "Where painted crosswalks fade by spring, retroreflective thermoplastic holds visibility through every season.",
     "Where painted crosswalks fade by spring, high-contrast thermoplastic holds its colour through every season."),
    (CC, "Simcoe project: retroreflectivity -> skid resistance",
     "A rainbow crosswalk that holds colour and retroreflectivity season after season",
     "A rainbow crosswalk that holds colour and skid resistance season after season"),

    # ---- final_catalog.py hardcoded hero/headline strings ----
    (FC, "p108 cities hero: 500+ -> 10 (provinces)",
     'draw_text_block(c, "500+", fx=30, fy=28, font_size_figma=60,',
     'draw_text_block(c, "10", fx=30, fy=28, font_size_figma=60,'),
    (FC, "p108 cities sub line 1: municipalities -> provinces",
     'draw_text_block(c, "Canadian municipalities", fx=30, fy=98,',
     'draw_text_block(c, "provinces and territories", fx=30, fy=98,'),
    (FC, "p108 cities sub line 2: reframe to coast-to-coast",
     'draw_text_block(c, "that specify HUB systems by name.", fx=30, fy=113,',
     'draw_text_block(c, "specify HUB systems by name, coast to coast.", fx=30, fy=113,'),
    (FC, "p55 DPS: Five hundred municipalities -> Ten provinces",
     '"Five hundred municipalities. One standard.",',
     '"Ten provinces. One standard.",'),
    (FC, "p113 statement: 500+ municipalities -> 10 provinces",
     '"30+ years   ·   1,000+ projects   ·   500+ municipalities",',
     '"30+ years   ·   1,000+ projects   ·   10 provinces",'),
    (FC, "p109 L&L: remove specific CE accreditors (AIBC/RAIC/PEO) pending Doug confirmation",
     '"CE credits — AIBC, RAIC, PEO",',
     '"Continuing-education content for your team",'),
]


def main():
    changed = {}
    for f, label, old, new in EDITS:
        txt = changed.get(f, f.read_text(encoding="utf-8"))
        n = txt.count(old)
        assert n == 1, f"FAIL [{label}] expected 1 match, found {n} in {f.name}\n  OLD: {old[:80]!r}"
        changed[f] = txt.replace(old, new)
        print(f"  OK  {f.name:20} {label}")
    for f, txt in changed.items():
        f.write_text(txt, encoding="utf-8")
    print(f"\nApplied {len(EDITS)} edits across {len(changed)} files.")


if __name__ == "__main__":
    main()
