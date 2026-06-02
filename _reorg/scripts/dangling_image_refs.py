"""Quick check: image paths referenced from MDX bodies / frontmatter
that don't actually exist on disk. Pre-existing bugs surfaced for
Vernon's awareness — NOT fixed in this overnight pass.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BLOG = ROOT / "content" / "blog"
PUBLIC = ROOT / "public"

RE_IMG_PATH = re.compile(r'(/images/[^\s"\')]+\.(?:jpg|jpeg|png|webp|avif|gif|svg))')

missing = []
for mdx in sorted(BLOG.glob("*.mdx")):
    text = mdx.read_text(encoding="utf-8", errors="ignore")
    rel = mdx.relative_to(ROOT)
    for m in RE_IMG_PATH.finditer(text):
        ref = m.group(1)
        on_disk = PUBLIC / ref.lstrip("/")
        if not on_disk.exists():
            missing.append((str(rel).replace("\\", "/"), ref))

print(f"Total dangling image refs in content/blog/*.mdx: {len(missing)}\n")
for f, ref in missing[:50]:
    print(f"  {f}\n     -> {ref}")
if len(missing) > 50:
    print(f"\n  ... and {len(missing)-50} more")
