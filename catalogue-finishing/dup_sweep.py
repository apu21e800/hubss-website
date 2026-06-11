"""§3 duplicate sweep — perceptual-hash every flipbook page and report
exact/near-duplicate pairs (full-book audit for repeated photography).

Two complementary hashes (PIL-only, no numpy):
  - ahash 16x16 (average): catches same image re-exported/re-compressed
  - dhash 16x17 (gradient): robust to small brightness shifts

A pair is flagged when EITHER hamming distance falls under its threshold.
Text-led pages naturally cluster (same white layout), so pairs where both
pages are text archetypes are reported separately at a stricter threshold.

Usage: python dup_sweep.py [version]   (default v55)
"""
import sys
from pathlib import Path
from PIL import Image

WT = Path(__file__).resolve().parents[1]
VER = sys.argv[1] if len(sys.argv) > 1 else "v55"
DIR = WT / "public" / "catalogue" / VER

AHASH_T = 8      # of 256 bits — near-dup photo threshold
DHASH_T = 12     # of 272 bits


def ahash(im):
    g = im.convert("L").resize((16, 16), Image.LANCZOS)
    px = list(g.getdata())
    avg = sum(px) / len(px)
    return [1 if p > avg else 0 for p in px]


def dhash(im):
    g = im.convert("L").resize((17, 16), Image.LANCZOS)
    px = list(g.getdata())
    bits = []
    for r in range(16):
        row = px[r * 17:(r + 1) * 17]
        bits.extend(1 if row[i] > row[i + 1] else 0 for i in range(16))
    return bits


def ham(a, b):
    return sum(x != y for x, y in zip(a, b))


pages = sorted(DIR.glob("page-*.webp"))
print(f"{VER}: hashing {len(pages)} pages…")
H = {}
for p in pages:
    with Image.open(p) as im:
        im = im.convert("RGB").resize((256, 256), Image.LANCZOS)
        # mean saturation as a cheap "photo vs text-page" signal
        hsv = im.convert("HSV")
        sat = sum(hsv.getdata(1)) / (256 * 256)
        H[p.name] = (ahash(im), dhash(im), sat)

names = [p.name for p in pages]
photo_pairs, text_pairs = [], []
for i in range(len(names)):
    for j in range(i + 1, len(names)):
        a1, d1, s1 = H[names[i]]
        a2, d2, s2 = H[names[j]]
        da, dd = ham(a1, a2), ham(d1, d2)
        if da <= AHASH_T or dd <= DHASH_T:
            rec = (names[i], names[j], da, dd, round(s1), round(s2))
            # both low-saturation → likely same text archetype, not photo dup
            if s1 < 25 and s2 < 25:
                if da <= 2 and dd <= 3:
                    text_pairs.append(rec)
            else:
                photo_pairs.append(rec)

print(f"\n== PHOTO near-duplicates ({len(photo_pairs)}) ==")
for n1, n2, da, dd, s1, s2 in photo_pairs:
    print(f"  {n1} <-> {n2}   ahash {da}  dhash {dd}  sat {s1}/{s2}")
print(f"\n== TEXT-ARCHETYPE near-identical ({len(text_pairs)}) — layout twins, verify intent ==")
for n1, n2, da, dd, s1, s2 in text_pairs:
    print(f"  {n1} <-> {n2}   ahash {da}  dhash {dd}")
print("\ndone.")
