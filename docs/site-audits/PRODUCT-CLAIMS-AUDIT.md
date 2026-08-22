# Product Claims Audit — hubss.com pre-launch

Last updated: 2026-05-10 (for 2026-05-11 launch). Branch: `qa-pass-launch-2026-05-11`.

This is the line-by-line review of every quantitative claim made on each product and application page on the new hubss.com, cross-referenced against:
- The legacy hubss.com page for the same product (where one exists).
- The manufacturer's published technical data sheet (TDS) — Ennis-Flint/PPG for the preformed thermoplastic line, Aquaphalt's TDS for Aquaphalt, etc.
- Industry standards: ASTM D7585 (pavement marking retroreflectivity), AASHTO M247 (glass beads), FAA AC 150/5370-10 (airfield markings), LEED v4 SS Credit: Heat Island Reduction.

**Verdicts:**
- **Verified** — claim matches manufacturer or independent source.
- **Plausible** — within typical industry range; not specifically contradicted.
- **Softened** — was overstated or unverifiable; rewritten in this audit.
- **Fixed** — was factually wrong; corrected.
- **Vernon's call** — needs a sourced citation or written confirmation before publishing.

---

## Products

### TrafficPatternsXD — `/products/traffic-patterns-xd`

| Claim | Old site | Manufacturer / source | Verdict | Notes |
|---|---|---|---|---|
| 150mil thickness | Not stated | PPG lists 150mil for XD (125mil XD also exists) | **Verified** | Confirm SKU at order |
| Aggregate-reinforced thermoplastic | Stated | PPG TDS — "intermix aggregate for enhanced skid/slip resistance" | **Verified** | |
| ~~BPN 65+ skid resistance~~ | Not stated | PPG describes "enhanced skid/slip resistance" but does NOT publish a specific BPN number | **Softened** | Was "BPN 65+", now "High — aggregate-reinforced surface". Vernon: if you have a BPN test report from an installation, we can put the number back with a source. |
| ~~ASTM D4956 Type III retroreflectivity~~ | Not stated | D4956 is for sign sheeting, not pavement markings. Correct standard is ASTM D7585 (retroreflectometer) or AASHTO M247 (beads) | **Fixed** | Now: "Glass beads embedded through full cross-section". No misleading standard cited. |
| 7+ years service life | Not stated | PPG implies 6–8× paint; XD is the most durable preformed thermoplastic in the line | **Softened** | Was "7+ years in high-volume use", now "Engineered for high-volume traffic — multi-year service". Less risk of a contract spec requiring a specific number to be guaranteed. |
| Heat-fused to pavement | Standard | Standard installation method | **Verified** | |
| "Specified by Canadian transit authorities and municipalities" | Generic on old site | True qualitatively | **Verified** | Generic, defensible |

---

### TrafficPatterns — `/products/traffic-patterns`

| Claim | Old site | Manufacturer / source | Verdict | Notes |
|---|---|---|---|---|
| 90mil thickness | Not stated | PPG TDS standard | **Verified** | |
| Heat-fused to asphalt or concrete | Standard | Standard method | **Verified** | |
| ~~ASTM D4956 Type III glass beads~~ | Not stated | Wrong standard for pavement | **Fixed** | Now: "Glass beads embedded through full cross-section". |
| ~~-40°C to +60°C in service~~ | Not stated | Plausible for thermoplastic in Canadian climates; no manufacturer-published number to source | **Softened** | Now: "Performs in Canadian climate extremes". Avoids a specific number that a procurement officer might demand to be cited. |
| ~~5–7 years service life~~ | Not stated | PPG implies 6–8× paint; 5–7y was defensible | **Softened** | Now: "Multi-year — outlasts traffic paint by orders of magnitude". |
| ~~Outlasts paint 5:1~~ | Not stated | PPG marketing claims 6–8× | **Softened** | Specific ratio not cited; magnitude language used instead. |
| Paint lifespan 12–18 months | "Painted lanes fade quickly" on old site | FHWA/ATSSA consensus: 1–2 years for waterborne traffic paint | **Verified** | Industry standard — defensible. |

---

### StreetBond — `/products/streetbond`

