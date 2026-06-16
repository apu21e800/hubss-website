#!/usr/bin/env python
"""Downscale the catalogue's streamed photos to a Figma-friendly max edge.

The plugin streams every photo via figma.createImageAsync. At full resolution
(some 5712px) the ~91 images decode to ~1.3 GB+ in Figma's RAM/GPU — a full
"Build entire book" (× any stacked re-runs) saturates the GPU and freezes the
workstation. Downscaling to 1600px (a 450px frame never needs more) cuts that
to ~0.2 GB.

Writes copies to public/images/catalogue-figma/ + a manifest
(original /images URL -> downscaled URL) that generate_plugin.py remaps to.
Light + single-shot: JPEGs use .draft() for fast decode-at-scale. Manifest is
MERGED (never clobbered) so re-runs are safe.

Run from the worktree root:  python catalogue-finishing/downscale_figma_images.py
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

WT = Path(__file__).resolve().parent.parent
LAYOUT = WT / "catalog-print-build" / "figma-plugin" / "catalogue-layout.json"
PUB = WT / "public"
OUT = PUB / "images" / "catalogue-figma"
MANIFEST = OUT / "_manifest.json"
MAXDIM = 1600
JPEG_Q = 82


def collect(node, acc):
    if isinstance(node, str):
        if node.startswith("/images/"):
            acc.add(node)
    elif isinstance(node, dict):
        for v in node.values():
            collect(v, acc)
    elif isinstance(node, list):
        for v in node:
            collect(v, acc)


def main():
    data = json.loads(LAYOUT.read_text(encoding="utf-8"))
    urls = set()
    collect(data, urls)
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    if MANIFEST.exists():
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))  # merge-safe
    saved = skipped = 0
    for rel in sorted(urls):
        if "/catalogue-figma/" in rel:
            continue  # already a downscaled copy
        src = PUB / rel.lstrip("/")
        if not src.is_file() or src.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        try:
            im = Image.open(src)
            is_jpeg = src.suffix.lower() in (".jpg", ".jpeg")
            if is_jpeg:
                im.draft("RGB", (MAXDIM, MAXDIM))  # fast decode at reduced scale
            if max(im.size) <= MAXDIM:
                skipped += 1
                continue  # already small enough — plugin keeps the original
            im = ImageOps.exif_transpose(im)
            im.thumbnail((MAXDIM, MAXDIM), Image.LANCZOS)
            stem = rel[len("/images/"):].replace("/", "-").rsplit(".", 1)[0]
            keep_png = (not is_jpeg) and im.mode in ("RGBA", "LA", "P")
            out = OUT / (stem + (".png" if keep_png else ".jpg"))
            if keep_png:
                im.save(out, "PNG", optimize=True)
            else:
                im.convert("RGB").save(out, "JPEG", quality=JPEG_Q, optimize=True)
            manifest[rel] = "/images/catalogue-figma/" + out.name
            saved += 1
        except Exception as e:  # noqa: BLE001
            print(f"  skip {rel}: {e}")
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    total = sum((OUT / Path(v).name).stat().st_size for v in manifest.values() if (OUT / Path(v).name).is_file())
    print(f"downscaled {saved}, left {skipped} already-small; manifest {len(manifest)} entries; {total/1048576:.1f} MB total")


if __name__ == "__main__":
    main()
