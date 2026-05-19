"""
Proof build v2 — fixes from user feedback on v1:
  1. Cover uses real HUBSS logo (orange wheel + wordmark) — not handmade glyph
  2. TOC dots stop at the page number (no overflow past)
  3. Residential Driveways section added to TOC
  4. Cover uses ONE soft scrim, not two
  5. TPXD spec headline shrink-to-fit (no overflow)
  6. Centering math fixed for back-cover stacked text
  7. Right-edge text on gallery + installer card now respects max width

Pages rendered:
  1  -> Front cover                    (full-bleed image + real logo)
  2  -> TOC                            (with Residential Driveways added)
  6  -> TrafficPatternsXD spec         (shrink-to-fit headline)
 22  -> OAKVILLE TPXD gallery
 66  -> Square One Paving installer    (with residential driveway photo as stand-in)
 72  -> Back cover                     (centered correctly)
"""
from __future__ import annotations

from pathlib import Path
from reportlab.pdfgen.canvas import Canvas
from reportlab.pdfbase.pdfmetrics import stringWidth

from .specs import (
    PAGE_SIZE, PAGE_W, PAGE_H, BLEED, TRIM_W, TRIM_H,
    HUBSS_ORANGE, HUBSS_NAVY, FONT_SANS_BOLD, FONT_SANS_REG,
)
from .figma_render import (
    SCALE, figma_to_pdf, fs,
    fill_bleed, draw_text_block, draw_image_at_figma, draw_full_bleed_image,
    draw_page_number,
    CMYK_CREAM, CMYK_TEXT_DARK, CMYK_TEXT_MID, CMYK_TEXT_FAINT,
    HUBSS_WHITE, HUBSS_NAVY_RICH,
)
from .images import draw_image_box
from . import page_marks as PM


ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets" / "booklet"
PUBLIC_IMG = ROOT.parent / "public" / "images"

OUT = ROOT / "output" / "HUBSS_PROOF_v3.pdf"

# ------ Concrete photo picks for the 6 pages -------------------------
HUBSS_LOGOS = PUBLIC_IMG / "assets" / "logos" / "hubss-logos"
PHOTOS = {
    "cover_hero":           ASSETS / "Whiterock-Pier-Crosswalk-TrafficPatternsXD-1 1.png",
    "tpxd_hero":            ASSETS / "Intersection installation TPXD 1.png",
    "installer_square_one": ASSETS / "compactor on streetprint 1.png",
    # OFFICIAL HUBSS logos — combined wheel + wordmark, do NOT stack with separate wheel
    "logo_color":           HUBSS_LOGOS / "hubss-logo-color.png",        # for cream/light
    "logo_white":           HUBSS_LOGOS / "hubss-logo-white.png",        # for navy/dark
    "logo_white_large":     HUBSS_LOGOS / "hubss-logo-white-large.png",  # higher-res white
}


# ------ Helpers ------------------------------------------------------
def shrink_to_fit_size(text: str, font: str, max_w_pt: float, start_size: float, min_size: float = 8.0) -> float:
    """Return the largest size <= start_size that fits text into max_w_pt."""
    s = start_size
    while s > min_size and stringWidth(text, font, s) > max_w_pt:
        s -= 0.5
    return s


def draw_combined_logo(c: Canvas, fx: float, fy: float, fw_figma: float, *, variant: str = "color"):
    """
    Place the COMBINED HUBSS wordmark (wheel + 'HUB SURFACE SYSTEMS' together).
    Never stack a separate wheel on top — that creates the duplicate-logo bug.

    variant: "color" -> orange wheel + dark grey text  (use on cream/light)
             "white" -> orange wheel + white text      (use on navy/dark)
    Aspect ratio of the source PNG (2432:701 ≈ 3.47:1) is preserved.
    """
    key = "logo_color" if variant == "color" else "logo_white_large"
    img = PHOTOS[key]
    if not img.exists():
        return
    aspect = 2432 / 701  # source aspect
    fh_figma = fw_figma / aspect
    px = BLEED + fx * SCALE
    py = BLEED + TRIM_H - (fy + fh_figma) * SCALE
    w = fw_figma * SCALE
    h = fh_figma * SCALE
    draw_image_box(c, str(img), px, py, w, h, cover=False, convert_to_cmyk=False)


