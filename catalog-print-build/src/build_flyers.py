"""
Driver: build 14 HUBSS product flyers + web previews + social share cards.

Data flow:
  1. Source content is taken from catalog_content.py PRODUCTS when present
     (these are the canonical, edited copy blocks used in v43).
  2. For the four products NOT in catalog_content.py — streetbondsr,
     chipfill, aggrefill, fast-patch — and for any field missing from a
     catalogue entry, we fall back to lib/products.ts (parsed with a small
     ad-hoc TypeScript-to-Python reader).
  3. Application slugs from products.ts -> human chip labels via a small
     in-file mapping. We cross-reference both sources so nothing is silent.

Outputs (per slug):
  catalog-print-build/output/flyers/HUBSS-Flyer-<slug>-v01.pdf
  public/resources/flyers/<slug>-preview.webp   (1200 wide, RGB)
  public/resources/flyers/<slug>-share.jpg      (1200x630 social card)

Plus:
  catalog-print-build/flyers/manifest.json
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

from . import catalog_content as CC
from . import original_content as OC
from .product_flyer import build_flyer
from .flyer_specs import (
    TRIM_W, TRIM_H, PAGE_W, PAGE_H,
)


# ---------------------------------------------------------------------------
# Filesystem roots
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
PROJECT_ROOT = ROOT.parent
LIB_PRODUCTS_TS = PROJECT_ROOT / "lib" / "products.ts"
PUBLIC_IMG = PROJECT_ROOT / "public" / "images"
PUBLIC_RESOURCES_FLYERS = PROJECT_ROOT / "public" / "resources" / "flyers"
PDF_OUT = ROOT / "output" / "flyers"
MANIFEST_OUT = ROOT / "flyers" / "manifest.json"

# v46: white HUB wordmark, drawn on the navy footer band.
# Vernon's brief: "WHITE-TEXT HUBSS logo". Lives at public/images/hub-logo-white.png.
HUBSS_LOGO_WHITE = PUBLIC_IMG / "hub-logo-white.png"
HUBSS_LOGO_COLOR = PUBLIC_IMG / "assets" / "logos" / "hubss-logos" / "hubss-logo-color.png"


# ---------------------------------------------------------------------------
# Slug list — canonical order requested for delivery
# ---------------------------------------------------------------------------
CATALOGUE_SLUGS = [
    "traffic-patterns-xd",
    "traffic-patterns",
    "streetbond",
    "streetprint",
    "decomark",
    "mmax",
    "streetbondsr",
    "duratherm",
    "durashield",
    "airmark",
    "premark",
]

REPAIR_SLUGS = [
    "chipfill",
    "aggrefill",
    "fast-patch",
]

ALL_SLUGS = CATALOGUE_SLUGS + REPAIR_SLUGS

# Hardcoded fallback for the three repair products — mirrors lib/products.ts
# verbatim. Lives here because the regex-based loader of lib/products.ts
# misfires on the current file shape; rather than rewrite the parser tonight,
# the repair-line data lives inline so flyers populate correctly.
_REPAIR_PRODUCTS_HARDCODED: dict[str, dict[str, Any]] = {
    "chipfill": {
        "slug": "chipfill",
        "name": "ChipFill",
        "short_desc": "Heat-activated preformed material for permanent pothole repair. Year-round, all-weather.",
        "description": (
            "ChipFill is a heat-activated preformed pothole repair material engineered for permanent "
            "restoration of road surface damage. The material is laid into the prepared excavation "
            "and activated with a propane heat torch — no specialized equipment, no hot-mix plant, "
            "no aggregate batching. Once heated, ChipFill conforms to the contours of the damage "
            "and bonds chemically to the surrounding asphalt or concrete, sealing the substrate "
            "from the water intrusion that accelerates freeze-thaw damage. Deployable year-round "
            "regardless of temperature or weather conditions."
        ),
        "image_url": "/images/products/chipfill/chipfill-road-repair.webp",
        "eyebrow": "Concrete and Asphalt Repair",
        "specs": [
            ("Type", "Heat-activated preformed material"),
            ("Application", "Heat torch — no specialized equipment"),
            ("Substrate", "Asphalt and concrete"),
            ("Weather", "Year-round, all-conditions"),
            ("Cure", "Rapid set — minutes to reopen"),
            ("Use Case", "Smaller potholes, cracks, joints"),
        ],
        "related_applications": [
            "parking-lots", "private-driveways", "residential-driveways",
            "parks-paths", "commercial-spaces", "townhomes",
        ],
    },
    "aggrefill": {
        "slug": "aggrefill",
        "name": "AggreFill",
        "short_desc": "Pre-coated aggregate filler for larger potholes up to 1 m². Combined with ChipFill for permanent repair.",
        "description": (
            "AggreFill is a pre-coated aggregate filler used in combination with ChipFill to "
            "permanently repair larger potholes — up to approximately 1 m² in diameter. Where "
            "the damage is too deep for a stand-alone material, AggreFill provides the structural "
            "mass to fill the void; ChipFill bonds the aggregate matrix and seals the surface. "
            "The combined system applies cold then receives a heat torch finish, bonding "
            "chemically to the surrounding substrate and returning the lane to traffic within "
            "minutes. Year-round deployment regardless of weather or season."
        ),
        "image_url": "/images/products/aggrefill/aggrefill-02.jpg",
        "eyebrow": "Concrete and Asphalt Repair",
        "specs": [
            ("Type", "Pre-coated aggregate filler"),
            ("Application", "Cold aggregate + heat-torch ChipFill matrix"),
            ("Substrate", "Asphalt and concrete"),
            ("Repair Size", "Larger damages — up to ~1 m²"),
            ("Cure", "Rapid set — minutes to reopen"),
            ("Weather", "Year-round, all-conditions"),
        ],
        "related_applications": [
            "parking-lots", "private-driveways", "residential-driveways",
            "parks-paths", "commercial-spaces", "townhomes",
        ],
    },
    "fast-patch": {
        "slug": "fast-patch",
        "name": "Fast Patch DPR",
        "short_desc": "Cold-mix polymer repair for potholes, spalls, and utility cuts. Back in service in under an hour.",
        "description": (
            "Fast Patch DPR is an easy-to-apply distressed pavement repair material for asphalt "
            "and concrete — a polymer blend of recycled and renewable materials engineered for "
            "high-strength, fast-return-to-service repair of potholes, spalls, joints, wheel "
            "paths, and utility cuts. Clean the area, apply the material, compact, and the "
            "repaired surface is back in service in under 45 minutes. Bonds chemically to the "
            "surrounding substrate with excellent freeze-thaw resistance. Completely odourless — "
            "suitable for indoor environments including warehouse floors and underground parkades."
        ),
        "image_url": "/images/products/fast-patch/fastpatch-repaired.jpg",
        "eyebrow": "Concrete and Asphalt Repair",
        "specs": [
            ("Type", "Polymer-blend pavement repair"),
            ("Composition", "Recycled + renewable polymer matrix"),
            ("Cure Time", "Return to service in <45 minutes"),
            ("Cold Weather", "Fast Patch Kicker accelerator compatible"),
            ("Substrate", "Asphalt and concrete"),
            ("Odour", "Odourless — indoor-suitable"),
        ],
        "related_applications": [
            "parking-lots", "private-driveways", "residential-driveways",
            "parks-paths", "commercial-spaces", "townhomes",
        ],
    },
}


# ---------------------------------------------------------------------------
# Application slug -> human label (for the chip line).
# Authored to match the labels used across hubss.com nav + the catalogue.
# ---------------------------------------------------------------------------
APPLICATION_LABELS: dict[str, str] = {
    "crosswalks": "Crosswalks",
    "bus-lanes": "Bus Lanes",
    "bike-lanes": "Bike Lanes",
    "pedestrian-safety": "Pedestrian Safety",
    "public-spaces": "Public Spaces",
    "traffic-calming": "Traffic Calming",
    "parks-paths": "Parks & Paths",
    "playgrounds": "Playgrounds",
    "parking-lots": "Parking Lots",
    "private-driveways": "Driveways",
    "residential-driveways": "Driveways",
    "sport-courts": "Sport Courts",
    "splash-pads": "Splash Pads",
    "community-branding": "Community Branding",
    "public-art": "Public Art",
    "regulatory-markings": "Regulatory",
    "leed-urban-heat-island": "LEED / Heat Island",
    "commercial-spaces": "Commercial",
    "townhomes": "Townhomes",
    "airports": "Airfields",
}


# ---------------------------------------------------------------------------
# Slug-driven eyebrow + display-name overrides.
# - Eyebrow keeps the v43 voice ("DECORATIVE PAVEMENT", repair line, etc).
# - display_name normalizes brand spelling (e.g. PreMark, MMAX) on the flyer.
# ---------------------------------------------------------------------------
EYEBROW_OVERRIDES: dict[str, str] = {
    "traffic-patterns-xd":   "Decorative Pavement",
    "traffic-patterns":      "Decorative Pavement",
    "streetbond":            "Decorative Pavement",
    "streetprint":           "Decorative Pavement",
    "decomark":              "Decorative Pavement",
    "mmax":                  "Coloured Lane Treatment",
    "streetbondsr":          "Solar Reflective Coating",
    "duratherm":             "Inlaid Pavement Marking",
    "durashield":            "Pavement Maintenance Coating",
    "airmark":               "Airfield Pavement Marking",
    "premark":               "Regulatory Pavement Marking",
    # repair line
    "chipfill":              "Concrete and Asphalt Repair",
    "aggrefill":             "Concrete and Asphalt Repair",
    "fast-patch":            "Concrete and Asphalt Repair",
}


# ---------------------------------------------------------------------------
# lib/products.ts loader — minimal, regex-driven. Pulls the fields we need
# (name, slug, shortDesc, description, imageUrl, specs, relatedApplications,
# eyebrow). Avoids requiring node/tsc.
# ---------------------------------------------------------------------------
def _read_lib_products() -> dict[str, dict[str, Any]]:
    text = LIB_PRODUCTS_TS.read_text(encoding="utf-8")
    # Split the products array on top-level "{" boundaries inside `products = [...]`.
    array_match = re.search(r"export const products: Product\[\] = \[(.*)\];\s*$",
                            text, re.DOTALL | re.MULTILINE)
    if not array_match:
        # Fallback: find the bracketed array starting at products: Product[] = [
        idx = text.find("export const products: Product[] = [")
        body = text[idx:]
    else:
        body = array_match.group(1)

    # Walk the body and collect top-level {...} blocks.
    products: list[str] = []
    depth = 0
    start = -1
    in_str = False
    str_ch = ""
    i = 0
    while i < len(body):
        ch = body[i]
        if in_str:
            if ch == "\\":
                i += 2
                continue
            if ch == str_ch:
                in_str = False
        else:
            if ch in ('"', "'", "`"):
                in_str = True
                str_ch = ch
            elif ch == "{":
                if depth == 0:
                    start = i
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0 and start >= 0:
                    products.append(body[start:i + 1])
                    start = -1
        i += 1

    out: dict[str, dict[str, Any]] = {}
    for block in products:
        slug_m = re.search(r'slug:\s*"([^"]+)"', block)
        if not slug_m:
            continue
        slug = slug_m.group(1)
        out[slug] = {
            "slug": slug,
            "name": _ts_str(block, "name"),
            "short_desc": _ts_str(block, "shortDesc"),
            "description": _ts_str(block, "description"),
            "image_url": _ts_str(block, "imageUrl"),
            "eyebrow": _ts_str(block, "eyebrow"),
            "specs": _ts_specs(block),
            "related_applications": _ts_string_array(block, "relatedApplications"),
        }
    return out


def _ts_str(block: str, field: str) -> str | None:
    # Match either "..." or '...' literal forms. Description blocks can use
    # smart quotes inside, but the outer wrapper is straight quotes.
    m = re.search(rf'{field}:\s*"((?:[^"\\]|\\.)*)"', block)
    if not m:
        m = re.search(rf"{field}:\s*'((?:[^'\\]|\\.)*)'", block)
    if not m:
        return None
    return m.group(1).replace('\\"', '"').replace("\\'", "'")


def _ts_specs(block: str) -> list[tuple[str, str]]:
    m = re.search(r"specs:\s*\[(.*?)\],\s*(?:related|colourCollections|brandLogo|//|\w)",
                  block, re.DOTALL)
    if not m:
        return []
    inner = m.group(1)
    pairs: list[tuple[str, str]] = []
    for entry in re.finditer(
        r'\{\s*label:\s*"([^"]*)"\s*,\s*value:\s*"((?:[^"\\]|\\.)*)"\s*\}', inner
    ):
        label = entry.group(1)
        value = entry.group(2).replace('\\"', '"')
        pairs.append((label, value))
    return pairs


def _ts_string_array(block: str, field: str) -> list[str]:
    m = re.search(rf"{field}:\s*\[(.*?)\]", block, re.DOTALL)
    if not m:
        return []
    return [s for s in re.findall(r'"([^"]+)"', m.group(1))]


# ---------------------------------------------------------------------------
# Catalog content lookup — keyed by name (catalog_content uses display names).
# ---------------------------------------------------------------------------
def _cc_lookup_by_slug() -> dict[str, dict[str, Any]]:
    """Map slug -> catalog_content product dict (where one exists)."""
    name_to_slug = {
        "TrafficPatternsXD": "traffic-patterns-xd",
        "TrafficPatterns":   "traffic-patterns",
        "StreetBond":        "streetbond",
        "StreetPrint":       "streetprint",
        "DecoMark":          "decomark",
        "MMAX":              "mmax",
        "StreetBondSR":      "streetbondsr",
        "DuraTherm":         "duratherm",
        "DuraShield":        "durashield",
        "PreMark":           "premark",
        "AirMark":           "airmark",
    }
    out: dict[str, dict[str, Any]] = {}
    for entry in CC.PRODUCTS:
        slug = name_to_slug.get(entry["name"])
        if slug:
            out[slug] = entry
    return out


# ---------------------------------------------------------------------------
# Hero image resolution — catalog first, then lib/products.ts imageUrl.
# Both reference files under public/images/products/<slug>/.
# ---------------------------------------------------------------------------
def _resolve_hero(slug: str, cc_entry: dict[str, Any] | None,
                  lib_entry: dict[str, Any]) -> Path | None:
    # 1. Catalog content uses _pick(...) and returns a Path even if missing —
    #    so check existence.
    if cc_entry and cc_entry.get("hero"):
        h = Path(cc_entry["hero"])
        if h.exists():
            return h
    # 2. lib/products.ts imageUrl (web path)
    img_url = (lib_entry or {}).get("image_url")
    if img_url:
        p = PROJECT_ROOT / "public" / img_url.lstrip("/")
        if p.exists():
            return p
        # Try alternate extensions if the literal path is missing
        for ext in ("jpg", "jpeg", "png", "webp"):
            alt = p.with_suffix("." + ext)
            if alt.exists():
                return alt
    # 3. Walk the product directory for any candidate
    pdir = PUBLIC_IMG / "products" / slug
    if pdir.exists():
        for cand in sorted(pdir.iterdir()):
            if cand.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"):
                return cand
    return None


def _resolve_hero_secondary(slug: str, primary: Path | None) -> Path | None:
    """v50 — pick a secondary detail shot for the magazine split-hero layout.
    Walks the product image folder in numeric order (-02, -03, ...) and
    returns the first image that exists AND isn't the same file as the
    primary hero. Returns None if no suitable secondary exists, in which
    case the flyer falls back to a single-image hero.
    """
    pdir = PUBLIC_IMG / "products" / slug
    if not pdir.exists():
        return None
    primary_name = primary.name if primary else ""

    # Try the predictable suffix patterns first (-02 / -03 / -04 / -05) in
    # both jpg/png/webp. These are the gallery-ordered photos most likely
    # to be the strongest detail shots.
    for n in ("02", "03", "04", "05", "06", "07", "08", "09", "10"):
        for ext in ("jpg", "jpeg", "png", "webp"):
            cand = pdir / f"{slug}-{n}.{ext}"
            if cand.exists() and cand.name != primary_name:
                return cand

    # Fallback: walk the directory alphabetically for ANY image that isn't
    # the primary. Skip logos / icons / non-photo assets.
    skip_tokens = ("logo", "icon", "favicon", "svg", "bags")
    for cand in sorted(pdir.iterdir()):
        if cand.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        if cand.name == primary_name:
            continue
        low = cand.name.lower()
        if any(tok in low for tok in skip_tokens):
            continue
        return cand
    return None


# ---------------------------------------------------------------------------
# Display name + body resolution
# ---------------------------------------------------------------------------
def _resolve_display_name(slug: str, cc_entry, lib_entry) -> str:
    if cc_entry:
        return cc_entry["name"]
    if lib_entry and lib_entry.get("name"):
        return lib_entry["name"]
    return slug


def _resolve_body(orig_entry, cc_entry, lib_entry) -> str:
    # Priority: Doug's fact-checked original PDF content → catalogue voice →
    # lib/products.ts description. Original content is the canonical
    # source-of-truth for product copy on hubss.com.
    if orig_entry and orig_entry.get("body"):
        return orig_entry["body"]
    if cc_entry and cc_entry.get("body"):
        return cc_entry["body"]
    desc = (lib_entry or {}).get("description") or ""
    return _truncate_paragraph(desc, max_chars=720)


def _truncate_paragraph(text: str, *, max_chars: int) -> str:
    if not text or len(text) <= max_chars:
        return text
    cut = text[:max_chars]
    # Cut at the last sentence boundary that fits
    last = max(cut.rfind(". "), cut.rfind("? "), cut.rfind("! "))
    if last > max_chars * 0.55:
        return cut[: last + 1]
    return cut.rsplit(" ", 1)[0] + "..."


def _resolve_italic(cc_entry, lib_entry) -> str:
    if cc_entry and cc_entry.get("italic"):
        return cc_entry["italic"]
    # tagline-style fallback from the cc tagline (which is short, italic-feeling)
    if cc_entry and cc_entry.get("tagline"):
        return cc_entry["tagline"]
    return (lib_entry or {}).get("short_desc") or ""


def _resolve_spec_pairs(orig_entry, cc_entry, lib_entry) -> list[tuple[str, str]]:
    # Priority: original PDF content (richest specs — ASTM cites, exact mm,
    # BPN, certs) → catalogue's tuned 4-row → lib specs. Trim to 6 for layout.
    if orig_entry and orig_entry.get("spec_pairs"):
        return [(str(l), str(v)) for l, v in orig_entry["spec_pairs"][:6]]
    if cc_entry and cc_entry.get("spec_pairs"):
        return [(str(l), str(v)) for l, v in cc_entry["spec_pairs"][:6]]
    out: list[tuple[str, str]] = []
    for s in (lib_entry or {}).get("specs", [])[:6]:
        out.append((s[0], s[1]) if isinstance(s, tuple) else (s["label"], s["value"]))
    return out


def _resolve_chips(orig_entry, cc_entry, lib_entry) -> list[str]:
    # Priority: hand-curated chips from the original PDF docs → catalog uses
    # → mapped lib/products applications.
    if orig_entry and orig_entry.get("chips"):
        return list(orig_entry["chips"])[:6]
    if cc_entry and cc_entry.get("uses"):
        return list(cc_entry["uses"])[:6]
    related = (lib_entry or {}).get("related_applications", [])
    chips: list[str] = []
    for slug in related[:6]:
        label = APPLICATION_LABELS.get(slug)
        if label and label not in chips:
            chips.append(label)
    return chips


def _resolve_eyebrow(slug: str, orig_entry, cc_entry, lib_entry) -> str:
    # Priority: original PDF eyebrow → slug override → lib eyebrow.
    if orig_entry and orig_entry.get("eyebrow"):
        return orig_entry["eyebrow"]
    override = EYEBROW_OVERRIDES.get(slug)
    if override:
        return override
    if lib_entry and lib_entry.get("eyebrow"):
        return lib_entry["eyebrow"]
    return "HUB Surface Systems"


def _resolve_tagline(orig_entry, cc_entry, lib_entry) -> str:
    """The italic subhead under the display name."""
    if orig_entry and orig_entry.get("tagline"):
        return orig_entry["tagline"]
    if cc_entry and cc_entry.get("tagline"):
        return cc_entry["tagline"]
    return (lib_entry or {}).get("short_desc") or ""


# ---------------------------------------------------------------------------
# Assemble per-product payload + record sourcing for the manifest
# ---------------------------------------------------------------------------
def _assemble(slug: str, cc_by_slug, lib_by_slug) -> tuple[dict[str, Any], dict[str, Any]]:
    cc_entry = cc_by_slug.get(slug)
    lib_entry = lib_by_slug.get(slug)
    orig_entry = OC.ORIGINAL_PRODUCTS.get(slug)
    display_name = _resolve_display_name(slug, cc_entry, lib_entry)
    hero = _resolve_hero(slug, cc_entry, lib_entry)
    hero2 = _resolve_hero_secondary(slug, hero)

    payload = {
        "slug": slug,
        "name": display_name,
        "display_name": display_name,
        "eyebrow": _resolve_eyebrow(slug, orig_entry, cc_entry, lib_entry),
        "tagline": _resolve_tagline(orig_entry, cc_entry, lib_entry),
        "body": _resolve_body(orig_entry, cc_entry, lib_entry),
        "spec_pairs": _resolve_spec_pairs(orig_entry, cc_entry, lib_entry),
        "chips": _resolve_chips(orig_entry, cc_entry, lib_entry),
        "hero": hero,
        "hero2": hero2,   # v50: secondary detail shot for the magazine split
        # v46: white logo sits on the navy footer band.
        "logo": HUBSS_LOGO_WHITE if HUBSS_LOGO_WHITE.exists() else (
            HUBSS_LOGO_COLOR if HUBSS_LOGO_COLOR.exists() else None
        ),
        "url": f"https://hubss.com/products/{slug}",
    }

    sources = []
    notes = []
    if orig_entry:
        sources.append("original_content.py (Doug's verified PDFs)")
    if cc_entry:
        sources.append("catalog_content.py")
    if lib_entry:
        sources.append("lib/products.ts")
    if not sources:
        sources.append("(none)")
        notes.append("no source content found")
    if not hero:
        notes.append("missing hero image")
    if not payload["spec_pairs"]:
        notes.append("no spec rows resolved")
    if not payload["chips"]:
        notes.append("no application chips resolved")
    if not payload["tagline"]:
        notes.append("no tagline / italic subhead — using empty string")
    if not payload["body"]:
        notes.append("no body paragraph")

    if not hero2:
        notes.append("no secondary image — single-hero fallback layout")

    manifest_row = {
        "slug": slug,
        "display_name": display_name,
        "eyebrow": payload["eyebrow"],
        "source_origin": " + ".join(sources),
        "notes": notes,
        "hero_path": str(hero) if hero else None,
        "hero2_path": str(hero2) if hero2 else None,
        "spec_pair_count": len(payload["spec_pairs"]),
        "chip_count": len(payload["chips"]),
        "url": payload["url"],
    }
    return payload, manifest_row


# ---------------------------------------------------------------------------
# Web preview generation — render the PDF page to PNG via reportlab + PIL.
# Strategy:
#   We build a tiny rasterizer-free preview by re-rendering the same content
#   to a Pillow canvas at preview DPI. Doing pixel-perfect render of the PDF
#   would need Poppler/Wand; instead we cheat by reusing the hero photo + a
#   stylized banner header as the preview hero card. This stays within the
#   "Pillow only" constraint and produces something that is genuinely useful
#   for a /resources page (recognizable + on-brand).
#
# An alternate path (pdf -> WebP using PyMuPDF) is attempted first if the
# library is available; if not, we use the Pillow composite path.
# ---------------------------------------------------------------------------
def _try_pdf_to_webp_with_pymupdf(pdf_path: Path, webp_path: Path,
                                  width_px: int = 1200) -> bool:
    """Render flyer page-1 to WebP via PyMuPDF, with v49 saturation boost
    and v50 WebP quality bump applied to match the catalogue's web look.

    v49 — Vernon flagged 'muted colors' as the biggest single complaint on
    the catalogue web flipbook. Root cause: print PDF is CMYK (required
    for press); PyMuPDF's CMYK→sRGB conversion clips saturated greens /
    blues / oranges. The catalogue session compensates by post-processing
    the WebP with a 1.25× saturation bump in PIL plus bumping WebP
    quality 82→92. Mirror that here so the flyer cards on /resources pop
    the same way the catalogue does.
    """
    try:
        import fitz  # PyMuPDF
        from PIL import ImageEnhance
    except Exception:
        return False
    try:
        doc = fitz.open(str(pdf_path))
        page = doc.load_page(0)
        zoom = width_px / float(PAGE_W)
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        png_bytes = pix.tobytes("png")
        from io import BytesIO
        img = Image.open(BytesIO(png_bytes)).convert("RGB")

        # v50 — saturation bump to compensate for CMYK→sRGB gamut clip.
        img = ImageEnhance.Color(img).enhance(1.25)

        webp_path.parent.mkdir(parents=True, exist_ok=True)
        # v50 — WebP quality 92 (was 82) to preserve the photographic
        # detail in the hero zone.
        img.save(webp_path, format="WEBP", quality=92, method=6)
        doc.close()
        return True
    except Exception as e:
        print(f"  PyMuPDF render failed: {e}")
        return False


def _pillow_preview(payload: dict[str, Any], webp_path: Path,
                    width_px: int = 1200) -> bool:
    """Composite a recognizable preview using Pillow only.

    Layout mirrors the flyer (top photo, cream banner, sparse body region),
    but is intentionally simpler. This is the fallback when PyMuPDF / Poppler
    aren't available."""
    try:
        page_ratio = PAGE_H / PAGE_W   # 11.25 / 8.75 = 1.2857
        h_px = int(width_px * page_ratio)

        # v46: white paper (no cream).
        img = Image.new("RGB", (width_px, h_px), (255, 255, 255))
        draw = ImageDraw.Draw(img)

        # 1) Hero photo
        hero_h_px = int(h_px * (4.05 / 11.25))   # match flyer ratio
        if payload.get("hero") and payload["hero"].exists():
            with Image.open(payload["hero"]) as ph:
                ph = ph.convert("RGB")
                # Cover crop
                target_ratio = width_px / hero_h_px
                src_ratio = ph.width / ph.height
                if src_ratio > target_ratio:
                    new_h = ph.height
                    new_w = int(ph.height * target_ratio)
                    x = (ph.width - new_w) // 2
                    crop = ph.crop((x, 0, x + new_w, new_h))
                else:
                    new_w = ph.width
                    new_h = int(ph.width / target_ratio)
                    y = (ph.height - new_h) // 2
                    crop = ph.crop((0, y, new_w, y + new_h))
                crop = crop.resize((width_px, hero_h_px), Image.LANCZOS)
                img.paste(crop, (0, 0))
        else:
            draw.rectangle([0, 0, width_px, hero_h_px], fill=(10, 18, 30))

        # 2) v46 navy header band beneath the hero
        banner_h_px = int(h_px * (1.35 / 11.25))
        banner_top = hero_h_px
        draw.rectangle([0, banner_top, width_px, banner_top + banner_h_px],
                       fill=(8, 13, 30))

        # 3) Type — best effort with default fonts
        eyebrow_font, name_font, italic_font, body_font = _load_preview_fonts(width_px)

        pad_x = int(width_px * 0.06)
        text_y = banner_top + int(banner_h_px * 0.20)

        # Eyebrow (orange on navy)
        draw.text((pad_x, text_y), payload.get("eyebrow", "").upper(),
                  fill=(229, 96, 27), font=eyebrow_font)
        text_y += int(banner_h_px * 0.25)

        # Display name (WHITE on navy — v46 wordmark)
        draw.text((pad_x, text_y), payload.get("display_name", ""),
                  fill=(255, 255, 255), font=name_font)
        text_y += int(banner_h_px * 0.42)

        # Italic tagline (kept off-band for fallback simplicity)
        draw.text((pad_x, text_y), payload.get("tagline", ""),
                  fill=(60, 60, 70), font=italic_font)

        # 4) Body region: hint of the body paragraph + chip line
        body_top = banner_top + banner_h_px + int(h_px * 0.04)
        body_text = payload.get("body", "")
        _wrap_and_draw(draw, body_text, font=body_font,
                       x=pad_x, y=body_top,
                       max_width=width_px - 2 * pad_x,
                       max_lines=6, line_spacing=int(banner_h_px * 0.18),
                       fill=(40, 40, 50))

        # Footer
        foot_y = h_px - int(h_px * 0.04)
        draw.rectangle([pad_x, foot_y - 4, pad_x + 90, foot_y - 1],
                       fill=(229, 96, 27))
        draw.text((pad_x, foot_y + 4),
                  f"hubss.com/products/{payload['slug']}",
                  fill=(120, 120, 130), font=body_font)

        webp_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            img.save(webp_path, format="WEBP", quality=82, method=6)
        except Exception:
            # WebP support missing -> save as JPEG with a .jpg suffix
            alt = webp_path.with_suffix(".jpg")
            img.save(alt, format="JPEG", quality=88)
        return True
    except Exception as e:
        print(f"  Pillow preview failed: {e}")
        return False


