"""
HUB Surface Systems — 2026 Editorial Lookbook FULL CAPACITY (~68 pages, 5x5" CMYK).

Extends the v5 editorial design system to all content:
  - 11 products (hero + spec each)
  - 9 projects (hero + story each)
  - 8 applications
  - 4 installer cards
  - TOC, cities, contact, L&L, back cover

Pages divisible by 4 for binding.
"""
from __future__ import annotations
from pathlib import Path

from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import CMYKColor

from .specs import (
    PAGE_SIZE, PAGE_W, PAGE_H, BLEED, TRIM_W, TRIM_H,
    HUBSS_ORANGE, HUBSS_NAVY_RICH, HUBSS_WHITE,
    FONT_SANS_BOLD, FONT_SANS_REG, FONT_SERIF,
)
from .figma_render import (
    SCALE, fs, figma_to_pdf, fill_bleed,
    draw_image_at_figma, draw_full_bleed_image, draw_text_block,
    CMYK_CREAM, CMYK_TEXT_DARK, CMYK_TEXT_MID, CMYK_TEXT_FAINT,
)
from .images import draw_image_box
from . import page_marks as PM
from . import catalog_content as CC


ROOT = Path(__file__).resolve().parent.parent
HUBSS_LOGOS = ROOT.parent / "public" / "images" / "assets" / "logos" / "hubss-logos"
ASSETS = ROOT / "assets" / "booklet"
LOGO_WHITE = HUBSS_LOGOS / "hubss-logo-white-large.png"
LOGO_COLOR = HUBSS_LOGOS / "hubss-logo-color.png"
LOGO_ASPECT = 2432 / 701

OUT = ROOT / "output" / "HUBSS_LookBook_2026_FINAL.pdf"


def display_size_for(text):
    n = len(text)
    if n < 8:   return 56
    if n < 14:  return 44
    if n < 25:  return 34
    if n < 40:  return 26
    return 22


def draw_logo_white(c, fx, fy, fw_figma):
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
    fill_bleed(c, CMYK_CREAM)
    img = CC.COVER_PHOTO
    if img and img.exists():
        draw_full_bleed_image(c, str(img))
    # Subtle scrim only across bottom band so wordmark always reads
    overlay = CMYKColor(0, 0, 0, 0.55, alpha=0.38)
    c.setFillColor(overlay)
    c.rect(0, 0, PAGE_W, fs(80), stroke=0, fill=1)
    draw_logo_white(c, fx=28, fy=388, fw_figma=160)
    tracked_caps(c, "Catalogue 2026", fx=200, fy=410, size=7.0,
                 color=HUBSS_WHITE, max_w_figma=120)


def page_half_title(c):
    fill_bleed(c, CMYK_CREAM)
    draw_logo_color(c, fx=(450-180)/2, fy=205, fw_figma=180)
    tracked_caps(c, "Catalogue   ·   2026", fx=25, fy=270, size=7.5,
                 color=CMYK_TEXT_MID, align="center", max_w_figma=400)
    orange_dot(c, fx=225, fy=405, r_figma=2.5)


def page_manifesto(c):
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "A Word from HUB", fx=40, fy=70, size=7.5, color=HUBSS_ORANGE)
    draw_text_block(c, "Surfaces,", fx=40, fy=120, font_size_figma=44, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-1.2)
    draw_text_block(c, "in service of", fx=40, fy=170, font_size_figma=44, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-1.2)
    draw_text_block(c, "the public.", fx=40, fy=220, font_size_figma=44, weight=800,
                    color=HUBSS_ORANGE, tracking=-1.2)
    draw_text_block(c,
        "For thirty years we have built the ground beneath Canada's most "
        "lived-on streets. Crosswalks. Plazas. Bus lanes. Runways. We do "
        "not make pavement. We make the public realm.",
        fx=40, fy=300, font_size_figma=10, color=CMYK_TEXT_DARK,
        max_w_figma=320, leading_figma=16)
    thin_rule(c, fx=40, fy=395, w_figma=24, color=HUBSS_ORANGE, weight_pt=1.2)
    tracked_caps(c, "HUB Surface Systems   /   Established 1994",
                 fx=40, fy=410, size=6.5, color=CMYK_TEXT_FAINT, max_w_figma=350)


