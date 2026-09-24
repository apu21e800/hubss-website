/**
 * The blog import's plan: each content/blog-archive/*.mdx post as the Sanity
 * document that makes the site show what it showed from the file. Used by
 * scripts/import-blog-to-sanity.ts (see there for the rules), and by its check.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToPortableText, type PortableNode } from "./markdown-to-portable-text";
import { sha1Of } from "./sanity-photo-upload";
import { curatedType, curatedKeywords, FIELD_NOTE_TYPES } from "../../lib/field-notes-taxonomy";
import { countMarkdownWords, inferCategory, readTimeFor, scanProducts } from "../../lib/blog-taxonomy";

export const SOURCE_DIR = path.join(process.cwd(), "content", "blog-archive");

// ─── The plan: every post as the site showed it ──────────────────────────────

export interface Planned {
  slug: string;
  file: string;
  date: string;              // YYYY-MM-DD
  publishedAt: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  keywords: string[];
  products: string[];        // names, in the order the site listed them
  applications: string[];    // as the file typed them: a name or a slug
  tags: string[];
  featured: { src: string; alt: string };
  blocks: PortableNode[];
  images: string[];          // every /public photo the post needs
}

const TYPES = new Set<string>(FIELD_NOTE_TYPES.map((t) => t.label));

function dateOf(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(s)) throw new Error(`unreadable date "${s}"`);
  return s.slice(0, 10);
}

export function plan(dir = SOURCE_DIR): Planned[] {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).sort();
  const posts: Planned[] = [];
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    if (data.draft === true) continue;              // the site never showed drafts
    const title = String(data.title ?? "").trim();
    const excerpt = String(data.excerpt ?? "").trim();
    if (!title) throw new Error(`${file}: no title`);
    const { blocks, images } = markdownToPortableText(content, "k");

    // Exactly what lib/mdx.ts worked out for the page.
    const category = curatedType(slug) ?? (typeof data.category === "string" && TYPES.has(data.category) ? data.category : undefined) ?? inferCategory(slug, title);
    const declared: string[] = Array.isArray(data.products) ? data.products.map(String) : [];
    const scanned = scanProducts(title, excerpt, content);
    const featuredSrc = String(data.featuredImage ?? "").trim();
    if (!featuredSrc.startsWith("/")) throw new Error(`${file}: featuredImage must be a /public path, got "${featuredSrc}"`);
    for (const img of images) {
      if (!img.src.startsWith("/")) throw new Error(`${file}: photo "${img.src}" is not a /public path`);
      if (!img.alt) throw new Error(`${file}: photo ${img.src} has no alt text`);
    }

    posts.push({
      slug,
      file,
      date: dateOf(data.date),
      publishedAt: "",
      title,
      excerpt,
      readTime: typeof data.readTime === "string" && data.readTime.trim() ? data.readTime.trim() : readTimeFor(countMarkdownWords(content)),
      category,
      keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : curatedKeywords(slug),
      products: [...declared, ...scanned.filter((p) => !declared.includes(p))],
      applications: Array.isArray(data.applications) ? data.applications.map(String) : [],
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      // The page's hero used the post title as its alt text; so does the import.
      featured: { src: featuredSrc, alt: title },
      blocks,
      images: [featuredSrc, ...images.map((i) => i.src)],
    });
  }

  // The order /blog listed them in: newest first, then by file name. Noon UTC,
  // one minute earlier for each later post on the same day.
  posts.sort((a, b) => (a.date === b.date ? (a.file < b.file ? -1 : 1) : a.date < b.date ? 1 : -1));
  let day = "", n = 0;
  for (const p of posts) {
    n = p.date === day ? n + 1 : 0;
    day = p.date;
    p.publishedAt = new Date(Date.parse(`${p.date}T12:00:00.000Z`) - n * 60_000).toISOString();
  }
  return posts;
}

// ─── Building a document ─────────────────────────────────────────────────────

const ref = (id: string, key?: string) => ({ ...(key ? { _key: key } : {}), _type: "reference", _ref: id });

export function toDocument(p: Planned, docId: string, assetBySha: Map<string, string>, productIds: Map<string, string>, applicationIds: Map<string, string>, keepSeo: unknown) {
  const assetFor = (src: string) => {
    const id = assetBySha.get(sha1Of(src));
    if (!id) throw new Error(`${p.slug}: ${src} was not uploaded`);
    return id;
  };
  const body = p.blocks.map((b) => {
    if (b._type !== "image") return b;
    return {
      _type: "image",
      _key: b._key,
      asset: ref(assetFor(b.src)),
      alt: b.alt,
      ...(b.caption ? { caption: b.caption } : {}),
    };
  });
  return {
    _id: docId,
    _type: "blogPost",
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    category: p.category,
    publishedAt: p.publishedAt,
    excerpt: p.excerpt,
    body,
    readTime: p.readTime,
    featuredImage: { _type: "image", asset: ref(assetFor(p.featured.src)), alt: p.featured.alt },
    keywords: p.keywords,
    relatedProducts: p.products.map((name) => ref(productIds.get(name)!, `p-${name.toLowerCase()}`)),
    relatedApplications: p.applications.map((a) => ref(applicationIds.get(a.toLowerCase())!, `a-${a.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)),
    ...(p.tags.length ? { tags: p.tags } : {}),
    ...(keepSeo ? { seo: keepSeo } : {}),
  };
}

