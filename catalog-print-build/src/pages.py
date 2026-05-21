"""
Look-book page generators — trade-show edition.

Pages are either ALL IMAGE or ALL TYPE. Never both fighting.
- IMAGE pages: pure full-bleed photo. Page number only. No labels.
- TYPE pages: solid dark with big editorial typography. No image.

Subtraction wins. Negative space is a feature.
"""

from pathlib import Path
from reportlab.pdfgen.canvas import Canvas

from .specs import (
    PAGE_W, PAGE_H, TRIM_LEFT, TRIM_RIGHT, TRIM_BOTTOM, TRIM_TOP, BLEED,
    SAFE_LEFT, SAFE_RIGHT, SAFE_BOTTOM, SAFE_TOP, SAFE_W, SAFE_H,
    HUBSS_ORANGE, HUBSS_BLACK, HUBSS_RICH_BLACK, HUBSS_WHITE, HUBSS_NAVY, HUBSS_NAVY_RICH, HUBSS_ORANGE_DEEP, HUBSS_ORANGE_BLOOM, HUBSS_GOLD,
    HUBSS_GREY_DARK, HUBSS_GREY_MID, HUBSS_GREY_LIGHT,
    FONT_SANS_REG, FONT_SANS_BOLD, TYPE, ALLCAPS_TRACKING,
)
from .page_marks import draw_crop_marks, draw_safe_area_guide, draw_trim_guide, draw_bleed_fill
from .images import draw_image_box
from .type_setting import draw_text, draw_paragraph

ROOT = Path(__file__).resolve().parent.parent

_LOGO_READER_CACHE = {}
def _logo_reader():
    from reportlab.lib.utils import ImageReader
    if "white" not in _LOGO_READER_CACHE:
        p = (ROOT / "assets/booklet/_logo_white_small.png")
        _LOGO_READER_CACHE["white"] = ImageReader(str(p)) if p.exists() else None
    return _LOGO_READER_CACHE["white"]


def _img_path(rel):
    if not rel: return None
    p = ROOT / rel
    if p.exists(): return p
    if rel.startswith("../"):
        p2 = (ROOT / rel).resolve()
        if p2.exists(): return p2
    return None


def _placeholder(c, x, y, w, h, label):
    c.saveState()
    c.setFillColor(HUBSS_GREY_LIGHT)
    c.rect(x, y, w, h, fill=1, stroke=0)
    c.setFillColor(HUBSS_GREY_MID)
    c.setFont(FONT_SANS_REG, 8)
    c.drawCentredString(x + w/2, y + h/2, f"[ {label} ]")
    c.restoreState()


def _full_bleed(c, rel, label="hero"):
    p = _img_path(rel)
    if p:
        return draw_image_box(c, p, 0, 0, PAGE_W, PAGE_H, cover=True)
    _placeholder(c, 0, 0, PAGE_W, PAGE_H, label)
    return None


def _orange_rule(c, x, y, length=22):
    c.saveState()
    c.setStrokeColor(HUBSS_ORANGE)
    c.setLineWidth(1.4)
    c.line(x, y, x + length, y)
    c.restoreState()


def _page_number(c, page_num, on_dark=True):
    c.setFillColor(HUBSS_GREY_LIGHT if on_dark else HUBSS_GREY_MID)
    c.setFont(FONT_SANS_REG, 7)
    c.drawRightString(SAFE_RIGHT, SAFE_BOTTOM + 2, str(page_num).zfill(2))


def _bottom_scrim(c, height_frac=0.4, alpha=0.62):
    c.saveState()
    c.setFillColor(HUBSS_BLACK)
    c.setFillAlpha(alpha)
    c.rect(0, 0, PAGE_W, PAGE_H * height_frac, fill=1, stroke=0)
    c.setFillAlpha(1.0)
    c.restoreState()



