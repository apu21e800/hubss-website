"""§8 full-book QA sweep — typography minimums, overflow/overlap, overlay
contrast candidates. Reads the live-text print master; reports, never edits.

Checks:
1. TYPE SIZES  — histogram of every span size (pt); flags spans under the
   master-prompt floors (body ≥ 9 pt, captions/labels ≥ 7.5 pt) split into
   "micro-type system" (the book's established 5.3–7.2 pt tracked-caps
   furniture: eyebrows, folios, footers, chip data) vs body-class text.
2. SAFE AREA   — spans whose bbox crosses the 0.25" safe margin inside trim.
3. OVERLAP     — same-page span pairs from different blocks whose bboxes
   intersect by more than 30% of the smaller bbox (suspect collisions).
4. CONTRAST    — for spans drawn in white over photography, samples the
   rendered page around the span and flags bright backgrounds (heuristic
   pre-filter for visual review, not a verdict).

Usage: python qa_sweep.py [pdf]   (default: the print master)
"""
import sys
from pathlib import Path
from collections import Counter, defaultdict
import fitz

WT = Path(__file__).resolve().parents[1]
PDF = Path(sys.argv[1]) if len(sys.argv) > 1 else \
    WT / "catalog-print-build" / "output" / "HUBSS_Catalogue_2026_v50.pdf"

doc = fitz.open(PDF)
BLEED = 9.0          # 0.125" in pt
TRIM = 432.0         # 6"
SAFE = 18.0          # 0.25"
SAFE_BOX = fitz.Rect(BLEED + SAFE, BLEED + SAFE, BLEED + TRIM - SAFE, BLEED + TRIM - SAFE)

size_hist = Counter()
size_pages = defaultdict(set)
safe_violations = []
overlaps = []
contrast_flags = []

for pno in range(doc.page_count):
    page = doc[pno]
    d = page.get_text("dict")
    spans = []
    for bi, block in enumerate(d["blocks"]):
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            for sp in line["spans"]:
                txt = sp["text"].strip()
                if not txt:
                    continue
                spans.append((bi, fitz.Rect(sp["bbox"]), sp))
                size_hist[round(sp["size"], 1)] += 1
                size_pages[round(sp["size"], 1)].add(pno + 1)

    # 2 — safe area (ignore deliberate full-bleed none; text never bleeds here)
    for bi, r, sp in spans:
        if not SAFE_BOX.contains(r):
            inter = r & SAFE_BOX
            out_frac = 1 - (inter.get_area() / r.get_area() if r.get_area() else 0)
            if out_frac > 0.02:  # >2% of the span outside safe
                safe_violations.append((pno + 1, sp["text"][:40], round(sp["size"], 1),
                                        [round(v) for v in r]))

    # 3 — cross-block overlap
    for i in range(len(spans)):
        for j in range(i + 1, len(spans)):
            bi, ra, sa = spans[i]
            bj, rb, sb = spans[j]
            if bi == bj:
                continue
            inter = ra & rb
            if inter.is_empty:
                continue
            smaller = min(ra.get_area(), rb.get_area())
            if smaller and inter.get_area() / smaller > 0.30:
                overlaps.append((pno + 1, sa["text"][:25], sb["text"][:25]))

    # 4 — white-on-photo contrast candidates
    # true white/near-white only — comparing the packed int catches orange
    # (0xF97316 > 0xF0F0F0), which is the brand standard on white pages
    def _is_whiteish(cint):
        r8, g8, b8 = (cint >> 16) & 255, (cint >> 8) & 255, cint & 255
        return min(r8, g8, b8) >= 0xE8
    whiteish = [(r, sp) for bi, r, sp in spans if _is_whiteish(sp.get("color", 0))]
    if whiteish:
        pix = page.get_pixmap(matrix=fitz.Matrix(0.5, 0.5), colorspace=fitz.csGRAY)
        import statistics
        for r, sp in whiteish:
            x0, y0 = int(r.x0 * 0.5), int(r.y0 * 0.5)
            x1, y1 = int(r.x1 * 0.5), int(r.y1 * 0.5)
            vals = []
            for yy in range(max(0, y0), min(pix.height, y1)):
                for xx in range(max(0, x0), min(pix.width, x1)):
                    vals.append(pix.pixel(xx, yy)[0] if isinstance(pix.pixel(xx, yy), (tuple, list)) else pix.pixel(xx, yy))
            if vals and statistics.median(vals) > 150:  # bright region under white text
                contrast_flags.append((pno + 1, sp["text"][:40], round(statistics.median(vals))))

print(f"== {PDF.name}: {doc.page_count} pp ==\n")
print("== TYPE SIZE HISTOGRAM (pt @ 6x6 trim) ==")
for s in sorted(size_hist):
    pages = sorted(size_pages[s])
    pg = f"pp {pages[0]}–{pages[-1]}" if len(pages) > 6 else "p " + ",".join(map(str, pages))
    flag = ""
    if s < 7.2:
        flag = "  << micro-type (established furniture)" if s >= 5.0 else "  << BELOW 5pt — INVESTIGATE"
    elif s < 8.6:
        flag = "  <- caption class (7.5pt floor: " + ("OK" if s >= 7.4 else "UNDER") + ")"
    print(f"  {s:5.1f} pt × {size_hist[s]:4d}   {pg}{flag}")

print(f"\n== SAFE-AREA VIOLATIONS ({len(safe_violations)}) ==")
for p, t, s, r in safe_violations[:30]:
    print(f"  p{p}: '{t}' {s}pt bbox={r}")
print(f"\n== CROSS-BLOCK OVERLAPS ({len(overlaps)}) ==")
for p, a, b in overlaps[:30]:
    print(f"  p{p}: '{a}' × '{b}'")
print(f"\n== WHITE-ON-BRIGHT CONTRAST CANDIDATES ({len(contrast_flags)}) ==")
for p, t, m in contrast_flags[:30]:
    print(f"  p{p}: '{t}' (median bg {m}/255)")
print("\ndone.")
