# Security Posture — hubss.com

Last updated: 2026-05-10 (launch eve)

This document captures the security posture of the HUB Surface Systems website (hubss.com), the public-facing Next.js application hosted on Vercel. It is intended for client review and to back up the security parity commitment made during the move from the previous GoDaddy-hosted site.

---

## 1. Hosting & infrastructure

- **Platform:** Vercel — Next.js 16 (App Router) on the Vercel Edge Network.
- **TLS / HTTPS:** Provisioned automatically by Vercel via Let's Encrypt. Certificates auto-renew. HTTPS is enforced — HTTP requests are redirected to HTTPS by the platform.
- **DDoS mitigation:** Vercel's edge network provides built-in protection against volumetric and Layer-7 attacks. Included with the Vercel Pro plan or higher.
- **Network egress:** All requests go through Vercel's globally distributed CDN. Origin functions are isolated, serverless, and ephemeral (no shared state).

---

## 2. HTTP security headers

Set globally in `next.config.ts` under `async headers()`:

| Header | Value | Purpose |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS for 2 years; eligible for HSTS preload list |
| `X-Frame-Options` | `SAMEORIGIN` | Prevent clickjacking via iframe embedding |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME-type sniffing attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage to third parties |
| `X-DNS-Prefetch-Control` | `on` | Performance hint, not a security risk |
| `Permissions-Policy` | (locked down — see below) | Disable browser features the site doesn't use |
| `X-Powered-By` | (removed via `poweredByHeader: false`) | Avoid disclosing stack |

**Permissions-Policy disables:** `accelerometer`, `autoplay`, `camera`, `geolocation`, `gyroscope`, `magnetometer`, `microphone`, `payment`, `usb`, `interest-cohort` (FLoC opt-out).

**Content-Security-Policy (CSP):** Not yet enforced in v1. A strict CSP requires source allowlisting for Crisp Chat, MapLibre tiles (Carto CDN), Google Fonts, Vercel toolbar, and the inline styles framer-motion emits. The plan is to ship the launch without CSP, then roll out CSP in Report-Only mode for one week, review reports, and finally enforce it.

---

## 3. Application security

- **Input validation:** Contact form (`/api/contact`) validates required fields and uses a honeypot field (`website`) to silently drop bot submissions.
- **No direct database:** This is a static + serverless-API site. No user accounts, no SQL, no persistent user data on origin.
- **Email transport:** Form submissions go to [Resend](https://resend.com) — a transactional-email API with verified-sender DKIM/SPF/DMARC. The Resend API key is stored in Vercel environment variables, not in source.
- **Admin routes:** `/admin/*` exists for internal content tooling. These routes are not linked from the public site and are disallowed in `robots.txt`. They are still publicly reachable by URL — recommend Vercel Password Protection on `/admin/*` post-launch (Vercel Pro feature, ~$0 incremental cost).
- **No third-party scripts beyond:** Vercel Analytics, Vercel Speed Insights, Crisp Chat widget, Google Fonts (Geist + Inter). All loaded from reputable, security-audited CDNs.

---

## 4. Secrets management

- All secrets live in **Vercel Environment Variables**, scoped per environment (production / preview / development).
- Required env vars: `RESEND_API_KEY`, `CONTACT_EMAIL`, plus any AI/Social-poster keys for the admin tooling. None are committed to git.
- The `.env.local.example` file in the repo documents required keys without exposing values.
- Tokens (e.g. Resend) are rotatable from the respective vendor dashboards. There is no key vault by design — Vercel's encrypted env var store is the secret of record.

---

## 5. Form submission integrity

- **Honeypot:** `<input name="website">` is hidden from real users; bots that fill it get a silent success response.
- **Rate limiting:** Not currently enforced. Vercel's serverless platform mitigates spike abuse, but for a production-grade rate limit (e.g. 5 submissions per IP per minute), consider adding [`@vercel/edge-rate-limit`](https://vercel.com/docs/concepts/limits/overview) or Upstash post-launch.
- **No PII storage in app:** Form data is forwarded to Resend → delivered to `info@hubss.com` (or override). No copy persisted on the Vercel side.

---

## 6. Monitoring & alerting

- **Uptime:** Vercel platform provides 99.99% SLA on Pro+. **Recommendation:** add a third-party uptime monitor (UptimeRobot free tier, BetterUptime, or Cronitor) that pings `https://hubss.com/` every 5 minutes and pages an on-call address on three consecutive failures. ~5 minutes to set up; non-negotiable for a production marketing site.
- **Error logs:** Vercel's runtime logs capture server errors. `app/error.tsx` includes a `console.error` call that surfaces the error digest for cross-referencing with Vercel logs.
- **Analytics:** Vercel Analytics + Speed Insights wired into `app/layout.tsx`. Dashboards live in the Vercel project.

---

## 7. Backup & disaster recovery

- **Source of truth:** GitHub (`apu21e800/hubss-website`). Repo is the canonical backup — every commit, image, blog post, and config is versioned.
- **Content backups:** Blog content is MDX in `/content/blog/`, images are in `/public/images/`. Both live in git. No separate CMS to back up.
- **Form submissions:** Delivered via Resend to `info@hubss.com`. **Recommend** enabling Resend's submission archive (paid feature) or BCC-ing a shared inbox for audit trail.
- **Recovery target:** RTO ≈ 15 minutes (revert the last Vercel deployment from dashboard). RPO ≈ 0 — git is real-time.
- **Catastrophic recovery:** If the Vercel project is deleted, redeploy from `git@github.com:apu21e800/hubss-website.git` to a fresh Vercel project in under 10 minutes (DNS would need to repoint).

---

## 8. Compliance scope

This site does not collect, store, or process:
- Payment data (no e-commerce)
- Health information
- Government-classified data
- Personal data beyond what users voluntarily submit via the contact form

If form-submission processing ever expands (e.g. CRM ingestion, analytics-on-PII), revisit Canadian privacy (PIPEDA) obligations and add a data-retention policy.

---

## 9. Open items / post-launch hardening

| Priority | Item | Owner |
|---|---|---|
| P1 | Roll out CSP in Report-Only mode, then enforce | Web team |
| P1 | Enable Vercel Password Protection on `/admin/*` | Vernon |
| P2 | Set up third-party uptime monitor | Vernon |
| P2 | Add edge rate limit to `/api/contact` | Web team |
| P3 | Submit hubss.com to the HSTS preload list (https://hstspreload.org) once production is stable for 30 days | Vernon |
| P3 | Enable Resend submission archive | Vernon |

---

## Contacts

- **Domain owner:** Cleve Stordy — cleve.stordy@hubss.com — 604-309-8212
- **Repo / deployment:** apu21e800 on GitHub, Vercel project owner
- **Email infrastructure:** Resend dashboard
