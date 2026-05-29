"""
Print specifications for the HUBSS product-flyers — 8.5×11" letter portrait,
single-sided, full-bleed, CMYK.

This file is a 1:1 companion to specs.py (which is locked at 5×5" for the
catalogue). It re-exports the catalogue's colour + type tokens so flyer code
and catalogue code share one visual language — only geometry is different.

Units: points (72 / inch). ReportLab origin = bottom-left of the bleed page.
"""

from reportlab.lib.units import inch

# Re-export the catalogue's brand tokens unchanged — colours and TYPE dict
# are the brand language and stay shared.
from .specs import (  # noqa: F401
    HUBSS_ORANGE, HUBSS_BLACK, HUBSS_RICH_BLACK, HUBSS_WHITE,
    HUBSS_GREY_DARK, HUBSS_GREY_MID, HUBSS_GREY_LIGHT,
    HUBSS_NAVY, HUBSS_NAVY_RICH,
    HUBSS_ORANGE_DEEP, HUBSS_ORANGE_BLOOM, HUBSS_GOLD,
    TYPE, ALLCAPS_TRACKING,
    FONT_SANS_REG, FONT_SANS_BOLD, FONT_SANS_OBL, FONT_SERIF,
    TARGET_DPI, MIN_DPI_WARN,
)

# ---------------------------------------------------------------------------
# Page geometry — 8.5×11" letter portrait, 0.125" bleed on every side.
# ---------------------------------------------------------------------------
TRIM_W = 8.5 * inch
TRIM_H = 11.0 * inch

BLEED = 0.125 * inch                # 1/8" production bleed
SAFE  = 0.375 * inch                # 3/8" generous safe area inside trim

PAGE_W = TRIM_W + 2 * BLEED         # 8.75"
PAGE_H = TRIM_H + 2 * BLEED         # 11.25"

PAGE_SIZE = (PAGE_W, PAGE_H)

# Trim box (the cut line) in PDF coordinates.
TRIM_LEFT   = BLEED
TRIM_RIGHT  = BLEED + TRIM_W
TRIM_BOTTOM = BLEED
TRIM_TOP    = BLEED + TRIM_H

# Safe box — content inside this is guaranteed not to be cut.
SAFE_LEFT   = TRIM_LEFT   + SAFE
SAFE_RIGHT  = TRIM_RIGHT  - SAFE
SAFE_BOTTOM = TRIM_BOTTOM + SAFE
SAFE_TOP    = TRIM_TOP    - SAFE
SAFE_W      = SAFE_RIGHT - SAFE_LEFT
SAFE_H      = SAFE_TOP   - SAFE_BOTTOM

# Outer margin (the calmer-than-safe inset where most body content lives).
# Sits 0.5" inside the trim — gives premium breathing room.
MARGIN = 0.5 * inch
CONTENT_LEFT   = TRIM_LEFT   + MARGIN
CONTENT_RIGHT  = TRIM_RIGHT  - MARGIN
CONTENT_W      = CONTENT_RIGHT - CONTENT_LEFT

# ---------------------------------------------------------------------------
# Vertical zones — measured top-down so they read as the layout reads.
# Numbers are in inches; converted to points at point-of-use.
# ---------------------------------------------------------------------------
HERO_H = 4.05 * inch        # ~35% of 11" — full-bleed photograph
BANNER_H = 1.45 * inch      # cream banner band with eyebrow + display name

# Bottom utility band (orange rule + © caption)
FOOTER_H = 0.35 * inch

# ---------------------------------------------------------------------------
# QR code geometry — modest, with white plate.
# ---------------------------------------------------------------------------
QR_SIZE = 0.95 * inch
QR_PAD  = 0.10 * inch       # white plate inset around the QR matrix

# ---------------------------------------------------------------------------
# Cream paper tone — matches the catalogue's cream banner.
# ---------------------------------------------------------------------------
from reportlab.lib.colors import CMYKColor  # noqa: E402

CMYK_CREAM         = CMYKColor(0.02, 0.04, 0.10, 0.02)
CMYK_CREAM_DARKER  = CMYKColor(0.03, 0.06, 0.13, 0.04)
CMYK_TEXT_DARK     = CMYKColor(0.00, 0.00, 0.00, 0.88)
CMYK_TEXT_MID      = CMYKColor(0.00, 0.00, 0.00, 0.55)
CMYK_TEXT_FAINT    = CMYKColor(0.00, 0.00, 0.00, 0.35)
CMYK_RULE_FAINT    = CMYKColor(0.00, 0.00, 0.00, 0.18)
