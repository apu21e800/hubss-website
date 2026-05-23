"""Export catalog content as JSON for the Figma plugin."""
import json
from pathlib import Path
from . import catalog_content as CC

OUT = Path(__file__).resolve().parent.parent / "output" / "catalog_data.json"


def path_str(p):
    if p is None:
        return None
    p = Path(p) if not isinstance(p, Path) else p
    return str(p) if p.exists() else None


def main():
    ROOT = Path(__file__).resolve().parent.parent
    BRAND = ROOT.parent / "public" / "images" / "assets" / "logos" / "hubss-logos"
    ASPHALT = ROOT.parent / "public" / "images" / "applications" / "parking-lots" / "parking-lots-01.jpg"
    data = {
        "manifesto": CC.MANIFESTO,
        "why_hub": CC.WHY_HUB,
        "cover_photo": path_str(CC.COVER_PHOTO),
        "section_openers": {k: path_str(v) for k, v in CC.SECTION_OPENERS.items()},
        "brand": {
            "logo_white": path_str(BRAND / "hubss-logo-white-large.png"),
            "logo_color": path_str(BRAND / "hubss-logo-color.png"),
            "asphalt_photo": path_str(ASPHALT),
            "mascot": path_str(ROOT / "assets" / "moose-mascot.png"),
            "qr_lunch_learn": path_str(ROOT / "assets" / "hubss-lunch-learn-qr.png"),
        },
        "products": [
            {
                "name": p["name"],
                "manufacturer": p.get("manufacturer", ""),
                "tagline": p["tagline"],
                "title": p["title"],
                "italic": p["italic"],
                "callout": p["callout"],
                "callout_unit": p["callout_unit"],
                "body": p["body"],
                "uses": p["uses"],
                "spec_pairs": p.get("spec_pairs") or [],
                "hero": path_str(p.get("hero")),
            }
            for p in CC.PRODUCTS
        ],
        "applications": [
            {
                "name": a["name"],
                "tagline": a["tagline"],
                "body": a["body"],
                "image": path_str(a.get("image")),
            }
            for a in CC.APPLICATIONS
        ],
        "projects": [
            {
                "name": pr["name"],
                "location": pr["location"],
                "product": pr["product"],
                "title": pr["title"],
                "story": pr["story"],
                "hero": path_str(pr.get("hero")),
                "detail": path_str(pr.get("detail")),
            }
            for pr in CC.PROJECTS
        ],
        "installers": [
            {
                "name": i["name"],
                "region": i["region"],
                "body": i["body"],
                "url": i["url"],
                "phone": i["phone"],
                "image": path_str(i.get("image")),
                "logo": path_str(i.get("logo")),
            }
            for i in CC.INSTALLERS
        ],
        "cities": CC.CITIES,
    }
    OUT.write_text(json.dumps(data, indent=2))
    print(f"Wrote {OUT}  ({OUT.stat().st_size // 1024} KB)")
    # v29: flag installers without a brand logo — Vernon supplies later.
    missing = [i["name"] for i in CC.INSTALLERS if not path_str(i.get("logo"))]
    if missing:
        print(f"  [v29] Installer logos needed (drop PNGs into assets/installer-logos/):")
        for n in missing:
            stem = data["installers"][[ii["name"] for ii in data["installers"]].index(n)]["url"].split(".")[0]
            print(f"        - {n}  ->  assets/installer-logos/{stem}.png")


if __name__ == "__main__":
    main()