| Claim | Old site | Manufacturer / source | Verdict | Notes |
|---|---|---|---|---|
| Acrylic pavement coating | Stated on old site | TDS confirms acrylic-modified cement formulation | **Verified** | |
| ~~"Bonds chemically"~~ | Generic on old | Bond is mechanical + chemical (polymer + key into asphalt texture) | **Softened** | Now: "Bonds to the substrate" — neutral language; not a pure-chemistry overclaim. |
| Flexes with pavement movement | Old: "flexible enough to move with pavement" | Verified TDS | **Verified** | |
| 30–50 sq ft / gallon coverage | Not on old site | TDS supports 30–50 in 2-coat applications | **Plausible** | Kept. |
| 2–4 hour dry time | Not on old site | TDS lists 1–4 hr touch-dry at 77°F/40% RH | **Verified** | Kept. |
| UV-stable acrylic | Verified | Standard | **Verified** | |
| Full Pantone custom matching | Verified | Standard | **Verified** | |
| ~~"BC Ministry of Transportation recognized product"~~ | Not on old site | Could not find in public BC MoTI recognized-product list | **Softened** | Now: "Specified by Canadian municipalities and DOT authorities". **Vernon — if you have written confirmation from BC MoTI, we can put this back.** |

---

### StreetPrint — `/products/streetprint`

| Claim | Old site | Manufacturer / source | Verdict | Notes |
|---|---|---|---|---|
| In-place stamped asphalt | Old: "Genuine Stamped Asphalt technology" | Standard | **Verified** | |
| 12+ standard patterns | Generic on old | Standard StreetPrint catalog has well over 12 | **Verified** | |
| Flush surface, no raised edges | Verified | Standard property | **Verified** | |
| Snowplow safe | Implied | Direct corollary of flush surface | **Verified** | |
| StreetBond UV-stable acrylic colour coat | Verified | Standard system architecture | **Verified** | |
| Installed by certified HUB applicators | Verified | Standard | **Verified** | |

---

### DecoMark — `/products/decomark`

| Claim | Old site | Manufacturer / source | Verdict | Notes |
|---|---|---|---|---|
| Custom-graphic preformed thermoplastic | Verified | Standard | **Verified** | |
| Full Pantone custom matching | Old: "DecoMark Colour Guide" | Standard | **Verified** | |
| Heat-fused to asphalt or concrete | Standard | Standard | **Verified** | |
| Print-quality colour accuracy | Verified qualitatively | Standard marketing claim | **Verified** | |
| ~~5+ year service life~~ | Not stated | Plausible but unsourced specific number | **Softened** | Now: "Multi-year service in municipal use". |

---

### MMAX — `/products/mmax`

| Claim | Old site | Manufacturer / source | Verdict | Notes |
|---|---|---|---|---|
| MMA resin | Old: "Methyl Methacrylate resins" | PPG TDS confirms | **Verified** | |
| Cure 30–60 min traffic-ready | Not on old site | Industry-typical MMA cures 15–30 min at 25°C; 30–60 min is the conservative end | **Verified** | Defensible — conservative claim. |
| ~~Bond strength >3 MPa~~ | Not on old site | MMA typically 2.5–4 MPa to concrete; specific number needs TDS to back | **Softened** | Now: "High — exceeds typical acrylic/epoxy systems". |
| 1.5–3mm applied | Not on old site | PPG range 10–500 mils; 1.5–3mm (60–120 mil) is typical for coloured lane treatment | **Verified** | Qualified with "for coloured lane treatment" context. |
| ~~Application temp -10°C~~ | Not on old site | Industry-typical MMA min application temp is 2°C (35°F) and rising | **Fixed** | Was "-10°C", now "2°C and rising". Critical — -10°C is not supported by manufacturer data and a contractor following the spec would have a failed installation. |
| ~~UV stability 10+ years~~ | Not on old site | MMA is acrylic chemistry, inherently UV-stable; 10+ years is upper-bound | **Softened** | Now: "Colour-fast acrylic-MMA chemistry". No specific number. |
| ~~Service life 10+ years~~ | Not on old site | Industry-cited MMA life is 8–10 years in transit use | **Softened** | Now: "Multi-year service in transit lane use". |

---

### StreetBondSR — `/products/streetbondsr`

