import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons";
import { richImageField } from "./_shared";

/** Matches lib/map-projects.ts shape — 59 map pins */
export default defineType({
  name: "project",
  title: "Project (Map Pin)",
  type: "document",
  icon: PinIcon,

  groups: [
    { name: "details",  title: "Details",  default: true },
    { name: "location", title: "Location" },
    { name: "media",    title: "Media" },
    { name: "related",  title: "Related" },
  ],

  fields: [
    // ── Details ──────────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Project title",
      type: "string",
      group: "details",
      description: "Descriptive project name shown in the map popup and project list (e.g. 'York Region Crosswalk Program 2023').",
      validation: (r) => r.required().error("Project title is required"),
    }),
    defineField({
      name: "year",
      title: "Year completed",
      type: "string",
      group: "details",
      description: "4-digit year the project was completed (e.g. '2024'). Leave blank if unknown.",
      validation: (r) =>
        r.custom((val) => {
          if (!val) return true;
          return /^\d{4}$/.test(val) ? true : "Year must be a 4-digit number (e.g. 2024)";
        }),
    }),
    defineField({
      name: "application",
      title: "Application type",
      type: "string",
      group: "details",
      description: "The type of surface application used (e.g. 'Crosswalks', 'Bus & Bike Lanes', 'Driveways').",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt (one line)",
      type: "text",
      rows: 2,
      group: "details",
      description: "A single sentence that summarises what was done. Shown in the map popup (e.g. 'Stamped asphalt crosswalk program across 12 intersections').",
      validation: (r) => r.max(200).warning("Keep the excerpt under 200 characters — it appears in tight spaces"),
    }),
    defineField({
      name: "problem",
      title: "Challenge / problem",
      type: "text",
      rows: 3,
      group: "details",
      description: "What problem did the client need to solve? (e.g. 'Unsafe crosswalk visibility in a high-pedestrian school zone').",
    }),
    defineField({
      name: "solution",
      title: "Solution",
      type: "text",
      rows: 3,
      group: "details",
      description: "How did HUB Surface Systems solve it? Mention the product(s) used and the outcome.",
    }),

    // ── Location ─────────────────────────────────────────────────────────────
    defineField({
      name: "city",
      title: "City",
      type: "string",
      group: "location",
      description: "City or municipality where the project is located (e.g. 'Toronto', 'Vancouver', 'Calgary').",
      validation: (r) => r.required().error("City is required for the map pin"),
    }),
    defineField({
      name: "province",
      title: "Province",
      type: "string",
      group: "location",
      description: "2-letter province or territory code (e.g. 'BC', 'ON', 'QC', 'AB').",
      validation: (r) =>
        r
          .required()
          .error("Province is required")
          .max(2)
          .error("Use the 2-letter code (e.g. BC, ON, QC)"),
    }),
    defineField({
      name: "lat",
      title: "Latitude",
      type: "number",
      group: "location",
      description: "Decimal latitude for the map pin. Use Google Maps → right-click → 'What's here?' to get coordinates (e.g. 49.2827).",
      validation: (r) =>
        r
          .required()
          .error("Latitude is required for the map pin")
          .min(-90)
          .max(90)
          .error("Latitude must be between -90 and 90"),
    }),
    defineField({
      name: "lng",
      title: "Longitude",
      type: "number",
      group: "location",
      description: "Decimal longitude for the map pin. Use Google Maps → right-click → 'What's here?' to get coordinates (e.g. -123.1207).",
      validation: (r) =>
        r
          .required()
          .error("Longitude is required for the map pin")
          .min(-180)
          .max(180)
          .error("Longitude must be between -180 and 180"),
    }),

    // ── Media ────────────────────────────────────────────────────────────────
    richImageField("image", "Project image", false, "media"),
    defineField({
      name: "imageUrl",
      title: "Image URL (legacy — read only)",
      type: "string",
      group: "media",
      readOnly: true,
      description: "Auto-populated during migration. If this shows '/images/projects/_placeholder.svg', this map pin still needs a real photo — upload one in the Image field above, then this field will clear automatically.",
    }),

    // ── Related ──────────────────────────────────────────────────────────────
    defineField({
      name: "product",
      title: "Primary product used",
      type: "reference",
      group: "related",
      description: "The main HUB Surface Systems product used on this project.",
      to: [{ type: "product" }],
    }),
  ],

  orderings: [
    { title: "City (A–Z)", name: "cityAsc", by: [{ field: "city", direction: "asc" }] },
    { title: "Province", name: "provinceAsc", by: [{ field: "province", direction: "asc" }] },
  ],

  preview: {
    select: { title: "title", city: "city", province: "province", year: "year", media: "image" },
    prepare: ({ title, city, province, year, media }) => {
      const location = city && province ? `${city}, ${province}` : city ?? province ?? "Location not set";
      const suffix   = year ? ` · ${year}` : "";
      return { title, subtitle: location + suffix, media };
    },
  },
});
