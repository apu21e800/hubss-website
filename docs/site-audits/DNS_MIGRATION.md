# DNS Migration Runbook — hubss.com → Vercel

Last updated: 2026-05-10 (for 2026-05-11 launch)

This runbook moves `hubss.com` from its current GoDaddy hosting to Vercel without downtime. Execute in order. Each step has a verification check.

---

## Pre-flight (do this BEFORE the migration window)

### P-1. Confirm current DNS state

Run these from any machine — capture the output as a "before" snapshot:

```bash
dig hubss.com A +short
dig hubss.com AAAA +short
dig www.hubss.com CNAME +short
dig hubss.com MX +short
dig hubss.com TXT +short
dig hubss.com NS +short
```

**Capture:**
- Current A / AAAA records (the IPs hubss.com points to)
- Current `www` CNAME or A
- MX records (email — DO NOT touch these, email is critical)
- TXT records (SPF, DKIM, DMARC, domain verifications)
- Nameservers (likely `ns01.domaincontrol.com` + `ns02.domaincontrol.com` if registered/managed at GoDaddy)

Save the output. This is your rollback reference.

### P-2. Lower TTL on existing DNS records (the day before)

In the GoDaddy DNS panel, set the TTL on the **A record** for `@` (and CNAME for `www` if present) to **600 seconds (10 minutes)**. Default is usually 1 hour.

This shortens the worst-case propagation window during the cutover. **Do this at least 1× the old TTL before migrating** — i.e. if current TTL is 1 hour, lower it at least 1 hour before cutover.

### P-3. Provision the Vercel custom domain

In the Vercel dashboard for the `hubss-website` project:

1. **Project Settings → Domains → Add Domain**
2. Enter `hubss.com` — Vercel will show the required DNS records.
3. Also add `www.hubss.com` and configure the redirect direction (recommend: `www.hubss.com` → `hubss.com`).
4. Note Vercel's required values:
   - **Apex (`hubss.com`):** A record pointing to `76.76.21.21` (Vercel's anycast IP).
   - **`www`:** CNAME to `cname.vercel-dns.com`.

Vercel will display **"Pending"** until DNS is updated. SSL is provisioned automatically by Vercel via Let's Encrypt once the DNS records resolve.

### P-4. Verify the Vercel preview is launch-ready

Visit the production-branch preview URL Vercel issued (e.g. `https://hubss-website.vercel.app`). Walk every page — confirm:
- All routes render (no 404s on the URLs you care about)
- Contact form submits and an email arrives at `info@hubss.com`
- Lighthouse desktop score ≥ 90 for Performance, Accessibility, SEO, Best Practices
- No console errors in Chrome DevTools

If anything fails, **DO NOT migrate** — fix and re-verify first.

### P-5. Confirm email is independently hosted

`dig hubss.com MX` from P-1 should show non-GoDaddy MX (e.g. Google Workspace, Microsoft 365, or a separate mail provider). **If MX records are GoDaddy-hosted, email will break when DNS cuts over** — flag this immediately and pause the migration until email is moved to a real MX provider (recommend Google Workspace).

---

## Cutover (the migration itself)

**Best window:** Tuesday 2026-05-12 morning, **after** a fresh Vercel deploy is verified green. (If launching Monday 2026-05-11 as planned: same logic — pick a low-traffic window, e.g. 9–10am PT.)

### M-1. Snapshot one more time

```bash
dig hubss.com A +short
curl -sI https://hubss.com | head -5
```

Confirm the site is up on the old host right before cutover (rollback baseline).

### M-2. Update DNS records in GoDaddy

In **GoDaddy DNS Management** for `hubss.com`:

1. **Edit the A record** for `@`:
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
   - TTL: `600` (10 minutes for now; bump to 3600 after cutover stabilizes)
2. **Edit the CNAME** for `www`:
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `600`
3. **Remove any AAAA record** pointing to GoDaddy IPv6 (Vercel will auto-issue IPv6 once DNS validates).
4. **DO NOT TOUCH** MX records, TXT records (SPF/DKIM/DMARC), or any subdomain records you don't recognize.

Save.

### M-3. Confirm propagation

Wait ~1–5 minutes, then:

```bash
dig hubss.com A +short          # should return 76.76.21.21
dig www.hubss.com CNAME +short  # should return cname.vercel-dns.com.
```

Test from a fresh DNS resolver (Google's 8.8.8.8) to bypass local cache:

```bash
dig @8.8.8.8 hubss.com A +short
```

### M-4. Confirm Vercel ssl provisioning

Reload the Vercel **Project → Domains** page. The `hubss.com` and `www.hubss.com` entries should both flip to **"Valid Configuration"** (green check) within 5 minutes. Vercel auto-issues the TLS certificate via Let's Encrypt — no action needed.

### M-5. Verify the live site

```bash
curl -sI https://hubss.com | head -10
curl -sI https://www.hubss.com | head -10
```

Expect: `HTTP/2 200` for `hubss.com`, and a `301`/`308` redirect from `www.hubss.com` → `hubss.com` (or vice versa, depending on which canonical you set in P-3).

Open `https://hubss.com` in an incognito Chrome window. Verify:
- Padlock shows valid TLS (issued by Let's Encrypt / Amazon)
- Homepage renders identically to the Vercel preview
- A few key inner routes work: `/products/streetbond`, `/applications/crosswalks`, `/blog`
- Contact form sends an email through (use a real address)

### M-6. Submit fresh sitemap to Google

Once live:
1. Go to **Google Search Console** → property for `hubss.com`.
2. Submit sitemap: `https://hubss.com/sitemap.xml`.
3. Use the URL inspection tool to request indexing of the homepage and 2–3 priority product pages.

### M-7. Bump TTL back up

After 24 hours of stable operation, raise the A and CNAME TTLs to **3600 (1 hour)** in GoDaddy. Lower TTLs cost more DNS lookups; 1 hour is the standard production value.

---

## Rollback (if cutover goes sideways)

If anything is broken **and you cannot fix it within 15 minutes**, roll DNS back:

1. In GoDaddy DNS, restore the **A record** for `@` to the old GoDaddy hosting IP (from your P-1 snapshot).
2. Restore the `www` CNAME / A to its previous value.
3. Because TTL was lowered in P-2, propagation completes in ≤10 minutes.

The site will be back on the old GoDaddy host. Diagnose the Vercel issue from preview URL, fix, re-attempt cutover at a later window.

---

## Post-launch (within 1 week)

- [ ] Submit `hubss.com` to the [HSTS preload list](https://hstspreload.org) — only after confirming TLS and headers are clean for 7 days.
- [ ] Enable Vercel **Production Branch Protection** so only main can deploy to production.
- [ ] Set up a third-party uptime monitor (UptimeRobot or equivalent) → 5-min ping, email Cleve + Doug on 3 failures.
- [ ] Submit new sitemap to Bing Webmaster Tools.
- [ ] Verify Google Search Console "Coverage" report — old indexed URLs should land on new pages via 301s within 1–2 weeks.

---

## Contacts

- **DNS / domain:** Cleve Stordy — cleve.stordy@hubss.com — 604-309-8212
- **Vercel project owner:** apu21e800 (Cleve)
- **Old host login:** GoDaddy account — credentials in 1Password vault (Cleve)
- **Email provider:** [confirm in P-1] — credentials in 1Password vault
