"""
Image inventory for hubss-website.

For every image under /public/, record:
  - path (relative to repo root)
  - size_bytes
  - width / height (None if undecodable)
  - md5
  - mtime (ISO)
  - ext
  - references: list of code files that mention this image
  - reference_count
  - is_referenced (bool)

Code search scope: app/, components/, lib/, sanity/, content/
We match by basename AND by relative path tails ("/images/foo.jpg", "foo.jpg").

Output: _reorg/reports/inventory.json
"""

import hashlib
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    from PIL import Image  # type: ignore
    HAVE_PIL = True
except Exception:
    HAVE_PIL = False

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public"
REPORTS = ROOT / "_reorg" / "reports"
REPORTS.mkdir(parents=True, exist_ok=True)

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"}
CODE_DIRS = ["app", "components", "lib", "sanity", "content", "types"]

def md5_of(path: Path) -> str:
    h = hashlib.md5()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

def dimensions(path: Path):
    if not HAVE_PIL:
        return None, None
    try:
        with Image.open(path) as im:
            return im.width, im.height
    except Exception:
        return None, None

CODE_EXTS = {".ts", ".tsx", ".js", ".jsx", ".mdx", ".md", ".json"}
SKIP_DIRS = {"node_modules", ".next", ".git", "_reorg", "out", "dist"}

_CODE_INDEX: list[tuple[str, str]] | None = None  # (rel_path, contents)

def build_code_index():
    global _CODE_INDEX
    if _CODE_INDEX is not None:
        return _CODE_INDEX
    idx: list[tuple[str, str]] = []
    for d in CODE_DIRS:
        base = ROOT / d
        if not base.exists():
            continue
        for dirpath, dirnames, filenames in os.walk(base):
            dirnames[:] = [x for x in dirnames if x not in SKIP_DIRS]
            for fn in filenames:
                if Path(fn).suffix.lower() not in CODE_EXTS:
                    continue
                fp = Path(dirpath) / fn
                try:
                    text = fp.read_text(encoding="utf-8", errors="ignore")
                except Exception:
                    continue
                rel = str(fp.relative_to(ROOT)).replace("\\", "/")
                idx.append((rel, text))
    print(f"[inventory] indexed {len(idx)} code files", file=sys.stderr)
    _CODE_INDEX = idx
    return idx

def grep_code_for(basename: str, rel_unix: str):
    """Return list of code file paths that mention this image."""
    idx = build_code_index()
    # Match basename (broad). Tail match (e.g. "/images/foo.jpg") is implied
    # since the basename appears within any such tail.
    hits = []
    for rel, text in idx:
        if basename in text:
            hits.append(rel)
    return hits

def main():
    files = []
    for dirpath, _, filenames in os.walk(PUBLIC):
        for fn in filenames:
            ext = Path(fn).suffix.lower()
            if ext not in IMAGE_EXTS:
                continue
            files.append(Path(dirpath) / fn)
    files.sort()

    out = []
    total = len(files)
    print(f"[inventory] {total} images found", file=sys.stderr)
    for i, p in enumerate(files, 1):
        if i % 100 == 0 or i == total:
            print(f"[inventory] {i}/{total}", file=sys.stderr)
        rel = str(p.relative_to(ROOT)).replace("\\", "/")
        st = p.stat()
        w, h = dimensions(p)
        try:
            refs = grep_code_for(p.name, rel)
        except Exception as e:
            refs = [f"__ERR__:{e}"]
        rec = {
            "path": rel,
            "name": p.name,
            "ext": p.suffix.lower(),
            "size_bytes": st.st_size,
            "width": w,
            "height": h,
            "md5": md5_of(p),
            "mtime": datetime.fromtimestamp(st.st_mtime, tz=timezone.utc).isoformat(),
            "references": refs,
            "reference_count": len([r for r in refs if not r.startswith("__")]),
            "is_referenced": any(not r.startswith("__") for r in refs),
        }
        out.append(rec)

    target = REPORTS / "inventory.json"
    with target.open("w", encoding="utf-8") as f:
        json.dump({"generated_at": datetime.now(tz=timezone.utc).isoformat(),
                   "root": str(ROOT).replace("\\", "/"),
                   "count": len(out),
                   "images": out}, f, indent=2)
    print(f"[inventory] wrote {target} ({len(out)} records)", file=sys.stderr)

    # Summary report
    by_ext = {}
    by_dir = {}
    unref = 0
    dup_groups = {}
    total_bytes = 0
    for rec in out:
        by_ext[rec["ext"]] = by_ext.get(rec["ext"], 0) + 1
        d = "/".join(rec["path"].split("/")[:3])  # public/<x>/<y>
        by_dir[d] = by_dir.get(d, 0) + 1
        total_bytes += rec["size_bytes"]
        if not rec["is_referenced"]:
            unref += 1
        dup_groups.setdefault(rec["md5"], []).append(rec["path"])
    dups = {k: v for k, v in dup_groups.items() if len(v) > 1}
    summary = {
        "total_count": len(out),
        "total_size_mb": round(total_bytes / (1024 * 1024), 2),
        "by_ext": by_ext,
        "by_dir": by_dir,
        "unreferenced_count": unref,
        "duplicate_groups": len(dups),
        "duplicate_files": sum(len(v) for v in dups.values()),
    }
    with (REPORTS / "inventory_summary.json").open("w") as f:
        json.dump({"summary": summary, "duplicates": dups}, f, indent=2)
    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    main()
