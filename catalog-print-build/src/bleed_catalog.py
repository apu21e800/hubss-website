"""HUB Surface Systems — Catalogue 2026 (full-bleed edition).

Every product, project, and application is ONE full-bleed photo with minimal
overlay type. Coffee-table-book sensibility. Hand-held intimacy.
Specs deferred to a single back-of-book reference table.
"""
from __future__ import annotations
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
from . import page_marks as PM
from . import catalog_content as CC


ROOT = Path(__file__).resolve().parent.parent
HUBSS_LOGOS = ROOT.parent / "public" / "images" / "assets" / "logos" / "hubss-logos"
LOGO_WHITE = HUBSS_LOGOS / "hubss-logo-white-large.png"
LOGO_COLOR = HUBSS_LOGOS / "hubss-logo-color.png"
LOGO_ASPECT = 2432 / 701

OUT = ROOT / "output" / "HUBSS_Catalogue_2026_BLEED.pdf"


# ============================================================
# Atomic primitives
# ============================================================
def draw_logo_white(c, fx, fy, fw_figma):
    if not LOGO_WHITE.exists(): return
    fh = fw_figma / LOGO_ASPECT
    px = BLEED + fx * SCALE
    py = BLEED + TRIM_H - (fy + fh) * SCALE
    draw_image_box(c, str(LOGO_WHITE), px, py, fw_figma * SCALE, fh * SCALE,
                   cover=False, convert_to_cmyk=False)


def draw_logo_color(c, fx, fy, fw_figma):
    if not LOGO_COLOR.exists(): return
    fh = fw_figma / LOGO_ASPECT
    px = BLEED + fx * SCALE
    py = BLEED + TRIM_H - (fy + fh) * SCALE
    draw_image_box(c, str(LOGO_COLOR), px, py, fw_figma * SCALE, fh * SCALE,
                   cover=False, convert_to_cmyk=False)


def tracked_caps(c, text, fx, fy, *, size=7.5, color=None,
                 max_w_figma=200, align="left", weight=600):
    color = color if color is not None else CMYK_TEXT_MID
    draw_text_block(c, text.upper(), fx=fx, fy=fy,
                    font_size_figma=size, weight=weight, color=color,
                    tracking=2.4, max_w_figma=max_w_figma, align=align)


def thin_rule(c, fx, fy, w_figma, *, color=None, weight_pt=0.6):
    color = color if color is not None else CMYK_TEXT_FAINT
    px, py = figma_to_pdf(fx, fy)
    c.setFillColor(color)
    c.rect(px, py, w_figma * SCALE, weight_pt, stroke=0, fill=1)


def orange_dot(c, fx, fy, *, r_figma=2.0):
    px, py = figma_to_pdf(fx, fy)
    c.setFillColor(HUBSS_ORANGE)
    c.circle(px, py, r_figma * SCALE, stroke=0, fill=1)


def hero_scrim(c, height_figma=130):
    """Soft 3-band scrim at bottom for white overlay text legibility."""
    c.setFillColor(CMYKColor(0, 0, 0, 0.85, alpha=0.62))
    c.rect(0, 0, PAGE_W, (height_figma * 0.55) * SCALE, stroke=0, fill=1)
    c.setFillColor(CMYKColor(0, 0, 0, 0.75, alpha=0.42))
    c.rect(0, (height_figma * 0.55) * SCALE, PAGE_W,
           (height_figma * 0.30) * SCALE, stroke=0, fill=1)
    c.setFillColor(CMYKColor(0, 0, 0, 0.65, alpha=0.20))
    c.rect(0, (height_figma * 0.85) * SCALE, PAGE_W,
           (height_figma * 0.15) * SCALE, stroke=0, fill=1)


