import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content/blog");

export type PostCategory = "Blog" | "Case Study" | "Project Profile" | "White Paper";

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
  draft?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

// ── Taxonomy inference ────────────────────────────────────────

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

const BLOG_TITLE_SIGNALS = [
  /^why /i, /^how /i, /^what /i, /^when /i, /^understanding/i,
  /\bguide\b/i, /\boverview\b/i, /\bvs\b/i, /\boutperforms\b/i,
  /\bstrengthening\b/i, /\belevating\b/i, /\benhancing\b/i,
  /solutions for streets/i, /white paper/i,
];

function inferCategory(slug: string, title: string, excerpt: string): PostCategory {
  // White papers
  if (/white.paper/i.test(title) || slug.startsWith("white-paper") || slug === "transportation-infrastructure-guide") {
    return "White Paper";
  }
  // Explicit case studies
  if (/case study/i.test(title)) {
    return "Case Study";
  }
  // Generic blog signals in title
  if (BLOG_TITLE_SIGNALS.some((re) => re.test(title))) {
    return "Blog";
  }
  // General informational posts (by slug/excerpt patterns)
  const blogSlugs = new Set([
    "best-crosswalks-canada", "decorative-asphalt-crosswalks",
    "decorative-crosswalks-community-identity", "decorative-hardscape-grey-is-new-black",
    "decorative-paving-solutions", "pedestrian-safety-solutions",
    "performance-crosswalks-asphalt-concrete", "keeping-pedestrians-safe",
  ]);
  if (blogSlugs.has(slug)) return "Blog";

  // Everything else: specific project showcases
  return "Project Profile";
}

function inferProducts(title: string, excerpt: string): string[] {
  const haystack = title + " " + excerpt;
  const found: string[] = [];
  for (const [name, re] of PRODUCT_PATTERNS) {
    if (re.test(haystack) && !found.includes(name)) {
      found.push(name);
    }
  }
  return found;
}

// ── Public API ────────────────────────────────────────────────

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(contentDir)) return [];
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
      const { data } = matter(raw);
      const slug = file.replace(".mdx", "");
      const title = data.title as string;
      const excerpt = (data.excerpt as string) || "";
      return {
        slug,
        title,
        date: data.date as string,
        excerpt,
        readTime: data.readTime as string,
        featuredImage: (data.featuredImage as string) || undefined,
        category: (data.category as PostCategory) || inferCategory(slug, title, excerpt),
        products: (data.products as string[]) || inferProducts(title, excerpt),
        applications: (data.applications as string[]) || [],
        draft: (data.draft as boolean) || false,
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post {
  const file = path.join(contentDir, `${slug}.mdx`);
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  const title = data.title as string;
  const excerpt = (data.excerpt as string) || "";
  return {
    slug,
    title,
    date: data.date as string,
    excerpt,
    readTime: data.readTime as string,
    featuredImage: (data.featuredImage as string) || undefined,
    category: (data.category as PostCategory) || inferCategory(slug, title, excerpt),
    products: (data.products as string[]) || inferProducts(title, excerpt),
    applications: (data.applications as string[]) || [],
    content,
  };
}
