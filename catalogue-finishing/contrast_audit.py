"""Objective WCAG-contrast probe for text-on-image pages (v53 trim renders).
Measures the luminance of the bottom text band where white type sits, and the
contrast ratio of WHITE text against that region. Large text needs >=3:1, body >=4.5:1.
Approximate (band includes the text pixels themselves) — pairs with the visual audit.
"""
import colorsys
from PIL import Image
from pathlib import Path

V53 = Path(r"C:\Users\cleve\Based_Agency\_wt-catalogue-finishing\public\catalogue\v53")

SECTION_OPENERS = [11, 36, 56, 99, 106]
PRODUCT_HEROES = list(range(12, 34, 2))                # 12..32 even
PROJECT_HEROES = [57,59,61,63,65,67,69,71,73,75,79,81,83,85,87,89,91,93,95,97]
DPS_RIGHT = [10, 35, 55, 78, 101]

def rel_lum(rgb):
    def ch(c):
        c /= 255
        return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
    r,g,b = rgb
    return 0.2126*ch(r)+0.7152*ch(g)+0.0722*ch(b)

def band_lum(page, y0=0.74, y1=0.94, x0=0.05, x1=0.55):
    """Mean relative luminance of the bottom-left text band (fractions of page)."""
    p = V53/f"page-{page:03d}.webp"
    if not p.exists(): return None
    im = Image.open(p).convert("RGB")
    w,h = im.size
    crop = im.crop((int(x0*w),int(y0*h),int(x1*w),int(y1*h))).resize((60,40))
    px = list(crop.getdata())
    return sum(rel_lum(c) for c in px)/len(px)

def contrast(L_region, L_text=1.0):  # white text
    a,b = max(L_region,L_text), min(L_region,L_text)
    return (a+0.05)/(b+0.05)

def report(name, pages, big=True):
    thr = 3.0 if big else 4.5
    print(f"\n== {name} (white text; need >= {thr}:1) ==")
    fails=[]
    for pg in pages:
        L = band_lum(pg)
        if L is None: continue
        cr = contrast(L)
        flag = "" if cr>=thr else "  <-- FAIL"
        if cr < thr: fails.append(pg)
        print(f"  p{pg:3d}  band-lum={L:.3f}  white-contrast={cr:.2f}:1{flag}")
    return fails

allf=[]
allf+=report("Section openers (64pt title)", SECTION_OPENERS)
allf+=report("Product heroes (tagline+name)", PRODUCT_HEROES)
allf+=report("Project heroes (title+location)", PROJECT_HEROES)
allf+=report("DPS right (caption)", DPS_RIGHT)
print(f"\nPAGES FAILING WHITE-TEXT CONTRAST (<3:1): {sorted(set(allf))}")
