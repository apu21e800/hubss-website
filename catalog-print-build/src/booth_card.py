"""
HUBSS Booth Connect Card — 4×6" portrait, CMYK, press-ready PDF.

Sits next to the open 6×6 catalogue at the tradeshow booth. Scanning the QR
opens hubss.com/connect (the Linktree-style landing page).

Usage:
    py catalog-print-build/src/booth_card.py

Outputs:
    catalog-print-build/output/HUBSS-Booth-Connect-Card_v01.pdf  (press-ready CMYK)
    public/booth/tabletop-card-preview.webp                       (1200px wide preview)

Specs:
    Trim:    4.00" × 6.00" (portrait)
    Bleed:   0.125" all sides → 4.25" × 6.25" document
    Safe:    0.25" inside trim
    Colors:  CMYK only (uses the same color tokens as specs.py)
"""

from __future__ import annotations

import hashlib
import io
import os
import sys
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import CMYKColor
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

import qrcode
from qrcode.constants import ERROR_CORRECT_H

# Reuse the brand color tokens / type sizes already defined for the catalogue
# so the card and the book read as one family on the tabletop.
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from specs import (  # noqa: E402
    HUBSS_NAVY,
    HUBSS_NAVY_RICH,
    HUBSS_ORANGE,
    HUBSS_WHITE,
    HUBSS_GREY_LIGHT,
    HUBSS_TEXT_ON_DARK,  # not used directly, kept for parity
    FONT_SANS_REG,
    FONT_SANS_BOLD,
)

# ── Geometry ──────────────────────────────────────────────────────────────
TRIM_W = 4.00 * inch
TRIM_H = 6.00 * inch
BLEED  = 0.125 * inch
SAFE   = 0.25 * inch

PAGE_W = TRIM_W + 2 * BLEED   # 4.25"
PAGE_H = TRIM_H + 2 * BLEED   # 6.25"

TRIM_LEFT   = BLEED
TRIM_RIGHT  = BLEED + TRIM_W
TRIM_BOTTOM = BLEED
TRIM_TOP    = BLEED + TRIM_H

SAFE_LEFT   = TRIM_LEFT   + SAFE
SAFE_RIGHT  = TRIM_RIGHT  - SAFE
SAFE_BOTTOM = TRIM_BOTTOM + SAFE
SAFE_TOP    = TRIM_TOP    - SAFE

# ── Paths ─────────────────────────────────────────────────────────────────
PROJECT_ROOT  = HERE.parent.parent   # …/hubss-booth-connect
OUTPUT_DIR    = HERE.parent / "output"
PUBLIC_BOOTH  = PROJECT_ROOT / "public" / "booth"

PDF_PATH      = OUTPUT_DIR / "HUBSS-Booth-Connect-Card_v01.pdf"
PREVIEW_PATH  = PUBLIC_BOOTH / "tabletop-card-preview.webp"

LOGO_PATH     = PROJECT_ROOT / "public" / "images" / "hub-logo-white.png"

# ── Content ───────────────────────────────────────────────────────────────
QR_URL   = "https://hubss.com/connect"
HEADLINE = "Scan to connect with HUBSS."
BULLETS  = [
    "Virtual catalogue",
    "Prize draw entry",
    "Our work",
    "Get in touch",
]
FOOTER_URL = "HUBSS.COM"


# ── QR code rendering ─────────────────────────────────────────────────────
def render_qr_png(url: str, target_px: int = 1200) -> bytes:
    """Render a QR code as 1-bit PNG bytes at high error correction.

    High EC keeps the code scannable even if the printed card gets scuffed
    or smudged at the booth. Border kept tight — we add our own white plate.
    """
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    # Resize to target px (nearest neighbour — keep modules crisp)
    if img.size[0] != target_px:
        img = img.resize((target_px, target_px), Image.NEAREST)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


# ── Helpers ───────────────────────────────────────────────────────────────
def draw_background(c: canvas.Canvas) -> None:
    """Full-bleed deep navy background, matching the catalogue cover family."""
    c.setFillColor(HUBSS_NAVY_RICH)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)


def draw_logo(c: canvas.Canvas) -> None:
    """Logo lockup at the top of the safe area."""
    if not LOGO_PATH.exists():
        return
    img = Image.open(LOGO_PATH)
    aspect = img.size[0] / img.size[1]
    target_h = 0.45 * inch
    target_w = target_h * aspect
    x = (PAGE_W - target_w) / 2
    y = SAFE_TOP - target_h
    c.drawImage(
        str(LOGO_PATH),
        x, y,
        width=target_w, height=target_h,
        mask="auto",
        preserveAspectRatio=True,
    )
    return target_h


def draw_headline(c: canvas.Canvas, baseline_y: float) -> None:
    """Centered short headline."""
    c.setFillColor(HUBSS_WHITE)
    c.setFont(FONT_SANS_BOLD, 18)
    c.drawCentredString(PAGE_W / 2, baseline_y, HEADLINE)


