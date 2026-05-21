"""
HUB Surface Systems — 2026 Editorial Lookbook (24 pages, 5x5" CMYK).

Complete reset from the 72-page programmatic catalog. This is editorial-grade:
fewer, stronger spreads. Full-bleed hero photography. Generous whitespace.
Refined typography. Aesop / Apple product book sensibility.

Page plan (24 pages, multiple of 4 for binding):

  1.  Cover                           — UBC Crosswalk, wordmark
  2.  Half-title                      — Cream, restraint
  3.  Manifesto                       — Editorial display + signature
  4.  PRODUCTS opener                 — Full-bleed photo + section title
  5.  TrafficPatternsXD hero          — Full-bleed
  6.  TrafficPatternsXD spec card     — Cream, single column
  7.  StreetBond hero                 — Full-bleed
  8.  StreetBond spec card            — Cream
  9.  StreetPrint hero                — Full-bleed
 10.  StreetPrint spec card           — Cream
 11.  DecoMark hero                   — Full-bleed
 12.  DecoMark spec card              — Cream
 13.  PROJECTS opener                 — Full-bleed photo + section title
 14.  White Rock Pier                 — Full-bleed
 15.  White Rock Pier — story          — Cream + small detail
 16.  UBC Musqueam                    — Full-bleed
 17.  UBC Musqueam — story             — Cream + small detail
 18.  Maple Ridge                     — Full-bleed
 19.  Maple Ridge — story              — Cream + small detail
 20.  SPECIFICATION opener            — Cream, typographic
 21.  Technical reference             — Spec table for all products
 22.  Cities served                   — Tracked-caps list
 23.  Contact                         — Two regional offices
 24.  Back cover                      — Navy wordmark
"""
from __future__ import annotations
from pathlib import Path

from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import CMYKColor

from .specs import (
    PAGE_SIZE, PAGE_W, PAGE_H, BLEED, TRIM_W, TRIM_H,
    HUBSS_ORANGE, HUBSS_NAVY_RICH, HUBSS_WHITE,
    FONT_SANS_BOLD, FONT_SANS_REG, FONT_SANS_OBL, FONT_SERIF,
)
from .figma_render import (
    SCALE, fs, figma_to_pdf, fill_bleed,
    draw_image_at_figma, draw_full_bleed_image, draw_text_block,
    CMYK_CREAM, CMYK_TEXT_DARK, CMYK_TEXT_MID, CMYK_TEXT_FAINT,
)
from .images import draw_image_box
from . import page_marks as PM


ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets" / "booklet"
PUBLIC_IMG = ROOT.parent / "public" / "images"
HUBSS_LOGOS = PUBLIC_IMG / "assets" / "logos" / "hubss-logos"
PRODUCTS_DIR = PUBLIC_IMG / "products"
APPS_DIR = PUBLIC_IMG / "applications"

OUT = ROOT / "output" / "HUBSS_LookBook_2026_v5_editorial.pdf"

LOGO_WHITE = HUBSS_LOGOS / "hubss-logo-white-large.png"
LOGO_COLOR = HUBSS_LOGOS / "hubss-logo-color.png"
LOGO_ASPECT = 2432 / 701

# --- Hand-curated photo picks for each editorial spread ---
PHOTOS = {
    "cover":         ASSETS / "UBC Crosswalk 1.png",
    "products_open": ASSETS / "Intersection installation TPXD 1.png",
    "tpxd_hero":     ASSETS / "Whiterock-Pier-Crosswalk-TrafficPatternsXD-1 1.png",
    "streetbond_hero": ASSETS / "StreetBond Splash Pad 1.png",
    "streetprint_hero": ASSETS / "StreetPrint - Maridian Surrey 1.png",
    "decomark_hero": ASSETS / "DecoMark community park 1.png",
    "projects_open": ASSETS / "UBC Crosswalk 1.png",
    "white_rock":    ASSETS / "Whiterock-Pier-Crosswalk-TrafficPatternsXD-1 1.png",
    "white_rock_detail": ASSETS / "IMG_1347 1.png",
    "ubc":           ASSETS / "UBC Crosswalk 1.png",
    "ubc_detail":    ASSETS / "aboriginal crosswalk 1.png",
    "maple_ridge":   ASSETS / "StreetBond - path 1.png",
    "maple_ridge_detail": ASSETS / "StreetBond Circle Design 1.png",
}


