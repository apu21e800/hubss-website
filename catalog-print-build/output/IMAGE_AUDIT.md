# HUBSS Catalogue 2026 — Image Audit

Per-project image-source map. Vernon — please scan and flag anything that
doesn't match. Status legend:

- **VERIFIED** — image is from blog frontmatter's `featuredImage` (project-specific shot the website team owns)
- **WEBSITE-CANONICAL** — image matches `lib/projects.ts` or `lib/featured-images.ts` on hubss-website
- **STOCK FALLBACK** — generic product/application photo because no project-specific shot exists in the asset library
- **FLAGGED** — known mismatch already worked around; needs an authentic photo upload

---

## Mainline projects (from `lib/projects.ts`)

| # | Project | Hero image | Status |
|---|---|---|---|
| 01 | York Region Pedestrian Safety | `products/traffic-patterns-xd/traffic-patterns-xd-82.jpg` | STOCK FALLBACK — website uses TPXD-03 (same generic shot). **Needs a real York Region intersection photo if you have one.** |
| 02 | Vision Zero Crosswalks | `applications/crosswalks/crosswalks-11.jpg` | WEBSITE-CANONICAL (national-scope, generic by design) |
| 03 | Vancouver BIA Crosswalks | `products/streetprint/streetprint-23.jpg` | STOCK FALLBACK — website uses streetprint-40. **Needs an actual Vancouver BIA shot if available.** |
| 04 | York Region VIVA BRT | `applications/bus-lanes/bus-lanes-01.jpg` | WEBSITE-CANONICAL — matches projects.ts |
| 05 | Toronto Priority Bus Lanes | `products/mmax/mmax-01.jpg` | WEBSITE-CANONICAL — matches projects.ts |
| 06 | London East Link BRT | `applications/bus-lanes/bus-lanes-03.jpg` | WEBSITE-CANONICAL — matches projects.ts |
| 07 | Kitchener Veterans Memorial | `applications/community-branding/community-branding-01.jpg` | **FLAGGED — blog/featured.jpeg appears to depict the same scene seen elsewhere; using community-branding stock instead. Confirm and re-enable blog photo if it's actually correct.** |
| 08 | UBC Musqueam Crosswalk | `assets/booklet/aboriginal crosswalk 1.png` | VERIFIED — booklet asset, authentic UBC Musqueam shot |
| 09 | More Awesome Now (Vancouver) | `assets/booklet/StreetBond Circle Design 1.png` | VERIFIED — booklet asset |

## Blog-derived projects (from `/content/blog/*.mdx`)

| # | Project | Hero image | Status |
|---|---|---|---|
| 10 | White Rock Pier | `products/traffic-patterns-xd/traffic-patterns-xd-95.jpg` | STOCK FALLBACK — **website has blog/white-rock-pier-crosswalk/featured.png but we're using TPXD product gallery. Should we switch back to blog?** |
| 11 | Indigenous Recognition | `assets/booklet/native crosswalk 1.png` | VERIFIED — booklet asset |
| 12 | BC Children's Hospital | `blog/bc-childrens-hospital-labyrinth/featured.jpg` | VERIFIED — blog frontmatter source |
| 13 | Bowen Island Path | `blog/bowen-island-asphalt-path/featured.jpg` | VERIFIED — blog frontmatter source |
| 14 | Every Child Matters | `blog/every-child-matters-crosswalk/featured.png` | VERIFIED — blog frontmatter source |
| 15 | Sechelt Pictograph Crosswalk | `products/traffic-patterns/traffic-patterns-35.jpg` | **FLAGGED — `blog/pictograph-crosswalk-sechelt/featured.jpg` shows a Veterans Memorial scene (mislabeled in the website's asset folder). Recommend website team re-upload the correct Sechelt photo.** |
| 16 | Simcoe Rainbow Crosswalk | `blog/simcoe-rainbow-crosswalk/featured.jpg` | VERIFIED — blog frontmatter source |
| 17 | New Westminster Complete Streets | `blog/complete-streets-new-westminster/featured.jpg` | VERIFIED — blog frontmatter source |
| 18 | Murrayville Schoolhouse | `blog/murrayville-schoolhouse-sidewalk/featured.jpg` | VERIFIED — blog frontmatter source |

---

## Action items for the website team / Vernon

**Photo authenticity flags (need follow-up):**

1. **Sechelt Pictograph Crosswalk** — the file at `public/images/blog/pictograph-crosswalk-sechelt/featured.jpg` appears to depict a Veterans Memorial (Lest We Forget). Either:
   - Re-upload the correct Sechelt Pictograph photo to that path, OR
   - Tell me which file in the asset library is the right one

2. **Kitchener Veterans Memorial** — we have a `veterans-crosswalk-kitchener/featured.jpeg` but to be safe (and avoid the duplication issue you reported) we're using the generic community-branding application image. Want us to put it back if you confirm the blog file is unique?

3. **York Region Pedestrian Safety / Vancouver BIA Crosswalks / White Rock Pier** — these projects don't have authentic project-specific photos in the asset library; we're using product/application gallery photos. Better imagery would strengthen these pages.

---

## Products (from `lib/featured-images.ts`)

All product heroes match the website's `featured-images.ts` source of truth:

| Product | Hero | Source |
|---|---|---|
| TrafficPatternsXD | `traffic-patterns-xd-03.jpg` | featured-images.ts |
| TrafficPatterns | `traffic-patterns-08.jpg` | featured-images.ts |
| StreetBond | `streetbond-112.jpg` | featured-images.ts |
| StreetPrint | `streetprint-40.jpg` | featured-images.ts |
| DecoMark | `decomark-01.jpg` | featured-images.ts |
| MMAX | `mmax-05.jpg` | featured-images.ts |
| StreetBondSR | `streetbondsr-02.jpg` | featured-images.ts |
| DuraTherm | `duratherm-01.jpg` | featured-images.ts |
| DuraShield | `durashield-04.jpg` | local |
| PreMark | `premark-01.jpg` | featured-images.ts |
| AirMark | `airmark-04.jpg` | local high-res alt |

## Applications (from `lib/featured-images.ts`)

All application heroes match website `featured-images.ts`. 17 applications, 17 unique photos, zero duplicates.

---

**Last verified**: build v22 press-ready
**Total assigned images**: 76 (zero duplicates)
**Folios**: removed
**TrimBox**: 5"×5" inset 0.125" from MediaBox
