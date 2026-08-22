# TYPE-AUDIT — HUBSS Catalogue 2026 (BEFORE state)

Extracted from pipeline source (`type_audit.py`: AST scan of every
`draw_text_block` / `tracked_caps` call) + the rendered master's span ground
truth. Full machine output in `_type_audit_raw.md`. Sizes in **figma units**
(× 0.96 = pt at 6×6″ trim).

## Headline numbers

- **38 distinct static sizes** + 4 dynamic mechanisms (display_size_for
  buckets 56/44/34/26/22 · product-tagline shrink 22→14 · card head_size
  27/29 · per-call `size` passthrough)
- **8 caps tiers** (5.5 / 6.0 / 6.5 / 7.0 / 7.5 / 8.0 / 8.5 / 9.0) doing ~4
  jobs — same wide-tracked Bold caps voice scattered across half-point steps
- **Leading ratios from 1.25 (auto) to 1.64** for the same body role:
  card body 10.5/16 = 1.52 · manifesto 10/16 = 1.60 · statement 11/18 = 1.64
  · spec body 9.5/14 = 1.47 · L&L 11/17 = 1.55 — body is five different
  voices
- **Fonts rendered:** Inter-Bold ×4,334 · Inter-Medium ×351 · Inter-SemiBold
  ×53 (weights 800 AND 600 both map to Bold via pick_font)

## The mush (near-duplicate clusters the spec collapses)

| Cluster | Members (figma) | Verdict |
|---|---|---|
| micro-caps | 5.5 · 5.8 · 6.0 · 6.2 · 6.5 · 6.8 · 7.0 | 5.5 ratified; rest → 6.5 label tier (chip names → 7.8 caption floor) |
| eyebrows | 5.5 (spec page!) · 7.0 · 7.5 · 8.0 · 8.5 · 9.0 | one eyebrow = **7.5**; section/cover display-caps = **8.5** |
| small text | 7.0 · 7.5 · 8.0 · 8.5 · 9.0 | captions **7.8** · spec values/compact **8.6** |
| body | 9.5 · 10 · 10.5 · 11 · 12 | one body = **10**, leading 14 (1.40) |
| subhead | 10.5/15 · 11/15 · 11/17 · 11/18 | one subhead = **12.5**, leading 15.6 (1.25) |
| title | 13 · 14 · 15 · 16 · 17 · 18 · 19 · 20 · 22 · 24 | **14.5 / 17.5 / 21 / 26** |
| display | 26 · 27 · 28 · 29 · 30 · 32 · 34 · 36 | **26 / 31 / 37** |
| display-XL | 40 · 42 · 44 | **42** (Network 44 → **52**: it IS a section title — currently the only divider at a different size) |
| hero | 50 · 52 · 60 | **52 / 60** |

## Notable single defects

1. **Spec-page category eyebrow at 5.5** while every other page eyebrow is
   7.0–7.5 — the same role at half the optical size, 11 pages.
2. **Network divider title 44** vs its four siblings at 50 — inconsistent
   section hierarchy.
3. **`"(c) 2026 HUB Surface Systems"`** literal on the back cover — should
   be ©. Quiet-mark line `"Established 1994 . Coast to Coast"` — stray
   " . " for the book's " · " convention. Straight apostrophes render
   throughout (`city's`, `it's`) — Inter has proper U+2019.
4. **Body measure over spec**: spec body 9.5 across 394 figma ≈ 86 cpl;
   card body 10.5 across 372 ≈ 74 cpl. Mandate is 45–75.
5. **Card headline leading** head_size+4 → 1.15/1.14 — display band is
   1.05–1.12.
6. **Spec-page subhead→body gap is a fixed +32** that a 2-line subhead
   overruns — flow must derive from actual subhead bottom (wrap-safe).

## Dead code paths (inventoried, snapped, but NOT rendered at 140pp)

