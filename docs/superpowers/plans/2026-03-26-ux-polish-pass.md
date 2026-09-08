# HUBSS UX Polish Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish every page of the HUBSS website to premium agency quality — elevated "Trusted By" cards, restored moose mascot on all L&L sections, removed flat-blue backgrounds, filter cleanup, dark card redesign, and a new REIT blog post.

**Architecture:** Targeted edits to existing React/Next.js components. No new routes or shared state introduced. Each task is self-contained. Verification is `npm run build` (TypeScript + build check) after each task group, plus visual spot-check in browser.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Framer Motion, MDX for blog posts.

---

## File Map

| File | Action | Task |
|------|--------|------|
| `components/sections/PersonaEntryPoints.tsx` | Rewrite | 1 |
| `components/sections/WhyHubss.tsx` | Edit bg + accent | 2 |
| `components/sections/LunchLearn.tsx` | Add moose + gradient | 3 |
| `app/lunch-learn/page.tsx` | Resize + reposition moose | 4 |
| `components/resources/ResourcesClient.tsx` | Remove "All" tab | 5 |
| `components/blog/BlogFilter.tsx` | Remove type filter | 6 |
| `components/blog/BlogCard.tsx` | Dark card redesign | 7 |
| `app/projects/page.tsx` | Remove province filter | 8 |
| `content/blog/commercial-parking-reit-specification.mdx` | Create | 9 |
| Contrast sweep (various) | Edit | 10 |

---

### Task 1: Elevated "Trusted By" Cards (PersonaEntryPoints.tsx)

**Files:**
- Modify: `components/sections/PersonaEntryPoints.tsx`

- [ ] **Step 1: Replace the entire file with elevated card design**

```tsx
export default function PersonaEntryPoints() {
  const categories = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3.75h.75m-.75 3.75h.75m3-7.5h.75m-.75 3.75h.75m-.75 3.75h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
        </svg>
      ),
      title: "Municipalities",
      stat: "30+ years specifying Canadian public infrastructure",
      clients: "York Region · City of Toronto · City of Vancouver · UBC",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
      ),
      title: "Landscape Architects",
      stat: "Specified on award-winning Complete Streets projects coast to coast",
      clients: "Decorative + functional pavement since 1994",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
        </svg>
      ),
      title: "Contractors",
      stat: "Full installation support, training, and technical specs included",
      clients: "Coast-to-coast applicator network across Canada",
    },
  ];

  return (
    <section className="py-16 border-t" style={{ background: "#0f1117", borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-10" style={{ color: "#f97316" }}>
          Trusted By
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-[0_4px_32px_rgba(249,115,22,0.12)] hover:-translate-y-0.5"
              style={{
                background: "#1C1F23",
                borderTop: "2px solid #f97316",
                border: "1px solid rgba(249,115,22,0.15)",
                borderTopWidth: "2px",
                borderTopColor: "#f97316",
              }}
            >
              <div style={{ color: "#f97316" }}>{cat.icon}</div>
              <div>
                <p className="text-white font-bold text-lg mb-1">{cat.title}</p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#D1D5DB" }}>{cat.stat}</p>
                <p className="text-xs" style={{ color: "#6B7280" }}>{cat.clients}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website\.claude\worktrees\bold-wilson && npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors on PersonaEntryPoints

- [ ] **Step 3: Commit**

```bash
git add components/sections/PersonaEntryPoints.tsx
git commit -m "feat: elevate trusted-by cards with orange accent borders and icons"
```

---

### Task 2: WhyHubss — Charcoal bg + orange accent

**Files:**
- Modify: `components/sections/WhyHubss.tsx`

- [ ] **Step 1: Replace section background and add top gradient accent**

```tsx
import { motion } from "framer-motion";

