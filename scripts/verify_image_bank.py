"""Diagnose mismatches between IMAGE_BANK keys (in figma-plugin/code.js)
and image paths referenced by EMBEDDED_DATA.

Mimics the plugin's JS lookup exactly:

    const parts = imagePath.split(/[\\/]/);
    const key2  = parts.slice(-2).join("/");
    const fname = parts[parts.length - 1];
    const b64   = IMAGE_BANK[key2] || IMAGE_BANK[fname] || IMAGE_BANK[imagePath];
"""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGIN = ROOT / "catalog-print-build" / "figma-plugin" / "code.js"

code = PLUGIN.read_text(encoding="utf-8")

# Extract IMAGE_BANK literal
ib_start = code.find("const IMAGE_BANK = ") + len("const IMAGE_BANK = ")
depth = 0
i = ib_start
ib_end = i
while i < len(code):
    if code[i] == "{":
        depth += 1
    elif code[i] == "}":
        depth -= 1
        if depth == 0:
            ib_end = i + 1
            break
    i += 1
bank = json.loads(code[ib_start:ib_end])

# Extract EMBEDDED_DATA literal
ed_start = code.find("const EMBEDDED_DATA = ") + len("const EMBEDDED_DATA = ")
depth = 0
i = ed_start
ed_end = i
while i < len(code):
    if code[i] == "{":
        depth += 1
    elif code[i] == "}":
        depth -= 1
        if depth == 0:
            ed_end = i + 1
            break
    i += 1
data = json.loads(code[ed_start:ed_end])


# Plugin's JS regex /[\\/]/  ==  Python r"[\\/]"  (split on \ OR /)
PATH_SPLIT = re.compile(r"[\\/]")


def keys_for(path: str) -> tuple[str, str]:
    parts = [p for p in PATH_SPLIT.split(path) if p]
    fname = parts[-1] if parts else path
    key2 = "/".join(parts[-2:]) if len(parts) >= 2 else fname
    return key2, fname


def all_image_paths(obj, acc=None):
    if acc is None:
        acc = []
    if isinstance(obj, dict):
        for v in obj.values():
            all_image_paths(v, acc)
    elif isinstance(obj, list):
        for v in obj:
            all_image_paths(v, acc)
    elif isinstance(obj, str):
        s = obj.lower()
        if s.endswith((".jpg", ".jpeg", ".png", ".webp", ".gif")):
            acc.append(obj)
    return acc


refs = all_image_paths(data)
unique_refs = list(dict.fromkeys(refs))  # preserve order, dedup

matched, missing = [], []
for r in unique_refs:
    key2, fname = keys_for(r)
    if key2 in bank or fname in bank or r in bank:
        matched.append((r, key2))
    else:
        missing.append((r, key2, fname))

print(f"IMAGE_BANK keys:                       {len(bank)}")
print(f"Unique image refs in EMBEDDED_DATA:    {len(unique_refs)}")
print(f"  matched (resolvable via lookup):     {len(matched)}")
print(f"  MISSING (would render as [PHOTO]):   {len(missing)}")

if missing:
    print("\nMissing references (first 20):")
    for r, k2, fn in missing[:20]:
        print(f"  ref:   {r}")
        print(f"  key2:  {k2}")
        print(f"  fname: {fn}")
        print()

# Optional: dump current bank keys for cross-check
if "--show-keys" in sys.argv:
    print("\nIMAGE_BANK keys present:")
    for k in sorted(bank.keys()):
        print(f"  {k}")