def page_toc(c, sections):
    """sections is a list of (label, page_num)."""
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "What's Inside", fx=40, fy=70, size=7.5, color=HUBSS_ORANGE)
    draw_text_block(c, "Catalogue 2026.", fx=40, fy=100, font_size_figma=32, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-1.0)
    y = 170
    for label, num in sections:
        orange_dot(c, fx=42, fy=y + 4, r_figma=1.6)
        draw_text_block(c, label, fx=52, fy=y, font_size_figma=10, weight=600,
                        color=CMYK_TEXT_DARK, tracking=0.3)
        draw_text_block(c, str(num), fx=400, fy=y, font_size_figma=10, weight=600,
                        color=CMYK_TEXT_DARK, max_w_figma=15, align="right")
        thin_rule(c, fx=40, fy=y + 18, w_figma=380, color=CMYK_TEXT_FAINT, weight_pt=0.3)
        y += 28


def page_section_open(c, section_no, title, photo_path):
    fill_bleed(c, CMYK_CREAM)
    if photo_path and photo_path.exists():
        draw_full_bleed_image(c, str(photo_path))
    _hero_scrim(c, height_figma=160)
    tracked_caps(c, f"Section {section_no}", fx=30, fy=345, size=7.5,
                 color=HUBSS_WHITE, max_w_figma=140)
    draw_text_block(c, title, fx=30, fy=365, font_size_figma=44, weight=800,
                    color=HUBSS_WHITE, tracking=-1.2)


def _hero_scrim(c, height_figma=120):
    """Soft dark gradient-equivalent scrim at the bottom of a hero page so
    white overlay text reads against any photo. Uses a single semi-opaque
    rectangle for simplicity (true gradients require ReportLab Form objects)."""
    overlay = CMYKColor(0, 0, 0, 0.70, alpha=0.45)
    c.setFillColor(overlay)
    c.rect(0, 0, PAGE_W, height_figma * SCALE, stroke=0, fill=1)


def page_product_hero(c, prod):
    fill_bleed(c, CMYK_CREAM)
    if prod["hero"] and prod["hero"].exists():
        draw_full_bleed_image(c, str(prod["hero"]))
    # Legibility scrim at bottom 25% of page
    _hero_scrim(c, height_figma=130)
    # Tagline — sans bold, NOT serif (serif italic illegible on photos)
    draw_text_block(c, prod["tagline"], fx=30, fy=358, font_size_figma=18,
                    weight=800, color=HUBSS_WHITE, tracking=-0.4,
                    max_w_figma=400)
    tracked_caps(c, prod["name"], fx=30, fy=412, size=8.0,
                 color=HUBSS_ORANGE, max_w_figma=240)


