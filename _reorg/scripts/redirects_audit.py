"""Cross-reference every redirect in next.config.ts against the actual
content/blog/ MDX files. Any /blog/<slug> destination whose <slug>.mdx
does NOT exist will 404 + noindex → SEO leak.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CFG = ROOT / "next.config.ts"
BLOG = ROOT / "content" / "blog"

text = CFG.read_text(encoding="utf-8")
# Pull every (source, destination) pair
pairs = re.findall(r'source:\s*"([^"]+)"\s*,\s*destination:\s*"([^"]+)"', text)

blog_slugs = {p.stem for p in BLOG.glob("*.mdx")}
broken = []
ok_blog = 0
for src, dest in pairs:
    if not dest.startswith("/blog/"):
        continue
    slug = dest[len("/blog/"):]
    # Skip wildcard captures like :path*
    if ":" in slug or "*" in slug:
        continue
    if slug not in blog_slugs:
        broken.append((src, dest))
    else:
        ok_blog += 1

print(f"Total redirects checked: {len(pairs)}")
print(f"Blog destinations OK: {ok_blog}")
print(f"BROKEN blog destinations: {len(broken)}")
print()
for src, dest in broken:
    print(f"  {src}  ->  {dest}")
