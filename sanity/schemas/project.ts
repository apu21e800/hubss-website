import { defineField, defineType } from "sanity";
import { richImageField } from "./_shared";

/** Matches lib/map-projects.ts shape — 59 map pins */
export default defineType({
  name: "project",
  title: "Project (Map Pin)",
  type: "document",
  fields: [
    defineField({ name: "title",       title: "Project title", type: "string", validation: r => r.required() }),
    defineField({ name: "city",        title: "City",          type: "string", validation: r => r.required() }),
    defineField({ name: "province",    title: "Province",      type: "string", description: "2-letter code: BC, ON, QC…", validation: r => r.required() }),
    defineField({ name: "lat",         title: "Latitude",      type: "number", validation: r => r.required() }),
    defineField({ name: "lng",         title: "Longitude",     type: "number", validation: r => r.required() }),
    defineField({ name: "year",        title: "Year",          type: "string", description: "4-digit year, optional" }),
    defineField({
      name: "product",
      title: "Primary product",
      type: "reference",
      to: [{ type: "product" }],
    }),
    defineField({ name: "application", title: "Application type", type: "string", description: "e.g. Crosswalks, Bus & Bike Lanes" }),
    richImageField("image", "Project Image"),
    // Legacy string URL — kept for backward compat
    defineField({ name: "imageUrl", title: "Image URL (legacy)", type: "string", description: "Fallback path — leave blank once image asset is set" }),
    defineField({ name: "excerpt",     title: "Excerpt (one line)", type: "text", rows: 2 }),
    defineField({ name: "problem",     title: "Problem",    type: "text", rows: 3 }),
    defineField({ name: "solution",    title: "Solution",   type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "title", city: "city", province: "province", media: "image" },
    prepare: ({ title, city, province, media }) => ({ title, subtitle: `${city}, ${province}`, media }),
  },
});
