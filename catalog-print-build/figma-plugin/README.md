# HUBSS Catalogue Builder — Figma Plugin

A one-shot plugin that generates the entire 100-page catalog as **native Figma frames** in a fresh Figma file. Every text element is editable. Every shape is editable. Every page is its own frame named like "P3 — StreetBond (spec)".

## What you get

A single Figma file with:
- **100 frames at 378×378 pt** (5.25" × 5.25" — trim + bleed)
- **Editable text** at all sizes — Inter Black for display, Inter SemiBold for caps, Inter Regular for body
- **Editable vectors** — orange dots, hairline rules, pills, scrim rectangles
- **Photo placeholders** — every image position is a beige `[PHOTO]` rectangle. Drop in the actual photo and Figma will auto-fit it.
- **Brand colours** — orange `#F97316`, navy `#0F1620`, cream `#F4F1EB`

## Install (one-time, ~3 minutes)

1. Open Figma desktop app (plugins require desktop, not browser)
2. Top menu: **Plugins → Development → Import plugin from manifest...**
3. Browse to `figma-plugin/manifest.json` in this folder
4. Click "Open" — the plugin appears in your Plugins menu

## Run (~30 seconds)

1. Open or create a Figma file
2. **Plugins → Development → HUBSS Catalogue Builder**
3. Click "Choose File" and select `catalog_data.json` (in `output/` next to the PDF)
4. Click "Build catalogue (100 frames)"
5. Wait ~10–20 seconds. Layout populates as a 10-column grid of frames.

## Add photos

Every photo position is a beige rectangle named `[PHOTO] <description>`. To add a real photo:

1. Click the `[PHOTO]` rectangle
2. In Fill section of right panel: replace the solid colour with **Image fill**
3. Browse to your photo file
4. Set scale mode to **Fill** (covers the area)
5. Done — repeat for every page

You can also batch-fill: select multiple `[PHOTO]` rectangles, drop a batch of images, Figma will distribute them.

## Caveats

- Plugin uses Figma's standard Plugin API. Requires a recent Figma desktop version.
- Inter must be available (it's free; Figma usually has it pre-installed).
- The plugin doesn't load photos directly (Figma Plugin API can only load images via user interaction). You add photos manually after the layout generates — that's where you'd want to be making creative-director calls anyway.

## Why a plugin instead of an export

Figma's `.fig` file format is proprietary. There's no public spec. The Plugin API is the only programmatic way to create native Figma content from outside data.

The result of running this plugin IS a standard Figma file. You save it as `.fig`, share it, version it, edit it in collaborative sessions like any other Figma file.

## Editing after generation

All text uses Figma's text engine — change a paragraph, change a font, change colour, change tracking, change anything. Frames can be moved, resized, regrouped. You own the file completely.

## Re-running

If you edit `src/catalog_content.py` (copy, photos, projects), re-run `python -m src.export_json` to regenerate `catalog_data.json`. Then run the plugin again to get a fresh layout. (Or just edit in Figma directly — once you have the file, the source is for backup.)
