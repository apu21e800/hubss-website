"""
Bulk render all 72 catalog pages to a single CMYK PDF.

Reads the Figma structure dump at /tmp/figma_structure.json and renders each
page using a layout-driven approach: for image-heavy pages we faithfully
re-create the Figma composition; for text-heavy pages we keep Figma's
information architecture but apply our upgraded typography.

Each page is classified by its name + content profile then dispatched to a
renderer in src/page_types.py.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from reportlab.pdfgen.canvas import Canvas

from .specs import PAGE_SIZE
from . import page_marks as PM
from . import page_types as PT
from .layout_faithful import render_layout_faithful
from .photo_mapper import reset_rotation


ROOT = Path(__file__).resolve().parent.parent
# v2 structure has REAL ImagePlaceholder bboxes (path 3 fix)
STRUCTURE_JSON = Path("/tmp/figma_structure_v2.json")
OUT = ROOT / "output" / "HUBSS_LookBook_2026_v3.pdf"


# Pages that get bespoke rendering — everything else uses layout_faithful
BESPOKE = {"cover", "toc", "back_cover", "lunch_learn"}


def classify(page: dict) -> str:
    """Return a page-type token for routing to the right renderer."""
    name = (page.get("name") or "").strip().lower()
    n_images = len(page.get("images") or [])
    texts = page.get("texts") or []
    n_texts = len(texts)
    text_blob = " ".join(t["text"].lower() for t in texts)
    n_image_placeholders = sum(1 for t in texts if t["text"].lstrip().lower().startswith("image"))

    # Cover & back cover by name
    if "front cover" in name or name.endswith("0-front cover"):
        return "cover"
    if "back cover" in name:
        return "back_cover"
    if "toc" in name:
        return "toc"
    if "introduction" in name:
        return "intro"

    # Section dividers — usually labelled by section name in top-right
    section_label_words = {"products", "crosswalks", "community branding",
                           "public spaces", "traffic calming", "commercial spaces",
                           "our network", "residential"}
    has_section_label = any(w in text_blob for w in section_label_words) and \
                        any(t["size"] and t["size"] >= 9.0 and (t["text"].lower().strip() in section_label_words)
                            for t in texts if t.get("size"))

    # L&L page
    if "lunch & learn" in text_blob or "see it. spec it." in text_blob:
        return "lunch_learn"

    # Installer cards
    if "hub certified installer" in text_blob:
        return "installer"

    # Pages with one BIG image placeholder + city/product caption -> gallery
    if n_image_placeholders == 1 and n_texts <= 6:
        return "gallery_simple"
    if n_image_placeholders >= 2:
        return "gallery_multi"

    # Pages with one image placeholder + body copy
    if n_image_placeholders == 1 and n_texts > 6:
        return "gallery_with_caption"

    # No image placeholders, lots of text -> spec page
    if n_image_placeholders == 0 and n_texts >= 5:
        return "product_spec"

    # Default
    return "product_spec"


def get_page_number(page: dict, idx: int) -> str:
    """Use the printed page number from Figma if present, else fallback to idx."""
    for t in page.get("texts") or []:
        x = t.get("rel_x") or 0
        y = t.get("rel_y") or 0
        if 200 <= x <= 240 and 415 <= y <= 425 and len(t["text"].strip()) <= 4:
            return t["text"].strip()
    # idx is 1-based; cover is page 1, but printed numbers usually start at 1 inside
    return str(idx - 2) if idx >= 3 else ""


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    if not STRUCTURE_JSON.exists():
        raise SystemExit("Missing " + str(STRUCTURE_JSON))
    pages = json.loads(STRUCTURE_JSON.read_text())
    reset_rotation()
    c = Canvas(str(OUT), pagesize=PAGE_SIZE)
    c.setTitle("HUB Surface Systems - Catalogue 2026")
    c.setAuthor("HUB Surface Systems")
    c.setSubject("A Catalogue of Surfaces.")
    for idx, p in enumerate(pages, 1):
        kind = classify(p)
        page_num = get_page_number(p, idx)
        try:
            if kind in BESPOKE:
                renderer = getattr(PT, "render_" + kind)
                renderer(c, p, page_num)
            else:
                render_layout_faithful(c, p, page_num)
        except Exception as e:
            try:
                PT.render_error_placeholder(c, p, page_num, str(e))
            except Exception:
                pass
        try:
            PM.add_page_marks(c, show_guides=False)
        except Exception:
            pass
        c.showPage()
    c.save()
    return OUT



if __name__ == "__main__":
    out = build()
    print("Wrote -> " + str(out))
