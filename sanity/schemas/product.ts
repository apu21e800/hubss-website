import { defineField, defineType } from "sanity";
import { PackageIcon } from "@sanity/icons";
import { richImageField, galleryImageItem } from "./_shared";

/** Matches lib/products.ts shape — 14 surface systems */
export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,

  groups: [
    { name: "content",  title: "Content",        default: true },
    { name: "media",    title: "Media" },
    { name: "specs",    title: "Specifications" },
    { name: "related",  title: "Related" },
    { name: "seo",      title: "SEO" },
  ],

  fields: [
    // ── Content ─────────────────────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Product name",
      type: "string",
      group: "content",
      description: "The official product name as it appears on the site (e.g. 'StreetBond', 'TrafficPatterns XD').",
      validation: (r) => r.required().error("Product name is required"),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "content",
      options: { source: "name" },
      description: "Auto-generated from the product name. Only lowercase letters, numbers, and hyphens. Do not change after the product is live.",
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
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
      group: "content",
      description: "Short category label shown above the product name (e.g. 'Concrete and Asphalt Repair', 'Thermoplastic Pavement Marking').",
    }),
    defineField({
      name: "shortDesc",
      title: "Short description (hero subheading)",
      type: "text",
      rows: 2,
      group: "content",
      description: "1–2 sentence summary shown in the hero and product cards. Keep under 160 characters for best display.",
      validation: (r) => r.max(200).warning("Short description should be under 200 characters for best display"),
    }),
    defineField({
      name: "description",
      title: "Full description",
      type: "array",
      group: "content",
      description: "Rich text body shown on the product detail page. Use headings, bullet points, and bold for scannable copy.",
      of: [{ type: "block" }],
    }),

    // ── Media ────────────────────────────────────────────────────────────────
    richImageField("heroImage", "Hero image", false, "media"),
    defineField({
      name: "heroPosition",
      title: "Hero crop position",
      type: "string",
      group: "media",
      description: "CSS object-position for fine-tuning the hero image crop. Examples: 'center 62%', 'top left', '40% center'.",
    }),
    defineField({
      name: "heroImageUrl",
      title: "Hero image URL (legacy — read only)",
      type: "string",
      group: "media",
      readOnly: true,
      hidden: ({ document }) => !!document?.heroImage,
      description: "This field has been replaced by the Hero Image above. It disappears automatically once a hero image is uploaded.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery images",
      type: "array",
      group: "media",
      description: "Product photos shown in the gallery slider on this product's page. Add alt text to every image for screen reader accessibility — describe what's in the photo. You can drag and drop to reorder.",
      of: [galleryImageItem],
    }),

    // ── Specifications ───────────────────────────────────────────────────────
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      group: "specs",
      description: "Key-value pairs shown in the product specs table (e.g. Label: 'Durability', Value: '20+ years').",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "label",
            type: "string",
            title: "Spec label",
            description: "The specification name (e.g. 'Durability', 'Application temp', 'Thickness').",
            validation: (r) => r.required().error("Spec label is required"),
          }),
          defineField({
            name: "value",
            type: "string",
            title: "Spec value",
            description: "The specification value (e.g. '20+ years', '-10°C to 50°C', '3–6 mm').",
            validation: (r) => r.required().error("Spec value is required"),
          }),
        ],
        preview: { select: { title: "label", subtitle: "value" } },
      }],
    }),

    // ── Related ──────────────────────────────────────────────────────────────
    defineField({
      name: "relatedApplications",
      title: "Related applications",
      type: "array",
      group: "related",
      description: "Applications where this product is used — shown as cross-links on the product page.",
      of: [{ type: "reference", to: [{ type: "application" }] }],
    }),
    defineField({
      name: "documents",
      title: "Product documents",
      type: "array",
      group: "related",
      description: "Spec sheets, TDS, guides, and brochures for this product. Editors can upload PDFs directly — no developer needed.",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "label",
            type: "string",
            title: "Document label",
            description: "Descriptive name shown to site visitors (e.g. 'StreetBond Technical Data Sheet').",
            validation: (r) => r.required().error("Document label is required"),
          }),
          defineField({
            name: "docType",
            type: "string",
            title: "Document type",
            description: "Category used for filtering on the Resources page.",
            options: {
              list: [
                { title: "Spec Sheet",         value: "spec" },
                { title: "Technical Data Sheet", value: "tds" },
                { title: "Colour Chart",        value: "colour" },
                { title: "Installation Guide",  value: "installation" },
                { title: "Brochure",            value: "brochure" },
                { title: "FAQ",                 value: "faq" },
                { title: "Design Guide",        value: "design" },
                { title: "Application Guide",   value: "application" },
                { title: "Certificate",         value: "certificate" },
                { title: "Other",               value: "other" },
              ],
            },
          }),
          defineField({
            name: "fileAsset",
            type: "file",
            title: "PDF file (Sanity CDN)",
            description: "Upload the PDF here. Sanity stores and serves it from cdn.sanity.io — preferred over the legacy file path. After uploading, copy the URL from the file field to verify it opens correctly.",
            options: { accept: ".pdf,application/pdf" },
          }),
          defineField({
            name: "filePath",
            type: "string",
            title: "File path (legacy)",
            description: "Fallback path served from /public/docs/ (e.g. /docs/StreetBond/StreetBond-Brochure.pdf). Keep until fileAsset is uploaded, then clear this field.",
          }),
          defineField({
            name: "lang",
            type: "string",
            title: "Language",
            description: "Leave blank for English. Enter 'FR' for French versions.",
          }),
        ],
        preview: { select: { title: "label", subtitle: "docType" } },
      }],
    }),

    // ── SEO ──────────────────────────────────────────────────────────────────
    defineField({
      name: "seo",
      title: "SEO overrides",
      type: "object",
      group: "seo",
      description: "Optional overrides for search engine metadata. Leave blank to use default values generated from the product name and description.",
      fields: [
        defineField({
          name: "title",
          type: "string",
          title: "Meta title",
          description: "Appears in browser tabs and search results. Ideal length: 50–60 characters.",
          validation: (r) => r.max(60).warning("Meta title should be under 60 characters for best display in search results"),
        }),
        defineField({
          name: "description",
          type: "text",
          title: "Meta description",
          rows: 2,
          description: "Appears in search result snippets. Ideal length: 140–160 characters.",
          validation: (r) => r.max(160).warning("Meta description should be under 160 characters for best display in search results"),
        }),
      ],
    }),
  ],

  orderings: [
    { title: "Name (A–Z)", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],

  preview: {
    select: { title: "name", subtitle: "shortDesc", media: "heroImage" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle?.slice(0, 70) ?? "No short description set",
      media,
    }),
  },
});