# ============================================================
# Type styles — ONE clear hierarchy
# ============================================================
def display_size_for(text):
    """Pick a display size that scales gracefully with text length."""
    n = len(text)
    if n < 8:   return 56
    if n < 14:  return 44
    if n < 25:  return 34
    if n < 40:  return 26
    return 22


# ============================================================
# Reusable elements
# ============================================================
def draw_logo_white(c, fx, fy, fw_figma):
    """White HUBSS combined wordmark."""
    if not LOGO_WHITE.exists(): return
    fh = fw_figma / LOGO_ASPECT
    px = BLEED + fx * SCALE
    py = BLEED + TRIM_H - (fy + fh) * SCALE
    w = fw_figma * SCALE
    h = fh * SCALE
    draw_image_box(c, str(LOGO_WHITE), px, py, w, h, cover=False, convert_to_cmyk=False)


def draw_logo_color(c, fx, fy, fw_figma):
    if not LOGO_COLOR.exists(): return
    fh = fw_figma / LOGO_ASPECT
    px = BLEED + fx * SCALE
    py = BLEED + TRIM_H - (fy + fh) * SCALE
    w = fw_figma * SCALE
    h = fh * SCALE
    draw_image_box(c, str(LOGO_COLOR), px, py, w, h, cover=False, convert_to_cmyk=False)


def tracked_caps(c, text, fx, fy, *, size=7.5, color=None, max_w_figma=200, align="left"):
    """Editorial tracked-caps label."""
    color = color if color is not None else CMYK_TEXT_MID
    draw_text_block(c, text.upper(), fx=fx, fy=fy,
                    font_size_figma=size, weight=600, color=color,
                    tracking=2.4, max_w_figma=max_w_figma, align=align)


def page_number(c, num):
    if not num: return
    draw_text_block(c, num, fx=222, fy=425, font_size_figma=6.5,
                    color=CMYK_TEXT_FAINT, align="center", max_w_figma=10)


def orange_dot(c, fx, fy, *, r_figma=2.0):
    px, py = figma_to_pdf(fx, fy)
    c.setFillColor(HUBSS_ORANGE)
    c.circle(px, py, r_figma * SCALE, stroke=0, fill=1)


def thin_rule(c, fx, fy, w_figma, *, color=None, weight_pt=0.6):
    color = color if color is not None else CMYK_TEXT_FAINT
    px, py = figma_to_pdf(fx, fy)
    c.setFillColor(color)
    c.rect(px, py, w_figma * SCALE, weight_pt, stroke=0, fill=1)


# ============================================================
# Page renderers
# ============================================================
def page_cover(c):
    """Full-bleed UBC Crosswalk + bottom-left wordmark, no scrim."""
    fill_bleed(c, CMYK_CREAM)
    img = PHOTOS["cover"]
    if img.exists():
        draw_full_bleed_image(c, str(img))

    # White wordmark, bottom-left, prominent but restrained
    draw_logo_white(c, fx=28, fy=388, fw_figma=160)
    # Year to right of wordmark
    tracked_caps(c, "Catalogue 2026", fx=200, fy=410, size=7.0,
                 color=HUBSS_WHITE, max_w_figma=120)


def page_half_title(c):
    """Restraint. Center-set wordmark + edition line."""
    fill_bleed(c, CMYK_CREAM)
    # Centered logo (color version on cream)
    draw_logo_color(c, fx=(450-180)/2, fy=205, fw_figma=180)
    # Edition line below
    tracked_caps(c, "Catalogue   ·   2026", fx=25, fy=270, size=7.5,
                 color=CMYK_TEXT_MID, align="center", max_w_figma=400)
    # Tiny orange dot, far below — quiet brand mark
    orange_dot(c, fx=225, fy=405, r_figma=2.5)


