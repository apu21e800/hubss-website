"""Decisive test: source RGB vs how it renders after the pipeline's CMYK embed
(fitz render = what the flipbook/web PDF/print viewer actually show).
Also tests the FOGRA39 ICC-aware conversion as the candidate fix."""
import io, colorsys
from pathlib import Path
from PIL import Image, ImageCms
import fitz

CACHE = Path(r"C:\Users\cleve\Based_Agency\_wt-catalogue-finishing\catalog-print-build\output\_cmyk_cache")
CACHE.mkdir(parents=True, exist_ok=True)

def ensure_cmyk_naive(src):
    """Exact replica of images.py ensure_cmyk (the current pipeline)."""
    out = CACHE / "diag_naive_cmyk.jpg"
    with Image.open(src) as im:
        im = im.convert("RGB").convert("CMYK")  # images.py:54
        im.save(out, format="JPEG", quality=88)
    return out

SRC = Path(r"C:\Users\cleve\Based_Agency\_wt-catalogue-finishing\public\images\applications\community-branding\community-branding-09.jpg")
FOGRA = r"C:\Windows\System32\spool\drivers\color\CoatedFOGRA39.icc"

def sat(im):
    im = im.convert("RGB").resize((80, 80))
    return sum(colorsys.rgb_to_hsv(r/255, g/255, b/255)[1] for r, g, b in im.getdata()) / 6400

def embed_and_render(jpg_path):
    """Put a JPEG in a 1-page PDF and render it back to RGB via fitz (what viewers do)."""
    doc = fitz.open(); pg = doc.new_page(width=300, height=300)
    pg.insert_image(fitz.Rect(0, 0, 300, 300), filename=str(jpg_path))
    pix = pg.get_pixmap(matrix=fitz.Matrix(1, 1), colorspace=fitz.csRGB)
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")

src = Image.open(SRC).convert("RGB")
print(f"SOURCE saturation:            {sat(src):.3f}")

# 1) current pipeline: naive CMYK JPEG -> embed -> render
cmyk_jpg = ensure_cmyk_naive(SRC)
print(f"naive-CMYK embed->render:     {sat(embed_and_render(cmyk_jpg)):.3f}   (current pipeline)")

# 2) candidate fix A: RGB JPEG -> embed -> render
rgb_jpg = Path(cmyk_jpg).with_name("test_rgb.jpg")
src.save(rgb_jpg, "JPEG", quality=92)
print(f"RGB embed->render:            {sat(embed_and_render(rgb_jpg)):.3f}   (fix A: keep RGB)")

# 3) candidate fix B: FOGRA39 ICC-aware CMYK -> embed -> render
try:
    srgb = ImageCms.createProfile("sRGB")
    cmyk_icc = ImageCms.profileToProfile(src, srgb, FOGRA, renderingIntent=0, outputMode="CMYK")
    icc_jpg = Path(cmyk_jpg).with_name("test_fogra.jpg")
    cmyk_icc.save(icc_jpg, "JPEG", quality=92)
    print(f"FOGRA39-ICC embed->render:    {sat(embed_and_render(icc_jpg)):.3f}   (fix B: proper CMYK)")
except Exception as e:
    print("FOGRA39 ICC test failed:", e)
