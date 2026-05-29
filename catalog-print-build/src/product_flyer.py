"""
HUBSS product flyer — v46 brand direction, 8.5x11" single-sided.

v46 design language (Vernon, creative director pass):
- NO cream, NO scrim, NO dark wash on body. Pure magazine flow.
- Full-bleed natural-color product photograph in the top zone.
- Slim navy header band beneath the photo: orange eyebrow + WHITE wordmark
  + short orange dash. This is the only "ink" on the page besides the photo
  and the matching navy footer.
- White body section: confident bold display headline (dark ink, NOT navy),
  mid-grey tagline (Helvetica-Oblique — NO serif anywhere in v46), body
  paragraph, 2-column spec grid with hairline rules, chip line.
- Slim navy footer band: white HUB logo + URL caps (left), QR on a small
  white plate (right). Tiny copyright line bottom-left.
- A whisper of orange — a 1pt hairline rule between body and footer band.

Layout (top to bottom, all dims in inches at design time):
  hero photograph (full-bleed)        ~6.40"  (~58% of 11")
  navy header band                    ~1.35"  (eyebrow + wordmark + dash)
  white body section                  ~2.30"  (display / tagline / body / specs / chips)
  navy footer band                    ~0.95"  (logo + url / QR)

No serif typography. Helvetica-Oblique is the only italic.
"""

from __future__ import annotations

from pathlib import Path

from reportlab.pdfgen.canvas import Canvas
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
    HERO_H, NAV_HEADER_H, NAV_FOOTER_H,
    QR_SIZE, QR_PAD, QR_CORNER_R,
    HUBSS_ORANGE, HUBSS_NAVY_RICH, HUBSS_WHITE, HUBSS_BLACK,
    CMYK_TEXT_DARK, CMYK_TEXT_MID, CMYK_TEXT_FAINT, CMYK_RULE_FAINT,
    CMYK_ON_DARK_BODY, CMYK_ON_DARK_MID,
    FONT_SANS_REG, FONT_SANS_BOLD, FONT_SANS_OBL,
    ALLCAPS_TRACKING,
)
from .images import draw_image_box


# ---------------------------------------------------------------------------
# Caches
# ---------------------------------------------------------------------------
_ROOT = Path(__file__).resolve().parent.parent
_QR_CACHE_DIR = _ROOT / "output" / "_flyer_cache" / "qr"
_QR_CACHE_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Drawing primitives
# ---------------------------------------------------------------------------
def _fill_page(c: Canvas, color) -> None:
    c.setFillColor(color)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)


def _hairline(c: Canvas, x: float, y: float, w: float, *,
              color=CMYK_RULE_FAINT, h: float = 0.5) -> None:
    c.setFillColor(color)
    c.rect(x, y, w, h, stroke=0, fill=1)


def _string_w(text: str, font: str, size: float, *,
              tracking: float = 0.0) -> float:
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


def _wrap_lines(text: str, font: str, size: float, max_w: float, *,
                tracking: float = 0.0) -> list[str]:
    """Word-wrap a paragraph to lines that fit `max_w` pt (tracking-aware)."""
    out: list[str] = []
    for para in (text or "").split("\n"):
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
    """Draw a wrapped paragraph. `y_top` is the top of the text box.
    Returns the y of the last baseline drawn.
    """
    if not text:
        return y_top
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
    return baseline + leading


def _tracked_caps(c: Canvas, text: str, x: float, y: float, *,
                  size: float, color, tracking: float = ALLCAPS_TRACKING,
                  align: str = "left", width: float | None = None,
                  font: str = FONT_SANS_BOLD) -> None:
    _draw_text(c, (text or "").upper(), x, y, font=font, size=size,
               color=color, tracking=tracking, align=align, width=width)


def _round_rect(c: Canvas, x: float, y: float, w: float, h: float, *,
                r: float, color) -> None:
    c.setFillColor(color)
    c.roundRect(x, y, w, h, r, stroke=0, fill=1)


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


def _draw_qr_on_plate(c: Canvas, url: str, *,
                      x_right: float, y_center: float) -> None:
    """Draw the QR with a small rounded white plate. Anchored by right edge
    and vertical centre — convenient for placing inside the navy footer."""
    plate_size = QR_SIZE + 2 * QR_PAD
    plate_x = x_right - plate_size
    plate_y = y_center - plate_size / 2.0

    # Rounded white plate
    _round_rect(c, plate_x, plate_y, plate_size, plate_size,
                r=QR_CORNER_R, color=HUBSS_WHITE)

    # QR matrix
    qr_path = _qr_png_for(url)
    c.drawImage(str(qr_path),
                plate_x + QR_PAD, plate_y + QR_PAD,
                QR_SIZE, QR_SIZE,
                preserveAspectRatio=True, mask="auto")


