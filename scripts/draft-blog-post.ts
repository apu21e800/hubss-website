/**
 * `npx tsx scripts/draft-blog-post.ts <file.md> [--dry-run]`: a blog post
 * written as markdown (content/drafts/*.md) becomes an UNPUBLISHED draft in
 * Studio → Blog posts, with its cover photo. A person reads it there and
 * presses Publish; the first Publish dates it (sanity.config.ts), and the next
 * daily social run drafts its posts in Buffer for approval. 16 Oct 2026, for
 * the Product Book's launch post.
 *
 * Runs on Vern's PC (Sanity writes need SANITY_API_WRITE_TOKEN in .env.local).
 * --dry-run needs no token: it prints the document and the style check.
 * Never overwrites: if the draft or a published post already has the slug, it
 * stops and says so (edit that one in Studio instead).
 *
 * The file: front matter (title, slug, category as stored: Blog prints as
 * Article; excerpt; keywords; cover, a path in the repo; coverAlt), then the
 * body in markdown. The body goes through the same converter as the AI
 * drafter's drafts (lib/markdown-to-portable-text.ts) and the same style
 * check (lib/style-lint.ts): em dashes and the other machine tells stop it.
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { config as loadDotenv } from "dotenv";
import { markdownToPortableText } from "../lib/markdown-to-portable-text";
import { describeIssue, flagSentences } from "../lib/style-lint";
import { FIELD_NOTE_TYPES } from "../lib/field-notes-taxonomy";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadDotenv({ path: path.join(ROOT, ".env.local") });

const DRY = process.argv.includes("--dry-run");
const file = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!file) {
  console.error("Usage: npx tsx scripts/draft-blog-post.ts <file.md> [--dry-run]");
  process.exit(1);
}

const { data, content } = matter(readFileSync(path.resolve(ROOT, file), "utf8"));
const need = ["title", "slug", "category", "excerpt"] as const;
for (const k of need) if (!data[k]) { console.error(`Front matter is missing "${k}".`); process.exit(1); }
if (!FIELD_NOTE_TYPES.some((t) => t.label === data.category)) {
  console.error(`category "${data.category}" isn't one of: ${FIELD_NOTE_TYPES.map((t) => t.label).join(", ")}`);
  process.exit(1);
}

// The house style, as the drafter's pass checks it.
const style = [
  ...flagSentences(String(data.title), { headings: "whole" }),
  ...flagSentences(String(data.excerpt)),
  ...flagSentences(content, { headings: "markdown" }),
];
if (style.length) {
  console.error("House style problems (fix the file and run again):");
  for (const f of style) console.error(`- "${f.text}": ${f.issues.map(describeIssue).join("; ")}`);
  process.exit(1);
}

const { blocks } = markdownToPortableText(content, "k");
const body = blocks.filter((b) => b._type !== "image");
const slug = String(data.slug);
const doc = {
  _id: `drafts.blogpost-${slug}`,
  _type: "blogPost",
  title: String(data.title).trim(),
  slug: { _type: "slug", current: slug },
  category: data.category,
  publishedAt: new Date().toISOString(),
  excerpt: String(data.excerpt).trim(),
  body,
  keywords: Array.isArray(data.keywords) ? data.keywords.slice(0, 6) : [],
  editorNotes: [
    `Written by Claude on ${new Date().toISOString().slice(0, 10)} from ${file}. Not on the site until someone presses Publish.`,
    "Every statement is from the Product Portfolio Book or the site's own pages; the links are the site's.",
    "Publishing dates it that day, and the next morning's social run drafts its posts in Buffer for approval.",
  ].join("\n"),
};

async function main() {
  console.log(`${doc.title}\n/blog/${slug} · ${body.length} blocks · style check clean`);
  if (DRY) {
    console.log(JSON.stringify({ ...doc, body: `(${body.length} blocks)` }, null, 2));
    console.log("\n(dry run: nothing written)");
    return;
  }
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) { console.error("SANITY_API_WRITE_TOKEN missing from .env.local."); process.exit(1); }
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "9dbro2m1",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2024-01-01",
    useCdn: false,
    token,
  });
  const taken = await client.fetch<string[]>(`*[_type == "blogPost" && slug.current == $slug]._id`, { slug });
  if (taken.length) {
    console.error(`Stopped: /blog/${slug} already exists in Studio (${taken.join(", ")}). Edit it there.`);
    process.exit(1);
  }
  let featuredImage: Record<string, unknown> | undefined;
  if (data.cover) {
    const coverPath = path.resolve(ROOT, String(data.cover));
    if (!existsSync(coverPath)) { console.error(`Cover not found: ${data.cover}`); process.exit(1); }
    const asset = await client.assets.upload("image", createReadStream(coverPath), { filename: path.basename(coverPath) });
    featuredImage = { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt: String(data.coverAlt ?? doc.title) };
  }
  await client.create({ ...doc, ...(featuredImage ? { featuredImage } : {}) });
  console.log(`Draft saved. Studio → Blog posts → "${doc.title}": read it, then Publish.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
