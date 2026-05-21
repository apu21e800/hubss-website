"""
Crop marks, registration marks, and print mark utilities.

Most commercial printers want crop marks even when bleed is set up — they're
the visual indicator of the trim box. We draw thin black hairlines outside
the trim, in the bleed area, so they get cut off in the final piece.
"""

from reportlab.pdfgen.canvas import Canvas
from .specs import (
    PAGE_W, PAGE_H,
    TRIM_LEFT, TRIM_RIGHT, TRIM_BOTTOM, TRIM_TOP,
    BLEED, HUBSS_BLACK, SAFE_LEFT, SAFE_RIGHT, SAFE_BOTTOM, SAFE_TOP,
)

CROPMARK_LEN    = 0.15 * 72   # 0.15" crop marks
CROPMARK_OFFSET = 0.03 * 72   # 0.03" gap from trim edge so marks are clearly outside
HAIRLINE        = 0.25        # 1/4 pt = printer hairline


def draw_crop_marks(c: Canvas) -> None:
    """Draw four corner crop marks just outside the trim box."""
    c.saveState()
    c.setStrokeColor(HUBSS_BLACK)
    c.setLineWidth(HAIRLINE)

    L = TRIM_LEFT
    R = TRIM_RIGHT
    B = TRIM_BOTTOM
    T = TRIM_TOP
    o = CROPMARK_OFFSET
    n = CROPMARK_LEN

    # Bottom-left: horiz mark left of trim, vert mark below trim
    c.line(L - o - n, B, L - o, B)
    c.line(L, B - o - n, L, B - o)
    # Bottom-right
    c.line(R + o, B, R + o + n, B)
    c.line(R, B - o - n, R, B - o)
    # Top-left
    c.line(L - o - n, T, L - o, T)
    c.line(L, T + o, L, T + o + n)
    # Top-right
    c.line(R + o, T, R + o + n, T)
    c.line(R, T + o, R, T + o + n)

    c.restoreState()


def draw_safe_area_guide(c: Canvas) -> None:
    """Magenta dashed safe area outline. ONLY for proof PDFs — strip for press."""
    c.saveState()
    c.setStrokeColorRGB(1, 0, 1)
    c.setDash(2, 2)
    c.setLineWidth(0.4)
    c.rect(SAFE_LEFT, SAFE_BOTTOM,
           SAFE_RIGHT - SAFE_LEFT, SAFE_TOP - SAFE_BOTTOM, stroke=1, fill=0)
    c.restoreState()


def draw_trim_guide(c: Canvas) -> None:
    """Cyan dashed trim outline. Proof-only."""
    c.saveState()
    c.setStrokeColorRGB(0, 1, 1)
    c.setDash(3, 2)
    c.setLineWidth(0.4)
    c.rect(TRIM_LEFT, TRIM_BOTTOM,
           TRIM_RIGHT - TRIM_LEFT, TRIM_TOP - TRIM_BOTTOM, stroke=1, fill=0)
    c.restoreState()


def draw_bleed_fill(c: Canvas, color) -> None:
    """Fill the entire bleed page with a CMYK color (use for full-bleed pages)."""
    c.saveState()
    c.setFillColor(color)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.restoreState()


def add_page_marks(c: Canvas, show_guides: bool = False) -> None:
    """Draw all per-page print marks. Press copy: crop marks only.
    Proof copy (show_guides=True): adds dashed trim + safe-area guides."""
    draw_crop_marks(c)
    if show_guides:
        draw_trim_guide(c)
        draw_safe_area_guide(c)