def page_manifesto(c):
    """Editorial display + body + signature."""
    fill_bleed(c, CMYK_CREAM)
    # Eyebrow
    tracked_caps(c, "A Word from HUB", fx=40, fy=70, size=7.5,
                 color=HUBSS_ORANGE)
    # Display headline (editorial)
    draw_text_block(c, "Surfaces,",
                    fx=40, fy=120, font_size_figma=44, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-1.2)
    draw_text_block(c, "in service of",
                    fx=40, fy=170, font_size_figma=44, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-1.2)
    draw_text_block(c, "the public.",
                    fx=40, fy=220, font_size_figma=44, weight=800,
                    color=HUBSS_ORANGE, tracking=-1.2)
    # Body
    draw_text_block(
        c,
        "For thirty years we have built the ground beneath Canada's most "
        "lived-on streets. Crosswalks. Plazas. Bus lanes. Runways. We do "
        "not make pavement. We make the public realm.",
        fx=40, fy=300, font_size_figma=10, color=CMYK_TEXT_DARK,
        max_w_figma=320, leading_figma=16,
    )
    # Signature line
    thin_rule(c, fx=40, fy=395, w_figma=24, color=HUBSS_ORANGE, weight_pt=1.2)
    tracked_caps(c, "HUB Surface Systems   /   Established 1994",
                 fx=40, fy=410, size=6.5, color=CMYK_TEXT_FAINT, max_w_figma=350)


def page_section_open(c, section_no, title, photo_path, *, on_dark=True):
    """Full-bleed hero with bottom-left section indicator + title."""
    fill_bleed(c, CMYK_CREAM)
    if photo_path.exists():
        draw_full_bleed_image(c, str(photo_path))

    # Bottom-left, two lines: small caps section, big editorial title
    text_color = HUBSS_WHITE if on_dark else CMYK_TEXT_DARK
    tracked_caps(c, f"Section {section_no}", fx=30, fy=350, size=7.5,
                 color=text_color, max_w_figma=140)
    draw_text_block(c, title,
                    fx=30, fy=370, font_size_figma=44, weight=800,
                    color=text_color, tracking=-1.2)


def page_product_hero(c, product_name, tagline, photo_path):
    """Full-bleed product photo + bottom-left product name and one-line tagline."""
    fill_bleed(c, CMYK_CREAM)
    if photo_path.exists():
        draw_full_bleed_image(c, str(photo_path))

    # Tagline (italic editorial)
    draw_text_block(c, tagline,
                    fx=30, fy=370, font_size_figma=18, weight=400,
                    color=HUBSS_WHITE, tracking=0,
                    figma_font="serif")  # serif italic accent
    # Product name
    tracked_caps(c, product_name, fx=30, fy=410, size=7.5,
                 color=HUBSS_WHITE, max_w_figma=200)


def page_product_spec(c, *, eyebrow, name, tagline, callout, callout_unit,
                       body, uses):
    """Cream spec card — single confident column, big callout."""
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, eyebrow, fx=30, fy=40, size=7.0, color=HUBSS_ORANGE)

    # Product name (display)
    draw_text_block(c, name,
                    fx=30, fy=68, font_size_figma=display_size_for(name),
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8)

    # Italic tagline below name (Times-Italic for editorial counterpoint)
    draw_text_block(c, tagline,
                    fx=30, fy=125, font_size_figma=11, weight=400,
                    color=CMYK_TEXT_MID, figma_font="serif",
                    max_w_figma=380, leading_figma=16)

    # Callout — big number
    draw_text_block(c, callout,
                    fx=30, fy=180, font_size_figma=42, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-0.8)
    # Tiny unit caption
    tracked_caps(c, callout_unit, fx=30, fy=232, size=6.5,
                 color=CMYK_TEXT_MID, max_w_figma=380)

    # Body
    draw_text_block(c, body,
                    fx=30, fy=270, font_size_figma=9.5, color=CMYK_TEXT_DARK,
                    max_w_figma=380, leading_figma=15)

    # Use cases pills row (bottom)
    pill_y = 410
    pill_w = 88
    pill_gap = 4
    pill_h = 18
    total_w = len(uses) * pill_w + (len(uses) - 1) * pill_gap
    pill_x_start = (450 - total_w) / 2
    for i, use in enumerate(uses):
        x = pill_x_start + i * (pill_w + pill_gap)
        px, py = figma_to_pdf(x, pill_y + pill_h)
        # Pill background
        c.setFillColor(CMYKColor(0, 0, 0, 0.05))
        c.roundRect(px, py, pill_w * SCALE, pill_h * SCALE,
                    3 * SCALE, stroke=0, fill=1)
        # Label centered in pill
        draw_text_block(c, use, fx=x, fy=pill_y + 5,
                        font_size_figma=6.5, weight=600,
                        color=CMYK_TEXT_DARK,
                        tracking=1.2,
                        max_w_figma=pill_w, align="center")


