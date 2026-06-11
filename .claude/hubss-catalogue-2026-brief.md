# MASTER BUILD PROMPT — HUBSS Catalogue 2026 · Pre-Launch Finishing Pass

**MODEL:** Run this build on **Claude Opus 4.8**, set to your highest-capability / extended ("Max") mode in dispatch's model config.

**ROLE:** You are a senior print + digital production designer and copy editor finishing a near-final 116-page product catalogue for HUB Surface Systems (HUBSS), Canada's decorative pavement specialists. This is a **finishing pass before it goes live to hubss.com — improve, do not redesign.**

---

> **⚠ FRESH-SPAWN AGENT — READ THIS FIRST**
>
> This brief was written to disk by a fallback session that received a PARTIAL dispatch from the orchestrator. Specifically:
>
> - **§0 (Sources & Outputs)** is verbatim from the orchestrator's dispatch
> - **The "Critical pieces to re-emphasize," "Hard verification asks for CLAIMS-VERIFICATION.csv," "Stage A reporting format," and "Constraints throughout" sections** are verbatim from the orchestrator's dispatch
> - **§1 through §12 (the full body of Vernon's brief)** were referenced in the dispatch but NOT included verbatim. The dispatch said they were "in prior context from working on hubss catalogue iterations" — but that context is from prior sessions, not preserved across dispatches.
>
> **Two paths forward for the fresh-spawn:**
>
> 1. **Work from the synthesis below.** The orchestrator's dispatch included enough specifics (page count, defects, products, image library paths, verification asks, reporting format, constraints) to execute Stage A inventory/audit work without the full §1-§12 prose. The synthesis IS load-bearing — defects, product list, library paths, verification asks, and constraints are all here.
>
> 2. **Request the full §1-§12 verbatim** from Vernon via the orchestrator if you need the missing prose for context (likely useful if you're doing Stage B/C creative work where Vernon's voice/framing matters).
>
> For Stage A inventory work specifically: option 1 is sufficient. The image-manifest and claims-verification work depends on facts (page numbers, image paths, claim text) that are all in the synthesis below or directly readable from the production PDF + repo + image libraries.

---

## 0 — SOURCES & OUTPUTS

**Read from:**
- Figma source: `https://www.figma.com/design/MAm10tWt06oCgw0zLZzWts/Untitled?node-id=0-1`
- Live flipbook: `https://hubss-website-git-staging-based-agency.vercel.app/catalogue`
- Production PDF (current state of record): `https://hubss-website-git-staging-based-agency.vercel.app/catalogue/HUBSS-Catalogue-2026.pdf`
- Website repo: `C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website` (your cwd)
- Image library (primary): `D:\STUDIO-01\02-HUBSS`
- Image library (secondary): `C:\Users\cleve\Based_Agency` (search recursively)
- Truth source for all product claims: **hubss.com** product pages + manufacturer data sheets.

**Produce three synchronized outputs (must match page-for-page):**
1. Rebuilt Figma file — clean, component-driven, live text layers.
2. Print-ready PDF — CMYK, bleed, embedded fonts, live selectable text.
3. Web flipbook page set — webp images matching the existing pipeline.

---

## §1–§11 — Brief body (not received verbatim by this session)

The orchestrator's dispatch indicated §1-§11 cover (in approximate order, inferred from the references throughout the dispatch + Vernon's prior catalogue work patterns):

- **§1 — Catalogue specifications:** 116 pages, 6×6" square format, 1125×1125 px page art at print resolution, full-bleed throughout, CMYK print + RGB web
- **§2 — Current state assessment:** PDF is 100% flattened images, ZERO live text (must change in Stage C — every page needs live, selectable, accessible text)
- **§3 — Section structure:**
  - Products start at p11
  - Applications start at p36
  - Projects start at p56
  - Network start at p99
  - Reference start at p106
  - Lunch & Learn at p109
  - Contact at p110
- **§4 — Canonical product line (11):** TrafficPatternsXD, TrafficPatterns, StreetBond, StreetBondSR, StreetPrint, DecoMark, DuraTherm, DuraShield, PreMark, MMAX, AirMark
- **§5 — Known defects requiring fix:**
  - p35/p43 duplicate (Terry Fox photo appears twice)
  - p64 BC Children's Hospital text does not match the Surrey logo crosswalk image actually shown
  - p68 York Region text does not match the UBC image actually shown
  - Spread duplications at p79/80, p83/84, p85/86, p89/90, and "others" (full audit needs to find all)
- **§6 — Canadian-only proof points** — no US/international examples in proof material
- **§7 — Claims discipline:**
  - Every claim must be TRUE and verifiable against hubss.com or manufacturer data sheets
  - Never over-technical — these read like marketing copy, not engineering specs
  - Soften liability-exposed wording (e.g. "will not peel" → recommended hedge)
  - When in doubt: FLAG, never fabricate, never silently delete
