"""
Page-type renderers for the bulk catalog build.

Each function takes (canvas, page_dict, page_num_str) and paints one page.
The page_dict comes from /tmp/figma_structure.json — it has {id, name, texts, images}.

Design principles applied:
  - Body measure narrows to 60-65 ch maximum (no edge-tight text)
  - Eyebrow labels in tracked uppercase, orange
  - Display headlines breathe with negative tracking
  - Generous leading (1.55x) on body for editorial calm
  - Cream paper everywhere except cover/back-cover/dark sections
"""
from __future__ import annotations

import re
from pathlib import Path

from reportlab.pdfgen.canvas import Canvas
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.lib.colors import CMYKColor

from .specs import (
    PAGE_W, PAGE_H, BLEED, TRIM_W, TRIM_H,
    HUBSS_ORANGE, HUBSS_NAVY, HUBSS_NAVY_RICH, HUBSS_BLACK, HUBSS_WHITE,
    FONT_SANS_BOLD, FONT_SANS_REG, FONT_SANS_OBL, FONT_SERIF,
    TYPE,
)
from .figma_render import (
    SCALE, fs, figma_to_pdf, fill_bleed,
    draw_text_block, draw_image_at_figma, draw_full_bleed_image,
    draw_page_number,
    CMYK_CREAM, CMYK_TEXT_DARK, CMYK_TEXT_MID, CMYK_TEXT_FAINT,
)
from .images import draw_image_box
from .photo_mapper import resolve as resolve_photo

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_IMG = ROOT.parent / "public" / "images"
HUBSS_LOGOS = PUBLIC_IMG / "assets" / "logos" / "hubss-logos"

LOGO_COLOR = HUBSS_LOGOS / "hubss-logo-color.png"
LOGO_WHITE = HUBSS_LOGOS / "hubss-logo-white-large.png"
LOGO_ASPECT = 2432 / 701

# ------------------------------------------------------------------
# Margins & body measure (figma units)
# ------------------------------------------------------------------
MARGIN_LEFT = 36
MARGIN_RIGHT = 36
MARGIN_TOP = 36
MARGIN_BOTTOM = 36

# Body measure: 60-character optimum at body size = ~340 figma units
# But we want generous breathing on the right edge — narrow it to 320.
BODY_MEASURE = 320


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------
def draw_combined_logo(c: Canvas, fx: float, fy: float, fw_figma: float, *, variant: str = "color"):
    img = LOGO_COLOR if variant == "color" else LOGO_WHITE
    if not img.exists():
        return
    fh_figma = fw_figma / LOGO_ASPECT
    px = BLEED + fx * SCALE
    py = BLEED + TRIM_H - (fy + fh_figma) * SCALE
    w = fw_figma * SCALE
    h = fh_figma * SCALE
    draw_image_box(c, str(img), px, py, w, h, cover=False, convert_to_cmyk=False)


def find_text(page: dict, predicate) -> str | None:
    for t in page.get("texts") or []:
        if predicate(t):
            return t["text"].strip()
    return None


def find_image_placeholder(page: dict, contains: str = "") -> dict | None:
    for t in page.get("texts") or []:
        if t["text"].lstrip().lower().startswith("image"):
            if not contains or contains.lower() in t["text"].lower():
                return t
    return None


def all_image_placeholders(page: dict) -> list[dict]:
    return [t for t in (page.get("texts") or [])
            if t["text"].lstrip().lower().startswith("image")]


def all_real_texts(page: dict) -> list[dict]:
    """Texts that are content, not image placeholders or page numbers."""
    out = []
    for t in page.get("texts") or []:
        s = t["text"].strip()
        if s.lower().startswith("image"):
            continue
        x = t.get("rel_x") or 0
        y = t.get("rel_y") or 0
        # Skip page numbers (centered bottom) and separator dots
        if 200 <= x <= 240 and 415 <= y <= 425 and len(s) <= 4:
            continue
        if set(s) <= {"·", " ", ".", "•"}:  # separator dots
            continue
        out.append(t)
    return out


def shrink_to_fit(text: str, font: str, max_w_pt: float, start_size: float, min_size: float = 8.0) -> float:
    s = start_size
    while s > min_size and stringWidth(text, font, s) > max_w_pt:
        s -= 0.5
    return s


