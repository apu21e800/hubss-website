# Block A QA — Bug List

**Audit date:** 2026-05-12  
**Auditor:** Claude (4 parallel agents + manual triage)  
**Status:** All CRITICAL/HIGH/MEDIUM **fixed** in `fix/block-a-qa`. LOW/INFO flagged below.

---

## Fixed — CRITICAL / HIGH

### [CRITICAL] `/gallery` route shadowed by redirect → now serves real page
`next.config.ts` had `/gallery → /projects → /blog` redirect chain. The actual `app/gallery/page.tsx` was never reached. Nav, hero CTAs, and product page links all point to `/gallery` — they were silently redirecting to `/blog`. **Fixed: redirect removed.**

### [HIGH] API crash on cold start — `ai-chat` route
`app/api/ai-chat/route.ts` instantiated `new Anthropic()` at module load time. If `ANTHROPIC_API_KEY` is not set (Vercel env cold start), the import crashes before any handler runs. **Fixed: moved inside handler, added 503 guard.**

### [HIGH] Wrong Claude model IDs in API routes
- `app/api/blog/generate/route.ts` — `"claude-opus-4-6"` is not a valid ID → 400 on every generation call. **Fixed: `"claude-opus-4-5"`**
- `app/api/social/generate/route.ts` — `"claude-sonnet-4-20250514"` deprecated. **Fixed: `"claude-sonnet-4-5"`**

### [HIGH] `leed-logo.png` missing on StreetBondSR page
`app/products/[slug]/page.tsx` referenced `/images/products/streetbondsr/leed-logo.png` which did not exist. Broken image in the LEED callout block. **Fixed: created `leed-logo.svg` (green LEED badge) and updated src.**

### [HIGH] Texture overlay 404 on all application detail pages
`app/applications/[slug]/page.tsx` referenced `/images/assets/details/asphalt-closeup-01.jpg` which did not exist. Silent failure (CSS background-image). **Fixed: pointed to `/images/textures/stamped-asphalt-texture.webp`.**

### [HIGH] Gallery arrays referencing wrong file extensions
`gallery()` helper generated `.jpg` paths unconditionally, but 12 application galleries and 2 product galleries have some images stored as `.png`. Every mismatched path rendered a broken image in those galleries. **Fixed: `pngOverrides[]` parameter added to `gallery()` helper; all galleries patched.**

Affected: `bus-lanes` (37–40), `bike-lanes` (32), `crosswalks` (115), `parks-paths` (100, 103), `public-spaces` (9–38 range), `sport-courts` (19), `splash-pads` (11), `townhomes` (4–6, 18), `traffic-calming` (43), `commercial-spaces` (110), `airports` (20), `traffic-patterns` (65, 69), `streetprint` (57, 63).

### [HIGH] Blog post JSON-LD publisher logo 404
`app/blog/[slug]/page.tsx` used `https://hubss.com/images/logo.svg` which does not exist. Google Search Console would flag this on every blog post. **Fixed: updated to `/images/hub-official-logo.svg`.**

---

## Fixed — MEDIUM

### [MEDIUM] `dangerouslySetInnerHTML` rendered HTML entities as literal text
`app/about/page.tsx` had `&apos;` in plain JS string literals passed to `dangerouslySetInnerHTML`. Browser rendered literal `&apos;` characters. **Fixed: replaced with actual apostrophes.**

### [MEDIUM] `mkdir` guard missing for blog drafts dir
`app/api/blog/generate/route.ts` wrote to `content/blog/drafts/` with no directory creation. First generate call on fresh deploy threw `ENOENT`. **Fixed: `await mkdir(draftsDir, { recursive: true })`.**

### [MEDIUM] Products mega menu copy said "13 systems" — now 14
`components/sections/Nav.tsx` lead column said "13 specified systems". Product count is 14. **Fixed.**

---

## Fixed — LOW

### [LOW] `/gallery` in sitemap listed as dead route
`app/sitemap.ts` included `/projects` (which redirects) instead of `/gallery`. **Fixed: swapped.**

### [LOW] `console.log` in contact API leaked form body to Vercel logs
Dev fallback in `app/api/contact/route.ts` logged full form payload on missing `RESEND_API_KEY`. **Fixed: silent return.**

### [LOW] `vision-zero-thermoplastic-crosswalks.mdx` missing `readTime`
Blog post meta row rendered `undefined`. **Fixed: `"5 min read"` added.**

### [LOW] 141 images > 5MB — **1.5 GB reclaimed**
All raw/uncompressed exports in product and application galleries. Batch-compressed with `sharp` to max 2400px wide at q85 (JPEG) or level-9 (PNG). No file extensions changed. **Fixed.**

---

## Flagged — won't auto-fix (Vernon/Doug decision)

| Item | File | Note |
|---|---|---|
| `typescript: { ignoreBuildErrors: true }` | `next.config.ts:60` | Acceptable for now; remove once TS is clean (Block B) |
| 3× `TODO: doug-review-image` | `app/products/[slug]/page.tsx` | TPXD hero image still pending correct photo |
| ~18 `TODO: image` map entries | `lib/map-projects.ts` | Placeholder images — Vernon's ongoing photo worklist |
| `installation-images/` unreferenced PNGs | `public/images/assets/installation-images/` | 6 catalog export PNGs (19–29MB each) not linked anywhere. Compress done. Consider archiving post Block B cleanup. |
| Admin UI shows "Claude Opus 4.6" | `app/admin/blog/page.tsx:159` | Cosmetic copy; no functional impact |

---

## All clear — nothing found

- All `<Link href>` values resolve to valid routes
- All `<a>` external links have `target="_blank" rel="noopener noreferrer"`
- All local `<Image src>` paths verified to exist
- No hardcoded `hubss-website.vercel.app` URLs (all use relative paths or `https://hubss.com`)
- `middleware.ts` gating `/admin/*` — fail-closed, correct
- Both form handlers submit to relative `/api/contact` — no stale Vercel preview URLs
- `StickyBar` `useState(false)` — hidden on load ✓
- `lib/seo.ts` canonical `https://hubss.com`, `robots: index + follow` ✓
- Footer phones/emails correct, copyright dynamic (`new Date().getFullYear()`) ✓
- No `aquaphalt` in any rendered component ✓
- `not-found.tsx` exists, branded ✓
- `sitemap.ts` / `robots.ts` both correct ✓
- Social links all point to correct HUBSS accounts ✓
- All nav mega menu slugs (products, applications, featured posts) verified ✓
