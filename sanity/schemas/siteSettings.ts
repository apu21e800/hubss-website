import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

/** Singleton — global site settings. One document, always. */
export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,

  // Prevent creating more than one instance
  __experimental_actions: ["update", "publish"],

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
      description: "Contact details for both HUB offices — shown on the Contact page and in the footer.",
      fields: [
        defineField({
          name: "east",
          title: "East office (Milton, ON)",
          type: "object",
          description: "Eastern Canada contact — Doug Bain covers Ontario and east.",
          fields: [
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
          description: "Western Canada contact — Cleve Stordy covers BC and west.",
          fields: [
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
      description: "Full URLs for HUB's social media profiles — shown in the footer and contact page.",
      fields: [
        defineField({
          name: "instagram",
          type: "url",
          title: "Instagram URL",
          description: "Full URL (e.g. https://www.instagram.com/hubsurfacesystems/).",
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
      description: "Short tagline shown in the site footer below the HUB logo (e.g. 'Redefining hardscapes across Canada.').",
      validation: (r) => r.max(120).warning("Footer tagline should be under 120 characters"),
    }),
    defineField({
      name: "foundedYear",
      title: "Founded year",
      type: "number",
      group: "branding",
      description: "The year HUB Surface Systems was founded. Currently: 1999. Used in the footer copyright and 'years of experience' counter.",
      validation: (r) =>
        r
          .min(1900)
          .max(new Date().getFullYear())
          .error("Enter a valid 4-digit year"),
    }),

    // ── Resources ────────────────────────────────────────────────────────────
    defineField({
      name: "resourceDocuments",
      title: "Resource library documents",
      type: "array",
      group: "resources",
      description: "All downloadable documents shown on the Resources page. Documents can also be attached directly to products — this list is for standalone resources not tied to a specific product.",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "id",
            type: "string",
            title: "Unique ID",
            description: "Internal identifier used by the site (e.g. 'streetbond-tds-en'). Once set, do not change — it may break saved links.",
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
            description: "The product this document belongs to — use the product's URL slug (e.g. 'streetbond', 'trafficpatterns'). Used for filtering.",
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
            description: "Upload the PDF here — Sanity stores and serves it from cdn.sanity.io. Preferred over the legacy file URL. After uploading, verify the file opens correctly.",
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
            description: "Date this document was last updated — shown to visitors (e.g. 'May 2024').",
          }),
        ],
        preview: { select: { title: "title", subtitle: "productName" } },
      }],
    }),
  ],

  preview: { prepare: () => ({ title: "Site Settings" }) },
});