def page_project_hero(c, project_name, location, product, photo_path):
    """Full-bleed project photo + bottom corners."""
    fill_bleed(c, CMYK_CREAM)
    if photo_path.exists():
        draw_full_bleed_image(c, str(photo_path))

    # Bottom-left: location (tracked caps)
    tracked_caps(c, location, fx=30, fy=410, size=7.5,
                 color=HUBSS_WHITE, max_w_figma=200)
    # Bottom-right: product (tracked caps, orange)
    tracked_caps(c, product, fx=200, fy=410, size=7.5,
                 color=HUBSS_ORANGE, align="right", max_w_figma=220)
    # Project title — top-left corner, editorial italic
    draw_text_block(c, project_name,
                    fx=30, fy=370, font_size_figma=22, weight=800,
                    color=HUBSS_WHITE, tracking=-0.5)


def page_project_story(c, *, eyebrow, title, story, detail_photo):
    """Cream — story + small detail photo."""
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, eyebrow, fx=30, fy=40, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, title,
                    fx=30, fy=68, font_size_figma=display_size_for(title),
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8,
                    max_w_figma=380)

    draw_text_block(c, story,
                    fx=30, fy=140, font_size_figma=10, color=CMYK_TEXT_DARK,
                    max_w_figma=380, leading_figma=16)

    # Detail photo bottom half
    if detail_photo and detail_photo.exists():
        draw_image_at_figma(c, str(detail_photo), fx=30, fy=260, fw=390, fh=150)


def page_specification_open(c):
    """Quiet typographic section opener."""
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "Section Three", fx=30, fy=180, size=7.5,
                 color=HUBSS_ORANGE)
    draw_text_block(c, "Specification.",
                    fx=30, fy=205, font_size_figma=44, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-1.2)
    draw_text_block(c, "Engineering, durability, and where each system performs.",
                    fx=30, fy=260, font_size_figma=11, weight=400,
                    color=CMYK_TEXT_MID, figma_font="serif",
                    max_w_figma=380, leading_figma=16)


def page_technical_reference(c):
    """Compact spec table for all 11 products."""
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "Product Reference", fx=30, fy=40, size=7.0,
                 color=HUBSS_ORANGE)
    draw_text_block(c, "The systems.",
                    fx=30, fy=68, font_size_figma=28, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-0.8)

    # Two-column table
    products = [
        ("TrafficPatternsXD", "150 mil",     "Heavy-duty thermoplastic"),
        ("TrafficPatterns",   "125 mil",     "Standard thermoplastic"),
        ("StreetBond",        "Acrylic",     "Coloured pavement coating"),
        ("StreetBond SR",     "Solar Refl.", "LEED-contributing surface"),
        ("StreetPrint",       "Stamped",     "Genuine stamped asphalt"),
        ("DecoMark",          "Custom",      "Graphic thermoplastic"),
        ("DuraTherm",         "Inlaid",      "Snowplow-safe flush"),
        ("DuraShield",        "Penetrating", "Asphalt rejuvenator"),
        ("PreMark",           "Pre-cut",     "Bike infrastructure"),
        ("AirMark",           "Aviation",    "Airfield markings"),
        ("MMAX",              "MMA Resin",   "Coloured lane treatment"),
    ]
    y = 130
    for name, key, desc in products:
        # Name (bold)
        draw_text_block(c, name, fx=30, fy=y, font_size_figma=10,
                        weight=800, color=CMYK_TEXT_DARK)
        # Key spec (orange small)
        tracked_caps(c, key, fx=180, fy=y, size=6.5,
                     color=HUBSS_ORANGE, max_w_figma=120)
        # Description
        draw_text_block(c, desc, fx=270, fy=y, font_size_figma=8.5,
                        color=CMYK_TEXT_MID, max_w_figma=160)
        # Hairline divider
        thin_rule(c, fx=30, fy=y + 16, w_figma=390, color=CMYK_TEXT_FAINT, weight_pt=0.3)
        y += 22


