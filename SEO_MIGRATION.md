# SEO Migration & Preservation — hubss.com → Next.js on Vercel

Last updated: 2026-05-10 (launch eve, 2026-05-11)

This is the SEO preservation strategy for the move from the legacy WordPress hubss.com to the new Next.js application. The goal is **maintain or exceed the old site's search rankings**, not reset them.

---

## Strategy summary

| Lever | Approach |
|---|---|
| **URL stability** | Mirror old slugs where reasonable; 301 everything else. No 404s on URLs Google has indexed. |
| **Title / meta / H1 continuity** | For the top 10 ranking pages, port the old title + meta description verbatim into the new build (preserves keyword targeting). |
| **Sitemap** | New sitemap covers every public route (products, applications, projects, blog, static pages) and is submitted to Search Console day-1. |
| **Robots** | `/admin/*` and `/api/*` disallowed; everything else allowed. |
| **Canonicals** | Every page sets `<link rel="canonical">` via `buildMetadata` — single source of truth, prevents duplicate-content issues. |
| **Structured data** | Organization + LocalBusiness on the homepage. Product, Service, Article, and BreadcrumbList JSON-LD on inner pages. |

---

## 1. URL mapping inventory

### Pages that match exactly (no redirect needed — already mirroring old structure)

- `/about` ← `/about-us` (redirect already in place)
- `/contact` ← `/contact-us` (redirect already in place)
- `/lunch-learn` (same path on both sites)
- `/resources` ← `/documentation` (redirect)
- `/blog` (new path; case studies + insights live here)
- `/projects` ← `/case-studies` and `/featured-projects` (both redirect)
- `/privacy` ← `/privacy-policy`
- `/terms` ← `/terms-conditions`

### Product pages — old uses non-hyphenated slugs at root

All redirect to `/products/<hyphenated-slug>`:

| Old URL | New URL |
|---|---|
| `/trafficpatternsxd` | `/products/traffic-patterns-xd` |
| `/trafficpatterns` | `/products/traffic-patterns` |
| `/streetbond` | `/products/streetbond` |
| `/streetbondsr` | `/products/streetbondsr` |
| `/streetprint` | `/products/streetprint` |
| `/decomark` | `/products/decomark` |
| `/mmax-2` | `/products/mmax` |
| `/duratherm-2` | `/products/duratherm` |
| `/durashield` | `/products/durashield` |
| `/premark` | `/products/premark` |
| `/airmark` | `/products/airmark` |

### Application pages — old also at root

All redirect to `/applications/<slug>`:

| Old URL | New URL | Notes |
|---|---|---|
| `/crosswalks` | `/applications/crosswalks` | |
| `/parking-lots` | `/applications/parking-lots` | |
| `/parks-paths` | `/applications/parks-paths` | |
| `/community-branding` | `/applications/community-branding` | |
| `/bike-bus-lanes` | `/applications/bike-lanes` | New site split into two pages; default to bike. Consider keeping bike-bus-lanes alive as a combined landing if rankings on combined-term are strong (review post-launch). |
| `/public-art` | `/applications/public-art` | |
| `/regulatory-markings` | `/applications/regulatory-markings` | |
| `/leed-urban-heat-island` | `/applications/leed-urban-heat-island` | |
| `/private-driveways` | `/applications/private-driveways` | |
| `/residential-driveways` | `/applications/private-driveways` | |
| `/townhomes` | `/applications/townhomes` | |
| `/air-ports` | `/applications/airports` | |

### Gallery pages

All `*-gallery` URLs (11 of them: `/trafficpatterns-gallery`, `/streetbond-gallery`, etc.) redirect to the matching product or application page — galleries are now built into those pages.

### WordPress legacy structure

