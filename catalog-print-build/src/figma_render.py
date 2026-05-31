"""
Figma-driven page renderer.

Takes a structured Figma frame digest (from /tmp/figma_structure.json) plus
an explicit photo mapping, and outputs a single 5x5" CMYK page that mirrors
the Figma layout 1:1.

Coordinate conversion:
  Figma artboard is 450x450 design units.
  Print trim is 5x5" = 360 pt.
  Scale factor SCALE = 360 / 450 = 0.8.
  Document page is 5.25x5.25" = 378 pt (trim + 0.125" bleed each side).
  ReportLab origin is bottom-left; Figma is top-left.

Type (v48):
  Inter is the locked typeface across print + website + Figma plugin.
  TTFs registered by specs.register_inter_fonts() at module import.
  pick_font() maps Figma weight → Inter-Bold (≥600) / SemiBold (≥500)
  / Regular (<500). No Helvetica anywhere. No Light/Thin weights.

Color:
  Figma cream paper -> CMYK_CREAM (light tone). Navy -> HUBSS_NAVY.
  Orange -> HUBSS_ORANGE.
"""
from __future__ import annotations

from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import CMYKColor
from reportlab.pdfbase.pdfmetrics import stringWidth

from .specs import (
    PAGE_W, PAGE_H, BLEED, TRIM_W, TRIM_H,
    HUBSS_ORANGE, HUBSS_NAVY, HUBSS_NAVY_RICH, HUBSS_BLACK, HUBSS_WHITE,
    HUBSS_GREY_DARK, HUBSS_GREY_MID, HUBSS_GREY_LIGHT,
    FONT_SANS_REG, FONT_SANS_BOLD, FONT_SERIF,
)
from .images import draw_image_box

# --- geometry -----------------------------------------------------------
FIGMA_SIZE = 450.0          # Figma design units per side
SCALE = TRIM_W / FIGMA_SIZE  # 360 / 450 = 0.8

# Page-relative origin in PDF coordinates (account for bleed on left/bottom).
# A Figma point at (fx, fy) — top-left origin — maps to:
#   px = BLEED + fx * SCALE
#   py = (BLEED + TRIM_H) - fy * SCALE   # flip vertical
def figma_to_pdf(fx: float, fy: float) -> tuple[float, float]:
    px = BLEED + fx * SCALE
    py = BLEED + TRIM_H - fy * SCALE
    return px, py

def fs(size_figma: float) -> float:
    """Scaled font size in pt."""
    return size_figma * SCALE

# --- colour tokens ------------------------------------------------------
# Cream paper background — slightly warm off-white. Approximates the look
# of the Figma reference renders (RGB ~ #f1ede4 / #ECE6D7).
CMYK_CREAM = CMYKColor(0.02, 0.04, 0.10, 0.02)
CMYK_CREAM_DARKER = CMYKColor(0.03, 0.06, 0.13, 0.04)  # for paper texture/shadow
CMYK_RULE_ORANGE = HUBSS_ORANGE
CMYK_TEXT_DARK = CMYKColor(0.0, 0.0, 0.0, 0.88)     # softer than pure black
CMYK_TEXT_MID = CMYKColor(0.0, 0.0, 0.0, 0.55)
CMYK_TEXT_FAINT = CMYKColor(0.0, 0.0, 0.0, 0.35)


# --- font mapping -------------------------------------------------------
def pick_font(figma_font: str | None, weight: int | None,
              italic: bool = False) -> str:
    """v48 — Map Figma font + weight to embedded Inter TTF.

    Inter family registered in specs.register_inter_fonts().

    Weight buckets — v49 bumps the default body weight from Regular →
    Medium per Vernon ('the font is still thin'). Inter Regular reads
    visibly lighter than Helvetica Regular at small sizes; Medium gives
    body type the weight Doug expects in a premium catalogue without
    going so bold it looks dense. Explicit weights (600/800) keep v48
    semantics so nothing regresses.
       w >= 600 -> Bold       (preserved from v48 — display + caps)
       w >= 500 -> SemiBold
       else     -> Medium     (was Regular — body now visibly heavier)
    Italic flag picks Inter-Italic (or BoldItalic at w≥600).
    """
    from .specs import (
        FONT_SANS_MEDIUM, FONT_SANS_SEMI, FONT_SANS_BOLD,
        FONT_SANS_OBL, FONT_SANS_BOLD_OBL,
    )
    w = weight or 400
    if italic:
        return FONT_SANS_BOLD_OBL if w >= 600 else FONT_SANS_OBL
    if w >= 600:
        return FONT_SANS_BOLD
    if w >= 500:
        return FONT_SANS_SEMI
    return FONT_SANS_MEDIUM   # v49: was FONT_SANS_REG; bumped per Vernon