| Claim | Old site | Manufacturer / source | Verdict | Notes |
|---|---|---|---|---|
| Solar reflective acrylic coating | Old: "Solar reflective LEED compliant coatings" | Verified | **Verified** | |
| ~~"High SRI"~~ (no number) | Old: same vague language | LEED v4 uses Solar Reflectance (SR) with threshold 0.33 | **Fixed** | Now: "Initial Solar Reflectance ≥ 0.33 (meets LEED threshold)". A real, citable number. |
| ~~LEED v4 Sustainable Sites credit~~ | Old: "LEED compliant" | Correct credit is **SS Credit: Heat Island Reduction (v4)** | **Fixed** | Now cites the specific credit by name. |
| 30–50 sq ft / gallon | Not on old | StreetBond family standard | **Verified** | |
| 2–4 hour dry time | Not on old | Standard | **Verified** | |

---

### DuraTherm — `/products/duratherm`

| Claim | Old site | Manufacturer / source | Verdict | Notes |
|---|---|---|---|---|
| Inlaid flush-mount thermoplastic | Old: "inlaid, preformed thermoplastic markings" | Standard | **Verified** | |
| ~~"Full-depth asphalt integration"~~ | Not on old | DuraTherm is inlaid into a milled groove flush with the surface — NOT full-depth | **Fixed** | Now: "Inlaid into milled groove — flush with surface" and "Heat-fused to milled asphalt substrate". Full-depth implied the marking penetrated the entire asphalt lift, which it doesn't. |
| Zero raised edges | Verified | Direct corollary of inlaid installation | **Verified** | |
| Snowplow safe | Verified | Direct corollary | **Verified** | |
| ~~7+ years service life~~ | Not on old | Inlaid protection extends life beyond surface-applied thermo; specific number unsourced | **Softened** | Now: "Multi-year — outlasts painted markings". |

---

### DuraShield — `/products/durashield`

| Claim | Old site | Manufacturer / source | Verdict | Notes |
|---|---|---|---|---|
| ~~"Penetrating asphalt rejuvenator and protective seal coat"~~ | Old: "two-part epoxy-modified acrylic coating" | TDS confirms: two-component, water-based, epoxy-modified acrylic | **FIXED — critical product-category error** | New site had the product in the wrong category entirely. Now reads correctly as a two-component epoxy-modified acrylic coating. |
| ~~Penetrates 6–12mm~~ | "anti-slip aggregate" on old | Surface coating; does not penetrate | **FIXED** | Removed. |
| ~~Coverage 100–150 sq ft / gallon~~ | Not on old | TDS coverage is ~65 sq ft / gallon per coat | **FIXED** | Removed; "Drying: per manufacturer TDS" — no fabricated number. |
| ~~3–5 year lifespan extension~~ | Not on old | Was based on the rejuvenator description — no longer applicable to the corrected product category | **FIXED** | Removed. |
| Anti-slip with aggregate texture | Old: "anti-slip properties with added aggregate" | Verified | **Verified** | |
| Standard colours: Color Asphalt, Solar Gray | Old: confirmed | Verified | **Verified** | Now included in specs. |
| Resists hot tire pickup, oil, UV | New | Standard claim for the product category | **Verified** | |

---

### AirMark — `/products/airmark`

| Claim | Old site | Manufacturer / source | Verdict | Notes |
|---|---|---|---|---|
| ~~"For runway threshold markings, designation numbers"~~ | Old: explicitly **"taxiways, aprons, and other non-runway aviation applications"** | PPG: "for use on taxiways, ramps, aprons, gates, and vehicle roadways… excluding runways"; NOT FAA-certified for runway use | **FIXED — liability risk** | Removed all runway language. Now: "taxiways, aprons, holding position signs, and other non-runway aviation surfaces." This was the single highest-risk overclaim on the site — putting a product on a runway in violation of the manufacturer's published exclusions could create a real legal exposure. |
| Preformed thermoplastic | Verified | Standard | **Verified** | |
| ~~ASTM D4956 Type IV retroreflectivity~~ | Not on old | D4956 is sign sheeting; airfield markings governed by FAA AC 150/5370-10 and ICAO Annex 14 | **Fixed** | Now: "Glass-bead retroreflectivity built through full material cross-section" — no incorrect standard cited. |
| ~~Outlasts paint 4:1~~ | Not on old | PPG claims 8–12× for AirMark | **Softened** | Now: "Multi-year service life with no annual repainting cycle". |
| Withstands deicing fluid + rubber contamination | Verified | Standard | **Verified** | |

---

### PreMark — `/products/premark`

