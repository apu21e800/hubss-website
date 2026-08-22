# Hermes / Agent guardrails for hubss-website

You are an agent operating on this codebase. Read this file BEFORE making any changes.

## Project
- **What it is:** hubss.com — HUB Surface Systems, Canadian decorative pavement company. Marketing/lead-gen site, LIVE in production.
- **Repo:** github.com/apu21e800/hubss-website
- **Production:** hubss.com (Vercel, auto-deploys from `main`)
- **Staging:** hubss-website-git-staging-based-agency.vercel.app (from `staging` branch)
- **Active feature branch:** feat/client-edits (for Doug's current review feedback)

## Tech Stack
Next.js 16 App Router + Turbopack · React 19 · TypeScript strict · Tailwind CSS v4 · Framer Motion · Geist + Inter fonts · Vercel · Resend email · MapLibre GL · GA4 (G-7YSFCGRL5E) · Instagram Graph API

## Key files
- `lib/products.ts` — 14 products (single source of truth for nav, pages, sitemap, footer)
- `lib/applications.ts` — 20+ applications
- `lib/map-projects.ts` — 59 map pins (see `PROJECT-IMAGE-AUDIT.md` before editing)
- `lib/site-flags.ts` — feature toggles
- `lib/social-links.ts` — all social URLs
- `next.config.ts` — 60+ 301 redirects, security headers
- `components/StickyBar.tsx` — bottom CTA bar
- `components/sections/InstagramStrip.tsx` — live Instagram feed

## Workflow — ALWAYS
1. Create a feature branch off `main` (or `staging` for client-review work)
2. Make changes
3. Open a PR via GitHub API
4. **STOP.** A human merges. Never merge yourself.

## DO NOT
- Push directly to `main` — ever
- Push to `staging` while Doug is mid-review
- Commit API keys, tokens, secrets, or environment variables
- Remove or restructure `lib/products.ts` — it's load-bearing for nav, pages, sitemap, footer
- Change `SITE_FLAGS.showLeoQuote` to `true` — pending Vernon approval
- Touch `lib/map-projects.ts` without first reading `PROJECT-IMAGE-AUDIT.md`
- Make claims involving AODA, warranty, or compliance language — these are forbidden sitewide
- Reference PPG or GAF outside the About page
- Use bash `git push` for this repo — use the GitHub API (push_files tool) instead; Vernon's on Windows and bash push times out

## Brand rules
- Bg: #070b12 or #0f1620 · Accent: #F97316 → #EAB308 gradient · Text: #F5F0EB primary
- Tone: municipal authority meets civic pride. Never corporate-generic.
- Logo always `hubss-logo-white.png` for dark backgrounds. NEVER use `.svg` files from `/public/images/assets/logos/hubss-logos/` — they're PNG binaries mislabeled.
- No font-size rules on h1–h6 in `globals.css` — Tailwind v4 cascade. Per-component utilities only.

## Roadmap blocks (current sequence)
- Block A: QA bug bash ✅ (in flight / done)
- Block B: Backend cleanup + image organization
- Block C: Sanity CMS scaffold
- Block D: Blog automation enhancement
- Block E: Social media automation (Instagram Graph API token expires every 60 days — needs auto-refresh)
- Block F: GA4 conversion event tracking

## Core business goal
Site exists to drive **leads, calls, sales**. Evaluate all proposed work through that lens. Broken CTAs/forms = P0. Backend refactors that don't change UX = lower priority.
