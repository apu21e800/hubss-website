import { defineField, defineType } from "sanity";

/** Singleton — global site settings. One document, always. */
export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Prevent creating more than one instance
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "offices",
      title: "Regional offices",
      type: "object",
      fields: [
        defineField({
          name: "east",
          title: "East office (Milton, ON)",
          type: "object",
          fields: [
            defineField({ name: "phone", type: "string", title: "Phone" }),
            defineField({ name: "email", type: "string", title: "Email" }),
            defineField({ name: "name",  type: "string", title: "Contact name" }),
          ],
        }),
        defineField({
          name: "west",
          title: "West office (Ladysmith, BC)",
          type: "object",
          fields: [
            defineField({ name: "phone", type: "string", title: "Phone" }),
            defineField({ name: "email", type: "string", title: "Email" }),
            defineField({ name: "name",  type: "string", title: "Contact name" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "social",
      title: "Social media handles",
      type: "object",
      fields: [
        defineField({ name: "instagram", type: "url", title: "Instagram URL" }),
        defineField({ name: "linkedin",  type: "url", title: "LinkedIn URL" }),
        defineField({ name: "youtube",   type: "url", title: "YouTube URL" }),
        defineField({ name: "facebook",  type: "url", title: "Facebook URL" }),
        defineField({ name: "x",         type: "url", title: "X (Twitter) URL" }),
      ],
    }),
    defineField({ name: "footerTagline", title: "Footer tagline", type: "text", rows: 2 }),
    defineField({ name: "foundedYear",   title: "Founded year",   type: "number", description: "Currently: 1999" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
