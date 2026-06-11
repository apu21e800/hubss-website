"""Render PNG previews of the new single-line + architectural variants and
build a 3x3 tiled-view so I can confirm:
  (a) joints draw as ONE line, not two parallel lines, when zoomed in
  (b) the pattern tiles seamlessly (no visible seam at tile borders)

Renders to *.preview.png for direct inspection; tiled views to *.tiled.png."""
import fitz
import os
from PIL import Image

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(OUT_DIR)

PATTERNS = [
    'standard-herringbone',
    'diagonal-herringbone',
    'british-cobble',
    'offset-brick',
    'six-in-tiles',
    'eight-in-offset-tile',
    'texas-cobble',
    'ashlar-slate',
]

VARIANTS = ['single-line', 'blueprint', 'draft']


def render(svg_path, scale=4.0):
    """Render a SVG file to a PIL RGBA image at the given pixel scale."""
    doc = fitz.open('svg', open(svg_path, 'rb').read())
    pix = doc[0].get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=True)
    img = Image.frombytes('RGBA', (pix.width, pix.height), pix.samples)
    doc.close()
    return img


def composite_dark(img):
    """Put `img` over a dark bg so transparent (single-line) patterns are visible."""
    bg = Image.new('RGB', img.size, (15, 22, 32))  # var(--bg-mid) #0f1620
    bg.paste(img, (0, 0), img)
    return bg


def tiled(img, grid=3):
    """Lay out `grid` x `grid` copies of img to verify seamless tiling."""
    w, h = img.size
    out = Image.new(img.mode, (w * grid, h * grid))
    for i in range(grid):
        for j in range(grid):
            out.paste(img, (i * w, j * h))
    return out


for pat in PATTERNS:
    for var in VARIANTS:
        src = f'{pat}.{var}.svg'
        if not os.path.exists(src):
            print(f'MISSING {src}')
            continue
        img = render(src, scale=4.0)
        # Variants with no bg are drawn over our dark mid-tone for visibility
        if var == 'single-line':
            preview = composite_dark(img)
        else:
            # Blueprint and draft already have their own bg fill; just convert to RGB
            preview = img.convert('RGB')
        preview.save(f'{pat}.{var}.preview.png')
        # Tiled 3x3
        big = tiled(preview, 3)
        big.save(f'{pat}.{var}.tiled.png')

print('rendered previews + tiled views for all 24 variants')