# ---------------------------------------------------------------------------
# Crop marks
# ---------------------------------------------------------------------------
def _crop_marks(c: Canvas) -> None:
    c.saveState()
    c.setStrokeColor(HUBSS_BLACK)
    c.setLineWidth(0.25)
    n = 0.15 * 72   # 0.15"
    o = 0.03 * 72   # 0.03" gap from trim
    L, R, B, T = TRIM_LEFT, TRIM_RIGHT, TRIM_BOTTOM, TRIM_TOP
    c.line(L - o - n, B, L - o, B); c.line(L, B - o - n, L, B - o)
    c.line(R + o, B, R + o + n, B); c.line(R, B - o - n, R, B - o)
    c.line(L - o - n, T, L - o, T); c.line(L, T + o, L, T + o + n)
    c.line(R + o, T, R + o + n, T); c.line(R, T + o, R, T + o + n)
    c.restoreState()


# ---------------------------------------------------------------------------
# Layout sections — top to bottom
# ---------------------------------------------------------------------------
def _draw_hero_photo(c: Canvas, hero_path: Path | None) -> float:
    """Full-bleed natural-color product photograph across the top of the page.
    Returns the y of the bottom edge of the hero (where the next section starts).
    """
    hero_bottom = TRIM_TOP - HERO_H
    if hero_path and Path(hero_path).exists():
        # Extend top + sides through the bleed so the trim cut is clean.
        draw_image_box(c, str(hero_path),
                       0, hero_bottom,
                       PAGE_W, HERO_H + BLEED,
                       cover=True)
    else:
        # Calm navy placeholder if hero is missing — never cream.
        c.setFillColor(HUBSS_NAVY_RICH)
        c.rect(0, hero_bottom, PAGE_W, HERO_H + BLEED, stroke=0, fill=1)
    return hero_bottom


def _draw_navy_header(c: Canvas, *, eyebrow: str, wordmark: str,
                      y_top: float) -> float:
    """Slim navy header band that sits directly beneath the hero photo.
    Holds:
      - small ORANGE eyebrow caps  (~7.5pt, tracked)
      - WHITE wordmark — the product name in bold sans, slightly tighter
      - short orange dash (the v46 signature)

    `y_top` is the y of the TOP of this band. Returns the y of its BOTTOM.
    """
    band_bottom = y_top - NAV_HEADER_H
    c.setFillColor(HUBSS_NAVY_RICH)
    # Bleed left/right and into the photo edge — no hairline gap on press.
    c.rect(0, band_bottom, PAGE_W, NAV_HEADER_H, stroke=0, fill=1)

    inner_top = y_top - 0.32 * 72     # ~0.32" pad below the photo edge
    # Eyebrow
    eyebrow_size = 7.8
    _tracked_caps(c, eyebrow, CONTENT_LEFT, inner_top - eyebrow_size,
                  size=eyebrow_size, color=HUBSS_ORANGE,
                  tracking=ALLCAPS_TRACKING)

    # Wordmark — product name in WHITE bold sans, generous size, tighter trk.
    word_size = _fit_wordmark_size(wordmark, max_w=CONTENT_W * 0.88)
    word_baseline = inner_top - eyebrow_size - 0.18 * 72 - word_size
    _draw_text(c, wordmark, CONTENT_LEFT, word_baseline,
               font=FONT_SANS_BOLD, size=word_size,
               color=HUBSS_WHITE, tracking=-0.8)

    # Orange signature dash — sits ~10pt below the wordmark baseline
    dash_y = word_baseline - 0.13 * 72
    _hairline(c, CONTENT_LEFT, dash_y, 0.55 * 72,
              color=HUBSS_ORANGE, h=2.2)

    return band_bottom


def _fit_wordmark_size(text: str, *, max_w: float) -> float:
    """Pick a wordmark size that fits — TrafficPatternsXD is the limit case."""
    target = 36.0
    while target > 22.0:
        w = _string_w(text, FONT_SANS_BOLD, target, tracking=-0.8)
        if w <= max_w:
            return target
        target -= 1.0
    return 22.0


