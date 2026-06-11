"""
Layout-faithful renderer (Path 3).

Uses the v2 structure dump (/tmp/figma_structure_v2.json) which captures the
real ImagePlaceholder FRAME nodes from Figma — so we know EXACTLY where each
image region sits and how big it is. No more heuristics.
"""
from __future__ import annotations

from reportlab.pdfgen.canvas import Canvas
from reportlab.pdfbase.pdfmetrics import stringWidth

from .specs import (
    PAGE_W, PAGE_H, BLEED, TRIM_W, TRIM_H,
    HUBSS_ORANGE, FONT_SANS_BOLD, FONT_SANS_REG,
)
from .figma_render import (
    SCALE, fs, figma_to_pdf, fill_bleed, draw_text_block,
    draw_image_at_figma, draw_full_bleed_image, draw_page_number,
    CMYK_CREAM, CMYK_TEXT_DARK, CMYK_TEXT_MID, CMYK_TEXT_FAINT,
)
from .images import draw_image_box
from .photo_mapper import resolve as resolve_photo


def text_role(t):
    s = t.get("size") or 0
    if s >= 18:    return "display"
    if s >= 12:    return "subhead"
    if s >= 9.5:   return "lead"
    if s >= 8:     return "body"
    return "caption"


def is_page_number(t):
    s = (t.get("text") or "").strip()
    x = t.get("rel_x") or 0
    y = t.get("rel_y") or 0
    return 200 <= x <= 240 and 415 <= y <= 425 and len(s) <= 4


def is_dot_leader(t):
    s = (t.get("text") or "").strip()
    return bool(s) and set(s) <= {".", " ", "·", "•"}


def render_text_element(c, t):
    text = (t.get("text") or "").strip()
    if not text:
        return
    if is_page_number(t) or is_dot_leader(t):
        return

    fx = t.get("rel_x") or 0
    fy = t.get("rel_y") or 0
    w = t.get("w") or 200
    figma_size = t.get("size") or 9.0

    role = text_role(t)
    is_caps = text.isupper() and len(text) <= 80
    is_short = len(text) <= 60

    # Respect Figma sizes; only upgrade leading + tracking for premium feel
    if role == "display":
        font_size = figma_size; weight = 800
        leading = font_size * 1.12; tracking = -0.6
        color = CMYK_TEXT_DARK
    elif role == "subhead":
        font_size = figma_size
        weight = 800 if figma_size >= 12 else 600
        leading = font_size * 1.25; tracking = -0.1
        color = CMYK_TEXT_DARK
    elif role == "lead":
        font_size = figma_size; weight = 400
        leading = font_size * 1.45; tracking = 0.05
        color = CMYK_TEXT_DARK
    elif role == "body":
        font_size = figma_size; weight = 400
        leading = font_size * 1.42; tracking = 0.05
        color = CMYK_TEXT_DARK
    else:
        font_size = figma_size; weight = 400
        leading = font_size * 1.30; tracking = 0.10
        color = CMYK_TEXT_MID

    if is_caps and is_short and role in ("caption", "body", "lead"):
        tracking = 1.6
        weight = 600

    upper = text.upper()
    if any(t in upper for t in ("CANADIAN WINTER PROVEN", "PRODUCT SPECIFICATION")):
        color = HUBSS_ORANGE
    if "RESERVED" in upper or "(c)" in text.lower():
        color = CMYK_TEXT_FAINT

    # Right-anchored short text -> right-align inside its bbox
    is_right_anchored = (fx >= 380)
    is_short_single_line = (
        len(text) < 35 and "\n" not in text and (
            role in ("display", "subhead") or is_right_anchored
        )
    )

    if is_short_single_line:
        align = "right" if is_right_anchored else "left"
        if is_right_anchored:
            right_x_figma = fx + w
            max_pt = (right_x_figma - 30) * SCALE
            anchor_fx = max(20, right_x_figma - 130)
            anchor_w = right_x_figma - anchor_fx
        else:
            max_pt = (450 - fx - 30) * SCALE
            anchor_fx = fx
            anchor_w = 450 - fx - 30

        font_for_measure = FONT_SANS_BOLD if weight >= 600 else FONT_SANS_REG
        target_pt = font_size * SCALE
        while target_pt > 8 and stringWidth(text, font_for_measure, target_pt) > max_pt:
            target_pt -= 0.5
        target_figma = target_pt / SCALE
        draw_text_block(
            c, text,
            fx=anchor_fx, fy=fy,
            font_size_figma=target_figma,
            weight=weight, color=color,
            tracking=tracking,
            max_w_figma=anchor_w,
            align=align,
        )
        return

    max_w_figma = max(40, w - 2)
    draw_text_block(
        c, text,
        fx=fx, fy=fy,
        font_size_figma=font_size,
        weight=weight, color=color,
        max_w_figma=max_w_figma,
        leading_figma=leading,
        tracking=tracking,
    )


def render_image_at_placeholder(c, ph, *, prefer_hero=False):
    """Place a real photo at the ImagePlaceholder's exact Figma bbox."""
    description = ph.get("description") or ""
    img = resolve_photo(description, prefer_hero=prefer_hero)
    if not (img and img.exists()):
        return
    fx = ph["rel_x"]
    fy = ph["rel_y"]
    w = ph["w"]
    h = ph["h"]
    draw_image_at_figma(c, str(img), fx=fx, fy=fy, fw=w, fh=h)


def render_layout_faithful(c, page, page_num):
    """Render any page using EXACT Figma placeholder bboxes for images."""
    fill_bleed(c, CMYK_CREAM)

    placeholders = page.get("image_placeholders") or []
    texts = page.get("texts") or []

    # Pass 1: place photos at every real ImagePlaceholder bbox
    for ph in placeholders:
        # If it's the only placeholder on a text-light page, prefer the curated hero
        prefer_hero = (len(placeholders) == 1 and len(texts) <= 6)
        render_image_at_placeholder(c, ph, prefer_hero=prefer_hero)

    # Pass 2: render all text at its exact Figma position
    for t in texts:
        if is_page_number(t):
            continue
        if is_dot_leader(t):
            continue
        render_text_element(c, t)

    # Page number bottom-centre
    if page_num:
        draw_page_number(c, page_num)
