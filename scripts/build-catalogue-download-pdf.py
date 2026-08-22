"""Assemble the auto-detected newest public/catalogue/v{NN}/ webp pages into
a single web-distributable PDF the /catalogue Download button can serve.

Targets ~10–30 MB total. Source webps are 1800×1800 q88; we re-encode each
page as JPEG at quality 78 and embed into a multi-page PDF. The press-ready
124+MB PDF is NOT what we serve to web visitors.

Output: public/catalogue/HUBSS-Catalogue-2026.pdf  (overwrites)

Run:
    python scripts/build-catalogue-download-pdf.py
"""
from __future__ import annotations
import io
import re
from pathlib import Path
from PIL import Image

HERE   = Path(__file__).resolve().parent.parent
PAGES  = HERE / "public" / "catalogue"
OUT    = PAGES / "HUBSS-Catalogue-2026.pdf"

VERSION_RE = re.compile(r"^v(\d+)$")
PAGE_RE    = re.compile(r"^page-(\d{3})\.webp$")

# JPEG re-encode target — balances file size against fidelity. ~250-400 KB
# per page at JPEG q78 from a 1800-px webp source.
JPEG_QUALITY = 78
# Cap page side for the PDF — keeps DPI honest and file size sane.
PDF_MAX_SIDE = 1500


def _latest_version_dir() -> Path:
    if not PAGES.is_dir():
        raise SystemExit(f"Pages root missing: {PAGES}")
    versions = []
    for d in PAGES.iterdir():
        if not d.is_dir():
            continue
        m = VERSION_RE.match(d.name)
        if m:
            versions.append((int(m.group(1)), d))
    if not versions:
        raise SystemExit("No v{N}/ folders found under public/catalogue — render pages first.")
    versions.sort()
    return versions[-1][1]


def main():
    src = _latest_version_dir()
    print(f"source: {src}")

    pages = sorted(p for p in src.iterdir() if PAGE_RE.match(p.name))
    if not pages:
        raise SystemExit(f"No page-NNN.webp files in {src}")

    images = []
    for p in pages:
        with Image.open(p) as im:
            im = im.convert("RGB")
            # Downscale to PDF_MAX_SIDE if needed
            if max(im.size) > PDF_MAX_SIDE:
                scale = PDF_MAX_SIDE / max(im.size)
                im = im.resize((int(im.size[0] * scale), int(im.size[1] * scale)), Image.LANCZOS)
            images.append(im.copy())

    first, rest = images[0], images[1:]
    first.save(
        OUT,
        format="PDF",
        save_all=True,
        append_images=rest,
        # JPEG embedding inside the PDF for compactness
        optimize=True,
        quality=JPEG_QUALITY,
        # 96 DPI is fine for a web download viewed on screen
        resolution=96.0,
    )
    size_mb = OUT.stat().st_size / 1024 / 1024
    print(f"wrote: {OUT.relative_to(HERE)}  ({len(pages)} pages, {size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
