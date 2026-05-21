"""
Embed all assigned catalog images into the Figma plugin's code.js as a base64
IMAGE_BANK constant. Each image is downsampled to ~1400px on the long edge and
re-encoded as JPEG quality 78 for a manageable file size while still
delivering visually-rich Figma renders.

Plugin will use figma.createImage(bytes) + image-fill to embed real photos
instead of beige `[PHOTO]` placeholders.
"""
from __future__ import annotations

import base64
import io
import json
import re
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "output" / "catalog_data.json"
PLUGIN = ROOT / "figma-plugin" / "code.js"
MAX_EDGE = 1500          # print-ready: 1500px / 5in = 300dpi — matches print house requirements
JPEG_QUALITY = 82        # higher quality for print reproduction


def collect_image_paths(data: dict) -> list[str]:
    paths: list[str] = []

    def add(p):
        if p and isinstance(p, str):
            paths.append(p)

    add(data.get("cover_photo"))
    for v in (data.get("section_openers") or {}).values():
        add(v)
    for p in data.get("products") or []:
        add(p.get("hero"))
    for a in data.get("applications") or []:
        add(a.get("image"))
    for pr in data.get("projects") or []:
        add(pr.get("hero"))
        add(pr.get("detail"))
    for i in data.get("installers") or []:
        add(i.get("image"))

    # Brand logos — needed by plugin for cover, half-title, quiet-mark, back cover
    brand = ROOT.parent / "public" / "images" / "assets" / "logos" / "hubss-logos"
    add(str(brand / "hubss-logo-white-large.png"))
    add(str(brand / "hubss-logo-color.png"))

    # Asphalt photo for back cover
    asphalt = ROOT.parent / "public" / "images" / "applications" / "parking-lots" / "parking-lots-01.jpg"
    add(str(asphalt))

    # Moose mascot — Lunch & Learn page
    mascot = ROOT / "assets" / "moose-mascot.png"
    add(str(mascot))

    # de-dup, keep order
    seen = set()
    out = []
    for p in paths:
        if p not in seen:
            seen.add(p)
            out.append(p)
    return out


def encode_image(path: str) -> str | None:
    """Resize and encode an image as base64. Preserves PNG with transparency
    (for logos), uses JPEG for opaque photos."""
    if not Path(path).exists():
        return None
    try:
        with Image.open(path) as im:
            has_alpha = im.mode in ("RGBA", "LA", "P") and "transparency" in im.info
            if im.mode in ("RGBA", "LA"):
                has_alpha = True
            if has_alpha or path.lower().endswith(".png"):
                # Keep PNG so logos retain transparency
                im = im.convert("RGBA")
                im.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
                buf = io.BytesIO()
                im.save(buf, format="PNG", optimize=True)
            else:
                im = im.convert("RGB")
                im.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
                buf = io.BytesIO()
                im.save(buf, format="JPEG", quality=JPEG_QUALITY, optimize=True)
            return base64.b64encode(buf.getvalue()).decode("ascii")
    except Exception as e:
        print(f"  ! failed to encode {path}: {e}")
        return None


def main():
    data = json.loads(DATA.read_text())
    paths = collect_image_paths(data)
    print(f"Found {len(paths)} unique image paths")

    bank: dict[str, str] = {}
    total_bytes = 0
    for i, p in enumerate(paths, 1):
        b64 = encode_image(p)
        if b64:
            key = Path(p).parent.name + "/" + Path(p).name  # parent/filename — unique across repeated filenames like featured.jpg
            bank[key] = b64
            total_bytes += len(b64)
            print(f"  [{i}/{len(paths)}] {Path(p).name:50s} {len(b64)//1024:6d} KB")
        else:
            print(f"  [{i}/{len(paths)}] {Path(p).name:50s} SKIPPED")

    print(f"\nTotal embedded base64: {total_bytes/1024/1024:.1f} MB")

    bank_js = json.dumps(bank, ensure_ascii=False)

    # Read current code.js
    code = PLUGIN.read_text(encoding="utf-8")

    # Replace existing IMAGE_BANK using simple string replace (regex fails on huge blobs)
    bank_decl = f"const IMAGE_BANK = {bank_js};"
    if "const IMAGE_BANK = {};" in code:
        # Fresh generate_plugin.py output — exact sentinel match
        code = code.replace("const IMAGE_BANK = {};", bank_decl, 1)
    elif "const IMAGE_BANK" in code:
        # Previous embed already ran — find the declaration boundary and swap it out
        start = code.find("const IMAGE_BANK = {")
        # The declaration ends at the first "};" that closes the top-level object
        # Walk forward to find the matching closing
        depth = 0
        i = start + len("const IMAGE_BANK = ")
        end = i
        while i < len(code):
            if code[i] == '{':
                depth += 1
            elif code[i] == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1  # past the '}'
                    break
            i += 1
        # skip any trailing ";" and whitespace up to newline
        while end < len(code) and code[end] in '; \t':
            end += 1
        code = code[:start] + bank_decl + "\n" + code[end:]
    else:
        # IMAGE_BANK missing entirely — insert before EMBEDDED_DATA
        code = code.replace(
            "const EMBEDDED_DATA",
            bank_decl + "\nconst EMBEDDED_DATA",
            1,
        )

    PLUGIN.write_bytes(code.encode("utf-8"))
    print(f"Wrote IMAGE_BANK into {PLUGIN}")
    print(f"code.js size: {len(code)/1024/1024:.1f} MB")


if __name__ == "__main__":
    main()
