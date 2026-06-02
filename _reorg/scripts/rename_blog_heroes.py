"""Image SEO: rename every blog hero from featured.<ext> to <slug>.<ext>.

For each /images/blog/<slug>/featured.<ext>:
  - git mv the file to /images/blog/<slug>/<slug>.<ext>
  - rewrite every code/markdown/json reference that names that path

References live in MDX frontmatter (featuredImage:), TSX components
(InstagramStrip, Nav, gallery), TS data files (map-projects, sitemap),
and a JSON OG companion or two. We walk a scoped tree and apply
deterministic string replacements.

Excluded from rewriting:
  - _reorg/* (overnight scratch — reports intentionally snapshot the old paths)
  - scripts/image-audit-data.json + IMAGE-AUDIT.md (pinned audit artifacts)
  - node_modules, .next, .git, _archive
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BLOG_IMG_ROOT = ROOT / "public" / "images" / "blog"

# Collect: slug -> (relative_old_path, relative_new_path, ext)
renames = []
for slug_dir in sorted(BLOG_IMG_ROOT.iterdir()):
    if not slug_dir.is_dir():
        continue
    slug = slug_dir.name
    for f in slug_dir.iterdir():
        if f.is_file() and f.stem == "featured":
            ext = f.suffix.lower()
            new_name = f"{slug}{ext}"
            new_path = slug_dir / new_name
            if new_path.exists():
                print(f"[skip] {f} -> {new_path} (target already exists)")
                continue
            old_rel = str(f.relative_to(ROOT)).replace("\\", "/")
            new_rel = str(new_path.relative_to(ROOT)).replace("\\", "/")
            renames.append((slug, f, new_path, old_rel, new_rel, ext))

print(f"[rename] {len(renames)} blog hero files to rename")

# Step 1 — git mv every file
for slug, old, new, old_rel, new_rel, ext in renames:
    res = subprocess.run(
        ["git", "mv", str(old), str(new)],
        cwd=ROOT, capture_output=True, text=True,
    )
    if res.returncode != 0:
        print(f"[ERR] git mv {old_rel} -> {new_rel}: {res.stderr.strip()}")
        sys.exit(1)

# Step 2 — rewrite references across the codebase
TARGET_EXTS = {".ts", ".tsx", ".js", ".jsx", ".mdx", ".md", ".json"}
SKIP_DIRS = {"node_modules", ".next", ".git", "_archive", "_reorg"}
SKIP_FILES = {
    str(ROOT / "scripts" / "image-audit-data.json").replace("\\", "/"),
    str(ROOT / "IMAGE-AUDIT.md").replace("\\", "/"),
}

changed_files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for fn in filenames:
        if Path(fn).suffix.lower() not in TARGET_EXTS:
            continue
        fp = Path(dirpath) / fn
        norm = str(fp).replace("\\", "/")
        if norm in SKIP_FILES:
            continue
        try:
            text = fp.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        original = text
        for slug, old, new, old_rel, new_rel, ext in renames:
            old_url = f"/images/blog/{slug}/featured{ext}"
            new_url = f"/images/blog/{slug}/{slug}{ext}"
            if old_url in text:
                text = text.replace(old_url, new_url)
        if text != original:
            fp.write_text(text, encoding="utf-8")
            changed_files.append(str(fp.relative_to(ROOT)).replace("\\", "/"))

print(f"[refs] rewrote {len(changed_files)} files:")
for f in sorted(changed_files):
    print(f"   - {f}")
