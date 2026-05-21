"""
PNG-overlay catalog build.

Strategy: each page = the high-res Figma PNG export, placed full-bleed.
For every ImagePlaceholder bbox, we mask with cream and draw a real photo.

This guarantees:
  - All text typography matches Figma EXACTLY (because text comes from the PNG)
  - Photos go in the real designed regions
  - No font-metric drift, no wrap overflow, no text-on-image collisions

Special cases:
  - Cover (page 1): full-bleed UBC photo + combined wordmark overlay
  - Back cover (page 72): bespoke navy renderer
  - Everything else: PNG base + photo overlays
"""
from __future__ import annotations

import json
import re
import os
from pathlib import Path

from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import CMYKColor

from .specs import (
    PAGE_SIZE, PAGE_W, PAGE_H, BLEED, TRIM_W, TRIM_H,
    HUBSS_ORANGE, HUBSS_NAVY_RICH, HUBSS_WHITE,
)
from .figma_render import (
    SCALE, fs, figma_to_pdf, fill_bleed,
    draw_image_at_figma, draw_full_bleed_image, draw_text_block,
    CMYK_CREAM, CMYK_TEXT_DARK, CMYK_TEXT_MID, CMYK_TEXT_FAINT,
)
from .images import draw_image_box
from .photo_mapper import resolve as resolve_photo, reset_rotation
from . import page_marks as PM


ROOT = Path(__file__).resolve().parent.parent
STRUCTURE_JSON = Path("/tmp/figma_structure_v2.json")
HIRES_DIR = ROOT / "figma_refs" / "hires"
ASSETS = ROOT / "assets" / "booklet"
PUBLIC_IMG = ROOT.parent / "public" / "images"
HUBSS_LOGOS = PUBLIC_IMG / "assets" / "logos" / "hubss-logos"

OUT = ROOT / "output" / "HUBSS_LookBook_2026_v4.pdf"


def find_hires_png(idx, page_name):
    """Return the path to the hi-res PNG for a given page idx + name."""
    safe_name = page_name.replace(' ', '_').replace('/', '_')[:40]
    fname = f"{idx:02d}_{safe_name}.png"
    p = HIRES_DIR / fname
    if p.exists():
        return p
    # Fallback: scan for any matching prefix
    for f in HIRES_DIR.glob(f"{idx:02d}_*.png"):
        return f
    return None


def render_cover_bespoke(c):
    """Cover overlay — full UBC photo + combined wordmark + year."""
    fill_bleed(c, CMYK_CREAM)
    cover_img = ASSETS / "UBC Crosswalk 1.png"
    if not cover_img.exists():
        cover_img = ASSETS / "Whiterock-Pier-Crosswalk-TrafficPatternsXD-1 1.png"
    if cover_img.exists():
        draw_full_bleed_image(c, str(cover_img))

    # Soft bottom band scrim for legibility (subtle, not heavy)
    overlay = CMYKColor(0, 0, 0, 0.55, alpha=0.40)
    c.setFillColor(overlay)
    c.rect(0, 0, PAGE_W, fs(70), stroke=0, fill=1)

    # Combined white wordmark
    logo = HUBSS_LOGOS / "hubss-logo-white-large.png"
    if logo.exists():
        aspect = 2432 / 701
        word_w_figma = 200
        word_h_figma = word_w_figma / aspect
        word_fx = 30
        word_fy = 380
        px = BLEED + word_fx * SCALE
        py = BLEED + TRIM_H - (word_fy + word_h_figma) * SCALE
        w = word_w_figma * SCALE
        h = word_h_figma * SCALE
        draw_image_box(c, str(logo), px, py, w, h, cover=False, convert_to_cmyk=False)

    # Year right
    draw_text_block(c, "CATALOGUE 2026",
                    fx=380, fy=412, font_size_figma=7.5, weight=600,
                    color=HUBSS_WHITE, tracking=1.6,
                    align="right", max_w_figma=40)