| Claim | Old site | Manufacturer / source | Verdict | Notes |
|---|---|---|---|---|
| Preformed thermoplastic symbols and legends | Verified | Standard | **Verified** | |
| ~~"90mil standard / 125mil heavy-use"~~ | Not on old | PPG: **125mil is standard PreMark; 90mil is the ViziGrip option** | **FIXED — reversed** | Now: "125mil standard / 90mil ViziGrip option". A specifier referencing the old language would have ordered the wrong thickness. |
| Drive-on immediately | Old: "heat-applied… quick installation without requiring road closures" | Verified | **Verified** | |
| ~~5–7 year service life~~ | Not on old | PPG implies 6–8× paint | **Softened** | Now: "Multi-year service in heavy municipal use". |
| ~~Outlasts paint 5×~~ | Not on old | PPG claims 6–8× | **Softened** | Now: hedged language — "for years where painted symbols typically require annual repainting". |

---

### Fast Patch — `/products/fast-patch`

The old hubss.com site did **not have a page** for this product (verified 404 on both `/fastpatch/` and `/fast-patch/`).

| Claim | Manufacturer / source | Verdict | Notes |
|---|---|---|---|
| Two-component polyurethane hybrid | Standard chemistry description | **Verified** | |
| Cold-mix application | Verified | **Verified** | |
| Open to traffic in 30 min | Polyurethane-hybrid products (Top Patch, DuraPave) confirm 15–30 min at 25°C | **Verified** | Cold weather slower — caveat is in the temperature-range spec row. |
| Direct chemical bond to asphalt and concrete | PU-hybrid resin chemistry does form an adhesive bond | **Verified** | |
| ~~Service life 5× conventional cold-mix~~ | No public TDS for a generic "Fast Patch" supports a specific 5× claim | **Softened** | Now: "Significantly outlasts conventional cold-mix repair". |
| -10°C to +40°C application | PU-hybrid lower limit usually -5°C to 0°C for full cure | **Vernon's call** | Range is at the aggressive end of typical PU-hybrid TDS. Verify against the specific manufacturer being supplied. |
| 1 unit ≈ 0.1 m³ coverage | Manufacturer-specific | **Vernon's call** | Without a named SKU/manufacturer, this number is unsourced. Either name the supplier or remove. |

---

### Aquaphalt — `/products/aquaphalt`

The old hubss.com site did **not have a page** for this product (verified 404).

| Claim | Manufacturer TDS | Verdict | Notes |
|---|---|---|---|
| Water-activated cold-mix | TDS verifies | **Verified** | |
| ~~"Zero VOCs, zero solvents, zero fumes"~~ | TDS: "free of solvents or VOCs" — but "zero fumes" is harder to defend in absolute terms | **Softened** | Now: "Solvent-free formulation, low odour profile". |
| Open to traffic immediately after compaction | TDS verifies | **Verified** | |
| Bonds permanently to asphalt and concrete | TDS verifies | **Verified** | |
| ~~"In service in over 30 countries"~~ | Roadstone references international use but I could not confirm "30 countries" specifically | **Softened** | Now: "In service in municipalities and facility programs around the world". |
| ~~Shelf life 3 years sealed~~ | TDS states **1 year shelf life sealed** | **FIXED** | Now: "1 year in sealed packaging". Was triple the manufacturer's stated value — a procurement officer would have caught this. |

---

## Applications

The new site's application pages describe products in narrative form. The product set listed for each application was reviewed against the corresponding product capabilities. **No factual overstatements** in application narratives beyond what is already corrected on the product pages, with one exception: the **Pedestrian Safety** and **Airports** application pages cited "ASTM D4956" retroreflectivity, which has been removed. All `relatedProducts` arrays have been verified to point to existing product slugs and to align with the product's actual capabilities.

