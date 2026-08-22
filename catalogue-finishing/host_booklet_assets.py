#!/usr/bin/env python
"""Host the catalogue's build-only `assets/booklet/` images as small web copies.

The Figma plugin streams every photo at runtime via figma.createImageAsync(URL).
Most photos already live under public/images/ (served on staging). A handful
(cover + a few heroes) live in catalog-print-build/assets/booklet/ — full-res,
hundreds of MB, gitignored, NOT served. This script writes downscaled JPEG
copies of ONLY the booklet images the catalogue actually uses into
public/images/catalogue-assets/, plus a manifest so generate_plugin.py can map
the original path -> hosted URL deterministically.

Light, single-shot (7 images). Safe to re-run (overwrites its own outputs only).
Run from catalog-print-build/:  python -m catalogue_finishing... — or directly:
  python catalogue-finishing/host_booklet_assets.py
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

WT = Path(__file__).resolve().parent.parent          # worktree root
LAYOUT = WT / "catalog-print-build" / "figma-plugin" / "catalogue-layout.json"
OUT_DIR = WT / "public" / "images" / "catalogue-assets"
MANIFEST = OUT_DIR / "_manifest.json"
MAX_DIM = 1800           # 4x the 450px frame — crisp, still small
JPEG_Q = 85


def slug(name: str) -> str:
    stem = Path(name).stem.lower()
    out = []
    for ch in stem:
        out.append(ch if ch.isalnum() else "-")
    s = "".join(out)
    while "--" in s:
        s = s.replace("--", "-")
    return s.strip("-") + ".jpg"


def collect_booklet_paths(node, acc):
    if isinstance(node, dict):
        for k, v in node.items():
            if isinstance(v, str) and any(t in k.lower() for t in ("image", "hero", "photo", "detail", "src")):
                if "booklet" in v.replace("\\", "/"):
                    acc.add(v)
            else:
                collect_booklet_paths(v, acc)
    elif isinstance(node, list):
        for v in node:
            collect_booklet_paths(v, acc)


def main():
    data = json.loads(LAYOUT.read_text(encoding="utf-8"))
    paths = set()
    collect_booklet_paths(data, paths)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for p in sorted(paths):
        src = Path(p)
        if not src.is_file():
            print(f"  MISSING (skipped): {p}")
            continue
        hosted_name = slug(src.name)
        dst = OUT_DIR / hosted_name
        im = Image.open(src)
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)
        im.save(dst, "JPEG", quality=JPEG_Q, optimize=True)
        url = "/images/catalogue-assets/" + hosted_name
        # key by basename — robust to path differences between machines
        manifest[src.name] = url
        print(f"  {src.stat().st_size/1048576:5.1f}MB -> {dst.stat().st_size/1024:4.0f}KB  {url}")
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(manifest)} hosted assets + manifest at {MANIFEST.relative_to(WT)}")


if __name__ == "__main__":
    main()
