"""Typography audit — extracts every text-draw call from the pipeline source
(per-archetype role inventory: size / weight / leading / tracking / case) and
cross-checks against the rendered PDF's span ground truth (which resolves the
dynamic sizes the static scan can't). Output: stdout markdown for TYPE-AUDIT.md.
"""
import ast
import sys
from pathlib import Path
from collections import Counter, defaultdict

sys.stdout.reconfigure(encoding="utf-8")  # Windows cp1252 console guard

WT = Path(__file__).resolve().parents[1]
SRC = WT / "catalog-print-build" / "src" / "final_catalog.py"
PDF = WT / "catalog-print-build" / "output" / "HUBSS_Catalogue_2026_v50.pdf"

code = SRC.read_text(encoding="utf-8")
tree = ast.parse(code)


def seg(node):
    if node is None:
        return "—"
    s = ast.get_source_segment(code, node)
    return " ".join(s.split()) if s else "?"


rows = []  # (archetype, call, text-hint, size, weight, leading, tracking)
for fn in ast.walk(tree):
    if not isinstance(fn, ast.FunctionDef):
        continue
    for node in ast.walk(fn):
        if not isinstance(node, ast.Call):
            continue
        name = getattr(node.func, "id", getattr(node.func, "attr", ""))
        if name not in ("draw_text_block", "tracked_caps"):
            continue
        kw = {k.arg: k.value for k in node.keywords}
        # text hint = 2nd positional arg
        hint = seg(node.args[1])[:38] if len(node.args) > 1 else "?"
        if name == "tracked_caps":
            size = seg(kw.get("size"))
            rows.append((fn.name, "caps", hint, size, "600(B)", "—", "2.4", "CAPS"))
        else:
            rows.append((fn.name, "text", hint,
                         seg(kw.get("font_size_figma")),
                         seg(kw.get("weight")) if kw.get("weight") is not None else "400(M)",
                         seg(kw.get("leading_figma")) if kw.get("leading_figma") is not None else "auto(1.25)",
                         seg(kw.get("tracking")) if kw.get("tracking") is not None else "0",
                         "mixed"))

print("## A — Source inventory (every text-draw call, by archetype)\n")
print("| archetype | kind | text hint | size(figma) | weight | leading | tracking |")
print("|---|---|---|---|---|---|---|")
cur = None
for r in rows:
    arch = r[0] if r[0] != cur else ""
    cur = r[0]
    print(f"| {arch} | {r[1]} | `{r[2]}` | {r[3]} | {r[4]} | {r[5]} | {r[6]} |")

# numeric-size histograms from source (static sizes only)
static_sizes = Counter()
for r in rows:
    try:
        static_sizes[float(r[3])] += 1
    except ValueError:
        pass
print("\n## B — Static size histogram (figma units → pt ×0.96)\n")
print("| figma | pt | calls |")
print("|---|---|---|")
for s in sorted(static_sizes):
    print(f"| {s} | {s*0.96:.1f} | {static_sizes[s]} |")

dyn = [r for r in rows if not r[3].replace('.', '', 1).isdigit()]
print(f"\n## C — Dynamic/computed sizes ({len(dyn)} calls)\n")
for r in dyn:
    print(f"- `{r[0]}` → `{r[2]}`: size = `{r[3]}`")

# PDF ground truth
if PDF.exists():
    import fitz
    doc = fitz.open(PDF)
    pdf_sizes = Counter()
    fonts = Counter()
    for pno in range(doc.page_count):
        for b in doc[pno].get_text("dict")["blocks"]:
            if b.get("type") != 0:
                continue
            for ln in b["lines"]:
                for sp in ln["spans"]:
                    if sp["text"].strip():
                        pdf_sizes[round(sp["size"], 1)] += 1
                        fonts[sp["font"]] += 1
    print("\n## D — Rendered ground truth (PDF spans)\n")
    print("| pt | spans |")
    print("|---|---|")
    for s in sorted(pdf_sizes):
        print(f"| {s} | {pdf_sizes[s]} |")
    print("\n**Fonts:**", dict(fonts))
