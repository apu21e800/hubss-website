# HUBSS UX/UI Polish Pass — Design Spec

**Date:** 2026-03-26
**Branch:** claude/bold-wilson
**Scope:** 9 specific issues across all pages

---

## 1. "Trusted By" Section (PersonaEntryPoints.tsx)

**Current state:** Flat text grid on `bg-zinc-900`. No icons, no visual hierarchy, no proof stats.

**Design:** Three dark cards (`#1C1F23` bg) each with:
- Orange top border (`border-t-2 border-orange-500`)
- Inline SVG icon (city hall / compass / hard hat)
- Category heading (white, lg bold)
- Proof stat line (zinc-300)
- Client names (zinc-400, sm)
- Subtle orange glow on hover (`hover:shadow-[0_4px_24px_rgba(249,115,22,0.12)]`)
- `transition-all duration-300`

Stats per card:
- Municipalities: "York Region · City of Toronto · City of Vancouver · UBC"
- Landscape Architects: "Specifying since 1994 · 30+ year track record"
- Contractors: "Training + tech support included"

---

## 2. Blue Background Replacement

**Current state:** `WhyHubss.tsx` uses `var(--bg-slate)` = `#111C2D` (dark navy blue).

**Design:** Replace with `#1C1F23` charcoal. Add subtle orange accent: thin `border-t border-orange-500/20` + `background: linear-gradient(180deg, rgba(249,115,22,0.04) 0%, transparent 60%)` overlay at top of section.

Audit all other components for `#1a2332`, `bg-slate`, `#111c2d` and replace with `#1C1F23`.

---

## 3 & 4. Pug/Moose Mascot

**L&L Homepage Section (LunchLearn.tsx):**
- Add `pug-peeker.png` absolutely positioned, bottom-right of section
- Size: `w-48 h-48` (192px), `bottom-0 right-8`
- Behind form card on desktop, hidden on mobile (overflow hidden)
- Warm orange/amber glow radiating behind it: `radial-gradient(ellipse at bottom right, rgba(249,115,22,0.15), transparent 60%)`

**L&L Dedicated Page (lunch-learn/page.tsx):**
- Keep moose, increase to `w-64 h-64` (256px)
- Reposition: right side of hero, not centered bottom
- `absolute bottom-0 right-0 md:right-24`

---

## 5. Contrast Audit

Rules enforced across all files:
- Dark bg → text must be `#F9FAFB`, `#E5E7EB`, or `#D1D5DB` minimum
- Section headings on dark bg → `var(--text-primary)` (#F5F0EB)
- Body copy on dark bg → `#CBD5E1` or lighter (no `#9CA3AF` on very dark)
- Orange buttons → `color: #fff` only

Files audited: all `components/sections/*.tsx`, `app/blog/page.tsx`, `app/projects/page.tsx`, `app/lunch-learn/page.tsx`

---

## 6. Resources — Remove "All" Tab

**Current:** `TABS = ["All", "By Product", "By Document Type"]`, default `"All"`

**Fix:**
- `TABS = ["By Product", "By Document Type"]`
- Default `activeTab` state → `"By Product"`
- When "By Product" tab active with no product selected, show all docs grouped by product (same as current "All" grouped view)

---

## 7. Field Notes Filter Cleanup + Card Redesign

**BlogFilter.tsx:**
- Remove `Type:` pill row (Blog / Case Study / Project Profile / White Paper)
- Remove `category` state, `CATEGORIES` array, and related URL param logic
- Keep: Product filter pills + search + sort dropdown

**BlogCard.tsx redesign:**
- Background: `#1C1F23`
- Border: `border border-zinc-800`, hover: `hover:border-orange-500/50`
- Headline: `text-white font-bold`, hover: `group-hover:text-orange-400`
- Product badge: orange pill (existing)
- Date meta: `text-zinc-500 text-xs`
- Lift shadow on hover: `hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]`
- Image overlay gradient: `from-black/60 to-transparent`

**projects/page.tsx:**
- Remove Province filter row
- Keep Product + Application

---

## 8. New Blog Post

**File:** `content/blog/commercial-parking-reit-specification.mdx`

Long-form editorial post targeting REIT/commercial property managers. Five sections:
1. The Cost of Looking Cheap (first impressions, paint failure stats)
2. Four Products. Every Parking Surface Scenario. (TP, TPXD, StreetPrint, StreetBond)
3. Field-Proven Across Canada (3 case studies with Leo Guddemi quote)
4. Built for Canadian Winters (comparison table)
5. The Smart Budget Decision (lifecycle cost argument)

Closing CTA: Book L&L / download spec sheet / contact.

---

## 9. Global Sweep

After all above:
- Section backgrounds: `#1a1a1a`, `#1C1F23`, `#0a0a0a`, or white — no other dark colors
- Consistent `py-24` to `py-32` between major sections
- Orange accents purposeful, not random
- All cards on dark bg: consistent dark card pattern from item #7

---

## Implementation Files

| # | File | Change |
|---|------|--------|
| 1 | `components/sections/PersonaEntryPoints.tsx` | Full rewrite |
| 2 | `components/sections/WhyHubss.tsx` | bg + accent |
| 3/4 | `components/sections/LunchLearn.tsx` | Add pug mascot |
| 3/4 | `app/lunch-learn/page.tsx` | Resize/reposition moose |
| 6 | `components/resources/ResourcesClient.tsx` | Remove All tab |
| 7a | `components/blog/BlogFilter.tsx` | Remove type filter |
| 7b | `components/blog/BlogCard.tsx` | Dark card redesign |
| 7c | `app/projects/page.tsx` | Remove province filter |
| 8 | `content/blog/commercial-parking-reit-specification.mdx` | New file |
| 5/9 | Various | Contrast + spacing sweep |

**Commit:** `feat: UX polish — trusted by, L&L pug, contrast fix, resources filter, field notes cards, REIT blog post`
**Push:** `origin main` (worktree branch `claude/bold-wilson` → merge/push)
