"""HUB Surface Systems - Catalogue 2026 final build."""
from __future__ import annotations
from pathlib import Path
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import CMYKColor
from reportlab.pdfbase.pdfmetrics import stringWidth

from .specs import (
    PAGE_SIZE, PAGE_W, PAGE_H, BLEED, TRIM_W, TRIM_H,
    HUBSS_ORANGE, HUBSS_NAVY_RICH, HUBSS_WHITE,
    FONT_SANS_BOLD, FONT_SANS_OBL,
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

OUT = ROOT / "output" / "HUBSS_Catalogue_2026_v50.pdf"


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


def _make_scrim_png(height_px=400, width_px=8, max_alpha=230, ease=2.2,
                    rgb=(0, 0, 0)):
    """Render a colour-to-transparent gradient PNG (cached).

    v42: parameterised on `rgb` so the same generator produces both the
    legacy black scrim and the navy-tinted scrim Vernon asked for. Cache
    key includes rgb to avoid collisions between tints.

    Vernon's v33/v34 calibration (when rgb=(0,0,0)): max_alpha 180→230 +
    ease 1.6→2.2 keeps the bottom truly opaque and pushes opacity toward
    the bottom so the upper photo stays readable."""
    from PIL import Image
    key = (height_px, width_px, max_alpha, ease, rgb)
    if key in _SCRIM_CACHE:
        return _SCRIM_CACHE[key]
    R, G, B = rgb
    img = Image.new("RGBA", (width_px, height_px), (R, G, B, 0))
    px = img.load()
    for y in range(height_px):
        # y=0 is top of image (transparent), y=height_px-1 is bottom (most opaque)
        progress = y / max(1, (height_px - 1))   # 0..1, 1 at bottom
        a = int(max_alpha * (progress ** ease))
        for x in range(width_px):
            px[x, y] = (R, G, B, a)
    out = ROOT / "output" / "_cache" / f"scrim_{R}_{G}_{B}_{height_px}_{max_alpha}.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out)
    _SCRIM_CACHE[key] = out
    return out


# v42 navy-tint constants — matches the website hero (rgba 8,13,22) so the
# catalogue and the web feel cohesive. Lower SOLID_ALPHA than the legacy
# black band (0.82 vs 0.88) because navy is intrinsically less harsh —
# white type still reads bulletproof, but the photo's colour breathes
# through as TINT rather than a stage-lighting blackout.
NAVY_SCRIM_RGB = (8, 13, 22)
NAVY_SCRIM_ALPHA = 0.82


def hero_scrim(c, height_figma=160, *, text_zone_figma=130, tint="navy"):
    """Bulletproof two-layer scrim — v42 navy default.

    History:
      • Vernon v39 (third flag on contrast) introduced the 88%-black
        solid band so white type stays bulletproof on bright photos
        (StreetBond rainbow, DuraTherm gold, etc.).
      • Vernon v42: 'these dark overlays are too harsh, stage-lighting.
        Use the navy wash instead.' So the band stays — same structure,
        same readability guarantee — but it's now navy-tinted, not black.

    Structure (unchanged from v39):
      1. Solid band covering the bottom `text_zone_figma` units. Type on
         this zone is bulletproof regardless of what's behind it.
      2. Soft gradient fade above the solid band, meeting its alpha at
         the bottom so there's no visible seam.

    `tint='navy'` (default) — the new house style. RGB (8,13,22) at 82%.
    `tint='black'` — kept for backward compatibility / fallback. 88% black.
    """
    if tint == "navy":
        rgb = NAVY_SCRIM_RGB
        solid_alpha = NAVY_SCRIM_ALPHA
    else:
        rgb = (0, 0, 0)
        solid_alpha = 0.88

    # --- Layer 1: solid colour band where the text lives --------------
    solid_h_pdf = text_zone_figma * SCALE
    c.saveState()
    c.setFillColorRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255)
    c.setFillAlpha(solid_alpha)
    c.rect(0, 0, PAGE_W, solid_h_pdf, stroke=0, fill=1)
    c.setFillAlpha(1.0)
    c.restoreState()

    # --- Layer 2: soft fade above, transparent->solid ------------------
    # The fade ends where the solid band starts so there's no visible seam.
    fade_h_figma = max(0, height_figma - text_zone_figma)
    if fade_h_figma > 0:
        # max_alpha matched to the solid band so the fade meets it cleanly.
        fade_png = _make_scrim_png(
            height_px=400, max_alpha=int(255 * solid_alpha), ease=1.5,
            rgb=rgb,
        )
        fade_h_pdf = fade_h_figma * SCALE
        c.drawImage(str(fade_png), 0, solid_h_pdf,
                    width=PAGE_W, height=fade_h_pdf,
                    preserveAspectRatio=False, mask='auto')


def cover_wash(c, *, height_figma=140, max_alpha_pct=0.62, ease=1.7):
    """v42 navy-gradient cover treatment — RETIRED v43.

    Retained so older callers don't break, but page_cover now uses
    white_footer_band instead (Vernon: 'the gradients are not working
    too well, let's go back to a white bottom banner').
    """
    png = _make_scrim_png(
        height_px=400, max_alpha=int(255 * max_alpha_pct), ease=ease,
        rgb=NAVY_SCRIM_RGB,
    )
    h_pdf = height_figma * SCALE
    c.drawImage(str(png), 0, 0, width=PAGE_W, height=h_pdf,
                preserveAspectRatio=False, mask='auto')


