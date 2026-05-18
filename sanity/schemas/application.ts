import { defineField, defineType } from "sanity";
import { BlockContentIcon } from "@sanity/icons";
import { richImageField, galleryImageItem } from "./_shared";

/** Matches lib/applications.ts shape — 20+ application types */
export default defineType({
  name: "application",
  title: "Application",
  type: "document",
  icon: BlockContentIcon,

  groups: [
    { name: "content",  title: "Content",  default: true },
    { name: "media",    title: "Media" },
    { name: "related",  title: "Related" },
    { name: "seo",      title: "SEO" },
  ],

  fields: [
    // ── Content ─────────────────────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Application name",
      type: "string",
      group: "content",
      description: "The application type as it appears on the site (e.g. 'Crosswalks', 'Bus & Bike Lanes', 'Public Art').",
      validation: (r) => r.required().error("Application name is required"),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "content",
      options: { source: "name" },
      description: "Auto-generated from the name. Only lowercase letters, numbers, and hyphens. Do not change after the application is live.",
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
      name: "shortDesc",
      title: "Short description",
      type: "text",
      rows: 2,
      group: "content",
      description: "1–2 sentence summary shown in application cards and the hero subheading. Keep under 160 characters.",
      validation: (r) => r.max(200).warning("Short description should be under 200 characters for best display"),
    }),
    defineField({
      name: "description",
      title: "Full description",
      type: "array",
      group: "content",
      description: "Rich text body shown on the application detail page.",
      of: [{ type: "block" }],
    }),

    // ── Media ────────────────────────────────────────────────────────────────
    richImageField("heroImage", "Hero image", false, "media"),
    defineField({
      name: "heroImageUrl",
      title: "Hero image URL (legacy)",
      type: "string",
      group: "media",
      description: "Legacy fallback path served from /public/images/ (e.g. /images/applications/crosswalks/hero.jpg). Leave blank once heroImage is set in Sanity.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery images",
      type: "array",
      group: "media",
      description: "Project photos showcasing this application type. Add alt text to every image for accessibility (AODA).",
      of: [galleryImageItem],
    }),

    // ── Related ──────────────────────────────────────────────────────────────
    defineField({
      name: "relatedProducts",
      title: "Related products",
      type: "array",
      group: "related",
      description: "Products used in this application — shown as cross-links on the application page.",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),

    // ── SEO ──────────────────────────────────────────────────────────────────
    defineField({
      name: "seo",
      title: "SEO overrides",
      type: "object",
      group: "seo",
      description: "Optional overrides for search engine metadata. Leave blank to use defaults generated from the application name and description.",
      fields: [
        defineField({
          name: "title",
          type: "string",
          title: "Meta title",
          description: "Appears in browser tabs and search results. Ideal: 50–60 characters.",
          validation: (r) => r.max(60).warning("Meta title should be under 60 characters"),
        }),
        defineField({
          name: "description",
          type: "text",
          title: "Meta description",
          rows: 2,
          description: "Appears in search result snippets. Ideal: 140–160 characters.",
          validation: (r) => r.max(160).warning("Meta description should be under 160 characters"),
        }),
      ],
    }),
  ],

  preview: {
    select: { title: "name", subtitle: "shortDesc", media: "heroImage" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle?.slice(0, 60) ?? "No description",
      media,
    }),
  },
});