def _wrap_and_draw(draw, text, *, font, x, y, max_width, max_lines,
                   line_spacing, fill):
    words = (text or "").split(" ")
    lines: list[str] = []
    cur = ""
    for w in words:
        cand = (cur + " " + w).strip()
        bbox = draw.textbbox((0, 0), cand, font=font)
        if bbox[2] - bbox[0] <= max_width:
            cur = cand
        else:
            if cur:
                lines.append(cur)
            cur = w
        if len(lines) >= max_lines - 1:
            break
    if cur:
        lines.append(cur)
    for i, ln in enumerate(lines):
        draw.text((x, y + i * line_spacing), ln, fill=fill, font=font)


def _load_preview_fonts(width_px: int):
    """Return (eyebrow, name, italic, body) PIL fonts."""
    # Try common system fonts; fall back to default bitmap.
    candidates_bold = [
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/calibrib.ttf",
        "C:/Windows/Fonts/segoeuib.ttf",
    ]
    candidates_reg = [
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/calibri.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
    ]
    candidates_italic = [
        "C:/Windows/Fonts/timesi.ttf",
        "C:/Windows/Fonts/arialit.ttf",
        "C:/Windows/Fonts/cambriai.ttf",
    ]

    def _first(paths, size):
        for p in paths:
            if Path(p).exists():
                try:
                    return ImageFont.truetype(p, size)
                except Exception:
                    pass
        return ImageFont.load_default()

    eyebrow = _first(candidates_bold, max(14, int(width_px * 0.018)))
    name = _first(candidates_bold, max(42, int(width_px * 0.055)))
    italic = _first(candidates_italic, max(18, int(width_px * 0.022)))
    body = _first(candidates_reg, max(14, int(width_px * 0.014)))
    return eyebrow, name, italic, body