def _draw_body_section(c: Canvas, *, display_headline: str, tagline: str,
                       body: str, spec_pairs: list[tuple[str, str]],
                       chips: list[str],
                       y_top: float, y_bottom: float) -> None:
    """The whole white body — display headline, tagline, body paragraph,
    spec grid, chip line. Anchored between y_top (just below navy header)
    and y_bottom (just above navy footer).

    Order top-down:
      DISPLAY HEADLINE  (bold dark sans, big, negative tracking)
      tagline (Helvetica-Oblique mid-grey, optional)
      body paragraph (sans regular, dark, generous leading)
      ---- gap ----
      SPEC GRID (top rule, 2 cols x rows, bottom rule)
      ---- gap ----
      CHIP LINE (tracked caps centred)
    """
    x = CONTENT_LEFT
    w = CONTENT_W

    # ---- Reserve the bottom of the body zone for chips + spec grid -------
    # We pin those to the bottom edge so they sit consistently above the
    # navy footer regardless of body length.
    chip_baseline_y = y_bottom + 0.32 * 72
    chip_top_y = chip_baseline_y + 7.5            # cap-height clearance above chip

    pairs = list(spec_pairs)[:4]
    rows = (len(pairs) + 1) // 2 if pairs else 0
    row_h = 0.62 * 72
    grid_height = row_h * rows if pairs else 0.0

    # Gap between grid bottom rule and chip top
    grid_to_chip_gap = 0.22 * 72
    grid_bottom_y = chip_top_y + grid_to_chip_gap if pairs else chip_top_y
    grid_top_y = grid_bottom_y + grid_height

    # ---- Top-down: optional display headline, tagline, body -----------
    inner_top = y_top - 0.38 * 72

    last = inner_top
    if display_headline:
        h_size = _fit_headline_size(display_headline, max_w=w)
        h_lead = h_size * 1.05
        last = _draw_paragraph(c, display_headline, x, inner_top,
                               font=FONT_SANS_BOLD, size=h_size,
                               leading=h_lead, color=CMYK_TEXT_DARK,
                               width=w, tracking=-0.9)

    if tagline:
        tagline_top = last - (0.22 * 72 if display_headline else 0)
        tag_size = 14.0
        last = _draw_paragraph(c, tagline, x, tagline_top,
                               font=FONT_SANS_OBL, size=tag_size,
                               leading=tag_size * 1.28,
                               color=CMYK_TEXT_MID, width=w)

    # Body — sans regular. We cap its bottom so it never collides with grid.
    body_top = last - 0.30 * 72
    body_size = 9.8
    body_lead = body_size * 1.65   # editorial leading

    if body:
        # Calculate max usable height
        max_body_bottom = grid_top_y + 0.28 * 72   # gap above grid
        max_body_height = body_top - max_body_bottom
        max_lines = max(2, int(max_body_height / body_lead))

        lines = _wrap_lines(body, FONT_SANS_REG, body_size, w,
                            tracking=0.05)
        if len(lines) > max_lines:
            lines = lines[:max_lines]
            # Truncate the last line with an ellipsis if needed
            if lines:
                last_line = lines[-1].rstrip()
                while last_line and _string_w(last_line + "...",
                                              FONT_SANS_REG, body_size,
                                              tracking=0.05) > w:
                    last_line = last_line.rsplit(" ", 1)[0]
                lines[-1] = (last_line + "...") if last_line else "..."

        # Draw lines manually so we honour the truncation
        c.setFillColor(CMYK_TEXT_DARK)
        t = c.beginText()
        t.setFont(FONT_SANS_REG, body_size)
        t.setCharSpace(0.05)
        baseline = body_top - body_size
        for ln in lines:
            t.setTextOrigin(x, baseline)
            t.textOut(ln)
            baseline -= body_lead
        c.drawText(t)

    # ---- Spec grid (pinned bottom) ------------------------------------
    if pairs:
        _draw_spec_grid(c, pairs,
                        x=x, y_top=grid_top_y, width=w, row_h=row_h)

    # ---- Chip line (pinned bottom) ------------------------------------
    if chips:
        _draw_chip_line(c, chips, x=x, y=chip_baseline_y, width=w)


