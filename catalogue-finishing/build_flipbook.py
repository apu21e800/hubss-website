"""Stage C — rasterize the rebuilt print PDF's TRIM area to the webp flipbook.
Renders the TrimBox (6x6, excludes bleed + crop marks) at 1800x1800 to match the
existing pipeline. Output: public/catalogue/v{NN}/page-XXX.webp
"""
import fitz
from PIL import Image
from pathlib import Path
import io

# Resolve the repo root from this script's location so the pipeline runs in
# any worktree (was hardcoded to _wt-catalogue-finishing for the v54 run).
WT = Path(__file__).resolve().parents[1]
PDF = WT / "catalog-print-build" / "output" / "HUBSS_Catalogue_2026_v50.pdf"
OUT = WT / "public" / "catalogue" / "v58"  # v58 = overlay legibility pass + 4 photo calls
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
    img.save(OUT / f"page-{i+1:03d}.webp", "WEBP", quality=92, method=6)
    if (i + 1) % 20 == 0:
        print(f"  {i+1}/{doc.page_count}")
print("done ->", OUT)
print("count:", len(list(OUT.glob('page-*.webp'))))

# Stable, version-agnostic cover thumbnail for site chrome (mega menu +
# Resources card). Referencing /catalogue/cover.webp means those links
# never go stale on a version bump (they previously hardcoded v31/v50 and
# 404'd after each bump). Lives one level up so it's not inside the vNN dir.
import shutil
_cover = OUT.parent / "cover.webp"
shutil.copyfile(OUT / "page-001.webp", _cover)
print("cover ->", _cover)

# Alt text (per-page, from the PDF text layer) + route manifest. The /catalogue
# route reads public/catalogue/manifest.json (one static file) instead of
# fs.readdir'ing the dir — that kept Next from tracing the whole multi-version
# webp tree into the serverless function (>250MB limit).
import json, re
alt = []
for i in range(doc.page_count):
    t = " ".join(re.sub(r"(?<=\b\w) (?=\w\b)", "", doc[i].get_text()).split())
    s = t[:150].strip() or "Full-bleed photographic spread"
    alt.append(f"HUBSS Catalogue 2026, page {i+1} of {doc.page_count}: {s}")
json.dump(alt, open(OUT / "alt.json", "w", encoding="utf-8"), ensure_ascii=False)
manifest = {
    "version": OUT.name,
    "pages": [f"/catalogue/{OUT.name}/page-{i+1:03d}.webp" for i in range(doc.page_count)],
    "alt": alt,
}
json.dump(manifest, open(OUT.parent / "manifest.json", "w", encoding="utf-8"), ensure_ascii=False)
print("wrote alt.json + manifest.json")