def page_product_spec(c, prod):
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, prod["name"], fx=30, fy=40, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, prod["title"],
                    fx=30, fy=68, font_size_figma=display_size_for(prod["title"]),
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8)
    draw_text_block(c, prod["italic"], fx=30, fy=125, font_size_figma=11,
                    weight=400, color=CMYK_TEXT_MID, figma_font="serif",
                    max_w_figma=380, leading_figma=16)
    draw_text_block(c, prod["callout"], fx=30, fy=180, font_size_figma=42,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8)
    tracked_caps(c, prod["callout_unit"], fx=30, fy=232, size=6.5,
                 color=CMYK_TEXT_MID, max_w_figma=380)
    draw_text_block(c, prod["body"], fx=30, fy=270, font_size_figma=9.5,
                    color=CMYK_TEXT_DARK, max_w_figma=380, leading_figma=15)
    # Pills row
    uses = prod["uses"]
    pill_y = 410
    pill_w = 88
    pill_gap = 4
    pill_h = 18
    total_w = len(uses) * pill_w + (len(uses) - 1) * pill_gap
    pill_x_start = (450 - total_w) / 2
    for i, use in enumerate(uses):
        x = pill_x_start + i * (pill_w + pill_gap)
        px, py = figma_to_pdf(x, pill_y + pill_h)
        c.setFillColor(CMYKColor(0, 0, 0, 0.05))
        c.roundRect(px, py, pill_w * SCALE, pill_h * SCALE,
                    3 * SCALE, stroke=0, fill=1)
        draw_text_block(c, use, fx=x, fy=pill_y + 5, font_size_figma=6.5,
                        weight=600, color=CMYK_TEXT_DARK,
                        tracking=1.2, max_w_figma=pill_w, align="center")


def page_project_hero(c, proj):
    fill_bleed(c, CMYK_CREAM)
    if proj["hero"] and proj["hero"].exists():
        draw_full_bleed_image(c, str(proj["hero"]))
    _hero_scrim(c, height_figma=140)
    draw_text_block(c, proj["title"], fx=30, fy=340, font_size_figma=22,
                    weight=800, color=HUBSS_WHITE, tracking=-0.5,
                    max_w_figma=400)
    tracked_caps(c, proj["location"], fx=30, fy=405, size=7.5,
                 color=HUBSS_WHITE, max_w_figma=240)
    tracked_caps(c, proj["product"], fx=200, fy=405, size=7.5,
                 color=HUBSS_ORANGE, align="right", max_w_figma=220)


def page_project_story(c, proj, idx):
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, f"Project   ·   {idx:02d}", fx=30, fy=40, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, proj["title"], fx=30, fy=68,
                    font_size_figma=display_size_for(proj["title"]),
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8,
                    max_w_figma=380)
    draw_text_block(c, proj["story"], fx=30, fy=140, font_size_figma=10,
                    color=CMYK_TEXT_DARK, max_w_figma=380, leading_figma=16)
    if proj.get("detail") and proj["detail"].exists():
        draw_image_at_figma(c, str(proj["detail"]), fx=30, fy=260, fw=390, fh=150)


def page_application(c, app, idx):
    fill_bleed(c, CMYK_CREAM)
    if app["image"] and app["image"].exists():
        draw_image_at_figma(c, str(app["image"]), fx=0, fy=0, fw=450, fh=250)
    tracked_caps(c, f"Application   ·   {idx:02d}", fx=30, fy=275, size=7.0,
                 color=HUBSS_ORANGE)
    draw_text_block(c, app["name"], fx=30, fy=298,
                    font_size_figma=display_size_for(app["name"]),
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8)
    draw_text_block(c, app["tagline"], fx=30, fy=358, font_size_figma=11,
                    weight=400, color=CMYK_TEXT_MID, figma_font="serif",
                    max_w_figma=380, leading_figma=16)


def page_installer(c, inst):
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "HUB Certified Installer", fx=30, fy=30, size=6.5,
                 color=HUBSS_ORANGE)
    if inst["image"] and inst["image"].exists():
        draw_image_at_figma(c, str(inst["image"]), fx=30, fy=55, fw=390, fh=200)
    tracked_caps(c, inst["region"], fx=30, fy=270, size=6.5,
                 color=CMYK_TEXT_FAINT)
    draw_text_block(c, inst["name"], fx=30, fy=290,
                    font_size_figma=display_size_for(inst["name"]),
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.5)
    draw_text_block(c, inst["body"], fx=30, fy=345, font_size_figma=9.5,
                    color=CMYK_TEXT_DARK, max_w_figma=380, leading_figma=15)
    # Contact line
    thin_rule(c, fx=30, fy=415, w_figma=380, color=CMYK_TEXT_FAINT, weight_pt=0.3)
    tracked_caps(c, inst["url"], fx=30, fy=425, size=6.5,
                 color=HUBSS_ORANGE, max_w_figma=140)
    tracked_caps(c, inst["phone"], fx=350, fy=425, size=6.5,
                 color=CMYK_TEXT_MID, align="right", max_w_figma=80)