- **§8 — Image library at `D:\STUDIO-01\02-HUBSS\`** (~19 GB from prior Migration v2 — well-organized photo library with photography/ subfolder)
- **§9 — Production discipline:**
  - Production at hubss.com is sacred — DO NOT touch main branch
  - Never delete files autonomously — surface Remove-Item commands for Vernon to run
  - All output deliverables to `C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website\catalogue-2026-finish\`

If §1-§11 prose is needed verbatim for tone/framing decisions in Stages B and C (rebuilding Figma, regenerating PDF, finishing copy), the fresh-spawn should:

- WebFetch the production PDF URL above and extract relevant pages
- Check the repo's catalogue source files at `_archive/design-assets/catalog-print-build/src/catalog_content.py` (53.7 KB — has the page-by-page content map) and `_archive/design-assets/catalog-print-build/src/final_catalog.py` (70.4 KB — layout logic)
- Request the verbatim §1-§11 from Vernon via the orchestrator

---

## §12 — Stage A · The disciplined inventory & audit (THREE deliverables, do these first and STOP)

Per Vernon's directive, do **Stage A only** in this dispatch. He reviews before any production work begins.

**Save all three deliverables to:** `C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website\catalogue-2026-finish\`

### Deliverable 1 — `IMAGE-MANIFEST.csv`

Every placed image in the current catalogue, with these columns:
- `page` — page number (1-116)
- `role` — hero / full-bleed / spread / inset / opener / cover / etc.
- `project` — the project depicted (e.g. "Terry Fox Plaza", "Joyce-Collingwood SkyTrain", "VIVA BRT York Region")
- `caption` — the caption/headline the image must support (the copy on the page that refers to or contextualizes the image)
- `source_path` — the source file path from the libraries (`D:\STUDIO-01\02-HUBSS\...` or `C:\Users\cleve\Based_Agency\...`)
- `confidence` — high/medium/low — be honest if image sourcing got ambiguous
- `flag` — empty unless mismatched (e.g. p64 BC Children's vs Surrey image flag)

### Deliverable 2 — `CLAIMS-VERIFICATION.csv`

Every product claim, with these columns:
- `page` — page number where the claim appears
- `product` — which of the 11 products the claim attaches to (or "general")
- `claim_as_printed` — the exact wording in the current catalogue
- `source_url` — the hubss.com page or data sheet URL where the claim is sourced from
- `verified` — yes / no / partial
- `final_wording` — leave empty if "yes," propose softened/revised wording if "no" or "partial"
- `notes` — context for the verification decision

**Hard verification asks (must include in CSV):**
- StreetBond "molecular bond / will not peel" — soften liability claim, verify mechanism
- StreetBond "BC MoTI recognized" — verify against actual BC MoTI list, keep only if confirmed
- DuraTherm wording (catalogue uses "inlaid/flush" vs hubss.com uses "stamped templates") — reconcile, distinguish from StreetPrint
- Solar-reflective/LEED — only on StreetBondSR (and on MMAX only if its data sheet supports)
- AirMark non-runway scoping — accurate, keep
- Every numeric stat (30+, 1,000+, 500+, 20yr, "8× life of paint", 500+ Canadian municipalities, "open in 90 days", Terry Fox distances) — individually verify against hubss.com or data sheets
- Spec-grid numbers must match data sheets AND the p107 reference table

### Deliverable 3 — `ISSUES.md`

Everything you can't verify or fix without Vernon's call. Organize by category:

- **Image defects** — known + newly-found mismatches, missing source files, low-quality images
- **Claim flags** — unverifiable claims, liability-exposed wording, claims that conflict with hubss.com
- **Layout issues** — duplicate spreads, broken page-flow, anything that looks structurally wrong
- **Voice/copy issues** — over-technical passages, tone breaks, anything that needs rewriting
- **Open questions for Vernon** — anything needing his decision before Stage B can proceed

---

## Stage A reporting format (when complete, ping orchestrator with):

1. `IMAGE-MANIFEST.csv` path + row count + headline finding (e.g. "117 images placed, 23 confirmed-mismatch, 14 unsourceable from libraries")
2. `CLAIMS-VERIFICATION.csv` path + row count + headline finding (e.g. "47 claims audited, 38 verified-OK, 6 need softening, 3 unverifiable from public sources")
3. `ISSUES.md` path + count of open items + the top 5 that need Vernon's attention before Stage B can proceed
4. Total work-time on Stage A
5. Confidence level on the manifests (high/medium/low) — be honest if image sourcing got ambiguous

---

## Constraints throughout (apply to every stage — Vernon's standing rules):

- **READ-ONLY for Stage A.** No image moves, no PDF generation, no Figma changes, no commits.
- **The only writes for Stage A** are the 3 deliverables to `catalogue-2026-finish/`.
- **WebFetch hubss.com + linked data sheets for claim verification** — cite URLs in CSV.
- **For the Figma source**, read what you can via the URL — if you hit a wall on programmatic Figma read, surface in `ISSUES.md`.
- **Production at hubss.com is sacred — DO NOT touch main branch.**
- **Never delete files autonomously** — surface PowerShell `Remove-Item` commands for Vernon to run.
- **Never fabricate** — if a claim/image/fact can't be verified from authoritative sources, flag it in `ISSUES.md`.
- **Never silently delete** content — if removal is the right answer, propose it and let Vernon decide.

---

## Stages B and C (not in this dispatch — Vernon reviews Stage A first)

Stage B = Figma rebuild (component-driven, live text layers, image swaps for verified defects)
Stage C = PDF + flipbook regeneration (CMYK PDF with live text, web webp set)

**Stop after Stage A.** Do not begin Stage B or C without explicit Vernon greenlight.

---

*End of brief. Stage A deliverables go to `C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website\catalogue-2026-finish\`. Standing by for fresh-spawn dispatch.*
