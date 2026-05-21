"""
Resolve "IMAGE: ..." placeholders from Figma to actual photo file paths.

The Figma file uses placeholder text like:
   "IMAGE: gallery — OAKVILLE, ON, TrafficPatternsXD"
   "IMAGE: StreetBond — playground hopscotch aerial"
   "IMAGE: TPXD hero — decorative crosswalk brick herringbone pattern"
   "IMAGE: installer — Square One Paving installation work"
   "IMAGE: cover hero — dramatic civic plaza with bold red flowing pathways"

Strategy:
  1. Parse the placeholder string for product hints + descriptor keywords.
  2. Hunt for the best photo:
     a. Try the curated /assets/booklet/ folder (best-of-best, named for content)
     b. Fall back to the per-product folder under /public/images/products/
     c. Last resort: fall back to a hand-picked safe default
  3. Always return a valid Path. If nothing matches, use a fallback so the page
     still renders — never crash.

Usage:
    from src.photo_mapper import resolve
    path = resolve("IMAGE: gallery — OAKVILLE, ON, TrafficPatternsXD")
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS_BOOKLET = ROOT / "assets" / "booklet"
PUBLIC_IMG = ROOT.parent / "public" / "images"
PRODUCTS_DIR = PUBLIC_IMG / "products"
APPS_DIR = PUBLIC_IMG / "applications"

# Keywords -> product folder slug mapping
PRODUCT_KEYWORDS = {
    "trafficpatternsxd": "traffic-patterns-xd",
    "tpxd":              "traffic-patterns-xd",
    "trafficpatterns":   "traffic-patterns",
    "streetbondsr":      "streetbondsr",
    "streetbond sr":     "streetbondsr",
    "streetbond":        "streetbond",
    "streetprint":       "streetprint",
    "decomark":          "decomark",
    "duratherm":         "duratherm",
    "durashield":        "durashield",
    "premark":           "premark",
    "airmark":           "airmark",
    "mmax":              "mmax",
}

# City/location keywords -> hand-picked photo when known
CITY_PHOTOS = {
    "oakville":           ASSETS_BOOKLET / "Intersection installation TPXD 1.png",
    "vaughan":            ASSETS_BOOKLET / "Intersection installation TPXD 1.png",
    "white rock":         ASSETS_BOOKLET / "Whiterock-Pier-Crosswalk-TrafficPatternsXD-1 1.png",
    "ubc":                ASSETS_BOOKLET / "UBC Crosswalk 1.png",
    "musqueam":           ASSETS_BOOKLET / "UBC Crosswalk 1.png",
    "surrey":             ASSETS_BOOKLET / "StreetPrint - Maridian Surrey 1.png",
    "meridian":           ASSETS_BOOKLET / "StreetPrint - Maridian Surrey 1.png",
    "indigenous":         ASSETS_BOOKLET / "aboriginal crosswalk 1.png",
    "sechelt":            ASSETS_BOOKLET / "DecoMark community park 1.png",
    "splash pad":         ASSETS_BOOKLET / "Splash Pad 2.png",
    "splash":             ASSETS_BOOKLET / "Splash Pad 1.png",
    "costco":             ASSETS_BOOKLET / "StreetBonf - Costco 1.png",
    "town home":          ASSETS_BOOKLET / "StreetPrint - town home 1.png",
    "townhome":           ASSETS_BOOKLET / "StreetPrint - town home 1.png",
    "look listen live":   ASSETS_BOOKLET / "Look listen live 1.png",
    "school":             ASSETS_BOOKLET / "Look listen live 1.png",
    "traffic calming":    ASSETS_BOOKLET / "StreetPrint - TrafficCalming, street skirt 1.png",
    "street skirt":       ASSETS_BOOKLET / "StreetPrint - TrafficCalming, street skirt 1.png",
    "rumble":             ASSETS_BOOKLET / "Intergrated Rumble Bars (TrafficPatterns) 1.png",
    "delta":              ASSETS_BOOKLET / "Intergrated Rumble Bars (TrafficPatterns) 1.png",
    "circle":             ASSETS_BOOKLET / "StreetBond Circle Design 1.png",
    "vancouver sidewalk": ASSETS_BOOKLET / "StreetBond - Vancouver sidewalk 1.png",
    "vancouver":          ASSETS_BOOKLET / "StreetBond - Vancouver sidewalk 1.png",
    "duratherm stencil":  ASSETS_BOOKLET / "DuraTherm stecils on asphalt 1.png",
    "duratherm":          ASSETS_BOOKLET / "duratherm1 1.png",
    "decomark":           ASSETS_BOOKLET / "DecoMark community park 1.png",
    "airport":            ASSETS_BOOKLET / "Airport Sports Court 1.png",
    "sport court":        ASSETS_BOOKLET / "school sport court 1.png",
    "court":              ASSETS_BOOKLET / "school sport court 1.png",
    "driveway":           ASSETS_BOOKLET / "StreetPrin Driveway 1.png",
    "fish":               ASSETS_BOOKLET / "HUB Catalogue 2024 (fish) 1.png",
    "walking":            ASSETS_BOOKLET / "HUB Catalogue 2024 (walking) 1.png",
    "ad":                 ASSETS_BOOKLET / "ad 1.png",
}

# Fallback hero photos per product — using the website's curated featured-image
# picks (from lib/featured-images.ts). These are the highest-quality picks for
# each product, validated by the marketing team.
PRODUCT_FALLBACKS = {
    "traffic-patterns-xd": PRODUCTS_DIR / "traffic-patterns-xd" / "traffic-patterns-xd-03.jpg",
    "traffic-patterns":    PRODUCTS_DIR / "traffic-patterns" / "traffic-patterns-08.jpg",
    "streetbond":          PRODUCTS_DIR / "streetbond" / "streetbond-112.jpg",
    "streetbondsr":        PRODUCTS_DIR / "streetbondsr" / "streetbondsr-02.jpg",
    "streetprint":         PRODUCTS_DIR / "streetprint" / "streetprint-40.jpg",
    "decomark":            PRODUCTS_DIR / "decomark" / "decomark-01.jpg",
    "duratherm":           PRODUCTS_DIR / "duratherm" / "duratherm-01.jpg",
    "durashield":          PRODUCTS_DIR / "durashield" / "durashield-04.jpg",
    "premark":             PRODUCTS_DIR / "premark" / "premark-01.jpg",
    "airmark":             PRODUCTS_DIR / "airmark" / "airmark-01.jpg",
    "mmax":                PRODUCTS_DIR / "mmax" / "mmax-05.jpg",
}

# Application-level curated heroes (from the website featured-images data)
APPLICATION_FALLBACKS = {
    "crosswalks":           APPS_DIR / "crosswalks" / "crosswalks-03.jpg",
    "bike-lanes":           APPS_DIR / "bike-lanes" / "bike-lanes-14.jpg",
    "bus-lanes":            APPS_DIR / "bus-lanes" / "bus-lanes-20.jpg",
    "commercial":           APPS_DIR / "commercial-spaces" / "commercial-spaces-01.jpg",
    "community-branding":   APPS_DIR / "community-branding" / "community-branding-08.jpg",
    "parking-lots":         APPS_DIR / "parking-lots" / "parking-lots-01.jpg",
    "parks-paths":          APPS_DIR / "parks-paths" / "parks-paths-01.jpg",
    "playgrounds":          APPS_DIR / "playgrounds" / "playgrounds-01.jpg",
    "residential":          APPS_DIR / "residential-driveways" / "residential-driveways-03.jpg",
    "splash-pads":          APPS_DIR / "splash-pads" / "splash-pads-01.jpg",
    "sport-courts":         APPS_DIR / "sport-courts" / "sport-courts-01.jpg",
    "townhomes":            APPS_DIR / "townhomes" / "townhomes-01.jpg",
    "traffic-calming":      APPS_DIR / "traffic-calming" / "traffic-calming-01.jpg",
    "airports":             APPS_DIR / "airports" / "airports-01.jpg",
    "public-art":           APPS_DIR / "community-branding" / "community-branding-11.jpg",
    "public-spaces":        APPS_DIR / "public-spaces" / "public-spaces-12.png",
}

# Application keyword -> slug
APPLICATION_KEYWORDS = {
    "crosswalk":         "crosswalks",
    "bike lane":         "bike-lanes",
    "cycle":             "bike-lanes",
    "bus lane":          "bus-lanes",
    "brt":               "bus-lanes",
    "transit":           "bus-lanes",
    "commercial space":  "commercial",
    "commercial":        "commercial",
    "community branding": "community-branding",
    "parking lot":       "parking-lots",
    "parking":           "parking-lots",
    "park":              "parks-paths",
    "path":              "parks-paths",
    "playground":        "playgrounds",
    "residential":       "residential",
    "driveway":          "residential",
    "splash pad":        "splash-pads",
    "splash":            "splash-pads",
    "sport court":       "sport-courts",
    "court":             "sport-courts",
    "townhome":          "townhomes",
    "traffic calming":   "traffic-calming",
    "airport":           "airports",
    "runway":            "airports",
    "public art":        "public-art",
    "public space":      "public-spaces",
}

# Last-resort fallback when nothing matches at all
ULTIMATE_FALLBACK = ASSETS_BOOKLET / "Whiterock-Pier-Crosswalk-TrafficPatternsXD-1 1.png"


def _sample_from_folder(folder: Path, prefer_index: int = 0):
    """Return a sample image from a folder; prefers .jpg/.png. None if empty."""
    if not folder.exists():
        return None
    candidates = sorted(
        list(folder.glob("*.jpg")) + list(folder.glob("*.png"))
    )
    candidates = [p for p in candidates if not p.name.startswith(".")]
    if not candidates:
        return None
    return candidates[min(prefer_index, len(candidates) - 1)]


def _find_product(text: str):
    t = text.lower()
    for kw in sorted(PRODUCT_KEYWORDS, key=len, reverse=True):
        if kw in t:
            return PRODUCT_KEYWORDS[kw]
    return None


def _find_city_photo(text: str):
    t = text.lower()
    for kw in sorted(CITY_PHOTOS, key=len, reverse=True):
        if kw in t:
            p = CITY_PHOTOS[kw]
            if p.exists():
                return p
    return None


def _find_application(text: str):
    t = text.lower()
    for kw in sorted(APPLICATION_KEYWORDS, key=len, reverse=True):
        if kw in t:
            return APPLICATION_KEYWORDS[kw]
    return None


_product_use_counts = {}


def resolve(placeholder: str, *, prefer_hero: bool = False):
    text = placeholder or ""
    if not prefer_hero:
        p = _find_city_photo(text)
        if p:
            return p
    product_slug = _find_product(text)
    app_slug = _find_application(text)
    if (prefer_hero or "hero" in text.lower()) and product_slug:
        fb = PRODUCT_FALLBACKS.get(product_slug)
        if fb and fb.exists():
            return fb
    if not product_slug and app_slug:
        fb = APPLICATION_FALLBACKS.get(app_slug)
        if fb and fb.exists():
            return fb
    if product_slug:
        folder = PRODUCTS_DIR / product_slug
        n = _product_use_counts.get(product_slug, 0)
        photo = _sample_from_folder(folder, prefer_index=n)
        _product_use_counts[product_slug] = n + 1
        if photo:
            return photo
        fb = PRODUCT_FALLBACKS.get(product_slug)
        if fb and fb.exists():
            return fb
    if app_slug:
        fb = APPLICATION_FALLBACKS.get(app_slug)
        if fb and fb.exists():
            return fb
    return ULTIMATE_FALLBACK


def reset_rotation():
    _product_use_counts.clear()