def page_lunch_learn(c):
    fill_bleed(c, CMYK_CREAM)
    img = ASSETS / "Splash Pad 2.png"
    if img.exists():
        draw_image_at_figma(c, str(img), fx=0, fy=0, fw=450, fh=180)
    tracked_caps(c, "An Invitation", fx=30, fy=205, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, "See it. Spec it.", fx=30, fy=230, font_size_figma=32,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.0)
    draw_text_block(c, "We'll bring lunch.", fx=30, fy=270, font_size_figma=32,
                    weight=800, color=HUBSS_ORANGE, tracking=-1.0)
    draw_text_block(c,
        "Book a complimentary Lunch & Learn for your team. One hour. "
        "Real project walkthroughs, material specs, and Q&A — tailored "
        "to your upcoming jobs. In-person or virtual.",
        fx=30, fy=315, font_size_figma=10, color=CMYK_TEXT_DARK,
        max_w_figma=380, leading_figma=15)
    # CTA
    cta_x, cta_y = figma_to_pdf((450 - 180) / 2, 410)
    c.setFillColor(HUBSS_ORANGE)
    c.roundRect(cta_x, cta_y, 180 * SCALE, 22 * SCALE, 4 * SCALE,
                stroke=0, fill=1)
    draw_text_block(c, "BOOK NOW   ·   hubss.com/lnl",
                    fx=(450 - 180) / 2, fy=395, font_size_figma=8.5,
                    weight=800, color=HUBSS_WHITE, tracking=1.4,
                    max_w_figma=180, align="center")


def page_specification_open(c):
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "Section Five", fx=30, fy=180, size=7.5, color=HUBSS_ORANGE)
    draw_text_block(c, "Reference.", fx=30, fy=205, font_size_figma=44,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.2)
    draw_text_block(c,
        "Spec sheets, certifications, and the cities that have specified HUB.",
        fx=30, fy=265, font_size_figma=11, weight=400, color=CMYK_TEXT_MID,
        figma_font="serif", max_w_figma=380, leading_figma=16)


def page_technical_reference(c):
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "Product Reference", fx=30, fy=40, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, "The systems.", fx=30, fy=68, font_size_figma=28,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8)
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
        draw_text_block(c, name, fx=30, fy=y, font_size_figma=10,
                        weight=800, color=CMYK_TEXT_DARK)
        tracked_caps(c, key, fx=180, fy=y, size=6.5,
                     color=HUBSS_ORANGE, max_w_figma=120)
        draw_text_block(c, desc, fx=270, fy=y, font_size_figma=8.5,
                        color=CMYK_TEXT_MID, max_w_figma=160)
        thin_rule(c, fx=30, fy=y + 16, w_figma=390, color=CMYK_TEXT_FAINT, weight_pt=0.3)
        y += 22


def page_cities(c):
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "Specified Coast to Coast", fx=30, fy=40, size=7.0,
                 color=HUBSS_ORANGE)
    draw_text_block(c, "Trusted, by name.", fx=30, fy=68, font_size_figma=28,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8)
    cities = CC.CITIES
    col1_x = 30
    col2_x = 230
    y = 140
    for i in range(0, len(cities), 2):
        orange_dot(c, fx=col1_x - 8, fy=y + 4, r_figma=1.4)
        draw_text_block(c, cities[i], fx=col1_x, fy=y, font_size_figma=9,
                        weight=600, color=CMYK_TEXT_DARK, tracking=0.4)
        if i + 1 < len(cities):
            orange_dot(c, fx=col2_x - 8, fy=y + 4, r_figma=1.4)
            draw_text_block(c, cities[i + 1], fx=col2_x, fy=y, font_size_figma=9,
                            weight=600, color=CMYK_TEXT_DARK, tracking=0.4)
        y += 16


