"""Three Lunch & Learn redesign mockups for Vernon to pick from (p109).
Run: python -m src.lunch_learn_variants  -> output/LL_VARIANTS.pdf
Reuses the catalogue design system (Inter, orange/navy/white, helpers).
"""
from pathlib import Path
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import CMYKColor

from .specs import (PAGE_SIZE, PAGE_W, PAGE_H, BLEED, TRIM_W, TRIM_H,
                    HUBSS_ORANGE, HUBSS_WHITE, HUBSS_NAVY_RICH)
from .figma_render import (SCALE, figma_to_pdf, fill_bleed, draw_full_bleed_image,
                           draw_text_block, CMYK_TEXT_DARK, CMYK_TEXT_MID)
from .images import draw_image_box

CMYK_ON_DARK_BODY = CMYKColor(0.06, 0.04, 0.0, 0.18)  # light cool grey on navy

ROOT = Path(__file__).resolve().parent.parent
QR = ROOT / "assets" / "hubss-lunch-learn-qr.png"
PHOTO = ROOT.parent / "public" / "images" / "applications" / "crosswalks" / "crosswalks-19.jpg"
OUT = ROOT / "output" / "LL_VARIANTS.pdf"


def caps(c, text, fx, fy, size, color, maxw=394, align="left", tr=2.4):
    draw_text_block(c, text.upper(), fx=fx, fy=fy, font_size_figma=size, weight=600,
                    color=color, tracking=tr, max_w_figma=maxw, align=align)

def dot(c, fx, fy, r=1.4, color=None):
    px, py = figma_to_pdf(fx, fy)
    c.setFillColor(color or HUBSS_ORANGE); c.circle(px, py, r*SCALE, stroke=0, fill=1)

def rule(c, fx, fy, w, color, wt=2.0):
    px, py = figma_to_pdf(fx, fy); c.setFillColor(color); c.rect(px, py, w*SCALE, wt, stroke=0, fill=1)

def cta_pill(c, fx, fy, w, h, label, fill=HUBSS_ORANGE, txt=HUBSS_WHITE):
    px, py = figma_to_pdf(fx, fy + h)
    c.setFillColor(fill); c.roundRect(px, py, w*SCALE, h*SCALE, 4*SCALE, stroke=0, fill=1)
    draw_text_block(c, label, fx=fx, fy=fy + h/2 - 4.5, font_size_figma=8.5, weight=800,
                    color=txt, tracking=1.4, max_w_figma=w, align="center")

def qr(c, fx, fy, side):
    if QR.exists():
        px = BLEED + fx*SCALE; py = BLEED + TRIM_H - (fy+side)*SCALE
        draw_image_box(c, str(QR), px, py, side*SCALE, side*SCALE, cover=False, convert_to_cmyk=False)

VALUES = ["Tailored to your live and upcoming projects",
          "CE-credit continuing education for your team",
          "In person across Canada, or virtual — your call"]

def value_list(c, fx, fy, color_dot, color_text, gap=22, size=9.5, maxw=250):
    """Dynamic spacing — measures wraps, so bullets never collide (current bug)."""
    y = fy
    for v in VALUES:
        dot(c, fx, y+4, r=1.5, color=color_dot)
        draw_text_block(c, v, fx=fx+12, fy=y, font_size_figma=size, weight=600,
                        color=color_text, max_w_figma=maxw, leading_figma=13)
        lines = 1 + (1 if len(v) > 36 else 0)
        y += gap + (8 if lines > 1 else 0)


# ---- VARIANT 1: type-led editorial, no mascot, fixed bullets --------------
def v1(c):
    fill_bleed(c, HUBSS_WHITE)
    caps(c, "Lunch & Learn", 30, 58, 7.0, HUBSS_ORANGE)
    draw_text_block(c, "Lunch is on us.", fx=30, fy=82, font_size_figma=40, weight=800,
                    color=CMYK_TEXT_DARK, tracking=-1.2, max_w_figma=390, leading_figma=44)
    draw_text_block(c, "Your spec is free.", fx=30, fy=130, font_size_figma=40, weight=800,
                    color=HUBSS_ORANGE, tracking=-1.2, max_w_figma=390, leading_figma=44)
    draw_text_block(c, "Forty-five minutes of technical depth, real project "
                    "walkthroughs, and CE-credit education — over lunch, in your office.",
                    fx=30, fy=200, font_size_figma=11, color=CMYK_TEXT_DARK,
                    max_w_figma=300, leading_figma=17)
    value_list(c, 30, 262, HUBSS_ORANGE, CMYK_TEXT_DARK, maxw=300)
    # CTA + QR card bottom-right
    qr(c, 322, 250, 96)
    caps(c, "Scan to book", 322, 352, 6.0, CMYK_TEXT_MID, maxw=96, align="center")
    rule(c, 30, 392, 40, HUBSS_ORANGE, wt=2.5)
    draw_text_block(c, "hubss.com/lunch-learn", fx=30, fy=404, font_size_figma=18,
                    weight=800, color=HUBSS_ORANGE, tracking=-0.4, max_w_figma=390)
    caps(c, "Cleve Stordy  ·  604.309.8212", 30, 432, 6.0, CMYK_TEXT_MID, maxw=200, tr=0.6)
    caps(c, "Doug Bain  ·  416.540.9287", 240, 432, 6.0, CMYK_TEXT_MID, maxw=180, align="right", tr=0.6)


