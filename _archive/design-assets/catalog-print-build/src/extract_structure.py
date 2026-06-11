"""
Extract a richer structure dump from /tmp/figma_full.json.

Now captures:
  - texts (as before)
  - image_placeholders: FRAME nodes named 'ImagePlaceholder' with their bbox
    AND the descriptor text inside them. THESE are the real image regions.
  - All output goes to /tmp/figma_structure_v2.json
"""
import json
import re
from pathlib import Path

INPUT = Path("/tmp/figma_full.json")
OUTPUT = Path("/tmp/figma_structure_v2.json")


def is_image_placeholder_node(n):
    """A FRAME named 'ImagePlaceholder' is the real image region."""
    return n.get("type") == "FRAME" and n.get("name") == "ImagePlaceholder"


def walk(node):
    yield node
    for c in node.get("children", []):
        yield from walk(c)


def extract_descriptor(placeholder_node):
    """Find the descriptor text inside the ImagePlaceholder frame."""
    for n in walk(placeholder_node):
        if n.get("type") == "TEXT":
            return (n.get("characters") or "").strip()
    return ""


def main():
    d = json.load(open(INPUT))
    pub = d["document"]["children"][0]

    # All page frames (450x450 top-level FRAMEs with names like '0-Front Cover', '3', '71 - Back Cover')
    page_frames = []
    for f in pub["children"]:
        bb = f.get("absoluteBoundingBox") or {}
        if f.get("type") == "FRAME" and round(bb.get("width", 0)) == 450 and round(bb.get("height", 0)) == 450:
            page_frames.append(f)

    def sort_key(p):
        n = p.get("name", "")
        m = re.match(r"^(\d+)", n)
        return (int(m.group(1)) if m else 9999, n)
    page_frames.sort(key=sort_key)

    pages = []
    for page in page_frames:
        pbb = page["absoluteBoundingBox"]
        px, py = pbb["x"], pbb["y"]

        texts = []
        placeholders = []

        for n in walk(page):
            if n is page:
                continue
            nbb = n.get("absoluteBoundingBox") or {}
            if not nbb:
                continue

            # ImagePlaceholder frames -> these are the REAL image regions
            if is_image_placeholder_node(n):
                desc = extract_descriptor(n)
                placeholders.append({
                    "id": n.get("id"),
                    "rel_x": nbb["x"] - px,
                    "rel_y": nbb["y"] - py,
                    "w": nbb["width"],
                    "h": nbb["height"],
                    "description": desc,
                })
                continue

            # Text nodes (skip texts that are inside an ImagePlaceholder — those are descriptors)
            if n.get("type") == "TEXT":
                content = (n.get("characters") or "").strip()
                if not content:
                    continue
                # Skip "IMAGE: ..." placeholder annotation texts — we have the
                # placeholder via FRAME extraction now.
                if content.lower().startswith("image"):
                    continue
                style = n.get("style") or {}
                texts.append({
                    "id": n.get("id"),
                    "name": n.get("name"),
                    "text": content,
                    "size": style.get("fontSize"),
                    "rel_x": nbb["x"] - px,
                    "rel_y": nbb["y"] - py,
                    "w": nbb["width"],
                    "h": nbb["height"],
                })

        pages.append({
            "id": page["id"],
            "name": page["name"],
            "texts": texts,
            "image_placeholders": placeholders,
        })

    OUTPUT.write_text(json.dumps(pages, indent=2))
    print(f"Wrote {len(pages)} pages to {OUTPUT}")
    print(f"Total ImagePlaceholders: {sum(len(p['image_placeholders']) for p in pages)}")
    print(f"Total real texts: {sum(len(p['texts']) for p in pages)}")
    # Show distribution
    print("\nPlaceholders per page (first 30):")
    for p in pages[:30]:
        print(f"  {p['name']:<25} {len(p['image_placeholders'])} placeholders, {len(p['texts'])} texts")


if __name__ == "__main__":
    main()
