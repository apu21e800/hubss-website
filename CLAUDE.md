# HUBSS.com — Project Intelligence File

## Client
HUB Surface Systems — Canadian leader in decorative and functional pavement
solutions. Canadian-owned since 1999; the 2027 catalogue says "27 years ·
1,000+ projects · coast to coast" and those are the numbers the site uses.
StreetPrint itself is older — a Canadian invention installed since 1992 —
so "over 30 years" is true of the PRODUCT, never of the company. Two
regional offices:
- East: Milton, Ontario (doug.bain@hubss.com / 416-540-9287)
- West: Ladysmith, BC (cleve.stordy@hubss.com / 604-309-8212)

## What They Do
Stamped asphalt, preformed thermoplastics, and specialty coatings for
municipalities, developers, and contractors across Canada. Products include
TrafficPatterns, TrafficPatternsXD, StreetPrint, StreetBond, MMAX, DecoMark,
DuraShield, DuraTherm, PreMark, AirMark.

Applications: Crosswalks, Bus & Bike Lanes, Driveways, Public Art, Regulatory
Markings, Parks & Paths, Community Branding, Town Homes, Parking Lots, Airports.

## Brand
- Colors: Black background, orange accent (#F97316 approx), white text
- Tone: Municipal authority meets civic pride. Technical credibility + visual impact.
- Positioning: "Redefining hardscapes" — surfaces as community identity, not
  just infrastructure
- Key proof points: Vision Zero, Complete Streets, AODA compliance, used by
  York Region, City of Toronto, Vancouver, UBC. Service life is per system,
  from the catalogue: StreetPrint 10–20 yr, TrafficPatternsXD 10+,
  TrafficPatterns 8+, StreetBond 8+, PreMark 6–8. There is no site-wide
  "20-year durability" claim — do not reintroduce one.

## Tech Stack
- Next.js 16.1.6 (App Router, Turbopack)
- Tailwind CSS 4
- TypeScript (strict)
- Blog posts in Sanity Studio, rendered by components/blog/PostBody.tsx
  (docs/BLOG-IN-SANITY.md); the old .mdx files are in content/blog-archive
- Framer Motion for animations
- Resend for transactional email (contact + lunch & learn forms)
- Images: product and application galleries and heroes, and the homepage and
  About heroes, come from Sanity Studio (lib/photos.ts, docs/IMAGE-WORKFLOW.md);
  /public/images is their fallback and holds everything else
- Documents: /public/docs/ — PDFs linked by filename

## Environment Variables
Copy .env.local.example → .env.local and fill in:
- RESEND_API_KEY — from resend.com (required for forms to send)
- CONTACT_EMAIL — receiving address (defaults to info@hubss.com)

## Project Structure
hubss-website/
├── app/
│   ├── page.tsx (landing page)
│   ├── projects/
│   ├── products/
│   ├── applications/
│   ├── about/
│   ├── blog/
│   └── contact/
├── components/
│   ├── ui/ (buttons, cards, nav)
│   ├── sections/ (hero, projects, lunch-learn, footer)
│   └── blog/ (post layout, card)
├── content/
│   └── blog-archive/ (the blog's .mdx files until Sep 2026; not read by the site)
├── public/
│   ├── images/
│   └── docs/
└── CLAUDE.md

## Pages to Build (in order)
1. Landing page — hero, products grid, applications, recent projects,
   lunch & learn CTA, footer
2. Projects page — filterable grid by product/application
3. Products page — each product with specs
4. Blog — written and published in Sanity Studio
5. Contact — form + both office locations

## Adding Content (no developer needed)
- New article: Studio → Insights → create, then Publish. It is live
  about five minutes later (the site rebuilds to add the page); edits to live
  posts show within seconds. docs/BLOG-IN-SANITY.md
- Article ideas: Studio → Insights plan. Mark one Ready and the Tuesday AI
  drafter writes it up as an unpublished draft for review (never publishes).
- Swap hero image: replace /public/images/hero.jpg
- Add PDF spec sheet: drop in /public/docs/, update link in products page
- New project: add entry to /content/projects/project-name.mdx

### Putting a project on the homepage map
The map's pins are the curated entries in `lib/map-projects.ts`, with their
hand-written Challenge/Solution prose. A pin whose photo lives in
`/public/images/blog/<slug>/` is that post's pin and gains a "Read the
write-up" link, as long as the post is published in Sanity
(scripts/gen-map-blog.mjs). Until Sep 2026 a post could also make its own pin
from map* keys in its .mdx frontmatter; no post used them, and they went with
the files. Studio has a "Projects (Map Pins)" list from the May 2026
migration, but the map does not read it yet (its Studio title says so);
moving the map into Sanity is the way to let Doug add pins.

The project count the page prints comes from `lib/map-count.json`, regenerated
every build. Do not type a project count anywhere: the phone card used to say
"84 projects" while the map's own header, forty pixels below it, said 59.

## Conversion Goals
Primary CTA: "Request Spec Sheet" + "Book Lunch & Learn"
Secondary: Project gallery browsing → contact form
Lead capture: Name + Email + Phone (matches current form)

## Commands
npm run dev     # local development
npm run build   # production build
npm run start   # run production locally

## Deploy
Vercel — connected to GitHub, auto-deploys on push to main

## Names (Doug's round, 25 Sep 2026)
- The printed book is the **Idea Book** on the site ("The HUB Idea Book ·
  Volume 5"), never "catalogue", and no page count is printed anywhere. The
  reader is /idea-book, the form /request-idea-book; the old /catalogue URLs
  redirect. One source for the name: `ideaBook` in lib/catalogue.ts. Code
  identifiers (lib/catalogue.ts, showCatalogue, /public/catalogue) keep the
  old word on purpose.
- The blog is **Insights** (was Field Notes). Labels only: /blog URLs, the
  Sanity types (blogPost, storyIdea), the cron routes and env names are
  unchanged. The "Blog" post type prints as "Article" (lib/field-notes-taxonomy.ts,
  `badge`); its stored value stays "Blog".
- The repair family is **Asphalt & Concrete Repair** (lib/product-categories.ts,
  lib/product-taxonomy.ts, the three product eyebrows in lib/products.ts).

## Copy source of truth
The 2027 print catalogue — the Idea Book, Volume 5 — (Figma file
GGxfcnIv3MozUSa8R7KtT9, page "Catalogue 2027") is the approved copy. Doug has signed off on the printed
page; where the site and the book disagree, the book wins. It is transcribed
into lib/product-catalogue.ts (product spreads) and lib/application-catalogue.ts
(the 17 application spreads and their SPECIFY lists), and lib/products.ts /
lib/applications.ts are written from it.

BEFORE changing product, application or page copy, read docs/SANITY-COPY-SYNC.md.
Sanity OVERRIDES the code for: product and application name, shortDesc,
description and SEO title/description, plus product eyebrow, specs and homepage
blurb (on the product pages, the application pages, /applications and the
homepage), and the hero and About text on /, /about, /contact and /lunch-learn.
Editing the lib file or a page's fallback alone changes nothing there until the
sync runs. Products go through one merge (lib/products.server.ts), applications
through another, both on the rule in lib/cms-merge.ts: a blank Sanity field
falls back to the code. The /products index is code-only.
`npm run sync:products`, `sync:applications` and `sync:pages` push the code
into Sanity; each has a `:dry` variant that reports first and needs no token.
The product and application galleries and hero photos, and the homepage and
About hero photos, also come from Sanity (docs/IMAGE-WORKFLOW.md), with the
/public/images folders as the fallback. Everything else — the catalogue
spreads, related products, colours, documents — is code-only and deploys on
push. The blog is the exception the other way: it is Sanity-only
(docs/BLOG-IN-SANITY.md), with no code fallback.


## Bundle import protocol (Claude Cowork -> this repo)

Bundles exist because pushes from the Cowork sandbox are blocked by a proxy
403 ("not in this session's authorized repository set"), and the API fallback
used for text files cannot carry binaries — it stores base64 as literal text,
which was measured, not assumed: a 2,704-byte WebP came back as 3,429 bytes of
garbage. Anything binary therefore travels as a git bundle.

The GitHub side is NOT the blocker. Checked 23 Sep 2026: the Claude GitHub App
already has "All repositories" on apu21e800 (github.com/settings/installations).
The proxy refuses because the repo isn't attached to the Cowork session:
"apu21e800/hubss-website is not in this session's authorized repository set ...
add the repository to the session's sources." As of 24 Sep 2026 Cowork has no
setting to do that (open bugs anthropics/claude-code #84581 and #96075), so:
bundles, imported and pushed by Claude Code on Vern's PC.

**This repo deploys from `main`.** An earlier version of these steps said `v2`.
That branch still exists on origin and is 100 commits behind, so following the
old instructions imported cleanly onto a branch nobody serves — a silent
no-op where the import reports success and the site never changes.

When Vern says "import the bundle": find the newest hubss-*.bundle in this
folder or C:\Users\cleve\Downloads (move it here if needed), then:
1. git bundle verify <file>          — stop and report if it fails
2. git checkout main && git pull --ff-only
3. Confirm the base commit the bundle names is present: git cat-file -t <sha>
4. git fetch "<file>" <branch>:<branch>   — the branch name is in the bundle;
   read it with `git bundle list-heads <file>` rather than guessing
5. git merge --ff-only <branch>
   On non-fast-forward: do NOT force. Show `git log --oneline <base>..main`
   and stop — main moved and the bundle needs rebuilding against it.
6. git push origin main
7. Delete the bundle file; show git log --oneline -3 + confirm remote SHA.

DEPLOY TRAP, learned 26 Sep 2026: never read /public with fs at runtime
(existsSync, readdirSync, path.join(process.cwd(), "public", ...)) from a
page or component. Vercel's file tracing then packs the whole /public
folder, 2.84 GB of Idea Book rasters included, into that page's function
and the deploy fails ("exceeds the maximum uncompressed size limit of
250mb"). List files by hand or generate a JSON at build time (the
scripts/gen-*.mjs pattern) and import that.

Two ways work reach this repo from Cowork now: text changes go straight to
GitHub through Vern's GitHub connector (one commit per push, files must be
text); anything binary (images, PDFs) still travels as a bundle, per the
protocol above.
Anything that writes to Sanity runs on Vern's PC.

SHELL TRAP, learned the hard way: `pkill -f "next"` (or "next start") matches
the invoking shell's OWN command line and kills it mid-command — everything
after the pkill silently never runs, and the exit code is 144. Hours were
lost to stale .next builds this caused. Always write it as
`pkill -f "[n]ext start"` — the character class cannot match itself.

Never `git reset --hard` in this repo. Banner-dash drift in comment blocks is
known-benign — prove it with `tr -d '─═━'` + `cmp`, then recover a single file
with `git checkout origin/main -- <path>`.
