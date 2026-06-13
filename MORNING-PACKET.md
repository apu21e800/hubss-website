# HUBSS Catalogue 2026 — Morning Packet

**Status: shipped to staging.** Final finishing pass (overlay legibility + four photo calls) complete, regenerated as **v58 / 140 pp**, merged to `staging` (fast-forward, no conflicts), staging deployment **READY**. Nothing touched main/production.

_Built: 2026-06-13. Branch `chore/catalogue-final-revision` @ `0e85a41` → `staging` @ `0e85a41` (clean FF). v58 print/flipbook artifacts unchanged; the latest push is the plugin build-crash fix (code.js-only)._

---

## 🔴 VERN'S ONE MANUAL STEP — run the Figma plugin (both crashes now FIXED)

Two bugs are fixed. **(1) Dark screen** — the 22.7 MB embedded image bank stalled Figma's main thread; code.js is now **111 KB** with zero embedded images. **(2) Blank canvas** (what you hit next) — the build threw a `ReferenceError` (`lunchPage`) before it drew anything; that's hoisted/fixed and it now **builds 116 frames**, verified end-to-end against a mocked Figma API. It renders in batches with a progress bar and can build the whole book or one section at a time. Full steps in **`catalog-print-build/figma-plugin/RUN-THE-PLUGIN.md`**.

The fixed `code.js` is already on disk at the path your plugin reads, so the cleanest reset:

1. Figma desktop → Plugins → Development → **remove the old "HUBSS Catalogue Builder"** (clears any cached build).
2. **Import from manifest…** → `catalog-print-build/figma-plugin/manifest.json` (on your machine, this repo).
3. Run → panel opens **immediately** → **Build entire book**. "Building… N frames" ticks to **✓ 116 frames**. (If a full pass ever stalls, the **section buttons** each build a slice onto the same page — all 5 verified green.)
4. Re-running migrates text styles in place (UPSERT — no duplicates). Photos are named `[PHOTO]` placeholders — drop images in.

> This time I reproduced your blank canvas, fixed the actual throw, and verified the build runs end-to-end (**116 frames**, all 5 sections green) against a mocked Figma API — but I still can't run a *real* Figma plugin headless, so **your Build is the final confirmation.** Tell me what the panel says if anything's off. Two honest caveats unchanged: the plugin builds the **~100-page (116-frame)** structure (the §4 colour spread + §7 process strip aren't ported into it yet — next increment), and its typography isn't yet 1:1 with v58. The shipping artifacts (print PDF + flipbook **v58**) are fully built and verified; the plugin is for the editable Figma file. `code.js` is gitignored (regenerable + already on your machine); `catalogue-layout.json` is committed + hosted.

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
