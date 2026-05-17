import { defineField, defineType } from "sanity";

/** Matches lib/products.ts shape — 14 surface systems */
export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name",      title: "Product name",  type: "string", validation: r => r.required() }),
    defineField({ name: "slug",      title: "Slug",          type: "slug", options: { source: "name" }, validation: r => r.required() }),
    defineField({ name: "eyebrow",   title: "Eyebrow label", type: "string", description: "e.g. Concrete and Asphalt Repair" }),
    defineField({ name: "shortDesc", title: "Short description (hero subhead)", type: "text", rows: 2 }),
    defineField({
      name: "description",
      title: "Full description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({ name: "heroImage",    title: "Hero image",    type: "image", options: { hotspot: true } }),
    defineField({ name: "heroPosition", title: "Hero crop position (CSS object-position)", type: "string", description: "e.g. center 62%" }),
    defineField({ name: "gallery", title: "Gallery images", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "label", type: "string", title: "Label" }),
          defineField({ name: "value", type: "string", title: "Value" }),
        ],
        preview: { select: { title: "label", subtitle: "value" } },
      }],
    }),
    defineField({
      name: "relatedApplications",
      title: "Related applications",
      type: "array",
      of: [{ type: "reference", to: [{ type: "application" }] }],
    }),
    defineField({
      name: "documents",
      title: "Product documents",
      type: "array",
      description: "Spec sheets, TDS, guides — stored as URL paths served from /public/docs/",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "label", type: "string", title: "Document label" }),
          defineField({ name: "docType", type: "string", title: "Type", options: { list: ["spec","tds","colour","installation","brochure","faq","design","application","certificate","other"] } }),
          defineField({ name: "filePath", type: "string", title: "File path", description: 'e.g. /docs/StreetBond/StreetBond/StreetBond-Brochure.pdf' }),
          defineField({ name: "lang", type: "string", title: "Language (optional)", description: 'e.g. FR for French versions' }),
        ],
        preview: { select: { title: "label", subtitle: "docType" } },
      }],
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
