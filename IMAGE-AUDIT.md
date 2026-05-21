# Image Path Audit

**Generated:** 2026-05-16  
**Tool:** `scripts/audit-images.mjs`  
**Scope:** All `.ts/.tsx/.mdx` source files scanned for `/images/...` path literals

---

## Summary

| Metric | Count |
|---|---|
| Total unique image paths referenced in code | 163 |
| Valid paths (file exists) | 161 |
| **Broken paths (file missing)** | **2** |
| Files in `/public/images/` not referenced by any literal | 1,510 |
| Paths referenced by 3+ source files | 62 |

> ⚠️ The 1,510 "orphan" files are **mostly NOT truly orphaned** — they are gallery images referenced via the dynamic `gallery()` helper in `lib/products.ts` and `lib/applications.ts`. That helper generates paths like `` `/images/products/${dir}/${slug}-${n.padStart(2,'0')}.jpg` `` at runtime, which the static string scanner cannot detect. The true orphan count (files that will never be served) is likely a few dozen, not 1,510. Block B should re-run this audit with gallery path expansion to get an accurate count.

---

## Broken Paths — Fix Required (Block B)

These 2 paths are referenced in source but the files do not exist:

| Path | Referenced in | Action |
|---|---|---|
| `/images/products/streetbond/streetbond-${n}.jpg` | `lib/products.ts` | Template literal captured as literal by scanner — not a real broken path. The actual generated paths (streetbond-80.jpg, etc.) resolve correctly. **False positive — no action needed.** |
| `/images/blog/default.jpg` | `app/api/blog/generate/route.ts` | Fallback image for AI-generated blog posts. File does not exist. **Block B: add a real fallback image here.** |

**True broken paths requiring a fix: 1** (`/images/blog/default.jpg`)

---

## Orphan Analysis by Directory

Files in `/public/images/` with no matching string literal in source:

| Directory | File count | Likely reason |
|---|---|---|
| `/images/products/traffic-patterns-xd/` | 141 | Gallery images — referenced dynamically via `gallery()` helper |
| `/images/applications/parks-paths/` | 140 | Gallery images — same |
| `/images/applications/commercial-spaces/` | 114 | Gallery images — same |
| `/images/applications/crosswalks/` | 110 | Gallery images — same |
| `/images/products/streetbond/` | 107 | Gallery images — some referenced, bulk are dynamic |
| `/images/products/streetprint/` | 89 | Gallery images — same |
| `/images/products/traffic-patterns/` | 84 | Gallery images — same |
| `/images/products/decomark/` | 77 | Gallery images — same |
| `/images/applications/public-spaces/` | 65 | Gallery images — same |
| `/images/assets/logos/` | 35 | Logo files — some may be unused manufacturer logos |
| `/images/assets/installation-images/` | 34 | Legacy catalog exports — possibly unused (see PROJECT-IMAGE-AUDIT.md) |
| All others | ~318 | Mix of dynamic gallery refs and potentially unused files |

**Conclusion:** Most orphans are dynamically generated gallery references. Block B should:
1. Expand the `gallery()` helper calls to enumerate all generated paths
2. Re-run orphan detection with the full expanded list
3. True orphans will be files not in any expanded gallery + not in any literal

---

## Multi-Referenced Paths (62 total)

Images referenced by 3+ source files — highest-impact files for any path changes:

| Path | Used by N files |
|---|---|
| `/images/hub-official-logo.svg` | Nav.tsx, Footer.tsx, layout.tsx, MobileOverlay… |
| `/images/hero/hero-1.jpg` | HeroSlideshow, layout metadata, map-projects… |
| `/images/blog/ubc-musqueam-crosswalk/featured.jpg` | InstagramStrip, map-projects.ts, blog posts |
| `/images/blog/decorative-crosswalk-commercial-drive/featured.jpg` | InstagramStrip, map-projects.ts |
| `/images/textures/stamped-asphalt-texture.webp` | products/page.tsx, applications/[slug]/page.tsx |
| `/images/projects/_placeholder.svg` | map-projects.ts (13+ entries) |

> Any rename/move of these files requires updating all N referencing files simultaneously.

---

## Sanity Migration Impact

The migration script (`scripts/migrate-to-sanity.ts`) only migrates image paths that exist as valid string literals. Specifically:
- ✅ Hero image URLs (`product.imageUrl`, `application.imageUrl`) — all validated before migration
- ✅ Blog post `featuredImage` paths — validated from MDX frontmatter
- ✅ Map project `images[]` paths — validated (uses `_placeholder.svg` for pending entries)
- ❌ Gallery arrays from `gallery()` helper — **NOT migrated in this PR** because paths are dynamically generated and not enumerable as literals. Block B will handle this by expanding the helper before migration.

---

## Recommendations for Block B (P1 after this PR merges)

1. **Fix the one real broken path:** add `/public/images/blog/default.jpg` (generic blog fallback)
2. **Re-run audit with gallery expansion** to get the true orphan count
3. **Audit `/images/assets/logos/`** — 35 files, many may be manufacturer logos never shown on site
4. **Audit `/images/assets/installation-images/`** — 34 legacy catalog PNG exports (19–29MB each), likely unserved
5. **Normalize naming conventions** — mixed cases, spaces in filenames (`ChipFill & AggreFill/`), brand-named dirs
6. **Complete Sanity gallery migration** once `gallery()` paths are enumerated

---

*Re-run this audit after Block B cleanup:*
```bash
node scripts/audit-images.mjs
```
