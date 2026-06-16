# Run the HUBSS Catalogue plugin (Vern, Figma desktop)

**Both crashes are fixed.** (1) The **dark screen** — code.js went from 22.7 MB (which stalled Figma's main thread before the UI could paint) to **~112 KB**; the bloat was an embedded base64 image bank we no longer embed. (2) The **blank canvas** (the build that ran but drew nothing) — the font preload asked for `Inter "SemiBold"`, but real Figma's semibold is `"Semi Bold"` **with a space**, so it rejected and aborted the build before the first frame; the old error path then closed the plugin instantly, cancelling its own error toast — so you saw nothing. Now it loads only the weights actually used (Regular/Medium/Bold) resiliently, and **never fails silently** (see step 4). The plugin renders in batches with a progress bar, and can build the whole book or one section at a time.

## Steps
1. Figma desktop → **Plugins → Development → Manage plugins in development** → remove the old "HUBSS Catalogue Builder".
2. **Import plugin from manifest…** → choose
   `catalog-print-build/figma-plugin/manifest.json` (in this repo, on your machine).
3. Open a fresh Figma page, run the plugin. A panel opens **immediately** (no dark screen).
4. Click **Build entire book**. A toast says **"Build started…"**, then **"Loading N photos from staging…"** (the bar ticks through ~94 images — give it a moment), then "Building… N frames", ending on **✓ Done — 140 frames**. Close the plugin.
   - **If anything goes wrong it now tells you, loudly:** a red **✕ message stays in the panel** and an error toast appears (8 s). It no longer closes itself on error — so you'll never again get a silent blank canvas. If you see a ✕, copy the message to me.
5. If "entire book" ever stalls on a given day, use the **section buttons** (Products / Applications / Projects / Network / Reference) — each is a separate safe pass onto the same page. (This is the documented fallback.)

## What you get
- Native, fully-editable frames: **live text layers** (edit type directly), **named layers** per archetype, the design-system **text styles + components**. Restructure pages freely.
- Re-running migrates the text styles in place (the `_ensureTextStyle` upsert) — it won't create duplicates.
- **Photos now stream in automatically** — the plugin fetches each one from the hosted images (staging) via `createImageAsync` and applies it as a fill, so the frames come in with real photography. (Streamed, *not* embedded — embedding the image bank is what dark-screened Figma. Anything that can't be fetched falls back to a named `[PHOTO]` placeholder you can drop into.) Needs internet; the manifest allows the staging + hubss.com domains.

## Two honest caveats
- **Page coverage:** the plugin now builds the **full 140-page v58 book** — §4 colour-system spread, §7 StreetPrint process strip, and applications as 2-page spreads are all in (the earlier 116-frame gap is closed). Expect **✓ 140 frames**.
- **Verification:** a headless harness (`catalogue-finishing/_figma_harness.js`) runs code.js against a **font-aware mock of the Figma API** — it rejects fake style names (would have caught the `"SemiBold"` bug), and now **asserts full parity** (140 frames + §4 + §7 + all 5 sections). Current: PARITY OK. But I still can't run a *real* Figma plugin headless, so **your Build is the final test.** If anything misbehaves, the panel will show a ✕ — send me that line and I'll fix it.

_Layout data: `catalogue-layout.json` (here + served at `/catalogue/figma/catalogue-layout.json`). Regenerate after content changes: `python -B -m src.export_json && python -m src.generate_plugin` from `catalog-print-build/` — and do **not** run `embed_images` (that re-creates the 22.7 MB bank)._
