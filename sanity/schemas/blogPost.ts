import { defineArrayMember, defineField, defineType } from "sanity";
import { EditIcon, InsertAboveIcon, ThListIcon } from "@sanity/icons";
import { FIELD_NOTE_TYPES } from "../../lib/field-notes-taxonomy";
import { bodyStyle, copyStyle, headingStyle } from "./_shared";

/**
 * A Field Notes post. Since Sep 2026 this is the only copy of the blog: the
 * site reads every post from here (lib/blog.ts) and renders the body with
 * components/blog/PostBody.tsx. The 74 posts written as .mdx files before that
 * were imported by scripts/import-blog-to-sanity.ts and kept, unread by the
 * site, in content/blog-archive/.
 *
 * Publishing an edit to a live post shows on hubss.com within seconds. A NEW
 * post, or a post taken down, takes about five minutes: the site rebuilds
 * itself to add or remove the page (app/api/revalidate/route.ts).
 */
export default defineType({
  name: "blogPost",
  // "Blog post" in Studio (15 Oct 2026); the site calls the blog Insights.
  title: "Blog post",
  type: "document",
  icon: EditIcon,

  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media",   title: "Media" },
    { name: "meta",    title: "Meta & SEO" },
  ],

  fields: [
    // ── Content ─────────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Post title",
      type: "string",
      group: "content",
      description: "The headline, shown at the top of the post and on its card. Keep it punchy, ideally under 70 characters.",
      // Title Case warns here too; whether post titles go sentence case is Doug's call (docs/STYLE.md).
      validation: (r) => [r.required().error("Post title is required"), headingStyle(r)],
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 80 },
      description: "The post's address: hubss.com/blog/<slug>. Click Generate to make it from the title. Don't change it once the post is live: every link to the old address would break.",
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
      name: "category",
      title: "Type",
      type: "string",
      group: "content",
      description: "What kind of piece this is. It decides the badge on the post and which Insights hub lists it.",
      options: {
        list: FIELD_NOTE_TYPES.map((t) => ({ title: t.badge, value: t.label })),
        layout: "radio",
      },
      validation: (r) => r.required().warning("Pick a type, or the site guesses one from the title"),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      group: "content",
      description: "The date printed on the post and used to sort Insights, newest first. The first Publish sets it to that moment (unless it's a future date), so a draft that waited a week still goes out dated today. Change it after publishing if the article needs another date. A date in the future does not hold a post back.",
      options: { timeStep: 60 },
      validation: (r) => r.required().error("Publish date is required"),
    }),
    // Scheduling (19 Oct 2026, lib/project-posts.ts): an article the daily
    // run wrote from a job photos post is saved as a draft that goes live by
    // itself at `scheduledFor` unless someone turns `scheduled` off first.
    // Any draft can be scheduled the same way. A boolean, not a status list:
    // the 77 posts from before show it plainly off.
    defineField({
      name: "scheduled",
      title: "Scheduled",
      type: "boolean",
      group: "content",
      initialValue: false,
      description: "On: it goes live at the time below. Off: it goes live when you press Publish, as always.",
    }),
    defineField({
      name: "scheduledFor",
      title: "Goes live at",
      type: "datetime",
      group: "content",
      options: { timeStep: 60 },
      description: "It goes live at the first morning run on or after this time (10:00 Toronto time; 9:00 after the clocks go back). Change it to any later day to move it.",
      hidden: ({ parent }) => !parent?.scheduled,
      validation: (r) =>
        r.custom((value, ctx) => {
          const scheduled = (ctx.parent as { scheduled?: boolean } | undefined)?.scheduled;
          if (scheduled && !value) return "Say when it should go live, or turn \"Scheduled\" off";
          return true;
        }),
    }),
    // Doug reads first (27 Oct 2026, lib/review-first.ts): 21e8 ticks this
    // once it has read the draft, and the draft then shows, words and photo,
    // on Doug's review page (app/review) until it is published. Ticking it
    // publishes nothing.
    defineField({
      name: "forReview",
      title: "Ready for Doug's review",
      type: "boolean",
      group: "content",
      initialValue: false,
      description: "21e8 ticks this once the draft has been read and checked. It then shows on Doug's review page until it is published. It publishes nothing.",
    }),
    defineField({
      name: "fieldPost",
      title: "Written from the job photos post",
      type: "reference",
      to: [{ type: "fieldPost" }],
      weak: true,
      group: "content",
      readOnly: true,
      hidden: ({ value }) => !value,
      description: "The Job photos post this article was written from.",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "Two or three sentences. Shown on the post's card, as the italic lede at the top of the post, and to Google as the description unless you set one under Meta & SEO.",
      validation: (r) => [r.required().warning("Posts without an excerpt show an empty card").max(300).warning("Keep the excerpt under 300 characters"), copyStyle(r)],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      description: "The article. Use Heading 2 for each section (they become the post's table of contents), Heading 3 inside a section, and the toolbar for bold, italic, links, lists, photos, tables and dividers. The post's title is printed above the body, so don't repeat it here.",
      validation: (r) => bodyStyle(r),
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal paragraph", value: "normal" },
            { title: "Heading 2 (section title)", value: "h2" },
            { title: "Heading 3 (sub-section)", value: "h3" },
            { title: "Heading 4 (detail)", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet list", value: "bullet" },
            { title: "Numbered list", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                title: "Link",
                name: "link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "Web address",
                    type: "url",
                    description: "The full address, e.g. https://hubss.com/products/streetbond. Links to hubss.com stay on the site.",
                    validation: (r) => r.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
                  }),
                  defineField({
                    name: "blank",
                    title: "Open in a new tab",
                    type: "boolean",
                    description: "Worth turning on for links to other websites.",
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          title: "Photo",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describe what's in the photo, e.g. 'Stamped asphalt crosswalk in York Region'. Screen readers read it aloud and Google Images indexes it.",
              validation: (r) => r.required().error("Every photo needs alt text before it can be published (AODA)"),
            }),
            defineField({
              name: "caption",
              title: "Caption (optional)",
              type: "string",
              description: "Printed under the photo.",
            }),
            defineField({ name: "origin", title: "Original file", type: "string", hidden: true, readOnly: true }),
            defineField({ name: "originAsset", title: "Asset the original file was uploaded as", type: "string", hidden: true, readOnly: true }),
          ],
        }),
        defineArrayMember({
          name: "table",
          title: "Table",
          type: "object",
          icon: ThListIcon,
          description: "The first row is the heading row.",
          fields: [
            defineField({
              name: "rows",
              title: "Rows",
              type: "array",
              description: "The first row is the heading row. Wrap words in **double asterisks** to make them bold.",
              of: [
                defineArrayMember({
                  name: "tableRow",
                  title: "Row",
                  type: "object",
                  fields: [
                    defineField({
                      name: "cells",
                      title: "Cells",
                      type: "array",
                      of: [{ type: "string" }],
                    }),
                  ],
                  preview: {
                    select: { cells: "cells" },
                    prepare: ({ cells }) => ({ title: (cells ?? []).join("  |  ") || "Empty row" }),
                  },
                }),
              ],
              validation: (r) => r.min(1).error("A table needs at least one row"),
            }),
          ],
          preview: {
            select: { rows: "rows" },
            prepare: ({ rows }) => ({
              title: `Table: ${(rows?.[0]?.cells ?? []).join(" · ") || "no heading row"}`,
              subtitle: `${Math.max(0, (rows?.length ?? 1) - 1)} rows below the heading`,
            }),
          },
        }),
        defineArrayMember({
          name: "divider",
          title: "Divider",
          type: "object",
          icon: InsertAboveIcon,
          fields: [
            defineField({
              name: "style",
              title: "Style",
              type: "string",
              initialValue: "line",
              readOnly: true,
              hidden: true,
            }),
          ],
          preview: { prepare: () => ({ title: "──────  Divider  ──────" }) },
        }),
      ],
    }),
    defineField({
      name: "editorNotes",
      title: "Notes for the editor",
      type: "text",
      rows: 6,
      group: "content",
      description: "Never shown on the site. 21e8 lists here what the draft is based on and any sentence to check against the HUB Product Portfolio Book before you publish.",
    }),
    defineField({
      name: "readTime",
      title: "Read time (optional)",
      type: "string",
      group: "content",
      description: "Leave blank and the site works it out from the length, at 225 words a minute. Fill it in only to override that, e.g. '6 min read'.",
    }),

    // ── Media ────────────────────────────────────────────────────────────────
    defineField({
      name: "featuredImage",
      title: "Featured photo",
      type: "image",
      group: "media",
      description: "The photo at the top of the post and on its card, and the picture shared on social media. Use HUB's own project photos only. Set the focal point with the crosshair tool.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the photo for screen readers and Google Images, e.g. 'Red brick-pattern crosswalk at a Toronto intersection'.",
          validation: (r) => [r.required().error("Every photo needs alt text before it can be published (AODA)"), copyStyle(r)],
        }),
        // Set by the 2026 import: the /public file this photo came from (see sanity/schemas/_shared.ts).
        defineField({ name: "origin", title: "Original file", type: "string", hidden: true, readOnly: true }),
        defineField({ name: "originAsset", title: "Asset the original file was uploaded as", type: "string", hidden: true, readOnly: true }),
      ],
      validation: (r) => r.required().warning("Without a photo the post gets a stock HUB photo on its card and a plain header"),
    }),

    // ── Meta & SEO ───────────────────────────────────────────────────────────
    defineField({
      name: "keywords",
      title: "Search phrases",
      type: "array",
      group: "meta",
      description: "The searches this post should win, e.g. 'rainbow crosswalk', 'stamped asphalt driveway'. They go into the page's structured data, and posts sharing a phrase are offered to each other as related reading. Press Enter after each one.",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "relatedProducts",
      title: "Systems this post is about",
      type: "array",
      group: "meta",
      description: "They lead the 'Systems in this piece' links under the post. Any other HUB system named in the text is added after them automatically.",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "relatedApplications",
      title: "Applications this post is about",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "application" }] }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      description: "Up to two are shown as badges at the top of the post. Press Enter after each one.",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "seo",
      title: "Search result overrides",
      type: "object",
      group: "meta",
      description: "Optional. Leave blank to use the post title and excerpt, which is right for most posts.",
      fields: [
        defineField({
          name: "metaTitle",
          type: "string",
          title: "Title in search results",
          description: "Shown in the browser tab and as the blue link in Google. Ideal: 50–60 characters.",
          validation: (r) => [r.max(60).warning("Google cuts titles longer than about 60 characters"), copyStyle(r)],
        }),
        defineField({
          name: "metaDescription",
          type: "text",
          title: "Description in search results",
          rows: 2,
          description: "The grey text under the link in Google. Ideal: 140–160 characters.",
          validation: (r) => [r.max(160).warning("Google cuts descriptions longer than about 160 characters"), copyStyle(r)],
        }),
      ],
    }),
  ],

  orderings: [
    { title: "Published, newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],

  preview: {
    select: { title: "title", publishedAt: "publishedAt", category: "category", media: "featuredImage", scheduled: "scheduled", scheduledFor: "scheduledFor" },
    prepare: ({ title, publishedAt, category, media, scheduled, scheduledFor }) => ({
      title,
      subtitle: [
        category,
        scheduled && scheduledFor
          ? `goes live ${new Date(scheduledFor).toLocaleString("en-CA", { timeZone: "America/Toronto", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}`
          : publishedAt ? new Date(publishedAt).toLocaleDateString("en-CA") : "No date yet",
      ].filter(Boolean).join(" · "),
      media,
    }),
  },
});