def page_contact(c):
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "Two Offices, One Network", fx=30, fy=40, size=7.0,
                 color=HUBSS_ORANGE)
    draw_text_block(c, "Speak with HUB.", fx=30, fy=68, font_size_figma=28,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8)
    # West
    tracked_caps(c, "Western Canada", fx=30, fy=160, size=6.5, color=CMYK_TEXT_FAINT)
    draw_text_block(c, "Cleve Stordy", fx=30, fy=180, font_size_figma=14,
                    weight=800, color=CMYK_TEXT_DARK)
    draw_text_block(c, "cleve.stordy@hubss.com", fx=30, fy=205,
                    font_size_figma=9.5, color=HUBSS_ORANGE)
    draw_text_block(c, "604.309.8212", fx=30, fy=222,
                    font_size_figma=9.5, color=CMYK_TEXT_MID)
    draw_text_block(c, "Ladysmith, British Columbia", fx=30, fy=242,
                    font_size_figma=8.5, color=CMYK_TEXT_MID, figma_font="serif")
    # East
    tracked_caps(c, "Eastern Canada", fx=240, fy=160, size=6.5, color=CMYK_TEXT_FAINT)
    draw_text_block(c, "Doug Bain", fx=240, fy=180, font_size_figma=14,
                    weight=800, color=CMYK_TEXT_DARK)
    draw_text_block(c, "doug.bain@hubss.com", fx=240, fy=205,
                    font_size_figma=9.5, color=HUBSS_ORANGE)
    draw_text_block(c, "416.540.9287", fx=240, fy=222,
                    font_size_figma=9.5, color=CMYK_TEXT_MID)
    draw_text_block(c, "Milton, Ontario", fx=240, fy=242,
                    font_size_figma=8.5, color=CMYK_TEXT_MID, figma_font="serif")
    thin_rule(c, fx=30, fy=320, w_figma=390, color=CMYK_TEXT_FAINT, weight_pt=0.3)
    draw_text_block(c, "Request a spec sheet, or book a Lunch & Learn.",
                    fx=30, fy=340, font_size_figma=11, weight=400,
                    color=CMYK_TEXT_DARK, figma_font="serif", max_w_figma=380)
    tracked_caps(c, "hubss.com", fx=30, fy=370, size=8.0,
                 color=HUBSS_ORANGE, max_w_figma=200)


def page_back(c):
    fill_bleed(c, HUBSS_NAVY_RICH)
    word_w = 240
    word_fx = (450 - word_w) / 2
    draw_logo_white(c, fx=word_fx, fy=260, fw_figma=word_w)
    draw_text_block(c, "Canada's Leading Decorative Pavement Solutions",
                    fx=25, fy=335, font_size_figma=8, color=CMYK_TEXT_FAINT,
                    align="center", max_w_figma=400, figma_font="serif")
    rule_w = 32
    rx, ry = figma_to_pdf((450 - rule_w) / 2, 358)
    c.setFillColor(HUBSS_ORANGE)
    c.rect(rx, ry, rule_w * SCALE, 1.2, stroke=0, fill=1)
    draw_text_block(c, "hubss.com", fx=25, fy=372, font_size_figma=9,
                    weight=600, color=HUBSS_WHITE, align="center",
                    max_w_figma=400, tracking=1.2)
    draw_text_block(c, "West / Prairies   604.309.8212",
                    fx=25, fy=395, font_size_figma=7.0,
                    color=CMYK_TEXT_FAINT, align="center", max_w_figma=400)
    draw_text_block(c, "Central / Maritimes   416.540.9287",
                    fx=25, fy=410, font_size_figma=7.0,
                    color=CMYK_TEXT_FAINT, align="center", max_w_figma=400)
    draw_text_block(c, "(c) 2026 HUB Surface Systems",
                    fx=25, fy=445, font_size_figma=5.6,
                    color=CMYK_TEXT_FAINT, align="center",
                    max_w_figma=400, tracking=1.0)


