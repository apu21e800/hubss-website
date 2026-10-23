import { defineArrayMember, defineField, defineType } from "sanity";
import { ShareIcon } from "@sanity/icons";

/**
 * What the daily social drafter did for one Insights article, field post or
 * library item
 * (lib/social-pipeline.ts, run by app/api/cron/social-drafts): the drafts it
 * left in Buffer, the channels it skipped, and the style check on the copy.
 *
 * The pipeline writes these; Studio only shows them, so Doug can see the
 * style check next to the drafts he is about to approve in Buffer (the posts
 * themselves live in Buffer, not here). The document's existence is also
 * what stops the next run drafting the same article again: deleting one has
 * that article redrafted.
 */
export default defineType({
  name: "socialLog",
  // "Sent to Buffer" in Studio since 15 Oct 2026 ("Social drafts" before).
  title: "Sent to Buffer",
  type: "document",
  icon: ShareIcon,
  readOnly: true,

  fields: [
    defineField({ name: "title", title: "Drafted from", type: "string" }),
    defineField({
      name: "source",
      title: "Stream",
      type: "string",
      description: "Article (a new blog post), From the field (a Job photos post) or From the library (a documented job or a Product Portfolio Book spread).",
    }),
    defineField({
      name: "styleCheck",
      title: "Style check",
      type: "text",
      rows: 6,
      description: "Sentences in the Buffer drafts that still have an em dash or another break from the house style after 21e8's rewrite. Fix them in Buffer before you approve the posts.",
    }),
    defineField({ name: "slug", title: "Key", type: "string", description: "For an article, its address: hubss.com/blog/ followed by this. For a field post, field: and its id; for a library post, lib: and what it was." }),
    defineField({ name: "createdAt", title: "Drafted", type: "datetime" }),
    defineField({
      name: "drafts",
      title: "Drafts waiting in Buffer",
      type: "array",
      of: [
        defineArrayMember({
          name: "bufferDraft",
          title: "Draft",
          type: "object",
          fields: [
            defineField({ name: "channel", title: "Channel", type: "string" }),
            defineField({ name: "service", title: "Network", type: "string" }),
            defineField({ name: "bufferPostId", title: "Buffer post id", type: "string" }),
          ],
          preview: { select: { title: "channel", subtitle: "service" } },
        }),
      ],
    }),
    defineField({
      name: "skipped",
      title: "Skipped",
      type: "array",
      of: [
        defineArrayMember({
          name: "skippedChannel",
          title: "Skipped channel",
          type: "object",
          fields: [
            defineField({ name: "channel", title: "Channel", type: "string" }),
            defineField({ name: "service", title: "Network", type: "string" }),
            defineField({ name: "why", title: "Why", type: "string" }),
          ],
          preview: { select: { title: "channel", subtitle: "why" } },
        }),
      ],
    }),
  ],

  orderings: [{ title: "Newest first", name: "createdDesc", by: [{ field: "createdAt", direction: "desc" }] }],

  preview: {
    select: { title: "title", createdAt: "createdAt", styleCheck: "styleCheck", source: "source" },
    prepare: ({ title, createdAt, styleCheck, source }) => ({
      title,
      subtitle: [
        source && source !== "Article" ? source : null,
        createdAt ? new Date(createdAt).toLocaleDateString("en-CA") : null,
        // styleReport (lib/field-note-drafter.ts) starts a clean check with these words.
        typeof styleCheck === "string" ? (/^STYLE CHECK: clean/.test(styleCheck) ? "Style check clean" : "Style check: sentences to fix") : null,
      ].filter(Boolean).join(" · "),
    }),
  },
});
