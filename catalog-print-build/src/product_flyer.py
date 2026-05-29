"""
HUBSS product flyer — single-sided 8.5x11" premium spec companion.

Layout, top-to-bottom (all dimensions in inches at design time):

  full-bleed product photograph   (~3.65")   <- 35% of trim
  cream banner band               (~1.45")   eyebrow / display name / italic / rule
  spec grid (2 cols x 2-3 rows)   (~2.05")
  body paragraph                  (~1.45")
  application chips line          (~0.30")
  bottom utility row              (~0.95")   logo+url (left) / QR (right)
  footer band                     (~0.35")   thin orange rule + (c) caption

Brand language matches the v43 catalogue: cream paper, navy display text,
orange brand-only rules + eyebrows, body in 88% K. ALLCAPS tracked at 1.6.
No navy/black scrims (Vernon explicitly removed those).
"""

from __future__ import annotations

from pathlib import Path
import io

from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import CMYKColor
from reportlab.pdfbase.pdfmetrics import stringWidth

import qrcode
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image

from .flyer_specs import (
    PAGE_SIZE, PAGE_W, PAGE_H,
    BLEED, TRIM_W, TRIM_H,
    TRIM_LEFT, TRIM_RIGHT, TRIM_BOTTOM, TRIM_TOP,
    SAFE_LEFT, SAFE_RIGHT, SAFE_BOTTOM, SAFE_TOP,
    CONTENT_LEFT, CONTENT_RIGHT, CONTENT_W, MARGIN,
    HERO_H, BANNER_H, FOOTER_H,
    QR_SIZE, QR_PAD,
    HUBSS_ORANGE, HUBSS_NAVY_RICH, HUBSS_WHITE, HUBSS_BLACK,
    CMYK_CREAM, CMYK_TEXT_DARK, CMYK_TEXT_MID, CMYK_TEXT_FAINT, CMYK_RULE_FAINT,
    FONT_SANS_REG, FONT_SANS_BOLD, FONT_SANS_OBL, FONT_SERIF,
    ALLCAPS_TRACKING,
)
from .images import draw_image_box


# ---------------------------------------------------------------------------
# Caches (rendered art and the QR matrix can be reused across many flyers).
# ---------------------------------------------------------------------------
_ROOT = Path(__file__).resolve().parent.parent
_QR_CACHE_DIR = _ROOT / "output" / "_flyer_cache" / "qr"
_QR_CACHE_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Small drawing primitives
# ---------------------------------------------------------------------------
def _fill_page(c: Canvas, color) -> None:
    c.setFillColor(color)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)


def _hairline(c: Canvas, x: float, y: float, w: float, *, color=CMYK_RULE_FAINT, h: float = 0.5) -> None:
    c.setFillColor(color)
    c.rect(x, y, w, h, stroke=0, fill=1)


def _set_font(c: Canvas, font: str, size: float) -> None:
    c.setFont(font, size)


def _string_w(text: str, font: str, size: float, *, tracking: float = 0.0) -> float:
    """Width including tracking (charSpace adds `tracking` pt between every pair)."""
    base = stringWidth(text, font, size)
    return base + tracking * max(0, len(text) - 1)


def _draw_text(c: Canvas, text: str, x: float, y: float, *,
               font: str, size: float, color, tracking: float = 0.0,
               align: str = "left", width: float | None = None) -> None:
    """Single-line text. `y` is the baseline."""
    if not text:
        return
    c.setFillColor(color)
    t = c.beginText()
    t.setFont(font, size)
    t.setCharSpace(tracking)
    if align == "left" or width is None:
        t.setTextOrigin(x, y)
    elif align == "right":
        w = _string_w(text, font, size, tracking=tracking)
        t.setTextOrigin(x + width - w, y)
    elif align == "center":
        w = _string_w(text, font, size, tracking=tracking)
        t.setTextOrigin(x + (width - w) / 2.0, y)
    t.textOut(text)
    c.drawText(t)


