# Catalogue 2026 — Figma ↔ Print/Flipbook parity diff (pre-Doug review)

Full systematic comparison: every Figma-plugin page vs the corresponding print/flipbook page. Read-only audit (5 parallel agents, one per section). No fixes applied — awaiting Vern's greenlight.

## The two artifacts (this is the crux)
- **FLIPBOOK** = the rasterized ReportLab **print PDF** (`final_catalog.py`), served on staging at `/catalogue` (v58, **140 pages**). **This is what Doug reviews.** It is NOT generated from the Figma plugin.
- **FIGMA PLUGIN** = a separate, editable reconstruction (`generate_plugin.py`, **116 frames**). Vern's working/editing artifact. **Not on staging, not Doug's deliverable.** Its divergences do not affect what Doug sees.

---

## PART 1 — Flipbook QA (Doug's deliverable): **140 / 140 PASS**
Every one of the 140 v58 pages was viewed. **Zero defects** — no contrast failures, clipped text, wrong/missing images, broken layouts, or typos. Section dividers, L&L, back cover, products, applications, projects, installers, reference all render clean. **The flipbook is production-grade and review-ready as-is.**

---

## PART 2 — Figma-plugin divergences (the editing artifact only)
The plugin is built from an older (v50–v52) baseline and never fully re-synced after the print's v55–v58 refinements. Stale items found:

| # | Plugin page(s) | Plugin (stale) | Flipbook/print (correct) | Severity |
|---|---|---|---|---|
| 1 | §4 Colour spread | **absent** | StreetBond palette (37 chips) + StreetBondSR (11 SR + 3 cycle-lane, SRI/R/E) — flipbook p28–29 | HIGH (structural, +2pp) |
| 2 | §7 Process strip | **absent** | "Reheat. Stamp. Coat." 3-step + result recto — flipbook p20–21 | HIGH (structural, +2pp) |
| 3 | Applications (frames 37–53) | 1 combined frame/app; **no location tag, no counter** | each app is a **2-page spread** (full photo + card), with location tags + "Application NN" — flipbook p42–76 | HIGH (structural, +17pp) |
| 4 | Installers (frames 100–103) | navy header band, inverted scheme | **clean white page**, orange top-left label, photo, dark text | HIGH |
| 5 | Cities (frame 108) | "**500+**" hero stat, single-column, 1-line subtitle | "**10**" hero, **two-column** list, 2-line subtitle "10 provinces and territories…" | HIGH |
| 6 | Closing "Built to outlast" (frame 105) | "…**500+ municipalities**" | "…**10 provinces**" | HIGH (stale data) |
| 7 | Technical (frame 107) | "At a Glance." 24pt, **10 products** | "The systems." 28pt, **11 products** (incl. AirMark) | MED |
| 8 | StreetBond spec (frame 17) | no logo | streetbond® logo, lower-right | MED |
| 9 | Statement (frame 8) eyebrow | "THE SURFACE UNDERFOOT" (to verify) | "POSITION" | MED |
| 10 | Contact (frame 110) | "Speak with HUB." 22pt | 28pt | LOW |
| 11 | Mod-4 "Notes" spacers | absent | present | LOW (structural) |

**Confirmed in-parity (no action):** front matter (cover, half-title, TOC, manifesto, why, numbers), all 11 product hero/spec pairs, all 20 project hero/story pairs, the editorial spreads (The Work / In the Field / Across Canada / Every Mark / Built to Last / The Mark), Field Notes, and — from this week's fixes — section dividers, Lunch & Learn, back cover.

**Structural gap total = 24 pages** (§4 = 2, §7 = 2, application full-image pages = 17, mod-4 spacers ≈ 3) → 116 → 140.

---

## PART 3 — Gap to "review-ready", and cloud-safe vs heavy

**If Doug reviews the flipbook (the staging artifact): the gap is ZERO. It's ready now.** Nothing to build.

**If we also want the Figma file to be a complete editable master matching the book**, the work is:
- (A) Port §4 colour spread + §7 process strip into the plugin — 4 frames.
- (B) Split applications into 2-page spreads + add location tags + "Application NN" counter — ~17 frames.
- (C) Re-sync the stale builders: cities (500+→10, two-column), closing data (500+→10 provinces), installers (white layout), technical (The systems./11), statement eyebrow, contact size, StreetBond logo — ~7 builders.
- (D) Mod-4 "Notes" spacers to land exactly 140.

**Cloud-safe assessment: 100% of the above is cloud-safe** — it's all plugin generation (`generate_plugin.py`) + headless harness verification + `git push`, exactly like this week's fixes. **Nothing heavy.** The one heavy operation (rebuilding the PDF + rasterizing the flipbook) is **NOT required** — the flipbook is already correct, so the print pipeline doesn't need to run. Zero machine-crash risk.

---

## PART 4 — Recommendation
1. **Point Doug at the flipbook** — `https://hubss-website-git-staging-based-agency.vercel.app/catalogue` (v58, 140pp, gated behind the `showCatalogue` flag which is ON on staging). It's complete, current, and flawless today.
2. **Treat the Figma parity work (A–D) as a separate, optional track** for the editable master — all cloud-safe — to do if/when Vern wants the Figma file to be a 1:1 editable twin. Not a blocker for Doug.

Awaiting greenlight before any fixes. Production untouched (branch only).
