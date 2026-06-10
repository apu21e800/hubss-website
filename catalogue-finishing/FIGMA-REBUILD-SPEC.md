# Figma Rebuild Spec — HUBSS Catalogue 2026

**Why this is a spec, not a file:** this environment has **no Figma write capability**
(only read tools). Per the dispatch, the deliverable is a componentised spec Vernon
executes in Figma. **Also note:** the production source of truth is now the ReportLab
pipeline (`catalog-print-build/src/`), which already emits the live-text CMYK print PDF,
the web PDF, and the flipbook. A Figma rebuild is **optional** — useful only if Vernon
wants a designer-editable master. It is **not on the critical path to ship.**

Everything below mirrors the live design system in `final_catalog.py` so a Figma
rebuild renders 1:1 with the printed book.

## Document setup
- **Page size:** **6.25 × 6.25 in (450 × 450 pt) = 6″ trim + 0.125″ bleed all sides.** *(6×6 confirmed by Vernon, 2026-06.)*
- **Safe area:** 0.25″ inside trim. **Export:** CMYK (print) + RGB (screen).
- **Grid:** single-column, 28 fig-unit left margin (design space is 0–450 units → ×0.96 = pt, i.e. 1 design unit = 0.96 pt at 6″ trim).

## Color tokens (CMYK)
| Token | C M Y K | Use |
|---|---|---|
| HUBSS_ORANGE | 0 / 65 / 100 / 0 | accents, eyebrows, rules, CTAs (~#F97316) |
| HUBSS_NAVY | 65 / 45 / 20 / 92 | dark header bands, contact/back panels |
| TEXT_DARK | 0 / 0 / 0 / 90 (K) | headlines/body on white |
| TEXT_MID | 0 / 0 / 0 / 55 | subheads |
| TEXT_FAINT | 0 / 0 / 0 / 30 | labels, rules, folios |
| WHITE | 0 / 0 / 0 / 0 | page background (cream is BANNED) |

## Type ramp — **Inter** (Bold ≥600 / SemiBold ≥500 / Regular). No Helvetica, no Roboto.
- Display H1: 44–64 pt, tracking −1.2 to −2.0 (section openers 64; manifesto 36; product/title 22–44 size-to-fit)
- Tagline (product/project hero): 18–22 pt bold, tracking −0.4
- Body: 8–10.5 pt, leading ~1.5×; Eyebrows/labels: 5.5–8.5 pt ALL-CAPS, tracking +2.4
- Folio: 6.5 pt caps, bottom-right

## Components / variants (build once, instance everywhere)
1. **Section Divider** — full-bleed photo + orange dot + "SECTION X" caps + orange rule + 64pt white title.
2. **Product Hero** — photo top ~64% + orange dot + product name caps + dark serif-weight tagline.
3. **Product Spec** — navy header band (82u) with category eyebrow + wordmark + orange dash; title (size-to-fit) + subhead + body + 4-cell spec grid + centered uses caps.
4. **Project Hero** — photo + project-name eyebrow + dark title + location/product caps footer.
5. **Project Story** — photo top ~63% (or none → text-only, e.g. Kitchener p84) + product eyebrow + name + loc·product + story body.
6. **Application** — photo top ~63% + orange eyebrow + 18pt tagline + 8.5pt body + hubss.com.
7. **Installer Card** — "HUB CERTIFIED INSTALLER" + logo slot + photo + region + name (28pt) + body + orange rule + phone/url.
8. **Editorial DPS** (2-page) — left = full-bleed photo no type; right = photo + white eyebrow + caption (or navy "statement" variant).
9. **Reference table / Cities / Contact / Lunch&Learn / Back cover** — one-off layouts (see `final_catalog.py` page_* fns for exact coordinates).

## Page sequence (116 pp — match exactly; TOC: Products 11 · Applications 36 · Projects 56 · Network 99 · Reference 106 · L&L 109 · Contact 110)
Cover · half-title · TOC · manifesto · why-stats · why-proof · hub-numbers · statement ·
DPS "The Work" · **Products** (11 × hero+spec) · DPS "In the Field" · **Applications** (17 ×1) ·
DPS "Across Canada" · **Projects** (20 × hero+story, DPS "Every Mark" mid-section) ·
**Network** (4 installers) · DPS "Built to Last" · **Reference** · tech-table · cities · L&L · contact · field-notes · closing DPS · back cover.

## Image manifest
Use `IMAGE-MANIFEST.csv` (per-page → source path) for exact placements, post-swap. Link
images at full res; keep faces/logos/headlines out of the gutter on spreads.
