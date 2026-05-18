import { defineField, defineType } from "sanity";
import { richImageField } from "./_shared";

/** Matches lib/applications.ts shape — 20+ application types */
export default defineType({
  name: "application",
  title: "Application",
  type: "document",
  fields: [
    defineField({ name: "name",      title: "Application name", type: "string", validation: r => r.required() }),
    defineField({ name: "slug",      title: "Slug",             type: "slug", options: { source: "name" }, validation: r => r.required() }),
    defineField({ name: "shortDesc", title: "Short description", type: "text", rows: 2 }),
    defineField({ name: "description", title: "Full description", type: "array", of: [{ type: "block" }] }),
    richImageField("heroImage", "Hero Image"),
    // Legacy string URL — kept for backward compat until all images are in Sanity CDN
    defineField({ name: "heroImageUrl", title: "Hero image URL (legacy)", type: "string", description: "Fallback path — leave blank once heroImage asset is set" }),
    defineField({ name: "gallery",   title: "Gallery images", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({
      name: "relatedProducts",
      title: "Related products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "seo",
      title: "SEO overrides",
      type: "object",
      fields: [
        defineField({ name: "title",       type: "string", title: "Meta title" }),
        defineField({ name: "description", type: "text",   title: "Meta description", rows: 2 }),
      ],
    }),
  ],
  preview: { select: { title: "name", media: "heroImage" } },
});