def _orange_bloom(c, corner="top_left", radius_frac=0.65, opacity=0.20):
    """Smooth radial bloom using circles. Simulates the website hero's
    orange atmospheric corner glow."""
    cx, cy = {
        "top_left":     (0, PAGE_H),
        "top_right":    (PAGE_W, PAGE_H),
        "bottom_left":  (0, 0),
        "bottom_right": (PAGE_W, 0),
    }[corner]
    max_r = PAGE_W * radius_frac
    c.saveState()
    steps = 40  # more steps = smoother gradient
    for i in range(steps):
        # i=0 is largest faintest outer ring; i=steps-1 is smallest brightest center
        t = i / (steps - 1)
        r = max_r * (1 - t * 0.92)
        # Outer rings = orange, inner rings = gold for a warm core
        if t < 0.45:
            c.setFillColor(HUBSS_ORANGE_BLOOM)
        elif t < 0.75:
            c.setFillColor(HUBSS_ORANGE_DEEP)
        else:
            c.setFillColor(HUBSS_GOLD)
        # Alpha increases toward center (gentle exponential)
        alpha = opacity * (0.05 + (t ** 1.4) * 0.95)
        c.setFillAlpha(alpha)
        c.circle(cx, cy, r, fill=1, stroke=0)
    c.setFillAlpha(1.0)
    c.restoreState()


def _navy_to_orange_band(c, x, y, w, h, vertical=True):
    """Faked linear gradient — orange to deep navy, used as a feature accent."""
    c.saveState()
    steps = 24
    for i in range(steps):
        t = i / (steps - 1)
        # mix orange (t=0) -> navy (t=1)
        alpha = 1.0
        if t < 0.5:
            color = HUBSS_GOLD if t < 0.2 else HUBSS_ORANGE
            blend_alpha = 1.0 - t * 1.6
        else:
            color = HUBSS_NAVY
            blend_alpha = (t - 0.5) * 2
        c.setFillColor(color)
        c.setFillAlpha(blend_alpha if blend_alpha > 0 else 0.05)
        if vertical:
            seg_h = h / steps
            c.rect(x, y + (steps - 1 - i) * seg_h, w, seg_h + 1, fill=1, stroke=0)
        else:
            seg_w = w / steps
            c.rect(x + i * seg_w, y, seg_w + 1, h, fill=1, stroke=0)
    c.setFillAlpha(1.0)
    c.restoreState()


def _tracked_caps(c, text, x, y, size=8, color=HUBSS_ORANGE):
    if color is not None: c.setFillColor(color)
    text_obj = c.beginText()
    text_obj.setFont(FONT_SANS_BOLD, size)
    text_obj.setCharSpace(ALLCAPS_TRACKING)
    text_obj.setTextOrigin(x, y)
    text_obj.textOut(text.upper())
    c.drawText(text_obj)


# ════════════════════════════════════════════════════════════════════
# COVER
# ════════════════════════════════════════════════════════════════════
def render_cover(c, data):
    cover = data["cover"]
    if not _full_bleed(c, cover.get("hero_image"), "cover"):
        draw_bleed_fill(c, HUBSS_NAVY_RICH)

    _bottom_scrim(c, height_frac=0.50, alpha=0.7)

    # Orange atmospheric bloom — top-left, like the website hero

    # Tiny wordmark, top-left
    reader = _logo_reader()
    if reader is not None:
        h = 16
        w = h * (1000 / 237.0)
        c.drawImage(reader, SAFE_LEFT, SAFE_TOP - h - 2, w, h,
                    preserveAspectRatio=True, mask="auto")

    # Edition tracked-caps ABOVE the headline so they never overlap
    _tracked_caps(c, cover.get("eyebrow", "Catalogue 2026"),
                  SAFE_LEFT, SAFE_BOTTOM + 130, size=9, color=HUBSS_ORANGE)

    # Headline at display 36pt (now bigger), pulls down to occupy bottom
    draw_paragraph(c, cover["headline"], SAFE_LEFT, SAFE_BOTTOM + 110,
                   SAFE_W, style="display", font=FONT_SANS_BOLD,
                   color=HUBSS_WHITE, max_lines=2)


# ════════════════════════════════════════════════════════════════════
# INSIDE FRONT — single declarative line on solid dark
# ════════════════════════════════════════════════════════════════════
def render_inside_front(c, data):
    inf = data.get("inside_front", {})
    draw_bleed_fill(c, HUBSS_NAVY_RICH)
    _orange_rule(c, SAFE_LEFT, SAFE_TOP - 22, 28)
    quote = inf.get("quote", "")
    draw_paragraph(c, quote, SAFE_LEFT, PAGE_H * 0.55, SAFE_W,
                   style="display", font=FONT_SANS_BOLD,
                   color=HUBSS_WHITE, max_lines=4)


