# HUBSS Catalogue 2026 — Final Revision Pass · CHANGELOG

Every change logged by page number: **before → after**, with the **source** for each verified claim and each swapped image. Page numbers are **v54 (136 pp)** basis unless noted; see `ISSUES.md` #1 for the v50/v54 version decision that gates everything below.

Status key: ☐ planned · ◐ in progress · ☑ done · ⏸ blocked (needs decision)

---

## Session 1 (2026-06-10) — manifests & planning (no layout changes)

| Item | Before | After | Source |
|---|---|---|---|
| ☑ COLOUR-MANIFEST.csv | (not in repo) | written verbatim, 51 colours | supplied manifest |
| ☑ IMAGE-MANIFEST.csv | (none) | 136 v54 pages mapped; FIGMA-ID-NEEDED flagged | catalog.yaml, PROJECT-IMAGE-AUDIT.md, IMAGE_AUDIT.md, v54 manifest.json alt |
| ☑ CLAIMS-VERIFICATION.csv | (none) | per-claim verification table | PRODUCT-CLAIMS-AUDIT.md, hubss.com, v54 spec lines |
| ☑ ISSUES.md | (none) | version mismatch + Figma + decisions | this pass |
| ☑ COLOUR-SPREAD-PLAN.md | (none) | §4 build plan, pp26–27 insertion | COLOUR-MANIFEST.csv |
| ☑ CHANGELOG.md | (none) | this skeleton | — |

---

## §4 — Colour system spread  ⏸ (pending ISSUE #1 version decision)

| Page | Before | After | Source |
|---|---|---|---|
| new p26 | — | Page A: "The colour system" — 37 standard chips (17 Traditional + 20 Signature) + sample-request footer | COLOUR-MANIFEST.csv |
| new p27 | — | Page B: 11 SR (SRI/reflectance/emittance) + 3 CL greens + standards line + soft LEED | COLOUR-MANIFEST.csv |
| TOC p3 | Apps 37/Proj 75/Net 118/Ref 125/L&L 128/Contact 129 | +2 each ≥ p26 | repagination |
| ref table (p126→128) | — | colour counts/family names aligned | COLOUR-MANIFEST.csv |

## §5 — Logos  ☐

| Page | Before | After | Source |
|---|---|---|---|
| p17 StreetBond | no logo | place `streetbond-Full Color-wh.png` on white body (light-bg) | OneDrive Product logos final/StreetBond |
| all product pages | (StreetBond only) | OPTIONAL all-logos variant for Doug | ISSUES.md decision #2 |

## §6 — Claims & copy  ◐ (many already fixed in v54 — see CLAIMS-VERIFICATION.csv)

| Page | Before | After | Source |
|---|---|---|---|
| p17 StreetBond | (v54 already "resist peeling…") | confirm no regression | PRODUCT-CLAIMS-AUDIT.md |
| p87 TPXD | "outlasts paint by eight times" | keep / soften — DECISION | ISSUES.md #3 |
| p31 PreMark | verify thickness | 125mil standard / 90mil ViziGrip | PPG TDS |
| p126 ref table | — | match spec grids + claims CSV | data sheets |

## §7 — Old-catalogue reconciliation  ☐

| Item | Action | Source |
|---|---|---|
| StreetPrint process strip | rebuild Reheat→Stamp→Coat on/facing p18 | old p17 + D: install photos |
| Location tags | audit every photo carries CITY, PROV | IMAGE-MANIFEST.csv |
| Ennis-Flint co-branding | leave out (flagged) | ISSUES.md #1 (decisions) |

## §3 — Defects / dedup / mismatches  ☐ (need visual pass; see IMAGE-MANIFEST dedup_notes)

| Page (v54) | Before | After | Source |
|---|---|---|---|
| p83 | (verify) | BC Children's copy + bc-childrens-hospital-labyrinth image | blog featured |
| p93 | (verify) | UBC Musqueam copy + ubc image (UBC reserved here only) | blog featured |
| p117 | _placeholder.svg | real Langley/Linwood Park photo | NEEDS PHOTO |
| p78/80/84/86… | (verify) | de-dup facing full-bleeds | visual diff |

## §8/§9 — Quality, nav, build  ☐

| Item | Action |
|---|---|
| Section colour-nav | one accent per section: divider + TOC row + page-edge tab |
| Typography | enforce min sizes (body ≥9pt, caption ≥7.5pt), no overflow, scrim ≥4.5:1 |
| Figma | live text, components, named layers |
| Print PDF | CMYK FOGRA39, bleed confirmed w/ printer, K-rich black C40M25Y0K100, embedded fonts |
| Flipbook | export `/catalogue/v{NN+1}/page-{XXX}.webp`, real alt text, version bump, page parity |