export default function WhyHubss() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "#1C1F23" }}
    >
      {/* Subtle orange top-edge glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.4), transparent)" }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(249,115,22,0.04) 0%, transparent 100%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#f97316" }}>
          WHY HUB SURFACE SYSTEMS
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
          style={{
            background: "linear-gradient(90deg, #F97316, #EAB308)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Specified by Engineers. Approved by Cities. Loved by Communities.
        </h2>
        <p className="text-lg leading-relaxed max-w-3xl" style={{ color: "#E5E7EB" }}>
          For over 30 years, HUB Surface Systems has been the trusted Canadian partner for pavement
          systems that perform at the intersection of safety, durability, and design. We don&apos;t sell
          coatings — we enable the infrastructure that defines how Canadians experience their cities.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/WhyHubss.tsx
git commit -m "feat: replace dark-blue bg with charcoal + orange accent on WhyHubss"
```

---

### Task 3: LunchLearn — Moose mascot + orange gradient

**Files:**
- Modify: `components/sections/LunchLearn.tsx`

- [ ] **Step 1: Add moose import and position it in the section**

Find the section opening tag:
```tsx
<section
  id="lunch-learn"
  className="relative bg-zinc-950"
  style={{ zIndex: 0 }}
>
```

Replace with:
```tsx
<section
  id="lunch-learn"
  className="relative overflow-hidden"
  style={{ background: "#0f1420", zIndex: 0 }}
>
  {/* Orange/amber warm glow — emanates from bottom-right */}
  <div
    className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
    style={{
      background: "radial-gradient(ellipse at bottom right, rgba(249,115,22,0.12) 0%, rgba(234,179,8,0.06) 30%, transparent 70%)",
    }}
  />

  {/* Moose mascot — large, bottom-right, peeking up */}
  <div className="absolute bottom-0 right-6 xl:right-16 hidden lg:block" style={{ zIndex: 1, width: 220, height: 220 }}>
    <Image
      src="/images/lunch-learn/moose.png"
      alt="HUB Moose"
      width={220}
      height={220}
      style={{ filter: "drop-shadow(0 0 32px rgba(249,115,22,0.25))", display: "block" }}
      unoptimized
    />
  </div>
```

Make sure `Image` is already imported (it's in the existing file — if not, add: `import Image from "next/image";`).

Then update the inner grid div to have enough right padding so the moose doesn't overlap the form on large screens:

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 pt-16 relative" style={{ zIndex: 2 }}>
```

- [ ] **Step 2: Verify build**

```bash
cd C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website\.claude\worktrees\bold-wilson && npm run build 2>&1 | grep -E "error|Error|warn" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/LunchLearn.tsx
git commit -m "feat: add moose mascot + orange gradient to L&L homepage section"
```

---

### Task 4: Lunch & Learn Page — Larger moose, right-side positioned

**Files:**
- Modify: `app/lunch-learn/page.tsx`

- [ ] **Step 1: Increase moose size and reposition to bottom-right of hero**

Replace the entire moose block:
```tsx
{/* Moose — absolute bottom, overlapping the section below */}
<div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-40 h-40 z-20">
  <Image
    src="/images/lunch-learn/moose.png"
    alt="HUBSS Moose"
    width={160}
    height={160}
    style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))', display: 'block' }}
    unoptimized
  />
</div>
```

With:
```tsx
{/* Moose — large, bottom-right of hero, peeking into L&L section */}
<div
  className="absolute bottom-0 right-0 md:right-16 lg:right-24 z-20 hidden sm:block"
  style={{ width: 288, height: 288 }}
>
  <Image
    src="/images/lunch-learn/moose.png"
    alt="HUB Surface Systems Moose Mascot"
    width={288}
    height={288}
    style={{
      filter: "drop-shadow(0 0 40px rgba(249,115,22,0.3)) drop-shadow(0 16px 32px rgba(0,0,0,0.5))",
      display: "block",
    }}
    unoptimized
  />
</div>
```

Also update the hero wrapper `overflow-visible` to ensure it accommodates the larger mascot — the existing `pb-16` may need to increase:
```tsx
<div className="relative overflow-visible pb-24 sm:pb-32" style={{ zIndex: 2 }}>
```

- [ ] **Step 2: Commit**

```bash
git add app/lunch-learn/page.tsx
git commit -m "feat: larger moose on L&L page, repositioned to bottom-right"
```

---

### Task 5: Resources — Remove "All" tab, default to "By Product"

**Files:**
- Modify: `components/resources/ResourcesClient.tsx`

- [ ] **Step 1: Update TABS constant and default state**