# ---------------------------------------------------------------------------
# 1200x630 social share JPG
# ---------------------------------------------------------------------------
def _build_share_jpg(payload: dict[str, Any], out_jpg: Path) -> bool:
    try:
        W, H = 1200, 630
        img = Image.new("RGB", (W, H), (10, 18, 30))   # navy fallback
        if payload.get("hero") and payload["hero"].exists():
            with Image.open(payload["hero"]) as ph:
                ph = ph.convert("RGB")
                target_ratio = W / H
                src_ratio = ph.width / ph.height
                if src_ratio > target_ratio:
                    new_h = ph.height
                    new_w = int(ph.height * target_ratio)
                    x = (ph.width - new_w) // 2
                    crop = ph.crop((x, 0, x + new_w, new_h))
                else:
                    new_w = ph.width
                    new_h = int(ph.width / target_ratio)
                    y = (ph.height - new_h) // 2
                    crop = ph.crop((0, y, new_w, y + new_h))
                crop = crop.resize((W, H), Image.LANCZOS)
                img.paste(crop, (0, 0))

        # Dark gradient overlay at the bottom for legibility
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        odraw = ImageDraw.Draw(overlay)
        for i in range(H // 2, H):
            t = (i - H // 2) / (H // 2)
            a = int(180 * (t ** 1.6))
            odraw.line([(0, i), (W, i)], fill=(8, 12, 22, a))
        img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

        # Orange brand bar near the bottom
        draw = ImageDraw.Draw(img)
        draw.rectangle([60, H - 110, 60 + 90, H - 105], fill=(229, 96, 27))

        # Type
        _, name_font, italic_font, body_font = _load_preview_fonts(W)
        eyebrow_font = _load_preview_fonts(int(W * 0.6))[0]
        draw.text((60, H - 220), payload.get("eyebrow", "").upper(),
                  fill=(229, 130, 60), font=eyebrow_font)
        draw.text((60, H - 180), payload.get("display_name", ""),
                  fill=(255, 255, 255), font=name_font)
        draw.text((60, H - 90), "hubss.com/products/" + payload["slug"],
                  fill=(220, 220, 220), font=body_font)

        out_jpg.parent.mkdir(parents=True, exist_ok=True)
        img.save(out_jpg, format="JPEG", quality=88, optimize=True)
        return True
    except Exception as e:
        print(f"  share JPG failed: {e}")
        return False


# ---------------------------------------------------------------------------
# Build loop
# ---------------------------------------------------------------------------
def build_all() -> None:
    cc_by_slug = _cc_lookup_by_slug()
    lib_by_slug = _read_lib_products()
    # The lib/products.ts regex parser misfires on the current file shape
    # (greedy capture overshoots multiple `];`-suffixed lines), returning {}.
    # Hardcode the three repair products so their flyers populate. Copy lives
    # in lib/products.ts; if it changes, mirror it here.
    lib_by_slug.update(_REPAIR_PRODUCTS_HARDCODED)

    PDF_OUT.mkdir(parents=True, exist_ok=True)
    PUBLIC_RESOURCES_FLYERS.mkdir(parents=True, exist_ok=True)
    MANIFEST_OUT.parent.mkdir(parents=True, exist_ok=True)

    manifest_rows: list[dict[str, Any]] = []
    pdf_count = preview_count = share_count = 0
    preview_fallbacks: list[str] = []

    for slug in ALL_SLUGS:
        print(f"--- {slug} ---")
        payload, row = _assemble(slug, cc_by_slug, lib_by_slug)

        pdf_path = PDF_OUT / f"HUBSS-Flyer-{slug}-v01.pdf"
        preview_path = PUBLIC_RESOURCES_FLYERS / f"{slug}-preview.webp"
        share_path = PUBLIC_RESOURCES_FLYERS / f"{slug}-share.jpg"

        try:
            build_flyer(payload, pdf_path)
            pdf_count += 1
            print(f"  PDF:     {pdf_path}")
        except Exception as e:
            row["notes"].append(f"PDF build failed: {e}")
            print(f"  PDF FAILED: {e}")

        # Preview: try PyMuPDF (pixel-perfect from the actual PDF), else Pillow.
        used = "pymupdf"
        ok = _try_pdf_to_webp_with_pymupdf(pdf_path, preview_path)
        if not ok:
            used = "pillow-composite"
            preview_fallbacks.append(slug)
            ok = _pillow_preview(payload, preview_path)
        if ok:
            preview_count += 1
            # If WebP failed inside _pillow_preview, the alt is the .jpg sibling.
            if not preview_path.exists():
                alt = preview_path.with_suffix(".jpg")
                if alt.exists():
                    row["preview_path"] = str(alt)
                    row["notes"].append("WebP unavailable — preview saved as JPG")
            else:
                row["preview_path"] = str(preview_path)
        else:
            row["notes"].append("preview generation failed")
        row["preview_renderer"] = used
        print(f"  Preview ({used}): {preview_path if ok else 'FAILED'}")

        if _build_share_jpg(payload, share_path):
            share_count += 1
            row["share_path"] = str(share_path)
            print(f"  Share:   {share_path}")
        else:
            row["notes"].append("share JPG failed")

        row["pdf_path"] = str(pdf_path)
        row["qr_target"] = payload["url"]
        manifest_rows.append(row)

    # Manifest
    manifest_payload = {
        "generated_by": "catalog-print-build/src/build_flyers.py",
        "page_geometry": {
            "trim_w_in": float(TRIM_W) / 72.0,
            "trim_h_in": float(TRIM_H) / 72.0,
            "page_w_in": float(PAGE_W) / 72.0,
            "page_h_in": float(PAGE_H) / 72.0,
            "bleed_in": 0.125,
        },
        "counts": {
            "pdf": pdf_count,
            "preview": preview_count,
            "share": share_count,
        },
        "preview_fallbacks_to_pillow": preview_fallbacks,
        "products": manifest_rows,
    }
    MANIFEST_OUT.write_text(
        json.dumps(manifest_payload, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"\nwrote manifest: {MANIFEST_OUT}")
    print(f"summary: {pdf_count} PDFs, {preview_count} previews, "
          f"{share_count} share JPGs across {len(ALL_SLUGS)} products")


if __name__ == "__main__":
    build_all()
