import { defineField, defineType } from "sanity";

/** Generic page — used for homepage, about, contact, lunch-learn */
export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: r => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: r => r.required() }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "heading",    type: "string", title: "Heading" }),
        defineField({ name: "subheading", type: "string", title: "Subheading" }),
        defineField({ name: "image",      type: "image",  title: "Background image", options: { hotspot: true } }),
        defineField({ name: "ctaLabel",   type: "string", title: "CTA label" }),
        defineField({ name: "ctaHref",    type: "string", title: "CTA link" }),
      ],
    }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "metaTitle",       type: "string", title: "Meta title" }),
        defineField({ name: "metaDescription", type: "text",   title: "Meta description", rows: 2 }),
        defineField({ name: "ogImage",         type: "image",  title: "OG image" }),
      ],
    }),
  ],
  preview: { select: { title: "title", slug: "slug.current" }, prepare: ({ title, slug }) => ({ title, subtitle: `/${slug}` }) },
});