# ════════════════════════════════════════════════════════════════════
# MANIFESTO
# ════════════════════════════════════════════════════════════════════
def render_manifesto(c, data):
    m = data.get("manifesto", {})
    draw_bleed_fill(c, HUBSS_NAVY_RICH)
    _orange_rule(c, SAFE_LEFT, SAFE_TOP - 22, 28)
    headline_y = draw_paragraph(c, m.get("headline", ""),
                                SAFE_LEFT, SAFE_TOP - 50, SAFE_W,
                                style="h1", font=FONT_SANS_BOLD,
                                color=HUBSS_WHITE, max_lines=2)
    draw_paragraph(c, m.get("body", ""),
                   SAFE_LEFT, headline_y - 26, SAFE_W,
                   style="body", font=FONT_SANS_REG,
                   color=HUBSS_GREY_LIGHT, max_lines=14)


# ════════════════════════════════════════════════════════════════════
# SECTION DIVIDER — one word on dark, with orange edge band
# ════════════════════════════════════════════════════════════════════
def render_section_divider(c, divider, page_num=None):
    """Full-bleed orange brand spread. Pure colour moment between sections."""
    draw_bleed_fill(c, HUBSS_ORANGE)

    # Tracked-caps eyebrow in navy
    _tracked_caps(c, divider.get("eyebrow", ""),
                  SAFE_LEFT, PAGE_H * 0.50 + 50, size=10, color=HUBSS_NAVY_RICH)

    # Big title in white at the page midline
    draw_paragraph(c, divider.get("title", ""),
                   SAFE_LEFT, PAGE_H * 0.50 + 12, SAFE_W,
                   style="display", font=FONT_SANS_BOLD,
                   color=HUBSS_WHITE, max_lines=1)

    # Subtitle in navy underneath, body size
    draw_paragraph(c, divider.get("subtitle", ""),
                   SAFE_LEFT, PAGE_H * 0.50 - 32, SAFE_W * 0.85,
                   style="body", font=FONT_SANS_REG,
                   color=HUBSS_NAVY_RICH, max_lines=3)

    # Page number in navy (subtle on orange)
    if page_num:
        c.setFillColor(HUBSS_NAVY_RICH)
        c.setFont(FONT_SANS_REG, 7)
        c.drawRightString(SAFE_RIGHT, SAFE_BOTTOM + 2, str(page_num).zfill(2))


# ════════════════════════════════════════════════════════════════════
# PROJECT — pure image page (no text, no labels)
# ════════════════════════════════════════════════════════════════════
def render_project_image(c, data, project, page_num):
    if not _full_bleed(c, project.get("image"), project["title"]):
        draw_bleed_fill(c, HUBSS_NAVY_RICH)
    _page_number(c, page_num, on_dark=True)


# ════════════════════════════════════════════════════════════════════
# PROJECT TEXT — solid dark page, title + location + summary
# ════════════════════════════════════════════════════════════════════
def render_project_text(c, data, project, page_num):
    """Museum wall card: bold sans title + italic serif summary for editorial counterpoint.
    Per Alexander, the centers reinforce each other — the bold name and the lyrical italic
    establish a typographic relationship that gives the page life."""
    draw_bleed_fill(c, HUBSS_NAVY_RICH)

    # Title — display 36pt sans, dominant
    title_y = draw_paragraph(c, project["title"],
                             SAFE_LEFT, PAGE_H * 0.58, SAFE_W,
                             style="display", font=FONT_SANS_BOLD,
                             color=HUBSS_WHITE, max_lines=2)

    # Location, tracked caps, in orange — under title with breathing room
    _tracked_caps(c, project.get("location", ""),
                  SAFE_LEFT, title_y - 36, size=9, color=HUBSS_ORANGE)

    # Summary — italic serif for editorial counterpoint to the bold sans title.
    # The italic Times sets the line apart visually as commentary, like newspaper standfirst type.
    draw_paragraph(c, project.get("summary", ""),
                   SAFE_LEFT, title_y - 80, SAFE_W,
                   style="h2", font="Times-Italic",
                   color=HUBSS_GREY_LIGHT, max_lines=4)

    _page_number(c, page_num, on_dark=True)


