"""Render OLD .line vs NEW .single-line side-by-side at high zoom so the
'two parallel lines vs one line' fix is visible."""
import fitz
from PIL import Image, ImageDraw, ImageFont
import os

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(OUT_DIR)


def render(svg_path, scale=8.0):
    doc = fitz.open('svg', open(svg_path, 'rb').read())
    pix = doc[0].get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=True)
    img = Image.frombytes('RGBA', (pix.width, pix.height), pix.samples)
    doc.close()
    return img


def composite_dark(img):
    bg = Image.new('RGB', img.size, (15, 22, 32))
    bg.paste(img, (0, 0), img)
    return bg


PATTERNS = ['offset-brick', 'standard-herringbone']

for pat in PATTERNS:
    old = composite_dark(render(f'{pat}.line.svg', 8.0))
    new = composite_dark(render(f'{pat}.single-line.svg', 8.0))
    # Resize so both have same height; place side-by-side
    h = max(old.height, new.height)
    if old.height != h:
        old = old.resize((int(old.width * h / old.height), h))
    if new.height != h:
        new = new.resize((int(new.width * h / new.height), h))
    gutter = 32
    combo = Image.new('RGB', (old.width + new.width + gutter, h + 40), (15, 22, 32))
    combo.paste(old, (0, 40))
    combo.paste(new, (old.width + gutter, 40))
    draw = ImageDraw.Draw(combo)
    try:
        font = ImageFont.truetype('arial.ttf', 14)
    except Exception:
        font = ImageFont.load_default()
    draw.text((6, 8),  'OLD .line — doubled joints', fill=(232, 116, 22), font=font)
    draw.text((old.width + gutter + 6, 8),  'NEW .single-line — single joints', fill=(232, 237, 244), font=font)
    out = f'_comparison-{pat}.png'
    combo.save(out)
    print(f'wrote {out}')
