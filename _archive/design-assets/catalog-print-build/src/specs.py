"""
Print specifications for the HUB Surface Systems 2026 Catalog.

All units in points (1 inch = 72 points). ReportLab uses points natively.

Trim size: 5" x 5" (square)
Bleed:     0.125" on all sides (1/8")  -> document size 5.25" x 5.25"
Safe area: 0.25" inside trim (text/logos must not cross this line)
Output:    CMYK PDF, 300 DPI raster, vector text + shapes
"""

from reportlab.lib.units import inch
from reportlab.lib.colors import CMYKColor

# ---------------------------------------------------------------------------
# Page geometry
# ---------------------------------------------------------------------------
TRIM_W = 5.0 * inch
TRIM_H = 5.0 * inch

BLEED = 0.125 * inch     # 1/8" bleed on every side
SAFE  = 0.25  * inch     # 1/4" safe area inside trim

PAGE_W = TRIM_W + 2 * BLEED      # 5.25" — actual document size
PAGE_H = TRIM_H + 2 * BLEED      # 5.25"

# Coordinate helpers (origin is bottom-left of the bleed page).
# Anything inside the TRIM box is what gets printed and cut.
TRIM_LEFT   = BLEED
TRIM_RIGHT  = BLEED + TRIM_W
TRIM_BOTTOM = BLEED
TRIM_TOP    = BLEED + TRIM_H

# Anything inside SAFE_BOX is guaranteed not to be cut off.
SAFE_LEFT   = TRIM_LEFT   + SAFE
SAFE_RIGHT  = TRIM_RIGHT  - SAFE
SAFE_BOTTOM = TRIM_BOTTOM + SAFE
SAFE_TOP    = TRIM_TOP    - SAFE
SAFE_W      = SAFE_RIGHT - SAFE_LEFT
SAFE_H      = SAFE_TOP   - SAFE_BOTTOM

PAGE_SIZE = (PAGE_W, PAGE_H)

# ---------------------------------------------------------------------------
# Color tokens (CMYK only — RGB has no place in a print PDF)
# ---------------------------------------------------------------------------
# CMYKColor(c, m, y, k) where each is 0.0–1.0
HUBSS_ORANGE = CMYKColor(0.00, 0.65, 1.00, 0.00)  # bright orange ~ #F97316
HUBSS_BLACK  = CMYKColor(0.00, 0.00, 0.00, 1.00)  # rich pure K
HUBSS_RICH_BLACK = CMYKColor(0.40, 0.30, 0.30, 1.00)  # for large solid black areas
HUBSS_WHITE  = CMYKColor(0.00, 0.00, 0.00, 0.00)
HUBSS_GREY_DARK  = CMYKColor(0.00, 0.00, 0.00, 0.85)
HUBSS_GREY_MID   = CMYKColor(0.00, 0.00, 0.00, 0.55)
HUBSS_GREY_LIGHT = CMYKColor(0.00, 0.00, 0.00, 0.15)

# Deep navy — matches the website hero (rgba 8,13,22). Less harsh than pure black.
# Slight cyan/magenta bias gives the depth that pure K can not.
HUBSS_NAVY        = CMYKColor(0.65, 0.45, 0.20, 0.92)
HUBSS_NAVY_RICH   = CMYKColor(0.70, 0.50, 0.20, 0.95)

# Orange family — bloom uses these stops for the gradient atmosphere
HUBSS_ORANGE_DEEP = CMYKColor(0.00, 0.70, 1.00, 0.05)  # base orange, slightly deeper than primary
HUBSS_ORANGE_BLOOM = CMYKColor(0.00, 0.55, 0.95, 0.00)  # warmer mid stop
HUBSS_GOLD        = CMYKColor(0.00, 0.30, 1.00, 0.00)  # yellow-orange end of gradient

# ---------------------------------------------------------------------------
# Type system
# ---------------------------------------------------------------------------
# Sizes in points. Catalog is small (5x5") so type runs tighter than web.
# Type sizes / leading (line height). Leading is tuned for editorial breathing
# at 5x5" trim — see /PRINT_SPECS.md for typographic rationale.
# Each size has a "leading ratio" relationship with its size — bigger sizes
# get tighter ratios (display ~1.10), body gets generous breath (~1.55).
# Tracking is tuned per size: huge type gets tighter, body gets slight ease.
TYPE = {
    "display":  {"size": 36, "leading": 42, "tracking": -1.0},  # cover headlines, large editorial moments
    "h1":       {"size": 22, "leading": 28, "tracking": -0.4},  # page titles - more vertical breath
    "h2":       {"size": 15, "leading": 21, "tracking": -0.1},  # subheads
    "h3":       {"size": 11, "leading": 16, "tracking":  0.05}, # eyebrows / labels
    "body":     {"size": 10, "leading": 16, "tracking":  0.1},  # body copy - generous editorial leading
    "caption":  {"size":  8, "leading": 13, "tracking":  0.1},  # captions
    "micro":    {"size":  7, "leading": 10, "tracking":  0.25}, # page numbers, legal
}

# Tracking constant for ALL-CAPS — slightly wider than before for true editorial elegance
ALLCAPS_TRACKING = 1.6

# Stronger contrast value for body copy on dark backgrounds — was 15% K, too pale on press
HUBSS_TEXT_ON_DARK = "WHITE_85"  # use 85% white instead of 15% black-tinted grey

# Default font families. We use built-in PDF fonts for portability;
# swap to embedded TTFs later (see fonts.py) for a custom look.
FONT_SANS_REG  = "Helvetica"
FONT_SANS_BOLD = "Helvetica-Bold"
FONT_SANS_OBL  = "Helvetica-Oblique"
FONT_SERIF     = "Times-Roman"

# ---------------------------------------------------------------------------
# Image specs
# ---------------------------------------------------------------------------
TARGET_DPI = 300
# Minimum acceptable DPI before we warn (printers complain below 240).
MIN_DPI_WARN = 240
