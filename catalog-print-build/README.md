# HUB Surface Systems — 2026 Catalog Build

Programmatic print catalog. The Python pipeline generates a Figma plugin that builds
all 100 frames with live text and embedded photos. Final export goes from Figma to PDF.

## Print specs

- Trim: **5" x 5"**
- Bleed: **0.125"** on every side (document size: 5.25" x 5.25")
- Safe area: **0.25"** inside trim
- Color: **CMYK** (no RGB)
- Image resolution: **300 DPI** target (warning at <240)
- Crop marks: drawn on every page

## Folder layout

```
catalog-print-build/
├── content/
│   └── catalog.yaml          # ← edit this for all copy
├── assets/
│   ├── cover/                # cover.jpg, back.jpg
│   ├── products/             # one hero + one detail per product
│   ├── applications/         # one photo per application
│   └── projects/             # one photo per project
├── src/                      # Python build code (don't edit unless you know why)
├── output/
│   ├── HUBSS_Catalog_2026.pdf        # ← press-ready
│   └── HUBSS_Catalog_2026_PROOF.pdf  # ← with trim/safe guides
└── requirements.txt
```

## How to update the catalog

### Change copy
Open `content/catalog.yaml`. Every piece of text in the catalog is in here.
Edit, save, rebuild.

### Swap an image
Drop a replacement file in the matching `assets/...` subfolder, using the
exact filename referenced in `catalog.yaml` (e.g. `assets/products/streetbond_hero.jpg`).

Image guidance:
- Use the highest resolution you have (the build embeds at full res)
- Aim for 300 DPI at the placed size — for a full-bleed cover (5.25"), that
  means **at least 1575×1575 pixels**
- TIFF, PNG, JPG all work; the build automatically converts RGB → CMYK

### Add or remove a product
In `catalog.yaml`, add/remove an entry under `products:`. The build adapts —
each product still gets a 2-page spread.

### Add or remove an application/project
Same idea: edit `applications:` or `projects:` in the YAML.

### Rebuild

```bash
pip install -r requirements.txt          # one time
python -m src.build                      # press-ready PDF
python -m src.build --proof              # with trim+safe guides
python -m src.build --out custom.pdf     # custom output path
```

The press-ready file lands at `output/HUBSS_Catalog_2026.pdf`.

## Figma plugin workflow (current build method)

### Build the plugin

```bash
# Rebuild after any copy or data changes:
python -B -m src.generate_plugin   # writes figma-plugin/code.js (~78 KB, no images)
python -B -m src.embed_images      # injects base64 IMAGE_BANK — keep under 74 MB total

# Or regenerate catalog_data.json first (if catalog_content.py was edited):
python -B -m src.export_json && python -B -m src.generate_plugin && python -B -m src.embed_images
```

### Install and run in Figma

1. Open **Figma desktop** (browser Figma cannot install development plugins)
2. **Plugins → Development → Import plugin from manifest…** → select `figma-plugin/manifest.json`
3. Open a blank Figma file
4. **Plugins → Development → HUBSS Catalogue Builder → Build catalogue (100 frames)**
5. ~10–20 seconds — 100 frames appear in a 10-column grid

### Exporting to PDF for print

**Critical: Figma frames are 450 × 450 px. To hit 300 DPI at 5" × 5" trim, you MUST export at 3.33× scale.**

```
450 px × 3.33 = 1498.5 px ≈ 1500 px
1500 px ÷ 300 DPI = 5 inches ✓
```

**Export steps:**
1. Select all 100 frames (Cmd/Ctrl-A inside the catalog Figma page)
2. **File → Export…** (or right-click → Export)
3. Set format: **PDF**
4. Set scale: **3.33×** ← this is the critical setting
5. Confirm the frame order is left-to-right, top-to-bottom (p01 → p100)
6. Export → send `HUBSS_Catalogue_2026.pdf` to printer

> If your printer requires PDF/X-1a, run the exported PDF through Adobe Acrobat's
> PDF/X export or ask the printer for their preflight requirements.

### Bleed note

The current Figma frames are trim-size only (450 × 450 px = 5" × 5"). The printer
will need either: (a) 0.125" bleed added per side (5.25" × 5.25" document), or
(b) the printer handles bleed setup. Confirm with your print house before final export.

---

## What to send the printer

Send the PDF exported from Figma at 3.33× scale. The printer should:
- See a 5.25 × 5.25 in MediaBox
- Cut on the crop marks → 5 × 5 in finished piece
- Find CMYK color throughout

If the printer asks for PDF/X-1a specifically, run the output through
Acrobat's PDF/X export, or ask them what their preflight requires — ReportLab
doesn't natively certify PDF/X.

## Color management note

Image CMYK conversion uses Pillow's naive RGB→CMYK transform. For accurate
brand-orange reproduction, run brand-critical images through Photoshop with
your printer's ICC profile and replace the files in `assets/`. Drop the
already-CMYK image into the same path; the build skips conversion when the
image is already CMYK.

## Adjusting the look

- Colors: `src/specs.py` → `HUBSS_ORANGE`, etc. (CMYK values)
- Type sizes: `src/specs.py` → `TYPE` dict
- Page layouts: `src/pages.py` → one function per page type

## Troubleshooting

**Stale Python cache**: if changes to `src/` aren't reflected in the output,
delete `__pycache__` folders or run with:

```bash
PYTHONPYCACHEPREFIX=/tmp/pyc python -B -m src.build
```

**Missing images**: the build draws a grey placeholder with the asset name
labeled inside it. Drop the file in and rebuild.

**Page count must be divisible by 4** for saddle-stitch / perfect binding.
The build pads to 40 pages by default. To change, edit the `while page_num <
39` line in `src/build.py`.