`page_application` · `page_project_hero` · `page_project_story` ·
`page_service_promise` — superseded by the asymmetric photo+card layout
(build() never calls them). Updated to the ramp for consistency if revived;
excluded from rendered-role counts.

## Per-archetype hierarchy (BEFORE) — see `_type_audit_raw.md` §A for the
full 183-row table

| Archetype | Current ladder (figma · weight · leading) |
|---|---|
| Cover | 8.0 caps → 30 ·800 ·auto |
| TOC | 7.5 caps → 32 ·800 → rows 10 ·600 ·auto |
| Manifesto | 7.5 caps → 36 ·800 → body 10 ·400 ·16 → 6.5 caps |
| Why stats | 7.5 caps → 32 ·800 → sub 11 ·400 ·15 → num 34 → label 7.0 caps → 7.5 ·400 ·10 |
| Section divider | 8.5 caps → 50 ·800 ·54 ·(−1.6) |
| Network divider | 7.5 caps → **44** ·800 ·46 |
| Product hero | 7.5 caps → tagline 22→14 ·400 ·size+4 |
| Product spec | **5.5 caps** → 22 ·800 → title 56/44/34/26/22 → sub 10.5 ·400 ·15 → body 9.5 ·400 ·14 → labels 6.0 caps → values 8.5 ·600 ·11 → uses 6.5 caps |
| Colour spread | 7.5 caps → 26 ·800 → standfirst 9.5 ·400 ·14 → labels 6.5 caps → names 6.2/6.8 ·500/600 → data 5.8 ·500 → footer 7.0 ·500 |
| Process strip | 7.5 caps → 26 ·800 → standfirst 9.5 → num 7.0 caps → step 13 ·800 → desc 8.5 ·400 ·12.5 |
| App/Project card | 7.5 caps → 27/29 ·800 ·(+4) → meta 6.5 caps → body 10.5 ·400 ·16 → foot 6.0 caps |
| Installer | 6.5 caps ×2 → 28 ·800 ·32 → body 9.5 ·400 ·14.5 → 6.0 caps → phone 15 / url 13 ·800 |
| Reference table | 7.0 caps → 28 ·800 → name 10 ·800 → key 6.5 caps → desc 8.5 ·400 |
| Cities | 60 ·800 → 9 ·400 ·13 ×2 → 5.5 caps → 7 ·400 → rows 8 ·400 |
| Lunch & Learn | 7.0 caps → 42×2 ·800 ·46 → body 11 ·400 ·17 → CTA 8.5 ·800 → 6.0 caps → bullets 9.5 ·600 ·13 |
| Contact | 5.5 caps → 22 ·800 → body 10 ·400 ·15 → 5.5 caps → names 20 ·800 → 8.5 ·400 → 7 ·400 → 16 ·800 → 8 ·400 ·12 → © 5.5 ·400 |
| Back cover | 8.5 ·400 → 11 ·600 → 6.0 caps → 7.0 ·400 ×2 → (c) 6.5 ·400 |
| Closing manifesto | 7.5 caps → 42×2 ·800 → body 11 ·500 ·18 → 8.0 caps ×3 → 5.5 caps |
| Hub numbers | 6.5 caps → 5.5 caps → num 40 ·800 → label 7.0 caps → sub 7.5 ·400 ·11 |
| Statement | 6.5 caps → 28×2 ·800 ·34 → body 11 ·400 ·18 → 5.5 caps |
| DPS right (photo) | 6.5 caps → caption 14 ·800 ·18 |
| DPS right (navy) | 6.0 caps → 52×2 ·800 → 7.5 ·400 ·11 → 12 ·400 → 8.5 ·400 ·13 → 7.5 caps |
| Field notes / spacer | 6.5/9.0 caps → 24 ·800 → 8.5 ·400 ·13 → 5.5 caps |
| Quiet mark | 7.5 caps → 6.0 caps → 14 ·400 |
