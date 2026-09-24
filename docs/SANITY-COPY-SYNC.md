# The Sanity override — why some copy changes don't show up

**Short version:** for products, applications and four pages, Sanity wins over
the code. Editing `lib/products.ts` or a page's fallback text alone does not
change what hubss.com displays. One command per type pushes the code into
Sanity, and it needs a token only you have.

Rewritten 24 Sep 2026. The version before it said Sanity overrode the product
page. It did not: from `18e25e1` (May 2026) until 24 Sep, `/products/[slug]`
had its own inline merge that took `shortDesc` from Sanity and nothing else.
It now uses the same merge as the homepage, so the table below is true.

---

## What's going on

Two merges, one rule. `lib/products.server.ts` and `lib/applications.server.ts`
merge each entity with its Sanity document, field by field. Sanity wins
wherever it has **real content**; a missing, empty or blank field falls back to
the code (`lib/cms-merge.ts`, the `||` rule).

| Field | Product pages + homepage grid | Application pages, `/applications`, homepage |
|---|---|---|
| `name` (the H1) | **Sanity wins** | **Sanity wins** |
| `eyebrow` | **Sanity wins** | — |
| `shortDesc` (the line under the H1) | **Sanity wins** | **Sanity wins** |
| `description` ("How it works") | **Sanity wins** | **Sanity wins** |
| `specs` (Full specification) | **Sanity wins** | — |
| SEO title and description | **Sanity wins** | **Sanity wins** |
| `homepageBlurb` (homepage Systems card) | **Sanity wins** | — |
| images, gallery, related products/applications, catalogue spreads | code | code |

`/products` (the index) is code-only by design and reads no Sanity.

The pages work the same way. `page-homepage`, `page-about`, `page-contact` and
`page-lunch-learn` hold the hero text, the About story, values, "Why HUB",
partners and the Lunch & Learn sections, and each overrides the fallback text
in its page component.

That is deliberate: it is what lets Doug edit copy in Sanity Studio without a
developer. The catch is that Sanity only changes when someone edits it or runs
a sync. Checked 24 Sep 2026: every product, application and page doc was last
written by a sync run (May, and 7 Sep). Nobody has edited in Studio yet.

---

## The fix

Three sync scripts read the code, diff it against Sanity, and overwrite the
text fields. They are idempotent: running twice changes nothing the second time.

Run them **on your machine**, from the repo root, with `.env.local` holding a
`SANITY_API_WRITE_TOKEN` (create one at sanity.io/manage → API → Tokens → Add,
with Editor permissions). The dry runs need no token.

```bash
# 1. Look first. This only reports; it writes nothing.
npm run sync:products:dry
npm run sync:applications:dry
npm run sync:pages:dry

# 2. If the diff is what you expect, apply
npm run sync:products
npm run sync:applications
npm run sync:pages
```

The site revalidates on its own within the hour, or redeploy to see it
immediately.

- **`sync:pages` keeps its own copy of the page text**, because the page
  components can't be imported by a script. Before writing, it checks that every
  homepage, About and Contact string it holds still appears in the page it was
  copied from. If one doesn't, it stops and names the string. Update the script
  to match the page, then run it again.
- **Lunch & Learn is the exception.** Its copy was rewritten in
  `components/sections/LunchLearnFunnel.tsx`, and `app/lunch-learn/page.tsx`
  ignores Sanity values that still equal the old seed, so the page shows the new
  copy. `sync:pages` still holds the seed for that page and is not checked
  against the component.
- The dry runs used to fail with `401 Session not found`: without a token they
  sent a placeholder one. Fixed 24 Sep; they now read the public dataset.

### Read the dry run before applying

The scripts overwrite. If anyone has edited copy in Sanity Studio that is not
in the code, that edit is what gets replaced. The dry run is there so you can
confirm that rather than assume it. Where Sanity, the code and the print
catalogue disagree, the catalogue wins (`CLAUDE.md`, "Copy source of truth").

---

## When to reach for this

Any time a copy change to `lib/products.ts`, `lib/applications.ts`, or the
fallback text in `app/page.tsx`, `app/about/page.tsx` or `app/contact/page.tsx`
does not appear on the live site, this is why. Run the matching dry run first;
it shows you the field.

Images, galleries, related products, the catalogue spreads, colours, documents
and blog posts are **not** affected: they come from code only, and deploy the
moment the push lands.