# ============================================================
# PAGE 1 — Front Cover (FIX #1, #4)
# ============================================================
def page_cover(c: Canvas):
    """
    Cover treatment v3:
      - Full-bleed photo (no scrim)
      - SINGLE combined wordmark (white variant) sized prominently in bottom-left
      - "CATALOGUE 2026" sits right of the wordmark, baseline-aligned
    Photo choice should have a naturally dark area where the wordmark sits.
    """
    fill_bleed(c, CMYK_CREAM)
    img = PHOTOS["cover_hero"]
    if img.exists():
        draw_full_bleed_image(c, str(img))

    # SINGLE combined wordmark — white version, bottom-left, prominent
    # Width ~210 figma units (about half the trim width)
    draw_combined_logo(c, fx=30, fy=380, fw_figma=210, variant="white")

    # Catalogue year — bottom-right, separate from wordmark
    draw_text_block(
        c, "CATALOGUE 2026",
        fx=380, fy=412, font_size_figma=7.5, weight=600,
        color=HUBSS_WHITE, tracking=1.6,
        align="right", max_w_figma=40,
    )


# ============================================================
# PAGE 2 — TOC (FIX #2, #3)
# ============================================================
def page_toc(c: Canvas):
    fill_bleed(c, CMYK_CREAM)

    draw_text_block(
        c, "WHAT'S INSIDE",
        fx=37, fy=52, font_size_figma=15.6, weight=800,
        color=CMYK_TEXT_DARK, tracking=0.6,   # tighter than v1
    )
    px, py = figma_to_pdf(37, 70)
    c.setFillColor(HUBSS_ORANGE)
    c.rect(px, py - 2, 24 * SCALE, 1.2, stroke=0, fill=1)

    # FIX #3: Residential Driveways added (and slot in between Public Spaces and Traffic Calming)
    entries = [
        ("Products",              "4",   88),
        ("Crosswalks",            "19",  120),
        ("Community Branding",    "31",  152),
        ("Public Spaces",         "43",  184),
        ("Residential",           "51",  216),  # NEW (was "Residential Driveways")
        ("Traffic Calming",       "55",  248),
        ("Commercial",            "59",  280),
        ("Our Installer Network", "63",  312),
        ("Book a Lunch & Learn",  "68",  344),
    ]
    NUM_X_FIGMA = 405      # right-aligned page number anchor
    DOTS_END_FIGMA = 388   # hard clip for dot strip (well before number)

    for label, num, fy in entries:
        # Orange bullet
        bx, by = figma_to_pdf(43, fy + 4)
        c.setFillColor(HUBSS_ORANGE)
        c.circle(bx, by, 1.5, stroke=0, fill=1)

        # Label (no tracking — keep it natural)
        draw_text_block(c, label, fx=51, fy=fy,
                        font_size_figma=9.5, weight=600,
                        color=CMYK_TEXT_DARK)

        label_w_pt = stringWidth(label, FONT_SANS_BOLD, fs(9.5))
        label_end_figma = 51 + (label_w_pt / SCALE)
        dots_start = label_end_figma + 4

        # FIX #2: clip the dot strip to a rectangle that ENDS at DOTS_END_FIGMA.
        # Even if drawn dots overshoot their measured width, they cannot paint
        # past the clip boundary. Belt-and-suspenders for variable font metrics.
        c.saveState()
        clip_x, clip_y = figma_to_pdf(dots_start, fy + 14)   # bottom-left of clip
        clip_w = max(0, (DOTS_END_FIGMA - dots_start) * SCALE)
        clip_h = 14 * SCALE
        path = c.beginPath()
        path.rect(clip_x, clip_y, clip_w, clip_h)
        c.clipPath(path, stroke=0, fill=0)
        # Paint a generously long dot string; clipping handles the cutoff
        long_dots = ". " * 80
        draw_text_block(c, long_dots, fx=dots_start, fy=fy,
                        font_size_figma=9.5, color=CMYK_TEXT_FAINT)
        c.restoreState()

        # Page number — right-aligned to NUM_X_FIGMA
        num_w_pt = stringWidth(num, FONT_SANS_BOLD, fs(9.5))
        num_x = NUM_X_FIGMA - (num_w_pt / SCALE)
        draw_text_block(c, num, fx=num_x, fy=fy,
                        font_size_figma=9.5, weight=600,
                        color=CMYK_TEXT_DARK)

    # Footer
    draw_text_block(
        c, "All products Canadian-specified. All photography from installations across Canada.",
        fx=36, fy=399, font_size_figma=6.9, color=CMYK_TEXT_MID,
        max_w_figma=380,
    )


