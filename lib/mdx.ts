import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  curatedType,
  curatedKeywords,
  type FieldNoteType,
} from "./field-notes-taxonomy";

const contentDir = path.join(process.cwd(), "content/blog");

/**
 * Field Notes content types (Aug 2026). "Guide" joined the set when the
 * library was re-classified — a third of the posts are decision-support
 * documents that were previously being filed as generic "Blog", which
 * buried the exact content a specifier is hunting for.
 */
export type PostCategory = FieldNoteType;

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  featuredImage?: string;
  category: PostCategory;
  products: string[];
  applications: string[];
  tags?: string[];
  /** SEO target phrases — schema keywords + related-reading lanes. */
  keywords: string[];
  /** Body word count, for schema.org wordCount and read-time sanity. */
  wordCount: number;
  draft?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

// ── Taxonomy inference ────────────────────────────────
// Only reached by posts that are NOT in lib/field-notes-taxonomy.ts — i.e.
// newly added .mdx files. The curated map is the source of truth for the
// existing library; this keeps a sensible default so a new file is never
// uncategorised.

const PRODUCT_PATTERNS: [string, RegExp][] = [
  ["TrafficPatternsXD", /TrafficPatternsXD|TrafficPatterns ?XD/i],
  ["TrafficPatterns",   /TrafficPatterns(?!XD)/i],
  ["StreetBond",        /StreetBond/i],
  ["StreetPrint",       /StreetPrint/i],
  ["MMAX",              /\bMMAX\b/i],
  ["DecoMark",          /DecoMark/i],
  ["DuraTherm",         /DuraTherm/i],
  ["DuraShield",        /DuraShield/i],
  ["PreMark",           /PreMark/i],
  ["AirMark",           /AirMark/i],
];

const GUIDE_TITLE_SIGNALS = [
  /^why /i, /^how /i, /^what /i, /^when /i, /^understanding/i,
  /\bguide\b/i, /\bvs\.? /i, /\boutperforms\b/i, /\bchoosing\b/i,
  /\bspecify/i, /\bcomparison\b/i,
];

function inferCategory(slug: string, title: string): PostCategory {
  if (/white.paper/i.test(title) || slug.startsWith("white-paper")) {
    return "White Paper";
  }
  if (/case study/i.test(title)) {
    return "Case Study";
  }
  if (GUIDE_TITLE_SIGNALS.some((re) => re.test(title))) {
    return "Guide";
  }
  return "Project Profile";
}

/**
 * Products actually discussed in the post — scanned across the whole body,
 * not just title + excerpt. This is what drives the "Systems in this piece"
 * block and the schema `mentions` graph, so it needs to be complete: a case
 * study that names MMAX four times in the body but not in its excerpt was
 * previously linking to nothing.
 */
function scanProducts(title: string, excerpt: string, body: string): string[] {
  const haystack = `${title} ${excerpt} ${body}`;
  const found: string[] = [];
  for (const [name, re] of PRODUCT_PATTERNS) {
    if (re.test(haystack) && !found.includes(name)) found.push(name);
  }
  return found;
}

/** Body word count with MDX comments and image syntax stripped. */
function countWords(body: string): number {
  const clean = body
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/<[^>]+>/g, " ");
  return clean.split(/\s+/).filter(Boolean).length;
}

// ── Public API ─────────────────────────────────────────

function build(slug: string, data: Record<string, unknown>, content: string): PostMeta {
  const title = data.title as string;
  const excerpt = (data.excerpt as string) || "";
  // Precedence: curated taxonomy → frontmatter → inference.
  //
  // The curated map deliberately outranks frontmatter. Six posts carried
  // `category: "Blog"` from the era when "Blog" was the only value anyone
  // typed — including the stamped-driveway comparison and the Vision Zero
  // specification piece, which are the highest-intent Guides in the library.
  // Honouring that stale default would bury exactly the content a specifier
  // is searching for. Frontmatter still governs any post NOT in the map, so
  // a newly authored .mdx can declare its own type and be believed.
  const category =
    curatedType(slug) ?? (data.category as PostCategory) ?? inferCategory(slug, title);
  const products =
    (data.products as string[]) ?? scanProducts(title, excerpt, content);
  return {
    slug,
    title,
    date: data.date as string,
    excerpt,
    readTime: (data.readTime as string) || `${Math.max(1, Math.round(countWords(content) / 225))} min read`,
    featuredImage: (data.featuredImage as string) || undefined,
    category,
    products,
    applications: (data.applications as string[]) || [],
    tags: (data.tags as string[]) || undefined,
    keywords: (data.keywords as string[]) ?? curatedKeywords(slug),
    wordCount: countWords(content),
    draft: (data.draft as boolean) || false,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(contentDir)) return [];
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
      const { data, content } = matter(raw);
      return build(file.replace(".mdx", ""), data, content);
    })
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post {
  const file = path.join(contentDir, `${slug}.mdx`);
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  return { ...build(slug, data, content), content };
}

/** Every post of one type, newest first. */
export function getPostsByType(type: PostCategory): PostMeta[] {
  return getAllPosts().filter((p) => p.category === type);
}

/**
 * Related reading, ranked by shared intent rather than recency:
 *   3 points  a shared SEO keyword (same search intent — the strongest signal)
 *   2 points  same content type
 *   1 point   a shared product
 * Ties break to the newer post. This replaces "the next three by date",
 * which sent a reader researching stamped driveways to a bus-lane profile.
 */
export function getRelatedPosts(post: PostMeta, limit = 3): PostMeta[] {
  const kw = new Set(post.keywords);
  const prod = new Set(post.products);
  return getAllPosts()
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
