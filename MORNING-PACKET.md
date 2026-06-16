# HUBSS Catalogue 2026 — Morning Packet

**Status: shipped to staging.** Final finishing pass (overlay legibility + four photo calls) complete, regenerated as **v58 / 140 pp**, merged to `staging` (fast-forward, no conflicts), staging deployment **READY**. Nothing touched main/production.

_Branch `chore/catalogue-final-revision` → `staging` (clean FF); staging **READY**. **Doug reviews the flipbook at staging /catalogue** (v58, 140pp — the rasterized print, already complete; see PARITY-DIFF.md). The **editable Figma plugin** is now at **full 1:1 parity** with it — 116 → **140 frames**, all 11 stale divergences closed, real photos stream. Harness: PARITY OK. PDF/flipbook pipeline never run (already correct); main untouched._

---

## 🔴 VERN'S ONE MANUAL STEP — run the Figma plugin (the real-Figma blank canvas is now FIXED)

Your last run drew nothing because of a bug only **real Figma** reveals — my headless test was blind to it. Found and fixed. The full history: **(1) Dark screen** — 22.7 MB image bank stalled Figma; code.js is now ~112 KB, no embedded images. **(2)** a `ReferenceError` that aborted the build (fixed last round). **(3) — the one that kept giving you a blank canvas:** the plugin tried to load Inter **"SemiBold"**, but Figma's semibold is **"Semi Bold" with a space**, so the font load **rejected and killed the build before the first frame** — and the old error path *closed the plugin instantly, which cancelled its own error message*, so you saw nothing. Now it loads only the weights it actually uses, and **it can no longer fail silently** (see step 3). Full steps in **`catalog-print-build/figma-plugin/RUN-THE-PLUGIN.md`**.

The fixed `code.js` is already on disk at the path your plugin reads, so the cleanest reset:

1. Figma desktop → Plugins → Development → **remove the old "HUBSS Catalogue Builder"** (clears any cached build).
2. **Import from manifest…** → `catalog-print-build/figma-plugin/manifest.json` (on your machine, this repo).
3. Run → panel opens **immediately** → **Build entire book**. You'll first get a **"Build started…" toast**, then **"Loading ~94 photos…"**, then "Building… N frames" ticking to **✓ 140 frames** (the full book). **If it ever fails, a red ✕ now stays in the panel** with the reason — copy that line to me. (If a full pass stalls, the **section buttons** each build a slice onto the same page — all 5 verified green.)
4. Re-running migrates text styles in place (UPSERT — no duplicates). Photos are named `[PHOTO]` placeholders — drop images in.

> The Figma plugin is now a **1:1 editable twin of the v58 book — all 140 pages**: §4 colour spread, §7 process strip, applications as 2-page spreads, the StreetBond logo, and every stale page re-synced (cities, technical, installers, statement, contact, closing). Type styles match the v58 ramp. The headless harness is **font-aware + asserts full parity** (140 + §4 + §7 + 5 sections) — current PARITY OK — but I still can't run a *real* Figma plugin headless, so **your Build is the final confirmation**; if anything's off the panel shows a red ✕. The print PDF + flipbook **v58** (Doug's deliverable) were never touched. `code.js` is gitignored (regenerable + on your machine); `catalogue-layout.json` is committed + hosted.

**Photo review:** the p30/p32/p99 items from your v58 review were page-number/spread offsets, not defects — PreMark (p34) and AirMark (p36) are correct; p99 is the More Awesome Now card with its photo on p98; White Rock Pier is p102/103. No swaps; details + page map in CHANGELOG "Session 6". v58 stands (no v59).

---

## Links & paths

| Artifact | Location |
|---|---|
| **Staging /catalogue** (v58, 140 pp) | https://hubss-website-git-staging-based-agency.vercel.app/catalogue |
| **Branch preview /catalogue** | https://hubss-website-git-chore-catalogue-final-revision-based-agency.vercel.app/catalogue |
| **Web PDF** (RGB, 7 live links, 21.7 MB) | https://hubss-website-git-staging-based-agency.vercel.app/catalogue/HUBSS-Catalogue-2026.pdf |
| **Print master** (CMYK, live text, ~182 MB, gitignored) | `print/HUBSS-Catalogue-2026-PRINT.pdf` (also `catalog-print-build/output/HUBSS_Catalogue_2026_v50.pdf`) |
| **Figma plugin package** (run to build the file) | `catalog-print-build/figma-plugin/` (`manifest.json` + `code.js`) |
| **Figma source file** (superseded v50-era reference) | https://www.figma.com/design/MAm10tWt06oCgw0zLZzWts |
| **Before/after contact sheet — this pass** (overlay + photo swaps) | `catalogue-finishing/type-pass/overlay-contact-sheet.png` |
| Before/after contact sheet — type pass | `catalogue-finishing/type-pass/contact-sheet.png` |

## What this pass changed (full detail in CHANGELOG.md → "Session 5")

- **Overlay legibility:** one book-wide `overlay_scrim` (navy smoothstep → constant floor) on the cover masthead, all 5 section dividers, network divider, all 5 DPS captions, process recto. **48/48 overlay text lines now ≥4.5:1**, measured worst-case-locally under each text block (`catalogue-finishing/overlay_contrast.py`) — nothing left for the eye (p39/p77/p79 resolved in-system).
- **DPS/spread caption** promoted to the 21 display tier (arm's-length reading across a 12″ spread).
- **L&L CTA pill** white-on-orange (2.7:1) → navy-on-orange (6.8:1).
- **Four photo calls:** PreMark hero → 30 KM/H regulatory-legend install (Granville Island); AirMark kept (already non-runway taxiway/apron — rejected the prettier runway shot for the non-runway claim); UBC project hero → Coast Salish salmon detail crop (kills the cover twin, truthful); White Rock confirmed already distinct from the cover.
- **Re-verified:** cross-block overlaps 0 · body type ≥9.6 pt · page parity 140/140/140 · 7 web-PDF links intact (p132 L&L, p133 contact, p140 back) · source image dedup 0/0.

## Remaining (NOT blockers to staging review) → CHANGELOG.md & ISSUES.md

- **Doug bundle:** veto any photo swap on staging; "8× paint" claim, BC MoTI, CE-credit accreditation, 15 application-photo location tags, the 8 missing product logos (all-logos variant mock at `catalogue-finishing/mocks/`), Ennis-Flint attribution.
- **§9 print-prep gate:** confirm with the printer — binding method (140 pp likely perfect-bound, not saddle-stitch), trim 6×6″ + bleed 0.125″, colour profile + output-intent; supplier CMYK formulas for all 51 StreetBond colourants; LEED v4 vs v4.1 credit name; Sage/Driftwood twin hex.
- **Figma parity:** plugin frame geometry vs the ReportLab print build (the ReportLab build is the source of truth and the shipping artifact).
