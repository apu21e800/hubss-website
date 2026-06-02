"""Quick analytics on inventory.json — distributions, top duplicates,
size by dir, dimension histograms. Drives Phase 2 scoring heuristics."""

import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORTS = ROOT / "_reorg" / "reports"
inv = json.loads((REPORTS / "inventory.json").read_text(encoding="utf-8"))
images = inv["images"]

# Distribution by directory (full path of subfolder)
by_dir = defaultdict(list)
for r in images:
    parts = r["path"].split("/")
    # Group by first 4 parts to see subfolders inside applications/products
    key = "/".join(parts[:4]) if len(parts) >= 4 else "/".join(parts[:-1])
    by_dir[key].append(r)

print("\n=== TOP 25 DIRECTORIES BY COUNT ===")
sorted_dirs = sorted(by_dir.items(), key=lambda x: -len(x[1]))[:25]
for d, recs in sorted_dirs:
    size_mb = sum(r["size_bytes"] for r in recs) / (1024 * 1024)
    unref = sum(1 for r in recs if not r["is_referenced"])
    print(f"  {len(recs):4d}  {unref:4d}u  {size_mb:7.1f}MB  {d}")

# Size buckets
print("\n=== SIZE BUCKETS ===")
buckets = Counter()
for r in images:
    sb = r["size_bytes"]
    if sb < 50_000: buckets["<50KB"] += 1
    elif sb < 200_000: buckets["50-200KB"] += 1
    elif sb < 500_000: buckets["200-500KB"] += 1
    elif sb < 1_000_000: buckets["500KB-1MB"] += 1
    elif sb < 3_000_000: buckets["1-3MB"] += 1
    elif sb < 10_000_000: buckets["3-10MB"] += 1
    else: buckets[">10MB"] += 1
for k in ["<50KB", "50-200KB", "200-500KB", "500KB-1MB", "1-3MB", "3-10MB", ">10MB"]:
    print(f"  {k:12s} {buckets[k]:5d}")

# Dimensions: aspect ratio + megapixel buckets
print("\n=== MEGAPIXEL BUCKETS ===")
mp_b = Counter()
no_dims = 0
for r in images:
    if not r["width"] or not r["height"]:
        no_dims += 1
        continue
    mp = (r["width"] * r["height"]) / 1_000_000
    if mp < 0.1: mp_b["<0.1 MP"] += 1
    elif mp < 0.5: mp_b["0.1-0.5"] += 1
    elif mp < 1: mp_b["0.5-1"] += 1
    elif mp < 3: mp_b["1-3"] += 1
    elif mp < 8: mp_b["3-8"] += 1
    elif mp < 20: mp_b["8-20"] += 1
    else: mp_b[">20"] += 1
for k in ["<0.1 MP", "0.1-0.5", "0.5-1", "1-3", "3-8", "8-20", ">20"]:
    print(f"  {k:12s} {mp_b[k]:5d}")
print(f"  no dims:   {no_dims}")

# Reference signal: where do referenced images live?
print("\n=== REFERENCED VS UNREFERENCED BY TOP DIR ===")
top_levels = Counter()
ref_by_top = defaultdict(lambda: [0, 0])  # [ref, unref]
for r in images:
    parts = r["path"].split("/")
    if len(parts) > 3:
        top = f"{parts[0]}/{parts[1]}/{parts[2]}"
    else:
        top = "/".join(parts[:-1])
    if r["is_referenced"]:
        ref_by_top[top][0] += 1
    else:
        ref_by_top[top][1] += 1
sorted_top = sorted(ref_by_top.items(), key=lambda x: -(x[1][0] + x[1][1]))[:20]
for top, (ref, unref) in sorted_top:
    print(f"  {ref:4d} ref  {unref:4d} unref   {top}")

# Top duplicate groups
print("\n=== TOP 15 DUPLICATE GROUPS (md5 -> count) ===")
dups = json.loads((REPORTS / "inventory_summary.json").read_text(encoding="utf-8"))["duplicates"]
sorted_dups = sorted(dups.items(), key=lambda x: -len(x[1]))[:15]
for md5, files in sorted_dups:
    print(f"  x{len(files):3d}  {files[0]}")
    for f in files[1:4]:
        print(f"        - {f}")
    if len(files) > 4:
        print(f"        - ... and {len(files)-4} more")