def draw_qr(c: canvas.Canvas, center_y: float, size_in: float = 2.7) -> None:
    """Render the QR code onto a white plate with breathing room."""
    qr_size = size_in * inch
    plate_pad = 0.18 * inch
    plate_size = qr_size + plate_pad * 2
    plate_x = (PAGE_W - plate_size) / 2
    plate_y = center_y - plate_size / 2

    # White plate behind QR — protects scannability over the navy background.
    c.setFillColor(HUBSS_WHITE)
    c.roundRect(plate_x, plate_y, plate_size, plate_size, 8, stroke=0, fill=1)

    qr_png = render_qr_png(QR_URL)
    qr_image = Image.open(io.BytesIO(qr_png))
    # Drop to a temp file so ReportLab can stream it
    tmp_path = OUTPUT_DIR / "_qr_tmp.png"
    qr_image.save(tmp_path, format="PNG")
    try:
        c.drawImage(
            str(tmp_path),
            plate_x + plate_pad,
            plate_y + plate_pad,
            width=qr_size,
            height=qr_size,
            preserveAspectRatio=True,
            mask="auto",
        )
    finally:
        try:
            tmp_path.unlink()
        except OSError:
            pass


def draw_bullets(c: canvas.Canvas, top_y: float) -> None:
    """Two columns of short benefit lines, scannable from 6 feet."""
    c.setFillColor(HUBSS_WHITE)
    c.setFont(FONT_SANS_REG, 10)
    line_gap = 0.32 * inch
    col_gap  = 0.10 * inch

    # Build a 2-col grid centered horizontally.
    col1_x = SAFE_LEFT + 0.10 * inch
    col2_x = PAGE_W / 2 + col_gap
    y0 = top_y
    y1 = top_y - line_gap

    items = [
        (col1_x, y0, BULLETS[0]),
        (col2_x, y0, BULLETS[1]),
        (col1_x, y1, BULLETS[2]),
        (col2_x, y1, BULLETS[3]),
    ]
    for x, y, label in items:
        # Orange dot
        c.setFillColor(HUBSS_ORANGE)
        c.circle(x, y + 3.2, 1.6, stroke=0, fill=1)
        c.setFillColor(HUBSS_WHITE)
        c.setFont(FONT_SANS_REG, 10.5)
        c.drawString(x + 8, y, label)


def draw_footer(c: canvas.Canvas) -> None:
    """Orange brand rule + URL footer inside the safe area."""
    rule_y = SAFE_BOTTOM + 0.30 * inch
    rule_w = 0.6 * inch

    c.setFillColor(HUBSS_ORANGE)
    c.rect((PAGE_W - rule_w) / 2, rule_y, rule_w, 2.0, stroke=0, fill=1)

    c.setFillColor(HUBSS_WHITE)
    c.setFont(FONT_SANS_BOLD, 9)
    # Tracked-out caps via manual letter-spacing
    text = FOOTER_URL
    tracking = 2.4
    width = sum(pdfmetrics.stringWidth(ch, FONT_SANS_BOLD, 9) for ch in text)
    width += tracking * (len(text) - 1)
    x = (PAGE_W - width) / 2
    y = SAFE_BOTTOM + 0.08 * inch
    for ch in text:
        c.drawString(x, y, ch)
        x += pdfmetrics.stringWidth(ch, FONT_SANS_BOLD, 9) + tracking


# ── Main ──────────────────────────────────────────────────────────────────
def build_pdf() -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_BOOTH.mkdir(parents=True, exist_ok=True)

    c = canvas.Canvas(str(PDF_PATH), pagesize=(PAGE_W, PAGE_H))
    c.setTitle("HUBSS Booth Connect Card")
    c.setAuthor("HUB Surface Systems")
    c.setSubject("Tradeshow tabletop QR card → hubss.com/connect")

    # Background
    draw_background(c)

    # Logo at the top
    logo_h = draw_logo(c) or 0
    headline_y = SAFE_TOP - logo_h - 0.45 * inch
    draw_headline(c, headline_y)

    # QR centered vertically a touch above middle
    qr_center_y = PAGE_H * 0.50
    draw_qr(c, qr_center_y, size_in=2.6)

    # Bullets below the QR plate
    bullets_top = qr_center_y - 2.6 * inch / 2 - 0.55 * inch
    draw_bullets(c, bullets_top)

    # Footer
    draw_footer(c)

    c.showPage()
    c.save()
    return PDF_PATH


