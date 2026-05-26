"""
Render HUBSS_Catalogue_2026_vNN.pdf -> trimmed WebP pages for the flipbook.

Auto-detects the newest vNN PDF in catalog-print-build/output/ and writes
to public/catalogue/v{NN}/page-NNN.webp (1200x1200, WebP q78).

Trim box: the page is 5.25" x 5.25" with 0.125" bleed each side.
We clip the central 5" x 5" trim so the flipbook shows the printed page
the way the reader will see it after the press cut — no crop marks,
no bleed slivers.

Run from the repo root:
    python scripts/render-catalogue-pages.py            # auto-detect latest
    python scripts/render-catalogue-pages.py path.pdf   # explicit PDF
"""
from __future__ import annotations
import io
import re
import sys
from pathlib import Path

import fitz                           # PyMuPDF
from PIL import Image

# -------------------------------------------------------------------------
HERE      = Path(__file__).resolve().parent.parent
PDF_DIR   = HERE / "catalog-print-build" / "output"
PAGES_DIR = HERE / "public" / "catalogue"

_VERSION_RE = re.compile(r"HUBSS_Catalogue_2026_v(\d+)\.pdf$")


def _detect_latest_pdf() -> Path:
    """Pick the highest-numbered HUBSS_Catalogue_2026_vNN.pdf."""
    candidates = []
    if PDF_DIR.is_dir():
        for p in PDF_DIR.glob("HUBSS_Catalogue_2026_v*.pdf"):
            m = _VERSION_RE.search(p.name)
            if m:
                candidates.append((int(m.group(1)), p))
    if not candidates:
        raise SystemExit(
            f"No HUBSS_Catalogue_2026_vNN.pdf found in {PDF_DIR}. "
            f"Pass a path explicitly: python scripts/render-catalogue-pages.py /path/to.pdf"
        )
    candidates.sort()
    return candidates[-1][1]


if len(sys.argv) > 1:
    PDF = Path(sys.argv[1])
else:
    PDF = _detect_latest_pdf()

_match = _VERSION_RE.search(PDF.name)
_version_tag = f"v{int(_match.group(1))}" if _match else "current"
OUT = PAGES_DIR / _version_tag

LONG_EDGE_PX  = 1200            # ~1200px long edge per spec
WEBP_QUALITY  = 78              # q78 — visibly lossless for catalogue art

# Page geometry (PDF points; 72 pt = 1 in):
BLEED_PT      = 9.0             # 0.125" * 72
TRIM_SIZE_PT  = 360.0           # 5"     * 72
TARGET_DPI    = LONG_EDGE_PX / 5.0   # = 240 DPI for a 1200-px-long 5-inch trim


def render() -> None:
    if not PDF.exists():
        raise SystemExit(f"PDF not found: {PDF}")
    OUT.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(str(PDF))
    print(f"source : {PDF.name}  ({doc.page_count} pages)")
    print(f"target : {OUT}")
    print(f"render : {LONG_EDGE_PX}px square @ q{WEBP_QUALITY} (~{TARGET_DPI:.0f} DPI)")
    print()

    # Mat scales 1 PDF point -> N image pixels at the requested DPI
    scale = TARGET_DPI / 72.0
    mat = fitz.Matrix(scale, scale)
    # TrimBox in PDF coordinates (origin top-left in PyMuPDF render space).
    # The catalogue's page is 5.25" x 5.25" with 0.125" bleed on every side,
    # so the trim box is BLEED_PT inside each edge.
    clip = fitz.Rect(BLEED_PT, BLEED_PT,
                     BLEED_PT + TRIM_SIZE_PT,
                     BLEED_PT + TRIM_SIZE_PT)

    total_bytes = 0
    for i in range(doc.page_count):
        page = doc[i]
        pix  = page.get_pixmap(matrix=mat, clip=clip, alpha=False)
        img  = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

        # Belt-and-suspenders: ensure exact 1200x1200 in case the clip
        # rounding produced 1199 or 1201 pixels.
        if img.size != (LONG_EDGE_PX, LONG_EDGE_PX):
            img = img.resize((LONG_EDGE_PX, LONG_EDGE_PX), Image.LANCZOS)

        out_path = OUT / f"page-{i + 1:03d}.webp"
        buf = io.BytesIO()
        img.save(buf, format="WEBP", quality=WEBP_QUALITY, method=6)
        out_path.write_bytes(buf.getvalue())
        total_bytes += len(buf.getvalue())
        if (i + 1) % 10 == 0 or i == doc.page_count - 1:
            print(f"  rendered {i + 1:3d}/{doc.page_count}  "
                  f"running total {total_bytes / 1024 / 1024:.1f} MB")

    n = doc.page_count
    doc.close()
    avg_kb = total_bytes / max(1, n) / 1024
    print()
    print(f"done. {n} pages -> {total_bytes / 1024 / 1024:.1f} MB total "
          f"(avg {avg_kb:.0f} KB/page)")


if __name__ == "__main__":
    render()
