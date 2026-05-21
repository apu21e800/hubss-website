"""
Lightweight typesetting helpers for ReportLab Canvas.

ReportLab's high-level Platypus flow engine is fine for long text but heavy
for short blocks. For a catalog with mostly fixed copy in fixed boxes,
direct canvas drawing is faster and gives us pixel-precise control.
"""

from reportlab.pdfgen.canvas import Canvas
from reportlab.pdfbase.pdfmetrics import stringWidth

from .specs import TYPE, FONT_SANS_REG, FONT_SANS_BOLD


def draw_text(
    c: Canvas, text: str, x: float, y: float,
    *,
    style: str = "body",
    font: str = FONT_SANS_REG,
    color=None,
    align: str = "left",
):
    """Draw a single line of text at (x, y) using a named type style."""
    spec = TYPE[style]
    c.setFont(font, spec["size"])
    if color is not None:
        c.setFillColor(color)
    if align == "left":
        c.drawString(x, y, text)
    elif align == "right":
        c.drawRightString(x, y, text)
    elif align == "center":
        c.drawCentredString(x, y, text)


def _wrap_lines(text, font, size, max_w):
    """Word-wrap; falls back to character-wrap for words longer than max_w."""
    words = text.split()
    lines = []
    current = ""
    for w in words:
        candidate = (current + " " + w).strip()
        if stringWidth(candidate, font, size) <= max_w:
            current = candidate
            continue
        if current:
            lines.append(current)
            current = ""
        # word itself may exceed max_w; break it
        if stringWidth(w, font, size) <= max_w:
            current = w
        else:
            buf = ""
            for ch in w:
                if stringWidth(buf + ch, font, size) <= max_w:
                    buf += ch
                else:
                    lines.append(buf)
                    buf = ch
            current = buf
    if current:
        lines.append(current)
    return lines


def draw_paragraph(
    c: Canvas, text: str,
    x: float, y_top: float, max_w: float,
    *,
    style: str = "body",
    font: str = FONT_SANS_REG,
    color=None,
    max_lines=None,
    tracking=None,
):
    """
    Word-wrap `text` into a column of width `max_w`, drawing top-down from y_top.
    Returns the y-coordinate of the baseline of the last line drawn.
    Truncates with an ellipsis if max_lines is exceeded.

    Tracking (letter-spacing) defaults to the value in TYPE[style] but can be
    overridden per call. Values are in points; positive opens text out,
    negative tightens it (used for big display type).
    """
    spec = TYPE[style]
    size = spec["size"]
    leading = spec["leading"]
    if tracking is None:
        tracking = spec.get("tracking", 0.0)
    if color is not None:
        c.setFillColor(color)

    lines = _wrap_lines(text, font, size, max_w)

    if max_lines is not None and len(lines) > max_lines:
        lines = lines[:max_lines]
        last = lines[-1]
        while last and stringWidth(last + "...", font, size) > max_w:
            last = last[:-1].rstrip()
        lines[-1] = last + "..."

    # Use a TextObject so we can apply tracking (charSpace) — public API
    text_obj = c.beginText()
    text_obj.setFont(font, size)
    text_obj.setCharSpace(tracking)
    y = y_top - size
    for line in lines:
        text_obj.setTextOrigin(x, y)
        text_obj.textOut(line)
        y -= leading
    c.drawText(text_obj)
    return y + leading


def measure_paragraph(text, max_w, style="body", font=FONT_SANS_REG):
    """Return (line_count, total_height_pt) without drawing."""
    spec = TYPE[style]
    size = spec["size"]
    leading = spec["leading"]
    lin