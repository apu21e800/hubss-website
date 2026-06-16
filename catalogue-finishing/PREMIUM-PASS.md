# Overnight Premium Pass — Figma plugin (cloud-safe)

Branch `chore/catalogue-final-revision`, started @ `5e6d04d`. **Plugin only** —
`generate_plugin.py` + harness. **No ReportLab / PyMuPDF / PDF / flipbook run.**
The print v58 is untouched (frozen client deliverable). Harness stayed **PARITY OK
(140 frames, fonts loaded, §4/§7 + all sections)** after every page. Commit-per-page
for rollback. Built blind (no real Figma) — so each page lists what to eyeball.

Shared addition: **`noOrphan()`** helper — binds the last two words of a display
line with a non-breaking space so a headline never drops one word to its own line.

---

## Page 1 — Product SPEC (all 11) · commit `d27f4c1`
**Changed:** snapped off-ramp sizes to TYPE-SPEC (no invented sizes): product
name/title **22→21**, subhead **10.5→12.5**, body **9.5→10**, spec label **6.0→6.5**.
Even 2-column spec grid — equal **186 px** columns + **22 px** gutter (was 28/230 with
mismatched 190/185 max-widths). Title runs through `noOrphan`. Δ36 vertical rhythm
title→subhead→body.
**Intent:** one consistent system across all 11; clean aligned spec columns; clear
title>subhead>body hierarchy on the documented ramp.
**EYEBALL:** (1) subhead at 12.5 — confirm clearance above the body on a 2-line
italic standfirst; (2) spec-grid columns align on products with long values
(StreetBond "30–50 sq ft / gallon"); (3) StreetBond ® logo still clears the title.

## Page 2 — Product HERO (all 11) · commit `2a35934`
**Changed:** tagline **22→21** (TYPE-SPEC "Title / Product Tagline"), line-height
26→25, `noOrphan` on the tagline. Medium weight + −1.4% tracking kept.
**Intent:** ramp-consistent display tagline; no orphaned last word.
**EYEBALL:** longest names (TrafficPatternsXD) — the tagline's last two words stay
bound and it sits cleanly under the orange eyebrow.

## Page 3 — §4 Colour spread A (37 chips) · commit `f5310e9`
**Changed:** chip grid was left-aligned with a ~12 px right-short gap. Now
**edge-to-edge even** — first chip flush at the 28 px margin, last flush at 422,
equal 14 px gaps (`STRIDE = (394−chipW)/(cols−1)`), names baseline-aligned under
each chip. Both families on the same grid.
**Intent:** the brief's "mathematically even chip grid (equal gaps, aligned rows)."
**EYEBALL:** 6 columns perfectly even, right column touching the right margin;
chip names sit under their chips without colliding with the next column.

## Page 4 — §4 Colour spread B (SR + cycle-lane) · commit `c1abcf2`
**Changed:** SR 11-chip grid (4-col) and the 3 cycle-lane chips evened edge-to-edge
(SR stride `(394−86)/3`; CL `3×118 + 2×20`). SRI·R·E data lines align under each SR
chip. Standards / soft-LEED / footer unchanged.
**EYEBALL:** SR 4 columns even with the last at the right margin; the 3 cycle-lane
chips evenly span the width; SR data legible under each chip.

## Page 5 — Reference / "The systems." table · commit `1780c02`
**Changed:** the spec column (max-width 120 @ x180) **overran** the description
column (@ x270). Reset to true columns name|spec|desc at **x = 30 / 186 / 264**,
consistent 10 px gutters, no overlap; spec small-caps **baseline-nudged +3** to the
name's baseline (desc +1); row rules to a **0.6 px hairline**.
**Intent:** premium table feel — three clean aligned columns down all 11 rows.
**EYEBALL:** columns align cleanly for all 11 products; the orange spec caps sit
level with the product name; hairline rules even.

---

## Verification
Headless harness after each page: `PARITY OK — full 140-page v58 book`, fonts all
loaded, no font rejects, §4/§7 present, all 5 sections intact. `node --check` clean.
Branch + staging fast-forwarded each commit; `code.js` gitignored (regenerable).
The print PDF/flipbook were **never run** and remain v58. **main untouched.**

To see it: remove old plugin → re-import manifest → Build entire book **on an empty
page** → ✓ 140 frames (per the freeze-safe guidance).

---

## DEFERRED to an ATTENDED session (after Vern approves here) — HEAVY, not run overnight
These premium changes live in the **plugin only**. To carry them into the print PDF +
web flipbook (the frozen v58 deliverable), an attended run is required because it
needs ReportLab + PyMuPDF (the heavy local render barred overnight):

1. Port the same five refinements into `final_catalog.py` builders:
   `page_product_spec` (ramp sizes + even spec grid), `page_product_hero` (tagline 21
   + no_orphan), `page_colour_system_a/b` (even chip grids), `page_technical_reference`
   (3-column alignment).
2. Rebuild the print PDF (`final_catalog.py`) — **heavy (ReportLab + FOGRA CMYK)**.
3. Rebuild the flipbook (`build_flipbook.py`, PyMuPDF) + `build_manifest.py` — **heavy**.
4. Bump version v58 → v59; re-run the QA/parity checks; commit the new webps.
5. Push + confirm staging serves v59; only then is Doug's flipbook updated.

Until that attended run, the staging flipbook stays **v58** (correct + shippable);
the premium pass is visible in the **Figma plugin** for Vern's approval.