# ════════════════════════════════════════════════════════════════════
# PRODUCT IMAGE — full-bleed hero, NAME big at bottom
# ════════════════════════════════════════════════════════════════════
def render_product_image(c, data, product, page_num):
    """Product hero: full-bleed photo + product LOGO at bottom (or name if no logo)."""
    if not _full_bleed(c, product.get("hero_image"), product["name"]):
        draw_bleed_fill(c, HUBSS_NAVY_RICH)
    _bottom_scrim(c, height_frac=0.32, alpha=0.7)

    # If we have a logo PNG, place the logo. Else fall back to typed name.
    logo_rel = product.get("logo")
    logo_special = product.get("logo_special")
    if logo_rel and _img_path(logo_rel):
        from reportlab.lib.utils import ImageReader
        from PIL import Image
        p = _img_path(logo_rel)
        with Image.open(p) as im:
            iw, ih = im.size
            aspect = iw / ih
        # Rainbow StreetBond gets BIGGER, centered, more breathing room
        if logo_special == "rainbow":
            target_h = 80
            max_w = SAFE_W * 0.7
        else:
            target_h = 30
            max_w = SAFE_W * 0.7
        target_w = target_h * aspect
        if target_w > max_w:
            target_w = max_w
            target_h = target_w / aspect
        # Center horizontally, place at consistent baseline
        x = (PAGE_W - target_w) / 2 if logo_special == "rainbow" else SAFE_LEFT
        y = SAFE_BOTTOM + 30
        c.drawImage(ImageReader(str(p)), x, y, target_w, target_h,
                    preserveAspectRatio=True, mask="auto")
    else:
        # Fall back: typed name
        draw_paragraph(c, product["name"], SAFE_LEFT, SAFE_BOTTOM + 55,
                       SAFE_W, style="display", font=FONT_SANS_BOLD,
                       color=HUBSS_WHITE, max_lines=1)
    _page_number(c, page_num, on_dark=True)


# ════════════════════════════════════════════════════════════════════
# PRODUCT TEXT — solid dark page with description
# ════════════════════════════════════════════════════════════════════
def render_product_text(c, data, product, page_num):
    """Billboard with atmosphere. Tagline center, spec line tiny at bottom."""
    draw_bleed_fill(c, HUBSS_NAVY_RICH)

    # Tagline at display size, sitting at the page midline.
    draw_paragraph(c, product.get("tagline", ""),
                   SAFE_LEFT, PAGE_H * 0.58, SAFE_W,
                   style="display", font=FONT_SANS_BOLD,
                   color=HUBSS_WHITE, max_lines=3)

    # Spec line at bottom in tracked-caps orange.
    if product.get("spec_line"):
        _tracked_caps(c, product["spec_line"],
                      SAFE_LEFT, SAFE_BOTTOM + 24, size=7, color=HUBSS_ORANGE)

    _page_number(c, page_num, on_dark=True)


# ════════════════════════════════════════════════════════════════════
# PRODUCT GALLERY IMAGE — pure photo, no text
# ════════════════════════════════════════════════════════════════════
def render_product_example(c, data, product, image_rel, page_num):
    if not _full_bleed(c, image_rel, product["name"]):
        draw_bleed_fill(c, HUBSS_BLACK)
    _page_number(c, page_num, on_dark=True)


# ════════════════════════════════════════════════════════════════════
# APPLICATION — full-bleed photo, name at bottom display size
# ════════════════════════════════════════════════════════════════════
def render_application(c, data, app, page_num):
    if not _full_bleed(c, app.get("image"), app["name"]):
        draw_bleed_fill(c, HUBSS_BLACK)
    _bottom_scrim(c, height_frac=0.28, alpha=0.65)
    draw_paragraph(c, app["name"], SAFE_LEFT, SAFE_BOTTOM + 40,
                   SAFE_W, style="display", font=FONT_SANS_BOLD,
                   color=HUBSS_WHITE, max_lines=1)
    _page_number(c, page_num, on_dark=True)


