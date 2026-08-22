"""Stage B verification: live-text check, page dims, and side-by-side render
of the §3 defect pages — regenerated build vs stale staging baseline."""
import fitz  # PyMuPDF
from pathlib import Path

WT = Path(r"C:\Users\cleve\Based_Agency\_wt-catalogue-finishing")
REGEN = WT / "catalog-print-build" / "output" / "HUBSS_Catalogue_2026_v50.pdf"
BASELINE = WT / "catalogue-2026-finish" / "HUBSS-Catalogue-2026.pdf"
OUT = WT / "catalogue-finishing" / "compare"
OUT.mkdir(parents=True, exist_ok=True)

# Defect pages to compare (1-indexed per ISSUES/brief)
DEFECT_PAGES = [1, 28, 43, 64, 68, 83, 84, 95, 96]


def info(label, path):
    d = fitz.open(path)
    p0 = d[0].rect
    w_in, h_in = p0.width / 72, p0.height / 72
    print(f"\n=== {label} ===")
    print(f"  file: {path.name}  ({path.stat().st_size/1e6:.1f} MB)")
    print(f"  pages: {d.page_count}   trim: {w_in:.3f} x {h_in:.3f} in "
          f"({p0.width:.0f} x {p0.height:.0f} pt)")
    # live-text sample across a few content pages
    for pno in (4, 16, 17, 64):
        if pno <= d.page_count:
            t = d[pno - 1].get_text().strip()
            sample = t[:70].replace("\n", " ")
            print(f"  p{pno}: {len(t):4d} text chars | {sample!r}")
    return d


dr = info("REGENERATED (final_catalog.py)", REGEN)
db = info("STAGING BASELINE (served PDF)", BASELINE)

# Render defect pages from both at ~150 DPI
zoom = fitz.Matrix(150 / 72, 150 / 72)
for pno in DEFECT_PAGES:
    for tag, doc in (("regen", dr), ("base", db)):
        if pno <= doc.page_count:
            pix = doc[pno - 1].get_pixmap(matrix=zoom)
            f = OUT / f"p{pno:03d}_{tag}.png"
            pix.save(f)
print(f"\nRendered {len(DEFECT_PAGES)} defect pages x2 -> {OUT}")
print("Files:", ", ".join(sorted(p.name for p in OUT.glob("*.png"))))
