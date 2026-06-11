# HUBSS Catalogue 2026 — Final Revision Pass · ISSUES & DECISIONS

**Branch:** `chore/catalogue-final-revision` (worktree, off `chore/catalogue-finishing-pass`)
**Date opened:** 2026-06-10
**Scope of this pass (Session 1):** ingest colour manifest, build the two CSV manifests, draft this issues list + changelog skeleton + colour-spread plan. No layout/Figma/PDF/flipbook changes yet.

Legend: 🔴 blocking decision · 🟠 needs Vern/Doug input · 🟡 verify before print · ⚪ informational

---

## ✅ ISSUE #1 — RESOLVED (Session 2): proceeding on the v54 lineage

**Resolution (2026-06-10, Phase-2 relaunch instruction):** Vernon's resume order
("Phase 1 artifacts are committed — treat them as source of truth; execute the
§4 colour spread insertion") on this branch confirms option (a): the **v54/136pp
lineage on `chore/catalogue-final-revision` is canonical**. The §4 spread is now
EXECUTED in the ReportLab pipeline → **140 pp** (see CHANGELOG Session 2; the
mod-4 saddle-stitch padding makes 138 unreachable — the 2 extra pages render as
designed "Notes" spec-note pages, the established intentional-filler archetype).
Original analysis kept below for the record.

**Original (Session 1):**

- The MASTER BUILD PROMPT §2 states the catalogue is **116 pages** and gives a page map (Products 11 · Applications 36 · Projects 56 · Network 99 · Reference 106 · L&L 109 · Contact 110). This matches the **deployed staging flipbook, which is v50 and reports "1 / 116."**
- The branch I am working on (`chore/catalogue-finishing-pass`) has already advanced to **v54 with 136 pages**. Its TOC (page 3) reads **Products 11 · Applications 37 · Projects 75 · Network 118 · Reference 125 · L&L 128 · Contact 129** — materially different pagination and ~20 more pages.
- Several §6 claim fixes are **already applied in v54** (see below), so the prompt's "current state" description is stale relative to the actual latest artifact.

**Consequence:** every page number in the prompt's §3 defect list (p35/p43, p64, p68, p79/80, p83/84, p85/86, p89/90, p107…) refers to the v50/116 layout and does **not** map cleanly onto v54. The manifests in this pass are therefore keyed to **v54** (the real branch state), with the prompt's v50 page numbers cross-noted.

**DECISION NEEDED FROM VERNON:** Which lineage is canonical for the final pass?
- (a) Continue from **v54/136pp** on this branch (recommended — it is the most advanced and already incorporates many fixes), or
- (b) Re-anchor to **v50/116pp** (the deployed staging version the prompt describes), or
- (c) v54 superseded v50 intentionally and staging just hasn't been redeployed — confirm and we proceed on v54.

Until this is confirmed, I have not committed any layout/pagination changes.

---

## ✅ ISSUE #2 — RESOLVED (Session 2): Figma readable via MCP, and it isn't the build source anyway

- **Figma MCP now connected** — the file reads fine (`get_metadata`: one page, 116 frames at 450×450, "p01 — Cover"…). It is the **superseded v50-era source**, not the current book.
- **The real source of record is the ReportLab pipeline**: `catalog-print-build/src/final_catalog.py` (+ `catalog_content.py` content model) generates the live-text CMYK master; `catalogue-finishing/build_flipbook.py` + `build_web_pdf.py` derive the flipbook + web PDF. Phase-4 commit b1109e8 confirms v54's three outputs were regenerated from it at 136pp.
- Consequence: Session 1's `IMAGE-MANIFEST.csv` "FIGMA-ID-NEEDED" rows are resolvable from **`catalog_content.py`** (every hero/detail/image path is right there) — no Figma access needed for the image audit. The Figma file remains relevant only for §9's "rebuilt Figma file" deliverable (decision for Vernon: keep maintaining Figma in parallel, or declare the ReportLab build the single source and use Figma for review exports only — see prior `catalogue-finishing/FIGMA-REBUILD-SPEC.md` + `STAGE-A-REPORT.md` §E which already posed this).

---

## 🟡 Known defects from §3 — status against v54 (need visual confirmation)

The v54 alt-text spine suggests the structure changed substantially from v50. These each need a webp visual check (next session):

1. **Terry Fox / "Marathon of Hope" duplicate (prompt p35 & p43).** In v54, p35 = "IN THE FIELD" overlay and p43 = "BUS LANES" — **no Terry Fox page appears in the v54 spine.** Likely a v50-only defect. Also note: the prompt says "Nova Scotia," but `PROJECT-IMAGE-AUDIT.md` lists **Terry Fox Plaza, Coquitlam BC** — confirm the actual location before any caption work. → verify in whichever version is canonical.
2. **p64 copy↔image (BC Children's vs City of Surrey).** In v54, BC Children's lives at **p83** (StreetBond + DecoMark, Vancouver) with the correct blog image mapped. v54 p64 is a full-bleed. → confirm no Surrey-logo image is mis-placed in v54.
3. **p68 copy↔image (York Region vs UBC).** In v54, York Region appears at p77 & p87 and UBC Musqueam at p93. UBC Coast Salish photography is reserved for p93 in the manifest. → confirm no UBC image bleeds into a York page in v54.
4. **Spread photo duplication (p79/80, p83/84, p85/86, p89/90…).** v54 uses an alternating **text-page + full-bleed** pattern; the facing full-bleed may still repeat the text page's hero. Flagged per-pair in `IMAGE-MANIFEST.csv` (dedup_notes). → requires visual diff of each webp pair.
5. **Full-book duplicate / mismatch / overflow / contrast sweep.** Deferred to the visual pass; cover hero (p1) is reused at White Rock project p99 — confirm intentional.

---

## ⚪ §6 claim fixes ALREADY APPLIED in v54 (do not re-do, do not regress)

Confirmed from v54 page alt-text; cross-referenced in `CLAIMS-VERIFICATION.csv`:
- StreetBond p17: "**engineered to resist peeling, cracking, and fading**" — the absolute "will not peel" is already gone. ✅
- DuraTherm p27: "**Inlaid… embedded into a milled groove. Zero profile above grade**" — §6 reconciliation done; distinct from StreetPrint. ✅
- StreetBondSR p25: "**Initial SRI ≥ 0.33. LEED v4 SS Credit: Heat Island Reduction**" — already specific (still verify v4 vs v4.1, below). ✅
- MMAX p23: "**+3°C and rising**" — the dangerous "-10°C" is already corrected. ✅
- These mirror the prior `PRODUCT-CLAIMS-AUDIT.md` (website, 2026-05-10).

---

## 🟠 Decisions for Vernon / Doug

1. **Ennis-Flint / TrafficScapes co-branding (§7).** New book intentionally drops it. Flagging once as a Doug decision: manufacturer attribution can matter for spec credibility on bid documents. Re-add? Default = leave out.
2. **All-product-logos variant (§5).** Default scope = StreetBond rainbow logo only (p17). Prepare the optional "every product page carries its official logo" variant for Doug's review? All-or-nothing.
3. **"Outlasts paint by eight times" (8×, p87).** PPG marketing implies 6–8×; the specific 8× is not independently sourced. Keep the number, or switch to magnitude language? (Vernon's call — restore-able with an installation report.)
4. **"1,000+ projects" / "10 provinces" stats (p5/p7).** Company figures, not independently sourced. Confirm both are current and defensible.
5. **StreetBond "BC MoT recognized."** Softened to generic on the website. Confirm it is NOT printed in the catalogue, or supply written BC MoTI confirmation to restore.
6. **Simcoe vs Collingwood (p109).** Alt text says "Simcoe, ON"; `PROJECT-IMAGE-AUDIT.md` lists "Collingwood Rainbow Crosswalk." Confirm the correct municipality.
7. **"Open in 90 minutes" vs prompt's "open in 90 days" (p77).** Catalogue prints **90 minutes** (consistent with MMAX 45–60 min cure). Prompt §6 lists "open in 90 days." Confirm 90 minutes is intended.

---

## 🟡 Colour-spread specifics to verify before print (see COLOUR-SPREAD-PLAN.md)

- **LEED credit name/version.** Confirm LEED **v4 vs v4.1** "Heat Island Reduction" is the current credit before printing any number. Do not use the old "LEED 7.1 non-roof."
- **Sage vs Driftwood twin.** Both sampled identically (`#c2b7a5`) from the chart scan. Confirm against physical samples / supplier values and correct if they differ.
- **SR White near-white (`#f9f6ec`).** Print with a hairline keyline so the chip doesn't vanish.
- **Print CMYK.** Manifest hexes are screen/flipbook reference only — source supplier CMYK formulas per colourant; never auto-convert the hexes.
- **Reference table (v54 p126) + StreetBond/StreetBondSR product pages** must be updated so colour counts/family names agree (37 standard = 17 Traditional + 20 Signature; 11 SR; 3 CL).

---

## 🟡 Asset / path discrepancies found

1. **StreetBond logo filename.** Prompt references `streetbond-Full_Color-wh.png` (underscores). Actual file is `streetbond-Full Color-wh.png` (spaces) in `…\Product logos final\StreetBond\`. Same asset — note the real name when placing. Reversed variants present: `StreetBondSR_white.png`, `StreetBondSR_black.png`, `streetbond-Full Color-white lettering.png` (candidate for the dark band).
2. **ReportLab `catalog.yaml` lists 12 products incl. Fast Patch**, and TP at **90mil**. The v54 flipbook product section has the canonical **11** (no Fast Patch) and TP context implies **125mil**. The two build artifacts disagree — reconcile spec numbers to the data sheet + p126 table.
3. **D:\STUDIO-01\02-HUBSS\catalogue\source and \exports are empty.** The catalogue build artifacts are in the repo (`catalog-print-build/` + `public/catalogue/v54/`), not on D:. 26,701 images exist under `02-HUBSS` for photo sourcing.
4. **AirMark hero (p32) is a sports court; PreMark hero (p30) is a bike-lane shot.** Confirm these heroes read as the right product or swap for on-product photography.

---

## ⚪ §7 gap-check (old book → new book) — items to sweep next session

Not yet completed (needs the 72 old-catalogue screenshots; ask Vern for the local "old cat" folder path — not provided this session). Candidate carry-forwards already in scope: colour spread (§4), streetbond® logo (§5), StreetPrint process strip (§7.3), city/province location tags (§7.4). Watch specifically for **wayfinding/signage as an application** present in the old book.

---

## Sources I could and could not reach (Session 1)

| Source | Status |
|---|---|
| D:\STUDIO-01\02-HUBSS image library (26,701 imgs) | ✅ reachable |
| C:\Users\cleve\Based_Agency (secondary) | ✅ reachable |
| OneDrive Product logos (StreetBond logo found) | ✅ reachable |
| hubss.com/products | ✅ reachable |
| Live flipbook /catalogue (v50/116 on staging) | ✅ reachable |
| catalog-print-build/ + IMAGE_AUDIT.md (branch) | ✅ reachable |
| Production PDF | ⚠️ exists but >10 MB — not introspectable via WebFetch; can download + read with pdf tooling if needed |
| **Figma design file** | ❌ not machine-readable (auth/JS) — see ISSUE #2 |
| Old-catalogue 72 screenshots | ❌ local path not provided — see §7 gap-check |