def safe_resolve(placeholder_text: str, prefer_hero: bool = False) -> Path:
    """Resolve a photo, never returning None."""
    p = resolve_photo(placeholder_text or "", prefer_hero=prefer_hero)
    if not p or not p.exists():
        from .photo_mapper import ULTIMATE_FALLBACK
        return ULTIMATE_FALLBACK
    return p


def draw_page_number_safe(c: Canvas, num: str):
    if num:
        draw_page_number(c, num)


def draw_section_label(c: Canvas, label: str):
    """Top-right small tracked-caps section label, orange."""
    if not label:
        return
    draw_text_block(c, label.upper(),
                    fx=305, fy=33, font_size_figma=6.6, weight=600,
                    color=HUBSS_ORANGE, tracking=1.6,
                    align="right", max_w_figma=110)


def detect_section_label(page: dict) -> str:
    """Find a top-right section label like 'PRODUCTS' / 'CROSSWALKS'."""
    target = {"products", "crosswalks", "community branding", "public spaces",
              "traffic calming", "commercial spaces", "our network",
              "residential", "residential driveways"}
    for t in page.get("texts") or []:
        x = t.get("rel_x") or 0
        if x >= 380 and t["text"].strip().lower() in target:
            return t["text"].strip()
    return ""


# ------------------------------------------------------------------
# RENDERERS
# ------------------------------------------------------------------
def render_cover(c: Canvas, page: dict, page_num: str):
    """Front cover — full-bleed UBC Crosswalk photo + combined wordmark + year."""
    fill_bleed(c, CMYK_CREAM)
    # Use UBC Crosswalk for the cover (per Vernon's call)
    cover_img = ROOT / "assets" / "booklet" / "UBC Crosswalk 1.png"
    if not cover_img.exists():
        # Fallback to White Rock
        cover_img = ROOT / "assets" / "booklet" / "Whiterock-Pier-Crosswalk-TrafficPatternsXD-1 1.png"
    if cover_img.exists():
        draw_full_bleed_image(c, str(cover_img))

    # Combined white wordmark — bottom-left, prominent
    draw_combined_logo(c, fx=30, fy=380, fw_figma=210, variant="white")

    # Year — bottom-right
    draw_text_block(
        c, "CATALOGUE 2026",
        fx=380, fy=412, font_size_figma=7.5, weight=600,
        color=HUBSS_WHITE, tracking=1.6,
        align="right", max_w_figma=40,
    )


def render_toc(c: Canvas, page: dict, page_num: str):
    """Table of contents — orange bullets, leader dots, page numbers."""
    fill_bleed(c, CMYK_CREAM)
    draw_text_block(c, "WHAT'S INSIDE",
                    fx=37, fy=52, font_size_figma=15.6, weight=800,
                    color=CMYK_TEXT_DARK, tracking=0.6)
    px, py = figma_to_pdf(37, 70)
    c.setFillColor(HUBSS_ORANGE)
    c.rect(px, py - 2, 24 * SCALE, 1.2, stroke=0, fill=1)

    # Use Figma's TOC content directly: it stores label + page-number pairs
    # as adjacent text rows at fixed Y values. We'll just hard-code the canonical list.
    entries = [
        ("Products",              "4",   88),
        ("Crosswalks",            "19",  120),
        ("Community Branding",    "31",  152),
        ("Public Spaces",         "43",  184),
        ("Residential",           "51",  216),
        ("Traffic Calming",       "55",  248),
        ("Commercial",            "59",  280),
        ("Our Installer Network", "63",  312),
        ("Book a Lunch & Learn",  "68",  344),
    ]
    NUM_X_FIGMA = 405
    DOTS_END_FIGMA = 388
    for label, num, fy in entries:
        bx, by = figma_to_pdf(43, fy + 4)
        c.setFillColor(HUBSS_ORANGE)
        c.circle(bx, by, 1.5, stroke=0, fill=1)
        draw_text_block(c, label, fx=51, fy=fy,
                        font_size_figma=9.5, weight=600,
                        color=CMYK_TEXT_DARK)
        label_w = stringWidth(label, FONT_SANS_BOLD, fs(9.5))
        dots_start = 51 + (label_w / SCALE) + 4
        c.saveState()
        cx, cy = figma_to_pdf(dots_start, fy + 14)
        cw = max(0, (DOTS_END_FIGMA - dots_start) * SCALE)
        ch = 14 * SCALE
        path = c.beginPath()
        path.rect(cx, cy, cw, ch)
        c.clipPath(path, stroke=0, fill=0)
        draw_text_block(c, ". " * 80, fx=dots_start, fy=fy,
                        font_size_figma=9.5, color=CMYK_TEXT_FAINT)
        c.restoreState()
        num_w = stringWidth(num, FONT_SANS_BOLD, fs(9.5))
        num_x = NUM_X_FIGMA - (num_w / SCALE)
        draw_text_block(c, num, fx=num_x, fy=fy,
                        font_size_figma=9.5, weight=600,
                        color=CMYK_TEXT_DARK)

    draw_text_block(c, "All products Canadian-specified. All photography from installations across Canada.",
                    fx=36, fy=399, font_size_figma=6.9, color=CMYK_TEXT_MID,
                    max_w_figma=380)


