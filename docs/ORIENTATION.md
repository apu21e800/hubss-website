# ORIENTATION — hubss-website · 9 Sep 2026

Supersedes the 8 Sep orientation. Three of its claims were wrong; they are
corrected below and marked ⚠. Everything here was verified against the repo
and against live production on 9 Sep, not against a document.

---

## THE ONE RULE THAT MATTERS

**Production is `origin/main`. Nothing else deploys.**

```
origin/main   07bad25   → hubss.com (Vercel, auto-deploy on push)
origin/v2     0fff167   → 5 ahead of main, 128 behind. Deploys nowhere.
```

Local disk cannot break hubss.com. Only a push to `main` can.

---

## ⚠ THREE CORRECTIONS TO THE 8 SEP ORIENTATION

### 1. The "highest priority LIVE PRODUCTION BUG" is not a bug

The 8 Sep doc says five brand logos are dead data because "the config half
shipped and the rendering half never did." The causality is backwards.

The rendering **shipped in April 2026** and was **deliberately removed on
14 May 2026**, commit `5d3def1`:

> "Logo display removed from both main content column and sidebar. Hero H1 +
> photography does the job better. brandLogo data preserved in products.ts so
> we can revisit placement later without re-adding data."

The data is a parked asset, kept on purpose. The comment that commit left
behind was cleaned away later, which is what makes it look orphaned.

**Do not apply `0001-design-final-pass.patch`.** It and the
`tender-chandrasekhar-456a28` worktree both predate the removal — the
`240×96` comes from `9e83678` (16 Apr), the `320×120` is the sidebar block
`5d3def1` deleted. Both target a product page that has since been rebuilt
around the catalogue spread. Applying either undoes a design decision and
will not build cleanly.

The rationale now lives on the `brandLogo` field in `lib/products.ts`
(commit `07bad25`) so this stops recurring — it had been re-reported three
times.

If Vernon and Doug decide they want logos back, that is a fresh design task
against today's page, not a revert.

### 2. "v2 is synced with origin" means `origin/v2`, not `origin/main`

`origin/v2` is **128 commits behind production**. Anything built on v2 is
built on a July base. The five commits v2 has that main does not:

```
0fff167  merge: pdf-previews fix onto the line-ending normalization
fc7d325  chore(git): renormalize 105 blobs stored with CRLF
838cd26  email(tpxd): rewrite upload guide for v2
a8b0170  Add CC-ready HTML for Aug 2026 TrafficPatterns XD email
9e6424d  Add Aug 2026 TrafficPatterns XD email photo assets
```

Real work, stranded. It needs to come forward to main — see Open Items.

### 3. The line-ending fix never reached production

The renormalization is real but lives **only on v2**. `main` still carries
~90 CRLF blobs (sampled: first 400 text files). `.gitattributes` is correct
and identical on both branches (63 lines) — the rules are in place, the
blobs on main just have not been rewritten.

---

## THE TRAP THAT COSTS THE MOST TIME

**Sanity overrides the code on product and application pages.**

| Field | Products | Applications |
|---|---|---|
| `shortDesc` (line under the H1) | **Sanity wins** | **Sanity wins** |
| `description` ("How it works") | **Sanity wins** | **Sanity wins** |
| `specs` (Full specification) | **Sanity wins** | — |
| images, galleries, related products, catalogue spreads, colours, docs, blog | code | code |

Edit `lib/products.ts`, build clean, deploy green, see no change on the live
page — that is this. `/about` behaves the same way via `page-about`.

The fix is one command with a `SANITY_API_WRITE_TOKEN` in `.env.local`:

```bash
npm run sync:products:dry      # look first, writes nothing
npm run sync:products
npm run sync:applications
npm run sync:pages
```

**Read `docs/SANITY-COPY-SYNC.md` before touching product or application copy.**
As of 9 Sep all three are synced — a dry run returns 0 changes.

Second-order gotcha: `scripts/sync-pages-to-sanity.ts` holds its **own** copy
of the /about text rather than reading `app/about/page.tsx`. Both must move
together. There is a note at the top of the script saying so.

---

## COPY SOURCE OF TRUTH

The **2027 print catalogue** — Figma file `GGxfcnIv3MozUSa8R7KtT9`, page
"Catalogue 2027" — is the approved copy. Doug has signed off on the printed
page. **Where the site and the book disagree, the book wins.**

Transcribed into:
- `lib/product-catalogue.ts` — the ten product spreads
- `lib/application-catalogue.ts` — all 17 application spreads and their
  SPECIFY lists (which system goes in that work, and why)

`lib/products.ts` and `lib/applications.ts` are written from those.

Numbers that are now settled, do not reintroduce the old ones:
- **27 years**, since **1999** — not "30+". StreetPrint the *product* is since
  1992, so "over 30 years" is true of the product only, never the company.
- **1,000+ projects**, **10 provinces**. There is no "500+ municipalities" and
  no "500+ installations" — no HUB document states either.
- Service life is **per system**: StreetPrint 10–20 yr, TPXD 10+,
  TrafficPatterns 8+, StreetBond 8+, PreMark 6–8. No site-wide "20-year"
  claim.
- TrafficPatternsXD is **aggregate-reinforced preformed thermoplastic** — it
  is not stamped asphalt.
- Glass beads belong to **PreMark and AirMark only**. TP and XD carry
  anti-skid aggregate through the cross-section.
- LEED is **v5**, not v4.

---

## WHERE WE ARE — shipped 8–9 Sep, all live and verified

