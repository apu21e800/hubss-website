import { defineField, defineType } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons";
import { FIELD_NOTE_TYPES } from "../../lib/field-notes-taxonomy";

/**
 * The Field Notes plan: the list of posts HUB wants written.
 *
 * Every Tuesday morning (vercel.json) the AI drafter takes the item marked
 * "Ready" with the highest priority, writes a first draft, and saves it in
 * Blog / Field Notes as an UNPUBLISHED draft (app/api/cron/draft-field-note).
 * Nothing it writes reaches hubss.com until Vern or Doug reviews it and presses
 * Publish. Facts come only from the HUB catalogue and from the brief below.
 */
export default defineType({
  name: "storyIdea",
  title: "Field Notes plan",
  type: "document",
  icon: BulbOutlineIcon,
  // A plan item has no draft/publish step: a change (say, to Ready) counts the
  // moment it's made, so nobody sets Ready, forgets Publish and waits.
  liveEdit: true,

  fields: [
    defineField({
      name: "title",
      title: "Working title",
      type: "string",
      description: "The angle in a line, e.g. 'Stamped asphalt vs interlocking pavers for a driveway'. The drafter writes the final headline.",
      validation: (r) => r.required().error("Give the idea a working title"),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "idea",
      options: {
        list: [
          { title: "Idea: not ready to draft", value: "idea" },
          { title: "Ready: draft it next", value: "ready" },
          { title: "Drafted: waiting in Blog / Field Notes", value: "drafted" },
          { title: "Published", value: "published" },
          { title: "Not doing it", value: "dropped" },
        ],
        layout: "radio",
      },
      description: "Set it to Ready and the drafter picks it up on Tuesday morning. It sets Drafted itself.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      initialValue: 2,
      options: {
        list: [
          { title: "1: next", value: 1 },
          { title: "2: soon", value: 2 },
          { title: "3: some time", value: 3 },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    defineField({
      name: "searchPhrase",
      title: "Search phrase to win",
      type: "string",
      description: "What a specifier would type into Google, e.g. 'decorative crosswalk cost'. It goes in the headline, the opening and one heading.",
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: FIELD_NOTE_TYPES.map((t) => ({ title: t.label, value: t.label })),
        layout: "radio",
      },
    }),
    defineField({
      name: "systems",
      title: "Systems",
      type: "array",
      description: "The HUB systems the post is about. The drafter reads their catalogue pages, and the first one's photo becomes the draft's stand-in photo.",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "applications",
      title: "Applications",
      type: "array",
      of: [{ type: "reference", to: [{ type: "application" }] }],
    }),
    defineField({
      name: "brief",
      title: "Brief",
      type: "text",
      rows: 6,
      description: "What the post must cover, and any real facts to use: the project, the city, the year, what the client needed, what was installed. The drafter treats what you write here as true and invents nothing else, so a project it doesn't know about has to be described here.",
    }),
    defineField({
      name: "draftSlug",
      title: "Draft",
      type: "string",
      readOnly: true,
      description: "Set by the drafter: the slug of the draft it wrote.",
    }),
    defineField({
      name: "draftedAt",
      title: "Drafted",
      type: "datetime",
      readOnly: true,
    }),
  ],

  orderings: [
    { title: "Next to draft", name: "queue", by: [{ field: "priority", direction: "asc" }, { field: "_createdAt", direction: "asc" }] },
  ],

  preview: {
    select: { title: "title", status: "status", phrase: "searchPhrase", priority: "priority" },
    prepare: ({ title, status, phrase, priority }) => ({
      title,
      subtitle: [
        { idea: "Idea", ready: `Ready (priority ${priority ?? 2})`, drafted: "Drafted", published: "Published", dropped: "Not doing" }[status as string] ?? status,
        phrase,
      ].filter(Boolean).join(" · "),
    }),
  },
});
