# Blog Template Redesign — DDB Agency Standard

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the blog post template and listing page to AAA creative agency standard — full-bleed hero, premium typography, table of contents, social sharing, related posts.

**Architecture:** Server-rendered blog pages with two client components (TableOfContents, ShareButtons). Shared BlogCard component used by both the listing page and the RelatedPosts section. Prose typography controlled via globals.css overrides. No new dependencies.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS 4, @tailwindcss/typography, Lucide React (icons already installed), next/image, next-mdx-remote/rsc.

**Spec:** `docs/superpowers/specs/2026-03-16-blog-template-redesign.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `components/blog/BlogCard.tsx` | Create | Shared post card (image, title, date, excerpt) |
| `components/blog/ShareButtons.tsx` | Create | Client: LinkedIn, X, Facebook, Copy Link |
| `components/blog/TableOfContents.tsx` | Create | Client: auto-generated from h2s, sticky sidebar, IntersectionObserver |
| `components/blog/RelatedPosts.tsx` | Create | Server: renders 3 BlogCards for related posts |
| `app/blog/page.tsx` | Rewrite | Featured hero post + card grid |
| `app/blog/[slug]/page.tsx` | Rewrite | Full-bleed hero, article body, ToC, share, related posts, CTA |
| `app/globals.css` | Modify | Blog prose overrides (h2 gradient border, blockquotes, lists, links, hr) |

---

## Chunk 1: Foundation Components

### Task 1: Create BlogCard component

**Files:**
- Create: `components/blog/BlogCard.tsx`

- [ ] **Step 1: Create the component**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";

export default function BlogCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl overflow-hidden bg-[#1e1e1e] border border-white/5 transition-all duration-300 hover:border-orange-500/20 hover:shadow-[0_0_30px_rgba(249,115,22,0.06)]"
    >
      {post.featuredImage ? (
        <div className="aspect-[16/9] overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            width={600}
            height={338}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a]" />
      )}
      <div className="p-6">
        <p className="text-xs text-gray-500 mb-3 tracking-wide">
          {new Date(post.date).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {post.readTime}
        </p>
        <h3 className="font-bold text-lg leading-snug mb-2 text-[#f5f0eb] group-hover:text-orange-400 transition-colors duration-300">
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-400 line-clamp-3">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verify file created**

Run: `ls components/blog/BlogCard.tsx`
Expected: file exists

- [ ] **Step 3: Commit**

```bash
git add components/blog/BlogCard.tsx
git commit -m "feat(blog): add shared BlogCard component"
```

---

### Task 2: Create ShareButtons client component

**Files:**
- Create: `components/blog/ShareButtons.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { Linkedin, Facebook, Link2, Check } from "lucide-react";

// X/Twitter icon — Lucide doesn't have the new X logo
function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      icon: <Linkedin size={18} />,
    },
    {
      label: "X",
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=HUB_SS`,
      icon: <XIcon />,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <Facebook size={18} />,
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-gray-400 hover:text-orange-400 hover:border-orange-400/30 transition-all duration-200"
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-gray-400 hover:text-orange-400 hover:border-orange-400/30 transition-all duration-200"
      >
        {copied ? <Check size={18} className="text-green-400" /> : <Link2 size={18} />}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/blog/ShareButtons.tsx
git commit -m "feat(blog): add ShareButtons client component"
```

---

### Task 3: Create TableOfContents client component

**Files:**
- Create: `components/blog/TableOfContents.tsx`

Key design decisions:
- Scopes DOM queries to `[data-blog-content]` container to avoid picking up unrelated h2s
- Uses IntersectionObserver for active section tracking
- Runs after mount with requestAnimationFrame guard for hydration safety

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Wait one frame after hydration to ensure MDX content is in the DOM
    requestAnimationFrame(() => {
      const container = document.querySelector("[data-blog-content]");
      if (!container) return;

      const h2s = container.querySelectorAll("h2");
      const items: TocItem[] = [];

      h2s.forEach((h2, i) => {
        // Ensure each h2 has an id for linking
        if (!h2.id) {
          h2.id = h2.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || `section-${i}`;
        }
        items.push({ id: h2.id, text: h2.textContent || "" });
      });

      setHeadings(items);

      // Observe for active section
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: "-80px 0px -60% 0px" }
      );

      h2s.forEach((h2) => observer.observe(h2));
      return () => observer.disconnect();
    });
  }, []);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
        On this page
      </p>
      <ul className="space-y-2 border-l border-white/10">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`block pl-4 py-1 transition-all duration-200 border-l-2 -ml-px ${
                activeId === h.id
                  ? "border-orange-400 text-orange-400 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/blog/TableOfContents.tsx
git commit -m "feat(blog): add TableOfContents client component with IntersectionObserver"
```