# ============================================================
# PAGE 6 (Figma "5") — TrafficPatternsXD spec (FIX #5 shrink-to-fit)
# ============================================================
def page_tpxd_spec(c: Canvas):
    fill_bleed(c, CMYK_CREAM)

    # Eyebrow
    draw_text_block(c, "PRODUCT SPECIFICATION",
                    fx=37, fy=20, font_size_figma=6.5, weight=600,
                    color=HUBSS_ORANGE, tracking=1.6)

    # FIX #5: shrink-to-fit headline so "TrafficPatternsXD" never overflows
    headline = "TrafficPatternsXD"
    safe_w_pt = (450 - 37 - 37) * SCALE   # left margin 37, right margin 37
    target_size = shrink_to_fit_size(headline, FONT_SANS_BOLD, safe_w_pt, start_size=fs(31.2))
    # Convert back to "figma units" for our helper
    target_size_figma = target_size / SCALE
    draw_text_block(c, headline, fx=37, fy=37,
                    font_size_figma=target_size_figma, weight=800,
                    color=CMYK_TEXT_DARK)

    draw_text_block(c, "Three-Dimensional. Traffic-Tough.",
                    fx=37, fy=80, font_size_figma=9.5, weight=600,
                    color=CMYK_TEXT_DARK)
    draw_text_block(c, "Canadian Winter Proven.",
                    fx=37, fy=92, font_size_figma=9.5, weight=600,
                    color=HUBSS_ORANGE)

    draw_text_block(c, "150 mil", fx=37, fy=120,
                    font_size_figma=24.2, weight=800,
                    color=CMYK_TEXT_DARK)
    draw_text_block(c, "aggregate reinforced preformed thermoplastic",
                    fx=37, fy=148, font_size_figma=7.8,
                    color=CMYK_TEXT_MID, tracking=0.4)

    # FIX #7: explicit max width on body so it never clips right edge
    BODY_MAX_W = 450 - 37 - 37   # 376 figma units of safe text width
    draw_text_block(
        c,
        "Engineered for the most demanding road and parking lot conditions in Canada. "
        "TrafficPatternsXD bonds permanently through heat application without affecting "
        "the structural integrity of the underlying pavement. The result is a virtually "
        "maintenance-free decorative surface that withstands snowplow blades, de-icing "
        "chemicals, and years of heavy vehicle traffic.",
        fx=37, fy=170, font_size_figma=8.2, color=CMYK_TEXT_DARK,
        max_w_figma=BODY_MAX_W, leading_figma=11.6,
    )

    draw_text_block(
        c,
        "Where standard thermoplastics fail, XD performs. The three-dimensional aggregate "
        "surface provides superior slip resistance and a realistic paver aesthetic that "
        "specifiers and residents prefer over painted alternatives.",
        fx=37, fy=248, font_size_figma=8.2, color=CMYK_TEXT_DARK,
        max_w_figma=BODY_MAX_W, leading_figma=11.6,
    )

    # Use cases
    use_cases = [
        ("Streetscape Beautification", 35, 384),
        ("Community Branding",         234, 384),
        ("Traffic Calming Devices",    35, 403),
        ("Parking Lot Hardscapes",     234, 403),
    ]
    for label, fx, fy in use_cases:
        bx, by = figma_to_pdf(fx - 6, fy + 4)
        c.setFillColor(HUBSS_ORANGE)
        c.circle(bx, by, 1.4, stroke=0, fill=1)
        draw_text_block(c, label, fx=fx, fy=fy,
                        font_size_figma=6.5, weight=600,
                        color=CMYK_TEXT_DARK)

    draw_page_number(c, "4")


# ============================================================
# PAGE 22 — OAKVILLE TPXD gallery (FIX #7 right-clipping)
# ============================================================
def page_gallery_oakville(c: Canvas):
    fill_bleed(c, CMYK_CREAM)
    img = PHOTOS["tpxd_hero"]
    if img.exists():
        draw_image_at_figma(c, str(img), fx=0, fy=0, fw=450, fh=340)

    # Cream slab below image
    px, py = figma_to_pdf(0, 340)
    c.setFillColor(CMYK_CREAM)
    c.rect(0, 0, PAGE_W, py, stroke=0, fill=1)

    # Caption row — split into two right-bounded blocks
    draw_text_block(c, "OAKVILLE, ON", fx=22, fy=370,
                    font_size_figma=9.5, weight=800,
                    color=CMYK_TEXT_DARK, tracking=0.5)   # tighter
    # Right-aligned product label inside its own bounding box
    draw_text_block(c, "TrafficPatternsXD", fx=240, fy=372,
                    font_size_figma=7.5, weight=600,
                    color=HUBSS_ORANGE, max_w_figma=190,
                    align="right")

    draw_text_block(
        c,
        "Snowplow-tested, zero surface loss after a full Canadian winter. "
        "TrafficPatternsXD brick pattern installed at a high-traffic intersection.",
        fx=22, fy=388, font_size_figma=7.4, color=CMYK_TEXT_MID,
        max_w_figma=405, leading_figma=10.4,
    )

    draw_page_number(c, "21")


