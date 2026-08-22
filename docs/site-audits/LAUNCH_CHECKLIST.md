# HUBSS Launch Day Checklist — 2026-05-11

Run top-to-bottom on launch morning. Each item is independently verifiable.

---

## 🔒 Pre-flight (night before — 2026-05-10)

- [ ] Lower TTL on `hubss.com` A/CNAME records in GoDaddy to **600s** (see `DNS_MIGRATION.md` P-2).
- [ ] Confirm MX records do **NOT** point to GoDaddy hosting (email survives the cutover).
- [ ] Confirm Vercel project env vars are set on **Production** scope:
  - [ ] `RESEND_API_KEY` — without this the contact + Lunch & Learn forms silently succeed but no email is sent (dev fallback)
  - [ ] `CONTACT_EMAIL` (optional; defaults to `info@hubss.com`)
  - [ ] `ADMIN_USER` and `ADMIN_PASSWORD` — gate the `/admin/*` tooling (Basic Auth via middleware). Without these the admin routes fail-closed with 503, which is the correct fallback for public production
  - [ ] Any AI / social-poster keys the admin tooling needs (`ANTHROPIC_API_KEY`, etc.)
- [ ] In Vercel → Project → Domains → add `hubss.com` and `www.hubss.com` (status will be "Pending" until DNS cuts over).
- [ ] Sleep.

---

## 🌅 Morning of (before cutover)

### Code & build verification

- [ ] Latest commit on `main` is the launch-ready commit. Vercel "Production" deployment is **green** (not building, not errored).
- [ ] Visit the production Vercel URL (`https://hubss-website.vercel.app`). Walk:
  - [ ] Homepage renders, hero loads, map loads, no console errors.
  - [ ] **Mega menus** — hover Products, Applications, Field Notes. Each opens to a wide multi-column panel (not a narrow dropdown). Field Notes shows featured post cards.
  - [ ] **Map popup card** — hover any pin, confirm the popup appears with image + 4-line meta (product/application · title · location · "View case study"). Move cursor from pin → card without dismissal. Click → opens full case study modal.
  - [ ] **Sticky bottom CTA bar** — scroll down past 220px, bar hides. Scroll back up, bar reappears. At top of page bar is always visible.
  - [ ] `/products` grid shows all 14 products with images.
  - [ ] `/products/streetbond` → loads, AirMark says "non-runway", PreMark thickness reads "125mil standard / 90mil ViziGrip option".
  - [ ] `/applications` → grid loads, all 21 application tiles.
  - [ ] `/applications/crosswalks` → loads, related products on right rail.
  - [ ] `/blog` → list of posts.
  - [ ] One blog post → renders MDX with BreadcrumbList JSON-LD.
  - [ ] `/contact` → form renders.
  - [ ] `/lunch-learn` → funnel renders, **moose mascot at ~20% smaller than initial design** (clamp(224, 34vw, 416)).
  - [ ] `/about` → offices block, JSON-LD includes Organization + two LocalBusiness sub-entries.
  - [ ] `/resources` → PDF library loads.
  - [ ] `/admin` → returns **401 / Basic Auth prompt** (or 503 if env vars not set). Should NOT be publicly reachable.
- [ ] Submit the **contact form** with a real email. Verify it lands at `info@hubss.com` within 30 seconds.
- [ ] Submit the **Lunch & Learn form**. Verify same.
- [ ] Verify `https://hubss-website.vercel.app/sitemap.xml` renders an XML sitemap.
- [ ] Verify `https://hubss-website.vercel.app/robots.txt` renders.
- [ ] Hit a deliberately-bad URL (e.g. `/this-does-not-exist`). Confirm the custom 404 page renders (not Vercel default).

### Mobile + responsive

- [ ] Open Chrome DevTools → Responsive mode → iPhone SE (375px).
  - [ ] Nav drawer opens cleanly.
  - [ ] Hero scales — text not clipping.
  - [ ] Sticky CTA bar fits on screen, hides/shows correctly on scroll.
  - [ ] Form inputs are tappable (44px min hit target).
- [ ] iPad (768px). Same checks. No layout breaks.
- [ ] Real iPhone if available — load the site on cellular and time-to-first-paint should feel < 2 seconds.

### Lighthouse / Core Web Vitals

Run Lighthouse in DevTools (mobile, simulated 3G fast) on homepage and one product page:

- [ ] Performance: ≥ 85
- [ ] Accessibility: ≥ 95
- [ ] Best Practices: ≥ 95
- [ ] SEO: 100