def page_cities(c):
    """Cities served — tracked caps list."""
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "Specified Coast to Coast", fx=30, fy=40, size=7.0,
                 color=HUBSS_ORANGE)
    draw_text_block(c, "Trusted, by name.",
                    fx=30, fy=68, font_size_figma=28, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-0.8)

    cities = [
        "City of Toronto",     "City of Vancouver",
        "York Region",         "TransLink",
        "City of Ottawa",      "UBC",
        "City of Calgary",     "City of Surrey",
        "City of Brampton",    "City of Edmonton",
        "City of Mississauga", "City of Winnipeg",
        "Region of Peel",      "City of Burnaby",
        "Halifax Regional",    "City of Kelowna",
        "Richmond Hill",       "City of Saskatoon",
    ]
    col1_x = 30
    col2_x = 230
    y = 140
    for i in range(0, len(cities), 2):
        # Bullet
        orange_dot(c, fx=col1_x - 8, fy=y + 4, r_figma=1.4)
        draw_text_block(c, cities[i], fx=col1_x, fy=y,
                        font_size_figma=9, weight=600, color=CMYK_TEXT_DARK,
                        tracking=0.4)
        if i + 1 < len(cities):
            orange_dot(c, fx=col2_x - 8, fy=y + 4, r_figma=1.4)
            draw_text_block(c, cities[i + 1], fx=col2_x, fy=y,
                            font_size_figma=9, weight=600, color=CMYK_TEXT_DARK,
                            tracking=0.4)
        y += 16


def page_contact(c):
    """Two regional offices."""
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "Two Offices, One Network", fx=30, fy=40, size=7.0,
                 color=HUBSS_ORANGE)
    draw_text_block(c, "Speak with HUB.",
                    fx=30, fy=68, font_size_figma=28, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-0.8)

    # Western Canada
    tracked_caps(c, "Western Canada", fx=30, fy=160, size=6.5,
                 color=CMYK_TEXT_FAINT)
    draw_text_block(c, "Cleve Stordy",
                    fx=30, fy=180, font_size_figma=14, weight=800,
                    color=CMYK_TEXT_DARK)
    draw_text_block(c, "cleve.stordy@hubss.com",
                    fx=30, fy=205, font_size_figma=9.5, color=HUBSS_ORANGE)
    draw_text_block(c, "604.309.8212",
                    fx=30, fy=222, font_size_figma=9.5, color=CMYK_TEXT_MID)
    draw_text_block(c, "Ladysmith, British Columbia",
                    fx=30, fy=242, font_size_figma=8.5, weight=400,
                    color=CMYK_TEXT_MID, figma_font="serif")

    # Eastern Canada
    tracked_caps(c, "Eastern Canada", fx=240, fy=160, size=6.5,
                 color=CMYK_TEXT_FAINT)
    draw_text_block(c, "Doug Bain",
                    fx=240, fy=180, font_size_figma=14, weight=800,
                    color=CMYK_TEXT_DARK)
    draw_text_block(c, "doug.bain@hubss.com",
                    fx=240, fy=205, font_size_figma=9.5, color=HUBSS_ORANGE)
    draw_text_block(c, "416.540.9287",
                    fx=240, fy=222, font_size_figma=9.5, color=CMYK_TEXT_MID)
    draw_text_block(c, "Milton, Ontario",
                    fx=240, fy=242, font_size_figma=8.5, weight=400,
                    color=CMYK_TEXT_MID, figma_font="serif")

    # Bottom
    thin_rule(c, fx=30, fy=320, w_figma=390, color=CMYK_TEXT_FAINT, weight_pt=0.3)
    draw_text_block(c, "Request a spec sheet, or book a Lunch & Learn.",
                    fx=30, fy=340, font_size_figma=11, weight=400,
                    color=CMYK_TEXT_DARK, figma_font="serif",
                    max_w_figma=380)
    tracked_caps(c, "hubss.com", fx=30, fy=370, size=8.0,
                 color=HUBSS_ORANGE, max_w_figma=200)