def _fit_headline_size(text: str, *, max_w: float) -> float:
    """Pick a display headline size that comfortably fits the first line."""
    # Long headlines wrap — fit the longest single word, then we'll wrap.
    longest_word = max(text.split(), key=len) if text.strip() else ""
    candidate = 40.0
    while candidate > 26.0:
        if _string_w(longest_word, FONT_SANS_BOLD, candidate,
                     tracking=-0.9) <= max_w:
            return candidate
        candidate -= 1.0
    return 26.0


def _draw_spec_grid(c: Canvas, pairs: list[tuple[str, str]], *,
                    x: float, y_top: float, width: float,
                    row_h: float) -> float:
    """2-column spec grid on white. Thin grey rule top + bottom; faint
    inter-row rule. Tracked-caps label, sans-bold value. Sits on white
    (no cream / no shade).
    """
    if not pairs:
        return y_top

    col_gap = 0.30 * 72
    col_w = (width - col_gap) / 2.0
    rows = (len(pairs) + 1) // 2

    # Top rule
    _hairline(c, x, y_top, width, color=CMYK_RULE_FAINT, h=0.5)

    for i, (label, value) in enumerate(pairs):
        col = i % 2
        row = i // 2
        cell_x = x + col * (col_w + col_gap)
        cell_top = y_top - row * row_h - 0.18 * 72

        # Label — tracked caps, faint
        _tracked_caps(c, label, cell_x, cell_top - 7.0,
                      size=7.0, color=CMYK_TEXT_FAINT)

        # Value — sans bold, dark
        val_top = cell_top - 7.0 - 0.12 * 72
        _draw_paragraph(c, value, cell_x, val_top,
                        font=FONT_SANS_BOLD, size=9.5,
                        leading=12.0, color=CMYK_TEXT_DARK,
                        width=col_w, tracking=-0.05)

        # Faint inter-row rule (between rows, not after last)
        if (row < rows - 1):
            rule_y = y_top - (row + 1) * row_h + 0.05 * 72
            _hairline(c, x, rule_y, width, color=CMYK_RULE_FAINT, h=0.3)

    grid_bottom = y_top - rows * row_h
    # Bottom rule
    _hairline(c, x, grid_bottom, width, color=CMYK_RULE_FAINT, h=0.5)
    return grid_bottom


def _draw_chip_line(c: Canvas, chips: list[str], *,
                    x: float, y: float, width: float) -> None:
    """Single centred line of tracked caps separated by mid-dot. Truncates
    tail items if the joined string would overrun `width`."""
    if not chips:
        return
    sep = "   ·   "
    size = 7.5
    chips = list(chips)
    while chips:
        joined = sep.join(chips).upper()
        if _string_w(joined, FONT_SANS_BOLD, size,
                     tracking=ALLCAPS_TRACKING) <= width:
            break
        chips.pop()
    if not chips:
        return
    _tracked_caps(c, sep.join(chips), x, y,
                  size=size, color=CMYK_TEXT_MID,
                  tracking=ALLCAPS_TRACKING,
                  align="center", width=width)