Change:
```tsx
const TABS = ["All", "By Product", "By Document Type"] as const;
type TabType = (typeof TABS)[number];
```

To:
```tsx
const TABS = ["By Product", "By Document Type"] as const;
type TabType = (typeof TABS)[number];
```

Change:
```tsx
const [activeTab, setActiveTab] = useState<TabType>("All");
```

To:
```tsx
const [activeTab, setActiveTab] = useState<TabType>("By Product");
```

- [ ] **Step 2: Update the filter logic that referenced "All"**

In the `filtered` useMemo, the existing code only branches on `"By Product"` and `"By Document Type"`. The `"All"` case was a fall-through (no filter applied). This is now the default behavior with no tab active filter, so no logic change needed.

In `handleTabChange`, remove any `"All"` references (there are none — function is clean).

- [ ] **Step 3: Update the grouped-view condition**

The grouped display was shown when `activeTab === "All"`. Now we want it when `activeTab === "By Product" && productFilter === "all"`. Find:
```tsx
{activeTab === "All" && typeFilter === "All" && !search ? (
```

Replace with:
```tsx
{activeTab === "By Product" && productFilter === "all" && typeFilter === "All" && !search ? (
```

- [ ] **Step 4: Verify TypeScript build**

```bash
cd C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website\.claude\worktrees\bold-wilson && npm run build 2>&1 | grep -E "ResourcesClient|error TS" | head -20
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add components/resources/ResourcesClient.tsx
git commit -m "feat: remove All tab from Resources, default to By Product"
```

---

### Task 6: BlogFilter — Remove content-type filter

**Files:**
- Modify: `components/blog/BlogFilter.tsx`

- [ ] **Step 1: Remove CATEGORIES array and category state**

Remove these lines entirely:
```tsx
const CATEGORIES: PostCategory[] = ["Blog", "Case Study", "Project Profile", "White Paper"];
```

Remove from imports:
```tsx
import type { PostMeta, PostCategory } from "@/lib/mdx";
```

Replace with:
```tsx
import type { PostMeta } from "@/lib/mdx";
```

- [ ] **Step 2: Remove category state and URL param**

Remove:
```tsx
const [category, setCategory] = useState<PostCategory | "all">(() => (searchParams.get("category") as PostCategory) ?? "all");
```

In `pushParams`, remove:
```tsx
if (state.category !== "all") params.set("category", state.category);
```

And remove `category` from the state spread. Updated `pushParams`:
```tsx
const pushParams = useCallback(
  (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    const state = { search, product, sort, ...overrides };
    if (state.search)          params.set("search",  state.search);
    if (state.product !== "all") params.set("product", state.product);
    if (state.sort !== "newest") params.set("sort",    state.sort);
    const qs = params.toString();
    router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false });
  },
  [search, product, sort, router]
);
```

- [ ] **Step 3: Remove category from filtered logic**

Remove:
```tsx
if (category !== "all") result = result.filter((p) => p.category === category);
```

- [ ] **Step 4: Remove category from hasFilters and clearFilters**

Change:
```tsx
const hasFilters = search !== "" || category !== "all" || product !== "all" || sort !== "newest";
```
To:
```tsx
const hasFilters = search !== "" || product !== "all" || sort !== "newest";
```

Change:
```tsx
function clearFilters() {
  setSearch(""); setCategory("all"); setProduct("all"); setSort("newest");
  router.replace("/blog", { scroll: false });
}
```
To:
```tsx
function clearFilters() {
  setSearch(""); setProduct("all"); setSort("newest");
  router.replace("/blog", { scroll: false });
}
```

- [ ] **Step 5: Remove Type filter UI row from the JSX**

Remove this entire block from the JSX:
```tsx
<span className="text-xs px-2" style={{ color: "#444" }}>Type:</span>
{CATEGORIES.map((cat) => (
  <Btn key={cat} label={cat} active={category === cat} onClick={() => setAndSync(setCategory, "category", cat)} />
))}
```

And also remove the "All" button's `category === "all"` logic — simplify to just reset product too:
```tsx
<Btn label="All" active={product === "all"} onClick={() => { setAndSync(setProduct, "product", "all"); }} />
```

