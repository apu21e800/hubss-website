# Run the HUBSS Catalogue plugin (Vern, Figma desktop)

**The dark screen is fixed.** code.js went from 22.7 MB (which stalled Figma's main thread before the UI could paint) to **111 KB** — the bloat was an embedded base64 image bank; we no longer embed it. The plugin now renders in batches with a progress bar, and can import the whole book or one section at a time.

## Steps
1. Figma desktop → **Plugins → Development → Manage plugins in development** → remove the old "HUBSS Catalogue Builder".
2. **Import plugin from manifest…** → choose
   `catalog-print-build/figma-plugin/manifest.json` (in this repo, on your machine).
3. Open a fresh Figma page, run the plugin. A panel opens **immediately** (no dark screen).
4. Click **Build entire book**. You'll see "Building… N frames" tick up and a progress bar. When it says **✓ Done**, close the plugin.
5. If "entire book" ever stalls on a given day, use the **section buttons** (Products / Applications / Projects / Network / Reference) — each is a separate safe pass onto the same page. (This is the documented fallback.)

## What you get
- Native, fully-editable frames: **live text layers** (edit type directly), **named layers** per archetype, the design-system **text styles + components**. Restructure pages freely.
- Re-running migrates the text styles in place (the `_ensureTextStyle` upsert) — it won't create duplicates.
- Photos render as named **`[PHOTO]` placeholder rectangles** — drop your images into them (or pull from the flipbook/PDF). We deliberately do **not** embed images in the plugin (that's what caused the dark screen).

## Two honest caveats
- **Page coverage:** the plugin currently builds the **~100-page** structure from `catalogue-layout.json`. It does **not yet** include the §4 colour-system spread or the §7 StreetPrint process strip that are in the 140-page print/flipbook (v58). Closing that gap (porting those archetypes into the plugin) is the next step — flagged so the frame count won't surprise you.
- **Verification:** this build is syntax-checked and the payload is tiny, but I can't run a Figma plugin headless — **your Build is the live test.** If anything misbehaves, tell me what the panel says and I'll fix it.

_Layout data: `catalogue-layout.json` (here + served at `/catalogue/figma/catalogue-layout.json`). Regenerate after content changes: `python -B -m src.export_json && python -m src.generate_plugin` from `catalog-print-build/` — and do **not** run `embed_images` (that re-creates the 22.7 MB bank)._
