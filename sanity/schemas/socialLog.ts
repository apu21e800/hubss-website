import { defineArrayMember, defineField, defineType } from "sanity";
import { ShareIcon } from "@sanity/icons";

/**
 * What the daily social drafter did for one Insights article
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
  title: "Social drafts",
  type: "document",
  icon: ShareIcon,
  readOnly: true,

  fields: [
    defineField({ name: "title", title: "Article", type: "string" }),
    defineField({
      name: "styleCheck",
      title: "Style check",
      type: "text",
      rows: 6,
      description: "Sentences in the Buffer drafts that still have an em dash or another machine tell after the drafter's own rewrite. Fix them in Buffer before you approve the posts.",
    }),
    defineField({ name: "slug", title: "Article address", type: "string", description: "The article is at hubss.com/blog/ followed by this." }),
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
    select: { title: "title", createdAt: "createdAt", styleCheck: "styleCheck" },
    prepare: ({ title, createdAt, styleCheck }) => ({
      title,
      subtitle: [
        createdAt ? new Date(createdAt).toLocaleDateString("en-CA") : null,
        // styleReport (lib/field-note-drafter.ts) starts a clean check with these words.
        typeof styleCheck === "string" ? (/^STYLE CHECK: clean/.test(styleCheck) ? "Style check clean" : "Style check: sentences to fix") : null,
      ].filter(Boolean).join(" · "),
    }),
  },
});
