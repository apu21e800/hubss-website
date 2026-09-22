# Blog Template Redesign — DDB Agency Standard

## Context

The HUBSS blog (`/blog`) currently uses a minimal template: plain text on dark background, no hero treatment, basic typography. We're upgrading to a premium editorial layout suitable for a creative agency portfolio site.

**Key IA decision:** Case studies (~30 posts) and guides/white papers (~8 posts) will be moved out of `/blog` in a future task. This redesign targets pure editorial content only. The blog listing page will show all posts for now but the template is designed for editorial-style reading.

## Scope

Two files redesigned:
1. `app/blog/[slug]/page.tsx` — blog post template
2. `app/blog/page.tsx` — blog listing page

Supporting changes:
- `lib/mdx.ts` — no schema changes needed (existing fields sufficient)
- `app/globals.css` — prose overrides and new utility classes
- New component: `components/blog/TableOfContents.tsx` (client component)
- New component: `components/blog/ShareButtons.tsx` (client component)
- MDX comment blocks added to all 53 files (non-technical editing note)

## Blog Post Template (`app/blog/[slug]/page.tsx`)

### Hero Section
- Full-bleed featured image: `width: 100%`, `height: 60vh`, `object-cover`
- Dark gradient overlay on bottom 50%: `linear-gradient(to top, #0a0a0a 0%, #0a0a0a80 40%, transparent 100%)`
- Post title overlaid at bottom-left of hero: `text-4xl md:text-5xl lg:text-6xl font-bold text-white`, max-w-4xl
- Date + read time at bottom-right of hero: `text-sm text-gray-400`
- Full viewport width (breaks out of any container)