# ============================================================
# PAGE 66 — Installer card (FIX #7)
# ============================================================
def page_installer_card(c: Canvas):
    fill_bleed(c, CMYK_CREAM)

    draw_text_block(c, "HUB CERTIFIED INSTALLER",
                    fx=30, fy=28, font_size_figma=6.1, weight=600,
                    color=HUBSS_ORANGE, tracking=1.6)

    img = PHOTOS["installer_square_one"]
    if img.exists():
        draw_image_at_figma(c, str(img), fx=30, fy=50, fw=390, fh=210)

    draw_text_block(c, "British Columbia", fx=30, fy=288,
                    font_size_figma=6.9, weight=600,
                    color=CMYK_TEXT_MID, tracking=0.4)

    # Right-aligned brand stamp
    draw_text_block(c, "SQUARE ONE PAVING",
                    fx=240, fy=290, font_size_figma=5.6, weight=600,
                    color=CMYK_TEXT_DARK, tracking=1.2,
                    max_w_figma=180, align="right")

    draw_text_block(c, "Square One Paving", fx=30, fy=325,
                    font_size_figma=18.0, weight=800,
                    color=CMYK_TEXT_DARK)

    draw_text_block(
        c,
        "Experts in asphalt imprinting across British Columbia, providing outstanding "
        "products and best-in-class installation services to municipalities and "
        "developers throughout the province.",
        fx=30, fy=358, font_size_figma=7.8, color=CMYK_TEXT_DARK,
        max_w_figma=390, leading_figma=11.0,
    )

    # Contact row — three slots, each with a max width
    draw_text_block(c, "squareonepaving.com", fx=30, fy=400,
                    font_size_figma=6.9, color=HUBSS_ORANGE,
                    max_w_figma=120)
    draw_text_block(c, "mail@squareonepaving.com", fx=160, fy=400,
                    font_size_figma=6.9, color=CMYK_TEXT_MID,
                    max_w_figma=140)
    draw_text_block(c, "604-446-9902", fx=320, fy=400,
                    font_size_figma=6.9, color=CMYK_TEXT_MID,
                    max_w_figma=100)

    draw_page_number(c, "65")


# ============================================================
# PAGE 72 — Back cover (FIX #6 centering)
# ============================================================
def page_back(c: Canvas):
    """
    Back cover v3:
      - Navy field
      - SINGLE combined wordmark (white) — wheel and text together, no duplicates
      - Tagline + orange rule + contact stack underneath
    """
    fill_bleed(c, HUBSS_NAVY_RICH)

    # SINGLE combined wordmark, centered horizontally
    word_w = 240
    word_fx = (450 - word_w) / 2
    draw_combined_logo(c, fx=word_fx, fy=260, fw_figma=word_w, variant="white")

    # Tagline — centered below logo
    draw_text_block(c, "Canada's Leading Decorative Pavement Solutions",
                    fx=25, fy=335, font_size_figma=7.5,
                    color=CMYK_TEXT_FAINT,
                    align="center", max_w_figma=400)

    # Orange rule below tagline
    rule_y_fig = 358
    rule_w = 32
    rx, ry = figma_to_pdf((450 - rule_w) / 2, rule_y_fig)
    c.setFillColor(HUBSS_ORANGE)
    c.rect(rx, ry, rule_w * SCALE, 1.2, stroke=0, fill=1)

    # Contact stack
    draw_text_block(c, "hubss.com", fx=25, fy=372,
                    font_size_figma=8.0, weight=600,
                    color=HUBSS_WHITE,
                    align="center", max_w_figma=400)
    draw_text_block(c, "West / Prairies   604.309.8212",
                    fx=25, fy=390, font_size_figma=6.5,
                    color=CMYK_TEXT_FAINT,
                    align="center", max_w_figma=400)
    draw_text_block(c, "Central / Maritimes   416.540.9287",
                    fx=25, fy=401, font_size_figma=6.5,
                    color=CMYK_TEXT_FAINT,
                    align="center", max_w_figma=400)
    draw_text_block(c, "info@hubss.com",
                    fx=25, fy=406, font_size_figma=6.5,
                    color=CMYK_TEXT_FAINT,
                    align="center", max_w_figma=400)

    draw_text_block(c, "(c) 2026 HUB Surface Systems. All rights reserved.",
                    fx=25, fy=435, font_size_figma=5.6,
                    color=CMYK_TEXT_FAINT,
                    align="center", max_w_figma=400)


# ============================================================
# Build
# ============================================================
def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = Canvas(str(OUT), pagesize=PAGE_SIZE)
    c.setTitle("HUBSS Catalog 2026 - PROOF v2")
    c.setAuthor("HUB Surface Systems")

    pages = [
        page_cover, page_toc, page_tpxd_spec,
        page_gallery_oakville, page_installer_card, page_back,
    ]
    for fn in pages:
        fn(c)
        try:
            PM.add_page_marks(c, show_guides=False)
        except Exception:
            pass
        c.showPage()

    c.save()
    return OUT


if __name__ == "__main__":
    out = build()
    print(f"Wrote -> {out}")