- [ ] **Step 6: Remove unused PostCategory import from mdx.ts (if it causes errors)**

If build shows unused type warning, that's fine to leave (it won't block build). Only fix if it causes a type error.

- [ ] **Step 7: Build check**

```bash
cd C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website\.claude\worktrees\bold-wilson && npm run build 2>&1 | grep -E "BlogFilter|error TS" | head -20
```

- [ ] **Step 8: Commit**

```bash
git add components/blog/BlogFilter.tsx
git commit -m "feat: remove content-type filter from Field Notes, keep product filter only"
```

---

### Task 7: BlogCard — Dark card redesign

**Files:**
- Modify: `components/blog/BlogCard.tsx`

- [ ] **Step 1: Rewrite BlogCard with crisp dark card design**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";

const FALLBACKS = [
  "/images/applications/public-spaces/concordia-multicolour-crosswalk-01.jpg",
  "/images/applications/traffic-calming/roundabout-red-brick-planted-centre-01.jpg",
  "/images/applications/bus-bike-lanes/red-bus-lane-brt-transit-station-01.jpg",
  "/images/products/streetbond/streetbond-multicolour-plaza-green-circles-01.jpg",
  "/images/applications/commercial-spaces/tim-hortons-red-brick-crosswalk-01.jpg",
];

function getFallback(slug: string) {
  const hash = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FALLBACKS[hash % FALLBACKS.length];
}