def render_back_bespoke(c):
    """Navy back cover — single combined wordmark, contact stack."""
    fill_bleed(c, HUBSS_NAVY_RICH)
    logo = HUBSS_LOGOS / "hubss-logo-white-large.png"
    if logo.exists():
        aspect = 2432 / 701
        word_w_figma = 240
        word_h_figma = word_w_figma / aspect
        word_fx = (450 - word_w_figma) / 2
        word_fy = 260
        px = BLEED + word_fx * SCALE
        py = BLEED + TRIM_H - (word_fy + word_h_figma) * SCALE
        w = word_w_figma * SCALE
        h = word_h_figma * SCALE
        draw_image_box(c, str(logo), px, py, w, h, cover=False, convert_to_cmyk=False)

    draw_text_block(c, "Canada's Leading Decorative Pavement Solutions",
                    fx=25, fy=335, font_size_figma=7.5,
                    color=CMYK_TEXT_FAINT, align="center", max_w_figma=400)
    rule_w = 32
    rx, ry = figma_to_pdf((450 - rule_w) / 2, 358)
    c.setFillColor(HUBSS_ORANGE)
    c.rect(rx, ry, rule_w * SCALE, 1.2, stroke=0, fill=1)
    draw_text_block(c, "hubss.com", fx=25, fy=372,
                    font_size_figma=8.0, weight=600,
                    color=HUBSS_WHITE, align="center", max_w_figma=400)
    draw_text_block(c, "West / Prairies   604.309.8212", fx=25, fy=390,
                    font_size_figma=6.5, color=CMYK_TEXT_FAINT,
                    align="center", max_w_figma=400)
    draw_text_block(c, "Central / Maritimes   416.540.9287", fx=25, fy=403,
                    font_size_figma=6.5, color=CMYK_TEXT_FAINT,
                    align="center", max_w_figma=400)
    draw_text_block(c, "info@hubss.com", fx=25, fy=420,
                    font_size_figma=6.5, color=CMYK_TEXT_FAINT,
                    align="center", max_w_figma=400)
    draw_text_block(c, "(c) 2026 HUB Surface Systems. All rights reserved.",
                    fx=25, fy=445, font_size_figma=5.6,
                    color=CMYK_TEXT_FAINT, align="center", max_w_figma=400)


def render_png_with_overlays(c, idx, page):
    """Place the Figma PNG full-bleed, then overlay real photos at placeholders."""
    png = find_hires_png(idx, page['name'])
    if png:
        # Full-bleed: scale the 450x450 design to fill the 5x5" trim plus bleed.
        # Skip CMYK conversion for the page background (printer's RIP handles
        # final colour conversion; converting 72 large PNGs is too slow).
        draw_image_box(c, str(png), 0, 0, PAGE_W, PAGE_H, cover=True, convert_to_cmyk=False)

    # Overlay photos at real ImagePlaceholder bboxes
    for ph in page.get('image_placeholders', []) or []:
        fx = ph['rel_x']
        fy = ph['rel_y']
        w = ph['w']
        h = ph['h']
        # First mask the placeholder rectangle with cream so the "IMAGE: ..."
        # placeholder text and beige fill are hidden cleanly
        mx = BLEED + fx * SCALE
        my = BLEED + TRIM_H - (fy + h) * SCALE
        mw = w * SCALE
        mh = h * SCALE
        # Use a subtle off-white that disappears under the photo
        c.setFillColor(CMYKColor(0, 0, 0, 0))  # white
        c.rect(mx, my, mw, mh, stroke=0, fill=1)
        # Resolve photo from the descriptor inside the placeholder
        descriptor = ph.get('description') or ''
        img = resolve_photo(descriptor, prefer_hero=False)
        if img and img.exists():
            draw_image_at_figma(c, str(img), fx=fx, fy=fy, fw=w, fh=h)


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pages = json.loads(STRUCTURE_JSON.read_text())
    reset_rotation()
    c = Canvas(str(OUT), pagesize=PAGE_SIZE)
    c.setTitle("HUB Surface Systems - Catalogue 2026")
    c.setAuthor("HUB Surface Systems")
    c.setSubject("PNG-overlay edition")

    for idx, p in enumerate(pages, 1):
        name = (p.get('name') or '').lower()
        try:
            if "front cover" in name:
                render_cover_bespoke(c)
            elif "back cover" in name:
                render_back_bespoke(c)
            else:
                render_png_with_overlays(c, idx, p)
        except Exception as e:
            print(f"  page {idx} error: {e}")

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
