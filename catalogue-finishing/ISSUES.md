# HUBSS Catalogue 2026 — ISSUES (Stage A draft)

Open questions, blockers, and unverifiable claims for **Vernon + Doug** to resolve
before Stage B production. Generated from the **staging** source of record
(v50 render / v52.2 source), worktree `chore/catalogue-finishing-pass`.

> Standing rule honoured: nothing deleted. Where cleanup is implied, exact
> commands are surfaced for Vernon to run, not executed.

---

## A. The brief is written against an older state — most §3 defects are already fixed

The MASTER BUILD PROMPT §2/§3 describes a **v31, 116-page** book with a fixed
defect list. The actual source of record on `staging` is **v50 rendered
(116 pp) / v52.2 in source**, last touched 2026-06-01 — roughly 20 versions and
3 weeks of active "finishing pass" work beyond the brief. Evidence:

- Typography was migrated **Helvetica → Inter** and Inter locked as the print
  typeface (commit `v48-inter`). The brief's guardrail "do not touch the core
  type system (**Roboto Condensed**)" names a font that **is not in the file** —
  the headline family is **Inter** (see `catalog-print-build/assets/fonts/`).
- `catalog_content.py` carries inline fix-comments showing the §3 image defects
  were already found and remediated (BC Children's, York/UBC, White Rock blur,
  and dozens of copy↔image mismatches).

**Confirmed via the v50 folio map (front/mid pages p1–p94 are render-anchored —
`catalog_content.py` itself notes "Vernon flagged p79 as blurry" = White Rock
Pier = computed p79, validating the numbering):**

| Brief §3 defect | v50 page(s) | Status in v50 source |
|---|---|---|
| §3.2 p64 BC Children's copy vs Surrey-logo image | p63 hero / p64 story | **FIXED** — hero now `blog/bc-childrens-hospital-labyrinth/featured.jpg` |
| §3.3 p68 York Region copy vs UBC image | p67 hero / p68 story | **FIXED** — hero now `blog/trafficpatternsxd-urban-design` (Woodbridge/York); UBC isolated to its own project p73/74 |
| §3.4 UBC only on UBC project | p73 / p74 | **FIXED** — UBC Musqueam = `blog/ubc-musqueam-crosswalk/featured.jpg` |
| §3.1 Terry Fox photo dup on p35 & p43 | p35 & p43 | **PARTIAL** — no longer Terry Fox, but p35 and p43 STILL share one file (`community-branding-03.jpg`). See §B. |
| §3.4 spread photo duplication | p83/84, p95/96 | **STILL PRESENT** — see §B. |

➡️ **Decision for Vernon:** confirm the canvas is **staging v50** (assumed) and
that Stage B should *audit fresh / fix only what's still broken*, rather than
re-fix already-fixed §3 items.

---

## B. Duplicate images STILL live in v50 (confirmed by `IMAGE-MANIFEST.csv`)

Resolved by executing the live content model. These are real, current, and
actionable in Stage B:

1. **`community-branding-03.jpg` on BOTH p35 and p43** — "In the Field" DPS-right
   (p35) and the Community Branding application (p43). This is the §3.1 page pair.
   → Replace one (give the DPS a distinct full-bleed; keep the app photo).
2. **`veterans-crosswalk-kitchener/featured.jpeg` on p83 AND p84** — Kitchener
   Veterans Memorial uses the **same photo for hero and detail** (the spread).
   `catalog_content.py` sets `detail` to the same featured.jpeg as `hero`.
   → Supply a second Kitchener photo, or make p84 a true full-bleed of the one shot.
3. **`white-rock-langley-trafficpatterns/featured.jpg` hero+detail identical** —
   White Rock Seaside Stroll (p95/96), same file twice. → Need a 2nd image.
4. **`decomark-43.jpg`** reused as DecoMark product hero (p20) AND BC Children's
   detail (p64). Low severity (different sections) but a careful reader may notice.
5. **`bus-lanes-03.jpg`** reused as the Network section opener (~p95) AND London
   East Link BRT hero (p61). Low severity; consider a distinct opener.

Full table: `IMAGE-MANIFEST.csv` (88 image slots, 83 distinct files).

---

## C. Reproducibility blocker — `assets/booklet/` is gitignored (cover + installers)

6 image slots resolve to **MISSING** in the git checkout because
`catalog-print-build/.gitignore` line 7 excludes `assets/booklet/` (and
`assets/cover/`, `assets/images/`, …). v50 rendered fine because the scans
existed on the build machine, but **a clean rebuild cannot reproduce v50 without
restoring them.** Affected (highest-impact first):

- **Cover** — `assets/booklet/UBC Crosswalk 1.png` (the whole front cover)
- Indigenous Recognition project hero — `native crosswalk 1.png`
- All **4 installer photos** (Square One, Thermo Design, Virtue, ULS)