### Article Body
- Constrained width: `max-w-3xl mx-auto px-6`
- Body text: `text-lg leading-relaxed text-gray-300` (slightly lighter than current #9ca3af)
- Generous spacing: `pt-12 pb-24`

### Typography (via prose overrides in globals.css)
- **H2**: `text-2xl font-bold text-white mt-12 mb-4` with 2px left border using brand gradient (orange→yellow), `pl-4`
- **H3**: `text-xl font-semibold text-gray-100 mt-8 mb-3`
- **Blockquotes**: `text-xl italic text-gray-300`, orange left border (3px solid #f97316), `pl-6 my-8`
- **Links**: `text-orange-400 underline underline-offset-4 hover:text-orange-300 transition-colors`
- **Lists**: Custom orange bullet points via `::marker { color: #f97316 }`
- **Inline images**: `w-full rounded-lg my-8`, with figcaption styling below
- **Tables**: dark header row, subtle borders, responsive horizontal scroll wrapper
- **Code blocks**: dark background (#1e1e1e), rounded, subtle border
- **HR**: gradient line (orange→yellow→transparent)

### Table of Contents (desktop sidebar, sticky)
- Desktop only: `hidden lg:block`
- Position: fixed sidebar right of article, `sticky top-32`
- Auto-generated from H2 headings in MDX content
- Client component that parses rendered DOM for h2 elements
- Active section highlighting via IntersectionObserver
- Smooth scroll on click
- Subtle styling: `text-sm text-gray-500`, active: `text-orange-400 font-medium`
- Thin left line with dot indicator for active section

### Author/Meta Bar (below article)
- Horizontal divider (gradient line)
- "HUB Surface Systems" author attribution with company description one-liner
- Share buttons row: LinkedIn, X (Twitter), Facebook, Copy Link
  - LinkedIn share URL: `https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}`
  - X share URL: `https://x.com/intent/tweet?url={url}&text={title}&via=HUB_SS`
  - Facebook share URL: `https://www.facebook.com/sharer/sharer.php?u={url}`
  - Copy link: navigator.clipboard with "Copied!" feedback
  - Icon buttons with hover effects, using Lucide icons

### Related Posts (bottom of page)
- Section heading: "Continue Reading"
- 3 cards in a row (responsive grid), same card style as listing page
- Selected: 3 most recent posts excluding current post
- Each card: featured image, title, date, excerpt truncated

### CTA Section (before footer)
- Full-width band, dark background with subtle gradient
- "Ready to transform your streetscape?" heading
- Two buttons: "Request Spec Sheet" (primary) + "Book Lunch & Learn" (secondary outline)

### Schema/SEO
- Keep existing Article schema, update `image` to use featured image absolute URL
- Add `og:image` via generateMetadata using featuredImage

## Blog Listing Page (`app/blog/page.tsx`)

### Header
- "Insights" label (orange, tracking-widest uppercase)
- "Blog" title, `text-6xl font-bold`
- Subtitle: one-liner about the blog's purpose
- Keep existing pattern but add subtitle

### Featured Post (first/latest post)
- Full-width hero card at top
- Featured image as background, 50vh, gradient overlay
- Title, excerpt, date overlaid
- Links to post

### Post Grid
- Remaining posts in 3-column grid (1 col mobile, 2 tablet, 3 desktop)
- Card design: featured image (16:9 aspect), title, date, excerpt, "Read more"
- Hover: image scale 105%, title turns orange
- Rounded corners, dark card bg, subtle border

### No Filtering (for now)
- All posts shown, sorted by date (newest first)
- Filtering by category will come when we separate case studies/guides into their own sections
- Simple, clean, editorial index

## Components to Create

### `components/blog/TableOfContents.tsx`
- Client component ("use client")
- Props: none (reads from DOM)
- useEffect to query all h2 elements in the article
- IntersectionObserver for active section tracking
- Returns sticky sidebar with heading links

### `components/blog/ShareButtons.tsx`
- Client component ("use client")
- Props: `{ url: string; title: string }`
- Four buttons: LinkedIn, X, Facebook, Copy Link
- Lucide icons: `Linkedin`, `Twitter`, `Facebook`, `Link2`
- Copy link shows "Copied!" tooltip for 2 seconds

### `components/blog/RelatedPosts.tsx`
- Server component
- Props: `{ currentSlug: string; count?: number }`
- Gets all posts, filters out current, takes first `count` (default 3)
- Renders card grid matching listing page card style

### `components/blog/BlogCard.tsx`
- Shared between listing page and RelatedPosts
- Props: PostMeta
- Featured image, title, date, excerpt, read more link

## MDX Editing Comment
Add to top of each .mdx file (inside the file, after frontmatter closing `---`):

```
{/*
  TO UPDATE THIS POST:
  - Edit text directly in this file
  - Swap hero image: replace the file at the featuredImage path above
  - Add body image: ![Alt text](/images/blog/slug/image-name.jpg)
  - Save — Vercel auto-deploys in ~2 minutes
*/}
```

## Social Links (for share buttons)
- X/Twitter: https://x.com/HUB_SS
- Instagram: https://www.instagram.com/hub_surface_systems/
- Facebook: https://www.facebook.com/HUBSurfaceSystems

## Files Changed

| File | Action |
|------|--------|
| `app/blog/[slug]/page.tsx` | Rewrite — hero, typography, sidebar, meta bar |
| `app/blog/page.tsx` | Rewrite — featured post hero, improved card grid |
| `app/globals.css` | Add — prose overrides, gradient utilities |
| `components/blog/TableOfContents.tsx` | New — client component |
| `components/blog/ShareButtons.tsx` | New — client component |
| `components/blog/RelatedPosts.tsx` | New — server component |
| `components/blog/BlogCard.tsx` | New — shared card component |
| `lib/mdx.ts` | No changes needed |
| `content/blog/*.mdx` (53 files) | Add editing comment block |

## Out of Scope
- Category/tag system (future: IA restructure)
- Related Products sidebar (belongs on case study template, not blog)
- Search functionality
- Pagination (53 posts is fine without it)
- Moving case studies/guides to other sections (separate task)
