"""Tier-1 audit of every page.tsx route in the hubss-website app.

Findings categories:
  - BROKEN_IMAGE  : a static image path that doesn't exist on disk
  - MISSING_ALT   : an <img> or <Image> element without an alt prop
  - RAW_IMG_TAG   : a raw <img> tag where <Image> should be used
  - DEAD_LINK     : a <Link href> or anchor that points to a missing app route
  - PUBLIC_PREFIX : a path written as "/public/..." (Next.js serves /public from root, so this should be "/...")
  - MISSING_META  : a route page lacking exported metadata

Output: _reorg/reports/route_audit.json + markdown summary
"""
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
APP = ROOT / "app"
PUBLIC = ROOT / "public"
REPORTS = ROOT / "_reorg" / "reports"
REPORTS.mkdir(parents=True, exist_ok=True)

# Patterns
RE_IMG_PATH = re.compile(r'["\'`](/(?:images|docs|catalogue)/[^"\'`\s)]+|/public/[^"\'`\s)]+)["\'`]')
RE_IMG_TAG = re.compile(r"<(img|Image)\b([^/>]*?)/?>", re.DOTALL)
RE_ALT = re.compile(r'\balt\s*=\s*[{"\']')
RE_LINK_HREF = re.compile(r'<Link\b[^>]*?\bhref\s*=\s*["\'`]([^"\'`]+)["\'`]')
RE_ANCHOR = re.compile(r'<a\b[^>]*?\bhref\s*=\s*["\'`]([^"\'`]+)["\'`]')
RE_METADATA_EXPORT = re.compile(r'\bexport\s+(?:const|async\s+function)\s+(metadata|generateMetadata)\b')

def collect_pages():
    pages = sorted([p for p in APP.rglob("page.tsx")])
    layouts = sorted([p for p in APP.rglob("layout.tsx")])
    components = sorted([p for p in (ROOT / "components").rglob("*.tsx")])
    return pages + layouts + components

# Build set of all app routes for dead-link check (approximate)
def known_routes():
    routes = {"/"}
    for p in APP.rglob("page.tsx"):
        rel = p.parent.relative_to(APP)
        parts = []
        for part in rel.parts:
            if part.startswith("(") and part.endswith(")"):
                continue  # route group
            if part.startswith("[") and part.endswith("]"):
                parts.append(part)  # keep dynamic marker
                continue
            parts.append(part)
        if not parts:
            routes.add("/")
        else:
            routes.add("/" + "/".join(parts))
    return routes

ROUTES = known_routes()

def route_matches(href, routes):
    """True if href maps to a known route (ignoring dynamic segments)."""
    if not href.startswith("/"):
        return True  # external or fragment
    if href.startswith("//") or href.startswith("/http"):
        return True
    # Strip query / hash
    base = href.split("?")[0].split("#")[0].rstrip("/")
    if base == "":
        base = "/"
    # Direct match
    if base in routes:
        return True
    # Match against dynamic patterns
    base_parts = base.split("/")
    for r in routes:
        rparts = r.split("/")
        if len(rparts) != len(base_parts):
            continue
        ok = True
        for rp, bp in zip(rparts, base_parts):
            if rp.startswith("[") and rp.endswith("]"):
                continue
            if rp != bp:
                ok = False
                break
        if ok:
            return True
    return False

def audit(page_path):
    text = page_path.read_text(encoding="utf-8", errors="ignore")
    rel = str(page_path.relative_to(ROOT)).replace("\\", "/")
    findings = []
    # Broken images
    for m in RE_IMG_PATH.finditer(text):
        raw = m.group(1)
        # Strip /public/ prefix if mistakenly used
        if raw.startswith("/public/"):
            findings.append({"type": "PUBLIC_PREFIX", "value": raw, "file": rel})
            check_path = PUBLIC / raw[len("/public/"):]
        else:
            check_path = PUBLIC / raw.lstrip("/")
        if not check_path.exists():
            findings.append({"type": "BROKEN_IMAGE", "value": raw, "expected_path": str(check_path.relative_to(ROOT)).replace("\\", "/"), "file": rel})
    # img / Image tags
    for m in RE_IMG_TAG.finditer(text):
        tag, attrs = m.group(1), m.group(2)
        if tag == "img":
            findings.append({"type": "RAW_IMG_TAG", "value": m.group(0)[:120], "file": rel})
        if not RE_ALT.search(attrs):
            findings.append({"type": "MISSING_ALT", "value": m.group(0)[:120], "file": rel})
    # Dead links — only flag absolute internal hrefs
    for pat in (RE_LINK_HREF, RE_ANCHOR):
        for m in pat.finditer(text):
            href = m.group(1)
            # Skip template literals with ${}
            if "${" in href:
                continue
            if href.startswith("/") and not href.startswith("//") and not route_matches(href, ROUTES):
                findings.append({"type": "DEAD_LINK", "value": href, "file": rel})
    # Metadata — only flag for app/ page.tsx routes that should be indexable
    if page_path.name == "page.tsx" and str(page_path).startswith(str(APP)):
        if not RE_METADATA_EXPORT.search(text):
            path_norm = str(page_path).replace("\\", "/")
            # Skip dynamic routes, admin, studio
            if "[" in str(page_path) or "/admin/" in path_norm or "/studio/" in path_norm:
                pass
            # Skip pages whose sibling layout.tsx exports metadata (Next.js inherits)
            elif (page_path.parent / "layout.tsx").exists() and RE_METADATA_EXPORT.search(
                (page_path.parent / "layout.tsx").read_text(encoding="utf-8", errors="ignore")
            ):
                pass
            else:
                # Also skip pages that are pure redirects (no real content surface)
                if "redirect(" in text and len(text.strip().splitlines()) <= 10:
                    pass
                else:
                    findings.append({"type": "MISSING_META", "value": rel, "file": rel})
    return findings

def main():
    all_findings = []
    for p in collect_pages():
        all_findings.extend(audit(p))
    # Group by type
    by_type = {}
    for f in all_findings:
        by_type.setdefault(f["type"], []).append(f)
    out = {
        "scanned": len(collect_pages()),
        "total_findings": len(all_findings),
        "by_type": {k: len(v) for k, v in by_type.items()},
        "findings": all_findings,
    }
    (REPORTS / "route_audit.json").write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"Scanned {len(collect_pages())} route files")
    print(f"Total findings: {len(all_findings)}")
    for k, v in sorted(by_type.items()):
        print(f"  {k:15s} {len(v):4d}")
    # Print top examples per type
    for t in ["BROKEN_IMAGE", "PUBLIC_PREFIX", "DEAD_LINK", "RAW_IMG_TAG", "MISSING_ALT", "MISSING_META"]:
        if t not in by_type:
            continue
        print(f"\n--- {t} (first 8) ---")
        for f in by_type[t][:8]:
            print(f"  {f['file']}: {str(f.get('value',''))[:80]}")

if __name__ == "__main__":
    main()