**Located on D::** `D:\STUDIO-01\02-HUBSS\site\hubss-website-repo\_archive\design-assets\catalog-print-build\assets\booklet\`

➡️ **Action (Vernon to run — not executed per standing rule):** restore the
asset tree into the worktree before any Stage C rebuild:
```powershell
$src = "D:\STUDIO-01\02-HUBSS\site\hubss-website-repo\_archive\design-assets\catalog-print-build\assets"
$dst = "C:\Users\cleve\Based_Agency\_wt-catalogue-finishing\catalog-print-build\assets"
robocopy $src $dst /E /XO
```
(They follow the same `git add -f` pattern already used for `assets/fonts/inter/`.)

---

## D. "Live selectable text" — a live-text pipeline ALREADY exists (brief premise is partly stale)

The brief §8 says the PDF is "100% flattened images — zero live text." Reality:

- `catalog-print-build/src/final_catalog.py` is a **ReportLab** build
  (`OUT = HUBSS_Catalogue_2026_v50.pdf`) that draws **real text layers**
  (`draw_text_block`), uses **CMYK** colours, embeds Inter fonts, and adds
  **bleed + page marks** (`page_marks.py`). It already satisfies much of §8.
- The **flipbook** (`public/catalogue/v50/page-XXX.webp`) is rasterised by design
  (flipbooks are images) — that's expected, not a defect.
- **UNCONFIRMED:** whether the *currently served* web PDF
  (`public/catalogue/HUBSS-Catalogue-2026.pdf`, 25 MB) is the ReportLab live-text
  output or a flattened image export. `pypdf`/`pdffonts` is not installed here, so
  the text layer could not be tested. **1-minute check needed** (`pip install pypdf`
  then `extract_text`, or `pdffonts`).

➡️ **Decision for Vernon (gates Stage C, not Stage A):** which pipeline owns the
print master?
- (a) **Figma** via the existing `figma-plugin` — Figma/InDesign exports the
  CMYK live-text PDF; I deliver a componentised rebuild spec + data.
- (b) **ReportLab** (`final_catalog.py`) — already produces live-text CMYK; harden
  it (FOGRA39, manual K-rich black C40 M25 Y0 K100, hyperlinks) and make it the
  served master.
- (c) **Defer** — keep current web PDF; live-text print PDF is a later phase.

The brief also asks for the print black to be specified manually as
**C40 M25 Y0 K100**; `final_catalog.py` currently uses `HUBSS_NAVY_RICH` —
verify its CMYK build matches that spec before any press export, and **confirm
trim + bleed with the printer** (brief flagged a prior page-coordinate anomaly;
current build is 5"×5" trim, 0.125" bleed inset per `IMAGE_AUDIT.md`).

---

## E. Figma rebuild — cannot be done in this environment

There is **no Figma read/write tooling** in this session. I cannot produce a
"rebuilt Figma file (share link)" per §0/§7. The realistic paths:
- Vernon drives Figma using the existing **`catalog-print-build/figma-plugin`**
  (the `code.print.js` plugin lives on branch `chore/catalogue-v32`; staging has
  only the plugin shell — `manifest.json`/`ui.html`/README). The plugin already
  renders the catalogue into Figma from the content model.
- I produce a **componentised Figma rebuild spec** (named pages, variants for
  product page / project spread / divider / installer card, grid, type ramp) for
  Vernon to execute. Recommended deliverable form for §7.

➡️ **Decision for Vernon:** plugin-driven Figma (preferred) vs. me writing the
manual rebuild spec.

---

## F. Claims that cannot be verified from public sources (detail in `CLAIMS-VERIFICATION.csv`)

| Claim | Where | Recommendation |
|---|---|---|
| StreetBond **"BC Ministry of Transportation recognized"** | ~p17 + cities list | Not on hubss.com. KEEP only if Doug supplies the BC MoTI listing; else use site wording. |
| StreetBond **"Bonds at the molecular level. Will not peel."** | ~p17 | Drop "molecular" (unsourced). Soften "will not peel" → "engineered to resist peeling, cracking, and fading" (website carries the same absolute claim — fix both). |
| **"500+ municipalities"** (60pt hero on Cities page) | ~p5 + ~p104 | Not on hubss.com (site says 1,000+ projects / 10 provinces). Source from CRM or reframe. High visibility. |
| MMAX **"3 MPa"** bond strength | ~p58 + bike-lanes app | No MPa figure on site. Soften unless data sheet confirms. |
| AirMark **"4×"** vs paint | ~p33 | No multiplier on site. Remove figure; keep qualitative claim. |
| **"6–8× / 8× longer than paint"** | ~p6 + York ~p67/68 | Site supports "6–8 YEARS" + "no annual repaint," not the multiplier. Reframe to the years form. |
| York VIVA **"open in 90 minutes"** | ~p57/58 | Project claim — confirm with Doug. |
| White Rock **"40% more foot traffic"** | ~p95/96 | Needs citable source or remove. |
| Toronto **"12 corridors / largest single-contract MMA deployment"** | ~p59/60 | Confirm with Doug. |
| StreetPrint "12+ patterns", DuraShield "SR 0.34" | ~p19 / ~p29 | Low risk; confirm against product pages / data sheets (not yet fetched). |

---

## G. Minor / cosmetic

- `catalog_content.py` line 112 comment says "PRODUCTS (12 — AirMark removed per
  Doug)" but **11 products are listed including AirMark**, and AirMark is in the
  p103 reference table. The comment is stale — AirMark **is** in the catalogue.
  Confirm intent (keep AirMark = current state) and fix the comment.
- Page-number labels in `IMAGE-MANIFEST.csv` for **p95+** (Network/Reference/L&L/
  Contact) are marked `~approx`. Front/mid (p1–p94, incl. all §3 defect pages)
  are render-anchored. A render-confirmed back-matter folio map is a small Stage B
  task (read the v50 webp tail or re-run the build with folio logging).

---

## Open questions (need a Vernon/Doug answer)

1. Confirm canvas = **staging v50** and "audit fresh, fix only what's broken." (§A)
2. Print-master pipeline: **Figma-plugin / ReportLab / defer**? (§D)
3. Figma deliverable: plugin-driven by Vernon, or written rebuild spec by me? (§E)
4. **BC MoTI recognition** — is there a document/listing? (§F)
5. **500+ municipalities** — is there a sourceable count, or reframe? (§F)
6. Doug to confirm the project stats (90 min, 40% foot traffic, 12 Toronto corridors). (§F)