def render_preview(target_px: int = 1200) -> Path | None:
    """Best-effort 1200px-wide WebP preview for the Vercel deploy.

    Tries pdf2image first (high fidelity, needs poppler). Falls back to a
    direct PIL composite that mirrors the layout for environments without
    poppler installed — the staging preview just needs to convey the look.
    """
    try:
        from pdf2image import convert_from_path  # type: ignore

        pages = convert_from_path(
            str(PDF_PATH),
            dpi=200,
            fmt="png",
            single_file=True,
        )
        if pages:
            img = pages[0]
            ratio = target_px / img.size[0]
            new_size = (target_px, int(img.size[1] * ratio))
            img = img.resize(new_size, Image.LANCZOS)
            img.save(PREVIEW_PATH, "WEBP", quality=88, method=6)
            return PREVIEW_PATH
    except Exception as exc:  # noqa: BLE001
        print(f"[booth_card] pdf2image not available ({exc!r}) — using fallback preview.")

    return _render_fallback_preview(target_px)


def _render_fallback_preview(target_px: int) -> Path | None:
    """PIL-only preview that approximates the press layout.

    This is for the staging deploy only — the press PDF is the source of
    truth. The preview tries to give Vernon a recognisable thumbnail.
    """
    try:
        from PIL import ImageDraw, ImageFont
    except Exception:
        return None

    aspect = TRIM_H / TRIM_W
    w = target_px
    h = int(w * aspect)
    img = Image.new("RGB", (w, h), (12, 18, 32))
    draw = ImageDraw.Draw(img)

    # Headline
    try:
        font_b = ImageFont.truetype("arialbd.ttf", int(h * 0.04))
        font_r = ImageFont.truetype("arial.ttf", int(h * 0.024))
        font_caps = ImageFont.truetype("arialbd.ttf", int(h * 0.022))
    except Exception:
        font_b = ImageFont.load_default()
        font_r = ImageFont.load_default()
        font_caps = ImageFont.load_default()

    # Logo (white) — drop in from public
    try:
        logo = Image.open(LOGO_PATH).convert("RGBA")
        lh = int(h * 0.07)
        lw = int(lh * (logo.size[0] / logo.size[1]))
        logo = logo.resize((lw, lh))
        img.paste(logo, ((w - lw) // 2, int(h * 0.06)), logo)
    except Exception:
        pass

    headline = HEADLINE
    tw = draw.textlength(headline, font=font_b)
    draw.text(((w - tw) / 2, int(h * 0.17)), headline, fill=(255, 255, 255), font=font_b)

    # QR
    qr_png = render_qr_png(QR_URL, target_px=int(w * 0.62))
    qr_img = Image.open(io.BytesIO(qr_png))
    plate_pad = int(w * 0.04)
    plate_size = qr_img.size[0] + plate_pad * 2
    plate_x = (w - plate_size) // 2
    plate_y = int(h * 0.27)
    draw.rounded_rectangle(
        [plate_x, plate_y, plate_x + plate_size, plate_y + plate_size],
        radius=int(w * 0.022),
        fill=(255, 255, 255),
    )
    img.paste(qr_img, (plate_x + plate_pad, plate_y + plate_pad))

    # Bullets
    bullets_y = plate_y + plate_size + int(h * 0.06)
    col_x = [int(w * 0.22), int(w * 0.55)]
    row_y = [bullets_y, bullets_y + int(h * 0.05)]
    items = [
        (col_x[0], row_y[0], BULLETS[0]),
        (col_x[1], row_y[0], BULLETS[1]),
        (col_x[0], row_y[1], BULLETS[2]),
        (col_x[1], row_y[1], BULLETS[3]),
    ]
    for cx, cy, label in items:
        draw.ellipse([cx - 6, cy + 12, cx + 2, cy + 20], fill=(249, 115, 22))
        draw.text((cx + 12, cy + 6), label, fill=(255, 255, 255), font=font_r)

    # Footer rule + URL
    rule_w = int(w * 0.12)
    rule_x = (w - rule_w) // 2
    rule_y = int(h * 0.92)
    draw.rectangle([rule_x, rule_y, rule_x + rule_w, rule_y + 3], fill=(249, 115, 22))
    footer_y = rule_y + int(h * 0.02)
    tw = draw.textlength(FOOTER_URL, font=font_caps)
    draw.text(((w - tw) / 2, footer_y), FOOTER_URL, fill=(255, 255, 255), font=font_caps)

    img.save(PREVIEW_PATH, "WEBP", quality=88, method=6)
    return PREVIEW_PATH


def md5_of(path: Path) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


if __name__ == "__main__":
    pdf = build_pdf()
    preview = render_preview()
    print(f"PDF        -> {pdf}")
    print(f"PDF md5    -> {md5_of(pdf)}")
    print(f"PDF bytes  -> {pdf.stat().st_size}")
    if preview:
        print(f"Preview    -> {preview}")
        print(f"Preview md5-> {md5_of(preview)}")
    else:
        print("Preview    -> (skipped - Pillow font fallback failed)")
    print(f"QR target  -> {QR_URL}")