# ============================================================
# UNIVERSAL FULL-BLEED PAGE
# ============================================================
def full_bleed_page(c, photo_path, *,
                    eyebrow=None,
                    title=None,
                    title_size=22,
                    footer_left=None,
                    footer_right=None,
                    scrim_height=130):
    """Every product/project/application page collapses to this single function.

    Args:
        photo_path: full-bleed photograph
        eyebrow: small tracked-caps line above title (optional, white)
        title: editorial overlay title (optional, white, bold sans)
        footer_left: tracked caps at bottom-left (e.g. location, product name)
        footer_right: tracked caps at bottom-right (e.g. case study number)
    """
    fill_bleed(c, CMYK_CREAM)
    if photo_path and Path(photo_path).exists():
        draw_full_bleed_image(c, str(photo_path))
    hero_scrim(c, height_figma=scrim_height)

    # Title — large editorial overlay
    if title:
        draw_text_block(c, title, fx=30, fy=370, font_size_figma=title_size,
                        weight=800, color=HUBSS_WHITE, tracking=-0.5,
                        max_w_figma=400)

    # Eyebrow above title
    if eyebrow:
        tracked_caps(c, eyebrow, fx=30, fy=350, size=6.5,
                     color=HUBSS_ORANGE, max_w_figma=200)

    # Footer row
    if footer_left:
        tracked_caps(c, footer_left, fx=30, fy=420, size=7.0,
                     color=HUBSS_WHITE, max_w_figma=240)
    if footer_right:
        tracked_caps(c, footer_right, fx=200, fy=420, size=7.0,
                     color=HUBSS_ORANGE, align="right", max_w_figma=220)


# ============================================================
# Front matter — restrained typographic moments
# ============================================================
def page_cover(c):
    """UBC photo full-bleed. Single logo + year tag. No scrim other than soft bottom."""
    fill_bleed(c, CMYK_CREAM)
    if CC.COVER_PHOTO and CC.COVER_PHOTO.exists():
        draw_full_bleed_image(c, str(CC.COVER_PHOTO))
    hero_scrim(c, height_figma=110)
    draw_logo_white(c, fx=28, fy=378, fw_figma=170)
    tracked_caps(c, "Catalogue 2026", fx=320, fy=415, size=7.5,
                 color=HUBSS_WHITE, max_w_figma=110, align="right")


def page_typographic_manifesto(c):
    """Big typographic spread. No photo. Cream paper, three-line poem."""
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "A Word from HUB", fx=40, fy=70, size=7.5, color=HUBSS_ORANGE)
    y = 130
    for i, line in enumerate(["Surfaces,", "in service of", "the public."]):
        col = HUBSS_ORANGE if i == 2 else CMYK_TEXT_DARK
        draw_text_block(c, line, fx=40, fy=y, font_size_figma=46, weight=800,
                        color=col, tracking=-1.4)
        y += 54
    draw_text_block(c,
        "For thirty years, HUB Surface Systems has built the ground "
        "beneath Canada's most lived-on streets. We do not make pavement. "
        "We make the public realm.",
        fx=40, fy=350, font_size_figma=10.5, color=CMYK_TEXT_DARK,
        max_w_figma=320, leading_figma=17)
    thin_rule(c, fx=40, fy=410, w_figma=24, color=HUBSS_ORANGE, weight_pt=1.2)
    tracked_caps(c, "Established 1994", fx=40, fy=425, size=6.5,
                 color=CMYK_TEXT_FAINT, max_w_figma=200)


def page_typographic_proof(c):
    """Big numerical claim. Cream paper. Centered."""
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "Why HUB", fx=40, fy=60, size=7.5, color=HUBSS_ORANGE)
    draw_text_block(c, "If it goes on the street,", fx=40, fy=110,
                    font_size_figma=28, weight=800, color=CMYK_TEXT_DARK,
                    tracking=-0.8)
    draw_text_block(c, "it stays on the street.", fx=40, fy=148,
                    font_size_figma=28, weight=800, color=HUBSS_ORANGE,
                    tracking=-0.8)
    # Big stats row
    draw_text_block(c, "30+", fx=40, fy=220, font_size_figma=72, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-2)
    draw_text_block(c, "years.", fx=40, fy=298, font_size_figma=28, weight=400,
                    color=CMYK_TEXT_MID, figma_font="serif")
    thin_rule(c, fx=40, fy=345, w_figma=24, color=HUBSS_ORANGE, weight_pt=1.2)
    draw_text_block(c,
        "1,000+ projects. 500+ municipalities specified by name. "
        "20-year colour retention on stamped asphalt. Trusted from "
        "Halifax to Vancouver.",
        fx=40, fy=370, font_size_figma=10, color=CMYK_TEXT_DARK,
        max_w_figma=350, leading_figma=15)


