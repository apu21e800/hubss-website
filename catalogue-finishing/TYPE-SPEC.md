# TYPE-SPEC — HUBSS Catalogue 2026 (final ramp)

One modular scale for the 6×6″ trim, ratio ≈1.2, anchored to the book's
dominant existing sizes so snapping is a correction, not a redesign. Sizes
in **figma units** (× 0.96 = pt). Inter only (v48 lock; body = Medium,
never Regular). The 5.5-figma (5.3 pt) wide-tracked caps micro system is
**RATIFIED** and untouched. DuraTherm dark page remains the benchmark.

## The ramp

| Token | figma | pt | weight | leading (ratio) | tracking | case | role |
|---|---|---|---|---|---|---|---|
| `micro` | 5.5 | 5.3 | Bold caps | — single line | +2.4 pt (as established) | CAPS | folios, footers, copyright, signatures, micro-labels — **ratified** |
| `label` | 6.5 | 6.2 | Bold caps | — | +2.4 pt | CAPS | spec-grid labels, card meta/foot, family labels, stat labels, step numbers, chip data tier |
| `eyebrow` | 7.5 | 7.2 | Bold caps | — | +2.4 pt | CAPS | every page eyebrow, photo captions-in-caps |
| `caps-display` | 8.5 | 8.2 | Bold caps | — | +2.4 pt | CAPS | SECTION N, cover subline, closing triplet, Notes |
| `caption` | 7.8 | 7.5 | SemiBold / Medium | ×1.30 | 0 | mixed | chip names (SemiBold), colour-spread footer, stat subs — **7.5 pt floor** |
| `spec` | 8.6 | 8.3 | Bold (values) / Medium (compact prose) | ×1.30 | 0 | mixed | spec-grid values, ref-table desc, contact details, CTA pill |
| `body` | 10 | 9.6 | Medium | ×1.40 (14) | 0 | mixed | ALL running body — **9 pt floor** ✓ |
| `subhead` | 12.5 | 12.0 | Medium grey | ×1.25 (15.6) | 0 | mixed | spec-page subhead, why-stats subtitle, DPS-navy line |
| `title-s` | 14.5 | 13.9 | Bold | ×1.10 | −0.3 | mixed | process steps, DPS captions, installer phone, Thank-you |
| `title` | 17.5 | 16.8 | Bold | ×1.10 | −0.35 | mixed | contact hubss.com, story names |
| `title-l` | 21 | 20.2 | Bold | ×1.10 | −0.4 | mixed | product wordmark, contact names, "Speak with HUB.", why-proof headline, smallest display bucket, **DPS/spread photo captions (final pass — promoted from 14.5 for arm's-length reading across a 12″ open spread; white, on the overlay scrim)** |
| `display-s` | 26 | 25.0 | Bold | ×1.08 | −0.5 | mixed | spread/process/ref/installer/field-notes heads, **card headlines (was 27/29)** |
| `display` | 31 | 29.8 | Bold | ×1.08 | −0.6 | mixed | cover, TOC head, why-stats head, statement, service triplet |
| `display-l` | 37 | 35.5 | Bold | ×1.08 | −0.7 | mixed | manifesto h1, why-stats numbers, display bucket 3 |
| `display-xl` | 42 | 40.3 | Bold | ×1.08 | −0.8 | mixed | L&L head, closing head, hub-numbers |
| `display-2xl` | 52 | 49.9 | Bold | ×1.08 | −1.0 | mixed | section titles (incl. **Network, was 44**), "Built to outlast.", display bucket 1 |
| `hero` | 60 | 57.6 | Bold | single line | −1.2 | mixed | cities "10" |

Ratio check: 6.5→7.8→(8.6 half-step, role+weight distinct)→10→12.5→14.5→
17.5→21→26→31→37→(42 ¾-step)→52→60 ≈ 1.2 throughout (two documented
half-steps where roles also change weight/colour).

**display_size_for buckets:** 56/44/34/26/22 → **52/42/37/26/21**.
**Card head_size:** app 27 / project 29 → **26 both** (one card voice).
**Product tagline shrink:** start 21, floor 14.5.

## Leading bands (mandate)

- display ≥ `title-s`: **×1.05–1.12** → implemented ×1.08–1.10
- `subhead`: **×1.25**
- `body`: **×1.40** (10 → 14)
- `spec`/`caption`: **×1.30**
- caps tiers: single-line, no leading

## Weights

Bold (700 TTF via weight≥600) = display + all caps + spec values.
SemiBold (500) = chip names ONLY (micro-titles).
Medium (<500) = all body/subhead/caption prose. Regular never (v48).

## Tracking

- Caps: +2.4 pt charSpace as established (ratified voice).
- Body/subhead/caption/spec: 0.
- Display: −0.3 … −1.2 by tier (≈ −1…−2% above ~24 pt; Inter needs it).
  Section titles relax from −1.6 to −1.0 (was −3.2%, outside the band).

## Measure (45–75 cpl)

- spec-page body frame 394 → **360** figma (≈ 73 cpl at `body`)
- card body frame 372 → **364** (≈ 74 cpl)
- standfirsts are single-line by design; process desc ≈ 50 cpl ✓

## Vertical rhythm

Within an archetype the gaps are code constants (already identical on
every page of that archetype). Spec page becomes **wrap-safe**: body start
derives from the actual subhead bottom + fixed `GAP_SUBHEAD_BODY` (12
figma); a 2-line subhead can no longer collide. Logo guard unchanged
(bottom-anchored above the spec rule).

## Standfirst rule

A one-line grey intro **over a grid** (colour spread, process strip) =
`body` 10/14 Medium grey — hierarchy holds via the 16-figma gap to display
and the grid below. A subhead **over running body** (spec pages) = `subhead`
12.5 — ≥2.4 pt above body. Kills the 9.5/10/10.5/11 mush without near-ties.

## Micro-typography

- Apostrophes → U+2019 ’ (render-side normalization in draw_text_block /
  tracked_caps — content files untouched).
- `(c) 2026` (back cover) → `© 2026`; quiet-mark `" . "` → `" · "`.
- Ranges already en-dash (30–50, 45–60 ✓); multiplication already ×
  (4× ✓) — verified in audit.
- Number+unit binding: `no_orphan` (NBSP-binding of final words) is the
  established mechanism; spec values never wrap (short, max_w 185).
- Tabular figures: ReportLab's text engine does no OpenType shaping, so
  true `tnum` is unavailable — numeric columns are right-aligned instead
  (TOC ✓); spec grids are label-over-value, not columnar. Documented
  limitation.

## Overlay legibility (final pass — supersedes the v45 no-scrim preference)

Vernon's call: text on photos was getting lost; legibility wins. ONE
treatment book-wide — `overlay_scrim(c, top_fy)` in final_catalog.py: a navy
(12,18,32) gradient that smoothsteps transparent→constant floor over a 78-figma
transition, then holds the floor through the trim, so every overlay line sits
in the constant-floor zone (the old opener wash ramped to the very bottom,
leaving text at the weak midpoint — why titles still failed). Floor alpha **188**
tuned via `overlay_contrast.py` to clear **4.5:1 worst-case-local with ~6:1
margin even over a white photo**, while the photo reads brightly above the
transition. Applied to: cover masthead, all 5 section dividers, network divider,
all 5 DPS photo captions, process-strip recto. The cover also keeps a light
(0.32) full-frame vignette to seat the top-left white logo. L&L CTA pill text →
navy ink on orange (2.7:1 white → 6.8:1 navy). **Bar met at every overlay
instance — nothing "left for the eye."**

## Floors (stand)

`body` ≥ 9 pt ✓ (9.6) · captions ≥ 7.5 pt ✓ (`caption` = 7.5) · `micro`
5.3 pt folio/label exception **ratified** · `label` 6.2 pt = the same
ratified wide-tracked caps furniture family.