export default function BlogCard({ post }: { post: PostMeta }) {
  const imgSrc = post.featuredImage ?? getFallback(post.slug);
  const isExternal = imgSrc.startsWith("http");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
      style={{
        background: "#1C1F23",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Image with gradient overlay */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <Image
          src={imgSrc}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={isExternal}
        />
        {/* Dark gradient overlay at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(28,31,35,0.9), transparent)" }}
        />
        {/* Orange accent border on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-t-xl"
          style={{ boxShadow: "inset 0 0 0 1px rgba(249,115,22,0.4)" }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Product + date row */}
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {post.products.slice(0, 2).map((p) => (
              <span
                key={p}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}
              >
                {p}
              </span>
            ))}
          </div>
          <span className="text-[10px]" style={{ color: "#6B7280" }}>
            {new Date(post.date).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-bold text-sm leading-snug mb-2 transition-colors duration-200 group-hover:text-orange-400"
          style={{ color: "#F5F0EB" }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: "#9CA3AF" }}>
          {post.excerpt.length > 110
            ? post.excerpt.slice(0, post.excerpt.lastIndexOf(" ", 110)) + "..."
            : post.excerpt}
        </p>

        {/* CTA */}
        <span className="text-xs font-semibold flex items-center gap-1 mt-auto" style={{ color: "#f97316" }}>
          Read Post &rarr;
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/blog/BlogCard.tsx
git commit -m "feat: dark card redesign for blog/field notes posts"
```

---

### Task 8: Projects page — Remove province filter

**Files:**
- Modify: `app/projects/page.tsx`

- [ ] **Step 1: Update FilterType and filter logic**

Change:
```tsx
type FilterType = "all" | "product" | "application" | "province";
```
To:
```tsx
type FilterType = "all" | "product" | "application";
```

Remove from `filtered` useMemo:
```tsx
if (filter.type === "province") return projects.filter((p) => p.province === filter.value);
```

- [ ] **Step 2: Remove province filter buttons from JSX**

Remove the entire province section:
```tsx
<span className="text-xs self-center px-2" style={{ color: "#333" }}>Province:</span>
{provinces.map((prov) => (
  <FilterBtn key={prov} label={prov} active={filter.type === "province" && filter.value === prov} onClick={() => setFilter({ type: "province", value: prov })} />
))}
```

Also remove the `provinces` variable since it's no longer used:
```tsx
const provinces = [...new Set(projects.map((p) => p.province))];
```

- [ ] **Step 3: Commit**

```bash
git add app/projects/page.tsx
git commit -m "feat: remove province filter from projects page, keep product + application"
```

---

### Task 9: New Blog Post — REIT Commercial Parking

**Files:**
- Create: `content/blog/commercial-parking-reit-specification.mdx`

- [ ] **Step 1: Create the MDX file**

```mdx
---
title: "Commercial Properties Are Rethinking the Ordinary — Is Your Parking Lot Ready?"
date: "2026-03-26"
excerpt: "REIT managers and property specifiers are discovering that HUB Surface Systems' commercial parking solutions deliver 8+ years of performance versus 1–2 years for traditional markings — with zero maintenance and a total lifecycle cost that makes paint look expensive."
category: "Case Study"
products: ["TrafficPatternsXD", "TrafficPatterns", "StreetPrint", "StreetBond"]
tags: ["Commercial", "REIT", "Parking", "Specification", "Durability"]
author: "HUB Surface Systems"
heroImage: "/images/blog/commercial-parking-hero.jpg"
featuredImage: "/images/applications/commercial-spaces/tim-hortons-red-brick-crosswalk-01.jpg"
readTime: "7 min read"
---

Your parking lot is your first handshake with every customer, tenant, and stakeholder who visits your property. For Canada's commercial real estate managers and REIT specifiers, that handshake is happening on faded paint, cracked asphalt markings, and parking surfaces that quietly communicate: *we don't invest in the details*.

It doesn't have to be that way.

[IMAGE PLACEHOLDER: Aerial shot of well-marked commercial parking lot, stamped asphalt entry with brick pattern — contrast before/after]

---

## The Cost of Looking Cheap

Traditional paint-based parking markings have a service life of 1–2 years in Canadian conditions. Add aggressive winters, heavy plow traffic, de-icing salt, freeze-thaw cycling, and you've got markings that look tired within a single season.

The math is quietly brutal:

- **Year 1:** Fresh paint, professional appearance — $X
- **Year 2:** Touch-ups, re-striping — $X again
- **Year 3–5:** Full reapplication cycles, slip-and-fall liability exposure, tenant complaints

Over a 10-year property hold, a well-capitalized REIT with 40+ properties isn't budgeting for paint — they're budgeting for a recurring maintenance programme that never ends and never gets better.

> The real cost of cheap markings isn't the material. It's the labour, the disruption, the liability exposure, and the brand impression you're making on every customer who visits your property.

**What does a parking lot that looks neglected communicate?** To a retail tenant renewing their lease, it signals underinvestment. To a customer choosing between your power centre and the one down the road, it's a friction point. Small — but real.

There's a better model.

---

## Four Products. Every Parking Surface Scenario.

HUB Surface Systems has engineered four distinct systems for commercial parking, each purpose-built for a specific performance requirement.

### TrafficPatterns® — Preformed Thermoplastic Marking

The baseline standard for commercial parking. Preformed thermoplastic is heat-fused directly into the asphalt surface — not applied on top of it. The result is a marking that is flush-mounted, plow-blade resistant, and chemically bonded to the surface.

- **Service life:** 8–10 years under normal commercial traffic
- **Plow resistance:** Flush with surface — no blade catch point
- **Application:** Applied in a single session, trafficable within minutes
- **Best for:** Stall lines, directional arrows, accessible parking, fire routes

[IMAGE PLACEHOLDER: TrafficPatterns stall markings in commercial parking lot, close-up showing flush surface]

### TrafficPatternsXD™ — Built for the Punishing Stuff

When your property sees high-volume daily traffic — grocery-anchored retail, big box, fast food drive-throughs — standard thermoplastic isn't enough. TrafficPatternsXD is 150 mil thick (standard is 90 mil), aggregate-reinforced for skid resistance, and engineered specifically for surfaces where degradation is rapid.

- **Thickness:** 150 mil (vs. 90 mil standard)
- **Aggregate:** Anti-skid surface treatment for all-weather grip
- **Service life:** 8+ years in the most demanding environments on record
- **Best for:** High-volume commercial, drive-through lanes, grocery anchors, pharmacy, fuel bar entries

> "TrafficPatternsXD has proven to be very stable, with virtually no maintenance required… the markings continue to look great." — Leo Guddemi, Stantec

[IMAGE PLACEHOLDER: TrafficPatternsXD in grocery store parking lot — Fortinos or similar]

### StreetPrint® — When the Parking Lot Is Part of the Brand

Some properties don't want a parking lot — they want an arrival experience. StreetPrint transforms asphalt into stamped brick, slate, cobblestone, or custom tile patterns using a durable pigmented coating over a stamped surface.

No pavers. No trip hazards. No maintenance nightmare.

- **Patterns:** Brick, slate, cobblestone, herringbone, custom — any pattern, any colour
- **No trip hazards:** Flush with surrounding asphalt, unlike real pavers
- **Durability:** 10–15 years with proper application
- **Best for:** Retail forecourts, entry drives, pedestrian crossings within parking fields, town centre commercial

[IMAGE PLACEHOLDER: StreetPrint stamped brick entry drive at premium retail — warm tones, well-lit]

### StreetBond® / StreetBondSR — The Protective + Solar-Reflective System

StreetBond is a polymer-modified coating that seals and colours asphalt, improving surface durability while delivering a highly visible, aesthetically distinctive result. StreetBondSR adds Solar Reflectance (SR) technology — the coating reflects heat rather than absorbing it, reducing surface temperatures by up to 10°C.

- **LEED contribution:** Reduced urban heat island effect
- **Visibility:** Bright, clean colour over full surface areas — bus lanes, fire routes, pedestrian zones
- **StreetBondSR:** Qualifies for several municipal and commercial sustainability programmes
- **Best for:** Fire routes, pedestrian zones, accessible parking areas, LEED-seeking developments

---

## Field-Proven Across Canada

These aren't spec-sheet claims. They're commercial parking installations that have been performing in Canadian conditions for years.

### Fairview Park Mall — Kitchener, Ontario

**Product:** TrafficPatternsXD
**Duration:** 6 years and counting
**Traffic:** Major regional shopping centre, daily high-volume, seasonal plow programme

Six years after installation, the TrafficPatternsXD markings at Fairview Park Mall remain intact and highly visible — with zero maintenance interventions. The property management team has not had to budget a single re-striping cycle.

[IMAGE PLACEHOLDER: Fairview Park Mall parking — close-up of TrafficPatternsXD markings, well-maintained at year 6]

### Toronto Premium Outlets — Halton Hills, Ontario

**Product:** TrafficPatterns
**Duration:** 13 years
**Traffic:** One of Canada's highest-volume outlet centres — 10M+ annual visitors

Thirteen years. The markings installed at Toronto Premium Outlets during construction have required no replacement. The property team's maintenance budget for parking markings over that period: zero re-applications.

That's the lifecycle cost argument in one number.

[IMAGE PLACEHOLDER: Toronto Premium Outlets exterior — clean, well-defined parking field]

### Fortinos Supermarket — Oakville, Ontario

**Product:** TrafficPatternsXD
**Duration:** 10 years
**Traffic:** Daily grocery traffic, heavy cart and vehicle movement, year-round plow service

A grocery-anchored parking lot is arguably the hardest-use surface in commercial real estate. Daily traffic, shopping cart damage, heavy plow runs, de-icing chemical saturation. Fortinos Oakville has had TrafficPatternsXD for a decade with consistent performance.

> "TrafficPatternsXD has proven to be very stable and durable… with virtually no maintenance required since installation. The markings continue to look great." — Leo Guddemi, Stantec

[IMAGE PLACEHOLDER: Busy grocery store parking lot, clean markings visible]

---

## Built for Canadian Winters

Canadian winters are the ultimate performance test for any pavement marking system. What looks good in September can be destroyed by April.

HUB systems are engineered specifically for:

- **Temperature range:** -40°C to +40°C service range
- **Plow resistance:** Flush-mounted, no edge catch point for blade damage
- **De-icing chemicals:** Resistant to chloride-based and acetate-based ice melters
- **Freeze-thaw cycling:** Thermally bonded — expands and contracts with the pavement substrate

| Performance Factor | Traditional Paint | TrafficPatterns® | TrafficPatternsXD™ |
|---|---|---|---|
| Snow plow resistance | Poor — chips and lifts | Excellent — flush mount | Excellent — flush mount |
| Service life | 1–2 years | 8–10 years | 8+ years |
| Installation disruption | Annual | One-time | One-time |
| Skid resistance | None | Standard | Aggregate-reinforced |
| Visibility retention | Fades by year 1 | Consistent | Consistent |
| De-icing chemical resistance | Degrades rapidly | Resistant | Resistant |
| Winter freeze-thaw performance | Cracking, peeling | Bonded — stable | Bonded — stable |

---

## The Smart Budget Decision

The conversation usually starts with: *"How much does it cost per square foot?"*

The better question is: *"How much does it cost per square foot, per year, over 10 years?"*

**Traditional paint (annual re-stripe):**
- Material + labour × 10 years
- Plus: property disruption (cones, closures, tenant friction)
- Plus: liability exposure during degraded-marking periods
- Plus: management time coordinating annual contractors

**TrafficPatternsXD (one application):**
- Single installation investment
- Zero maintenance budget for 8–10 years
- No disruption after installation
- No liability exposure from illegible markings

The lifecycle math consistently favours thermoplastic by a significant margin — even before you account for the brand impression difference between a parking lot that looks maintained versus one that looks neglected.

For REIT-level portfolios managing dozens of properties, this multiplies: one specification standard, trained applicator network, consistent performance across all sites.

---

## Ready to Specify?

HUB Surface Systems works directly with property managers, REIT specifiers, and their consulting engineers to develop site-specific recommendations.

**Three ways to move forward:**

1. **Book a Lunch & Learn** — We'll walk your team through the full product system, with Canadian case studies and RFP-ready spec language. Complimentary. We bring the food.

2. **Request a Spec Sheet** — Download technical data sheets for TrafficPatterns, TrafficPatternsXD, StreetPrint, and StreetBond.

3. **Talk to our team** — [Contact us](/contact) for a site assessment or product recommendation.

---

*HUB Surface Systems has been Canada's trusted partner for decorative and functional pavement systems since 1994. Two offices: Milton, Ontario (East) and Ladysmith, BC (West). [hubss.com](https://hubss.com)*
```

- [ ] **Step 2: Verify MDX parses (build check)**

```bash
cd C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website\.claude\worktrees\bold-wilson && npm run build 2>&1 | grep -E "commercial-parking|mdx|error" | head -20
```

- [ ] **Step 3: Commit**

```bash
git add content/blog/commercial-parking-reit-specification.mdx
git commit -m "feat: add REIT commercial parking blog post"
```

---

### Task 10: Contrast Audit + Global Sweep

**Files:**
- Audit: all `components/sections/*.tsx`, `app/blog/page.tsx`, `app/projects/page.tsx`

- [ ] **Step 1: Check StatsBar for any contrast issues**

Read `components/sections/StatsBar.tsx`. Ensure stat numbers are white or orange on dark bg, labels are `#D1D5DB` minimum.

- [ ] **Step 2: Check ApplicationsGrid for contrast**

Read `components/sections/ApplicationsGrid.tsx`. Any grey-on-grey text must be fixed to `#E5E7EB` or lighter.

- [ ] **Step 3: Check RecentProjects for contrast**

Read `components/sections/RecentProjects.tsx`. Card text on dark bg must be white/light.

- [ ] **Step 4: Check Footer for any lingering dark-blue bg**

Read `components/sections/Footer.tsx`. Replace any `#111C2D` or `bg-slate` with `#0a0a0a` or `#0f1117`.

- [ ] **Step 5: Ensure ProductsGrid uses consistent card style**

Read `components/sections/ProductsGrid.tsx`. Cards on dark bg should use `#1C1F23` not `#2d2d2d` mixed inconsistently.

- [ ] **Step 6: Commit any contrast fixes**

```bash
git add components/sections/
git commit -m "fix: contrast audit — dark bg sections use white/light text consistently"
```

---

### Final: Build, Push, Done

- [ ] **Full production build**

```bash
cd C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website\.claude\worktrees\bold-wilson && npm run build
```

Expected: ✓ Compiled successfully

- [ ] **Push branch**

```bash
git push origin claude/bold-wilson
```

- [ ] **Merge to main** (or the brief specifies pushing to main directly)

Since we're on `claude/bold-wilson` worktree branch, push and merge:
```bash
git push origin claude/bold-wilson:main
```

Or create a PR and merge via GitHub if preferred.
