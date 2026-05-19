# HUBSS Catalogue 2026 — Files for Figma Editing

You have **three paths** to bring this catalogue into Figma. Pick the one that fits your workflow.

---

## Path 1 — Drag and drop the PDF into Figma

**File:** `HUBSS_Catalogue_2026.pdf` (105 MB, 100 pages)

**How:**
1. Open Figma and create a new file (or open an existing one).
2. Drag `HUBSS_Catalogue_2026.pdf` directly into the canvas.
3. Figma will import each page as its own frame.

**What you can edit:**
- ✅ Photos — fully replaceable
- ✅ Vector shapes (rules, dots, pills, scrim rectangles) — editable
- ⚠️  Text — Figma may import text as outlined paths, NOT live editable text. If you need to edit copy, use Path 2 (SVG) or Path 3 (Figma Make).

**Best for:** Visual review, light photo swaps, getting the layout into Figma quickly.

---

## Path 2 — Import the SVGs (recommended for editable text)

**Folder:** `output/svg/` — 100 SVG files, one per page (`page-001.svg` through `page-100.svg`)

**How:**
1. Open Figma, create a new file.
2. Drag any SVG file into the canvas — it imports as a frame with editable layers.
3. Repeat for any pages you want to edit (or batch-import multiple at once).

**What you can edit:**
- ✅ Photos
- ✅ All vector shapes
- ✅ Text — generally imports as live, editable text (because pdftocairo preserves text as glyph paths with text spans)
- ⚠️  Some glyphs may import as paths if Figma doesn't recognize the font — you can replace with Inter or your brand font

**Best for:** Detailed editing, copy revisions, swapping text content.

---

## Path 3 — Generate from scratch with Figma Make

**File:** `FIGMA_MAKE_PROMPT.md`

**How:**
1. Open Figma Make (https://www.figma.com/make).
2. Copy the entire contents of `FIGMA_MAKE_PROMPT.md` into the prompt input.
3. Run. Figma Make will generate a new editable file matching the design system.

**What you get:**
- A native Figma file with proper frames, components, and live text
- The design system documented as styles (typography, colors)
- Full editorial control — every element editable

**Caveats:**
- AI generation isn't 100% deterministic. The file may need polish.
- It won't auto-place your photos — you'll add those after.

**Best for:** Building a clean Figma source-of-truth that someone can take over and refine.

---

## Recommended Workflow

If you're working with a designer:
1. **Send them the PDF** for visual reference.
2. **Send them the SVG folder** so they can edit specific pages.
3. **Send them the Figma Make prompt** if they want to start from a generated baseline.

If you're DIY:
1. Drag the PDF into Figma for the full layout.
2. Pull individual SVGs for any page you want to refine.

If your designer wants a clean Figma source:
1. Run the Figma Make prompt for a fresh file.
2. Drop in your photos.
3. Polish.

---

## Source Files (for re-rendering)

If you want to regenerate the PDF after editing copy or swapping photos:

- **Edit content:** `catalog-print-build/src/catalog_content.py` — contains all product copy, project stories, application descriptions, photos, etc.
- **Re-run build:** `cd catalog-print-build && python -m src.final_catalog`
- **Output:** `catalog-print-build/output/HUBSS_Catalogue_2026.pdf`

Print specs:
- 5×5" trim, 0.125" bleed, CMYK-friendly, crop marks included
- Recommended stock: matte uncoated 100lb cover for a premium feel
- Print binding: saddle-stitched (page count is divisible by 4)

---

## Brand Assets Used

- HUBSS logos: `public/images/assets/logos/hubss-logos/`
- Product photos: `public/images/products/<product>/`
- Application photos: `public/images/applications/<app>/`
- Project blog photos: `public/images/blog/<post>/`
- Curated booklet photos: `catalog-print-build/assets/booklet/`

---

Built from the live HUBSS website data (`lib/products.ts`, `lib/applications.ts`, `lib/projects.ts`, `app/about/page.tsx`, `components/sections/WhyHubss.tsx`).

100 pages. 12 products. 17 applications. 18 case studies. 4 certified installers. Coast to coast.
