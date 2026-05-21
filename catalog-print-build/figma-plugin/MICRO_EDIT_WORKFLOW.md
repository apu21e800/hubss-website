# HUBSS Catalogue — Micro-Edit Workflow in Figma

The plugin generates 100 native Figma frames from the embedded catalog data. After running it once, every text element, every shape, every image placeholder is fully editable in Figma. From that point on, edits are made *in Figma* — not in the build pipeline.

## One-time install (3 minutes)

1. Open the **Figma desktop app** (browser Figma cannot install development plugins)
2. Top menu: **Plugins → Development → Import plugin from manifest...**
3. Navigate to `catalog-print-build/figma-plugin/manifest.json`
4. Click "Open" — the plugin appears in your Plugins menu

## Generate the file (~30 seconds)

1. Open or create a new Figma file (start blank — the plugin lays everything out)
2. **Plugins → Development → HUBSS Catalogue Builder**
3. Click "Build catalogue (100 frames)"
4. Wait ~10–20 seconds. 100 frames populate as a 10-column grid, named "P1 — Cover", "P2 — Half title", etc.
5. Save the Figma file — that's your master.

## Drop in real photos

Every photo position is a beige rectangle named `[PHOTO] <description>`.

- **One at a time:** click the rectangle → in the Fill panel, replace solid colour with **Image fill** → browse to your photo → set scale mode to **Fill**.
- **Batch:** select multiple `[PHOTO]` rectangles → drop a batch of images onto them → Figma distributes them.

The plugin uses placeholders rather than embedding photos directly because Figma's Plugin API can only load images via direct user interaction. This is also where you'll want to be making creative-director calls anyway — picking the strongest shot per page from the asset library.

## Common micro-edits

| Edit | How |
|---|---|
| Change a headline | Click the text, type. Inter Bold/Black if installed, otherwise the system fallback. |
| Recolour an accent | Select the orange dot or rule, change Fill colour. |
| Swap a chip label | Click the pill, edit the text. |
| Move/resize an element | Drag the bounding box. Frames auto-respect the 5×5" trim. |
| Add a page | Duplicate any frame, rename, edit. The frame is independent of the source. |
| Reorder pages | Drag frames in the canvas. Page numbers (folios) are typed text — update manually if order changes. |

## Exporting back to PDF

When you're ready to send to the printer:

1. Select all 100 frames (Cmd/Ctrl-A inside the catalog page)
2. **File → Export...** (or right-click → Export)
3. Format: **PDF** | Settings: 1× scale, RGB → press will convert to CMYK
4. Frames export in canvas order — make sure the layout is left-to-right, top-to-bottom in the order you want page 1 → 100

For absolute CMYK fidelity, send the printer the original `HUBSS_Catalogue_2026_v3.pdf` and use the Figma file as the *editable source* for proof markup and revisions.

## Re-running with new content

If you edit `src/catalog_content.py` (copy, projects, products) and want a fresh layout:

```bash
python -m src.export_json   # regenerates output/catalog_data.json
# Then re-embed in code.js (the build script does this automatically), and
python -m src.final_catalog # rebuilds the PDF
```

Run the plugin again and you'll get fresh layout. Note: this overwrites the Figma file's plugin output — manual edits made in Figma will be lost. So either:
- Make small edits in Figma directly (recommended for typo fixes, micro layout tweaks), or
- Make data edits in `catalog_content.py` and re-run the plugin (recommended for adding products/projects).

## Brand colours (CMYK reference)

| Token | Use | CMYK |
|---|---|---|
| HUBSS Orange | Primary accent, dots, rules | 0 / 65 / 100 / 0 |
| HUBSS Navy | Section openers, dark backgrounds | 65 / 45 / 20 / 92 |
| HUBSS Cream | Paper, body backgrounds | 2 / 4 / 10 / 2 |
| Chip Blue | Light-blue accent on use-case pills | 18 / 4 / 0 / 3 |
| Chip Blue Text | Pill text | 85 / 55 / 20 / 40 |

These are baked into the source pages. In Figma, swap any of them via the Fill picker.
