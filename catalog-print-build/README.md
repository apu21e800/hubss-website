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

## Print Export (for the printer)

Use the **Print for Figma** plugin (printability.app) — it handles CMYK conversion,
bleed, crop marks, and 300 DPI in one step. Do NOT use Figma's built-in File → Export.

**Why not File → Export?** Figma is RGB-only. A manual PDF export will send RGB to the
printer — brand orange `#F97316` will print dull/shifted on press. Print for Figma
converts to CMYK so colours match what you see on screen.

### Steps

1. Build the catalogue via the HUBSS Catalogue Builder plugin → all 100 frames appear
2. Install **Print for Figma** from Figma Community → search "Print for Figma" or go to
   [printability.app](https://printability.app)
3. Select all 100 catalogue frames (Cmd/Ctrl-A inside the catalog page)
4. Open the Print for Figma plugin
5. Set **Color mode: CMYK** ← critical — converts brand orange and all colours for press
6. Set **Bleed: 0.125"** (confirm exact amount with your print house before exporting)
7. Enable **Crop marks**
8. Export → multi-page PDF
9. Confirm frame order is p01 → p100 (left-to-right, top-to-bottom in the Figma canvas)
10. Send the PDF to your printer — they handle saddle-stitch imposition (confirm with printer)

> **PDF/X-1a**: if your printer requires PDF/X-1a specifically, run the exported PDF
> through Adobe Acrobat's PDF/X export after Print for Figma outputs it.

### What the printer receives

- CMYK colour throughout — no RGB surprises on press
- Bleed on every side — trim-safe
- Crop marks — standard for commercial print
- Reading-order pages — printer imposes for saddle-stitch

---

## Color management note

The Figma frames are built in RGB (Figma's native colour space). The Python pipeline
uses HUBSS Orange `{r:0.976, g:0.451, b:0.086}` which maps to `#F97316` in RGB.
Print for Figma converts this to CMYK on export. For maximum brand-orange fidelity,
confirm the CMYK output value matches your printer's profile (target: `0 / 65 / 100 / 0`).

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
