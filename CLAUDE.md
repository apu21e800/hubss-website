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
- Next.js 16.4.0 (App Router, Turbopack); 16.1.6 until the 7 Oct 2026 security patch
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
- FORM_SCREENED_EMAIL — where the forms send what they hold back from
  info@hubss.com (defaults to cleve.stordy@hubss.com). Nothing is dropped.
- ANTHROPIC_API_KEY — the Insights drafter and the forms' spam screen

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
- New article: Studio → Blog posts → create, then Publish. It is live
  about five minutes later (the site rebuilds to add the page); edits to live
  posts show within seconds. docs/BLOG-IN-SANITY.md
- A post written by hand (markdown with front matter in content/drafts/):
  `npx tsx scripts/draft-blog-post.ts content/drafts/<file>.md` on Vern's PC
  saves it as an unpublished draft with its cover (--dry-run first: it runs
  the house-style check and writes nothing). First one: the Product Book's
  launch post (16 Oct 2026).
- Article ideas: Studio → Blog ideas. The AI drafter (Tuesdays and
  Thursdays since 14 Oct 2026) takes the top Ready item, or the top Idea when
  none is Ready, and writes it up as an unpublished draft for review (never
  publishes). When the plan gets low it adds Ideas itself
  (lib/insights-planner.ts).
- Change any text or photo the site takes from Studio: Studio → Edit on the
  page, click it (see "Edit on the page" below).
- Swap a hero photo: Studio → Edit on the page → click the photo, pick or
  upload one, then set its focal point with the crosshair (hotspot). The
  homepage hero's phone and wide-screen cuts and the product and application
  banners crop around it.
- Add PDF spec sheet: drop in /public/docs/, update link in products page
- New project: add entry to /content/projects/project-name.mdx

