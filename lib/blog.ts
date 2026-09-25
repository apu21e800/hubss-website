/**
 * Field Notes: every post comes from Sanity.
 *
 * Until Sep 2026 the posts were .mdx files in content/blog, read from disk by
 * lib/mdx.ts. They now live in Studio, where Doug and Vern write, edit and
 * publish them (sanity/schemas/blogPost.ts), and this file reads them. The old
 * files are kept, unread, in content/blog-archive/.
 *
 * TWO LISTS, ON PURPOSE
 * /blog/[slug] only serves the slugs it built (dynamicParams = false), so an
 * unknown address is a real 404 rather than a 200 (see that page). Which posts
 * were built is lib/blog-index.json, written by scripts/gen-blog-index.mjs at
 * the start of every build. Everything here is limited to that list, so a
 * listing never links to a page that doesn't exist yet:
 *  - an edit to a live post: the webhook expires the "blog" tag and the change
 *    is on the site within seconds;
 *  - a new post (or a changed slug, or a post taken down): the webhook starts a
 *    rebuild (app/api/revalidate/route.ts), and about five minutes later the
 *    post is on every list and its page exists, at the same moment.
 *
 * A failed read throws (lib/sanity.queries.ts, sanityFetch): the build fails
 * rather than publishing an empty blog, and an ISR refresh keeps the last good
 * page.
 */

import { unstable_cache } from "next/cache";
import { sanityFetch, CACHE_VERSION } from "@/lib/sanity.queries";
import blogIndex from "@/lib/blog-index.json";
import { FIELD_NOTE_TYPES, type FieldNoteType } from "@/lib/field-notes-taxonomy";
import { countWords, inferCategory, readTimeFor, scanProducts } from "@/lib/blog-taxonomy";
import type { PostBodyNode } from "@/components/blog/PostBody";

export type PostCategory = FieldNoteType;

export interface PostMeta {
  slug: string;
  title: string;
  /** YYYY-MM-DD, the publish date as a Canadian reader's calendar shows it. */
  date: string;
  excerpt: string;
  readTime: string;
  /** Sanity CDN URL. Render it with components/ui/PhotoImage, never plain next/image. */
  featuredImage?: string;
  featuredImageAlt?: string;
  /** The /public path the photo was imported from, for SEO keywords. */
  featuredImageOrigin?: string;
  category: PostCategory;
  products: string[];
  applications: string[];
  tags?: string[];
  /** SEO target phrases: schema keywords and the related-reading lanes. */
  keywords: string[];
  /** Words in the body, for schema.org wordCount. */
  wordCount: number;
  /** Studio's "Search result overrides". */
  seoTitle?: string;
  seoDescription?: string;
}

export interface Post extends PostMeta {
  body: PostBodyNode[];
  /** The words of the post as plain text, for the social-post generator. */
  text: string;
}

/** One post in lib/blog-index.json: the posts this deployment built. */
export interface BuiltPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  type: string;
  keywords: string[];
}

export const BUILT_POSTS = blogIndex as BuiltPost[];
const BUILT = new Set(BUILT_POSTS.map((p) => p.slug));

const TYPES = new Set<string>(FIELD_NOTE_TYPES.map((t) => t.label));

// Plain text, link addresses and photo descriptions come along so the
// product scan sees everything the old markdown scan saw.
export const META_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  readTime,
  category,
  keywords,
  tags,
  seo,
  "featured": featuredImage{ alt, "url": asset->url, "origin": select(originAsset == asset._ref => origin, asset->source.url) },
  "declaredProducts": relatedProducts[]->name,
  "applications": relatedApplications[]->name,
  "text": pt::text(body),
  "tableText": body[_type == "table"].rows[].cells[],
  "hrefs": body[].markDefs[].href,
  "alts": body[_type == "image"].alt
