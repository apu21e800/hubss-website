# HUBSS Catalogue 2026 — Stage A Issues Log

**Scope:** Read-only audit of the current production PDF (`HUBSS-Catalogue-2026.pdf`, 116 pages, 6×6", one flattened image per page, zero live text). Source of record = the production PDF; reference = `catalog_content.py` build map, local data sheets in `/public/docs/`, hubss.com, BC MoTI Recognized Products List, and the image libraries (`D:\STUDIO-01\02-HUBSS`, `public/images`, `_archive/.../assets/booklet`, `C:\...\clients\hubss\assets\photography`).

**Important context:** The build content-map (`catalog_content.py`) is **newer than this PDF** — it already documents fixes for many of the defects below (the "v29/v30 vision-fix" comments). The PDF on staging predates those fixes, so the corrected images/wording exist in the repo but were never re-rendered to this PDF. That is good news for Stage B: most fixes are image swaps the build map already points to.

---

## TOP 5 FOR VERNON (decide before Stage B)

1. **Confirm the 3 known caption↔image mismatches + their image swaps.**
   - **p64 BC Children's Hospital** shows the **City of Surrey logo** crosswalk. Swap to the BCH labyrinth/StreetBond detail.
   - **p68 York Region Pedestrian Safety** shows the **UBC Musqueam salmon** crosswalk. Swap to a York Region TPXD detail.
   - **p43 Community Branding** shows the **Terry Fox Marathon of Hope map** (also a duplicate of p35). Swap to a true neighbourhood-branding image.

2. **Liability/accuracy claims that must change before print (legal exposure):**
   - StreetBond **"Bonds at the molecular level. Will not peel."** → soften (p17).
   - StreetBond **"BC Ministry of Transportation recognized"** → **remove** (StreetBond is NOT on the BC list; DuraTherm IS — move it there) (p17).
   - StreetBond/StreetBondSR **"Pantone matching"** → "custom colour matching" (Pantone belongs to the TrafficPatterns line) (p17, p25).
   - **"500+ municipalities"** → unverifiable; replace with "10 provinces" or drop (p5, p7, p108, p113).
   - **CE credits — AIBC, RAIC, PEO** on the Lunch & Learn page → confirm HUBSS is actually an accredited provider (p109).

3. **The "glass beads / retroreflective" error on TrafficPatterns & TrafficPatternsXD.** The product spec grids (p13, p15) and the Crosswalks application copy (p37) claim glass-bead retroreflectivity. Per the Ennis-Flint data sheets, **TP and TPXD are non-reflective** (anti-skid aggregate, not beads). This recurs in several places and needs a consistent rewrite to "anti-skid through full cross-section; pair with PreMark beaded where retroreflectivity is required."

4. **The brief's spread-duplication list is mostly inaccurate for THIS PDF — but there are different real duplicates.** Of p79/80, p83/84, p85/86, p89/90, **only p83/84 (Kitchener Veterans) is a true same-photo duplication.** The others pair the hero with a distinct (but often generic/weak) close-up. The real duplicates I found are: **p83/84**, **p95/96 (White Rock Seaside Stroll)**, and the cross-section reuses below. Decide whether each project spread needs a genuine second photo.

5. **One confirmed US / non-Canadian proof point.** **p28 DuraShield** is shot in an **"Ingles" supermarket parking lot** (a southeastern-US chain) — replace with a Canadian lot. Also fix **"Installations across North America"** (p5, p7) → "across Canada / coast to coast." A few editorial images have unconfirmed locations (p50, p77, p32) — see below.

---

## 1 — Image defects

### 1a. Duplicate images (same photo on 2+ pages)
| Photo | Pages | Notes |
|---|---|---|
| Little Italy / The Drive (Vancouver) | **p10, p34, p76** | Used as front editorial, products-closer editorial, AND the "More Awesome Now" project detail (3×). |
| Terry Fox Marathon of Hope map (Port Coquitlam) | **p35, p43** (same shot) + **p88** (same installation, different medallion) | p35/p43 identical; p88 is a second angle on the Sechelt detail page. |
| City of Surrey logo crosswalk | **p20, p64** | DecoMark product page + (wrongly) the BC Children's project detail. |
| UBC Musqueam salmon crosswalk | **p1 (cover), p68, p73** | p73 is the correct home; cover is acceptable; **p68 is the misuse.** |
| Kitchener Veterans "Lest We Forget" | **p83, p84** | Identical photo on both facing pages of the spread. |
| White Rock Seaside Stroll wave crosswalk | **p95, p96** | Same/near-identical photo on both facing pages (NEW — not in brief). |
| Vancouver Dunsmuir/Granville green bike lane + SUV | **p78, p106** | Editorial spread reused as the Reference section opener. |

### 1b. Caption ↔ image mismatches (image doesn't depict what the copy describes)
- **p64** — copy: BC Children's Hospital (StreetBond + DecoMark labyrinth, Vancouver); image: City of Surrey logo crosswalk. *(known)*
- **p68** — copy: York Region Pedestrian Safety (TPXD); image: UBC Musqueam salmon crosswalk. *(known)*
- **p43** — copy: Community Branding (neighbourhood identity, First Nations, BIA, Pride); image: Terry Fox map. *(known dup + mismatch)*
- **p76** — copy: More Awesome Now (six Vancouver laneways); image: Little Italy intersection.
- **p82** — copy: Indigenous Recognition (First Nations crosswalks); image: railway "Look Listen Live.ca" crossing sign.
- **p88** — copy: Sechelt Pictograph (shishalh Nation); image: Terry Fox Marathon of Hope map.
- **p92** — copy: Bowen Island forest/village path; image: red industrial-port pier with cranes.
- **p80** — copy: White Rock Pier (coastal BC); image: an autumn eastern/Quebec-looking residential street (weak fit).
- **p90** — copy: Simcoe Rainbow Crosswalk; image: generic cream-paver close-up (no rainbow).
- **p53** — copy references BCH labyrinth + UBC; image is a playground alphabet-wheel (loose fit).

### 1c. Wrong-product / wrong-scale / wrong-tone images
- **p14** TrafficPatterns hero is an Indigenous-art medallion crosswalk that reads as DecoMark, not a standard preformed thermoplastic. (Build map switched to a red-brick TP install, tp-10.)
- **p40** Parking Lots shows a tiny green EV stall — wrong scale for "parking lots." (Build map switched to a Lowe's-scale lot, pl-13.)
- **p48** Commercial Spaces shows a residential EV charging stall — wrong context for "mixed-use / hospitality." (Build map switched to a UBC commercial entrance, cs-05.)
- **p24** StreetBondSR + **p52** LEED & Heat Island both use warm-orange surfaces — the opposite of a "cool / solar-reflective" message. (Build map switched both to cool-toned greys.)

### 1d. Weak / unconfirmed-source images
- **p9** front editorial — plain broom-finished concrete transit plaza; no visible HUB product; source unconfirmed.
- **p116** back cover — dim, low-contrast winter EV-charger street; weak final impression.
- **p77** downtown alley light-art at dusk; location/HUB-attribution unconfirmed.
- **p104, p105, p112** editorial full-bleeds — sources inferred, not confirmed against the libraries.
- **p50** Pedestrian Safety paver close-up and **p32** AirMark airfield — locations not confirmed Canadian.

### 1e. Source-file resolution
Most placed images resolve cleanly to `public/images/...` (products/applications/blog) and a handful to the booklet scans in `_archive/.../assets/booklet/`. The high-res originals live in the photography libraries (`D:\STUDIO-01\02-HUBSS\assets\photos\` and `C:\...\clients\hubss\assets\photography\`, ~3,158 files each, organized by product/application). The IMAGE-MANIFEST `source_path` column gives the best-known build source per page with a confidence rating; "unconfirmed/low" rows are the editorial full-bleeds above.

---

## 2 — Claim flags
Full detail in `CLAIMS-VERIFICATION.csv`. Highest-priority groupings:

**Remove / rewrite (accuracy or liability):**
- StreetBond "molecular level / will not peel" (p17); "BC MoTI recognized" (p17, move to DuraTherm); "Pantone matching" on StreetBond & StreetBondSR (p17, p25).
- TP/TPXD "glass beads / retroreflective / ASTM-rated retroreflectivity" (p13, p15, p37) — they are non-reflective.
- DuraTherm "milled groove" (p27) — it is imprinted into **heated asphalt** with a template (also wrong on the live site).
- AirMark "outlasts paint by four to one / 4×" (p33) — not in the brochure; use "significantly outlasts paint."
- StreetBondSR "SRI ≥ 0.33" (p25) — units error; SRI ≥ 29, Solar Reflectance ≥ 0.33 (keep the two separate).
- DuraShield "Solar Reflectance 0.34" (p29) — TDS says 0.33 (Solar Gray variant only).

**Soften / qualify:**
- "8× life of paint" → "up to 6–8× longer than paint" (p67, and the WHY-HUB block).
- "20-year performance" → "designed for a 20-year service life" (not a warranty) (p5, p7, p113).
- "30+ years" — defensible but soft (HUBSS since 1999); consider "25+ years" (p5).
- StreetPrint "12+ patterns" → "100+ patterns across 15 families" (understated) (p19).
- DuraShield "chemical-resistant" → "excellent chemical resistance"; "anti-slip aggregate" undocumented (p29).
- MMAX "+3°C" → "down to 2°C (35°F)" Extended Season (p23).

**Verify before keeping:**
- "500+ municipalities" (p5, p7, p108, p113) — unverifiable.
- MMAX "bond strength above 3 MPa" (p38, p57) — confirm vs data sheet.
- "Open in 90 minutes" (p57) — confirm; MMAX cure is 30–60 min.
- PreMark "125 mil / 90 mil ViziGrip" thickness (p31) — not in the available data sheets.
- Lunch & Learn "CE credits — AIBC, RAIC, PEO" (p109) — confirm accreditation.

**Verified-OK (keep):** TPXD 150 mil; TP 125 mil; StreetBond 73+ colours; VOC < 50 g/L; DuraTherm snowplow-safe sub-flush, asphalt-only; AirMark non-runway, 5 colours, ISO 9001:2015; StreetBondSR SRI ≥ 29 / LEED v4 Heat Island; PreMark beaded/ViziGrip genuinely retroreflective; "6–8× longer than paint" (thermoplastic line); the p107 reference table.

---

## 3 — Layout issues
- **Text crowding / overflow** where a 2-line headline collides with the body paragraph on several application pages: **p43, p47, p48** (and to a lesser degree the longer 2-line headlines generally). Body text starts immediately beneath the wrapped headline with little/no gap.
- **Spread duplications** (same photo both pages): **p83/84**, **p95/96** (see 1a). **p97/98** (Langley) is borderline — two real angles of the same crosswalk.
- **Generic/weak detail photos** on project spreads where the hero is strong but the second page is a plain paver close-up: **p80, p86, p90** (and arguably p72, p93).
- **Reference-table ordering** (p107) differs from the product-page sequence (minor consistency nit).
- **Whole PDF is 100% flattened images, zero live/selectable text** — must be rebuilt with live text in Stage B/C (accessibility + print spec requirement). Not a "defect" per se but the central Stage C task.

---

## 4 — Voice / copy issues
- **Stat block repeated 3×** (p5, p7, p113) with the same 30+/1,000+/500+/20yr figures — feels padded; consider varying or consolidating.
- **Closing tagline repeated** — "Spec the surface. Watch it work. Walk over it for twenty years." appears on both p113 and p114 back-to-back.
- **"North America"** phrasing (p5, p7) is off-brand for Canadian-only positioning.
- Generally the copy is at the right altitude (marketing, not engineering) — the main voice risk is the over-technical/over-absolute claims listed in §2, not tone.

---

## 5 — Open questions for Vernon (need a decision)
1. **Product count / AirMark:** the build map comment says "AirMark removed per Doug," but AirMark IS in this PDF (p32–33) and the p107 table and brief's canonical 11. Keep AirMark? (Assuming yes.)
2. **DuraTherm "stamped templates" vs "inlaid/flush":** both are technically correct (two steps of one process). Confirm the preferred public wording, and whether to also fix the live hubss.com page (which has the inaccurate "milled groove").
3. **BC MoTI claim:** OK to state "DuraTherm is on the BC MoTI Recognized Products List (Accepted Products — Preformed Thermoplastic)"? (Verified true as of the May 2 2026 list.)
4. **Installer logos:** all four installer cards (p100–103) show **[LOGO] placeholders**. Supply PNGs for squareonepaving, thermo-design, virtueconstruction, ulslandscaping (drop into `assets/installer-logos/`).
5. **"500+ municipalities" and "1,000+ projects":** can these be substantiated, or should they be reworded to "10 provinces served" and a verifiable project count?
6. **CE-credit accreditation (p109):** is HUBSS Lunch & Learn an accredited CE provider for AIBC / RAIC / PEO? If not, reword.
7. **Editorial full-bleeds with unconfirmed sources/locations** (p9, p77, p104, p105, p112, p116, p50, p32): confirm these are Canadian HUB installs, or swap.
8. **Figma source:** the brief's Figma URL (`MAm10tWt06oCgw0zLZzWts/Untitled`) was **not** programmatically readable in this read-only pass (no Figma API access from here). Stage B Figma work will need either the Figma API token or manual access. Flagging now so it's not a surprise.

---

## Method notes & confidence
- **Duplicate detection:** every page is a single independently-rasterized image, so byte-hashing found 0 duplicates (all 116 hashes distinct). I used perceptual hashing (dHash + top-region aHash) to shortlist near-duplicates, then **confirmed every duplicate and mismatch by visually reading all 116 rendered pages.**
- **No files were moved, generated, or deleted.** The only writes are the three deliverables in this folder (plus the downloaded reference PDF). Working renders live in a temp dir, not the repo.
- **Confidence:** Image identification = **high** (visual read of all pages). Source-path resolution = **high for ~80 pages, medium/low for the editorial full-bleeds**. Claim verification = **high** (each rests on a named data sheet, the live BC government PDF, or hubss.com; unverifiable items are marked as such).