def _wrap_lines(text: str, font: str, size: float, max_w: float, *, tracking: float = 0.0) -> list[str]:
    """Word-wrap a paragraph to lines that fit `max_w` pt (tracking-aware)."""
    out: list[str] = []
    for para in text.split("\n"):
        words = para.split(" ")
        cur = ""
        for w in words:
            cand = (cur + " " + w).strip()
            if _string_w(cand, font, size, tracking=tracking) <= max_w:
                cur = cand
            else:
                if cur:
                    out.append(cur)
                cur = w
        if cur:
            out.append(cur)
    return out


def _draw_paragraph(c: Canvas, text: str, x: float, y_top: float, *,
                    font: str, size: float, leading: float, color,
                    width: float, tracking: float = 0.0) -> float:
    """Draw a wrapped paragraph. `y_top` is the top of the text box; we drop
    the baseline by `size` for the first line. Returns the y of the last
    baseline (so callers can stack).
    """
    lines = _wrap_lines(text, font, size, width, tracking=tracking)
    c.setFillColor(color)
    t = c.beginText()
    t.setFont(font, size)
    t.setCharSpace(tracking)
    baseline = y_top - size
    for ln in lines:
        t.setTextOrigin(x, baseline)
        t.textOut(ln)
        baseline -= leading
    c.drawText(t)
    return baseline + leading  # last baseline drawn


def _tracked_caps(c: Canvas, text: str, x: float, y: float, *,
                  size: float, color, tracking: float = ALLCAPS_TRACKING,
                  align: str = "left", width: float | None = None) -> None:
    _draw_text(c, text.upper(), x, y, font=FONT_SANS_BOLD, size=size,
               color=color, tracking=tracking, align=align, width=width)


# ---------------------------------------------------------------------------
# QR code
# ---------------------------------------------------------------------------
def _qr_png_for(url: str) -> Path:
    """Render a high-EC QR code as a PNG (cached) and return its path."""
    safe = "".join(c if c.isalnum() else "_" for c in url)[:80]
    out = _QR_CACHE_DIR / f"{safe}.png"
    if out.exists():
        return out
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=20,
        border=0,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    img.save(out, format="PNG", dpi=(600, 600))
    return out


def _draw_qr_block(c: Canvas, url: str, x_right: float, y_bottom: float) -> None:
    """Draw the QR with a white plate underneath. x_right is the right edge."""
    plate_size = QR_SIZE + 2 * QR_PAD
    plate_x = x_right - plate_size
    plate_y = y_bottom

    # White plate (so QR stays readable even if it sits over photo edges)
    c.setFillColor(HUBSS_WHITE)
    c.rect(plate_x, plate_y, plate_size, plate_size, stroke=0, fill=1)

    # The matrix itself
    qr_path = _qr_png_for(url)
    c.drawImage(str(qr_path),
                plate_x + QR_PAD, plate_y + QR_PAD,
                QR_SIZE, QR_SIZE,
                preserveAspectRatio=True, mask="auto")


# ---------------------------------------------------------------------------
# Crop marks
# ---------------------------------------------------------------------------
def _crop_marks(c: Canvas) -> None:
    """Hairline crop marks just outside the trim — printers expect these even
    when bleed is set up."""
    c.saveState()
    c.setStrokeColor(HUBSS_BLACK)
    c.setLineWidth(0.25)
    n = 0.15 * 72   # 0.15"
    o = 0.03 * 72   # 0.03" gap from trim
    L, R, B, T = TRIM_LEFT, TRIM_RIGHT, TRIM_BOTTOM, TRIM_TOP

    # Corners
    c.line(L - o - n, B, L - o, B); c.line(L, B - o - n, L, B - o)
    c.line(R + o, B, R + o + n, B); c.line(R, B - o - n, R, B - o)
    c.line(L - o - n, T, L - o, T); c.line(L, T + o, L, T + o + n)
    c.line(R + o, T, R + o + n, T); c.line(R, T + o, R, T + o + n)
    c.restoreState()


