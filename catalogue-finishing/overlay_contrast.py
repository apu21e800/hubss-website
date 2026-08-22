"""Overlay-contrast measurement — the FINAL-PASS bar: every text-on-photo
line >= 4.5:1 effective contrast, WORST-CASE local sampling under the text
block (not page median).

Method per white text line:
- merge spans per (block,line) -> one bbox
- render page 1.5x, dilate bbox 4px
- background sample = pixels in the dilated bbox with sRGB luma < 235
  (excludes the white glyph cores + AA fringe)
- worst-case = 95th-percentile luma of that sample (robust to outliers)
- ratio = 1.05 / (linear(worst) + 0.05)   [text assumed white, L=1.0]

Pages with dark/navy page fills (L&L, numbers, closing navy, back) pass
trivially and are included for completeness.

Usage: python overlay_contrast.py [pdf]
"""
import sys
from pathlib import Path
import fitz

sys.stdout.reconfigure(encoding="utf-8")

WT = Path(__file__).resolve().parents[1]
PDF = Path(sys.argv[1]) if len(sys.argv) > 1 else \
    WT / "catalog-print-build" / "output" / "HUBSS_Catalogue_2026_v50.pdf"

Z = 1.5  # render zoom


def srgb_to_linear(v):
    v = v / 255.0
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4


def is_white(cint):
    r, g, b = (cint >> 16) & 255, (cint >> 8) & 255, cint & 255
    return min(r, g, b) >= 0xE8


doc = fitz.open(PDF)
fails, passes = [], []
for pno in range(doc.page_count):
    page = doc[pno]
    d = page.get_text("dict")
    lines = []
    for block in d["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            white_spans = [sp for sp in line["spans"]
                           if sp["text"].strip() and is_white(sp.get("color", 0))]
            if not white_spans:
                continue
            r = fitz.Rect(white_spans[0]["bbox"])
            for sp in white_spans[1:]:
                r |= fitz.Rect(sp["bbox"])
            txt = "".join(sp["text"] for sp in white_spans).strip()
            if txt:
                lines.append((r, txt))
    if not lines:
        continue
    from PIL import Image, ImageFilter
    pm = page.get_pixmap(matrix=fitz.Matrix(Z, Z), colorspace=fitz.csGRAY)
    full = Image.frombytes("L", (pm.width, pm.height), pm.samples)
    for r, txt in lines:
        # True-background sampling: exclude the white glyph strokes AND their
        # antialiasing halos via a dilated glyph mask, then sample what's left.
        # (Naive percentile-of-non-white catches the white->bg AA ramp and
        # misreports even solid-navy-backed text as ~160. The dilated mask
        # removes the fringe so 'background' is the actual tone behind the text.)
        pad = 3
        x0 = max(0, int(r.x0 * Z) - pad); y0 = max(0, int(r.y0 * Z) - pad)
        x1 = min(pm.width, int(round(r.x1 * Z)) + pad)
        y1 = min(pm.height, int(round(r.y1 * Z)) + pad)
        crop = full.crop((x0, y0, x1, y1))
        glyph = crop.point(lambda v: 255 if v > 170 else 0)      # stroke cores+upper AA
        glyph = glyph.filter(ImageFilter.MaxFilter(5))            # dilate ~2px -> eat halo
        gpx = glyph.load(); cpx = crop.load()
        cw, ch = crop.size
        vals = [cpx[xx, yy] for yy in range(ch) for xx in range(cw) if gpx[xx, yy] == 0]
        if len(vals) < 12:   # text fills region (rare) -> sample a ring just outside
            vals = [cpx[xx, yy] for yy in range(ch) for xx in range(cw)
                    if (xx < pad or xx >= cw - pad or yy < pad or yy >= ch - pad)]
        vals.sort()
        worst = vals[min(len(vals) - 1, int(len(vals) * 0.95))] if vals else 255
        ratio = 1.05 / (srgb_to_linear(worst) + 0.05)
        dark_frac = sum(1 for v in vals if v < 70) / len(vals) if vals else 0
        backing = "panel" if dark_frac >= 0.70 else "photo"
        rec = (pno + 1, txt[:44], worst, round(ratio, 2), backing)
        (passes if ratio >= 4.5 else fails).append(rec)

print(f"== overlay contrast (worst-case local, bar 4.5:1) — {PDF.name} ==")
print(f"white text lines measured: {len(passes) + len(fails)}  |  PASS {len(passes)}  FAIL {len(fails)}\n")
if fails:
    print("FAILURES (backing: photo = real target; panel = on solid fill, investigate if any):")
    for p, t, wv, r, bk in sorted(fails):
        print(f"  p{p:3d}  {r:>5}:1  bg95={wv:3d}  [{bk:5}]  '{t}'")
else:
    print("ALL PASS.")
