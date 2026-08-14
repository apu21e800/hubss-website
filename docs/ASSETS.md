# HUBSS Asset System — where everything lives and how to manage it

This is the operating manual for site assets. The companion inventory
(counts + sizes per folder) is `docs/ASSET-INVENTORY.md` — regenerate it
anytime with `npm run assets:inventory`.

## The one idea

**Folders are the galleries.** Product and application galleries are read
from their image folders at build time. You curate by managing files —
no code edits, no arrays:

- **Add a photo** → drop it in the folder → commit + push → it's live.
- **Remove a photo** → delete the file (or prefix it `_` to hide without
  deleting) → commit + push → gone.
- **Order** → natural filename sort (`crosswalks-2` before `crosswalks-10`).
  Number prefixes control order.

Rules (enforced by `lib/asset-scan.ts`): only `.jpg .jpeg .png .webp` count;
filenames containing `logo` and files starting with `_` are skipped; the
page's hero image is excluded from its own gallery automatically.

## The map

```
public/
├── images/
│   ├── products/<product-slug>/     ← one folder per product = its gallery
│   │     <anything>.jpg             (numbered names recommended: streetbond-01.jpg)
│   │     <product>-logo.svg|png     (logos excluded from galleries by name)
│   ├── applications/<app-slug>/     ← one folder per application = its gallery
│   ├── blog/<post-slug>/            ← featured.jpg + any inline images for that post
│   ├── patterns/                    ← StreetPrint template sheets (white-on-alpha PNGs)
│   ├── hero/                        ← homepage hero slides
│   ├── logos/  partners/  flags/    ← brand, partner, locale marks
│   ├── lunch-learn/  about/  instagram/  textures/  icons/
│   ├── projects/                    ← map/case-study images (lib/map-projects.ts)
│   └── assets/                      ← legacy misc — prune candidate, don't add here
└── docs/<ProductLine>/…             ← resource-library PDFs (shown on /resources)
```

Notes on shared folders: `pedestrian-safety` shows the `crosswalks` folder;
`public-art` shows `community-branding`. That's intentional (same photo pool).

## What still lives in code (on purpose)

- **Hero images** — `imageUrl` in `lib/products.ts` / `lib/applications.ts`.
  The hero is a curated choice, not a folder scan.
- **Names, copy, specs, SEO** — lib data, merged with Sanity overrides.
- **Pattern templates** — `lib/pattern-templates.ts` maps names/notes to
  `public/images/patterns/<slug>.png`.

## Conventions

- Lowercase, hyphenated filenames. No spaces (legacy folders with spaces
  exist under /docs — grandfathered, don't add more).
- Photos: max ~2400px on the long edge, JPEG quality 85 (the repo standard).
- A photo that belongs to a specific install/project should ALSO get a blog
  post folder if it's storytelling material — gallery folders are product
  proof, blog folders are narrative.

## Workflow from your machine

1. Drop/delete files in the folder (locally, in the repo).
2. Claude Code: "commit and push the image changes on v2" (or main, post-merge).
3. Vercel deploys; galleries update. Run `npm run assets:inventory` when you
   want the map refreshed.