# ---------------------------------------------------------------------------
# Layout sections
# ---------------------------------------------------------------------------
def _draw_hero(c: Canvas, hero_path: Path | None) -> None:
    """Full-bleed photo across the top of the page."""
    # Hero occupies the top of the page down to (TRIM_TOP - HERO_H), but
    # extends into the top/left/right bleed.
    hero_box_y = TRIM_TOP - HERO_H
    if hero_path and Path(hero_path).exists():
        # Stretch left/right into bleed and up into bleed for clean trim.
        draw_image_box(c, str(hero_path),
                       0, hero_box_y,
                       PAGE_W, HERO_H + BLEED,
                       cover=True)
    else:
        # Calm navy placeholder if hero missing.
        c.setFillColor(HUBSS_NAVY_RICH)
        c.rect(0, hero_box_y, PAGE_W, HERO_H + BLEED, stroke=0, fill=1)


def _draw_banner(c: Canvas, *, eyebrow: str, display_name: str, italic: str) -> float:
    """Cream banner band immediately beneath the photo. Returns its bottom y."""
    banner_top = TRIM_TOP - HERO_H
    banner_bottom = banner_top - BANNER_H

    # Full-bleed cream band
    c.setFillColor(CMYK_CREAM)
    c.rect(0, banner_bottom, PAGE_W, BANNER_H, stroke=0, fill=1)

    # Layout inside the band: padding top, content left at CONTENT_LEFT
    inner_top = banner_top - 0.22 * 72   # ~0.22" pad below the photo edge

    # Orange eyebrow (small tracked caps)
    eyebrow_size = 8.0
    _tracked_caps(c, eyebrow, CONTENT_LEFT, inner_top - eyebrow_size,
                  size=eyebrow_size, color=HUBSS_ORANGE,
                  tracking=ALLCAPS_TRACKING)

    # Display product name — navy, big, negative tracking.
    name_size = _fit_display_size(display_name, max_w=CONTENT_W)
    name_baseline = inner_top - eyebrow_size - 0.18 * 72 - name_size
    _draw_text(c, display_name, CONTENT_LEFT, name_baseline,
               font=FONT_SANS_BOLD, size=name_size,
               color=HUBSS_NAVY_RICH, tracking=-0.6)

    # Italic serif subhead (the tagline) below the name.
    italic_size = 12.5
    italic_top = name_baseline - 0.20 * 72
    _draw_paragraph(c, italic, CONTENT_LEFT, italic_top,
                    font=FONT_SERIF, size=italic_size,
                    leading=italic_size * 1.25,
                    color=CMYK_TEXT_MID, width=CONTENT_W,
                    tracking=0.0)

    # Thin orange rule, just above the banner bottom.
    rule_y = banner_bottom + 0.18 * 72
    _hairline(c, CONTENT_LEFT, rule_y, 1.0 * 72, color=HUBSS_ORANGE, h=1.6)

    return banner_bottom


def _fit_display_size(text: str, *, max_w: float) -> float:
    """Pick a display size that comfortably fits the product name on one line."""
    target = 36.0
    while target > 22.0:
        w = _string_w(text, FONT_SANS_BOLD, target, tracking=-0.6)
        if w <= max_w:
            return target
        target -= 1.0
    return 22.0


