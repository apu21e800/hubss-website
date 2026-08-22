# The safety net

`npm run verify`

---

## Why this exists

Until now this project had **no CI, no tests, and no test runner.** 141 pages, a
live client site, and nothing that could tell anyone when something broke.

That's not an abstract risk. Here is what actually happened:

| Bug | How long it was live | How it was found |
|---|---|---|
| `/resources` search crashed on the first keystroke | unknown, months | client screenshotted it |
| Nine project pages 308'd to `/gallery` | since the WordPress migration | by accident, crawling routes |
| Three pairs of application pages served each other's photos | unknown | by accident, comparing folders |
| `/blog` shipped 4.4 MB of images to phones | unknown | by accident, measuring |
| Four Sanity fields queried that don't exist | since the migration | by accident, auditing |

**Not one of those needed cleverness to catch. They needed something to look.**

Every check below exists because a specific bug got past a human. The comment
above each one in `scripts/verify-site.mjs` says which.

---

## Running it

```bash
npm run build && npm run verify        # everything, ~40s
npm run verify -- --quick              # skip browser checks, ~3s
npm run verify -- --base=https://www.hubss.com   # audit PRODUCTION directly
```

Exits non-zero on failure, so CI gates on it. `.github/workflows/verify.yml`
runs the quick pass as a merge gate and the browser pass as a report.

**The production mode is worth knowing about.** Pointing it at `hubss.com` turns
it into a live audit — that's how the nine unreachable project pages were
confirmed still broken in production while fixed on the branch.

---

## What it checks

**1. Sitemap routes return 200**
A sitemap listing URLs that redirect is a broken promise to crawlers. Nine
municipal case studies were advertised to Google and every one bounced to a
generic gallery.

**2. Referenced files exist on disk**
Every image and PDF the built HTML points at. Cheap to check, quietly
embarrassing to miss when a document gets renamed.

**3. Internal links resolve**
Every internal `href`. In production mode it crawls the deployed HTML rather
than the local build, because those are different versions of the site and
comparing them produces nonsense.

**4. Built pages are reachable** ← *the important one*
> If the build produced a page, a visitor must be able to reach it.

This is the generalised form of the `/projects` failure. A page can be built,
linked in the nav, and shadowed by a redirect without ever touching the sitemap.
Next reports those nine pages as *successfully prerendered* whether or not a
redirect eats them a millisecond later — the build log looks perfect either way.

Auth-gated routes (401/403, or 503 when the middleware fails closed on missing
credentials) are recognised as intentional. A **3xx** on a built page is
reported as *"redirected away — is a catch-all shadowing it?"*, because that is
almost always what happened.

**5. Galleries are distinct**
No two pages should serve byte-identical image sets. Six live pages once shared
three galleries between them, and nothing looked broken because every page still
showed photos — you had to open two tabs side by side to see it. Known-accepted
duplicates live in an `ACCEPTED` set with a written reason.

**6. CMS fields match what the code queries** ← *the recurring one*
Four separate bugs, one root cause. `client.fetch<T>()` is an **unchecked cast**:
TypeScript will happily promise fields the query never returns, the merge layer
falls back silently forever, and nobody notices for months.

```
docType            vs  type                     -> crashed /resources
heroImageUrl       vs  heroImage                -> null on 14/14 products
galleryUrls        vs  gallery                  -> field never existed
relatedApplicationSlugs vs relatedApplications  -> field never existed
```

**TypeScript cannot catch this.** Only asking the live dataset can. The check
reads the GROQ projections out of `lib/sanity.queries.ts`, asks Sanity what
fields actually exist, and reports anything queried-but-absent or
present-but-null-on-everything. It understands `coalesce(...)` aliases and
validates the source field, so it doesn't cry wolf about things already handled.

**7. No visible "undefined" in rendered pages**
A cheap tripwire for the same class — a missing field very often ends up
interpolated into the page as the literal string. Ignores `$undefined`, which is
React's own RSC flight-data serialisation and entirely normal.

**8. Image weight per route** *(browser)*
2000 KB budget at 390px. Deliberately generous — it catches disasters, not
imperfection. `/blog` was at 4,398 KB.

**9. No critical accessibility violations** *(browser)*
axe-core, WCAG 2.1 AA. This site sells AODA compliance to municipalities;
failing WCAG on its own forms is a credibility problem, not just a technical one.

---

## Adding a check

The bar is: **a real bug got through, and this would have caught it.** Write the
incident in the comment above the check — not what it does, which the code
already says, but which specific failure earned it. That comment is what stops
someone deleting it in two years for being noisy.

Checks should be cheap. If the suite gets slow enough that people want to skip
it, it has failed at its job.

---

## Known-failing, on purpose

`CMS fields match what the code queries` currently **fails**, and that is
correct — the four field mismatches are real and still open. It goes green when
the read path is connected. A suite that's green while the code is broken is
worse than no suite.