def page_section_divider(c, section_label, big_word, photo_path=None, dark_photo=True):
    """Section divider — full-bleed photo OR cream typographic. Editorial."""
    if photo_path and Path(photo_path).exists():
        full_bleed_page(c, photo_path,
                        eyebrow=section_label,
                        title=big_word,
                        title_size=44,
                        scrim_height=180)
    else:
        fill_bleed(c, CMYK_CREAM)
        tracked_caps(c, section_label, fx=40, fy=180, size=7.5,
                     color=HUBSS_ORANGE)
        draw_text_block(c, big_word, fx=40, fy=210, font_size_figma=56,
                        weight=800, color=CMYK_TEXT_DARK, tracking=-1.6)


# ============================================================
# Reference pages (back of book)
# ============================================================
def page_technical_reference(c):
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "Reference", fx=30, fy=50, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, "The systems.", fx=30, fy=80, font_size_figma=36,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.0)
    products = [
        ("TrafficPatternsXD", "150 mil",     "Heavy-duty thermoplastic"),
        ("TrafficPatterns",   "90 mil",      "Standard thermoplastic"),
        ("StreetBond",        "Acrylic",     "Coloured pavement coating"),
        ("StreetBondSR",      "Solar Refl.", "LEED contributing surface"),
        ("StreetPrint",       "Stamped",     "Genuine stamped asphalt"),
        ("DecoMark",          "Custom",      "Graphic thermoplastic"),
        ("DuraTherm",         "Inlaid",      "Snowplow-safe flush"),
        ("DuraShield",        "Penetrating", "Asphalt rejuvenator"),
        ("PreMark",           "Pre-cut",     "Bike infrastructure"),
        ("MMAX",              "MMA Resin",   "Coloured lane treatment"),
        ("FastPatch",         "Polyurethane","Pothole repair"),
        ("Aquaphalt",         "Water-act.",  "Permanent cold-mix"),
    ]
    y = 150
    for name, key, desc in products:
        draw_text_block(c, name, fx=30, fy=y, font_size_figma=10,
                        weight=800, color=CMYK_TEXT_DARK)
        tracked_caps(c, key, fx=180, fy=y, size=6.5,
                     color=HUBSS_ORANGE, max_w_figma=120)
        draw_text_block(c, desc, fx=270, fy=y, font_size_figma=8.5,
                        color=CMYK_TEXT_MID, max_w_figma=160)
        thin_rule(c, fx=30, fy=y + 14, w_figma=390, color=CMYK_TEXT_FAINT,
                  weight_pt=0.3)
        y += 22


def page_cities(c):
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "Specified by name", fx=30, fy=50, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, "Coast to coast.", fx=30, fy=80, font_size_figma=36,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.0)
    cities = CC.CITIES
    col1_x = 30
    col2_x = 230
    y = 150
    for i in range(0, len(cities), 2):
        orange_dot(c, fx=col1_x - 8, fy=y + 4, r_figma=1.4)
        draw_text_block(c, cities[i], fx=col1_x, fy=y, font_size_figma=9.5,
                        weight=600, color=CMYK_TEXT_DARK, tracking=0.4,
                        max_w_figma=180)
        if i + 1 < len(cities):
            orange_dot(c, fx=col2_x - 8, fy=y + 4, r_figma=1.4)
            draw_text_block(c, cities[i + 1], fx=col2_x, fy=y, font_size_figma=9.5,
                            weight=600, color=CMYK_TEXT_DARK, tracking=0.4,
                            max_w_figma=180)
        y += 16


def page_contact(c):
    fill_bleed(c, CMYK_CREAM)
    tracked_caps(c, "Speak with HUB", fx=30, fy=50, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, "Two offices.", fx=30, fy=80, font_size_figma=36,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.0)
    draw_text_block(c, "One network.", fx=30, fy=120, font_size_figma=36,
                    weight=800, color=HUBSS_ORANGE, tracking=-1.0)
    # Western
    tracked_caps(c, "Western Canada", fx=30, fy=210, size=6.5, color=CMYK_TEXT_FAINT)
    draw_text_block(c, "Cleve Stordy", fx=30, fy=232, font_size_figma=16,
                    weight=800, color=CMYK_TEXT_DARK)
    draw_text_block(c, "cleve.stordy@hubss.com", fx=30, fy=260,
                    font_size_figma=10, color=HUBSS_ORANGE)
    draw_text_block(c, "604.309.8212", fx=30, fy=278,
                    font_size_figma=10, color=CMYK_TEXT_MID)
    draw_text_block(c, "Ladysmith, British Columbia", fx=30, fy=298,
                    font_size_figma=9, color=CMYK_TEXT_MID, figma_font="serif")
    # Eastern
    tracked_caps(c, "Eastern Canada", fx=240, fy=210, size=6.5, color=CMYK_TEXT_FAINT)
    draw_text_block(c, "Doug Bain", fx=240, fy=232, font_size_figma=16,
                    weight=800, color=CMYK_TEXT_DARK)
    draw_text_block(c, "doug.bain@hubss.com", fx=240, fy=260,
                    font_size_figma=10, color=HUBSS_ORANGE)
    draw_text_block(c, "416.540.9287", fx=240, fy=278,
                    font_size_figma=10, color=CMYK_TEXT_MID)
    draw_text_block(c, "Milton, Ontario", fx=240, fy=298,
                    font_size_figma=9, color=CMYK_TEXT_MID, figma_font="serif")
    thin_rule(c, fx=30, fy=370, w_figma=390, color=CMYK_TEXT_FAINT, weight_pt=0.3)
    tracked_caps(c, "hubss.com", fx=30, fy=395, size=9.0,
                 color=HUBSS_ORANGE, max_w_figma=200)