# --- low-level draw helpers --------------------------------------------
def fill_bleed(c: Canvas, color):
    """Fill the entire bleed page with one colour."""
    c.setFillColor(color)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)


def draw_text_block(
    c: Canvas, text: str, fx: float, fy: float, *,
    font_size_figma: float,
    figma_font: str | None = None,
    weight: int | None = 400,
    color=CMYK_TEXT_DARK,
    align: str = "left",
    max_w_figma: float | None = None,
    leading_figma: float | None = None,
    tracking: float = 0.0,
):
    """
    Draw a text block placed at Figma top-left coordinates (fx, fy).
    `font_size_figma` is the size as found in Figma (we scale internally).
    Wraps when max_w_figma is provided. Returns the bottom y in PDF coords.
    """
    font = pick_font(figma_font, weight)
    size = fs(font_size_figma)
    leading = fs(leading_figma) if leading_figma else size * 1.25
    px, py = figma_to_pdf(fx, fy)
    # Figma's (fx, fy) is the TOP of the text box.  In PDF, we draw text
    # from its baseline.  The baseline of the first line sits `size` below
    # the top edge.
    baseline_y = py - size

    if not max_w_figma or align != "left":
        # Single-line draw — always go through TextObject to lock charSpace
        c.setFillColor(color)
        c.setFont(font, size)
        if True:   # always use TextObject so we can explicitly set charSpace
            t = c.beginText()
            t.setFont(font, size)
            t.setCharSpace(tracking)   # explicit, even when 0 — prevents state leak
            if align == "left":
                t.setTextOrigin(px, baseline_y)
            elif align == "center":
                cx = px + (max_w_figma or 0) * SCALE / 2
                w = stringWidth(text, font, size) + tracking * max(0, len(text) - 1)
                t.setTextOrigin(cx - w/2, baseline_y)
            elif align == "right":
                w = stringWidth(text, font, size) + tracking * max(0, len(text) - 1)
                t.setTextOrigin(px + (max_w_figma or 0) * SCALE - w, baseline_y)
            t.textOut(text)
            c.drawText(t)
        else:
            if align == "left":
                c.drawString(px, baseline_y, text)
            elif align == "center":
                cx = px + (max_w_figma or 0) * SCALE / 2
                c.drawCentredString(cx, baseline_y, text)
            elif align == "right":
                c.drawRightString(px + (max_w_figma or 0) * SCALE, baseline_y, text)
        return baseline_y

    # Word-wrap — measurement must account for tracking (charSpace adds
    # `tracking` pt between every adjacent character pair). Without this,
    # we measure "no tracking" widths but render with tracking, causing
    # text to overflow its measured fit.
    max_w_pt = max_w_figma * SCALE
    # Split on regular ASCII space only — preserve NBSP inside "words" so
    # orphan-prevention bindings (e.g. "Even at\xa0-10\xa0C.") survive.
    words = text.split(" ")
    lines, cur = [], ""
    def measure(s):
        return stringWidth(s, font, size) + tracking * max(0, len(s) - 1)
    for w in words:
        cand = (cur + " " + w).strip()
        if measure(cand) <= max_w_pt:
            cur = cand
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)

    c.setFillColor(color)
    t = c.beginText()
    t.setFont(font, size)
    t.setCharSpace(tracking)  # explicit, even when 0 — prevents state leak
    y = baseline_y
    for ln in lines:
        t.setTextOrigin(px, y)
        t.textOut(ln)
        y -= leading
    c.drawText(t)
    return y + leading


def draw_image_at_figma(c: Canvas, img_path: str, fx: float, fy: float, fw: float, fh: float):
    """Place an image at Figma coords (top-left fx,fy with width/height fw,fh)."""
    px = BLEED + fx * SCALE
    py = BLEED + TRIM_H - (fy + fh) * SCALE   # bottom-left in PDF coords
    w = fw * SCALE
    h = fh * SCALE
    draw_image_box(c, img_path, px, py, w, h, cover=True)


def draw_image_at_figma(c, img_path, fx, fy, fw, fh):
    px = BLEED + fx * SCALE
    py = BLEED + TRIM_H - (fy + fh) * SCALE
    w = fw * SCALE
    h = fh * SCALE
    draw_image_box(c, img_path, px, py, w, h, cover=True)


def draw_full_bleed_image(c, img_path):
    draw_image_box(c, img_path, 0, 0, PAGE_W, PAGE_H, cover=True)


def draw_page_number(c, num, color=CMYK_TEXT_FAINT):
    fx, fy = 222.5, 419.0
    draw_text_block(c, num, fx, fy,
                    font_size_figma=6.5,
                    color=color, align="center",
                    max_w_figma=5)
