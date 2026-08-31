# HUBSS.com — Project Intelligence File

## Client
HUB Surface Systems — Canadian leader in decorative and functional pavement
solutions. 30+ years experience. Two regional offices:
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
- Key proof points: Vision Zero, Complete Streets, AODA compliance, 20-year
  durability, used by York Region, City of Toronto, Vancouver, UBC

## Tech Stack
- Next.js 16.1.6 (App Router, Turbopack)
- Tailwind CSS 4
- TypeScript (strict)
- MDX for blog posts (markdown with components)
- Framer Motion for animations
- Resend for transactional email (contact + lunch & learn forms)
- Images: /public/images/ — swap by replacing files, no code change needed
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
│   └── blog/ (*.mdx files — add posts here)
├── public/
│   ├── images/
│   └── docs/
└── CLAUDE.md

## Pages to Build (in order)
1. Landing page — hero, products grid, applications, recent projects,
   lunch & learn CTA, footer
2. Projects page — filterable grid by product/application
3. Products page — each product with specs
4. Blog — MDX-powered, easy to add posts
5. Contact — form + both office locations

## Adding Content (no developer needed)
- New blog post: create /content/blog/post-name.mdx
- Swap hero image: replace /public/images/hero.jpg
- Add PDF spec sheet: drop in /public/docs/, update link in products page
- New project: add entry to /content/projects/project-name.mdx

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


## Bundle import protocol (Claude Cowork -> this repo)

Bundles exist because pushes from the Cowork sandbox are blocked by a proxy
403 ("not in this session's authorized repository set"), and the API fallback
used for text files cannot carry binaries — it stores base64 as literal text,
which was measured, not assumed: a 2,704-byte WebP came back as 3,429 bytes of
garbage. Anything binary therefore travels as a git bundle.

To end this entirely: github.com/settings/installations -> Claude -> grant
access to apu21e800/hubss-website. Then ordinary pushes work and bundles stop
being necessary.

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

SHELL TRAP, learned the hard way: `pkill -f "next"` (or "next start") matches
the invoking shell's OWN command line and kills it mid-command — everything
after the pkill silently never runs, and the exit code is 144. Hours were
lost to stale .next builds this caused. Always write it as
`pkill -f "[n]ext start"` — the character class cannot match itself.

Never `git reset --hard` in this repo. Banner-dash drift in comment blocks is
known-benign — prove it with `tr -d '─═━'` + `cmp`, then recover a single file
with `git checkout origin/main -- <path>`.
