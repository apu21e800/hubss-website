"""Stage C — optimized RGB web PDF with live hyperlinks, synced page-for-page
to the print master. Rasterizes the TRIM area to RGB JPEG (~1100px) and adds
real link annotations (L&L CTA, tel:, mailto:, hubss.com).

Print master stays the vector live-text CMYK build; this is the lightweight,
RGB, shareable download that the /catalogue Download button serves.
"""
import fitz, io
from PIL import Image
from pathlib import Path

WT = Path(r"C:\Users\cleve\Based_Agency\_wt-catalogue-finishing")
SRC = WT / "catalog-print-build" / "output" / "HUBSS_Catalogue_2026_v50.pdf"
OUT = WT / "public" / "catalogue" / "HUBSS-Catalogue-2026.pdf"

PX = 1100          # raster long edge per page
PT = 432.0         # 6" trim page (web; bleed/marks excluded)
S = PT / 450.0     # figma(0-450) -> trim points

def R(x0, y0, x1, y1):
    return fitz.Rect(x0 * S, y0 * S, x1 * S, y1 * S)

# page_index (0-based) -> list of (rect, uri)
LINKS = {
    108: [(R(20, 360, 246, 388), "https://hubss.com/lunch-learn")],          # p109 L&L CTA
    109: [(R(30, 188, 150, 206), "mailto:cleve.stordy@hubss.com"),           # p110 contact
          (R(242, 188, 362, 206), "mailto:doug.bain@hubss.com"),
          (R(30, 206, 140, 222), "tel:+16043098212"),
          (R(242, 206, 352, 222), "tel:+14165409287"),
          (R(30, 268, 140, 290), "https://hubss.com")],
    115: [(R(0, 0, 450, 450), "https://hubss.com")],                          # p116 back cover
}

src = fitz.open(SRC)
out = fitz.open()
for i in range(src.page_count):
    pg = src[i]
    tb = pg.trimbox if (not pg.trimbox.is_empty and pg.trimbox.width > 10) else pg.rect
    zoom = PX / tb.width
    pix = pg.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=tb, colorspace=fitz.csRGB)
    img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    buf = io.BytesIO(); img.save(buf, "JPEG", quality=86, optimize=True)
    npg = out.new_page(width=PT, height=PT)
    npg.insert_image(fitz.Rect(0, 0, PT, PT), stream=buf.getvalue())
    for rect, uri in LINKS.get(i, []):
        npg.insert_link({"kind": fitz.LINK_URI, "from": rect, "uri": uri})

out.set_metadata({"title": "HUB Surface Systems — Catalogue 2026",
                  "author": "HUB Surface Systems", "subject": "Decorative Pavement Solutions"})
out.save(OUT, garbage=4, deflate=True)
print(f"wrote {OUT.name}  ({OUT.stat().st_size/1e6:.1f} MB, {out.page_count} pp)")
nlinks = sum(len(v) for v in LINKS.values())
print(f"live links embedded: {nlinks}")
