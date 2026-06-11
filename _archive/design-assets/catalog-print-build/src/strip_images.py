"""
strip_images.py — Zero out IMAGE_BANK in code.js so Figma can load the plugin.

The embed_images step bakes ~70 MB of base64 photos into code.js, which exceeds
Figma's plugin sandbox limit and prevents the plugin from loading. This script
replaces IMAGE_BANK with an empty object, dropping the file back to a few MB.

Every photo slot degrades gracefully to a labelled beige [PHOTO] placeholder —
the plugin already handles this fallback. Vernon can drop real photos into the
Figma frames manually after the 100-page layout is built.

Usage:
    python -B -m src.strip_images
"""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGIN = ROOT / "figma-plugin" / "code.js"


def main():
    if not PLUGIN.exists():
        print(f"ERROR: {PLUGIN} not found")
        return

    before_mb = PLUGIN.stat().st_size / 1024 / 1024
    print(f"Reading code.js  ({before_mb:.1f} MB) …")

    code = PLUGIN.read_text(encoding="utf-8")

    if "const IMAGE_BANK" not in code:
        print("No IMAGE_BANK found — nothing to strip.")
        return

    # Replace the entire IMAGE_BANK declaration (can span many lines of base64)
    # with an empty object so every applyImageFillFromBank() call falls through
    # to the existing [PHOTO] placeholder path.
    stripped = re.sub(
        r"const IMAGE_BANK = \{.*?\};",
        "const IMAGE_BANK = {};  // stripped by strip_images.py — use placeholder fills",
        code,
        count=1,
        flags=re.DOTALL,
    )

    if stripped == code:
        print("Pattern not matched — IMAGE_BANK may be on one long line; trying line-start approach …")
        # Fallback: the regex above requires `.*?` to be non-greedy across the
        # whole blob. If it still doesn't match, find the start/end markers manually.
        start_marker = "const IMAGE_BANK = {"
        end_marker = "};\nconst EMBEDDED_DATA"
        start = code.find(start_marker)
        end   = code.find(end_marker)
        if start == -1 or end == -1:
            print("ERROR: could not locate IMAGE_BANK boundaries — aborting.")
            return
        replacement = (
            "const IMAGE_BANK = {};  "
            "// stripped by strip_images.py — use placeholder fills\n"
        )
        stripped = code[:start] + replacement + code[end + 2:]   # skip "};\n"

    PLUGIN.write_bytes(stripped.encode("utf-8"))
    after_mb = PLUGIN.stat().st_size / 1024 / 1024
    print(f"Done.  code.js: {before_mb:.1f} MB -> {after_mb:.1f} MB")
    print("Reload the plugin in Figma (right-click → Remove, then re-import manifest).")


if __name__ == "__main__":
    main()
