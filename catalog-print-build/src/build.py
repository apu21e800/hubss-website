"""
HUB Surface Systems - 2026 Look Book build (trade-show edition).

Page count target: ~96 pages, divisible by 4 for binding.

Structure:
  Cover (1)
  Inside front quote (1)
  Manifesto (1)
  Projects divider (1)
  9 projects × 2 pages each = 18 pages (image + dark text page)
  Products divider (1)
  12 products × 5 pages each = 60 pages (hero image + dark text + 3 gallery)
  Applications divider (1)
  8 applications × 1 page = 8 pages
  Cities served (1)
  Contact (1)
  Back cover (1)
  + padding to reach multiple of 4
"""

from __future__ import annotations
import argparse
from pathlib import Path

import yaml
from reportlab.pdfgen.canvas import Canvas

from .specs import PAGE_SIZE
from . import pages as P

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content" / "catalog.yaml"
OUTPUT = ROOT / "output" / "HUBSS_LookBook_2026.pdf"


def load_content():
    with open(CONTENT, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def build(out_path, proof=False):
    data = load_content()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    c = Canvas(str(out_path), pagesize=PAGE_SIZE)
    c.setTitle(data["meta"]["title"])
    c.setSubject(data["meta"]["subtitle"])
    c.setAuthor("HUB Surface Systems")

    page_num = 0
    def finish():
        nonlocal page_num
        page_num += 1
        P.add_page_marks(c, show_guides=proof)
        c.showPage()

    # FRONTMATTER
    P.render_cover(c, data); finish()                      # 01
    P.render_inside_front(c, data); finish()                # 02
    P.render_manifesto(c, data); finish()                   # 03

    pn = 4

    # PROJECTS — each project gets 2 pages: image + dark text
    if "projects_divider" in data:
        P.render_section_divider(c, data["projects_divider"], f"{pn:02d}")
        finish(); pn += 1
    for proj in data.get("projects", []):
        P.render_project_image(c, data, proj, f"{pn:02d}"); finish(); pn += 1
        P.render_project_text(c, data, proj, f"{pn:02d}"); finish(); pn += 1

    # PRODUCTS — each product gets 5 pages: image + text + 3 gallery
    if "products_divider" in data:
        P.render_section_divider(c, data["products_divider"], f"{pn:02d}")
        finish(); pn += 1
    for prod in data.get("products", []):
        P.render_product_image(c, data, prod, f"{pn:02d}"); finish(); pn += 1
        P.render_product_text(c, data, prod, f"{pn:02d}"); finish(); pn += 1
        for img_rel in (prod.get("project_examples") or [])[:3]:
            P.render_product_example(c, data, prod, img_rel, f"{pn:02d}")
            finish(); pn += 1

    # APPLICATIONS
    if "applications_divider" in data:
        P.render_section_divider(c, data["applications_divider"], f"{pn:02d}")
        finish(); pn += 1
    for app in data.get("applications", []):
        P.render_application(c, data, app, f"{pn:02d}"); finish(); pn += 1

    # Cities + Contact
    P.render_cities(c, data, f"{pn:02d}"); finish(); pn += 1
    P.render_contact(c, data, f"{pn:02d}"); finish(); pn += 1

    # Pad to multiple of 4 minus 1 (back cover)
    while (page_num + 1) % 4 != 0:
        finish()

    P.render_back_cover(c, data); finish()
    c.save()
    return {"pages": page_num, "out": str(out_path), "proof": proof}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--proof", action="store_true")
    ap.add_argument("--out", type=Path, default=OUTPUT)
    args = ap.parse_args()
    info = build(args.out, proof=args.proof)
    print(f"Wrote {info['pages']} pages -> {info['out']}")


if __name__ == "__main__":
    main()