# ---- VARIANT 2: split asymmetric, image-forward ---------------------------
def v2(c):
    fill_bleed(c, HUBSS_WHITE)
    # Top ~48% full-bleed photo
    if PHOTO.exists():
        draw_image_box(c, str(PHOTO), 0, BLEED + TRIM_H - 215*SCALE, PAGE_W, 215*SCALE + BLEED, cover=True)
    caps(c, "Lunch & Learn", 30, 238, 7.0, HUBSS_ORANGE)
    draw_text_block(c, "Lunch is on us. Your spec is free.", fx=30, fy=260,
                    font_size_figma=26, weight=800, color=CMYK_TEXT_DARK, tracking=-0.8,
                    max_w_figma=390, leading_figma=30)
    draw_text_block(c, "Forty-five minutes of technical depth and CE-credit education — "
                    "over lunch, in your office.", fx=30, fy=312, font_size_figma=10,
                    color=CMYK_TEXT_MID, max_w_figma=260, leading_figma=15)
    value_list(c, 30, 350, HUBSS_ORANGE, CMYK_TEXT_DARK, maxw=250, size=9)
    qr(c, 322, 300, 84)
    caps(c, "Scan to book", 322, 388, 5.5, CMYK_TEXT_MID, maxw=84, align="center")
    cta_pill(c, 322, 408, 96, 22, "BOOK NOW")
    caps(c, "hubss.com/lunch-learn  ·  604.309.8212  ·  416.540.9287",
         30, 436, 5.5, CMYK_TEXT_MID, maxw=280, tr=0.6)


# ---- VARIANT 3: navy invitation (premium/formal) --------------------------
def v3(c):
    fill_bleed(c, HUBSS_NAVY_RICH)
    rule(c, 30, 56, 32, HUBSS_ORANGE, wt=2.5)
    caps(c, "An Invitation", 30, 66, 7.0, HUBSS_ORANGE)
    draw_text_block(c, "Lunch is on us.", fx=30, fy=90, font_size_figma=42, weight=800,
                    color=HUBSS_WHITE, tracking=-1.2, max_w_figma=390, leading_figma=46)
    draw_text_block(c, "Your spec is free.", fx=30, fy=140, font_size_figma=42, weight=800,
                    color=HUBSS_ORANGE, tracking=-1.2, max_w_figma=390, leading_figma=46)
    draw_text_block(c, "Forty-five minutes of technical depth, real project walkthroughs, "
                    "and CE-credit education — brought to your office over lunch.",
                    fx=30, fy=212, font_size_figma=11, color=CMYK_ON_DARK_BODY,
                    max_w_figma=300, leading_figma=17)
    value_list(c, 30, 274, HUBSS_ORANGE, HUBSS_WHITE, maxw=300)
    qr(c, 322, 262, 96)  # QR on its own; white plate drawn under it
    px, py = figma_to_pdf(318, 362); c.setFillColor(HUBSS_WHITE); c.rect(px, py, 104*SCALE, 104*SCALE, stroke=0, fill=1)
    qr(c, 322, 266, 96)
    caps(c, "Scan to book", 322, 368, 6.0, CMYK_ON_DARK_BODY, maxw=96, align="center")
    cta_pill(c, 30, 372, 180, 24, "BOOK NOW  ·  hubss.com/lnl")
    caps(c, "Cleve 604.309.8212   ·   Doug 416.540.9287", 30, 416, 6.0, CMYK_ON_DARK_BODY, maxw=300, tr=0.6)


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = Canvas(str(OUT), pagesize=PAGE_SIZE)
    for fn in (v1, v2, v3):
        fn(c); c.showPage()
    c.save(); return OUT


if __name__ == "__main__":
    print("wrote", build())
