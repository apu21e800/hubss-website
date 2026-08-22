# Sanity — what's actually in there (findings, 16 Aug 2026)

## The headline

**There are two complete image libraries, and the website only uses one of them.**

| | Folders (`/public/images`) | Sanity CDN |
|---|---|---|
| Images | **1,743 files, 2.4 GB** | **979 images, 288 MB** |
| Organised into galleries | yes (folder = gallery) | yes (per product/application, ordered) |
| Alt text | derived from filename | stored per image, validation enforced |
| Used by hubss.com | **YES — everything you see** | **NO — not one image is read** |
| Editable without git | no (commit + push) | yes (Studio, drag to reorder) |
| Delivery | Vercel image optimization | Sanity CDN, on-the-fly resize/format |

They are **the same photographs** — Sanity's copies were migrated from the folders
during an earlier phase. Switching is therefore *not* a visual change. It's a change
of who owns the images and where they're served from.

## What Sanity holds today

- 14/14 products: hero image + gallery (13 have galleries; MMAX has none)
- 20/20 applications: hero + gallery
- 67/67 blog posts: featured image
- 59 projects, 4 pages, 1 siteSettings
- 979 image assets · 66 file assets (the PDFs) · ~288 MB
- Galleries hold the **old curated 50-image sets**, not the full folders
  (StreetBond: Sanity 50 vs folder 111)

## Why the site ignores them

`lib/products.server.ts` / `lib/applications.server.ts` merge **text only**:
name, eyebrow, shortDesc, description, specs, SEO, homepageBlurb. There is a
comment in both saying images "keep coming from the static lib in phase 2".
Phase 2 never happened. `lib/sanity-image.ts` exists and is imported by nothing.

## The cost of the current arrangement

- `/public` is 2.5 GB; the git repo is **5.0 GB** because every version of every
  photo lives in history permanently and can never be removed without a rewrite.
- That weight already caused one production incident — the 2.4 GB serverless
  function that failed the Vercel deploy.
- Every image change requires a git commit + push. Doug cannot change a photo.

## What Sanity would give us

- Repo shrinks dramatically; deploys get faster; git stops growing with photos
- Doug/Vern edit images in Studio — no git, no developer
- Hotspot cropping (mark the focal point, correct crop at every size)
- Alt text validated at entry (AODA compliance is currently best-effort)
- CDN with automatic format/size — replaces the Vercel image-optimization quota

## What it would cost

- One migration, done carefully, with a fallback at every step
- Sanity plan limits need checking (288 MB assets used today; bandwidth on a
  photo-heavy site is the number to watch)
- Vern loses file-browser curation unless we keep folders as the ingest path

## Friction found while looking

**`/studio` sits behind HTTP Basic Auth** (`middleware.ts` gates `/studio/:path*`
with `ADMIN_USER`/`ADMIN_PASSWORD`) **on top of** Sanity's own per-user login.
That's two passwords for one CMS, and the Basic Auth one is shared rather than
per-person. Sanity's own auth is already secure and gives a real audit trail —
the Basic Auth gate in front of it should probably come off before Doug is
invited in.

Also unset in production: `SANITY_API_WRITE_TOKEN` and `SANITY_WEBHOOK_SECRET`
(the publish → rebuild webhook). Without the webhook, Studio edits appear on the
next deploy or after the 1-hour ISR window, not immediately.
