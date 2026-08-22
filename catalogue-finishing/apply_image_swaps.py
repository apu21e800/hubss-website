"""Stage B image swaps — approved scout picks. Assert-guarded.
Known-bad files (community-branding-03=TerryFox, crosswalks-26=UBC,
decomark-43=Surrey, durashield-04=US Ingles) stay on disk; we just stop
referencing them. New library files already copied into public/images.
"""
from pathlib import Path

CC = Path(__file__).resolve().parent.parent / "catalog-print-build" / "src" / "catalog_content.py"

EDITS = [
    ("p43 Community Branding app: community-branding-03 (Terry Fox) -> -09 (Coast Salish, Port Moody)",
     '_app_img("community-branding", 3)', '_app_img("community-branding", 9)'),
    ("p43 Community Branding app fallback: -08 -> -13 (Squamish + flag)",
     '_app_img("community-branding", 8)', '_app_img("community-branding", 13)'),
    ("p35 In-the-Field DPS right: community-branding-03 (Terry Fox) -> crosswalks-19 (Sherbrooke transit)",
     '"community-branding" / "community-branding-03.jpg"', '"crosswalks" / "crosswalks-19.jpg"'),
    ("p64 BC Children's detail: decomark-43 (Surrey logo) -> BCH labyrinth studio shot",
     '"detail": _pick(PRODUCTS_DIR / "decomark" / "decomark-43.jpg"),',
     '"detail": _pick(BLOG_DIR / "bc-childrens-hospital-labyrinth" / "detail.jpg", PRODUCTS_DIR / "decomark" / "decomark-43.jpg"),'),
    ("p68 York Region detail: crosswalks-26 (UBC) -> Vaughan/Woodbridge XD crosswalk",
     '_app_img("crosswalks", 26)', 'APPS_DIR / "crosswalks" / "vaughan-woodbridge-crosswalk.jpg"'),
    ("p96 White Rock Seaside detail: was hero-dup -> distinct angle (White Rock crosswalk-29)",
     '"detail": _pick(BLOG_DIR / "white-rock-langley-trafficpatterns" / "featured.jpg"),',
     '"detail": _pick(BLOG_DIR / "white-rock-langley-trafficpatterns" / "detail.jpg", BLOG_DIR / "white-rock-langley-trafficpatterns" / "featured.jpg"),'),
    ("p28 DuraShield hero: durashield-04 (US Ingles lot) -> durashield-11 (BC driveway)",
     '"hero": _pick(PRODUCTS_DIR / "durashield" / "durashield-04.jpg"),',
     '"hero": _pick(PRODUCTS_DIR / "durashield" / "durashield-11.jpg", PRODUCTS_DIR / "durashield" / "durashield-04.jpg"),'),
]


def main():
    txt = CC.read_text(encoding="utf-8")
    for label, old, new in EDITS:
        n = txt.count(old)
        assert n == 1, f"FAIL [{label}] expected 1, found {n}\n  OLD: {old[:80]!r}"
        txt = txt.replace(old, new)
        print(f"  OK  {label}")
    CC.write_text(txt, encoding="utf-8")
    print(f"\nApplied {len(EDITS)} image swaps.")


if __name__ == "__main__":
    main()
