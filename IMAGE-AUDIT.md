# Image Path Audit

**Last updated:** 2026-05-17 (Block B cleanup)  
**Tool:** `scripts/audit-images.mjs`  
**Scope:** All `.ts/.tsx/.mdx` source files scanned for `/images/...` path literals **plus** dynamic `gallery()` expansion

---

## Summary (Block B — after gallery expansion + broken path fixes)

| Metric | Block A (static scan only) | Block B (gallery-expanded) |
|---|---|---|
| Total unique image paths referenced | 163 | 1,099 |
| Valid paths (file exists) | 161 | **1,099** |
| **Broken paths (file missing)** | **2** | **0** |
| Files in `/public/images/` not referenced | 1,510 | **572** |
| Paths referenced by 3+ source files | 62 | 85 |

**True orphan count: 572** (down from the apparent 1,510 — the 938 difference were all legitimate gallery images that the static scanner couldn't see).

---

## Broken Paths Fixed in Block B

All 4 previously-identified broken paths have been resolved:

| Path | Fix applied |
|---|---|
| `/images/applications/crosswalks/crosswalks-41.jpg` | Replaced index 41 → **42** in crosswalks gallery (both `crosswalks` and `pedestrian-safety` entries in `lib/applications.ts`) |
| `/images/applications/crosswalks/crosswalks-112.jpg` | Replaced index 112 → **116** in crosswalks gallery (both entries) |
| `/images/applications/parks-paths/parks-paths-97.jpg` | Replaced index 97 → **95** in parks-paths gallery in `lib/applications.ts` |
| `/images/blog/default.jpg` | Changed fallback in `app/api/blog/generate/route.ts` to use existing `/images/blog/decorative-crosswalks-community-identity/featured.jpg` |

The static scanner false-positive `/images/products/streetbond/streetbond-${n}.jpg` (template literal incorrectly captured as a literal string) is now filtered out by the `${}` guard added in step 3 of the scanner.

---

## Orphan Analysis (Block B — 572 true orphans)

After gallery expansion, the remaining 572 orphan files are images that exist in `/public/images/` but are not referenced by any gallery array or literal path in source. These are genuine candidates for archiving/deletion — but **no files have been deleted in this PR** (too risky without visual review).

### Breakdown by directory (estimated)

| Directory | Orphan files | Likely reason |
|---|---|---|
| `/images/applications/commercial-spaces/` | ~70 | Between-index files (gallery uses every 2nd-3rd) |
| `/images/applications/crosswalks/` | ~50 | Between-index files |
| `/images/applications/parks-paths/` | ~45 | Between-index files |
| `/images/products/streetbond/` | ~40 | Between-index files + old product shots |
| `/images/assets/logos/` | ~35 | Manufacturer logos possibly never shown on site |
| `/images/assets/installation-images/` | ~34 | Legacy catalog PNG exports (19–29MB each) |
| All others | ~298 | Between-index files across remaining galleries |

> Between-index files exist because galleries use hand-curated index arrays (every 3rd, every 5th, etc.) rather than consecutive sequences. The skipped files are not broken — they were just not selected for display. They are safe to archive but not urgent.

---

## Recommendation for Follow-up (P2)

1. **Visual review:** Export the orphan list from `scripts/image-audit-data.json` and eyeball a sample before deleting anything — some between-index images may be better than the selected ones.
2. **Archive, don't delete:** Move confirmed orphans to `/public/images/_archive/` before any permanent removal.
3. **Priority targets:** `/images/assets/installation-images/` (large legacy PNGs) and `/images/assets/logos/` (manufacturer logos) are the highest-value cleanup candidates.
4. **Sanity gallery migration:** Now that `gallery()` paths are fully enumerable via the expanded scanner, gallery arrays can be migrated to Sanity in a follow-up block.

---

## Multi-Referenced Paths (85 total after expansion)

Images referenced by 3+ source files — highest-impact files for any path changes:

| Path | Note |
|---|---|
| `/images/hub-official-logo.svg` | Nav, Footer, layout, MobileOverlay |
| `/images/hero/hero-1.jpg` | HeroSlideshow, layout metadata, map-projects |
| `/images/blog/ubc-musqueam-crosswalk/featured.jpg` | InstagramStrip, map-projects, blog posts |
| `/images/projects/_placeholder.svg` | map-projects.ts (13+ entries) |
| `/images/blog/decorative-crosswalks-community-identity/featured.jpg` | blog + now AI blog fallback |

> Any rename/move of these files requires updating all N referencing files simultaneously.

---

*Re-run this audit after any further cleanup:*
```bash
node scripts/audit-images.mjs
```
