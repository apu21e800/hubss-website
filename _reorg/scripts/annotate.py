"""
Annotate inventory.json with:
  - quality_score (0..100) + bucket (A/B/C/D)
  - category (product / application / blog / hero / brand / misc / catalogue)
  - category_slug (e.g. 'streetbond', 'crosswalks', 'parks-paths')
  - aspect (landscape / portrait / square)
  - dup_count (within md5 group; 1 = unique)

Output: _reorg/reports/inventory_scored.json
"""
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORTS = ROOT / "_reorg" / "reports"

inv = json.loads((REPORTS / "inventory.json").read_text(encoding="utf-8"))
images = inv["images"]

# Build md5 -> count map
md5_count = defaultdict(int)
for r in images:
    md5_count[r["md5"]] += 1

# Categorize by path
def categorize(path: str):
    p = path.split("/")
    if len(p) < 2:
        return ("misc", None)
    # public/catalogue/...
    if p[1] == "catalogue":
        return ("catalogue", p[2] if len(p) > 2 else None)
    if p[1] != "images":
        return ("misc", None)
    if len(p) < 3:
        return ("misc", None)
    sub = p[2]
    slug = p[3] if len(p) > 3 else None
    if sub == "products":
        return ("product", slug)
    if sub == "applications":
        return ("application", slug)
    if sub == "blog":
        return ("blog", slug)
    if sub == "hero":
        return ("hero", None)
    if sub == "assets":
        return ("brand", slug)  # e.g. logos, installation-images
    if sub == "lunch-learn":
        return ("lunch-learn", None)
    if sub == "instagram":
        return ("instagram", None)
    if sub == "partners":
        return ("partner", None)
    if sub == "projects":
        return ("project", slug)
    return ("misc", sub)

# Score each image
def score(rec, dup_count):
    s = 0
    w, h = rec["width"], rec["height"]
    if w and h:
        mp = (w * h) / 1_000_000
        # Resolution: 0..40
        if mp >= 8: s += 40
        elif mp >= 3: s += 32
        elif mp >= 1: s += 22
        elif mp >= 0.5: s += 12
        elif mp >= 0.1: s += 5
        # Aspect: penalize ultra-narrow
        ratio = max(w, h) / max(1, min(w, h))
        if ratio > 4: s -= 8
        # Bonus for hero-friendly 16:9-ish or 3:2-ish landscape
        if w > h and 1.4 <= w / h <= 2.0: s += 5
    # File size: 0..15
    sb = rec["size_bytes"]
    if 200_000 <= sb <= 3_000_000: s += 15
    elif 100_000 <= sb < 200_000: s += 10
    elif 3_000_000 < sb <= 8_000_000: s += 8
    elif sb < 50_000: s -= 5  # tiny → low fidelity
    # Format preference
    if rec["ext"] in (".webp", ".avif"): s += 8
    elif rec["ext"] == ".jpg": s += 4
    elif rec["ext"] == ".png": s += 2
    elif rec["ext"] == ".svg":
        # SVGs are vector — flat 60 score, special case
        s = 60
    # Duplicate penalty: if it shares md5 with N others, the N-1 copies score lower
    if dup_count > 1:
        s -= 4  # mild — many dups are intentional cross-folder
    # Referenced bonus: code uses it
    if rec["is_referenced"]:
        s += 10
    return max(0, min(100, s))

def bucket(score):
    if score >= 55: return "A"
    if score >= 38: return "B"
    if score >= 22: return "C"
    return "D"

def aspect(w, h):
    if not w or not h:
        return None
    r = w / h
    if 0.95 <= r <= 1.05:
        return "square"
    return "landscape" if r > 1 else "portrait"

# Annotate
for r in images:
    r["dup_count"] = md5_count[r["md5"]]
    r["category"], r["category_slug"] = categorize(r["path"])
    r["aspect"] = aspect(r["width"], r["height"])
    r["quality_score"] = score(r, r["dup_count"])
    r["bucket"] = bucket(r["quality_score"])

# Write annotated inventory
out = {"generated_at": inv["generated_at"], "count": len(images), "images": images}
(REPORTS / "inventory_scored.json").write_text(json.dumps(out, indent=2), encoding="utf-8")

# Summary
from collections import Counter
b = Counter(r["bucket"] for r in images)
cat = Counter(r["category"] for r in images)
print("=== BUCKETS ===")
for k in ["A", "B", "C", "D"]:
    print(f"  {k}: {b[k]:5d}")
print("\n=== CATEGORIES ===")
for c, n in cat.most_common():
    print(f"  {c:12s} {n:5d}")
# Distribution of bucket-per-category
print("\n=== BUCKET BY CATEGORY ===")
cat_b = defaultdict(Counter)
for r in images:
    cat_b[r["category"]][r["bucket"]] += 1
for c, counts in sorted(cat_b.items()):
    print(f"  {c:12s} A:{counts['A']:4d} B:{counts['B']:4d} C:{counts['C']:4d} D:{counts['D']:4d}")
print(f"\nWrote {REPORTS / 'inventory_scored.json'}")
