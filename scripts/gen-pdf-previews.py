"""
Render every page of every PDF in public/docs/ and public/resources/flyers/
to WebP previews.

Why images and not an <iframe>: Android Chrome and in-app webviews (LinkedIn,
Facebook, Instagram) do not render PDFs inline, so the iframe preview showed a
blank panel on exactly the devices a municipal specifier is most likely to use.
Images render everywhere, with no runtime dependency.

The product flyers (public/resources/flyers) were not in the walk until
30 Oct 2026, so on a phone their preview fell back to the iframe: blank on
Android, the first page zoomed in on an iPhone (Vern: "they are zoomed in").
After `npm run flyers` rebuilds them, re-run this with --only resources/flyers.

Same toolchain as scripts/render-catalogue-pages.py (PyMuPDF + Pillow). Output
is committed to git because Vercel's Node build image has no Python.

Run from the repo root:
    python scripts/gen-pdf-previews.py                           # everything
    python scripts/gen-pdf-previews.py --only resources/flyers   # one folder
--only (repeatable, a folder under public/) renders just that folder's PDFs
and keeps every other entry in the manifest as it is.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path

import fitz                    # PyMuPDF
from PIL import Image

ROOT     = Path(__file__).resolve().parent.parent
PUBLIC   = ROOT / "public"
# The folders under public/ whose PDFs get previews.
SOURCES  = ["docs", "resources/flyers"]
OUT_DIR  = PUBLIC / "doc-previews"
MANIFEST = ROOT / "lib" / "pdf-previews.json"


def stem_for(rel: str) -> str:
    """docs/Foo/Bar.pdf -> Foo/Bar (as it always was); resources/flyers/X.pdf -> resources/flyers/X."""
    s = rel[: -len(".pdf")]
    return s[len("docs/"):] if s.startswith("docs/") else s

# Every page. Was 3 ("cover + 2 — enough to judge the document before
# downloading"), which is a fine rule for a two-page spec sheet and a bad one
# for the documents people actually browse: the StreetPrint Template Catalog
# showed 3 of 23 template patterns, the DuraTherm Design Manual 3 of 20. A
# client opened the template catalogue expecting to page through the patterns
# and got three. All 286 pages across all 67 documents costs ~9 MB, and the
# modal lazy-loads everything after the first page.
MAX_PAGES = None    # None = all pages
LONG_EDGE = 1000    # px
QUALITY   = 75      # WebP


def render_pdf(pdf_path: Path) -> dict | None:
    rel = pdf_path.relative_to(PUBLIC)                   # docs/Foo/Bar.pdf
    key = "/" + rel.as_posix()                           # /docs/Foo/Bar.pdf
    stem = stem_for(rel.as_posix())                      # Foo/Bar
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
    for i in range(total if MAX_PAGES is None else min(MAX_PAGES, total)):
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
    args = sys.argv[1:]
    only = [args[i + 1].strip("/") for i, a in enumerate(args) if a == "--only" and i + 1 < len(args)]
    if "--only" in args and not only:
        print("--only needs a folder under public/, e.g. --only resources/flyers")
        return 1
    folders = only or SOURCES
    for f in folders:
        if not (PUBLIC / f).is_dir():
            print("No public/%s directory found." % f)
            return 1
    # A full run rebuilds the manifest; --only keeps every entry outside its
    # folders and replaces the ones inside (so a removed PDF loses its entry).
    manifest: dict[str, dict] = {}
    if only and MANIFEST.exists():
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
        for f in only:
            for k in [k for k in manifest if k.startswith("/" + f + "/")]:
                del manifest[k]
    pdfs = sorted(p for f in folders for p in (PUBLIC / f).rglob("*.pdf"))
    print("Found %d PDFs in %s" % (len(pdfs), ", ".join("public/" + f for f in folders)))
    ok = 0
    for p in pdfs:
        res = render_pdf(p)
        if res:
            manifest["/" + p.relative_to(PUBLIC).as_posix()] = res
            ok += 1
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=1, sort_keys=True) + "\n", encoding="utf-8")
    print("Rendered previews for %d/%d PDFs -> %s" % (ok, len(pdfs), MANIFEST.relative_to(ROOT)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
