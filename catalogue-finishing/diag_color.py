"""Diagnose the wash: source RGB vs the pipeline's naive-CMYK round-trip."""
from PIL import Image, ImageStat
from pathlib import Path
import colorsys

WT = Path(r"C:\Users\cleve\Based_Agency\_wt-catalogue-finishing")
SAMPLES = [
    WT / "public/images/applications/community-branding/community-branding-09.jpg",
    WT / "public/images/applications/splash-pads/splash-pads-01.jpg",
    WT / "public/images/products/streetbond/streetbond-112.jpg",
]

def sat(im):
    im = im.convert("RGB").resize((80, 80))
    s = 0.0
    for r, g, b in im.getdata():
        s += colorsys.rgb_to_hsv(r/255, g/255, b/255)[1]
    return s / (80*80)

for p in SAMPLES:
    if not p.exists():
        print(f"(skip, missing) {p.name}"); continue
    src = Image.open(p).convert("RGB")
    # what the pipeline bakes: RGB->CMYK (naive) then back to RGB for screen/flipbook
    naive = src.convert("CMYK").convert("RGB")
    s_src, s_naive = sat(src), sat(naive)
    print(f"{p.name:34} saturation  src={s_src:.3f}  naive-CMYK={s_naive:.3f}  "
          f"drop={100*(1-s_naive/s_src):.0f}%")