If anything is < target, screenshot it, decide go/no-go with Vernon.

### Security headers

Run from a terminal once the Vercel deploy is live:

```bash
curl -sI https://hubss-website.vercel.app/ | grep -iE "strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy|content-security-policy"
```

- [ ] All 6 security headers present: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, **Content-Security-Policy-Report-Only**.
- [ ] `Strict-Transport-Security` max-age is 63072000 (2 years) with `preload`.
- [ ] `Content-Security-Policy-Report-Only` is in **Report-Only** mode at launch (won't block anything). After 7 days of clean violation reports in Vercel logs, flip the header key from `Content-Security-Policy-Report-Only` to `Content-Security-Policy` in `next.config.ts` to enforce.

---

## 🚀 Cutover (10am PT recommended)

Follow `DNS_MIGRATION.md` Steps M-1 through M-6.

- [ ] **M-1.** Snapshot current DNS.
- [ ] **M-2.** Update A record to `76.76.21.21`, CNAME to `cname.vercel-dns.com`, TTL `600`.
- [ ] **M-3.** Confirm propagation via `dig` against 8.8.8.8.
- [ ] **M-4.** Vercel dashboard shows green check on `hubss.com` + `www.hubss.com`. TLS issued.
- [ ] **M-5.** Open `https://hubss.com` in incognito — padlock valid, site renders, contact form delivers.
- [ ] **M-6.** Submit `https://hubss.com/sitemap.xml` to Google Search Console.

---

## 🛡️ Post-launch (within first 2 hours)

### Search Console — submit + request indexing

- [ ] **Google Search Console:** verify `hubss.com` ownership (DNS TXT record is cleanest). Submit `https://hubss.com/sitemap.xml` under **Sitemaps**. Use URL Inspection to request indexing of:
  - [ ] Homepage
  - [ ] `/products/streetbond`, `/products/streetprint`, `/products/traffic-patterns-xd`
  - [ ] `/applications/crosswalks`, `/applications/parks-paths`
  - [ ] 2–3 top-traffic blog posts (cross-ref with old GSC Performance report)
- [ ] **Bing Webmaster Tools:** verify ownership; import settings from Google Search Console.
- [ ] No **Change of Address** filing needed (same domain, only host changed).

### Live-URL spot check

- [ ] Browse 10 random URLs from the old hubss.com sitemap — confirm each either renders or 301s to the right new URL.
- [ ] Open Crisp Chat dashboard — confirm widget is loading on production.
- [ ] Check Vercel Analytics dashboard — pageviews are flowing.
- [ ] Check Speed Insights — real-user Core Web Vitals are tracking.
- [ ] Verify no 5xx errors in Vercel runtime logs.

---

## 📅 Post-launch (within 24 hours)

- [ ] Bump TTL back to 3600 in GoDaddy.
- [ ] Set up uptime monitor (UptimeRobot free tier, 5-min interval, alert to Cleve + Doug).
- [ ] Email Doug confirming the migration is complete and pointing him to the new contact form / resources page.
- [ ] Post-mortem: any issues? Capture in `LAUNCH_NOTES.md` for next time.

---

## 📅 Post-launch (within 1 week)

- [ ] Review GSC **Coverage** report daily — add redirects for any old URL that is 404'ing.
- [ ] Review GSC **Performance** report — flag any page that lost > 30% impressions vs. pre-launch baseline.
- [ ] If a flagged closest-match redirect (`/projects/complete-streets-richmond`, `/projects/decorative-asphalt-pedestrian-plaza`, etc. — see SEO_MIGRATION.md §1) is showing measurable traffic, create dedicated MDX content for it.

See `SECURITY.md` § "Open items / post-launch hardening" and `DNS_MIGRATION.md` § "Post-launch" and `SEO_MIGRATION.md` § 7 for the full Search Console runbook.

---

## ❌ Abort conditions

Roll back immediately (per `DNS_MIGRATION.md` § Rollback) if any of:

- TLS cert fails to provision after 15 minutes (rare; usually a DNS typo)
- Contact form silently fails (no email arrives within 60s)
- > 5% of page loads return 5xx in Vercel logs
- A high-traffic URL on the old site is 404'ing on the new site without a 301 in `next.config.ts`

---

## 🆘 Emergency contacts

- **Cleve Stordy (West):** 604-309-8212 · cleve.stordy@hubss.com
- **Doug Bain (East):** 416-540-9287 · doug.bain@hubss.com
- **Vercel support:** dashboard → "Help" (Pro plan = chat support)
- **GoDaddy support:** 1-866-938-1119