# ════════════════════════════════════════════════════════════════════
# CITIES SERVED — type only, two columns
# ════════════════════════════════════════════════════════════════════
def render_cities(c, data, page_num):
    cs = data.get("cities_served", {})
    draw_bleed_fill(c, HUBSS_NAVY_RICH)
    _orange_rule(c, SAFE_LEFT, SAFE_TOP - 22, 28)
    _tracked_caps(c, "Coast to coast", SAFE_LEFT, SAFE_TOP - 38, size=9, color=HUBSS_ORANGE)
    draw_paragraph(c, cs.get("title", "Trusted, by name."),
                   SAFE_LEFT, SAFE_TOP - 70, SAFE_W,
                   style="h1", font=FONT_SANS_BOLD,
                   color=HUBSS_WHITE, max_lines=2)
    cities = cs.get("list", [])
    col_w = SAFE_W / 2
    line_h = 17
    y_start = SAFE_TOP - 130
    half = (len(cities) + 1) // 2
    cols = [cities[:half], cities[half:]]
    for col_i, col in enumerate(cols):
        cx = SAFE_LEFT + col_i * col_w
        cy = y_start
        for city in col:
            _tracked_caps(c, city, cx, cy, size=10, color=HUBSS_WHITE)
            cy -= line_h
    _page_number(c, page_num, on_dark=True)


# ════════════════════════════════════════════════════════════════════
# CONTACT
# ════════════════════════════════════════════════════════════════════
def render_contact(c, data, page_num):
    contact = data["contact"]
    if not _full_bleed(c, contact.get("cta_image"), "contact"):
        draw_bleed_fill(c, HUBSS_NAVY_RICH)
    _bottom_scrim(c, height_frac=0.55, alpha=0.78)
    _orange_rule(c, SAFE_LEFT, SAFE_BOTTOM + 130, 28)
    draw_paragraph(c, "Call us.", SAFE_LEFT, SAFE_BOTTOM + 120, SAFE_W,
                   style="display", font=FONT_SANS_BOLD,
                   color=HUBSS_WHITE, max_lines=1)
    col_w = (SAFE_W - 12) / 2
    for i, key in enumerate(("east", "west")):
        office = contact[key]
        cx = SAFE_LEFT + i * (col_w + 12)
        cy = SAFE_BOTTOM + 70
        c.setFillColor(HUBSS_WHITE)
        c.setFont(FONT_SANS_BOLD, 11)
        c.drawString(cx, cy, office["contact"])
        c.setFont(FONT_SANS_REG, 9)
        c.setFillColor(HUBSS_ORANGE)
        c.drawString(cx, cy - 14, office["phone"])
        c.setFillColor(HUBSS_GREY_LIGHT)
        c.setFont(FONT_SANS_REG, 8)
        c.drawString(cx, cy - 26, office["email"])
        c.drawString(cx, cy - 38, office["city"])
    c.setFillColor(HUBSS_ORANGE)
    c.setFont(FONT_SANS_BOLD, 9)
    c.drawString(SAFE_LEFT, SAFE_BOTTOM + 16, contact.get("url", "hubss.com"))


# ════════════════════════════════════════════════════════════════════
# BACK COVER
# ════════════════════════════════════════════════════════════════════
def render_back_cover(c, data):
    bc = data["back_cover"]
    if not _full_bleed(c, bc.get("hero_image"), "back cover"):
        draw_bleed_fill(c, HUBSS_BLACK)
    _bottom_scrim(c, height_frac=0.32, alpha=0.65)
    reader = _logo_reader()
    if reader is not None:
        h = 14
        w = h * (1000 / 237.0)
        c.drawImage(reader, SAFE_LEFT, SAFE_TOP - h - 2, w, h,
                    preserveAspectRatio=True, mask="auto")
    if bc.get("tagline"):
        draw_paragraph(c, bc["tagline"], SAFE_LEFT, SAFE_BOTTOM + 50,
                       SAFE_W, style="h2", font=FONT_SANS_BOLD,
                       color=HUBSS_WHITE, max_lines=3)
    c.setFillColor(HUBSS_ORANGE)
    c.setFont(FONT_SANS_BOLD, 11)
    c.drawString(SAFE_LEFT, SAFE_BOTTOM + 18, bc.get("url", "hubss.com"))


def add_page_marks(c, show_guides=False):
    draw_crop_marks(c)
    if show_guides:
        draw_trim_guide(c)
        draw_safe_area_guide(c)