def page_back(c):
    fill_bleed(c, HUBSS_NAVY_RICH)
    word_w = 240
    word_fx = (450 - word_w) / 2
    draw_logo_white(c, fx=word_fx, fy=260, fw_figma=word_w)
    draw_text_block(c, "Canadas Leading Decorative Pavement Solutions",
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
# Build orchestrator — pure full-bleed sequencing
# ============================================================
def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = Canvas(str(OUT), pagesize=PAGE_SIZE)
    c.setTitle("HUB Surface Systems - Catalogue 2026")
    c.setAuthor("HUB Surface Systems")
    c.setSubject("Decorative Pavement Solutions Lookbook")

    pages = []

    # Front matter (4)
    pages.append(lambda: page_cover(c))
    pages.append(lambda: page_typographic_manifesto(c))
    pages.append(lambda: page_typographic_proof(c))
    # Section: PRODUCTS
    pages.append(lambda: page_section_divider(c, "Section One", "Products.",
                                              CC.SECTION_OPENERS["products"]))

    # 12 products — ONE full-bleed page each
    for prod in CC.PRODUCTS:
        p = prod
        pages.append(lambda p=p: full_bleed_page(c, p["hero"],
            eyebrow=p["title"],
            title=p["tagline"],
            title_size=22,
            footer_left=p["name"],
            footer_right=p["callout"]))

    # Section: PROJECTS
    pages.append(lambda: page_section_divider(c, "Section Two", "Projects.",
                                              CC.SECTION_OPENERS["projects"]))

    # 18 projects — ONE full-bleed page each
    for proj in CC.PROJECTS:
        p = proj
        pages.append(lambda p=p: full_bleed_page(c, p["hero"],
            eyebrow=p["product"],
            title=p["title"],
            title_size=20,
            footer_left=p["location"],
            footer_right=p["name"]))

    # Section: APPLICATIONS
    pages.append(lambda: page_section_divider(c, "Section Three", "Applications.",
                                              CC.SECTION_OPENERS["applications"]))

    # 17 applications — ONE full-bleed page each
    for app in CC.APPLICATIONS:
        a = app
        pages.append(lambda a=a: full_bleed_page(c, a["image"],
            eyebrow="Application",
            title=a["name"],
            title_size=28,
            footer_left=a["tagline"],
            footer_right=None))

    # Section: NETWORK
    pages.append(lambda: page_section_divider(c, "Section Four", "Network.",
                                              CC.SECTION_OPENERS["network"]))

    # 4 installer cards — full-bleed photo + name overlay
    for inst in CC.INSTALLERS:
        i = inst
        pages.append(lambda i=i: full_bleed_page(c, i["image"],
            eyebrow="HUB Certified Installer",
            title=i["name"],
            title_size=26,
            footer_left=i["region"],
            footer_right=i["url"]))

    # Reference / back matter
    pages.append(lambda: page_section_divider(c, "Section Five", "Reference."))
    pages.append(lambda: page_technical_reference(c))
    pages.append(lambda: page_cities(c))
    pages.append(lambda: page_contact(c))

    # Pad to multiple of 4 minus 1 (back cover)
    while (len(pages) + 1) % 4 != 0:
        pages.append(lambda: page_typographic_proof(c))

    pages.append(lambda: page_back(c))

    for fn in pages:
        try:
            fn()
        except Exception as e:
            print("page error:", e)
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
