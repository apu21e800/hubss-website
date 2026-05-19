"""HUB Surface Systems - Catalogue 2026 final build."""
from __future__ import annotations
from pathlib import Path
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import CMYKColor
from reportlab.pdfbase.pdfmetrics import stringWidth

from .specs import (
    PAGE_SIZE, PAGE_W, PAGE_H, BLEED, TRIM_W, TRIM_H,
    HUBSS_ORANGE, HUBSS_NAVY_RICH, HUBSS_WHITE,
    FONT_SANS_BOLD,
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

OUT = ROOT / "output" / "HUBSS_Catalogue_2026_v27.pdf"


# ---- accent palette --------------------------------------------------
# Chip background — barely-there cool tint on cream paper.
# Previous 18C version printed as a strong blue band; this is a whisper.
# The eye reads "subtly different from paper" without "blue chips."
CMYK_CHIP_BG = CMYKColor(0.05, 0.02, 0.00, 0.04)
# Chip text — a soft cool-grey that hints at navy without going saturated.
CMYK_CHIP_TEXT = CMYKColor(0.50, 0.30, 0.10, 0.65)
# Aliases retained so any reference outside this file still resolves.
CMYK_CHIP_BLUE = CMYK_CHIP_BG
CMYK_CHIP_BLUE_TEXT = CMYK_CHIP_TEXT

# On-dark text palette — navy background pages (near-white = less ink, not more)
CMYK_ON_DARK_BODY = CMYKColor(0.00, 0.00, 0.00, 0.10)  # near-white body text
CMYK_ON_DARK_MID  = CMYKColor(0.00, 0.00, 0.00, 0.45)  # mid-grey secondary labels
CMYK_ON_DARK_RULE = CMYKColor(0.12, 0.08, 0.04, 0.70)  # subtle divider on dark


# ---- product logos --------------------------------------------------
LOGOS_DIR = ROOT / "output" / "_logos"

# Map product name → (white_logo_path, color_logo_path, aspect_ratio).
# White logos are used on dark hero pages; color on light spec pages.
# Products without a registered logo fall back to orange tracked-caps text.
_PRODUCT_LOGO_DIR = ROOT.parent / "public" / "images" / "assets" / "logos" / "product-logos"

# Product logos intentionally cleared — all third-party product logos either
# carry Ennis-Flint manufacturer branding or render invisible (white-on-white).
# DDB-quality direction: every product page uses a consistent typographic
# wordmark treatment (see page_product_spec below). This gives HUB full brand
# ownership of the catalogue without sub-brand clutter.
PRODUCT_LOGOS: dict = {}


def get_product_logo(name, variant="white"):
    """Return Path to a product logo if registered, else None."""
    entry = PRODUCT_LOGOS.get(name)
    if not entry:
        return None
    p = entry.get(variant) or entry.get("white") or entry.get("color")
    if p and Path(p).exists():
        return Path(p)
    return None


def draw_product_logo(c, name, fx, fy, fw_figma, variant="white"):
    """Draw a product wordmark at given Figma coordinates. Returns True on success."""
    p = get_product_logo(name, variant)
    if not p:
        return False
    try:
        from PIL import Image
        with Image.open(p) as im:
            iw, ih = im.size
        aspect = ih / iw  # height / width
        fh = fw_figma * aspect
        px_pt = BLEED + fx * SCALE
        py_pt = BLEED + TRIM_H - (fy + fh) * SCALE
        draw_image_box(c, str(p), px_pt, py_pt, fw_figma * SCALE, fh * SCALE,
                       cover=False, convert_to_cmyk=False)
        return True
    except Exception as e:
        print(f"logo draw failed for {name}: {e}")
        return False


# ---- orphan prevention --------------------------------------------------
NBSP = "\xa0"


def no_orphan(text, last_n=2):
    """Bind the last `last_n` words together with non-breaking spaces so the
    line-wrapper can't leave a single short word on its own line.
    e.g. "Traffic-ready in 30 minutes. Even at -10 C." → joins
    'at -10 C.' with NBSPs so it stays together as the final phrase.
    """
    if not text:
        return text
    words = text.rstrip().split(" ")
    if len(words) <= last_n:
        return text
    head = " ".join(words[:-last_n])
    tail = NBSP.join(words[-last_n:])
    return head + " " + tail


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
    draw_image_box(c, str(LOGO_WHITE), px, py, fw_figma * SCALE, fh * SCALE,
                   cover=False, convert_to_cmyk=False)


def draw_logo_color(c, fx, fy, fw_figma):
    if not LOGO_COLOR.exists(): return
    fh = fw_figma / LOGO_ASPECT
    px = BLEED + fx * SCALE
    py = BLEED + TRIM_H - (fy + fh) * SCALE
    draw_image_box(c, str(LOGO_COLOR), px, py, fw_figma * SCALE, fh * SCALE,
                   cover=False, convert_to_cmyk=False)


def tracked_caps(c, text, fx, fy, *, size=7.5, color=None, max_w_figma=200, align="left"):
    color = color if color is not None else CMYK_TEXT_MID
    draw_text_block(c, text.upper(), fx=fx, fy=fy,
                    font_size_figma=size, weight=600, color=color,
                    tracking=2.4, max_w_figma=max_w_figma, align=align)


def orange_dot(c, fx, fy, *, r_figma=2.0):
    px, py = figma_to_pdf(fx, fy)
    c.setFillColor(HUBSS_ORANGE)
    c.circle(px, py, r_figma * SCALE, stroke=0, fill=1)


def thin_rule(c, fx, fy, w_figma, *, color=None, weight_pt=0.6):
    color = color if color is not None else CMYK_TEXT_FAINT
    px, py = figma_to_pdf(fx, fy)
    c.setFillColor(color)
    c.rect(px, py, w_figma * SCALE, weight_pt, stroke=0, fill=1)


def folio(c, page_no, *, on_dark=False):
    """Discreet page number in the bottom-right corner."""
    n = str(page_no).zfill(2)
    color = HUBSS_WHITE if on_dark else CMYK_TEXT_FAINT
    tracked_caps(c, n, fx=395, fy=435, size=6.5,
                 color=color, align="right", max_w_figma=30)


_SCRIM_CACHE = {}


def _make_scrim_png(height_px=400, width_px=8, max_alpha=180, ease=1.6):
    """Render a true black-to-transparent gradient PNG (cached)."""
    from PIL import Image
    key = (height_px, width_px, max_alpha, ease)
    if key in _SCRIM_CACHE:
        return _SCRIM_CACHE[key]
    img = Image.new("RGBA", (width_px, height_px), (0, 0, 0, 0))
    px = img.load()
    for y in range(height_px):
        # y=0 is top of image (transparent), y=height_px-1 is bottom (most opaque)
        progress = y / max(1, (height_px - 1))   # 0..1, 1 at bottom
        a = int(max_alpha * (progress ** ease))
        for x in range(width_px):
            px[x, y] = (0, 0, 0, a)
    out = ROOT / "output" / "_cache" / f"scrim_{height_px}_{max_alpha}.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out)
    _SCRIM_CACHE[key] = out
    return out


def hero_scrim(c, height_figma=160):
    """Real linear-gradient scrim using a PIL-rendered PNG. No banding."""
    png = _make_scrim_png(height_px=400, max_alpha=185)
    h_pdf = height_figma * SCALE
    c.drawImage(str(png), 0, 0, width=PAGE_W, height=h_pdf,
                preserveAspectRatio=False, mask='auto')


_GLOW_CACHE = {}


def _make_glow_png(height_px=400, width_px=8, max_alpha=140, ease=2.0,
                   r=249, g=115, b=22):
    """Render a transparent-to-orange vertical gradient PNG for accent washes."""
    from PIL import Image
    key = (height_px, width_px, max_alpha, ease, r, g, b)
    if key in _GLOW_CACHE:
        return _GLOW_CACHE[key]
    img = Image.new("RGBA", (width_px, height_px), (r, g, b, 0))
    px = img.load()
    for y in range(height_px):
        progress = y / max(1, (height_px - 1))   # 0 top, 1 bottom
        a = int(max_alpha * (progress ** ease))
        for x in range(width_px):
            px[x, y] = (r, g, b, a)
    out = ROOT / "output" / "_cache" / f"glow_{height_px}_{max_alpha}_{r}_{g}_{b}.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out)
    _GLOW_CACHE[key] = out
    return out


def orange_glow(c, height_figma=80, max_alpha=120):
    """Warm orange-yellow accent wash at the bottom — mirrors the website hero."""
    png = _make_glow_png(height_px=400, max_alpha=max_alpha,
                         r=249, g=140, b=40)  # orange→amber blend
    h_pdf = height_figma * SCALE
    c.drawImage(str(png), 0, 0, width=PAGE_W, height=h_pdf,
                preserveAspectRatio=False, mask='auto')


def _navy_fill_unused(c):
    fill_bleed(c, HUBSS_NAVY_RICH)


_CORNER_CACHE: dict = {}


def _make_corner_png(size_px: int = 700, max_alpha: int = 90) -> "Path":
    """Radial orange glow from top-right corner, rendered as RGBA PNG."""
    from PIL import Image
    key = (size_px, max_alpha)
    if key in _CORNER_CACHE:
        return _CORNER_CACHE[key]
    img = Image.new("RGBA", (size_px, size_px), (0, 0, 0, 0))
    pix = img.load()
    r, g, b = 249, 115, 22  # HUBSS orange
    for y in range(size_px):
        for x in range(size_px):
            dx = size_px - 1 - x  # distance from right edge
            dy = y                 # distance from top edge
            dist = (dx * dx + dy * dy) ** 0.5
            t = max(0.0, 1.0 - dist / (size_px * 0.72))
            t = t ** 1.7  # soft ease
            pix[x, y] = (r, g, b, int(max_alpha * t))
    out = ROOT / "output" / "_cache" / f"corner_{size_px}_{max_alpha}.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out)
    _CORNER_CACHE[key] = out
    return out


def corner_accent(c, max_alpha: int = 80, size_figma: int = 240) -> None:
    """Diagonal orange radial glow from top-right corner — matches website hero aesthetic."""
    png = _make_corner_png(max_alpha=max_alpha)
    sz = size_figma * SCALE
    # PDF origin is bottom-left; top-right = (PAGE_W - sz, PAGE_H - sz)
    c.drawImage(str(png), PAGE_W - sz, PAGE_H - sz, width=sz, height=sz,
                preserveAspectRatio=False, mask='auto')


def page_cover(c):
    """Cover — full-bleed photo, heavy bottom scrim, LEFT-ALIGNED wordmark
    (per Vernon's preference) at confident scale. Catalogue 2026 sits at the
    right edge of the lower band as a quiet counter-balance.

    Layout decisions:
      - Logo at 200 figma wide (~44% of page) — bigger than the original 160
        but still reading as bottom-left "anchor" rather than centered crest.
      - Heavy 200-figma dark scrim ensures the wordmark sits on real darkness.
      - Orange glow at the very bottom carries the website warmth.
    """
    fill_bleed(c, HUBSS_WHITE)
    if CC.COVER_PHOTO and CC.COVER_PHOTO.exists():
        draw_full_bleed_image(c, str(CC.COVER_PHOTO))
    hero_scrim(c, height_figma=210)
    corner_accent(c, max_alpha=55, size_figma=260)

    # Slim orange accent rule — the one brand-colour touch above the wordmark.
    # Pure solid ink: no transparency, prints reliably on CMYK press.
    thin_rule(c, fx=28, fy=376, w_figma=64, color=HUBSS_ORANGE, weight_pt=2.0)

    # Left-aligned wordmark — bigger than before, anchored to the lower-left
    draw_logo_white(c, fx=28, fy=384, fw_figma=160)

    # Catalogue 2026 at the right edge of the lower band — a quiet caption
    tracked_caps(c, "Catalogue 2026", fx=290, fy=400, size=7.0,
                 color=HUBSS_WHITE, align="right", max_w_figma=130)
    tracked_caps(c, "Decorative Pavement Solutions", fx=240, fy=415,
                 size=6.0, color=HUBSS_WHITE,
                 align="right", max_w_figma=180)


def page_half_title(c):
    fill_bleed(c, HUBSS_WHITE)
    draw_logo_color(c, fx=(450-180)/2, fy=200, fw_figma=180)
    tracked_caps(c, "Catalogue 2026", fx=25, fy=265, size=7.5,
                 color=CMYK_TEXT_MID, align="center", max_w_figma=400)
    tracked_caps(c, "Established 1994", fx=25, fy=283, size=6.5,
                 color=CMYK_TEXT_FAINT, align="center", max_w_figma=400)
    orange_dot(c, fx=225, fy=395, r_figma=2.5)


def page_manifesto(c):
    fill_bleed(c, HUBSS_WHITE)
    m = CC.MANIFESTO
    tracked_caps(c, m["eyebrow"], fx=40, fy=70, size=7.5, color=HUBSS_ORANGE)
    y = 120
    for i, line in enumerate(m["h1_lines"]):
        col = HUBSS_ORANGE if i == m["h1_orange_line"] else CMYK_TEXT_DARK
        draw_text_block(c, line, fx=40, fy=y, font_size_figma=36, weight=800,
                        color=col, tracking=-1.0)
        y += 42
    draw_text_block(c, m["body"], fx=40, fy=y + 20, font_size_figma=10,
                    color=CMYK_TEXT_DARK, max_w_figma=350, leading_figma=16)
    thin_rule(c, fx=40, fy=393, w_figma=56, color=HUBSS_ORANGE, weight_pt=2.0)
    tracked_caps(c, m["signature"], fx=40, fy=410, size=6.5,
                 color=CMYK_TEXT_FAINT, max_w_figma=350)


def page_why_stats(c):
    fill_bleed(c, HUBSS_WHITE)
    w = CC.WHY_HUB
    tracked_caps(c, w["eyebrow"], fx=40, fy=50, size=7.5, color=HUBSS_ORANGE)
    y = 88
    for line in w["title_lines"]:
        draw_text_block(c, line, fx=40, fy=y, font_size_figma=32,
                        weight=800, color=CMYK_TEXT_DARK, tracking=-0.9)
        y += 38
    draw_text_block(c, w["subtitle"], fx=40, fy=y + 4, font_size_figma=11,
                    color=CMYK_TEXT_MID, figma_font="serif",
                    max_w_figma=400, leading_figma=15)
    # Navy stat cells — orange number + white label on navy, matching website card style
    grid_y = 240
    cell_w = 195
    cell_h = 90
    for i, (num, label, sub) in enumerate(w["stats"]):
        row = i // 2
        col = i % 2
        gx = 30 + col * (cell_w + 8)
        gy = grid_y + row * (cell_h + 4)
        # Navy cell background
        cell_x_pt, cell_y_pt = figma_to_pdf(gx, gy)
        c.setFillColor(HUBSS_NAVY_RICH)
        c.roundRect(cell_x_pt, cell_y_pt - cell_h * SCALE, cell_w * SCALE,
                    cell_h * SCALE, 3, stroke=0, fill=1)
        # Orange big number
        draw_text_block(c, num, fx=gx + 8, fy=gy + 10,
                        font_size_figma=34, weight=800,
                        color=HUBSS_ORANGE, tracking=-0.8)
        # White label + grey sub on navy
        tracked_caps(c, label, fx=gx + 8, fy=gy + 52, size=7.0,
                     color=HUBSS_WHITE, max_w_figma=cell_w - 16)
        draw_text_block(c, sub, fx=gx + 8, fy=gy + 64,
                        font_size_figma=7.5, color=CMYK_ON_DARK_MID,
                        max_w_figma=cell_w - 16, leading_figma=10)
    thin_rule(c, fx=40, fy=430, w_figma=56, color=HUBSS_ORANGE, weight_pt=2.0)


def page_why_proof(c):
    fill_bleed(c, HUBSS_WHITE)
    w = CC.WHY_HUB
    tracked_caps(c, "Four Reasons", fx=40, fy=50, size=7.5, color=HUBSS_ORANGE)
    draw_text_block(c, "If it goes on the street,",
                    fx=40, fy=78, font_size_figma=24, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-0.6)
    draw_text_block(c, "it stays on the street.",
                    fx=40, fy=110, font_size_figma=24, weight=800,
                    color=HUBSS_ORANGE, tracking=-0.6)
    y = 175
    for num, claim, detail in w["proof"]:
        tracked_caps(c, num, fx=40, fy=y, size=7.0, color=HUBSS_ORANGE,
                     max_w_figma=30)
        draw_text_block(c, claim, fx=80, fy=y, font_size_figma=12,
                        weight=800, color=CMYK_TEXT_DARK, tracking=-0.3,
                        max_w_figma=340)
        draw_text_block(c, detail, fx=80, fy=y + 18, font_size_figma=8.5,
                        color=CMYK_TEXT_MID, max_w_figma=340, leading_figma=12)
        thin_rule(c, fx=40, fy=y + 50, w_figma=380, color=CMYK_TEXT_FAINT,
                  weight_pt=0.3)
        y += 60
    thin_rule(c, fx=40, fy=430, w_figma=56, color=HUBSS_ORANGE, weight_pt=2.0)


def page_toc(c, sections):
    fill_bleed(c, HUBSS_WHITE)
    tracked_caps(c, "What's Inside", fx=40, fy=60, size=7.5, color=HUBSS_ORANGE)
    draw_text_block(c, "Catalogue 2026.", fx=40, fy=88, font_size_figma=32,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.0)
    y = 160
    for label, num in sections:
        orange_dot(c, fx=42, fy=y + 4, r_figma=1.6)
        draw_text_block(c, label, fx=52, fy=y, font_size_figma=10,
                        weight=600, color=CMYK_TEXT_DARK, tracking=0.3)
        draw_text_block(c, str(num), fx=400, fy=y, font_size_figma=10,
                        weight=600, color=CMYK_TEXT_DARK,
                        max_w_figma=15, align="right")
        thin_rule(c, fx=40, fy=y + 18, w_figma=380, color=CMYK_TEXT_FAINT,
                  weight_pt=0.3)
        y += 26


def page_section_open(c, section_no, title, photo_path):
    """Section divider — full-bleed photo, dark scrim, corner accent."""
    fill_bleed(c, HUBSS_WHITE)
    if photo_path and photo_path.exists():
        draw_full_bleed_image(c, str(photo_path))
    hero_scrim(c, height_figma=210)
    corner_accent(c, max_alpha=50, size_figma=230)
    tracked_caps(c, "Section " + section_no, fx=30, fy=325, size=7.5,
                 color=HUBSS_WHITE, max_w_figma=140)
    draw_text_block(c, title, fx=30, fy=348, font_size_figma=48, weight=800,
                    color=HUBSS_WHITE, tracking=-1.4, leading_figma=50)
    orange_dot(c, fx=30, fy=415, r_figma=2.2)
    thin_rule(c, fx=40, fy=414, w_figma=56, color=HUBSS_ORANGE, weight_pt=2.0)


def page_product_hero(c, prod):
    """Product hero — full-bleed photo, dark scrim, diagonal corner accent."""
    fill_bleed(c, HUBSS_WHITE)
    if prod["hero"] and prod["hero"].exists():
        draw_full_bleed_image(c, str(prod["hero"]))
    hero_scrim(c, height_figma=190)
    corner_accent(c, max_alpha=70, size_figma=260)

    orange_dot(c, fx=33, fy=362, r_figma=1.8)
    tracked_caps(c, prod["name"], fx=42, fy=358, size=12.5,
                 color=HUBSS_WHITE, max_w_figma=400)

    tagline = no_orphan(prod["tagline"], last_n=3)
    draw_text_block(c, tagline, fx=30, fy=388, font_size_figma=24,
                    weight=800, color=HUBSS_WHITE, tracking=-0.6,
                    max_w_figma=400, leading_figma=26)



def page_product_spec(c, prod):
    """Cream base + navy header band with product logo + dark text on cream.
    The navy band anchors the logo and carries the website's brand colour
    without flipping the whole page dark."""
    fill_bleed(c, HUBSS_WHITE)

    # Navy header band — full width, top ~26% of trim, extends into bleed
    BAND_H = 118  # figma units
    band_pdf_y = BLEED + TRIM_H - BAND_H * SCALE
    c.setFillColor(HUBSS_NAVY_RICH)
    c.rect(0, band_pdf_y, PAGE_W, BAND_H * SCALE + BLEED, stroke=0, fill=1)

    # Corner accent sits on top of the navy band for depth
    corner_accent(c, max_alpha=50, size_figma=220)

    # Typographic product wordmark — DDB-quality, fully HUB-branded.
    # No third-party logos: every product page uses the same confident
    # typographic system — consistent, premium, unambiguously HUB's.

    # "by HUB Surface Systems" — small attribution cap above the name
    tracked_caps(c, "by HUB Surface Systems", fx=28, fy=20, size=5.8,
                 color=HUBSS_ORANGE, max_w_figma=300)

    # Product name at display scale — the wordmark itself
    draw_text_block(c, prod["name"], fx=28, fy=34, font_size_figma=34,
                    weight=800, color=HUBSS_WHITE, tracking=-0.8,
                    max_w_figma=380)

    # Slim orange rule under name — brand signature line
    thin_rule(c, fx=28, fy=80, w_figma=44, color=HUBSS_ORANGE, weight_pt=2.0)

    # Category label — below the rule, right-side of band
    cat = prod.get("category", "Decorative Pavement")
    tracked_caps(c, cat, fx=30, fy=95, size=6.0, color=HUBSS_WHITE,
                 max_w_figma=380)

    # Cream body — all dark text
    title = prod["title"]
    title_y = 132
    safe_w_pt = (380 - 4) * SCALE
    target_size = display_size_for(title)
    while target_size > 18 and stringWidth(title, FONT_SANS_BOLD,
                                            target_size * SCALE) > safe_w_pt:
        target_size -= 1
    draw_text_block(c, title, fx=30, fy=title_y,
                    font_size_figma=target_size,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8,
                    max_w_figma=380)

    y = title_y + int(target_size * 1.15) + 8

    draw_text_block(c, prod["italic"], fx=30, fy=y, font_size_figma=11,
                    color=CMYK_TEXT_MID, figma_font="serif",
                    max_w_figma=380, leading_figma=16)
    y += 36

    # Callout stat — value in orange, unit in neutral dark (no navy ink here)
    callout_combined = prod["callout"] + "  ·  " + prod["callout_unit"]
    tracked_caps(c, callout_combined, fx=30, fy=y, size=7.0,
                 color=HUBSS_ORANGE, max_w_figma=380)
    y += 18

    draw_text_block(c, prod["body"], fx=30, fy=y, font_size_figma=9.5,
                    color=CMYK_TEXT_DARK, max_w_figma=380, leading_figma=14.5)

    sp = prod.get("spec_pairs") or []
    if sp:
        thin_rule(c, fx=30, fy=345, w_figma=390, color=CMYK_TEXT_FAINT,
                  weight_pt=0.3)
        cols_x = [30, 230]
        for i, (label, value) in enumerate(sp[:4]):
            row = i // 2
            col = i % 2
            x = cols_x[col]
            yy = 360 + row * 32
            tracked_caps(c, label, fx=x, fy=yy, size=6.5,
                         color=CMYK_TEXT_FAINT, max_w_figma=190)
            draw_text_block(c, value, fx=x, fy=yy + 10,
                            font_size_figma=8.0, weight=600,
                            color=CMYK_TEXT_DARK, max_w_figma=185,
                            leading_figma=10)
    uses = prod.get("uses") or []
    if uses:
        joined = "   ·   ".join(uses)
        tracked_caps(c, joined, fx=25, fy=430, size=6.8,
                     color=CMYK_TEXT_MID, align="center", max_w_figma=400)


def page_application(c, app, idx, total):
    """Image dominates ~65% of page; type sits in lower 35%."""
    fill_bleed(c, HUBSS_WHITE)
    if app["image"] and app["image"].exists():
        draw_image_at_figma(c, str(app["image"]), fx=0, fy=0, fw=450, fh=295)
    label = "Application   " + str(idx).zfill(2) + " of " + str(total).zfill(2)
    tracked_caps(c, label, fx=30, fy=315, size=6.5, color=HUBSS_ORANGE)
    name_size = min(display_size_for(app["name"]), 28)
    draw_text_block(c, app["name"], fx=30, fy=335,
                    font_size_figma=name_size,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8,
                    max_w_figma=400)
    draw_text_block(c, no_orphan(app["tagline"], 3), fx=30, fy=375, font_size_figma=10,
                    color=CMYK_TEXT_MID, figma_font="serif",
                    max_w_figma=380, leading_figma=14)
    draw_text_block(c, no_orphan(app["body"], 3), fx=30, fy=400, font_size_figma=8.5,
                    color=CMYK_TEXT_DARK, max_w_figma=380, leading_figma=12.5)


def page_project_hero(c, proj):
    fill_bleed(c, HUBSS_WHITE)
    if proj["hero"] and proj["hero"].exists():
        draw_full_bleed_image(c, str(proj["hero"]))
    hero_scrim(c, height_figma=180)
    corner_accent(c, max_alpha=55, size_figma=240)
    # Project name first (small caps in orange) so contractors get the credit
    tracked_caps(c, proj["name"], fx=30, fy=325, size=7.0,
                 color=HUBSS_ORANGE, max_w_figma=400)
    # Title — heavier, bigger, with orphan prevention
    draw_text_block(c, no_orphan(proj["title"], 3), fx=30, fy=348, font_size_figma=25,
                    weight=800, color=HUBSS_WHITE, tracking=-0.6,
                    max_w_figma=400, leading_figma=28)
    tracked_caps(c, proj["location"], fx=30, fy=413, size=7.0,
                 color=HUBSS_WHITE, max_w_figma=240)
    tracked_caps(c, proj["product"], fx=200, fy=413, size=7.0,
                 color=HUBSS_ORANGE, align="right", max_w_figma=220)


def page_project_story(c, proj, idx):
    """Detail image dominates the upper ~57%; case-study type rests below."""
    fill_bleed(c, HUBSS_WHITE)
    if proj.get("detail") and proj["detail"].exists():
        draw_image_at_figma(c, str(proj["detail"]), fx=0, fy=0, fw=450, fh=255)
    label = "Project " + str(idx).zfill(2)
    tracked_caps(c, label, fx=30, fy=275, size=6.8, color=HUBSS_ORANGE)
    title_size = min(display_size_for(proj["title"]), 22)
    draw_text_block(c, no_orphan(proj["title"], 3), fx=30, fy=295,
                    font_size_figma=title_size,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.6,
                    max_w_figma=380)
    sub = proj["location"] + "    " + proj["product"]
    draw_text_block(c, sub, fx=30, fy=337, font_size_figma=7.5, weight=600,
                    color=CMYK_TEXT_MID, tracking=1.4, max_w_figma=380)
    draw_text_block(c, no_orphan(proj["story"], 3), fx=30, fy=358, font_size_figma=8.0,
                    color=CMYK_TEXT_DARK, max_w_figma=380, leading_figma=11.5)


def page_installer(c, inst):
    fill_bleed(c, HUBSS_WHITE)
    tracked_caps(c, "HUB Certified Installer", fx=30, fy=30, size=6.5,
                 color=HUBSS_ORANGE)
    if inst["image"] and inst["image"].exists():
        draw_image_at_figma(c, str(inst["image"]), fx=30, fy=55, fw=390, fh=180)
    tracked_caps(c, inst["region"], fx=30, fy=250, size=6.5,
                 color=CMYK_TEXT_FAINT, max_w_figma=380)
    draw_text_block(c, inst["name"], fx=30, fy=270,
                    font_size_figma=28,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.5,
                    max_w_figma=380, leading_figma=32)
    draw_text_block(c, inst["body"], fx=30, fy=325, font_size_figma=9.5,
                    color=CMYK_TEXT_DARK, max_w_figma=380, leading_figma=14.5)

    thin_rule(c, fx=30, fy=380, w_figma=380, color=HUBSS_ORANGE, weight_pt=0.8)

    tracked_caps(c, "Phone", fx=30, fy=395, size=6.0,
                 color=CMYK_TEXT_FAINT, max_w_figma=180)
    draw_text_block(c, inst["phone"], fx=30, fy=408,
                    font_size_figma=15, weight=800,
                    color=CMYK_TEXT_DARK, max_w_figma=180, tracking=-0.3)

    tracked_caps(c, "Online", fx=220, fy=395, size=6.0,
                 color=CMYK_TEXT_FAINT, max_w_figma=200)
    draw_text_block(c, inst["url"], fx=220, fy=408,
                    font_size_figma=13, weight=800,
                    color=HUBSS_ORANGE, max_w_figma=200, tracking=-0.2)



def page_technical_reference(c):
    fill_bleed(c, HUBSS_WHITE)
    tracked_caps(c, "Product Reference", fx=30, fy=40, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, "The systems.", fx=30, fy=68, font_size_figma=28,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8)
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
    y = 130
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
    fill_bleed(c, HUBSS_WHITE)
    tracked_caps(c, "Specified Coast to Coast", fx=30, fy=40, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, "Trusted, by name.", fx=30, fy=68, font_size_figma=28,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8)
    draw_text_block(c,
        "Five hundred Canadian municipalities have specified HUB systems by name "
        "from Halifax to Vancouver, every climate zone, every scale of project.",
        fx=30, fy=108, font_size_figma=10, color=CMYK_TEXT_MID,
        max_w_figma=380, leading_figma=15)
    cities = CC.CITIES
    col1_x = 30
    col2_x = 230
    y = 178
    for i in range(0, len(cities), 2):
        orange_dot(c, fx=col1_x - 8, fy=y + 4, r_figma=1.4)
        draw_text_block(c, cities[i], fx=col1_x, fy=y, font_size_figma=9,
                        weight=600, color=CMYK_TEXT_DARK, tracking=0.4,
                        max_w_figma=180)
        if i + 1 < len(cities):
            orange_dot(c, fx=col2_x - 8, fy=y + 4, r_figma=1.4)
            draw_text_block(c, cities[i + 1], fx=col2_x, fy=y, font_size_figma=9,
                            weight=600, color=CMYK_TEXT_DARK, tracking=0.4,
                            max_w_figma=180)
        y += 14


def page_lunch_learn(c):
    fill_bleed(c, HUBSS_WHITE)
    img = ROOT / "assets" / "booklet" / "Splash Pad 2.png"
    if img.exists():
        draw_image_at_figma(c, str(img), fx=0, fy=0, fw=450, fh=170)
    tracked_caps(c, "An Invitation", fx=30, fy=195, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, "See it. Spec it.", fx=30, fy=220, font_size_figma=32,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.0)
    draw_text_block(c, "We'll bring lunch.", fx=30, fy=258, font_size_figma=32,
                    weight=800, color=HUBSS_ORANGE, tracking=-1.0)
    draw_text_block(c,
        "Book a complimentary Lunch and Learn for your team. One hour. "
        "Real project walkthroughs, material specs, and Q and A tailored "
        "to your upcoming jobs. In-person or virtual.",
        fx=30, fy=305, font_size_figma=10, color=CMYK_TEXT_DARK,
        max_w_figma=380, leading_figma=15)
    cta_x, cta_y = figma_to_pdf((450 - 200) / 2, 395)
    c.setFillColor(HUBSS_ORANGE)
    c.roundRect(cta_x, cta_y, 200 * SCALE, 24 * SCALE, 4 * SCALE, stroke=0, fill=1)
    draw_text_block(c, "BOOK NOW   hubss.com/lnl",
                    fx=(450 - 200) / 2, fy=380, font_size_figma=8.5,
                    weight=800, color=HUBSS_WHITE, tracking=1.6,
                    max_w_figma=200, align="center")
    draw_text_block(c, "West / Prairies   604.309.8212    Central / Maritimes   416.540.9287",
                    fx=25, fy=440, font_size_figma=7,
                    color=CMYK_TEXT_FAINT, align="center", max_w_figma=400)


def page_contact(c):
    fill_bleed(c, HUBSS_WHITE)
    tracked_caps(c, "Two Offices, One Network", fx=30, fy=40, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, "Speak with HUB.", fx=30, fy=68, font_size_figma=28,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.8)
    tracked_caps(c, "Western Canada", fx=30, fy=160, size=6.5, color=CMYK_TEXT_FAINT)
    draw_text_block(c, "Cleve Stordy", fx=30, fy=180, font_size_figma=14,
                    weight=800, color=CMYK_TEXT_DARK)
    draw_text_block(c, "cleve.stordy@hubss.com", fx=30, fy=205,
                    font_size_figma=9.5, color=HUBSS_ORANGE)
    draw_text_block(c, "604.309.8212", fx=30, fy=222,
                    font_size_figma=9.5, color=CMYK_TEXT_MID)
    draw_text_block(c, "Ladysmith, British Columbia", fx=30, fy=242,
                    font_size_figma=8.5, color=CMYK_TEXT_MID, figma_font="serif")
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
    draw_text_block(c, "Request a spec sheet, or book a Lunch and Learn.",
                    fx=30, fy=340, font_size_figma=11,
                    color=CMYK_TEXT_DARK, figma_font="serif", max_w_figma=380)
    tracked_caps(c, "hubss.com", fx=30, fy=370, size=8.0,
                 color=HUBSS_ORANGE, max_w_figma=200)


def _make_navy_wash_png(height_px=600, width_px=8, top_alpha=210, bottom_alpha=185):
    """Render a smooth top-to-bottom navy wash PNG (no banding).
    Slightly heavier at the top so the wordmark sits on real darkness."""
    from PIL import Image
    key = ('navy_wash', height_px, top_alpha, bottom_alpha)
    if key in _SCRIM_CACHE:
        return _SCRIM_CACHE[key]
    img = Image.new("RGBA", (width_px, height_px), (0, 0, 0, 0))
    px = img.load()
    # Navy-leaning rich black: low-saturation deep blue-black
    r, g, b = 12, 18, 32
    for y in range(height_px):
        progress = y / max(1, (height_px - 1))   # 0 top, 1 bottom
        a = int(top_alpha + (bottom_alpha - top_alpha) * progress)
        for x in range(width_px):
            px[x, y] = (r, g, b, a)
    out = ROOT / "output" / "_cache" / f"navywash_{height_px}_{top_alpha}_{bottom_alpha}.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out)
    _SCRIM_CACHE[key] = out
    return out


def page_back(c):
    """Back cover — asphalt photo with a smooth navy wash overlay (no banding)."""
    fill_bleed(c, HUBSS_NAVY_RICH)
    asphalt = ROOT.parent / "public" / "images" / "applications" / "parking-lots" / "parking-lots-01.jpg"
    if asphalt.exists():
        draw_full_bleed_image(c, str(asphalt))
    # Smooth navy wash from PIL — replaces the 60-band approach that produced
    # visible horizontal stripes in the previous build.
    wash_png = _make_navy_wash_png(height_px=600, top_alpha=215, bottom_alpha=190)
    c.drawImage(str(wash_png), 0, 0, width=PAGE_W, height=PAGE_H,
                preserveAspectRatio=False, mask='auto')

    # Centred wordmark
    word_w = 240
    word_fx = (450 - word_w) / 2
    draw_logo_white(c, fx=word_fx, fy=260, fw_figma=word_w)
    draw_text_block(c, "Canada's Leading Decorative Pavement Solutions",
                    fx=25, fy=335, font_size_figma=8, color=HUBSS_WHITE,
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
                    color=CMYK_ON_DARK_BODY, align="center", max_w_figma=400)    # near-white
    draw_text_block(c, "Central / Maritimes   416.540.9287",
                    fx=25, fy=410, font_size_figma=7.0,
                    color=CMYK_ON_DARK_BODY, align="center", max_w_figma=400)
    draw_text_block(c, "(c) 2026 HUB Surface Systems",
                    fx=25, fy=445, font_size_figma=6.5,
                    color=CMYK_ON_DARK_MID, align="center",
                    max_w_figma=400, tracking=1.0)


# ============================================================
# Closing pages — replace useless padding with meaningful content
# ============================================================
def page_closing_manifesto(c):
    """A typographic closing — reinforces the brand story."""
    fill_bleed(c, HUBSS_WHITE)
    tracked_caps(c, "A Final Word", fx=40, fy=70, size=7.5, color=HUBSS_ORANGE)
    draw_text_block(c, "The street is", fx=40, fy=130, font_size_figma=44,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.2)
    draw_text_block(c, "the public realm.", fx=40, fy=185, font_size_figma=44,
                    weight=800, color=HUBSS_ORANGE, tracking=-1.2)
    draw_text_block(
        c,
        "Every surface we build is walked over, driven on, played at, "
        "and lived around. That is the standard we hold ourselves to. "
        "Spec the surface. Watch it work. Walk over it for twenty years.",
        fx=40, fy=270, font_size_figma=11, weight=400,
        color=CMYK_TEXT_DARK, max_w_figma=350, leading_figma=18,
        figma_font="serif")
    thin_rule(c, fx=40, fy=393, w_figma=56, color=HUBSS_ORANGE, weight_pt=2.0)
    tracked_caps(c, "Specified. Installed. Backed.",
                 fx=40, fy=410, size=6.5,
                 color=CMYK_TEXT_FAINT, max_w_figma=350)


def page_service_promise(c):
    fill_bleed(c, HUBSS_WHITE)
    tracked_caps(c, "How We Work", fx=30, fy=50, size=7.0, color=HUBSS_ORANGE)
    draw_text_block(c, "Specified.", fx=30, fy=80, font_size_figma=32,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.0)
    draw_text_block(c, "Installed.", fx=30, fy=120, font_size_figma=32,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-1.0)
    draw_text_block(c, "Backed.", fx=30, fy=160, font_size_figma=32,
                    weight=800, color=HUBSS_ORANGE, tracking=-1.0)
    steps = [
        ("01", "Consultation",
         "Lunch & Learn, project walkthrough, or full spec review. We meet at your office or your project site."),
        ("02", "Specification",
         "We work with your engineering team on product selection, colour matching, and technical compliance."),
        ("03", "Installation",
         "HUB-certified applicators install to manufacturer spec. Project documented, site cleaned, ready to use."),
        ("04", "Standing By",
         "Material warranty backed by HUB. Service support across every Canadian climate zone, year after year."),
    ]
    y = 220
    for num, claim, detail in steps:
        tracked_caps(c, num, fx=30, fy=y, size=6.5, color=HUBSS_ORANGE, max_w_figma=30)
        draw_text_block(c, claim, fx=70, fy=y, font_size_figma=11,
                        weight=800, color=CMYK_TEXT_DARK, tracking=-0.3, max_w_figma=350)
        draw_text_block(c, detail, fx=70, fy=y + 16, font_size_figma=8.5,
                        color=CMYK_TEXT_MID, max_w_figma=350, leading_figma=12)
        thin_rule(c, fx=30, fy=y + 46, w_figma=390, color=CMYK_TEXT_FAINT, weight_pt=0.3)
        y += 52


def page_quiet_mark(c):
    fill_bleed(c, HUBSS_WHITE)
    if LOGO_COLOR.exists():
        size_figma = 80
        cx = (450 - size_figma) / 2
        cy = (450 - size_figma) / 2 - 40
        px = BLEED + cx * SCALE
        py = BLEED + TRIM_H - (cy + size_figma) * SCALE
        draw_image_box(c, str(LOGO_COLOR), px, py,
                       size_figma * SCALE, size_figma * SCALE,
                       cover=False, convert_to_cmyk=False)
    tracked_caps(c, "HUB Surface Systems", fx=25, fy=270, size=7.5,
                 color=CMYK_TEXT_DARK, align="center", max_w_figma=400)
    tracked_caps(c, "Established 1994   .   Coast to Coast", fx=25, fy=290, size=6.0,
                 color=CMYK_TEXT_FAINT, align="center", max_w_figma=400)
    rx, ry = figma_to_pdf((450 - 30) / 2, 320)
    c.setFillColor(HUBSS_ORANGE)
    c.rect(rx, ry, 30 * SCALE, 1.2, stroke=0, fill=1)
    draw_text_block(c, "Thank you.", fx=25, fy=350, font_size_figma=14,
                    color=CMYK_TEXT_MID, align="center", max_w_figma=400,
                    figma_font="serif")


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = Canvas(str(OUT), pagesize=PAGE_SIZE)
    c.setTitle("HUB Surface Systems - Catalogue 2026")
    c.setAuthor("HUB Surface Systems")
    c.setSubject("Decorative Pavement Solutions Catalogue")

    # Print metadata — sticky, applies to every subsequent showPage().
    # MediaBox is set automatically from pagesize (full 5.25" × 5.25").
    # TrimBox marks the 5" × 5" final cut. BleedBox = MediaBox (bleed
    # extends to page edge). CropBox = MediaBox so press RIPs preserve
    # the crop marks drawn in the bleed area.
    c.setTrimBox((BLEED, BLEED, BLEED + TRIM_W, BLEED + TRIM_H))
    c.setBleedBox((0, 0, PAGE_W, PAGE_H))
    c.setCropBox((0, 0, PAGE_W, PAGE_H))

    pages = []
    pages.append(lambda: page_cover(c))
    pages.append(lambda: page_half_title(c))
    pages.append(lambda: page_manifesto(c))
    pages.append(lambda: page_why_stats(c))
    pages.append(lambda: page_why_proof(c))
    pages.append(lambda: None)  # TOC slot

    products_page = len(pages) + 1
    pages.append(lambda: page_section_open(c, "One", "Products.", CC.SECTION_OPENERS["products"]))
    for prod in CC.PRODUCTS:
        p = prod
        pages.append(lambda p=p: page_product_hero(c, p))
        pages.append(lambda p=p: page_product_spec(c, p))

    apps_page = len(pages) + 1
    pages.append(lambda: page_section_open(c, "Two", "Applications.", CC.SECTION_OPENERS["applications"]))
    n_apps = len(CC.APPLICATIONS)
    for idx, app in enumerate(CC.APPLICATIONS, 1):
        a = app; i = idx
        pages.append(lambda a=a, i=i: page_application(c, a, i, n_apps))

    projects_page = len(pages) + 1
    pages.append(lambda: page_section_open(c, "Three", "Projects.", CC.SECTION_OPENERS["projects"]))
    for idx, proj in enumerate(CC.PROJECTS, 1):
        p = proj; i = idx
        pages.append(lambda p=p: page_project_hero(c, p))
        pages.append(lambda p=p, i=i: page_project_story(c, p, i))

    network_page = len(pages) + 1
    pages.append(lambda: page_section_open(c, "Four", "Network.", CC.SECTION_OPENERS["network"]))
    for inst in CC.INSTALLERS:
        i = inst
        pages.append(lambda i=i: page_installer(c, i))

    reference_page = len(pages) + 1
    pages.append(lambda: page_section_open(c, "Five", "Reference.", CC.SECTION_OPENERS["reference"]))
    pages.append(lambda: page_technical_reference(c))
    pages.append(lambda: page_cities(c))
    lunch_page = len(pages) + 1
    pages.append(lambda: page_lunch_learn(c))
    pages.append(lambda: page_contact(c))

    # Pad-then-close: blank spacers come BEFORE the closing trio so the
    # book ends on the meaningful Thank-You quiet mark, not on filler.
    def page_blank_spacer(c):
        fill_bleed(c, HUBSS_WHITE)

    # Number of pages we will still add: 3 closing + 1 back = 4
    # Total must be multiple of 4. Pad here.
    while (len(pages) + 4) % 4 != 0:  # +4 = closing trio + back cover
        pages.append(lambda: page_blank_spacer(c))

    pages.append(lambda: page_closing_manifesto(c))
    pages.append(lambda: page_service_promise(c))
    pages.append(lambda: page_quiet_mark(c))
    pages.append(lambda: page_back(c))

    toc_entries = [
        ("Manifesto", 3),
        ("Why HUB", 4),
        ("Products", products_page),
        ("Applications", apps_page),
        ("Projects", projects_page),
        ("Certified Network", network_page),
        ("Reference", reference_page),
        ("Lunch and Learn", lunch_page),
    ]
    pages[5] = lambda: page_toc(c, toc_entries)

    cover_page = 1
    back_page = len(pages)
    section_openers = {products_page, apps_page, projects_page,
                       network_page, reference_page}
    dark_hero_pages = set()
    for i in range(len(CC.PRODUCTS)):
        dark_hero_pages.add(products_page + 1 + 2 * i)
    for i in range(len(CC.PROJECTS)):
        dark_hero_pages.add(projects_page + 1 + 2 * i)

    for idx, fn in enumerate(pages, 1):
        try:
            fn()
        except Exception as e:
            print("page error:", e)
        # Folios removed per Vernon — no page numbers in this edition.
        try:
            PM.add_page_marks(c, show_guides=False)
        except Exception:
            pass
        c.showPage()

    c.save()

    size_mb = OUT.stat().st_size / (1024 * 1024)
    print(f"wrote {OUT.name}  ({len(pages)} pp, {size_mb:.1f} MB)")


if __name__ == "__main__":
    build()