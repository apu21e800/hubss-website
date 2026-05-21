import { defineField, defineType } from "sanity";
import { EditIcon } from "@sanity/icons";
import { richImageField } from "./_shared";

/** Matches content/blog/*.mdx frontmatter shape */
export default defineType({
  name: "blogPost",
  title: "Blog Post / Field Note",
  type: "document",
  icon: EditIcon,

  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media",   title: "Media" },
    { name: "meta",    title: "Meta & SEO" },
  ],

  fields: [
    // ── Content ─────────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Post title",
      type: "string",
      group: "content",
      description: "The article headline shown on the blog card and at the top of the post. Keep it punchy — ideally under 70 characters.",
      validation: (r) => r.required().error("Post title is required"),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "content",
      options: { source: "title" },
      description: "Auto-generated from the title. Only lowercase letters, numbers, and hyphens. Do not change after the post is published.",
      validation: (r) =>
        r
          .required()
          .error("Slug is required")
          .custom((slug) => {
            if (!slug?.current) return true;
            return /^[a-z0-9-]+$/.test(slug.current)
              ? true
              : "Slug must only contain lowercase letters, numbers, and hyphens";
          }),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      group: "content",
      description: "The date this post was (or will be) published. Posts with a future date are still visible in Studio — the site displays them based on this date.",
      validation: (r) => r.required().error("Publish date is required"),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "2–3 sentence summary shown in the blog card and used as the default meta description. Keep under 200 characters.",
      validation: (r) => r.max(300).warning("Excerpt should be concise — under 300 characters"),
    }),
    defineField({
      name: "readTime",
      title: "Read time",
      type: "string",
      group: "content",
      description: "Estimated reading time shown on the blog card (e.g. '4 min read', '7 min read').",
    }),
    defineField({
      name: "body",
      title: "Body content",
      type: "array",
      group: "content",
      description: "The full article body. Use the toolbar to add headings, lists, links, and inline images.",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),

    // ── Media ────────────────────────────────────────────────────────────────
    richImageField("featuredImage", "Featured image", false, "media"),
    defineField({
      name: "featuredImageUrl",
      title: "Featured image URL (legacy)",
      type: "string",
      group: "media",
      description: "Legacy fallback path from MDX frontmatter. Leave blank once featuredImage asset is set in Sanity.",
    }),

    // ── Meta & SEO ───────────────────────────────────────────────────────────
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      description: "Topic tags for filtering posts. Press Enter or comma to add each tag (e.g. 'crosswalks', 'municipalities', 'Vision Zero').",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "relatedProducts",
      title: "Related products",
      type: "array",
      group: "meta",
      description: "Products mentioned or featured in this post — shown as cross-links at the bottom of the article.",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "seo",
      title: "SEO overrides",
      type: "object",
      group: "meta",
      description: "Optional overrides for search engine metadata. Leave blank to use the post title and excerpt.",
      fields: [
        defineField({
          name: "metaTitle",
          type: "string",
          title: "Meta title",
          description: "Appears in browser tabs and search results. Ideal: 50–60 characters.",
          validation: (r) => r.max(60).warning("Meta title should be under 60 characters"),
        }),
        defineField({
          name: "metaDescription",
          type: "text",
          title: "Meta description",
          rows: 2,
          description: "Appears in search result snippets. Ideal: 140–160 characters.",
          validation: (r) => r.max(160).warning("Meta description should be under 160 characters"),
        }),
      ],
    }),
  ],

  orderings: [
    { title: "Published, newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],

  preview: {
    select: { title: "title", publishedAt: "publishedAt", media: "featuredImage" },
    prepare: ({ title, publishedAt, media }) => ({
      title,
      subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString("en-CA") : "Draft — not yet published",
      media,
    }),
  },
});
