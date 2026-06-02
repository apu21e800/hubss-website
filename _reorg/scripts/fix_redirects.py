"""Rewrite next.config.ts: replace every broken /blog/<slug> redirect
destination with a semantically-relevant existing route.

Each mapping was derived by hand from content/blog/ (existing posts) +
lib/applications.ts + lib/products.ts slug lists. Where no good blog
match exists, route to the closest application/product page — better
than 404 + lossy than /blog index.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CFG = ROOT / "next.config.ts"

# broken slug (without /blog/ prefix) -> new destination path
REMAP = {
    "surface-solutions-school-playgrounds": "/applications/playgrounds",
    "decorative-asphalt-communities": "/blog/community-branding-case-study",
    "asphalt-coatings-parks-plazas": "/applications/parks-paths",
    "streetbondsr-cooler-asphalt": "/blog/streetbondsr-solar-reflective-coatings",
    "enhancing-transit-hubs-gta-vancouver": "/blog/safety-durability-transit-stations",
    "rutland-centennial-park-kelowna": "/applications/parks-paths",
    "societe-transport-saguenay": "/blog/durable-transit-lanes-crossings",
    "bikeway-intersection": "/applications/bike-lanes",
    "decorative-asphalt-renewal": "/blog/asphalt-concrete-renewal",
    "asphalt-coatings-playgrounds": "/applications/playgrounds",
    "west-vancouver-rainbow-crosswalk": "/blog/simcoe-rainbow-crosswalk",
    "ackerys-alley-orpheum-laneway": "/blog/laneway-project",
    "stamped-asphalt-2-years-wear": "/blog/stamped-asphalt-vs-concrete",
    "ralphs-farm-market-parking-lot": "/applications/parking-lots",
    "squamish-nation-rainbow-crosswalk": "/blog/simcoe-rainbow-crosswalk",
    "melfort-waterpark-splash-pad": "/applications/splash-pads",
    "victoria-harbour-walkway": "/applications/parks-paths",
    "sports-court-asphalt-paving": "/applications/sport-courts",
    "rainbow-crosswalk-sechelt": "/blog/simcoe-rainbow-crosswalk",
    "white-rock-stamped-pathway": "/blog/white-rock-langley-trafficpatterns",
    "checkerboard-crosswalk-coquitlam": "/applications/crosswalks",
    "first-nations-crosswalk-granville": "/blog/ubc-musqueam-crosswalk",
    "lickman-interchange-roundabout": "/applications/traffic-calming",
    "stamped-asphalt-viva-next": "/blog/durable-transit-lanes-crossings",
    "decorative-paving-townhomes": "/applications/townhomes",
    "decorative-paving-public-art-joyce": "/applications/public-art",
    "residential-decorative-paving": "/applications/residential-driveways",
    "laneway-revitalization-vancouver": "/blog/laneway-project",
    "residential-decorative-driveways": "/applications/residential-driveways",
    "decorative-paving-playgrounds": "/applications/playgrounds",
    "parking-lot-wayfinding": "/applications/parking-lots",
    "durable-coatings-asphalt": "/blog/durable-coatings-waterparks",
    "stamped-asphalt-decorative-crosswalks": "/applications/crosswalks",
    "enhanced-parking-lot-surfaces": "/applications/parking-lots",
}

text = CFG.read_text(encoding="utf-8")
original = text
changed = 0
for slug, new_dest in REMAP.items():
    old_dest_quoted = f'destination: "/blog/{slug}"'
    new_dest_quoted = f'destination: "{new_dest}"'
    if old_dest_quoted not in text:
        print(f"  MISS (not in file): {slug}")
        continue
    # Replace ALL occurrences — some redirect destinations are shared by
    # both the legacy /<slug> AND a /projects/<slug> source.
    count = text.count(old_dest_quoted)
    text = text.replace(old_dest_quoted, new_dest_quoted)
    changed += count
    print(f"  fixed x{count}: /blog/{slug} -> {new_dest}")

CFG.write_text(text, encoding="utf-8")
print(f"\nTotal lines changed: {changed}")