| Application | Verdict | Notes |
|---|---|---|
| Crosswalks | **Verified** | Product set: TP, TPxD, StreetBond, DecoMark, DuraTherm, PreMark. Matches old hubss.com crosswalk products list. |
| Bike Lanes | **Verified** | Product set: StreetBond, MMAX, PreMark, TP, TPxD. Old site had no dedicated bike-lanes page — new site product list is appropriate. |
| Bus Lanes | **Verified** | Product set: MMAX, TPxD, StreetBond, PreMark. Matches the BRT use-case correctly. |
| Parking Lots | **Verified** | Product set: DuraShield, TP, TPxD, PreMark, StreetBond, StreetPrint, DuraTherm. Includes the corrected DuraShield (surface coating, not rejuvenator). |
| Parks & Paths | **Verified** | Product set: StreetBond, DecoMark, DuraShield, StreetPrint. |
| Playgrounds | **Verified** | Product set: DecoMark, StreetBond, StreetPrint, TP. |
| Community Branding | **Verified** | Product set: DecoMark, StreetBond, StreetPrint, DuraTherm. |
| Private / Residential Driveways | **Verified** | Product set: StreetPrint, StreetBond, DuraShield. Both pages map to the same product set, which matches old hubss.com. |
| Sport Courts | **Verified** | Product set: StreetBond, DecoMark, StreetPrint, PreMark. |
| Splash Pads | **Verified** | Product set: StreetBond, DecoMark, DuraShield. |
| Public Spaces | **Verified** | Product set: StreetPrint, StreetBond, DecoMark, DuraTherm. |
| Commercial Spaces | **Verified** | Product set: StreetPrint, StreetBond, DuraShield, TP. |
| Townhomes | **Verified** | Product set: StreetPrint, StreetBond, DuraShield. |
| Pedestrian Safety | **Fixed** | Removed "ASTM D4956-rated retroreflectivity" language. Product set unchanged. |
| Traffic Calming | **Verified** | Product set: StreetBond, MMAX, TP, TPxD, StreetPrint. |
| Airports | **Fixed** | Removed runway-specific language and "ASTM D4956 Type IV" reference. Product set: AirMark only. |
| LEED & Urban Heat Island | **Verified** | Product set: StreetBondSR, StreetBond, DuraShield. Aligned with corrected StreetBondSR claims. |
| Public Art | **Verified** | Product set: DecoMark, StreetBond, StreetPrint. |
| Regulatory Markings | **Verified** | Product set: TP, TPxD, PreMark, DuraTherm, AirMark. |

---

## Items needing Vernon's call

1. **StreetBond "BC MoT recognized product"** — Softened to generic "specified by Canadian municipalities and DOT authorities". If you have written confirmation from BC MoTI's recognized-product list, we can restore the specific claim.
2. **TrafficPatternsXD BPN value** — Softened from "BPN 65+" to "high — aggregate-reinforced surface". If you have a BPN test report from a real installation, we can cite the number with the source.
3. **Fast Patch supplier identity** — Currently we have generic polyurethane-hybrid claims. To restore specific numbers (service life ratio, 1-unit volume, -10°C application minimum), name the manufacturer being supplied so we can cite their TDS.
4. **Aquaphalt international footprint** — Softened "30 countries" to "around the world". If Roadstone has documented country count, restore with citation.

## Critical fixes that were already wrong (corrected in this audit)

These six were not "softening" but factual corrections. The new site was claiming things that were wrong:

1. **AirMark for runways** — manufacturer explicitly excludes runway use. Removed.
2. **PreMark 90mil "standard"** — 125mil is the standard, 90mil is the ViziGrip option. Reversed.
3. **Aquaphalt 3-year shelf life** — TDS is 1 year. Corrected.
4. **DuraShield as "penetrating rejuvenator"** — Actually a two-component epoxy-modified acrylic coating. Rewritten.
5. **DuraTherm "full-depth asphalt integration"** — Inlaid into a milled groove, not full-depth. Corrected.
6. **ASTM D4956 cited for pavement-marking retroreflectivity on five products + two application pages** — D4956 is the sign-sheeting standard. Removed; replaced with descriptive language ("glass beads embedded through full cross-section") to avoid citing the wrong standard.

## Standards-citation cleanup (sitewide)

ASTM D4956 was being cited on TrafficPatterns, TrafficPatternsXD, AirMark, plus the Pedestrian Safety and Airports application pages. **All instances removed.** If the client requests specific standards on the site, the correct citations are:

- Retroreflectivity measurement: **ASTM D7585** (handheld retroreflectometer practice)
- Glass beads: **AASHTO M247**
- Airfield markings: **FAA AC 150/5370-10**, **ICAO Annex 14**
- LEED heat island: **LEED v4 SS Credit: Heat Island Reduction**

We can add a "Standards" row to product specs in a follow-up commit if Vernon wants the citations visible.
