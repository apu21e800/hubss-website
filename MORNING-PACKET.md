# HUBSS Catalogue 2026 — Morning Packet

**Status: shipped to staging.** Final finishing pass (overlay legibility + four photo calls) complete, regenerated as **v58 / 140 pp**, merged to `staging` (fast-forward, no conflicts), staging deployment **READY**. Nothing touched main/production.

_Built: 2026-06-12. Branch `chore/catalogue-final-revision` @ `3060031` → `staging` @ `3060031`._

---

## 🔴 VERN'S ONE MANUAL STEP — run the Figma plugin

The Figma build is the **only** thing I can't do headless (you run the plugin in Figma desktop). Everything else is done and verified.

1. Figma desktop → open your HUBSS catalogue file → Plugins → Development → **remove the old "HUBSS Catalogue" plugin**.
2. Re-import the manifest: `catalog-print-build/figma-plugin/manifest.json` (rebuilt LITE; `code.js` is 22.7 MB, regenerated this pass — gitignored, present locally).
3. Run it → **Build**. The `_ensureTextStyle` **upsert** is intact, so it migrates your existing text styles in place to the final TYPE-SPEC ramp (no stale values) and rebuilds all frames.
4. Spot-check 5 archetypes against the print render (below): product spec, colour spread, section divider, DPS caption, project card.

> The shipping artifacts (print PDF + web flipbook v58) are fully built and verified — the plugin run is for the **editable Figma file** only. In-plugin frame geometry for the new overlay scrims is unverified by me (I can't run the plugin); your Build is the verification. Full plugin↔print parity (cover/divider scrims, one stale "500+ municipalities" line in the navy closing spread) is the remaining **Figma-parity** item — see ISSUES.

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
