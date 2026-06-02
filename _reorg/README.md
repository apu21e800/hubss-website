# Overnight Image Reorg — Vernon

Three deliverables in this folder:

## 1. `curator/index.html` — open in any browser
Browse all 1,911 hubss-website images, mark Keep/Skip per shot. Filters by category, sub-folder, quality bucket (A/B/C/D), pick state. Bulk actions: "Keep all A", "Skip all D". Keyboard: K=keep, S=skip, U=undo, arrows to move. Picks persist in localStorage. Click "Export picks.json" when done.

Open it directly — **no server needed**. Picks aren't pushed anywhere; they only exist in your browser until you Export.

## 2. `reports/` — raw inventory data
- `inventory.json` — every image (path, MD5, dims, code-references found)
- `inventory_scored.json` — same + quality bucket + category
- `inventory_summary.json` — top-line stats + duplicate groups

## 3. Decisions I made overnight
- **Duplicates left in place.** 722 dup files across 325 md5 groups, but they're INTENTIONAL — same crosswalk shot lives in applications/, products/, and blog/featured.jpg. Dedup-by-delete would break pages. The dup map is in `reports/inventory_summary.json` if you ever want to refactor to a single source via Sanity.
- **Catalogue v30/v31 untouched** — they're the catalogue session's content (232 files, 0 code refs from website code).
- **Reorg is light-touch** — moved only obvious cruft (Next.js template SVGs) to `_archive/`. No content moves while Sanity might be referencing things by URL.

## Numbers
- 1,911 images, 2.3 GB
- 251 A-bucket, 932 B-bucket, 550 C-bucket, 178 D-bucket
- Top folders: applications/ 841, products/ 654, catalogue/ 232, brand/assets 89, blog 54
- 1,738 not directly referenced in code (most likely loaded via Sanity URLs)

## To regenerate
```bash
cd hubss-website
python _reorg/scripts/inventory.py    # ~30s, rebuilds inventory.json
python _reorg/scripts/annotate.py     # scores + categorizes
python _reorg/scripts/build_curator.py  # rebuilds curator/index.html
```