def _draw_spec_grid(c: Canvas, spec_pairs: list[tuple[str, str]], *,
                    x: float, y_top: float, width: float) -> float:
    """2-column spec grid. Each cell: tracked-caps label + body value.
    Returns the bottom y of the grid.
    """
    if not spec_pairs:
        return y_top

    # Cap to 6 rows total (we want 2 cols * 3 rows max for breathing room)
    pairs = list(spec_pairs)[:6]
    col_gap = 0.30 * 72
    col_w = (width - col_gap) / 2.0
    row_h = 0.62 * 72  # ~0.62" per row — generous

    n = len(pairs)
    rows = (n + 1) // 2

    # Top divider
    _hairline(c, x, y_top, width, color=CMYK_RULE_FAINT, h=0.4)

    for i, (label, value) in enumerate(pairs):
        col = i % 2
        row = i // 2
        cell_x = x + col * (col_w + col_gap)
        cell_top = y_top - row * row_h - 0.18 * 72  # padding at top of each row

        # Label
        _tracked_caps(c, label, cell_x, cell_top - 7.5,
                      size=7.5, color=CMYK_TEXT_FAINT)

        # Value — wrap if long
        val_top = cell_top - 7.5 - 0.10 * 72
        _draw_paragraph(c, value, cell_x, val_top,
                        font=FONT_SANS_BOLD, size=9.5,
                        leading=12.0, color=CMYK_TEXT_DARK,
                        width=col_w, tracking=-0.05)

        # Inter-row hairline (between rows, not after the last)
        if (row < rows - 1) and (i + 2 < n or (i + 1 < n and (i + 1) % 2 == 1)):
            rule_y = y_top - (row + 1) * row_h + 0.05 * 72
            _hairline(c, x, rule_y, width, color=CMYK_RULE_FAINT, h=0.3)

    bottom_y = y_top - rows * row_h
    # Closing divider
    _hairline(c, x, bottom_y, width, color=CMYK_RULE_FAINT, h=0.4)
    return bottom_y


def _draw_body_paragraph(c: Canvas, text: str, *, x: float, y_top: float,
                         width: float) -> float:
    """Generous body paragraph. Returns last baseline y."""
    size = 10.0
    leading = 16.0
    last = _draw_paragraph(c, text, x, y_top,
                           font=FONT_SANS_REG, size=size,
                           leading=leading, color=CMYK_TEXT_DARK,
                           width=width, tracking=0.05)
    return last


def _draw_application_chips(c: Canvas, chips: list[str], *,
                            x: float, y: float, width: float) -> None:
    """Single line of small tracked caps, separated by mid-dot. Truncates if needed."""
    if not chips:
        return
    sep = "   ·   "   # spaced middle-dot
    full = sep.join(chips)
    # Try full first; if it doesn't fit, drop tail items until it does.
    size = 8.0
    while chips and _string_w(full.upper(), FONT_SANS_BOLD, size,
                              tracking=ALLCAPS_TRACKING) > width:
        chips = chips[:-1]
        full = sep.join(chips)
    _tracked_caps(c, full, x, y,
                  size=size, color=CMYK_TEXT_MID,
                  tracking=ALLCAPS_TRACKING)


def _draw_bottom_block(c: Canvas, *, logo_path: Path | None,
                       slug: str, url: str,
                       y_baseline: float) -> None:
    """Bottom utility row: logo + URL (left) / QR (right).

    `y_baseline` is the absolute y for the orange footer rule. The block sits
    above that rule.
    """
    block_h = 0.95 * 72
    block_top = y_baseline + 0.20 * 72 + block_h
    block_bottom = y_baseline + 0.20 * 72

    # LEFT: small color HUBSS logo + URL stack
    logo_w = 1.40 * 72
    logo_h = 0.42 * 72
    if logo_path and logo_path.exists():
        try:
            with Image.open(logo_path) as im:
                iw, ih = im.size
            aspect = ih / iw
            logo_h = logo_w * aspect
        except Exception:
            pass
        draw_image_box(c, str(logo_path), CONTENT_LEFT,
                       block_top - logo_h,
                       logo_w, logo_h,
                       cover=False, convert_to_cmyk=False)

    # URL — in orange tracked caps, just under the logo
    url_label_y = block_top - logo_h - 0.18 * 72 - 8.0
    _tracked_caps(c, "hubss.com", CONTENT_LEFT, url_label_y,
                  size=8.0, color=HUBSS_ORANGE)

    # Tiny caption with the deep link
    caption = f"Learn more  ·  hubss.com/products/{slug}"
    _draw_text(c, caption, CONTENT_LEFT,
               url_label_y - 0.14 * 72 - 7.0,
               font=FONT_SANS_REG, size=7.0,
               color=CMYK_TEXT_FAINT, tracking=0.2)

    # RIGHT: QR — anchored to right edge of content area, bottom aligned to
    # block_bottom (so the QR + plate sit cleanly inside the bottom band).
    _draw_qr_block(c, url, x_right=CONTENT_RIGHT, y_bottom=block_bottom)