# ============================================================
# Build orchestrator
# ============================================================
def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = Canvas(str(OUT), pagesize=PAGE_SIZE)
    c.setTitle("HUB Surface Systems - Catalogue 2026")
    c.setAuthor("HUB Surface Systems")
    c.setSubject("Editorial Lookbook")

    # Page list as (renderer-fn, page-number-string-or-None)
    spec_pn = lambda n: str(n) if n else None
    pages = []

    # Front matter (4 pages)
    pages.append((lambda: page_cover(c), None))
    pages.append((lambda: page_half_title(c), None))
    pages.append((lambda: page_manifesto(c), "1"))

    # TOC will be inserted after we know all page numbers — placeholder for now
    pages.append((lambda: None, None))  # slot for TOC

    # SECTION 1: PRODUCTS
    pages.append((lambda: page_section_open(c, "One", "Products.",
                                            CC.SECTION_OPENERS["products"]), None))
    for prod in CC.PRODUCTS:
        # Capture loop var
        p = prod
        pages.append((lambda p=p: page_product_hero(c, p), None))
        pages.append((lambda p=p: page_product_spec(c, p), str(len(pages) - 2)))

    # SECTION 2: PROJECTS
    pages.append((lambda: page_section_open(c, "Two", "Projects.",
                                            CC.SECTION_OPENERS["projects"]), None))
    for idx, proj in enumerate(CC.PROJECTS, 1):
        p = proj
        i = idx
        pages.append((lambda p=p: page_project_hero(c, p), None))
        pages.append((lambda p=p, i=i: page_project_story(c, p, i), None))

    # SECTION 3: APPLICATIONS
    pages.append((lambda: page_section_open(c, "Three", "Applications.",
                                            CC.SECTION_OPENERS["applications"]), None))
    for idx, app in enumerate(CC.APPLICATIONS, 1):
        a = app
        i = idx
        pages.append((lambda a=a, i=i: page_application(c, a, i), None))

    # SECTION 4: NETWORK (installers)
    pages.append((lambda: page_section_open(c, "Four", "Network.",
                                            CC.SECTION_OPENERS["network"]), None))
    for inst in CC.INSTALLERS:
        i = inst
        pages.append((lambda i=i: page_installer(c, i), None))

    # SECTION 5: REFERENCE / contact / L&L / back
    pages.append((lambda: page_specification_open(c), None))
    pages.append((lambda: page_technical_reference(c), None))
    pages.append((lambda: page_cities(c), None))
    pages.append((lambda: page_contact(c), None))
    pages.append((lambda: page_lunch_learn(c), None))

    # Pad to multiple of 4 (account for back cover taking last slot)
    while (len(pages) + 1) % 4 != 0:
        pages.append((lambda: fill_bleed(c, CMYK_CREAM), None))

    # Back cover
    pages.append((lambda: page_back(c), None))

    # Now build TOC entries from known structure
    toc_entries = []
    # Find indices of section openers
    page_count = 1
    section_pages = {}
    for i, p in enumerate(pages):
        # We can't introspect lambdas easily; use position-based mapping
        pass
    # Hardcoded TOC since we know the structure
    toc_entries = [
        ("Manifesto",     3),
        ("Products",      5),
        ("Projects",      28),
        ("Applications",  47),
        ("Network",       56),
        ("Reference",     61),
        ("Lunch & Learn", 65),
    ]
    pages[3] = (lambda: page_toc(c, toc_entries), None)

    for fn, num in pages:
        try:
            fn()
            if num:
                page_number(c, num)
        except Exception as e:
            print("  page error:", e)
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