---

### Task 4: Create RelatedPosts server component

**Files:**
- Create: `components/blog/RelatedPosts.tsx`

Note: Accepts posts as a prop to avoid a duplicate `getAllPosts()` call.

- [ ] **Step 1: Create the component**

```tsx
import type { PostMeta } from "@/lib/mdx";
import BlogCard from "./BlogCard";

interface RelatedPostsProps {
  posts: PostMeta[];
  currentSlug: string;
  count?: number;
}

export default function RelatedPosts({
  posts,
  currentSlug,
  count = 3,
}: RelatedPostsProps) {
  const related = posts
    .filter((p) => p.slug !== currentSlug)
    .slice(0, count);

  if (related.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 pb-24">
      <h2 className="text-2xl font-bold text-[#f5f0eb] mb-8">Continue Reading</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/blog/RelatedPosts.tsx
git commit -m "feat(blog): add RelatedPosts server component"
```

---

## Chunk 2: Blog Prose Typography

### Task 5: Add blog prose overrides to globals.css

**Files:**
- Modify: `app/globals.css` (append after line 111, before closing)

These overrides target `.blog-prose` so they don't affect other prose instances on the site.

- [ ] **Step 1: Append blog prose styles**

Add the following block at the end of `app/globals.css`:

```css
/* ─── Blog article prose overrides ───────────────────── */
.blog-prose {
  color: #d1d5db;
  font-size: 1.125rem;
  line-height: 1.85;
}

.blog-prose h2 {
  color: #f5f0eb;
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1rem;
  padding-left: 1rem;
  border-left: 2px solid transparent;
  border-image: var(--gradient-brand) 1;
}

.blog-prose h3 {
  color: #e5e7eb;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.blog-prose blockquote {
  border-left: 3px solid #f97316;
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  font-size: 1.25rem;
  color: #d1d5db;
}

.blog-prose blockquote p {
  margin: 0;
}

.blog-prose a {
  color: #fb923c;
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: color 0.2s;
}

.blog-prose a:hover {
  color: #fdba74;
}

.blog-prose ul {
  list-style: none;
  padding-left: 0;
}

.blog-prose ul li {
  position: relative;
  padding-left: 1.5rem;
}

.blog-prose ul li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f97316;
}

.blog-prose ol {
  list-style: none;
  counter-reset: blog-counter;
  padding-left: 0;
}

.blog-prose ol li {
  position: relative;
  padding-left: 2rem;
  counter-increment: blog-counter;
}

.blog-prose ol li::before {
  content: counter(blog-counter) ".";
  position: absolute;
  left: 0;
  font-weight: 600;
  color: #f97316;
}

.blog-prose img {
  width: 100%;
  border-radius: 0.5rem;
  margin: 2rem 0;
}

.blog-prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
}

.blog-prose th {
  background: #2d2d2d;
  color: #f5f0eb;
  font-weight: 600;
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #444;
}

.blog-prose td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #333;
  color: #d1d5db;
}

.blog-prose hr {
  border: none;
  height: 2px;
  background: var(--gradient-brand);
  margin: 3rem 0;
  opacity: 0.3;
}

.blog-prose strong {
  color: #f5f0eb;
  font-weight: 600;
}

.blog-prose code {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 0.15em 0.4em;
  font-size: 0.9em;
  color: #fb923c;
}

.blog-prose pre {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 0.5rem;
  padding: 1.25rem;
  overflow-x: auto;
  margin: 2rem 0;
}

.blog-prose pre code {
  background: none;
  border: none;
  padding: 0;
  color: #d1d5db;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat(blog): add premium prose typography overrides"
```

