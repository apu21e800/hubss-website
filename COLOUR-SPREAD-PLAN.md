# §4 — The Colour System Spread · Build Plan

Reinstates the old catalogue's most-used spec content (old pp14–15 colour charts), modernized to the new book's design language. Source of truth for names/groupings/values: **`COLOUR-MANIFEST.csv`** (51 colours: 17 Traditional + 20 Signature + 11 Solar-Reflective + 3 Cycle-Lane).

---

## 1. Placement & pagination

**Insertion point (content-anchored, version-robust):** immediately **after the StreetBondSR spec page**, **before the DuraTherm name page**. This forms a true facing spread (even-left / odd-right) and keeps the StreetBond colour story adjacent to StreetBondSR.

| | v54 (this branch, 136 pp) | v50 (prompt, 116 pp) |
|---|---|---|
| StreetBondSR spec page | p25 | p25 |
| **NEW Colour Page A** | **p26 (left)** | **p26 (left)** |
| **NEW Colour Page B** | **p27 (right)** | **p27 (right)** |
| DuraTherm name page | p26 → **p28** | (shifts +2) |
| New total | 136 → **138** | 116 → **118** |

Inserting an **even** count (2 pages) preserves every downstream archetype's left/right parity (product name = even/left, spec = odd/right). 

**Repagination required after insertion (v54):** every page ≥ 26 shifts +2. Update:
- TOC (p3): Applications 37→39, Projects 75→77, Network 118→120, Reference 125→127, Lunch & Learn 128→130, Contact 129→131.
- Product reference table (v54 p126 → p128; = prompt's "p107").
- Flipbook `manifest.json` page array + alt array (136 → 138 entries), version bump (next section).
- Any internal cross-references / running section tabs.

---

## 2. Page A — "The colour system." (37 standard colours)

**Typography (reuse existing archetype tokens):**
- Orange overline label: `STREETBOND COLOUR`
- Display headline: **The colour system.** (Roboto Condensed family — do not change)
- One-line subhead: *"37 standard colours in two families. Full custom Pantone matching."*
- Optional small streetbond® lockup in the header (the colour system is StreetBond's) — light-bg variant only.

**Grid:** flat **vector** chips (NOT photographed texture — old texture photos print muddy), small corner radius, exact official name beneath each in the book's grey caption style. No abbreviations, no renames, no invented colours.

- **Traditional (17):** San Diego Buff · Taupe · Burnt Sienna · Nutmeg · Terra Cotta · Bedrock · Brick · Brown Suede · Sunset Blush · Concrete Gray · Marigold · Pewter · Sierra · Hunter Green · Black · Slate · Granite
- **Signature (20):** Sandy Beige · Driftwood · Butterscotch · Pumpkin Spice · Chestnut Brown · Mocha · Mustard · Down To Earth · Paprika · Avocado · Sea Foam · Aqua · Sage · Truffle · Patriot Blue · Cobalt Blue · Gun Metal · Merlot · Smokey Mauve · Graphite

**Suggested layout:** two labelled blocks ("TRADITIONAL 17" / "SIGNATURE 20"). A 6-column grid gives 3 rows (17) + 4 rows (20) at a chip size that keeps names ≥ 7.5 pt. Uniform chip size across both families.

**Footer line (mandatory, verbatim):**
> *"Printed colours are representative — request physical samples at a Lunch & Learn."*

---

## 3. Page B — Solar-Reflective + Cycle-Lane

**Header:** overline `STREETBOND SR` · headline e.g. **"Cooler by design."** · one plain-language line: *"Higher SRI = a cooler surface underfoot."*

**SR colours (11) — chip + SRI under each, with Reflectance/Emittance in a compact data row (print verbatim — measured figures):**

| Colour | SRI | Reflectance | Emittance |
|---|---|---|---|
| SR Sandstone | 36 | 0.32 | 0.94 |
| SR Khaki | 37 | 0.33 | 0.94 |
| SR Irish Cream | 50 | 0.43 | 0.94 |
| SR White ⌑hairline keyline | 73 | 0.60 | 0.94 |
| SR Fawn | 35 | 0.31 | 0.93 |
| SR Sun Baked Clay | 52 | 0.44 | 0.95 |
| SR Brownstone | 31 | 0.30 | 0.90 |
| SR Terra Cotta | 33 | 0.31 | 0.92 |
| SR Evergreen | 33 | 0.32 | 0.88 |
| SR Safety Blue | 33 | 0.30 | 0.93 |
| SR Slate | 34 | 0.31 | 0.91 |

**Standards line (one compressed line — NOT the old footnote wall):**
> *"Reflectance ASTM C1549 · emittance ASTM C1371 · SRI ASTM E1980."*

**LEED claim (soft + accurate):**
> *"SR colourants can contribute to LEED heat-island reduction credits."*
> 🟡 Verify current **LEED v4 / v4.1** credit name before printing any credit number. Do NOT use the old "LEED 7.1 non-roof."

**Cycle-Lane greens (3) — own labelled band:**
- CL Shamrock Green (`#78c83c`) · CL Celtic Green (`#329c3d`) · CL Emerald Green (`#067c50`)

---

## 4. Colour-fidelity rules (enforce)

1. **Print = supplier CMYK.** Manifest hexes are screen/flipbook reference only, sampled from the official chart. Source the supplier's CMYK formula per colourant; **never auto-convert the hexes** to CMYK.
2. **SR White** (`#f9f6ec`) — hairline keyline so it doesn't vanish on the page.
3. **Sage / Driftwood** sampled identically (`#c2b7a5`). Confirm against physical samples or supplier values; correct if they differ. (Flagged in ISSUES.md.)
4. **Name fidelity** — exact official names from the manifest, no edits.

---

## 5. Consistency updates triggered by this spread

- **Product reference table** (v54 p126): colour counts/family names must read "37 standard (17 Traditional + 20 Signature), 11 Solar-Reflective, 3 Cycle-Lane."
- **StreetBond page (p17)** and **StreetBondSR page (p25)**: any colour-count mention must agree with the spread.
- **Flipbook alt text**: add real descriptive alt for both new pages (e.g., "…page 26: The colour system — 37 standard StreetBond colours in Traditional and Signature families").

---

## 6. Outputs (when built)

- Figma: two new component-driven pages with **live text** + vector chip components (one chip component, colour as a variant/property).
- Print PDF: chips use supplier CMYK; near-black backgrounds C40 M25 Y0 K100.
- Flipbook: re-export both pages to `/catalogue/v{NN+1}/` (version bump), update `manifest.json`.