- `/projects/category/*` taxonomy URLs → `/projects`
- `/projects/page/N` and `/projects/featured-projects/N` pagination URLs → `/projects`
- 25+ individual `/projects/<slug>/` case studies are mapped to either `/blog/<slug>` (if MDX exists) or `/applications/<slug>` (if it's a category)

### Spec sheet PDFs

`/assets/specification-documents/*` is wildcard-redirected to `/resources` as a safety net. The new `/resources` page hosts the same PDFs under `/public/docs/` with a searchable catalog.

### Flagged for Vernon's review

A handful of `/projects/<slug>` URLs had no obvious match. The redirects point to the closest match but are flagged in `next.config.ts`:

- `/projects/complete-streets-richmond` → `/blog/complete-streets-new-westminster` (different city — preserve juice on the topic)
- `/projects/avenue-of-the-arts-crosswalks` → `/applications/public-art`
- `/projects/decorative-asphalt-pedestrian-plaza` → `/blog/terry-fox-plaza-coquitlam` (closest plaza match)
- `/projects/stamped-asphalt-at-vancouver-general-hospital` → `/projects` index (no MDX equivalent)

Recommend creating MDX stubs for these post-launch if they show significant organic traffic in Search Console.

---

## 2. Title / meta description ports

The strongest old-site pages had keyword-rich titles and metas worth preserving. These are now stored as `seoTitle` and `seoDescription` fields on the product / application data records in `lib/products.ts` and `lib/applications.ts`. They override the auto-generated meta in `lib/seo.ts:buildMetadata()` when present.

### Ported verbatim

| Slug | Title preserved | Meta description preserved |
|---|---|---|
| `traffic-patterns-xd` | ✅ | ✅ |
| `streetbond` | ✅ | ✅ |
| `streetprint` | ✅ | ✅ |
| `streetbondsr` | ✅ | ✅ |
| `airmark` | ✅ | ✅ |
| `duratherm` | ✅ | ✅ |
| `premark` | ✅ | ✅ |
| `decomark` | ✅ | ✅ |
| `crosswalks` | ✅ | ✅ |
| `parks-paths` | ✅ | ✅ |
| `playgrounds` | ✅ | ✅ |
| `leed-urban-heat-island` | ✅ | ✅ |

### Pages with no meta on old site (writing fresh)

About 14 pages on the old site lacked a meta description entirely (`/about-us`, `/contact-us`, `/lunch-learn`, `/community-branding`, `/public-art`, `/regulatory-markings`, `/private-driveways`, `/townhomes`, `/air-ports`, `/trafficpatterns`, `/mmax-2`, `/durashield`, `/bike-bus-lanes`, `/documentation`). The new site uses `buildMetadata`'s auto-generated meta from `shortDesc + description` — better than nothing, and conversion-optimized.

### Homepage

Old homepage had a duplicated title/meta. New site sets it explicitly:

- **Title:** `Decorative Pavement & Road Marking Solutions | HUB Surface Systems`
- **Meta:** `Canada's leader in decorative stamped asphalt, thermoplastic road markings, and coloured pavement systems. Serving municipalities, developers, and contractors coast to coast since 1994.`

Stronger keyword targeting than the old version.

---

## 3. Sitemap

Located at `https://hubss.com/sitemap.xml` and generated by `app/sitemap.ts`. Covers:

- 11 static routes (homepage, products index, applications index, projects index, blog index, resources, about, contact, lunch-learn, privacy, terms)
- 13 product detail pages (auto-discovered from `lib/products.ts`)
- 21 application detail pages (auto-discovered from `lib/applications.ts`)
- 9 project detail pages (auto-discovered from `lib/projects.ts`)
- All blog posts (auto-discovered from `/content/blog/*.mdx`)

Total: ~80 URLs. Priorities range from 0.2 (legal) to 1.0 (homepage). Change frequencies are set per route type.

**Day 1 action:** submit `https://hubss.com/sitemap.xml` to Google Search Console (and Bing Webmaster Tools).

---

## 4. Robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://hubss.com/sitemap.xml
```

Generated by `app/robots.ts`. **Reviewed:** nothing the old site indexed is now blocked. `/admin/*` and `/api/*` were never indexed.

---

## 5. Structured data (JSON-LD)

| Page | Schema |
|---|---|
| Homepage | `Organization` with two `LocalBusiness` subOrganizations (West / East offices) |
| `/products/[slug]` | `Product` + `BreadcrumbList` |
| `/applications/[slug]` | `Service` + `BreadcrumbList` |
| `/blog/[slug]` | `Article` + `BreadcrumbList` |
| `/projects/[slug]` | `BreadcrumbList` |

LocalBusiness entries include name, phone, email, address (locality + region + country), `areaServed` (provincial coverage per office), and a stable `@id` for cross-referencing.

---

## 6. Canonicals

Every page sets `<link rel="canonical" href="https://hubss.com/<path>">` via `lib/seo.ts:buildMetadata()`. No `noindex` on production pages.

---

## 7. Search Console runbook

Day 1 (within an hour of cutover):

1. Verify ownership of `hubss.com` in [Google Search Console](https://search.google.com/search-console). DNS TXT record is the cleanest method.
2. Submit `https://hubss.com/sitemap.xml` under **Sitemaps**.
3. Use the **URL inspection** tool to request indexing of:
   - Homepage
   - `/products/streetbond`
   - `/products/streetprint`
   - `/products/traffic-patterns-xd`
   - `/applications/crosswalks`
   - `/applications/parks-paths`
   - 2–3 top-performing blog posts (check what was ranking on the old site first)
4. Verify ownership of `hubss.com` in [Bing Webmaster Tools](https://www.bing.com/webmasters). Import settings from Google Search Console.

Within 7 days:

5. Submit a **Change of Address** request in Search Console only if the domain changed. Since we're keeping `hubss.com` and only changing the host, no change of address is needed — but check the **Coverage** report for any old indexed URLs that 404 and add redirects.
6. Monitor **Crawl Stats** in Search Console — confirm Googlebot is fetching pages successfully.
7. Watch **Performance** report week-over-week. Some ranking volatility for 2–4 weeks post-migration is normal. If a specific page drops sharply, check (a) is the redirect working? (b) is the new page's content materially worse? (c) does the new page have all the keywords the old page had?

Within 30 days:

8. Submit to the [HSTS preload list](https://hstspreload.org/) once TLS is stable (see SECURITY.md).
9. Review the redirect map: any flagged closest-match redirects (`complete-streets-richmond`, etc.) that are getting traffic should get their own dedicated content.

---

## 8. Expected outcome

- **Best case:** rankings hold steady; new site's stronger Core Web Vitals + structured data nudges rankings up over 2–4 weeks.
- **Realistic case:** 2–3 weeks of mild volatility as Google re-crawls and rebuilds its index of the site. Top-10 product / application pages should maintain rankings within ±2 positions.
- **Worst case:** a specific high-traffic legacy URL is missing or mis-redirected. The flagged URLs in §1 are the primary risk. Mitigation: monitor Search Console Coverage report daily for the first week and add redirects within 24 hours of any 404 spike.

---

## 9. Files touched for SEO migration

- `next.config.ts` — 30+ new 301 redirects in `async redirects()`, plus security headers
- `lib/products.ts` — added `seoTitle` / `seoDescription` to 8 products
- `lib/applications.ts` — added `seoTitle` / `seoDescription` to 4 applications
- `app/products/[slug]/page.tsx` — uses `seoTitle` / `seoDescription` overrides in `generateMetadata`; adds `BreadcrumbList` JSON-LD
- `app/applications/[slug]/page.tsx` — same
- `app/blog/[slug]/page.tsx` — adds `BreadcrumbList` JSON-LD
- `app/projects/[slug]/page.tsx` — adds `BreadcrumbList` JSON-LD
- `app/page.tsx` — Organization schema expanded with two `LocalBusiness` subOrganizations
- `app/sitemap.ts` — already comprehensive (no change)
- `app/robots.ts` — already correct (no change)

---

## Contacts

- **SEO lead / domain owner:** Cleve Stordy — cleve.stordy@hubss.com
- **Search Console / Bing Webmaster:** Cleve's Google + Microsoft accounts (credentials in 1Password)