def page_back_cover(c):
    """Navy back cover — single combined wordmark, contact stack."""
    fill_bleed(c, HUBSS_NAVY_RICH)
    word_w = 240
    word_fx = (450 - word_w) / 2
    draw_logo_white(c, fx=word_fx, fy=260, fw_figma=word_w)

    draw_text_block(c, "Canada's Leading Decorative Pavement Solutions",
                    fx=25, fy=335, font_size_figma=8, weight=400,
                    color=CMYK_TEXT_FAINT, align="center", max_w_figma=400,
                    figma_font="serif")
    rule_w = 32
    rx, ry = figma_to_pdf((450 - rule_w) / 2, 358)
    c.setFillColor(HUBSS_ORANGE)
    c.rect(rx, ry, rule_w * SCALE, 1.2, stroke=0, fill=1)
    draw_text_block(c, "hubss.com", fx=25, fy=372,
                    font_size_figma=9, weight=600,
                    color=HUBSS_WHITE, align="center", max_w_figma=400,
                    tracking=1.2)
    draw_text_block(c, "West / Prairies   604.309.8212", fx=25, fy=395,
                    font_size_figma=7.0, color=CMYK_TEXT_FAINT,
                    align="center", max_w_figma=400)
    draw_text_block(c, "Central / Maritimes   416.540.9287", fx=25, fy=410,
                    font_size_figma=7.0, color=CMYK_TEXT_FAINT,
                    align="center", max_w_figma=400)
    draw_text_block(c, "(c) 2026 HUB Surface Systems",
                    fx=25, fy=445, font_size_figma=5.6,
                    color=CMYK_TEXT_FAINT, align="center", max_w_figma=400,
                    tracking=1.0)


