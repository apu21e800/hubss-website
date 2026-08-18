# HUBSS 2.0 — tomorrow's plan

Branch: `feat/hubss-2.0-cms`, off `v2` at `f1f794b`.

---

## The headline: Doug's CMS is already built

I expected to spend tomorrow building a CMS. It's already there. Someone —
earlier in this project — did the hard part properly:

| Piece | State |
|---|---|
| Studio schemas | **Done.** Field groups (Content / Media / Specs / Related / SEO), 22 help descriptions on Product, 43 on Page, 27 on Site Settings |
| Studio sidebar | **Done.** `sanity/structure.ts` — its own comment says "Custom Studio sidebar structure for Doug", singletons per page so there's no confusing "create new" list |
| Studio access | **Done on v2.** `/studio` ungated, Doug logs in with Google and every edit is attributed to him |
| Image resolver | **Written.** `lib/sanity-image.ts` with hero/card/thumb/og presets — and **imported by zero files** |
| Publish webhook | **Written.** `/api/revalidate` verifies a secret and busts the right cache tag — needs the secret set and the webhook created |
| The content itself | **Populated.** `heroImage` on 14/14 products, `gallery` on 13/14, `relatedApplications` on 14/14 |

**So what's actually wrong?** Four field names.

```
the query asks for          Sanity actually stores      populated on
heroImageUrl                heroImage                   14 / 14
galleryUrls                 gallery                     13 / 14
relatedApplicationSlugs     relatedApplications         14 / 14
relatedProductSlugs         relatedProducts             all
```

Every one returns `undefined`, so every merge layer falls through to the static
files — permanently. The schema already knows this: `heroImageUrl` is labelled
"legacy — read only" and auto-hides when `heroImage` exists. The migration was
designed; the read path was never repointed.

This is the same defect that crashed `/resources` (`docType` vs `type`), and it
comes from the same root cause: `client.fetch<T>()` is an unchecked cast, so
TypeScript promises fields the query never returns.

**Tomorrow is a connection job, not a build.**

---

## Three tracks

### A — Connect the read path (me, ~half a day)

1. Fix the four projections; alias Sanity's real fields to the names the app
   expects. Nothing visual changes yet — static still wins for images.
2. Wire `lib/sanity-image.ts` in so Sanity images resolve through the CDN with
   proper sizing.
3. Flip the merge layers to prefer Sanity **per field**, falling back to static
   when a field is empty. Per field matters: a half-filled Sanity record must
   never blank out a working page.
4. Audit every remaining `client.fetch<T>` for the same unchecked cast.

**Gate:** screenshot all 34 product/application pages before and after. Any page
that loses an image or changes visibly without us intending it is a bug, not
progress.

### B — Get the images into Sanity (Vern)

628 images behind. MMAX has no gallery in Sanity at all.

```bash
export SANITY_API_WRITE_TOKEN="..."      # never paste this in chat
node scripts/gen-gallery-manifest.mjs
node scripts/sync-images-to-sanity.mjs --dry-run
node scripts/sync-images-to-sanity.mjs --only=mmax
node scripts/sync-images-to-sanity.mjs
```

Idempotent, dedupes by filename, optimises to 1600px/q80 into a temp dir.
**Originals are never modified.**

Then the webhook, so Doug's edits appear without a redeploy:

1. Vercel → Settings → Environment Variables → add `SANITY_WEBHOOK_SECRET`
2. sanity.io/manage → API → Webhooks → POST to
   `https://hubss.com/api/revalidate`, same secret
3. Test: change a word in Studio, publish, reload

### C — Ship v2 to production (both)

**`v2` is 139 commits ahead of `main`.** Sitting there unreleased:

- three application pages serving each other's photographs
- 259 recovered cross-posts (airports 28→42, streetprint 91→105)
- the StreetBondSR back cover — still live-broken, still pointing Canadians
  at Parsippany
- `.gitattributes`, the pattern library, colour systems, search coverage

139 commits is too many to land blind. Before merging: build, crawl every route
for non-200s, screenshot-diff the top 12 pages against production, then merge
deliberately.

---

## Order

Morning — **C first.** Everything else is polish on work that isn't live.
Ship v2, verify, then A and B in parallel.

If time runs short, the priority is: StreetBondSR live → v2 shipped →
read path connected → images synced.

---

## Still needs Vern, not code

- **Photos.** `public-art` and `private-driveways` have none of their own
  anywhere. `leed-urban-heat-island` has 2. `fast-patch` has 3.
- **Two Studio records** — `sb-colour-001` and `sbsr-colour-001` still hold old
  PDF paths. Fix them in Studio and I delete both shims from the code.
- **Doug's walkthrough.** Once B is done, he needs 20 minutes on: log in, swap
  an image, change a paragraph, publish, see it live.
