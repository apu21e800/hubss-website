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
- FORM_SCREENED_EMAIL — where the forms' spam screen sends what it holds
  back (defaults to cleve.stordy@hubss.com; `none` drops it, log line only)
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
- New article: Studio → Insights → create, then Publish. It is live
  about five minutes later (the site rebuilds to add the page); edits to live
  posts show within seconds. docs/BLOG-IN-SANITY.md
- Article ideas: Studio → Insights plan. Mark one Ready and the Tuesday AI
  drafter writes it up as an unpublished draft for review (never publishes).
- Swap hero image: replace /public/images/hero.jpg
- Add PDF spec sheet: drop in /public/docs/, update link in products page
- New project: add entry to /content/projects/project-name.mdx

### Putting a project on the homepage map
Since 28 Sep 2026 the map shows only real, documented jobs (Vern: "no fake
locations"); since 30 Sep 2026 it shows as many of them as can be placed
(Vern: "more locations on the map the better"). A pin needs a real job at a
real place, documented by a published Insights post OR by the Idea Book
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
(lib/map-photo.ts). The Idea Book photos, resized, are in
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
homepage), and the hero and About text on /, /about and /contact. On /lunch-learn
only the questions and their heading come from Sanity (since 2 Oct 2026); the
rest of the page is code (see below).
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

## Forms and spam (6 Oct 2026)
Every form (contact, Lunch & Learn, printed Idea Book) posts to /api/contact.
Doug was getting SEO pitches and phishing through it, so the route now runs,
in order: Vercel BotID (instrumentation-client.ts protects POST /api/contact;
checkBotId() refuses a script with a 403 and a "please email us" message),
field checks (strings only, real lengths), the honeypot, then the spam screen
in lib/form-screen.ts: Claude Haiku reads the submission (never the phone,
full email or mailing address) and calls it genuine or spam. Genuine goes to
info@hubss.com as before. Spam goes to FORM_SCREENED_EMAIL with "[Screened]"
in the subject and a banner saying why; the visitor sees "sent" either way.
If the model can't answer, two rules decide (an outside link, a pitch phrase)
and everything else is delivered. Every submission logs one line,
`[contact] {"form","outcome","by","reason"}`, with no personal details.
`npm run test:forms` tests the rules; the prompt (SCREEN_SYSTEM) scored 25 of
25 on real and typical submissions on 6 Oct 2026. Keep the prompt's last
line: when unsure, genuine. /api/ai-chat answers 404: it was an open Claude
Opus endpoint on HUB's key that nothing on the site used.

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
  (Idea Book, Lunch & Learn). No excerpts, dates, counts or "Latest" list. The
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
- The print catalogue's photos (the Idea Book's print set, 34 PNGs, kept on
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
