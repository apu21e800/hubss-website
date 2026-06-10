# HUBSS Catalogue 2026 — CHANGELOG (finishing pass)

Branch `chore/catalogue-finishing-pass` (off `staging`). Source of record:
ReportLab pipeline `catalog-print-build/` (v50 build) → 116 pp, **6×6″ trim** + 0.125″ bleed (Vernon-confirmed 2026-06; corrected from an interim 5×5 render).
Nothing merged to main/staging. Every change below is in git on this branch.

## COLOR FIX (2026-06) — washed/gauzy images resolved
**Root cause:** `images.py` converted every photo with profileless PIL
`im.convert("RGB").convert("CMYK")`. When that CMYK JPEG is rendered (PDF viewer
*and* the fitz rasterization that feeds the web PDF + flipbook), it lost **~44%
saturation** — the "washed/hazy/transparent-overlay" look. Measured on the Splash
Pads page: saturation 0.212 (washed) → **0.364 (fixed), +72%**.

**Fix:** profile-aware **sRGB → Coated FOGRA39** perceptual conversion via PIL
ImageCms (`assets/profiles/CoatedFOGRA39.icc`, vendored in-repo). Vibrant *and*
proper CMYK — also satisfies the brief's FOGRA39L coated requirement. JPEG quality
88→92 (print), flipbook webp →92, web JPEG →86. Cache key `__cmyk`→`__fogra` forces
re-conversion. RGB fallback if the profile is ever absent. Flipbook bumped **v52→v53**.

## Outputs produced
| Deliverable | Path | Notes |
|---|---|---|
| Print master (CMYK, live text) | `print/HUBSS-Catalogue-2026-PRINT.pdf` | 151 MB; not git-committed (needs LFS/external delivery). Live selectable text, embedded Inter, bleed + crop marks. |
| Web PDF (RGB, optimized) | `public/catalogue/HUBSS-Catalogue-2026.pdf` | 16 MB (was 25 MB stale); 7 live hyperlinks (L&L CTA, tel:, mailto:, hubss.com). |
| Flipbook | `public/catalogue/v52/page-001..116.webp` | 1800×1800, trim-cropped; route auto-serves v52 (newest). |
| Alt text | `public/catalogue/v52/alt.json` | Per-page, generated from the rebuilt PDF text layer; wired into `Flipbook.tsx`. |

## Structural
- **Zero live text → full live selectable text** on all 116 pages (was a flattened raster PDF). CMYK vector, embedded fonts, bleed, crop marks via the ReportLab build.
- **Flipbook bumped v50 → v52**, rasterized from the rebuilt PDF so the three outputs are page-for-page synced (116 pp each).
- **Alt text**: generic "page N of 116" → descriptive per-page strings.

## Claims corrections (21 — `apply_claims_fixes.py`; conservative, flagged for Doug where noted)
- **StreetBond** (~p17): dropped "Bonds at the molecular level" (no source); "Will not peel" → "engineered to resist peeling, cracking, and fading"; **removed "BC Ministry of Transportation recognized"** (not on hubss.com — FLAG Doug).
- **TrafficPatterns / TrafficPatternsXD** (p6, p13, p15, p37 Crosswalks, p40 Parking, p50 Ped Safety, New West, Vision Zero, Simcoe): "retroreflective glass beads" → **skid-resistance / anti-skid aggregate (60 BPN, Mohs 8)** — **verified non-reflective** in the TrafficPatterns 125 spec sheet (`/public/docs/`). PreMark + AirMark retroreflectivity KEPT (genuinely beaded) — FLAG Doug to confirm.
- **"500+ municipalities" → "10 provinces"** (p5 stat, p55 spread, p108 cities hero, p113 statement) — 500+ unverifiable; 10 provinces is on hubss.com/about.
- **"Installations across North America" → "across Canada"** (p5/p7).
- **CE credits "AIBC, RAIC, PEO" → generic "Continuing-education content"** (p109) — FLAG Doug to confirm accreditation.
- KEPT (verified correct, contra the PDF-audit's flags): **Pantone on StreetBond** (hubss.com states "Full Pantone custom matching"); **DuraTherm inlaid/flush** (hubss.com matches).

## Image swaps (7 — `apply_image_swaps.py`; scout-verified Canadian; mislabeled originals left on disk, just unreferenced)
| Page | Was | Now |
|---|---|---|
| p43 Community Branding | Terry Fox / NS map (`community-branding-03`) | Coast Salish salmon medallion, Moody Centre Station, Port Moody BC (`community-branding-09`) |
| p35 In-the-Field spread | Terry Fox (dup of p43) | Sherbrooke QC transit-station crosswalk (`crosswalks-19`) |
| p64 BC Children's detail | City of Surrey logo (`decomark-43`) | BCH StreetBond labyrinth (D: studio shot → `blog/.../detail.jpg`) |
| p68 York Region detail | UBC Musqueam (`crosswalks-26`) | Vaughan/Woodbridge TPXD crosswalk (D: → `crosswalks/vaughan-woodbridge-crosswalk.jpg`) |
| p96 White Rock Seaside detail | hero duplicate | distinct wave-mural angle (D: → `.../detail.jpg`) |
| p28 DuraShield hero | US "Ingles" lot (`durashield-04`) | BC residential driveway (`durashield-11`) |
| p83/p84 Kitchener Veterans | same photo twice | p83 full-bleed hero; **p84 = clean text story page (no duplicate)** — see ISSUES (only one 4:3 low-res photo exists; true 2-page bleed impossible without cropping the flag + "Lest We Forget"). |

## Open / flagged (see ISSUES.md)
- **Trim: RESOLVED → 6×6″** (Vernon-confirmed 2026-06). `specs.py` corrected; all 3 outputs regenerated. MediaBox 6.25″, TrimBox 6.0″. Remaining print prep: FOGRA39 output-intent embed (black handling N/A — design uses navy fills, no solid black).
- **Doug claims:** TP/TPXD non-reflective wording, BC MoTI removal, CE-credit accreditation.
- **p68 York image** is 480×640 (web-res) — adequate at detail size, verify at print.
- **p84 Kitchener** whitespace — optional upgrade (navy panel / commissioned 2nd photo).