def render_intro(c: Canvas, page: dict, page_num: str):
    """Introduction page — eyebrow + display headline + body."""
    fill_bleed(c, CMYK_CREAM)
    # Eyebrow
    draw_text_block(c, "HUB SURFACE SYSTEMS",
                    fx=36, fy=44, font_size_figma=7.0, weight=600,
                    color=HUBSS_ORANGE, tracking=1.6)
    # Headline (3 lines from Figma)
    draw_text_block(c, "Three decades of transforming",
                    fx=33, fy=84, font_size_figma=22, weight=800,
                    color=CMYK_TEXT_DARK, max_w_figma=BODY_MEASURE,
                    leading_figma=27)
    draw_text_block(c, "Canadian streetscapes.",
                    fx=33, fy=132, font_size_figma=22, weight=800,
                    color=HUBSS_ORANGE)

    # Body
    body_text = find_text(page, lambda t: (t.get("size") or 0) < 12 and
                                          len(t["text"]) > 80)
    if body_text:
        draw_text_block(c, body_text,
                        fx=36, fy=200, font_size_figma=9.0, weight=400,
                        color=CMYK_TEXT_DARK, max_w_figma=BODY_MEASURE,
                        leading_figma=14.5)

    # Footer
    draw_text_block(c, "vancouver / toronto",
                    fx=36, fy=400, font_size_figma=7.0, weight=600,
                    color=CMYK_TEXT_MID, tracking=1.0)
    draw_text_block(c, "hubss.com",
                    fx=36, fy=414, font_size_figma=7.0, weight=600,
                    color=HUBSS_ORANGE)
    draw_section_label(c, "PRODUCTS")
    draw_page_number_safe(c, page_num)