**Images.** 61 catalogue photographs added (the client's own hero picks), 18
existing files replaced at higher resolution, 7 rotated upright, all
re-encoded with metadata stripped at 2400px. Every product and application
hero is now the catalogue's pick where one exists.

**Galleries.** All 1,394 photos reviewed on contact sheets.
`lib/gallery-curation.mjs` carries the verdicts — an ordered `lead` per
gallery, 60 hidden, 348 trailed. The generator measures every file: under
800px hidden, 800–1199px sorted last. 1,513 images across 87 galleries.

**Copy.** Product and application pages rebuilt from the booklet. All 17
application spreads live with their SPECIFY lists, which also reorder each
page's "Systems for…" sidebar.

**Field Notes.** 74 posts, 7 new, written out of booklet pages. Registered in
`lib/field-notes-taxonomy.ts`.

**Documents.** MMAX Colour Palette added; every PDF now carries every preview
page (286 across 67 docs, was 149).

**Infrastructure.** `/about`, `/applications` and `/applications/[slug]` had
no `revalidate` and never re-read Sanity — fixed, 3600s, matching products.

---

## OPEN ITEMS

**Vernon-side, not agent work:**
1. **Search Console is not connected** — verified 9 Sep: no meta tag, no DNS
   TXT records at all on hubss.com, no verification file. It was never set up
   for this site. `sitemap.xml` and `robots.txt` are live and correct, so
   verification is the only missing step. Easiest path is URL-prefix + HTML
   tag; the tag goes in `app/layout.tsx` under `metadata.verification.google`.
   Bing then imports from Search Console in one click.
2. **`SANITY_WEBHOOK_SECRET` is not set.** `app/api/revalidate/route.ts`
   exists to let Sanity push a cache invalidation on publish. Until the secret
   is set in Vercel and Sanity, one hour is the floor on how fast a Sanity
   edit reaches the site.
3. **GitHub app access for Cowork sessions** —
   github.com/settings/installations → Claude → Configure → add
   `apu21e800/hubss-website`. Ends the git-bundle workaround for binaries.

**Agent work, in priority order:**
4. **Bring v2's five commits forward to main.** The CRLF renormalization will
   land as ~12k lines of churn — give it its own commit, on a quiet day, not
   before a client review. The TPXD email assets should come across too.
5. **Site-wide image compression.** `/public/images` is ~2.3 GB. Blocked on
   item 3 for Cowork sessions; a local agent can do it now.
6. **Vercel project transfer** to a HUBSS-owned Pro account. Runbook exists at
   `docs/VERCEL-TRANSFER-RUNBOOK.md`. Backlogged by Vernon — do not start
   without him.
7. **Worktree cleanup.** 9 dirty worktrees remain. `vigilant-dijkstra-f1d75d`
   is 4.70 GB orphaned and needs a long-path-capable delete. Three
   unregistered stale dirs under `.claude/worktrees/`. Commands only — Vernon
   runs deletions.

**Waiting on Doug, not on anyone here:**
8. Six print typos in the catalogue, listed in `HUBSS-FACTS-DIFF.md` §2 —
   `acylic`, `stake holders`, `can reproduces`, `a non slip surfaces`,
   `complimenting`, `keeps us cooler`. Worth catching before it prints.
9. Whether third-party storefront branding can be shown by name — Walmart,
   Home Depot, Fortinos, Winners, Tim Hortons appear in demoted gallery
   photos. They are real HUB installations, currently kept but sorted last.

---

## REPO GEOGRAPHY

```
C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website
```

**Trap 1:** `C:\Users\cleve\Based_Agency\projects\HUBSS` is not this repo and
not a git repo — its `.git` has only `config` and `hooks/`. With no HEAD, git
walks up and answers from the `Based_Agency` parent. It misled two sessions.

**Trap 2:** `based-agncy_os` is itself a git repo containing this one. Git run
from the wrong directory resolves to the parent.

**Always confirm `git rev-parse --show-toplevel` before trusting git output.**

Pending migration to `D:\STUDIO-01\02-HUBSS\`. Until it lands, **C: is
canonical**; the two copies already on D: (`hubss-website\` and
`site\hubss-website-repo\`) are stale — ignore both. Do not create new
worktrees or hardcode C: paths.

Safety tag `safety/pre-rebase-20260908` marks the pre-merge state (local only,
not on origin).

---

## STANDING RULES

- **Never `--force` anything.** No force push, no forced worktree removal.
- **No deletions without asking.** Produce the command; Vernon runs it.
- **No numbered option menus.** Pick the safest non-destructive path, do it,
  report after.
- **Verify against disk, not documents.** Repeatedly on this project a
  document has confidently described something that had changed underneath
  it — including the 8 Sep orientation, and including this one eventually.
- **Batch work and report once.** Do not check in between every step.
- **Improve only, never degrade.** Every change ships verified: build, then
  check the live page, then report.
- **Never invent facts, testimonials, prices, or credentials.** No CE / AIBC /
  RAIC / PEO / CPD credit claims anywhere — Doug never authorised them.
- Owner-sensitive client. Orange is marking paint: one primary CTA per
  surface.
- Moose the dog stays.

---

## READ FIRST, IN THIS ORDER

1. `CLAUDE.md` — project intelligence, bundle protocol, shell traps
2. `docs/SANITY-COPY-SYNC.md` — before any product or application copy change
3. `docs/IMAGE-WORKFLOW.md` — before touching images
4. `lib/product-catalogue.ts` and `lib/application-catalogue.ts` — the
   approved copy, and the reason the rest of the copy reads the way it does

One shell trap worth carrying: `pkill -f "next"` matches the invoking shell's
own command line and kills it mid-command, silently skipping everything after
it (exit 144). Write it `pkill -f "[n]ext start"`.
