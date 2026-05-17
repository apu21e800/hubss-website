import { defineField, defineType } from "sanity";

/** Matches content/blog/*.mdx frontmatter shape */
export default defineType({
  name: "blogPost",
  title: "Blog Post / Field Note",
  type: "document",
  fields: [
    defineField({ name: "title",       title: "Title",     type: "string", validation: r => r.required() }),
    defineField({ name: "slug",        title: "Slug",      type: "slug", options: { source: "title" }, validation: r => r.required() }),
    defineField({ name: "publishedAt", title: "Published", type: "datetime", validation: r => r.required() }),
    defineField({ name: "excerpt",     title: "Excerpt",   type: "text", rows: 3 }),
    defineField({ name: "readTime",    title: "Read time", type: "string", description: "e.g. 4 min read" }),
    defineField({ name: "featuredImage", title: "Featured image", type: "image", options: { hotspot: true } }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "relatedProducts",
      title: "Related products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "metaTitle",       type: "string", title: "Meta title" }),
        defineField({ name: "metaDescription", type: "text",   title: "Meta description", rows: 2 }),
      ],
    }),
  ],
  orderings: [{ title: "Published, newest", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", publishedAt: "publishedAt", media: "featuredImage" },
    prepare: ({ title, publishedAt, media }) => ({
      title,
      subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString("en-CA") : "Draft",
      media,
    }),
  },
});