`;

export const BODY_FIELD = `
  body[]{
    ...,
    _type == "image" => {
      _type, _key, alt, caption,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
`;

export interface RawPost {
  _id: string;
  title?: string | null;
  slug?: string | null;
  publishedAt?: string | null;
  excerpt?: string | null;
  readTime?: string | null;
  category?: string | null;
  keywords?: (string | null)[] | null;
  tags?: (string | null)[] | null;
  seo?: { metaTitle?: string | null; metaDescription?: string | null } | null;
  featured?: { alt?: string | null; url?: string | null; origin?: string | null } | null;
  declaredProducts?: (string | null)[] | null;
  applications?: (string | null)[] | null;
  text?: string | null;
  tableText?: (string | null)[] | null;
  hrefs?: (string | null)[] | null;
  alts?: (string | null)[] | null;
}

const strings = (xs: (string | null | undefined)[] | null | undefined): string[] =>
  (xs ?? []).map((x) => (typeof x === "string" ? x.trim() : "")).filter(Boolean);

const TORONTO_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** A Studio datetime as the date a reader in Canada would put on it. */
export function postDate(iso: string): string {
  return TORONTO_DAY.format(new Date(iso));
}

function tableWords(r: RawPost): string {
  return strings(r.tableText).join(" ").replace(/\*\*/g, "");
}

/** A post as GROQ returns it (META_FIELDS) → what the pages use. */
export function toMeta(r: RawPost): PostMeta | null {
  const slug = r.slug?.trim();
  const title = r.title?.trim();
  if (!slug || !title || !r.publishedAt) return null;
  const text = r.text ?? "";
  const tables = tableWords(r);
  const words = countWords(`${text} ${tables}`);
  const excerpt = r.excerpt?.trim() ?? "";
  const declared = strings(r.declaredProducts);
  const scanned = scanProducts(title, excerpt, text, tables, ...strings(r.hrefs), ...strings(r.alts));
  const tags = strings(r.tags);
  return {
    slug,
    title,
    date: postDate(r.publishedAt),
    excerpt,
    readTime: r.readTime?.trim() || readTimeFor(words),
    featuredImage: r.featured?.url?.trim() || undefined,
    featuredImageAlt: r.featured?.alt?.trim() || undefined,
    featuredImageOrigin: r.featured?.origin?.trim() || undefined,
    category: (r.category && TYPES.has(r.category) ? r.category : inferCategory(slug, title)) as PostCategory,
    products: [...declared, ...scanned.filter((p) => !declared.includes(p))],
    applications: strings(r.applications),
    tags: tags.length ? tags : undefined,
    keywords: strings(r.keywords),
    wordCount: words,
    seoTitle: r.seo?.metaTitle?.trim() || undefined,
    seoDescription: r.seo?.metaDescription?.trim() || undefined,
  };
}

const fetchAllPosts = unstable_cache(
  async (): Promise<PostMeta[]> => {
    const raw = await sanityFetch<RawPost[]>(
      "blog posts",
      `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc, slug.current asc){${META_FIELDS}}`
    );
    return raw.map(toMeta).filter((p): p is PostMeta => p !== null);
  },
  [`blog-posts:${CACHE_VERSION}`],
  { tags: ["blog"], revalidate: 3600 }
);

const fetchPost = unstable_cache(
  async (slug: string): Promise<Post | null> => {
    const raw = await sanityFetch<(RawPost & { body?: PostBodyNode[] | null }) | null>(
      `blog post ${slug}`,
      `*[_type == "blogPost" && slug.current == $slug][0]{${META_FIELDS}, ${BODY_FIELD}}`,
      { slug }
    );
    const meta = raw ? toMeta(raw) : null;
    if (!raw || !meta) return null;
    return { ...meta, body: raw.body ?? [], text: [raw.text ?? "", tableWords(raw)].filter(Boolean).join("\n\n") };
  },
  [`blog-post:${CACHE_VERSION}`],
  { tags: ["blog"], revalidate: 3600 }
);

/** Every live post, newest first. */
export async function getAllPosts(): Promise<PostMeta[]> {
  return (await fetchAllPosts()).filter((p) => BUILT.has(p.slug));
}

/** One live post with its body, or null. */
export async function getPost(slug: string): Promise<Post | null> {
  if (!BUILT.has(slug)) return null;
  return fetchPost(slug);
}

/** Every post of one type, newest first. */
export async function getPostsByType(type: PostCategory): Promise<PostMeta[]> {
  return (await getAllPosts()).filter((p) => p.category === type);
}

/**
 * Related reading, ranked by shared intent rather than recency:
 *   3 points  a shared SEO keyword (same search intent — the strongest signal)
 *   2 points  same content type
 *   1 point   a shared product
 * Ties break to the newer post. This replaces "the next three by date",
 * which sent a reader researching stamped driveways to a bus-lane profile.
 */
export async function getRelatedPosts(post: PostMeta, limit = 3): Promise<PostMeta[]> {
  const kw = new Set(post.keywords);
  const prod = new Set(post.products);
  return (await getAllPosts())
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      for (const k of p.keywords) if (kw.has(k)) score += 3;
      if (p.category === post.category) score += 2;
      for (const x of p.products) if (prod.has(x)) score += 1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || +new Date(b.p.date) - +new Date(a.p.date))
    .slice(0, limit)
    .map((x) => x.p);
}
