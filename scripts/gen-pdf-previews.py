"""
Render the first pages of every PDF in public/docs/ to WebP previews.

Why images and not an <iframe>: Android Chrome and in-app webviews (LinkedIn,
Facebook, Instagram) do not render PDFs inline, so the iframe preview showed a
blank panel on exactly the devices a municipal specifier is most likely to use.
Images render everywhere, with no runtime dependency.

Same toolchain as scripts/render-catalogue-pages.py (PyMuPDF + Pillow). Output
is committed to git because Vercel's Node build image has no Python.

Run from the repo root:
    python scripts/gen-pdf-previews.py
"""
from __future__ import annotations
import json
import sys
from pathlib import Path

import fitz                    # PyMuPDF
from PIL import Image

ROOT     = Path(__file__).resolve().parent.parent
DOCS_DIR = ROOT / "public" / "docs"
OUT_DIR  = ROOT / "public" / "doc-previews"
MANIFEST = ROOT / "lib" / "pdf-previews.json"

MAX_PAGES = 3       # cover + 2 — enough to judge the document before downloading
LONG_EDGE = 1000    # px
QUALITY   = 75      # WebP


def render_pdf(pdf_path: Path) -> dict | None:
    rel = pdf_path.relative_to(ROOT / "public")          # docs/Foo/Bar.pdf
    key = "/" + rel.as_posix()                           # /docs/Foo/Bar.pdf
    stem = rel.as_posix()[len("docs/"):-len(".pdf")]     # Foo/Bar
    out_sub = OUT_DIR / stem
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print("  SKIP (unreadable): " + key + " -> " + str(e))
        return None
    if doc.is_encrypted and not doc.authenticate(""):
        print("  SKIP (encrypted): " + key)
        doc.close()
        return None
    total = doc.page_count
    if total == 0:
        doc.close()
        return None
    out_sub.mkdir(parents=True, exist_ok=True)
    pages = []
    for i in range(min(MAX_PAGES, total)):
        page = doc.load_page(i)
        rect = page.rect
        longest = max(rect.width, rect.height) or 1
        zoom = LONG_EDGE / longest
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        name = "page-%03d.webp" % (i + 1)
        img.save(out_sub / name, "WEBP", quality=QUALITY, method=6)
        pages.append({"src": "/doc-previews/" + stem + "/" + name,
                      "w": pix.width, "h": pix.height})
    doc.close()
    return {"pages": pages, "total": total}


def main() -> int:
    if not DOCS_DIR.is_dir():
        print("No public/docs directory found.")
        return 1
    pdfs = sorted(DOCS_DIR.rglob("*.pdf"))
    print("Found %d PDFs" % len(pdfs))
    manifest: dict[str, dict] = {}
    ok = 0
    for p in pdfs:
        res = render_pdf(p)
        if res:
            manifest["/" + p.relative_to(ROOT / "public").as_posix()] = res
            ok += 1
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=1, sort_keys=True) + "\n", encoding="utf-8")
    print("Rendered previews for %d/%d PDFs -> %s" % (ok, len(pdfs), MANIFEST.relative_to(ROOT)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