def render_product_spec(c: Canvas, page: dict, page_num: str):
    """Generic text-heavy product/spec page.

    Strategy: take the largest text as the display headline, the next largest
    as the subhead, then place body paragraphs in order. All inside narrowed
    body measure so the right edge breathes.
    """
    fill_bleed(c, CMYK_CREAM)
    section = detect_section_label(page)
    draw_section_label(c, section)

    # Sort real texts by size (desc), filter image placeholders
    texts = all_real_texts(page)
    if not texts:
        draw_page_number_safe(c, page_num)
        return

    # Identify the display headline as the largest text near the top-left
    by_size = sorted(texts, key=lambda t: (-(t.get("size") or 0), t.get("rel_y") or 0))
    display = by_size[0] if by_size and (by_size[0].get("size") or 0) >= 12 else None

    # Place display headline
    y_cursor = 36
    if display:
        text = display["text"].strip()
        # Shrink to fit if needed
        max_w_pt = (450 - MARGIN_LEFT - MARGIN_RIGHT - 10) * SCALE
        size = display.get("size") or 24
        size = min(size, 28)  # cap so it doesn't overflow
        target = shrink_to_fit(text, FONT_SANS_BOLD, max_w_pt, fs(size))
        target_figma = target / SCALE
        draw_text_block(c, text, fx=MARGIN_LEFT, fy=y_cursor,
                        font_size_figma=target_figma, weight=800,
                        color=CMYK_TEXT_DARK,
                        max_w_figma=BODY_MEASURE)
        y_cursor += target_figma * 1.25 + 8

    # Subhead — second largest
    subheads = [t for t in by_size[1:] if 8 <= (t.get("size") or 0) < 14]
    if subheads:
        sub = subheads[0]
        sub_text = sub["text"].strip()
        if sub_text and not sub_text.lower().startswith("image"):
            draw_text_block(c, sub_text, fx=MARGIN_LEFT, fy=y_cursor,
                            font_size_figma=10, weight=600,
                            color=CMYK_TEXT_DARK, max_w_figma=BODY_MEASURE)
            y_cursor += 16

    # Body paragraphs — long texts at body size
    body_texts = [t for t in texts if (t.get("size") or 0) < 9.5 and len(t["text"]) > 100]
    body_texts.sort(key=lambda t: t.get("rel_y") or 0)

    y_cursor += 12
    for bt in body_texts[:3]:
        text = bt["text"].strip()
        # We use draw_text_block with max_w_figma to wrap. But the helper
        # returns the bottom y in PDF coords; we still track y_cursor in figma
        # units. So estimate paragraph height.
        size_figma = 9.5
        leading_figma = 14.5
        # Word-wrap estimate
        max_w_pt = BODY_MEASURE * SCALE
        words = text.split()
        cur, lines = "", []
        for w in words:
            cand = (cur + " " + w).strip()
            if stringWidth(cand, FONT_SANS_REG, fs(size_figma)) <= max_w_pt:
                cur = cand
            else:
                if cur:
                    lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)

        draw_text_block(c, text, fx=MARGIN_LEFT, fy=y_cursor,
                        font_size_figma=size_figma,
                        color=CMYK_TEXT_DARK,
                        max_w_figma=BODY_MEASURE,
                        leading_figma=leading_figma)
        y_cursor += len(lines) * leading_figma + 14
        if y_cursor > 380:
            break

    draw_page_number_safe(c, page_num)


def render_gallery_simple(c: Canvas, page: dict, page_num: str):
    """A single big image with a small city/product caption."""
    fill_bleed(c, CMYK_CREAM)
    section = detect_section_label(page)

    img_ph = find_image_placeholder(page)
    img = safe_resolve(img_ph["text"] if img_ph else "")
    if img.exists():
        # Photo dominates the upper 80% of the page
        draw_image_at_figma(c, str(img), fx=0, fy=0, fw=450, fh=370)

    # Cream slab below image
    px, py = figma_to_pdf(0, 370)
    c.setFillColor(CMYK_CREAM)
    c.rect(0, 0, PAGE_W, py, stroke=0, fill=1)

    # Find caption — usually a city label + product label at bottom
    real = all_real_texts(page)
    # City: typically a left-aligned ALL CAPS string with comma
    city_text = ""
    product_text = ""
    for t in real:
        s = t["text"].strip()
        if "," in s and (t.get("rel_x") or 0) < 60 and 410 <= (t.get("rel_y") or 0) <= 425:
            city_text = s
        if (t.get("rel_x") or 0) >= 300 and 410 <= (t.get("rel_y") or 0) <= 425:
            product_text = s
    # Fallback: parse from image placeholder
    if not city_text and img_ph:
        m = re.search(r"—\s*([^,]+,\s*[A-Z]{2})", img_ph["text"])
        if m:
            city_text = m.group(1).upper()
    if not product_text and img_ph:
        m = re.search(r",\s*([A-Za-z]+(?:Patterns(?:XD)?|Print|Bond(?:SR)?|Mark|Therm|Mark|MAX))", img_ph["text"])
        if m:
            product_text = m.group(1)

    if city_text:
        draw_text_block(c, city_text, fx=22, fy=388,
                        font_size_figma=10, weight=800,
                        color=CMYK_TEXT_DARK, tracking=0.5)
    if product_text:
        draw_text_block(c, product_text, fx=240, fy=390,
                        font_size_figma=7.5, weight=600,
                        color=HUBSS_ORANGE, max_w_figma=190,
                        align="right")

    draw_section_label(c, section)
    draw_page_number_safe(c, page_num)


