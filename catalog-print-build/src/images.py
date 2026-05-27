"""
Image handling for print: resolution check + CMYK conversion + downsample.

Source images can be enormous (5712x4284). For a 5x5 inch page at 300 DPI we
only need 1575 pixels max — and the build is dramatically faster if we
downsample during the CMYK conversion step (cached on first use).
"""

from __future__ import annotations
import hashlib
from pathlib import Path
from PIL import Image
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.utils import ImageReader

from .specs import TARGET_DPI, MIN_DPI_WARN, PAGE_W


_CONVERTED_CACHE_DIR = Path(__file__).resolve().parent.parent / "output" / "_cmyk_cache"

# Page is 5.25" wide. At 300 DPI a full-bleed image needs 1575 pixels.
# Cap the long edge of the cached version a bit higher to allow some crop slack.
MAX_LONG_EDGE = 2000


def _cmyk_cache_path(src):
    """Cache filename includes a hash of the FULL resolved path so two files
    with the same basename (e.g. both 'featured.jpg' under different project
    folders) get separate cache entries. The earlier 'src.stem__cmyk.jpg'
    naming caused silent collisions and swapped images on rebuild."""
    _CONVERTED_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    digest = hashlib.md5(str(src.resolve()).encode("utf-8")).hexdigest()[:12]
    return _CONVERTED_CACHE_DIR / f"{src.stem}__{digest}__cmyk.jpg"


def ensure_cmyk(src):
    """Return a CMYK + downsampled cached version of src."""
    src = Path(src)
    if not src.exists():
        raise FileNotFoundError(f"Image not found: {src}")
    out = _cmyk_cache_path(src)
    if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
        return out
    with Image.open(src) as im:
        # Downsample first (much cheaper than converting then resizing)
        max_side = max(im.size)
        if max_side > MAX_LONG_EDGE:
            scale = MAX_LONG_EDGE / max_side
            new_size = (int(im.size[0] * scale), int(im.size[1] * scale))
            im = im.resize(new_size, Image.LANCZOS)
        if im.mode == "CMYK":
            cmyk = im
        else:
            cmyk = im.convert("RGB").convert("CMYK")
        cmyk.save(out, format="JPEG", quality=88, dpi=(TARGET_DPI, TARGET_DPI))
    return out


def check_resolution(src, draw_w_pt, draw_h_pt):
    with Image.open(src) as im:
        px_w, px_h = im.size
    dpi_x = px_w / (draw_w_pt / 72.0)
    dpi_y = px_h / (draw_h_pt / 72.0)
    effective = min(dpi_x, dpi_y)
    return {
        "effective_dpi_x": dpi_x,
        "effective_dpi_y": dpi_y,
        "ok": effective >= TARGET_DPI,
        "warn": effective < MIN_DPI_WARN,
    }


def draw_image_box(c, src, x, y, w, h, *, cover=True, convert_to_cmyk=True):
    src_path = Path(src)
    if convert_to_cmyk:
        src_path = ensure_cmyk(src_path)
    with Image.open(src_path) as im:
        im_w, im_h = im.size
    box_ratio = w / h
    img_ratio = im_w / im_h

    if cover:
        if img_ratio > box_ratio:
            new_h = h
            new_w = h * img_ratio
            x_off = x - (new_w - w) / 2
            y_off = y
        else:
            new_w = w
            new_h = w / img_ratio
            x_off = x
            y_off = y - (new_h - h) / 2
        c.saveState()
        p = c.beginPath()
        p.rect(x, y, w, h)
        c.clipPath(p, stroke=0, fill=0)
        c.drawImage(ImageReader(str(src_path)), x_off, y_off, new_w, new_h,
                    preserveAspectRatio=False, mask="auto")
        c.restoreState()
    else:
        if img_ratio > box_ratio:
            new_w = w
            new_h = w / img_ratio
            x_off = x
            y_off = y + (h - new_h) / 2
        else:
            new_h = h
            new_w = h * img_ratio
            x_off = x + (w - new_w) / 2
            y_off = y
        c.drawImage(ImageReader(str(src_path)), x_off, y_off, new_w, new_h,
                    preserveAspectRatio=True, mask="auto")
    return check_resolution(src_path, w, h)