def _draw_navy_footer(c: Canvas, *, logo_white_path: Path | None,
                      slug: str, url: str) -> None:
    """Slim navy footer band at the very bottom of the page.

    Left:  WHITE HUB logo (vector / png) + ALL-CAPS URL underneath
    Right: QR matrix on a small rounded white plate
    """
    band_bottom = TRIM_BOTTOM
    c.setFillColor(HUBSS_NAVY_RICH)
    # Bleed left/right/bottom so trim has no hairline.
    c.rect(0, 0, PAGE_W, NAV_FOOTER_H + BLEED, stroke=0, fill=1)

    band_top = band_bottom + NAV_FOOTER_H
    band_mid = (band_top + band_bottom) / 2.0

    # A thin orange rule sits ABOVE the navy band (on the white body) —
    # the v46 brand-pickup hairline.
    _hairline(c, CONTENT_LEFT, band_top + 0.06 * 72,
              CONTENT_W, color=HUBSS_ORANGE, h=0.8)

    # LEFT: white HUB logo. Logo aspect is 2432:701 (~3.47:1) — at 1.45" wide
    # that gives ~0.42" tall, which sits nicely in the 0.95" band.
    logo_w = 1.55 * 72
    logo_h = logo_w * (701 / 2432)
    if logo_white_path and logo_white_path.exists():
        try:
            with Image.open(logo_white_path) as im:
                iw, ih = im.size
            logo_h = logo_w * (ih / iw)
        except Exception:
            pass
        logo_y = band_mid - logo_h / 2.0 + 0.05 * 72   # nudge up for url line
        draw_image_box(c, str(logo_white_path),
                       CONTENT_LEFT, logo_y,
                       logo_w, logo_h,
                       cover=False, convert_to_cmyk=False)
        url_baseline = logo_y - 0.10 * 72 - 6.5
    else:
        # Type-only fallback: HUBSS wordmark in white caps
        _tracked_caps(c, "HUB SURFACE SYSTEMS",
                      CONTENT_LEFT, band_mid + 4,
                      size=10.0, color=HUBSS_WHITE,
                      tracking=ALLCAPS_TRACKING)
        url_baseline = band_mid - 8.0

    # Tracked-caps URL in soft orange — beneath the logo. The deep-link is
    # encoded in the QR, so the URL caption stays short (no second slug line)
    # which keeps the footer band visually quiet.
    _tracked_caps(c, "hubss.com", CONTENT_LEFT, url_baseline,
                  size=6.5, color=HUBSS_ORANGE,
                  tracking=ALLCAPS_TRACKING)

    # Tiny copyright + companion line — sits below the URL caps, comfortably
    # above the band bottom (no collision with trim edge).
    cap = "(c) HUB Surface Systems  ·  Catalogue 2026 companion"
    _draw_text(c, cap, CONTENT_LEFT, url_baseline - 0.16 * 72 - 6.0,
               font=FONT_SANS_REG, size=5.8,
               color=CMYK_ON_DARK_MID, tracking=0.30)

    # RIGHT: QR on white plate, vertically centred in the band.
    _draw_qr_on_plate(c, url, x_right=CONTENT_RIGHT, y_center=band_mid)


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------
def build_flyer(product: dict, output_pdf_path: Path) -> Path:
    """Render one 8.5x11" CMYK product flyer PDF in the v46 brand direction.

    product dict keys (all strings/lists unless noted):
      slug, name, display_name, eyebrow, tagline, body,
      spec_pairs (list of (label, value)),
      chips (list of str),
      hero (Path),
      logo (Path|None)              — white HUB logo for the navy footer
      url

    Optional:
      display_headline              — overrides `tagline` for the big body
                                      headline if you want them different.
                                      Default: the tagline is reused as the
                                      headline and an italic short subhead
                                      is omitted.
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

    # PDF print boxes — TrimBox = cut line; BleedBox = full media.
    c.setTrimBox((TRIM_LEFT, TRIM_BOTTOM, TRIM_RIGHT, TRIM_TOP))
    c.setBleedBox((0, 0, PAGE_W, PAGE_H))
    c.setCropBox((0, 0, PAGE_W, PAGE_H))

    # 0. Paper — pure white behind everything.
    _fill_page(c, HUBSS_WHITE)

    # 1. Hero photo across the top.
    hero_bottom = _draw_hero_photo(c, product.get("hero"))

    # 2. Slim navy header band — eyebrow + wordmark + orange dash.
    header_bottom = _draw_navy_header(
        c,
        eyebrow=product.get("eyebrow", ""),
        wordmark=product.get("display_name", product.get("name", "")),
        y_top=hero_bottom,
    )

    # 3. White body section — display headline / tagline / body / specs / chips.
    body_top = header_bottom
    body_bottom = TRIM_BOTTOM + NAV_FOOTER_H

    # Body section opens with the tagline as a small italic subhead — the
    # product name is already on the navy header band, so re-stating it as
    # a giant body headline would (a) be redundant and (b) eat ~80pt of
    # vertical space the spec grid + body paragraph need to breathe.
    display_headline = product.get("display_headline") or ""
    sub_tagline = (product.get("display_subhead")
                   or product.get("tagline")
                   or "")

    _draw_body_section(
        c,
        display_headline=display_headline,
        tagline=sub_tagline,
        body=product.get("body", ""),
        spec_pairs=product.get("spec_pairs", []),
        chips=product.get("chips", []),
        y_top=body_top,
        y_bottom=body_bottom,
    )

    # 4. Slim navy footer band — white HUB logo + URL / QR.
    _draw_navy_footer(
        c,
        logo_white_path=product.get("logo"),
        slug=product["slug"],
        url=product["url"],
    )

    # 5. Crop marks.
    _crop_marks(c)

    c.showPage()
    c.save()

    return output_pdf_path
