"""
Stage A — IMAGE-MANIFEST generator for the HUBSS Catalogue 2026 (v50 canvas).

Imports the LIVE content model (catalog_content.py) and resolves every placed
image to: page# (v50 build sequence), role, subject, resolved source path,
and an existence/authenticity status. Emits IMAGE-MANIFEST.csv.

Page numbers are computed from final_catalog.py build() order. Front + mid
(p1-p94) are render-anchored (White Rock Pier = p79 confirmed by code comment).
Back matter (p95+) is marked ~approx pending a render-confirmed folio map.
"""
import sys, csv, os
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE.parent / "catalog-print-build" / "src"
sys.path.insert(0, str(SRC))
import catalog_content as CC  # noqa: E402


def rel(p):
    s = str(p).replace("\\", "/")
    for marker in ("public/images/", "assets/booklet/", "catalog-print-build/"):
        i = s.find(marker)
        if i >= 0:
            return s[i:]
    return s


def status_for(p, note=""):
    if not (hasattr(p, "exists") and p.exists()):
        return "MISSING-FILE"
    r = rel(p)
    if "/blog/" in r:
        return "AUTHENTIC-BLOG"
    if "assets/booklet/" in r:
        return "BOOKLET-ASSET"
    if "/applications/" in r:
        return "APP-GALLERY"
    if "/products/" in r:
        return "PRODUCT-GALLERY"
    return "OTHER"


rows = []  # (page, section, subject, role, status, source_path)


def add(page, section, subject, role, p):
    rows.append((page, section, subject, role, status_for(p), rel(p)))


# ---- v50 folio map (from final_catalog.py build() sequence) -----------------
add("01", "Front", "Cover", "full-bleed", CC.COVER_PHOTO)

# DPS / section-opener images keyed by their build slot
opener_pages = {
    "products": "11", "applications": "36", "projects": "56",
    "network": "~95", "reference": "~102",
    "dps_a_left": "09", "dps_a_right": "10",
    "dps_b_left": "54", "dps_b_right": "55",
    "dps_c_left": "~100", "dps_c_right": "~101",
    "editorial_products": "34", "editorial_products_r": "35",   # "In the Field" DPS
    "editorial_projects": "75", "editorial_closing": "~108",     # "Every Mark" / closing DPS
}
for k, v in CC.SECTION_OPENERS.items():
    add(opener_pages.get(k, "~?"), "Opener/DPS", k, "full-bleed", v)

# Products: hero=12+2i, spec uses no image (typographic) — hero only
for i, pr in enumerate(CC.PRODUCTS):
    add(str(12 + 2 * i), "Product", pr["name"], "hero", pr["hero"])

# Applications: page 37+i, one feature image each
for i, ap in enumerate(CC.APPLICATIONS):
    add(str(37 + i), "Application", ap["name"], "feature", ap["image"])

# Projects: base = 57 + 2i + (2 if i>=9 else 0); hero=base, detail=base+1
for i, pj in enumerate(CC.PROJECTS):
    base = 57 + 2 * i + (2 if i >= 9 else 0)
    add(str(base), "Project", pj["name"], "hero", pj["hero"])
    if pj.get("detail"):
        add(str(base + 1), "Project", pj["name"], "detail/story", pj["detail"])

# Installers: ~96-99
for i, ins in enumerate(CC.INSTALLERS):
    add("~%d" % (96 + i), "Installer", ins["name"], "photo", ins["image"])

# ---- write CSV --------------------------------------------------------------
out = HERE / "IMAGE-MANIFEST.csv"
with open(out, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["page_v50", "section", "subject", "role", "status", "source_path"])
    for r in rows:
        w.writerow(r)

# ---- report -----------------------------------------------------------------
miss = [r for r in rows if r[4] == "MISSING-FILE"]
paths = Counter(r[5] for r in rows)
dups = {p: n for p, n in paths.items() if n > 1}

print("TOTAL IMAGE SLOTS:", len(rows))
print("DISTINCT SOURCE FILES:", len(paths))
print("MISSING FILES (primary pick absent):", len(miss))
for r in miss:
    print("   MISSING  p%-4s %-12s %-26s %s" % (r[0], r[1], r[2], r[5]))
print("DUPLICATE SOURCE FILES (used >1x):", len(dups))
for p, n in sorted(dups.items(), key=lambda x: -x[1]):
    used_by = [f"{r[1]}:{r[2]}({r[3]})@p{r[0]}" for r in rows if r[5] == p]
    print("   x%d  %s" % (n, p))
    for u in used_by:
        print("        -", u)
print("\nWrote:", out)