def white_footer_band(c, *, height_figma=150, rule_w_figma=44,
                      band_color=None):
    """v43 white footer banner — the new house treatment.

    Vernon: 'go back to a white bottom banner, the gradients are not
    working.' Solid white (cream) rectangle covering the bottom
    `height_figma` units of the page + bleed area, with a slim orange
    accent rule across the top edge for brand pickup.

    Photo lives above the band; band carries product text in dark ink.
    No overlay on the photo — photo breathes, band anchors.

    Use band_color=CMYK_CREAM for the warm-paper feel that reads
    premium-magazine; default HUBSS_WHITE for a stark editorial white.
    """
    if band_color is None:
        band_color = CMYK_CREAM
    band_h_pdf = height_figma * SCALE
    c.setFillColor(band_color)
    # +BLEED so the band runs cleanly into the bottom bleed area.
    c.rect(0, 0, PAGE_W, band_h_pdf + BLEED, stroke=0, fill=1)
    # Slim orange accent rule at the top edge of the band — one brand
    # touch that anchors the band to the photo above.
    rule_fy = 450 - height_figma + 4  # 4 figma units below band top
    thin_rule(c, fx=28, fy=rule_fy, w_figma=rule_w_figma,
              color=HUBSS_ORANGE, weight_pt=2.0)


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
    """Cover — full-bleed photo + restrained masthead + subtle bottom vignette.

    v44 — pro look. No banner. No full-frame wash. No cream anywhere.
    Vernon: 'no cream banner, no cream nothing. Let's go for a pro look.'

    Layout (magazine cover discipline):
      - Color logo top-LEFT at restrained scale (110 figma wide).
      - Bottom: 'CATALOGUE 2026.' display + 'Decorative Pavement Solutions'
        small caps. White type sits on a SOFT navy vignette that fades up
        from the very bottom — never reaches solid coverage. The photo
        dominates; the type is editorial punctuation.
    """
    fill_bleed(c, HUBSS_WHITE)
    if CC.COVER_PHOTO and CC.COVER_PHOTO.exists():
        draw_full_bleed_image(c, str(CC.COVER_PHOTO))
    # v46 — Vernon's creative-director pass: navy wash KEPT on cover
    # (debating but keep for now), removed everywhere else. Subtle 50%
    # full-frame wash — quietens the busy Musqueam medallion behind the
    # type but lets the UBC sculpture still read clearly.
    c.saveState()
    c.setFillColorRGB(8 / 255, 13 / 255, 22 / 255)  # HUBSS navy
    c.setFillAlpha(0.50)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillAlpha(1.0)
    c.restoreState()
    # White-text HUBSS logo top-left (Vernon's call).
    draw_logo_white(c, fx=28, fy=28, fw_figma=110)
    # Masthead bottom-left, confident.
    draw_text_block(c, "Catalogue 2026.", fx=28, fy=370,
                    font_size_figma=30, weight=800,
                    color=HUBSS_WHITE, tracking=-1.0, max_w_figma=394)
    tracked_caps(c, "Decorative Pavement Solutions", fx=28, fy=410,
                 size=8.0, color=HUBSS_WHITE, max_w_figma=394)


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
    draw_text_block(c, no_orphan(m["body"], 3), fx=40, fy=y + 20,
                    font_size_figma=10,
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
    draw_text_block(c, no_orphan(w["subtitle"], 3), fx=40, fy=y + 4,
                    font_size_figma=11,
                    color=CMYK_TEXT_MID,
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
    tracked_caps(c, "Four Reasons", fx=40, fy=50, size=6.5, color=HUBSS_ORANGE)
    # v29: display reduced 24 → 19 (was oversized on 5x5 trim).
    draw_text_block(c, "If it goes on the street,",
                    fx=40, fy=74, font_size_figma=19, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-0.6)
    draw_text_block(c, "it stays on the street.",
                    fx=40, fy=100, font_size_figma=19, weight=800,
                    color=HUBSS_ORANGE, tracking=-0.6)
    y = 160
    for num, claim, detail in w["proof"]:
        tracked_caps(c, num, fx=40, fy=y, size=6.0, color=HUBSS_ORANGE,
                     max_w_figma=30)
        draw_text_block(c, claim, fx=80, fy=y, font_size_figma=11,
                        weight=800, color=CMYK_TEXT_DARK, tracking=-0.3,
                        max_w_figma=340)
        draw_text_block(c, detail, fx=80, fy=y + 16, font_size_figma=8.0,
                        color=CMYK_TEXT_MID, max_w_figma=340, leading_figma=11)
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
    """Section divider — v44 pro: typography-led editorial moment.

    Full-bleed photo + soft navy vignette at the bottom (legibility only,
    never reads as a band) + huge confident display title in white.
    Lots of whitespace above the type. The photo + the type carry the
    page — no band, no harsh scrim.
    """
    fill_bleed(c, HUBSS_WHITE)
    if photo_path and photo_path.exists():
        draw_full_bleed_image(c, str(photo_path))
    # v49 — Vernon: 'Section One page 10-11 could stand out more.'
    # Bigger type, bolder orange accent, wider tracking on the section
    # number. The photo carries the moment; type punches harder.
    # Orange dot pre-element + thin orange rule UNDER the section number
    # eyebrow + much larger display title.
    orange_dot(c, fx=24, fy=323, r_figma=1.8)
    tracked_caps(c, ("Section " + section_no).upper(), fx=34, fy=320,
                 size=8.5, color=HUBSS_WHITE, max_w_figma=394)
    thin_rule(c, fx=28, fy=338, w_figma=44,
              color=HUBSS_ORANGE, weight_pt=2.5)
    draw_text_block(c, title, fx=28, fy=358, font_size_figma=64,
                    weight=800, color=HUBSS_WHITE,
                    tracking=-2.0, max_w_figma=394, leading_figma=66)


def page_product_hero(c, prod):
    """Product hero — v44 pro: editorial flow, NO overlay band.

    Vernon: 'no cream, no cream nothing. Go for a pro look.'

    Layout:
      - Full-bleed photo top ~64% of page (fy=-12..fy=298).
      - White space below — page background carries it, no band.
      - Small orange dot + product name caps eyebrow.
      - Display italic SERIF tagline in dark ink — the editorial moment.
      - Thin orange brand-pickup rule near bottom.
    """
    fill_bleed(c, HUBSS_WHITE)
    if prod["hero"] and prod["hero"].exists():
        # Photo top ~64% — extend top/sides through bleed.
        draw_image_at_figma(c, str(prod["hero"]),
                            fx=-12, fy=-12, fw=474, fh=310)

    # Eyebrow zone — small orange dot + product name caps in orange.
    # Dot at fy=325, eyebrow at fy=322 — dot center co-aligns with cap-center.
    orange_dot(c, fx=28, fy=325, r_figma=1.3)
    tracked_caps(c, prod["name"], fx=34, fy=322, size=7.5,
                 color=HUBSS_ORANGE, max_w_figma=394)

    # Display italic SERIF tagline in dark ink — the editorial centerpiece.
    # Size-to-fit so it never wraps: start at 22pt, 14pt floor.
    tagline = no_orphan(prod["tagline"], last_n=3)
    safe_w_pt = 394 * SCALE
    tagline_size = 22
    while tagline_size > 14 and stringWidth(
        tagline, FONT_SANS_BOLD, tagline_size * SCALE
    ) > safe_w_pt:
        tagline_size -= 1
    tagline_leading = tagline_size + 4
    draw_text_block(c, tagline, fx=28, fy=350,
                    font_size_figma=tagline_size,
                    
                    color=CMYK_TEXT_DARK, tracking=-0.3,
                    max_w_figma=394, leading_figma=tagline_leading)

    # v48 — Vernon: drop the bottom decorative orange line; it gets in
    # the way. Page ends in clean white space.



def page_product_spec(c, prod):
    """v29 refinement — cleaner hierarchy: category eyebrow + name + dash +
    title + plain subhead + body + spec grid + uses. Dropped the redundant
    DECORATIVE PAVEMENT line and the orange callout-caps row that crowded
    the page in v28. Name reduced 34 → 22 with tighter kerning; orange dash
    aligned 6 px below the name baseline.
    """
    fill_bleed(c, HUBSS_WHITE)

    # Slim navy header band — top 18% of trim. Less ink, more breath than v28.
    BAND_H = 82  # figma units (was 118)
    band_pdf_y = BLEED + TRIM_H - BAND_H * SCALE
    c.setFillColor(HUBSS_NAVY_RICH)
    c.rect(0, band_pdf_y, PAGE_W, BAND_H * SCALE + BLEED, stroke=0, fill=1)

    # Category eyebrow — drives the hierarchy from the top. Uses the
    # product's category (e.g. "Heavy-Duty Preformed Thermoplastic") so the
    # eyebrow says what the product IS, not who made it. Falls back to the
    # HUB attribution for any product that hasn't been categorised yet.
    eyebrow = prod.get("category") or prod.get("manufacturer") or "HUB Surface Systems"
    tracked_caps(c, eyebrow, fx=28, fy=18, size=5.5,
                 color=HUBSS_ORANGE, max_w_figma=394)

    # Product wordmark — reduced from 34 → 22 with tighter kerning. Sits in
    # its own clear zone; the orange dash below acts as the brand signature.
    draw_text_block(c, prod["name"], fx=28, fy=32, font_size_figma=22,
                    weight=800, color=HUBSS_WHITE, tracking=-1.0,
                    max_w_figma=394)

    # Orange signature dash — 6 px below name baseline (was 12 px)
    thin_rule(c, fx=28, fy=64, w_figma=32, color=HUBSS_ORANGE, weight_pt=2.0)

    # Cream body — title display, plain subhead, body. v29 drops the orange
    # callout-caps row (key facts now live in the body + spec grid).
    title = prod["title"]
    title_y = 108  # was 132 — room reclaimed from the slimmer band
    safe_w_pt = (394 - 4) * SCALE
    target_size = display_size_for(title)
    while target_size > 18 and stringWidth(title, FONT_SANS_BOLD,
                                            target_size * SCALE) > safe_w_pt:
        target_size -= 1
    draw_text_block(c, no_orphan(title, 2), fx=28, fy=title_y,
                    font_size_figma=target_size,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.9,
                    max_w_figma=394)

    y = title_y + int(target_size * 1.1) + 6

    # Plain subhead — widow-protected (last 3 words bound)
    draw_text_block(c, no_orphan(prod["italic"], 3), fx=28, fy=y,
                    font_size_figma=10.5,
                    color=CMYK_TEXT_MID,
                    max_w_figma=394, leading_figma=15)
    y += 32

    # Body — widow-protected (last 3 words bound)
    draw_text_block(c, no_orphan(prod["body"], 3), fx=28, fy=y,
                    font_size_figma=9.5,
                    color=CMYK_TEXT_DARK, max_w_figma=394, leading_figma=14)

    # Spec pairs grid — anchored at fy=312; uses joined caps at fy=395.
    sp = prod.get("spec_pairs") or []
    if sp:
        thin_rule(c, fx=28, fy=312, w_figma=394, color=CMYK_TEXT_FAINT,
                  weight_pt=0.3)
        cols_x = [28, 230]
        for i, (label, value) in enumerate(sp[:4]):
            row = i // 2
            col = i % 2
            x = cols_x[col]
            yy = 328 + row * 34
            tracked_caps(c, label, fx=x, fy=yy, size=6.0,
                         color=CMYK_TEXT_FAINT, max_w_figma=190)
            draw_text_block(c, value, fx=x, fy=yy + 11,
                            font_size_figma=8.5, weight=600,
                            color=CMYK_TEXT_DARK, max_w_figma=185,
                            leading_figma=11)

    uses = prod.get("uses") or []
    if uses:
        joined = "   ·   ".join(uses)
        thin_rule(c, fx=28, fy=405, w_figma=394, color=CMYK_TEXT_FAINT,
                  weight_pt=0.3)
        tracked_caps(c, joined, fx=25, fy=414, size=6.5,
                     color=CMYK_TEXT_MID, align="center", max_w_figma=400)


def page_application(c, app, idx, total):
    """DDB pass: full photo (top 60%) + navy band (bottom 40%) — matches
    product-hero / project-hero editorial weight throughout the book.
    """
    fill_bleed(c, HUBSS_WHITE)
    # v46 — Vernon's creative-director pass: NO navy band on body pages.
    # Natural-color photo top ~63%, then dark editorial type on white
    # space below. Same DDB-grade flow as product/project heros.
    if app["image"] and app["image"].exists():
        draw_image_at_figma(c, str(app["image"]),
                            fx=-12, fy=-12, fw=474, fh=296)

    # Small orange eyebrow with dot — application name in caps
    orange_dot(c, fx=28, fy=325, r_figma=1.3)
    tracked_caps(c, app["name"], fx=34, fy=322, size=7.5,
                 color=HUBSS_ORANGE, max_w_figma=394)
    # Display tagline — confident, dark ink
    name_size = min(display_size_for(app["name"]), 18)
    draw_text_block(c, no_orphan(app["tagline"], 3),
                    fx=28, fy=350, font_size_figma=18,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.4,
                    max_w_figma=394, leading_figma=22)
    # Body — dark mid-grey, comfortable leading
    draw_text_block(c, no_orphan(app["body"], 3), fx=28, fy=388,
                    font_size_figma=8.5, color=CMYK_TEXT_MID,
                    max_w_figma=394, leading_figma=12)
    # v48 — Vernon: drop the decorative orange line; URL keeps it clean.
    tracked_caps(c, "hubss.com", fx=28, fy=435, size=5.5,
                 color=HUBSS_ORANGE, align="right", max_w_figma=394)


def page_project_hero(c, proj):
    """Project hero — v44 pro: editorial flow mirroring product hero."""
    fill_bleed(c, HUBSS_WHITE)
    if proj["hero"] and proj["hero"].exists():
        draw_image_at_figma(c, str(proj["hero"]),
                            fx=-12, fy=-12, fw=474, fh=310)
    # Eyebrow: project name in orange caps with small dot.
    orange_dot(c, fx=28, fy=325, r_figma=1.3)
    tracked_caps(c, proj["name"], fx=34, fy=322, size=7.5,
                 color=HUBSS_ORANGE, max_w_figma=394)
    # Display italic serif title in dark ink — editorial centerpiece.
    draw_text_block(c, no_orphan(proj["title"], 3), fx=28, fy=350,
                    font_size_figma=20,
                    color=CMYK_TEXT_DARK, tracking=-0.3,
                    max_w_figma=394, leading_figma=24)
    # v48 — Vernon: orange decorative line dropped. Location/product
    # caps anchor the page bottom.
    tracked_caps(c, proj["location"], fx=28, fy=414, size=6.0,
                 color=CMYK_TEXT_MID, max_w_figma=190)
    tracked_caps(c, proj["product"], fx=232, fy=414, size=6.0,
                 color=HUBSS_ORANGE, align="right", max_w_figma=190)


def page_project_story(c, proj, idx):
    """v46 — DDB pass: natural-color photo + editorial type below.
    No navy band, no overlays. Same flow as project hero + application."""
    fill_bleed(c, HUBSS_WHITE)
    if proj.get("detail") and proj["detail"].exists():
        draw_image_at_figma(c, str(proj["detail"]),
                            fx=-12, fy=-12, fw=474, fh=296)

    # Eyebrow = product name (uppercase) — orange caps with dot
    eyebrow_label = (proj.get("product") or "").upper() \
        or ("PROJECT " + str(idx).zfill(2))
    orange_dot(c, fx=28, fy=325, r_figma=1.3)
    tracked_caps(c, eyebrow_label, fx=34, fy=322, size=7.0,
                 color=HUBSS_ORANGE, max_w_figma=394)
    # H2 = project name — dark display
    draw_text_block(c, no_orphan(proj.get("name") or "", 3), fx=28, fy=348,
                    font_size_figma=17, weight=800, color=CMYK_TEXT_DARK,
                    tracking=-0.5, max_w_figma=394, leading_figma=20)
    # Location · product line in faint caps
    sub = ((proj.get("location") or "") + "    " + (proj.get("product") or "")).upper()
    tracked_caps(c, sub, fx=28, fy=376, size=5.5,
                 color=CMYK_TEXT_FAINT, max_w_figma=394)
    # Story body — comfortable mid-grey
    draw_text_block(c, no_orphan(proj.get("story") or "", 3), fx=28, fy=394,
                    font_size_figma=8.0, color=CMYK_TEXT_MID,
                    max_w_figma=394, leading_figma=11)


def page_installer(c, inst):
    fill_bleed(c, HUBSS_WHITE)
    tracked_caps(c, "HUB Certified Installer", fx=30, fy=30, size=6.5,
                 color=HUBSS_ORANGE)
    # v29: brand logo zone — render the actual installer logo if present,
    # otherwise a tidy placeholder (Vernon will drop the PNG into
    # assets/installer-logos/ later).
    logo_fx, logo_fy, logo_fw, logo_fh = 320, 26, 100, 28
    logo_path = inst.get("logo")
    if logo_path and Path(logo_path).exists():
        try:
            from PIL import Image as _PIL
            with _PIL.open(logo_path) as _im:
                iw, ih = _im.size
            asp = ih / iw
            box_asp = logo_fh / logo_fw
            if asp <= box_asp:
                fw_d = logo_fw; fh_d = logo_fw * asp
                fx_d = logo_fx; fy_d = logo_fy + (logo_fh - fh_d) / 2
            else:
                fh_d = logo_fh; fw_d = logo_fh / asp
                fy_d = logo_fy; fx_d = logo_fx + (logo_fw - fw_d)  # right-align
            px = BLEED + fx_d * SCALE
            py = BLEED + TRIM_H - (fy_d + fh_d) * SCALE
            draw_image_box(c, str(logo_path), px, py,
                           fw_d * SCALE, fh_d * SCALE,
                           cover=False, convert_to_cmyk=False)
        except Exception:
            pass
    else:
        # Placeholder box + label
        pp_x, pp_y = figma_to_pdf(logo_fx, logo_fy + logo_fh)
        c.setFillColor(CMYK_TEXT_FAINT)
        c.saveState()
        c.setFillAlpha(0.15)
        c.rect(pp_x, pp_y, logo_fw * SCALE, logo_fh * SCALE,
               stroke=0, fill=1)
        c.restoreState()
        tracked_caps(c, "[Logo]", fx=logo_fx, fy=logo_fy + logo_fh / 2 - 4,
                     size=5.5, color=CMYK_TEXT_FAINT,
                     align="center", max_w_figma=logo_fw)
    if inst["image"] and inst["image"].exists():
        draw_image_at_figma(c, str(inst["image"]), fx=30, fy=72, fw=390, fh=170)
    tracked_caps(c, inst["region"], fx=30, fy=258, size=6.5,
                 color=CMYK_TEXT_FAINT, max_w_figma=380)
    draw_text_block(c, inst["name"], fx=30, fy=270,
                    font_size_figma=28,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.5,
                    max_w_figma=380, leading_figma=32)
    draw_text_block(c, no_orphan(inst["body"], 3), fx=30, fy=325,
                    font_size_figma=9.5,
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
    # Product reference — kept in sync with CC.PRODUCTS (11 products).
    # Aquaphalt removed (per Vernon — product discontinued). FastPatch removed
    # (not in PRODUCTS line). DuraShield re-labelled "Coating" (Doug correction —
    # coating, not penetrating). TrafficPatterns corrected to 125 mil per spec.
    products = [
        ("TrafficPatternsXD", "150 mil",     "Heavy-duty thermoplastic"),
        ("TrafficPatterns",   "125 mil",     "Standard thermoplastic"),
        ("StreetBond",        "Acrylic",     "Coloured pavement coating"),
        ("StreetBondSR",      "Solar Refl.", "LEED contributing surface"),
        ("StreetPrint",       "Stamped",     "Genuine stamped asphalt"),
        ("DecoMark",          "Custom",      "Graphic thermoplastic"),
        ("DuraTherm",         "Inlaid",      "Snowplow-safe flush"),
        ("DuraShield",        "Coating",     "Two-component asphalt maintenance"),
        ("PreMark",           "Pre-cut",     "Regulatory pavement markings"),
        ("MMAX",              "MMA Resin",   "Coloured lane treatment"),
        ("AirMark",           "Airfield",    "Non-runway preformed thermoplastic"),
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
    """Trusted, by name. "500+" as 60px orange hero stat at the top — visual
    anchor that gives the city list credibility and scale. Tightened city
    list (8px / 13px spacing) below."""
    fill_bleed(c, HUBSS_WHITE)
    # "500+" hero stat
    draw_text_block(c, "500+", fx=30, fy=28, font_size_figma=60,
                    weight=800, color=HUBSS_ORANGE, tracking=-1.2,
                    max_w_figma=390)
    draw_text_block(c, "Canadian municipalities", fx=30, fy=98,
                    font_size_figma=9, color=CMYK_TEXT_DARK,
                    max_w_figma=280, leading_figma=13)
    draw_text_block(c, "that specify HUB systems by name.", fx=30, fy=113,
                    font_size_figma=9, color=CMYK_TEXT_MID,
                    max_w_figma=280, leading_figma=13)
    tracked_caps(c, "From Halifax to Vancouver", fx=30, fy=133, size=5.5,
                 color=CMYK_TEXT_FAINT, max_w_figma=390)
    thin_rule(c, fx=30, fy=150, w_figma=390, color=CMYK_TEXT_FAINT,
              weight_pt=0.3)
    draw_text_block(c, "A partial list", fx=30, fy=158, font_size_figma=7,
                    color=CMYK_TEXT_MID, align="right", max_w_figma=390,
                    )
    # City list — 2 columns, 8px type, 13px spacing
    cities = CC.CITIES
    y = 172
    for i in range(0, len(cities), 2):
        if y > 418:
            break
        draw_text_block(c, cities[i], fx=30, fy=y, font_size_figma=8,
                        color=CMYK_TEXT_DARK, max_w_figma=185)
        if i + 1 < len(cities):
            draw_text_block(c, cities[i + 1], fx=235, fy=y,
                            font_size_figma=8, color=CMYK_TEXT_DARK,
                            max_w_figma=175)
        y += 13


def page_lunch_learn(c):
    """Moose-anchored Lunch & Learn. Warm + editorial, not corporate.
    Left column: headline + 7-item what's-included list. Right column: Moose
    mascot at FIT scale (transparent PNG, no crop, no box). Full-width URL
    band below, then two-column contact footer.
    """
    fill_bleed(c, HUBSS_WHITE)

    # v45 — Vernon: 'messy, too much copy. Keep the dog.' Cut hard. One
    # left margin. Four type sizes max: eyebrow (6) / display (26) /
    # body+list (10) / URL display (18). Pro hierarchy.

    # v48 — Vernon: 'L&L 109 is lacking, make room for a QR code.'
    # New 3-zone layout:
    #   LEFT: eyebrow + display + body + 3 essentials
    #   RIGHT TOP: moose mascot (raised so QR can fit below it)
    #   RIGHT BOTTOM: 1" QR code on white plate + 'Scan to book' caption
    #   FOOTER: full-width URL + two contacts

    LEFT_X = 28
    LEFT_W = 215

    # Moose — right column upper, raised so it leaves clean room for QR
    mascot = ROOT / "assets" / "moose-mascot.png"
    if mascot.exists():
        from PIL import Image as _PIL
        try:
            with _PIL.open(mascot) as _im:
                iw, ih = _im.size
            box_w, box_h = 170.0, 220.0  # slightly smaller box, raised
            aspect = ih / iw
            if box_w * aspect <= box_h:
                fw_drawn = box_w
                fh_drawn = box_w * aspect
                fx_drawn = 257
                fy_drawn = 30 + (box_h - fh_drawn) / 2
            else:
                fh_drawn = box_h
                fw_drawn = box_h / aspect
                fy_drawn = 30
                fx_drawn = 257 + (box_w - fw_drawn) / 2
            px = BLEED + fx_drawn * SCALE
            py = BLEED + TRIM_H - (fy_drawn + fh_drawn) * SCALE
            draw_image_box(c, str(mascot), px, py,
                           fw_drawn * SCALE, fh_drawn * SCALE,
                           cover=False, convert_to_cmyk=False)
        except Exception:
            pass

    # 1) Orange eyebrow caps (no decorative rule above per v48 cleanup)
    tracked_caps(c, "Lunch & Learn", fx=LEFT_X, fy=46, size=6.0,
                 color=HUBSS_ORANGE, max_w_figma=LEFT_W)

    # 2) Display headline — two lines, second line orange
    draw_text_block(c, "Lunch is on us.", fx=LEFT_X, fy=68,
                    font_size_figma=26, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-0.8,
                    max_w_figma=LEFT_W, leading_figma=30)
    draw_text_block(c, "Your spec is free.", fx=LEFT_X, fy=100,
                    font_size_figma=26, weight=800, color=HUBSS_ORANGE,
                    tracking=-0.8, max_w_figma=LEFT_W, leading_figma=30)

    # 3) Body — one tight sentence
    draw_text_block(c,
        "Forty-five minutes of technical depth, real-world projects, "
        "and CE-credit education — over lunch in your office.",
        fx=LEFT_X, fy=158, font_size_figma=10,
        color=CMYK_TEXT_DARK, max_w_figma=LEFT_W, leading_figma=15)

    # 4) Three dot-led essentials
    items = [
        "Tailored to your project",
        "CE credits — AIBC, RAIC, PEO",
        "In person across Canada, or virtual",
    ]
    dy = 232
    for item in items:
        orange_dot(c, fx=LEFT_X + 1, fy=dy + 4, r_figma=1.0)
        draw_text_block(c, item, fx=LEFT_X + 10, fy=dy,
                        font_size_figma=10, color=CMYK_TEXT_DARK,
                        max_w_figma=LEFT_W - 10, leading_figma=14)
        dy += 20

    # 5) QR code — right column lower. 70 figma square (~1" at 5" trim).
    #    White plate around it for quiet-zone protection so scanners read.
    qr_path = ROOT / "assets" / "hubss-lunch-learn-qr.png"
    if qr_path.exists():
        QR_SIZE = 70
        QR_PAD = 6
        QR_FX = 287
        QR_FY = 252
        # White plate
        plate_x, plate_y = figma_to_pdf(QR_FX - QR_PAD, QR_FY - QR_PAD)
        c.setFillColorRGB(1, 1, 1)
        c.rect(plate_x, plate_y - (QR_SIZE + 2 * QR_PAD) * SCALE,
               (QR_SIZE + 2 * QR_PAD) * SCALE,
               (QR_SIZE + 2 * QR_PAD) * SCALE,
               stroke=0, fill=1)
        # QR
        qr_px = BLEED + QR_FX * SCALE
        qr_py = BLEED + TRIM_H - (QR_FY + QR_SIZE) * SCALE
        draw_image_box(c, str(qr_path), qr_px, qr_py,
                       QR_SIZE * SCALE, QR_SIZE * SCALE,
                       cover=False, convert_to_cmyk=False)
        # Caption above QR
        tracked_caps(c, "Scan to book", fx=QR_FX - QR_PAD,
                     fy=QR_FY - 12, size=5.5,
                     color=CMYK_TEXT_MID, max_w_figma=QR_SIZE + 2 * QR_PAD)

    # FOOTER — single orange rule + URL + 2 contacts
    thin_rule(c, fx=LEFT_X, fy=350, w_figma=215,
              color=HUBSS_ORANGE, weight_pt=1.5)
    draw_text_block(c, "hubss.com/lunch-learn", fx=LEFT_X, fy=364,
                    font_size_figma=18, weight=800, color=HUBSS_ORANGE,
                    tracking=-0.5, max_w_figma=215)
    # Two contacts inline, single baseline at bottom
    draw_text_block(c, "Cleve Stordy   604.309.8212",
                    fx=LEFT_X, fy=406, font_size_figma=9, weight=600,
                    color=CMYK_TEXT_DARK, max_w_figma=200)
    draw_text_block(c, "Doug Bain   416.540.9287",
                    fx=LEFT_X + 200, fy=406, font_size_figma=9, weight=600,
                    color=CMYK_TEXT_DARK, max_w_figma=200)


def page_contact(c):
    """Contact page with navy header band — visual weight without breaking
    the clean editorial layout."""
    fill_bleed(c, HUBSS_WHITE)

    # Navy header band — 82px tall, extends into bleed at top
    BAND_H = 82
    band_pdf_y = BLEED + TRIM_H - BAND_H * SCALE
    c.setFillColor(HUBSS_NAVY_RICH)
    c.rect(0, band_pdf_y, PAGE_W, BAND_H * SCALE + BLEED, stroke=0, fill=1)

    tracked_caps(c, "Two Offices. One Network.", fx=30, fy=14, size=5.5,
                 color=HUBSS_ORANGE, max_w_figma=390)
    thin_rule(c, fx=30, fy=30, w_figma=24, color=HUBSS_ORANGE, weight_pt=2.0)
    draw_text_block(c, "Speak with HUB.", fx=30, fy=44, font_size_figma=22,
                    weight=800, color=HUBSS_WHITE, tracking=-0.6,
                    max_w_figma=390)

    # Content zone below navy band
    draw_text_block(c, "Every project starts with a conversation.",
                    fx=30, fy=96, font_size_figma=10, color=CMYK_TEXT_MID,
                    max_w_figma=390, leading_figma=15)
    thin_rule(c, fx=30, fy=128, w_figma=390, color=CMYK_TEXT_FAINT,
              weight_pt=0.4)

    # West
    tracked_caps(c, "Western Canada", fx=30, fy=144, size=5.5,
                 color=HUBSS_ORANGE, max_w_figma=188)
    draw_text_block(c, "Cleve Stordy", fx=30, fy=158, font_size_figma=20,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.4,
                    max_w_figma=188)
    draw_text_block(c, "cleve.stordy@hubss.com", fx=30, fy=194,
                    font_size_figma=8.5, color=CMYK_TEXT_DARK,
                    max_w_figma=188)
    draw_text_block(c, "604.309.8212", fx=30, fy=212,
                    font_size_figma=8.5, color=CMYK_TEXT_MID,
                    max_w_figma=188)
    draw_text_block(c, "Ladysmith, British Columbia", fx=30, fy=230,
                    font_size_figma=7, color=CMYK_TEXT_MID,
                    max_w_figma=188)

    # East
    tracked_caps(c, "Eastern Canada", fx=242, fy=144, size=5.5,
                 color=HUBSS_ORANGE, max_w_figma=178)
    draw_text_block(c, "Doug Bain", fx=242, fy=158, font_size_figma=20,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.4,
                    max_w_figma=178)
    draw_text_block(c, "doug.bain@hubss.com", fx=242, fy=194,
                    font_size_figma=8.5, color=CMYK_TEXT_DARK,
                    max_w_figma=178)
    draw_text_block(c, "416.540.9287", fx=242, fy=212,
                    font_size_figma=8.5, color=CMYK_TEXT_MID,
                    max_w_figma=178)
    draw_text_block(c, "Milton, Ontario", fx=242, fy=230, font_size_figma=7,
                    color=CMYK_TEXT_MID, max_w_figma=178)

    thin_rule(c, fx=30, fy=258, w_figma=390, color=CMYK_TEXT_FAINT,
              weight_pt=0.4)

    # URL — single bold destination
    draw_text_block(c, "hubss.com", fx=30, fy=272, font_size_figma=16,
                    weight=800, color=HUBSS_ORANGE, tracking=-0.4,
                    max_w_figma=390)
    draw_text_block(c,
        "Spec sheets · project gallery · installer network · lunch + learn booking",
        fx=30, fy=304, font_size_figma=8, color=CMYK_TEXT_MID,
        max_w_figma=390, leading_figma=12)
    thin_rule(c, fx=30, fy=338, w_figma=390, color=CMYK_TEXT_FAINT,
              weight_pt=0.4)
    draw_text_block(c,
        "© 2026 HUB Surface Systems   ·   Established 1994   ·   Coast to Coast",
        fx=30, fy=350, font_size_figma=5.5, color=CMYK_TEXT_FAINT,
        align="center", max_w_figma=390, tracking=1.4)


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
    """Back cover — v30 redesign per Vernon:
       1. HUBSS wordmark CENTERED as the visual anchor (upper third)
       2. Tagline + URL stacked centred below it (mid)
       3. Placeholder QR centred in its own zone (lower-mid), captioned
          "Scan to view the virtual catalogue."
       4. Phones + copyright centred at the very bottom
       — full centred-stack hierarchy, generous breathing room around each
       element, navy-asphalt background unchanged.
    """
    fill_bleed(c, HUBSS_NAVY_RICH)
    asphalt = ROOT.parent / "public" / "images" / "applications" / "parking-lots" / "parking-lots-01.jpg"
    if asphalt.exists():
        draw_full_bleed_image(c, str(asphalt))
    # Smooth navy wash from PIL — replaces the 60-band approach that produced
    # visible horizontal stripes in the previous build.
    wash_png = _make_navy_wash_png(height_px=600, top_alpha=215, bottom_alpha=190)
    c.drawImage(str(wash_png), 0, 0, width=PAGE_W, height=PAGE_H,
                preserveAspectRatio=False, mask='auto')

    # --- TOP ANCHOR: HUBSS wordmark, centred at the visual top-third ---
    word_w = 240
    word_fx = (450 - word_w) / 2
    draw_logo_white(c, fx=word_fx, fy=120, fw_figma=word_w)

    # Tagline directly below wordmark
    draw_text_block(c, "Canada's Leading Decorative Pavement Solutions",
                    fx=25, fy=195, font_size_figma=8.5, color=HUBSS_WHITE,
                    align="center", max_w_figma=400)
    # Slim orange rule
    rule_w = 32
    rx, ry = figma_to_pdf((450 - rule_w) / 2, 215)
    c.setFillColor(HUBSS_ORANGE)
    c.rect(rx, ry, rule_w * SCALE, 1.2, stroke=0, fill=1)
    # URL
    draw_text_block(c, "hubss.com", fx=25, fy=228, font_size_figma=11,
                    weight=600, color=HUBSS_WHITE, align="center",
                    max_w_figma=400, tracking=1.4)

    # --- MIDDLE ZONE: placeholder QR + caption, centred ---
    tracked_caps(c, "Scan to view the virtual catalogue.",
                 fx=25, fy=278, size=6.0,
                 color=HUBSS_WHITE, align="center", max_w_figma=400)
    qr_path = ROOT / "assets" / "hubss-lunch-learn-qr.png"
    qr_size = 70
    qr_fx = (450 - qr_size) / 2
    qr_fy = 296
    panel_pad = 6
    # White panel under the QR — quiet-zone protection so scanners see it
    panel_x, panel_y = figma_to_pdf(qr_fx - panel_pad, qr_fy - panel_pad)
    c.setFillColorRGB(1, 1, 1)
    c.rect(panel_x, panel_y - (qr_size + 2 * panel_pad) * SCALE,
           (qr_size + 2 * panel_pad) * SCALE,
           (qr_size + 2 * panel_pad) * SCALE,
           stroke=0, fill=1)
    if qr_path.exists():
        draw_image_at_figma(c, str(qr_path),
                            fx=qr_fx, fy=qr_fy, fw=qr_size, fh=qr_size)
    else:
        # Fallback: light-grey placeholder with "[QR]" label
        c.setFillColorRGB(0.92, 0.92, 0.92)
        c.rect(panel_x, panel_y - qr_size * SCALE,
               qr_size * SCALE, qr_size * SCALE, stroke=0, fill=1)
        tracked_caps(c, "[QR]", fx=qr_fx, fy=qr_fy + qr_size / 2 - 4,
                     size=8, color=CMYK_TEXT_FAINT, align="center",
                     max_w_figma=qr_size)

    # --- BOTTOM ZONE: phones + copyright ---
    draw_text_block(c, "West / Prairies   604.309.8212",
                    fx=25, fy=400, font_size_figma=7.0,
                    color=CMYK_ON_DARK_BODY, align="center", max_w_figma=400)
    draw_text_block(c, "Central / Maritimes   416.540.9287",
                    fx=25, fy=414, font_size_figma=7.0,
                    color=CMYK_ON_DARK_BODY, align="center", max_w_figma=400)
    draw_text_block(c, "(c) 2026 HUB Surface Systems",
                    fx=25, fy=445, font_size_figma=6.5,
                    color=CMYK_ON_DARK_MID, align="center",
                    max_w_figma=400, tracking=1.0)


# ============================================================
# Closing pages — replace useless padding with meaningful content
# ============================================================
def page_closing_manifesto(c):
    """Closing — freshened editorial. Two-line display, orange accent rule,
    SPECIFIED / INSTALLED / BACKED trio, faint HUB SURFACE SYSTEMS footer.
    """
    fill_bleed(c, HUBSS_WHITE)
    tracked_caps(c, "A Final Word", fx=40, fy=70, size=7.5,
                 color=HUBSS_ORANGE, max_w_figma=370)
    draw_text_block(c, "The public realm.", fx=40, fy=130,
                    font_size_figma=42, weight=800, color=CMYK_TEXT_DARK,
                    tracking=-1.2, max_w_figma=370)
    draw_text_block(c, "Ours to build right.", fx=40, fy=178,
                    font_size_figma=42, weight=800, color=HUBSS_ORANGE,
                    tracking=-1.2, max_w_figma=370)
    # Orange accent rule between headline and body
    thin_rule(c, fx=40, fy=232, w_figma=48, color=HUBSS_ORANGE, weight_pt=2.0)
    draw_text_block(
        c,
        "Every surface we build is walked over, driven on, played at, "
        "and lived around. That is the standard we hold ourselves to. "
        "Spec the surface. Watch it work. Walk over it for twenty years.",
        fx=40, fy=252, font_size_figma=11, weight=400,
        color=CMYK_TEXT_DARK, max_w_figma=370, leading_figma=18,
        )
    # SPECIFIED / INSTALLED / BACKED — horizontal trio
    trio_y = 370
    tracked_caps(c, "Specified.", fx=40, fy=trio_y, size=8.0,
                 color=CMYK_TEXT_DARK, max_w_figma=130)
    tracked_caps(c, "Installed.", fx=165, fy=trio_y, size=8.0,
                 color=CMYK_TEXT_DARK, max_w_figma=130, align="center")
    tracked_caps(c, "Backed.", fx=295, fy=trio_y, size=8.0,
                 color=HUBSS_ORANGE, max_w_figma=130, align="right")
    thin_rule(c, fx=40, fy=393, w_figma=370, color=CMYK_TEXT_FAINT,
              weight_pt=0.3)
    tracked_caps(c, "HUB Surface Systems", fx=40, fy=410, size=5.5,
                 color=CMYK_TEXT_FAINT, max_w_figma=370, align="center")


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
                    )


# ============================================================
# NEW PAGES — ported from generate_plugin.py polish passes (May 20+)
# ============================================================

def page_hub_numbers(c):
    """Navy full-bleed bold-stats moment — sits after Why Proof.
    Same data as the Why Stats cells, recomposed at display scale on navy."""
    fill_bleed(c, HUBSS_NAVY_RICH)
    corner_accent(c, max_alpha=70, size_figma=260)
    tracked_caps(c, "By the Numbers", fx=30, fy=40, size=6.5,
                 color=HUBSS_ORANGE, max_w_figma=390)
    thin_rule(c, fx=30, fy=58, w_figma=32, color=HUBSS_ORANGE, weight_pt=2.0)

    stats = CC.WHY_HUB.get("stats", [])
    # v29: stat numbers reduced 52 → 40 (was oversized on 5x5 trim).
    cell_w = 195
    cell_h = 120
    start_y = 96
    for i, (num, label, sub) in enumerate(stats[:4]):
        row = i // 2
        col = i % 2
        gx = 30 + col * (cell_w + 8)
        gy = start_y + row * (cell_h + 18)
        # Stat numeral — orange display
        draw_text_block(c, num, fx=gx, fy=gy, font_size_figma=40,
                        weight=800, color=HUBSS_ORANGE, tracking=-1.4,
                        max_w_figma=cell_w)
        # Label — white caps
        tracked_caps(c, label, fx=gx, fy=gy + 64, size=7.0,
                     color=HUBSS_WHITE, max_w_figma=cell_w)
        # Sub-detail — softer white
        draw_text_block(c, sub, fx=gx, fy=gy + 82, font_size_figma=7.5,
                        color=CMYK_ON_DARK_BODY, max_w_figma=cell_w - 8,
                        leading_figma=11)

    # Footer line
    thin_rule(c, fx=30, fy=394, w_figma=390, color=CMYK_ON_DARK_RULE,
              weight_pt=0.4)
    tracked_caps(c, "Specified coast to coast since 1994",
                 fx=30, fy=410, size=5.5, color=CMYK_ON_DARK_BODY,
                 align="center", max_w_figma=390)


def page_statement(c):
    """Editorial pull-quote page on white — gives the book a breath moment
    between the proof-grid and the catalogue proper. White space carries
    the meaning; type is the only element."""
    fill_bleed(c, HUBSS_WHITE)
    tracked_caps(c, "Position", fx=30, fy=70, size=6.5,
                 color=HUBSS_ORANGE, max_w_figma=390)
    thin_rule(c, fx=30, fy=88, w_figma=24, color=HUBSS_ORANGE, weight_pt=2.0)

    draw_text_block(c, "Asphalt is the canvas.", fx=30, fy=160,
                    font_size_figma=28, weight=800, color=CMYK_TEXT_DARK,
                    tracking=-0.8, max_w_figma=390, leading_figma=34)
    draw_text_block(c, "The city is the gallery.", fx=30, fy=200,
                    font_size_figma=28, weight=800, color=HUBSS_ORANGE,
                    tracking=-0.8, max_w_figma=390, leading_figma=34)

    draw_text_block(c,
        "Every crosswalk we install is a small public artwork. "
        "Every BRT lane, a piece of civic identity. "
        "Every Indigenous medallion, a recognition that streets carry meaning "
        "long after the paint fades.",
        fx=30, fy=275, font_size_figma=11, color=CMYK_TEXT_MID,
         max_w_figma=350, leading_figma=18)

    thin_rule(c, fx=30, fy=400, w_figma=48, color=HUBSS_ORANGE, weight_pt=2.0)
    tracked_caps(c, "HUB Surface Systems   ·   Established 1994",
                 fx=30, fy=414, size=5.5, color=CMYK_TEXT_FAINT,
                 max_w_figma=390)


def page_doublespread_left(c, image_path):
    """Left half of an editorial DPS — full-bleed photo, no type."""
    fill_bleed(c, HUBSS_WHITE)
    if image_path and Path(image_path).exists():
        draw_full_bleed_image(c, str(image_path))


def page_doublespread_right(c, label, caption, *, right_style=None,
                            right_image_path=None, left_image_path=None):
    """Right half of an editorial DPS.

    right_style="navy" → closing-statement variant: navy fill, eyebrow +
        "Built to outlast." display + body lines + orange URL rule.

    Otherwise → photo right, with overlay eyebrow + caption in lower area.
    """
    if right_style == "navy":
        fill_bleed(c, HUBSS_NAVY_RICH)
        corner_accent(c, max_alpha=55, size_figma=260)
        thin_rule(c, fx=28, fy=80, w_figma=32, color=HUBSS_ORANGE,
                  weight_pt=2.0)
        tracked_caps(c, "Thirty years in the making.", fx=28, fy=96,
                     size=6.0, color=HUBSS_ORANGE, max_w_figma=394)
        draw_text_block(c, "Built to", fx=28, fy=116, font_size_figma=52,
                        weight=800, color=HUBSS_WHITE, tracking=-1.4,
                        max_w_figma=394)
        draw_text_block(c, "outlast.", fx=28, fy=180, font_size_figma=52,
                        weight=800, color=HUBSS_ORANGE, tracking=-1.4,
                        max_w_figma=394)
        thin_rule(c, fx=28, fy=248, w_figma=394, color=CMYK_ON_DARK_RULE,
                  weight_pt=0.4)
        draw_text_block(c,
            "30+ years   ·   1,000+ projects   ·   500+ municipalities",
            fx=28, fy=262, font_size_figma=7.5, color=CMYK_ON_DARK_BODY,
            align="center", max_w_figma=394, leading_figma=11)
        thin_rule(c, fx=28, fy=288, w_figma=394, color=CMYK_ON_DARK_RULE,
                  weight_pt=0.3)
        draw_text_block(c, "The surface beneath every city we've built.",
                        fx=28, fy=308, font_size_figma=12,
                        color=HUBSS_WHITE, max_w_figma=360,
                        )
        draw_text_block(c,
            "Spec the surface. Watch it work. Walk over it for twenty years.",
            fx=28, fy=332, font_size_figma=8.5, color=CMYK_ON_DARK_BODY,
            max_w_figma=360, leading_figma=13)
        thin_rule(c, fx=28, fy=404, w_figma=394, color=HUBSS_ORANGE,
                  weight_pt=1.5)
        tracked_caps(c, "hubss.com", fx=28, fy=414, size=7.5,
                     color=HUBSS_ORANGE, align="right", max_w_figma=394)
        return

    # Photo-right variant
    fill_bleed(c, HUBSS_WHITE)
    img = right_image_path if (right_image_path and
                                Path(right_image_path).exists()) \
          else left_image_path
    if img and Path(img).exists():
        draw_full_bleed_image(c, str(img))
    # v45 — Vernon's call: 'IN THE FIELD scrim looks like shit.' Drop
    # the bottom scrim. Type on photo. White label/caption read on the
    # photo's natural lower-edge tones; if a specific photo can't hold
    # them, swap the photo rather than reintroducing a gradient.
    tracked_caps(c, label, fx=28, fy=350, size=6.5,
                 color=HUBSS_ORANGE, max_w_figma=394)
    draw_text_block(c, caption, fx=28, fy=370, font_size_figma=14,
                    weight=800, color=HUBSS_WHITE, tracking=-0.4,
                    max_w_figma=394, leading_figma=18)


def page_network_open(c, photo_path):
    """v46 — Network section opener: matches the other section openers.
    Full-bleed natural-color photo + type lower-left. No navy split.
    """
    fill_bleed(c, HUBSS_WHITE)
    if photo_path and Path(photo_path).exists():
        draw_full_bleed_image(c, str(photo_path))
    thin_rule(c, fx=28, fy=313, w_figma=28,
              color=HUBSS_ORANGE, weight_pt=2.0)
    tracked_caps(c, "Section Four", fx=28, fy=322, size=7.5,
                 color=HUBSS_WHITE, max_w_figma=394)
    draw_text_block(c, "Network.", fx=28, fy=350, font_size_figma=44,
                    weight=800, color=HUBSS_WHITE, tracking=-1.4,
                    max_w_figma=394, leading_figma=46)


def page_field_notes(c):
    """Ruled notepad page — a physical place for specifiers to record
    project details. Sits after Contact so it directly faces it on a spread."""
    fill_bleed(c, HUBSS_WHITE)
    tracked_caps(c, "Field Notes", fx=30, fy=40, size=6.5,
                 color=HUBSS_ORANGE, max_w_figma=390)
    thin_rule(c, fx=30, fy=58, w_figma=24, color=HUBSS_ORANGE, weight_pt=2.0)
    draw_text_block(c, "Project notes.", fx=30, fy=78, font_size_figma=24,
                    weight=800, color=CMYK_TEXT_DARK, tracking=-0.6,
                    max_w_figma=390)
    draw_text_block(c,
        "A place to capture surface specifications, project locations, "
        "and follow-up actions while the book is in front of you.",
        fx=30, fy=116, font_size_figma=8.5, color=CMYK_TEXT_MID,
        max_w_figma=370, leading_figma=13)

    # Ruled lines — 14 rules from y=160 to y=410, 18px spacing
    rule_y = 162
    while rule_y <= 410:
        thin_rule(c, fx=30, fy=rule_y, w_figma=390, color=CMYK_TEXT_FAINT,
                  weight_pt=0.25)
        rule_y += 18

    tracked_caps(c, "hubss.com   ·   604.309.8212   ·   416.540.9287",
                 fx=30, fy=420, size=5.5, color=CMYK_TEXT_FAINT,
                 align="center", max_w_figma=390)


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

    # Page sequence mirrors generate_plugin.py (latest polish, May 20+).
    # TOC moved to p3 (after half-title). HubNumbers + Statement added.
    # Six full-bleed DPS spreads added between sections (12 pages). pageNetworkOpen
    # replaces the generic Four-Network opener. Field Notes follows Contact.
    # Closing "The Mark" DPS (navy R panel) replaces the old page_service_promise.

    SO = CC.SECTION_OPENERS  # alias for brevity

    pages = []
    pages.append(lambda: page_cover(c))                                            # p01
    pages.append(lambda: page_half_title(c))                                       # p02
    pages.append(lambda: None)  # p03 — TOC slot, filled at end
    pages.append(lambda: page_manifesto(c))                                        # p04
    pages.append(lambda: page_why_stats(c))                                        # p05
    pages.append(lambda: page_why_proof(c))                                        # p06
    pages.append(lambda: page_hub_numbers(c))                                      # p07
    pages.append(lambda: page_statement(c))                                        # p08

    # DPS "The Work" — opening editorial spread before Products
    dps_a_l = SO.get("dps_a_left")
    dps_a_r = SO.get("dps_a_right") or dps_a_l
    if dps_a_l:
        pages.append(lambda: page_doublespread_left(c, dps_a_l))
        pages.append(lambda: page_doublespread_right(
            c, "The Work",
            "From every intersection, a statement.",
            right_image_path=dps_a_r, left_image_path=dps_a_l))

    products_page = len(pages) + 1
    pages.append(lambda: page_section_open(c, "One", "Products.", SO.get("products")))
    for prod in CC.PRODUCTS:
        p = prod
        pages.append(lambda p=p: page_product_hero(c, p))
        pages.append(lambda p=p: page_product_spec(c, p))

    # DPS "In the Field" — between Products and Applications
    dps_field_l = SO.get("editorial_products") or SO.get("applications")
    dps_field_r = SO.get("editorial_products_r") or SO.get("projects") or dps_field_l
    if dps_field_l:
        pages.append(lambda: page_doublespread_left(c, dps_field_l))
        pages.append(lambda: page_doublespread_right(
            c, "In the Field",
            "Designed for the city. Built for the street.",
            right_image_path=dps_field_r, left_image_path=dps_field_l))

    apps_page = len(pages) + 1
    pages.append(lambda: page_section_open(c, "Two", "Applications.", SO.get("applications")))
    n_apps = len(CC.APPLICATIONS)
    for idx, app in enumerate(CC.APPLICATIONS, 1):
        a = app; i = idx
        pages.append(lambda a=a, i=i: page_application(c, a, i, n_apps))

    # DPS "Across Canada" — between Applications and Projects
    dps_b_l = SO.get("dps_b_left")
    dps_b_r = SO.get("dps_b_right") or dps_b_l
    if dps_b_l:
        pages.append(lambda: page_doublespread_left(c, dps_b_l))
        pages.append(lambda: page_doublespread_right(
            c, "Across Canada",
            "Five hundred municipalities. One standard.",
            right_image_path=dps_b_r, left_image_path=dps_b_l))

    projects_page = len(pages) + 1
    pages.append(lambda: page_section_open(c, "Three", "Projects.", SO.get("projects")))
    n_projs = len(CC.PROJECTS)
    half_idx = n_projs // 2 - 1   # plugin: insert DPS after the (half_idx+1)th project's story
    for idx, proj in enumerate(CC.PROJECTS, 1):
        p = proj; i = idx
        pages.append(lambda p=p: page_project_hero(c, p))
        pages.append(lambda p=p, i=i: page_project_story(c, p, i))
        if idx - 1 == half_idx:
            # DPS "Every Mark" — mid-Projects breather
            em_l = SO.get("editorial_projects") or SO.get("reference") \
                   or (CC.PROJECTS[0].get("detail") if CC.PROJECTS else None)
            em_r = SO.get("editorial_projects_r") or SO.get("reference") \
                   or (CC.PROJECTS[-1].get("detail") if CC.PROJECTS else None) or em_l
            if em_l:
                pages.append(lambda em_l=em_l: page_doublespread_left(c, em_l))
                pages.append(lambda em_l=em_l, em_r=em_r: page_doublespread_right(
                    c, "Every Mark",
                    "Every mark tells a story.",
                    right_image_path=em_r, left_image_path=em_l))

    network_page = len(pages) + 1
    pages.append(lambda: page_network_open(c, SO.get("network")))
    for inst in CC.INSTALLERS:
        i = inst
        pages.append(lambda i=i: page_installer(c, i))

    # DPS "Built to Last" — between Network and Reference
    dps_c_l = SO.get("dps_c_left")
    dps_c_r = SO.get("dps_c_right") or dps_c_l
    if dps_c_l:
        pages.append(lambda: page_doublespread_left(c, dps_c_l))
        pages.append(lambda: page_doublespread_right(
            c, "Built to Last",
            "The surface underfoot. The city above.",
            right_image_path=dps_c_r, left_image_path=dps_c_l))

    reference_page = len(pages) + 1
    pages.append(lambda: page_section_open(c, "Five", "Reference.", SO.get("reference")))
    pages.append(lambda: page_technical_reference(c))
    pages.append(lambda: page_cities(c))
    lunch_learn_page = len(pages) + 1
    pages.append(lambda: page_lunch_learn(c))
    contact_page = len(pages) + 1
    pages.append(lambda: page_contact(c))
    pages.append(lambda: page_field_notes(c))

    # Closing DPS "The Mark" — navy R panel, dramatic full-stop
    closing_img = SO.get("editorial_closing") or SO.get("reference")
    if closing_img:
        pages.append(lambda: page_doublespread_left(c, closing_img))
        pages.append(lambda: page_doublespread_right(
            c, "The Mark",
            "Specified. Installed. Built to outlast.",
            right_style="navy",
            left_image_path=closing_img))

    # Pad-then-close: spacers go BEFORE the closing trio so the book ends
    # on the meaningful Thank-You quiet mark, not on filler.
    #
    # Vernon v40 fix: prior implementation rendered pure-white pages, which
    # Vernon saw as "broken images" in the flipbook viewer (p120/p121). The
    # padding pages now read as INTENTIONAL — a designed "Notes" page with
    # brand mark, eyebrow caption, ruled lines for client notes, and the
    # HUBSS.COM footer. Engineers/specifiers can actually use these pages.
    def page_blank_spacer(c):
        fill_bleed(c, HUBSS_WHITE)
        # Tiny orange brand dot + tracked-caps eyebrow at top-left
        orange_dot(c, fx=23, fy=51, r_figma=1.3)
        tracked_caps(c, "Notes", fx=30, fy=43, size=9.0,
                     color=HUBSS_ORANGE, max_w_figma=200)
        # Quiet ruled lines for handwritten specs / dimensions / questions
        line_color = CMYK_TEXT_FAINT
        for i in range(14):
            y = 90 + i * 24
            thin_rule(c, fx=30, fy=y, w_figma=390,
                      color=line_color, weight_pt=0.25)
        # Bottom footer hairline + URL — matches the application-page footer
        thin_rule(c, fx=30, fy=425, w_figma=390,
                  color=CMYK_TEXT_FAINT, weight_pt=0.3)
        tracked_caps(c, "hubss.com", fx=30, fy=434, size=5.5,
                     color=HUBSS_ORANGE, align="right", max_w_figma=390)

    # Closing trio: closing manifesto + quiet mark + back cover = 3 pages.
    # page_service_promise dropped — plugin no longer renders it (DPS3 right
    # panel "Built to outlast." already delivers the same brand moment).
    while (len(pages) + 3) % 4 != 0:
        pages.append(lambda: page_blank_spacer(c))

    pages.append(lambda: page_closing_manifesto(c))
    pages.append(lambda: page_quiet_mark(c))
    pages.append(lambda: page_back(c))

    # TOC — Vernon v49.1: labels MUST match the title shown on the
    # section opener (was 'Certified Installers' but the Section Four
    # opener now reads 'Network.'; was 'Technical Reference' but the
    # Section Five opener reads 'Reference.'). Also added Lunch & Learn
    # since it's a CTA destination (QR-equipped booking page).
    # Page numbers computed at section push time so they're always correct.
    toc_entries = [
        ("Products",       products_page),
        ("Applications",   apps_page),
        ("Projects",       projects_page),
        ("Network",        network_page),
        ("Reference",      reference_page),
        ("Lunch & Learn",  lunch_learn_page),
        ("Contact",        contact_page),
    ]
    pages[2] = lambda: page_toc(c, toc_entries)

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