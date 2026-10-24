import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";
import { copyStyle, galleryImageItem } from "./_shared";

/**
 * A field post: photos of a finished job, straight from a phone, with the
 * place, the system and a line of facts. Studio → Job photos for social
 * ("From the field" until 15 Oct 2026).
 *
 * Publishing one is all it takes: the next daily run (14:00 UTC,
 * lib/social-pipeline.ts) writes a post per channel from it for Buffer,
 * linked to the system's page. The posts say only what this document says, so
 * the note is the only writing anyone does.
 *
 * With the story filled in (`writeUp`, since 19 Oct 2026; Vern, 17 Oct: "Doug
 * adds photos and basic project information, it becomes a blog post, queues
 * for the blog and posts to social"), the same daily run also writes a
 * Projects article from it (lib/project-posts.ts), scheduled to go on the
 * site two days later unless someone holds it, and the article's own social
 * posts follow the day it is live. The photos alone then make no separate
 * social post: the job goes out once, as the article.
 *
 * Not shown on the website (yet): the photos live here and in the posts.
 */
export default defineType({
  name: "fieldPost",
  title: "Job photos",
  description: "Photos of a finished job. Publish it and it goes out on social the next morning. Add the story and 21e8 writes the job up as a Projects article for the website as well. The post itself is not shown on the website.",
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
      description: "Town and province, spelled out, e.g. 'Brantford, Ontario'. Add the site if the client is happy to be named, e.g. 'Children's Safety Village of Brant, Brantford, Ontario'. No street address, phone number or email.",
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
    defineField({
      name: "writeUp",
      title: "The story, for a Projects article (optional)",
      type: "text",
      rows: 8,
      description:
        "Leave this empty and the photos go to social only. Fill it in and 21e8 writes the job up as a Projects article for the website, checks it and schedules it: it is on hubss.com within a few working days, and its social posts follow. A few sentences or a list, in your own words: who the client was (if they can be named), what they needed, what went in and when, who installed it, anything about the design or the colours, and how it has held up. The article says nothing that isn't here, in the line above or on the system's page, so no guesses and no figures you aren't sure of. Leave out customers' phone numbers, emails and home addresses. A homeowner isn't named in the article, only the town.",
      validation: (r) => [r.max(4000).warning("That is a lot: a few sentences or a short list is enough"), copyStyle(r)],
    }),
    defineField({
      name: "article",
      title: "The article written from this",
      type: "reference",
      to: [{ type: "blogPost" }],
      weak: true,
      readOnly: true,
      description: "The Projects article written from this post, once it exists. Open it in Blog posts.",
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
