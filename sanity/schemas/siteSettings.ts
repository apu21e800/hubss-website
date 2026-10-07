import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

/** Singleton — global site settings. One document, always. */
export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,


  groups: [
    { name: "offices",   title: "Offices",   default: true },
    { name: "social",    title: "Social" },
    { name: "branding",  title: "Branding" },
    { name: "resources", title: "Resources" },
  ],

  fields: [
    // ── Offices ──────────────────────────────────────────────────────────────
    defineField({
      name: "offices",
      title: "Regional offices",
      type: "object",
      group: "offices",
      description: "Both HUB offices. Since 7 Oct 2026 these are the details the whole site prints: the footer, Contact, About, every product and application page, the Lunch & Learn card, the phone menu, the 404 page and the legal pages. Change a number here and it changes everywhere about five seconds after Publish. A blank field shows the site's own copy.",
      fields: [
        defineField({
          name: "east",
          title: "East office (Milton, ON)",
          type: "object",
          description: "Eastern Canada contact: Doug Bain covers Ontario and east.",
          fields: [
            defineField({
              name: "place",
              type: "string",
              title: "Town and province",
              description: 'As the site prints it, e.g. "Milton, Ontario".',
            }),
            defineField({
              name: "name",
              type: "string",
              title: "Contact name",
              description: "Full name of the regional contact (e.g. 'Doug Bain').",
            }),
            defineField({
              name: "phone",
              type: "string",
              title: "Phone number",
              description: "Format: 416-540-9287. Include area code, no country code needed.",
              validation: (r) =>
                r.custom((val) => {
                  if (!val) return true;
                  return /^[\d\s\-().+]+$/.test(val)
                    ? true
                    : "Enter a valid phone number (e.g. 416-540-9287)";
                }),
            }),
            defineField({
              name: "email",
              type: "string",
              title: "Email address",
              description: "Work email for the eastern office (e.g. doug.bain@hubss.com).",
              validation: (r) =>
                r.custom((val) => {
                  if (!val) return true;
                  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
                    ? true
                    : "Enter a valid email address";
                }),
            }),
          ],
        }),
        defineField({
          name: "west",
          title: "West office (Ladysmith, BC)",
          type: "object",
          description: "Western Canada contact: Cleve Stordy covers BC and west.",
          fields: [
            defineField({
              name: "place",
              type: "string",
              title: "Town and province",
              description: 'As the site prints it, e.g. "Ladysmith, British Columbia".',
            }),
            defineField({
              name: "name",
              type: "string",
              title: "Contact name",
              description: "Full name of the regional contact (e.g. 'Cleve Stordy').",
            }),
            defineField({
              name: "phone",
              type: "string",
              title: "Phone number",
              description: "Format: 604-309-8212. Include area code, no country code needed.",
              validation: (r) =>
                r.custom((val) => {
                  if (!val) return true;
                  return /^[\d\s\-().+]+$/.test(val)
                    ? true
                    : "Enter a valid phone number (e.g. 604-309-8212)";
                }),
            }),
            defineField({
              name: "email",
              type: "string",
              title: "Email address",
              description: "Work email for the western office (e.g. cleve.stordy@hubss.com).",
              validation: (r) =>
                r.custom((val) => {
                  if (!val) return true;
                  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
                    ? true
                    : "Enter a valid email address";
                }),
            }),
          ],
        }),
      ],
    }),

    // ── Social ───────────────────────────────────────────────────────────────
    defineField({
      name: "social",
      title: "Social media links",
      type: "object",
      group: "social",
      description: "Full addresses of HUB's accounts: the icons in the footer and on Contact, the Follow buttons on the homepage, and what search engines are told. A blank field shows the site's own copy.",
      fields: [
        defineField({
          name: "instagram",
          type: "url",
          title: "Instagram URL",
          description: "Full URL (e.g. https://www.instagram.com/hub_surface_systems/).",
        }),
        defineField({
          name: "linkedin",
          type: "url",
          title: "LinkedIn URL",
          description: "Full URL (e.g. https://www.linkedin.com/company/hub-surface-systems/).",
        }),
        defineField({
          name: "youtube",
          type: "url",
          title: "YouTube URL",
          description: "Full URL to the HUB YouTube channel.",
        }),
        defineField({
          name: "facebook",
          type: "url",
          title: "Facebook URL",
          description: "Full URL to the HUB Facebook page.",
        }),
        defineField({
          name: "x",
          type: "url",
          title: "X (Twitter) URL",
          description: "Full URL to the HUB X/Twitter profile.",
        }),
      ],
    }),

    // ── Branding ─────────────────────────────────────────────────────────────
    defineField({
      name: "footerTagline",
      title: "Footer tagline",
      type: "text",
      rows: 2,
      group: "branding",
      description: "The line under the HUB logo in the footer, on every page.",
      validation: (r) => r.max(120).warning("Footer tagline should be under 120 characters"),
    }),
    defineField({
      name: "foundedYear",
      title: "Founded year",
      type: "number",
      group: "branding",
      description: "Not shown on the site: \"Since 1999\" is part of the site's own wording.",
      hidden: true,
      validation: (r) =>
        r
          .min(1900)
          .max(new Date().getFullYear())
          .error("Enter a valid 4-digit year"),
    }),

    // From the May 2026 migration; nothing reads it. Declared (hidden) so
    // Studio doesn't flag Site Settings with an "unknown field" warning.
    defineField({ name: "mascotImage", title: "Mascot image", type: "image", group: "branding", hidden: true }),

    // ── Resources ────────────────────────────────────────────────────────────
    defineField({
      name: "resourceDocuments",
      title: "Resource library documents",
      type: "array",
      group: "resources",
      description: "All downloadable documents shown on the Resources page. Documents can also be attached directly to products. This list is for standalone resources not tied to a specific product.",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "id",
            type: "string",
            title: "Unique ID",
            description: "Internal identifier used by the site (e.g. 'streetbond-tds-en'). Once set, do not change: it may break saved links.",
            validation: (r) => r.required().error("ID is required"),
          }),
          defineField({
            name: "title",
            type: "string",
            title: "Document title",
            description: "The name shown to site visitors (e.g. 'StreetBond Technical Data Sheet').",
            validation: (r) => r.required().error("Document title is required"),
          }),
          defineField({
            name: "docType",
            type: "string",
            title: "Document type",
            description: "Category used for filtering on the Resources page.",
            options: {
              list: [
                { title: "Spec Sheet",          value: "spec" },
                { title: "Technical Data Sheet", value: "tds" },
                { title: "Colour Chart",         value: "colour" },
                { title: "Installation Guide",   value: "installation" },
                { title: "Brochure",             value: "brochure" },
                { title: "FAQ",                  value: "faq" },
                { title: "Design Guide",         value: "design" },
                { title: "Application Guide",    value: "application" },
                { title: "Certificate",          value: "certificate" },
                { title: "Other",                value: "other" },
              ],
            },
          }),
          defineField({
            name: "product",
            type: "string",
            title: "Product slug",
            description: "The product this document belongs to. Use the product's URL slug (e.g. 'streetbond', 'trafficpatterns'). Used for filtering.",
          }),
          defineField({
            name: "productName",
            type: "string",
            title: "Product name (display)",
            description: "Human-readable product name shown in the document list (e.g. 'StreetBond').",
          }),
          defineField({
            name: "fileAsset",
            type: "file",
            title: "PDF file (Sanity CDN)",
            description: "Upload the PDF here. Sanity stores and serves it from cdn.sanity.io (preferred over the legacy file URL). After uploading, verify the file opens correctly.",
            options: { accept: ".pdf,application/pdf" },
          }),
          defineField({
            name: "fileUrl",
            type: "string",
            title: "File path (legacy)",
            description: "Fallback path served from /public/docs/ (e.g. /docs/StreetBond/StreetBond-Brochure.pdf). Keep until fileAsset is uploaded.",
          }),
          defineField({
            name: "fileSize",
            type: "string",
            title: "File size label",
            description: "Human-readable file size shown in the document list (e.g. '1.2 MB', '345 KB').",
          }),
          defineField({
            name: "updatedDate",
            type: "string",
            title: "Last updated date",
            description: "Date this document was last updated, shown to visitors (e.g. 'May 2024').",
          }),
        ],
        preview: { select: { title: "title", subtitle: "productName" } },
      }],
    }),
  ],

  preview: { prepare: () => ({ title: "Site Settings" }) },
});