def render_gallery_with_caption(c: Canvas, page: dict, page_num: str):
    """Image + a short narrative caption underneath."""
    fill_bleed(c, CMYK_CREAM)
    section = detect_section_label(page)

    img_ph = find_image_placeholder(page)
    img = safe_resolve(img_ph["text"] if img_ph else "")
    if img.exists():
        draw_image_at_figma(c, str(img), fx=0, fy=0, fw=450, fh=320)

    # Slab below
    px, py = figma_to_pdf(0, 320)
    c.setFillColor(CMYK_CREAM)
    c.rect(0, 0, PAGE_W, py, stroke=0, fill=1)

    # Caption: longest text < 14pt size
    real = all_real_texts(page)
    candidates = [t for t in real if (t.get("size") or 0) < 12 and len(t["text"]) > 40]
    caption = candidates[0]["text"].strip() if candidates else ""
    if caption:
        draw_text_block(c, caption, fx=30, fy=355,
                        font_size_figma=9.0, color=CMYK_TEXT_DARK,
                        max_w_figma=390, leading_figma=13.5)

    draw_section_label(c, section)
    draw_page_number_safe(c, page_num)


def render_gallery_multi(c: Canvas, page: dict, page_num: str):
    """Two images on one page (e.g. main + closeup)."""
    fill_bleed(c, CMYK_CREAM)
    section = detect_section_label(page)
    placeholders = all_image_placeholders(page)
    # Top image (large) + bottom image (small) split
    if placeholders:
        img1 = safe_resolve(placeholders[0]["text"])
        if img1.exists():
            draw_image_at_figma(c, str(img1), fx=0, fy=0, fw=450, fh=280)
    if len(placeholders) >= 2:
        img2 = safe_resolve(placeholders[1]["text"])
        if img2.exists():
            draw_image_at_figma(c, str(img2), fx=30, fy=300, fw=180, fh=110)

    # Right-side caption block
    real = all_real_texts(page)
    caption_y = 305
    for t in real[:4]:
        s = t["text"].strip()
        if not s or len(s) < 3:
            continue
        size = t.get("size") or 7
        weight = 800 if size >= 9 else 400
        color = CMYK_TEXT_DARK if size >= 9 else CMYK_TEXT_MID
        draw_text_block(c, s, fx=230, fy=caption_y,
                        font_size_figma=min(size, 12),
                        weight=weight, color=color,
                        max_w_figma=200, leading_figma=12)
        caption_y += 16

    draw_section_label(c, section)
    draw_page_number_safe(c, page_num)


def render_installer(c: Canvas, page: dict, page_num: str):
    """Installer card — eyebrow, photo, region, brand, name, body, contact."""
    fill_bleed(c, CMYK_CREAM)
    draw_text_block(c, "HUB CERTIFIED INSTALLER",
                    fx=30, fy=28, font_size_figma=6.5, weight=600,
                    color=HUBSS_ORANGE, tracking=1.6)

    img_ph = find_image_placeholder(page)
    img = safe_resolve(img_ph["text"] if img_ph else "")
    if img.exists():
        draw_image_at_figma(c, str(img), fx=30, fy=50, fw=390, fh=210)

    # Find specific texts
    region = ""
    brand = ""
    name = ""
    body = ""
    contacts = []
    for t in all_real_texts(page):
        s = t["text"].strip()
        size = t.get("size") or 0
        x = t.get("rel_x") or 0
        y = t.get("rel_y") or 0
        if 280 <= y <= 295 and x < 100:
            region = s
        elif 280 <= y <= 295 and x >= 150:
            brand = s
        elif 320 <= y <= 350 and size >= 12:
            name = s
        elif 355 <= y <= 380 and len(s) > 30:
            body = s
        elif 380 <= y <= 400 and len(s) < 60:
            contacts.append(s)

    # Region (left)
    if region:
        draw_text_block(c, region, fx=30, fy=288, font_size_figma=7.0,
                        weight=600, color=CMYK_TEXT_MID, tracking=0.6)
    # Brand (right of region)
    if brand:
        draw_text_block(c, brand.upper(), fx=240, fy=290,
                        font_size_figma=6.0, weight=600,
                        color=CMYK_TEXT_DARK, tracking=1.4,
                        max_w_figma=180, align="right")
    # Name
    if name:
        draw_text_block(c, name, fx=30, fy=320,
                        font_size_figma=18, weight=800,
                        color=CMYK_TEXT_DARK, max_w_figma=390)
    # Body
    if body:
        draw_text_block(c, body, fx=30, fy=355,
                        font_size_figma=9.0, color=CMYK_TEXT_DARK,
                        max_w_figma=390, leading_figma=14.0)
    # Contacts row — three slots
    cx_positions = [30, 160, 320]
    for i, ct in enumerate(contacts[:3]):
        color = HUBSS_ORANGE if "@" not in ct and "-" not in ct else CMYK_TEXT_MID
        draw_text_block(c, ct, fx=cx_positions[i], fy=400,
                        font_size_figma=7.0, color=color,
                        max_w_figma=130)

    draw_page_number_safe(c, page_num)


