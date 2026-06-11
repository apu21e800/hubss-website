# HUBSS.com — Project Intelligence File

## Client
HUB Surface Systems — Canadian leader in decorative and functional pavement solutions. 30+ years experience.

**Offices:**
- East: Milton, Ontario — doug.bain@hubss.com / 416-540-9287
- West: Ladysmith, BC — cleve.stordy@hubss.com / 604-309-8212

## What They Do
Stamped asphalt, preformed thermoplastics, and specialty coatings for municipalities, developers, and contractors across Canada.

**Products:** TrafficPatterns, TrafficPatternsXD, StreetPrint, StreetBond, MMAX, DecoMark, DuraShield, DuraTherm, PreMark, AirMark

**Applications:** Crosswalks, Bus & Bike Lanes, Driveways, Public Art, Regulatory Markings, Parks & Paths, Community Branding, Town Homes, Parking Lots, Airports

## Brand
- **Colors:** Black background, orange accent (#F97316), white text
- **Tone:** Municipal authority meets civic pride — technical credibility + visual impact
- **Positioning:** "Redefining hardscapes" — surfaces as community identity, not just infrastructure
- **Key proof points:** Vision Zero, Complete Streets, AODA compliance, 20-year durability, York Region, City of Toronto, Vancouver, UBC

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router, Turbopack) |
| Styling | Tailwind CSS 4 |
| Language | TypeScript (strict) |
| CMS | Sanity v5 (content stored in Sanity Cloud, edited at /studio) |
| Blog | MDX (legacy) + Sanity (current) |
| Animations | Framer Motion |
| Forms | react-hook-form + zod validation |
| Email | Resend (contact form + Lunch & Learn) |
| AI | Anthropic SDK (AI blog generation at /admin/blog) |
| Maps | MapLibre GL / react-map-gl |
| Analytics | Vercel Analytics + Speed Insights |
| Chat | Crisp (optional widget) |
| Deploy | Vercel — auto-deploys from GitHub main |

## Environment Variables
Copy `.env.local.example` → `.env.local`. Required variables:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Contact + Lunch & Learn form emails |
| `ANTHROPIC_API_KEY` | AI blog generation at /admin/blog |
| `ADMIN_PASSWORD` | Gate for /admin/* routes |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, OG tags |
| `CONTACT_EMAIL` | Where form submissions go (default: info@hubss.com) |

Optional (social publishing): `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_ORG_ID`, `FACEBOOK_PAGE_TOKEN`, `FACEBOOK_PAGE_ID`, `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, `X_BEARER_TOKEN`, `NEXT_PUBLIC_CRISP_WEBSITE_ID`

## Project Structure
```
hubss-website/
├── app/                         # Next.js App Router pages
│   ├── page.tsx                 # Homepage (hero, products, applications, projects, CTA)
│   ├── about/
│   ├── admin/
│   │   ├── blog/                # AI blog generation (protected, ADMIN_PASSWORD)
│   │   └── social/              # Social media post scheduler (protected)
│   ├── applications/
│   │   ├── page.tsx
│   │   ├── [slug]/
│   │   └── public-art/
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/
│   ├── contact/
│   ├── gallery/
│   ├── lunch-learn/
│   ├── privacy/
│   ├── products/
│   │   ├── page.tsx
│   │   └── [slug]/
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [slug]/
│   ├── resources/
│   ├── studio/[[...tool]]/      # Sanity Studio embedded in Next.js
│   └── terms/
├── components/
│   ├── ai/                      # AI-related UI components
│   ├── blog/                    # Post layout, card
│   ├── resources/               # Resource/docs components
│   ├── sections/                # Hero, projects, lunch-learn, footer
│   ├── ui/                      # Buttons, cards, nav, shared UI
│   ├── CrispChat.tsx
│   └── StickyBar.tsx
├── content/
│   ├── blog/                    # Legacy MDX blog posts
│   ├── social-drafts/
│   └── social-queue/
├── lib/                         # Data fetching + utilities
│   ├── sanity.client.ts         # Sanity client config
│   ├── sanity.queries.ts        # All GROQ queries
│   ├── products.ts / products.server.ts
│   ├── projects.ts
│   ├── applications.ts / applications.server.ts
│   ├── seo.ts                   # Metadata helpers
│   └── site-flags.ts            # Feature flags
├── sanity/
│   └── schemas/                 # Content types: blogPost, project, product,
│                                #   application, page, siteSettings
├── scripts/
│   └── migrate-to-sanity.ts    # MDX → Sanity migration tool
├── types/                       # Shared TypeScript types
├── public/
│   ├── images/                  # Static images (swap files, no code change)
│   └── docs/                    # PDF spec sheets (drop new PDFs here)
├── _archive/                    # Non-website files (screenshots, planning docs, assets)
└── CLAUDE.md
```

## Sanity CMS
Content is managed via Sanity. The Studio is embedded at `/studio` (deployed at hubss.com/studio).

**Content types:** `blogPost`, `project`, `product`, `application`, `page`, `siteSettings`

**Adding content the easy way (no code):**
- New blog post → Sanity Studio → Blog Posts → New
- New project → Sanity Studio → Projects → New
- New product → Sanity Studio → Products → New
- New PDF spec sheet → drop in `/public/docs/`, update product in Studio

**Code-only tasks:**
- New page route → add to `app/`
- Schema change → edit `sanity/schemas/`, run `npx sanity schema deploy`

## Adding Content Without a Developer
| Task | How |
|---|---|
| New blog post | Sanity Studio at /studio, or create `/content/blog/post-name.mdx` (legacy) |
| Swap hero image | Replace `/public/images/hero.jpg` |
| Add spec sheet PDF | Drop file in `/public/docs/`, link it in the relevant product in Studio |
| New project | Add via Sanity Studio |

## Conversion Goals
- **Primary CTA:** "Request Spec Sheet" + "Book Lunch & Learn"
- **Secondary:** Project gallery → contact form
- **Lead capture:** Name + Email + Phone

## Commands
```bash
npm run dev              # Local dev (Turbopack)
npm run build            # Production build
npm run start            # Run production locally
npm run migrate:sanity   # Migrate MDX → Sanity
npm run migrate:sanity:dry  # Dry run (no writes)
npm run migrate:sanity:purge  # Purge Sanity content
```

## Behaviour Guidelines for Claude
- **Never break the live site.** hubss.com is live and in production. Verify before suggesting structural changes.
- **Sanity is the source of truth** for blog, projects, products, and applications — not MDX files (those are legacy).
- **Tailwind 4 syntax** — utility classes only, no config-based custom classes unless already in the project.
- **TypeScript strict** — never use `any`. Check `types/` for shared types before defining new ones.
- **Images go in `/public/images/`** — use Next.js `<Image>` component everywhere, not `<img>`.
- **GROQ queries live in `lib/sanity.queries.ts`** — add new queries there, not inline in page files.
- **`_archive/`** is non-website storage — do not import from it or reference it in code.
