"""Stage C — rasterize the rebuilt print PDF's TRIM area to v51 webp flipbook.
Renders the TrimBox (5x5, excludes bleed + crop marks) at 1800x1800 to match the
existing v50 pipeline. Output: public/catalogue/v51/page-XXX.webp
"""
import fitz
from PIL import Image
from pathlib import Path
import io

WT = Path(r"C:\Users\cleve\Based_Agency\_wt-catalogue-finishing")
PDF = WT / "catalog-print-build" / "output" / "HUBSS_Catalogue_2026_v50.pdf"
OUT = WT / "public" / "catalogue" / "v52"  # v52 = 6x6 trim (v51 was 5x5)
OUT.mkdir(parents=True, exist_ok=True)
SIZE = 1800

doc = fitz.open(PDF)
print(f"pages: {doc.page_count}")
for i in range(doc.page_count):
    page = doc[i]
    tb = page.trimbox  # 5x5 trim, no bleed/marks
    if tb.is_empty or tb.width < 10:
        tb = page.rect   # fallback to mediabox
    zoom = SIZE / tb.width
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=tb, colorspace=fitz.csRGB)
    img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    if img.size != (SIZE, SIZE):
        img = img.resize((SIZE, SIZE), Image.LANCZOS)
    img.save(OUT / f"page-{i+1:03d}.webp", "WEBP", quality=88, method=6)
    if (i + 1) % 20 == 0:
        print(f"  {i+1}/{doc.page_count}")
print("done ->", OUT)
print("count:", len(list(OUT.glob('page-*.webp'))))
