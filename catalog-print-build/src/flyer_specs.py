"""
Print specifications for the HUBSS product-flyers — 8.5×11" letter portrait,
single-sided, full-bleed, CMYK.

v46 brand alignment:
- NO cream paper. White body. Navy header + footer bands only.
- WHITE-text HUBSS wordmark on the navy bands.
- Helvetica-Oblique replaces serif everywhere — NO serif in the system.
- Orange is quiet punctuation (eyebrow + short dash + rule + URL caps).
- Magazine-grade hierarchy: full-bleed hero photo, generous whitespace.

Units: points (72 / inch). ReportLab origin = bottom-left of the bleed page.
"""

from reportlab.lib.units import inch

# Re-export the catalogue's brand tokens unchanged — colours and TYPE dict
# are the brand language and stay shared.
# NOTE: FONT_SERIF still exists in specs.py for legacy reasons but v46
# explicitly forbids serif anywhere. Use FONT_SANS_OBL for italic emphasis.
from .specs import (  # noqa: F401
    HUBSS_ORANGE, HUBSS_BLACK, HUBSS_RICH_BLACK, HUBSS_WHITE,
    HUBSS_GREY_DARK, HUBSS_GREY_MID, HUBSS_GREY_LIGHT,
    HUBSS_NAVY, HUBSS_NAVY_RICH,
    HUBSS_ORANGE_DEEP, HUBSS_ORANGE_BLOOM, HUBSS_GOLD,
    TYPE, ALLCAPS_TRACKING,
    FONT_SANS_REG, FONT_SANS_BOLD, FONT_SANS_OBL,
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

# Outer margin — 0.55" inside the trim. Magazine-grade breath.
MARGIN = 0.55 * inch
CONTENT_LEFT   = TRIM_LEFT   + MARGIN
CONTENT_RIGHT  = TRIM_RIGHT  - MARGIN
CONTENT_W      = CONTENT_RIGHT - CONTENT_LEFT

# ---------------------------------------------------------------------------
# Vertical zones — measured top-down.
# ---------------------------------------------------------------------------
# Hero photo — top ~41% of trim (4.5" of 11"). Full-bleed.
# Magazine-grade: hero feels confident but leaves real editorial breath
# below for the tagline + body + specs + chips without crashing.
HERO_H = 4.50 * inch

# Slim navy header band — sits directly below the hero, holds the wordmark.
NAV_HEADER_H = 1.35 * inch

# Slim navy footer band — holds the HUB logo, URL, and QR.
NAV_FOOTER_H = 0.95 * inch

# Legacy aliases (kept for build-driver compatibility — driver imports BANNER_H
# only via TRIM_*/PAGE_* constants, but we re-export for safety).
BANNER_H = NAV_HEADER_H
FOOTER_H = NAV_FOOTER_H

# ---------------------------------------------------------------------------
# QR code geometry — modest, with white plate (legible on navy footer).
# ---------------------------------------------------------------------------
QR_SIZE = 0.78 * inch
QR_PAD  = 0.08 * inch       # white plate inset around the QR matrix
QR_CORNER_R = 0.04 * inch   # ~3mm corner radius on the white plate

# ---------------------------------------------------------------------------
# v46 colour palette — WHITE paper, NAVY accent bands, ORANGE punctuation.
# ---------------------------------------------------------------------------
from reportlab.lib.colors import CMYKColor  # noqa: E402

# Body text on white paper
CMYK_TEXT_DARK     = CMYKColor(0.00, 0.00, 0.00, 0.88)  # body / display
CMYK_TEXT_MID      = CMYKColor(0.00, 0.00, 0.00, 0.55)  # subhead / tagline
CMYK_TEXT_FAINT    = CMYKColor(0.00, 0.00, 0.00, 0.35)  # spec labels, captions
CMYK_RULE_FAINT    = CMYKColor(0.00, 0.00, 0.00, 0.18)  # hairline dividers

# Text on navy band
CMYK_ON_DARK_BODY  = CMYKColor(0.00, 0.00, 0.00, 0.04)  # bright white
CMYK_ON_DARK_MID   = CMYKColor(0.00, 0.00, 0.00, 0.30)  # quiet on navy

# Legacy alias kept so any stray import name still resolves to *something*
# (intentionally re-defined as white so accidental fills won't paint cream).
CMYK_CREAM         = HUBSS_WHITE
CMYK_CREAM_DARKER  = HUBSS_WHITE