def _draw_footer(c: Canvas, *, y_baseline: float) -> None:
    """Thin orange rule + tiny copyright caption at the very bottom."""
    # Orange rule
    _hairline(c, CONTENT_LEFT, y_baseline, CONTENT_W, color=HUBSS_ORANGE, h=0.8)
    # Caption
    caption = "(c) HUB Surface Systems  ·  Catalogue 2026 companion"
    _draw_text(c, caption, CONTENT_LEFT, y_baseline - 0.16 * 72 - 6.5,
               font=FONT_SANS_REG, size=6.5,
               color=CMYK_TEXT_FAINT, tracking=0.4)


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------
def build_flyer(product: dict, output_pdf_path: Path) -> Path:
    """Render one 8.5x11" CMYK product flyer PDF.

    product dict keys (all strings/lists unless noted):
      slug, name, display_name, eyebrow, tagline (italic subhead),
      body (paragraph), spec_pairs (list of (label, value)),
      chips (list of str), hero (Path), logo (Path|None), url
    """
    output_pdf_path = Path(output_pdf_path)
    output_pdf_path.parent.mkdir(parents=True, exist_ok=True)

    c = Canvas(str(output_pdf_path), pagesize=PAGE_SIZE)
    c.setTitle(f"HUBSS Flyer — {product.get('display_name', product.get('name', ''))}")
    c.setAuthor("HUB Surface Systems")
    c.setSubject(f"Product flyer for {product.get('name', '')} ({product['slug']})")
    c.setKeywords([
        "HUB Surface Systems", "HUBSS", "product flyer",
        product.get("name", ""), product["slug"],
    ])

    # Set print boxes — TrimBox is the cut line, BleedBox = full media.
    c.setTrimBox((TRIM_LEFT, TRIM_BOTTOM, TRIM_RIGHT, TRIM_TOP))
    c.setBleedBox((0, 0, PAGE_W, PAGE_H))
    c.setCropBox((0, 0, PAGE_W, PAGE_H))

    # Paper — cream base behind everything (banner re-paints its own band).
    _fill_page(c, CMYK_CREAM)

    # 1. Hero photo across the top.
    _draw_hero(c, product.get("hero"))

    # 2. Cream banner band beneath the hero.
    banner_bottom = _draw_banner(
        c,
        eyebrow=product.get("eyebrow", ""),
        display_name=product.get("display_name", product.get("name", "")),
        italic=product.get("tagline", ""),
    )

    # 3. Spec grid (mid section).
    grid_top = banner_bottom - 0.42 * 72
    grid_bottom = _draw_spec_grid(
        c, product.get("spec_pairs", []),
        x=CONTENT_LEFT, y_top=grid_top, width=CONTENT_W,
    )

    # 4. Body paragraph.
    body_top = grid_bottom - 0.34 * 72
    body_last = _draw_body_paragraph(
        c, product.get("body", ""),
        x=CONTENT_LEFT, y_top=body_top, width=CONTENT_W,
    )

    # 5. Application chips line, just below the body.
    chips_y = body_last - 0.32 * 72 - 8.0
    _draw_application_chips(
        c, product.get("chips", []),
        x=CONTENT_LEFT, y=chips_y, width=CONTENT_W,
    )

    # 6. Bottom utility block (logo+url left / QR right).
    # We anchor it relative to the footer rule so spacing is predictable
    # regardless of how short the body ran.
    footer_rule_y = TRIM_BOTTOM + 0.50 * 72
    _draw_bottom_block(
        c,
        logo_path=product.get("logo"),
        slug=product["slug"],
        url=product["url"],
        y_baseline=footer_rule_y,
    )

    # 7. Footer rule + © caption.
    _draw_footer(c, y_baseline=footer_rule_y)

    # 8. Crop marks (printers expect these even when bleed is provided).
    _crop_marks(c)

    c.showPage()
    c.save()

    return output_pdf_path
