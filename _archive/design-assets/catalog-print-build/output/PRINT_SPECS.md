# HUBSS Catalogue 2026 — Print Specifications

## Document
- **File**: `HUBSS_Catalogue_2026_v20.pdf` (or current latest)
- **Pages**: 100 (divisible by 4 for saddle-stitch signatures)
- **Page size**: 5.25" × 5.25" (with 0.125" bleed)
- **Trim size**: 5" × 5" (final cut size)
- **Orientation**: Square

## Bleed and safe areas
- **Bleed**: 0.125" (3.18 mm) on all four sides — full-bleed photos and fills extend into this zone
- **Safe area**: 0.25" (6.35 mm) inside trim — all text and critical artwork kept inside this boundary
- **Gutter clearance**: 0.0625" (1.59 mm) of additional inside-edge margin recommended; not currently required because every text element already sits ≥ 0.33" from trim edges
- **TrimBox**: 5" × 5" defined in PDF metadata
- **MediaBox**: 5.25" × 5.25" (trim + bleed)

## Binding
- **Method**: Saddle-stitch (stapled at the spine through the centerfold)
- **Why saddle-stitch**: at 100 pages and 5×5", saddle-stitch is the right choice — perfect-bound would be excessive for the page count and would push the inner margin further from the spine
- **Page count must be a multiple of 4**: 100 ✓
- **Creep**: minimal at this trim size and signature count; press operator to compensate if needed (~0.5-1 pt outer-margin shift for inner spreads)

## Ink and colour
- **Colour space**: CMYK for type and shapes; RGB JPEGs for embedded photography (press converts to CMYK with their paper-matched ICC profile)
- **Total area coverage (TAC)**: every CMYK fill ≤ 280% — well under press limits
- **Spot colours**: none (4-process throughout)
- **Brand colours**:
  - Orange `CMYK 0 65 100 0` (≈ `#F97316`)
  - Navy `CMYK 65 45 20 92`
  - Cream paper tone `CMYK 2 4 10 2`
  - Chip blue tint `CMYK 5 2 0 4`

## Type
- **Embedded fonts**: PDF base-14 (Helvetica, Helvetica-Bold, Times-Roman) — universally available on every commercial RIP, no embedding required
- **Minimum size**: 6 pt (5.2 pt rendered) — every text element above the press-readable threshold
- **Display headlines**: 22–48 pt, weight 800
- **Body text**: 8.5–10 pt with proportional leading (1.4–1.5×)
- **Tracked caps**: 6.5–13.5 pt, +2.4 letter-spacing

## Image resolution
- All embedded photography resolved at 1200–4600 px on the long edge
- Most product/project photos at 300+ DPI when full-bleed at 5.25"
- A handful of source-limited blog/featured photos render at 200–240 DPI; press will print these acceptably but absolute crispness requires re-shoots

## Crop marks
- Vector crop marks placed at all four corners outside trim
- TrimBox metadata embedded in PDF for automated registration

## Paper recommendation
- **Cover**: 100 lb gloss or silk cover stock; matte aqueous finish
- **Interior**: 80–100 lb text, dull or silk finish to suppress glare on full-bleed photography
- **Optional**: soft-touch lamination on the cover for premium tactile

## Pre-press checklist
- ✓ 100 pages, divisible by 4
- ✓ 5.25" × 5.25" page, 5" × 5" trim, 0.125" bleed
- ✓ CMYK colour values in spec; photos as RGB JPEG
- ✓ Total area coverage under 280%
- ✓ All text within safe area
- ✓ Crop marks present
- ✓ No duplicate images across pages
- ✓ Folios removed (no page numbers)

## Notes for press operator
- Pages with full-bleed photography (cover, section openers, all product/project hero pages, back cover) extend image content into the bleed zone — trim cleanly to 5" × 5".
- The dark "scrim" overlay on hero pages is rendered as PIL-generated alpha gradients in the PDF — flatten transparency on import if your RIP requires it.
- Crop marks include both cut and registration indicators.
