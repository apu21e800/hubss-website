# HUBSS Catalogue 2026 — Print Production Specs

This document goes to the press. It tells the print factory exactly what they
are receiving and what they need to know to produce the piece correctly.

---

## File

- **Filename:** `HUBSS_LookBook_2026.pdf`
- **Format:** PDF (single-document, sequential pages)
- **Page count:** 52 pages (cover + interior + back cover)
  - Divisible by 4 — saddle-stitch ready

## Page geometry

- **Trim size:** 5.000" × 5.000" (square)
- **Bleed:** 0.125" on every side (top, bottom, left, right)
- **Document size (with bleed):** 5.250" × 5.250"
  - This is what the file's MediaBox reports
- **Safe area:** 0.250" inside the trim line on every side
  - All critical text and logos are kept inside this margin
- **Crop marks:** Drawn on every page, just outside the trim box (in the bleed area). 0.25 pt hairline. They will be cut off in the final piece.

## Color

- **Color space:** CMYK throughout
- **Brand orange:** C 0% / M 65% / Y 100% / K 0%
- **Brand black:** Pure 100% K (used for type and dark fills)
- **Rich black** (used only for large solid backgrounds): C 40% / M 30% / Y 30% / K 100%
- **No spot colors used.** The whole job is 4-process CMYK.
- **No RGB elements.** All photographs were converted to CMYK before placement (Pillow naive RGB→CMYK).
  - **Caveat:** The CMYK conversion does not use a printer-specific ICC profile. For brand-critical orange accuracy, the printer should soft-proof to their profile and request a swatch press check before production. We are happy to supply ICC-tagged versions of any image on request.

## Image resolution

- **Target effective resolution:** 300 DPI at the placed size
- All images cached at long-edge 1500–2000 px (sufficient for full-bleed at this trim size)
- Smaller images may render at ~240–280 DPI — still within commercial-print range, but flag if any specific page comes out soft on a press proof.

## Type

- **Display headlines:** Helvetica Bold at 30pt, leading 34pt, tracking −0.6pt
- **Page titles:** Helvetica Bold at 22pt, leading 26pt, tracking −0.3pt
- **Body copy:** Helvetica Regular at 10pt, leading 14pt
- **Eyebrows / labels:** Helvetica Bold uppercase at 8–9pt with +1.4pt tracking
- **Page numbers / footer:** Helvetica Regular at 8pt
- **Smallest type used:** 7pt (page numbers / footer microtype)

All fonts are standard PDF Type 1 fonts (Helvetica family) — no custom font embedding needed.

## Binding recommendation

- **Saddle-stitch** is the most natural fit: 52 pages = 13 four-page signatures.
- **Perfect bind** also works at this page count. No spine printing has been added — if perfect-bound, the spine will be a thin black wrap.
- **Square cover** wrap recommended; no special creasing.
- **Stock recommendation:** Cover at 100lb cover stock, interior at 80–100lb gloss or matte text. Interior photography is dense enough that gloss would lift the image vibrancy.

## What the press should verify on proof

1. Trim box at exactly 5.000" × 5.000" (crop marks are honest)
2. CMYK only — no RGB stragglers
3. Bleed reaches the page edge on every full-bleed image (no white slivers)
4. Brand orange matches the supplied swatch on a hard-copy proof
5. Type quality on body copy at 10pt — should be crisp on uncoated stock

## Contact

For questions during production, contact:
- Cleve Stordy / cleve.stordy@hubss.com / 604-309-8212

---

*File built programmatically with Python + ReportLab. Source files in
`catalog-print-build/`. Build is fully reproducible.*
