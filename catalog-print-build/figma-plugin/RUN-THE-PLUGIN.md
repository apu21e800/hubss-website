# Run the HUBSS Catalogue plugin (Vern, Figma desktop)

**Both crashes are fixed.** (1) The **dark screen** — code.js went from 22.7 MB (which stalled Figma's main thread before the UI could paint) to **~112 KB**; the bloat was an embedded base64 image bank we no longer embed. (2) The **blank canvas** (the build that ran but drew nothing) — the font preload asked for `Inter "SemiBold"`, but real Figma's semibold is `"Semi Bold"` **with a space**, so it rejected and aborted the build before the first frame; the old error path then closed the plugin instantly, cancelling its own error toast — so you saw nothing. Now it loads only the weights actually used (Regular/Medium/Bold) resiliently, and **never fails silently** (see step 4). The plugin renders in batches with a progress bar, and can build the whole book or one section at a time.

## Steps
1. Figma desktop → **Plugins → Development → Manage plugins in development** → remove the old "HUBSS Catalogue Builder".
2. **Import plugin from manifest…** → choose
   `catalog-print-build/figma-plugin/manifest.json` (in this repo, on your machine).
3. Open a fresh Figma page, run the plugin. A panel opens **immediately** (no dark screen).
4. Click **Build entire book**. Immediately a toast says **"Build started — loading fonts, then placing pages…"** (so you always know it heard the click), then "Building… N frames" ticks up with the bar, and it ends on **✓ Done — 116 frames**. Close the plugin.
   - **If anything goes wrong it now tells you, loudly:** a red **✕ message stays in the panel** and an error toast appears (8 s). It no longer closes itself on error — so you'll never again get a silent blank canvas. If you see a ✕, copy the message to me.
5. If "entire book" ever stalls on a given day, use the **section buttons** (Products / Applications / Projects / Network / Reference) — each is a separate safe pass onto the same page. (This is the documented fallback.)

## What you get
- Native, fully-editable frames: **live text layers** (edit type directly), **named layers** per archetype, the design-system **text styles + components**. Restructure pages freely.
- Re-running migrates the text styles in place (the `_ensureTextStyle` upsert) — it won't create duplicates.
- Photos render as named **`[PHOTO]` placeholder rectangles** — drop your images into them (or pull from the flipbook/PDF). We deliberately do **not** embed images in the plugin (that's what caused the dark screen).

## Two honest caveats
- **Page coverage:** the plugin currently builds the **~100-page** structure from `catalogue-layout.json`. It does **not yet** include the §4 colour-system spread or the §7 StreetPrint process strip that are in the 140-page print/flipbook (v58). Closing that gap (porting those archetypes into the plugin) is the next step — flagged so the frame count won't surprise you.
- **Verification:** beyond syntax-checking, a headless harness (`catalogue-finishing/_figma_harness.js`) now runs code.js against a **font-aware mock of the Figma API** — it rejects fake style names (this is what would have caught the `"SemiBold"` bug) and confirms all 116 frames build. But I still can't run a *real* Figma plugin headless, so **your Build is the final test.** If anything misbehaves, the panel will show a ✕ — send me that line and I'll fix it.

_Layout data: `catalogue-layout.json` (here + served at `/catalogue/figma/catalogue-layout.json`). Regenerate after content changes: `python -B -m src.export_json && python -m src.generate_plugin` from `catalog-print-build/` — and do **not** run `embed_images` (that re-creates the 22.7 MB bank)._