# ============================================================
# Build
# ============================================================
def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = Canvas(str(OUT), pagesize=PAGE_SIZE)
    c.setTitle("HUB Surface Systems - Catalogue 2026")
    c.setAuthor("HUB Surface Systems")
    c.setSubject("Editorial Lookbook")

    pages = [
        # 1
        (lambda: page_cover(c), None),
        # 2
        (lambda: page_half_title(c), None),
        # 3
        (lambda: page_manifesto(c), "1"),
        # 4 — PRODUCTS opener
        (lambda: page_section_open(c, "One", "Products.",
                                   PHOTOS["products_open"], on_dark=True), None),
        # 5 — TPXD hero
        (lambda: page_product_hero(c, "Traffic Patterns XD",
                                   "When the surface has to hold.",
                                   PHOTOS["tpxd_hero"]), None),
        # 6 — TPXD spec
        (lambda: page_product_spec(c,
            eyebrow="Traffic Patterns XD",
            name="The 150-mil system.",
            tagline="Three-dimensional aggregate. Heat-bonded. Permanent.",
            callout="150 mil",
            callout_unit="Aggregate-reinforced preformed thermoplastic",
            body="Engineered for the most demanding road and parking lot "
                 "conditions in Canada. Bonds permanently through heat "
                 "application. Withstands snowplow blades, de-icing chemicals, "
                 "and years of heavy vehicle traffic.",
            uses=["Streetscape", "Community", "Calming", "Parking"]), "5"),
        # 7 — StreetBond hero
        (lambda: page_product_hero(c, "Street Bond",
                                   "Coloured pavement that moves with asphalt.",
                                   PHOTOS["streetbond_hero"]), None),
        # 8 — StreetBond spec
        (lambda: page_product_spec(c,
            eyebrow="Street Bond",
            name="The colour system.",
            tagline="Flexes with the road. Never peels.",
            callout="40+",
            callout_unit="Standard colours, custom matching available",
            body="The most specified decorative pavement coating in Canada. "
                 "Bonds permanently to asphalt or concrete, creating a skid-"
                 "resistant, colour-stable surface that protects and extends "
                 "pavement life.",
            uses=["Plazas", "Splash Pads", "Courts", "Parking"]), "7"),
        # 9 — StreetPrint hero
        (lambda: page_product_hero(c, "Street Print",
                                   "Asphalt that earns the stone comparison.",
                                   PHOTOS["streetprint_hero"]), None),
        # 10 — StreetPrint spec
        (lambda: page_product_spec(c,
            eyebrow="Street Print",
            name="Stamped asphalt.",
            tagline="Genuine. Three-dimensional. Plow-safe.",
            callout="20+",
            callout_unit="Patterns, including custom designs",
            body="The original decorative asphalt system. Stamps three-"
                 "dimensional patterns directly into heated asphalt to create "
                 "a flush, continuous surface with no expansion joints, no "
                 "settling, no trip hazards.",
            uses=["Streetscape", "Driveways", "Pathways", "Plazas"]), "9"),
        # 11 — DecoMark hero
        (lambda: page_product_hero(c, "Deco Mark",
                                   "Where a crosswalk becomes a canvas.",
                                   PHOTOS["decomark_hero"]), None),
        # 12 — DecoMark spec
        (lambda: page_product_spec(c,
            eyebrow="Deco Mark",
            name="Custom graphics.",
            tagline="Any image. Any colour. Manufactured to your CAD file.",
            callout="∞",
            callout_unit="Custom designs from your artwork",
            body="Pavement as canvas. Each design is precision-manufactured "
                 "using a CAD-to-production process, ensuring exact colour "
                 "matching and edge detail. Indigenous art crosswalks. "
                 "Veterans memorials. City wayfinding.",
            uses=["Identity", "Wayfinding", "Public Art", "Memorial"]), "11"),
        # 13 — PROJECTS opener
        (lambda: page_section_open(c, "Two", "Projects.",
                                   PHOTOS["projects_open"], on_dark=True), None),
        # 14 — White Rock hero
        (lambda: page_project_hero(c, "White Rock Pier",
                                   "White Rock, British Columbia",
                                   "Traffic Patterns XD",
                                   PHOTOS["white_rock"]), None),
        # 15 — White Rock story
        (lambda: page_project_story(c,
            eyebrow="Project   ·   01",
            title="Salt air. Holiday traffic. Held.",
            story="The pier crosswalk at White Rock takes the worst of British "
                  "Columbia's coast — salt spray, summer surge, winter rain — "
                  "and a steady stream of visitors. Specified by the city. "
                  "Walked by everyone.",
            detail_photo=PHOTOS["white_rock_detail"]), "13"),
        # 16 — UBC hero
        (lambda: page_project_hero(c, "UBC Musqueam Crosswalk",
                                   "Vancouver, British Columbia",
                                   "Street Print + Deco Mark",
                                   PHOTOS["ubc"]), None),
        # 17 — UBC story
        (lambda: page_project_story(c,
            eyebrow="Project   ·   02",
            title="A surface is also a statement.",
            story="A collaboration with the University of British Columbia and "
                  "the Musqueam Nation. Coast Salish art patterns, stamped into "
                  "asphalt at the centre of campus. Recognition. Cast in pavement.",
            detail_photo=PHOTOS["ubc_detail"]), "15"),
        # 18 — Maple Ridge hero
        (lambda: page_project_hero(c, "Maple Ridge Plaza",
                                   "Maple Ridge, British Columbia",
                                   "Street Bond",
                                   PHOTOS["maple_ridge"]), None),
        # 19 — Maple Ridge story
        (lambda: page_project_story(c,
            eyebrow="Project   ·   03",
            title="A plaza, transformed.",
            story="An industrial lot, a Mondrian-scale colour treatment, and a "
                  "town's new public room. StreetBond SB150 turned grey "
                  "infrastructure into a community asset.",
            detail_photo=PHOTOS["maple_ridge_detail"]), "17"),
        # 20 — SPECIFICATION opener
        (lambda: page_specification_open(c), None),
        # 21 — Technical reference
        (lambda: page_technical_reference(c), "19"),
        # 22 — Cities served
        (lambda: page_cities(c), "20"),
        # 23 — Contact
        (lambda: page_contact(c), "21"),
        # 24 — Back cover
        (lambda: page_back_cover(c), None),
    ]

    for fn, num in pages:
        try:
            fn()
            if num:
                page_number(c, num)
        except Exception as e:
            print(f"  page error: {e}")
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
