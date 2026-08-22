"""§5 all-product-logos variant — MOCK ONLY for Doug's review. Not shipped.

Renders the product spec pages that HAVE a clean (non-TrafficScapes) official
logo in the libraries, with the logo placed in the standard §5 slot, plus one
control page (MMAX — no clean logo exists) showing the typographic treatment
the rest of the line keeps. Output: mocks/all-logos-variant/*.png + README.

Run from catalogue-finishing/:  python mock_all_logos.py
"""
import sys
from pathlib import Path

WT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(WT / "catalog-print-build"))

from reportlab.pdfgen.canvas import Canvas
from src.specs import PAGE_SIZE, BLEED, TRIM_W, TRIM_H
from src import final_catalog as FC
from src import catalog_content as CC
import fitz

LOGOS = WT / "public" / "images" / "assets" / "logos" / "product-logos"

# Mock registry: every product with a clean light-bg official mark.
# DecoMark / DuraTherm / TrafficPatterns exist ONLY as TrafficScapes-branded
# PDFs ("TS-*-Preferred_logo") — excluded by the standing no-EF decision.
FC.PRODUCT_LOGOS = {
    "StreetBond":   {"color": LOGOS / "streetbond-fullcolor-lightbg.png"},
    "StreetBondSR": {"color": LOGOS / "StreetBondSR" / "StreetBondSR-tags.png"},
    "StreetPrint":  {"color": LOGOS / "StreetPrint" / "large_StreetPrint_Logo.png"},
}

OUT = Path(__file__).resolve().parent / "mocks" / "all-logos-variant"
OUT.mkdir(parents=True, exist_ok=True)

render = ["StreetBond", "StreetBondSR", "StreetPrint", "MMAX"]  # MMAX = control
pdf = OUT / "_mock.pdf"
c = Canvas(str(pdf), pagesize=PAGE_SIZE)
c.setTrimBox((BLEED, BLEED, BLEED + TRIM_W, BLEED + TRIM_H))
for name in render:
    prod = next(p for p in CC.PRODUCTS if p["name"] == name)
    FC.page_product_spec(c, prod)
    c.showPage()
c.save()

d = fitz.open(pdf)
for i, name in enumerate(render):
    pg = d[i]
    tb = pg.trimbox
    pix = pg.get_pixmap(matrix=fitz.Matrix(1000 / tb.width, 1000 / tb.width),
                        clip=tb, colorspace=fitz.csRGB)
    suffix = "control-no-logo" if name == "MMAX" else "with-logo"
    pix.save(OUT / f"{name}-{suffix}.png")
    print("rendered", name)
d.close()
pdf.unlink()  # keep PNGs only (mock artifact, not a shipping PDF)
print("->", OUT)
