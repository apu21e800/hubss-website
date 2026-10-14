import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";
import { copyStyle, galleryImageItem } from "./_shared";

/**
 * A field post: photos of a finished job, straight from a phone, with the
 * place, the system and a line of facts. Studio → From the field.
 *
 * Publishing one is all it takes: the next daily social run (14:00 UTC,
 * lib/social-pipeline.ts) writes a post per channel from it and leaves them as
 * drafts in Buffer, linked to the system's page. Nothing posts until someone
 * approves it in Buffer. The posts say only what this document says, so the
 * note is the only writing anyone does.
 *
 * Not shown on the website (yet): the photos live here and in the posts.
 */
export default defineType({
  name: "fieldPost",
  title: "Field post",
  type: "document",
  icon: ImagesIcon,

  fields: [
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      description: "1 to 10 photos of the finished job, from your phone or computer. The first one leads the posts, so put the best one first (drag to reorder). Only HUB's own photos of this job, and no faces of children.",
      of: [galleryImageItem],
      validation: (r) => [r.required().error("Add at least one photo"), r.min(1).error("Add at least one photo"), r.max(10).error("Ten photos at most")],
    }),
    defineField({
      name: "place",
      title: "Where",
      type: "string",
      description: "Town and province, spelled out, e.g. 'Brantford, Ontario'. Add the site if the client is happy to be named, e.g. 'Children's Safety Village of Brant, Brantford, Ontario'.",
      validation: (r) => [r.required().error("Say where the job is"), copyStyle(r)],
    }),
    defineField({
      name: "system",
      title: "HUB system",
      type: "reference",
      to: [{ type: "product" }],
      description: "The system on the job. The posts link to its page.",
      validation: (r) => r.required().error("Pick the system"),
    }),
    defineField({
      name: "application",
      title: "Application (optional)",
      type: "reference",
      to: [{ type: "application" }],
      description: "What kind of job it is, e.g. Crosswalks or Pedestrian Safety.",
    }),
    defineField({
      name: "note",
      title: "What was done",
      type: "text",
      rows: 3,
      description: "One or two sentences of facts in your own words: what went down and anything worth knowing (the design, the colours, the deadline). The posts say nothing that isn't here or on the system's page, so no guesses.",
      validation: (r) => [r.required().error("Write a line about the job"), r.max(600).warning("Keep it to a few sentences"), copyStyle(r)],
    }),
    defineField({
      name: "date",
      title: "When it was done",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
  ],

  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],

  preview: {
    select: { place: "place", system: "system.name", media: "photos.0", date: "date" },
    prepare: ({ place, system, media, date }) => ({
      title: [system, place].filter(Boolean).join(" in ") || "New field post",
      subtitle: date ? new Date(`${date}T12:00:00`).toLocaleDateString("en-CA") : undefined,
      media,
    }),
  },
});
