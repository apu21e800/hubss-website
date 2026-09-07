# The Sanity override — why some copy changes don't show up

**Short version:** for products and applications, Sanity wins over the code.
Editing `lib/products.ts` alone does not change what hubss.com displays for
three fields. One command fixes it, and it needs a token only you have.

---

## What's going on

`lib/products.server.ts` and `lib/applications.server.ts` merge each entity
with its Sanity document, and Sanity wins wherever it has a value:

| Field | Products | Applications |
|---|---|---|
| `shortDesc` (the line under the H1) | **Sanity wins** | **Sanity wins** |
| `description` ("How it works") | **Sanity wins** | **Sanity wins** |
| `specs` (Full specification sidebar) | **Sanity wins** | — |
| everything else — images, gallery, related products/applications | code | code |

That was a deliberate design: it is what lets the client edit copy in Sanity
Studio without a developer. The problem is that nobody has edited it. Every
one of the 14 product docs and 20 application docs was seeded by the original
migration from an older version of the code, so what is live is a frozen copy
of superseded text quietly overriding the corrected text.

The same is true of `/about`, whose story paragraphs live in `page-about`.

### What this means right now (Sep 2026)

The booklet copy pass corrected `lib/products.ts`, `lib/applications.ts` and
the `/about` fallbacks. On the live site:

- ✅ **Showing** — the catalogue spreads on both page types (they read
  `lib/product-catalogue.ts` / `lib/application-catalogue.ts` directly, which
  Sanity does not touch), the SPECIFY lists, the "Systems for…" sidebar order,
  every image, and all seven new Field Notes.
- ❌ **Not showing** — the product hero subtitle, the product "How it works"
  paragraph, the Full specification sidebar, and the application hero subtitle
  and "How it works" paragraph.

So TrafficPatternsXD still introduces itself as *"Stamped asphalt with
aggregate-reinforced preformed thermoplastic"* — the exact line Doug would
flag — because that sentence is in Sanity, not in the code.

---

## The fix

Three sync scripts already exist. They read the code, diff it against Sanity,
and overwrite the text fields. They are idempotent — running twice changes
nothing the second time.

Run them **on your machine**, from the repo root, with `.env.local` holding a
`SANITY_API_WRITE_TOKEN` (create one at sanity.io/manage → API → Tokens → Add,
with Editor permissions).

```bash
# 1. Look first — this only reports, it writes nothing
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

### Read the dry run before applying

The scripts overwrite. If anyone has edited copy in Sanity Studio that is not
in the code, that edit is what gets replaced. As of this writing nobody has —
every doc still matches the migration — but the dry run is there so you can
confirm that rather than assume it.

---

## When to reach for this

Any time a copy change to `lib/products.ts`, `lib/applications.ts`, or the
`/about` fallbacks in `app/about/page.tsx` does not appear on the live site,
this is why. Run the matching dry run first; it will show you the field.

Images, galleries, related products, spec-card copy, colours, documents and
blog posts are **not** affected — those come from code only, and deploy the
moment the push lands.
