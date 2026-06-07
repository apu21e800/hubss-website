# Stage B — Regeneration Diff (regen vs staging baseline)

**Regenerated:** `catalog-print-build/output/HUBSS_Catalogue_2026_v50.pdf` — built `python -m src.final_catalog` from current `staging` source (after restoring gitignored `assets/booklet/` from D:).
**Baseline:** `catalogue-2026-finish/HUBSS-Catalogue-2026.pdf` — the served staging PDF (pulled snapshot).

## Headline numbers
| | Regenerated | Baseline (served) |
|---|---|---|
| Pages | **116** ✓ | 116 |
| Live text | **YES** — selectable text on every page (p17=720 chars, p64=472) | **NONE** — 0 text chars/page (flattened raster) |
| Colour | CMYK vector + embedded Inter | flattened RGB raster |
| Trim size | **5.25 × 5.25 in** (5″ trim + 0.125″ bleed) | **1125×1125 px ≈ 6×6 in** design intent |
| File size | 146 MB (full-res embeds) | 25 MB |

## What regeneration FIXES on its own
1. **Live, selectable text** — the brief §8 core requirement. Biggest single win. (Caveat: tracked/letter-spaced caps extract with inter-letter spaces, e.g. `S T R E E T B O N D` — visually fine, mild SEO/a11y wrinkle.)
2. **True CMYK vector build** with embedded fonts, bleed, and crop marks (vs a flattened image dump).

## What regeneration does NOT fix — STILL PRESENT in current source
Regenerated pages render **identical imagery** to the stale baseline for every §3 image defect. Conclusion: the image mismatches are **in the current source**, not merely un-re-rendered. They need source edits in `catalog_content.py`. Root cause for three of them = **mislabeled image files**:

| Page | Project / slot | Renders | Source path | Fix |
|---|---|---|---|---|
| p43 | Community Branding (application) | **Terry Fox "Marathon of Hope" / Nova Scotia map** | `applications/community-branding/community-branding-03.jpg` | File is mislabeled (it's Terry Fox, not community branding). Repoint to a real community-branding shot. |
| p35 | "In the Field" DPS right | **same Terry Fox map** (the §3.1 p35/p43 duplicate) | `community-branding-03.jpg` (via `editorial_products_r`) | Repoint to a distinct full-bleed. |
| p64 | BC Children's Hospital — story/detail | **City of Surrey logo crosswalk** | `products/decomark/decomark-43.jpg` | Hero p63 is correct (BCH labyrinth); detail is wrong. Repoint detail to a real BCH photo. |
| p68 | York Region Pedestrian Safety — story/detail | **UBC Musqueam salmon** | `applications/crosswalks/crosswalks-26.jpg` | File is actually UBC. Hero p67 correct (Woodbridge); repoint detail to a real York shot. |
| p83 / p84 | Kitchener Veterans Memorial | **same "Lest We Forget" photo on both facing pages** | hero == detail (`blog/veterans-crosswalk-kitchener/featured.jpeg`) | Supply a 2nd Kitchener photo, or make p84 a full-bleed of the one shot. No authentic 2nd shot in libraries yet — likely a FLAG. |
| p95 / p96 | White Rock Seaside Stroll | **same wave-crosswalk photo on both facing pages** | hero == detail (`blog/white-rock-langley-trafficpatterns/featured.jpg`) | Needs a distinct 2nd photo or full-bleed treatment. |
| p28 | DuraShield | parking lot reported as **"Ingles" (US chain)** by the PDF-audit | `products/durashield/durashield-04.jpg` | Canadian-only rule — replace with a Canadian lot. |

Additional PDF-audit findings (from canonical `catalogue-2026-finish/ISSUES.md`) to confirm against the current regen in the full-book QA pass: p76 Little Italy reuse (3×), p82 Indigenous Recognition railway sign, p88 Sechelt image, p10/p34/p76 editorial reuse, installer `[LOGO]` placeholders p100–103.

## Claims still printed verbatim in the regen (need source edits — see CLAIMS-VERIFICATION.csv)
- p17 StreetBond **"Bonds at the molecular level. Will not peel."** (soften; drop "molecular")
- p17 StreetBond **"BC Ministry of Transportation recognized"** (StreetBond not on BC list; DuraTherm reportedly is — move/remove)
- p7 **"Installations across North America"** (non-Canadian phrasing → "across Canada / coast to coast")
- p55 / p108 / p113 **"500+ municipalities" / "Five hundred municipalities"** (unverifiable; reframe to "10 provinces")
- p13 / p15 / p37 TP & TPXD **glass-bead retroreflectivity** (per PDF-audit, Ennis-Flint sheets say non-reflective — NEEDS DOUG)
- p17 / p25 **Pantone** on StreetBond/SR (belongs to the TrafficPatterns line)
- p109 Lunch & Learn **CE credits AIBC/RAIC/PEO** (confirm HUBSS is an accredited provider)

## Trim-size gate (printer)
Current build is **5×5″**; prior served PDF was **6×6″** intent. This is the brief §8 "page-coordinate anomaly." **Confirm 5×5 vs 6×6 with the printer before any print export.**