---

## Chunk 3: Blog Post Page Rewrite

### Task 6: Rewrite `app/blog/[slug]/page.tsx`

**Files:**
- Rewrite: `app/blog/[slug]/page.tsx`

Key design decisions:
- Hero bleeds under the nav (image starts at top of viewport, content offset by `pt-20` minimum)
- Gradient overlay ensures legibility over nav backdrop
- If no featuredImage, fall back to solid dark gradient hero (no broken layout)
- Posts array passed as prop to RelatedPosts (no duplicate disk reads)
- `og:image` passed through existing `buildMetadata({ image })` param
- `data-blog-content` attribute on article for ToC scoping

- [ ] **Step 1: Rewrite the full file**

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/ui/JsonLd";
import { getAllPosts, getPost } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { buildMetadata } from "@/lib/seo";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import RelatedPosts from "@/components/blog/RelatedPosts";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let post;
  try {
    post = getPost(slug);
  } catch {
    return {};
  }
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    slug: `blog/${slug}`,
    type: "article",
    publishedTime: post.date,
    image: post.featuredImage,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = getPost(slug);
  } catch {
    notFound();
  }

  const allPosts = getAllPosts();
  const postUrl = `https://hubss.com/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "HUB Surface Systems" },
    publisher: {
      "@type": "Organization",
      name: "HUB Surface Systems",
      logo: {
        "@type": "ImageObject",
        url: "https://hubss.com/images/logo.svg",
      },
    },
    url: postUrl,
    image: post.featuredImage
      ? `https://hubss.com${post.featuredImage}`
      : "https://hubss.com/images/og-default.jpg",
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <JsonLd data={articleSchema} />
      <Nav />

      {/* ── Hero ────────────────────────────────────────── */}
      <header className="relative w-full h-[60vh] min-h-[420px] overflow-hidden">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-6 pb-12">
            <div className="max-w-3xl">
              <p className="text-sm text-gray-400 mb-4">
                {new Date(post.date).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {" · "}
                {post.readTime}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* ── Article + Sidebar layout ────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16 lg:grid lg:grid-cols-[1fr_240px] lg:gap-16">
        {/* Article body */}
        <article
          data-blog-content
          className="blog-prose prose prose-invert max-w-3xl"
        >
          <MDXRemote source={post.content} />
        </article>

        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <TableOfContents />
          </div>
        </aside>
      </div>

      {/* ── Author / Share bar ──────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-[#f5f0eb]">
              HUB Surface Systems
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Canadian leader in decorative and functional pavement solutions
            </p>
          </div>
          <ShareButtons url={postUrl} title={post.title} />
        </div>
      </div>

      {/* ── CTA band ────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-[#111]">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#f5f0eb] mb-4">
            Ready to transform your streetscape?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            From decorative crosswalks to durable transit lanes — get a custom
            spec sheet for your project or book a complimentary Lunch &amp; Learn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-primary px-8 py-4 rounded-lg font-semibold text-sm"
            >
              Request Spec Sheet
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-lg font-semibold text-sm border border-white/20 text-[#f5f0eb] hover:border-orange-400/40 hover:text-orange-400 transition-all duration-200"
            >
              Book Lunch &amp; Learn
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related Posts ───────────────────────────────── */}
      <div className="pt-16 border-t border-white/5">
        <RelatedPosts posts={allPosts} currentSlug={slug} />
      </div>

      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/blog/[slug]/page.tsx
git commit -m "feat(blog): rewrite post template — hero, ToC sidebar, share bar, CTA, related posts"
```

---

## Chunk 4: Blog Listing Page Rewrite

### Task 7: Rewrite `app/blog/page.tsx`

**Files:**
- Rewrite: `app/blog/page.tsx`

Key design decisions:
- Latest post displayed as a full-width hero card at top
- Remaining posts in 3-column grid using BlogCard
- Posts without featuredImage get a gradient fallback (handled in BlogCard)
- No filtering for now — pure editorial index

- [ ] **Step 1: Rewrite the full file**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog | HUB Surface Systems",
  description:
    "Insights on decorative pavement, Vision Zero, Complete Streets, and Canadian municipal infrastructure from the HUB Surface Systems team.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Nav />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* ── Header ─────────────────────────────────── */}
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-orange-500">
            Insights
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-[#f5f0eb]">
            Blog
          </h1>
          <p className="text-gray-400 mt-3 max-w-xl">
            Industry perspectives on decorative pavement, pedestrian safety, and
            municipal infrastructure across Canada.
          </p>
        </div>

        {/* ── Featured post hero ─────────────────────── */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group relative block w-full rounded-2xl overflow-hidden mb-12 aspect-[21/9] min-h-[320px]"
          >
            {featured.featuredImage ? (
              <Image
                src={featured.featuredImage}
                alt={featured.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                priority
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
            <div className="absolute inset-0 flex items-end p-8 md:p-12">
              <div className="max-w-2xl">
                <p className="text-xs text-gray-400 mb-3 tracking-wide">
                  {new Date(featured.date).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" · "}
                  {featured.readTime}
                </p>
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3">
                  {featured.title}
                </h2>
                <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-lg">
                  {featured.excerpt}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* ── Post grid ──────────────────────────────── */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat(blog): rewrite listing page — featured hero card + grid layout"
```

---

## Chunk 5: MDX Editing Comments + Final Commit

### Task 8: Add editing comment to all MDX files

**Files:**
- Modify: all `.mdx` files in `content/blog/`

- [ ] **Step 1: Write and run a Node script to batch-add the comment**

Create a temporary script that:
1. Reads each `.mdx` file in `content/blog/`
2. Checks if the comment block already exists (skip if so)
3. Inserts the comment block immediately after the closing `---` of frontmatter
4. Writes the file back

The comment to insert (immediately after the `---` closing frontmatter):

```
{/*
  TO UPDATE THIS POST:
  - Edit text directly in this file
  - Swap hero image: replace the file at the featuredImage path above
  - Add body image: ![Alt text](/images/blog/slug/image-name.jpg)
  - Save — Vercel auto-deploys in ~2 minutes
*/}
```

Run the script:
```bash
node scripts/add-mdx-comments.js
```

Delete the script after:
```bash
rm scripts/add-mdx-comments.js
```

- [ ] **Step 2: Verify a few files have the comment**

```bash
head -15 content/blog/veterans-crosswalk-kitchener.mdx
head -15 content/blog/vision-zero-surface-markings.mdx
```

Expected: editing comment block visible after `---`

- [ ] **Step 3: Commit everything**

```bash
git add content/blog/ app/ components/blog/
git commit -m "design: blog template DDB pass — hero, typography, sidebar, social"
```

---

## Chunk 6: Visual QA

### Task 9: Dev server smoke test

- [ ] **Step 1: Start dev server**

```bash
cd C:/Users/cleve/Based_Agency/based-agncy_os/Web_Projects/hubss-website
npm run dev
```

- [ ] **Step 2: Check blog listing page**

Open `http://localhost:3000/blog` in browser. Verify:
- Featured hero card renders with image, gradient overlay, title
- Grid of remaining cards renders below
- Cards show featured images, titles, dates, excerpts
- Hover effects work (image scale, title color)

- [ ] **Step 3: Check blog post page**

Open `http://localhost:3000/blog/veterans-crosswalk-kitchener`. Verify:
- Full-bleed hero image at 60vh
- Gradient overlay with title at bottom
- Article body has premium typography (h2 gradient borders, orange bullets, etc.)
- Table of Contents appears on right sidebar (desktop)
- Share buttons render below article
- CTA band renders
- Related Posts section shows 3 cards
- Page scrolls smoothly, ToC highlights active section

- [ ] **Step 4: Check post without featured image**

Open `http://localhost:3000/blog/vision-zero-surface-markings`. Verify:
- Gradient fallback hero renders (no broken image)
- All other sections render normally

- [ ] **Step 5: Fix any visual issues found**

Address layout bugs, spacing issues, or rendering problems.

- [ ] **Step 6: Final commit if fixes were needed**

```bash
git add -A
git commit -m "fix(blog): visual QA polish"
```