### Putting a project on the homepage map
Since 28 Sep 2026 the map shows only real, documented jobs (Vern: "no fake
locations"); since 30 Sep 2026 it shows as many of them as can be placed
(Vern: "more locations on the map the better"). A pin needs a real job at a
real place, documented by a published Insights post OR by the Product Book
(Volume 5: its caption names the place and the system), and every photo on it
is of that job. No stand-in or "Representative" pins; the 26 removed on 28 Sep
stay removed. Where only the town is known, or the site was matched from the
photograph, the entry is `approximate: true`: the card says so and the camera
stops at city scale. Each entry's comment says what places it and how sure it
is; where the book's caption and the evidence disagree, the evidence places
the pin and the comment says so.

To add a job: add the entry in `lib/map-projects.ts` with `post: "<slug>"`
(its write-up) and/or `ideaBookPage`, and its photos as `cdn("<Sanity asset
file>")` (a gallery or post copy, found by matching the photo) or
`local("<name>")` for a file in /public/images/map (1600px, plus a 640px
<name>-sm.jpg twin). Map photos never go through /_next/image
(lib/map-photo.ts). The Product Book photos, resized, are in
D:\STUDIO-01\02-HUBSS\Claude outputs\map-photos_2026-09-30.

The map component (components/sections/CanadaMap.tsx, rebuilt 30 Sep 2026)
has no popups: a pin opens in the floating panel (desktop) or a sheet
(phone), hovering labels the pin on the map, and "Take the tour" flies
through the highlights (TOUR_IDS). Studio has a "Projects (Map Pins)" list
from the May 2026 migration, but the map does not read it.

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

## Names (Doug's rounds, 25 Sep, 14 Oct and 17 Oct 2026)
- The printed book is the **Product Portfolio Book** on the site ("Product
  Portfolio Book · Volume 5", Doug's words, 17 Oct 2026): "catalogue" until
  25 Sep 2026, the "Idea Book" until 14 Oct, the "Product Book" until 17 Oct.
  Never "catalogue", "Idea Book" or "Product Book" now (Studio warns on all
  three, lib/style-lint.ts), and no page count is printed anywhere. The
  book's home is /product-book: the printed book page by page with a page
  turn (the reader, below), /product-book/<n> for any other page, the form
  /request-product-book; every /catalogue, /idea-book and /product-book/pages
  address 308s straight to its current one (next.config.ts). One source for
  the name: `ideaBook` in lib/catalogue.ts. Code identifiers and routes
  (`ideaBook`, lib/idea-book-*.ts, components/idea-book, IdeaBookBand,
  showCatalogue, /public/catalogue, `test:idea-book`, /product-book) keep
  the old words on purpose: labels change, URLs stay.
- The blog is **Insights** (was Field Notes). Labels only: /blog URLs, the
  Sanity types (blogPost, storyIdea), the cron routes and env names are
  unchanged. The "Blog" post type prints as "Article" (lib/field-notes-taxonomy.ts,
  `badge`); its stored value stays "Blog".
- Studio says it in plain words (15 Oct 2026; Vern: "what does not live mean?
  ... maybe better to just call it blog"): **Blog posts** (blogPost; the site
  still calls the blog Insights), **Blog ideas** (storyIdea, was "Insights
  plan"), **Job photos for social** (fieldPost, was "From the field"; the
  stream keeps that name in logs), **Sent to Buffer** (socialLog, read only).
  The old "Projects (Map Pins)" list is off the sidebar and the Create menu
  (the map reads lib/map-projects.ts; its documents are kept). The global
  Create menu offers only hand-made types (NOT_CREATED_BY_HAND in
  sanity.config.ts). The lists keep their old ids, so saved links still work.
- The repair family is **Asphalt & Concrete Repair** (lib/product-categories.ts,
  lib/product-taxonomy.ts, the three product eyebrows in lib/products.ts).

## Doug's homepage round (14 and 16 Oct 2026)
- The Product Book's callout sits beside the orange "See the work" button,
  in place of the outlined second button: the cover, "The HUB Product Book",
  "Read it online →" (app/page.tsx `heroBook`, HeroSlideshow `book`,
  .hero-book in globals.css). Doug, 16 Oct: the outline "Open the Product
  Book" button "is not enough"; Vern, the same day, after a version with the
  callout under both buttons: "drop the ghost button again and put the
  booklet callout to the right of the orange 'see the work' button".
- With the book off (showCatalogue) there is no callout and the second
  button returns: Studio's Secondary CTA label and link ("See the systems" →
  #systems). From 14 to 16 Oct it opened the Product Book
  (`productBookButton`, gone).
- The Product Book card that sat in the hero's corner on 14 Oct was taken
  out the same day (a revert of 2bd0a4f); the homepage band stays.
- Resources is no longer a button in the bar: it is in the Products menu
  (Nav.tsx `RESOURCES`): the panel's foot row on a laptop, a row under the
  families on a phone; /resources marks Products as the current section.

## Site QA sweep (16 Oct 2026)
Two agents swept a local production build (every sitemap route at 1440 and
390, then the main pages by eye; never hubss.com, never a form submit). No
page errors, broken images or sideways scroll. Fixed in 4cc2994: Lunch &
Learn topic tap on a phone, lightbox preloads, search aria-activedescendant,
footer h2s, Product Book jumps (`primeLeaf`), separator dots
(lib/separators.ts), /applications three-line descriptions, tap targets.
Then, on Vern's answers:
- "Ten systems, ten different jobs." on the homepage, as the Product Book
  counts them (Vern: "yes 10 systems"): the six cards plus PreMark,
  DuraShield, DuraTherm and StreetBondSR named under them (AirMark, not one
  of the book's ten, left that line). Studio holds the heading: the clean-up
  script below writes it; lib/homepage-copy.ts is the fallback. Since 17 Oct
  2026 the second phrase is Doug's "endless job types."
  (scripts/studio-cleanup-2026-10-17.ts, same pattern, dry run by default).
- The homepage map's project cards lead to projects, never the Product Book
  (Vern: "map should go to projects, not the booklet"): the write-up, or
  "More projects" (/blog/projects) for the 40 jobs without one
  (components/sections/map/ProjectDetail.tsx). A phone frames the pins
  themselves (PHONE_BOUNDS in CanadaMap.tsx); desktop keeps ALL_BOUNDS.
- Page descriptions over 160 characters were shortened in code (gallery,
  resources, contact, Lunch & Learn, privacy, the Product Book's three
  pages, the Projects and Guides hubs).
- scripts/studio-cleanup-2026-10-16.ts (Vern's PC; dry run by default,
  `--apply` writes): the Ten heading, three homepage blurb typos, and
  search titles and descriptions for 61 posts (Studio's "Search result
  overrides", only where empty). It never overwrites a value edited since.
- Left as they are: the seven posts dated 8 Sep 2026 (written for the new
  site that day), `?theme=` review links sticking, /product-book/<n> pages
  indexable, the StreetPrint hero's 2px white edge (in the file itself; a
  Studio crop does not reach the hero URL).

## Analytics: people, not programs (15 Oct 2026)
Doug saw "high traffic from Singapore" and a drop from 17 Sep in GA4. What
the data showed (GA4 and Search Console, 17 Sep to 14 Oct vs the 28 days
before): the "drop" was 484 fake sessions from Seychelles via trafficheap.cc
(a fake-traffic service) in the earlier period, gone after 16 Sep; Singapore
(386 users) and China are automated visits (0 s, about 2% engaged, no key
events); real visitors rose (Canada +24% users, +23.5% engaged sessions).
Google search: clicks -19%, impressions -20%, average position 11.1 to 7.9;
the same autumn dip as 2025 (impressions -24%); year on year impressions are
about 40% below the WordPress site's.
- components/HumanAnalytics.tsx: GA4 loads only when lib/automated-browser.ts
  sees no automation signal (navigator.webdriver, headless or crawler user
  agents, no languages, a zero-size window). A person never trips one;
  `npm run test:analytics`. Our own headless QA is no longer counted either.
- The printed Product Book request now sends generate_lead (form_type
  product-book-print), like the contact and Lunch & Learn forms.
- lib/legacy-doc-redirects.ts: old WordPress spec-sheet PDFs go to the same
  PDF in /public/docs (by name for every current PDF, by hand for renamed
  ones), not to /resources; `npm run test:redirects`. Since 16 Oct an old
  sheet with no copy here but a plain system (the StreetBond safety data
  sheets, the TS007/TS008 sheets) goes to that system's page (TO_PAGE, after
  the file rules, so adding the file later takes over).
- /sitemap-legacy.xml (16 Oct 2026; app/sitemap-legacy.xml/route.ts, list in
  lib/legacy-addresses.json): the 219 old addresses Search Console showed
  earning traffic, all redirecting, for Search Console and Bing to re-read.
  Not linked from /sitemap.xml or robots.txt. Remove in April 2027. The four
  old pages still 404ing on 16 Oct got redirects in next.config.ts, and so
  did five under /featured-projects/ and /decorative-stamped-driveways/ that
  404'd once their trailing slash came off. `npm run verify` follows every
  address in the list to its end ("old addresses land on a page").
- Not done (Vern's dashboard): Vercel Firewall Bot Protection is Off. Turning
  it On would challenge non-browser clients, including the Sanity webhook
  (/api/revalidate): it needs a bypass for /api first; Log mode first.

## The Product Portfolio Book reader (17 Oct 2026)
Doug, 17 Oct 2026: "not happy with the virtual long scroll version of the
Product Booklet, he likes the virtual print version better, so let's revert
to that ... if we can add a better page flip animation that's smooth we can
do that too." So /product-book is the printed book again, page by page
(app/product-book/CatalogueViewer.tsx), with a page turn: one leaf, the page
being left, lifts from its free edge about the spine (rotateY, perspective
on the stage) and lays down with the next page on its back, 620 ms on a key
or a button; under a finger it follows the drag and finishes on release
(past 42% of the leaf's width, or a flick). On a phone (one page at a time)
the leaf lifts away to 90 degrees and the next page is beneath. In spread
mode a lone page sits on its own side (the cover right, the back cover
left), as in the bound book. The scrubber and prefers-reduced-motion keep
the 160 ms cross-fade. No filter on the leaf: a filter flattens the 3D
context and the back face would draw mirrored over the front.
- The long-scroll edition is parked, unlisted, at /product-book/edition
  (noindex, no sitemap entry, nothing links to it; app/product-book/edition/page.tsx)
  so it can come back on a word; delete the folder when it is not wanted.
  Its data and components are below. `npm run test:idea-book` still covers
  them. The launch article drafted for it (content/drafts/product-book-online.md)
  was rewritten for the reader the same day; any Studio draft made from the
  old wording must not be published.

## The Product Book edition (14 Oct 2026, parked 17 Oct)
Vern: "a mobile / virtual desktop version of the idea book that's not just a
square PDF ... same content in booklet, better display for mobile and desktop
experience. Doug's dream." /product-book/edition is that edition (it held
/product-book from 14 to 17 Oct): one leaf per printed
spread, 75 leaves for the 144 pages, laid out for the screen (a phone stacks,
a laptop puts the photograph beside the page). Reading is plain scrolling
(no snapping since 16 Oct 2026: Vern found it jumpy), ← and → turn leaves, C
opens the contents, every leaf has its own address (#streetbond) and links to
its pages as printed. The leaf in view is the one covering most of the
screen, and a leaf's photo and heading arrive once 120px of it shows.
- lib/idea-book-edition.ts is the book: `LEAVES`, typed by kind (cover,
  welcome, divider, system, colours, steps, templates, application,
  statement, projects, then-now, installer, partner, closing, lunch, back).
  The words are the printed page's, from the PDF's text layer (the system
  and application spreads in lib/idea-book-print.ts, the rest in the leaves),
  em dashes written out. NOT lib/product-catalogue.ts or
  lib/application-catalogue.ts: those were transcribed from the Figma master
  on 7 Sep 2026 and the book went to press with different wording on most
  system and application pages (subheads, bodies, SPECIFY notes, uses
  strips). The site's product and application pages still carry the Figma
  wording; Doug to say which is current (list in the 14 Oct release record).
  A `Photo` is a printed page and the band of it that is the photograph
  (`top`/`bottom` as fractions of the page's height), so the photographs are
  the page renders in public/catalogue, shifted, never re-cut;
  `SITE_PAGE_CAPTION` (0.92) stops above the captions the renders carry.
  Captions are the book's own: where the book prints none, the leaf has none
  (the map pin's city can differ: York Region for Vaughan).
- components/idea-book/Leaves.tsx lays each kind out, PagePhoto.tsx shows a
  band (`fit` widens a frame around the photo's focus, for a pair at one
  shape), EditionShell.tsx is the chrome (client: bar, progress, contents
  drawer, keys, the hash following the leaf in view). app/product-book/edition.css
  is the book's own language: paper, #1f1f1f ink, the orange rule, Inter,
  fixed whatever the site theme.
- Where a layout fills a frame of another shape (a system's photo column, a
  divider's band on a laptop), PagePhoto's `.ib-band` box covers the frame at
  the photo's own shape and sits at its `focus` (fractions of the band, not
  the page), so a printed caption or heading never shows. Until 16 Oct 2026
  that was object-fit: cover on the whole page: captions showed, cut, on
  1024 to 1280px screens, and heads were cut. Same day: a spread stays inside
  1360px on a big monitor (the leaf's side padding grows), page 123 shows its
  StreetBond logo whole, page 102 lost a white strip. Check framing with a
  screenshot of every `.ib-photo` at 1024, 1440, 1920 and phone width.
- `npm run test:idea-book` (CI too): every page in exactly one leaf, every
  link resolves, no em dash. The verify pass runs axe and the phone image
  budget on /product-book.
- The printed caption on page 57 says London, Ontario; the map's evidence for
  that job is Kitchener. The edition prints the book's caption; Doug to say.
- A spread fits the screen (15 Oct 2026). At 1536x730 (a 1920x1080 laptop at
  125%) 54 of 75 leaves ran taller than the screen, captions under the fold
  and under the turn buttons. `--ib-photo-max-h` is the leaf's height less
  its real padding (`--ib-pad-y` above, `--ib-pad-end` below: 76px on a
  laptop, where the buttons float); layouts cap a photo's WIDTH from it with
  `--ib-ratio`, set on the box that holds the photo with its caption
  (`ratioOf` in Leaves.tsx), so a photo keeps its shape and its caption lines
  up under it. Under 820px tall the page cards draw in their spacing; under
  840px a two-job spread is two rows, photo beside words. Only the welcome,
  the systems contents and the two colour pages scroll, by design, at
  1920x950, 1536x730, 1440x790 and 1440x900. Measure any layout change at
  those sizes (each leaf's height against `.ib-scroll`'s), not only 1440x900.

## Copy source of truth
The 2027 print catalogue — the Product Book, Volume 5 — (Figma file
GGxfcnIv3MozUSa8R7KtT9, page "Catalogue 2027") is the approved copy. Doug has signed off on the printed
page; where the site and the book disagree, the book wins. It is transcribed
into lib/product-catalogue.ts (product spreads) and lib/application-catalogue.ts
(the 17 application spreads and their SPECIFY lists), and lib/products.ts /
lib/applications.ts are written from it.

BEFORE changing product, application or page copy, read docs/SANITY-COPY-SYNC.md.
Sanity OVERRIDES the code for: product and application name, shortDesc,
description and SEO title/description, plus product eyebrow, specs and homepage
blurb (on the product pages, the application pages, /applications and the
homepage), and the hero and About text on /, /about and /contact. On /lunch-learn
only the questions and their heading come from Sanity (since 2 Oct 2026); the
rest of the page is code (see below). Since 7 Oct 2026 also the homepage
section copy and Site Settings (offices, social accounts, footer line), and
for those two Studio is the source: the sync only fills blanks
(docs/SANITY-COPY-SYNC.md).
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
folder, 2.84 GB of Product Book rasters included, into that page's function
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

## Forms and spam (6 Oct 2026)
Every form (contact, Lunch & Learn, printed Product Book) posts to /api/contact
through lib/post-form.ts. Doug was getting SEO pitches and phishing through
it. The rule since: a real visitor's message is never refused or dropped;
anything doubtful goes to FORM_SCREENED_EMAIL instead of info@hubss.com,
marked "[Screened]" with a banner saying why, and the visitor sees "sent".
- Vercel BotID: instrumentation-client.ts adds proof to the forms' requests;
  the route asks BotID about it (2.5 s limit). Only a request with no proof
  and no Origin from this site gets a 403 (a script). Doubted browsers, a
  filled honeypot and spam are held, not refused.
- lib/post-form.ts: if BotID's script can't load (content blockers, strict
  office networks), the form sends again without it after an error or 15 s,
  and the route screens it ("unchecked").
- lib/form-screen.ts: Claude Haiku reads the submission (phone numbers and
  email addresses redacted, never the mailing address) and calls it genuine
  or spam. If it can't answer, narrow rules decide (an outside link that
  isn't .ca/.gov/.edu or the sender's own site, a pitch phrase) and log an
  error. `npm run test:forms` tests them, including the wordings a review
  caught; the prompt (SCREEN_SYSTEM) scored 25 of 25 on 6 Oct 2026. Keep its
  last line: when unsure, genuine.
- One log line per request, `[contact] {"form","outcome","gate","by","reason"}`,
  no personal details.
/api/ai-chat answers 404: it was an open Claude Opus endpoint on HUB's key
that nothing on the site used.

## Social: three streams into Buffer (9 and 14 Oct 2026)
Vern, 14 Oct: "automate as much as the social media as possible ... I don't
want to write the blogs and do the social media". The daily cron
(app/api/cron/social-drafts, 14:00 UTC) drafts posts into Buffer from three
streams; a person approves every one in Buffer (docs/buffer-setup.md):
- Articles: each newly published Insights post (lib/social-pipeline.ts).
- From the field: a published Studio field post (sanity/schemas/fieldPost.ts,
  Studio → Job photos for social): job photos, place, system, one line of facts.
  Linked to the system's page. One a day.
- From the library: once a week (Mondays), a documented map job (TOUR_IDS
  first, in lib/map-projects.ts) or a Product Book system or application spread
  (lib/social-library.ts). Skips a job whose article already had posts. A new
  field post takes the week's turn (libraryDue).
- Cadence (14 Oct 2026, Vern: "a blog or two a week"): two articles a week
  (the drafter runs Tuesdays and Thursdays) plus one job post makes three
  posts a week on each channel; Buffer's slots are Tue, Wed, Thu 11:00 Toronto.
- The plan never runs dry: lib/insights-planner.ts adds Ideas when fewer than
  six are left: guides whose brief is neutral questions under QUESTIONS_BRIEF,
  which factsBlock (lib/field-note-facts.ts) files apart from the facts, and
  roundups of documented map jobs (each job in one roundup only) whose brief is
  their records, built in code. `npm run test:planner`.
- The writer (lib/social-drafter.ts, `SocialSource`) says only what the
  source says. Claim-first logs (`socialLog-<key>`, keys are the article slug,
  `field:<id>` or `lib:<kind>:<id>`; `idFor` makes them Sanity-safe), retries
  for 14 days from the first failure (`socialRetry-<key>`), and failure emails
  that name the right key (lib/social-outcome.ts). `npm run test:social`.
- The Buffer login (vernon@hubss.com) is HUB's and HUB-only: the API key
  reaches every channel on it and the job drafts into all of them.
- Vercel crons stay at two (the drafter, this job): the library runs inside
  the daily job rather than as a third cron, and the planner inside the
  drafter.

## Articles that earn attention, on time (15 Oct 2026)
Vern: "writing smart blog posts that will capture real attention ... pair
with an automated blog plan. we need to keep the blogs and social media
pipeline full." Two research passes (B2B buyers, LinkedIn, local news,
headline tests, AI search) became three things in code:
- The writer's ATTENTION rules (lib/field-note-drafter.ts, VOICE): a plain,
  concrete headline (no question, no praise); a first sentence that puts the
  reader somewhere real; proof before explanation; something to keep (a
  checklist, a table); partners named only as the facts name them; contested
  topics told plainly.
- Outside evidence (lib/insights-evidence.ts): five published studies, each
  read against its source, with who did it, its limits and a link (FHWA
  high-visibility crosswalks, SFMTA red lanes, the Bloomberg asphalt art
  study (weak), Phoenix and Pacoima cool pavement). factsBlock adds the ones
  that share a system or application; they are the ONLY figures not about HUB
  an article may use, always with their limits in the same paragraph (the
  fact check lists any without). Add a study only after reading the source.
- The calendar (lib/insights-calendar.ts): the clocks going back, Remembrance
  Day, plow season, budget and tender season, June community crosswalks,
  Earth Day, back to school, and the two days for First Nations partners.
  From 14 to 70 days ahead the planner proposes one article per moment, even
  when the plan isn't low, at priority 1 with "Timely: for <moment>, <date>"
  in its brief (that line is how a moment counts as planned). In the week
  before a moment with a `libraryJob`, that job takes the weekly library post
  (libraryPick in lib/social-library.ts: Kitchener's veterans crosswalk before
  Remembrance Day). `npm run test:planner`, `npm run test:social`.
- Not done, by choice: Semrush (Search Console and Bing are enough at this
  traffic; a one-month subscription only for a competitor audit), and more
  llms.txt or schema work aimed at AI answers (no evidence it helps).

## Edit on the page, and what Doug owns in Studio (7 Oct 2026)
Vern, 7 Oct: "making sure that the CMS is premium, so clients can make
changes on the fly to core text and images".
- Studio has two tools: Content (the lists) and **Edit on the page**
  (Sanity's Presentation tool, sanity.config.ts): the site in a frame, every
  Studio-fed text and hero photo outlined; click to open the field, the page
  updates as you type, Publish puts it live (the webhook, about 5 s). Each
  document also lists where it's used ("locations").
- How: /api/draft-mode/enable checks Studio's one-time secret and turns on
  Next's draft mode for that browser. lib/sanity.queries.ts `sanityFetch`
  then reads drafts through lib/sanity.preview.ts, with stega markers on the
  text fields in STEGA_FIELDS (never slugs, links, phones, emails, alt text:
  the markers would break them). unstable_cache neither reads nor writes in
  draft mode, so drafts can't reach visitors. app/layout.tsx renders
  components/PreviewTools.tsx (outlines, live refresh, an "Exit preview" pill
  outside Studio's frame) only in draft mode, and drops chat and analytics
  there. Photos are clickable through `editAttr` (data-sanity) on the hero
  banners and galleries. Compare Studio strings with code strings through
  `stegaClean` (app/about/page.tsx's seed checks do).
- The preview reads with SANITY_API_READ_TOKEN if set, else
  SANITY_API_WRITE_TOKEN (server-side only).
- next-sanity is no longer in serverExternalPackages: externalised, its
  draft-mode and visual-editing entries can't import next/headers and
  next/dynamic. Studio's page renders in the browser only (next/dynamic,
  ssr: false); it always failed on the server first (React #419).
- Homepage section copy: lib/homepage-copy.ts (page-homepage.homepageSections).
  A heading is `heading` + `headingAccent` and they travel together.
- `npm run sync:pages` is fill-only for everything it writes now (page text,
  sections, Site Settings): Studio's text is Doug's. `--overwrite` pushes the
  code's page text over Studio's on purpose. `npm run photos:sync` needs
  `--only=<slug>` (or `--all`) to write. Products and applications are still
  code-first: the Product Book is their source and `sync:products` /
  `sync:applications` overwrite as before.
- Site Settings: lib/site-settings.ts, `getSiteSettings()` on the server,
  `useSiteSettings()` in client components (components/SiteSettingsProvider.tsx,
  fed by app/layout.tsx). Never type an office phone, email or town again:
  read it from there. Footer is an async server component now, so a client
  component that shows the footer takes it as a prop (`footer={<Footer />}`:
  app/contact, app/gallery).
- Heroes follow Studio: `heroObjectPosition` (lib/hero-framing.ts) puts a
  Studio hotspot ahead of HERO_POSITION; the homepage makes its wide and
  phone cuts from the Studio photo with Sanity's CDN (sanityCrop) whenever the
  photo isn't the default master (DEFAULT_HERO_ORIGIN in app/page.tsx).
- Insights: the first Publish of an article dates it that moment
  (sanity.config.ts, datedPublish).

## Lunch & Learn page (30 Sep and 2 Oct 2026)
- /lunch-learn is app/lunch-learn/page.tsx: the boardroom card (LunchLearn ->
  LunchLearnV2, whose title is the page's h1; #book is the card), then
  LunchLearnFunnel.tsx: the session topic tiles and the common questions, then
  the footer (Vern, 30 Sep: "clean up the lunch and learn page too. it's a
  bit messy"). Two sessions rebuilt the page in parallel on 30 Sep; at the
  2 Oct merge session A's page was kept and one thing was ported from session
  B's: the topic tiles.
- The tiles (components/sections/LunchLearnTopics.tsx) are six kinds of work
  with the applications' hero photos; "Book this topic" puts the topic into the
  form's chip (setLunchLearnTopic in LunchLearnV2.tsx, the same strings the
  application pages send) and scrolls to the form.
- The questions, the FAQPage schema and `npm run sync:pages` share one source,
  lib/lunch-learn-content.ts, so they can't drift. The sync writes only what
  the page reads (lunchLearnFaqs, the FAQ heading); the other Lunch & Learn
  fields in sanity/schemas/page.ts are hidden and read by nothing. No CE
  credit claims, ever. No stat chips or counts on the page.
- The booking form (useLunchLearnForm in LunchLearnV2.tsx, shared with the
  homepage card) sends generate_lead to GA and lunch_learn_submit to Vercel
  Analytics on success, as the contact form does. From 22 Sep to 2 Oct 2026
  nothing did: the page had moved to a form without them.

## Menus and Insights, editorial (30 Sep 2026)
- The Products and Applications panels keep their photographs: at the 2 Oct
  merge session A's Nav.tsx (photo menus, active state, prefetch, ARIA) was
  kept whole and session B's typographic panels were not taken.
  components/blog/RuleLabel.tsx is the rule-with-a-brand-accent label the
  Insights pages use.
- Every listed post is components/blog/BlogCard.tsx: a photograph, one kicker
  (section and date) and the headline; a row on a phone. StoryLead is the lead
  story (photo beside headline and deck) and pickLead chooses it (newest post
  with a photo at least 1600 x 1000). /blog is a masthead, a server-rendered
  front page (lead plus the next four), then BlogFilter's library: section
  tabs, search, system, sort, twelve at a time with Show more; unfiltered it
  starts after the front page. The section pages (TypeHub) use the same parts.
  No excerpts except the lead's deck, no "Read post", no read times on cards.
- A post has one Lunch & Learn card beside the article and the band before the
  footer. PostConversion's block is not rendered any more (postFocus and
  PRODUCT_SLUGS still live in that file). The standfirst is the excerpt, set
  upright and larger than the body.
- Headings: app/globals.css gives every h1-h6 its family, weight (800),
  tracking (-0.025em) and leading (1.15) as unlayered CSS, which beats
  Tailwind's utilities. Set those inline on a heading, or use a span.
- The map's headings carry no count (docs/STYLE.md). "3 of 78" in the project
  panel is a count inside a control, which the guide allows.

## Round 3 (28 Sep 2026): what later work must keep
- Light reading under dark heroes: product, application and Insights pages keep
  the dark photo hero, and everything under it sits on `data-surface="paper"`
  (tokens in app/globals.css). The Lunch & Learn band and the footer close each
  page in the dark.
- html and body use `overflow-x: clip`, not hidden: hidden made body a scroll
  container and nothing could stick (nav, spec card, post sidebar).
- Lunch & Learn links carry their topic: lunchLearnHref(topic, from) in
  lib/lunch-learn.ts, e.g. /lunch-learn?topic=StreetPrint&from=product#book.
  The form shows the topic as a chip and the request email prints both.
  components/sections/LunchLearnCard.tsx is the in-page card.
- Hero photos: products from productImages, applications from applicationImages
  (lib/featured-images.ts; imageUrl is only the last fallback), framed by
  HERO_POSITION in lib/hero-framing.ts, keyed by the photo's /public path.
- Insights has three sections: Projects (/blog/projects), Guides (/blog/guides),
  Articles (/blog/articles). Stored Sanity types are unchanged; the old hub
  URLs and /projects/<slug> redirect (lib/field-notes-taxonomy.ts).
- The Insights mega menu reads lib/nav-insights.json, written at build from
  Sanity by scripts/gen-nav-insights.ts. Since 2 Oct 2026 (Vern: "insights
  mega menu dropdown still feels busy, too much text maybe") the panel is
  pictures first: the cover story (photo, section label, title), three section
  tiles (Projects, Guides, Articles, each wearing the photo of its newest tall
  enough post, `sections[].photo` in the JSON), "All Insights" and the foot row
  (Product Book, Lunch & Learn). No excerpts, dates, counts or "Latest" list. The
  file still carries `latest` and the excerpts for other readers.

## 2 Oct 2026 release: where the new things live
- /llms.txt and /llms-full.txt are routes (app/llms.txt/route.ts,
  app/llms-full.txt/route.ts, content in app/llms.txt/llms-content.ts), built
  from the same merged products, applications and posts the pages use, so they
  cannot go stale. public/llms.txt is gone. app/robots.ts names the AI crawlers
  (all allowed) so intent is documented.
- IndexNow: .github/workflows/indexnow.yml runs `npm run indexnow`
  (scripts/indexnow-submit.mjs) six minutes after every push to main and tells
  Bing which URLs changed; the key file is public/<key>.txt. Bing Webmaster
  Tools verification is a one-time step in Vern's browser. Perplexity and
  ChatGPT search lean on Bing's index, so this is what keeps them current.
- Site search (components/sections/SearchOverlay.tsx): every row has a
  thumbnail from public/images/search/thumbs (128 and 256 px WebPs baked by
  scripts/gen-search-images.ts, hash-skipped; posts and map pins fetch from
  Sanity at build only); under two characters the palette shows the 14 systems
  as a photo grid. The matched-keyword chip is gone.
- The print catalogue's photos (the Product Book's print set, 34 PNGs, kept on
  Vern's PC under _archive/design-assets/catalog-print-build/assets/booklet)
  now feed the Products and Applications menu panels and two product cards;
  the web copies are in public/images/catalogue-assets with their source and
  caption confidence in _manifest.json (`_photos`). The hero photos on the
  product and application pages come from Studio, so the catalogue photos for
  those are a Studio job (list in the 2 Oct release record in the Claude
  project).
- Homepage hero: the three cuts in public/images/hero are re-cut from a
  2540 px master (the UBC original with the approved HUB sign composite) by
  scripts/hero-cuts.mjs; on windows 16:9 and wider HeroSlideshow shows the
  whole photo against the right edge with the left fading to dark under the
  headline (Vern: "zoomed out a bit to show more of the crosswalk"); 16:10 and
  phones stay full-bleed. Studio's homepage hero copy is replaced with
  `npm run photos:sync -- --only=homepage` on Vern's PC.
- Copy syncs can emit a plan instead of writing:
  `npx tsx scripts/sync-products-to-sanity.ts --dry-run --emit=plan.json`
  (also sync-applications). The plan is applied on Vern's machine with
  .sanity-work/sanity_apply_v2.py (dry run, backup, ifRevisionID per document).
- The favicon (app/icon.png, app/favicon.ico) is the wheel exactly as the
  header logo draws it: orange disc, white H's, nothing outside the disc.
  Vern, 30 Sep: "there's still a weird white line around the icon", so the
  white ring added on 28 Sep is gone. The H's stay white: knock them out and
  the mark reads as orange blobs on a dark tab (Vern, 28 Sep). Made from
  public/images/assets/logos/hubss-logos/HUB-wheel_official-orange-transparent.png
  with the H's filled white inside the fitted circle and the disc edge drawn
  once, so no white can show round the rim. app/apple-icon.png is still the
  wheel on a white tile (iOS turns transparency black).
- The header logo (public/images/hub-official-logo.svg) wraps
  hubss-logo-white-large.png, whose H's are already white. Never put a white
  circle behind the wheel to fill the H's: the old file did, and the two edges
  together left a hairline of white round the wheel.
- Homepage hero: the room under the buttons is `.hero-copy` in app/globals.css
  (about 11% of the screen's height; smaller under 820 px tall, where the lift
  would put the headline into the HUB sign).
- Studio shows yellow style warnings (lib/style-lint.ts): em dashes, "--",
  the "not X, it's Y" reversal, Title Case headings. `npm run verify` fails on
  an em dash in any built page.
