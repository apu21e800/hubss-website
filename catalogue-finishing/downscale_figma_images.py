#!/usr/bin/env python
"""Prepare the catalogue's streamed photos for Figma: print-res, true-sRGB copies.

v2 — colour-managed (fixes the "muted photos" Vern flagged in the Figma build):
the v1 pass resized with PIL but DROPPED embedded ICC profiles (Display P3 /
Camera RGB phone shots), so their pixel values were re-interpreted as sRGB in
Figma — visibly desaturated. v2 converts pixels INTO sRGB with littlecms
(perceptual intent) before saving, so a copy renders identically everywhere.

Also raised for print: MAXDIM 1600 -> 1800 (a 6x6" page at 300 DPI is exactly
1800 px full-bleed) and JPEG quality 82 -> 90. Decoded footprint for a full
Build stays ~0.5 GB (each 1800px image ~13 MB decoded), well under the
GPU-saturation ceiling that froze the workstation in Session 13.

A copy is made when the source is oversized (> MAXDIM) OR carries a
non-sRGB colour profile (those need pixel conversion even if small).
Sources that need neither stream as originals, untouched.

Writes copies to public/images/catalogue-figma/ + a manifest
(original /images URL -> copy URL) that generate_plugin.py remaps to.
The manifest is REBUILT for every URL currently in the layout; stale
entries for URLs no longer referenced are dropped (their files pruned).

Run from the worktree root:  python catalogue-finishing/downscale_figma_images.py
"""
import io
import json
from pathlib import Path

from PIL import Image, ImageCms, ImageOps

WT = Path(__file__).resolve().parent.parent
LAYOUT = WT / "catalog-print-build" / "figma-plugin" / "catalogue-layout.json"
PUB = WT / "public"
OUT = PUB / "images" / "catalogue-figma"
MANIFEST = OUT / "_manifest.json"
MAXDIM = 1800          # 6x6" @ 300 DPI full-bleed
JPEG_Q = 90            # print-grade; v1's 82 showed ringing on type-in-photo
SRGB = ImageCms.createProfile("sRGB")

# Copies that cannot be regenerated in every environment (source asset kept
# elsewhere); keep their existing manifest entries verbatim.
KEEP_AS_IS = {
    "/images/assets/logos/hubss-logos/hubss-logo-color.png",
    "/images/assets/logos/hubss-logos/hubss-logo-white-large.png",
}


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


def profile_desc(im) -> str:
    icc = im.info.get("icc_profile")
    if not icc:
        return ""
    try:
        return ImageCms.getProfileDescription(
            ImageCms.ImageCmsProfile(io.BytesIO(icc))
        ).strip()
    except Exception:  # noqa: BLE001
        return "unreadable"


def to_srgb(im):
    """Colour-managed conversion of any tagged image into sRGB pixels."""
    icc = im.info.get("icc_profile")
    if not icc:
        return im, False
    desc = profile_desc(im)
    if desc.startswith("sRGB"):
        return im, False  # already sRGB pixels; nothing to convert
    try:
        src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
        space = (getattr(src.profile, "xcolor_space", "") or "").strip()
        if space and space != im.mode.replace("A", ""):
            # Profile does not describe the pixels (e.g. a CMYK tag on RGB
            # data — a Save-for-Web slip): no transform is possible; the
            # wrong tag itself is the muting bug. Strip it on save.
            return im, True
        # True CMYK JPEGs (press scans, SWOP-tagged) and wide-gamut RGB
        # (Display P3 phone shots) both land here: transform straight from
        # the embedded profile into sRGB — never a naive .convert() first.
        out_mode = "RGBA" if im.mode in ("RGBA", "LA") else "RGB"
        out = ImageCms.profileToProfile(
            im, src, SRGB, renderingIntent=ImageCms.Intent.PERCEPTUAL,
            outputMode=out_mode,
        )
        return out, True
    except Exception as e:  # noqa: BLE001 — fall back to untouched pixels
        print(f"  ! icc convert failed ({desc}): {e} — keeping raw pixels")
        return im, False


def main() -> None:
    data = json.loads(LAYOUT.read_text(encoding="utf-8"))
    urls = set()
    collect(data, urls)
    # The layout may already reference /catalogue-figma/ copies from a prior
    # pass — resolve those back to their originals via the old manifest.
    old = {}
    if MANIFEST.exists():
        old = json.loads(MANIFEST.read_text(encoding="utf-8"))
    rev = {v: k for k, v in old.items()}
    originals = set()
    for rel in urls:
        if "/catalogue-figma/" in rel:
            src = rev.get(rel)
            if src:
                originals.add(src)
        else:
            originals.add(rel)

    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    saved = passthrough = converted = 0
    for rel in sorted(originals):
        if rel in KEEP_AS_IS and rel in old:
            manifest[rel] = old[rel]
            continue
        src = PUB / rel.lstrip("/")
        if not src.is_file() or src.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        try:
            im = Image.open(src)
            oversized = max(im.size) > MAXDIM
            tagged_non_srgb = bool(im.info.get("icc_profile")) and not profile_desc(im).startswith("sRGB")
            if not oversized and not tagged_non_srgb:
                passthrough += 1
                continue  # original streams as-is
            im = ImageOps.exif_transpose(im)
            im, did_convert = to_srgb(im)
            if did_convert:
                converted += 1
            if max(im.size) > MAXDIM:
                im.thumbnail((MAXDIM, MAXDIM), Image.LANCZOS)
            stem = rel[len("/images/"):].replace("/", "-").rsplit(".", 1)[0]
            keep_png = im.mode in ("RGBA", "LA") or (
                src.suffix.lower() == ".png" and im.mode == "P" and "transparency" in im.info
            )
            out = OUT / (stem + (".png" if keep_png else ".jpg"))
            if keep_png:
                if im.mode == "P":
                    im = im.convert("RGBA")
                im.save(out, "PNG", optimize=True)
            else:
                if im.mode != "RGB":
                    im = im.convert("RGB")
                im.save(out, "JPEG", quality=JPEG_Q, optimize=True, progressive=True)
            manifest[rel] = "/images/catalogue-figma/" + out.name
            saved += 1
        except Exception as e:  # noqa: BLE001
            print(f"  skip {rel}: {e}")

    # Prune copies no longer referenced by the manifest (stale v1 leftovers).
    keep_files = {Path(v).name for v in manifest.values()} | {"_manifest.json"}
    pruned = 0
    for f in OUT.iterdir():
        if f.is_file() and f.name not in keep_files:
            f.unlink()
            pruned += 1

    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    total = sum((OUT / Path(v).name).stat().st_size for v in manifest.values() if (OUT / Path(v).name).is_file())
    print(
        f"copies {saved} ({converted} colour-converted) · originals pass through {passthrough} · "
        f"pruned {pruned} stale · manifest {len(manifest)} entries · {total/1048576:.1f} MB total"
    )


if __name__ == "__main__":
    main()
