# HUBSS Catalogue 2026 — STAGE A REPORT

**Gate before any production work.** Vernon reviews these artifacts before Stage B.

- **Source of record:** `staging` branch → **v50 render (116 pp) / v52.2 source**, last commit 2026-06-01.
- **Workspace:** worktree `C:\Users\cleve\Based_Agency\_wt-catalogue-finishing` on branch `chore/catalogue-finishing-pass` (off `staging`). Production at hubss.com untouched.
- **Deliverables (this folder, `catalogue-finishing/`):**
  - `IMAGE-MANIFEST.csv` — **88 image slots**, 83 distinct files, page-mapped (v50)
  - `CLAIMS-VERIFICATION.csv` — **19 claims**, each with source + status + safe wording
  - `ISSUES.md` — **6 open questions**, 7 issue areas (A–G)
  - `build_manifest.py` — the generator (re-runs against the live content model)

## Top line — what surprised me

1. **The brief is ~20 versions stale.** It targets v31 / Roboto Condensed / a
   fixed defect list. Reality: staging is at v50/v52.2, the type system was
   already migrated to **Inter**, and **most of the §3 image defects were already
   fixed** in the v40s (BC Children's p64, York/UBC p68, White Rock blur p79).
   Recommendation: re-baseline on v50 and fix only what's still broken.

2. **But real defects remain.** Executing the live content model surfaced
   **5 duplicate images still in v50** — including the **p35/p43 pair** the brief
   flagged (now `community-branding-03.jpg`, not Terry Fox) and two **same-photo
   spreads** (Kitchener p83/84, White Rock Seaside Stroll). These are concrete
   Stage B fixes.

3. **The "no live text" premise is partly wrong.** A **ReportLab live-text + CMYK
   print pipeline already exists** (`final_catalog.py` → `HUBSS_Catalogue_2026_v50.pdf`,
   embedded Inter, bleed + page marks). The flattened thing is the flipbook (by
   design) and possibly the served web PDF (couldn't test — `pypdf` not installed).

4. **5 of 19 claims can't be verified from public sources** and need Doug/data
   sheets: StreetBond **"BC MoTI recognized"**, **"500+ municipalities"** (a 60pt
   hero number), MMAX **"3 MPa"**, AirMark **"4×"**, and the **"8× longer than
   paint"** multiplier. DuraTherm's wording (a brief worry) is **already correct**
   and matches hubss.com. StreetBondSR SRI/LEED, MMAX cure/temp, AirMark
   non-runway, 30+/1,000+/20-yr are all **verified**.

5. **Reproducibility blocker:** `assets/booklet/` (the **cover scan** + installer
   photos) is **gitignored** — present on D: but not in git. A clean rebuild needs
   it restored first (exact robocopy command in ISSUES.md §C).

## Two structural decisions gate Stage C (not Stage A)
- **Print master:** Figma-plugin export vs. harden the existing ReportLab build vs. defer. (ISSUES §D)
- **Figma:** no Figma tooling here — Vernon drives the plugin, or I write a componentised rebuild spec. (ISSUES §E)

## What I did NOT do (correctly held for the gate)
No layout changes, no image swaps, no claim edits, no rebuild, nothing pushed to
`main` or `staging`. Stage A is analysis only.