def render_lunch_learn(c: Canvas, page: dict, page_num: str):
    """L&L spread — big headline + photo + CTA."""
    fill_bleed(c, CMYK_CREAM)
    img_ph = find_image_placeholder(page)
    img = safe_resolve(img_ph["text"] if img_ph else "splash pad")
    if img.exists():
        draw_image_at_figma(c, str(img), fx=0, fy=0, fw=450, fh=170)

    # Headline
    draw_text_block(c, "See it. Spec it.",
                    fx=35, fy=200, font_size_figma=24, weight=800,
                    color=CMYK_TEXT_DARK)
    draw_text_block(c, "We'll bring lunch.",
                    fx=35, fy=232, font_size_figma=24, weight=800,
                    color=HUBSS_ORANGE)

    # Body
    body = ("Book a complimentary Lunch & Learn for your team. One hour. "
            "Real project walkthroughs, material specs, and Q&A — tailored "
            "to your upcoming jobs.")
    draw_text_block(c, body, fx=58, fy=275, font_size_figma=9.5,
                    color=CMYK_TEXT_DARK, max_w_figma=340, leading_figma=14.5)

    draw_text_block(c, "In-person or virtual.  Your office or your screen.",
                    fx=58, fy=325, font_size_figma=8.5, color=CMYK_TEXT_MID,
                    max_w_figma=340)
    draw_text_block(c, "We'll bring the food (or a $75 gift card for virtual sessions).",
                    fx=58, fy=340, font_size_figma=8.5, color=CMYK_TEXT_MID,
                    max_w_figma=340)

    # CTA pill
    cta_x, cta_y = figma_to_pdf(135, 380)
    c.setFillColor(HUBSS_ORANGE)
    c.roundRect(cta_x, cta_y, 180 * SCALE, 22 * SCALE, 4*SCALE, stroke=0, fill=1)
    draw_text_block(c, "BOOK NOW  →  hubss.com/lnl",
                    fx=135, fy=388, font_size_figma=8.5, weight=800,
                    color=HUBSS_WHITE, tracking=1.0,
                    max_w_figma=180, align="center")

    # Phone numbers
    draw_text_block(c, "West / Prairies  604.309.8212    Central / Maritimes  416.540.9287",
                    fx=25, fy=420, font_size_figma=6.5,
                    color=CMYK_TEXT_MID,
                    max_w_figma=400, align="center")
    draw_page_number_safe(c, page_num)


def render_back_cover(c: Canvas, page: dict, page_num: str):
    """Back cover — single combined wordmark, contact stack."""
    fill_bleed(c, HUBSS_NAVY_RICH)
    word_w = 240
    word_fx = (450 - word_w) / 2
    draw_combined_logo(c, fx=word_fx, fy=260, fw_figma=word_w, variant="white")

    draw_text_block(c, "Canada's Leading Decorative Pavement Solutions",
                    fx=25, fy=335, font_size_figma=7.5,
                    color=CMYK_TEXT_FAINT, align="center", max_w_figma=400)

    rule_y = 358
    rule_w = 32
    rx, ry = figma_to_pdf((450 - rule_w) / 2, rule_y)
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


def render_error_placeholder(c: Canvas, page: dict, page_num: str, msg: str):
    """Render a plain page if a renderer crashes — never break the build."""
    fill_bleed(c, CMYK_CREAM)
    draw_text_block(c, f"[render error on page {page.get('name')!r}]",
                    fx=36, fy=200, font_size_figma=10, color=CMYK_TEXT_MID,
                    max_w_figma=380)
    draw_text_block(c, msg[:200], fx=36, fy=220, font_size_figma=8,
                    color=CMYK_TEXT_FAINT, max_w_figma=380, leading_figma=12)
    draw_page_number_safe(c, page_num)
